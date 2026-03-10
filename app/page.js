"use client";

import { useState, useEffect } from "react";

export default function Home() {

const [repo, setRepo] = useState("");
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

async function analyze() {

if (!repo) return;

setLoading(true);
setResult(null);

try {

const res = await fetch("/api/evaluate", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ repo })
});

const data = await res.json();

setResult(data);

} catch (err) {
console.error(err);
}

setLoading(false);
}

return (

<div className="min-h-screen bg-black text-white relative overflow-hidden">

<NeuralGrid />
<Particles />

<div className="relative z-10 max-w-6xl mx-auto p-10">

<h1 className="text-5xl font-bold text-cyan-400 mb-8">
Neuroflow Repo Analyzer
</h1>

<div className="flex gap-4 mb-10">

<input
value={repo}
onChange={(e) => setRepo(e.target.value)}
placeholder="Paste GitHub repository URL..."
className="flex-1 p-4 bg-gray-900 border border-cyan-500 rounded-lg focus:ring-2 focus:ring-cyan-400"
/>

<button
onClick={analyze}
className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg"
>
Analyze
</button>

</div>

{loading && (
<>
<AgentGraph />
<AgentTimeline />
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

<div className="flex flex-wrap gap-2">

{result.skills?.length
? result.skills.map((s, i) => (
<span
key={i}
className="px-3 py-1 bg-cyan-900/60 border border-cyan-500 rounded-full text-sm"
>
{s}
</span>
))
: <span className="text-gray-400">No technologies detected</span>
}

</div>

</Card>

<Card title="Repository Architecture">

<ul>

{result.analysis?.core_modules?.length
? result.analysis.core_modules.map((m, i) => (
<li key={i}>📦 {m}</li>
))
: <li>No modules detected</li>
}

</ul>

</Card>

<Card title="Developer Insights">

<p><b>Difficulty:</b> {result.score?.difficulty_level}</p>

<ul>

{result.score?.recommended_roles?.length
? result.score.recommended_roles.map((r, i) => (
<li key={i}>• {r}</li>
))
: <li>No role suggestions</li>
}

</ul>

<p className="mt-3 text-gray-300">
{result.score?.insight}
</p>

</Card>

<Card title="AI Architecture Insight">

<p className="text-gray-300">
{result.analysis?.architecture_insight}
</p>

</Card>

</div>

)}

</div>

</div>

);
}

/* CARD COMPONENT */

function Card({ title, children }) {

return (

<div className="
bg-gradient-to-br
from-gray-900
to-black
border border-cyan-500
p-6
rounded-xl
shadow-[0_0_25px_rgba(0,255,255,0.15)]
hover:shadow-[0_0_45px_rgba(0,255,255,0.35)]
transition
">

<h2 className="text-xl text-cyan-400 mb-4">
{title}
</h2>

{children}

</div>

);
}

/* GRID BACKGROUND */

function NeuralGrid() {

return (

<div className="absolute inset-0 opacity-25 pointer-events-none">

<div className="w-full h-full bg-[radial-gradient(circle,rgba(0,255,255,0.2)_1px,transparent_1px)] [background-size:40px_40px]"></div>

</div>

);
}

/* FLOATING PARTICLES */

function Particles() {

const [dots, setDots] = useState([]);

useEffect(() => {

const arr = [];

for (let i = 0; i < 40; i++) {
arr.push({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight
});
}

setDots(arr);

}, []);

return (

<div className="absolute inset-0 pointer-events-none">

{dots.map((d, i) => (
<div
key={i}
className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
style={{ left: d.x, top: d.y }}
></div>
))}

</div>

);
}

/* AI AGENT TIMELINE */

function AgentTimeline() {

return (

<div className="mb-10 border border-cyan-500 p-6 rounded-lg bg-black/60">

<h3 className="text-cyan-400 text-lg mb-4">
AI Agents Processing
</h3>

<ul className="space-y-2 animate-pulse text-gray-300">

<li>🧠 Planner Agent analyzing repository</li>
<li>🔍 Repo Analyzer fetching repository data</li>
<li>📂 Mapping repository structure</li>
<li>⚙️ Code Analyzer evaluating architecture</li>
<li>🧩 Extracting technologies & skills</li>
<li>📊 Evaluating developer portfolio</li>
<li>✅ AI analysis complete</li>

</ul>

</div>

);
}

/* NEURAL AGENT GRAPH */

function AgentGraph() {

const nodes = [
{ id: "Planner", x: 200, y: 60 },
{ id: "Repo", x: 100, y: 150 },
{ id: "Code", x: 300, y: 150 },
{ id: "Skills", x: 120, y: 250 },
{ id: "Portfolio", x: 280, y: 250 }
];

const edges = [
["Planner", "Repo"],
["Planner", "Code"],
["Repo", "Skills"],
["Code", "Portfolio"]
];

return (

<div className="mb-10 border border-cyan-500 rounded-lg p-6 bg-black/60">

<h3 className="text-cyan-400 mb-4 text-lg">
Neural Agent Network
</h3>

<svg width="400" height="300">

{edges.map((e, i) => {

const a = nodes.find(n => n.id === e[0]);
const b = nodes.find(n => n.id === e[1]);

return (

<g key={i}>

<line
x1={a.x}
y1={a.y}
x2={b.x}
y2={b.y}
stroke="cyan"
strokeWidth="2"
/>

<circle r="4" fill="cyan">

<animateMotion
dur="2s"
repeatCount="indefinite"
path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
/>

</circle>

</g>

);

})}

{nodes.map((n, i) => (

<g key={i}>

<circle
cx={n.x}
cy={n.y}
r="15"
fill="cyan"
className="animate-pulse"
/>

<text
x={n.x}
y={n.y + 30}
textAnchor="middle"
fill="white"
fontSize="12"
>
{n.id}
</text>

</g>

))}

</svg>

</div>

);
}