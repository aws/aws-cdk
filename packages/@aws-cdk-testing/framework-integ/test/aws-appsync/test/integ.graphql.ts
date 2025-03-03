import { join } from 'path';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  AuthorizationType,
  GraphqlApi,
  KeyCondition,
  MappingTemplate,
  PrimaryKey,
  SchemaFile,
  Values,
} from 'aws-cdk-lib/aws-appsync';

/*
 * Creates an Appsync GraphQL API and with multiple tables.
 * Testing for importing, querying, and mutability.
 *
 * Stack verification steps:
 * Add to a table through appsync GraphQL API.
 * Read from a table through appsync API.
 *
 * -- aws appsync list-graphql-apis                 -- obtain apiId               --
 * -- aws appsync get-graphql-api --api-id [apiId]  -- obtain GraphQL endpoint    --
 * -- aws appsync list-api-keys --api-id [apiId]    -- obtain api key             --
 * -- bash verify.integ.graphql.sh [apiKey] [url]   -- shows query and mutation   --
 */

const app = new App();
const stack = new Stack(app, 'aws-appsync-integ');

const userPool = new UserPool(stack, 'Pool', {
  userPoolName: 'myPool',
});

const api = new GraphqlApi(stack, 'Api', {
  name: 'demoapi',
  schema: SchemaFile.fromAsset(join(__dirname, 'integ.graphql.graphql')),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: AuthorizationType.USER_POOL,
      userPoolConfig: {
        userPool,
      },
    },
    additionalAuthorizationModes: [
      {
        authorizationType: AuthorizationType.API_KEY,
      },
    ],
  },
});

const noneDS = api.addNoneDataSource('none', { name: 'None' });

noneDS.createResolver('QuerygetServiceVersion', {
  typeName: 'Query',
  fieldName: 'getServiceVersion',
  requestMappingTemplate: MappingTemplate.fromString(JSON.stringify({
    version: '2017-02-28',
  })),
  responseMappingTemplate: MappingTemplate.fromString(JSON.stringify({
    version: 'v1',
  })),
});

const customerTable = new Table(stack, 'CustomerTable', {
  billingMode: BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});
const orderTable = new Table(stack, 'OrderTable', {
  billingMode: BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'customer',
    type: AttributeType.STRING,
  },
  sortKey: {
    name: 'order',
    type: AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});
orderTable.addGlobalSecondaryIndex({
  indexName: 'orderIndex',
  partitionKey: {
    name: 'order',
    type: AttributeType.STRING,
  },
  sortKey: {
    name: 'customer',
    type: AttributeType.STRING,
  },
});

