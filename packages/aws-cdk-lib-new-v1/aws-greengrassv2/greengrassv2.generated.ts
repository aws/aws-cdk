/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a component.
 *
 * Components are software that run on AWS IoT Greengrass core devices. After you develop and test a component on your core device, you can use this operation to upload your component to AWS IoT Greengrass . Then, you can deploy the component to other core devices.
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
 * This function accepts Lambda functions in all supported versions of Python, Node.js, and Java runtimes. AWS IoT Greengrass doesn't apply any additional restrictions on deprecated Lambda runtime versions.
 *
 * To create a component from a Lambda function, specify `lambdaFunction` when you call this operation.
 *
 * @cloudformationResource AWS::GreengrassV2::ComponentVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html
 */
export class CfnComponentVersion extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GreengrassV2::ComponentVersion";

  /**
   * Build a CfnComponentVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponentVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnComponentVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnComponentVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the component version.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the component.
   *
   * @cloudformationAttribute ComponentName
   */
  public readonly attrComponentName: string;

  /**
   * The version of the component.
   *
   * @cloudformationAttribute ComponentVersion
   */
  public readonly attrComponentVersion: string;

  /**
   * The recipe to use to create the component.
   */
  public inlineRecipe?: string;

  /**
   * The parameters to create a component from a Lambda function.
   */
  public lambdaFunction?: cdk.IResolvable | CfnComponentVersion.LambdaFunctionRecipeSourceProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the component version.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnComponentVersionProps = {}) {
    super(scope, id, {
      "type": CfnComponentVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrComponentName = cdk.Token.asString(this.getAtt("ComponentName", cdk.ResolutionTypeHint.STRING));
    this.attrComponentVersion = cdk.Token.asString(this.getAtt("ComponentVersion", cdk.ResolutionTypeHint.STRING));
    this.inlineRecipe = props.inlineRecipe;
    this.lambdaFunction = props.lambdaFunction;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::GreengrassV2::ComponentVersion", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "inlineRecipe": this.inlineRecipe,
      "lambdaFunction": this.lambdaFunction,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponentVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnComponentVersionPropsToCloudFormation(props);
  }
}

export namespace CfnComponentVersion {
  /**
   * Contains information about an AWS Lambda function to import to create a component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html
   */
  export interface LambdaFunctionRecipeSourceProperty {
    /**
     * The component versions on which this Lambda function component depends.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentdependencies
     */
    readonly componentDependencies?: cdk.IResolvable | Record<string, CfnComponentVersion.ComponentDependencyRequirementProperty | cdk.IResolvable>;

    /**
     * The system and runtime parameters for the Lambda function as it runs on the AWS IoT Greengrass core device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentlambdaparameters
     */
    readonly componentLambdaParameters?: cdk.IResolvable | CfnComponentVersion.LambdaExecutionParametersProperty;

    /**
     * The name of the component.
     *
     * Defaults to the name of the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentname
     */
    readonly componentName?: string;

    /**
     * The platforms that the component version supports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentplatforms
     */
    readonly componentPlatforms?: Array<CfnComponentVersion.ComponentPlatformProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The version of the component.
     *
     * Defaults to the version of the Lambda function as a semantic version. For example, if your function version is `3` , the component version becomes `3.0.0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-componentversion
     */
    readonly componentVersion?: string;

    /**
     * The ARN of the Lambda function.
     *
     * The ARN must include the version of the function to import. You can't use version aliases like `$LATEST` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdafunctionrecipesource.html#cfn-greengrassv2-componentversion-lambdafunctionrecipesource-lambdaarn
     */
    readonly lambdaArn?: string;
  }

  /**
   * Contains information about a component dependency for a Lambda function component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html
   */
  export interface ComponentDependencyRequirementProperty {
    /**
     * The type of this dependency. Choose from the following options:.
     *
     * - `SOFT` – The component doesn't restart if the dependency changes state.
     * - `HARD` – The component restarts if the dependency changes state.
     *
     * Default: `HARD`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html#cfn-greengrassv2-componentversion-componentdependencyrequirement-dependencytype
     */
    readonly dependencyType?: string;

    /**
     * The component version requirement for the component dependency.
     *
     * AWS IoT Greengrass uses semantic version constraints. For more information, see [Semantic Versioning](https://docs.aws.amazon.com/https://semver.org/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentdependencyrequirement.html#cfn-greengrassv2-componentversion-componentdependencyrequirement-versionrequirement
     */
    readonly versionRequirement?: string;
  }

  /**
   * Contains parameters for a Lambda function that runs on AWS IoT Greengrass .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html
   */
  export interface LambdaExecutionParametersProperty {
    /**
     * The map of environment variables that are available to the Lambda function when it runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-environmentvariables
     */
    readonly environmentVariables?: cdk.IResolvable | Record<string, string>;

    /**
     * The list of event sources to which to subscribe to receive work messages.
     *
     * The Lambda function runs when it receives a message from an event source. You can subscribe this function to local publish/subscribe messages and AWS IoT Core MQTT messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-eventsources
     */
    readonly eventSources?: Array<cdk.IResolvable | CfnComponentVersion.LambdaEventSourceProperty> | cdk.IResolvable;

    /**
     * The list of arguments to pass to the Lambda function when it runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-execargs
     */
    readonly execArgs?: Array<string>;

    /**
     * The encoding type that the Lambda function supports.
     *
     * Default: `json`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-inputpayloadencodingtype
     */
    readonly inputPayloadEncodingType?: string;

    /**
     * The parameters for the Linux process that contains the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-linuxprocessparams
     */
    readonly linuxProcessParams?: cdk.IResolvable | CfnComponentVersion.LambdaLinuxProcessParamsProperty;

    /**
     * The maximum amount of time in seconds that a non-pinned Lambda function can idle before the AWS IoT Greengrass Core software stops its process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxidletimeinseconds
     */
    readonly maxIdleTimeInSeconds?: number;

    /**
     * The maximum number of instances that a non-pinned Lambda function can run at the same time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxinstancescount
     */
    readonly maxInstancesCount?: number;

    /**
     * The maximum size of the message queue for the Lambda function component.
     *
     * The AWS IoT Greengrass core device stores messages in a FIFO (first-in-first-out) queue until it can run the Lambda function to consume each message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-maxqueuesize
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-pinned
     */
    readonly pinned?: boolean | cdk.IResolvable;

    /**
     * The interval in seconds at which a pinned (also known as long-lived) Lambda function component sends status updates to the Lambda manager component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-statustimeoutinseconds
     */
    readonly statusTimeoutInSeconds?: number;

    /**
     * The maximum amount of time in seconds that the Lambda function can process a work item.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaexecutionparameters.html#cfn-greengrassv2-componentversion-lambdaexecutionparameters-timeoutinseconds
     */
    readonly timeoutInSeconds?: number;
  }

  /**
   * Contains information about an event source for an AWS Lambda function.
   *
   * The event source defines the topics on which this Lambda function subscribes to receive messages that run the function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html
   */
  export interface LambdaEventSourceProperty {
    /**
     * The topic to which to subscribe to receive event messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html#cfn-greengrassv2-componentversion-lambdaeventsource-topic
     */
    readonly topic?: string;

    /**
     * The type of event source. Choose from the following options:.
     *
     * - `PUB_SUB` – Subscribe to local publish/subscribe messages. This event source type doesn't support MQTT wildcards ( `+` and `#` ) in the event source topic.
     * - `IOT_CORE` – Subscribe to AWS IoT Core MQTT messages. This event source type supports MQTT wildcards ( `+` and `#` ) in the event source topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdaeventsource.html#cfn-greengrassv2-componentversion-lambdaeventsource-type
     */
    readonly type?: string;
  }

  /**
   * Contains parameters for a Linux process that contains an AWS Lambda function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html
   */
  export interface LambdaLinuxProcessParamsProperty {
    /**
     * The parameters for the container in which the Lambda function runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html#cfn-greengrassv2-componentversion-lambdalinuxprocessparams-containerparams
     */
    readonly containerParams?: cdk.IResolvable | CfnComponentVersion.LambdaContainerParamsProperty;

    /**
     * The isolation mode for the process that contains the Lambda function.
     *
     * The process can run in an isolated runtime environment inside the AWS IoT Greengrass container, or as a regular process outside any container.
     *
     * Default: `GreengrassContainer`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdalinuxprocessparams.html#cfn-greengrassv2-componentversion-lambdalinuxprocessparams-isolationmode
     */
    readonly isolationMode?: string;
  }

  /**
   * Contains information about a container in which AWS Lambda functions run on AWS IoT Greengrass core devices.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html
   */
  export interface LambdaContainerParamsProperty {
    /**
     * The list of system devices that the container can access.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-devices
     */
    readonly devices?: Array<cdk.IResolvable | CfnComponentVersion.LambdaDeviceMountProperty> | cdk.IResolvable;

    /**
     * The memory size of the container, expressed in kilobytes.
     *
     * Default: `16384` (16 MB)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-memorysizeinkb
     */
    readonly memorySizeInKb?: number;

    /**
     * Whether or not the container can read information from the device's `/sys` folder.
     *
     * Default: `false`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-mountrosysfs
     */
    readonly mountRoSysfs?: boolean | cdk.IResolvable;

    /**
     * The list of volumes that the container can access.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdacontainerparams.html#cfn-greengrassv2-componentversion-lambdacontainerparams-volumes
     */
    readonly volumes?: Array<cdk.IResolvable | CfnComponentVersion.LambdaVolumeMountProperty> | cdk.IResolvable;
  }

  /**
   * Contains information about a volume that Linux processes in a container can access.
   *
   * When you define a volume, the AWS IoT Greengrass Core software mounts the source files to the destination inside the container.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html
   */
  export interface LambdaVolumeMountProperty {
    /**
     * Whether or not to add the AWS IoT Greengrass user group as an owner of the volume.
     *
     * Default: `false`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-addgroupowner
     */
    readonly addGroupOwner?: boolean | cdk.IResolvable;

    /**
     * The path to the logical volume in the file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-destinationpath
     */
    readonly destinationPath?: string;

    /**
     * The permission to access the volume: read/only ( `ro` ) or read/write ( `rw` ).
     *
     * Default: `ro`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-permission
     */
    readonly permission?: string;

    /**
     * The path to the physical volume in the file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdavolumemount.html#cfn-greengrassv2-componentversion-lambdavolumemount-sourcepath
     */
    readonly sourcePath?: string;
  }

  /**
   * Contains information about a device that Linux processes in a container can access.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html
   */
  export interface LambdaDeviceMountProperty {
    /**
     * Whether or not to add the component's system user as an owner of the device.
     *
     * Default: `false`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-addgroupowner
     */
    readonly addGroupOwner?: boolean | cdk.IResolvable;

    /**
     * The mount path for the device in the file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-path
     */
    readonly path?: string;

    /**
     * The permission to access the device: read/only ( `ro` ) or read/write ( `rw` ).
     *
     * Default: `ro`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-lambdadevicemount.html#cfn-greengrassv2-componentversion-lambdadevicemount-permission
     */
    readonly permission?: string;
  }

  /**
   * Contains information about a platform that a component supports.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html
   */
  export interface ComponentPlatformProperty {
    /**
     * A dictionary of attributes for the platform.
     *
     * The AWS IoT Greengrass Core software defines the `os` and `platform` by default. You can specify additional platform attributes for a core device when you deploy the AWS IoT Greengrass nucleus component. For more information, see the [AWS IoT Greengrass nucleus component](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html#cfn-greengrassv2-componentversion-componentplatform-attributes
     */
    readonly attributes?: cdk.IResolvable | Record<string, string>;

    /**
     * The friendly name of the platform. This name helps you identify the platform.
     *
     * If you omit this parameter, AWS IoT Greengrass creates a friendly name from the `os` and `architecture` of the platform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-componentversion-componentplatform.html#cfn-greengrassv2-componentversion-componentplatform-name
     */
    readonly name?: string;
  }
}

/**
 * Properties for defining a `CfnComponentVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html
 */
export interface CfnComponentVersionProps {
  /**
   * The recipe to use to create the component.
   *
   * The recipe defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform compatibility.
   *
   * You must specify either `InlineRecipe` or `LambdaFunction` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-inlinerecipe
   */
  readonly inlineRecipe?: string;

  /**
   * The parameters to create a component from a Lambda function.
   *
   * You must specify either `InlineRecipe` or `LambdaFunction` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-lambdafunction
   */
  readonly lambdaFunction?: cdk.IResolvable | CfnComponentVersion.LambdaFunctionRecipeSourceProperty;

  /**
   * Application-specific metadata to attach to the component version.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-componentversion.html#cfn-greengrassv2-componentversion-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `ComponentDependencyRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentDependencyRequirementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionComponentDependencyRequirementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dependencyType", cdk.validateString)(properties.dependencyType));
  errors.collect(cdk.propertyValidator("versionRequirement", cdk.validateString)(properties.versionRequirement));
  return errors.wrap("supplied properties not correct for \"ComponentDependencyRequirementProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionComponentDependencyRequirementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionComponentDependencyRequirementPropertyValidator(properties).assertSuccess();
  return {
    "DependencyType": cdk.stringToCloudFormation(properties.dependencyType),
    "VersionRequirement": cdk.stringToCloudFormation(properties.versionRequirement)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionComponentDependencyRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.ComponentDependencyRequirementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.ComponentDependencyRequirementProperty>();
  ret.addPropertyResult("dependencyType", "DependencyType", (properties.DependencyType != null ? cfn_parse.FromCloudFormation.getString(properties.DependencyType) : undefined));
  ret.addPropertyResult("versionRequirement", "VersionRequirement", (properties.VersionRequirement != null ? cfn_parse.FromCloudFormation.getString(properties.VersionRequirement) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaEventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaEventSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionLambdaEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("topic", cdk.validateString)(properties.topic));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"LambdaEventSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionLambdaEventSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionLambdaEventSourcePropertyValidator(properties).assertSuccess();
  return {
    "Topic": cdk.stringToCloudFormation(properties.topic),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentVersion.LambdaEventSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaEventSourceProperty>();
  ret.addPropertyResult("topic", "Topic", (properties.Topic != null ? cfn_parse.FromCloudFormation.getString(properties.Topic) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaVolumeMountProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaVolumeMountProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionLambdaVolumeMountPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addGroupOwner", cdk.validateBoolean)(properties.addGroupOwner));
  errors.collect(cdk.propertyValidator("destinationPath", cdk.validateString)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("permission", cdk.validateString)(properties.permission));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"LambdaVolumeMountProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionLambdaVolumeMountPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionLambdaVolumeMountPropertyValidator(properties).assertSuccess();
  return {
    "AddGroupOwner": cdk.booleanToCloudFormation(properties.addGroupOwner),
    "DestinationPath": cdk.stringToCloudFormation(properties.destinationPath),
    "Permission": cdk.stringToCloudFormation(properties.permission),
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaVolumeMountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentVersion.LambdaVolumeMountProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaVolumeMountProperty>();
  ret.addPropertyResult("addGroupOwner", "AddGroupOwner", (properties.AddGroupOwner != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddGroupOwner) : undefined));
  ret.addPropertyResult("destinationPath", "DestinationPath", (properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined));
  ret.addPropertyResult("permission", "Permission", (properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined));
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaDeviceMountProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaDeviceMountProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionLambdaDeviceMountPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addGroupOwner", cdk.validateBoolean)(properties.addGroupOwner));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("permission", cdk.validateString)(properties.permission));
  return errors.wrap("supplied properties not correct for \"LambdaDeviceMountProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionLambdaDeviceMountPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionLambdaDeviceMountPropertyValidator(properties).assertSuccess();
  return {
    "AddGroupOwner": cdk.booleanToCloudFormation(properties.addGroupOwner),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Permission": cdk.stringToCloudFormation(properties.permission)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaDeviceMountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentVersion.LambdaDeviceMountProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaDeviceMountProperty>();
  ret.addPropertyResult("addGroupOwner", "AddGroupOwner", (properties.AddGroupOwner != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddGroupOwner) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("permission", "Permission", (properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaContainerParamsProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaContainerParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionLambdaContainerParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("devices", cdk.listValidator(CfnComponentVersionLambdaDeviceMountPropertyValidator))(properties.devices));
  errors.collect(cdk.propertyValidator("memorySizeInKb", cdk.validateNumber)(properties.memorySizeInKb));
  errors.collect(cdk.propertyValidator("mountRoSysfs", cdk.validateBoolean)(properties.mountRoSysfs));
  errors.collect(cdk.propertyValidator("volumes", cdk.listValidator(CfnComponentVersionLambdaVolumeMountPropertyValidator))(properties.volumes));
  return errors.wrap("supplied properties not correct for \"LambdaContainerParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionLambdaContainerParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionLambdaContainerParamsPropertyValidator(properties).assertSuccess();
  return {
    "Devices": cdk.listMapper(convertCfnComponentVersionLambdaDeviceMountPropertyToCloudFormation)(properties.devices),
    "MemorySizeInKB": cdk.numberToCloudFormation(properties.memorySizeInKb),
    "MountROSysfs": cdk.booleanToCloudFormation(properties.mountRoSysfs),
    "Volumes": cdk.listMapper(convertCfnComponentVersionLambdaVolumeMountPropertyToCloudFormation)(properties.volumes)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaContainerParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentVersion.LambdaContainerParamsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaContainerParamsProperty>();
  ret.addPropertyResult("devices", "Devices", (properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionLambdaDeviceMountPropertyFromCloudFormation)(properties.Devices) : undefined));
  ret.addPropertyResult("memorySizeInKb", "MemorySizeInKB", (properties.MemorySizeInKB != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemorySizeInKB) : undefined));
  ret.addPropertyResult("mountRoSysfs", "MountROSysfs", (properties.MountROSysfs != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MountROSysfs) : undefined));
  ret.addPropertyResult("volumes", "Volumes", (properties.Volumes != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionLambdaVolumeMountPropertyFromCloudFormation)(properties.Volumes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaLinuxProcessParamsProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaLinuxProcessParamsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionLambdaLinuxProcessParamsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerParams", CfnComponentVersionLambdaContainerParamsPropertyValidator)(properties.containerParams));
  errors.collect(cdk.propertyValidator("isolationMode", cdk.validateString)(properties.isolationMode));
  return errors.wrap("supplied properties not correct for \"LambdaLinuxProcessParamsProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionLambdaLinuxProcessParamsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionLambdaLinuxProcessParamsPropertyValidator(properties).assertSuccess();
  return {
    "ContainerParams": convertCfnComponentVersionLambdaContainerParamsPropertyToCloudFormation(properties.containerParams),
    "IsolationMode": cdk.stringToCloudFormation(properties.isolationMode)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaLinuxProcessParamsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentVersion.LambdaLinuxProcessParamsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaLinuxProcessParamsProperty>();
  ret.addPropertyResult("containerParams", "ContainerParams", (properties.ContainerParams != null ? CfnComponentVersionLambdaContainerParamsPropertyFromCloudFormation(properties.ContainerParams) : undefined));
  ret.addPropertyResult("isolationMode", "IsolationMode", (properties.IsolationMode != null ? cfn_parse.FromCloudFormation.getString(properties.IsolationMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaExecutionParametersProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaExecutionParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionLambdaExecutionParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("environmentVariables", cdk.hashValidator(cdk.validateString))(properties.environmentVariables));
  errors.collect(cdk.propertyValidator("eventSources", cdk.listValidator(CfnComponentVersionLambdaEventSourcePropertyValidator))(properties.eventSources));
  errors.collect(cdk.propertyValidator("execArgs", cdk.listValidator(cdk.validateString))(properties.execArgs));
  errors.collect(cdk.propertyValidator("inputPayloadEncodingType", cdk.validateString)(properties.inputPayloadEncodingType));
  errors.collect(cdk.propertyValidator("linuxProcessParams", CfnComponentVersionLambdaLinuxProcessParamsPropertyValidator)(properties.linuxProcessParams));
  errors.collect(cdk.propertyValidator("maxIdleTimeInSeconds", cdk.validateNumber)(properties.maxIdleTimeInSeconds));
  errors.collect(cdk.propertyValidator("maxInstancesCount", cdk.validateNumber)(properties.maxInstancesCount));
  errors.collect(cdk.propertyValidator("maxQueueSize", cdk.validateNumber)(properties.maxQueueSize));
  errors.collect(cdk.propertyValidator("pinned", cdk.validateBoolean)(properties.pinned));
  errors.collect(cdk.propertyValidator("statusTimeoutInSeconds", cdk.validateNumber)(properties.statusTimeoutInSeconds));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  return errors.wrap("supplied properties not correct for \"LambdaExecutionParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionLambdaExecutionParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionLambdaExecutionParametersPropertyValidator(properties).assertSuccess();
  return {
    "EnvironmentVariables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.environmentVariables),
    "EventSources": cdk.listMapper(convertCfnComponentVersionLambdaEventSourcePropertyToCloudFormation)(properties.eventSources),
    "ExecArgs": cdk.listMapper(cdk.stringToCloudFormation)(properties.execArgs),
    "InputPayloadEncodingType": cdk.stringToCloudFormation(properties.inputPayloadEncodingType),
    "LinuxProcessParams": convertCfnComponentVersionLambdaLinuxProcessParamsPropertyToCloudFormation(properties.linuxProcessParams),
    "MaxIdleTimeInSeconds": cdk.numberToCloudFormation(properties.maxIdleTimeInSeconds),
    "MaxInstancesCount": cdk.numberToCloudFormation(properties.maxInstancesCount),
    "MaxQueueSize": cdk.numberToCloudFormation(properties.maxQueueSize),
    "Pinned": cdk.booleanToCloudFormation(properties.pinned),
    "StatusTimeoutInSeconds": cdk.numberToCloudFormation(properties.statusTimeoutInSeconds),
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaExecutionParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentVersion.LambdaExecutionParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaExecutionParametersProperty>();
  ret.addPropertyResult("environmentVariables", "EnvironmentVariables", (properties.EnvironmentVariables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.EnvironmentVariables) : undefined));
  ret.addPropertyResult("eventSources", "EventSources", (properties.EventSources != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionLambdaEventSourcePropertyFromCloudFormation)(properties.EventSources) : undefined));
  ret.addPropertyResult("execArgs", "ExecArgs", (properties.ExecArgs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExecArgs) : undefined));
  ret.addPropertyResult("inputPayloadEncodingType", "InputPayloadEncodingType", (properties.InputPayloadEncodingType != null ? cfn_parse.FromCloudFormation.getString(properties.InputPayloadEncodingType) : undefined));
  ret.addPropertyResult("linuxProcessParams", "LinuxProcessParams", (properties.LinuxProcessParams != null ? CfnComponentVersionLambdaLinuxProcessParamsPropertyFromCloudFormation(properties.LinuxProcessParams) : undefined));
  ret.addPropertyResult("maxIdleTimeInSeconds", "MaxIdleTimeInSeconds", (properties.MaxIdleTimeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxIdleTimeInSeconds) : undefined));
  ret.addPropertyResult("maxInstancesCount", "MaxInstancesCount", (properties.MaxInstancesCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxInstancesCount) : undefined));
  ret.addPropertyResult("maxQueueSize", "MaxQueueSize", (properties.MaxQueueSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxQueueSize) : undefined));
  ret.addPropertyResult("pinned", "Pinned", (properties.Pinned != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Pinned) : undefined));
  ret.addPropertyResult("statusTimeoutInSeconds", "StatusTimeoutInSeconds", (properties.StatusTimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.StatusTimeoutInSeconds) : undefined));
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentPlatformProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentPlatformProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionComponentPlatformPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"ComponentPlatformProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionComponentPlatformPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionComponentPlatformPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionComponentPlatformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersion.ComponentPlatformProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.ComponentPlatformProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaFunctionRecipeSourceProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionRecipeSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionLambdaFunctionRecipeSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentDependencies", cdk.hashValidator(CfnComponentVersionComponentDependencyRequirementPropertyValidator))(properties.componentDependencies));
  errors.collect(cdk.propertyValidator("componentLambdaParameters", CfnComponentVersionLambdaExecutionParametersPropertyValidator)(properties.componentLambdaParameters));
  errors.collect(cdk.propertyValidator("componentName", cdk.validateString)(properties.componentName));
  errors.collect(cdk.propertyValidator("componentPlatforms", cdk.listValidator(CfnComponentVersionComponentPlatformPropertyValidator))(properties.componentPlatforms));
  errors.collect(cdk.propertyValidator("componentVersion", cdk.validateString)(properties.componentVersion));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  return errors.wrap("supplied properties not correct for \"LambdaFunctionRecipeSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionLambdaFunctionRecipeSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionLambdaFunctionRecipeSourcePropertyValidator(properties).assertSuccess();
  return {
    "ComponentDependencies": cdk.hashMapper(convertCfnComponentVersionComponentDependencyRequirementPropertyToCloudFormation)(properties.componentDependencies),
    "ComponentLambdaParameters": convertCfnComponentVersionLambdaExecutionParametersPropertyToCloudFormation(properties.componentLambdaParameters),
    "ComponentName": cdk.stringToCloudFormation(properties.componentName),
    "ComponentPlatforms": cdk.listMapper(convertCfnComponentVersionComponentPlatformPropertyToCloudFormation)(properties.componentPlatforms),
    "ComponentVersion": cdk.stringToCloudFormation(properties.componentVersion),
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionLambdaFunctionRecipeSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentVersion.LambdaFunctionRecipeSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersion.LambdaFunctionRecipeSourceProperty>();
  ret.addPropertyResult("componentDependencies", "ComponentDependencies", (properties.ComponentDependencies != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentVersionComponentDependencyRequirementPropertyFromCloudFormation)(properties.ComponentDependencies) : undefined));
  ret.addPropertyResult("componentLambdaParameters", "ComponentLambdaParameters", (properties.ComponentLambdaParameters != null ? CfnComponentVersionLambdaExecutionParametersPropertyFromCloudFormation(properties.ComponentLambdaParameters) : undefined));
  ret.addPropertyResult("componentName", "ComponentName", (properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined));
  ret.addPropertyResult("componentPlatforms", "ComponentPlatforms", (properties.ComponentPlatforms != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentVersionComponentPlatformPropertyFromCloudFormation)(properties.ComponentPlatforms) : undefined));
  ret.addPropertyResult("componentVersion", "ComponentVersion", (properties.ComponentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentVersion) : undefined));
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnComponentVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inlineRecipe", cdk.validateString)(properties.inlineRecipe));
  errors.collect(cdk.propertyValidator("lambdaFunction", CfnComponentVersionLambdaFunctionRecipeSourcePropertyValidator)(properties.lambdaFunction));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnComponentVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnComponentVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentVersionPropsValidator(properties).assertSuccess();
  return {
    "InlineRecipe": cdk.stringToCloudFormation(properties.inlineRecipe),
    "LambdaFunction": convertCfnComponentVersionLambdaFunctionRecipeSourcePropertyToCloudFormation(properties.lambdaFunction),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnComponentVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentVersionProps>();
  ret.addPropertyResult("inlineRecipe", "InlineRecipe", (properties.InlineRecipe != null ? cfn_parse.FromCloudFormation.getString(properties.InlineRecipe) : undefined));
  ret.addPropertyResult("lambdaFunction", "LambdaFunction", (properties.LambdaFunction != null ? CfnComponentVersionLambdaFunctionRecipeSourcePropertyFromCloudFormation(properties.LambdaFunction) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a continuous deployment for a target, which is a AWS IoT Greengrass core device or group of core devices.
 *
 * When you add a new core device to a group of core devices that has a deployment, AWS IoT Greengrass deploys that group's deployment to the new device.
 *
 * You can define one deployment for each target. When you create a new deployment for a target that has an existing deployment, you replace the previous deployment. AWS IoT Greengrass applies the new deployment to the target devices.
 *
 * You can only add, update, or delete up to 10 deployments at a time to a single target.
 *
 * Every deployment has a revision number that indicates how many deployment revisions you define for a target. Use this operation to create a new revision of an existing deployment. This operation returns the revision number of the new deployment when you create it.
 *
 * For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
 *
 * > Deployment resources are deleted when you delete stacks. To keep the deployments in a stack, you must specify `"DeletionPolicy": "Retain"` on each deployment resource in the stack template that you want to keep. For more information, see [DeletionPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 * >
 * > You can only delete up to 10 deployment resources at a time. If you delete more than 10 resources, you receive an error.
 *
 * @cloudformationResource AWS::GreengrassV2::Deployment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html
 */
export class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::GreengrassV2::Deployment";

  /**
   * Build a CfnDeployment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeployment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeploymentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeployment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the deployment.
   *
   * @cloudformationAttribute DeploymentId
   */
  public readonly attrDeploymentId: string;

  /**
   * The components to deploy.
   */
  public components?: cdk.IResolvable | Record<string, CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable>;

  /**
   * The name of the deployment.
   */
  public deploymentName?: string;

  /**
   * The deployment policies for the deployment.
   */
  public deploymentPolicies?: CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable;

  /**
   * The job configuration for the deployment configuration.
   */
  public iotJobConfiguration?: CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable;

  /**
   * The parent deployment's [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) for a subdeployment.
   */
  public parentTargetArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the deployment.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The ARN of the target AWS IoT thing or thing group.
   */
  public targetArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeploymentProps) {
    super(scope, id, {
      "type": CfnDeployment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "targetArn", this);

    this.attrDeploymentId = cdk.Token.asString(this.getAtt("DeploymentId", cdk.ResolutionTypeHint.STRING));
    this.components = props.components;
    this.deploymentName = props.deploymentName;
    this.deploymentPolicies = props.deploymentPolicies;
    this.iotJobConfiguration = props.iotJobConfiguration;
    this.parentTargetArn = props.parentTargetArn;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::GreengrassV2::Deployment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetArn = props.targetArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "components": this.components,
      "deploymentName": this.deploymentName,
      "deploymentPolicies": this.deploymentPolicies,
      "iotJobConfiguration": this.iotJobConfiguration,
      "parentTargetArn": this.parentTargetArn,
      "tags": this.tags.renderTags(),
      "targetArn": this.targetArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeployment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeploymentPropsToCloudFormation(props);
  }
}

export namespace CfnDeployment {
  /**
   * Contains information about a component to deploy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html
   */
  export interface ComponentDeploymentSpecificationProperty {
    /**
     * The version of the component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-componentversion
     */
    readonly componentVersion?: string;

    /**
     * The configuration updates to deploy for the component.
     *
     * You can define reset updates and merge updates. A reset updates the keys that you specify to the default configuration for the component. A merge updates the core device's component configuration with the keys and values that you specify. The AWS IoT Greengrass Core software applies reset updates before it applies merge updates. For more information, see [Update component configuration](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-configurationupdate
     */
    readonly configurationUpdate?: CfnDeployment.ComponentConfigurationUpdateProperty | cdk.IResolvable;

    /**
     * The system user and group that the  software uses to run component processes on the core device.
     *
     * If you omit this parameter, the  software uses the system user and group that you configure for the core device. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentdeploymentspecification.html#cfn-greengrassv2-deployment-componentdeploymentspecification-runwith
     */
    readonly runWith?: CfnDeployment.ComponentRunWithProperty | cdk.IResolvable;
  }

  /**
   * Contains information system user and group that the AWS IoT Greengrass Core software uses to run component processes on the core device.
   *
   * For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) in the *AWS IoT Greengrass V2 Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html
   */
  export interface ComponentRunWithProperty {
    /**
     * The POSIX system user and (optional) group to use to run this component.
     *
     * Specify the user and group separated by a colon ( `:` ) in the following format: `user:group` . The group is optional. If you don't specify a group, the AWS IoT Greengrass Core software uses the primary user for the group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-posixuser
     */
    readonly posixUser?: string;

    /**
     * The system resource limits to apply to this component's process on the core device.
     *
     * AWS IoT Greengrass supports this feature only on Linux core devices.
     *
     * If you omit this parameter, the AWS IoT Greengrass Core software uses the default system resource limits that you configure on the AWS IoT Greengrass nucleus component. For more information, see [Configure system resource limits for components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-system-resource-limits) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-systemresourcelimits
     */
    readonly systemResourceLimits?: cdk.IResolvable | CfnDeployment.SystemResourceLimitsProperty;

    /**
     * The Windows user to use to run this component on Windows core devices.
     *
     * The user must exist on each Windows core device, and its name and password must be in the LocalSystem account's Credentials Manager instance.
     *
     * If you omit this parameter, the AWS IoT Greengrass Core software uses the default Windows user that you configure on the AWS IoT Greengrass nucleus component. For more information, see [Configure the user and group that run components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-user) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentrunwith.html#cfn-greengrassv2-deployment-componentrunwith-windowsuser
     */
    readonly windowsUser?: string;
  }

  /**
   * Contains information about system resource limits that the  software applies to a component's processes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html
   */
  export interface SystemResourceLimitsProperty {
    /**
     * The maximum amount of CPU time that a component's processes can use on the core device.
     *
     * A core device's total CPU time is equivalent to the device's number of CPU cores. For example, on a core device with 4 CPU cores, you can set this value to 2 to limit the component's processes to 50 percent usage of each CPU core. On a device with 1 CPU core, you can set this value to 0.25 to limit the component's processes to 25 percent usage of the CPU. If you set this value to a number greater than the number of CPU cores, the AWS IoT Greengrass Core software doesn't limit the component's CPU usage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html#cfn-greengrassv2-deployment-systemresourcelimits-cpus
     */
    readonly cpus?: number;

    /**
     * The maximum amount of RAM, expressed in kilobytes, that a component's processes can use on the core device.
     *
     * For more information, see [Configure system resource limits for components](https://docs.aws.amazon.com/greengrass/v2/developerguide/configure-greengrass-core-v2.html#configure-component-system-resource-limits) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-systemresourcelimits.html#cfn-greengrassv2-deployment-systemresourcelimits-memory
     */
    readonly memory?: number;
  }

  /**
   * Contains information about a deployment's update to a component's configuration on AWS IoT Greengrass core devices.
   *
   * For more information, see [Update component configurations](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html) in the *AWS IoT Greengrass V2 Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html
   */
  export interface ComponentConfigurationUpdateProperty {
    /**
     * A serialized JSON string that contains the configuration object to merge to target devices.
     *
     * The core device merges this configuration with the component's existing configuration. If this is the first time a component deploys on a device, the core device merges this configuration with the component's default configuration. This means that the core device keeps it's existing configuration for keys and values that you don't specify in this object. For more information, see [Merge configuration updates](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html#merge-configuration-update) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html#cfn-greengrassv2-deployment-componentconfigurationupdate-merge
     */
    readonly merge?: string;

    /**
     * The list of configuration nodes to reset to default values on target devices.
     *
     * Use JSON pointers to specify each node to reset. JSON pointers start with a forward slash ( `/` ) and use forward slashes to separate the key for each level in the object. For more information, see the [JSON pointer specification](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6901) and [Reset configuration updates](https://docs.aws.amazon.com/greengrass/v2/developerguide/update-component-configurations.html#reset-configuration-update) in the *AWS IoT Greengrass V2 Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-componentconfigurationupdate.html#cfn-greengrassv2-deployment-componentconfigurationupdate-reset
     */
    readonly reset?: Array<string>;
  }

  /**
   * Contains information about an AWS IoT job configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html
   */
  export interface DeploymentIoTJobConfigurationProperty {
    /**
     * The stop configuration for the job.
     *
     * This configuration defines when and how to stop a job rollout.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-abortconfig
     */
    readonly abortConfig?: CfnDeployment.IoTJobAbortConfigProperty | cdk.IResolvable;

    /**
     * The rollout configuration for the job.
     *
     * This configuration defines the rate at which the job rolls out to the fleet of target devices.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-jobexecutionsrolloutconfig
     */
    readonly jobExecutionsRolloutConfig?: CfnDeployment.IoTJobExecutionsRolloutConfigProperty | cdk.IResolvable;

    /**
     * The timeout configuration for the job.
     *
     * This configuration defines the amount of time each device has to complete the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentiotjobconfiguration.html#cfn-greengrassv2-deployment-deploymentiotjobconfiguration-timeoutconfig
     */
    readonly timeoutConfig?: CfnDeployment.IoTJobTimeoutConfigProperty | cdk.IResolvable;
  }

  /**
   * Contains information about the rollout configuration for a job.
   *
   * This configuration defines the rate at which the job deploys a configuration to a fleet of target devices.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html
   */
  export interface IoTJobExecutionsRolloutConfigProperty {
    /**
     * The exponential rate to increase the job rollout rate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html#cfn-greengrassv2-deployment-iotjobexecutionsrolloutconfig-exponentialrate
     */
    readonly exponentialRate?: CfnDeployment.IoTJobExponentialRolloutRateProperty | cdk.IResolvable;

    /**
     * The maximum number of devices that receive a pending job notification, per minute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexecutionsrolloutconfig.html#cfn-greengrassv2-deployment-iotjobexecutionsrolloutconfig-maximumperminute
     */
    readonly maximumPerMinute?: number;
  }

  /**
   * Contains information about an exponential rollout rate for a configuration deployment job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html
   */
  export interface IoTJobExponentialRolloutRateProperty {
    /**
     * The minimum number of devices that receive a pending job notification, per minute, when the job starts.
     *
     * This parameter defines the initial rollout rate of the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-baserateperminute
     */
    readonly baseRatePerMinute: number;

    /**
     * The exponential factor to increase the rollout rate for the job.
     *
     * This parameter supports up to one digit after the decimal (for example, you can specify `1.5` , but not `1.55` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-incrementfactor
     */
    readonly incrementFactor: number;

    /**
     * The criteria to increase the rollout rate for the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobexponentialrolloutrate.html#cfn-greengrassv2-deployment-iotjobexponentialrolloutrate-rateincreasecriteria
     */
    readonly rateIncreaseCriteria: any | cdk.IResolvable;
  }

  /**
   * Contains information about the timeout configuration for a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobtimeoutconfig.html
   */
  export interface IoTJobTimeoutConfigProperty {
    /**
     * The amount of time, in minutes, that devices have to complete the job.
     *
     * The timer starts when the job status is set to `IN_PROGRESS` . If the job status doesn't change to a terminal state before the time expires, then the job status is set to `TIMED_OUT` .
     *
     * The timeout interval must be between 1 minute and 7 days (10080 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobtimeoutconfig.html#cfn-greengrassv2-deployment-iotjobtimeoutconfig-inprogresstimeoutinminutes
     */
    readonly inProgressTimeoutInMinutes?: number;
  }

  /**
   * Contains a list of criteria that define when and how to cancel a configuration deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortconfig.html
   */
  export interface IoTJobAbortConfigProperty {
    /**
     * The list of criteria that define when and how to cancel the configuration deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortconfig.html#cfn-greengrassv2-deployment-iotjobabortconfig-criterialist
     */
    readonly criteriaList: Array<CfnDeployment.IoTJobAbortCriteriaProperty | cdk.IResolvable> | cdk.IResolvable;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html
   */
  export interface IoTJobAbortCriteriaProperty {
    /**
     * The action to perform when the criteria are met.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-action
     */
    readonly action: string;

    /**
     * The type of job deployment failure that can cancel a job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-failuretype
     */
    readonly failureType: string;

    /**
     * The minimum number of things that receive the configuration before the job can cancel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-minnumberofexecutedthings
     */
    readonly minNumberOfExecutedThings: number;

    /**
     * The minimum percentage of `failureType` failures that occur before the job can cancel.
     *
     * This parameter supports up to two digits after the decimal (for example, you can specify `10.9` or `10.99` , but not `10.999` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-iotjobabortcriteria.html#cfn-greengrassv2-deployment-iotjobabortcriteria-thresholdpercentage
     */
    readonly thresholdPercentage: number;
  }

  /**
   * Contains information about policies that define how a deployment updates components and handles failure.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html
   */
  export interface DeploymentPoliciesProperty {
    /**
     * The component update policy for the configuration deployment.
     *
     * This policy defines when it's safe to deploy the configuration to devices.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-componentupdatepolicy
     */
    readonly componentUpdatePolicy?: CfnDeployment.DeploymentComponentUpdatePolicyProperty | cdk.IResolvable;

    /**
     * The configuration validation policy for the configuration deployment.
     *
     * This policy defines how long each component has to validate its configure updates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-configurationvalidationpolicy
     */
    readonly configurationValidationPolicy?: CfnDeployment.DeploymentConfigurationValidationPolicyProperty | cdk.IResolvable;

    /**
     * The failure handling policy for the configuration deployment. This policy defines what to do if the deployment fails.
     *
     * Default: `ROLLBACK`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentpolicies.html#cfn-greengrassv2-deployment-deploymentpolicies-failurehandlingpolicy
     */
    readonly failureHandlingPolicy?: string;
  }

  /**
   * Contains information about a deployment's policy that defines when components are safe to update.
   *
   * Each component on a device can report whether or not it's ready to update. After a component and its dependencies are ready, they can apply the update in the deployment. You can configure whether or not the deployment notifies components of an update and waits for a response. You specify the amount of time each component has to respond to the update notification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html
   */
  export interface DeploymentComponentUpdatePolicyProperty {
    /**
     * Whether or not to notify components and wait for components to become safe to update.
     *
     * Choose from the following options:
     *
     * - `NOTIFY_COMPONENTS` – The deployment notifies each component before it stops and updates that component. Components can use the [SubscribeToComponentUpdates](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-subscribetocomponentupdates) IPC operation to receive these notifications. Then, components can respond with the [DeferComponentUpdate](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-defercomponentupdate) IPC operation. For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
     * - `SKIP_NOTIFY_COMPONENTS` – The deployment doesn't notify components or wait for them to be safe to update.
     *
     * Default: `NOTIFY_COMPONENTS`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html#cfn-greengrassv2-deployment-deploymentcomponentupdatepolicy-action
     */
    readonly action?: string;

    /**
     * The amount of time in seconds that each component on a device has to report that it's safe to update.
     *
     * If the component waits for longer than this timeout, then the deployment proceeds on the device.
     *
     * Default: `60`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentcomponentupdatepolicy.html#cfn-greengrassv2-deployment-deploymentcomponentupdatepolicy-timeoutinseconds
     */
    readonly timeoutInSeconds?: number;
  }

  /**
   * Contains information about how long a component on a core device can validate its configuration updates before it times out.
   *
   * Components can use the [SubscribeToValidateConfigurationUpdates](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-subscribetovalidateconfigurationupdates) IPC operation to receive notifications when a deployment specifies a configuration update. Then, components can respond with the [SendConfigurationValidityReport](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html#ipc-operation-sendconfigurationvalidityreport) IPC operation. For more information, see the [Create deployments](https://docs.aws.amazon.com/greengrass/v2/developerguide/create-deployments.html) in the *AWS IoT Greengrass V2 Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentconfigurationvalidationpolicy.html
   */
  export interface DeploymentConfigurationValidationPolicyProperty {
    /**
     * The amount of time in seconds that a component can validate its configuration updates.
     *
     * If the validation time exceeds this timeout, then the deployment proceeds for the device.
     *
     * Default: `30`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrassv2-deployment-deploymentconfigurationvalidationpolicy.html#cfn-greengrassv2-deployment-deploymentconfigurationvalidationpolicy-timeoutinseconds
     */
    readonly timeoutInSeconds?: number;
  }
}

/**
 * Properties for defining a `CfnDeployment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html
 */
export interface CfnDeploymentProps {
  /**
   * The components to deploy.
   *
   * This is a dictionary, where each key is the name of a component, and each key's value is the version and configuration to deploy for that component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-components
   */
  readonly components?: cdk.IResolvable | Record<string, CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable>;

  /**
   * The name of the deployment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentname
   */
  readonly deploymentName?: string;

  /**
   * The deployment policies for the deployment.
   *
   * These policies define how the deployment updates components and handles failure.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-deploymentpolicies
   */
  readonly deploymentPolicies?: CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable;

  /**
   * The job configuration for the deployment configuration.
   *
   * The job configuration specifies the rollout, timeout, and stop configurations for the deployment configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-iotjobconfiguration
   */
  readonly iotJobConfiguration?: CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable;

  /**
   * The parent deployment's [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) for a subdeployment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-parenttargetarn
   */
  readonly parentTargetArn?: string;

  /**
   * Application-specific metadata to attach to the deployment.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tag your AWS IoT Greengrass Version 2 resources](https://docs.aws.amazon.com/greengrass/v2/developerguide/tag-resources.html) in the *AWS IoT Greengrass V2 Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The ARN of the target AWS IoT thing or thing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrassv2-deployment.html#cfn-greengrassv2-deployment-targetarn
   */
  readonly targetArn: string;
}

/**
 * Determine whether the given properties match those of a `SystemResourceLimitsProperty`
 *
 * @param properties - the TypeScript properties of a `SystemResourceLimitsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentSystemResourceLimitsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpus", cdk.validateNumber)(properties.cpus));
  errors.collect(cdk.propertyValidator("memory", cdk.validateNumber)(properties.memory));
  return errors.wrap("supplied properties not correct for \"SystemResourceLimitsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentSystemResourceLimitsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentSystemResourceLimitsPropertyValidator(properties).assertSuccess();
  return {
    "Cpus": cdk.numberToCloudFormation(properties.cpus),
    "Memory": cdk.numberToCloudFormation(properties.memory)
  };
}

// @ts-ignore TS6133
function CfnDeploymentSystemResourceLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeployment.SystemResourceLimitsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.SystemResourceLimitsProperty>();
  ret.addPropertyResult("cpus", "Cpus", (properties.Cpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.Cpus) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getNumber(properties.Memory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentRunWithProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentRunWithProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentComponentRunWithPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("posixUser", cdk.validateString)(properties.posixUser));
  errors.collect(cdk.propertyValidator("systemResourceLimits", CfnDeploymentSystemResourceLimitsPropertyValidator)(properties.systemResourceLimits));
  errors.collect(cdk.propertyValidator("windowsUser", cdk.validateString)(properties.windowsUser));
  return errors.wrap("supplied properties not correct for \"ComponentRunWithProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentComponentRunWithPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentComponentRunWithPropertyValidator(properties).assertSuccess();
  return {
    "PosixUser": cdk.stringToCloudFormation(properties.posixUser),
    "SystemResourceLimits": convertCfnDeploymentSystemResourceLimitsPropertyToCloudFormation(properties.systemResourceLimits),
    "WindowsUser": cdk.stringToCloudFormation(properties.windowsUser)
  };
}

// @ts-ignore TS6133
function CfnDeploymentComponentRunWithPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.ComponentRunWithProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.ComponentRunWithProperty>();
  ret.addPropertyResult("posixUser", "PosixUser", (properties.PosixUser != null ? cfn_parse.FromCloudFormation.getString(properties.PosixUser) : undefined));
  ret.addPropertyResult("systemResourceLimits", "SystemResourceLimits", (properties.SystemResourceLimits != null ? CfnDeploymentSystemResourceLimitsPropertyFromCloudFormation(properties.SystemResourceLimits) : undefined));
  ret.addPropertyResult("windowsUser", "WindowsUser", (properties.WindowsUser != null ? cfn_parse.FromCloudFormation.getString(properties.WindowsUser) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentConfigurationUpdateProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationUpdateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentComponentConfigurationUpdatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("merge", cdk.validateString)(properties.merge));
  errors.collect(cdk.propertyValidator("reset", cdk.listValidator(cdk.validateString))(properties.reset));
  return errors.wrap("supplied properties not correct for \"ComponentConfigurationUpdateProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentComponentConfigurationUpdatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentComponentConfigurationUpdatePropertyValidator(properties).assertSuccess();
  return {
    "Merge": cdk.stringToCloudFormation(properties.merge),
    "Reset": cdk.listMapper(cdk.stringToCloudFormation)(properties.reset)
  };
}

// @ts-ignore TS6133
function CfnDeploymentComponentConfigurationUpdatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.ComponentConfigurationUpdateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.ComponentConfigurationUpdateProperty>();
  ret.addPropertyResult("merge", "Merge", (properties.Merge != null ? cfn_parse.FromCloudFormation.getString(properties.Merge) : undefined));
  ret.addPropertyResult("reset", "Reset", (properties.Reset != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Reset) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentDeploymentSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentDeploymentSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentComponentDeploymentSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentVersion", cdk.validateString)(properties.componentVersion));
  errors.collect(cdk.propertyValidator("configurationUpdate", CfnDeploymentComponentConfigurationUpdatePropertyValidator)(properties.configurationUpdate));
  errors.collect(cdk.propertyValidator("runWith", CfnDeploymentComponentRunWithPropertyValidator)(properties.runWith));
  return errors.wrap("supplied properties not correct for \"ComponentDeploymentSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentComponentDeploymentSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentComponentDeploymentSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "ComponentVersion": cdk.stringToCloudFormation(properties.componentVersion),
    "ConfigurationUpdate": convertCfnDeploymentComponentConfigurationUpdatePropertyToCloudFormation(properties.configurationUpdate),
    "RunWith": convertCfnDeploymentComponentRunWithPropertyToCloudFormation(properties.runWith)
  };
}

// @ts-ignore TS6133
function CfnDeploymentComponentDeploymentSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.ComponentDeploymentSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.ComponentDeploymentSpecificationProperty>();
  ret.addPropertyResult("componentVersion", "ComponentVersion", (properties.ComponentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentVersion) : undefined));
  ret.addPropertyResult("configurationUpdate", "ConfigurationUpdate", (properties.ConfigurationUpdate != null ? CfnDeploymentComponentConfigurationUpdatePropertyFromCloudFormation(properties.ConfigurationUpdate) : undefined));
  ret.addPropertyResult("runWith", "RunWith", (properties.RunWith != null ? CfnDeploymentComponentRunWithPropertyFromCloudFormation(properties.RunWith) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IoTJobExponentialRolloutRateProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobExponentialRolloutRateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentIoTJobExponentialRolloutRatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseRatePerMinute", cdk.requiredValidator)(properties.baseRatePerMinute));
  errors.collect(cdk.propertyValidator("baseRatePerMinute", cdk.validateNumber)(properties.baseRatePerMinute));
  errors.collect(cdk.propertyValidator("incrementFactor", cdk.requiredValidator)(properties.incrementFactor));
  errors.collect(cdk.propertyValidator("incrementFactor", cdk.validateNumber)(properties.incrementFactor));
  errors.collect(cdk.propertyValidator("rateIncreaseCriteria", cdk.requiredValidator)(properties.rateIncreaseCriteria));
  errors.collect(cdk.propertyValidator("rateIncreaseCriteria", cdk.validateObject)(properties.rateIncreaseCriteria));
  return errors.wrap("supplied properties not correct for \"IoTJobExponentialRolloutRateProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentIoTJobExponentialRolloutRatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentIoTJobExponentialRolloutRatePropertyValidator(properties).assertSuccess();
  return {
    "BaseRatePerMinute": cdk.numberToCloudFormation(properties.baseRatePerMinute),
    "IncrementFactor": cdk.numberToCloudFormation(properties.incrementFactor),
    "RateIncreaseCriteria": cdk.objectToCloudFormation(properties.rateIncreaseCriteria)
  };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobExponentialRolloutRatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobExponentialRolloutRateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobExponentialRolloutRateProperty>();
  ret.addPropertyResult("baseRatePerMinute", "BaseRatePerMinute", (properties.BaseRatePerMinute != null ? cfn_parse.FromCloudFormation.getNumber(properties.BaseRatePerMinute) : undefined));
  ret.addPropertyResult("incrementFactor", "IncrementFactor", (properties.IncrementFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.IncrementFactor) : undefined));
  ret.addPropertyResult("rateIncreaseCriteria", "RateIncreaseCriteria", (properties.RateIncreaseCriteria != null ? cfn_parse.FromCloudFormation.getAny(properties.RateIncreaseCriteria) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IoTJobExecutionsRolloutConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobExecutionsRolloutConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentIoTJobExecutionsRolloutConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exponentialRate", CfnDeploymentIoTJobExponentialRolloutRatePropertyValidator)(properties.exponentialRate));
  errors.collect(cdk.propertyValidator("maximumPerMinute", cdk.validateNumber)(properties.maximumPerMinute));
  return errors.wrap("supplied properties not correct for \"IoTJobExecutionsRolloutConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentIoTJobExecutionsRolloutConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentIoTJobExecutionsRolloutConfigPropertyValidator(properties).assertSuccess();
  return {
    "ExponentialRate": convertCfnDeploymentIoTJobExponentialRolloutRatePropertyToCloudFormation(properties.exponentialRate),
    "MaximumPerMinute": cdk.numberToCloudFormation(properties.maximumPerMinute)
  };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobExecutionsRolloutConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobExecutionsRolloutConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobExecutionsRolloutConfigProperty>();
  ret.addPropertyResult("exponentialRate", "ExponentialRate", (properties.ExponentialRate != null ? CfnDeploymentIoTJobExponentialRolloutRatePropertyFromCloudFormation(properties.ExponentialRate) : undefined));
  ret.addPropertyResult("maximumPerMinute", "MaximumPerMinute", (properties.MaximumPerMinute != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumPerMinute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IoTJobTimeoutConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobTimeoutConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentIoTJobTimeoutConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inProgressTimeoutInMinutes", cdk.validateNumber)(properties.inProgressTimeoutInMinutes));
  return errors.wrap("supplied properties not correct for \"IoTJobTimeoutConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentIoTJobTimeoutConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentIoTJobTimeoutConfigPropertyValidator(properties).assertSuccess();
  return {
    "InProgressTimeoutInMinutes": cdk.numberToCloudFormation(properties.inProgressTimeoutInMinutes)
  };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobTimeoutConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobTimeoutConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobTimeoutConfigProperty>();
  ret.addPropertyResult("inProgressTimeoutInMinutes", "InProgressTimeoutInMinutes", (properties.InProgressTimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.InProgressTimeoutInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IoTJobAbortCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobAbortCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentIoTJobAbortCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("failureType", cdk.requiredValidator)(properties.failureType));
  errors.collect(cdk.propertyValidator("failureType", cdk.validateString)(properties.failureType));
  errors.collect(cdk.propertyValidator("minNumberOfExecutedThings", cdk.requiredValidator)(properties.minNumberOfExecutedThings));
  errors.collect(cdk.propertyValidator("minNumberOfExecutedThings", cdk.validateNumber)(properties.minNumberOfExecutedThings));
  errors.collect(cdk.propertyValidator("thresholdPercentage", cdk.requiredValidator)(properties.thresholdPercentage));
  errors.collect(cdk.propertyValidator("thresholdPercentage", cdk.validateNumber)(properties.thresholdPercentage));
  return errors.wrap("supplied properties not correct for \"IoTJobAbortCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentIoTJobAbortCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentIoTJobAbortCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "FailureType": cdk.stringToCloudFormation(properties.failureType),
    "MinNumberOfExecutedThings": cdk.numberToCloudFormation(properties.minNumberOfExecutedThings),
    "ThresholdPercentage": cdk.numberToCloudFormation(properties.thresholdPercentage)
  };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobAbortCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobAbortCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobAbortCriteriaProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("failureType", "FailureType", (properties.FailureType != null ? cfn_parse.FromCloudFormation.getString(properties.FailureType) : undefined));
  ret.addPropertyResult("minNumberOfExecutedThings", "MinNumberOfExecutedThings", (properties.MinNumberOfExecutedThings != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinNumberOfExecutedThings) : undefined));
  ret.addPropertyResult("thresholdPercentage", "ThresholdPercentage", (properties.ThresholdPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThresholdPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IoTJobAbortConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IoTJobAbortConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentIoTJobAbortConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("criteriaList", cdk.requiredValidator)(properties.criteriaList));
  errors.collect(cdk.propertyValidator("criteriaList", cdk.listValidator(CfnDeploymentIoTJobAbortCriteriaPropertyValidator))(properties.criteriaList));
  return errors.wrap("supplied properties not correct for \"IoTJobAbortConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentIoTJobAbortConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentIoTJobAbortConfigPropertyValidator(properties).assertSuccess();
  return {
    "CriteriaList": cdk.listMapper(convertCfnDeploymentIoTJobAbortCriteriaPropertyToCloudFormation)(properties.criteriaList)
  };
}

// @ts-ignore TS6133
function CfnDeploymentIoTJobAbortConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.IoTJobAbortConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.IoTJobAbortConfigProperty>();
  ret.addPropertyResult("criteriaList", "CriteriaList", (properties.CriteriaList != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentIoTJobAbortCriteriaPropertyFromCloudFormation)(properties.CriteriaList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentIoTJobConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentIoTJobConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentDeploymentIoTJobConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("abortConfig", CfnDeploymentIoTJobAbortConfigPropertyValidator)(properties.abortConfig));
  errors.collect(cdk.propertyValidator("jobExecutionsRolloutConfig", CfnDeploymentIoTJobExecutionsRolloutConfigPropertyValidator)(properties.jobExecutionsRolloutConfig));
  errors.collect(cdk.propertyValidator("timeoutConfig", CfnDeploymentIoTJobTimeoutConfigPropertyValidator)(properties.timeoutConfig));
  return errors.wrap("supplied properties not correct for \"DeploymentIoTJobConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentDeploymentIoTJobConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentDeploymentIoTJobConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AbortConfig": convertCfnDeploymentIoTJobAbortConfigPropertyToCloudFormation(properties.abortConfig),
    "JobExecutionsRolloutConfig": convertCfnDeploymentIoTJobExecutionsRolloutConfigPropertyToCloudFormation(properties.jobExecutionsRolloutConfig),
    "TimeoutConfig": convertCfnDeploymentIoTJobTimeoutConfigPropertyToCloudFormation(properties.timeoutConfig)
  };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentIoTJobConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentIoTJobConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentIoTJobConfigurationProperty>();
  ret.addPropertyResult("abortConfig", "AbortConfig", (properties.AbortConfig != null ? CfnDeploymentIoTJobAbortConfigPropertyFromCloudFormation(properties.AbortConfig) : undefined));
  ret.addPropertyResult("jobExecutionsRolloutConfig", "JobExecutionsRolloutConfig", (properties.JobExecutionsRolloutConfig != null ? CfnDeploymentIoTJobExecutionsRolloutConfigPropertyFromCloudFormation(properties.JobExecutionsRolloutConfig) : undefined));
  ret.addPropertyResult("timeoutConfig", "TimeoutConfig", (properties.TimeoutConfig != null ? CfnDeploymentIoTJobTimeoutConfigPropertyFromCloudFormation(properties.TimeoutConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentComponentUpdatePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentComponentUpdatePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentDeploymentComponentUpdatePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  return errors.wrap("supplied properties not correct for \"DeploymentComponentUpdatePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentDeploymentComponentUpdatePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentDeploymentComponentUpdatePolicyPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentComponentUpdatePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentComponentUpdatePolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentComponentUpdatePolicyProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentConfigurationValidationPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentConfigurationValidationPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentDeploymentConfigurationValidationPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  return errors.wrap("supplied properties not correct for \"DeploymentConfigurationValidationPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentDeploymentConfigurationValidationPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentDeploymentConfigurationValidationPolicyPropertyValidator(properties).assertSuccess();
  return {
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentConfigurationValidationPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentConfigurationValidationPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentConfigurationValidationPolicyProperty>();
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentPoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentPoliciesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentDeploymentPoliciesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentUpdatePolicy", CfnDeploymentDeploymentComponentUpdatePolicyPropertyValidator)(properties.componentUpdatePolicy));
  errors.collect(cdk.propertyValidator("configurationValidationPolicy", CfnDeploymentDeploymentConfigurationValidationPolicyPropertyValidator)(properties.configurationValidationPolicy));
  errors.collect(cdk.propertyValidator("failureHandlingPolicy", cdk.validateString)(properties.failureHandlingPolicy));
  return errors.wrap("supplied properties not correct for \"DeploymentPoliciesProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentDeploymentPoliciesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentDeploymentPoliciesPropertyValidator(properties).assertSuccess();
  return {
    "ComponentUpdatePolicy": convertCfnDeploymentDeploymentComponentUpdatePolicyPropertyToCloudFormation(properties.componentUpdatePolicy),
    "ConfigurationValidationPolicy": convertCfnDeploymentDeploymentConfigurationValidationPolicyPropertyToCloudFormation(properties.configurationValidationPolicy),
    "FailureHandlingPolicy": cdk.stringToCloudFormation(properties.failureHandlingPolicy)
  };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentPoliciesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentPoliciesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentPoliciesProperty>();
  ret.addPropertyResult("componentUpdatePolicy", "ComponentUpdatePolicy", (properties.ComponentUpdatePolicy != null ? CfnDeploymentDeploymentComponentUpdatePolicyPropertyFromCloudFormation(properties.ComponentUpdatePolicy) : undefined));
  ret.addPropertyResult("configurationValidationPolicy", "ConfigurationValidationPolicy", (properties.ConfigurationValidationPolicy != null ? CfnDeploymentDeploymentConfigurationValidationPolicyPropertyFromCloudFormation(properties.ConfigurationValidationPolicy) : undefined));
  ret.addPropertyResult("failureHandlingPolicy", "FailureHandlingPolicy", (properties.FailureHandlingPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.FailureHandlingPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("components", cdk.hashValidator(CfnDeploymentComponentDeploymentSpecificationPropertyValidator))(properties.components));
  errors.collect(cdk.propertyValidator("deploymentName", cdk.validateString)(properties.deploymentName));
  errors.collect(cdk.propertyValidator("deploymentPolicies", CfnDeploymentDeploymentPoliciesPropertyValidator)(properties.deploymentPolicies));
  errors.collect(cdk.propertyValidator("iotJobConfiguration", CfnDeploymentDeploymentIoTJobConfigurationPropertyValidator)(properties.iotJobConfiguration));
  errors.collect(cdk.propertyValidator("parentTargetArn", cdk.validateString)(properties.parentTargetArn));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentPropsValidator(properties).assertSuccess();
  return {
    "Components": cdk.hashMapper(convertCfnDeploymentComponentDeploymentSpecificationPropertyToCloudFormation)(properties.components),
    "DeploymentName": cdk.stringToCloudFormation(properties.deploymentName),
    "DeploymentPolicies": convertCfnDeploymentDeploymentPoliciesPropertyToCloudFormation(properties.deploymentPolicies),
    "IotJobConfiguration": convertCfnDeploymentDeploymentIoTJobConfigurationPropertyToCloudFormation(properties.iotJobConfiguration),
    "ParentTargetArn": cdk.stringToCloudFormation(properties.parentTargetArn),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnDeploymentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentProps>();
  ret.addPropertyResult("components", "Components", (properties.Components != null ? cfn_parse.FromCloudFormation.getMap(CfnDeploymentComponentDeploymentSpecificationPropertyFromCloudFormation)(properties.Components) : undefined));
  ret.addPropertyResult("deploymentName", "DeploymentName", (properties.DeploymentName != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentName) : undefined));
  ret.addPropertyResult("deploymentPolicies", "DeploymentPolicies", (properties.DeploymentPolicies != null ? CfnDeploymentDeploymentPoliciesPropertyFromCloudFormation(properties.DeploymentPolicies) : undefined));
  ret.addPropertyResult("iotJobConfiguration", "IotJobConfiguration", (properties.IotJobConfiguration != null ? CfnDeploymentDeploymentIoTJobConfigurationPropertyFromCloudFormation(properties.IotJobConfiguration) : undefined));
  ret.addPropertyResult("parentTargetArn", "ParentTargetArn", (properties.ParentTargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.ParentTargetArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}