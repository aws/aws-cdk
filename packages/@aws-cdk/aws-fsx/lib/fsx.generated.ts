// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:39:57.447Z","fingerprint":"oHK2dk6SrFZdPt9tEnU2aTs8zzsqI7xrVimrx+Hp/Ws="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDataRepositoryAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html
 */
export interface CfnDataRepositoryAssociationProps {

    /**
     * The path to the Amazon S3 data repository that will be linked to the file system. The path can be an S3 bucket or prefix in the format `s3://myBucket/myPrefix/` . This path specifies where in the S3 data repository files will be imported from or exported to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-datarepositorypath
     */
    readonly dataRepositoryPath: string;

    /**
     * The ID of the file system on which the data repository association is configured.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-filesystemid
     */
    readonly fileSystemId: string;

    /**
     * A path on the Amazon FSx for Lustre file system that points to a high-level directory (such as `/ns1/` ) or subdirectory (such as `/ns1/subdir/` ) that will be mapped 1-1 with `DataRepositoryPath` . The leading forward slash in the name is required. Two data repository associations cannot have overlapping file system paths. For example, if a data repository is associated with file system path `/ns1/` , then you cannot link another data repository with file system path `/ns1/ns2` .
     *
     * This path specifies where in your file system files will be exported from or imported to. This file system directory can be linked to only one Amazon S3 bucket, and no other S3 bucket can be linked to the directory.
     *
     * > If you specify only a forward slash ( `/` ) as the file system path, you can link only one data repository to the file system. You can only specify "/" as the file system path for the first data repository associated with a file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-filesystempath
     */
    readonly fileSystemPath: string;

    /**
     * A boolean flag indicating whether an import data repository task to import metadata should run after the data repository association is created. The task runs if this flag is set to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-batchimportmetadataoncreate
     */
    readonly batchImportMetaDataOnCreate?: boolean | cdk.IResolvable;

    /**
     * For files imported from a data repository, this value determines the stripe count and maximum amount of data per file (in MiB) stored on a single physical disk. The maximum number of disks that a single file can be striped across is limited by the total number of disks that make up the file system or cache.
     *
     * The default chunk size is 1,024 MiB (1 GiB) and can go as high as 512,000 MiB (500 GiB). Amazon S3 objects have a maximum size of 5 TB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-importedfilechunksize
     */
    readonly importedFileChunkSize?: number;

