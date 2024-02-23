/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::CodePipeline::CustomActionType` resource creates a custom action for activities that aren't included in the CodePipeline default actions, such as running an internally developed build process or a test suite.
 *
 * You can use these custom actions in the stage of a pipeline. For more information, see [Create and Add a Custom Action in AWS CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) in the *AWS CodePipeline User Guide* .
 *
 * @cloudformationResource AWS::CodePipeline::CustomActionType
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html
 */
export class CfnCustomActionType extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodePipeline::CustomActionType";

  /**
   * Build a CfnCustomActionType from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomActionType {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomActionTypePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomActionType(scope, id, propsResult.value);
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
   * The category of the custom action, such as a build action or a test action.
   */
  public category: string;

  /**
   * The configuration properties for the custom action.
   */
  public configurationProperties?: Array<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The details of the input artifact for the action, such as its commit ID.
   */
  public inputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

  /**
   * The details of the output artifact of the action, such as its commit ID.
   */
  public outputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

  /**
   * The provider of the service used in the custom action, such as CodeDeploy.
   */
  public provider: string;

  /**
   * URLs that provide users information about this custom action.
   */
  public settings?: cdk.IResolvable | CfnCustomActionType.SettingsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the custom action.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The version identifier of the custom action.
   */
  public version: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomActionTypeProps) {
    super(scope, id, {
      "type": CfnCustomActionType.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "category", this);
    cdk.requireProperty(props, "inputArtifactDetails", this);
    cdk.requireProperty(props, "outputArtifactDetails", this);
    cdk.requireProperty(props, "provider", this);
    cdk.requireProperty(props, "version", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.category = props.category;
    this.configurationProperties = props.configurationProperties;
    this.inputArtifactDetails = props.inputArtifactDetails;
    this.outputArtifactDetails = props.outputArtifactDetails;
    this.provider = props.provider;
    this.settings = props.settings;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodePipeline::CustomActionType", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "category": this.category,
      "configurationProperties": this.configurationProperties,
      "inputArtifactDetails": this.inputArtifactDetails,
      "outputArtifactDetails": this.outputArtifactDetails,
      "provider": this.provider,
      "settings": this.settings,
      "tags": this.tags.renderTags(),
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomActionType.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomActionTypePropsToCloudFormation(props);
  }
}

export namespace CfnCustomActionType {
  /**
   * Returns information about the details of an artifact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html
   */
  export interface ArtifactDetailsProperty {
    /**
     * The maximum number of artifacts allowed for the action type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-maximumcount
     */
    readonly maximumCount: number;

    /**
     * The minimum number of artifacts allowed for the action type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-artifactdetails.html#cfn-codepipeline-customactiontype-artifactdetails-minimumcount
     */
    readonly minimumCount: number;
  }

  /**
   * The configuration properties for the custom action.
   *
   * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html
   */
  export interface ConfigurationPropertiesProperty {
    /**
     * The description of the action configuration property that is displayed to users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-description
     */
    readonly description?: string;

    /**
     * Whether the configuration property is a key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-key
     */
    readonly key: boolean | cdk.IResolvable;

    /**
     * The name of the action configuration property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-name
     */
    readonly name: string;

    /**
     * Indicates that the property is used with `PollForJobs` .
     *
     * When creating a custom action, an action can have up to one queryable property. If it has one, that property must be both required and not secret.
     *
     * If you create a pipeline with a custom action type, and that custom action contains a queryable property, the value for that configuration property is subject to other restrictions. The value must be less than or equal to twenty (20) characters. The value can contain only alphanumeric characters, underscores, and hyphens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-queryable
     */
    readonly queryable?: boolean | cdk.IResolvable;

    /**
     * Whether the configuration property is a required value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-required
     */
    readonly required: boolean | cdk.IResolvable;

    /**
     * Whether the configuration property is secret.
     *
     * Secrets are hidden from all calls except for `GetJobDetails` , `GetThirdPartyJobDetails` , `PollForJobs` , and `PollForThirdPartyJobs` .
     *
     * When updating a pipeline, passing * * * * * without changing any other values of the action preserves the previous value of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-secret
     */
    readonly secret: boolean | cdk.IResolvable;

    /**
     * The type of the configuration property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-type
     */
    readonly type?: string;
  }

  /**
   * `Settings` is a property of the `AWS::CodePipeline::CustomActionType` resource that provides URLs that users can access to view information about the CodePipeline custom action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html
   */
  export interface SettingsProperty {
    /**
     * The URL returned to the CodePipeline console that provides a deep link to the resources of the external system, such as the configuration page for a CodeDeploy deployment group.
     *
     * This link is provided as part of the action display in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-entityurltemplate
     */
    readonly entityUrlTemplate?: string;

    /**
     * The URL returned to the CodePipeline console that contains a link to the top-level landing page for the external system, such as the console page for CodeDeploy.
     *
     * This link is shown on the pipeline view page in the CodePipeline console and provides a link to the execution entity of the external action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-executionurltemplate
     */
    readonly executionUrlTemplate?: string;

    /**
     * The URL returned to the CodePipeline console that contains a link to the page where customers can update or change the configuration of the external action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-revisionurltemplate
     */
    readonly revisionUrlTemplate?: string;

    /**
     * The URL of a sign-up page where users can sign up for an external service and perform initial configuration of the action provided by that service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-customactiontype-settings.html#cfn-codepipeline-customactiontype-settings-thirdpartyconfigurationurl
     */
    readonly thirdPartyConfigurationUrl?: string;
  }
}

/**
 * Properties for defining a `CfnCustomActionType`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html
 */
export interface CfnCustomActionTypeProps {
  /**
   * The category of the custom action, such as a build action or a test action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-category
   */
  readonly category: string;

  /**
   * The configuration properties for the custom action.
   *
   * > You can refer to a name in the configuration properties of the custom action within the URL templates by following the format of {Config:name}, as long as the configuration property is both required and not secret. For more information, see [Create a Custom Action for a Pipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-create-custom-action.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-configurationproperties
   */
  readonly configurationProperties?: Array<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The details of the input artifact for the action, such as its commit ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-inputartifactdetails
   */
  readonly inputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

  /**
   * The details of the output artifact of the action, such as its commit ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-outputartifactdetails
   */
  readonly outputArtifactDetails: CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable;

  /**
   * The provider of the service used in the custom action, such as CodeDeploy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-provider
   */
  readonly provider: string;

  /**
   * URLs that provide users information about this custom action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-settings
   */
  readonly settings?: cdk.IResolvable | CfnCustomActionType.SettingsProperty;

  /**
   * The tags for the custom action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The version identifier of the custom action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html#cfn-codepipeline-customactiontype-version
   */
  readonly version: string;
}

/**
 * Determine whether the given properties match those of a `ArtifactDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `ArtifactDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomActionTypeArtifactDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximumCount", cdk.requiredValidator)(properties.maximumCount));
  errors.collect(cdk.propertyValidator("maximumCount", cdk.validateNumber)(properties.maximumCount));
  errors.collect(cdk.propertyValidator("minimumCount", cdk.requiredValidator)(properties.minimumCount));
  errors.collect(cdk.propertyValidator("minimumCount", cdk.validateNumber)(properties.minimumCount));
  return errors.wrap("supplied properties not correct for \"ArtifactDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomActionTypeArtifactDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomActionTypeArtifactDetailsPropertyValidator(properties).assertSuccess();
  return {
    "MaximumCount": cdk.numberToCloudFormation(properties.maximumCount),
    "MinimumCount": cdk.numberToCloudFormation(properties.minimumCount)
  };
}

// @ts-ignore TS6133
function CfnCustomActionTypeArtifactDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomActionType.ArtifactDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionType.ArtifactDetailsProperty>();
  ret.addPropertyResult("maximumCount", "MaximumCount", (properties.MaximumCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumCount) : undefined));
  ret.addPropertyResult("minimumCount", "MinimumCount", (properties.MinimumCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfigurationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomActionTypeConfigurationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateBoolean)(properties.key));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("queryable", cdk.validateBoolean)(properties.queryable));
  errors.collect(cdk.propertyValidator("required", cdk.requiredValidator)(properties.required));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  errors.collect(cdk.propertyValidator("secret", cdk.requiredValidator)(properties.secret));
  errors.collect(cdk.propertyValidator("secret", cdk.validateBoolean)(properties.secret));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ConfigurationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomActionTypeConfigurationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomActionTypeConfigurationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Key": cdk.booleanToCloudFormation(properties.key),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Queryable": cdk.booleanToCloudFormation(properties.queryable),
    "Required": cdk.booleanToCloudFormation(properties.required),
    "Secret": cdk.booleanToCloudFormation(properties.secret),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnCustomActionTypeConfigurationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomActionType.ConfigurationPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionType.ConfigurationPropertiesProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Key) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("queryable", "Queryable", (properties.Queryable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Queryable) : undefined));
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addPropertyResult("secret", "Secret", (properties.Secret != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Secret) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomActionTypeSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("entityUrlTemplate", cdk.validateString)(properties.entityUrlTemplate));
  errors.collect(cdk.propertyValidator("executionUrlTemplate", cdk.validateString)(properties.executionUrlTemplate));
  errors.collect(cdk.propertyValidator("revisionUrlTemplate", cdk.validateString)(properties.revisionUrlTemplate));
  errors.collect(cdk.propertyValidator("thirdPartyConfigurationUrl", cdk.validateString)(properties.thirdPartyConfigurationUrl));
  return errors.wrap("supplied properties not correct for \"SettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomActionTypeSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomActionTypeSettingsPropertyValidator(properties).assertSuccess();
  return {
    "EntityUrlTemplate": cdk.stringToCloudFormation(properties.entityUrlTemplate),
    "ExecutionUrlTemplate": cdk.stringToCloudFormation(properties.executionUrlTemplate),
    "RevisionUrlTemplate": cdk.stringToCloudFormation(properties.revisionUrlTemplate),
    "ThirdPartyConfigurationUrl": cdk.stringToCloudFormation(properties.thirdPartyConfigurationUrl)
  };
}

// @ts-ignore TS6133
function CfnCustomActionTypeSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCustomActionType.SettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionType.SettingsProperty>();
  ret.addPropertyResult("entityUrlTemplate", "EntityUrlTemplate", (properties.EntityUrlTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.EntityUrlTemplate) : undefined));
  ret.addPropertyResult("executionUrlTemplate", "ExecutionUrlTemplate", (properties.ExecutionUrlTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionUrlTemplate) : undefined));
  ret.addPropertyResult("revisionUrlTemplate", "RevisionUrlTemplate", (properties.RevisionUrlTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.RevisionUrlTemplate) : undefined));
  ret.addPropertyResult("thirdPartyConfigurationUrl", "ThirdPartyConfigurationUrl", (properties.ThirdPartyConfigurationUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ThirdPartyConfigurationUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCustomActionTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomActionTypeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomActionTypePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("category", cdk.requiredValidator)(properties.category));
  errors.collect(cdk.propertyValidator("category", cdk.validateString)(properties.category));
  errors.collect(cdk.propertyValidator("configurationProperties", cdk.listValidator(CfnCustomActionTypeConfigurationPropertiesPropertyValidator))(properties.configurationProperties));
  errors.collect(cdk.propertyValidator("inputArtifactDetails", cdk.requiredValidator)(properties.inputArtifactDetails));
  errors.collect(cdk.propertyValidator("inputArtifactDetails", CfnCustomActionTypeArtifactDetailsPropertyValidator)(properties.inputArtifactDetails));
  errors.collect(cdk.propertyValidator("outputArtifactDetails", cdk.requiredValidator)(properties.outputArtifactDetails));
  errors.collect(cdk.propertyValidator("outputArtifactDetails", CfnCustomActionTypeArtifactDetailsPropertyValidator)(properties.outputArtifactDetails));
  errors.collect(cdk.propertyValidator("provider", cdk.requiredValidator)(properties.provider));
  errors.collect(cdk.propertyValidator("provider", cdk.validateString)(properties.provider));
  errors.collect(cdk.propertyValidator("settings", CfnCustomActionTypeSettingsPropertyValidator)(properties.settings));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnCustomActionTypeProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomActionTypePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomActionTypePropsValidator(properties).assertSuccess();
  return {
    "Category": cdk.stringToCloudFormation(properties.category),
    "ConfigurationProperties": cdk.listMapper(convertCfnCustomActionTypeConfigurationPropertiesPropertyToCloudFormation)(properties.configurationProperties),
    "InputArtifactDetails": convertCfnCustomActionTypeArtifactDetailsPropertyToCloudFormation(properties.inputArtifactDetails),
    "OutputArtifactDetails": convertCfnCustomActionTypeArtifactDetailsPropertyToCloudFormation(properties.outputArtifactDetails),
    "Provider": cdk.stringToCloudFormation(properties.provider),
    "Settings": convertCfnCustomActionTypeSettingsPropertyToCloudFormation(properties.settings),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnCustomActionTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomActionTypeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomActionTypeProps>();
  ret.addPropertyResult("category", "Category", (properties.Category != null ? cfn_parse.FromCloudFormation.getString(properties.Category) : undefined));
  ret.addPropertyResult("configurationProperties", "ConfigurationProperties", (properties.ConfigurationProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnCustomActionTypeConfigurationPropertiesPropertyFromCloudFormation)(properties.ConfigurationProperties) : undefined));
  ret.addPropertyResult("inputArtifactDetails", "InputArtifactDetails", (properties.InputArtifactDetails != null ? CfnCustomActionTypeArtifactDetailsPropertyFromCloudFormation(properties.InputArtifactDetails) : undefined));
  ret.addPropertyResult("outputArtifactDetails", "OutputArtifactDetails", (properties.OutputArtifactDetails != null ? CfnCustomActionTypeArtifactDetailsPropertyFromCloudFormation(properties.OutputArtifactDetails) : undefined));
  ret.addPropertyResult("provider", "Provider", (properties.Provider != null ? cfn_parse.FromCloudFormation.getString(properties.Provider) : undefined));
  ret.addPropertyResult("settings", "Settings", (properties.Settings != null ? CfnCustomActionTypeSettingsPropertyFromCloudFormation(properties.Settings) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CodePipeline::Pipeline` resource creates a CodePipeline pipeline that describes how software changes go through a release process.
 *
 * For more information, see [What Is CodePipeline?](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html) in the *AWS CodePipeline User Guide* .
 *
 * @cloudformationResource AWS::CodePipeline::Pipeline
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html
 */
