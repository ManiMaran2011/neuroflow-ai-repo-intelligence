"use client";

import { useState, useEffect } from "react";

export default function Home(){

const [repoUrl,setRepoUrl] = useState("");
const [result,setResult] = useState(null);
const [loading,setLoading] = useState(false);
const [steps,setSteps] = useState([]);

const agentSteps = [
"🧠 Planner Agent planning analysis...",
"📦 Fetching GitHub repository...",
"🔍 Reading repository files...",
"⚙️ Extracting technologies...",
"🧠 AI analyzing architecture...",
"📊 Evaluating developer portfolio...",
"✅ Analysis complete"
];

async function evaluateRepo(){

if(!repoUrl) return;

setLoading(true);
setResult(null);
setSteps([]);

for(let i=0;i<agentSteps.length;i++){

await new Promise(r => setTimeout(r,700));

setSteps(prev => [...prev,agentSteps[i]]);

}

try{

const res = await fetch("/api/evaluate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({repo:repoUrl})
});

const data = await res.json();

setResult(data);

}catch(err){

console.log(err);

}

setLoading(false);

}

return(

<div className="min-h-screen bg-black text-white relative overflow-hidden">

<NeuralParticles/>

<div className="max-w-6xl mx-auto p-10">

<h1 className="text-4xl font-bold text-cyan-400 mb-2">
Neuroflow AI
</h1>

<p className="text-gray-400 mb-10">
AI Powered GitHub Repository Intelligence
</p>

<div className="flex gap-4 mb-12">

<input
className="flex-1 p-4 bg-black/40 border border-cyan-500/40 rounded-lg"
placeholder="Paste GitHub repository URL"
value={repoUrl}
onChange={(e)=>setRepoUrl(e.target.value)}
/>

<button
onClick={evaluateRepo}
className="bg-cyan-500 text-black px-6 py-4 rounded-lg font-semibold hover:bg-cyan-400"
>
Analyze
</button>

</div>

{loading && (

<div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 mb-10">

<h3 className="text-cyan-400 mb-4">
AI Agent Reasoning
</h3>

<div className="space-y-2 text-sm">

{steps.map((step,index)=>(
<div key={index} className="animate-pulse text-cyan-200">
{step}
</div>
))}

</div>

</div>

)}

{result && (

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{/* PROJECT ANALYSIS */}

<div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6">

<h3 className="text-cyan-400 mb-4">
AI Project Analysis
</h3>

<p className="text-sm mb-2">
<b>Purpose:</b>
<br/>
{result.analysis?.purpose || "Software Project"}
</p>

<p className="text-sm mb-2">
<b>Project Category:</b>
<br/>
{result.analysis?.project_category || result.analysis?.system_type}
</p>

<p className="text-sm">
<b>Architecture Complexity:</b>
<br/>
{result.analysis?.architecture_complexity || "Moderate"}
</p>

</div>

{/* SKILLS */}

<div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6">

<h3 className="text-cyan-400 mb-4">
Technologies & Skills
</h3>

<div className="flex flex-wrap gap-2">

{result.skills && result.skills.length > 0 ? (

result.skills.map((skill,index)=>(
<span
key={index}
className="px-3 py-1 text-xs bg-cyan-500/20 border border-cyan-500/40 rounded-full"
>
{skill}
</span>
))

):(

<span className="text-gray-400 text-sm">
No skills detected
</span>

)}

</div>

</div>

{/* REPO INSIGHTS */}

<div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6">

<h3 className="text-cyan-400 mb-4">
Repository Insights
</h3>

<p className="text-sm mb-3">
<b>Difficulty Level:</b>
<br/>
{result.score?.difficulty_level || "Intermediate"}
</p>

<p className="text-sm">
<b>Suggested Roles:</b>
</p>

<ul className="list-disc ml-4 text-sm">

{result.score?.recommended_roles?.map((role,index)=>(
<li key={index}>{role}</li>
))}

</ul>

</div>

</div>

)}

</div>

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

<div className="absolute inset-0 overflow-hidden">

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