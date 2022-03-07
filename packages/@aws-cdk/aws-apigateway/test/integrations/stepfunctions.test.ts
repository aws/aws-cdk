import { Match, Template } from '@aws-cdk/assertions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { StateMachine, StateMachineType } from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as apigw from '../../lib';

describe('StepFunctionsIntegration', () => {
  describe('startExecution', () => {
    test('minimal setup', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine);
      api.root.addMethod('GET', integ);

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
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
                  "## Velocity Template used for API Gateway request mapping template\n##\n## This template forwards the request body, header, path, and querystring\n## to the execution input of the state machine.\n##\n## \"@@\" is used here as a placeholder for '\"' to avoid using escape characters.\n\n#set($inputString = '')\n#set($includeHeaders = false)\n#set($includeQueryString = true)\n#set($includePath = true)\n#set($includeAuthorizer = false)\n#set($allParams = $input.params())\n{\n    \"stateMachineArn\": \"",
                  {
                    Ref: 'StateMachine2E01A3A5',
                  },
                  "\",\n\n    #set($inputString = \"$inputString,@@body@@: $input.body\")\n\n    #if ($includeHeaders)\n        #set($inputString = \"$inputString, @@header@@:{\")\n        #foreach($paramName in $allParams.header.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.header.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n        \n    #end\n\n    #if ($includeQueryString)\n        #set($inputString = \"$inputString, @@querystring@@:{\")\n        #foreach($paramName in $allParams.querystring.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.querystring.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #if ($includePath)\n        #set($inputString = \"$inputString, @@path@@:{\")\n        #foreach($paramName in $allParams.path.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.path.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n    \n    #if ($includeAuthorizer)\n        #set($inputString = \"$inputString, @@authorizer@@:{\")\n        #foreach($paramName in $context.authorizer.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($context.authorizer.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #set($requestContext = \"\")\n    ## Check if the request context should be included as part of the execution input\n    #if($requestContext && !$requestContext.empty)\n        #set($inputString = \"$inputString,\")\n        #set($inputString = \"$inputString @@requestContext@@: $requestContext\")\n    #end\n\n    #set($inputString = \"$inputString}\")\n    #set($inputString = $inputString.replaceAll(\"@@\",'\"'))\n    #set($len = $inputString.length() - 1)\n    \"input\": \"{$util.escapeJavaScript($inputString.substring(1,$len))}\"\n}\n",
                ],
              ],
            },
          },
        },
      });
    });

    test('headers are NOT included by default', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine);
      api.root.addMethod('GET', integ);

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.stringLikeRegexp('includeHeaders = false'),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.anyValue(),
                ],
              ],
            },
          },
        },
      });
    });

    test('headers are included when specified by the integration', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, {
        headers: true,
      });
      api.root.addMethod('GET', integ);

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.stringLikeRegexp('#set\\(\\$includeHeaders = true\\)'),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.anyValue(),
                ],
              ],
            },
          },
        },
      });
    });

    test('querystring and path are included by default', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine);
      api.root.addMethod('GET', integ);

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.stringLikeRegexp('#set\\(\\$includeQueryString = true\\)'),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.anyValue(),
                ],
              ],
            },
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.stringLikeRegexp('#set\\(\\$includePath = true\\)'),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.anyValue(),
                ],
              ],
            },
          },
        },
      });
    });

    test('querystring and path are false when specified by the integration', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, {
        querystring: false,
        path: false,
      });
      api.root.addMethod('GET', integ);

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.stringLikeRegexp('#set\\(\\$includeQueryString = false\\)'),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.anyValue(),
                ],
              ],
            },
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.stringLikeRegexp('#set\\(\\$includePath = false\\)'),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.anyValue(),
                ],
              ],
            },
          },
        },
      });
    });

    test('request context is NOT included by default', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, {});
      api.root.addMethod('GET', integ);

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.anyValue(),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.stringLikeRegexp('#set\\(\\$requestContext = \"\"\\)'),
                ],
              ],
            },
          },
        },
      });
    });

    test('request context is included when specified by the integration', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, {
        requestContext: {
          accountId: true,
        },
      });
      api.root.addMethod('GET', integ);

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.anyValue(),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.stringLikeRegexp('#set\\(\\$requestContext = \"{@@accountId@@:@@\\$context.identity.accountId@@}\"'),
                ],
              ],
            },
          },
        },
      });
    });

    test('authorizer context is included when specified by the integration', () => {
      //GIVEN
      const { stack, api, stateMachine } = givenSetup();

      //WHEN
      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, {
        authorizer: true,
      });
      api.root.addMethod('GET', integ);

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        Integration: {
          RequestTemplates: {
            'application/json': {
              'Fn::Join': [
                '',
                [
                  Match.stringLikeRegexp('#set\\(\\$includeAuthorizer = true\\)'),
                  { Ref: 'StateMachine2E01A3A5' },
                  Match.anyValue(),
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

      api.root.addMethod('ANY', apigw.StepFunctionsIntegration.startExecution(stateMachine));

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
        ResourceId: 'imported-root-resource-id',
        RestApiId: 'imported-rest-api-id',
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

      const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine);

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
      const integration = apigw.StepFunctionsIntegration.startExecution(stateMachine, {});

      // WHEN
      const bindResult = integration.bind(method);

      // the deployment token should be defined since the function name
      // should be a literal string.
      expect(bindResult?.deploymentToken).toEqual('{"stateMachineName":"StateMachine-c8adc83b19e793491b1c6ea0fd8b46cd9f32e592fc"}');
    });

    test('fails integration if State Machine is not of type EXPRESS', () => {
      //GIVEN
      const stack = new cdk.Stack();
      const restapi = new apigw.RestApi(stack, 'RestApi');
      const method = restapi.root.addMethod('ANY');
      const stateMachine: sfn.StateMachine = new StateMachine(stack, 'StateMachine', {
        definition: new sfn.Pass(stack, 'passTask'),
        stateMachineType: StateMachineType.STANDARD,
      });
      const integration = apigw.StepFunctionsIntegration.startExecution(stateMachine);

      //WHEN + THEN
      expect(() => integration.bind(method))
        .toThrow(/State Machine must be of type "EXPRESS". Please use StateMachineType.EXPRESS as the stateMachineType/);
    });
  });
});

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
            "error": "Bad request!"
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
        'application/json': [
          '#set($inputRoot = $input.path(\'$\'))',
          '#if($input.path(\'$.status\').toString().equals("FAILED"))',
          '#set($context.responseOverride.status = 500)',
          '{',
          '"error": "$input.path(\'$.error\')",',
          '"cause": "$input.path(\'$.cause\')"',
          '}',
          '#else',
          '$input.path(\'$.output\')',
          '#end',
        ].join('\n'),
      },
    },
    ...errorResponse,
  ];

  return integResponse;
}
