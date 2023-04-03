import * as constructs from 'constructs';
import * as cdk from '.';
import * as cfn_parse from './helpers-internal';
/**
 * Properties for defining a `CfnCustomResource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html
 */
export interface CfnCustomResourceProps {
    /**
     * > Only one property is defined by AWS for a custom resource: `ServiceToken` . All other properties are defined by the service provider.
     *
     * The service token that was given to the template developer by the service provider to access the service, such as an Amazon SNS topic ARN or Lambda function ARN. The service token must be from the same Region in which you are creating the stack.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html#cfn-customresource-servicetoken
     */
    readonly serviceToken: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::CustomResource`
 *
 * In a CloudFormation template, you use the `AWS::CloudFormation::CustomResource` or `Custom:: *String*` resource type to specify custom resources.
 *
 * Custom resources provide a way for you to write custom provisioning logic in CloudFormation template and have CloudFormation run it during a stack operation, such as when you create, update or delete a stack. For more information, see [Custom resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) .
 *
 * > If you use the [VPC endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html) feature, custom resources in the VPC must have access to CloudFormation -specific Amazon Simple Storage Service ( Amazon S3 ) buckets. Custom resources must send responses to a presigned Amazon S3 URL. If they can't send responses to Amazon S3 , CloudFormation won't receive a response and the stack operation fails. For more information, see [Setting up VPC endpoints for AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-vpce-bucketnames.html) .
 *
 * @cloudformationResource AWS::CloudFormation::CustomResource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html
 */
export declare class CfnCustomResource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::CustomResource";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomResource;
    /**
     * > Only one property is defined by AWS for a custom resource: `ServiceToken` . All other properties are defined by the service provider.
     *
     * The service token that was given to the template developer by the service provider to access the service, such as an Amazon SNS topic ARN or Lambda function ARN. The service token must be from the same Region in which you are creating the stack.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html#cfn-customresource-servicetoken
     */
    serviceToken: string;
    /**
     * Create a new `AWS::CloudFormation::CustomResource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomResourceProps);
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
 * Properties for defining a `CfnHookDefaultVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html
 */
export interface CfnHookDefaultVersionProps {
    /**
     * The name of the hook.
     *
     * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-typename
     */
    readonly typeName?: string;
    /**
     * The version ID of the type configuration.
     *
     * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-typeversionarn
     */
    readonly typeVersionArn?: string;
    /**
     * The version ID of the type specified.
     *
     * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-versionid
     */
    readonly versionId?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::HookDefaultVersion`
 *
 * The `HookDefaultVersion` resource specifies the default version of the hook. The default version of the hook is used in CloudFormation operations for this AWS account and AWS Region .
 *
 * @cloudformationResource AWS::CloudFormation::HookDefaultVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html
 */
export declare class CfnHookDefaultVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::HookDefaultVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHookDefaultVersion;
    /**
     * The Amazon Resource Number (ARN) of the activated extension, in this account and Region.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the hook.
     *
     * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-typename
     */
    typeName: string | undefined;
    /**
     * The version ID of the type configuration.
     *
     * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-typeversionarn
     */
    typeVersionArn: string | undefined;
    /**
     * The version ID of the type specified.
     *
     * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-versionid
     */
    versionId: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::HookDefaultVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnHookDefaultVersionProps);
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
 * Properties for defining a `CfnHookTypeConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html
 */
export interface CfnHookTypeConfigProps {
    /**
     * Specifies the activated hook type configuration, in this AWS account and AWS Region .
     *
     * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-configuration
     */
    readonly configuration: string;
    /**
     * Specifies the activated hook type configuration, in this AWS account and AWS Region .
     *
     * Defaults to `default` alias. Hook types currently support default configuration alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-configurationalias
     */
    readonly configurationAlias?: string;
    /**
     * The Amazon Resource Number (ARN) for the hook to set `Configuration` for.
     *
     * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-typearn
     */
    readonly typeArn?: string;
    /**
     * The unique name for your hook. Specifies a three-part namespace for your hook, with a recommended pattern of `Organization::Service::Hook` .
     *
     * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-typename
     */
    readonly typeName?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::HookTypeConfig`
 *
 * The `HookTypeConfig` resource specifies the configuration of a hook.
 *
 * @cloudformationResource AWS::CloudFormation::HookTypeConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html
 */
export declare class CfnHookTypeConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::HookTypeConfig";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHookTypeConfig;
    /**
     * The Amazon Resource Number (ARN) of the activated hook type configuration, in this account and Region.
     * @cloudformationAttribute ConfigurationArn
     */
    readonly attrConfigurationArn: string;
    /**
     * Specifies the activated hook type configuration, in this AWS account and AWS Region .
     *
     * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-configuration
     */
    configuration: string;
    /**
     * Specifies the activated hook type configuration, in this AWS account and AWS Region .
     *
     * Defaults to `default` alias. Hook types currently support default configuration alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-configurationalias
     */
    configurationAlias: string | undefined;
    /**
     * The Amazon Resource Number (ARN) for the hook to set `Configuration` for.
     *
     * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-typearn
     */
    typeArn: string | undefined;
    /**
     * The unique name for your hook. Specifies a three-part namespace for your hook, with a recommended pattern of `Organization::Service::Hook` .
     *
     * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-typename
     */
    typeName: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::HookTypeConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnHookTypeConfigProps);
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
 * Properties for defining a `CfnHookVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html
 */
export interface CfnHookVersionProps {
    /**
     * A URL to the Amazon S3 bucket containing the hook project package that contains the necessary files for the hook you want to register.
     *
     * For information on generating a schema handler package for the resource you want to register, see [submit](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-cli-submit.html) in the *CloudFormation CLI User Guide for Extension Development* .
     *
     * > The user registering the resource must be able to access the package in the S3 bucket. That's, the user must have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the schema handler package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-schemahandlerpackage
     */
    readonly schemaHandlerPackage: string;
    /**
     * The unique name for your hook. Specifies a three-part namespace for your hook, with a recommended pattern of `Organization::Service::Hook` .
     *
     * > The following organization namespaces are reserved and can't be used in your hook type names:
     * >
     * > - `Alexa`
     * > - `AMZN`
     * > - `Amazon`
     * > - `ASK`
     * > - `AWS`
     * > - `Custom`
     * > - `Dev`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-typename
     */
    readonly typeName: string;
    /**
     * The Amazon Resource Name (ARN) of the task execution role that grants the hook permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-executionrolearn
     */
    readonly executionRoleArn?: string;
    /**
     * Contains logging configuration information for an extension.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-loggingconfig
     */
    readonly loggingConfig?: CfnHookVersion.LoggingConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFormation::HookVersion`
 *
 * The `HookVersion` resource publishes new or first hook version to the AWS CloudFormation registry.
 *
 * @cloudformationResource AWS::CloudFormation::HookVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html
 */