    /**
     * The configuration for an Amazon S3 data repository linked to an Amazon FSx Lustre file system with a data repository association. The configuration defines which file events (new, changed, or deleted files or directories) are automatically imported from the linked data repository to the file system or automatically exported from the file system to the data repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-s3
     */
    readonly s3?: CfnDataRepositoryAssociation.S3Property | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDataRepositoryAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataRepositoryAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnDataRepositoryAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchImportMetaDataOnCreate', cdk.validateBoolean)(properties.batchImportMetaDataOnCreate));
    errors.collect(cdk.propertyValidator('dataRepositoryPath', cdk.requiredValidator)(properties.dataRepositoryPath));
    errors.collect(cdk.propertyValidator('dataRepositoryPath', cdk.validateString)(properties.dataRepositoryPath));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.requiredValidator)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('fileSystemPath', cdk.requiredValidator)(properties.fileSystemPath));
    errors.collect(cdk.propertyValidator('fileSystemPath', cdk.validateString)(properties.fileSystemPath));
    errors.collect(cdk.propertyValidator('importedFileChunkSize', cdk.validateNumber)(properties.importedFileChunkSize));
    errors.collect(cdk.propertyValidator('s3', CfnDataRepositoryAssociation_S3PropertyValidator)(properties.s3));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDataRepositoryAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataRepositoryAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation` resource.
 */
// @ts-ignore TS6133
function cfnDataRepositoryAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataRepositoryAssociationPropsValidator(properties).assertSuccess();
    return {
        DataRepositoryPath: cdk.stringToCloudFormation(properties.dataRepositoryPath),
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        FileSystemPath: cdk.stringToCloudFormation(properties.fileSystemPath),
        BatchImportMetaDataOnCreate: cdk.booleanToCloudFormation(properties.batchImportMetaDataOnCreate),
        ImportedFileChunkSize: cdk.numberToCloudFormation(properties.importedFileChunkSize),
        S3: cfnDataRepositoryAssociationS3PropertyToCloudFormation(properties.s3),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDataRepositoryAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataRepositoryAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataRepositoryAssociationProps>();
    ret.addPropertyResult('dataRepositoryPath', 'DataRepositoryPath', cfn_parse.FromCloudFormation.getString(properties.DataRepositoryPath));
    ret.addPropertyResult('fileSystemId', 'FileSystemId', cfn_parse.FromCloudFormation.getString(properties.FileSystemId));
    ret.addPropertyResult('fileSystemPath', 'FileSystemPath', cfn_parse.FromCloudFormation.getString(properties.FileSystemPath));
    ret.addPropertyResult('batchImportMetaDataOnCreate', 'BatchImportMetaDataOnCreate', properties.BatchImportMetaDataOnCreate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BatchImportMetaDataOnCreate) : undefined);
    ret.addPropertyResult('importedFileChunkSize', 'ImportedFileChunkSize', properties.ImportedFileChunkSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.ImportedFileChunkSize) : undefined);
    ret.addPropertyResult('s3', 'S3', properties.S3 != null ? CfnDataRepositoryAssociationS3PropertyFromCloudFormation(properties.S3) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FSx::DataRepositoryAssociation`
 *
 * Creates an Amazon FSx for Lustre data repository association (DRA). A data repository association is a link between a directory on the file system and an Amazon S3 bucket or prefix. You can have a maximum of 8 data repository associations on a file system. Data repository associations are supported only for file systems with the `Persistent_2` deployment type.
 *
 * Each data repository association must have a unique Amazon FSx file system directory and a unique S3 bucket or prefix associated with it. You can configure a data repository association for automatic import only, for automatic export only, or for both. To learn more about linking a data repository to your file system, see [Linking your file system to an S3 bucket](https://docs.aws.amazon.com/fsx/latest/LustreGuide/create-dra-linked-data-repo.html) .
 *
 * @cloudformationResource AWS::FSx::DataRepositoryAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html
 */
export class CfnDataRepositoryAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FSx::DataRepositoryAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataRepositoryAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataRepositoryAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataRepositoryAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the data repository association's system generated Association ID.
     *
     * Example: `dra-abcdef0123456789d`
     * @cloudformationAttribute AssociationId
     */
    public readonly attrAssociationId: string;

    /**
     * Returns the data repository association's Amazon Resource Name (ARN).
     *
     * Example: `arn:aws:fsx:us-east-1:111122223333:association/fs-abc012345def6789a/dra-abcdef0123456789b`
     * @cloudformationAttribute ResourceARN
     */
    public readonly attrResourceArn: string;

    /**
     * The path to the Amazon S3 data repository that will be linked to the file system. The path can be an S3 bucket or prefix in the format `s3://myBucket/myPrefix/` . This path specifies where in the S3 data repository files will be imported from or exported to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-datarepositorypath
     */
    public dataRepositoryPath: string;

    /**
     * The ID of the file system on which the data repository association is configured.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-filesystemid
     */
    public fileSystemId: string;

    /**
     * A path on the Amazon FSx for Lustre file system that points to a high-level directory (such as `/ns1/` ) or subdirectory (such as `/ns1/subdir/` ) that will be mapped 1-1 with `DataRepositoryPath` . The leading forward slash in the name is required. Two data repository associations cannot have overlapping file system paths. For example, if a data repository is associated with file system path `/ns1/` , then you cannot link another data repository with file system path `/ns1/ns2` .
     *
     * This path specifies where in your file system files will be exported from or imported to. This file system directory can be linked to only one Amazon S3 bucket, and no other S3 bucket can be linked to the directory.
     *
     * > If you specify only a forward slash ( `/` ) as the file system path, you can link only one data repository to the file system. You can only specify "/" as the file system path for the first data repository associated with a file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-filesystempath
     */
    public fileSystemPath: string;

    /**
     * A boolean flag indicating whether an import data repository task to import metadata should run after the data repository association is created. The task runs if this flag is set to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-batchimportmetadataoncreate
     */
    public batchImportMetaDataOnCreate: boolean | cdk.IResolvable | undefined;

    /**
     * For files imported from a data repository, this value determines the stripe count and maximum amount of data per file (in MiB) stored on a single physical disk. The maximum number of disks that a single file can be striped across is limited by the total number of disks that make up the file system or cache.
     *
     * The default chunk size is 1,024 MiB (1 GiB) and can go as high as 512,000 MiB (500 GiB). Amazon S3 objects have a maximum size of 5 TB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-importedfilechunksize
     */
    public importedFileChunkSize: number | undefined;

    /**
     * The configuration for an Amazon S3 data repository linked to an Amazon FSx Lustre file system with a data repository association. The configuration defines which file events (new, changed, or deleted files or directories) are automatically imported from the linked data repository to the file system or automatically exported from the file system to the data repository.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-s3
     */
    public s3: CfnDataRepositoryAssociation.S3Property | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-datarepositoryassociation.html#cfn-fsx-datarepositoryassociation-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FSx::DataRepositoryAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataRepositoryAssociationProps) {
        super(scope, id, { type: CfnDataRepositoryAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dataRepositoryPath', this);
        cdk.requireProperty(props, 'fileSystemId', this);
        cdk.requireProperty(props, 'fileSystemPath', this);
        this.attrAssociationId = cdk.Token.asString(this.getAtt('AssociationId', cdk.ResolutionTypeHint.STRING));
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceARN', cdk.ResolutionTypeHint.STRING));

        this.dataRepositoryPath = props.dataRepositoryPath;
        this.fileSystemId = props.fileSystemId;
        this.fileSystemPath = props.fileSystemPath;
        this.batchImportMetaDataOnCreate = props.batchImportMetaDataOnCreate;
        this.importedFileChunkSize = props.importedFileChunkSize;
        this.s3 = props.s3;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FSx::DataRepositoryAssociation", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataRepositoryAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dataRepositoryPath: this.dataRepositoryPath,
            fileSystemId: this.fileSystemId,
            fileSystemPath: this.fileSystemPath,
            batchImportMetaDataOnCreate: this.batchImportMetaDataOnCreate,
            importedFileChunkSize: this.importedFileChunkSize,
            s3: this.s3,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataRepositoryAssociationPropsToCloudFormation(props);
    }
}

export namespace CfnDataRepositoryAssociation {
    /**
     * Describes a data repository association's automatic export policy. The `AutoExportPolicy` defines the types of updated objects on the file system that will be automatically exported to the data repository. As you create, modify, or delete files, Amazon FSx for Lustre automatically exports the defined changes asynchronously once your application finishes modifying the file.
     *
     * This `AutoExportPolicy` is supported only for Amazon FSx for Lustre file systems with the `Persistent_2` deployment type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-datarepositoryassociation-autoexportpolicy.html
     */
    export interface AutoExportPolicyProperty {
        /**
         * The `AutoExportPolicy` can have the following event values:
         *
         * - `NEW` - New files and directories are automatically exported to the data repository as they are added to the file system.
         * - `CHANGED` - Changes to files and directories on the file system are automatically exported to the data repository.
         * - `DELETED` - Files and directories are automatically deleted on the data repository when they are deleted on the file system.
         *
         * You can define any combination of event types for your `AutoExportPolicy` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-datarepositoryassociation-autoexportpolicy.html#cfn-fsx-datarepositoryassociation-autoexportpolicy-events
         */
        readonly events: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AutoExportPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoExportPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataRepositoryAssociation_AutoExportPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('events', cdk.requiredValidator)(properties.events));
    errors.collect(cdk.propertyValidator('events', cdk.listValidator(cdk.validateString))(properties.events));
    return errors.wrap('supplied properties not correct for "AutoExportPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation.AutoExportPolicy` resource
 *
 * @param properties - the TypeScript properties of a `AutoExportPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation.AutoExportPolicy` resource.
 */
// @ts-ignore TS6133
function cfnDataRepositoryAssociationAutoExportPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataRepositoryAssociation_AutoExportPolicyPropertyValidator(properties).assertSuccess();
    return {
        Events: cdk.listMapper(cdk.stringToCloudFormation)(properties.events),
    };
}

// @ts-ignore TS6133
function CfnDataRepositoryAssociationAutoExportPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataRepositoryAssociation.AutoExportPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataRepositoryAssociation.AutoExportPolicyProperty>();
    ret.addPropertyResult('events', 'Events', cfn_parse.FromCloudFormation.getStringArray(properties.Events));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataRepositoryAssociation {
    /**
     * Describes the data repository association's automatic import policy. The AutoImportPolicy defines how Amazon FSx keeps your file metadata and directory listings up to date by importing changes to your Amazon FSx for Lustre file system as you modify objects in a linked S3 bucket.
     *
     * The `AutoImportPolicy` is supported only for Amazon FSx for Lustre file systems with the `Persistent_2` deployment type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-datarepositoryassociation-autoimportpolicy.html
     */
    export interface AutoImportPolicyProperty {
        /**
         * The `AutoImportPolicy` can have the following event values:
         *
         * - `NEW` - Amazon FSx automatically imports metadata of files added to the linked S3 bucket that do not currently exist in the FSx file system.
         * - `CHANGED` - Amazon FSx automatically updates file metadata and invalidates existing file content on the file system as files change in the data repository.
         * - `DELETED` - Amazon FSx automatically deletes files on the file system as corresponding files are deleted in the data repository.
         *
         * You can define any combination of event types for your `AutoImportPolicy` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-datarepositoryassociation-autoimportpolicy.html#cfn-fsx-datarepositoryassociation-autoimportpolicy-events
         */
        readonly events: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AutoImportPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AutoImportPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataRepositoryAssociation_AutoImportPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('events', cdk.requiredValidator)(properties.events));
    errors.collect(cdk.propertyValidator('events', cdk.listValidator(cdk.validateString))(properties.events));
    return errors.wrap('supplied properties not correct for "AutoImportPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation.AutoImportPolicy` resource
 *
 * @param properties - the TypeScript properties of a `AutoImportPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation.AutoImportPolicy` resource.
 */
// @ts-ignore TS6133
function cfnDataRepositoryAssociationAutoImportPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataRepositoryAssociation_AutoImportPolicyPropertyValidator(properties).assertSuccess();
    return {
        Events: cdk.listMapper(cdk.stringToCloudFormation)(properties.events),
    };
}

// @ts-ignore TS6133
function CfnDataRepositoryAssociationAutoImportPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataRepositoryAssociation.AutoImportPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataRepositoryAssociation.AutoImportPolicyProperty>();
    ret.addPropertyResult('events', 'Events', cfn_parse.FromCloudFormation.getStringArray(properties.Events));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataRepositoryAssociation {
    /**
     * The configuration for an Amazon S3 data repository linked to an Amazon FSx Lustre file system with a data repository association. The configuration defines which file events (new, changed, or deleted files or directories) are automatically imported from the linked data repository to the file system or automatically exported from the file system to the data repository.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-datarepositoryassociation-s3.html
     */
    export interface S3Property {
        /**
         * Describes a data repository association's automatic export policy. The `AutoExportPolicy` defines the types of updated objects on the file system that will be automatically exported to the data repository. As you create, modify, or delete files, Amazon FSx for Lustre automatically exports the defined changes asynchronously once your application finishes modifying the file.
         *
         * This `AutoExportPolicy` is supported only for Amazon FSx for Lustre file systems with the `Persistent_2` deployment type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-datarepositoryassociation-s3.html#cfn-fsx-datarepositoryassociation-s3-autoexportpolicy
         */
        readonly autoExportPolicy?: CfnDataRepositoryAssociation.AutoExportPolicyProperty | cdk.IResolvable;
        /**
         * Describes the data repository association's automatic import policy. The AutoImportPolicy defines how Amazon FSx keeps your file metadata and directory listings up to date by importing changes to your Amazon FSx for Lustre file system as you modify objects in a linked S3 bucket.
         *
         * The `AutoImportPolicy` is supported only for Amazon FSx for Lustre file systems with the `Persistent_2` deployment type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-datarepositoryassociation-s3.html#cfn-fsx-datarepositoryassociation-s3-autoimportpolicy
         */
        readonly autoImportPolicy?: CfnDataRepositoryAssociation.AutoImportPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3Property`
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the result of the validation.
 */
function CfnDataRepositoryAssociation_S3PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoExportPolicy', CfnDataRepositoryAssociation_AutoExportPolicyPropertyValidator)(properties.autoExportPolicy));
    errors.collect(cdk.propertyValidator('autoImportPolicy', CfnDataRepositoryAssociation_AutoImportPolicyPropertyValidator)(properties.autoImportPolicy));
    return errors.wrap('supplied properties not correct for "S3Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation.S3` resource
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::DataRepositoryAssociation.S3` resource.
 */
// @ts-ignore TS6133
function cfnDataRepositoryAssociationS3PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataRepositoryAssociation_S3PropertyValidator(properties).assertSuccess();
    return {
        AutoExportPolicy: cfnDataRepositoryAssociationAutoExportPolicyPropertyToCloudFormation(properties.autoExportPolicy),
        AutoImportPolicy: cfnDataRepositoryAssociationAutoImportPolicyPropertyToCloudFormation(properties.autoImportPolicy),
    };
}

// @ts-ignore TS6133
function CfnDataRepositoryAssociationS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataRepositoryAssociation.S3Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataRepositoryAssociation.S3Property>();
    ret.addPropertyResult('autoExportPolicy', 'AutoExportPolicy', properties.AutoExportPolicy != null ? CfnDataRepositoryAssociationAutoExportPolicyPropertyFromCloudFormation(properties.AutoExportPolicy) : undefined);
    ret.addPropertyResult('autoImportPolicy', 'AutoImportPolicy', properties.AutoImportPolicy != null ? CfnDataRepositoryAssociationAutoImportPolicyPropertyFromCloudFormation(properties.AutoImportPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFileSystem`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html
 */
export interface CfnFileSystemProps {

    /**
     * The type of Amazon FSx file system, which can be `LUSTRE` , `WINDOWS` , `ONTAP` , or `OPENZFS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-filesystemtype
     */
    readonly fileSystemType: string;

    /**
     * Specifies the IDs of the subnets that the file system will be accessible from. For Windows and ONTAP `MULTI_AZ_1` deployment types,provide exactly two subnet IDs, one for the preferred file server and one for the standby file server. You specify one of these subnets as the preferred subnet using the `WindowsConfiguration > PreferredSubnetID` or `OntapConfiguration > PreferredSubnetID` properties. For more information about Multi-AZ file system configuration, see [Availability and durability: Single-AZ and Multi-AZ file systems](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/high-availability-multiAZ.html) in the *Amazon FSx for Windows User Guide* and [Availability and durability](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/high-availability-multiAZ.html) in the *Amazon FSx for ONTAP User Guide* .
     *
     * For Windows `SINGLE_AZ_1` and `SINGLE_AZ_2` and all Lustre deployment types, provide exactly one subnet ID. The file server is launched in that subnet's Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-subnetids
     */
    readonly subnetIds: string[];

    /**
     * The ID of the file system backup that you are using to create a file system. For more information, see [CreateFileSystemFromBackup](https://docs.aws.amazon.com/fsx/latest/APIReference/API_CreateFileSystemFromBackup.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-backupid
     */
    readonly backupId?: string;

    /**
     * (Optional) For FSx for Lustre file systems, sets the Lustre version for the file system that you're creating. Valid values are `2.10` and `2.12` :
     *
     * - 2.10 is supported by the Scratch and Persistent_1 Lustre deployment types.
     * - 2.12 is supported by all Lustre deployment types. `2.12` is required when setting FSx for Lustre `DeploymentType` to `PERSISTENT_2` .
     *
     * Default value = `2.10` , except when `DeploymentType` is set to `PERSISTENT_2` , then the default is `2.12` .
     *
     * > If you set `FileSystemTypeVersion` to `2.10` for a `PERSISTENT_2` Lustre deployment type, the `CreateFileSystem` operation fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-filesystemtypeversion
     */
    readonly fileSystemTypeVersion?: string;

    /**
     * The ID of the AWS Key Management Service ( AWS KMS ) key used to encrypt Amazon FSx file system data. Used as follows with Amazon FSx file system types:
     *
     * - Amazon FSx for Lustre `PERSISTENT_1` and `PERSISTENT_2` deployment types only.
     *
     * `SCRATCH_1` and `SCRATCH_2` types are encrypted using the Amazon FSx service AWS KMS key for your account.
     * - Amazon FSx for NetApp ONTAP
     * - Amazon FSx for OpenZFS
     * - Amazon FSx for Windows File Server
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The Lustre configuration for the file system being created.
     *
     * > The following parameters are not supported for file systems with the Lustre `Persistent_2` deployment type.
     * >
     * > - `AutoImportPolicy`
     * > - `ExportPath`
     * > - `ImportedChunkSize`
     * > - `ImportPath`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-lustreconfiguration
     */
    readonly lustreConfiguration?: CfnFileSystem.LustreConfigurationProperty | cdk.IResolvable;

    /**
     * The ONTAP configuration properties of the FSx for ONTAP file system that you are creating.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-ontapconfiguration
     */
    readonly ontapConfiguration?: CfnFileSystem.OntapConfigurationProperty | cdk.IResolvable;

    /**
     * The Amazon FSx for OpenZFS configuration properties for the file system that you are creating.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-openzfsconfiguration
     */
    readonly openZfsConfiguration?: CfnFileSystem.OpenZFSConfigurationProperty | cdk.IResolvable;

    /**
     * A list of IDs specifying the security groups to apply to all network interfaces created for file system access. This list isn't returned in later requests to describe the file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-securitygroupids
     */
    readonly securityGroupIds?: string[];

    /**
     * Sets the storage capacity of the file system that you're creating. `StorageCapacity` is required if you are creating a new file system.
     *
     * *FSx for Lustre file systems* - The amount of storage capacity that you can configure depends on the value that you set for `StorageType` and the Lustre `DeploymentType` , as follows:
     *
     * - For `SCRATCH_2` , `PERSISTENT_2` and `PERSISTENT_1` deployment types using SSD storage type, the valid values are 1200 GiB, 2400 GiB, and increments of 2400 GiB.
     * - For `PERSISTENT_1` HDD file systems, valid values are increments of 6000 GiB for 12 MB/s/TiB file systems and increments of 1800 GiB for 40 MB/s/TiB file systems.
     * - For `SCRATCH_1` deployment type, valid values are 1200 GiB, 2400 GiB, and increments of 3600 GiB.
     *
     * *FSx for ONTAP file systems* - The amount of storage capacity that you can configure is from 1024 GiB up to 196,608 GiB (192 TiB).
     *
     * *FSx for OpenZFS file systems* - The amount of storage capacity that you can configure is from 64 GiB up to 524,288 GiB (512 TiB). If you are creating a file system from a backup, you can specify a storage capacity equal to or greater than the original file system's storage capacity.
     *
     * *FSx for Windows File Server file systems* - The amount of storage capacity that you can configure depends on the value that you set for `StorageType` as follows:
     *
     * - For SSD storage, valid values are 32 GiB-65,536 GiB (64 TiB).
     * - For HDD storage, valid values are 2000 GiB-65,536 GiB (64 TiB).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-storagecapacity
     */
    readonly storageCapacity?: number;

    /**
     * Sets the storage type for the file system that you're creating. Valid values are `SSD` and `HDD` .
     *
     * - Set to `SSD` to use solid state drive storage. SSD is supported on all Windows, Lustre, ONTAP, and OpenZFS deployment types.
     * - Set to `HDD` to use hard disk drive storage. HDD is supported on `SINGLE_AZ_2` and `MULTI_AZ_1` Windows file system deployment types, and on `PERSISTENT_1` Lustre file system deployment types.
     *
     * Default value is `SSD` . For more information, see [Storage type options](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/optimize-fsx-costs.html#storage-type-options) in the *FSx for Windows File Server User Guide* and [Multiple storage options](https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html#storage-options) in the *FSx for Lustre User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-storagetype
     */
    readonly storageType?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The configuration object for the Microsoft Windows file system you are creating. This value is required if `FileSystemType` is set to `WINDOWS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-windowsconfiguration
     */
    readonly windowsConfiguration?: CfnFileSystem.WindowsConfigurationProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('backupId', cdk.validateString)(properties.backupId));
    errors.collect(cdk.propertyValidator('fileSystemType', cdk.requiredValidator)(properties.fileSystemType));
    errors.collect(cdk.propertyValidator('fileSystemType', cdk.validateString)(properties.fileSystemType));
    errors.collect(cdk.propertyValidator('fileSystemTypeVersion', cdk.validateString)(properties.fileSystemTypeVersion));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('lustreConfiguration', CfnFileSystem_LustreConfigurationPropertyValidator)(properties.lustreConfiguration));
    errors.collect(cdk.propertyValidator('ontapConfiguration', CfnFileSystem_OntapConfigurationPropertyValidator)(properties.ontapConfiguration));
    errors.collect(cdk.propertyValidator('openZfsConfiguration', CfnFileSystem_OpenZFSConfigurationPropertyValidator)(properties.openZfsConfiguration));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('storageCapacity', cdk.validateNumber)(properties.storageCapacity));
    errors.collect(cdk.propertyValidator('storageType', cdk.validateString)(properties.storageType));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('windowsConfiguration', CfnFileSystem_WindowsConfigurationPropertyValidator)(properties.windowsConfiguration));
    return errors.wrap('supplied properties not correct for "CfnFileSystemProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem` resource
 *
 * @param properties - the TypeScript properties of a `CfnFileSystemProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystemPropsValidator(properties).assertSuccess();
    return {
        FileSystemType: cdk.stringToCloudFormation(properties.fileSystemType),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        BackupId: cdk.stringToCloudFormation(properties.backupId),
        FileSystemTypeVersion: cdk.stringToCloudFormation(properties.fileSystemTypeVersion),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        LustreConfiguration: cfnFileSystemLustreConfigurationPropertyToCloudFormation(properties.lustreConfiguration),
        OntapConfiguration: cfnFileSystemOntapConfigurationPropertyToCloudFormation(properties.ontapConfiguration),
        OpenZFSConfiguration: cfnFileSystemOpenZFSConfigurationPropertyToCloudFormation(properties.openZfsConfiguration),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        StorageCapacity: cdk.numberToCloudFormation(properties.storageCapacity),
        StorageType: cdk.stringToCloudFormation(properties.storageType),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        WindowsConfiguration: cfnFileSystemWindowsConfigurationPropertyToCloudFormation(properties.windowsConfiguration),
    };
}

// @ts-ignore TS6133
function CfnFileSystemPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystemProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystemProps>();
    ret.addPropertyResult('fileSystemType', 'FileSystemType', cfn_parse.FromCloudFormation.getString(properties.FileSystemType));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('backupId', 'BackupId', properties.BackupId != null ? cfn_parse.FromCloudFormation.getString(properties.BackupId) : undefined);
    ret.addPropertyResult('fileSystemTypeVersion', 'FileSystemTypeVersion', properties.FileSystemTypeVersion != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemTypeVersion) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('lustreConfiguration', 'LustreConfiguration', properties.LustreConfiguration != null ? CfnFileSystemLustreConfigurationPropertyFromCloudFormation(properties.LustreConfiguration) : undefined);
    ret.addPropertyResult('ontapConfiguration', 'OntapConfiguration', properties.OntapConfiguration != null ? CfnFileSystemOntapConfigurationPropertyFromCloudFormation(properties.OntapConfiguration) : undefined);
    ret.addPropertyResult('openZfsConfiguration', 'OpenZFSConfiguration', properties.OpenZFSConfiguration != null ? CfnFileSystemOpenZFSConfigurationPropertyFromCloudFormation(properties.OpenZFSConfiguration) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('storageCapacity', 'StorageCapacity', properties.StorageCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.StorageCapacity) : undefined);
    ret.addPropertyResult('storageType', 'StorageType', properties.StorageType != null ? cfn_parse.FromCloudFormation.getString(properties.StorageType) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('windowsConfiguration', 'WindowsConfiguration', properties.WindowsConfiguration != null ? CfnFileSystemWindowsConfigurationPropertyFromCloudFormation(properties.WindowsConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FSx::FileSystem`
 *
 * The `AWS::FSx::FileSystem` resource is an Amazon FSx resource type that specifies an Amazon FSx file system. You can create any of the following supported file system types:
 *
 * - Amazon FSx for Lustre
 * - Amazon FSx for NetApp ONTAP
 * - Amazon FSx for OpenZFS
 * - Amazon FSx for Windows File Server
 *
 * @cloudformationResource AWS::FSx::FileSystem
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html
 */
export class CfnFileSystem extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FSx::FileSystem";

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
     * Returns the FSx for Windows file system's DNSName.
     *
     * Example: `amznfsxp1honlek.corp.example.com`
     * @cloudformationAttribute DNSName
     */
    public readonly attrDnsName: string;

    /**
     * Returns the Lustre file system's `LustreMountName` .
     *
     * Example for `SCRATCH_1` deployment types: This value is always `fsx` .
     *
     * Example for `SCRATCH_2` and `PERSISTENT` deployment types: `2p3fhbmv`
     * @cloudformationAttribute LustreMountName
     */
    public readonly attrLustreMountName: string;

    /**
     * Returns the Amazon Resource Name (ARN) for the Amazon FSx file system.
     *
     * Example: `arn:aws:fsx:us-east-2:111122223333:file-system/fs-0123abcd56789ef0a`
     * @cloudformationAttribute ResourceARN
     */
    public readonly attrResourceArn: string;

    /**
     * Returns the root volume ID of the FSx for OpenZFS file system.
     *
     * Example: `fsvol-0123456789abcdefa`
     * @cloudformationAttribute RootVolumeId
     */
    public readonly attrRootVolumeId: string;

    /**
     * The type of Amazon FSx file system, which can be `LUSTRE` , `WINDOWS` , `ONTAP` , or `OPENZFS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-filesystemtype
     */
    public fileSystemType: string;

    /**
     * Specifies the IDs of the subnets that the file system will be accessible from. For Windows and ONTAP `MULTI_AZ_1` deployment types,provide exactly two subnet IDs, one for the preferred file server and one for the standby file server. You specify one of these subnets as the preferred subnet using the `WindowsConfiguration > PreferredSubnetID` or `OntapConfiguration > PreferredSubnetID` properties. For more information about Multi-AZ file system configuration, see [Availability and durability: Single-AZ and Multi-AZ file systems](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/high-availability-multiAZ.html) in the *Amazon FSx for Windows User Guide* and [Availability and durability](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/high-availability-multiAZ.html) in the *Amazon FSx for ONTAP User Guide* .
     *
     * For Windows `SINGLE_AZ_1` and `SINGLE_AZ_2` and all Lustre deployment types, provide exactly one subnet ID. The file server is launched in that subnet's Availability Zone.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-subnetids
     */
    public subnetIds: string[];

    /**
     * The ID of the file system backup that you are using to create a file system. For more information, see [CreateFileSystemFromBackup](https://docs.aws.amazon.com/fsx/latest/APIReference/API_CreateFileSystemFromBackup.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-backupid
     */
    public backupId: string | undefined;

    /**
     * (Optional) For FSx for Lustre file systems, sets the Lustre version for the file system that you're creating. Valid values are `2.10` and `2.12` :
     *
     * - 2.10 is supported by the Scratch and Persistent_1 Lustre deployment types.
     * - 2.12 is supported by all Lustre deployment types. `2.12` is required when setting FSx for Lustre `DeploymentType` to `PERSISTENT_2` .
     *
     * Default value = `2.10` , except when `DeploymentType` is set to `PERSISTENT_2` , then the default is `2.12` .
     *
     * > If you set `FileSystemTypeVersion` to `2.10` for a `PERSISTENT_2` Lustre deployment type, the `CreateFileSystem` operation fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-filesystemtypeversion
     */
    public fileSystemTypeVersion: string | undefined;

    /**
     * The ID of the AWS Key Management Service ( AWS KMS ) key used to encrypt Amazon FSx file system data. Used as follows with Amazon FSx file system types:
     *
     * - Amazon FSx for Lustre `PERSISTENT_1` and `PERSISTENT_2` deployment types only.
     *
     * `SCRATCH_1` and `SCRATCH_2` types are encrypted using the Amazon FSx service AWS KMS key for your account.
     * - Amazon FSx for NetApp ONTAP
     * - Amazon FSx for OpenZFS
     * - Amazon FSx for Windows File Server
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * The Lustre configuration for the file system being created.
     *
     * > The following parameters are not supported for file systems with the Lustre `Persistent_2` deployment type.
     * >
     * > - `AutoImportPolicy`
     * > - `ExportPath`
     * > - `ImportedChunkSize`
     * > - `ImportPath`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-lustreconfiguration
     */
    public lustreConfiguration: CfnFileSystem.LustreConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The ONTAP configuration properties of the FSx for ONTAP file system that you are creating.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-ontapconfiguration
     */
    public ontapConfiguration: CfnFileSystem.OntapConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The Amazon FSx for OpenZFS configuration properties for the file system that you are creating.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-openzfsconfiguration
     */
    public openZfsConfiguration: CfnFileSystem.OpenZFSConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A list of IDs specifying the security groups to apply to all network interfaces created for file system access. This list isn't returned in later requests to describe the file system.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-securitygroupids
     */
    public securityGroupIds: string[] | undefined;

    /**
     * Sets the storage capacity of the file system that you're creating. `StorageCapacity` is required if you are creating a new file system.
     *
     * *FSx for Lustre file systems* - The amount of storage capacity that you can configure depends on the value that you set for `StorageType` and the Lustre `DeploymentType` , as follows:
     *
     * - For `SCRATCH_2` , `PERSISTENT_2` and `PERSISTENT_1` deployment types using SSD storage type, the valid values are 1200 GiB, 2400 GiB, and increments of 2400 GiB.
     * - For `PERSISTENT_1` HDD file systems, valid values are increments of 6000 GiB for 12 MB/s/TiB file systems and increments of 1800 GiB for 40 MB/s/TiB file systems.
     * - For `SCRATCH_1` deployment type, valid values are 1200 GiB, 2400 GiB, and increments of 3600 GiB.
     *
     * *FSx for ONTAP file systems* - The amount of storage capacity that you can configure is from 1024 GiB up to 196,608 GiB (192 TiB).
     *
     * *FSx for OpenZFS file systems* - The amount of storage capacity that you can configure is from 64 GiB up to 524,288 GiB (512 TiB). If you are creating a file system from a backup, you can specify a storage capacity equal to or greater than the original file system's storage capacity.
     *
     * *FSx for Windows File Server file systems* - The amount of storage capacity that you can configure depends on the value that you set for `StorageType` as follows:
     *
     * - For SSD storage, valid values are 32 GiB-65,536 GiB (64 TiB).
     * - For HDD storage, valid values are 2000 GiB-65,536 GiB (64 TiB).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-storagecapacity
     */
    public storageCapacity: number | undefined;

    /**
     * Sets the storage type for the file system that you're creating. Valid values are `SSD` and `HDD` .
     *
     * - Set to `SSD` to use solid state drive storage. SSD is supported on all Windows, Lustre, ONTAP, and OpenZFS deployment types.
     * - Set to `HDD` to use hard disk drive storage. HDD is supported on `SINGLE_AZ_2` and `MULTI_AZ_1` Windows file system deployment types, and on `PERSISTENT_1` Lustre file system deployment types.
     *
     * Default value is `SSD` . For more information, see [Storage type options](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/optimize-fsx-costs.html#storage-type-options) in the *FSx for Windows File Server User Guide* and [Multiple storage options](https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html#storage-options) in the *FSx for Lustre User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-storagetype
     */
    public storageType: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The configuration object for the Microsoft Windows file system you are creating. This value is required if `FileSystemType` is set to `WINDOWS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-windowsconfiguration
     */
    public windowsConfiguration: CfnFileSystem.WindowsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::FSx::FileSystem`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFileSystemProps) {
        super(scope, id, { type: CfnFileSystem.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'fileSystemType', this);
        cdk.requireProperty(props, 'subnetIds', this);
        this.attrDnsName = cdk.Token.asString(this.getAtt('DNSName', cdk.ResolutionTypeHint.STRING));
        this.attrLustreMountName = cdk.Token.asString(this.getAtt('LustreMountName', cdk.ResolutionTypeHint.STRING));
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceARN', cdk.ResolutionTypeHint.STRING));
        this.attrRootVolumeId = cdk.Token.asString(this.getAtt('RootVolumeId', cdk.ResolutionTypeHint.STRING));

        this.fileSystemType = props.fileSystemType;
        this.subnetIds = props.subnetIds;
        this.backupId = props.backupId;
        this.fileSystemTypeVersion = props.fileSystemTypeVersion;
        this.kmsKeyId = props.kmsKeyId;
        this.lustreConfiguration = props.lustreConfiguration;
        this.ontapConfiguration = props.ontapConfiguration;
        this.openZfsConfiguration = props.openZfsConfiguration;
        this.securityGroupIds = props.securityGroupIds;
        this.storageCapacity = props.storageCapacity;
        this.storageType = props.storageType;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FSx::FileSystem", props.tags, { tagPropertyName: 'tags' });
        this.windowsConfiguration = props.windowsConfiguration;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::FSx::FileSystem\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
            fileSystemType: this.fileSystemType,
            subnetIds: this.subnetIds,
            backupId: this.backupId,
            fileSystemTypeVersion: this.fileSystemTypeVersion,
            kmsKeyId: this.kmsKeyId,
            lustreConfiguration: this.lustreConfiguration,
            ontapConfiguration: this.ontapConfiguration,
            openZfsConfiguration: this.openZfsConfiguration,
            securityGroupIds: this.securityGroupIds,
            storageCapacity: this.storageCapacity,
            storageType: this.storageType,
            tags: this.tags.renderTags(),
            windowsConfiguration: this.windowsConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFileSystemPropsToCloudFormation(props);
    }
}

export namespace CfnFileSystem {
    /**
     * The configuration that Amazon FSx for Windows File Server uses to audit and log user accesses of files, folders, and file shares on the Amazon FSx for Windows File Server file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-auditlogconfiguration.html
     */
    export interface AuditLogConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) for the destination of the audit logs. The destination can be any Amazon CloudWatch Logs log group ARN or Amazon Kinesis Data Firehose delivery stream ARN.
         *
         * The name of the Amazon CloudWatch Logs log group must begin with the `/aws/fsx` prefix. The name of the Amazon Kinesis Data Firehouse delivery stream must begin with the `aws-fsx` prefix.
         *
         * The destination ARN (either CloudWatch Logs log group or Kinesis Data Firehose delivery stream) must be in the same AWS partition, AWS Region , and AWS account as your Amazon FSx file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-auditlogconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-auditlogconfiguration-auditlogdestination
         */
        readonly auditLogDestination?: string;
        /**
         * Sets which attempt type is logged by Amazon FSx for file and folder accesses.
         *
         * - `SUCCESS_ONLY` - only successful attempts to access files or folders are logged.
         * - `FAILURE_ONLY` - only failed attempts to access files or folders are logged.
         * - `SUCCESS_AND_FAILURE` - both successful attempts and failed attempts to access files or folders are logged.
         * - `DISABLED` - access auditing of files and folders is turned off.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-auditlogconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-auditlogconfiguration-fileaccessauditloglevel
         */
        readonly fileAccessAuditLogLevel: string;
        /**
         * Sets which attempt type is logged by Amazon FSx for file share accesses.
         *
         * - `SUCCESS_ONLY` - only successful attempts to access file shares are logged.
         * - `FAILURE_ONLY` - only failed attempts to access file shares are logged.
         * - `SUCCESS_AND_FAILURE` - both successful attempts and failed attempts to access file shares are logged.
         * - `DISABLED` - access auditing of file shares is turned off.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-auditlogconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-auditlogconfiguration-fileshareaccessauditloglevel
         */
        readonly fileShareAccessAuditLogLevel: string;
    }
}

/**
 * Determine whether the given properties match those of a `AuditLogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AuditLogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_AuditLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('auditLogDestination', cdk.validateString)(properties.auditLogDestination));
    errors.collect(cdk.propertyValidator('fileAccessAuditLogLevel', cdk.requiredValidator)(properties.fileAccessAuditLogLevel));
    errors.collect(cdk.propertyValidator('fileAccessAuditLogLevel', cdk.validateString)(properties.fileAccessAuditLogLevel));
    errors.collect(cdk.propertyValidator('fileShareAccessAuditLogLevel', cdk.requiredValidator)(properties.fileShareAccessAuditLogLevel));
    errors.collect(cdk.propertyValidator('fileShareAccessAuditLogLevel', cdk.validateString)(properties.fileShareAccessAuditLogLevel));
    return errors.wrap('supplied properties not correct for "AuditLogConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.AuditLogConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AuditLogConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.AuditLogConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemAuditLogConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_AuditLogConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AuditLogDestination: cdk.stringToCloudFormation(properties.auditLogDestination),
        FileAccessAuditLogLevel: cdk.stringToCloudFormation(properties.fileAccessAuditLogLevel),
        FileShareAccessAuditLogLevel: cdk.stringToCloudFormation(properties.fileShareAccessAuditLogLevel),
    };
}

// @ts-ignore TS6133
function CfnFileSystemAuditLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.AuditLogConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.AuditLogConfigurationProperty>();
    ret.addPropertyResult('auditLogDestination', 'AuditLogDestination', properties.AuditLogDestination != null ? cfn_parse.FromCloudFormation.getString(properties.AuditLogDestination) : undefined);
    ret.addPropertyResult('fileAccessAuditLogLevel', 'FileAccessAuditLogLevel', cfn_parse.FromCloudFormation.getString(properties.FileAccessAuditLogLevel));
    ret.addPropertyResult('fileShareAccessAuditLogLevel', 'FileShareAccessAuditLogLevel', cfn_parse.FromCloudFormation.getString(properties.FileShareAccessAuditLogLevel));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * Specifies who can mount an OpenZFS file system and the options available while mounting the file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports-clientconfigurations.html
     */
    export interface ClientConfigurationsProperty {
        /**
         * A value that specifies who can mount the file system. You can provide a wildcard character ( `*` ), an IP address ( `0.0.0.0` ), or a CIDR address ( `192.0.2.0/24` ). By default, Amazon FSx uses the wildcard character when specifying the client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports-clientconfigurations.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports-clientconfigurations-clients
         */
        readonly clients?: string;
        /**
         * The options to use when mounting the file system. For a list of options that you can use with Network File System (NFS), see the [exports(5) - Linux man page](https://docs.aws.amazon.com/https://linux.die.net/man/5/exports) . When choosing your options, consider the following:
         *
         * - `crossmnt` is used by default. If you don't specify `crossmnt` when changing the client configuration, you won't be able to see or access snapshots in your file system's snapshot directory.
         * - `sync` is used by default. If you instead specify `async` , the system acknowledges writes before writing to disk. If the system crashes before the writes are finished, you lose the unwritten data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports-clientconfigurations.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports-clientconfigurations-options
         */
        readonly options?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ClientConfigurationsProperty`
 *
 * @param properties - the TypeScript properties of a `ClientConfigurationsProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_ClientConfigurationsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clients', cdk.validateString)(properties.clients));
    errors.collect(cdk.propertyValidator('options', cdk.listValidator(cdk.validateString))(properties.options));
    return errors.wrap('supplied properties not correct for "ClientConfigurationsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.ClientConfigurations` resource
 *
 * @param properties - the TypeScript properties of a `ClientConfigurationsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.ClientConfigurations` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemClientConfigurationsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_ClientConfigurationsPropertyValidator(properties).assertSuccess();
    return {
        Clients: cdk.stringToCloudFormation(properties.clients),
        Options: cdk.listMapper(cdk.stringToCloudFormation)(properties.options),
    };
}

// @ts-ignore TS6133
function CfnFileSystemClientConfigurationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.ClientConfigurationsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.ClientConfigurationsProperty>();
    ret.addPropertyResult('clients', 'Clients', properties.Clients != null ? cfn_parse.FromCloudFormation.getString(properties.Clients) : undefined);
    ret.addPropertyResult('options', 'Options', properties.Options != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Options) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The SSD IOPS (input/output operations per second) configuration for an Amazon FSx for NetApp ONTAP or Amazon FSx for OpenZFS file system. The default is 3 IOPS per GB of storage capacity, but you can provision additional IOPS per GB of storage. The configuration consists of the total number of provisioned SSD IOPS and how the amount was provisioned (by the customer or by the system).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-diskiopsconfiguration.html
     */
    export interface DiskIopsConfigurationProperty {
        /**
         * The total number of SSD IOPS provisioned for the file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-diskiopsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-diskiopsconfiguration-iops
         */
        readonly iops?: number;
        /**
         * Specifies whether the number of IOPS for the file system is using the system default ( `AUTOMATIC` ) or was provisioned by the customer ( `USER_PROVISIONED` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-diskiopsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-diskiopsconfiguration-mode
         */
        readonly mode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DiskIopsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DiskIopsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_DiskIopsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    return errors.wrap('supplied properties not correct for "DiskIopsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.DiskIopsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DiskIopsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.DiskIopsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemDiskIopsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_DiskIopsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Iops: cdk.numberToCloudFormation(properties.iops),
        Mode: cdk.stringToCloudFormation(properties.mode),
    };
}

// @ts-ignore TS6133
function CfnFileSystemDiskIopsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.DiskIopsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.DiskIopsConfigurationProperty>();
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('mode', 'Mode', properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The configuration for the Amazon FSx for Lustre file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html
     */
    export interface LustreConfigurationProperty {
        /**
         * (Optional) Available with `Scratch` and `Persistent_1` deployment types. When you create your file system, your existing S3 objects appear as file and directory listings. Use this property to choose how Amazon FSx keeps your file and directory listings up to date as you add or modify objects in your linked S3 bucket. `AutoImportPolicy` can have the following values:
         *
         * - `NONE` - (Default) AutoImport is off. Amazon FSx only updates file and directory listings from the linked S3 bucket when the file system is created. FSx does not update file and directory listings for any new or changed objects after choosing this option.
         * - `NEW` - AutoImport is on. Amazon FSx automatically imports directory listings of any new objects added to the linked S3 bucket that do not currently exist in the FSx file system.
         * - `NEW_CHANGED` - AutoImport is on. Amazon FSx automatically imports file and directory listings of any new objects added to the S3 bucket and any existing objects that are changed in the S3 bucket after you choose this option.
         * - `NEW_CHANGED_DELETED` - AutoImport is on. Amazon FSx automatically imports file and directory listings of any new objects added to the S3 bucket, any existing objects that are changed in the S3 bucket, and any objects that were deleted in the S3 bucket.
         *
         * For more information, see [Automatically import updates from your S3 bucket](https://docs.aws.amazon.com/fsx/latest/LustreGuide/autoimport-data-repo.html) .
         *
         * > This parameter is not supported for Lustre file systems using the `Persistent_2` deployment type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-autoimportpolicy
         */
        readonly autoImportPolicy?: string;
        /**
         * The number of days to retain automatic backups. Setting this property to `0` disables automatic backups. You can retain automatic backups for a maximum of 90 days. The default is `0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-automaticbackupretentiondays
         */
        readonly automaticBackupRetentionDays?: number;
        /**
         * A Boolean flag indicating whether tags for the file system should be copied to backups. This value defaults to false. If it's set to true, all tags for the file system are copied to all automatic and user-initiated backups where the user doesn't specify tags. If this value is true, and you specify one or more tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the file system, regardless of this value. Only valid for use with `PERSISTENT_1` deployment types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-copytagstobackups
         */
        readonly copyTagsToBackups?: boolean | cdk.IResolvable;
        /**
         * A recurring daily time, in the format `HH:MM` . `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour. For example, `05:00` specifies 5 AM daily.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-dailyautomaticbackupstarttime
         */
        readonly dailyAutomaticBackupStartTime?: string;
        /**
         * Sets the data compression configuration for the file system. `DataCompressionType` can have the following values:
         *
         * - `NONE` - (Default) Data compression is turned off when the file system is created.
         * - `LZ4` - Data compression is turned on with the LZ4 algorithm.
         *
         * For more information, see [Lustre data compression](https://docs.aws.amazon.com/fsx/latest/LustreGuide/data-compression.html) in the *Amazon FSx for Lustre User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-datacompressiontype
         */
        readonly dataCompressionType?: string;
        /**
         * (Optional) Choose `SCRATCH_1` and `SCRATCH_2` deployment types when you need temporary storage and shorter-term processing of data. The `SCRATCH_2` deployment type provides in-transit encryption of data and higher burst throughput capacity than `SCRATCH_1` .
         *
         * Choose `PERSISTENT_1` for longer-term storage and for throughput-focused workloads that aren’t latency-sensitive. `PERSISTENT_1` supports encryption of data in transit, and is available in all AWS Regions in which FSx for Lustre is available.
         *
         * Choose `PERSISTENT_2` for longer-term storage and for latency-sensitive workloads that require the highest levels of IOPS/throughput. `PERSISTENT_2` supports SSD storage, and offers higher `PerUnitStorageThroughput` (up to 1000 MB/s/TiB). `PERSISTENT_2` is available in a limited number of AWS Regions . For more information, and an up-to-date list of AWS Regions in which `PERSISTENT_2` is available, see [File system deployment options for FSx for Lustre](https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html#lustre-deployment-types) in the *Amazon FSx for Lustre User Guide* .
         *
         * > If you choose `PERSISTENT_2` , and you set `FileSystemTypeVersion` to `2.10` , the `CreateFileSystem` operation fails.
         *
         * Encryption of data in transit is automatically turned on when you access `SCRATCH_2` , `PERSISTENT_1` and `PERSISTENT_2` file systems from Amazon EC2 instances that support automatic encryption in the AWS Regions where they are available. For more information about encryption in transit for FSx for Lustre file systems, see [Encrypting data in transit](https://docs.aws.amazon.com/fsx/latest/LustreGuide/encryption-in-transit-fsxl.html) in the *Amazon FSx for Lustre User Guide* .
         *
         * (Default = `SCRATCH_1` )
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-deploymenttype
         */
        readonly deploymentType?: string;
        /**
         * The type of drive cache used by `PERSISTENT_1` file systems that are provisioned with HDD storage devices. This parameter is required when storage type is HDD. Set this property to `READ` to improve the performance for frequently accessed files by caching up to 20% of the total storage capacity of the file system.
         *
         * This parameter is required when `StorageType` is set to `HDD` and `DeploymentType` is `PERSISTENT_1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-drivecachetype
         */
        readonly driveCacheType?: string;
        /**
         * (Optional) Available with `Scratch` and `Persistent_1` deployment types. Specifies the path in the Amazon S3 bucket where the root of your Amazon FSx file system is exported. The path must use the same Amazon S3 bucket as specified in ImportPath. You can provide an optional prefix to which new and changed data is to be exported from your Amazon FSx for Lustre file system. If an `ExportPath` value is not provided, Amazon FSx sets a default export path, `s3://import-bucket/FSxLustre[creation-timestamp]` . The timestamp is in UTC format, for example `s3://import-bucket/FSxLustre20181105T222312Z` .
         *
         * The Amazon S3 export bucket must be the same as the import bucket specified by `ImportPath` . If you specify only a bucket name, such as `s3://import-bucket` , you get a 1:1 mapping of file system objects to S3 bucket objects. This mapping means that the input data in S3 is overwritten on export. If you provide a custom prefix in the export path, such as `s3://import-bucket/[custom-optional-prefix]` , Amazon FSx exports the contents of your file system to that export prefix in the Amazon S3 bucket.
         *
         * > This parameter is not supported for file systems using the `Persistent_2` deployment type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-exportpath
         */
        readonly exportPath?: string;
        /**
         * (Optional) The path to the Amazon S3 bucket (including the optional prefix) that you're using as the data repository for your Amazon FSx for Lustre file system. The root of your FSx for Lustre file system will be mapped to the root of the Amazon S3 bucket you select. An example is `s3://import-bucket/optional-prefix` . If you specify a prefix after the Amazon S3 bucket name, only object keys with that prefix are loaded into the file system.
         *
         * > This parameter is not supported for Lustre file systems using the `Persistent_2` deployment type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-importpath
         */
        readonly importPath?: string;
        /**
         * (Optional) For files imported from a data repository, this value determines the stripe count and maximum amount of data per file (in MiB) stored on a single physical disk. The maximum number of disks that a single file can be striped across is limited by the total number of disks that make up the file system.
         *
         * The default chunk size is 1,024 MiB (1 GiB) and can go as high as 512,000 MiB (500 GiB). Amazon S3 objects have a maximum size of 5 TB.
         *
         * > This parameter is not supported for Lustre file systems using the `Persistent_2` deployment type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-importedfilechunksize
         */
        readonly importedFileChunkSize?: number;
        /**
         * Required with `PERSISTENT_1` and `PERSISTENT_2` deployment types, provisions the amount of read and write throughput for each 1 tebibyte (TiB) of file system storage capacity, in MB/s/TiB. File system throughput capacity is calculated by multiplying ﬁle system storage capacity (TiB) by the `PerUnitStorageThroughput` (MB/s/TiB). For a 2.4-TiB ﬁle system, provisioning 50 MB/s/TiB of `PerUnitStorageThroughput` yields 120 MB/s of ﬁle system throughput. You pay for the amount of throughput that you provision.
         *
         * Valid values:
         *
         * - For `PERSISTENT_1` SSD storage: 50, 100, 200 MB/s/TiB.
         * - For `PERSISTENT_1` HDD storage: 12, 40 MB/s/TiB.
         * - For `PERSISTENT_2` SSD storage: 125, 250, 500, 1000 MB/s/TiB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-perunitstoragethroughput
         */
        readonly perUnitStorageThroughput?: number;
        /**
         * A recurring weekly time, in the format `D:HH:MM` .
         *
         * `D` is the day of the week, for which 1 represents Monday and 7 represents Sunday. For further details, see [the ISO-8601 spec as described on Wikipedia](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/ISO_week_date) .
         *
         * `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour.
         *
         * For example, `1:05:00` specifies maintenance at 5 AM Monday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-weeklymaintenancestarttime
         */
        readonly weeklyMaintenanceStartTime?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LustreConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LustreConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_LustreConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoImportPolicy', cdk.validateString)(properties.autoImportPolicy));
    errors.collect(cdk.propertyValidator('automaticBackupRetentionDays', cdk.validateNumber)(properties.automaticBackupRetentionDays));
    errors.collect(cdk.propertyValidator('copyTagsToBackups', cdk.validateBoolean)(properties.copyTagsToBackups));
    errors.collect(cdk.propertyValidator('dailyAutomaticBackupStartTime', cdk.validateString)(properties.dailyAutomaticBackupStartTime));
    errors.collect(cdk.propertyValidator('dataCompressionType', cdk.validateString)(properties.dataCompressionType));
    errors.collect(cdk.propertyValidator('deploymentType', cdk.validateString)(properties.deploymentType));
    errors.collect(cdk.propertyValidator('driveCacheType', cdk.validateString)(properties.driveCacheType));
    errors.collect(cdk.propertyValidator('exportPath', cdk.validateString)(properties.exportPath));
    errors.collect(cdk.propertyValidator('importPath', cdk.validateString)(properties.importPath));
    errors.collect(cdk.propertyValidator('importedFileChunkSize', cdk.validateNumber)(properties.importedFileChunkSize));
    errors.collect(cdk.propertyValidator('perUnitStorageThroughput', cdk.validateNumber)(properties.perUnitStorageThroughput));
    errors.collect(cdk.propertyValidator('weeklyMaintenanceStartTime', cdk.validateString)(properties.weeklyMaintenanceStartTime));
    return errors.wrap('supplied properties not correct for "LustreConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.LustreConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LustreConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.LustreConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemLustreConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_LustreConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AutoImportPolicy: cdk.stringToCloudFormation(properties.autoImportPolicy),
        AutomaticBackupRetentionDays: cdk.numberToCloudFormation(properties.automaticBackupRetentionDays),
        CopyTagsToBackups: cdk.booleanToCloudFormation(properties.copyTagsToBackups),
        DailyAutomaticBackupStartTime: cdk.stringToCloudFormation(properties.dailyAutomaticBackupStartTime),
        DataCompressionType: cdk.stringToCloudFormation(properties.dataCompressionType),
        DeploymentType: cdk.stringToCloudFormation(properties.deploymentType),
        DriveCacheType: cdk.stringToCloudFormation(properties.driveCacheType),
        ExportPath: cdk.stringToCloudFormation(properties.exportPath),
        ImportPath: cdk.stringToCloudFormation(properties.importPath),
        ImportedFileChunkSize: cdk.numberToCloudFormation(properties.importedFileChunkSize),
        PerUnitStorageThroughput: cdk.numberToCloudFormation(properties.perUnitStorageThroughput),
        WeeklyMaintenanceStartTime: cdk.stringToCloudFormation(properties.weeklyMaintenanceStartTime),
    };
}

// @ts-ignore TS6133
function CfnFileSystemLustreConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.LustreConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.LustreConfigurationProperty>();
    ret.addPropertyResult('autoImportPolicy', 'AutoImportPolicy', properties.AutoImportPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.AutoImportPolicy) : undefined);
    ret.addPropertyResult('automaticBackupRetentionDays', 'AutomaticBackupRetentionDays', properties.AutomaticBackupRetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomaticBackupRetentionDays) : undefined);
    ret.addPropertyResult('copyTagsToBackups', 'CopyTagsToBackups', properties.CopyTagsToBackups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToBackups) : undefined);
    ret.addPropertyResult('dailyAutomaticBackupStartTime', 'DailyAutomaticBackupStartTime', properties.DailyAutomaticBackupStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.DailyAutomaticBackupStartTime) : undefined);
    ret.addPropertyResult('dataCompressionType', 'DataCompressionType', properties.DataCompressionType != null ? cfn_parse.FromCloudFormation.getString(properties.DataCompressionType) : undefined);
    ret.addPropertyResult('deploymentType', 'DeploymentType', properties.DeploymentType != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentType) : undefined);
    ret.addPropertyResult('driveCacheType', 'DriveCacheType', properties.DriveCacheType != null ? cfn_parse.FromCloudFormation.getString(properties.DriveCacheType) : undefined);
    ret.addPropertyResult('exportPath', 'ExportPath', properties.ExportPath != null ? cfn_parse.FromCloudFormation.getString(properties.ExportPath) : undefined);
    ret.addPropertyResult('importPath', 'ImportPath', properties.ImportPath != null ? cfn_parse.FromCloudFormation.getString(properties.ImportPath) : undefined);
    ret.addPropertyResult('importedFileChunkSize', 'ImportedFileChunkSize', properties.ImportedFileChunkSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.ImportedFileChunkSize) : undefined);
    ret.addPropertyResult('perUnitStorageThroughput', 'PerUnitStorageThroughput', properties.PerUnitStorageThroughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.PerUnitStorageThroughput) : undefined);
    ret.addPropertyResult('weeklyMaintenanceStartTime', 'WeeklyMaintenanceStartTime', properties.WeeklyMaintenanceStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.WeeklyMaintenanceStartTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The configuration object for mounting a file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports.html
     */
    export interface NfsExportsProperty {
        /**
         * A list of configuration objects that contain the client and options for mounting the OpenZFS file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports-clientconfigurations
         */
        readonly clientConfigurations?: Array<CfnFileSystem.ClientConfigurationsProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NfsExportsProperty`
 *
 * @param properties - the TypeScript properties of a `NfsExportsProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_NfsExportsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientConfigurations', cdk.listValidator(CfnFileSystem_ClientConfigurationsPropertyValidator))(properties.clientConfigurations));
    return errors.wrap('supplied properties not correct for "NfsExportsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.NfsExports` resource
 *
 * @param properties - the TypeScript properties of a `NfsExportsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.NfsExports` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemNfsExportsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_NfsExportsPropertyValidator(properties).assertSuccess();
    return {
        ClientConfigurations: cdk.listMapper(cfnFileSystemClientConfigurationsPropertyToCloudFormation)(properties.clientConfigurations),
    };
}

// @ts-ignore TS6133
function CfnFileSystemNfsExportsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.NfsExportsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.NfsExportsProperty>();
    ret.addPropertyResult('clientConfigurations', 'ClientConfigurations', properties.ClientConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemClientConfigurationsPropertyFromCloudFormation)(properties.ClientConfigurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The configuration for this Amazon FSx for NetApp ONTAP file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html
     */
    export interface OntapConfigurationProperty {
        /**
         * The number of days to retain automatic backups. Setting this property to `0` disables automatic backups. You can retain automatic backups for a maximum of 90 days. The default is `0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-automaticbackupretentiondays
         */
        readonly automaticBackupRetentionDays?: number;
        /**
         * A recurring daily time, in the format `HH:MM` . `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour. For example, `05:00` specifies 5 AM daily.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-dailyautomaticbackupstarttime
         */
        readonly dailyAutomaticBackupStartTime?: string;
        /**
         * Specifies the FSx for ONTAP file system deployment type to use in creating the file system.
         *
         * - `MULTI_AZ_1` - (Default) A high availability file system configured for Multi-AZ redundancy to tolerate temporary Availability Zone (AZ) unavailability.
         * - `SINGLE_AZ_1` - A file system configured for Single-AZ redundancy.
         *
         * For information about the use cases for Multi-AZ and Single-AZ deployments, refer to [Choosing a file system deployment type](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/high-availability-AZ.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-deploymenttype
         */
        readonly deploymentType: string;
        /**
         * The SSD IOPS configuration for the FSx for ONTAP file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-diskiopsconfiguration
         */
        readonly diskIopsConfiguration?: CfnFileSystem.DiskIopsConfigurationProperty | cdk.IResolvable;
        /**
         * (Multi-AZ only) Specifies the IP address range in which the endpoints to access your file system will be created. By default in the Amazon FSx API, Amazon FSx selects an unused IP address range for you from the 198.19.* range. By default in the Amazon FSx console, Amazon FSx chooses the last 64 IP addresses from the VPC’s primary CIDR range to use as the endpoint IP address range for the file system. You can have overlapping endpoint IP addresses for file systems deployed in the same VPC/route tables.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-endpointipaddressrange
         */
        readonly endpointIpAddressRange?: string;
        /**
         * The ONTAP administrative password for the `fsxadmin` user with which you administer your file system using the NetApp ONTAP CLI and REST API.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-fsxadminpassword
         */
        readonly fsxAdminPassword?: string;
        /**
         * Required when `DeploymentType` is set to `MULTI_AZ_1` . This specifies the subnet in which you want the preferred file server to be located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-preferredsubnetid
         */
        readonly preferredSubnetId?: string;
        /**
         * (Multi-AZ only) Specifies the virtual private cloud (VPC) route tables in which your file system's endpoints will be created. You should specify all VPC route tables associated with the subnets in which your clients are located. By default, Amazon FSx selects your VPC's default route table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-routetableids
         */
        readonly routeTableIds?: string[];
        /**
         * Sets the throughput capacity for the file system that you're creating. Valid values are 128, 256, 512, 1024, 2048, and 4096 MBps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-throughputcapacity
         */
        readonly throughputCapacity?: number;
        /**
         * A recurring weekly time, in the format `D:HH:MM` .
         *
         * `D` is the day of the week, for which 1 represents Monday and 7 represents Sunday. For further details, see [the ISO-8601 spec as described on Wikipedia](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/ISO_week_date) .
         *
         * `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour.
         *
         * For example, `1:05:00` specifies maintenance at 5 AM Monday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html#cfn-fsx-filesystem-ontapconfiguration-weeklymaintenancestarttime
         */
        readonly weeklyMaintenanceStartTime?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OntapConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OntapConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_OntapConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automaticBackupRetentionDays', cdk.validateNumber)(properties.automaticBackupRetentionDays));
    errors.collect(cdk.propertyValidator('dailyAutomaticBackupStartTime', cdk.validateString)(properties.dailyAutomaticBackupStartTime));
    errors.collect(cdk.propertyValidator('deploymentType', cdk.requiredValidator)(properties.deploymentType));
    errors.collect(cdk.propertyValidator('deploymentType', cdk.validateString)(properties.deploymentType));
    errors.collect(cdk.propertyValidator('diskIopsConfiguration', CfnFileSystem_DiskIopsConfigurationPropertyValidator)(properties.diskIopsConfiguration));
    errors.collect(cdk.propertyValidator('endpointIpAddressRange', cdk.validateString)(properties.endpointIpAddressRange));
    errors.collect(cdk.propertyValidator('fsxAdminPassword', cdk.validateString)(properties.fsxAdminPassword));
    errors.collect(cdk.propertyValidator('preferredSubnetId', cdk.validateString)(properties.preferredSubnetId));
    errors.collect(cdk.propertyValidator('routeTableIds', cdk.listValidator(cdk.validateString))(properties.routeTableIds));
    errors.collect(cdk.propertyValidator('throughputCapacity', cdk.validateNumber)(properties.throughputCapacity));
    errors.collect(cdk.propertyValidator('weeklyMaintenanceStartTime', cdk.validateString)(properties.weeklyMaintenanceStartTime));
    return errors.wrap('supplied properties not correct for "OntapConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.OntapConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `OntapConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.OntapConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemOntapConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_OntapConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AutomaticBackupRetentionDays: cdk.numberToCloudFormation(properties.automaticBackupRetentionDays),
        DailyAutomaticBackupStartTime: cdk.stringToCloudFormation(properties.dailyAutomaticBackupStartTime),
        DeploymentType: cdk.stringToCloudFormation(properties.deploymentType),
        DiskIopsConfiguration: cfnFileSystemDiskIopsConfigurationPropertyToCloudFormation(properties.diskIopsConfiguration),
        EndpointIpAddressRange: cdk.stringToCloudFormation(properties.endpointIpAddressRange),
        FsxAdminPassword: cdk.stringToCloudFormation(properties.fsxAdminPassword),
        PreferredSubnetId: cdk.stringToCloudFormation(properties.preferredSubnetId),
        RouteTableIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.routeTableIds),
        ThroughputCapacity: cdk.numberToCloudFormation(properties.throughputCapacity),
        WeeklyMaintenanceStartTime: cdk.stringToCloudFormation(properties.weeklyMaintenanceStartTime),
    };
}

// @ts-ignore TS6133
function CfnFileSystemOntapConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.OntapConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.OntapConfigurationProperty>();
    ret.addPropertyResult('automaticBackupRetentionDays', 'AutomaticBackupRetentionDays', properties.AutomaticBackupRetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomaticBackupRetentionDays) : undefined);
    ret.addPropertyResult('dailyAutomaticBackupStartTime', 'DailyAutomaticBackupStartTime', properties.DailyAutomaticBackupStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.DailyAutomaticBackupStartTime) : undefined);
    ret.addPropertyResult('deploymentType', 'DeploymentType', cfn_parse.FromCloudFormation.getString(properties.DeploymentType));
    ret.addPropertyResult('diskIopsConfiguration', 'DiskIopsConfiguration', properties.DiskIopsConfiguration != null ? CfnFileSystemDiskIopsConfigurationPropertyFromCloudFormation(properties.DiskIopsConfiguration) : undefined);
    ret.addPropertyResult('endpointIpAddressRange', 'EndpointIpAddressRange', properties.EndpointIpAddressRange != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointIpAddressRange) : undefined);
    ret.addPropertyResult('fsxAdminPassword', 'FsxAdminPassword', properties.FsxAdminPassword != null ? cfn_parse.FromCloudFormation.getString(properties.FsxAdminPassword) : undefined);
    ret.addPropertyResult('preferredSubnetId', 'PreferredSubnetId', properties.PreferredSubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredSubnetId) : undefined);
    ret.addPropertyResult('routeTableIds', 'RouteTableIds', properties.RouteTableIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.RouteTableIds) : undefined);
    ret.addPropertyResult('throughputCapacity', 'ThroughputCapacity', properties.ThroughputCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThroughputCapacity) : undefined);
    ret.addPropertyResult('weeklyMaintenanceStartTime', 'WeeklyMaintenanceStartTime', properties.WeeklyMaintenanceStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.WeeklyMaintenanceStartTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The OpenZFS configuration for the file system that's being created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html
     */
    export interface OpenZFSConfigurationProperty {
        /**
         * The number of days to retain automatic backups. Setting this property to `0` disables automatic backups. You can retain automatic backups for a maximum of 90 days. The default is `0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-automaticbackupretentiondays
         */
        readonly automaticBackupRetentionDays?: number;
        /**
         * A Boolean value indicating whether tags for the file system should be copied to backups. This value defaults to `false` . If it's set to `true` , all tags for the file system are copied to all automatic and user-initiated backups where the user doesn't specify tags. If this value is `true` , and you specify one or more tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the file system, regardless of this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-copytagstobackups
         */
        readonly copyTagsToBackups?: boolean | cdk.IResolvable;
        /**
         * A Boolean value indicating whether tags for the file system should be copied to volumes. This value defaults to `false` . If it's set to `true` , all tags for the file system are copied to volumes where the user doesn't specify tags. If this value is `true` , and you specify one or more tags, only the specified tags are copied to volumes. If you specify one or more tags when creating the volume, no tags are copied from the file system, regardless of this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-copytagstovolumes
         */
        readonly copyTagsToVolumes?: boolean | cdk.IResolvable;
        /**
         * A recurring daily time, in the format `HH:MM` . `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour. For example, `05:00` specifies 5 AM daily.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-dailyautomaticbackupstarttime
         */
        readonly dailyAutomaticBackupStartTime?: string;
        /**
         * Specifies the file system deployment type. Single AZ deployment types are configured for redundancy within a single Availability Zone in an AWS Region . Valid values are the following:
         *
         * - `SINGLE_AZ_1` - (Default) Creates file systems with throughput capacities of 64 - 4,096 MB/s. `Single_AZ_1` is available in all AWS Regions where Amazon FSx for OpenZFS is available, except US West (Oregon).
         * - `SINGLE_AZ_2` - Creates file systems with throughput capacities of 160 - 10,240 MB/s using an NVMe L2ARC cache. `Single_AZ_2` is available only in the US East (N. Virginia), US East (Ohio), US West (Oregon), and Europe (Ireland) AWS Regions .
         *
         * For more information, see: [Deployment type availability](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/availability-durability.html#available-aws-regions) and [File system performance](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/performance.html#zfs-fs-performance) in the *Amazon FSx for OpenZFS User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-deploymenttype
         */
        readonly deploymentType: string;
        /**
         * The SSD IOPS (input/output operations per second) configuration for an Amazon FSx for NetApp ONTAP or Amazon FSx for OpenZFS file system. The default is 3 IOPS per GB of storage capacity, but you can provision additional IOPS per GB of storage. The configuration consists of the total number of provisioned SSD IOPS and how the amount was provisioned (by the customer or by the system).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-diskiopsconfiguration
         */
        readonly diskIopsConfiguration?: CfnFileSystem.DiskIopsConfigurationProperty | cdk.IResolvable;
        /**
         * To delete a file system if there are child volumes present below the root volume, use the string `DELETE_CHILD_VOLUMES_AND_SNAPSHOTS` . If your file system has child volumes and you don't use this option, the delete request will fail.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-options
         */
        readonly options?: string[];
        /**
         * The configuration Amazon FSx uses when creating the root value of the Amazon FSx for OpenZFS file system. All volumes are children of the root volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration
         */
        readonly rootVolumeConfiguration?: CfnFileSystem.RootVolumeConfigurationProperty | cdk.IResolvable;
        /**
         * Specifies the throughput of an Amazon FSx for OpenZFS file system, measured in megabytes per second (MB/s). Valid values depend on the DeploymentType you choose, as follows:
         *
         * - For `SINGLE_AZ_1` , valid values are 64, 128, 256, 512, 1024, 2048, 3072, or 4096 MB/s.
         * - For `SINGLE_AZ_2` , valid values are 160, 320, 640, 1280, 2560, 3840, 5120, 7680, or 10240 MB/s.
         *
         * You pay for additional throughput capacity that you provision.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-throughputcapacity
         */
        readonly throughputCapacity?: number;
        /**
         * A recurring weekly time, in the format `D:HH:MM` .
         *
         * `D` is the day of the week, for which 1 represents Monday and 7 represents Sunday. For further details, see [the ISO-8601 spec as described on Wikipedia](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/ISO_week_date) .
         *
         * `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour.
         *
         * For example, `1:05:00` specifies maintenance at 5 AM Monday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-weeklymaintenancestarttime
         */
        readonly weeklyMaintenanceStartTime?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OpenZFSConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OpenZFSConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_OpenZFSConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automaticBackupRetentionDays', cdk.validateNumber)(properties.automaticBackupRetentionDays));
    errors.collect(cdk.propertyValidator('copyTagsToBackups', cdk.validateBoolean)(properties.copyTagsToBackups));
    errors.collect(cdk.propertyValidator('copyTagsToVolumes', cdk.validateBoolean)(properties.copyTagsToVolumes));
    errors.collect(cdk.propertyValidator('dailyAutomaticBackupStartTime', cdk.validateString)(properties.dailyAutomaticBackupStartTime));
    errors.collect(cdk.propertyValidator('deploymentType', cdk.requiredValidator)(properties.deploymentType));
    errors.collect(cdk.propertyValidator('deploymentType', cdk.validateString)(properties.deploymentType));
    errors.collect(cdk.propertyValidator('diskIopsConfiguration', CfnFileSystem_DiskIopsConfigurationPropertyValidator)(properties.diskIopsConfiguration));
    errors.collect(cdk.propertyValidator('options', cdk.listValidator(cdk.validateString))(properties.options));
    errors.collect(cdk.propertyValidator('rootVolumeConfiguration', CfnFileSystem_RootVolumeConfigurationPropertyValidator)(properties.rootVolumeConfiguration));
    errors.collect(cdk.propertyValidator('throughputCapacity', cdk.validateNumber)(properties.throughputCapacity));
    errors.collect(cdk.propertyValidator('weeklyMaintenanceStartTime', cdk.validateString)(properties.weeklyMaintenanceStartTime));
    return errors.wrap('supplied properties not correct for "OpenZFSConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.OpenZFSConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `OpenZFSConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.OpenZFSConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemOpenZFSConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_OpenZFSConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AutomaticBackupRetentionDays: cdk.numberToCloudFormation(properties.automaticBackupRetentionDays),
        CopyTagsToBackups: cdk.booleanToCloudFormation(properties.copyTagsToBackups),
        CopyTagsToVolumes: cdk.booleanToCloudFormation(properties.copyTagsToVolumes),
        DailyAutomaticBackupStartTime: cdk.stringToCloudFormation(properties.dailyAutomaticBackupStartTime),
        DeploymentType: cdk.stringToCloudFormation(properties.deploymentType),
        DiskIopsConfiguration: cfnFileSystemDiskIopsConfigurationPropertyToCloudFormation(properties.diskIopsConfiguration),
        Options: cdk.listMapper(cdk.stringToCloudFormation)(properties.options),
        RootVolumeConfiguration: cfnFileSystemRootVolumeConfigurationPropertyToCloudFormation(properties.rootVolumeConfiguration),
        ThroughputCapacity: cdk.numberToCloudFormation(properties.throughputCapacity),
        WeeklyMaintenanceStartTime: cdk.stringToCloudFormation(properties.weeklyMaintenanceStartTime),
    };
}

// @ts-ignore TS6133
function CfnFileSystemOpenZFSConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.OpenZFSConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.OpenZFSConfigurationProperty>();
    ret.addPropertyResult('automaticBackupRetentionDays', 'AutomaticBackupRetentionDays', properties.AutomaticBackupRetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomaticBackupRetentionDays) : undefined);
    ret.addPropertyResult('copyTagsToBackups', 'CopyTagsToBackups', properties.CopyTagsToBackups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToBackups) : undefined);
    ret.addPropertyResult('copyTagsToVolumes', 'CopyTagsToVolumes', properties.CopyTagsToVolumes != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToVolumes) : undefined);
    ret.addPropertyResult('dailyAutomaticBackupStartTime', 'DailyAutomaticBackupStartTime', properties.DailyAutomaticBackupStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.DailyAutomaticBackupStartTime) : undefined);
    ret.addPropertyResult('deploymentType', 'DeploymentType', cfn_parse.FromCloudFormation.getString(properties.DeploymentType));
    ret.addPropertyResult('diskIopsConfiguration', 'DiskIopsConfiguration', properties.DiskIopsConfiguration != null ? CfnFileSystemDiskIopsConfigurationPropertyFromCloudFormation(properties.DiskIopsConfiguration) : undefined);
    ret.addPropertyResult('options', 'Options', properties.Options != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Options) : undefined);
    ret.addPropertyResult('rootVolumeConfiguration', 'RootVolumeConfiguration', properties.RootVolumeConfiguration != null ? CfnFileSystemRootVolumeConfigurationPropertyFromCloudFormation(properties.RootVolumeConfiguration) : undefined);
    ret.addPropertyResult('throughputCapacity', 'ThroughputCapacity', properties.ThroughputCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThroughputCapacity) : undefined);
    ret.addPropertyResult('weeklyMaintenanceStartTime', 'WeeklyMaintenanceStartTime', properties.WeeklyMaintenanceStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.WeeklyMaintenanceStartTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The configuration of an Amazon FSx for OpenZFS root volume.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration.html
     */
    export interface RootVolumeConfigurationProperty {
        /**
         * A Boolean value indicating whether tags for the volume should be copied to snapshots of the volume. This value defaults to `false` . If it's set to `true` , all tags for the volume are copied to snapshots where the user doesn't specify tags. If this value is `true` and you specify one or more tags, only the specified tags are copied to snapshots. If you specify one or more tags when creating the snapshot, no tags are copied from the volume, regardless of this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-copytagstosnapshots
         */
        readonly copyTagsToSnapshots?: boolean | cdk.IResolvable;
        /**
         * Specifies the method used to compress the data on the volume. The compression type is `NONE` by default.
         *
         * - `NONE` - Doesn't compress the data on the volume. `NONE` is the default.
         * - `ZSTD` - Compresses the data in the volume using the Zstandard (ZSTD) compression algorithm. Compared to LZ4, Z-Standard provides a better compression ratio to minimize on-disk storage utilization.
         * - `LZ4` - Compresses the data in the volume using the LZ4 compression algorithm. Compared to Z-Standard, LZ4 is less compute-intensive and delivers higher write throughput speeds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-datacompressiontype
         */
        readonly dataCompressionType?: string;
        /**
         * The configuration object for mounting a file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-nfsexports
         */
        readonly nfsExports?: Array<CfnFileSystem.NfsExportsProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A Boolean value indicating whether the volume is read-only. Setting this value to `true` can be useful after you have completed changes to a volume and no longer want changes to occur.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-readonly
         */
        readonly readOnly?: boolean | cdk.IResolvable;
        /**
         * Specifies the record size of an OpenZFS root volume, in kibibytes (KiB). Valid values are 4, 8, 16, 32, 64, 128, 256, 512, or 1024 KiB. The default is 128 KiB. Most workloads should use the default record size. Database workflows can benefit from a smaller record size, while streaming workflows can benefit from a larger record size. For additional guidance on setting a custom record size, see [Tips for maximizing performance](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/performance.html#performance-tips-zfs) in the *Amazon FSx for OpenZFS User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-recordsizekib
         */
        readonly recordSizeKiB?: number;
        /**
         * An object specifying how much storage users or groups can use on the volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas
         */
        readonly userAndGroupQuotas?: Array<CfnFileSystem.UserAndGroupQuotasProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RootVolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RootVolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_RootVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('copyTagsToSnapshots', cdk.validateBoolean)(properties.copyTagsToSnapshots));
    errors.collect(cdk.propertyValidator('dataCompressionType', cdk.validateString)(properties.dataCompressionType));
    errors.collect(cdk.propertyValidator('nfsExports', cdk.listValidator(CfnFileSystem_NfsExportsPropertyValidator))(properties.nfsExports));
    errors.collect(cdk.propertyValidator('readOnly', cdk.validateBoolean)(properties.readOnly));
    errors.collect(cdk.propertyValidator('recordSizeKiB', cdk.validateNumber)(properties.recordSizeKiB));
    errors.collect(cdk.propertyValidator('userAndGroupQuotas', cdk.listValidator(CfnFileSystem_UserAndGroupQuotasPropertyValidator))(properties.userAndGroupQuotas));
    return errors.wrap('supplied properties not correct for "RootVolumeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.RootVolumeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `RootVolumeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.RootVolumeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemRootVolumeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_RootVolumeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CopyTagsToSnapshots: cdk.booleanToCloudFormation(properties.copyTagsToSnapshots),
        DataCompressionType: cdk.stringToCloudFormation(properties.dataCompressionType),
        NfsExports: cdk.listMapper(cfnFileSystemNfsExportsPropertyToCloudFormation)(properties.nfsExports),
        ReadOnly: cdk.booleanToCloudFormation(properties.readOnly),
        RecordSizeKiB: cdk.numberToCloudFormation(properties.recordSizeKiB),
        UserAndGroupQuotas: cdk.listMapper(cfnFileSystemUserAndGroupQuotasPropertyToCloudFormation)(properties.userAndGroupQuotas),
    };
}

