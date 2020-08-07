import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as t from './schema-type-defintions';

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

const planet = api.addType('Planet', {
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

const t_planet = planet.attribute();

api.addType('Species', {
  definition: {
    name: t.string,
    classification: t.string,
    designation: t.string,
    averageHeight: t.float,
    averageLifespan: t.int,
    eyeColors: t.list_string,
    hairColors: t.list_string,
    skinColors: t.list_string,
    language: t.string,
    homeworld: t_planet,
    created: t.string,
    edited: t.string,
    id: t.required_id,
  },
});

api.appendToSchema('type Query {\n  getPlanets: [Planet]\n}', '\n');

app.synth();