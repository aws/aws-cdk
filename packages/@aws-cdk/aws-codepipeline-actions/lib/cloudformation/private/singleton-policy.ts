import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Manages a bunch of singleton-y statements on the policy of an IAM Role.
 * Dedicated methods can be used to add specific permissions to the role policy
 * using as few statements as possible (adding resources to existing compatible
 * statements instead of adding new statements whenever possible).
 *
 * Statements created outside of this class are not considered when adding new
 * permissions.
 */
export class SingletonPolicy extends Construct implements iam.IGrantable {
  /**
   * Obtain a SingletonPolicy for a given role.
   * @param role the Role this policy is bound to.
   * @returns the SingletonPolicy for this role.
   */
  public static forRole(role: iam.IRole): SingletonPolicy {
    const found = role.node.tryFindChild(SingletonPolicy.UUID);
    return (found as SingletonPolicy) || new SingletonPolicy(role);
  }

  private static readonly UUID = '8389e75f-0810-4838-bf64-d6f85a95cf83';

  public readonly grantPrincipal: iam.IPrincipal;

  private statements: { [key: string]: iam.PolicyStatement } = {};

  private constructor(private readonly role: iam.IRole) {
    super(role as unknown as Construct, SingletonPolicy.UUID);
    this.grantPrincipal = role;
  }

  public grantExecuteChangeSet(props: { stackName: string, changeSetName: string, region?: string }): void {
    this.statementFor({
      actions: [
        'cloudformation:DescribeStacks',
        'cloudformation:DescribeChangeSet',
        'cloudformation:ExecuteChangeSet',
      ],
      conditions: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': props.changeSetName } },
    }).addResources(this.stackArnFromProps(props));
  }

  public grantCreateReplaceChangeSet(props: { stackName: string, changeSetName: string, region?: string }): void {
    this.statementFor({
      actions: [
        'cloudformation:CreateChangeSet',
        'cloudformation:DeleteChangeSet',
        'cloudformation:DescribeChangeSet',
        'cloudformation:DescribeStacks',
      ],
      conditions: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': props.changeSetName } },
    }).addResources(this.stackArnFromProps(props));
  }

  public grantCreateUpdateStack(props: { stackName: string, replaceOnFailure?: boolean, region?: string }): void {
    const actions = [
      'cloudformation:DescribeStack*',
      'cloudformation:CreateStack',
      'cloudformation:UpdateStack',
      'cloudformation:GetTemplate*',
      'cloudformation:ValidateTemplate',
      'cloudformation:GetStackPolicy',
      'cloudformation:SetStackPolicy',
    ];
    if (props.replaceOnFailure) {
      actions.push('cloudformation:DeleteStack');
    }
    this.statementFor({ actions }).addResources(this.stackArnFromProps(props));
  }

  public grantCreateUpdateStackSet(props: { stackSetName: string, region?: string }): void {
    const actions = [
      'cloudformation:CreateStackSet',
      'cloudformation:UpdateStackSet',
      'cloudformation:DescribeStackSet',
      'cloudformation:DescribeStackSetOperation',
      'cloudformation:ListStackInstances',
      'cloudformation:CreateStackInstances',
    ];
    this.statementFor({ actions }).addResources(this.stackSetArnFromProps(props));
  }

  public grantDeleteStack(props: { stackName: string, region?: string }): void {
    this.statementFor({
      actions: [
        'cloudformation:DescribeStack*',
        'cloudformation:DeleteStack',
      ],
    }).addResources(this.stackArnFromProps(props));
  }

  public grantPassRole(role: iam.IRole | string): void {
    this.statementFor({ actions: ['iam:PassRole'] }).addResources(typeof role === 'string' ? role : role.roleArn);
  }

  private statementFor(template: StatementTemplate): iam.PolicyStatement {
    const key = keyFor(template);
    if (!(key in this.statements)) {
      this.statements[key] = new iam.PolicyStatement({ actions: template.actions });
      if (template.conditions) {
        this.statements[key].addConditions(template.conditions);
      }
      this.role.addToPolicy(this.statements[key]);
    }
    return this.statements[key];

    function keyFor(props: StatementTemplate): string {
      const actions = `${props.actions.sort().join('\x1F')}`;
      const conditions = formatConditions(props.conditions);
      return `${actions}\x1D${conditions}`;

      function formatConditions(cond?: StatementCondition): string {
        if (cond == null) { return ''; }
        let result = '';
        for (const op of Object.keys(cond).sort()) {
          result += `${op}\x1E`;
          const condition = cond[op];
          for (const attribute of Object.keys(condition).sort()) {
            const value = condition[attribute];
            result += `${value}\x1F`;
          }
        }
        return result;
      }
    }
  }

  private stackArnFromProps(props: { stackName: string, region?: string }): string {
    return cdk.Stack.of(this).formatArn({
      region: props.region,
      service: 'cloudformation',
      resource: 'stack',
      resourceName: `${props.stackName}/*`,
    });
  }

  private stackSetArnFromProps(props: { stackSetName: string, region?: string }): string {
    return cdk.Stack.of(this).formatArn({
      region: props.region,
      service: 'cloudformation',
      resource: 'stackset',
      resourceName: `${props.stackSetName}:*`,
    });
  }
}

export interface StatementTemplate {
  actions: string[];
  conditions?: StatementCondition;
}

export type StatementCondition = { [op: string]: { [attribute: string]: string } };

export function parseCapabilities(capabilities: cdk.CfnCapabilities[] | undefined): string | undefined {
  if (capabilities === undefined) {
    return undefined;
  } else if (capabilities.length === 1) {
    const capability = capabilities.toString();
    return (capability === '') ? undefined : capability;
  } else if (capabilities.length > 1) {
    return capabilities.join(',');
  }

  return undefined;
}