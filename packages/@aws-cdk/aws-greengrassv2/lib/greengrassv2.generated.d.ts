import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnComponentVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html
 */
export interface CfnComponentVersionProps {
    /**
     * The recipe to use to create the component. The recipe defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform compatibility.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-inlinerecipe
     */
    readonly inlineRecipe?: string;
    /**
     * The parameters to create a component from a Lambda function.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-lambdafunction
     */
    readonly lambdaFunction?: CfnComponentVersion.LambdaFunctionRecipeSourceProperty | cdk.IResolvable;
    /**
     * Application-specific metadata to attach to the component version. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::GreengrassV2::ComponentVersion`
 *
 * Creates a component. Components are software that run on AWS IoT Greengrass core devices. After you develop and test a component on your core device, you can use this operation to upload your component to AWS IoT Greengrass . Then, you can deploy the component to other core devices.
 *
 * You can use this operation to do the following:
 *
 * - *Create components from recipes*
 *
 * Create a component from a recipe, which is a file that defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform capability. For more information, see [AWS IoT Greengrass component recipe reference](https://docs.aws.amazon.com/greengrass/v2/developerguide/component-recipe-reference.html) in the *AWS IoT Greengrass V2 Developer Guide* .
 *
 * To create a component from a recipe, specify `inlineRecipe` when you call this operation.
 * - *Create components from Lambda functions*
 *
 * Create a component from an AWS Lambda function that runs on AWS IoT Greengrass . This creates a recipe and artifacts from the Lambda function's deployment package. You can use this operation to migrate Lambda functions from AWS IoT Greengrass V1 to AWS IoT Greengrass V2 .
 *
 * This function only accepts Lambda functions that use the following runtimes:
 *
 * - Python 2.7 – `python2.7`
 * - Python 3.7 – `python3.7`
 * - Python 3.8 – `python3.8`
 * - Java 8 – `java8`
 * - Node.js 10 – `nodejs10.x`
 * - Node.js 12 – `nodejs12.x`
 *
 * To create a component from a Lambda function, specify `lambdaFunction` when you call this operation.
 *
 * @cloudformationResource AWS::GreengrassV2::ComponentVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html
 */
export declare class CfnComponentVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GreengrassV2::ComponentVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponentVersion;
    /**
     * The ARN of the component version.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the component.
     * @cloudformationAttribute ComponentName
     */
    readonly attrComponentName: string;
    /**
     * The version of the component.
     * @cloudformationAttribute ComponentVersion
     */
    readonly attrComponentVersion: string;
    /**
     * The recipe to use to create the component. The recipe defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform compatibility.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-inlinerecipe
     */
    inlineRecipe: string | undefined;
    /**
     * The parameters to create a component from a Lambda function.
     *
     * You must specify either `InlineRecipe` or `LambdaFunction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-lambdafunction
     */
    lambdaFunction: CfnComponentVersion.LambdaFunctionRecipeSourceProperty | cdk.IResolvable | undefined;
    /**
     * Application-specific metadata to attach to the component version. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GreengrassV2::ComponentVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnComponentVersionProps);
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
export declare namespace CfnComponentVersion {
    /**
     * Contains information about a component dependency for a Lambda function component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html
     */
    interface ComponentDependencyRequirementProperty {
        /**
         * The type of this dependency. Choose from the following options:
         *
         * - `SOFT` – The component doesn't restart if the dependency changes state.
         * - `HARD` – The component restarts if the dependency changes state.
         *
         * Default: `HARD`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html#cfn-greengrassv2-componentversion-componentdependencyrequirement-dependencytype
         */
        readonly dependencyType?: string;
        /**
         * The component version requirement for the component dependency.
         *
         * AWS IoT Greengrass uses semantic version constraints. For more information, see [Semantic Versioning](https://docs.aws.amazon.com/https://semver.org/) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html#cfn-greengrassv2-componentversion-componentdependencyrequirement-versionrequirement
         */
        readonly versionRequirement?: string;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains information about a platform that a component supports.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html
     */
    interface ComponentPlatformProperty {
        /**
         * A dictionary of attributes for the platform. The AWS IoT Greengrass Core software defines the `os` and `platform` by default. You can specify additional platform attributes for a core device when you deploy the AWS IoT Greengrass nucleus component. For more information, see the [AWS IoT Greengrass nucleus component](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html#cfn-greengrassv2-componentversion-componentplatform-attributes
         */
        readonly attributes?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The friendly name of the platform. This name helps you identify the platform.
         *
         * If you omit this parameter, AWS IoT Greengrass creates a friendly name from the `os` and `architecture` of the platform.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html#cfn-greengrassv2-componentversion-componentplatform-name
         */
        readonly name?: string;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains information about a container in which AWS Lambda functions run on AWS IoT Greengrass core devices.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html
     */
    interface LambdaContainerParamsProperty {
        /**
         * The list of system devices that the container can access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-devices
         */
        readonly devices?: Array<CfnComponentVersion.LambdaDeviceMountProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The memory size of the container, expressed in kilobytes.
         *
         * Default: `16384` (16 MB)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-memorysizeinkb
         */
        readonly memorySizeInKb?: number;
        /**
         * Whether or not the container can read information from the device's `/sys` folder.
         *
         * Default: `false`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-mountrosysfs
         */
        readonly mountRoSysfs?: boolean | cdk.IResolvable;
        /**
         * The list of volumes that the container can access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-volumes
         */
        readonly volumes?: Array<CfnComponentVersion.LambdaVolumeMountProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains information about a device that Linux processes in a container can access.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html
     */
    interface LambdaDeviceMountProperty {
        /**
         * Whether or not to add the component's system user as an owner of the device.
         *
         * Default: `false`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-addgroupowner
         */
        readonly addGroupOwner?: boolean | cdk.IResolvable;
        /**
         * The mount path for the device in the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-path
         */
        readonly path?: string;
        /**
         * The permission to access the device: read/only ( `ro` ) or read/write ( `rw` ).
         *
         * Default: `ro`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-permission
         */
        readonly permission?: string;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains information about an event source for an AWS Lambda function. The event source defines the topics on which this Lambda function subscribes to receive messages that run the function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html
     */
    interface LambdaEventSourceProperty {
        /**
         * The topic to which to subscribe to receive event messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html#cfn-greengrassv2-componentversion-lambdaeventsource-topic
         */
        readonly topic?: string;
        /**
         * The type of event source. Choose from the following options:
         *
         * - `PUB_SUB` – Subscribe to local publish/subscribe messages. This event source type doesn't support MQTT wildcards ( `+` and `#` ) in the event source topic.
         * - `IOT_CORE` – Subscribe to AWS IoT Core MQTT messages. This event source type supports MQTT wildcards ( `+` and `#` ) in the event source topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html#cfn-greengrassv2-componentversion-lambdaeventsource-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains parameters for a Lambda function that runs on AWS IoT Greengrass .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html
     */
    interface LambdaExecutionParametersProperty {
        /**
         * The map of environment variables that are available to the Lambda function when it runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-environmentvariables
         */
        readonly environmentVariables?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The list of event sources to which to subscribe to receive work messages. The Lambda function runs when it receives a message from an event source. You can subscribe this function to local publish/subscribe messages and AWS IoT Core MQTT messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-eventsources
         */
        readonly eventSources?: Array<CfnComponentVersion.LambdaEventSourceProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The list of arguments to pass to the Lambda function when it runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-execargs
         */
        readonly execArgs?: string[];
        /**
         * The encoding type that the Lambda function supports.
         *
         * Default: `json`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-inputpayloadencodingtype
         */
        readonly inputPayloadEncodingType?: string;
        /**
         * The parameters for the Linux process that contains the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-linuxprocessparams
         */
        readonly linuxProcessParams?: CfnComponentVersion.LambdaLinuxProcessParamsProperty | cdk.IResolvable;
        /**
         * The maximum amount of time in seconds that a non-pinned Lambda function can idle before the AWS IoT Greengrass Core software stops its process.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxidletimeinseconds
         */
        readonly maxIdleTimeInSeconds?: number;
        /**
         * The maximum number of instances that a non-pinned Lambda function can run at the same time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxinstancescount
         */
        readonly maxInstancesCount?: number;
        /**
         * The maximum size of the message queue for the Lambda function component. The AWS IoT Greengrass core device stores messages in a FIFO (first-in-first-out) queue until it can run the Lambda function to consume each message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxqueuesize
         */
        readonly maxQueueSize?: number;
        /**
         * Whether or not the Lambda function is pinned, or long-lived.
         *
         * - A pinned Lambda function starts when the AWS IoT Greengrass Core starts and keeps running in its own container.
         * - A non-pinned Lambda function starts only when it receives a work item and exists after it idles for `maxIdleTimeInSeconds` . If the function has multiple work items, the AWS IoT Greengrass Core software creates multiple instances of the function.
         *
         * Default: `true`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-pinned
         */
        readonly pinned?: boolean | cdk.IResolvable;
        /**
         * The interval in seconds at which a pinned (also known as long-lived) Lambda function component sends status updates to the Lambda manager component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-statustimeoutinseconds
         */
        readonly statusTimeoutInSeconds?: number;
        /**
         * The maximum amount of time in seconds that the Lambda function can process a work item.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-timeoutinseconds
         */
        readonly timeoutInSeconds?: number;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains information about an AWS Lambda function to import to create a component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html
     */
    interface LambdaFunctionRecipeSourceProperty {
        /**
         * The component versions on which this Lambda function component depends.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentdependencies
         */
        readonly componentDependencies?: {
            [key: string]: (CfnComponentVersion.ComponentDependencyRequirementProperty | cdk.IResolvable);
        } | cdk.IResolvable;
        /**
         * The system and runtime parameters for the Lambda function as it runs on the AWS IoT Greengrass core device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentlambdaparameters
         */
        readonly componentLambdaParameters?: CfnComponentVersion.LambdaExecutionParametersProperty | cdk.IResolvable;
        /**
         * The name of the component.
         *
         * Defaults to the name of the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentname
         */
        readonly componentName?: string;
        /**
         * The platforms that the component version supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentplatforms
         */
        readonly componentPlatforms?: Array<CfnComponentVersion.ComponentPlatformProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The version of the component.
         *
         * Defaults to the version of the Lambda function as a semantic version. For example, if your function version is `3` , the component version becomes `3.0.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentversion
         */
        readonly componentVersion?: string;
        /**
         * The ARN of the Lambda function. The ARN must include the version of the function to import. You can't use version aliases like `$LATEST` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-lambdaarn
         */
        readonly lambdaArn?: string;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains parameters for a Linux process that contains an AWS Lambda function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html
     */
    interface LambdaLinuxProcessParamsProperty {
        /**
         * The parameters for the container in which the Lambda function runs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html#cfn-greengrassv2-componentversion-lambdalinuxprocessparams-containerparams
         */
        readonly containerParams?: CfnComponentVersion.LambdaContainerParamsProperty | cdk.IResolvable;
        /**
         * The isolation mode for the process that contains the Lambda function. The process can run in an isolated runtime environment inside the AWS IoT Greengrass container, or as a regular process outside any container.
         *
         * Default: `GreengrassContainer`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html#cfn-greengrassv2-componentversion-lambdalinuxprocessparams-isolationmode
         */
        readonly isolationMode?: string;
    }
}
export declare namespace CfnComponentVersion {
    /**
     * Contains information about a volume that Linux processes in a container can access. When you define a volume, the AWS IoT Greengrass Core software mounts the source files to the destination inside the container.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html
     */
    interface LambdaVolumeMountProperty {
        /**
         * Whether or not to add the AWS IoT Greengrass user group as an owner of the volume.
         *
         * Default: `false`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-addgroupowner
         */
        readonly addGroupOwner?: boolean | cdk.IResolvable;
        /**
         * The path to the logical volume in the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-destinationpath
         */
        readonly destinationPath?: string;
        /**
         * The permission to access the volume: read/only ( `ro` ) or read/write ( `rw` ).
         *
         * Default: `ro`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-permission
         */
        readonly permission?: string;
        /**
         * The path to the physical volume in the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-sourcepath
         */
        readonly sourcePath?: string;
    }
}
/**
 * Properties for defining a `CfnDeployment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html
 */
export interface CfnDeploymentProps {
    /**
     * The ARN of the target AWS IoT thing or thing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-targetarn
     */
    readonly targetArn: string;
    /**
     * The components to deploy. This is a dictionary, where each key is the name of a component, and each key's value is the version and configuration to deploy for that component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-components
     */
    readonly components?: {
        [key: string]: (CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The name of the deployment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentname
     */
    readonly deploymentName?: string;
    /**
     * The deployment policies for the deployment. These policies define how the deployment updates components and handles failure.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentpolicies
     */
    readonly deploymentPolicies?: CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable;
    /**
     * The job configuration for the deployment configuration. The job configuration specifies the rollout, timeout, and stop configurations for the deployment configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-iotjobconfiguration
     */
    readonly iotJobConfiguration?: CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable;
    /**
     * Application-specific metadata to attach to the deployment. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::GreengrassV2::Deployment`
 *
 * Creates a continuous deployment for a target, which is a AWS IoT Greengrass core device or group of core devices. When you add a new core device to a group of core devices that has a deployment, AWS IoT Greengrass deploys that group's deployment to the new device.
 *
 * You can define one deployment for each target. When you create a new deployment for a target that has an existing deployment, you replace the previous deployment. AWS IoT Greengrass applies the new deployment to the target devices.
 *
 * You can only add, update, or delete up to 10 deployments at a time to a single target.
 *
 * Every deployment has a revision number that indicates how many deployment revisions you define for a target. Use this operation to create a new revision of an existing deployment. This operation returns the revision number of the new deployment when you create it.
 *
 * For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/latest/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
 *
 * > Deployment resources are deleted when you delete stacks. To keep the deployments in a stack, you must specify `"DeletionPolicy": "Retain"` on each deployment resource in the stack template that you want to keep. For more information, see [DeletionPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 * >
 * > You can only delete up to 10 deployment resources at a time. If you delete more than 10 resources, you receive an error.
 *
 * @cloudformationResource AWS::GreengrassV2::Deployment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html
 */
export declare class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GreengrassV2::Deployment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeployment;
    /**
     * The ID of the deployment.
     * @cloudformationAttribute DeploymentId
     */
    readonly attrDeploymentId: string;
    /**
     * The ARN of the target AWS IoT thing or thing group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-targetarn
     */
    targetArn: string;
    /**
     * The components to deploy. This is a dictionary, where each key is the name of a component, and each key's value is the version and configuration to deploy for that component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-components
     */
    components: {
        [key: string]: (CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The name of the deployment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentname
     */
    deploymentName: string | undefined;
    /**
     * The deployment policies for the deployment. These policies define how the deployment updates components and handles failure.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentpolicies
     */
    deploymentPolicies: CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable | undefined;
    /**
     * The job configuration for the deployment configuration. The job configuration specifies the rollout, timeout, and stop configurations for the deployment configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-iotjobconfiguration
     */
    iotJobConfiguration: CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Application-specific metadata to attach to the deployment. You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
     *
     * ```json
     * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
     * }
     * ```
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GreengrassV2::Deployment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeploymentProps);
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
export declare namespace CfnDeployment {
    /**
     * Contains information about a deployment's update to a component's configuration on AWS IoT Greengrass core devices. For more information, see [Update component configurations](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html
     */
    interface ComponentConfigurationUpdateProperty {
        /**
         * A serialized JSON string that contains the configuration object to merge to target devices. The core device merges this configuration with the component's existing configuration. If this is the first time a component deploys on a device, the core device merges this configuration with the component's default configuration. This means that the core device keeps it's existing configuration for keys and values that you don't specify in this object. For more information, see [Merge configuration updates](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html#merge-configuration-update) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html#cfn-greengrassv2-deployment-componentconfigurationupdate-merge
         */
        readonly merge?: string;
        /**
         * The list of configuration nodes to reset to default values on target devices. Use JSON pointers to specify each node to reset. JSON pointers start with a forward slash ( `/` ) and use forward slashes to separate the key for each level in the object. For more information, see the [JSON pointer specification](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) and [Reset configuration updates](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html#reset-configuration-update) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html#cfn-greengrassv2-deployment-componentconfigurationupdate-reset
         */
        readonly reset?: string[];
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about a component to deploy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html
     */
    interface ComponentDeploymentSpecificationProperty {
        /**
         * The version of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-componentversion
         */
        readonly componentVersion?: string;
        /**
         * The configuration updates to deploy for the component. You can define reset updates and merge updates. A reset updates the keys that you specify to the default configuration for the component. A merge updates the core device's component configuration with the keys and values that you specify. The AWS IoT Greengrass Core software applies reset updates before it applies merge updates. For more information, see [Update component configuration](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-configurationupdate
         */
        readonly configurationUpdate?: CfnDeployment.ComponentConfigurationUpdateProperty | cdk.IResolvable;
        /**
         * The system user and group that the  software uses to run component processes on the core device. If you omit this parameter, the  software uses the system user and group that you configure for the core device. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) in the *AWS IoT Greengrass V2 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-runwith
         */
        readonly runWith?: CfnDeployment.ComponentRunWithProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information system user and group that the AWS IoT Greengrass Core software uses to run component processes on the core device. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html
     */
    interface ComponentRunWithProperty {
        /**
         * The POSIX system user and (optional) group to use to run this component. Specify the user and group separated by a colon ( `:` ) in the following format: `user:group` . The group is optional. If you don't specify a group, the AWS IoT Greengrass Core software uses the primary user for the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-posixuser
         */
        readonly posixUser?: string;
        /**
         * The system resource limits to apply to this component's process on the core device. AWS IoT Greengrass supports this feature only on Linux core devices.
         *
         * If you omit this parameter, the AWS IoT Greengrass Core software uses the default system resource limits that you configure on the AWS IoT Greengrass nucleus component. For more information, see [Configure system resource limits for components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-system-resource-limits) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-systemresourcelimits
         */
        readonly systemResourceLimits?: CfnDeployment.SystemResourceLimitsProperty | cdk.IResolvable;
        /**
         * The Windows user to use to run this component on Windows core devices. The user must exist on each Windows core device, and its name and password must be in the LocalSystem account's Credentials Manager instance.
         *
         * If you omit this parameter, the AWS IoT Greengrass Core software uses the default Windows user that you configure on the AWS IoT Greengrass nucleus component. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-windowsuser
         */
        readonly windowsUser?: string;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about a deployment's policy that defines when components are safe to update.
     *
     * Each component on a device can report whether or not it's ready to update. After a component and its dependencies are ready, they can apply the update in the deployment. You can configure whether or not the deployment notifies components of an update and waits for a response. You specify the amount of time each component has to respond to the update notification.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html
     */
    interface DeploymentComponentUpdatePolicyProperty {
        /**
         * Whether or not to notify components and wait for components to become safe to update. Choose from the following options:
         *
         * - `NOTIFY_COMPONENTS` – The deployment notifies each component before it stops and updates that component. Components can use the [SubscribeToComponentUpdates](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-subscribetocomponentupdates) IPC operation to receive these notifications. Then, components can respond with the [DeferComponentUpdate](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-defercomponentupdate) IPC operation. For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/latest/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
         * - `SKIP_NOTIFY_COMPONENTS` – The deployment doesn't notify components or wait for them to be safe to update.
         *
         * Default: `NOTIFY_COMPONENTS`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html#cfn-greengrassv2-deployment-deploymentcomponentupdatepolicy-action
         */
        readonly action?: string;
        /**
         * The amount of time in seconds that each component on a device has to report that it's safe to update. If the component waits for longer than this timeout, then the deployment proceeds on the device.
         *
         * Default: `60`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html#cfn-greengrassv2-deployment-deploymentcomponentupdatepolicy-timeoutinseconds
         */
        readonly timeoutInSeconds?: number;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about how long a component on a core device can validate its configuration updates before it times out. Components can use the [SubscribeToValidateConfigurationUpdates](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-subscribetovalidateconfigurationupdates) IPC operation to receive notifications when a deployment specifies a configuration update. Then, components can respond with the [SendConfigurationValidityReport](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-sendconfigurationvalidityreport) IPC operation. For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/latest/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentconfigurationvalidationpolicy.html
     */
    interface DeploymentConfigurationValidationPolicyProperty {
        /**
         * The amount of time in seconds that a component can validate its configuration updates. If the validation time exceeds this timeout, then the deployment proceeds for the device.
         *
         * Default: `30`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentconfigurationvalidationpolicy.html#cfn-greengrassv2-deployment-deploymentconfigurationvalidationpolicy-timeoutinseconds
         */
        readonly timeoutInSeconds?: number;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about an AWS IoT job configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html
     */
    interface DeploymentIoTJobConfigurationProperty {
        /**
         * The stop configuration for the job. This configuration defines when and how to stop a job rollout.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-abortconfig
         */
        readonly abortConfig?: CfnDeployment.IoTJobAbortConfigProperty | cdk.IResolvable;
        /**
         * The rollout configuration for the job. This configuration defines the rate at which the job rolls out to the fleet of target devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-jobexecutionsrolloutconfig
         */
        readonly jobExecutionsRolloutConfig?: CfnDeployment.IoTJobExecutionsRolloutConfigProperty | cdk.IResolvable;
        /**
         * The timeout configuration for the job. This configuration defines the amount of time each device has to complete the job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-timeoutconfig
         */
        readonly timeoutConfig?: CfnDeployment.IoTJobTimeoutConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about policies that define how a deployment updates components and handles failure.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html
     */
    interface DeploymentPoliciesProperty {
        /**
         * The component update policy for the configuration deployment. This policy defines when it's safe to deploy the configuration to devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-componentupdatepolicy
         */
        readonly componentUpdatePolicy?: CfnDeployment.DeploymentComponentUpdatePolicyProperty | cdk.IResolvable;
        /**
         * The configuration validation policy for the configuration deployment. This policy defines how long each component has to validate its configure updates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-configurationvalidationpolicy
         */
        readonly configurationValidationPolicy?: CfnDeployment.DeploymentConfigurationValidationPolicyProperty | cdk.IResolvable;
        /**
         * The failure handling policy for the configuration deployment. This policy defines what to do if the deployment fails.
         *
         * Default: `ROLLBACK`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-failurehandlingpolicy
         */
        readonly failureHandlingPolicy?: string;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains a list of criteria that define when and how to cancel a configuration deployment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortconfig.html
     */
    interface IoTJobAbortConfigProperty {
        /**
         * The list of criteria that define when and how to cancel the configuration deployment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortconfig.html#cfn-greengrassv2-deployment-iotjobabortconfig-criterialist
         */
        readonly criteriaList: Array<CfnDeployment.IoTJobAbortCriteriaProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains criteria that define when and how to cancel a job.
     *
     * The deployment stops if the following conditions are true:
     *
     * - The number of things that receive the deployment exceeds the `minNumberOfExecutedThings` .
     * - The percentage of failures with type `failureType` exceeds the `thresholdPercentage` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html
     */
    interface IoTJobAbortCriteriaProperty {
        /**
         * The action to perform when the criteria are met.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-action
         */
        readonly action: string;
        /**
         * The type of job deployment failure that can cancel a job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-failuretype
         */
        readonly failureType: string;
        /**
         * The minimum number of things that receive the configuration before the job can cancel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-minnumberofexecutedthings
         */
        readonly minNumberOfExecutedThings: number;
        /**
         * The minimum percentage of `failureType` failures that occur before the job can cancel.
         *
         * This parameter supports up to two digits after the decimal (for example, you can specify `10.9` or `10.99` , but not `10.999` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-thresholdpercentage
         */
        readonly thresholdPercentage: number;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about the rollout configuration for a job. This configuration defines the rate at which the job deploys a configuration to a fleet of target devices.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html
     */
    interface IoTJobExecutionsRolloutConfigProperty {
        /**
         * The exponential rate to increase the job rollout rate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html#cfn-greengrassv2-deployment-iotjobexecutionsrolloutconfig-exponentialrate
         */
        readonly exponentialRate?: CfnDeployment.IoTJobExponentialRolloutRateProperty | cdk.IResolvable;
        /**
         * The maximum number of devices that receive a pending job notification, per minute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html#cfn-greengrassv2-deployment-iotjobexecutionsrolloutconfig-maximumperminute
         */
        readonly maximumPerMinute?: number;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about an exponential rollout rate for a configuration deployment job.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html
     */
    interface IoTJobExponentialRolloutRateProperty {
        /**
         * The minimum number of devices that receive a pending job notification, per minute, when the job starts. This parameter defines the initial rollout rate of the job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-baserateperminute
         */
        readonly baseRatePerMinute: number;
        /**
         * The exponential factor to increase the rollout rate for the job.
         *
         * This parameter supports up to one digit after the decimal (for example, you can specify `1.5` , but not `1.55` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-incrementfactor
         */
        readonly incrementFactor: number;
        /**
         * The criteria to increase the rollout rate for the job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-rateincreasecriteria
         */
        readonly rateIncreaseCriteria: any | cdk.IResolvable | cdk.IResolvable;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about the timeout configuration for a job.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobtimeoutconfig.html
     */
    interface IoTJobTimeoutConfigProperty {
        /**
         * The amount of time, in minutes, that devices have to complete the job. The timer starts when the job status is set to `IN_PROGRESS` . If the job status doesn't change to a terminal state before the time expires, then the job status is set to `TIMED_OUT` .
         *
         * The timeout interval must be between 1 minute and 7 days (10080 minutes).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobtimeoutconfig.html#cfn-greengrassv2-deployment-iotjobtimeoutconfig-inprogresstimeoutinminutes
         */
        readonly inProgressTimeoutInMinutes?: number;
    }
}
export declare namespace CfnDeployment {
    /**
     * Contains information about system resource limits that the  software applies to a component's processes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html
     */
    interface SystemResourceLimitsProperty {
        /**
         * The maximum amount of CPU time that a component's processes can use on the core device. A core device's total CPU time is equivalent to the device's number of CPU cores. For example, on a core device with 4 CPU cores, you can set this value to 2 to limit the component's processes to 50 percent usage of each CPU core. On a device with 1 CPU core, you can set this value to 0.25 to limit the component's processes to 25 percent usage of the CPU. If you set this value to a number greater than the number of CPU cores, the AWS IoT Greengrass Core software doesn't limit the component's CPU usage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html#cfn-greengrassv2-deployment-systemresourcelimits-cpus
         */
        readonly cpus?: number;
        /**
         * The maximum amount of RAM, expressed in kilobytes, that a component's processes can use on the core device. For more information, see [Configure system resource limits for components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-system-resource-limits) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html#cfn-greengrassv2-deployment-systemresourcelimits-memory
         */
        readonly memory?: number;
    }
}
