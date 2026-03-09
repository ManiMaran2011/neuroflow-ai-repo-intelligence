"use client";

import {useState,useEffect} from "react";
import {motion} from "framer-motion";
import {FaBrain} from "react-icons/fa";

export default function Home(){

const [repo,setRepo] = useState("");
const [result,setResult] = useState(null);
const [reasoning,setReasoning] = useState([]);
const [activeAgent,setActiveAgent] = useState(null);
const [loading,setLoading] = useState(false);

async function evaluateRepo(){

setLoading(true);
setReasoning([]);
setResult(null);

await runAgent("planner","🧠 Planner Agent understanding repo");
await runAgent("repo","🔍 Repo Analyzer fetching repo data");
await runAgent("structure","📂 Mapping repository structure");
await runAgent("code","⚙️ Code Analyzer studying architecture");
await runAgent("skills","🧩 Extracting developer skills");
await runAgent("portfolio","📊 Evaluating developer portfolio");

const res = await fetch("/api/evaluate",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({repo})
});

const data = await res.json();

setResult(data);

setReasoning(r=>[
...r,
"✅ AI analysis complete"
]);

setActiveAgent(null);
setLoading(false);

}

async function runAgent(agent,text){

setActiveAgent(agent);
setReasoning(r=>[...r,text]);

await delay(900);

}

const skills = Array.isArray(result?.skills)
? result.skills
: [];

return(

<div className="min-h-screen bg-black text-white relative overflow-hidden">

<BackgroundGrid/>

<div className="relative z-10 p-10">

<header className="flex items-center gap-4 mb-10">

<motion.div
animate={{rotate:[0,10,-10,0]}}
transition={{repeat:Infinity,duration:4}}
>
<FaBrain className="text-cyan-400 text-5xl"/>
</motion.div>

<h1 className="text-4xl font-bold text-cyan-400">
Neuroflow AI Repo Intelligence
</h1>

</header>

<div className="flex gap-4 mb-12">

<input
className="bg-white/10 border border-cyan-400/30 p-3 rounded-xl w-96"
placeholder="Paste GitHub repo URL"
value={repo}
onChange={(e)=>setRepo(e.target.value)}
/>

<button
onClick={evaluateRepo}
className="bg-cyan-500 px-6 py-3 rounded-xl hover:bg-cyan-400 transition"
>
Analyze Repository
</button>

</div>

{/* AGENT GRAPH */}

<AgentGraph activeAgent={activeAgent}/>

{result &&(

<div className="grid grid-cols-2 gap-8 mt-10">

<Card title="AI Project Analysis">

<p><b>Purpose:</b> {result.analysis?.purpose}</p>

<p><b>System Type:</b> {result.analysis?.system_type}</p>

<p><b>Architecture:</b> {result.analysis?.architecture_complexity}</p>

</Card>

<Card title="Technologies & Skills">

<div className="flex flex-wrap gap-2">

{skills.map((skill,i)=>(

<motion.span
key={i}
whileHover={{scale:1.1}}
className="px-3 py-1 bg-cyan-500/20 border border-cyan-400 rounded-full text-sm"
>

{skill}

</motion.span>

))}

</div>

</Card>

<Card title="Repository Insights">

<p><b>Difficulty:</b> {result.score?.difficulty_level}</p>

<p className="mt-3 text-cyan-400 font-semibold">
Suggested Roles
</p>

<ul className="list-disc ml-5">

{result.score?.recommended_roles?.map((r,i)=>(
<li key={i}>{r}</li>
))}

</ul>

</Card>

<Card title="Repository Architecture">

<p>Detected Pattern: Agent Orchestrator</p>

<p className="mt-3">Modules:</p>

<ul className="list-disc ml-5">

{result.analysis?.core_modules?.map((m,i)=>(
<li key={i}>{m}</li>
))}

</ul>

</Card>

<Card title="AI Agent Reasoning" full>

<ul className="space-y-2">

{reasoning.map((r,i)=>(

<motion.li
key={i}
initial={{opacity:0,x:-20}}
animate={{opacity:1,x:0}}
>

{r}

</motion.li>

))}

</ul>

</Card>

</div>

)}

</div>

</div>

);

}

function AgentGraph({activeAgent}){

const agents=[

{id:"planner",x:50,y:50,label:"Planner"},
{id:"repo",x:20,y:150,label:"Repo"},
{id:"structure",x:80,y:150,label:"Structure"},
{id:"code",x:20,y:250,label:"Code"},
{id:"skills",x:80,y:250,label:"Skills"},
{id:"portfolio",x:50,y:350,label:"Evaluator"}

];

return(

<div className="relative w-full h-[420px] border border-cyan-400/30 rounded-xl mb-8">

{agents.map(a=>(

<motion.div
key={a.id}
className="absolute flex items-center justify-center w-24 h-10 rounded-lg text-sm"
style={{left:a.x+"%",top:a.y}}

animate={{
scale:activeAgent===a.id ? 1.2 : 1,
boxShadow:activeAgent===a.id
? "0 0 30px cyan"
: "0 0 10px rgba(0,255,255,0.2)"
}}

className="bg-cyan-500/10 border border-cyan-400 text-cyan-300 rounded-lg flex items-center justify-center w-24 h-10 absolute"

>

{a.label}

</motion.div>

))}

</div>

);

}

function Card({title,children,full}){

return(

<motion.div
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
className={`bg-white/5 border border-cyan-400/30 rounded-xl p-6 ${full ? "col-span-2":""}`}
>

<h2 className="text-cyan-400 mb-4 text-lg">
{title}
</h2>

{children}

</motion.div>

);

}

function BackgroundGrid(){

return(

<div
className="absolute inset-0 opacity-20"
style={{
backgroundImage:
"linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)",
backgroundSize:"40px 40px"
}}
/>

);

}

function delay(ms){
return new Promise(r=>setTimeout(r,ms));
}