/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Detailed data of an AWS Proton environment account connection resource.
 *
 * @cloudformationResource AWS::Proton::EnvironmentAccountConnection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html
 */
export class CfnEnvironmentAccountConnection extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Proton::EnvironmentAccountConnection";

  /**
   * Build a CfnEnvironmentAccountConnection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironmentAccountConnection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnvironmentAccountConnectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnvironmentAccountConnection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the environment account connection ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the environment account connection ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Returns the environment account connection status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The Amazon Resource Name (ARN) of an IAM service role in the environment account.
   */
  public codebuildRoleArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM service role that AWS Proton uses when provisioning directly defined components in the associated environment account.
   */
  public componentRoleArn?: string;

  /**
   * The environment account that's connected to the environment account connection.
   */
  public environmentAccountId?: string;

  /**
   * The name of the environment that's associated with the environment account connection.
   */
  public environmentName?: string;

  /**
   * The ID of the management account that's connected to the environment account connection.
   */
  public managementAccountId?: string;

  /**
   * The IAM service role that's associated with the environment account connection.
   */
  public roleArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional list of metadata items that you can associate with the AWS Proton environment account connection.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentAccountConnectionProps = {}) {
    super(scope, id, {
      "type": CfnEnvironmentAccountConnection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.codebuildRoleArn = props.codebuildRoleArn;
    this.componentRoleArn = props.componentRoleArn;
    this.environmentAccountId = props.environmentAccountId;
    this.environmentName = props.environmentName;
    this.managementAccountId = props.managementAccountId;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Proton::EnvironmentAccountConnection", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "codebuildRoleArn": this.codebuildRoleArn,
      "componentRoleArn": this.componentRoleArn,
      "environmentAccountId": this.environmentAccountId,
      "environmentName": this.environmentName,
      "managementAccountId": this.managementAccountId,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironmentAccountConnection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentAccountConnectionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEnvironmentAccountConnection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html
 */
export interface CfnEnvironmentAccountConnectionProps {
  /**
   * The Amazon Resource Name (ARN) of an IAM service role in the environment account.
   *
   * AWS Proton uses this role to provision infrastructure resources using CodeBuild-based provisioning in the associated environment account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html#cfn-proton-environmentaccountconnection-codebuildrolearn
   */
  readonly codebuildRoleArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM service role that AWS Proton uses when provisioning directly defined components in the associated environment account.
   *
   * It determines the scope of infrastructure that a component can provision in the account.
   *
   * The environment account connection must have a `componentRoleArn` to allow directly defined components to be associated with any environments running in the account.
   *
   * For more information about components, see [AWS Proton components](https://docs.aws.amazon.com/proton/latest/userguide/ag-components.html) in the *AWS Proton User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html#cfn-proton-environmentaccountconnection-componentrolearn
   */
  readonly componentRoleArn?: string;

  /**
   * The environment account that's connected to the environment account connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html#cfn-proton-environmentaccountconnection-environmentaccountid
   */
  readonly environmentAccountId?: string;

  /**
   * The name of the environment that's associated with the environment account connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html#cfn-proton-environmentaccountconnection-environmentname
   */
  readonly environmentName?: string;

  /**
   * The ID of the management account that's connected to the environment account connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html#cfn-proton-environmentaccountconnection-managementaccountid
   */
  readonly managementAccountId?: string;

  /**
   * The IAM service role that's associated with the environment account connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html#cfn-proton-environmentaccountconnection-rolearn
   */
  readonly roleArn?: string;

  /**
   * An optional list of metadata items that you can associate with the AWS Proton environment account connection.
   *
   * A tag is a key-value pair.
   *
   * For more information, see [AWS Proton resources and tagging](https://docs.aws.amazon.com/proton/latest/userguide/resources.html) in the *AWS Proton User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmentaccountconnection.html#cfn-proton-environmentaccountconnection-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentAccountConnectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentAccountConnectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentAccountConnectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codebuildRoleArn", cdk.validateString)(properties.codebuildRoleArn));
  errors.collect(cdk.propertyValidator("componentRoleArn", cdk.validateString)(properties.componentRoleArn));
  errors.collect(cdk.propertyValidator("environmentAccountId", cdk.validateString)(properties.environmentAccountId));
  errors.collect(cdk.propertyValidator("environmentName", cdk.validateString)(properties.environmentName));
  errors.collect(cdk.propertyValidator("managementAccountId", cdk.validateString)(properties.managementAccountId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentAccountConnectionProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentAccountConnectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentAccountConnectionPropsValidator(properties).assertSuccess();
  return {
    "CodebuildRoleArn": cdk.stringToCloudFormation(properties.codebuildRoleArn),
    "ComponentRoleArn": cdk.stringToCloudFormation(properties.componentRoleArn),
    "EnvironmentAccountId": cdk.stringToCloudFormation(properties.environmentAccountId),
    "EnvironmentName": cdk.stringToCloudFormation(properties.environmentName),
    "ManagementAccountId": cdk.stringToCloudFormation(properties.managementAccountId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentAccountConnectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentAccountConnectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentAccountConnectionProps>();
  ret.addPropertyResult("codebuildRoleArn", "CodebuildRoleArn", (properties.CodebuildRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.CodebuildRoleArn) : undefined));
  ret.addPropertyResult("componentRoleArn", "ComponentRoleArn", (properties.ComponentRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentRoleArn) : undefined));
  ret.addPropertyResult("environmentAccountId", "EnvironmentAccountId", (properties.EnvironmentAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentAccountId) : undefined));
  ret.addPropertyResult("environmentName", "EnvironmentName", (properties.EnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentName) : undefined));
  ret.addPropertyResult("managementAccountId", "ManagementAccountId", (properties.ManagementAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.ManagementAccountId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create an environment template for AWS Proton .
 *
 * For more information, see [Environment Templates](https://docs.aws.amazon.com/proton/latest/userguide/ag-templates.html) in the *AWS Proton User Guide* .
 *
 * You can create an environment template in one of the two following ways:
 *
 * - Register and publish a *standard* environment template that instructs AWS Proton to deploy and manage environment infrastructure.
 * - Register and publish a *customer managed* environment template that connects AWS Proton to your existing provisioned infrastructure that you manage. AWS Proton *doesn't* manage your existing provisioned infrastructure. To create an environment template for customer provisioned and managed infrastructure, include the `provisioning` parameter and set the value to `CUSTOMER_MANAGED` . For more information, see [Register and publish an environment template](https://docs.aws.amazon.com/proton/latest/userguide/template-create.html) in the *AWS Proton User Guide* .
 *
 * @cloudformationResource AWS::Proton::EnvironmentTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html
 */
export class CfnEnvironmentTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Proton::EnvironmentTemplate";

  /**
   * Build a CfnEnvironmentTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironmentTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnvironmentTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnvironmentTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of the environment template.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A description of the environment template.
   */
  public description?: string;

  /**
   * The name of the environment template as displayed in the developer interface.
   */
  public displayName?: string;

  /**
   * The customer provided encryption key for the environment template.
   */
  public encryptionKey?: string;

  /**
   * The name of the environment template.
   */
  public name?: string;

  /**
   * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
   */
  public provisioning?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An optional list of metadata items that you can associate with the AWS Proton environment template.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentTemplateProps = {}) {
    super(scope, id, {
      "type": CfnEnvironmentTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.displayName = props.displayName;
    this.encryptionKey = props.encryptionKey;
    this.name = props.name;
    this.provisioning = props.provisioning;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Proton::EnvironmentTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "displayName": this.displayName,
      "encryptionKey": this.encryptionKey,
      "name": this.name,
      "provisioning": this.provisioning,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironmentTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentTemplatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEnvironmentTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html
 */
export interface CfnEnvironmentTemplateProps {
  /**
   * A description of the environment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html#cfn-proton-environmenttemplate-description
   */
  readonly description?: string;

  /**
   * The name of the environment template as displayed in the developer interface.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html#cfn-proton-environmenttemplate-displayname
   */
  readonly displayName?: string;

  /**
   * The customer provided encryption key for the environment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html#cfn-proton-environmenttemplate-encryptionkey
   */
  readonly encryptionKey?: string;

  /**
   * The name of the environment template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html#cfn-proton-environmenttemplate-name
   */
  readonly name?: string;

  /**
   * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html#cfn-proton-environmenttemplate-provisioning
   */
  readonly provisioning?: string;

  /**
   * An optional list of metadata items that you can associate with the AWS Proton environment template.
   *
   * A tag is a key-value pair.
   *
   * For more information, see [AWS Proton resources and tagging](https://docs.aws.amazon.com/proton/latest/userguide/resources.html) in the *AWS Proton User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-environmenttemplate.html#cfn-proton-environmenttemplate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("encryptionKey", cdk.validateString)(properties.encryptionKey));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("provisioning", cdk.validateString)(properties.provisioning));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentTemplatePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "EncryptionKey": cdk.stringToCloudFormation(properties.encryptionKey),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Provisioning": cdk.stringToCloudFormation(properties.provisioning),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentTemplateProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("encryptionKey", "EncryptionKey", (properties.EncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKey) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("provisioning", "Provisioning", (properties.Provisioning != null ? cfn_parse.FromCloudFormation.getString(properties.Provisioning) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a service template.
 *
 * The administrator creates a service template to define standardized infrastructure and an optional CI/CD service pipeline. Developers, in turn, select the service template from AWS Proton . If the selected service template includes a service pipeline definition, they provide a link to their source code repository. AWS Proton then deploys and manages the infrastructure defined by the selected service template. For more information, see [AWS Proton templates](https://docs.aws.amazon.com/proton/latest/userguide/ag-templates.html) in the *AWS Proton User Guide* .
 *
 * @cloudformationResource AWS::Proton::ServiceTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html
 */
export class CfnServiceTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Proton::ServiceTemplate";

  /**
   * Build a CfnServiceTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServiceTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServiceTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the service template ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A description of the service template.
   */
  public description?: string;

  /**
   * The service template name as displayed in the developer interface.
   */
  public displayName?: string;

  /**
   * The customer provided service template encryption key that's used to encrypt data.
   */
  public encryptionKey?: string;

  /**
   * The name of the service template.
   */
  public name?: string;

  /**
   * If `pipelineProvisioning` is `true` , a service pipeline is included in the service template.
   */
  public pipelineProvisioning?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An object that includes the template bundle S3 bucket path and name for the new version of a service template.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceTemplateProps = {}) {
    super(scope, id, {
      "type": CfnServiceTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.displayName = props.displayName;
    this.encryptionKey = props.encryptionKey;
    this.name = props.name;
    this.pipelineProvisioning = props.pipelineProvisioning;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Proton::ServiceTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "displayName": this.displayName,
      "encryptionKey": this.encryptionKey,
      "name": this.name,
      "pipelineProvisioning": this.pipelineProvisioning,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceTemplatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnServiceTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html
 */
export interface CfnServiceTemplateProps {
  /**
   * A description of the service template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html#cfn-proton-servicetemplate-description
   */
  readonly description?: string;

  /**
   * The service template name as displayed in the developer interface.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html#cfn-proton-servicetemplate-displayname
   */
  readonly displayName?: string;

  /**
   * The customer provided service template encryption key that's used to encrypt data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html#cfn-proton-servicetemplate-encryptionkey
   */
  readonly encryptionKey?: string;

  /**
   * The name of the service template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html#cfn-proton-servicetemplate-name
   */
  readonly name?: string;

  /**
   * If `pipelineProvisioning` is `true` , a service pipeline is included in the service template.
   *
   * Otherwise, a service pipeline *isn't* included in the service template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html#cfn-proton-servicetemplate-pipelineprovisioning
   */
  readonly pipelineProvisioning?: string;

  /**
   * An object that includes the template bundle S3 bucket path and name for the new version of a service template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-proton-servicetemplate.html#cfn-proton-servicetemplate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnServiceTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("encryptionKey", cdk.validateString)(properties.encryptionKey));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("pipelineProvisioning", cdk.validateString)(properties.pipelineProvisioning));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnServiceTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceTemplatePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "EncryptionKey": cdk.stringToCloudFormation(properties.encryptionKey),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PipelineProvisioning": cdk.stringToCloudFormation(properties.pipelineProvisioning),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnServiceTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceTemplateProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("encryptionKey", "EncryptionKey", (properties.EncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKey) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("pipelineProvisioning", "PipelineProvisioning", (properties.PipelineProvisioning != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineProvisioning) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}