import type { IConstruct } from 'constructs';
import type { PolicyValidationPluginReport, PolicyValidationPluginReportBeta1, PolicyViolatingResourceBeta1, PolicyViolationBeta1 } from './report';

/**
 * Represents a validation plugin that will be executed during synthesis
 *
 * @example
 * /// fixture=validation-plugin
 * class MyPlugin implements IPolicyValidationPlugin {
 *   public readonly name = 'MyPlugin';
 *
 *   public validate(context: IPolicyValidationContext): PolicyValidationPluginReport {
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
export interface IPolicyValidationPlugin {
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
  validate(context: IPolicyValidationContext): PolicyValidationPluginReport;
}

/**
 * Context available to the validation plugin
 */
export interface IPolicyValidationContext {
  /**
   * The absolute path of all templates to be processed
   */
  readonly templatePaths: string[];

  /**
   * The account ID for these templates, if known
   */
  readonly accountId: string | undefined;

  /**
   * The region for these templates, if known
   */
  readonly region: string | undefined;

  /**
   * The root construct of the app being validated.
   *
   * Plugins may walk this tree for typed L1 property access and token
   * resolution via `Stack.of(node).resolve()`. The tree is finalized and
   * should be treated as read-only; mutations have no effect on synthesized
   * output.
   */
  readonly appConstruct: IConstruct;
}

/**
 * Represents a validation plugin that will be executed during synthesis
 *
 * @deprecated Use `IPolicyValidationPlugin` instead.
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
 *
 * @deprecated Use `IPolicyValidationContext` instead.
 */
export interface IPolicyValidationContextBeta1 {
  /**
   * The absolute path of all templates to be processed
   */
  readonly templatePaths: string[];

  /**
   * The root construct of the app being validated.
   *
   * Plugins may walk this tree for typed L1 property access and token
   * resolution via `Stack.of(node).resolve()`. The tree is finalized and
   * should be treated as read-only; mutations have no effect on synthesized
   * output.
   */
  readonly appConstruct: IConstruct;
}

/**
 * Convert an `IPolicyValidationPlugin` to an `IPolicyValidationPluginBeta1`.
 *
 * The stable `PolicyViolatingResource` interface has optional `resourceLogicalId`
 * and `templatePath` fields to support annotation-sourced violations. The Beta1
 * interface keeps those fields required. This adapter bridges the gap by
 * providing fallback values for the optional fields.
 *
 * @internal
 */
export function _toBeta1Plugin(plugin: IPolicyValidationPlugin): IPolicyValidationPluginBeta1 {
  return {
    name: plugin.name,
    version: plugin.version,
    ruleIds: plugin.ruleIds,
    validate(context: IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
      const report = plugin.validate({
        ...context,
        accountId: undefined,
        region: undefined,
      });
      return {
        success: report.success,
        pluginVersion: report.pluginVersion,
        metadata: report.metadata,
        violations: report.violations.map((v): PolicyViolationBeta1 => ({
          ruleName: v.ruleName,
          description: v.description,
          fix: v.fix,
          severity: v.severity,
          ruleMetadata: v.ruleMetadata,
          violatingResources: v.violatingResources.map((r): PolicyViolatingResourceBeta1 => ({
            resourceLogicalId: r.resourceLogicalId ?? '',
            templatePath: r.templatePath ?? '',
            locations: r.locations,
          })),
        })),
      };
    },
  };
}

