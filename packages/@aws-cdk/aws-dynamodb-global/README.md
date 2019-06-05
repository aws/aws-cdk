## @aws-cdk/aws-dynamodb-global

Global Tables builds upon DynamoDB’s global footprint to provide you with a fully managed, multi-region, and multi-master database that provides fast, local, read and write performance for massively scaled, global applications. Global Tables replicates your Amazon DynamoDB tables automatically across your choice of AWS regions.

Here is a minimal deployable Global DynamoDB tables definition:

```typescript
import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { GlobalTable } from '@aws-cdk/aws-dynamodb-global';
import { App } from '@aws-cdk/cdk';

const app = new App();
new GlobalTable(app, 'globdynamodb', {
  partitionKey: { name: 'hashKey', type: AttributeType.String },
  tableName: 'GlobalTable',
  regions: [ "us-east-1", "us-east-2", "us-west-2" ]
});
app.synth();
```

## Implementation Notes
AWS Global DynamoDB Tables is an odd case currently.  The way this package works -

* Creates a DynamoDB table in a separate stack in each `DynamoDBGlobalStackProps.region` specified
* Deploys a CFN Custom Resource to your stack's specified region that calls a lambda that runs the aws cli which calls `createGlobalTable()`

### Notes

GlobalTable() will set `dynamoProps.streamSpecification` to be `NEW_AND_OLD_IMAGES` since this is a required attribute for AWS Global DynamoDB tables to work.  The package will throw an error if any other `streamSpecification` is set in `DynamoDBGlobalStackProps`.
