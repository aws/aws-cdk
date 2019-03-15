import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { CfnReceiptRule } from './ses.generated';

export interface ReceiptRuleActionProps {
  /**
   * Adds a header to the received email.
   */
  addHeaderAction?: CfnReceiptRule.AddHeaderActionProperty

  /**
   * Rejects the received email by returning a bounce response to the sender and,
   * optionally, publishes a notification to Amazon SNS.
   */
  bounceAction?: CfnReceiptRule.BounceActionProperty;

  /**
   * Calls an AWS Lambda function, and optionally, publishes a notification to
   * Amazon SNS.
   */
  lambdaAction?: CfnReceiptRule.LambdaActionProperty;

  /**
   * Saves the received message to an Amazon S3 bucket and, optionally, publishes
   * a notification to Amazon SNS.
   */
  s3Action?: CfnReceiptRule.S3ActionProperty;

  /**
   * Publishes the email content within a notification to Amazon SNS.
   */
  snsAction?: CfnReceiptRule.SNSActionProperty;

  /**
   * Terminates the evaluation of the receipt rule set and optionally publishes a
   * notification to Amazon SNS.
   */
  stopAction?: CfnReceiptRule.StopActionProperty;

  /**
   * Calls Amazon WorkMail and, optionally, publishes a notification to Amazon SNS.
   */
  workmailAction?: CfnReceiptRule.WorkmailActionProperty;
}

/**
 * An abstract action for a receipt rule.
 */
export interface IReceiptRuleAction {
  /**
   * Renders the action specification
   */
  render(): ReceiptRuleActionProps;
}

export interface ReceiptRuleAddHeaderActionProps {
  /**
   * The name of the header to add. Must be between 1 and 50 characters,
   * inclusive, and consist of alphanumeric (a-z, A-Z, 0-9) characters
   * and dashes only.
   */
  name: string;

  /**
   * The value of the header to add. Must be less than 2048 characters,
   * and must not contain newline characters ("\r" or "\n").
   */
  value: string;
}

/**
 * Adds a header to the received email
 */
export class ReceiptRuleAddHeaderAction implements IReceiptRuleAction {
  private readonly name: string;
  private readonly value: string;

  constructor(props: ReceiptRuleAddHeaderActionProps) {
    if (!/^[a-zA-Z0-9-]{1,50}$/.test(props.name)) {
      // tslint:disable:max-line-length
      throw new Error('Header `name` must be between 1 and 50 characters, inclusive, and consist of alphanumeric (a-z, A-Z, 0-9) characters and dashes only.');
      // tslint:enable:max-line-length
    }

    if (!/^[^\n\r]{0,2047}$/.test(props.value)) {
      throw new Error('Header `value` must be less than 2048 characters, and must not contain newline characters ("\r" or "\n").');
    }

    this.name = props.name;
    this.value = props.value;
  }

  public render(): ReceiptRuleActionProps {
    return {
      addHeaderAction: {
        headerName: this.name,
        headerValue: this.value
      }
    };
  }
}

export interface ReceiptRuleBounceActionTemplateProps {
  /**
   * Human-readable text to include in the bounce message.
   */
  message: string;

  /**
   * The SMTP reply code, as defined by RFC 5321.
   *
   * @see https://tools.ietf.org/html/rfc5321
   */
  smtpReplyCode: string;

  /**
   * The SMTP enhanced status code, as defined by RFC 3463.
   *
   * @see https://tools.ietf.org/html/rfc3463
   */
  statusCode?: string;
}

/**
 * A bounce action template.
 */
export class ReceiptRuleBounceActionTemplate {
  public static readonly MailboxDoesNotExist = new ReceiptRuleBounceActionTemplate({
    message: 'Mailbox does not exist',
    smtpReplyCode: '550',
    statusCode: '5.1.1'
  });

  public static readonly MessageTooLarge = new ReceiptRuleBounceActionTemplate({
    message: 'Message too large',
    smtpReplyCode: '552',
    statusCode: '5.3.4'
  });

