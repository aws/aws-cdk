// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:17.452Z","fingerprint":"8Luda93m1vKW/YPjN7lqIBcpuy/UvRnGL1w+Eohd6co="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html
 */
export interface CfnDatasetProps {

    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-datasetname
     */
    readonly datasetName: string;

    /**
     * The dataset type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-datasettype
     */
    readonly datasetType: string;

    /**
     * The domain associated with the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-domain
     */
    readonly domain: string;

    /**
     * The schema for the dataset. The schema attributes and their order must match the fields in your data. The dataset `Domain` and `DatasetType` that you choose determine the minimum required fields in your training data. For information about the required fields for a specific dataset domain and type, see [Dataset Domains and Dataset Types](https://docs.aws.amazon.com/forecast/latest/dg/howitworks-domains-ds-types.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-schema
     */
    readonly schema: any | cdk.IResolvable;

    /**
     * The frequency of data collection. This parameter is required for RELATED_TIME_SERIES datasets.
     *
     * Valid intervals are an integer followed by Y (Year), M (Month), W (Week), D (Day), H (Hour), and min (Minute). For example, "1D" indicates every day and "15min" indicates every 15 minutes. You cannot specify a value that would overlap with the next larger frequency. That means, for example, you cannot specify a frequency of 60 minutes, because that is equivalent to 1 hour. The valid values for each frequency are the following:
     *
     * - Minute - 1-59
     * - Hour - 1-23
     * - Day - 1-6
     * - Week - 1-4
     * - Month - 1-11
     * - Year - 1
     *
     * Thus, if you want every other week forecasts, specify "2W". Or, if you want quarterly forecasts, you specify "3M".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-datafrequency
     */
    readonly dataFrequency?: string;

    /**
     * A Key Management Service (KMS) key and the Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-encryptionconfig
     */
    readonly encryptionConfig?: any | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-tags
     */
    readonly tags?: CfnDataset.TagsItemsProperty[];
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
    errors.collect(cdk.propertyValidator('dataFrequency', cdk.validateString)(properties.dataFrequency));
    errors.collect(cdk.propertyValidator('datasetName', cdk.requiredValidator)(properties.datasetName));
    errors.collect(cdk.propertyValidator('datasetName', cdk.validateString)(properties.datasetName));
    errors.collect(cdk.propertyValidator('datasetType', cdk.requiredValidator)(properties.datasetType));
    errors.collect(cdk.propertyValidator('datasetType', cdk.validateString)(properties.datasetType));
    errors.collect(cdk.propertyValidator('domain', cdk.requiredValidator)(properties.domain));
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('encryptionConfig', cdk.validateObject)(properties.encryptionConfig));
    errors.collect(cdk.propertyValidator('schema', cdk.requiredValidator)(properties.schema));
    errors.collect(cdk.propertyValidator('schema', cdk.validateObject)(properties.schema));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnDataset_TagsItemsPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDatasetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Forecast::Dataset` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Forecast::Dataset` resource.
 */
