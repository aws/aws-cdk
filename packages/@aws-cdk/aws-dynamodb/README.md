## AWS DynamoDB Construct Library

Here is a minimal deployable DynamoDB table definition:

```ts
import dynamodb = require('@aws-cdk/aws-dynamodb');

const table = new dynamodb.Table(stack, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.String }
});
```

### Keys

You can either specify `partitionKey` and/or `sortKey` when you initialize the
table, or call `addPartitionKey` and `addSortKey` after initialization.

### Configure AutoScaling for your table

You can have DynamoDB automatically raise and lower the read and write capacities
of your table by setting up autoscaling. You can use this to either keep your
tables at a desired utilization level, or by scaling up and down at preconfigured
times of the day:

[Example of configuring autoscaling](test/integ.autoscaling.lit.ts)

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/AutoScaling.html
https://aws.amazon.com/blogs/database/how-to-use-aws-cloudformation-to-configure-auto-scaling-for-amazon-dynamodb-tables-and-indexes/