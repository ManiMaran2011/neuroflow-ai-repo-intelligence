import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function careerAdvisor(skills, analysis) {

  const prompt = `
A developer has these skills:

${skills.join(", ")}

Project analysis:
${JSON.stringify(analysis)}

Suggest suitable tech roles.

Return JSON:

{
 "recommended_roles": [],
 "strengths": [],
 "learning_suggestions": []
}
`;

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  return response.output_text;
}