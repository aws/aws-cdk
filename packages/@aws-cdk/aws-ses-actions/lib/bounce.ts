import * as ses from '@aws-cdk/aws-ses';
import * as sns from '@aws-cdk/aws-sns';

/**
 * Construction properties for a BounceTemplate.
 */
export interface BounceTemplateProps {
  /**
   * Human-readable text to include in the bounce message.
   */
  readonly message: string;

  /**
   * The SMTP reply code, as defined by RFC 5321.
   *
   * @see https://tools.ietf.org/html/rfc5321
   */
  readonly smtpReplyCode: string;

  /**
   * The SMTP enhanced status code, as defined by RFC 3463.
   *
   * @see https://tools.ietf.org/html/rfc3463
   */
  readonly statusCode?: string;
}

/**
 * A bounce template.
 */
export class BounceTemplate {
  public static readonly MAILBOX_DOES_NOT_EXIST = new BounceTemplate({
    message: 'Mailbox does not exist',
    smtpReplyCode: '550',
    statusCode: '5.1.1',
  });

  public static readonly MESSAGE_TOO_LARGE = new BounceTemplate({
    message: 'Message too large',
    smtpReplyCode: '552',
    statusCode: '5.3.4',
  });

  public static readonly MAILBOX_FULL = new BounceTemplate({
    message: 'Mailbox full',
    smtpReplyCode: '552',
    statusCode: '5.2.2',
  });

  public static readonly MESSAGE_CONTENT_REJECTED = new BounceTemplate({
    message: 'Message content rejected',
    smtpReplyCode: '500',
    statusCode: '5.6.1',
  });

  public static readonly TEMPORARY_FAILURE = new BounceTemplate({
    message: 'Temporary failure',
    smtpReplyCode: '450',
    statusCode: '4.0.0',
  });

  constructor(public readonly props: BounceTemplateProps) {
  }
}

/**
 * Construction properties for a bounce action.
 */
export interface BounceProps {
  /**
   * The template containing the message, reply code and status code.
   */
  readonly template: BounceTemplate;

  /**
   * The email address of the sender of the bounced email. This is the address
   * from which the bounce message will be sent.
   */
  readonly sender: string;

  /**
   * The SNS topic to notify when the bounce action is taken.
   *
   * @default no notification
   */
  readonly topic?: sns.ITopic;
}

/**
 * Rejects the received email by returning a bounce response to the sender and,
 * optionally, publishes a notification to Amazon SNS.
 */
export class Bounce implements ses.IReceiptRuleAction {
  constructor(private readonly props: BounceProps) {
  }

  public bind(_rule: ses.IReceiptRule): ses.ReceiptRuleActionConfig {
    return {
      bounceAction: {
        sender: this.props.sender,
        smtpReplyCode: this.props.template.props.smtpReplyCode,
        message: this.props.template.props.message,
        topicArn: this.props.topic?.topicArn,
        statusCode: this.props.template.props.statusCode,
      },
    };
  }
}
