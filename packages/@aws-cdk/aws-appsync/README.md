## AWS AppSync Construct Library
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

type Query {
    getCustomers: [Customer]
    getCustomer(id: String): Customer
}

type Mutation {
    addCustomer(customer: SaveCustomerInput!): Customer
    saveCustomer(id: String!, customer: SaveCustomerInput!): Customer
    removeCustomer(id: String!): Customer
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
      userPoolConfig: {
        userPool,
        defaultAction: UserPoolDefaultAction.ALLOW,
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
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem('id', 'customer'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'saveCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem('id', 'customer', 'id'),
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