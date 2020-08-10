import * as cdk from '@aws-cdk/core';
import * as db from '@aws-cdk/aws-dynamodb';
import * as appsync from '../lib';
import * as t from './schema-type-defintions';

/*
 * Creates an Appsync GraphQL API and schema in a code-first approach.
 *
 * Stack verification steps:
 * Deploy stack, get api key and endpoint. Check if schema connects to data source.
 *
 * -- bash verify.integ.graphql-schema.sh --start                 -- start                    --
 * -- aws appsync list-graphql-apis                               -- obtain apiId & endpoint  --
 * -- aws appsync list-api-keys --api-id [apiId]                  -- obtain api key           --
 * -- bash verify.integ.graphql-schema.sh --check [apiKey] [url]  -- check if success         --
 * -- bash verify.integ.graphql-schema.sh --clean                 -- clean                    --
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'code-first-schema');

const api = new appsync.GraphQLApi(stack, 'code-first-api', {
  name: 'api',
  schemaDefinition: appsync.SchemaDefinition.CODE,
});

api.addType('Planet', {
  definition: {
    name: t.string,
    diameter: t.int,
    rotationPeriod: t.int,
    orbitalPeriod: t.int,
    gravity: t.string,
    population: t.list_string,
    climates: t.list_string,
    terrains: t.list_string,
    surfaceWater: t.float,
    created: t.string,
    edited: t.string,
    id: t.required_id,
  },
});

api.appendToSchema('type Query {\n  getPlanets: [Planet]\n}', '\n');

const table = new db.Table(stack, 'table', {
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
});

const tableDS = api.addDynamoDbDataSource('planets', 'table for planets', table);

tableDS.createResolver({
  typeName: 'Query',
  fieldName: 'getPlanets',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});

app.synth();