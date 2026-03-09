import OpenAI from "openai";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const code = repoData.files
.map(f => `File:${f.path}\n${f.content}`)
.join("\n\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",
input:`
Analyze this GitHub project.

Code:
${code}

Return JSON:

{
"purpose":"",
"system_type":"",
"architecture_complexity":"",
"modules":[]
}
`
});

const text = response.output_text;

const parsed = JSON.parse(text);

return{
purpose: parsed.purpose || "Software system",
system_type: parsed.system_type || "Application",
architecture_complexity: parsed.architecture_complexity || "Moderate",
modules: parsed.modules || []
};

}catch{

return{
purpose:"Software project implementing backend logic and services",
system_type:"Modular application",
architecture_complexity:"Moderate",
modules:[]
};

}

}