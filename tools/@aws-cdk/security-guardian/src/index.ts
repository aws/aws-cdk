import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { detectChangedTemplates } from './get-changed-files';
import { runScan } from './check-intrinsics';

function getInput(name: string, options?: { required?: boolean, default?: string }): string {
  // GitHub Actions input
  const actionInput = core.getInput(name);
  if (actionInput) return actionInput;

  // Local CLI arg
  const cliArg = process.argv.find(arg => arg.startsWith(`--${name}=`));
  if (cliArg) return cliArg.split('=')[1];

  // Default fallback
  if (options?.default !== undefined) return options.default;

  if (options?.required) {
    throw new Error(`Fatal error: Input '${name}' must be provided.`);
  }

  return '';
}

async function run(): Promise<void> {
  const errors: string[] = [];

  try {
    const ruleSetPath = getInput('rule_set_path');
    const baseSha = getInput('base_sha', { default: 'origin/main' });
    const headSha = getInput('head_sha', { default: 'HEAD' });
    const outputFormat = getInput('output_format', { default: 'single-line-summary' });
    const showSummary = getInput('show_summary', { default: 'fail' });
    const workingDir = getInput('working_dir', { default: './changed_templates' });

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
      core.setFailed(`Action completed with issues: ${errors}`);
    } else {
      core.info('All validations passed.');
    }

  } catch (fatal) {
    core.setFailed(`Fatal error: ${(fatal as Error).message}`);
  }
}

run();
