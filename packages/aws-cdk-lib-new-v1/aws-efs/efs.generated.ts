/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::EFS::AccessPoint` resource creates an EFS access point.
 *
 * An access point is an application-specific view into an EFS file system that applies an operating system user and group, and a file system path, to any file system request made through the access point. The operating system user and group override any identity information provided by the NFS client. The file system path is exposed as the access point's root directory. Applications using the access point can only access data in its own directory and below. To learn more, see [Mounting a file system using EFS access points](https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html) .
 *
 * This operation requires permissions for the `elasticfilesystem:CreateAccessPoint` action.
 *
 * @cloudformationResource AWS::EFS::AccessPoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html
 */
export class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EFS::AccessPoint";

  /**
   * Build a CfnAccessPoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessPointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessPoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the EFS access point.
   *
   * @cloudformationAttribute AccessPointId
   */
  public readonly attrAccessPointId: string;

  /**
   * The Amazon Resource Name (ARN) of the access point.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public accessPointTagsRaw?: Array<CfnAccessPoint.AccessPointTagProperty>;

  /**
   * The opaque string specified in the request to ensure idempotent creation.
   */
  public clientToken?: string;

  /**
   * The ID of the EFS file system that the access point applies to.
   */
  public fileSystemId: string;

  /**
   * The full POSIX identity, including the user ID, group ID, and secondary group IDs on the access point that is used for all file operations by NFS clients using the access point.
   */
  public posixUser?: cdk.IResolvable | CfnAccessPoint.PosixUserProperty;

  /**
   * The directory on the EFS file system that the access point exposes as the root directory to NFS clients using the access point.
   */
  public rootDirectory?: cdk.IResolvable | CfnAccessPoint.RootDirectoryProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessPointProps) {
    super(scope, id, {
      "type": CfnAccessPoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "fileSystemId", this);

    this.attrAccessPointId = cdk.Token.asString(this.getAtt("AccessPointId", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.accessPointTagsRaw = props.accessPointTags;
    this.clientToken = props.clientToken;
    this.fileSystemId = props.fileSystemId;
    this.posixUser = props.posixUser;
    this.rootDirectory = props.rootDirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EFS::AccessPoint", props.accessPointTags, {
      "tagPropertyName": "accessPointTags"
    });
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientToken": this.clientToken,
      "fileSystemId": this.fileSystemId,
      "posixUser": this.posixUser,
      "rootDirectory": this.rootDirectory,
      "accessPointTags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessPointPropsToCloudFormation(props);
  }
}

export namespace CfnAccessPoint {
  /**
   * Specifies the directory on the Amazon EFS file system that the access point provides access to.
   *
   * The access point exposes the specified file system path as the root directory of your file system to applications using the access point. NFS clients using the access point can only access data in the access point's `RootDirectory` and its subdirectories.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-rootdirectory.html
   */
  export interface RootDirectoryProperty {
    /**
     * (Optional) Specifies the POSIX IDs and permissions to apply to the access point's `RootDirectory` .
     *
     * If the `RootDirectory` > `Path` specified does not exist, EFS creates the root directory using the `CreationInfo` settings when a client connects to an access point. When specifying the `CreationInfo` , you must provide values for all properties.
     *
     * > If you do not provide `CreationInfo` and the specified `RootDirectory` > `Path` does not exist, attempts to mount the file system using the access point will fail.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-rootdirectory.html#cfn-efs-accesspoint-rootdirectory-creationinfo
     */
    readonly creationInfo?: CfnAccessPoint.CreationInfoProperty | cdk.IResolvable;

    /**
     * Specifies the path on the EFS file system to expose as the root directory to NFS clients using the access point to access the EFS file system.
     *
     * A path can have up to four subdirectories. If the specified path does not exist, you are required to provide the `CreationInfo` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-rootdirectory.html#cfn-efs-accesspoint-rootdirectory-path
     */
    readonly path?: string;
  }

  /**
   * Required if the `RootDirectory` > `Path` specified does not exist.
   *
   * Specifies the POSIX IDs and permissions to apply to the access point's `RootDirectory` > `Path` . If the access point root directory does not exist, EFS creates it with these settings when a client connects to the access point. When specifying `CreationInfo` , you must include values for all properties.
   *
   * Amazon EFS creates a root directory only if you have provided the CreationInfo: OwnUid, OwnGID, and permissions for the directory. If you do not provide this information, Amazon EFS does not create the root directory. If the root directory does not exist, attempts to mount using the access point will fail.
   *
   * > If you do not provide `CreationInfo` and the specified `RootDirectory` does not exist, attempts to mount the file system using the access point will fail.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html
   */
  export interface CreationInfoProperty {
    /**
     * Specifies the POSIX group ID to apply to the `RootDirectory` .
     *
     * Accepts values from 0 to 2^32 (4294967295).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html#cfn-efs-accesspoint-creationinfo-ownergid
     */
    readonly ownerGid: string;

    /**
     * Specifies the POSIX user ID to apply to the `RootDirectory` .
     *
     * Accepts values from 0 to 2^32 (4294967295).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html#cfn-efs-accesspoint-creationinfo-owneruid
     */
    readonly ownerUid: string;

    /**
     * Specifies the POSIX permissions to apply to the `RootDirectory` , in the format of an octal number representing the file's mode bits.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html#cfn-efs-accesspoint-creationinfo-permissions
     */
    readonly permissions: string;
  }

  /**
   * A tag is a key-value pair attached to a file system.
   *
   * Allowed characters in the `Key` and `Value` properties are letters, white space, and numbers that can be represented in UTF-8, and the following characters: `+ - = . _ : /`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-accesspointtag.html
   */
  export interface AccessPointTagProperty {
    /**
     * The tag key (String).
     *
     * The key can't start with `aws:` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-accesspointtag.html#cfn-efs-accesspoint-accesspointtag-key
     */
    readonly key?: string;

    /**
     * The value of the tag key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-accesspointtag.html#cfn-efs-accesspoint-accesspointtag-value
     */
    readonly value?: string;
  }

  /**
   * The full POSIX identity, including the user ID, group ID, and any secondary group IDs, on the access point that is used for all file system operations performed by NFS clients using the access point.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html
   */
  export interface PosixUserProperty {
    /**
     * The POSIX group ID used for all file system operations using this access point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html#cfn-efs-accesspoint-posixuser-gid
     */
    readonly gid: string;

    /**
     * Secondary POSIX group IDs used for all file system operations using this access point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html#cfn-efs-accesspoint-posixuser-secondarygids
     */
    readonly secondaryGids?: Array<string>;

    /**
     * The POSIX user ID used for all file system operations using this access point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html#cfn-efs-accesspoint-posixuser-uid
     */
    readonly uid: string;
  }
}

/**
 * Properties for defining a `CfnAccessPoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html
 */
