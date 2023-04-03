import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnCustomActionType`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html
 */
export interface CfnCustomActionTypeProps {
    /**
     * The category of the custom action, such as a build action or a test action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-category
     */
    readonly category: string;
    /**
     * The details of the input artifact for the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-inputartifactdetails
     */
    readonly inputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;
    /**
     * The details of the output artifact of the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-outputartifactdetails
     */
    readonly outputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;
    /**
     * The provider of the service used in the custom action, such as CodeDeploy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-provider
     */
    readonly provider: string;
    /**
     * The version identifier of the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-version
     */
    readonly version: string;
    /**
     * The configuration properties for the custom action.
     *
     * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-configurationproperties
     */
    readonly configurationProperties?: Array<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * URLs that provide users information about this custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-settings
     */
    readonly settings?: CfnCustomActionType.SettingsProperty | cdk.IResolvable;
    /**
     * The tags for the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::CodePipeline::CustomActionType`
 *
 * The `AWS::CodePipeline::CustomActionType` resource creates a custom action for activities that aren't included in the CodePipeline default actions, such as running an internally developed build process or a test suite. You can use these custom actions in the stage of a pipeline. For more information, see [Create and Add a Custom Action in AWS CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) in the *AWS CodePipeline User Guide* .
 *
 * @cloudformationResource AWS::CodePipeline::CustomActionType
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html
 */
export declare class CfnCustomActionType extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodePipeline::CustomActionType";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomActionType;
    /**
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The category of the custom action, such as a build action or a test action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-category
     */
    category: string;
    /**
     * The details of the input artifact for the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-inputartifactdetails
     */
    inputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;
    /**
     * The details of the output artifact of the action, such as its commit ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-outputartifactdetails
     */
    outputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;
    /**
     * The provider of the service used in the custom action, such as CodeDeploy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-provider
     */
    provider: string;
    /**
     * The version identifier of the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-version
     */
    version: string;
    /**
     * The configuration properties for the custom action.
     *
     * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-configurationproperties
     */
    configurationProperties: Array<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * URLs that provide users information about this custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-settings
     */
    settings: CfnCustomActionType.SettingsProperty | cdk.IResolvable | undefined;
    /**
     * The tags for the custom action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::CodePipeline::CustomActionType`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomActionTypeProps);
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
export declare namespace CfnCustomActionType {
    /**
     * Returns information about the details of an artifact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html
     */
    interface ArtifactDetailsProperty {
        /**
         * The maximum number of artifacts allowed for the action type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-maximumcount
         */
        readonly maximumCount: number;
        /**
         * The minimum number of artifacts allowed for the action type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-minimumcount
         */
        readonly minimumCount: number;
    }
}
export declare namespace CfnCustomActionType {
    /**
     * The configuration properties for the custom action.
     *
     * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html
     */
    interface ConfigurationPropertiesProperty {
        /**
         * The description of the action configuration property that is displayed to users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-description
         */
        readonly description?: string;
        /**
         * Whether the configuration property is a key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-key
         */
        readonly key: boolean | cdk.IResolvable;
        /**
         * The name of the action configuration property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-name
         */
        readonly name: string;
        /**
         * Indicates that the property is used with `PollForJobs` . When creating a custom action, an action can have up to one queryable property. If it has one, that property must be both required and not secret.
         *
         * If you create a pipeline with a custom action type, and that custom action contains a queryable property, the value for that configuration property is subject to other restrictions. The value must be less than or equal to twenty (20) characters. The value can contain only alphanumeric characters, underscores, and hyphens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-queryable
         */
        readonly queryable?: boolean | cdk.IResolvable;
        /**
         * Whether the configuration property is a required value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-required
         */
        readonly required: boolean | cdk.IResolvable;
        /**
         * Whether the configuration property is secret. Secrets are hidden from all calls except for `GetJobDetails` , `GetThirdPartyJobDetails` , `PollForJobs` , and `PollForThirdPartyJobs` .
         *
         * When updating a pipeline, passing * * * * * without changing any other values of the action preserves the previous value of the secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-secret
         */
        readonly secret: boolean | cdk.IResolvable;
        /**
         * The type of the configuration property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-type
         */
        readonly type?: string;
    }
}
export declare namespace CfnCustomActionType {
    /**
     * `Settings` is a property of the `AWS::CodePipeline::CustomActionType` resource that provides URLs that users can access to view information about the CodePipeline custom action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html
     */
    interface SettingsProperty {
        /**
         * The URL returned to the CodePipeline console that provides a deep link to the resources of the external system, such as the configuration page for a CodeDeploy deployment group. This link is provided as part of the action display in the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-entityurltemplate
         */
        readonly entityUrlTemplate?: string;
        /**
         * The URL returned to the CodePipeline console that contains a link to the top-level landing page for the external system, such as the console page for CodeDeploy. This link is shown on the pipeline view page in the CodePipeline console and provides a link to the execution entity of the external action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-executionurltemplate
         */
        readonly executionUrlTemplate?: string;
        /**
         * The URL returned to the CodePipeline console that contains a link to the page where customers can update or change the configuration of the external action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-revisionurltemplate
         */
        readonly revisionUrlTemplate?: string;
        /**
         * The URL of a sign-up page where users can sign up for an external service and perform initial configuration of the action provided by that service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-thirdpartyconfigurationurl
         */
        readonly thirdPartyConfigurationUrl?: string;
    }
}
/**
 * Properties for defining a `CfnPipeline`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html
 */
