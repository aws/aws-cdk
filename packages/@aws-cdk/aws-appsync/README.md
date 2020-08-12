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

Example of a GraphQL API with `AWS_IAM` authorization resolving into a DynamoDb
backend data source. 

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

CDK stack file `app-stack.ts`:

```ts
import * as appsync from '@aws-cdk/aws-appsync';
import * as db from '@aws-cdk/aws-dynamodb';

const api = new appsync.GraphQLApi(stack, 'Api', {
  name: 'demo',
  schemaDefinition: appsync.SchemaDefinition.FILE,
  schemaDefinitionFile: join(__dirname, 'schema.graphql'),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: appsync.AuthorizationType.IAM
    },
  },
  xrayEnabled: true,
});

const demoTable = new db.Table(stack, 'DemoTable', {
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
});

const demoDS = api.addDynamoDbDataSource('demoDataSource', 'Table for Demos"', demoTable);

// Resolver for the Query "getDemos" that scans the DyanmoDb table and returns the entire list.
demoDS.createResolver({
  typeName: 'Query',
  fieldName: 'getDemos',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});

// Resolver for the Mutation "addDemo" that puts the item into the DynamoDb table.
demoDS.createResolver({
  typeName: 'Mutation',
  fieldName: 'addDemo',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting('demo')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
```

## Permissions

When using `AWS_IAM` as the authorization type for GraphQL API, an IAM Role
with correct permissions must be used for access to API.

When configuring permissions, you can specify specific resources to only be
accessible by `IAM` authorization. For example, if you want to only allow mutability
for `IAM` authorized access you would configure the following.

In `schema.graphql`:
```ts
type Mutation {
  updateExample(...): ...
    @aws_iam
}
```

In `IAM`:
```json
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Action": [
            "appsync:GraphQL"
         ],
         "Resource": [
            "arn:aws:appsync:REGION:ACCOUNT_ID:apis/GRAPHQL_ID/types/Mutation/fields/updateExample"
         ]
      }
   ]
}
```

See [documentation](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#aws-iam-authorization) for more details.

To make this easier, CDK provides `grant` API.

Use the `grant` function for more granular authorization.

```ts
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
const api = new appsync.GraphQLApi(stack, 'API', {
  definition
});

api.grant(role, appsync.IamResource.custom('types/Mutation/fields/updateExample'), 'appsync:GraphQL')
```

### IamResource

In order to use the `grant` functions, you need to use the class `IamResource`.

- `IamResource.custom(...arns)` permits custom ARNs and requires an argument.

- `IamResouce.ofType(type, ...fields)` permits ARNs for types and their fields.

- `IamResource.all()` permits ALL resources.

### Generic Permissions

Alternatively, you can use more generic `grant` functions to accomplish the same usage.

These include:
- grantMutation (use to grant access to Mutation fields)
- grantQuery (use to grant access to Query fields)
- grantSubscription (use to grant access to Subscription fields)

```ts
// For generic types
api.grantMutation(role, 'updateExample');

// For custom types and granular design
api.grant(role, appsync.IamResource.ofType('Mutation', 'updateExample'), 'appsync:GraphQL');
```
