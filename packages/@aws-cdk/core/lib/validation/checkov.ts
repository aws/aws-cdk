import * as fs from 'fs';
import * as path from 'path';
import { sync } from 'cross-spawn';
import { IValidationPlugin, IValidation, ValidationContext, ValidationReport } from './validation';
import { FileAssetSource } from '../assets';
import { ISynthesisSession } from '../stack-synthesizers';

// Design decisions:
// * We don't want to install checkov as a dependency of the CDK, so we'll just
//   shell out to it.
// * Each entry in the checkov output is a separate violation.

/**
 * TODO docs
 */
export class CheckovValiation implements IValidation {
  /**
   * TODO docs
   */
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

/**
 * TODO docs
 */
export class CheckovValidationPlugin implements IValidationPlugin {
  private readonly validation = new CheckovValiation();

  /**
   * TODO docs
   */
  async validate(session: ISynthesisSession, source: FileAssetSource): Promise<ValidationReport> {
    const templateAbsolutePath = path.join(process.cwd(), session.outdir, source.fileName ?? '');
    const template = JSON.parse(fs.readFileSync(templateAbsolutePath, { encoding: 'utf-8' }));
    const validationContext = new ValidationContext('Checkov', template, templateAbsolutePath);
    await this.validation.validate(validationContext);
    return validationContext.report;
  }
}