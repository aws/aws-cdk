import { IReceiptRule } from './receipt-rule';
import { CfnReceiptRule } from './ses.generated';

/**
 * An abstract action for a receipt rule.
 */
export interface IReceiptRuleAction {
  /**
   * Returns the receipt rule action specification
   */
  bind(receiptRule: IReceiptRule): ReceiptRuleActionConfig;
}

/**
 * Properties for a receipt rule action.
 */
export interface ReceiptRuleActionConfig {
  /**
   * Adds a header to the received email.
   */
  readonly addHeaderAction?: CfnReceiptRule.AddHeaderActionProperty

  /**
   * Rejects the received email by returning a bounce response to the sender and,
   * optionally, publishes a notification to Amazon SNS.
   */
  readonly bounceAction?: CfnReceiptRule.BounceActionProperty;

  /**
   * Calls an AWS Lambda function, and optionally, publishes a notification to
   * Amazon SNS.
   */
  readonly lambdaAction?: CfnReceiptRule.LambdaActionProperty;

  /**
   * Saves the received message to an Amazon S3 bucket and, optionally, publishes
   * a notification to Amazon SNS.
   */
  readonly s3Action?: CfnReceiptRule.S3ActionProperty;

  /**
   * Publishes the email content within a notification to Amazon SNS.
   */
  readonly snsAction?: CfnReceiptRule.SNSActionProperty;

  /**
   * Terminates the evaluation of the receipt rule set and optionally publishes a
   * notification to Amazon SNS.
   */
  readonly stopAction?: CfnReceiptRule.StopActionProperty;

  /**
   * Calls Amazon WorkMail and, optionally, publishes a notification to Amazon SNS.
   */
  readonly workmailAction?: CfnReceiptRule.WorkmailActionProperty;
}
