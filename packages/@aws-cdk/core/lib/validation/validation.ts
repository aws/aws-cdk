import { IValidationReport } from './report';

/**
 * Represents a validation plugin that will be executed during synthesis
 *
 * @example
 * class MyCustomValidatorPlugin implements IValidationPlugin {
 *    public readonly name = 'my-custom-plugin';
 *
 *    public isReady(): boolean {
 *      // check if the plugin tool is installed
 *      return true;
 *    }
 *
 *    public validate(context: ValidationContext): void {
 *      const templatePath = context.stack.templateFullPath;
 *      // perform validation on the template
 *      // if there are any failures report them
 *      context.report.addViolation({
 *        ruleName: 'rule-name',
 *        recommendation: 'description of the rule',
 *        violatingResources: [{
 *          resourceName: 'FailingResource',
 *          templatePath,
 *        }],
 *      });
 *    }
 * }
 */
export interface IValidationPlugin {
  /**
   * The name of the plugin that will be displayed in the validation
   * report
   */
  readonly name: string;

  /**
   * The method that will be called by the CDK framework to perform
   * validations. This is where the plugin will evaluate the CloudFormation
   * templates for compliance and report and violations
   */
  validate(context: IValidationContext): void;

  /**
   * This method returns whether or not the plugin is ready to execute
   */
  isReady(): boolean;
}

export interface IValidationContext {
  /**
   * Report emitted by the validation.
   *
   * Plugins should interact with this object to generate the report.
   */
  readonly report: IValidationReport;

  /**
   * The full path to the CloudFormation template in the Cloud Assembly
   */
  readonly templateFullPath: string;
}
