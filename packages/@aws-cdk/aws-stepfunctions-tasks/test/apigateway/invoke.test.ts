import * as apigateway from '@aws-cdk/aws-apigateway';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayInvoke, AuthType, HttpMethod } from '../../lib/apigateway/invoke';

describe('Invoke API', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'apiid.execute-api.region.amazonaws.com');

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      api: restApi,
      method: HttpMethod.GET,
      stageName: '$default',
      path: 'path',
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
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
      End: true,
      Parameters: {
        ApiEndpoint: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'apiidexecuteapiregionamazonawscomF3F21B4A',
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
        Method: HttpMethod.GET,
        Stage: '$default',
        AuthType: 'NO_AUTH',
        Path: 'path',
      },
    });
  });

  test('Wait for Task Token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'apiid.execute-api.region.amazonaws.com');
    const taskToken = {
      'TaskToken.$': 'States.Array($$.Task.Token)',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      api: restApi,
      method: HttpMethod.GET,
      headers: taskToken,
      stageName: '$default',
      path: 'path',
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
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
      End: true,
      Parameters: {
        ApiEndpoint: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'apiidexecuteapiregionamazonawscomF3F21B4A',
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
        Headers: {
          'TaskToken.$': 'States.Array($$.Task.Token)',
        },
        Method: HttpMethod.GET,
        AuthType: 'NO_AUTH',
        Path: 'path',
        Stage: '$default',
      },
    });
  });

  test('Invoke - Wait For Task Token - Missing Task Token', () => {
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'apiid.execute-api.region.amazonaws.com');
    expect(() => {
      new ApiGatewayInvoke(stack, 'Invoke', {
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
        api: restApi,
        method: HttpMethod.GET,
        authType: AuthType.RESOURCE_POLICY,
      });
    }).toThrow('Task Token is required in `headers` Use JsonPath.taskToken to set the token.');
  });
});