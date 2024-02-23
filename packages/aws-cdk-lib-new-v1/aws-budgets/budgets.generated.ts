/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Budgets::Budget` resource allows customers to take pre-defined actions that will trigger once a budget threshold has been exceeded.
 *
 * creates, replaces, or deletes budgets for Billing and Cost Management. For more information, see [Managing Your Costs with Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html) in the *AWS Billing and Cost Management User Guide* .
 *
 * @cloudformationResource AWS::Budgets::Budget
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html
 */
export class CfnBudget extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Budgets::Budget";

  /**
   * Build a CfnBudget from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBudget {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBudgetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBudget(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The budget object that you want to create.
   */
  public budget: CfnBudget.BudgetDataProperty | cdk.IResolvable;

  /**
   * A notification that you want to associate with a budget.
   */
  public notificationsWithSubscribers?: Array<cdk.IResolvable | CfnBudget.NotificationWithSubscribersProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBudgetProps) {
    super(scope, id, {
      "type": CfnBudget.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "budget", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.budget = props.budget;
    this.notificationsWithSubscribers = props.notificationsWithSubscribers;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "budget": this.budget,
      "notificationsWithSubscribers": this.notificationsWithSubscribers
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBudget.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBudgetPropsToCloudFormation(props);
  }
}

export namespace CfnBudget {
  /**
   * A notification with subscribers.
   *
   * A notification can have one SNS subscriber and up to 10 email subscribers, for a total of 11 subscribers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html
   */
  export interface NotificationWithSubscribersProperty {
    /**
     * The notification that's associated with a budget.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html#cfn-budgets-budget-notificationwithsubscribers-notification
     */
    readonly notification: cdk.IResolvable | CfnBudget.NotificationProperty;

    /**
     * A list of subscribers who are subscribed to this notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html#cfn-budgets-budget-notificationwithsubscribers-subscribers
     */
    readonly subscribers: Array<cdk.IResolvable | CfnBudget.SubscriberProperty> | cdk.IResolvable;
  }

  /**
   * The `Subscriber` property type specifies who to notify for a Billing and Cost Management budget notification.
   *
   * The subscriber consists of a subscription type, and either an Amazon SNS topic or an email address.
   *
   * For example, an email subscriber would have the following parameters:
   *
   * - A `subscriptionType` of `EMAIL`
   * - An `address` of `example@example.com`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html
   */
  export interface SubscriberProperty {
    /**
     * The address that AWS sends budget notifications to, either an SNS topic or an email.
     *
     * When you create a subscriber, the value of `Address` can't contain line breaks.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html#cfn-budgets-budget-subscriber-address
     */
    readonly address: string;

    /**
     * The type of notification that AWS sends to a subscriber.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html#cfn-budgets-budget-subscriber-subscriptiontype
     */
    readonly subscriptionType: string;
  }

  /**
   * A notification that's associated with a budget. A budget can have up to ten notifications.
   *
   * Each notification must have at least one subscriber. A notification can have one SNS subscriber and up to 10 email subscribers, for a total of 11 subscribers.
   *
   * For example, if you have a budget for 200 dollars and you want to be notified when you go over 160 dollars, create a notification with the following parameters:
   *
   * - A notificationType of `ACTUAL`
   * - A `thresholdType` of `PERCENTAGE`
   * - A `comparisonOperator` of `GREATER_THAN`
   * - A notification `threshold` of `80`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html
   */
  export interface NotificationProperty {
    /**
     * The comparison that's used for this notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * Specifies whether the notification is for how much you have spent ( `ACTUAL` ) or for how much that you're forecasted to spend ( `FORECASTED` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-notificationtype
     */
    readonly notificationType: string;

    /**
     * The threshold that's associated with a notification.
     *
     * Thresholds are always a percentage, and many customers find value being alerted between 50% - 200% of the budgeted amount. The maximum limit for your threshold is 1,000,000% above the budgeted amount.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-threshold
     */
    readonly threshold: number;

    /**
     * The type of threshold for a notification.
     *
     * For `ABSOLUTE_VALUE` thresholds, AWS notifies you when you go over or are forecasted to go over your total cost threshold. For `PERCENTAGE` thresholds, AWS notifies you when you go over or are forecasted to go over a certain percentage of your forecasted spend. For example, if you have a budget for 200 dollars and you have a `PERCENTAGE` threshold of 80%, AWS notifies you when you go over 160 dollars.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-thresholdtype
     */
    readonly thresholdType?: string;
  }

  /**
   * Represents the output of the `CreateBudget` operation.
   *
   * The content consists of the detailed metadata and data file information, and the current status of the `budget` object.
   *
   * This is the Amazon Resource Name (ARN) pattern for a budget:
   *
   * `arn:aws:budgets::AccountId:budget/budgetName`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html
   */
  export interface BudgetDataProperty {
    /**
     * Determine the budget amount for an auto-adjusting budget.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-autoadjustdata
     */
    readonly autoAdjustData?: CfnBudget.AutoAdjustDataProperty | cdk.IResolvable;

    /**
     * The total amount of cost, usage, RI utilization, RI coverage, Savings Plans utilization, or Savings Plans coverage that you want to track with your budget.
     *
     * `BudgetLimit` is required for cost or usage budgets, but optional for RI or Savings Plans utilization or coverage budgets. RI and Savings Plans utilization or coverage budgets default to `100` . This is the only valid value for RI or Savings Plans utilization or coverage budgets. You can't use `BudgetLimit` with `PlannedBudgetLimits` for `CreateBudget` and `UpdateBudget` actions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgetlimit
     */
    readonly budgetLimit?: cdk.IResolvable | CfnBudget.SpendProperty;

    /**
     * The name of a budget.
     *
     * The value must be unique within an account. `BudgetName` can't include `:` and `\` characters. If you don't include value for `BudgetName` in the template, Billing and Cost Management assigns your budget a randomly generated name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgetname
     */
    readonly budgetName?: string;

    /**
     * Specifies whether this budget tracks costs, usage, RI utilization, RI coverage, Savings Plans utilization, or Savings Plans coverage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgettype
     */
    readonly budgetType: string;

    /**
     * The cost filters, such as `Region` , `Service` , `LinkedAccount` , `Tag` , or `CostCategory` , that are applied to a budget.
     *
     * AWS Budgets supports the following services as a `Service` filter for RI budgets:
     *
     * - Amazon EC2
     * - Amazon Redshift
     * - Amazon Relational Database Service
     * - Amazon ElastiCache
     * - Amazon OpenSearch Service
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-costfilters
     */
    readonly costFilters?: any | cdk.IResolvable;

    /**
     * The types of costs that are included in this `COST` budget.
     *
     * `USAGE` , `RI_UTILIZATION` , `RI_COVERAGE` , `SAVINGS_PLANS_UTILIZATION` , and `SAVINGS_PLANS_COVERAGE` budgets do not have `CostTypes` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-costtypes
     */
    readonly costTypes?: CfnBudget.CostTypesProperty | cdk.IResolvable;

    /**
     * A map containing multiple `BudgetLimit` , including current or future limits.
     *
     * `PlannedBudgetLimits` is available for cost or usage budget and supports both monthly and quarterly `TimeUnit` .
     *
     * For monthly budgets, provide 12 months of `PlannedBudgetLimits` values. This must start from the current month and include the next 11 months. The `key` is the start of the month, `UTC` in epoch seconds.
     *
     * For quarterly budgets, provide four quarters of `PlannedBudgetLimits` value entries in standard calendar quarter increments. This must start from the current quarter and include the next three quarters. The `key` is the start of the quarter, `UTC` in epoch seconds.
     *
     * If the planned budget expires before 12 months for monthly or four quarters for quarterly, provide the `PlannedBudgetLimits` values only for the remaining periods.
     *
     * If the budget begins at a date in the future, provide `PlannedBudgetLimits` values from the start date of the budget.
     *
     * After all of the `BudgetLimit` values in `PlannedBudgetLimits` are used, the budget continues to use the last limit as the `BudgetLimit` . At that point, the planned budget provides the same experience as a fixed budget.
     *
     * `DescribeBudget` and `DescribeBudgets` response along with `PlannedBudgetLimits` also contain `BudgetLimit` representing the current month or quarter limit present in `PlannedBudgetLimits` . This only applies to budgets that are created with `PlannedBudgetLimits` . Budgets that are created without `PlannedBudgetLimits` only contain `BudgetLimit` . They don't contain `PlannedBudgetLimits` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-plannedbudgetlimits
     */
    readonly plannedBudgetLimits?: any | cdk.IResolvable;

    /**
     * The period of time that is covered by a budget.
     *
     * The period has a start date and an end date. The start date must come before the end date. There are no restrictions on the end date.
     *
     * The start date for a budget. If you created your budget and didn't specify a start date, the start date defaults to the start of the chosen time period (MONTHLY, QUARTERLY, or ANNUALLY). For example, if you create your budget on January 24, 2019, choose `MONTHLY` , and don't set a start date, the start date defaults to `01/01/19 00:00 UTC` . The defaults are the same for the AWS Billing and Cost Management console and the API.
     *
     * You can change your start date with the `UpdateBudget` operation.
     *
     * After the end date, AWS deletes the budget and all associated notifications and subscribers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-timeperiod
     */
    readonly timePeriod?: cdk.IResolvable | CfnBudget.TimePeriodProperty;

    /**
     * The length of time until a budget resets the actual and forecasted spend.
     *
     * `DAILY` is available only for `RI_UTILIZATION` and `RI_COVERAGE` budgets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-timeunit
     */
    readonly timeUnit: string;
  }

  /**
   * The amount of cost or usage that's measured for a budget.
   *
   * *Cost example:* A `Spend` for `3 USD` of costs has the following parameters:
   *
   * - An `Amount` of `3`
   * - A `Unit` of `USD`
   *
   * *Usage example:* A `Spend` for `3 GB` of S3 usage has the following parameters:
   *
   * - An `Amount` of `3`
   * - A `Unit` of `GB`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-spend.html
   */
  export interface SpendProperty {
    /**
     * The cost or usage amount that's associated with a budget forecast, actual spend, or budget threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-spend.html#cfn-budgets-budget-spend-amount
     */
    readonly amount: number;

    /**
     * The unit of measurement that's used for the budget forecast, actual spend, or budget threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-spend.html#cfn-budgets-budget-spend-unit
     */
    readonly unit: string;
  }

  /**
   * The period of time that is covered by a budget.
   *
   * The period has a start date and an end date. The start date must come before the end date. There are no restrictions on the end date.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html
   */
  export interface TimePeriodProperty {
    /**
     * The end date for a budget.
     *
     * If you didn't specify an end date, AWS set your end date to `06/15/87 00:00 UTC` . The defaults are the same for the AWS Billing and Cost Management console and the API.
     *
     * After the end date, AWS deletes the budget and all the associated notifications and subscribers. You can change your end date with the `UpdateBudget` operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-end
     */
    readonly end?: string;

    /**
     * The start date for a budget.
     *
     * If you created your budget and didn't specify a start date, the start date defaults to the start of the chosen time period (MONTHLY, QUARTERLY, or ANNUALLY). For example, if you create your budget on January 24, 2019, choose `MONTHLY` , and don't set a start date, the start date defaults to `01/01/19 00:00 UTC` . The defaults are the same for the AWS Billing and Cost Management console and the API.
     *
     * You can change your start date with the `UpdateBudget` operation.
     *
     * Valid values depend on the value of `BudgetType` :
     *
     * - If `BudgetType` is `COST` or `USAGE` : Valid values are `MONTHLY` , `QUARTERLY` , and `ANNUALLY` .
     * - If `BudgetType` is `RI_UTILIZATION` or `RI_COVERAGE` : Valid values are `DAILY` , `MONTHLY` , `QUARTERLY` , and `ANNUALLY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-start
     */
    readonly start?: string;
  }

  /**
   * Determine the budget amount for an auto-adjusting budget.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-autoadjustdata.html
   */
  export interface AutoAdjustDataProperty {
    /**
     * The string that defines whether your budget auto-adjusts based on historical or forecasted data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-autoadjustdata.html#cfn-budgets-budget-autoadjustdata-autoadjusttype
     */
    readonly autoAdjustType: string;

    /**
     * The parameters that define or describe the historical data that your auto-adjusting budget is based on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-autoadjustdata.html#cfn-budgets-budget-autoadjustdata-historicaloptions
     */
    readonly historicalOptions?: CfnBudget.HistoricalOptionsProperty | cdk.IResolvable;
  }

  /**
   * The parameters that define or describe the historical data that your auto-adjusting budget is based on.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-historicaloptions.html
   */
  export interface HistoricalOptionsProperty {
    /**
     * The number of budget periods included in the moving-average calculation that determines your auto-adjusted budget amount.
     *
     * The maximum value depends on the `TimeUnit` granularity of the budget:
     *
     * - For the `DAILY` granularity, the maximum value is `60` .
     * - For the `MONTHLY` granularity, the maximum value is `12` .
     * - For the `QUARTERLY` granularity, the maximum value is `4` .
     * - For the `ANNUALLY` granularity, the maximum value is `1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-historicaloptions.html#cfn-budgets-budget-historicaloptions-budgetadjustmentperiod
     */
    readonly budgetAdjustmentPeriod: number;
  }

  /**
   * The types of cost that are included in a `COST` budget, such as tax and subscriptions.
   *
   * `USAGE` , `RI_UTILIZATION` , `RI_COVERAGE` , `SAVINGS_PLANS_UTILIZATION` , and `SAVINGS_PLANS_COVERAGE` budgets don't have `CostTypes` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html
   */
  export interface CostTypesProperty {
    /**
     * Specifies whether a budget includes credits.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includecredit
     */
    readonly includeCredit?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes discounts.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includediscount
     */
    readonly includeDiscount?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes non-RI subscription costs.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includeothersubscription
     */
    readonly includeOtherSubscription?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes recurring fees such as monthly RI fees.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includerecurring
     */
    readonly includeRecurring?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes refunds.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includerefund
     */
    readonly includeRefund?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes subscriptions.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includesubscription
     */
    readonly includeSubscription?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes support subscription fees.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includesupport
     */
    readonly includeSupport?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes taxes.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includetax
     */
    readonly includeTax?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget includes upfront RI costs.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includeupfront
     */
    readonly includeUpfront?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget uses the amortized rate.
     *
     * The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-useamortized
     */
    readonly useAmortized?: boolean | cdk.IResolvable;

    /**
     * Specifies whether a budget uses a blended rate.
     *
     * The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-useblended
     */
    readonly useBlended?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnBudget`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html
 */
export interface CfnBudgetProps {
  /**
   * The budget object that you want to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-budget
   */
  readonly budget: CfnBudget.BudgetDataProperty | cdk.IResolvable;

  /**
   * A notification that you want to associate with a budget.
   *
   * A budget can have up to five notifications, and each notification can have one SNS subscriber and up to 10 email subscribers. If you include notifications and subscribers in your `CreateBudget` call, AWS creates the notifications and subscribers for you.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-notificationswithsubscribers
   */
  readonly notificationsWithSubscribers?: Array<cdk.IResolvable | CfnBudget.NotificationWithSubscribersProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SubscriberProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetSubscriberPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.requiredValidator)(properties.address));
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("subscriptionType", cdk.requiredValidator)(properties.subscriptionType));
  errors.collect(cdk.propertyValidator("subscriptionType", cdk.validateString)(properties.subscriptionType));
  return errors.wrap("supplied properties not correct for \"SubscriberProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetSubscriberPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetSubscriberPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "SubscriptionType": cdk.stringToCloudFormation(properties.subscriptionType)
  };
}

// @ts-ignore TS6133
function CfnBudgetSubscriberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudget.SubscriberProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.SubscriberProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("subscriptionType", "SubscriptionType", (properties.SubscriptionType != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetNotificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("notificationType", cdk.requiredValidator)(properties.notificationType));
  errors.collect(cdk.propertyValidator("notificationType", cdk.validateString)(properties.notificationType));
  errors.collect(cdk.propertyValidator("threshold", cdk.requiredValidator)(properties.threshold));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  errors.collect(cdk.propertyValidator("thresholdType", cdk.validateString)(properties.thresholdType));
  return errors.wrap("supplied properties not correct for \"NotificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetNotificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetNotificationPropertyValidator(properties).assertSuccess();
  return {
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "NotificationType": cdk.stringToCloudFormation(properties.notificationType),
    "Threshold": cdk.numberToCloudFormation(properties.threshold),
    "ThresholdType": cdk.stringToCloudFormation(properties.thresholdType)
  };
}

// @ts-ignore TS6133
function CfnBudgetNotificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudget.NotificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.NotificationProperty>();
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("notificationType", "NotificationType", (properties.NotificationType != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationType) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addPropertyResult("thresholdType", "ThresholdType", (properties.ThresholdType != null ? cfn_parse.FromCloudFormation.getString(properties.ThresholdType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationWithSubscribersProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationWithSubscribersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetNotificationWithSubscribersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("notification", cdk.requiredValidator)(properties.notification));
  errors.collect(cdk.propertyValidator("notification", CfnBudgetNotificationPropertyValidator)(properties.notification));
  errors.collect(cdk.propertyValidator("subscribers", cdk.requiredValidator)(properties.subscribers));
  errors.collect(cdk.propertyValidator("subscribers", cdk.listValidator(CfnBudgetSubscriberPropertyValidator))(properties.subscribers));
  return errors.wrap("supplied properties not correct for \"NotificationWithSubscribersProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetNotificationWithSubscribersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetNotificationWithSubscribersPropertyValidator(properties).assertSuccess();
  return {
    "Notification": convertCfnBudgetNotificationPropertyToCloudFormation(properties.notification),
    "Subscribers": cdk.listMapper(convertCfnBudgetSubscriberPropertyToCloudFormation)(properties.subscribers)
  };
}

// @ts-ignore TS6133
function CfnBudgetNotificationWithSubscribersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudget.NotificationWithSubscribersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.NotificationWithSubscribersProperty>();
  ret.addPropertyResult("notification", "Notification", (properties.Notification != null ? CfnBudgetNotificationPropertyFromCloudFormation(properties.Notification) : undefined));
  ret.addPropertyResult("subscribers", "Subscribers", (properties.Subscribers != null ? cfn_parse.FromCloudFormation.getArray(CfnBudgetSubscriberPropertyFromCloudFormation)(properties.Subscribers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SpendProperty`
 *
 * @param properties - the TypeScript properties of a `SpendProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetSpendPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amount", cdk.requiredValidator)(properties.amount));
  errors.collect(cdk.propertyValidator("amount", cdk.validateNumber)(properties.amount));
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  return errors.wrap("supplied properties not correct for \"SpendProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetSpendPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetSpendPropertyValidator(properties).assertSuccess();
  return {
    "Amount": cdk.numberToCloudFormation(properties.amount),
    "Unit": cdk.stringToCloudFormation(properties.unit)
  };
}

// @ts-ignore TS6133
function CfnBudgetSpendPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudget.SpendProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.SpendProperty>();
  ret.addPropertyResult("amount", "Amount", (properties.Amount != null ? cfn_parse.FromCloudFormation.getNumber(properties.Amount) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimePeriodProperty`
 *
 * @param properties - the TypeScript properties of a `TimePeriodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetTimePeriodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("end", cdk.validateString)(properties.end));
  errors.collect(cdk.propertyValidator("start", cdk.validateString)(properties.start));
  return errors.wrap("supplied properties not correct for \"TimePeriodProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetTimePeriodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetTimePeriodPropertyValidator(properties).assertSuccess();
  return {
    "End": cdk.stringToCloudFormation(properties.end),
    "Start": cdk.stringToCloudFormation(properties.start)
  };
}

// @ts-ignore TS6133
function CfnBudgetTimePeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudget.TimePeriodProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.TimePeriodProperty>();
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getString(properties.End) : undefined));
  ret.addPropertyResult("start", "Start", (properties.Start != null ? cfn_parse.FromCloudFormation.getString(properties.Start) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HistoricalOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `HistoricalOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetHistoricalOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("budgetAdjustmentPeriod", cdk.requiredValidator)(properties.budgetAdjustmentPeriod));
  errors.collect(cdk.propertyValidator("budgetAdjustmentPeriod", cdk.validateNumber)(properties.budgetAdjustmentPeriod));
  return errors.wrap("supplied properties not correct for \"HistoricalOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetHistoricalOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetHistoricalOptionsPropertyValidator(properties).assertSuccess();
  return {
    "BudgetAdjustmentPeriod": cdk.numberToCloudFormation(properties.budgetAdjustmentPeriod)
  };
}

