export async function skillExtractor(repoData){

const skills = new Set();

for(const file of repoData.files){

const code = file.content.toLowerCase();

if(file.path.endsWith(".py")) skills.add("Python");
if(file.path.endsWith(".js")) skills.add("JavaScript");
if(file.path.endsWith(".ts")) skills.add("TypeScript");

if(code.includes("fastapi")) skills.add("FastAPI");
if(code.includes("flask")) skills.add("Flask");
if(code.includes("django")) skills.add("Django");

if(code.includes("openai")) skills.add("OpenAI API");
if(code.includes("langchain")) skills.add("LangChain");

if(code.includes("async")) skills.add("Async Programming");

if(code.includes("telegram")) skills.add("Telegram API");

if(code.includes("google")) skills.add("Google APIs");

if(code.includes("agent")) skills.add("Agent Architecture");

}

if(skills.size === 0){

skills.add("Software Development");
skills.add("Backend Development");

}

return Array.from(skills);

}