import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const code = repoData.files
.map(f=>f.content)
.join("\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Identify the main developer technologies used in this repository.

Code:
${code}

Return a comma separated list.

Example:
Python, FastAPI, REST APIs, Async Programming
`
});

const text = response.output_text;

const skills = text
.split(",")
.map(s=>s.trim())
.filter(Boolean);

if(skills.length > 0) return skills;

}catch{}

return[
"Software Development",
"Backend Development",
"API Development"
];

}