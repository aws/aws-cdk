import { join } from 'path';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { AuthorizationType, GraphqlApi, MappingTemplate, PrimaryKey, SchemaFile, Values } from '../lib';

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

const api = new GraphqlApi(stack, 'Api', {
  name: 'Integ_Test_APIKey',
  schema: SchemaFile.fromAsset(join(__dirname, 'appsync.auth.graphql')),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: AuthorizationType.API_KEY,
      apiKeyConfig: {
        // Rely on default expiration date provided by the API so we have a deterministic snapshot
        expires: undefined,
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

const testDS = api.addDynamoDbDataSource('testDataSource', testTable);

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
