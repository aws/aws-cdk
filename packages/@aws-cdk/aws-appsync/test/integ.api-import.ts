/// !cdk-integ *

import * as path from 'path';
import * as db from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

/*
 * Creates an Appsync GraphQL API in a separate stack.
 * Add dependencies to imported api.
 *
 * Stack verification steps:
 * Install dependencies and deploy integration test. Check if data sources are
 * connected to the graphQL Api
 *
 * -- cdk deploy --app 'node integ.api-import.js' stack            -- start         --
 * -- aws appsync list-graphql-apis                                -- obtain api id --
 * -- aws appsync list-data-sources --api-id [api_id]              -- testDS/None   --
 * -- cdk destroy --app 'node integ.api-import.js' stack baseStack -- clean         --
 */

const app = new cdk.App();
const baseStack = new cdk.Stack(app, 'baseStack');

const baseApi = new appsync.GraphQLApi(baseStack, 'baseApi', {
  name: 'baseApi',
  schemaDefinition: appsync.SchemaDefinition.FILE,
  schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
});

const stack = new cdk.Stack(app, 'stack');
const api = appsync.GraphQLApi.fromGraphqlApiAttributes(stack, 'Api', {
  graphqlApiId: `${baseApi.apiId}`,
});

const testTable = new db.Table(stack, 'TestTable', {
  billingMode: db.BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const testDS = api.addDynamoDbDataSource('ds', testTable);

testDS.createResolver({
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});

testDS.createResolver({
  typeName: 'Mutation',
  fieldName: 'addTest',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition('id').auto(), appsync.Values.projecting('test')),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
});

const api2 = appsync.GraphQLApi.fromGraphqlApiAttributes(stack, 'api2', {
  graphqlApiId: baseApi.apiId,
  graphqlApiArn: baseApi.arn,
});

api2.addNoneDataSource('none');

app.synth();