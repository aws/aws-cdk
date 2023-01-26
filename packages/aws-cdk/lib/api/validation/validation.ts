/* eslint-disable no-console */
import * as os from 'os';
import { CloudAssembly } from '@aws-cdk/cx-api';
import { table } from 'table';
import { PluginManager } from './_manager';

export interface ValidationConfig {
  readonly package: string;
  readonly version: string;
  readonly class: string;
  readonly installEnv?: { [key: string]: any };
  readonly properties?: { [key: string]: any };
}

/**
 * Logger available to plugins during validation. Use this instead of `console.log`.
 */
export class ValidationLogger {

  /**
   * Log a message.
   */
  public log(message: string) {
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
  validate(cloudAssembly: CloudAssembly): Promise<void>;

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
  readonly manifestPath: string;

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
  readonly violatingResources: readonly ValidationViolatingResource[];

}

/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface ValidationViolationConstructAware extends Omit<ValidationViolation, 'violatingResources'> {

  /**
   * The constructs violating this rule.
   */
  readonly violatingConstructs: readonly ValidationViolatingConstruct[];
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

  readonly version: string;

  readonly metadata?: { readonly [key: string]: string };

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
    private readonly pkg: string,
    private readonly version: string,
    private readonly metadata: {readonly [key: string]: ResourceConstructMetadata},
    private readonly stdout: boolean) {
  }

  /**
   * Add a violation to the report.
   */
  public addViolation(violation: ValidationViolation) {
    if (this._summary) {
      throw new Error('Violations cannot be added to report after its submitted');
    }

    const violatingConstructs: ValidationViolatingConstruct[] = [];

    for (const resource of violation.violatingResources) {
      const constructPath = this.metadata[resource.resourceName]?.path;
      violatingConstructs.push({
        ...resource,

        // augment with construct metadata
        constructPath: constructPath,

        // if synth is executed with --stdout, the manifest path
        // here is temporary and will be deleted once the command finishes.
        manifestPath: this.stdout ? 'STDOUT' : resource.manifestPath,
      });
    }

    this.violations.push({
      ruleName: violation.ruleName,
      recommendation: violation.recommendation,
      violatingConstructs: violatingConstructs,
      fix: violation.fix,
    });
  }

  /**
   * Submit the report with a status and additional metadata.
   */
  public submit(status: ValidationReportStatus, metadata?: { readonly [key: string]: string }) {
    this._summary = { status, plugin: this.pkg, version: this.version, metadata };
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

    const json = this.toJson();
    const output = [json.title];

    output.push('-'.repeat(json.title.length));
    output.push('');
    output.push('(Summary)');
    output.push('');
    output.push(table([
      ['Status', json.summary.status],
      ['Plugin', json.summary.plugin],
      ['Version', json.summary.version],
      ...Object.entries(json.summary.metadata ?? {}),
    ]));

    if (json.violations) {
      output.push('');
      output.push('(Violations)');
    }
    for (const violation of json.violations) {
      const occurrences = violation.violatingConstructs.flatMap(c => c.locations).length;
      const title = reset(red(bright(`${violation.ruleName} (${occurrences} occurrences)`)));
      output.push('');
      output.push(title);
      output.push('');
      output.push('  Occurrences:');
      for (const construct of violation.violatingConstructs) {
        output.push('');
        output.push(`    - Construct Path: ${construct.constructPath ?? 'N/A'}`);
        output.push(`    - Manifest Path: ${construct.manifestPath}`);
        output.push(`    - Resource Name: ${construct.resourceName}`);
        if (construct.locations) {
          output.push('    - Locations:');
          for (const location of construct.locations) {
            output.push(`      > ${location}`);
          }
        }
      }
      output.push('');
      output.push(`  Recommendation: ${violation.recommendation}`);
      output.push(`  How to fix: ${violation.fix}`);
    }

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
      title: `Validation Report (${this.pkg}@${this.version})`,
      violations: this.violations,
      summary: this._summary,
    };
  }

}

/**
 * Utiliy class for loading validation plugins.
 */
export class ValidationPlugin {

  /**
   * Load the validation plugin and create the necessary context for its execution.
   */
  public static load(
    validation: ValidationConfig,
    pluginManager: PluginManager): Validation {

    const plugin = pluginManager.load({
      pkg: validation.package,
      version: validation.version,
      class: validation.class,
      properties: validation.properties,
      installEnv: validation.installEnv,
    });

    if (typeof((plugin.instance as any).validate) !== 'function') {
      throw new Error(`Instance of class '${validation.class}' from package '${validation.package}@${validation.version}' is not a validation plugin. Are you sure you specified the correct class?`);
    }

    return plugin.instance as Validation;

  }
}

/**
 * Construct related metadata on resources.
 */
interface ResourceConstructMetadata {

  /**
   * The path of the construct in the application.
   */
  readonly path: string;

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