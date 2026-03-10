export async function repoAnalyzer(repoUrl){

const cleaned = repoUrl
.replace("https://github.com/","")
.replace("http://github.com/","")
.replace("github.com/","")
.split("/");

const owner = cleaned[0];
const repo = cleaned[1];

if(!owner || !repo){
throw new Error("Invalid GitHub URL");
}

const headers = {
Accept:"application/vnd.github+json",
"User-Agent":"Neuroflow-Repo-Analyzer"
};

/* fetch repo metadata */

const repoRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}`,
{headers}
);

const repoData = await repoRes.json();

console.log("REPO:", repoData.full_name);

/* detect default branch */

const branch = repoData.default_branch || "main";

/* get commit SHA */

let sha;

try{

const branchRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`,
{headers}
);

const branchData = await branchRes.json();

sha = branchData?.commit?.sha;

}catch(e){

console.log("Branch API failed");

}

/* fallback if branch API fails */

if(!sha){

const commitRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}/commits/${branch}`,
{headers}
);

const commitData = await commitRes.json();

sha = commitData.sha;

}

console.log("TREE SHA:", sha);

/* fetch repository tree */

const treeRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`,
{headers}
);

const treeData = await treeRes.json();

const allFiles = treeData.tree || [];

/* ============================= */
/* NEW: Folder structure detect */
/* ============================= */

const folders = [...new Set(
allFiles
.filter(f => f.type === "tree")
.map(f => f.path.split("/")[0])
)];

console.log("FOLDERS:", folders);

/* ============================= */
/* detect priority files */
/* ============================= */

const priorityFiles = allFiles.filter(f => {

const p = f.path.toLowerCase();

return(
p.includes("readme") ||
p.includes("package.json") ||
p.includes("requirements.txt") ||
p.includes("dockerfile") ||
p.endsWith("main.py") ||
p.endsWith("app.py") ||
p.endsWith("server.js") ||
p.endsWith("index.js") ||
p.endsWith("index.ts") ||
p.endsWith("app.tsx") ||
p.endsWith("next.config.js")
);

});

/* ============================= */
/* detect code files */
/* ============================= */

const codeFiles = allFiles.filter(f => {

const p = f.path.toLowerCase();

return(
p.endsWith(".py") ||
p.endsWith(".js") ||
p.endsWith(".ts") ||
p.endsWith(".tsx") ||
p.endsWith(".jsx") ||
p.endsWith(".java") ||
p.endsWith(".go") ||
p.endsWith(".rs")
);

});

/* limit number of files */

const selectedFiles = [...priorityFiles,...codeFiles].slice(0,30);

const fileContents = [];

/* fetch file contents */

for(const file of selectedFiles){

try{

const res = await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`,
{headers}
);

const data = await res.json();

if(!data.content) continue;

const decoded = Buffer.from(data.content,"base64").toString("utf8");

fileContents.push({
path:file.path,
content:decoded
});

}catch(e){

console.log("skip",file.path);

}

}

console.log("FILES ANALYZED:",fileContents.length);

/* extract README */

const readmeFile = fileContents.find(f =>
f.path.toLowerCase().includes("readme")
);

let readmeContent="";

if(readmeFile){
readmeContent = readmeFile.content.slice(0,4000);
}

/* ============================= */
/* detect languages */
/* ============================= */

let languages = [];

try{

const langRes = await fetch(
`https://api.github.com/repos/${owner}/${repo}/languages`,
{headers}
);

const langData = await langRes.json();

languages = Object.keys(langData);

}catch(e){

console.log("Language detection failed");

}

/* fallback if no files found */

if(fileContents.length === 0){

fileContents.push({
path:"README.md",
content:repoData.description || "Software repository"
});

}

/* return repo intelligence */

return{
name: repoData.name,
description: repoData.description,
files: fileContents,
readme: readmeContent,
languages,
folders
};

}