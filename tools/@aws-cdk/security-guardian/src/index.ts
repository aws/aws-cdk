import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { detectChangedTemplates } from './get-changed-files';
import { runScan } from './check-intrinsics';
import * as fs from 'fs';
import * as path from 'path';

function setupWorkingDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    core.info(`Created working directory: ${dir}`);
  } else {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      fs.unlinkSync(path.join(dir, file));
    }
    core.info(`Cleaned working directory: ${dir}`);
  }
}

function cleanupWorkingDir(dir: string) {
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        fs.unlinkSync(path.join(dir, file));
      }
      fs.rmdirSync(dir);
      core.info(`Removed working directory: ${dir}`);
    }
  } catch (err) {
    core.warning(`Cleanup failed for ${dir}: ${(err as Error).message}`);
  }
}

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
  let workingDir: string = './changed_templates';
  let cfnGuardFailures = 0;
  let intrinsicScannerFailures = 0;

  try {
    const ruleSetPath = getInput('rule_set_path', { default: './rules' });
    const baseSha = getInput('base_sha', { default: 'origin/main' });
    const headSha = getInput('head_sha', { default: 'HEAD' });
    const outputFormat = getInput('output_format', { default: 'json' });
    const showSummary = getInput('show_summary', { default: 'fail' });
    setupWorkingDir(workingDir);
    
    const filesChanged = await detectChangedTemplates(baseSha, headSha, workingDir);
    if (!filesChanged) {
      core.info('No template files changed. Skipping validation.');
      return;
    }

    if (!ruleSetPath) throw new Error("Input 'rule_set_path' must be provided.");

    // Run CFN-Guard validation
    core.info(`Running cfn-guard with rule set: ${ruleSetPath}`);
    try {
      await exec.exec('cfn-guard', [
        'validate',
        '--data', workingDir,
        '--rules', ruleSetPath,
        '--show-summary', showSummary,
        '--output-format', outputFormat
      ]);
      core.info('✅ CFN-Guard validation passed');
    } catch (err) {
      cfnGuardFailures = 1; // CFN-Guard returns non-zero exit code on failures
      const message = `CFN-Guard validation failed: ${(err as Error).message}`;
      core.warning(message);
      errors.push(message);
    }

    // Run Intrinsic Scanner
    core.info(`Running intrinsic scanner`);
    try {
      const issuesFound = await runScan(workingDir);
      intrinsicScannerFailures = issuesFound;
      if (issuesFound > 0) {
        const msg = `Intrinsic scanner found ${issuesFound} issue(s)`;
        core.warning(msg);
        errors.push(msg);
      } else {
        core.info('✅ Intrinsic scanner passed');
      }
    } catch (err) {
      const message = `Intrinsic scanner failed: ${(err as Error).message}`;
      core.warning(message);
      errors.push(message);
    }

    // Generate Summary Report
    core.info('\n' + '='.repeat(60));
    core.info('🛡️  SECURITY GUARDIAN SUMMARY REPORT');
    core.info('='.repeat(60));
    core.info(`📊 CFN-Guard Failures: ${cfnGuardFailures > 0 ? '❌ ' + cfnGuardFailures : '✅ 0'}`);
    core.info(`📊 Intrinsic Scanner Failures: ${intrinsicScannerFailures > 0 ? '❌ ' + intrinsicScannerFailures : '✅ 0'}`);
    core.info(`📊 Total Issues Found: ${cfnGuardFailures + intrinsicScannerFailures}`);
    core.info('='.repeat(60));

    // Set outputs for GitHub Actions
    core.setOutput('cfn_guard_failures', cfnGuardFailures);
    core.setOutput('intrinsic_scanner_failures', intrinsicScannerFailures);
    core.setOutput('total_failures', cfnGuardFailures + intrinsicScannerFailures);

    if (errors.length > 0) {
      core.setFailed(`Security validation failed with ${cfnGuardFailures + intrinsicScannerFailures} total issues`);
    } else {
      core.info('🎉 All security validations passed!');
    }

  } catch (fatal) {
    core.setFailed(`Fatal error: ${(fatal as Error).message}`);
  } finally {
    cleanupWorkingDir(workingDir);
  }
}

run();
