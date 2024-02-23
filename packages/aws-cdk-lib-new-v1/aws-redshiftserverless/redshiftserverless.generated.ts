/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * A collection of database objects and users.
 *
 * @cloudformationResource AWS::RedshiftServerless::Namespace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html
 */
export class CfnNamespace extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RedshiftServerless::Namespace";

  /**
   * Build a CfnNamespace from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNamespace {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnNamespacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNamespace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The collection of computing resources from which an endpoint is created.
   *
   * @cloudformationAttribute Namespace
   */
  public readonly attrNamespace: cdk.IResolvable;

  /**
   * @cloudformationAttribute Namespace.AdminUsername
   */
  public readonly attrNamespaceAdminUsername: string;

  /**
   * @cloudformationAttribute Namespace.CreationDate
   */
  public readonly attrNamespaceCreationDate: string;

  /**
   * @cloudformationAttribute Namespace.DbName
   */
  public readonly attrNamespaceDbName: string;

  /**
   * @cloudformationAttribute Namespace.DefaultIamRoleArn
   */
  public readonly attrNamespaceDefaultIamRoleArn: string;

  /**
   * @cloudformationAttribute Namespace.IamRoles
   */
  public readonly attrNamespaceIamRoles: Array<string>;

  /**
   * @cloudformationAttribute Namespace.KmsKeyId
   */
  public readonly attrNamespaceKmsKeyId: string;

  /**
   * @cloudformationAttribute Namespace.LogExports
   */
  public readonly attrNamespaceLogExports: Array<string>;

  /**
   * @cloudformationAttribute Namespace.NamespaceArn
   */
  public readonly attrNamespaceNamespaceArn: string;

  /**
   * @cloudformationAttribute Namespace.NamespaceId
   */
  public readonly attrNamespaceNamespaceId: string;

  /**
   * @cloudformationAttribute Namespace.NamespaceName
   */
  public readonly attrNamespaceNamespaceName: string;

  /**
   * @cloudformationAttribute Namespace.Status
   */
  public readonly attrNamespaceStatus: string;

  /**
   * The username of the administrator for the primary database created in the namespace.
   */
  public adminUsername?: string;

  /**
   * The password of the administrator for the primary database created in the namespace.
   */
  public adminUserPassword?: string;

  /**
   * The name of the primary database created in the namespace.
   */
  public dbName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
   */
  public defaultIamRoleArn?: string;

  /**
   * The name of the snapshot to be created before the namespace is deleted.
   */
  public finalSnapshotName?: string;

  /**
   * How long to retain the final snapshot.
   */
  public finalSnapshotRetentionPeriod?: number;

  /**
   * A list of IAM roles to associate with the namespace.
   */
  public iamRoles?: Array<string>;

  /**
   * The ID of the AWS Key Management Service key used to encrypt your data.
   */
  public kmsKeyId?: string;

  /**
   * The types of logs the namespace can export.
   */
  public logExports?: Array<string>;

  /**
   * The name of the namespace.
   */
  public namespaceName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The map of the key-value pairs used to tag the namespace.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNamespaceProps) {
    super(scope, id, {
      "type": CfnNamespace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "namespaceName", this);

    this.attrNamespace = this.getAtt("Namespace");
    this.attrNamespaceAdminUsername = cdk.Token.asString(this.getAtt("Namespace.AdminUsername", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceCreationDate = cdk.Token.asString(this.getAtt("Namespace.CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceDbName = cdk.Token.asString(this.getAtt("Namespace.DbName", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceDefaultIamRoleArn = cdk.Token.asString(this.getAtt("Namespace.DefaultIamRoleArn", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceIamRoles = cdk.Token.asList(this.getAtt("Namespace.IamRoles", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrNamespaceKmsKeyId = cdk.Token.asString(this.getAtt("Namespace.KmsKeyId", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceLogExports = cdk.Token.asList(this.getAtt("Namespace.LogExports", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrNamespaceNamespaceArn = cdk.Token.asString(this.getAtt("Namespace.NamespaceArn", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceNamespaceId = cdk.Token.asString(this.getAtt("Namespace.NamespaceId", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceNamespaceName = cdk.Token.asString(this.getAtt("Namespace.NamespaceName", cdk.ResolutionTypeHint.STRING));
    this.attrNamespaceStatus = cdk.Token.asString(this.getAtt("Namespace.Status", cdk.ResolutionTypeHint.STRING));
    this.adminUsername = props.adminUsername;
    this.adminUserPassword = props.adminUserPassword;
    this.dbName = props.dbName;
    this.defaultIamRoleArn = props.defaultIamRoleArn;
    this.finalSnapshotName = props.finalSnapshotName;
    this.finalSnapshotRetentionPeriod = props.finalSnapshotRetentionPeriod;
    this.iamRoles = props.iamRoles;
    this.kmsKeyId = props.kmsKeyId;
    this.logExports = props.logExports;
    this.namespaceName = props.namespaceName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RedshiftServerless::Namespace", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "adminUsername": this.adminUsername,
      "adminUserPassword": this.adminUserPassword,
      "dbName": this.dbName,
      "defaultIamRoleArn": this.defaultIamRoleArn,
      "finalSnapshotName": this.finalSnapshotName,
      "finalSnapshotRetentionPeriod": this.finalSnapshotRetentionPeriod,
      "iamRoles": this.iamRoles,
      "kmsKeyId": this.kmsKeyId,
      "logExports": this.logExports,
      "namespaceName": this.namespaceName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNamespace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNamespacePropsToCloudFormation(props);
  }
}

export namespace CfnNamespace {
  /**
   * A collection of database objects and users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html
   */
  export interface NamespaceProperty {
    /**
     * The username of the administrator for the first database created in the namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-adminusername
     */
    readonly adminUsername?: string;

    /**
     * The date of when the namespace was created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-creationdate
     */
    readonly creationDate?: string;

    /**
     * The name of the first database created in the namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-dbname
     */
    readonly dbName?: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-defaultiamrolearn
     */
    readonly defaultIamRoleArn?: string;

    /**
     * A list of IAM roles to associate with the namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-iamroles
     */
    readonly iamRoles?: Array<string>;

    /**
     * The ID of the AWS Key Management Service key used to encrypt your data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The types of logs the namespace can export.
     *
     * Available export types are User log, Connection log, and User activity log.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-logexports
     */
    readonly logExports?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) associated with a namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-namespacearn
     */
    readonly namespaceArn?: string;

    /**
     * The unique identifier of a namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-namespaceid
     */
    readonly namespaceId?: string;

    /**
     * The name of the namespace.
     *
     * Must be between 3-64 alphanumeric characters in lowercase, and it cannot be a reserved word. A list of reserved words can be found in [Reserved Words](https://docs.aws.amazon.com//redshift/latest/dg/r_pg_keywords.html) in the Amazon Redshift Database Developer Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-namespacename
     */
    readonly namespaceName?: string;

    /**
     * The status of the namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-status
     */
    readonly status?: string;
  }
}

/**
 * Properties for defining a `CfnNamespace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html
 */
export interface CfnNamespaceProps {
  /**
   * The username of the administrator for the primary database created in the namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-adminusername
   */
  readonly adminUsername?: string;

  /**
   * The password of the administrator for the primary database created in the namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-adminuserpassword
   */
  readonly adminUserPassword?: string;

  /**
   * The name of the primary database created in the namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-dbname
   */
  readonly dbName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-defaultiamrolearn
   */
  readonly defaultIamRoleArn?: string;

  /**
   * The name of the snapshot to be created before the namespace is deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-finalsnapshotname
   */
  readonly finalSnapshotName?: string;

  /**
   * How long to retain the final snapshot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-finalsnapshotretentionperiod
   */
  readonly finalSnapshotRetentionPeriod?: number;

  /**
   * A list of IAM roles to associate with the namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-iamroles
   */
  readonly iamRoles?: Array<string>;

  /**
   * The ID of the AWS Key Management Service key used to encrypt your data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The types of logs the namespace can export.
   *
   * Available export types are `userlog` , `connectionlog` , and `useractivitylog` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-logexports
   */
  readonly logExports?: Array<string>;

  /**
   * The name of the namespace.
   *
   * Must be between 3-64 alphanumeric characters in lowercase, and it cannot be a reserved word. A list of reserved words can be found in [Reserved Words](https://docs.aws.amazon.com//redshift/latest/dg/r_pg_keywords.html) in the Amazon Redshift Database Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-namespacename
   */
  readonly namespaceName: string;

  /**
   * The map of the key-value pairs used to tag the namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `NamespaceProperty`
 *
 * @param properties - the TypeScript properties of a `NamespaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNamespaceNamespacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adminUsername", cdk.validateString)(properties.adminUsername));
  errors.collect(cdk.propertyValidator("creationDate", cdk.validateString)(properties.creationDate));
  errors.collect(cdk.propertyValidator("dbName", cdk.validateString)(properties.dbName));
  errors.collect(cdk.propertyValidator("defaultIamRoleArn", cdk.validateString)(properties.defaultIamRoleArn));
  errors.collect(cdk.propertyValidator("iamRoles", cdk.listValidator(cdk.validateString))(properties.iamRoles));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("logExports", cdk.listValidator(cdk.validateString))(properties.logExports));
  errors.collect(cdk.propertyValidator("namespaceArn", cdk.validateString)(properties.namespaceArn));
  errors.collect(cdk.propertyValidator("namespaceId", cdk.validateString)(properties.namespaceId));
  errors.collect(cdk.propertyValidator("namespaceName", cdk.validateString)(properties.namespaceName));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"NamespaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnNamespaceNamespacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNamespaceNamespacePropertyValidator(properties).assertSuccess();
  return {
    "AdminUsername": cdk.stringToCloudFormation(properties.adminUsername),
    "CreationDate": cdk.stringToCloudFormation(properties.creationDate),
    "DbName": cdk.stringToCloudFormation(properties.dbName),
    "DefaultIamRoleArn": cdk.stringToCloudFormation(properties.defaultIamRoleArn),
    "IamRoles": cdk.listMapper(cdk.stringToCloudFormation)(properties.iamRoles),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LogExports": cdk.listMapper(cdk.stringToCloudFormation)(properties.logExports),
    "NamespaceArn": cdk.stringToCloudFormation(properties.namespaceArn),
    "NamespaceId": cdk.stringToCloudFormation(properties.namespaceId),
    "NamespaceName": cdk.stringToCloudFormation(properties.namespaceName),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnNamespaceNamespacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNamespace.NamespaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNamespace.NamespaceProperty>();
  ret.addPropertyResult("adminUsername", "AdminUsername", (properties.AdminUsername != null ? cfn_parse.FromCloudFormation.getString(properties.AdminUsername) : undefined));
  ret.addPropertyResult("creationDate", "CreationDate", (properties.CreationDate != null ? cfn_parse.FromCloudFormation.getString(properties.CreationDate) : undefined));
  ret.addPropertyResult("dbName", "DbName", (properties.DbName != null ? cfn_parse.FromCloudFormation.getString(properties.DbName) : undefined));
  ret.addPropertyResult("defaultIamRoleArn", "DefaultIamRoleArn", (properties.DefaultIamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultIamRoleArn) : undefined));
  ret.addPropertyResult("iamRoles", "IamRoles", (properties.IamRoles != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IamRoles) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("logExports", "LogExports", (properties.LogExports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogExports) : undefined));
  ret.addPropertyResult("namespaceArn", "NamespaceArn", (properties.NamespaceArn != null ? cfn_parse.FromCloudFormation.getString(properties.NamespaceArn) : undefined));
  ret.addPropertyResult("namespaceId", "NamespaceId", (properties.NamespaceId != null ? cfn_parse.FromCloudFormation.getString(properties.NamespaceId) : undefined));
  ret.addPropertyResult("namespaceName", "NamespaceName", (properties.NamespaceName != null ? cfn_parse.FromCloudFormation.getString(properties.NamespaceName) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnNamespaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnNamespaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNamespacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adminUserPassword", cdk.validateString)(properties.adminUserPassword));
  errors.collect(cdk.propertyValidator("adminUsername", cdk.validateString)(properties.adminUsername));
  errors.collect(cdk.propertyValidator("dbName", cdk.validateString)(properties.dbName));
  errors.collect(cdk.propertyValidator("defaultIamRoleArn", cdk.validateString)(properties.defaultIamRoleArn));
  errors.collect(cdk.propertyValidator("finalSnapshotName", cdk.validateString)(properties.finalSnapshotName));
  errors.collect(cdk.propertyValidator("finalSnapshotRetentionPeriod", cdk.validateNumber)(properties.finalSnapshotRetentionPeriod));
  errors.collect(cdk.propertyValidator("iamRoles", cdk.listValidator(cdk.validateString))(properties.iamRoles));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("logExports", cdk.listValidator(cdk.validateString))(properties.logExports));
  errors.collect(cdk.propertyValidator("namespaceName", cdk.requiredValidator)(properties.namespaceName));
  errors.collect(cdk.propertyValidator("namespaceName", cdk.validateString)(properties.namespaceName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnNamespaceProps\"");
}

// @ts-ignore TS6133
function convertCfnNamespacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNamespacePropsValidator(properties).assertSuccess();
  return {
    "AdminUserPassword": cdk.stringToCloudFormation(properties.adminUserPassword),
    "AdminUsername": cdk.stringToCloudFormation(properties.adminUsername),
    "DbName": cdk.stringToCloudFormation(properties.dbName),
    "DefaultIamRoleArn": cdk.stringToCloudFormation(properties.defaultIamRoleArn),
    "FinalSnapshotName": cdk.stringToCloudFormation(properties.finalSnapshotName),
    "FinalSnapshotRetentionPeriod": cdk.numberToCloudFormation(properties.finalSnapshotRetentionPeriod),
    "IamRoles": cdk.listMapper(cdk.stringToCloudFormation)(properties.iamRoles),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LogExports": cdk.listMapper(cdk.stringToCloudFormation)(properties.logExports),
    "NamespaceName": cdk.stringToCloudFormation(properties.namespaceName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnNamespacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNamespaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNamespaceProps>();
  ret.addPropertyResult("adminUsername", "AdminUsername", (properties.AdminUsername != null ? cfn_parse.FromCloudFormation.getString(properties.AdminUsername) : undefined));
  ret.addPropertyResult("adminUserPassword", "AdminUserPassword", (properties.AdminUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.AdminUserPassword) : undefined));
  ret.addPropertyResult("dbName", "DbName", (properties.DbName != null ? cfn_parse.FromCloudFormation.getString(properties.DbName) : undefined));
  ret.addPropertyResult("defaultIamRoleArn", "DefaultIamRoleArn", (properties.DefaultIamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultIamRoleArn) : undefined));
  ret.addPropertyResult("finalSnapshotName", "FinalSnapshotName", (properties.FinalSnapshotName != null ? cfn_parse.FromCloudFormation.getString(properties.FinalSnapshotName) : undefined));
  ret.addPropertyResult("finalSnapshotRetentionPeriod", "FinalSnapshotRetentionPeriod", (properties.FinalSnapshotRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.FinalSnapshotRetentionPeriod) : undefined));
  ret.addPropertyResult("iamRoles", "IamRoles", (properties.IamRoles != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IamRoles) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("logExports", "LogExports", (properties.LogExports != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogExports) : undefined));
  ret.addPropertyResult("namespaceName", "NamespaceName", (properties.NamespaceName != null ? cfn_parse.FromCloudFormation.getString(properties.NamespaceName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The collection of compute resources in Amazon Redshift Serverless.
 *
 * @cloudformationResource AWS::RedshiftServerless::Workgroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html
 */
export class CfnWorkgroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RedshiftServerless::Workgroup";

  /**
   * Build a CfnWorkgroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkgroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkgroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkgroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the `Workgroup` value.
   *
   * @cloudformationAttribute Workgroup
   */
  public readonly attrWorkgroup: cdk.IResolvable;

  /**
   * @cloudformationAttribute Workgroup.BaseCapacity
   */
  public readonly attrWorkgroupBaseCapacity: number;

  /**
   * @cloudformationAttribute Workgroup.ConfigParameters
   */
  public readonly attrWorkgroupConfigParameters: cdk.IResolvable;

  /**
   * @cloudformationAttribute Workgroup.CreationDate
   */
  public readonly attrWorkgroupCreationDate: string;

  /**
   * @cloudformationAttribute Workgroup.Endpoint
   */
  public readonly attrWorkgroupEndpoint: cdk.IResolvable;

  /**
   * @cloudformationAttribute Workgroup.Endpoint.Address
   */
  public readonly attrWorkgroupEndpointAddress: string;

  /**
   * @cloudformationAttribute Workgroup.Endpoint.Port
   */
  public readonly attrWorkgroupEndpointPort: number;

  /**
   * @cloudformationAttribute Workgroup.Endpoint.VpcEndpoints
   */
  public readonly attrWorkgroupEndpointVpcEndpoints: cdk.IResolvable;

  /**
   * @cloudformationAttribute Workgroup.EnhancedVpcRouting
   */
  public readonly attrWorkgroupEnhancedVpcRouting: cdk.IResolvable;

  /**
   * @cloudformationAttribute Workgroup.NamespaceName
   */
  public readonly attrWorkgroupNamespaceName: string;

  /**
   * @cloudformationAttribute Workgroup.PubliclyAccessible
   */
  public readonly attrWorkgroupPubliclyAccessible: cdk.IResolvable;

  /**
   * @cloudformationAttribute Workgroup.SecurityGroupIds
   */
  public readonly attrWorkgroupSecurityGroupIds: Array<string>;

  /**
   * @cloudformationAttribute Workgroup.Status
   */
  public readonly attrWorkgroupStatus: string;

  /**
   * @cloudformationAttribute Workgroup.SubnetIds
   */
  public readonly attrWorkgroupSubnetIds: Array<string>;

  /**
   * @cloudformationAttribute Workgroup.WorkgroupArn
   */
  public readonly attrWorkgroupWorkgroupArn: string;

  /**
   * @cloudformationAttribute Workgroup.WorkgroupId
   */
  public readonly attrWorkgroupWorkgroupId: string;

  /**
   * @cloudformationAttribute Workgroup.WorkgroupName
   */
  public readonly attrWorkgroupWorkgroupName: string;

  /**
   * The base compute capacity of the workgroup in Redshift Processing Units (RPUs).
   */
  public baseCapacity?: number;

  /**
   * A list of parameters to set for finer control over a database.
   */
  public configParameters?: Array<CfnWorkgroup.ConfigParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The value that specifies whether to enable enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
   */
  public enhancedVpcRouting?: boolean | cdk.IResolvable;

  /**
   * The namespace the workgroup is associated with.
   */
  public namespaceName?: string;

  /**
   * The custom port to use when connecting to a workgroup.
   */
  public port?: number;

  /**
   * A value that specifies whether the workgroup can be accessible from a public network.
   */
  public publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * A list of security group IDs to associate with the workgroup.
   */
  public securityGroupIds?: Array<string>;

  /**
   * A list of subnet IDs the workgroup is associated with.
   */
  public subnetIds?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The map of the key-value pairs used to tag the workgroup.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the workgroup.
   */
  public workgroupName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkgroupProps) {
    super(scope, id, {
      "type": CfnWorkgroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "workgroupName", this);

    this.attrWorkgroup = this.getAtt("Workgroup");
    this.attrWorkgroupBaseCapacity = cdk.Token.asNumber(this.getAtt("Workgroup.BaseCapacity", cdk.ResolutionTypeHint.NUMBER));
    this.attrWorkgroupConfigParameters = this.getAtt("Workgroup.ConfigParameters");
    this.attrWorkgroupCreationDate = cdk.Token.asString(this.getAtt("Workgroup.CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrWorkgroupEndpoint = this.getAtt("Workgroup.Endpoint");
    this.attrWorkgroupEndpointAddress = cdk.Token.asString(this.getAtt("Workgroup.Endpoint.Address", cdk.ResolutionTypeHint.STRING));
    this.attrWorkgroupEndpointPort = cdk.Token.asNumber(this.getAtt("Workgroup.Endpoint.Port", cdk.ResolutionTypeHint.NUMBER));
    this.attrWorkgroupEndpointVpcEndpoints = this.getAtt("Workgroup.Endpoint.VpcEndpoints");
    this.attrWorkgroupEnhancedVpcRouting = this.getAtt("Workgroup.EnhancedVpcRouting");
    this.attrWorkgroupNamespaceName = cdk.Token.asString(this.getAtt("Workgroup.NamespaceName", cdk.ResolutionTypeHint.STRING));
    this.attrWorkgroupPubliclyAccessible = this.getAtt("Workgroup.PubliclyAccessible");
    this.attrWorkgroupSecurityGroupIds = cdk.Token.asList(this.getAtt("Workgroup.SecurityGroupIds", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrWorkgroupStatus = cdk.Token.asString(this.getAtt("Workgroup.Status", cdk.ResolutionTypeHint.STRING));
    this.attrWorkgroupSubnetIds = cdk.Token.asList(this.getAtt("Workgroup.SubnetIds", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrWorkgroupWorkgroupArn = cdk.Token.asString(this.getAtt("Workgroup.WorkgroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrWorkgroupWorkgroupId = cdk.Token.asString(this.getAtt("Workgroup.WorkgroupId", cdk.ResolutionTypeHint.STRING));
    this.attrWorkgroupWorkgroupName = cdk.Token.asString(this.getAtt("Workgroup.WorkgroupName", cdk.ResolutionTypeHint.STRING));
    this.baseCapacity = props.baseCapacity;
    this.configParameters = props.configParameters;
    this.enhancedVpcRouting = props.enhancedVpcRouting;
    this.namespaceName = props.namespaceName;
    this.port = props.port;
    this.publiclyAccessible = props.publiclyAccessible;
    this.securityGroupIds = props.securityGroupIds;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RedshiftServerless::Workgroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workgroupName = props.workgroupName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "baseCapacity": this.baseCapacity,
      "configParameters": this.configParameters,
      "enhancedVpcRouting": this.enhancedVpcRouting,
      "namespaceName": this.namespaceName,
      "port": this.port,
      "publiclyAccessible": this.publiclyAccessible,
      "securityGroupIds": this.securityGroupIds,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags(),
      "workgroupName": this.workgroupName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkgroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkgroupPropsToCloudFormation(props);
  }
}

export namespace CfnWorkgroup {
  /**
   * A array of parameters to set for more control over a serverless database.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-configparameter.html
   */
  export interface ConfigParameterProperty {
    /**
     * The key of the parameter.
     *
     * The options are `datestyle` , `enable_user_activity_logging` , `query_group` , `search_path` , `max_query_execution_time` , and `require_ssl` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-configparameter.html#cfn-redshiftserverless-workgroup-configparameter-parameterkey
     */
    readonly parameterKey?: string;

    /**
     * The value of the parameter to set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-configparameter.html#cfn-redshiftserverless-workgroup-configparameter-parametervalue
     */
    readonly parameterValue?: string;
  }

  /**
   * The VPC endpoint object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html
   */
  export interface EndpointProperty {
    /**
     * The DNS address of the VPC endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html#cfn-redshiftserverless-workgroup-endpoint-address
     */
    readonly address?: string;

    /**
     * The port that Amazon Redshift Serverless listens on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html#cfn-redshiftserverless-workgroup-endpoint-port
     */
    readonly port?: number;

    /**
     * An array of `VpcEndpoint` objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html#cfn-redshiftserverless-workgroup-endpoint-vpcendpoints
     */
    readonly vpcEndpoints?: Array<cdk.IResolvable | CfnWorkgroup.VpcEndpointProperty> | cdk.IResolvable;
  }

  /**
   * The connection endpoint for connecting to Amazon Redshift Serverless through the proxy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html
   */
  export interface VpcEndpointProperty {
    /**
     * One or more network interfaces of the endpoint.
     *
     * Also known as an interface endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html#cfn-redshiftserverless-workgroup-vpcendpoint-networkinterfaces
     */
    readonly networkInterfaces?: Array<cdk.IResolvable | CfnWorkgroup.NetworkInterfaceProperty> | cdk.IResolvable;

    /**
     * The connection endpoint ID for connecting to Amazon Redshift Serverless.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html#cfn-redshiftserverless-workgroup-vpcendpoint-vpcendpointid
     */
    readonly vpcEndpointId?: string;

    /**
     * The VPC identifier that the endpoint is associated with.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html#cfn-redshiftserverless-workgroup-vpcendpoint-vpcid
     */
    readonly vpcId?: string;
  }

  /**
   * Contains information about a network interface in an Amazon Redshift Serverless managed VPC endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html
   */
  export interface NetworkInterfaceProperty {
    /**
     * The availability Zone.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The unique identifier of the network interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-networkinterfaceid
     */
    readonly networkInterfaceId?: string;

    /**
     * The IPv4 address of the network interface within the subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-privateipaddress
     */
    readonly privateIpAddress?: string;

    /**
     * The unique identifier of the subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-subnetid
     */
    readonly subnetId?: string;
  }

  /**
   * The collection of computing resources from which an endpoint is created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html
   */
  export interface WorkgroupProperty {
    /**
     * The base data warehouse capacity of the workgroup in Redshift Processing Units (RPUs).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-basecapacity
     */
    readonly baseCapacity?: number;

    /**
     * An array of parameters to set for advanced control over a database.
     *
     * The options are `auto_mv` , `datestyle` , `enable_case_sensitive_identifier` , `enable_user_activity_logging` , `query_group` , `search_path` , `require_ssl` , and query monitoring metrics that let you define performance boundaries. For more information about query monitoring rules and available metrics, see [Query monitoring metrics for Amazon Redshift Serverless](https://docs.aws.amazon.com/redshift/latest/dg/cm-c-wlm-query-monitoring-rules.html#cm-c-wlm-query-monitoring-metrics-serverless) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-configparameters
     */
    readonly configParameters?: Array<CfnWorkgroup.ConfigParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The creation date of the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-creationdate
     */
    readonly creationDate?: string;

    /**
     * The endpoint that is created from the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-endpoint
     */
    readonly endpoint?: CfnWorkgroup.EndpointProperty | cdk.IResolvable;

    /**
     * The value that specifies whether to enable enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-enhancedvpcrouting
     */
    readonly enhancedVpcRouting?: boolean | cdk.IResolvable;

    /**
     * The namespace the workgroup is associated with.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-namespacename
     */
    readonly namespaceName?: string;

    /**
     * A value that specifies whether the workgroup can be accessible from a public network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-publiclyaccessible
     */
    readonly publiclyAccessible?: boolean | cdk.IResolvable;

    /**
     * An array of security group IDs to associate with the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The status of the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-status
     */
    readonly status?: string;

    /**
     * An array of subnet IDs the workgroup is associated with.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-subnetids
     */
    readonly subnetIds?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) that links to the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-workgrouparn
     */
    readonly workgroupArn?: string;

    /**
     * The unique identifier of the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-workgroupid
     */
    readonly workgroupId?: string;

    /**
     * The name of the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-workgroupname
     */
    readonly workgroupName?: string;
  }
}

/**
 * Properties for defining a `CfnWorkgroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html
 */
export interface CfnWorkgroupProps {
  /**
   * The base compute capacity of the workgroup in Redshift Processing Units (RPUs).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-basecapacity
   */
  readonly baseCapacity?: number;

  /**
   * A list of parameters to set for finer control over a database.
   *
   * Available options are `datestyle` , `enable_user_activity_logging` , `query_group` , `search_path` , `max_query_execution_time` , and `require_ssl` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-configparameters
   */
  readonly configParameters?: Array<CfnWorkgroup.ConfigParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The value that specifies whether to enable enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-enhancedvpcrouting
   */
  readonly enhancedVpcRouting?: boolean | cdk.IResolvable;

  /**
   * The namespace the workgroup is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-namespacename
   */
  readonly namespaceName?: string;

  /**
   * The custom port to use when connecting to a workgroup.
   *
   * Valid port ranges are 5431-5455 and 8191-8215. The default is 5439.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-port
   */
  readonly port?: number;

  /**
   * A value that specifies whether the workgroup can be accessible from a public network.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-publiclyaccessible
   */
  readonly publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * A list of security group IDs to associate with the workgroup.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * A list of subnet IDs the workgroup is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-subnetids
   */
  readonly subnetIds?: Array<string>;

  /**
   * The map of the key-value pairs used to tag the workgroup.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the workgroup.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-workgroupname
   */
  readonly workgroupName: string;
}

/**
 * Determine whether the given properties match those of a `ConfigParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkgroupConfigParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterKey", cdk.validateString)(properties.parameterKey));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"ConfigParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkgroupConfigParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkgroupConfigParameterPropertyValidator(properties).assertSuccess();
  return {
    "ParameterKey": cdk.stringToCloudFormation(properties.parameterKey),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnWorkgroupConfigParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkgroup.ConfigParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkgroup.ConfigParameterProperty>();
  ret.addPropertyResult("parameterKey", "ParameterKey", (properties.ParameterKey != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterKey) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkgroupNetworkInterfacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("networkInterfaceId", cdk.validateString)(properties.networkInterfaceId));
  errors.collect(cdk.propertyValidator("privateIpAddress", cdk.validateString)(properties.privateIpAddress));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"NetworkInterfaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkgroupNetworkInterfacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkgroupNetworkInterfacePropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "NetworkInterfaceId": cdk.stringToCloudFormation(properties.networkInterfaceId),
    "PrivateIpAddress": cdk.stringToCloudFormation(properties.privateIpAddress),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnWorkgroupNetworkInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkgroup.NetworkInterfaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkgroup.NetworkInterfaceProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("networkInterfaceId", "NetworkInterfaceId", (properties.NetworkInterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkInterfaceId) : undefined));
  ret.addPropertyResult("privateIpAddress", "PrivateIpAddress", (properties.PrivateIpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateIpAddress) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `VpcEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkgroupVpcEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("networkInterfaces", cdk.listValidator(CfnWorkgroupNetworkInterfacePropertyValidator))(properties.networkInterfaces));
  errors.collect(cdk.propertyValidator("vpcEndpointId", cdk.validateString)(properties.vpcEndpointId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkgroupVpcEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkgroupVpcEndpointPropertyValidator(properties).assertSuccess();
  return {
    "NetworkInterfaces": cdk.listMapper(convertCfnWorkgroupNetworkInterfacePropertyToCloudFormation)(properties.networkInterfaces),
    "VpcEndpointId": cdk.stringToCloudFormation(properties.vpcEndpointId),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnWorkgroupVpcEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkgroup.VpcEndpointProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkgroup.VpcEndpointProperty>();
  ret.addPropertyResult("networkInterfaces", "NetworkInterfaces", (properties.NetworkInterfaces != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkgroupNetworkInterfacePropertyFromCloudFormation)(properties.NetworkInterfaces) : undefined));
  ret.addPropertyResult("vpcEndpointId", "VpcEndpointId", (properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkgroupEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("vpcEndpoints", cdk.listValidator(CfnWorkgroupVpcEndpointPropertyValidator))(properties.vpcEndpoints));
  return errors.wrap("supplied properties not correct for \"EndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkgroupEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkgroupEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Port": cdk.numberToCloudFormation(properties.port),
    "VpcEndpoints": cdk.listMapper(convertCfnWorkgroupVpcEndpointPropertyToCloudFormation)(properties.vpcEndpoints)
  };
}

// @ts-ignore TS6133
function CfnWorkgroupEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkgroup.EndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkgroup.EndpointProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("vpcEndpoints", "VpcEndpoints", (properties.VpcEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkgroupVpcEndpointPropertyFromCloudFormation)(properties.VpcEndpoints) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkgroupProperty`
 *
 * @param properties - the TypeScript properties of a `WorkgroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkgroupWorkgroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseCapacity", cdk.validateNumber)(properties.baseCapacity));
  errors.collect(cdk.propertyValidator("configParameters", cdk.listValidator(CfnWorkgroupConfigParameterPropertyValidator))(properties.configParameters));
  errors.collect(cdk.propertyValidator("creationDate", cdk.validateString)(properties.creationDate));
  errors.collect(cdk.propertyValidator("endpoint", CfnWorkgroupEndpointPropertyValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("enhancedVpcRouting", cdk.validateBoolean)(properties.enhancedVpcRouting));
  errors.collect(cdk.propertyValidator("namespaceName", cdk.validateString)(properties.namespaceName));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("workgroupArn", cdk.validateString)(properties.workgroupArn));
  errors.collect(cdk.propertyValidator("workgroupId", cdk.validateString)(properties.workgroupId));
  errors.collect(cdk.propertyValidator("workgroupName", cdk.validateString)(properties.workgroupName));
  return errors.wrap("supplied properties not correct for \"WorkgroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkgroupWorkgroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkgroupWorkgroupPropertyValidator(properties).assertSuccess();
  return {
    "BaseCapacity": cdk.numberToCloudFormation(properties.baseCapacity),
    "ConfigParameters": cdk.listMapper(convertCfnWorkgroupConfigParameterPropertyToCloudFormation)(properties.configParameters),
    "CreationDate": cdk.stringToCloudFormation(properties.creationDate),
    "Endpoint": convertCfnWorkgroupEndpointPropertyToCloudFormation(properties.endpoint),
    "EnhancedVpcRouting": cdk.booleanToCloudFormation(properties.enhancedVpcRouting),
    "NamespaceName": cdk.stringToCloudFormation(properties.namespaceName),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "Status": cdk.stringToCloudFormation(properties.status),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "WorkgroupArn": cdk.stringToCloudFormation(properties.workgroupArn),
    "WorkgroupId": cdk.stringToCloudFormation(properties.workgroupId),
    "WorkgroupName": cdk.stringToCloudFormation(properties.workgroupName)
  };
}

// @ts-ignore TS6133
function CfnWorkgroupWorkgroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkgroup.WorkgroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkgroup.WorkgroupProperty>();
  ret.addPropertyResult("baseCapacity", "BaseCapacity", (properties.BaseCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.BaseCapacity) : undefined));
  ret.addPropertyResult("configParameters", "ConfigParameters", (properties.ConfigParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkgroupConfigParameterPropertyFromCloudFormation)(properties.ConfigParameters) : undefined));
  ret.addPropertyResult("creationDate", "CreationDate", (properties.CreationDate != null ? cfn_parse.FromCloudFormation.getString(properties.CreationDate) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? CfnWorkgroupEndpointPropertyFromCloudFormation(properties.Endpoint) : undefined));
  ret.addPropertyResult("enhancedVpcRouting", "EnhancedVpcRouting", (properties.EnhancedVpcRouting != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnhancedVpcRouting) : undefined));
  ret.addPropertyResult("namespaceName", "NamespaceName", (properties.NamespaceName != null ? cfn_parse.FromCloudFormation.getString(properties.NamespaceName) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("workgroupArn", "WorkgroupArn", (properties.WorkgroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.WorkgroupArn) : undefined));
  ret.addPropertyResult("workgroupId", "WorkgroupId", (properties.WorkgroupId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkgroupId) : undefined));
  ret.addPropertyResult("workgroupName", "WorkgroupName", (properties.WorkgroupName != null ? cfn_parse.FromCloudFormation.getString(properties.WorkgroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWorkgroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkgroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkgroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseCapacity", cdk.validateNumber)(properties.baseCapacity));
  errors.collect(cdk.propertyValidator("configParameters", cdk.listValidator(CfnWorkgroupConfigParameterPropertyValidator))(properties.configParameters));
  errors.collect(cdk.propertyValidator("enhancedVpcRouting", cdk.validateBoolean)(properties.enhancedVpcRouting));
  errors.collect(cdk.propertyValidator("namespaceName", cdk.validateString)(properties.namespaceName));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("workgroupName", cdk.requiredValidator)(properties.workgroupName));
  errors.collect(cdk.propertyValidator("workgroupName", cdk.validateString)(properties.workgroupName));
  return errors.wrap("supplied properties not correct for \"CfnWorkgroupProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkgroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkgroupPropsValidator(properties).assertSuccess();
  return {
    "BaseCapacity": cdk.numberToCloudFormation(properties.baseCapacity),
    "ConfigParameters": cdk.listMapper(convertCfnWorkgroupConfigParameterPropertyToCloudFormation)(properties.configParameters),
    "EnhancedVpcRouting": cdk.booleanToCloudFormation(properties.enhancedVpcRouting),
    "NamespaceName": cdk.stringToCloudFormation(properties.namespaceName),
    "Port": cdk.numberToCloudFormation(properties.port),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "WorkgroupName": cdk.stringToCloudFormation(properties.workgroupName)
  };
}

// @ts-ignore TS6133
function CfnWorkgroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkgroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkgroupProps>();
  ret.addPropertyResult("baseCapacity", "BaseCapacity", (properties.BaseCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.BaseCapacity) : undefined));
  ret.addPropertyResult("configParameters", "ConfigParameters", (properties.ConfigParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnWorkgroupConfigParameterPropertyFromCloudFormation)(properties.ConfigParameters) : undefined));
  ret.addPropertyResult("enhancedVpcRouting", "EnhancedVpcRouting", (properties.EnhancedVpcRouting != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnhancedVpcRouting) : undefined));
  ret.addPropertyResult("namespaceName", "NamespaceName", (properties.NamespaceName != null ? cfn_parse.FromCloudFormation.getString(properties.NamespaceName) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("workgroupName", "WorkgroupName", (properties.WorkgroupName != null ? cfn_parse.FromCloudFormation.getString(properties.WorkgroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}