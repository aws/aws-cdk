import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { App, Stack } from '@aws-cdk/core';
import { join } from 'path';
import { GraphQLApi, KeyCondition, MappingTemplate } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-appsync-integ');

const api = new GraphQLApi(stack, 'Api', {
    name: `demoapi`,
    schemaDefinitionFile: join(__dirname, 'schema.graphql'),
});

const customerTable = new Table(stack, 'CustomerTable', {
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
    },
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
    }
});

const customerDS = api.addDynamoDbDataSource('Customer', 'The customer data source', customerTable);
const orderDS = api.addDynamoDbDataSource('Order', 'The irder data source', orderTable);

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

const ops = [
    { suffix: "Eq", op: KeyCondition.eq},
    { suffix: "Lt", op: KeyCondition.lt},
    { suffix: "Le", op: KeyCondition.le},
    { suffix: "Gt", op: KeyCondition.gt},
    { suffix: "Ge", op: KeyCondition.ge},
];
for (const {suffix, op} of ops) {
    orderDS.createResolver({
        typeName: 'Query',
        fieldName: 'getCustomerOrders' + suffix,
        requestMappingTemplate: MappingTemplate.dynamoDbQuery(op('customer', 'customer')),
        responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });
}
orderDS.createResolver({
    typeName: 'Query',
    fieldName: 'getCustomerOrdersFilter',
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(
        KeyCondition.eq('customer', 'customer').and(KeyCondition.beginsWith('order', 'order'))),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});
orderDS.createResolver({
    typeName: 'Query',
    fieldName: 'getCustomerOrdersBetween',
    requestMappingTemplate: MappingTemplate.dynamoDbQuery(
        KeyCondition.eq('customer', 'customer').and(KeyCondition.between('order', 'order1', 'order2'))),
    responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});

app.synth();