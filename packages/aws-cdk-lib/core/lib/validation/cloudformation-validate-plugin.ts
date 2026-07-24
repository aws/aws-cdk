import * as fs from 'fs';
import { RegoEngine, TemplateFile, version } from '@aws/cloudformation-validate';
import type { DetailedDiagnostic, Engine, EngineConfig, RuleInfo, Severity } from '@aws/cloudformation-validate';
import type { PolicyValidationPluginReport, PolicyViolatingResource } from './report';
import type { IPolicyValidationPlugin, IPolicyValidationContext } from './validation';

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
      .filter((r: RuleInfo) => !IGNORE_RULES.has(r.id) && r.severity !== 'INFO' && r.severity !== 'DEBUG')
      .map((r: RuleInfo) => r.id);
  }

  public validate(context: IPolicyValidationContext): PolicyValidationPluginReport {
    const violations: MutableViolation[] = [];

    for (const { stackConstructPath, templatePath } of context.stackTemplates) {
      const templateFile = new TemplateFile(templatePath);
      const report = this.engine.validateDetailed(templateFile, {
        pseudoParameterOverrides: {
          accountId: context.accountId,
          region: context.region,
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

      // Parsed lazily (and only once) because it is only needed to filter out
      // specific engine false positives, which most templates don't trigger.
      let parsedTemplate: any;
      const template = () => parsedTemplate ??= JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

      for (const diagnostic of report.diagnostics) {
        // The engine reports a false positive for ICMP security group rules; drop those findings.
        if (diagnostic.ruleId === 'E9002' && isIcmpPortRangeFalsePositive(diagnostic, template())) {
          continue;
        }

        const severity = mapSeverity(diagnostic.severity);

        const violatingResource: PolicyViolatingResource = {
          resourceLogicalId: diagnostic.resourceId,
          // If this is not about any resources, best we can do is point it to the stack
          constructPath: !diagnostic.resourceId ? stackConstructPath : undefined,
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

const SECURITY_GROUP_RULE_TYPES = new Set([
  'AWS::EC2::SecurityGroup',
  'AWS::EC2::SecurityGroupIngress',
  'AWS::EC2::SecurityGroupEgress',
]);

/**
 * Whether an `E9002` ("FromPort is greater than ToPort") finding is a false positive on an ICMP rule.
 *
 * For ICMP/ICMPv6 security group rules the `FromPort`/`ToPort` fields encode the ICMP type and code
 * (where `-1` means "all"), not an ordered port range, so e.g. `Port.icmpPing()` legitimately renders
 * `FromPort: 8, ToPort: -1`. The engine's generic range check flags these as errors. We correlate the
 * finding back to the offending rule (by the ports named in the message, since the property path only
 * points at the rule array) and drop it only when that rule uses an ICMP protocol, leaving genuine
 * TCP/UDP range errors — including on the same resource — reported.
 *
 * Remove once the engine understands ICMP rules: <https://github.com/aws/aws-cdk/issues/38389>.
 */
function isIcmpPortRangeFalsePositive(diagnostic: DetailedDiagnostic, template: any): boolean {
  if (!diagnostic.resourceType || !SECURITY_GROUP_RULE_TYPES.has(diagnostic.resourceType)) {
    return false;
  }

  const match = /FromPort (-?\d+) is greater than ToPort (-?\d+)/.exec(diagnostic.message ?? '');
  if (!match) {
    return false;
  }
  const fromPort = Number(match[1]);
  const toPort = Number(match[2]);

  const resource = template?.Resources?.[diagnostic.resourceId ?? ''];
  if (!resource) {
    return false;
  }

  const props = resource.Properties ?? {};
  // A rule can live in a SecurityGroup's inline ingress/egress arrays, or be the standalone
  // SecurityGroupIngress/Egress resource's own properties.
  const rules = [
    ...(Array.isArray(props.SecurityGroupIngress) ? props.SecurityGroupIngress : []),
    ...(Array.isArray(props.SecurityGroupEgress) ? props.SecurityGroupEgress : []),
    props,
  ];

  return rules.some((rule) => rule != null
    && isIcmpProtocol(rule.IpProtocol)
    && Number(rule.FromPort) === fromPort
    && Number(rule.ToPort) === toPort);
}

/**
 * Whether an `IpProtocol` value refers to ICMP or ICMPv6, given either as a name or an IANA number.
 */
function isIcmpProtocol(protocol: unknown): boolean {
  if (typeof protocol === 'string') {
    const normalized = protocol.toLowerCase();
    return normalized === 'icmp' || normalized === 'icmpv6' || normalized === '1' || normalized === '58';
  }
  if (typeof protocol === 'number') {
    return protocol === 1 || protocol === 58;
  }
  return false;
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

  // WHAT: Condition can never be false.
  // WHY: The engine assumes AWS::Partition can only ever equal 'aws', which is not true. Should be removed.
  'W1028',

  // WHAT: Circular dependency detection
  // WHY: Something seems fishy about it
  // Remove after <https://github.com/aws-cloudformation/cloudformation-validate/issues/53>.
  'F3004',

  // WHAT: Hardcoded ARNs
  // WHY: Hardcoding an ARN is part of the behavior of some constructs (e.g., setting up multi-account DynamoDB table replicas)
  'W9002',

  // WHAT: Hardcoded account IDs in ARNs
  // WHY: Hardcoding an account ID in ARNs is commonly done in CDK when we are setting up large applications that
  // span accounts.
  'W9013',

  // WHAT: Lambda Permission should always have a SourceAccount
  // WHY: It doesn't seem to detect the account that's there in the ARN?
  // <https://github.com/aws-cloudformation/cloudformation-validate/issues/183>
  'W3663',

  // WHAT: value type tracking (parameter default should be a string)
  // WHY: When the value is imported, it is considered not a string.
  // <https://github.com/aws-cloudformation/cloudformation-validate/issues/194>
  'E2001',
]);
