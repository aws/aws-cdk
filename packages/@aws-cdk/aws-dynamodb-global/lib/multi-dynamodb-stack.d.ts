import dynamodb = require("@aws-cdk/aws-dynamodb");
import cdk = require("@aws-cdk/cdk");
import { DynamoDBGlobalStackProps } from "./aws-dynamodb-global";
/**
 * Stack to create a single DynamoDB Table
 */
export declare class MultiDynamoDBStack extends cdk.Stack {
    /**
     * The DynamoDB Table created
     */
    table: dynamodb.Table;
    constructor(scope: cdk.Construct, id: string, props: DynamoDBGlobalStackProps);
}
