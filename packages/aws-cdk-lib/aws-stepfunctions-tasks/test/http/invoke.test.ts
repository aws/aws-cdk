import { Match, Template } from '../../../assertions';
import * as events from '../../../aws-events';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as cxapi from '../../../cx-api';
import * as lib from '../../lib';

let stack: cdk.Stack;
let connection: events.IConnection;

const expectTaskWithParameters = (task: lib.HttpInvoke, parameters: any, queryLanguage?: sfn.QueryLanguage) => {
  expect(stack.resolve(task.toStateJson())).toEqual({
    QueryLanguage: queryLanguage,
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::http:invoke',
        ],
      ],
    },
    End: true,
    Parameters: queryLanguage === sfn.QueryLanguage.JSONATA ? undefined : parameters,
    Arguments: queryLanguage === sfn.QueryLanguage.JSONATA ? parameters : undefined,
  });
};

describe('AWS::StepFunctions::Tasks::HttpInvoke', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    connection = new events.Connection(stack, 'Connection', {
      authorization: events.Authorization.basic(
        'username',
        cdk.SecretValue.unsafePlainText('password'),
      ),
      connectionName: 'testConnection',
    });
  });

  test('invoke with default props', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      connection,
      method: sfn.TaskInput.fromText('POST'),
    });

    expectTaskWithParameters(task, {
      'ApiEndpoint.$':
        "States.Format('{}/{}', 'https://api.example.com', 'path/to/resource')",
      'Authentication': {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      'Method': 'POST',
    });
  });

  test('invoke with default props - using JSONata', () => {
    const task = lib.HttpInvoke.jsonata(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      connection,
      method: sfn.TaskInput.fromText('POST'),
    });

    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      QueryLanguage: 'JSONata',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::http:invoke',
          ],
        ],
      },
      End: true,
      Arguments: {
        ApiEndpoint: "{% 'https://api.example.com' & '/' & 'path/to/resource' %}",
        Authentication: {
          ConnectionArn: stack.resolve(connection.connectionArn),
        },
        Method: 'POST',
      },
    });
  });

  test('invoke with all props', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      connection,
      headers: sfn.TaskInput.fromObject({
        'custom-header': 'custom-value',
      }),
      method: sfn.TaskInput.fromText('POST'),
      urlEncodingFormat: lib.URLEncodingFormat.BRACKETS,
      queryStringParameters: sfn.TaskInput.fromObject({
        foo: 'bar',
      }),
    });

    expectTaskWithParameters(task, {
      'ApiEndpoint.$': "States.Format('{}/{}', 'https://api.example.com', 'path/to/resource')",
      'Authentication': {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      'Method': 'POST',
      'Headers': {
        'custom-header': 'custom-value',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      'Transform': {
        RequestBodyEncoding: 'URL_ENCODED',
        RequestEncodingOptions: {
          ArrayFormat: lib.URLEncodingFormat.BRACKETS,
        },
      },
      'QueryParameters': {
        foo: 'bar',
      },
    });
  });

  test('invoke with default urlEncodingFormat', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      method: sfn.TaskInput.fromText('POST'),
      connection,
      urlEncodingFormat: lib.URLEncodingFormat.DEFAULT,
    });

    expectTaskWithParameters(task, {
      'ApiEndpoint.$': "States.Format('{}/{}', 'https://api.example.com', 'path/to/resource')",
      'Authentication': {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      'Method': 'POST',
      'Headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      'Transform': {
        RequestBodyEncoding: 'URL_ENCODED',
      },
    });
  });

  test('invoke with no urlEncodingFormat', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      method: sfn.TaskInput.fromText('POST'),
      connection,
      urlEncodingFormat: lib.URLEncodingFormat.NONE,
    });

    expectTaskWithParameters(task, {
      'ApiEndpoint.$': "States.Format('{}/{}', 'https://api.example.com', 'path/to/resource')",
      'Authentication': {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      'Method': 'POST',
    });
  });

  test('invoke with formatted apiEndpoint', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText(
        sfn.JsonPath.format('resource/{}/details', sfn.JsonPath.stringAt('$.resourceId')),
      ),
      connection,
      method: sfn.TaskInput.fromText('POST'),
    });
    expectTaskWithParameters(task, {
      'ApiEndpoint.$':
        "States.Format('{}/{}', 'https://api.example.com', States.Format('resource/{}/details', $.resourceId))",
      'Authentication': {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      'Method': 'POST',
    });
  });

  test('Can use JSONata expression to apiEndpoint', () => {
    const task = lib.HttpInvoke.jsonata(stack, 'Task', {
      apiRoot: "{% 'https://' & $domain %}",
      apiEndpoint: sfn.TaskInput.fromText("{% 'items/' & $item.id %}"),
      method: sfn.TaskInput.fromText('GET'),
      connection,
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: "{% 'https://' & $domain & '/' & 'items/' & $item.id %}",
      Authentication: {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      Method: 'GET',
    }, sfn.QueryLanguage.JSONATA);
  });

  test('When use JSONata expression to only apiEndpoint, then should allow only apiRoot in policy', () => {
    const task = lib.HttpInvoke.jsonata(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText("{% 'items/' & $item.id %}"),
      method: sfn.TaskInput.fromText('GET'),
      connection,
    });
    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: "{% 'https://api.example.com' & '/' & 'items/' & $item.id %}",
      Authentication: {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      Method: 'GET',
    }, sfn.QueryLanguage.JSONATA);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:RetrieveConnectionCredentials',
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['Connection07624BCD', 'Arn'] },
          },
          {
            Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['Connection07624BCD', 'SecretArn'] },
          },
          {
            Action: 'states:InvokeHTTPEndpoint',
            Condition: { StringLike: { 'states:HTTPEndpoint': 'https://api.example.com*' } },
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });

  test('When use JSONata expression to apiRoot, then should allow all endpoint in policy', () => {
    const task = lib.HttpInvoke.jsonata(stack, 'Task', {
      apiRoot: "{% 'https://' & $domain %}",
      apiEndpoint: sfn.TaskInput.fromText('items/'),
      method: sfn.TaskInput.fromText('GET'),
      connection,
    });
    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: "{% 'https://' & $domain & '/' & 'items/' %}",
      Authentication: {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      Method: 'GET',
    }, sfn.QueryLanguage.JSONATA);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:RetrieveConnectionCredentials',
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['Connection07624BCD', 'Arn'] },
          },
          {
            Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['Connection07624BCD', 'SecretArn'] },
          },
          {
            Action: 'states:InvokeHTTPEndpoint',
            Condition: { StringLike: { 'states:HTTPEndpoint': '*' } },
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });

  describe('@aws-cdk/aws-stepfunctions-tasks:httpInvokeDynamicJsonPathEndpoint feature flag is disabled', () => {
    beforeEach(() => {
      const myFeatureFlag = { [cxapi.STEPFUNCTIONS_TASKS_HTTPINVOKE_DYNAMIC_JSONPATH_ENDPOINT]: false };
      const app = new cdk.App({ context: myFeatureFlag });
      stack = new cdk.Stack(app);
    });

    test('uses a static value for apiEndpoint', () => {
      const task = new lib.HttpInvoke(stack, 'Task', {
        apiRoot: 'https://api.example.com',
        apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
        connection,
        method: sfn.TaskInput.fromText('POST'),
      });

      expectTaskWithParameters(task, {
        ApiEndpoint: 'https://api.example.com/path/to/resource',
        Authentication: {
          ConnectionArn: stack.resolve(connection.connectionArn),
        },
        Method: 'POST',
      });
    });
  });
});
