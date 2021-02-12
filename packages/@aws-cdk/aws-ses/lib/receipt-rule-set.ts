import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DropSpamReceiptRule, ReceiptRule, ReceiptRuleOptions } from './receipt-rule';
import { CfnReceiptRuleSet } from './ses.generated';

/**
 * A receipt rule set.
 */
export interface IReceiptRuleSet extends IResource {
  /**
   * The receipt rule set name.
   * @attribute
   */
  readonly receiptRuleSetName: string;

  /**
   * Adds a new receipt rule in this rule set. The new rule is added after
   * the last added rule unless `after` is specified.
   */
  addRule(id: string, options?: ReceiptRuleOptions): ReceiptRule;
}

/**
 * Construction properties for a ReceiptRuleSet.
 */
export interface ReceiptRuleSetProps {
  /**
   * The name for the receipt rule set.
   *
   * @default - A CloudFormation generated name.
   */
  readonly receiptRuleSetName?: string;

  /**
   * The list of rules to add to this rule set. Rules are added in the same
   * order as they appear in the list.
   *
   * @default - No rules are added to the rule set.
   */
  readonly rules?: ReceiptRuleOptions[]

  /**
   * Whether to add a first rule to stop processing messages
   * that have at least one spam indicator.
   *
   * @default false
   */
  readonly dropSpam?: boolean;
}

/**
 * A new or imported receipt rule set.
 */
abstract class ReceiptRuleSetBase extends Resource implements IReceiptRuleSet {
  public abstract readonly receiptRuleSetName: string;

  private lastAddedRule?: ReceiptRule;

  /**
   * Adds a new receipt rule in this rule set. The new rule is added after
   * the last added rule unless `after` is specified.
   */
  public addRule(id: string, options?: ReceiptRuleOptions): ReceiptRule {
    this.lastAddedRule = new ReceiptRule(this, id, {
      after: this.lastAddedRule ?? undefined,
      ruleSet: this,
      ...options,
    });

    return this.lastAddedRule;
  }

  /**
   * Adds a drop spam rule
   */
  protected addDropSpamRule(): void {
    const dropSpam = new DropSpamReceiptRule(this, 'DropSpam', {
      ruleSet: this,
    });
    this.lastAddedRule = dropSpam.rule;
  }
}

/**
 * A new receipt rule set.
 */
export class ReceiptRuleSet extends ReceiptRuleSetBase {
  /**
   * Import an exported receipt rule set.
   */
  public static fromReceiptRuleSetName(scope: Construct, id: string, receiptRuleSetName: string): IReceiptRuleSet {
    class Import extends ReceiptRuleSetBase implements IReceiptRuleSet {
      public readonly receiptRuleSetName = receiptRuleSetName;
    }
    return new Import(scope, id);
  }

  public readonly receiptRuleSetName: string;

  constructor(scope: Construct, id: string, props: ReceiptRuleSetProps = {}) {
    super(scope, id, {
      physicalName: props.receiptRuleSetName,
    });

    const resource = new CfnReceiptRuleSet(this, 'Resource', {
      ruleSetName: this.physicalName,
    });

    this.receiptRuleSetName = resource.ref;

    if (props) {
      const rules = props.rules || [];
      rules.forEach((ruleOption, idx) => this.addRule(`Rule${idx}`, ruleOption));

      if (props.dropSpam) {
        this.addDropSpamRule();
      }
    }
  }
}
