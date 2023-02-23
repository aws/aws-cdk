import * as os from 'os';
import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct, Construct } from 'constructs';
import { table } from 'table';
import { CfnResource } from '../cfn-resource';
import { TreeMetadata, Node } from '../private/tree-metadata';
import { Stack } from '../stack';

/**
 * Represents a validation plugin that will be executed during synthesis
 *
 * @example
 * class MyCustomValidatorPlugin implements IValidationPlugin {
 *    public readonly name = 'my-custom-plugin';
 *
 *    public isReady(): boolean {
 *      // check if the plugin tool is installed
 *      return true;
 *    }
 *
 *    public validate(context: ValidationContext): void {
 *      const templatePath = context.stack.templateFullPath;
 *      // perform validation on the template
 *      // if there are any failures report them
 *      context.report.addViolation({
 *        ruleName: 'rule-name',
 *        recommendation: 'description of the rule',
 *        violatingResources: [{
 *          resourceName: 'FailingResource',
 *          templatePath,
 *        }],
 *      });
 *    }
 * }
 */
export interface IValidationPlugin {
  /**
   * The name of the plugin that will be displayed in the validation
   * report
   */
  readonly name: string;

  /**
   * The method that will be called by the CDK framework to perform
   * validations. This is where the plugin will evaluate the CloudFormation
   * templates for compliance and report and violations
   */
  validate(context: ValidationContext): void;

  /**
   * This method returns whether or not the plugin is ready to execute
   */
  isReady(): boolean;
}

/**
 * TODO: docs
 */
export interface ValidationContextProps {
  /**
    * The validation plugin that should be used to perform validations
    * in this context.
    */
  readonly plugin: IValidationPlugin,

  /**
    * The top-level construct that is being synthesized.
    */
  readonly root: IConstruct,

  /**
    * The stack to be validated.
    */
  readonly stack: cxapi.CloudFormationStackArtifact,
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
   * The full path to the CloudFormation template in the Cloud Assembly
   */
  public readonly templateFullPath: string;

  constructor(props: ValidationContextProps) {
    this.templateFullPath = props.stack.templateFullPath;
    this.report = new ValidationReport(props.plugin.name, props.root);
  }
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
   * The locations in the CloudFormation template that pose the violations.
   */
  readonly locations: string[];

  /**
   * The path to the CloudFormation template that contains this resource
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
  readonly constructPath: string;

  /**
   * A stack of constructs that lead to the violation.
   */
  readonly constructStack?: string;
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
   * @default - TODO
   */
  readonly fix?: string;
}

/**
 * TODO docs
 */
export interface ValidationViolationResourceAware extends ValidationViolation {
  /**
   * The resources violating this rule.
   */
  readonly violatingResources: ValidationViolatingResource[];
}

/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface ValidationViolationConstructAware extends ValidationViolation {

  /**
   * The constructs violating this rule.
   */
  readonly violatingConstructs: ValidationViolatingConstruct[];
}

/**
 * The final status of the validation report
 */
export enum ValidationReportStatus {
  /**
   * No violations were found
   */
  SUCCESS = 'success',

  /**
   * At least one violation was found
   */
  FAILURE = 'failure',
}

/**
 * Summary of the report.
 */
export interface ValidationReportSummary {

  /**
   * The final status of the validation (pass/fail)
   */
  readonly status: ValidationReportStatus;

  /**
   * The name of the plugin that created the report
   */
  readonly pluginName: string;

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

interface ConstructTrace {
  readonly id: string;
  readonly path: string;
  readonly parent?: ConstructTrace;
  readonly library?: string;
  readonly libraryVersion?: string;
  readonly location?: string;
}

/**
 * The report emitted by the plugin after evaluation.
 */
export class ValidationReport {
  private readonly violations: ValidationViolationConstructAware[] = [];
  private readonly constructTreeByNodeId = new Map<string, Construct>();
  private readonly constructTreeByResourceName = new Map<string, Construct>();

  private _summary?: ValidationReportSummary;

  constructor(
    private readonly pluginName: string,
    private readonly root: IConstruct,
  ) {
    this.constructTreeByNodeId.set(this.root.node.id, root);
    // do this once at the start so we don't have to traverse
    // the entire tree everytime we want to find a nested node
    this.root.node.findAll().forEach(child => {
      this.constructTreeByNodeId.set(child.node.id, child);
      const defaultChild = child.node.defaultChild;
      if (defaultChild && CfnResource.isCfnResource(defaultChild)) {
        this.constructTreeByResourceName.set(Stack.of(child).resolve(defaultChild.logicalId), child);
      }
    });
  }

  /**
   * Add a violation to the report.
   */
  public addViolation(violation: ValidationViolationResourceAware) {
    if (this._summary) {
      throw new Error('Violations cannot be added to report after its submitted');
    }

    const constructs: ValidationViolatingConstruct[] = violation.violatingResources.map(resource => {
      const constructPath = this.constructTreeByResourceName.get(resource.resourceName)?.node.path;
      return {
        constructStack: this.trace(constructPath),
        constructPath: constructPath ?? 'N/A',
        locations: resource.locations,
        resourceName: resource.resourceName,
        templatePath: resource.templatePath,
      };
    });

    this.violations.push({
      ruleName: violation.ruleName,
      recommendation: violation.recommendation,
      violatingConstructs: constructs,
      fix: violation.fix,
    });
  }

