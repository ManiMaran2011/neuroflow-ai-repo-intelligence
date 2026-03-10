import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const repoTree = repoData.files.map(f=>f.path).join("\n");

let skills = [];

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Analyze this GitHub repository and identify technologies used.

Repository files:
${repoTree}

Return JSON:

{
"skills":["technology list"]
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

skills = parsed.skills || [];

}catch(e){
console.log("Skill extraction failed:",e);
}

/* FALLBACK DETECTION */

if(skills.length === 0){

repoData.files.forEach(file=>{

const path = file.path.toLowerCase();
const code = file.content.toLowerCase();

if(path.endsWith(".py")) skills.push("Python");
if(path.endsWith(".js")) skills.push("JavaScript");
if(path.endsWith(".ts")) skills.push("TypeScript");

if(code.includes("openai")) skills.push("OpenAI API");
if(code.includes("react")) skills.push("React");
if(code.includes("express")) skills.push("Node.js");
if(code.includes("fastapi")) skills.push("FastAPI");

});

}

if(skills.length === 0){

skills = ["Software Development"];

}

return [...new Set(skills)];

}