export async function skillExtractor(repoData){

const skills = new Set();

repoData.files.forEach(file => {

const path = file.path.toLowerCase();
const code = file.content.toLowerCase();

/* language detection */

if(path.endsWith(".py")) skills.add("Python");
if(path.endsWith(".js")) skills.add("JavaScript");
if(path.endsWith(".ts")) skills.add("TypeScript");

/* framework detection */

if(code.includes("openai")) skills.add("OpenAI API");
if(code.includes("requests")) skills.add("HTTP APIs");
if(code.includes("googleapiclient")) skills.add("Google APIs");
if(code.includes("telegram")) skills.add("Telegram Bot API");

/* architecture detection */

if(code.includes("baseagent")) skills.add("Agent Architecture");
if(code.includes("async")) skills.add("Async Programming");
if(code.includes("registry")) skills.add("Plugin Architecture");

});

/* fallback */

if(skills.size === 0){

skills.add("Software Development");

}

return Array.from(skills).slice(0,10);

}