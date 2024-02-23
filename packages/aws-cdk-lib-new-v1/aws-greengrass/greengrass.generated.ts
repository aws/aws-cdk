/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Greengrass::ConnectorDefinition` resource represents a connector definition for AWS IoT Greengrass .
 *
 * Connector definitions are used to organize your connector definition versions.
 *
 * Connector definitions can reference multiple connector definition versions. All connector definition versions must be associated with a connector definition. Each connector definition version can contain one or more connectors.
 *
 * > When you create a connector definition, you can optionally include an initial connector definition version. To associate a connector definition version later, create an [`AWS::Greengrass::ConnectorDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinitionversion.html) resource and specify the ID of this connector definition.
 * >
 * > After you create the connector definition version that contains the connectors you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::ConnectorDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinition.html
 */
export class CfnConnectorDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::ConnectorDefinition";

  /**
   * Build a CfnConnectorDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectorDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectorDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnectorDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `ConnectorDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/connectors/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `ConnectorDefinition` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `ConnectorDefinitionVersion` that was added to the `ConnectorDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/connectors/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the `ConnectorDefinition` , such as `MyConnectorDefinition` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The connector definition version to include when the connector definition is created.
   */
  public initialVersion?: CfnConnectorDefinition.ConnectorDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the connector definition.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the connector definition.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectorDefinitionProps) {
    super(scope, id, {
      "type": CfnConnectorDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::ConnectorDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectorDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectorDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnConnectorDefinition {
  /**
   * A connector definition version contains a list of connectors.
   *
   * > After you create a connector definition version that contains the connectors you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
   *
   * In an AWS CloudFormation template, `ConnectorDefinitionVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::ConnectorDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinition.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connectordefinitionversion.html
   */
  export interface ConnectorDefinitionVersionProperty {
    /**
     * The connectors in this version.
     *
     * Only one instance of a given connector can be added to a connector definition version at a time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connectordefinitionversion.html#cfn-greengrass-connectordefinition-connectordefinitionversion-connectors
     */
    readonly connectors: Array<CfnConnectorDefinition.ConnectorProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Connectors are modules that provide built-in integration with local infrastructure, device protocols, AWS , and other cloud services.
   *
   * For more information, see [Integrate with Services and Protocols Using Greengrass Connectors](https://docs.aws.amazon.com/greengrass/v1/developerguide/connectors.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Connectors` property of the [`ConnectorDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connectordefinitionversion.html) property type contains a list of `Connector` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connector.html
   */
  export interface ConnectorProperty {
    /**
     * The Amazon Resource Name (ARN) of the connector.
     *
     * For more information about connectors provided by AWS , see [Greengrass Connectors Provided by AWS](https://docs.aws.amazon.com/greengrass/v1/developerguide/connectors-list.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connector.html#cfn-greengrass-connectordefinition-connector-connectorarn
     */
    readonly connectorArn: string;

    /**
     * A descriptive or arbitrary ID for the connector.
     *
     * This value must be unique within the connector definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connector.html#cfn-greengrass-connectordefinition-connector-id
     */
    readonly id: string;

    /**
     * The parameters or configuration used by the connector.
     *
     * For more information about connectors provided by AWS , see [Greengrass Connectors Provided by AWS](https://docs.aws.amazon.com/greengrass/v1/developerguide/connectors-list.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connector.html#cfn-greengrass-connectordefinition-connector-parameters
     */
    readonly parameters?: any | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnConnectorDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinition.html
 */
export interface CfnConnectorDefinitionProps {
  /**
   * The connector definition version to include when the connector definition is created.
   *
   * A connector definition version contains a list of [`connector`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinition-connector.html) property types.
   *
   * > To associate a connector definition version after the connector definition is created, create an [`AWS::Greengrass::ConnectorDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinitionversion.html) resource and specify the ID of this connector definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinition.html#cfn-greengrass-connectordefinition-initialversion
   */
  readonly initialVersion?: CfnConnectorDefinition.ConnectorDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the connector definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinition.html#cfn-greengrass-connectordefinition-name
   */
  readonly name: string;

  /**
   * Application-specific metadata to attach to the connector definition.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinition.html#cfn-greengrass-connectordefinition-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `ConnectorProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorDefinitionConnectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorArn", cdk.requiredValidator)(properties.connectorArn));
  errors.collect(cdk.propertyValidator("connectorArn", cdk.validateString)(properties.connectorArn));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  return errors.wrap("supplied properties not correct for \"ConnectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorDefinitionConnectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorDefinitionConnectorPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorArn": cdk.stringToCloudFormation(properties.connectorArn),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Parameters": cdk.objectToCloudFormation(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnConnectorDefinitionConnectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorDefinition.ConnectorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorDefinition.ConnectorProperty>();
  ret.addPropertyResult("connectorArn", "ConnectorArn", (properties.ConnectorArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorArn) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectorDefinitionVersionProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorDefinitionVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorDefinitionConnectorDefinitionVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectors", cdk.requiredValidator)(properties.connectors));
  errors.collect(cdk.propertyValidator("connectors", cdk.listValidator(CfnConnectorDefinitionConnectorPropertyValidator))(properties.connectors));
  return errors.wrap("supplied properties not correct for \"ConnectorDefinitionVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorDefinitionConnectorDefinitionVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorDefinitionConnectorDefinitionVersionPropertyValidator(properties).assertSuccess();
  return {
    "Connectors": cdk.listMapper(convertCfnConnectorDefinitionConnectorPropertyToCloudFormation)(properties.connectors)
  };
}

// @ts-ignore TS6133
function CfnConnectorDefinitionConnectorDefinitionVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorDefinition.ConnectorDefinitionVersionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorDefinition.ConnectorDefinitionVersionProperty>();
  ret.addPropertyResult("connectors", "Connectors", (properties.Connectors != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectorDefinitionConnectorPropertyFromCloudFormation)(properties.Connectors) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnConnectorDefinitionConnectorDefinitionVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConnectorDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectorDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorDefinitionPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnConnectorDefinitionConnectorDefinitionVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConnectorDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorDefinitionProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnConnectorDefinitionConnectorDefinitionVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::ConnectorDefinitionVersion` resource represents a connector definition version for AWS IoT Greengrass .
 *
 * A connector definition version contains a list of connectors.
 *
 * > To create a connector definition version, you must specify the ID of the connector definition that you want to associate with the version. For information about creating a connector definition, see [`AWS::Greengrass::ConnectorDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinition.html) .
 * >
 * > After you create a connector definition version that contains the connectors you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::ConnectorDefinitionVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinitionversion.html
 */
export class CfnConnectorDefinitionVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::ConnectorDefinitionVersion";

  /**
   * Build a CfnConnectorDefinitionVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectorDefinitionVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectorDefinitionVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnectorDefinitionVersion(scope, id, propsResult.value);
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
   * The ID of the connector definition associated with this version.
   */
  public connectorDefinitionId: string;

  /**
   * The connectors in this version.
   */
  public connectors: Array<CfnConnectorDefinitionVersion.ConnectorProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectorDefinitionVersionProps) {
    super(scope, id, {
      "type": CfnConnectorDefinitionVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectorDefinitionId", this);
    cdk.requireProperty(props, "connectors", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.connectorDefinitionId = props.connectorDefinitionId;
    this.connectors = props.connectors;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectorDefinitionId": this.connectorDefinitionId,
      "connectors": this.connectors
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectorDefinitionVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectorDefinitionVersionPropsToCloudFormation(props);
  }
}

export namespace CfnConnectorDefinitionVersion {
  /**
   * Connectors are modules that provide built-in integration with local infrastructure, device protocols, AWS , and other cloud services.
   *
   * For more information, see [Integrate with Services and Protocols Using Greengrass Connectors](https://docs.aws.amazon.com/greengrass/v1/developerguide/connectors.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Connectors` property of the [`AWS::Greengrass::ConnectorDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinitionversion.html) resource contains a list of `Connector` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinitionversion-connector.html
   */
  export interface ConnectorProperty {
    /**
     * The Amazon Resource Name (ARN) of the connector.
     *
     * For more information about connectors provided by AWS , see [Greengrass Connectors Provided by AWS](https://docs.aws.amazon.com/greengrass/v1/developerguide/connectors-list.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinitionversion-connector.html#cfn-greengrass-connectordefinitionversion-connector-connectorarn
     */
    readonly connectorArn: string;

    /**
     * A descriptive or arbitrary ID for the connector.
     *
     * This value must be unique within the connector definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinitionversion-connector.html#cfn-greengrass-connectordefinitionversion-connector-id
     */
    readonly id: string;

    /**
     * The parameters or configuration that the connector uses.
     *
     * For more information about connectors provided by AWS , see [Greengrass Connectors Provided by AWS](https://docs.aws.amazon.com/greengrass/v1/developerguide/connectors-list.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-connectordefinitionversion-connector.html#cfn-greengrass-connectordefinitionversion-connector-parameters
     */
    readonly parameters?: any | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnConnectorDefinitionVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinitionversion.html
 */
export interface CfnConnectorDefinitionVersionProps {
  /**
   * The ID of the connector definition associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinitionversion.html#cfn-greengrass-connectordefinitionversion-connectordefinitionid
   */
  readonly connectorDefinitionId: string;

  /**
   * The connectors in this version.
   *
   * Only one instance of a given connector can be added to the connector definition version at a time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-connectordefinitionversion.html#cfn-greengrass-connectordefinitionversion-connectors
   */
  readonly connectors: Array<CfnConnectorDefinitionVersion.ConnectorProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ConnectorProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorDefinitionVersionConnectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorArn", cdk.requiredValidator)(properties.connectorArn));
  errors.collect(cdk.propertyValidator("connectorArn", cdk.validateString)(properties.connectorArn));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  return errors.wrap("supplied properties not correct for \"ConnectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorDefinitionVersionConnectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorDefinitionVersionConnectorPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorArn": cdk.stringToCloudFormation(properties.connectorArn),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Parameters": cdk.objectToCloudFormation(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnConnectorDefinitionVersionConnectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorDefinitionVersion.ConnectorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorDefinitionVersion.ConnectorProperty>();
  ret.addPropertyResult("connectorArn", "ConnectorArn", (properties.ConnectorArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorArn) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorDefinitionVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorDefinitionVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorDefinitionVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorDefinitionId", cdk.requiredValidator)(properties.connectorDefinitionId));
  errors.collect(cdk.propertyValidator("connectorDefinitionId", cdk.validateString)(properties.connectorDefinitionId));
  errors.collect(cdk.propertyValidator("connectors", cdk.requiredValidator)(properties.connectors));
  errors.collect(cdk.propertyValidator("connectors", cdk.listValidator(CfnConnectorDefinitionVersionConnectorPropertyValidator))(properties.connectors));
  return errors.wrap("supplied properties not correct for \"CfnConnectorDefinitionVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectorDefinitionVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorDefinitionVersionPropsValidator(properties).assertSuccess();
  return {
    "ConnectorDefinitionId": cdk.stringToCloudFormation(properties.connectorDefinitionId),
    "Connectors": cdk.listMapper(convertCfnConnectorDefinitionVersionConnectorPropertyToCloudFormation)(properties.connectors)
  };
}

// @ts-ignore TS6133
function CfnConnectorDefinitionVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorDefinitionVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorDefinitionVersionProps>();
  ret.addPropertyResult("connectorDefinitionId", "ConnectorDefinitionId", (properties.ConnectorDefinitionId != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorDefinitionId) : undefined));
  ret.addPropertyResult("connectors", "Connectors", (properties.Connectors != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectorDefinitionVersionConnectorPropertyFromCloudFormation)(properties.Connectors) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::CoreDefinition` resource represents a core definition for AWS IoT Greengrass .
 *
 * Core definitions are used to organize your core definition versions.
 *
 * Core definitions can reference multiple core definition versions. All core definition versions must be associated with a core definition. Each core definition version can contain one Greengrass core.
 *
 * > When you create a core definition, you can optionally include an initial core definition version. To associate a core definition version later, create an [`AWS::Greengrass::CoreDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinitionversion.html) resource and specify the ID of this core definition.
 * >
 * > After you create the core definition version that contains the core you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::CoreDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinition.html
 */
export class CfnCoreDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::CoreDefinition";

  /**
   * Build a CfnCoreDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCoreDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCoreDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCoreDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `CoreDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/cores/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `CoreDefinition` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `CoreDefinitionVersion` that was added to the `CoreDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/cores/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the `CoreDefinition` , such as `MyCoreDefinition` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The core definition version to include when the core definition is created.
   */
  public initialVersion?: CfnCoreDefinition.CoreDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the core definition.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the core definition.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCoreDefinitionProps) {
    super(scope, id, {
      "type": CfnCoreDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::CoreDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCoreDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCoreDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnCoreDefinition {
  /**
   * A core definition version contains a Greengrass [core](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-core.html) .
   *
   * > After you create a core definition version that contains the core you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
   *
   * In an AWS CloudFormation template, `CoreDefinitionVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::CoreDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinition.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-coredefinitionversion.html
   */
  export interface CoreDefinitionVersionProperty {
    /**
     * The Greengrass core in this version.
     *
     * Currently, the `Cores` property for a core definition version can contain only one core.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-coredefinitionversion.html#cfn-greengrass-coredefinition-coredefinitionversion-cores
     */
    readonly cores: Array<CfnCoreDefinition.CoreProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A core is an AWS IoT device that runs the AWS IoT Greengrass core software and manages local processes for a Greengrass group.
   *
   * For more information, see [What Is AWS IoT Greengrass ?](https://docs.aws.amazon.com/greengrass/v1/developerguide/what-is-gg.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Cores` property of the [`CoreDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-coredefinitionversion.html) property type contains a list of `Core` property types. Currently, the list can contain only one core.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-core.html
   */
  export interface CoreProperty {
    /**
     * The Amazon Resource Name (ARN) of the device certificate for the core.
     *
     * This X.509 certificate is used to authenticate the core with AWS IoT and AWS IoT Greengrass services.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-core.html#cfn-greengrass-coredefinition-core-certificatearn
     */
    readonly certificateArn: string;

    /**
     * A descriptive or arbitrary ID for the core.
     *
     * This value must be unique within the core definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-core.html#cfn-greengrass-coredefinition-core-id
     */
    readonly id: string;

    /**
     * Indicates whether the core's local shadow is synced with the cloud automatically.
     *
     * The default is false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-core.html#cfn-greengrass-coredefinition-core-syncshadow
     */
    readonly syncShadow?: boolean | cdk.IResolvable;

    /**
     * The ARN of the core, which is an AWS IoT device (thing).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-core.html#cfn-greengrass-coredefinition-core-thingarn
     */
    readonly thingArn: string;
  }
}

/**
 * Properties for defining a `CfnCoreDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinition.html
 */
export interface CfnCoreDefinitionProps {
  /**
   * The core definition version to include when the core definition is created.
   *
   * Currently, a core definition version can contain only one [`core`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinition-core.html) .
   *
   * > To associate a core definition version after the core definition is created, create an [`AWS::Greengrass::CoreDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinitionversion.html) resource and specify the ID of this core definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinition.html#cfn-greengrass-coredefinition-initialversion
   */
  readonly initialVersion?: CfnCoreDefinition.CoreDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the core definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinition.html#cfn-greengrass-coredefinition-name
   */
  readonly name: string;

  /**
   * Application-specific metadata to attach to the core definition.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinition.html#cfn-greengrass-coredefinition-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CoreProperty`
 *
 * @param properties - the TypeScript properties of a `CoreProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreDefinitionCorePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("syncShadow", cdk.validateBoolean)(properties.syncShadow));
  errors.collect(cdk.propertyValidator("thingArn", cdk.requiredValidator)(properties.thingArn));
  errors.collect(cdk.propertyValidator("thingArn", cdk.validateString)(properties.thingArn));
  return errors.wrap("supplied properties not correct for \"CoreProperty\"");
}

// @ts-ignore TS6133
function convertCfnCoreDefinitionCorePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreDefinitionCorePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "Id": cdk.stringToCloudFormation(properties.id),
    "SyncShadow": cdk.booleanToCloudFormation(properties.syncShadow),
    "ThingArn": cdk.stringToCloudFormation(properties.thingArn)
  };
}

// @ts-ignore TS6133
function CfnCoreDefinitionCorePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreDefinition.CoreProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreDefinition.CoreProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("syncShadow", "SyncShadow", (properties.SyncShadow != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SyncShadow) : undefined));
  ret.addPropertyResult("thingArn", "ThingArn", (properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CoreDefinitionVersionProperty`
 *
 * @param properties - the TypeScript properties of a `CoreDefinitionVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreDefinitionCoreDefinitionVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cores", cdk.requiredValidator)(properties.cores));
  errors.collect(cdk.propertyValidator("cores", cdk.listValidator(CfnCoreDefinitionCorePropertyValidator))(properties.cores));
  return errors.wrap("supplied properties not correct for \"CoreDefinitionVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnCoreDefinitionCoreDefinitionVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreDefinitionCoreDefinitionVersionPropertyValidator(properties).assertSuccess();
  return {
    "Cores": cdk.listMapper(convertCfnCoreDefinitionCorePropertyToCloudFormation)(properties.cores)
  };
}

// @ts-ignore TS6133
function CfnCoreDefinitionCoreDefinitionVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreDefinition.CoreDefinitionVersionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreDefinition.CoreDefinitionVersionProperty>();
  ret.addPropertyResult("cores", "Cores", (properties.Cores != null ? cfn_parse.FromCloudFormation.getArray(CfnCoreDefinitionCorePropertyFromCloudFormation)(properties.Cores) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCoreDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnCoreDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnCoreDefinitionCoreDefinitionVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCoreDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnCoreDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreDefinitionPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnCoreDefinitionCoreDefinitionVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCoreDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreDefinitionProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnCoreDefinitionCoreDefinitionVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::CoreDefinitionVersion` resource represents a core definition version for AWS IoT Greengrass .
 *
 * A core definition version contains a Greengrass core.
 *
 * > To create a core definition version, you must specify the ID of the core definition that you want to associate with the version. For information about creating a core definition, see [`AWS::Greengrass::CoreDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinition.html) .
 * >
 * > After you create a core definition version that contains the core you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::CoreDefinitionVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinitionversion.html
 */
export class CfnCoreDefinitionVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::CoreDefinitionVersion";

  /**
   * Build a CfnCoreDefinitionVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCoreDefinitionVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCoreDefinitionVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCoreDefinitionVersion(scope, id, propsResult.value);
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
   * The ID of the core definition associated with this version.
   */
  public coreDefinitionId: string;

  /**
   * The Greengrass core in this version.
   */
  public cores: Array<CfnCoreDefinitionVersion.CoreProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCoreDefinitionVersionProps) {
    super(scope, id, {
      "type": CfnCoreDefinitionVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "coreDefinitionId", this);
    cdk.requireProperty(props, "cores", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.coreDefinitionId = props.coreDefinitionId;
    this.cores = props.cores;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "coreDefinitionId": this.coreDefinitionId,
      "cores": this.cores
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCoreDefinitionVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCoreDefinitionVersionPropsToCloudFormation(props);
  }
}

export namespace CfnCoreDefinitionVersion {
  /**
   * A core is an AWS IoT device that runs the AWS IoT Greengrass core software and manages local processes for a Greengrass group.
   *
   * For more information, see [What Is AWS IoT Greengrass ?](https://docs.aws.amazon.com/greengrass/v1/developerguide/what-is-gg.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Cores` property of the [`AWS::Greengrass::CoreDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinitionversion.html) resource contains a list of `Core` property types. Currently, the list can contain only one core.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinitionversion-core.html
   */
  export interface CoreProperty {
    /**
     * The ARN of the device certificate for the core.
     *
     * This X.509 certificate is used to authenticate the core with AWS IoT and AWS IoT Greengrass services.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinitionversion-core.html#cfn-greengrass-coredefinitionversion-core-certificatearn
     */
    readonly certificateArn: string;

    /**
     * A descriptive or arbitrary ID for the core.
     *
     * This value must be unique within the core definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinitionversion-core.html#cfn-greengrass-coredefinitionversion-core-id
     */
    readonly id: string;

    /**
     * Indicates whether the core's local shadow is synced with the cloud automatically.
     *
     * The default is false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinitionversion-core.html#cfn-greengrass-coredefinitionversion-core-syncshadow
     */
    readonly syncShadow?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the core, which is an AWS IoT device (thing).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-coredefinitionversion-core.html#cfn-greengrass-coredefinitionversion-core-thingarn
     */
    readonly thingArn: string;
  }
}

/**
 * Properties for defining a `CfnCoreDefinitionVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinitionversion.html
 */
export interface CfnCoreDefinitionVersionProps {
  /**
   * The ID of the core definition associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinitionversion.html#cfn-greengrass-coredefinitionversion-coredefinitionid
   */
  readonly coreDefinitionId: string;

  /**
   * The Greengrass core in this version.
   *
   * Currently, the `Cores` property for a core definition version can contain only one core.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-coredefinitionversion.html#cfn-greengrass-coredefinitionversion-cores
   */
  readonly cores: Array<CfnCoreDefinitionVersion.CoreProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CoreProperty`
 *
 * @param properties - the TypeScript properties of a `CoreProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreDefinitionVersionCorePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("syncShadow", cdk.validateBoolean)(properties.syncShadow));
  errors.collect(cdk.propertyValidator("thingArn", cdk.requiredValidator)(properties.thingArn));
  errors.collect(cdk.propertyValidator("thingArn", cdk.validateString)(properties.thingArn));
  return errors.wrap("supplied properties not correct for \"CoreProperty\"");
}

// @ts-ignore TS6133
function convertCfnCoreDefinitionVersionCorePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreDefinitionVersionCorePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "Id": cdk.stringToCloudFormation(properties.id),
    "SyncShadow": cdk.booleanToCloudFormation(properties.syncShadow),
    "ThingArn": cdk.stringToCloudFormation(properties.thingArn)
  };
}

// @ts-ignore TS6133
function CfnCoreDefinitionVersionCorePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreDefinitionVersion.CoreProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreDefinitionVersion.CoreProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("syncShadow", "SyncShadow", (properties.SyncShadow != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SyncShadow) : undefined));
  ret.addPropertyResult("thingArn", "ThingArn", (properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCoreDefinitionVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnCoreDefinitionVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreDefinitionVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coreDefinitionId", cdk.requiredValidator)(properties.coreDefinitionId));
  errors.collect(cdk.propertyValidator("coreDefinitionId", cdk.validateString)(properties.coreDefinitionId));
  errors.collect(cdk.propertyValidator("cores", cdk.requiredValidator)(properties.cores));
  errors.collect(cdk.propertyValidator("cores", cdk.listValidator(CfnCoreDefinitionVersionCorePropertyValidator))(properties.cores));
  return errors.wrap("supplied properties not correct for \"CfnCoreDefinitionVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnCoreDefinitionVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreDefinitionVersionPropsValidator(properties).assertSuccess();
  return {
    "CoreDefinitionId": cdk.stringToCloudFormation(properties.coreDefinitionId),
    "Cores": cdk.listMapper(convertCfnCoreDefinitionVersionCorePropertyToCloudFormation)(properties.cores)
  };
}

// @ts-ignore TS6133
function CfnCoreDefinitionVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreDefinitionVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreDefinitionVersionProps>();
  ret.addPropertyResult("coreDefinitionId", "CoreDefinitionId", (properties.CoreDefinitionId != null ? cfn_parse.FromCloudFormation.getString(properties.CoreDefinitionId) : undefined));
  ret.addPropertyResult("cores", "Cores", (properties.Cores != null ? cfn_parse.FromCloudFormation.getArray(CfnCoreDefinitionVersionCorePropertyFromCloudFormation)(properties.Cores) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::DeviceDefinition` resource represents a device definition for AWS IoT Greengrass .
 *
 * Device definitions are used to organize your device definition versions.
 *
 * Device definitions can reference multiple device definition versions. All device definition versions must be associated with a device definition. Each device definition version can contain one or more devices.
 *
 * > When you create a device definition, you can optionally include an initial device definition version. To associate a device definition version later, create an [`AWS::Greengrass::DeviceDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinitionversion.html) resource and specify the ID of this device definition.
 * >
 * > After you create the device definition version that contains the devices you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::DeviceDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinition.html
 */
export class CfnDeviceDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::DeviceDefinition";

  /**
   * Build a CfnDeviceDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeviceDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeviceDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeviceDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `DeviceDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/devices/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `DeviceDefinition` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `DeviceDefinitionVersion` that was added to the `DeviceDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/devices/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the device definition.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The device definition version to include when the device definition is created.
   */
  public initialVersion?: CfnDeviceDefinition.DeviceDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the device definition.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the device definition.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeviceDefinitionProps) {
    super(scope, id, {
      "type": CfnDeviceDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::DeviceDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeviceDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeviceDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnDeviceDefinition {
  /**
   * A device definition version contains a list of [devices](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-device.html) .
   *
   * > After you create a device definition version that contains the devices you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
   *
   * In an AWS CloudFormation template, `DeviceDefinitionVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::DeviceDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinition.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-devicedefinitionversion.html
   */
  export interface DeviceDefinitionVersionProperty {
    /**
     * The devices in this version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-devicedefinitionversion.html#cfn-greengrass-devicedefinition-devicedefinitionversion-devices
     */
    readonly devices: Array<CfnDeviceDefinition.DeviceProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A device is an AWS IoT device (thing) that's added to a Greengrass group.
   *
   * Greengrass devices can communicate with the Greengrass core in the same group. For more information, see [What Is AWS IoT Greengrass ?](https://docs.aws.amazon.com/greengrass/v1/developerguide/what-is-gg.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Devices` property of the [`DeviceDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-devicedefinitionversion.html) property type contains a list of `Device` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-device.html
   */
  export interface DeviceProperty {
    /**
     * The Amazon Resource Name (ARN) of the device certificate for the device.
     *
     * This X.509 certificate is used to authenticate the device with AWS IoT and AWS IoT Greengrass services.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-device.html#cfn-greengrass-devicedefinition-device-certificatearn
     */
    readonly certificateArn: string;

    /**
     * A descriptive or arbitrary ID for the device.
     *
     * This value must be unique within the device definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-device.html#cfn-greengrass-devicedefinition-device-id
     */
    readonly id: string;

    /**
     * Indicates whether the device's local shadow is synced with the cloud automatically.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-device.html#cfn-greengrass-devicedefinition-device-syncshadow
     */
    readonly syncShadow?: boolean | cdk.IResolvable;

    /**
     * The ARN of the device, which is an AWS IoT device (thing).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-device.html#cfn-greengrass-devicedefinition-device-thingarn
     */
    readonly thingArn: string;
  }
}

/**
 * Properties for defining a `CfnDeviceDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinition.html
 */
export interface CfnDeviceDefinitionProps {
  /**
   * The device definition version to include when the device definition is created.
   *
   * A device definition version contains a list of [`device`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinition-device.html) property types.
   *
   * > To associate a device definition version after the device definition is created, create an [`AWS::Greengrass::DeviceDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinitionversion.html) resource and specify the ID of this device definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinition.html#cfn-greengrass-devicedefinition-initialversion
   */
  readonly initialVersion?: CfnDeviceDefinition.DeviceDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the device definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinition.html#cfn-greengrass-devicedefinition-name
   */
  readonly name: string;

  /**
   * Application-specific metadata to attach to the device definition.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinition.html#cfn-greengrass-devicedefinition-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `DeviceProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceDefinitionDevicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("syncShadow", cdk.validateBoolean)(properties.syncShadow));
  errors.collect(cdk.propertyValidator("thingArn", cdk.requiredValidator)(properties.thingArn));
  errors.collect(cdk.propertyValidator("thingArn", cdk.validateString)(properties.thingArn));
  return errors.wrap("supplied properties not correct for \"DeviceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeviceDefinitionDevicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceDefinitionDevicePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "Id": cdk.stringToCloudFormation(properties.id),
    "SyncShadow": cdk.booleanToCloudFormation(properties.syncShadow),
    "ThingArn": cdk.stringToCloudFormation(properties.thingArn)
  };
}

// @ts-ignore TS6133
function CfnDeviceDefinitionDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceDefinition.DeviceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceDefinition.DeviceProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("syncShadow", "SyncShadow", (properties.SyncShadow != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SyncShadow) : undefined));
  ret.addPropertyResult("thingArn", "ThingArn", (properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeviceDefinitionVersionProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceDefinitionVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceDefinitionDeviceDefinitionVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("devices", cdk.requiredValidator)(properties.devices));
  errors.collect(cdk.propertyValidator("devices", cdk.listValidator(CfnDeviceDefinitionDevicePropertyValidator))(properties.devices));
  return errors.wrap("supplied properties not correct for \"DeviceDefinitionVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeviceDefinitionDeviceDefinitionVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceDefinitionDeviceDefinitionVersionPropertyValidator(properties).assertSuccess();
  return {
    "Devices": cdk.listMapper(convertCfnDeviceDefinitionDevicePropertyToCloudFormation)(properties.devices)
  };
}

// @ts-ignore TS6133
function CfnDeviceDefinitionDeviceDefinitionVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceDefinition.DeviceDefinitionVersionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceDefinition.DeviceDefinitionVersionProperty>();
  ret.addPropertyResult("devices", "Devices", (properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnDeviceDefinitionDevicePropertyFromCloudFormation)(properties.Devices) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeviceDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnDeviceDefinitionDeviceDefinitionVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeviceDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnDeviceDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceDefinitionPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnDeviceDefinitionDeviceDefinitionVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeviceDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceDefinitionProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnDeviceDefinitionDeviceDefinitionVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::DeviceDefinitionVersion` resource represents a device definition version for AWS IoT Greengrass .
 *
 * A device definition version contains a list of devices.
 *
 * > To create a device definition version, you must specify the ID of the device definition that you want to associate with the version. For information about creating a device definition, see [`AWS::Greengrass::DeviceDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinition.html) .
 * >
 * > After you create a device definition version that contains the devices you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::DeviceDefinitionVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinitionversion.html
 */
export class CfnDeviceDefinitionVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::DeviceDefinitionVersion";

  /**
   * Build a CfnDeviceDefinitionVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeviceDefinitionVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeviceDefinitionVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeviceDefinitionVersion(scope, id, propsResult.value);
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
   * The ID of the device definition associated with this version.
   */
  public deviceDefinitionId: string;

  /**
   * The devices in this version.
   */
  public devices: Array<CfnDeviceDefinitionVersion.DeviceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeviceDefinitionVersionProps) {
    super(scope, id, {
      "type": CfnDeviceDefinitionVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "deviceDefinitionId", this);
    cdk.requireProperty(props, "devices", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.deviceDefinitionId = props.deviceDefinitionId;
    this.devices = props.devices;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deviceDefinitionId": this.deviceDefinitionId,
      "devices": this.devices
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeviceDefinitionVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeviceDefinitionVersionPropsToCloudFormation(props);
  }
}

export namespace CfnDeviceDefinitionVersion {
  /**
   * A device is an AWS IoT device (thing) that's added to a Greengrass group.
   *
   * Greengrass devices can communicate with the Greengrass core in the same group. For more information, see [What Is AWS IoT Greengrass ?](https://docs.aws.amazon.com/greengrass/v1/developerguide/what-is-gg.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Devices` property of the [`AWS::Greengrass::DeviceDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinitionversion.html) resource contains a list of `Device` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinitionversion-device.html
   */
  export interface DeviceProperty {
    /**
     * The ARN of the device certificate for the device.
     *
     * This X.509 certificate is used to authenticate the device with AWS IoT and AWS IoT Greengrass services.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinitionversion-device.html#cfn-greengrass-devicedefinitionversion-device-certificatearn
     */
    readonly certificateArn: string;

    /**
     * A descriptive or arbitrary ID for the device.
     *
     * This value must be unique within the device definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinitionversion-device.html#cfn-greengrass-devicedefinitionversion-device-id
     */
    readonly id: string;

    /**
     * Indicates whether the device's local shadow is synced with the cloud automatically.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinitionversion-device.html#cfn-greengrass-devicedefinitionversion-device-syncshadow
     */
    readonly syncShadow?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the device, which is an AWS IoT device (thing).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-devicedefinitionversion-device.html#cfn-greengrass-devicedefinitionversion-device-thingarn
     */
    readonly thingArn: string;
  }
}

/**
 * Properties for defining a `CfnDeviceDefinitionVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinitionversion.html
 */
export interface CfnDeviceDefinitionVersionProps {
  /**
   * The ID of the device definition associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinitionversion.html#cfn-greengrass-devicedefinitionversion-devicedefinitionid
   */
  readonly deviceDefinitionId: string;

  /**
   * The devices in this version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-devicedefinitionversion.html#cfn-greengrass-devicedefinitionversion-devices
   */
  readonly devices: Array<CfnDeviceDefinitionVersion.DeviceProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `DeviceProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceDefinitionVersionDevicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("syncShadow", cdk.validateBoolean)(properties.syncShadow));
  errors.collect(cdk.propertyValidator("thingArn", cdk.requiredValidator)(properties.thingArn));
  errors.collect(cdk.propertyValidator("thingArn", cdk.validateString)(properties.thingArn));
  return errors.wrap("supplied properties not correct for \"DeviceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeviceDefinitionVersionDevicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceDefinitionVersionDevicePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "Id": cdk.stringToCloudFormation(properties.id),
    "SyncShadow": cdk.booleanToCloudFormation(properties.syncShadow),
    "ThingArn": cdk.stringToCloudFormation(properties.thingArn)
  };
}

// @ts-ignore TS6133
function CfnDeviceDefinitionVersionDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceDefinitionVersion.DeviceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceDefinitionVersion.DeviceProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("syncShadow", "SyncShadow", (properties.SyncShadow != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SyncShadow) : undefined));
  ret.addPropertyResult("thingArn", "ThingArn", (properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeviceDefinitionVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceDefinitionVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceDefinitionVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceDefinitionId", cdk.requiredValidator)(properties.deviceDefinitionId));
  errors.collect(cdk.propertyValidator("deviceDefinitionId", cdk.validateString)(properties.deviceDefinitionId));
  errors.collect(cdk.propertyValidator("devices", cdk.requiredValidator)(properties.devices));
  errors.collect(cdk.propertyValidator("devices", cdk.listValidator(CfnDeviceDefinitionVersionDevicePropertyValidator))(properties.devices));
  return errors.wrap("supplied properties not correct for \"CfnDeviceDefinitionVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnDeviceDefinitionVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceDefinitionVersionPropsValidator(properties).assertSuccess();
  return {
    "DeviceDefinitionId": cdk.stringToCloudFormation(properties.deviceDefinitionId),
    "Devices": cdk.listMapper(convertCfnDeviceDefinitionVersionDevicePropertyToCloudFormation)(properties.devices)
  };
}

// @ts-ignore TS6133
function CfnDeviceDefinitionVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceDefinitionVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceDefinitionVersionProps>();
  ret.addPropertyResult("deviceDefinitionId", "DeviceDefinitionId", (properties.DeviceDefinitionId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceDefinitionId) : undefined));
  ret.addPropertyResult("devices", "Devices", (properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnDeviceDefinitionVersionDevicePropertyFromCloudFormation)(properties.Devices) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::FunctionDefinition` resource represents a function definition for AWS IoT Greengrass .
 *
 * Function definitions are used to organize your function definition versions.
 *
 * Function definitions can reference multiple function definition versions. All function definition versions must be associated with a function definition. Each function definition version can contain one or more functions.
 *
 * > When you create a function definition, you can optionally include an initial function definition version. To associate a function definition version later, create an [`AWS::Greengrass::FunctionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html) resource and specify the ID of this function definition.
 * >
 * > After you create the function definition version that contains the functions you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::FunctionDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinition.html
 */
export class CfnFunctionDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::FunctionDefinition";

  /**
   * Build a CfnFunctionDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunctionDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFunctionDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFunctionDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `FunctionDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/functions/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `FunctionDefinition` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `FunctionDefinitionVersion` that was added to the `FunctionDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/functions/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the `FunctionDefinition` , such as `MyFunctionDefinition` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The function definition version to include when the function definition is created.
   */
  public initialVersion?: CfnFunctionDefinition.FunctionDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the function definition.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the function definition.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFunctionDefinitionProps) {
    super(scope, id, {
      "type": CfnFunctionDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::FunctionDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunctionDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFunctionDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnFunctionDefinition {
  /**
   * A function definition version contains a list of functions.
   *
   * > After you create a function definition version that contains the functions you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
   *
   * In an AWS CloudFormation template, `FunctionDefinitionVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::FunctionDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinition.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functiondefinitionversion.html
   */
  export interface FunctionDefinitionVersionProperty {
    /**
     * The default configuration that applies to all Lambda functions in the group.
     *
     * Individual Lambda functions can override these settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functiondefinitionversion.html#cfn-greengrass-functiondefinition-functiondefinitionversion-defaultconfig
     */
    readonly defaultConfig?: CfnFunctionDefinition.DefaultConfigProperty | cdk.IResolvable;

    /**
     * The functions in this version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functiondefinitionversion.html#cfn-greengrass-functiondefinition-functiondefinitionversion-functions
     */
    readonly functions: Array<CfnFunctionDefinition.FunctionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The default configuration that applies to all Lambda functions in the function definition version.
   *
   * Individual Lambda functions can override these settings.
   *
   * In an AWS CloudFormation template, `DefaultConfig` is a property of the [`FunctionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functiondefinitionversion.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-defaultconfig.html
   */
  export interface DefaultConfigProperty {
    /**
     * Configuration settings for the Lambda execution environment on the AWS IoT Greengrass core.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-defaultconfig.html#cfn-greengrass-functiondefinition-defaultconfig-execution
     */
    readonly execution: CfnFunctionDefinition.ExecutionProperty | cdk.IResolvable;
  }

  /**
   * Configuration settings for the Lambda execution environment on the AWS IoT Greengrass core.
   *
   * In an AWS CloudFormation template, `Execution` is a property of the [`DefaultConfig`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-defaultconfig.html) property type for a function definition version and the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-environment.html) property type for a function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-execution.html
   */
  export interface ExecutionProperty {
    /**
     * The containerization that the Lambda function runs in.
     *
     * Valid values are `GreengrassContainer` or `NoContainer` . Typically, this is `GreengrassContainer` . For more information, see [Containerization](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-function-containerization) in the *Developer Guide* .
     *
     * - When set on the [`DefaultConfig`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-defaultconfig.html) property of a function definition version, this setting is used as the default containerization for all Lambda functions in the function definition version.
     * - When set on the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html) property of a function, this setting applies to the individual function and overrides the default. Omit this value to run the function with the default containerization.
     *
     * > We recommend that you run in a Greengrass container unless your business case requires that you run without containerization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-execution.html#cfn-greengrass-functiondefinition-execution-isolationmode
     */
    readonly isolationMode?: string;

    /**
     * The user and group permissions used to run the Lambda function.
     *
     * Typically, this is the ggc_user and ggc_group. For more information, see [Run as](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-access-identity.html) in the *Developer Guide* .
     *
     * - When set on the [`DefaultConfig`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-defaultconfig.html) property of a function definition version, this setting is used as the default access identity for all Lambda functions in the function definition version.
     * - When set on the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html) property of a function, this setting applies to the individual function and overrides the default. You can override the user, group, or both. Omit this value to run the function with the default permissions.
     *
     * > Running as the root user increases risks to your data and device. Do not run as root (UID/GID=0) unless your business case requires it. For more information and requirements, see [Running a Lambda Function as Root](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-running-as-root) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-execution.html#cfn-greengrass-functiondefinition-execution-runas
     */
    readonly runAs?: cdk.IResolvable | CfnFunctionDefinition.RunAsProperty;
  }

  /**
   * The access identity whose permissions are used to run the Lambda function.
   *
   * This setting overrides the default access identity that's specified for the group (by default, ggc_user and ggc_group). You can override the user, group, or both. For more information, see [Run as](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-access-identity.html) in the *Developer Guide* .
   *
   * > Running as the root user increases risks to your data and device. Do not run as root (UID/GID=0) unless your business case requires it. For more information and requirements, see [Running a Lambda Function as Root](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-running-as-root) .
   *
   * In an AWS CloudFormation template, `RunAs` is a property of the [`Execution`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-execution.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-runas.html
   */
  export interface RunAsProperty {
    /**
     * The group ID whose permissions are used to run the Lambda function.
     *
     * You can use the `getent group` command on your core device to look up the group ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-runas.html#cfn-greengrass-functiondefinition-runas-gid
     */
    readonly gid?: number;

    /**
     * The user ID whose permissions are used to run the Lambda function.
     *
     * You can use the `getent passwd` command on your core device to look up the user ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-runas.html#cfn-greengrass-functiondefinition-runas-uid
     */
    readonly uid?: number;
  }

  /**
   * A function is a Lambda function that's referenced from an AWS IoT Greengrass group.
   *
   * The function is deployed to a Greengrass core where it runs locally. For more information, see [Run Lambda Functions on the AWS IoT Greengrass Core](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-functions.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Functions` property of the [`FunctionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functiondefinitionversion.html) property type contains a list of `Function` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-function.html
   */
  export interface FunctionProperty {
    /**
     * The Amazon Resource Name (ARN) of the alias (recommended) or version of the referenced Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-function.html#cfn-greengrass-functiondefinition-function-functionarn
     */
    readonly functionArn: string;

    /**
     * The group-specific settings of the Lambda function.
     *
     * These settings configure the function's behavior in the Greengrass group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-function.html#cfn-greengrass-functiondefinition-function-functionconfiguration
     */
    readonly functionConfiguration: CfnFunctionDefinition.FunctionConfigurationProperty | cdk.IResolvable;

    /**
     * A descriptive or arbitrary ID for the function.
     *
     * This value must be unique within the function definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-function.html#cfn-greengrass-functiondefinition-function-id
     */
    readonly id: string;
  }

  /**
   * The group-specific configuration settings for a Lambda function.
   *
   * These settings configure the function's behavior in the Greengrass group. For more information, see [Controlling Execution of Greengrass Lambda Functions by Using Group-Specific Configuration](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `FunctionConfiguration` is a property of the [`Function`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-function.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html
   */
  export interface FunctionConfigurationProperty {
    /**
     * The expected encoding type of the input payload for the function.
     *
     * Valid values are `json` (default) and `binary` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html#cfn-greengrass-functiondefinition-functionconfiguration-encodingtype
     */
    readonly encodingType?: string;

    /**
     * The environment configuration of the function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html#cfn-greengrass-functiondefinition-functionconfiguration-environment
     */
    readonly environment?: CfnFunctionDefinition.EnvironmentProperty | cdk.IResolvable;

    /**
     * The execution arguments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html#cfn-greengrass-functiondefinition-functionconfiguration-execargs
     */
    readonly execArgs?: string;

    /**
     * The name of the function executable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html#cfn-greengrass-functiondefinition-functionconfiguration-executable
     */
    readonly executable?: string;

    /**
     * The memory size (in KB) required by the function.
     *
     * > This property applies only to Lambda functions that run in a Greengrass container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html#cfn-greengrass-functiondefinition-functionconfiguration-memorysize
     */
    readonly memorySize?: number;

    /**
     * Indicates whether the function is pinned (or *long-lived* ).
     *
     * Pinned functions start when the core starts and process all requests in the same container. The default value is false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html#cfn-greengrass-functiondefinition-functionconfiguration-pinned
     */
    readonly pinned?: boolean | cdk.IResolvable;

    /**
     * The allowed execution time (in seconds) after which the function should terminate.
     *
     * For pinned functions, this timeout applies for each request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html#cfn-greengrass-functiondefinition-functionconfiguration-timeout
     */
    readonly timeout?: number;
  }

  /**
   * The environment configuration for a Lambda function on the AWS IoT Greengrass core.
   *
   * In an AWS CloudFormation template, `Environment` is a property of the [`FunctionConfiguration`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-functionconfiguration.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-environment.html
   */
  export interface EnvironmentProperty {
    /**
     * Indicates whether the function is allowed to access the `/sys` directory on the core device, which allows the read device information from `/sys` .
     *
     * > This property applies only to Lambda functions that run in a Greengrass container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-environment.html#cfn-greengrass-functiondefinition-environment-accesssysfs
     */
    readonly accessSysfs?: boolean | cdk.IResolvable;

    /**
     * Settings for the Lambda execution environment in AWS IoT Greengrass .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-environment.html#cfn-greengrass-functiondefinition-environment-execution
     */
    readonly execution?: CfnFunctionDefinition.ExecutionProperty | cdk.IResolvable;

    /**
     * A list of the [resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html) in the group that the function can access, with the corresponding read-only or read-write permissions. The maximum is 10 resources.
     *
     * > This property applies only for Lambda functions that run in a Greengrass container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-environment.html#cfn-greengrass-functiondefinition-environment-resourceaccesspolicies
     */
    readonly resourceAccessPolicies?: Array<cdk.IResolvable | CfnFunctionDefinition.ResourceAccessPolicyProperty> | cdk.IResolvable;

    /**
     * Environment variables for the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-environment.html#cfn-greengrass-functiondefinition-environment-variables
     */
    readonly variables?: any | cdk.IResolvable;
  }

  /**
   * A list of the [resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html) in the group that the function can access, with the corresponding read-only or read-write permissions. The maximum is 10 resources.
   *
   * > This property applies only to Lambda functions that run in a Greengrass container.
   *
   * In an AWS CloudFormation template, `ResourceAccessPolicy` is a property of the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-environment.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-resourceaccesspolicy.html
   */
  export interface ResourceAccessPolicyProperty {
    /**
     * The read-only or read-write access that the Lambda function has to the resource.
     *
     * Valid values are `ro` or `rw` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-resourceaccesspolicy.html#cfn-greengrass-functiondefinition-resourceaccesspolicy-permission
     */
    readonly permission?: string;

    /**
     * The ID of the resource.
     *
     * This ID is assigned to the resource when you create the resource definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-resourceaccesspolicy.html#cfn-greengrass-functiondefinition-resourceaccesspolicy-resourceid
     */
    readonly resourceId: string;
  }
}

/**
 * Properties for defining a `CfnFunctionDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinition.html
 */
export interface CfnFunctionDefinitionProps {
  /**
   * The function definition version to include when the function definition is created.
   *
   * A function definition version contains a list of [`function`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinition-function.html) property types.
   *
   * > To associate a function definition version after the function definition is created, create an [`AWS::Greengrass::FunctionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html) resource and specify the ID of this function definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinition.html#cfn-greengrass-functiondefinition-initialversion
   */
  readonly initialVersion?: CfnFunctionDefinition.FunctionDefinitionVersionProperty | cdk.IResolvable;

  /**
   * The name of the function definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinition.html#cfn-greengrass-functiondefinition-name
   */
  readonly name: string;

  /**
   * Application-specific metadata to attach to the function definition.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinition.html#cfn-greengrass-functiondefinition-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `RunAsProperty`
 *
 * @param properties - the TypeScript properties of a `RunAsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionRunAsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gid", cdk.validateNumber)(properties.gid));
  errors.collect(cdk.propertyValidator("uid", cdk.validateNumber)(properties.uid));
  return errors.wrap("supplied properties not correct for \"RunAsProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionRunAsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionRunAsPropertyValidator(properties).assertSuccess();
  return {
    "Gid": cdk.numberToCloudFormation(properties.gid),
    "Uid": cdk.numberToCloudFormation(properties.uid)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionRunAsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunctionDefinition.RunAsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.RunAsProperty>();
  ret.addPropertyResult("gid", "Gid", (properties.Gid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Gid) : undefined));
  ret.addPropertyResult("uid", "Uid", (properties.Uid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Uid) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExecutionProperty`
 *
 * @param properties - the TypeScript properties of a `ExecutionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionExecutionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isolationMode", cdk.validateString)(properties.isolationMode));
  errors.collect(cdk.propertyValidator("runAs", CfnFunctionDefinitionRunAsPropertyValidator)(properties.runAs));
  return errors.wrap("supplied properties not correct for \"ExecutionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionExecutionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionExecutionPropertyValidator(properties).assertSuccess();
  return {
    "IsolationMode": cdk.stringToCloudFormation(properties.isolationMode),
    "RunAs": convertCfnFunctionDefinitionRunAsPropertyToCloudFormation(properties.runAs)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionExecutionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinition.ExecutionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.ExecutionProperty>();
  ret.addPropertyResult("isolationMode", "IsolationMode", (properties.IsolationMode != null ? cfn_parse.FromCloudFormation.getString(properties.IsolationMode) : undefined));
  ret.addPropertyResult("runAs", "RunAs", (properties.RunAs != null ? CfnFunctionDefinitionRunAsPropertyFromCloudFormation(properties.RunAs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionDefaultConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("execution", cdk.requiredValidator)(properties.execution));
  errors.collect(cdk.propertyValidator("execution", CfnFunctionDefinitionExecutionPropertyValidator)(properties.execution));
  return errors.wrap("supplied properties not correct for \"DefaultConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionDefaultConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionDefaultConfigPropertyValidator(properties).assertSuccess();
  return {
    "Execution": convertCfnFunctionDefinitionExecutionPropertyToCloudFormation(properties.execution)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionDefaultConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinition.DefaultConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.DefaultConfigProperty>();
  ret.addPropertyResult("execution", "Execution", (properties.Execution != null ? CfnFunctionDefinitionExecutionPropertyFromCloudFormation(properties.Execution) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceAccessPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceAccessPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionResourceAccessPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("permission", cdk.validateString)(properties.permission));
  errors.collect(cdk.propertyValidator("resourceId", cdk.requiredValidator)(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  return errors.wrap("supplied properties not correct for \"ResourceAccessPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionResourceAccessPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionResourceAccessPolicyPropertyValidator(properties).assertSuccess();
  return {
    "Permission": cdk.stringToCloudFormation(properties.permission),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionResourceAccessPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunctionDefinition.ResourceAccessPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.ResourceAccessPolicyProperty>();
  ret.addPropertyResult("permission", "Permission", (properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionEnvironmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessSysfs", cdk.validateBoolean)(properties.accessSysfs));
  errors.collect(cdk.propertyValidator("execution", CfnFunctionDefinitionExecutionPropertyValidator)(properties.execution));
  errors.collect(cdk.propertyValidator("resourceAccessPolicies", cdk.listValidator(CfnFunctionDefinitionResourceAccessPolicyPropertyValidator))(properties.resourceAccessPolicies));
  errors.collect(cdk.propertyValidator("variables", cdk.validateObject)(properties.variables));
  return errors.wrap("supplied properties not correct for \"EnvironmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionEnvironmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionEnvironmentPropertyValidator(properties).assertSuccess();
  return {
    "AccessSysfs": cdk.booleanToCloudFormation(properties.accessSysfs),
    "Execution": convertCfnFunctionDefinitionExecutionPropertyToCloudFormation(properties.execution),
    "ResourceAccessPolicies": cdk.listMapper(convertCfnFunctionDefinitionResourceAccessPolicyPropertyToCloudFormation)(properties.resourceAccessPolicies),
    "Variables": cdk.objectToCloudFormation(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionEnvironmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinition.EnvironmentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.EnvironmentProperty>();
  ret.addPropertyResult("accessSysfs", "AccessSysfs", (properties.AccessSysfs != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AccessSysfs) : undefined));
  ret.addPropertyResult("execution", "Execution", (properties.Execution != null ? CfnFunctionDefinitionExecutionPropertyFromCloudFormation(properties.Execution) : undefined));
  ret.addPropertyResult("resourceAccessPolicies", "ResourceAccessPolicies", (properties.ResourceAccessPolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionDefinitionResourceAccessPolicyPropertyFromCloudFormation)(properties.ResourceAccessPolicies) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getAny(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionFunctionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encodingType", cdk.validateString)(properties.encodingType));
  errors.collect(cdk.propertyValidator("environment", CfnFunctionDefinitionEnvironmentPropertyValidator)(properties.environment));
  errors.collect(cdk.propertyValidator("execArgs", cdk.validateString)(properties.execArgs));
  errors.collect(cdk.propertyValidator("executable", cdk.validateString)(properties.executable));
  errors.collect(cdk.propertyValidator("memorySize", cdk.validateNumber)(properties.memorySize));
  errors.collect(cdk.propertyValidator("pinned", cdk.validateBoolean)(properties.pinned));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"FunctionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionFunctionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionFunctionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EncodingType": cdk.stringToCloudFormation(properties.encodingType),
    "Environment": convertCfnFunctionDefinitionEnvironmentPropertyToCloudFormation(properties.environment),
    "ExecArgs": cdk.stringToCloudFormation(properties.execArgs),
    "Executable": cdk.stringToCloudFormation(properties.executable),
    "MemorySize": cdk.numberToCloudFormation(properties.memorySize),
    "Pinned": cdk.booleanToCloudFormation(properties.pinned),
    "Timeout": cdk.numberToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionFunctionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinition.FunctionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.FunctionConfigurationProperty>();
  ret.addPropertyResult("encodingType", "EncodingType", (properties.EncodingType != null ? cfn_parse.FromCloudFormation.getString(properties.EncodingType) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? CfnFunctionDefinitionEnvironmentPropertyFromCloudFormation(properties.Environment) : undefined));
  ret.addPropertyResult("execArgs", "ExecArgs", (properties.ExecArgs != null ? cfn_parse.FromCloudFormation.getString(properties.ExecArgs) : undefined));
  ret.addPropertyResult("executable", "Executable", (properties.Executable != null ? cfn_parse.FromCloudFormation.getString(properties.Executable) : undefined));
  ret.addPropertyResult("memorySize", "MemorySize", (properties.MemorySize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemorySize) : undefined));
  ret.addPropertyResult("pinned", "Pinned", (properties.Pinned != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Pinned) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionFunctionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.requiredValidator)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionConfiguration", cdk.requiredValidator)(properties.functionConfiguration));
  errors.collect(cdk.propertyValidator("functionConfiguration", CfnFunctionDefinitionFunctionConfigurationPropertyValidator)(properties.functionConfiguration));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  return errors.wrap("supplied properties not correct for \"FunctionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionFunctionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionFunctionPropertyValidator(properties).assertSuccess();
  return {
    "FunctionArn": cdk.stringToCloudFormation(properties.functionArn),
    "FunctionConfiguration": convertCfnFunctionDefinitionFunctionConfigurationPropertyToCloudFormation(properties.functionConfiguration),
    "Id": cdk.stringToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionFunctionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinition.FunctionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.FunctionProperty>();
  ret.addPropertyResult("functionArn", "FunctionArn", (properties.FunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionArn) : undefined));
  ret.addPropertyResult("functionConfiguration", "FunctionConfiguration", (properties.FunctionConfiguration != null ? CfnFunctionDefinitionFunctionConfigurationPropertyFromCloudFormation(properties.FunctionConfiguration) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionDefinitionVersionProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionDefinitionVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionFunctionDefinitionVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultConfig", CfnFunctionDefinitionDefaultConfigPropertyValidator)(properties.defaultConfig));
  errors.collect(cdk.propertyValidator("functions", cdk.requiredValidator)(properties.functions));
  errors.collect(cdk.propertyValidator("functions", cdk.listValidator(CfnFunctionDefinitionFunctionPropertyValidator))(properties.functions));
  return errors.wrap("supplied properties not correct for \"FunctionDefinitionVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionFunctionDefinitionVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionFunctionDefinitionVersionPropertyValidator(properties).assertSuccess();
  return {
    "DefaultConfig": convertCfnFunctionDefinitionDefaultConfigPropertyToCloudFormation(properties.defaultConfig),
    "Functions": cdk.listMapper(convertCfnFunctionDefinitionFunctionPropertyToCloudFormation)(properties.functions)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionFunctionDefinitionVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinition.FunctionDefinitionVersionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinition.FunctionDefinitionVersionProperty>();
  ret.addPropertyResult("defaultConfig", "DefaultConfig", (properties.DefaultConfig != null ? CfnFunctionDefinitionDefaultConfigPropertyFromCloudFormation(properties.DefaultConfig) : undefined));
  ret.addPropertyResult("functions", "Functions", (properties.Functions != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionDefinitionFunctionPropertyFromCloudFormation)(properties.Functions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnFunctionDefinitionFunctionDefinitionVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFunctionDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnFunctionDefinitionFunctionDefinitionVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnFunctionDefinitionFunctionDefinitionVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::FunctionDefinitionVersion` resource represents a function definition version for AWS IoT Greengrass .
 *
 * A function definition version contains contain a list of functions.
 *
 * > To create a function definition version, you must specify the ID of the function definition that you want to associate with the version. For information about creating a function definition, see [`AWS::Greengrass::FunctionDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinition.html) .
 * >
 * > After you create a function definition version that contains the functions you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::FunctionDefinitionVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html
 */
export class CfnFunctionDefinitionVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::FunctionDefinitionVersion";

  /**
   * Build a CfnFunctionDefinitionVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunctionDefinitionVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFunctionDefinitionVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFunctionDefinitionVersion(scope, id, propsResult.value);
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
   * The default configuration that applies to all Lambda functions in the group.
   */
  public defaultConfig?: CfnFunctionDefinitionVersion.DefaultConfigProperty | cdk.IResolvable;

  /**
   * The ID of the function definition associated with this version.
   */
  public functionDefinitionId: string;

  /**
   * The functions in this version.
   */
  public functions: Array<CfnFunctionDefinitionVersion.FunctionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFunctionDefinitionVersionProps) {
    super(scope, id, {
      "type": CfnFunctionDefinitionVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "functionDefinitionId", this);
    cdk.requireProperty(props, "functions", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.defaultConfig = props.defaultConfig;
    this.functionDefinitionId = props.functionDefinitionId;
    this.functions = props.functions;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultConfig": this.defaultConfig,
      "functionDefinitionId": this.functionDefinitionId,
      "functions": this.functions
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunctionDefinitionVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFunctionDefinitionVersionPropsToCloudFormation(props);
  }
}

export namespace CfnFunctionDefinitionVersion {
  /**
   * The default configuration that applies to all Lambda functions in the function definition version.
   *
   * Individual Lambda functions can override these settings.
   *
   * In an AWS CloudFormation template, `DefaultConfig` is a property of the [`AWS::Greengrass::FunctionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-defaultconfig.html
   */
  export interface DefaultConfigProperty {
    /**
     * Configuration settings for the Lambda execution environment on the AWS IoT Greengrass core.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-defaultconfig.html#cfn-greengrass-functiondefinitionversion-defaultconfig-execution
     */
    readonly execution: CfnFunctionDefinitionVersion.ExecutionProperty | cdk.IResolvable;
  }

  /**
   * Configuration settings for the Lambda execution environment on the AWS IoT Greengrass core.
   *
   * In an AWS CloudFormation template, `Execution` is a property of the [`DefaultConfig`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-defaultconfig.html) property type for a function definition version and the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html) property type for a function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-execution.html
   */
  export interface ExecutionProperty {
    /**
     * The containerization that the Lambda function runs in.
     *
     * Valid values are `GreengrassContainer` or `NoContainer` . Typically, this is `GreengrassContainer` . For more information, see [Containerization](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-function-containerization) in the *Developer Guide* .
     *
     * - When set on the [`DefaultConfig`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-defaultconfig.html) property of a function definition version, this setting is used as the default containerization for all Lambda functions in the function definition version.
     * - When set on the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html) property of a function, this setting applies to the individual function and overrides the default. Omit this value to run the function with the default containerization.
     *
     * > We recommend that you run in a Greengrass container unless your business case requires that you run without containerization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-execution.html#cfn-greengrass-functiondefinitionversion-execution-isolationmode
     */
    readonly isolationMode?: string;

    /**
     * The user and group permissions used to run the Lambda function.
     *
     * Typically, this is the ggc_user and ggc_group. For more information, see [Run as](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-access-identity.html) in the *Developer Guide* .
     *
     * - When set on the [`DefaultConfig`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-defaultconfig.html) property of a function definition version, this setting is used as the default access identity for all Lambda functions in the function definition version.
     * - When set on the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html) property of a function, this setting applies to the individual function and overrides the default. You can override the user, group, or both. Omit this value to run the function with the default permissions.
     *
     * > Running as the root user increases risks to your data and device. Do not run as root (UID/GID=0) unless your business case requires it. For more information and requirements, see [Running a Lambda Function as Root](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-running-as-root) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-execution.html#cfn-greengrass-functiondefinitionversion-execution-runas
     */
    readonly runAs?: cdk.IResolvable | CfnFunctionDefinitionVersion.RunAsProperty;
  }

  /**
   * The user and group permissions used to run the Lambda function.
   *
   * This setting overrides the default access identity that's specified for the group (by default, ggc_user and ggc_group). You can override the user, group, or both. For more information, see [Run as](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-access-identity.html) in the *Developer Guide* .
   *
   * > Running as the root user increases risks to your data and device. Do not run as root (UID/GID=0) unless your business case requires it. For more information and requirements, see [Running a Lambda Function as Root](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html#lambda-running-as-root) .
   *
   * In an AWS CloudFormation template, `RunAs` is a property of the [`Execution`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-execution.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-runas.html
   */
  export interface RunAsProperty {
    /**
     * The group ID whose permissions are used to run the Lambda function.
     *
     * You can use the `getent group` command on your core device to look up the group ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-runas.html#cfn-greengrass-functiondefinitionversion-runas-gid
     */
    readonly gid?: number;

    /**
     * The user ID whose permissions are used to run the Lambda function.
     *
     * You can use the `getent passwd` command on your core device to look up the user ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-runas.html#cfn-greengrass-functiondefinitionversion-runas-uid
     */
    readonly uid?: number;
  }

  /**
   * A function is a Lambda function that's referenced from an AWS IoT Greengrass group.
   *
   * The function is deployed to a Greengrass core where it runs locally. For more information, see [Run Lambda Functions on the AWS IoT Greengrass Core](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-functions.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Functions` property of the [`AWS::Greengrass::FunctionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html) resource contains a list of `Function` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-function.html
   */
  export interface FunctionProperty {
    /**
     * The Amazon Resource Name (ARN) of the alias (recommended) or version of the referenced Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-function.html#cfn-greengrass-functiondefinitionversion-function-functionarn
     */
    readonly functionArn: string;

    /**
     * The group-specific settings of the Lambda function.
     *
     * These settings configure the function's behavior in the Greengrass group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-function.html#cfn-greengrass-functiondefinitionversion-function-functionconfiguration
     */
    readonly functionConfiguration: CfnFunctionDefinitionVersion.FunctionConfigurationProperty | cdk.IResolvable;

    /**
     * A descriptive or arbitrary ID for the function.
     *
     * This value must be unique within the function definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-function.html#cfn-greengrass-functiondefinitionversion-function-id
     */
    readonly id: string;
  }

  /**
   * The group-specific configuration settings for a Lambda function.
   *
   * These settings configure the function's behavior in the Greengrass group. For more information, see [Controlling Execution of Greengrass Lambda Functions by Using Group-Specific Configuration](https://docs.aws.amazon.com/greengrass/v1/developerguide/lambda-group-config.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `FunctionConfiguration` is a property of the [`Function`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-function.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html
   */
  export interface FunctionConfigurationProperty {
    /**
     * The expected encoding type of the input payload for the function.
     *
     * Valid values are `json` (default) and `binary` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html#cfn-greengrass-functiondefinitionversion-functionconfiguration-encodingtype
     */
    readonly encodingType?: string;

    /**
     * The environment configuration of the function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html#cfn-greengrass-functiondefinitionversion-functionconfiguration-environment
     */
    readonly environment?: CfnFunctionDefinitionVersion.EnvironmentProperty | cdk.IResolvable;

    /**
     * The execution arguments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html#cfn-greengrass-functiondefinitionversion-functionconfiguration-execargs
     */
    readonly execArgs?: string;

    /**
     * The name of the function executable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html#cfn-greengrass-functiondefinitionversion-functionconfiguration-executable
     */
    readonly executable?: string;

    /**
     * The memory size (in KB) required by the function.
     *
     * > This property applies only to Lambda functions that run in a Greengrass container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html#cfn-greengrass-functiondefinitionversion-functionconfiguration-memorysize
     */
    readonly memorySize?: number;

    /**
     * Indicates whether the function is pinned (or *long-lived* ).
     *
     * Pinned functions start when the core starts and process all requests in the same container. The default value is false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html#cfn-greengrass-functiondefinitionversion-functionconfiguration-pinned
     */
    readonly pinned?: boolean | cdk.IResolvable;

    /**
     * The allowed execution time (in seconds) after which the function should terminate.
     *
     * For pinned functions, this timeout applies for each request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html#cfn-greengrass-functiondefinitionversion-functionconfiguration-timeout
     */
    readonly timeout?: number;
  }

  /**
   * The environment configuration for a Lambda function on the AWS IoT Greengrass core.
   *
   * In an AWS CloudFormation template, `Environment` is a property of the [`FunctionConfiguration`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-functionconfiguration.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html
   */
  export interface EnvironmentProperty {
    /**
     * Indicates whether the function is allowed to access the `/sys` directory on the core device, which allows the read device information from `/sys` .
     *
     * > This property applies only to Lambda functions that run in a Greengrass container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html#cfn-greengrass-functiondefinitionversion-environment-accesssysfs
     */
    readonly accessSysfs?: boolean | cdk.IResolvable;

    /**
     * Settings for the Lambda execution environment in AWS IoT Greengrass .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html#cfn-greengrass-functiondefinitionversion-environment-execution
     */
    readonly execution?: CfnFunctionDefinitionVersion.ExecutionProperty | cdk.IResolvable;

    /**
     * A list of the [resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html) in the group that the function can access, with the corresponding read-only or read-write permissions. The maximum is 10 resources.
     *
     * > This property applies only to Lambda functions that run in a Greengrass container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html#cfn-greengrass-functiondefinitionversion-environment-resourceaccesspolicies
     */
    readonly resourceAccessPolicies?: Array<cdk.IResolvable | CfnFunctionDefinitionVersion.ResourceAccessPolicyProperty> | cdk.IResolvable;

    /**
     * Environment variables for the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html#cfn-greengrass-functiondefinitionversion-environment-variables
     */
    readonly variables?: any | cdk.IResolvable;
  }

  /**
   * A list of the [resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html) in the group that the function can access, with the corresponding read-only or read-write permissions. The maximum is 10 resources.
   *
   * > This property applies only to Lambda functions that run in a Greengrass container.
   *
   * In an AWS CloudFormation template, `ResourceAccessPolicy` is a property of the [`Environment`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-environment.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-resourceaccesspolicy.html
   */
  export interface ResourceAccessPolicyProperty {
    /**
     * The read-only or read-write access that the Lambda function has to the resource.
     *
     * Valid values are `ro` or `rw` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-resourceaccesspolicy.html#cfn-greengrass-functiondefinitionversion-resourceaccesspolicy-permission
     */
    readonly permission?: string;

    /**
     * The ID of the resource.
     *
     * This ID is assigned to the resource when you create the resource definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-functiondefinitionversion-resourceaccesspolicy.html#cfn-greengrass-functiondefinitionversion-resourceaccesspolicy-resourceid
     */
    readonly resourceId: string;
  }
}

/**
 * Properties for defining a `CfnFunctionDefinitionVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html
 */
export interface CfnFunctionDefinitionVersionProps {
  /**
   * The default configuration that applies to all Lambda functions in the group.
   *
   * Individual Lambda functions can override these settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html#cfn-greengrass-functiondefinitionversion-defaultconfig
   */
  readonly defaultConfig?: CfnFunctionDefinitionVersion.DefaultConfigProperty | cdk.IResolvable;

  /**
   * The ID of the function definition associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html#cfn-greengrass-functiondefinitionversion-functiondefinitionid
   */
  readonly functionDefinitionId: string;

  /**
   * The functions in this version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-functiondefinitionversion.html#cfn-greengrass-functiondefinitionversion-functions
   */
  readonly functions: Array<CfnFunctionDefinitionVersion.FunctionProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `RunAsProperty`
 *
 * @param properties - the TypeScript properties of a `RunAsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionRunAsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gid", cdk.validateNumber)(properties.gid));
  errors.collect(cdk.propertyValidator("uid", cdk.validateNumber)(properties.uid));
  return errors.wrap("supplied properties not correct for \"RunAsProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionRunAsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionRunAsPropertyValidator(properties).assertSuccess();
  return {
    "Gid": cdk.numberToCloudFormation(properties.gid),
    "Uid": cdk.numberToCloudFormation(properties.uid)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionRunAsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunctionDefinitionVersion.RunAsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersion.RunAsProperty>();
  ret.addPropertyResult("gid", "Gid", (properties.Gid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Gid) : undefined));
  ret.addPropertyResult("uid", "Uid", (properties.Uid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Uid) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExecutionProperty`
 *
 * @param properties - the TypeScript properties of a `ExecutionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionExecutionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isolationMode", cdk.validateString)(properties.isolationMode));
  errors.collect(cdk.propertyValidator("runAs", CfnFunctionDefinitionVersionRunAsPropertyValidator)(properties.runAs));
  return errors.wrap("supplied properties not correct for \"ExecutionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionExecutionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionExecutionPropertyValidator(properties).assertSuccess();
  return {
    "IsolationMode": cdk.stringToCloudFormation(properties.isolationMode),
    "RunAs": convertCfnFunctionDefinitionVersionRunAsPropertyToCloudFormation(properties.runAs)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionExecutionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinitionVersion.ExecutionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersion.ExecutionProperty>();
  ret.addPropertyResult("isolationMode", "IsolationMode", (properties.IsolationMode != null ? cfn_parse.FromCloudFormation.getString(properties.IsolationMode) : undefined));
  ret.addPropertyResult("runAs", "RunAs", (properties.RunAs != null ? CfnFunctionDefinitionVersionRunAsPropertyFromCloudFormation(properties.RunAs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionDefaultConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("execution", cdk.requiredValidator)(properties.execution));
  errors.collect(cdk.propertyValidator("execution", CfnFunctionDefinitionVersionExecutionPropertyValidator)(properties.execution));
  return errors.wrap("supplied properties not correct for \"DefaultConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionDefaultConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionDefaultConfigPropertyValidator(properties).assertSuccess();
  return {
    "Execution": convertCfnFunctionDefinitionVersionExecutionPropertyToCloudFormation(properties.execution)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionDefaultConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinitionVersion.DefaultConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersion.DefaultConfigProperty>();
  ret.addPropertyResult("execution", "Execution", (properties.Execution != null ? CfnFunctionDefinitionVersionExecutionPropertyFromCloudFormation(properties.Execution) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceAccessPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceAccessPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionResourceAccessPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("permission", cdk.validateString)(properties.permission));
  errors.collect(cdk.propertyValidator("resourceId", cdk.requiredValidator)(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  return errors.wrap("supplied properties not correct for \"ResourceAccessPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionResourceAccessPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionResourceAccessPolicyPropertyValidator(properties).assertSuccess();
  return {
    "Permission": cdk.stringToCloudFormation(properties.permission),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionResourceAccessPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunctionDefinitionVersion.ResourceAccessPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersion.ResourceAccessPolicyProperty>();
  ret.addPropertyResult("permission", "Permission", (properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionEnvironmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessSysfs", cdk.validateBoolean)(properties.accessSysfs));
  errors.collect(cdk.propertyValidator("execution", CfnFunctionDefinitionVersionExecutionPropertyValidator)(properties.execution));
  errors.collect(cdk.propertyValidator("resourceAccessPolicies", cdk.listValidator(CfnFunctionDefinitionVersionResourceAccessPolicyPropertyValidator))(properties.resourceAccessPolicies));
  errors.collect(cdk.propertyValidator("variables", cdk.validateObject)(properties.variables));
  return errors.wrap("supplied properties not correct for \"EnvironmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionEnvironmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionEnvironmentPropertyValidator(properties).assertSuccess();
  return {
    "AccessSysfs": cdk.booleanToCloudFormation(properties.accessSysfs),
    "Execution": convertCfnFunctionDefinitionVersionExecutionPropertyToCloudFormation(properties.execution),
    "ResourceAccessPolicies": cdk.listMapper(convertCfnFunctionDefinitionVersionResourceAccessPolicyPropertyToCloudFormation)(properties.resourceAccessPolicies),
    "Variables": cdk.objectToCloudFormation(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionEnvironmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinitionVersion.EnvironmentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersion.EnvironmentProperty>();
  ret.addPropertyResult("accessSysfs", "AccessSysfs", (properties.AccessSysfs != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AccessSysfs) : undefined));
  ret.addPropertyResult("execution", "Execution", (properties.Execution != null ? CfnFunctionDefinitionVersionExecutionPropertyFromCloudFormation(properties.Execution) : undefined));
  ret.addPropertyResult("resourceAccessPolicies", "ResourceAccessPolicies", (properties.ResourceAccessPolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionDefinitionVersionResourceAccessPolicyPropertyFromCloudFormation)(properties.ResourceAccessPolicies) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getAny(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionFunctionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encodingType", cdk.validateString)(properties.encodingType));
  errors.collect(cdk.propertyValidator("environment", CfnFunctionDefinitionVersionEnvironmentPropertyValidator)(properties.environment));
  errors.collect(cdk.propertyValidator("execArgs", cdk.validateString)(properties.execArgs));
  errors.collect(cdk.propertyValidator("executable", cdk.validateString)(properties.executable));
  errors.collect(cdk.propertyValidator("memorySize", cdk.validateNumber)(properties.memorySize));
  errors.collect(cdk.propertyValidator("pinned", cdk.validateBoolean)(properties.pinned));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"FunctionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionFunctionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionFunctionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EncodingType": cdk.stringToCloudFormation(properties.encodingType),
    "Environment": convertCfnFunctionDefinitionVersionEnvironmentPropertyToCloudFormation(properties.environment),
    "ExecArgs": cdk.stringToCloudFormation(properties.execArgs),
    "Executable": cdk.stringToCloudFormation(properties.executable),
    "MemorySize": cdk.numberToCloudFormation(properties.memorySize),
    "Pinned": cdk.booleanToCloudFormation(properties.pinned),
    "Timeout": cdk.numberToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionFunctionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinitionVersion.FunctionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersion.FunctionConfigurationProperty>();
  ret.addPropertyResult("encodingType", "EncodingType", (properties.EncodingType != null ? cfn_parse.FromCloudFormation.getString(properties.EncodingType) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? CfnFunctionDefinitionVersionEnvironmentPropertyFromCloudFormation(properties.Environment) : undefined));
  ret.addPropertyResult("execArgs", "ExecArgs", (properties.ExecArgs != null ? cfn_parse.FromCloudFormation.getString(properties.ExecArgs) : undefined));
  ret.addPropertyResult("executable", "Executable", (properties.Executable != null ? cfn_parse.FromCloudFormation.getString(properties.Executable) : undefined));
  ret.addPropertyResult("memorySize", "MemorySize", (properties.MemorySize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemorySize) : undefined));
  ret.addPropertyResult("pinned", "Pinned", (properties.Pinned != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Pinned) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionFunctionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.requiredValidator)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionConfiguration", cdk.requiredValidator)(properties.functionConfiguration));
  errors.collect(cdk.propertyValidator("functionConfiguration", CfnFunctionDefinitionVersionFunctionConfigurationPropertyValidator)(properties.functionConfiguration));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  return errors.wrap("supplied properties not correct for \"FunctionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionFunctionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionFunctionPropertyValidator(properties).assertSuccess();
  return {
    "FunctionArn": cdk.stringToCloudFormation(properties.functionArn),
    "FunctionConfiguration": convertCfnFunctionDefinitionVersionFunctionConfigurationPropertyToCloudFormation(properties.functionConfiguration),
    "Id": cdk.stringToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionFunctionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinitionVersion.FunctionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersion.FunctionProperty>();
  ret.addPropertyResult("functionArn", "FunctionArn", (properties.FunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionArn) : undefined));
  ret.addPropertyResult("functionConfiguration", "FunctionConfiguration", (properties.FunctionConfiguration != null ? CfnFunctionDefinitionVersionFunctionConfigurationPropertyFromCloudFormation(properties.FunctionConfiguration) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionDefinitionVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionDefinitionVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDefinitionVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultConfig", CfnFunctionDefinitionVersionDefaultConfigPropertyValidator)(properties.defaultConfig));
  errors.collect(cdk.propertyValidator("functionDefinitionId", cdk.requiredValidator)(properties.functionDefinitionId));
  errors.collect(cdk.propertyValidator("functionDefinitionId", cdk.validateString)(properties.functionDefinitionId));
  errors.collect(cdk.propertyValidator("functions", cdk.requiredValidator)(properties.functions));
  errors.collect(cdk.propertyValidator("functions", cdk.listValidator(CfnFunctionDefinitionVersionFunctionPropertyValidator))(properties.functions));
  return errors.wrap("supplied properties not correct for \"CfnFunctionDefinitionVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDefinitionVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDefinitionVersionPropsValidator(properties).assertSuccess();
  return {
    "DefaultConfig": convertCfnFunctionDefinitionVersionDefaultConfigPropertyToCloudFormation(properties.defaultConfig),
    "FunctionDefinitionId": cdk.stringToCloudFormation(properties.functionDefinitionId),
    "Functions": cdk.listMapper(convertCfnFunctionDefinitionVersionFunctionPropertyToCloudFormation)(properties.functions)
  };
}

// @ts-ignore TS6133
function CfnFunctionDefinitionVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionDefinitionVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionDefinitionVersionProps>();
  ret.addPropertyResult("defaultConfig", "DefaultConfig", (properties.DefaultConfig != null ? CfnFunctionDefinitionVersionDefaultConfigPropertyFromCloudFormation(properties.DefaultConfig) : undefined));
  ret.addPropertyResult("functionDefinitionId", "FunctionDefinitionId", (properties.FunctionDefinitionId != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionDefinitionId) : undefined));
  ret.addPropertyResult("functions", "Functions", (properties.Functions != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionDefinitionVersionFunctionPropertyFromCloudFormation)(properties.Functions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * AWS IoT Greengrass seamlessly extends AWS to edge devices so they can act locally on the data they generate, while still using the cloud for management, analytics, and durable storage.
 *
 * With AWS IoT Greengrass , connected devices can run AWS Lambda functions, execute predictions based on machine learning models, keep device data in sync, and communicate with other devices securely – even when not connected to the internet. For more information, see the [Developer Guide](https://docs.aws.amazon.com/greengrass/v1/developerguide/what-is-gg.html) .
 *
 * > For AWS Region support, see [AWS CloudFormation Support for AWS IoT Greengrass](https://docs.aws.amazon.com/greengrass/v1/developerguide/cloudformation-support.html) in the *Developer Guide* .
 *
 * The `AWS::Greengrass::Group` resource represents a group in AWS IoT Greengrass . In the AWS IoT Greengrass API, groups are used to organize your group versions.
 *
 * Groups can reference multiple group versions. All group versions must be associated with a group. A group version references a device definition version, subscription definition version, and other version types that contain the components you want to deploy to a Greengrass core device.
 *
 * To deploy a group version, the group version must reference a core definition version that contains one core. Other version types are optionally included, depending on your business need.
 *
 * > When you create a group, you can optionally include an initial group version. To associate a group version later, create a [`AWS::Greengrass::GroupVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html) resource and specify the ID of this group.
 * >
 * > To change group components (such as devices, subscriptions, or functions), you must create new versions. This is because versions are immutable. For example, to add a function, you create a function definition version that contains the new function (and all other functions that you want to deploy). Then you create a group version that references the new function definition version (and all other version types that you want to deploy).
 *
 * *Deploying a Group Version*
 *
 * After you create the group version in your AWS CloudFormation template, you can deploy it using the [`aws greengrass create-deployment`](https://docs.aws.amazon.com/greengrass/v1/apireference/createdeployment-post.html) command in the AWS CLI or from the *Greengrass* node in the AWS IoT console. To deploy a group version, you must have a Greengrass service role associated with your AWS account . For more information, see [AWS CloudFormation Support for AWS IoT Greengrass](https://docs.aws.amazon.com/greengrass/v1/developerguide/cloudformation-support.html) in the *Developer Guide* .
 *
 * @cloudformationResource AWS::Greengrass::Group
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html
 */
export class CfnGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::Group";

  /**
   * Build a CfnGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the `Group` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/groups/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `Group` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `GroupVersion` that was added to the `Group` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/groups/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the `Group` , such as `MyGroup` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The ARN of the IAM role that's attached to the `Group` , such as `arn:aws:iam::  :role/role-name` .
   *
   * @cloudformationAttribute RoleArn
   */
  public readonly attrRoleArn: string;

  /**
   * The time (in milliseconds since the epoch) when the group role was attached to the `Group` .
   *
   * @cloudformationAttribute RoleAttachedAt
   */
  public readonly attrRoleAttachedAt: string;

  /**
   * The group version to include when the group is created.
   */
  public initialVersion?: CfnGroup.GroupVersionProperty | cdk.IResolvable;

  /**
   * The name of the group.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role attached to the group.
   */
  public roleArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the group.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupProps) {
    super(scope, id, {
      "type": CfnGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.attrRoleArn = cdk.Token.asString(this.getAtt("RoleArn", cdk.ResolutionTypeHint.STRING));
    this.attrRoleAttachedAt = cdk.Token.asString(this.getAtt("RoleAttachedAt", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::Group", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
      "name": this.name,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGroupPropsToCloudFormation(props);
  }
}

export namespace CfnGroup {
  /**
   * A group version in AWS IoT Greengrass , which references of a core definition version, device definition version, subscription definition version, and other version types that contain the components you want to deploy to a Greengrass core device.
   *
   * The group version must reference a core definition version that contains one core. Other version types are optionally included, depending on your business need.
   *
   * In an AWS CloudFormation template, `GroupVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html
   */
  export interface GroupVersionProperty {
    /**
     * The Amazon Resource Name (ARN) of the connector definition version that contains the connectors you want to deploy with the group version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html#cfn-greengrass-group-groupversion-connectordefinitionversionarn
     */
    readonly connectorDefinitionVersionArn?: string;

    /**
     * The ARN of the core definition version that contains the core you want to deploy with the group version.
     *
     * Currently, the core definition version can contain only one core.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html#cfn-greengrass-group-groupversion-coredefinitionversionarn
     */
    readonly coreDefinitionVersionArn?: string;

    /**
     * The ARN of the device definition version that contains the devices you want to deploy with the group version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html#cfn-greengrass-group-groupversion-devicedefinitionversionarn
     */
    readonly deviceDefinitionVersionArn?: string;

    /**
     * The ARN of the function definition version that contains the functions you want to deploy with the group version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html#cfn-greengrass-group-groupversion-functiondefinitionversionarn
     */
    readonly functionDefinitionVersionArn?: string;

    /**
     * The ARN of the logger definition version that contains the loggers you want to deploy with the group version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html#cfn-greengrass-group-groupversion-loggerdefinitionversionarn
     */
    readonly loggerDefinitionVersionArn?: string;

    /**
     * The ARN of the resource definition version that contains the resources you want to deploy with the group version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html#cfn-greengrass-group-groupversion-resourcedefinitionversionarn
     */
    readonly resourceDefinitionVersionArn?: string;

    /**
     * The ARN of the subscription definition version that contains the subscriptions you want to deploy with the group version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-group-groupversion.html#cfn-greengrass-group-groupversion-subscriptiondefinitionversionarn
     */
    readonly subscriptionDefinitionVersionArn?: string;
  }
}

/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html
 */
export interface CfnGroupProps {
  /**
   * The group version to include when the group is created.
   *
   * A group version references the Amazon Resource Name (ARN) of a core definition version, device definition version, subscription definition version, and other version types. The group version must reference a core definition version that contains one core. Other version types are optionally included, depending on your business need.
   *
   * > To associate a group version after the group is created, create an [`AWS::Greengrass::GroupVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html) resource and specify the ID of this group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html#cfn-greengrass-group-initialversion
   */
  readonly initialVersion?: CfnGroup.GroupVersionProperty | cdk.IResolvable;

  /**
   * The name of the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html#cfn-greengrass-group-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role attached to the group.
   *
   * This role contains the permissions that Lambda functions and connectors use to interact with other AWS services.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html#cfn-greengrass-group-rolearn
   */
  readonly roleArn?: string;

  /**
   * Application-specific metadata to attach to the group.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html#cfn-greengrass-group-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `GroupVersionProperty`
 *
 * @param properties - the TypeScript properties of a `GroupVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupGroupVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorDefinitionVersionArn", cdk.validateString)(properties.connectorDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("coreDefinitionVersionArn", cdk.validateString)(properties.coreDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("deviceDefinitionVersionArn", cdk.validateString)(properties.deviceDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("functionDefinitionVersionArn", cdk.validateString)(properties.functionDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("loggerDefinitionVersionArn", cdk.validateString)(properties.loggerDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("resourceDefinitionVersionArn", cdk.validateString)(properties.resourceDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("subscriptionDefinitionVersionArn", cdk.validateString)(properties.subscriptionDefinitionVersionArn));
  return errors.wrap("supplied properties not correct for \"GroupVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnGroupGroupVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupGroupVersionPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorDefinitionVersionArn": cdk.stringToCloudFormation(properties.connectorDefinitionVersionArn),
    "CoreDefinitionVersionArn": cdk.stringToCloudFormation(properties.coreDefinitionVersionArn),
    "DeviceDefinitionVersionArn": cdk.stringToCloudFormation(properties.deviceDefinitionVersionArn),
    "FunctionDefinitionVersionArn": cdk.stringToCloudFormation(properties.functionDefinitionVersionArn),
    "LoggerDefinitionVersionArn": cdk.stringToCloudFormation(properties.loggerDefinitionVersionArn),
    "ResourceDefinitionVersionArn": cdk.stringToCloudFormation(properties.resourceDefinitionVersionArn),
    "SubscriptionDefinitionVersionArn": cdk.stringToCloudFormation(properties.subscriptionDefinitionVersionArn)
  };
}

// @ts-ignore TS6133
function CfnGroupGroupVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroup.GroupVersionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroup.GroupVersionProperty>();
  ret.addPropertyResult("connectorDefinitionVersionArn", "ConnectorDefinitionVersionArn", (properties.ConnectorDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorDefinitionVersionArn) : undefined));
  ret.addPropertyResult("coreDefinitionVersionArn", "CoreDefinitionVersionArn", (properties.CoreDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.CoreDefinitionVersionArn) : undefined));
  ret.addPropertyResult("deviceDefinitionVersionArn", "DeviceDefinitionVersionArn", (properties.DeviceDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceDefinitionVersionArn) : undefined));
  ret.addPropertyResult("functionDefinitionVersionArn", "FunctionDefinitionVersionArn", (properties.FunctionDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionDefinitionVersionArn) : undefined));
  ret.addPropertyResult("loggerDefinitionVersionArn", "LoggerDefinitionVersionArn", (properties.LoggerDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.LoggerDefinitionVersionArn) : undefined));
  ret.addPropertyResult("resourceDefinitionVersionArn", "ResourceDefinitionVersionArn", (properties.ResourceDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceDefinitionVersionArn) : undefined));
  ret.addPropertyResult("subscriptionDefinitionVersionArn", "SubscriptionDefinitionVersionArn", (properties.SubscriptionDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionDefinitionVersionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnGroupGroupVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnGroupGroupVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnGroupGroupVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::GroupVersion` resource represents a group version in AWS IoT Greengrass .
 *
 * A group version references a core definition version, device definition version, subscription definition version, and other version types that contain the components you want to deploy to a Greengrass core device. The group version must reference a core definition version that contains one core. Other version types are optionally included, depending on your business need.
 *
 * > To create a group version, you must specify the ID of the group that you want to associate with the version. For information about creating a group, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::GroupVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html
 */
export class CfnGroupVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::GroupVersion";

  /**
   * Build a CfnGroupVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroupVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGroupVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGroupVersion(scope, id, propsResult.value);
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
   * The Amazon Resource Name (ARN) of the connector definition version that contains the connectors you want to deploy with the group version.
   */
  public connectorDefinitionVersionArn?: string;

  /**
   * The ARN of the core definition version that contains the core you want to deploy with the group version.
   */
  public coreDefinitionVersionArn?: string;

  /**
   * The ARN of the device definition version that contains the devices you want to deploy with the group version.
   */
  public deviceDefinitionVersionArn?: string;

  /**
   * The ARN of the function definition version that contains the functions you want to deploy with the group version.
   */
  public functionDefinitionVersionArn?: string;

  /**
   * The ID of the group associated with this version.
   */
  public groupId: string;

  /**
   * The ARN of the logger definition version that contains the loggers you want to deploy with the group version.
   */
  public loggerDefinitionVersionArn?: string;

  /**
   * The ARN of the resource definition version that contains the resources you want to deploy with the group version.
   */
  public resourceDefinitionVersionArn?: string;

  /**
   * The ARN of the subscription definition version that contains the subscriptions you want to deploy with the group version.
   */
  public subscriptionDefinitionVersionArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupVersionProps) {
    super(scope, id, {
      "type": CfnGroupVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "groupId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.connectorDefinitionVersionArn = props.connectorDefinitionVersionArn;
    this.coreDefinitionVersionArn = props.coreDefinitionVersionArn;
    this.deviceDefinitionVersionArn = props.deviceDefinitionVersionArn;
    this.functionDefinitionVersionArn = props.functionDefinitionVersionArn;
    this.groupId = props.groupId;
    this.loggerDefinitionVersionArn = props.loggerDefinitionVersionArn;
    this.resourceDefinitionVersionArn = props.resourceDefinitionVersionArn;
    this.subscriptionDefinitionVersionArn = props.subscriptionDefinitionVersionArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectorDefinitionVersionArn": this.connectorDefinitionVersionArn,
      "coreDefinitionVersionArn": this.coreDefinitionVersionArn,
      "deviceDefinitionVersionArn": this.deviceDefinitionVersionArn,
      "functionDefinitionVersionArn": this.functionDefinitionVersionArn,
      "groupId": this.groupId,
      "loggerDefinitionVersionArn": this.loggerDefinitionVersionArn,
      "resourceDefinitionVersionArn": this.resourceDefinitionVersionArn,
      "subscriptionDefinitionVersionArn": this.subscriptionDefinitionVersionArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroupVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGroupVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGroupVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html
 */
export interface CfnGroupVersionProps {
  /**
   * The Amazon Resource Name (ARN) of the connector definition version that contains the connectors you want to deploy with the group version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-connectordefinitionversionarn
   */
  readonly connectorDefinitionVersionArn?: string;

  /**
   * The ARN of the core definition version that contains the core you want to deploy with the group version.
   *
   * Currently, the core definition version can contain only one core.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-coredefinitionversionarn
   */
  readonly coreDefinitionVersionArn?: string;

  /**
   * The ARN of the device definition version that contains the devices you want to deploy with the group version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-devicedefinitionversionarn
   */
  readonly deviceDefinitionVersionArn?: string;

  /**
   * The ARN of the function definition version that contains the functions you want to deploy with the group version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-functiondefinitionversionarn
   */
  readonly functionDefinitionVersionArn?: string;

  /**
   * The ID of the group associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-groupid
   */
  readonly groupId: string;

  /**
   * The ARN of the logger definition version that contains the loggers you want to deploy with the group version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-loggerdefinitionversionarn
   */
  readonly loggerDefinitionVersionArn?: string;

  /**
   * The ARN of the resource definition version that contains the resources you want to deploy with the group version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-resourcedefinitionversionarn
   */
  readonly resourceDefinitionVersionArn?: string;

  /**
   * The ARN of the subscription definition version that contains the subscriptions you want to deploy with the group version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-groupversion.html#cfn-greengrass-groupversion-subscriptiondefinitionversionarn
   */
  readonly subscriptionDefinitionVersionArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnGroupVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorDefinitionVersionArn", cdk.validateString)(properties.connectorDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("coreDefinitionVersionArn", cdk.validateString)(properties.coreDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("deviceDefinitionVersionArn", cdk.validateString)(properties.deviceDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("functionDefinitionVersionArn", cdk.validateString)(properties.functionDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("groupId", cdk.requiredValidator)(properties.groupId));
  errors.collect(cdk.propertyValidator("groupId", cdk.validateString)(properties.groupId));
  errors.collect(cdk.propertyValidator("loggerDefinitionVersionArn", cdk.validateString)(properties.loggerDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("resourceDefinitionVersionArn", cdk.validateString)(properties.resourceDefinitionVersionArn));
  errors.collect(cdk.propertyValidator("subscriptionDefinitionVersionArn", cdk.validateString)(properties.subscriptionDefinitionVersionArn));
  return errors.wrap("supplied properties not correct for \"CfnGroupVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupVersionPropsValidator(properties).assertSuccess();
  return {
    "ConnectorDefinitionVersionArn": cdk.stringToCloudFormation(properties.connectorDefinitionVersionArn),
    "CoreDefinitionVersionArn": cdk.stringToCloudFormation(properties.coreDefinitionVersionArn),
    "DeviceDefinitionVersionArn": cdk.stringToCloudFormation(properties.deviceDefinitionVersionArn),
    "FunctionDefinitionVersionArn": cdk.stringToCloudFormation(properties.functionDefinitionVersionArn),
    "GroupId": cdk.stringToCloudFormation(properties.groupId),
    "LoggerDefinitionVersionArn": cdk.stringToCloudFormation(properties.loggerDefinitionVersionArn),
    "ResourceDefinitionVersionArn": cdk.stringToCloudFormation(properties.resourceDefinitionVersionArn),
    "SubscriptionDefinitionVersionArn": cdk.stringToCloudFormation(properties.subscriptionDefinitionVersionArn)
  };
}

// @ts-ignore TS6133
function CfnGroupVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupVersionProps>();
  ret.addPropertyResult("connectorDefinitionVersionArn", "ConnectorDefinitionVersionArn", (properties.ConnectorDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorDefinitionVersionArn) : undefined));
  ret.addPropertyResult("coreDefinitionVersionArn", "CoreDefinitionVersionArn", (properties.CoreDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.CoreDefinitionVersionArn) : undefined));
  ret.addPropertyResult("deviceDefinitionVersionArn", "DeviceDefinitionVersionArn", (properties.DeviceDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceDefinitionVersionArn) : undefined));
  ret.addPropertyResult("functionDefinitionVersionArn", "FunctionDefinitionVersionArn", (properties.FunctionDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionDefinitionVersionArn) : undefined));
  ret.addPropertyResult("groupId", "GroupId", (properties.GroupId != null ? cfn_parse.FromCloudFormation.getString(properties.GroupId) : undefined));
  ret.addPropertyResult("loggerDefinitionVersionArn", "LoggerDefinitionVersionArn", (properties.LoggerDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.LoggerDefinitionVersionArn) : undefined));
  ret.addPropertyResult("resourceDefinitionVersionArn", "ResourceDefinitionVersionArn", (properties.ResourceDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceDefinitionVersionArn) : undefined));
  ret.addPropertyResult("subscriptionDefinitionVersionArn", "SubscriptionDefinitionVersionArn", (properties.SubscriptionDefinitionVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionDefinitionVersionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::LoggerDefinition` resource represents a logger definition for AWS IoT Greengrass .
 *
 * Logger definitions are used to organize your logger definition versions.
 *
 * Logger definitions can reference multiple logger definition versions. All logger definition versions must be associated with a logger definition. Each logger definition version can contain one or more loggers.
 *
 * > When you create a logger definition, you can optionally include an initial logger definition version. To associate a logger definition version later, create an [`AWS::Greengrass::LoggerDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinitionversion.html) resource and specify the ID of this logger definition.
 * >
 * > After you create the logger definition version that contains the loggers you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::LoggerDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinition.html
 */
export class CfnLoggerDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::LoggerDefinition";

  /**
   * Build a CfnLoggerDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoggerDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoggerDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoggerDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `LoggerDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/loggers/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `LoggerDefinition` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `LoggerDefinitionVersion` that was added to the `LoggerDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/loggers/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the `LoggerDefinition` , such as `MyLoggerDefinition` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The logger definition version to include when the logger definition is created.
   */
  public initialVersion?: cdk.IResolvable | CfnLoggerDefinition.LoggerDefinitionVersionProperty;

  /**
   * The name of the logger definition.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the logger definition.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoggerDefinitionProps) {
    super(scope, id, {
      "type": CfnLoggerDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::LoggerDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoggerDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoggerDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnLoggerDefinition {
  /**
   * A logger definition version contains a list of [loggers](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html) .
   *
   * > After you create a logger definition version that contains the loggers you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
   *
   * In an AWS CloudFormation template, `LoggerDefinitionVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::LoggerDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinition.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-loggerdefinitionversion.html
   */
  export interface LoggerDefinitionVersionProperty {
    /**
     * The loggers in this version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-loggerdefinitionversion.html#cfn-greengrass-loggerdefinition-loggerdefinitionversion-loggers
     */
    readonly loggers: Array<cdk.IResolvable | CfnLoggerDefinition.LoggerProperty> | cdk.IResolvable;
  }

  /**
   * A logger represents logging settings for the AWS IoT Greengrass group, which can be stored in CloudWatch and the local file system of your core device.
   *
   * All log entries include a timestamp, log level, and information about the event. For more information, see [Monitoring with AWS IoT Greengrass Logs](https://docs.aws.amazon.com/greengrass/v1/developerguide/greengrass-logs-overview.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Loggers` property of the [`LoggerDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-loggerdefinitionversion.html) property type contains a list of `Logger` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html
   */
  export interface LoggerProperty {
    /**
     * The source of the log event.
     *
     * Valid values are `GreengrassSystem` or `Lambda` . When `GreengrassSystem` is used, events from Greengrass system components are logged. When `Lambda` is used, events from user-defined Lambda functions are logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html#cfn-greengrass-loggerdefinition-logger-component
     */
    readonly component: string;

    /**
     * A descriptive or arbitrary ID for the logger.
     *
     * This value must be unique within the logger definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html#cfn-greengrass-loggerdefinition-logger-id
     */
    readonly id: string;

    /**
     * The log-level threshold.
     *
     * Log events below this threshold are filtered out and aren't stored. Valid values are `DEBUG` , `INFO` (recommended), `WARN` , `ERROR` , or `FATAL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html#cfn-greengrass-loggerdefinition-logger-level
     */
    readonly level: string;

    /**
     * The amount of file space (in KB) to use when writing logs to the local file system.
     *
     * This property does not apply for CloudWatch Logs .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html#cfn-greengrass-loggerdefinition-logger-space
     */
    readonly space?: number;

    /**
     * The storage mechanism for log events.
     *
     * Valid values are `FileSystem` or `AWSCloudWatch` . When `AWSCloudWatch` is used, log events are sent to CloudWatch Logs . When `FileSystem` is used, log events are stored on the local file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html#cfn-greengrass-loggerdefinition-logger-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnLoggerDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinition.html
 */
export interface CfnLoggerDefinitionProps {
  /**
   * The logger definition version to include when the logger definition is created.
   *
   * A logger definition version contains a list of [`logger`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinition-logger.html) property types.
   *
   * > To associate a logger definition version after the logger definition is created, create an [`AWS::Greengrass::LoggerDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinitionversion.html) resource and specify the ID of this logger definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinition.html#cfn-greengrass-loggerdefinition-initialversion
   */
  readonly initialVersion?: cdk.IResolvable | CfnLoggerDefinition.LoggerDefinitionVersionProperty;

  /**
   * The name of the logger definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinition.html#cfn-greengrass-loggerdefinition-name
   */
  readonly name: string;

  /**
   * Application-specific metadata to attach to the logger definition.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinition.html#cfn-greengrass-loggerdefinition-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `LoggerProperty`
 *
 * @param properties - the TypeScript properties of a `LoggerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggerDefinitionLoggerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("component", cdk.requiredValidator)(properties.component));
  errors.collect(cdk.propertyValidator("component", cdk.validateString)(properties.component));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("level", cdk.requiredValidator)(properties.level));
  errors.collect(cdk.propertyValidator("level", cdk.validateString)(properties.level));
  errors.collect(cdk.propertyValidator("space", cdk.validateNumber)(properties.space));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"LoggerProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggerDefinitionLoggerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggerDefinitionLoggerPropertyValidator(properties).assertSuccess();
  return {
    "Component": cdk.stringToCloudFormation(properties.component),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Level": cdk.stringToCloudFormation(properties.level),
    "Space": cdk.numberToCloudFormation(properties.space),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnLoggerDefinitionLoggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggerDefinition.LoggerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggerDefinition.LoggerProperty>();
  ret.addPropertyResult("component", "Component", (properties.Component != null ? cfn_parse.FromCloudFormation.getString(properties.Component) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("level", "Level", (properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined));
  ret.addPropertyResult("space", "Space", (properties.Space != null ? cfn_parse.FromCloudFormation.getNumber(properties.Space) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggerDefinitionVersionProperty`
 *
 * @param properties - the TypeScript properties of a `LoggerDefinitionVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggerDefinitionLoggerDefinitionVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("loggers", cdk.requiredValidator)(properties.loggers));
  errors.collect(cdk.propertyValidator("loggers", cdk.listValidator(CfnLoggerDefinitionLoggerPropertyValidator))(properties.loggers));
  return errors.wrap("supplied properties not correct for \"LoggerDefinitionVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggerDefinitionLoggerDefinitionVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggerDefinitionLoggerDefinitionVersionPropertyValidator(properties).assertSuccess();
  return {
    "Loggers": cdk.listMapper(convertCfnLoggerDefinitionLoggerPropertyToCloudFormation)(properties.loggers)
  };
}

// @ts-ignore TS6133
function CfnLoggerDefinitionLoggerDefinitionVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggerDefinition.LoggerDefinitionVersionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggerDefinition.LoggerDefinitionVersionProperty>();
  ret.addPropertyResult("loggers", "Loggers", (properties.Loggers != null ? cfn_parse.FromCloudFormation.getArray(CfnLoggerDefinitionLoggerPropertyFromCloudFormation)(properties.Loggers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLoggerDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggerDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggerDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnLoggerDefinitionLoggerDefinitionVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLoggerDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnLoggerDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggerDefinitionPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnLoggerDefinitionLoggerDefinitionVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLoggerDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggerDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggerDefinitionProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnLoggerDefinitionLoggerDefinitionVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::LoggerDefinitionVersion` resource represents a logger definition version for AWS IoT Greengrass .
 *
 * A logger definition version contains a list of loggers.
 *
 * > To create a logger definition version, you must specify the ID of the logger definition that you want to associate with the version. For information about creating a logger definition, see [`AWS::Greengrass::LoggerDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinition.html) .
 * >
 * > After you create a logger definition version that contains the loggers you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::LoggerDefinitionVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinitionversion.html
 */
export class CfnLoggerDefinitionVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::LoggerDefinitionVersion";

  /**
   * Build a CfnLoggerDefinitionVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoggerDefinitionVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoggerDefinitionVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoggerDefinitionVersion(scope, id, propsResult.value);
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
   * The ID of the logger definition associated with this version.
   */
  public loggerDefinitionId: string;

  /**
   * The loggers in this version.
   */
  public loggers: Array<cdk.IResolvable | CfnLoggerDefinitionVersion.LoggerProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoggerDefinitionVersionProps) {
    super(scope, id, {
      "type": CfnLoggerDefinitionVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "loggerDefinitionId", this);
    cdk.requireProperty(props, "loggers", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.loggerDefinitionId = props.loggerDefinitionId;
    this.loggers = props.loggers;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "loggerDefinitionId": this.loggerDefinitionId,
      "loggers": this.loggers
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoggerDefinitionVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoggerDefinitionVersionPropsToCloudFormation(props);
  }
}

export namespace CfnLoggerDefinitionVersion {
  /**
   * A logger represents logging settings for the AWS IoT Greengrass group, which can be stored in CloudWatch and the local file system of your core device.
   *
   * All log entries include a timestamp, log level, and information about the event. For more information, see [Monitoring with AWS IoT Greengrass Logs](https://docs.aws.amazon.com/greengrass/v1/developerguide/greengrass-logs-overview.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Loggers` property of the [`AWS::Greengrass::LoggerDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinitionversion.html) resource contains a list of `Logger` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinitionversion-logger.html
   */
  export interface LoggerProperty {
    /**
     * The source of the log event.
     *
     * Valid values are `GreengrassSystem` or `Lambda` . When `GreengrassSystem` is used, events from Greengrass system components are logged. When `Lambda` is used, events from user-defined Lambda functions are logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinitionversion-logger.html#cfn-greengrass-loggerdefinitionversion-logger-component
     */
    readonly component: string;

    /**
     * A descriptive or arbitrary ID for the logger.
     *
     * This value must be unique within the logger definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinitionversion-logger.html#cfn-greengrass-loggerdefinitionversion-logger-id
     */
    readonly id: string;

    /**
     * The log-level threshold.
     *
     * Log events below this threshold are filtered out and aren't stored. Valid values are `DEBUG` , `INFO` (recommended), `WARN` , `ERROR` , or `FATAL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinitionversion-logger.html#cfn-greengrass-loggerdefinitionversion-logger-level
     */
    readonly level: string;

    /**
     * The amount of file space (in KB) to use when writing logs to the local file system.
     *
     * This property does not apply for CloudWatch Logs .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinitionversion-logger.html#cfn-greengrass-loggerdefinitionversion-logger-space
     */
    readonly space?: number;

    /**
     * The storage mechanism for log events.
     *
     * Valid values are `FileSystem` or `AWSCloudWatch` . When `AWSCloudWatch` is used, log events are sent to CloudWatch Logs . When `FileSystem` is used, log events are stored on the local file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-loggerdefinitionversion-logger.html#cfn-greengrass-loggerdefinitionversion-logger-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnLoggerDefinitionVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinitionversion.html
 */
export interface CfnLoggerDefinitionVersionProps {
  /**
   * The ID of the logger definition associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinitionversion.html#cfn-greengrass-loggerdefinitionversion-loggerdefinitionid
   */
  readonly loggerDefinitionId: string;

  /**
   * The loggers in this version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-loggerdefinitionversion.html#cfn-greengrass-loggerdefinitionversion-loggers
   */
  readonly loggers: Array<cdk.IResolvable | CfnLoggerDefinitionVersion.LoggerProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `LoggerProperty`
 *
 * @param properties - the TypeScript properties of a `LoggerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggerDefinitionVersionLoggerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("component", cdk.requiredValidator)(properties.component));
  errors.collect(cdk.propertyValidator("component", cdk.validateString)(properties.component));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("level", cdk.requiredValidator)(properties.level));
  errors.collect(cdk.propertyValidator("level", cdk.validateString)(properties.level));
  errors.collect(cdk.propertyValidator("space", cdk.validateNumber)(properties.space));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"LoggerProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggerDefinitionVersionLoggerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggerDefinitionVersionLoggerPropertyValidator(properties).assertSuccess();
  return {
    "Component": cdk.stringToCloudFormation(properties.component),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Level": cdk.stringToCloudFormation(properties.level),
    "Space": cdk.numberToCloudFormation(properties.space),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnLoggerDefinitionVersionLoggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggerDefinitionVersion.LoggerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggerDefinitionVersion.LoggerProperty>();
  ret.addPropertyResult("component", "Component", (properties.Component != null ? cfn_parse.FromCloudFormation.getString(properties.Component) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("level", "Level", (properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined));
  ret.addPropertyResult("space", "Space", (properties.Space != null ? cfn_parse.FromCloudFormation.getNumber(properties.Space) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLoggerDefinitionVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggerDefinitionVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggerDefinitionVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("loggerDefinitionId", cdk.requiredValidator)(properties.loggerDefinitionId));
  errors.collect(cdk.propertyValidator("loggerDefinitionId", cdk.validateString)(properties.loggerDefinitionId));
  errors.collect(cdk.propertyValidator("loggers", cdk.requiredValidator)(properties.loggers));
  errors.collect(cdk.propertyValidator("loggers", cdk.listValidator(CfnLoggerDefinitionVersionLoggerPropertyValidator))(properties.loggers));
  return errors.wrap("supplied properties not correct for \"CfnLoggerDefinitionVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnLoggerDefinitionVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggerDefinitionVersionPropsValidator(properties).assertSuccess();
  return {
    "LoggerDefinitionId": cdk.stringToCloudFormation(properties.loggerDefinitionId),
    "Loggers": cdk.listMapper(convertCfnLoggerDefinitionVersionLoggerPropertyToCloudFormation)(properties.loggers)
  };
}

// @ts-ignore TS6133
function CfnLoggerDefinitionVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggerDefinitionVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggerDefinitionVersionProps>();
  ret.addPropertyResult("loggerDefinitionId", "LoggerDefinitionId", (properties.LoggerDefinitionId != null ? cfn_parse.FromCloudFormation.getString(properties.LoggerDefinitionId) : undefined));
  ret.addPropertyResult("loggers", "Loggers", (properties.Loggers != null ? cfn_parse.FromCloudFormation.getArray(CfnLoggerDefinitionVersionLoggerPropertyFromCloudFormation)(properties.Loggers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::ResourceDefinition` resource represents a resource definition for AWS IoT Greengrass .
 *
 * Resource definitions are used to organize your resource definition versions.
 *
 * Resource definitions can reference multiple resource definition versions. All resource definition versions must be associated with a resource definition. Each resource definition version can contain one or more resources. (In AWS CloudFormation , resources are named *resource instances* .)
 *
 * > When you create a resource definition, you can optionally include an initial resource definition version. To associate a resource definition version later, create an [`AWS::Greengrass::ResourceDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinitionversion.html) resource and specify the ID of this resource definition.
 * >
 * > After you create the resource definition version that contains the resources you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::ResourceDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html
 */
export class CfnResourceDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::ResourceDefinition";

  /**
   * Build a CfnResourceDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `ResourceDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/resources/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `ResourceDefinition` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `ResourceDefinitionVersion` that was added to the `ResourceDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/resources/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the `ResourceDefinition` , such as `MyResourceDefinition` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The resource definition version to include when the resource definition is created.
   */
  public initialVersion?: cdk.IResolvable | CfnResourceDefinition.ResourceDefinitionVersionProperty;

  /**
   * The name of the resource definition.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the resource definition.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceDefinitionProps) {
    super(scope, id, {
      "type": CfnResourceDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::ResourceDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnResourceDefinition {
  /**
   * A resource definition version contains a list of resources. (In AWS CloudFormation , resources are named *resource instances* .).
   *
   * > After you create a resource definition version that contains the resources you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
   *
   * In an AWS CloudFormation template, `ResourceDefinitionVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::ResourceDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedefinitionversion.html
   */
  export interface ResourceDefinitionVersionProperty {
    /**
     * The resources in this version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedefinitionversion.html#cfn-greengrass-resourcedefinition-resourcedefinitionversion-resources
     */
    readonly resources: Array<cdk.IResolvable | CfnResourceDefinition.ResourceInstanceProperty> | cdk.IResolvable;
  }

  /**
   * A local resource, machine learning resource, or secret resource.
   *
   * For more information, see [Access Local Resources with Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-local-resources.html) , [Perform Machine Learning Inference](https://docs.aws.amazon.com/greengrass/v1/developerguide/ml-inference.html) , and [Deploy Secrets to the AWS IoT Greengrass Core](https://docs.aws.amazon.com/greengrass/v1/developerguide/secrets.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Resources` property of the [`AWS::Greengrass::ResourceDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html) resource contains a list of `ResourceInstance` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourceinstance.html
   */
  export interface ResourceInstanceProperty {
    /**
     * A descriptive or arbitrary ID for the resource.
     *
     * This value must be unique within the resource definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourceinstance.html#cfn-greengrass-resourcedefinition-resourceinstance-id
     */
    readonly id: string;

    /**
     * The descriptive resource name, which is displayed on the AWS IoT Greengrass console.
     *
     * Maximum length 128 characters with pattern [a-zA-Z0-9:_-]+. This must be unique within a Greengrass group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourceinstance.html#cfn-greengrass-resourcedefinition-resourceinstance-name
     */
    readonly name: string;

    /**
     * A container for resource data.
     *
     * The container takes only one of the following supported resource data types: `LocalDeviceResourceData` , `LocalVolumeResourceData` , `SageMakerMachineLearningModelResourceData` , `S3MachineLearningModelResourceData` , or `SecretsManagerSecretResourceData` .
     *
     * > Only one resource type can be defined for a `ResourceDataContainer` instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourceinstance.html#cfn-greengrass-resourcedefinition-resourceinstance-resourcedatacontainer
     */
    readonly resourceDataContainer: cdk.IResolvable | CfnResourceDefinition.ResourceDataContainerProperty;
  }

  /**
   * A container for resource data, which defines the resource type.
   *
   * The container takes only one of the following supported resource data types: `LocalDeviceResourceData` , `LocalVolumeResourceData` , `SageMakerMachineLearningModelResourceData` , `S3MachineLearningModelResourceData` , or `SecretsManagerSecretResourceData` .
   *
   * > Only one resource type can be defined for a `ResourceDataContainer` instance.
   *
   * In an AWS CloudFormation template, `ResourceDataContainer` is a property of the [`ResourceInstance`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourceinstance.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html
   */
  export interface ResourceDataContainerProperty {
    /**
     * Settings for a local device resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html#cfn-greengrass-resourcedefinition-resourcedatacontainer-localdeviceresourcedata
     */
    readonly localDeviceResourceData?: cdk.IResolvable | CfnResourceDefinition.LocalDeviceResourceDataProperty;

    /**
     * Settings for a local volume resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html#cfn-greengrass-resourcedefinition-resourcedatacontainer-localvolumeresourcedata
     */
    readonly localVolumeResourceData?: cdk.IResolvable | CfnResourceDefinition.LocalVolumeResourceDataProperty;

    /**
     * Settings for a machine learning resource stored in Amazon S3 .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html#cfn-greengrass-resourcedefinition-resourcedatacontainer-s3machinelearningmodelresourcedata
     */
    readonly s3MachineLearningModelResourceData?: cdk.IResolvable | CfnResourceDefinition.S3MachineLearningModelResourceDataProperty;

    /**
     * Settings for a machine learning resource saved as an SageMaker training job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html#cfn-greengrass-resourcedefinition-resourcedatacontainer-sagemakermachinelearningmodelresourcedata
     */
    readonly sageMakerMachineLearningModelResourceData?: cdk.IResolvable | CfnResourceDefinition.SageMakerMachineLearningModelResourceDataProperty;

    /**
     * Settings for a secret resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html#cfn-greengrass-resourcedefinition-resourcedatacontainer-secretsmanagersecretresourcedata
     */
    readonly secretsManagerSecretResourceData?: cdk.IResolvable | CfnResourceDefinition.SecretsManagerSecretResourceDataProperty;
  }

  /**
   * Settings for a secret resource, which references a secret from AWS Secrets Manager .
   *
   * AWS IoT Greengrass stores a local, encrypted copy of the secret on the Greengrass core, where it can be securely accessed by connectors and Lambda functions. For more information, see [Deploy Secrets to the AWS IoT Greengrass Core](https://docs.aws.amazon.com/greengrass/v1/developerguide/secrets.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `SecretsManagerSecretResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-secretsmanagersecretresourcedata.html
   */
  export interface SecretsManagerSecretResourceDataProperty {
    /**
     * The staging labels whose values you want to make available on the core, in addition to `AWSCURRENT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-secretsmanagersecretresourcedata.html#cfn-greengrass-resourcedefinition-secretsmanagersecretresourcedata-additionalstaginglabelstodownload
     */
    readonly additionalStagingLabelsToDownload?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of the Secrets Manager secret to make available on the core.
     *
     * The value of the secret's latest version (represented by the `AWSCURRENT` staging label) is included by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-secretsmanagersecretresourcedata.html#cfn-greengrass-resourcedefinition-secretsmanagersecretresourcedata-arn
     */
    readonly arn: string;
  }

  /**
   * Settings for an Secrets Manager machine learning resource.
   *
   * For more information, see [Perform Machine Learning Inference](https://docs.aws.amazon.com/greengrass/v1/developerguide/ml-inference.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `SageMakerMachineLearningModelResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata.html
   */
  export interface SageMakerMachineLearningModelResourceDataProperty {
    /**
     * The absolute local path of the resource inside the Lambda environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata-destinationpath
     */
    readonly destinationPath: string;

    /**
     * The owner setting for the downloaded machine learning resource.
     *
     * For more information, see [Access Machine Learning Resources from Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-ml-resources.html) in the *Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata-ownersetting
     */
    readonly ownerSetting?: cdk.IResolvable | CfnResourceDefinition.ResourceDownloadOwnerSettingProperty;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SageMaker training job that represents the source model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata-sagemakerjobarn
     */
    readonly sageMakerJobArn: string;
  }

  /**
   * The owner setting for a downloaded machine learning resource.
   *
   * For more information, see [Access Machine Learning Resources from Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-ml-resources.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `ResourceDownloadOwnerSetting` is the property type of the `OwnerSetting` property for the [`S3MachineLearningModelResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-s3machinelearningmodelresourcedata.html) and [`SageMakerMachineLearningModelResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-sagemakermachinelearningmodelresourcedata.html) property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedownloadownersetting.html
   */
  export interface ResourceDownloadOwnerSettingProperty {
    /**
     * The group owner of the machine learning resource.
     *
     * This is the group ID (GID) of an existing Linux OS group on the system. The group's permissions are added to the Lambda process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedownloadownersetting.html#cfn-greengrass-resourcedefinition-resourcedownloadownersetting-groupowner
     */
    readonly groupOwner: string;

    /**
     * The permissions that the group owner has to the machine learning resource.
     *
     * Valid values are `rw` (read-write) or `ro` (read-only).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedownloadownersetting.html#cfn-greengrass-resourcedefinition-resourcedownloadownersetting-grouppermission
     */
    readonly groupPermission: string;
  }

  /**
   * Settings for a local volume resource, which represents a file or directory on the root file system.
   *
   * For more information, see [Access Local Resources with Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-local-resources.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `LocalVolumeResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localvolumeresourcedata.html
   */
  export interface LocalVolumeResourceDataProperty {
    /**
     * The absolute local path of the resource in the Lambda environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localvolumeresourcedata.html#cfn-greengrass-resourcedefinition-localvolumeresourcedata-destinationpath
     */
    readonly destinationPath: string;

    /**
     * Settings that define additional Linux OS group permissions to give to the Lambda function process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localvolumeresourcedata.html#cfn-greengrass-resourcedefinition-localvolumeresourcedata-groupownersetting
     */
    readonly groupOwnerSetting?: CfnResourceDefinition.GroupOwnerSettingProperty | cdk.IResolvable;

    /**
     * The local absolute path of the volume resource on the host.
     *
     * The source path for a volume resource type cannot start with `/sys` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localvolumeresourcedata.html#cfn-greengrass-resourcedefinition-localvolumeresourcedata-sourcepath
     */
    readonly sourcePath: string;
  }

  /**
   * Settings that define additional Linux OS group permissions to give to the Lambda function process.
   *
   * You can give the permissions of the Linux group that owns the resource or choose another Linux group. These permissions are in addition to the function's `RunAs` permissions.
   *
   * In an AWS CloudFormation template, `GroupOwnerSetting` is a property of the [`LocalDeviceResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localdeviceresourcedata.html) and [`LocalVolumeResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localvolumeresourcedata.html) property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-groupownersetting.html
   */
  export interface GroupOwnerSettingProperty {
    /**
     * Indicates whether to give the privileges of the Linux group that owns the resource to the Lambda process.
     *
     * This gives the Lambda process the file access permissions of the Linux group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-groupownersetting.html#cfn-greengrass-resourcedefinition-groupownersetting-autoaddgroupowner
     */
    readonly autoAddGroupOwner: boolean | cdk.IResolvable;

    /**
     * The name of the Linux group whose privileges you want to add to the Lambda process.
     *
     * This value is ignored if `AutoAddGroupOwner` is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-groupownersetting.html#cfn-greengrass-resourcedefinition-groupownersetting-groupowner
     */
    readonly groupOwner?: string;
  }

  /**
   * Settings for a local device resource, which represents a file under `/dev` .
   *
   * For more information, see [Access Local Resources with Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-local-resources.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `LocalDeviceResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localdeviceresourcedata.html
   */
  export interface LocalDeviceResourceDataProperty {
    /**
     * Settings that define additional Linux OS group permissions to give to the Lambda function process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localdeviceresourcedata.html#cfn-greengrass-resourcedefinition-localdeviceresourcedata-groupownersetting
     */
    readonly groupOwnerSetting?: CfnResourceDefinition.GroupOwnerSettingProperty | cdk.IResolvable;

    /**
     * The local absolute path of the device resource.
     *
     * The source path for a device resource can refer only to a character device or block device under `/dev` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-localdeviceresourcedata.html#cfn-greengrass-resourcedefinition-localdeviceresourcedata-sourcepath
     */
    readonly sourcePath: string;
  }

  /**
   * Settings for an Amazon S3 machine learning resource.
   *
   * For more information, see [Perform Machine Learning Inference](https://docs.aws.amazon.com/greengrass/v1/developerguide/ml-inference.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `S3MachineLearningModelResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-s3machinelearningmodelresourcedata.html
   */
  export interface S3MachineLearningModelResourceDataProperty {
    /**
     * The absolute local path of the resource inside the Lambda environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-s3machinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinition-s3machinelearningmodelresourcedata-destinationpath
     */
    readonly destinationPath: string;

    /**
     * The owner setting for the downloaded machine learning resource.
     *
     * For more information, see [Access Machine Learning Resources from Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-ml-resources.html) in the *Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-s3machinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinition-s3machinelearningmodelresourcedata-ownersetting
     */
    readonly ownerSetting?: cdk.IResolvable | CfnResourceDefinition.ResourceDownloadOwnerSettingProperty;

    /**
     * The URI of the source model in an Amazon S3 bucket.
     *
     * The model package must be in `tar.gz` or `.zip` format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-s3machinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinition-s3machinelearningmodelresourcedata-s3uri
     */
    readonly s3Uri: string;
  }
}

/**
 * Properties for defining a `CfnResourceDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html
 */
export interface CfnResourceDefinitionProps {
  /**
   * The resource definition version to include when the resource definition is created.
   *
   * A resource definition version contains a list of [`resource instance`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinition-resourceinstance.html) property types.
   *
   * > To associate a resource definition version after the resource definition is created, create an [`AWS::Greengrass::ResourceDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinitionversion.html) resource and specify the ID of this resource definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html#cfn-greengrass-resourcedefinition-initialversion
   */
  readonly initialVersion?: cdk.IResolvable | CfnResourceDefinition.ResourceDefinitionVersionProperty;

  /**
   * The name of the resource definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html#cfn-greengrass-resourcedefinition-name
   */
  readonly name: string;

  /**
   * Application-specific metadata to attach to the resource definition.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html#cfn-greengrass-resourcedefinition-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `SecretsManagerSecretResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `SecretsManagerSecretResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionSecretsManagerSecretResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("additionalStagingLabelsToDownload", cdk.listValidator(cdk.validateString))(properties.additionalStagingLabelsToDownload));
  return errors.wrap("supplied properties not correct for \"SecretsManagerSecretResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionSecretsManagerSecretResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionSecretsManagerSecretResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "ARN": cdk.stringToCloudFormation(properties.arn),
    "AdditionalStagingLabelsToDownload": cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalStagingLabelsToDownload)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionSecretsManagerSecretResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.SecretsManagerSecretResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.SecretsManagerSecretResourceDataProperty>();
  ret.addPropertyResult("additionalStagingLabelsToDownload", "AdditionalStagingLabelsToDownload", (properties.AdditionalStagingLabelsToDownload != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdditionalStagingLabelsToDownload) : undefined));
  ret.addPropertyResult("arn", "ARN", (properties.ARN != null ? cfn_parse.FromCloudFormation.getString(properties.ARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceDownloadOwnerSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceDownloadOwnerSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionResourceDownloadOwnerSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupOwner", cdk.requiredValidator)(properties.groupOwner));
  errors.collect(cdk.propertyValidator("groupOwner", cdk.validateString)(properties.groupOwner));
  errors.collect(cdk.propertyValidator("groupPermission", cdk.requiredValidator)(properties.groupPermission));
  errors.collect(cdk.propertyValidator("groupPermission", cdk.validateString)(properties.groupPermission));
  return errors.wrap("supplied properties not correct for \"ResourceDownloadOwnerSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionResourceDownloadOwnerSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionResourceDownloadOwnerSettingPropertyValidator(properties).assertSuccess();
  return {
    "GroupOwner": cdk.stringToCloudFormation(properties.groupOwner),
    "GroupPermission": cdk.stringToCloudFormation(properties.groupPermission)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionResourceDownloadOwnerSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.ResourceDownloadOwnerSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.ResourceDownloadOwnerSettingProperty>();
  ret.addPropertyResult("groupOwner", "GroupOwner", (properties.GroupOwner != null ? cfn_parse.FromCloudFormation.getString(properties.GroupOwner) : undefined));
  ret.addPropertyResult("groupPermission", "GroupPermission", (properties.GroupPermission != null ? cfn_parse.FromCloudFormation.getString(properties.GroupPermission) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SageMakerMachineLearningModelResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerMachineLearningModelResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionSageMakerMachineLearningModelResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPath", cdk.requiredValidator)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("destinationPath", cdk.validateString)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("ownerSetting", CfnResourceDefinitionResourceDownloadOwnerSettingPropertyValidator)(properties.ownerSetting));
  errors.collect(cdk.propertyValidator("sageMakerJobArn", cdk.requiredValidator)(properties.sageMakerJobArn));
  errors.collect(cdk.propertyValidator("sageMakerJobArn", cdk.validateString)(properties.sageMakerJobArn));
  return errors.wrap("supplied properties not correct for \"SageMakerMachineLearningModelResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionSageMakerMachineLearningModelResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionSageMakerMachineLearningModelResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "DestinationPath": cdk.stringToCloudFormation(properties.destinationPath),
    "OwnerSetting": convertCfnResourceDefinitionResourceDownloadOwnerSettingPropertyToCloudFormation(properties.ownerSetting),
    "SageMakerJobArn": cdk.stringToCloudFormation(properties.sageMakerJobArn)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionSageMakerMachineLearningModelResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.SageMakerMachineLearningModelResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.SageMakerMachineLearningModelResourceDataProperty>();
  ret.addPropertyResult("destinationPath", "DestinationPath", (properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined));
  ret.addPropertyResult("ownerSetting", "OwnerSetting", (properties.OwnerSetting != null ? CfnResourceDefinitionResourceDownloadOwnerSettingPropertyFromCloudFormation(properties.OwnerSetting) : undefined));
  ret.addPropertyResult("sageMakerJobArn", "SageMakerJobArn", (properties.SageMakerJobArn != null ? cfn_parse.FromCloudFormation.getString(properties.SageMakerJobArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GroupOwnerSettingProperty`
 *
 * @param properties - the TypeScript properties of a `GroupOwnerSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionGroupOwnerSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoAddGroupOwner", cdk.requiredValidator)(properties.autoAddGroupOwner));
  errors.collect(cdk.propertyValidator("autoAddGroupOwner", cdk.validateBoolean)(properties.autoAddGroupOwner));
  errors.collect(cdk.propertyValidator("groupOwner", cdk.validateString)(properties.groupOwner));
  return errors.wrap("supplied properties not correct for \"GroupOwnerSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionGroupOwnerSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionGroupOwnerSettingPropertyValidator(properties).assertSuccess();
  return {
    "AutoAddGroupOwner": cdk.booleanToCloudFormation(properties.autoAddGroupOwner),
    "GroupOwner": cdk.stringToCloudFormation(properties.groupOwner)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionGroupOwnerSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDefinition.GroupOwnerSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.GroupOwnerSettingProperty>();
  ret.addPropertyResult("autoAddGroupOwner", "AutoAddGroupOwner", (properties.AutoAddGroupOwner != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoAddGroupOwner) : undefined));
  ret.addPropertyResult("groupOwner", "GroupOwner", (properties.GroupOwner != null ? cfn_parse.FromCloudFormation.getString(properties.GroupOwner) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocalVolumeResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `LocalVolumeResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionLocalVolumeResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPath", cdk.requiredValidator)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("destinationPath", cdk.validateString)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("groupOwnerSetting", CfnResourceDefinitionGroupOwnerSettingPropertyValidator)(properties.groupOwnerSetting));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.requiredValidator)(properties.sourcePath));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"LocalVolumeResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionLocalVolumeResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionLocalVolumeResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "DestinationPath": cdk.stringToCloudFormation(properties.destinationPath),
    "GroupOwnerSetting": convertCfnResourceDefinitionGroupOwnerSettingPropertyToCloudFormation(properties.groupOwnerSetting),
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionLocalVolumeResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.LocalVolumeResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.LocalVolumeResourceDataProperty>();
  ret.addPropertyResult("destinationPath", "DestinationPath", (properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined));
  ret.addPropertyResult("groupOwnerSetting", "GroupOwnerSetting", (properties.GroupOwnerSetting != null ? CfnResourceDefinitionGroupOwnerSettingPropertyFromCloudFormation(properties.GroupOwnerSetting) : undefined));
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocalDeviceResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `LocalDeviceResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionLocalDeviceResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupOwnerSetting", CfnResourceDefinitionGroupOwnerSettingPropertyValidator)(properties.groupOwnerSetting));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.requiredValidator)(properties.sourcePath));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"LocalDeviceResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionLocalDeviceResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionLocalDeviceResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "GroupOwnerSetting": convertCfnResourceDefinitionGroupOwnerSettingPropertyToCloudFormation(properties.groupOwnerSetting),
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionLocalDeviceResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.LocalDeviceResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.LocalDeviceResourceDataProperty>();
  ret.addPropertyResult("groupOwnerSetting", "GroupOwnerSetting", (properties.GroupOwnerSetting != null ? CfnResourceDefinitionGroupOwnerSettingPropertyFromCloudFormation(properties.GroupOwnerSetting) : undefined));
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3MachineLearningModelResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `S3MachineLearningModelResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionS3MachineLearningModelResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPath", cdk.requiredValidator)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("destinationPath", cdk.validateString)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("ownerSetting", CfnResourceDefinitionResourceDownloadOwnerSettingPropertyValidator)(properties.ownerSetting));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.requiredValidator)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.validateString)(properties.s3Uri));
  return errors.wrap("supplied properties not correct for \"S3MachineLearningModelResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionS3MachineLearningModelResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionS3MachineLearningModelResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "DestinationPath": cdk.stringToCloudFormation(properties.destinationPath),
    "OwnerSetting": convertCfnResourceDefinitionResourceDownloadOwnerSettingPropertyToCloudFormation(properties.ownerSetting),
    "S3Uri": cdk.stringToCloudFormation(properties.s3Uri)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionS3MachineLearningModelResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.S3MachineLearningModelResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.S3MachineLearningModelResourceDataProperty>();
  ret.addPropertyResult("destinationPath", "DestinationPath", (properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined));
  ret.addPropertyResult("ownerSetting", "OwnerSetting", (properties.OwnerSetting != null ? CfnResourceDefinitionResourceDownloadOwnerSettingPropertyFromCloudFormation(properties.OwnerSetting) : undefined));
  ret.addPropertyResult("s3Uri", "S3Uri", (properties.S3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.S3Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceDataContainerProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceDataContainerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionResourceDataContainerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("localDeviceResourceData", CfnResourceDefinitionLocalDeviceResourceDataPropertyValidator)(properties.localDeviceResourceData));
  errors.collect(cdk.propertyValidator("localVolumeResourceData", CfnResourceDefinitionLocalVolumeResourceDataPropertyValidator)(properties.localVolumeResourceData));
  errors.collect(cdk.propertyValidator("s3MachineLearningModelResourceData", CfnResourceDefinitionS3MachineLearningModelResourceDataPropertyValidator)(properties.s3MachineLearningModelResourceData));
  errors.collect(cdk.propertyValidator("sageMakerMachineLearningModelResourceData", CfnResourceDefinitionSageMakerMachineLearningModelResourceDataPropertyValidator)(properties.sageMakerMachineLearningModelResourceData));
  errors.collect(cdk.propertyValidator("secretsManagerSecretResourceData", CfnResourceDefinitionSecretsManagerSecretResourceDataPropertyValidator)(properties.secretsManagerSecretResourceData));
  return errors.wrap("supplied properties not correct for \"ResourceDataContainerProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionResourceDataContainerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionResourceDataContainerPropertyValidator(properties).assertSuccess();
  return {
    "LocalDeviceResourceData": convertCfnResourceDefinitionLocalDeviceResourceDataPropertyToCloudFormation(properties.localDeviceResourceData),
    "LocalVolumeResourceData": convertCfnResourceDefinitionLocalVolumeResourceDataPropertyToCloudFormation(properties.localVolumeResourceData),
    "S3MachineLearningModelResourceData": convertCfnResourceDefinitionS3MachineLearningModelResourceDataPropertyToCloudFormation(properties.s3MachineLearningModelResourceData),
    "SageMakerMachineLearningModelResourceData": convertCfnResourceDefinitionSageMakerMachineLearningModelResourceDataPropertyToCloudFormation(properties.sageMakerMachineLearningModelResourceData),
    "SecretsManagerSecretResourceData": convertCfnResourceDefinitionSecretsManagerSecretResourceDataPropertyToCloudFormation(properties.secretsManagerSecretResourceData)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionResourceDataContainerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.ResourceDataContainerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.ResourceDataContainerProperty>();
  ret.addPropertyResult("localDeviceResourceData", "LocalDeviceResourceData", (properties.LocalDeviceResourceData != null ? CfnResourceDefinitionLocalDeviceResourceDataPropertyFromCloudFormation(properties.LocalDeviceResourceData) : undefined));
  ret.addPropertyResult("localVolumeResourceData", "LocalVolumeResourceData", (properties.LocalVolumeResourceData != null ? CfnResourceDefinitionLocalVolumeResourceDataPropertyFromCloudFormation(properties.LocalVolumeResourceData) : undefined));
  ret.addPropertyResult("s3MachineLearningModelResourceData", "S3MachineLearningModelResourceData", (properties.S3MachineLearningModelResourceData != null ? CfnResourceDefinitionS3MachineLearningModelResourceDataPropertyFromCloudFormation(properties.S3MachineLearningModelResourceData) : undefined));
  ret.addPropertyResult("sageMakerMachineLearningModelResourceData", "SageMakerMachineLearningModelResourceData", (properties.SageMakerMachineLearningModelResourceData != null ? CfnResourceDefinitionSageMakerMachineLearningModelResourceDataPropertyFromCloudFormation(properties.SageMakerMachineLearningModelResourceData) : undefined));
  ret.addPropertyResult("secretsManagerSecretResourceData", "SecretsManagerSecretResourceData", (properties.SecretsManagerSecretResourceData != null ? CfnResourceDefinitionSecretsManagerSecretResourceDataPropertyFromCloudFormation(properties.SecretsManagerSecretResourceData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceInstanceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceInstanceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionResourceInstancePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resourceDataContainer", cdk.requiredValidator)(properties.resourceDataContainer));
  errors.collect(cdk.propertyValidator("resourceDataContainer", CfnResourceDefinitionResourceDataContainerPropertyValidator)(properties.resourceDataContainer));
  return errors.wrap("supplied properties not correct for \"ResourceInstanceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionResourceInstancePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionResourceInstancePropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResourceDataContainer": convertCfnResourceDefinitionResourceDataContainerPropertyToCloudFormation(properties.resourceDataContainer)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionResourceInstancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.ResourceInstanceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.ResourceInstanceProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resourceDataContainer", "ResourceDataContainer", (properties.ResourceDataContainer != null ? CfnResourceDefinitionResourceDataContainerPropertyFromCloudFormation(properties.ResourceDataContainer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceDefinitionVersionProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceDefinitionVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionResourceDefinitionVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resources", cdk.requiredValidator)(properties.resources));
  errors.collect(cdk.propertyValidator("resources", cdk.listValidator(CfnResourceDefinitionResourceInstancePropertyValidator))(properties.resources));
  return errors.wrap("supplied properties not correct for \"ResourceDefinitionVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionResourceDefinitionVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionResourceDefinitionVersionPropertyValidator(properties).assertSuccess();
  return {
    "Resources": cdk.listMapper(convertCfnResourceDefinitionResourceInstancePropertyToCloudFormation)(properties.resources)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionResourceDefinitionVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinition.ResourceDefinitionVersionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinition.ResourceDefinitionVersionProperty>();
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? cfn_parse.FromCloudFormation.getArray(CfnResourceDefinitionResourceInstancePropertyFromCloudFormation)(properties.Resources) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResourceDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnResourceDefinitionResourceDefinitionVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnResourceDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnResourceDefinitionResourceDefinitionVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnResourceDefinitionResourceDefinitionVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::ResourceDefinitionVersion` resource represents a resource definition version for AWS IoT Greengrass .
 *
 * A resource definition version contains a list of resources. (In AWS CloudFormation , resources are named *resource instances* .)
 *
 * > To create a resource definition version, you must specify the ID of the resource definition that you want to associate with the version. For information about creating a resource definition, see [`AWS::Greengrass::ResourceDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinition.html) .
 * >
 * > After you create a resource definition version that contains the resources you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::ResourceDefinitionVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinitionversion.html
 */
export class CfnResourceDefinitionVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::ResourceDefinitionVersion";

  /**
   * Build a CfnResourceDefinitionVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceDefinitionVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceDefinitionVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceDefinitionVersion(scope, id, propsResult.value);
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
   * The ID of the resource definition associated with this version.
   */
  public resourceDefinitionId: string;

  /**
   * The resources in this version.
   */
  public resources: Array<cdk.IResolvable | CfnResourceDefinitionVersion.ResourceInstanceProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceDefinitionVersionProps) {
    super(scope, id, {
      "type": CfnResourceDefinitionVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceDefinitionId", this);
    cdk.requireProperty(props, "resources", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.resourceDefinitionId = props.resourceDefinitionId;
    this.resources = props.resources;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "resourceDefinitionId": this.resourceDefinitionId,
      "resources": this.resources
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceDefinitionVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceDefinitionVersionPropsToCloudFormation(props);
  }
}

export namespace CfnResourceDefinitionVersion {
  /**
   * A local resource, machine learning resource, or secret resource.
   *
   * For more information, see [Access Local Resources with Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-local-resources.html) , [Perform Machine Learning Inference](https://docs.aws.amazon.com/greengrass/v1/developerguide/ml-inference.html) , and [Deploy Secrets to the AWS IoT Greengrass Core](https://docs.aws.amazon.com/greengrass/v1/developerguide/secrets.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, the `Resources` property of the [`AWS::Greengrass::ResourceDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinitionversion.html) resource contains a list of `ResourceInstance` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html
   */
  export interface ResourceInstanceProperty {
    /**
     * A descriptive or arbitrary ID for the resource.
     *
     * This value must be unique within the resource definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html#cfn-greengrass-resourcedefinitionversion-resourceinstance-id
     */
    readonly id: string;

    /**
     * The descriptive resource name, which is displayed on the AWS IoT Greengrass console.
     *
     * Maximum length 128 characters with pattern [a-zA-Z0-9:_-]+. This must be unique within a Greengrass group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html#cfn-greengrass-resourcedefinitionversion-resourceinstance-name
     */
    readonly name: string;

    /**
     * A container for resource data.
     *
     * The container takes only one of the following supported resource data types: `LocalDeviceResourceData` , `LocalVolumeResourceData` , `SageMakerMachineLearningModelResourceData` , `S3MachineLearningModelResourceData` , or `SecretsManagerSecretResourceData` .
     *
     * > Only one resource type can be defined for a `ResourceDataContainer` instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html#cfn-greengrass-resourcedefinitionversion-resourceinstance-resourcedatacontainer
     */
    readonly resourceDataContainer: cdk.IResolvable | CfnResourceDefinitionVersion.ResourceDataContainerProperty;
  }

  /**
   * A container for resource data, which defines the resource type.
   *
   * The container takes only one of the following supported resource data types: `LocalDeviceResourceData` , `LocalVolumeResourceData` , `SageMakerMachineLearningModelResourceData` , `S3MachineLearningModelResourceData` , or `SecretsManagerSecretResourceData` .
   *
   * > Only one resource type can be defined for a `ResourceDataContainer` instance.
   *
   * In an AWS CloudFormation template, `ResourceDataContainer` is a property of the [`ResourceInstance`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourceinstance.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html
   */
  export interface ResourceDataContainerProperty {
    /**
     * Settings for a local device resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html#cfn-greengrass-resourcedefinitionversion-resourcedatacontainer-localdeviceresourcedata
     */
    readonly localDeviceResourceData?: cdk.IResolvable | CfnResourceDefinitionVersion.LocalDeviceResourceDataProperty;

    /**
     * Settings for a local volume resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html#cfn-greengrass-resourcedefinitionversion-resourcedatacontainer-localvolumeresourcedata
     */
    readonly localVolumeResourceData?: cdk.IResolvable | CfnResourceDefinitionVersion.LocalVolumeResourceDataProperty;

    /**
     * Settings for a machine learning resource stored in Amazon S3 .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html#cfn-greengrass-resourcedefinitionversion-resourcedatacontainer-s3machinelearningmodelresourcedata
     */
    readonly s3MachineLearningModelResourceData?: cdk.IResolvable | CfnResourceDefinitionVersion.S3MachineLearningModelResourceDataProperty;

    /**
     * Settings for a machine learning resource saved as an SageMaker training job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html#cfn-greengrass-resourcedefinitionversion-resourcedatacontainer-sagemakermachinelearningmodelresourcedata
     */
    readonly sageMakerMachineLearningModelResourceData?: cdk.IResolvable | CfnResourceDefinitionVersion.SageMakerMachineLearningModelResourceDataProperty;

    /**
     * Settings for a secret resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html#cfn-greengrass-resourcedefinitionversion-resourcedatacontainer-secretsmanagersecretresourcedata
     */
    readonly secretsManagerSecretResourceData?: cdk.IResolvable | CfnResourceDefinitionVersion.SecretsManagerSecretResourceDataProperty;
  }

  /**
   * Settings for a secret resource, which references a secret from AWS Secrets Manager .
   *
   * AWS IoT Greengrass stores a local, encrypted copy of the secret on the Greengrass core, where it can be securely accessed by connectors and Lambda functions. For more information, see [Deploy Secrets to the AWS IoT Greengrass Core](https://docs.aws.amazon.com/greengrass/v1/developerguide/secrets.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `SecretsManagerSecretResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-secretsmanagersecretresourcedata.html
   */
  export interface SecretsManagerSecretResourceDataProperty {
    /**
     * The staging labels whose values you want to make available on the core, in addition to `AWSCURRENT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-secretsmanagersecretresourcedata.html#cfn-greengrass-resourcedefinitionversion-secretsmanagersecretresourcedata-additionalstaginglabelstodownload
     */
    readonly additionalStagingLabelsToDownload?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of the Secrets Manager secret to make available on the core.
     *
     * The value of the secret's latest version (represented by the `AWSCURRENT` staging label) is included by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-secretsmanagersecretresourcedata.html#cfn-greengrass-resourcedefinitionversion-secretsmanagersecretresourcedata-arn
     */
    readonly arn: string;
  }

  /**
   * Settings for an Secrets Manager machine learning resource.
   *
   * For more information, see [Perform Machine Learning Inference](https://docs.aws.amazon.com/greengrass/v1/developerguide/ml-inference.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `SageMakerMachineLearningModelResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata.html
   */
  export interface SageMakerMachineLearningModelResourceDataProperty {
    /**
     * The absolute local path of the resource inside the Lambda environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata-destinationpath
     */
    readonly destinationPath: string;

    /**
     * The owner setting for the downloaded machine learning resource.
     *
     * For more information, see [Access Machine Learning Resources from Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-ml-resources.html) in the *Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata-ownersetting
     */
    readonly ownerSetting?: cdk.IResolvable | CfnResourceDefinitionVersion.ResourceDownloadOwnerSettingProperty;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SageMaker training job that represents the source model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata-sagemakerjobarn
     */
    readonly sageMakerJobArn: string;
  }

  /**
   * The owner setting for a downloaded machine learning resource.
   *
   * For more information, see [Access Machine Learning Resources from Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-ml-resources.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `ResourceDownloadOwnerSetting` is the property type of the `OwnerSetting` property for the [`S3MachineLearningModelResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata.html) and [`SageMakerMachineLearningModelResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-sagemakermachinelearningmodelresourcedata.html) property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedownloadownersetting.html
   */
  export interface ResourceDownloadOwnerSettingProperty {
    /**
     * The group owner of the machine learning resource.
     *
     * This is the group ID (GID) of an existing Linux OS group on the system. The group's permissions are added to the Lambda process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedownloadownersetting.html#cfn-greengrass-resourcedefinitionversion-resourcedownloadownersetting-groupowner
     */
    readonly groupOwner: string;

    /**
     * The permissions that the group owner has to the machine learning resource.
     *
     * Valid values are `rw` (read-write) or `ro` (read-only).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedownloadownersetting.html#cfn-greengrass-resourcedefinitionversion-resourcedownloadownersetting-grouppermission
     */
    readonly groupPermission: string;
  }

  /**
   * Settings for a local volume resource, which represents a file or directory on the root file system.
   *
   * For more information, see [Access Local Resources with Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-local-resources.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `LocalVolumeResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localvolumeresourcedata.html
   */
  export interface LocalVolumeResourceDataProperty {
    /**
     * The absolute local path of the resource in the Lambda environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localvolumeresourcedata.html#cfn-greengrass-resourcedefinitionversion-localvolumeresourcedata-destinationpath
     */
    readonly destinationPath: string;

    /**
     * Settings that define additional Linux OS group permissions to give to the Lambda function process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localvolumeresourcedata.html#cfn-greengrass-resourcedefinitionversion-localvolumeresourcedata-groupownersetting
     */
    readonly groupOwnerSetting?: CfnResourceDefinitionVersion.GroupOwnerSettingProperty | cdk.IResolvable;

    /**
     * The local absolute path of the volume resource on the host.
     *
     * The source path for a volume resource type cannot start with `/sys` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localvolumeresourcedata.html#cfn-greengrass-resourcedefinitionversion-localvolumeresourcedata-sourcepath
     */
    readonly sourcePath: string;
  }

  /**
   * Settings that define additional Linux OS group permissions to give to the Lambda function process.
   *
   * You can give the permissions of the Linux group that owns the resource or choose another Linux group. These permissions are in addition to the function's `RunAs` permissions.
   *
   * In an AWS CloudFormation template, `GroupOwnerSetting` is a property of the [`LocalDeviceResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localdeviceresourcedata.html) and [`LocalVolumeResourceData`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localvolumeresourcedata.html) property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-groupownersetting.html
   */
  export interface GroupOwnerSettingProperty {
    /**
     * Indicates whether to give the privileges of the Linux group that owns the resource to the Lambda process.
     *
     * This gives the Lambda process the file access permissions of the Linux group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-groupownersetting.html#cfn-greengrass-resourcedefinitionversion-groupownersetting-autoaddgroupowner
     */
    readonly autoAddGroupOwner: boolean | cdk.IResolvable;

    /**
     * The name of the Linux group whose privileges you want to add to the Lambda process.
     *
     * This value is ignored if `AutoAddGroupOwner` is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-groupownersetting.html#cfn-greengrass-resourcedefinitionversion-groupownersetting-groupowner
     */
    readonly groupOwner?: string;
  }

  /**
   * Settings for a local device resource, which represents a file under `/dev` .
   *
   * For more information, see [Access Local Resources with Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-local-resources.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `LocalDeviceResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localdeviceresourcedata.html
   */
  export interface LocalDeviceResourceDataProperty {
    /**
     * Settings that define additional Linux OS group permissions to give to the Lambda function process.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localdeviceresourcedata.html#cfn-greengrass-resourcedefinitionversion-localdeviceresourcedata-groupownersetting
     */
    readonly groupOwnerSetting?: CfnResourceDefinitionVersion.GroupOwnerSettingProperty | cdk.IResolvable;

    /**
     * The local absolute path of the device resource.
     *
     * The source path for a device resource can refer only to a character device or block device under `/dev` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-localdeviceresourcedata.html#cfn-greengrass-resourcedefinitionversion-localdeviceresourcedata-sourcepath
     */
    readonly sourcePath: string;
  }

  /**
   * Settings for an Amazon S3 machine learning resource.
   *
   * For more information, see [Perform Machine Learning Inference](https://docs.aws.amazon.com/greengrass/v1/developerguide/ml-inference.html) in the *Developer Guide* .
   *
   * In an AWS CloudFormation template, `S3MachineLearningModelResourceData` can be used in the [`ResourceDataContainer`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-resourcedatacontainer.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata.html
   */
  export interface S3MachineLearningModelResourceDataProperty {
    /**
     * The absolute local path of the resource inside the Lambda environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata-destinationpath
     */
    readonly destinationPath: string;

    /**
     * The owner setting for the downloaded machine learning resource.
     *
     * For more information, see [Access Machine Learning Resources from Lambda Functions](https://docs.aws.amazon.com/greengrass/v1/developerguide/access-ml-resources.html) in the *Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata-ownersetting
     */
    readonly ownerSetting?: cdk.IResolvable | CfnResourceDefinitionVersion.ResourceDownloadOwnerSettingProperty;

    /**
     * The URI of the source model in an Amazon S3 bucket.
     *
     * The model package must be in `tar.gz` or `.zip` format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata.html#cfn-greengrass-resourcedefinitionversion-s3machinelearningmodelresourcedata-s3uri
     */
    readonly s3Uri: string;
  }
}

/**
 * Properties for defining a `CfnResourceDefinitionVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinitionversion.html
 */
export interface CfnResourceDefinitionVersionProps {
  /**
   * The ID of the resource definition associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinitionversion.html#cfn-greengrass-resourcedefinitionversion-resourcedefinitionid
   */
  readonly resourceDefinitionId: string;

  /**
   * The resources in this version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-resourcedefinitionversion.html#cfn-greengrass-resourcedefinitionversion-resources
   */
  readonly resources: Array<cdk.IResolvable | CfnResourceDefinitionVersion.ResourceInstanceProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SecretsManagerSecretResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `SecretsManagerSecretResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionSecretsManagerSecretResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("additionalStagingLabelsToDownload", cdk.listValidator(cdk.validateString))(properties.additionalStagingLabelsToDownload));
  return errors.wrap("supplied properties not correct for \"SecretsManagerSecretResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionSecretsManagerSecretResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionSecretsManagerSecretResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "ARN": cdk.stringToCloudFormation(properties.arn),
    "AdditionalStagingLabelsToDownload": cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalStagingLabelsToDownload)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionSecretsManagerSecretResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.SecretsManagerSecretResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.SecretsManagerSecretResourceDataProperty>();
  ret.addPropertyResult("additionalStagingLabelsToDownload", "AdditionalStagingLabelsToDownload", (properties.AdditionalStagingLabelsToDownload != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdditionalStagingLabelsToDownload) : undefined));
  ret.addPropertyResult("arn", "ARN", (properties.ARN != null ? cfn_parse.FromCloudFormation.getString(properties.ARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceDownloadOwnerSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceDownloadOwnerSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupOwner", cdk.requiredValidator)(properties.groupOwner));
  errors.collect(cdk.propertyValidator("groupOwner", cdk.validateString)(properties.groupOwner));
  errors.collect(cdk.propertyValidator("groupPermission", cdk.requiredValidator)(properties.groupPermission));
  errors.collect(cdk.propertyValidator("groupPermission", cdk.validateString)(properties.groupPermission));
  return errors.wrap("supplied properties not correct for \"ResourceDownloadOwnerSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyValidator(properties).assertSuccess();
  return {
    "GroupOwner": cdk.stringToCloudFormation(properties.groupOwner),
    "GroupPermission": cdk.stringToCloudFormation(properties.groupPermission)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.ResourceDownloadOwnerSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.ResourceDownloadOwnerSettingProperty>();
  ret.addPropertyResult("groupOwner", "GroupOwner", (properties.GroupOwner != null ? cfn_parse.FromCloudFormation.getString(properties.GroupOwner) : undefined));
  ret.addPropertyResult("groupPermission", "GroupPermission", (properties.GroupPermission != null ? cfn_parse.FromCloudFormation.getString(properties.GroupPermission) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SageMakerMachineLearningModelResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerMachineLearningModelResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionSageMakerMachineLearningModelResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPath", cdk.requiredValidator)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("destinationPath", cdk.validateString)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("ownerSetting", CfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyValidator)(properties.ownerSetting));
  errors.collect(cdk.propertyValidator("sageMakerJobArn", cdk.requiredValidator)(properties.sageMakerJobArn));
  errors.collect(cdk.propertyValidator("sageMakerJobArn", cdk.validateString)(properties.sageMakerJobArn));
  return errors.wrap("supplied properties not correct for \"SageMakerMachineLearningModelResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionSageMakerMachineLearningModelResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionSageMakerMachineLearningModelResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "DestinationPath": cdk.stringToCloudFormation(properties.destinationPath),
    "OwnerSetting": convertCfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyToCloudFormation(properties.ownerSetting),
    "SageMakerJobArn": cdk.stringToCloudFormation(properties.sageMakerJobArn)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionSageMakerMachineLearningModelResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.SageMakerMachineLearningModelResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.SageMakerMachineLearningModelResourceDataProperty>();
  ret.addPropertyResult("destinationPath", "DestinationPath", (properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined));
  ret.addPropertyResult("ownerSetting", "OwnerSetting", (properties.OwnerSetting != null ? CfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyFromCloudFormation(properties.OwnerSetting) : undefined));
  ret.addPropertyResult("sageMakerJobArn", "SageMakerJobArn", (properties.SageMakerJobArn != null ? cfn_parse.FromCloudFormation.getString(properties.SageMakerJobArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GroupOwnerSettingProperty`
 *
 * @param properties - the TypeScript properties of a `GroupOwnerSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionGroupOwnerSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoAddGroupOwner", cdk.requiredValidator)(properties.autoAddGroupOwner));
  errors.collect(cdk.propertyValidator("autoAddGroupOwner", cdk.validateBoolean)(properties.autoAddGroupOwner));
  errors.collect(cdk.propertyValidator("groupOwner", cdk.validateString)(properties.groupOwner));
  return errors.wrap("supplied properties not correct for \"GroupOwnerSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionGroupOwnerSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionGroupOwnerSettingPropertyValidator(properties).assertSuccess();
  return {
    "AutoAddGroupOwner": cdk.booleanToCloudFormation(properties.autoAddGroupOwner),
    "GroupOwner": cdk.stringToCloudFormation(properties.groupOwner)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionGroupOwnerSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDefinitionVersion.GroupOwnerSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.GroupOwnerSettingProperty>();
  ret.addPropertyResult("autoAddGroupOwner", "AutoAddGroupOwner", (properties.AutoAddGroupOwner != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoAddGroupOwner) : undefined));
  ret.addPropertyResult("groupOwner", "GroupOwner", (properties.GroupOwner != null ? cfn_parse.FromCloudFormation.getString(properties.GroupOwner) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocalVolumeResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `LocalVolumeResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionLocalVolumeResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPath", cdk.requiredValidator)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("destinationPath", cdk.validateString)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("groupOwnerSetting", CfnResourceDefinitionVersionGroupOwnerSettingPropertyValidator)(properties.groupOwnerSetting));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.requiredValidator)(properties.sourcePath));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"LocalVolumeResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionLocalVolumeResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionLocalVolumeResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "DestinationPath": cdk.stringToCloudFormation(properties.destinationPath),
    "GroupOwnerSetting": convertCfnResourceDefinitionVersionGroupOwnerSettingPropertyToCloudFormation(properties.groupOwnerSetting),
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionLocalVolumeResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.LocalVolumeResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.LocalVolumeResourceDataProperty>();
  ret.addPropertyResult("destinationPath", "DestinationPath", (properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined));
  ret.addPropertyResult("groupOwnerSetting", "GroupOwnerSetting", (properties.GroupOwnerSetting != null ? CfnResourceDefinitionVersionGroupOwnerSettingPropertyFromCloudFormation(properties.GroupOwnerSetting) : undefined));
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocalDeviceResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `LocalDeviceResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionLocalDeviceResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupOwnerSetting", CfnResourceDefinitionVersionGroupOwnerSettingPropertyValidator)(properties.groupOwnerSetting));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.requiredValidator)(properties.sourcePath));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"LocalDeviceResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionLocalDeviceResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionLocalDeviceResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "GroupOwnerSetting": convertCfnResourceDefinitionVersionGroupOwnerSettingPropertyToCloudFormation(properties.groupOwnerSetting),
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionLocalDeviceResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.LocalDeviceResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.LocalDeviceResourceDataProperty>();
  ret.addPropertyResult("groupOwnerSetting", "GroupOwnerSetting", (properties.GroupOwnerSetting != null ? CfnResourceDefinitionVersionGroupOwnerSettingPropertyFromCloudFormation(properties.GroupOwnerSetting) : undefined));
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3MachineLearningModelResourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `S3MachineLearningModelResourceDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionS3MachineLearningModelResourceDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationPath", cdk.requiredValidator)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("destinationPath", cdk.validateString)(properties.destinationPath));
  errors.collect(cdk.propertyValidator("ownerSetting", CfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyValidator)(properties.ownerSetting));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.requiredValidator)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.validateString)(properties.s3Uri));
  return errors.wrap("supplied properties not correct for \"S3MachineLearningModelResourceDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionS3MachineLearningModelResourceDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionS3MachineLearningModelResourceDataPropertyValidator(properties).assertSuccess();
  return {
    "DestinationPath": cdk.stringToCloudFormation(properties.destinationPath),
    "OwnerSetting": convertCfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyToCloudFormation(properties.ownerSetting),
    "S3Uri": cdk.stringToCloudFormation(properties.s3Uri)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionS3MachineLearningModelResourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.S3MachineLearningModelResourceDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.S3MachineLearningModelResourceDataProperty>();
  ret.addPropertyResult("destinationPath", "DestinationPath", (properties.DestinationPath != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationPath) : undefined));
  ret.addPropertyResult("ownerSetting", "OwnerSetting", (properties.OwnerSetting != null ? CfnResourceDefinitionVersionResourceDownloadOwnerSettingPropertyFromCloudFormation(properties.OwnerSetting) : undefined));
  ret.addPropertyResult("s3Uri", "S3Uri", (properties.S3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.S3Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceDataContainerProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceDataContainerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionResourceDataContainerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("localDeviceResourceData", CfnResourceDefinitionVersionLocalDeviceResourceDataPropertyValidator)(properties.localDeviceResourceData));
  errors.collect(cdk.propertyValidator("localVolumeResourceData", CfnResourceDefinitionVersionLocalVolumeResourceDataPropertyValidator)(properties.localVolumeResourceData));
  errors.collect(cdk.propertyValidator("s3MachineLearningModelResourceData", CfnResourceDefinitionVersionS3MachineLearningModelResourceDataPropertyValidator)(properties.s3MachineLearningModelResourceData));
  errors.collect(cdk.propertyValidator("sageMakerMachineLearningModelResourceData", CfnResourceDefinitionVersionSageMakerMachineLearningModelResourceDataPropertyValidator)(properties.sageMakerMachineLearningModelResourceData));
  errors.collect(cdk.propertyValidator("secretsManagerSecretResourceData", CfnResourceDefinitionVersionSecretsManagerSecretResourceDataPropertyValidator)(properties.secretsManagerSecretResourceData));
  return errors.wrap("supplied properties not correct for \"ResourceDataContainerProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionResourceDataContainerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionResourceDataContainerPropertyValidator(properties).assertSuccess();
  return {
    "LocalDeviceResourceData": convertCfnResourceDefinitionVersionLocalDeviceResourceDataPropertyToCloudFormation(properties.localDeviceResourceData),
    "LocalVolumeResourceData": convertCfnResourceDefinitionVersionLocalVolumeResourceDataPropertyToCloudFormation(properties.localVolumeResourceData),
    "S3MachineLearningModelResourceData": convertCfnResourceDefinitionVersionS3MachineLearningModelResourceDataPropertyToCloudFormation(properties.s3MachineLearningModelResourceData),
    "SageMakerMachineLearningModelResourceData": convertCfnResourceDefinitionVersionSageMakerMachineLearningModelResourceDataPropertyToCloudFormation(properties.sageMakerMachineLearningModelResourceData),
    "SecretsManagerSecretResourceData": convertCfnResourceDefinitionVersionSecretsManagerSecretResourceDataPropertyToCloudFormation(properties.secretsManagerSecretResourceData)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionResourceDataContainerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.ResourceDataContainerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.ResourceDataContainerProperty>();
  ret.addPropertyResult("localDeviceResourceData", "LocalDeviceResourceData", (properties.LocalDeviceResourceData != null ? CfnResourceDefinitionVersionLocalDeviceResourceDataPropertyFromCloudFormation(properties.LocalDeviceResourceData) : undefined));
  ret.addPropertyResult("localVolumeResourceData", "LocalVolumeResourceData", (properties.LocalVolumeResourceData != null ? CfnResourceDefinitionVersionLocalVolumeResourceDataPropertyFromCloudFormation(properties.LocalVolumeResourceData) : undefined));
  ret.addPropertyResult("s3MachineLearningModelResourceData", "S3MachineLearningModelResourceData", (properties.S3MachineLearningModelResourceData != null ? CfnResourceDefinitionVersionS3MachineLearningModelResourceDataPropertyFromCloudFormation(properties.S3MachineLearningModelResourceData) : undefined));
  ret.addPropertyResult("sageMakerMachineLearningModelResourceData", "SageMakerMachineLearningModelResourceData", (properties.SageMakerMachineLearningModelResourceData != null ? CfnResourceDefinitionVersionSageMakerMachineLearningModelResourceDataPropertyFromCloudFormation(properties.SageMakerMachineLearningModelResourceData) : undefined));
  ret.addPropertyResult("secretsManagerSecretResourceData", "SecretsManagerSecretResourceData", (properties.SecretsManagerSecretResourceData != null ? CfnResourceDefinitionVersionSecretsManagerSecretResourceDataPropertyFromCloudFormation(properties.SecretsManagerSecretResourceData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceInstanceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceInstanceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionResourceInstancePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resourceDataContainer", cdk.requiredValidator)(properties.resourceDataContainer));
  errors.collect(cdk.propertyValidator("resourceDataContainer", CfnResourceDefinitionVersionResourceDataContainerPropertyValidator)(properties.resourceDataContainer));
  return errors.wrap("supplied properties not correct for \"ResourceInstanceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionResourceInstancePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionResourceInstancePropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResourceDataContainer": convertCfnResourceDefinitionVersionResourceDataContainerPropertyToCloudFormation(properties.resourceDataContainer)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionResourceInstancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceDefinitionVersion.ResourceInstanceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersion.ResourceInstanceProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resourceDataContainer", "ResourceDataContainer", (properties.ResourceDataContainer != null ? CfnResourceDefinitionVersionResourceDataContainerPropertyFromCloudFormation(properties.ResourceDataContainer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResourceDefinitionVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceDefinitionVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefinitionVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceDefinitionId", cdk.requiredValidator)(properties.resourceDefinitionId));
  errors.collect(cdk.propertyValidator("resourceDefinitionId", cdk.validateString)(properties.resourceDefinitionId));
  errors.collect(cdk.propertyValidator("resources", cdk.requiredValidator)(properties.resources));
  errors.collect(cdk.propertyValidator("resources", cdk.listValidator(CfnResourceDefinitionVersionResourceInstancePropertyValidator))(properties.resources));
  return errors.wrap("supplied properties not correct for \"CfnResourceDefinitionVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefinitionVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefinitionVersionPropsValidator(properties).assertSuccess();
  return {
    "ResourceDefinitionId": cdk.stringToCloudFormation(properties.resourceDefinitionId),
    "Resources": cdk.listMapper(convertCfnResourceDefinitionVersionResourceInstancePropertyToCloudFormation)(properties.resources)
  };
}

// @ts-ignore TS6133
function CfnResourceDefinitionVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDefinitionVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefinitionVersionProps>();
  ret.addPropertyResult("resourceDefinitionId", "ResourceDefinitionId", (properties.ResourceDefinitionId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceDefinitionId) : undefined));
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? cfn_parse.FromCloudFormation.getArray(CfnResourceDefinitionVersionResourceInstancePropertyFromCloudFormation)(properties.Resources) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::SubscriptionDefinition` resource represents a subscription definition for AWS IoT Greengrass .
 *
 * Subscription definitions are used to organize your subscription definition versions.
 *
 * Subscription definitions can reference multiple subscription definition versions. All subscription definition versions must be associated with a subscription definition. Each subscription definition version can contain one or more subscriptions.
 *
 * > When you create a subscription definition, you can optionally include an initial subscription definition version. To associate a subscription definition version later, create an [`AWS::Greengrass::SubscriptionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinitionversion.html) resource and specify the ID of this subscription definition.
 * >
 * > After you create the subscription definition version that contains the subscriptions you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::SubscriptionDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinition.html
 */
export class CfnSubscriptionDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::SubscriptionDefinition";

  /**
   * Build a CfnSubscriptionDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSubscriptionDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSubscriptionDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSubscriptionDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the `SubscriptionDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/subscriptions/1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the `SubscriptionDefinition` , such as `1234a5b6-78cd-901e-2fgh-3i45j6k178l9` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the last `SubscriptionDefinitionVersion` that was added to the `SubscriptionDefinition` , such as `arn:aws:greengrass:us-east-1:  :/greengrass/definition/subscriptions/1234a5b6-78cd-901e-2fgh-3i45j6k178l9/versions/9876ac30-4bdb-4f9d-95af-b5fdb66be1a2` .
   *
   * @cloudformationAttribute LatestVersionArn
   */
  public readonly attrLatestVersionArn: string;

  /**
   * The name of the `SubscriptionDefinition` , such as `MySubscriptionDefinition` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The subscription definition version to include when the subscription definition is created.
   */
  public initialVersion?: cdk.IResolvable | CfnSubscriptionDefinition.SubscriptionDefinitionVersionProperty;

  /**
   * The name of the subscription definition.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Application-specific metadata to attach to the subscription definition.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSubscriptionDefinitionProps) {
    super(scope, id, {
      "type": CfnSubscriptionDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrLatestVersionArn = cdk.Token.asString(this.getAtt("LatestVersionArn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.initialVersion = props.initialVersion;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Greengrass::SubscriptionDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "initialVersion": this.initialVersion,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubscriptionDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSubscriptionDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnSubscriptionDefinition {
  /**
   * A subscription definition version contains a list of [subscriptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscription.html) .
   *
   * > After you create a subscription definition version that contains the subscriptions you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
   *
   * In an AWS CloudFormation template, `SubscriptionDefinitionVersion` is the property type of the `InitialVersion` property in the [`AWS::Greengrass::SubscriptionDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinition.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscriptiondefinitionversion.html
   */
  export interface SubscriptionDefinitionVersionProperty {
    /**
     * The subscriptions in this version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscriptiondefinitionversion.html#cfn-greengrass-subscriptiondefinition-subscriptiondefinitionversion-subscriptions
     */
    readonly subscriptions: Array<cdk.IResolvable | CfnSubscriptionDefinition.SubscriptionProperty> | cdk.IResolvable;
  }

  /**
   * Subscriptions define how MQTT messages can be exchanged between devices, functions, and connectors in the group, and with AWS IoT or the local shadow service.
   *
   * A subscription defines a message source, message target, and a topic (or subject) that's used to route messages from the source to the target. A subscription defines the message flow in one direction, from the source to the target. For two-way communication, you must set up two subscriptions, one for each direction.
   *
   * In an AWS CloudFormation template, the `Subscriptions` property of the [`SubscriptionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscriptiondefinitionversion.html) property type contains a list of `Subscription` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscription.html
   */
  export interface SubscriptionProperty {
    /**
     * A descriptive or arbitrary ID for the subscription.
     *
     * This value must be unique within the subscription definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscription.html#cfn-greengrass-subscriptiondefinition-subscription-id
     */
    readonly id: string;

    /**
     * The originator of the message.
     *
     * The value can be a thing ARN, the ARN of a Lambda function alias (recommended) or version, a connector ARN, `cloud` (which represents the AWS IoT cloud), or `GGShadowService` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscription.html#cfn-greengrass-subscriptiondefinition-subscription-source
     */
    readonly source: string;

    /**
     * The MQTT topic used to route the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscription.html#cfn-greengrass-subscriptiondefinition-subscription-subject
     */
    readonly subject: string;

    /**
     * The destination of the message.
     *
     * The value can be a thing ARN, the ARN of a Lambda function alias (recommended) or version, a connector ARN, `cloud` (which represents the AWS IoT cloud), or `GGShadowService` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscription.html#cfn-greengrass-subscriptiondefinition-subscription-target
     */
    readonly target: string;
  }
}

/**
 * Properties for defining a `CfnSubscriptionDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinition.html
 */
export interface CfnSubscriptionDefinitionProps {
  /**
   * The subscription definition version to include when the subscription definition is created.
   *
   * A subscription definition version contains a list of [`subscription`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinition-subscription.html) property types.
   *
   * > To associate a subscription definition version after the subscription definition is created, create an [`AWS::Greengrass::SubscriptionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinitionversion.html) resource and specify the ID of this subscription definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinition.html#cfn-greengrass-subscriptiondefinition-initialversion
   */
  readonly initialVersion?: cdk.IResolvable | CfnSubscriptionDefinition.SubscriptionDefinitionVersionProperty;

  /**
   * The name of the subscription definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinition.html#cfn-greengrass-subscriptiondefinition-name
   */
  readonly name: string;

  /**
   * Application-specific metadata to attach to the subscription definition.
   *
   * You can use tags in IAM policies to control access to AWS IoT Greengrass resources. You can also use tags to categorize your resources. For more information, see [Tagging Your AWS IoT Greengrass Resources](https://docs.aws.amazon.com/greengrass/v1/developerguide/tagging.html) in the *Developer Guide* .
   *
   * This `Json` property type is processed as a map of key-value pairs. It uses the following format, which is different from most `Tags` implementations in AWS CloudFormation templates.
   *
   * ```json
   * "Tags": { "KeyName0": "value", "KeyName1": "value", "KeyName2": "value"
   * }
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinition.html#cfn-greengrass-subscriptiondefinition-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `SubscriptionProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubscriptionDefinitionSubscriptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("subject", cdk.requiredValidator)(properties.subject));
  errors.collect(cdk.propertyValidator("subject", cdk.validateString)(properties.subject));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  return errors.wrap("supplied properties not correct for \"SubscriptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSubscriptionDefinitionSubscriptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubscriptionDefinitionSubscriptionPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Source": cdk.stringToCloudFormation(properties.source),
    "Subject": cdk.stringToCloudFormation(properties.subject),
    "Target": cdk.stringToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnSubscriptionDefinitionSubscriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSubscriptionDefinition.SubscriptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionDefinition.SubscriptionProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("subject", "Subject", (properties.Subject != null ? cfn_parse.FromCloudFormation.getString(properties.Subject) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubscriptionDefinitionVersionProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriptionDefinitionVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubscriptionDefinitionSubscriptionDefinitionVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subscriptions", cdk.requiredValidator)(properties.subscriptions));
  errors.collect(cdk.propertyValidator("subscriptions", cdk.listValidator(CfnSubscriptionDefinitionSubscriptionPropertyValidator))(properties.subscriptions));
  return errors.wrap("supplied properties not correct for \"SubscriptionDefinitionVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSubscriptionDefinitionSubscriptionDefinitionVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubscriptionDefinitionSubscriptionDefinitionVersionPropertyValidator(properties).assertSuccess();
  return {
    "Subscriptions": cdk.listMapper(convertCfnSubscriptionDefinitionSubscriptionPropertyToCloudFormation)(properties.subscriptions)
  };
}

// @ts-ignore TS6133
function CfnSubscriptionDefinitionSubscriptionDefinitionVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSubscriptionDefinition.SubscriptionDefinitionVersionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionDefinition.SubscriptionDefinitionVersionProperty>();
  ret.addPropertyResult("subscriptions", "Subscriptions", (properties.Subscriptions != null ? cfn_parse.FromCloudFormation.getArray(CfnSubscriptionDefinitionSubscriptionPropertyFromCloudFormation)(properties.Subscriptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSubscriptionDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubscriptionDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("initialVersion", CfnSubscriptionDefinitionSubscriptionDefinitionVersionPropertyValidator)(properties.initialVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSubscriptionDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnSubscriptionDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubscriptionDefinitionPropsValidator(properties).assertSuccess();
  return {
    "InitialVersion": convertCfnSubscriptionDefinitionSubscriptionDefinitionVersionPropertyToCloudFormation(properties.initialVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSubscriptionDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubscriptionDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionDefinitionProps>();
  ret.addPropertyResult("initialVersion", "InitialVersion", (properties.InitialVersion != null ? CfnSubscriptionDefinitionSubscriptionDefinitionVersionPropertyFromCloudFormation(properties.InitialVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Greengrass::SubscriptionDefinitionVersion` resource represents a subscription definition version for AWS IoT Greengrass .
 *
 * A subscription definition version contains a list of subscriptions.
 *
 * > To create a subscription definition version, you must specify the ID of the subscription definition that you want to associate with the version. For information about creating a subscription definition, see [`AWS::Greengrass::SubscriptionDefinition`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinition.html) .
 * >
 * > After you create a subscription definition version that contains the subscriptions you want to deploy, you must add it to your group version. For more information, see [`AWS::Greengrass::Group`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-group.html) .
 *
 * @cloudformationResource AWS::Greengrass::SubscriptionDefinitionVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinitionversion.html
 */
export class CfnSubscriptionDefinitionVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Greengrass::SubscriptionDefinitionVersion";

  /**
   * Build a CfnSubscriptionDefinitionVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSubscriptionDefinitionVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSubscriptionDefinitionVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSubscriptionDefinitionVersion(scope, id, propsResult.value);
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
   * The ID of the subscription definition associated with this version.
   */
  public subscriptionDefinitionId: string;

  /**
   * The subscriptions in this version.
   */
  public subscriptions: Array<cdk.IResolvable | CfnSubscriptionDefinitionVersion.SubscriptionProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSubscriptionDefinitionVersionProps) {
    super(scope, id, {
      "type": CfnSubscriptionDefinitionVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "subscriptionDefinitionId", this);
    cdk.requireProperty(props, "subscriptions", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.subscriptionDefinitionId = props.subscriptionDefinitionId;
    this.subscriptions = props.subscriptions;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "subscriptionDefinitionId": this.subscriptionDefinitionId,
      "subscriptions": this.subscriptions
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubscriptionDefinitionVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSubscriptionDefinitionVersionPropsToCloudFormation(props);
  }
}

export namespace CfnSubscriptionDefinitionVersion {
  /**
   * Subscriptions define how MQTT messages can be exchanged between devices, functions, and connectors in the group, and with AWS IoT or the local shadow service.
   *
   * A subscription defines a message source, message target, and a topic (or subject) that's used to route messages from the source to the target. A subscription defines the message flow in one direction, from the source to the target. For two-way communication, you must set up two subscriptions, one for each direction.
   *
   * In an AWS CloudFormation template, the `Subscriptions` property of the [`AWS::Greengrass::SubscriptionDefinitionVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinitionversion.html) resource contains a list of `Subscription` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinitionversion-subscription.html
   */
  export interface SubscriptionProperty {
    /**
     * A descriptive or arbitrary ID for the subscription.
     *
     * This value must be unique within the subscription definition version. Maximum length is 128 characters with pattern `[a-zA-Z0-9:_-]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinitionversion-subscription.html#cfn-greengrass-subscriptiondefinitionversion-subscription-id
     */
    readonly id: string;

    /**
     * The originator of the message.
     *
     * The value can be a thing ARN, the ARN of a Lambda function alias (recommended) or version, a connector ARN, `cloud` (which represents the AWS IoT cloud), or `GGShadowService` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinitionversion-subscription.html#cfn-greengrass-subscriptiondefinitionversion-subscription-source
     */
    readonly source: string;

    /**
     * The MQTT topic used to route the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinitionversion-subscription.html#cfn-greengrass-subscriptiondefinitionversion-subscription-subject
     */
    readonly subject: string;

    /**
     * The destination of the message.
     *
     * The value can be a thing ARN, the ARN of a Lambda function alias (recommended) or version, a connector ARN, `cloud` (which represents the AWS IoT cloud), or `GGShadowService` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-greengrass-subscriptiondefinitionversion-subscription.html#cfn-greengrass-subscriptiondefinitionversion-subscription-target
     */
    readonly target: string;
  }
}

/**
 * Properties for defining a `CfnSubscriptionDefinitionVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinitionversion.html
 */
export interface CfnSubscriptionDefinitionVersionProps {
  /**
   * The ID of the subscription definition associated with this version.
   *
   * This value is a GUID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinitionversion.html#cfn-greengrass-subscriptiondefinitionversion-subscriptiondefinitionid
   */
  readonly subscriptionDefinitionId: string;

  /**
   * The subscriptions in this version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-greengrass-subscriptiondefinitionversion.html#cfn-greengrass-subscriptiondefinitionversion-subscriptions
   */
  readonly subscriptions: Array<cdk.IResolvable | CfnSubscriptionDefinitionVersion.SubscriptionProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SubscriptionProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubscriptionDefinitionVersionSubscriptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("subject", cdk.requiredValidator)(properties.subject));
  errors.collect(cdk.propertyValidator("subject", cdk.validateString)(properties.subject));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  return errors.wrap("supplied properties not correct for \"SubscriptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSubscriptionDefinitionVersionSubscriptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubscriptionDefinitionVersionSubscriptionPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Source": cdk.stringToCloudFormation(properties.source),
    "Subject": cdk.stringToCloudFormation(properties.subject),
    "Target": cdk.stringToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnSubscriptionDefinitionVersionSubscriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSubscriptionDefinitionVersion.SubscriptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionDefinitionVersion.SubscriptionProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("subject", "Subject", (properties.Subject != null ? cfn_parse.FromCloudFormation.getString(properties.Subject) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSubscriptionDefinitionVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionDefinitionVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubscriptionDefinitionVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subscriptionDefinitionId", cdk.requiredValidator)(properties.subscriptionDefinitionId));
  errors.collect(cdk.propertyValidator("subscriptionDefinitionId", cdk.validateString)(properties.subscriptionDefinitionId));
  errors.collect(cdk.propertyValidator("subscriptions", cdk.requiredValidator)(properties.subscriptions));
  errors.collect(cdk.propertyValidator("subscriptions", cdk.listValidator(CfnSubscriptionDefinitionVersionSubscriptionPropertyValidator))(properties.subscriptions));
  return errors.wrap("supplied properties not correct for \"CfnSubscriptionDefinitionVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnSubscriptionDefinitionVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubscriptionDefinitionVersionPropsValidator(properties).assertSuccess();
  return {
    "SubscriptionDefinitionId": cdk.stringToCloudFormation(properties.subscriptionDefinitionId),
    "Subscriptions": cdk.listMapper(convertCfnSubscriptionDefinitionVersionSubscriptionPropertyToCloudFormation)(properties.subscriptions)
  };
}

// @ts-ignore TS6133
function CfnSubscriptionDefinitionVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubscriptionDefinitionVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionDefinitionVersionProps>();
  ret.addPropertyResult("subscriptionDefinitionId", "SubscriptionDefinitionId", (properties.SubscriptionDefinitionId != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionDefinitionId) : undefined));
  ret.addPropertyResult("subscriptions", "Subscriptions", (properties.Subscriptions != null ? cfn_parse.FromCloudFormation.getArray(CfnSubscriptionDefinitionVersionSubscriptionPropertyFromCloudFormation)(properties.Subscriptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}