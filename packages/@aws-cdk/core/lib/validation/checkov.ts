import { sync } from 'cross-spawn';
import { IValidationPlugin, ValidationContext } from './validation';

// NOTE: This class will eventually move out to a separate repository, but we're
// keeping it here for now to make it easier to iterate on.

// Design decisions:
// * We don't want to install checkov as a dependency of the CDK, so we'll just
//   shell out to it.
// * Each entry in the checkov output is a separate violation.


/**
 * TODO docs
 */
export class CheckovValidationPlugin implements IValidationPlugin {
  public readonly name = 'Checkov';

  /**
   * TODO docs
   * @returns TODO docs
   */
  isReady(): boolean {
    const { status } = sync('checkov', ['--version'], {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    return status === 0;
  }

  /**
   * TODO docs
   */
  validate(context: ValidationContext) {
    const templatePath = context.stack.templateFullPath;
    const flags = [
      '-f',
      templatePath,
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
          templatePath,
          locations: check.check_result.evaluated_keys,
        },
      });
    });

    context.report.submit(status == 0 ? 'success' : 'failure');
  }
}