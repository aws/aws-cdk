// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:39:58.985Z","fingerprint":"s/wrwiyjxr1ZPS8ovgMfxLvtTMwZpPmnXBzq8unF5Z4="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnGlobalTable`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html
 */
export interface CfnGlobalTableProps {

    /**
     * A list of attributes that describe the key schema for the global table and indexes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-attributedefinitions
     */
    readonly attributeDefinitions: Array<CfnGlobalTable.AttributeDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the attributes that make up the primary key for the table. The attributes in the `KeySchema` property must also be defined in the `AttributeDefinitions` property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-keyschema
     */
    readonly keySchema: Array<CfnGlobalTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the list of replicas for your global table. The list must contain at least one element, the region where the stack defining the global table is deployed. For example, if you define your table in a stack deployed to us-east-1, you must have an entry in `Replicas` with the region us-east-1. You cannot remove the replica in the stack region.
     *
     * > Adding a replica might take a few minutes for an empty table, or up to several hours for large tables. If you want to add or remove a replica, we recommend submitting an `UpdateStack` operation containing only that change.
     * >
     * > If you add or delete a replica during an update, we recommend that you don't update any other resources. If your stack fails to update and is rolled back while adding a new replica, you might need to manually delete the replica.
     *
     * You can create a new global table with as many replicas as needed. You can add or remove replicas after table creation, but you can only add or remove a single replica in each update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-replicas
     */
    readonly replicas: Array<CfnGlobalTable.ReplicaSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies how you are charged for read and write throughput and how you manage capacity. Valid values are:
     *
     * - `PAY_PER_REQUEST`
     * - `PROVISIONED`
     *
     * All replicas in your global table will have the same billing mode. If you use `PROVISIONED` billing mode, you must provide an auto scaling configuration via the `WriteProvisionedThroughputSettings` property. The default value of this property is `PROVISIONED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-billingmode
     */
    readonly billingMode?: string;

    /**
     * Global secondary indexes to be created on the global table. You can create up to 20 global secondary indexes. Each replica in your global table will have the same global secondary index settings. You can only create or delete one global secondary index in a single stack operation.
     *
     * Since the backfilling of an index could take a long time, CloudFormation does not wait for the index to become active. If a stack operation rolls back, CloudFormation might not delete an index that has been added. In that case, you will need to delete the index manually.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-globalsecondaryindexes
     */
    readonly globalSecondaryIndexes?: Array<CfnGlobalTable.GlobalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Local secondary indexes to be created on the table. You can create up to five local secondary indexes. Each index is scoped to a given hash key value. The size of each hash key can be up to 10 gigabytes. Each replica in your global table will have the same local secondary index settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-localsecondaryindexes
     */
    readonly localSecondaryIndexes?: Array<CfnGlobalTable.LocalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the settings to enable server-side encryption. These settings will be applied to all replicas. If you plan to use customer-managed KMS keys, you must provide a key for each replica using the `ReplicaSpecification.ReplicaSSESpecification` property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-ssespecification
     */
    readonly sseSpecification?: CfnGlobalTable.SSESpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the streams settings on your global table. You must provide a value for this property if your global table contains more than one replica. You can only change the streams settings if your global table has only one replica.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-streamspecification
     */
    readonly streamSpecification?: CfnGlobalTable.StreamSpecificationProperty | cdk.IResolvable;

    /**
     * A name for the global table. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID as the table name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-tablename
     */
    readonly tableName?: string;

    /**
     * Specifies the time to live (TTL) settings for the table. This setting will be applied to all replicas.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-timetolivespecification
     */
    readonly timeToLiveSpecification?: CfnGlobalTable.TimeToLiveSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies an auto scaling policy for write capacity. This policy will be applied to all replicas. This setting must be specified if `BillingMode` is set to `PROVISIONED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-writeprovisionedthroughputsettings
     */
    readonly writeProvisionedThroughputSettings?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnGlobalTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnGlobalTableProps`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTablePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeDefinitions', cdk.requiredValidator)(properties.attributeDefinitions));
    errors.collect(cdk.propertyValidator('attributeDefinitions', cdk.listValidator(CfnGlobalTable_AttributeDefinitionPropertyValidator))(properties.attributeDefinitions));
    errors.collect(cdk.propertyValidator('billingMode', cdk.validateString)(properties.billingMode));
    errors.collect(cdk.propertyValidator('globalSecondaryIndexes', cdk.listValidator(CfnGlobalTable_GlobalSecondaryIndexPropertyValidator))(properties.globalSecondaryIndexes));
    errors.collect(cdk.propertyValidator('keySchema', cdk.requiredValidator)(properties.keySchema));
    errors.collect(cdk.propertyValidator('keySchema', cdk.listValidator(CfnGlobalTable_KeySchemaPropertyValidator))(properties.keySchema));
    errors.collect(cdk.propertyValidator('localSecondaryIndexes', cdk.listValidator(CfnGlobalTable_LocalSecondaryIndexPropertyValidator))(properties.localSecondaryIndexes));
    errors.collect(cdk.propertyValidator('replicas', cdk.requiredValidator)(properties.replicas));
    errors.collect(cdk.propertyValidator('replicas', cdk.listValidator(CfnGlobalTable_ReplicaSpecificationPropertyValidator))(properties.replicas));
    errors.collect(cdk.propertyValidator('sseSpecification', CfnGlobalTable_SSESpecificationPropertyValidator)(properties.sseSpecification));
    errors.collect(cdk.propertyValidator('streamSpecification', CfnGlobalTable_StreamSpecificationPropertyValidator)(properties.streamSpecification));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('timeToLiveSpecification', CfnGlobalTable_TimeToLiveSpecificationPropertyValidator)(properties.timeToLiveSpecification));
    errors.collect(cdk.propertyValidator('writeProvisionedThroughputSettings', CfnGlobalTable_WriteProvisionedThroughputSettingsPropertyValidator)(properties.writeProvisionedThroughputSettings));
    return errors.wrap('supplied properties not correct for "CfnGlobalTableProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable` resource
 *
 * @param properties - the TypeScript properties of a `CfnGlobalTableProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTablePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTablePropsValidator(properties).assertSuccess();
    return {
        AttributeDefinitions: cdk.listMapper(cfnGlobalTableAttributeDefinitionPropertyToCloudFormation)(properties.attributeDefinitions),
        KeySchema: cdk.listMapper(cfnGlobalTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        Replicas: cdk.listMapper(cfnGlobalTableReplicaSpecificationPropertyToCloudFormation)(properties.replicas),
        BillingMode: cdk.stringToCloudFormation(properties.billingMode),
        GlobalSecondaryIndexes: cdk.listMapper(cfnGlobalTableGlobalSecondaryIndexPropertyToCloudFormation)(properties.globalSecondaryIndexes),
        LocalSecondaryIndexes: cdk.listMapper(cfnGlobalTableLocalSecondaryIndexPropertyToCloudFormation)(properties.localSecondaryIndexes),
        SSESpecification: cfnGlobalTableSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
        StreamSpecification: cfnGlobalTableStreamSpecificationPropertyToCloudFormation(properties.streamSpecification),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        TimeToLiveSpecification: cfnGlobalTableTimeToLiveSpecificationPropertyToCloudFormation(properties.timeToLiveSpecification),
        WriteProvisionedThroughputSettings: cfnGlobalTableWriteProvisionedThroughputSettingsPropertyToCloudFormation(properties.writeProvisionedThroughputSettings),
    };
}

// @ts-ignore TS6133
function CfnGlobalTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTableProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTableProps>();
    ret.addPropertyResult('attributeDefinitions', 'AttributeDefinitions', cfn_parse.FromCloudFormation.getArray(CfnGlobalTableAttributeDefinitionPropertyFromCloudFormation)(properties.AttributeDefinitions));
    ret.addPropertyResult('keySchema', 'KeySchema', cfn_parse.FromCloudFormation.getArray(CfnGlobalTableKeySchemaPropertyFromCloudFormation)(properties.KeySchema));
    ret.addPropertyResult('replicas', 'Replicas', cfn_parse.FromCloudFormation.getArray(CfnGlobalTableReplicaSpecificationPropertyFromCloudFormation)(properties.Replicas));
    ret.addPropertyResult('billingMode', 'BillingMode', properties.BillingMode != null ? cfn_parse.FromCloudFormation.getString(properties.BillingMode) : undefined);
    ret.addPropertyResult('globalSecondaryIndexes', 'GlobalSecondaryIndexes', properties.GlobalSecondaryIndexes != null ? cfn_parse.FromCloudFormation.getArray(CfnGlobalTableGlobalSecondaryIndexPropertyFromCloudFormation)(properties.GlobalSecondaryIndexes) : undefined);
    ret.addPropertyResult('localSecondaryIndexes', 'LocalSecondaryIndexes', properties.LocalSecondaryIndexes != null ? cfn_parse.FromCloudFormation.getArray(CfnGlobalTableLocalSecondaryIndexPropertyFromCloudFormation)(properties.LocalSecondaryIndexes) : undefined);
    ret.addPropertyResult('sseSpecification', 'SSESpecification', properties.SSESpecification != null ? CfnGlobalTableSSESpecificationPropertyFromCloudFormation(properties.SSESpecification) : undefined);
    ret.addPropertyResult('streamSpecification', 'StreamSpecification', properties.StreamSpecification != null ? CfnGlobalTableStreamSpecificationPropertyFromCloudFormation(properties.StreamSpecification) : undefined);
    ret.addPropertyResult('tableName', 'TableName', properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined);
    ret.addPropertyResult('timeToLiveSpecification', 'TimeToLiveSpecification', properties.TimeToLiveSpecification != null ? CfnGlobalTableTimeToLiveSpecificationPropertyFromCloudFormation(properties.TimeToLiveSpecification) : undefined);
    ret.addPropertyResult('writeProvisionedThroughputSettings', 'WriteProvisionedThroughputSettings', properties.WriteProvisionedThroughputSettings != null ? CfnGlobalTableWriteProvisionedThroughputSettingsPropertyFromCloudFormation(properties.WriteProvisionedThroughputSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DynamoDB::GlobalTable`
 *
 * The `AWS::DynamoDB::GlobalTable` resource enables you to create and manage a Version 2019.11.21 global table. This resource cannot be used to create or manage a Version 2017.11.29 global table. For more information, see [Global tables](https://docs.aws.amazon.com//amazondynamodb/latest/developerguide/GlobalTables.html) .
 *
 * > You cannot convert a resource of type `AWS::DynamoDB::Table` into a resource of type `AWS::DynamoDB::GlobalTable` by changing its type in your template. *Doing so might result in the deletion of your DynamoDB table.*
 * >
 * > You can instead use the GlobalTable resource to create a new table in a single Region. This will be billed the same as a single Region table. If you later update the stack to add other Regions then Global Tables pricing will apply.
 *
 * You should be aware of the following behaviors when working with DynamoDB global tables.
 *
 * - The IAM Principal executing the stack operation must have the permissions listed below in all regions where you plan to have a global table replica. The IAM Principal's permissions should not have restrictions based on IP source address. Some global tables operations (for example, adding a replica) are asynchronous, and require that the IAM Principal is valid until they complete. You should not delete the Principal (user or IAM role) until CloudFormation has finished updating your stack.
 *
 * - `dynamodb:CreateTable`
 * - `dynamodb:UpdateTable`
 * - `dynamodb:DeleteTable`
 * - `dynamodb:DescribeContinuousBackups`
 * - `dynamodb:DescribeContributorInsights`
 * - `dynamodb:DescribeTable`
 * - `dynamodb:DescribeTableReplicaAutoScaling`
 * - `dynamodb:DescribeTimeToLive`
 * - `dynamodb:ListTables`
 * - `dynamodb:UpdateTimeToLive`
 * - `dynamodb:UpdateContributorInsights`
 * - `dynamodb:UpdateContinuousBackups`
 * - `dynamodb:ListTagsOfResource`
 * - `dynamodb:TableClass`
 * - `dynamodb:TagResource`
 * - `dynamodb:UntagResource`
 * - `dynamodb:BatchWriteItem`
 * - `dynamodb:CreateTableReplica`
 * - `dynamodb:DeleteItem`
 * - `dynamodb:DeleteTableReplica`
 * - `dynamodb:DisableKinesisStreamingDestination`
 * - `dynamodb:EnableKinesisStreamingDestination`
 * - `dynamodb:GetItem`
 * - `dynamodb:PutItem`
 * - `dynamodb:Query`
 * - `dynamodb:Scan`
 * - `dynamodb:UpdateItem`
 * - `dynamodb:DescribeTableReplicaAutoScaling`
 * - `dynamodb:UpdateTableReplicaAutoScaling`
 * - `iam:CreateServiceLinkedRole`
 * - `kms:CreateGrant`
 * - `kms:DescribeKey`
 * - `application-autoscaling:DeleteScalingPolicy`
 * - `application-autoscaling:DeleteScheduledAction`
 * - `application-autoscaling:DeregisterScalableTarget`
 * - `application-autoscaling:DescribeScalingPolicies`
 * - `application-autoscaling:DescribeScalableTargets`
 * - `application-autoscaling:PutScalingPolicy`
 * - `application-autoscaling:PutScheduledAction`
 * - `application-autoscaling:RegisterScalableTarget`
 * - When using provisioned billing mode, CloudFormation will create an auto scaling policy on each of your replicas to control their write capacities. You must configure this policy using the `WriteProvisionedThroughputSettings` property. CloudFormation will ensure that all replicas have the same write capacity auto scaling property. You cannot directly specify a value for write capacity for a global table.
 * - If your table uses provisioned capacity, you must configure auto scaling directly in the `AWS::DynamoDB::GlobalTable` resource. You should not configure additional auto scaling policies on any of the table replicas or global secondary indexes, either via API or via `AWS::ApplicationAutoScaling::ScalableTarget` or `AWS::ApplicationAutoScaling::ScalingPolicy` . Doing so might result in unexpected behavior and is unsupported.
 * - In AWS CloudFormation , each global table is controlled by a single stack, in a single region, regardless of the number of replicas. When you deploy your template, CloudFormation will create/update all replicas as part of a single stack operation. You should not deploy the same `AWS::DynamoDB::GlobalTable` resource in multiple regions. Doing so will result in errors, and is unsupported. If you deploy your application template in multiple regions, you can use conditions to only create the resource in a single region. Alternatively, you can choose to define your `AWS::DynamoDB::GlobalTable` resources in a stack separate from your application stack, and make sure it is only deployed to a single region.
 *
 * @cloudformationResource AWS::DynamoDB::GlobalTable
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html
 */
export class CfnGlobalTable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DynamoDB::GlobalTable";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGlobalTable {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGlobalTablePropsFromCloudFormation(resourceProperties);
        const ret = new CfnGlobalTable(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the DynamoDB table, such as `arn:aws:dynamodb:us-east-2:123456789012:table/myDynamoDBTable` . The ARN returned is that of the replica in the region the stack is deployed to.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ARN of the DynamoDB stream, such as `arn:aws:dynamodb:us-east-1:123456789012:table/testddbstack-myDynamoDBTable-012A1SL7SMP5Q/stream/2015-11-30T20:10:00.000` . The `StreamArn` returned is that of the replica in the region the stack is deployed to.
     *
     * > You must specify the `StreamSpecification` property to use this attribute.
     * @cloudformationAttribute StreamArn
     */
    public readonly attrStreamArn: string;

    /**
     * Unique identifier for the table, such as `a123b456-01ab-23cd-123a-111222aaabbb` . The `TableId` returned is that of the replica in the region the stack is deployed to.
     * @cloudformationAttribute TableId
     */
    public readonly attrTableId: string;

    /**
     * A list of attributes that describe the key schema for the global table and indexes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-attributedefinitions
     */
    public attributeDefinitions: Array<CfnGlobalTable.AttributeDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the attributes that make up the primary key for the table. The attributes in the `KeySchema` property must also be defined in the `AttributeDefinitions` property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-keyschema
     */
    public keySchema: Array<CfnGlobalTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the list of replicas for your global table. The list must contain at least one element, the region where the stack defining the global table is deployed. For example, if you define your table in a stack deployed to us-east-1, you must have an entry in `Replicas` with the region us-east-1. You cannot remove the replica in the stack region.
     *
     * > Adding a replica might take a few minutes for an empty table, or up to several hours for large tables. If you want to add or remove a replica, we recommend submitting an `UpdateStack` operation containing only that change.
     * >
     * > If you add or delete a replica during an update, we recommend that you don't update any other resources. If your stack fails to update and is rolled back while adding a new replica, you might need to manually delete the replica.
     *
     * You can create a new global table with as many replicas as needed. You can add or remove replicas after table creation, but you can only add or remove a single replica in each update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-replicas
     */
    public replicas: Array<CfnGlobalTable.ReplicaSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies how you are charged for read and write throughput and how you manage capacity. Valid values are:
     *
     * - `PAY_PER_REQUEST`
     * - `PROVISIONED`
     *
     * All replicas in your global table will have the same billing mode. If you use `PROVISIONED` billing mode, you must provide an auto scaling configuration via the `WriteProvisionedThroughputSettings` property. The default value of this property is `PROVISIONED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-billingmode
     */
    public billingMode: string | undefined;

    /**
     * Global secondary indexes to be created on the global table. You can create up to 20 global secondary indexes. Each replica in your global table will have the same global secondary index settings. You can only create or delete one global secondary index in a single stack operation.
     *
     * Since the backfilling of an index could take a long time, CloudFormation does not wait for the index to become active. If a stack operation rolls back, CloudFormation might not delete an index that has been added. In that case, you will need to delete the index manually.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-globalsecondaryindexes
     */
    public globalSecondaryIndexes: Array<CfnGlobalTable.GlobalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Local secondary indexes to be created on the table. You can create up to five local secondary indexes. Each index is scoped to a given hash key value. The size of each hash key can be up to 10 gigabytes. Each replica in your global table will have the same local secondary index settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-localsecondaryindexes
     */
    public localSecondaryIndexes: Array<CfnGlobalTable.LocalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specifies the settings to enable server-side encryption. These settings will be applied to all replicas. If you plan to use customer-managed KMS keys, you must provide a key for each replica using the `ReplicaSpecification.ReplicaSSESpecification` property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-ssespecification
     */
    public sseSpecification: CfnGlobalTable.SSESpecificationProperty | cdk.IResolvable | undefined;

    /**
     * Specifies the streams settings on your global table. You must provide a value for this property if your global table contains more than one replica. You can only change the streams settings if your global table has only one replica.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-streamspecification
     */
    public streamSpecification: CfnGlobalTable.StreamSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * A name for the global table. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID as the table name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-tablename
     */
    public tableName: string | undefined;

    /**
     * Specifies the time to live (TTL) settings for the table. This setting will be applied to all replicas.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-timetolivespecification
     */
    public timeToLiveSpecification: CfnGlobalTable.TimeToLiveSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * Specifies an auto scaling policy for write capacity. This policy will be applied to all replicas. This setting must be specified if `BillingMode` is set to `PROVISIONED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-globaltable.html#cfn-dynamodb-globaltable-writeprovisionedthroughputsettings
     */
    public writeProvisionedThroughputSettings: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::DynamoDB::GlobalTable`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGlobalTableProps) {
        super(scope, id, { type: CfnGlobalTable.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'attributeDefinitions', this);
        cdk.requireProperty(props, 'keySchema', this);
        cdk.requireProperty(props, 'replicas', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrStreamArn = cdk.Token.asString(this.getAtt('StreamArn', cdk.ResolutionTypeHint.STRING));
        this.attrTableId = cdk.Token.asString(this.getAtt('TableId', cdk.ResolutionTypeHint.STRING));

        this.attributeDefinitions = props.attributeDefinitions;
        this.keySchema = props.keySchema;
        this.replicas = props.replicas;
        this.billingMode = props.billingMode;
        this.globalSecondaryIndexes = props.globalSecondaryIndexes;
        this.localSecondaryIndexes = props.localSecondaryIndexes;
        this.sseSpecification = props.sseSpecification;
        this.streamSpecification = props.streamSpecification;
        this.tableName = props.tableName;
        this.timeToLiveSpecification = props.timeToLiveSpecification;
        this.writeProvisionedThroughputSettings = props.writeProvisionedThroughputSettings;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::DynamoDB::GlobalTable\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGlobalTable.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            attributeDefinitions: this.attributeDefinitions,
            keySchema: this.keySchema,
            replicas: this.replicas,
            billingMode: this.billingMode,
            globalSecondaryIndexes: this.globalSecondaryIndexes,
            localSecondaryIndexes: this.localSecondaryIndexes,
            sseSpecification: this.sseSpecification,
            streamSpecification: this.streamSpecification,
            tableName: this.tableName,
            timeToLiveSpecification: this.timeToLiveSpecification,
            writeProvisionedThroughputSettings: this.writeProvisionedThroughputSettings,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGlobalTablePropsToCloudFormation(props);
    }
}

export namespace CfnGlobalTable {
    /**
     * Represents an attribute for describing the key schema for the table and indexes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-attributedefinition.html
     */
    export interface AttributeDefinitionProperty {
        /**
         * A name for the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-attributedefinition.html#cfn-dynamodb-globaltable-attributedefinition-attributename
         */
        readonly attributeName: string;
        /**
         * The data type for the attribute, where:
         *
         * - `S` - the attribute is of type String
         * - `N` - the attribute is of type Number
         * - `B` - the attribute is of type Binary
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-attributedefinition.html#cfn-dynamodb-globaltable-attributedefinition-attributetype
         */
        readonly attributeType: string;
    }
}

/**
 * Determine whether the given properties match those of a `AttributeDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_AttributeDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.requiredValidator)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeType', cdk.requiredValidator)(properties.attributeType));
    errors.collect(cdk.propertyValidator('attributeType', cdk.validateString)(properties.attributeType));
    return errors.wrap('supplied properties not correct for "AttributeDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.AttributeDefinition` resource
 *
 * @param properties - the TypeScript properties of a `AttributeDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.AttributeDefinition` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableAttributeDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_AttributeDefinitionPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        AttributeType: cdk.stringToCloudFormation(properties.attributeType),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableAttributeDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.AttributeDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.AttributeDefinitionProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', cfn_parse.FromCloudFormation.getString(properties.AttributeName));
    ret.addPropertyResult('attributeType', 'AttributeType', cfn_parse.FromCloudFormation.getString(properties.AttributeType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Configures a scalable target and an autoscaling policy for a table or global secondary index's read or write capacity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html
     */
    export interface CapacityAutoScalingSettingsProperty {
        /**
         * The maximum provisioned capacity units for the global table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-maxcapacity
         */
        readonly maxCapacity: number;
        /**
         * The minimum provisioned capacity units for the global table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-mincapacity
         */
        readonly minCapacity: number;
        /**
         * When switching billing mode from `PAY_PER_REQUEST` to `PROVISIONED` , DynamoDB requires you to specify read and write capacity unit values for the table and for each global secondary index. These values will be applied to all replicas. The table will use these provisioned values until CloudFormation creates the autoscaling policies you configured in your template. CloudFormation cannot determine what capacity the table and its global secondary indexes will require in this time period, since they are application-dependent.
         *
         * If you want to switch a table's billing mode from `PAY_PER_REQUEST` to `PROVISIONED` , you must specify a value for this property for each autoscaled resource. If you specify different values for the same resource in different regions, CloudFormation will use the highest value found in either the `SeedCapacity` or `ReadCapacityUnits` properties. For example, if your global secondary index `myGSI` has a `SeedCapacity` of 10 in us-east-1 and a fixed `ReadCapacityUnits` of 20 in eu-west-1, CloudFormation will initially set the read capacity for `myGSI` to 20. Note that if you disable `ScaleIn` for `myGSI` in us-east-1, its read capacity units might not be set back to 10.
         *
         * You must also specify a value for `SeedCapacity` when you plan to switch a table's billing mode from `PROVISIONED` to `PAY_PER_REQUEST` , because CloudFormation might need to roll back the operation (reverting the billing mode to `PROVISIONED` ) and this cannot succeed without specifying a value for `SeedCapacity` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-seedcapacity
         */
        readonly seedCapacity?: number;
        /**
         * Defines a target tracking scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-capacityautoscalingsettings.html#cfn-dynamodb-globaltable-capacityautoscalingsettings-targettrackingscalingpolicyconfiguration
         */
        readonly targetTrackingScalingPolicyConfiguration: CfnGlobalTable.TargetTrackingScalingPolicyConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CapacityAutoScalingSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityAutoScalingSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_CapacityAutoScalingSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.requiredValidator)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('maxCapacity', cdk.validateNumber)(properties.maxCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.requiredValidator)(properties.minCapacity));
    errors.collect(cdk.propertyValidator('minCapacity', cdk.validateNumber)(properties.minCapacity));
    errors.collect(cdk.propertyValidator('seedCapacity', cdk.validateNumber)(properties.seedCapacity));
    errors.collect(cdk.propertyValidator('targetTrackingScalingPolicyConfiguration', cdk.requiredValidator)(properties.targetTrackingScalingPolicyConfiguration));
    errors.collect(cdk.propertyValidator('targetTrackingScalingPolicyConfiguration', CfnGlobalTable_TargetTrackingScalingPolicyConfigurationPropertyValidator)(properties.targetTrackingScalingPolicyConfiguration));
    return errors.wrap('supplied properties not correct for "CapacityAutoScalingSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.CapacityAutoScalingSettings` resource
 *
 * @param properties - the TypeScript properties of a `CapacityAutoScalingSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.CapacityAutoScalingSettings` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableCapacityAutoScalingSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_CapacityAutoScalingSettingsPropertyValidator(properties).assertSuccess();
    return {
        MaxCapacity: cdk.numberToCloudFormation(properties.maxCapacity),
        MinCapacity: cdk.numberToCloudFormation(properties.minCapacity),
        SeedCapacity: cdk.numberToCloudFormation(properties.seedCapacity),
        TargetTrackingScalingPolicyConfiguration: cfnGlobalTableTargetTrackingScalingPolicyConfigurationPropertyToCloudFormation(properties.targetTrackingScalingPolicyConfiguration),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableCapacityAutoScalingSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.CapacityAutoScalingSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.CapacityAutoScalingSettingsProperty>();
    ret.addPropertyResult('maxCapacity', 'MaxCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity));
    ret.addPropertyResult('minCapacity', 'MinCapacity', cfn_parse.FromCloudFormation.getNumber(properties.MinCapacity));
    ret.addPropertyResult('seedCapacity', 'SeedCapacity', properties.SeedCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.SeedCapacity) : undefined);
    ret.addPropertyResult('targetTrackingScalingPolicyConfiguration', 'TargetTrackingScalingPolicyConfiguration', CfnGlobalTableTargetTrackingScalingPolicyConfigurationPropertyFromCloudFormation(properties.TargetTrackingScalingPolicyConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Configures contributor insights settings for a replica or one of its indexes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-contributorinsightsspecification.html
     */
    export interface ContributorInsightsSpecificationProperty {
        /**
         * Indicates whether CloudWatch Contributor Insights are to be enabled (true) or disabled (false).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-contributorinsightsspecification.html#cfn-dynamodb-globaltable-contributorinsightsspecification-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContributorInsightsSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ContributorInsightsSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_ContributorInsightsSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "ContributorInsightsSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ContributorInsightsSpecification` resource
 *
 * @param properties - the TypeScript properties of a `ContributorInsightsSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ContributorInsightsSpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableContributorInsightsSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_ContributorInsightsSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableContributorInsightsSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.ContributorInsightsSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.ContributorInsightsSpecificationProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Allows you to specify a global secondary index for the global table. The index will be defined on all replicas.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html
     */
    export interface GlobalSecondaryIndexProperty {
        /**
         * The name of the global secondary index. The name must be unique among all other indexes on this table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-indexname
         */
        readonly indexName: string;
        /**
         * The complete key schema for a global secondary index, which consists of one or more pairs of attribute names and key types:
         *
         * - `HASH` - partition key
         * - `RANGE` - sort key
         *
         * > The partition key of an item is also known as its *hash attribute* . The term "hash attribute" derives from DynamoDB's usage of an internal hash function to evenly distribute data items across partitions, based on their partition key values.
         * >
         * > The sort key of an item is also known as its *range attribute* . The term "range attribute" derives from the way DynamoDB stores items with the same partition key physically close together, in sorted order by the sort key value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-keyschema
         */
        readonly keySchema: Array<CfnGlobalTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Represents attributes that are copied (projected) from the table into the global secondary index. These are in addition to the primary key attributes and index key attributes, which are automatically projected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-projection
         */
        readonly projection: CfnGlobalTable.ProjectionProperty | cdk.IResolvable;
        /**
         * Defines write capacity settings for the global secondary index. You must specify a value for this property if the table's `BillingMode` is `PROVISIONED` . All replicas will have the same write capacity settings for this global secondary index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-globalsecondaryindex.html#cfn-dynamodb-globaltable-globalsecondaryindex-writeprovisionedthroughputsettings
         */
        readonly writeProvisionedThroughputSettings?: CfnGlobalTable.WriteProvisionedThroughputSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GlobalSecondaryIndexProperty`
 *
 * @param properties - the TypeScript properties of a `GlobalSecondaryIndexProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_GlobalSecondaryIndexPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('indexName', cdk.requiredValidator)(properties.indexName));
    errors.collect(cdk.propertyValidator('indexName', cdk.validateString)(properties.indexName));
    errors.collect(cdk.propertyValidator('keySchema', cdk.requiredValidator)(properties.keySchema));
    errors.collect(cdk.propertyValidator('keySchema', cdk.listValidator(CfnGlobalTable_KeySchemaPropertyValidator))(properties.keySchema));
    errors.collect(cdk.propertyValidator('projection', cdk.requiredValidator)(properties.projection));
    errors.collect(cdk.propertyValidator('projection', CfnGlobalTable_ProjectionPropertyValidator)(properties.projection));
    errors.collect(cdk.propertyValidator('writeProvisionedThroughputSettings', CfnGlobalTable_WriteProvisionedThroughputSettingsPropertyValidator)(properties.writeProvisionedThroughputSettings));
    return errors.wrap('supplied properties not correct for "GlobalSecondaryIndexProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.GlobalSecondaryIndex` resource
 *
 * @param properties - the TypeScript properties of a `GlobalSecondaryIndexProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.GlobalSecondaryIndex` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableGlobalSecondaryIndexPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_GlobalSecondaryIndexPropertyValidator(properties).assertSuccess();
    return {
        IndexName: cdk.stringToCloudFormation(properties.indexName),
        KeySchema: cdk.listMapper(cfnGlobalTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        Projection: cfnGlobalTableProjectionPropertyToCloudFormation(properties.projection),
        WriteProvisionedThroughputSettings: cfnGlobalTableWriteProvisionedThroughputSettingsPropertyToCloudFormation(properties.writeProvisionedThroughputSettings),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableGlobalSecondaryIndexPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.GlobalSecondaryIndexProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.GlobalSecondaryIndexProperty>();
    ret.addPropertyResult('indexName', 'IndexName', cfn_parse.FromCloudFormation.getString(properties.IndexName));
    ret.addPropertyResult('keySchema', 'KeySchema', cfn_parse.FromCloudFormation.getArray(CfnGlobalTableKeySchemaPropertyFromCloudFormation)(properties.KeySchema));
    ret.addPropertyResult('projection', 'Projection', CfnGlobalTableProjectionPropertyFromCloudFormation(properties.Projection));
    ret.addPropertyResult('writeProvisionedThroughputSettings', 'WriteProvisionedThroughputSettings', properties.WriteProvisionedThroughputSettings != null ? CfnGlobalTableWriteProvisionedThroughputSettingsPropertyFromCloudFormation(properties.WriteProvisionedThroughputSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents *a single element* of a key schema. A key schema specifies the attributes that make up the primary key of a table, or the key attributes of an index.
     *
     * A `KeySchemaElement` represents exactly one attribute of the primary key. For example, a simple primary key would be represented by one `KeySchemaElement` (for the partition key). A composite primary key would require one `KeySchemaElement` for the partition key, and another `KeySchemaElement` for the sort key.
     *
     * A `KeySchemaElement` must be a scalar, top-level attribute (not a nested attribute). The data type must be one of String, Number, or Binary. The attribute cannot be nested within a List or a Map.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-keyschema.html
     */
    export interface KeySchemaProperty {
        /**
         * The name of a key attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-keyschema.html#cfn-dynamodb-globaltable-keyschema-attributename
         */
        readonly attributeName: string;
        /**
         * The role that this key attribute will assume:
         *
         * - `HASH` - partition key
         * - `RANGE` - sort key
         *
         * > The partition key of an item is also known as its *hash attribute* . The term "hash attribute" derives from DynamoDB's usage of an internal hash function to evenly distribute data items across partitions, based on their partition key values.
         * >
         * > The sort key of an item is also known as its *range attribute* . The term "range attribute" derives from the way DynamoDB stores items with the same partition key physically close together, in sorted order by the sort key value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-keyschema.html#cfn-dynamodb-globaltable-keyschema-keytype
         */
        readonly keyType: string;
    }
}

/**
 * Determine whether the given properties match those of a `KeySchemaProperty`
 *
 * @param properties - the TypeScript properties of a `KeySchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_KeySchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.requiredValidator)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('keyType', cdk.requiredValidator)(properties.keyType));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    return errors.wrap('supplied properties not correct for "KeySchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.KeySchema` resource
 *
 * @param properties - the TypeScript properties of a `KeySchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.KeySchema` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableKeySchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_KeySchemaPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableKeySchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.KeySchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.KeySchemaProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', cfn_parse.FromCloudFormation.getString(properties.AttributeName));
    ret.addPropertyResult('keyType', 'KeyType', cfn_parse.FromCloudFormation.getString(properties.KeyType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents the properties of a local secondary index. A local secondary index can only be created when its parent table is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html
     */
    export interface LocalSecondaryIndexProperty {
        /**
         * The name of the local secondary index. The name must be unique among all other indexes on this table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html#cfn-dynamodb-globaltable-localsecondaryindex-indexname
         */
        readonly indexName: string;
        /**
         * The complete key schema for the local secondary index, consisting of one or more pairs of attribute names and key types:
         *
         * - `HASH` - partition key
         * - `RANGE` - sort key
         *
         * > The partition key of an item is also known as its *hash attribute* . The term "hash attribute" derives from DynamoDB's usage of an internal hash function to evenly distribute data items across partitions, based on their partition key values.
         * >
         * > The sort key of an item is also known as its *range attribute* . The term "range attribute" derives from the way DynamoDB stores items with the same partition key physically close together, in sorted order by the sort key value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html#cfn-dynamodb-globaltable-localsecondaryindex-keyschema
         */
        readonly keySchema: Array<CfnGlobalTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Represents attributes that are copied (projected) from the table into the local secondary index. These are in addition to the primary key attributes and index key attributes, which are automatically projected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-localsecondaryindex.html#cfn-dynamodb-globaltable-localsecondaryindex-projection
         */
        readonly projection: CfnGlobalTable.ProjectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LocalSecondaryIndexProperty`
 *
 * @param properties - the TypeScript properties of a `LocalSecondaryIndexProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_LocalSecondaryIndexPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('indexName', cdk.requiredValidator)(properties.indexName));
    errors.collect(cdk.propertyValidator('indexName', cdk.validateString)(properties.indexName));
    errors.collect(cdk.propertyValidator('keySchema', cdk.requiredValidator)(properties.keySchema));
    errors.collect(cdk.propertyValidator('keySchema', cdk.listValidator(CfnGlobalTable_KeySchemaPropertyValidator))(properties.keySchema));
    errors.collect(cdk.propertyValidator('projection', cdk.requiredValidator)(properties.projection));
    errors.collect(cdk.propertyValidator('projection', CfnGlobalTable_ProjectionPropertyValidator)(properties.projection));
    return errors.wrap('supplied properties not correct for "LocalSecondaryIndexProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.LocalSecondaryIndex` resource
 *
 * @param properties - the TypeScript properties of a `LocalSecondaryIndexProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.LocalSecondaryIndex` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableLocalSecondaryIndexPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_LocalSecondaryIndexPropertyValidator(properties).assertSuccess();
    return {
        IndexName: cdk.stringToCloudFormation(properties.indexName),
        KeySchema: cdk.listMapper(cfnGlobalTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        Projection: cfnGlobalTableProjectionPropertyToCloudFormation(properties.projection),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableLocalSecondaryIndexPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.LocalSecondaryIndexProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.LocalSecondaryIndexProperty>();
    ret.addPropertyResult('indexName', 'IndexName', cfn_parse.FromCloudFormation.getString(properties.IndexName));
    ret.addPropertyResult('keySchema', 'KeySchema', cfn_parse.FromCloudFormation.getArray(CfnGlobalTableKeySchemaPropertyFromCloudFormation)(properties.KeySchema));
    ret.addPropertyResult('projection', 'Projection', CfnGlobalTableProjectionPropertyFromCloudFormation(properties.Projection));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents the settings used to enable point in time recovery.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-pointintimerecoveryspecification.html
     */
    export interface PointInTimeRecoverySpecificationProperty {
        /**
         * Indicates whether point in time recovery is enabled (true) or disabled (false) on the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-pointintimerecoveryspecification.html#cfn-dynamodb-globaltable-pointintimerecoveryspecification-pointintimerecoveryenabled
         */
        readonly pointInTimeRecoveryEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PointInTimeRecoverySpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PointInTimeRecoverySpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_PointInTimeRecoverySpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pointInTimeRecoveryEnabled', cdk.validateBoolean)(properties.pointInTimeRecoveryEnabled));
    return errors.wrap('supplied properties not correct for "PointInTimeRecoverySpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.PointInTimeRecoverySpecification` resource
 *
 * @param properties - the TypeScript properties of a `PointInTimeRecoverySpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.PointInTimeRecoverySpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTablePointInTimeRecoverySpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_PointInTimeRecoverySpecificationPropertyValidator(properties).assertSuccess();
    return {
        PointInTimeRecoveryEnabled: cdk.booleanToCloudFormation(properties.pointInTimeRecoveryEnabled),
    };
}

// @ts-ignore TS6133
function CfnGlobalTablePointInTimeRecoverySpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.PointInTimeRecoverySpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.PointInTimeRecoverySpecificationProperty>();
    ret.addPropertyResult('pointInTimeRecoveryEnabled', 'PointInTimeRecoveryEnabled', properties.PointInTimeRecoveryEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PointInTimeRecoveryEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents attributes that are copied (projected) from the table into an index. These are in addition to the primary key attributes and index key attributes, which are automatically projected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-projection.html
     */
    export interface ProjectionProperty {
        /**
         * Represents the non-key attribute names which will be projected into the index.
         *
         * For local secondary indexes, the total count of `NonKeyAttributes` summed across all of the local secondary indexes, must not exceed 100. If you project the same attribute into two different indexes, this counts as two distinct attributes when determining the total.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-projection.html#cfn-dynamodb-globaltable-projection-nonkeyattributes
         */
        readonly nonKeyAttributes?: string[];
        /**
         * The set of attributes that are projected into the index:
         *
         * - `KEYS_ONLY` - Only the index and primary keys are projected into the index.
         * - `INCLUDE` - In addition to the attributes described in `KEYS_ONLY` , the secondary index will include other non-key attributes that you specify.
         * - `ALL` - All of the table attributes are projected into the index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-projection.html#cfn-dynamodb-globaltable-projection-projectiontype
         */
        readonly projectionType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProjectionProperty`
 *
 * @param properties - the TypeScript properties of a `ProjectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_ProjectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nonKeyAttributes', cdk.listValidator(cdk.validateString))(properties.nonKeyAttributes));
    errors.collect(cdk.propertyValidator('projectionType', cdk.validateString)(properties.projectionType));
    return errors.wrap('supplied properties not correct for "ProjectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.Projection` resource
 *
 * @param properties - the TypeScript properties of a `ProjectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.Projection` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableProjectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_ProjectionPropertyValidator(properties).assertSuccess();
    return {
        NonKeyAttributes: cdk.listMapper(cdk.stringToCloudFormation)(properties.nonKeyAttributes),
        ProjectionType: cdk.stringToCloudFormation(properties.projectionType),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableProjectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.ProjectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.ProjectionProperty>();
    ret.addPropertyResult('nonKeyAttributes', 'NonKeyAttributes', properties.NonKeyAttributes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NonKeyAttributes) : undefined);
    ret.addPropertyResult('projectionType', 'ProjectionType', properties.ProjectionType != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectionType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Allows you to specify the read capacity settings for a replica table or a replica global secondary index when the `BillingMode` is set to `PROVISIONED` . You must specify a value for either `ReadCapacityUnits` or `ReadCapacityAutoScalingSettings` , but not both. You can switch between fixed capacity and auto scaling.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-readprovisionedthroughputsettings.html
     */
    export interface ReadProvisionedThroughputSettingsProperty {
        /**
         * Specifies auto scaling settings for the replica table or global secondary index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-readprovisionedthroughputsettings.html#cfn-dynamodb-globaltable-readprovisionedthroughputsettings-readcapacityautoscalingsettings
         */
        readonly readCapacityAutoScalingSettings?: CfnGlobalTable.CapacityAutoScalingSettingsProperty | cdk.IResolvable;
        /**
         * Specifies a fixed read capacity for the replica table or global secondary index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-readprovisionedthroughputsettings.html#cfn-dynamodb-globaltable-readprovisionedthroughputsettings-readcapacityunits
         */
        readonly readCapacityUnits?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ReadProvisionedThroughputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ReadProvisionedThroughputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_ReadProvisionedThroughputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('readCapacityAutoScalingSettings', CfnGlobalTable_CapacityAutoScalingSettingsPropertyValidator)(properties.readCapacityAutoScalingSettings));
    errors.collect(cdk.propertyValidator('readCapacityUnits', cdk.validateNumber)(properties.readCapacityUnits));
    return errors.wrap('supplied properties not correct for "ReadProvisionedThroughputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReadProvisionedThroughputSettings` resource
 *
 * @param properties - the TypeScript properties of a `ReadProvisionedThroughputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReadProvisionedThroughputSettings` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableReadProvisionedThroughputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_ReadProvisionedThroughputSettingsPropertyValidator(properties).assertSuccess();
    return {
        ReadCapacityAutoScalingSettings: cfnGlobalTableCapacityAutoScalingSettingsPropertyToCloudFormation(properties.readCapacityAutoScalingSettings),
        ReadCapacityUnits: cdk.numberToCloudFormation(properties.readCapacityUnits),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableReadProvisionedThroughputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.ReadProvisionedThroughputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.ReadProvisionedThroughputSettingsProperty>();
    ret.addPropertyResult('readCapacityAutoScalingSettings', 'ReadCapacityAutoScalingSettings', properties.ReadCapacityAutoScalingSettings != null ? CfnGlobalTableCapacityAutoScalingSettingsPropertyFromCloudFormation(properties.ReadCapacityAutoScalingSettings) : undefined);
    ret.addPropertyResult('readCapacityUnits', 'ReadCapacityUnits', properties.ReadCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReadCapacityUnits) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents the properties of a global secondary index that can be set on a per-replica basis.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html
     */
    export interface ReplicaGlobalSecondaryIndexSpecificationProperty {
        /**
         * Updates the status for contributor insights for a specific table or index. CloudWatch Contributor Insights for DynamoDB graphs display the partition key and (if applicable) sort key of frequently accessed items and frequently throttled items in plaintext. If you require the use of AWS Key Management Service (KMS) to encrypt this table’s partition key and sort key data with an AWS managed key or customer managed key, you should not enable CloudWatch Contributor Insights for DynamoDB for this table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html#cfn-dynamodb-globaltable-replicaglobalsecondaryindexspecification-contributorinsightsspecification
         */
        readonly contributorInsightsSpecification?: CfnGlobalTable.ContributorInsightsSpecificationProperty | cdk.IResolvable;
        /**
         * The name of the global secondary index. The name must be unique among all other indexes on this table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html#cfn-dynamodb-globaltable-replicaglobalsecondaryindexspecification-indexname
         */
        readonly indexName: string;
        /**
         * Allows you to specify the read capacity settings for a replica global secondary index when the `BillingMode` is set to `PROVISIONED` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaglobalsecondaryindexspecification.html#cfn-dynamodb-globaltable-replicaglobalsecondaryindexspecification-readprovisionedthroughputsettings
         */
        readonly readProvisionedThroughputSettings?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicaGlobalSecondaryIndexSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicaGlobalSecondaryIndexSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_ReplicaGlobalSecondaryIndexSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contributorInsightsSpecification', CfnGlobalTable_ContributorInsightsSpecificationPropertyValidator)(properties.contributorInsightsSpecification));
    errors.collect(cdk.propertyValidator('indexName', cdk.requiredValidator)(properties.indexName));
    errors.collect(cdk.propertyValidator('indexName', cdk.validateString)(properties.indexName));
    errors.collect(cdk.propertyValidator('readProvisionedThroughputSettings', CfnGlobalTable_ReadProvisionedThroughputSettingsPropertyValidator)(properties.readProvisionedThroughputSettings));
    return errors.wrap('supplied properties not correct for "ReplicaGlobalSecondaryIndexSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReplicaGlobalSecondaryIndexSpecification` resource
 *
 * @param properties - the TypeScript properties of a `ReplicaGlobalSecondaryIndexSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReplicaGlobalSecondaryIndexSpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableReplicaGlobalSecondaryIndexSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_ReplicaGlobalSecondaryIndexSpecificationPropertyValidator(properties).assertSuccess();
    return {
        ContributorInsightsSpecification: cfnGlobalTableContributorInsightsSpecificationPropertyToCloudFormation(properties.contributorInsightsSpecification),
        IndexName: cdk.stringToCloudFormation(properties.indexName),
        ReadProvisionedThroughputSettings: cfnGlobalTableReadProvisionedThroughputSettingsPropertyToCloudFormation(properties.readProvisionedThroughputSettings),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableReplicaGlobalSecondaryIndexSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty>();
    ret.addPropertyResult('contributorInsightsSpecification', 'ContributorInsightsSpecification', properties.ContributorInsightsSpecification != null ? CfnGlobalTableContributorInsightsSpecificationPropertyFromCloudFormation(properties.ContributorInsightsSpecification) : undefined);
    ret.addPropertyResult('indexName', 'IndexName', cfn_parse.FromCloudFormation.getString(properties.IndexName));
    ret.addPropertyResult('readProvisionedThroughputSettings', 'ReadProvisionedThroughputSettings', properties.ReadProvisionedThroughputSettings != null ? CfnGlobalTableReadProvisionedThroughputSettingsPropertyFromCloudFormation(properties.ReadProvisionedThroughputSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Allows you to specify a KMS key identifier to be used for server-side encryption. The key can be specified via ARN, key ID, or alias. The key must be created in the same region as the replica.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicassespecification.html
     */
    export interface ReplicaSSESpecificationProperty {
        /**
         * The AWS KMS key that should be used for the AWS KMS encryption. To specify a key, use its key ID, Amazon Resource Name (ARN), alias name, or alias ARN. Note that you should only provide this parameter if the key is different from the default DynamoDB key `alias/aws/dynamodb` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicassespecification.html#cfn-dynamodb-globaltable-replicassespecification-kmsmasterkeyid
         */
        readonly kmsMasterKeyId: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicaSSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicaSSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_ReplicaSSESpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsMasterKeyId', cdk.requiredValidator)(properties.kmsMasterKeyId));
    errors.collect(cdk.propertyValidator('kmsMasterKeyId', cdk.validateString)(properties.kmsMasterKeyId));
    return errors.wrap('supplied properties not correct for "ReplicaSSESpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReplicaSSESpecification` resource
 *
 * @param properties - the TypeScript properties of a `ReplicaSSESpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReplicaSSESpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableReplicaSSESpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_ReplicaSSESpecificationPropertyValidator(properties).assertSuccess();
    return {
        KMSMasterKeyId: cdk.stringToCloudFormation(properties.kmsMasterKeyId),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableReplicaSSESpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.ReplicaSSESpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.ReplicaSSESpecificationProperty>();
    ret.addPropertyResult('kmsMasterKeyId', 'KMSMasterKeyId', cfn_parse.FromCloudFormation.getString(properties.KMSMasterKeyId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Defines settings specific to a single replica of a global table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html
     */
    export interface ReplicaSpecificationProperty {
        /**
         * The settings used to enable or disable CloudWatch Contributor Insights for the specified replica. When not specified, defaults to contributor insights disabled for the replica.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-contributorinsightsspecification
         */
        readonly contributorInsightsSpecification?: CfnGlobalTable.ContributorInsightsSpecificationProperty | cdk.IResolvable;
        /**
         * Defines additional settings for the global secondary indexes of this replica.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-globalsecondaryindexes
         */
        readonly globalSecondaryIndexes?: Array<CfnGlobalTable.ReplicaGlobalSecondaryIndexSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The settings used to enable point in time recovery. When not specified, defaults to point in time recovery disabled for the replica.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-pointintimerecoveryspecification
         */
        readonly pointInTimeRecoverySpecification?: CfnGlobalTable.PointInTimeRecoverySpecificationProperty | cdk.IResolvable;
        /**
         * Defines read capacity settings for the replica table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-readprovisionedthroughputsettings
         */
        readonly readProvisionedThroughputSettings?: CfnGlobalTable.ReadProvisionedThroughputSettingsProperty | cdk.IResolvable;
        /**
         * The region in which this replica exists.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-region
         */
        readonly region: string;
        /**
         * Allows you to specify a customer-managed key for the replica. When using customer-managed keys for server-side encryption, this property must have a value in all replicas.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-ssespecification
         */
        readonly sseSpecification?: CfnGlobalTable.ReplicaSSESpecificationProperty | cdk.IResolvable;
        /**
         * The table class of the specified table. Valid values are `STANDARD` and `STANDARD_INFREQUENT_ACCESS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-tableclass
         */
        readonly tableClass?: string;
        /**
         * An array of key-value pairs to apply to this replica.
         *
         * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-replicaspecification.html#cfn-dynamodb-globaltable-replicaspecification-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}

/**
 * Determine whether the given properties match those of a `ReplicaSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicaSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_ReplicaSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contributorInsightsSpecification', CfnGlobalTable_ContributorInsightsSpecificationPropertyValidator)(properties.contributorInsightsSpecification));
    errors.collect(cdk.propertyValidator('globalSecondaryIndexes', cdk.listValidator(CfnGlobalTable_ReplicaGlobalSecondaryIndexSpecificationPropertyValidator))(properties.globalSecondaryIndexes));
    errors.collect(cdk.propertyValidator('pointInTimeRecoverySpecification', CfnGlobalTable_PointInTimeRecoverySpecificationPropertyValidator)(properties.pointInTimeRecoverySpecification));
    errors.collect(cdk.propertyValidator('readProvisionedThroughputSettings', CfnGlobalTable_ReadProvisionedThroughputSettingsPropertyValidator)(properties.readProvisionedThroughputSettings));
    errors.collect(cdk.propertyValidator('region', cdk.requiredValidator)(properties.region));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('sseSpecification', CfnGlobalTable_ReplicaSSESpecificationPropertyValidator)(properties.sseSpecification));
    errors.collect(cdk.propertyValidator('tableClass', cdk.validateString)(properties.tableClass));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "ReplicaSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReplicaSpecification` resource
 *
 * @param properties - the TypeScript properties of a `ReplicaSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.ReplicaSpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableReplicaSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_ReplicaSpecificationPropertyValidator(properties).assertSuccess();
    return {
        ContributorInsightsSpecification: cfnGlobalTableContributorInsightsSpecificationPropertyToCloudFormation(properties.contributorInsightsSpecification),
        GlobalSecondaryIndexes: cdk.listMapper(cfnGlobalTableReplicaGlobalSecondaryIndexSpecificationPropertyToCloudFormation)(properties.globalSecondaryIndexes),
        PointInTimeRecoverySpecification: cfnGlobalTablePointInTimeRecoverySpecificationPropertyToCloudFormation(properties.pointInTimeRecoverySpecification),
        ReadProvisionedThroughputSettings: cfnGlobalTableReadProvisionedThroughputSettingsPropertyToCloudFormation(properties.readProvisionedThroughputSettings),
        Region: cdk.stringToCloudFormation(properties.region),
        SSESpecification: cfnGlobalTableReplicaSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
        TableClass: cdk.stringToCloudFormation(properties.tableClass),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableReplicaSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.ReplicaSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.ReplicaSpecificationProperty>();
    ret.addPropertyResult('contributorInsightsSpecification', 'ContributorInsightsSpecification', properties.ContributorInsightsSpecification != null ? CfnGlobalTableContributorInsightsSpecificationPropertyFromCloudFormation(properties.ContributorInsightsSpecification) : undefined);
    ret.addPropertyResult('globalSecondaryIndexes', 'GlobalSecondaryIndexes', properties.GlobalSecondaryIndexes != null ? cfn_parse.FromCloudFormation.getArray(CfnGlobalTableReplicaGlobalSecondaryIndexSpecificationPropertyFromCloudFormation)(properties.GlobalSecondaryIndexes) : undefined);
    ret.addPropertyResult('pointInTimeRecoverySpecification', 'PointInTimeRecoverySpecification', properties.PointInTimeRecoverySpecification != null ? CfnGlobalTablePointInTimeRecoverySpecificationPropertyFromCloudFormation(properties.PointInTimeRecoverySpecification) : undefined);
    ret.addPropertyResult('readProvisionedThroughputSettings', 'ReadProvisionedThroughputSettings', properties.ReadProvisionedThroughputSettings != null ? CfnGlobalTableReadProvisionedThroughputSettingsPropertyFromCloudFormation(properties.ReadProvisionedThroughputSettings) : undefined);
    ret.addPropertyResult('region', 'Region', cfn_parse.FromCloudFormation.getString(properties.Region));
    ret.addPropertyResult('sseSpecification', 'SSESpecification', properties.SSESpecification != null ? CfnGlobalTableReplicaSSESpecificationPropertyFromCloudFormation(properties.SSESpecification) : undefined);
    ret.addPropertyResult('tableClass', 'TableClass', properties.TableClass != null ? cfn_parse.FromCloudFormation.getString(properties.TableClass) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents the settings used to enable server-side encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-ssespecification.html
     */
    export interface SSESpecificationProperty {
        /**
         * Indicates whether server-side encryption is performed using an AWS managed key or an AWS owned key. If enabled (true), server-side encryption type is set to KMS and an AWS managed key or customer managed key is used ( AWS KMS charges apply). If disabled (false) or not specified,server-side encryption is set to an AWS owned key. If you choose to use KMS encryption, you can also use customer managed KMS keys by specifying them in the `ReplicaSpecification.SSESpecification` object. You cannot mix AWS managed and customer managed KMS keys.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-ssespecification.html#cfn-dynamodb-globaltable-ssespecification-sseenabled
         */
        readonly sseEnabled: boolean | cdk.IResolvable;
        /**
         * Server-side encryption type. The only supported value is:
         *
         * - `KMS` - Server-side encryption that uses AWS Key Management Service . The key is stored in your account and is managed by AWS KMS ( AWS KMS charges apply).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-ssespecification.html#cfn-dynamodb-globaltable-ssespecification-ssetype
         */
        readonly sseType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_SSESpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.requiredValidator)(properties.sseEnabled));
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.validateBoolean)(properties.sseEnabled));
    errors.collect(cdk.propertyValidator('sseType', cdk.validateString)(properties.sseType));
    return errors.wrap('supplied properties not correct for "SSESpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.SSESpecification` resource
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.SSESpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableSSESpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_SSESpecificationPropertyValidator(properties).assertSuccess();
    return {
        SSEEnabled: cdk.booleanToCloudFormation(properties.sseEnabled),
        SSEType: cdk.stringToCloudFormation(properties.sseType),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableSSESpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.SSESpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.SSESpecificationProperty>();
    ret.addPropertyResult('sseEnabled', 'SSEEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.SSEEnabled));
    ret.addPropertyResult('sseType', 'SSEType', properties.SSEType != null ? cfn_parse.FromCloudFormation.getString(properties.SSEType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents the DynamoDB Streams configuration for a table in DynamoDB.
     *
     * You can only modify this value if your `AWS::DynamoDB::GlobalTable` contains only one entry in `Replicas` . You must specify a value for this property if your `AWS::DynamoDB::GlobalTable` contains more than one replica.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-streamspecification.html
     */
    export interface StreamSpecificationProperty {
        /**
         * When an item in the table is modified, `StreamViewType` determines what information is written to the stream for this table. Valid values for `StreamViewType` are:
         *
         * - `KEYS_ONLY` - Only the key attributes of the modified item are written to the stream.
         * - `NEW_IMAGE` - The entire item, as it appears after it was modified, is written to the stream.
         * - `OLD_IMAGE` - The entire item, as it appeared before it was modified, is written to the stream.
         * - `NEW_AND_OLD_IMAGES` - Both the new and the old item images of the item are written to the stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-streamspecification.html#cfn-dynamodb-globaltable-streamspecification-streamviewtype
         */
        readonly streamViewType: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_StreamSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamViewType', cdk.requiredValidator)(properties.streamViewType));
    errors.collect(cdk.propertyValidator('streamViewType', cdk.validateString)(properties.streamViewType));
    return errors.wrap('supplied properties not correct for "StreamSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.StreamSpecification` resource
 *
 * @param properties - the TypeScript properties of a `StreamSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.StreamSpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableStreamSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_StreamSpecificationPropertyValidator(properties).assertSuccess();
    return {
        StreamViewType: cdk.stringToCloudFormation(properties.streamViewType),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableStreamSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.StreamSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.StreamSpecificationProperty>();
    ret.addPropertyResult('streamViewType', 'StreamViewType', cfn_parse.FromCloudFormation.getString(properties.StreamViewType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Defines a target tracking scaling policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html
     */
    export interface TargetTrackingScalingPolicyConfigurationProperty {
        /**
         * Indicates whether scale in by the target tracking scaling policy is disabled. The default value is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-disablescalein
         */
        readonly disableScaleIn?: boolean | cdk.IResolvable;
        /**
         * The amount of time, in seconds, after a scale-in activity completes before another scale-in activity can start.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-scaleincooldown
         */
        readonly scaleInCooldown?: number;
        /**
         * The amount of time, in seconds, after a scale-out activity completes before another scale-out activity can start.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-scaleoutcooldown
         */
        readonly scaleOutCooldown?: number;
        /**
         * Defines a target value for the scaling policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-targettrackingscalingpolicyconfiguration.html#cfn-dynamodb-globaltable-targettrackingscalingpolicyconfiguration-targetvalue
         */
        readonly targetValue: number;
    }
}

/**
 * Determine whether the given properties match those of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_TargetTrackingScalingPolicyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('disableScaleIn', cdk.validateBoolean)(properties.disableScaleIn));
    errors.collect(cdk.propertyValidator('scaleInCooldown', cdk.validateNumber)(properties.scaleInCooldown));
    errors.collect(cdk.propertyValidator('scaleOutCooldown', cdk.validateNumber)(properties.scaleOutCooldown));
    errors.collect(cdk.propertyValidator('targetValue', cdk.requiredValidator)(properties.targetValue));
    errors.collect(cdk.propertyValidator('targetValue', cdk.validateNumber)(properties.targetValue));
    return errors.wrap('supplied properties not correct for "TargetTrackingScalingPolicyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.TargetTrackingScalingPolicyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TargetTrackingScalingPolicyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.TargetTrackingScalingPolicyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableTargetTrackingScalingPolicyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_TargetTrackingScalingPolicyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DisableScaleIn: cdk.booleanToCloudFormation(properties.disableScaleIn),
        ScaleInCooldown: cdk.numberToCloudFormation(properties.scaleInCooldown),
        ScaleOutCooldown: cdk.numberToCloudFormation(properties.scaleOutCooldown),
        TargetValue: cdk.numberToCloudFormation(properties.targetValue),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableTargetTrackingScalingPolicyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.TargetTrackingScalingPolicyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.TargetTrackingScalingPolicyConfigurationProperty>();
    ret.addPropertyResult('disableScaleIn', 'DisableScaleIn', properties.DisableScaleIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableScaleIn) : undefined);
    ret.addPropertyResult('scaleInCooldown', 'ScaleInCooldown', properties.ScaleInCooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScaleInCooldown) : undefined);
    ret.addPropertyResult('scaleOutCooldown', 'ScaleOutCooldown', properties.ScaleOutCooldown != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScaleOutCooldown) : undefined);
    ret.addPropertyResult('targetValue', 'TargetValue', cfn_parse.FromCloudFormation.getNumber(properties.TargetValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Represents the settings used to enable or disable Time to Live (TTL) for the specified table. All replicas will have the same time to live configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-timetolivespecification.html
     */
    export interface TimeToLiveSpecificationProperty {
        /**
         * The name of the attribute used to store the expiration time for items in the table.
         *
         * Currently, you cannot directly change the attribute name used to evaluate time to live. In order to do so, you must first disable time to live, and then re-enable it with the new attribute name. It can take up to one hour for changes to time to live to take effect. If you attempt to modify time to live within that time window, your stack operation might be delayed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-timetolivespecification.html#cfn-dynamodb-globaltable-timetolivespecification-attributename
         */
        readonly attributeName?: string;
        /**
         * Indicates whether TTL is to be enabled (true) or disabled (false) on the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-timetolivespecification.html#cfn-dynamodb-globaltable-timetolivespecification-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TimeToLiveSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `TimeToLiveSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_TimeToLiveSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TimeToLiveSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.TimeToLiveSpecification` resource
 *
 * @param properties - the TypeScript properties of a `TimeToLiveSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.TimeToLiveSpecification` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableTimeToLiveSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_TimeToLiveSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableTimeToLiveSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.TimeToLiveSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.TimeToLiveSpecificationProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', properties.AttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeName) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGlobalTable {
    /**
     * Specifies an auto scaling policy for write capacity. This policy will be applied to all replicas. This setting must be specified if `BillingMode` is set to `PROVISIONED` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-writeprovisionedthroughputsettings.html
     */
    export interface WriteProvisionedThroughputSettingsProperty {
        /**
         * Specifies auto scaling settings for the replica table or global secondary index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-globaltable-writeprovisionedthroughputsettings.html#cfn-dynamodb-globaltable-writeprovisionedthroughputsettings-writecapacityautoscalingsettings
         */
        readonly writeCapacityAutoScalingSettings?: CfnGlobalTable.CapacityAutoScalingSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `WriteProvisionedThroughputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `WriteProvisionedThroughputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnGlobalTable_WriteProvisionedThroughputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('writeCapacityAutoScalingSettings', CfnGlobalTable_CapacityAutoScalingSettingsPropertyValidator)(properties.writeCapacityAutoScalingSettings));
    return errors.wrap('supplied properties not correct for "WriteProvisionedThroughputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.WriteProvisionedThroughputSettings` resource
 *
 * @param properties - the TypeScript properties of a `WriteProvisionedThroughputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::GlobalTable.WriteProvisionedThroughputSettings` resource.
 */
// @ts-ignore TS6133
function cfnGlobalTableWriteProvisionedThroughputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalTable_WriteProvisionedThroughputSettingsPropertyValidator(properties).assertSuccess();
    return {
        WriteCapacityAutoScalingSettings: cfnGlobalTableCapacityAutoScalingSettingsPropertyToCloudFormation(properties.writeCapacityAutoScalingSettings),
    };
}

// @ts-ignore TS6133
function CfnGlobalTableWriteProvisionedThroughputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalTable.WriteProvisionedThroughputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalTable.WriteProvisionedThroughputSettingsProperty>();
    ret.addPropertyResult('writeCapacityAutoScalingSettings', 'WriteCapacityAutoScalingSettings', properties.WriteCapacityAutoScalingSettings != null ? CfnGlobalTableCapacityAutoScalingSettingsPropertyFromCloudFormation(properties.WriteCapacityAutoScalingSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTable`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
 */
export interface CfnTableProps {

    /**
     * Specifies the attributes that make up the primary key for the table. The attributes in the `KeySchema` property must also be defined in the `AttributeDefinitions` property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-keyschema
     */
    readonly keySchema: Array<CfnTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of attributes that describe the key schema for the table and indexes.
     *
     * This property is required to create a DynamoDB table.
     *
     * Update requires: [Some interruptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-some-interrupt) . Replacement if you edit an existing AttributeDefinition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-attributedefinitions
     */
    readonly attributeDefinitions?: Array<CfnTable.AttributeDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specify how you are charged for read and write throughput and how you manage capacity.
     *
     * Valid values include:
     *
     * - `PROVISIONED` - We recommend using `PROVISIONED` for predictable workloads. `PROVISIONED` sets the billing mode to [Provisioned Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.ProvisionedThroughput.Manual) .
     * - `PAY_PER_REQUEST` - We recommend using `PAY_PER_REQUEST` for unpredictable workloads. `PAY_PER_REQUEST` sets the billing mode to [On-Demand Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.OnDemand) .
     *
     * If not specified, the default is `PROVISIONED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-billingmode
     */
    readonly billingMode?: string;

    /**
     * The settings used to enable or disable CloudWatch Contributor Insights for the specified table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-contributorinsightsspecification
     */
    readonly contributorInsightsSpecification?: CfnTable.ContributorInsightsSpecificationProperty | cdk.IResolvable;

    /**
     * Global secondary indexes to be created on the table. You can create up to 20 global secondary indexes.
     *
     * > If you update a table to include a new global secondary index, AWS CloudFormation initiates the index creation and then proceeds with the stack update. AWS CloudFormation doesn't wait for the index to complete creation because the backfilling phase can take a long time, depending on the size of the table. You can't use the index or update the table until the index's status is `ACTIVE` . You can track its status by using the DynamoDB [DescribeTable](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/describe-table.html) command.
     * >
     * > If you add or delete an index during an update, we recommend that you don't update any other resources. If your stack fails to update and is rolled back while adding a new index, you must manually delete the index.
     * >
     * > Updates are not supported. The following are exceptions:
     * >
     * > - If you update either the contributor insights specification or the provisioned throughput values of global secondary indexes, you can update the table without interruption.
     * > - You can delete or add one global secondary index without interruption. If you do both in the same update (for example, by changing the index's logical ID), the update fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-globalsecondaryindexes
     */
    readonly globalSecondaryIndexes?: Array<CfnTable.GlobalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the properties of data being imported from the S3 bucket source to the table.
     *
     * > If you specify the `ImportSourceSpecification` property, and also specify either the `StreamSpecification` or `TableClass` property, the IAM entity creating/updating stack must have `UpdateTable` permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-importsourcespecification
     */
    readonly importSourceSpecification?: CfnTable.ImportSourceSpecificationProperty | cdk.IResolvable;

    /**
     * The Kinesis Data Streams configuration for the specified table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-kinesisstreamspecification
     */
    readonly kinesisStreamSpecification?: CfnTable.KinesisStreamSpecificationProperty | cdk.IResolvable;

    /**
     * Local secondary indexes to be created on the table. You can create up to 5 local secondary indexes. Each index is scoped to a given hash key value. The size of each hash key can be up to 10 gigabytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-localsecondaryindexes
     */
    readonly localSecondaryIndexes?: Array<CfnTable.LocalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The settings used to enable point in time recovery.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-pointintimerecoveryspecification
     */
    readonly pointInTimeRecoverySpecification?: CfnTable.PointInTimeRecoverySpecificationProperty | cdk.IResolvable;

    /**
     * Throughput for the specified table, which consists of values for `ReadCapacityUnits` and `WriteCapacityUnits` . For more information about the contents of a provisioned throughput structure, see [Amazon DynamoDB Table ProvisionedThroughput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html) .
     *
     * If you set `BillingMode` as `PROVISIONED` , you must specify this property. If you set `BillingMode` as `PAY_PER_REQUEST` , you cannot specify this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-provisionedthroughput
     */
    readonly provisionedThroughput?: CfnTable.ProvisionedThroughputProperty | cdk.IResolvable;

    /**
     * Specifies the settings to enable server-side encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-ssespecification
     */
    readonly sseSpecification?: CfnTable.SSESpecificationProperty | cdk.IResolvable;

    /**
     * The settings for the DynamoDB table stream, which capture changes to items stored in the table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-streamspecification
     */
    readonly streamSpecification?: CfnTable.StreamSpecificationProperty | cdk.IResolvable;

    /**
     * The table class of the new table. Valid values are `STANDARD` and `STANDARD_INFREQUENT_ACCESS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tableclass
     */
    readonly tableClass?: string;

    /**
     * A name for the table. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the table name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tablename
     */
    readonly tableName?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Specifies the Time to Live (TTL) settings for the table.
     *
     * > For detailed information about the limits in DynamoDB, see [Limits in Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html) in the Amazon DynamoDB Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-timetolivespecification
     */
    readonly timeToLiveSpecification?: CfnTable.TimeToLiveSpecificationProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('attributeDefinitions', cdk.listValidator(CfnTable_AttributeDefinitionPropertyValidator))(properties.attributeDefinitions));
    errors.collect(cdk.propertyValidator('billingMode', cdk.validateString)(properties.billingMode));
    errors.collect(cdk.propertyValidator('contributorInsightsSpecification', CfnTable_ContributorInsightsSpecificationPropertyValidator)(properties.contributorInsightsSpecification));
    errors.collect(cdk.propertyValidator('globalSecondaryIndexes', cdk.listValidator(CfnTable_GlobalSecondaryIndexPropertyValidator))(properties.globalSecondaryIndexes));
    errors.collect(cdk.propertyValidator('importSourceSpecification', CfnTable_ImportSourceSpecificationPropertyValidator)(properties.importSourceSpecification));
    errors.collect(cdk.propertyValidator('keySchema', cdk.requiredValidator)(properties.keySchema));
    errors.collect(cdk.propertyValidator('keySchema', cdk.listValidator(CfnTable_KeySchemaPropertyValidator))(properties.keySchema));
    errors.collect(cdk.propertyValidator('kinesisStreamSpecification', CfnTable_KinesisStreamSpecificationPropertyValidator)(properties.kinesisStreamSpecification));
    errors.collect(cdk.propertyValidator('localSecondaryIndexes', cdk.listValidator(CfnTable_LocalSecondaryIndexPropertyValidator))(properties.localSecondaryIndexes));
    errors.collect(cdk.propertyValidator('pointInTimeRecoverySpecification', CfnTable_PointInTimeRecoverySpecificationPropertyValidator)(properties.pointInTimeRecoverySpecification));
    errors.collect(cdk.propertyValidator('provisionedThroughput', CfnTable_ProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
    errors.collect(cdk.propertyValidator('sseSpecification', CfnTable_SSESpecificationPropertyValidator)(properties.sseSpecification));
    errors.collect(cdk.propertyValidator('streamSpecification', CfnTable_StreamSpecificationPropertyValidator)(properties.streamSpecification));
    errors.collect(cdk.propertyValidator('tableClass', cdk.validateString)(properties.tableClass));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('timeToLiveSpecification', CfnTable_TimeToLiveSpecificationPropertyValidator)(properties.timeToLiveSpecification));
    return errors.wrap('supplied properties not correct for "CfnTableProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table` resource
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table` resource.
 */
// @ts-ignore TS6133
function cfnTablePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTablePropsValidator(properties).assertSuccess();
    return {
        KeySchema: cdk.listMapper(cfnTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        AttributeDefinitions: cdk.listMapper(cfnTableAttributeDefinitionPropertyToCloudFormation)(properties.attributeDefinitions),
        BillingMode: cdk.stringToCloudFormation(properties.billingMode),
        ContributorInsightsSpecification: cfnTableContributorInsightsSpecificationPropertyToCloudFormation(properties.contributorInsightsSpecification),
        GlobalSecondaryIndexes: cdk.listMapper(cfnTableGlobalSecondaryIndexPropertyToCloudFormation)(properties.globalSecondaryIndexes),
        ImportSourceSpecification: cfnTableImportSourceSpecificationPropertyToCloudFormation(properties.importSourceSpecification),
        KinesisStreamSpecification: cfnTableKinesisStreamSpecificationPropertyToCloudFormation(properties.kinesisStreamSpecification),
        LocalSecondaryIndexes: cdk.listMapper(cfnTableLocalSecondaryIndexPropertyToCloudFormation)(properties.localSecondaryIndexes),
        PointInTimeRecoverySpecification: cfnTablePointInTimeRecoverySpecificationPropertyToCloudFormation(properties.pointInTimeRecoverySpecification),
        ProvisionedThroughput: cfnTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
        SSESpecification: cfnTableSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
        StreamSpecification: cfnTableStreamSpecificationPropertyToCloudFormation(properties.streamSpecification),
        TableClass: cdk.stringToCloudFormation(properties.tableClass),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TimeToLiveSpecification: cfnTableTimeToLiveSpecificationPropertyToCloudFormation(properties.timeToLiveSpecification),
    };
}

// @ts-ignore TS6133
function CfnTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTableProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTableProps>();
    ret.addPropertyResult('keySchema', 'KeySchema', cfn_parse.FromCloudFormation.getArray(CfnTableKeySchemaPropertyFromCloudFormation)(properties.KeySchema));
    ret.addPropertyResult('attributeDefinitions', 'AttributeDefinitions', properties.AttributeDefinitions != null ? cfn_parse.FromCloudFormation.getArray(CfnTableAttributeDefinitionPropertyFromCloudFormation)(properties.AttributeDefinitions) : undefined);
    ret.addPropertyResult('billingMode', 'BillingMode', properties.BillingMode != null ? cfn_parse.FromCloudFormation.getString(properties.BillingMode) : undefined);
    ret.addPropertyResult('contributorInsightsSpecification', 'ContributorInsightsSpecification', properties.ContributorInsightsSpecification != null ? CfnTableContributorInsightsSpecificationPropertyFromCloudFormation(properties.ContributorInsightsSpecification) : undefined);
    ret.addPropertyResult('globalSecondaryIndexes', 'GlobalSecondaryIndexes', properties.GlobalSecondaryIndexes != null ? cfn_parse.FromCloudFormation.getArray(CfnTableGlobalSecondaryIndexPropertyFromCloudFormation)(properties.GlobalSecondaryIndexes) : undefined);
    ret.addPropertyResult('importSourceSpecification', 'ImportSourceSpecification', properties.ImportSourceSpecification != null ? CfnTableImportSourceSpecificationPropertyFromCloudFormation(properties.ImportSourceSpecification) : undefined);
    ret.addPropertyResult('kinesisStreamSpecification', 'KinesisStreamSpecification', properties.KinesisStreamSpecification != null ? CfnTableKinesisStreamSpecificationPropertyFromCloudFormation(properties.KinesisStreamSpecification) : undefined);
    ret.addPropertyResult('localSecondaryIndexes', 'LocalSecondaryIndexes', properties.LocalSecondaryIndexes != null ? cfn_parse.FromCloudFormation.getArray(CfnTableLocalSecondaryIndexPropertyFromCloudFormation)(properties.LocalSecondaryIndexes) : undefined);
    ret.addPropertyResult('pointInTimeRecoverySpecification', 'PointInTimeRecoverySpecification', properties.PointInTimeRecoverySpecification != null ? CfnTablePointInTimeRecoverySpecificationPropertyFromCloudFormation(properties.PointInTimeRecoverySpecification) : undefined);
    ret.addPropertyResult('provisionedThroughput', 'ProvisionedThroughput', properties.ProvisionedThroughput != null ? CfnTableProvisionedThroughputPropertyFromCloudFormation(properties.ProvisionedThroughput) : undefined);
    ret.addPropertyResult('sseSpecification', 'SSESpecification', properties.SSESpecification != null ? CfnTableSSESpecificationPropertyFromCloudFormation(properties.SSESpecification) : undefined);
    ret.addPropertyResult('streamSpecification', 'StreamSpecification', properties.StreamSpecification != null ? CfnTableStreamSpecificationPropertyFromCloudFormation(properties.StreamSpecification) : undefined);
    ret.addPropertyResult('tableClass', 'TableClass', properties.TableClass != null ? cfn_parse.FromCloudFormation.getString(properties.TableClass) : undefined);
    ret.addPropertyResult('tableName', 'TableName', properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('timeToLiveSpecification', 'TimeToLiveSpecification', properties.TimeToLiveSpecification != null ? CfnTableTimeToLiveSpecificationPropertyFromCloudFormation(properties.TimeToLiveSpecification) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DynamoDB::Table`
 *
 * The `AWS::DynamoDB::Table` resource creates a DynamoDB table. For more information, see [CreateTable](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html) in the *Amazon DynamoDB API Reference* .
 *
 * You should be aware of the following behaviors when working with DynamoDB tables:
 *
 * - AWS CloudFormation typically creates DynamoDB tables in parallel. However, if your template includes multiple DynamoDB tables with indexes, you must declare dependencies so that the tables are created sequentially. Amazon DynamoDB limits the number of tables with secondary indexes that are in the creating state. If you create multiple tables with indexes at the same time, DynamoDB returns an error and the stack operation fails. For an example, see [DynamoDB Table with a DependsOn Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#aws-resource-dynamodb-table--examples--DynamoDB_Table_with_a_DependsOn_Attribute) .
 *
 * > Our guidance is to use the latest schema documented here for your AWS CloudFormation templates. This schema supports the provisioning of all table settings below. When using this schema in your AWS CloudFormation templates, please ensure that your Identity and Access Management ( IAM ) policies are updated with appropriate permissions to allow for the authorization of these setting changes.
 *
 * @cloudformationResource AWS::DynamoDB::Table
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
 */
export class CfnTable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DynamoDB::Table";

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
     * The Amazon Resource Name (ARN) of the DynamoDB table, such as `arn:aws:dynamodb:us-east-2:123456789012:table/myDynamoDBTable` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ARN of the DynamoDB stream, such as `arn:aws:dynamodb:us-east-1:123456789012:table/testddbstack-myDynamoDBTable-012A1SL7SMP5Q/stream/2015-11-30T20:10:00.000` .
     *
     * > You must specify the `StreamSpecification` property to use this attribute.
     * @cloudformationAttribute StreamArn
     */
    public readonly attrStreamArn: string;

    /**
     * Specifies the attributes that make up the primary key for the table. The attributes in the `KeySchema` property must also be defined in the `AttributeDefinitions` property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-keyschema
     */
    public keySchema: Array<CfnTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of attributes that describe the key schema for the table and indexes.
     *
     * This property is required to create a DynamoDB table.
     *
     * Update requires: [Some interruptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-some-interrupt) . Replacement if you edit an existing AttributeDefinition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-attributedefinitions
     */
    public attributeDefinitions: Array<CfnTable.AttributeDefinitionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specify how you are charged for read and write throughput and how you manage capacity.
     *
     * Valid values include:
     *
     * - `PROVISIONED` - We recommend using `PROVISIONED` for predictable workloads. `PROVISIONED` sets the billing mode to [Provisioned Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.ProvisionedThroughput.Manual) .
     * - `PAY_PER_REQUEST` - We recommend using `PAY_PER_REQUEST` for unpredictable workloads. `PAY_PER_REQUEST` sets the billing mode to [On-Demand Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.OnDemand) .
     *
     * If not specified, the default is `PROVISIONED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-billingmode
     */
    public billingMode: string | undefined;

    /**
     * The settings used to enable or disable CloudWatch Contributor Insights for the specified table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-contributorinsightsspecification
     */
    public contributorInsightsSpecification: CfnTable.ContributorInsightsSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * Global secondary indexes to be created on the table. You can create up to 20 global secondary indexes.
     *
     * > If you update a table to include a new global secondary index, AWS CloudFormation initiates the index creation and then proceeds with the stack update. AWS CloudFormation doesn't wait for the index to complete creation because the backfilling phase can take a long time, depending on the size of the table. You can't use the index or update the table until the index's status is `ACTIVE` . You can track its status by using the DynamoDB [DescribeTable](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/describe-table.html) command.
     * >
     * > If you add or delete an index during an update, we recommend that you don't update any other resources. If your stack fails to update and is rolled back while adding a new index, you must manually delete the index.
     * >
     * > Updates are not supported. The following are exceptions:
     * >
     * > - If you update either the contributor insights specification or the provisioned throughput values of global secondary indexes, you can update the table without interruption.
     * > - You can delete or add one global secondary index without interruption. If you do both in the same update (for example, by changing the index's logical ID), the update fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-globalsecondaryindexes
     */
    public globalSecondaryIndexes: Array<CfnTable.GlobalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specifies the properties of data being imported from the S3 bucket source to the table.
     *
     * > If you specify the `ImportSourceSpecification` property, and also specify either the `StreamSpecification` or `TableClass` property, the IAM entity creating/updating stack must have `UpdateTable` permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-importsourcespecification
     */
    public importSourceSpecification: CfnTable.ImportSourceSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * The Kinesis Data Streams configuration for the specified table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-kinesisstreamspecification
     */
    public kinesisStreamSpecification: CfnTable.KinesisStreamSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * Local secondary indexes to be created on the table. You can create up to 5 local secondary indexes. Each index is scoped to a given hash key value. The size of each hash key can be up to 10 gigabytes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-localsecondaryindexes
     */
    public localSecondaryIndexes: Array<CfnTable.LocalSecondaryIndexProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The settings used to enable point in time recovery.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-pointintimerecoveryspecification
     */
    public pointInTimeRecoverySpecification: CfnTable.PointInTimeRecoverySpecificationProperty | cdk.IResolvable | undefined;

    /**
     * Throughput for the specified table, which consists of values for `ReadCapacityUnits` and `WriteCapacityUnits` . For more information about the contents of a provisioned throughput structure, see [Amazon DynamoDB Table ProvisionedThroughput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html) .
     *
     * If you set `BillingMode` as `PROVISIONED` , you must specify this property. If you set `BillingMode` as `PAY_PER_REQUEST` , you cannot specify this property.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-provisionedthroughput
     */
    public provisionedThroughput: CfnTable.ProvisionedThroughputProperty | cdk.IResolvable | undefined;

    /**
     * Specifies the settings to enable server-side encryption.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-ssespecification
     */
    public sseSpecification: CfnTable.SSESpecificationProperty | cdk.IResolvable | undefined;

    /**
     * The settings for the DynamoDB table stream, which capture changes to items stored in the table.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-streamspecification
     */
    public streamSpecification: CfnTable.StreamSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * The table class of the new table. Valid values are `STANDARD` and `STANDARD_INFREQUENT_ACCESS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tableclass
     */
    public tableClass: string | undefined;

    /**
     * A name for the table. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the table name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tablename
     */
    public tableName: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Specifies the Time to Live (TTL) settings for the table.
     *
     * > For detailed information about the limits in DynamoDB, see [Limits in Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html) in the Amazon DynamoDB Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-timetolivespecification
     */
    public timeToLiveSpecification: CfnTable.TimeToLiveSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::DynamoDB::Table`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTableProps) {
        super(scope, id, { type: CfnTable.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'keySchema', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrStreamArn = cdk.Token.asString(this.getAtt('StreamArn', cdk.ResolutionTypeHint.STRING));

        this.keySchema = props.keySchema;
        this.attributeDefinitions = props.attributeDefinitions;
        this.billingMode = props.billingMode;
        this.contributorInsightsSpecification = props.contributorInsightsSpecification;
        this.globalSecondaryIndexes = props.globalSecondaryIndexes;
        this.importSourceSpecification = props.importSourceSpecification;
        this.kinesisStreamSpecification = props.kinesisStreamSpecification;
        this.localSecondaryIndexes = props.localSecondaryIndexes;
        this.pointInTimeRecoverySpecification = props.pointInTimeRecoverySpecification;
        this.provisionedThroughput = props.provisionedThroughput;
        this.sseSpecification = props.sseSpecification;
        this.streamSpecification = props.streamSpecification;
        this.tableClass = props.tableClass;
        this.tableName = props.tableName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DynamoDB::Table", props.tags, { tagPropertyName: 'tags' });
        this.timeToLiveSpecification = props.timeToLiveSpecification;
        if (this.node.scope && cdk.Resource.isResource(this.node.scope)) {
            this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined
              ? ['\'AWS::DynamoDB::Table\' is a stateful resource type, and you must specify a Removal Policy for it. Call \'resource.applyRemovalPolicy()\'.']
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
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTable.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            keySchema: this.keySchema,
            attributeDefinitions: this.attributeDefinitions,
            billingMode: this.billingMode,
            contributorInsightsSpecification: this.contributorInsightsSpecification,
            globalSecondaryIndexes: this.globalSecondaryIndexes,
            importSourceSpecification: this.importSourceSpecification,
            kinesisStreamSpecification: this.kinesisStreamSpecification,
            localSecondaryIndexes: this.localSecondaryIndexes,
            pointInTimeRecoverySpecification: this.pointInTimeRecoverySpecification,
            provisionedThroughput: this.provisionedThroughput,
            sseSpecification: this.sseSpecification,
            streamSpecification: this.streamSpecification,
            tableClass: this.tableClass,
            tableName: this.tableName,
            tags: this.tags.renderTags(),
            timeToLiveSpecification: this.timeToLiveSpecification,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTablePropsToCloudFormation(props);
    }
}

export namespace CfnTable {
    /**
     * Represents an attribute for describing the key schema for the table and indexes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-attributedefinition.html
     */
    export interface AttributeDefinitionProperty {
        /**
         * A name for the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-attributedefinition.html#cfn-dynamodb-table-attributedefinition-attributename
         */
        readonly attributeName: string;
        /**
         * The data type for the attribute, where:
         *
         * - `S` - the attribute is of type String
         * - `N` - the attribute is of type Number
         * - `B` - the attribute is of type Binary
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-attributedefinition.html#cfn-dynamodb-table-attributedefinition-attributetype
         */
        readonly attributeType: string;
    }
}

/**
 * Determine whether the given properties match those of a `AttributeDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_AttributeDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.requiredValidator)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeType', cdk.requiredValidator)(properties.attributeType));
    errors.collect(cdk.propertyValidator('attributeType', cdk.validateString)(properties.attributeType));
    return errors.wrap('supplied properties not correct for "AttributeDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.AttributeDefinition` resource
 *
 * @param properties - the TypeScript properties of a `AttributeDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.AttributeDefinition` resource.
 */
// @ts-ignore TS6133
function cfnTableAttributeDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_AttributeDefinitionPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        AttributeType: cdk.stringToCloudFormation(properties.attributeType),
    };
}

// @ts-ignore TS6133
function CfnTableAttributeDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.AttributeDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.AttributeDefinitionProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', cfn_parse.FromCloudFormation.getString(properties.AttributeName));
    ret.addPropertyResult('attributeType', 'AttributeType', cfn_parse.FromCloudFormation.getString(properties.AttributeType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The settings used to enable or disable CloudWatch Contributor Insights.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-contributorinsightsspecification.html
     */
    export interface ContributorInsightsSpecificationProperty {
        /**
         * Indicates whether CloudWatch Contributor Insights are to be enabled (true) or disabled (false).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-contributorinsightsspecification.html#cfn-dynamodb-table-contributorinsightsspecification-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContributorInsightsSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ContributorInsightsSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ContributorInsightsSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "ContributorInsightsSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.ContributorInsightsSpecification` resource
 *
 * @param properties - the TypeScript properties of a `ContributorInsightsSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.ContributorInsightsSpecification` resource.
 */
// @ts-ignore TS6133
function cfnTableContributorInsightsSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_ContributorInsightsSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnTableContributorInsightsSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ContributorInsightsSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ContributorInsightsSpecificationProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The options for imported source files in CSV format. The values are Delimiter and HeaderList.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-csv.html
     */
    export interface CsvProperty {
        /**
         * The delimiter used for separating items in the CSV file being imported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-csv.html#cfn-dynamodb-table-csv-delimiter
         */
        readonly delimiter?: string;
        /**
         * List of the headers used to specify a common header for all source CSV files being imported. If this field is specified then the first line of each CSV file is treated as data instead of the header. If this field is not specified the the first line of each CSV file is treated as the header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-csv.html#cfn-dynamodb-table-csv-headerlist
         */
        readonly headerList?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CsvProperty`
 *
 * @param properties - the TypeScript properties of a `CsvProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_CsvPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('delimiter', cdk.validateString)(properties.delimiter));
    errors.collect(cdk.propertyValidator('headerList', cdk.listValidator(cdk.validateString))(properties.headerList));
    return errors.wrap('supplied properties not correct for "CsvProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.Csv` resource
 *
 * @param properties - the TypeScript properties of a `CsvProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.Csv` resource.
 */
// @ts-ignore TS6133
function cfnTableCsvPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_CsvPropertyValidator(properties).assertSuccess();
    return {
        Delimiter: cdk.stringToCloudFormation(properties.delimiter),
        HeaderList: cdk.listMapper(cdk.stringToCloudFormation)(properties.headerList),
    };
}

// @ts-ignore TS6133
function CfnTableCsvPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.CsvProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.CsvProperty>();
    ret.addPropertyResult('delimiter', 'Delimiter', properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined);
    ret.addPropertyResult('headerList', 'HeaderList', properties.HeaderList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.HeaderList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Represents the properties of a global secondary index.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-globalsecondaryindex.html
     */
    export interface GlobalSecondaryIndexProperty {
        /**
         * The settings used to enable or disable CloudWatch Contributor Insights for the specified global secondary index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-globalsecondaryindex.html#cfn-dynamodb-table-globalsecondaryindex-contributorinsightsspecification
         */
        readonly contributorInsightsSpecification?: CfnTable.ContributorInsightsSpecificationProperty | cdk.IResolvable;
        /**
         * The name of the global secondary index. The name must be unique among all other indexes on this table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-globalsecondaryindex.html#cfn-dynamodb-table-globalsecondaryindex-indexname
         */
        readonly indexName: string;
        /**
         * The complete key schema for a global secondary index, which consists of one or more pairs of attribute names and key types:
         *
         * - `HASH` - partition key
         * - `RANGE` - sort key
         *
         * > The partition key of an item is also known as its *hash attribute* . The term "hash attribute" derives from DynamoDB's usage of an internal hash function to evenly distribute data items across partitions, based on their partition key values.
         * >
         * > The sort key of an item is also known as its *range attribute* . The term "range attribute" derives from the way DynamoDB stores items with the same partition key physically close together, in sorted order by the sort key value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-globalsecondaryindex.html#cfn-dynamodb-table-globalsecondaryindex-keyschema
         */
        readonly keySchema: Array<CfnTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Represents attributes that are copied (projected) from the table into the global secondary index. These are in addition to the primary key attributes and index key attributes, which are automatically projected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-globalsecondaryindex.html#cfn-dynamodb-table-globalsecondaryindex-projection
         */
        readonly projection: CfnTable.ProjectionProperty | cdk.IResolvable;
        /**
         * Represents the provisioned throughput settings for the specified global secondary index.
         *
         * For current minimum and maximum provisioned throughput values, see [Service, Account, and Table Quotas](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html) in the *Amazon DynamoDB Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-globalsecondaryindex.html#cfn-dynamodb-table-globalsecondaryindex-provisionedthroughput
         */
        readonly provisionedThroughput?: CfnTable.ProvisionedThroughputProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GlobalSecondaryIndexProperty`
 *
 * @param properties - the TypeScript properties of a `GlobalSecondaryIndexProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_GlobalSecondaryIndexPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contributorInsightsSpecification', CfnTable_ContributorInsightsSpecificationPropertyValidator)(properties.contributorInsightsSpecification));
    errors.collect(cdk.propertyValidator('indexName', cdk.requiredValidator)(properties.indexName));
    errors.collect(cdk.propertyValidator('indexName', cdk.validateString)(properties.indexName));
    errors.collect(cdk.propertyValidator('keySchema', cdk.requiredValidator)(properties.keySchema));
    errors.collect(cdk.propertyValidator('keySchema', cdk.listValidator(CfnTable_KeySchemaPropertyValidator))(properties.keySchema));
    errors.collect(cdk.propertyValidator('projection', cdk.requiredValidator)(properties.projection));
    errors.collect(cdk.propertyValidator('projection', CfnTable_ProjectionPropertyValidator)(properties.projection));
    errors.collect(cdk.propertyValidator('provisionedThroughput', CfnTable_ProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
    return errors.wrap('supplied properties not correct for "GlobalSecondaryIndexProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.GlobalSecondaryIndex` resource
 *
 * @param properties - the TypeScript properties of a `GlobalSecondaryIndexProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.GlobalSecondaryIndex` resource.
 */
// @ts-ignore TS6133
function cfnTableGlobalSecondaryIndexPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_GlobalSecondaryIndexPropertyValidator(properties).assertSuccess();
    return {
        ContributorInsightsSpecification: cfnTableContributorInsightsSpecificationPropertyToCloudFormation(properties.contributorInsightsSpecification),
        IndexName: cdk.stringToCloudFormation(properties.indexName),
        KeySchema: cdk.listMapper(cfnTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        Projection: cfnTableProjectionPropertyToCloudFormation(properties.projection),
        ProvisionedThroughput: cfnTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
    };
}

// @ts-ignore TS6133
function CfnTableGlobalSecondaryIndexPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.GlobalSecondaryIndexProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.GlobalSecondaryIndexProperty>();
    ret.addPropertyResult('contributorInsightsSpecification', 'ContributorInsightsSpecification', properties.ContributorInsightsSpecification != null ? CfnTableContributorInsightsSpecificationPropertyFromCloudFormation(properties.ContributorInsightsSpecification) : undefined);
    ret.addPropertyResult('indexName', 'IndexName', cfn_parse.FromCloudFormation.getString(properties.IndexName));
    ret.addPropertyResult('keySchema', 'KeySchema', cfn_parse.FromCloudFormation.getArray(CfnTableKeySchemaPropertyFromCloudFormation)(properties.KeySchema));
    ret.addPropertyResult('projection', 'Projection', CfnTableProjectionPropertyFromCloudFormation(properties.Projection));
    ret.addPropertyResult('provisionedThroughput', 'ProvisionedThroughput', properties.ProvisionedThroughput != null ? CfnTableProvisionedThroughputPropertyFromCloudFormation(properties.ProvisionedThroughput) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Specifies the properties of data being imported from the S3 bucket source to the table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-importsourcespecification.html
     */
    export interface ImportSourceSpecificationProperty {
        /**
         * Type of compression to be used on the input coming from the imported table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-importsourcespecification.html#cfn-dynamodb-table-importsourcespecification-inputcompressiontype
         */
        readonly inputCompressionType?: string;
        /**
         * The format of the source data. Valid values for `ImportFormat` are `CSV` , `DYNAMODB_JSON` or `ION` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-importsourcespecification.html#cfn-dynamodb-table-importsourcespecification-inputformat
         */
        readonly inputFormat: string;
        /**
         * Additional properties that specify how the input is formatted,
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-importsourcespecification.html#cfn-dynamodb-table-importsourcespecification-inputformatoptions
         */
        readonly inputFormatOptions?: CfnTable.InputFormatOptionsProperty | cdk.IResolvable;
        /**
         * The S3 bucket that provides the source for the import.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-importsourcespecification.html#cfn-dynamodb-table-importsourcespecification-s3bucketsource
         */
        readonly s3BucketSource: CfnTable.S3BucketSourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ImportSourceSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ImportSourceSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ImportSourceSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputCompressionType', cdk.validateString)(properties.inputCompressionType));
    errors.collect(cdk.propertyValidator('inputFormat', cdk.requiredValidator)(properties.inputFormat));
    errors.collect(cdk.propertyValidator('inputFormat', cdk.validateString)(properties.inputFormat));
    errors.collect(cdk.propertyValidator('inputFormatOptions', CfnTable_InputFormatOptionsPropertyValidator)(properties.inputFormatOptions));
    errors.collect(cdk.propertyValidator('s3BucketSource', cdk.requiredValidator)(properties.s3BucketSource));
    errors.collect(cdk.propertyValidator('s3BucketSource', CfnTable_S3BucketSourcePropertyValidator)(properties.s3BucketSource));
    return errors.wrap('supplied properties not correct for "ImportSourceSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.ImportSourceSpecification` resource
 *
 * @param properties - the TypeScript properties of a `ImportSourceSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.ImportSourceSpecification` resource.
 */
// @ts-ignore TS6133
function cfnTableImportSourceSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_ImportSourceSpecificationPropertyValidator(properties).assertSuccess();
    return {
        InputCompressionType: cdk.stringToCloudFormation(properties.inputCompressionType),
        InputFormat: cdk.stringToCloudFormation(properties.inputFormat),
        InputFormatOptions: cfnTableInputFormatOptionsPropertyToCloudFormation(properties.inputFormatOptions),
        S3BucketSource: cfnTableS3BucketSourcePropertyToCloudFormation(properties.s3BucketSource),
    };
}

// @ts-ignore TS6133
function CfnTableImportSourceSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ImportSourceSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ImportSourceSpecificationProperty>();
    ret.addPropertyResult('inputCompressionType', 'InputCompressionType', properties.InputCompressionType != null ? cfn_parse.FromCloudFormation.getString(properties.InputCompressionType) : undefined);
    ret.addPropertyResult('inputFormat', 'InputFormat', cfn_parse.FromCloudFormation.getString(properties.InputFormat));
    ret.addPropertyResult('inputFormatOptions', 'InputFormatOptions', properties.InputFormatOptions != null ? CfnTableInputFormatOptionsPropertyFromCloudFormation(properties.InputFormatOptions) : undefined);
    ret.addPropertyResult('s3BucketSource', 'S3BucketSource', CfnTableS3BucketSourcePropertyFromCloudFormation(properties.S3BucketSource));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The format options for the data that was imported into the target table. There is one value, CsvOption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-inputformatoptions.html
     */
    export interface InputFormatOptionsProperty {
        /**
         * The options for imported source files in CSV format. The values are Delimiter and HeaderList.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-inputformatoptions.html#cfn-dynamodb-table-inputformatoptions-csv
         */
        readonly csv?: CfnTable.CsvProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputFormatOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `InputFormatOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_InputFormatOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('csv', CfnTable_CsvPropertyValidator)(properties.csv));
    return errors.wrap('supplied properties not correct for "InputFormatOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.InputFormatOptions` resource
 *
 * @param properties - the TypeScript properties of a `InputFormatOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.InputFormatOptions` resource.
 */
// @ts-ignore TS6133
function cfnTableInputFormatOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_InputFormatOptionsPropertyValidator(properties).assertSuccess();
    return {
        Csv: cfnTableCsvPropertyToCloudFormation(properties.csv),
    };
}

// @ts-ignore TS6133
function CfnTableInputFormatOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.InputFormatOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.InputFormatOptionsProperty>();
    ret.addPropertyResult('csv', 'Csv', properties.Csv != null ? CfnTableCsvPropertyFromCloudFormation(properties.Csv) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Represents *a single element* of a key schema. A key schema specifies the attributes that make up the primary key of a table, or the key attributes of an index.
     *
     * A `KeySchemaElement` represents exactly one attribute of the primary key. For example, a simple primary key would be represented by one `KeySchemaElement` (for the partition key). A composite primary key would require one `KeySchemaElement` for the partition key, and another `KeySchemaElement` for the sort key.
     *
     * A `KeySchemaElement` must be a scalar, top-level attribute (not a nested attribute). The data type must be one of String, Number, or Binary. The attribute cannot be nested within a List or a Map.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-keyschema.html
     */
    export interface KeySchemaProperty {
        /**
         * The name of a key attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-keyschema.html#cfn-dynamodb-table-keyschema-attributename
         */
        readonly attributeName: string;
        /**
         * The role that this key attribute will assume:
         *
         * - `HASH` - partition key
         * - `RANGE` - sort key
         *
         * > The partition key of an item is also known as its *hash attribute* . The term "hash attribute" derives from DynamoDB's usage of an internal hash function to evenly distribute data items across partitions, based on their partition key values.
         * >
         * > The sort key of an item is also known as its *range attribute* . The term "range attribute" derives from the way DynamoDB stores items with the same partition key physically close together, in sorted order by the sort key value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-keyschema.html#cfn-dynamodb-table-keyschema-keytype
         */
        readonly keyType: string;
    }
}

/**
 * Determine whether the given properties match those of a `KeySchemaProperty`
 *
 * @param properties - the TypeScript properties of a `KeySchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_KeySchemaPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.requiredValidator)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('keyType', cdk.requiredValidator)(properties.keyType));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    return errors.wrap('supplied properties not correct for "KeySchemaProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.KeySchema` resource
 *
 * @param properties - the TypeScript properties of a `KeySchemaProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.KeySchema` resource.
 */
// @ts-ignore TS6133
function cfnTableKeySchemaPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_KeySchemaPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
    };
}

// @ts-ignore TS6133
function CfnTableKeySchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.KeySchemaProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.KeySchemaProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', cfn_parse.FromCloudFormation.getString(properties.AttributeName));
    ret.addPropertyResult('keyType', 'KeyType', cfn_parse.FromCloudFormation.getString(properties.KeyType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The Kinesis Data Streams configuration for the specified table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-kinesisstreamspecification.html
     */
    export interface KinesisStreamSpecificationProperty {
        /**
         * The ARN for a specific Kinesis data stream.
         *
         * Length Constraints: Minimum length of 37. Maximum length of 1024.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-kinesisstreamspecification.html#cfn-dynamodb-table-kinesisstreamspecification-streamarn
         */
        readonly streamArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisStreamSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_KinesisStreamSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamArn', cdk.requiredValidator)(properties.streamArn));
    errors.collect(cdk.propertyValidator('streamArn', cdk.validateString)(properties.streamArn));
    return errors.wrap('supplied properties not correct for "KinesisStreamSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.KinesisStreamSpecification` resource
 *
 * @param properties - the TypeScript properties of a `KinesisStreamSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.KinesisStreamSpecification` resource.
 */
// @ts-ignore TS6133
function cfnTableKinesisStreamSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_KinesisStreamSpecificationPropertyValidator(properties).assertSuccess();
    return {
        StreamArn: cdk.stringToCloudFormation(properties.streamArn),
    };
}

// @ts-ignore TS6133
function CfnTableKinesisStreamSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.KinesisStreamSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.KinesisStreamSpecificationProperty>();
    ret.addPropertyResult('streamArn', 'StreamArn', cfn_parse.FromCloudFormation.getString(properties.StreamArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Represents the properties of a local secondary index. A local secondary index can only be created when its parent table is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-localsecondaryindex.html
     */
    export interface LocalSecondaryIndexProperty {
        /**
         * The name of the local secondary index. The name must be unique among all other indexes on this table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-localsecondaryindex.html#cfn-dynamodb-table-localsecondaryindex-indexname
         */
        readonly indexName: string;
        /**
         * The complete key schema for the local secondary index, consisting of one or more pairs of attribute names and key types:
         *
         * - `HASH` - partition key
         * - `RANGE` - sort key
         *
         * > The partition key of an item is also known as its *hash attribute* . The term "hash attribute" derives from DynamoDB's usage of an internal hash function to evenly distribute data items across partitions, based on their partition key values.
         * >
         * > The sort key of an item is also known as its *range attribute* . The term "range attribute" derives from the way DynamoDB stores items with the same partition key physically close together, in sorted order by the sort key value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-localsecondaryindex.html#cfn-dynamodb-table-localsecondaryindex-keyschema
         */
        readonly keySchema: Array<CfnTable.KeySchemaProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Represents attributes that are copied (projected) from the table into the local secondary index. These are in addition to the primary key attributes and index key attributes, which are automatically projected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-localsecondaryindex.html#cfn-dynamodb-table-localsecondaryindex-projection
         */
        readonly projection: CfnTable.ProjectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LocalSecondaryIndexProperty`
 *
 * @param properties - the TypeScript properties of a `LocalSecondaryIndexProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_LocalSecondaryIndexPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('indexName', cdk.requiredValidator)(properties.indexName));
    errors.collect(cdk.propertyValidator('indexName', cdk.validateString)(properties.indexName));
    errors.collect(cdk.propertyValidator('keySchema', cdk.requiredValidator)(properties.keySchema));
    errors.collect(cdk.propertyValidator('keySchema', cdk.listValidator(CfnTable_KeySchemaPropertyValidator))(properties.keySchema));
    errors.collect(cdk.propertyValidator('projection', cdk.requiredValidator)(properties.projection));
    errors.collect(cdk.propertyValidator('projection', CfnTable_ProjectionPropertyValidator)(properties.projection));
    return errors.wrap('supplied properties not correct for "LocalSecondaryIndexProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.LocalSecondaryIndex` resource
 *
 * @param properties - the TypeScript properties of a `LocalSecondaryIndexProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.LocalSecondaryIndex` resource.
 */
// @ts-ignore TS6133
function cfnTableLocalSecondaryIndexPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_LocalSecondaryIndexPropertyValidator(properties).assertSuccess();
    return {
        IndexName: cdk.stringToCloudFormation(properties.indexName),
        KeySchema: cdk.listMapper(cfnTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        Projection: cfnTableProjectionPropertyToCloudFormation(properties.projection),
    };
}

// @ts-ignore TS6133
function CfnTableLocalSecondaryIndexPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.LocalSecondaryIndexProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.LocalSecondaryIndexProperty>();
    ret.addPropertyResult('indexName', 'IndexName', cfn_parse.FromCloudFormation.getString(properties.IndexName));
    ret.addPropertyResult('keySchema', 'KeySchema', cfn_parse.FromCloudFormation.getArray(CfnTableKeySchemaPropertyFromCloudFormation)(properties.KeySchema));
    ret.addPropertyResult('projection', 'Projection', CfnTableProjectionPropertyFromCloudFormation(properties.Projection));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * The settings used to enable point in time recovery.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html
     */
    export interface PointInTimeRecoverySpecificationProperty {
        /**
         * Indicates whether point in time recovery is enabled (true) or disabled (false) on the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html#cfn-dynamodb-table-pointintimerecoveryspecification-pointintimerecoveryenabled
         */
        readonly pointInTimeRecoveryEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PointInTimeRecoverySpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PointInTimeRecoverySpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_PointInTimeRecoverySpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pointInTimeRecoveryEnabled', cdk.validateBoolean)(properties.pointInTimeRecoveryEnabled));
    return errors.wrap('supplied properties not correct for "PointInTimeRecoverySpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.PointInTimeRecoverySpecification` resource
 *
 * @param properties - the TypeScript properties of a `PointInTimeRecoverySpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.PointInTimeRecoverySpecification` resource.
 */
// @ts-ignore TS6133
function cfnTablePointInTimeRecoverySpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_PointInTimeRecoverySpecificationPropertyValidator(properties).assertSuccess();
    return {
        PointInTimeRecoveryEnabled: cdk.booleanToCloudFormation(properties.pointInTimeRecoveryEnabled),
    };
}

// @ts-ignore TS6133
function CfnTablePointInTimeRecoverySpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.PointInTimeRecoverySpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.PointInTimeRecoverySpecificationProperty>();
    ret.addPropertyResult('pointInTimeRecoveryEnabled', 'PointInTimeRecoveryEnabled', properties.PointInTimeRecoveryEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PointInTimeRecoveryEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Represents attributes that are copied (projected) from the table into an index. These are in addition to the primary key attributes and index key attributes, which are automatically projected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-projection.html
     */
    export interface ProjectionProperty {
        /**
         * Represents the non-key attribute names which will be projected into the index.
         *
         * For local secondary indexes, the total count of `NonKeyAttributes` summed across all of the local secondary indexes, must not exceed 100. If you project the same attribute into two different indexes, this counts as two distinct attributes when determining the total.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-projection.html#cfn-dynamodb-table-projection-nonkeyattributes
         */
        readonly nonKeyAttributes?: string[];
        /**
         * The set of attributes that are projected into the index:
         *
         * - `KEYS_ONLY` - Only the index and primary keys are projected into the index.
         * - `INCLUDE` - In addition to the attributes described in `KEYS_ONLY` , the secondary index will include other non-key attributes that you specify.
         * - `ALL` - All of the table attributes are projected into the index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-projection.html#cfn-dynamodb-table-projection-projectiontype
         */
        readonly projectionType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProjectionProperty`
 *
 * @param properties - the TypeScript properties of a `ProjectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ProjectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nonKeyAttributes', cdk.listValidator(cdk.validateString))(properties.nonKeyAttributes));
    errors.collect(cdk.propertyValidator('projectionType', cdk.validateString)(properties.projectionType));
    return errors.wrap('supplied properties not correct for "ProjectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.Projection` resource
 *
 * @param properties - the TypeScript properties of a `ProjectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.Projection` resource.
 */
// @ts-ignore TS6133
function cfnTableProjectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_ProjectionPropertyValidator(properties).assertSuccess();
    return {
        NonKeyAttributes: cdk.listMapper(cdk.stringToCloudFormation)(properties.nonKeyAttributes),
        ProjectionType: cdk.stringToCloudFormation(properties.projectionType),
    };
}

// @ts-ignore TS6133
function CfnTableProjectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ProjectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ProjectionProperty>();
    ret.addPropertyResult('nonKeyAttributes', 'NonKeyAttributes', properties.NonKeyAttributes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NonKeyAttributes) : undefined);
    ret.addPropertyResult('projectionType', 'ProjectionType', properties.ProjectionType != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectionType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Throughput for the specified table, which consists of values for `ReadCapacityUnits` and `WriteCapacityUnits` . For more information about the contents of a provisioned throughput structure, see [Amazon DynamoDB Table ProvisionedThroughput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-provisionedthroughput.html
     */
    export interface ProvisionedThroughputProperty {
        /**
         * The maximum number of strongly consistent reads consumed per second before DynamoDB returns a `ThrottlingException` . For more information, see [Specifying Read and Write Requirements](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.html#ProvisionedThroughput) in the *Amazon DynamoDB Developer Guide* .
         *
         * If read/write capacity mode is `PAY_PER_REQUEST` the value is set to 0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-provisionedthroughput.html#cfn-dynamodb-table-provisionedthroughput-readcapacityunits
         */
        readonly readCapacityUnits: number;
        /**
         * The maximum number of writes consumed per second before DynamoDB returns a `ThrottlingException` . For more information, see [Specifying Read and Write Requirements](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.html#ProvisionedThroughput) in the *Amazon DynamoDB Developer Guide* .
         *
         * If read/write capacity mode is `PAY_PER_REQUEST` the value is set to 0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-provisionedthroughput.html#cfn-dynamodb-table-provisionedthroughput-writecapacityunits
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
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.ProvisionedThroughput` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.ProvisionedThroughput` resource.
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

export namespace CfnTable {
    /**
     * The S3 bucket that is being imported from.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-s3bucketsource.html
     */
    export interface S3BucketSourceProperty {
        /**
         * The S3 bucket that is being imported from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-s3bucketsource.html#cfn-dynamodb-table-s3bucketsource-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The account number of the S3 bucket that is being imported from. If the bucket is owned by the requester this is optional.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-s3bucketsource.html#cfn-dynamodb-table-s3bucketsource-s3bucketowner
         */
        readonly s3BucketOwner?: string;
        /**
         * The key prefix shared by all S3 Objects that are being imported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-s3bucketsource.html#cfn-dynamodb-table-s3bucketsource-s3keyprefix
         */
        readonly s3KeyPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3BucketSourceProperty`
 *
 * @param properties - the TypeScript properties of a `S3BucketSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_S3BucketSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3BucketOwner', cdk.validateString)(properties.s3BucketOwner));
    errors.collect(cdk.propertyValidator('s3KeyPrefix', cdk.validateString)(properties.s3KeyPrefix));
    return errors.wrap('supplied properties not correct for "S3BucketSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.S3BucketSource` resource
 *
 * @param properties - the TypeScript properties of a `S3BucketSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.S3BucketSource` resource.
 */
// @ts-ignore TS6133
function cfnTableS3BucketSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_S3BucketSourcePropertyValidator(properties).assertSuccess();
    return {
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3BucketOwner: cdk.stringToCloudFormation(properties.s3BucketOwner),
        S3KeyPrefix: cdk.stringToCloudFormation(properties.s3KeyPrefix),
    };
}

// @ts-ignore TS6133
function CfnTableS3BucketSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.S3BucketSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.S3BucketSourceProperty>();
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3BucketOwner', 'S3BucketOwner', properties.S3BucketOwner != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketOwner) : undefined);
    ret.addPropertyResult('s3KeyPrefix', 'S3KeyPrefix', properties.S3KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3KeyPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Represents the settings used to enable server-side encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
     */
    export interface SSESpecificationProperty {
        /**
         * The AWS KMS key that should be used for the AWS KMS encryption. To specify a key, use its key ID, Amazon Resource Name (ARN), alias name, or alias ARN. Note that you should only provide this parameter if the key is different from the default DynamoDB key `alias/aws/dynamodb` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html#cfn-dynamodb-table-ssespecification-kmsmasterkeyid
         */
        readonly kmsMasterKeyId?: string;
        /**
         * Indicates whether server-side encryption is done using an AWS managed key or an AWS owned key. If enabled (true), server-side encryption type is set to `KMS` and an AWS managed key or customer managed key is used ( AWS KMS charges apply). If disabled (false) or not specified, server-side encryption is set to AWS owned key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html#cfn-dynamodb-table-ssespecification-sseenabled
         */
        readonly sseEnabled: boolean | cdk.IResolvable;
        /**
         * Server-side encryption type. The only supported value is:
         *
         * - `KMS` - Server-side encryption that uses AWS Key Management Service . The key is stored in your account and is managed by AWS KMS ( AWS KMS charges apply).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html#cfn-dynamodb-table-ssespecification-ssetype
         */
        readonly sseType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_SSESpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsMasterKeyId', cdk.validateString)(properties.kmsMasterKeyId));
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.requiredValidator)(properties.sseEnabled));
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.validateBoolean)(properties.sseEnabled));
    errors.collect(cdk.propertyValidator('sseType', cdk.validateString)(properties.sseType));
    return errors.wrap('supplied properties not correct for "SSESpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.SSESpecification` resource
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.SSESpecification` resource.
 */
// @ts-ignore TS6133
function cfnTableSSESpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_SSESpecificationPropertyValidator(properties).assertSuccess();
    return {
        KMSMasterKeyId: cdk.stringToCloudFormation(properties.kmsMasterKeyId),
        SSEEnabled: cdk.booleanToCloudFormation(properties.sseEnabled),
        SSEType: cdk.stringToCloudFormation(properties.sseType),
    };
}

// @ts-ignore TS6133
function CfnTableSSESpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.SSESpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.SSESpecificationProperty>();
    ret.addPropertyResult('kmsMasterKeyId', 'KMSMasterKeyId', properties.KMSMasterKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KMSMasterKeyId) : undefined);
    ret.addPropertyResult('sseEnabled', 'SSEEnabled', cfn_parse.FromCloudFormation.getBoolean(properties.SSEEnabled));
    ret.addPropertyResult('sseType', 'SSEType', properties.SSEType != null ? cfn_parse.FromCloudFormation.getString(properties.SSEType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Represents the DynamoDB Streams configuration for a table in DynamoDB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-streamspecification.html
     */
    export interface StreamSpecificationProperty {
        /**
         * When an item in the table is modified, `StreamViewType` determines what information is written to the stream for this table. Valid values for `StreamViewType` are:
         *
         * - `KEYS_ONLY` - Only the key attributes of the modified item are written to the stream.
         * - `NEW_IMAGE` - The entire item, as it appears after it was modified, is written to the stream.
         * - `OLD_IMAGE` - The entire item, as it appeared before it was modified, is written to the stream.
         * - `NEW_AND_OLD_IMAGES` - Both the new and the old item images of the item are written to the stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-streamspecification.html#cfn-dynamodb-table-streamspecification-streamviewtype
         */
        readonly streamViewType: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_StreamSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamViewType', cdk.requiredValidator)(properties.streamViewType));
    errors.collect(cdk.propertyValidator('streamViewType', cdk.validateString)(properties.streamViewType));
    return errors.wrap('supplied properties not correct for "StreamSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.StreamSpecification` resource
 *
 * @param properties - the TypeScript properties of a `StreamSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.StreamSpecification` resource.
 */
// @ts-ignore TS6133
function cfnTableStreamSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_StreamSpecificationPropertyValidator(properties).assertSuccess();
    return {
        StreamViewType: cdk.stringToCloudFormation(properties.streamViewType),
    };
}

// @ts-ignore TS6133
function CfnTableStreamSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.StreamSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.StreamSpecificationProperty>();
    ret.addPropertyResult('streamViewType', 'StreamViewType', cfn_parse.FromCloudFormation.getString(properties.StreamViewType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTable {
    /**
     * Represents the settings used to enable or disable Time to Live (TTL) for the specified table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-timetolivespecification.html
     */
    export interface TimeToLiveSpecificationProperty {
        /**
         * The name of the TTL attribute used to store the expiration time for items in the table.
         *
         * > To update this property, you must first disable TTL then enable TTL with the new attribute name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-timetolivespecification.html#cfn-dynamodb-table-timetolivespecification-attributename
         */
        readonly attributeName: string;
        /**
         * Indicates whether TTL is to be enabled (true) or disabled (false) on the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-timetolivespecification.html#cfn-dynamodb-table-timetolivespecification-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TimeToLiveSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `TimeToLiveSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_TimeToLiveSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeName', cdk.requiredValidator)(properties.attributeName));
    errors.collect(cdk.propertyValidator('attributeName', cdk.validateString)(properties.attributeName));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TimeToLiveSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DynamoDB::Table.TimeToLiveSpecification` resource
 *
 * @param properties - the TypeScript properties of a `TimeToLiveSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DynamoDB::Table.TimeToLiveSpecification` resource.
 */
// @ts-ignore TS6133
function cfnTableTimeToLiveSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTable_TimeToLiveSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnTableTimeToLiveSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.TimeToLiveSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.TimeToLiveSpecificationProperty>();
    ret.addPropertyResult('attributeName', 'AttributeName', cfn_parse.FromCloudFormation.getString(properties.AttributeName));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
