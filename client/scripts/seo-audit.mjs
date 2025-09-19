// client/scripts/seo-audit.mjs
// Uruchom: cd client && node ./scripts/seo-audit.mjs
import fs from "fs";
import path from "path";

const PAGES_DIR = path.resolve(process.cwd(), "src", "pages");
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".tsx")) files.push(full);
  }
}

function read(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function toPosix(p) {
  // Zmieniamy backslashe na slashe, żeby działało wszędzie
  return p.replaceAll("\\", "/");
}

function pageUrlFromFile(f) {
  const posix = toPosix(f);
  const afterPages = posix.split("/src/pages/")[1] || "";
  const noExt = afterPages.replace(/\.tsx$/, "");
  return noExt === "index" ? "/" : `/${noExt}`;
}

function extract(code) {
  const helmetBlocks = [...code.matchAll(/<Helmet[^>]*>[\s\S]*?<\/Helmet>/g)];
  const titles = [...code.matchAll(/<title>([\s\S]*?)<\/title>/g)].map(m =>
    m[1].trim()
  );
  const canonicals = [...code.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/g)]
    .map(m => {
      const href = m[0].match(/href=["']([^"']+)["']/);
      return href ? href[1] : "";
    })
    .filter(Boolean);
  const h1s = [...code.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m =>
    m[1].trim()
  );

  const issues = [];

  if (h1s.length === 0) issues.push("Brak <h1>.");
  if (h1s.length > 1) issues.push(`Za dużo <h1>: ${h1s.length}.`);

  if (helmetBlocks.length === 0) issues.push("Brak <Helmet> (meta/tytuł).");
  if (titles.length === 0) issues.push("Brak <title>.");

  if (canonicals.length === 0) issues.push('Brak <link rel="canonical">.');
  if (canonicals.length > 1)
    issues.push(`Zduplikowany canonical (${canonicals.length}).`);

  for (const c of canonicals) {
    if (!/^https?:\/\//i.test(c)) {
      issues.push(`Canonical niepełny (relatywny): "${c}"`);
    }
  }

  return { h1s, titles, canonicals, issues };
}

function main() {
  const start = Date.now();
  if (!fs.existsSync(PAGES_DIR)) {
    console.error("Nie znaleziono folderu src/pages. Uruchom w katalogu: client/");
    process.exit(1);
  }

  walk(PAGES_DIR);
  const report = files.map(f => {
    const code = read(f);
    const url = pageUrlFromFile(f);
    return { file: f, url, ...extract(code) };
  });

  const problems = report.filter(r => r.issues.length > 0);

  console.log("=== AUDYT SEO (TSX) ===");
  for (const r of report) {
    const name = toPosix(path.relative(PAGES_DIR, r.file));
    console.log(`\n• ${r.url}  [${name}]`);
    if (r.h1s.length) console.log(`  H1: ${r.h1s.map(t => `"${t}"`).join(" | ")}`);
    if (r.titles.length) console.log(`  <title>: ${r.titles.map(t => `"${t}"`).join(" | ")}`);
    if (r.canonicals.length) console.log(`  canonical: ${r.canonicals.join(" | ")}`);
    if (r.issues.length) {
      for (const i of r.issues) console.log("  ⚠︎ " + i);
    } else {
      console.log("  ✓ OK");
    }
  }

  console.log(`\nPlików TSX: ${files.length}, z problemami: ${problems.length}, czas: ${Date.now() - start}ms`);
}

main();
