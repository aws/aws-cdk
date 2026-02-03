import { Template } from '../../../assertions';
import * as apigwv2 from '../../../aws-apigatewayv2';
import * as events from '../../../aws-events';
import * as iam from '../../../aws-iam';
import * as sqs from '../../../aws-sqs';
import * as cdk from '../../../core';
import * as targets from '../../lib';

let stack: cdk.Stack;
let httpApi: apigwv2.HttpApi;
let rule: events.Rule;

beforeEach(() => {
  stack = new cdk.Stack();
  httpApi = new apigwv2.HttpApi(stack, 'api');
  rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });
});

test('use api gateway http api as an event rule target', () => {
  // WHEN
  rule.addTarget(new targets.ApiGatewayV2(httpApi));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':execute-api:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':',
              {
                Ref: 'apiC8550315',
              },
              '/$default/*/',
            ],
          ],
        },
        HttpParameters: {},
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'apiEventsRoleE84DA95F',
            'Arn',
          ],
        },
      },
    ],
  });
});

test('with stage, path, method setting', () => {
  // WHEN
  const stage = 'test-stage';
  const path = '/test-path';
  const method = 'GET';
  rule.addTarget(new targets.ApiGatewayV2(httpApi, {
    stage, path, method,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':execute-api:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':',
              {
                Ref: 'apiC8550315',
              },
              '/test-stage/GET/test-path',
            ],
          ],
        },
        HttpParameters: {},
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'apiEventsRoleE84DA95F',
            'Arn',
          ],
        },
      },
    ],
  });
});

test('with http parameters', () => {
  // WHEN
  const pathParameterValues = ['path1', 'path2'];
  const headerParameters = {
    TestHeader1: 'test-header-value-1',
    TestHeader2: 'test-header-value-2',
  };
  const queryStringParameters = {
    TestQueryParameter1: 'test-query-parameter-value-1',
    TestQueryParameter2: 'test-query-parameter-value-2',
  };
  rule.addTarget(new targets.ApiGatewayV2(httpApi, {
    path: '/*/*',
    pathParameterValues,
    headerParameters,
    queryStringParameters,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        HttpParameters: {
          HeaderParameters: headerParameters,
          QueryStringParameters: queryStringParameters,
          PathParameterValues: pathParameterValues,
        },
        Id: 'Target0',
      },
    ],
  });
});

test('Throw when the number of wild cards in the path not equal to the number of pathParameterValues', () => {
  // WHEN, THEN
  expect(() => rule.addTarget(new targets.ApiGatewayV2(httpApi, {
    pathParameterValues: ['value1'],
  }))).toThrow(/The number of wildcards in the path does not match the number of path pathParameterValues/);
  expect(() => rule.addTarget(new targets.ApiGatewayV2(httpApi, {
    path: '/*',
  }))).toThrow(/The number of wildcards in the path does not match the number of path pathParameterValues/);
  expect(() => rule.addTarget(new targets.ApiGatewayV2(httpApi, {
    path: '/*/*',
    pathParameterValues: ['value1'],
  }))).toThrow(/The number of wildcards in the path does not match the number of path pathParameterValues/);
  expect(() => rule.addTarget(new targets.ApiGatewayV2(httpApi, {
    path: '/*/*',
    pathParameterValues: ['value1', 'value2'],
  }))).not.toThrow();
});

test('with an explicit event role', () => {
  // WHEN
  const eventRole = new iam.Role(stack, 'Trigger-test-role', {
    assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
  });
  rule.addTarget(new targets.ApiGatewayV2(httpApi, {
    eventRole,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        RoleArn: {
          'Fn::GetAtt': [
            'TriggertestroleBCF8E6AD',
            'Arn',
          ],
        },
        Id: 'Target0',
      },
    ],
  });
});

test('use a Dead Letter Queue', () => {
  // WHEN
  const queue = new sqs.Queue(stack, 'Queue');
  rule.addTarget(new targets.ApiGatewayV2(httpApi, {
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
