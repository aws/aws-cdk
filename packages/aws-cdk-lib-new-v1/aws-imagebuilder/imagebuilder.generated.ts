/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new component that can be used to build, validate, test, and assess your image.
 *
 * The component is based on a YAML document that you specify using exactly one of the following methods:
 *
 * - Inline, using the `data` property in the request body.
 * - A URL that points to a YAML document file stored in Amazon S3, using the `uri` property in the request body.
 *
 * @cloudformationResource AWS::ImageBuilder::Component
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html
 */
export class CfnComponent extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::Component";

  /**
   * Build a CfnComponent from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponent {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnComponentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnComponent(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the component. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the encryption status of the component. For example `true` or `false` .
   *
   * @cloudformationAttribute Encrypted
   */
  public readonly attrEncrypted: cdk.IResolvable;

  /**
   * Returns the name of the component.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Image Builder determines the component type based on the phases that are defined in the component document. If there is only one phase, and its name is "test", then the type is `TEST` . For all other components, the type is `BUILD` .
   *
   * @cloudformationAttribute Type
   */
  public readonly attrType: string;

  /**
   * The change description of the component.
   */
  public changeDescription?: string;

  /**
   * Component `data` contains inline YAML document content for the component.
   */
  public data?: string;

  /**
   * Describes the contents of the component.
   */
  public description?: string;

  /**
   * The ID of the KMS key that is used to encrypt this component.
   */
  public kmsKeyId?: string;

  /**
   * The name of the component.
   */
  public name: string;

  /**
   * The operating system platform of the component.
   */
  public platform: string;

  /**
   * The operating system (OS) version supported by the component.
   */
  public supportedOsVersions?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that apply to the component.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The `uri` of a YAML component document file.
   */
  public uri?: string;

  /**
   * The component version.
   */
  public version: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnComponentProps) {
    super(scope, id, {
      "type": CfnComponent.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "platform", this);
    cdk.requireProperty(props, "version", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrEncrypted = this.getAtt("Encrypted");
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.attrType = cdk.Token.asString(this.getAtt("Type", cdk.ResolutionTypeHint.STRING));
    this.changeDescription = props.changeDescription;
    this.data = props.data;
    this.description = props.description;
    this.kmsKeyId = props.kmsKeyId;
    this.name = props.name;
    this.platform = props.platform;
    this.supportedOsVersions = props.supportedOsVersions;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::Component", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.uri = props.uri;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "changeDescription": this.changeDescription,
      "data": this.data,
      "description": this.description,
      "kmsKeyId": this.kmsKeyId,
      "name": this.name,
      "platform": this.platform,
      "supportedOsVersions": this.supportedOsVersions,
      "tags": this.tags.renderTags(),
      "uri": this.uri,
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponent.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnComponentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnComponent`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html
 */
export interface CfnComponentProps {
  /**
   * The change description of the component.
   *
   * Describes what change has been made in this version, or what makes this version different from other versions of the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-changedescription
   */
  readonly changeDescription?: string;

  /**
   * Component `data` contains inline YAML document content for the component.
   *
   * Alternatively, you can specify the `uri` of a YAML document file stored in Amazon S3. However, you cannot specify both properties.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-data
   */
  readonly data?: string;

  /**
   * Describes the contents of the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-description
   */
  readonly description?: string;

  /**
   * The ID of the KMS key that is used to encrypt this component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-name
   */
  readonly name: string;

  /**
   * The operating system platform of the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-platform
   */
  readonly platform: string;

  /**
   * The operating system (OS) version supported by the component.
   *
   * If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-supportedosversions
   */
  readonly supportedOsVersions?: Array<string>;

  /**
   * The tags that apply to the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The `uri` of a YAML component document file.
   *
   * This must be an S3 URL ( `s3://bucket/key` ), and the requester must have permission to access the S3 bucket it points to. If you use Amazon S3, you can specify component content up to your service quota.
   *
   * Alternatively, you can specify the YAML document inline, using the component `data` property. You cannot specify both properties.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-uri
   */
  readonly uri?: string;

  /**
   * The component version.
   *
   * For example, `1.0.0` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-component.html#cfn-imagebuilder-component-version
   */
  readonly version: string;
}

/**
 * Determine whether the given properties match those of a `CfnComponentProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("changeDescription", cdk.validateString)(properties.changeDescription));
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("platform", cdk.requiredValidator)(properties.platform));
  errors.collect(cdk.propertyValidator("platform", cdk.validateString)(properties.platform));
  errors.collect(cdk.propertyValidator("supportedOsVersions", cdk.listValidator(cdk.validateString))(properties.supportedOsVersions));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnComponentProps\"");
}

// @ts-ignore TS6133
function convertCfnComponentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentPropsValidator(properties).assertSuccess();
  return {
    "ChangeDescription": cdk.stringToCloudFormation(properties.changeDescription),
    "Data": cdk.stringToCloudFormation(properties.data),
    "Description": cdk.stringToCloudFormation(properties.description),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Platform": cdk.stringToCloudFormation(properties.platform),
    "SupportedOsVersions": cdk.listMapper(cdk.stringToCloudFormation)(properties.supportedOsVersions),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Uri": cdk.stringToCloudFormation(properties.uri),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnComponentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentProps>();
  ret.addPropertyResult("changeDescription", "ChangeDescription", (properties.ChangeDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ChangeDescription) : undefined));
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("platform", "Platform", (properties.Platform != null ? cfn_parse.FromCloudFormation.getString(properties.Platform) : undefined));
  ret.addPropertyResult("supportedOsVersions", "SupportedOsVersions", (properties.SupportedOsVersions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SupportedOsVersions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new container recipe.
 *
 * Container recipes define how images are configured, tested, and assessed.
 *
 * @cloudformationResource AWS::ImageBuilder::ContainerRecipe
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html
 */
export class CfnContainerRecipe extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::ContainerRecipe";

  /**
   * Build a CfnContainerRecipe from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContainerRecipe {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContainerRecipePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContainerRecipe(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the container recipe. For example, `arn:aws:imagebuilder:us-east-1:123456789012:container-recipe/mybasicrecipe/2020.12.17` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the name of the container recipe.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Build and test components that are included in the container recipe.
   */
  public components: Array<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the type of container, such as Docker.
   */
  public containerType: string;

  /**
   * The description of the container recipe.
   */
  public description?: string;

  /**
   * Dockerfiles are text documents that are used to build Docker containers, and ensure that they contain all of the elements required by the application running inside.
   */
  public dockerfileTemplateData?: string;

  /**
   * The S3 URI for the Dockerfile that will be used to build your container image.
   */
  public dockerfileTemplateUri?: string;

  /**
   * Specifies the operating system version for the base image.
   */
  public imageOsVersionOverride?: string;

  /**
   * A group of options that can be used to configure an instance for building and testing container images.
   */
  public instanceConfiguration?: CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable;

  /**
   * Identifies which KMS key is used to encrypt the container image for distribution to the target Region.
   */
  public kmsKeyId?: string;

  /**
   * The name of the container recipe.
   */
  public name: string;

  /**
   * The base image for the container recipe.
   */
  public parentImage: string;

  /**
   * Specifies the operating system platform when you use a custom base image.
   */
  public platformOverride?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags that are attached to the container recipe.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The destination repository for the container image.
   */
  public targetRepository: cdk.IResolvable | CfnContainerRecipe.TargetContainerRepositoryProperty;

  /**
   * The semantic version of the container recipe.
   */
  public version: string;

  /**
   * The working directory for use during build and test workflows.
   */
  public workingDirectory?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContainerRecipeProps) {
    super(scope, id, {
      "type": CfnContainerRecipe.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "components", this);
    cdk.requireProperty(props, "containerType", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "parentImage", this);
    cdk.requireProperty(props, "targetRepository", this);
    cdk.requireProperty(props, "version", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.components = props.components;
    this.containerType = props.containerType;
    this.description = props.description;
    this.dockerfileTemplateData = props.dockerfileTemplateData;
    this.dockerfileTemplateUri = props.dockerfileTemplateUri;
    this.imageOsVersionOverride = props.imageOsVersionOverride;
    this.instanceConfiguration = props.instanceConfiguration;
    this.kmsKeyId = props.kmsKeyId;
    this.name = props.name;
    this.parentImage = props.parentImage;
    this.platformOverride = props.platformOverride;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::ContainerRecipe", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetRepository = props.targetRepository;
    this.version = props.version;
    this.workingDirectory = props.workingDirectory;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "components": this.components,
      "containerType": this.containerType,
      "description": this.description,
      "dockerfileTemplateData": this.dockerfileTemplateData,
      "dockerfileTemplateUri": this.dockerfileTemplateUri,
      "imageOsVersionOverride": this.imageOsVersionOverride,
      "instanceConfiguration": this.instanceConfiguration,
      "kmsKeyId": this.kmsKeyId,
      "name": this.name,
      "parentImage": this.parentImage,
      "platformOverride": this.platformOverride,
      "tags": this.tags.renderTags(),
      "targetRepository": this.targetRepository,
      "version": this.version,
      "workingDirectory": this.workingDirectory
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContainerRecipe.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContainerRecipePropsToCloudFormation(props);
  }
}

export namespace CfnContainerRecipe {
  /**
   * Defines a custom base AMI and block device mapping configurations of an instance used for building and testing container images.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html
   */
  export interface InstanceConfigurationProperty {
    /**
     * Defines the block devices to attach for building an instance from this Image Builder AMI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html#cfn-imagebuilder-containerrecipe-instanceconfiguration-blockdevicemappings
     */
    readonly blockDeviceMappings?: Array<CfnContainerRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The AMI ID to use as the base image for a container build and test instance.
     *
     * If not specified, Image Builder will use the appropriate ECS-optimized AMI as a base image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceconfiguration.html#cfn-imagebuilder-containerrecipe-instanceconfiguration-image
     */
    readonly image?: string;
  }

  /**
   * Defines block device mappings for the instance used to configure your image.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html
   */
  export interface InstanceBlockDeviceMappingProperty {
    /**
     * The device to which these mappings apply.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-devicename
     */
    readonly deviceName?: string;

    /**
     * Use to manage Amazon EBS-specific configuration for this mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-ebs
     */
    readonly ebs?: CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable;

    /**
     * Use to remove a mapping from the base image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-nodevice
     */
    readonly noDevice?: string;

    /**
     * Use to manage instance ephemeral devices.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-instanceblockdevicemapping.html#cfn-imagebuilder-containerrecipe-instanceblockdevicemapping-virtualname
     */
    readonly virtualName?: string;
  }

  /**
   * Amazon EBS-specific block device mapping specifications.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html
   */
  export interface EbsInstanceBlockDeviceSpecificationProperty {
    /**
     * Use to configure delete on termination of the associated device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-deleteontermination
     */
    readonly deleteOnTermination?: boolean | cdk.IResolvable;

    /**
     * Use to configure device encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-encrypted
     */
    readonly encrypted?: boolean | cdk.IResolvable;

    /**
     * Use to configure device IOPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-iops
     */
    readonly iops?: number;

    /**
     * Use to configure the KMS key to use when encrypting the device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The snapshot that defines the device contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-snapshotid
     */
    readonly snapshotId?: string;

    /**
     * *For GP3 volumes only* – The throughput in MiB/s that the volume supports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-throughput
     */
    readonly throughput?: number;

    /**
     * Use to override the device's volume size.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-volumesize
     */
    readonly volumeSize?: number;

    /**
     * Use to override the device's volume type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-containerrecipe-ebsinstanceblockdevicespecification-volumetype
     */
    readonly volumeType?: string;
  }

  /**
   * Configuration details of the component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html
   */
  export interface ComponentConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html#cfn-imagebuilder-containerrecipe-componentconfiguration-componentarn
     */
    readonly componentArn?: string;

    /**
     * A group of parameter settings that Image Builder uses to configure the component for a specific recipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentconfiguration.html#cfn-imagebuilder-containerrecipe-componentconfiguration-parameters
     */
    readonly parameters?: Array<CfnContainerRecipe.ComponentParameterProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Contains a key/value pair that sets the named component parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html
   */
  export interface ComponentParameterProperty {
    /**
     * The name of the component parameter to set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html#cfn-imagebuilder-containerrecipe-componentparameter-name
     */
    readonly name: string;

    /**
     * Sets the value for the named component parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-componentparameter.html#cfn-imagebuilder-containerrecipe-componentparameter-value
     */
    readonly value: Array<string>;
  }

  /**
   * The container repository where the output container image is stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html
   */
  export interface TargetContainerRepositoryProperty {
    /**
     * The name of the container repository where the output container image is stored.
     *
     * This name is prefixed by the repository location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html#cfn-imagebuilder-containerrecipe-targetcontainerrepository-repositoryname
     */
    readonly repositoryName?: string;

    /**
     * Specifies the service in which this image was registered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-containerrecipe-targetcontainerrepository.html#cfn-imagebuilder-containerrecipe-targetcontainerrepository-service
     */
    readonly service?: string;
  }
}

/**
 * Properties for defining a `CfnContainerRecipe`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html
 */
export interface CfnContainerRecipeProps {
  /**
   * Build and test components that are included in the container recipe.
   *
   * Recipes require a minimum of one build component, and can have a maximum of 20 build and test components in any combination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-components
   */
  readonly components: Array<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the type of container, such as Docker.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-containertype
   */
  readonly containerType: string;

  /**
   * The description of the container recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-description
   */
  readonly description?: string;

  /**
   * Dockerfiles are text documents that are used to build Docker containers, and ensure that they contain all of the elements required by the application running inside.
   *
   * The template data consists of contextual variables where Image Builder places build information or scripts, based on your container image recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplatedata
   */
  readonly dockerfileTemplateData?: string;

  /**
   * The S3 URI for the Dockerfile that will be used to build your container image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-dockerfiletemplateuri
   */
  readonly dockerfileTemplateUri?: string;

  /**
   * Specifies the operating system version for the base image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-imageosversionoverride
   */
  readonly imageOsVersionOverride?: string;

  /**
   * A group of options that can be used to configure an instance for building and testing container images.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-instanceconfiguration
   */
  readonly instanceConfiguration?: CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable;

  /**
   * Identifies which KMS key is used to encrypt the container image for distribution to the target Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the container recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-name
   */
  readonly name: string;

  /**
   * The base image for the container recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-parentimage
   */
  readonly parentImage: string;

  /**
   * Specifies the operating system platform when you use a custom base image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-platformoverride
   */
  readonly platformOverride?: string;

  /**
   * Tags that are attached to the container recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The destination repository for the container image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-targetrepository
   */
  readonly targetRepository: cdk.IResolvable | CfnContainerRecipe.TargetContainerRepositoryProperty;

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-version
   */
  readonly version: string;

  /**
   * The working directory for use during build and test workflows.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-containerrecipe.html#cfn-imagebuilder-containerrecipe-workingdirectory
   */
  readonly workingDirectory?: string;
}

/**
 * Determine whether the given properties match those of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteOnTermination", cdk.validateBoolean)(properties.deleteOnTermination));
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("snapshotId", cdk.validateString)(properties.snapshotId));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  errors.collect(cdk.propertyValidator("volumeSize", cdk.validateNumber)(properties.volumeSize));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"EbsInstanceBlockDeviceSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "DeleteOnTermination": cdk.booleanToCloudFormation(properties.deleteOnTermination),
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "SnapshotId": cdk.stringToCloudFormation(properties.snapshotId),
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
    "VolumeSize": cdk.numberToCloudFormation(properties.volumeSize),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty>();
  ret.addPropertyResult("deleteOnTermination", "DeleteOnTermination", (properties.DeleteOnTermination != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteOnTermination) : undefined));
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("snapshotId", "SnapshotId", (properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeSize", "VolumeSize", (properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceBlockDeviceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceBlockDeviceMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerRecipeInstanceBlockDeviceMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceName", cdk.validateString)(properties.deviceName));
  errors.collect(cdk.propertyValidator("ebs", CfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyValidator)(properties.ebs));
  errors.collect(cdk.propertyValidator("noDevice", cdk.validateString)(properties.noDevice));
  errors.collect(cdk.propertyValidator("virtualName", cdk.validateString)(properties.virtualName));
  return errors.wrap("supplied properties not correct for \"InstanceBlockDeviceMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerRecipeInstanceBlockDeviceMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerRecipeInstanceBlockDeviceMappingPropertyValidator(properties).assertSuccess();
  return {
    "DeviceName": cdk.stringToCloudFormation(properties.deviceName),
    "Ebs": convertCfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties.ebs),
    "NoDevice": cdk.stringToCloudFormation(properties.noDevice),
    "VirtualName": cdk.stringToCloudFormation(properties.virtualName)
  };
}

// @ts-ignore TS6133
function CfnContainerRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.InstanceBlockDeviceMappingProperty>();
  ret.addPropertyResult("deviceName", "DeviceName", (properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined));
  ret.addPropertyResult("ebs", "Ebs", (properties.Ebs != null ? CfnContainerRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties.Ebs) : undefined));
  ret.addPropertyResult("noDevice", "NoDevice", (properties.NoDevice != null ? cfn_parse.FromCloudFormation.getString(properties.NoDevice) : undefined));
  ret.addPropertyResult("virtualName", "VirtualName", (properties.VirtualName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerRecipeInstanceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockDeviceMappings", cdk.listValidator(CfnContainerRecipeInstanceBlockDeviceMappingPropertyValidator))(properties.blockDeviceMappings));
  errors.collect(cdk.propertyValidator("image", cdk.validateString)(properties.image));
  return errors.wrap("supplied properties not correct for \"InstanceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerRecipeInstanceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerRecipeInstanceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BlockDeviceMappings": cdk.listMapper(convertCfnContainerRecipeInstanceBlockDeviceMappingPropertyToCloudFormation)(properties.blockDeviceMappings),
    "Image": cdk.stringToCloudFormation(properties.image)
  };
}

// @ts-ignore TS6133
function CfnContainerRecipeInstanceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.InstanceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.InstanceConfigurationProperty>();
  ret.addPropertyResult("blockDeviceMappings", "BlockDeviceMappings", (properties.BlockDeviceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation)(properties.BlockDeviceMappings) : undefined));
  ret.addPropertyResult("image", "Image", (properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerRecipeComponentParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.listValidator(cdk.validateString))(properties.value));
  return errors.wrap("supplied properties not correct for \"ComponentParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerRecipeComponentParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerRecipeComponentParameterPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.listMapper(cdk.stringToCloudFormation)(properties.value)
  };
}

// @ts-ignore TS6133
function CfnContainerRecipeComponentParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.ComponentParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.ComponentParameterProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerRecipeComponentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentArn", cdk.validateString)(properties.componentArn));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnContainerRecipeComponentParameterPropertyValidator))(properties.parameters));
  return errors.wrap("supplied properties not correct for \"ComponentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerRecipeComponentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerRecipeComponentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ComponentArn": cdk.stringToCloudFormation(properties.componentArn),
    "Parameters": cdk.listMapper(convertCfnContainerRecipeComponentParameterPropertyToCloudFormation)(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnContainerRecipeComponentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipe.ComponentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.ComponentConfigurationProperty>();
  ret.addPropertyResult("componentArn", "ComponentArn", (properties.ComponentArn != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentArn) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerRecipeComponentParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetContainerRepositoryProperty`
 *
 * @param properties - the TypeScript properties of a `TargetContainerRepositoryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerRecipeTargetContainerRepositoryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("service", cdk.validateString)(properties.service));
  return errors.wrap("supplied properties not correct for \"TargetContainerRepositoryProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerRecipeTargetContainerRepositoryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerRecipeTargetContainerRepositoryPropertyValidator(properties).assertSuccess();
  return {
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "Service": cdk.stringToCloudFormation(properties.service)
  };
}

// @ts-ignore TS6133
function CfnContainerRecipeTargetContainerRepositoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContainerRecipe.TargetContainerRepositoryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipe.TargetContainerRepositoryProperty>();
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("service", "Service", (properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnContainerRecipeProps`
 *
 * @param properties - the TypeScript properties of a `CfnContainerRecipeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerRecipePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("components", cdk.requiredValidator)(properties.components));
  errors.collect(cdk.propertyValidator("components", cdk.listValidator(CfnContainerRecipeComponentConfigurationPropertyValidator))(properties.components));
  errors.collect(cdk.propertyValidator("containerType", cdk.requiredValidator)(properties.containerType));
  errors.collect(cdk.propertyValidator("containerType", cdk.validateString)(properties.containerType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("dockerfileTemplateData", cdk.validateString)(properties.dockerfileTemplateData));
  errors.collect(cdk.propertyValidator("dockerfileTemplateUri", cdk.validateString)(properties.dockerfileTemplateUri));
  errors.collect(cdk.propertyValidator("imageOsVersionOverride", cdk.validateString)(properties.imageOsVersionOverride));
  errors.collect(cdk.propertyValidator("instanceConfiguration", CfnContainerRecipeInstanceConfigurationPropertyValidator)(properties.instanceConfiguration));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parentImage", cdk.requiredValidator)(properties.parentImage));
  errors.collect(cdk.propertyValidator("parentImage", cdk.validateString)(properties.parentImage));
  errors.collect(cdk.propertyValidator("platformOverride", cdk.validateString)(properties.platformOverride));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("targetRepository", cdk.requiredValidator)(properties.targetRepository));
  errors.collect(cdk.propertyValidator("targetRepository", CfnContainerRecipeTargetContainerRepositoryPropertyValidator)(properties.targetRepository));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  errors.collect(cdk.propertyValidator("workingDirectory", cdk.validateString)(properties.workingDirectory));
  return errors.wrap("supplied properties not correct for \"CfnContainerRecipeProps\"");
}

// @ts-ignore TS6133
function convertCfnContainerRecipePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerRecipePropsValidator(properties).assertSuccess();
  return {
    "Components": cdk.listMapper(convertCfnContainerRecipeComponentConfigurationPropertyToCloudFormation)(properties.components),
    "ContainerType": cdk.stringToCloudFormation(properties.containerType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DockerfileTemplateData": cdk.stringToCloudFormation(properties.dockerfileTemplateData),
    "DockerfileTemplateUri": cdk.stringToCloudFormation(properties.dockerfileTemplateUri),
    "ImageOsVersionOverride": cdk.stringToCloudFormation(properties.imageOsVersionOverride),
    "InstanceConfiguration": convertCfnContainerRecipeInstanceConfigurationPropertyToCloudFormation(properties.instanceConfiguration),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ParentImage": cdk.stringToCloudFormation(properties.parentImage),
    "PlatformOverride": cdk.stringToCloudFormation(properties.platformOverride),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "TargetRepository": convertCfnContainerRecipeTargetContainerRepositoryPropertyToCloudFormation(properties.targetRepository),
    "Version": cdk.stringToCloudFormation(properties.version),
    "WorkingDirectory": cdk.stringToCloudFormation(properties.workingDirectory)
  };
}

// @ts-ignore TS6133
function CfnContainerRecipePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerRecipeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerRecipeProps>();
  ret.addPropertyResult("components", "Components", (properties.Components != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerRecipeComponentConfigurationPropertyFromCloudFormation)(properties.Components) : undefined));
  ret.addPropertyResult("containerType", "ContainerType", (properties.ContainerType != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("dockerfileTemplateData", "DockerfileTemplateData", (properties.DockerfileTemplateData != null ? cfn_parse.FromCloudFormation.getString(properties.DockerfileTemplateData) : undefined));
  ret.addPropertyResult("dockerfileTemplateUri", "DockerfileTemplateUri", (properties.DockerfileTemplateUri != null ? cfn_parse.FromCloudFormation.getString(properties.DockerfileTemplateUri) : undefined));
  ret.addPropertyResult("imageOsVersionOverride", "ImageOsVersionOverride", (properties.ImageOsVersionOverride != null ? cfn_parse.FromCloudFormation.getString(properties.ImageOsVersionOverride) : undefined));
  ret.addPropertyResult("instanceConfiguration", "InstanceConfiguration", (properties.InstanceConfiguration != null ? CfnContainerRecipeInstanceConfigurationPropertyFromCloudFormation(properties.InstanceConfiguration) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parentImage", "ParentImage", (properties.ParentImage != null ? cfn_parse.FromCloudFormation.getString(properties.ParentImage) : undefined));
  ret.addPropertyResult("platformOverride", "PlatformOverride", (properties.PlatformOverride != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformOverride) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("targetRepository", "TargetRepository", (properties.TargetRepository != null ? CfnContainerRecipeTargetContainerRepositoryPropertyFromCloudFormation(properties.TargetRepository) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addPropertyResult("workingDirectory", "WorkingDirectory", (properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A distribution configuration allows you to specify the name and description of your output AMI, authorize other AWS account s to launch the AMI, and replicate the AMI to other AWS Regions .
 *
 * It also allows you to export the AMI to Amazon S3 .
 *
 * @cloudformationResource AWS::ImageBuilder::DistributionConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html
 */
export class CfnDistributionConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::DistributionConfiguration";

  /**
   * Build a CfnDistributionConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDistributionConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDistributionConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDistributionConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of this distribution configuration. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the name of the distribution configuration.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The description of this distribution configuration.
   */
  public description?: string;

  /**
   * The distributions of this distribution configuration formatted as an array of Distribution objects.
   */
  public distributions: Array<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of this distribution configuration.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of this distribution configuration.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDistributionConfigurationProps) {
    super(scope, id, {
      "type": CfnDistributionConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "distributions", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.distributions = props.distributions;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::DistributionConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "distributions": this.distributions,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDistributionConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDistributionConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnDistributionConfiguration {
  /**
   * The distribution configuration distribution defines the settings for a specific Region in the Distribution Configuration.
   *
   * You must specify whether the distribution is for an AMI or a container image. To do so, include exactly one of the following data types for your distribution:
   *
   * - amiDistributionConfiguration
   * - containerDistributionConfiguration
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html
   */
  export interface DistributionProperty {
    /**
     * The specific AMI settings, such as launch permissions and AMI tags.
     *
     * For details, see example schema below.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-amidistributionconfiguration
     */
    readonly amiDistributionConfiguration?: any | cdk.IResolvable;

    /**
     * Container distribution settings for encryption, licensing, and sharing in a specific Region.
     *
     * For details, see example schema below.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-containerdistributionconfiguration
     */
    readonly containerDistributionConfiguration?: any | cdk.IResolvable;

    /**
     * The Windows faster-launching configurations to use for AMI distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-fastlaunchconfigurations
     */
    readonly fastLaunchConfigurations?: Array<CfnDistributionConfiguration.FastLaunchConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A group of launchTemplateConfiguration settings that apply to image distribution for specified accounts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-launchtemplateconfigurations
     */
    readonly launchTemplateConfigurations?: Array<cdk.IResolvable | CfnDistributionConfiguration.LaunchTemplateConfigurationProperty> | cdk.IResolvable;

    /**
     * The License Manager Configuration to associate with the AMI in the specified Region.
     *
     * For more information, see the [LicenseConfiguration API](https://docs.aws.amazon.com/license-manager/latest/APIReference/API_LicenseConfiguration.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-licenseconfigurationarns
     */
    readonly licenseConfigurationArns?: Array<string>;

    /**
     * The target Region for the Distribution Configuration.
     *
     * For example, `eu-west-1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-distribution.html#cfn-imagebuilder-distributionconfiguration-distribution-region
     */
    readonly region: string;
  }

  /**
   * Define and configure faster launching for output Windows AMIs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html
   */
  export interface FastLaunchConfigurationProperty {
    /**
     * The owner account ID for the fast-launch enabled Windows AMI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-accountid
     */
    readonly accountId?: string;

    /**
     * A Boolean that represents the current state of faster launching for the Windows AMI.
     *
     * Set to `true` to start using Windows faster launching, or `false` to stop using it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The launch template that the fast-launch enabled Windows AMI uses when it launches Windows instances to create pre-provisioned snapshots.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-launchtemplate
     */
    readonly launchTemplate?: CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty | cdk.IResolvable;

    /**
     * The maximum number of parallel instances that are launched for creating resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-maxparallellaunches
     */
    readonly maxParallelLaunches?: number;

    /**
     * Configuration settings for managing the number of snapshots that are created from pre-provisioned instances for the Windows AMI when faster launching is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchconfiguration-snapshotconfiguration
     */
    readonly snapshotConfiguration?: CfnDistributionConfiguration.FastLaunchSnapshotConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Identifies the launch template that the associated Windows AMI uses for launching an instance when faster launching is enabled.
   *
   * > You can specify either the `launchTemplateName` or the `launchTemplateId` , but not both.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html
   */
  export interface FastLaunchLaunchTemplateSpecificationProperty {
    /**
     * The ID of the launch template to use for faster launching for a Windows AMI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplateid
     */
    readonly launchTemplateId?: string;

    /**
     * The name of the launch template to use for faster launching for a Windows AMI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplatename
     */
    readonly launchTemplateName?: string;

    /**
     * The version of the launch template to use for faster launching for a Windows AMI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification.html#cfn-imagebuilder-distributionconfiguration-fastlaunchlaunchtemplatespecification-launchtemplateversion
     */
    readonly launchTemplateVersion?: string;
  }

  /**
   * Configuration settings for creating and managing pre-provisioned snapshots for a fast-launch enabled Windows AMI.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration.html
   */
  export interface FastLaunchSnapshotConfigurationProperty {
    /**
     * The number of pre-provisioned snapshots to keep on hand for a fast-launch enabled Windows AMI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration.html#cfn-imagebuilder-distributionconfiguration-fastlaunchsnapshotconfiguration-targetresourcecount
     */
    readonly targetResourceCount?: number;
  }

  /**
   * Identifies an Amazon EC2 launch template to use for a specific account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html
   */
  export interface LaunchTemplateConfigurationProperty {
    /**
     * The account ID that this configuration applies to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-accountid
     */
    readonly accountId?: string;

    /**
     * Identifies the Amazon EC2 launch template to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-launchtemplateid
     */
    readonly launchTemplateId?: string;

    /**
     * Set the specified Amazon EC2 launch template as the default launch template for the specified account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchtemplateconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchtemplateconfiguration-setdefaultversion
     */
    readonly setDefaultVersion?: boolean | cdk.IResolvable;
  }

  /**
   * Define and configure the output AMIs of the pipeline.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html
   */
  export interface AmiDistributionConfigurationProperty {
    /**
     * The tags to apply to AMIs distributed to this Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-amitags
     */
    readonly amiTags?: cdk.IResolvable | Record<string, string>;

    /**
     * The description of the AMI distribution configuration.
     *
     * Minimum and maximum length are in characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-description
     */
    readonly description?: string;

    /**
     * The KMS key identifier used to encrypt the distributed image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Launch permissions can be used to configure which AWS account s can use the AMI to launch instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-launchpermissionconfiguration
     */
    readonly launchPermissionConfiguration?: cdk.IResolvable | CfnDistributionConfiguration.LaunchPermissionConfigurationProperty;

    /**
     * The name of the output AMI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-name
     */
    readonly name?: string;

    /**
     * The ID of an account to which you want to distribute an image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-amidistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-amidistributionconfiguration-targetaccountids
     */
    readonly targetAccountIds?: Array<string>;
  }

  /**
   * Describes the configuration for a launch permission.
   *
   * The launch permission modification request is sent to the [Amazon EC2 ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) API on behalf of the user for each Region they have selected to distribute the AMI. To make an AMI public, set the launch permission authorized accounts to `all` . See the examples for making an AMI public at [Amazon EC2 ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html
   */
  export interface LaunchPermissionConfigurationProperty {
    /**
     * The ARN for an AWS Organizations organizational unit (OU) that you want to share your AMI with.
     *
     * For more information about key concepts for AWS Organizations , see [AWS Organizations terminology and concepts](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-organizationalunitarns
     */
    readonly organizationalUnitArns?: Array<string>;

    /**
     * The ARN for an AWS Organization that you want to share your AMI with.
     *
     * For more information, see [What is AWS Organizations ?](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-organizationarns
     */
    readonly organizationArns?: Array<string>;

    /**
     * The name of the group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-usergroups
     */
    readonly userGroups?: Array<string>;

    /**
     * The AWS account ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-launchpermissionconfiguration.html#cfn-imagebuilder-distributionconfiguration-launchpermissionconfiguration-userids
     */
    readonly userIds?: Array<string>;
  }

  /**
   * Container distribution settings for encryption, licensing, and sharing in a specific Region.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html
   */
  export interface ContainerDistributionConfigurationProperty {
    /**
     * Tags that are attached to the container distribution configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-containertags
     */
    readonly containerTags?: Array<string>;

    /**
     * The description of the container distribution configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-description
     */
    readonly description?: string;

    /**
     * The destination repository for the container distribution configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-containerdistributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-containerdistributionconfiguration-targetrepository
     */
    readonly targetRepository?: cdk.IResolvable | CfnDistributionConfiguration.TargetContainerRepositoryProperty;
  }

  /**
   * The container repository where the output container image is stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html
   */
  export interface TargetContainerRepositoryProperty {
    /**
     * The name of the container repository where the output container image is stored.
     *
     * This name is prefixed by the repository location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html#cfn-imagebuilder-distributionconfiguration-targetcontainerrepository-repositoryname
     */
    readonly repositoryName?: string;

    /**
     * Specifies the service in which this image was registered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-targetcontainerrepository.html#cfn-imagebuilder-distributionconfiguration-targetcontainerrepository-service
     */
    readonly service?: string;
  }
}

/**
 * Properties for defining a `CfnDistributionConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html
 */
export interface CfnDistributionConfigurationProps {
  /**
   * The description of this distribution configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-description
   */
  readonly description?: string;

  /**
   * The distributions of this distribution configuration formatted as an array of Distribution objects.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-distributions
   */
  readonly distributions: Array<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of this distribution configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-name
   */
  readonly name: string;

  /**
   * The tags of this distribution configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-distributionconfiguration.html#cfn-imagebuilder-distributionconfiguration-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `FastLaunchLaunchTemplateSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FastLaunchLaunchTemplateSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("launchTemplateId", cdk.validateString)(properties.launchTemplateId));
  errors.collect(cdk.propertyValidator("launchTemplateName", cdk.validateString)(properties.launchTemplateName));
  errors.collect(cdk.propertyValidator("launchTemplateVersion", cdk.validateString)(properties.launchTemplateVersion));
  return errors.wrap("supplied properties not correct for \"FastLaunchLaunchTemplateSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "LaunchTemplateId": cdk.stringToCloudFormation(properties.launchTemplateId),
    "LaunchTemplateName": cdk.stringToCloudFormation(properties.launchTemplateName),
    "LaunchTemplateVersion": cdk.stringToCloudFormation(properties.launchTemplateVersion)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.FastLaunchLaunchTemplateSpecificationProperty>();
  ret.addPropertyResult("launchTemplateId", "LaunchTemplateId", (properties.LaunchTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateId) : undefined));
  ret.addPropertyResult("launchTemplateName", "LaunchTemplateName", (properties.LaunchTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateName) : undefined));
  ret.addPropertyResult("launchTemplateVersion", "LaunchTemplateVersion", (properties.LaunchTemplateVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FastLaunchSnapshotConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FastLaunchSnapshotConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetResourceCount", cdk.validateNumber)(properties.targetResourceCount));
  return errors.wrap("supplied properties not correct for \"FastLaunchSnapshotConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "TargetResourceCount": cdk.numberToCloudFormation(properties.targetResourceCount)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.FastLaunchSnapshotConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.FastLaunchSnapshotConfigurationProperty>();
  ret.addPropertyResult("targetResourceCount", "TargetResourceCount", (properties.TargetResourceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetResourceCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FastLaunchConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FastLaunchConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("launchTemplate", CfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyValidator)(properties.launchTemplate));
  errors.collect(cdk.propertyValidator("maxParallelLaunches", cdk.validateNumber)(properties.maxParallelLaunches));
  errors.collect(cdk.propertyValidator("snapshotConfiguration", CfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyValidator)(properties.snapshotConfiguration));
  return errors.wrap("supplied properties not correct for \"FastLaunchConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationFastLaunchConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationFastLaunchConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "LaunchTemplate": convertCfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplate),
    "MaxParallelLaunches": cdk.numberToCloudFormation(properties.maxParallelLaunches),
    "SnapshotConfiguration": convertCfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyToCloudFormation(properties.snapshotConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationFastLaunchConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.FastLaunchConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.FastLaunchConfigurationProperty>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("launchTemplate", "LaunchTemplate", (properties.LaunchTemplate != null ? CfnDistributionConfigurationFastLaunchLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplate) : undefined));
  ret.addPropertyResult("maxParallelLaunches", "MaxParallelLaunches", (properties.MaxParallelLaunches != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxParallelLaunches) : undefined));
  ret.addPropertyResult("snapshotConfiguration", "SnapshotConfiguration", (properties.SnapshotConfiguration != null ? CfnDistributionConfigurationFastLaunchSnapshotConfigurationPropertyFromCloudFormation(properties.SnapshotConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationLaunchTemplateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("launchTemplateId", cdk.validateString)(properties.launchTemplateId));
  errors.collect(cdk.propertyValidator("setDefaultVersion", cdk.validateBoolean)(properties.setDefaultVersion));
  return errors.wrap("supplied properties not correct for \"LaunchTemplateConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationLaunchTemplateConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationLaunchTemplateConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "LaunchTemplateId": cdk.stringToCloudFormation(properties.launchTemplateId),
    "SetDefaultVersion": cdk.booleanToCloudFormation(properties.setDefaultVersion)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationLaunchTemplateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistributionConfiguration.LaunchTemplateConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.LaunchTemplateConfigurationProperty>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("launchTemplateId", "LaunchTemplateId", (properties.LaunchTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateId) : undefined));
  ret.addPropertyResult("setDefaultVersion", "SetDefaultVersion", (properties.SetDefaultVersion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SetDefaultVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DistributionProperty`
 *
 * @param properties - the TypeScript properties of a `DistributionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationDistributionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amiDistributionConfiguration", cdk.validateObject)(properties.amiDistributionConfiguration));
  errors.collect(cdk.propertyValidator("containerDistributionConfiguration", cdk.validateObject)(properties.containerDistributionConfiguration));
  errors.collect(cdk.propertyValidator("fastLaunchConfigurations", cdk.listValidator(CfnDistributionConfigurationFastLaunchConfigurationPropertyValidator))(properties.fastLaunchConfigurations));
  errors.collect(cdk.propertyValidator("launchTemplateConfigurations", cdk.listValidator(CfnDistributionConfigurationLaunchTemplateConfigurationPropertyValidator))(properties.launchTemplateConfigurations));
  errors.collect(cdk.propertyValidator("licenseConfigurationArns", cdk.listValidator(cdk.validateString))(properties.licenseConfigurationArns));
  errors.collect(cdk.propertyValidator("region", cdk.requiredValidator)(properties.region));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  return errors.wrap("supplied properties not correct for \"DistributionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationDistributionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationDistributionPropertyValidator(properties).assertSuccess();
  return {
    "AmiDistributionConfiguration": cdk.objectToCloudFormation(properties.amiDistributionConfiguration),
    "ContainerDistributionConfiguration": cdk.objectToCloudFormation(properties.containerDistributionConfiguration),
    "FastLaunchConfigurations": cdk.listMapper(convertCfnDistributionConfigurationFastLaunchConfigurationPropertyToCloudFormation)(properties.fastLaunchConfigurations),
    "LaunchTemplateConfigurations": cdk.listMapper(convertCfnDistributionConfigurationLaunchTemplateConfigurationPropertyToCloudFormation)(properties.launchTemplateConfigurations),
    "LicenseConfigurationArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.licenseConfigurationArns),
    "Region": cdk.stringToCloudFormation(properties.region)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationDistributionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.DistributionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.DistributionProperty>();
  ret.addPropertyResult("amiDistributionConfiguration", "AmiDistributionConfiguration", (properties.AmiDistributionConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.AmiDistributionConfiguration) : undefined));
  ret.addPropertyResult("containerDistributionConfiguration", "ContainerDistributionConfiguration", (properties.ContainerDistributionConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.ContainerDistributionConfiguration) : undefined));
  ret.addPropertyResult("fastLaunchConfigurations", "FastLaunchConfigurations", (properties.FastLaunchConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionConfigurationFastLaunchConfigurationPropertyFromCloudFormation)(properties.FastLaunchConfigurations) : undefined));
  ret.addPropertyResult("launchTemplateConfigurations", "LaunchTemplateConfigurations", (properties.LaunchTemplateConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionConfigurationLaunchTemplateConfigurationPropertyFromCloudFormation)(properties.LaunchTemplateConfigurations) : undefined));
  ret.addPropertyResult("licenseConfigurationArns", "LicenseConfigurationArns", (properties.LicenseConfigurationArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LicenseConfigurationArns) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDistributionConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDistributionConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("distributions", cdk.requiredValidator)(properties.distributions));
  errors.collect(cdk.propertyValidator("distributions", cdk.listValidator(CfnDistributionConfigurationDistributionPropertyValidator))(properties.distributions));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDistributionConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Distributions": cdk.listMapper(convertCfnDistributionConfigurationDistributionPropertyToCloudFormation)(properties.distributions),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfigurationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("distributions", "Distributions", (properties.Distributions != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionConfigurationDistributionPropertyFromCloudFormation)(properties.Distributions) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchPermissionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchPermissionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationLaunchPermissionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("organizationArns", cdk.listValidator(cdk.validateString))(properties.organizationArns));
  errors.collect(cdk.propertyValidator("organizationalUnitArns", cdk.listValidator(cdk.validateString))(properties.organizationalUnitArns));
  errors.collect(cdk.propertyValidator("userGroups", cdk.listValidator(cdk.validateString))(properties.userGroups));
  errors.collect(cdk.propertyValidator("userIds", cdk.listValidator(cdk.validateString))(properties.userIds));
  return errors.wrap("supplied properties not correct for \"LaunchPermissionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationLaunchPermissionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationLaunchPermissionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "OrganizationArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationArns),
    "OrganizationalUnitArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnitArns),
    "UserGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.userGroups),
    "UserIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.userIds)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationLaunchPermissionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistributionConfiguration.LaunchPermissionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.LaunchPermissionConfigurationProperty>();
  ret.addPropertyResult("organizationalUnitArns", "OrganizationalUnitArns", (properties.OrganizationalUnitArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationalUnitArns) : undefined));
  ret.addPropertyResult("organizationArns", "OrganizationArns", (properties.OrganizationArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationArns) : undefined));
  ret.addPropertyResult("userGroups", "UserGroups", (properties.UserGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UserGroups) : undefined));
  ret.addPropertyResult("userIds", "UserIds", (properties.UserIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UserIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmiDistributionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AmiDistributionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationAmiDistributionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amiTags", cdk.hashValidator(cdk.validateString))(properties.amiTags));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("launchPermissionConfiguration", CfnDistributionConfigurationLaunchPermissionConfigurationPropertyValidator)(properties.launchPermissionConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("targetAccountIds", cdk.listValidator(cdk.validateString))(properties.targetAccountIds));
  return errors.wrap("supplied properties not correct for \"AmiDistributionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationAmiDistributionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationAmiDistributionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AmiTags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.amiTags),
    "Description": cdk.stringToCloudFormation(properties.description),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LaunchPermissionConfiguration": convertCfnDistributionConfigurationLaunchPermissionConfigurationPropertyToCloudFormation(properties.launchPermissionConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TargetAccountIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetAccountIds)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationAmiDistributionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.AmiDistributionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.AmiDistributionConfigurationProperty>();
  ret.addPropertyResult("amiTags", "AmiTags", (properties.AmiTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AmiTags) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("launchPermissionConfiguration", "LaunchPermissionConfiguration", (properties.LaunchPermissionConfiguration != null ? CfnDistributionConfigurationLaunchPermissionConfigurationPropertyFromCloudFormation(properties.LaunchPermissionConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("targetAccountIds", "TargetAccountIds", (properties.TargetAccountIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetAccountIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetContainerRepositoryProperty`
 *
 * @param properties - the TypeScript properties of a `TargetContainerRepositoryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationTargetContainerRepositoryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("service", cdk.validateString)(properties.service));
  return errors.wrap("supplied properties not correct for \"TargetContainerRepositoryProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationTargetContainerRepositoryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationTargetContainerRepositoryPropertyValidator(properties).assertSuccess();
  return {
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "Service": cdk.stringToCloudFormation(properties.service)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationTargetContainerRepositoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistributionConfiguration.TargetContainerRepositoryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.TargetContainerRepositoryProperty>();
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("service", "Service", (properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContainerDistributionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerDistributionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionConfigurationContainerDistributionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerTags", cdk.listValidator(cdk.validateString))(properties.containerTags));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("targetRepository", CfnDistributionConfigurationTargetContainerRepositoryPropertyValidator)(properties.targetRepository));
  return errors.wrap("supplied properties not correct for \"ContainerDistributionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionConfigurationContainerDistributionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionConfigurationContainerDistributionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ContainerTags": cdk.listMapper(cdk.stringToCloudFormation)(properties.containerTags),
    "Description": cdk.stringToCloudFormation(properties.description),
    "TargetRepository": convertCfnDistributionConfigurationTargetContainerRepositoryPropertyToCloudFormation(properties.targetRepository)
  };
}

// @ts-ignore TS6133
function CfnDistributionConfigurationContainerDistributionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionConfiguration.ContainerDistributionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionConfiguration.ContainerDistributionConfigurationProperty>();
  ret.addPropertyResult("containerTags", "ContainerTags", (properties.ContainerTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ContainerTags) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("targetRepository", "TargetRepository", (properties.TargetRepository != null ? CfnDistributionConfigurationTargetContainerRepositoryPropertyFromCloudFormation(properties.TargetRepository) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * An image build version.
 *
 * An image is a customized, secure, and up-to-date “golden” server image that is pre-installed and pre-configured with software and settings to meet specific IT standards.
 *
 * @cloudformationResource AWS::ImageBuilder::Image
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html
 */
export class CfnImage extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::Image";

  /**
   * Build a CfnImage from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImage {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnImagePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnImage(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the image. For example, `arn:aws:imagebuilder:us-west-2:123456789012:image/mybasicrecipe/2019.12.03/1` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the AMI ID of the Amazon EC2 AMI in the Region in which you are using Image Builder. Values are returned only for AMIs, and not for container images.
   *
   * @cloudformationAttribute ImageId
   */
  public readonly attrImageId: string;

  /**
   * Returns a list of URIs for container images created in the context Region. Values are returned only for container images, and not for AMIs.
   *
   * @cloudformationAttribute ImageUri
   */
  public readonly attrImageUri: string;

  /**
   * Returns the name of the image.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
   */
  public containerRecipeArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the distribution configuration.
   */
  public distributionConfigurationArn?: string;

  /**
   * Indicates whether Image Builder collects additional information about the image, such as the operating system (OS) version and package list.
   */
  public enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;

  /**
   * The name or Amazon Resource Name (ARN) for the IAM role you create that grants Image Builder access to perform workflow actions.
   */
  public executionRole?: string;

  /**
   * The Amazon Resource Name (ARN) of the image recipe.
   */
  public imageRecipeArn?: string;

  /**
   * Contains settings for vulnerability scans.
   */
  public imageScanningConfiguration?: CfnImage.ImageScanningConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration settings for your image test components, which includes a toggle that allows you to turn off tests, and a timeout setting.
   */
  public imageTestsConfiguration?: CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
   */
  public infrastructureConfigurationArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of the image.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * Contains the build and test workflows that are associated with the image.
   */
  public workflows?: Array<cdk.IResolvable | CfnImage.WorkflowConfigurationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnImageProps) {
    super(scope, id, {
      "type": CfnImage.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "infrastructureConfigurationArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrImageId = cdk.Token.asString(this.getAtt("ImageId", cdk.ResolutionTypeHint.STRING));
    this.attrImageUri = cdk.Token.asString(this.getAtt("ImageUri", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.containerRecipeArn = props.containerRecipeArn;
    this.distributionConfigurationArn = props.distributionConfigurationArn;
    this.enhancedImageMetadataEnabled = props.enhancedImageMetadataEnabled;
    this.executionRole = props.executionRole;
    this.imageRecipeArn = props.imageRecipeArn;
    this.imageScanningConfiguration = props.imageScanningConfiguration;
    this.imageTestsConfiguration = props.imageTestsConfiguration;
    this.infrastructureConfigurationArn = props.infrastructureConfigurationArn;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::Image", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workflows = props.workflows;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "containerRecipeArn": this.containerRecipeArn,
      "distributionConfigurationArn": this.distributionConfigurationArn,
      "enhancedImageMetadataEnabled": this.enhancedImageMetadataEnabled,
      "executionRole": this.executionRole,
      "imageRecipeArn": this.imageRecipeArn,
      "imageScanningConfiguration": this.imageScanningConfiguration,
      "imageTestsConfiguration": this.imageTestsConfiguration,
      "infrastructureConfigurationArn": this.infrastructureConfigurationArn,
      "tags": this.tags.renderTags(),
      "workflows": this.workflows
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnImage.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnImagePropsToCloudFormation(props);
  }
}

export namespace CfnImage {
  /**
   * Contains settings for Image Builder image resource and container image scans.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagescanningconfiguration.html
   */
  export interface ImageScanningConfigurationProperty {
    /**
     * Contains Amazon ECR settings for vulnerability scans.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagescanningconfiguration.html#cfn-imagebuilder-image-imagescanningconfiguration-ecrconfiguration
     */
    readonly ecrConfiguration?: CfnImage.EcrConfigurationProperty | cdk.IResolvable;

    /**
     * A setting that indicates whether Image Builder keeps a snapshot of the vulnerability scans that Amazon Inspector runs against the build instance when you create a new image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagescanningconfiguration.html#cfn-imagebuilder-image-imagescanningconfiguration-imagescanningenabled
     */
    readonly imageScanningEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Settings that Image Builder uses to configure the ECR repository and the output container images that Amazon Inspector scans.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-ecrconfiguration.html
   */
  export interface EcrConfigurationProperty {
    /**
     * Tags for Image Builder to apply to the output container image that &INS;
     *
     * scans. Tags can help you identify and manage your scanned images.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-ecrconfiguration.html#cfn-imagebuilder-image-ecrconfiguration-containertags
     */
    readonly containerTags?: Array<string>;

    /**
     * The name of the container repository that Amazon Inspector scans to identify findings for your container images.
     *
     * The name includes the path for the repository location. If you don’t provide this information, Image Builder creates a repository in your account named `image-builder-image-scanning-repository` for vulnerability scans of your output container images.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-ecrconfiguration.html#cfn-imagebuilder-image-ecrconfiguration-repositoryname
     */
    readonly repositoryName?: string;
  }

  /**
   * When you create an image or container recipe with Image Builder , you can add the build or test components that are used to create the final image.
   *
   * You must have at least one build component to create a recipe, but test components are not required. If you have added tests, they run after the image is created, to ensure that the target image is functional and can be used reliably for launching Amazon EC2 instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html
   */
  export interface ImageTestsConfigurationProperty {
    /**
     * Determines if tests should run after building the image.
     *
     * Image Builder defaults to enable tests to run following the image build, before image distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html#cfn-imagebuilder-image-imagetestsconfiguration-imagetestsenabled
     */
    readonly imageTestsEnabled?: boolean | cdk.IResolvable;

    /**
     * The maximum time in minutes that tests are permitted to run.
     *
     * > The timeoutMinutes attribute is not currently active. This value is ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-imagetestsconfiguration.html#cfn-imagebuilder-image-imagetestsconfiguration-timeoutminutes
     */
    readonly timeoutMinutes?: number;
  }

  /**
   * Contains control settings and configurable inputs for a workflow resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowconfiguration.html
   */
  export interface WorkflowConfigurationProperty {
    /**
     * The action to take if the workflow fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowconfiguration.html#cfn-imagebuilder-image-workflowconfiguration-onfailure
     */
    readonly onFailure?: string;

    /**
     * Test workflows are defined within named runtime groups called parallel groups.
     *
     * The parallel group is the named group that contains this test workflow. Test workflows within a parallel group can run at the same time. Image Builder starts up to five test workflows in the group at the same time, and starts additional workflows as others complete, until all workflows in the group have completed. This field only applies for test workflows.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowconfiguration.html#cfn-imagebuilder-image-workflowconfiguration-parallelgroup
     */
    readonly parallelGroup?: string;

    /**
     * Contains parameter values for each of the parameters that the workflow document defined for the workflow resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowconfiguration.html#cfn-imagebuilder-image-workflowconfiguration-parameters
     */
    readonly parameters?: Array<cdk.IResolvable | CfnImage.WorkflowParameterProperty> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the workflow resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowconfiguration.html#cfn-imagebuilder-image-workflowconfiguration-workflowarn
     */
    readonly workflowArn?: string;
  }

  /**
   * Contains a key/value pair that sets the named workflow parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowparameter.html
   */
  export interface WorkflowParameterProperty {
    /**
     * The name of the workflow parameter to set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowparameter.html#cfn-imagebuilder-image-workflowparameter-name
     */
    readonly name?: string;

    /**
     * Sets the value for the named workflow parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-image-workflowparameter.html#cfn-imagebuilder-image-workflowparameter-value
     */
    readonly value?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnImage`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html
 */
export interface CfnImageProps {
  /**
   * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-containerrecipearn
   */
  readonly containerRecipeArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the distribution configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-distributionconfigurationarn
   */
  readonly distributionConfigurationArn?: string;

  /**
   * Indicates whether Image Builder collects additional information about the image, such as the operating system (OS) version and package list.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-enhancedimagemetadataenabled
   */
  readonly enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;

  /**
   * The name or Amazon Resource Name (ARN) for the IAM role you create that grants Image Builder access to perform workflow actions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-executionrole
   */
  readonly executionRole?: string;

  /**
   * The Amazon Resource Name (ARN) of the image recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagerecipearn
   */
  readonly imageRecipeArn?: string;

  /**
   * Contains settings for vulnerability scans.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagescanningconfiguration
   */
  readonly imageScanningConfiguration?: CfnImage.ImageScanningConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration settings for your image test components, which includes a toggle that allows you to turn off tests, and a timeout setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-imagetestsconfiguration
   */
  readonly imageTestsConfiguration?: CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-infrastructureconfigurationarn
   */
  readonly infrastructureConfigurationArn: string;

  /**
   * The tags of the image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * Contains the build and test workflows that are associated with the image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-image.html#cfn-imagebuilder-image-workflows
   */
  readonly workflows?: Array<cdk.IResolvable | CfnImage.WorkflowConfigurationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `EcrConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EcrConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageEcrConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerTags", cdk.listValidator(cdk.validateString))(properties.containerTags));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  return errors.wrap("supplied properties not correct for \"EcrConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageEcrConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageEcrConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ContainerTags": cdk.listMapper(cdk.stringToCloudFormation)(properties.containerTags),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName)
  };
}

// @ts-ignore TS6133
function CfnImageEcrConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImage.EcrConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImage.EcrConfigurationProperty>();
  ret.addPropertyResult("containerTags", "ContainerTags", (properties.ContainerTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ContainerTags) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageScanningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageScanningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageImageScanningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ecrConfiguration", CfnImageEcrConfigurationPropertyValidator)(properties.ecrConfiguration));
  errors.collect(cdk.propertyValidator("imageScanningEnabled", cdk.validateBoolean)(properties.imageScanningEnabled));
  return errors.wrap("supplied properties not correct for \"ImageScanningConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageImageScanningConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageImageScanningConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EcrConfiguration": convertCfnImageEcrConfigurationPropertyToCloudFormation(properties.ecrConfiguration),
    "ImageScanningEnabled": cdk.booleanToCloudFormation(properties.imageScanningEnabled)
  };
}

// @ts-ignore TS6133
function CfnImageImageScanningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImage.ImageScanningConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImage.ImageScanningConfigurationProperty>();
  ret.addPropertyResult("ecrConfiguration", "EcrConfiguration", (properties.EcrConfiguration != null ? CfnImageEcrConfigurationPropertyFromCloudFormation(properties.EcrConfiguration) : undefined));
  ret.addPropertyResult("imageScanningEnabled", "ImageScanningEnabled", (properties.ImageScanningEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ImageScanningEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageTestsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageTestsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageImageTestsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("imageTestsEnabled", cdk.validateBoolean)(properties.imageTestsEnabled));
  errors.collect(cdk.propertyValidator("timeoutMinutes", cdk.validateNumber)(properties.timeoutMinutes));
  return errors.wrap("supplied properties not correct for \"ImageTestsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageImageTestsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageImageTestsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ImageTestsEnabled": cdk.booleanToCloudFormation(properties.imageTestsEnabled),
    "TimeoutMinutes": cdk.numberToCloudFormation(properties.timeoutMinutes)
  };
}

// @ts-ignore TS6133
function CfnImageImageTestsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImage.ImageTestsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImage.ImageTestsConfigurationProperty>();
  ret.addPropertyResult("imageTestsEnabled", "ImageTestsEnabled", (properties.ImageTestsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ImageTestsEnabled) : undefined));
  ret.addPropertyResult("timeoutMinutes", "TimeoutMinutes", (properties.TimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowParameterProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageWorkflowParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.listValidator(cdk.validateString))(properties.value));
  return errors.wrap("supplied properties not correct for \"WorkflowParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageWorkflowParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageWorkflowParameterPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.listMapper(cdk.stringToCloudFormation)(properties.value)
  };
}

// @ts-ignore TS6133
function CfnImageWorkflowParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnImage.WorkflowParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImage.WorkflowParameterProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageWorkflowConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onFailure", cdk.validateString)(properties.onFailure));
  errors.collect(cdk.propertyValidator("parallelGroup", cdk.validateString)(properties.parallelGroup));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnImageWorkflowParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("workflowArn", cdk.validateString)(properties.workflowArn));
  return errors.wrap("supplied properties not correct for \"WorkflowConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageWorkflowConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageWorkflowConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "OnFailure": cdk.stringToCloudFormation(properties.onFailure),
    "ParallelGroup": cdk.stringToCloudFormation(properties.parallelGroup),
    "Parameters": cdk.listMapper(convertCfnImageWorkflowParameterPropertyToCloudFormation)(properties.parameters),
    "WorkflowArn": cdk.stringToCloudFormation(properties.workflowArn)
  };
}

// @ts-ignore TS6133
function CfnImageWorkflowConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnImage.WorkflowConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImage.WorkflowConfigurationProperty>();
  ret.addPropertyResult("onFailure", "OnFailure", (properties.OnFailure != null ? cfn_parse.FromCloudFormation.getString(properties.OnFailure) : undefined));
  ret.addPropertyResult("parallelGroup", "ParallelGroup", (properties.ParallelGroup != null ? cfn_parse.FromCloudFormation.getString(properties.ParallelGroup) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnImageWorkflowParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("workflowArn", "WorkflowArn", (properties.WorkflowArn != null ? cfn_parse.FromCloudFormation.getString(properties.WorkflowArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnImageProps`
 *
 * @param properties - the TypeScript properties of a `CfnImageProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerRecipeArn", cdk.validateString)(properties.containerRecipeArn));
  errors.collect(cdk.propertyValidator("distributionConfigurationArn", cdk.validateString)(properties.distributionConfigurationArn));
  errors.collect(cdk.propertyValidator("enhancedImageMetadataEnabled", cdk.validateBoolean)(properties.enhancedImageMetadataEnabled));
  errors.collect(cdk.propertyValidator("executionRole", cdk.validateString)(properties.executionRole));
  errors.collect(cdk.propertyValidator("imageRecipeArn", cdk.validateString)(properties.imageRecipeArn));
  errors.collect(cdk.propertyValidator("imageScanningConfiguration", CfnImageImageScanningConfigurationPropertyValidator)(properties.imageScanningConfiguration));
  errors.collect(cdk.propertyValidator("imageTestsConfiguration", CfnImageImageTestsConfigurationPropertyValidator)(properties.imageTestsConfiguration));
  errors.collect(cdk.propertyValidator("infrastructureConfigurationArn", cdk.requiredValidator)(properties.infrastructureConfigurationArn));
  errors.collect(cdk.propertyValidator("infrastructureConfigurationArn", cdk.validateString)(properties.infrastructureConfigurationArn));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("workflows", cdk.listValidator(CfnImageWorkflowConfigurationPropertyValidator))(properties.workflows));
  return errors.wrap("supplied properties not correct for \"CfnImageProps\"");
}

// @ts-ignore TS6133
function convertCfnImagePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePropsValidator(properties).assertSuccess();
  return {
    "ContainerRecipeArn": cdk.stringToCloudFormation(properties.containerRecipeArn),
    "DistributionConfigurationArn": cdk.stringToCloudFormation(properties.distributionConfigurationArn),
    "EnhancedImageMetadataEnabled": cdk.booleanToCloudFormation(properties.enhancedImageMetadataEnabled),
    "ExecutionRole": cdk.stringToCloudFormation(properties.executionRole),
    "ImageRecipeArn": cdk.stringToCloudFormation(properties.imageRecipeArn),
    "ImageScanningConfiguration": convertCfnImageImageScanningConfigurationPropertyToCloudFormation(properties.imageScanningConfiguration),
    "ImageTestsConfiguration": convertCfnImageImageTestsConfigurationPropertyToCloudFormation(properties.imageTestsConfiguration),
    "InfrastructureConfigurationArn": cdk.stringToCloudFormation(properties.infrastructureConfigurationArn),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Workflows": cdk.listMapper(convertCfnImageWorkflowConfigurationPropertyToCloudFormation)(properties.workflows)
  };
}

// @ts-ignore TS6133
function CfnImagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageProps>();
  ret.addPropertyResult("containerRecipeArn", "ContainerRecipeArn", (properties.ContainerRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerRecipeArn) : undefined));
  ret.addPropertyResult("distributionConfigurationArn", "DistributionConfigurationArn", (properties.DistributionConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DistributionConfigurationArn) : undefined));
  ret.addPropertyResult("enhancedImageMetadataEnabled", "EnhancedImageMetadataEnabled", (properties.EnhancedImageMetadataEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnhancedImageMetadataEnabled) : undefined));
  ret.addPropertyResult("executionRole", "ExecutionRole", (properties.ExecutionRole != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRole) : undefined));
  ret.addPropertyResult("imageRecipeArn", "ImageRecipeArn", (properties.ImageRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ImageRecipeArn) : undefined));
  ret.addPropertyResult("imageScanningConfiguration", "ImageScanningConfiguration", (properties.ImageScanningConfiguration != null ? CfnImageImageScanningConfigurationPropertyFromCloudFormation(properties.ImageScanningConfiguration) : undefined));
  ret.addPropertyResult("imageTestsConfiguration", "ImageTestsConfiguration", (properties.ImageTestsConfiguration != null ? CfnImageImageTestsConfigurationPropertyFromCloudFormation(properties.ImageTestsConfiguration) : undefined));
  ret.addPropertyResult("infrastructureConfigurationArn", "InfrastructureConfigurationArn", (properties.InfrastructureConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.InfrastructureConfigurationArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("workflows", "Workflows", (properties.Workflows != null ? cfn_parse.FromCloudFormation.getArray(CfnImageWorkflowConfigurationPropertyFromCloudFormation)(properties.Workflows) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * An image pipeline is the automation configuration for building secure OS images on AWS .
 *
 * The Image Builder image pipeline is associated with an image recipe that defines the build, validation, and test phases for an image build lifecycle. An image pipeline can be associated with an infrastructure configuration that defines where your image is built. You can define attributes, such as instance types, a subnet for your VPC, security groups, logging, and other infrastructure-related configurations. You can also associate your image pipeline with a distribution configuration to define how you would like to deploy your image.
 *
 * @cloudformationResource AWS::ImageBuilder::ImagePipeline
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html
 */
export class CfnImagePipeline extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::ImagePipeline";

  /**
   * Build a CfnImagePipeline from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImagePipeline {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnImagePipelinePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnImagePipeline(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the image pipeline. For example, `arn:aws:imagebuilder:us-west-2:123456789012:image-pipeline/mywindows2016pipeline` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the name of the image pipeline.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
   */
  public containerRecipeArn?: string;

  /**
   * The description of this image pipeline.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the distribution configuration associated with this image pipeline.
   */
  public distributionConfigurationArn?: string;

  /**
   * Collects additional information about the image being created, including the operating system (OS) version and package list.
   */
  public enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;

  /**
   * The name or Amazon Resource Name (ARN) for the IAM role you create that grants Image Builder access to perform workflow actions.
   */
  public executionRole?: string;

  /**
   * The Amazon Resource Name (ARN) of the image recipe associated with this image pipeline.
   */
  public imageRecipeArn?: string;

  /**
   * Contains settings for vulnerability scans.
   */
  public imageScanningConfiguration?: CfnImagePipeline.ImageScanningConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration of the image tests that run after image creation to ensure the quality of the image that was created.
   */
  public imageTestsConfiguration?: CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
   */
  public infrastructureConfigurationArn: string;

  /**
   * The name of the image pipeline.
   */
  public name: string;

  /**
   * The schedule of the image pipeline.
   */
  public schedule?: cdk.IResolvable | CfnImagePipeline.ScheduleProperty;

  /**
   * The status of the image pipeline.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of this image pipeline.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * Contains the workflows that run for the image pipeline.
   */
  public workflows?: Array<cdk.IResolvable | CfnImagePipeline.WorkflowConfigurationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnImagePipelineProps) {
    super(scope, id, {
      "type": CfnImagePipeline.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "infrastructureConfigurationArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.containerRecipeArn = props.containerRecipeArn;
    this.description = props.description;
    this.distributionConfigurationArn = props.distributionConfigurationArn;
    this.enhancedImageMetadataEnabled = props.enhancedImageMetadataEnabled;
    this.executionRole = props.executionRole;
    this.imageRecipeArn = props.imageRecipeArn;
    this.imageScanningConfiguration = props.imageScanningConfiguration;
    this.imageTestsConfiguration = props.imageTestsConfiguration;
    this.infrastructureConfigurationArn = props.infrastructureConfigurationArn;
    this.name = props.name;
    this.schedule = props.schedule;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::ImagePipeline", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workflows = props.workflows;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "containerRecipeArn": this.containerRecipeArn,
      "description": this.description,
      "distributionConfigurationArn": this.distributionConfigurationArn,
      "enhancedImageMetadataEnabled": this.enhancedImageMetadataEnabled,
      "executionRole": this.executionRole,
      "imageRecipeArn": this.imageRecipeArn,
      "imageScanningConfiguration": this.imageScanningConfiguration,
      "imageTestsConfiguration": this.imageTestsConfiguration,
      "infrastructureConfigurationArn": this.infrastructureConfigurationArn,
      "name": this.name,
      "schedule": this.schedule,
      "status": this.status,
      "tags": this.tags.renderTags(),
      "workflows": this.workflows
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnImagePipeline.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnImagePipelinePropsToCloudFormation(props);
  }
}

export namespace CfnImagePipeline {
  /**
   * Contains settings for Image Builder image resource and container image scans.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagescanningconfiguration.html
   */
  export interface ImageScanningConfigurationProperty {
    /**
     * Contains Amazon ECR settings for vulnerability scans.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagescanningconfiguration.html#cfn-imagebuilder-imagepipeline-imagescanningconfiguration-ecrconfiguration
     */
    readonly ecrConfiguration?: CfnImagePipeline.EcrConfigurationProperty | cdk.IResolvable;

    /**
     * A setting that indicates whether Image Builder keeps a snapshot of the vulnerability scans that Amazon Inspector runs against the build instance when you create a new image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagescanningconfiguration.html#cfn-imagebuilder-imagepipeline-imagescanningconfiguration-imagescanningenabled
     */
    readonly imageScanningEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Settings that Image Builder uses to configure the ECR repository and the output container images that Amazon Inspector scans.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-ecrconfiguration.html
   */
  export interface EcrConfigurationProperty {
    /**
     * Tags for Image Builder to apply to the output container image that &INS;
     *
     * scans. Tags can help you identify and manage your scanned images.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-ecrconfiguration.html#cfn-imagebuilder-imagepipeline-ecrconfiguration-containertags
     */
    readonly containerTags?: Array<string>;

    /**
     * The name of the container repository that Amazon Inspector scans to identify findings for your container images.
     *
     * The name includes the path for the repository location. If you don’t provide this information, Image Builder creates a repository in your account named `image-builder-image-scanning-repository` for vulnerability scans of your output container images.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-ecrconfiguration.html#cfn-imagebuilder-imagepipeline-ecrconfiguration-repositoryname
     */
    readonly repositoryName?: string;
  }

  /**
   * A schedule configures when and how often a pipeline will automatically create a new image.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html
   */
  export interface ScheduleProperty {
    /**
     * The condition configures when the pipeline should trigger a new image build.
     *
     * When the `pipelineExecutionStartCondition` is set to `EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE` , and you use semantic version filters on the base image or components in your image recipe, Image Builder will build a new image only when there are new versions of the image or components in your recipe that match the semantic version filter. When it is set to `EXPRESSION_MATCH_ONLY` , it will build a new image every time the CRON expression matches the current time. For semantic version syntax, see [CreateComponent](https://docs.aws.amazon.com/imagebuilder/latest/APIReference/API_CreateComponent.html) in the *Image Builder API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html#cfn-imagebuilder-imagepipeline-schedule-pipelineexecutionstartcondition
     */
    readonly pipelineExecutionStartCondition?: string;

    /**
     * The cron expression determines how often EC2 Image Builder evaluates your `pipelineExecutionStartCondition` .
     *
     * For information on how to format a cron expression in Image Builder, see [Use cron expressions in EC2 Image Builder](https://docs.aws.amazon.com/imagebuilder/latest/userguide/image-builder-cron.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-schedule.html#cfn-imagebuilder-imagepipeline-schedule-scheduleexpression
     */
    readonly scheduleExpression?: string;
  }

  /**
   * When you create an image or container recipe with Image Builder , you can add the build or test components that your image pipeline uses to create the final image.
   *
   * You must have at least one build component to create a recipe, but test components are not required. Your pipeline runs tests after it builds the image, to ensure that the target image is functional and can be used reliably for launching Amazon EC2 instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html
   */
  export interface ImageTestsConfigurationProperty {
    /**
     * Defines if tests should be executed when building this image.
     *
     * For example, `true` or `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration-imagetestsenabled
     */
    readonly imageTestsEnabled?: boolean | cdk.IResolvable;

    /**
     * The maximum time in minutes that tests are permitted to run.
     *
     * > The timeoutMinutes attribute is not currently active. This value is ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-imagetestsconfiguration.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration-timeoutminutes
     */
    readonly timeoutMinutes?: number;
  }

  /**
   * Contains control settings and configurable inputs for a workflow resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowconfiguration.html
   */
  export interface WorkflowConfigurationProperty {
    /**
     * The action to take if the workflow fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowconfiguration.html#cfn-imagebuilder-imagepipeline-workflowconfiguration-onfailure
     */
    readonly onFailure?: string;

    /**
     * Test workflows are defined within named runtime groups called parallel groups.
     *
     * The parallel group is the named group that contains this test workflow. Test workflows within a parallel group can run at the same time. Image Builder starts up to five test workflows in the group at the same time, and starts additional workflows as others complete, until all workflows in the group have completed. This field only applies for test workflows.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowconfiguration.html#cfn-imagebuilder-imagepipeline-workflowconfiguration-parallelgroup
     */
    readonly parallelGroup?: string;

    /**
     * Contains parameter values for each of the parameters that the workflow document defined for the workflow resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowconfiguration.html#cfn-imagebuilder-imagepipeline-workflowconfiguration-parameters
     */
    readonly parameters?: Array<cdk.IResolvable | CfnImagePipeline.WorkflowParameterProperty> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the workflow resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowconfiguration.html#cfn-imagebuilder-imagepipeline-workflowconfiguration-workflowarn
     */
    readonly workflowArn?: string;
  }

  /**
   * Contains a key/value pair that sets the named workflow parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowparameter.html
   */
  export interface WorkflowParameterProperty {
    /**
     * The name of the workflow parameter to set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowparameter.html#cfn-imagebuilder-imagepipeline-workflowparameter-name
     */
    readonly name?: string;

    /**
     * Sets the value for the named workflow parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagepipeline-workflowparameter.html#cfn-imagebuilder-imagepipeline-workflowparameter-value
     */
    readonly value?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnImagePipeline`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html
 */
export interface CfnImagePipelineProps {
  /**
   * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-containerrecipearn
   */
  readonly containerRecipeArn?: string;

  /**
   * The description of this image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the distribution configuration associated with this image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-distributionconfigurationarn
   */
  readonly distributionConfigurationArn?: string;

  /**
   * Collects additional information about the image being created, including the operating system (OS) version and package list.
   *
   * This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-enhancedimagemetadataenabled
   */
  readonly enhancedImageMetadataEnabled?: boolean | cdk.IResolvable;

  /**
   * The name or Amazon Resource Name (ARN) for the IAM role you create that grants Image Builder access to perform workflow actions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-executionrole
   */
  readonly executionRole?: string;

  /**
   * The Amazon Resource Name (ARN) of the image recipe associated with this image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagerecipearn
   */
  readonly imageRecipeArn?: string;

  /**
   * Contains settings for vulnerability scans.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagescanningconfiguration
   */
  readonly imageScanningConfiguration?: CfnImagePipeline.ImageScanningConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration of the image tests that run after image creation to ensure the quality of the image that was created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-imagetestsconfiguration
   */
  readonly imageTestsConfiguration?: CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-infrastructureconfigurationarn
   */
  readonly infrastructureConfigurationArn: string;

  /**
   * The name of the image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-name
   */
  readonly name: string;

  /**
   * The schedule of the image pipeline.
   *
   * A schedule configures how often and when a pipeline automatically creates a new image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-schedule
   */
  readonly schedule?: cdk.IResolvable | CfnImagePipeline.ScheduleProperty;

  /**
   * The status of the image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-status
   */
  readonly status?: string;

  /**
   * The tags of this image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * Contains the workflows that run for the image pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagepipeline.html#cfn-imagebuilder-imagepipeline-workflows
   */
  readonly workflows?: Array<cdk.IResolvable | CfnImagePipeline.WorkflowConfigurationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `EcrConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EcrConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePipelineEcrConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerTags", cdk.listValidator(cdk.validateString))(properties.containerTags));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  return errors.wrap("supplied properties not correct for \"EcrConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImagePipelineEcrConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePipelineEcrConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ContainerTags": cdk.listMapper(cdk.stringToCloudFormation)(properties.containerTags),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName)
  };
}

// @ts-ignore TS6133
function CfnImagePipelineEcrConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImagePipeline.EcrConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.EcrConfigurationProperty>();
  ret.addPropertyResult("containerTags", "ContainerTags", (properties.ContainerTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ContainerTags) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageScanningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageScanningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePipelineImageScanningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ecrConfiguration", CfnImagePipelineEcrConfigurationPropertyValidator)(properties.ecrConfiguration));
  errors.collect(cdk.propertyValidator("imageScanningEnabled", cdk.validateBoolean)(properties.imageScanningEnabled));
  return errors.wrap("supplied properties not correct for \"ImageScanningConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImagePipelineImageScanningConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePipelineImageScanningConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EcrConfiguration": convertCfnImagePipelineEcrConfigurationPropertyToCloudFormation(properties.ecrConfiguration),
    "ImageScanningEnabled": cdk.booleanToCloudFormation(properties.imageScanningEnabled)
  };
}

// @ts-ignore TS6133
function CfnImagePipelineImageScanningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImagePipeline.ImageScanningConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.ImageScanningConfigurationProperty>();
  ret.addPropertyResult("ecrConfiguration", "EcrConfiguration", (properties.EcrConfiguration != null ? CfnImagePipelineEcrConfigurationPropertyFromCloudFormation(properties.EcrConfiguration) : undefined));
  ret.addPropertyResult("imageScanningEnabled", "ImageScanningEnabled", (properties.ImageScanningEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ImageScanningEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePipelineSchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pipelineExecutionStartCondition", cdk.validateString)(properties.pipelineExecutionStartCondition));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  return errors.wrap("supplied properties not correct for \"ScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnImagePipelineSchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePipelineSchedulePropertyValidator(properties).assertSuccess();
  return {
    "PipelineExecutionStartCondition": cdk.stringToCloudFormation(properties.pipelineExecutionStartCondition),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression)
  };
}

// @ts-ignore TS6133
function CfnImagePipelineSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnImagePipeline.ScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.ScheduleProperty>();
  ret.addPropertyResult("pipelineExecutionStartCondition", "PipelineExecutionStartCondition", (properties.PipelineExecutionStartCondition != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineExecutionStartCondition) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageTestsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageTestsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePipelineImageTestsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("imageTestsEnabled", cdk.validateBoolean)(properties.imageTestsEnabled));
  errors.collect(cdk.propertyValidator("timeoutMinutes", cdk.validateNumber)(properties.timeoutMinutes));
  return errors.wrap("supplied properties not correct for \"ImageTestsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImagePipelineImageTestsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePipelineImageTestsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ImageTestsEnabled": cdk.booleanToCloudFormation(properties.imageTestsEnabled),
    "TimeoutMinutes": cdk.numberToCloudFormation(properties.timeoutMinutes)
  };
}

// @ts-ignore TS6133
function CfnImagePipelineImageTestsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImagePipeline.ImageTestsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.ImageTestsConfigurationProperty>();
  ret.addPropertyResult("imageTestsEnabled", "ImageTestsEnabled", (properties.ImageTestsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ImageTestsEnabled) : undefined));
  ret.addPropertyResult("timeoutMinutes", "TimeoutMinutes", (properties.TimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowParameterProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePipelineWorkflowParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.listValidator(cdk.validateString))(properties.value));
  return errors.wrap("supplied properties not correct for \"WorkflowParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnImagePipelineWorkflowParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePipelineWorkflowParameterPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.listMapper(cdk.stringToCloudFormation)(properties.value)
  };
}

// @ts-ignore TS6133
function CfnImagePipelineWorkflowParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnImagePipeline.WorkflowParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.WorkflowParameterProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkflowConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePipelineWorkflowConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onFailure", cdk.validateString)(properties.onFailure));
  errors.collect(cdk.propertyValidator("parallelGroup", cdk.validateString)(properties.parallelGroup));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnImagePipelineWorkflowParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("workflowArn", cdk.validateString)(properties.workflowArn));
  return errors.wrap("supplied properties not correct for \"WorkflowConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImagePipelineWorkflowConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePipelineWorkflowConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "OnFailure": cdk.stringToCloudFormation(properties.onFailure),
    "ParallelGroup": cdk.stringToCloudFormation(properties.parallelGroup),
    "Parameters": cdk.listMapper(convertCfnImagePipelineWorkflowParameterPropertyToCloudFormation)(properties.parameters),
    "WorkflowArn": cdk.stringToCloudFormation(properties.workflowArn)
  };
}

