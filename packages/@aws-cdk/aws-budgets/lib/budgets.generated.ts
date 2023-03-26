// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:22.139Z","fingerprint":"74GfiMp2pllbWisPcch6twF6A6YgLveAJVjn82/ICyA="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnBudget`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html
 */
export interface CfnBudgetProps {

    /**
     * The budget object that you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-budget
     */
    readonly budget: CfnBudget.BudgetDataProperty | cdk.IResolvable;

    /**
     * A notification that you want to associate with a budget. A budget can have up to five notifications, and each notification can have one SNS subscriber and up to 10 email subscribers. If you include notifications and subscribers in your `CreateBudget` call, AWS creates the notifications and subscribers for you.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-notificationswithsubscribers
     */
    readonly notificationsWithSubscribers?: Array<CfnBudget.NotificationWithSubscribersProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBudgetProps`
 *
 * @param properties - the TypeScript properties of a `CfnBudgetProps`
 *
 * @returns the result of the validation.
 */
function CfnBudgetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('budget', cdk.requiredValidator)(properties.budget));
    errors.collect(cdk.propertyValidator('budget', CfnBudget_BudgetDataPropertyValidator)(properties.budget));
    errors.collect(cdk.propertyValidator('notificationsWithSubscribers', cdk.listValidator(CfnBudget_NotificationWithSubscribersPropertyValidator))(properties.notificationsWithSubscribers));
    return errors.wrap('supplied properties not correct for "CfnBudgetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget` resource
 *
 * @param properties - the TypeScript properties of a `CfnBudgetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget` resource.
 */
// @ts-ignore TS6133
function cfnBudgetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetPropsValidator(properties).assertSuccess();
    return {
        Budget: cfnBudgetBudgetDataPropertyToCloudFormation(properties.budget),
        NotificationsWithSubscribers: cdk.listMapper(cfnBudgetNotificationWithSubscribersPropertyToCloudFormation)(properties.notificationsWithSubscribers),
    };
}

// @ts-ignore TS6133
function CfnBudgetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetProps>();
    ret.addPropertyResult('budget', 'Budget', CfnBudgetBudgetDataPropertyFromCloudFormation(properties.Budget));
    ret.addPropertyResult('notificationsWithSubscribers', 'NotificationsWithSubscribers', properties.NotificationsWithSubscribers != null ? cfn_parse.FromCloudFormation.getArray(CfnBudgetNotificationWithSubscribersPropertyFromCloudFormation)(properties.NotificationsWithSubscribers) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Budgets::Budget`
 *
 * The `AWS::Budgets::Budget` resource allows customers to take pre-defined actions that will trigger once a budget threshold has been exceeded. creates, replaces, or deletes budgets for Billing and Cost Management. For more information, see [Managing Your Costs with Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html) in the *AWS Billing and Cost Management User Guide* .
 *
 * @cloudformationResource AWS::Budgets::Budget
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html
 */
export class CfnBudget extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Budgets::Budget";

    /**
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
        const ret = new CfnBudget(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The budget object that you want to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-budget
     */
    public budget: CfnBudget.BudgetDataProperty | cdk.IResolvable;

    /**
     * A notification that you want to associate with a budget. A budget can have up to five notifications, and each notification can have one SNS subscriber and up to 10 email subscribers. If you include notifications and subscribers in your `CreateBudget` call, AWS creates the notifications and subscribers for you.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-notificationswithsubscribers
     */
    public notificationsWithSubscribers: Array<CfnBudget.NotificationWithSubscribersProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Budgets::Budget`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBudgetProps) {
        super(scope, id, { type: CfnBudget.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'budget', this);

        this.budget = props.budget;
        this.notificationsWithSubscribers = props.notificationsWithSubscribers;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBudget.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            budget: this.budget,
            notificationsWithSubscribers: this.notificationsWithSubscribers,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBudgetPropsToCloudFormation(props);
    }
}

