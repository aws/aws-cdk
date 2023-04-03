// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:53:46.174Z","fingerprint":"52HKPRzZnrKndIgRarcTlSkrE5KtIijzAwGDxLE/nRY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAccessPoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html
 */
export interface CfnAccessPointProps {

    /**
     * The ID of the EFS file system that the access point applies to. Accepts only the ID format for input when specifying a file system, for example `fs-0123456789abcedf2` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-filesystemid
     */
    readonly fileSystemId: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-accesspointtags
     */
    readonly accessPointTags?: CfnAccessPoint.AccessPointTagProperty[];

    /**
     * The opaque string specified in the request to ensure idempotent creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-clienttoken
     */
    readonly clientToken?: string;

    /**
     * The full POSIX identity, including the user ID, group ID, and secondary group IDs on the access point that is used for all file operations by NFS clients using the access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-posixuser
     */
    readonly posixUser?: CfnAccessPoint.PosixUserProperty | cdk.IResolvable;

    /**
     * The directory on the Amazon EFS file system that the access point exposes as the root directory to NFS clients using the access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-rootdirectory
     */
    readonly rootDirectory?: CfnAccessPoint.RootDirectoryProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPointProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the result of the validation.
 */
function CfnAccessPointPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessPointTags', cdk.listValidator(CfnAccessPoint_AccessPointTagPropertyValidator))(properties.accessPointTags));
    errors.collect(cdk.propertyValidator('clientToken', cdk.validateString)(properties.clientToken));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.requiredValidator)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('posixUser', CfnAccessPoint_PosixUserPropertyValidator)(properties.posixUser));
    errors.collect(cdk.propertyValidator('rootDirectory', CfnAccessPoint_RootDirectoryPropertyValidator)(properties.rootDirectory));
    return errors.wrap('supplied properties not correct for "CfnAccessPointProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::AccessPoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::AccessPoint` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPointPropsValidator(properties).assertSuccess();
    return {
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        AccessPointTags: cdk.listMapper(cfnAccessPointAccessPointTagPropertyToCloudFormation)(properties.accessPointTags),
        ClientToken: cdk.stringToCloudFormation(properties.clientToken),
        PosixUser: cfnAccessPointPosixUserPropertyToCloudFormation(properties.posixUser),
        RootDirectory: cfnAccessPointRootDirectoryPropertyToCloudFormation(properties.rootDirectory),
    };
}

