import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Properties for the multiple DynamoDB tables to mash together into a
 * global table
 */
export interface GlobalTableProps extends cdk.StackProps, dynamodb.TableOptions {
    /**
     * Name of the DynamoDB table to use across all regional tables.
     * This is required for global tables.
     */
    readonly tableName: string;
    /**
     * Array of environments to create DynamoDB tables in.
     * The tables will all be created in the same account.
     */
    readonly regions: string[];
}
/**
 * This class works by deploying an AWS DynamoDB table into each region specified in  GlobalTableProps.regions[],
 * then triggering a CloudFormation Custom Resource Lambda to link them all together to create linked AWS Global DynamoDB tables.
 *
 * @deprecated use `@aws-cdk/aws-dynamodb.Table.replicationRegions` instead
 */
export declare class GlobalTable extends Construct {
    /**
     * Creates the cloudformation custom resource that launches a lambda to tie it all together
     */
    private lambdaGlobalTableCoordinator;
    /**
     * Creates dynamoDB tables across regions that will be able to be globbed together into a global table
     */
    private readonly _regionalTables;
    constructor(scope: Construct, id: string, props: GlobalTableProps);
    /**
     * Obtain tables deployed in other each region
     */
    get regionalTables(): dynamodb.Table[];
}
