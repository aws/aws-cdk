import { join } from 'path';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let role: iam.Role;
let api: appsync.GraphQLApi;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });
  api = new appsync.GraphQLApi(stack, 'API', {
    name: 'demo',
    schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: appsync.AuthorizationType.IAM,
      },
    },
  });
});

describe('grant Permissions', () => {

  test('grant provides custom permissions when called with `custom` argument', () => {
    // WHEN
    const grantResources = [
      { custom: 'types/Mutation/fields/addTest' },
    ];
    api.grant(role, grantResources, 'appsync:GraphQL');

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Mutation/fields/addTest',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grant provides [type parameter]/* permissions when called with `type` argument', () => {
    // WHEN
    const grantResources = [
      { type: 'Mutation' },
    ];
    api.grant(role, grantResources, 'appsync:GraphQL');

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Mutation/*',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grant provides fields/[field param] permissions when called with `type` and `field` argument', () => {
    // WHEN
    const grantResources = [
      { type: 'Mutation',
        field: 'addTest',
      },
    ];
    api.grant(role, grantResources, 'appsync:GraphQL');

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Mutation/fields/addTest',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grant provides /* permissions when called with no arguments', () => {
    // WHEN
    const grantResources = [
      { },
    ];
    api.grant(role, grantResources, 'appsync:GraphQL');

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/*',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grant provides /* permissions when called with `field` but without `type` arguments', () => {
    // WHEN
    const grantResources = [
      { field: 'garbage' },
    ];
    api.grant(role, grantResources, 'appsync:GraphQL');

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/*',
              ]],
            },
          },
        ],
      },
    });
  });
});

describe('grantMutation Permissions', () => {

  test('grantMutation provides Mutation/* permissions when called with no `fields` argument', () => {
    // WHEN
    api.grantMutation(role);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Mutation/*',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grantMutation provides fields/[field param] permissions when called with `fields` argument', () => {
    // WHEN
    api.grantMutation(role, ['addTest']);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Mutation/fields/addTest',
              ]],
            },
          },
        ],
      },
    });
  });
});

describe('grantQuery Permissions', () => {

  test('grantQuery provides Query/* permissions when called without the `fields` argument', () => {
    // WHEN
    api.grantQuery(role);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Query/*',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grantQuery provides fields/[field param] permissions when called with `fields` arugment', () => {
    // WHEN
    api.grantQuery(role, ['getTest']);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Query/fields/getTest',
              ]],
            },
          },
        ],
      },
    });
  });
});

describe('grantSubscription Permissions', () => {

  test('grantSubscription provides Subscription/* permissions when called without `fields` argument', () => {
    // WHEN
    api.grantSubscription(role);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Subscription/*',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grantSubscription provides fields/[field param] when called with `field` argument', () => {
    api.grantSubscription(role, ['subscribe']);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/Subscription/fields/subscribe',
              ]],
            },
          },
        ],
      },
    });
  });
});

describe('grantType Permissions', () => {

  test('grantType provides [type param]/* permissions when called without `fields` argument', () => {
    // WHEN
    api.grantType(role, 'customType');

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/customType/*',
              ]],
            },
          },
        ],
      },
    });
  });

  test('grantType provides fields/[field param] permissions when called with `field` argument', () => {
    // WHEN
    api.grantType(role, 'customType', ['attribute']);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/types/customType/fields/attribute',
              ]],
            },
          },
        ],
      },
    });
  });
});

describe('grantFullAccess Permissions', () => {

  test('grantFullAccess provides /* permissions', () => {
    // WHEN
    api.grantFullAccess(role);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appsync:GraphQL',
            Resource: {
              'Fn::Join': [ '', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appsync:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':apis/',
                { 'Fn::GetAtt': [ 'API62EA1CFF', 'ApiId' ] },
                '/*',
              ]],
            },
          },
        ],
      },
    });
  });
});