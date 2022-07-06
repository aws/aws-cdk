import { Template } from '@aws-cdk/assertions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { StateMachine } from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as apigw from '../lib';
import { StepFunctionsIntegration } from '../lib';

describe('Step Functions api', () => {
  test('StepFunctionsRestApi defines correct REST API resources', () => {
    //GIVEN
    const { stack, stateMachine } = givenSetup();

    //WHEN
    const api = whenCondition(stack, stateMachine);

    expect(() => {
      api.root.addResource('not allowed');
    }).toThrow();

    //THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      MethodResponses: getMethodResponse(),
      AuthorizationType: 'NONE',
      RestApiId: {
        Ref: 'StepFunctionsRestApiC6E3E883',
      },
      ResourceId: {
        'Fn::GetAtt': [
          'StepFunctionsRestApiC6E3E883',
          'RootResourceId',
        ],
      },
      Integration: {
        Credentials: {
          'Fn::GetAtt': [
            'StepFunctionsRestApiANYStartSyncExecutionRole425C03BB',
            'Arn',
          ],
        },
        IntegrationHttpMethod: 'POST',
        IntegrationResponses: getIntegrationResponse(),
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
      },
    });
  });

  test('StepFunctionsExecutionIntegration on a method', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'Api');
    const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
      stateMachineType: sfn.StateMachineType.EXPRESS,
      definition: new sfn.Pass(stack, 'Pass'),
    });

    // WHEN
    api.root.addResource('sfn').addMethod('POST', StepFunctionsIntegration.startExecution(stateMachine));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      MethodResponses: getMethodResponse(),
      Integration: {
        Credentials: {
          'Fn::GetAtt': [
            'ApisfnPOSTStartSyncExecutionRole8E8879B0',
            'Arn',
          ],
        },
        IntegrationHttpMethod: 'POST',
        IntegrationResponses: getIntegrationResponse(),
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
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartSyncExecution',
            Effect: 'Allow',
            Resource: {
              Ref: 'StateMachine2E01A3A5',
            },
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        {
          Ref: 'ApisfnPOSTStartSyncExecutionRole8E8879B0',
        },
      ],
    });
  });

  test('fails if options.defaultIntegration is set', () => {
    //GIVEN
    const { stack, stateMachine } = givenSetup();

    const httpURL: string = 'https://foo/bar';

    //WHEN & THEN
    expect(() => new apigw.StepFunctionsRestApi(stack, 'StepFunctionsRestApi', {
      stateMachine: stateMachine,
      defaultIntegration: new apigw.HttpIntegration(httpURL),
    })).toThrow(/Cannot specify \"defaultIntegration\" since Step Functions integration is automatically defined/);

  });

  test('fails if State Machine is not of type EXPRESS', () => {
    //GIVEN
    const stack = new cdk.Stack();

    const passTask = new sfn.Pass(stack, 'passTask', {
      inputPath: '$.somekey',
    });

    const stateMachine: sfn.IStateMachine = new StateMachine(stack, 'StateMachine', {
      definition: passTask,
      stateMachineType: sfn.StateMachineType.STANDARD,
    });

    //WHEN & THEN
    expect(() => new apigw.StepFunctionsRestApi(stack, 'StepFunctionsRestApi', {
      stateMachine: stateMachine,
    })).toThrow(/State Machine must be of type "EXPRESS". Please use StateMachineType.EXPRESS as the stateMachineType/);
  });
});

function givenSetup() {
  const stack = new cdk.Stack();

  const passTask = new sfn.Pass(stack, 'passTask', {
    inputPath: '$.somekey',
  });

  const stateMachine: sfn.IStateMachine = new StateMachine(stack, 'StateMachine', {
    definition: passTask,
    stateMachineType: sfn.StateMachineType.EXPRESS,
  });

  return { stack, stateMachine };
}

function whenCondition(stack:cdk.Stack, stateMachine: sfn.IStateMachine) {
  const api = new apigw.StepFunctionsRestApi(stack, 'StepFunctionsRestApi', { stateMachine: stateMachine });
  return api;
}

function getMethodResponse() {
  return [
    {
      StatusCode: '200',
      ResponseModels: {
        'application/json': 'Empty',
      },
    },
    {
      StatusCode: '400',
      ResponseModels: {
        'application/json': 'Error',
      },
    },
    {
      StatusCode: '500',
      ResponseModels: {
        'application/json': 'Error',
      },
    },
  ];
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
