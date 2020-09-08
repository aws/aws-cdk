import * as path from 'path';
import * as db from '@aws-cdk/aws-dynamodb';
import * as assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

/*
 * Creates an Appsync GraphQL API with schema definition through
 * s3 location.
 *
 * Stack verification steps:
 * Deploy app and check if schema is defined.
 *
 * -- cdk deploy --app 'node integ.graphql-s3.js'             -- start                      --
 * -- aws appsync list-graphql-apis                           -- obtain api id && endpoint  --
 * -- aws appsync list-api-keys --api-id [API ID]             -- obtain api key             --
 * -- bash verify.integ.graphql-s3.sh [APIKEY] [ENDPOINT]     -- return with "getTests"     --
 * -- cdk destroy --app 'node integ.graphql-s3.js'            -- clean                      --
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-appsync-integ');

const asset = new assets.Asset(stack, 'SampleAsset', {
  path: path.join(__dirname, 'appsync.test.graphql'),
});

const api = new appsync.GraphqlApi(stack, 'Api', {
  name: 'integ-test-s3',
  schema: appsync.Schema.fromS3Location(asset.s3ObjectUrl),
});

const testTable = new db.Table(stack, 'TestTable', {
  billingMode: db.BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const testDS = api.addDynamoDbDataSource('testDataSource', testTable);

testDS.createResolver({
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});

app.synth();