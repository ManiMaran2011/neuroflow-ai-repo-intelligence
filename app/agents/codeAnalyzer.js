import OpenAI from "openai";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const repoTree = repoData.files.map(f => f.path).join("\n");

const codeContext = repoData.files
.map(f => `File: ${f.path}\n${f.content.slice(0,600)}`)
.join("\n\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
You are a senior software architect.

Analyze this GitHub repository.

Repository structure:
${repoTree}

Code samples:
${codeContext}

Return JSON:

{
"purpose":"2-3 sentence explanation of what the system does",
"system_type":"type of system",
"architecture_complexity":"Beginner | Intermediate | Advanced",
"core_modules":[
"list main modules"
],
"architecture_insight":"Explain the architecture design in 3-4 sentences"
}
`
});

let text = response.output_text || "{}";

let parsed;

try{
parsed = JSON.parse(text);
}catch{
parsed = {};
}

/* fallback module detection */

const modules = repoData.files
.map(f=>{
const parts = f.path.split("/");
return parts.slice(0,2).join("/");
})
.filter(Boolean);

const uniqueModules = [...new Set(modules)].slice(0,6);

return{

purpose: parsed.purpose || "Software repository",

system_type: parsed.system_type || "Application",

architecture_complexity: parsed.architecture_complexity || "Intermediate",

core_modules:
parsed.core_modules?.length
? parsed.core_modules
: uniqueModules,

architecture_insight:
parsed.architecture_insight ||
"This repository appears to use a modular architecture with multiple components interacting to implement system functionality."

};

}catch(e){

return{
purpose:"Software repository",
system_type:"Application",
architecture_complexity:"Intermediate",
core_modules:["core system modules"],
architecture_insight:"Architecture could not be fully analyzed."
};

}

}