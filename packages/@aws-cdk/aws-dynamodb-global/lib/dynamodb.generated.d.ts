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
 * A CloudFormation `AWS::DynamoDB::Table`
 *
 * @cloudformationResource AWS::DynamoDB::Table
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
 */
export declare class CfnTable extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly resourceTypeName = "AWS::DynamoDB::Table";
    /**
     * @cloudformationAttribute Arn
     */
    readonly tableArn: string;
    /**
     * @cloudformationAttribute StreamArn
     */
    readonly tableStreamArn: string;
    readonly tableName: string;
    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::DynamoDB::Table`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnTableProps);
    readonly propertyOverrides: CfnTableProps;
    protected renderProperties(properties: any): {
        [key: string]: any;
    };
}
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html
     */
    interface AttributeDefinitionProperty {
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
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html
     */
    interface GlobalSecondaryIndexProperty {
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
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-keyschema.html
     */
    interface KeySchemaProperty {
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
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-lsi.html
     */
    interface LocalSecondaryIndexProperty {
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
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html
     */
    interface PointInTimeRecoverySpecificationProperty {
        /**
         * `CfnTable.PointInTimeRecoverySpecificationProperty.PointInTimeRecoveryEnabled`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html#cfn-dynamodb-table-pointintimerecoveryspecification-pointintimerecoveryenabled
         */
        pointInTimeRecoveryEnabled?: boolean | cdk.Token;
    }
}
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-projectionobject.html
     */
    interface ProjectionProperty {
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
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    interface ProvisionedThroughputProperty {
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
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
     */
    interface SSESpecificationProperty {
        /**
         * `CfnTable.SSESpecificationProperty.SSEEnabled`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html#cfn-dynamodb-table-ssespecification-sseenabled
         */
        sseEnabled: boolean | cdk.Token;
    }
}
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html
     */
    interface StreamSpecificationProperty {
        /**
         * `CfnTable.StreamSpecificationProperty.StreamViewType`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html#cfn-dynamodb-streamspecification-streamviewtype
         */
        streamViewType: string;
    }
}
export declare namespace CfnTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-timetolivespecification.html
     */
    interface TimeToLiveSpecificationProperty {
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
