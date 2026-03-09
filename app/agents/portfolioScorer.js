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

const text = response.output?.[0]?.content?.[0]?.text || "";

try{
return JSON.parse(text);
}catch{
return {
difficulty_level:"Intermediate",
recommended_roles:[],
improvement_suggestions:[]
};
}

}