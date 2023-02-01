import { sync } from 'cross-spawn';
import { Validation, ValidationContext } from './validation';

// Design decisions:
// * We don't want to install checkov as a dependency of the CDK, so we'll just
//   shell out to it.
// * Each entry in the checkov output is a separate violation.

export class CheckovValiation implements Validation {
  async validate(context: ValidationContext): Promise<void> {
    // TODO: check whether checkov is installed

    const flags = [
      '-f',
      context.templatePath,
      '-o',
      'json',
    ];

    const { status, output } = sync('checkov', flags, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    const result = JSON.parse((output ?? []).join(''));

    result.results.failed_checks.forEach((check: any) => {
      context.report.addViolation({
        fix: check.guideline,
        recommendation: check.check_name,
        ruleName: check.check_id,
        violatingResource: {
          resourceName: check.resource.split('.')[1],
          templatePath: context.templatePath,
          locations: check.check_result.evaluated_keys,
        },
      });
    });

    context.report.submit(status == 0 ? 'success' : 'failure');
  }
}