  public static readonly MailboxFull = new ReceiptRuleBounceActionTemplate({
    message: 'Mailbox full',
    smtpReplyCode: '552',
    statusCode: '5.2.2'
  });

  public static readonly MessageContentRejected = new ReceiptRuleBounceActionTemplate({
    message: 'Message content rejected',
    smtpReplyCode: '500',
    statusCode: '5.6.1'
  });

  public static readonly TemporaryFailure = new ReceiptRuleBounceActionTemplate({
    message: 'Temporary failure',
    smtpReplyCode: '450',
    statusCode: '4.0.0'
  });

  public readonly message: string;
  public readonly smtpReplyCode: string;
  public readonly statusCode?: string;

  constructor(props: ReceiptRuleBounceActionTemplateProps) {
    this.message = props.message;
    this.smtpReplyCode = props.smtpReplyCode;
    this.statusCode = props.statusCode;
  }
}

export interface ReceiptRuleBounceActionProps {
  /**
   * The template containing the message, reply code and status code.
   */
  template: ReceiptRuleBounceActionTemplate;

  /**
   * The email address of the sender of the bounced email. This is the address
   * from which the bounce message will be sent.
   */
  sender: string;

  /**
   * The SNS topic to notify when the bounce action is taken.
   *
   * @default no notification
   */
  topic?: sns.ITopic;
}

/**
 * Rejects the received email by returning a bounce response to the sender and,
 * optionally, publishes a notification to Amazon SNS.
 */
export class ReceiptRuleBounceAction implements IReceiptRuleAction {
  constructor(private readonly props: ReceiptRuleBounceActionProps) {
  }

  public render(): ReceiptRuleActionProps {
    return {
      bounceAction: {
        sender: this.props.sender,
        smtpReplyCode: this.props.template.smtpReplyCode,
        message: this.props.template.message,
        topicArn: this.props.topic ? this.props.topic.topicArn : undefined,
        statusCode: this.props.template.statusCode
      }
    };
  }
}

/**
 * The type of invocation to use for a Lambda Action.
 */
export enum LambdaInvocationType {
  /**
   * The function will be invoked asynchronously.
   */
  Event = 'Event',

  /**
   * The function will be invoked sychronously. Use RequestResponse only when
   * you want to make a mail flow decision, such as whether to stop the receipt
   * rule or the receipt rule set.
   */
  RequestResponse = 'RequestResponse',
}

export interface ReceiptRuleLambdaActionProps {
  /**
   * The Lambda function to invoke.
   */
  function: lambda.IFunction

  /**
   * The invocation type of the Lambda function.
   *
   * @default Event
   */
  invocationType?: LambdaInvocationType;

  /**
   * The SNS topic to notify when the Lambda action is taken.
   *
   * @default no notification
   */
  topic?: sns.ITopic;
}

/**
 * Calls an AWS Lambda function, and optionally, publishes a notification to
 * Amazon SNS.
 */
export class ReceiptRuleLambdaAction implements IReceiptRuleAction {
  constructor(private readonly props: ReceiptRuleLambdaActionProps) {
  }

  public render(): ReceiptRuleActionProps {
    // Allow SES to invoke Lambda function
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-permissions.html#receiving-email-permissions-lambda
    const permissionId = 'AllowSes';
    if (!this.props.function.node.tryFindChild(permissionId)) {
      this.props.function.addPermission(permissionId, {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('ses.amazonaws.com'),
        sourceAccount: new cdk.ScopedAws().accountId
      });
    }

    return {
      lambdaAction: {
        functionArn: this.props.function.functionArn,
        invocationType: this.props.invocationType,
        topicArn: this.props.topic ? this.props.topic.topicArn : undefined
      }
    };
  }
}

export interface ReceiptRuleS3ActionProps {
  /**
   * The S3 bucket that incoming email will be saved to.
   */
  bucket: s3.IBucket;

  /**
   * The master key that SES should use to encrypt your emails before saving
   * them to the S3 bucket.
   *
   * @default no encryption
   */
  kmsKey?: kms.IEncryptionKey;

