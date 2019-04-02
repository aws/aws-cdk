// Copyright 2012-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2019-03-21T16:19:16.881Z","fingerprint":"CPTpE9eD4ImqOKDnu7P0Kaol8j+SXNQUILMR4l/fi2g="}

// tslint:disable:max-line-length | This is generated code - line lengths are difficult to control

import cdk = require('@aws-cdk/cdk');

/**
 * Properties for defining a `AWS::DynamoDB::Table`
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
 */
export interface CfnTableProps {
    /**
     * `AWS::DynamoDB::Table.KeySchema`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-keyschema
     */
    keySchema: Array<CfnTable.KeySchemaProperty | cdk.Token> | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.AttributeDefinitions`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-attributedef
     */
    attributeDefinitions?: Array<CfnTable.AttributeDefinitionProperty | cdk.Token> | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.BillingMode`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-billingmode
     */
    billingMode?: string;
    /**
     * `AWS::DynamoDB::Table.GlobalSecondaryIndexes`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-gsi
     */
    globalSecondaryIndexes?: Array<CfnTable.GlobalSecondaryIndexProperty | cdk.Token> | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.LocalSecondaryIndexes`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-lsi
     */
    localSecondaryIndexes?: Array<CfnTable.LocalSecondaryIndexProperty | cdk.Token> | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.PointInTimeRecoverySpecification`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-pointintimerecoveryspecification
     */
    pointInTimeRecoverySpecification?: CfnTable.PointInTimeRecoverySpecificationProperty | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.ProvisionedThroughput`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-provisionedthroughput
     */
    provisionedThroughput?: CfnTable.ProvisionedThroughputProperty | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.SSESpecification`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-ssespecification
     */
    sseSpecification?: CfnTable.SSESpecificationProperty | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.StreamSpecification`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-streamspecification
     */
    streamSpecification?: CfnTable.StreamSpecificationProperty | cdk.Token;
    /**
     * `AWS::DynamoDB::Table.TableName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tablename
     */
    tableName?: string;
    /**
     * `AWS::DynamoDB::Table.Tags`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tags
     */
    tags?: cdk.CfnTag[];
    /**
     * `AWS::DynamoDB::Table.TimeToLiveSpecification`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-timetolivespecification
     */
    timeToLiveSpecification?: CfnTable.TimeToLiveSpecificationProperty | cdk.Token;
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
    errors.collect(cdk.propertyValidator('attributeDefinitions', cdk.listValidator(CfnTable_AttributeDefinitionPropertyValidator))(properties.attributeDefinitions));
    errors.collect(cdk.propertyValidator('billingMode', cdk.validateString)(properties.billingMode));
    errors.collect(cdk.propertyValidator('globalSecondaryIndexes', cdk.listValidator(CfnTable_GlobalSecondaryIndexPropertyValidator))(properties.globalSecondaryIndexes));
    errors.collect(cdk.propertyValidator('keySchema', cdk.requiredValidator)(properties.keySchema));
    errors.collect(cdk.propertyValidator('keySchema', cdk.listValidator(CfnTable_KeySchemaPropertyValidator))(properties.keySchema));
    errors.collect(cdk.propertyValidator('localSecondaryIndexes', cdk.listValidator(CfnTable_LocalSecondaryIndexPropertyValidator))(properties.localSecondaryIndexes));
    errors.collect(cdk.propertyValidator('pointInTimeRecoverySpecification', CfnTable_PointInTimeRecoverySpecificationPropertyValidator)(properties.pointInTimeRecoverySpecification));
    errors.collect(cdk.propertyValidator('provisionedThroughput', CfnTable_ProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
    errors.collect(cdk.propertyValidator('sseSpecification', CfnTable_SSESpecificationPropertyValidator)(properties.sseSpecification));
    errors.collect(cdk.propertyValidator('streamSpecification', CfnTable_StreamSpecificationPropertyValidator)(properties.streamSpecification));
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
      GlobalSecondaryIndexes: cdk.listMapper(cfnTableGlobalSecondaryIndexPropertyToCloudFormation)(properties.globalSecondaryIndexes),
      LocalSecondaryIndexes: cdk.listMapper(cfnTableLocalSecondaryIndexPropertyToCloudFormation)(properties.localSecondaryIndexes),
      PointInTimeRecoverySpecification: cfnTablePointInTimeRecoverySpecificationPropertyToCloudFormation(properties.pointInTimeRecoverySpecification),
      ProvisionedThroughput: cfnTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
      SSESpecification: cfnTableSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
      StreamSpecification: cfnTableStreamSpecificationPropertyToCloudFormation(properties.streamSpecification),
      TableName: cdk.stringToCloudFormation(properties.tableName),
      Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
      TimeToLiveSpecification: cfnTableTimeToLiveSpecificationPropertyToCloudFormation(properties.timeToLiveSpecification),
    };
}

/**
 * A CloudFormation `AWS::DynamoDB::Table`
 *
 * @cloudformationResource AWS::DynamoDB::Table
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
 */
export class CfnTable extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly resourceTypeName = "AWS::DynamoDB::Table";

    /**
     * @cloudformationAttribute Arn
     */
    public readonly tableArn: string;

