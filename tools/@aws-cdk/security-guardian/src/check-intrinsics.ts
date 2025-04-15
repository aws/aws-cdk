import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

export async function runScan(dataDir: string) {
  let issuesFound = 0;
  const OUTPUT_FILE = `test/test-run/fnjoin_root_intrinsic_matches_${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}.log`;

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
  core.info(`Writing matches to: ${OUTPUT_FILE}\n`);

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

  const logStream = fs.createWriteStream(OUTPUT_FILE);
  for (const match of matches) {
    logStream.write(`File: ${match.filePath}\n`);
    for (const stmt of match.statements) {
      logStream.write(JSON.stringify(stmt, null, 2) + '\n');
    }
    logStream.write('='.repeat(60) + '\n');
  }
  logStream.end();

  core.info('\n Scan complete!');
  core.info(` Files scanned : ${totalFiles}`);
  core.info(` Matches found : ${matches.length}`);
  core.info(` Output file   : ${OUTPUT_FILE}`);
  return issuesFound;
}