export declare class CfnHookVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::HookVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHookVersion;
    /**
     * The Amazon Resource Name (ARN) of the hook.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Whether the specified hook version is set as the default version.
     * @cloudformationAttribute IsDefaultVersion
     */
    readonly attrIsDefaultVersion: cdk.IResolvable;
    /**
     * The Amazon Resource Number (ARN) assigned to this version of the hook.
     * @cloudformationAttribute TypeArn
     */
    readonly attrTypeArn: string;
    /**
     * The ID of this version of the hook.
     * @cloudformationAttribute VersionId
     */
    readonly attrVersionId: string;
    /**
     * The scope at which the resource is visible and usable in CloudFormation operations.
     *
     * Valid values include:
     *
     * - `PRIVATE` : The resource is only visible and usable within the account in which it's registered. CloudFormation marks any resources you register as `PRIVATE` .
     * - `PUBLIC` : The resource is publicly visible and usable within any Amazon account.
     * @cloudformationAttribute Visibility
     */
    readonly attrVisibility: string;
    /**
     * A URL to the Amazon S3 bucket containing the hook project package that contains the necessary files for the hook you want to register.
     *
     * For information on generating a schema handler package for the resource you want to register, see [submit](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-cli-submit.html) in the *CloudFormation CLI User Guide for Extension Development* .
     *
     * > The user registering the resource must be able to access the package in the S3 bucket. That's, the user must have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the schema handler package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-schemahandlerpackage
     */
    schemaHandlerPackage: string;
    /**
     * The unique name for your hook. Specifies a three-part namespace for your hook, with a recommended pattern of `Organization::Service::Hook` .
     *
     * > The following organization namespaces are reserved and can't be used in your hook type names:
     * >
     * > - `Alexa`
     * > - `AMZN`
     * > - `Amazon`
     * > - `ASK`
     * > - `AWS`
     * > - `Custom`
     * > - `Dev`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-typename
     */
    typeName: string;
    /**
     * The Amazon Resource Name (ARN) of the task execution role that grants the hook permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-executionrolearn
     */
    executionRoleArn: string | undefined;
    /**
     * Contains logging configuration information for an extension.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-loggingconfig
     */
    loggingConfig: CfnHookVersion.LoggingConfigProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::CloudFormation::HookVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnHookVersionProps);
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
export declare namespace CfnHookVersion {
    /**
     * The `LoggingConfig` property type specifies logging configuration information for an extension.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-hookversion-loggingconfig.html
     */
    interface LoggingConfigProperty {
        /**
         * The Amazon CloudWatch Logs group to which CloudFormation sends error logging information when invoking the extension's handlers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-hookversion-loggingconfig.html#cfn-cloudformation-hookversion-loggingconfig-loggroupname
         */
        readonly logGroupName?: string;
        /**
         * The Amazon Resource Name (ARN) of the role that CloudFormation should assume when sending log entries to CloudWatch Logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-hookversion-loggingconfig.html#cfn-cloudformation-hookversion-loggingconfig-logrolearn
         */
        readonly logRoleArn?: string;
    }
}
/**
 * Properties for defining a `CfnMacro`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html
 */