export interface CfnAccessPointProps {
  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-accesspointtags
   */
  readonly accessPointTags?: Array<CfnAccessPoint.AccessPointTagProperty>;

  /**
   * The opaque string specified in the request to ensure idempotent creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-clienttoken
   */
  readonly clientToken?: string;

  /**
   * The ID of the EFS file system that the access point applies to.
   *
   * Accepts only the ID format for input when specifying a file system, for example `fs-0123456789abcedf2` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-filesystemid
   */
  readonly fileSystemId: string;

  /**
   * The full POSIX identity, including the user ID, group ID, and secondary group IDs on the access point that is used for all file operations by NFS clients using the access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-posixuser
   */
  readonly posixUser?: cdk.IResolvable | CfnAccessPoint.PosixUserProperty;

  /**
   * The directory on the EFS file system that the access point exposes as the root directory to NFS clients using the access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-rootdirectory
   */
  readonly rootDirectory?: cdk.IResolvable | CfnAccessPoint.RootDirectoryProperty;
}

/**
 * Determine whether the given properties match those of a `CreationInfoProperty`
 *
 * @param properties - the TypeScript properties of a `CreationInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointCreationInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ownerGid", cdk.requiredValidator)(properties.ownerGid));
  errors.collect(cdk.propertyValidator("ownerGid", cdk.validateString)(properties.ownerGid));
  errors.collect(cdk.propertyValidator("ownerUid", cdk.requiredValidator)(properties.ownerUid));
  errors.collect(cdk.propertyValidator("ownerUid", cdk.validateString)(properties.ownerUid));
  errors.collect(cdk.propertyValidator("permissions", cdk.requiredValidator)(properties.permissions));
  errors.collect(cdk.propertyValidator("permissions", cdk.validateString)(properties.permissions));
  return errors.wrap("supplied properties not correct for \"CreationInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointCreationInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointCreationInfoPropertyValidator(properties).assertSuccess();
  return {
    "OwnerGid": cdk.stringToCloudFormation(properties.ownerGid),
    "OwnerUid": cdk.stringToCloudFormation(properties.ownerUid),
    "Permissions": cdk.stringToCloudFormation(properties.permissions)
  };
}

// @ts-ignore TS6133
function CfnAccessPointCreationInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.CreationInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.CreationInfoProperty>();
  ret.addPropertyResult("ownerGid", "OwnerGid", (properties.OwnerGid != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerGid) : undefined));
  ret.addPropertyResult("ownerUid", "OwnerUid", (properties.OwnerUid != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerUid) : undefined));
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getString(properties.Permissions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RootDirectoryProperty`
 *
 * @param properties - the TypeScript properties of a `RootDirectoryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointRootDirectoryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("creationInfo", CfnAccessPointCreationInfoPropertyValidator)(properties.creationInfo));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"RootDirectoryProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointRootDirectoryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointRootDirectoryPropertyValidator(properties).assertSuccess();
  return {
    "CreationInfo": convertCfnAccessPointCreationInfoPropertyToCloudFormation(properties.creationInfo),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnAccessPointRootDirectoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPoint.RootDirectoryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.RootDirectoryProperty>();
  ret.addPropertyResult("creationInfo", "CreationInfo", (properties.CreationInfo != null ? CfnAccessPointCreationInfoPropertyFromCloudFormation(properties.CreationInfo) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessPointTagProperty`
 *
 * @param properties - the TypeScript properties of a `AccessPointTagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointAccessPointTagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"AccessPointTagProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointAccessPointTagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointAccessPointTagPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAccessPointAccessPointTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.AccessPointTagProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.AccessPointTagProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PosixUserProperty`
 *
 * @param properties - the TypeScript properties of a `PosixUserProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointPosixUserPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gid", cdk.requiredValidator)(properties.gid));
  errors.collect(cdk.propertyValidator("gid", cdk.validateString)(properties.gid));
  errors.collect(cdk.propertyValidator("secondaryGids", cdk.listValidator(cdk.validateString))(properties.secondaryGids));
  errors.collect(cdk.propertyValidator("uid", cdk.requiredValidator)(properties.uid));
  errors.collect(cdk.propertyValidator("uid", cdk.validateString)(properties.uid));
  return errors.wrap("supplied properties not correct for \"PosixUserProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPosixUserPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPosixUserPropertyValidator(properties).assertSuccess();
  return {
    "Gid": cdk.stringToCloudFormation(properties.gid),
    "SecondaryGids": cdk.listMapper(cdk.stringToCloudFormation)(properties.secondaryGids),
    "Uid": cdk.stringToCloudFormation(properties.uid)
  };
}

// @ts-ignore TS6133
function CfnAccessPointPosixUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPoint.PosixUserProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.PosixUserProperty>();
  ret.addPropertyResult("gid", "Gid", (properties.Gid != null ? cfn_parse.FromCloudFormation.getString(properties.Gid) : undefined));
  ret.addPropertyResult("secondaryGids", "SecondaryGids", (properties.SecondaryGids != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecondaryGids) : undefined));
  ret.addPropertyResult("uid", "Uid", (properties.Uid != null ? cfn_parse.FromCloudFormation.getString(properties.Uid) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPointProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPointTags", cdk.listValidator(CfnAccessPointAccessPointTagPropertyValidator))(properties.accessPointTags));
  errors.collect(cdk.propertyValidator("clientToken", cdk.validateString)(properties.clientToken));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.requiredValidator)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("posixUser", CfnAccessPointPosixUserPropertyValidator)(properties.posixUser));
  errors.collect(cdk.propertyValidator("rootDirectory", CfnAccessPointRootDirectoryPropertyValidator)(properties.rootDirectory));
  return errors.wrap("supplied properties not correct for \"CfnAccessPointProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPropsValidator(properties).assertSuccess();
  return {
    "AccessPointTags": cdk.listMapper(convertCfnAccessPointAccessPointTagPropertyToCloudFormation)(properties.accessPointTags),
    "ClientToken": cdk.stringToCloudFormation(properties.clientToken),
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "PosixUser": convertCfnAccessPointPosixUserPropertyToCloudFormation(properties.posixUser),
    "RootDirectory": convertCfnAccessPointRootDirectoryPropertyToCloudFormation(properties.rootDirectory)
  };
}

// @ts-ignore TS6133
function CfnAccessPointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPointProps>();
  ret.addPropertyResult("accessPointTags", "AccessPointTags", (properties.AccessPointTags != null ? cfn_parse.FromCloudFormation.getArray(CfnAccessPointAccessPointTagPropertyFromCloudFormation)(properties.AccessPointTags) : undefined));
  ret.addPropertyResult("clientToken", "ClientToken", (properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined));
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("posixUser", "PosixUser", (properties.PosixUser != null ? CfnAccessPointPosixUserPropertyFromCloudFormation(properties.PosixUser) : undefined));
  ret.addPropertyResult("rootDirectory", "RootDirectory", (properties.RootDirectory != null ? CfnAccessPointRootDirectoryPropertyFromCloudFormation(properties.RootDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::EFS::FileSystem` resource creates a new, empty file system in Amazon Elastic File System ( Amazon EFS ).
 *
 * You must create a mount target ( [AWS::EFS::MountTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html) ) to mount your EFS file system on an Amazon EC2 or other AWS cloud compute resource.
 *
 * @cloudformationResource AWS::EFS::FileSystem
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html
 */
