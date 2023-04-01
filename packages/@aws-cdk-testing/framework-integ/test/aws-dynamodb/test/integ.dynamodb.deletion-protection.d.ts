import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
export declare class TestStack extends Stack {
    readonly table: Table;
    constructor(scope: Construct, id: string, props?: StackProps);
}
