import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const ALLOWED = new Set(['initialize','thread/read','thread/turns/list','thread/list','skills/list']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const crop = (text, max) => text.length <= max ? text : text.slice(0, max - 1) + '\u2026';
export function target(value) {
  if (UUID.test(value)) return value.toLowerCase();
  let url;
  try { url = new URL(value); } catch { throw Error('INVALID_THREAD: use a UUID or thread://UUID?hostId=local'); }
  if (url.protocol !== 'thread:' || !UUID.test(url.hostname) || !['','/'].includes(url.pathname) || url.username || url.password || url.port || url.hash) throw Error('INVALID_THREAD_LINK');
  const hosts = url.searchParams.getAll('hostId');
  if (hosts.some(host => host !== 'local')) throw Error('REMOTE_HOST_UNSUPPORTED: use native tools on the referenced host');
  if ([...url.searchParams.keys()].some(key => key !== 'hostId')) throw Error('UNSUPPORTED_THREAD_LINK_PARAMETER');
  return url.hostname.toLowerCase();
}
export function options(argv) {
  const opt = {limit:3,maxChars:8000,messageChars:2000,archived:false,binary:'codex'};
  const names = {'--thread':'thread','--search':'search','--query':'query','--cursor':'cursor','--binary':'binary','--limit':'limit','--max-chars':'maxChars','--message-chars':'messageChars'};
  for (let i=0;i<argv.length;i++) {
    if (argv[i] === '--archived') { opt.archived=true; continue; }
    const key=names[argv[i]];
    if (!key || i+1===argv.length) throw Error('INVALID_ARGUMENT: '+argv[i]);
    opt[key]=argv[++i];
  }
  if (!!opt.thread === !!opt.search) throw Error('SUPPLY_EXACTLY_ONE: --thread or --search');
  for (const [key,min,max] of [['limit',1,20],['maxChars',1500,60000],['messageChars',200,30000]]) {
    opt[key]=Number(opt[key]);
    if (!Number.isInteger(opt[key]) || opt[key]<min || opt[key]>max) throw Error('INVALID_RANGE: '+key);
  }
  if (opt.thread) opt.thread=target(opt.thread);
  if (opt.search && (!opt.search.trim() || opt.search.length>200 || opt.cursor || opt.query)) throw Error('INVALID_TITLE_SEARCH');
  if (opt.thread && opt.archived) throw Error('ARCHIVED_FLAG_IS_FOR_TITLE_SEARCH');
  if (opt.query?.length>200 || opt.cursor?.length>4096) throw Error('INPUT_TOO_LONG');
  return opt;
}

// Dedicated read-only RPC client: no resume/start/write methods or server requests.
export class ReaderRpc {
  constructor(binary, {home=process.env.CODEX_HOME, cwd=process.cwd()}={}) {
    const env={...process.env};
    if (home) env.CODEX_HOME=home;
    this.pending=new Map(); this.nextId=1; this.buffer=''; this.closed=false;
    this.child=spawn(binary,['app-server','--listen','stdio://'],{cwd,env,windowsHide:true,stdio:['pipe','pipe','pipe']});
    this.child.stdout.setEncoding('utf8');
    this.child.stdout.on('data',chunk=>{
      this.buffer+=chunk;
      if (this.buffer.length>32*1024*1024) return this.close(Error('RPC_RESPONSE_TOO_LARGE: reduce --limit'));
      let end;
      while ((end=this.buffer.indexOf('\n'))>=0) {
        const line=this.buffer.slice(0,end); this.buffer=this.buffer.slice(end+1);
        if (!line.trim()) continue;
        let msg;
        try { msg=JSON.parse(line); } catch { this.close(Error('RPC_INVALID_JSON')); return; }
        if (msg.id !== undefined && msg.method) {
          this.child.stdin.write(JSON.stringify({id:msg.id,error:{code:-32601,message:'Read-only reader declines server requests'}})+'\n');
        } else if (msg.id !== undefined) {
          const pending=this.pending.get(msg.id);
          if (!pending) continue;
          clearTimeout(pending.timer); this.pending.delete(msg.id);
          if (msg.error) pending.reject(Error('RPC_'+msg.error.code+': '+msg.error.message));
          else pending.resolve(msg.result);
        }
      }
    });
    this.child.stderr.on('data',()=>{}); // Never mix runtime diagnostics with retrieved content.
    this.child.stdin.on('error',()=>this.close(Error('RPC_DISCONNECTED')));
    this.child.on('error',e=>this.close(Error('RUNTIME_UNAVAILABLE: '+e.code)));
    this.child.on('exit',()=>this.close(Error('RPC_DISCONNECTED')));
  }
  request(method, params={}) {
    if (!ALLOWED.has(method)) return Promise.reject(Error('READ_ONLY_METHOD_REJECTED: '+method));
    if (this.closed) return Promise.reject(Error('RPC_CLOSED'));
    const id=this.nextId++;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>this.close(Error('RPC_TIMEOUT: '+method)),20000);
      this.pending.set(id,{resolve,reject,timer});
      this.child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');
    });
  }
  async initialize() {
    const info=await this.request('initialize',{clientInfo:{name:'codex_thread_reader',version:'1.0.0'},capabilities:{experimentalApi:true}});
    this.child.stdin.write(JSON.stringify({method:'initialized',params:{}})+'\n');
    return info;
  }
  close(error=Error('RPC_CLOSED')) {
    if (this.closed) return;
    this.closed=true;
    for (const p of this.pending.values()) { clearTimeout(p.timer); p.reject(error); }
    this.pending.clear(); this.child.kill();
  }
}