export class CfnFileSystem extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EFS::FileSystem";

  /**
   * Build a CfnFileSystem from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFileSystem {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFileSystemPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFileSystem(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the EFS file system.
   *
   * Example: `arn:aws:elasticfilesystem:us-west-2:1111333322228888:file-system/fs-0123456789abcdef8`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the EFS file system. For example: `fs-abcdef0123456789a`
   *
   * @cloudformationAttribute FileSystemId
   */
  public readonly attrFileSystemId: string;

  /**
   * For One Zone file systems, specify the AWS Availability Zone in which to create the file system.
   */
  public availabilityZoneName?: string;

  /**
   * Use the `BackupPolicy` to turn automatic backups on or off for the file system.
   */
  public backupPolicy?: CfnFileSystem.BackupPolicyProperty | cdk.IResolvable;

  /**
   * (Optional) A boolean that specifies whether or not to bypass the `FileSystemPolicy` lockout safety check.
   */
  public bypassPolicyLockoutSafetyCheck?: boolean | cdk.IResolvable;

  /**
   * A Boolean value that, if true, creates an encrypted file system.
   */
  public encrypted?: boolean | cdk.IResolvable;

  /**
   * The `FileSystemPolicy` for the EFS file system.
   */
  public fileSystemPolicy?: any | cdk.IResolvable;

  /**
   * Describes the protection on the file system.
   */
  public fileSystemProtection?: CfnFileSystem.FileSystemProtectionProperty | cdk.IResolvable;

  /**
   * Use to create one or more tags associated with the file system.
   */
  public fileSystemTagsRaw?: Array<CfnFileSystem.ElasticFileSystemTagProperty>;

  /**
   * The ID of the AWS KMS key to be used to protect the encrypted file system.
   */
  public kmsKeyId?: string;

  /**
   * An array of `LifecyclePolicy` objects that define the file system's `LifecycleConfiguration` object.
   */
  public lifecyclePolicies?: Array<cdk.IResolvable | CfnFileSystem.LifecyclePolicyProperty> | cdk.IResolvable;

  /**
   * The Performance mode of the file system.
   */
  public performanceMode?: string;

  /**
   * The throughput, measured in mebibytes per second (MiBps), that you want to provision for a file system that you're creating.
   */
  public provisionedThroughputInMibps?: number;

  /**
   * Describes the replication configuration for a specific file system.
   */
  public replicationConfiguration?: cdk.IResolvable | CfnFileSystem.ReplicationConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies the throughput mode for the file system.
   */
  public throughputMode?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFileSystemProps = {}) {
    super(scope, id, {
      "type": CfnFileSystem.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrFileSystemId = cdk.Token.asString(this.getAtt("FileSystemId", cdk.ResolutionTypeHint.STRING));
    this.availabilityZoneName = props.availabilityZoneName;
    this.backupPolicy = props.backupPolicy;
    this.bypassPolicyLockoutSafetyCheck = props.bypassPolicyLockoutSafetyCheck;
    this.encrypted = props.encrypted;
    this.fileSystemPolicy = props.fileSystemPolicy;
    this.fileSystemProtection = props.fileSystemProtection;
    this.fileSystemTagsRaw = props.fileSystemTags;
    this.kmsKeyId = props.kmsKeyId;
    this.lifecyclePolicies = props.lifecyclePolicies;
    this.performanceMode = props.performanceMode;
    this.provisionedThroughputInMibps = props.provisionedThroughputInMibps;
    this.replicationConfiguration = props.replicationConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EFS::FileSystem", props.fileSystemTags, {
      "tagPropertyName": "fileSystemTags"
    });
    this.throughputMode = props.throughputMode;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::EFS::FileSystem' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "availabilityZoneName": this.availabilityZoneName,
      "backupPolicy": this.backupPolicy,
      "bypassPolicyLockoutSafetyCheck": this.bypassPolicyLockoutSafetyCheck,
      "encrypted": this.encrypted,
      "fileSystemPolicy": this.fileSystemPolicy,
      "fileSystemProtection": this.fileSystemProtection,
      "kmsKeyId": this.kmsKeyId,
      "lifecyclePolicies": this.lifecyclePolicies,
      "performanceMode": this.performanceMode,
      "provisionedThroughputInMibps": this.provisionedThroughputInMibps,
      "replicationConfiguration": this.replicationConfiguration,
      "fileSystemTags": this.tags.renderTags(),
      "throughputMode": this.throughputMode
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFileSystem.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFileSystemPropsToCloudFormation(props);
  }
}

