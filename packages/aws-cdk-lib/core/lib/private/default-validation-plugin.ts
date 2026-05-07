import type { PolicyValidationPluginReport, PolicyViolation, PolicyViolatingResource } from '../validation/report';
import type { IPolicyValidationPlugin, IPolicyValidationContext } from '../validation';

/**
 * Severity levels from the validation engine, mapped to report severity strings.
 */
const SEVERITY_MAP: Record<string, string> = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warning',
};

/**
 * The default validation plugin that runs the validation engine against
 * synthesized CloudFormation templates.
 *
 * Severity behavior:
 * - fatal: cannot be suppressed, fails synthesis
 * - error: can be suppressed via acknowledge(), fails synthesis until suppressed
 * - warning: can be suppressed via acknowledge(), does not fail synthesis
 * - info/debug: not reported
 */
export class DefaultValidationPlugin implements IPolicyValidationPlugin {
  public readonly name = 'default';
  private _version?: string;

  public get version(): string | undefined {
    return this._version;
  }

  public validate(context: IPolicyValidationContext): PolicyValidationPluginReport {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { RegoEngine, TemplateFile, version } = require('@aws-cdk/validation-engine');
    this._version = version();

    const engine = new RegoEngine();
    try {
      return this.runValidation(engine, TemplateFile, context);
    } finally {
      engine.free();
    }
  }

  private runValidation(engine: any, TemplateFile: any, context: IPolicyValidationContext): PolicyValidationPluginReport {
    const violations: PolicyViolation[] = [];

    for (const templatePath of context.templatePaths) {
      const template = new TemplateFile(templatePath);
      const report = engine.validateStandard(template, { severityLevel: 'WARN' });

      const violationMap = new Map<string, PolicyViolation & { violatingResources: PolicyViolatingResource[] }>();

      for (const diag of report.diagnostics) {
        const severity = SEVERITY_MAP[diag.severity];
        if (!severity) continue;

        const resource: PolicyViolatingResource = {
          resourceLogicalId: diag.resourceId,
          templatePath,
          locations: diag.propertyPath ? [diag.propertyPath] : [],
        };

        const key = diag.ruleId;
        const existing = violationMap.get(key);
        if (existing) {
          existing.violatingResources.push(resource);
        } else {
          violationMap.set(key, {
            ruleName: diag.ruleId,
            description: diag.message,
            severity,
            fix: diag.suggestedFix,
            violatingResources: [resource],
          });
        }
      }

      violations.push(...violationMap.values());
    }

    const hasFatal = violations.some(v => v.severity === 'fatal');
    const hasError = violations.some(v => v.severity === 'error');

    return {
      success: !hasFatal && !hasError,
      violations,
    };
  }
}
