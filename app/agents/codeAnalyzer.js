import OpenAI from "openai";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

/* detect modules from file structure */

const modules = repoData.files.map(file => {

const parts = file.path.split("/");

if(parts.length >= 2){

return parts.slice(0,2).join("/");

}

return file.path;

});

const uniqueModules = [...new Set(modules)].slice(0,6);

/* repo tree for LLM */

const repoTree = repoData.files.map(f => f.path).join("\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Explain this GitHub repository.

Repository structure:
${repoTree}

Return JSON:

{
"purpose":"",
"system_type":"",
"architecture_complexity":""
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

system_type: parsed.system_type || "Backend application",

architecture_complexity: parsed.architecture_complexity || "Intermediate",

core_modules: uniqueModules.length
? uniqueModules
: ["backend","agents","core system"]

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