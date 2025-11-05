import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

export async function runCfnGuardValidation(
  dataDir: string,
  ruleSetPath: string,
  outputFile: string,
  type: string
): Promise<boolean> {
  try {
    await exec.exec('cfn-guard', [
      'validate',
      '--data', dataDir,
      '--rules', ruleSetPath,
      '--output-format', 'junit',
      '--structured',
      '--show-summary', 'none'
    ], {
      listeners: {
        stdout: (data: Buffer) => {
          fs.writeFileSync(outputFile, data.toString());
        }
      }
    });
    core.info(`✅ CFN-Guard (${type}) validation passed`);
    return true;
  } catch (err) {
    core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
    return false;
  }
}