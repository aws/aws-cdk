## AWS DynamoDB Construct Library
Add a DynamoDB table to you stack like so:
```ts
import dynamodb = require('@aws-cdk/aws-dynamodb');

const defaultTable = new dynamodb.Table(stack, 'TableName');

const customTable = new dynamodb.Table(stack, 'CustomTable', {
    readCapacity: readUnits, // Default is 5
    writeCapacity: writeUnits, // Default is 5
    tableName: 'MyTableName' // Default is CloudFormation-generated, which is the preferred approach
})
```