// @ts-ignore TS6133
function CfnAccessPointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPointProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPointProps>();
    ret.addPropertyResult('fileSystemId', 'FileSystemId', cfn_parse.FromCloudFormation.getString(properties.FileSystemId));
    ret.addPropertyResult('accessPointTags', 'AccessPointTags', properties.AccessPointTags != null ? cfn_parse.FromCloudFormation.getArray(CfnAccessPointAccessPointTagPropertyFromCloudFormation)(properties.AccessPointTags) : undefined as any);
    ret.addPropertyResult('clientToken', 'ClientToken', properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined);
    ret.addPropertyResult('posixUser', 'PosixUser', properties.PosixUser != null ? CfnAccessPointPosixUserPropertyFromCloudFormation(properties.PosixUser) : undefined);
    ret.addPropertyResult('rootDirectory', 'RootDirectory', properties.RootDirectory != null ? CfnAccessPointRootDirectoryPropertyFromCloudFormation(properties.RootDirectory) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EFS::AccessPoint`
 *
 * The `AWS::EFS::AccessPoint` resource creates an EFS access point. An access point is an application-specific view into an EFS file system that applies an operating system user and group, and a file system path, to any file system request made through the access point. The operating system user and group override any identity information provided by the NFS client. The file system path is exposed as the access point's root directory. Applications using the access point can only access data in its own directory and below. To learn more, see [Mounting a file system using EFS access points](https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html) .
 *
 * This operation requires permissions for the `elasticfilesystem:CreateAccessPoint` action.
 *
 * @cloudformationResource AWS::EFS::AccessPoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html
 */
export class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EFS::AccessPoint";

    /**
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
        const ret = new CfnAccessPoint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the EFS access point.
     * @cloudformationAttribute AccessPointId
     */
    public readonly attrAccessPointId: string;

    /**
     * The Amazon Resource Name (ARN) of the access point.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the EFS file system that the access point applies to. Accepts only the ID format for input when specifying a file system, for example `fs-0123456789abcedf2` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-filesystemid
     */
    public fileSystemId: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-accesspointtags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The opaque string specified in the request to ensure idempotent creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-clienttoken
     */
    public clientToken: string | undefined;

    /**
     * The full POSIX identity, including the user ID, group ID, and secondary group IDs on the access point that is used for all file operations by NFS clients using the access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-posixuser
     */
    public posixUser: CfnAccessPoint.PosixUserProperty | cdk.IResolvable | undefined;

    /**
     * The directory on the Amazon EFS file system that the access point exposes as the root directory to NFS clients using the access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-rootdirectory
     */
    public rootDirectory: CfnAccessPoint.RootDirectoryProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::EFS::AccessPoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccessPointProps) {
        super(scope, id, { type: CfnAccessPoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'fileSystemId', this);
        this.attrAccessPointId = cdk.Token.asString(this.getAtt('AccessPointId', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.fileSystemId = props.fileSystemId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EFS::AccessPoint", props.accessPointTags, { tagPropertyName: 'accessPointTags' });
        this.clientToken = props.clientToken;
        this.posixUser = props.posixUser;
        this.rootDirectory = props.rootDirectory;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            fileSystemId: this.fileSystemId,
            accessPointTags: this.tags.renderTags(),
            clientToken: this.clientToken,
            posixUser: this.posixUser,
            rootDirectory: this.rootDirectory,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAccessPointPropsToCloudFormation(props);
    }
}

export namespace CfnAccessPoint {
    /**
     * A tag is a key-value pair attached to a file system. Allowed characters in the `Key` and `Value` properties are letters, white space, and numbers that can be represented in UTF-8, and the following characters: `+ - = . _ : /`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-accesspointtag.html
     */
    export interface AccessPointTagProperty {
        /**
         * The tag key (String). The key can't start with `aws:` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-accesspointtag.html#cfn-efs-accesspoint-accesspointtag-key
         */
        readonly key?: string;
        /**
         * The value of the tag key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-accesspointtag.html#cfn-efs-accesspoint-accesspointtag-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccessPointTagProperty`
 *
 * @param properties - the TypeScript properties of a `AccessPointTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_AccessPointTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "AccessPointTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.AccessPointTag` resource
 *
 * @param properties - the TypeScript properties of a `AccessPointTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.AccessPointTag` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointAccessPointTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPoint_AccessPointTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnAccessPointAccessPointTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.AccessPointTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.AccessPointTagProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPoint {
    /**
     * Required if the `RootDirectory` > `Path` specified does not exist. Specifies the POSIX IDs and permissions to apply to the access point's `RootDirectory` > `Path` . If the access point root directory does not exist, EFS creates it with these settings when a client connects to the access point. When specifying `CreationInfo` , you must include values for all properties.
     *
     * Amazon EFS creates a root directory only if you have provided the CreationInfo: OwnUid, OwnGID, and permissions for the directory. If you do not provide this information, Amazon EFS does not create the root directory. If the root directory does not exist, attempts to mount using the access point will fail.
     *
     * > If you do not provide `CreationInfo` and the specified `RootDirectory` does not exist, attempts to mount the file system using the access point will fail.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html
     */
    export interface CreationInfoProperty {
        /**
         * Specifies the POSIX group ID to apply to the `RootDirectory` . Accepts values from 0 to 2^32 (4294967295).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html#cfn-efs-accesspoint-creationinfo-ownergid
         */
        readonly ownerGid: string;
        /**
         * Specifies the POSIX user ID to apply to the `RootDirectory` . Accepts values from 0 to 2^32 (4294967295).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html#cfn-efs-accesspoint-creationinfo-owneruid
         */
        readonly ownerUid: string;
        /**
         * Specifies the POSIX permissions to apply to the `RootDirectory` , in the format of an octal number representing the file's mode bits.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-creationinfo.html#cfn-efs-accesspoint-creationinfo-permissions
         */
        readonly permissions: string;
    }
}

/**
 * Determine whether the given properties match those of a `CreationInfoProperty`
 *
 * @param properties - the TypeScript properties of a `CreationInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_CreationInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ownerGid', cdk.requiredValidator)(properties.ownerGid));
    errors.collect(cdk.propertyValidator('ownerGid', cdk.validateString)(properties.ownerGid));
    errors.collect(cdk.propertyValidator('ownerUid', cdk.requiredValidator)(properties.ownerUid));
    errors.collect(cdk.propertyValidator('ownerUid', cdk.validateString)(properties.ownerUid));
    errors.collect(cdk.propertyValidator('permissions', cdk.requiredValidator)(properties.permissions));
    errors.collect(cdk.propertyValidator('permissions', cdk.validateString)(properties.permissions));
    return errors.wrap('supplied properties not correct for "CreationInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.CreationInfo` resource
 *
 * @param properties - the TypeScript properties of a `CreationInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.CreationInfo` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointCreationInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPoint_CreationInfoPropertyValidator(properties).assertSuccess();
    return {
        OwnerGid: cdk.stringToCloudFormation(properties.ownerGid),
        OwnerUid: cdk.stringToCloudFormation(properties.ownerUid),
        Permissions: cdk.stringToCloudFormation(properties.permissions),
    };
}

// @ts-ignore TS6133
function CfnAccessPointCreationInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.CreationInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.CreationInfoProperty>();
    ret.addPropertyResult('ownerGid', 'OwnerGid', cfn_parse.FromCloudFormation.getString(properties.OwnerGid));
    ret.addPropertyResult('ownerUid', 'OwnerUid', cfn_parse.FromCloudFormation.getString(properties.OwnerUid));
    ret.addPropertyResult('permissions', 'Permissions', cfn_parse.FromCloudFormation.getString(properties.Permissions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPoint {
    /**
     * The full POSIX identity, including the user ID, group ID, and any secondary group IDs, on the access point that is used for all file system operations performed by NFS clients using the access point.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html
     */
    export interface PosixUserProperty {
        /**
         * The POSIX group ID used for all file system operations using this access point.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html#cfn-efs-accesspoint-posixuser-gid
         */
        readonly gid: string;
        /**
         * Secondary POSIX group IDs used for all file system operations using this access point.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html#cfn-efs-accesspoint-posixuser-secondarygids
         */
        readonly secondaryGids?: string[];
        /**
         * The POSIX user ID used for all file system operations using this access point.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-posixuser.html#cfn-efs-accesspoint-posixuser-uid
         */
        readonly uid: string;
    }
}

