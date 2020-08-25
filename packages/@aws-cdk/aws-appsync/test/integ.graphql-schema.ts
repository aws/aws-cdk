import * as db from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as ObjectType from './object-type-definitions';
import * as ScalarType from './scalar-type-defintions';

/*
 * Creates an Appsync GraphQL API and schema in a code-first approach.
 *
 * Stack verification steps:
 * Deploy stack, get api key and endpoinScalarType. Check if schema connects to data source.
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

const planet = ObjectType.planet;
api.appendToSchema(planet.toString());

api.addType('Species', {
  definition: {
    name: ScalarType.string,
    classification: ScalarType.string,
    designation: ScalarType.string,
    averageHeight: ScalarType.float,
    averageLifespan: ScalarType.int,
    eyeColors: ScalarType.list_string,
    hairColors: ScalarType.list_string,
    skinColors: ScalarType.list_string,
    language: ScalarType.string,
    homeworld: planet.attribute(),
    created: ScalarType.string,
    edited: ScalarType.string,
    id: ScalarType.required_id,
  },
});

api.appendToSchema('type Query {\n  getPlanets: [Planet]\n}', '\n');

const table = new db.Table(stack, 'table', {
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
});

const tableDS = api.addDynamoDbDataSource('planets', table);

tableDS.createResolver({
  typeName: 'Query',
  fieldName: 'getPlanets',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});

app.synth();