import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { detectChangedTemplates } from './get-changed-files';
import { runScan } from './check-intrinsics';

async function run(): Promise<void> {
  const errors: string[] = [];

  try {
    const ruleSetPath = core.getInput('rule_set_path');
    const baseSha = core.getInput('base_sha') || 'origin/main';
    const headSha = core.getInput('head_sha') || 'HEAD';
    const outputFormat = core.getInput('output_format') || 'single-line-summary';
    const showSummary = core.getInput('show_summary') || 'fail';
    const workingDir = core.getInput('working_dir') || './changed_templates';

    const filesChanged = await detectChangedTemplates(baseSha, headSha, workingDir);
    if (!filesChanged) {
      core.info('No template files changed. Skipping validation.');
      return;
    }

    if (!ruleSetPath) throw new Error("Input 'rule_set_path' must be provided.");

    core.info(`Running cfn-guard with rule set: ${ruleSetPath}`);
    try {
      await exec.exec('cfn-guard', [
        'validate',
        '--data', workingDir,
        '--rules', ruleSetPath,
        '--show-summary', showSummary,
        '--output-format', outputFormat
      ]);
    } catch (err) {
      const message = `cfn-guard validation failed: ${(err as Error).message}`;
      core.warning(message);
      errors.push(message);
    }

    core.info(`Running scanner for intrinsics`);
    try {
      const issuesFound = await runScan(workingDir);
      if (issuesFound > 0) {
        const msg = `Intrinsic scan found ${issuesFound} issue(s).`;
        core.warning(msg);
        core.setOutput('issues_found', issuesFound);
        errors.push(msg);
      }
    } catch (err) {
      const message = `Intrinsic scan failed: ${(err as Error).message}`;
      core.warning(message);
      errors.push(message);
    }

    if (errors.length > 0) {
      core.setFailed(`Action completed with issues:\n${errors.join('\n')}`);
    } else {
      core.info('All validations passed.');
    }

  } catch (fatal) {
    core.setFailed(`Fatal error: ${(fatal as Error).message}`);
  }
}

run();