export namespace CfnFileSystem {
  /**
   * A tag is a key-value pair attached to a file system.
   *
   * Allowed characters in the `Key` and `Value` properties are letters, white space, and numbers that can be represented in UTF-8, and the following characters: `+ - = . _ : /`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-elasticfilesystemtag.html
   */
  export interface ElasticFileSystemTagProperty {
    /**
     * The tag key (String).
     *
     * The key can't start with `aws:` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-elasticfilesystemtag.html#cfn-efs-filesystem-elasticfilesystemtag-key
     */
    readonly key: string;

    /**
     * The value of the tag key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-elasticfilesystemtag.html#cfn-efs-filesystem-elasticfilesystemtag-value
     */
    readonly value: string;
  }

  /**
   * Describes a policy used by Lifecycle management that specifies when to transition files into and out of the EFS storage classes.
   *
   * For more information, see [Managing file system storage](https://docs.aws.amazon.com/efs/latest/ug/lifecycle-management-efs.html) .
   *
   * > - Each `LifecyclePolicy` object can have only a single transition. This means that in a request body, `LifecyclePolicies` must be structured as an array of `LifecyclePolicy` objects, one object for each transition, `TransitionToIA` , `TransitionToArchive` , `TransitionToPrimaryStorageClass` .
   * > - See the AWS::EFS::FileSystem examples for the correct `LifecyclePolicy` structure. Do not use the syntax shown on this page.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-lifecyclepolicy.html
   */
  export interface LifecyclePolicyProperty {
    /**
     * The number of days after files were last accessed in primary storage (the Standard storage class) at which to move them to Archive storage.
     *
     * Metadata operations such as listing the contents of a directory don't count as file access events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-lifecyclepolicy.html#cfn-efs-filesystem-lifecyclepolicy-transitiontoarchive
     */
    readonly transitionToArchive?: string;

    /**
     * The number of days after files were last accessed in primary storage (the Standard storage class) at which to move them to Infrequent Access (IA) storage.
     *
     * Metadata operations such as listing the contents of a directory don't count as file access events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-lifecyclepolicy.html#cfn-efs-filesystem-lifecyclepolicy-transitiontoia
     */
    readonly transitionToIa?: string;

    /**
     * Whether to move files back to primary (Standard) storage after they are accessed in IA or Archive storage.
     *
     * Metadata operations such as listing the contents of a directory don't count as file access events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-lifecyclepolicy.html#cfn-efs-filesystem-lifecyclepolicy-transitiontoprimarystorageclass
     */
    readonly transitionToPrimaryStorageClass?: string;
  }

  /**
   * Describes the replication configuration for a specific file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-replicationconfiguration.html
   */
  export interface ReplicationConfigurationProperty {
    /**
     * An array of destination objects.
     *
     * Only one destination object is supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-replicationconfiguration.html#cfn-efs-filesystem-replicationconfiguration-destinations
     */
    readonly destinations?: Array<cdk.IResolvable | CfnFileSystem.ReplicationDestinationProperty> | cdk.IResolvable;
  }

