import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

export async function runScan(dataDir: string) {
  let issuesFound = 0;
  let matches: Array<{ filePath: string, statements: any[] }> = [];
  let totalFiles = 0;

  function isRootPrincipal(statement: any): boolean {
    if (typeof statement !== 'object' || statement == null) return false;
    if (statement.Effect !== 'Allow') return false;

    const principal = statement.Principal;
    if (typeof principal !== 'object' || principal == null) return false;

    const awsPrincipal = principal.AWS;
    if (typeof awsPrincipal === 'object' && awsPrincipal['Fn::Join']) {
      const joinArgs = awsPrincipal['Fn::Join'];
      if (Array.isArray(joinArgs) && joinArgs.length === 2) {
        const parts = joinArgs[1];
        if (Array.isArray(parts)) {
          const joined = parts.map(p => typeof p === 'string' ? p : '').join('');
          return joined.endsWith(':root');
        }
      }
    }

    return false;
  }

  function findMatchingStatements(obj: any): any[] {
    const results: any[] = [];

    if (Array.isArray(obj)) {
      for (const item of obj) {
        results.push(...findMatchingStatements(item));
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'Statement') {
          const stmts = Array.isArray(value) ? value : [value];
          for (const stmt of stmts) {
            if (isRootPrincipal(stmt)) {
              results.push(stmt);
            }
          }
        } else {
          results.push(...findMatchingStatements(value));
        }
      }
    }

    return results;
  }

  function walkDir(dir: string, fileCallback: (filePath: string) => void) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath, fileCallback);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        fileCallback(fullPath);
      }
    }
  }

  core.info(`Scanning JSON files in: ${dataDir}`);

  walkDir(dataDir, filePath => {
    totalFiles++;
    core.info(`Processing: ${filePath}`);
    let data;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(content);
    } catch (err) {
      core.warning(`Skipping ${filePath}: ${(err as Error).message}`);
      return;
    }

    const found = findMatchingStatements(data);
    if (found.length > 0) {
      core.info(`Match found in: ${filePath} (statements: ${found.length})`);
      matches.push({ filePath, statements: found });
      issuesFound += found.length;
    }
  });

  // Build human-readable detailed output
  let detailedOutput = '';
  for (const match of matches) {
    detailedOutput += `File: ${match.filePath}\n`;
    for (const stmt of match.statements) {
      detailedOutput += `${JSON.stringify(stmt, null, 2)} |n| `;
    }
    detailedOutput += '='.repeat(60) + '\n';
  }

  // Set the output for GitHub Actions
  core.info(`detailed_output ${detailedOutput.trim()}`);

  core.info('\n Scan complete!');
  core.info(` Files scanned : ${totalFiles}`);
  core.info(` Matches found : ${matches.length}`);

  return issuesFound;
}
