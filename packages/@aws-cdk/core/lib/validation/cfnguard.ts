import { sync } from 'cross-spawn';
import { IValidationPlugin, ValidationContext } from './validation';

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
  validate(context: ValidationContext) {
    const templatePath = context.stack.templateFullPath;
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
      context.report.addViolation({
        fix: check.Rule.checks[0].Clause.Unary.context,
        recommendation: check.Rule.checks[0].Clause.Unary.messages.custom_message,
        ruleName: check.Rule.name,
        violatingResource: {
          resourceName: check.Rule.checks[0].Clause.Unary.check.UnResolved.value.traversed_to.path.split('/')[2],
          templatePath,
          locations: [check.Rule.checks[0].Clause.Unary.check.UnResolved.value.remaining_query],
        },
      });
    });

    // eslint-disable-next-line no-console
    context.report.submit(status == 0 ? 'success' : 'failure');
  }
}