  /**
   * Describes the destination file system in the replication configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-replicationdestination.html
   */
  export interface ReplicationDestinationProperty {
    /**
     * The AWS For One Zone file systems, the replication configuration must specify the Availability Zone in which the destination file system is located.
     *
     * Use the format `us-east-1a` to specify the Availability Zone. For more information about One Zone file systems, see [EFS file system types](https://docs.aws.amazon.com/efs/latest/ug/storage-classes.html) in the *Amazon EFS User Guide* .
     *
     * > One Zone file system type is not available in all Availability Zones in AWS Regions where Amazon EFS is available.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-replicationdestination.html#cfn-efs-filesystem-replicationdestination-availabilityzonename
     */
    readonly availabilityZoneName?: string;

    /**
     * The ID of the destination Amazon EFS file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-replicationdestination.html#cfn-efs-filesystem-replicationdestination-filesystemid
     */
    readonly fileSystemId?: string;

    /**
     * The ID of an AWS KMS key used to protect the encrypted file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-replicationdestination.html#cfn-efs-filesystem-replicationdestination-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The AWS Region in which the destination file system is located.
     *
     * > For One Zone file systems, the replication configuration must specify the AWS Region in which the destination file system is located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-replicationdestination.html#cfn-efs-filesystem-replicationdestination-region
     */
    readonly region?: string;
  }

  /**
   * The backup policy turns automatic backups for the file system on or off.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-backuppolicy.html
   */
  export interface BackupPolicyProperty {
    /**
     * Set the backup policy status for the file system.
     *
     * - *`ENABLED`* - Turns automatic backups on for the file system.
     * - *`DISABLED`* - Turns automatic backups off for the file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-backuppolicy.html#cfn-efs-filesystem-backuppolicy-status
     */
    readonly status: string;
  }

  /**
   * Describes the protection on the file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-filesystemprotection.html
   */
  export interface FileSystemProtectionProperty {
    /**
     * The status of the file system's replication overwrite protection.
     *
     * - `ENABLED` – The file system cannot be used as the destination file system in a replication configuration. The file system is writeable. Replication overwrite protection is `ENABLED` by default.
     * - `DISABLED` – The file system can be used as the destination file system in a replication configuration. The file system is read-only and can only be modified by EFS replication.
     * - `REPLICATING` – The file system is being used as the destination file system in a replication configuration. The file system is read-only and is only modified only by EFS replication.
     *
     * If the replication configuration is deleted, the file system's replication overwrite protection is re-enabled, the file system becomes writeable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-filesystemprotection.html#cfn-efs-filesystem-filesystemprotection-replicationoverwriteprotection
     */
    readonly replicationOverwriteProtection?: string;
  }
}

/**
 * Properties for defining a `CfnFileSystem`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html
 */
export interface CfnFileSystemProps {
  /**
   * For One Zone file systems, specify the AWS Availability Zone in which to create the file system.
   *
   * Use the format `us-east-1a` to specify the Availability Zone. For more information about One Zone file systems, see [EFS file system types](https://docs.aws.amazon.com/efs/latest/ug/availability-durability.html#file-system-type) in the *Amazon EFS User Guide* .
   *
   * > One Zone file systems are not available in all Availability Zones in AWS Regions where Amazon EFS is available.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-availabilityzonename
   */
  readonly availabilityZoneName?: string;

  /**
   * Use the `BackupPolicy` to turn automatic backups on or off for the file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-backuppolicy
   */
  readonly backupPolicy?: CfnFileSystem.BackupPolicyProperty | cdk.IResolvable;

  /**
   * (Optional) A boolean that specifies whether or not to bypass the `FileSystemPolicy` lockout safety check.
   *
   * The lockout safety check determines whether the policy in the request will lock out, or prevent, the IAM principal that is making the request from making future `PutFileSystemPolicy` requests on this file system. Set `BypassPolicyLockoutSafetyCheck` to `True` only when you intend to prevent the IAM principal that is making the request from making subsequent `PutFileSystemPolicy` requests on this file system. The default value is `False` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-bypasspolicylockoutsafetycheck
   */
  readonly bypassPolicyLockoutSafetyCheck?: boolean | cdk.IResolvable;

  /**
   * A Boolean value that, if true, creates an encrypted file system.
   *
   * When creating an encrypted file system, you have the option of specifying a KmsKeyId for an existing AWS KMS key . If you don't specify a KMS key , then the default KMS key for Amazon EFS , `/aws/elasticfilesystem` , is used to protect the encrypted file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-encrypted
   */
  readonly encrypted?: boolean | cdk.IResolvable;

  /**
   * The `FileSystemPolicy` for the EFS file system.
   *
   * A file system policy is an IAM resource policy used to control NFS access to an EFS file system. For more information, see [Using IAM to control NFS access to Amazon EFS](https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html) in the *Amazon EFS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-filesystempolicy
   */
  readonly fileSystemPolicy?: any | cdk.IResolvable;

  /**
   * Describes the protection on the file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-filesystemprotection
   */
  readonly fileSystemProtection?: CfnFileSystem.FileSystemProtectionProperty | cdk.IResolvable;

  /**
   * Use to create one or more tags associated with the file system.
   *
   * Each tag is a user-defined key-value pair. Name your file system on creation by including a `"Key":"Name","Value":"{value}"` key-value pair. Each key must be unique. For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-filesystemtags
   */
  readonly fileSystemTags?: Array<CfnFileSystem.ElasticFileSystemTagProperty>;

