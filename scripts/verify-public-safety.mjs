import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", "dist", "coverage"]);
const ignoredFiles = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock"]);

const forbiddenPatterns = [
  { name: "local user home path", re: /\/Users\/codeg\b/i },
  { name: "proxy token pattern", re: new RegExp(["tm", "proxy"].join("-") + "-[a-z0-9]+", "i") },
  { name: "raw api key assignment", re: /apiKey\s*[:=]\s*["'][A-Za-z0-9._~+/=-]{20,}["']/i },
  { name: "bearer token literal", re: /Bearer\s+[A-Za-z0-9._~+/=-]{16,}/ },
  { name: "private environment file", re: /^\.env(\.|$)/ },
];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(root, fullPath);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
    } else if (!ignoredFiles.has(entry.name)) {
      results.push(relative);
    }
  }
  return results;
}

const findings = [];
for (const file of walk(root)) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.name === "private environment file" && pattern.re.test(path.basename(file))) {
      findings.push({ file, pattern: pattern.name, line: 1 });
      continue;
    }
  }

  const content = fs.readFileSync(path.join(root, file), "utf8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const pattern of forbiddenPatterns) {
      if (pattern.name === "private environment file") continue;
      if (pattern.re.test(line)) {
        findings.push({ file, pattern: pattern.name, line: idx + 1 });
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Public safety scan failed:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} (${finding.pattern})`);
  }
  process.exit(1);
}

console.log("Public safety scan passed.");
