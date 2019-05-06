import { CfnOutput, Construct, IResource, Resource } from '@aws-cdk/cdk';
import { DropSpamReceiptRule, ReceiptRule, ReceiptRuleOptions } from './receipt-rule';
import { CfnReceiptRuleSet } from './ses.generated';

/**
 * A receipt rule set.
 */
export interface IReceiptRuleSet extends IResource {
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
   * Exports this receipt rule set from the stack.
   */
  export(): ReceiptRuleSetImportProps;
}

/**
 * Construction properties for a ReceiptRuleSet.
 */
export interface ReceiptRuleSetProps {
  /**
   * The name for the receipt rule set.
   *
   * @default a CloudFormation generated name
   */
  readonly name?: string;

  /**
   * The list of rules to add to this rule set. Rules are added in the same
   * order as they appear in the list.
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

/**
 * A new receipt rule set.
 */
export class ReceiptRuleSet extends ReceiptRuleSetBase {
  /**
   * Import an exported receipt rule set.
   */
  public static import(scope: Construct, id: string, props: ReceiptRuleSetImportProps): IReceiptRuleSet {
    return new ImportedReceiptRuleSet(scope, id, props);
  }

  public readonly name: string;

  constructor(scope: Construct, id: string, props?: ReceiptRuleSetProps) {
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
   * Exports this receipt rule set from the stack.
   */
  public export(): ReceiptRuleSetImportProps {
    return {
      name: new CfnOutput(this, 'ReceiptRuleSetName', { value: this.name }).makeImportValue().toString()
    };
  }
}

/**
 * Construction properties for an ImportedReceiptRuleSet.
 */
export interface ReceiptRuleSetImportProps {
  /**
   * The receipt rule set name.
   */
  readonly name: string;
}

/**
 * An imported receipt rule set.
 */
class ImportedReceiptRuleSet extends ReceiptRuleSetBase implements IReceiptRuleSet {
  public readonly name: string;

  constructor(scope: Construct, id: string, private readonly props: ReceiptRuleSetImportProps) {
    super(scope, id);

    this.name = props.name;
  }

  /**
   * Exports this receipt rule set from the stack.
   */
  public export() {
    return this.props;
  }
}
