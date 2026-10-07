import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(line => line.includes('=')).map(line => { const i=line.indexOf('='); return [line.slice(0,i),line.slice(i+1).trim()]; }));
const url=env.VITE_SUPABASE_URL; const key=env.VITE_SUPABASE_ANON_KEY;
const headers={ apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json' };
const id=randomUUID();
const input={submissionId:id,fullName:'MyAPI migration smoke test',company:'Automated verification',phone:'0812345678',email:'migration-smoke@example.invalid',website:'',courier:'',trap:''};
console.log(JSON.stringify({testId:id}));
for(let i=0;i<2;i++) {
 const r=await fetch(`${url}/functions/v1/myapi-submit-contact`,{method:'POST',headers,body:JSON.stringify(input)});
 const body=await r.json(); console.log(JSON.stringify({intakeAttempt:i+1,status:r.status,body}));
 if(r.status!==200||body.accepted!==true) process.exitCode=1;
}
const denied=await fetch(`${url}/rest/v1/myapi_contact_leads?select=id`,{headers});
console.log(JSON.stringify({anonymousReadStatus:denied.status}));
if(![401,403].includes(denied.status)) process.exitCode=1;
const worker=await fetch(`${url}/functions/v1/myapi-notify-contacts`,{method:'POST',headers,body:'{}'});
console.log(JSON.stringify({anonymousWorkerStatus:worker.status}));
if(worker.status!==401) process.exitCode=1;
const settings=await fetch(`${url}/auth/v1/settings`,{headers});
const auth=await settings.json();console.log(JSON.stringify({googleEnabled:auth.external?.google,emailEnabled:auth.external?.email}));
