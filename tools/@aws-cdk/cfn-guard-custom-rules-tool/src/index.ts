import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as os from 'os';

async function downloadFile(url: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(); // Close is synchronous, no need to wait
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => reject(err));
    });
  });
}

async function run(): Promise<void> {
  try {
    const dataDir = core.getInput('data_directory');
    const ruleSetPath = core.getInput('rule_set_path'); // optional
    const ruleSetUrl = core.getInput('rule_set_url');   // optional
    const showSummary = core.getInput('show_summary') || 'fail';
    const outputFormat = core.getInput('output_format') || 'single-line-summary';

    if (!ruleSetPath && !ruleSetUrl) {
      throw new Error("Either 'rule_set_path' or 'rule_set_url' input must be provided.");
    }

    let rulePathToUse = ruleSetPath;

    if (!rulePathToUse && ruleSetUrl) {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rules-'));
      rulePathToUse = path.join(tempDir, 'rules.guard');
      await downloadFile(ruleSetUrl, rulePathToUse);
    }

    core.info(`Running cfn-guard with rule set: ${rulePathToUse}`);

    await exec.exec('cfn-guard', [
      'validate',
      '--data', dataDir,
      '--rules', rulePathToUse,
      '--show-summary', showSummary,
      '--output-format', outputFormat
    ]);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();
