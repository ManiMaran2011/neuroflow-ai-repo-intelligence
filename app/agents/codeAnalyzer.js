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

Return JSON:

{
"purpose":"",
"system_type":"",
"architecture_complexity":"",
"core_modules":[]
}
`;

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:prompt
});

const text = response.output?.[0]?.content?.[0]?.text || "";

try{
return JSON.parse(text);
}catch{
return {
purpose:"Software Project",
system_type:"Application",
architecture_complexity:"Intermediate",
core_modules:[]
};
}

}