  /**
   * The ID of the AWS KMS key to be used to protect the encrypted file system.
   *
   * This parameter is only required if you want to use a nondefault KMS key . If this parameter is not specified, the default KMS key for Amazon EFS is used. This ID can be in one of the following formats:
   *
   * - Key ID - A unique identifier of the key, for example `1234abcd-12ab-34cd-56ef-1234567890ab` .
   * - ARN - An Amazon Resource Name (ARN) for the key, for example `arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab` .
   * - Key alias - A previously created display name for a key, for example `alias/projectKey1` .
   * - Key alias ARN - An ARN for a key alias, for example `arn:aws:kms:us-west-2:444455556666:alias/projectKey1` .
   *
   * If `KmsKeyId` is specified, the `Encrypted` parameter must be set to true.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * An array of `LifecyclePolicy` objects that define the file system's `LifecycleConfiguration` object.
   *
   * A `LifecycleConfiguration` object informs Lifecycle management of the following:
   *
   * - When to move files in the file system from primary storage to IA storage.
   * - When to move files in the file system from primary storage or IA storage to Archive storage.
   * - When to move files that are in IA or Archive storage to primary storage.
   *
   * > Amazon EFS requires that each `LifecyclePolicy` object have only a single transition. This means that in a request body, `LifecyclePolicies` needs to be structured as an array of `LifecyclePolicy` objects, one object for each transition, `TransitionToIA` , `TransitionToArchive` `TransitionToPrimaryStorageClass` . See the example requests in the following section for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-lifecyclepolicies
   */
  readonly lifecyclePolicies?: Array<cdk.IResolvable | CfnFileSystem.LifecyclePolicyProperty> | cdk.IResolvable;

  /**
   * The Performance mode of the file system.
   *
   * We recommend `generalPurpose` performance mode for all file systems. File systems using the `maxIO` performance mode can scale to higher levels of aggregate throughput and operations per second with a tradeoff of slightly higher latencies for most file operations. The performance mode can't be changed after the file system has been created. The `maxIO` mode is not supported on One Zone file systems.
   *
   * > Due to the higher per-operation latencies with Max I/O, we recommend using General Purpose performance mode for all file systems.
   *
   * Default is `generalPurpose` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-performancemode
   */
  readonly performanceMode?: string;

  /**
   * The throughput, measured in mebibytes per second (MiBps), that you want to provision for a file system that you're creating.
   *
   * Required if `ThroughputMode` is set to `provisioned` . Valid values are 1-3414 MiBps, with the upper limit depending on Region. To increase this limit, contact AWS Support . For more information, see [Amazon EFS quotas that you can increase](https://docs.aws.amazon.com/efs/latest/ug/limits.html#soft-limits) in the *Amazon EFS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-provisionedthroughputinmibps
   */
  readonly provisionedThroughputInMibps?: number;

  /**
   * Describes the replication configuration for a specific file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-replicationconfiguration
   */
  readonly replicationConfiguration?: cdk.IResolvable | CfnFileSystem.ReplicationConfigurationProperty;

  /**
   * Specifies the throughput mode for the file system.
   *
   * The mode can be `bursting` , `provisioned` , or `elastic` . If you set `ThroughputMode` to `provisioned` , you must also set a value for `ProvisionedThroughputInMibps` . After you create the file system, you can decrease your file system's Provisioned throughput or change between the throughput modes, with certain time restrictions. For more information, see [Specifying throughput with provisioned mode](https://docs.aws.amazon.com/efs/latest/ug/performance.html#provisioned-throughput) in the *Amazon EFS User Guide* .
   *
   * Default is `bursting` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-throughputmode
   */
  readonly throughputMode?: string;
}