export class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodePipeline::Pipeline";

  /**
   * Build a CfnPipeline from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPipelinePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPipeline(scope, id, propsResult.value);
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
   * The version of the pipeline.
   *
   * > A new pipeline is always assigned a version number of 1. This number increments when a pipeline is updated.
   *
   * @cloudformationAttribute Version
   */
  public readonly attrVersion: string;

  /**
   * The S3 bucket where artifacts for the pipeline are stored.
   */
  public artifactStore?: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable;

  /**
   * A mapping of `artifactStore` objects and their corresponding AWS Regions.
   */
  public artifactStores?: Array<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Represents the input of a `DisableStageTransition` action.
   */
  public disableInboundStageTransitions?: Array<cdk.IResolvable | CfnPipeline.StageTransitionProperty> | cdk.IResolvable;

  /**
   * The name of the pipeline.
   */
  public name?: string;

  /**
   * CodePipeline provides the following pipeline types, which differ in characteristics and price, so that you can tailor your pipeline features and cost to the needs of your applications.
   */
  public pipelineType?: string;

  /**
   * Indicates whether to rerun the CodePipeline pipeline after you update it.
   */
  public restartExecutionOnUpdate?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) for CodePipeline to use to either perform actions with no `actionRoleArn` , or to use to assume roles for actions with an `actionRoleArn` .
   */
  public roleArn: string;

  /**
   * Represents information about a stage and its definition.
   */
  public stages: Array<cdk.IResolvable | CfnPipeline.StageDeclarationProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies the tags applied to the pipeline.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The trigger configuration specifying a type of event, such as Git tags, that starts the pipeline.
   */
  public triggers?: Array<cdk.IResolvable | CfnPipeline.PipelineTriggerDeclarationProperty> | cdk.IResolvable;

  /**
   * A list that defines the pipeline variables for a pipeline resource.
   */
  public variables?: Array<cdk.IResolvable | CfnPipeline.VariableDeclarationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps) {
    super(scope, id, {
      "type": CfnPipeline.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "stages", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrVersion = cdk.Token.asString(this.getAtt("Version", cdk.ResolutionTypeHint.STRING));
    this.artifactStore = props.artifactStore;
    this.artifactStores = props.artifactStores;
    this.disableInboundStageTransitions = props.disableInboundStageTransitions;
    this.name = props.name;
    this.pipelineType = props.pipelineType;
    this.restartExecutionOnUpdate = props.restartExecutionOnUpdate;
    this.roleArn = props.roleArn;
    this.stages = props.stages;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodePipeline::Pipeline", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.triggers = props.triggers;
    this.variables = props.variables;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "artifactStore": this.artifactStore,
      "artifactStores": this.artifactStores,
      "disableInboundStageTransitions": this.disableInboundStageTransitions,
      "name": this.name,
      "pipelineType": this.pipelineType,
      "restartExecutionOnUpdate": this.restartExecutionOnUpdate,
      "roleArn": this.roleArn,
      "stages": this.stages,
      "tags": this.tags.renderTags(),
      "triggers": this.triggers,
      "variables": this.variables
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipeline.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPipelinePropsToCloudFormation(props);
  }
}

export namespace CfnPipeline {
  /**
   * The S3 bucket where artifacts for the pipeline are stored.
   *
   * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html
   */
  export interface ArtifactStoreProperty {
    /**
     * The encryption key used to encrypt the data in the artifact store, such as an AWS Key Management Service ( AWS KMS) key.
     *
     * If this is undefined, the default key for Amazon S3 is used. To see an example artifact store encryption key field, see the example structure here: [AWS::CodePipeline::Pipeline](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-encryptionkey
     */
    readonly encryptionKey?: CfnPipeline.EncryptionKeyProperty | cdk.IResolvable;

    /**
     * The S3 bucket used for storing the artifacts for a pipeline.
     *
     * You can specify the name of an S3 bucket but not a folder in the bucket. A folder to contain the pipeline artifacts is created for you based on the name of the pipeline. You can use any S3 bucket in the same AWS Region as the pipeline to store your pipeline artifacts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-location
     */
    readonly location: string;

    /**
     * The type of the artifact store, such as S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html#cfn-codepipeline-pipeline-artifactstore-type
     */
    readonly type: string;
  }

  /**
   * Represents information about the key used to encrypt data in the artifact store, such as an AWS Key Management Service ( AWS KMS) key.
   *
   * `EncryptionKey` is a property of the [ArtifactStore](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstore.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-encryptionkey.html
   */
  export interface EncryptionKeyProperty {
    /**
     * The ID used to identify the key.
     *
     * For an AWS KMS key, you can use the key ID, the key ARN, or the alias ARN.
     *
     * > Aliases are recognized only in the account that created the AWS KMS key. For cross-account actions, you can only use the key ID or key ARN to identify the key. Cross-account actions involve using the role from the other account (AccountB), so specifying the key ID will use the key from the other account (AccountB).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-encryptionkey.html#cfn-codepipeline-pipeline-encryptionkey-id
     */
    readonly id: string;

    /**
     * The type of encryption key, such as an AWS KMS key.
     *
     * When creating or updating a pipeline, the value must be set to 'KMS'.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-encryptionkey.html#cfn-codepipeline-pipeline-encryptionkey-type
     */
    readonly type: string;
  }

  /**
   * A mapping of `artifactStore` objects and their corresponding AWS Regions.
   *
   * There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
   *
   * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html
   */
  export interface ArtifactStoreMapProperty {
    /**
     * Represents information about the S3 bucket where artifacts are stored for the pipeline.
     *
     * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html#cfn-codepipeline-pipeline-artifactstoremap-artifactstore
     */
    readonly artifactStore: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable;

    /**
     * The action declaration's AWS Region, such as us-east-1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-artifactstoremap.html#cfn-codepipeline-pipeline-artifactstoremap-region
     */
    readonly region: string;
  }

  /**
   * The name of the pipeline in which you want to disable the flow of artifacts from one stage to another.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stagetransition.html
   */
  export interface StageTransitionProperty {
    /**
     * The reason given to the user that a stage is disabled, such as waiting for manual approval or manual tests.
     *
     * This message is displayed in the pipeline console UI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stagetransition.html#cfn-codepipeline-pipeline-stagetransition-reason
     */
    readonly reason: string;

    /**
     * The name of the stage where you want to disable the inbound or outbound transition of artifacts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stagetransition.html#cfn-codepipeline-pipeline-stagetransition-stagename
     */
    readonly stageName: string;
  }

  /**
   * Represents information about a stage and its definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stagedeclaration.html
   */
  export interface StageDeclarationProperty {
    /**
     * The actions included in a stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stagedeclaration.html#cfn-codepipeline-pipeline-stagedeclaration-actions
     */
    readonly actions: Array<CfnPipeline.ActionDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Reserved for future use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stagedeclaration.html#cfn-codepipeline-pipeline-stagedeclaration-blockers
     */
    readonly blockers?: Array<CfnPipeline.BlockerDeclarationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stagedeclaration.html#cfn-codepipeline-pipeline-stagedeclaration-name
     */
    readonly name: string;
  }

  /**
   * Represents information about an action declaration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html
   */
  export interface ActionDeclarationProperty {
    /**
     * Specifies the action type and the provider of the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-actiontypeid
     */
    readonly actionTypeId: CfnPipeline.ActionTypeIdProperty | cdk.IResolvable;

    /**
     * The action's configuration.
     *
     * These are key-value pairs that specify input values for an action. For more information, see [Action Structure Requirements in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements) . For the list of configuration properties for the AWS CloudFormation action type in CodePipeline, see [Configuration Properties Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-action-reference.html) in the *AWS CloudFormation User Guide* . For template snippets with examples, see [Using Parameter Override Functions with CodePipeline Pipelines](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-parameter-override-functions.html) in the *AWS CloudFormation User Guide* .
     *
     * The values can be represented in either JSON or YAML format. For example, the JSON configuration item format is as follows:
     *
     * *JSON:*
     *
     * `"Configuration" : { Key : Value },`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-configuration
     */
    readonly configuration?: any | cdk.IResolvable;

    /**
     * The name or ID of the artifact consumed by the action, such as a test or build artifact.
     *
     * While the field is not a required parameter, most actions have an action configuration that requires a specified quantity of input artifacts. To refer to the action configuration specification by action provider, see the [Action structure reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference.html) in the *AWS CodePipeline User Guide* .
     *
     * > For a CodeBuild action with multiple input artifacts, one of your input sources must be designated the PrimarySource. For more information, see the [CodeBuild action reference page](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodeBuild.html) in the *AWS CodePipeline User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-inputartifacts
     */
    readonly inputArtifacts?: Array<CfnPipeline.InputArtifactProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The action declaration's name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-name
     */
    readonly name: string;

    /**
     * The variable namespace associated with the action.
     *
     * All variables produced as output by this action fall under this namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-namespace
     */
    readonly namespace?: string;

    /**
     * The name or ID of the result of the action declaration, such as a test or build artifact.
     *
     * While the field is not a required parameter, most actions have an action configuration that requires a specified quantity of output artifacts. To refer to the action configuration specification by action provider, see the [Action structure reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference.html) in the *AWS CodePipeline User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-outputartifacts
     */
    readonly outputArtifacts?: Array<cdk.IResolvable | CfnPipeline.OutputArtifactProperty> | cdk.IResolvable;

    /**
     * The action declaration's AWS Region, such as us-east-1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-region
     */
    readonly region?: string;

    /**
     * The ARN of the IAM service role that performs the declared action.
     *
     * This is assumed through the roleArn for the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-rolearn
     */
    readonly roleArn?: string;

    /**
     * The order in which actions are run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiondeclaration.html#cfn-codepipeline-pipeline-actiondeclaration-runorder
     */
    readonly runOrder?: number;
  }

  /**
   * Represents information about an action type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiontypeid.html
   */
  export interface ActionTypeIdProperty {
    /**
     * A category defines what kind of action can be taken in the stage, and constrains the provider type for the action.
     *
     * Valid categories are limited to one of the values below.
     *
     * - `Source`
     * - `Build`
     * - `Test`
     * - `Deploy`
     * - `Invoke`
     * - `Approval`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiontypeid.html#cfn-codepipeline-pipeline-actiontypeid-category
     */
    readonly category: string;

    /**
     * The creator of the action being called.
     *
     * There are three valid values for the `Owner` field in the action category section within your pipeline structure: `AWS` , `ThirdParty` , and `Custom` . For more information, see [Valid Action Types and Providers in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#actions-valid-providers) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiontypeid.html#cfn-codepipeline-pipeline-actiontypeid-owner
     */
    readonly owner: string;

    /**
     * The provider of the service being called by the action.
     *
     * Valid providers are determined by the action category. For example, an action in the Deploy category type might have a provider of CodeDeploy, which would be specified as `CodeDeploy` . For more information, see [Valid Action Types and Providers in CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#actions-valid-providers) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiontypeid.html#cfn-codepipeline-pipeline-actiontypeid-provider
     */
    readonly provider: string;

    /**
     * A string that describes the action version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-actiontypeid.html#cfn-codepipeline-pipeline-actiontypeid-version
     */
    readonly version: string;
  }

  /**
   * Represents information about an artifact to be worked on, such as a test or build artifact.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-inputartifact.html
   */
  export interface InputArtifactProperty {
    /**
     * The name of the artifact to be worked on (for example, "My App").
     *
     * Artifacts are the files that are worked on by actions in the pipeline. See the action configuration for each action for details about artifact parameters. For example, the S3 source action input artifact is a file name (or file path), and the files are generally provided as a ZIP file. Example artifact name: SampleApp_Windows.zip
     *
     * The input artifact of an action must exactly match the output artifact declared in a preceding action, but the input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-inputartifact.html#cfn-codepipeline-pipeline-inputartifact-name
     */
    readonly name: string;
  }

  /**
   * Represents information about the output of an action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-outputartifact.html
   */
  export interface OutputArtifactProperty {
    /**
     * The name of the output of an artifact, such as "My App".
     *
     * The output artifact name must exactly match the input artifact declared for a downstream action. However, the downstream action's input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
     *
     * Output artifact names must be unique within a pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-outputartifact.html#cfn-codepipeline-pipeline-outputartifact-name
     */
    readonly name: string;
  }

  /**
   * Reserved for future use.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-blockerdeclaration.html
   */
  export interface BlockerDeclarationProperty {
    /**
     * Reserved for future use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-blockerdeclaration.html#cfn-codepipeline-pipeline-blockerdeclaration-name
     */
    readonly name: string;

    /**
     * Reserved for future use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-blockerdeclaration.html#cfn-codepipeline-pipeline-blockerdeclaration-type
     */
    readonly type: string;
  }

  /**
   * Represents information about the specified trigger configuration, such as the filter criteria and the source stage for the action that contains the trigger.
   *
   * > This is only supported for the `CodeStarSourceConnection` action type. > When a trigger configuration is specified, default change detection for repository and branch commits is disabled.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-pipelinetriggerdeclaration.html
   */
  export interface PipelineTriggerDeclarationProperty {
    /**
     * Provides the filter criteria and the source stage for the repository event that starts the pipeline, such as Git tags.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-pipelinetriggerdeclaration.html#cfn-codepipeline-pipeline-pipelinetriggerdeclaration-gitconfiguration
     */
    readonly gitConfiguration?: CfnPipeline.GitConfigurationProperty | cdk.IResolvable;

    /**
     * The source provider for the event, such as connections configured for a repository with Git tags, for the specified trigger configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-pipelinetriggerdeclaration.html#cfn-codepipeline-pipeline-pipelinetriggerdeclaration-providertype
     */
    readonly providerType: string;
  }

  /**
   * A type of trigger configuration for Git-based source actions.
   *
   * > You can specify the Git configuration trigger type for all third-party Git-based source actions that are supported by the `CodeStarSourceConnection` action type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gitconfiguration.html
   */
  export interface GitConfigurationProperty {
    /**
     * The field where the repository event that will start the pipeline, such as pushing Git tags, is specified with details.
     *
     * > Git tags is the only supported event type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gitconfiguration.html#cfn-codepipeline-pipeline-gitconfiguration-push
     */
    readonly push?: Array<CfnPipeline.GitPushFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the pipeline source action where the trigger configuration, such as Git tags, is specified.
     *
     * The trigger configuration will start the pipeline upon the specified change only.
     *
     * > You can only specify one trigger configuration per source action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gitconfiguration.html#cfn-codepipeline-pipeline-gitconfiguration-sourceactionname
     */
    readonly sourceActionName: string;
  }

  /**
   * The event criteria that specify when a specified repository event will start the pipeline for the specified trigger configuration, such as the lists of Git tags to include and exclude.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gitpushfilter.html
   */
  export interface GitPushFilterProperty {
    /**
     * The field that contains the details for the Git tags trigger configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gitpushfilter.html#cfn-codepipeline-pipeline-gitpushfilter-tags
     */
    readonly tags?: CfnPipeline.GitTagFilterCriteriaProperty;
  }

  /**
   * The Git tags specified as filter criteria for whether a Git tag repository event will start the pipeline.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gittagfiltercriteria.html
   */
  export interface GitTagFilterCriteriaProperty {
    /**
     * The list of patterns of Git tags that, when pushed, are to be excluded from starting the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gittagfiltercriteria.html#cfn-codepipeline-pipeline-gittagfiltercriteria-excludes
     */
    readonly excludes?: Array<string>;

    /**
     * The list of patterns of Git tags that, when pushed, are to be included as criteria that starts the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-gittagfiltercriteria.html#cfn-codepipeline-pipeline-gittagfiltercriteria-includes
     */
    readonly includes?: Array<string>;
  }

  /**
   * A variable declared at the pipeline level.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-variabledeclaration.html
   */
  export interface VariableDeclarationProperty {
    /**
     * The value of a pipeline-level variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-variabledeclaration.html#cfn-codepipeline-pipeline-variabledeclaration-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * The description of a pipeline-level variable.
     *
     * It's used to add additional context about the variable, and not being used at time when pipeline executes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-variabledeclaration.html#cfn-codepipeline-pipeline-variabledeclaration-description
     */
    readonly description?: string;

    /**
     * The name of a pipeline-level variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-variabledeclaration.html#cfn-codepipeline-pipeline-variabledeclaration-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnPipeline`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html
 */
export interface CfnPipelineProps {
  /**
   * The S3 bucket where artifacts for the pipeline are stored.
   *
   * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstore
   */
  readonly artifactStore?: CfnPipeline.ArtifactStoreProperty | cdk.IResolvable;

  /**
   * A mapping of `artifactStore` objects and their corresponding AWS Regions.
   *
   * There must be an artifact store for the pipeline Region and for each cross-region action in the pipeline.
   *
   * > You must include either `artifactStore` or `artifactStores` in your pipeline, but you cannot use both. If you create a cross-region action in your pipeline, you must use `artifactStores` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-artifactstores
   */
  readonly artifactStores?: Array<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Represents the input of a `DisableStageTransition` action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-disableinboundstagetransitions
   */
  readonly disableInboundStageTransitions?: Array<cdk.IResolvable | CfnPipeline.StageTransitionProperty> | cdk.IResolvable;

  /**
   * The name of the pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-name
   */
  readonly name?: string;

  /**
   * CodePipeline provides the following pipeline types, which differ in characteristics and price, so that you can tailor your pipeline features and cost to the needs of your applications.
   *
   * - V1 type pipelines have a JSON structure that contains standard pipeline, stage, and action-level parameters.
   * - V2 type pipelines have the same structure as a V1 type, along with additional parameters for release safety and trigger configuration.
   *
   * > Including V2 parameters, such as triggers on Git tags, in the pipeline JSON when creating or updating a pipeline will result in the pipeline having the V2 type of pipeline and the associated costs.
   *
   * For information about pricing for CodePipeline, see [Pricing](https://docs.aws.amazon.com/https://aws.amazon.com/codepipeline/pricing/) .
   *
   * For information about which type of pipeline to choose, see [What type of pipeline is right for me?](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipeline-types-planning.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-pipelinetype
   */
  readonly pipelineType?: string;

  /**
   * Indicates whether to rerun the CodePipeline pipeline after you update it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-restartexecutiononupdate
   */
  readonly restartExecutionOnUpdate?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) for CodePipeline to use to either perform actions with no `actionRoleArn` , or to use to assume roles for actions with an `actionRoleArn` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-rolearn
   */
  readonly roleArn: string;

  /**
   * Represents information about a stage and its definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-stages
   */
  readonly stages: Array<cdk.IResolvable | CfnPipeline.StageDeclarationProperty> | cdk.IResolvable;

  /**
   * Specifies the tags applied to the pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The trigger configuration specifying a type of event, such as Git tags, that starts the pipeline.
   *
   * > When a trigger configuration is specified, default change detection for repository and branch commits is disabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-triggers
   */
  readonly triggers?: Array<cdk.IResolvable | CfnPipeline.PipelineTriggerDeclarationProperty> | cdk.IResolvable;

  /**
   * A list that defines the pipeline variables for a pipeline resource.
   *
   * Variable names can have alphanumeric and underscore characters, and the values must match `[A-Za-z0-9@\-_]+` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html#cfn-codepipeline-pipeline-variables
   */
  readonly variables?: Array<cdk.IResolvable | CfnPipeline.VariableDeclarationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `EncryptionKeyProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineEncryptionKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"EncryptionKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineEncryptionKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineEncryptionKeyPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPipelineEncryptionKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.EncryptionKeyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.EncryptionKeyProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ArtifactStoreProperty`
 *
 * @param properties - the TypeScript properties of a `ArtifactStoreProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineArtifactStorePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionKey", CfnPipelineEncryptionKeyPropertyValidator)(properties.encryptionKey));
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ArtifactStoreProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineArtifactStorePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineArtifactStorePropertyValidator(properties).assertSuccess();
  return {
    "EncryptionKey": convertCfnPipelineEncryptionKeyPropertyToCloudFormation(properties.encryptionKey),
    "Location": cdk.stringToCloudFormation(properties.location),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPipelineArtifactStorePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ArtifactStoreProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ArtifactStoreProperty>();
  ret.addPropertyResult("encryptionKey", "EncryptionKey", (properties.EncryptionKey != null ? CfnPipelineEncryptionKeyPropertyFromCloudFormation(properties.EncryptionKey) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ArtifactStoreMapProperty`
 *
 * @param properties - the TypeScript properties of a `ArtifactStoreMapProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineArtifactStoreMapPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("artifactStore", cdk.requiredValidator)(properties.artifactStore));
  errors.collect(cdk.propertyValidator("artifactStore", CfnPipelineArtifactStorePropertyValidator)(properties.artifactStore));
  errors.collect(cdk.propertyValidator("region", cdk.requiredValidator)(properties.region));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  return errors.wrap("supplied properties not correct for \"ArtifactStoreMapProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineArtifactStoreMapPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineArtifactStoreMapPropertyValidator(properties).assertSuccess();
  return {
    "ArtifactStore": convertCfnPipelineArtifactStorePropertyToCloudFormation(properties.artifactStore),
    "Region": cdk.stringToCloudFormation(properties.region)
  };
}

// @ts-ignore TS6133
function CfnPipelineArtifactStoreMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ArtifactStoreMapProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ArtifactStoreMapProperty>();
  ret.addPropertyResult("artifactStore", "ArtifactStore", (properties.ArtifactStore != null ? CfnPipelineArtifactStorePropertyFromCloudFormation(properties.ArtifactStore) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StageTransitionProperty`
 *
 * @param properties - the TypeScript properties of a `StageTransitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineStageTransitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reason", cdk.requiredValidator)(properties.reason));
  errors.collect(cdk.propertyValidator("reason", cdk.validateString)(properties.reason));
  errors.collect(cdk.propertyValidator("stageName", cdk.requiredValidator)(properties.stageName));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  return errors.wrap("supplied properties not correct for \"StageTransitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineStageTransitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineStageTransitionPropertyValidator(properties).assertSuccess();
  return {
    "Reason": cdk.stringToCloudFormation(properties.reason),
    "StageName": cdk.stringToCloudFormation(properties.stageName)
  };
}

// @ts-ignore TS6133
function CfnPipelineStageTransitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.StageTransitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.StageTransitionProperty>();
  ret.addPropertyResult("reason", "Reason", (properties.Reason != null ? cfn_parse.FromCloudFormation.getString(properties.Reason) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionTypeIdProperty`
 *
 * @param properties - the TypeScript properties of a `ActionTypeIdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineActionTypeIdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("category", cdk.requiredValidator)(properties.category));
  errors.collect(cdk.propertyValidator("category", cdk.validateString)(properties.category));
  errors.collect(cdk.propertyValidator("owner", cdk.requiredValidator)(properties.owner));
  errors.collect(cdk.propertyValidator("owner", cdk.validateString)(properties.owner));
  errors.collect(cdk.propertyValidator("provider", cdk.requiredValidator)(properties.provider));
  errors.collect(cdk.propertyValidator("provider", cdk.validateString)(properties.provider));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"ActionTypeIdProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineActionTypeIdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineActionTypeIdPropertyValidator(properties).assertSuccess();
  return {
    "Category": cdk.stringToCloudFormation(properties.category),
    "Owner": cdk.stringToCloudFormation(properties.owner),
    "Provider": cdk.stringToCloudFormation(properties.provider),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnPipelineActionTypeIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ActionTypeIdProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ActionTypeIdProperty>();
  ret.addPropertyResult("category", "Category", (properties.Category != null ? cfn_parse.FromCloudFormation.getString(properties.Category) : undefined));
  ret.addPropertyResult("owner", "Owner", (properties.Owner != null ? cfn_parse.FromCloudFormation.getString(properties.Owner) : undefined));
  ret.addPropertyResult("provider", "Provider", (properties.Provider != null ? cfn_parse.FromCloudFormation.getString(properties.Provider) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputArtifactProperty`
 *
 * @param properties - the TypeScript properties of a `InputArtifactProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineInputArtifactPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"InputArtifactProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineInputArtifactPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineInputArtifactPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPipelineInputArtifactPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.InputArtifactProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.InputArtifactProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputArtifactProperty`
 *
 * @param properties - the TypeScript properties of a `OutputArtifactProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineOutputArtifactPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"OutputArtifactProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineOutputArtifactPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineOutputArtifactPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPipelineOutputArtifactPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.OutputArtifactProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.OutputArtifactProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `ActionDeclarationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineActionDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionTypeId", cdk.requiredValidator)(properties.actionTypeId));
  errors.collect(cdk.propertyValidator("actionTypeId", CfnPipelineActionTypeIdPropertyValidator)(properties.actionTypeId));
  errors.collect(cdk.propertyValidator("configuration", cdk.validateObject)(properties.configuration));
  errors.collect(cdk.propertyValidator("inputArtifacts", cdk.listValidator(CfnPipelineInputArtifactPropertyValidator))(properties.inputArtifacts));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("outputArtifacts", cdk.listValidator(CfnPipelineOutputArtifactPropertyValidator))(properties.outputArtifacts));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("runOrder", cdk.validateNumber)(properties.runOrder));
  return errors.wrap("supplied properties not correct for \"ActionDeclarationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineActionDeclarationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineActionDeclarationPropertyValidator(properties).assertSuccess();
  return {
    "ActionTypeId": convertCfnPipelineActionTypeIdPropertyToCloudFormation(properties.actionTypeId),
    "Configuration": cdk.objectToCloudFormation(properties.configuration),
    "InputArtifacts": cdk.listMapper(convertCfnPipelineInputArtifactPropertyToCloudFormation)(properties.inputArtifacts),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "OutputArtifacts": cdk.listMapper(convertCfnPipelineOutputArtifactPropertyToCloudFormation)(properties.outputArtifacts),
    "Region": cdk.stringToCloudFormation(properties.region),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "RunOrder": cdk.numberToCloudFormation(properties.runOrder)
  };
}

// @ts-ignore TS6133
function CfnPipelineActionDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ActionDeclarationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ActionDeclarationProperty>();
  ret.addPropertyResult("actionTypeId", "ActionTypeId", (properties.ActionTypeId != null ? CfnPipelineActionTypeIdPropertyFromCloudFormation(properties.ActionTypeId) : undefined));
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? cfn_parse.FromCloudFormation.getAny(properties.Configuration) : undefined));
  ret.addPropertyResult("inputArtifacts", "InputArtifacts", (properties.InputArtifacts != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineInputArtifactPropertyFromCloudFormation)(properties.InputArtifacts) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("outputArtifacts", "OutputArtifacts", (properties.OutputArtifacts != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineOutputArtifactPropertyFromCloudFormation)(properties.OutputArtifacts) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("runOrder", "RunOrder", (properties.RunOrder != null ? cfn_parse.FromCloudFormation.getNumber(properties.RunOrder) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlockerDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `BlockerDeclarationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineBlockerDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"BlockerDeclarationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineBlockerDeclarationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineBlockerDeclarationPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPipelineBlockerDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.BlockerDeclarationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.BlockerDeclarationProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StageDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `StageDeclarationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineStageDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnPipelineActionDeclarationPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("blockers", cdk.listValidator(CfnPipelineBlockerDeclarationPropertyValidator))(properties.blockers));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"StageDeclarationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineStageDeclarationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineStageDeclarationPropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnPipelineActionDeclarationPropertyToCloudFormation)(properties.actions),
    "Blockers": cdk.listMapper(convertCfnPipelineBlockerDeclarationPropertyToCloudFormation)(properties.blockers),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPipelineStageDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.StageDeclarationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.StageDeclarationProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineActionDeclarationPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("blockers", "Blockers", (properties.Blockers != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineBlockerDeclarationPropertyFromCloudFormation)(properties.Blockers) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GitTagFilterCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `GitTagFilterCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineGitTagFilterCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludes", cdk.listValidator(cdk.validateString))(properties.excludes));
  errors.collect(cdk.propertyValidator("includes", cdk.listValidator(cdk.validateString))(properties.includes));
  return errors.wrap("supplied properties not correct for \"GitTagFilterCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineGitTagFilterCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineGitTagFilterCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Excludes": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludes),
    "Includes": cdk.listMapper(cdk.stringToCloudFormation)(properties.includes)
  };
}

// @ts-ignore TS6133
function CfnPipelineGitTagFilterCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.GitTagFilterCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.GitTagFilterCriteriaProperty>();
  ret.addPropertyResult("excludes", "Excludes", (properties.Excludes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Excludes) : undefined));
  ret.addPropertyResult("includes", "Includes", (properties.Includes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Includes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GitPushFilterProperty`
 *
 * @param properties - the TypeScript properties of a `GitPushFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineGitPushFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tags", CfnPipelineGitTagFilterCriteriaPropertyValidator)(properties.tags));
  return errors.wrap("supplied properties not correct for \"GitPushFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineGitPushFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineGitPushFilterPropertyValidator(properties).assertSuccess();
  return {
    "Tags": convertCfnPipelineGitTagFilterCriteriaPropertyToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPipelineGitPushFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.GitPushFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.GitPushFilterProperty>();
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? CfnPipelineGitTagFilterCriteriaPropertyFromCloudFormation(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GitConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `GitConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineGitConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("push", cdk.listValidator(CfnPipelineGitPushFilterPropertyValidator))(properties.push));
  errors.collect(cdk.propertyValidator("sourceActionName", cdk.requiredValidator)(properties.sourceActionName));
  errors.collect(cdk.propertyValidator("sourceActionName", cdk.validateString)(properties.sourceActionName));
  return errors.wrap("supplied properties not correct for \"GitConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineGitConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineGitConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Push": cdk.listMapper(convertCfnPipelineGitPushFilterPropertyToCloudFormation)(properties.push),
    "SourceActionName": cdk.stringToCloudFormation(properties.sourceActionName)
  };
}

// @ts-ignore TS6133
function CfnPipelineGitConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.GitConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.GitConfigurationProperty>();
  ret.addPropertyResult("push", "Push", (properties.Push != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineGitPushFilterPropertyFromCloudFormation)(properties.Push) : undefined));
  ret.addPropertyResult("sourceActionName", "SourceActionName", (properties.SourceActionName != null ? cfn_parse.FromCloudFormation.getString(properties.SourceActionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PipelineTriggerDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `PipelineTriggerDeclarationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelinePipelineTriggerDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gitConfiguration", CfnPipelineGitConfigurationPropertyValidator)(properties.gitConfiguration));
  errors.collect(cdk.propertyValidator("providerType", cdk.requiredValidator)(properties.providerType));
  errors.collect(cdk.propertyValidator("providerType", cdk.validateString)(properties.providerType));
  return errors.wrap("supplied properties not correct for \"PipelineTriggerDeclarationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelinePipelineTriggerDeclarationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelinePipelineTriggerDeclarationPropertyValidator(properties).assertSuccess();
  return {
    "GitConfiguration": convertCfnPipelineGitConfigurationPropertyToCloudFormation(properties.gitConfiguration),
    "ProviderType": cdk.stringToCloudFormation(properties.providerType)
  };
}

// @ts-ignore TS6133
function CfnPipelinePipelineTriggerDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.PipelineTriggerDeclarationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.PipelineTriggerDeclarationProperty>();
  ret.addPropertyResult("gitConfiguration", "GitConfiguration", (properties.GitConfiguration != null ? CfnPipelineGitConfigurationPropertyFromCloudFormation(properties.GitConfiguration) : undefined));
  ret.addPropertyResult("providerType", "ProviderType", (properties.ProviderType != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VariableDeclarationProperty`
 *
 * @param properties - the TypeScript properties of a `VariableDeclarationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineVariableDeclarationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"VariableDeclarationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineVariableDeclarationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineVariableDeclarationPropertyValidator(properties).assertSuccess();
  return {
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPipelineVariableDeclarationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.VariableDeclarationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.VariableDeclarationProperty>();
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelinePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("artifactStore", CfnPipelineArtifactStorePropertyValidator)(properties.artifactStore));
  errors.collect(cdk.propertyValidator("artifactStores", cdk.listValidator(CfnPipelineArtifactStoreMapPropertyValidator))(properties.artifactStores));
  errors.collect(cdk.propertyValidator("disableInboundStageTransitions", cdk.listValidator(CfnPipelineStageTransitionPropertyValidator))(properties.disableInboundStageTransitions));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("pipelineType", cdk.validateString)(properties.pipelineType));
  errors.collect(cdk.propertyValidator("restartExecutionOnUpdate", cdk.validateBoolean)(properties.restartExecutionOnUpdate));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("stages", cdk.requiredValidator)(properties.stages));
  errors.collect(cdk.propertyValidator("stages", cdk.listValidator(CfnPipelineStageDeclarationPropertyValidator))(properties.stages));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("triggers", cdk.listValidator(CfnPipelinePipelineTriggerDeclarationPropertyValidator))(properties.triggers));
  errors.collect(cdk.propertyValidator("variables", cdk.listValidator(CfnPipelineVariableDeclarationPropertyValidator))(properties.variables));
  return errors.wrap("supplied properties not correct for \"CfnPipelineProps\"");
}

// @ts-ignore TS6133
function convertCfnPipelinePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelinePropsValidator(properties).assertSuccess();
  return {
    "ArtifactStore": convertCfnPipelineArtifactStorePropertyToCloudFormation(properties.artifactStore),
    "ArtifactStores": cdk.listMapper(convertCfnPipelineArtifactStoreMapPropertyToCloudFormation)(properties.artifactStores),
    "DisableInboundStageTransitions": cdk.listMapper(convertCfnPipelineStageTransitionPropertyToCloudFormation)(properties.disableInboundStageTransitions),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PipelineType": cdk.stringToCloudFormation(properties.pipelineType),
    "RestartExecutionOnUpdate": cdk.booleanToCloudFormation(properties.restartExecutionOnUpdate),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Stages": cdk.listMapper(convertCfnPipelineStageDeclarationPropertyToCloudFormation)(properties.stages),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Triggers": cdk.listMapper(convertCfnPipelinePipelineTriggerDeclarationPropertyToCloudFormation)(properties.triggers),
    "Variables": cdk.listMapper(convertCfnPipelineVariableDeclarationPropertyToCloudFormation)(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnPipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipelineProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipelineProps>();
  ret.addPropertyResult("artifactStore", "ArtifactStore", (properties.ArtifactStore != null ? CfnPipelineArtifactStorePropertyFromCloudFormation(properties.ArtifactStore) : undefined));
  ret.addPropertyResult("artifactStores", "ArtifactStores", (properties.ArtifactStores != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineArtifactStoreMapPropertyFromCloudFormation)(properties.ArtifactStores) : undefined));
  ret.addPropertyResult("disableInboundStageTransitions", "DisableInboundStageTransitions", (properties.DisableInboundStageTransitions != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineStageTransitionPropertyFromCloudFormation)(properties.DisableInboundStageTransitions) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("pipelineType", "PipelineType", (properties.PipelineType != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineType) : undefined));
  ret.addPropertyResult("restartExecutionOnUpdate", "RestartExecutionOnUpdate", (properties.RestartExecutionOnUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestartExecutionOnUpdate) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("stages", "Stages", (properties.Stages != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineStageDeclarationPropertyFromCloudFormation)(properties.Stages) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("triggers", "Triggers", (properties.Triggers != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelinePipelineTriggerDeclarationPropertyFromCloudFormation)(properties.Triggers) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineVariableDeclarationPropertyFromCloudFormation)(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CodePipeline::Webhook` resource creates and registers your webhook.
 *
 * After the webhook is created and registered, it triggers your pipeline to start every time an external event occurs. For more information, see [Migrate polling pipelines to use event-based change detection](https://docs.aws.amazon.com/codepipeline/latest/userguide/update-change-detection.html) in the *AWS CodePipeline User Guide* .
 *
 * We strongly recommend that you use AWS Secrets Manager to store your credentials. If you use Secrets Manager, you must have already configured and stored your secret parameters in Secrets Manager. For more information, see [Using Dynamic References to Specify Template Values](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) .
 *
 * > When passing secret parameters, do not enter the value directly into the template. The value is rendered as plaintext and is therefore readable. For security reasons, do not use plaintext in your AWS CloudFormation template to store your credentials.
 *
 * @cloudformationResource AWS::CodePipeline::Webhook
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html
 */
export class CfnWebhook extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodePipeline::Webhook";

  /**
   * Build a CfnWebhook from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWebhook {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWebhookPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWebhook(scope, id, propsResult.value);
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
   * The webhook URL generated by AWS CodePipeline , such as `https://eu-central-1.webhooks.aws/trigger123456` .
   *
   * @cloudformationAttribute Url
   */
  public readonly attrUrl: string;

  /**
   * Supported options are GITHUB_HMAC, IP, and UNAUTHENTICATED.
   */
  public authentication: string;

  /**
   * Properties that configure the authentication applied to incoming webhook trigger requests.
   */
  public authenticationConfiguration: cdk.IResolvable | CfnWebhook.WebhookAuthConfigurationProperty;

  /**
   * A list of rules applied to the body/payload sent in the POST request to a webhook URL.
   */
  public filters: Array<cdk.IResolvable | CfnWebhook.WebhookFilterRuleProperty> | cdk.IResolvable;

  /**
   * The name of the webhook.
   */
  public name?: string;

  /**
   * Configures a connection between the webhook that was created and the external tool with events to be detected.
   */
  public registerWithThirdParty?: boolean | cdk.IResolvable;

  /**
   * The name of the action in a pipeline you want to connect to the webhook.
   */
  public targetAction: string;

  /**
   * The name of the pipeline you want to connect to the webhook.
   */
  public targetPipeline: string;

  /**
   * The version number of the pipeline to be connected to the trigger request.
   */
  public targetPipelineVersion: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWebhookProps) {
    super(scope, id, {
      "type": CfnWebhook.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authentication", this);
    cdk.requireProperty(props, "authenticationConfiguration", this);
    cdk.requireProperty(props, "filters", this);
    cdk.requireProperty(props, "targetAction", this);
    cdk.requireProperty(props, "targetPipeline", this);
    cdk.requireProperty(props, "targetPipelineVersion", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrUrl = cdk.Token.asString(this.getAtt("Url", cdk.ResolutionTypeHint.STRING));
    this.authentication = props.authentication;
    this.authenticationConfiguration = props.authenticationConfiguration;
    this.filters = props.filters;
    this.name = props.name;
    this.registerWithThirdParty = props.registerWithThirdParty;
    this.targetAction = props.targetAction;
    this.targetPipeline = props.targetPipeline;
    this.targetPipelineVersion = props.targetPipelineVersion;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authentication": this.authentication,
      "authenticationConfiguration": this.authenticationConfiguration,
      "filters": this.filters,
      "name": this.name,
      "registerWithThirdParty": this.registerWithThirdParty,
      "targetAction": this.targetAction,
      "targetPipeline": this.targetPipeline,
      "targetPipelineVersion": this.targetPipelineVersion
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWebhook.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWebhookPropsToCloudFormation(props);
  }
}

export namespace CfnWebhook {
  /**
   * The authentication applied to incoming webhook trigger requests.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html
   */
  export interface WebhookAuthConfigurationProperty {
    /**
     * The property used to configure acceptance of webhooks in an IP address range.
     *
     * For IP, only the `AllowedIPRange` property must be set. This property must be set to a valid CIDR range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html#cfn-codepipeline-webhook-webhookauthconfiguration-allowediprange
     */
    readonly allowedIpRange?: string;

    /**
     * The property used to configure GitHub authentication.
     *
     * For GITHUB_HMAC, only the `SecretToken` property must be set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookauthconfiguration.html#cfn-codepipeline-webhook-webhookauthconfiguration-secrettoken
     */
    readonly secretToken?: string;
  }

  /**
   * The event criteria that specify when a webhook notification is sent to your URL.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html
   */
  export interface WebhookFilterRuleProperty {
    /**
     * A JsonPath expression that is applied to the body/payload of the webhook.
     *
     * The value selected by the JsonPath expression must match the value specified in the `MatchEquals` field. Otherwise, the request is ignored. For more information, see [Java JsonPath implementation](https://docs.aws.amazon.com/https://github.com/json-path/JsonPath) in GitHub.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html#cfn-codepipeline-webhook-webhookfilterrule-jsonpath
     */
    readonly jsonPath: string;

    /**
     * The value selected by the `JsonPath` expression must match what is supplied in the `MatchEquals` field.
     *
     * Otherwise, the request is ignored. Properties from the target action configuration can be included as placeholders in this value by surrounding the action configuration key with curly brackets. For example, if the value supplied here is "refs/heads/{Branch}" and the target action has an action configuration property called "Branch" with a value of "main", the `MatchEquals` value is evaluated as "refs/heads/main". For a list of action configuration properties for built-in action types, see [Pipeline Structure Reference Action Requirements](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-webhook-webhookfilterrule.html#cfn-codepipeline-webhook-webhookfilterrule-matchequals
     */
    readonly matchEquals?: string;
  }
}

/**
 * Properties for defining a `CfnWebhook`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html
 */
export interface CfnWebhookProps {
  /**
   * Supported options are GITHUB_HMAC, IP, and UNAUTHENTICATED.
   *
   * - For information about the authentication scheme implemented by GITHUB_HMAC, see [Securing your webhooks](https://docs.aws.amazon.com/https://developer.github.com/webhooks/securing/) on the GitHub Developer website.
   * - IP rejects webhooks trigger requests unless they originate from an IP address in the IP range whitelisted in the authentication configuration.
   * - UNAUTHENTICATED accepts all webhook trigger requests regardless of origin.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authentication
   */
  readonly authentication: string;

  /**
   * Properties that configure the authentication applied to incoming webhook trigger requests.
   *
   * The required properties depend on the authentication type. For GITHUB_HMAC, only the `SecretToken` property must be set. For IP, only the `AllowedIPRange` property must be set to a valid CIDR range. For UNAUTHENTICATED, no properties can be set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-authenticationconfiguration
   */
  readonly authenticationConfiguration: cdk.IResolvable | CfnWebhook.WebhookAuthConfigurationProperty;

  /**
   * A list of rules applied to the body/payload sent in the POST request to a webhook URL.
   *
   * All defined rules must pass for the request to be accepted and the pipeline started.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-filters
   */
  readonly filters: Array<cdk.IResolvable | CfnWebhook.WebhookFilterRuleProperty> | cdk.IResolvable;

  /**
   * The name of the webhook.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-name
   */
  readonly name?: string;

  /**
   * Configures a connection between the webhook that was created and the external tool with events to be detected.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-registerwiththirdparty
   */
  readonly registerWithThirdParty?: boolean | cdk.IResolvable;

  /**
   * The name of the action in a pipeline you want to connect to the webhook.
   *
   * The action must be from the source (first) stage of the pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetaction
   */
  readonly targetAction: string;

  /**
   * The name of the pipeline you want to connect to the webhook.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipeline
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-webhook.html#cfn-codepipeline-webhook-targetpipelineversion
   */
  readonly targetPipelineVersion: number;
}

/**
 * Determine whether the given properties match those of a `WebhookAuthConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebhookAuthConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebhookWebhookAuthConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedIpRange", cdk.validateString)(properties.allowedIpRange));
  errors.collect(cdk.propertyValidator("secretToken", cdk.validateString)(properties.secretToken));
  return errors.wrap("supplied properties not correct for \"WebhookAuthConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebhookWebhookAuthConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebhookWebhookAuthConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowedIPRange": cdk.stringToCloudFormation(properties.allowedIpRange),
    "SecretToken": cdk.stringToCloudFormation(properties.secretToken)
  };
}

// @ts-ignore TS6133
function CfnWebhookWebhookAuthConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebhook.WebhookAuthConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebhook.WebhookAuthConfigurationProperty>();
  ret.addPropertyResult("allowedIpRange", "AllowedIPRange", (properties.AllowedIPRange != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedIPRange) : undefined));
  ret.addPropertyResult("secretToken", "SecretToken", (properties.SecretToken != null ? cfn_parse.FromCloudFormation.getString(properties.SecretToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebhookFilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `WebhookFilterRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebhookWebhookFilterRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jsonPath", cdk.requiredValidator)(properties.jsonPath));
  errors.collect(cdk.propertyValidator("jsonPath", cdk.validateString)(properties.jsonPath));
  errors.collect(cdk.propertyValidator("matchEquals", cdk.validateString)(properties.matchEquals));
  return errors.wrap("supplied properties not correct for \"WebhookFilterRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnWebhookWebhookFilterRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebhookWebhookFilterRulePropertyValidator(properties).assertSuccess();
  return {
    "JsonPath": cdk.stringToCloudFormation(properties.jsonPath),
    "MatchEquals": cdk.stringToCloudFormation(properties.matchEquals)
  };
}

// @ts-ignore TS6133
function CfnWebhookWebhookFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWebhook.WebhookFilterRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebhook.WebhookFilterRuleProperty>();
  ret.addPropertyResult("jsonPath", "JsonPath", (properties.JsonPath != null ? cfn_parse.FromCloudFormation.getString(properties.JsonPath) : undefined));
  ret.addPropertyResult("matchEquals", "MatchEquals", (properties.MatchEquals != null ? cfn_parse.FromCloudFormation.getString(properties.MatchEquals) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWebhookProps`
 *
 * @param properties - the TypeScript properties of a `CfnWebhookProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWebhookPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authentication", cdk.requiredValidator)(properties.authentication));
  errors.collect(cdk.propertyValidator("authentication", cdk.validateString)(properties.authentication));
  errors.collect(cdk.propertyValidator("authenticationConfiguration", cdk.requiredValidator)(properties.authenticationConfiguration));
  errors.collect(cdk.propertyValidator("authenticationConfiguration", CfnWebhookWebhookAuthConfigurationPropertyValidator)(properties.authenticationConfiguration));
  errors.collect(cdk.propertyValidator("filters", cdk.requiredValidator)(properties.filters));
  errors.collect(cdk.propertyValidator("filters", cdk.listValidator(CfnWebhookWebhookFilterRulePropertyValidator))(properties.filters));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("registerWithThirdParty", cdk.validateBoolean)(properties.registerWithThirdParty));
  errors.collect(cdk.propertyValidator("targetAction", cdk.requiredValidator)(properties.targetAction));
  errors.collect(cdk.propertyValidator("targetAction", cdk.validateString)(properties.targetAction));
  errors.collect(cdk.propertyValidator("targetPipeline", cdk.requiredValidator)(properties.targetPipeline));
  errors.collect(cdk.propertyValidator("targetPipeline", cdk.validateString)(properties.targetPipeline));
  errors.collect(cdk.propertyValidator("targetPipelineVersion", cdk.requiredValidator)(properties.targetPipelineVersion));
  errors.collect(cdk.propertyValidator("targetPipelineVersion", cdk.validateNumber)(properties.targetPipelineVersion));
  return errors.wrap("supplied properties not correct for \"CfnWebhookProps\"");
}

// @ts-ignore TS6133
function convertCfnWebhookPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWebhookPropsValidator(properties).assertSuccess();
  return {
    "Authentication": cdk.stringToCloudFormation(properties.authentication),
    "AuthenticationConfiguration": convertCfnWebhookWebhookAuthConfigurationPropertyToCloudFormation(properties.authenticationConfiguration),
    "Filters": cdk.listMapper(convertCfnWebhookWebhookFilterRulePropertyToCloudFormation)(properties.filters),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RegisterWithThirdParty": cdk.booleanToCloudFormation(properties.registerWithThirdParty),
    "TargetAction": cdk.stringToCloudFormation(properties.targetAction),
    "TargetPipeline": cdk.stringToCloudFormation(properties.targetPipeline),
    "TargetPipelineVersion": cdk.numberToCloudFormation(properties.targetPipelineVersion)
  };
}

// @ts-ignore TS6133
function CfnWebhookPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWebhookProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWebhookProps>();
  ret.addPropertyResult("authentication", "Authentication", (properties.Authentication != null ? cfn_parse.FromCloudFormation.getString(properties.Authentication) : undefined));
  ret.addPropertyResult("authenticationConfiguration", "AuthenticationConfiguration", (properties.AuthenticationConfiguration != null ? CfnWebhookWebhookAuthConfigurationPropertyFromCloudFormation(properties.AuthenticationConfiguration) : undefined));
  ret.addPropertyResult("filters", "Filters", (properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnWebhookWebhookFilterRulePropertyFromCloudFormation)(properties.Filters) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("registerWithThirdParty", "RegisterWithThirdParty", (properties.RegisterWithThirdParty != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RegisterWithThirdParty) : undefined));
  ret.addPropertyResult("targetAction", "TargetAction", (properties.TargetAction != null ? cfn_parse.FromCloudFormation.getString(properties.TargetAction) : undefined));
  ret.addPropertyResult("targetPipeline", "TargetPipeline", (properties.TargetPipeline != null ? cfn_parse.FromCloudFormation.getString(properties.TargetPipeline) : undefined));
  ret.addPropertyResult("targetPipelineVersion", "TargetPipelineVersion", (properties.TargetPipelineVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetPipelineVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}