export interface CfnMacroProps {
    /**
     * The Amazon Resource Name (ARN) of the underlying AWS Lambda function that you want AWS CloudFormation to invoke when the macro is run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-functionname
     */
    readonly functionName: string;
    /**
     * The name of the macro. The name of the macro must be unique across all macros in the account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-name
     */
    readonly name: string;
    /**
     * A description of the macro.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-description
     */
    readonly description?: string;
    /**
     * The CloudWatch Logs group to which AWS CloudFormation sends error logging information when invoking the macro's underlying AWS Lambda function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-loggroupname
     */
    readonly logGroupName?: string;
    /**
     * The ARN of the role AWS CloudFormation should assume when sending log entries to CloudWatch Logs .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-logrolearn
     */
    readonly logRoleArn?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::Macro`
 *
 * The `AWS::CloudFormation::Macro` resource is a CloudFormation resource type that creates a CloudFormation macro to perform custom processing on CloudFormation templates. For more information, see [Using AWS CloudFormation macros to perform custom processing on templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html) .
 *
 * @cloudformationResource AWS::CloudFormation::Macro
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html
 */
export declare class CfnMacro extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::Macro";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMacro;
    /**
     * The Amazon Resource Name (ARN) of the underlying AWS Lambda function that you want AWS CloudFormation to invoke when the macro is run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-functionname
     */
    functionName: string;
    /**
     * The name of the macro. The name of the macro must be unique across all macros in the account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-name
     */
    name: string;
    /**
     * A description of the macro.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-description
     */
    description: string | undefined;
    /**
     * The CloudWatch Logs group to which AWS CloudFormation sends error logging information when invoking the macro's underlying AWS Lambda function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-loggroupname
     */
    logGroupName: string | undefined;
    /**
     * The ARN of the role AWS CloudFormation should assume when sending log entries to CloudWatch Logs .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-logrolearn
     */
    logRoleArn: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::Macro`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMacroProps);
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
 * Properties for defining a `CfnModuleDefaultVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html
 */
export interface CfnModuleDefaultVersionProps {
    /**
     * The Amazon Resource Name (ARN) of the module version to set as the default version.
     *
     * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-arn
     */
    readonly arn?: string;
    /**
     * The name of the module.
     *
     * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-modulename
     */
    readonly moduleName?: string;
    /**
     * The ID for the specific version of the module.
     *
     * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-versionid
     */
    readonly versionId?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::ModuleDefaultVersion`
 *
 * Specifies the default version of a module. The default version of the module will be used in CloudFormation operations for this account and Region.
 *
 * To register a module version, use the `[AWS::CloudFormation::ModuleVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html)` resource.
 *
 * For more information using modules, see [Using modules to encapsulate and reuse resource configurations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/modules.html) and [Registering extensions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry.html#registry-register) in the *CloudFormation User Guide* . For information on developing modules, see [Developing modules](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/modules.html) in the *CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::ModuleDefaultVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html
 */
export declare class CfnModuleDefaultVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::ModuleDefaultVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModuleDefaultVersion;
    /**
     * The Amazon Resource Name (ARN) of the module version to set as the default version.
     *
     * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-arn
     */
    arn: string | undefined;
    /**
     * The name of the module.
     *
     * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-modulename
     */
    moduleName: string | undefined;
    /**
     * The ID for the specific version of the module.
     *
     * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-versionid
     */
    versionId: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::ModuleDefaultVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnModuleDefaultVersionProps);
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
 * Properties for defining a `CfnModuleVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html
 */
export interface CfnModuleVersionProps {
    /**
     * The name of the module being registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html#cfn-cloudformation-moduleversion-modulename
     */
    readonly moduleName: string;
    /**
     * A URL to the S3 bucket containing the package that contains the template fragment and schema files for the module version to register.
     *
     * > The user registering the module version must be able to access the module package in the S3 bucket. That's, the user needs to have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html#cfn-cloudformation-moduleversion-modulepackage
     */
    readonly modulePackage: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::ModuleVersion`
 *
 * Registers the specified version of the module with the CloudFormation service. Registering a module makes it available for use in CloudFormation templates in your AWS account and Region.
 *
 * To specify a module version as the default version, use the `[AWS::CloudFormation::ModuleDefaultVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html)` resource.
 *
 * For more information using modules, see [Using modules to encapsulate and reuse resource configurations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/modules.html) and [Registering extensions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry.html#registry-register) in the *CloudFormation User Guide* . For information on developing modules, see [Developing modules](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/modules.html) in the *CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::ModuleVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html
 */
export declare class CfnModuleVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::ModuleVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModuleVersion;
    /**
     * The Amazon Resource Name (ARN) of the module.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The description of the module.
     * @cloudformationAttribute Description
     */
    readonly attrDescription: string;
    /**
     * The URL of a page providing detailed documentation for this module.
     * @cloudformationAttribute DocumentationUrl
     */
    readonly attrDocumentationUrl: string;
    /**
     * Whether the specified module version is set as the default version.
     * @cloudformationAttribute IsDefaultVersion
     */
    readonly attrIsDefaultVersion: cdk.IResolvable;
    /**
     * The schema that defines the module.
     * @cloudformationAttribute Schema
     */
    readonly attrSchema: string;
    /**
     * When the specified module version was registered.
     * @cloudformationAttribute TimeCreated
     */
    readonly attrTimeCreated: string;
    /**
     * The ID of this version of the module.
     * @cloudformationAttribute VersionId
     */
    readonly attrVersionId: string;
    /**
     * The scope at which the module is visible and usable in CloudFormation operations.
     *
     * Valid values include:
     *
     * - `PRIVATE` : The module is only visible and usable within the account in which it's registered.
     * - `PUBLIC` : The module is publicly visible and usable within any Amazon account.
     * @cloudformationAttribute Visibility
     */
    readonly attrVisibility: string;
    /**
     * The name of the module being registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html#cfn-cloudformation-moduleversion-modulename
     */
    moduleName: string;
    /**
     * A URL to the S3 bucket containing the package that contains the template fragment and schema files for the module version to register.
     *
     * > The user registering the module version must be able to access the module package in the S3 bucket. That's, the user needs to have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html#cfn-cloudformation-moduleversion-modulepackage
     */
    modulePackage: string;
    /**
     * Create a new `AWS::CloudFormation::ModuleVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnModuleVersionProps);
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
 * Properties for defining a `CfnPublicTypeVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html
 */
export interface CfnPublicTypeVersionProps {
    /**
     * The Amazon Resource Number (ARN) of the extension.
     *
     * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-arn
     */
    readonly arn?: string;
    /**
     * The S3 bucket to which CloudFormation delivers the contract test execution logs.
     *
     * CloudFormation delivers the logs by the time contract testing has completed and the extension has been assigned a test type status of `PASSED` or `FAILED` .
     *
     * The user initiating the stack operation must be able to access items in the specified S3 bucket. Specifically, the user needs the following permissions:
     *
     * - GetObject
     * - PutObject
     *
     * For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-logdeliverybucket
     */
    readonly logDeliveryBucket?: string;
    /**
     * The version number to assign to this version of the extension.
     *
     * Use the following format, and adhere to semantic versioning when assigning a version number to your extension:
     *
     * `MAJOR.MINOR.PATCH`
     *
     * For more information, see [Semantic Versioning 2.0.0](https://docs.aws.amazon.com/https://semver.org/) .
     *
     * If you don't specify a version number, CloudFormation increments the version number by one minor version release.
     *
     * You cannot specify a version number the first time you publish a type. AWS CloudFormation automatically sets the first version number to be `1.0.0` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-publicversionnumber
     */
    readonly publicVersionNumber?: string;
    /**
     * The type of the extension to test.
     *
     * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-type
     */
    readonly type?: string;
    /**
     * The name of the extension to test.
     *
     * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-typename
     */
    readonly typeName?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::PublicTypeVersion`
 *
 * Tests and publishes a registered extension as a public, third-party extension.
 *
 * CloudFormation first tests the extension to make sure it meets all necessary requirements for being published in the CloudFormation registry. If it does, CloudFormation then publishes it to the registry as a public third-party extension in this Region. Public extensions are available for use by all CloudFormation users.
 *
 * - For resource types, testing includes passing all contracts tests defined for the type.
 * - For modules, testing includes determining if the module's model meets all necessary requirements.
 *
 * For more information, see [Testing your public extension prior to publishing](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/publish-extension.html#publish-extension-testing) in the *CloudFormation CLI User Guide* .
 *
 * If you don't specify a version, CloudFormation uses the default version of the extension in your account and Region for testing.
 *
 * To perform testing, CloudFormation assumes the execution role specified when the type was registered.
 *
 * An extension must have a test status of `PASSED` before it can be published. For more information, see [Publishing extensions to make them available for public use](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-publish.html) in the *CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::PublicTypeVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html
 */
export declare class CfnPublicTypeVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::PublicTypeVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublicTypeVersion;
    /**
     * The Amazon Resource Number (ARN) assigned to the public extension upon publication.
     * @cloudformationAttribute PublicTypeArn
     */
    readonly attrPublicTypeArn: string;
    /**
     * The publisher ID of the extension publisher.
     * @cloudformationAttribute PublisherId
     */
    readonly attrPublisherId: string;
    /**
     * The Amazon Resource Number (ARN) assigned to this version of the extension.
     * @cloudformationAttribute TypeVersionArn
     */
    readonly attrTypeVersionArn: string;
    /**
     * The Amazon Resource Number (ARN) of the extension.
     *
     * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-arn
     */
    arn: string | undefined;
    /**
     * The S3 bucket to which CloudFormation delivers the contract test execution logs.
     *
     * CloudFormation delivers the logs by the time contract testing has completed and the extension has been assigned a test type status of `PASSED` or `FAILED` .
     *
     * The user initiating the stack operation must be able to access items in the specified S3 bucket. Specifically, the user needs the following permissions:
     *
     * - GetObject
     * - PutObject
     *
     * For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-logdeliverybucket
     */
    logDeliveryBucket: string | undefined;
    /**
     * The version number to assign to this version of the extension.
     *
     * Use the following format, and adhere to semantic versioning when assigning a version number to your extension:
     *
     * `MAJOR.MINOR.PATCH`
     *
     * For more information, see [Semantic Versioning 2.0.0](https://docs.aws.amazon.com/https://semver.org/) .
     *
     * If you don't specify a version number, CloudFormation increments the version number by one minor version release.
     *
     * You cannot specify a version number the first time you publish a type. AWS CloudFormation automatically sets the first version number to be `1.0.0` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-publicversionnumber
     */
    publicVersionNumber: string | undefined;
    /**
     * The type of the extension to test.
     *
     * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-type
     */
    type: string | undefined;
    /**
     * The name of the extension to test.
     *
     * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-typename
     */
    typeName: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::PublicTypeVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnPublicTypeVersionProps);
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
 * Properties for defining a `CfnPublisher`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html
 */
export interface CfnPublisherProps {
    /**
     * Whether you accept the [Terms and Conditions](https://docs.aws.amazon.com/https://cloudformation-registry-documents.s3.amazonaws.com/Terms_and_Conditions_for_AWS_CloudFormation_Registry_Publishers.pdf) for publishing extensions in the CloudFormation registry. You must accept the terms and conditions in order to register to publish public extensions to the CloudFormation registry.
     *
     * The default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html#cfn-cloudformation-publisher-accepttermsandconditions
     */
    readonly acceptTermsAndConditions: boolean | cdk.IResolvable;
    /**
     * If you are using a Bitbucket or GitHub account for identity verification, the Amazon Resource Name (ARN) for your connection to that account.
     *
     * For more information, see [Registering your account to publish CloudFormation extensions](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/publish-extension.html#publish-extension-prereqs) in the *CloudFormation CLI User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html#cfn-cloudformation-publisher-connectionarn
     */
    readonly connectionArn?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::Publisher`
 *
 * Registers your account as a publisher of public extensions in the CloudFormation registry. Public extensions are available for use by all CloudFormation users.
 *
 * For information on requirements for registering as a public extension publisher, see [Registering your account to publish CloudFormation extensions](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/publish-extension.html#publish-extension-prereqs) in the *CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::Publisher
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html
 */
export declare class CfnPublisher extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::Publisher";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublisher;
    /**
     * The type of account used as the identity provider when registering this publisher with CloudFormation .
     *
     * Values include: `AWS_Marketplace` | `Bitbucket` | `GitHub` .
     * @cloudformationAttribute IdentityProvider
     */
    readonly attrIdentityProvider: string;
    /**
     * The ID of the extension publisher. This publisher ID applies to your account in all AWS Regions .
     * @cloudformationAttribute PublisherId
     */
    readonly attrPublisherId: string;
    /**
     * The URL to the publisher's profile with the identity provider.
     * @cloudformationAttribute PublisherProfile
     */
    readonly attrPublisherProfile: string;
    /**
     * Whether the publisher is verified.
     * @cloudformationAttribute PublisherStatus
     */
    readonly attrPublisherStatus: string;
    /**
     * Whether you accept the [Terms and Conditions](https://docs.aws.amazon.com/https://cloudformation-registry-documents.s3.amazonaws.com/Terms_and_Conditions_for_AWS_CloudFormation_Registry_Publishers.pdf) for publishing extensions in the CloudFormation registry. You must accept the terms and conditions in order to register to publish public extensions to the CloudFormation registry.
     *
     * The default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html#cfn-cloudformation-publisher-accepttermsandconditions
     */
    acceptTermsAndConditions: boolean | cdk.IResolvable;
    /**
     * If you are using a Bitbucket or GitHub account for identity verification, the Amazon Resource Name (ARN) for your connection to that account.
     *
     * For more information, see [Registering your account to publish CloudFormation extensions](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/publish-extension.html#publish-extension-prereqs) in the *CloudFormation CLI User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html#cfn-cloudformation-publisher-connectionarn
     */
    connectionArn: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::Publisher`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPublisherProps);
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
 * Properties for defining a `CfnResourceDefaultVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html
 */
export interface CfnResourceDefaultVersionProps {
    /**
     * The name of the resource.
     *
     * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-typename
     */
    readonly typeName?: string;
    /**
     * The Amazon Resource Name (ARN) of the resource version.
     *
     * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-typeversionarn
     */
    readonly typeVersionArn?: string;
    /**
     * The ID of a specific version of the resource. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the resource version when it's registered.
     *
     * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-versionid
     */
    readonly versionId?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::ResourceDefaultVersion`
 *
 * Specifies the default version of a resource. The default version of a resource will be used in CloudFormation operations.
 *
 * @cloudformationResource AWS::CloudFormation::ResourceDefaultVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html
 */
export declare class CfnResourceDefaultVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::ResourceDefaultVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceDefaultVersion;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the resource.
     *
     * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-typename
     */
    typeName: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the resource version.
     *
     * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-typeversionarn
     */
    typeVersionArn: string | undefined;
    /**
     * The ID of a specific version of the resource. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the resource version when it's registered.
     *
     * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-versionid
     */
    versionId: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::ResourceDefaultVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnResourceDefaultVersionProps);
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
 * Properties for defining a `CfnResourceVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html
 */
export interface CfnResourceVersionProps {
    /**
     * A URL to the S3 bucket containing the resource project package that contains the necessary files for the resource you want to register.
     *
     * For information on generating a schema handler package for the resource you want to register, see [submit](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-cli-submit.html) in the *CloudFormation CLI User Guide* .
     *
     * > The user registering the resource must be able to access the package in the S3 bucket. That is, the user needs to have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the schema handler package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-schemahandlerpackage
     */
    readonly schemaHandlerPackage: string;
    /**
     * The name of the resource being registered.
     *
     * We recommend that resource names adhere to the following pattern: *company_or_organization* :: *service* :: *type* .
     *
     * > The following organization namespaces are reserved and can't be used in your resource names:
     * >
     * > - `Alexa`
     * > - `AMZN`
     * > - `Amazon`
     * > - `AWS`
     * > - `Custom`
     * > - `Dev`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-typename
     */
    readonly typeName: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role for CloudFormation to assume when invoking the resource. If your resource calls AWS APIs in any of its handlers, you must create an *[IAM execution role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)* that includes the necessary permissions to call those AWS APIs, and provision that execution role in your account. When CloudFormation needs to invoke the resource type handler, CloudFormation assumes this execution role to create a temporary session token, which it then passes to the resource type handler, thereby supplying your resource type with the appropriate credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-executionrolearn
     */
    readonly executionRoleArn?: string;
    /**
     * Logging configuration information for a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-loggingconfig
     */
    readonly loggingConfig?: CfnResourceVersion.LoggingConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CloudFormation::ResourceVersion`
 *
 * Registers a resource version with the CloudFormation service. Registering a resource version makes it available for use in CloudFormation templates in your AWS account , and includes:
 *
 * - Validating the resource schema.
 * - Determining which handlers, if any, have been specified for the resource.
 * - Making the resource available for use in your account.
 *
 * For more information on how to develop resources and ready them for registration, see [Creating Resource Providers](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-types.html) in the *CloudFormation CLI User Guide* .
 *
 * You can have a maximum of 50 resource versions registered at a time. This maximum is per account and per Region.
 *
 * @cloudformationResource AWS::CloudFormation::ResourceVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html
 */
export declare class CfnResourceVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::ResourceVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceVersion;
    /**
     * The Amazon Resource Name (ARN) of the resource version.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Whether the resource version is set as the default version.
     * @cloudformationAttribute IsDefaultVersion
     */
    readonly attrIsDefaultVersion: cdk.IResolvable;
    /**
     * The provisioning behavior of the resource type. CloudFormation determines the provisioning type during registration, based on the types of handlers in the schema handler package submitted.
     *
     * Valid values include:
     *
     * - `FULLY_MUTABLE` : The resource type includes an update handler to process updates to the type during stack update operations.
     * - `IMMUTABLE` : The resource type doesn't include an update handler, so the type can't be updated and must instead be replaced during stack update operations.
     * - `NON_PROVISIONABLE` : The resource type doesn't include all the following handlers, and therefore can't actually be provisioned.
     *
     * - create
     * - read
     * - delete
     * @cloudformationAttribute ProvisioningType
     */
    readonly attrProvisioningType: string;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     * @cloudformationAttribute TypeArn
     */
    readonly attrTypeArn: string;
    /**
     * The ID of a specific version of the resource. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the resource version when it is registered.
     * @cloudformationAttribute VersionId
     */
    readonly attrVersionId: string;
    /**
     * The scope at which the resource is visible and usable in CloudFormation operations.
     *
     * Valid values include:
     *
     * - `PRIVATE` : The resource is only visible and usable within the account in which it's registered. CloudFormation marks any resources you register as `PRIVATE` .
     * - `PUBLIC` : The resource is publicly visible and usable within any Amazon account.
     * @cloudformationAttribute Visibility
     */
    readonly attrVisibility: string;
    /**
     * A URL to the S3 bucket containing the resource project package that contains the necessary files for the resource you want to register.
     *
     * For information on generating a schema handler package for the resource you want to register, see [submit](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-cli-submit.html) in the *CloudFormation CLI User Guide* .
     *
     * > The user registering the resource must be able to access the package in the S3 bucket. That is, the user needs to have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the schema handler package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-schemahandlerpackage
     */
    schemaHandlerPackage: string;
    /**
     * The name of the resource being registered.
     *
     * We recommend that resource names adhere to the following pattern: *company_or_organization* :: *service* :: *type* .
     *
     * > The following organization namespaces are reserved and can't be used in your resource names:
     * >
     * > - `Alexa`
     * > - `AMZN`
     * > - `Amazon`
     * > - `AWS`
     * > - `Custom`
     * > - `Dev`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-typename
     */
    typeName: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role for CloudFormation to assume when invoking the resource. If your resource calls AWS APIs in any of its handlers, you must create an *[IAM execution role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)* that includes the necessary permissions to call those AWS APIs, and provision that execution role in your account. When CloudFormation needs to invoke the resource type handler, CloudFormation assumes this execution role to create a temporary session token, which it then passes to the resource type handler, thereby supplying your resource type with the appropriate credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-executionrolearn
     */
    executionRoleArn: string | undefined;
    /**
     * Logging configuration information for a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-loggingconfig
     */
    loggingConfig: CfnResourceVersion.LoggingConfigProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::CloudFormation::ResourceVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceVersionProps);
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
export declare namespace CfnResourceVersion {
    /**
     * Logging configuration information for a resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-resourceversion-loggingconfig.html
     */
    interface LoggingConfigProperty {
        /**
         * The Amazon CloudWatch logs group to which CloudFormation sends error logging information when invoking the type's handlers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-resourceversion-loggingconfig.html#cfn-cloudformation-resourceversion-loggingconfig-loggroupname
         */
        readonly logGroupName?: string;
        /**
         * The ARN of the role that CloudFormation should assume when sending log entries to CloudWatch logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-resourceversion-loggingconfig.html#cfn-cloudformation-resourceversion-loggingconfig-logrolearn
         */
        readonly logRoleArn?: string;
    }
}
/**
 * Properties for defining a `CfnStack`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html
 */
export interface CfnStackProps {
    /**
     * Location of file containing the template body. The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket. For more information, see [Template anatomy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html) .
     *
     * Whether an update causes interruptions depends on the resources that are being updated. An update never causes a nested stack to be replaced.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-templateurl
     */
    readonly templateUrl: string;
    /**
     * The Amazon Simple Notification Service (Amazon SNS) topic ARNs to publish stack related events. You can find your Amazon SNS topic ARNs using the Amazon SNS console or your Command Line Interface (CLI).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-notificationarns
     */
    readonly notificationArns?: string[];
    /**
     * The set value pairs that represent the parameters passed to CloudFormation when this nested stack is created. Each parameter has a name corresponding to a parameter defined in the embedded template and a value representing the value that you want to set for the parameter.
     *
     * > If you use the `Ref` function to pass a parameter value to a nested stack, comma-delimited list parameters must be of type `String` . In other words, you can't pass values that are of type `CommaDelimitedList` to nested stacks.
     *
     * Conditional. Required if the nested stack requires input parameters.
     *
     * Whether an update causes interruptions depends on the resources that are being updated. An update never causes a nested stack to be replaced.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-parameters
     */
    readonly parameters?: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * Key-value pairs to associate with this stack. AWS CloudFormation also propagates these tags to the resources created in the stack. A maximum number of 50 tags can be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The length of time, in minutes, that CloudFormation waits for the nested stack to reach the `CREATE_COMPLETE` state. The default is no timeout. When CloudFormation detects that the nested stack has reached the `CREATE_COMPLETE` state, it marks the nested stack resource as `CREATE_COMPLETE` in the parent stack and resumes creating the parent stack. If the timeout period expires before the nested stack reaches `CREATE_COMPLETE` , CloudFormation marks the nested stack as failed and rolls back both the nested stack and parent stack.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-timeoutinminutes
     */
    readonly timeoutInMinutes?: number;
}
/**
 * A CloudFormation `AWS::CloudFormation::Stack`
 *
 * The `AWS::CloudFormation::Stack` resource nests a stack as a resource in a top-level template.
 *
 * You can add output values from a nested stack within the containing template. You use the [GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) function with the nested stack's logical name and the name of the output value in the nested stack in the format `Outputs. *NestedStackOutputName*` .
 *
 * > We strongly recommend that updates to nested stacks are run from the parent stack.
 *
 * When you apply template changes to update a top-level stack, CloudFormation updates the top-level stack and initiates an update to its nested stacks. CloudFormation updates the resources of modified nested stacks, but doesn't update the resources of unmodified nested stacks. For more information, see [CloudFormation stack updates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html) .
 *
 * > You must acknowledge IAM capabilities for nested stacks that contain IAM resources. Also, verify that you have cancel update stack permissions, which is required if an update rolls back. For more information about IAM and CloudFormation , see [Controlling access with AWS Identity and Access Management](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html) .
 *
 * @cloudformationResource AWS::CloudFormation::Stack
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html
 */
export declare class CfnStack extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::Stack";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStack;
    /**
     * Location of file containing the template body. The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket. For more information, see [Template anatomy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html) .
     *
     * Whether an update causes interruptions depends on the resources that are being updated. An update never causes a nested stack to be replaced.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-templateurl
     */
    templateUrl: string;
    /**
     * The Amazon Simple Notification Service (Amazon SNS) topic ARNs to publish stack related events. You can find your Amazon SNS topic ARNs using the Amazon SNS console or your Command Line Interface (CLI).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-notificationarns
     */
    notificationArns: string[] | undefined;
    /**
     * The set value pairs that represent the parameters passed to CloudFormation when this nested stack is created. Each parameter has a name corresponding to a parameter defined in the embedded template and a value representing the value that you want to set for the parameter.
     *
     * > If you use the `Ref` function to pass a parameter value to a nested stack, comma-delimited list parameters must be of type `String` . In other words, you can't pass values that are of type `CommaDelimitedList` to nested stacks.
     *
     * Conditional. Required if the nested stack requires input parameters.
     *
     * Whether an update causes interruptions depends on the resources that are being updated. An update never causes a nested stack to be replaced.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-parameters
     */
    parameters: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * Key-value pairs to associate with this stack. AWS CloudFormation also propagates these tags to the resources created in the stack. A maximum number of 50 tags can be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The length of time, in minutes, that CloudFormation waits for the nested stack to reach the `CREATE_COMPLETE` state. The default is no timeout. When CloudFormation detects that the nested stack has reached the `CREATE_COMPLETE` state, it marks the nested stack resource as `CREATE_COMPLETE` in the parent stack and resumes creating the parent stack. If the timeout period expires before the nested stack reaches `CREATE_COMPLETE` , CloudFormation marks the nested stack as failed and rolls back both the nested stack and parent stack.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html#cfn-cloudformation-stack-timeoutinminutes
     */
    timeoutInMinutes: number | undefined;
    /**
     * Create a new `AWS::CloudFormation::Stack`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStackProps);
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
 * Properties for defining a `CfnStackSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html
 */
export interface CfnStackSetProps {
    /**
     * Describes how the IAM roles required for stack set operations are created.
     *
     * - With `SELF_MANAGED` permissions, you must create the administrator and execution roles required to deploy to target accounts. For more information, see [Grant Self-Managed Stack Set Permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html) .
     * - With `SERVICE_MANAGED` permissions, StackSets automatically creates the IAM roles required to deploy to accounts managed by AWS Organizations . For more information, see [Grant Service-Managed Stack Set Permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-service-managed.html) .
     *
     * *Allowed Values* : `SERVICE_MANAGED` | `SELF_MANAGED`
     *
     * > The `PermissionModel` property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-permissionmodel
     */
    readonly permissionModel: string;
    /**
     * The name to associate with the stack set. The name must be unique in the Region where you create your stack set.
     *
     * *Maximum* : `128`
     *
     * *Pattern* : `^[a-zA-Z][a-zA-Z0-9-]{0,127}$`
     *
     * > The `StackSetName` property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-stacksetname
     */
    readonly stackSetName: string;
    /**
     * The Amazon Resource Number (ARN) of the IAM role to use to create this stack set. Specify an IAM role only if you are using customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account.
     *
     * Use customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account. For more information, see [Prerequisites: Granting Permissions for Stack Set Operations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs.html) in the *AWS CloudFormation User Guide* .
     *
     * *Minimum* : `20`
     *
     * *Maximum* : `2048`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-administrationrolearn
     */
    readonly administrationRoleArn?: string;
    /**
     * [ `Service-managed` permissions] Describes whether StackSets automatically deploys to AWS Organizations accounts that are added to a target organization or organizational unit (OU).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-autodeployment
     */
    readonly autoDeployment?: CfnStackSet.AutoDeploymentProperty | cdk.IResolvable;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.
     *
     * By default, `SELF` is specified. Use `SELF` for stack sets with self-managed permissions.
     *
     * - To create a stack set with service-managed permissions while signed in to the management account, specify `SELF` .
     * - To create a stack set with service-managed permissions while signed in to a delegated administrator account, specify `DELEGATED_ADMIN` .
     *
     * Your AWS account must be registered as a delegated admin in the management account. For more information, see [Register a delegated administrator](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-delegated-admin.html) in the *AWS CloudFormation User Guide* .
     *
     * Stack sets with service-managed permissions are created in the management account, including stack sets that are created by delegated administrators.
     *
     * *Valid Values* : `SELF` | `DELEGATED_ADMIN`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-callas
     */
    readonly callAs?: string;
    /**
     * The capabilities that are allowed in the stack set. Some stack set templates might include resources that can affect permissions in your AWS account —for example, by creating new AWS Identity and Access Management ( IAM ) users. For more information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#capabilities) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-capabilities
     */
    readonly capabilities?: string[];
    /**
     * A description of the stack set.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `1024`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-description
     */
    readonly description?: string;
    /**
     * The name of the IAM execution role to use to create the stack set. If you don't specify an execution role, AWS CloudFormation uses the `AWSCloudFormationStackSetExecutionRole` role for the stack set operation.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `64`
     *
     * *Pattern* : `[a-zA-Z_0-9+=,.@-]+`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-executionrolename
     */
    readonly executionRoleName?: string;
    /**
     * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     *
     * When active, StackSets performs non-conflicting operations concurrently and queues conflicting operations. After conflicting operations finish, StackSets starts queued operations in request order.
     *
     * > If there are already running or queued operations, StackSets queues all incoming operations even if they are non-conflicting.
     * >
     * > You can't modify your stack set's execution configuration while there are running or queued operations for that stack set.
     *
     * When inactive (default), StackSets performs one operation at a time in request order.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-managedexecution
     */
    readonly managedExecution?: any | cdk.IResolvable;
    /**
     * The user-specified preferences for how AWS CloudFormation performs a stack set operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-operationpreferences
     */
    readonly operationPreferences?: CfnStackSet.OperationPreferencesProperty | cdk.IResolvable;
    /**
     * The input parameters for the stack set template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-parameters
     */
    readonly parameters?: Array<CfnStackSet.ParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A group of stack instances with parameters in some specific accounts and Regions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-stackinstancesgroup
     */
    readonly stackInstancesGroup?: Array<CfnStackSet.StackInstancesProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The key-value pairs to associate with this stack set and the stacks created from it. AWS CloudFormation also propagates these tags to supported resources that are created in the stacks. A maximum number of 50 tags can be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The structure that contains the template body, with a minimum length of 1 byte and a maximum length of 51,200 bytes.
     *
     * You must include either `TemplateURL` or `TemplateBody` in a StackSet, but you can't use both. Dynamic references in the `TemplateBody` may not work correctly in all cases. It's recommended to pass templates containing dynamic references through `TemplateUrl` instead.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `51200`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-templatebody
     */
    readonly templateBody?: string;
    /**
     * Location of file containing the template body. The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket.
     *
     * You must include either `TemplateURL` or `TemplateBody` in a StackSet, but you can't use both.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `1024`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-templateurl
     */
    readonly templateUrl?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::StackSet`
 *
 * The `AWS::CloudFormation::StackSet` enables you to provision stacks into AWS accounts and across Regions by using a single CloudFormation template. In the stack set, you specify the template to use, in addition to any parameters and capabilities that the template requires.
 *
 * @cloudformationResource AWS::CloudFormation::StackSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html
 */
export declare class CfnStackSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::StackSet";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStackSet;
    /**
     * The ID of the stack that you're creating.
     * @cloudformationAttribute StackSetId
     */
    readonly attrStackSetId: string;
    /**
     * Describes how the IAM roles required for stack set operations are created.
     *
     * - With `SELF_MANAGED` permissions, you must create the administrator and execution roles required to deploy to target accounts. For more information, see [Grant Self-Managed Stack Set Permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html) .
     * - With `SERVICE_MANAGED` permissions, StackSets automatically creates the IAM roles required to deploy to accounts managed by AWS Organizations . For more information, see [Grant Service-Managed Stack Set Permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-service-managed.html) .
     *
     * *Allowed Values* : `SERVICE_MANAGED` | `SELF_MANAGED`
     *
     * > The `PermissionModel` property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-permissionmodel
     */
    permissionModel: string;
    /**
     * The name to associate with the stack set. The name must be unique in the Region where you create your stack set.
     *
     * *Maximum* : `128`
     *
     * *Pattern* : `^[a-zA-Z][a-zA-Z0-9-]{0,127}$`
     *
     * > The `StackSetName` property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-stacksetname
     */
    stackSetName: string;
    /**
     * The Amazon Resource Number (ARN) of the IAM role to use to create this stack set. Specify an IAM role only if you are using customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account.
     *
     * Use customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account. For more information, see [Prerequisites: Granting Permissions for Stack Set Operations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs.html) in the *AWS CloudFormation User Guide* .
     *
     * *Minimum* : `20`
     *
     * *Maximum* : `2048`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-administrationrolearn
     */
    administrationRoleArn: string | undefined;
    /**
     * [ `Service-managed` permissions] Describes whether StackSets automatically deploys to AWS Organizations accounts that are added to a target organization or organizational unit (OU).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-autodeployment
     */
    autoDeployment: CfnStackSet.AutoDeploymentProperty | cdk.IResolvable | undefined;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.
     *
     * By default, `SELF` is specified. Use `SELF` for stack sets with self-managed permissions.
     *
     * - To create a stack set with service-managed permissions while signed in to the management account, specify `SELF` .
     * - To create a stack set with service-managed permissions while signed in to a delegated administrator account, specify `DELEGATED_ADMIN` .
     *
     * Your AWS account must be registered as a delegated admin in the management account. For more information, see [Register a delegated administrator](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-delegated-admin.html) in the *AWS CloudFormation User Guide* .
     *
     * Stack sets with service-managed permissions are created in the management account, including stack sets that are created by delegated administrators.
     *
     * *Valid Values* : `SELF` | `DELEGATED_ADMIN`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-callas
     */
    callAs: string | undefined;
    /**
     * The capabilities that are allowed in the stack set. Some stack set templates might include resources that can affect permissions in your AWS account —for example, by creating new AWS Identity and Access Management ( IAM ) users. For more information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#capabilities) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-capabilities
     */
    capabilities: string[] | undefined;
    /**
     * A description of the stack set.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `1024`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-description
     */
    description: string | undefined;
    /**
     * The name of the IAM execution role to use to create the stack set. If you don't specify an execution role, AWS CloudFormation uses the `AWSCloudFormationStackSetExecutionRole` role for the stack set operation.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `64`
     *
     * *Pattern* : `[a-zA-Z_0-9+=,.@-]+`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-executionrolename
     */
    executionRoleName: string | undefined;
    /**
     * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     *
     * When active, StackSets performs non-conflicting operations concurrently and queues conflicting operations. After conflicting operations finish, StackSets starts queued operations in request order.
     *
     * > If there are already running or queued operations, StackSets queues all incoming operations even if they are non-conflicting.
     * >
     * > You can't modify your stack set's execution configuration while there are running or queued operations for that stack set.
     *
     * When inactive (default), StackSets performs one operation at a time in request order.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-managedexecution
     */
    managedExecution: any | cdk.IResolvable | undefined;
    /**
     * The user-specified preferences for how AWS CloudFormation performs a stack set operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-operationpreferences
     */
    operationPreferences: CfnStackSet.OperationPreferencesProperty | cdk.IResolvable | undefined;
    /**
     * The input parameters for the stack set template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-parameters
     */
    parameters: Array<CfnStackSet.ParameterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A group of stack instances with parameters in some specific accounts and Regions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-stackinstancesgroup
     */
    stackInstancesGroup: Array<CfnStackSet.StackInstancesProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The key-value pairs to associate with this stack set and the stacks created from it. AWS CloudFormation also propagates these tags to supported resources that are created in the stacks. A maximum number of 50 tags can be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The structure that contains the template body, with a minimum length of 1 byte and a maximum length of 51,200 bytes.
     *
     * You must include either `TemplateURL` or `TemplateBody` in a StackSet, but you can't use both. Dynamic references in the `TemplateBody` may not work correctly in all cases. It's recommended to pass templates containing dynamic references through `TemplateUrl` instead.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `51200`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-templatebody
     */
    templateBody: string | undefined;
    /**
     * Location of file containing the template body. The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket.
     *
     * You must include either `TemplateURL` or `TemplateBody` in a StackSet, but you can't use both.
     *
     * *Minimum* : `1`
     *
     * *Maximum* : `1024`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-templateurl
     */
    templateUrl: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::StackSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStackSetProps);
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
export declare namespace CfnStackSet {
    /**
     * [ `Service-managed` permissions] Describes whether StackSets automatically deploys to AWS Organizations accounts that are added to a target organizational unit (OU).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-autodeployment.html
     */
    interface AutoDeploymentProperty {
        /**
         * If set to `true` , StackSets automatically deploys additional stack instances to AWS Organizations accounts that are added to a target organization or organizational unit (OU) in the specified Regions. If an account is removed from a target organization or OU, StackSets deletes stack instances from the account in the specified Regions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-autodeployment.html#cfn-cloudformation-stackset-autodeployment-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * If set to `true` , stack resources are retained when an account is removed from a target organization or OU. If set to `false` , stack resources are deleted. Specify only if `Enabled` is set to `True` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-autodeployment.html#cfn-cloudformation-stackset-autodeployment-retainstacksonaccountremoval
         */
        readonly retainStacksOnAccountRemoval?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnStackSet {
    /**
     * The AWS OrganizationalUnitIds or Accounts for which to create stack instances in the specified Regions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html
     */
    interface DeploymentTargetsProperty {
        /**
         * Limit deployment targets to individual accounts or include additional accounts with provided OUs.
         *
         * The following is a list of possible values for the `AccountFilterType` operation.
         *
         * - `INTERSECTION` : StackSets deploys to the accounts specified in `Accounts` parameter.
         * - `DIFFERENCE` : StackSets excludes the accounts specified in `Accounts` parameter. This enables user to avoid certain accounts within an OU such as suspended accounts.
         * - `UNION` : StackSets includes additional accounts deployment targets.
         *
         * This is the default value if `AccountFilterType` is not provided. This enables user to update an entire OU and individual accounts from a different OU in one request, which used to be two separate requests.
         * - `NONE` : Deploys to all the accounts in specified organizational units (OU).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html#cfn-cloudformation-stackset-deploymenttargets-accountfiltertype
         */
        readonly accountFilterType?: string;
        /**
         * The names of one or more AWS accounts for which you want to deploy stack set updates.
         *
         * *Pattern* : `^[0-9]{12}$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html#cfn-cloudformation-stackset-deploymenttargets-accounts
         */
        readonly accounts?: string[];
        /**
         * The organization root ID or organizational unit (OU) IDs to which StackSets deploys.
         *
         * *Pattern* : `^(ou-[a-z0-9]{4,32}-[a-z0-9]{8,32}|r-[a-z0-9]{4,32})$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html#cfn-cloudformation-stackset-deploymenttargets-organizationalunitids
         */
        readonly organizationalUnitIds?: string[];
    }
}
export declare namespace CfnStackSet {
    /**
     * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-managedexecution.html
     */
    interface ManagedExecutionProperty {
        /**
         * When `true` , StackSets performs non-conflicting operations concurrently and queues conflicting operations. After conflicting operations finish, StackSets starts queued operations in request order.
         *
         * > If there are already running or queued operations, StackSets queues all incoming operations even if they are non-conflicting.
         * >
         * > You can't modify your stack set's execution configuration while there are running or queued operations for that stack set.
         *
         * When `false` (default), StackSets performs one operation at a time in request order.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-managedexecution.html#cfn-cloudformation-stackset-managedexecution-active
         */
        readonly active?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnStackSet {
    /**
     * The user-specified preferences for how AWS CloudFormation performs a stack set operation. For more information on maximum concurrent accounts and failure tolerance, see [Stack set operation options](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html#stackset-ops-options) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html
     */
    interface OperationPreferencesProperty {
        /**
         * The number of accounts, per Region, for which this operation can fail before AWS CloudFormation stops the operation in that Region. If the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in any subsequent Regions.
         *
         * Conditional: You must specify either `FailureToleranceCount` or `FailureTolerancePercentage` (but not both).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-failuretolerancecount
         */
        readonly failureToleranceCount?: number;
        /**
         * The percentage of accounts, per Region, for which this stack operation can fail before AWS CloudFormation stops the operation in that Region. If the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in any subsequent Regions.
         *
         * When calculating the number of accounts based on the specified percentage, AWS CloudFormation rounds *down* to the next whole number.
         *
         * Conditional: You must specify either `FailureToleranceCount` or `FailureTolerancePercentage` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-failuretolerancepercentage
         */
        readonly failureTolerancePercentage?: number;
        /**
         * The maximum number of accounts in which to perform this operation at one time. This is dependent on the value of `FailureToleranceCount` . `MaxConcurrentCount` is at most one more than the `FailureToleranceCount` .
         *
         * Note that this setting lets you specify the *maximum* for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
         *
         * Conditional: You must specify either `MaxConcurrentCount` or `MaxConcurrentPercentage` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-maxconcurrentcount
         */
        readonly maxConcurrentCount?: number;
        /**
         * The maximum percentage of accounts in which to perform this operation at one time.
         *
         * When calculating the number of accounts based on the specified percentage, AWS CloudFormation rounds down to the next whole number. This is true except in cases where rounding down would result is zero. In this case, CloudFormation sets the number as one instead.
         *
         * Note that this setting lets you specify the *maximum* for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
         *
         * Conditional: You must specify either `MaxConcurrentCount` or `MaxConcurrentPercentage` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-maxconcurrentpercentage
         */
        readonly maxConcurrentPercentage?: number;
        /**
         * The concurrency type of deploying StackSets operations in Regions, could be in parallel or one Region at a time.
         *
         * *Allowed values* : `SEQUENTIAL` | `PARALLEL`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-regionconcurrencytype
         */
        readonly regionConcurrencyType?: string;
        /**
         * The order of the Regions where you want to perform the stack operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-regionorder
         */
        readonly regionOrder?: string[];
    }
}
export declare namespace CfnStackSet {
    /**
     * The Parameter data type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-parameter.html
     */
    interface ParameterProperty {
        /**
         * The key associated with the parameter. If you don't specify a key and value for a particular parameter, AWS CloudFormation uses the default value that's specified in your template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-parameter.html#cfn-cloudformation-stackset-parameter-parameterkey
         */
        readonly parameterKey: string;
        /**
         * The input value associated with the parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-parameter.html#cfn-cloudformation-stackset-parameter-parametervalue
         */
        readonly parameterValue: string;
    }
}
export declare namespace CfnStackSet {
    /**
     * Stack instances in some specific accounts and Regions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html
     */
    interface StackInstancesProperty {
        /**
         * The AWS `OrganizationalUnitIds` or `Accounts` for which to create stack instances in the specified Regions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html#cfn-cloudformation-stackset-stackinstances-deploymenttargets
         */
        readonly deploymentTargets: CfnStackSet.DeploymentTargetsProperty | cdk.IResolvable;
        /**
         * A list of stack set parameters whose values you want to override in the selected stack instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html#cfn-cloudformation-stackset-stackinstances-parameteroverrides
         */
        readonly parameterOverrides?: Array<CfnStackSet.ParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The names of one or more Regions where you want to create stack instances using the specified AWS accounts .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html#cfn-cloudformation-stackset-stackinstances-regions
         */
        readonly regions: string[];
    }
}
/**
 * Properties for defining a `CfnTypeActivation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html
 */
export interface CfnTypeActivationProps {
    /**
     * Whether to automatically update the extension in this account and Region when a new *minor* version is published by the extension publisher. Major versions released by the publisher must be manually updated.
     *
     * The default is `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-autoupdate
     */
    readonly autoUpdate?: boolean | cdk.IResolvable;
    /**
     * The name of the IAM execution role to use to activate the extension.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-executionrolearn
     */
    readonly executionRoleArn?: string;
    /**
     * Specifies logging configuration information for an extension.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-loggingconfig
     */
    readonly loggingConfig?: CfnTypeActivation.LoggingConfigProperty | cdk.IResolvable;
    /**
     * The major version of this extension you want to activate, if multiple major versions are available. The default is the latest major version. CloudFormation uses the latest available *minor* version of the major version selected.
     *
     * You can specify `MajorVersion` or `VersionBump` , but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-majorversion
     */
    readonly majorVersion?: string;
    /**
     * The Amazon Resource Number (ARN) of the public extension.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-publictypearn
     */
    readonly publicTypeArn?: string;
    /**
     * The ID of the extension publisher.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-publisherid
     */
    readonly publisherId?: string;
    /**
     * The extension type.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-type
     */
    readonly type?: string;
    /**
     * The name of the extension.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-typename
     */
    readonly typeName?: string;
    /**
     * An alias to assign to the public extension, in this account and Region. If you specify an alias for the extension, CloudFormation treats the alias as the extension type name within this account and Region. You must use the alias to refer to the extension in your templates, API calls, and CloudFormation console.
     *
     * An extension alias must be unique within a given account and Region. You can activate the same public resource multiple times in the same account and Region, using different type name aliases.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-typenamealias
     */
    readonly typeNameAlias?: string;
    /**
     * Manually updates a previously-activated type to a new major or minor version, if available. You can also use this parameter to update the value of `AutoUpdate` .
     *
     * - `MAJOR` : CloudFormation updates the extension to the newest major version, if one is available.
     * - `MINOR` : CloudFormation updates the extension to the newest minor version, if one is available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-versionbump
     */
    readonly versionBump?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::TypeActivation`
 *
 * Activates a public third-party extension, making it available for use in stack templates. For more information, see [Using public extensions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry-public.html) in the *AWS CloudFormation User Guide* .
 *
 * Once you have activated a public third-party extension in your account and Region, use [SetTypeConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_SetTypeConfiguration.html) to specify configuration properties for the extension. For more information, see [Configuring extensions at the account level](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry-register.html#registry-set-configuration) in the *CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::TypeActivation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html
 */
export declare class CfnTypeActivation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::TypeActivation";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTypeActivation;
    /**
     * The Amazon Resource Number (ARN) of the activated extension, in this account and Region.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Whether to automatically update the extension in this account and Region when a new *minor* version is published by the extension publisher. Major versions released by the publisher must be manually updated.
     *
     * The default is `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-autoupdate
     */
    autoUpdate: boolean | cdk.IResolvable | undefined;
    /**
     * The name of the IAM execution role to use to activate the extension.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-executionrolearn
     */
    executionRoleArn: string | undefined;
    /**
     * Specifies logging configuration information for an extension.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-loggingconfig
     */
    loggingConfig: CfnTypeActivation.LoggingConfigProperty | cdk.IResolvable | undefined;
    /**
     * The major version of this extension you want to activate, if multiple major versions are available. The default is the latest major version. CloudFormation uses the latest available *minor* version of the major version selected.
     *
     * You can specify `MajorVersion` or `VersionBump` , but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-majorversion
     */
    majorVersion: string | undefined;
    /**
     * The Amazon Resource Number (ARN) of the public extension.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-publictypearn
     */
    publicTypeArn: string | undefined;
    /**
     * The ID of the extension publisher.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-publisherid
     */
    publisherId: string | undefined;
    /**
     * The extension type.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-type
     */
    type: string | undefined;
    /**
     * The name of the extension.
     *
     * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-typename
     */
    typeName: string | undefined;
    /**
     * An alias to assign to the public extension, in this account and Region. If you specify an alias for the extension, CloudFormation treats the alias as the extension type name within this account and Region. You must use the alias to refer to the extension in your templates, API calls, and CloudFormation console.
     *
     * An extension alias must be unique within a given account and Region. You can activate the same public resource multiple times in the same account and Region, using different type name aliases.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-typenamealias
     */
    typeNameAlias: string | undefined;
    /**
     * Manually updates a previously-activated type to a new major or minor version, if available. You can also use this parameter to update the value of `AutoUpdate` .
     *
     * - `MAJOR` : CloudFormation updates the extension to the newest major version, if one is available.
     * - `MINOR` : CloudFormation updates the extension to the newest minor version, if one is available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-versionbump
     */
    versionBump: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::TypeActivation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnTypeActivationProps);
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
export declare namespace CfnTypeActivation {
    /**
     * Contains logging configuration information for an extension.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-typeactivation-loggingconfig.html
     */
    interface LoggingConfigProperty {
        /**
         * The Amazon CloudWatch Logs group to which CloudFormation sends error logging information when invoking the extension's handlers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-typeactivation-loggingconfig.html#cfn-cloudformation-typeactivation-loggingconfig-loggroupname
         */
        readonly logGroupName?: string;
        /**
         * The Amazon Resource Name (ARN) of the role that CloudFormation should assume when sending log entries to CloudWatch Logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-typeactivation-loggingconfig.html#cfn-cloudformation-typeactivation-loggingconfig-logrolearn
         */
        readonly logRoleArn?: string;
    }
}
/**
 * Properties for defining a `CfnWaitCondition`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html
 */
export interface CfnWaitConditionProps {
    /**
     * The number of success signals that CloudFormation must receive before it continues the stack creation process. When the wait condition receives the requisite number of success signals, CloudFormation resumes the creation of the stack. If the wait condition doesn't receive the specified number of success signals before the Timeout period expires, CloudFormation assumes that the wait condition has failed and rolls the stack back.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html#cfn-waitcondition-count
     */
    readonly count?: number;
    /**
     * A reference to the wait condition handle used to signal this wait condition. Use the `Ref` intrinsic function to specify an [AWS::CloudFormation::WaitConditionHandle](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitconditionhandle.html) resource.
     *
     * Anytime you add a WaitCondition resource during a stack update, you must associate the wait condition with a new WaitConditionHandle resource. Don't reuse an old wait condition handle that has already been defined in the template. If you reuse a wait condition handle, the wait condition might evaluate old signals from a previous create or update stack command.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html#cfn-waitcondition-handle
     */
    readonly handle?: string;
    /**
     * The length of time (in seconds) to wait for the number of signals that the `Count` property specifies. `Timeout` is a minimum-bound property, meaning the timeout occurs no sooner than the time you specify, but can occur shortly thereafter. The maximum time that can be specified for this property is 12 hours (43200 seconds).
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html#cfn-waitcondition-timeout
     */
    readonly timeout?: string;
}
/**
 * A CloudFormation `AWS::CloudFormation::WaitCondition`
 *
 * > For Amazon EC2 and Auto Scaling resources, we recommend that you use a `CreationPolicy` attribute instead of wait conditions. Add a CreationPolicy attribute to those resources, and use the cfn-signal helper script to signal when an instance creation process has completed successfully.
 *
 * You can use a wait condition for situations like the following:
 *
 * - To coordinate stack resource creation with configuration actions that are external to the stack creation.
 * - To track the status of a configuration process.
 *
 * For these situations, we recommend that you associate a [CreationPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html) attribute with the wait condition so that you don't have to use a wait condition handle. For more information and an example, see [Creating wait conditions in a template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-waitcondition.html) . If you use a CreationPolicy with a wait condition, don't specify any of the wait condition's properties.
 *
 * > If you use the [VPC endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html) feature, resources in the VPC that respond to wait conditions must have access to CloudFormation , specific Amazon Simple Storage Service ( Amazon S3 ) buckets. Resources must send wait condition responses to a presigned Amazon S3 URL. If they can't send responses to Amazon S3 , CloudFormation won't receive a response and the stack operation fails. For more information, see [Setting up VPC endpoints for AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-vpce-bucketnames.html) .
 *
 * @cloudformationResource AWS::CloudFormation::WaitCondition
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html
 */
export declare class CfnWaitCondition extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::WaitCondition";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWaitCondition;
    /**
     * A JSON object that contains the `UniqueId` and `Data` values from the wait condition signal(s) for the specified wait condition. For more information about wait condition signals, see [Wait condition signal JSON format](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-waitcondition.html#using-cfn-waitcondition-signaljson) .
     *
     * Example return value for a wait condition with 2 signals:
     *
     * `{ "Signal1" : "Step 1 complete." , "Signal2" : "Step 2 complete." }`
     * @cloudformationAttribute Data
     */
    readonly attrData: cdk.IResolvable;
    /**
     * The number of success signals that CloudFormation must receive before it continues the stack creation process. When the wait condition receives the requisite number of success signals, CloudFormation resumes the creation of the stack. If the wait condition doesn't receive the specified number of success signals before the Timeout period expires, CloudFormation assumes that the wait condition has failed and rolls the stack back.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html#cfn-waitcondition-count
     */
    count: number | undefined;
    /**
     * A reference to the wait condition handle used to signal this wait condition. Use the `Ref` intrinsic function to specify an [AWS::CloudFormation::WaitConditionHandle](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitconditionhandle.html) resource.
     *
     * Anytime you add a WaitCondition resource during a stack update, you must associate the wait condition with a new WaitConditionHandle resource. Don't reuse an old wait condition handle that has already been defined in the template. If you reuse a wait condition handle, the wait condition might evaluate old signals from a previous create or update stack command.
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html#cfn-waitcondition-handle
     */
    handle: string | undefined;
    /**
     * The length of time (in seconds) to wait for the number of signals that the `Count` property specifies. `Timeout` is a minimum-bound property, meaning the timeout occurs no sooner than the time you specify, but can occur shortly thereafter. The maximum time that can be specified for this property is 12 hours (43200 seconds).
     *
     * Updates aren't supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html#cfn-waitcondition-timeout
     */
    timeout: string | undefined;
    /**
     * Create a new `AWS::CloudFormation::WaitCondition`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnWaitConditionProps);
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
 * A CloudFormation `AWS::CloudFormation::WaitConditionHandle`
 *
 * > For Amazon EC2 and Auto Scaling resources, we recommend that you use a `CreationPolicy` attribute instead of wait conditions. Add a `CreationPolicy` attribute to those resources, and use the cfn-signal helper script to signal when an instance creation process has completed successfully.
 * >
 * > For more information, see [Deploying applications on Amazon EC2 with AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/deploying.applications.html) .
 *
 * The `AWS::CloudFormation::WaitConditionHandle` type has no properties. When you reference the `WaitConditionHandle` resource by using the Ref function, AWS CloudFormation returns a presigned URL. You pass this URL to applications or scripts that are running on your Amazon EC2 instances to send signals to that URL. An associated `AWS::CloudFormation::WaitCondition` resource checks the URL for the required number of success signals or for a failure signal.
 *
 * > Anytime you add a `WaitCondition` resource during a stack update or update a resource with a wait condition, you must associate the wait condition with a new `WaitConditionHandle` resource. Don't reuse an old wait condition handle that has already been defined in the template. If you reuse a wait condition handle, the wait condition might evaluate old signals from a previous create or update stack command. > Updates aren't supported for this resource.
 *
 * @cloudformationResource AWS::CloudFormation::WaitConditionHandle
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitconditionhandle.html
 */
export declare class CfnWaitConditionHandle extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudFormation::WaitConditionHandle";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWaitConditionHandle;
    /**
     * Create a new `AWS::CloudFormation::WaitConditionHandle`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
}
