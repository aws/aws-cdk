/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * This resource creates an app block.
 *
 * App blocks store details about the virtual hard disk that contains the files for the application in an S3 bucket. It also stores the setup script with details about how to mount the virtual hard disk. App blocks are only supported for Elastic fleets.
 *
 * @cloudformationResource AWS::AppStream::AppBlock
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html
 */
export class CfnAppBlock extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::AppBlock";

  /**
   * Build a CfnAppBlock from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAppBlock {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAppBlockPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAppBlock(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the app block.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time when the app block was created.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: string;

  /**
   * The description of the app block.
   */
  public description?: string;

  /**
   * The display name of the app block.
   */
  public displayName?: string;

  /**
   * The name of the app block.
   */
  public name: string;

  /**
   * The packaging type of the app block.
   */
  public packagingType?: string;

  /**
   * The post setup script details of the app block.
   */
  public postSetupScriptDetails?: cdk.IResolvable | CfnAppBlock.ScriptDetailsProperty;

  /**
   * The setup script details of the app block.
   */
  public setupScriptDetails?: cdk.IResolvable | CfnAppBlock.ScriptDetailsProperty;

  /**
   * The source S3 location of the app block.
   */
  public sourceS3Location: cdk.IResolvable | CfnAppBlock.S3LocationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of the app block.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAppBlockProps) {
    super(scope, id, {
      "type": CfnAppBlock.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "sourceS3Location", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedTime = cdk.Token.asString(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.displayName = props.displayName;
    this.name = props.name;
    this.packagingType = props.packagingType;
    this.postSetupScriptDetails = props.postSetupScriptDetails;
    this.setupScriptDetails = props.setupScriptDetails;
    this.sourceS3Location = props.sourceS3Location;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppStream::AppBlock", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "displayName": this.displayName,
      "name": this.name,
      "packagingType": this.packagingType,
      "postSetupScriptDetails": this.postSetupScriptDetails,
      "setupScriptDetails": this.setupScriptDetails,
      "sourceS3Location": this.sourceS3Location,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAppBlock.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAppBlockPropsToCloudFormation(props);
  }
}

export namespace CfnAppBlock {
  /**
   * The details of the script.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-scriptdetails.html
   */
  export interface ScriptDetailsProperty {
    /**
     * The parameters used in the run path for the script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-scriptdetails.html#cfn-appstream-appblock-scriptdetails-executableparameters
     */
    readonly executableParameters?: string;

    /**
     * The run path for the script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-scriptdetails.html#cfn-appstream-appblock-scriptdetails-executablepath
     */
    readonly executablePath: string;

    /**
     * The S3 object location of the script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-scriptdetails.html#cfn-appstream-appblock-scriptdetails-scripts3location
     */
    readonly scriptS3Location: cdk.IResolvable | CfnAppBlock.S3LocationProperty;

    /**
     * The run timeout, in seconds, for the script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-scriptdetails.html#cfn-appstream-appblock-scriptdetails-timeoutinseconds
     */
    readonly timeoutInSeconds: number;
  }

  /**
   * The S3 location of the app block.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The S3 bucket of the app block.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-s3location.html#cfn-appstream-appblock-s3location-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The S3 key of the S3 object of the virtual hard disk.
     *
     * This is required when it's used by `SetupScriptDetails` and `PostSetupScriptDetails` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblock-s3location.html#cfn-appstream-appblock-s3location-s3key
     */
    readonly s3Key?: string;
  }
}

/**
 * Properties for defining a `CfnAppBlock`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html
 */
export interface CfnAppBlockProps {
  /**
   * The description of the app block.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-description
   */
  readonly description?: string;

  /**
   * The display name of the app block.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-displayname
   */
  readonly displayName?: string;

  /**
   * The name of the app block.
   *
   * *Pattern* : `^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,100}$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-name
   */
  readonly name: string;

  /**
   * The packaging type of the app block.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-packagingtype
   */
  readonly packagingType?: string;

  /**
   * The post setup script details of the app block.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-postsetupscriptdetails
   */
  readonly postSetupScriptDetails?: cdk.IResolvable | CfnAppBlock.ScriptDetailsProperty;

  /**
   * The setup script details of the app block.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-setupscriptdetails
   */
  readonly setupScriptDetails?: cdk.IResolvable | CfnAppBlock.ScriptDetailsProperty;

  /**
   * The source S3 location of the app block.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-sources3location
   */
  readonly sourceS3Location: cdk.IResolvable | CfnAppBlock.S3LocationProperty;

  /**
   * The tags of the app block.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblock.html#cfn-appstream-appblock-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppBlockS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppBlockS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppBlockS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnAppBlockS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAppBlock.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppBlock.S3LocationProperty>();
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScriptDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `ScriptDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppBlockScriptDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executableParameters", cdk.validateString)(properties.executableParameters));
  errors.collect(cdk.propertyValidator("executablePath", cdk.requiredValidator)(properties.executablePath));
  errors.collect(cdk.propertyValidator("executablePath", cdk.validateString)(properties.executablePath));
  errors.collect(cdk.propertyValidator("scriptS3Location", cdk.requiredValidator)(properties.scriptS3Location));
  errors.collect(cdk.propertyValidator("scriptS3Location", CfnAppBlockS3LocationPropertyValidator)(properties.scriptS3Location));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.requiredValidator)(properties.timeoutInSeconds));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  return errors.wrap("supplied properties not correct for \"ScriptDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppBlockScriptDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppBlockScriptDetailsPropertyValidator(properties).assertSuccess();
  return {
    "ExecutableParameters": cdk.stringToCloudFormation(properties.executableParameters),
    "ExecutablePath": cdk.stringToCloudFormation(properties.executablePath),
    "ScriptS3Location": convertCfnAppBlockS3LocationPropertyToCloudFormation(properties.scriptS3Location),
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds)
  };
}

// @ts-ignore TS6133
function CfnAppBlockScriptDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAppBlock.ScriptDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppBlock.ScriptDetailsProperty>();
  ret.addPropertyResult("executableParameters", "ExecutableParameters", (properties.ExecutableParameters != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutableParameters) : undefined));
  ret.addPropertyResult("executablePath", "ExecutablePath", (properties.ExecutablePath != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutablePath) : undefined));
  ret.addPropertyResult("scriptS3Location", "ScriptS3Location", (properties.ScriptS3Location != null ? CfnAppBlockS3LocationPropertyFromCloudFormation(properties.ScriptS3Location) : undefined));
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAppBlockProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppBlockProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppBlockPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("packagingType", cdk.validateString)(properties.packagingType));
  errors.collect(cdk.propertyValidator("postSetupScriptDetails", CfnAppBlockScriptDetailsPropertyValidator)(properties.postSetupScriptDetails));
  errors.collect(cdk.propertyValidator("setupScriptDetails", CfnAppBlockScriptDetailsPropertyValidator)(properties.setupScriptDetails));
  errors.collect(cdk.propertyValidator("sourceS3Location", cdk.requiredValidator)(properties.sourceS3Location));
  errors.collect(cdk.propertyValidator("sourceS3Location", CfnAppBlockS3LocationPropertyValidator)(properties.sourceS3Location));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAppBlockProps\"");
}

// @ts-ignore TS6133
function convertCfnAppBlockPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppBlockPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PackagingType": cdk.stringToCloudFormation(properties.packagingType),
    "PostSetupScriptDetails": convertCfnAppBlockScriptDetailsPropertyToCloudFormation(properties.postSetupScriptDetails),
    "SetupScriptDetails": convertCfnAppBlockScriptDetailsPropertyToCloudFormation(properties.setupScriptDetails),
    "SourceS3Location": convertCfnAppBlockS3LocationPropertyToCloudFormation(properties.sourceS3Location),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAppBlockPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppBlockProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppBlockProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("packagingType", "PackagingType", (properties.PackagingType != null ? cfn_parse.FromCloudFormation.getString(properties.PackagingType) : undefined));
  ret.addPropertyResult("postSetupScriptDetails", "PostSetupScriptDetails", (properties.PostSetupScriptDetails != null ? CfnAppBlockScriptDetailsPropertyFromCloudFormation(properties.PostSetupScriptDetails) : undefined));
  ret.addPropertyResult("setupScriptDetails", "SetupScriptDetails", (properties.SetupScriptDetails != null ? CfnAppBlockScriptDetailsPropertyFromCloudFormation(properties.SetupScriptDetails) : undefined));
  ret.addPropertyResult("sourceS3Location", "SourceS3Location", (properties.SourceS3Location != null ? CfnAppBlockS3LocationPropertyFromCloudFormation(properties.SourceS3Location) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an app block builder.
 *
 * @cloudformationResource AWS::AppStream::AppBlockBuilder
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html
 */
export class CfnAppBlockBuilder extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::AppBlockBuilder";

  /**
   * Build a CfnAppBlockBuilder from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAppBlockBuilder {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAppBlockBuilderPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAppBlockBuilder(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the app block builder.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time when the app block builder was created.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: string;

  /**
   * The access endpoints of the app block builder.
   */
  public accessEndpoints?: Array<CfnAppBlockBuilder.AccessEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The ARN of the app block.
   */
  public appBlockArns?: Array<string>;

  /**
   * The description of the app block builder.
   */
  public description?: string;

  /**
   * The display name of the app block builder.
   */
  public displayName?: string;

  /**
   * Indicates whether default internet access is enabled for the app block builder.
   */
  public enableDefaultInternetAccess?: boolean | cdk.IResolvable;

  /**
   * The ARN of the IAM role that is applied to the app block builder.
   */
  public iamRoleArn?: string;

  /**
   * The instance type of the app block builder.
   */
  public instanceType: string;

  /**
   * The name of the app block builder.
   */
  public name: string;

  /**
   * The platform of the app block builder.
   */
  public platform: string;

  /**
   * The tags of the app block builder.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The VPC configuration for the app block builder.
   */
  public vpcConfig: cdk.IResolvable | CfnAppBlockBuilder.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAppBlockBuilderProps) {
    super(scope, id, {
      "type": CfnAppBlockBuilder.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceType", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "platform", this);
    cdk.requireProperty(props, "vpcConfig", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedTime = cdk.Token.asString(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.STRING));
    this.accessEndpoints = props.accessEndpoints;
    this.appBlockArns = props.appBlockArns;
    this.description = props.description;
    this.displayName = props.displayName;
    this.enableDefaultInternetAccess = props.enableDefaultInternetAccess;
    this.iamRoleArn = props.iamRoleArn;
    this.instanceType = props.instanceType;
    this.name = props.name;
    this.platform = props.platform;
    this.tags = props.tags;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessEndpoints": this.accessEndpoints,
      "appBlockArns": this.appBlockArns,
      "description": this.description,
      "displayName": this.displayName,
      "enableDefaultInternetAccess": this.enableDefaultInternetAccess,
      "iamRoleArn": this.iamRoleArn,
      "instanceType": this.instanceType,
      "name": this.name,
      "platform": this.platform,
      "tags": this.tags,
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAppBlockBuilder.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAppBlockBuilderPropsToCloudFormation(props);
  }
}

export namespace CfnAppBlockBuilder {
  /**
   * Describes VPC configuration information for fleets and image builders.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblockbuilder-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * The identifiers of the security groups for the fleet or image builder.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblockbuilder-vpcconfig.html#cfn-appstream-appblockbuilder-vpcconfig-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The identifiers of the subnets to which a network interface is attached from the fleet instance or image builder instance.
     *
     * Fleet instances use one or more subnets. Image builder instances use one subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblockbuilder-vpcconfig.html#cfn-appstream-appblockbuilder-vpcconfig-subnetids
     */
    readonly subnetIds?: Array<string>;
  }

  /**
   * Describes an interface VPC endpoint (interface endpoint) that lets you create a private connection between the virtual private cloud (VPC) that you specify and AppStream 2.0. When you specify an interface endpoint for a stack, users of the stack can connect to AppStream 2.0 only through that endpoint. When you specify an interface endpoint for an image builder, administrators can connect to the image builder only through that endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblockbuilder-accessendpoint.html
   */
  export interface AccessEndpointProperty {
    /**
     * The type of interface endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblockbuilder-accessendpoint.html#cfn-appstream-appblockbuilder-accessendpoint-endpointtype
     */
    readonly endpointType: string;

    /**
     * The identifier (ID) of the VPC in which the interface endpoint is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-appblockbuilder-accessendpoint.html#cfn-appstream-appblockbuilder-accessendpoint-vpceid
     */
    readonly vpceId: string;
  }
}

/**
 * Properties for defining a `CfnAppBlockBuilder`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html
 */
export interface CfnAppBlockBuilderProps {
  /**
   * The access endpoints of the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-accessendpoints
   */
  readonly accessEndpoints?: Array<CfnAppBlockBuilder.AccessEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The ARN of the app block.
   *
   * *Maximum* : `1`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-appblockarns
   */
  readonly appBlockArns?: Array<string>;

  /**
   * The description of the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-description
   */
  readonly description?: string;

  /**
   * The display name of the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-displayname
   */
  readonly displayName?: string;

  /**
   * Indicates whether default internet access is enabled for the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-enabledefaultinternetaccess
   */
  readonly enableDefaultInternetAccess?: boolean | cdk.IResolvable;

  /**
   * The ARN of the IAM role that is applied to the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-iamrolearn
   */
  readonly iamRoleArn?: string;

  /**
   * The instance type of the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-instancetype
   */
  readonly instanceType: string;

  /**
   * The name of the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-name
   */
  readonly name: string;

  /**
   * The platform of the app block builder.
   *
   * *Allowed values* : `WINDOWS_SERVER_2019`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-platform
   */
  readonly platform: string;

  /**
   * The tags of the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The VPC configuration for the app block builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-appblockbuilder.html#cfn-appstream-appblockbuilder-vpcconfig
   */
  readonly vpcConfig: cdk.IResolvable | CfnAppBlockBuilder.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppBlockBuilderVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppBlockBuilderVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppBlockBuilderVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnAppBlockBuilderVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAppBlockBuilder.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppBlockBuilder.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `AccessEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppBlockBuilderAccessEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpointType", cdk.requiredValidator)(properties.endpointType));
  errors.collect(cdk.propertyValidator("endpointType", cdk.validateString)(properties.endpointType));
  errors.collect(cdk.propertyValidator("vpceId", cdk.requiredValidator)(properties.vpceId));
  errors.collect(cdk.propertyValidator("vpceId", cdk.validateString)(properties.vpceId));
  return errors.wrap("supplied properties not correct for \"AccessEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppBlockBuilderAccessEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppBlockBuilderAccessEndpointPropertyValidator(properties).assertSuccess();
  return {
    "EndpointType": cdk.stringToCloudFormation(properties.endpointType),
    "VpceId": cdk.stringToCloudFormation(properties.vpceId)
  };
}

// @ts-ignore TS6133
function CfnAppBlockBuilderAccessEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppBlockBuilder.AccessEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppBlockBuilder.AccessEndpointProperty>();
  ret.addPropertyResult("endpointType", "EndpointType", (properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined));
  ret.addPropertyResult("vpceId", "VpceId", (properties.VpceId != null ? cfn_parse.FromCloudFormation.getString(properties.VpceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAppBlockBuilderProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppBlockBuilderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppBlockBuilderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessEndpoints", cdk.listValidator(CfnAppBlockBuilderAccessEndpointPropertyValidator))(properties.accessEndpoints));
  errors.collect(cdk.propertyValidator("appBlockArns", cdk.listValidator(cdk.validateString))(properties.appBlockArns));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("enableDefaultInternetAccess", cdk.validateBoolean)(properties.enableDefaultInternetAccess));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("platform", cdk.requiredValidator)(properties.platform));
  errors.collect(cdk.propertyValidator("platform", cdk.validateString)(properties.platform));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcConfig", cdk.requiredValidator)(properties.vpcConfig));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnAppBlockBuilderVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnAppBlockBuilderProps\"");
}

// @ts-ignore TS6133
function convertCfnAppBlockBuilderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppBlockBuilderPropsValidator(properties).assertSuccess();
  return {
    "AccessEndpoints": cdk.listMapper(convertCfnAppBlockBuilderAccessEndpointPropertyToCloudFormation)(properties.accessEndpoints),
    "AppBlockArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.appBlockArns),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "EnableDefaultInternetAccess": cdk.booleanToCloudFormation(properties.enableDefaultInternetAccess),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Platform": cdk.stringToCloudFormation(properties.platform),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcConfig": convertCfnAppBlockBuilderVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnAppBlockBuilderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppBlockBuilderProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppBlockBuilderProps>();
  ret.addPropertyResult("accessEndpoints", "AccessEndpoints", (properties.AccessEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnAppBlockBuilderAccessEndpointPropertyFromCloudFormation)(properties.AccessEndpoints) : undefined));
  ret.addPropertyResult("appBlockArns", "AppBlockArns", (properties.AppBlockArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AppBlockArns) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("enableDefaultInternetAccess", "EnableDefaultInternetAccess", (properties.EnableDefaultInternetAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDefaultInternetAccess) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("platform", "Platform", (properties.Platform != null ? cfn_parse.FromCloudFormation.getString(properties.Platform) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnAppBlockBuilderVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource creates an application.
 *
 * Applications store the details about how to launch applications on streaming instances. This is only supported for Elastic fleets.
 *
 * @cloudformationResource AWS::AppStream::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::Application";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the application.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time when the application was created.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: string;

  /**
   * The app block ARN with which the application should be associated.
   */
  public appBlockArn: string;

  /**
   * A list of attributes to delete from an application.
   */
  public attributesToDelete?: Array<string>;

  /**
   * The description of the application.
   */
  public description?: string;

  /**
   * The display name of the application.
   */
  public displayName?: string;

  /**
   * The icon S3 location of the application.
   */
  public iconS3Location: cdk.IResolvable | CfnApplication.S3LocationProperty;

  /**
   * The instance families the application supports.
   */
  public instanceFamilies: Array<string>;

  /**
   * The launch parameters of the application.
   */
  public launchParameters?: string;

  /**
   * The launch path of the application.
   */
  public launchPath: string;

  /**
   * The name of the application.
   */
  public name: string;

  /**
   * The platforms the application supports.
   */
  public platforms: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of the application.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The working directory of the application.
   */
  public workingDirectory?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "appBlockArn", this);
    cdk.requireProperty(props, "iconS3Location", this);
    cdk.requireProperty(props, "instanceFamilies", this);
    cdk.requireProperty(props, "launchPath", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "platforms", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedTime = cdk.Token.asString(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.STRING));
    this.appBlockArn = props.appBlockArn;
    this.attributesToDelete = props.attributesToDelete;
    this.description = props.description;
    this.displayName = props.displayName;
    this.iconS3Location = props.iconS3Location;
    this.instanceFamilies = props.instanceFamilies;
    this.launchParameters = props.launchParameters;
    this.launchPath = props.launchPath;
    this.name = props.name;
    this.platforms = props.platforms;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppStream::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workingDirectory = props.workingDirectory;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appBlockArn": this.appBlockArn,
      "attributesToDelete": this.attributesToDelete,
      "description": this.description,
      "displayName": this.displayName,
      "iconS3Location": this.iconS3Location,
      "instanceFamilies": this.instanceFamilies,
      "launchParameters": this.launchParameters,
      "launchPath": this.launchPath,
      "name": this.name,
      "platforms": this.platforms,
      "tags": this.tags.renderTags(),
      "workingDirectory": this.workingDirectory
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnApplication {
  /**
   * The S3 location of the application icon.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-application-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The S3 bucket of the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-application-s3location.html#cfn-appstream-application-s3location-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The S3 key of the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-application-s3location.html#cfn-appstream-application-s3location-s3key
     */
    readonly s3Key: string;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html
 */
export interface CfnApplicationProps {
  /**
   * The app block ARN with which the application should be associated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-appblockarn
   */
  readonly appBlockArn: string;

  /**
   * A list of attributes to delete from an application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-attributestodelete
   */
  readonly attributesToDelete?: Array<string>;

  /**
   * The description of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-description
   */
  readonly description?: string;

  /**
   * The display name of the application.
   *
   * This name is visible to users in the application catalog.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-displayname
   */
  readonly displayName?: string;

  /**
   * The icon S3 location of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-icons3location
   */
  readonly iconS3Location: cdk.IResolvable | CfnApplication.S3LocationProperty;

  /**
   * The instance families the application supports.
   *
   * *Allowed Values* : `GENERAL_PURPOSE` | `GRAPHICS_G4`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-instancefamilies
   */
  readonly instanceFamilies: Array<string>;

  /**
   * The launch parameters of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-launchparameters
   */
  readonly launchParameters?: string;

  /**
   * The launch path of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-launchpath
   */
  readonly launchPath: string;

  /**
   * The name of the application.
   *
   * This name is visible to users when a name is not specified in the DisplayName property.
   *
   * *Pattern* : `^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,100}$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-name
   */
  readonly name: string;

  /**
   * The platforms the application supports.
   *
   * *Allowed Values* : `WINDOWS_SERVER_2019` | `AMAZON_LINUX2`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-platforms
   */
  readonly platforms: Array<string>;

  /**
   * The tags of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The working directory of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-application.html#cfn-appstream-application-workingdirectory
   */
  readonly workingDirectory?: string;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnApplicationS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.S3LocationProperty>();
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appBlockArn", cdk.requiredValidator)(properties.appBlockArn));
  errors.collect(cdk.propertyValidator("appBlockArn", cdk.validateString)(properties.appBlockArn));
  errors.collect(cdk.propertyValidator("attributesToDelete", cdk.listValidator(cdk.validateString))(properties.attributesToDelete));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("iconS3Location", cdk.requiredValidator)(properties.iconS3Location));
  errors.collect(cdk.propertyValidator("iconS3Location", CfnApplicationS3LocationPropertyValidator)(properties.iconS3Location));
  errors.collect(cdk.propertyValidator("instanceFamilies", cdk.requiredValidator)(properties.instanceFamilies));
  errors.collect(cdk.propertyValidator("instanceFamilies", cdk.listValidator(cdk.validateString))(properties.instanceFamilies));
  errors.collect(cdk.propertyValidator("launchParameters", cdk.validateString)(properties.launchParameters));
  errors.collect(cdk.propertyValidator("launchPath", cdk.requiredValidator)(properties.launchPath));
  errors.collect(cdk.propertyValidator("launchPath", cdk.validateString)(properties.launchPath));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("platforms", cdk.requiredValidator)(properties.platforms));
  errors.collect(cdk.propertyValidator("platforms", cdk.listValidator(cdk.validateString))(properties.platforms));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("workingDirectory", cdk.validateString)(properties.workingDirectory));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "AppBlockArn": cdk.stringToCloudFormation(properties.appBlockArn),
    "AttributesToDelete": cdk.listMapper(cdk.stringToCloudFormation)(properties.attributesToDelete),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "IconS3Location": convertCfnApplicationS3LocationPropertyToCloudFormation(properties.iconS3Location),
    "InstanceFamilies": cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceFamilies),
    "LaunchParameters": cdk.stringToCloudFormation(properties.launchParameters),
    "LaunchPath": cdk.stringToCloudFormation(properties.launchPath),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Platforms": cdk.listMapper(cdk.stringToCloudFormation)(properties.platforms),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "WorkingDirectory": cdk.stringToCloudFormation(properties.workingDirectory)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("appBlockArn", "AppBlockArn", (properties.AppBlockArn != null ? cfn_parse.FromCloudFormation.getString(properties.AppBlockArn) : undefined));
  ret.addPropertyResult("attributesToDelete", "AttributesToDelete", (properties.AttributesToDelete != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AttributesToDelete) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("iconS3Location", "IconS3Location", (properties.IconS3Location != null ? CfnApplicationS3LocationPropertyFromCloudFormation(properties.IconS3Location) : undefined));
  ret.addPropertyResult("instanceFamilies", "InstanceFamilies", (properties.InstanceFamilies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InstanceFamilies) : undefined));
  ret.addPropertyResult("launchParameters", "LaunchParameters", (properties.LaunchParameters != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchParameters) : undefined));
  ret.addPropertyResult("launchPath", "LaunchPath", (properties.LaunchPath != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchPath) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("platforms", "Platforms", (properties.Platforms != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Platforms) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("workingDirectory", "WorkingDirectory", (properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates an application to an entitlement.
 *
 * @cloudformationResource AWS::AppStream::ApplicationEntitlementAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationentitlementassociation.html
 */
export class CfnApplicationEntitlementAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::ApplicationEntitlementAssociation";

  /**
   * Build a CfnApplicationEntitlementAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationEntitlementAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationEntitlementAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplicationEntitlementAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier of the application.
   */
  public applicationIdentifier: string;

  /**
   * The name of the entitlement.
   */
  public entitlementName: string;

  /**
   * The name of the stack.
   */
  public stackName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationEntitlementAssociationProps) {
    super(scope, id, {
      "type": CfnApplicationEntitlementAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationIdentifier", this);
    cdk.requireProperty(props, "entitlementName", this);
    cdk.requireProperty(props, "stackName", this);

    this.applicationIdentifier = props.applicationIdentifier;
    this.entitlementName = props.entitlementName;
    this.stackName = props.stackName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationIdentifier": this.applicationIdentifier,
      "entitlementName": this.entitlementName,
      "stackName": this.stackName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationEntitlementAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationEntitlementAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApplicationEntitlementAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationentitlementassociation.html
 */
export interface CfnApplicationEntitlementAssociationProps {
  /**
   * The identifier of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationentitlementassociation.html#cfn-appstream-applicationentitlementassociation-applicationidentifier
   */
  readonly applicationIdentifier: string;

  /**
   * The name of the entitlement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationentitlementassociation.html#cfn-appstream-applicationentitlementassociation-entitlementname
   */
  readonly entitlementName: string;

  /**
   * The name of the stack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationentitlementassociation.html#cfn-appstream-applicationentitlementassociation-stackname
   */
  readonly stackName: string;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationEntitlementAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationEntitlementAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationEntitlementAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationIdentifier", cdk.requiredValidator)(properties.applicationIdentifier));
  errors.collect(cdk.propertyValidator("applicationIdentifier", cdk.validateString)(properties.applicationIdentifier));
  errors.collect(cdk.propertyValidator("entitlementName", cdk.requiredValidator)(properties.entitlementName));
  errors.collect(cdk.propertyValidator("entitlementName", cdk.validateString)(properties.entitlementName));
  errors.collect(cdk.propertyValidator("stackName", cdk.requiredValidator)(properties.stackName));
  errors.collect(cdk.propertyValidator("stackName", cdk.validateString)(properties.stackName));
  return errors.wrap("supplied properties not correct for \"CfnApplicationEntitlementAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationEntitlementAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationEntitlementAssociationPropsValidator(properties).assertSuccess();
  return {
    "ApplicationIdentifier": cdk.stringToCloudFormation(properties.applicationIdentifier),
    "EntitlementName": cdk.stringToCloudFormation(properties.entitlementName),
    "StackName": cdk.stringToCloudFormation(properties.stackName)
  };
}

// @ts-ignore TS6133
function CfnApplicationEntitlementAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationEntitlementAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationEntitlementAssociationProps>();
  ret.addPropertyResult("applicationIdentifier", "ApplicationIdentifier", (properties.ApplicationIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationIdentifier) : undefined));
  ret.addPropertyResult("entitlementName", "EntitlementName", (properties.EntitlementName != null ? cfn_parse.FromCloudFormation.getString(properties.EntitlementName) : undefined));
  ret.addPropertyResult("stackName", "StackName", (properties.StackName != null ? cfn_parse.FromCloudFormation.getString(properties.StackName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource associates the specified application with the specified fleet.
 *
 * This is only supported for Elastic fleets.
 *
 * @cloudformationResource AWS::AppStream::ApplicationFleetAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationfleetassociation.html
 */
export class CfnApplicationFleetAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::ApplicationFleetAssociation";

  /**
   * Build a CfnApplicationFleetAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationFleetAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationFleetAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplicationFleetAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the application.
   */
  public applicationArn: string;

  /**
   * The name of the fleet.
   */
  public fleetName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationFleetAssociationProps) {
    super(scope, id, {
      "type": CfnApplicationFleetAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationArn", this);
    cdk.requireProperty(props, "fleetName", this);

    this.applicationArn = props.applicationArn;
    this.fleetName = props.fleetName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationArn": this.applicationArn,
      "fleetName": this.fleetName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationFleetAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationFleetAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApplicationFleetAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationfleetassociation.html
 */
export interface CfnApplicationFleetAssociationProps {
  /**
   * The ARN of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationfleetassociation.html#cfn-appstream-applicationfleetassociation-applicationarn
   */
  readonly applicationArn: string;

  /**
   * The name of the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-applicationfleetassociation.html#cfn-appstream-applicationfleetassociation-fleetname
   */
  readonly fleetName: string;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationFleetAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationFleetAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationFleetAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationArn", cdk.requiredValidator)(properties.applicationArn));
  errors.collect(cdk.propertyValidator("applicationArn", cdk.validateString)(properties.applicationArn));
  errors.collect(cdk.propertyValidator("fleetName", cdk.requiredValidator)(properties.fleetName));
  errors.collect(cdk.propertyValidator("fleetName", cdk.validateString)(properties.fleetName));
  return errors.wrap("supplied properties not correct for \"CfnApplicationFleetAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationFleetAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationFleetAssociationPropsValidator(properties).assertSuccess();
  return {
    "ApplicationArn": cdk.stringToCloudFormation(properties.applicationArn),
    "FleetName": cdk.stringToCloudFormation(properties.fleetName)
  };
}

// @ts-ignore TS6133
function CfnApplicationFleetAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationFleetAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationFleetAssociationProps>();
  ret.addPropertyResult("applicationArn", "ApplicationArn", (properties.ApplicationArn != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationArn) : undefined));
  ret.addPropertyResult("fleetName", "FleetName", (properties.FleetName != null ? cfn_parse.FromCloudFormation.getString(properties.FleetName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppStream::DirectoryConfig` resource specifies the configuration information required to join Amazon AppStream 2.0 fleets and image builders to Microsoft Active Directory domains.
 *
 * @cloudformationResource AWS::AppStream::DirectoryConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-directoryconfig.html
 */
export class CfnDirectoryConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::DirectoryConfig";

  /**
   * Build a CfnDirectoryConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDirectoryConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDirectoryConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDirectoryConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The certificate-based authentication properties used to authenticate SAML 2.0 Identity Provider (IdP) user identities to Active Directory domain-joined streaming instances.
   */
  public certificateBasedAuthProperties?: CfnDirectoryConfig.CertificateBasedAuthPropertiesProperty | cdk.IResolvable;

  /**
   * The fully qualified name of the directory (for example, corp.example.com).
   */
  public directoryName: string;

  /**
   * The distinguished names of the organizational units for computer accounts.
   */
  public organizationalUnitDistinguishedNames: Array<string>;

  /**
   * The credentials for the service account used by the streaming instance to connect to the directory.
   */
  public serviceAccountCredentials: cdk.IResolvable | CfnDirectoryConfig.ServiceAccountCredentialsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDirectoryConfigProps) {
    super(scope, id, {
      "type": CfnDirectoryConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "directoryName", this);
    cdk.requireProperty(props, "organizationalUnitDistinguishedNames", this);
    cdk.requireProperty(props, "serviceAccountCredentials", this);

    this.certificateBasedAuthProperties = props.certificateBasedAuthProperties;
    this.directoryName = props.directoryName;
    this.organizationalUnitDistinguishedNames = props.organizationalUnitDistinguishedNames;
    this.serviceAccountCredentials = props.serviceAccountCredentials;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateBasedAuthProperties": this.certificateBasedAuthProperties,
      "directoryName": this.directoryName,
      "organizationalUnitDistinguishedNames": this.organizationalUnitDistinguishedNames,
      "serviceAccountCredentials": this.serviceAccountCredentials
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDirectoryConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDirectoryConfigPropsToCloudFormation(props);
  }
}

export namespace CfnDirectoryConfig {
  /**
   * The credentials for the service account used by the streaming instance to connect to the directory.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-directoryconfig-serviceaccountcredentials.html
   */
  export interface ServiceAccountCredentialsProperty {
    /**
     * The user name of the account.
     *
     * This account must have the following privileges: create computer objects, join computers to the domain, and change/reset the password on descendant computer objects for the organizational units specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-directoryconfig-serviceaccountcredentials.html#cfn-appstream-directoryconfig-serviceaccountcredentials-accountname
     */
    readonly accountName: string;

    /**
     * The password for the account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-directoryconfig-serviceaccountcredentials.html#cfn-appstream-directoryconfig-serviceaccountcredentials-accountpassword
     */
    readonly accountPassword: string;
  }

  /**
   * The certificate-based authentication properties used to authenticate SAML 2.0 Identity Provider (IdP) user identities to Active Directory domain-joined streaming instances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-directoryconfig-certificatebasedauthproperties.html
   */
  export interface CertificateBasedAuthPropertiesProperty {
    /**
     * The ARN of the AWS Certificate Manager Private CA resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-directoryconfig-certificatebasedauthproperties.html#cfn-appstream-directoryconfig-certificatebasedauthproperties-certificateauthorityarn
     */
    readonly certificateAuthorityArn?: string;

    /**
     * The status of the certificate-based authentication properties.
     *
     * Fallback is turned on by default when certificate-based authentication is *Enabled* . Fallback allows users to log in using their AD domain password if certificate-based authentication is unsuccessful, or to unlock a desktop lock screen. *Enabled_no_directory_login_fallback* enables certificate-based authentication, but does not allow users to log in using their AD domain password. Users will be disconnected to re-authenticate using certificates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-directoryconfig-certificatebasedauthproperties.html#cfn-appstream-directoryconfig-certificatebasedauthproperties-status
     */
    readonly status?: string;
  }
}

/**
 * Properties for defining a `CfnDirectoryConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-directoryconfig.html
 */
export interface CfnDirectoryConfigProps {
  /**
   * The certificate-based authentication properties used to authenticate SAML 2.0 Identity Provider (IdP) user identities to Active Directory domain-joined streaming instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-directoryconfig.html#cfn-appstream-directoryconfig-certificatebasedauthproperties
   */
  readonly certificateBasedAuthProperties?: CfnDirectoryConfig.CertificateBasedAuthPropertiesProperty | cdk.IResolvable;

  /**
   * The fully qualified name of the directory (for example, corp.example.com).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-directoryconfig.html#cfn-appstream-directoryconfig-directoryname
   */
  readonly directoryName: string;

  /**
   * The distinguished names of the organizational units for computer accounts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-directoryconfig.html#cfn-appstream-directoryconfig-organizationalunitdistinguishednames
   */
  readonly organizationalUnitDistinguishedNames: Array<string>;

  /**
   * The credentials for the service account used by the streaming instance to connect to the directory.
   *
   * Do not use this parameter directly. Use `ServiceAccountCredentials` as an input parameter with `noEcho` as shown in the [Parameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html) . For best practices information, see [Do Not Embed Credentials in Your Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html#creds) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-directoryconfig.html#cfn-appstream-directoryconfig-serviceaccountcredentials
   */
  readonly serviceAccountCredentials: cdk.IResolvable | CfnDirectoryConfig.ServiceAccountCredentialsProperty;
}

/**
 * Determine whether the given properties match those of a `ServiceAccountCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceAccountCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDirectoryConfigServiceAccountCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountName", cdk.requiredValidator)(properties.accountName));
  errors.collect(cdk.propertyValidator("accountName", cdk.validateString)(properties.accountName));
  errors.collect(cdk.propertyValidator("accountPassword", cdk.requiredValidator)(properties.accountPassword));
  errors.collect(cdk.propertyValidator("accountPassword", cdk.validateString)(properties.accountPassword));
  return errors.wrap("supplied properties not correct for \"ServiceAccountCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDirectoryConfigServiceAccountCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDirectoryConfigServiceAccountCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccountName": cdk.stringToCloudFormation(properties.accountName),
    "AccountPassword": cdk.stringToCloudFormation(properties.accountPassword)
  };
}

// @ts-ignore TS6133
function CfnDirectoryConfigServiceAccountCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDirectoryConfig.ServiceAccountCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDirectoryConfig.ServiceAccountCredentialsProperty>();
  ret.addPropertyResult("accountName", "AccountName", (properties.AccountName != null ? cfn_parse.FromCloudFormation.getString(properties.AccountName) : undefined));
  ret.addPropertyResult("accountPassword", "AccountPassword", (properties.AccountPassword != null ? cfn_parse.FromCloudFormation.getString(properties.AccountPassword) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CertificateBasedAuthPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateBasedAuthPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDirectoryConfigCertificateBasedAuthPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateAuthorityArn", cdk.validateString)(properties.certificateAuthorityArn));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CertificateBasedAuthPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnDirectoryConfigCertificateBasedAuthPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDirectoryConfigCertificateBasedAuthPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "CertificateAuthorityArn": cdk.stringToCloudFormation(properties.certificateAuthorityArn),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnDirectoryConfigCertificateBasedAuthPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDirectoryConfig.CertificateBasedAuthPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDirectoryConfig.CertificateBasedAuthPropertiesProperty>();
  ret.addPropertyResult("certificateAuthorityArn", "CertificateAuthorityArn", (properties.CertificateAuthorityArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateAuthorityArn) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDirectoryConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnDirectoryConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDirectoryConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateBasedAuthProperties", CfnDirectoryConfigCertificateBasedAuthPropertiesPropertyValidator)(properties.certificateBasedAuthProperties));
  errors.collect(cdk.propertyValidator("directoryName", cdk.requiredValidator)(properties.directoryName));
  errors.collect(cdk.propertyValidator("directoryName", cdk.validateString)(properties.directoryName));
  errors.collect(cdk.propertyValidator("organizationalUnitDistinguishedNames", cdk.requiredValidator)(properties.organizationalUnitDistinguishedNames));
  errors.collect(cdk.propertyValidator("organizationalUnitDistinguishedNames", cdk.listValidator(cdk.validateString))(properties.organizationalUnitDistinguishedNames));
  errors.collect(cdk.propertyValidator("serviceAccountCredentials", cdk.requiredValidator)(properties.serviceAccountCredentials));
  errors.collect(cdk.propertyValidator("serviceAccountCredentials", CfnDirectoryConfigServiceAccountCredentialsPropertyValidator)(properties.serviceAccountCredentials));
  return errors.wrap("supplied properties not correct for \"CfnDirectoryConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnDirectoryConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDirectoryConfigPropsValidator(properties).assertSuccess();
  return {
    "CertificateBasedAuthProperties": convertCfnDirectoryConfigCertificateBasedAuthPropertiesPropertyToCloudFormation(properties.certificateBasedAuthProperties),
    "DirectoryName": cdk.stringToCloudFormation(properties.directoryName),
    "OrganizationalUnitDistinguishedNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnitDistinguishedNames),
    "ServiceAccountCredentials": convertCfnDirectoryConfigServiceAccountCredentialsPropertyToCloudFormation(properties.serviceAccountCredentials)
  };
}

// @ts-ignore TS6133
function CfnDirectoryConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDirectoryConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDirectoryConfigProps>();
  ret.addPropertyResult("certificateBasedAuthProperties", "CertificateBasedAuthProperties", (properties.CertificateBasedAuthProperties != null ? CfnDirectoryConfigCertificateBasedAuthPropertiesPropertyFromCloudFormation(properties.CertificateBasedAuthProperties) : undefined));
  ret.addPropertyResult("directoryName", "DirectoryName", (properties.DirectoryName != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryName) : undefined));
  ret.addPropertyResult("organizationalUnitDistinguishedNames", "OrganizationalUnitDistinguishedNames", (properties.OrganizationalUnitDistinguishedNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationalUnitDistinguishedNames) : undefined));
  ret.addPropertyResult("serviceAccountCredentials", "ServiceAccountCredentials", (properties.ServiceAccountCredentials != null ? CfnDirectoryConfigServiceAccountCredentialsPropertyFromCloudFormation(properties.ServiceAccountCredentials) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an entitlement to control access, based on user attributes, to specific applications within a stack.
 *
 * Entitlements apply to SAML 2.0 federated user identities. Amazon AppStream 2.0 user pool and streaming URL users are entitled to all applications in a stack. Entitlements don't apply to the desktop stream view application or to applications managed by a dynamic app provider using the Dynamic Application Framework.
 *
 * @cloudformationResource AWS::AppStream::Entitlement
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-entitlement.html
 */
export class CfnEntitlement extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::Entitlement";

  /**
   * Build a CfnEntitlement from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEntitlement {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEntitlementPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEntitlement(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time when the entitlement was created.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: string;

  /**
   * The time when the entitlement was last modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: string;

  /**
   * Specifies whether to entitle all apps or only selected apps.
   */
  public appVisibility: string;

  /**
   * The attributes of the entitlement.
   */
  public attributes: Array<CfnEntitlement.AttributeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the entitlement.
   */
  public description?: string;

  /**
   * The name of the entitlement.
   */
  public name: string;

  /**
   * The name of the stack.
   */
  public stackName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEntitlementProps) {
    super(scope, id, {
      "type": CfnEntitlement.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "appVisibility", this);
    cdk.requireProperty(props, "attributes", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "stackName", this);

    this.attrCreatedTime = cdk.Token.asString(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asString(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.STRING));
    this.appVisibility = props.appVisibility;
    this.attributes = props.attributes;
    this.description = props.description;
    this.name = props.name;
    this.stackName = props.stackName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appVisibility": this.appVisibility,
      "attributes": this.attributes,
      "description": this.description,
      "name": this.name,
      "stackName": this.stackName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEntitlement.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEntitlementPropsToCloudFormation(props);
  }
}

export namespace CfnEntitlement {
  /**
   * An attribute that belongs to an entitlement.
   *
   * Application entitlements work by matching a supported SAML 2.0 attribute name to a value when a user identity federates to an AppStream 2.0 SAML application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-entitlement-attribute.html
   */
  export interface AttributeProperty {
    /**
     * A supported AWS IAM SAML PrincipalTag attribute that is matched to a value when a user identity federates to an AppStream 2.0 SAML application.
     *
     * The following are supported values:
     *
     * - roles
     * - department
     * - organization
     * - groups
     * - title
     * - costCenter
     * - userType
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-entitlement-attribute.html#cfn-appstream-entitlement-attribute-name
     */
    readonly name: string;

    /**
     * A value that is matched to a supported SAML attribute name when a user identity federates to an AppStream 2.0 SAML application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-entitlement-attribute.html#cfn-appstream-entitlement-attribute-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnEntitlement`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-entitlement.html
 */
export interface CfnEntitlementProps {
  /**
   * Specifies whether to entitle all apps or only selected apps.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-entitlement.html#cfn-appstream-entitlement-appvisibility
   */
  readonly appVisibility: string;

  /**
   * The attributes of the entitlement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-entitlement.html#cfn-appstream-entitlement-attributes
   */
  readonly attributes: Array<CfnEntitlement.AttributeProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the entitlement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-entitlement.html#cfn-appstream-entitlement-description
   */
  readonly description?: string;

  /**
   * The name of the entitlement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-entitlement.html#cfn-appstream-entitlement-name
   */
  readonly name: string;

  /**
   * The name of the stack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-entitlement.html#cfn-appstream-entitlement-stackname
   */
  readonly stackName: string;
}

/**
 * Determine whether the given properties match those of a `AttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntitlementAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"AttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntitlementAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntitlementAttributePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEntitlementAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntitlement.AttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntitlement.AttributeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEntitlementProps`
 *
 * @param properties - the TypeScript properties of a `CfnEntitlementProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntitlementPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appVisibility", cdk.requiredValidator)(properties.appVisibility));
  errors.collect(cdk.propertyValidator("appVisibility", cdk.validateString)(properties.appVisibility));
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.listValidator(CfnEntitlementAttributePropertyValidator))(properties.attributes));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("stackName", cdk.requiredValidator)(properties.stackName));
  errors.collect(cdk.propertyValidator("stackName", cdk.validateString)(properties.stackName));
  return errors.wrap("supplied properties not correct for \"CfnEntitlementProps\"");
}

// @ts-ignore TS6133
function convertCfnEntitlementPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntitlementPropsValidator(properties).assertSuccess();
  return {
    "AppVisibility": cdk.stringToCloudFormation(properties.appVisibility),
    "Attributes": cdk.listMapper(convertCfnEntitlementAttributePropertyToCloudFormation)(properties.attributes),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "StackName": cdk.stringToCloudFormation(properties.stackName)
  };
}

// @ts-ignore TS6133
function CfnEntitlementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntitlementProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntitlementProps>();
  ret.addPropertyResult("appVisibility", "AppVisibility", (properties.AppVisibility != null ? cfn_parse.FromCloudFormation.getString(properties.AppVisibility) : undefined));
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(CfnEntitlementAttributePropertyFromCloudFormation)(properties.Attributes) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("stackName", "StackName", (properties.StackName != null ? cfn_parse.FromCloudFormation.getString(properties.StackName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppStream::Fleet` resource creates a fleet for Amazon AppStream 2.0. A fleet consists of streaming instances that run a specified image when using Always-On or On-Demand.
 *
 * @cloudformationResource AWS::AppStream::Fleet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html
 */
export class CfnFleet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::Fleet";

  /**
   * Build a CfnFleet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFleetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFleet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The desired capacity for the fleet.
   */
  public computeCapacity?: CfnFleet.ComputeCapacityProperty | cdk.IResolvable;

  /**
   * The description to display.
   */
  public description?: string;

  /**
   * The amount of time that a streaming session remains active after users disconnect.
   */
  public disconnectTimeoutInSeconds?: number;

  /**
   * The fleet name to display.
   */
  public displayName?: string;

  /**
   * The name of the directory and organizational unit (OU) to use to join the fleet to a Microsoft Active Directory domain.
   */
  public domainJoinInfo?: CfnFleet.DomainJoinInfoProperty | cdk.IResolvable;

  /**
   * Enables or disables default internet access for the fleet.
   */
  public enableDefaultInternetAccess?: boolean | cdk.IResolvable;

  /**
   * The fleet type.
   */
  public fleetType?: string;

  /**
   * The ARN of the IAM role that is applied to the fleet.
   */
  public iamRoleArn?: string;

  /**
   * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the `DisconnectTimeoutInSeconds` time interval begins.
   */
  public idleDisconnectTimeoutInSeconds?: number;

  /**
   * The ARN of the public, private, or shared image to use.
   */
  public imageArn?: string;

  /**
   * The name of the image used to create the fleet.
   */
  public imageName?: string;

  /**
   * The instance type to use when launching fleet instances. The following instance types are available for non-Elastic fleets:.
   */
  public instanceType: string;

  /**
   * The maximum number of concurrent sessions that can be run on an Elastic fleet.
   */
  public maxConcurrentSessions?: number;

  /**
   * The maximum number of user sessions on an instance.
   */
  public maxSessionsPerInstance?: number;

  /**
   * The maximum amount of time that a streaming session can remain active, in seconds.
   */
  public maxUserDurationInSeconds?: number;

  /**
   * A unique name for the fleet.
   */
  public name: string;

  /**
   * The platform of the fleet.
   */
  public platform?: string;

  /**
   * The S3 location of the session scripts configuration zip file.
   */
  public sessionScriptS3Location?: cdk.IResolvable | CfnFleet.S3LocationProperty;

  /**
   * The AppStream 2.0 view that is displayed to your users when they stream from the fleet. When `APP` is specified, only the windows of applications opened by users display. When `DESKTOP` is specified, the standard desktop that is provided by the operating system displays.
   */
  public streamView?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The USB device filter strings that specify which USB devices a user can redirect to the fleet streaming session, when using the Windows native client.
   */
  public usbDeviceFilterStrings?: Array<string>;

  /**
   * The VPC configuration for the fleet.
   */
  public vpcConfig?: cdk.IResolvable | CfnFleet.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFleetProps) {
    super(scope, id, {
      "type": CfnFleet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceType", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.computeCapacity = props.computeCapacity;
    this.description = props.description;
    this.disconnectTimeoutInSeconds = props.disconnectTimeoutInSeconds;
    this.displayName = props.displayName;
    this.domainJoinInfo = props.domainJoinInfo;
    this.enableDefaultInternetAccess = props.enableDefaultInternetAccess;
    this.fleetType = props.fleetType;
    this.iamRoleArn = props.iamRoleArn;
    this.idleDisconnectTimeoutInSeconds = props.idleDisconnectTimeoutInSeconds;
    this.imageArn = props.imageArn;
    this.imageName = props.imageName;
    this.instanceType = props.instanceType;
    this.maxConcurrentSessions = props.maxConcurrentSessions;
    this.maxSessionsPerInstance = props.maxSessionsPerInstance;
    this.maxUserDurationInSeconds = props.maxUserDurationInSeconds;
    this.name = props.name;
    this.platform = props.platform;
    this.sessionScriptS3Location = props.sessionScriptS3Location;
    this.streamView = props.streamView;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppStream::Fleet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.usbDeviceFilterStrings = props.usbDeviceFilterStrings;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "computeCapacity": this.computeCapacity,
      "description": this.description,
      "disconnectTimeoutInSeconds": this.disconnectTimeoutInSeconds,
      "displayName": this.displayName,
      "domainJoinInfo": this.domainJoinInfo,
      "enableDefaultInternetAccess": this.enableDefaultInternetAccess,
      "fleetType": this.fleetType,
      "iamRoleArn": this.iamRoleArn,
      "idleDisconnectTimeoutInSeconds": this.idleDisconnectTimeoutInSeconds,
      "imageArn": this.imageArn,
      "imageName": this.imageName,
      "instanceType": this.instanceType,
      "maxConcurrentSessions": this.maxConcurrentSessions,
      "maxSessionsPerInstance": this.maxSessionsPerInstance,
      "maxUserDurationInSeconds": this.maxUserDurationInSeconds,
      "name": this.name,
      "platform": this.platform,
      "sessionScriptS3Location": this.sessionScriptS3Location,
      "streamView": this.streamView,
      "tags": this.tags.renderTags(),
      "usbDeviceFilterStrings": this.usbDeviceFilterStrings,
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFleet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFleetPropsToCloudFormation(props);
  }
}

export namespace CfnFleet {
  /**
   * The desired capacity for a fleet.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-computecapacity.html
   */
  export interface ComputeCapacityProperty {
    /**
     * The desired number of streaming instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-computecapacity.html#cfn-appstream-fleet-computecapacity-desiredinstances
     */
    readonly desiredInstances?: number;

    /**
     * The desired number of user sessions for a multi-session fleet. This is not allowed for single-session fleets.
     *
     * When you create a fleet, you must set either the DesiredSessions or DesiredInstances attribute, based on the type of fleet you create. You can’t define both attributes or leave both attributes blank.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-computecapacity.html#cfn-appstream-fleet-computecapacity-desiredsessions
     */
    readonly desiredSessions?: number;
  }

  /**
   * The VPC configuration information for the fleet.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * The identifiers of the security groups for the fleet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-vpcconfig.html#cfn-appstream-fleet-vpcconfig-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The identifiers of the subnets to which a network interface is attached from the fleet instance.
     *
     * Fleet instances can use one or two subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-vpcconfig.html#cfn-appstream-fleet-vpcconfig-subnetids
     */
    readonly subnetIds?: Array<string>;
  }

  /**
   * The name of the directory and organizational unit (OU) to use to join a fleet to a Microsoft Active Directory domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-domainjoininfo.html
   */
  export interface DomainJoinInfoProperty {
    /**
     * The fully qualified name of the directory (for example, corp.example.com).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-domainjoininfo.html#cfn-appstream-fleet-domainjoininfo-directoryname
     */
    readonly directoryName?: string;

    /**
     * The distinguished name of the organizational unit for computer accounts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-domainjoininfo.html#cfn-appstream-fleet-domainjoininfo-organizationalunitdistinguishedname
     */
    readonly organizationalUnitDistinguishedName?: string;
  }

  /**
   * Describes the S3 location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The S3 bucket of the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-s3location.html#cfn-appstream-fleet-s3location-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The S3 key of the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-fleet-s3location.html#cfn-appstream-fleet-s3location-s3key
     */
    readonly s3Key: string;
  }
}

/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html
 */
export interface CfnFleetProps {
  /**
   * The desired capacity for the fleet.
   *
   * This is not allowed for Elastic fleets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-computecapacity
   */
  readonly computeCapacity?: CfnFleet.ComputeCapacityProperty | cdk.IResolvable;

  /**
   * The description to display.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-description
   */
  readonly description?: string;

  /**
   * The amount of time that a streaming session remains active after users disconnect.
   *
   * If users try to reconnect to the streaming session after a disconnection or network interruption within this time interval, they are connected to their previous session. Otherwise, they are connected to a new session with a new streaming instance.
   *
   * Specify a value between 60 and 360000.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-disconnecttimeoutinseconds
   */
  readonly disconnectTimeoutInSeconds?: number;

  /**
   * The fleet name to display.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-displayname
   */
  readonly displayName?: string;

  /**
   * The name of the directory and organizational unit (OU) to use to join the fleet to a Microsoft Active Directory domain.
   *
   * This is not allowed for Elastic fleets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-domainjoininfo
   */
  readonly domainJoinInfo?: CfnFleet.DomainJoinInfoProperty | cdk.IResolvable;

  /**
   * Enables or disables default internet access for the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-enabledefaultinternetaccess
   */
  readonly enableDefaultInternetAccess?: boolean | cdk.IResolvable;

  /**
   * The fleet type.
   *
   * - **ALWAYS_ON** - Provides users with instant-on access to their apps. You are charged for all running instances in your fleet, even if no users are streaming apps.
   * - **ON_DEMAND** - Provide users with access to applications after they connect, which takes one to two minutes. You are charged for instance streaming when users are connected and a small hourly fee for instances that are not streaming apps.
   * - **ELASTIC** - The pool of streaming instances is managed by Amazon AppStream 2.0. When a user selects their application or desktop to launch, they will start streaming after the app block has been downloaded and mounted to a streaming instance.
   *
   * *Allowed Values* : `ALWAYS_ON` | `ELASTIC` | `ON_DEMAND`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-fleettype
   */
  readonly fleetType?: string;

  /**
   * The ARN of the IAM role that is applied to the fleet.
   *
   * To assume a role, the fleet instance calls the AWS Security Token Service `AssumeRole` API operation and passes the ARN of the role to use. The operation creates a new session with temporary credentials. AppStream 2.0 retrieves the temporary credentials and creates the *appstream_machine_role* credential profile on the instance.
   *
   * For more information, see [Using an IAM Role to Grant Permissions to Applications and Scripts Running on AppStream 2.0 Streaming Instances](https://docs.aws.amazon.com/appstream2/latest/developerguide/using-iam-roles-to-grant-permissions-to-applications-scripts-streaming-instances.html) in the *Amazon AppStream 2.0 Administration Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-iamrolearn
   */
  readonly iamRoleArn?: string;

  /**
   * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the `DisconnectTimeoutInSeconds` time interval begins.
   *
   * Users are notified before they are disconnected due to inactivity. If they try to reconnect to the streaming session before the time interval specified in `DisconnectTimeoutInSeconds` elapses, they are connected to their previous session. Users are considered idle when they stop providing keyboard or mouse input during their streaming session. File uploads and downloads, audio in, audio out, and pixels changing do not qualify as user activity. If users continue to be idle after the time interval in `IdleDisconnectTimeoutInSeconds` elapses, they are disconnected.
   *
   * To prevent users from being disconnected due to inactivity, specify a value of 0. Otherwise, specify a value between 60 and 3600.
   *
   * If you enable this feature, we recommend that you specify a value that corresponds exactly to a whole number of minutes (for example, 60, 120, and 180). If you don't do this, the value is rounded to the nearest minute. For example, if you specify a value of 70, users are disconnected after 1 minute of inactivity. If you specify a value that is at the midpoint between two different minutes, the value is rounded up. For example, if you specify a value of 90, users are disconnected after 2 minutes of inactivity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-idledisconnecttimeoutinseconds
   */
  readonly idleDisconnectTimeoutInSeconds?: number;

  /**
   * The ARN of the public, private, or shared image to use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-imagearn
   */
  readonly imageArn?: string;

  /**
   * The name of the image used to create the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-imagename
   */
  readonly imageName?: string;

  /**
   * The instance type to use when launching fleet instances. The following instance types are available for non-Elastic fleets:.
   *
   * - stream.standard.small
   * - stream.standard.medium
   * - stream.standard.large
   * - stream.compute.large
   * - stream.compute.xlarge
   * - stream.compute.2xlarge
   * - stream.compute.4xlarge
   * - stream.compute.8xlarge
   * - stream.memory.large
   * - stream.memory.xlarge
   * - stream.memory.2xlarge
   * - stream.memory.4xlarge
   * - stream.memory.8xlarge
   * - stream.memory.z1d.large
   * - stream.memory.z1d.xlarge
   * - stream.memory.z1d.2xlarge
   * - stream.memory.z1d.3xlarge
   * - stream.memory.z1d.6xlarge
   * - stream.memory.z1d.12xlarge
   * - stream.graphics-design.large
   * - stream.graphics-design.xlarge
   * - stream.graphics-design.2xlarge
   * - stream.graphics-design.4xlarge
   * - stream.graphics-desktop.2xlarge
   * - stream.graphics.g4dn.xlarge
   * - stream.graphics.g4dn.2xlarge
   * - stream.graphics.g4dn.4xlarge
   * - stream.graphics.g4dn.8xlarge
   * - stream.graphics.g4dn.12xlarge
   * - stream.graphics.g4dn.16xlarge
   * - stream.graphics-pro.4xlarge
   * - stream.graphics-pro.8xlarge
   * - stream.graphics-pro.16xlarge
   *
   * The following instance types are available for Elastic fleets:
   *
   * - stream.standard.small
   * - stream.standard.medium
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-instancetype
   */
  readonly instanceType: string;

  /**
   * The maximum number of concurrent sessions that can be run on an Elastic fleet.
   *
   * This setting is required for Elastic fleets, but is not used for other fleet types.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-maxconcurrentsessions
   */
  readonly maxConcurrentSessions?: number;

  /**
   * The maximum number of user sessions on an instance.
   *
   * This only applies to multi-session fleets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-maxsessionsperinstance
   */
  readonly maxSessionsPerInstance?: number;

  /**
   * The maximum amount of time that a streaming session can remain active, in seconds.
   *
   * If users are still connected to a streaming instance five minutes before this limit is reached, they are prompted to save any open documents before being disconnected. After this time elapses, the instance is terminated and replaced by a new instance.
   *
   * Specify a value between 600 and 432000.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-maxuserdurationinseconds
   */
  readonly maxUserDurationInSeconds?: number;

  /**
   * A unique name for the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-name
   */
  readonly name: string;

  /**
   * The platform of the fleet.
   *
   * Platform is a required setting for Elastic fleets, and is not used for other fleet types.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-platform
   */
  readonly platform?: string;

  /**
   * The S3 location of the session scripts configuration zip file.
   *
   * This only applies to Elastic fleets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-sessionscripts3location
   */
  readonly sessionScriptS3Location?: cdk.IResolvable | CfnFleet.S3LocationProperty;

  /**
   * The AppStream 2.0 view that is displayed to your users when they stream from the fleet. When `APP` is specified, only the windows of applications opened by users display. When `DESKTOP` is specified, the standard desktop that is provided by the operating system displays.
   *
   * The default value is `APP` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-streamview
   */
  readonly streamView?: string;

  /**
   * An array of key-value pairs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The USB device filter strings that specify which USB devices a user can redirect to the fleet streaming session, when using the Windows native client.
   *
   * This is allowed but not required for Elastic fleets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-usbdevicefilterstrings
   */
  readonly usbDeviceFilterStrings?: Array<string>;

  /**
   * The VPC configuration for the fleet.
   *
   * This is required for Elastic fleets, but not required for other fleet types.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-fleet.html#cfn-appstream-fleet-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnFleet.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `ComputeCapacityProperty`
 *
 * @param properties - the TypeScript properties of a `ComputeCapacityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetComputeCapacityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("desiredInstances", cdk.validateNumber)(properties.desiredInstances));
  errors.collect(cdk.propertyValidator("desiredSessions", cdk.validateNumber)(properties.desiredSessions));
  return errors.wrap("supplied properties not correct for \"ComputeCapacityProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetComputeCapacityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetComputeCapacityPropertyValidator(properties).assertSuccess();
  return {
    "DesiredInstances": cdk.numberToCloudFormation(properties.desiredInstances),
    "DesiredSessions": cdk.numberToCloudFormation(properties.desiredSessions)
  };
}

// @ts-ignore TS6133
function CfnFleetComputeCapacityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleet.ComputeCapacityProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.ComputeCapacityProperty>();
  ret.addPropertyResult("desiredInstances", "DesiredInstances", (properties.DesiredInstances != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredInstances) : undefined));
  ret.addPropertyResult("desiredSessions", "DesiredSessions", (properties.DesiredSessions != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredSessions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnFleetVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DomainJoinInfoProperty`
 *
 * @param properties - the TypeScript properties of a `DomainJoinInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetDomainJoinInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("directoryName", cdk.validateString)(properties.directoryName));
  errors.collect(cdk.propertyValidator("organizationalUnitDistinguishedName", cdk.validateString)(properties.organizationalUnitDistinguishedName));
  return errors.wrap("supplied properties not correct for \"DomainJoinInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetDomainJoinInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetDomainJoinInfoPropertyValidator(properties).assertSuccess();
  return {
    "DirectoryName": cdk.stringToCloudFormation(properties.directoryName),
    "OrganizationalUnitDistinguishedName": cdk.stringToCloudFormation(properties.organizationalUnitDistinguishedName)
  };
}

// @ts-ignore TS6133
function CfnFleetDomainJoinInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleet.DomainJoinInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.DomainJoinInfoProperty>();
  ret.addPropertyResult("directoryName", "DirectoryName", (properties.DirectoryName != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryName) : undefined));
  ret.addPropertyResult("organizationalUnitDistinguishedName", "OrganizationalUnitDistinguishedName", (properties.OrganizationalUnitDistinguishedName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnitDistinguishedName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFleetS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnFleetS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFleet.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleet.S3LocationProperty>();
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFleetProps`
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeCapacity", CfnFleetComputeCapacityPropertyValidator)(properties.computeCapacity));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disconnectTimeoutInSeconds", cdk.validateNumber)(properties.disconnectTimeoutInSeconds));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("domainJoinInfo", CfnFleetDomainJoinInfoPropertyValidator)(properties.domainJoinInfo));
  errors.collect(cdk.propertyValidator("enableDefaultInternetAccess", cdk.validateBoolean)(properties.enableDefaultInternetAccess));
  errors.collect(cdk.propertyValidator("fleetType", cdk.validateString)(properties.fleetType));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("idleDisconnectTimeoutInSeconds", cdk.validateNumber)(properties.idleDisconnectTimeoutInSeconds));
  errors.collect(cdk.propertyValidator("imageArn", cdk.validateString)(properties.imageArn));
  errors.collect(cdk.propertyValidator("imageName", cdk.validateString)(properties.imageName));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("maxConcurrentSessions", cdk.validateNumber)(properties.maxConcurrentSessions));
  errors.collect(cdk.propertyValidator("maxSessionsPerInstance", cdk.validateNumber)(properties.maxSessionsPerInstance));
  errors.collect(cdk.propertyValidator("maxUserDurationInSeconds", cdk.validateNumber)(properties.maxUserDurationInSeconds));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("platform", cdk.validateString)(properties.platform));
  errors.collect(cdk.propertyValidator("sessionScriptS3Location", CfnFleetS3LocationPropertyValidator)(properties.sessionScriptS3Location));
  errors.collect(cdk.propertyValidator("streamView", cdk.validateString)(properties.streamView));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("usbDeviceFilterStrings", cdk.listValidator(cdk.validateString))(properties.usbDeviceFilterStrings));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnFleetVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnFleetProps\"");
}

// @ts-ignore TS6133
function convertCfnFleetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetPropsValidator(properties).assertSuccess();
  return {
    "ComputeCapacity": convertCfnFleetComputeCapacityPropertyToCloudFormation(properties.computeCapacity),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisconnectTimeoutInSeconds": cdk.numberToCloudFormation(properties.disconnectTimeoutInSeconds),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "DomainJoinInfo": convertCfnFleetDomainJoinInfoPropertyToCloudFormation(properties.domainJoinInfo),
    "EnableDefaultInternetAccess": cdk.booleanToCloudFormation(properties.enableDefaultInternetAccess),
    "FleetType": cdk.stringToCloudFormation(properties.fleetType),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "IdleDisconnectTimeoutInSeconds": cdk.numberToCloudFormation(properties.idleDisconnectTimeoutInSeconds),
    "ImageArn": cdk.stringToCloudFormation(properties.imageArn),
    "ImageName": cdk.stringToCloudFormation(properties.imageName),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "MaxConcurrentSessions": cdk.numberToCloudFormation(properties.maxConcurrentSessions),
    "MaxSessionsPerInstance": cdk.numberToCloudFormation(properties.maxSessionsPerInstance),
    "MaxUserDurationInSeconds": cdk.numberToCloudFormation(properties.maxUserDurationInSeconds),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Platform": cdk.stringToCloudFormation(properties.platform),
    "SessionScriptS3Location": convertCfnFleetS3LocationPropertyToCloudFormation(properties.sessionScriptS3Location),
    "StreamView": cdk.stringToCloudFormation(properties.streamView),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UsbDeviceFilterStrings": cdk.listMapper(cdk.stringToCloudFormation)(properties.usbDeviceFilterStrings),
    "VpcConfig": convertCfnFleetVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnFleetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetProps>();
  ret.addPropertyResult("computeCapacity", "ComputeCapacity", (properties.ComputeCapacity != null ? CfnFleetComputeCapacityPropertyFromCloudFormation(properties.ComputeCapacity) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disconnectTimeoutInSeconds", "DisconnectTimeoutInSeconds", (properties.DisconnectTimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DisconnectTimeoutInSeconds) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("domainJoinInfo", "DomainJoinInfo", (properties.DomainJoinInfo != null ? CfnFleetDomainJoinInfoPropertyFromCloudFormation(properties.DomainJoinInfo) : undefined));
  ret.addPropertyResult("enableDefaultInternetAccess", "EnableDefaultInternetAccess", (properties.EnableDefaultInternetAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDefaultInternetAccess) : undefined));
  ret.addPropertyResult("fleetType", "FleetType", (properties.FleetType != null ? cfn_parse.FromCloudFormation.getString(properties.FleetType) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("idleDisconnectTimeoutInSeconds", "IdleDisconnectTimeoutInSeconds", (properties.IdleDisconnectTimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleDisconnectTimeoutInSeconds) : undefined));
  ret.addPropertyResult("imageArn", "ImageArn", (properties.ImageArn != null ? cfn_parse.FromCloudFormation.getString(properties.ImageArn) : undefined));
  ret.addPropertyResult("imageName", "ImageName", (properties.ImageName != null ? cfn_parse.FromCloudFormation.getString(properties.ImageName) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("maxConcurrentSessions", "MaxConcurrentSessions", (properties.MaxConcurrentSessions != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConcurrentSessions) : undefined));
  ret.addPropertyResult("maxSessionsPerInstance", "MaxSessionsPerInstance", (properties.MaxSessionsPerInstance != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSessionsPerInstance) : undefined));
  ret.addPropertyResult("maxUserDurationInSeconds", "MaxUserDurationInSeconds", (properties.MaxUserDurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxUserDurationInSeconds) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("platform", "Platform", (properties.Platform != null ? cfn_parse.FromCloudFormation.getString(properties.Platform) : undefined));
  ret.addPropertyResult("sessionScriptS3Location", "SessionScriptS3Location", (properties.SessionScriptS3Location != null ? CfnFleetS3LocationPropertyFromCloudFormation(properties.SessionScriptS3Location) : undefined));
  ret.addPropertyResult("streamView", "StreamView", (properties.StreamView != null ? cfn_parse.FromCloudFormation.getString(properties.StreamView) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("usbDeviceFilterStrings", "UsbDeviceFilterStrings", (properties.UsbDeviceFilterStrings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UsbDeviceFilterStrings) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnFleetVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppStream::ImageBuilder` resource creates an image builder for Amazon AppStream 2.0. An image builder is a virtual machine that is used to create an image.
 *
 * The initial state of the image builder is `PENDING` . When it is ready, the state is `RUNNING` .
 *
 * @cloudformationResource AWS::AppStream::ImageBuilder
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html
 */
export class CfnImageBuilder extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::ImageBuilder";

  /**
   * Build a CfnImageBuilder from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnImageBuilder {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnImageBuilderPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnImageBuilder(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The URL to start an image builder streaming session, returned as a string.
   *
   * @cloudformationAttribute StreamingUrl
   */
  public readonly attrStreamingUrl: string;

  /**
   * The list of virtual private cloud (VPC) interface endpoint objects.
   */
  public accessEndpoints?: Array<CfnImageBuilder.AccessEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The version of the AppStream 2.0 agent to use for this image builder. To use the latest version of the AppStream 2.0 agent, specify [LATEST].
   */
  public appstreamAgentVersion?: string;

  /**
   * The description to display.
   */
  public description?: string;

  /**
   * The image builder name to display.
   */
  public displayName?: string;

  /**
   * The name of the directory and organizational unit (OU) to use to join the image builder to a Microsoft Active Directory domain.
   */
  public domainJoinInfo?: CfnImageBuilder.DomainJoinInfoProperty | cdk.IResolvable;

  /**
   * Enables or disables default internet access for the image builder.
   */
  public enableDefaultInternetAccess?: boolean | cdk.IResolvable;

  /**
   * The ARN of the IAM role that is applied to the image builder.
   */
  public iamRoleArn?: string;

  /**
   * The ARN of the public, private, or shared image to use.
   */
  public imageArn?: string;

  /**
   * The name of the image used to create the image builder.
   */
  public imageName?: string;

  /**
   * The instance type to use when launching the image builder. The following instance types are available:.
   */
  public instanceType: string;

  /**
   * A unique name for the image builder.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The VPC configuration for the image builder.
   */
  public vpcConfig?: cdk.IResolvable | CfnImageBuilder.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnImageBuilderProps) {
    super(scope, id, {
      "type": CfnImageBuilder.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceType", this);
    cdk.requireProperty(props, "name", this);

    this.attrStreamingUrl = cdk.Token.asString(this.getAtt("StreamingUrl", cdk.ResolutionTypeHint.STRING));
    this.accessEndpoints = props.accessEndpoints;
    this.appstreamAgentVersion = props.appstreamAgentVersion;
    this.description = props.description;
    this.displayName = props.displayName;
    this.domainJoinInfo = props.domainJoinInfo;
    this.enableDefaultInternetAccess = props.enableDefaultInternetAccess;
    this.iamRoleArn = props.iamRoleArn;
    this.imageArn = props.imageArn;
    this.imageName = props.imageName;
    this.instanceType = props.instanceType;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppStream::ImageBuilder", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessEndpoints": this.accessEndpoints,
      "appstreamAgentVersion": this.appstreamAgentVersion,
      "description": this.description,
      "displayName": this.displayName,
      "domainJoinInfo": this.domainJoinInfo,
      "enableDefaultInternetAccess": this.enableDefaultInternetAccess,
      "iamRoleArn": this.iamRoleArn,
      "imageArn": this.imageArn,
      "imageName": this.imageName,
      "instanceType": this.instanceType,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnImageBuilder.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnImageBuilderPropsToCloudFormation(props);
  }
}

export namespace CfnImageBuilder {
  /**
   * The VPC configuration for the image builder.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * The identifiers of the security groups for the image builder.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-vpcconfig.html#cfn-appstream-imagebuilder-vpcconfig-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The identifier of the subnet to which a network interface is attached from the image builder instance.
     *
     * An image builder instance can use one subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-vpcconfig.html#cfn-appstream-imagebuilder-vpcconfig-subnetids
     */
    readonly subnetIds?: Array<string>;
  }

  /**
   * The name of the directory and organizational unit (OU) to use to join the image builder to a Microsoft Active Directory domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-domainjoininfo.html
   */
  export interface DomainJoinInfoProperty {
    /**
     * The fully qualified name of the directory (for example, corp.example.com).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-domainjoininfo.html#cfn-appstream-imagebuilder-domainjoininfo-directoryname
     */
    readonly directoryName?: string;

    /**
     * The distinguished name of the organizational unit for computer accounts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-domainjoininfo.html#cfn-appstream-imagebuilder-domainjoininfo-organizationalunitdistinguishedname
     */
    readonly organizationalUnitDistinguishedName?: string;
  }

  /**
   * Describes an interface VPC endpoint (interface endpoint) that lets you create a private connection between the virtual private cloud (VPC) that you specify and AppStream 2.0. When you specify an interface endpoint for a stack, users of the stack can connect to AppStream 2.0 only through that endpoint. When you specify an interface endpoint for an image builder, administrators can connect to the image builder only through that endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-accessendpoint.html
   */
  export interface AccessEndpointProperty {
    /**
     * The type of interface endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-accessendpoint.html#cfn-appstream-imagebuilder-accessendpoint-endpointtype
     */
    readonly endpointType: string;

    /**
     * The identifier (ID) of the VPC in which the interface endpoint is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-imagebuilder-accessendpoint.html#cfn-appstream-imagebuilder-accessendpoint-vpceid
     */
    readonly vpceId: string;
  }
}

/**
 * Properties for defining a `CfnImageBuilder`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html
 */
export interface CfnImageBuilderProps {
  /**
   * The list of virtual private cloud (VPC) interface endpoint objects.
   *
   * Administrators can connect to the image builder only through the specified endpoints.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-accessendpoints
   */
  readonly accessEndpoints?: Array<CfnImageBuilder.AccessEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The version of the AppStream 2.0 agent to use for this image builder. To use the latest version of the AppStream 2.0 agent, specify [LATEST].
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-appstreamagentversion
   */
  readonly appstreamAgentVersion?: string;

  /**
   * The description to display.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-description
   */
  readonly description?: string;

  /**
   * The image builder name to display.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-displayname
   */
  readonly displayName?: string;

  /**
   * The name of the directory and organizational unit (OU) to use to join the image builder to a Microsoft Active Directory domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-domainjoininfo
   */
  readonly domainJoinInfo?: CfnImageBuilder.DomainJoinInfoProperty | cdk.IResolvable;

  /**
   * Enables or disables default internet access for the image builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-enabledefaultinternetaccess
   */
  readonly enableDefaultInternetAccess?: boolean | cdk.IResolvable;

  /**
   * The ARN of the IAM role that is applied to the image builder.
   *
   * To assume a role, the image builder calls the AWS Security Token Service `AssumeRole` API operation and passes the ARN of the role to use. The operation creates a new session with temporary credentials. AppStream 2.0 retrieves the temporary credentials and creates the *appstream_machine_role* credential profile on the instance.
   *
   * For more information, see [Using an IAM Role to Grant Permissions to Applications and Scripts Running on AppStream 2.0 Streaming Instances](https://docs.aws.amazon.com/appstream2/latest/developerguide/using-iam-roles-to-grant-permissions-to-applications-scripts-streaming-instances.html) in the *Amazon AppStream 2.0 Administration Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-iamrolearn
   */
  readonly iamRoleArn?: string;

  /**
   * The ARN of the public, private, or shared image to use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-imagearn
   */
  readonly imageArn?: string;

  /**
   * The name of the image used to create the image builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-imagename
   */
  readonly imageName?: string;

  /**
   * The instance type to use when launching the image builder. The following instance types are available:.
   *
   * - stream.standard.small
   * - stream.standard.medium
   * - stream.standard.large
   * - stream.compute.large
   * - stream.compute.xlarge
   * - stream.compute.2xlarge
   * - stream.compute.4xlarge
   * - stream.compute.8xlarge
   * - stream.memory.large
   * - stream.memory.xlarge
   * - stream.memory.2xlarge
   * - stream.memory.4xlarge
   * - stream.memory.8xlarge
   * - stream.memory.z1d.large
   * - stream.memory.z1d.xlarge
   * - stream.memory.z1d.2xlarge
   * - stream.memory.z1d.3xlarge
   * - stream.memory.z1d.6xlarge
   * - stream.memory.z1d.12xlarge
   * - stream.graphics-design.large
   * - stream.graphics-design.xlarge
   * - stream.graphics-design.2xlarge
   * - stream.graphics-design.4xlarge
   * - stream.graphics-desktop.2xlarge
   * - stream.graphics.g4dn.xlarge
   * - stream.graphics.g4dn.2xlarge
   * - stream.graphics.g4dn.4xlarge
   * - stream.graphics.g4dn.8xlarge
   * - stream.graphics.g4dn.12xlarge
   * - stream.graphics.g4dn.16xlarge
   * - stream.graphics-pro.4xlarge
   * - stream.graphics-pro.8xlarge
   * - stream.graphics-pro.16xlarge
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-instancetype
   */
  readonly instanceType: string;

  /**
   * A unique name for the image builder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-name
   */
  readonly name: string;

  /**
   * An array of key-value pairs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The VPC configuration for the image builder.
   *
   * You can specify only one subnet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-imagebuilder.html#cfn-appstream-imagebuilder-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnImageBuilder.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageBuilderVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageBuilderVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageBuilderVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnImageBuilderVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnImageBuilder.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageBuilder.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DomainJoinInfoProperty`
 *
 * @param properties - the TypeScript properties of a `DomainJoinInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageBuilderDomainJoinInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("directoryName", cdk.validateString)(properties.directoryName));
  errors.collect(cdk.propertyValidator("organizationalUnitDistinguishedName", cdk.validateString)(properties.organizationalUnitDistinguishedName));
  return errors.wrap("supplied properties not correct for \"DomainJoinInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageBuilderDomainJoinInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageBuilderDomainJoinInfoPropertyValidator(properties).assertSuccess();
  return {
    "DirectoryName": cdk.stringToCloudFormation(properties.directoryName),
    "OrganizationalUnitDistinguishedName": cdk.stringToCloudFormation(properties.organizationalUnitDistinguishedName)
  };
}

// @ts-ignore TS6133
function CfnImageBuilderDomainJoinInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageBuilder.DomainJoinInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageBuilder.DomainJoinInfoProperty>();
  ret.addPropertyResult("directoryName", "DirectoryName", (properties.DirectoryName != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryName) : undefined));
  ret.addPropertyResult("organizationalUnitDistinguishedName", "OrganizationalUnitDistinguishedName", (properties.OrganizationalUnitDistinguishedName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnitDistinguishedName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `AccessEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageBuilderAccessEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpointType", cdk.requiredValidator)(properties.endpointType));
  errors.collect(cdk.propertyValidator("endpointType", cdk.validateString)(properties.endpointType));
  errors.collect(cdk.propertyValidator("vpceId", cdk.requiredValidator)(properties.vpceId));
  errors.collect(cdk.propertyValidator("vpceId", cdk.validateString)(properties.vpceId));
  return errors.wrap("supplied properties not correct for \"AccessEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnImageBuilderAccessEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageBuilderAccessEndpointPropertyValidator(properties).assertSuccess();
  return {
    "EndpointType": cdk.stringToCloudFormation(properties.endpointType),
    "VpceId": cdk.stringToCloudFormation(properties.vpceId)
  };
}

// @ts-ignore TS6133
function CfnImageBuilderAccessEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageBuilder.AccessEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageBuilder.AccessEndpointProperty>();
  ret.addPropertyResult("endpointType", "EndpointType", (properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined));
  ret.addPropertyResult("vpceId", "VpceId", (properties.VpceId != null ? cfn_parse.FromCloudFormation.getString(properties.VpceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnImageBuilderProps`
 *
 * @param properties - the TypeScript properties of a `CfnImageBuilderProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnImageBuilderPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessEndpoints", cdk.listValidator(CfnImageBuilderAccessEndpointPropertyValidator))(properties.accessEndpoints));
  errors.collect(cdk.propertyValidator("appstreamAgentVersion", cdk.validateString)(properties.appstreamAgentVersion));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("domainJoinInfo", CfnImageBuilderDomainJoinInfoPropertyValidator)(properties.domainJoinInfo));
  errors.collect(cdk.propertyValidator("enableDefaultInternetAccess", cdk.validateBoolean)(properties.enableDefaultInternetAccess));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("imageArn", cdk.validateString)(properties.imageArn));
  errors.collect(cdk.propertyValidator("imageName", cdk.validateString)(properties.imageName));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnImageBuilderVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnImageBuilderProps\"");
}

// @ts-ignore TS6133
function convertCfnImageBuilderPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnImageBuilderPropsValidator(properties).assertSuccess();
  return {
    "AccessEndpoints": cdk.listMapper(convertCfnImageBuilderAccessEndpointPropertyToCloudFormation)(properties.accessEndpoints),
    "AppstreamAgentVersion": cdk.stringToCloudFormation(properties.appstreamAgentVersion),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "DomainJoinInfo": convertCfnImageBuilderDomainJoinInfoPropertyToCloudFormation(properties.domainJoinInfo),
    "EnableDefaultInternetAccess": cdk.booleanToCloudFormation(properties.enableDefaultInternetAccess),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "ImageArn": cdk.stringToCloudFormation(properties.imageArn),
    "ImageName": cdk.stringToCloudFormation(properties.imageName),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcConfig": convertCfnImageBuilderVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnImageBuilderPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnImageBuilderProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnImageBuilderProps>();
  ret.addPropertyResult("accessEndpoints", "AccessEndpoints", (properties.AccessEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnImageBuilderAccessEndpointPropertyFromCloudFormation)(properties.AccessEndpoints) : undefined));
  ret.addPropertyResult("appstreamAgentVersion", "AppstreamAgentVersion", (properties.AppstreamAgentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AppstreamAgentVersion) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("domainJoinInfo", "DomainJoinInfo", (properties.DomainJoinInfo != null ? CfnImageBuilderDomainJoinInfoPropertyFromCloudFormation(properties.DomainJoinInfo) : undefined));
  ret.addPropertyResult("enableDefaultInternetAccess", "EnableDefaultInternetAccess", (properties.EnableDefaultInternetAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDefaultInternetAccess) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("imageArn", "ImageArn", (properties.ImageArn != null ? cfn_parse.FromCloudFormation.getString(properties.ImageArn) : undefined));
  ret.addPropertyResult("imageName", "ImageName", (properties.ImageName != null ? cfn_parse.FromCloudFormation.getString(properties.ImageName) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnImageBuilderVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppStream::Stack` resource creates a stack to start streaming applications to Amazon AppStream 2.0 users. A stack consists of an associated fleet, user access policies, and storage configurations.
 *
 * @cloudformationResource AWS::AppStream::Stack
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html
 */
export class CfnStack extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::Stack";

  /**
   * Build a CfnStack from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStack {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStackPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStack(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The list of virtual private cloud (VPC) interface endpoint objects.
   */
  public accessEndpoints?: Array<CfnStack.AccessEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The persistent application settings for users of the stack.
   */
  public applicationSettings?: CfnStack.ApplicationSettingsProperty | cdk.IResolvable;

  /**
   * The stack attributes to delete.
   */
  public attributesToDelete?: Array<string>;

  /**
   * *This parameter has been deprecated.*.
   */
  public deleteStorageConnectors?: boolean | cdk.IResolvable;

  /**
   * The description to display.
   */
  public description?: string;

  /**
   * The stack name to display.
   */
  public displayName?: string;

  /**
   * The domains where AppStream 2.0 streaming sessions can be embedded in an iframe. You must approve the domains that you want to host embedded AppStream 2.0 streaming sessions.
   */
  public embedHostDomains?: Array<string>;

  /**
   * The URL that users are redirected to after they click the Send Feedback link.
   */
  public feedbackUrl?: string;

  /**
   * The name of the stack.
   */
  public name?: string;

  /**
   * The URL that users are redirected to after their streaming session ends.
   */
  public redirectUrl?: string;

  /**
   * The storage connectors to enable.
   */
  public storageConnectors?: Array<cdk.IResolvable | CfnStack.StorageConnectorProperty> | cdk.IResolvable;

  /**
   * The streaming protocol that you want your stack to prefer.
   */
  public streamingExperienceSettings?: cdk.IResolvable | CfnStack.StreamingExperienceSettingsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The actions that are enabled or disabled for users during their streaming sessions.
   */
  public userSettings?: Array<cdk.IResolvable | CfnStack.UserSettingProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStackProps = {}) {
    super(scope, id, {
      "type": CfnStack.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.accessEndpoints = props.accessEndpoints;
    this.applicationSettings = props.applicationSettings;
    this.attributesToDelete = props.attributesToDelete;
    this.deleteStorageConnectors = props.deleteStorageConnectors;
    this.description = props.description;
    this.displayName = props.displayName;
    this.embedHostDomains = props.embedHostDomains;
    this.feedbackUrl = props.feedbackUrl;
    this.name = props.name;
    this.redirectUrl = props.redirectUrl;
    this.storageConnectors = props.storageConnectors;
    this.streamingExperienceSettings = props.streamingExperienceSettings;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppStream::Stack", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userSettings = props.userSettings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessEndpoints": this.accessEndpoints,
      "applicationSettings": this.applicationSettings,
      "attributesToDelete": this.attributesToDelete,
      "deleteStorageConnectors": this.deleteStorageConnectors,
      "description": this.description,
      "displayName": this.displayName,
      "embedHostDomains": this.embedHostDomains,
      "feedbackUrl": this.feedbackUrl,
      "name": this.name,
      "redirectUrl": this.redirectUrl,
      "storageConnectors": this.storageConnectors,
      "streamingExperienceSettings": this.streamingExperienceSettings,
      "tags": this.tags.renderTags(),
      "userSettings": this.userSettings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStack.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStackPropsToCloudFormation(props);
  }
}

export namespace CfnStack {
  /**
   * A connector that enables persistent storage for users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-storageconnector.html
   */
  export interface StorageConnectorProperty {
    /**
     * The type of storage connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-storageconnector.html#cfn-appstream-stack-storageconnector-connectortype
     */
    readonly connectorType: string;

    /**
     * The names of the domains for the account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-storageconnector.html#cfn-appstream-stack-storageconnector-domains
     */
    readonly domains?: Array<string>;

    /**
     * The ARN of the storage connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-storageconnector.html#cfn-appstream-stack-storageconnector-resourceidentifier
     */
    readonly resourceIdentifier?: string;
  }

  /**
   * Specifies an action and whether the action is enabled or disabled for users during their streaming sessions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-usersetting.html
   */
  export interface UserSettingProperty {
    /**
     * The action that is enabled or disabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-usersetting.html#cfn-appstream-stack-usersetting-action
     */
    readonly action: string;

    /**
     * Specifies the number of characters that can be copied by end users from the local device to the remote session, and to the local device from the remote session.
     *
     * This can be specified only for the `CLIPBOARD_COPY_FROM_LOCAL_DEVICE` and `CLIPBOARD_COPY_TO_LOCAL_DEVICE` actions.
     *
     * This defaults to 20,971,520 (20 MB) when unspecified and the permission is `ENABLED` . This can't be specified when the permission is `DISABLED` .
     *
     * This can only be specified for AlwaysOn and OnDemand fleets. The attribute is not supported on Elastic fleets.
     *
     * The value can be between 1 and 20,971,520 (20 MB).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-usersetting.html#cfn-appstream-stack-usersetting-maximumlength
     */
    readonly maximumLength?: number;

    /**
     * Indicates whether the action is enabled or disabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-usersetting.html#cfn-appstream-stack-usersetting-permission
     */
    readonly permission: string;
  }

  /**
   * The streaming protocol that you want your stack to prefer.
   *
   * This can be UDP or TCP. Currently, UDP is only supported in the Windows native client.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-streamingexperiencesettings.html
   */
  export interface StreamingExperienceSettingsProperty {
    /**
     * The preferred protocol that you want to use while streaming your application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-streamingexperiencesettings.html#cfn-appstream-stack-streamingexperiencesettings-preferredprotocol
     */
    readonly preferredProtocol?: string;
  }

  /**
   * The persistent application settings for users of a stack.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-applicationsettings.html
   */
  export interface ApplicationSettingsProperty {
    /**
     * Enables or disables persistent application settings for users during their streaming sessions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-applicationsettings.html#cfn-appstream-stack-applicationsettings-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The path prefix for the S3 bucket where users’ persistent application settings are stored.
     *
     * You can allow the same persistent application settings to be used across multiple stacks by specifying the same settings group for each stack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-applicationsettings.html#cfn-appstream-stack-applicationsettings-settingsgroup
     */
    readonly settingsGroup?: string;
  }

  /**
   * Describes an interface VPC endpoint (interface endpoint) that lets you create a private connection between the virtual private cloud (VPC) that you specify and AppStream 2.0. When you specify an interface endpoint for a stack, users of the stack can connect to AppStream 2.0 only through that endpoint. When you specify an interface endpoint for an image builder, administrators can connect to the image builder only through that endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-accessendpoint.html
   */
  export interface AccessEndpointProperty {
    /**
     * The type of interface endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-accessendpoint.html#cfn-appstream-stack-accessendpoint-endpointtype
     */
    readonly endpointType: string;

    /**
     * The identifier (ID) of the VPC in which the interface endpoint is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appstream-stack-accessendpoint.html#cfn-appstream-stack-accessendpoint-vpceid
     */
    readonly vpceId: string;
  }
}

/**
 * Properties for defining a `CfnStack`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html
 */
export interface CfnStackProps {
  /**
   * The list of virtual private cloud (VPC) interface endpoint objects.
   *
   * Users of the stack can connect to AppStream 2.0 only through the specified endpoints.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-accessendpoints
   */
  readonly accessEndpoints?: Array<CfnStack.AccessEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The persistent application settings for users of the stack.
   *
   * When these settings are enabled, changes that users make to applications and Windows settings are automatically saved after each session and applied to the next session.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-applicationsettings
   */
  readonly applicationSettings?: CfnStack.ApplicationSettingsProperty | cdk.IResolvable;

  /**
   * The stack attributes to delete.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-attributestodelete
   */
  readonly attributesToDelete?: Array<string>;

  /**
   * *This parameter has been deprecated.*.
   *
   * Deletes the storage connectors currently enabled for the stack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-deletestorageconnectors
   */
  readonly deleteStorageConnectors?: boolean | cdk.IResolvable;

  /**
   * The description to display.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-description
   */
  readonly description?: string;

  /**
   * The stack name to display.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-displayname
   */
  readonly displayName?: string;

  /**
   * The domains where AppStream 2.0 streaming sessions can be embedded in an iframe. You must approve the domains that you want to host embedded AppStream 2.0 streaming sessions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-embedhostdomains
   */
  readonly embedHostDomains?: Array<string>;

  /**
   * The URL that users are redirected to after they click the Send Feedback link.
   *
   * If no URL is specified, no Send Feedback link is displayed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-feedbackurl
   */
  readonly feedbackUrl?: string;

  /**
   * The name of the stack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-name
   */
  readonly name?: string;

  /**
   * The URL that users are redirected to after their streaming session ends.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-redirecturl
   */
  readonly redirectUrl?: string;

  /**
   * The storage connectors to enable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-storageconnectors
   */
  readonly storageConnectors?: Array<cdk.IResolvable | CfnStack.StorageConnectorProperty> | cdk.IResolvable;

  /**
   * The streaming protocol that you want your stack to prefer.
   *
   * This can be UDP or TCP. Currently, UDP is only supported in the Windows native client.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-streamingexperiencesettings
   */
  readonly streamingExperienceSettings?: cdk.IResolvable | CfnStack.StreamingExperienceSettingsProperty;

  /**
   * An array of key-value pairs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The actions that are enabled or disabled for users during their streaming sessions.
   *
   * By default, these actions are enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stack.html#cfn-appstream-stack-usersettings
   */
  readonly userSettings?: Array<cdk.IResolvable | CfnStack.UserSettingProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `StorageConnectorProperty`
 *
 * @param properties - the TypeScript properties of a `StorageConnectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackStorageConnectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorType", cdk.requiredValidator)(properties.connectorType));
  errors.collect(cdk.propertyValidator("connectorType", cdk.validateString)(properties.connectorType));
  errors.collect(cdk.propertyValidator("domains", cdk.listValidator(cdk.validateString))(properties.domains));
  errors.collect(cdk.propertyValidator("resourceIdentifier", cdk.validateString)(properties.resourceIdentifier));
  return errors.wrap("supplied properties not correct for \"StorageConnectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackStorageConnectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackStorageConnectorPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorType": cdk.stringToCloudFormation(properties.connectorType),
    "Domains": cdk.listMapper(cdk.stringToCloudFormation)(properties.domains),
    "ResourceIdentifier": cdk.stringToCloudFormation(properties.resourceIdentifier)
  };
}

// @ts-ignore TS6133
function CfnStackStorageConnectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStack.StorageConnectorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.StorageConnectorProperty>();
  ret.addPropertyResult("connectorType", "ConnectorType", (properties.ConnectorType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorType) : undefined));
  ret.addPropertyResult("domains", "Domains", (properties.Domains != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Domains) : undefined));
  ret.addPropertyResult("resourceIdentifier", "ResourceIdentifier", (properties.ResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserSettingProperty`
 *
 * @param properties - the TypeScript properties of a `UserSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackUserSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("maximumLength", cdk.validateNumber)(properties.maximumLength));
  errors.collect(cdk.propertyValidator("permission", cdk.requiredValidator)(properties.permission));
  errors.collect(cdk.propertyValidator("permission", cdk.validateString)(properties.permission));
  return errors.wrap("supplied properties not correct for \"UserSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackUserSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackUserSettingPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "MaximumLength": cdk.numberToCloudFormation(properties.maximumLength),
    "Permission": cdk.stringToCloudFormation(properties.permission)
  };
}

// @ts-ignore TS6133
function CfnStackUserSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStack.UserSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.UserSettingProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("maximumLength", "MaximumLength", (properties.MaximumLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumLength) : undefined));
  ret.addPropertyResult("permission", "Permission", (properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StreamingExperienceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `StreamingExperienceSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackStreamingExperienceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("preferredProtocol", cdk.validateString)(properties.preferredProtocol));
  return errors.wrap("supplied properties not correct for \"StreamingExperienceSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackStreamingExperienceSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackStreamingExperienceSettingsPropertyValidator(properties).assertSuccess();
  return {
    "PreferredProtocol": cdk.stringToCloudFormation(properties.preferredProtocol)
  };
}

// @ts-ignore TS6133
function CfnStackStreamingExperienceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStack.StreamingExperienceSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.StreamingExperienceSettingsProperty>();
  ret.addPropertyResult("preferredProtocol", "PreferredProtocol", (properties.PreferredProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredProtocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApplicationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackApplicationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("settingsGroup", cdk.validateString)(properties.settingsGroup));
  return errors.wrap("supplied properties not correct for \"ApplicationSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackApplicationSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackApplicationSettingsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "SettingsGroup": cdk.stringToCloudFormation(properties.settingsGroup)
  };
}

// @ts-ignore TS6133
function CfnStackApplicationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.ApplicationSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.ApplicationSettingsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("settingsGroup", "SettingsGroup", (properties.SettingsGroup != null ? cfn_parse.FromCloudFormation.getString(properties.SettingsGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `AccessEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackAccessEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpointType", cdk.requiredValidator)(properties.endpointType));
  errors.collect(cdk.propertyValidator("endpointType", cdk.validateString)(properties.endpointType));
  errors.collect(cdk.propertyValidator("vpceId", cdk.requiredValidator)(properties.vpceId));
  errors.collect(cdk.propertyValidator("vpceId", cdk.validateString)(properties.vpceId));
  return errors.wrap("supplied properties not correct for \"AccessEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackAccessEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackAccessEndpointPropertyValidator(properties).assertSuccess();
  return {
    "EndpointType": cdk.stringToCloudFormation(properties.endpointType),
    "VpceId": cdk.stringToCloudFormation(properties.vpceId)
  };
}

// @ts-ignore TS6133
function CfnStackAccessEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.AccessEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.AccessEndpointProperty>();
  ret.addPropertyResult("endpointType", "EndpointType", (properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined));
  ret.addPropertyResult("vpceId", "VpceId", (properties.VpceId != null ? cfn_parse.FromCloudFormation.getString(properties.VpceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStackProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessEndpoints", cdk.listValidator(CfnStackAccessEndpointPropertyValidator))(properties.accessEndpoints));
  errors.collect(cdk.propertyValidator("applicationSettings", CfnStackApplicationSettingsPropertyValidator)(properties.applicationSettings));
  errors.collect(cdk.propertyValidator("attributesToDelete", cdk.listValidator(cdk.validateString))(properties.attributesToDelete));
  errors.collect(cdk.propertyValidator("deleteStorageConnectors", cdk.validateBoolean)(properties.deleteStorageConnectors));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("embedHostDomains", cdk.listValidator(cdk.validateString))(properties.embedHostDomains));
  errors.collect(cdk.propertyValidator("feedbackUrl", cdk.validateString)(properties.feedbackUrl));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("redirectUrl", cdk.validateString)(properties.redirectUrl));
  errors.collect(cdk.propertyValidator("storageConnectors", cdk.listValidator(CfnStackStorageConnectorPropertyValidator))(properties.storageConnectors));
  errors.collect(cdk.propertyValidator("streamingExperienceSettings", CfnStackStreamingExperienceSettingsPropertyValidator)(properties.streamingExperienceSettings));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userSettings", cdk.listValidator(CfnStackUserSettingPropertyValidator))(properties.userSettings));
  return errors.wrap("supplied properties not correct for \"CfnStackProps\"");
}

// @ts-ignore TS6133
function convertCfnStackPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackPropsValidator(properties).assertSuccess();
  return {
    "AccessEndpoints": cdk.listMapper(convertCfnStackAccessEndpointPropertyToCloudFormation)(properties.accessEndpoints),
    "ApplicationSettings": convertCfnStackApplicationSettingsPropertyToCloudFormation(properties.applicationSettings),
    "AttributesToDelete": cdk.listMapper(cdk.stringToCloudFormation)(properties.attributesToDelete),
    "DeleteStorageConnectors": cdk.booleanToCloudFormation(properties.deleteStorageConnectors),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "EmbedHostDomains": cdk.listMapper(cdk.stringToCloudFormation)(properties.embedHostDomains),
    "FeedbackURL": cdk.stringToCloudFormation(properties.feedbackUrl),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RedirectURL": cdk.stringToCloudFormation(properties.redirectUrl),
    "StorageConnectors": cdk.listMapper(convertCfnStackStorageConnectorPropertyToCloudFormation)(properties.storageConnectors),
    "StreamingExperienceSettings": convertCfnStackStreamingExperienceSettingsPropertyToCloudFormation(properties.streamingExperienceSettings),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserSettings": cdk.listMapper(convertCfnStackUserSettingPropertyToCloudFormation)(properties.userSettings)
  };
}

// @ts-ignore TS6133
function CfnStackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackProps>();
  ret.addPropertyResult("accessEndpoints", "AccessEndpoints", (properties.AccessEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnStackAccessEndpointPropertyFromCloudFormation)(properties.AccessEndpoints) : undefined));
  ret.addPropertyResult("applicationSettings", "ApplicationSettings", (properties.ApplicationSettings != null ? CfnStackApplicationSettingsPropertyFromCloudFormation(properties.ApplicationSettings) : undefined));
  ret.addPropertyResult("attributesToDelete", "AttributesToDelete", (properties.AttributesToDelete != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AttributesToDelete) : undefined));
  ret.addPropertyResult("deleteStorageConnectors", "DeleteStorageConnectors", (properties.DeleteStorageConnectors != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteStorageConnectors) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("embedHostDomains", "EmbedHostDomains", (properties.EmbedHostDomains != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EmbedHostDomains) : undefined));
  ret.addPropertyResult("feedbackUrl", "FeedbackURL", (properties.FeedbackURL != null ? cfn_parse.FromCloudFormation.getString(properties.FeedbackURL) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("redirectUrl", "RedirectURL", (properties.RedirectURL != null ? cfn_parse.FromCloudFormation.getString(properties.RedirectURL) : undefined));
  ret.addPropertyResult("storageConnectors", "StorageConnectors", (properties.StorageConnectors != null ? cfn_parse.FromCloudFormation.getArray(CfnStackStorageConnectorPropertyFromCloudFormation)(properties.StorageConnectors) : undefined));
  ret.addPropertyResult("streamingExperienceSettings", "StreamingExperienceSettings", (properties.StreamingExperienceSettings != null ? CfnStackStreamingExperienceSettingsPropertyFromCloudFormation(properties.StreamingExperienceSettings) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userSettings", "UserSettings", (properties.UserSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnStackUserSettingPropertyFromCloudFormation)(properties.UserSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppStream::StackFleetAssociation` resource associates the specified fleet with the specified stack for Amazon AppStream 2.0.
 *
 * @cloudformationResource AWS::AppStream::StackFleetAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackfleetassociation.html
 */
export class CfnStackFleetAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::StackFleetAssociation";

  /**
   * Build a CfnStackFleetAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStackFleetAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStackFleetAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStackFleetAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the fleet.
   */
  public fleetName: string;

  /**
   * The name of the stack.
   */
  public stackName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStackFleetAssociationProps) {
    super(scope, id, {
      "type": CfnStackFleetAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "fleetName", this);
    cdk.requireProperty(props, "stackName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.fleetName = props.fleetName;
    this.stackName = props.stackName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "fleetName": this.fleetName,
      "stackName": this.stackName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStackFleetAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStackFleetAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStackFleetAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackfleetassociation.html
 */
export interface CfnStackFleetAssociationProps {
  /**
   * The name of the fleet.
   *
   * To associate a fleet with a stack, you must specify a dependency on the fleet resource. For more information, see [DependsOn Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackfleetassociation.html#cfn-appstream-stackfleetassociation-fleetname
   */
  readonly fleetName: string;

  /**
   * The name of the stack.
   *
   * To associate a fleet with a stack, you must specify a dependency on the stack resource. For more information, see [DependsOn Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackfleetassociation.html#cfn-appstream-stackfleetassociation-stackname
   */
  readonly stackName: string;
}

/**
 * Determine whether the given properties match those of a `CfnStackFleetAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackFleetAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackFleetAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fleetName", cdk.requiredValidator)(properties.fleetName));
  errors.collect(cdk.propertyValidator("fleetName", cdk.validateString)(properties.fleetName));
  errors.collect(cdk.propertyValidator("stackName", cdk.requiredValidator)(properties.stackName));
  errors.collect(cdk.propertyValidator("stackName", cdk.validateString)(properties.stackName));
  return errors.wrap("supplied properties not correct for \"CfnStackFleetAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnStackFleetAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackFleetAssociationPropsValidator(properties).assertSuccess();
  return {
    "FleetName": cdk.stringToCloudFormation(properties.fleetName),
    "StackName": cdk.stringToCloudFormation(properties.stackName)
  };
}

// @ts-ignore TS6133
function CfnStackFleetAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackFleetAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackFleetAssociationProps>();
  ret.addPropertyResult("fleetName", "FleetName", (properties.FleetName != null ? cfn_parse.FromCloudFormation.getString(properties.FleetName) : undefined));
  ret.addPropertyResult("stackName", "StackName", (properties.StackName != null ? cfn_parse.FromCloudFormation.getString(properties.StackName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppStream::StackUserAssociation` resource associates the specified users with the specified stacks for Amazon AppStream 2.0. Users in an AppStream 2.0 user pool cannot be assigned to stacks with fleets that are joined to an Active Directory domain.
 *
 * @cloudformationResource AWS::AppStream::StackUserAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackuserassociation.html
 */
export class CfnStackUserAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::StackUserAssociation";

  /**
   * Build a CfnStackUserAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStackUserAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStackUserAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStackUserAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The authentication type for the user who is associated with the stack.
   */
  public authenticationType: string;

  /**
   * Specifies whether a welcome email is sent to a user after the user is created in the user pool.
   */
  public sendEmailNotification?: boolean | cdk.IResolvable;

  /**
   * The name of the stack that is associated with the user.
   */
  public stackName: string;

  /**
   * The email address of the user who is associated with the stack.
   */
  public userName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStackUserAssociationProps) {
    super(scope, id, {
      "type": CfnStackUserAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authenticationType", this);
    cdk.requireProperty(props, "stackName", this);
    cdk.requireProperty(props, "userName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.authenticationType = props.authenticationType;
    this.sendEmailNotification = props.sendEmailNotification;
    this.stackName = props.stackName;
    this.userName = props.userName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authenticationType": this.authenticationType,
      "sendEmailNotification": this.sendEmailNotification,
      "stackName": this.stackName,
      "userName": this.userName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStackUserAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStackUserAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStackUserAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackuserassociation.html
 */
export interface CfnStackUserAssociationProps {
  /**
   * The authentication type for the user who is associated with the stack.
   *
   * You must specify USERPOOL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackuserassociation.html#cfn-appstream-stackuserassociation-authenticationtype
   */
  readonly authenticationType: string;

  /**
   * Specifies whether a welcome email is sent to a user after the user is created in the user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackuserassociation.html#cfn-appstream-stackuserassociation-sendemailnotification
   */
  readonly sendEmailNotification?: boolean | cdk.IResolvable;

  /**
   * The name of the stack that is associated with the user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackuserassociation.html#cfn-appstream-stackuserassociation-stackname
   */
  readonly stackName: string;

  /**
   * The email address of the user who is associated with the stack.
   *
   * > Users' email addresses are case-sensitive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-stackuserassociation.html#cfn-appstream-stackuserassociation-username
   */
  readonly userName: string;
}

/**
 * Determine whether the given properties match those of a `CfnStackUserAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackUserAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackUserAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationType", cdk.requiredValidator)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("sendEmailNotification", cdk.validateBoolean)(properties.sendEmailNotification));
  errors.collect(cdk.propertyValidator("stackName", cdk.requiredValidator)(properties.stackName));
  errors.collect(cdk.propertyValidator("stackName", cdk.validateString)(properties.stackName));
  errors.collect(cdk.propertyValidator("userName", cdk.requiredValidator)(properties.userName));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  return errors.wrap("supplied properties not correct for \"CfnStackUserAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnStackUserAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackUserAssociationPropsValidator(properties).assertSuccess();
  return {
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "SendEmailNotification": cdk.booleanToCloudFormation(properties.sendEmailNotification),
    "StackName": cdk.stringToCloudFormation(properties.stackName),
    "UserName": cdk.stringToCloudFormation(properties.userName)
  };
}

// @ts-ignore TS6133
function CfnStackUserAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackUserAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackUserAssociationProps>();
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("sendEmailNotification", "SendEmailNotification", (properties.SendEmailNotification != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SendEmailNotification) : undefined));
  ret.addPropertyResult("stackName", "StackName", (properties.StackName != null ? cfn_parse.FromCloudFormation.getString(properties.StackName) : undefined));
  ret.addPropertyResult("userName", "UserName", (properties.UserName != null ? cfn_parse.FromCloudFormation.getString(properties.UserName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppStream::User` resource creates a new user in the AppStream 2.0 user pool.
 *
 * @cloudformationResource AWS::AppStream::User
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppStream::User";

  /**
   * Build a CfnUser from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUser {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUser(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The authentication type for the user.
   */
  public authenticationType: string;

  /**
   * The first name, or given name, of the user.
   */
  public firstName?: string;

  /**
   * The last name, or surname, of the user.
   */
  public lastName?: string;

  /**
   * The action to take for the welcome email that is sent to a user after the user is created in the user pool.
   */
  public messageAction?: string;

  /**
   * The email address of the user.
   */
  public userName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserProps) {
    super(scope, id, {
      "type": CfnUser.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authenticationType", this);
    cdk.requireProperty(props, "userName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.authenticationType = props.authenticationType;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.messageAction = props.messageAction;
    this.userName = props.userName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authenticationType": this.authenticationType,
      "firstName": this.firstName,
      "lastName": this.lastName,
      "messageAction": this.messageAction,
      "userName": this.userName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-user.html
 */
export interface CfnUserProps {
  /**
   * The authentication type for the user.
   *
   * You must specify USERPOOL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-user.html#cfn-appstream-user-authenticationtype
   */
  readonly authenticationType: string;

  /**
   * The first name, or given name, of the user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-user.html#cfn-appstream-user-firstname
   */
  readonly firstName?: string;

  /**
   * The last name, or surname, of the user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-user.html#cfn-appstream-user-lastname
   */
  readonly lastName?: string;

  /**
   * The action to take for the welcome email that is sent to a user after the user is created in the user pool.
   *
   * If you specify SUPPRESS, no email is sent. If you specify RESEND, do not specify the first name or last name of the user. If the value is null, the email is sent.
   *
   * > The temporary password in the welcome email is valid for only 7 days. If users don’t set their passwords within 7 days, you must send them a new welcome email.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-user.html#cfn-appstream-user-messageaction
   */
  readonly messageAction?: string;

  /**
   * The email address of the user.
   *
   * Users' email addresses are case-sensitive. During login, if they specify an email address that doesn't use the same capitalization as the email address specified when their user pool account was created, a "user does not exist" error message displays.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appstream-user.html#cfn-appstream-user-username
   */
  readonly userName: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationType", cdk.requiredValidator)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("firstName", cdk.validateString)(properties.firstName));
  errors.collect(cdk.propertyValidator("lastName", cdk.validateString)(properties.lastName));
  errors.collect(cdk.propertyValidator("messageAction", cdk.validateString)(properties.messageAction));
  errors.collect(cdk.propertyValidator("userName", cdk.requiredValidator)(properties.userName));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  return errors.wrap("supplied properties not correct for \"CfnUserProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPropsValidator(properties).assertSuccess();
  return {
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "FirstName": cdk.stringToCloudFormation(properties.firstName),
    "LastName": cdk.stringToCloudFormation(properties.lastName),
    "MessageAction": cdk.stringToCloudFormation(properties.messageAction),
    "UserName": cdk.stringToCloudFormation(properties.userName)
  };
}

// @ts-ignore TS6133
function CfnUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProps>();
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("firstName", "FirstName", (properties.FirstName != null ? cfn_parse.FromCloudFormation.getString(properties.FirstName) : undefined));
  ret.addPropertyResult("lastName", "LastName", (properties.LastName != null ? cfn_parse.FromCloudFormation.getString(properties.LastName) : undefined));
  ret.addPropertyResult("messageAction", "MessageAction", (properties.MessageAction != null ? cfn_parse.FromCloudFormation.getString(properties.MessageAction) : undefined));
  ret.addPropertyResult("userName", "UserName", (properties.UserName != null ? cfn_parse.FromCloudFormation.getString(properties.UserName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}