import { repoAnalyzer } from "../../agents/repoAnalyzer";
import { codeAnalyzer } from "../../agents/codeAnalyzer";
import { skillExtractor } from "../../agents/skillExtractor";
import { portfolioScorer } from "../../agents/portfolioScorer";

export async function POST(req){

const { repo } = await req.json();

const repoData = await repoAnalyzer(repo);

const analysis = await codeAnalyzer(repoData);

const skills = await skillExtractor(repoData);

const score = await portfolioScorer(repoData,analysis,skills);

return Response.json({
repo:repoData,
analysis,
skills,
score
});

}