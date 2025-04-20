import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    const dataDir = core.getInput('data_directory');
    const ruleSetPath = core.getInput('rule_set_path'); 
    const showSummary = core.getInput('show_summary') || 'fail';
    const outputFormat = core.getInput('output_format') || 'single-line-summary';

    if (!ruleSetPath) {
      throw new Error(" 'rule_set_path' input must be provided.");
    }

    let rulePathToUse = ruleSetPath;

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
