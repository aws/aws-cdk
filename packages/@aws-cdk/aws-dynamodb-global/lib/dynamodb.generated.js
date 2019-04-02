"use strict";
// Copyright 2012-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2019-03-21T16:19:16.881Z","fingerprint":"CPTpE9eD4ImqOKDnu7P0Kaol8j+SXNQUILMR4l/fi2g="}
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-line-length | This is generated code - line lengths are difficult to control
const cdk = require("@aws-cdk/cdk");
/**
 * Determine whether the given properties match those of a `CfnTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the result of the validation.
 */
function CfnTablePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTablePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
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
class CfnTable extends cdk.CfnResource {
    /**
     * Create a new `AWS::DynamoDB::Table`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnTable.resourceTypeName, properties: props });
        cdk.requireProperty(props, 'keySchema', this);
        this.tableArn = this.getAtt('Arn').toString();
        this.tableStreamArn = this.getAtt('StreamArn').toString();
        this.tableName = this.ref.toString();
        const tags = props === undefined ? undefined : props.tags;
        this.tags = new cdk.TagManager(cdk.TagType.Standard, "AWS::DynamoDB::Table", tags);
    }
    get propertyOverrides() {
        return this.untypedPropertyOverrides;
    }
    renderProperties(properties) {
        return cfnTablePropsToCloudFormation(this.node.resolve(properties));
    }
}
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnTable.resourceTypeName = "AWS::DynamoDB::Table";
exports.CfnTable = CfnTable;
/**
 * Determine whether the given properties match those of a `AttributeDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_AttributeDefinitionPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableAttributeDefinitionPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_AttributeDefinitionPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        AttributeType: cdk.stringToCloudFormation(properties.attributeType),
    };
}
/**
 * Determine whether the given properties match those of a `GlobalSecondaryIndexProperty`
 *
 * @param properties - the TypeScript properties of a `GlobalSecondaryIndexProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_GlobalSecondaryIndexPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableGlobalSecondaryIndexPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_GlobalSecondaryIndexPropertyValidator(properties).assertSuccess();
    return {
        IndexName: cdk.stringToCloudFormation(properties.indexName),
        KeySchema: cdk.listMapper(cfnTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        Projection: cfnTableProjectionPropertyToCloudFormation(properties.projection),
        ProvisionedThroughput: cfnTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
    };
}
/**
 * Determine whether the given properties match those of a `KeySchemaProperty`
 *
 * @param properties - the TypeScript properties of a `KeySchemaProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_KeySchemaPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableKeySchemaPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_KeySchemaPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
    };
}
/**
 * Determine whether the given properties match those of a `LocalSecondaryIndexProperty`
 *
 * @param properties - the TypeScript properties of a `LocalSecondaryIndexProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_LocalSecondaryIndexPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableLocalSecondaryIndexPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_LocalSecondaryIndexPropertyValidator(properties).assertSuccess();
    return {
        IndexName: cdk.stringToCloudFormation(properties.indexName),
        KeySchema: cdk.listMapper(cfnTableKeySchemaPropertyToCloudFormation)(properties.keySchema),
        Projection: cfnTableProjectionPropertyToCloudFormation(properties.projection),
    };
}
/**
 * Determine whether the given properties match those of a `PointInTimeRecoverySpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PointInTimeRecoverySpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_PointInTimeRecoverySpecificationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTablePointInTimeRecoverySpecificationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_PointInTimeRecoverySpecificationPropertyValidator(properties).assertSuccess();
    return {
        PointInTimeRecoveryEnabled: cdk.booleanToCloudFormation(properties.pointInTimeRecoveryEnabled),
    };
}
/**
 * Determine whether the given properties match those of a `ProjectionProperty`
 *
 * @param properties - the TypeScript properties of a `ProjectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ProjectionPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableProjectionPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_ProjectionPropertyValidator(properties).assertSuccess();
    return {
        NonKeyAttributes: cdk.listMapper(cdk.stringToCloudFormation)(properties.nonKeyAttributes),
        ProjectionType: cdk.stringToCloudFormation(properties.projectionType),
    };
}
/**
 * Determine whether the given properties match those of a `ProvisionedThroughputProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_ProvisionedThroughputPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableProvisionedThroughputPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_ProvisionedThroughputPropertyValidator(properties).assertSuccess();
    return {
        ReadCapacityUnits: cdk.numberToCloudFormation(properties.readCapacityUnits),
        WriteCapacityUnits: cdk.numberToCloudFormation(properties.writeCapacityUnits),
    };
}
/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_SSESpecificationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableSSESpecificationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_SSESpecificationPropertyValidator(properties).assertSuccess();
    return {
        SSEEnabled: cdk.booleanToCloudFormation(properties.sseEnabled),
    };
}
/**
 * Determine whether the given properties match those of a `StreamSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_StreamSpecificationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableStreamSpecificationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_StreamSpecificationPropertyValidator(properties).assertSuccess();
    return {
        StreamViewType: cdk.stringToCloudFormation(properties.streamViewType),
    };
}
/**
 * Determine whether the given properties match those of a `TimeToLiveSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `TimeToLiveSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnTable_TimeToLiveSpecificationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnTableTimeToLiveSpecificationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnTable_TimeToLiveSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AttributeName: cdk.stringToCloudFormation(properties.attributeName),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vZGIuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZHluYW1vZGIuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7QUFDL0UsK0RBQStEO0FBQy9ELDhGQUE4RjtBQUM5RixzSEFBc0g7O0FBRXRILGtHQUFrRztBQUVsRyxvQ0FBcUM7QUFxRXJDOzs7Ozs7R0FNRztBQUNILFNBQVMsc0JBQXNCLENBQUMsVUFBZTtJQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLDZDQUE2QyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0lBQ2pLLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDakcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztJQUN0SyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDaEcsTUFBTSxDQUFDLE9BQU8s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QXVELENBQUMsVUFBZTtJQUM1RSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sVUFBVSxDQUFDO0tBQUU7SUFDdkQsaURBQWlELENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDOUUsT0FBTztRQUNMLGFBQWEsRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUNuRSxPQUFPLEVBQUUsR0FBRyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7S0FDekQsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDE5IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBHZW5lcmF0ZWQgZnJvbSB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIFNwZWNpZmljYXRpb25cbi8vIFNlZTogZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2Nmbi1yZXNvdXJjZS1zcGVjaWZpY2F0aW9uLmh0bWxcbi8vIEBjZm4ydHM6bWV0YUAge1wiZ2VuZXJhdGVkXCI6XCIyMDE5LTAzLTIxVDE2OjE5OjE2Ljg4MVpcIixcImZpbmdlcnByaW50XCI6XCJDUFRwRTllRDRJbXFPS0RudTdQMEthb2w4aitTWE5RVUlMTVI0bC9maTJnPVwifVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggfCBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpEeW5hbW9EQjo6VGFibGVgXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWR5bmFtb2RiLXRhYmxlLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5UYWJsZVByb3BzIHtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpEeW5hbW9EQjo6VGFibGUuS2V5U2NoZW1hYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbCNjZm4tZHluYW1vZGItdGFibGUta2V5c2NoZW1hXG4gICAgICovXG4gICAga2V5U2NoZW1hOiBBcnJheTxDZm5UYWJsZS5LZXlTY2hlbWFQcm9wZXJ0eSB8IGNkay5Ub2tlbj4gfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6RHluYW1vREI6OlRhYmxlLkF0dHJpYnV0ZURlZmluaXRpb25zYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbCNjZm4tZHluYW1vZGItdGFibGUtYXR0cmlidXRlZGVmXG4gICAgICovXG4gICAgYXR0cmlidXRlRGVmaW5pdGlvbnM/OiBBcnJheTxDZm5UYWJsZS5BdHRyaWJ1dGVEZWZpbml0aW9uUHJvcGVydHkgfCBjZGsuVG9rZW4+IHwgY2RrLlRva2VuO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5CaWxsaW5nTW9kZWBcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWR5bmFtb2RiLXRhYmxlLmh0bWwjY2ZuLWR5bmFtb2RiLXRhYmxlLWJpbGxpbmdtb2RlXG4gICAgICovXG4gICAgYmlsbGluZ01vZGU/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogYEFXUzo6RHluYW1vREI6OlRhYmxlLkdsb2JhbFNlY29uZGFyeUluZGV4ZXNgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1keW5hbW9kYi10YWJsZS5odG1sI2Nmbi1keW5hbW9kYi10YWJsZS1nc2lcbiAgICAgKi9cbiAgICBnbG9iYWxTZWNvbmRhcnlJbmRleGVzPzogQXJyYXk8Q2ZuVGFibGUuR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eSB8IGNkay5Ub2tlbj4gfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6RHluYW1vREI6OlRhYmxlLkxvY2FsU2Vjb25kYXJ5SW5kZXhlc2BcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWR5bmFtb2RiLXRhYmxlLmh0bWwjY2ZuLWR5bmFtb2RiLXRhYmxlLWxzaVxuICAgICAqL1xuICAgIGxvY2FsU2Vjb25kYXJ5SW5kZXhlcz86IEFycmF5PENmblRhYmxlLkxvY2FsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eSB8IGNkay5Ub2tlbj4gfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6RHluYW1vREI6OlRhYmxlLlBvaW50SW5UaW1lUmVjb3ZlcnlTcGVjaWZpY2F0aW9uYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbCNjZm4tZHluYW1vZGItdGFibGUtcG9pbnRpbnRpbWVyZWNvdmVyeXNwZWNpZmljYXRpb25cbiAgICAgKi9cbiAgICBwb2ludEluVGltZVJlY292ZXJ5U3BlY2lmaWNhdGlvbj86IENmblRhYmxlLlBvaW50SW5UaW1lUmVjb3ZlcnlTcGVjaWZpY2F0aW9uUHJvcGVydHkgfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6RHluYW1vREI6OlRhYmxlLlByb3Zpc2lvbmVkVGhyb3VnaHB1dGBcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWR5bmFtb2RiLXRhYmxlLmh0bWwjY2ZuLWR5bmFtb2RiLXRhYmxlLXByb3Zpc2lvbmVkdGhyb3VnaHB1dFxuICAgICAqL1xuICAgIHByb3Zpc2lvbmVkVGhyb3VnaHB1dD86IENmblRhYmxlLlByb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5IHwgY2RrLlRva2VuO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5TU0VTcGVjaWZpY2F0aW9uYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbCNjZm4tZHluYW1vZGItdGFibGUtc3Nlc3BlY2lmaWNhdGlvblxuICAgICAqL1xuICAgIHNzZVNwZWNpZmljYXRpb24/OiBDZm5UYWJsZS5TU0VTcGVjaWZpY2F0aW9uUHJvcGVydHkgfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6RHluYW1vREI6OlRhYmxlLlN0cmVhbVNwZWNpZmljYXRpb25gXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1keW5hbW9kYi10YWJsZS5odG1sI2Nmbi1keW5hbW9kYi10YWJsZS1zdHJlYW1zcGVjaWZpY2F0aW9uXG4gICAgICovXG4gICAgc3RyZWFtU3BlY2lmaWNhdGlvbj86IENmblRhYmxlLlN0cmVhbVNwZWNpZmljYXRpb25Qcm9wZXJ0eSB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpEeW5hbW9EQjo6VGFibGUuVGFibGVOYW1lYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbCNjZm4tZHluYW1vZGItdGFibGUtdGFibGVuYW1lXG4gICAgICovXG4gICAgdGFibGVOYW1lPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5UYWdzYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbCNjZm4tZHluYW1vZGItdGFibGUtdGFnc1xuICAgICAqL1xuICAgIHRhZ3M/OiBjZGsuQ2ZuVGFnW107XG4gICAgLyoqXG4gICAgICogYEFXUzo6RHluYW1vREI6OlRhYmxlLlRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbCNjZm4tZHluYW1vZGItdGFibGUtdGltZXRvbGl2ZXNwZWNpZmljYXRpb25cbiAgICAgKi9cbiAgICB0aW1lVG9MaXZlU3BlY2lmaWNhdGlvbj86IENmblRhYmxlLlRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uUHJvcGVydHkgfCBjZGsuVG9rZW47XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuVGFibGVQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuVGFibGVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5UYWJsZVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXR0cmlidXRlRGVmaW5pdGlvbnMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5UYWJsZV9BdHRyaWJ1dGVEZWZpbml0aW9uUHJvcGVydHlWYWxpZGF0b3IpKShwcm9wZXJ0aWVzLmF0dHJpYnV0ZURlZmluaXRpb25zKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdiaWxsaW5nTW9kZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5iaWxsaW5nTW9kZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZ2xvYmFsU2Vjb25kYXJ5SW5kZXhlcycsIGNkay5saXN0VmFsaWRhdG9yKENmblRhYmxlX0dsb2JhbFNlY29uZGFyeUluZGV4UHJvcGVydHlWYWxpZGF0b3IpKShwcm9wZXJ0aWVzLmdsb2JhbFNlY29uZGFyeUluZGV4ZXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2tleVNjaGVtYScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5rZXlTY2hlbWEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2tleVNjaGVtYScsIGNkay5saXN0VmFsaWRhdG9yKENmblRhYmxlX0tleVNjaGVtYVByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5rZXlTY2hlbWEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvY2FsU2Vjb25kYXJ5SW5kZXhlcycsIGNkay5saXN0VmFsaWRhdG9yKENmblRhYmxlX0xvY2FsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMubG9jYWxTZWNvbmRhcnlJbmRleGVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwb2ludEluVGltZVJlY292ZXJ5U3BlY2lmaWNhdGlvbicsIENmblRhYmxlX1BvaW50SW5UaW1lUmVjb3ZlcnlTcGVjaWZpY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMucG9pbnRJblRpbWVSZWNvdmVyeVNwZWNpZmljYXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Byb3Zpc2lvbmVkVGhyb3VnaHB1dCcsIENmblRhYmxlX1Byb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLnByb3Zpc2lvbmVkVGhyb3VnaHB1dCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3NlU3BlY2lmaWNhdGlvbicsIENmblRhYmxlX1NTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5zc2VTcGVjaWZpY2F0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdHJlYW1TcGVjaWZpY2F0aW9uJywgQ2ZuVGFibGVfU3RyZWFtU3BlY2lmaWNhdGlvblByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLnN0cmVhbVNwZWNpZmljYXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhYmxlTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50YWJsZU5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVDZm5UYWcpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RpbWVUb0xpdmVTcGVjaWZpY2F0aW9uJywgQ2ZuVGFibGVfVGltZVRvTGl2ZVNwZWNpZmljYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy50aW1lVG9MaXZlU3BlY2lmaWNhdGlvbikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5UYWJsZVByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEeW5hbW9EQjo6VGFibGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblRhYmxlUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5UYWJsZVByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5UYWJsZVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgS2V5U2NoZW1hOiBjZGsubGlzdE1hcHBlcihjZm5UYWJsZUtleVNjaGVtYVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5rZXlTY2hlbWEpLFxuICAgICAgQXR0cmlidXRlRGVmaW5pdGlvbnM6IGNkay5saXN0TWFwcGVyKGNmblRhYmxlQXR0cmlidXRlRGVmaW5pdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5hdHRyaWJ1dGVEZWZpbml0aW9ucyksXG4gICAgICBCaWxsaW5nTW9kZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5iaWxsaW5nTW9kZSksXG4gICAgICBHbG9iYWxTZWNvbmRhcnlJbmRleGVzOiBjZGsubGlzdE1hcHBlcihjZm5UYWJsZUdsb2JhbFNlY29uZGFyeUluZGV4UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmdsb2JhbFNlY29uZGFyeUluZGV4ZXMpLFxuICAgICAgTG9jYWxTZWNvbmRhcnlJbmRleGVzOiBjZGsubGlzdE1hcHBlcihjZm5UYWJsZUxvY2FsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMubG9jYWxTZWNvbmRhcnlJbmRleGVzKSxcbiAgICAgIFBvaW50SW5UaW1lUmVjb3ZlcnlTcGVjaWZpY2F0aW9uOiBjZm5UYWJsZVBvaW50SW5UaW1lUmVjb3ZlcnlTcGVjaWZpY2F0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucG9pbnRJblRpbWVSZWNvdmVyeVNwZWNpZmljYXRpb24pLFxuICAgICAgUHJvdmlzaW9uZWRUaHJvdWdocHV0OiBjZm5UYWJsZVByb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnByb3Zpc2lvbmVkVGhyb3VnaHB1dCksXG4gICAgICBTU0VTcGVjaWZpY2F0aW9uOiBjZm5UYWJsZVNTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zc2VTcGVjaWZpY2F0aW9uKSxcbiAgICAgIFN0cmVhbVNwZWNpZmljYXRpb246IGNmblRhYmxlU3RyZWFtU3BlY2lmaWNhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnN0cmVhbVNwZWNpZmljYXRpb24pLFxuICAgICAgVGFibGVOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRhYmxlTmFtZSksXG4gICAgICBUYWdzOiBjZGsubGlzdE1hcHBlcihjZGsuY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICAgIFRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uOiBjZm5UYWJsZVRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGltZVRvTGl2ZVNwZWNpZmljYXRpb24pLFxuICAgIH07XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpEeW5hbW9EQjo6VGFibGVgXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpEeW5hbW9EQjo6VGFibGVcbiAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZHluYW1vZGItdGFibGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuVGFibGUgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSByZXNvdXJjZVR5cGVOYW1lID0gXCJBV1M6OkR5bmFtb0RCOjpUYWJsZVwiO1xuXG4gICAgLyoqXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWJsZUFybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIFN0cmVhbUFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWJsZVN0cmVhbUFybjogc3RyaW5nO1xuICAgIHB1YmxpYyByZWFkb25seSB0YWJsZU5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBgVGFnTWFuYWdlcmAgaGFuZGxlcyBzZXR0aW5nLCByZW1vdmluZyBhbmQgZm9ybWF0dGluZyB0YWdzXG4gICAgICpcbiAgICAgKiBUYWdzIHNob3VsZCBiZSBtYW5hZ2VkIGVpdGhlciBwYXNzaW5nIHRoZW0gYXMgcHJvcGVydGllcyBkdXJpbmdcbiAgICAgKiBpbml0aWF0aW9uIG9yIGJ5IGNhbGxpbmcgbWV0aG9kcyBvbiB0aGlzIG9iamVjdC4gSWYgYm90aCB0ZWNobmlxdWVzIGFyZVxuICAgICAqIHVzZWQgb25seSB0aGUgdGFncyBmcm9tIHRoZSBUYWdNYW5hZ2VyIHdpbGwgYmUgdXNlZC4gYFRhZ2AgKGFzcGVjdClcbiAgICAgKiB3aWxsIHVzZSB0aGUgbWFuYWdlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6RHluYW1vREI6OlRhYmxlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5UYWJsZVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5UYWJsZS5yZXNvdXJjZVR5cGVOYW1lLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2tleVNjaGVtYScsIHRoaXMpO1xuICAgICAgICB0aGlzLnRhYmxlQXJuID0gdGhpcy5nZXRBdHQoJ0FybicpLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMudGFibGVTdHJlYW1Bcm4gPSB0aGlzLmdldEF0dCgnU3RyZWFtQXJuJykudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy50YWJsZU5hbWUgPSB0aGlzLnJlZi50b1N0cmluZygpO1xuICAgICAgICBjb25zdCB0YWdzID0gcHJvcHMgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHByb3BzLnRhZ3M7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TdGFuZGFyZCwgXCJBV1M6OkR5bmFtb0RCOjpUYWJsZVwiLCB0YWdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByb3BlcnR5T3ZlcnJpZGVzKCk6IENmblRhYmxlUHJvcHMge1xuICAgICAgICByZXR1cm4gdGhpcy51bnR5cGVkUHJvcGVydHlPdmVycmlkZXM7XG4gICAgfVxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblRhYmxlUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHRoaXMubm9kZS5yZXNvbHZlKHByb3BlcnRpZXMpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuVGFibGUge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1hdHRyaWJ1dGVkZWYuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgQXR0cmlidXRlRGVmaW5pdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5BdHRyaWJ1dGVEZWZpbml0aW9uUHJvcGVydHkuQXR0cmlidXRlTmFtZWBcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLWF0dHJpYnV0ZWRlZi5odG1sI2Nmbi1keW5hbW9kYi1hdHRyaWJ1dGVkZWYtYXR0cmlidXRlbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgYXR0cmlidXRlTmFtZTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmblRhYmxlLkF0dHJpYnV0ZURlZmluaXRpb25Qcm9wZXJ0eS5BdHRyaWJ1dGVUeXBlYFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItYXR0cmlidXRlZGVmLmh0bWwjY2ZuLWR5bmFtb2RiLWF0dHJpYnV0ZWRlZi1hdHRyaWJ1dGVuYW1lLWF0dHJpYnV0ZXR5cGVcbiAgICAgICAgICovXG4gICAgICAgIGF0dHJpYnV0ZVR5cGU6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQXR0cmlidXRlRGVmaW5pdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBdHRyaWJ1dGVEZWZpbml0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuVGFibGVfQXR0cmlidXRlRGVmaW5pdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXR0cmlidXRlTmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5hdHRyaWJ1dGVOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdHRyaWJ1dGVOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmF0dHJpYnV0ZU5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F0dHJpYnV0ZVR5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYXR0cmlidXRlVHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXR0cmlidXRlVHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hdHRyaWJ1dGVUeXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkF0dHJpYnV0ZURlZmluaXRpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RHluYW1vREI6OlRhYmxlLkF0dHJpYnV0ZURlZmluaXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEF0dHJpYnV0ZURlZmluaXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RHluYW1vREI6OlRhYmxlLkF0dHJpYnV0ZURlZmluaXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuVGFibGVBdHRyaWJ1dGVEZWZpbml0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblRhYmxlX0F0dHJpYnV0ZURlZmluaXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIEF0dHJpYnV0ZU5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXR0cmlidXRlTmFtZSksXG4gICAgICBBdHRyaWJ1dGVUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmF0dHJpYnV0ZVR5cGUpLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuVGFibGUge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1nc2kuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuVGFibGUuR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eS5JbmRleE5hbWVgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1nc2kuaHRtbCNjZm4tZHluYW1vZGItZ3NpLWluZGV4bmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgaW5kZXhOYW1lOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuVGFibGUuR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eS5LZXlTY2hlbWFgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1nc2kuaHRtbCNjZm4tZHluYW1vZGItZ3NpLWtleXNjaGVtYVxuICAgICAgICAgKi9cbiAgICAgICAga2V5U2NoZW1hOiBBcnJheTxDZm5UYWJsZS5LZXlTY2hlbWFQcm9wZXJ0eSB8IGNkay5Ub2tlbj4gfCBjZGsuVG9rZW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuVGFibGUuR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eS5Qcm9qZWN0aW9uYFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItZ3NpLmh0bWwjY2ZuLWR5bmFtb2RiLWdzaS1wcm9qZWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBwcm9qZWN0aW9uOiBDZm5UYWJsZS5Qcm9qZWN0aW9uUHJvcGVydHkgfCBjZGsuVG9rZW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuVGFibGUuR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eS5Qcm92aXNpb25lZFRocm91Z2hwdXRgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1nc2kuaHRtbCNjZm4tZHluYW1vZGItZ3NpLXByb3Zpc2lvbmVkdGhyb3VnaHB1dFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdmlzaW9uZWRUaHJvdWdocHV0PzogQ2ZuVGFibGUuUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHkgfCBjZGsuVG9rZW47XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEdsb2JhbFNlY29uZGFyeUluZGV4UHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEdsb2JhbFNlY29uZGFyeUluZGV4UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuVGFibGVfR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2luZGV4TmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5pbmRleE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2luZGV4TmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5pbmRleE5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2tleVNjaGVtYScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5rZXlTY2hlbWEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2tleVNjaGVtYScsIGNkay5saXN0VmFsaWRhdG9yKENmblRhYmxlX0tleVNjaGVtYVByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5rZXlTY2hlbWEpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Byb2plY3Rpb24nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucHJvamVjdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncHJvamVjdGlvbicsIENmblRhYmxlX1Byb2plY3Rpb25Qcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5wcm9qZWN0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwcm92aXNpb25lZFRocm91Z2hwdXQnLCBDZm5UYWJsZV9Qcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5wcm92aXNpb25lZFRocm91Z2hwdXQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiR2xvYmFsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RHluYW1vREI6OlRhYmxlLkdsb2JhbFNlY29uZGFyeUluZGV4YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBHbG9iYWxTZWNvbmRhcnlJbmRleFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEeW5hbW9EQjo6VGFibGUuR2xvYmFsU2Vjb25kYXJ5SW5kZXhgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuVGFibGVHbG9iYWxTZWNvbmRhcnlJbmRleFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5UYWJsZV9HbG9iYWxTZWNvbmRhcnlJbmRleFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgSW5kZXhOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmluZGV4TmFtZSksXG4gICAgICBLZXlTY2hlbWE6IGNkay5saXN0TWFwcGVyKGNmblRhYmxlS2V5U2NoZW1hUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmtleVNjaGVtYSksXG4gICAgICBQcm9qZWN0aW9uOiBjZm5UYWJsZVByb2plY3Rpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wcm9qZWN0aW9uKSxcbiAgICAgIFByb3Zpc2lvbmVkVGhyb3VnaHB1dDogY2ZuVGFibGVQcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wcm92aXNpb25lZFRocm91Z2hwdXQpLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuVGFibGUge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1rZXlzY2hlbWEuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgS2V5U2NoZW1hUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmblRhYmxlLktleVNjaGVtYVByb3BlcnR5LkF0dHJpYnV0ZU5hbWVgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1rZXlzY2hlbWEuaHRtbCNhd3MtcHJvcGVydGllcy1keW5hbW9kYi1rZXlzY2hlbWEtYXR0cmlidXRlbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgYXR0cmlidXRlTmFtZTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmblRhYmxlLktleVNjaGVtYVByb3BlcnR5LktleVR5cGVgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1rZXlzY2hlbWEuaHRtbCNhd3MtcHJvcGVydGllcy1keW5hbW9kYi1rZXlzY2hlbWEta2V5dHlwZVxuICAgICAgICAgKi9cbiAgICAgICAga2V5VHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBLZXlTY2hlbWFQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgS2V5U2NoZW1hUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuVGFibGVfS2V5U2NoZW1hUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdHRyaWJ1dGVOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmF0dHJpYnV0ZU5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F0dHJpYnV0ZU5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXR0cmlidXRlTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5VHlwZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5rZXlUeXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdrZXlUeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmtleVR5cGUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiS2V5U2NoZW1hUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5LZXlTY2hlbWFgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEtleVNjaGVtYVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEeW5hbW9EQjo6VGFibGUuS2V5U2NoZW1hYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblRhYmxlS2V5U2NoZW1hUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblRhYmxlX0tleVNjaGVtYVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgQXR0cmlidXRlTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hdHRyaWJ1dGVOYW1lKSxcbiAgICAgIEtleVR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua2V5VHlwZSksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5UYWJsZSB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLWxzaS5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBMb2NhbFNlY29uZGFyeUluZGV4UHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmblRhYmxlLkxvY2FsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eS5JbmRleE5hbWVgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1sc2kuaHRtbCNjZm4tZHluYW1vZGItbHNpLWluZGV4bmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgaW5kZXhOYW1lOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuVGFibGUuTG9jYWxTZWNvbmRhcnlJbmRleFByb3BlcnR5LktleVNjaGVtYWBcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLWxzaS5odG1sI2Nmbi1keW5hbW9kYi1sc2kta2V5c2NoZW1hXG4gICAgICAgICAqL1xuICAgICAgICBrZXlTY2hlbWE6IEFycmF5PENmblRhYmxlLktleVNjaGVtYVByb3BlcnR5IHwgY2RrLlRva2VuPiB8IGNkay5Ub2tlbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5Mb2NhbFNlY29uZGFyeUluZGV4UHJvcGVydHkuUHJvamVjdGlvbmBcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLWxzaS5odG1sI2Nmbi1keW5hbW9kYi1sc2ktcHJvamVjdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcHJvamVjdGlvbjogQ2ZuVGFibGUuUHJvamVjdGlvblByb3BlcnR5IHwgY2RrLlRva2VuO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBMb2NhbFNlY29uZGFyeUluZGV4UHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYExvY2FsU2Vjb25kYXJ5SW5kZXhQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5UYWJsZV9Mb2NhbFNlY29uZGFyeUluZGV4UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpbmRleE5hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuaW5kZXhOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpbmRleE5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuaW5kZXhOYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdrZXlTY2hlbWEnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMua2V5U2NoZW1hKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdrZXlTY2hlbWEnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5UYWJsZV9LZXlTY2hlbWFQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMua2V5U2NoZW1hKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwcm9qZWN0aW9uJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnByb2plY3Rpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Byb2plY3Rpb24nLCBDZm5UYWJsZV9Qcm9qZWN0aW9uUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMucHJvamVjdGlvbikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJMb2NhbFNlY29uZGFyeUluZGV4UHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5Mb2NhbFNlY29uZGFyeUluZGV4YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBMb2NhbFNlY29uZGFyeUluZGV4UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5Mb2NhbFNlY29uZGFyeUluZGV4YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblRhYmxlTG9jYWxTZWNvbmRhcnlJbmRleFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5UYWJsZV9Mb2NhbFNlY29uZGFyeUluZGV4UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBJbmRleE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuaW5kZXhOYW1lKSxcbiAgICAgIEtleVNjaGVtYTogY2RrLmxpc3RNYXBwZXIoY2ZuVGFibGVLZXlTY2hlbWFQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMua2V5U2NoZW1hKSxcbiAgICAgIFByb2plY3Rpb246IGNmblRhYmxlUHJvamVjdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnByb2plY3Rpb24pLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuVGFibGUge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi10YWJsZS1wb2ludGludGltZXJlY292ZXJ5c3BlY2lmaWNhdGlvbi5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBQb2ludEluVGltZVJlY292ZXJ5U3BlY2lmaWNhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5Qb2ludEluVGltZVJlY292ZXJ5U3BlY2lmaWNhdGlvblByb3BlcnR5LlBvaW50SW5UaW1lUmVjb3ZlcnlFbmFibGVkYFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItdGFibGUtcG9pbnRpbnRpbWVyZWNvdmVyeXNwZWNpZmljYXRpb24uaHRtbCNjZm4tZHluYW1vZGItdGFibGUtcG9pbnRpbnRpbWVyZWNvdmVyeXNwZWNpZmljYXRpb24tcG9pbnRpbnRpbWVyZWNvdmVyeWVuYWJsZWRcbiAgICAgICAgICovXG4gICAgICAgIHBvaW50SW5UaW1lUmVjb3ZlcnlFbmFibGVkPzogYm9vbGVhbiB8IGNkay5Ub2tlbjtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUG9pbnRJblRpbWVSZWNvdmVyeVNwZWNpZmljYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUG9pbnRJblRpbWVSZWNvdmVyeVNwZWNpZmljYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5UYWJsZV9Qb2ludEluVGltZVJlY292ZXJ5U3BlY2lmaWNhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9pbnRJblRpbWVSZWNvdmVyeUVuYWJsZWQnLCBjZGsudmFsaWRhdGVCb29sZWFuKShwcm9wZXJ0aWVzLnBvaW50SW5UaW1lUmVjb3ZlcnlFbmFibGVkKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlBvaW50SW5UaW1lUmVjb3ZlcnlTcGVjaWZpY2F0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5Qb2ludEluVGltZVJlY292ZXJ5U3BlY2lmaWNhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUG9pbnRJblRpbWVSZWNvdmVyeVNwZWNpZmljYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RHluYW1vREI6OlRhYmxlLlBvaW50SW5UaW1lUmVjb3ZlcnlTcGVjaWZpY2F0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblRhYmxlUG9pbnRJblRpbWVSZWNvdmVyeVNwZWNpZmljYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuVGFibGVfUG9pbnRJblRpbWVSZWNvdmVyeVNwZWNpZmljYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFBvaW50SW5UaW1lUmVjb3ZlcnlFbmFibGVkOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wb2ludEluVGltZVJlY292ZXJ5RW5hYmxlZCksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5UYWJsZSB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXByb2plY3Rpb25vYmplY3QuaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5Qcm9qZWN0aW9uUHJvcGVydHkuTm9uS2V5QXR0cmlidXRlc2BcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXByb2plY3Rpb25vYmplY3QuaHRtbCNjZm4tZHluYW1vZGItcHJvamVjdGlvbm9iai1ub25rZXlhdHRcbiAgICAgICAgICovXG4gICAgICAgIG5vbktleUF0dHJpYnV0ZXM/OiBzdHJpbmdbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5Qcm9qZWN0aW9uUHJvcGVydHkuUHJvamVjdGlvblR5cGVgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1wcm9qZWN0aW9ub2JqZWN0Lmh0bWwjY2ZuLWR5bmFtb2RiLXByb2plY3Rpb25vYmotcHJvanR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHByb2plY3Rpb25UeXBlPzogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBQcm9qZWN0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByb2plY3Rpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5UYWJsZV9Qcm9qZWN0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdub25LZXlBdHRyaWJ1dGVzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5ub25LZXlBdHRyaWJ1dGVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwcm9qZWN0aW9uVHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5wcm9qZWN0aW9uVHlwZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJQcm9qZWN0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5Qcm9qZWN0aW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBQcm9qZWN0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5Qcm9qZWN0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblRhYmxlUHJvamVjdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5UYWJsZV9Qcm9qZWN0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBOb25LZXlBdHRyaWJ1dGVzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5ub25LZXlBdHRyaWJ1dGVzKSxcbiAgICAgIFByb2plY3Rpb25UeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnByb2plY3Rpb25UeXBlKSxcbiAgICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmblRhYmxlIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItcHJvdmlzaW9uZWR0aHJvdWdocHV0Lmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFByb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5Qcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eS5SZWFkQ2FwYWNpdHlVbml0c2BcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXByb3Zpc2lvbmVkdGhyb3VnaHB1dC5odG1sI2Nmbi1keW5hbW9kYi1wcm92aXNpb25lZHRocm91Z2hwdXQtcmVhZGNhcGFjaXR5dW5pdHNcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRDYXBhY2l0eVVuaXRzOiBudW1iZXIgfCBjZGsuVG9rZW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuVGFibGUuUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHkuV3JpdGVDYXBhY2l0eVVuaXRzYFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItcHJvdmlzaW9uZWR0aHJvdWdocHV0Lmh0bWwjY2ZuLWR5bmFtb2RiLXByb3Zpc2lvbmVkdGhyb3VnaHB1dC13cml0ZWNhcGFjaXR5dW5pdHNcbiAgICAgICAgICovXG4gICAgICAgIHdyaXRlQ2FwYWNpdHlVbml0czogbnVtYmVyIHwgY2RrLlRva2VuO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBQcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuVGFibGVfUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZWFkQ2FwYWNpdHlVbml0cycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5yZWFkQ2FwYWNpdHlVbml0cykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVhZENhcGFjaXR5VW5pdHMnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMucmVhZENhcGFjaXR5VW5pdHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3dyaXRlQ2FwYWNpdHlVbml0cycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy53cml0ZUNhcGFjaXR5VW5pdHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3dyaXRlQ2FwYWNpdHlVbml0cycsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy53cml0ZUNhcGFjaXR5VW5pdHMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5Qcm92aXNpb25lZFRocm91Z2hwdXRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEeW5hbW9EQjo6VGFibGUuUHJvdmlzaW9uZWRUaHJvdWdocHV0YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblRhYmxlUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblRhYmxlX1Byb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgUmVhZENhcGFjaXR5VW5pdHM6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVhZENhcGFjaXR5VW5pdHMpLFxuICAgICAgV3JpdGVDYXBhY2l0eVVuaXRzOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLndyaXRlQ2FwYWNpdHlVbml0cyksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5UYWJsZSB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXRhYmxlLXNzZXNwZWNpZmljYXRpb24uaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5TU0VTcGVjaWZpY2F0aW9uUHJvcGVydHkuU1NFRW5hYmxlZGBcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXRhYmxlLXNzZXNwZWNpZmljYXRpb24uaHRtbCNjZm4tZHluYW1vZGItdGFibGUtc3Nlc3BlY2lmaWNhdGlvbi1zc2VlbmFibGVkXG4gICAgICAgICAqL1xuICAgICAgICBzc2VFbmFibGVkOiBib29sZWFuIHwgY2RrLlRva2VuO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBTU0VTcGVjaWZpY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFNTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5UYWJsZV9TU0VTcGVjaWZpY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzc2VFbmFibGVkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnNzZUVuYWJsZWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NzZUVuYWJsZWQnLCBjZGsudmFsaWRhdGVCb29sZWFuKShwcm9wZXJ0aWVzLnNzZUVuYWJsZWQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEeW5hbW9EQjo6VGFibGUuU1NFU3BlY2lmaWNhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpEeW5hbW9EQjo6VGFibGUuU1NFU3BlY2lmaWNhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5UYWJsZVNTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuVGFibGVfU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgU1NFRW5hYmxlZDogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuc3NlRW5hYmxlZCksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5UYWJsZSB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXN0cmVhbXNwZWNpZmljYXRpb24uaHRtbFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgU3RyZWFtU3BlY2lmaWNhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5TdHJlYW1TcGVjaWZpY2F0aW9uUHJvcGVydHkuU3RyZWFtVmlld1R5cGVgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1zdHJlYW1zcGVjaWZpY2F0aW9uLmh0bWwjY2ZuLWR5bmFtb2RiLXN0cmVhbXNwZWNpZmljYXRpb24tc3RyZWFtdmlld3R5cGVcbiAgICAgICAgICovXG4gICAgICAgIHN0cmVhbVZpZXdUeXBlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYFN0cmVhbVNwZWNpZmljYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU3RyZWFtU3BlY2lmaWNhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblRhYmxlX1N0cmVhbVNwZWNpZmljYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0cmVhbVZpZXdUeXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnN0cmVhbVZpZXdUeXBlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdHJlYW1WaWV3VHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5zdHJlYW1WaWV3VHlwZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJTdHJlYW1TcGVjaWZpY2F0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5TdHJlYW1TcGVjaWZpY2F0aW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTdHJlYW1TcGVjaWZpY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5TdHJlYW1TcGVjaWZpY2F0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblRhYmxlU3RyZWFtU3BlY2lmaWNhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5UYWJsZV9TdHJlYW1TcGVjaWZpY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBTdHJlYW1WaWV3VHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zdHJlYW1WaWV3VHlwZSksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5UYWJsZSB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXRpbWV0b2xpdmVzcGVjaWZpY2F0aW9uLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uUHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmblRhYmxlLlRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uUHJvcGVydHkuQXR0cmlidXRlTmFtZWBcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXRpbWV0b2xpdmVzcGVjaWZpY2F0aW9uLmh0bWwjY2ZuLWR5bmFtb2RiLXRpbWV0b2xpdmVzcGVjaWZpY2F0aW9uLWF0dHJpYnV0ZW5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGF0dHJpYnV0ZU5hbWU6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5UYWJsZS5UaW1lVG9MaXZlU3BlY2lmaWNhdGlvblByb3BlcnR5LkVuYWJsZWRgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi10aW1ldG9saXZlc3BlY2lmaWNhdGlvbi5odG1sI2Nmbi1keW5hbW9kYi10aW1ldG9saXZlc3BlY2lmaWNhdGlvbi1lbmFibGVkXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVkOiBib29sZWFuIHwgY2RrLlRva2VuO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBUaW1lVG9MaXZlU3BlY2lmaWNhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBUaW1lVG9MaXZlU3BlY2lmaWNhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblRhYmxlX1RpbWVUb0xpdmVTcGVjaWZpY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdHRyaWJ1dGVOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmF0dHJpYnV0ZU5hbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F0dHJpYnV0ZU5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXR0cmlidXRlTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZW5hYmxlZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5lbmFibGVkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdlbmFibGVkJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5lbmFibGVkKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkR5bmFtb0RCOjpUYWJsZS5UaW1lVG9MaXZlU3BlY2lmaWNhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgVGltZVRvTGl2ZVNwZWNpZmljYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6RHluYW1vREI6OlRhYmxlLlRpbWVUb0xpdmVTcGVjaWZpY2F0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblRhYmxlVGltZVRvTGl2ZVNwZWNpZmljYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuVGFibGVfVGltZVRvTGl2ZVNwZWNpZmljYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIEF0dHJpYnV0ZU5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXR0cmlidXRlTmFtZSksXG4gICAgICBFbmFibGVkOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5lbmFibGVkKSxcbiAgICB9O1xufVxuIl19