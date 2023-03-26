import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnExecutionPlan`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html
 */
export interface CfnExecutionPlanProps {
    /**
     * `AWS::KendraRanking::ExecutionPlan.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-name
     */
    readonly name: string;
    /**
     * `AWS::KendraRanking::ExecutionPlan.CapacityUnits`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-capacityunits
     */
    readonly capacityUnits?: CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable;
    /**
     * `AWS::KendraRanking::ExecutionPlan.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-description
     */
    readonly description?: string;
    /**
     * `AWS::KendraRanking::ExecutionPlan.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::KendraRanking::ExecutionPlan`
 *
 *
 *
 * @cloudformationResource AWS::KendraRanking::ExecutionPlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html
 */
export declare class CfnExecutionPlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KendraRanking::ExecutionPlan";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExecutionPlan;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * `AWS::KendraRanking::ExecutionPlan.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-name
     */
    name: string;
    /**
     * `AWS::KendraRanking::ExecutionPlan.CapacityUnits`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-capacityunits
     */
    capacityUnits: CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::KendraRanking::ExecutionPlan.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-description
     */
    description: string | undefined;
    /**
     * `AWS::KendraRanking::ExecutionPlan.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::KendraRanking::ExecutionPlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnExecutionPlanProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnExecutionPlan {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendraranking-executionplan-capacityunitsconfiguration.html
     */
    interface CapacityUnitsConfigurationProperty {
        /**
         * `CfnExecutionPlan.CapacityUnitsConfigurationProperty.RescoreCapacityUnits`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendraranking-executionplan-capacityunitsconfiguration.html#cfn-kendraranking-executionplan-capacityunitsconfiguration-rescorecapacityunits
         */
        readonly rescoreCapacityUnits: number;
    }
}
