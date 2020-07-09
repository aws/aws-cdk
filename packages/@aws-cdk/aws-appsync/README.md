## AWS AppSync Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Usage Example

Given the following GraphQL schema file `schema.graphql`:

```graphql
type ServiceVersion {
    version: String!
}

type Customer {
    id: String!
    name: String!
}

input SaveCustomerInput {
    name: String!
}

type Order {
    customer: String!
    order: String!
}

type Query {
    getServiceVersion: ServiceVersion
    getCustomers: [Customer]
    getCustomer(id: String): Customer
}

input FirstOrderInput {
    product: String!
    quantity: Int!
}

type Mutation {
    addCustomer(customer: SaveCustomerInput!): Customer
    saveCustomer(id: String!, customer: SaveCustomerInput!): Customer
    removeCustomer(id: String!): Customer
    saveCustomerWithFirstOrder(customer: SaveCustomerInput!, order: FirstOrderInput!, referral: String): Order
    doPostOnAws: String!
}
```

the following CDK app snippet will create a complete CRUD AppSync API:

```ts
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'myPool',
    });

    const api = new GraphQLApi(this, 'Api', {
      name: `demoapi`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
            defaultAction: UserPoolDefaultAction.ALLOW
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.API_KEY,
          }
        ],
      },
      schemaDefinitionFile: './schema.graphql',
    });

    const noneDS = api.addNoneDataSource('None', 'Dummy data source');

    noneDS.createResolver({
      typeName: 'Query',
      fieldName: 'getServiceVersion',
      requestMappingTemplate: MappingTemplate.fromString(JSON.stringify({
        version: '2017-02-28',
      })),
      responseMappingTemplate: MappingTemplate.fromString(JSON.stringify({
        version: 'v1',
      })),
    });

    const customerTable = new Table(this, 'CustomerTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });
    // If your table is already created you can also use use import table and use it as data source.
    const customerDS = api.addDynamoDbDataSource('Customer', 'The customer data source', customerTable);
    customerDS.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomers',
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });
    customerDS.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'addCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
          PrimaryKey.partition('id').auto(),
          Values.projecting('customer')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'saveCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
          PrimaryKey.partition('id').is('id'),
          Values.projecting('customer')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'saveCustomerWithFirstOrder',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
          PrimaryKey
              .partition('order').auto()
              .sort('customer').is('customer.id'),
          Values
              .projecting('order')
              .attribute('referral').is('referral')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'removeCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    const httpDS = api.addHttpDataSource('http', 'The http data source', 'https://aws.amazon.com/');

    httpDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'doPostOnAws',
      requestMappingTemplate: MappingTemplate.fromString(`{
        "version": "2018-05-29",
        "method": "POST",
        # if full path is https://api.xxxxxxxxx.com/posts then resourcePath would be /posts
        "resourcePath": "/path/123",
        "params":{
            "body": $util.toJson($ctx.args),
            "headers":{
                "Content-Type": "application/json",
                "Authorization": "$ctx.request.headers.Authorization"
            }
        }
      }`),
      responseMappingTemplate: MappingTemplate.fromString(`
        ## Raise a GraphQL field error in case of a datasource invocation error
        #if($ctx.error)
          $util.error($ctx.error.message, $ctx.error.type)
        #end
        ## if the response status code is not 200, then return an error. Else return the body **
        #if($ctx.result.statusCode == 200)
            ## If response is 200, return the body.
            $ctx.result.body
        #else
            ## If response is not 200, append the response to error block.
            $utils.appendError($ctx.result.body, "$ctx.result.statusCode")
        #end
      `),
    });
  }
}
```
