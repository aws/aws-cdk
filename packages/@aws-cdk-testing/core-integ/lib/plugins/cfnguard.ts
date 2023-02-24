import { IValidationPlugin, IValidationContext, ValidationReportStatus } from '@aws-cdk/core';
import { sync } from 'cross-spawn';

// Design decisions:
// * We don't want to install cfnguard as a dependency of the CDK, so we'll just
//   shell out to it.
// * Each entry in the cfnguard output is a separate violation.

export interface PluginProps {
  readonly path: string;
}

export class CfnguardValidationPlugin implements IValidationPlugin {
  private readonly rulesPath: string;
  public readonly name = 'CFN Guard';

  constructor(props: PluginProps) {
    this.rulesPath = props.path;
  }

  /**
   * TODO docs
   * @returns TODO docs
   */
  isReady(): boolean {
    const { status } = sync('cfn-guard', ['--version'], {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    return status === 0;
  }

  /**
   * TODO docs
   */
  validate(context: IValidationContext) {
    const templatePath = context.templateFullPath;
    const flags = [
      'validate',
      '--rules',
      this.rulesPath,
      '--data',
      templatePath,
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
      context.report.addViolation(this.name, {
        fix: check.Rule.checks[0].Clause.Unary.context,
        recommendation: check.Rule.checks[0].Clause.Unary.messages.custom_message,
        ruleName: check.Rule.name,
        violatingResources: [{
          resourceName: check.Rule.checks[0].Clause.Unary.check.UnResolved.value.traversed_to.path.split('/')[2],
          templatePath,
          locations: [check.Rule.checks[0].Clause.Unary.check.UnResolved.value.remaining_query],
        }],
      });
    });

    // eslint-disable-next-line no-console
    context.report.submit(this.name, status == 0 ? ValidationReportStatus.SUCCESS : ValidationReportStatus.FAILURE);
  }
}