// @ts-ignore TS6133
function cfnDatasetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatasetPropsValidator(properties).assertSuccess();
    return {
        DatasetName: cdk.stringToCloudFormation(properties.datasetName),
        DatasetType: cdk.stringToCloudFormation(properties.datasetType),
        Domain: cdk.stringToCloudFormation(properties.domain),
        Schema: cdk.objectToCloudFormation(properties.schema),
        DataFrequency: cdk.stringToCloudFormation(properties.dataFrequency),
        EncryptionConfig: cdk.objectToCloudFormation(properties.encryptionConfig),
        Tags: cdk.listMapper(cfnDatasetTagsItemsPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDatasetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetProps>();
    ret.addPropertyResult('datasetName', 'DatasetName', cfn_parse.FromCloudFormation.getString(properties.DatasetName));
    ret.addPropertyResult('datasetType', 'DatasetType', cfn_parse.FromCloudFormation.getString(properties.DatasetType));
    ret.addPropertyResult('domain', 'Domain', cfn_parse.FromCloudFormation.getString(properties.Domain));
    ret.addPropertyResult('schema', 'Schema', cfn_parse.FromCloudFormation.getAny(properties.Schema));
    ret.addPropertyResult('dataFrequency', 'DataFrequency', properties.DataFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.DataFrequency) : undefined);
    ret.addPropertyResult('encryptionConfig', 'EncryptionConfig', properties.EncryptionConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.EncryptionConfig) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetTagsItemsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Forecast::Dataset`
 *
 * Creates an Amazon Forecast dataset. The information about the dataset that you provide helps Forecast understand how to consume the data for model training. This includes the following:
 *
 * - *`DataFrequency`* - How frequently your historical time-series data is collected.
 * - *`Domain`* and *`DatasetType`* - Each dataset has an associated dataset domain and a type within the domain. Amazon Forecast provides a list of predefined domains and types within each domain. For each unique dataset domain and type within the domain, Amazon Forecast requires your data to include a minimum set of predefined fields.
 * - *`Schema`* - A schema specifies the fields in the dataset, including the field name and data type.
 *
 * After creating a dataset, you import your training data into it and add the dataset to a dataset group. You use the dataset group to create a predictor. For more information, see [Importing datasets](https://docs.aws.amazon.com/forecast/latest/dg/howitworks-datasets-groups.html) .
 *
 * To get a list of all your datasets, use the [ListDatasets](https://docs.aws.amazon.com/forecast/latest/dg/API_ListDatasets.html) operation.
 *
 * For example Forecast datasets, see the [Amazon Forecast Sample GitHub repository](https://docs.aws.amazon.com/https://github.com/aws-samples/amazon-forecast-samples) .
 *
 * > The `Status` of a dataset must be `ACTIVE` before you can import training data. Use the [DescribeDataset](https://docs.aws.amazon.com/forecast/latest/dg/API_DescribeDataset.html) operation to get the status.
 *
 * @cloudformationResource AWS::Forecast::Dataset
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html
 */
export class CfnDataset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Forecast::Dataset";

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
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-datasetname
     */
    public datasetName: string;

    /**
     * The dataset type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-datasettype
     */
    public datasetType: string;

    /**
     * The domain associated with the dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-domain
     */
    public domain: string;

    /**
     * The schema for the dataset. The schema attributes and their order must match the fields in your data. The dataset `Domain` and `DatasetType` that you choose determine the minimum required fields in your training data. For information about the required fields for a specific dataset domain and type, see [Dataset Domains and Dataset Types](https://docs.aws.amazon.com/forecast/latest/dg/howitworks-domains-ds-types.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-schema
     */
    public schema: any | cdk.IResolvable;

    /**
     * The frequency of data collection. This parameter is required for RELATED_TIME_SERIES datasets.
     *
     * Valid intervals are an integer followed by Y (Year), M (Month), W (Week), D (Day), H (Hour), and min (Minute). For example, "1D" indicates every day and "15min" indicates every 15 minutes. You cannot specify a value that would overlap with the next larger frequency. That means, for example, you cannot specify a frequency of 60 minutes, because that is equivalent to 1 hour. The valid values for each frequency are the following:
     *
     * - Minute - 1-59
     * - Hour - 1-23
     * - Day - 1-6
     * - Week - 1-4
     * - Month - 1-11
     * - Year - 1
     *
     * Thus, if you want every other week forecasts, specify "2W". Or, if you want quarterly forecasts, you specify "3M".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-datafrequency
     */
    public dataFrequency: string | undefined;

    /**
     * A Key Management Service (KMS) key and the Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-encryptionconfig
     */
    public encryptionConfig: any | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-dataset.html#cfn-forecast-dataset-tags
     */
    public tags: CfnDataset.TagsItemsProperty[] | undefined;

    /**
     * Create a new `AWS::Forecast::Dataset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps) {
        super(scope, id, { type: CfnDataset.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'datasetName', this);
        cdk.requireProperty(props, 'datasetType', this);
        cdk.requireProperty(props, 'domain', this);
        cdk.requireProperty(props, 'schema', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.datasetName = props.datasetName;
        this.datasetType = props.datasetType;
        this.domain = props.domain;
        this.schema = props.schema;
        this.dataFrequency = props.dataFrequency;
        this.encryptionConfig = props.encryptionConfig;
        this.tags = props.tags;
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
            datasetName: this.datasetName,
            datasetType: this.datasetType,
            domain: this.domain,
            schema: this.schema,
            dataFrequency: this.dataFrequency,
            encryptionConfig: this.encryptionConfig,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatasetPropsToCloudFormation(props);
    }
}

export namespace CfnDataset {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-attributesitems.html
     */
    export interface AttributesItemsProperty {
        /**
         * `CfnDataset.AttributesItemsProperty.AttributeName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-attributesitems.html#cfn-forecast-dataset-attributesitems-attributename
         */
        readonly attributeName?: string;
        /**
         * `CfnDataset.AttributesItemsProperty.AttributeType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-attributesitems.html#cfn-forecast-dataset-attributesitems-attributetype
         */
        readonly attributeType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AttributesItemsProperty`
 *
 * @param properties - the TypeScript properties of a `AttributesItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_AttributesItemsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeType', cdk.validateString)(properties.attributeType));
    return errors.wrap('supplied properties not correct for "AttributesItemsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Forecast::Dataset.AttributesItems` resource
 *
 * @param properties - the TypeScript properties of a `AttributesItemsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Forecast::Dataset.AttributesItems` resource.
 */
// @ts-ignore TS6133
function cfnDatasetAttributesItemsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_AttributesItemsPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        AttributeType: cdk.stringToCloudFormation(properties.attributeType),
    };
}

// @ts-ignore TS6133
function CfnDatasetAttributesItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.AttributesItemsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.AttributesItemsProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', properties.AttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeName) : undefined);
    ret.addPropertyResult('attributeType', 'AttributeType', properties.AttributeType != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * An AWS Key Management Service (KMS) key and an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key. You can specify this optional object in the `CreateDataset` and `CreatePredictor` requests.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-encryptionconfig.html
     */
    export interface EncryptionConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the KMS key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-encryptionconfig.html#cfn-forecast-dataset-encryptionconfig-kmskeyarn
         */
        readonly kmsKeyArn?: string;
        /**
         * The ARN of the IAM role that Amazon Forecast can assume to access the AWS KMS key.
         *
         * Passing a role across AWS accounts is not allowed. If you pass a role that isn't in your account, you get an `InvalidInputException` error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-encryptionconfig.html#cfn-forecast-dataset-encryptionconfig-rolearn
         */
        readonly roleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_EncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "EncryptionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Forecast::Dataset.EncryptionConfig` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Forecast::Dataset.EncryptionConfig` resource.
 */
// @ts-ignore TS6133
function cfnDatasetEncryptionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_EncryptionConfigPropertyValidator(properties).assertSuccess();
    return {
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnDatasetEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.EncryptionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.EncryptionConfigProperty>();
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     * Defines the fields of a dataset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-schema.html
     */
    export interface SchemaProperty {
        /**
         * An array of attributes specifying the name and type of each field in a dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-schema.html#cfn-forecast-dataset-schema-attributes
         */
        readonly attributes?: Array<CfnDataset.AttributesItemsProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SchemaProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_SchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.listValidator(CfnDataset_AttributesItemsPropertyValidator))(properties.attributes));
    return errors.wrap('supplied properties not correct for "SchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Forecast::Dataset.Schema` resource
 *
 * @param properties - the TypeScript properties of a `SchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Forecast::Dataset.Schema` resource.
 */
// @ts-ignore TS6133
function cfnDatasetSchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_SchemaPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.listMapper(cfnDatasetAttributesItemsPropertyToCloudFormation)(properties.attributes),
    };
}

// @ts-ignore TS6133
function CfnDatasetSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.SchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.SchemaProperty>();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetAttributesItemsPropertyFromCloudFormation)(properties.Attributes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataset {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-tagsitems.html
     */
    export interface TagsItemsProperty {
        /**
         * `CfnDataset.TagsItemsProperty.Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-tagsitems.html#cfn-forecast-dataset-tagsitems-key
         */
        readonly key: string;
        /**
         * `CfnDataset.TagsItemsProperty.Value`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-forecast-dataset-tagsitems.html#cfn-forecast-dataset-tagsitems-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsItemsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_TagsItemsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsItemsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Forecast::Dataset.TagsItems` resource
 *
 * @param properties - the TypeScript properties of a `TagsItemsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Forecast::Dataset.TagsItems` resource.
 */
// @ts-ignore TS6133
function cfnDatasetTagsItemsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataset_TagsItemsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnDatasetTagsItemsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.TagsItemsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.TagsItemsProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDatasetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html
 */
export interface CfnDatasetGroupProps {

    /**
     * The name of the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-datasetgroupname
     */
    readonly datasetGroupName: string;

    /**
     * The domain associated with the dataset group. When you add a dataset to a dataset group, this value and the value specified for the `Domain` parameter of the [CreateDataset](https://docs.aws.amazon.com/forecast/latest/dg/API_CreateDataset.html) operation must match.
     *
     * The `Domain` and `DatasetType` that you choose determine the fields that must be present in training data that you import to a dataset. For example, if you choose the `RETAIL` domain and `TARGET_TIME_SERIES` as the `DatasetType` , Amazon Forecast requires that `item_id` , `timestamp` , and `demand` fields are present in your data. For more information, see [Dataset groups](https://docs.aws.amazon.com/forecast/latest/dg/howitworks-datasets-groups.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-domain
     */
    readonly domain: string;

    /**
     * An array of Amazon Resource Names (ARNs) of the datasets that you want to include in the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-datasetarns
     */
    readonly datasetArns?: string[];

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
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
    errors.collect(cdk.propertyValidator('datasetArns', cdk.listValidator(cdk.validateString))(properties.datasetArns));
    errors.collect(cdk.propertyValidator('datasetGroupName', cdk.requiredValidator)(properties.datasetGroupName));
    errors.collect(cdk.propertyValidator('datasetGroupName', cdk.validateString)(properties.datasetGroupName));
    errors.collect(cdk.propertyValidator('domain', cdk.requiredValidator)(properties.domain));
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDatasetGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Forecast::DatasetGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatasetGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Forecast::DatasetGroup` resource.
 */
// @ts-ignore TS6133
function cfnDatasetGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatasetGroupPropsValidator(properties).assertSuccess();
    return {
        DatasetGroupName: cdk.stringToCloudFormation(properties.datasetGroupName),
        Domain: cdk.stringToCloudFormation(properties.domain),
        DatasetArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.datasetArns),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDatasetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetGroupProps>();
    ret.addPropertyResult('datasetGroupName', 'DatasetGroupName', cfn_parse.FromCloudFormation.getString(properties.DatasetGroupName));
    ret.addPropertyResult('domain', 'Domain', cfn_parse.FromCloudFormation.getString(properties.Domain));
    ret.addPropertyResult('datasetArns', 'DatasetArns', properties.DatasetArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DatasetArns) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Forecast::DatasetGroup`
 *
 * Creates a dataset group, which holds a collection of related datasets. You can add datasets to the dataset group when you create the dataset group, or later by using the [UpdateDatasetGroup](https://docs.aws.amazon.com/forecast/latest/dg/API_UpdateDatasetGroup.html) operation.
 *
 * After creating a dataset group and adding datasets, you use the dataset group when you create a predictor. For more information, see [Dataset groups](https://docs.aws.amazon.com/forecast/latest/dg/howitworks-datasets-groups.html) .
 *
 * To get a list of all your datasets groups, use the [ListDatasetGroups](https://docs.aws.amazon.com/forecast/latest/dg/API_ListDatasetGroups.html) operation.
 *
 * > The `Status` of a dataset group must be `ACTIVE` before you can use the dataset group to create a predictor. To get the status, use the [DescribeDatasetGroup](https://docs.aws.amazon.com/forecast/latest/dg/API_DescribeDatasetGroup.html) operation.
 *
 * @cloudformationResource AWS::Forecast::DatasetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html
 */
export class CfnDatasetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Forecast::DatasetGroup";

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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-datasetgroupname
     */
    public datasetGroupName: string;

    /**
     * The domain associated with the dataset group. When you add a dataset to a dataset group, this value and the value specified for the `Domain` parameter of the [CreateDataset](https://docs.aws.amazon.com/forecast/latest/dg/API_CreateDataset.html) operation must match.
     *
     * The `Domain` and `DatasetType` that you choose determine the fields that must be present in training data that you import to a dataset. For example, if you choose the `RETAIL` domain and `TARGET_TIME_SERIES` as the `DatasetType` , Amazon Forecast requires that `item_id` , `timestamp` , and `demand` fields are present in your data. For more information, see [Dataset groups](https://docs.aws.amazon.com/forecast/latest/dg/howitworks-datasets-groups.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-domain
     */
    public domain: string;

    /**
     * An array of Amazon Resource Names (ARNs) of the datasets that you want to include in the dataset group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-datasetarns
     */
    public datasetArns: string[] | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-forecast-datasetgroup.html#cfn-forecast-datasetgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Forecast::DatasetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatasetGroupProps) {
        super(scope, id, { type: CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'datasetGroupName', this);
        cdk.requireProperty(props, 'domain', this);
        this.attrDatasetGroupArn = cdk.Token.asString(this.getAtt('DatasetGroupArn', cdk.ResolutionTypeHint.STRING));

        this.datasetGroupName = props.datasetGroupName;
        this.domain = props.domain;
        this.datasetArns = props.datasetArns;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Forecast::DatasetGroup", props.tags, { tagPropertyName: 'tags' });
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
            datasetGroupName: this.datasetGroupName,
            domain: this.domain,
            datasetArns: this.datasetArns,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatasetGroupPropsToCloudFormation(props);
    }
}
