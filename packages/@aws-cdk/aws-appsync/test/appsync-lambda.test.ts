import '@aws-cdk/assert/jest';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphQLApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphQLApi(stack, 'baseApi', {
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.FILE,
    schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
  });
});

describe('Lambda Data Source configuration', () => {
  // GIVEN
  let func: lambda.Function;
  beforeEach(() => {
    func = new lambda.Function(stack, 'func', {
      code: lambda.Code.fromAsset('test/verify'),
      handler: 'iam-query.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });
  });

  test('default configuration produces name `TableCDKDefault`', () => {
    // WHEN
    api.addLambdaDataSource(func);

    // EXPECT
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      Name: 'LambdaCDKDefault',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    api.addLambdaDataSource(func, {
      name: 'custom',
    });

    // EXPECT
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    api.addLambdaDataSource(func, {
      name: 'custom',
      description: 'custom description',
    });

    // EXPECT
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple lambda data sources with no configuration', () => {
    // WHEN
    const when = () => {
      api.addLambdaDataSource(func);
      api.addLambdaDataSource(func);
    };

    // EXPECT
    expect(when).toThrow('There is already a Construct with name \'LambdaCDKDefault\' in GraphQLApi [baseApi]');
  });
});

describe('adding lambda data source from imported api',() => {
  let func: lambda.Function;
  beforeEach(() => {
    func = new lambda.Function(stack, 'func', {
      code: lambda.Code.fromAsset('test/verify'),
      handler: 'iam-query.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });
  });

  test('imported api can add LambdaDbDataSource from id', () => {
    // WHEN
    const importedApi = appsync.GraphQLApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
    });
    importedApi.addLambdaDataSource(func);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      ApiId: { 'Fn::GetAtt': [ 'baseApiCDA4D43A', 'ApiId' ],
      },
    });
  });

  test('imported api can add LambdaDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.GraphQLApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
      graphqlArn: api.arn,
    });
    importedApi.addLambdaDataSource(func);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'AWS_LAMBDA',
      ApiId: { 'Fn::GetAtt': [ 'baseApiCDA4D43A', 'ApiId' ],
      },
    });
  });
});