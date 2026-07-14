import { RegoEngine, TemplateFile, version } from '@aws/cloudformation-validate';
import type { Engine, EngineConfig, RuleInfo, Severity } from '@aws/cloudformation-validate';
import type { PolicyValidationPluginReport, PolicyViolatingResource } from './report';
import type { IPolicyValidationPlugin, IPolicyValidationContext } from './validation';
import * as cxapi from '../../../cx-api';

interface MutableViolation {
  ruleName: string;
  description: string;
  severity?: string;
  fix?: string;
  violatingResources: PolicyViolatingResource[];
  ruleMetadata?: { readonly [key: string]: string };
}

/**
 * A custom rule source for the validation engine.
 */
export interface ValidationRuleSource {
  /**
   * The name of the rule source.
   */
  readonly name: string;

  /**
   * The rule content (e.g., Rego policy source code).
   */
  readonly content: string;
}

/**
 * Properties for configuring the CloudFormationValidatePlugin.
 */
export interface CloudFormationValidatePluginProps {
  /**
   * Custom Rego rules to evaluate in addition to built-in rules.
   *
   * @default - no custom rules
   */
  readonly regoRules?: ValidationRuleSource[];

  /**
   * Custom Guard rules to evaluate in addition to built-in rules.
   *
   * @default - no guard rules
   */
  readonly guardRules?: ValidationRuleSource[];
}

/**
 * Validation plugin that uses the CloudFormation validation engine
 * to evaluate templates against built-in rules.
 */
export class CloudFormationValidatePlugin implements IPolicyValidationPlugin {
  /**
   * The default name of this plugin
   */
  public static readonly PLUGIN_NAME = 'CloudFormation Validate';

  /**
   * Return a global singleton instance of this plugin.
   *
   * This is used because initializing the engine is somewhat expensive, which makes
   * a noticeable difference in tests.
   *
   * @internal
   */
  public static _singletonInstance() {
    if (!CloudFormationValidatePlugin._instance) {
      CloudFormationValidatePlugin._instance = new CloudFormationValidatePlugin();
    }
    return CloudFormationValidatePlugin._instance;
  }

  private static _instance: CloudFormationValidatePlugin | undefined;

  public readonly name = CloudFormationValidatePlugin.PLUGIN_NAME;

  private readonly engine: Engine;

  constructor(props: CloudFormationValidatePluginProps = {}) {
    const config: EngineConfig = {};
    if (props.regoRules) {
      config.customRules = props.regoRules;
    }
    if (props.guardRules) {
      config.guardRules = props.guardRules;
    }
    this.engine = new RegoEngine(config);
  }

  public get version(): string | undefined {
    return version();
  }

  public get ruleIds(): string[] | undefined {
    return this.engine.listRules()
      // Pretend the ignored rules don't exist
      .filter((r: RuleInfo) => !IGNORE_RULES.has(r.id))
      .map((r: RuleInfo) => r.id);
  }

  public validate(context: IPolicyValidationContext): PolicyValidationPluginReport {
    const violations: MutableViolation[] = [];

    for (const templatePath of context.templatePaths) {
      const templateFile = new TemplateFile(templatePath);
      const report = this.engine.validateStandard(templateFile, {
        // Environment-agnostic stacks use these cx-api sentinels in the cloud assembly. Omitting
        // them lets the engine model the pseudo-parameters symbolically instead of validating the
        // sentinel text as if it were a real account or region.
        pseudoParameterOverrides: {
          accountId: context.accountId === cxapi.UNKNOWN_ACCOUNT ? undefined : context.accountId,
          region: context.region === cxapi.UNKNOWN_REGION ? undefined : context.region,
        },
        exclude: {
          ids: [...IGNORE_RULES],
          services: [{
            // CDK still synthesizes AWS::AutoScaling::LaunchConfiguration for applications using
            // the legacy launch-configuration behavior. Auto Scaling remains deployable despite
            // its maintenance-mode classification, so suppress only its W3697 lifecycle warning
            // rather than hiding lifecycle findings for every service.
            // <https://github.com/aws-cloudformation/cloudformation-validate/issues/37>
            ruleId: 'W3697',
            service: 'AWS::AutoScaling',
          }],
        },
        severityLevel: 'WARN',
      });

      for (const diagnostic of report.diagnostics) {
        const severity = mapSeverity(diagnostic.severity);

        const violatingResource: PolicyViolatingResource = {
          resourceLogicalId: diagnostic.resourceId,
          templatePath,
          locations: diagnostic.propertyPath ? [diagnostic.propertyPath] : [],
        };

        const existing = violations.find(
          v => v.ruleName === diagnostic.ruleId && v.severity === severity,
        );

        const propertyPathPefix = diagnostic.propertyPath ? `${diagnostic.propertyPath.replace(/^Properties\./, '')}: ` : '';

        if (existing) {
          existing.violatingResources.push(violatingResource);
        } else {
          violations.push({
            ruleName: diagnostic.ruleId,
            description: `${propertyPathPefix}${diagnostic.message}`,
            severity,
            fix: diagnostic.suggestedFix,
            violatingResources: [violatingResource],
            ruleMetadata: diagnostic.category ? { category: diagnostic.category } : undefined,
          });
        }
      }
    }

    return {
      success: violations.every(v => v.severity !== 'error' && v.severity !== 'fatal'),
      violations,
    };
  }
}

