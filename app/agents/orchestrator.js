import { repoAnalyzer } from "./repoAnalyzer";
import { codeAnalyzer } from "./codeAnalyzer";
import { skillExtractor } from "./skillExtractor";
import { portfolioScorer } from "./portfolioScorer";

export async function agentOrchestrator(repo){

const repoData = await repoAnalyzer(repo);

const analysis = await codeAnalyzer(repoData);

const skills = await skillExtractor(repoData);

const score = await portfolioScorer(
repoData,
analysis,
skills
);

return{

repo:repoData,
analysis,
skills,
score

};

}