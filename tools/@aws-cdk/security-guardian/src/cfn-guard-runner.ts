import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

export async function runCfnGuardValidation(
  dataDir: string,
  ruleSetPath: string,
  showSummary: string,
  outputFormat: string,
  type: string,
  flaggedFiles: string[],
  errors: string[]
): Promise<number> {
  let cfnGuardOutput = '';
  let failures = 0;

  try {
    await exec.exec('cfn-guard', [
      'validate',
      '--data', dataDir,
      '--rules', ruleSetPath,
      '--show-summary', 'none',
      '--output-format', outputFormat
    ], {
      listeners: {
        stdout: (data: Buffer) => {
          cfnGuardOutput += data.toString();
        },
        stderr: (data: Buffer) => {
          // Ignore stderr for now
        }
      }
    });
    core.info(`✅ CFN-Guard (${type}) validation passed`);
  } catch (err) {
    if (cfnGuardOutput) {
      try {
        const results = JSON.parse(cfnGuardOutput);
        let totalViolations = 0;
        const notApplicableRules = new Set<string>();

        for (const result of results) {
          if (result.status === 'FAIL') {
            const fileName = path.basename(result.name);
            if (!flaggedFiles.includes(fileName)) {
              flaggedFiles.push(fileName);
            }

            const violations = result.not_compliant || [];
            totalViolations += violations.length;

            core.info(`\n❌ ${fileName} (${type}):`);
            for (const rule of violations) {
              core.info(`  Rule: ${rule.Rule}`);
              if (rule.message) {
                core.info(`  Message: ${rule.message}`);
              }
            }
          }
          
          // Collect not applicable rules
          if (result.not_applicable) {
            for (const rule of result.not_applicable) {
              notApplicableRules.add(rule.Rule);
            }
          }
        }

        // Show not applicable rules summary
        if (notApplicableRules.size > 0) {
          core.info(`\nℹ️ Rules not applicable (${type}): ${Array.from(notApplicableRules).join(', ')}`);
        }

        failures = totalViolations;
      } catch (parseErr) {
        core.warning(`Failed to parse cfn-guard (${type}) output`);
        failures = 1;
      }
    } else {
      failures = 1;
    }

    const message = `CFN-Guard (${type}) validation failed with ${failures} violation(s)`;
    core.warning(message);
    errors.push(message);
  }

  return failures;
}