export interface CfnPipelineProps {
    /**
     * The Amazon Resource Name (ARN) for CodePipeline to use to either perform actions with no `actionRoleArn` , or to use to assume roles for actions with an `actionRoleArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-rolearn
     */
    readonly roleArn: string;
    /**
     * Represents information about a stage and its definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-stages
     */
    readonly stages: Array<CfnPipeline.StageDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The S3 bucket where artifacts for the pipeline are stored.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstore
     */
    readonly artifactStore?: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable;
    /**
     * A mapping of `artifactStore` objects and their corresponding AWS Regions. There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstores
     */
    readonly artifactStores?: Array<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Represents the input of a `DisableStageTransition` action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-disableinboundstagetransitions
     */
    readonly disableInboundStageTransitions?: Array<CfnPipeline.StageTransitionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-name
     */
    readonly name?: string;
    /**
     * Indicates whether to rerun the CodePipeline pipeline after you update it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-restartexecutiononupdate
     */
    readonly restartExecutionOnUpdate?: boolean | cdk.IResolvable;
    /**
     * Specifies the tags applied to the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::CodePipeline::Pipeline`
 *
 * The `AWS::CodePipeline::Pipeline` resource creates a CodePipeline pipeline that describes how software changes go through a release process. For more information, see [What Is CodePipeline?](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html) in the *AWS CodePipeline User Guide* .
 *
 * @cloudformationResource AWS::CodePipeline::Pipeline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html
 */
export declare class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodePipeline::Pipeline";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline;
    /**
     * The version of the pipeline.
     *
     * > A new pipeline is always assigned a version number of 1. This number increments when a pipeline is updated.
     * @cloudformationAttribute Version
     */
    readonly attrVersion: string;
    /**
     * The Amazon Resource Name (ARN) for CodePipeline to use to either perform actions with no `actionRoleArn` , or to use to assume roles for actions with an `actionRoleArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-rolearn
     */
    roleArn: string;
    /**
     * Represents information about a stage and its definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-stages
     */
    stages: Array<CfnPipeline.StageDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The S3 bucket where artifacts for the pipeline are stored.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstore
     */
    artifactStore: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable | undefined;
    /**
     * A mapping of `artifactStore` objects and their corresponding AWS Regions. There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstores
     */
    artifactStores: Array<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Represents the input of a `DisableStageTransition` action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-disableinboundstagetransitions
     */
    disableInboundStageTransitions: Array<CfnPipeline.StageTransitionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The name of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-name
     */
    name: string | undefined;
    /**
     * Indicates whether to rerun the CodePipeline pipeline after you update it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-restartexecutiononupdate
     */
    restartExecutionOnUpdate: boolean | cdk.IResolvable | undefined;
    /**
     * Specifies the tags applied to the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::CodePipeline::Pipeline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps);
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
export declare namespace CfnPipeline {
    /**
     * Represents information about an action declaration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html
     */
    interface ActionDeclarationProperty {
        /**
         * Specifies the action type and the provider of the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid
         */
        readonly actionTypeId: CfnPipeline.ActionTypeIdProperty | cdk.IResolvable;
        /**
         * The action's configuration. These are key-value pairs that specify input values for an action. For more information, see [Action Structure Requirements in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements) . For the list of configuration properties for the AWS CloudFormation action type in CodePipeline, see [Configuration Properties Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-action-reference.html) in the *AWS CloudFormation User Guide* . For template snippets with examples, see [Using Parameter Override Functions with CodePipeline Pipelines](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-parameter-override-functions.html) in the *AWS CloudFormation User Guide* .
         *
         * The values can be represented in either JSON or YAML format. For example, the JSON configuration item format is as follows:
         *
         * *JSON:*
         *
         * `"Configuration" : { Key : Value },`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-configuration
         */
        readonly configuration?: any | cdk.IResolvable;
        /**
         * The name or ID of the artifact consumed by the action, such as a test or build artifact. While the field is not a required parameter, most actions have an action configuration that requires a specified quantity of input artifacts. To refer to the action configuration specification by action provider, see the [Action structure reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference.html) in the *AWS CodePipeline User Guide* .
         *
         * > For a CodeBuild action with multiple input artifacts, one of your input sources must be designated the PrimarySource. For more information, see the [CodeBuild action reference page](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodeBuild.html) in the *AWS CodePipeline User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-inputartifacts
         */
        readonly inputArtifacts?: Array<CfnPipeline.InputArtifactProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The action declaration's name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-name
         */
        readonly name: string;
        /**
         * The variable namespace associated with the action. All variables produced as output by this action fall under this namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-actiondeclaration-namespace
         */
        readonly namespace?: string;
        /**
         * The name or ID of the result of the action declaration, such as a test or build artifact. While the field is not a required parameter, most actions have an action configuration that requires a specified quantity of output artifacts. To refer to the action configuration specification by action provider, see the [Action structure reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference.html) in the *AWS CodePipeline User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-outputartifacts
         */
        readonly outputArtifacts?: Array<CfnPipeline.OutputArtifactProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The action declaration's AWS Region, such as us-east-1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-region
         */
        readonly region?: string;
        /**
         * The ARN of the IAM service role that performs the declared action. This is assumed through the roleArn for the pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-rolearn
         */
        readonly roleArn?: string;
        /**
         * The order in which actions are run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-runorder
         */
        readonly runOrder?: number;
    }
}
export declare namespace CfnPipeline {
    /**
     * Represents information about an action type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html
     */
    interface ActionTypeIdProperty {
        /**
         * A category defines what kind of action can be taken in the stage, and constrains the provider type for the action. Valid categories are limited to one of the values below.
         *
         * - `Source`
         * - `Build`
         * - `Test`
         * - `Deploy`
         * - `Invoke`
         * - `Approval`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-category
         */
        readonly category: string;
        /**
         * The creator of the action being called. There are three valid values for the `Owner` field in the action category section within your pipeline structure: `AWS` , `ThirdParty` , and `Custom` . For more information, see [Valid Action Types and Providers in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#actions-valid-providers) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-owner
         */
        readonly owner: string;
        /**
         * The provider of the service being called by the action. Valid providers are determined by the action category. For example, an action in the Deploy category type might have a provider of CodeDeploy, which would be specified as `CodeDeploy` . For more information, see [Valid Action Types and Providers in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#actions-valid-providers) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-provider
         */
        readonly provider: string;
        /**
         * A string that describes the action version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-actiontypeid.html#cfn-codepipeline-pipeline-stages-actions-actiontypeid-version
         */
        readonly version: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * The S3 bucket where artifacts for the pipeline are stored.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html
     */
    interface ArtifactStoreProperty {
        /**
         * The encryption key used to encrypt the data in the artifact store, such as an AWS Key Management Service ( AWS KMS) key. If this is undefined, the default key for Amazon S3 is used. To see an example artifact store encryption key field, see the example structure here: [AWS::CodePipeline::Pipeline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-encryptionkey
         */
        readonly encryptionKey?: CfnPipeline.EncryptionKeyProperty | cdk.IResolvable;
        /**
         * The S3 bucket used for storing the artifacts for a pipeline. You can specify the name of an S3 bucket but not a folder in the bucket. A folder to contain the pipeline artifacts is created for you based on the name of the pipeline. You can use any S3 bucket in the same AWS Region as the pipeline to store your pipeline artifacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-location
         */
        readonly location: string;
        /**
         * The type of the artifact store, such as S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-type
         */
        readonly type: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * A mapping of `artifactStore` objects and their corresponding AWS Regions. There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html
     */
    interface ArtifactStoreMapProperty {
        /**
         * Represents information about the S3 bucket where artifacts are stored for the pipeline.
         *
         * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html#cfn-codepipeline-pipeline-artifactstoremap-artifactstore
         */
        readonly artifactStore: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable;
        /**
         * The action declaration's AWS Region, such as us-east-1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html#cfn-codepipeline-pipeline-artifactstoremap-region
         */
        readonly region: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * Reserved for future use.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-blockers.html
     */
    interface BlockerDeclarationProperty {
        /**
         * Reserved for future use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-blockers.html#cfn-codepipeline-pipeline-stages-blockers-name
         */
        readonly name: string;
        /**
         * Reserved for future use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-blockers.html#cfn-codepipeline-pipeline-stages-blockers-type
         */
        readonly type: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * Represents information about the key used to encrypt data in the artifact store, such as an AWS Key Management Service ( AWS KMS) key.
     *
     * `EncryptionKey` is a property of the [ArtifactStore](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore-encryptionkey.html
     */
    interface EncryptionKeyProperty {
        /**
         * The ID used to identify the key. For an AWS KMS key, you can use the key ID, the key ARN, or the alias ARN.
         *
         * > Aliases are recognized only in the account that created the AWS KMS key. For cross-account actions, you can only use the key ID or key ARN to identify the key. Cross-account actions involve using the role from the other account (AccountB), so specifying the key ID will use the key from the other account (AccountB).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore-encryptionkey.html#cfn-codepipeline-pipeline-artifactstore-encryptionkey-id
         */
        readonly id: string;
        /**
         * The type of encryption key, such as an AWS KMS key. When creating or updating a pipeline, the value must be set to 'KMS'.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore-encryptionkey.html#cfn-codepipeline-pipeline-artifactstore-encryptionkey-type
         */
        readonly type: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * Represents information about an artifact to be worked on, such as a test or build artifact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-inputartifacts.html
     */
    interface InputArtifactProperty {
        /**
         * The name of the artifact to be worked on (for example, "My App").
         *
         * Artifacts are the files that are worked on by actions in the pipeline. See the action configuration for each action for details about artifact parameters. For example, the S3 source action input artifact is a file name (or file path), and the files are generally provided as a ZIP file. Example artifact name: SampleApp_Windows.zip
         *
         * The input artifact of an action must exactly match the output artifact declared in a preceding action, but the input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-inputartifacts.html#cfn-codepipeline-pipeline-stages-actions-inputartifacts-name
         */
        readonly name: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * Represents information about the output of an action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-outputartifacts.html
     */
    interface OutputArtifactProperty {
        /**
         * The name of the output of an artifact, such as "My App".
         *
         * The output artifact name must exactly match the input artifact declared for a downstream action. However, the downstream action's input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
         *
         * Output artifact names must be unique within a pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions-outputartifacts.html#cfn-codepipeline-pipeline-stages-actions-outputartifacts-name
         */
        readonly name: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * Represents information about a stage and its definition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html
     */
    interface StageDeclarationProperty {
        /**
         * The actions included in a stage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html#cfn-codepipeline-pipeline-stages-actions
         */
        readonly actions: Array<CfnPipeline.ActionDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Reserved for future use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html#cfn-codepipeline-pipeline-stages-blockers
         */
        readonly blockers?: Array<CfnPipeline.BlockerDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the stage.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages.html#cfn-codepipeline-pipeline-stages-name
         */
        readonly name: string;
    }
}
export declare namespace CfnPipeline {
    /**
     * The name of the pipeline in which you want to disable the flow of artifacts from one stage to another.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-disableinboundstagetransitions.html
     */
    interface StageTransitionProperty {
        /**
         * The reason given to the user that a stage is disabled, such as waiting for manual approval or manual tests. This message is displayed in the pipeline console UI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-disableinboundstagetransitions.html#cfn-codepipeline-pipeline-disableinboundstagetransitions-reason
         */
        readonly reason: string;
        /**
         * The name of the stage where you want to disable the inbound or outbound transition of artifacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-disableinboundstagetransitions.html#cfn-codepipeline-pipeline-disableinboundstagetransitions-stagename
         */
        readonly stageName: string;
    }
}
/**
 * Properties for defining a `CfnWebhook`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html
 */
export interface CfnWebhookProps {
    /**
     * Supported options are GITHUB_HMAC, IP, and UNAUTHENTICATED.
     *
     * - For information about the authentication scheme implemented by GITHUB_HMAC, see [Securing your webhooks](https://docs.aws.amazon.com/https://developer.github.com/webhooks/securing/) on the GitHub Developer website.
     * - IP rejects webhooks trigger requests unless they originate from an IP address in the IP range whitelisted in the authentication configuration.
     * - UNAUTHENTICATED accepts all webhook trigger requests regardless of origin.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authentication
     */
    readonly authentication: string;
    /**
     * Properties that configure the authentication applied to incoming webhook trigger requests. The required properties depend on the authentication type. For GITHUB_HMAC, only the `SecretToken` property must be set. For IP, only the `AllowedIPRange` property must be set to a valid CIDR range. For UNAUTHENTICATED, no properties can be set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authenticationconfiguration
     */
    readonly authenticationConfiguration: CfnWebhook.WebhookAuthConfigurationProperty | cdk.IResolvable;
    /**
     * A list of rules applied to the body/payload sent in the POST request to a webhook URL. All defined rules must pass for the request to be accepted and the pipeline started.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-filters
     */
    readonly filters: Array<CfnWebhook.WebhookFilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the action in a pipeline you want to connect to the webhook. The action must be from the source (first) stage of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetaction
     */
    readonly targetAction: string;
    /**
     * The name of the pipeline you want to connect to the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipeline
     */
    readonly targetPipeline: string;
    /**
     * The version number of the pipeline to be connected to the trigger request.
     *
     * Required: Yes
     *
     * Type: Integer
     *
     * Update requires: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipelineversion
     */
    readonly targetPipelineVersion: number;
    /**
     * The name of the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-name
     */
    readonly name?: string;
    /**
     * Configures a connection between the webhook that was created and the external tool with events to be detected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-registerwiththirdparty
     */
    readonly registerWithThirdParty?: boolean | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::CodePipeline::Webhook`
 *
 * The `AWS::CodePipeline::Webhook` resource creates and registers your webhook. After the webhook is created and registered, it triggers your pipeline to start every time an external event occurs. For more information, see [Configure Your GitHub Pipelines to Use Webhooks for Change Detection](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-webhooks-migration.html) in the *AWS CodePipeline User Guide* .
 *
 * We strongly recommend that you use AWS Secrets Manager to store your credentials. If you use Secrets Manager, you must have already configured and stored your secret parameters in Secrets Manager. For more information, see [Using Dynamic References to Specify Template Values](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) .
 *
 * > When passing secret parameters, do not enter the value directly into the template. The value is rendered as plaintext and is therefore readable. For security reasons, do not use plaintext in your AWS CloudFormation template to store your credentials.
 *
 * @cloudformationResource AWS::CodePipeline::Webhook
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html
 */
export declare class CfnWebhook extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodePipeline::Webhook";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWebhook;
    /**
     * The webhook URL generated by AWS CodePipeline , such as `https://eu-central-1.webhooks.aws/trigger123456` .
     * @cloudformationAttribute Url
     */
    readonly attrUrl: string;
    /**
     * Supported options are GITHUB_HMAC, IP, and UNAUTHENTICATED.
     *
     * - For information about the authentication scheme implemented by GITHUB_HMAC, see [Securing your webhooks](https://docs.aws.amazon.com/https://developer.github.com/webhooks/securing/) on the GitHub Developer website.
     * - IP rejects webhooks trigger requests unless they originate from an IP address in the IP range whitelisted in the authentication configuration.
     * - UNAUTHENTICATED accepts all webhook trigger requests regardless of origin.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authentication
     */
    authentication: string;
    /**
     * Properties that configure the authentication applied to incoming webhook trigger requests. The required properties depend on the authentication type. For GITHUB_HMAC, only the `SecretToken` property must be set. For IP, only the `AllowedIPRange` property must be set to a valid CIDR range. For UNAUTHENTICATED, no properties can be set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authenticationconfiguration
     */
    authenticationConfiguration: CfnWebhook.WebhookAuthConfigurationProperty | cdk.IResolvable;
    /**
     * A list of rules applied to the body/payload sent in the POST request to a webhook URL. All defined rules must pass for the request to be accepted and the pipeline started.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-filters
     */
    filters: Array<CfnWebhook.WebhookFilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the action in a pipeline you want to connect to the webhook. The action must be from the source (first) stage of the pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetaction
     */
    targetAction: string;
    /**
     * The name of the pipeline you want to connect to the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipeline
     */
    targetPipeline: string;
    /**
     * The version number of the pipeline to be connected to the trigger request.
     *
     * Required: Yes
     *
     * Type: Integer
     *
     * Update requires: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipelineversion
     */
    targetPipelineVersion: number;
    /**
     * The name of the webhook.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-name
     */
    name: string | undefined;
    /**
     * Configures a connection between the webhook that was created and the external tool with events to be detected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-registerwiththirdparty
     */
    registerWithThirdParty: boolean | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::CodePipeline::Webhook`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWebhookProps);
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
export declare namespace CfnWebhook {
    /**
     * The authentication applied to incoming webhook trigger requests.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html
     */
    interface WebhookAuthConfigurationProperty {
        /**
         * The property used to configure acceptance of webhooks in an IP address range. For IP, only the `AllowedIPRange` property must be set. This property must be set to a valid CIDR range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html#cfn-codepipeline-webhook-webhookauthconfiguration-allowediprange
         */
        readonly allowedIpRange?: string;
        /**
         * The property used to configure GitHub authentication. For GITHUB_HMAC, only the `SecretToken` property must be set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html#cfn-codepipeline-webhook-webhookauthconfiguration-secrettoken
         */
        readonly secretToken?: string;
    }
}
export declare namespace CfnWebhook {
    /**
     * The event criteria that specify when a webhook notification is sent to your URL.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html
     */
    interface WebhookFilterRuleProperty {
        /**
         * A JsonPath expression that is applied to the body/payload of the webhook. The value selected by the JsonPath expression must match the value specified in the `MatchEquals` field. Otherwise, the request is ignored. For more information, see [Java JsonPath implementation](https://docs.aws.amazon.com/https://github.com/json-path/JsonPath) in GitHub.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html#cfn-codepipeline-webhook-webhookfilterrule-jsonpath
         */
        readonly jsonPath: string;
        /**
         * The value selected by the `JsonPath` expression must match what is supplied in the `MatchEquals` field. Otherwise, the request is ignored. Properties from the target action configuration can be included as placeholders in this value by surrounding the action configuration key with curly brackets. For example, if the value supplied here is "refs/heads/{Branch}" and the target action has an action configuration property called "Branch" with a value of "main", the `MatchEquals` value is evaluated as "refs/heads/main". For a list of action configuration properties for built-in action types, see [Pipeline Structure Reference Action Requirements](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html#cfn-codepipeline-webhook-webhookfilterrule-matchequals
         */
        readonly matchEquals?: string;
    }
}
