import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import * as ses from '../../aws-ses';
import * as sns from '../../aws-sns';
import * as cdk from '../../core';

/**
 * Construction properties for a S3 action.
 */
export interface S3Props {
  /**
   * The S3 bucket that incoming email will be saved to.
   */
  readonly bucket: s3.IBucket;

  /**
   * The master key that SES should use to encrypt your emails before saving
   * them to the S3 bucket.
   *
   * @default no encryption
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The key prefix of the S3 bucket.
   *
   * @default no prefix
   */
  readonly objectKeyPrefix?: string;

  /**
   * The SNS topic to notify when the S3 action is taken.
   *
   * @default no notification
   */
  readonly topic?: sns.ITopic;
}

/**
 * Saves the received message to an Amazon S3 bucket and, optionally, publishes
 * a notification to Amazon SNS.
 */
export class S3 implements ses.IReceiptRuleAction {
  private rule?: ses.IReceiptRule;
  constructor(private readonly props: S3Props) {
  }

  public bind(rule: ses.IReceiptRule): ses.ReceiptRuleActionConfig {
    this.rule = rule;

    // Allow SES to use KMS master key
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-permissions.html#receiving-email-permissions-kms
    if (this.props.kmsKey && !/alias\/aws\/ses$/.test(this.props.kmsKey.keyArn)) {
      const kmsStatement = new iam.PolicyStatement({
        actions: ['kms:Encrypt', 'kms:GenerateDataKey'],
        principals: [new iam.ServicePrincipal('ses.amazonaws.com')],
        resources: ['*'],
        conditions: {
          Null: {
            'kms:EncryptionContext:aws:ses:rule-name': 'false',
            'kms:EncryptionContext:aws:ses:message-id': 'false',
          },
          StringEquals: {
            'kms:EncryptionContext:aws:ses:source-account': cdk.Aws.ACCOUNT_ID,
          },
        },
      });

      this.props.kmsKey.addToResourcePolicy(kmsStatement);
    }

    return {
      s3Action: {
        bucketName: this.props.bucket.bucketName,
        kmsKeyArn: this.props.kmsKey?.keyArn,
        objectKeyPrefix: this.props.objectKeyPrefix,
        topicArn: this.props.topic?.topicArn,
      },
    };
  }

  /**
   * @internal
   */
  public applyPolicyStatement(receiptRuleSet: ses.IReceiptRuleSet): void {
    if (!this.rule) {
      throw new Error('Cannot apply policy statement before binding the action to a receipt rule');
    }

    // Allow SES to write to S3 bucket
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-permissions.html#receiving-email-permissions-s3
    const keyPattern = this.props.objectKeyPrefix || '';
    const s3Statement = new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      principals: [new iam.ServicePrincipal('ses.amazonaws.com')],
      resources: [this.props.bucket.arnForObjects(`${keyPattern}*`)],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': cdk.Aws.ACCOUNT_ID,
          'aws:SourceArn': cdk.Arn.format({
            partition: cdk.Aws.PARTITION,
            service: 'ses',
            region: cdk.Aws.REGION,
            account: cdk.Aws.ACCOUNT_ID,
            resource: [
              `receipt-rule-set/${receiptRuleSet.receiptRuleSetName}`,
              `receipt-rule/${this.rule.receiptRuleName}`,
            ].join(':'),
          }),
        },
      },
    });
    this.props.bucket.addToResourcePolicy(s3Statement);
  }
}
