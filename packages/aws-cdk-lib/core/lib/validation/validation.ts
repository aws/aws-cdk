import type { PolicyValidationPluginReportBeta1 } from './report';

/**
 * Represents a validation plugin that will be executed during synthesis
 *
 * @example
 * /// fixture=validation-plugin
 * class MyPlugin implements IPolicyValidationPluginBeta1 {
 *   public readonly name = 'MyPlugin';
 *
 *   public validate(context: IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
 *     // First read the templates using context.templatePaths...
 *
 *     // ...then perform the validation, and then compose and return the report.
 *     // Using hard-coded values here for better clarity:
 *     return {
 *       success: false,
 *       violations: [{
 *         ruleName: 'CKV_AWS_117',
 *         description: 'Ensure that AWS Lambda function is configured inside a VPC',
 *         fix: 'https://docs.bridgecrew.io/docs/ensure-that-aws-lambda-function-is-configured-inside-a-vpc-1',
 *         violatingResources: [{
 *           resourceLogicalId: 'MyFunction3BAA72D1',
 *           templatePath: '/home/johndoe/myapp/cdk.out/MyService.template.json',
 *           locations: ['Properties/VpcConfig'],
 *         }],
 *       }],
 *     };
 *   }
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
   * The list of rule IDs that the plugin will evaluate. Used for analytics
   * purposes.
   *
   * @default - No rule is reported
   */
  readonly ruleIds?: string[];

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
