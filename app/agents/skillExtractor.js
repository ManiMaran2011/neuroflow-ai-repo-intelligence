import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const repoTree = repoData.files
.map(f=>f.path)
.join("\n");

const codeContext = repoData.files
.map(f=>f.content.slice(0,600))
.join("\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Analyze this GitHub repository and list technologies and developer skills.

Repository structure:
${repoTree}

Code:
${codeContext}

Return a comma separated list.

Example:
Python, FastAPI, REST APIs, OpenAI API
`
});

const text = response.output_text || "";

const skills = text
.split(/[\n,]/)
.map(s=>s.trim())
.filter(Boolean);

if(skills.length > 0){

return [...new Set(skills)].slice(0,10);

}

}catch(err){

console.log("Skill extractor error:",err);

}

/* fallback detection */

const fallback = [];

repoData.files.forEach(f=>{

const path = f.path.toLowerCase();
const code = f.content.toLowerCase();

if(path.endsWith(".py")) fallback.push("Python");
if(path.endsWith(".js")) fallback.push("JavaScript");

if(code.includes("openai")) fallback.push("OpenAI API");
if(code.includes("telegram")) fallback.push("Telegram API");
if(code.includes("googleapiclient")) fallback.push("Google APIs");

});

if(fallback.length === 0){

fallback.push("Software Development");

}

return [...new Set(fallback)];

}