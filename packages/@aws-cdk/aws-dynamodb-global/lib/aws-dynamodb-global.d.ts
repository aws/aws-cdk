import dynamodb = require("@aws-cdk/aws-dynamodb");
import cdk = require("@aws-cdk/cdk");
import { LambdaGlobalDynamoDBMaker } from "./lambda-global-dynamodb";
import { MultiDynamoDBStack } from "./multi-dynamodb-stack";
/**
 * NOTE: These props should match dynamodb.TableProps exactly
 * EXCEPT for tableName is now required (for global tables to work, the
 * table name must match across regions)
 */
export interface GlobalDynamoDBProps {
    /**
     * Partition key attribute definition.
     */
    partitionKey: dynamodb.Attribute;
    /**
     * Table sort key attribute definition.
     *
     * @default no sort key
     */
    sortKey?: dynamodb.Attribute;
    /**
     * The read capacity for the table. Careful if you add Global Secondary Indexes, as
     * those will share the table's provisioned throughput.
     *
     * Can only be provided if billingMode is Provisioned.
     *
     * @default 5
     */
    readCapacity?: number;
    /**
     * The write capacity for the table. Careful if you add Global Secondary Indexes, as
     * those will share the table's provisioned throughput.
     *
     * Can only be provided if billingMode is Provisioned.
     *
     * @default 5
     */
    writeCapacity?: number;
    /**
     * Specify how you are charged for read and write throughput and how you manage capacity.
     * @default Provisioned
     */
    billingMode?: dynamodb.BillingMode;
    /**
     * Enforces a particular physical table name.
     * @default <generated>
     */
    tableName: string;
    /**
     * Whether point-in-time recovery is enabled.
     * @default undefined, point-in-time recovery is disabled
     */
    pitrEnabled?: boolean;
    /**
     * Whether server-side encryption with an AWS managed customer master key is enabled.
     * @default undefined, server-side encryption is enabled with an AWS owned customer master key
     */
    sseEnabled?: boolean;
    /**
     * When an item in the table is modified, StreamViewType determines what information
     * is written to the stream for this table. Valid values for StreamViewType are:
     * @default dynamodb.StreamViewType.NewAndOldImages, streams must be enabled
     */
    streamSpecification?: dynamodb.StreamViewType;
    /**
     * The name of TTL attribute.
     * @default undefined, TTL is disabled
     */
    ttlAttributeName?: string;
}
/**
 * Properties for the mutliple DynamoDB tables to mash together into a
 * global table
 */
export interface DynamoDBGlobalStackProps extends cdk.StackProps {
    /**
     * Properties for DynamoDB Tables
     * All the properties must be exactly the same
     * to make the tables mesh together as a global table
     */
    dynamoProps: GlobalDynamoDBProps;
    /**
     * Array of environments to create DynamoDB tables in
     * Accounts should be omitted, or at least all identical
     */
    regions: string[];
}
export declare class GlobalTable extends cdk.Construct {
    /**
     * Creates dynamoDB tables across regions that will be able to be globbed together into a global table
     */
    tables: MultiDynamoDBStack[];
    /**
     * Creates the cloudformation custom resource that launches a lambda to tie it all together
     */
    lambdaGlobalDynamodbMaker: LambdaGlobalDynamoDBMaker;
    constructor(scope: cdk.Construct, id: string, props: DynamoDBGlobalStackProps);
}
