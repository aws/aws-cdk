import { join } from 'path';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { App, RemovalPolicy, Stack, Expires, Duration } from '@aws-cdk/core';
import {
  AuthorizationType,
  GraphQLApi,
  MappingTemplate,
  PrimaryKey,
  Values,
} from '../lib';
/*
 * Creates an Appsync GraphQL API with API_KEY authorization.
 * Testing for API_KEY Authorization.
 *
 * Stack verification steps:
 * Deploy stack, get api-key and endpoint.
 * Check if authorization occurs with empty get.
 *
 * -- bash verify.integ.auth-apikey.sh --start                      -- deploy stack               --
 * -- aws appsync list-graphql-apis                                 -- obtain api id && endpoint  --
 * -- aws appsync list-api-keys --api-id [API ID]                   -- obtain api key             --
 * -- bash verify.integ.auth-apikey.sh --check [APIKEY] [ENDPOINT]  -- check if fails/success     --
 * -- bash verify.integ.auth-apikey.sh --clean                      -- clean dependencies/stack   --
 */

const app = new App();
const stack = new Stack(app, 'aws-appsync-integ');

const api = new GraphQLApi(stack, 'Api', {
  name: 'Integ_Test_APIKey',
  schemaDefinitionFile: join(__dirname, 'appsync.auth.graphql'),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: AuthorizationType.API_KEY,
      apiKeyConfig: {
        expires: Expires.after(Duration.days(2)),
      },
    },
  },
});

const testTable = new Table(stack, 'TestTable', {
  billingMode: BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

const testDS = api.addDynamoDbDataSource('testDataSource', 'Table for Tests"', testTable);

testDS.createResolver({
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});

testDS.createResolver({
  typeName: 'Mutation',
  fieldName: 'addTest',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting('test')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});

app.synth();