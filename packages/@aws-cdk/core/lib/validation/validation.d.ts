import { PolicyValidationPluginReportBeta1 } from './report';
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
 *    public validate(context: IValidationContext): ValidationPluginReport {
 *      const templatePaths = context.templatePaths;
 *      // perform validation on the template
 *      // if there are any failures report them
 *      return {
 *        pluginName: this.name,
 *        success: false,
 *        violations: [{
 *          ruleName: 'rule-name',
 *          description: 'description of the rule',
 *          violatingResources: [{
 *            resourceName: 'FailingResource',
 *            templatePath: '/path/to/stack.template.json',
 *          }],
 *      });
 *    }
 * }
 */
export interface IPolicyValidationPluginBeta1 {
    /**
     * The name of the plugin that will be displayed in the validation
     * report
     */
    readonly name: string;
    /**
     * The version of the plugin, following the Semantic Versioning specification (see
     * https://semver.org/). This version is used for analytics purposes, to
     * measure the usage of different plugins and different versions. The value of
     * this property should be kept in sync with the actual version of the
     * software package. If the version is not provided or is not a valid semantic
     * version, it will be reported as `0.0.0`.
     */
    readonly version?: string;
    /**
     * The method that will be called by the CDK framework to perform
     * validations. This is where the plugin will evaluate the CloudFormation
     * templates for compliance and report and violations
     */
    validate(context: IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1;
}
/**
 * Context available to the validation plugin
 */
export interface IPolicyValidationContextBeta1 {
    /**
     * The absolute path of all templates to be processed
     */
    readonly templatePaths: string[];
}