function mapSeverity(severity: Severity): string {
  switch (severity) {
    // FIXME: Temporarily map FATAL to ERROR; FATALs are not suppressible but there are still a lot
    // of false positives in the engine, and we cannot afford to accidentally present a customer with
    // an accidentally unsupressible fatal.
    case 'FATAL': return 'error';
    case 'ERROR': return 'error';
    case 'WARN': return 'warning';
    case 'INFO': return 'informational';
    case 'DEBUG': return 'debug';
    default: return 'warning';
  }
}

// Rules that the engine will report but we want to ignore because CDK creates
// the violation and customers don't control it.
const IGNORE_RULES = new Set([
  // WHAT: 'DependsOn' already implied by a 'GetAtt', remove the DependsOn.
  // WHY: CDK adds both. It doesn't hurt to have both, and it's more effort to remove them.
  // Will be silenced forever.
  'W3005',

  // WHAT: Optimize the format string of Fn::Sub
  // WHY: CDK is generating these, humans are not authoring them.
  // Will be silenced forever.
  'W1020',

  // WHAT: Validate AMI format (must look like ami-xxxx)
  // WHY: CDK uses `AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>` to resolve AMIs, which the engine doesn't understand.
  // Should be removed after <https://github.com/aws-cloudformation/cloudformation-validate/issues/34> is resolved.
  'E1152', 'W2506',

  // WHAT: That's not a valid attribute!
  // WHY: The source of truth is too limited.
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/39>.
  'E9004',

  // WHAT: "Hardcoded account ID in ARN — use AWS::AccountId pseudo-parameter"
  // WHY: In some cases, the engine reports this violation even when the AWS::AccountId was used.
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/41>.
  'W9013',

  // WHAT: "Output value must be a string"
  // WHY: The engine falsely flags the pattern `{"Fn::Join": ["||", {"Fn::GetAtt": ["ID", "SomeAttr"]}]}` as a case of output value being an array
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/45>.
  'F6101',

  // WHAT: Not a valid SecurityGroup Id
  // WHY: The engine doesn't understand that the `ClusterSecurityGroupId` attribute of an EKS cluster returns a security group ID
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/46>.
  'E1150',

  // WHAT: Regional inferences cannot be trusted
  // WHY: The engine assumes that the region is always 'us-east-1' when evaluating certain rules, which is not true.
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/49>.
  'E3620', 'E3652', 'E3628',

  // WHAT: Circular dependency detection
  // WHY: Something seems fishy about it
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/53>.
  'F3004',

  // WHAT: Required property not supplied
  // WHY: Engine hallucinates required properties
  // <https://github.com/aws-cloudformation/cloudformation-validate/issues/54>
  'F3003',

  // WHAT: Hardcoded ARNs
  // WHY: Hardcoding an ARN is part of the behavior of some constructs (e.g., setting up multi-account DynamoDB table replicas)
  'W9002',

  // WHAT: Array must be non-empty
  // WHY: requirement seems to be hallucinated by the engine
  // <https://github.com/aws-cloudformation/cloudformation-validate/issues/62>
  'F3032',

  // WHAT: Validate maximum string length, string matches regex
  // WHY: At least { Ref: 'AWS::AccountId' } produces a string that does not validate according to common rules.
  // <https://github.com/aws-cloudformation/cloudformation-validate/issues/65>
  'F3033',

  // WHAT: Parameter 'X': Default must be a string
  // WHY: Using Fn::GetStackOutput as the argument for Default incorrectly triggers this rule
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/63>
  'E2001',

  // WHAT: Mixing inline definitions with external body in RestAPI
  // WHY: Resources like Deployment and Stage are needed to actually deploy a RestApi, even when the body comes from S3
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/64>
  'W3660',
]);
