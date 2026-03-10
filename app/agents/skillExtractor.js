import OpenAI from "openai";
import { extractJSON } from "./utils";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const codeContext = repoData.files
.slice(0,12)
.map(f=>f.content.slice(0,800))
.join("\n\n");

const response = await openai.responses.create({
model:"gpt-4.1-mini",

text:{
format:{type:"json_object"}
},

input:`
Identify technologies used in this repository.

Languages:
${repoData.languages.join(",")}

Code:
${codeContext}

Return JSON:

{
"skills":["technologies"]
}
`
});

let skills = extractJSON(response).skills || [];

if(!skills.length){

repoData.files.forEach(file=>{

const path=file.path.toLowerCase();
const code=file.content.toLowerCase();

if(path.endsWith(".py")) skills.push("Python");
if(path.endsWith(".js")) skills.push("JavaScript");
if(path.endsWith(".ts")) skills.push("TypeScript");

if(code.includes("react")) skills.push("React");
if(code.includes("next")) skills.push("Next.js");
if(code.includes("fastapi")) skills.push("FastAPI");
if(code.includes("flask")) skills.push("Flask");
if(code.includes("django")) skills.push("Django");

if(code.includes("openai")) skills.push("OpenAI API");
if(code.includes("langchain")) skills.push("LangChain");

});

}

skills=[...new Set(skills)];

if(!skills.length){
skills=["Software Development"];
}

return skills;

}