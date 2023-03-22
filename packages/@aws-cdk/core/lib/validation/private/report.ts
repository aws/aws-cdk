import * as os from 'os';
import { table } from 'table';
import { ConstructTree, ConstructTrace } from './construct-tree';
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
export interface PolicyValidationReportJson {
  /**
   * Report title.
   */
  readonly title: string;

  /**
   * Reports for all of the validation plugins registered
   * in the app
   */
  readonly pluginReports: PluginReportJson[];
}

/**
 * A report from a single plugin
 */
export interface PluginReportJson {
  /**
   * List of violations in the report.
   */
  readonly violations: PolicyViolationConstructAware[];

  /**
   * Report summary.
   */
  readonly summary: PolicyValidationReportSummary;
}

/**
 * Summary of the report.
 */
export interface PolicyValidationReportSummary {
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
 * The report emitted by the plugin after evaluation.
 */
export class PolicyValidationReportFormatter {
  private readonly reportTrace: ReportTrace;
  constructor(private readonly tree: ConstructTree) {
    this.reportTrace = new ReportTrace(tree);
  }


  public formatPrettyPrinted(reps: NamedValidationPluginReport[]): string {
    const json = this.formatJson(reps);
    const output = [json.title];

    output.push('-'.repeat(json.title.length));
    json.pluginReports.forEach(plugin => {
      output.push('');
      output.push('(Summary)');
      output.push('');
      output.push(table([
        ['Status', plugin.summary.status],
        ['Plugin', plugin.summary.pluginName],
        ...Object.entries(plugin.summary.metadata ?? {}),
      ]));

      if (plugin.violations.length > 0) {
        output.push('');
        output.push('(Violations)');
      }

      plugin.violations.forEach((violation) => {
        const constructs = violation.violatingConstructs;
        const occurrences = constructs.length;
        const title = reset(red(bright(`${violation.ruleName} (${occurrences} occurrences)`)));
        output.push('');
        output.push(title);
        if (violation.severity) {
          output.push(`Severity: ${violation.severity}`);
        }
        output.push('');
        output.push('  Occurrences:');
        for (const construct of constructs) {
          output.push('');
          output.push(`    - Construct Path: ${construct.constructPath ?? 'N/A'}`);
          output.push(`    - Template Path: ${construct.templatePath}`);
          output.push(`    - Creation Stack:\n\t${this.reportTrace.formatPrettyPrinted(construct.constructPath)}`);
          output.push(`    - Resource ID: ${construct.resourceLogicalId}`);
          if (construct.locations) {
            output.push('    - Template Locations:');
            for (const location of construct.locations) {
              output.push(`      > ${location}`);
            }
          }
        }
        output.push('');
        output.push(`  Description: ${violation.description }`);
        if (violation.fix) {
          output.push(`  How to fix: ${violation.fix}`);
        }
        if (violation.ruleMetadata) {
          output.push(`  Rule Metadata: \n\t${Object.entries(violation.ruleMetadata).flatMap(([key, value]) => `${key}: ${value}`).join('\n\t')}`);
        }
      });

    });

    return output.join(os.EOL);
  }

  public formatJson(reps: NamedValidationPluginReport[]): PolicyValidationReportJson {
    return {
      title: 'Validation Report',
      pluginReports: reps
        .filter(rep => !rep.success)
        .map(rep => ({
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
            violatingConstructs: violation.violatingResources.map(resource => {
              const constructPath = this.tree.getConstructByLogicalId(resource.resourceLogicalId)?.node.path;
              return {
                constructStack: this.reportTrace.formatJson(constructPath),
                constructPath: constructPath,
                locations: resource.locations,
                resourceLogicalId: resource.resourceLogicalId,
                templatePath: resource.templatePath,
              };
            }),
          })),
        })),
    };
  }
}


function reset(s: string) {
  return `${s}\x1b[0m`;
}

function red(s: string) {
  return `\x1b[31m${s}`;
}

function bright(s: string) {
  return `\x1b[1m${s}`;
}
