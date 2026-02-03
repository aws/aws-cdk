import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

export async function detectChangedTemplates(baseSha: string, headSha: string, workingDir: string): Promise<Map<string, string>> {
  core.info(`Detecting changed .template.json files from ${baseSha} to ${headSha}`);

  let stdout = '';
  await exec.exec('git', ['diff', '--name-status', `${baseSha}...${headSha}`], {
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
    //Create the safe file name for running security analysis
    const safeName = file.replace(/\//g, '_');
    const safeNameFullPath = path.join(workingDir, safeName);

    //Read the changed file content
    const fileContent = await exec.getExecOutput('git', ['show', `${headSha}:${file}`]);
    fs.writeFileSync(safeNameFullPath, fileContent.stdout);
    fileMapping.set(path.resolve(safeNameFullPath), file);
    core.info(`Copied: ${file}`);
  }

  return fileMapping;
}
