import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnComponent`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html
 */
export interface CfnComponentProps {
    /**
     * The name of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-name
     */
    readonly name: string;
    /**
     * The operating system platform of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-platform
     */
    readonly platform: string;
    /**
     * The component version. For example, `1.0.0` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-version
     */
    readonly version: string;
    /**
     * The change description of the component. Describes what change has been made in this version, or what makes this version different from other versions of this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-changedescription
     */
    readonly changeDescription?: string;
    /**
     * Component `data` contains inline YAML document content for the component. Alternatively, you can specify the `uri` of a YAML document file stored in Amazon S3. However, you cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-data
     */
    readonly data?: string;
    /**
     * Describes the contents of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-description
     */
    readonly description?: string;
    /**
     * The ID of the KMS key that is used to encrypt this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-kmskeyid
     */
    readonly kmsKeyId?: string;
    /**
     * The operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-supportedosversions
     */
    readonly supportedOsVersions?: string[];
    /**
     * The tags that apply to the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * The `uri` of a YAML component document file. This must be an S3 URL ( `s3://bucket/key` ), and the requester must have permission to access the S3 bucket it points to. If you use Amazon S3, you can specify component content up to your service quota.
     *
     * Alternatively, you can specify the YAML document inline, using the component `data` property. You cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-uri
     */
    readonly uri?: string;
}
/**
 * A CloudFormation `AWS::ImageBuilder::Component`
 *
 * Creates a new component that can be used to build, validate, test, and assess your image. The component is based on a YAML document that you specify using exactly one of the following methods:
 *
 * - Inline, using the `data` property in the request body.
 * - A URL that points to a YAML document file stored in Amazon S3, using the `uri` property in the request body.
 *
 * @cloudformationResource AWS::ImageBuilder::Component
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html
 */
export declare class CfnComponent extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::Component";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponent;
    /**
     * Returns the Amazon Resource Name (ARN) of the component. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the encryption status of the component. For example `true` or `false` .
     * @cloudformationAttribute Encrypted
     */
    readonly attrEncrypted: cdk.IResolvable;
    /**
     * Returns the name of the component.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * Image Builder determines the component type based on the phases that are defined in the component document. If there is only one phase, and its name is "test", then the type is `TEST` . For all other components, the type is `BUILD` .
     * @cloudformationAttribute Type
     */
    readonly attrType: string;
    /**
     * The name of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-name
     */
    name: string;
    /**
     * The operating system platform of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-platform
     */
    platform: string;
    /**
     * The component version. For example, `1.0.0` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-version
     */
    version: string;
    /**
     * The change description of the component. Describes what change has been made in this version, or what makes this version different from other versions of this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-changedescription
     */
    changeDescription: string | undefined;
    /**
     * Component `data` contains inline YAML document content for the component. Alternatively, you can specify the `uri` of a YAML document file stored in Amazon S3. However, you cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-data
     */
    data: string | undefined;
    /**
     * Describes the contents of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-description
     */
    description: string | undefined;
    /**
     * The ID of the KMS key that is used to encrypt this component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-kmskeyid
     */
    kmsKeyId: string | undefined;
    /**
     * The operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-supportedosversions
     */
    supportedOsVersions: string[] | undefined;
    /**
     * The tags that apply to the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The `uri` of a YAML component document file. This must be an S3 URL ( `s3://bucket/key` ), and the requester must have permission to access the S3 bucket it points to. If you use Amazon S3, you can specify component content up to your service quota.
     *
     * Alternatively, you can specify the YAML document inline, using the component `data` property. You cannot specify both properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-uri
     */
    uri: string | undefined;
    /**
     * Create a new `AWS::ImageBuilder::Component`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComponentProps);
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
 * Properties for defining a `CfnContainerRecipe`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html
 */
export interface CfnContainerRecipeProps {
    /**
     * Build and test components that are included in the container recipe. Recipes require a minimum of one build component, and can have a maximum of 20 build and test components in any combination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-components
     */
    readonly components: Array<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Specifies the type of container, such as Docker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-containertype
     */
    readonly containerType: string;
    /**
     * The name of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-name
     */
    readonly name: string;
    /**
     * The base image for the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-parentimage
     */
    readonly parentImage: string;
    /**
     * The destination repository for the container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-targetrepository
     */
    readonly targetRepository: CfnContainerRecipe.TargetContainerRepositoryProperty | cdk.IResolvable;
    /**
     * The semantic version of the container recipe.
     *
     * > The semantic version has four nodes: <major>.<minor>.<patch>/<build>. You can assign values for the first three, and can filter on all of them.
     * >
     * > *Assignment:* For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.
     * >
     * > *Patterns:* You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.
     * >
     * > *Filtering:* With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-version
     */
    readonly version: string;
    /**
     * The description of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-description
     */
    readonly description?: string;
    /**
     * Dockerfiles are text documents that are used to build Docker containers, and ensure that they contain all of the elements required by the application running inside. The template data consists of contextual variables where Image Builder places build information or scripts, based on your container image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplatedata
     */
    readonly dockerfileTemplateData?: string;
    /**
     * The S3 URI for the Dockerfile that will be used to build your container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplateuri
     */
    readonly dockerfileTemplateUri?: string;
    /**
     * Specifies the operating system version for the base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-imageosversionoverride
     */
    readonly imageOsVersionOverride?: string;
    /**
     * A group of options that can be used to configure an instance for building and testing container images.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-instanceconfiguration
     */
    readonly instanceConfiguration?: CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable;
    /**
     * Identifies which KMS key is used to encrypt the container image for distribution to the target Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-kmskeyid
     */
    readonly kmsKeyId?: string;
    /**
     * Specifies the operating system platform when you use a custom base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-platformoverride
     */
    readonly platformOverride?: string;
    /**
     * Tags that are attached to the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * The working directory for use during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-workingdirectory
     */
    readonly workingDirectory?: string;
}
/**
 * A CloudFormation `AWS::ImageBuilder::ContainerRecipe`
 *
 * Creates a new container recipe. Container recipes define how images are configured, tested, and assessed.
 *
 * @cloudformationResource AWS::ImageBuilder::ContainerRecipe
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html
 */
