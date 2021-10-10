import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as YAML from 'yaml';
import { IWorkspace } from '.';
import { CfnRuleGroupsNamespace } from './aps.generated';

/**
 * Labels to add or overwrite before storing the result.
 */
export interface ILabels {
  readonly [key: string]: string;
}

/**
 * Annotations to add to each alert.
 */
export interface IAnnotations {
  readonly [key: string]: string;
}

/**
 * The interface of Record Rule.
 */
export interface IRecordRule {
  /**
   * The name of the time series to output to. Must be a valid metric name.
   */
  readonly record: string;

  /**
   * The PromQL expression to evaluate. Every evaluation cycle this is
   * evaluated at the current time, and the result recorded as a new set of
   * time series with the metric name as given by 'record'.
   */
  readonly expr: string;

  /**
   * Labels to add or overwrite before storing the result.
   * @default - none
   */
  readonly labels?: ILabels[];
}

/**
 * The interface of Alert Rule.
 */
export interface IAlertRule {

  /**
   * The name of the alert. Must be a valid label value.
   */
  readonly alert: string;

  /**
   * The PromQL expression to evaluate. Every evaluation cycle this is
   * evaluated at the current time, and all resultant time series become
   * pending/firing alerts.
   */
  readonly expr: string;

  /**
  * The alerting interval in seconds.
  * @default - 0s
  */
  readonly for?: string;

  /**
   * Labels to add or overwrite for each alert.
   * @default - none
   */
  readonly labels?: ILabels[];

  /**
   * Annotations to add to each alert.
   */
  readonly annotations?: IAnnotations;
}

export interface IRecordGroups {
  /**
   * The name of the group. Must be unique within a file.
   */
  readonly name: string;

  /**
   * The Record Rules.
   */
  readonly rules: IRecordRule[];
}

/**
 * The Class of Record Groups.
 */
export class RecordGroups {
  /**
   * The name of the group. Must be unique within a file.
   */
  readonly name: string;

  /**
   * The Record Rules.
   */
  readonly rules: IRecordRule[];
  constructor(options: IRecordGroups) {
    this.name = options.name;
    this.rules = options.rules;
  }
}

/**
 * The interface of Alert Groups.
 */
export interface IAlertGroups {
  /**
   * The name of the group. Must be unique within a file.
   */
  readonly name: string;

  /**
   * The Alert Rules.
   */
  readonly rules: IAlertRule[];
}

/**
 * The Class of Alert Groups.
 */
export class AlertGroups {
  /**
   * The name of the group. Must be unique within a file.
   */
  readonly name: string;

  /**
   * The Alert Rules.
   */
  readonly rules: IAlertRule[];
  constructor(options: IAlertGroups) {
    this.name = options.name;
    this.rules = options.rules;

    this.rules.forEach(rule => {
      if (rule.for!) {
        if (_validateDuration(rule.for!) === false) {
          throw new Error(`Invalid duration ${rule.for!}`);
        }
      }
    });
  }
}

/**
 * The interface of RuleGroupsNamespaceData.
 */
export interface IRuleGroupsNamespaceData {
  readonly groups: Array<IRecordGroups | IAlertGroups>;
}

export class RuleGroupsNamespaceData {
  group: IRuleGroupsNamespaceData;
  constructor(options: IRuleGroupsNamespaceData) {
    this.group = options;
  }
  public toYaml(): string {
    const yamls = new YAML.Document();
    yamls.contents = this.group;
    return yamls.toString();
  }
  public addRules(ruleGroup :IRecordGroups|IAlertGroups): void {
    ruleGroup.rules.forEach(( rule: IAlertRule| IRecordRule ) => {
      if ((<IAlertRule>rule).for!) {
        if (_validateDuration((<IAlertRule>rule).for!) === false) {
          throw new Error(`Invalid duration ${(<IAlertRule>rule).for!}`);
        }
      }
    });
    this.group.groups.push(ruleGroup);
  }
}

/**
  * Validate the Duration of the input is compliant.
  *
  * @internal
*/
export function _validateDuration(duration: string): boolean {
  const durationRegex = /^(?<number>\d+(?:\.\d+)?)(?:\s*(?<unit>ms|s|m|h|w|y))?$/;
  return durationRegex.test(duration);
}


export interface RuleGroupsNamespaceProps {
  /**The name of the group. Must be unique within a file.
   * The rules definition file for this namespace.
  */
  readonly data: RuleGroupsNamespaceData;

  /**
   * The name of the rule groups namespace.
  */
  readonly name: string;

  /**
   * The ARN of the workspace that contains this rule groups namespace.
   * For example: `arn:aws:aps:us-west-2:123456789012:workspace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f`.
  */
  readonly workspace: IWorkspace;
}

/**
 * The RuleGroupsNamespace resource creates or updates a rule groups
 * namespace within a Amazon Managed Service for Prometheus workspace.
 */
export class RuleGroupsNamespace extends cdk.Resource {
  private data: RuleGroupsNamespaceData;
  private name: string;
  private workspace: IWorkspace;

  /**
     * The ARN of the RuleGroupsNamespace.
     * For example: `arn:aws:aps:us-west-2:123456789012:rulegroupsnamespace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/amp-rules`.
     * @attribute
  */
  readonly ruleGroupsNamespaceArn: string;

  public constructor(scope: Construct, id: string, props: RuleGroupsNamespaceProps) {
    super(scope, id);
    this.data = props.data;
    this.name = props.name;
    this.workspace = props.workspace;

    const resource = new CfnRuleGroupsNamespace(this, 'Resource', {
      data: this.data.toYaml(),
      name: this.name,
      workspace: this.workspace.workspaceArn,
    });

    this.ruleGroupsNamespaceArn = resource.ref;

  }
}