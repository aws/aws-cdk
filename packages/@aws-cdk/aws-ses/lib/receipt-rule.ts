import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Aws, Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
import { IReceiptRuleAction } from './receipt-rule-action';
import { IReceiptRuleSet } from './receipt-rule-set';
import { CfnReceiptRule } from './ses.generated';

/**
 * A receipt rule.
 */
export interface IReceiptRule extends IResource {
  /**
   * The name of the receipt rule.
   * @attribute
   */
  readonly receiptRuleName: string;
}

/**
 * The type of TLS policy for a receipt rule.
 */
export enum TlsPolicy {
  /**
   * Do not check for TLS.
   */
  OPTIONAL = 'Optional',

  /**
   * Bounce emails that are not received over TLS.
   */
  REQUIRE = 'Require'
}

/**
 * Options to add a receipt rule to a receipt rule set.
 */
export interface ReceiptRuleOptions {
  /**
   * An ordered list of actions to perform on messages that match at least
   * one of the recipient email addresses or domains specified in the
   * receipt rule.
   *
   * @default - No actions.
   */
  readonly actions?: IReceiptRuleAction[];

  /**
   * An existing rule after which the new rule will be placed.
   *
   * @default - The new rule is inserted at the beginning of the rule list.
   */
  readonly after?: IReceiptRule;

  /**
   * Whether the rule is active.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The name for the rule
   *
   * @default - A CloudFormation generated name.
   */
  readonly receiptRuleName?: string;

  /**
   * The recipient domains and email addresses that the receipt rule applies to.
   *
   * @default - Match all recipients under all verified domains.
   */
  readonly recipients?: string[];

  /**
   * Whether to scan for spam and viruses.
   *
   * @default false
   */
  readonly scanEnabled?: boolean;

  /**
   * Whether Amazon SES should require that incoming email is delivered over a
   * connection encrypted with Transport Layer Security (TLS).
   *
   * @default - Optional which will not check for TLS.
   */
  readonly tlsPolicy?: TlsPolicy;
}

/**
 * Construction properties for a ReceiptRule.
 */
export interface ReceiptRuleProps extends ReceiptRuleOptions {
  /**
   * The name of the rule set that the receipt rule will be added to.
   */
  readonly ruleSet: IReceiptRuleSet;
}

/**
 * A new receipt rule.
 */
export class ReceiptRule extends Resource implements IReceiptRule {

  public static fromReceiptRuleName(scope: Construct, id: string, receiptRuleName: string): IReceiptRule {
    class Import extends Resource implements IReceiptRule {
      public readonly receiptRuleName = receiptRuleName;
    }
    return new Import(scope, id);
  }

  public readonly receiptRuleName: string;
  private readonly actions = new Array<CfnReceiptRule.ActionProperty>();

  constructor(scope: Construct, id: string, props: ReceiptRuleProps) {
    super(scope, id, {
      physicalName: props.receiptRuleName,
    });

    const resource = new CfnReceiptRule(this, 'Resource', {
      after: props.after ? props.after.receiptRuleName : undefined,
      rule: {
        actions: Lazy.anyValue({ produce: () => this.renderActions() }),
        enabled: props.enabled === undefined ? true : props.enabled,
        name: this.physicalName,
        recipients: props.recipients,
        scanEnabled: props.scanEnabled,
        tlsPolicy: props.tlsPolicy
      },
      ruleSetName: props.ruleSet.receiptRuleSetName
    });

    this.receiptRuleName = resource.ref;

    for (const action of props.actions || []) {
      this.addAction(action);
    }
  }

  /**
   * Adds an action to this receipt rule.
   */
  public addAction(action: IReceiptRuleAction) {
    this.actions.push(action.bind(this));
  }

  private renderActions() {
    if (this.actions.length === 0) {
      return undefined;
    }

    return this.actions;
  }
}

// tslint:disable-next-line:no-empty-interface
export interface DropSpamReceiptRuleProps extends ReceiptRuleProps {

}

/**
 * A rule added at the top of the rule set to drop spam/virus.
 *
 * @see https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-lambda-example-functions.html
 */
export class DropSpamReceiptRule extends Construct {
  public readonly rule: ReceiptRule;

  constructor(scope: Construct, id: string, props: DropSpamReceiptRuleProps) {
    super(scope, id);

    const fn = new lambda.SingletonFunction(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${dropSpamCode}`),
      uuid: '224e77f9-a32e-4b4d-ac32-983477abba16'
    });

    fn.addPermission('AllowSes', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('ses.amazonaws.com'),
      sourceAccount: Aws.ACCOUNT_ID
    });

    this.rule = new ReceiptRule(this, 'Rule', {
      actions: [
        {
          bind: () => ({
            lambdaAction: {
              functionArn: fn.functionArn,
              invocationType: 'RequestResponse',
            }
          })
        },
      ],
      scanEnabled: true,
      ruleSet: props.ruleSet
    });
  }
}

// Adapted from https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-lambda-example-functions.html
// tslint:disable:no-console
function dropSpamCode(event: any, _: any, callback: any) {
  console.log('Spam filter');

  const sesNotification = event.Records[0].ses;
  console.log('SES Notification:\n', JSON.stringify(sesNotification, null, 2));

  // Check if any spam check failed
  if (sesNotification.receipt.spfVerdict.status === 'FAIL'
      || sesNotification.receipt.dkimVerdict.status === 'FAIL'
      || sesNotification.receipt.spamVerdict.status === 'FAIL'
      || sesNotification.receipt.virusVerdict.status === 'FAIL') {
    console.log('Dropping spam');

    // Stop processing rule set, dropping message
    callback(null, { disposition : 'STOP_RULE_SET' });
  } else {
    callback(null, null);
  }
}