// @ts-ignore TS6133
function CfnImagePipelineWorkflowConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnImagePipeline.WorkflowConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipeline.WorkflowConfigurationProperty>();
  ret.addPropertyResult("onFailure", "OnFailure", (properties.OnFailure != null ? cfn_parse.FromCloudFormation.getString(properties.OnFailure) : undefined));
  ret.addPropertyResult("parallelGroup", "ParallelGroup", (properties.ParallelGroup != null ? cfn_parse.FromCloudFormation.getString(properties.ParallelGroup) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnImagePipelineWorkflowParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("workflowArn", "WorkflowArn", (properties.WorkflowArn != null ? cfn_parse.FromCloudFormation.getString(properties.WorkflowArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnImagePipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnImagePipelineProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImagePipelinePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerRecipeArn", cdk.validateString)(properties.containerRecipeArn));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("distributionConfigurationArn", cdk.validateString)(properties.distributionConfigurationArn));
  errors.collect(cdk.propertyValidator("enhancedImageMetadataEnabled", cdk.validateBoolean)(properties.enhancedImageMetadataEnabled));
  errors.collect(cdk.propertyValidator("executionRole", cdk.validateString)(properties.executionRole));
  errors.collect(cdk.propertyValidator("imageRecipeArn", cdk.validateString)(properties.imageRecipeArn));
  errors.collect(cdk.propertyValidator("imageScanningConfiguration", CfnImagePipelineImageScanningConfigurationPropertyValidator)(properties.imageScanningConfiguration));
  errors.collect(cdk.propertyValidator("imageTestsConfiguration", CfnImagePipelineImageTestsConfigurationPropertyValidator)(properties.imageTestsConfiguration));
  errors.collect(cdk.propertyValidator("infrastructureConfigurationArn", cdk.requiredValidator)(properties.infrastructureConfigurationArn));
  errors.collect(cdk.propertyValidator("infrastructureConfigurationArn", cdk.validateString)(properties.infrastructureConfigurationArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("schedule", CfnImagePipelineSchedulePropertyValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("workflows", cdk.listValidator(CfnImagePipelineWorkflowConfigurationPropertyValidator))(properties.workflows));
  return errors.wrap("supplied properties not correct for \"CfnImagePipelineProps\"");
}

// @ts-ignore TS6133
function convertCfnImagePipelinePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImagePipelinePropsValidator(properties).assertSuccess();
  return {
    "ContainerRecipeArn": cdk.stringToCloudFormation(properties.containerRecipeArn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DistributionConfigurationArn": cdk.stringToCloudFormation(properties.distributionConfigurationArn),
    "EnhancedImageMetadataEnabled": cdk.booleanToCloudFormation(properties.enhancedImageMetadataEnabled),
    "ExecutionRole": cdk.stringToCloudFormation(properties.executionRole),
    "ImageRecipeArn": cdk.stringToCloudFormation(properties.imageRecipeArn),
    "ImageScanningConfiguration": convertCfnImagePipelineImageScanningConfigurationPropertyToCloudFormation(properties.imageScanningConfiguration),
    "ImageTestsConfiguration": convertCfnImagePipelineImageTestsConfigurationPropertyToCloudFormation(properties.imageTestsConfiguration),
    "InfrastructureConfigurationArn": cdk.stringToCloudFormation(properties.infrastructureConfigurationArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Schedule": convertCfnImagePipelineSchedulePropertyToCloudFormation(properties.schedule),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Workflows": cdk.listMapper(convertCfnImagePipelineWorkflowConfigurationPropertyToCloudFormation)(properties.workflows)
  };
}

// @ts-ignore TS6133
function CfnImagePipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImagePipelineProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImagePipelineProps>();
  ret.addPropertyResult("containerRecipeArn", "ContainerRecipeArn", (properties.ContainerRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerRecipeArn) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("distributionConfigurationArn", "DistributionConfigurationArn", (properties.DistributionConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DistributionConfigurationArn) : undefined));
  ret.addPropertyResult("enhancedImageMetadataEnabled", "EnhancedImageMetadataEnabled", (properties.EnhancedImageMetadataEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnhancedImageMetadataEnabled) : undefined));
  ret.addPropertyResult("executionRole", "ExecutionRole", (properties.ExecutionRole != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRole) : undefined));
  ret.addPropertyResult("imageRecipeArn", "ImageRecipeArn", (properties.ImageRecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.ImageRecipeArn) : undefined));
  ret.addPropertyResult("imageScanningConfiguration", "ImageScanningConfiguration", (properties.ImageScanningConfiguration != null ? CfnImagePipelineImageScanningConfigurationPropertyFromCloudFormation(properties.ImageScanningConfiguration) : undefined));
  ret.addPropertyResult("imageTestsConfiguration", "ImageTestsConfiguration", (properties.ImageTestsConfiguration != null ? CfnImagePipelineImageTestsConfigurationPropertyFromCloudFormation(properties.ImageTestsConfiguration) : undefined));
  ret.addPropertyResult("infrastructureConfigurationArn", "InfrastructureConfigurationArn", (properties.InfrastructureConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.InfrastructureConfigurationArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? CfnImagePipelineSchedulePropertyFromCloudFormation(properties.Schedule) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("workflows", "Workflows", (properties.Workflows != null ? cfn_parse.FromCloudFormation.getArray(CfnImagePipelineWorkflowConfigurationPropertyFromCloudFormation)(properties.Workflows) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * An Image Builder image recipe is a document that defines the base image and the components to be applied to the base image to produce the desired configuration for the output image.
 *
 * You can use an image recipe to duplicate builds. Image Builder image recipes can be shared, branched, and edited using the console wizard, the AWS CLI , or the API. You can use image recipes with your version control software to maintain shareable versioned image recipes.
 *
 * @cloudformationResource AWS::ImageBuilder::ImageRecipe
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html
 */
export class CfnImageRecipe extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::ImageRecipe";

  /**
   * Build a CfnImageRecipe from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImageRecipe {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnImageRecipePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnImageRecipe(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the image recipe. For example, `arn:aws:imagebuilder:us-east-1:123456789012:image-recipe/mybasicrecipe/2019.12.03` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the image recipe.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Before you create a new AMI, Image Builder launches temporary Amazon EC2 instances to build and test your image configuration.
   */
  public additionalInstanceConfiguration?: CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable;

  /**
   * The block device mappings to apply when creating images from this recipe.
   */
  public blockDeviceMappings?: Array<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The components of the image recipe.
   */
  public components: Array<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the image recipe.
   */
  public description?: string;

  /**
   * The name of the image recipe.
   */
  public name: string;

  /**
   * The parent image of the image recipe.
   */
  public parentImage: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of the image recipe.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The semantic version of the image recipe.
   */
  public version: string;

  /**
   * The working directory to be used during build and test workflows.
   */
  public workingDirectory?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnImageRecipeProps) {
    super(scope, id, {
      "type": CfnImageRecipe.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "components", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "parentImage", this);
    cdk.requireProperty(props, "version", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.additionalInstanceConfiguration = props.additionalInstanceConfiguration;
    this.blockDeviceMappings = props.blockDeviceMappings;
    this.components = props.components;
    this.description = props.description;
    this.name = props.name;
    this.parentImage = props.parentImage;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::ImageRecipe", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.version = props.version;
    this.workingDirectory = props.workingDirectory;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalInstanceConfiguration": this.additionalInstanceConfiguration,
      "blockDeviceMappings": this.blockDeviceMappings,
      "components": this.components,
      "description": this.description,
      "name": this.name,
      "parentImage": this.parentImage,
      "tags": this.tags.renderTags(),
      "version": this.version,
      "workingDirectory": this.workingDirectory
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnImageRecipe.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnImageRecipePropsToCloudFormation(props);
  }
}

export namespace CfnImageRecipe {
  /**
   * Configuration details of the component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html
   */
  export interface ComponentConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html#cfn-imagebuilder-imagerecipe-componentconfiguration-componentarn
     */
    readonly componentArn?: string;

    /**
     * A group of parameter settings that Image Builder uses to configure the component for a specific recipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentconfiguration.html#cfn-imagebuilder-imagerecipe-componentconfiguration-parameters
     */
    readonly parameters?: Array<CfnImageRecipe.ComponentParameterProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Contains a key/value pair that sets the named component parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html
   */
  export interface ComponentParameterProperty {
    /**
     * The name of the component parameter to set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html#cfn-imagebuilder-imagerecipe-componentparameter-name
     */
    readonly name: string;

    /**
     * Sets the value for the named component parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-componentparameter.html#cfn-imagebuilder-imagerecipe-componentparameter-value
     */
    readonly value: Array<string>;
  }

  /**
   * Defines block device mappings for the instance used to configure your image.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html
   */
  export interface InstanceBlockDeviceMappingProperty {
    /**
     * The device to which these mappings apply.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-devicename
     */
    readonly deviceName?: string;

    /**
     * Use to manage Amazon EBS-specific configuration for this mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-ebs
     */
    readonly ebs?: CfnImageRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable;

    /**
     * Enter an empty string to remove a mapping from the parent image.
     *
     * The following is an example of an empty string value in the `NoDevice` field.
     *
     * `NoDevice:""`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-nodevice
     */
    readonly noDevice?: string;

    /**
     * Manages the instance ephemeral devices.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-instanceblockdevicemapping.html#cfn-imagebuilder-imagerecipe-instanceblockdevicemapping-virtualname
     */
    readonly virtualName?: string;
  }

  /**
   * The image recipe EBS instance block device specification includes the Amazon EBS-specific block device mapping specifications for the image.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html
   */
  export interface EbsInstanceBlockDeviceSpecificationProperty {
    /**
     * Configures delete on termination of the associated device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-deleteontermination
     */
    readonly deleteOnTermination?: boolean | cdk.IResolvable;

    /**
     * Use to configure device encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-encrypted
     */
    readonly encrypted?: boolean | cdk.IResolvable;

    /**
     * Use to configure device IOPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-iops
     */
    readonly iops?: number;

    /**
     * Use to configure the KMS key to use when encrypting the device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The snapshot that defines the device contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-snapshotid
     */
    readonly snapshotId?: string;

    /**
     * *For GP3 volumes only* – The throughput in MiB/s that the volume supports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-throughput
     */
    readonly throughput?: number;

    /**
     * Overrides the volume size of the device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-volumesize
     */
    readonly volumeSize?: number;

    /**
     * Overrides the volume type of the device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification.html#cfn-imagebuilder-imagerecipe-ebsinstanceblockdevicespecification-volumetype
     */
    readonly volumeType?: string;
  }

  /**
   * In addition to your infrastructure configuration, these settings provide an extra layer of control over your build instances.
   *
   * You can also specify commands to run on launch for all of your build instances.
   *
   * Image Builder does not automatically install the Systems Manager agent on Windows instances. If your base image includes the Systems Manager agent, then the AMI that you create will also include the agent. For Linux instances, if the base image does not already include the Systems Manager agent, Image Builder installs it. For Linux instances where Image Builder installs the Systems Manager agent, you can choose whether to keep it for the AMI that you create.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html
   */
  export interface AdditionalInstanceConfigurationProperty {
    /**
     * Contains settings for the Systems Manager agent on your build instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration-systemsmanageragent
     */
    readonly systemsManagerAgent?: cdk.IResolvable | CfnImageRecipe.SystemsManagerAgentProperty;

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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-additionalinstanceconfiguration.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration-userdataoverride
     */
    readonly userDataOverride?: string;
  }

  /**
   * Contains settings for the Systems Manager agent on your build instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-systemsmanageragent.html
   */
  export interface SystemsManagerAgentProperty {
    /**
     * Controls whether the Systems Manager agent is removed from your final build image, prior to creating the new AMI.
     *
     * If this is set to true, then the agent is removed from the final image. If it's set to false, then the agent is left in, so that it is included in the new AMI. The default value is false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-imagerecipe-systemsmanageragent.html#cfn-imagebuilder-imagerecipe-systemsmanageragent-uninstallafterbuild
     */
    readonly uninstallAfterBuild?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnImageRecipe`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html
 */
export interface CfnImageRecipeProps {
  /**
   * Before you create a new AMI, Image Builder launches temporary Amazon EC2 instances to build and test your image configuration.
   *
   * Instance configuration adds a layer of control over those instances. You can define settings and add scripts to run when an instance is launched from your AMI.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-additionalinstanceconfiguration
   */
  readonly additionalInstanceConfiguration?: CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable;

  /**
   * The block device mappings to apply when creating images from this recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-blockdevicemappings
   */
  readonly blockDeviceMappings?: Array<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The components of the image recipe.
   *
   * Components are orchestration documents that define a sequence of steps for downloading, installing, configuring, and testing software packages. They also define validation and security hardening steps. A component is defined using a YAML document format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-components
   */
  readonly components: Array<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the image recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-description
   */
  readonly description?: string;

  /**
   * The name of the image recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-name
   */
  readonly name: string;

  /**
   * The parent image of the image recipe.
   *
   * The string must be either an Image ARN or an AMI ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-parentimage
   */
  readonly parentImage: string;

  /**
   * The tags of the image recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The semantic version of the image recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-version
   */
  readonly version: string;

  /**
   * The working directory to be used during build and test workflows.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-imagerecipe.html#cfn-imagebuilder-imagerecipe-workingdirectory
   */
  readonly workingDirectory?: string;
}

/**
 * Determine whether the given properties match those of a `ComponentParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageRecipeComponentParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.listValidator(cdk.validateString))(properties.value));
  return errors.wrap("supplied properties not correct for \"ComponentParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageRecipeComponentParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageRecipeComponentParameterPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.listMapper(cdk.stringToCloudFormation)(properties.value)
  };
}

// @ts-ignore TS6133
function CfnImageRecipeComponentParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.ComponentParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.ComponentParameterProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageRecipeComponentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentArn", cdk.validateString)(properties.componentArn));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnImageRecipeComponentParameterPropertyValidator))(properties.parameters));
  return errors.wrap("supplied properties not correct for \"ComponentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageRecipeComponentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageRecipeComponentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ComponentArn": cdk.stringToCloudFormation(properties.componentArn),
    "Parameters": cdk.listMapper(convertCfnImageRecipeComponentParameterPropertyToCloudFormation)(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnImageRecipeComponentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.ComponentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.ComponentConfigurationProperty>();
  ret.addPropertyResult("componentArn", "ComponentArn", (properties.ComponentArn != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentArn) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnImageRecipeComponentParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `EbsInstanceBlockDeviceSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteOnTermination", cdk.validateBoolean)(properties.deleteOnTermination));
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("snapshotId", cdk.validateString)(properties.snapshotId));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  errors.collect(cdk.propertyValidator("volumeSize", cdk.validateNumber)(properties.volumeSize));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"EbsInstanceBlockDeviceSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "DeleteOnTermination": cdk.booleanToCloudFormation(properties.deleteOnTermination),
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "SnapshotId": cdk.stringToCloudFormation(properties.snapshotId),
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
    "VolumeSize": cdk.numberToCloudFormation(properties.volumeSize),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.EbsInstanceBlockDeviceSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.EbsInstanceBlockDeviceSpecificationProperty>();
  ret.addPropertyResult("deleteOnTermination", "DeleteOnTermination", (properties.DeleteOnTermination != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteOnTermination) : undefined));
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("snapshotId", "SnapshotId", (properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeSize", "VolumeSize", (properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceBlockDeviceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceBlockDeviceMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageRecipeInstanceBlockDeviceMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceName", cdk.validateString)(properties.deviceName));
  errors.collect(cdk.propertyValidator("ebs", CfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyValidator)(properties.ebs));
  errors.collect(cdk.propertyValidator("noDevice", cdk.validateString)(properties.noDevice));
  errors.collect(cdk.propertyValidator("virtualName", cdk.validateString)(properties.virtualName));
  return errors.wrap("supplied properties not correct for \"InstanceBlockDeviceMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageRecipeInstanceBlockDeviceMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageRecipeInstanceBlockDeviceMappingPropertyValidator(properties).assertSuccess();
  return {
    "DeviceName": cdk.stringToCloudFormation(properties.deviceName),
    "Ebs": convertCfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyToCloudFormation(properties.ebs),
    "NoDevice": cdk.stringToCloudFormation(properties.noDevice),
    "VirtualName": cdk.stringToCloudFormation(properties.virtualName)
  };
}

// @ts-ignore TS6133
function CfnImageRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.InstanceBlockDeviceMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.InstanceBlockDeviceMappingProperty>();
  ret.addPropertyResult("deviceName", "DeviceName", (properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined));
  ret.addPropertyResult("ebs", "Ebs", (properties.Ebs != null ? CfnImageRecipeEbsInstanceBlockDeviceSpecificationPropertyFromCloudFormation(properties.Ebs) : undefined));
  ret.addPropertyResult("noDevice", "NoDevice", (properties.NoDevice != null ? cfn_parse.FromCloudFormation.getString(properties.NoDevice) : undefined));
  ret.addPropertyResult("virtualName", "VirtualName", (properties.VirtualName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SystemsManagerAgentProperty`
 *
 * @param properties - the TypeScript properties of a `SystemsManagerAgentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageRecipeSystemsManagerAgentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("uninstallAfterBuild", cdk.validateBoolean)(properties.uninstallAfterBuild));
  return errors.wrap("supplied properties not correct for \"SystemsManagerAgentProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageRecipeSystemsManagerAgentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageRecipeSystemsManagerAgentPropertyValidator(properties).assertSuccess();
  return {
    "UninstallAfterBuild": cdk.booleanToCloudFormation(properties.uninstallAfterBuild)
  };
}

// @ts-ignore TS6133
function CfnImageRecipeSystemsManagerAgentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnImageRecipe.SystemsManagerAgentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.SystemsManagerAgentProperty>();
  ret.addPropertyResult("uninstallAfterBuild", "UninstallAfterBuild", (properties.UninstallAfterBuild != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UninstallAfterBuild) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AdditionalInstanceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AdditionalInstanceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageRecipeAdditionalInstanceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("systemsManagerAgent", CfnImageRecipeSystemsManagerAgentPropertyValidator)(properties.systemsManagerAgent));
  errors.collect(cdk.propertyValidator("userDataOverride", cdk.validateString)(properties.userDataOverride));
  return errors.wrap("supplied properties not correct for \"AdditionalInstanceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageRecipeAdditionalInstanceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageRecipeAdditionalInstanceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SystemsManagerAgent": convertCfnImageRecipeSystemsManagerAgentPropertyToCloudFormation(properties.systemsManagerAgent),
    "UserDataOverride": cdk.stringToCloudFormation(properties.userDataOverride)
  };
}

// @ts-ignore TS6133
function CfnImageRecipeAdditionalInstanceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipe.AdditionalInstanceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipe.AdditionalInstanceConfigurationProperty>();
  ret.addPropertyResult("systemsManagerAgent", "SystemsManagerAgent", (properties.SystemsManagerAgent != null ? CfnImageRecipeSystemsManagerAgentPropertyFromCloudFormation(properties.SystemsManagerAgent) : undefined));
  ret.addPropertyResult("userDataOverride", "UserDataOverride", (properties.UserDataOverride != null ? cfn_parse.FromCloudFormation.getString(properties.UserDataOverride) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnImageRecipeProps`
 *
 * @param properties - the TypeScript properties of a `CfnImageRecipeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageRecipePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalInstanceConfiguration", CfnImageRecipeAdditionalInstanceConfigurationPropertyValidator)(properties.additionalInstanceConfiguration));
  errors.collect(cdk.propertyValidator("blockDeviceMappings", cdk.listValidator(CfnImageRecipeInstanceBlockDeviceMappingPropertyValidator))(properties.blockDeviceMappings));
  errors.collect(cdk.propertyValidator("components", cdk.requiredValidator)(properties.components));
  errors.collect(cdk.propertyValidator("components", cdk.listValidator(CfnImageRecipeComponentConfigurationPropertyValidator))(properties.components));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parentImage", cdk.requiredValidator)(properties.parentImage));
  errors.collect(cdk.propertyValidator("parentImage", cdk.validateString)(properties.parentImage));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  errors.collect(cdk.propertyValidator("workingDirectory", cdk.validateString)(properties.workingDirectory));
  return errors.wrap("supplied properties not correct for \"CfnImageRecipeProps\"");
}

// @ts-ignore TS6133
function convertCfnImageRecipePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageRecipePropsValidator(properties).assertSuccess();
  return {
    "AdditionalInstanceConfiguration": convertCfnImageRecipeAdditionalInstanceConfigurationPropertyToCloudFormation(properties.additionalInstanceConfiguration),
    "BlockDeviceMappings": cdk.listMapper(convertCfnImageRecipeInstanceBlockDeviceMappingPropertyToCloudFormation)(properties.blockDeviceMappings),
    "Components": cdk.listMapper(convertCfnImageRecipeComponentConfigurationPropertyToCloudFormation)(properties.components),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ParentImage": cdk.stringToCloudFormation(properties.parentImage),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Version": cdk.stringToCloudFormation(properties.version),
    "WorkingDirectory": cdk.stringToCloudFormation(properties.workingDirectory)
  };
}

// @ts-ignore TS6133
function CfnImageRecipePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageRecipeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageRecipeProps>();
  ret.addPropertyResult("additionalInstanceConfiguration", "AdditionalInstanceConfiguration", (properties.AdditionalInstanceConfiguration != null ? CfnImageRecipeAdditionalInstanceConfigurationPropertyFromCloudFormation(properties.AdditionalInstanceConfiguration) : undefined));
  ret.addPropertyResult("blockDeviceMappings", "BlockDeviceMappings", (properties.BlockDeviceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnImageRecipeInstanceBlockDeviceMappingPropertyFromCloudFormation)(properties.BlockDeviceMappings) : undefined));
  ret.addPropertyResult("components", "Components", (properties.Components != null ? cfn_parse.FromCloudFormation.getArray(CfnImageRecipeComponentConfigurationPropertyFromCloudFormation)(properties.Components) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parentImage", "ParentImage", (properties.ParentImage != null ? cfn_parse.FromCloudFormation.getString(properties.ParentImage) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addPropertyResult("workingDirectory", "WorkingDirectory", (properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The infrastructure configuration allows you to specify the infrastructure within which to build and test your image.
 *
 * In the infrastructure configuration, you can specify instance types, subnets, and security groups to associate with your instance. You can also associate an Amazon EC2 key pair with the instance used to build your image. This allows you to log on to your instance to troubleshoot if your build fails and you set terminateInstanceOnFailure to false.
 *
 * @cloudformationResource AWS::ImageBuilder::InfrastructureConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html
 */
export class CfnInfrastructureConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::InfrastructureConfiguration";

  /**
   * Build a CfnInfrastructureConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInfrastructureConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInfrastructureConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInfrastructureConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the infrastructure configuration. The following pattern is applied: `^arn:aws[^:]*:imagebuilder:[^:]+:(?:\d{12}|aws):(?:image-recipe|infrastructure-configuration|distribution-configuration|component|image|image-pipeline)/[a-z0-9-_]+(?:/(?:(?:x|\d+)\.(?:x|\d+)\.(?:x|\d+))(?:/\d+)?)?$` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the infrastructure configuration.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The description of the infrastructure configuration.
   */
  public description?: string;

  /**
   * The instance metadata option settings for the infrastructure configuration.
   */
  public instanceMetadataOptions?: CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable;

  /**
   * The instance profile of the infrastructure configuration.
   */
  public instanceProfileName: string;

  /**
   * The instance types of the infrastructure configuration.
   */
  public instanceTypes?: Array<string>;

  /**
   * The Amazon EC2 key pair of the infrastructure configuration.
   */
  public keyPair?: string;

  /**
   * The logging configuration defines where Image Builder uploads your logs.
   */
  public logging?: cdk.IResolvable | CfnInfrastructureConfiguration.LoggingProperty;

  /**
   * The name of the infrastructure configuration.
   */
  public name: string;

  /**
   * The tags attached to the resource created by Image Builder.
   */
  public resourceTags?: cdk.IResolvable | Record<string, string>;

  /**
   * The security group IDs of the infrastructure configuration.
   */
  public securityGroupIds?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the SNS topic for the infrastructure configuration.
   */
  public snsTopicArn?: string;

  /**
   * The subnet ID of the infrastructure configuration.
   */
  public subnetId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of the infrastructure configuration.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The terminate instance on failure configuration of the infrastructure configuration.
   */
  public terminateInstanceOnFailure?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInfrastructureConfigurationProps) {
    super(scope, id, {
      "type": CfnInfrastructureConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceProfileName", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.instanceMetadataOptions = props.instanceMetadataOptions;
    this.instanceProfileName = props.instanceProfileName;
    this.instanceTypes = props.instanceTypes;
    this.keyPair = props.keyPair;
    this.logging = props.logging;
    this.name = props.name;
    this.resourceTags = props.resourceTags;
    this.securityGroupIds = props.securityGroupIds;
    this.snsTopicArn = props.snsTopicArn;
    this.subnetId = props.subnetId;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ImageBuilder::InfrastructureConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.terminateInstanceOnFailure = props.terminateInstanceOnFailure;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "instanceMetadataOptions": this.instanceMetadataOptions,
      "instanceProfileName": this.instanceProfileName,
      "instanceTypes": this.instanceTypes,
      "keyPair": this.keyPair,
      "logging": this.logging,
      "name": this.name,
      "resourceTags": this.resourceTags,
      "securityGroupIds": this.securityGroupIds,
      "snsTopicArn": this.snsTopicArn,
      "subnetId": this.subnetId,
      "tags": this.tags.renderTags(),
      "terminateInstanceOnFailure": this.terminateInstanceOnFailure
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInfrastructureConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInfrastructureConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnInfrastructureConfiguration {
  /**
   * Logging configuration defines where Image Builder uploads your logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-logging.html
   */
  export interface LoggingProperty {
    /**
     * The Amazon S3 logging configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-logging.html#cfn-imagebuilder-infrastructureconfiguration-logging-s3logs
     */
    readonly s3Logs?: cdk.IResolvable | CfnInfrastructureConfiguration.S3LogsProperty;
  }

  /**
   * Amazon S3 logging configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html
   */
  export interface S3LogsProperty {
    /**
     * The S3 bucket in which to store the logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html#cfn-imagebuilder-infrastructureconfiguration-s3logs-s3bucketname
     */
    readonly s3BucketName?: string;

    /**
     * The Amazon S3 path to the bucket where the logs are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-s3logs.html#cfn-imagebuilder-infrastructureconfiguration-s3logs-s3keyprefix
     */
    readonly s3KeyPrefix?: string;
  }

  /**
   * The instance metadata options that apply to the HTTP requests that pipeline builds use to launch EC2 build and test instances.
   *
   * For more information about instance metadata options, see [Configure the instance metadata options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html) in the **Amazon EC2 User Guide** for Linux instances, or [Configure the instance metadata options](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/configuring-instance-metadata-options.html) in the **Amazon EC2 Windows Guide** for Windows instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html
   */
  export interface InstanceMetadataOptionsProperty {
    /**
     * Limit the number of hops that an instance metadata request can traverse to reach its destination.
     *
     * The default is one hop. However, if HTTP tokens are required, container image builds need a minimum of two hops.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions-httpputresponsehoplimit
     */
    readonly httpPutResponseHopLimit?: number;

    /**
     * Indicates whether a signed token header is required for instance metadata retrieval requests.
     *
     * The values affect the response as follows:
     *
     * - *required* – When you retrieve the IAM role credentials, version 2.0 credentials are returned in all cases.
     * - *optional* – You can include a signed token header in your request to retrieve instance metadata, or you can leave it out. If you include it, version 2.0 credentials are returned for the IAM role. Otherwise, version 1.0 credentials are returned.
     *
     * The default setting is *optional* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-infrastructureconfiguration-instancemetadataoptions.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions-httptokens
     */
    readonly httpTokens?: string;
  }
}

/**
 * Properties for defining a `CfnInfrastructureConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html
 */
export interface CfnInfrastructureConfigurationProps {
  /**
   * The description of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-description
   */
  readonly description?: string;

  /**
   * The instance metadata option settings for the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancemetadataoptions
   */
  readonly instanceMetadataOptions?: CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable;

  /**
   * The instance profile of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instanceprofilename
   */
  readonly instanceProfileName: string;

  /**
   * The instance types of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-instancetypes
   */
  readonly instanceTypes?: Array<string>;

  /**
   * The Amazon EC2 key pair of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-keypair
   */
  readonly keyPair?: string;

  /**
   * The logging configuration defines where Image Builder uploads your logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-logging
   */
  readonly logging?: cdk.IResolvable | CfnInfrastructureConfiguration.LoggingProperty;

  /**
   * The name of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-name
   */
  readonly name: string;

  /**
   * The tags attached to the resource created by Image Builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-resourcetags
   */
  readonly resourceTags?: cdk.IResolvable | Record<string, string>;

  /**
   * The security group IDs of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the SNS topic for the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-snstopicarn
   */
  readonly snsTopicArn?: string;

  /**
   * The subnet ID of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-subnetid
   */
  readonly subnetId?: string;

  /**
   * The tags of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The terminate instance on failure configuration of the infrastructure configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-infrastructureconfiguration.html#cfn-imagebuilder-infrastructureconfiguration-terminateinstanceonfailure
   */
  readonly terminateInstanceOnFailure?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `S3LogsProperty`
 *
 * @param properties - the TypeScript properties of a `S3LogsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInfrastructureConfigurationS3LogsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.validateString)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3KeyPrefix", cdk.validateString)(properties.s3KeyPrefix));
  return errors.wrap("supplied properties not correct for \"S3LogsProperty\"");
}

// @ts-ignore TS6133
function convertCfnInfrastructureConfigurationS3LogsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInfrastructureConfigurationS3LogsPropertyValidator(properties).assertSuccess();
  return {
    "S3BucketName": cdk.stringToCloudFormation(properties.s3BucketName),
    "S3KeyPrefix": cdk.stringToCloudFormation(properties.s3KeyPrefix)
  };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationS3LogsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInfrastructureConfiguration.S3LogsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfiguration.S3LogsProperty>();
  ret.addPropertyResult("s3BucketName", "S3BucketName", (properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined));
  ret.addPropertyResult("s3KeyPrefix", "S3KeyPrefix", (properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInfrastructureConfigurationLoggingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Logs", CfnInfrastructureConfigurationS3LogsPropertyValidator)(properties.s3Logs));
  return errors.wrap("supplied properties not correct for \"LoggingProperty\"");
}

// @ts-ignore TS6133
function convertCfnInfrastructureConfigurationLoggingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInfrastructureConfigurationLoggingPropertyValidator(properties).assertSuccess();
  return {
    "S3Logs": convertCfnInfrastructureConfigurationS3LogsPropertyToCloudFormation(properties.s3Logs)
  };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInfrastructureConfiguration.LoggingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfiguration.LoggingProperty>();
  ret.addPropertyResult("s3Logs", "S3Logs", (properties.S3Logs != null ? CfnInfrastructureConfigurationS3LogsPropertyFromCloudFormation(properties.S3Logs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InstanceMetadataOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `InstanceMetadataOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInfrastructureConfigurationInstanceMetadataOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpPutResponseHopLimit", cdk.validateNumber)(properties.httpPutResponseHopLimit));
  errors.collect(cdk.propertyValidator("httpTokens", cdk.validateString)(properties.httpTokens));
  return errors.wrap("supplied properties not correct for \"InstanceMetadataOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnInfrastructureConfigurationInstanceMetadataOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInfrastructureConfigurationInstanceMetadataOptionsPropertyValidator(properties).assertSuccess();
  return {
    "HttpPutResponseHopLimit": cdk.numberToCloudFormation(properties.httpPutResponseHopLimit),
    "HttpTokens": cdk.stringToCloudFormation(properties.httpTokens)
  };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationInstanceMetadataOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfiguration.InstanceMetadataOptionsProperty>();
  ret.addPropertyResult("httpPutResponseHopLimit", "HttpPutResponseHopLimit", (properties.HttpPutResponseHopLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.HttpPutResponseHopLimit) : undefined));
  ret.addPropertyResult("httpTokens", "HttpTokens", (properties.HttpTokens != null ? cfn_parse.FromCloudFormation.getString(properties.HttpTokens) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInfrastructureConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnInfrastructureConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInfrastructureConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceMetadataOptions", CfnInfrastructureConfigurationInstanceMetadataOptionsPropertyValidator)(properties.instanceMetadataOptions));
  errors.collect(cdk.propertyValidator("instanceProfileName", cdk.requiredValidator)(properties.instanceProfileName));
  errors.collect(cdk.propertyValidator("instanceProfileName", cdk.validateString)(properties.instanceProfileName));
  errors.collect(cdk.propertyValidator("instanceTypes", cdk.listValidator(cdk.validateString))(properties.instanceTypes));
  errors.collect(cdk.propertyValidator("keyPair", cdk.validateString)(properties.keyPair));
  errors.collect(cdk.propertyValidator("logging", CfnInfrastructureConfigurationLoggingPropertyValidator)(properties.logging));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resourceTags", cdk.hashValidator(cdk.validateString))(properties.resourceTags));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("terminateInstanceOnFailure", cdk.validateBoolean)(properties.terminateInstanceOnFailure));
  return errors.wrap("supplied properties not correct for \"CfnInfrastructureConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnInfrastructureConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInfrastructureConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceMetadataOptions": convertCfnInfrastructureConfigurationInstanceMetadataOptionsPropertyToCloudFormation(properties.instanceMetadataOptions),
    "InstanceProfileName": cdk.stringToCloudFormation(properties.instanceProfileName),
    "InstanceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceTypes),
    "KeyPair": cdk.stringToCloudFormation(properties.keyPair),
    "Logging": convertCfnInfrastructureConfigurationLoggingPropertyToCloudFormation(properties.logging),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResourceTags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.resourceTags),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SnsTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "TerminateInstanceOnFailure": cdk.booleanToCloudFormation(properties.terminateInstanceOnFailure)
  };
}

// @ts-ignore TS6133
function CfnInfrastructureConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInfrastructureConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInfrastructureConfigurationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceMetadataOptions", "InstanceMetadataOptions", (properties.InstanceMetadataOptions != null ? CfnInfrastructureConfigurationInstanceMetadataOptionsPropertyFromCloudFormation(properties.InstanceMetadataOptions) : undefined));
  ret.addPropertyResult("instanceProfileName", "InstanceProfileName", (properties.InstanceProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceProfileName) : undefined));
  ret.addPropertyResult("instanceTypes", "InstanceTypes", (properties.InstanceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InstanceTypes) : undefined));
  ret.addPropertyResult("keyPair", "KeyPair", (properties.KeyPair != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPair) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? CfnInfrastructureConfigurationLoggingPropertyFromCloudFormation(properties.Logging) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resourceTags", "ResourceTags", (properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResourceTags) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("terminateInstanceOnFailure", "TerminateInstanceOnFailure", (properties.TerminateInstanceOnFailure != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TerminateInstanceOnFailure) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The configuration details for a lifecycle policy resource.
 *
 * @cloudformationResource AWS::ImageBuilder::LifecyclePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html
 */
export class CfnLifecyclePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::LifecyclePolicy";

  /**
   * Build a CfnLifecyclePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLifecyclePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLifecyclePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLifecyclePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the lifecycle policy resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Optional description for the lifecycle policy.
   */
  public description?: string;

  /**
   * The name or Amazon Resource Name (ARN) of the IAM role that Image Builder uses to run the lifecycle policy.
   */
  public executionRole: string;

  /**
   * The name of the lifecycle policy.
   */
  public name: string;

  /**
   * The configuration details for a lifecycle policy resource.
   */
  public policyDetails: Array<cdk.IResolvable | CfnLifecyclePolicy.PolicyDetailProperty> | cdk.IResolvable;

  /**
   * Resource selection criteria used to run the lifecycle policy.
   */
  public resourceSelection: cdk.IResolvable | CfnLifecyclePolicy.ResourceSelectionProperty;

  /**
   * The type of resources the lifecycle policy targets.
   */
  public resourceType: string;

  /**
   * Indicates whether the lifecycle policy resource is enabled.
   */
  public status?: string;

  /**
   * To help manage your lifecycle policy resources, you can assign your own metadata to each resource in the form of tags.
   */
  public tags?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLifecyclePolicyProps) {
    super(scope, id, {
      "type": CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "executionRole", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "policyDetails", this);
    cdk.requireProperty(props, "resourceSelection", this);
    cdk.requireProperty(props, "resourceType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.executionRole = props.executionRole;
    this.name = props.name;
    this.policyDetails = props.policyDetails;
    this.resourceSelection = props.resourceSelection;
    this.resourceType = props.resourceType;
    this.status = props.status;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "executionRole": this.executionRole,
      "name": this.name,
      "policyDetails": this.policyDetails,
      "resourceSelection": this.resourceSelection,
      "resourceType": this.resourceType,
      "status": this.status,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLifecyclePolicyPropsToCloudFormation(props);
  }
}

export namespace CfnLifecyclePolicy {
  /**
   * The policy detail of the lifecycle policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-policydetail.html
   */
  export interface PolicyDetailProperty {
    /**
     * The action of the policy detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-policydetail.html#cfn-imagebuilder-lifecyclepolicy-policydetail-action
     */
    readonly action: CfnLifecyclePolicy.ActionProperty | cdk.IResolvable;

    /**
     * The exclusion rules to apply of the policy detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-policydetail.html#cfn-imagebuilder-lifecyclepolicy-policydetail-exclusionrules
     */
    readonly exclusionRules?: CfnLifecyclePolicy.ExclusionRulesProperty | cdk.IResolvable;

    /**
     * The filters to apply of the policy detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-policydetail.html#cfn-imagebuilder-lifecyclepolicy-policydetail-filter
     */
    readonly filter: CfnLifecyclePolicy.FilterProperty | cdk.IResolvable;
  }

  /**
   * The action of the policy detail.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-action.html
   */
  export interface ActionProperty {
    /**
     * The included resources of the policy detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-action.html#cfn-imagebuilder-lifecyclepolicy-action-includeresources
     */
    readonly includeResources?: CfnLifecyclePolicy.IncludeResourcesProperty | cdk.IResolvable;

    /**
     * The action type of the policy detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-action.html#cfn-imagebuilder-lifecyclepolicy-action-type
     */
    readonly type: string;
  }

  /**
   * The included resources of the policy detail.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-includeresources.html
   */
  export interface IncludeResourcesProperty {
    /**
     * Use to configure lifecycle actions on AMIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-includeresources.html#cfn-imagebuilder-lifecyclepolicy-includeresources-amis
     */
    readonly amis?: boolean | cdk.IResolvable;

    /**
     * Use to configure lifecycle actions on containers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-includeresources.html#cfn-imagebuilder-lifecyclepolicy-includeresources-containers
     */
    readonly containers?: boolean | cdk.IResolvable;

    /**
     * Use to configure lifecycle actions on snapshots.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-includeresources.html#cfn-imagebuilder-lifecyclepolicy-includeresources-snapshots
     */
    readonly snapshots?: boolean | cdk.IResolvable;
  }

  /**
   * A filter name and value pair that is used to return a more specific list of results from a list operation.
   *
   * Filters can be used to match a set of resources by specific criteria, such as tags, attributes, or IDs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-filter.html
   */
  export interface FilterProperty {
    /**
     * The minimum number of Image Builder resources to retain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-filter.html#cfn-imagebuilder-lifecyclepolicy-filter-retainatleast
     */
    readonly retainAtLeast?: number;

    /**
     * The filter type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-filter.html#cfn-imagebuilder-lifecyclepolicy-filter-type
     */
    readonly type: string;

    /**
     * A time unit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-filter.html#cfn-imagebuilder-lifecyclepolicy-filter-unit
     */
    readonly unit?: string;

    /**
     * The filter value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-filter.html#cfn-imagebuilder-lifecyclepolicy-filter-value
     */
    readonly value: number;
  }

  /**
   * The exclusion rules to apply of the policy detail.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-exclusionrules.html
   */
  export interface ExclusionRulesProperty {
    /**
     * The AMI exclusion rules for the policy detail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-exclusionrules.html#cfn-imagebuilder-lifecyclepolicy-exclusionrules-amis
     */
    readonly amis?: CfnLifecyclePolicy.AmiExclusionRulesProperty | cdk.IResolvable;

    /**
     * The Image Builder tags to filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-exclusionrules.html#cfn-imagebuilder-lifecyclepolicy-exclusionrules-tagmap
     */
    readonly tagMap?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The AMI exclusion rules for the policy detail.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-amiexclusionrules.html
   */
  export interface AmiExclusionRulesProperty {
    /**
     * Use to apply lifecycle policy actions on whether the AMI is public.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-amiexclusionrules.html#cfn-imagebuilder-lifecyclepolicy-amiexclusionrules-ispublic
     */
    readonly isPublic?: boolean | cdk.IResolvable;

    /**
     * The last launched time of a resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-amiexclusionrules.html#cfn-imagebuilder-lifecyclepolicy-amiexclusionrules-lastlaunched
     */
    readonly lastLaunched?: cdk.IResolvable | CfnLifecyclePolicy.LastLaunchedProperty;

    /**
     * Use to apply lifecycle policy actions on AMIs distributed to a set of regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-amiexclusionrules.html#cfn-imagebuilder-lifecyclepolicy-amiexclusionrules-regions
     */
    readonly regions?: Array<string>;

    /**
     * Use to apply lifecycle policy actions on AMIs shared with a set of regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-amiexclusionrules.html#cfn-imagebuilder-lifecyclepolicy-amiexclusionrules-sharedaccounts
     */
    readonly sharedAccounts?: Array<string>;

    /**
     * The AMIs to select by tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-amiexclusionrules.html#cfn-imagebuilder-lifecyclepolicy-amiexclusionrules-tagmap
     */
    readonly tagMap?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The last launched time of a resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-lastlaunched.html
   */
  export interface LastLaunchedProperty {
    /**
     * A time unit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-lastlaunched.html#cfn-imagebuilder-lifecyclepolicy-lastlaunched-unit
     */
    readonly unit: string;

    /**
     * The last launched value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-lastlaunched.html#cfn-imagebuilder-lifecyclepolicy-lastlaunched-value
     */
    readonly value: number;
  }

  /**
   * The resource selection for the lifecycle policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-resourceselection.html
   */
  export interface ResourceSelectionProperty {
    /**
     * The recipes to select.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-resourceselection.html#cfn-imagebuilder-lifecyclepolicy-resourceselection-recipes
     */
    readonly recipes?: Array<cdk.IResolvable | CfnLifecyclePolicy.RecipeSelectionProperty> | cdk.IResolvable;

    /**
     * The Image Builder resources to select by tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-resourceselection.html#cfn-imagebuilder-lifecyclepolicy-resourceselection-tagmap
     */
    readonly tagMap?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The recipe to apply the lifecycle policy for.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-recipeselection.html
   */
  export interface RecipeSelectionProperty {
    /**
     * The recipe name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-recipeselection.html#cfn-imagebuilder-lifecyclepolicy-recipeselection-name
     */
    readonly name: string;

    /**
     * The recipe version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-lifecyclepolicy-recipeselection.html#cfn-imagebuilder-lifecyclepolicy-recipeselection-semanticversion
     */
    readonly semanticVersion: string;
  }
}

/**
 * Properties for defining a `CfnLifecyclePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html
 */
export interface CfnLifecyclePolicyProps {
  /**
   * Optional description for the lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-description
   */
  readonly description?: string;

  /**
   * The name or Amazon Resource Name (ARN) of the IAM role that Image Builder uses to run the lifecycle policy.
   *
   * This is a custom role that you create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-executionrole
   */
  readonly executionRole: string;

  /**
   * The name of the lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-name
   */
  readonly name: string;

  /**
   * The configuration details for a lifecycle policy resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-policydetails
   */
  readonly policyDetails: Array<cdk.IResolvable | CfnLifecyclePolicy.PolicyDetailProperty> | cdk.IResolvable;

  /**
   * Resource selection criteria used to run the lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-resourceselection
   */
  readonly resourceSelection: cdk.IResolvable | CfnLifecyclePolicy.ResourceSelectionProperty;

  /**
   * The type of resources the lifecycle policy targets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-resourcetype
   */
  readonly resourceType: string;

  /**
   * Indicates whether the lifecycle policy resource is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-status
   */
  readonly status?: string;

  /**
   * To help manage your lifecycle policy resources, you can assign your own metadata to each resource in the form of tags.
   *
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-lifecyclepolicy.html#cfn-imagebuilder-lifecyclepolicy-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `IncludeResourcesProperty`
 *
 * @param properties - the TypeScript properties of a `IncludeResourcesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyIncludeResourcesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amis", cdk.validateBoolean)(properties.amis));
  errors.collect(cdk.propertyValidator("containers", cdk.validateBoolean)(properties.containers));
  errors.collect(cdk.propertyValidator("snapshots", cdk.validateBoolean)(properties.snapshots));
  return errors.wrap("supplied properties not correct for \"IncludeResourcesProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyIncludeResourcesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyIncludeResourcesPropertyValidator(properties).assertSuccess();
  return {
    "Amis": cdk.booleanToCloudFormation(properties.amis),
    "Containers": cdk.booleanToCloudFormation(properties.containers),
    "Snapshots": cdk.booleanToCloudFormation(properties.snapshots)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyIncludeResourcesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.IncludeResourcesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.IncludeResourcesProperty>();
  ret.addPropertyResult("amis", "Amis", (properties.Amis != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Amis) : undefined));
  ret.addPropertyResult("containers", "Containers", (properties.Containers != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Containers) : undefined));
  ret.addPropertyResult("snapshots", "Snapshots", (properties.Snapshots != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Snapshots) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("includeResources", CfnLifecyclePolicyIncludeResourcesPropertyValidator)(properties.includeResources));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyActionPropertyValidator(properties).assertSuccess();
  return {
    "IncludeResources": convertCfnLifecyclePolicyIncludeResourcesPropertyToCloudFormation(properties.includeResources),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ActionProperty>();
  ret.addPropertyResult("includeResources", "IncludeResources", (properties.IncludeResources != null ? CfnLifecyclePolicyIncludeResourcesPropertyFromCloudFormation(properties.IncludeResources) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("retainAtLeast", cdk.validateNumber)(properties.retainAtLeast));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyFilterPropertyValidator(properties).assertSuccess();
  return {
    "RetainAtLeast": cdk.numberToCloudFormation(properties.retainAtLeast),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.FilterProperty>();
  ret.addPropertyResult("retainAtLeast", "RetainAtLeast", (properties.RetainAtLeast != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetainAtLeast) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LastLaunchedProperty`
 *
 * @param properties - the TypeScript properties of a `LastLaunchedProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyLastLaunchedPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"LastLaunchedProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyLastLaunchedPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyLastLaunchedPropertyValidator(properties).assertSuccess();
  return {
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyLastLaunchedPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.LastLaunchedProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.LastLaunchedProperty>();
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmiExclusionRulesProperty`
 *
 * @param properties - the TypeScript properties of a `AmiExclusionRulesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyAmiExclusionRulesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isPublic", cdk.validateBoolean)(properties.isPublic));
  errors.collect(cdk.propertyValidator("lastLaunched", CfnLifecyclePolicyLastLaunchedPropertyValidator)(properties.lastLaunched));
  errors.collect(cdk.propertyValidator("regions", cdk.listValidator(cdk.validateString))(properties.regions));
  errors.collect(cdk.propertyValidator("sharedAccounts", cdk.listValidator(cdk.validateString))(properties.sharedAccounts));
  errors.collect(cdk.propertyValidator("tagMap", cdk.hashValidator(cdk.validateString))(properties.tagMap));
  return errors.wrap("supplied properties not correct for \"AmiExclusionRulesProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyAmiExclusionRulesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyAmiExclusionRulesPropertyValidator(properties).assertSuccess();
  return {
    "IsPublic": cdk.booleanToCloudFormation(properties.isPublic),
    "LastLaunched": convertCfnLifecyclePolicyLastLaunchedPropertyToCloudFormation(properties.lastLaunched),
    "Regions": cdk.listMapper(cdk.stringToCloudFormation)(properties.regions),
    "SharedAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.sharedAccounts),
    "TagMap": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tagMap)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyAmiExclusionRulesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.AmiExclusionRulesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.AmiExclusionRulesProperty>();
  ret.addPropertyResult("isPublic", "IsPublic", (properties.IsPublic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsPublic) : undefined));
  ret.addPropertyResult("lastLaunched", "LastLaunched", (properties.LastLaunched != null ? CfnLifecyclePolicyLastLaunchedPropertyFromCloudFormation(properties.LastLaunched) : undefined));
  ret.addPropertyResult("regions", "Regions", (properties.Regions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Regions) : undefined));
  ret.addPropertyResult("sharedAccounts", "SharedAccounts", (properties.SharedAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SharedAccounts) : undefined));
  ret.addPropertyResult("tagMap", "TagMap", (properties.TagMap != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.TagMap) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExclusionRulesProperty`
 *
 * @param properties - the TypeScript properties of a `ExclusionRulesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyExclusionRulesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amis", CfnLifecyclePolicyAmiExclusionRulesPropertyValidator)(properties.amis));
  errors.collect(cdk.propertyValidator("tagMap", cdk.hashValidator(cdk.validateString))(properties.tagMap));
  return errors.wrap("supplied properties not correct for \"ExclusionRulesProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyExclusionRulesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyExclusionRulesPropertyValidator(properties).assertSuccess();
  return {
    "Amis": convertCfnLifecyclePolicyAmiExclusionRulesPropertyToCloudFormation(properties.amis),
    "TagMap": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tagMap)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyExclusionRulesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ExclusionRulesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ExclusionRulesProperty>();
  ret.addPropertyResult("amis", "Amis", (properties.Amis != null ? CfnLifecyclePolicyAmiExclusionRulesPropertyFromCloudFormation(properties.Amis) : undefined));
  ret.addPropertyResult("tagMap", "TagMap", (properties.TagMap != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.TagMap) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PolicyDetailProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyDetailProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyPolicyDetailPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnLifecyclePolicyActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("exclusionRules", CfnLifecyclePolicyExclusionRulesPropertyValidator)(properties.exclusionRules));
  errors.collect(cdk.propertyValidator("filter", cdk.requiredValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("filter", CfnLifecyclePolicyFilterPropertyValidator)(properties.filter));
  return errors.wrap("supplied properties not correct for \"PolicyDetailProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyPolicyDetailPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyPolicyDetailPropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnLifecyclePolicyActionPropertyToCloudFormation(properties.action),
    "ExclusionRules": convertCfnLifecyclePolicyExclusionRulesPropertyToCloudFormation(properties.exclusionRules),
    "Filter": convertCfnLifecyclePolicyFilterPropertyToCloudFormation(properties.filter)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyPolicyDetailPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.PolicyDetailProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.PolicyDetailProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnLifecyclePolicyActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("exclusionRules", "ExclusionRules", (properties.ExclusionRules != null ? CfnLifecyclePolicyExclusionRulesPropertyFromCloudFormation(properties.ExclusionRules) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnLifecyclePolicyFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecipeSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `RecipeSelectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyRecipeSelectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("semanticVersion", cdk.requiredValidator)(properties.semanticVersion));
  errors.collect(cdk.propertyValidator("semanticVersion", cdk.validateString)(properties.semanticVersion));
  return errors.wrap("supplied properties not correct for \"RecipeSelectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyRecipeSelectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyRecipeSelectionPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SemanticVersion": cdk.stringToCloudFormation(properties.semanticVersion)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyRecipeSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.RecipeSelectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.RecipeSelectionProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("semanticVersion", "SemanticVersion", (properties.SemanticVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SemanticVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceSelectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyResourceSelectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recipes", cdk.listValidator(CfnLifecyclePolicyRecipeSelectionPropertyValidator))(properties.recipes));
  errors.collect(cdk.propertyValidator("tagMap", cdk.hashValidator(cdk.validateString))(properties.tagMap));
  return errors.wrap("supplied properties not correct for \"ResourceSelectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyResourceSelectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyResourceSelectionPropertyValidator(properties).assertSuccess();
  return {
    "Recipes": cdk.listMapper(convertCfnLifecyclePolicyRecipeSelectionPropertyToCloudFormation)(properties.recipes),
    "TagMap": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tagMap)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyResourceSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.ResourceSelectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ResourceSelectionProperty>();
  ret.addPropertyResult("recipes", "Recipes", (properties.Recipes != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyRecipeSelectionPropertyFromCloudFormation)(properties.Recipes) : undefined));
  ret.addPropertyResult("tagMap", "TagMap", (properties.TagMap != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.TagMap) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLifecyclePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnLifecyclePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("executionRole", cdk.requiredValidator)(properties.executionRole));
  errors.collect(cdk.propertyValidator("executionRole", cdk.validateString)(properties.executionRole));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policyDetails", cdk.requiredValidator)(properties.policyDetails));
  errors.collect(cdk.propertyValidator("policyDetails", cdk.listValidator(CfnLifecyclePolicyPolicyDetailPropertyValidator))(properties.policyDetails));
  errors.collect(cdk.propertyValidator("resourceSelection", cdk.requiredValidator)(properties.resourceSelection));
  errors.collect(cdk.propertyValidator("resourceSelection", CfnLifecyclePolicyResourceSelectionPropertyValidator)(properties.resourceSelection));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLifecyclePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExecutionRole": cdk.stringToCloudFormation(properties.executionRole),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PolicyDetails": cdk.listMapper(convertCfnLifecyclePolicyPolicyDetailPropertyToCloudFormation)(properties.policyDetails),
    "ResourceSelection": convertCfnLifecyclePolicyResourceSelectionPropertyToCloudFormation(properties.resourceSelection),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicyProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("executionRole", "ExecutionRole", (properties.ExecutionRole != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRole) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policyDetails", "PolicyDetails", (properties.PolicyDetails != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyPolicyDetailPropertyFromCloudFormation)(properties.PolicyDetails) : undefined));
  ret.addPropertyResult("resourceSelection", "ResourceSelection", (properties.ResourceSelection != null ? CfnLifecyclePolicyResourceSelectionPropertyFromCloudFormation(properties.ResourceSelection) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a new workflow or a new version of an existing workflow.
 *
 * @cloudformationResource AWS::ImageBuilder::Workflow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html
 */
export class CfnWorkflow extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ImageBuilder::Workflow";

  /**
   * Build a CfnWorkflow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkflow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkflowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkflow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the workflow resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Describes what change has been made in this version of the workflow, or what makes this version different from other versions of the workflow.
   */
  public changeDescription?: string;

  /**
   * Contains the YAML document content for the workflow.
   */
  public data?: string;

  /**
   * The description of the workflow.
   */
  public description?: string;

  /**
   * The KMS key identifier used to encrypt the workflow resource.
   */
  public kmsKeyId?: string;

  /**
   * The name of the workflow resource.
   */
  public name: string;

  /**
   * The tags that apply to the workflow resource.
   */
  public tags?: Record<string, string>;

  /**
   * Specifies the image creation stage that the workflow applies to.
   */
  public type: string;

  /**
   * The uri of the workflow.
   */
  public uri?: string;

  /**
   * The workflow resource version.
   */
  public version: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkflowProps) {
    super(scope, id, {
      "type": CfnWorkflow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);
    cdk.requireProperty(props, "version", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.changeDescription = props.changeDescription;
    this.data = props.data;
    this.description = props.description;
    this.kmsKeyId = props.kmsKeyId;
    this.name = props.name;
    this.tags = props.tags;
    this.type = props.type;
    this.uri = props.uri;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "changeDescription": this.changeDescription,
      "data": this.data,
      "description": this.description,
      "kmsKeyId": this.kmsKeyId,
      "name": this.name,
      "tags": this.tags,
      "type": this.type,
      "uri": this.uri,
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkflow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkflowPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWorkflow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html
 */
export interface CfnWorkflowProps {
  /**
   * Describes what change has been made in this version of the workflow, or what makes this version different from other versions of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-changedescription
   */
  readonly changeDescription?: string;

  /**
   * Contains the YAML document content for the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-data
   */
  readonly data?: string;

  /**
   * The description of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-description
   */
  readonly description?: string;

  /**
   * The KMS key identifier used to encrypt the workflow resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The name of the workflow resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-name
   */
  readonly name: string;

  /**
   * The tags that apply to the workflow resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * Specifies the image creation stage that the workflow applies to.
   *
   * Image Builder currently supports build and test workflows.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-type
   */
  readonly type: string;

  /**
   * The uri of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-uri
   */
  readonly uri?: string;

  /**
   * The workflow resource version.
   *
   * Workflow resources are immutable. To make a change, you can clone a workflow or create a new version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-imagebuilder-workflow.html#cfn-imagebuilder-workflow-version
   */
  readonly version: string;
}

/**
 * Determine whether the given properties match those of a `CfnWorkflowProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkflowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("changeDescription", cdk.validateString)(properties.changeDescription));
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnWorkflowProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowPropsValidator(properties).assertSuccess();
  return {
    "ChangeDescription": cdk.stringToCloudFormation(properties.changeDescription),
    "Data": cdk.stringToCloudFormation(properties.data),
    "Description": cdk.stringToCloudFormation(properties.description),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Uri": cdk.stringToCloudFormation(properties.uri),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnWorkflowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflowProps>();
  ret.addPropertyResult("changeDescription", "ChangeDescription", (properties.ChangeDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ChangeDescription) : undefined));
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}