  /**
   * The key prefix of the S3 bucket.
   *
   * @default no prefix
   */
  objectKeyPrefix?: string;

  /**
   * The SNS topic to notify when the S3 action is taken.
   *
   * @default no notification
   */
  topic?: sns.ITopic;
}

/**
 * Saves the received message to an Amazon S3 bucket and, optionally, publishes
 * a notification to Amazon SNS.
 */
export class ReceiptRuleS3Action implements IReceiptRuleAction {
  constructor(private readonly props: ReceiptRuleS3ActionProps) {
  }

  public render(): ReceiptRuleActionProps {
    // Allow SES to write to S3 bucket
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-permissions.html#receiving-email-permissions-s3
    const keyPattern = this.props.objectKeyPrefix || '';

    const s3Statement = new iam.PolicyStatement()
      .addAction('s3:PutObject')
      .addServicePrincipal('ses.amazonaws.com')
      .addResource(this.props.bucket.arnForObjects(`${keyPattern}*`))
      .addCondition('StringEquals', {
        'aws:Referer': new cdk.ScopedAws().accountId
      });

    this.props.bucket.addToResourcePolicy(s3Statement);

    // Allow SES to use KMS master key
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-permissions.html#receiving-email-permissions-kms
    if (this.props.kmsKey && !/alias\/aws\/ses$/.test(this.props.kmsKey.keyArn)) {
      const kmsStatement = new iam.PolicyStatement()
        .addActions('km:Encrypt', 'kms:GenerateDataKey')
        .addServicePrincipal('ses.amazonaws.com')
        .addAllResources()
        .addConditions({
          Null: {
            'kms:EncryptionContext:aws:ses:rule-name': 'false',
            'kms:EncryptionContext:aws:ses:message-id': 'false'
          },
          StringEquals: {
            'kms:EncryptionContext:aws:ses:source-account': new cdk.ScopedAws().accountId
          }
        });

      this.props.kmsKey.addToResourcePolicy(kmsStatement);
    }

    return {
      s3Action: {
        bucketName: this.props.bucket.bucketName,
        kmsKeyArn: this.props.kmsKey ? this.props.kmsKey.keyArn : undefined,
        objectKeyPrefix: this.props.objectKeyPrefix,
        topicArn: this.props.topic ? this.props.topic.topicArn : undefined
      }
    };
  }
}

/**
 * The type of email encoding to use for a SNS action.
 */
export enum EmailEncoding {
  /**
   * Base 64
   */
  Base64 = 'Base64',

  /**
   * UTF-8
   */
  UTF8 = 'UTF-8',
}

export interface ReceiptRuleSnsActionProps {
  /**
   * The encoding to use for the email within the Amazon SNS notification.
   *
   * @default UTF-8
   */
  encoding?: EmailEncoding;

  /**
   * The SNS topic to notify.
   */
  topic: sns.ITopic;
}

/**
 * Publishes the email content within a notification to Amazon SNS.
 */
export class ReceiptRuleSnsAction implements IReceiptRuleAction {
  constructor(private readonly props: ReceiptRuleSnsActionProps) {
  }

  public render(): ReceiptRuleActionProps {
    return {
      snsAction: {
        encoding: this.props.encoding,
        topicArn: this.props.topic.topicArn
      }
    };
  }
}

export interface ReceiptRuleStopActionProps {
  /**
   * The SNS topic to notify when the stop action is taken.
   */
  topic?: sns.ITopic;
}

/**
 * Terminates the evaluation of the receipt rule set and optionally publishes a
 * notification to Amazon SNS.
 */
export class ReceiptRuleStopAction implements IReceiptRuleAction {
  constructor(private readonly props?: ReceiptRuleStopActionProps) {
  }

  public render(): ReceiptRuleActionProps {
    return {
      stopAction: {
        scope: 'RuleSet',
        topicArn: this.props && this.props.topic ? this.props.topic.topicArn : undefined
      }
    };
  }
}
