import { Construct } from '@aws-cdk/core';
import { KeyAttributeType, Table } from '@aws-cdk/dynamodb';

export class DynamoPostsTable extends Construct {
    constructor(parent: Construct, name: string) {
        super(parent, name);

        const table = new Table(this, 'Table', {
            readCapacity: 5, writeCapacity: 5
        });

        table.addPartitionKey('Alias', KeyAttributeType.String);
        table.addSortKey('Timestamp', KeyAttributeType.String);
    }
}
