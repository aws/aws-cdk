import { RegoEngine, TemplateFile, version } from '@aws/cloudformation-validate';
import type { Engine, EngineConfig, RuleInfo, Severity } from '@aws/cloudformation-validate';
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
      .filter((r: RuleInfo) => !IGNORE_RULES.has(r.id))
      .map((r: RuleInfo) => r.id);
  }

  public validate(context: IPolicyValidationContext): PolicyValidationPluginReport {
    const violations: MutableViolation[] = [];

    for (const templatePath of context.templatePaths) {
      const templateFile = new TemplateFile(templatePath);
      const report = this.engine.validateStandard(templateFile, {});

      for (const diagnostic of report.diagnostics) {
        if (IGNORE_RULES.has(diagnostic.ruleId)) {
          continue;
        }

        const severity = mapSeverity(diagnostic.severity);
        if (severity === 'debug' || severity === 'informational') {
          continue;
        }

        const violatingResource: PolicyViolatingResource = {
          resourceLogicalId: diagnostic.resourceId,
          templatePath,
          locations: diagnostic.propertyPath ? [diagnostic.propertyPath] : [],
        };

        const existing = violations.find(
          v => v.ruleName === diagnostic.ruleId && v.severity === severity,
        );

        if (existing) {
          existing.violatingResources.push(violatingResource);
        } else {
          violations.push({
            ruleName: diagnostic.ruleId,
            description: diagnostic.message,
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
    case 'FATAL': return 'fatal';
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
  'W3005',

  // WHAT: Condition can never be false.
  // WHY: The engine assumes AWS::Partition can only ever equal 'aws', which is not true.
  'W1028',

  // WHAT: Unknown resource type
  // WHY: Engine complains about AWS::CDK::Metadata, which is quite common in our templates :>
  'E9001',
]);
