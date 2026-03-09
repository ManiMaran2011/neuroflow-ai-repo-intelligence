import OpenAI from "openai";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

/* build repo tree */

const repoTree = repoData.files
.map(f => f.path)
.join("\n");

/* include code snippets */

const codeContext = repoData.files
.map(f => `File: ${f.path}\n${f.content.slice(0,800)}`)
.join("\n\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
You are a senior software architect.

Analyze this GitHub repository.

Repository Structure:
${repoTree}

Code Samples:
${codeContext}

Return JSON:

{
"purpose":"short explanation",
"system_type":"type of system",
"architecture_complexity":"Beginner | Intermediate | Advanced",
"core_modules":["module descriptions"]
}

Important:
core_modules should list important components inferred from file structure.
`
});

const text = response.output_text || "{}";

let parsed = {};

try{
parsed = JSON.parse(text);
}catch{
parsed = {};
}

/* fallback module detection */

let modules = parsed.core_modules || [];

if(modules.length === 0){

modules = repoData.files.slice(0,6).map(f=>{
return `${f.path} module`;
});

}

return{

purpose: parsed.purpose || "Software project",

system_type: parsed.system_type || "Application",

architecture_complexity: parsed.architecture_complexity || "Intermediate",

core_modules: modules

};

}catch(err){

console.log("Code analyzer error:",err);

return{

purpose:"Software project",

system_type:"Application",

architecture_complexity:"Intermediate",

core_modules: repoData.files.slice(0,6).map(f=>f.path)

};

}

}