import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function plannerAgent(repoUrl) {

  const prompt = `
You are an AI planning agent.

Given a GitHub repository URL, decide which analysis steps should be performed.

Repository:
${repoUrl}

Return JSON:

{
 "steps": ["repo_analysis","code_analysis","skill_extraction","portfolio_scoring"]
}
`;

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  const text = response.output_text;

  try {
    return JSON.parse(text);
  } catch {
    return { steps: ["repo_analysis","code_analysis","skill_extraction","portfolio_scoring"] };
  }
}