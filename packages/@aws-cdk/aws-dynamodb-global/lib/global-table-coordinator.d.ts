import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { GlobalTableProps } from './aws-dynamodb-global';
/**
 * A stack that will make a Lambda that will launch a lambda to glue
 * together all the DynamoDB tables into a global table
 */
export declare class GlobalTableCoordinator extends cdk.Stack {
    constructor(scope: Construct, id: string, props: GlobalTableProps);
}
