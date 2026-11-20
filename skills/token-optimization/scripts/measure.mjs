import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const fields=['input','cached_input','uncached_input','cache_write_input','ordinary_input','output','reasoning_output','total'];
const safe=x=>Number.isSafeInteger(x)&&x>=0;
const empty=()=>Object.fromEntries(fields.map(k=>[k,null]));
export function measure(ledger){
  if(ledger.workflows){
    const workflows=Object.fromEntries(Object.entries(ledger.workflows).map(([name,value])=>[name,measure(value)]));
    return {status:Object.values(workflows).some(x=>x.status==='INVALID')?'INVALID':'OK',workflows};
  }
  if(!Array.isArray(ledger.attempts))throw Error('attempts array required');
  const errors=[],warnings=[],seen=new Set();
  const records=ledger.attempts.map(a=>{
    const issues=[];let usage=a.usage,valid=true;
    if(typeof a.id!=='string'||!a.id||seen.has(a.id))issues.push('Missing/duplicate attempt id');
    seen.add(a.id);
    if(a.scope!=='exclusive')issues.push('Unresolved overlapping or unspecified accounting scope');
    if(a.snapshots){
      if(a.usage||a.snapshot_semantics!=='cumulative'||!Array.isArray(a.snapshots)||!a.snapshots.length||
        a.snapshots.some((x,i)=>!safe(x.sequence)||(i>0&&x.sequence<=a.snapshots[i-1].sequence)))issues.push('Invalid/ambiguous cumulative snapshots');
      else usage=a.snapshots.at(-1).usage;
    }
    let values=empty();
    if(usage!=null){
      if(a.format==='codex-app-server'){
        const u=usage.total??usage;
        values={input:u.inputTokens??null,cached_input:u.cachedInputTokens??null,cache_write_input:u.cacheWriteInputTokens??null,
          output:u.outputTokens??null,reasoning_output:u.reasoningOutputTokens??null,total:u.totalTokens??null};
      }else if(a.format==='responses'){
        values={input:usage.input_tokens??null,cached_input:usage.input_tokens_details?.cached_tokens??null,
          cache_write_input:usage.input_tokens_details?.cache_write_tokens??null,output:usage.output_tokens??null,
          reasoning_output:usage.output_tokens_details?.reasoning_tokens??null,total:usage.total_tokens??null};
      }else issues.push('Unsupported telemetry schema; reviewed adapter needed');
      for(const [k,v]of Object.entries(values))if(v!==null&&!safe(v))issues.push(`Invalid counter ${k}`);
      if(!issues.length){
        const {input:i,cached_input:c,cache_write_input:w,output:o,reasoning_output:r,total:t}=values;
        if(i!==null&&c!==null&&c>i)issues.push('Cached input exceeds input');
        if(i!==null&&w!==null&&w>i)issues.push('Cache writes exceed input');
        if(i!==null&&c!==null&&w!==null&&c+w>i)issues.push('Input subsets overlap/exceed input');
        if(o!==null&&r!==null&&r>o)issues.push('Reasoning exceeds output');
        if(i!==null&&o!==null&&t!==null&&t!==i+o)issues.push('Reported total differs from input+output');
        values.uncached_input=i!==null&&c!==null?i-c:null;
        values.ordinary_input=i!==null&&c!==null&&w!==null?i-c-w:null;
        values.total=t??(i!==null&&o!==null?i+o:null);
      }
    }else warnings.push(`${a.id}: usage missing, not zero`);
    if(issues.length){valid=false;values=empty();errors.push(...issues.map(x=>`${a.id}: ${x}`));}
    values={...empty(),...values};
    const auxiliary={};
    for(const k of ['tools','retries','duration_ms','human_corrections']){
      const v=a[k]??null;
      if(v!==null&&!safe(v)){errors.push(`${a.id}: Invalid ${k}`);auxiliary[k]=null;}else auxiliary[k]=v;
    }
    let estimate=null;const cost_missing=[];
    if(a.runtime==='codex-subscription')cost_missing.push('Subscription consumption is not API billing');
    else if(a.billing_basis!=='openai-api')cost_missing.push('OpenAI API billing basis not established');
    else{
      const rate=ledger.rates?.[a.rate_key];
      if(!rate)cost_missing.push('Applicable rate missing');
      else{
        for(const key of ['model','tier','context_regime','region'])if(!a[key]||a[key]!==rate[key])cost_missing.push(`Rate applicability mismatch: ${key}`);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(a.usage_date??'')||a.usage_date!==rate.date)cost_missing.push('Rate/usage date not verified');
        if(!/^https:\/\/(developers\.openai\.com|platform\.openai\.com)\//.test(rate.source??''))cost_missing.push('Official rate source missing');
        if(a.rate_scope!=='uniform')cost_missing.push('Uniform per-request rate regime not established');
        if(!safe(a.request_input_max)||!safe(rate.max_request_input)||a.request_input_max>rate.max_request_input)cost_missing.push('Request/context price threshold not established');
        for(const k of ['input','cached','write','output'])if(typeof rate[k]!=='number'||!Number.isFinite(rate[k])||rate[k]<0)cost_missing.push(`Invalid rate ${k}`);
        if(a.non_token_fees_usd==null||typeof a.non_token_fees_usd!=='number'||!Number.isFinite(a.non_token_fees_usd)||a.non_token_fees_usd<0)cost_missing.push('Tool/service fees incomplete');
        if(['ordinary_input','cached_input','cache_write_input','output'].some(k=>values[k]===null))cost_missing.push('Token price categories incomplete');
        if(!valid)cost_missing.push('Invalid usage');
        if(!cost_missing.length)estimate=(values.ordinary_input*rate.input+values.cached_input*rate.cached+values.cache_write_input*rate.write+values.output*rate.output)/1e6+a.non_token_fees_usd;
      }
    }
    return {id:a.id,model:a.model??null,runtime:a.runtime??null,accepted:typeof a.accepted==='boolean'?a.accepted:null,
      ...values,...auxiliary,estimated_api_usd:estimate,actual_billed_usd:null,cost_missing,issues};
  });
  const metrics={};
  for(const key of [...fields,'tools','retries','duration_ms','human_corrections','estimated_api_usd']){
    const known=records.filter(r=>r[key]!==null),subtotal=known.reduce((s,r)=>s+r[key],0);
    metrics[key]={value:records.length&&known.length===records.length?subtotal:null,subtotal,coverage:`${known.length}/${records.length}`};
  }
  const accepted=safe(ledger.accepted_results)?ledger.accepted_results:null;
  if(ledger.accepted_results!=null&&accepted===null)errors.push('Invalid accepted_results');
  const wall=ledger.workflow_duration_ms??null;
  if(wall!==null&&!safe(wall))errors.push('Invalid workflow_duration_ms');
  return {status:errors.length?'INVALID':'OK',records,metrics,accepted_results:accepted,
    tokens_per_accepted_result:accepted>0&&metrics.total.value!==null?metrics.total.value/accepted:null,
    estimated_api_usd_per_accepted_result:accepted>0&&metrics.estimated_api_usd.value!==null?metrics.estimated_api_usd.value/accepted:null,
    workflow_duration_ms:safe(wall)?wall:null,actual_billed_usd:null,errors,warnings,
    notes:'Subtotals are measured/estimated coverage only; missing is not zero. Cached/write input and reasoning output are subsets. Summed attempt duration is not parallel workflow wall time. Price evidence/applicability are caller attestations, not live verified by this offline helper.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  try{const l=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''));const r=measure(l);process.stdout.write(JSON.stringify(r,null,2)+'\n');if(r.status==='INVALID')process.exitCode=1;}
  catch(e){process.stderr.write(e.message+'\n');process.exitCode=1;}
}
