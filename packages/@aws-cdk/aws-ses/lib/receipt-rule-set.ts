import cdk = require('@aws-cdk/cdk');
import { DropSpamReceiptRule, ReceiptRule, ReceiptRuleOptions } from './receipt-rule';
import { CfnReceiptRuleSet } from './ses.generated';

export interface IReceiptRuleSet extends cdk.IConstruct {
  /**
   * The receipt rule set name.
   */
  readonly name: string;

  /**
   * Adds a new receipt rule in this rule set. The new rule is added after
   * the last added rule unless `after` is specified.
   */
  addRule(id: string, options?: ReceiptRuleOptions): ReceiptRule;

  /**
   * Exports this receipt rule from the stack.
   */
  export(): ReceiptRuleSetImportProps;
}

export interface ReceiptRuleSetProps {
  /**
   * The name for the receipt rule set.
   *
   * @default a CloudFormation generated name
   */
  name?: string;

  /**
   * The list of rules to add to this rule set. Rules are added in the same
   * order as they appear in the list.
   */
  rules?: ReceiptRuleOptions[]

  /**
   * Whether to add a first rule to stop processing messages
   * that have at least one spam indicator.
   *
   * @default false
   */
  dropSpam?: boolean;
}

/**
 * A new or imported receipt rule set.
 */
export abstract class ReceiptRuleSetBase extends cdk.Construct implements IReceiptRuleSet {
  public abstract readonly name: string;

  private lastAddedRule?: ReceiptRule;

  /**
   * Adds a new receipt rule in this rule set. The new rule is added after
   * the last added rule unless `after` is specified.
   */
  public addRule(id: string, options?: ReceiptRuleOptions): ReceiptRule {
    this.lastAddedRule = new ReceiptRule(this, id, {
      after: this.lastAddedRule ? this.lastAddedRule : undefined,
      ruleSet: this,
      ...options
    });

    return this.lastAddedRule;
  }

  public abstract export(): ReceiptRuleSetImportProps;

  /**
   * Adds a drop spam rule
   */
  protected addDropSpamRule(): void {
    const dropSpam = new DropSpamReceiptRule(this, 'DropSpam', {
      ruleSet: this
    });
    this.lastAddedRule = dropSpam.rule;
  }
}

export class ReceiptRuleSet extends ReceiptRuleSetBase implements IReceiptRuleSet {
  /**
   * Import an exported receipt rule set.
   */
  public static import(scope: cdk.Construct, id: string, props: ReceiptRuleSetImportProps): IReceiptRuleSet {
    return new ImportedReceiptRuleSet(scope, id, props);
  }

  public readonly name: string;

  constructor(scope: cdk.Construct, id: string, props?: ReceiptRuleSetProps) {
    super(scope, id);

    const resource = new CfnReceiptRuleSet(this, 'Resource', {
      ruleSetName: props ? props.name : undefined
    });

    this.name = resource.receiptRuleSetName;

    if (props) {
      const rules = props.rules || [];
      rules.forEach((ruleOption, idx) => this.addRule(`Rule${idx}`, ruleOption));

      if (props.dropSpam) {
        this.addDropSpamRule();
      }
    }
  }

  /**
   * Exports this receipt rule set to another stack.
   */
  public export(): ReceiptRuleSetImportProps {
    return {
      name: new cdk.Output(this, 'ReceiptRuleSetName', { value: this.name }).makeImportValue().toString()
    };
  }
}

export interface ReceiptRuleSetImportProps {
  /**
   * The receipt rule set name.
   */
  name: string;
}

class ImportedReceiptRuleSet extends ReceiptRuleSetBase implements IReceiptRuleSet {
  public readonly name: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: ReceiptRuleSetImportProps) {
    super(scope, id);

    this.name = props.name;
  }

  public export() {
    return this.props;
  }
}
