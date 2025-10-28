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
    const enableIntrinsicScanner = getInput('enable_intrinsic_scanner', { default: 'false' }).toLowerCase() === 'true';
    setupWorkingDir(workingDir);
    
    const filesChanged = await detectChangedTemplates(baseSha, headSha, workingDir);
    if (!filesChanged) {
      core.info('No template files changed. Skipping validation.');
      return;
    }

    if (!ruleSetPath) throw new Error("Input 'rule_set_path' must be provided.");

    // Run CFN-Guard validation
    core.info(`Running cfn-guard with rule set: ${ruleSetPath}`);
    let cfnGuardOutput = '';
    let cfnGuardError = '';
    const flaggedFiles: string[] = [];
    
    try {
      await exec.exec('cfn-guard', [
        'validate',
        '--data', workingDir,
        '--rules', ruleSetPath,
        '--show-summary', 'none', // We'll handle summary ourselves
        '--output-format', 'json'
      ], {
        listeners: {
          stdout: (data: Buffer) => {
            cfnGuardOutput += data.toString();
          },
          stderr: (data: Buffer) => {
            cfnGuardError += data.toString();
          }
        }
      });
      core.info('✅ CFN-Guard validation passed');
    } catch (err) {
      // Parse and count actual failures
      if (cfnGuardOutput) {
        try {
          const results = JSON.parse(cfnGuardOutput);
          let totalViolations = 0;
          
          for (const result of results) {
            if (result.status === 'FAIL') {
              const fileName = path.basename(result.name);
              if (!flaggedFiles.includes(fileName)) {
                flaggedFiles.push(fileName);
              }
              
              const violations = result.not_compliant || [];
              totalViolations += violations.length;
              
              core.info(`\n❌ ${fileName}:`);
              for (const rule of violations) {
                core.info(`  Rule: ${rule.Rule}`);
                if (rule.message) {
                  core.info(`  Message: ${rule.message}`);
                }
              }
            }
          }
          
          cfnGuardFailures = totalViolations;
        } catch (parseErr) {
          core.warning('Failed to parse cfn-guard output, showing raw output:');
          core.info(cfnGuardOutput);
          cfnGuardFailures = 1; // Fallback to 1 if parsing fails
        }
      } else {
        cfnGuardFailures = 1; // Fallback if no output
      }
      
      const message = `CFN-Guard validation failed with ${cfnGuardFailures} violation(s)`;
      core.warning(message);
      errors.push(message);
    }

    // Run Intrinsic Scanner (only if enabled)
    if (enableIntrinsicScanner) {
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
    } else {
      core.info('ℹ️ Intrinsic scanner disabled (use enable_intrinsic_scanner=true to enable)');
    }

    // Generate Summary Report
    core.info('\n' + '='.repeat(60));
    core.info('🛡️  SECURITY GUARDIAN SUMMARY REPORT');
    core.info('='.repeat(60));
    core.info(`📊 CFN-Guard Violations: ${cfnGuardFailures > 0 ? '❌ ' + cfnGuardFailures + ' violations in ' + flaggedFiles.length + ' file(s)' : '✅ 0'}`);
    core.info(`📊 Intrinsic Scanner: ${enableIntrinsicScanner ? (intrinsicScannerFailures > 0 ? '❌ ' + intrinsicScannerFailures + ' failures' : '✅ 0 failures') : '⏭️ Disabled'}`);
    core.info(`📊 Total Issues Found: ${cfnGuardFailures + intrinsicScannerFailures}`);
    
    if (flaggedFiles.length > 0) {
      core.info('\n📄 Files with CFN-Guard violations:');
      flaggedFiles.forEach(file => core.info(`  - ${file}`));
    }
    
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