// @ts-ignore TS6133
function CfnFileSystemRootVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.RootVolumeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.RootVolumeConfigurationProperty>();
    ret.addPropertyResult('copyTagsToSnapshots', 'CopyTagsToSnapshots', properties.CopyTagsToSnapshots != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToSnapshots) : undefined);
    ret.addPropertyResult('dataCompressionType', 'DataCompressionType', properties.DataCompressionType != null ? cfn_parse.FromCloudFormation.getString(properties.DataCompressionType) : undefined);
    ret.addPropertyResult('nfsExports', 'NfsExports', properties.NfsExports != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemNfsExportsPropertyFromCloudFormation)(properties.NfsExports) : undefined);
    ret.addPropertyResult('readOnly', 'ReadOnly', properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined);
    ret.addPropertyResult('recordSizeKiB', 'RecordSizeKiB', properties.RecordSizeKiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.RecordSizeKiB) : undefined);
    ret.addPropertyResult('userAndGroupQuotas', 'UserAndGroupQuotas', properties.UserAndGroupQuotas != null ? cfn_parse.FromCloudFormation.getArray(CfnFileSystemUserAndGroupQuotasPropertyFromCloudFormation)(properties.UserAndGroupQuotas) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The configuration that Amazon FSx uses to join a FSx for Windows File Server file system or an ONTAP storage virtual machine (SVM) to a self-managed (including on-premises) Microsoft Active Directory (AD) directory. For more information, see [Using Amazon FSx with your self-managed Microsoft Active Directory](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/self-managed-AD.html) or [Managing SVMs](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-svms.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration.html
     */
    export interface SelfManagedActiveDirectoryConfigurationProperty {
        /**
         * A list of up to three IP addresses of DNS servers or domain controllers in the self-managed AD directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration-dnsips
         */
        readonly dnsIps?: string[];
        /**
         * The fully qualified domain name of the self-managed AD directory, such as `corp.example.com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration-domainname
         */
        readonly domainName?: string;
        /**
         * (Optional) The name of the domain group whose members are granted administrative privileges for the file system. Administrative privileges include taking ownership of files and folders, setting audit controls (audit ACLs) on files and folders, and administering the file system remotely by using the FSx Remote PowerShell. The group that you specify must already exist in your domain. If you don't provide one, your AD domain's Domain Admins group is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration-filesystemadministratorsgroup
         */
        readonly fileSystemAdministratorsGroup?: string;
        /**
         * (Optional) The fully qualified distinguished name of the organizational unit within your self-managed AD directory. Amazon FSx only accepts OU as the direct parent of the file system. An example is `OU=FSx,DC=yourdomain,DC=corp,DC=com` . To learn more, see [RFC 2253](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc2253) . If none is provided, the FSx file system is created in the default location of your self-managed AD directory.
         *
         * > Only Organizational Unit (OU) objects can be the direct parent of the file system that you're creating.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration-organizationalunitdistinguishedname
         */
        readonly organizationalUnitDistinguishedName?: string;
        /**
         * The password for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration-password
         */
        readonly password?: string;
        /**
         * The user name for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain. This account must have the permission to join computers to the domain in the organizational unit provided in `OrganizationalUnitDistinguishedName` , or in the default location of your AD domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration-username
         */
        readonly userName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SelfManagedActiveDirectoryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedActiveDirectoryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_SelfManagedActiveDirectoryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dnsIps', cdk.listValidator(cdk.validateString))(properties.dnsIps));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('fileSystemAdministratorsGroup', cdk.validateString)(properties.fileSystemAdministratorsGroup));
    errors.collect(cdk.propertyValidator('organizationalUnitDistinguishedName', cdk.validateString)(properties.organizationalUnitDistinguishedName));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('userName', cdk.validateString)(properties.userName));
    return errors.wrap('supplied properties not correct for "SelfManagedActiveDirectoryConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.SelfManagedActiveDirectoryConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SelfManagedActiveDirectoryConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.SelfManagedActiveDirectoryConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemSelfManagedActiveDirectoryConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_SelfManagedActiveDirectoryConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DnsIps: cdk.listMapper(cdk.stringToCloudFormation)(properties.dnsIps),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        FileSystemAdministratorsGroup: cdk.stringToCloudFormation(properties.fileSystemAdministratorsGroup),
        OrganizationalUnitDistinguishedName: cdk.stringToCloudFormation(properties.organizationalUnitDistinguishedName),
        Password: cdk.stringToCloudFormation(properties.password),
        UserName: cdk.stringToCloudFormation(properties.userName),
    };
}

// @ts-ignore TS6133
function CfnFileSystemSelfManagedActiveDirectoryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.SelfManagedActiveDirectoryConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.SelfManagedActiveDirectoryConfigurationProperty>();
    ret.addPropertyResult('dnsIps', 'DnsIps', properties.DnsIps != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DnsIps) : undefined);
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('fileSystemAdministratorsGroup', 'FileSystemAdministratorsGroup', properties.FileSystemAdministratorsGroup != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemAdministratorsGroup) : undefined);
    ret.addPropertyResult('organizationalUnitDistinguishedName', 'OrganizationalUnitDistinguishedName', properties.OrganizationalUnitDistinguishedName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnitDistinguishedName) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('userName', 'UserName', properties.UserName != null ? cfn_parse.FromCloudFormation.getString(properties.UserName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The configuration for how much storage a user or group can use on the volume.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas.html
     */
    export interface UserAndGroupQuotasProperty {
        /**
         * The ID of the user or group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas-id
         */
        readonly id?: number;
        /**
         * The amount of storage that the user or group can use in gibibytes (GiB).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas-storagecapacityquotagib
         */
        readonly storageCapacityQuotaGiB?: number;
        /**
         * A value that specifies whether the quota applies to a user or group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas.html#cfn-fsx-filesystem-openzfsconfiguration-rootvolumeconfiguration-userandgroupquotas-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserAndGroupQuotasProperty`
 *
 * @param properties - the TypeScript properties of a `UserAndGroupQuotasProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_UserAndGroupQuotasPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateNumber)(properties.id));
    errors.collect(cdk.propertyValidator('storageCapacityQuotaGiB', cdk.validateNumber)(properties.storageCapacityQuotaGiB));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "UserAndGroupQuotasProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.UserAndGroupQuotas` resource
 *
 * @param properties - the TypeScript properties of a `UserAndGroupQuotasProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.UserAndGroupQuotas` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemUserAndGroupQuotasPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_UserAndGroupQuotasPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.numberToCloudFormation(properties.id),
        StorageCapacityQuotaGiB: cdk.numberToCloudFormation(properties.storageCapacityQuotaGiB),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnFileSystemUserAndGroupQuotasPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.UserAndGroupQuotasProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.UserAndGroupQuotasProperty>();
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getNumber(properties.Id) : undefined);
    ret.addPropertyResult('storageCapacityQuotaGiB', 'StorageCapacityQuotaGiB', properties.StorageCapacityQuotaGiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.StorageCapacityQuotaGiB) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFileSystem {
    /**
     * The Microsoft Windows configuration for the file system that's being created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html
     */
    export interface WindowsConfigurationProperty {
        /**
         * The ID for an existing AWS Managed Microsoft Active Directory (AD) instance that the file system should join when it's created. Required if you are joining the file system to an existing AWS Managed Microsoft AD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-activedirectoryid
         */
        readonly activeDirectoryId?: string;
        /**
         * An array of one or more DNS alias names that you want to associate with the Amazon FSx file system. Aliases allow you to use existing DNS names to access the data in your Amazon FSx file system. You can associate up to 50 aliases with a file system at any time.
         *
         * For more information, see [Working with DNS Aliases](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/managing-dns-aliases.html) and [Walkthrough 5: Using DNS aliases to access your file system](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/walkthrough05-file-system-custom-CNAME.html) , including additional steps you must take to be able to access your file system using a DNS alias.
         *
         * An alias name has to meet the following requirements:
         *
         * - Formatted as a fully-qualified domain name (FQDN), `hostname.domain` , for example, `accounting.example.com` .
         * - Can contain alphanumeric characters, the underscore (_), and the hyphen (-).
         * - Cannot start or end with a hyphen.
         * - Can start with a numeric.
         *
         * For DNS alias names, Amazon FSx stores alphabetical characters as lowercase letters (a-z), regardless of how you specify them: as uppercase letters, lowercase letters, or the corresponding letters in escape codes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-aliases
         */
        readonly aliases?: string[];
        /**
         * The configuration that Amazon FSx for Windows File Server uses to audit and log user accesses of files, folders, and file shares on the Amazon FSx for Windows File Server file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-auditlogconfiguration
         */
        readonly auditLogConfiguration?: CfnFileSystem.AuditLogConfigurationProperty | cdk.IResolvable;
        /**
         * The number of days to retain automatic backups. Setting this property to `0` disables automatic backups. You can retain automatic backups for a maximum of 90 days. The default is `0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-automaticbackupretentiondays
         */
        readonly automaticBackupRetentionDays?: number;
        /**
         * A boolean flag indicating whether tags for the file system should be copied to backups. This value defaults to false. If it's set to true, all tags for the file system are copied to all automatic and user-initiated backups where the user doesn't specify tags. If this value is true, and you specify one or more tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the file system, regardless of this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-copytagstobackups
         */
        readonly copyTagsToBackups?: boolean | cdk.IResolvable;
        /**
         * A recurring daily time, in the format `HH:MM` . `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour. For example, `05:00` specifies 5 AM daily.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-dailyautomaticbackupstarttime
         */
        readonly dailyAutomaticBackupStartTime?: string;
        /**
         * Specifies the file system deployment type, valid values are the following:
         *
         * - `MULTI_AZ_1` - Deploys a high availability file system that is configured for Multi-AZ redundancy to tolerate temporary Availability Zone (AZ) unavailability. You can only deploy a Multi-AZ file system in AWS Regions that have a minimum of three Availability Zones. Also supports HDD storage type
         * - `SINGLE_AZ_1` - (Default) Choose to deploy a file system that is configured for single AZ redundancy.
         * - `SINGLE_AZ_2` - The latest generation Single AZ file system. Specifies a file system that is configured for single AZ redundancy and supports HDD storage type.
         *
         * For more information, see [Availability and Durability: Single-AZ and Multi-AZ File Systems](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/high-availability-multiAZ.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-deploymenttype
         */
        readonly deploymentType?: string;
        /**
         * Required when `DeploymentType` is set to `MULTI_AZ_1` . This specifies the subnet in which you want the preferred file server to be located. For in- AWS applications, we recommend that you launch your clients in the same availability zone as your preferred file server to reduce cross-availability zone data transfer costs and minimize latency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-preferredsubnetid
         */
        readonly preferredSubnetId?: string;
        /**
         * The configuration that Amazon FSx uses to join a FSx for Windows File Server file system or an ONTAP storage virtual machine (SVM) to a self-managed (including on-premises) Microsoft Active Directory (AD) directory. For more information, see [Using Amazon FSx with your self-managed Microsoft Active Directory](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/self-managed-AD.html) or [Managing SVMs](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-svms.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-selfmanagedactivedirectoryconfiguration
         */
        readonly selfManagedActiveDirectoryConfiguration?: CfnFileSystem.SelfManagedActiveDirectoryConfigurationProperty | cdk.IResolvable;
        /**
         * Sets the throughput capacity of an Amazon FSx file system, measured in megabytes per second (MB/s), in 2 to the *n* th increments, between 2^3 (8) and 2^11 (2048).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-throughputcapacity
         */
        readonly throughputCapacity: number;
        /**
         * A recurring weekly time, in the format `D:HH:MM` .
         *
         * `D` is the day of the week, for which 1 represents Monday and 7 represents Sunday. For further details, see [the ISO-8601 spec as described on Wikipedia](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/ISO_week_date) .
         *
         * `HH` is the zero-padded hour of the day (0-23), and `MM` is the zero-padded minute of the hour.
         *
         * For example, `1:05:00` specifies maintenance at 5 AM Monday.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-windowsconfiguration.html#cfn-fsx-filesystem-windowsconfiguration-weeklymaintenancestarttime
         */
        readonly weeklyMaintenanceStartTime?: string;
    }
}

/**
 * Determine whether the given properties match those of a `WindowsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WindowsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFileSystem_WindowsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activeDirectoryId', cdk.validateString)(properties.activeDirectoryId));
    errors.collect(cdk.propertyValidator('aliases', cdk.listValidator(cdk.validateString))(properties.aliases));
    errors.collect(cdk.propertyValidator('auditLogConfiguration', CfnFileSystem_AuditLogConfigurationPropertyValidator)(properties.auditLogConfiguration));
    errors.collect(cdk.propertyValidator('automaticBackupRetentionDays', cdk.validateNumber)(properties.automaticBackupRetentionDays));
    errors.collect(cdk.propertyValidator('copyTagsToBackups', cdk.validateBoolean)(properties.copyTagsToBackups));
    errors.collect(cdk.propertyValidator('dailyAutomaticBackupStartTime', cdk.validateString)(properties.dailyAutomaticBackupStartTime));
    errors.collect(cdk.propertyValidator('deploymentType', cdk.validateString)(properties.deploymentType));
    errors.collect(cdk.propertyValidator('preferredSubnetId', cdk.validateString)(properties.preferredSubnetId));
    errors.collect(cdk.propertyValidator('selfManagedActiveDirectoryConfiguration', CfnFileSystem_SelfManagedActiveDirectoryConfigurationPropertyValidator)(properties.selfManagedActiveDirectoryConfiguration));
    errors.collect(cdk.propertyValidator('throughputCapacity', cdk.requiredValidator)(properties.throughputCapacity));
    errors.collect(cdk.propertyValidator('throughputCapacity', cdk.validateNumber)(properties.throughputCapacity));
    errors.collect(cdk.propertyValidator('weeklyMaintenanceStartTime', cdk.validateString)(properties.weeklyMaintenanceStartTime));
    return errors.wrap('supplied properties not correct for "WindowsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::FileSystem.WindowsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `WindowsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::FileSystem.WindowsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFileSystemWindowsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFileSystem_WindowsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ActiveDirectoryId: cdk.stringToCloudFormation(properties.activeDirectoryId),
        Aliases: cdk.listMapper(cdk.stringToCloudFormation)(properties.aliases),
        AuditLogConfiguration: cfnFileSystemAuditLogConfigurationPropertyToCloudFormation(properties.auditLogConfiguration),
        AutomaticBackupRetentionDays: cdk.numberToCloudFormation(properties.automaticBackupRetentionDays),
        CopyTagsToBackups: cdk.booleanToCloudFormation(properties.copyTagsToBackups),
        DailyAutomaticBackupStartTime: cdk.stringToCloudFormation(properties.dailyAutomaticBackupStartTime),
        DeploymentType: cdk.stringToCloudFormation(properties.deploymentType),
        PreferredSubnetId: cdk.stringToCloudFormation(properties.preferredSubnetId),
        SelfManagedActiveDirectoryConfiguration: cfnFileSystemSelfManagedActiveDirectoryConfigurationPropertyToCloudFormation(properties.selfManagedActiveDirectoryConfiguration),
        ThroughputCapacity: cdk.numberToCloudFormation(properties.throughputCapacity),
        WeeklyMaintenanceStartTime: cdk.stringToCloudFormation(properties.weeklyMaintenanceStartTime),
    };
}

// @ts-ignore TS6133
function CfnFileSystemWindowsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFileSystem.WindowsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFileSystem.WindowsConfigurationProperty>();
    ret.addPropertyResult('activeDirectoryId', 'ActiveDirectoryId', properties.ActiveDirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.ActiveDirectoryId) : undefined);
    ret.addPropertyResult('aliases', 'Aliases', properties.Aliases != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Aliases) : undefined);
    ret.addPropertyResult('auditLogConfiguration', 'AuditLogConfiguration', properties.AuditLogConfiguration != null ? CfnFileSystemAuditLogConfigurationPropertyFromCloudFormation(properties.AuditLogConfiguration) : undefined);
    ret.addPropertyResult('automaticBackupRetentionDays', 'AutomaticBackupRetentionDays', properties.AutomaticBackupRetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomaticBackupRetentionDays) : undefined);
    ret.addPropertyResult('copyTagsToBackups', 'CopyTagsToBackups', properties.CopyTagsToBackups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToBackups) : undefined);
    ret.addPropertyResult('dailyAutomaticBackupStartTime', 'DailyAutomaticBackupStartTime', properties.DailyAutomaticBackupStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.DailyAutomaticBackupStartTime) : undefined);
    ret.addPropertyResult('deploymentType', 'DeploymentType', properties.DeploymentType != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentType) : undefined);
    ret.addPropertyResult('preferredSubnetId', 'PreferredSubnetId', properties.PreferredSubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredSubnetId) : undefined);
    ret.addPropertyResult('selfManagedActiveDirectoryConfiguration', 'SelfManagedActiveDirectoryConfiguration', properties.SelfManagedActiveDirectoryConfiguration != null ? CfnFileSystemSelfManagedActiveDirectoryConfigurationPropertyFromCloudFormation(properties.SelfManagedActiveDirectoryConfiguration) : undefined);
    ret.addPropertyResult('throughputCapacity', 'ThroughputCapacity', cfn_parse.FromCloudFormation.getNumber(properties.ThroughputCapacity));
    ret.addPropertyResult('weeklyMaintenanceStartTime', 'WeeklyMaintenanceStartTime', properties.WeeklyMaintenanceStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.WeeklyMaintenanceStartTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSnapshot`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html
 */
export interface CfnSnapshotProps {

    /**
     * The name of the snapshot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html#cfn-fsx-snapshot-name
     */
    readonly name: string;

    /**
     * The ID of the volume that the snapshot is of.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html#cfn-fsx-snapshot-volumeid
     */
    readonly volumeId: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html#cfn-fsx-snapshot-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnSnapshotProps`
 *
 * @param properties - the TypeScript properties of a `CfnSnapshotProps`
 *
 * @returns the result of the validation.
 */
function CfnSnapshotPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('volumeId', cdk.requiredValidator)(properties.volumeId));
    errors.collect(cdk.propertyValidator('volumeId', cdk.validateString)(properties.volumeId));
    return errors.wrap('supplied properties not correct for "CfnSnapshotProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Snapshot` resource
 *
 * @param properties - the TypeScript properties of a `CfnSnapshotProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Snapshot` resource.
 */
// @ts-ignore TS6133
function cfnSnapshotPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSnapshotPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        VolumeId: cdk.stringToCloudFormation(properties.volumeId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSnapshotPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSnapshotProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSnapshotProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('volumeId', 'VolumeId', cfn_parse.FromCloudFormation.getString(properties.VolumeId));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FSx::Snapshot`
 *
 * A snapshot of an Amazon FSx for OpenZFS volume.
 *
 * @cloudformationResource AWS::FSx::Snapshot
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html
 */
export class CfnSnapshot extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FSx::Snapshot";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSnapshot {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSnapshotPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSnapshot(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the snapshot's Amazon Resource Name (ARN).
     *
     * Example: `arn:aws:fsx:us-east-2:111133334444:snapshot/fsvol-01234567890123456/fsvolsnap-0123456789abcedf5`
     * @cloudformationAttribute ResourceARN
     */
    public readonly attrResourceArn: string;

    /**
     * The name of the snapshot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html#cfn-fsx-snapshot-name
     */
    public name: string;

    /**
     * The ID of the volume that the snapshot is of.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html#cfn-fsx-snapshot-volumeid
     */
    public volumeId: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-snapshot.html#cfn-fsx-snapshot-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FSx::Snapshot`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSnapshotProps) {
        super(scope, id, { type: CfnSnapshot.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'volumeId', this);
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceARN', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.volumeId = props.volumeId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FSx::Snapshot", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSnapshot.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            volumeId: this.volumeId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSnapshotPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnStorageVirtualMachine`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html
 */
export interface CfnStorageVirtualMachineProps {

    /**
     * Specifies the FSx for ONTAP file system on which to create the SVM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-filesystemid
     */
    readonly fileSystemId: string;

    /**
     * The name of the SVM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-name
     */
    readonly name: string;

    /**
     * Describes the Microsoft Active Directory configuration to which the SVM is joined, if applicable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration
     */
    readonly activeDirectoryConfiguration?: CfnStorageVirtualMachine.ActiveDirectoryConfigurationProperty | cdk.IResolvable;

    /**
     * The security style of the root volume of the SVM. Specify one of the following values:
     *
     * - `UNIX` if the file system is managed by a UNIX administrator, the majority of users are NFS clients, and an application accessing the data uses a UNIX user as the service account.
     * - `NTFS` if the file system is managed by a Windows administrator, the majority of users are SMB clients, and an application accessing the data uses a Windows user as the service account.
     * - `MIXED` if the file system is managed by both UNIX and Windows administrators and users consist of both NFS and SMB clients.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-rootvolumesecuritystyle
     */
    readonly rootVolumeSecurityStyle?: string;

    /**
     * Specifies the password to use when logging on to the SVM using a secure shell (SSH) connection to the SVM's management endpoint. Doing so enables you to manage the SVM using the NetApp ONTAP CLI or REST API. If you do not specify a password, you can still use the file system's `fsxadmin` user to manage the SVM. For more information, see [Managing SVMs using the NetApp ONTAP CLI](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-resources-ontap-apps.html#vsadmin-ontap-cli) in the *FSx for ONTAP User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-svmadminpassword
     */
    readonly svmAdminPassword?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnStorageVirtualMachineProps`
 *
 * @param properties - the TypeScript properties of a `CfnStorageVirtualMachineProps`
 *
 * @returns the result of the validation.
 */
function CfnStorageVirtualMachinePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activeDirectoryConfiguration', CfnStorageVirtualMachine_ActiveDirectoryConfigurationPropertyValidator)(properties.activeDirectoryConfiguration));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.requiredValidator)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rootVolumeSecurityStyle', cdk.validateString)(properties.rootVolumeSecurityStyle));
    errors.collect(cdk.propertyValidator('svmAdminPassword', cdk.validateString)(properties.svmAdminPassword));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStorageVirtualMachineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::StorageVirtualMachine` resource
 *
 * @param properties - the TypeScript properties of a `CfnStorageVirtualMachineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::StorageVirtualMachine` resource.
 */
// @ts-ignore TS6133
function cfnStorageVirtualMachinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageVirtualMachinePropsValidator(properties).assertSuccess();
    return {
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        Name: cdk.stringToCloudFormation(properties.name),
        ActiveDirectoryConfiguration: cfnStorageVirtualMachineActiveDirectoryConfigurationPropertyToCloudFormation(properties.activeDirectoryConfiguration),
        RootVolumeSecurityStyle: cdk.stringToCloudFormation(properties.rootVolumeSecurityStyle),
        SvmAdminPassword: cdk.stringToCloudFormation(properties.svmAdminPassword),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStorageVirtualMachinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageVirtualMachineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageVirtualMachineProps>();
    ret.addPropertyResult('fileSystemId', 'FileSystemId', cfn_parse.FromCloudFormation.getString(properties.FileSystemId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('activeDirectoryConfiguration', 'ActiveDirectoryConfiguration', properties.ActiveDirectoryConfiguration != null ? CfnStorageVirtualMachineActiveDirectoryConfigurationPropertyFromCloudFormation(properties.ActiveDirectoryConfiguration) : undefined);
    ret.addPropertyResult('rootVolumeSecurityStyle', 'RootVolumeSecurityStyle', properties.RootVolumeSecurityStyle != null ? cfn_parse.FromCloudFormation.getString(properties.RootVolumeSecurityStyle) : undefined);
    ret.addPropertyResult('svmAdminPassword', 'SvmAdminPassword', properties.SvmAdminPassword != null ? cfn_parse.FromCloudFormation.getString(properties.SvmAdminPassword) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FSx::StorageVirtualMachine`
 *
 * Creates a storage virtual machine (SVM) for an Amazon FSx for ONTAP file system.
 *
 * @cloudformationResource AWS::FSx::StorageVirtualMachine
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html
 */
export class CfnStorageVirtualMachine extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FSx::StorageVirtualMachine";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStorageVirtualMachine {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStorageVirtualMachinePropsFromCloudFormation(resourceProperties);
        const ret = new CfnStorageVirtualMachine(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the storage virtual machine's Amazon Resource Name (ARN).
     *
     * Example: `arn:aws:fsx:us-east-2:111111111111:storage-virtual-machine/fs-0123456789abcdef1/svm-01234567890123456`
     * @cloudformationAttribute ResourceARN
     */
    public readonly attrResourceArn: string;

    /**
     * Returns the storgage virtual machine's system generated ID.
     *
     * Example: `svm-0123456789abcedf1`
     * @cloudformationAttribute StorageVirtualMachineId
     */
    public readonly attrStorageVirtualMachineId: string;

    /**
     * Returns the storage virtual machine's system generated unique identifier (UUID).
     *
     * Example: `abcd0123-cd45-ef67-11aa-1111aaaa23bc`
     * @cloudformationAttribute UUID
     */
    public readonly attrUuid: string;

    /**
     * Specifies the FSx for ONTAP file system on which to create the SVM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-filesystemid
     */
    public fileSystemId: string;

    /**
     * The name of the SVM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-name
     */
    public name: string;

    /**
     * Describes the Microsoft Active Directory configuration to which the SVM is joined, if applicable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration
     */
    public activeDirectoryConfiguration: CfnStorageVirtualMachine.ActiveDirectoryConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The security style of the root volume of the SVM. Specify one of the following values:
     *
     * - `UNIX` if the file system is managed by a UNIX administrator, the majority of users are NFS clients, and an application accessing the data uses a UNIX user as the service account.
     * - `NTFS` if the file system is managed by a Windows administrator, the majority of users are SMB clients, and an application accessing the data uses a Windows user as the service account.
     * - `MIXED` if the file system is managed by both UNIX and Windows administrators and users consist of both NFS and SMB clients.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-rootvolumesecuritystyle
     */
    public rootVolumeSecurityStyle: string | undefined;

    /**
     * Specifies the password to use when logging on to the SVM using a secure shell (SSH) connection to the SVM's management endpoint. Doing so enables you to manage the SVM using the NetApp ONTAP CLI or REST API. If you do not specify a password, you can still use the file system's `fsxadmin` user to manage the SVM. For more information, see [Managing SVMs using the NetApp ONTAP CLI](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-resources-ontap-apps.html#vsadmin-ontap-cli) in the *FSx for ONTAP User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-svmadminpassword
     */
    public svmAdminPassword: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html#cfn-fsx-storagevirtualmachine-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::FSx::StorageVirtualMachine`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStorageVirtualMachineProps) {
        super(scope, id, { type: CfnStorageVirtualMachine.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'fileSystemId', this);
        cdk.requireProperty(props, 'name', this);
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceARN', cdk.ResolutionTypeHint.STRING));
        this.attrStorageVirtualMachineId = cdk.Token.asString(this.getAtt('StorageVirtualMachineId', cdk.ResolutionTypeHint.STRING));
        this.attrUuid = cdk.Token.asString(this.getAtt('UUID', cdk.ResolutionTypeHint.STRING));

        this.fileSystemId = props.fileSystemId;
        this.name = props.name;
        this.activeDirectoryConfiguration = props.activeDirectoryConfiguration;
        this.rootVolumeSecurityStyle = props.rootVolumeSecurityStyle;
        this.svmAdminPassword = props.svmAdminPassword;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FSx::StorageVirtualMachine", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStorageVirtualMachine.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            fileSystemId: this.fileSystemId,
            name: this.name,
            activeDirectoryConfiguration: this.activeDirectoryConfiguration,
            rootVolumeSecurityStyle: this.rootVolumeSecurityStyle,
            svmAdminPassword: this.svmAdminPassword,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStorageVirtualMachinePropsToCloudFormation(props);
    }
}

export namespace CfnStorageVirtualMachine {
    /**
     * Describes the self-managed Microsoft Active Directory to which you want to join the SVM. Joining an Active Directory provides user authentication and access control for SMB clients, including Microsoft Windows and macOS client accessing the file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration.html
     */
    export interface ActiveDirectoryConfigurationProperty {
        /**
         * The NetBIOS name of the Active Directory computer object that will be created for your SVM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-netbiosname
         */
        readonly netBiosName?: string;
        /**
         * The configuration that Amazon FSx uses to join the ONTAP storage virtual machine (SVM) to your self-managed (including on-premises) Microsoft Active Directory (AD) directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration
         */
        readonly selfManagedActiveDirectoryConfiguration?: CfnStorageVirtualMachine.SelfManagedActiveDirectoryConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActiveDirectoryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageVirtualMachine_ActiveDirectoryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('netBiosName', cdk.validateString)(properties.netBiosName));
    errors.collect(cdk.propertyValidator('selfManagedActiveDirectoryConfiguration', CfnStorageVirtualMachine_SelfManagedActiveDirectoryConfigurationPropertyValidator)(properties.selfManagedActiveDirectoryConfiguration));
    return errors.wrap('supplied properties not correct for "ActiveDirectoryConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::StorageVirtualMachine.ActiveDirectoryConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::StorageVirtualMachine.ActiveDirectoryConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStorageVirtualMachineActiveDirectoryConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageVirtualMachine_ActiveDirectoryConfigurationPropertyValidator(properties).assertSuccess();
    return {
        NetBiosName: cdk.stringToCloudFormation(properties.netBiosName),
        SelfManagedActiveDirectoryConfiguration: cfnStorageVirtualMachineSelfManagedActiveDirectoryConfigurationPropertyToCloudFormation(properties.selfManagedActiveDirectoryConfiguration),
    };
}

// @ts-ignore TS6133
function CfnStorageVirtualMachineActiveDirectoryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageVirtualMachine.ActiveDirectoryConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageVirtualMachine.ActiveDirectoryConfigurationProperty>();
    ret.addPropertyResult('netBiosName', 'NetBiosName', properties.NetBiosName != null ? cfn_parse.FromCloudFormation.getString(properties.NetBiosName) : undefined);
    ret.addPropertyResult('selfManagedActiveDirectoryConfiguration', 'SelfManagedActiveDirectoryConfiguration', properties.SelfManagedActiveDirectoryConfiguration != null ? CfnStorageVirtualMachineSelfManagedActiveDirectoryConfigurationPropertyFromCloudFormation(properties.SelfManagedActiveDirectoryConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStorageVirtualMachine {
    /**
     * The configuration that Amazon FSx uses to join a FSx for Windows File Server file system or an ONTAP storage virtual machine (SVM) to a self-managed (including on-premises) Microsoft Active Directory (AD) directory. For more information, see [Using Amazon FSx with your self-managed Microsoft Active Directory](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/self-managed-AD.html) or [Managing SVMs](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-svms.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration.html
     */
    export interface SelfManagedActiveDirectoryConfigurationProperty {
        /**
         * A list of up to three IP addresses of DNS servers or domain controllers in the self-managed AD directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration-dnsips
         */
        readonly dnsIps?: string[];
        /**
         * The fully qualified domain name of the self-managed AD directory, such as `corp.example.com` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration-domainname
         */
        readonly domainName?: string;
        /**
         * (Optional) The name of the domain group whose members are granted administrative privileges for the file system. Administrative privileges include taking ownership of files and folders, setting audit controls (audit ACLs) on files and folders, and administering the file system remotely by using the FSx Remote PowerShell. The group that you specify must already exist in your domain. If you don't provide one, your AD domain's Domain Admins group is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration-filesystemadministratorsgroup
         */
        readonly fileSystemAdministratorsGroup?: string;
        /**
         * (Optional) The fully qualified distinguished name of the organizational unit within your self-managed AD directory. Amazon FSx only accepts OU as the direct parent of the file system. An example is `OU=FSx,DC=yourdomain,DC=corp,DC=com` . To learn more, see [RFC 2253](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc2253) . If none is provided, the FSx file system is created in the default location of your self-managed AD directory.
         *
         * > Only Organizational Unit (OU) objects can be the direct parent of the file system that you're creating.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration-organizationalunitdistinguishedname
         */
        readonly organizationalUnitDistinguishedName?: string;
        /**
         * The password for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration-password
         */
        readonly password?: string;
        /**
         * The user name for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain. This account must have the permission to join computers to the domain in the organizational unit provided in `OrganizationalUnitDistinguishedName` , or in the default location of your AD domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration.html#cfn-fsx-storagevirtualmachine-activedirectoryconfiguration-selfmanagedactivedirectoryconfiguration-username
         */
        readonly userName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SelfManagedActiveDirectoryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedActiveDirectoryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStorageVirtualMachine_SelfManagedActiveDirectoryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dnsIps', cdk.listValidator(cdk.validateString))(properties.dnsIps));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('fileSystemAdministratorsGroup', cdk.validateString)(properties.fileSystemAdministratorsGroup));
    errors.collect(cdk.propertyValidator('organizationalUnitDistinguishedName', cdk.validateString)(properties.organizationalUnitDistinguishedName));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('userName', cdk.validateString)(properties.userName));
    return errors.wrap('supplied properties not correct for "SelfManagedActiveDirectoryConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::StorageVirtualMachine.SelfManagedActiveDirectoryConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SelfManagedActiveDirectoryConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::StorageVirtualMachine.SelfManagedActiveDirectoryConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStorageVirtualMachineSelfManagedActiveDirectoryConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStorageVirtualMachine_SelfManagedActiveDirectoryConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DnsIps: cdk.listMapper(cdk.stringToCloudFormation)(properties.dnsIps),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        FileSystemAdministratorsGroup: cdk.stringToCloudFormation(properties.fileSystemAdministratorsGroup),
        OrganizationalUnitDistinguishedName: cdk.stringToCloudFormation(properties.organizationalUnitDistinguishedName),
        Password: cdk.stringToCloudFormation(properties.password),
        UserName: cdk.stringToCloudFormation(properties.userName),
    };
}

// @ts-ignore TS6133
function CfnStorageVirtualMachineSelfManagedActiveDirectoryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageVirtualMachine.SelfManagedActiveDirectoryConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageVirtualMachine.SelfManagedActiveDirectoryConfigurationProperty>();
    ret.addPropertyResult('dnsIps', 'DnsIps', properties.DnsIps != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DnsIps) : undefined);
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('fileSystemAdministratorsGroup', 'FileSystemAdministratorsGroup', properties.FileSystemAdministratorsGroup != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemAdministratorsGroup) : undefined);
    ret.addPropertyResult('organizationalUnitDistinguishedName', 'OrganizationalUnitDistinguishedName', properties.OrganizationalUnitDistinguishedName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnitDistinguishedName) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('userName', 'UserName', properties.UserName != null ? cfn_parse.FromCloudFormation.getString(properties.UserName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnVolume`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html
 */
export interface CfnVolumeProps {

    /**
     * The name of the volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-name
     */
    readonly name: string;

    /**
     * Specifies the ID of the volume backup to use to create a new volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-backupid
     */
    readonly backupId?: string;

    /**
     * The configuration of an Amazon FSx for NetApp ONTAP volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-ontapconfiguration
     */
    readonly ontapConfiguration?: CfnVolume.OntapConfigurationProperty | cdk.IResolvable;

    /**
     * The configuration of an Amazon FSx for OpenZFS volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-openzfsconfiguration
     */
    readonly openZfsConfiguration?: CfnVolume.OpenZFSConfigurationProperty | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The type of the volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-volumetype
     */
    readonly volumeType?: string;
}

/**
 * Determine whether the given properties match those of a `CfnVolumeProps`
 *
 * @param properties - the TypeScript properties of a `CfnVolumeProps`
 *
 * @returns the result of the validation.
 */
function CfnVolumePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backupId', cdk.validateString)(properties.backupId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('ontapConfiguration', CfnVolume_OntapConfigurationPropertyValidator)(properties.ontapConfiguration));
    errors.collect(cdk.propertyValidator('openZfsConfiguration', CfnVolume_OpenZFSConfigurationPropertyValidator)(properties.openZfsConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('volumeType', cdk.validateString)(properties.volumeType));
    return errors.wrap('supplied properties not correct for "CfnVolumeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume` resource
 *
 * @param properties - the TypeScript properties of a `CfnVolumeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume` resource.
 */
// @ts-ignore TS6133
function cfnVolumePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolumePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        BackupId: cdk.stringToCloudFormation(properties.backupId),
        OntapConfiguration: cfnVolumeOntapConfigurationPropertyToCloudFormation(properties.ontapConfiguration),
        OpenZFSConfiguration: cfnVolumeOpenZFSConfigurationPropertyToCloudFormation(properties.openZfsConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VolumeType: cdk.stringToCloudFormation(properties.volumeType),
    };
}

// @ts-ignore TS6133
function CfnVolumePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolumeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolumeProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('backupId', 'BackupId', properties.BackupId != null ? cfn_parse.FromCloudFormation.getString(properties.BackupId) : undefined);
    ret.addPropertyResult('ontapConfiguration', 'OntapConfiguration', properties.OntapConfiguration != null ? CfnVolumeOntapConfigurationPropertyFromCloudFormation(properties.OntapConfiguration) : undefined);
    ret.addPropertyResult('openZfsConfiguration', 'OpenZFSConfiguration', properties.OpenZFSConfiguration != null ? CfnVolumeOpenZFSConfigurationPropertyFromCloudFormation(properties.OpenZFSConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('volumeType', 'VolumeType', properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FSx::Volume`
 *
 * Creates an FSx for ONTAP or Amazon FSx for OpenZFS storage volume.
 *
 * @cloudformationResource AWS::FSx::Volume
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html
 */
export class CfnVolume extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FSx::Volume";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVolume {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVolumePropsFromCloudFormation(resourceProperties);
        const ret = new CfnVolume(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the volume's Amazon Resource Name (ARN).
     *
     * Example: `arn:aws:fsx:us-east-2:111122223333:volume/fs-0123456789abcdef9/fsvol-01234567891112223`
     * @cloudformationAttribute ResourceARN
     */
    public readonly attrResourceArn: string;

    /**
     * Returns the volume's universally unique identifier (UUID).
     *
     * Example: `abcd0123-cd45-ef67-11aa-1111aaaa23bc`
     * @cloudformationAttribute UUID
     */
    public readonly attrUuid: string;

    /**
     * Returns the volume's ID.
     *
     * Example: `fsvol-0123456789abcdefa`
     * @cloudformationAttribute VolumeId
     */
    public readonly attrVolumeId: string;

    /**
     * The name of the volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-name
     */
    public name: string;

    /**
     * Specifies the ID of the volume backup to use to create a new volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-backupid
     */
    public backupId: string | undefined;

    /**
     * The configuration of an Amazon FSx for NetApp ONTAP volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-ontapconfiguration
     */
    public ontapConfiguration: CfnVolume.OntapConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The configuration of an Amazon FSx for OpenZFS volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-openzfsconfiguration
     */
    public openZfsConfiguration: CfnVolume.OpenZFSConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The type of the volume.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html#cfn-fsx-volume-volumetype
     */
    public volumeType: string | undefined;

    /**
     * Create a new `AWS::FSx::Volume`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVolumeProps) {
        super(scope, id, { type: CfnVolume.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceARN', cdk.ResolutionTypeHint.STRING));
        this.attrUuid = cdk.Token.asString(this.getAtt('UUID', cdk.ResolutionTypeHint.STRING));
        this.attrVolumeId = cdk.Token.asString(this.getAtt('VolumeId', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.backupId = props.backupId;
        this.ontapConfiguration = props.ontapConfiguration;
        this.openZfsConfiguration = props.openZfsConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::FSx::Volume", props.tags, { tagPropertyName: 'tags' });
        this.volumeType = props.volumeType;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVolume.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            backupId: this.backupId,
            ontapConfiguration: this.ontapConfiguration,
            openZfsConfiguration: this.openZfsConfiguration,
            tags: this.tags.renderTags(),
            volumeType: this.volumeType,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVolumePropsToCloudFormation(props);
    }
}

export namespace CfnVolume {
    /**
     * Specifies who can mount an OpenZFS file system and the options available while mounting the file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-nfsexports-clientconfigurations.html
     */
    export interface ClientConfigurationsProperty {
        /**
         * A value that specifies who can mount the file system. You can provide a wildcard character ( `*` ), an IP address ( `0.0.0.0` ), or a CIDR address ( `192.0.2.0/24` ). By default, Amazon FSx uses the wildcard character when specifying the client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-nfsexports-clientconfigurations.html#cfn-fsx-volume-openzfsconfiguration-nfsexports-clientconfigurations-clients
         */
        readonly clients: string;
        /**
         * The options to use when mounting the file system. For a list of options that you can use with Network File System (NFS), see the [exports(5) - Linux man page](https://docs.aws.amazon.com/https://linux.die.net/man/5/exports) . When choosing your options, consider the following:
         *
         * - `crossmnt` is used by default. If you don't specify `crossmnt` when changing the client configuration, you won't be able to see or access snapshots in your file system's snapshot directory.
         * - `sync` is used by default. If you instead specify `async` , the system acknowledges writes before writing to disk. If the system crashes before the writes are finished, you lose the unwritten data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-nfsexports-clientconfigurations.html#cfn-fsx-volume-openzfsconfiguration-nfsexports-clientconfigurations-options
         */
        readonly options: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ClientConfigurationsProperty`
 *
 * @param properties - the TypeScript properties of a `ClientConfigurationsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVolume_ClientConfigurationsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clients', cdk.requiredValidator)(properties.clients));
    errors.collect(cdk.propertyValidator('clients', cdk.validateString)(properties.clients));
    errors.collect(cdk.propertyValidator('options', cdk.requiredValidator)(properties.options));
    errors.collect(cdk.propertyValidator('options', cdk.listValidator(cdk.validateString))(properties.options));
    return errors.wrap('supplied properties not correct for "ClientConfigurationsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume.ClientConfigurations` resource
 *
 * @param properties - the TypeScript properties of a `ClientConfigurationsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume.ClientConfigurations` resource.
 */
// @ts-ignore TS6133
function cfnVolumeClientConfigurationsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolume_ClientConfigurationsPropertyValidator(properties).assertSuccess();
    return {
        Clients: cdk.stringToCloudFormation(properties.clients),
        Options: cdk.listMapper(cdk.stringToCloudFormation)(properties.options),
    };
}

// @ts-ignore TS6133
function CfnVolumeClientConfigurationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolume.ClientConfigurationsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolume.ClientConfigurationsProperty>();
    ret.addPropertyResult('clients', 'Clients', cfn_parse.FromCloudFormation.getString(properties.Clients));
    ret.addPropertyResult('options', 'Options', cfn_parse.FromCloudFormation.getStringArray(properties.Options));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVolume {
    /**
     * The configuration object for mounting a Network File System (NFS) file system.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-nfsexports.html
     */
    export interface NfsExportsProperty {
        /**
         * A list of configuration objects that contain the client and options for mounting the OpenZFS file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-nfsexports.html#cfn-fsx-volume-openzfsconfiguration-nfsexports-clientconfigurations
         */
        readonly clientConfigurations: Array<CfnVolume.ClientConfigurationsProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NfsExportsProperty`
 *
 * @param properties - the TypeScript properties of a `NfsExportsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVolume_NfsExportsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientConfigurations', cdk.requiredValidator)(properties.clientConfigurations));
    errors.collect(cdk.propertyValidator('clientConfigurations', cdk.listValidator(CfnVolume_ClientConfigurationsPropertyValidator))(properties.clientConfigurations));
    return errors.wrap('supplied properties not correct for "NfsExportsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume.NfsExports` resource
 *
 * @param properties - the TypeScript properties of a `NfsExportsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume.NfsExports` resource.
 */
// @ts-ignore TS6133
function cfnVolumeNfsExportsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolume_NfsExportsPropertyValidator(properties).assertSuccess();
    return {
        ClientConfigurations: cdk.listMapper(cfnVolumeClientConfigurationsPropertyToCloudFormation)(properties.clientConfigurations),
    };
}

// @ts-ignore TS6133
function CfnVolumeNfsExportsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolume.NfsExportsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolume.NfsExportsProperty>();
    ret.addPropertyResult('clientConfigurations', 'ClientConfigurations', cfn_parse.FromCloudFormation.getArray(CfnVolumeClientConfigurationsPropertyFromCloudFormation)(properties.ClientConfigurations));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVolume {
    /**
     * Specifies the configuration of the ONTAP volume that you are creating.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html
     */
    export interface OntapConfigurationProperty {
        /**
         * A boolean flag indicating whether tags for the volume should be copied to backups. This value defaults to false. If it's set to true, all tags for the volume are copied to all automatic and user-initiated backups where the user doesn't specify tags. If this value is true, and you specify one or more tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the volume, regardless of this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-copytagstobackups
         */
        readonly copyTagsToBackups?: string;
        /**
         * Specifies the location in the SVM's namespace where the volume is mounted. The `JunctionPath` must have a leading forward slash, such as `/vol3` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-junctionpath
         */
        readonly junctionPath?: string;
        /**
         * Specifies the type of volume you are creating. Valid values are the following:
         *
         * - `RW` specifies a read/write volume. `RW` is the default.
         * - `DP` specifies a data-protection volume. A `DP` volume is read-only and can be used as the destination of a NetApp SnapMirror relationship.
         *
         * For more information, see [Volume types](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/volume-types) in the *Amazon FSx for NetApp ONTAP User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-ontapvolumetype
         */
        readonly ontapVolumeType?: string;
        /**
         * Specifies the security style for the volume. If a volume's security style is not specified, it is automatically set to the root volume's security style. The security style determines the type of permissions that FSx for ONTAP uses to control data access. For more information, see [Volume security style](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-volumes.html#volume-security-style) in the *Amazon FSx for NetApp ONTAP User Guide* . Specify one of the following values:
         *
         * - `UNIX` if the file system is managed by a UNIX administrator, the majority of users are NFS clients, and an application accessing the data uses a UNIX user as the service account.
         * - `NTFS` if the file system is managed by a Windows administrator, the majority of users are SMB clients, and an application accessing the data uses a Windows user as the service account.
         * - `MIXED` if the file system is managed by both UNIX and Windows administrators and users consist of both NFS and SMB clients.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-securitystyle
         */
        readonly securityStyle?: string;
        /**
         * Specifies the size of the volume, in megabytes (MB), that you are creating.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-sizeinmegabytes
         */
        readonly sizeInMegabytes: string;
        /**
         * Specifies the snapshot policy for the volume. There are three built-in snapshot policies:
         *
         * - `default` : This is the default policy. A maximum of six hourly snapshots taken five minutes past the hour. A maximum of two daily snapshots taken Monday through Saturday at 10 minutes after midnight. A maximum of two weekly snapshots taken every Sunday at 15 minutes after midnight.
         * - `default-1weekly` : This policy is the same as the `default` policy except that it only retains one snapshot from the weekly schedule.
         * - `none` : This policy does not take any snapshots. This policy can be assigned to volumes to prevent automatic snapshots from being taken.
         *
         * You can also provide the name of a custom policy that you created with the ONTAP CLI or REST API.
         *
         * For more information, see [Snapshot policies](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/snapshots-ontap.html#snapshot-policies) in the *Amazon FSx for NetApp ONTAP User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-snapshotpolicy
         */
        readonly snapshotPolicy?: string;
        /**
         * Set to true to enable deduplication, compression, and compaction storage efficiency features on the volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-storageefficiencyenabled
         */
        readonly storageEfficiencyEnabled?: string;
        /**
         * Specifies the ONTAP SVM in which to create the volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-storagevirtualmachineid
         */
        readonly storageVirtualMachineId: string;
        /**
         * Describes the data tiering policy for an ONTAP volume. When enabled, Amazon FSx for ONTAP's intelligent tiering automatically transitions a volume's data between the file system's primary storage and capacity pool storage based on your access patterns.
         *
         * Valid tiering policies are the following:
         *
         * - `SNAPSHOT_ONLY` - (Default value) moves cold snapshots to the capacity pool storage tier.
         *
         * - `AUTO` - moves cold user data and snapshots to the capacity pool storage tier based on your access patterns.
         *
         * - `ALL` - moves all user data blocks in both the active file system and Snapshot copies to the storage pool tier.
         *
         * - `NONE` - keeps a volume's data in the primary storage tier, preventing it from being moved to the capacity pool tier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration.html#cfn-fsx-volume-ontapconfiguration-tieringpolicy
         */
        readonly tieringPolicy?: CfnVolume.TieringPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OntapConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OntapConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnVolume_OntapConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('copyTagsToBackups', cdk.validateString)(properties.copyTagsToBackups));
    errors.collect(cdk.propertyValidator('junctionPath', cdk.validateString)(properties.junctionPath));
    errors.collect(cdk.propertyValidator('ontapVolumeType', cdk.validateString)(properties.ontapVolumeType));
    errors.collect(cdk.propertyValidator('securityStyle', cdk.validateString)(properties.securityStyle));
    errors.collect(cdk.propertyValidator('sizeInMegabytes', cdk.requiredValidator)(properties.sizeInMegabytes));
    errors.collect(cdk.propertyValidator('sizeInMegabytes', cdk.validateString)(properties.sizeInMegabytes));
    errors.collect(cdk.propertyValidator('snapshotPolicy', cdk.validateString)(properties.snapshotPolicy));
    errors.collect(cdk.propertyValidator('storageEfficiencyEnabled', cdk.validateString)(properties.storageEfficiencyEnabled));
    errors.collect(cdk.propertyValidator('storageVirtualMachineId', cdk.requiredValidator)(properties.storageVirtualMachineId));
    errors.collect(cdk.propertyValidator('storageVirtualMachineId', cdk.validateString)(properties.storageVirtualMachineId));
    errors.collect(cdk.propertyValidator('tieringPolicy', CfnVolume_TieringPolicyPropertyValidator)(properties.tieringPolicy));
    return errors.wrap('supplied properties not correct for "OntapConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume.OntapConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `OntapConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume.OntapConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnVolumeOntapConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolume_OntapConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CopyTagsToBackups: cdk.stringToCloudFormation(properties.copyTagsToBackups),
        JunctionPath: cdk.stringToCloudFormation(properties.junctionPath),
        OntapVolumeType: cdk.stringToCloudFormation(properties.ontapVolumeType),
        SecurityStyle: cdk.stringToCloudFormation(properties.securityStyle),
        SizeInMegabytes: cdk.stringToCloudFormation(properties.sizeInMegabytes),
        SnapshotPolicy: cdk.stringToCloudFormation(properties.snapshotPolicy),
        StorageEfficiencyEnabled: cdk.stringToCloudFormation(properties.storageEfficiencyEnabled),
        StorageVirtualMachineId: cdk.stringToCloudFormation(properties.storageVirtualMachineId),
        TieringPolicy: cfnVolumeTieringPolicyPropertyToCloudFormation(properties.tieringPolicy),
    };
}

// @ts-ignore TS6133
function CfnVolumeOntapConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolume.OntapConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolume.OntapConfigurationProperty>();
    ret.addPropertyResult('copyTagsToBackups', 'CopyTagsToBackups', properties.CopyTagsToBackups != null ? cfn_parse.FromCloudFormation.getString(properties.CopyTagsToBackups) : undefined);
    ret.addPropertyResult('junctionPath', 'JunctionPath', properties.JunctionPath != null ? cfn_parse.FromCloudFormation.getString(properties.JunctionPath) : undefined);
    ret.addPropertyResult('ontapVolumeType', 'OntapVolumeType', properties.OntapVolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.OntapVolumeType) : undefined);
    ret.addPropertyResult('securityStyle', 'SecurityStyle', properties.SecurityStyle != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityStyle) : undefined);
    ret.addPropertyResult('sizeInMegabytes', 'SizeInMegabytes', cfn_parse.FromCloudFormation.getString(properties.SizeInMegabytes));
    ret.addPropertyResult('snapshotPolicy', 'SnapshotPolicy', properties.SnapshotPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotPolicy) : undefined);
    ret.addPropertyResult('storageEfficiencyEnabled', 'StorageEfficiencyEnabled', properties.StorageEfficiencyEnabled != null ? cfn_parse.FromCloudFormation.getString(properties.StorageEfficiencyEnabled) : undefined);
    ret.addPropertyResult('storageVirtualMachineId', 'StorageVirtualMachineId', cfn_parse.FromCloudFormation.getString(properties.StorageVirtualMachineId));
    ret.addPropertyResult('tieringPolicy', 'TieringPolicy', properties.TieringPolicy != null ? CfnVolumeTieringPolicyPropertyFromCloudFormation(properties.TieringPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVolume {
    /**
     * Specifies the configuration of the Amazon FSx for OpenZFS volume that you are creating.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html
     */
    export interface OpenZFSConfigurationProperty {
        /**
         * A Boolean value indicating whether tags for the volume should be copied to snapshots. This value defaults to `false` . If it's set to `true` , all tags for the volume are copied to snapshots where the user doesn't specify tags. If this value is `true` , and you specify one or more tags, only the specified tags are copied to snapshots. If you specify one or more tags when creating the snapshot, no tags are copied from the volume, regardless of this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-copytagstosnapshots
         */
        readonly copyTagsToSnapshots?: boolean | cdk.IResolvable;
        /**
         * Specifies the method used to compress the data on the volume. The compression type is `NONE` by default.
         *
         * - `NONE` - Doesn't compress the data on the volume. `NONE` is the default.
         * - `ZSTD` - Compresses the data in the volume using the Zstandard (ZSTD) compression algorithm. Compared to LZ4, Z-Standard provides a better compression ratio to minimize on-disk storage utilization.
         * - `LZ4` - Compresses the data in the volume using the LZ4 compression algorithm. Compared to Z-Standard, LZ4 is less compute-intensive and delivers higher write throughput speeds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-datacompressiontype
         */
        readonly dataCompressionType?: string;
        /**
         * The configuration object for mounting a Network File System (NFS) file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-nfsexports
         */
        readonly nfsExports?: Array<CfnVolume.NfsExportsProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * To delete the volume's child volumes, snapshots, and clones, use the string `DELETE_CHILD_VOLUMES_AND_SNAPSHOTS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-options
         */
        readonly options?: string[];
        /**
         * The configuration object that specifies the snapshot to use as the origin of the data for the volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-originsnapshot
         */
        readonly originSnapshot?: CfnVolume.OriginSnapshotProperty | cdk.IResolvable;
        /**
         * The ID of the volume to use as the parent volume of the volume that you are creating.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-parentvolumeid
         */
        readonly parentVolumeId: string;
        /**
         * A Boolean value indicating whether the volume is read-only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-readonly
         */
        readonly readOnly?: boolean | cdk.IResolvable;
        /**
         * Specifies the suggested block size for a volume in a ZFS dataset, in kibibytes (KiB). Valid values are 4, 8, 16, 32, 64, 128, 256, 512, or 1024 KiB. The default is 128 KiB. We recommend using the default setting for the majority of use cases. Generally, workloads that write in fixed small or large record sizes may benefit from setting a custom record size, like database workloads (small record size) or media streaming workloads (large record size). For additional guidance on when to set a custom record size, see [ZFS Record size](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/performance.html#record-size-performance) in the *Amazon FSx for OpenZFS User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-recordsizekib
         */
        readonly recordSizeKiB?: number;
        /**
         * Sets the maximum storage size in gibibytes (GiB) for the volume. You can specify a quota that is larger than the storage on the parent volume. A volume quota limits the amount of storage that the volume can consume to the configured amount, but does not guarantee the space will be available on the parent volume. To guarantee quota space, you must also set `StorageCapacityReservationGiB` . To *not* specify a storage capacity quota, set this to `-1` .
         *
         * For more information, see [Volume properties](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/managing-volumes.html#volume-properties) in the *Amazon FSx for OpenZFS User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-storagecapacityquotagib
         */
        readonly storageCapacityQuotaGiB?: number;
        /**
         * Specifies the amount of storage in gibibytes (GiB) to reserve from the parent volume. Setting `StorageCapacityReservationGiB` guarantees that the specified amount of storage space on the parent volume will always be available for the volume. You can't reserve more storage than the parent volume has. To *not* specify a storage capacity reservation, set this to `0` or `-1` . For more information, see [Volume properties](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/managing-volumes.html#volume-properties) in the *Amazon FSx for OpenZFS User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-storagecapacityreservationgib
         */
        readonly storageCapacityReservationGiB?: number;
        /**
         * An object specifying how much storage users or groups can use on the volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration.html#cfn-fsx-volume-openzfsconfiguration-userandgroupquotas
         */
        readonly userAndGroupQuotas?: Array<CfnVolume.UserAndGroupQuotasProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OpenZFSConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OpenZFSConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnVolume_OpenZFSConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('copyTagsToSnapshots', cdk.validateBoolean)(properties.copyTagsToSnapshots));
    errors.collect(cdk.propertyValidator('dataCompressionType', cdk.validateString)(properties.dataCompressionType));
    errors.collect(cdk.propertyValidator('nfsExports', cdk.listValidator(CfnVolume_NfsExportsPropertyValidator))(properties.nfsExports));
    errors.collect(cdk.propertyValidator('options', cdk.listValidator(cdk.validateString))(properties.options));
    errors.collect(cdk.propertyValidator('originSnapshot', CfnVolume_OriginSnapshotPropertyValidator)(properties.originSnapshot));
    errors.collect(cdk.propertyValidator('parentVolumeId', cdk.requiredValidator)(properties.parentVolumeId));
    errors.collect(cdk.propertyValidator('parentVolumeId', cdk.validateString)(properties.parentVolumeId));
    errors.collect(cdk.propertyValidator('readOnly', cdk.validateBoolean)(properties.readOnly));
    errors.collect(cdk.propertyValidator('recordSizeKiB', cdk.validateNumber)(properties.recordSizeKiB));
    errors.collect(cdk.propertyValidator('storageCapacityQuotaGiB', cdk.validateNumber)(properties.storageCapacityQuotaGiB));
    errors.collect(cdk.propertyValidator('storageCapacityReservationGiB', cdk.validateNumber)(properties.storageCapacityReservationGiB));
    errors.collect(cdk.propertyValidator('userAndGroupQuotas', cdk.listValidator(CfnVolume_UserAndGroupQuotasPropertyValidator))(properties.userAndGroupQuotas));
    return errors.wrap('supplied properties not correct for "OpenZFSConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume.OpenZFSConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `OpenZFSConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume.OpenZFSConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnVolumeOpenZFSConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolume_OpenZFSConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CopyTagsToSnapshots: cdk.booleanToCloudFormation(properties.copyTagsToSnapshots),
        DataCompressionType: cdk.stringToCloudFormation(properties.dataCompressionType),
        NfsExports: cdk.listMapper(cfnVolumeNfsExportsPropertyToCloudFormation)(properties.nfsExports),
        Options: cdk.listMapper(cdk.stringToCloudFormation)(properties.options),
        OriginSnapshot: cfnVolumeOriginSnapshotPropertyToCloudFormation(properties.originSnapshot),
        ParentVolumeId: cdk.stringToCloudFormation(properties.parentVolumeId),
        ReadOnly: cdk.booleanToCloudFormation(properties.readOnly),
        RecordSizeKiB: cdk.numberToCloudFormation(properties.recordSizeKiB),
        StorageCapacityQuotaGiB: cdk.numberToCloudFormation(properties.storageCapacityQuotaGiB),
        StorageCapacityReservationGiB: cdk.numberToCloudFormation(properties.storageCapacityReservationGiB),
        UserAndGroupQuotas: cdk.listMapper(cfnVolumeUserAndGroupQuotasPropertyToCloudFormation)(properties.userAndGroupQuotas),
    };
}

// @ts-ignore TS6133
function CfnVolumeOpenZFSConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolume.OpenZFSConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolume.OpenZFSConfigurationProperty>();
    ret.addPropertyResult('copyTagsToSnapshots', 'CopyTagsToSnapshots', properties.CopyTagsToSnapshots != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTagsToSnapshots) : undefined);
    ret.addPropertyResult('dataCompressionType', 'DataCompressionType', properties.DataCompressionType != null ? cfn_parse.FromCloudFormation.getString(properties.DataCompressionType) : undefined);
    ret.addPropertyResult('nfsExports', 'NfsExports', properties.NfsExports != null ? cfn_parse.FromCloudFormation.getArray(CfnVolumeNfsExportsPropertyFromCloudFormation)(properties.NfsExports) : undefined);
    ret.addPropertyResult('options', 'Options', properties.Options != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Options) : undefined);
    ret.addPropertyResult('originSnapshot', 'OriginSnapshot', properties.OriginSnapshot != null ? CfnVolumeOriginSnapshotPropertyFromCloudFormation(properties.OriginSnapshot) : undefined);
    ret.addPropertyResult('parentVolumeId', 'ParentVolumeId', cfn_parse.FromCloudFormation.getString(properties.ParentVolumeId));
    ret.addPropertyResult('readOnly', 'ReadOnly', properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined);
    ret.addPropertyResult('recordSizeKiB', 'RecordSizeKiB', properties.RecordSizeKiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.RecordSizeKiB) : undefined);
    ret.addPropertyResult('storageCapacityQuotaGiB', 'StorageCapacityQuotaGiB', properties.StorageCapacityQuotaGiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.StorageCapacityQuotaGiB) : undefined);
    ret.addPropertyResult('storageCapacityReservationGiB', 'StorageCapacityReservationGiB', properties.StorageCapacityReservationGiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.StorageCapacityReservationGiB) : undefined);
    ret.addPropertyResult('userAndGroupQuotas', 'UserAndGroupQuotas', properties.UserAndGroupQuotas != null ? cfn_parse.FromCloudFormation.getArray(CfnVolumeUserAndGroupQuotasPropertyFromCloudFormation)(properties.UserAndGroupQuotas) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVolume {
    /**
     * The configuration object that specifies the snapshot to use as the origin of the data for the volume.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-originsnapshot.html
     */
    export interface OriginSnapshotProperty {
        /**
         * The strategy used when copying data from the snapshot to the new volume.
         *
         * - `CLONE` - The new volume references the data in the origin snapshot. Cloning a snapshot is faster than copying data from the snapshot to a new volume and doesn't consume disk throughput. However, the origin snapshot can't be deleted if there is a volume using its copied data.
         * - `FULL_COPY` - Copies all data from the snapshot to the new volume.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-originsnapshot.html#cfn-fsx-volume-openzfsconfiguration-originsnapshot-copystrategy
         */
        readonly copyStrategy: string;
        /**
         * Specifies the snapshot to use when creating an OpenZFS volume from a snapshot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-originsnapshot.html#cfn-fsx-volume-openzfsconfiguration-originsnapshot-snapshotarn
         */
        readonly snapshotArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `OriginSnapshotProperty`
 *
 * @param properties - the TypeScript properties of a `OriginSnapshotProperty`
 *
 * @returns the result of the validation.
 */
function CfnVolume_OriginSnapshotPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('copyStrategy', cdk.requiredValidator)(properties.copyStrategy));
    errors.collect(cdk.propertyValidator('copyStrategy', cdk.validateString)(properties.copyStrategy));
    errors.collect(cdk.propertyValidator('snapshotArn', cdk.requiredValidator)(properties.snapshotArn));
    errors.collect(cdk.propertyValidator('snapshotArn', cdk.validateString)(properties.snapshotArn));
    return errors.wrap('supplied properties not correct for "OriginSnapshotProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume.OriginSnapshot` resource
 *
 * @param properties - the TypeScript properties of a `OriginSnapshotProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume.OriginSnapshot` resource.
 */
// @ts-ignore TS6133
function cfnVolumeOriginSnapshotPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolume_OriginSnapshotPropertyValidator(properties).assertSuccess();
    return {
        CopyStrategy: cdk.stringToCloudFormation(properties.copyStrategy),
        SnapshotARN: cdk.stringToCloudFormation(properties.snapshotArn),
    };
}

// @ts-ignore TS6133
function CfnVolumeOriginSnapshotPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolume.OriginSnapshotProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolume.OriginSnapshotProperty>();
    ret.addPropertyResult('copyStrategy', 'CopyStrategy', cfn_parse.FromCloudFormation.getString(properties.CopyStrategy));
    ret.addPropertyResult('snapshotArn', 'SnapshotARN', cfn_parse.FromCloudFormation.getString(properties.SnapshotARN));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVolume {
    /**
     * Describes the data tiering policy for an ONTAP volume. When enabled, Amazon FSx for ONTAP's intelligent tiering automatically transitions a volume's data between the file system's primary storage and capacity pool storage based on your access patterns.
     *
     * Valid tiering policies are the following:
     *
     * - `SNAPSHOT_ONLY` - (Default value) moves cold snapshots to the capacity pool storage tier.
     *
     * - `AUTO` - moves cold user data and snapshots to the capacity pool storage tier based on your access patterns.
     *
     * - `ALL` - moves all user data blocks in both the active file system and Snapshot copies to the storage pool tier.
     *
     * - `NONE` - keeps a volume's data in the primary storage tier, preventing it from being moved to the capacity pool tier.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration-tieringpolicy.html
     */
    export interface TieringPolicyProperty {
        /**
         * Specifies the number of days that user data in a volume must remain inactive before it is considered "cold" and moved to the capacity pool. Used with the `AUTO` and `SNAPSHOT_ONLY` tiering policies. Enter a whole number between 2 and 183. Default values are 31 days for `AUTO` and 2 days for `SNAPSHOT_ONLY` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration-tieringpolicy.html#cfn-fsx-volume-ontapconfiguration-tieringpolicy-coolingperiod
         */
        readonly coolingPeriod?: number;
        /**
         * Specifies the tiering policy used to transition data. Default value is `SNAPSHOT_ONLY` .
         *
         * - `SNAPSHOT_ONLY` - moves cold snapshots to the capacity pool storage tier.
         * - `AUTO` - moves cold user data and snapshots to the capacity pool storage tier based on your access patterns.
         * - `ALL` - moves all user data blocks in both the active file system and Snapshot copies to the storage pool tier.
         * - `NONE` - keeps a volume's data in the primary storage tier, preventing it from being moved to the capacity pool tier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-ontapconfiguration-tieringpolicy.html#cfn-fsx-volume-ontapconfiguration-tieringpolicy-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TieringPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `TieringPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnVolume_TieringPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coolingPeriod', cdk.validateNumber)(properties.coolingPeriod));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "TieringPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume.TieringPolicy` resource
 *
 * @param properties - the TypeScript properties of a `TieringPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume.TieringPolicy` resource.
 */
// @ts-ignore TS6133
function cfnVolumeTieringPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolume_TieringPolicyPropertyValidator(properties).assertSuccess();
    return {
        CoolingPeriod: cdk.numberToCloudFormation(properties.coolingPeriod),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnVolumeTieringPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolume.TieringPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolume.TieringPolicyProperty>();
    ret.addPropertyResult('coolingPeriod', 'CoolingPeriod', properties.CoolingPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.CoolingPeriod) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVolume {
    /**
     * An object specifying how much storage users or groups can use on the volume.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-userandgroupquotas.html
     */
    export interface UserAndGroupQuotasProperty {
        /**
         * The ID of the user or group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-userandgroupquotas.html#cfn-fsx-volume-openzfsconfiguration-userandgroupquotas-id
         */
        readonly id: number;
        /**
         * The amount of storage that the user or group can use in gibibytes (GiB).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-userandgroupquotas.html#cfn-fsx-volume-openzfsconfiguration-userandgroupquotas-storagecapacityquotagib
         */
        readonly storageCapacityQuotaGiB: number;
        /**
         * A value that specifies whether the quota applies to a user or group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-openzfsconfiguration-userandgroupquotas.html#cfn-fsx-volume-openzfsconfiguration-userandgroupquotas-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserAndGroupQuotasProperty`
 *
 * @param properties - the TypeScript properties of a `UserAndGroupQuotasProperty`
 *
 * @returns the result of the validation.
 */
function CfnVolume_UserAndGroupQuotasPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateNumber)(properties.id));
    errors.collect(cdk.propertyValidator('storageCapacityQuotaGiB', cdk.requiredValidator)(properties.storageCapacityQuotaGiB));
    errors.collect(cdk.propertyValidator('storageCapacityQuotaGiB', cdk.validateNumber)(properties.storageCapacityQuotaGiB));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "UserAndGroupQuotasProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FSx::Volume.UserAndGroupQuotas` resource
 *
 * @param properties - the TypeScript properties of a `UserAndGroupQuotasProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FSx::Volume.UserAndGroupQuotas` resource.
 */
// @ts-ignore TS6133
function cfnVolumeUserAndGroupQuotasPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVolume_UserAndGroupQuotasPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.numberToCloudFormation(properties.id),
        StorageCapacityQuotaGiB: cdk.numberToCloudFormation(properties.storageCapacityQuotaGiB),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnVolumeUserAndGroupQuotasPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolume.UserAndGroupQuotasProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolume.UserAndGroupQuotasProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getNumber(properties.Id));
    ret.addPropertyResult('storageCapacityQuotaGiB', 'StorageCapacityQuotaGiB', cfn_parse.FromCloudFormation.getNumber(properties.StorageCapacityQuotaGiB));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
