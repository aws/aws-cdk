import '@aws-cdk/assert-internal/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { StateMachine } from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as apigw from '../../lib';

function givenSetup() {
  const stack = new cdk.Stack();
  const api = new apigw.RestApi(stack, 'my-rest-api');
  const passTask = new sfn.Pass(stack, 'passTask', {
    inputPath: '$.somekey',
  });

  const stateMachine: sfn.IStateMachine = new StateMachine(stack, 'StateMachine', {
    definition: passTask,
    stateMachineType: sfn.StateMachineType.EXPRESS,
  });

  return { stack, api, stateMachine };
}

function getIntegrationResponse() {
  const errorResponse = [
    {
      SelectionPattern: '4\\d{2}',
      StatusCode: '400',
      ResponseTemplates: {
        'application/json': `{
            "error": "Bad input!"
          }`,
      },
    },
    {
      SelectionPattern: '5\\d{2}',
      StatusCode: '500',
      ResponseTemplates: {
        'application/json': '"error": $input.path(\'$.error\')',
      },
    },
  ];

  const integResponse = [
    {
      StatusCode: '200',
      ResponseTemplates: {
        'application/json': `#set($inputRoot = $input.path('$'))
                #if($input.path('$.status').toString().equals("FAILED"))
                    #set($context.responseOverride.status = 500)
                    { 
                      "error": "$input.path('$.error')",
                      "cause": "$input.path('$.cause')"
                    }
                #else
                    $input.path('$.output')
                #end`,
      },
    },
    ...errorResponse,
  ];

  return integResponse;
}

describe('StepFunctions', () => {
  test('minimal setup', () => {
    //GIVEN
    const { stack, api, stateMachine } = givenSetup();

    //WHEN
    const integ = new apigw.StepFunctionsIntegration(stateMachine);
    api.root.addMethod('GET', integ);

    //THEN
    expect(stack).toHaveResource('AWS::ApiGateway::Method', {
      ResourceId: {
        'Fn::GetAtt': [
          'myrestapiBAC2BF45',
          'RootResourceId',
        ],
      },
      RestApiId: {
        Ref: 'myrestapiBAC2BF45',
      },
      AuthorizationType: 'NONE',
      Integration: {
        IntegrationHttpMethod: 'POST',
        IntegrationResponses: getIntegrationResponse(),
        Type: 'AWS',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':apigateway:',
              {
                Ref: 'AWS::Region',
              },
              ':states:action/StartSyncExecution',
            ],
          ],
        },
        PassthroughBehavior: 'NEVER',
        RequestTemplates: {
          'application/json': {
            'Fn::Join': [
              '',
              [
                "\n    #set($inputRoot = $input.path('$')) {\n        \"input\": \"$util.escapeJavaScript($input.json('$'))\",\n        \"stateMachineArn\": \"",
                {
                  Ref: 'StateMachine2E01A3A5',
                },
                '"\n      }',
              ],
            ],
          },
        },
      },
    });
  });

  test('works for imported RestApi', () => {
    const stack = new cdk.Stack();
    const api = apigw.RestApi.fromRestApiAttributes(stack, 'RestApi', {
      restApiId: 'imported-rest-api-id',
      rootResourceId: 'imported-root-resource-id',
    });

    const passTask = new sfn.Pass(stack, 'passTask', {
      inputPath: '$.somekey',
    });

    const stateMachine: sfn.IStateMachine = new StateMachine(stack, 'StateMachine', {
      definition: passTask,
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });

    api.root.addMethod('ANY', new apigw.StepFunctionsIntegration(stateMachine));

    expect(stack).toHaveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      ResourceId: 'imported-root-resource-id',
      RestApiId: 'imported-rest-api-id',
      AuthorizationType: 'NONE',
      Integration: {
        IntegrationHttpMethod: 'POST',
        IntegrationResponses: [
          {
            ResponseTemplates: {
              'application/json': "#set($inputRoot = $input.path('$'))\n                #if($input.path('$.status').toString().equals(\"FAILED\"))\n                    #set($context.responseOverride.status = 500)\n                    { \n                      \"error\": \"$input.path('$.error')\",\n                      \"cause\": \"$input.path('$.cause')\"\n                    }\n                #else\n                    $input.path('$.output')\n                #end",
            },
            StatusCode: '200',
          },
          {
            ResponseTemplates: {
              'application/json': '{\n            "error": "Bad input!"\n          }',
            },
            SelectionPattern: '4\\d{2}',
            StatusCode: '400',
          },
          {
            ResponseTemplates: {
              'application/json': "\"error\": $input.path('$.error')",
            },
            SelectionPattern: '5\\d{2}',
            StatusCode: '500',
          },
        ],
        PassthroughBehavior: 'NEVER',
        RequestTemplates: {
          'application/json': {
            'Fn::Join': [
              '',
              [
                "\n    #set($inputRoot = $input.path('$')) {\n        \"input\": \"$util.escapeJavaScript($input.json('$'))\",\n        \"stateMachineArn\": \"",
                {
                  Ref: 'StateMachine2E01A3A5',
                },
                '"\n      }',
              ],
            ],
          },
        },
        Type: 'AWS',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':apigateway:',
              {
                Ref: 'AWS::Region',
              },
              ':states:action/StartSyncExecution',
            ],
          ],
        },
      },
    });
  });

  test('fingerprint is not computed when stateMachineName is not specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restapi = new apigw.RestApi(stack, 'RestApi');
    const method = restapi.root.addMethod('ANY');

    const passTask = new sfn.Pass(stack, 'passTask', {
      inputPath: '$.somekey',
    });

    const stateMachine: sfn.IStateMachine = new StateMachine(stack, 'StateMachine', {
      definition: passTask,
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });

    const integ = new apigw.StepFunctionsIntegration(stateMachine);

    // WHEN
    const bindResult = integ.bind(method);

    // THEN
    expect(bindResult?.deploymentToken).toBeUndefined();
  });

  test('bind works for integration with imported State Machine', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restapi = new apigw.RestApi(stack, 'RestApi');
    const method = restapi.root.addMethod('ANY');
    const stateMachine: sfn.IStateMachine = StateMachine.fromStateMachineArn(stack, 'MyStateMachine', 'arn:aws:states:region:account:stateMachine:MyStateMachine');
    const integration = new apigw.StepFunctionsIntegration(stateMachine);

    // WHEN
    const bindResult = integration.bind(method);

    // the deployment token should be defined since the function name
    // should be a literal string.
    expect(bindResult?.deploymentToken).toEqual('{"stateMachineName":"StateMachine-c8adc83b19e793491b1c6ea0fd8b46cd9f32e592fc"}');
  });
});
