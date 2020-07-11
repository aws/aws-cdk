## AWS AppSync Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

The `@aws-cdk/aws-appsync` package contains constructs for building flexible
APIs that use GraphQL. 

### Example

GraphQL schema file `schema.graphql`:

```gql
type demo {
  id: String!
  version: String!
}
type Query {
  getDemos: [ test! ]
}
input DemoInput {
  version: String!
}
type Mutation {
  addDemo(input: DemoInput!): demo
}
```

Stack file `app-stack.ts` with auth `IAM`:

```ts
import * as appsync from '@aws-cdk/aws-appsync';
import * as db from '@aws-cdk/aws-dynamodb';

const api = new appsync.GraphQLApi(stack, 'Api', {
  name: 'demo',
  schemaDefinitionFile: join(__dirname, 'schema.graphql'),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: appsync.AuthorizationType.IAM
    },
  },
});

const demoTable = new db.Table(stack, 'DemoTable', {
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
});

const demoDS = api.addDynamoDbDataSource('demoDataSource', 'Table for Demos"', demoTable);

demoDS.createResolver({
  typeName: 'Query',
  fieldName: 'getDemos',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});

demoDS.createResolver({
  typeName: 'Mutation',
  fieldName: 'addDemo',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting('demo')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
```