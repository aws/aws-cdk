/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::WorkSpaces::ConnectionAlias` resource specifies a connection alias.
 *
 * Connection aliases are used for cross-Region redirection. For more information, see [Cross-Region Redirection for Amazon WorkSpaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/cross-region-redirection.html) .
 *
 * @cloudformationResource AWS::WorkSpaces::ConnectionAlias
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html
 */
export class CfnConnectionAlias extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpaces::ConnectionAlias";

  /**
   * Build a CfnConnectionAlias from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectionAlias {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectionAliasPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnectionAlias(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier of the connection alias, returned as a string.
   *
   * @cloudformationAttribute AliasId
   */
  public readonly attrAliasId: string;

  /**
   * The association status of the connection alias.
   *
   * @cloudformationAttribute Associations
   */
  public readonly attrAssociations: cdk.IResolvable;

  /**
   * The current state of the connection alias, returned as a string.
   *
   * @cloudformationAttribute ConnectionAliasState
   */
  public readonly attrConnectionAliasState: string;

  /**
   * The connection string specified for the connection alias.
   */
  public connectionString: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to associate with the connection alias.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectionAliasProps) {
    super(scope, id, {
      "type": CfnConnectionAlias.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectionString", this);

    this.attrAliasId = cdk.Token.asString(this.getAtt("AliasId", cdk.ResolutionTypeHint.STRING));
    this.attrAssociations = this.getAtt("Associations");
    this.attrConnectionAliasState = cdk.Token.asString(this.getAtt("ConnectionAliasState", cdk.ResolutionTypeHint.STRING));
    this.connectionString = props.connectionString;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WorkSpaces::ConnectionAlias", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectionString": this.connectionString,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectionAlias.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectionAliasPropsToCloudFormation(props);
  }
}

export namespace CfnConnectionAlias {
  /**
   * Describes a connection alias association that is used for cross-Region redirection.
   *
   * For more information, see [Cross-Region Redirection for Amazon WorkSpaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/cross-region-redirection.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html
   */
  export interface ConnectionAliasAssociationProperty {
    /**
     * The identifier of the AWS account that associated the connection alias with a directory.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-associatedaccountid
     */
    readonly associatedAccountId?: string;

    /**
     * The association status of the connection alias.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-associationstatus
     */
    readonly associationStatus?: string;

    /**
     * The identifier of the connection alias association.
     *
     * You use the connection identifier in the DNS TXT record when you're configuring your DNS routing policies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-connectionidentifier
     */
    readonly connectionIdentifier?: string;

    /**
     * The identifier of the directory associated with a connection alias.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-resourceid
     */
    readonly resourceId?: string;
  }
}

/**
 * Properties for defining a `CfnConnectionAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html
 */
export interface CfnConnectionAliasProps {
  /**
   * The connection string specified for the connection alias.
   *
   * The connection string must be in the form of a fully qualified domain name (FQDN), such as `www.example.com` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html#cfn-workspaces-connectionalias-connectionstring
   */
  readonly connectionString: string;