// @ts-ignore TS6133
function CfnBudgetHistoricalOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.HistoricalOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.HistoricalOptionsProperty>();
  ret.addPropertyResult("budgetAdjustmentPeriod", "BudgetAdjustmentPeriod", (properties.BudgetAdjustmentPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.BudgetAdjustmentPeriod) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoAdjustDataProperty`
 *
 * @param properties - the TypeScript properties of a `AutoAdjustDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetAutoAdjustDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoAdjustType", cdk.requiredValidator)(properties.autoAdjustType));
  errors.collect(cdk.propertyValidator("autoAdjustType", cdk.validateString)(properties.autoAdjustType));
  errors.collect(cdk.propertyValidator("historicalOptions", CfnBudgetHistoricalOptionsPropertyValidator)(properties.historicalOptions));
  return errors.wrap("supplied properties not correct for \"AutoAdjustDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetAutoAdjustDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetAutoAdjustDataPropertyValidator(properties).assertSuccess();
  return {
    "AutoAdjustType": cdk.stringToCloudFormation(properties.autoAdjustType),
    "HistoricalOptions": convertCfnBudgetHistoricalOptionsPropertyToCloudFormation(properties.historicalOptions)
  };
}

// @ts-ignore TS6133
function CfnBudgetAutoAdjustDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.AutoAdjustDataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.AutoAdjustDataProperty>();
  ret.addPropertyResult("autoAdjustType", "AutoAdjustType", (properties.AutoAdjustType != null ? cfn_parse.FromCloudFormation.getString(properties.AutoAdjustType) : undefined));
  ret.addPropertyResult("historicalOptions", "HistoricalOptions", (properties.HistoricalOptions != null ? CfnBudgetHistoricalOptionsPropertyFromCloudFormation(properties.HistoricalOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CostTypesProperty`
 *
 * @param properties - the TypeScript properties of a `CostTypesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetCostTypesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("includeCredit", cdk.validateBoolean)(properties.includeCredit));
  errors.collect(cdk.propertyValidator("includeDiscount", cdk.validateBoolean)(properties.includeDiscount));
  errors.collect(cdk.propertyValidator("includeOtherSubscription", cdk.validateBoolean)(properties.includeOtherSubscription));
  errors.collect(cdk.propertyValidator("includeRecurring", cdk.validateBoolean)(properties.includeRecurring));
  errors.collect(cdk.propertyValidator("includeRefund", cdk.validateBoolean)(properties.includeRefund));
  errors.collect(cdk.propertyValidator("includeSubscription", cdk.validateBoolean)(properties.includeSubscription));
  errors.collect(cdk.propertyValidator("includeSupport", cdk.validateBoolean)(properties.includeSupport));
  errors.collect(cdk.propertyValidator("includeTax", cdk.validateBoolean)(properties.includeTax));
  errors.collect(cdk.propertyValidator("includeUpfront", cdk.validateBoolean)(properties.includeUpfront));
  errors.collect(cdk.propertyValidator("useAmortized", cdk.validateBoolean)(properties.useAmortized));
  errors.collect(cdk.propertyValidator("useBlended", cdk.validateBoolean)(properties.useBlended));
  return errors.wrap("supplied properties not correct for \"CostTypesProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetCostTypesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetCostTypesPropertyValidator(properties).assertSuccess();
  return {
    "IncludeCredit": cdk.booleanToCloudFormation(properties.includeCredit),
    "IncludeDiscount": cdk.booleanToCloudFormation(properties.includeDiscount),
    "IncludeOtherSubscription": cdk.booleanToCloudFormation(properties.includeOtherSubscription),
    "IncludeRecurring": cdk.booleanToCloudFormation(properties.includeRecurring),
    "IncludeRefund": cdk.booleanToCloudFormation(properties.includeRefund),
    "IncludeSubscription": cdk.booleanToCloudFormation(properties.includeSubscription),
    "IncludeSupport": cdk.booleanToCloudFormation(properties.includeSupport),
    "IncludeTax": cdk.booleanToCloudFormation(properties.includeTax),
    "IncludeUpfront": cdk.booleanToCloudFormation(properties.includeUpfront),
    "UseAmortized": cdk.booleanToCloudFormation(properties.useAmortized),
    "UseBlended": cdk.booleanToCloudFormation(properties.useBlended)
  };
}

// @ts-ignore TS6133
function CfnBudgetCostTypesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.CostTypesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.CostTypesProperty>();
  ret.addPropertyResult("includeCredit", "IncludeCredit", (properties.IncludeCredit != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeCredit) : undefined));
  ret.addPropertyResult("includeDiscount", "IncludeDiscount", (properties.IncludeDiscount != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDiscount) : undefined));
  ret.addPropertyResult("includeOtherSubscription", "IncludeOtherSubscription", (properties.IncludeOtherSubscription != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeOtherSubscription) : undefined));
  ret.addPropertyResult("includeRecurring", "IncludeRecurring", (properties.IncludeRecurring != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeRecurring) : undefined));
  ret.addPropertyResult("includeRefund", "IncludeRefund", (properties.IncludeRefund != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeRefund) : undefined));
  ret.addPropertyResult("includeSubscription", "IncludeSubscription", (properties.IncludeSubscription != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSubscription) : undefined));
  ret.addPropertyResult("includeSupport", "IncludeSupport", (properties.IncludeSupport != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSupport) : undefined));
  ret.addPropertyResult("includeTax", "IncludeTax", (properties.IncludeTax != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeTax) : undefined));
  ret.addPropertyResult("includeUpfront", "IncludeUpfront", (properties.IncludeUpfront != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeUpfront) : undefined));
  ret.addPropertyResult("useAmortized", "UseAmortized", (properties.UseAmortized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAmortized) : undefined));
  ret.addPropertyResult("useBlended", "UseBlended", (properties.UseBlended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseBlended) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BudgetDataProperty`
 *
 * @param properties - the TypeScript properties of a `BudgetDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetBudgetDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoAdjustData", CfnBudgetAutoAdjustDataPropertyValidator)(properties.autoAdjustData));
  errors.collect(cdk.propertyValidator("budgetLimit", CfnBudgetSpendPropertyValidator)(properties.budgetLimit));
  errors.collect(cdk.propertyValidator("budgetName", cdk.validateString)(properties.budgetName));
  errors.collect(cdk.propertyValidator("budgetType", cdk.requiredValidator)(properties.budgetType));
  errors.collect(cdk.propertyValidator("budgetType", cdk.validateString)(properties.budgetType));
  errors.collect(cdk.propertyValidator("costFilters", cdk.validateObject)(properties.costFilters));
  errors.collect(cdk.propertyValidator("costTypes", CfnBudgetCostTypesPropertyValidator)(properties.costTypes));
  errors.collect(cdk.propertyValidator("plannedBudgetLimits", cdk.validateObject)(properties.plannedBudgetLimits));
  errors.collect(cdk.propertyValidator("timePeriod", CfnBudgetTimePeriodPropertyValidator)(properties.timePeriod));
  errors.collect(cdk.propertyValidator("timeUnit", cdk.requiredValidator)(properties.timeUnit));
  errors.collect(cdk.propertyValidator("timeUnit", cdk.validateString)(properties.timeUnit));
  return errors.wrap("supplied properties not correct for \"BudgetDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetBudgetDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetBudgetDataPropertyValidator(properties).assertSuccess();
  return {
    "AutoAdjustData": convertCfnBudgetAutoAdjustDataPropertyToCloudFormation(properties.autoAdjustData),
    "BudgetLimit": convertCfnBudgetSpendPropertyToCloudFormation(properties.budgetLimit),
    "BudgetName": cdk.stringToCloudFormation(properties.budgetName),
    "BudgetType": cdk.stringToCloudFormation(properties.budgetType),
    "CostFilters": cdk.objectToCloudFormation(properties.costFilters),
    "CostTypes": convertCfnBudgetCostTypesPropertyToCloudFormation(properties.costTypes),
    "PlannedBudgetLimits": cdk.objectToCloudFormation(properties.plannedBudgetLimits),
    "TimePeriod": convertCfnBudgetTimePeriodPropertyToCloudFormation(properties.timePeriod),
    "TimeUnit": cdk.stringToCloudFormation(properties.timeUnit)
  };
}

// @ts-ignore TS6133
function CfnBudgetBudgetDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.BudgetDataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.BudgetDataProperty>();
  ret.addPropertyResult("autoAdjustData", "AutoAdjustData", (properties.AutoAdjustData != null ? CfnBudgetAutoAdjustDataPropertyFromCloudFormation(properties.AutoAdjustData) : undefined));
  ret.addPropertyResult("budgetLimit", "BudgetLimit", (properties.BudgetLimit != null ? CfnBudgetSpendPropertyFromCloudFormation(properties.BudgetLimit) : undefined));
  ret.addPropertyResult("budgetName", "BudgetName", (properties.BudgetName != null ? cfn_parse.FromCloudFormation.getString(properties.BudgetName) : undefined));
  ret.addPropertyResult("budgetType", "BudgetType", (properties.BudgetType != null ? cfn_parse.FromCloudFormation.getString(properties.BudgetType) : undefined));
  ret.addPropertyResult("costFilters", "CostFilters", (properties.CostFilters != null ? cfn_parse.FromCloudFormation.getAny(properties.CostFilters) : undefined));
  ret.addPropertyResult("costTypes", "CostTypes", (properties.CostTypes != null ? CfnBudgetCostTypesPropertyFromCloudFormation(properties.CostTypes) : undefined));
  ret.addPropertyResult("plannedBudgetLimits", "PlannedBudgetLimits", (properties.PlannedBudgetLimits != null ? cfn_parse.FromCloudFormation.getAny(properties.PlannedBudgetLimits) : undefined));
  ret.addPropertyResult("timePeriod", "TimePeriod", (properties.TimePeriod != null ? CfnBudgetTimePeriodPropertyFromCloudFormation(properties.TimePeriod) : undefined));
  ret.addPropertyResult("timeUnit", "TimeUnit", (properties.TimeUnit != null ? cfn_parse.FromCloudFormation.getString(properties.TimeUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBudgetProps`
 *
 * @param properties - the TypeScript properties of a `CfnBudgetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("budget", cdk.requiredValidator)(properties.budget));
  errors.collect(cdk.propertyValidator("budget", CfnBudgetBudgetDataPropertyValidator)(properties.budget));
  errors.collect(cdk.propertyValidator("notificationsWithSubscribers", cdk.listValidator(CfnBudgetNotificationWithSubscribersPropertyValidator))(properties.notificationsWithSubscribers));
  return errors.wrap("supplied properties not correct for \"CfnBudgetProps\"");
}

// @ts-ignore TS6133
function convertCfnBudgetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetPropsValidator(properties).assertSuccess();
  return {
    "Budget": convertCfnBudgetBudgetDataPropertyToCloudFormation(properties.budget),
    "NotificationsWithSubscribers": cdk.listMapper(convertCfnBudgetNotificationWithSubscribersPropertyToCloudFormation)(properties.notificationsWithSubscribers)
  };
}

// @ts-ignore TS6133
function CfnBudgetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetProps>();
  ret.addPropertyResult("budget", "Budget", (properties.Budget != null ? CfnBudgetBudgetDataPropertyFromCloudFormation(properties.Budget) : undefined));
  ret.addPropertyResult("notificationsWithSubscribers", "NotificationsWithSubscribers", (properties.NotificationsWithSubscribers != null ? cfn_parse.FromCloudFormation.getArray(CfnBudgetNotificationWithSubscribersPropertyFromCloudFormation)(properties.NotificationsWithSubscribers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Budgets::BudgetsAction` resource enables you to take predefined actions that are initiated when a budget threshold has been exceeded.
 *
 * For more information, see [Managing Your Costs with Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html) in the *AWS Billing and Cost Management User Guide* .
 *
 * @cloudformationResource AWS::Budgets::BudgetsAction
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html
 */
export class CfnBudgetsAction extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Budgets::BudgetsAction";

  /**
   * Build a CfnBudgetsAction from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBudgetsAction {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBudgetsActionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBudgetsAction(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A system-generated universally unique identifier (UUID) for the action.
   *
   * @cloudformationAttribute ActionId
   */
  public readonly attrActionId: string;

  /**
   * The trigger threshold of the action.
   */
  public actionThreshold: CfnBudgetsAction.ActionThresholdProperty | cdk.IResolvable;

  /**
   * The type of action.
   */
  public actionType: string;

  /**
   * This specifies if the action needs manual or automatic approval.
   */
  public approvalModel?: string;

  /**
   * A string that represents the budget name.
   */
  public budgetName: string;

  /**
   * Specifies all of the type-specific parameters.
   */
  public definition: CfnBudgetsAction.DefinitionProperty | cdk.IResolvable;

  /**
   * The role passed for action execution and reversion.
   */
  public executionRoleArn: string;

  /**
   * The type of a notification.
   */
  public notificationType: string;

  /**
   * A list of subscribers.
   */
  public subscribers: Array<cdk.IResolvable | CfnBudgetsAction.SubscriberProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBudgetsActionProps) {
    super(scope, id, {
      "type": CfnBudgetsAction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actionThreshold", this);
    cdk.requireProperty(props, "actionType", this);
    cdk.requireProperty(props, "budgetName", this);
    cdk.requireProperty(props, "definition", this);
    cdk.requireProperty(props, "executionRoleArn", this);
    cdk.requireProperty(props, "notificationType", this);
    cdk.requireProperty(props, "subscribers", this);

    this.attrActionId = cdk.Token.asString(this.getAtt("ActionId", cdk.ResolutionTypeHint.STRING));
    this.actionThreshold = props.actionThreshold;
    this.actionType = props.actionType;
    this.approvalModel = props.approvalModel;
    this.budgetName = props.budgetName;
    this.definition = props.definition;
    this.executionRoleArn = props.executionRoleArn;
    this.notificationType = props.notificationType;
    this.subscribers = props.subscribers;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actionThreshold": this.actionThreshold,
      "actionType": this.actionType,
      "approvalModel": this.approvalModel,
      "budgetName": this.budgetName,
      "definition": this.definition,
      "executionRoleArn": this.executionRoleArn,
      "notificationType": this.notificationType,
      "subscribers": this.subscribers
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBudgetsAction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBudgetsActionPropsToCloudFormation(props);
  }
}

export namespace CfnBudgetsAction {
  /**
   * The trigger threshold of the action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-actionthreshold.html
   */
  export interface ActionThresholdProperty {
    /**
     * The type of threshold for a notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-actionthreshold.html#cfn-budgets-budgetsaction-actionthreshold-type
     */
    readonly type: string;

    /**
     * The threshold of a notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-actionthreshold.html#cfn-budgets-budgetsaction-actionthreshold-value
     */
    readonly value: number;
  }

  /**
   * The definition is where you specify all of the type-specific parameters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html
   */
  export interface DefinitionProperty {
    /**
     * The AWS Identity and Access Management ( IAM ) action definition details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html#cfn-budgets-budgetsaction-definition-iamactiondefinition
     */
    readonly iamActionDefinition?: CfnBudgetsAction.IamActionDefinitionProperty | cdk.IResolvable;

    /**
     * The service control policies (SCP) action definition details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html#cfn-budgets-budgetsaction-definition-scpactiondefinition
     */
    readonly scpActionDefinition?: cdk.IResolvable | CfnBudgetsAction.ScpActionDefinitionProperty;

    /**
     * The Amazon EC2 Systems Manager ( SSM ) action definition details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html#cfn-budgets-budgetsaction-definition-ssmactiondefinition
     */
    readonly ssmActionDefinition?: cdk.IResolvable | CfnBudgetsAction.SsmActionDefinitionProperty;
  }

  /**
   * The Amazon EC2 Systems Manager ( SSM ) action definition details.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html
   */
  export interface SsmActionDefinitionProperty {
    /**
     * The EC2 and RDS instance IDs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html#cfn-budgets-budgetsaction-ssmactiondefinition-instanceids
     */
    readonly instanceIds: Array<string>;

    /**
     * The Region to run the ( SSM ) document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html#cfn-budgets-budgetsaction-ssmactiondefinition-region
     */
    readonly region: string;

    /**
     * The action subType.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html#cfn-budgets-budgetsaction-ssmactiondefinition-subtype
     */
    readonly subtype: string;
  }

  /**
   * The AWS Identity and Access Management ( IAM ) action definition details.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html
   */
  export interface IamActionDefinitionProperty {
    /**
     * A list of groups to be attached.
     *
     * There must be at least one group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-groups
     */
    readonly groups?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of the policy to be attached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-policyarn
     */
    readonly policyArn: string;

    /**
     * A list of roles to be attached.
     *
     * There must be at least one role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-roles
     */
    readonly roles?: Array<string>;

    /**
     * A list of users to be attached.
     *
     * There must be at least one user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-users
     */
    readonly users?: Array<string>;
  }

  /**
   * The service control policies (SCP) action definition details.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-scpactiondefinition.html
   */
  export interface ScpActionDefinitionProperty {
    /**
     * The policy ID attached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-scpactiondefinition.html#cfn-budgets-budgetsaction-scpactiondefinition-policyid
     */
    readonly policyId: string;

    /**
     * A list of target IDs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-scpactiondefinition.html#cfn-budgets-budgetsaction-scpactiondefinition-targetids
     */
    readonly targetIds: Array<string>;
  }

  /**
   * The subscriber to a budget notification.
   *
   * The subscriber consists of a subscription type and either an Amazon SNS topic or an email address.
   *
   * For example, an email subscriber has the following parameters:
   *
   * - A `subscriptionType` of `EMAIL`
   * - An `address` of `example@example.com`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-subscriber.html
   */
  export interface SubscriberProperty {
    /**
     * The address that AWS sends budget notifications to, either an SNS topic or an email.
     *
     * When you create a subscriber, the value of `Address` can't contain line breaks.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-subscriber.html#cfn-budgets-budgetsaction-subscriber-address
     */
    readonly address: string;

    /**
     * The type of notification that AWS sends to a subscriber.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-subscriber.html#cfn-budgets-budgetsaction-subscriber-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnBudgetsAction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html
 */
export interface CfnBudgetsActionProps {
  /**
   * The trigger threshold of the action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-actionthreshold
   */
  readonly actionThreshold: CfnBudgetsAction.ActionThresholdProperty | cdk.IResolvable;

  /**
   * The type of action.
   *
   * This defines the type of tasks that can be carried out by this action. This field also determines the format for definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-actiontype
   */
  readonly actionType: string;

  /**
   * This specifies if the action needs manual or automatic approval.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-approvalmodel
   */
  readonly approvalModel?: string;

  /**
   * A string that represents the budget name.
   *
   * ":" and "\" characters aren't allowed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-budgetname
   */
  readonly budgetName: string;

  /**
   * Specifies all of the type-specific parameters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-definition
   */
  readonly definition: CfnBudgetsAction.DefinitionProperty | cdk.IResolvable;

  /**
   * The role passed for action execution and reversion.
   *
   * Roles and actions must be in the same account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-executionrolearn
   */
  readonly executionRoleArn: string;

  /**
   * The type of a notification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-notificationtype
   */
  readonly notificationType: string;

  /**
   * A list of subscribers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-subscribers
   */
  readonly subscribers: Array<cdk.IResolvable | CfnBudgetsAction.SubscriberProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ActionThresholdProperty`
 *
 * @param properties - the TypeScript properties of a `ActionThresholdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetsActionActionThresholdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"ActionThresholdProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetsActionActionThresholdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetsActionActionThresholdPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBudgetsActionActionThresholdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.ActionThresholdProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.ActionThresholdProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SsmActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `SsmActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetsActionSsmActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceIds", cdk.requiredValidator)(properties.instanceIds));
  errors.collect(cdk.propertyValidator("instanceIds", cdk.listValidator(cdk.validateString))(properties.instanceIds));
  errors.collect(cdk.propertyValidator("region", cdk.requiredValidator)(properties.region));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("subtype", cdk.requiredValidator)(properties.subtype));
  errors.collect(cdk.propertyValidator("subtype", cdk.validateString)(properties.subtype));
  return errors.wrap("supplied properties not correct for \"SsmActionDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetsActionSsmActionDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetsActionSsmActionDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "InstanceIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceIds),
    "Region": cdk.stringToCloudFormation(properties.region),
    "Subtype": cdk.stringToCloudFormation(properties.subtype)
  };
}

// @ts-ignore TS6133
function CfnBudgetsActionSsmActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudgetsAction.SsmActionDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.SsmActionDefinitionProperty>();
  ret.addPropertyResult("instanceIds", "InstanceIds", (properties.InstanceIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InstanceIds) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("subtype", "Subtype", (properties.Subtype != null ? cfn_parse.FromCloudFormation.getString(properties.Subtype) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IamActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `IamActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetsActionIamActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groups", cdk.listValidator(cdk.validateString))(properties.groups));
  errors.collect(cdk.propertyValidator("policyArn", cdk.requiredValidator)(properties.policyArn));
  errors.collect(cdk.propertyValidator("policyArn", cdk.validateString)(properties.policyArn));
  errors.collect(cdk.propertyValidator("roles", cdk.listValidator(cdk.validateString))(properties.roles));
  errors.collect(cdk.propertyValidator("users", cdk.listValidator(cdk.validateString))(properties.users));
  return errors.wrap("supplied properties not correct for \"IamActionDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetsActionIamActionDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetsActionIamActionDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Groups": cdk.listMapper(cdk.stringToCloudFormation)(properties.groups),
    "PolicyArn": cdk.stringToCloudFormation(properties.policyArn),
    "Roles": cdk.listMapper(cdk.stringToCloudFormation)(properties.roles),
    "Users": cdk.listMapper(cdk.stringToCloudFormation)(properties.users)
  };
}

// @ts-ignore TS6133
function CfnBudgetsActionIamActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.IamActionDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.IamActionDefinitionProperty>();
  ret.addPropertyResult("groups", "Groups", (properties.Groups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Groups) : undefined));
  ret.addPropertyResult("policyArn", "PolicyArn", (properties.PolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyArn) : undefined));
  ret.addPropertyResult("roles", "Roles", (properties.Roles != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Roles) : undefined));
  ret.addPropertyResult("users", "Users", (properties.Users != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Users) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScpActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `ScpActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetsActionScpActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyId", cdk.requiredValidator)(properties.policyId));
  errors.collect(cdk.propertyValidator("policyId", cdk.validateString)(properties.policyId));
  errors.collect(cdk.propertyValidator("targetIds", cdk.requiredValidator)(properties.targetIds));
  errors.collect(cdk.propertyValidator("targetIds", cdk.listValidator(cdk.validateString))(properties.targetIds));
  return errors.wrap("supplied properties not correct for \"ScpActionDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetsActionScpActionDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetsActionScpActionDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "PolicyId": cdk.stringToCloudFormation(properties.policyId),
    "TargetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetIds)
  };
}

// @ts-ignore TS6133
function CfnBudgetsActionScpActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudgetsAction.ScpActionDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.ScpActionDefinitionProperty>();
  ret.addPropertyResult("policyId", "PolicyId", (properties.PolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyId) : undefined));
  ret.addPropertyResult("targetIds", "TargetIds", (properties.TargetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetsActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iamActionDefinition", CfnBudgetsActionIamActionDefinitionPropertyValidator)(properties.iamActionDefinition));
  errors.collect(cdk.propertyValidator("scpActionDefinition", CfnBudgetsActionScpActionDefinitionPropertyValidator)(properties.scpActionDefinition));
  errors.collect(cdk.propertyValidator("ssmActionDefinition", CfnBudgetsActionSsmActionDefinitionPropertyValidator)(properties.ssmActionDefinition));
  return errors.wrap("supplied properties not correct for \"DefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetsActionDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetsActionDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "IamActionDefinition": convertCfnBudgetsActionIamActionDefinitionPropertyToCloudFormation(properties.iamActionDefinition),
    "ScpActionDefinition": convertCfnBudgetsActionScpActionDefinitionPropertyToCloudFormation(properties.scpActionDefinition),
    "SsmActionDefinition": convertCfnBudgetsActionSsmActionDefinitionPropertyToCloudFormation(properties.ssmActionDefinition)
  };
}

// @ts-ignore TS6133
function CfnBudgetsActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.DefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.DefinitionProperty>();
  ret.addPropertyResult("iamActionDefinition", "IamActionDefinition", (properties.IamActionDefinition != null ? CfnBudgetsActionIamActionDefinitionPropertyFromCloudFormation(properties.IamActionDefinition) : undefined));
  ret.addPropertyResult("scpActionDefinition", "ScpActionDefinition", (properties.ScpActionDefinition != null ? CfnBudgetsActionScpActionDefinitionPropertyFromCloudFormation(properties.ScpActionDefinition) : undefined));
  ret.addPropertyResult("ssmActionDefinition", "SsmActionDefinition", (properties.SsmActionDefinition != null ? CfnBudgetsActionSsmActionDefinitionPropertyFromCloudFormation(properties.SsmActionDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubscriberProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetsActionSubscriberPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.requiredValidator)(properties.address));
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SubscriberProperty\"");
}

// @ts-ignore TS6133
function convertCfnBudgetsActionSubscriberPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetsActionSubscriberPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnBudgetsActionSubscriberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBudgetsAction.SubscriberProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.SubscriberProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBudgetsActionProps`
 *
 * @param properties - the TypeScript properties of a `CfnBudgetsActionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBudgetsActionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionThreshold", cdk.requiredValidator)(properties.actionThreshold));
  errors.collect(cdk.propertyValidator("actionThreshold", CfnBudgetsActionActionThresholdPropertyValidator)(properties.actionThreshold));
  errors.collect(cdk.propertyValidator("actionType", cdk.requiredValidator)(properties.actionType));
  errors.collect(cdk.propertyValidator("actionType", cdk.validateString)(properties.actionType));
  errors.collect(cdk.propertyValidator("approvalModel", cdk.validateString)(properties.approvalModel));
  errors.collect(cdk.propertyValidator("budgetName", cdk.requiredValidator)(properties.budgetName));
  errors.collect(cdk.propertyValidator("budgetName", cdk.validateString)(properties.budgetName));
  errors.collect(cdk.propertyValidator("definition", cdk.requiredValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("definition", CfnBudgetsActionDefinitionPropertyValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.requiredValidator)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("notificationType", cdk.requiredValidator)(properties.notificationType));
  errors.collect(cdk.propertyValidator("notificationType", cdk.validateString)(properties.notificationType));
  errors.collect(cdk.propertyValidator("subscribers", cdk.requiredValidator)(properties.subscribers));
  errors.collect(cdk.propertyValidator("subscribers", cdk.listValidator(CfnBudgetsActionSubscriberPropertyValidator))(properties.subscribers));
  return errors.wrap("supplied properties not correct for \"CfnBudgetsActionProps\"");
}

// @ts-ignore TS6133
function convertCfnBudgetsActionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBudgetsActionPropsValidator(properties).assertSuccess();
  return {
    "ActionThreshold": convertCfnBudgetsActionActionThresholdPropertyToCloudFormation(properties.actionThreshold),
    "ActionType": cdk.stringToCloudFormation(properties.actionType),
    "ApprovalModel": cdk.stringToCloudFormation(properties.approvalModel),
    "BudgetName": cdk.stringToCloudFormation(properties.budgetName),
    "Definition": convertCfnBudgetsActionDefinitionPropertyToCloudFormation(properties.definition),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "NotificationType": cdk.stringToCloudFormation(properties.notificationType),
    "Subscribers": cdk.listMapper(convertCfnBudgetsActionSubscriberPropertyToCloudFormation)(properties.subscribers)
  };
}

// @ts-ignore TS6133
function CfnBudgetsActionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsActionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsActionProps>();
  ret.addPropertyResult("actionThreshold", "ActionThreshold", (properties.ActionThreshold != null ? CfnBudgetsActionActionThresholdPropertyFromCloudFormation(properties.ActionThreshold) : undefined));
  ret.addPropertyResult("actionType", "ActionType", (properties.ActionType != null ? cfn_parse.FromCloudFormation.getString(properties.ActionType) : undefined));
  ret.addPropertyResult("approvalModel", "ApprovalModel", (properties.ApprovalModel != null ? cfn_parse.FromCloudFormation.getString(properties.ApprovalModel) : undefined));
  ret.addPropertyResult("budgetName", "BudgetName", (properties.BudgetName != null ? cfn_parse.FromCloudFormation.getString(properties.BudgetName) : undefined));
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? CfnBudgetsActionDefinitionPropertyFromCloudFormation(properties.Definition) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("notificationType", "NotificationType", (properties.NotificationType != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationType) : undefined));
  ret.addPropertyResult("subscribers", "Subscribers", (properties.Subscribers != null ? cfn_parse.FromCloudFormation.getArray(CfnBudgetsActionSubscriberPropertyFromCloudFormation)(properties.Subscribers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}