import OpenAI from "openai";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

/* detect modules from repo structure */

const modules = repoData.files.map(file => {

const parts = file.path.split("/");

if(parts.length >= 2){

return parts.slice(0,2).join("/");

}

return file.path;

});

const uniqueModules = [...new Set(modules)].slice(0,6);

/* build context for LLM */

const repoTree = repoData.files.map(f => f.path).join("\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
You are a senior software architect.

Explain this repository.

Repository structure:
${repoTree}

Return JSON:

{
"purpose":"short explanation",
"system_type":"type of system",
"architecture_complexity":"Beginner | Intermediate | Advanced"
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

return{

purpose: parsed.purpose || "Software repository",

system_type: parsed.system_type || "Backend Application",

architecture_complexity: parsed.architecture_complexity || "Intermediate",

core_modules: uniqueModules

};

}catch(e){

return{

purpose:"Software repository",

system_type:"Application",

architecture_complexity:"Intermediate",

core_modules: uniqueModules

};

}

}