export declare class CfnContainerRecipe extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::ContainerRecipe";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContainerRecipe;
    /**
     * Returns the Amazon Resource Name (ARN) of the container recipe. For example, `arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/mybasicrecipe/2020.12.17` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the name of the container recipe.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * Build and test components that are included in the container recipe. Recipes require a minimum of one build component, and can have a maximum of 20 build and test components in any combination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-components
     */
    components: Array<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Specifies the type of container, such as Docker.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-containertype
     */
    containerType: string;
    /**
     * The name of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-name
     */
    name: string;
    /**
     * The base image for the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-parentimage
     */
    parentImage: string;
    /**
     * The destination repository for the container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-targetrepository
     */
    targetRepository: CfnContainerRecipe.TargetContainerRepositoryProperty | cdk.IResolvable;
    /**
     * The semantic version of the container recipe.
     *
     * > The semantic version has four nodes: <major>.<minor>.<patch>/<build>. You can assign values for the first three, and can filter on all of them.
     * >
     * > *Assignment:* For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.
     * >
     * > *Patterns:* You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.
     * >
     * > *Filtering:* With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-version
     */
    version: string;
    /**
     * The description of the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-description
     */
    description: string | undefined;
    /**
     * Dockerfiles are text documents that are used to build Docker containers, and ensure that they contain all of the elements required by the application running inside. The template data consists of contextual variables where Image Builder places build information or scripts, based on your container image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplatedata
     */
    dockerfileTemplateData: string | undefined;
    /**
     * The S3 URI for the Dockerfile that will be used to build your container image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplateuri
     */
    dockerfileTemplateUri: string | undefined;
    /**
     * Specifies the operating system version for the base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-imageosversionoverride
     */
    imageOsVersionOverride: string | undefined;
    /**
     * A group of options that can be used to configure an instance for building and testing container images.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-instanceconfiguration
     */
    instanceConfiguration: CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Identifies which KMS key is used to encrypt the container image for distribution to the target Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-kmskeyid
     */
    kmsKeyId: string | undefined;
    /**
     * Specifies the operating system platform when you use a custom base image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-platformoverride
     */
    platformOverride: string | undefined;
    /**
     * Tags that are attached to the container recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The working directory for use during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-workingdirectory
     */
    workingDirectory: string | undefined;
    /**
     * Create a new `AWS::ImageBuilder::ContainerRecipe`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContainerRecipeProps);
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
export declare namespace CfnContainerRecipe {
    /**
     * Configuration details of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html
     */
    interface ComponentConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html#cfn-imagebuilder-containerrecipe-componentconfiguration-componentarn
         */
        readonly componentArn?: string;
        /**
         * A group of parameter settings that Image Builder uses to configure the component for a specific recipe.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html#cfn-imagebuilder-containerrecipe-componentconfiguration-parameters
         */
        readonly parameters?: Array<CfnContainerRecipe.ComponentParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnContainerRecipe {
    /**
     * Contains a key/value pair that sets the named component parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html
     */
    interface ComponentParameterProperty {
        /**
         * The name of the component parameter to set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html#cfn-imagebuilder-containerrecipe-componentparameter-name
         */
        readonly name: string;
        /**
         * Sets the value for the named component parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html#cfn-imagebuilder-containerrecipe-componentparameter-value
         */
        readonly value: string[];
    }
}
export declare namespace CfnContainerRecipe {
    /**
     * Amazon EBS-specific block device mapping specifications.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html
     */
    interface EbsInstanceBlockDeviceSpecificationProperty {
        /**
         * Use to configure delete on termination of the associated device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-deleteontermination
         */
        readonly deleteOnTermination?: boolean | cdk.IResolvable;
        /**
         * Use to configure device encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-encrypted
         */
        readonly encrypted?: boolean | cdk.IResolvable;
        /**
         * Use to configure device IOPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-iops
         */
        readonly iops?: number;
        /**
         * Use to configure the KMS key to use when encrypting the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * The snapshot that defines the device contents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-snapshotid
         */
        readonly snapshotId?: string;
        /**
         * *For GP3 volumes only* – The throughput in MiB/s that the volume supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-throughput
         */
        readonly throughput?: number;
        /**
         * Use to override the device's volume size.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-volumesize
         */
        readonly volumeSize?: number;
        /**
         * Use to override the device's volume type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-volumetype
         */
        readonly volumeType?: string;
    }
}
export declare namespace CfnContainerRecipe {
    /**
     * Defines block device mappings for the instance used to configure your image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html
     */
    interface InstanceBlockDeviceMappingProperty {
        /**
         * The device to which these mappings apply.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-devicename
         */
        readonly deviceName?: string;
        /**
         * Use to manage Amazon EBS-specific configuration for this mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-ebs
         */
        readonly ebs?: CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable;
        /**
         * Use to remove a mapping from the base image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-nodevice
         */
        readonly noDevice?: string;
        /**
         * Use to manage instance ephemeral devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-virtualname
         */
        readonly virtualName?: string;
    }
}
export declare namespace CfnContainerRecipe {
    /**
     * Defines a custom base AMI and block device mapping configurations of an instance used for building and testing container images.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html
     */
    interface InstanceConfigurationProperty {
        /**
         * Defines the block devices to attach for building an instance from this Image Builder AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html#cfn-imagebuilder-containerrecipe-instanceconfiguration-blockdevicemappings
         */
        readonly blockDeviceMappings?: Array<CfnContainerRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The AMI ID to use as the base image for a container build and test instance. If not specified, Image Builder will use the appropriate ECS-optimized AMI as a base image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html#cfn-imagebuilder-containerrecipe-instanceconfiguration-image
         */
        readonly image?: string;
    }
}
export declare namespace CfnContainerRecipe {
    /**
     * The container repository where the output container image is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html
     */
    interface TargetContainerRepositoryProperty {
        /**
         * The name of the container repository where the output container image is stored. This name is prefixed by the repository location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html#cfn-imagebuilder-containerrecipe-targetcontainerrepository-repositoryname
         */
        readonly repositoryName?: string;
        /**
         * Specifies the service in which this image was registered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html#cfn-imagebuilder-containerrecipe-targetcontainerrepository-service
         */
        readonly service?: string;
    }
}
/**
 * Properties for defining a `CfnDistributionConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html
 */
