import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnContactFlow`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html
 */
export interface CfnContactFlowProps {
    /**
     * The content of the flow.
     *
     * For more information, see [Amazon Connect Flow language](https://docs.aws.amazon.com/connect/latest/adminguide/flow-language.html) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-content
     */
    readonly content: string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-instancearn
     */
    readonly instanceArn: string;
    /**
     * The name of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-name
     */
    readonly name: string;
    /**
     * The type of the flow. For descriptions of the available types, see [Choose a flow type](https://docs.aws.amazon.com/connect/latest/adminguide/create-contact-flow.html#contact-flow-types) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-type
     */
    readonly type: string;
    /**
     * The description of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-description
     */
    readonly description?: string;
    /**
     * The state of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-state
     */
    readonly state?: string;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::ContactFlow`
 *
 * Specifies a flow for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::ContactFlow
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html
 */
export declare class CfnContactFlow extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::ContactFlow";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactFlow;
    /**
     * `Ref` returns the Amazon Resource Name (ARN) of the flow. For example:
     *
     * `{ "Ref": "myFlowArn" }`
     * @cloudformationAttribute ContactFlowArn
     */
    readonly attrContactFlowArn: string;
    /**
     * The content of the flow.
     *
     * For more information, see [Amazon Connect Flow language](https://docs.aws.amazon.com/connect/latest/adminguide/flow-language.html) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-content
     */
    content: string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-instancearn
     */
    instanceArn: string;
    /**
     * The name of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-name
     */
    name: string;
    /**
     * The type of the flow. For descriptions of the available types, see [Choose a flow type](https://docs.aws.amazon.com/connect/latest/adminguide/create-contact-flow.html#contact-flow-types) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-type
     */
    type: string;
    /**
     * The description of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-description
     */
    description: string | undefined;
    /**
     * The state of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-state
     */
    state: string | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::ContactFlow`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactFlowProps);
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
/**
 * Properties for defining a `CfnContactFlowModule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html
 */
