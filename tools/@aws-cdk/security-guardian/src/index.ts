import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { detectChangedTemplates } from './get-changed-files';
import { scanChangedTemplates } from './scan';
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
  let workingDir: string = './changed_templates';
  let resolvedDir: string = './changed_templates_resolved';
  const testResultsDir = './test-results';

  try {
    const ruleSetPath = getInput('rule_set_path', { default: './rules' });
    const baseSha = getInput('base_sha', { default: 'origin/main' });
    const headSha = getInput('head_sha', { default: 'HEAD' });
    const enhanceXml = getInput('enhance_xml', { default: 'false' }) === 'true';
    
    setupWorkingDir(workingDir);
    setupWorkingDir(resolvedDir);
    setupWorkingDir(testResultsDir);
    
    const fileMapping = await detectChangedTemplates(baseSha, headSha, workingDir);
    if (fileMapping.size === 0) {
      core.info('No template files changed. Skipping validation.');
      return;
    }

    if (!ruleSetPath) throw new Error("Input 'rule_set_path' must be provided.");

    // Generate XML output files
    const staticXmlFile = path.join(testResultsDir, 'cfn-guard-static.xml');
    const resolvedXmlFile = path.join(testResultsDir, 'cfn-guard-resolved.xml');

    // Preprocess templates (resolve intrinsics and normalize policies), then run CFN-Guard validation and generate XML
    const { staticPassed, resolvedPassed } = await scanChangedTemplates({
      changedDir: workingDir,
      resolvedDir,
      ruleSetPath,
      staticReport: staticXmlFile,
      resolvedReport: resolvedXmlFile,
      fileMapping,
      enhanceXml,
    });

    // Generate Summary Report
    core.info('\n' + '='.repeat(60));
    core.info('🛡️  SECURITY GUARDIAN SUMMARY REPORT');
    core.info('='.repeat(60));
    core.info(`📊 CFN-Guard (Static): ${staticPassed ? '✅ Passed' : '❌ Failed'}`);
    core.info(`🔧 CFN-Guard (Resolved): ${resolvedPassed ? '✅ Passed' : '❌ Failed'}`);
    core.info('='.repeat(60));

    // Set outputs for GitHub Actions
    core.setOutput('junit_files', `${staticXmlFile},${resolvedXmlFile}`);
    core.setOutput('all_passed', staticPassed && resolvedPassed);

    if (!staticPassed || !resolvedPassed) {
      core.setFailed('Security validation failed. Check JUnit report for details.');
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
