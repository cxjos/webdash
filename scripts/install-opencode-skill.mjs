#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const input = process.argv[2];
const explicitSkill = process.argv[3];

if (!input) {
  console.error("Usage: npm run skill:add -- <skills.sh-url|github-url|owner/repo> [skill-name]");
  process.exit(1);
}

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

function parseInput(value, skillArg) {
  if (/^[\w.-]+\/[\w.-]+$/.test(value)) {
    return { repo: value, skill: skillArg };
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Unsupported input: ${value}`);
  }

  const parts = url.pathname.split("/").filter(Boolean);

  if (url.hostname === "www.skills.sh" || url.hostname === "skills.sh") {
    if (parts.length < 3) throw new Error(`Cannot parse skills.sh URL: ${value}`);
    return { repo: `${parts[0]}/${parts[1]}`, skill: skillArg || parts[2] };
  }

  if (url.hostname === "github.com") {
    if (parts.length < 2) throw new Error(`Cannot parse GitHub URL: ${value}`);
    const repo = `${parts[0]}/${parts[1]}`;
    const skill = skillArg || parts.at(-1);
    return { repo, skill };
  }

  throw new Error(`Unsupported host: ${url.hostname}`);
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, { headers: { "User-Agent": "opencode-skill-installer", ...headers } });
  if (!response.ok) return null;
  return response.text();
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers: { "User-Agent": "opencode-skill-installer", ...headers } });
  if (!response.ok) return null;
  return response.json();
}

function withFrontmatter(text, skillName) {
  if (/^---\r?\n/.test(text)) return text;

  const title = skillName.replace(/-/g, " ");
  return `---\nname: ${skillName}\ndescription: Use when working on ${title}.\n---\n\n${text}`;
}

const { repo, skill } = parseInput(input, explicitSkill);
if (!skill) {
  console.error("Missing skill name. Pass it as second argument.");
  process.exit(1);
}

const skillName = slug(skill);
const targetDir = path.resolve(".opencode", "skills", skillName);

async function installFromSkillsApi() {
  const apiKey = process.env.SKILLS_API_KEY;
  if (!apiKey) return false;

  const detail = await fetchJson(`https://skills.sh/api/v1/skills/${repo}/${skillName}`, {
    Authorization: `Bearer ${apiKey}`,
  });

  if (!detail?.files?.length) return false;

  await mkdir(targetDir, { recursive: true });
  for (const file of detail.files) {
    const targetFile = path.join(targetDir, file.path);
    const resolvedTarget = path.resolve(targetFile);

    if (!resolvedTarget.startsWith(`${targetDir}${path.sep}`) && resolvedTarget !== targetDir) {
      throw new Error(`Refusing unsafe skill file path: ${file.path}`);
    }

    await mkdir(path.dirname(targetFile), { recursive: true });
    const contents = file.path === "SKILL.md" ? withFrontmatter(file.contents, skillName) : file.contents;
    await writeFile(targetFile, contents, "utf8");
  }

  console.log(`Installed ${skillName}`);
  console.log(`Source: https://skills.sh/api/v1/skills/${repo}/${skillName}`);
  console.log(`Target: ${targetDir}`);
  if (detail.hash) console.log(`Hash: ${detail.hash}`);
  console.log("Restart opencode to load it.");
  return true;
}

if (await installFromSkillsApi()) process.exit(0);

const candidates = [
  `https://raw.githubusercontent.com/${repo}/main/skills/${skillName}/SKILL.md`,
  `https://raw.githubusercontent.com/${repo}/main/${skillName}/SKILL.md`,
  `https://raw.githubusercontent.com/${repo}/main/SKILL.md`,
  `https://raw.githubusercontent.com/${repo}/master/skills/${skillName}/SKILL.md`,
  `https://raw.githubusercontent.com/${repo}/master/${skillName}/SKILL.md`,
  `https://raw.githubusercontent.com/${repo}/master/SKILL.md`,
];

let sourceUrl = null;
let content = null;

for (const candidate of candidates) {
  content = await fetchText(candidate);
  if (content) {
    sourceUrl = candidate;
    break;
  }
}

if (!content) {
  console.error(`Could not find SKILL.md for ${repo}/${skillName}`);
  console.error("Tried:");
  for (const candidate of candidates) console.error(`- ${candidate}`);
  process.exit(1);
}

const targetFile = path.join(targetDir, "SKILL.md");

await mkdir(targetDir, { recursive: true });
await writeFile(targetFile, withFrontmatter(content, skillName), "utf8");

console.log(`Installed ${skillName}`);
console.log(`Source: ${sourceUrl}`);
console.log(`Target: ${targetFile}`);
console.log("Restart opencode to load it.");
