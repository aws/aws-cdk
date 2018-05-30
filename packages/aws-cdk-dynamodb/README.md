## AWS DynamoDB Construct Library
Add a DynamoDB table to you stack like so:
```ts
import { Table } from 'aws-cdk-dynamodb';

const defaultTable = new Table(stack, 'TableName');

const customTable = new Table(stack, 'CustomTable', {
    readCapacity: readUnits, // Default is 5
    writeCapacity: writeUnits, // Default is 5
    tableName: 'MyTableName' // Default is CloudFormation-generated, which is the preferred approach
})
```