export interface CfnDistributionConfigurationProps {
    /**
     * The distributions of this distribution configuration formatted as an array of Distribution objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-distributions
     */
    readonly distributions: Array<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-name
     */
    readonly name: string;
    /**
     * The description of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-description
     */
    readonly description?: string;
    /**
     * The tags of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::ImageBuilder::DistributionConfiguration`
 *
 * A distribution configuration allows you to specify the name and description of your output AMI, authorize other AWS account s to launch the AMI, and replicate the AMI to other AWS Regions . It also allows you to export the AMI to Amazon S3 .
 *
 * @cloudformationResource AWS::ImageBuilder::DistributionConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html
 */
export declare class CfnDistributionConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::DistributionConfiguration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDistributionConfiguration;
    /**
     * Returns the Amazon Resource Name (ARN) of this distribution configuration. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the name of the distribution configuration.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The distributions of this distribution configuration formatted as an array of Distribution objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-distributions
     */
    distributions: Array<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-name
     */
    name: string;
    /**
     * The description of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-description
     */
    description: string | undefined;
    /**
     * The tags of this distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ImageBuilder::DistributionConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDistributionConfigurationProps);
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
export declare namespace CfnDistributionConfiguration {
    /**
     * Define and configure the output AMIs of the pipeline.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html
     */
    interface AmiDistributionConfigurationProperty {
        /**
         * The tags to apply to AMIs distributed to this Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-amitags
         */
        readonly amiTags?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The description of the AMI distribution configuration. Minimum and maximum length are in characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-description
         */
        readonly description?: string;
        /**
         * The KMS key identifier used to encrypt the distributed image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * Launch permissions can be used to configure which AWS account s can use the AMI to launch instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-launchpermissionconfiguration
         */
        readonly launchPermissionConfiguration?: CfnDistributionConfiguration.LaunchPermissionConfigurationProperty | cdk.IResolvable;
        /**
         * The name of the output AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-name
         */
        readonly name?: string;
        /**
         * The ID of an account to which you want to distribute an image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-targetaccountids
         */
        readonly targetAccountIds?: string[];
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * Container distribution settings for encryption, licensing, and sharing in a specific Region.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html
     */
    interface ContainerDistributionConfigurationProperty {
        /**
         * Tags that are attached to the container distribution configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-containertags
         */
        readonly containerTags?: string[];
        /**
         * The description of the container distribution configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-description
         */
        readonly description?: string;
        /**
         * The destination repository for the container distribution configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-targetrepository
         */
        readonly targetRepository?: CfnDistributionConfiguration.TargetContainerRepositoryProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * The distribution configuration distribution defines the settings for a specific Region in the Distribution Configuration. You must specify whether the distribution is for an AMI or a container image. To do so, include exactly one of the following data types for your distribution:
     *
     * - amiDistributionConfiguration
     * - containerDistributionConfiguration
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html
     */
    interface DistributionProperty {
        /**
         * The specific AMI settings, such as launch permissions and AMI tags. For details, see example schema below.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-amidistributionconfiguration
         */
        readonly amiDistributionConfiguration?: any | cdk.IResolvable;
        /**
         * Container distribution settings for encryption, licensing, and sharing in a specific Region. For details, see example schema below.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-containerdistributionconfiguration
         */
        readonly containerDistributionConfiguration?: any | cdk.IResolvable;
        /**
         * The Windows faster-launching configurations to use for AMI distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-fastlaunchconfigurations
         */
        readonly fastLaunchConfigurations?: Array<CfnDistributionConfiguration.FastLaunchConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A group of launchTemplateConfiguration settings that apply to image distribution for specified accounts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-launchtemplateconfigurations
         */
        readonly launchTemplateConfigurations?: Array<CfnDistributionConfiguration.LaunchTemplateConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The License Manager Configuration to associate with the AMI in the specified Region. For more information, see the [LicenseConfiguration API](https://docs.aws.amazon.com/license-manager/latest/APIReference/API_LicenseConfiguration.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-licenseconfigurationarns
         */
        readonly licenseConfigurationArns?: string[];
        /**
         * The target Region for the Distribution Configuration. For example, `eu-west-1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-region
         */
        readonly region: string;
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * Define and configure faster launching for output Windows AMIs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html
     */
    interface FastLaunchConfigurationProperty {
        /**
         * The owner account ID for the fast-launch enabled Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-accountid
         */
        readonly accountId?: string;
        /**
         * A Boolean that represents the current state of faster launching for the Windows AMI. Set to `true` to start using Windows faster launching, or `false` to stop using it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The launch template that the fast-launch enabled Windows AMI uses when it launches Windows instances to create pre-provisioned snapshots.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-launchtemplate
         */
        readonly launchTemplate?: CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty | cdk.IResolvable;
        /**
         * The maximum number of parallel instances that are launched for creating resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-maxparallellaunches
         */
        readonly maxParallelLaunches?: number;
        /**
         * Configuration settings for managing the number of snapshots that are created from pre-provisioned instances for the Windows AMI when faster launching is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-snapshotconfiguration
         */
        readonly snapshotConfiguration?: CfnDistributionConfiguration.FastLaunchSnapshotConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * Identifies the launch template that the associated Windows AMI uses for launching an instance when faster launching is enabled.
     *
     * > You can specify either the `launchTemplateName` or the `launchTemplateId` , but not both.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html
     */
    interface FastLaunchLaunchTemplateSpecificationProperty {
        /**
         * The ID of the launch template to use for faster launching for a Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplateid
         */
        readonly launchTemplateId?: string;
        /**
         * The name of the launch template to use for faster launching for a Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplatename
         */
        readonly launchTemplateName?: string;
        /**
         * The version of the launch template to use for faster launching for a Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplateversion
         */
        readonly launchTemplateVersion?: string;
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * Configuration settings for creating and managing pre-provisioned snapshots for a fast-launch enabled Windows AMI.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration.html
     */
    interface FastLaunchSnapshotConfigurationProperty {
        /**
         * The number of pre-provisioned snapshots to keep on hand for a fast-launch enabled Windows AMI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration-targetresourcecount
         */
        readonly targetResourceCount?: number;
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * Describes the configuration for a launch permission. The launch permission modification request is sent to the [Amazon EC2 ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) API on behalf of the user for each Region they have selected to distribute the AMI. To make an AMI public, set the launch permission authorized accounts to `all` . See the examples for making an AMI public at [Amazon EC2 ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html
     */
    interface LaunchPermissionConfigurationProperty {
        /**
         * The ARN for an AWS Organization that you want to share your AMI with. For more information, see [What is AWS Organizations ?](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-organizationarns
         */
        readonly organizationArns?: string[];
        /**
         * The ARN for an AWS Organizations organizational unit (OU) that you want to share your AMI with. For more information about key concepts for AWS Organizations , see [AWS Organizations terminology and concepts](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-organizationalunitarns
         */
        readonly organizationalUnitArns?: string[];
        /**
         * The name of the group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-usergroups
         */
        readonly userGroups?: string[];
        /**
         * The AWS account ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-userids
         */
        readonly userIds?: string[];
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * Identifies an Amazon EC2 launch template to use for a specific account.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html
     */
    interface LaunchTemplateConfigurationProperty {
        /**
         * The account ID that this configuration applies to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-accountid
         */
        readonly accountId?: string;
        /**
         * Identifies the Amazon EC2 launch template to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-launchtemplateid
         */
        readonly launchTemplateId?: string;
        /**
         * Set the specified Amazon EC2 launch template as the default launch template for the specified account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-setdefaultversion
         */
        readonly setDefaultVersion?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnDistributionConfiguration {
    /**
     * The container repository where the output container image is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html
     */
    interface TargetContainerRepositoryProperty {
        /**
         * The name of the container repository where the output container image is stored. This name is prefixed by the repository location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html#cfn-imagebuilder-distributionconfiguration-targetcontainerrepository-repositoryname
         */
        readonly repositoryName?: string;
        /**
         * Specifies the service in which this image was registered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html#cfn-imagebuilder-distributionconfiguration-targetcontainerrepository-service
         */
        readonly service?: string;
    }
}
/**
 * Properties for defining a `CfnImage`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html
 */
export interface CfnImageProps {
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-infrastructureconfigurationarn
     */
    readonly infrastructureConfigurationArn: string;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-containerrecipearn
     */
    readonly containerRecipeArn?: string;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-distributionconfigurationarn
     */
    readonly distributionConfigurationArn?: string;
    /**
     * Indicates whether Image Builder collects additional information about the image, such as the operating system (OS) version and package list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-enhancedimagemetadataenabled
     */
    readonly enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagerecipearn
     */
    readonly imageRecipeArn?: string;
    /**
     * The configuration settings for your image test components, which includes a toggle that allows you to turn off tests, and a timeout setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagetestsconfiguration
     */
    readonly imageTestsConfiguration?: CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable;
    /**
     * The tags of the image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::ImageBuilder::Image`
 *
 * An image build version. An image is a customized, secure, and up-to-date “golden” server image that is pre-installed and pre-configured with software and settings to meet specific IT standards.
 *
 * @cloudformationResource AWS::ImageBuilder::Image
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html
 */
export declare class CfnImage extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::Image";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImage;
    /**
     * Returns the Amazon Resource Name (ARN) of the image. For example, `arn:aws:imagebuilder:us-west-2:123456789012:image/mybasicrecipe/2019.12.03/1` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the AMI ID of the Amazon EC2 AMI in the Region in which you are using Image Builder. Values are returned only for AMIs, and not for container images.
     * @cloudformationAttribute ImageId
     */
    readonly attrImageId: string;
    /**
     * Returns a list of URIs for container images created in the context Region. Values are returned only for container images, and not for AMIs.
     * @cloudformationAttribute ImageUri
     */
    readonly attrImageUri: string;
    /**
     * Returns the name of the image.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-infrastructureconfigurationarn
     */
    infrastructureConfigurationArn: string;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-containerrecipearn
     */
    containerRecipeArn: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-distributionconfigurationarn
     */
    distributionConfigurationArn: string | undefined;
    /**
     * Indicates whether Image Builder collects additional information about the image, such as the operating system (OS) version and package list.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-enhancedimagemetadataenabled
     */
    enhancedImageMetadataEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * The Amazon Resource Name (ARN) of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagerecipearn
     */
    imageRecipeArn: string | undefined;
    /**
     * The configuration settings for your image test components, which includes a toggle that allows you to turn off tests, and a timeout setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagetestsconfiguration
     */
    imageTestsConfiguration: CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The tags of the image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ImageBuilder::Image`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnImageProps);
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
export declare namespace CfnImage {
    /**
     * When you create an image or container recipe with Image Builder , you can add the build or test components that are used to create the final image. You must have at least one build component to create a recipe, but test components are not required. If you have added tests, they run after the image is created, to ensure that the target image is functional and can be used reliably for launching Amazon EC2 instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html
     */
    interface ImageTestsConfigurationProperty {
        /**
         * Determines if tests should run after building the image. Image Builder defaults to enable tests to run following the image build, before image distribution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html#cfn-imagebuilder-image-imagetestsconfiguration-imagetestsenabled
         */
        readonly imageTestsEnabled?: boolean | cdk.IResolvable;
        /**
         * The maximum time in minutes that tests are permitted to run.
         *
         * > The timeoutMinutes attribute is not currently active. This value is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html#cfn-imagebuilder-image-imagetestsconfiguration-timeoutminutes
         */
        readonly timeoutMinutes?: number;
    }
}
/**
 * Properties for defining a `CfnImagePipeline`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html
 */
export interface CfnImagePipelineProps {
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-infrastructureconfigurationarn
     */
    readonly infrastructureConfigurationArn: string;
    /**
     * The name of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-name
     */
    readonly name: string;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-containerrecipearn
     */
    readonly containerRecipeArn?: string;
    /**
     * The description of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-description
     */
    readonly description?: string;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-distributionconfigurationarn
     */
    readonly distributionConfigurationArn?: string;
    /**
     * Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-enhancedimagemetadataenabled
     */
    readonly enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the image recipe associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagerecipearn
     */
    readonly imageRecipeArn?: string;
    /**
     * The configuration of the image tests that run after image creation to ensure the quality of the image that was created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration
     */
    readonly imageTestsConfiguration?: CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable;
    /**
     * The schedule of the image pipeline. A schedule configures how often and when a pipeline automatically creates a new image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-schedule
     */
    readonly schedule?: CfnImagePipeline.ScheduleProperty | cdk.IResolvable;
    /**
     * The status of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-status
     */
    readonly status?: string;
    /**
     * The tags of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::ImageBuilder::ImagePipeline`
 *
 * An image pipeline is the automation configuration for building secure OS images on AWS . The Image Builder image pipeline is associated with an image recipe that defines the build, validation, and test phases for an image build lifecycle. An image pipeline can be associated with an infrastructure configuration that defines where your image is built. You can define attributes, such as instance type, subnets, security groups, logging, and other infrastructure-related configurations. You can also associate your image pipeline with a distribution configuration to define how you would like to deploy your image.
 *
 * @cloudformationResource AWS::ImageBuilder::ImagePipeline
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html
 */
export declare class CfnImagePipeline extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::ImagePipeline";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImagePipeline;
    /**
     * Returns the Amazon Resource Name (ARN) of the image pipeline. For example, `arn:aws:imagebuilder:us-west-2:123456789012:image-pipeline/mywindows2016pipeline` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the name of the image pipeline.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-infrastructureconfigurationarn
     */
    infrastructureConfigurationArn: string;
    /**
     * The name of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-name
     */
    name: string;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-containerrecipearn
     */
    containerRecipeArn: string | undefined;
    /**
     * The description of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-description
     */
    description: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-distributionconfigurationarn
     */
    distributionConfigurationArn: string | undefined;
    /**
     * Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-enhancedimagemetadataenabled
     */
    enhancedImageMetadataEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * The Amazon Resource Name (ARN) of the image recipe associated with this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagerecipearn
     */
    imageRecipeArn: string | undefined;
    /**
     * The configuration of the image tests that run after image creation to ensure the quality of the image that was created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration
     */
    imageTestsConfiguration: CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The schedule of the image pipeline. A schedule configures how often and when a pipeline automatically creates a new image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-schedule
     */
    schedule: CfnImagePipeline.ScheduleProperty | cdk.IResolvable | undefined;
    /**
     * The status of the image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-status
     */
    status: string | undefined;
    /**
     * The tags of this image pipeline.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ImageBuilder::ImagePipeline`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnImagePipelineProps);
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
export declare namespace CfnImagePipeline {
    /**
     * When you create an image or container recipe with Image Builder , you can add the build or test components that your image pipeline uses to create the final image. You must have at least one build component to create a recipe, but test components are not required. Your pipeline runs tests after it builds the image, to ensure that the target image is functional and can be used reliably for launching Amazon EC2 instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html
     */
    interface ImageTestsConfigurationProperty {
        /**
         * Defines if tests should be executed when building this image. For example, `true` or `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration-imagetestsenabled
         */
        readonly imageTestsEnabled?: boolean | cdk.IResolvable;
        /**
         * The maximum time in minutes that tests are permitted to run.
         *
         * > The timeoutMinutes attribute is not currently active. This value is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration-timeoutminutes
         */
        readonly timeoutMinutes?: number;
    }
}
export declare namespace CfnImagePipeline {
    /**
     * A schedule configures how often and when a pipeline will automatically create a new image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html
     */
    interface ScheduleProperty {
        /**
         * The condition configures when the pipeline should trigger a new image build. When the `pipelineExecutionStartCondition` is set to `EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE` , and you use semantic version filters on the base image or components in your image recipe, Image Builder will build a new image only when there are new versions of the image or components in your recipe that match the semantic version filter. When it is set to `EXPRESSION_MATCH_ONLY` , it will build a new image every time the CRON expression matches the current time. For semantic version syntax, see [CreateComponent](https://docs.aws.amazon.com/imagebuilder/latest/APIReference/API_CreateComponent.html) in the *Image Builder API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html#cfn-imagebuilder-imagepipeline-schedule-pipelineexecutionstartcondition
         */
        readonly pipelineExecutionStartCondition?: string;
        /**
         * The cron expression determines how often EC2 Image Builder evaluates your `pipelineExecutionStartCondition` .
         *
         * For information on how to format a cron expression in Image Builder, see [Use cron expressions in EC2 Image Builder](https://docs.aws.amazon.com/imagebuilder/latest/userguide/image-builder-cron.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html#cfn-imagebuilder-imagepipeline-schedule-scheduleexpression
         */
        readonly scheduleExpression?: string;
    }
}
/**
 * Properties for defining a `CfnImageRecipe`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html
 */
export interface CfnImageRecipeProps {
    /**
     * The components of the image recipe. Components are orchestration documents that define a sequence of steps for downloading, installing, configuring, and testing software packages. They also define validation and security hardening steps. A component is defined using a YAML document format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-components
     */
    readonly components: Array<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-name
     */
    readonly name: string;
    /**
     * The parent image of the image recipe. The string must be either an Image ARN or an AMI ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-parentimage
     */
    readonly parentImage: string;
    /**
     * The semantic version of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-version
     */
    readonly version: string;
    /**
     * Before you create a new AMI, Image Builder launches temporary Amazon EC2 instances to build and test your image configuration. Instance configuration adds a layer of control over those instances. You can define settings and add scripts to run when an instance is launched from your AMI.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration
     */
    readonly additionalInstanceConfiguration?: CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable;
    /**
     * The block device mappings to apply when creating images from this recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-blockdevicemappings
     */
    readonly blockDeviceMappings?: Array<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The description of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-description
     */
    readonly description?: string;
    /**
     * The tags of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * The working directory to be used during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-workingdirectory
     */
    readonly workingDirectory?: string;
}
/**
 * A CloudFormation `AWS::ImageBuilder::ImageRecipe`
 *
 * An Image Builder image recipe is a document that defines the base image and the components to be applied to the base image to produce the desired configuration for the output image. You can use an image recipe to duplicate builds. Image Builder image recipes can be shared, branched, and edited using the console wizard, the AWS CLI , or the API. You can use image recipes with your version control software to maintain shareable versioned image recipes.
 *
 * @cloudformationResource AWS::ImageBuilder::ImageRecipe
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html
 */
export declare class CfnImageRecipe extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::ImageRecipe";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImageRecipe;
    /**
     * Returns the Amazon Resource Name (ARN) of the image recipe. For example, `arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/mybasicrecipe/2019.12.03` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the image recipe.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The components of the image recipe. Components are orchestration documents that define a sequence of steps for downloading, installing, configuring, and testing software packages. They also define validation and security hardening steps. A component is defined using a YAML document format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-components
     */
    components: Array<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-name
     */
    name: string;
    /**
     * The parent image of the image recipe. The string must be either an Image ARN or an AMI ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-parentimage
     */
    parentImage: string;
    /**
     * The semantic version of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-version
     */
    version: string;
    /**
     * Before you create a new AMI, Image Builder launches temporary Amazon EC2 instances to build and test your image configuration. Instance configuration adds a layer of control over those instances. You can define settings and add scripts to run when an instance is launched from your AMI.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration
     */
    additionalInstanceConfiguration: CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The block device mappings to apply when creating images from this recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-blockdevicemappings
     */
    blockDeviceMappings: Array<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The description of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-description
     */
    description: string | undefined;
    /**
     * The tags of the image recipe.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The working directory to be used during build and test workflows.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-workingdirectory
     */
    workingDirectory: string | undefined;
    /**
     * Create a new `AWS::ImageBuilder::ImageRecipe`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnImageRecipeProps);
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
export declare namespace CfnImageRecipe {
    /**
     * In addition to your infrastructure configuration, these settings provide an extra layer of control over your build instances. You can also specify commands to run on launch for all of your build instances.
     *
     * Image Builder does not automatically install the Systems Manager agent on Windows instances. If your base image includes the Systems Manager agent, then the AMI that you create will also include the agent. For Linux instances, if the base image does not already include the Systems Manager agent, Image Builder installs it. For Linux instances where Image Builder installs the Systems Manager agent, you can choose whether to keep it for the AMI that you create.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html
     */
    interface AdditionalInstanceConfigurationProperty {
        /**
         * Contains settings for the Systems Manager agent on your build instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration-systemsmanageragent
         */
        readonly systemsManagerAgent?: CfnImageRecipe.SystemsManagerAgentProperty | cdk.IResolvable;
        /**
         * Use this property to provide commands or a command script to run when you launch your build instance.
         *
         * The userDataOverride property replaces any commands that Image Builder might have added to ensure that Systems Manager is installed on your Linux build instance. If you override the user data, make sure that you add commands to install Systems Manager, if it is not pre-installed on your base image.
         *
         * > The user data is always base 64 encoded. For example, the following commands are encoded as `IyEvYmluL2Jhc2gKbWtkaXIgLXAgL3Zhci9iYi8KdG91Y2ggL3Zhci$` :
         * >
         * > *#!/bin/bash*
         * >
         * > mkdir -p /var/bb/
         * >
         * > touch /var
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration-userdataoverride
         */
        readonly userDataOverride?: string;
    }
}
export declare namespace CfnImageRecipe {
    /**
     * Configuration details of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html
     */
    interface ComponentConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html#cfn-imagebuilder-imagerecipe-componentconfiguration-componentarn
         */
        readonly componentArn?: string;
        /**
         * A group of parameter settings that Image Builder uses to configure the component for a specific recipe.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html#cfn-imagebuilder-imagerecipe-componentconfiguration-parameters
         */
        readonly parameters?: Array<CfnImageRecipe.ComponentParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnImageRecipe {
    /**
     * Contains a key/value pair that sets the named component parameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html
     */
    interface ComponentParameterProperty {
        /**
         * The name of the component parameter to set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html#cfn-imagebuilder-imagerecipe-componentparameter-name
         */
        readonly name: string;
        /**
         * Sets the value for the named component parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html#cfn-imagebuilder-imagerecipe-componentparameter-value
         */
        readonly value: string[];
    }
}
export declare namespace CfnImageRecipe {
    /**
     * The image recipe EBS instance block device specification includes the Amazon EBS-specific block device mapping specifications for the image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html
     */
    interface EbsInstanceBlockDeviceSpecificationProperty {
        /**
         * Configures delete on termination of the associated device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-deleteontermination
         */
        readonly deleteOnTermination?: boolean | cdk.IResolvable;
        /**
         * Use to configure device encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-encrypted
         */
        readonly encrypted?: boolean | cdk.IResolvable;
        /**
         * Use to configure device IOPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-iops
         */
        readonly iops?: number;
        /**
         * Use to configure the KMS key to use when encrypting the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * The snapshot that defines the device contents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-snapshotid
         */
        readonly snapshotId?: string;
        /**
         * *For GP3 volumes only* – The throughput in MiB/s that the volume supports.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-throughput
         */
        readonly throughput?: number;
        /**
         * Overrides the volume size of the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-volumesize
         */
        readonly volumeSize?: number;
        /**
         * Overrides the volume type of the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-volumetype
         */
        readonly volumeType?: string;
    }
}
export declare namespace CfnImageRecipe {
    /**
     * Defines block device mappings for the instance used to configure your image.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html
     */
    interface InstanceBlockDeviceMappingProperty {
        /**
         * The device to which these mappings apply.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-devicename
         */
        readonly deviceName?: string;
        /**
         * Use to manage Amazon EBS-specific configuration for this mapping.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-ebs
         */
        readonly ebs?: CfnImageRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable;
        /**
         * Enter an empty string to remove a mapping from the parent image.
         *
         * The following is an example of an empty string value in the `NoDevice` field.
         *
         * `NoDevice:""`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-nodevice
         */
        readonly noDevice?: string;
        /**
         * Manages the instance ephemeral devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-virtualname
         */
        readonly virtualName?: string;
    }
}
export declare namespace CfnImageRecipe {
    /**
     * Contains settings for the Systems Manager agent on your build instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-systemsmanageragent.html
     */
    interface SystemsManagerAgentProperty {
        /**
         * Controls whether the Systems Manager agent is removed from your final build image, prior to creating the new AMI. If this is set to true, then the agent is removed from the final image. If it's set to false, then the agent is left in, so that it is included in the new AMI. The default value is false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-systemsmanageragent.html#cfn-imagebuilder-imagerecipe-systemsmanageragent-uninstallafterbuild
         */
        readonly uninstallAfterBuild?: boolean | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnInfrastructureConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html
 */
export interface CfnInfrastructureConfigurationProps {
    /**
     * The instance profile of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instanceprofilename
     */
    readonly instanceProfileName: string;
    /**
     * The name of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-name
     */
    readonly name: string;
    /**
     * The description of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-description
     */
    readonly description?: string;
    /**
     * The instance metadata option settings for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions
     */
    readonly instanceMetadataOptions?: CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable;
    /**
     * The instance types of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancetypes
     */
    readonly instanceTypes?: string[];
    /**
     * The Amazon EC2 key pair of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-keypair
     */
    readonly keyPair?: string;
    /**
     * The logging configuration defines where Image Builder uploads your logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-logging
     */
    readonly logging?: CfnInfrastructureConfiguration.LoggingProperty | cdk.IResolvable;
    /**
     * The tags attached to the resource created by Image Builder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-resourcetags
     */
    readonly resourceTags?: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * The security group IDs of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-securitygroupids
     */
    readonly securityGroupIds?: string[];
    /**
     * The Amazon Resource Name (ARN) of the SNS topic for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-snstopicarn
     */
    readonly snsTopicArn?: string;
    /**
     * The subnet ID of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-subnetid
     */
    readonly subnetId?: string;
    /**
     * The tags of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * The terminate instance on failure configuration of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-terminateinstanceonfailure
     */
    readonly terminateInstanceOnFailure?: boolean | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::ImageBuilder::InfrastructureConfiguration`
 *
 * The infrastructure configuration allows you to specify the infrastructure within which to build and test your image. In the infrastructure configuration, you can specify instance types, subnets, and security groups to associate with your instance. You can also associate an Amazon EC2 key pair with the instance used to build your image. This allows you to log on to your instance to troubleshoot if your build fails and you set terminateInstanceOnFailure to false.
 *
 * @cloudformationResource AWS::ImageBuilder::InfrastructureConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html
 */
export declare class CfnInfrastructureConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ImageBuilder::InfrastructureConfiguration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInfrastructureConfiguration;
    /**
     * Returns the Amazon Resource Name (ARN) of the infrastructure configuration. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the infrastructure configuration.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The instance profile of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instanceprofilename
     */
    instanceProfileName: string;
    /**
     * The name of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-name
     */
    name: string;
    /**
     * The description of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-description
     */
    description: string | undefined;
    /**
     * The instance metadata option settings for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions
     */
    instanceMetadataOptions: CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable | undefined;
    /**
     * The instance types of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancetypes
     */
    instanceTypes: string[] | undefined;
    /**
     * The Amazon EC2 key pair of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-keypair
     */
    keyPair: string | undefined;
    /**
     * The logging configuration defines where Image Builder uploads your logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-logging
     */
    logging: CfnInfrastructureConfiguration.LoggingProperty | cdk.IResolvable | undefined;
    /**
     * The tags attached to the resource created by Image Builder.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-resourcetags
     */
    resourceTags: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * The security group IDs of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-securitygroupids
     */
    securityGroupIds: string[] | undefined;
    /**
     * The Amazon Resource Name (ARN) of the SNS topic for the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-snstopicarn
     */
    snsTopicArn: string | undefined;
    /**
     * The subnet ID of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-subnetid
     */
    subnetId: string | undefined;
    /**
     * The tags of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The terminate instance on failure configuration of the infrastructure configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-terminateinstanceonfailure
     */
    terminateInstanceOnFailure: boolean | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::ImageBuilder::InfrastructureConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInfrastructureConfigurationProps);
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
export declare namespace CfnInfrastructureConfiguration {
    /**
     * The instance metadata options that apply to the HTTP requests that pipeline builds use to launch EC2 build and test instances. For more information about instance metadata options, see [Configure the instance metadata options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html) in the **Amazon EC2 User Guide** for Linux instances, or [Configure the instance metadata options](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/configuring-instance-metadata-options.html) in the **Amazon EC2 Windows Guide** for Windows instances.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html
     */
    interface InstanceMetadataOptionsProperty {
        /**
         * Limit the number of hops that an instance metadata request can traverse to reach its destination. The default is one hop. However, if HTTP tokens are required, container image builds need a minimum of two hops.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions-httpputresponsehoplimit
         */
        readonly httpPutResponseHopLimit?: number;
        /**
         * Indicates whether a signed token header is required for instance metadata retrieval requests. The values affect the response as follows:
         *
         * - *required* – When you retrieve the IAM role credentials, version 2.0 credentials are returned in all cases.
         * - *optional* – You can include a signed token header in your request to retrieve instance metadata, or you can leave it out. If you include it, version 2.0 credentials are returned for the IAM role. Otherwise, version 1.0 credentials are returned.
         *
         * The default setting is *optional* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions-httptokens
         */
        readonly httpTokens?: string;
    }
}
export declare namespace CfnInfrastructureConfiguration {
    /**
     * Logging configuration defines where Image Builder uploads your logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-logging.html
     */
    interface LoggingProperty {
        /**
         * The Amazon S3 logging configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-logging.html#cfn-imagebuilder-infrastructureconfiguration-logging-s3logs
         */
        readonly s3Logs?: CfnInfrastructureConfiguration.S3LogsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnInfrastructureConfiguration {
    /**
     * Amazon S3 logging configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html
     */
    interface S3LogsProperty {
        /**
         * The S3 bucket in which to store the logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html#cfn-imagebuilder-infrastructureconfiguration-s3logs-s3bucketname
         */
        readonly s3BucketName?: string;
        /**
         * The Amazon S3 path to the bucket where the logs are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html#cfn-imagebuilder-infrastructureconfiguration-s3logs-s3keyprefix
         */
        readonly s3KeyPrefix?: string;
    }
}
