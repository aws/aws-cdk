import * as ses from '../../aws-ses';
import * as sns from '../../aws-sns';

/**
 * Construction properties for a WorkMail action.
 */
export interface WorkMailProps {
  /**
   * The WorkMail organization ARN.
   *
   * @example 'arn:aws:workmail:us-east-1:123456789012:organization/m-organizationid'
   */
  readonly organizationArn: string;

  /**
   * The SNS topic to notify when the WorkMail action is taken.
   *
   * @default - no topic will be attached to the action
   */
  readonly topic?: sns.ITopic;
}

/**
 * Integrates an Amazon WorkMail action into a receipt rule set,
 * and optionally publishes a notification to Amazon SNS.
 *
 * Beware that WorkMail should already set up an active `INBOUND_MAIL` rule set
 * that includes a WorkMail rule action for this exact purpose.
 * This action should be used to customize the behavior of replacement rule set.
 *
 * @see https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-workmail.html
 */
export class WorkMail implements ses.IReceiptRuleAction {
  constructor(private readonly props: WorkMailProps) {
  }

  public bind(_rule: ses.IReceiptRule): ses.ReceiptRuleActionConfig {
    return {
      workmailAction: {
        organizationArn: this.props.organizationArn,
        topicArn: this.props.topic?.topicArn,
      },
    };
  }
}
