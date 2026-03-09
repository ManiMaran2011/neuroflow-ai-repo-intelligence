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
You are an expert software engineer.

Analyze this GitHub repository code and identify the main developer technologies and skills used.

Codebase:
${codeContext}

Return JSON in this format:

{
"skills":[]
}

The skills should include:

programming languages  
frameworks  
AI/ML tools  
APIs  
architectural concepts  

Example:

{
"skills":[
"Python",
"FastAPI",
"Async Programming",
"Google APIs",
"Telegram Bot API",
"Agent Architecture"
]
}
`
});

const text = response.output_text;

const parsed = JSON.parse(text);

if(parsed.skills && parsed.skills.length > 0){
return parsed.skills;
}

}catch(e){
console.log("Skill extraction error:",e);
}

/* fallback */

return [
"Software Development",
"Backend Development",
"API Development"
];

}