/**
 * Determine whether the given properties match those of a `PosixUserProperty`
 *
 * @param properties - the TypeScript properties of a `PosixUserProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_PosixUserPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gid', cdk.requiredValidator)(properties.gid));
    errors.collect(cdk.propertyValidator('gid', cdk.validateString)(properties.gid));
    errors.collect(cdk.propertyValidator('secondaryGids', cdk.listValidator(cdk.validateString))(properties.secondaryGids));
    errors.collect(cdk.propertyValidator('uid', cdk.requiredValidator)(properties.uid));
    errors.collect(cdk.propertyValidator('uid', cdk.validateString)(properties.uid));
    return errors.wrap('supplied properties not correct for "PosixUserProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.PosixUser` resource
 *
 * @param properties - the TypeScript properties of a `PosixUserProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.PosixUser` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointPosixUserPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPoint_PosixUserPropertyValidator(properties).assertSuccess();
    return {
        Gid: cdk.stringToCloudFormation(properties.gid),
        SecondaryGids: cdk.listMapper(cdk.stringToCloudFormation)(properties.secondaryGids),
        Uid: cdk.stringToCloudFormation(properties.uid),
    };
}

// @ts-ignore TS6133
function CfnAccessPointPosixUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.PosixUserProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.PosixUserProperty>();
    ret.addPropertyResult('gid', 'Gid', cfn_parse.FromCloudFormation.getString(properties.Gid));
    ret.addPropertyResult('secondaryGids', 'SecondaryGids', properties.SecondaryGids != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecondaryGids) : undefined);
    ret.addPropertyResult('uid', 'Uid', cfn_parse.FromCloudFormation.getString(properties.Uid));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPoint {
    /**
     * Specifies the directory on the Amazon EFS file system that the access point provides access to. The access point exposes the specified file system path as the root directory of your file system to applications using the access point. NFS clients using the access point can only access data in the access point's `RootDirectory` and it's subdirectories.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-rootdirectory.html
     */
    export interface RootDirectoryProperty {
        /**
         * (Optional) Specifies the POSIX IDs and permissions to apply to the access point's `RootDirectory` . If the `RootDirectory` > `Path` specified does not exist, EFS creates the root directory using the `CreationInfo` settings when a client connects to an access point. When specifying the `CreationInfo` , you must provide values for all properties.
         *
         * > If you do not provide `CreationInfo` and the specified `RootDirectory` > `Path` does not exist, attempts to mount the file system using the access point will fail.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-rootdirectory.html#cfn-efs-accesspoint-rootdirectory-creationinfo
         */
        readonly creationInfo?: CfnAccessPoint.CreationInfoProperty | cdk.IResolvable;
        /**
         * Specifies the path on the EFS file system to expose as the root directory to NFS clients using the access point to access the EFS file system. A path can have up to four subdirectories. If the specified path does not exist, you are required to provide the `CreationInfo` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-accesspoint-rootdirectory.html#cfn-efs-accesspoint-rootdirectory-path
         */
        readonly path?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RootDirectoryProperty`
 *
 * @param properties - the TypeScript properties of a `RootDirectoryProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPoint_RootDirectoryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('creationInfo', CfnAccessPoint_CreationInfoPropertyValidator)(properties.creationInfo));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    return errors.wrap('supplied properties not correct for "RootDirectoryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.RootDirectory` resource
 *
 * @param properties - the TypeScript properties of a `RootDirectoryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::AccessPoint.RootDirectory` resource.
 */
// @ts-ignore TS6133
function cfnAccessPointRootDirectoryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPoint_RootDirectoryPropertyValidator(properties).assertSuccess();
    return {
        CreationInfo: cfnAccessPointCreationInfoPropertyToCloudFormation(properties.creationInfo),
        Path: cdk.stringToCloudFormation(properties.path),
    };
}

