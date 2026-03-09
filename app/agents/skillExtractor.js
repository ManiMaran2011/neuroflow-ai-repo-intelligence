import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const codeContext = repoData.files
.map(f => `File: ${f.path}\n${f.content}`)
.join("\n\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
You are a senior software engineer.

Analyze this GitHub repository code and list the main technologies and developer skills used.

Codebase:
${codeContext}

Return ONLY the skills as a list.

Example output:

Python
FastAPI
REST APIs
OpenAI API
Async Programming
Vector Databases
`
});

const text = response.output_text || "";

/* parse both commas and line breaks */

const skills = text
.split(/[\n,]/)
.map(s => s.trim())
.filter(s => s.length > 0);

/* remove duplicates */

const uniqueSkills = [...new Set(skills)];

if(uniqueSkills.length > 0){
return uniqueSkills.slice(0,10);
}

}catch(err){

console.log("Skill extraction error:",err);

}

/* fallback if AI fails */

return [
"Software Development",
"Backend Development",
"API Development"
];

}