  /**
   * The tags to associate with the connection alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html#cfn-workspaces-connectionalias-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ConnectionAliasAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionAliasAssociationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionAliasConnectionAliasAssociationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("associatedAccountId", cdk.validateString)(properties.associatedAccountId));
  errors.collect(cdk.propertyValidator("associationStatus", cdk.validateString)(properties.associationStatus));
  errors.collect(cdk.propertyValidator("connectionIdentifier", cdk.validateString)(properties.connectionIdentifier));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  return errors.wrap("supplied properties not correct for \"ConnectionAliasAssociationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionAliasConnectionAliasAssociationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionAliasConnectionAliasAssociationPropertyValidator(properties).assertSuccess();
  return {
    "AssociatedAccountId": cdk.stringToCloudFormation(properties.associatedAccountId),
    "AssociationStatus": cdk.stringToCloudFormation(properties.associationStatus),
    "ConnectionIdentifier": cdk.stringToCloudFormation(properties.connectionIdentifier),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId)
  };
}

// @ts-ignore TS6133
function CfnConnectionAliasConnectionAliasAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionAlias.ConnectionAliasAssociationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionAlias.ConnectionAliasAssociationProperty>();
  ret.addPropertyResult("associatedAccountId", "AssociatedAccountId", (properties.AssociatedAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AssociatedAccountId) : undefined));
  ret.addPropertyResult("associationStatus", "AssociationStatus", (properties.AssociationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AssociationStatus) : undefined));
  ret.addPropertyResult("connectionIdentifier", "ConnectionIdentifier", (properties.ConnectionIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionIdentifier) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectionAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectionAliasProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionAliasPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionString", cdk.requiredValidator)(properties.connectionString));
  errors.collect(cdk.propertyValidator("connectionString", cdk.validateString)(properties.connectionString));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConnectionAliasProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectionAliasPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionAliasPropsValidator(properties).assertSuccess();
  return {
    "ConnectionString": cdk.stringToCloudFormation(properties.connectionString),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConnectionAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionAliasProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionAliasProps>();
  ret.addPropertyResult("connectionString", "ConnectionString", (properties.ConnectionString != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionString) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::WorkSpaces::Workspace` resource specifies a WorkSpace.
 *
 * Updates are not supported for the `BundleId` , `RootVolumeEncryptionEnabled` , `UserVolumeEncryptionEnabled` , or `VolumeEncryptionKey` properties. To update these properties, you must also update a property that triggers a replacement, such as the `UserName` property.
 *
 * @cloudformationResource AWS::WorkSpaces::Workspace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html
 */
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::WorkSpaces::Workspace";

  /**
   * Build a CfnWorkspace from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkspacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkspace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier of the WorkSpace, returned as a string.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The identifier of the bundle for the WorkSpace.
   */
  public bundleId: string;

  /**
   * The identifier of the AWS Directory Service directory for the WorkSpace.
   */
  public directoryId: string;

  /**
   * Indicates whether the data stored on the root volume is encrypted.
   */
  public rootVolumeEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the WorkSpace.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The user name of the user for the WorkSpace.
   */
  public userName: string;

  /**
   * Indicates whether the data stored on the user volume is encrypted.
   */
  public userVolumeEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * The ARN of the symmetric AWS KMS key used to encrypt data stored on your WorkSpace.
   */
  public volumeEncryptionKey?: string;