// @ts-ignore TS6133
function CfnAccessPointRootDirectoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.RootDirectoryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.RootDirectoryProperty>();
    ret.addPropertyResult('creationInfo', 'CreationInfo', properties.CreationInfo != null ? CfnAccessPointCreationInfoPropertyFromCloudFormation(properties.CreationInfo) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFileSystem`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html
 */
export interface CfnFileSystemProps {

    /**
     * Used to create a file system that uses One Zone storage classes. It specifies the AWS Availability Zone in which to create the file system. Use the format `us-east-1a` to specify the Availability Zone. For more information about One Zone storage classes, see [Using EFS storage classes](https://docs.aws.amazon.com/efs/latest/ug/storage-classes.html) in the *Amazon EFS User Guide* .
     *
     * > One Zone storage classes are not available in all Availability Zones in AWS Regions where Amazon EFS is available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-availabilityzonename
     */
    readonly availabilityZoneName?: string;

    /**
     * Use the `BackupPolicy` to turn automatic backups on or off for the file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-backuppolicy
     */
    readonly backupPolicy?: CfnFileSystem.BackupPolicyProperty | cdk.IResolvable;

    /**
     * (Optional) A boolean that specifies whether or not to bypass the `FileSystemPolicy` lockout safety check. The lockout safety check determines whether the policy in the request will lock out, or prevent, the IAM principal that is making the request from making future `PutFileSystemPolicy` requests on this file system. Set `BypassPolicyLockoutSafetyCheck` to `True` only when you intend to prevent the IAM principal that is making the request from making subsequent `PutFileSystemPolicy` requests on this file system. The default value is `False` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-bypasspolicylockoutsafetycheck
     */
    readonly bypassPolicyLockoutSafetyCheck?: boolean | cdk.IResolvable;

    /**
     * A Boolean value that, if true, creates an encrypted file system. When creating an encrypted file system, you have the option of specifying a KmsKeyId for an existing AWS KMS key . If you don't specify a KMS key , then the default KMS key for Amazon EFS , `/aws/elasticfilesystem` , is used to protect the encrypted file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-encrypted
     */
    readonly encrypted?: boolean | cdk.IResolvable;

    /**
     * The `FileSystemPolicy` for the EFS file system. A file system policy is an IAM resource policy used to control NFS access to an EFS file system. For more information, see [Using IAM to control NFS access to Amazon EFS](https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html) in the *Amazon EFS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-filesystempolicy
     */
    readonly fileSystemPolicy?: any | cdk.IResolvable;

    /**
     * Use to create one or more tags associated with the file system. Each tag is a user-defined key-value pair. Name your file system on creation by including a `"Key":"Name","Value":"{value}"` key-value pair. Each key must be unique. For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-filesystemtags
     */
    readonly fileSystemTags?: CfnFileSystem.ElasticFileSystemTagProperty[];

    /**
     * The ID of the AWS KMS key to be used to protect the encrypted file system. This parameter is only required if you want to use a nondefault KMS key . If this parameter is not specified, the default KMS key for Amazon EFS is used. This ID can be in one of the following formats:
     *
     * - Key ID - A unique identifier of the key, for example `1234abcd-12ab-34cd-56ef-1234567890ab` .
     * - ARN - An Amazon Resource Name (ARN) for the key, for example `arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab` .
     * - Key alias - A previously created display name for a key, for example `alias/projectKey1` .
     * - Key alias ARN - An ARN for a key alias, for example `arn:aws:kms:us-west-2:444455556666:alias/projectKey1` .
     *
     * If `KmsKeyId` is specified, the `Encrypted` parameter must be set to true.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * An array of `LifecyclePolicy` objects that define the file system's `LifecycleConfiguration` object. A `LifecycleConfiguration` object informs EFS lifecycle management and intelligent tiering of the following:
     *
     * - When to move files in the file system from primary storage to the IA storage class.
     * - When to move files that are in IA storage to primary storage.
     *
     * > Amazon EFS requires that each `LifecyclePolicy` object have only a single transition. This means that in a request body, `LifecyclePolicies` needs to be structured as an array of `LifecyclePolicy` objects, one object for each transition, `TransitionToIA` , `TransitionToPrimaryStorageClass` . See the example requests in the following section for more information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-lifecyclepolicies
     */
    readonly lifecyclePolicies?: Array<CfnFileSystem.LifecyclePolicyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The performance mode of the file system. We recommend `generalPurpose` performance mode for most file systems. File systems using the `maxIO` performance mode can scale to higher levels of aggregate throughput and operations per second with a tradeoff of slightly higher latencies for most file operations. The performance mode can't be changed after the file system has been created.
     *
     * > The `maxIO` mode is not supported on file systems using One Zone storage classes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-performancemode
     */
    readonly performanceMode?: string;

    /**
     * The throughput, measured in MiB/s, that you want to provision for a file system that you're creating. Valid values are 1-1024. Required if `ThroughputMode` is set to `provisioned` . The upper limit for throughput is 1024 MiB/s. To increase this limit, contact AWS Support . For more information, see [Amazon EFS quotas that you can increase](https://docs.aws.amazon.com/efs/latest/ug/limits.html#soft-limits) in the *Amazon EFS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-provisionedthroughputinmibps
     */
    readonly provisionedThroughputInMibps?: number;

    /**
     * Specifies the throughput mode for the file system. The mode can be `bursting` , `provisioned` , or `elastic` . If you set `ThroughputMode` to `provisioned` , you must also set a value for `ProvisionedThroughputInMibps` . After you create the file system, you can decrease your file system's throughput in Provisioned Throughput mode or change between the throughput modes, with certain time restrictions. For more information, see [Specifying throughput with provisioned mode](https://docs.aws.amazon.com/efs/latest/ug/performance.html#provisioned-throughput) in the *Amazon EFS User Guide* .
     *
     * Default is `bursting` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-throughputmode
     */
    readonly throughputMode?: string;
}

/**
 * Determine whether the given properties match those of a `CfnFileSystemProps`
 *
 * @param properties - the TypeScript properties of a `CfnFileSystemProps`
 *
 * @returns the result of the validation.
 */
function CfnFileSystemPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZoneName', cdk.validateString)(properties.availabilityZoneName));
    errors.collect(cdk.propertyValidator('backupPolicy', CfnFileSystem_BackupPolicyPropertyValidator)(properties.backupPolicy));
    errors.collect(cdk.propertyValidator('bypassPolicyLockoutSafetyCheck', cdk.validateBoolean)(properties.bypassPolicyLockoutSafetyCheck));
    errors.collect(cdk.propertyValidator('encrypted', cdk.validateBoolean)(properties.encrypted));
    errors.collect(cdk.propertyValidator('fileSystemPolicy', cdk.validateObject)(properties.fileSystemPolicy));
    errors.collect(cdk.propertyValidator('fileSystemTags', cdk.listValidator(CfnFileSystem_ElasticFileSystemTagPropertyValidator))(properties.fileSystemTags));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('lifecyclePolicies', cdk.listValidator(CfnFileSystem_LifecyclePolicyPropertyValidator))(properties.lifecyclePolicies));
    errors.collect(cdk.propertyValidator('performanceMode', cdk.validateString)(properties.performanceMode));
    errors.collect(cdk.propertyValidator('provisionedThroughputInMibps', cdk.validateNumber)(properties.provisionedThroughputInMibps));
    errors.collect(cdk.propertyValidator('throughputMode', cdk.validateString)(properties.throughputMode));
    return errors.wrap('supplied properties not correct for "CfnFileSystemProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::FileSystem` resource
 *
 * @param properties - the TypeScript properties of a `CfnFileSystemProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::FileSystem` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystemPropsValidator(properties).assertSuccess();
    return {
        AvailabilityZoneName: cdk.stringToCloudFormation(properties.availabilityZoneName),
        BackupPolicy: cfnFileSystemBackupPolicyPropertyToCloudFormation(properties.backupPolicy),
        BypassPolicyLockoutSafetyCheck: cdk.booleanToCloudFormation(properties.bypassPolicyLockoutSafetyCheck),
        Encrypted: cdk.booleanToCloudFormation(properties.encrypted),
        FileSystemPolicy: cdk.objectToCloudFormation(properties.fileSystemPolicy),
        FileSystemTags: cdk.listMapper(cfnFileSystemElasticFileSystemTagPropertyToCloudFormation)(properties.fileSystemTags),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        LifecyclePolicies: cdk.listMapper(cfnFileSystemLifecyclePolicyPropertyToCloudFormation)(properties.lifecyclePolicies),
        PerformanceMode: cdk.stringToCloudFormation(properties.performanceMode),
        ProvisionedThroughputInMibps: cdk.numberToCloudFormation(properties.provisionedThroughputInMibps),
        ThroughputMode: cdk.stringToCloudFormation(properties.throughputMode),
    };
}

