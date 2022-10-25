import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig, singletonEventRole, TargetBaseProps } from './util';

/**
 * Create an SSM Automation Event Target
 */
export interface SsmAutomationProps extends TargetBaseProps {
  /**
   * Role to be used to run the Document
   *
   * @default - a new role is created.
   */
  readonly role?: iam.IRole;

  /**
   * The input parameters for the Automation document.
   *
   * @default - no input parameters passed to the document
   */
  readonly input?: { [key: string]: string[] };

  /**
   * Role to be used to run the Automation on your behalf. This should be a role
   * that allows the Automation service principal (ssm.amazonaws.com) to assume
   * and run the actions in your Automation document. Only required if the
   * document type is `Automation`.
   *
   * @default - no role assumed
   */
  readonly ssmAssumeRole?: iam.IRole;
}

/**
 * Create an SSM Automation Event Target
 */
export class SsmAutomation implements events.IRuleTarget {
  private documentArn: string;

  constructor(
    /**
     * Can be an instance of `ssm.CfnDocument` or a share/managed document ARN.
     */
    public readonly document: ssm.CfnDocument | string,
    private readonly props: SsmAutomationProps,
  ) {
    this.documentArn = this.getDocumentArn();
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SSM Automation as a
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
      input: events.RuleTargetInput.fromObject({ ...this.props.input, AutomationAssumeRole: [this.props.ssmAssumeRole?.roleArn] }),
      role,
      targetResource: (typeof this.document === 'string') ? undefined : this.document,
    };
  }

  private getDocumentArn(): string {
    if (typeof this.document === 'string') {
      return this.document;
    } else {
      return cdk.Arn.format({
        service: 'ssm',
        resource: 'automation-definition',
        resourceName: this.document.name,
        region: cdk.Aws.REGION,
        account: cdk.Aws.ACCOUNT_ID,
        partition: cdk.Aws.PARTITION,
      });
    }
  }

  private executeStatement(): iam.PolicyStatement {
    return new iam.PolicyStatement({
      actions: ['ssm:StartAutomationExecution'],
      resources: [this.documentArn],
    });
  }
}