export interface CfnContactFlowModuleProps {
    /**
     * The content of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-content
     */
    readonly content: string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-instancearn
     */
    readonly instanceArn: string;
    /**
     * The name of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-name
     */
    readonly name: string;
    /**
     * The description of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-description
     */
    readonly description?: string;
    /**
     * The state of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-state
     */
    readonly state?: string;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::ContactFlowModule`
 *
 * Specifies a flow module for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::ContactFlowModule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html
 */
export declare class CfnContactFlowModule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::ContactFlowModule";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactFlowModule;
    /**
     * `Ref` returns the Amazon Resource Name (ARN) of the flow module. For example:
     *
     * `{ "Ref": "myFlowModuleArn" }`
     * @cloudformationAttribute ContactFlowModuleArn
     */
    readonly attrContactFlowModuleArn: string;
    /**
     *
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The content of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-content
     */
    content: string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-instancearn
     */
    instanceArn: string;
    /**
     * The name of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-name
     */
    name: string;
    /**
     * The description of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-description
     */
    description: string | undefined;
    /**
     * The state of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-state
     */
    state: string | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::ContactFlowModule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactFlowModuleProps);
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
/**
 * Properties for defining a `CfnHoursOfOperation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html
 */
export interface CfnHoursOfOperationProps {
    /**
     * Configuration information for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-config
     */
    readonly config: Array<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-instancearn
     */
    readonly instanceArn: string;
    /**
     * The name for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-name
     */
    readonly name: string;
    /**
     * The time zone for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-timezone
     */
    readonly timeZone: string;
    /**
     * The description for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-description
     */
    readonly description?: string;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::HoursOfOperation`
 *
 * Specifies hours of operation.
 *
 * @cloudformationResource AWS::Connect::HoursOfOperation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html
 */
export declare class CfnHoursOfOperation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::HoursOfOperation";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHoursOfOperation;
    /**
     * The Amazon Resource Name (ARN) for the hours of operation.
     * @cloudformationAttribute HoursOfOperationArn
     */
    readonly attrHoursOfOperationArn: string;
    /**
     * Configuration information for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-config
     */
    config: Array<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-instancearn
     */
    instanceArn: string;
    /**
     * The name for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-name
     */
    name: string;
    /**
     * The time zone for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-timezone
     */
    timeZone: string;
    /**
     * The description for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-description
     */
    description: string | undefined;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::HoursOfOperation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnHoursOfOperationProps);
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
export declare namespace CfnHoursOfOperation {
    /**
     * Contains information about the hours of operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html
     */
    interface HoursOfOperationConfigProperty {
        /**
         * The day that the hours of operation applies to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-day
         */
        readonly day: string;
        /**
         * The end time that your contact center closes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-endtime
         */
        readonly endTime: CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable;
        /**
         * The start time that your contact center opens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-starttime
         */
        readonly startTime: CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable;
    }
}
export declare namespace CfnHoursOfOperation {
    /**
     * The start time or end time for an hours of operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html
     */
    interface HoursOfOperationTimeSliceProperty {
        /**
         * The hours.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html#cfn-connect-hoursofoperation-hoursofoperationtimeslice-hours
         */
        readonly hours: number;
        /**
         * The minutes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html#cfn-connect-hoursofoperation-hoursofoperationtimeslice-minutes
         */
        readonly minutes: number;
    }
}
/**
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html
 */
export interface CfnInstanceProps {
    /**
     * A toggle for an individual feature at the instance level.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-attributes
     */
    readonly attributes: CfnInstance.AttributesProperty | cdk.IResolvable;
    /**
     * The identity management type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-identitymanagementtype
     */
    readonly identityManagementType: string;
    /**
     * The identifier for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-directoryid
     */
    readonly directoryId?: string;
    /**
     * The alias of instance. `InstanceAlias` is only required when `IdentityManagementType` is `CONNECT_MANAGED` or `SAML` . `InstanceAlias` is not required when `IdentityManagementType` is `EXISTING_DIRECTORY` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-instancealias
     */
    readonly instanceAlias?: string;
}
/**
 * A CloudFormation `AWS::Connect::Instance`
 *
 * *This is a preview release for Amazon Connect . It is subject to change.*
 *
 * Initiates an Amazon Connect instance with all the supported channels enabled. It does not attach any storage, such as Amazon Simple Storage Service (Amazon S3) or Amazon Kinesis.
 *
 * Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days. If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances. You must wait 30 days before you can restart creating and deleting instances in your account.
 *
 * @cloudformationResource AWS::Connect::Instance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html
 */
export declare class CfnInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::Instance";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * When the instance was created.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: string;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The state of the instance.
     * @cloudformationAttribute InstanceStatus
     */
    readonly attrInstanceStatus: string;
    /**
     * The service role of the instance.
     * @cloudformationAttribute ServiceRole
     */
    readonly attrServiceRole: string;
    /**
     * A toggle for an individual feature at the instance level.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-attributes
     */
    attributes: CfnInstance.AttributesProperty | cdk.IResolvable;
    /**
     * The identity management type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-identitymanagementtype
     */
    identityManagementType: string;
    /**
     * The identifier for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-directoryid
     */
    directoryId: string | undefined;
    /**
     * The alias of instance. `InstanceAlias` is only required when `IdentityManagementType` is `CONNECT_MANAGED` or `SAML` . `InstanceAlias` is not required when `IdentityManagementType` is `EXISTING_DIRECTORY` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-instancealias
     */
    instanceAlias: string | undefined;
    /**
     * Create a new `AWS::Connect::Instance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps);
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
export declare namespace CfnInstance {
    /**
     * *This is a preview release for Amazon Connect . It is subject to change.*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html
     */
    interface AttributesProperty {
        /**
         * `CfnInstance.AttributesProperty.AutoResolveBestVoices`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-autoresolvebestvoices
         */
        readonly autoResolveBestVoices?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.ContactLens`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-contactlens
         */
        readonly contactLens?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.ContactflowLogs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-contactflowlogs
         */
        readonly contactflowLogs?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.EarlyMedia`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-earlymedia
         */
        readonly earlyMedia?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.InboundCalls`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-inboundcalls
         */
        readonly inboundCalls: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.OutboundCalls`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-outboundcalls
         */
        readonly outboundCalls: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.UseCustomTTSVoices`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-usecustomttsvoices
         */
        readonly useCustomTtsVoices?: boolean | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnInstanceStorageConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html
 */
export interface CfnInstanceStorageConfigProps {
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-instancearn
     */
    readonly instanceArn: string;
    /**
     * A valid resource type. Following are the valid resource types: `CHAT_TRANSCRIPTS` | `CALL_RECORDINGS` | `SCHEDULED_REPORTS` | `MEDIA_STREAMS` | `CONTACT_TRACE_RECORDS` | `AGENT_EVENTS`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-resourcetype
     */
    readonly resourceType: string;
    /**
     * A valid storage type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-storagetype
     */
    readonly storageType: string;
    /**
     * The configuration of the Kinesis Firehose delivery stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig
     */
    readonly kinesisFirehoseConfig?: CfnInstanceStorageConfig.KinesisFirehoseConfigProperty | cdk.IResolvable;
    /**
     * The configuration of the Kinesis data stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig
     */
    readonly kinesisStreamConfig?: CfnInstanceStorageConfig.KinesisStreamConfigProperty | cdk.IResolvable;
    /**
     * The configuration of the Kinesis video stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig
     */
    readonly kinesisVideoStreamConfig?: CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty | cdk.IResolvable;
    /**
     * The S3 bucket configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-s3config
     */
    readonly s3Config?: CfnInstanceStorageConfig.S3ConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Connect::InstanceStorageConfig`
 *
 * The storage configuration for the instance.
 *
 * @cloudformationResource AWS::Connect::InstanceStorageConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html
 */
export declare class CfnInstanceStorageConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::InstanceStorageConfig";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceStorageConfig;
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     * @cloudformationAttribute AssociationId
     */
    readonly attrAssociationId: string;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-instancearn
     */
    instanceArn: string;
    /**
     * A valid resource type. Following are the valid resource types: `CHAT_TRANSCRIPTS` | `CALL_RECORDINGS` | `SCHEDULED_REPORTS` | `MEDIA_STREAMS` | `CONTACT_TRACE_RECORDS` | `AGENT_EVENTS`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-resourcetype
     */
    resourceType: string;
    /**
     * A valid storage type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-storagetype
     */
    storageType: string;
    /**
     * The configuration of the Kinesis Firehose delivery stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig
     */
    kinesisFirehoseConfig: CfnInstanceStorageConfig.KinesisFirehoseConfigProperty | cdk.IResolvable | undefined;
    /**
     * The configuration of the Kinesis data stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig
     */
    kinesisStreamConfig: CfnInstanceStorageConfig.KinesisStreamConfigProperty | cdk.IResolvable | undefined;
    /**
     * The configuration of the Kinesis video stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig
     */
    kinesisVideoStreamConfig: CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty | cdk.IResolvable | undefined;
    /**
     * The S3 bucket configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-s3config
     */
    s3Config: CfnInstanceStorageConfig.S3ConfigProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Connect::InstanceStorageConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceStorageConfigProps);
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
export declare namespace CfnInstanceStorageConfig {
    /**
     * The encryption configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html
     */
    interface EncryptionConfigProperty {
        /**
         * The type of encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html#cfn-connect-instancestorageconfig-encryptionconfig-encryptiontype
         */
        readonly encryptionType: string;
        /**
         * The full ARN of the encryption key.
         *
         * > Be sure to provide the full ARN of the encryption key, not just the ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html#cfn-connect-instancestorageconfig-encryptionconfig-keyid
         */
        readonly keyId: string;
    }
}
export declare namespace CfnInstanceStorageConfig {
    /**
     * Configuration information of a Kinesis Data Firehose delivery stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisfirehoseconfig.html
     */
    interface KinesisFirehoseConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the delivery stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisfirehoseconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig-firehosearn
         */
        readonly firehoseArn: string;
    }
}
export declare namespace CfnInstanceStorageConfig {
    /**
     * Configuration information of a Kinesis data stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisstreamconfig.html
     */
    interface KinesisStreamConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the data stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisstreamconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig-streamarn
         */
        readonly streamArn: string;
    }
}
export declare namespace CfnInstanceStorageConfig {
    /**
     * Configuration information of a Kinesis video stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html
     */
    interface KinesisVideoStreamConfigProperty {
        /**
         * The encryption configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-encryptionconfig
         */
        readonly encryptionConfig?: CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable;
        /**
         * The prefix of the video stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-prefix
         */
        readonly prefix: string;
        /**
         * The number of hours data is retained in the stream. Kinesis Video Streams retains the data in a data store that is associated with the stream.
         *
         * The default value is 0, indicating that the stream does not persist data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-retentionperiodhours
         */
        readonly retentionPeriodHours: number;
    }
}
export declare namespace CfnInstanceStorageConfig {
    /**
     * Information about the Amazon Simple Storage Service (Amazon S3) storage type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html
     */
    interface S3ConfigProperty {
        /**
         * The S3 bucket name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-bucketname
         */
        readonly bucketName: string;
        /**
         * The S3 bucket prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-bucketprefix
         */
        readonly bucketPrefix: string;
        /**
         * The Amazon S3 encryption configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-encryptionconfig
         */
        readonly encryptionConfig?: CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnPhoneNumber`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html
 */
export interface CfnPhoneNumberProps {
    /**
     * The ISO country code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-countrycode
     */
    readonly countryCode: string;
    /**
     * The Amazon Resource Name (ARN) for Amazon Connect instances or traffic distribution group that phone numbers are claimed to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-targetarn
     */
    readonly targetArn: string;
    /**
     * The type of phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-type
     */
    readonly type: string;
    /**
     * The description of the phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-description
     */
    readonly description?: string;
    /**
     * The prefix of the phone number. If provided, it must contain `+` as part of the country code.
     *
     * *Pattern* : `^\\+[0-9]{1,15}`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-prefix
     */
    readonly prefix?: string;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::PhoneNumber`
 *
 * Claims a phone number to the specified Amazon Connect instance or traffic distribution group.
 *
 * @cloudformationResource AWS::Connect::PhoneNumber
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html
 */
export declare class CfnPhoneNumber extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::PhoneNumber";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPhoneNumber;
    /**
     * The phone number, in E.164 format.
     * @cloudformationAttribute Address
     */
    readonly attrAddress: string;
    /**
     * The Amazon Resource Name (ARN) of the phone number.
     * @cloudformationAttribute PhoneNumberArn
     */
    readonly attrPhoneNumberArn: string;
    /**
     * The ISO country code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-countrycode
     */
    countryCode: string;
    /**
     * The Amazon Resource Name (ARN) for Amazon Connect instances or traffic distribution group that phone numbers are claimed to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-targetarn
     */
    targetArn: string;
    /**
     * The type of phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-type
     */
    type: string;
    /**
     * The description of the phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-description
     */
    description: string | undefined;
    /**
     * The prefix of the phone number. If provided, it must contain `+` as part of the country code.
     *
     * *Pattern* : `^\\+[0-9]{1,15}`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-prefix
     */
    prefix: string | undefined;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::PhoneNumber`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPhoneNumberProps);
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
/**
 * Properties for defining a `CfnQuickConnect`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html
 */
export interface CfnQuickConnectProps {
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-instancearn
     */
    readonly instanceArn: string;
    /**
     * The name of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-name
     */
    readonly name: string;
    /**
     * Contains information about the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-quickconnectconfig
     */
    readonly quickConnectConfig: CfnQuickConnect.QuickConnectConfigProperty | cdk.IResolvable;
    /**
     * The description of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-description
     */
    readonly description?: string;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::QuickConnect`
 *
 * Specifies a quick connect for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::QuickConnect
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html
 */
export declare class CfnQuickConnect extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::QuickConnect";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQuickConnect;
    /**
     * The Amazon Resource Name (ARN) of the quick connect.
     * @cloudformationAttribute QuickConnectArn
     */
    readonly attrQuickConnectArn: string;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-instancearn
     */
    instanceArn: string;
    /**
     * The name of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-name
     */
    name: string;
    /**
     * Contains information about the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-quickconnectconfig
     */
    quickConnectConfig: CfnQuickConnect.QuickConnectConfigProperty | cdk.IResolvable;
    /**
     * The description of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-description
     */
    description: string | undefined;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::QuickConnect`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnQuickConnectProps);
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
export declare namespace CfnQuickConnect {
    /**
     * Contains information about a phone number for a quick connect.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-phonenumberquickconnectconfig.html
     */
    interface PhoneNumberQuickConnectConfigProperty {
        /**
         * The phone number in E.164 format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-phonenumberquickconnectconfig.html#cfn-connect-quickconnect-phonenumberquickconnectconfig-phonenumber
         */
        readonly phoneNumber: string;
    }
}
export declare namespace CfnQuickConnect {
    /**
     * Contains information about a queue for a quick connect. The flow must be of type Transfer to Queue.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html
     */
    interface QueueQuickConnectConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html#cfn-connect-quickconnect-queuequickconnectconfig-contactflowarn
         */
        readonly contactFlowArn: string;
        /**
         * The Amazon Resource Name (ARN) of the queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html#cfn-connect-quickconnect-queuequickconnectconfig-queuearn
         */
        readonly queueArn: string;
    }
}
export declare namespace CfnQuickConnect {
    /**
     * Contains configuration settings for a quick connect.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html
     */
    interface QuickConnectConfigProperty {
        /**
         * The phone configuration. This is required only if QuickConnectType is PHONE_NUMBER.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-phoneconfig
         */
        readonly phoneConfig?: CfnQuickConnect.PhoneNumberQuickConnectConfigProperty | cdk.IResolvable;
        /**
         * The queue configuration. This is required only if QuickConnectType is QUEUE.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-queueconfig
         */
        readonly queueConfig?: CfnQuickConnect.QueueQuickConnectConfigProperty | cdk.IResolvable;
        /**
         * The type of quick connect. In the Amazon Connect console, when you create a quick connect, you are prompted to assign one of the following types: Agent (USER), External (PHONE_NUMBER), or Queue (QUEUE).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-quickconnecttype
         */
        readonly quickConnectType: string;
        /**
         * The user configuration. This is required only if QuickConnectType is USER.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-userconfig
         */
        readonly userConfig?: CfnQuickConnect.UserQuickConnectConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnQuickConnect {
    /**
     * Contains information about the quick connect configuration settings for a user. The contact flow must be of type Transfer to Agent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html
     */
    interface UserQuickConnectConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html#cfn-connect-quickconnect-userquickconnectconfig-contactflowarn
         */
        readonly contactFlowArn: string;
        /**
         * The Amazon Resource Name (ARN) of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html#cfn-connect-quickconnect-userquickconnectconfig-userarn
         */
        readonly userArn: string;
    }
}
/**
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html
 */
export interface CfnRuleProps {
    /**
     * A list of actions to be run when the rule is triggered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-actions
     */
    readonly actions: CfnRule.ActionsProperty | cdk.IResolvable;
    /**
     * The conditions of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-function
     */
    readonly function: string;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-instancearn
     */
    readonly instanceArn: string;
    /**
     * The name of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-name
     */
    readonly name: string;
    /**
     * The publish status of the rule.
     *
     * *Allowed values* : `DRAFT` | `PUBLISHED`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-publishstatus
     */
    readonly publishStatus: string;
    /**
     * The event source to trigger the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-triggereventsource
     */
    readonly triggerEventSource: CfnRule.RuleTriggerEventSourceProperty | cdk.IResolvable;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::Rule`
 *
 * Creates a rule for the specified Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::Rule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html
 */
export declare class CfnRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::Rule";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRule;
    /**
     * The Amazon Resource Name (ARN) of the rule.
     * @cloudformationAttribute RuleArn
     */
    readonly attrRuleArn: string;
    /**
     * A list of actions to be run when the rule is triggered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-actions
     */
    actions: CfnRule.ActionsProperty | cdk.IResolvable;
    /**
     * The conditions of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-function
     */
    function: string;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-instancearn
     */
    instanceArn: string;
    /**
     * The name of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-name
     */
    name: string;
    /**
     * The publish status of the rule.
     *
     * *Allowed values* : `DRAFT` | `PUBLISHED`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-publishstatus
     */
    publishStatus: string;
    /**
     * The event source to trigger the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-triggereventsource
     */
    triggerEventSource: CfnRule.RuleTriggerEventSourceProperty | cdk.IResolvable;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::Rule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRuleProps);
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
export declare namespace CfnRule {
    /**
     * A list of actions to be run when the rule is triggered.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html
     */
    interface ActionsProperty {
        /**
         * Information about the contact category action. The syntax can be empty, for example, `{}` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-assigncontactcategoryactions
         */
        readonly assignContactCategoryActions?: Array<any | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the EventBridge action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-eventbridgeactions
         */
        readonly eventBridgeActions?: Array<CfnRule.EventBridgeActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the send notification action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-sendnotificationactions
         */
        readonly sendNotificationActions?: Array<CfnRule.SendNotificationActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the task action. This field is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-taskactions
         */
        readonly taskActions?: Array<CfnRule.TaskActionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnRule {
    /**
     * The EventBridge action definition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-eventbridgeaction.html
     */
    interface EventBridgeActionProperty {
        /**
         * The name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-eventbridgeaction.html#cfn-connect-rule-eventbridgeaction-name
         */
        readonly name: string;
    }
}
export declare namespace CfnRule {
    /**
     * The type of notification recipient.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html
     */
    interface NotificationRecipientTypeProperty {
        /**
         * The Amazon Resource Name (ARN) of the user account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html#cfn-connect-rule-notificationrecipienttype-userarns
         */
        readonly userArns?: string[];
        /**
         * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }. Amazon Connect users with the specified tags will be notified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html#cfn-connect-rule-notificationrecipienttype-usertags
         */
        readonly userTags?: {
            [key: string]: (string);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnRule {
    /**
     * Information about the reference when the `referenceType` is `URL` . Otherwise, null. (Supports variable injection in the `Value` field.)
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html
     */
    interface ReferenceProperty {
        /**
         * The type of the reference. `DATE` must be of type Epoch timestamp.
         *
         * *Allowed values* : `URL` | `ATTACHMENT` | `NUMBER` | `STRING` | `DATE` | `EMAIL`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html#cfn-connect-rule-reference-type
         */
        readonly type: string;
        /**
         * A valid value for the reference. For example, for a URL reference, a formatted URL that is displayed to an agent in the Contact Control Panel (CCP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html#cfn-connect-rule-reference-value
         */
        readonly value: string;
    }
}
export declare namespace CfnRule {
    /**
     * The name of the event source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html
     */
    interface RuleTriggerEventSourceProperty {
        /**
         * The name of the event source.
         *
         * *Allowed values* : `OnPostCallAnalysisAvailable` | `OnRealTimeCallAnalysisAvailable` | `OnPostChatAnalysisAvailable` | `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html#cfn-connect-rule-ruletriggereventsource-eventsourcename
         */
        readonly eventSourceName: string;
        /**
         * The Amazon Resource Name (ARN) for the integration association. `IntegrationAssociationArn` is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html#cfn-connect-rule-ruletriggereventsource-integrationassociationarn
         */
        readonly integrationAssociationArn?: string;
    }
}
export declare namespace CfnRule {
    /**
     * Information about the send notification action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html
     */
    interface SendNotificationActionProperty {
        /**
         * Notification content. Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-content
         */
        readonly content: string;
        /**
         * Content type format.
         *
         * *Allowed value* : `PLAIN_TEXT`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-contenttype
         */
        readonly contentType: string;
        /**
         * Notification delivery method.
         *
         * *Allowed value* : `EMAIL`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-deliverymethod
         */
        readonly deliveryMethod: string;
        /**
         * Notification recipient.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-recipient
         */
        readonly recipient: CfnRule.NotificationRecipientTypeProperty | cdk.IResolvable;
        /**
         * The subject of the email if the delivery method is `EMAIL` . Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-subject
         */
        readonly subject?: string;
    }
}
export declare namespace CfnRule {
    /**
     * Information about the task action. This field is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html
     */
    interface TaskActionProperty {
        /**
         * The Amazon Resource Name (ARN) of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-contactflowarn
         */
        readonly contactFlowArn: string;
        /**
         * The description. Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-description
         */
        readonly description?: string;
        /**
         * The name. Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-name
         */
        readonly name: string;
        /**
         * Information about the reference when the `referenceType` is `URL` . Otherwise, null. `URL` is the only accepted type. (Supports variable injection in the `Value` field.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-references
         */
        readonly references?: {
            [key: string]: (CfnRule.ReferenceProperty | cdk.IResolvable);
        } | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnTaskTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html
 */
export interface CfnTaskTemplateProps {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-instancearn
     */
    readonly instanceArn: string;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-clienttoken
     */
    readonly clientToken?: string;
    /**
     * Constraints that are applicable to the fields listed.
     *
     * The values can be represented in either JSON or YAML format. For an example of the JSON configuration, see *Examples* at the bottom of this page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-constraints
     */
    readonly constraints?: any | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the flow that runs by default when a task is created by referencing this template. `ContactFlowArn` is not required when there is a field with `fieldType` = `QUICK_CONNECT` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-contactflowarn
     */
    readonly contactFlowArn?: string;
    /**
     * The default values for fields when a task is created by referencing this template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-defaults
     */
    readonly defaults?: Array<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The description of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-description
     */
    readonly description?: string;
    /**
     * Fields that are part of the template. A template requires at least one field that has type `Name` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-fields
     */
    readonly fields?: Array<CfnTaskTemplate.FieldProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-name
     */
    readonly name?: string;
    /**
     * The status of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-status
     */
    readonly status?: string;
    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::TaskTemplate`
 *
 * Specifies a task template for a Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::TaskTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html
 */
export declare class CfnTaskTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::TaskTemplate";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskTemplate;
    /**
     * The Amazon Resource Name (ARN) of the task template.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-instancearn
     */
    instanceArn: string;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-clienttoken
     */
    clientToken: string | undefined;
    /**
     * Constraints that are applicable to the fields listed.
     *
     * The values can be represented in either JSON or YAML format. For an example of the JSON configuration, see *Examples* at the bottom of this page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-constraints
     */
    constraints: any | cdk.IResolvable | undefined;
    /**
     * The Amazon Resource Name (ARN) of the flow that runs by default when a task is created by referencing this template. `ContactFlowArn` is not required when there is a field with `fieldType` = `QUICK_CONNECT` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-contactflowarn
     */
    contactFlowArn: string | undefined;
    /**
     * The default values for fields when a task is created by referencing this template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-defaults
     */
    defaults: Array<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The description of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-description
     */
    description: string | undefined;
    /**
     * Fields that are part of the template. A template requires at least one field that has type `Name` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-fields
     */
    fields: Array<CfnTaskTemplate.FieldProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The name of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-name
     */
    name: string | undefined;
    /**
     * The status of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-status
     */
    status: string | undefined;
    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::TaskTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTaskTemplateProps);
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
export declare namespace CfnTaskTemplate {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html
     */
    interface ConstraintsProperty {
        /**
         * `CfnTaskTemplate.ConstraintsProperty.InvisibleFields`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-invisiblefields
         */
        readonly invisibleFields?: Array<CfnTaskTemplate.InvisibleFieldInfoProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnTaskTemplate.ConstraintsProperty.ReadOnlyFields`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-readonlyfields
         */
        readonly readOnlyFields?: Array<CfnTaskTemplate.ReadOnlyFieldInfoProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnTaskTemplate.ConstraintsProperty.RequiredFields`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-requiredfields
         */
        readonly requiredFields?: Array<CfnTaskTemplate.RequiredFieldInfoProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnTaskTemplate {
    /**
     * Describes a default field and its corresponding value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html
     */
    interface DefaultFieldValueProperty {
        /**
         * Default value for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html#cfn-connect-tasktemplate-defaultfieldvalue-defaultvalue
         */
        readonly defaultValue: string;
        /**
         * Identifier of a field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html#cfn-connect-tasktemplate-defaultfieldvalue-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTaskTemplate {
    /**
     * Describes a single task template field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html
     */
    interface FieldProperty {
        /**
         * The description of the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-description
         */
        readonly description?: string;
        /**
         * The unique identifier for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
        /**
         * A list of options for a single select field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-singleselectoptions
         */
        readonly singleSelectOptions?: string[];
        /**
         * Indicates the type of field. Following are the valid field types: `NAME` `DESCRIPTION` | `SCHEDULED_TIME` | `QUICK_CONNECT` | `URL` | `NUMBER` | `TEXT` | `TEXT_AREA` | `DATE_TIME` | `BOOLEAN` | `SINGLE_SELECT` | `EMAIL`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-type
         */
        readonly type: string;
    }
}
export declare namespace CfnTaskTemplate {
    /**
     * The identifier of the task template field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-fieldidentifier.html
     */
    interface FieldIdentifierProperty {
        /**
         * The name of the task template field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-fieldidentifier.html#cfn-connect-tasktemplate-fieldidentifier-name
         */
        readonly name: string;
    }
}
export declare namespace CfnTaskTemplate {
    /**
     * A field that is invisible to an agent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-invisiblefieldinfo.html
     */
    interface InvisibleFieldInfoProperty {
        /**
         * Identifier of the invisible field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-invisiblefieldinfo.html#cfn-connect-tasktemplate-invisiblefieldinfo-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTaskTemplate {
    /**
     * Indicates a field that is read-only to an agent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-readonlyfieldinfo.html
     */
    interface ReadOnlyFieldInfoProperty {
        /**
         * Identifier of the read-only field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-readonlyfieldinfo.html#cfn-connect-tasktemplate-readonlyfieldinfo-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}
export declare namespace CfnTaskTemplate {
    /**
     * Information about a required field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-requiredfieldinfo.html
     */
    interface RequiredFieldInfoProperty {
        /**
         * The unique identifier for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-requiredfieldinfo.html#cfn-connect-tasktemplate-requiredfieldinfo-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html
 */
export interface CfnUserProps {
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-instancearn
     */
    readonly instanceArn: string;
    /**
     * Information about the phone configuration for the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-phoneconfig
     */
    readonly phoneConfig: CfnUser.UserPhoneConfigProperty | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the user's routing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-routingprofilearn
     */
    readonly routingProfileArn: string;
    /**
     * The Amazon Resource Name (ARN) of the user's security profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-securityprofilearns
     */
    readonly securityProfileArns: string[];
    /**
     * The user name assigned to the user account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-username
     */
    readonly username: string;
    /**
     * The identifier of the user account in the directory used for identity management.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-directoryuserid
     */
    readonly directoryUserId?: string;
    /**
     * The Amazon Resource Name (ARN) of the user's hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-hierarchygrouparn
     */
    readonly hierarchyGroupArn?: string;
    /**
     * Information about the user identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-identityinfo
     */
    readonly identityInfo?: CfnUser.UserIdentityInfoProperty | cdk.IResolvable;
    /**
     * The user's password.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-password
     */
    readonly password?: string;
    /**
     * The tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Connect::User`
 *
 * Specifies a user account for an Amazon Connect instance.
 *
 * For information about how to create user accounts using the Amazon Connect console, see [Add Users](https://docs.aws.amazon.com/connect/latest/adminguide/user-management.html) in the *Amazon Connect Administrator Guide* .
 *
 * @cloudformationResource AWS::Connect::User
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html
 */
export declare class CfnUser extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::User";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUser;
    /**
     * The Amazon Resource Name (ARN) of the user.
     * @cloudformationAttribute UserArn
     */
    readonly attrUserArn: string;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-instancearn
     */
    instanceArn: string;
    /**
     * Information about the phone configuration for the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-phoneconfig
     */
    phoneConfig: CfnUser.UserPhoneConfigProperty | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the user's routing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-routingprofilearn
     */
    routingProfileArn: string;
    /**
     * The Amazon Resource Name (ARN) of the user's security profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-securityprofilearns
     */
    securityProfileArns: string[];
    /**
     * The user name assigned to the user account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-username
     */
    username: string;
    /**
     * The identifier of the user account in the directory used for identity management.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-directoryuserid
     */
    directoryUserId: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the user's hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-hierarchygrouparn
     */
    hierarchyGroupArn: string | undefined;
    /**
     * Information about the user identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-identityinfo
     */
    identityInfo: CfnUser.UserIdentityInfoProperty | cdk.IResolvable | undefined;
    /**
     * The user's password.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-password
     */
    password: string | undefined;
    /**
     * The tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Connect::User`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserProps);
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
export declare namespace CfnUser {
    /**
     * Contains information about the identity of a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html
     */
    interface UserIdentityInfoProperty {
        /**
         * The email address. If you are using SAML for identity management and include this parameter, an error is returned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-email
         */
        readonly email?: string;
        /**
         * The first name. This is required if you are using Amazon Connect or SAML for identity management.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-firstname
         */
        readonly firstName?: string;
        /**
         * The last name. This is required if you are using Amazon Connect or SAML for identity management.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-lastname
         */
        readonly lastName?: string;
        /**
         * The user's mobile number.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-mobile
         */
        readonly mobile?: string;
        /**
         * The user's secondary email address. If you provide a secondary email, the user receives email notifications -- other than password reset notifications -- to this email address instead of to their primary email address.
         *
         * *Pattern* : `(?=^.{0,265}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-secondaryemail
         */
        readonly secondaryEmail?: string;
    }
}
export declare namespace CfnUser {
    /**
     * Contains information about the phone configuration settings for a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html
     */
    interface UserPhoneConfigProperty {
        /**
         * The After Call Work (ACW) timeout setting, in seconds.
         *
         * > When returned by a `SearchUsers` call, `AfterContactWorkTimeLimit` is returned in milliseconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-aftercontactworktimelimit
         */
        readonly afterContactWorkTimeLimit?: number;
        /**
         * The Auto accept setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-autoaccept
         */
        readonly autoAccept?: boolean | cdk.IResolvable;
        /**
         * The phone number for the user's desk phone.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-deskphonenumber
         */
        readonly deskPhoneNumber?: string;
        /**
         * The phone type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-phonetype
         */
        readonly phoneType: string;
    }
}
/**
 * Properties for defining a `CfnUserHierarchyGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html
 */
export interface CfnUserHierarchyGroupProps {
    /**
     * The Amazon Resource Name (ARN) of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-instancearn
     */
    readonly instanceArn: string;
    /**
     * The name of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-name
     */
    readonly name: string;
    /**
     * The Amazon Resource Name (ARN) of the parent group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-parentgrouparn
     */
    readonly parentGroupArn?: string;
}
/**
 * A CloudFormation `AWS::Connect::UserHierarchyGroup`
 *
 * Specifies a new user hierarchy group.
 *
 * @cloudformationResource AWS::Connect::UserHierarchyGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html
 */
export declare class CfnUserHierarchyGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::UserHierarchyGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserHierarchyGroup;
    /**
     * The Amazon Resource Name (ARN) for the user hierarchy group.
     * @cloudformationAttribute UserHierarchyGroupArn
     */
    readonly attrUserHierarchyGroupArn: string;
    /**
     * The Amazon Resource Name (ARN) of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-instancearn
     */
    instanceArn: string;
    /**
     * The name of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-name
     */
    name: string;
    /**
     * The Amazon Resource Name (ARN) of the parent group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-parentgrouparn
     */
    parentGroupArn: string | undefined;
    /**
     * Create a new `AWS::Connect::UserHierarchyGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserHierarchyGroupProps);
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
