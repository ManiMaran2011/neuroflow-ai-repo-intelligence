import OpenAI from "openai";

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

export async function codeAnalyzer(repoData){

const code = repoData.files
.map(f => `File: ${f.path}\n${f.content}`)
.join("\n\n");

const prompt = `
You are a senior software architect.

Analyze the following repository code.

Repository:
${repoData.name}

Code Samples:
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

const text = response.output_text;

try{
return JSON.parse(text);
}catch{

return{
purpose:"Software project",
system_type:"Application",
architecture_complexity:"Intermediate",
core_modules:[]
};

}

}