// @ts-ignore TS6133
function CfnFileSystemPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystemProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystemProps>();
    ret.addPropertyResult('availabilityZoneName', 'AvailabilityZoneName', properties.AvailabilityZoneName != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZoneName) : undefined);
    ret.addPropertyResult('backupPolicy', 'BackupPolicy', properties.BackupPolicy != null ? CfnFileSystemBackupPolicyPropertyFromCloudFormation(properties.BackupPolicy) : undefined);
    ret.addPropertyResult('bypassPolicyLockoutSafetyCheck', 'BypassPolicyLockoutSafetyCheck', properties.BypassPolicyLockoutSafetyCheck != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BypassPolicyLockoutSafetyCheck) : undefined);
    ret.addPropertyResult('encrypted', 'Encrypted', properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined);
    ret.addPropertyResult('fileSystemPolicy', 'FileSystemPolicy', properties.FileSystemPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.FileSystemPolicy) : undefined);
    ret.addPropertyResult('fileSystemTags', 'FileSystemTags', properties.FileSystemTags != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemElasticFileSystemTagPropertyFromCloudFormation)(properties.FileSystemTags) : undefined as any);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('lifecyclePolicies', 'LifecyclePolicies', properties.LifecyclePolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemLifecyclePolicyPropertyFromCloudFormation)(properties.LifecyclePolicies) : undefined);
    ret.addPropertyResult('performanceMode', 'PerformanceMode', properties.PerformanceMode != null ? cfn_parse.FromCloudFormation.getString(properties.PerformanceMode) : undefined);
    ret.addPropertyResult('provisionedThroughputInMibps', 'ProvisionedThroughputInMibps', properties.ProvisionedThroughputInMibps != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProvisionedThroughputInMibps) : undefined);
    ret.addPropertyResult('throughputMode', 'ThroughputMode', properties.ThroughputMode != null ? cfn_parse.FromCloudFormation.getString(properties.ThroughputMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EFS::FileSystem`
 *
 * The `AWS::EFS::FileSystem` resource creates a new, empty file system in Amazon Elastic File System ( Amazon EFS ). You must create a mount target ( [AWS::EFS::MountTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html) ) to mount your EFS file system on an Amazon EC2 or other AWS cloud compute resource.
 *
 * @cloudformationResource AWS::EFS::FileSystem
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html
 */
export class CfnFileSystem extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EFS::FileSystem";

    /**
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
        const ret = new CfnFileSystem(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the EFS file system.
     *
     * Example: `arn:aws:elasticfilesystem:us-west-2:1111333322228888:file-system/fs-0123456789abcdef8`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the EFS file system. For example: `fs-abcdef0123456789a`
     * @cloudformationAttribute FileSystemId
     */
    public readonly attrFileSystemId: string;

    /**
     * Used to create a file system that uses One Zone storage classes. It specifies the AWS Availability Zone in which to create the file system. Use the format `us-east-1a` to specify the Availability Zone. For more information about One Zone storage classes, see [Using EFS storage classes](https://docs.aws.amazon.com/efs/latest/ug/storage-classes.html) in the *Amazon EFS User Guide* .
     *
     * > One Zone storage classes are not available in all Availability Zones in AWS Regions where Amazon EFS is available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-availabilityzonename
     */
    public availabilityZoneName: string | undefined;

    /**
     * Use the `BackupPolicy` to turn automatic backups on or off for the file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-backuppolicy
     */
    public backupPolicy: CfnFileSystem.BackupPolicyProperty | cdk.IResolvable | undefined;

    /**
     * (Optional) A boolean that specifies whether or not to bypass the `FileSystemPolicy` lockout safety check. The lockout safety check determines whether the policy in the request will lock out, or prevent, the IAM principal that is making the request from making future `PutFileSystemPolicy` requests on this file system. Set `BypassPolicyLockoutSafetyCheck` to `True` only when you intend to prevent the IAM principal that is making the request from making subsequent `PutFileSystemPolicy` requests on this file system. The default value is `False` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-bypasspolicylockoutsafetycheck
     */
    public bypassPolicyLockoutSafetyCheck: boolean | cdk.IResolvable | undefined;

    /**
     * A Boolean value that, if true, creates an encrypted file system. When creating an encrypted file system, you have the option of specifying a KmsKeyId for an existing AWS KMS key . If you don't specify a KMS key , then the default KMS key for Amazon EFS , `/aws/elasticfilesystem` , is used to protect the encrypted file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-encrypted
     */
    public encrypted: boolean | cdk.IResolvable | undefined;

    /**
     * The `FileSystemPolicy` for the EFS file system. A file system policy is an IAM resource policy used to control NFS access to an EFS file system. For more information, see [Using IAM to control NFS access to Amazon EFS](https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html) in the *Amazon EFS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-filesystempolicy
     */
    public fileSystemPolicy: any | cdk.IResolvable | undefined;

    /**
     * Use to create one or more tags associated with the file system. Each tag is a user-defined key-value pair. Name your file system on creation by including a `"Key":"Name","Value":"{value}"` key-value pair. Each key must be unique. For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in the *AWS General Reference Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-filesystemtags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ID of the AWS KMS key to be used to protect the encrypted file system. This parameter is only required if you want to use a nondefault KMS key . If this parameter is not specified, the default KMS key for Amazon EFS is used. This ID can be in one of the following formats:
     *
     * - Key ID - A unique identifier of the key, for example `1234abcd-12ab-34cd-56ef-1234567890ab` .
     * - ARN - An Amazon Resource Name (ARN) for the key, for example `arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab` .
     * - Key alias - A previously created display name for a key, for example `alias/projectKey1` .
     * - Key alias ARN - An ARN for a key alias, for example `arn:aws:kms:us-west-2:444455556666:alias/projectKey1` .
     *
     * If `KmsKeyId` is specified, the `Encrypted` parameter must be set to true.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * An array of `LifecyclePolicy` objects that define the file system's `LifecycleConfiguration` object. A `LifecycleConfiguration` object informs EFS lifecycle management and intelligent tiering of the following:
     *
     * - When to move files in the file system from primary storage to the IA storage class.
     * - When to move files that are in IA storage to primary storage.
     *
     * > Amazon EFS requires that each `LifecyclePolicy` object have only a single transition. This means that in a request body, `LifecyclePolicies` needs to be structured as an array of `LifecyclePolicy` objects, one object for each transition, `TransitionToIA` , `TransitionToPrimaryStorageClass` . See the example requests in the following section for more information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-lifecyclepolicies
     */
    public lifecyclePolicies: Array<CfnFileSystem.LifecyclePolicyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The performance mode of the file system. We recommend `generalPurpose` performance mode for most file systems. File systems using the `maxIO` performance mode can scale to higher levels of aggregate throughput and operations per second with a tradeoff of slightly higher latencies for most file operations. The performance mode can't be changed after the file system has been created.
     *
     * > The `maxIO` mode is not supported on file systems using One Zone storage classes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-performancemode
     */
    public performanceMode: string | undefined;

    /**
     * The throughput, measured in MiB/s, that you want to provision for a file system that you're creating. Valid values are 1-1024. Required if `ThroughputMode` is set to `provisioned` . The upper limit for throughput is 1024 MiB/s. To increase this limit, contact AWS Support . For more information, see [Amazon EFS quotas that you can increase](https://docs.aws.amazon.com/efs/latest/ug/limits.html#soft-limits) in the *Amazon EFS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-provisionedthroughputinmibps
     */
    public provisionedThroughputInMibps: number | undefined;

    /**
     * Specifies the throughput mode for the file system. The mode can be `bursting` , `provisioned` , or `elastic` . If you set `ThroughputMode` to `provisioned` , you must also set a value for `ProvisionedThroughputInMibps` . After you create the file system, you can decrease your file system's throughput in Provisioned Throughput mode or change between the throughput modes, with certain time restrictions. For more information, see [Specifying throughput with provisioned mode](https://docs.aws.amazon.com/efs/latest/ug/performance.html#provisioned-throughput) in the *Amazon EFS User Guide* .
     *
     * Default is `bursting` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-throughputmode
     */
    public throughputMode: string | undefined;

    /**
     * Create a new `AWS::EFS::FileSystem`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFileSystemProps = {}) {
        super(scope, id, { type: CfnFileSystem.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrFileSystemId = cdk.Token.asString(this.getAtt('FileSystemId', cdk.ResolutionTypeHint.STRING));

        this.availabilityZoneName = props.availabilityZoneName;
        this.backupPolicy = props.backupPolicy;
        this.bypassPolicyLockoutSafetyCheck = props.bypassPolicyLockoutSafetyCheck;
        this.encrypted = props.encrypted;
        this.fileSystemPolicy = props.fileSystemPolicy;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EFS::FileSystem", props.fileSystemTags, { tagPropertyName: 'fileSystemTags' });
        this.kmsKeyId = props.kmsKeyId;
        this.lifecyclePolicies = props.lifecyclePolicies;
        this.performanceMode = props.performanceMode;
        this.provisionedThroughputInMibps = props.provisionedThroughputInMibps;
        this.throughputMode = props.throughputMode;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::EFS::FileSystem\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
              : [] });
        }
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFileSystem.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            availabilityZoneName: this.availabilityZoneName,
            backupPolicy: this.backupPolicy,
            bypassPolicyLockoutSafetyCheck: this.bypassPolicyLockoutSafetyCheck,
            encrypted: this.encrypted,
            fileSystemPolicy: this.fileSystemPolicy,
            fileSystemTags: this.tags.renderTags(),
            kmsKeyId: this.kmsKeyId,
            lifecyclePolicies: this.lifecyclePolicies,
            performanceMode: this.performanceMode,
            provisionedThroughputInMibps: this.provisionedThroughputInMibps,
            throughputMode: this.throughputMode,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFileSystemPropsToCloudFormation(props);
    }
}

export namespace CfnFileSystem {
    /**
     * The backup policy turns automatic backups for the file system on or off.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-backuppolicy.html
     */
    export interface BackupPolicyProperty {
        /**
         * Set the backup policy status for the file system.
         *
         * - *`ENABLED`* - Turns automatic backups on for the file system.
         * - *`DISABLED`* - Turns automatic backups off for the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-backuppolicy.html#cfn-efs-filesystem-backuppolicy-status
         */
        readonly status: string;
    }
}

/**
 * Determine whether the given properties match those of a `BackupPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `BackupPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_BackupPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('status', cdk.requiredValidator)(properties.status));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "BackupPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::FileSystem.BackupPolicy` resource
 *
 * @param properties - the TypeScript properties of a `BackupPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::FileSystem.BackupPolicy` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemBackupPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_BackupPolicyPropertyValidator(properties).assertSuccess();
    return {
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnFileSystemBackupPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.BackupPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.BackupPolicyProperty>();
    ret.addPropertyResult('status', 'Status', cfn_parse.FromCloudFormation.getString(properties.Status));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * A tag is a key-value pair attached to a file system. Allowed characters in the `Key` and `Value` properties are letters, white space, and numbers that can be represented in UTF-8, and the following characters: `+ - = . _ : /`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-elasticfilesystemtag.html
     */
    export interface ElasticFileSystemTagProperty {
        /**
         * The tag key (String). The key can't start with `aws:` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-elasticfilesystemtag.html#cfn-efs-filesystem-elasticfilesystemtag-key
         */
        readonly key: string;
        /**
         * The value of the tag key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-elasticfilesystemtag.html#cfn-efs-filesystem-elasticfilesystemtag-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `ElasticFileSystemTagProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticFileSystemTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_ElasticFileSystemTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ElasticFileSystemTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::FileSystem.ElasticFileSystemTag` resource
 *
 * @param properties - the TypeScript properties of a `ElasticFileSystemTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::FileSystem.ElasticFileSystemTag` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemElasticFileSystemTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_ElasticFileSystemTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnFileSystemElasticFileSystemTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.ElasticFileSystemTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.ElasticFileSystemTagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * Describes a policy used by EFS lifecycle management and EFS Intelligent-Tiering that specifies when to transition files into and out of the file system's Infrequent Access (IA) storage class. For more information, see [EFS Intelligent‐Tiering and EFS Lifecycle Management](https://docs.aws.amazon.com/efs/latest/ug/lifecycle-management-efs.html) .
     *
     * > - Each `LifecyclePolicy` object can have only a single transition. This means that in a request body, `LifecyclePolicies` must be structured as an array of `LifecyclePolicy` objects, one object for each transition, `TransitionToIA` , `TransitionToPrimaryStorageClass` .
     * > - See the AWS::EFS::FileSystem examples for the correct `LifecyclePolicy` structure. Do not use the syntax shown on this page.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-lifecyclepolicy.html
     */
    export interface LifecyclePolicyProperty {
        /**
         * Describes the period of time that a file is not accessed, after which it transitions to IA storage. Metadata operations such as listing the contents of a directory don't count as file access events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-lifecyclepolicy.html#cfn-efs-filesystem-lifecyclepolicy-transitiontoia
         */
        readonly transitionToIa?: string;
        /**
         * Describes when to transition a file from IA storage to primary storage. Metadata operations such as listing the contents of a directory don't count as file access events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-efs-filesystem-lifecyclepolicy.html#cfn-efs-filesystem-lifecyclepolicy-transitiontoprimarystorageclass
         */
        readonly transitionToPrimaryStorageClass?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LifecyclePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `LifecyclePolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_LifecyclePolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('transitionToIa', cdk.validateString)(properties.transitionToIa));
    errors.collect(cdk.propertyValidator('transitionToPrimaryStorageClass', cdk.validateString)(properties.transitionToPrimaryStorageClass));
    return errors.wrap('supplied properties not correct for "LifecyclePolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::FileSystem.LifecyclePolicy` resource
 *
 * @param properties - the TypeScript properties of a `LifecyclePolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::FileSystem.LifecyclePolicy` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemLifecyclePolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_LifecyclePolicyPropertyValidator(properties).assertSuccess();
    return {
        TransitionToIA: cdk.stringToCloudFormation(properties.transitionToIa),
        TransitionToPrimaryStorageClass: cdk.stringToCloudFormation(properties.transitionToPrimaryStorageClass),
    };
}

// @ts-ignore TS6133
function CfnFileSystemLifecyclePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.LifecyclePolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.LifecyclePolicyProperty>();
    ret.addPropertyResult('transitionToIa', 'TransitionToIA', properties.TransitionToIA != null ? cfn_parse.FromCloudFormation.getString(properties.TransitionToIA) : undefined);
    ret.addPropertyResult('transitionToPrimaryStorageClass', 'TransitionToPrimaryStorageClass', properties.TransitionToPrimaryStorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.TransitionToPrimaryStorageClass) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnMountTarget`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html
 */
export interface CfnMountTargetProps {

    /**
     * The ID of the file system for which to create the mount target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-filesystemid
     */
    readonly fileSystemId: string;

    /**
     * Up to five VPC security group IDs, of the form `sg-xxxxxxxx` . These must be for the same VPC as subnet specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-securitygroups
     */
    readonly securityGroups: string[];

    /**
     * The ID of the subnet to add the mount target in. For file systems that use One Zone storage classes, use the subnet that is associated with the file system's Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-subnetid
     */
    readonly subnetId: string;

    /**
     * Valid IPv4 address within the address range of the specified subnet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-ipaddress
     */
    readonly ipAddress?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMountTargetProps`
 *
 * @param properties - the TypeScript properties of a `CfnMountTargetProps`
 *
 * @returns the result of the validation.
 */
function CfnMountTargetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.requiredValidator)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('ipAddress', cdk.validateString)(properties.ipAddress));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.requiredValidator)(properties.securityGroups));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.listValidator(cdk.validateString))(properties.securityGroups));
    errors.collect(cdk.propertyValidator('subnetId', cdk.requiredValidator)(properties.subnetId));
    errors.collect(cdk.propertyValidator('subnetId', cdk.validateString)(properties.subnetId));
    return errors.wrap('supplied properties not correct for "CfnMountTargetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EFS::MountTarget` resource
 *
 * @param properties - the TypeScript properties of a `CfnMountTargetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EFS::MountTarget` resource.
 */
// @ts-ignore TS6133
function cfnMountTargetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMountTargetPropsValidator(properties).assertSuccess();
    return {
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        SecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
        SubnetId: cdk.stringToCloudFormation(properties.subnetId),
        IpAddress: cdk.stringToCloudFormation(properties.ipAddress),
    };
}

