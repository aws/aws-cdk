"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnDatasetGroup = exports.CfnDataset = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnDatasetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the result of the validation.
 */
function CfnDatasetPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnDatasetPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
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
function CfnDatasetPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('datasetName', 'DatasetName', cfn_parse.FromCloudFormation.getString(properties.DatasetName));
    ret.addPropertyResult('datasetType', 'DatasetType', cfn_parse.FromCloudFormation.getString(properties.DatasetType));
    ret.addPropertyResult('domain', 'Domain', cfn_parse.FromCloudFormation.getString(properties.Domain));
    ret.addPropertyResult('schema', 'Schema', cfn_parse.FromCloudFormation.getAny(properties.Schema));
    ret.addPropertyResult('dataFrequency', 'DataFrequency', properties.DataFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.DataFrequency) : undefined);
    ret.addPropertyResult('encryptionConfig', 'EncryptionConfig', properties.EncryptionConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.EncryptionConfig) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetTagsItemsPropertyFromCloudFormation)(properties.Tags) : undefined);
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
class CfnDataset extends cdk.CfnResource {
    /**
     * Create a new `AWS::Forecast::Dataset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnDataset.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_forecast_CfnDatasetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnDataset);
            }
            throw error;
        }
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
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatasetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataset(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataset.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
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
    renderProperties(props) {
        return cfnDatasetPropsToCloudFormation(props);
    }
}
exports.CfnDataset = CfnDataset;
_a = JSII_RTTI_SYMBOL_1;
CfnDataset[_a] = { fqn: "@aws-cdk/aws-forecast.CfnDataset", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnDataset.CFN_RESOURCE_TYPE_NAME = "AWS::Forecast::Dataset";
/**
 * Determine whether the given properties match those of a `AttributesItemsProperty`
 *
 * @param properties - the TypeScript properties of a `AttributesItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_AttributesItemsPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnDatasetAttributesItemsPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDataset_AttributesItemsPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        AttributeType: cdk.stringToCloudFormation(properties.attributeType),
    };
}
// @ts-ignore TS6133
function CfnDatasetAttributesItemsPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('attributeName', 'AttributeName', properties.AttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeName) : undefined);
    ret.addPropertyResult('attributeType', 'AttributeType', properties.AttributeType != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `EncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_EncryptionConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnDatasetEncryptionConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDataset_EncryptionConfigPropertyValidator(properties).assertSuccess();
    return {
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}
// @ts-ignore TS6133
function CfnDatasetEncryptionConfigPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `SchemaProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_SchemaPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnDatasetSchemaPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDataset_SchemaPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.listMapper(cfnDatasetAttributesItemsPropertyToCloudFormation)(properties.attributes),
    };
}
// @ts-ignore TS6133
function CfnDatasetSchemaPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetAttributesItemsPropertyFromCloudFormation)(properties.Attributes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `TagsItemsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsItemsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataset_TagsItemsPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnDatasetTagsItemsPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDataset_TagsItemsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}
// @ts-ignore TS6133
function CfnDatasetTagsItemsPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `CfnDatasetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnDatasetGroupPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnDatasetGroupPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDatasetGroupPropsValidator(properties).assertSuccess();
    return {
        DatasetGroupName: cdk.stringToCloudFormation(properties.datasetGroupName),
        Domain: cdk.stringToCloudFormation(properties.domain),
        DatasetArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.datasetArns),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnDatasetGroupPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('datasetGroupName', 'DatasetGroupName', cfn_parse.FromCloudFormation.getString(properties.DatasetGroupName));
    ret.addPropertyResult('domain', 'Domain', cfn_parse.FromCloudFormation.getString(properties.Domain));
    ret.addPropertyResult('datasetArns', 'DatasetArns', properties.DatasetArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DatasetArns) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined);
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
class CfnDatasetGroup extends cdk.CfnResource {
    /**
     * Create a new `AWS::Forecast::DatasetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_forecast_CfnDatasetGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnDatasetGroup);
            }
            throw error;
        }
        cdk.requireProperty(props, 'datasetGroupName', this);
        cdk.requireProperty(props, 'domain', this);
        this.attrDatasetGroupArn = cdk.Token.asString(this.getAtt('DatasetGroupArn', cdk.ResolutionTypeHint.STRING));
        this.datasetGroupName = props.datasetGroupName;
        this.domain = props.domain;
        this.datasetArns = props.datasetArns;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Forecast::DatasetGroup", props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatasetGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDatasetGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            datasetGroupName: this.datasetGroupName,
            domain: this.domain,
            datasetArns: this.datasetArns,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnDatasetGroupPropsToCloudFormation(props);
    }
}
exports.CfnDatasetGroup = CfnDatasetGroup;
_b = JSII_RTTI_SYMBOL_1;
CfnDatasetGroup[_b] = { fqn: "@aws-cdk/aws-forecast.CfnDatasetGroup", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnDatasetGroup.CFN_RESOURCE_TYPE_NAME = "AWS::Forecast::DatasetGroup";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZWNhc3QuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZm9yZWNhc3QuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLHFDQUFxQztBQUNyQyxnRUFBZ0U7QUEyRWhFOzs7Ozs7R0FNRztBQUNILFNBQVMsd0JBQXdCLENBQUMsVUFBZTtJQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNyRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDcEcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNqRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGlCQUFp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QUMsQ0FBQztRQUMvRSxNQUFNLEdBQUcsR0FBRyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5RCxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUc7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUEyREQ7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBNEI7UUFDdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM5RixTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUM5RTtJQUVELElBQWMsYUFBYTtRQUN2QixPQUFPO1lBQ0gsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtTQUMvQixDQUFDO0tBQ0w7SUFFUyxnQkFBZ0IsQ0FBQyxLQUEyQjtRQUNsRCxPQUFPLG9DQUFvQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3REOztBQXhHTCwwQ0F5R0M7OztBQXhHRzs7R0FFRztBQUNvQixzQ0FBc0IsR0FBRyw2QkFBNkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIEdlbmVyYXRlZCBmcm9tIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgU3BlY2lmaWNhdGlvblxuLy8gU2VlOiBkb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvY2ZuLXJlc291cmNlLXNwZWNpZmljYXRpb24uaHRtbFxuLy8gQGNmbjJ0czptZXRhQCB7XCJnZW5lcmF0ZWRcIjpcIjIwMjMtMDEtMjJUMDk6NTI6MTcuNDUyWlwiLFwiZmluZ2VycHJpbnRcIjpcIjhMdWRhOTNtMXZLVy9ZUGpON2xxSUJjcHV5L1V2Um5HTDF3K0VvaGQ2Y289XCJ9XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNmbl9wYXJzZSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5EYXRhc2V0YFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5EYXRhc2V0UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGRhdGFzZXQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Lmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtZGF0YXNldG5hbWVcbiAgICAgKi9cbiAgICByZWFkb25seSBkYXRhc2V0TmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRhdGFzZXQgdHlwZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1kYXRhc2V0dHlwZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRhdGFzZXRUeXBlOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZG9tYWluIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0YXNldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1kb21haW5cbiAgICAgKi9cbiAgICByZWFkb25seSBkb21haW46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBzY2hlbWEgZm9yIHRoZSBkYXRhc2V0LiBUaGUgc2NoZW1hIGF0dHJpYnV0ZXMgYW5kIHRoZWlyIG9yZGVyIG11c3QgbWF0Y2ggdGhlIGZpZWxkcyBpbiB5b3VyIGRhdGEuIFRoZSBkYXRhc2V0IGBEb21haW5gIGFuZCBgRGF0YXNldFR5cGVgIHRoYXQgeW91IGNob29zZSBkZXRlcm1pbmUgdGhlIG1pbmltdW0gcmVxdWlyZWQgZmllbGRzIGluIHlvdXIgdHJhaW5pbmcgZGF0YS4gRm9yIGluZm9ybWF0aW9uIGFib3V0IHRoZSByZXF1aXJlZCBmaWVsZHMgZm9yIGEgc3BlY2lmaWMgZGF0YXNldCBkb21haW4gYW5kIHR5cGUsIHNlZSBbRGF0YXNldCBEb21haW5zIGFuZCBEYXRhc2V0IFR5cGVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZm9yZWNhc3QvbGF0ZXN0L2RnL2hvd2l0d29ya3MtZG9tYWlucy1kcy10eXBlcy5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Lmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtc2NoZW1hXG4gICAgICovXG4gICAgcmVhZG9ubHkgc2NoZW1hOiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZnJlcXVlbmN5IG9mIGRhdGEgY29sbGVjdGlvbi4gVGhpcyBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgZm9yIFJFTEFURURfVElNRV9TRVJJRVMgZGF0YXNldHMuXG4gICAgICpcbiAgICAgKiBWYWxpZCBpbnRlcnZhbHMgYXJlIGFuIGludGVnZXIgZm9sbG93ZWQgYnkgWSAoWWVhciksIE0gKE1vbnRoKSwgVyAoV2VlayksIEQgKERheSksIEggKEhvdXIpLCBhbmQgbWluIChNaW51dGUpLiBGb3IgZXhhbXBsZSwgXCIxRFwiIGluZGljYXRlcyBldmVyeSBkYXkgYW5kIFwiMTVtaW5cIiBpbmRpY2F0ZXMgZXZlcnkgMTUgbWludXRlcy4gWW91IGNhbm5vdCBzcGVjaWZ5IGEgdmFsdWUgdGhhdCB3b3VsZCBvdmVybGFwIHdpdGggdGhlIG5leHQgbGFyZ2VyIGZyZXF1ZW5jeS4gVGhhdCBtZWFucywgZm9yIGV4YW1wbGUsIHlvdSBjYW5ub3Qgc3BlY2lmeSBhIGZyZXF1ZW5jeSBvZiA2MCBtaW51dGVzLCBiZWNhdXNlIHRoYXQgaXMgZXF1aXZhbGVudCB0byAxIGhvdXIuIFRoZSB2YWxpZCB2YWx1ZXMgZm9yIGVhY2ggZnJlcXVlbmN5IGFyZSB0aGUgZm9sbG93aW5nOlxuICAgICAqXG4gICAgICogLSBNaW51dGUgLSAxLTU5XG4gICAgICogLSBIb3VyIC0gMS0yM1xuICAgICAqIC0gRGF5IC0gMS02XG4gICAgICogLSBXZWVrIC0gMS00XG4gICAgICogLSBNb250aCAtIDEtMTFcbiAgICAgKiAtIFllYXIgLSAxXG4gICAgICpcbiAgICAgKiBUaHVzLCBpZiB5b3Ugd2FudCBldmVyeSBvdGhlciB3ZWVrIGZvcmVjYXN0cywgc3BlY2lmeSBcIjJXXCIuIE9yLCBpZiB5b3Ugd2FudCBxdWFydGVybHkgZm9yZWNhc3RzLCB5b3Ugc3BlY2lmeSBcIjNNXCIuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Lmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtZGF0YWZyZXF1ZW5jeVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRhdGFGcmVxdWVuY3k/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIEtleSBNYW5hZ2VtZW50IFNlcnZpY2UgKEtNUykga2V5IGFuZCB0aGUgSWRlbnRpdHkgYW5kIEFjY2VzcyBNYW5hZ2VtZW50IChJQU0pIHJvbGUgdGhhdCBBbWF6b24gRm9yZWNhc3QgY2FuIGFzc3VtZSB0byBhY2Nlc3MgdGhlIGtleS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1lbmNyeXB0aW9uY29uZmlnXG4gICAgICovXG4gICAgcmVhZG9ubHkgZW5jcnlwdGlvbkNvbmZpZz86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGlzIHJlc291cmNlLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVGFnXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yZXNvdXJjZS10YWdzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC10YWdzXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGFncz86IENmbkRhdGFzZXQuVGFnc0l0ZW1zUHJvcGVydHlbXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5EYXRhc2V0UHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRhdGFzZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5EYXRhc2V0UHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhRnJlcXVlbmN5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRhdGFGcmVxdWVuY3kpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RhdGFzZXROYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmRhdGFzZXROYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhc2V0TmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kYXRhc2V0TmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGF0YXNldFR5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZGF0YXNldFR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RhdGFzZXRUeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRhdGFzZXRUeXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkb21haW4nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZG9tYWluKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkb21haW4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZG9tYWluKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdlbmNyeXB0aW9uQ29uZmlnJywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLmVuY3J5cHRpb25Db25maWcpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NjaGVtYScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zY2hlbWEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NjaGVtYScsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5zY2hlbWEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5EYXRhc2V0X1RhZ3NJdGVtc1Byb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkRhdGFzZXRQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRhdGFzZXRQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRGF0YXNldFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5EYXRhc2V0UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIERhdGFzZXROYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRhdGFzZXROYW1lKSxcbiAgICAgICAgRGF0YXNldFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGF0YXNldFR5cGUpLFxuICAgICAgICBEb21haW46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZG9tYWluKSxcbiAgICAgICAgU2NoZW1hOiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnNjaGVtYSksXG4gICAgICAgIERhdGFGcmVxdWVuY3k6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGF0YUZyZXF1ZW5jeSksXG4gICAgICAgIEVuY3J5cHRpb25Db25maWc6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZW5jcnlwdGlvbkNvbmZpZyksXG4gICAgICAgIFRhZ3M6IGNkay5saXN0TWFwcGVyKGNmbkRhdGFzZXRUYWdzSXRlbXNQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkRhdGFzZXRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkRhdGFzZXRQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuRGF0YXNldFByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZGF0YXNldE5hbWUnLCAnRGF0YXNldE5hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRhdGFzZXROYW1lKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkYXRhc2V0VHlwZScsICdEYXRhc2V0VHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGF0YXNldFR5cGUpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RvbWFpbicsICdEb21haW4nLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkRvbWFpbikpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnc2NoZW1hJywgJ1NjaGVtYScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QW55KHByb3BlcnRpZXMuU2NoZW1hKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkYXRhRnJlcXVlbmN5JywgJ0RhdGFGcmVxdWVuY3knLCBwcm9wZXJ0aWVzLkRhdGFGcmVxdWVuY3kgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGF0YUZyZXF1ZW5jeSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZW5jcnlwdGlvbkNvbmZpZycsICdFbmNyeXB0aW9uQ29uZmlnJywgcHJvcGVydGllcy5FbmNyeXB0aW9uQ29uZmlnICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFueShwcm9wZXJ0aWVzLkVuY3J5cHRpb25Db25maWcpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3RhZ3MnLCAnVGFncycsIHByb3BlcnRpZXMuVGFncyAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShDZm5EYXRhc2V0VGFnc0l0ZW1zUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuVGFncykgOiB1bmRlZmluZWQgYXMgYW55KTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkZvcmVjYXN0OjpEYXRhc2V0YFxuICpcbiAqIENyZWF0ZXMgYW4gQW1hem9uIEZvcmVjYXN0IGRhdGFzZXQuIFRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZGF0YXNldCB0aGF0IHlvdSBwcm92aWRlIGhlbHBzIEZvcmVjYXN0IHVuZGVyc3RhbmQgaG93IHRvIGNvbnN1bWUgdGhlIGRhdGEgZm9yIG1vZGVsIHRyYWluaW5nLiBUaGlzIGluY2x1ZGVzIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogLSAqYERhdGFGcmVxdWVuY3lgKiAtIEhvdyBmcmVxdWVudGx5IHlvdXIgaGlzdG9yaWNhbCB0aW1lLXNlcmllcyBkYXRhIGlzIGNvbGxlY3RlZC5cbiAqIC0gKmBEb21haW5gKiBhbmQgKmBEYXRhc2V0VHlwZWAqIC0gRWFjaCBkYXRhc2V0IGhhcyBhbiBhc3NvY2lhdGVkIGRhdGFzZXQgZG9tYWluIGFuZCBhIHR5cGUgd2l0aGluIHRoZSBkb21haW4uIEFtYXpvbiBGb3JlY2FzdCBwcm92aWRlcyBhIGxpc3Qgb2YgcHJlZGVmaW5lZCBkb21haW5zIGFuZCB0eXBlcyB3aXRoaW4gZWFjaCBkb21haW4uIEZvciBlYWNoIHVuaXF1ZSBkYXRhc2V0IGRvbWFpbiBhbmQgdHlwZSB3aXRoaW4gdGhlIGRvbWFpbiwgQW1hem9uIEZvcmVjYXN0IHJlcXVpcmVzIHlvdXIgZGF0YSB0byBpbmNsdWRlIGEgbWluaW11bSBzZXQgb2YgcHJlZGVmaW5lZCBmaWVsZHMuXG4gKiAtICpgU2NoZW1hYCogLSBBIHNjaGVtYSBzcGVjaWZpZXMgdGhlIGZpZWxkcyBpbiB0aGUgZGF0YXNldCwgaW5jbHVkaW5nIHRoZSBmaWVsZCBuYW1lIGFuZCBkYXRhIHR5cGUuXG4gKlxuICogQWZ0ZXIgY3JlYXRpbmcgYSBkYXRhc2V0LCB5b3UgaW1wb3J0IHlvdXIgdHJhaW5pbmcgZGF0YSBpbnRvIGl0IGFuZCBhZGQgdGhlIGRhdGFzZXQgdG8gYSBkYXRhc2V0IGdyb3VwLiBZb3UgdXNlIHRoZSBkYXRhc2V0IGdyb3VwIHRvIGNyZWF0ZSBhIHByZWRpY3Rvci4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbSW1wb3J0aW5nIGRhdGFzZXRzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZm9yZWNhc3QvbGF0ZXN0L2RnL2hvd2l0d29ya3MtZGF0YXNldHMtZ3JvdXBzLmh0bWwpIC5cbiAqXG4gKiBUbyBnZXQgYSBsaXN0IG9mIGFsbCB5b3VyIGRhdGFzZXRzLCB1c2UgdGhlIFtMaXN0RGF0YXNldHNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9mb3JlY2FzdC9sYXRlc3QvZGcvQVBJX0xpc3REYXRhc2V0cy5odG1sKSBvcGVyYXRpb24uXG4gKlxuICogRm9yIGV4YW1wbGUgRm9yZWNhc3QgZGF0YXNldHMsIHNlZSB0aGUgW0FtYXpvbiBGb3JlY2FzdCBTYW1wbGUgR2l0SHViIHJlcG9zaXRvcnldKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9odHRwczovL2dpdGh1Yi5jb20vYXdzLXNhbXBsZXMvYW1hem9uLWZvcmVjYXN0LXNhbXBsZXMpIC5cbiAqXG4gKiA+IFRoZSBgU3RhdHVzYCBvZiBhIGRhdGFzZXQgbXVzdCBiZSBgQUNUSVZFYCBiZWZvcmUgeW91IGNhbiBpbXBvcnQgdHJhaW5pbmcgZGF0YS4gVXNlIHRoZSBbRGVzY3JpYmVEYXRhc2V0XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZm9yZWNhc3QvbGF0ZXN0L2RnL0FQSV9EZXNjcmliZURhdGFzZXQuaHRtbCkgb3BlcmF0aW9uIHRvIGdldCB0aGUgc3RhdHVzLlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXRcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkRhdGFzZXQgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpGb3JlY2FzdDo6RGF0YXNldFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbkRhdGFzZXQge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkRhdGFzZXRQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuRGF0YXNldChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGRhdGFzZXQuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZGF0YXNldC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1kYXRhc2V0bmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBkYXRhc2V0TmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRhdGFzZXQgdHlwZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1kYXRhc2V0dHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBkYXRhc2V0VHlwZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRvbWFpbiBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGFzZXQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Lmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtZG9tYWluXG4gICAgICovXG4gICAgcHVibGljIGRvbWFpbjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNjaGVtYSBmb3IgdGhlIGRhdGFzZXQuIFRoZSBzY2hlbWEgYXR0cmlidXRlcyBhbmQgdGhlaXIgb3JkZXIgbXVzdCBtYXRjaCB0aGUgZmllbGRzIGluIHlvdXIgZGF0YS4gVGhlIGRhdGFzZXQgYERvbWFpbmAgYW5kIGBEYXRhc2V0VHlwZWAgdGhhdCB5b3UgY2hvb3NlIGRldGVybWluZSB0aGUgbWluaW11bSByZXF1aXJlZCBmaWVsZHMgaW4geW91ciB0cmFpbmluZyBkYXRhLiBGb3IgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJlcXVpcmVkIGZpZWxkcyBmb3IgYSBzcGVjaWZpYyBkYXRhc2V0IGRvbWFpbiBhbmQgdHlwZSwgc2VlIFtEYXRhc2V0IERvbWFpbnMgYW5kIERhdGFzZXQgVHlwZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9mb3JlY2FzdC9sYXRlc3QvZGcvaG93aXR3b3Jrcy1kb21haW5zLWRzLXR5cGVzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1zY2hlbWFcbiAgICAgKi9cbiAgICBwdWJsaWMgc2NoZW1hOiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZnJlcXVlbmN5IG9mIGRhdGEgY29sbGVjdGlvbi4gVGhpcyBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgZm9yIFJFTEFURURfVElNRV9TRVJJRVMgZGF0YXNldHMuXG4gICAgICpcbiAgICAgKiBWYWxpZCBpbnRlcnZhbHMgYXJlIGFuIGludGVnZXIgZm9sbG93ZWQgYnkgWSAoWWVhciksIE0gKE1vbnRoKSwgVyAoV2VlayksIEQgKERheSksIEggKEhvdXIpLCBhbmQgbWluIChNaW51dGUpLiBGb3IgZXhhbXBsZSwgXCIxRFwiIGluZGljYXRlcyBldmVyeSBkYXkgYW5kIFwiMTVtaW5cIiBpbmRpY2F0ZXMgZXZlcnkgMTUgbWludXRlcy4gWW91IGNhbm5vdCBzcGVjaWZ5IGEgdmFsdWUgdGhhdCB3b3VsZCBvdmVybGFwIHdpdGggdGhlIG5leHQgbGFyZ2VyIGZyZXF1ZW5jeS4gVGhhdCBtZWFucywgZm9yIGV4YW1wbGUsIHlvdSBjYW5ub3Qgc3BlY2lmeSBhIGZyZXF1ZW5jeSBvZiA2MCBtaW51dGVzLCBiZWNhdXNlIHRoYXQgaXMgZXF1aXZhbGVudCB0byAxIGhvdXIuIFRoZSB2YWxpZCB2YWx1ZXMgZm9yIGVhY2ggZnJlcXVlbmN5IGFyZSB0aGUgZm9sbG93aW5nOlxuICAgICAqXG4gICAgICogLSBNaW51dGUgLSAxLTU5XG4gICAgICogLSBIb3VyIC0gMS0yM1xuICAgICAqIC0gRGF5IC0gMS02XG4gICAgICogLSBXZWVrIC0gMS00XG4gICAgICogLSBNb250aCAtIDEtMTFcbiAgICAgKiAtIFllYXIgLSAxXG4gICAgICpcbiAgICAgKiBUaHVzLCBpZiB5b3Ugd2FudCBldmVyeSBvdGhlciB3ZWVrIGZvcmVjYXN0cywgc3BlY2lmeSBcIjJXXCIuIE9yLCBpZiB5b3Ugd2FudCBxdWFydGVybHkgZm9yZWNhc3RzLCB5b3Ugc3BlY2lmeSBcIjNNXCIuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Lmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtZGF0YWZyZXF1ZW5jeVxuICAgICAqL1xuICAgIHB1YmxpYyBkYXRhRnJlcXVlbmN5OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBBIEtleSBNYW5hZ2VtZW50IFNlcnZpY2UgKEtNUykga2V5IGFuZCB0aGUgSWRlbnRpdHkgYW5kIEFjY2VzcyBNYW5hZ2VtZW50IChJQU0pIHJvbGUgdGhhdCBBbWF6b24gRm9yZWNhc3QgY2FuIGFzc3VtZSB0byBhY2Nlc3MgdGhlIGtleS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1lbmNyeXB0aW9uY29uZmlnXG4gICAgICovXG4gICAgcHVibGljIGVuY3J5cHRpb25Db25maWc6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGlzIHJlc291cmNlLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVGFnXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yZXNvdXJjZS10YWdzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXQuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC10YWdzXG4gICAgICovXG4gICAgcHVibGljIHRhZ3M6IENmbkRhdGFzZXQuVGFnc0l0ZW1zUHJvcGVydHlbXSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpGb3JlY2FzdDo6RGF0YXNldGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkRhdGFzZXRQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuRGF0YXNldC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2RhdGFzZXROYW1lJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdkYXRhc2V0VHlwZScsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnZG9tYWluJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdzY2hlbWEnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyQXJuID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMuZGF0YXNldE5hbWUgPSBwcm9wcy5kYXRhc2V0TmFtZTtcbiAgICAgICAgdGhpcy5kYXRhc2V0VHlwZSA9IHByb3BzLmRhdGFzZXRUeXBlO1xuICAgICAgICB0aGlzLmRvbWFpbiA9IHByb3BzLmRvbWFpbjtcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBwcm9wcy5zY2hlbWE7XG4gICAgICAgIHRoaXMuZGF0YUZyZXF1ZW5jeSA9IHByb3BzLmRhdGFGcmVxdWVuY3k7XG4gICAgICAgIHRoaXMuZW5jcnlwdGlvbkNvbmZpZyA9IHByb3BzLmVuY3J5cHRpb25Db25maWc7XG4gICAgICAgIHRoaXMudGFncyA9IHByb3BzLnRhZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5EYXRhc2V0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhc2V0TmFtZTogdGhpcy5kYXRhc2V0TmFtZSxcbiAgICAgICAgICAgIGRhdGFzZXRUeXBlOiB0aGlzLmRhdGFzZXRUeXBlLFxuICAgICAgICAgICAgZG9tYWluOiB0aGlzLmRvbWFpbixcbiAgICAgICAgICAgIHNjaGVtYTogdGhpcy5zY2hlbWEsXG4gICAgICAgICAgICBkYXRhRnJlcXVlbmN5OiB0aGlzLmRhdGFGcmVxdWVuY3ksXG4gICAgICAgICAgICBlbmNyeXB0aW9uQ29uZmlnOiB0aGlzLmVuY3J5cHRpb25Db25maWcsXG4gICAgICAgICAgICB0YWdzOiB0aGlzLnRhZ3MsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuRGF0YXNldFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkRhdGFzZXQge1xuICAgIC8qKlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAc3RydWN0XG4gICAgICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1mb3JlY2FzdC1kYXRhc2V0LWF0dHJpYnV0ZXNpdGVtcy5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBBdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRGF0YXNldC5BdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eS5BdHRyaWJ1dGVOYW1lYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWZvcmVjYXN0LWRhdGFzZXQtYXR0cmlidXRlc2l0ZW1zLmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtYXR0cmlidXRlc2l0ZW1zLWF0dHJpYnV0ZW5hbWVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRGF0YXNldC5BdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eS5BdHRyaWJ1dGVUeXBlYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWZvcmVjYXN0LWRhdGFzZXQtYXR0cmlidXRlc2l0ZW1zLmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtYXR0cmlidXRlc2l0ZW1zLWF0dHJpYnV0ZXR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGF0dHJpYnV0ZVR5cGU/OiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEF0dHJpYnV0ZXNJdGVtc1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5EYXRhc2V0X0F0dHJpYnV0ZXNJdGVtc1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXR0cmlidXRlTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hdHRyaWJ1dGVOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdHRyaWJ1dGVUeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmF0dHJpYnV0ZVR5cGUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQXR0cmlidXRlc0l0ZW1zUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkZvcmVjYXN0OjpEYXRhc2V0LkF0dHJpYnV0ZXNJdGVtc2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQXR0cmlidXRlc0l0ZW1zUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkZvcmVjYXN0OjpEYXRhc2V0LkF0dHJpYnV0ZXNJdGVtc2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5EYXRhc2V0QXR0cmlidXRlc0l0ZW1zUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkRhdGFzZXRfQXR0cmlidXRlc0l0ZW1zUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEF0dHJpYnV0ZU5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXR0cmlidXRlTmFtZSksXG4gICAgICAgIEF0dHJpYnV0ZVR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXR0cmlidXRlVHlwZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkRhdGFzZXRBdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkRhdGFzZXQuQXR0cmlidXRlc0l0ZW1zUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuRGF0YXNldC5BdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eT4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2F0dHJpYnV0ZU5hbWUnLCAnQXR0cmlidXRlTmFtZScsIHByb3BlcnRpZXMuQXR0cmlidXRlTmFtZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5BdHRyaWJ1dGVOYW1lKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdhdHRyaWJ1dGVUeXBlJywgJ0F0dHJpYnV0ZVR5cGUnLCBwcm9wZXJ0aWVzLkF0dHJpYnV0ZVR5cGUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQXR0cmlidXRlVHlwZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkRhdGFzZXQge1xuICAgIC8qKlxuICAgICAqIEFuIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlIChLTVMpIGtleSBhbmQgYW4gQVdTIElkZW50aXR5IGFuZCBBY2Nlc3MgTWFuYWdlbWVudCAoSUFNKSByb2xlIHRoYXQgQW1hem9uIEZvcmVjYXN0IGNhbiBhc3N1bWUgdG8gYWNjZXNzIHRoZSBrZXkuIFlvdSBjYW4gc3BlY2lmeSB0aGlzIG9wdGlvbmFsIG9iamVjdCBpbiB0aGUgYENyZWF0ZURhdGFzZXRgIGFuZCBgQ3JlYXRlUHJlZGljdG9yYCByZXF1ZXN0cy5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWZvcmVjYXN0LWRhdGFzZXQtZW5jcnlwdGlvbmNvbmZpZy5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBLTVMga2V5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWZvcmVjYXN0LWRhdGFzZXQtZW5jcnlwdGlvbmNvbmZpZy5odG1sI2Nmbi1mb3JlY2FzdC1kYXRhc2V0LWVuY3J5cHRpb25jb25maWcta21za2V5YXJuXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBrbXNLZXlBcm4/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgQVJOIG9mIHRoZSBJQU0gcm9sZSB0aGF0IEFtYXpvbiBGb3JlY2FzdCBjYW4gYXNzdW1lIHRvIGFjY2VzcyB0aGUgQVdTIEtNUyBrZXkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFBhc3NpbmcgYSByb2xlIGFjcm9zcyBBV1MgYWNjb3VudHMgaXMgbm90IGFsbG93ZWQuIElmIHlvdSBwYXNzIGEgcm9sZSB0aGF0IGlzbid0IGluIHlvdXIgYWNjb3VudCwgeW91IGdldCBhbiBgSW52YWxpZElucHV0RXhjZXB0aW9uYCBlcnJvci5cbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1mb3JlY2FzdC1kYXRhc2V0LWVuY3J5cHRpb25jb25maWcuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC1lbmNyeXB0aW9uY29uZmlnLXJvbGVhcm5cbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHJvbGVBcm4/OiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEVuY3J5cHRpb25Db25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkRhdGFzZXRfRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna21zS2V5QXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmttc0tleUFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncm9sZUFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yb2xlQXJuKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkVuY3J5cHRpb25Db25maWdQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXQuRW5jcnlwdGlvbkNvbmZpZ2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpGb3JlY2FzdDo6RGF0YXNldC5FbmNyeXB0aW9uQ29uZmlnYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkRhdGFzZXRFbmNyeXB0aW9uQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkRhdGFzZXRfRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBLbXNLZXlBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua21zS2V5QXJuKSxcbiAgICAgICAgUm9sZUFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yb2xlQXJuKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuRGF0YXNldEVuY3J5cHRpb25Db25maWdQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkRhdGFzZXQuRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkRhdGFzZXQuRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgna21zS2V5QXJuJywgJ0ttc0tleUFybicsIHByb3BlcnRpZXMuS21zS2V5QXJuICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkttc0tleUFybikgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgncm9sZUFybicsICdSb2xlQXJuJywgcHJvcGVydGllcy5Sb2xlQXJuICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLlJvbGVBcm4pIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5EYXRhc2V0IHtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHRoZSBmaWVsZHMgb2YgYSBkYXRhc2V0LlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZm9yZWNhc3QtZGF0YXNldC1zY2hlbWEuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2NoZW1hUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQW4gYXJyYXkgb2YgYXR0cmlidXRlcyBzcGVjaWZ5aW5nIHRoZSBuYW1lIGFuZCB0eXBlIG9mIGVhY2ggZmllbGQgaW4gYSBkYXRhc2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWZvcmVjYXN0LWRhdGFzZXQtc2NoZW1hLmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXQtc2NoZW1hLWF0dHJpYnV0ZXNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGF0dHJpYnV0ZXM/OiBBcnJheTxDZm5EYXRhc2V0LkF0dHJpYnV0ZXNJdGVtc1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgU2NoZW1hUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFNjaGVtYVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkRhdGFzZXRfU2NoZW1hUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdHRyaWJ1dGVzJywgY2RrLmxpc3RWYWxpZGF0b3IoQ2ZuRGF0YXNldF9BdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuYXR0cmlidXRlcykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJTY2hlbWFQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXQuU2NoZW1hYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTY2hlbWFQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXQuU2NoZW1hYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkRhdGFzZXRTY2hlbWFQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRGF0YXNldF9TY2hlbWFQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQXR0cmlidXRlczogY2RrLmxpc3RNYXBwZXIoY2ZuRGF0YXNldEF0dHJpYnV0ZXNJdGVtc1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5hdHRyaWJ1dGVzKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuRGF0YXNldFNjaGVtYVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuRGF0YXNldC5TY2hlbWFQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZT4ge1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5EYXRhc2V0LlNjaGVtYVByb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnYXR0cmlidXRlcycsICdBdHRyaWJ1dGVzJywgcHJvcGVydGllcy5BdHRyaWJ1dGVzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmbkRhdGFzZXRBdHRyaWJ1dGVzSXRlbXNQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5BdHRyaWJ1dGVzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRGF0YXNldCB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWZvcmVjYXN0LWRhdGFzZXQtdGFnc2l0ZW1zLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFRhZ3NJdGVtc1Byb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5EYXRhc2V0LlRhZ3NJdGVtc1Byb3BlcnR5LktleWBcbiAgICAgICAgICpcbiAgICAgICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1mb3JlY2FzdC1kYXRhc2V0LXRhZ3NpdGVtcy5odG1sI2Nmbi1mb3JlY2FzdC1kYXRhc2V0LXRhZ3NpdGVtcy1rZXlcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IGtleTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkRhdGFzZXQuVGFnc0l0ZW1zUHJvcGVydHkuVmFsdWVgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZm9yZWNhc3QtZGF0YXNldC10YWdzaXRlbXMuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldC10YWdzaXRlbXMtdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYFRhZ3NJdGVtc1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBUYWdzSXRlbXNQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5EYXRhc2V0X1RhZ3NJdGVtc1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZXJyb3JzLmNvbGxlY3QobmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0KCdFeHBlY3RlZCBhbiBvYmplY3QsIGJ1dCByZWNlaXZlZDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpKSk7XG4gICAgfVxuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmFsdWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudmFsdWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZhbHVlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnZhbHVlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlRhZ3NJdGVtc1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpGb3JlY2FzdDo6RGF0YXNldC5UYWdzSXRlbXNgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFRhZ3NJdGVtc1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpGb3JlY2FzdDo6RGF0YXNldC5UYWdzSXRlbXNgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRGF0YXNldFRhZ3NJdGVtc1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5EYXRhc2V0X1RhZ3NJdGVtc1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBLZXk6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua2V5KSxcbiAgICAgICAgVmFsdWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudmFsdWUpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5EYXRhc2V0VGFnc0l0ZW1zUHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5EYXRhc2V0LlRhZ3NJdGVtc1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmbkRhdGFzZXQuVGFnc0l0ZW1zUHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdrZXknLCAnS2V5JywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5LZXkpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ZhbHVlJywgJ1ZhbHVlJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5WYWx1ZSkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkRhdGFzZXRHcm91cGBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZm9yZWNhc3QtZGF0YXNldGdyb3VwLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5EYXRhc2V0R3JvdXBQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZGF0YXNldCBncm91cC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXRncm91cC5odG1sI2Nmbi1mb3JlY2FzdC1kYXRhc2V0Z3JvdXAtZGF0YXNldGdyb3VwbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRhdGFzZXRHcm91cE5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkb21haW4gYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRhc2V0IGdyb3VwLiBXaGVuIHlvdSBhZGQgYSBkYXRhc2V0IHRvIGEgZGF0YXNldCBncm91cCwgdGhpcyB2YWx1ZSBhbmQgdGhlIHZhbHVlIHNwZWNpZmllZCBmb3IgdGhlIGBEb21haW5gIHBhcmFtZXRlciBvZiB0aGUgW0NyZWF0ZURhdGFzZXRdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9mb3JlY2FzdC9sYXRlc3QvZGcvQVBJX0NyZWF0ZURhdGFzZXQuaHRtbCkgb3BlcmF0aW9uIG11c3QgbWF0Y2guXG4gICAgICpcbiAgICAgKiBUaGUgYERvbWFpbmAgYW5kIGBEYXRhc2V0VHlwZWAgdGhhdCB5b3UgY2hvb3NlIGRldGVybWluZSB0aGUgZmllbGRzIHRoYXQgbXVzdCBiZSBwcmVzZW50IGluIHRyYWluaW5nIGRhdGEgdGhhdCB5b3UgaW1wb3J0IHRvIGEgZGF0YXNldC4gRm9yIGV4YW1wbGUsIGlmIHlvdSBjaG9vc2UgdGhlIGBSRVRBSUxgIGRvbWFpbiBhbmQgYFRBUkdFVF9USU1FX1NFUklFU2AgYXMgdGhlIGBEYXRhc2V0VHlwZWAgLCBBbWF6b24gRm9yZWNhc3QgcmVxdWlyZXMgdGhhdCBgaXRlbV9pZGAgLCBgdGltZXN0YW1wYCAsIGFuZCBgZGVtYW5kYCBmaWVsZHMgYXJlIHByZXNlbnQgaW4geW91ciBkYXRhLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtEYXRhc2V0IGdyb3Vwc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2ZvcmVjYXN0L2xhdGVzdC9kZy9ob3dpdHdvcmtzLWRhdGFzZXRzLWdyb3Vwcy5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Z3JvdXAuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldGdyb3VwLWRvbWFpblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRvbWFpbjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgQW1hem9uIFJlc291cmNlIE5hbWVzIChBUk5zKSBvZiB0aGUgZGF0YXNldHMgdGhhdCB5b3Ugd2FudCB0byBpbmNsdWRlIGluIHRoZSBkYXRhc2V0IGdyb3VwLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZm9yZWNhc3QtZGF0YXNldGdyb3VwLmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXRncm91cC1kYXRhc2V0YXJuc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGRhdGFzZXRBcm5zPzogc3RyaW5nW107XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYXBwbHkgdG8gdGhpcyByZXNvdXJjZS5cbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1RhZ10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcmVzb3VyY2UtdGFncy5odG1sKSAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Z3JvdXAuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldGdyb3VwLXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogY2RrLkNmblRhZ1tdO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkRhdGFzZXRHcm91cFByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5EYXRhc2V0R3JvdXBQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5EYXRhc2V0R3JvdXBQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RhdGFzZXRBcm5zJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5kYXRhc2V0QXJucykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGF0YXNldEdyb3VwTmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kYXRhc2V0R3JvdXBOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhc2V0R3JvdXBOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRhdGFzZXRHcm91cE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RvbWFpbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5kb21haW4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RvbWFpbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kb21haW4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVDZm5UYWcpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuRGF0YXNldEdyb3VwUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkZvcmVjYXN0OjpEYXRhc2V0R3JvdXBgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRhdGFzZXRHcm91cFByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpGb3JlY2FzdDo6RGF0YXNldEdyb3VwYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkRhdGFzZXRHcm91cFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5EYXRhc2V0R3JvdXBQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGF0YXNldEdyb3VwTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kYXRhc2V0R3JvdXBOYW1lKSxcbiAgICAgICAgRG9tYWluOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRvbWFpbiksXG4gICAgICAgIERhdGFzZXRBcm5zOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5kYXRhc2V0QXJucyksXG4gICAgICAgIFRhZ3M6IGNkay5saXN0TWFwcGVyKGNkay5jZm5UYWdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnRhZ3MpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5EYXRhc2V0R3JvdXBQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkRhdGFzZXRHcm91cFByb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5EYXRhc2V0R3JvdXBQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2RhdGFzZXRHcm91cE5hbWUnLCAnRGF0YXNldEdyb3VwTmFtZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRGF0YXNldEdyb3VwTmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZG9tYWluJywgJ0RvbWFpbicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRG9tYWluKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdkYXRhc2V0QXJucycsICdEYXRhc2V0QXJucycsIHByb3BlcnRpZXMuRGF0YXNldEFybnMgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nQXJyYXkocHJvcGVydGllcy5EYXRhc2V0QXJucykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGFncycsICdUYWdzJywgcHJvcGVydGllcy5UYWdzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0Q2ZuVGFnKShwcm9wZXJ0aWVzLlRhZ3MpIDogdW5kZWZpbmVkIGFzIGFueSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpGb3JlY2FzdDo6RGF0YXNldEdyb3VwYFxuICpcbiAqIENyZWF0ZXMgYSBkYXRhc2V0IGdyb3VwLCB3aGljaCBob2xkcyBhIGNvbGxlY3Rpb24gb2YgcmVsYXRlZCBkYXRhc2V0cy4gWW91IGNhbiBhZGQgZGF0YXNldHMgdG8gdGhlIGRhdGFzZXQgZ3JvdXAgd2hlbiB5b3UgY3JlYXRlIHRoZSBkYXRhc2V0IGdyb3VwLCBvciBsYXRlciBieSB1c2luZyB0aGUgW1VwZGF0ZURhdGFzZXRHcm91cF0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2ZvcmVjYXN0L2xhdGVzdC9kZy9BUElfVXBkYXRlRGF0YXNldEdyb3VwLmh0bWwpIG9wZXJhdGlvbi5cbiAqXG4gKiBBZnRlciBjcmVhdGluZyBhIGRhdGFzZXQgZ3JvdXAgYW5kIGFkZGluZyBkYXRhc2V0cywgeW91IHVzZSB0aGUgZGF0YXNldCBncm91cCB3aGVuIHlvdSBjcmVhdGUgYSBwcmVkaWN0b3IuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0RhdGFzZXQgZ3JvdXBzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZm9yZWNhc3QvbGF0ZXN0L2RnL2hvd2l0d29ya3MtZGF0YXNldHMtZ3JvdXBzLmh0bWwpIC5cbiAqXG4gKiBUbyBnZXQgYSBsaXN0IG9mIGFsbCB5b3VyIGRhdGFzZXRzIGdyb3VwcywgdXNlIHRoZSBbTGlzdERhdGFzZXRHcm91cHNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9mb3JlY2FzdC9sYXRlc3QvZGcvQVBJX0xpc3REYXRhc2V0R3JvdXBzLmh0bWwpIG9wZXJhdGlvbi5cbiAqXG4gKiA+IFRoZSBgU3RhdHVzYCBvZiBhIGRhdGFzZXQgZ3JvdXAgbXVzdCBiZSBgQUNUSVZFYCBiZWZvcmUgeW91IGNhbiB1c2UgdGhlIGRhdGFzZXQgZ3JvdXAgdG8gY3JlYXRlIGEgcHJlZGljdG9yLiBUbyBnZXQgdGhlIHN0YXR1cywgdXNlIHRoZSBbRGVzY3JpYmVEYXRhc2V0R3JvdXBdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9mb3JlY2FzdC9sYXRlc3QvZGcvQVBJX0Rlc2NyaWJlRGF0YXNldEdyb3VwLmh0bWwpIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkZvcmVjYXN0OjpEYXRhc2V0R3JvdXBcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Z3JvdXAuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuRGF0YXNldEdyb3VwIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXRHcm91cFwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbkRhdGFzZXRHcm91cCB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuRGF0YXNldEdyb3VwUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkRhdGFzZXRHcm91cChzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGRhdGFzZXQgZ3JvdXAuXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIERhdGFzZXRHcm91cEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyRGF0YXNldEdyb3VwQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZGF0YXNldCBncm91cC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXRncm91cC5odG1sI2Nmbi1mb3JlY2FzdC1kYXRhc2V0Z3JvdXAtZGF0YXNldGdyb3VwbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBkYXRhc2V0R3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZG9tYWluIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0YXNldCBncm91cC4gV2hlbiB5b3UgYWRkIGEgZGF0YXNldCB0byBhIGRhdGFzZXQgZ3JvdXAsIHRoaXMgdmFsdWUgYW5kIHRoZSB2YWx1ZSBzcGVjaWZpZWQgZm9yIHRoZSBgRG9tYWluYCBwYXJhbWV0ZXIgb2YgdGhlIFtDcmVhdGVEYXRhc2V0XShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZm9yZWNhc3QvbGF0ZXN0L2RnL0FQSV9DcmVhdGVEYXRhc2V0Lmh0bWwpIG9wZXJhdGlvbiBtdXN0IG1hdGNoLlxuICAgICAqXG4gICAgICogVGhlIGBEb21haW5gIGFuZCBgRGF0YXNldFR5cGVgIHRoYXQgeW91IGNob29zZSBkZXRlcm1pbmUgdGhlIGZpZWxkcyB0aGF0IG11c3QgYmUgcHJlc2VudCBpbiB0cmFpbmluZyBkYXRhIHRoYXQgeW91IGltcG9ydCB0byBhIGRhdGFzZXQuIEZvciBleGFtcGxlLCBpZiB5b3UgY2hvb3NlIHRoZSBgUkVUQUlMYCBkb21haW4gYW5kIGBUQVJHRVRfVElNRV9TRVJJRVNgIGFzIHRoZSBgRGF0YXNldFR5cGVgICwgQW1hem9uIEZvcmVjYXN0IHJlcXVpcmVzIHRoYXQgYGl0ZW1faWRgICwgYHRpbWVzdGFtcGAgLCBhbmQgYGRlbWFuZGAgZmllbGRzIGFyZSBwcmVzZW50IGluIHlvdXIgZGF0YS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbRGF0YXNldCBncm91cHNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9mb3JlY2FzdC9sYXRlc3QvZGcvaG93aXR3b3Jrcy1kYXRhc2V0cy1ncm91cHMuaHRtbCkgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZm9yZWNhc3QtZGF0YXNldGdyb3VwLmh0bWwjY2ZuLWZvcmVjYXN0LWRhdGFzZXRncm91cC1kb21haW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZG9tYWluOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBBbWF6b24gUmVzb3VyY2UgTmFtZXMgKEFSTnMpIG9mIHRoZSBkYXRhc2V0cyB0aGF0IHlvdSB3YW50IHRvIGluY2x1ZGUgaW4gdGhlIGRhdGFzZXQgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1mb3JlY2FzdC1kYXRhc2V0Z3JvdXAuaHRtbCNjZm4tZm9yZWNhc3QtZGF0YXNldGdyb3VwLWRhdGFzZXRhcm5zXG4gICAgICovXG4gICAgcHVibGljIGRhdGFzZXRBcm5zOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGtleS12YWx1ZSBwYWlycyB0byBhcHBseSB0byB0aGlzIHJlc291cmNlLlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVGFnXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1yZXNvdXJjZS10YWdzLmh0bWwpIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWZvcmVjYXN0LWRhdGFzZXRncm91cC5odG1sI2Nmbi1mb3JlY2FzdC1kYXRhc2V0Z3JvdXAtdGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpGb3JlY2FzdDo6RGF0YXNldEdyb3VwYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuRGF0YXNldEdyb3VwUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkRhdGFzZXRHcm91cC5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2RhdGFzZXRHcm91cE5hbWUnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2RvbWFpbicsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJEYXRhc2V0R3JvdXBBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0RhdGFzZXRHcm91cEFybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5kYXRhc2V0R3JvdXBOYW1lID0gcHJvcHMuZGF0YXNldEdyb3VwTmFtZTtcbiAgICAgICAgdGhpcy5kb21haW4gPSBwcm9wcy5kb21haW47XG4gICAgICAgIHRoaXMuZGF0YXNldEFybnMgPSBwcm9wcy5kYXRhc2V0QXJucztcbiAgICAgICAgdGhpcy50YWdzID0gbmV3IGNkay5UYWdNYW5hZ2VyKGNkay5UYWdUeXBlLlNUQU5EQVJELCBcIkFXUzo6Rm9yZWNhc3Q6OkRhdGFzZXRHcm91cFwiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuRGF0YXNldEdyb3VwLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhc2V0R3JvdXBOYW1lOiB0aGlzLmRhdGFzZXRHcm91cE5hbWUsXG4gICAgICAgICAgICBkb21haW46IHRoaXMuZG9tYWluLFxuICAgICAgICAgICAgZGF0YXNldEFybnM6IHRoaXMuZGF0YXNldEFybnMsXG4gICAgICAgICAgICB0YWdzOiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkRhdGFzZXRHcm91cFByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gICAgfVxufVxuIl19