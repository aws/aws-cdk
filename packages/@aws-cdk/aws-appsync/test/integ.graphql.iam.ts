import { UserPool } from '@aws-cdk/aws-cognito';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { join } from 'path';
import {
  AuthorizationType,
  GraphQLApi,
  MappingTemplate,
  PrimaryKey,
  UserPoolDefaultAction,
  Values,
} from '../lib';

/*
 * TODO
 *
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

const api = new GraphQLApi(stack, 'Api', {
  name: 'Integ_Test_IAM',
  schemaDefinitionFile: join(__dirname, 'integ.graphql.iam.graphql'),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: AuthorizationType.USER_POOL,
      userPoolConfig: {
        userPool,
        defaultAction: UserPoolDefaultAction.ALLOW,
      },
    },
    additionalAuthorizationModes: [
      {
        authorizationType: AuthorizationType.IAM,
      },
    ],
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
  fieldName: 'getTest',
  requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});

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

const backendRole = api.role;

new Function(stack, 'testFunction', {
  code: Code.fromAsset('lambda'),
  handler: 'iam.handler',
  runtime: Runtime.NODEJS_12_X,
  role: backendRole,
});

app.synth();
