import * as ses from '@aws-cdk/aws-ses';
import * as sns from '@aws-cdk/aws-sns';

/**
 * The type of email encoding to use for a SNS action.
 */
export enum EmailEncoding {
  /**
   * Base 64
   */
  BASE64 = 'Base64',

  /**
   * UTF-8
   */
  UTF8 = 'UTF-8',
}

/**
 * Construction properties for a SNS action.
 */
export interface SnsProps {
  /**
   * The encoding to use for the email within the Amazon SNS notification.
   *
   * @default UTF-8
   */
  readonly encoding?: EmailEncoding;

  /**
   * The SNS topic to notify.
   */
  readonly topic: sns.ITopic;
}

/**
 * Publishes the email content within a notification to Amazon SNS.
 */
export class Sns implements ses.IReceiptRuleAction {
  constructor(private readonly props: SnsProps) {
  }

  public bind(_rule: ses.IReceiptRule): ses.ReceiptRuleActionConfig {
    return {
      snsAction: {
        encoding: this.props.encoding,
        topicArn: this.props.topic.topicArn,
      },
    };
  }
}
