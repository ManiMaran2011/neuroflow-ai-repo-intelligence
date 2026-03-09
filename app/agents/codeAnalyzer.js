import OpenAI from "openai";

export async function codeAnalyzer(repoData){

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

const codeContext = repoData.files
.map(f => `File: ${f.path}\n${f.content}`)
.join("\n\n");

try{

const response = await openai.responses.create({
model:"gpt-4.1-mini",

input:`
You are an expert software architect.

Analyze this GitHub repository.

Repository Description:
${repoData.description}

Code:
${codeContext}

Determine:

• project purpose
• project category
• system architecture complexity
• major modules/components

Return JSON:

{
"purpose":"",
"project_category":"",
"architecture_complexity":"",
"modules":[]
}

Project categories can be:

AI/ML System
Backend API
Frontend Web Application
Full Stack Application
Agent System
Data Pipeline
CLI Tool
Dev Tool
`
});

const text = response.output_text;

const parsed = JSON.parse(text);

return{
purpose: parsed.purpose || "Software project",
project_category: parsed.project_category || "Application",
architecture_complexity: parsed.architecture_complexity || "Moderate",
modules: parsed.modules || []
};

}catch(e){

return{
purpose:"Software repository implementing application logic",
project_category:"Software Application",
architecture_complexity:"Moderate",
modules:[]
};

}

}