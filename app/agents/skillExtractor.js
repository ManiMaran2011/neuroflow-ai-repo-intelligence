import OpenAI from "openai";

export async function skillExtractor(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const code = repoData.files.map(f=>f.content).join("\n");

const prompt = `
Extract developer skills.

Return JSON array.

Code:
${code}
`;

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:prompt
});

const text = response.output?.[0]?.content?.[0]?.text || "";

try{
return JSON.parse(text);
}catch{
return [];
}

}