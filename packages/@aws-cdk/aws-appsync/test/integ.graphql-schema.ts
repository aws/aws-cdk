import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

/*
 * Creates an Appsync GraphQL API and schema in a code-first approach.
 *
 * Stack verification steps:
 *
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'code-first-schema');

const api = new appsync.GraphQLApi(stack, 'code-first-api', {
  name: 'api',
  schemaDefinition: appsync.SchemaDefinition.CODE,
});

const t_id_r = appsync.AttributeType.id().required();
const t_string = appsync.AttributeType.string();
const t_int = appsync.AttributeType.int();
const t_float = appsync.AttributeType.float();
const t_string_l = appsync.AttributeType.string().list();

const planet = api.addType('Planet', {
  definition: {
    name: t_string,
    diameter: t_int,
    rotationPeriod: t_int,
    orbitalPeriod: t_int,
    gravity: t_string,
    population: t_string_l,
    climates: t_string_l,
    terrains: t_string_l,
    surfaceWater: t_float,
    created: t_string,
    edited: t_string,
    id: t_id_r,
  },
});

api.addType('Species', {
  definition: {
    name: t_string,
    classification: t_string,
    designation: t_string,
    averageHeight: t_float,
    averageLifespan: t_int,
    eyeColors: t_string_l,
    hairColors: t_string_l,
    skinColors: t_string_l,
    language: t_string,
    homeworld: appsync.AttributeType.object(planet),
    created: t_string,
    edited: t_string,
    id: t_id_r,
  },
});

api.appendToSchema('type Query {\n  getPlanets: [Planet]\n}', '\n');

app.synth();