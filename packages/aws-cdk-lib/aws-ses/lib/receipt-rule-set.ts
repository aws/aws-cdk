import { Construct } from 'constructs';
import { DropSpamReceiptRule, ReceiptRule, ReceiptRuleOptions } from './receipt-rule';
import { CfnReceiptRuleSet } from './ses.generated';
import * as iam from '../../aws-iam';
import { IResource, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../custom-resources';
import { IReceiptRuleSetRef, ReceiptRuleSetReference } from '../../interfaces/generated/aws-ses-interfaces.generated';

/**
 * A receipt rule set.
 */
export interface IReceiptRuleSet extends IResource, IReceiptRuleSetRef {
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
  readonly rules?: ReceiptRuleOptions[];

  /**
   * Whether to add a first rule to stop processing messages
   * that have at least one spam indicator.
   *
   * @default false
   */
  readonly dropSpam?: boolean;

  /**
   * Whether to set this receipt rule set as the active rule set.
   *
   * Only one receipt rule set can be active at a time. Setting this to `true`
   * will activate this rule set and deactivate any other active rule set.
   *
   * When the stack is deleted, the rule set will be deactivated before deletion.
   *
   * @default false
   */
  readonly active?: boolean;
}

/**
 * A new or imported receipt rule set.
 */
abstract class ReceiptRuleSetBase extends Resource implements IReceiptRuleSet {
  public abstract readonly receiptRuleSetName: string;

  private lastAddedRule?: ReceiptRule;

  public get receiptRuleSetRef(): ReceiptRuleSetReference {
    return {
      ruleSetName: this.receiptRuleSetName,
    };
  }

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
@propertyInjectable
export class ReceiptRuleSet extends ReceiptRuleSetBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ses.ReceiptRuleSet';

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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnReceiptRuleSet(this, 'Resource', {
      ruleSetName: this.physicalName,
    });

    this.receiptRuleSetName = resource.ref;

    if (props.active) {
      this.createActiveRuleSetCustomResource(resource);
    }

    if (props) {
      if (props.dropSpam) {
        this.addDropSpamRule();
      }

      const rules = props.rules || [];
      rules.forEach((ruleOption, idx) => this.addRule(`Rule${idx}`, ruleOption));
    }
  }

  /**
   * Creates an AwsCustomResource to set this receipt rule set as active.
   * The custom resource calls SetActiveReceiptRuleSet API on create/update
   * and deactivates the rule set on delete.
   */
  private createActiveRuleSetCustomResource(ruleSetResource: CfnReceiptRuleSet): void {
    const setActiveCall = {
      service: 'SES',
      action: 'setActiveReceiptRuleSet',
      parameters: {
        RuleSetName: this.receiptRuleSetName,
      },
      physicalResourceId: PhysicalResourceId.of(`${this.receiptRuleSetName}-SetActive`),
    };

    const customResource = new AwsCustomResource(this, 'SetActive', {
      onCreate: setActiveCall,
      onUpdate: setActiveCall,
      onDelete: {
        service: 'SES',
        action: 'setActiveReceiptRuleSet',
        // Empty parameters to deactivate (no RuleSetName means deactivate)
        parameters: {},
        physicalResourceId: PhysicalResourceId.of(`${this.receiptRuleSetName}-SetActive`),
      },
      policy: AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['ses:SetActiveReceiptRuleSet'],
          // Resource must be '*' because SetActiveReceiptRuleSet is an account-level
          // operation that doesn't support resource-level permissions
          resources: ['*'],
        }),
      ]),
      installLatestAwsSdk: false,
    });

    // Ensure the rule set is created before we try to activate it
    customResource.node.addDependency(ruleSetResource);
  }
}
