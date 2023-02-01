
import * as os from 'os';
import { table } from 'table';

/**
 * Context available to plugins during validation.
 */
export class ValidationContext {

  /**
   * Report emitted by the validation.
   *
   * Plugins should interact with this object to generate the report.
   */
  public readonly report: ValidationReport;

  /**
   * Logger for the validation.
   *
   * Plugins should interact with this object to log messages during validation.
   */
  public readonly logger: ValidationLogger;

  constructor(
    public readonly pluginName: string,
    public readonly template: {readonly [key: string]: any},
    public readonly templatePath: string,

    /**
     * Whether or not the synth command was executed with --stdout.
     */
    public readonly stdout?: boolean) {

    this.report = new ValidationReport(pluginName, template, stdout ?? false);
    this.logger = new ValidationLogger();
  }
}

/**
 * Logger available to plugins during validation. Use this instead of `console.log`.
 */
export class ValidationLogger {

  /**
   * Log a message.
   */
  public log(message: string) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}

/**
 * Contract between cdk8s and third-parties looking to implement validation plugins.
 */
export interface Validation {

  /**
   * Run the validation logic.
   *
   * - Use `context.manifests` to retrieve the list of manifests to validate.
   * - Use `context.report` to access and build the resulting report.
   *
   * Make sure to call `context.report.pass()` or `context.report.fail()` before returning, otherwise the validation is considered incomplete.
   */
  validate(context: ValidationContext): Promise<void>;

}

/**
 * Resource violating a specific rule.
 */
export interface ValidationViolatingResource {

  /**
   * The resource name.
   */
  readonly resourceName: string;

  /**
   * The locations in its config that pose the violations.
   */
  readonly locations: readonly string[];

  /**
   * The manifest this resource is defined in.
   */
  readonly templatePath: string;

}

/**
 * Construct violating a specific rule.
 */
export interface ValidationViolatingConstruct extends ValidationViolatingResource {

  /**
   * The construct path as defined in the application.
   */
  readonly constructPath?: string;

}

/**
 * Violation produced by the validation plugin.
 */
export interface ValidationViolation {

  /**
   * The name of the rule.
   */
  readonly ruleName: string;

  /**
   * The recommendation to resolve the violation.
   */
  readonly recommendation: string;

  /**
   * How to fix the recommendation.
   */
  readonly fix: string;

  /**
   * The resources violating this rule.
   */
  readonly violatingResource: ValidationViolatingResource;

}

/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface ValidationViolationConstructAware extends Omit<ValidationViolation, 'violatingResource'> {

  /**
   * The constructs violating this rule.
   */
  readonly violatingConstruct: ValidationViolatingConstruct;
}

// we intentionally don't use an enum so that
// plugins don't have to import the cli at runtime.
export type ValidationReportStatus = 'success' | 'failure';

/**
 * Summary of the report.
 */
export interface ValidationReportSummary {

  readonly status: ValidationReportStatus;

  readonly plugin: string;
}

/**
 * JSON representation of the report.
 */
export interface ValidationReportJson {

  /**
   * Report title.
   */
  readonly title: string;

  /**
   * List of violations in the rerpot.
   */
  readonly violations: readonly ValidationViolationConstructAware[];

  /**
   * Report summary.
   */
  readonly summary: ValidationReportSummary;

}

/**
 * The report emitted by the plugin after evaluation.
 */
export class ValidationReport {


  private readonly violations: ValidationViolationConstructAware[] = [];

  private _summary?: ValidationReportSummary;

  constructor(
    private readonly pluginName: string,
    private readonly template: {readonly [key: string]: any},
    private readonly stdout: boolean) {
  }

  /**
   * Add a violation to the report.
   */
  public addViolation(violation: ValidationViolation) {
    if (this._summary) {
      throw new Error('Violations cannot be added to report after its submitted');
    }

    if (this.stdout) {
      // eslint-disable-next-line no-console
      console.log('Yooo');
    }

    const constructPath = this.template.Resources[violation.violatingResource.resourceName].Metadata['aws:cdk:path'];

    this.violations.push({
      ruleName: violation.ruleName,
      recommendation: violation.recommendation,
      violatingConstruct: {
        constructPath,
        locations: violation.violatingResource.locations,
        resourceName: violation.violatingResource.resourceName,
        templatePath: this.stdout ? 'STDOUT' : violation.violatingResource.templatePath,
      },
      fix: violation.fix,
    });
  }

  /**
   * Submit the report with a status and additional metadata.
   */
  public submit(status: ValidationReportStatus) {
    this._summary = { status, plugin: this.pluginName };
  }

  /**
   * Whether or not the report was successfull.
   */
  public get success(): boolean {
    if (!this._summary) {
      throw new Error('Unable to determine report status: Report is incomplete. Call \'report.submit\'');
    }
    return this._summary.status === 'success';
  }

  /**
   * Transform the report to a well formatted table string.
   */
  public toString(): string {
    // Doing the indexing here to avoid duplicating the logic in each plugin
    const violations = new Map<string, ValidationViolationConstructAware[]>();
    for (const violation of this.violations) {
      if (violations.has(violation.ruleName)) {
        violations.set(violation.ruleName, violations.get(violation.ruleName)!.concat(violation));
      } else {
        violations.set(violation.ruleName, [violation]);
      }
    }

    const json = this.toJson();
    const output = [json.title];

    output.push('-'.repeat(json.title.length));
    output.push('');
    output.push('(Summary)');
    output.push('');
    output.push(table([
      ['Status', json.summary.status],
      ['Plugin', json.summary.plugin],
    ]));

    if (json.violations) {
      output.push('');
      output.push('(Violations)');
    }

    violations.forEach((vs, name) => {
      const occurrences = vs.length;
      const title = reset(red(bright(`${name} (${occurrences} occurrences)`)));
      output.push('');
      output.push(title);
      output.push('');
      output.push('  Occurrences:');
      for (const v of vs) {
        const construct = v.violatingConstruct;
        output.push('');
        output.push(`    - Construct Path: ${construct.constructPath ?? 'N/A'}`);
        output.push(`    - Template Path: ${construct.templatePath}`);
        output.push(`    - Resource Name: ${construct.resourceName}`);
        if (construct.locations) {
          output.push('    - Locations:');
          for (const location of construct.locations) {
            output.push(`      > ${location}`);
          }
        }
      }
      output.push('');
      output.push(`  Recommendation: ${vs[0].recommendation}`);
      output.push(`  How to fix: ${vs[0].fix}`);
    });

    return output.join(os.EOL);
  }

  /**
   * Transform the report into a JSON object.
   */
  public toJson(): ValidationReportJson {
    if (!this._summary) {
      throw new Error('Unable to determine report result: Report is incomplete. Call \'report.submit\'');
    }
    return {
      title: 'Validation Report',
      violations: this.violations,
      summary: this._summary,
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


export interface ValidationConfig {

  readonly package: string;
  readonly version: string;
  readonly class: string;
  readonly installEnv?: { [key: string]: any };
  readonly properties?: { [key: string]: any };
}
