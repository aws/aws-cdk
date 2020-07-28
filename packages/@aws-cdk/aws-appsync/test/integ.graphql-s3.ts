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
 * da2-z3xi4w55trgmxpzley2t7bfefe https://vymliuqndveudjq352yk4cuvg4.appsync-api.us-east-1.amazonaws.com/graphql
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

const api = new appsync.GraphQLApi(stack, 'Api', {
  name: 'integ-test-s3',
  schemaDefinition: appsync.SchemaDefinition.S3,
  schemaDefinitionFile: asset.s3ObjectUrl,
});

const testTable = new db.Table(stack, 'TestTable', {
  billingMode: db.BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const testDS = api.addDynamoDbDataSource('testDataSource', 'Table for Tests"', testTable);

testDS.createResolver({
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});

app.synth();
