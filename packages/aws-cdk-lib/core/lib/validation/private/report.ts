import * as path from 'path';
import type {
  PluginReportJson,
  PolicyValidationReportConclusion,
  PolicyValidationReportJson,
  PolicyViolationJson,
  PolicyViolationSeverity,
  SuppressedViolationJson,
  ViolatingConstructJson,
} from '@aws-cdk/cloud-assembly-schema';
import type { ConstructTree, ConstructTrace } from './construct-tree';
import { ReportTrace } from './trace';
import * as report from '../report';

/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface PolicyViolationConstructAware extends report.PolicyViolation {
  /**
   * The constructs violating this rule.
   */
  readonly violatingConstructs: ValidationViolatingConstruct[];
}

/**
 * Construct violating a specific rule.
 */
export interface ValidationViolatingConstruct extends report.PolicyViolatingResource {
  /**
   * The construct path as defined in the application.
   *
   * @default - construct path will be empty if the cli is not run with `--debug`
   */
  readonly constructPath?: string;

  /**
   * A stack of constructs that lead to the violation.
   *
   * @default - stack will be empty if the cli is not run with `--debug`
   */
  readonly constructStack?: ConstructTrace;
}

/**
 * JSON representation of the report.
 */
export interface LegacyPolicyValidationReportJson {
  /**
   * Report title.
   */
  readonly title: string;

  /**
   * Reports for all of the validation plugins registered
   * in the app
   */
  readonly pluginReports: LegacyPluginReportJson[];
}

/**
 * A report from a single plugin
 */
export interface LegacyPluginReportJson {
  /**
   * List of violations in the report.
   */
  readonly violations: PolicyViolationConstructAware[];

  /**
   * Report summary.
   */
  readonly summary: LegacyPolicyValidationReportSummary;

  /**
   * Plugin version.
   */
  readonly version?: string;
}

/**
 * Summary of the report.
 */
export interface LegacyPolicyValidationReportSummary {
  /**
   * The final status of the validation (pass/fail)
   */
  readonly status: report.PolicyValidationReportStatus;

  /**
   * The name of the plugin that created the report
   */
  readonly pluginName: string;

  /**
   * Additional metadata about the report. This property is intended
   * to be used by plugins to add additional information.
   *
   * @default - no metadata
   */
  readonly metadata?: { readonly [key: string]: string };
}

/**
 * The report containing the name of the plugin that created it.
 */
export interface NamedValidationPluginReport extends report.PolicyValidationPluginReport {
  /**
   * The name of the plugin that created the report
   */
  readonly pluginName: string;
}

/**
 * A violation that was suppressed, carrying acknowledgement metadata.
 * Used internally to pass suppressed violations from synthesis to the formatter.
 */
export interface SuppressedViolation extends report.PolicyViolation {
  readonly acknowledgedId: string;
  readonly reason?: string;
  readonly acknowledgedAt?: string;
  readonly acknowledgedStackTrace?: string;
}

/**
 * The report emitted by the plugin after evaluation.
 */
export class PolicyValidationReportFormatter {
  private readonly reportTrace: ReportTrace;
  constructor(private readonly tree: ConstructTree) {
    this.reportTrace = new ReportTrace(tree);
  }

  public formatLegacyJson(reps: NamedValidationPluginReport[]): LegacyPolicyValidationReportJson {
    return {
      title: 'Validation Report',
      pluginReports: reps
        // Include reports that failed OR have violations to render. This is
        // broader than the original `!rep.success` filter: a source that
        // returns success=true with violations (e.g. annotation warnings)
        // will now appear in the report. This is intentional — violations
        // should always be visible regardless of the overall success status.
        .filter(rep => !rep.success || rep.violations.length > 0)
        .map(rep => ({
          version: rep.pluginVersion,
          summary: {
            pluginName: rep.pluginName,
            status: rep.success ? report.PolicyValidationReportStatus.SUCCESS : report.PolicyValidationReportStatus.FAILURE,
            metadata: rep.metadata,
          },
          violations: rep.violations.map(violation => ({
            ruleName: violation.ruleName,
            description: violation.description,
            fix: violation.fix,
            ruleMetadata: violation.ruleMetadata,
            severity: violation.severity,
            violatingResources: violation.violatingResources,
            violatingConstructs: violation.violatingResources.map(resource => {
              // Use constructPath from the input if provided (e.g. annotations),
              // otherwise derive it from the logical ID via the construct tree.
              const constructPath = resource.constructPath ?? (
                resource.templatePath && resource.resourceLogicalId
                  ? this.tree.getConstructByLogicalId(
                    path.basename(resource.templatePath),
                    resource.resourceLogicalId,
                  )?.node.path
                  : undefined
              );
              return {
                constructStack: constructPath ? this.reportTrace.formatJson(constructPath) : undefined,
                constructPath: constructPath,
                locations: resource.locations,
                resourceLogicalId: resource.resourceLogicalId ?? 'N/A',
                templatePath: resource.templatePath ?? 'N/A',
              };
            }),
          })),
        })),
    };
  }

