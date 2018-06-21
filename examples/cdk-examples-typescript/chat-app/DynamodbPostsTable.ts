import { Construct } from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/dynamodb';

export class DynamoPostsTable extends Construct {
    constructor(parent: Construct, name: string) {
        super(parent, name);

        const table = new dynamodb.Table(this, 'Table', {
            readCapacity: 5, writeCapacity: 5
        });

        table.addPartitionKey('Alias', dynamodb.KeyAttributeType.String);
        table.addSortKey('Timestamp', dynamodb.KeyAttributeType.String);
    }
}
