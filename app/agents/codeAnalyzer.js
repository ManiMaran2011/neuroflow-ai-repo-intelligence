import OpenAI from "openai";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const code = repoData.files
.map(f => `File: ${f.path}\n${f.content}`)
.join("\n\n");

const prompt = `
Analyze this repository.

${code}

Return ONLY valid JSON.

{
"purpose":"string",
"system_type":"string",
"architecture_complexity":"string",
"core_modules":["string"]
}
`;

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:prompt
});

const text = response.output_text || "";

const jsonMatch = text.match(/\{[\s\S]*\}/);

if(jsonMatch){
try{
return JSON.parse(jsonMatch[0]);
}catch{}
}

return {
purpose:"AI Software System",
system_type:"Modular Application",
architecture_complexity:"Intermediate",
core_modules:[]
};

}