  public formatJson(
    reps: NamedValidationPluginReport[],
    schemaVersion: string,
    suppressedByReport?: Map<number, SuppressedViolation[]>,
  ): PolicyValidationReportJson {
    return {
      version: schemaVersion,
      title: 'Validation Report',
      pluginReports: this.buildPluginReports(reps, suppressedByReport),
    };
  }

  private formatViolationJson(violation: report.PolicyViolation): PolicyViolationJson {
    const severity = normalizeSeverity(violation.severity);
    return {
      ruleName: violation.ruleName,
      description: violation.description,
      suggestedFix: violation.fix,
      severity: severity.severity,
      customSeverity: severity.customSeverity,
      ruleMetadata: violation.ruleMetadata,
      violatingConstructs: violation.violatingResources.map(resource => {
        let constructPath = resource.constructPath;

        // If the construct path is not reported, let's try to guess it from the template name and the logical ID
        if (!constructPath && resource.templatePath && resource.resourceLogicalId) {
          constructPath = this.tree.getConstructByLogicalId(
            path.basename(resource.templatePath),
            resource.resourceLogicalId,
          )?.node.path;
        }

        const constructInfo = constructPath
          ? this.tree.constructTraceLevelFromConstructPath(constructPath)
          : undefined;

        const result: ViolatingConstructJson = {
          // The constructPath is not optional in the output JSON, so put an empty string here if we don't have it.
          constructPath: constructPath ?? '',
          constructFqn: constructInfo?.construct,
          libraryVersion: constructInfo?.libraryVersion,
          cloudFormationResource: resource.resourceLogicalId && resource.templatePath
            ? {
              templatePath: resource.templatePath,
              logicalId: resource.resourceLogicalId,
              propertyPaths: resource.locations.length > 0 ? resource.locations : undefined,
            }
            : undefined,

          // TODO: Property-level stack trace
          stackTraces: constructPath
            ? this.creationStackTrace(constructPath)
            : undefined,
        };
        return result;
      }),
    };
  }

  private formatSuppressedViolationJson(sv: SuppressedViolation): SuppressedViolationJson {
    const base = this.formatViolationJson(sv);
    return {
      ...base,
      acknowledgedId: sv.acknowledgedId,
      reason: sv.reason || undefined,
      acknowledgedAt: sv.acknowledgedAt || undefined,
      acknowledgedStackTrace: sv.acknowledgedStackTrace || undefined,
    };
  }

  private buildPluginReports(
    reps: NamedValidationPluginReport[],
    suppressedByReport?: Map<number, SuppressedViolation[]>,
  ): PluginReportJson[] {
    const results: PluginReportJson[] = [];
    for (let idx = 0; idx < reps.length; idx++) {
      const rep = reps[idx];
      const suppressed = suppressedByReport?.get(idx);
      if (rep.success && rep.violations.length === 0 && !suppressed) continue;
      results.push({
        pluginName: rep.pluginName,
        pluginVersion: rep.pluginVersion,
        conclusion: (rep.success ? 'success' : 'failure') satisfies PolicyValidationReportConclusion,
        metadata: rep.metadata,
        violations: rep.violations.map(violation => this.formatViolationJson(violation)),
        suppressedViolations: suppressed
          ? suppressed.map(sv => this.formatSuppressedViolationJson(sv))
          : undefined,
      });
    }
    return results;
  }

  /**
   * Returns all stack traces on the root path of the construct tree for the given construct path.
   *
   * First element of the array will be the stack trace of the root, the next
   * the stack trace of the first stack, etc. The last element of the array will
   * be the stack trace of the construct itself.
   */
  private creationStackTrace(constructPath: string): string[] | undefined {
    return this.reportTrace.creationStackTraceByPath(constructPath);
  }
}

const KNOWN_SEVERITIES = new Set(['fatal', 'error', 'warning', 'info']);

function normalizeSeverity(severity: string | undefined): { severity: PolicyViolationSeverity; customSeverity?: string } {
  if (!severity) {
    return { severity: 'error' };
  }
  const lower = severity.toLowerCase();
  if (KNOWN_SEVERITIES.has(lower)) {
    return { severity: lower as PolicyViolationSeverity };
  }
  return { severity: 'custom', customSeverity: severity };
}

export function mkPluginFailure(plugin: { name: string; version?: string }, e: Error): NamedValidationPluginReport {
  return {
    success: false,
    pluginName: plugin.name,
    pluginVersion: plugin.version,
    violations: [],
    metadata: {
      error: `Validation plugin '${plugin.name}' failed: ${e.message}`,
    },
  };
}

export function isPluginFailure(rep: NamedValidationPluginReport): string | undefined {
  if (!rep.success && rep.violations.length === 0) {
    return rep.metadata?.error;
  }
  return undefined;
}

/**
 * Report whether it is possible to suppress this violation.
 *
 * Violations that are reported as "fatal", or that have been converted from annotations, cannot be suppressed.
 */
export function isSuppressibleViolation(violation: { severity?: string; ruleMetadata?: { [key: string]: string } }): boolean {
  const isFatal = violation.severity?.toLowerCase() === 'fatal';
  const isErrorAnnotation = violation.ruleMetadata?.['cdk:annotation'] && violation.severity?.toLowerCase() === 'error';
  return !isFatal && !isErrorAnnotation;
}
