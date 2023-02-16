import * as fs from 'fs';
import * as path from 'path';
import { sync } from 'cross-spawn';
import { IValidationPlugin, IValidation, ValidationContext, ValidationReport } from './validation';
import { FileAssetSource } from '../assets';
import { ISynthesisSession } from '../stack-synthesizers';

// Design decisions:
// * We don't want to install cfnguard as a dependency of the CDK, so we'll just
//   shell out to it.
// * Each entry in the cfnguard output is a separate violation.

export class CfnguardValidation implements IValidation {
  constructor(private readonly rulesPath: string) {

  };
  async validate(context: ValidationContext): Promise<void> {
    // TODO: check whether cfnguard is installed
    if (!this.isCfnguardInstalled()) {
      throw new Error('Cfn-guard is not installed. Install it by running "npm install cfn-guard".');
    }

    await this.checkPolicies(context);
  }

  private isCfnguardInstalled(): boolean {
    const { status } = sync('cfn-guard', ['--version'], {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    return status === 0;
  }

  private async checkPolicies(context: ValidationContext): Promise<void> {
    const flags = [
      'validate',
      '--rules',
      this.rulesPath,
      '--data',
      context.templatePath,
      '--output-format',
      'json',
      '--show-summary',
      'none',
    ];

    const { status, output } = sync('cfn-guard', flags, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    const result = JSON.parse((output ?? []).join(''));
    result.not_compliant.forEach((check: any) => {
      context.report.addViolation({
        fix: check.Rule.checks[0].Clause.Unary.context,
        recommendation: check.Rule.checks[0].Clause.Unary.messages.custom_message,
        ruleName: check.Rule.name,
        violatingResource: {
          resourceName: check.Rule.checks[0].Clause.Unary.check.UnResolved.value.traversed_to.path.split('/')[2],
          templatePath: context.templatePath,
          locations: [check.Rule.checks[0].Clause.Unary.check.UnResolved.value.remaining_query],
        },
      });
    });

    // eslint-disable-next-line no-console
    context.report.submit(status == 0 ? 'success' : 'failure');
  }
}

export interface PluginProps {
  readonly path: string;
}

export class CfnguardValidationPlugin implements IValidationPlugin {
  private readonly path: string;
  private readonly validation: CfnguardValidation;

  constructor(props: PluginProps) {
    this.path = props.path;
    this.validation = new CfnguardValidation(this.path);
  };
  /**
   * TODO docs
   */
  async validate(session: ISynthesisSession, source: FileAssetSource): Promise<ValidationReport> {
    const templateAbsolutePath = path.join(process.cwd(), session.outdir, source.fileName ?? '');
    const template = JSON.parse(fs.readFileSync(templateAbsolutePath, { encoding: 'utf-8' }));
    const validationContext = new ValidationContext('cfn-guard', template, templateAbsolutePath);
    await this.validation.validate(validationContext);
    return validationContext.report;
  }
}