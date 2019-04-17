import lambda = require('@aws-cdk/aws-lambda');
import { CfnOutput, Construct, IResource, Resource, Token } from '@aws-cdk/cdk';
import { IReceiptRuleAction, LambdaInvocationType, ReceiptRuleActionProps, ReceiptRuleLambdaAction } from './receipt-rule-action';
import { IReceiptRuleSet } from './receipt-rule-set';
import { CfnReceiptRule } from './ses.generated';

/**
 * A receipt rule.
 */
export interface IReceiptRule extends IResource {
  /**
   * The name of the receipt rule.
   */
  readonly name: string;

  /**
   * Exports this receipt rule from the stack.
   */
  export(): ReceiptRuleImportProps;
}

/**
 * The type of TLS policy for a receipt rule.
 */
export enum TlsPolicy {
  /**
   * Do not check for TLS.
   */
  Optional = 'Optional',

  /**
   * Bounce emails that are not received over TLS.
   */
  Require = 'Require'
}

/**
 * Options to add a receipt rule to a receipt rule set.
 */
export interface ReceiptRuleOptions {
  /**
   * An ordered list of actions to perform on messages that match at least
   * one of the recipient email addresses or domains specified in the
   * receipt rule.
   */
  readonly actions?: IReceiptRuleAction[];

  /**
   * An existing rule after which the new rule will be placed.
   *
   * @default the new rule is inserted at the beginning of the rule list
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
   * @default a CloudFormation generated name
   */
  readonly name?: string;

  /**
   * The recipient domains and email addresses that the receipt rule applies to.
   *
   * @default match all recipients under all verified domains.
   */
  readonly recipients?: string[];

  /**
   * Wheter to scan for spam and viruses.
   *
   * @default false
   */
  readonly scanEnabled?: boolean;

  /**
   * The TLS policy
   *
   * @default Optional
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
  /**
   * Import an exported receipt rule.
   */
  public static import(scope: Construct, id: string, props: ReceiptRuleImportProps): IReceiptRule {
    return new ImportedReceiptRule(scope, id, props);
  }

  public readonly name: string;
  private readonly renderedActions = new Array<ReceiptRuleActionProps>();

  constructor(scope: Construct, id: string, props: ReceiptRuleProps) {
    super(scope, id);

    const resource = new CfnReceiptRule(this, 'Resource', {
      after: props.after ? props.after.name : undefined,
      rule: {
        actions: new Token(() => this.getRenderedActions()),
        enabled: props.enabled === undefined ? true : props.enabled,
        name: props.name,
        recipients: props.recipients,
        scanEnabled: props.scanEnabled,
        tlsPolicy: props.tlsPolicy
      },
      ruleSetName: props.ruleSet.name
    });

    this.name = resource.receiptRuleName;

    if (props.actions) {
      props.actions.forEach(action => this.addAction(action));
    }
  }

  /**
   * Adds an action to this receipt rule.
   */
  public addAction(action: IReceiptRuleAction) {
    const renderedAction = action.render();

    this.renderedActions.push(renderedAction);
  }

  /**
   * Exports this receipt rule from the stack.
   */
  public export(): ReceiptRuleImportProps {
    return {
      name: new CfnOutput(this, 'ReceiptRuleName', { value: this.name }).makeImportValue().toString()
    };
  }

  private getRenderedActions() {
    if (this.renderedActions.length === 0) {
      return undefined;
    }

    return this.renderedActions;
  }
}

export interface ReceiptRuleImportProps {
  /**
   * The name of the receipt rule.
   */
  readonly name: string;
}

/**
 * An imported receipt rule.
 */
class ImportedReceiptRule extends Construct implements IReceiptRule {
  public readonly name: string;

  constructor(scope: Construct, id: string, private readonly props: ReceiptRuleImportProps) {
    super(scope, id);

    this.name = props.name;
  }

  /**
   * Exports this receipt rule from the stack.
   */
  public export() {
    return this.props;
  }
}

/**
 * A rule added at the top of the rule set to drop spam/virus.
 *
 * @see https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-lambda-example-functions.html
 */
export class DropSpamReceiptRule extends Construct {
  public readonly rule: ReceiptRule;

  constructor(scope: Construct, id: string, props: ReceiptRuleProps) {
    super(scope, id);

    const fn = new lambda.SingletonFunction(this, 'Function', {
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${dropSpamCode}`),
      uuid: '224e77f9-a32e-4b4d-ac32-983477abba16'
    });

    this.rule = new ReceiptRule(this, 'Rule', {
      actions: [
        new ReceiptRuleLambdaAction({
          function: fn,
          invocationType: LambdaInvocationType.RequestResponse
        })
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
  console.log("SES Notification:\n", JSON.stringify(sesNotification, null, 2));

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