export namespace CfnBudget {
    /**
     * The parameters that determine the budget amount for an auto-adjusting budget.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-autoadjustdata.html
     */
    export interface AutoAdjustDataProperty {
        /**
         * The string that defines whether your budget auto-adjusts based on historical or forecasted data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-autoadjustdata.html#cfn-budgets-budget-autoadjustdata-autoadjusttype
         */
        readonly autoAdjustType: string;
        /**
         * The parameters that define or describe the historical data that your auto-adjusting budget is based on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-autoadjustdata.html#cfn-budgets-budget-autoadjustdata-historicaloptions
         */
        readonly historicalOptions?: CfnBudget.HistoricalOptionsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AutoAdjustDataProperty`
 *
 * @param properties - the TypeScript properties of a `AutoAdjustDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_AutoAdjustDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoAdjustType', cdk.requiredValidator)(properties.autoAdjustType));
    errors.collect(cdk.propertyValidator('autoAdjustType', cdk.validateString)(properties.autoAdjustType));
    errors.collect(cdk.propertyValidator('historicalOptions', CfnBudget_HistoricalOptionsPropertyValidator)(properties.historicalOptions));
    return errors.wrap('supplied properties not correct for "AutoAdjustDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.AutoAdjustData` resource
 *
 * @param properties - the TypeScript properties of a `AutoAdjustDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.AutoAdjustData` resource.
 */
// @ts-ignore TS6133
function cfnBudgetAutoAdjustDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_AutoAdjustDataPropertyValidator(properties).assertSuccess();
    return {
        AutoAdjustType: cdk.stringToCloudFormation(properties.autoAdjustType),
        HistoricalOptions: cfnBudgetHistoricalOptionsPropertyToCloudFormation(properties.historicalOptions),
    };
}

// @ts-ignore TS6133
function CfnBudgetAutoAdjustDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.AutoAdjustDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.AutoAdjustDataProperty>();
    ret.addPropertyResult('autoAdjustType', 'AutoAdjustType', cfn_parse.FromCloudFormation.getString(properties.AutoAdjustType));
    ret.addPropertyResult('historicalOptions', 'HistoricalOptions', properties.HistoricalOptions != null ? CfnBudgetHistoricalOptionsPropertyFromCloudFormation(properties.HistoricalOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
    /**
     * Represents the output of the `CreateBudget` operation. The content consists of the detailed metadata and data file information, and the current status of the `budget` object.
     *
     * This is the Amazon Resource Name (ARN) pattern for a budget:
     *
     * `arn:aws:budgets::AccountId:budget/budgetName`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html
     */
    export interface BudgetDataProperty {
        /**
         * `CfnBudget.BudgetDataProperty.AutoAdjustData`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-autoadjustdata
         */
        readonly autoAdjustData?: CfnBudget.AutoAdjustDataProperty | cdk.IResolvable;
        /**
         * The total amount of cost, usage, RI utilization, RI coverage, Savings Plans utilization, or Savings Plans coverage that you want to track with your budget.
         *
         * `BudgetLimit` is required for cost or usage budgets, but optional for RI or Savings Plans utilization or coverage budgets. RI and Savings Plans utilization or coverage budgets default to `100` . This is the only valid value for RI or Savings Plans utilization or coverage budgets. You can't use `BudgetLimit` with `PlannedBudgetLimits` for `CreateBudget` and `UpdateBudget` actions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgetlimit
         */
        readonly budgetLimit?: CfnBudget.SpendProperty | cdk.IResolvable;
        /**
         * The name of a budget. The value must be unique within an account. `BudgetName` can't include `:` and `\` characters. If you don't include value for `BudgetName` in the template, Billing and Cost Management assigns your budget a randomly generated name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgetname
         */
        readonly budgetName?: string;
        /**
         * Specifies whether this budget tracks costs, usage, RI utilization, RI coverage, Savings Plans utilization, or Savings Plans coverage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgettype
         */
        readonly budgetType: string;
        /**
         * The cost filters, such as `Region` , `Service` , `member account` , `Tag` , or `Cost Category` , that are applied to a budget.
         *
         * AWS Budgets supports the following services as a `Service` filter for RI budgets:
         *
         * - Amazon EC2
         * - Amazon Redshift
         * - Amazon Relational Database Service
         * - Amazon ElastiCache
         * - Amazon OpenSearch Service
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-costfilters
         */
        readonly costFilters?: any | cdk.IResolvable;
        /**
         * The types of costs that are included in this `COST` budget.
         *
         * `USAGE` , `RI_UTILIZATION` , `RI_COVERAGE` , `SAVINGS_PLANS_UTILIZATION` , and `SAVINGS_PLANS_COVERAGE` budgets do not have `CostTypes` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-costtypes
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-plannedbudgetlimits
         */
        readonly plannedBudgetLimits?: any | cdk.IResolvable;
        /**
         * The period of time that is covered by a budget. The period has a start date and an end date. The start date must come before the end date. There are no restrictions on the end date.
         *
         * The start date for a budget. If you created your budget and didn't specify a start date, the start date defaults to the start of the chosen time period (MONTHLY, QUARTERLY, or ANNUALLY). For example, if you create your budget on January 24, 2019, choose `MONTHLY` , and don't set a start date, the start date defaults to `01/01/19 00:00 UTC` . The defaults are the same for the AWS Billing and Cost Management console and the API.
         *
         * You can change your start date with the `UpdateBudget` operation.
         *
         * After the end date, AWS deletes the budget and all associated notifications and subscribers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-timeperiod
         */
        readonly timePeriod?: CfnBudget.TimePeriodProperty | cdk.IResolvable;
        /**
         * The length of time until a budget resets the actual and forecasted spend. `DAILY` is available only for `RI_UTILIZATION` and `RI_COVERAGE` budgets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-timeunit
         */
        readonly timeUnit: string;
    }
}

/**
 * Determine whether the given properties match those of a `BudgetDataProperty`
 *
 * @param properties - the TypeScript properties of a `BudgetDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_BudgetDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoAdjustData', CfnBudget_AutoAdjustDataPropertyValidator)(properties.autoAdjustData));
    errors.collect(cdk.propertyValidator('budgetLimit', CfnBudget_SpendPropertyValidator)(properties.budgetLimit));
    errors.collect(cdk.propertyValidator('budgetName', cdk.validateString)(properties.budgetName));
    errors.collect(cdk.propertyValidator('budgetType', cdk.requiredValidator)(properties.budgetType));
    errors.collect(cdk.propertyValidator('budgetType', cdk.validateString)(properties.budgetType));
    errors.collect(cdk.propertyValidator('costFilters', cdk.validateObject)(properties.costFilters));
    errors.collect(cdk.propertyValidator('costTypes', CfnBudget_CostTypesPropertyValidator)(properties.costTypes));
    errors.collect(cdk.propertyValidator('plannedBudgetLimits', cdk.validateObject)(properties.plannedBudgetLimits));
    errors.collect(cdk.propertyValidator('timePeriod', CfnBudget_TimePeriodPropertyValidator)(properties.timePeriod));
    errors.collect(cdk.propertyValidator('timeUnit', cdk.requiredValidator)(properties.timeUnit));
    errors.collect(cdk.propertyValidator('timeUnit', cdk.validateString)(properties.timeUnit));
    return errors.wrap('supplied properties not correct for "BudgetDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.BudgetData` resource
 *
 * @param properties - the TypeScript properties of a `BudgetDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.BudgetData` resource.
 */
// @ts-ignore TS6133
function cfnBudgetBudgetDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_BudgetDataPropertyValidator(properties).assertSuccess();
    return {
        AutoAdjustData: cfnBudgetAutoAdjustDataPropertyToCloudFormation(properties.autoAdjustData),
        BudgetLimit: cfnBudgetSpendPropertyToCloudFormation(properties.budgetLimit),
        BudgetName: cdk.stringToCloudFormation(properties.budgetName),
        BudgetType: cdk.stringToCloudFormation(properties.budgetType),
        CostFilters: cdk.objectToCloudFormation(properties.costFilters),
        CostTypes: cfnBudgetCostTypesPropertyToCloudFormation(properties.costTypes),
        PlannedBudgetLimits: cdk.objectToCloudFormation(properties.plannedBudgetLimits),
        TimePeriod: cfnBudgetTimePeriodPropertyToCloudFormation(properties.timePeriod),
        TimeUnit: cdk.stringToCloudFormation(properties.timeUnit),
    };
}

// @ts-ignore TS6133
function CfnBudgetBudgetDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.BudgetDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.BudgetDataProperty>();
    ret.addPropertyResult('autoAdjustData', 'AutoAdjustData', properties.AutoAdjustData != null ? CfnBudgetAutoAdjustDataPropertyFromCloudFormation(properties.AutoAdjustData) : undefined);
    ret.addPropertyResult('budgetLimit', 'BudgetLimit', properties.BudgetLimit != null ? CfnBudgetSpendPropertyFromCloudFormation(properties.BudgetLimit) : undefined);
    ret.addPropertyResult('budgetName', 'BudgetName', properties.BudgetName != null ? cfn_parse.FromCloudFormation.getString(properties.BudgetName) : undefined);
    ret.addPropertyResult('budgetType', 'BudgetType', cfn_parse.FromCloudFormation.getString(properties.BudgetType));
    ret.addPropertyResult('costFilters', 'CostFilters', properties.CostFilters != null ? cfn_parse.FromCloudFormation.getAny(properties.CostFilters) : undefined);
    ret.addPropertyResult('costTypes', 'CostTypes', properties.CostTypes != null ? CfnBudgetCostTypesPropertyFromCloudFormation(properties.CostTypes) : undefined);
    ret.addPropertyResult('plannedBudgetLimits', 'PlannedBudgetLimits', properties.PlannedBudgetLimits != null ? cfn_parse.FromCloudFormation.getAny(properties.PlannedBudgetLimits) : undefined);
    ret.addPropertyResult('timePeriod', 'TimePeriod', properties.TimePeriod != null ? CfnBudgetTimePeriodPropertyFromCloudFormation(properties.TimePeriod) : undefined);
    ret.addPropertyResult('timeUnit', 'TimeUnit', cfn_parse.FromCloudFormation.getString(properties.TimeUnit));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
    /**
     * The types of cost that are included in a `COST` budget, such as tax and subscriptions.
     *
     * `USAGE` , `RI_UTILIZATION` , `RI_COVERAGE` , `SAVINGS_PLANS_UTILIZATION` , and `SAVINGS_PLANS_COVERAGE` budgets don't have `CostTypes` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html
     */
    export interface CostTypesProperty {
        /**
         * Specifies whether a budget includes credits.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includecredit
         */
        readonly includeCredit?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes discounts.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includediscount
         */
        readonly includeDiscount?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes non-RI subscription costs.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includeothersubscription
         */
        readonly includeOtherSubscription?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes recurring fees such as monthly RI fees.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includerecurring
         */
        readonly includeRecurring?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes refunds.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includerefund
         */
        readonly includeRefund?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes subscriptions.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includesubscription
         */
        readonly includeSubscription?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes support subscription fees.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includesupport
         */
        readonly includeSupport?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes taxes.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includetax
         */
        readonly includeTax?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget includes upfront RI costs.
         *
         * The default value is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-includeupfront
         */
        readonly includeUpfront?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget uses the amortized rate.
         *
         * The default value is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-useamortized
         */
        readonly useAmortized?: boolean | cdk.IResolvable;
        /**
         * Specifies whether a budget uses a blended rate.
         *
         * The default value is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-costtypes.html#cfn-budgets-budget-costtypes-useblended
         */
        readonly useBlended?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CostTypesProperty`
 *
 * @param properties - the TypeScript properties of a `CostTypesProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_CostTypesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('includeCredit', cdk.validateBoolean)(properties.includeCredit));
    errors.collect(cdk.propertyValidator('includeDiscount', cdk.validateBoolean)(properties.includeDiscount));
    errors.collect(cdk.propertyValidator('includeOtherSubscription', cdk.validateBoolean)(properties.includeOtherSubscription));
    errors.collect(cdk.propertyValidator('includeRecurring', cdk.validateBoolean)(properties.includeRecurring));
    errors.collect(cdk.propertyValidator('includeRefund', cdk.validateBoolean)(properties.includeRefund));
    errors.collect(cdk.propertyValidator('includeSubscription', cdk.validateBoolean)(properties.includeSubscription));
    errors.collect(cdk.propertyValidator('includeSupport', cdk.validateBoolean)(properties.includeSupport));
    errors.collect(cdk.propertyValidator('includeTax', cdk.validateBoolean)(properties.includeTax));
    errors.collect(cdk.propertyValidator('includeUpfront', cdk.validateBoolean)(properties.includeUpfront));
    errors.collect(cdk.propertyValidator('useAmortized', cdk.validateBoolean)(properties.useAmortized));
    errors.collect(cdk.propertyValidator('useBlended', cdk.validateBoolean)(properties.useBlended));
    return errors.wrap('supplied properties not correct for "CostTypesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.CostTypes` resource
 *
 * @param properties - the TypeScript properties of a `CostTypesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.CostTypes` resource.
 */
// @ts-ignore TS6133
function cfnBudgetCostTypesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_CostTypesPropertyValidator(properties).assertSuccess();
    return {
        IncludeCredit: cdk.booleanToCloudFormation(properties.includeCredit),
        IncludeDiscount: cdk.booleanToCloudFormation(properties.includeDiscount),
        IncludeOtherSubscription: cdk.booleanToCloudFormation(properties.includeOtherSubscription),
        IncludeRecurring: cdk.booleanToCloudFormation(properties.includeRecurring),
        IncludeRefund: cdk.booleanToCloudFormation(properties.includeRefund),
        IncludeSubscription: cdk.booleanToCloudFormation(properties.includeSubscription),
        IncludeSupport: cdk.booleanToCloudFormation(properties.includeSupport),
        IncludeTax: cdk.booleanToCloudFormation(properties.includeTax),
        IncludeUpfront: cdk.booleanToCloudFormation(properties.includeUpfront),
        UseAmortized: cdk.booleanToCloudFormation(properties.useAmortized),
        UseBlended: cdk.booleanToCloudFormation(properties.useBlended),
    };
}

// @ts-ignore TS6133
function CfnBudgetCostTypesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.CostTypesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.CostTypesProperty>();
    ret.addPropertyResult('includeCredit', 'IncludeCredit', properties.IncludeCredit != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeCredit) : undefined);
    ret.addPropertyResult('includeDiscount', 'IncludeDiscount', properties.IncludeDiscount != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDiscount) : undefined);
    ret.addPropertyResult('includeOtherSubscription', 'IncludeOtherSubscription', properties.IncludeOtherSubscription != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeOtherSubscription) : undefined);
    ret.addPropertyResult('includeRecurring', 'IncludeRecurring', properties.IncludeRecurring != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeRecurring) : undefined);
    ret.addPropertyResult('includeRefund', 'IncludeRefund', properties.IncludeRefund != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeRefund) : undefined);
    ret.addPropertyResult('includeSubscription', 'IncludeSubscription', properties.IncludeSubscription != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSubscription) : undefined);
    ret.addPropertyResult('includeSupport', 'IncludeSupport', properties.IncludeSupport != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSupport) : undefined);
    ret.addPropertyResult('includeTax', 'IncludeTax', properties.IncludeTax != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeTax) : undefined);
    ret.addPropertyResult('includeUpfront', 'IncludeUpfront', properties.IncludeUpfront != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeUpfront) : undefined);
    ret.addPropertyResult('useAmortized', 'UseAmortized', properties.UseAmortized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAmortized) : undefined);
    ret.addPropertyResult('useBlended', 'UseBlended', properties.UseBlended != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseBlended) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
    /**
     * The parameters that define or describe the historical data that your auto-adjusting budget is based on.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-historicaloptions.html
     */
    export interface HistoricalOptionsProperty {
        /**
         * The number of budget periods included in the moving-average calculation that determines your auto-adjusted budget amount. The maximum value depends on the `TimeUnit` granularity of the budget:
         *
         * - For the `DAILY` granularity, the maximum value is `60` .
         * - For the `MONTHLY` granularity, the maximum value is `12` .
         * - For the `QUARTERLY` granularity, the maximum value is `4` .
         * - For the `ANNUALLY` granularity, the maximum value is `1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-historicaloptions.html#cfn-budgets-budget-historicaloptions-budgetadjustmentperiod
         */
        readonly budgetAdjustmentPeriod: number;
    }
}

