import * as os from 'os';
import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct } from 'constructs';
import { table } from 'table';
import { TreeMetadata } from '../private/tree-metadata';

/**
   * TODO docs
   */
export interface IValidationPlugin {
  /**
   * TODO docs
   */
  readonly name: string;

  /**
   * TODO docs
   */
  validate(context: ValidationContext): void;

  /**
   * TODO docs
   */
  isReady(): boolean;
}

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

    /**
     * TODO docs
     */
    public readonly plugin: IValidationPlugin,

    /**
     * TODO docs
     */
    public readonly root: IConstruct,

    /**
     * TODO docs
     */
    public readonly stack: cxapi.CloudFormationStackArtifact,

    /**
     * Whether or not the synth command was executed with --stdout.
     */
    public readonly stdout?: boolean) {

    this.report = new ValidationReport(plugin.name, stack, root);
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
export interface IValidation {

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
  readonly locations: string[];

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
   *
   * @default - TODO
   */
  readonly constructPath?: string;

  /**
   * A stack of constructs that lead to the violation.
   *
   * @default - TODO
   */
  readonly constructStack?: string[];

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
}

/**
 * TODO docs
 */
export interface ValidationViolationResourceAware extends ValidationViolation {
  /**
   * The resources violating this rule.
   */
  readonly violatingResource: ValidationViolatingResource;
}

/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface ValidationViolationConstructAware extends ValidationViolation {

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

  /**
   * TODO docs
   */
  readonly status: ValidationReportStatus;

  /**
   * TODO docs
   */
  readonly plugin: string;

  /**
   * TODO docs
   * @default - TODO
   */
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
  readonly violations: ValidationViolationConstructAware[];

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
    private readonly stack: cxapi.CloudFormationStackArtifact,
    private readonly root: IConstruct) {
  }

  /**
   * Add a violation to the report.
   */
  public addViolation(violation: ValidationViolationResourceAware) {
    if (this._summary) {
      throw new Error('Violations cannot be added to report after its submitted');
    }

    const template = this.stack.template;
    const tree = this.root.node.tryFindChild('Tree') as TreeMetadata;
    const constructPath = template.Resources[violation.violatingResource.resourceName].Metadata['aws:cdk:path'];
    const nodes = tree.nodesFromPath(constructPath);
    const constructStack = nodes
      .filter(n => n.constructInfo != null)
      .map(n => `${n.constructInfo!.fqn} (${n.id})`)
      .reverse();

    this.violations.push({
      ruleName: violation.ruleName,
      recommendation: violation.recommendation,
      violatingConstruct: {
        constructStack,
        constructPath,
        locations: violation.violatingResource.locations,
        resourceName: violation.violatingResource.resourceName,
        templatePath: violation.violatingResource.templatePath,
      },
      fix: violation.fix,
    });
  }

  /**
   * Submit the report with a status and additional metadata.
   */
  public submit(status: ValidationReportStatus, metadata?: { readonly [key: string]: string }) {
    this._summary = { status, plugin: this.pluginName, metadata };
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
      ...Object.entries(json.summary.metadata ?? {}),
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
        output.push(`    - Creation Stack:\n\t${construct.constructStack?.join('\n\t')}`);
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