/**
 * Determine whether the given properties match those of a `ElasticFileSystemTagProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticFileSystemTagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFileSystemElasticFileSystemTagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ElasticFileSystemTagProperty\"");
}

// @ts-ignore TS6133
function convertCfnFileSystemElasticFileSystemTagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFileSystemElasticFileSystemTagPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFileSystemElasticFileSystemTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.ElasticFileSystemTagProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.ElasticFileSystemTagProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LifecyclePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `LifecyclePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFileSystemLifecyclePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("transitionToArchive", cdk.validateString)(properties.transitionToArchive));
  errors.collect(cdk.propertyValidator("transitionToIa", cdk.validateString)(properties.transitionToIa));
  errors.collect(cdk.propertyValidator("transitionToPrimaryStorageClass", cdk.validateString)(properties.transitionToPrimaryStorageClass));
  return errors.wrap("supplied properties not correct for \"LifecyclePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFileSystemLifecyclePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFileSystemLifecyclePolicyPropertyValidator(properties).assertSuccess();
  return {
    "TransitionToArchive": cdk.stringToCloudFormation(properties.transitionToArchive),
    "TransitionToIA": cdk.stringToCloudFormation(properties.transitionToIa),
    "TransitionToPrimaryStorageClass": cdk.stringToCloudFormation(properties.transitionToPrimaryStorageClass)
  };
}

// @ts-ignore TS6133
function CfnFileSystemLifecyclePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFileSystem.LifecyclePolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.LifecyclePolicyProperty>();
  ret.addPropertyResult("transitionToArchive", "TransitionToArchive", (properties.TransitionToArchive != null ? cfn_parse.FromCloudFormation.getString(properties.TransitionToArchive) : undefined));
  ret.addPropertyResult("transitionToIa", "TransitionToIA", (properties.TransitionToIA != null ? cfn_parse.FromCloudFormation.getString(properties.TransitionToIA) : undefined));
  ret.addPropertyResult("transitionToPrimaryStorageClass", "TransitionToPrimaryStorageClass", (properties.TransitionToPrimaryStorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.TransitionToPrimaryStorageClass) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFileSystemReplicationDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZoneName", cdk.validateString)(properties.availabilityZoneName));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  return errors.wrap("supplied properties not correct for \"ReplicationDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFileSystemReplicationDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFileSystemReplicationDestinationPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZoneName": cdk.stringToCloudFormation(properties.availabilityZoneName),
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Region": cdk.stringToCloudFormation(properties.region)
  };
}

// @ts-ignore TS6133
function CfnFileSystemReplicationDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFileSystem.ReplicationDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.ReplicationDestinationProperty>();
  ret.addPropertyResult("availabilityZoneName", "AvailabilityZoneName", (properties.AvailabilityZoneName != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZoneName) : undefined));
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFileSystemReplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinations", cdk.listValidator(CfnFileSystemReplicationDestinationPropertyValidator))(properties.destinations));
  return errors.wrap("supplied properties not correct for \"ReplicationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFileSystemReplicationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFileSystemReplicationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Destinations": cdk.listMapper(convertCfnFileSystemReplicationDestinationPropertyToCloudFormation)(properties.destinations)
  };
}

// @ts-ignore TS6133
function CfnFileSystemReplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFileSystem.ReplicationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.ReplicationConfigurationProperty>();
  ret.addPropertyResult("destinations", "Destinations", (properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemReplicationDestinationPropertyFromCloudFormation)(properties.Destinations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BackupPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `BackupPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFileSystemBackupPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"BackupPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFileSystemBackupPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFileSystemBackupPolicyPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnFileSystemBackupPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.BackupPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.BackupPolicyProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FileSystemProtectionProperty`
 *
 * @param properties - the TypeScript properties of a `FileSystemProtectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFileSystemFileSystemProtectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("replicationOverwriteProtection", cdk.validateString)(properties.replicationOverwriteProtection));
  return errors.wrap("supplied properties not correct for \"FileSystemProtectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFileSystemFileSystemProtectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFileSystemFileSystemProtectionPropertyValidator(properties).assertSuccess();
  return {
    "ReplicationOverwriteProtection": cdk.stringToCloudFormation(properties.replicationOverwriteProtection)
  };
}

// @ts-ignore TS6133
function CfnFileSystemFileSystemProtectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.FileSystemProtectionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.FileSystemProtectionProperty>();
  ret.addPropertyResult("replicationOverwriteProtection", "ReplicationOverwriteProtection", (properties.ReplicationOverwriteProtection != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationOverwriteProtection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFileSystemProps`
 *
 * @param properties - the TypeScript properties of a `CfnFileSystemProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFileSystemPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZoneName", cdk.validateString)(properties.availabilityZoneName));
  errors.collect(cdk.propertyValidator("backupPolicy", CfnFileSystemBackupPolicyPropertyValidator)(properties.backupPolicy));
  errors.collect(cdk.propertyValidator("bypassPolicyLockoutSafetyCheck", cdk.validateBoolean)(properties.bypassPolicyLockoutSafetyCheck));
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("fileSystemPolicy", cdk.validateObject)(properties.fileSystemPolicy));
  errors.collect(cdk.propertyValidator("fileSystemProtection", CfnFileSystemFileSystemProtectionPropertyValidator)(properties.fileSystemProtection));
  errors.collect(cdk.propertyValidator("fileSystemTags", cdk.listValidator(CfnFileSystemElasticFileSystemTagPropertyValidator))(properties.fileSystemTags));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("lifecyclePolicies", cdk.listValidator(CfnFileSystemLifecyclePolicyPropertyValidator))(properties.lifecyclePolicies));
  errors.collect(cdk.propertyValidator("performanceMode", cdk.validateString)(properties.performanceMode));
  errors.collect(cdk.propertyValidator("provisionedThroughputInMibps", cdk.validateNumber)(properties.provisionedThroughputInMibps));
  errors.collect(cdk.propertyValidator("replicationConfiguration", CfnFileSystemReplicationConfigurationPropertyValidator)(properties.replicationConfiguration));
  errors.collect(cdk.propertyValidator("throughputMode", cdk.validateString)(properties.throughputMode));
  return errors.wrap("supplied properties not correct for \"CfnFileSystemProps\"");
}

// @ts-ignore TS6133
function convertCfnFileSystemPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFileSystemPropsValidator(properties).assertSuccess();
  return {
    "AvailabilityZoneName": cdk.stringToCloudFormation(properties.availabilityZoneName),
    "BackupPolicy": convertCfnFileSystemBackupPolicyPropertyToCloudFormation(properties.backupPolicy),
    "BypassPolicyLockoutSafetyCheck": cdk.booleanToCloudFormation(properties.bypassPolicyLockoutSafetyCheck),
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "FileSystemPolicy": cdk.objectToCloudFormation(properties.fileSystemPolicy),
    "FileSystemProtection": convertCfnFileSystemFileSystemProtectionPropertyToCloudFormation(properties.fileSystemProtection),
    "FileSystemTags": cdk.listMapper(convertCfnFileSystemElasticFileSystemTagPropertyToCloudFormation)(properties.fileSystemTags),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "LifecyclePolicies": cdk.listMapper(convertCfnFileSystemLifecyclePolicyPropertyToCloudFormation)(properties.lifecyclePolicies),
    "PerformanceMode": cdk.stringToCloudFormation(properties.performanceMode),
    "ProvisionedThroughputInMibps": cdk.numberToCloudFormation(properties.provisionedThroughputInMibps),
    "ReplicationConfiguration": convertCfnFileSystemReplicationConfigurationPropertyToCloudFormation(properties.replicationConfiguration),
    "ThroughputMode": cdk.stringToCloudFormation(properties.throughputMode)
  };
}

// @ts-ignore TS6133
function CfnFileSystemPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystemProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystemProps>();
  ret.addPropertyResult("availabilityZoneName", "AvailabilityZoneName", (properties.AvailabilityZoneName != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZoneName) : undefined));
  ret.addPropertyResult("backupPolicy", "BackupPolicy", (properties.BackupPolicy != null ? CfnFileSystemBackupPolicyPropertyFromCloudFormation(properties.BackupPolicy) : undefined));
  ret.addPropertyResult("bypassPolicyLockoutSafetyCheck", "BypassPolicyLockoutSafetyCheck", (properties.BypassPolicyLockoutSafetyCheck != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BypassPolicyLockoutSafetyCheck) : undefined));
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("fileSystemPolicy", "FileSystemPolicy", (properties.FileSystemPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.FileSystemPolicy) : undefined));
  ret.addPropertyResult("fileSystemProtection", "FileSystemProtection", (properties.FileSystemProtection != null ? CfnFileSystemFileSystemProtectionPropertyFromCloudFormation(properties.FileSystemProtection) : undefined));
  ret.addPropertyResult("fileSystemTags", "FileSystemTags", (properties.FileSystemTags != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemElasticFileSystemTagPropertyFromCloudFormation)(properties.FileSystemTags) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("lifecyclePolicies", "LifecyclePolicies", (properties.LifecyclePolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemLifecyclePolicyPropertyFromCloudFormation)(properties.LifecyclePolicies) : undefined));
  ret.addPropertyResult("performanceMode", "PerformanceMode", (properties.PerformanceMode != null ? cfn_parse.FromCloudFormation.getString(properties.PerformanceMode) : undefined));
  ret.addPropertyResult("provisionedThroughputInMibps", "ProvisionedThroughputInMibps", (properties.ProvisionedThroughputInMibps != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProvisionedThroughputInMibps) : undefined));
  ret.addPropertyResult("replicationConfiguration", "ReplicationConfiguration", (properties.ReplicationConfiguration != null ? CfnFileSystemReplicationConfigurationPropertyFromCloudFormation(properties.ReplicationConfiguration) : undefined));
  ret.addPropertyResult("throughputMode", "ThroughputMode", (properties.ThroughputMode != null ? cfn_parse.FromCloudFormation.getString(properties.ThroughputMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::EFS::MountTarget` resource is an Amazon EFS resource that creates a mount target for an EFS file system.
 *
 * You can then mount the file system on Amazon EC2 instances or other resources by using the mount target.
 *
 * @cloudformationResource AWS::EFS::MountTarget
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html
 */