    /**
     * @cloudformationAttribute StreamArn
     */
    public readonly tableStreamArn: string;
    public readonly tableName: string;

    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DynamoDB::Table`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnTableProps) {
        super(scope, id, { type: CfnTable.resourceTypeName, properties: props });
        cdk.requireProperty(props, 'keySchema', this);
        this.tableArn = this.getAtt('Arn').toString();
        this.tableStreamArn = this.getAtt('StreamArn').toString();
        this.tableName = this.ref.toString();
        const tags = props === undefined ? undefined : props.tags;
        this.tags = new cdk.TagManager(cdk.TagType.Standard, "AWS::DynamoDB::Table", tags);
    }

    public get propertyOverrides(): CfnTableProps {
        return this.untypedPropertyOverrides;
    }
    protected renderProperties(properties: any): { [key: string]: any }  {
        return cfnTablePropsToCloudFormation(this.node.resolve(properties));
    }
}

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html
     */
    export interface AttributeDefinitionProperty {
        /**
         * `CfnTable.AttributeDefinitionProperty.AttributeName`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html#cfn-dynamodb-attributedef-attributename
         */
        attributeName: string;
        /**
         * `CfnTable.AttributeDefinitionProperty.AttributeType`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html#cfn-dynamodb-attributedef-attributename-attributetype
         */
        attributeType: string;
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

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html
     */
    export interface GlobalSecondaryIndexProperty {
        /**
         * `CfnTable.GlobalSecondaryIndexProperty.IndexName`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-indexname
         */
        indexName: string;
        /**
         * `CfnTable.GlobalSecondaryIndexProperty.KeySchema`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-keyschema
         */
        keySchema: Array<CfnTable.KeySchemaProperty | cdk.Token> | cdk.Token;
        /**
         * `CfnTable.GlobalSecondaryIndexProperty.Projection`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-projection
         */
        projection: CfnTable.ProjectionProperty | cdk.Token;
        /**
         * `CfnTable.GlobalSecondaryIndexProperty.ProvisionedThroughput`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-provisionedthroughput
         */
        provisionedThroughput?: CfnTable.ProvisionedThroughputProperty | cdk.Token;
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
      IndexName: cdk.stringToCloudFormation(properties.indexName),
      KeySchema: cdk.listMapper(cfnTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
      Projection: cfnTableProjectionPropertyToCloudFormation(properties.projection),
      ProvisionedThroughput: cfnTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
    };
}

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-keyschema.html
     */
    export interface KeySchemaProperty {
        /**
         * `CfnTable.KeySchemaProperty.AttributeName`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-keyschema.html#aws-properties-dynamodb-keyschema-attributename
         */
        attributeName: string;
        /**
         * `CfnTable.KeySchemaProperty.KeyType`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-keyschema.html#aws-properties-dynamodb-keyschema-keytype
         */
        keyType: string;
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

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-lsi.html
     */
    export interface LocalSecondaryIndexProperty {
        /**
         * `CfnTable.LocalSecondaryIndexProperty.IndexName`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-lsi.html#cfn-dynamodb-lsi-indexname
         */
        indexName: string;
        /**
         * `CfnTable.LocalSecondaryIndexProperty.KeySchema`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-lsi.html#cfn-dynamodb-lsi-keyschema
         */
        keySchema: Array<CfnTable.KeySchemaProperty | cdk.Token> | cdk.Token;
        /**
         * `CfnTable.LocalSecondaryIndexProperty.Projection`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-lsi.html#cfn-dynamodb-lsi-projection
         */
        projection: CfnTable.ProjectionProperty | cdk.Token;
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

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html
     */
    export interface PointInTimeRecoverySpecificationProperty {
        /**
         * `CfnTable.PointInTimeRecoverySpecificationProperty.PointInTimeRecoveryEnabled`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html#cfn-dynamodb-table-pointintimerecoveryspecification-pointintimerecoveryenabled
         */
        pointInTimeRecoveryEnabled?: boolean | cdk.Token;
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

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-projectionobject.html
     */
    export interface ProjectionProperty {
        /**
         * `CfnTable.ProjectionProperty.NonKeyAttributes`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-projectionobject.html#cfn-dynamodb-projectionobj-nonkeyatt
         */
        nonKeyAttributes?: string[];
        /**
         * `CfnTable.ProjectionProperty.ProjectionType`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-projectionobject.html#cfn-dynamodb-projectionobj-projtype
         */
        projectionType?: string;
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

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    export interface ProvisionedThroughputProperty {
        /**
         * `CfnTable.ProvisionedThroughputProperty.ReadCapacityUnits`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html#cfn-dynamodb-provisionedthroughput-readcapacityunits
         */
        readCapacityUnits: number | cdk.Token;
        /**
         * `CfnTable.ProvisionedThroughputProperty.WriteCapacityUnits`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html#cfn-dynamodb-provisionedthroughput-writecapacityunits
         */
        writeCapacityUnits: number | cdk.Token;
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

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
     */
    export interface SSESpecificationProperty {
        /**
         * `CfnTable.SSESpecificationProperty.SSEEnabled`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html#cfn-dynamodb-table-ssespecification-sseenabled
         */
        sseEnabled: boolean | cdk.Token;
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
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.requiredValidator)(properties.sseEnabled));
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.validateBoolean)(properties.sseEnabled));
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
      SSEEnabled: cdk.booleanToCloudFormation(properties.sseEnabled),
    };
}

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html
     */
    export interface StreamSpecificationProperty {
        /**
         * `CfnTable.StreamSpecificationProperty.StreamViewType`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html#cfn-dynamodb-streamspecification-streamviewtype
         */
        streamViewType: string;
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

export namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-timetolivespecification.html
     */
    export interface TimeToLiveSpecificationProperty {
        /**
         * `CfnTable.TimeToLiveSpecificationProperty.AttributeName`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-timetolivespecification.html#cfn-dynamodb-timetolivespecification-attributename
         */
        attributeName: string;
        /**
         * `CfnTable.TimeToLiveSpecificationProperty.Enabled`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-timetolivespecification.html#cfn-dynamodb-timetolivespecification-enabled
         */
        enabled: boolean | cdk.Token;
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