/**
 * Determine whether the given properties match those of a `HistoricalOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `HistoricalOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_HistoricalOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('budgetAdjustmentPeriod', cdk.requiredValidator)(properties.budgetAdjustmentPeriod));
    errors.collect(cdk.propertyValidator('budgetAdjustmentPeriod', cdk.validateNumber)(properties.budgetAdjustmentPeriod));
    return errors.wrap('supplied properties not correct for "HistoricalOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.HistoricalOptions` resource
 *
 * @param properties - the TypeScript properties of a `HistoricalOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.HistoricalOptions` resource.
 */
// @ts-ignore TS6133
function cfnBudgetHistoricalOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_HistoricalOptionsPropertyValidator(properties).assertSuccess();
    return {
        BudgetAdjustmentPeriod: cdk.numberToCloudFormation(properties.budgetAdjustmentPeriod),
    };
}

// @ts-ignore TS6133
function CfnBudgetHistoricalOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.HistoricalOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.HistoricalOptionsProperty>();
    ret.addPropertyResult('budgetAdjustmentPeriod', 'BudgetAdjustmentPeriod', cfn_parse.FromCloudFormation.getNumber(properties.BudgetAdjustmentPeriod));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html
     */
    export interface NotificationProperty {
        /**
         * The comparison that's used for this notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-comparisonoperator
         */
        readonly comparisonOperator: string;
        /**
         * Specifies whether the notification is for how much you have spent ( `ACTUAL` ) or for how much that you're forecasted to spend ( `FORECASTED` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-notificationtype
         */
        readonly notificationType: string;
        /**
         * The threshold that's associated with a notification. Thresholds are always a percentage, and many customers find value being alerted between 50% - 200% of the budgeted amount. The maximum limit for your threshold is 1,000,000% above the budgeted amount.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-threshold
         */
        readonly threshold: number;
        /**
         * The type of threshold for a notification. For `ABSOLUTE_VALUE` thresholds, AWS notifies you when you go over or are forecasted to go over your total cost threshold. For `PERCENTAGE` thresholds, AWS notifies you when you go over or are forecasted to go over a certain percentage of your forecasted spend. For example, if you have a budget for 200 dollars and you have a `PERCENTAGE` threshold of 80%, AWS notifies you when you go over 160 dollars.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html#cfn-budgets-budget-notification-thresholdtype
         */
        readonly thresholdType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_NotificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('notificationType', cdk.requiredValidator)(properties.notificationType));
    errors.collect(cdk.propertyValidator('notificationType', cdk.validateString)(properties.notificationType));
    errors.collect(cdk.propertyValidator('threshold', cdk.requiredValidator)(properties.threshold));
    errors.collect(cdk.propertyValidator('threshold', cdk.validateNumber)(properties.threshold));
    errors.collect(cdk.propertyValidator('thresholdType', cdk.validateString)(properties.thresholdType));
    return errors.wrap('supplied properties not correct for "NotificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.Notification` resource
 *
 * @param properties - the TypeScript properties of a `NotificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.Notification` resource.
 */
// @ts-ignore TS6133
function cfnBudgetNotificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_NotificationPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        NotificationType: cdk.stringToCloudFormation(properties.notificationType),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        ThresholdType: cdk.stringToCloudFormation(properties.thresholdType),
    };
}