export function visible(turns) {
  const messages=[];
  for (const turn of [...turns].reverse()) for (const item of turn.items||[]) {
    let role,text;
    if (item.type==='agentMessage') { role='assistant'; text=item.text; }
    if (item.type==='userMessage') { role='user'; text=(item.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n'); }
    if (typeof text==='string' && text.trim()) messages.push({turnId:turn.id,turnStatus:turn.status,role,text});
  }
  return messages;
}

export function present(thread, page, opt, retrievedAt=new Date().toISOString()) {
  const all=visible(page.data||[]);
  let selected=all;
  if (opt.query) {
    const matches=new Set();
    all.forEach((m,i)=>{if(m.text.toLowerCase().includes(opt.query.toLowerCase())) for(const j of [i-1,i,i+1]) if(j>=0 && j<all.length) matches.add(j);});
    selected=all.filter((_,i)=>matches.has(i));
  }
  const out={source:{transport:'codex-app-server',hostId:'local',threadId:thread.id,name:crop(thread.name||'',180),retrievedAt,updatedAt:thread.updatedAt,status:thread.status},
    scope:{order:'chronological within newest-first page',pageTurns:(page.data||[]).length,visibleMessagesInPage:all.length,query:opt.query||null,queryScope:opt.query?'this page only':null,startedAtOlderCursor:!!opt.cursor,nextCursor:page.nextCursor||null,hasOlderTurns:!!page.nextCursor,omittedMessages:all.length-selected.length,truncatedMessages:0,completeHistory:false},messages:[]};
  // Keep the newest evidence when the output budget cannot fit the entire page.
  for (const msg of [...selected].reverse()) {
    const text=crop(msg.text,opt.messageChars);
    const entry={...msg,text,truncated:text!==msg.text};
    out.messages.unshift(entry);
    if (JSON.stringify(out).length>opt.maxChars-180) {
      let lo=0,hi=entry.text.length;
      entry.truncated=true;
      while(lo<hi) {
        const mid=Math.ceil((lo+hi)/2); entry.text=crop(text,mid);
        if(JSON.stringify(out).length<=opt.maxChars-180)lo=mid; else hi=mid-1;
      }
      if(lo>=100)entry.text=crop(text,lo); else out.messages.shift();
      break;
    }
  }
  out.scope.omittedMessages=all.length-out.messages.length;
  out.scope.truncatedMessages=out.messages.filter(m=>m.truncated).length;
  out.scope.completeHistory=!opt.cursor&&!page.nextCursor&&!opt.query&&!out.scope.omittedMessages&&!out.scope.truncatedMessages;
  if (JSON.stringify(out).length>opt.maxChars) throw Error('OUTPUT_METADATA_EXCEEDS_BUDGET');
  return out;
}

export async function retrieve(rpc,opt) {
  if (opt.search) {
    const page=await rpc.request('thread/list',{searchTerm:opt.search,limit:Math.min(opt.limit,5),archived:opt.archived});
    const out={source:{transport:'codex-app-server',hostId:'local',retrievedAt:new Date().toISOString()},scope:{titleSearch:opt.search,archived:opt.archived,hasMore:!!page.nextCursor,partial:!!page.nextCursor},matches:(page.data||[]).map(t=>({threadId:t.id,name:crop(t.name||'',180),updatedAt:t.updatedAt,status:t.status}))};
    if(JSON.stringify(out).length>opt.maxChars)throw Error('SEARCH_OUTPUT_EXCEEDS_BUDGET');
    return out;
  }
  const {thread}=await rpc.request('thread/read',{threadId:opt.thread});
  if (thread.id!==opt.thread) throw Error('THREAD_ID_MISMATCH');
  const page=await rpc.request('thread/turns/list',{threadId:opt.thread,limit:opt.limit,sortDirection:'desc',itemsView:'full',...(opt.cursor?{cursor:opt.cursor}:{})});
  return present(thread,page,opt);
}

async function main() {
  let rpc;
  try {
    const opt=options(process.argv.slice(2));
    rpc=new ReaderRpc(opt.binary); await rpc.initialize();
    console.log(JSON.stringify(await retrieve(rpc,opt)));
  } catch(error) { console.log(JSON.stringify({error:error.message})); process.exitCode=1; }
  finally { rpc?.close(); }
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await main();
