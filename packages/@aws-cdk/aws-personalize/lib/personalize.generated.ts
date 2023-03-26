// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:39.159Z","fingerprint":"JZQ6HfczxA7qOVxuLuDtX2IhVkwQLwo94jz8kbv2wLY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDataset`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html
 */
export interface CfnDatasetProps {

    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetgrouparn
     */
    readonly datasetGroupArn: string;

    /**
     * One of the following values:
     *
     * - Interactions
     * - Items
     * - Users
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasettype
     */
    readonly datasetType: string;

    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-name
     */
    readonly name: string;

    /**
     * The ARN of the associated schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-schemaarn
     */
    readonly schemaArn: string;

    /**
     * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetimportjob
     */
    readonly datasetImportJob?: CfnDataset.DatasetImportJobProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnDatasetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the result of the validation.
 */
function CfnDatasetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datasetGroupArn', cdk.requiredValidator)(properties.datasetGroupArn));
    errors.collect(cdk.propertyValidator('datasetGroupArn', cdk.validateString)(properties.datasetGroupArn));
    errors.collect(cdk.propertyValidator('datasetImportJob', CfnDataset_DatasetImportJobPropertyValidator)(properties.datasetImportJob));
    errors.collect(cdk.propertyValidator('datasetType', cdk.requiredValidator)(properties.datasetType));
    errors.collect(cdk.propertyValidator('datasetType', cdk.validateString)(properties.datasetType));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schemaArn', cdk.requiredValidator)(properties.schemaArn));
    errors.collect(cdk.propertyValidator('schemaArn', cdk.validateString)(properties.schemaArn));
    return errors.wrap('supplied properties not correct for "CfnDatasetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Dataset` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Dataset` resource.
 */
// @ts-ignore TS6133
function cfnDatasetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatasetPropsValidator(properties).assertSuccess();
    return {
        DatasetGroupArn: cdk.stringToCloudFormation(properties.datasetGroupArn),
        DatasetType: cdk.stringToCloudFormation(properties.datasetType),
        Name: cdk.stringToCloudFormation(properties.name),
        SchemaArn: cdk.stringToCloudFormation(properties.schemaArn),
        DatasetImportJob: cfnDatasetDatasetImportJobPropertyToCloudFormation(properties.datasetImportJob),
    };
}

// @ts-ignore TS6133
function CfnDatasetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetProps>();
    ret.addPropertyResult('datasetGroupArn', 'DatasetGroupArn', cfn_parse.FromCloudFormation.getString(properties.DatasetGroupArn));
    ret.addPropertyResult('datasetType', 'DatasetType', cfn_parse.FromCloudFormation.getString(properties.DatasetType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('schemaArn', 'SchemaArn', cfn_parse.FromCloudFormation.getString(properties.SchemaArn));
    ret.addPropertyResult('datasetImportJob', 'DatasetImportJob', properties.DatasetImportJob != null ? CfnDatasetDatasetImportJobPropertyFromCloudFormation(properties.DatasetImportJob) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Personalize::Dataset`
 *
 * Creates an empty dataset and adds it to the specified dataset group. Use [CreateDatasetImportJob](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetImportJob.html) to import your training data to a dataset.
 *
 * There are three types of datasets:
 *
 * - Interactions
 * - Items
 * - Users
 *
 * Each dataset type has an associated schema with required field types. Only the `Interactions` dataset is required in order to train a model (also referred to as creating a solution).
 *
 * A dataset can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * To get the status of the dataset, call [DescribeDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_DescribeDataset.html) .
 *
 * **Related APIs** - [CreateDatasetGroup](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetGroup.html)
 * - [ListDatasets](https://docs.aws.amazon.com/personalize/latest/dg/API_ListDatasets.html)
 * - [DescribeDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_DescribeDataset.html)
 * - [DeleteDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_DeleteDataset.html)
 *
 * @cloudformationResource AWS::Personalize::Dataset
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html
 */
export class CfnDataset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::Dataset";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataset {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatasetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataset(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the dataset.
     * @cloudformationAttribute DatasetArn
     */
    public readonly attrDatasetArn: string;

    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetgrouparn
     */
    public datasetGroupArn: string;

    /**
     * One of the following values:
     *
     * - Interactions
     * - Items
     * - Users
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasettype
     */
    public datasetType: string;

    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-name
     */
    public name: string;

    /**
     * The ARN of the associated schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-schemaarn
     */
    public schemaArn: string;

    /**
     * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-dataset.html#cfn-personalize-dataset-datasetimportjob
     */
    public datasetImportJob: CfnDataset.DatasetImportJobProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Personalize::Dataset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps) {
        super(scope, id, { type: CfnDataset.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'datasetGroupArn', this);
        cdk.requireProperty(props, 'datasetType', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'schemaArn', this);
        this.attrDatasetArn = cdk.Token.asString(this.getAtt('DatasetArn', cdk.ResolutionTypeHint.STRING));

        this.datasetGroupArn = props.datasetGroupArn;
        this.datasetType = props.datasetType;
        this.name = props.name;
        this.schemaArn = props.schemaArn;
        this.datasetImportJob = props.datasetImportJob;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataset.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            datasetGroupArn: this.datasetGroupArn,
            datasetType: this.datasetType,
            name: this.name,
            schemaArn: this.schemaArn,
            datasetImportJob: this.datasetImportJob,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatasetPropsToCloudFormation(props);
    }
}

export namespace CfnDataset {
    /**
     * Describes the data source that contains the data to upload to a dataset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasource.html
     */
    export interface DataSourceProperty {
        /**
         * The path to the Amazon S3 bucket where the data that you want to upload to your dataset is stored. For example:
         *
         * `s3://bucket-name/folder-name/`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasource.html#cfn-personalize-dataset-datasource-datalocation
         */
        readonly dataLocation?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_DataSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataLocation', cdk.validateString)(properties.dataLocation));
    return errors.wrap('supplied properties not correct for "DataSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Dataset.DataSource` resource
 *
 * @param properties - the TypeScript properties of a `DataSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Dataset.DataSource` resource.
 */
// @ts-ignore TS6133
function cfnDatasetDataSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_DataSourcePropertyValidator(properties).assertSuccess();
    return {
        DataLocation: cdk.stringToCloudFormation(properties.dataLocation),
    };
}

// @ts-ignore TS6133
function CfnDatasetDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DataSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DataSourceProperty>();
    ret.addPropertyResult('dataLocation', 'DataLocation', properties.DataLocation != null ? cfn_parse.FromCloudFormation.getString(properties.DataLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Describes a job that imports training data from a data source (Amazon S3 bucket) to an Amazon Personalize dataset. For more information, see [CreateDatasetImportJob](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetImportJob.html) .
     *
     * A dataset import job can be in one of the following states:
     *
     * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html
     */
    export interface DatasetImportJobProperty {
        /**
         * The Amazon S3 bucket that contains the training data to import.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasource
         */
        readonly dataSource?: any | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the dataset that receives the imported data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasetarn
         */
        readonly datasetArn?: string;
        /**
         * The ARN of the dataset import job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-datasetimportjobarn
         */
        readonly datasetImportJobArn?: string;
        /**
         * The name of the import job.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-jobname
         */
        readonly jobName?: string;
        /**
         * The ARN of the IAM role that has permissions to read from the Amazon S3 data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-dataset-datasetimportjob.html#cfn-personalize-dataset-datasetimportjob-rolearn
         */
        readonly roleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatasetImportJobProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetImportJobProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_DatasetImportJobPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSource', cdk.validateObject)(properties.dataSource));
    errors.collect(cdk.propertyValidator('datasetArn', cdk.validateString)(properties.datasetArn));
    errors.collect(cdk.propertyValidator('datasetImportJobArn', cdk.validateString)(properties.datasetImportJobArn));
    errors.collect(cdk.propertyValidator('jobName', cdk.validateString)(properties.jobName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "DatasetImportJobProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Dataset.DatasetImportJob` resource
 *
 * @param properties - the TypeScript properties of a `DatasetImportJobProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Dataset.DatasetImportJob` resource.
 */
// @ts-ignore TS6133
function cfnDatasetDatasetImportJobPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_DatasetImportJobPropertyValidator(properties).assertSuccess();
    return {
        DataSource: cdk.objectToCloudFormation(properties.dataSource),
        DatasetArn: cdk.stringToCloudFormation(properties.datasetArn),
        DatasetImportJobArn: cdk.stringToCloudFormation(properties.datasetImportJobArn),
        JobName: cdk.stringToCloudFormation(properties.jobName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnDatasetDatasetImportJobPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetImportJobProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetImportJobProperty>();
    ret.addPropertyResult('dataSource', 'DataSource', properties.DataSource != null ? cfn_parse.FromCloudFormation.getAny(properties.DataSource) : undefined);
    ret.addPropertyResult('datasetArn', 'DatasetArn', properties.DatasetArn != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetArn) : undefined);
    ret.addPropertyResult('datasetImportJobArn', 'DatasetImportJobArn', properties.DatasetImportJobArn != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetImportJobArn) : undefined);
    ret.addPropertyResult('jobName', 'JobName', properties.JobName != null ? cfn_parse.FromCloudFormation.getString(properties.JobName) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDatasetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html
 */
export interface CfnDatasetGroupProps {

    /**
     * The name of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-name
     */
    readonly name: string;

    /**
     * The domain of a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-domain
     */
    readonly domain?: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key used to encrypt the datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The ARN of the IAM role that has permissions to create the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-rolearn
     */
    readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDatasetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnDatasetGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CfnDatasetGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::DatasetGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatasetGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::DatasetGroup` resource.
 */
// @ts-ignore TS6133
function cfnDatasetGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatasetGroupPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Domain: cdk.stringToCloudFormation(properties.domain),
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnDatasetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetGroupProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined);
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Personalize::DatasetGroup`
 *
 * A dataset group is a collection of related datasets (Interactions, User, and Item). You create a dataset group by calling [CreateDatasetGroup](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDatasetGroup.html) . You then create a dataset and add it to a dataset group by calling [CreateDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDataset.html) . The dataset group is used to create and train a solution by calling [CreateSolution](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateSolution.html) . A dataset group can contain only one of each type of dataset.
 *
 * You can specify an AWS Key Management Service (KMS) key to encrypt the datasets in the group.
 *
 * @cloudformationResource AWS::Personalize::DatasetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html
 */
export class CfnDatasetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::DatasetGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatasetGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatasetGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDatasetGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     * @cloudformationAttribute DatasetGroupArn
     */
    public readonly attrDatasetGroupArn: string;

    /**
     * The name of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-name
     */
    public name: string;

    /**
     * The domain of a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-domain
     */
    public domain: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key used to encrypt the datasets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-kmskeyarn
     */
    public kmsKeyArn: string | undefined;

    /**
     * The ARN of the IAM role that has permissions to create the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-datasetgroup.html#cfn-personalize-datasetgroup-rolearn
     */
    public roleArn: string | undefined;

    /**
     * Create a new `AWS::Personalize::DatasetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetGroupProps) {
        super(scope, id, { type: CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrDatasetGroupArn = cdk.Token.asString(this.getAtt('DatasetGroupArn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.domain = props.domain;
        this.kmsKeyArn = props.kmsKeyArn;
        this.roleArn = props.roleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            domain: this.domain,
            kmsKeyArn: this.kmsKeyArn,
            roleArn: this.roleArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatasetGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSchema`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html
 */
export interface CfnSchemaProps {

    /**
     * The name of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-name
     */
    readonly name: string;

    /**
     * The schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-schema
     */
    readonly schema: string;

    /**
     * The domain of a schema that you created for a dataset in a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-domain
     */
    readonly domain?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSchemaProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaProps`
 *
 * @returns the result of the validation.
 */
function CfnSchemaPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schema', cdk.requiredValidator)(properties.schema));
    errors.collect(cdk.propertyValidator('schema', cdk.validateString)(properties.schema));
    return errors.wrap('supplied properties not correct for "CfnSchemaProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Schema` resource
 *
 * @param properties - the TypeScript properties of a `CfnSchemaProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Schema` resource.
 */
// @ts-ignore TS6133
function cfnSchemaPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchemaPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Schema: cdk.stringToCloudFormation(properties.schema),
        Domain: cdk.stringToCloudFormation(properties.domain),
    };
}

// @ts-ignore TS6133
function CfnSchemaPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('schema', 'Schema', cfn_parse.FromCloudFormation.getString(properties.Schema));
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Personalize::Schema`
 *
 * Creates an Amazon Personalize schema from the specified schema string. The schema you create must be in Avro JSON format.
 *
 * Amazon Personalize recognizes three schema variants. Each schema is associated with a dataset type and has a set of required field and keywords. If you are creating a schema for a dataset in a Domain dataset group, you provide the domain of the Domain dataset group. You specify a schema when you call [CreateDataset](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateDataset.html) .
 *
 * For more information on schemas, see [Datasets and schemas](https://docs.aws.amazon.com/personalize/latest/dg/how-it-works-dataset-schema.html) .
 *
 * **Related APIs** - [ListSchemas](https://docs.aws.amazon.com/personalize/latest/dg/API_ListSchemas.html)
 * - [DescribeSchema](https://docs.aws.amazon.com/personalize/latest/dg/API_DescribeSchema.html)
 * - [DeleteSchema](https://docs.aws.amazon.com/personalize/latest/dg/API_DeleteSchema.html)
 *
 * @cloudformationResource AWS::Personalize::Schema
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html
 */
export class CfnSchema extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::Schema";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchema {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSchemaPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSchema(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the schema.
     * @cloudformationAttribute SchemaArn
     */
    public readonly attrSchemaArn: string;

    /**
     * The name of the schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-name
     */
    public name: string;

    /**
     * The schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-schema
     */
    public schema: string;

    /**
     * The domain of a schema that you created for a dataset in a Domain dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-schema.html#cfn-personalize-schema-domain
     */
    public domain: string | undefined;

    /**
     * Create a new `AWS::Personalize::Schema`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSchemaProps) {
        super(scope, id, { type: CfnSchema.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'schema', this);
        this.attrSchemaArn = cdk.Token.asString(this.getAtt('SchemaArn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.schema = props.schema;
        this.domain = props.domain;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchema.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            schema: this.schema,
            domain: this.domain,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSchemaPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSolution`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html
 */
export interface CfnSolutionProps {

    /**
     * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-datasetgrouparn
     */
    readonly datasetGroupArn: string;

    /**
     * The name of the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-name
     */
    readonly name: string;

    /**
     * The event type (for example, 'click' or 'like') that is used for training the model. If no `eventType` is provided, Amazon Personalize uses all interactions for training with equal weight regardless of type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-eventtype
     */
    readonly eventType?: string;

    /**
     * > We don't recommend enabling automated machine learning. Instead, match your use case to the available Amazon Personalize recipes. For more information, see [Determining your use case.](https://docs.aws.amazon.com/personalize/latest/dg/determining-use-case.html)
     *
     * When true, Amazon Personalize performs a search for the best USER_PERSONALIZATION recipe from the list specified in the solution configuration ( `recipeArn` must not be specified). When false (the default), Amazon Personalize uses `recipeArn` for training.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performautoml
     */
    readonly performAutoMl?: boolean | cdk.IResolvable;

    /**
     * Whether to perform hyperparameter optimization (HPO) on the chosen recipe. The default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performhpo
     */
    readonly performHpo?: boolean | cdk.IResolvable;

    /**
     * The ARN of the recipe used to create the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-recipearn
     */
    readonly recipeArn?: string;

    /**
     * Describes the configuration properties for the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-solutionconfig
     */
    readonly solutionConfig?: CfnSolution.SolutionConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnSolutionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSolutionProps`
 *
 * @returns the result of the validation.
 */
function CfnSolutionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datasetGroupArn', cdk.requiredValidator)(properties.datasetGroupArn));
    errors.collect(cdk.propertyValidator('datasetGroupArn', cdk.validateString)(properties.datasetGroupArn));
    errors.collect(cdk.propertyValidator('eventType', cdk.validateString)(properties.eventType));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('performAutoMl', cdk.validateBoolean)(properties.performAutoMl));
    errors.collect(cdk.propertyValidator('performHpo', cdk.validateBoolean)(properties.performHpo));
    errors.collect(cdk.propertyValidator('recipeArn', cdk.validateString)(properties.recipeArn));
    errors.collect(cdk.propertyValidator('solutionConfig', CfnSolution_SolutionConfigPropertyValidator)(properties.solutionConfig));
    return errors.wrap('supplied properties not correct for "CfnSolutionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution` resource
 *
 * @param properties - the TypeScript properties of a `CfnSolutionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution` resource.
 */
// @ts-ignore TS6133
function cfnSolutionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolutionPropsValidator(properties).assertSuccess();
    return {
        DatasetGroupArn: cdk.stringToCloudFormation(properties.datasetGroupArn),
        Name: cdk.stringToCloudFormation(properties.name),
        EventType: cdk.stringToCloudFormation(properties.eventType),
        PerformAutoML: cdk.booleanToCloudFormation(properties.performAutoMl),
        PerformHPO: cdk.booleanToCloudFormation(properties.performHpo),
        RecipeArn: cdk.stringToCloudFormation(properties.recipeArn),
        SolutionConfig: cfnSolutionSolutionConfigPropertyToCloudFormation(properties.solutionConfig),
    };
}

// @ts-ignore TS6133
function CfnSolutionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolutionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolutionProps>();
    ret.addPropertyResult('datasetGroupArn', 'DatasetGroupArn', cfn_parse.FromCloudFormation.getString(properties.DatasetGroupArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('eventType', 'EventType', properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined);
    ret.addPropertyResult('performAutoMl', 'PerformAutoML', properties.PerformAutoML != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PerformAutoML) : undefined);
    ret.addPropertyResult('performHpo', 'PerformHPO', properties.PerformHPO != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PerformHPO) : undefined);
    ret.addPropertyResult('recipeArn', 'RecipeArn', properties.RecipeArn != null ? cfn_parse.FromCloudFormation.getString(properties.RecipeArn) : undefined);
    ret.addPropertyResult('solutionConfig', 'SolutionConfig', properties.SolutionConfig != null ? CfnSolutionSolutionConfigPropertyFromCloudFormation(properties.SolutionConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Personalize::Solution`
 *
 * An object that provides information about a solution. A solution is a trained model that can be deployed as a campaign.
 *
 * @cloudformationResource AWS::Personalize::Solution
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html
 */
export class CfnSolution extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Personalize::Solution";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSolution {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSolutionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSolution(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the solution.
     * @cloudformationAttribute SolutionArn
     */
    public readonly attrSolutionArn: string;

    /**
     * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-datasetgrouparn
     */
    public datasetGroupArn: string;

    /**
     * The name of the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-name
     */
    public name: string;

    /**
     * The event type (for example, 'click' or 'like') that is used for training the model. If no `eventType` is provided, Amazon Personalize uses all interactions for training with equal weight regardless of type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-eventtype
     */
    public eventType: string | undefined;

    /**
     * > We don't recommend enabling automated machine learning. Instead, match your use case to the available Amazon Personalize recipes. For more information, see [Determining your use case.](https://docs.aws.amazon.com/personalize/latest/dg/determining-use-case.html)
     *
     * When true, Amazon Personalize performs a search for the best USER_PERSONALIZATION recipe from the list specified in the solution configuration ( `recipeArn` must not be specified). When false (the default), Amazon Personalize uses `recipeArn` for training.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performautoml
     */
    public performAutoMl: boolean | cdk.IResolvable | undefined;

    /**
     * Whether to perform hyperparameter optimization (HPO) on the chosen recipe. The default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-performhpo
     */
    public performHpo: boolean | cdk.IResolvable | undefined;

    /**
     * The ARN of the recipe used to create the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-recipearn
     */
    public recipeArn: string | undefined;

    /**
     * Describes the configuration properties for the solution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-personalize-solution.html#cfn-personalize-solution-solutionconfig
     */
    public solutionConfig: CfnSolution.SolutionConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Personalize::Solution`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSolutionProps) {
        super(scope, id, { type: CfnSolution.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'datasetGroupArn', this);
        cdk.requireProperty(props, 'name', this);
        this.attrSolutionArn = cdk.Token.asString(this.getAtt('SolutionArn', cdk.ResolutionTypeHint.STRING));

        this.datasetGroupArn = props.datasetGroupArn;
        this.name = props.name;
        this.eventType = props.eventType;
        this.performAutoMl = props.performAutoMl;
        this.performHpo = props.performHpo;
        this.recipeArn = props.recipeArn;
        this.solutionConfig = props.solutionConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSolution.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            datasetGroupArn: this.datasetGroupArn,
            name: this.name,
            eventType: this.eventType,
            performAutoMl: this.performAutoMl,
            performHpo: this.performHpo,
            recipeArn: this.recipeArn,
            solutionConfig: this.solutionConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSolutionPropsToCloudFormation(props);
    }
}

export namespace CfnSolution {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html
     */
    export interface AlgorithmHyperParameterRangesProperty {
        /**
         * `CfnSolution.AlgorithmHyperParameterRangesProperty.CategoricalHyperParameterRanges`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-categoricalhyperparameterranges
         */
        readonly categoricalHyperParameterRanges?: Array<CfnSolution.CategoricalHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnSolution.AlgorithmHyperParameterRangesProperty.ContinuousHyperParameterRanges`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-continuoushyperparameterranges
         */
        readonly continuousHyperParameterRanges?: Array<CfnSolution.ContinuousHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnSolution.AlgorithmHyperParameterRangesProperty.IntegerHyperParameterRanges`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-algorithmhyperparameterranges.html#cfn-personalize-solution-algorithmhyperparameterranges-integerhyperparameterranges
         */
        readonly integerHyperParameterRanges?: Array<CfnSolution.IntegerHyperParameterRangeProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AlgorithmHyperParameterRangesProperty`
 *
 * @param properties - the TypeScript properties of a `AlgorithmHyperParameterRangesProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_AlgorithmHyperParameterRangesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('categoricalHyperParameterRanges', cdk.listValidator(CfnSolution_CategoricalHyperParameterRangePropertyValidator))(properties.categoricalHyperParameterRanges));
    errors.collect(cdk.propertyValidator('continuousHyperParameterRanges', cdk.listValidator(CfnSolution_ContinuousHyperParameterRangePropertyValidator))(properties.continuousHyperParameterRanges));
    errors.collect(cdk.propertyValidator('integerHyperParameterRanges', cdk.listValidator(CfnSolution_IntegerHyperParameterRangePropertyValidator))(properties.integerHyperParameterRanges));
    return errors.wrap('supplied properties not correct for "AlgorithmHyperParameterRangesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.AlgorithmHyperParameterRanges` resource
 *
 * @param properties - the TypeScript properties of a `AlgorithmHyperParameterRangesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.AlgorithmHyperParameterRanges` resource.
 */
// @ts-ignore TS6133
function cfnSolutionAlgorithmHyperParameterRangesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_AlgorithmHyperParameterRangesPropertyValidator(properties).assertSuccess();
    return {
        CategoricalHyperParameterRanges: cdk.listMapper(cfnSolutionCategoricalHyperParameterRangePropertyToCloudFormation)(properties.categoricalHyperParameterRanges),
        ContinuousHyperParameterRanges: cdk.listMapper(cfnSolutionContinuousHyperParameterRangePropertyToCloudFormation)(properties.continuousHyperParameterRanges),
        IntegerHyperParameterRanges: cdk.listMapper(cfnSolutionIntegerHyperParameterRangePropertyToCloudFormation)(properties.integerHyperParameterRanges),
    };
}

// @ts-ignore TS6133
function CfnSolutionAlgorithmHyperParameterRangesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.AlgorithmHyperParameterRangesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.AlgorithmHyperParameterRangesProperty>();
    ret.addPropertyResult('categoricalHyperParameterRanges', 'CategoricalHyperParameterRanges', properties.CategoricalHyperParameterRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnSolutionCategoricalHyperParameterRangePropertyFromCloudFormation)(properties.CategoricalHyperParameterRanges) : undefined);
    ret.addPropertyResult('continuousHyperParameterRanges', 'ContinuousHyperParameterRanges', properties.ContinuousHyperParameterRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnSolutionContinuousHyperParameterRangePropertyFromCloudFormation)(properties.ContinuousHyperParameterRanges) : undefined);
    ret.addPropertyResult('integerHyperParameterRanges', 'IntegerHyperParameterRanges', properties.IntegerHyperParameterRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnSolutionIntegerHyperParameterRangePropertyFromCloudFormation)(properties.IntegerHyperParameterRanges) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * When the solution performs AutoML ( `performAutoML` is true in [CreateSolution](https://docs.aws.amazon.com/personalize/latest/dg/API_CreateSolution.html) ), Amazon Personalize determines which recipe, from the specified list, optimizes the given metric. Amazon Personalize then uses that recipe for the solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html
     */
    export interface AutoMLConfigProperty {
        /**
         * The metric to optimize.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html#cfn-personalize-solution-automlconfig-metricname
         */
        readonly metricName?: string;
        /**
         * The list of candidate recipes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-automlconfig.html#cfn-personalize-solution-automlconfig-recipelist
         */
        readonly recipeList?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AutoMLConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AutoMLConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_AutoMLConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('recipeList', cdk.listValidator(cdk.validateString))(properties.recipeList));
    return errors.wrap('supplied properties not correct for "AutoMLConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.AutoMLConfig` resource
 *
 * @param properties - the TypeScript properties of a `AutoMLConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.AutoMLConfig` resource.
 */
// @ts-ignore TS6133
function cfnSolutionAutoMLConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_AutoMLConfigPropertyValidator(properties).assertSuccess();
    return {
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        RecipeList: cdk.listMapper(cdk.stringToCloudFormation)(properties.recipeList),
    };
}

// @ts-ignore TS6133
function CfnSolutionAutoMLConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.AutoMLConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.AutoMLConfigProperty>();
    ret.addPropertyResult('metricName', 'MetricName', properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined);
    ret.addPropertyResult('recipeList', 'RecipeList', properties.RecipeList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.RecipeList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * Provides the name and range of a categorical hyperparameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html
     */
    export interface CategoricalHyperParameterRangeProperty {
        /**
         * The name of the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html#cfn-personalize-solution-categoricalhyperparameterrange-name
         */
        readonly name?: string;
        /**
         * A list of the categories for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-categoricalhyperparameterrange.html#cfn-personalize-solution-categoricalhyperparameterrange-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CategoricalHyperParameterRangeProperty`
 *
 * @param properties - the TypeScript properties of a `CategoricalHyperParameterRangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_CategoricalHyperParameterRangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "CategoricalHyperParameterRangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.CategoricalHyperParameterRange` resource
 *
 * @param properties - the TypeScript properties of a `CategoricalHyperParameterRangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.CategoricalHyperParameterRange` resource.
 */
// @ts-ignore TS6133
function cfnSolutionCategoricalHyperParameterRangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_CategoricalHyperParameterRangePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnSolutionCategoricalHyperParameterRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.CategoricalHyperParameterRangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.CategoricalHyperParameterRangeProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * Provides the name and range of a continuous hyperparameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html
     */
    export interface ContinuousHyperParameterRangeProperty {
        /**
         * The maximum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-maxvalue
         */
        readonly maxValue?: number;
        /**
         * The minimum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-minvalue
         */
        readonly minValue?: number;
        /**
         * The name of the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-continuoushyperparameterrange.html#cfn-personalize-solution-continuoushyperparameterrange-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ContinuousHyperParameterRangeProperty`
 *
 * @param properties - the TypeScript properties of a `ContinuousHyperParameterRangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_ContinuousHyperParameterRangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxValue', cdk.validateNumber)(properties.maxValue));
    errors.collect(cdk.propertyValidator('minValue', cdk.validateNumber)(properties.minValue));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ContinuousHyperParameterRangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.ContinuousHyperParameterRange` resource
 *
 * @param properties - the TypeScript properties of a `ContinuousHyperParameterRangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.ContinuousHyperParameterRange` resource.
 */
// @ts-ignore TS6133
function cfnSolutionContinuousHyperParameterRangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_ContinuousHyperParameterRangePropertyValidator(properties).assertSuccess();
    return {
        MaxValue: cdk.numberToCloudFormation(properties.maxValue),
        MinValue: cdk.numberToCloudFormation(properties.minValue),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnSolutionContinuousHyperParameterRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.ContinuousHyperParameterRangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.ContinuousHyperParameterRangeProperty>();
    ret.addPropertyResult('maxValue', 'MaxValue', properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined);
    ret.addPropertyResult('minValue', 'MinValue', properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * Describes the properties for hyperparameter optimization (HPO).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html
     */
    export interface HpoConfigProperty {
        /**
         * The hyperparameters and their allowable ranges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-algorithmhyperparameterranges
         */
        readonly algorithmHyperParameterRanges?: CfnSolution.AlgorithmHyperParameterRangesProperty | cdk.IResolvable;
        /**
         * The metric to optimize during HPO.
         *
         * > Amazon Personalize doesn't support configuring the `hpoObjective` at this time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-hpoobjective
         */
        readonly hpoObjective?: CfnSolution.HpoObjectiveProperty | cdk.IResolvable;
        /**
         * Describes the resource configuration for HPO.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoconfig.html#cfn-personalize-solution-hpoconfig-hporesourceconfig
         */
        readonly hpoResourceConfig?: CfnSolution.HpoResourceConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HpoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HpoConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_HpoConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('algorithmHyperParameterRanges', CfnSolution_AlgorithmHyperParameterRangesPropertyValidator)(properties.algorithmHyperParameterRanges));
    errors.collect(cdk.propertyValidator('hpoObjective', CfnSolution_HpoObjectivePropertyValidator)(properties.hpoObjective));
    errors.collect(cdk.propertyValidator('hpoResourceConfig', CfnSolution_HpoResourceConfigPropertyValidator)(properties.hpoResourceConfig));
    return errors.wrap('supplied properties not correct for "HpoConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.HpoConfig` resource
 *
 * @param properties - the TypeScript properties of a `HpoConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.HpoConfig` resource.
 */
// @ts-ignore TS6133
function cfnSolutionHpoConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_HpoConfigPropertyValidator(properties).assertSuccess();
    return {
        AlgorithmHyperParameterRanges: cfnSolutionAlgorithmHyperParameterRangesPropertyToCloudFormation(properties.algorithmHyperParameterRanges),
        HpoObjective: cfnSolutionHpoObjectivePropertyToCloudFormation(properties.hpoObjective),
        HpoResourceConfig: cfnSolutionHpoResourceConfigPropertyToCloudFormation(properties.hpoResourceConfig),
    };
}

// @ts-ignore TS6133
function CfnSolutionHpoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.HpoConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.HpoConfigProperty>();
    ret.addPropertyResult('algorithmHyperParameterRanges', 'AlgorithmHyperParameterRanges', properties.AlgorithmHyperParameterRanges != null ? CfnSolutionAlgorithmHyperParameterRangesPropertyFromCloudFormation(properties.AlgorithmHyperParameterRanges) : undefined);
    ret.addPropertyResult('hpoObjective', 'HpoObjective', properties.HpoObjective != null ? CfnSolutionHpoObjectivePropertyFromCloudFormation(properties.HpoObjective) : undefined);
    ret.addPropertyResult('hpoResourceConfig', 'HpoResourceConfig', properties.HpoResourceConfig != null ? CfnSolutionHpoResourceConfigPropertyFromCloudFormation(properties.HpoResourceConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * The metric to optimize during hyperparameter optimization (HPO).
     *
     * > Amazon Personalize doesn't support configuring the `hpoObjective` at this time.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html
     */
    export interface HpoObjectiveProperty {
        /**
         * The name of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-metricname
         */
        readonly metricName?: string;
        /**
         * A regular expression for finding the metric in the training job logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-metricregex
         */
        readonly metricRegex?: string;
        /**
         * The type of the metric. Valid values are `Maximize` and `Minimize` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hpoobjective.html#cfn-personalize-solution-hpoobjective-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HpoObjectiveProperty`
 *
 * @param properties - the TypeScript properties of a `HpoObjectiveProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_HpoObjectivePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricRegex', cdk.validateString)(properties.metricRegex));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "HpoObjectiveProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.HpoObjective` resource
 *
 * @param properties - the TypeScript properties of a `HpoObjectiveProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.HpoObjective` resource.
 */
// @ts-ignore TS6133
function cfnSolutionHpoObjectivePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_HpoObjectivePropertyValidator(properties).assertSuccess();
    return {
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        MetricRegex: cdk.stringToCloudFormation(properties.metricRegex),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSolutionHpoObjectivePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.HpoObjectiveProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.HpoObjectiveProperty>();
    ret.addPropertyResult('metricName', 'MetricName', properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined);
    ret.addPropertyResult('metricRegex', 'MetricRegex', properties.MetricRegex != null ? cfn_parse.FromCloudFormation.getString(properties.MetricRegex) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * Describes the resource configuration for hyperparameter optimization (HPO).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html
     */
    export interface HpoResourceConfigProperty {
        /**
         * The maximum number of training jobs when you create a solution version. The maximum value for `maxNumberOfTrainingJobs` is `40` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html#cfn-personalize-solution-hporesourceconfig-maxnumberoftrainingjobs
         */
        readonly maxNumberOfTrainingJobs?: string;
        /**
         * The maximum number of parallel training jobs when you create a solution version. The maximum value for `maxParallelTrainingJobs` is `10` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-hporesourceconfig.html#cfn-personalize-solution-hporesourceconfig-maxparalleltrainingjobs
         */
        readonly maxParallelTrainingJobs?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HpoResourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HpoResourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_HpoResourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxNumberOfTrainingJobs', cdk.validateString)(properties.maxNumberOfTrainingJobs));
    errors.collect(cdk.propertyValidator('maxParallelTrainingJobs', cdk.validateString)(properties.maxParallelTrainingJobs));
    return errors.wrap('supplied properties not correct for "HpoResourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.HpoResourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `HpoResourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.HpoResourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnSolutionHpoResourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_HpoResourceConfigPropertyValidator(properties).assertSuccess();
    return {
        MaxNumberOfTrainingJobs: cdk.stringToCloudFormation(properties.maxNumberOfTrainingJobs),
        MaxParallelTrainingJobs: cdk.stringToCloudFormation(properties.maxParallelTrainingJobs),
    };
}

// @ts-ignore TS6133
function CfnSolutionHpoResourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.HpoResourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.HpoResourceConfigProperty>();
    ret.addPropertyResult('maxNumberOfTrainingJobs', 'MaxNumberOfTrainingJobs', properties.MaxNumberOfTrainingJobs != null ? cfn_parse.FromCloudFormation.getString(properties.MaxNumberOfTrainingJobs) : undefined);
    ret.addPropertyResult('maxParallelTrainingJobs', 'MaxParallelTrainingJobs', properties.MaxParallelTrainingJobs != null ? cfn_parse.FromCloudFormation.getString(properties.MaxParallelTrainingJobs) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * Provides the name and range of an integer-valued hyperparameter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html
     */
    export interface IntegerHyperParameterRangeProperty {
        /**
         * The maximum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-maxvalue
         */
        readonly maxValue?: number;
        /**
         * The minimum allowable value for the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-minvalue
         */
        readonly minValue?: number;
        /**
         * The name of the hyperparameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-integerhyperparameterrange.html#cfn-personalize-solution-integerhyperparameterrange-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IntegerHyperParameterRangeProperty`
 *
 * @param properties - the TypeScript properties of a `IntegerHyperParameterRangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_IntegerHyperParameterRangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxValue', cdk.validateNumber)(properties.maxValue));
    errors.collect(cdk.propertyValidator('minValue', cdk.validateNumber)(properties.minValue));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "IntegerHyperParameterRangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.IntegerHyperParameterRange` resource
 *
 * @param properties - the TypeScript properties of a `IntegerHyperParameterRangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.IntegerHyperParameterRange` resource.
 */
// @ts-ignore TS6133
function cfnSolutionIntegerHyperParameterRangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_IntegerHyperParameterRangePropertyValidator(properties).assertSuccess();
    return {
        MaxValue: cdk.numberToCloudFormation(properties.maxValue),
        MinValue: cdk.numberToCloudFormation(properties.minValue),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnSolutionIntegerHyperParameterRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.IntegerHyperParameterRangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.IntegerHyperParameterRangeProperty>();
    ret.addPropertyResult('maxValue', 'MaxValue', properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined);
    ret.addPropertyResult('minValue', 'MinValue', properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSolution {
    /**
     * Describes the configuration properties for the solution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html
     */
    export interface SolutionConfigProperty {
        /**
         * Lists the hyperparameter names and ranges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-algorithmhyperparameters
         */
        readonly algorithmHyperParameters?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The [AutoMLConfig](https://docs.aws.amazon.com/personalize/latest/dg/API_AutoMLConfig.html) object containing a list of recipes to search when AutoML is performed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-automlconfig
         */
        readonly autoMlConfig?: any | cdk.IResolvable;
        /**
         * Only events with a value greater than or equal to this threshold are used for training a model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-eventvaluethreshold
         */
        readonly eventValueThreshold?: string;
        /**
         * Lists the feature transformation parameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-featuretransformationparameters
         */
        readonly featureTransformationParameters?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * Describes the properties for hyperparameter optimization (HPO).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-personalize-solution-solutionconfig.html#cfn-personalize-solution-solutionconfig-hpoconfig
         */
        readonly hpoConfig?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SolutionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SolutionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSolution_SolutionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('algorithmHyperParameters', cdk.hashValidator(cdk.validateString))(properties.algorithmHyperParameters));
    errors.collect(cdk.propertyValidator('autoMlConfig', cdk.validateObject)(properties.autoMlConfig));
    errors.collect(cdk.propertyValidator('eventValueThreshold', cdk.validateString)(properties.eventValueThreshold));
    errors.collect(cdk.propertyValidator('featureTransformationParameters', cdk.hashValidator(cdk.validateString))(properties.featureTransformationParameters));
    errors.collect(cdk.propertyValidator('hpoConfig', cdk.validateObject)(properties.hpoConfig));
    return errors.wrap('supplied properties not correct for "SolutionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Personalize::Solution.SolutionConfig` resource
 *
 * @param properties - the TypeScript properties of a `SolutionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Personalize::Solution.SolutionConfig` resource.
 */
// @ts-ignore TS6133
function cfnSolutionSolutionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSolution_SolutionConfigPropertyValidator(properties).assertSuccess();
    return {
        AlgorithmHyperParameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.algorithmHyperParameters),
        AutoMLConfig: cdk.objectToCloudFormation(properties.autoMlConfig),
        EventValueThreshold: cdk.stringToCloudFormation(properties.eventValueThreshold),
        FeatureTransformationParameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.featureTransformationParameters),
        HpoConfig: cdk.objectToCloudFormation(properties.hpoConfig),
    };
}

// @ts-ignore TS6133
function CfnSolutionSolutionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSolution.SolutionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSolution.SolutionConfigProperty>();
    ret.addPropertyResult('algorithmHyperParameters', 'AlgorithmHyperParameters', properties.AlgorithmHyperParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AlgorithmHyperParameters) : undefined);
    ret.addPropertyResult('autoMlConfig', 'AutoMLConfig', properties.AutoMLConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.AutoMLConfig) : undefined);
    ret.addPropertyResult('eventValueThreshold', 'EventValueThreshold', properties.EventValueThreshold != null ? cfn_parse.FromCloudFormation.getString(properties.EventValueThreshold) : undefined);
    ret.addPropertyResult('featureTransformationParameters', 'FeatureTransformationParameters', properties.FeatureTransformationParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.FeatureTransformationParameters) : undefined);
    ret.addPropertyResult('hpoConfig', 'HpoConfig', properties.HpoConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.HpoConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
