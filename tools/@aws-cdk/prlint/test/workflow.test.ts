import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const workflowPath = path.join(__dirname, '..', '..', '..', '..', '.github', 'workflows', 'pr-linter.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8').replace(/\r\n/g, '\n');
const script = workflow.match(/name: "Determine PR info"[\s\S]*?        run: \|\n((?: {10}[^\n]*(?:\n|$))+)/)?.[1];
if (!script) {
  throw new Error('Could not find the Determine PR info workflow script');
}

const sha = '13f0a6310e9f6a8613276eb2d1c96508e932a200';
const testWithBash = process.platform === 'win32' ? test.skip : test;

testWithBash.each([
  {
    name: 'missing artifact and empty PR context',
    prNumber: '',
    files: {},
    expectedNumber: '',
    expectedSha: sha,
  },
  {
    name: 'missing artifact with PR context',
    prNumber: '37858',
    files: {},
    expectedNumber: '37858',
    expectedSha: sha,
  },
  {
    name: 'preserved artifact metadata',
    prNumber: '99999',
    files: { pr_number: '37858', pr_sha: 'artifact-sha' },
    expectedNumber: '37858',
    expectedSha: 'artifact-sha',
  },
  {
    name: 'partial artifact missing PR number',
    prNumber: '37858',
    files: { pr_sha: 'artifact-sha' },
    expectedNumber: '37858',
    expectedSha: 'artifact-sha',
  },
  {
    name: 'partial artifact missing SHA',
    prNumber: '',
    files: { pr_number: '37858' },
    expectedNumber: '37858',
    expectedSha: sha,
  },
])('workflow recovers PR metadata: $name', ({ prNumber, files, expectedNumber, expectedSha }) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk prlint-'));
  try {
    for (const [file, value] of Object.entries(files)) {
      fs.mkdirSync(path.join(directory, 'pr'), { recursive: true });
      fs.writeFileSync(path.join(directory, 'pr', file), `${value}\n`);
    }
    const output = path.join(directory, 'outputs');
    const rendered = script
      .replaceAll('${{ github.event.workflow_run.pull_requests[0].number }}', prNumber)
      .replaceAll('${{ github.event.workflow_run.head_sha }}', sha);
    const result = spawnSync('bash', ['-e', '-c', rendered], {
      cwd: directory,
      encoding: 'utf8',
      env: { PATH: process.env.PATH, GITHUB_OUTPUT: output },
    });

    expect(result.error).toBeUndefined();
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    expect(fs.readFileSync(output, 'utf8')).toBe(`pr_number=${expectedNumber}\npr_sha=${expectedSha}\n`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
