/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::CodeStarConnections::Connection resource can be used to connect external source providers with services like AWS CodePipeline .
 *
 * *Note:* A connection created through AWS CloudFormation is in `PENDING` status by default. You can make its status `AVAILABLE` by updating the connection in the console.
 *
 * @cloudformationResource AWS::CodeStarConnections::Connection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html
 */
export class CfnConnection extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeStarConnections::Connection";

  /**
   * Build a CfnConnection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the connection. The ARN is used as the connection reference when the connection is shared between AWS services. For example: `arn:aws:codestar-connections:us-west-2:123456789012:connection/39e4c34d-e13a-4e94-a886-ea67651bf042` .
   *
   * @cloudformationAttribute ConnectionArn
   */
  public readonly attrConnectionArn: string;

  /**
   * The current status of the connection. For example: `PENDING` , `AVAILABLE` , or `ERROR` .
   *
   * @cloudformationAttribute ConnectionStatus
   */
  public readonly attrConnectionStatus: string;

  /**
   * The AWS account ID of the owner of the connection. For Bitbucket, this is the account ID of the owner of the Bitbucket repository. For example: `123456789012` .
   *
   * @cloudformationAttribute OwnerAccountId
   */
  public readonly attrOwnerAccountId: string;

  /**
   * The name of the connection.
   */
  public connectionName: string;

  /**
   * The Amazon Resource Name (ARN) of the host associated with the connection.
   */
  public hostArn?: string;

  /**
   * The name of the external provider where your third-party code repository is configured.
   */
  public providerType?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies the tags applied to the resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectionProps) {
    super(scope, id, {
      "type": CfnConnection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectionName", this);

    this.attrConnectionArn = cdk.Token.asString(this.getAtt("ConnectionArn", cdk.ResolutionTypeHint.STRING));
    this.attrConnectionStatus = cdk.Token.asString(this.getAtt("ConnectionStatus", cdk.ResolutionTypeHint.STRING));
    this.attrOwnerAccountId = cdk.Token.asString(this.getAtt("OwnerAccountId", cdk.ResolutionTypeHint.STRING));
    this.connectionName = props.connectionName;
    this.hostArn = props.hostArn;
    this.providerType = props.providerType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeStarConnections::Connection", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectionName": this.connectionName,
      "hostArn": this.hostArn,
      "providerType": this.providerType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnConnection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html
 */
export interface CfnConnectionProps {
  /**
   * The name of the connection.
   *
   * Connection names must be unique in an AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-connectionname
   */
  readonly connectionName: string;

  /**
   * The Amazon Resource Name (ARN) of the host associated with the connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-hostarn
   */
  readonly hostArn?: string;

  /**
   * The name of the external provider where your third-party code repository is configured.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-providertype
   */
  readonly providerType?: string;

  /**
   * Specifies the tags applied to the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnConnectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.requiredValidator)(properties.connectionName));
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("hostArn", cdk.validateString)(properties.hostArn));
  errors.collect(cdk.propertyValidator("providerType", cdk.validateString)(properties.providerType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConnectionProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionPropsValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "HostArn": cdk.stringToCloudFormation(properties.hostArn),
    "ProviderType": cdk.stringToCloudFormation(properties.providerType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConnectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionProps>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("hostArn", "HostArn", (properties.HostArn != null ? cfn_parse.FromCloudFormation.getString(properties.HostArn) : undefined));
  ret.addPropertyResult("providerType", "ProviderType", (properties.ProviderType != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Information about the repository link resource, such as the repository link ARN, the associated connection ARN, encryption key ARN, and owner ID.
 *
 * @cloudformationResource AWS::CodeStarConnections::RepositoryLink
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-repositorylink.html
 */
export class CfnRepositoryLink extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeStarConnections::RepositoryLink";

  /**
   * Build a CfnRepositoryLink from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRepositoryLink {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRepositoryLinkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRepositoryLink(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the external provider where your third-party code repository is configured.
   *
   * @cloudformationAttribute ProviderType
   */
  public readonly attrProviderType: string;

  /**
   * A unique Amazon Resource Name (ARN) to designate the repository link.
   *
   * @cloudformationAttribute RepositoryLinkArn
   */
  public readonly attrRepositoryLinkArn: string;

  /**
   * A UUID that uniquely identifies the RepositoryLink.
   *
   * @cloudformationAttribute RepositoryLinkId
   */
  public readonly attrRepositoryLinkId: string;

  /**
   * The Amazon Resource Name (ARN) of the connection associated with the repository link.
   */
  public connectionArn: string;

  /**
   * The Amazon Resource Name (ARN) of the encryption key for the repository associated with the repository link.
   */
  public encryptionKeyArn?: string;

  /**
   * The owner ID for the repository associated with the repository link, such as the owner ID in GitHub.
   */
  public ownerId: string;

  /**
   * The name of the repository associated with the repository link.
   */
  public repositoryName: string;

  /**
   * The tags for the repository to be associated with the repository link.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRepositoryLinkProps) {
    super(scope, id, {
      "type": CfnRepositoryLink.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectionArn", this);
    cdk.requireProperty(props, "ownerId", this);
    cdk.requireProperty(props, "repositoryName", this);

    this.attrProviderType = cdk.Token.asString(this.getAtt("ProviderType", cdk.ResolutionTypeHint.STRING));
    this.attrRepositoryLinkArn = cdk.Token.asString(this.getAtt("RepositoryLinkArn", cdk.ResolutionTypeHint.STRING));
    this.attrRepositoryLinkId = cdk.Token.asString(this.getAtt("RepositoryLinkId", cdk.ResolutionTypeHint.STRING));
    this.connectionArn = props.connectionArn;
    this.encryptionKeyArn = props.encryptionKeyArn;
    this.ownerId = props.ownerId;
    this.repositoryName = props.repositoryName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectionArn": this.connectionArn,
      "encryptionKeyArn": this.encryptionKeyArn,
      "ownerId": this.ownerId,
      "repositoryName": this.repositoryName,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRepositoryLink.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRepositoryLinkPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRepositoryLink`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-repositorylink.html
 */
export interface CfnRepositoryLinkProps {
  /**
   * The Amazon Resource Name (ARN) of the connection associated with the repository link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-repositorylink.html#cfn-codestarconnections-repositorylink-connectionarn
   */
  readonly connectionArn: string;

  /**
   * The Amazon Resource Name (ARN) of the encryption key for the repository associated with the repository link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-repositorylink.html#cfn-codestarconnections-repositorylink-encryptionkeyarn
   */
  readonly encryptionKeyArn?: string;

  /**
   * The owner ID for the repository associated with the repository link, such as the owner ID in GitHub.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-repositorylink.html#cfn-codestarconnections-repositorylink-ownerid
   */
  readonly ownerId: string;

  /**
   * The name of the repository associated with the repository link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-repositorylink.html#cfn-codestarconnections-repositorylink-repositoryname
   */
  readonly repositoryName: string;

  /**
   * The tags for the repository to be associated with the repository link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-repositorylink.html#cfn-codestarconnections-repositorylink-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnRepositoryLinkProps`
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryLinkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryLinkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionArn", cdk.requiredValidator)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.validateString)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("encryptionKeyArn", cdk.validateString)(properties.encryptionKeyArn));
  errors.collect(cdk.propertyValidator("ownerId", cdk.requiredValidator)(properties.ownerId));
  errors.collect(cdk.propertyValidator("ownerId", cdk.validateString)(properties.ownerId));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.requiredValidator)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRepositoryLinkProps\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryLinkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryLinkPropsValidator(properties).assertSuccess();
  return {
    "ConnectionArn": cdk.stringToCloudFormation(properties.connectionArn),
    "EncryptionKeyArn": cdk.stringToCloudFormation(properties.encryptionKeyArn),
    "OwnerId": cdk.stringToCloudFormation(properties.ownerId),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRepositoryLinkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepositoryLinkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepositoryLinkProps>();
  ret.addPropertyResult("connectionArn", "ConnectionArn", (properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined));
  ret.addPropertyResult("encryptionKeyArn", "EncryptionKeyArn", (properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined));
  ret.addPropertyResult("ownerId", "OwnerId", (properties.OwnerId != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerId) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Information, such as repository, branch, provider, and resource names for a specific sync configuration.
 *
 * @cloudformationResource AWS::CodeStarConnections::SyncConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html
 */
export class CfnSyncConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeStarConnections::SyncConfiguration";

  /**
   * Build a CfnSyncConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSyncConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSyncConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSyncConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The owner ID for the repository associated with a specific sync configuration, such as the owner ID in GitHub.
   *
   * @cloudformationAttribute OwnerId
   */
  public readonly attrOwnerId: string;

  /**
   * The name of the external provider where your third-party code repository is configured.
   *
   * @cloudformationAttribute ProviderType
   */
  public readonly attrProviderType: string;

  /**
   * The name of the repository that is being synced to.
   *
   * @cloudformationAttribute RepositoryName
   */
  public readonly attrRepositoryName: string;

  /**
   * The branch associated with a specific sync configuration.
   */
  public branch: string;

  /**
   * The file path to the configuration file associated with a specific sync configuration.
   */
  public configFile: string;

  /**
   * The ID of the repository link associated with a specific sync configuration.
   */
  public repositoryLinkId: string;

  /**
   * The name of the connection resource associated with a specific sync configuration.
   */
  public resourceName: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role associated with a specific sync configuration.
   */
  public roleArn: string;

  /**
   * The type of sync for a specific sync configuration.
   */
  public syncType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSyncConfigurationProps) {
    super(scope, id, {
      "type": CfnSyncConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "branch", this);
    cdk.requireProperty(props, "configFile", this);
    cdk.requireProperty(props, "repositoryLinkId", this);
    cdk.requireProperty(props, "resourceName", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "syncType", this);

    this.attrOwnerId = cdk.Token.asString(this.getAtt("OwnerId", cdk.ResolutionTypeHint.STRING));
    this.attrProviderType = cdk.Token.asString(this.getAtt("ProviderType", cdk.ResolutionTypeHint.STRING));
    this.attrRepositoryName = cdk.Token.asString(this.getAtt("RepositoryName", cdk.ResolutionTypeHint.STRING));
    this.branch = props.branch;
    this.configFile = props.configFile;
    this.repositoryLinkId = props.repositoryLinkId;
    this.resourceName = props.resourceName;
    this.roleArn = props.roleArn;
    this.syncType = props.syncType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "branch": this.branch,
      "configFile": this.configFile,
      "repositoryLinkId": this.repositoryLinkId,
      "resourceName": this.resourceName,
      "roleArn": this.roleArn,
      "syncType": this.syncType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSyncConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSyncConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSyncConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html
 */
export interface CfnSyncConfigurationProps {
  /**
   * The branch associated with a specific sync configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html#cfn-codestarconnections-syncconfiguration-branch
   */
  readonly branch: string;

  /**
   * The file path to the configuration file associated with a specific sync configuration.
   *
   * The path should point to an actual file in the sync configurations linked repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html#cfn-codestarconnections-syncconfiguration-configfile
   */
  readonly configFile: string;

  /**
   * The ID of the repository link associated with a specific sync configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html#cfn-codestarconnections-syncconfiguration-repositorylinkid
   */
  readonly repositoryLinkId: string;

  /**
   * The name of the connection resource associated with a specific sync configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html#cfn-codestarconnections-syncconfiguration-resourcename
   */
  readonly resourceName: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role associated with a specific sync configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html#cfn-codestarconnections-syncconfiguration-rolearn
   */
  readonly roleArn: string;

  /**
   * The type of sync for a specific sync configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-syncconfiguration.html#cfn-codestarconnections-syncconfiguration-synctype
   */
  readonly syncType: string;
}

/**
 * Determine whether the given properties match those of a `CfnSyncConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSyncConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSyncConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("branch", cdk.requiredValidator)(properties.branch));
  errors.collect(cdk.propertyValidator("branch", cdk.validateString)(properties.branch));
  errors.collect(cdk.propertyValidator("configFile", cdk.requiredValidator)(properties.configFile));
  errors.collect(cdk.propertyValidator("configFile", cdk.validateString)(properties.configFile));
  errors.collect(cdk.propertyValidator("repositoryLinkId", cdk.requiredValidator)(properties.repositoryLinkId));
  errors.collect(cdk.propertyValidator("repositoryLinkId", cdk.validateString)(properties.repositoryLinkId));
  errors.collect(cdk.propertyValidator("resourceName", cdk.requiredValidator)(properties.resourceName));
  errors.collect(cdk.propertyValidator("resourceName", cdk.validateString)(properties.resourceName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("syncType", cdk.requiredValidator)(properties.syncType));
  errors.collect(cdk.propertyValidator("syncType", cdk.validateString)(properties.syncType));
  return errors.wrap("supplied properties not correct for \"CfnSyncConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnSyncConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSyncConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Branch": cdk.stringToCloudFormation(properties.branch),
    "ConfigFile": cdk.stringToCloudFormation(properties.configFile),
    "RepositoryLinkId": cdk.stringToCloudFormation(properties.repositoryLinkId),
    "ResourceName": cdk.stringToCloudFormation(properties.resourceName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SyncType": cdk.stringToCloudFormation(properties.syncType)
  };
}

// @ts-ignore TS6133
function CfnSyncConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSyncConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSyncConfigurationProps>();
  ret.addPropertyResult("branch", "Branch", (properties.Branch != null ? cfn_parse.FromCloudFormation.getString(properties.Branch) : undefined));
  ret.addPropertyResult("configFile", "ConfigFile", (properties.ConfigFile != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigFile) : undefined));
  ret.addPropertyResult("repositoryLinkId", "RepositoryLinkId", (properties.RepositoryLinkId != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryLinkId) : undefined));
  ret.addPropertyResult("resourceName", "ResourceName", (properties.ResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("syncType", "SyncType", (properties.SyncType != null ? cfn_parse.FromCloudFormation.getString(properties.SyncType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}