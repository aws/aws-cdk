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

const t_id = appsync.AttributeType.id('id').required();

// Planet Props
const t_name = appsync.AttributeType.string('name');
const t_diameter = appsync.AttributeType.int('diameter');
const t_rotationPeriod = appsync.AttributeType.int('rotationPeriod');
const t_orbitalPeriod = appsync.AttributeType.int('orbitalPeriod');
const t_gravity = appsync.AttributeType.string('gravity');
const t_population = appsync.AttributeType.float('population');
const t_climates= appsync.AttributeType.string('climates').list();
const t_terrains = appsync.AttributeType.string('terrains').list();
const t_surfaceWater = appsync.AttributeType.float('surfaceWater');
const t_created = appsync.AttributeType.string('created');
const t_edited = appsync.AttributeType.string('edited');

// Species Props
const t_classification = appsync.AttributeType.string('classification');
const t_designation = appsync.AttributeType.string('designation');
const t_averageHeight = appsync.AttributeType.float('averageHeight');
const t_averageLifespan = appsync.AttributeType.int('averageLifespan');
const t_eyeColors = appsync.AttributeType.string('eyeColors').list();
const t_hairColors = appsync.AttributeType.string('hairColors').list();
const t_skinColors = appsync.AttributeType.string('skinColors').list();
const t_language = appsync.AttributeType.string('language');

const t_planet = api.addType('Planet', {
  definition: [
    t_name,
    t_diameter,
    t_rotationPeriod,
    t_orbitalPeriod,
    t_gravity,
    t_population,
    t_climates,
    t_terrains,
    t_surfaceWater,
    t_created,
    t_edited,
    t_id,
  ],
});

api.addType('Species', {
  definition: [
    t_name,
    t_classification,
    t_designation,
    t_averageHeight,
    t_averageLifespan,
    t_eyeColors,
    t_hairColors,
    t_skinColors,
    t_language,
    appsync.AttributeType.object('homeworld', t_planet),
    t_created,
    t_edited,
    t_id,
  ],
});

api.appendToSchema('type Query {\n  getTests: [test]\n}', '\n');

app.synth();