  /**
   * Submit the report with a status and additional metadata.
   */
  public submit(status: ValidationReportStatus, metadata?: { readonly [key: string]: string }) {
    this._summary = { status, pluginName: this.pluginName, metadata };
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
      ['Plugin', json.summary.pluginName],
      ...Object.entries(json.summary.metadata ?? {}),
    ]));

    if (json.violations) {
      output.push('');
      output.push('(Violations)');
    }

    json.violations.forEach((violation) => {
      const constructs = violation.violatingConstructs;
      const occurrences = constructs.length;
      const title = reset(red(bright(`${violation.ruleName} (${occurrences} occurrences)`)));
      output.push('');
      output.push(title);
      output.push('');
      output.push('  Occurrences:');
      for (const construct of constructs) {
        output.push('');
        output.push(`    - Construct Path: ${construct.constructPath}`);
        output.push(`    - Template Path: ${construct.templatePath}`);
        output.push(`    - Creation Stack:\n\t${construct.constructStack}`);
        output.push(`    - Resource Name: ${construct.resourceName}`);
        if (construct.locations) {
          output.push('    - Locations:');
          for (const location of construct.locations) {
            output.push(`      > ${location}`);
          }
        }
      }
      output.push('');
      output.push(`  Recommendation: ${json.violations[0].recommendation}`);
      if (json.violations[0].fix) {
        output.push(`  How to fix: ${json.violations[0].fix}`);
      }
    });

    return output.join(os.EOL);
  }

  /**
   * Get the stack trace from the construct node metadata.
   * The stack trace only gets recorded if the node is a `CfnResource`,
   * but the stack trace will have entries for all types of parent construct
   * scopes
   */
  private getTraceMetadata(node?: Node): string[] {
    if (node) {
      if (this.constructTreeByNodeId.has(node.id)) {
        return this.constructTreeByNodeId.get(node.id)
          ?.node.defaultChild
          ?.node.metadata
          .find(meta => !!meta.trace)?.trace ?? [];
      }
    }
    return [];
  }

  /**
   * Construct the stack trace of constructs. This will start with the
   * resource that has a violation and then go up through it's parents
   */
  private getConstructTrace(node: Node, locations?: string[]): ConstructTrace {
    const metadata = locations ?? this.getTraceMetadata(node);
    const thisLocation = metadata.shift();
    return {
      id: node.id,
      path: node.path,
      parent: node.parent ? this.getConstructTrace(node?.parent, metadata) : undefined,
      library: node.constructInfo?.fqn,
      libraryVersion: node.constructInfo?.version,
      location: thisLocation,
    };
  }

  /**
   * - Creation Stack:
   *     └──  Bucket (validator-test/MyCustomL3Construct/Bucket)
   *          │ Library: @aws-cdk/aws-s3.Bucket
   *          │ Library Version: 0.0.0
   *          │ Location: new Bucket (node_modules/@aws-cdk/aws-s3/lib/bucket.js:688:26)
   *          └──  MyCustomL3Construct (validator-test/MyCustomL3Construct)
   *               │ Library: constructs.Construct
   *               │ Library Version: 10.1.235
   *               │ Location: new MyCustomL3Construct (/home/packages/@aws-cdk-testing/core-integ/test/integ.core-validations.js:30:9)
   *               └──  validator-test (validator-test)
   *                    │ Library: @aws-cdk/core.Stack
   *                    │ Library Version: 0.0.0
   *                    │ Location: new MyStack (/home/packages/@aws-cdk-testing/core-integ/test/integ.core-validations.js:24:9)
   */
  private trace(constructPath?: string): string | undefined {
    const starter = '└── ';
    const vertical = '│';
    function renderTraceInfo(info?: ConstructTrace, indent?: string, start: string = starter): string {
      const indentation = indent ?? ' '.repeat(starter.length+1);
      const result: string[] = [
        `${start} ${info?.id} (${info?.path})`,
        `${indentation}${vertical} Library: ${info?.library}`,
        `${indentation}${vertical} Library Version: ${info?.libraryVersion}`,
        `${indentation}${vertical} Location: ${info?.location}`,
        ...info?.parent ? [renderTraceInfo(info?.parent, ' '.repeat(indentation.length+starter.length+1), indentation+starter)] : [],
      ];
      return result.join('\n\t');
    }
    if (constructPath) {
      const tree = this.root.node.tryFindChild('Tree') as TreeMetadata;
      const treeNode = tree.getTreeNode(constructPath);
      if (treeNode) {
        const traceInfo = this.getConstructTrace(treeNode);
        return renderTraceInfo(traceInfo);
      }
    }
    return;
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
