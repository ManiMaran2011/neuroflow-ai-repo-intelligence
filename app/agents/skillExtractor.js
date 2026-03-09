import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const code = repoData.files.map(f=>f.content).join("\n");

const prompt = `
Extract developer skills from this code.

Return ONLY JSON array.

Example:
["Python","LangChain","Vector Databases"]

Code:
${code}
`;

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:prompt
});

const text = response.output_text || "";

const jsonMatch = text.match(/\[[\s\S]*\]/);

if(jsonMatch){
try{
return JSON.parse(jsonMatch[0]);
}catch{}
}

return [];

}