"use client";

import { useState, useEffect } from "react";

export default function Home(){

const [repo,setRepo] = useState("");
const [loading,setLoading] = useState(false);
const [status,setStatus] = useState("");
const [result,setResult] = useState(null);

async function analyzeRepo(){

if(!repo) return;

setLoading(true);
setResult(null);

setStatus("🧠 Planner Agent thinking...");

setTimeout(()=>setStatus("🔍 Fetching repository files..."),1000);
setTimeout(()=>setStatus("⚙️ Extracting technologies..."),2000);
setTimeout(()=>setStatus("📊 Evaluating architecture..."),3000);

const res = await fetch("/api/evaluate",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({repo})
});

const data = await res.json();

setResult(data);
setLoading(false);
setStatus("✅ Analysis complete");

}

return(

<div className="min-h-screen bg-black text-white relative overflow-hidden">

<NeuralParticles/>

<div className="max-w-6xl mx-auto p-10 relative z-10">

<h1 className="text-4xl font-bold mb-6 text-cyan-400">
Neuroflow Repo Analyzer
</h1>

<div className="flex gap-4 mb-8">

<input
value={repo}
onChange={(e)=>setRepo(e.target.value)}
placeholder="Paste GitHub repository URL..."
className="flex-1 p-3 bg-gray-900 border border-cyan-500 rounded"
/>

<button
onClick={analyzeRepo}
className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded font-semibold"
>
Analyze
</button>

</div>

{loading && (
<>
<div className="mb-4 text-cyan-300">{status}</div>
<AgentGraph/>
</>
)}

{result && (

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<Card title="AI Project Analysis">

<p><b>Purpose:</b> {result.analysis?.purpose}</p>
<p><b>System Type:</b> {result.analysis?.system_type}</p>
<p><b>Complexity:</b> {result.analysis?.architecture_complexity}</p>

</Card>

<Card title="Technologies & Skills">

{result.skills?.length>0 ?(

<ul>
{result.skills.map((s,i)=>(
<li key={i}>{s}</li>
))}
</ul>

):(

<p>No technologies detected</p>

)}

</Card>

<Card title="Repository Architecture">

{result.analysis?.core_modules?.length>0 ?(

<ul>
{result.analysis.core_modules.map((m,i)=>(
<li key={i}>{m}</li>
))}
</ul>

):(

<p>No modules detected</p>

)}

</Card>

<Card title="Developer Insights">

<p><b>Difficulty:</b> {result.score?.difficulty_level}</p>

<ul>
{result.score?.recommended_roles?.map((r,i)=>(
<li key={i}>{r}</li>
))}
</ul>

</Card>

</div>

)}

</div>

</div>

);

}

function Card({title,children}){

return(

<div className="bg-gray-900/60 backdrop-blur border border-cyan-500 p-6 rounded-lg shadow-lg">

<h2 className="text-xl font-semibold mb-4 text-cyan-400">
{title}
</h2>

{children}

</div>

);

}

function NeuralParticles(){

const [particles,setParticles] = useState([]);

useEffect(()=>{

const p = Array.from({length:40}).map(()=>({
x:Math.random()*100,
y:Math.random()*100
}));

setParticles(p);

},[]);

return(

<div className="absolute inset-0 overflow-hidden pointer-events-none">

{particles.map((p,i)=>(

<div
key={i}
className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
style={{
left:`${p.x}%`,
top:`${p.y}%`
}}
/>

))}

</div>

);

}

function AgentGraph(){

const nodes = [
{ id:"planner",x:50,y:10,label:"Planner"},
{ id:"repo",x:20,y:50,label:"Repo Agent"},
{ id:"code",x:80,y:50,label:"Code Agent"},
{ id:"skill",x:35,y:85,label:"Skill Agent"},
{ id:"score",x:65,y:85,label:"Score Agent"}
];

const edges = [
["planner","repo"],
["planner","code"],
["repo","skill"],
["code","skill"],
["skill","score"]
];

return(

<div className="relative h-64 border border-cyan-500 rounded mb-6 bg-black/40">

<svg className="absolute inset-0 w-full h-full">

{edges.map((e,i)=>{

const a = nodes.find(n=>n.id===e[0]);
const b = nodes.find(n=>n.id===e[1]);

return(

<g key={i}>

<line
x1={`${a.x}%`}
y1={`${a.y}%`}
x2={`${b.x}%`}
y2={`${b.y}%`}
stroke="cyan"
strokeOpacity="0.25"
/>

<DataPacket a={a} b={b}/>

</g>

);

})}

</svg>

{nodes.map((n,i)=>(

<div
key={i}
className="absolute bg-cyan-500 text-black text-xs px-2 py-1 rounded animate-pulse"
style={{
left:`${n.x}%`,
top:`${n.y}%`,
transform:"translate(-50%,-50%)"
}}
>
{n.label}
</div>

))}

</div>

);

}

function DataPacket({a,b}){

const [t,setT] = useState(0);

useEffect(()=>{

const interval = setInterval(()=>{

setT(v=> (v+0.02)%1);

},50);

return ()=>clearInterval(interval);

},[]);

const x = a.x + (b.x-a.x)*t;
const y = a.y + (b.y-a.y)*t;

return(

<circle
cx={`${x}%`}
cy={`${y}%`}
r="3"
fill="cyan"
/>

);

}