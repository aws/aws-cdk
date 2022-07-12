import * as apigateway from '@aws-cdk/aws-apigateway';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { HttpMethod, CallApiGatewayRestApiEndpoint } from '../../lib';

describe('CallApiGatewayRestApiEndpoint', () => {
  test('default', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'RestApi');

    // WHEN
    const task = new CallApiGatewayRestApiEndpoint(stack, 'Call', {
      api: restApi,
      method: HttpMethod.GET,
      stageName: 'dev',
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      End: true,
      Parameters: {
        ApiEndpoint: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'RestApi0C43BF4B',
              },
              '.execute-api.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
        AuthType: 'NO_AUTH',
        Method: 'GET',
        Stage: 'dev',
      },
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::apigateway:invoke',
          ],
        ],
      },
    });
  });

  test('wait for task token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'RestApi');

    // WHEN
    const task = new CallApiGatewayRestApiEndpoint(stack, 'Call', {
      api: restApi,
      method: HttpMethod.GET,
      stageName: 'dev',
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      headers: sfn.TaskInput.fromObject({ TaskToken: sfn.JsonPath.array(sfn.JsonPath.taskToken) }),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      End: true,
      Parameters: {
        ApiEndpoint: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'RestApi0C43BF4B',
              },
              '.execute-api.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
        AuthType: 'NO_AUTH',
        Headers: {
          'TaskToken.$': 'States.Array($$.Task.Token)',
        },
        Method: 'GET',
        Stage: 'dev',
      },
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::apigateway:invoke.waitForTaskToken',
          ],
        ],
      },
    });
  });

  test('wait for task token - missing token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'RestApi');

    // THEN
    expect(() => {
      new CallApiGatewayRestApiEndpoint(stack, 'Call', {
        api: restApi,
        method: HttpMethod.GET,
        stageName: 'dev',
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      });
    }).toThrow(/Task Token is required in `headers` for WAIT_FOR_TASK_TOKEN pattern. Use JsonPath.taskToken to set the token./);
  });

  test('unsupported integration pattern - RUN_JOB', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'RestApi');

    // THEN
    expect(() => {
      new CallApiGatewayRestApiEndpoint(stack, 'Call', {
        api: restApi,
        method: HttpMethod.GET,
        stageName: 'dev',
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      });
    }).toThrow(/Unsupported service integration pattern./);
  });
});
