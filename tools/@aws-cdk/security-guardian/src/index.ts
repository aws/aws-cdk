import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { runScan } from './check-intrinsics'; //custom-scanner

async function run(): Promise<void> {
  const errors: string[] = [];

  try {
    const dataDir = core.getInput('data_directory');
    const ruleSetPath = core.getInput('rule_set_path');
    const showSummary = core.getInput('show_summary') || 'fail';
    const outputFormat = core.getInput('output_format') || 'single-line-summary';

    if (!ruleSetPath) {
      throw new Error("Input 'rule_set_path' must be provided.");
    }

    core.info(`\n\n Running cfn-guard with rule set: ${ruleSetPath}`);

    // Capture cfn-guard output/errors without throwing
    try {
      await exec.exec('cfn-guard', [
        'validate',
        '--data', dataDir,
        '--rules', ruleSetPath,
        '--show-summary', showSummary,
        '--output-format', outputFormat
      ]);
    } catch (err) {
      const message = ` cfn-guard validation failed: ${(err as Error).message}`;
      core.warning(message);
      errors.push(message);
    }

    // Run your intrinsic function scan
    core.info(` Running scanner for intrinsics`);
    try {
      const issuesFound = await runScan(dataDir);
      if (issuesFound > 0) {
        const msg = ` Intrinsic function scan found ${issuesFound} issue(s).`;
        core.warning(msg);
        errors.push(msg);
      }
    } catch (err) {
      const message = ` Intrinsic scan failed: ${(err as Error).message}`;
      core.warning(message);
      errors.push(message);
    }

    if (errors.length > 0) {
      core.error(`Action completed with issues:${errors}`);
    } else {
      core.info(' All validations passed.');
    }
  } catch (fatal) {
    core.setFailed(` Fatal error: ${(fatal as Error).message}`);
  }
}

run();
