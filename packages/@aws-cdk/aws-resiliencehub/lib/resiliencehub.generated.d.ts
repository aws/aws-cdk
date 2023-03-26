import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html
 */
export interface CfnAppProps {
    /**
     * A string containing a full Resilience Hub app template body.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-apptemplatebody
     */
    readonly appTemplateBody: string;
    /**
     * The name for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-name
     */
    readonly name: string;
    /**
     * An array of ResourceMapping objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resourcemappings
     */
    readonly resourceMappings: Array<CfnApp.ResourceMappingProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Assessment execution schedule with 'Daily' or 'Disabled' values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-appassessmentschedule
     */
    readonly appAssessmentSchedule?: string;
    /**
     * The optional description for an app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-description
     */
    readonly description?: string;
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resiliencypolicyarn
     */
    readonly resiliencyPolicyArn?: string;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::ResilienceHub::App`
 *
 * Creates a Resilience Hub application. A Resilience Hub application is a collection of AWS resources structured to prevent and recover AWS application disruptions. To describe a Resilience Hub application, you provide an application name, resources from one or more–up to five– AWS CloudFormation stacks, and an appropriate resiliency policy.
 *
 * After you create a Resilience Hub application, you publish it so that you can run a resiliency assessment on it. You can then use recommendations from the assessment to improve resiliency by running another assessment, comparing results, and then iterating the process until you achieve your goals for recovery time objective (RTO) and recovery point objective (RPO).
 *
 * @cloudformationResource AWS::ResilienceHub::App
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html
 */
export declare class CfnApp extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ResilienceHub::App";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp;
    /**
     * The Amazon Resource Name (ARN) of the app.
     * @cloudformationAttribute AppArn
     */
    readonly attrAppArn: string;
    /**
     * A string containing a full Resilience Hub app template body.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-apptemplatebody
     */
    appTemplateBody: string;
    /**
     * The name for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-name
     */
    name: string;
    /**
     * An array of ResourceMapping objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resourcemappings
     */
    resourceMappings: Array<CfnApp.ResourceMappingProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Assessment execution schedule with 'Daily' or 'Disabled' values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-appassessmentschedule
     */
    appAssessmentSchedule: string | undefined;
    /**
     * The optional description for an app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-description
     */
    description: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resiliencypolicyarn
     */
    resiliencyPolicyArn: string | undefined;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ResilienceHub::App`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAppProps);
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
export declare namespace CfnApp {
    /**
     * Defines a physical resource identifier.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html
     */
    interface PhysicalResourceIdProperty {
        /**
         * The AWS account that owns the physical resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-awsaccountid
         */
        readonly awsAccountId?: string;
        /**
         * The AWS Region that the physical resource is located in.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-awsregion
         */
        readonly awsRegion?: string;
        /**
         * The identifier of the physical resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-identifier
         */
        readonly identifier: string;
        /**
         * Specifies the type of physical resource identifier.
         *
         * - **Arn** - The resource identifier is an Amazon Resource Name (ARN) .
         * - **Native** - The resource identifier is a Resilience Hub-native identifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-type
         */
        readonly type: string;
    }
}
export declare namespace CfnApp {
    /**
     * Defines a resource mapping.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html
     */
    interface ResourceMappingProperty {
        /**
         * The name of the CloudFormation stack this resource is mapped to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-logicalstackname
         */
        readonly logicalStackName?: string;
        /**
         * Specifies the type of resource mapping.
         *
         * Valid Values: CfnStack | Resource | AppRegistryApp | ResourceGroup | Terraform
         *
         * - **AppRegistryApp** - The resource is mapped to another application. The name of the application is contained in the `appRegistryAppName` property.
         * - **CfnStack** - The resource is mapped to a CloudFormation stack. The name of the CloudFormation stack is contained in the `logicalStackName` property.
         * - **Resource** - The resource is mapped to another resource. The name of the resource is contained in the `resourceName` property.
         * - **ResourceGroup** - The resource is mapped to a resource group. The name of the resource group is contained in the `resourceGroupName` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-mappingtype
         */
        readonly mappingType: string;
        /**
         * The identifier of this resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-physicalresourceid
         */
        readonly physicalResourceId: CfnApp.PhysicalResourceIdProperty | cdk.IResolvable;
        /**
         * The name of the resource this resource is mapped to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-resourcename
         */
        readonly resourceName?: string;
        /**
         * The short name of the Terraform source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-terraformsourcename
         */
        readonly terraformSourceName?: string;
    }
}
/**
 * Properties for defining a `CfnResiliencyPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html
 */
export interface CfnResiliencyPolicyProps {
    /**
     * The resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policy
     */
    readonly policy: {
        [key: string]: (CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The name of the policy
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policyname
     */
    readonly policyName: string;
    /**
     * The tier for this resiliency policy, ranging from the highest severity ( `MissionCritical` ) to lowest ( `NonCritical` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tier
     */
    readonly tier: string;
    /**
     * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-datalocationconstraint
     */
    readonly dataLocationConstraint?: string;
    /**
     * The description for the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policydescription
     */
    readonly policyDescription?: string;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::ResilienceHub::ResiliencyPolicy`
 *
 * Defines a resiliency policy.
 *
 * @cloudformationResource AWS::ResilienceHub::ResiliencyPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html
 */
export declare class CfnResiliencyPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ResilienceHub::ResiliencyPolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResiliencyPolicy;
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy.
     * @cloudformationAttribute PolicyArn
     */
    readonly attrPolicyArn: string;
    /**
     * The resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policy
     */
    policy: {
        [key: string]: (CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The name of the policy
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policyname
     */
    policyName: string;
    /**
     * The tier for this resiliency policy, ranging from the highest severity ( `MissionCritical` ) to lowest ( `NonCritical` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tier
     */
    tier: string;
    /**
     * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-datalocationconstraint
     */
    dataLocationConstraint: string | undefined;
    /**
     * The description for the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policydescription
     */
    policyDescription: string | undefined;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ResilienceHub::ResiliencyPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResiliencyPolicyProps);
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
export declare namespace CfnResiliencyPolicy {
    /**
     * Defines a failure policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html
     */
    interface FailurePolicyProperty {
        /**
         * The Recovery Point Objective (RPO), in seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html#cfn-resiliencehub-resiliencypolicy-failurepolicy-rpoinsecs
         */
        readonly rpoInSecs: number;
        /**
         * The Recovery Time Objective (RTO), in seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html#cfn-resiliencehub-resiliencypolicy-failurepolicy-rtoinsecs
         */
        readonly rtoInSecs: number;
    }
}
