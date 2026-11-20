import test from 'node:test';
import assert from 'node:assert/strict';
import {options,target,present,retrieve,ReaderRpc} from '../skills/codex-thread-reader/scripts/read-thread.mjs';
const id='00000000-0000-4000-8000-000000000001';
const opt=()=>options(['--thread',id]);
const thread={id,name:'Synthetic test',status:{type:'notLoaded'}};
const page={data:[{id:'new',status:'completed',items:[{type:'userMessage',content:[{type:'text',text:'What is the latest decision?'}]},{type:'agentMessage',text:'Latest decision: keep the signed source.'},{type:'reasoning',text:'PRIVATE_REASONING'},{type:'commandExecution',aggregatedOutput:'TOOL_SECRET'}]},{id:'old',status:'completed',items:[{type:'agentMessage',text:'Earlier proposal was superseded.'}]}],nextCursor:'older'};
test('accepts local links; blocks remote or malformed targets before RPC',()=>{
 assert.equal(target('thread://'+id+'?hostId=local'),id);
 for(const value of ['thread://'+id+'?hostId=remote','thread://'+id+'?hostId=local&hostId=other','https://'+id,'thread://'+id+'/other',id+';whoami'])assert.throws(()=>target(value));
});
test('bounds input and requires a single target or a narrow title search',()=>{
 assert.throws(()=>options(['--thread',id,'--search','title']));
 assert.throws(()=>options(['--search',' ']));
 assert.throws(()=>options(['--thread',id,'--limit','100']));
 assert.throws(()=>options(['--thread',id,'--max-chars','Infinity']));
 assert.throws(()=>options(['--delete',id]));
});
test('returns chronological visible evidence with source and incomplete coverage',()=>{
 const out=present(thread,page,opt(),'2026-10-20T00:00:00Z');
 assert.equal(out.messages[0].turnId,'old'); assert.equal(out.messages.at(-1).role,'assistant');
 assert.equal(out.scope.completeHistory,false); assert.equal(out.scope.hasOlderTurns,true);
 assert.equal(out.source.threadId,id); assert(!JSON.stringify(out).includes('PRIVATE_REASONING')); assert(!JSON.stringify(out).includes('TOOL_SECRET'));
});
test('empty keyword result does not imply absence in the chat',()=>{
 const out=present(thread,page,{...opt(),query:'unseen phrase'});
 assert.equal(out.messages.length,0); assert.equal(out.scope.queryScope,'this page only'); assert.equal(out.scope.nextCursor,'older'); assert.equal(out.scope.completeHistory,false);
});
test('phrase filter retains adjacent context and later correction',()=>{
 const out=present(thread,page,{...opt(),query:'signed source'});
 assert.equal(out.messages.length,2); assert.equal(out.messages[0].role,'user');
});
test('JSON output respects budget even for escaped text and enormous messages',()=>{
 for(const text of ['x'.repeat(30000),'\n"\\'.repeat(10000),'עברית'.repeat(6000)]) {
  const out=present(thread,{data:[{id:'huge',items:[{type:'agentMessage',text}]}],nextCursor:null},{...opt(),maxChars:1500,messageChars:30000});
  assert(JSON.stringify(out).length<=1500); assert.equal(out.messages.length,1); assert(out.messages[0].text.length>=100); assert.equal(out.messages[0].truncated,true); assert.equal(out.scope.completeHistory,false);
 }
});
test('omissions and truncations are explicit and newest evidence survives',()=>{
 const items=Array.from({length:30},(_,i)=>({type:'agentMessage',text:String(i)+':'+ 'x'.repeat(500)}));
 const out=present(thread,{data:[{id:'many',items}],nextCursor:null},{...opt(),maxChars:2000});
 assert(out.messages.at(-1).text.startsWith('29:')); assert.equal(out.scope.omittedMessages,30-out.messages.length); assert.equal(out.scope.completeHistory,false);
});
test('completeHistory is true only for entirely visible unfiltered history',()=>{
 assert.equal(present(thread,{...page,nextCursor:null},opt()).scope.completeHistory,true);
 assert.equal(present(thread,{...page,nextCursor:null},{...opt(),cursor:'previous'}).scope.completeHistory,false);
});
test('retrieve uses bounded pagination, no legacy full-history request',async()=>{
 const calls=[]; const rpc={request:async(method,params)=>{calls.push({method,params}); return method==='thread/read'?{thread}:page;}};
 await retrieve(rpc,{...opt(),cursor:'older'});
 assert.deepEqual(calls.map(c=>c.method),['thread/read','thread/turns/list']);
 assert(!('includeTurns' in calls[0].params)); assert.equal(calls[1].params.limit,3); assert.equal(calls[1].params.cursor,'older'); assert.equal(calls[1].params.itemsView,'full');
});
test('mismatched thread identity fails before history is read',async()=>{
 let calls=0; const rpc={request:async()=>{calls++;return {thread:{id:'other'}};}};
 await assert.rejects(retrieve(rpc,opt()),/THREAD_ID_MISMATCH/); assert.equal(calls,1);
});
test('title search is bounded and returns no transcript preview',async()=>{
 let sent; const rpc={request:async(method,params)=>{sent={method,params};return {data:[{...thread,preview:'PRIVATE_PREVIEW'}],nextCursor:'more'};}};
 const out=await retrieve(rpc,options(['--search','Synthetic','--limit','20']));
 assert.equal(sent.method,'thread/list'); assert.equal(sent.params.limit,5); assert.equal(out.scope.partial,true); assert(!JSON.stringify(out).includes('PRIVATE_PREVIEW'));
});
test('RPC allowlist rejects writes without needing a process',async()=>{
 for(const method of ['turn/start','thread/resume','thread/archive','thread/delete','thread/inject_items'])await assert.rejects(ReaderRpc.prototype.request.call({},method,{}),/READ_ONLY_METHOD_REJECTED/);
});