  /**
   * The WorkSpace properties.
   */
  public workspaceProperties?: cdk.IResolvable | CfnWorkspace.WorkspacePropertiesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps) {
    super(scope, id, {
      "type": CfnWorkspace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bundleId", this);
    cdk.requireProperty(props, "directoryId", this);
    cdk.requireProperty(props, "userName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.bundleId = props.bundleId;
    this.directoryId = props.directoryId;
    this.rootVolumeEncryptionEnabled = props.rootVolumeEncryptionEnabled;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WorkSpaces::Workspace", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userName = props.userName;
    this.userVolumeEncryptionEnabled = props.userVolumeEncryptionEnabled;
    this.volumeEncryptionKey = props.volumeEncryptionKey;
    this.workspaceProperties = props.workspaceProperties;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bundleId": this.bundleId,
      "directoryId": this.directoryId,
      "rootVolumeEncryptionEnabled": this.rootVolumeEncryptionEnabled,
      "tags": this.tags.renderTags(),
      "userName": this.userName,
      "userVolumeEncryptionEnabled": this.userVolumeEncryptionEnabled,
      "volumeEncryptionKey": this.volumeEncryptionKey,
      "workspaceProperties": this.workspaceProperties
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkspace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkspacePropsToCloudFormation(props);
  }
}

export namespace CfnWorkspace {
  /**
   * Information about a WorkSpace.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html
   */
  export interface WorkspacePropertiesProperty {
    /**
     * The compute type.
     *
     * For more information, see [Amazon WorkSpaces Bundles](https://docs.aws.amazon.com/workspaces/details/#Amazon_WorkSpaces_Bundles) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-computetypename
     */
    readonly computeTypeName?: string;

    /**
     * The size of the root volume.
     *
     * For important information about how to modify the size of the root and user volumes, see [Modify a WorkSpace](https://docs.aws.amazon.com/workspaces/latest/adminguide/modify-workspaces.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-rootvolumesizegib
     */
    readonly rootVolumeSizeGib?: number;

    /**
     * The running mode. For more information, see [Manage the WorkSpace Running Mode](https://docs.aws.amazon.com/workspaces/latest/adminguide/running-mode.html) .
     *
     * > - The `MANUAL` value is only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use this value. For more information, see [Amazon WorkSpaces Core](https://docs.aws.amazon.com/workspaces/core/) .
     * > - Ensure you review your running mode to ensure you are using a running mode that is optimal for your needs and budget. For more information on switching running modes, see [Can I switch between hourly and monthly billing?](https://docs.aws.amazon.com/https://aws.amazon.com/workspaces/faqs/#:~:text=Q%3A%20Can%20I%20switch%20between%20hourly%20and%20monthly%20billing%3F)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-runningmode
     */
    readonly runningMode?: string;

    /**
     * The time after a user logs off when WorkSpaces are automatically stopped.
     *
     * Configured in 60-minute intervals.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-runningmodeautostoptimeoutinminutes
     */
    readonly runningModeAutoStopTimeoutInMinutes?: number;

    /**
     * The size of the user storage.
     *
     * For important information about how to modify the size of the root and user volumes, see [Modify a WorkSpace](https://docs.aws.amazon.com/workspaces/latest/adminguide/modify-workspaces.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-uservolumesizegib
     */
    readonly userVolumeSizeGib?: number;
  }
}

/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html
 */
export interface CfnWorkspaceProps {
  /**
   * The identifier of the bundle for the WorkSpace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-bundleid
   */
  readonly bundleId: string;

  /**
   * The identifier of the AWS Directory Service directory for the WorkSpace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-directoryid
   */
  readonly directoryId: string;

  /**
   * Indicates whether the data stored on the root volume is encrypted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-rootvolumeencryptionenabled
   */
  readonly rootVolumeEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * The tags for the WorkSpace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The user name of the user for the WorkSpace.
   *
   * This user name must exist in the AWS Directory Service directory for the WorkSpace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-username
   */
  readonly userName: string;

  /**
   * Indicates whether the data stored on the user volume is encrypted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-uservolumeencryptionenabled
   */
  readonly userVolumeEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * The ARN of the symmetric AWS KMS key used to encrypt data stored on your WorkSpace.
   *
   * Amazon WorkSpaces does not support asymmetric KMS keys.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-volumeencryptionkey
   */
  readonly volumeEncryptionKey?: string;

  /**
   * The WorkSpace properties.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-workspaceproperties
   */
  readonly workspaceProperties?: cdk.IResolvable | CfnWorkspace.WorkspacePropertiesProperty;
}

/**
 * Determine whether the given properties match those of a `WorkspacePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `WorkspacePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceWorkspacePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeTypeName", cdk.validateString)(properties.computeTypeName));
  errors.collect(cdk.propertyValidator("rootVolumeSizeGib", cdk.validateNumber)(properties.rootVolumeSizeGib));
  errors.collect(cdk.propertyValidator("runningMode", cdk.validateString)(properties.runningMode));
  errors.collect(cdk.propertyValidator("runningModeAutoStopTimeoutInMinutes", cdk.validateNumber)(properties.runningModeAutoStopTimeoutInMinutes));
  errors.collect(cdk.propertyValidator("userVolumeSizeGib", cdk.validateNumber)(properties.userVolumeSizeGib));
  return errors.wrap("supplied properties not correct for \"WorkspacePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceWorkspacePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceWorkspacePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "ComputeTypeName": cdk.stringToCloudFormation(properties.computeTypeName),
    "RootVolumeSizeGib": cdk.numberToCloudFormation(properties.rootVolumeSizeGib),
    "RunningMode": cdk.stringToCloudFormation(properties.runningMode),
    "RunningModeAutoStopTimeoutInMinutes": cdk.numberToCloudFormation(properties.runningModeAutoStopTimeoutInMinutes),
    "UserVolumeSizeGib": cdk.numberToCloudFormation(properties.userVolumeSizeGib)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceWorkspacePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkspace.WorkspacePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.WorkspacePropertiesProperty>();
  ret.addPropertyResult("computeTypeName", "ComputeTypeName", (properties.ComputeTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.ComputeTypeName) : undefined));
  ret.addPropertyResult("rootVolumeSizeGib", "RootVolumeSizeGib", (properties.RootVolumeSizeGib != null ? cfn_parse.FromCloudFormation.getNumber(properties.RootVolumeSizeGib) : undefined));
  ret.addPropertyResult("runningMode", "RunningMode", (properties.RunningMode != null ? cfn_parse.FromCloudFormation.getString(properties.RunningMode) : undefined));
  ret.addPropertyResult("runningModeAutoStopTimeoutInMinutes", "RunningModeAutoStopTimeoutInMinutes", (properties.RunningModeAutoStopTimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.RunningModeAutoStopTimeoutInMinutes) : undefined));
  ret.addPropertyResult("userVolumeSizeGib", "UserVolumeSizeGib", (properties.UserVolumeSizeGib != null ? cfn_parse.FromCloudFormation.getNumber(properties.UserVolumeSizeGib) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bundleId", cdk.requiredValidator)(properties.bundleId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("directoryId", cdk.requiredValidator)(properties.directoryId));
  errors.collect(cdk.propertyValidator("directoryId", cdk.validateString)(properties.directoryId));
  errors.collect(cdk.propertyValidator("rootVolumeEncryptionEnabled", cdk.validateBoolean)(properties.rootVolumeEncryptionEnabled));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userName", cdk.requiredValidator)(properties.userName));
  errors.collect(cdk.propertyValidator("userName", cdk.validateString)(properties.userName));
  errors.collect(cdk.propertyValidator("userVolumeEncryptionEnabled", cdk.validateBoolean)(properties.userVolumeEncryptionEnabled));
  errors.collect(cdk.propertyValidator("volumeEncryptionKey", cdk.validateString)(properties.volumeEncryptionKey));
  errors.collect(cdk.propertyValidator("workspaceProperties", CfnWorkspaceWorkspacePropertiesPropertyValidator)(properties.workspaceProperties));
  return errors.wrap("supplied properties not correct for \"CfnWorkspaceProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkspacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspacePropsValidator(properties).assertSuccess();
  return {
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "DirectoryId": cdk.stringToCloudFormation(properties.directoryId),
    "RootVolumeEncryptionEnabled": cdk.booleanToCloudFormation(properties.rootVolumeEncryptionEnabled),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserName": cdk.stringToCloudFormation(properties.userName),
    "UserVolumeEncryptionEnabled": cdk.booleanToCloudFormation(properties.userVolumeEncryptionEnabled),
    "VolumeEncryptionKey": cdk.stringToCloudFormation(properties.volumeEncryptionKey),
    "WorkspaceProperties": convertCfnWorkspaceWorkspacePropertiesPropertyToCloudFormation(properties.workspaceProperties)
  };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("directoryId", "DirectoryId", (properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined));
  ret.addPropertyResult("rootVolumeEncryptionEnabled", "RootVolumeEncryptionEnabled", (properties.RootVolumeEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RootVolumeEncryptionEnabled) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userName", "UserName", (properties.UserName != null ? cfn_parse.FromCloudFormation.getString(properties.UserName) : undefined));
  ret.addPropertyResult("userVolumeEncryptionEnabled", "UserVolumeEncryptionEnabled", (properties.UserVolumeEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserVolumeEncryptionEnabled) : undefined));
  ret.addPropertyResult("volumeEncryptionKey", "VolumeEncryptionKey", (properties.VolumeEncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeEncryptionKey) : undefined));
  ret.addPropertyResult("workspaceProperties", "WorkspaceProperties", (properties.WorkspaceProperties != null ? CfnWorkspaceWorkspacePropertiesPropertyFromCloudFormation(properties.WorkspaceProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}