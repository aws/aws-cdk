import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig, singletonEventRole, TargetBaseProps } from './util';

/**
 * SsmRunCommandProps
 */
export interface SsmRunCommandProps extends TargetBaseProps {
  /**
   * Role to be used to run the Document
   *
   * @default - a new role is created.
   */
  readonly role?: iam.IRole;

  /**
   * Can be either `tag:` *tag-key* or `InstanceIds` .
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandtarget.html#cfn-events-rule-runcommandtarget-key
   */
  readonly targetKey: events.CfnRule.RunCommandTargetProperty['key'];

  /**
   * If Target Key is 'InstanceIds', Values are the list of EC2 Instance Ids. If Target Key is 'tag:<Amazon EC2 tag>', Values are list of tag values.
   */
  readonly targetValues: string[];

  /**
   * Specify input for the SSM Document if appropriate.
   *
   * @default - no input parameters passed to document
   */
  readonly input?: { [key: string]: string[] };
}

/**
 * Create an SSM Run Command Event Target
 */
export class SsmRunCommand implements events.IRuleTarget {
  private documentArn: string;

  constructor(
    /**
     * Provide an instance of a `ssm.CfnDocument`
     */
    public readonly document: ssm.CfnDocument,
    private readonly props: SsmRunCommandProps,
  ) {
    this.documentArn = this.getDocumentArn();
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SSM Run Command as a
   * result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const role = this.props.role ?? singletonEventRole(rule);
    role.addToPrincipalPolicy(this.executeStatement());

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn: this.documentArn,
      role,
      input: events.RuleTargetInput.fromObject(this.props.input),
      runCommandParameters: {
        runCommandTargets: [
          {
            key: this.props.targetKey,
            values: this.props.targetValues,
          },
        ],
      },
      targetResource: this.document,
    };
  }

  private getDocumentArn(): string {
    return cdk.Arn.format({
      service: 'ssm',
      resource: 'document',
      resourceName: this.document.name,
      region: cdk.Aws.REGION,
      account: cdk.Aws.ACCOUNT_ID,
      partition: cdk.Aws.PARTITION,
    });
  }

  private executeStatement(): iam.PolicyStatement {
    if (this.props.targetKey === 'InstanceIds') {
      return new iam.PolicyStatement({
        actions: ['ssm:SendCommand'],
        resources: this.props.targetValues.map(instanceId =>
          cdk.Arn.format({
            service: 'ec2',
            resource: 'instance',
            resourceName: instanceId,
            region: cdk.Aws.REGION,
            account: cdk.Aws.ACCOUNT_ID,
            partition: cdk.Aws.PARTITION,
          }),
        ),
      });
    } else {
      return new iam.PolicyStatement({
        actions: ['ssm:SendCommand'],
        resources: [
          cdk.Arn.format({
            service: 'ec2',
            resource: 'instance',
            resourceName: '*',
            region: cdk.Aws.REGION,
            account: cdk.Aws.ACCOUNT_ID,
            partition: cdk.Aws.PARTITION,
          }),
        ],
        conditions: {
          StringEquals: {
            'ec2:ResourceTag/*': this.props.targetValues,
          },
        },
      });
    }
  }
}
