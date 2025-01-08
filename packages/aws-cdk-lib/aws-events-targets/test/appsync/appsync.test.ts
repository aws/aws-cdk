import * as path from 'path';
import { Template } from '../../../assertions';
import * as appsync from '../../../aws-appsync';
import * as events from '../../../aws-events';
import * as iam from '../../../aws-iam';
import * as sqs from '../../../aws-sqs';
import * as cdk from '../../../core';
import * as targets from '../../lib';

const graphQLOperation = 'mutation Publish($message: String!){ publish(message: $message) { event } }';

describe('AppSync GraphQL API target', () => {
  let stack: cdk.Stack;
  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('fails when AWS_IAM auth is not configured', () => {
    const noiam_api = new appsync.GraphqlApi(stack, 'noiamApi', {
      name: 'no_iam_api',
      definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
    });

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    expect(() => {
      rule.addTarget(new targets.AppSync(noiam_api, {
        graphQLOperation,
        variables: events.RuleTargetInput.fromObject({
          message: events.EventField.fromPath('$.detail'),
        }),
      }));
    }).toThrow('You must have AWS_IAM authorization mode enabled on your API to configure an AppSync target');
  });

  test('fails when graphQLEndpointArn is not configured', () => {
    const noEndpointArnAPI = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'ImportedAPI', {
      graphqlApiId: 'MyApiId',
      graphqlApiArn: 'MyApiArn',
      modes: [appsync.AuthorizationType.IAM],
    });

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    expect(() => {
      rule.addTarget(new targets.AppSync(noEndpointArnAPI, {
        graphQLOperation,
        variables: events.RuleTargetInput.fromObject({
          message: events.EventField.fromPath('$.detail'),
        }),
      }));
    }).toThrow('You must have a valid `graphQLEndpointArn` set');
  });

  test('Accepts API create with fromGraphqlApiAttributes', () => {
    const api = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'ImportedAPI', {
      graphqlApiId: 'MyApiId',
      graphqlApiArn: 'MyApiArn',
      graphQLEndpointArn: 'arn:aws:appsync:us-east-2:000000000000:endpoints/graphql-api/00000000000000000000000000',
      visibility: appsync.Visibility.GLOBAL,
      modes: [appsync.AuthorizationType.IAM],
    });

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    // WHEN
    rule.addTarget(new targets.AppSync(api, {
      graphQLOperation,
      variables: events.RuleTargetInput.fromObject({
        message: events.EventField.fromPath('$.detail'),
      }),
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: api.graphQLEndpointArn,
          AppSyncParameters: { GraphQLOperation: graphQLOperation },
          Id: 'Target0',
          InputTransformer: {
            InputPathsMap: { detail: '$.detail' },
            InputTemplate: '{"message":<detail>}',
          },
          RoleArn: {
            'Fn::GetAtt': [
              'ImportedAPIEventsRole9CE171B7',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('allows secondary auth with AWS_IAM configured', () => {
    const sec_api = new appsync.GraphqlApi(stack, 'sec_api', {
      name: 'no_iam_api',
      definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: { additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.IAM }] },
    });

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    expect(() => {
      rule.addTarget(new targets.AppSync(sec_api, {
        graphQLOperation,
        variables: events.RuleTargetInput.fromObject({
          message: events.EventField.fromPath('$.detail'),
        }),
      }));
    }).not.toThrow('You must have AWS_IAM authorization mode enabled on your API to configure an AppSync target');
  });

  test('fails when VISIBILITY is not "GLOBAL"', () => {
    const sec_api = new appsync.GraphqlApi(stack, 'sec_api', {
      name: 'no_iam_api',
      visibility: appsync.Visibility.PRIVATE,
      definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: { additionalAuthorizationModes: [{ authorizationType: appsync.AuthorizationType.IAM }] },
    });

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    expect(() => {
      rule.addTarget(new targets.AppSync(sec_api, {
        graphQLOperation,
        variables: events.RuleTargetInput.fromObject({
          message: events.EventField.fromPath('$.detail'),
        }),
      }));
    }).toThrow('Your API visibility must be "GLOBAL"');
  });

});

describe('AppSync API with AWS_IAM auth', () => {
  let api: appsync.GraphqlApi;
  let stack: cdk.Stack;
  beforeEach(() => {
    stack = new cdk.Stack();
    api = new appsync.GraphqlApi(stack, 'baseApi', {
      name: 'api',
      definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: { defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM } },
    });
  });

  test('use AppSync GraphQL API as an event rule target', () => {

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    // WHEN
    rule.addTarget(new targets.AppSync(api, {
      graphQLOperation,
      variables: events.RuleTargetInput.fromObject({
        message: events.EventField.fromPath('$.detail'),
      }),
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'GraphQLEndpointArn'] },
          AppSyncParameters: { GraphQLOperation: graphQLOperation },
          Id: 'Target0',
          InputTransformer: {
            InputPathsMap: { detail: '$.detail' },
            InputTemplate: '{"message":<detail>}',
          },
          RoleArn: {
            'Fn::GetAtt': [
              'baseApiEventsRoleAC472BD7',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('use a Dead Letter Queue', () => {

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    // WHEN
    const queue = new sqs.Queue(stack, 'Queue');
    rule.addTarget(new targets.AppSync(api, {
      graphQLOperation,
      variables: events.RuleTargetInput.fromObject({
        message: events.EventField.fromPath('$.detail'),
      }),
      deadLetterQueue: queue,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          DeadLetterConfig: {
            Arn: {
              'Fn::GetAtt': [
                'Queue4A7E3555',
                'Arn',
              ],
            },
          },
          Id: 'Target0',
        },
      ],
    });
  });

  test('when no mutation fields provided, grant access to Mutations only', () => {

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    // WHEN
    rule.addTarget(new targets.AppSync(api, {
      graphQLOperation,
      variables: events.RuleTargetInput.fromObject({
        message: events.EventField.fromPath('$.detail'),
      }),
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'GraphQLEndpointArn'] },
          AppSyncParameters: { GraphQLOperation: graphQLOperation },
          Id: 'Target0',
          InputTransformer: {
            InputPathsMap: { detail: '$.detail' },
            InputTemplate: '{"message":<detail>}',
          },
          RoleArn: {
            'Fn::GetAtt': [
              'baseApiEventsRoleAC472BD7',
              'Arn',
            ],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'events.amazonaws.com',
            },
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: 'baseApiEventsRoleDefaultPolicy94199357',
      PolicyDocument: {
        Statement: [{
          Action: 'appsync:GraphQL',
          Effect: 'Allow',
          Resource:
        {
          'Fn::Join': [
            '', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':appsync:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':apis/',
              { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
              '/types/Mutation/*',
            ],
          ],
        },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('a role is provided', () => {

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    const eventRole = new iam.Role(stack, 'role', {
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    });
    api.grantMutation(eventRole, 'publish');

    // WHEN
    rule.addTarget(new targets.AppSync(api, {
      graphQLOperation,
      variables: events.RuleTargetInput.fromObject({
        message: events.EventField.fromPath('$.detail'),
      }),
      eventRole,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'GraphQLEndpointArn'] },
          AppSyncParameters: { GraphQLOperation: graphQLOperation },
          Id: 'Target0',
          InputTransformer: {
            InputPathsMap: { detail: '$.detail' },
            InputTemplate: '{"message":<detail>}',
          },
          RoleArn: {
            'Fn::GetAtt': [
              'roleC7B7E775',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('a role is not provided', () => {

    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    // WHEN
    rule.addTarget(new targets.AppSync(api, {
      graphQLOperation,
      variables: events.RuleTargetInput.fromObject({
        message: events.EventField.fromPath('$.detail'),
      }),
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'appsync:GraphQL',
          Effect: 'Allow',
          Resource:
            {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':appsync:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':apis/', { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] }, '/types/Mutation/*']],
            },

        }],
        Version: '2012-10-17',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'events.amazonaws.com',
            },
          },
        ],
      },
    });

  });

});
