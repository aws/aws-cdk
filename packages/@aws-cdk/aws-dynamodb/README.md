## AWS DynamoDB Construct Library
Add a DynamoDB table to your stack like so:
```ts
import dynamodb = require('@aws-cdk/aws-dynamodb');

const defaultTable = new dynamodb.Table(stack, 'TableName');

const customTable = new dynamodb.Table(stack, 'CustomTable', {
    readCapacity: readUnits, // Default is 5
    writeCapacity: writeUnits, // Default is 5
    tableName: 'MyTableName' // Default is CloudFormation-generated, which is the preferred approach
})
```

### Setup Auto Scaling for DynamoDB Table
further reading: 
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/AutoScaling.html
https://aws.amazon.com/blogs/database/how-to-use-aws-cloudformation-to-configure-auto-scaling-for-amazon-dynamodb-tables-and-indexes/ 

#### Setup via Constructor
```ts
import dynamodb = require('@aws-cdk/aws-dynamodb');

const customTable = new dynamodb.Table(stack, 'CustomTable', {
    readCapacity: readUnits, // Default is 5
    writeCapacity: writeUnits, // Default is 5
    tableName: 'MyTableName', // Default is CloudFormation-generated, which is the preferred approach
    readAutoScaling: {
        minCapacity: 500,
        maxCapacity: 5000,
        targetValue: 75.0,
        scaleInCooldown: 30,
        scaleOutCooldown: 30,
        scalingPolicyName: 'MyAwesomeReadPolicyName'
    },
    writeAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 50.0,
        scaleInCooldown: 10,
        scaleOutCooldown: 10,
        scalingPolicyName: 'MyAwesomeWritePolicyName'
    },
});
```

#### Setup via addAutoScaling
```ts
import dynamodb = require('@aws-cdk/aws-dynamodb');

const customTable = new dynamodb.Table(stack, 'CustomTable', {
    readCapacity: readUnits, // Default is 5
    writeCapacity: writeUnits, // Default is 5
    tableName: 'MyTableName' // Default is CloudFormation-generated, which is the preferred approach
});
table.addReadAutoScaling({
    minCapacity: 500,
    maxCapacity: 5000,
    targetValue: 75.0,
    scaleInCooldown: 30,
    scaleOutCooldown: 30,
    scalingPolicyName: 'MyAwesomeReadPolicyName'
});
table.addWriteAutoScaling({
    minCapacity: 50,
    maxCapacity: 500,
    targetValue: 50.0,
    scaleInCooldown: 10,
    scaleOutCooldown: 10,
    scalingPolicyName: 'MyAwesomeWritePolicyName'
});
```