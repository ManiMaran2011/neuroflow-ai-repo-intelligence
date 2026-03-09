import OpenAI from "openai";

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

export async function portfolioScorer(repoData,analysis,skills){

const prompt = `
Evaluate this developer project.

Project:
${repoData.name}

Purpose:
${analysis.purpose}

Architecture:
${analysis.architecture_complexity}

Skills:
${skills.join(", ")}

Return JSON:

{
"difficulty_level":"",
"recommended_roles":[],
"improvement_suggestions":[]
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
difficulty_level:"Intermediate",
recommended_roles:[],
improvement_suggestions:[]
};

}

}