export class CfnMountTarget extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EFS::MountTarget";

  /**
   * Build a CfnMountTarget from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMountTarget {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMountTargetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMountTarget(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the Amazon EFS file system that the mount target provides access to.
   *
   * Example: `fs-0123456789111222a`
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The IPv4 address of the mount target.
   *
   * Example: 192.0.2.0
   *
   * @cloudformationAttribute IpAddress
   */
  public readonly attrIpAddress: string;

  /**
   * The ID of the file system for which to create the mount target.
   */
  public fileSystemId: string;

  /**
   * Valid IPv4 address within the address range of the specified subnet.
   */
  public ipAddress?: string;

  /**
   * Up to five VPC security group IDs, of the form `sg-xxxxxxxx` .
   */
  public securityGroups: Array<string>;

  /**
   * The ID of the subnet to add the mount target in.
   */
  public subnetId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMountTargetProps) {
    super(scope, id, {
      "type": CfnMountTarget.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "fileSystemId", this);
    cdk.requireProperty(props, "securityGroups", this);
    cdk.requireProperty(props, "subnetId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrIpAddress = cdk.Token.asString(this.getAtt("IpAddress", cdk.ResolutionTypeHint.STRING));
    this.fileSystemId = props.fileSystemId;
    this.ipAddress = props.ipAddress;
    this.securityGroups = props.securityGroups;
    this.subnetId = props.subnetId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "fileSystemId": this.fileSystemId,
      "ipAddress": this.ipAddress,
      "securityGroups": this.securityGroups,
      "subnetId": this.subnetId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMountTarget.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMountTargetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMountTarget`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html
 */
export interface CfnMountTargetProps {
  /**
   * The ID of the file system for which to create the mount target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-filesystemid
   */
  readonly fileSystemId: string;

  /**
   * Valid IPv4 address within the address range of the specified subnet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-ipaddress
   */
  readonly ipAddress?: string;

  /**
   * Up to five VPC security group IDs, of the form `sg-xxxxxxxx` .
   *
   * These must be for the same VPC as subnet specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-securitygroups
   */
  readonly securityGroups: Array<string>;

  /**
   * The ID of the subnet to add the mount target in.
   *
   * For One Zone file systems, use the subnet that is associated with the file system's Availability Zone.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-subnetid
   */
  readonly subnetId: string;
}

/**
 * Determine whether the given properties match those of a `CfnMountTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnMountTargetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMountTargetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.requiredValidator)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("ipAddress", cdk.validateString)(properties.ipAddress));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.requiredValidator)(properties.securityGroups));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnetId", cdk.requiredValidator)(properties.subnetId));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"CfnMountTargetProps\"");
}

// @ts-ignore TS6133
function convertCfnMountTargetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMountTargetPropsValidator(properties).assertSuccess();
  return {
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "IpAddress": cdk.stringToCloudFormation(properties.ipAddress),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnMountTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMountTargetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMountTargetProps>();
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("ipAddress", "IpAddress", (properties.IpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddress) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}