import OpenAI from "openai";

export async function portfolioScorer(repoData,analysis,skills){

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const prompt = `
Evaluate this developer portfolio.

Skills:
${skills.join(", ")}

Project complexity:
${analysis.architecture_complexity}

Return ONLY JSON:

{
"difficulty_level":"string",
"recommended_roles":["string"],
"improvement_suggestions":["string"]
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
difficulty_level:"Intermediate",
recommended_roles:[],
improvement_suggestions:[]
};

}