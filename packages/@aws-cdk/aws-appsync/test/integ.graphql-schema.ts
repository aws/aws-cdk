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

api.addType('test', {
  definition: [
    appsync.AttributeType.string('id', {
      isRequired: true,
    }),
    appsync.AttributeType.string('version', {
      isRequired: true,
    }),
  ],
  directives: [
    appsync.Directive.iam(),
  ],
});

api.appendToSchema('type Query {\n  getTest(id: String!): test\n}', '\n');

app.synth();