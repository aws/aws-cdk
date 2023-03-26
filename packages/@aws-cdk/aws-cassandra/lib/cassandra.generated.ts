// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:22.683Z","fingerprint":"nNuK+zPOFxTEksLeLNoZIsJt9qVKgJucbZH57uR1lsY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnKeyspace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html
 */
export interface CfnKeyspaceProps {

    /**
     * The name of the keyspace to be created. The keyspace name is case sensitive. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the keyspace name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * *Length constraints:* Minimum length of 3. Maximum length of 255.
     *
     * *Pattern:* `^[a-zA-Z0-9][a-zA-Z0-9_]{1,47}$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html#cfn-cassandra-keyspace-keyspacename
     */
    readonly keyspaceName?: string;

    /**
     * A list of key-value pair tags to be attached to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html#cfn-cassandra-keyspace-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnKeyspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnKeyspaceProps`
 *
 * @returns the result of the validation.
 */
function CfnKeyspacePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyspaceName', cdk.validateString)(properties.keyspaceName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnKeyspaceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Cassandra::Keyspace` resource
 *
 * @param properties - the TypeScript properties of a `CfnKeyspaceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Cassandra::Keyspace` resource.
 */
// @ts-ignore TS6133
function cfnKeyspacePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnKeyspacePropsValidator(properties).assertSuccess();
    return {
        KeyspaceName: cdk.stringToCloudFormation(properties.keyspaceName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnKeyspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnKeyspaceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnKeyspaceProps>();
    ret.addPropertyResult('keyspaceName', 'KeyspaceName', properties.KeyspaceName != null ? cfn_parse.FromCloudFormation.getString(properties.KeyspaceName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Cassandra::Keyspace`
 *
 * The `AWS::Cassandra::Keyspace` resource allows you to create a new keyspace in Amazon Keyspaces (for Apache Cassandra). For more information, see [Create a keyspace and a table](https://docs.aws.amazon.com/keyspaces/latest/devguide/getting-started.ddl.html) in the *Amazon Keyspaces Developer Guide* .
 *
 * @cloudformationResource AWS::Cassandra::Keyspace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html
 */
export class CfnKeyspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cassandra::Keyspace";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnKeyspace {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnKeyspacePropsFromCloudFormation(resourceProperties);
        const ret = new CfnKeyspace(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the keyspace to be created. The keyspace name is case sensitive. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the keyspace name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * *Length constraints:* Minimum length of 3. Maximum length of 255.
     *
     * *Pattern:* `^[a-zA-Z0-9][a-zA-Z0-9_]{1,47}$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html#cfn-cassandra-keyspace-keyspacename
     */
    public keyspaceName: string | undefined;

    /**
     * A list of key-value pair tags to be attached to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-keyspace.html#cfn-cassandra-keyspace-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Cassandra::Keyspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnKeyspaceProps = {}) {
        super(scope, id, { type: CfnKeyspace.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.keyspaceName = props.keyspaceName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Cassandra::Keyspace", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnKeyspace.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            keyspaceName: this.keyspaceName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnKeyspacePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnTable`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html
 */
export interface CfnTableProps {

    /**
     * The name of the keyspace in which to create the table. The keyspace must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-keyspacename
     */
    readonly keyspaceName: string;

    /**
     * One or more columns that uniquely identify every row in the table. Every table must have a partition key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-partitionkeycolumns
     */
    readonly partitionKeyColumns: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The billing mode for the table, which determines how you'll be charged for reads and writes:
     *
     * - *On-demand mode* (default) - You pay based on the actual reads and writes your application performs.
     * - *Provisioned mode* - Lets you specify the number of reads and writes per second that you need for your application.
     *
     * If you don't specify a value for this property, then the table will use on-demand mode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-billingmode
     */
    readonly billingMode?: CfnTable.BillingModeProperty | cdk.IResolvable;

    /**
     * One or more columns that determine how the table data is sorted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-clusteringkeycolumns
     */
    readonly clusteringKeyColumns?: Array<CfnTable.ClusteringKeyColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The default Time To Live (TTL) value for all rows in a table in seconds. The maximum configurable value is 630,720,000 seconds, which is the equivalent of 20 years. By default, the TTL value for a table is 0, which means data does not expire.
     *
     * For more information, see [Setting the default TTL value for a table](https://docs.aws.amazon.com/keyspaces/latest/devguide/TTL-how-it-works.html#ttl-howitworks_default_ttl) in the *Amazon Keyspaces Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-defaulttimetolive
     */
    readonly defaultTimeToLive?: number;

    /**
     * The encryption at rest options for the table.
     *
     * - *AWS owned key* (default) - The key is owned by Amazon Keyspaces.
     * - *Customer managed key* - The key is stored in your account and is created, owned, and managed by you.
     *
     * > If you choose encryption with a customer managed key, you must specify a valid customer managed KMS key with permissions granted to Amazon Keyspaces.
     *
     * For more information, see [Encryption at rest in Amazon Keyspaces](https://docs.aws.amazon.com/keyspaces/latest/devguide/EncryptionAtRest.html) in the *Amazon Keyspaces Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-encryptionspecification
     */
    readonly encryptionSpecification?: CfnTable.EncryptionSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies if point-in-time recovery is enabled or disabled for the table. The options are `PointInTimeRecoveryEnabled=true` and `PointInTimeRecoveryEnabled=false` . If not specified, the default is `PointInTimeRecoveryEnabled=false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-pointintimerecoveryenabled
     */
    readonly pointInTimeRecoveryEnabled?: boolean | cdk.IResolvable;

    /**
     * One or more columns that are not part of the primary key - that is, columns that are *not* defined as partition key columns or clustering key columns.
     *
     * You can add regular columns to existing tables by adding them to the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-regularcolumns
     */
    readonly regularColumns?: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the table to be created. The table name is case sensitive. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the table name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * *Length constraints:* Minimum length of 3. Maximum length of 255.
     *
     * *Pattern:* `^[a-zA-Z0-9][a-zA-Z0-9_]{1,47}$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-tablename
     */
    readonly tableName?: string;

    /**
     * A list of key-value pair tags to be attached to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the result of the validation.
 */
function CfnTablePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('billingMode', CfnTable_BillingModePropertyValidator)(properties.billingMode));
    errors.collect(cdk.propertyValidator('clusteringKeyColumns', cdk.listValidator(CfnTable_ClusteringKeyColumnPropertyValidator))(properties.clusteringKeyColumns));
    errors.collect(cdk.propertyValidator('defaultTimeToLive', cdk.validateNumber)(properties.defaultTimeToLive));
    errors.collect(cdk.propertyValidator('encryptionSpecification', CfnTable_EncryptionSpecificationPropertyValidator)(properties.encryptionSpecification));
    errors.collect(cdk.propertyValidator('keyspaceName', cdk.requiredValidator)(properties.keyspaceName));
    errors.collect(cdk.propertyValidator('keyspaceName', cdk.validateString)(properties.keyspaceName));
    errors.collect(cdk.propertyValidator('partitionKeyColumns', cdk.requiredValidator)(properties.partitionKeyColumns));
    errors.collect(cdk.propertyValidator('partitionKeyColumns', cdk.listValidator(CfnTable_ColumnPropertyValidator))(properties.partitionKeyColumns));
    errors.collect(cdk.propertyValidator('pointInTimeRecoveryEnabled', cdk.validateBoolean)(properties.pointInTimeRecoveryEnabled));
    errors.collect(cdk.propertyValidator('regularColumns', cdk.listValidator(CfnTable_ColumnPropertyValidator))(properties.regularColumns));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnTableProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Cassandra::Table` resource
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Cassandra::Table` resource.
 */
// @ts-ignore TS6133
function cfnTablePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTablePropsValidator(properties).assertSuccess();
    return {
        KeyspaceName: cdk.stringToCloudFormation(properties.keyspaceName),
        PartitionKeyColumns: cdk.listMapper(cfnTableColumnPropertyToCloudFormation)(properties.partitionKeyColumns),
        BillingMode: cfnTableBillingModePropertyToCloudFormation(properties.billingMode),
        ClusteringKeyColumns: cdk.listMapper(cfnTableClusteringKeyColumnPropertyToCloudFormation)(properties.clusteringKeyColumns),
        DefaultTimeToLive: cdk.numberToCloudFormation(properties.defaultTimeToLive),
        EncryptionSpecification: cfnTableEncryptionSpecificationPropertyToCloudFormation(properties.encryptionSpecification),
        PointInTimeRecoveryEnabled: cdk.booleanToCloudFormation(properties.pointInTimeRecoveryEnabled),
        RegularColumns: cdk.listMapper(cfnTableColumnPropertyToCloudFormation)(properties.regularColumns),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTableProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTableProps>();
    ret.addPropertyResult('keyspaceName', 'KeyspaceName', cfn_parse.FromCloudFormation.getString(properties.KeyspaceName));
    ret.addPropertyResult('partitionKeyColumns', 'PartitionKeyColumns', cfn_parse.FromCloudFormation.getArray(CfnTableColumnPropertyFromCloudFormation)(properties.PartitionKeyColumns));
    ret.addPropertyResult('billingMode', 'BillingMode', properties.BillingMode != null ? CfnTableBillingModePropertyFromCloudFormation(properties.BillingMode) : undefined);
    ret.addPropertyResult('clusteringKeyColumns', 'ClusteringKeyColumns', properties.ClusteringKeyColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnTableClusteringKeyColumnPropertyFromCloudFormation)(properties.ClusteringKeyColumns) : undefined);
    ret.addPropertyResult('defaultTimeToLive', 'DefaultTimeToLive', properties.DefaultTimeToLive != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTimeToLive) : undefined);
    ret.addPropertyResult('encryptionSpecification', 'EncryptionSpecification', properties.EncryptionSpecification != null ? CfnTableEncryptionSpecificationPropertyFromCloudFormation(properties.EncryptionSpecification) : undefined);
    ret.addPropertyResult('pointInTimeRecoveryEnabled', 'PointInTimeRecoveryEnabled', properties.PointInTimeRecoveryEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PointInTimeRecoveryEnabled) : undefined);
    ret.addPropertyResult('regularColumns', 'RegularColumns', properties.RegularColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnTableColumnPropertyFromCloudFormation)(properties.RegularColumns) : undefined);
    ret.addPropertyResult('tableName', 'TableName', properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Cassandra::Table`
 *
 * The `AWS::Cassandra::Table` resource allows you to create a new table in Amazon Keyspaces (for Apache Cassandra). For more information, see [Create a keyspace and a table](https://docs.aws.amazon.com/keyspaces/latest/devguide/getting-started.ddl.html) in the *Amazon Keyspaces Developer Guide* .
 *
 * @cloudformationResource AWS::Cassandra::Table
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html
 */
export class CfnTable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cassandra::Table";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTable {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTablePropsFromCloudFormation(resourceProperties);
        const ret = new CfnTable(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the keyspace in which to create the table. The keyspace must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-keyspacename
     */
    public keyspaceName: string;

    /**
     * One or more columns that uniquely identify every row in the table. Every table must have a partition key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-partitionkeycolumns
     */
    public partitionKeyColumns: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The billing mode for the table, which determines how you'll be charged for reads and writes:
     *
     * - *On-demand mode* (default) - You pay based on the actual reads and writes your application performs.
     * - *Provisioned mode* - Lets you specify the number of reads and writes per second that you need for your application.
     *
     * If you don't specify a value for this property, then the table will use on-demand mode.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-billingmode
     */
    public billingMode: CfnTable.BillingModeProperty | cdk.IResolvable | undefined;

    /**
     * One or more columns that determine how the table data is sorted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-clusteringkeycolumns
     */
    public clusteringKeyColumns: Array<CfnTable.ClusteringKeyColumnProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The default Time To Live (TTL) value for all rows in a table in seconds. The maximum configurable value is 630,720,000 seconds, which is the equivalent of 20 years. By default, the TTL value for a table is 0, which means data does not expire.
     *
     * For more information, see [Setting the default TTL value for a table](https://docs.aws.amazon.com/keyspaces/latest/devguide/TTL-how-it-works.html#ttl-howitworks_default_ttl) in the *Amazon Keyspaces Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-defaulttimetolive
     */
    public defaultTimeToLive: number | undefined;

    /**
     * The encryption at rest options for the table.
     *
     * - *AWS owned key* (default) - The key is owned by Amazon Keyspaces.
     * - *Customer managed key* - The key is stored in your account and is created, owned, and managed by you.
     *
     * > If you choose encryption with a customer managed key, you must specify a valid customer managed KMS key with permissions granted to Amazon Keyspaces.
     *
     * For more information, see [Encryption at rest in Amazon Keyspaces](https://docs.aws.amazon.com/keyspaces/latest/devguide/EncryptionAtRest.html) in the *Amazon Keyspaces Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-encryptionspecification
     */
    public encryptionSpecification: CfnTable.EncryptionSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * Specifies if point-in-time recovery is enabled or disabled for the table. The options are `PointInTimeRecoveryEnabled=true` and `PointInTimeRecoveryEnabled=false` . If not specified, the default is `PointInTimeRecoveryEnabled=false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-pointintimerecoveryenabled
     */
    public pointInTimeRecoveryEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * One or more columns that are not part of the primary key - that is, columns that are *not* defined as partition key columns or clustering key columns.
     *
     * You can add regular columns to existing tables by adding them to the template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-regularcolumns
     */
    public regularColumns: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the table to be created. The table name is case sensitive. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the table name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * *Length constraints:* Minimum length of 3. Maximum length of 255.
     *
     * *Pattern:* `^[a-zA-Z0-9][a-zA-Z0-9_]{1,47}$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-tablename
     */
    public tableName: string | undefined;

    /**
     * A list of key-value pair tags to be attached to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cassandra-table.html#cfn-cassandra-table-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Cassandra::Table`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTableProps) {
        super(scope, id, { type: CfnTable.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'keyspaceName', this);
        cdk.requireProperty(props, 'partitionKeyColumns', this);

        this.keyspaceName = props.keyspaceName;
        this.partitionKeyColumns = props.partitionKeyColumns;
        this.billingMode = props.billingMode;
        this.clusteringKeyColumns = props.clusteringKeyColumns;
        this.defaultTimeToLive = props.defaultTimeToLive;
        this.encryptionSpecification = props.encryptionSpecification;
        this.pointInTimeRecoveryEnabled = props.pointInTimeRecoveryEnabled;
        this.regularColumns = props.regularColumns;
        this.tableName = props.tableName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Cassandra::Table", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTable.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            keyspaceName: this.keyspaceName,
            partitionKeyColumns: this.partitionKeyColumns,
            billingMode: this.billingMode,
            clusteringKeyColumns: this.clusteringKeyColumns,
            defaultTimeToLive: this.defaultTimeToLive,
            encryptionSpecification: this.encryptionSpecification,
            pointInTimeRecoveryEnabled: this.pointInTimeRecoveryEnabled,
            regularColumns: this.regularColumns,
            tableName: this.tableName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTablePropsToCloudFormation(props);
    }
}

export namespace CfnTable {
    /**
     * Determines the billing mode for the table - On-demand or provisioned.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-billingmode.html
     */
    export interface BillingModeProperty {
        /**
         * The billing mode for the table:
         *
         * - On-demand mode - `ON_DEMAND`
         * - Provisioned mode - `PROVISIONED`
         *
         * > If you choose `PROVISIONED` mode, then you also need to specify provisioned throughput (read and write capacity) for the table.
         *
         * Valid values: `ON_DEMAND` | `PROVISIONED`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-billingmode.html#cfn-cassandra-table-billingmode-mode
         */
        readonly mode: string;
        /**
         * The provisioned read capacity and write capacity for the table. For more information, see [Provisioned throughput capacity mode](https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html#ReadWriteCapacityMode.Provisioned) in the *Amazon Keyspaces Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-billingmode.html#cfn-cassandra-table-billingmode-provisionedthroughput
         */
        readonly provisionedThroughput?: CfnTable.ProvisionedThroughputProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BillingModeProperty`
 *
 * @param properties - the TypeScript properties of a `BillingModeProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_BillingModePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mode', cdk.requiredValidator)(properties.mode));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('provisionedThroughput', CfnTable_ProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
    return errors.wrap('supplied properties not correct for "BillingModeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Cassandra::Table.BillingMode` resource
 *
 * @param properties - the TypeScript properties of a `BillingModeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Cassandra::Table.BillingMode` resource.
 */
// @ts-ignore TS6133
function cfnTableBillingModePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_BillingModePropertyValidator(properties).assertSuccess();
    return {
        Mode: cdk.stringToCloudFormation(properties.mode),
        ProvisionedThroughput: cfnTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
    };
}

// @ts-ignore TS6133
function CfnTableBillingModePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.BillingModeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.BillingModeProperty>();
    ret.addPropertyResult('mode', 'Mode', cfn_parse.FromCloudFormation.getString(properties.Mode));
    ret.addPropertyResult('provisionedThroughput', 'ProvisionedThroughput', properties.ProvisionedThroughput != null ? CfnTableProvisionedThroughputPropertyFromCloudFormation(properties.ProvisionedThroughput) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Defines an individual column within the clustering key.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-clusteringkeycolumn.html
     */
    export interface ClusteringKeyColumnProperty {
        /**
         * The name and data type of this clustering key column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-clusteringkeycolumn.html#cfn-cassandra-table-clusteringkeycolumn-column
         */
        readonly column: CfnTable.ColumnProperty | cdk.IResolvable;
        /**
         * The order in which this column's data is stored:
         *
         * - `ASC` (default) - The column's data is stored in ascending order.
         * - `DESC` - The column's data is stored in descending order.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-clusteringkeycolumn.html#cfn-cassandra-table-clusteringkeycolumn-orderby
         */
        readonly orderBy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ClusteringKeyColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ClusteringKeyColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ClusteringKeyColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('column', cdk.requiredValidator)(properties.column));
    errors.collect(cdk.propertyValidator('column', CfnTable_ColumnPropertyValidator)(properties.column));
    errors.collect(cdk.propertyValidator('orderBy', cdk.validateString)(properties.orderBy));
    return errors.wrap('supplied properties not correct for "ClusteringKeyColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Cassandra::Table.ClusteringKeyColumn` resource
 *
 * @param properties - the TypeScript properties of a `ClusteringKeyColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Cassandra::Table.ClusteringKeyColumn` resource.
 */
// @ts-ignore TS6133
function cfnTableClusteringKeyColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_ClusteringKeyColumnPropertyValidator(properties).assertSuccess();
    return {
        Column: cfnTableColumnPropertyToCloudFormation(properties.column),
        OrderBy: cdk.stringToCloudFormation(properties.orderBy),
    };
}

// @ts-ignore TS6133
function CfnTableClusteringKeyColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ClusteringKeyColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ClusteringKeyColumnProperty>();
    ret.addPropertyResult('column', 'Column', CfnTableColumnPropertyFromCloudFormation(properties.Column));
    ret.addPropertyResult('orderBy', 'OrderBy', properties.OrderBy != null ? cfn_parse.FromCloudFormation.getString(properties.OrderBy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The name and data type of an individual column in a table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-column.html
     */
    export interface ColumnProperty {
        /**
         * The name of the column. For more information, see [Identifiers](https://docs.aws.amazon.com/keyspaces/latest/devguide/cql.elements.html#cql.elements.identifier) in the *Amazon Keyspaces Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-column.html#cfn-cassandra-table-column-columnname
         */
        readonly columnName: string;
        /**
         * The data type of the column. For more information, see [Data types](https://docs.aws.amazon.com/keyspaces/latest/devguide/cql.elements.html#cql.data-types) in the *Amazon Keyspaces Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-column.html#cfn-cassandra-table-column-columntype
         */
        readonly columnType: string;
    }
}

/**
 * Determine whether the given properties match those of a `ColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnName', cdk.requiredValidator)(properties.columnName));
    errors.collect(cdk.propertyValidator('columnName', cdk.validateString)(properties.columnName));
    errors.collect(cdk.propertyValidator('columnType', cdk.requiredValidator)(properties.columnType));
    errors.collect(cdk.propertyValidator('columnType', cdk.validateString)(properties.columnType));
    return errors.wrap('supplied properties not correct for "ColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Cassandra::Table.Column` resource
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Cassandra::Table.Column` resource.
 */
// @ts-ignore TS6133
function cfnTableColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_ColumnPropertyValidator(properties).assertSuccess();
    return {
        ColumnName: cdk.stringToCloudFormation(properties.columnName),
        ColumnType: cdk.stringToCloudFormation(properties.columnType),
    };
}

// @ts-ignore TS6133
function CfnTableColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ColumnProperty>();
    ret.addPropertyResult('columnName', 'ColumnName', cfn_parse.FromCloudFormation.getString(properties.ColumnName));
    ret.addPropertyResult('columnType', 'ColumnType', cfn_parse.FromCloudFormation.getString(properties.ColumnType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Specifies the encryption at rest option selected for the table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-encryptionspecification.html
     */
    export interface EncryptionSpecificationProperty {
        /**
         * The encryption at rest options for the table.
         *
         * - *AWS owned key* (default) - `AWS_OWNED_KMS_KEY`
         * - *Customer managed key* - `CUSTOMER_MANAGED_KMS_KEY`
         *
         * > If you choose `CUSTOMER_MANAGED_KMS_KEY` , a `kms_key_identifier` in the format of a key ARN is required.
         *
         * Valid values: `CUSTOMER_MANAGED_KMS_KEY` | `AWS_OWNED_KMS_KEY` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-encryptionspecification.html#cfn-cassandra-table-encryptionspecification-encryptiontype
         */
        readonly encryptionType: string;
        /**
         * Requires a `kms_key_identifier` in the format of a key ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-encryptionspecification.html#cfn-cassandra-table-encryptionspecification-kmskeyidentifier
         */
        readonly kmsKeyIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_EncryptionSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionType', cdk.requiredValidator)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('encryptionType', cdk.validateString)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('kmsKeyIdentifier', cdk.validateString)(properties.kmsKeyIdentifier));
    return errors.wrap('supplied properties not correct for "EncryptionSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Cassandra::Table.EncryptionSpecification` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Cassandra::Table.EncryptionSpecification` resource.
 */
// @ts-ignore TS6133
function cfnTableEncryptionSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_EncryptionSpecificationPropertyValidator(properties).assertSuccess();
    return {
        EncryptionType: cdk.stringToCloudFormation(properties.encryptionType),
        KmsKeyIdentifier: cdk.stringToCloudFormation(properties.kmsKeyIdentifier),
    };
}

// @ts-ignore TS6133
function CfnTableEncryptionSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.EncryptionSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.EncryptionSpecificationProperty>();
    ret.addPropertyResult('encryptionType', 'EncryptionType', cfn_parse.FromCloudFormation.getString(properties.EncryptionType));
    ret.addPropertyResult('kmsKeyIdentifier', 'KmsKeyIdentifier', properties.KmsKeyIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The provisioned throughput for the table, which consists of `ReadCapacityUnits` and `WriteCapacityUnits` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-provisionedthroughput.html
     */
    export interface ProvisionedThroughputProperty {
        /**
         * The amount of read capacity that's provisioned for the table. For more information, see [Read/write capacity mode](https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html) in the *Amazon Keyspaces Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-provisionedthroughput.html#cfn-cassandra-table-provisionedthroughput-readcapacityunits
         */
        readonly readCapacityUnits: number;
        /**
         * The amount of write capacity that's provisioned for the table. For more information, see [Read/write capacity mode](https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html) in the *Amazon Keyspaces Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cassandra-table-provisionedthroughput.html#cfn-cassandra-table-provisionedthroughput-writecapacityunits
         */
        readonly writeCapacityUnits: number;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisionedThroughputProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ProvisionedThroughputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('readCapacityUnits', cdk.requiredValidator)(properties.readCapacityUnits));
    errors.collect(cdk.propertyValidator('readCapacityUnits', cdk.validateNumber)(properties.readCapacityUnits));
    errors.collect(cdk.propertyValidator('writeCapacityUnits', cdk.requiredValidator)(properties.writeCapacityUnits));
    errors.collect(cdk.propertyValidator('writeCapacityUnits', cdk.validateNumber)(properties.writeCapacityUnits));
    return errors.wrap('supplied properties not correct for "ProvisionedThroughputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Cassandra::Table.ProvisionedThroughput` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Cassandra::Table.ProvisionedThroughput` resource.
 */
// @ts-ignore TS6133
function cfnTableProvisionedThroughputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_ProvisionedThroughputPropertyValidator(properties).assertSuccess();
    return {
        ReadCapacityUnits: cdk.numberToCloudFormation(properties.readCapacityUnits),
        WriteCapacityUnits: cdk.numberToCloudFormation(properties.writeCapacityUnits),
    };
}

// @ts-ignore TS6133
function CfnTableProvisionedThroughputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ProvisionedThroughputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ProvisionedThroughputProperty>();
    ret.addPropertyResult('readCapacityUnits', 'ReadCapacityUnits', cfn_parse.FromCloudFormation.getNumber(properties.ReadCapacityUnits));
    ret.addPropertyResult('writeCapacityUnits', 'WriteCapacityUnits', cfn_parse.FromCloudFormation.getNumber(properties.WriteCapacityUnits));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
