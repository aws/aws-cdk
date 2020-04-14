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
}
```

the following CDK app snippet will create a complete CRUD AppSync API:

```ts
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, 'UserPool', {
      signInType: SignInType.USERNAME,
    });

    const api = new GraphQLApi(this, 'Api', {
      name: `demoapi`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          userPool,
          defaultAction: UserPoolDefaultAction.ALLOW,
        },
        additionalAuthorizationModes: [
          {
            apiKeyDesc: 'My API Key',
          },
        ],
      },
      schemaDefinitionFile: './schema.graphql',
    });

    const customerTable = new Table(this, 'CustomerTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });
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
  }
}
```