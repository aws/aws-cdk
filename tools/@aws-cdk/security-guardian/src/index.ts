import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { detectChangedTemplates } from './get-changed-files';
import { preprocessTemplates } from './template-preprocessor';
import { runCfnGuardValidation } from './cfn-guard-runner';
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
  let resolvedDir: string = './changed_templates_resolved';
  let cfnGuardFailures = 0;
  let cfnGuardResolvedFailures = 0;

  try {
    const ruleSetPath = getInput('rule_set_path', { default: './rules' });
    const baseSha = getInput('base_sha', { default: 'origin/main' });
    const headSha = getInput('head_sha', { default: 'HEAD' });
    const outputFormat = getInput('output_format', { default: 'json' });
    const showSummary = getInput('show_summary', { default: 'fail' });
    setupWorkingDir(workingDir);
    setupWorkingDir(resolvedDir);
    
    const filesChanged = await detectChangedTemplates(baseSha, headSha, workingDir);
    if (!filesChanged) {
      core.info('No template files changed. Skipping validation.');
      return;
    }

    if (!ruleSetPath) throw new Error("Input 'rule_set_path' must be provided.");

    // Preprocess templates (resolve intrinsics and normalize policies)
    core.info('Preprocessing templates (resolving intrinsics and normalizing policies)');
    const processedFiles = preprocessTemplates(workingDir, resolvedDir);
    core.info(`Processed ${processedFiles.length} template(s)`);

    // Run CFN-Guard validation on original templates
    core.info(`Running cfn-guard (static) with rule set: ${ruleSetPath}`);
    const flaggedFiles: string[] = [];
    cfnGuardFailures = await runCfnGuardValidation(workingDir, ruleSetPath, showSummary, outputFormat, 'Static', flaggedFiles, errors);

    // Run CFN-Guard validation on resolved templates
    core.info(`Running cfn-guard (resolved) with rule set: ${ruleSetPath}`);
    const resolvedFlaggedFiles: string[] = [];
    cfnGuardResolvedFailures = await runCfnGuardValidation(resolvedDir, ruleSetPath, showSummary, outputFormat, 'Resolved', resolvedFlaggedFiles, errors);



    // Generate Summary Report
    core.info('\n' + '='.repeat(60));
    core.info('🛡️  SECURITY GUARDIAN SUMMARY REPORT');
    core.info('='.repeat(60));
    core.info(`📊 CFN-Guard (Static): ${cfnGuardFailures > 0 ? '❌ ' + cfnGuardFailures + ' violations in ' + flaggedFiles.length + ' file(s)' : '✅ 0'}`);
    core.info(`🔧 CFN-Guard (Resolved): ${cfnGuardResolvedFailures > 0 ? '❌ ' + cfnGuardResolvedFailures + ' violations in ' + resolvedFlaggedFiles.length + ' file(s)' : '✅ 0'}`);
    core.info(`📊 Total Issues Found: ${cfnGuardFailures + cfnGuardResolvedFailures}`);
    
    if (flaggedFiles.length > 0) {
      core.info('\n📄 Files with Static violations:');
      flaggedFiles.forEach(file => core.info(`  - ${file}`));
    }
    
    if (resolvedFlaggedFiles.length > 0) {
      core.info('\n🔧 Files with Resolved violations:');
      resolvedFlaggedFiles.forEach(file => core.info(`  - ${file} (intrinsics resolved)`));
    }
    
    core.info('='.repeat(60));

    // Set outputs for GitHub Actions
    core.setOutput('cfn_guard_failures', cfnGuardFailures);
    core.setOutput('cfn_guard_resolved_failures', cfnGuardResolvedFailures);
    core.setOutput('total_failures', cfnGuardFailures + cfnGuardResolvedFailures);

    if (errors.length > 0) {
      core.setFailed(`Security validation failed with ${cfnGuardFailures + cfnGuardResolvedFailures} total issues`);
    } else {
      core.info('🎉 All security validations passed!');
    }

  } catch (fatal) {
    core.setFailed(`Fatal error: ${(fatal as Error).message}`);
  } finally {
    cleanupWorkingDir(workingDir);
    cleanupWorkingDir(resolvedDir);
  }
}

run();