// @ts-ignore TS6133
function CfnBudgetNotificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.NotificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.NotificationProperty>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('notificationType', 'NotificationType', cfn_parse.FromCloudFormation.getString(properties.NotificationType));
    ret.addPropertyResult('threshold', 'Threshold', cfn_parse.FromCloudFormation.getNumber(properties.Threshold));
    ret.addPropertyResult('thresholdType', 'ThresholdType', properties.ThresholdType != null ? cfn_parse.FromCloudFormation.getString(properties.ThresholdType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
    /**
     * A notification with subscribers. A notification can have one SNS subscriber and up to 10 email subscribers, for a total of 11 subscribers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html
     */
    export interface NotificationWithSubscribersProperty {
        /**
         * The notification that's associated with a budget.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html#cfn-budgets-budget-notificationwithsubscribers-notification
         */
        readonly notification: CfnBudget.NotificationProperty | cdk.IResolvable;
        /**
         * A list of subscribers who are subscribed to this notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html#cfn-budgets-budget-notificationwithsubscribers-subscribers
         */
        readonly subscribers: Array<CfnBudget.SubscriberProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationWithSubscribersProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationWithSubscribersProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_NotificationWithSubscribersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('notification', cdk.requiredValidator)(properties.notification));
    errors.collect(cdk.propertyValidator('notification', CfnBudget_NotificationPropertyValidator)(properties.notification));
    errors.collect(cdk.propertyValidator('subscribers', cdk.requiredValidator)(properties.subscribers));
    errors.collect(cdk.propertyValidator('subscribers', cdk.listValidator(CfnBudget_SubscriberPropertyValidator))(properties.subscribers));
    return errors.wrap('supplied properties not correct for "NotificationWithSubscribersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.NotificationWithSubscribers` resource
 *
 * @param properties - the TypeScript properties of a `NotificationWithSubscribersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.NotificationWithSubscribers` resource.
 */
// @ts-ignore TS6133
function cfnBudgetNotificationWithSubscribersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_NotificationWithSubscribersPropertyValidator(properties).assertSuccess();
    return {
        Notification: cfnBudgetNotificationPropertyToCloudFormation(properties.notification),
        Subscribers: cdk.listMapper(cfnBudgetSubscriberPropertyToCloudFormation)(properties.subscribers),
    };
}

// @ts-ignore TS6133
function CfnBudgetNotificationWithSubscribersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.NotificationWithSubscribersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.NotificationWithSubscribersProperty>();
    ret.addPropertyResult('notification', 'Notification', CfnBudgetNotificationPropertyFromCloudFormation(properties.Notification));
    ret.addPropertyResult('subscribers', 'Subscribers', cfn_parse.FromCloudFormation.getArray(CfnBudgetSubscriberPropertyFromCloudFormation)(properties.Subscribers));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
    /**
     * The amount of cost or usage that's measured for a budget.
     *
     * For example, a `Spend` for `3 GB` of S3 usage has the following parameters:
     *
     * - An `Amount` of `3`
     * - A `unit` of `GB`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-spend.html
     */
    export interface SpendProperty {
        /**
         * The cost or usage amount that's associated with a budget forecast, actual spend, or budget threshold.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-spend.html#cfn-budgets-budget-spend-amount
         */
        readonly amount: number;
        /**
         * The unit of measurement that's used for the budget forecast, actual spend, or budget threshold, such as USD or GBP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-spend.html#cfn-budgets-budget-spend-unit
         */
        readonly unit: string;
    }
}

/**
 * Determine whether the given properties match those of a `SpendProperty`
 *
 * @param properties - the TypeScript properties of a `SpendProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_SpendPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amount', cdk.requiredValidator)(properties.amount));
    errors.collect(cdk.propertyValidator('amount', cdk.validateNumber)(properties.amount));
    errors.collect(cdk.propertyValidator('unit', cdk.requiredValidator)(properties.unit));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "SpendProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.Spend` resource
 *
 * @param properties - the TypeScript properties of a `SpendProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.Spend` resource.
 */
// @ts-ignore TS6133
function cfnBudgetSpendPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_SpendPropertyValidator(properties).assertSuccess();
    return {
        Amount: cdk.numberToCloudFormation(properties.amount),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnBudgetSpendPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.SpendProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.SpendProperty>();
    ret.addPropertyResult('amount', 'Amount', cfn_parse.FromCloudFormation.getNumber(properties.Amount));
    ret.addPropertyResult('unit', 'Unit', cfn_parse.FromCloudFormation.getString(properties.Unit));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
    /**
     * The `Subscriber` property type specifies who to notify for a Billing and Cost Management budget notification. The subscriber consists of a subscription type, and either an Amazon SNS topic or an email address.
     *
     * For example, an email subscriber would have the following parameters:
     *
     * - A `subscriptionType` of `EMAIL`
     * - An `address` of `example@example.com`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html
     */
    export interface SubscriberProperty {
        /**
         * The address that AWS sends budget notifications to, either an SNS topic or an email.
         *
         * When you create a subscriber, the value of `Address` can't contain line breaks.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html#cfn-budgets-budget-subscriber-address
         */
        readonly address: string;
        /**
         * The type of notification that AWS sends to a subscriber.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html#cfn-budgets-budget-subscriber-subscriptiontype
         */
        readonly subscriptionType: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubscriberProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_SubscriberPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('address', cdk.requiredValidator)(properties.address));
    errors.collect(cdk.propertyValidator('address', cdk.validateString)(properties.address));
    errors.collect(cdk.propertyValidator('subscriptionType', cdk.requiredValidator)(properties.subscriptionType));
    errors.collect(cdk.propertyValidator('subscriptionType', cdk.validateString)(properties.subscriptionType));
    return errors.wrap('supplied properties not correct for "SubscriberProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.Subscriber` resource
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.Subscriber` resource.
 */
// @ts-ignore TS6133
function cfnBudgetSubscriberPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_SubscriberPropertyValidator(properties).assertSuccess();
    return {
        Address: cdk.stringToCloudFormation(properties.address),
        SubscriptionType: cdk.stringToCloudFormation(properties.subscriptionType),
    };
}

// @ts-ignore TS6133
function CfnBudgetSubscriberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.SubscriberProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.SubscriberProperty>();
    ret.addPropertyResult('address', 'Address', cfn_parse.FromCloudFormation.getString(properties.Address));
    ret.addPropertyResult('subscriptionType', 'SubscriptionType', cfn_parse.FromCloudFormation.getString(properties.SubscriptionType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudget {
    /**
     * The period of time that is covered by a budget. The period has a start date and an end date. The start date must come before the end date. There are no restrictions on the end date.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html
     */
    export interface TimePeriodProperty {
        /**
         * The end date for a budget. If you didn't specify an end date, AWS set your end date to `06/15/87 00:00 UTC` . The defaults are the same for the AWS Billing and Cost Management console and the API.
         *
         * After the end date, AWS deletes the budget and all the associated notifications and subscribers. You can change your end date with the `UpdateBudget` operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-end
         */
        readonly end?: string;
        /**
         * The start date for a budget. If you created your budget and didn't specify a start date, the start date defaults to the start of the chosen time period (MONTHLY, QUARTERLY, or ANNUALLY). For example, if you create your budget on January 24, 2019, choose `MONTHLY` , and don't set a start date, the start date defaults to `01/01/19 00:00 UTC` . The defaults are the same for the AWS Billing and Cost Management console and the API.
         *
         * You can change your start date with the `UpdateBudget` operation.
         *
         * Valid values depend on the value of `BudgetType` :
         *
         * - If `BudgetType` is `COST` or `USAGE` : Valid values are `MONTHLY` , `QUARTERLY` , and `ANNUALLY` .
         * - If `BudgetType` is `RI_UTILIZATION` or `RI_COVERAGE` : Valid values are `DAILY` , `MONTHLY` , `QUARTERLY` , and `ANNUALLY` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-start
         */
        readonly start?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TimePeriodProperty`
 *
 * @param properties - the TypeScript properties of a `TimePeriodProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudget_TimePeriodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('end', cdk.validateString)(properties.end));
    errors.collect(cdk.propertyValidator('start', cdk.validateString)(properties.start));
    return errors.wrap('supplied properties not correct for "TimePeriodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::Budget.TimePeriod` resource
 *
 * @param properties - the TypeScript properties of a `TimePeriodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::Budget.TimePeriod` resource.
 */
// @ts-ignore TS6133
function cfnBudgetTimePeriodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudget_TimePeriodPropertyValidator(properties).assertSuccess();
    return {
        End: cdk.stringToCloudFormation(properties.end),
        Start: cdk.stringToCloudFormation(properties.start),
    };
}

// @ts-ignore TS6133
function CfnBudgetTimePeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudget.TimePeriodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudget.TimePeriodProperty>();
    ret.addPropertyResult('end', 'End', properties.End != null ? cfn_parse.FromCloudFormation.getString(properties.End) : undefined);
    ret.addPropertyResult('start', 'Start', properties.Start != null ? cfn_parse.FromCloudFormation.getString(properties.Start) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBudgetsAction`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html
 */
export interface CfnBudgetsActionProps {

    /**
     * The trigger threshold of the action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-actionthreshold
     */
    readonly actionThreshold: CfnBudgetsAction.ActionThresholdProperty | cdk.IResolvable;

    /**
     * The type of action. This defines the type of tasks that can be carried out by this action. This field also determines the format for definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-actiontype
     */
    readonly actionType: string;

    /**
     * A string that represents the budget name. ":" and "\" characters aren't allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-budgetname
     */
    readonly budgetName: string;

    /**
     * Specifies all of the type-specific parameters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-definition
     */
    readonly definition: CfnBudgetsAction.DefinitionProperty | cdk.IResolvable;

    /**
     * The role passed for action execution and reversion. Roles and actions must be in the same account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-executionrolearn
     */
    readonly executionRoleArn: string;

    /**
     * The type of a notification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-notificationtype
     */
    readonly notificationType: string;

    /**
     * A list of subscribers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-subscribers
     */
    readonly subscribers: Array<CfnBudgetsAction.SubscriberProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * This specifies if the action needs manual or automatic approval.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-approvalmodel
     */
    readonly approvalModel?: string;
}

/**
 * Determine whether the given properties match those of a `CfnBudgetsActionProps`
 *
 * @param properties - the TypeScript properties of a `CfnBudgetsActionProps`
 *
 * @returns the result of the validation.
 */
function CfnBudgetsActionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionThreshold', cdk.requiredValidator)(properties.actionThreshold));
    errors.collect(cdk.propertyValidator('actionThreshold', CfnBudgetsAction_ActionThresholdPropertyValidator)(properties.actionThreshold));
    errors.collect(cdk.propertyValidator('actionType', cdk.requiredValidator)(properties.actionType));
    errors.collect(cdk.propertyValidator('actionType', cdk.validateString)(properties.actionType));
    errors.collect(cdk.propertyValidator('approvalModel', cdk.validateString)(properties.approvalModel));
    errors.collect(cdk.propertyValidator('budgetName', cdk.requiredValidator)(properties.budgetName));
    errors.collect(cdk.propertyValidator('budgetName', cdk.validateString)(properties.budgetName));
    errors.collect(cdk.propertyValidator('definition', cdk.requiredValidator)(properties.definition));
    errors.collect(cdk.propertyValidator('definition', CfnBudgetsAction_DefinitionPropertyValidator)(properties.definition));
    errors.collect(cdk.propertyValidator('executionRoleArn', cdk.requiredValidator)(properties.executionRoleArn));
    errors.collect(cdk.propertyValidator('executionRoleArn', cdk.validateString)(properties.executionRoleArn));
    errors.collect(cdk.propertyValidator('notificationType', cdk.requiredValidator)(properties.notificationType));
    errors.collect(cdk.propertyValidator('notificationType', cdk.validateString)(properties.notificationType));
    errors.collect(cdk.propertyValidator('subscribers', cdk.requiredValidator)(properties.subscribers));
    errors.collect(cdk.propertyValidator('subscribers', cdk.listValidator(CfnBudgetsAction_SubscriberPropertyValidator))(properties.subscribers));
    return errors.wrap('supplied properties not correct for "CfnBudgetsActionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction` resource
 *
 * @param properties - the TypeScript properties of a `CfnBudgetsActionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction` resource.
 */
// @ts-ignore TS6133
function cfnBudgetsActionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetsActionPropsValidator(properties).assertSuccess();
    return {
        ActionThreshold: cfnBudgetsActionActionThresholdPropertyToCloudFormation(properties.actionThreshold),
        ActionType: cdk.stringToCloudFormation(properties.actionType),
        BudgetName: cdk.stringToCloudFormation(properties.budgetName),
        Definition: cfnBudgetsActionDefinitionPropertyToCloudFormation(properties.definition),
        ExecutionRoleArn: cdk.stringToCloudFormation(properties.executionRoleArn),
        NotificationType: cdk.stringToCloudFormation(properties.notificationType),
        Subscribers: cdk.listMapper(cfnBudgetsActionSubscriberPropertyToCloudFormation)(properties.subscribers),
        ApprovalModel: cdk.stringToCloudFormation(properties.approvalModel),
    };
}

// @ts-ignore TS6133
function CfnBudgetsActionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsActionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsActionProps>();
    ret.addPropertyResult('actionThreshold', 'ActionThreshold', CfnBudgetsActionActionThresholdPropertyFromCloudFormation(properties.ActionThreshold));
    ret.addPropertyResult('actionType', 'ActionType', cfn_parse.FromCloudFormation.getString(properties.ActionType));
    ret.addPropertyResult('budgetName', 'BudgetName', cfn_parse.FromCloudFormation.getString(properties.BudgetName));
    ret.addPropertyResult('definition', 'Definition', CfnBudgetsActionDefinitionPropertyFromCloudFormation(properties.Definition));
    ret.addPropertyResult('executionRoleArn', 'ExecutionRoleArn', cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn));
    ret.addPropertyResult('notificationType', 'NotificationType', cfn_parse.FromCloudFormation.getString(properties.NotificationType));
    ret.addPropertyResult('subscribers', 'Subscribers', cfn_parse.FromCloudFormation.getArray(CfnBudgetsActionSubscriberPropertyFromCloudFormation)(properties.Subscribers));
    ret.addPropertyResult('approvalModel', 'ApprovalModel', properties.ApprovalModel != null ? cfn_parse.FromCloudFormation.getString(properties.ApprovalModel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Budgets::BudgetsAction`
 *
 * The `AWS::Budgets::BudgetsAction` resource enables you to take predefined actions that are initiated when a budget threshold has been exceeded. For more information, see [Managing Your Costs with Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html) in the *AWS Billing and Cost Management User Guide* .
 *
 * @cloudformationResource AWS::Budgets::BudgetsAction
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html
 */
export class CfnBudgetsAction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Budgets::BudgetsAction";

    /**
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
        const ret = new CfnBudgetsAction(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A system-generated universally unique identifier (UUID) for the action.
     * @cloudformationAttribute ActionId
     */
    public readonly attrActionId: string;

    /**
     * The trigger threshold of the action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-actionthreshold
     */
    public actionThreshold: CfnBudgetsAction.ActionThresholdProperty | cdk.IResolvable;

    /**
     * The type of action. This defines the type of tasks that can be carried out by this action. This field also determines the format for definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-actiontype
     */
    public actionType: string;

    /**
     * A string that represents the budget name. ":" and "\" characters aren't allowed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-budgetname
     */
    public budgetName: string;

    /**
     * Specifies all of the type-specific parameters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-definition
     */
    public definition: CfnBudgetsAction.DefinitionProperty | cdk.IResolvable;

    /**
     * The role passed for action execution and reversion. Roles and actions must be in the same account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-executionrolearn
     */
    public executionRoleArn: string;

    /**
     * The type of a notification.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-notificationtype
     */
    public notificationType: string;

    /**
     * A list of subscribers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-subscribers
     */
    public subscribers: Array<CfnBudgetsAction.SubscriberProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * This specifies if the action needs manual or automatic approval.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html#cfn-budgets-budgetsaction-approvalmodel
     */
    public approvalModel: string | undefined;

    /**
     * Create a new `AWS::Budgets::BudgetsAction`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBudgetsActionProps) {
        super(scope, id, { type: CfnBudgetsAction.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'actionThreshold', this);
        cdk.requireProperty(props, 'actionType', this);
        cdk.requireProperty(props, 'budgetName', this);
        cdk.requireProperty(props, 'definition', this);
        cdk.requireProperty(props, 'executionRoleArn', this);
        cdk.requireProperty(props, 'notificationType', this);
        cdk.requireProperty(props, 'subscribers', this);
        this.attrActionId = cdk.Token.asString(this.getAtt('ActionId', cdk.ResolutionTypeHint.STRING));

        this.actionThreshold = props.actionThreshold;
        this.actionType = props.actionType;
        this.budgetName = props.budgetName;
        this.definition = props.definition;
        this.executionRoleArn = props.executionRoleArn;
        this.notificationType = props.notificationType;
        this.subscribers = props.subscribers;
        this.approvalModel = props.approvalModel;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBudgetsAction.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            actionThreshold: this.actionThreshold,
            actionType: this.actionType,
            budgetName: this.budgetName,
            definition: this.definition,
            executionRoleArn: this.executionRoleArn,
            notificationType: this.notificationType,
            subscribers: this.subscribers,
            approvalModel: this.approvalModel,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBudgetsActionPropsToCloudFormation(props);
    }
}

export namespace CfnBudgetsAction {
    /**
     * The trigger threshold of the action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-actionthreshold.html
     */
    export interface ActionThresholdProperty {
        /**
         * The type of threshold for a notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-actionthreshold.html#cfn-budgets-budgetsaction-actionthreshold-type
         */
        readonly type: string;
        /**
         * The threshold of a notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-actionthreshold.html#cfn-budgets-budgetsaction-actionthreshold-value
         */
        readonly value: number;
    }
}

/**
 * Determine whether the given properties match those of a `ActionThresholdProperty`
 *
 * @param properties - the TypeScript properties of a `ActionThresholdProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudgetsAction_ActionThresholdPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "ActionThresholdProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.ActionThreshold` resource
 *
 * @param properties - the TypeScript properties of a `ActionThresholdProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.ActionThreshold` resource.
 */
// @ts-ignore TS6133
function cfnBudgetsActionActionThresholdPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetsAction_ActionThresholdPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBudgetsActionActionThresholdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.ActionThresholdProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.ActionThresholdProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getNumber(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudgetsAction {
    /**
     * The definition is where you specify all of the type-specific parameters.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html
     */
    export interface DefinitionProperty {
        /**
         * The AWS Identity and Access Management ( IAM ) action definition details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html#cfn-budgets-budgetsaction-definition-iamactiondefinition
         */
        readonly iamActionDefinition?: CfnBudgetsAction.IamActionDefinitionProperty | cdk.IResolvable;
        /**
         * The service control policies (SCP) action definition details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html#cfn-budgets-budgetsaction-definition-scpactiondefinition
         */
        readonly scpActionDefinition?: CfnBudgetsAction.ScpActionDefinitionProperty | cdk.IResolvable;
        /**
         * The Amazon EC2 Systems Manager ( SSM ) action definition details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-definition.html#cfn-budgets-budgetsaction-definition-ssmactiondefinition
         */
        readonly ssmActionDefinition?: CfnBudgetsAction.SsmActionDefinitionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudgetsAction_DefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iamActionDefinition', CfnBudgetsAction_IamActionDefinitionPropertyValidator)(properties.iamActionDefinition));
    errors.collect(cdk.propertyValidator('scpActionDefinition', CfnBudgetsAction_ScpActionDefinitionPropertyValidator)(properties.scpActionDefinition));
    errors.collect(cdk.propertyValidator('ssmActionDefinition', CfnBudgetsAction_SsmActionDefinitionPropertyValidator)(properties.ssmActionDefinition));
    return errors.wrap('supplied properties not correct for "DefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.Definition` resource
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.Definition` resource.
 */
// @ts-ignore TS6133
function cfnBudgetsActionDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetsAction_DefinitionPropertyValidator(properties).assertSuccess();
    return {
        IamActionDefinition: cfnBudgetsActionIamActionDefinitionPropertyToCloudFormation(properties.iamActionDefinition),
        ScpActionDefinition: cfnBudgetsActionScpActionDefinitionPropertyToCloudFormation(properties.scpActionDefinition),
        SsmActionDefinition: cfnBudgetsActionSsmActionDefinitionPropertyToCloudFormation(properties.ssmActionDefinition),
    };
}

// @ts-ignore TS6133
function CfnBudgetsActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.DefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.DefinitionProperty>();
    ret.addPropertyResult('iamActionDefinition', 'IamActionDefinition', properties.IamActionDefinition != null ? CfnBudgetsActionIamActionDefinitionPropertyFromCloudFormation(properties.IamActionDefinition) : undefined);
    ret.addPropertyResult('scpActionDefinition', 'ScpActionDefinition', properties.ScpActionDefinition != null ? CfnBudgetsActionScpActionDefinitionPropertyFromCloudFormation(properties.ScpActionDefinition) : undefined);
    ret.addPropertyResult('ssmActionDefinition', 'SsmActionDefinition', properties.SsmActionDefinition != null ? CfnBudgetsActionSsmActionDefinitionPropertyFromCloudFormation(properties.SsmActionDefinition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudgetsAction {
    /**
     * The AWS Identity and Access Management ( IAM ) action definition details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html
     */
    export interface IamActionDefinitionProperty {
        /**
         * A list of groups to be attached. There must be at least one group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-groups
         */
        readonly groups?: string[];
        /**
         * The Amazon Resource Name (ARN) of the policy to be attached.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-policyarn
         */
        readonly policyArn: string;
        /**
         * A list of roles to be attached. There must be at least one role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-roles
         */
        readonly roles?: string[];
        /**
         * A list of users to be attached. There must be at least one user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-iamactiondefinition.html#cfn-budgets-budgetsaction-iamactiondefinition-users
         */
        readonly users?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `IamActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `IamActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudgetsAction_IamActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groups', cdk.listValidator(cdk.validateString))(properties.groups));
    errors.collect(cdk.propertyValidator('policyArn', cdk.requiredValidator)(properties.policyArn));
    errors.collect(cdk.propertyValidator('policyArn', cdk.validateString)(properties.policyArn));
    errors.collect(cdk.propertyValidator('roles', cdk.listValidator(cdk.validateString))(properties.roles));
    errors.collect(cdk.propertyValidator('users', cdk.listValidator(cdk.validateString))(properties.users));
    return errors.wrap('supplied properties not correct for "IamActionDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.IamActionDefinition` resource
 *
 * @param properties - the TypeScript properties of a `IamActionDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.IamActionDefinition` resource.
 */
// @ts-ignore TS6133
function cfnBudgetsActionIamActionDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetsAction_IamActionDefinitionPropertyValidator(properties).assertSuccess();
    return {
        Groups: cdk.listMapper(cdk.stringToCloudFormation)(properties.groups),
        PolicyArn: cdk.stringToCloudFormation(properties.policyArn),
        Roles: cdk.listMapper(cdk.stringToCloudFormation)(properties.roles),
        Users: cdk.listMapper(cdk.stringToCloudFormation)(properties.users),
    };
}

// @ts-ignore TS6133
function CfnBudgetsActionIamActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.IamActionDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.IamActionDefinitionProperty>();
    ret.addPropertyResult('groups', 'Groups', properties.Groups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Groups) : undefined);
    ret.addPropertyResult('policyArn', 'PolicyArn', cfn_parse.FromCloudFormation.getString(properties.PolicyArn));
    ret.addPropertyResult('roles', 'Roles', properties.Roles != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Roles) : undefined);
    ret.addPropertyResult('users', 'Users', properties.Users != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Users) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudgetsAction {
    /**
     * The service control policies (SCP) action definition details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-scpactiondefinition.html
     */
    export interface ScpActionDefinitionProperty {
        /**
         * The policy ID attached.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-scpactiondefinition.html#cfn-budgets-budgetsaction-scpactiondefinition-policyid
         */
        readonly policyId: string;
        /**
         * A list of target IDs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-scpactiondefinition.html#cfn-budgets-budgetsaction-scpactiondefinition-targetids
         */
        readonly targetIds: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ScpActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `ScpActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudgetsAction_ScpActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policyId', cdk.requiredValidator)(properties.policyId));
    errors.collect(cdk.propertyValidator('policyId', cdk.validateString)(properties.policyId));
    errors.collect(cdk.propertyValidator('targetIds', cdk.requiredValidator)(properties.targetIds));
    errors.collect(cdk.propertyValidator('targetIds', cdk.listValidator(cdk.validateString))(properties.targetIds));
    return errors.wrap('supplied properties not correct for "ScpActionDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.ScpActionDefinition` resource
 *
 * @param properties - the TypeScript properties of a `ScpActionDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.ScpActionDefinition` resource.
 */
// @ts-ignore TS6133
function cfnBudgetsActionScpActionDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetsAction_ScpActionDefinitionPropertyValidator(properties).assertSuccess();
    return {
        PolicyId: cdk.stringToCloudFormation(properties.policyId),
        TargetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.targetIds),
    };
}

// @ts-ignore TS6133
function CfnBudgetsActionScpActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.ScpActionDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.ScpActionDefinitionProperty>();
    ret.addPropertyResult('policyId', 'PolicyId', cfn_parse.FromCloudFormation.getString(properties.PolicyId));
    ret.addPropertyResult('targetIds', 'TargetIds', cfn_parse.FromCloudFormation.getStringArray(properties.TargetIds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudgetsAction {
    /**
     * The Amazon EC2 Systems Manager ( SSM ) action definition details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html
     */
    export interface SsmActionDefinitionProperty {
        /**
         * The EC2 and RDS instance IDs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html#cfn-budgets-budgetsaction-ssmactiondefinition-instanceids
         */
        readonly instanceIds: string[];
        /**
         * The Region to run the ( SSM ) document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html#cfn-budgets-budgetsaction-ssmactiondefinition-region
         */
        readonly region: string;
        /**
         * The action subType.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-ssmactiondefinition.html#cfn-budgets-budgetsaction-ssmactiondefinition-subtype
         */
        readonly subtype: string;
    }
}

/**
 * Determine whether the given properties match those of a `SsmActionDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `SsmActionDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudgetsAction_SsmActionDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('instanceIds', cdk.requiredValidator)(properties.instanceIds));
    errors.collect(cdk.propertyValidator('instanceIds', cdk.listValidator(cdk.validateString))(properties.instanceIds));
    errors.collect(cdk.propertyValidator('region', cdk.requiredValidator)(properties.region));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('subtype', cdk.requiredValidator)(properties.subtype));
    errors.collect(cdk.propertyValidator('subtype', cdk.validateString)(properties.subtype));
    return errors.wrap('supplied properties not correct for "SsmActionDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.SsmActionDefinition` resource
 *
 * @param properties - the TypeScript properties of a `SsmActionDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.SsmActionDefinition` resource.
 */
// @ts-ignore TS6133
function cfnBudgetsActionSsmActionDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetsAction_SsmActionDefinitionPropertyValidator(properties).assertSuccess();
    return {
        InstanceIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceIds),
        Region: cdk.stringToCloudFormation(properties.region),
        Subtype: cdk.stringToCloudFormation(properties.subtype),
    };
}

// @ts-ignore TS6133
function CfnBudgetsActionSsmActionDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.SsmActionDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.SsmActionDefinitionProperty>();
    ret.addPropertyResult('instanceIds', 'InstanceIds', cfn_parse.FromCloudFormation.getStringArray(properties.InstanceIds));
    ret.addPropertyResult('region', 'Region', cfn_parse.FromCloudFormation.getString(properties.Region));
    ret.addPropertyResult('subtype', 'Subtype', cfn_parse.FromCloudFormation.getString(properties.Subtype));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBudgetsAction {
    /**
     * The subscriber to a budget notification. The subscriber consists of a subscription type and either an Amazon SNS topic or an email address.
     *
     * For example, an email subscriber has the following parameters:
     *
     * - A `subscriptionType` of `EMAIL`
     * - An `address` of `example@example.com`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-subscriber.html
     */
    export interface SubscriberProperty {
        /**
         * The address that AWS sends budget notifications to, either an SNS topic or an email.
         *
         * When you create a subscriber, the value of `Address` can't contain line breaks.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-subscriber.html#cfn-budgets-budgetsaction-subscriber-address
         */
        readonly address: string;
        /**
         * The type of notification that AWS sends to a subscriber.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budgetsaction-subscriber.html#cfn-budgets-budgetsaction-subscriber-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubscriberProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the result of the validation.
 */
function CfnBudgetsAction_SubscriberPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('address', cdk.requiredValidator)(properties.address));
    errors.collect(cdk.propertyValidator('address', cdk.validateString)(properties.address));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "SubscriberProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.Subscriber` resource
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Budgets::BudgetsAction.Subscriber` resource.
 */
// @ts-ignore TS6133
function cfnBudgetsActionSubscriberPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBudgetsAction_SubscriberPropertyValidator(properties).assertSuccess();
    return {
        Address: cdk.stringToCloudFormation(properties.address),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnBudgetsActionSubscriberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBudgetsAction.SubscriberProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBudgetsAction.SubscriberProperty>();
    ret.addPropertyResult('address', 'Address', cfn_parse.FromCloudFormation.getString(properties.Address));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
