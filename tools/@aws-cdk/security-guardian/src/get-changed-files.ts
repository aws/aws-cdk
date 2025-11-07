import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

export async function detectChangedTemplates(baseSha: string, headSha: string, workingDir: string): Promise<Map<string, string>> {
  core.info(`Detecting changed .template.json files from ${baseSha} to ${headSha}`);

  let stdout = '';
  await exec.exec('git', ['diff', '--name-status', `${baseSha}`, `${headSha}`], {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      }
    }
  });

  const changed = stdout
    .split('\n')
    .filter(line => /^(A|M)\s+.*\.template\.json$/.test(line))
    .map(line => line.trim().split(/\s+/)[1]);

  const fileMapping = new Map<string, string>();

  for (const file of changed) {
    const repoRoot = await exec.getExecOutput('git', ['rev-parse', '--show-toplevel']);
    const fullPath = path.join(repoRoot.stdout.trim(), file);
    console.log('fullpath:', fullPath);
    if (fs.existsSync(fullPath)) {
      const safeName = file.replace(/\//g, '_');
      const safeNameFullPath = path.join(workingDir, safeName);
      fs.copyFileSync(fullPath, safeNameFullPath);
      fileMapping.set(path.resolve(safeNameFullPath), file);
      core.info(`Copied: ${file}`);
    } else {
      core.warning(`Changed file not found: ${file}`);
    }
  }

  return fileMapping;
}