// @ts-ignore TS6133
function CfnMountTargetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMountTargetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMountTargetProps>();
    ret.addPropertyResult('fileSystemId', 'FileSystemId', cfn_parse.FromCloudFormation.getString(properties.FileSystemId));
    ret.addPropertyResult('securityGroups', 'SecurityGroups', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroups));
    ret.addPropertyResult('subnetId', 'SubnetId', cfn_parse.FromCloudFormation.getString(properties.SubnetId));
    ret.addPropertyResult('ipAddress', 'IpAddress', properties.IpAddress != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddress) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EFS::MountTarget`
 *
 * The `AWS::EFS::MountTarget` resource is an Amazon EFS resource that creates a mount target for an EFS file system. You can then mount the file system on Amazon EC2 instances or other resources by using the mount target.
 *
 * @cloudformationResource AWS::EFS::MountTarget
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html
 */
export class CfnMountTarget extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EFS::MountTarget";

    /**
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
        const ret = new CfnMountTarget(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the Amazon EFS file system that the mount target provides access to.
     *
     * Example: `fs-0123456789111222a`
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The IPv4 address of the mount target.
     *
     * Example: 192.0.2.0
     * @cloudformationAttribute IpAddress
     */
    public readonly attrIpAddress: string;

    /**
     * The ID of the file system for which to create the mount target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-filesystemid
     */
    public fileSystemId: string;

    /**
     * Up to five VPC security group IDs, of the form `sg-xxxxxxxx` . These must be for the same VPC as subnet specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-securitygroups
     */
    public securityGroups: string[];

    /**
     * The ID of the subnet to add the mount target in. For file systems that use One Zone storage classes, use the subnet that is associated with the file system's Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-subnetid
     */
    public subnetId: string;

    /**
     * Valid IPv4 address within the address range of the specified subnet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html#cfn-efs-mounttarget-ipaddress
     */
    public ipAddress: string | undefined;

    /**
     * Create a new `AWS::EFS::MountTarget`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMountTargetProps) {
        super(scope, id, { type: CfnMountTarget.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'fileSystemId', this);
        cdk.requireProperty(props, 'securityGroups', this);
        cdk.requireProperty(props, 'subnetId', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrIpAddress = cdk.Token.asString(this.getAtt('IpAddress', cdk.ResolutionTypeHint.STRING));

        this.fileSystemId = props.fileSystemId;
        this.securityGroups = props.securityGroups;
        this.subnetId = props.subnetId;
        this.ipAddress = props.ipAddress;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMountTarget.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            fileSystemId: this.fileSystemId,
            securityGroups: this.securityGroups,
            subnetId: this.subnetId,
            ipAddress: this.ipAddress,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMountTargetPropsToCloudFormation(props);
    }
}
