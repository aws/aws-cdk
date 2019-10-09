import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { App, Stack } from '@aws-cdk/core';
import { join } from 'path';
import { GraphQLApi, MappingTemplate } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');

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

app.synth();