import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnRuleGroupsNamespace } from './aps.generated';

export interface RuleGroupsNamespaceProps {
  /**
   * The rules definition file for this namespace.
  */
  readonly data: string;

  /**
   * The name of the rule groups namespace.
  */
  readonly name: string;

  /**
   * The ARN of the workspace that contains this rule groups namespace.
   * For example: `arn:aws:aps:us-west-2:123456789012:workspace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f`.
  */
  readonly workspace: string;
}

/**
 * The RuleGroupsNamespace resource creates or updates a rule groups
 * namespace within a Amazon Managed Service for Prometheus workspace.
 */
export class RuleGroupsNamespace extends cdk.Resource {
  private data: string;
  private name: string;
  private workspace: string;

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
      data: this.data,
      name: this.name,
      workspace: this.workspace,
    });

    this.ruleGroupsNamespaceArn = resource.ref;

  }
}