new Table(stack, 'PaymentTable', {
  billingMode: BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

const paymentTable = Table.fromTableName(stack, 'ImportedPaymentTable', 'PaymentTable');

const customerDS = api.addDynamoDbDataSource('customerDs', customerTable, { name: 'Customer' });
const orderDS = api.addDynamoDbDataSource('orderDs', orderTable, { name: 'Order' });
const paymentDS = api.addDynamoDbDataSource('paymentDs', paymentTable, { name: 'Payment' });

customerDS.createResolver('QueryGetCustomers', {
  typeName: 'Query',
  fieldName: 'getCustomers',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
customerDS.createResolver('QueryGetCustomer', {
  typeName: 'Query',
  fieldName: 'getCustomer',
  requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
customerDS.createResolver('QueryGetCusomtersNotConsistent', {
  typeName: 'Query',
  fieldName: 'getCustomersNotConsistent',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(false),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
customerDS.createResolver('QueryGetCustomerNotConsistent', {
  typeName: 'Query',
  fieldName: 'getCustomerNotConsistent',
  requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id', false),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
customerDS.createResolver('QueryGetCustomersConsistent', {
  typeName: 'Query',
  fieldName: 'getCustomersConsistent',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(true),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
customerDS.createResolver('QueryGetCustomerConsistent', {
  typeName: 'Query',
  fieldName: 'getCustomerConsistent',
  requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id', true),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
customerDS.createResolver('MutationAddCustomer', {
  typeName: 'Mutation',
  fieldName: 'addCustomer',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting('customer')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
customerDS.createResolver('MutationSaveCustomer', {
  typeName: 'Mutation',
  fieldName: 'saveCustomer',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').is('id'), Values.projecting('customer')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
customerDS.createResolver('MutationSaveCustomerWithFirstOrder', {
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
customerDS.createResolver('MutationRemoveCustomer', {
  typeName: 'Mutation',
  fieldName: 'removeCustomer',
  requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem('id', 'id'),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});

const ops: Array<{ suffix: string; op: (x: string, y: string) => KeyCondition }> = [
  { suffix: 'Eq', op: (x, y) => KeyCondition.eq(x, y) },
  { suffix: 'Lt', op: (x, y) => KeyCondition.lt(x, y) },
  { suffix: 'Le', op: (x, y) => KeyCondition.le(x, y) },
  { suffix: 'Gt', op: (x, y) => KeyCondition.gt(x, y) },
  { suffix: 'Ge', op: (x, y) => KeyCondition.ge(x, y) },
];
for (const { suffix, op } of ops) {
  orderDS.createResolver(`QueryGetCustomerOrders${suffix}`, {
    typeName: 'Query',
    fieldName: 'getCustomerOrders' + suffix,
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(op('customer', 'customer')),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
  });
  orderDS.createResolver(`QueryGetOrderCustomers${suffix}`, {
    typeName: 'Query',
    fieldName: 'getOrderCustomers' + suffix,
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(op('order', 'order'), 'orderIndex'),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
  });
}
for (const { suffix, op } of ops) {
  orderDS.createResolver(`QueryGetCustomerOrdersNotConsistent${suffix}`, {
    typeName: 'Query',
    fieldName: 'getCustomerOrdersNotConsistent' + suffix,
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(op('customer', 'customer'), undefined, false),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
  });
  orderDS.createResolver(`QueryGetOrderCustomersNotConsistent${suffix}`, {
    typeName: 'Query',
    fieldName: 'getOrderCustomersNotConsistent' + suffix,
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(op('order', 'order'), 'orderIndex', false),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
  });
}
for (const { suffix, op } of ops) {
  orderDS.createResolver(`QueryGetCustomerOrdersConsistent${suffix}`, {
    typeName: 'Query',
    fieldName: 'getCustomerOrdersConsistent' + suffix,
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(op('customer', 'customer'), undefined, true),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
  });
  orderDS.createResolver(`QueryGetOrderCustomersConsistent${suffix}`, {
    typeName: 'Query',
    fieldName: 'getOrderCustomersConsistent' + suffix,
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(op('order', 'order'), 'orderIndex', true),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
  });
}
orderDS.createResolver('QueryGetCustomerOrdersFilter', {
  typeName: 'Query',
  fieldName: 'getCustomerOrdersFilter',
  requestMappingTemplate: MappingTemplate.dynamoDbQuery(
    KeyCondition.eq('customer', 'customer').and(KeyCondition.beginsWith('order', 'order'))),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
orderDS.createResolver('QueryGetCustomerOrdersBetween', {
  typeName: 'Query',
  fieldName: 'getCustomerOrdersBetween',
  requestMappingTemplate: MappingTemplate.dynamoDbQuery(
    KeyCondition.eq('customer', 'customer').and(KeyCondition.between('order', 'order1', 'order2'))),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
orderDS.createResolver('QueryGetOrderCustomersFilter', {
  typeName: 'Query',
  fieldName: 'getOrderCustomersFilter',
  requestMappingTemplate: MappingTemplate.dynamoDbQuery(
    KeyCondition.eq('order', 'order').and(KeyCondition.beginsWith('customer', 'customer'))),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
orderDS.createResolver('QueryGetOrderCustomersBetween', {
  typeName: 'Query',
  fieldName: 'getOrderCustomersBetween',
  requestMappingTemplate: MappingTemplate.dynamoDbQuery(
    KeyCondition.eq('order', 'order').and(KeyCondition.between('customer', 'customer1', 'customer2')), 'orderIndex'),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});

paymentDS.createResolver('QueryGetPayment', {
  typeName: 'Query',
  fieldName: 'getPayment',
  requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
paymentDS.createResolver('QueryGetPaymentConsistent', {
  typeName: 'Query',
  fieldName: 'getPaymentConsistent',
  requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id', true),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});
paymentDS.createResolver('MutationSavePayment', {
  typeName: 'Mutation',
  fieldName: 'savePayment',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting('payment')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});

const httpDS = api.addHttpDataSource('ds', 'https://aws.amazon.com/', { name: 'http' });

httpDS.createResolver('MutationDoPostOnAws', {
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

app.synth();
