/// !cdk-integ *

import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/*
 * Creates an Appsync GraphQL API and schema in a code-first approach.
 *
 * Stack verification steps:
 * Deploy stack, get api key and endpoinScalarType. Check if schema connects to data source.
 *
 * -- bash verify.integ.appsync-lambda.sh --start                 -- start                    --
 * -- aws appsync list-graphql-apis                               -- obtain apiId & endpoint  --
 * -- aws appsync list-api-keys --api-id [apiId]                  -- obtain api key           --
 * -- bash verify.integ.appsync-lambda.sh --check [apiKey] [url]  -- check if success         --
 * -- bash verify.integ.appsync-lambda.sh --clean                 -- clean                    --
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'LambdaAPI', {
  name: 'LambdaAPI',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.lambda.graphql')),
});

const func = new lambda.Function(stack, 'func', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'lambda-tutorial')),
  handler: 'lambda-tutorial.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

const requestPayload = (field: string, { withArgs = false, withSource = false }) => {
  const _field = `"field": "${field}"`;
  const _args = '"arguments": $utils.toJson($context.arguments)';
  const _source = '"source": $utils.toJson($context.source)';

  const _payload = [_field];
  if (withArgs) _payload.push(_args);
  if (withSource) _payload.push(_source);

  return _payload.reduce((acc, v) => `${acc} ${v},`, '{').slice(0, -1) + '}';
};
const responseMappingTemplate = appsync.MappingTemplate.lambdaResult();

lambdaDS.createResolver('QueryGetPost', {
  typeName: 'Query',
  fieldName: 'getPost',
  requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(requestPayload('getPost', { withArgs: true })),
  responseMappingTemplate,
});

lambdaDS.createResolver('QueryAllPosts', {
  typeName: 'Query',
  fieldName: 'allPosts',
  requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(requestPayload('allPosts', {})),
  responseMappingTemplate,
});

lambdaDS.createResolver('MutationAddPost', {
  typeName: 'Mutation',
  fieldName: 'addPost',
  requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(requestPayload('addPost', { withArgs: true })),
  responseMappingTemplate,
});

lambdaDS.createResolver('PostRelatedPosts', {
  typeName: 'Post',
  fieldName: 'relatedPosts',
  requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(requestPayload('relatedPosts', { withSource: true }), 'BatchInvoke'),
  responseMappingTemplate,
});

lambdaDS.createResolver('PostRelatedPostsMaxBatchSize', {
  typeName: 'Post',
  fieldName: 'relatedPostsMaxBatchSize',
  requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(requestPayload('relatedPostsMaxBatchSize', { withSource: true }), 'BatchInvoke'),
  responseMappingTemplate,
  maxBatchSize: 2,
});

app.synth();
