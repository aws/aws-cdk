## @aws-cdk/aws-dynamodb-global
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

Global Tables builds upon DynamoDB’s global footprint to provide you with a fully managed, multi-region, and multi-master database that provides fast, local, read and write performance for massively scaled, global applications. Global Tables replicates your Amazon DynamoDB tables automatically across your choice of AWS regions.

Here is a minimal deployable Global DynamoDB tables definition:

```typescript
import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { GlobalTable } from '@aws-cdk/aws-dynamodb-global';
import { App } from '@aws-cdk/core';

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

GlobalTable() will set `dynamoProps.stream` to be `NEW_AND_OLD_IMAGES` since this is a required attribute for AWS Global DynamoDB tables to work.  The package will throw an error if any other `stream` specification is set in `DynamoDBGlobalStackProps`.
