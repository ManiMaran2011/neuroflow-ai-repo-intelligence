import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const code = repoData.files.map(f => f.content).join("\n");

const response = await openai.responses.create({
model:"gpt-4.1-mini",

input:`
List the main technologies, tools, and programming skills used in this repository.

Return them as a simple comma separated list.

Example:
Python, FastAPI, Docker, PostgreSQL

Code:
${code}
`
});

const text = response.output_text || "";

const skills = text
.split(",")
.map(s => s.trim())
.filter(Boolean);

return skills;

}