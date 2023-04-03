"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const sfn = require("@aws-cdk/aws-stepfunctions");
const aws_stepfunctions_1 = require("@aws-cdk/aws-stepfunctions");
const cdk = require("@aws-cdk/core");
const apigw = require("../../lib");
describe('StepFunctionsIntegration', () => {
    describe('startExecution', () => {
        test('minimal setup', () => {
            //GIVEN
            const { stack, api, stateMachine } = givenSetup();
            //WHEN
            const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine);
            api.root.addMethod('GET', integ);
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
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
                                    "\",\n\n    #set($inputString = \"$inputString,@@body@@: $input.body\")\n\n    #if ($includeHeaders)\n        #set($inputString = \"$inputString, @@header@@:{\")\n        #foreach($paramName in $allParams.header.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.header.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n        \n    #end\n\n    #if ($includeQueryString)\n        #set($inputString = \"$inputString, @@querystring@@:{\")\n        #foreach($paramName in $allParams.querystring.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.querystring.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #if ($includePath)\n        #set($inputString = \"$inputString, @@path@@:{\")\n        #foreach($paramName in $allParams.path.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.path.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n    \n    #if ($includeAuthorizer)\n        #set($inputString = \"$inputString, @@authorizer@@:{\")\n        #foreach($paramName in $context.authorizer.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($context.authorizer.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #set($requestContext = \"\")\n    ## Check if the request context should be included as part of the execution input\n    #if($requestContext && !$requestContext.empty)\n        #set($inputString = \"$inputString,\")\n        #set($inputString = \"$inputString @@requestContext@@: $requestContext\")\n    #end\n\n    #set($inputString = \"$inputString}\")\n    #set($inputString = $inputString.replaceAll(\"@@\",'\"'))\n    #set($len = $inputString.length() - 1)\n    \"input\": \"{$util.escapeJavaScript($inputString.substring(1,$len)).replaceAll(\"\\\\'\",\"'\")}\"\n}\n",
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.stringLikeRegexp('includeHeaders = false'),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.anyValue(),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$includeHeaders = true\\)'),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.anyValue(),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$includeQueryString = true\\)'),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.anyValue(),
                                ],
                            ],
                        },
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$includePath = true\\)'),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.anyValue(),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$includeQueryString = false\\)'),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.anyValue(),
                                ],
                            ],
                        },
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$includePath = false\\)'),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.anyValue(),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.anyValue(),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$requestContext = \"\"\\)'),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.anyValue(),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$requestContext = \"{@@accountId@@:@@\\$context.identity.accountId@@}\"'),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
                Integration: {
                    RequestTemplates: {
                        'application/json': {
                            'Fn::Join': [
                                '',
                                [
                                    assertions_1.Match.stringLikeRegexp('#set\\(\\$includeAuthorizer = true\\)'),
                                    { Ref: 'StateMachine2E01A3A5' },
                                    assertions_1.Match.anyValue(),
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
            const stateMachine = new aws_stepfunctions_1.StateMachine(stack, 'StateMachine', {
                definition: passTask,
                stateMachineType: sfn.StateMachineType.EXPRESS,
            });
            api.root.addMethod('ANY', apigw.StepFunctionsIntegration.startExecution(stateMachine));
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
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
            const stateMachine = new aws_stepfunctions_1.StateMachine(stack, 'StateMachine', {
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
            const stateMachine = aws_stepfunctions_1.StateMachine.fromStateMachineArn(stack, 'MyStateMachine', 'arn:aws:states:region:account:stateMachine:MyStateMachine');
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
            const stateMachine = new aws_stepfunctions_1.StateMachine(stack, 'StateMachine', {
                definition: new sfn.Pass(stack, 'passTask'),
                stateMachineType: aws_stepfunctions_1.StateMachineType.STANDARD,
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
    const stateMachine = new aws_stepfunctions_1.StateMachine(stack, 'StateMachine', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcGZ1bmN0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RlcGZ1bmN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELGtEQUFrRDtBQUNsRCxrRUFBNEU7QUFDNUUscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUVuQyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7WUFDekIsT0FBTztZQUNQLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLFVBQVUsRUFBRSxDQUFDO1lBRWxELE1BQU07WUFDTixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVqQyxNQUFNO1lBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7Z0JBQ3pFLFVBQVUsRUFBRTtvQkFDVixZQUFZLEVBQUU7d0JBQ1osbUJBQW1CO3dCQUNuQixnQkFBZ0I7cUJBQ2pCO2lCQUNGO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxHQUFHLEVBQUUsbUJBQW1CO2lCQUN6QjtnQkFDRCxpQkFBaUIsRUFBRSxNQUFNO2dCQUN6QixXQUFXLEVBQUU7b0JBQ1gscUJBQXFCLEVBQUUsTUFBTTtvQkFDN0Isb0JBQW9CLEVBQUUsc0JBQXNCLEVBQUU7b0JBQzlDLElBQUksRUFBRSxLQUFLO29CQUNYLEdBQUcsRUFBRTt3QkFDSCxVQUFVLEVBQUU7NEJBQ1YsRUFBRTs0QkFDRjtnQ0FDRSxNQUFNO2dDQUNOO29DQUNFLEdBQUcs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QixFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPO0tBQy9DLENBQUMsQ0FBQztJQUVILE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxDQUFDO0FBQ3RDLENBQUM7QUFFRCxTQUFTLHNCQUFzQjtJQUM3QixNQUFNLGFBQWEsR0FBRztRQUNwQjtZQUNFLGdCQUFnQixFQUFFLFNBQVM7WUFDM0IsVUFBVSxFQUFFLEtBQUs7WUFDakIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGtCQUFrQixFQUFFOztZQUVoQjthQUNMO1NBQ0Y7UUFDRDtZQUNFLGdCQUFnQixFQUFFLFNBQVM7WUFDM0IsVUFBVSxFQUFFLEtBQUs7WUFDakIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGtCQUFrQixFQUFFLG1DQUFtQzthQUN4RDtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sYUFBYSxHQUFHO1FBQ3BCO1lBQ0UsVUFBVSxFQUFFLEtBQUs7WUFDakIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGtCQUFrQixFQUFFO29CQUNsQix1Q0FBdUM7b0JBQ3ZDLDREQUE0RDtvQkFDNUQsOENBQThDO29CQUM5QyxHQUFHO29CQUNILHNDQUFzQztvQkFDdEMscUNBQXFDO29CQUNyQyxHQUFHO29CQUNILE9BQU87b0JBQ1AsMkJBQTJCO29CQUMzQixNQUFNO2lCQUNQLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxHQUFHLGFBQWE7S0FDakIsQ0FBQztJQUVGLE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdAYXdzLWNkay9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBTdGF0ZU1hY2hpbmUsIFN0YXRlTWFjaGluZVR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnU3RlcEZ1bmN0aW9uc0ludGVncmF0aW9uJywgKCkgPT4ge1xuICBkZXNjcmliZSgnc3RhcnRFeGVjdXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnbWluaW1hbCBzZXR1cCcsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGFwaSwgc3RhdGVNYWNoaW5lIH0gPSBnaXZlblNldHVwKCk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgY29uc3QgaW50ZWcgPSBhcGlndy5TdGVwRnVuY3Rpb25zSW50ZWdyYXRpb24uc3RhcnRFeGVjdXRpb24oc3RhdGVNYWNoaW5lKTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgaW50ZWcpO1xuXG4gICAgICAvL1RIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgICAgUmVzb3VyY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ215cmVzdGFwaUJBQzJCRjQ1JyxcbiAgICAgICAgICAgICdSb290UmVzb3VyY2VJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzdEFwaUlkOiB7XG4gICAgICAgICAgUmVmOiAnbXlyZXN0YXBpQkFDMkJGNDUnLFxuICAgICAgICB9LFxuICAgICAgICBBdXRob3JpemF0aW9uVHlwZTogJ05PTkUnLFxuICAgICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICAgIEludGVncmF0aW9uSHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIEludGVncmF0aW9uUmVzcG9uc2VzOiBnZXRJbnRlZ3JhdGlvblJlc3BvbnNlKCksXG4gICAgICAgICAgVHlwZTogJ0FXUycsXG4gICAgICAgICAgVXJpOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6YXBpZ2F0ZXdheTonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6c3RhdGVzOmFjdGlvbi9TdGFydFN5bmNFeGVjdXRpb24nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBhc3N0aHJvdWdoQmVoYXZpb3I6ICdORVZFUicsXG4gICAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBcIiMjIFZlbG9jaXR5IFRlbXBsYXRlIHVzZWQgZm9yIEFQSSBHYXRld2F5IHJlcXVlc3QgbWFwcGluZyB0ZW1wbGF0ZVxcbiMjXFxuIyMgVGhpcyB0ZW1wbGF0ZSBmb3J3YXJkcyB0aGUgcmVxdWVzdCBib2R5LCBoZWFkZXIsIHBhdGgsIGFuZCBxdWVyeXN0cmluZ1xcbiMjIHRvIHRoZSBleGVjdXRpb24gaW5wdXQgb2YgdGhlIHN0YXRlIG1hY2hpbmUuXFxuIyNcXG4jIyBcXFwiQEBcXFwiIGlzIHVzZWQgaGVyZSBhcyBhIHBsYWNlaG9sZGVyIGZvciAnXFxcIicgdG8gYXZvaWQgdXNpbmcgZXNjYXBlIGNoYXJhY3RlcnMuXFxuXFxuI3NldCgkaW5wdXRTdHJpbmcgPSAnJylcXG4jc2V0KCRpbmNsdWRlSGVhZGVycyA9IGZhbHNlKVxcbiNzZXQoJGluY2x1ZGVRdWVyeVN0cmluZyA9IHRydWUpXFxuI3NldCgkaW5jbHVkZVBhdGggPSB0cnVlKVxcbiNzZXQoJGluY2x1ZGVBdXRob3JpemVyID0gZmFsc2UpXFxuI3NldCgkYWxsUGFyYW1zID0gJGlucHV0LnBhcmFtcygpKVxcbntcXG4gICAgXFxcInN0YXRlTWFjaGluZUFyblxcXCI6IFxcXCJcIixcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwiXFxcIixcXG5cXG4gICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLEBAYm9keUBAOiAkaW5wdXQuYm9keVxcXCIpXFxuXFxuICAgICNpZiAoJGluY2x1ZGVIZWFkZXJzKVxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLCBAQGhlYWRlckBAOntcXFwiKVxcbiAgICAgICAgI2ZvcmVhY2goJHBhcmFtTmFtZSBpbiAkYWxsUGFyYW1zLmhlYWRlci5rZXlTZXQoKSlcXG4gICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgQEAkcGFyYW1OYW1lQEA6IEBAJHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkYWxsUGFyYW1zLmhlYWRlci5nZXQoJHBhcmFtTmFtZSkpQEBcXFwiKVxcbiAgICAgICAgICAgICNpZigkZm9yZWFjaC5oYXNOZXh0KVxcbiAgICAgICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsXFxcIilcXG4gICAgICAgICAgICAjZW5kXFxuICAgICAgICAjZW5kXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgfVxcXCIpXFxuICAgICAgICBcXG4gICAgI2VuZFxcblxcbiAgICAjaWYgKCRpbmNsdWRlUXVlcnlTdHJpbmcpXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsIEBAcXVlcnlzdHJpbmdAQDp7XFxcIilcXG4gICAgICAgICNmb3JlYWNoKCRwYXJhbU5hbWUgaW4gJGFsbFBhcmFtcy5xdWVyeXN0cmluZy5rZXlTZXQoKSlcXG4gICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgQEAkcGFyYW1OYW1lQEA6IEBAJHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkYWxsUGFyYW1zLnF1ZXJ5c3RyaW5nLmdldCgkcGFyYW1OYW1lKSlAQFxcXCIpXFxuICAgICAgICAgICAgI2lmKCRmb3JlYWNoLmhhc05leHQpXFxuICAgICAgICAgICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyxcXFwiKVxcbiAgICAgICAgICAgICNlbmRcXG4gICAgICAgICNlbmRcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyB9XFxcIilcXG4gICAgI2VuZFxcblxcbiAgICAjaWYgKCRpbmNsdWRlUGF0aClcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZywgQEBwYXRoQEA6e1xcXCIpXFxuICAgICAgICAjZm9yZWFjaCgkcGFyYW1OYW1lIGluICRhbGxQYXJhbXMucGF0aC5rZXlTZXQoKSlcXG4gICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgQEAkcGFyYW1OYW1lQEA6IEBAJHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkYWxsUGFyYW1zLnBhdGguZ2V0KCRwYXJhbU5hbWUpKUBAXFxcIilcXG4gICAgICAgICAgICAjaWYoJGZvcmVhY2guaGFzTmV4dClcXG4gICAgICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLFxcXCIpXFxuICAgICAgICAgICAgI2VuZFxcbiAgICAgICAgI2VuZFxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIH1cXFwiKVxcbiAgICAjZW5kXFxuICAgIFxcbiAgICAjaWYgKCRpbmNsdWRlQXV0aG9yaXplcilcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZywgQEBhdXRob3JpemVyQEA6e1xcXCIpXFxuICAgICAgICAjZm9yZWFjaCgkcGFyYW1OYW1lIGluICRjb250ZXh0LmF1dGhvcml6ZXIua2V5U2V0KCkpXFxuICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIEBAJHBhcmFtTmFtZUBAOiBAQCR1dGlsLmVzY2FwZUphdmFTY3JpcHQoJGNvbnRleHQuYXV0aG9yaXplci5nZXQoJHBhcmFtTmFtZSkpQEBcXFwiKVxcbiAgICAgICAgICAgICNpZigkZm9yZWFjaC5oYXNOZXh0KVxcbiAgICAgICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsXFxcIilcXG4gICAgICAgICAgICAjZW5kXFxuICAgICAgICAjZW5kXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgfVxcXCIpXFxuICAgICNlbmRcXG5cXG4gICAgI3NldCgkcmVxdWVzdENvbnRleHQgPSBcXFwiXFxcIilcXG4gICAgIyMgQ2hlY2sgaWYgdGhlIHJlcXVlc3QgY29udGV4dCBzaG91bGQgYmUgaW5jbHVkZWQgYXMgcGFydCBvZiB0aGUgZXhlY3V0aW9uIGlucHV0XFxuICAgICNpZigkcmVxdWVzdENvbnRleHQgJiYgISRyZXF1ZXN0Q29udGV4dC5lbXB0eSlcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyxcXFwiKVxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIEBAcmVxdWVzdENvbnRleHRAQDogJHJlcXVlc3RDb250ZXh0XFxcIilcXG4gICAgI2VuZFxcblxcbiAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmd9XFxcIilcXG4gICAgI3NldCgkaW5wdXRTdHJpbmcgPSAkaW5wdXRTdHJpbmcucmVwbGFjZUFsbChcXFwiQEBcXFwiLCdcXFwiJykpXFxuICAgICNzZXQoJGxlbiA9ICRpbnB1dFN0cmluZy5sZW5ndGgoKSAtIDEpXFxuICAgIFxcXCJpbnB1dFxcXCI6IFxcXCJ7JHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkaW5wdXRTdHJpbmcuc3Vic3RyaW5nKDEsJGxlbikpLnJlcGxhY2VBbGwoXFxcIlxcXFxcXFxcJ1xcXCIsXFxcIidcXFwiKX1cXFwiXFxufVxcblwiLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2hlYWRlcnMgYXJlIE5PVCBpbmNsdWRlZCBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgYXBpLCBzdGF0ZU1hY2hpbmUgfSA9IGdpdmVuU2V0dXAoKTtcblxuICAgICAgLy9XSEVOXG4gICAgICBjb25zdCBpbnRlZyA9IGFwaWd3LlN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihzdGF0ZU1hY2hpbmUpO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJ2luY2x1ZGVIZWFkZXJzID0gZmFsc2UnKSxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnIH0sXG4gICAgICAgICAgICAgICAgICBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2hlYWRlcnMgYXJlIGluY2x1ZGVkIHdoZW4gc3BlY2lmaWVkIGJ5IHRoZSBpbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGFwaSwgc3RhdGVNYWNoaW5lIH0gPSBnaXZlblNldHVwKCk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgY29uc3QgaW50ZWcgPSBhcGlndy5TdGVwRnVuY3Rpb25zSW50ZWdyYXRpb24uc3RhcnRFeGVjdXRpb24oc3RhdGVNYWNoaW5lLCB7XG4gICAgICAgIGhlYWRlcnM6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgaW50ZWcpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcjc2V0XFxcXChcXFxcJGluY2x1ZGVIZWFkZXJzID0gdHJ1ZVxcXFwpJyksXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ1N0YXRlTWFjaGluZTJFMDFBM0E1JyB9LFxuICAgICAgICAgICAgICAgICAgTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdxdWVyeXN0cmluZyBhbmQgcGF0aCBhcmUgaW5jbHVkZWQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGFwaSwgc3RhdGVNYWNoaW5lIH0gPSBnaXZlblNldHVwKCk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgY29uc3QgaW50ZWcgPSBhcGlndy5TdGVwRnVuY3Rpb25zSW50ZWdyYXRpb24uc3RhcnRFeGVjdXRpb24oc3RhdGVNYWNoaW5lKTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgaW50ZWcpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcjc2V0XFxcXChcXFxcJGluY2x1ZGVRdWVyeVN0cmluZyA9IHRydWVcXFxcKScpLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdTdGF0ZU1hY2hpbmUyRTAxQTNBNScgfSxcbiAgICAgICAgICAgICAgICAgIE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcjc2V0XFxcXChcXFxcJGluY2x1ZGVQYXRoID0gdHJ1ZVxcXFwpJyksXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ1N0YXRlTWFjaGluZTJFMDFBM0E1JyB9LFxuICAgICAgICAgICAgICAgICAgTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdxdWVyeXN0cmluZyBhbmQgcGF0aCBhcmUgZmFsc2Ugd2hlbiBzcGVjaWZpZWQgYnkgdGhlIGludGVncmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgYXBpLCBzdGF0ZU1hY2hpbmUgfSA9IGdpdmVuU2V0dXAoKTtcblxuICAgICAgLy9XSEVOXG4gICAgICBjb25zdCBpbnRlZyA9IGFwaWd3LlN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihzdGF0ZU1hY2hpbmUsIHtcbiAgICAgICAgcXVlcnlzdHJpbmc6IGZhbHNlLFxuICAgICAgICBwYXRoOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJyNzZXRcXFxcKFxcXFwkaW5jbHVkZVF1ZXJ5U3RyaW5nID0gZmFsc2VcXFxcKScpLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdTdGF0ZU1hY2hpbmUyRTAxQTNBNScgfSxcbiAgICAgICAgICAgICAgICAgIE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcjc2V0XFxcXChcXFxcJGluY2x1ZGVQYXRoID0gZmFsc2VcXFxcKScpLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdTdGF0ZU1hY2hpbmUyRTAxQTNBNScgfSxcbiAgICAgICAgICAgICAgICAgIE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVxdWVzdCBjb250ZXh0IGlzIE5PVCBpbmNsdWRlZCBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgYXBpLCBzdGF0ZU1hY2hpbmUgfSA9IGdpdmVuU2V0dXAoKTtcblxuICAgICAgLy9XSEVOXG4gICAgICBjb25zdCBpbnRlZyA9IGFwaWd3LlN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihzdGF0ZU1hY2hpbmUsIHt9KTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgaW50ZWcpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdTdGF0ZU1hY2hpbmUyRTAxQTNBNScgfSxcbiAgICAgICAgICAgICAgICAgIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJyNzZXRcXFxcKFxcXFwkcmVxdWVzdENvbnRleHQgPSBcXFwiXFxcIlxcXFwpJyksXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVxdWVzdCBjb250ZXh0IGlzIGluY2x1ZGVkIHdoZW4gc3BlY2lmaWVkIGJ5IHRoZSBpbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICAgIC8vR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGFwaSwgc3RhdGVNYWNoaW5lIH0gPSBnaXZlblNldHVwKCk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgY29uc3QgaW50ZWcgPSBhcGlndy5TdGVwRnVuY3Rpb25zSW50ZWdyYXRpb24uc3RhcnRFeGVjdXRpb24oc3RhdGVNYWNoaW5lLCB7XG4gICAgICAgIHJlcXVlc3RDb250ZXh0OiB7XG4gICAgICAgICAgYWNjb3VudElkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIGludGVnKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICAgIFJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnIH0sXG4gICAgICAgICAgICAgICAgICBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcjc2V0XFxcXChcXFxcJHJlcXVlc3RDb250ZXh0ID0gXFxcIntAQGFjY291bnRJZEBAOkBAXFxcXCRjb250ZXh0LmlkZW50aXR5LmFjY291bnRJZEBAfVxcXCInKSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhdXRob3JpemVyIGNvbnRleHQgaXMgaW5jbHVkZWQgd2hlbiBzcGVjaWZpZWQgYnkgdGhlIGludGVncmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgYXBpLCBzdGF0ZU1hY2hpbmUgfSA9IGdpdmVuU2V0dXAoKTtcblxuICAgICAgLy9XSEVOXG4gICAgICBjb25zdCBpbnRlZyA9IGFwaWd3LlN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihzdGF0ZU1hY2hpbmUsIHtcbiAgICAgICAgYXV0aG9yaXplcjogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJyNzZXRcXFxcKFxcXFwkaW5jbHVkZUF1dGhvcml6ZXIgPSB0cnVlXFxcXCknKSxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnIH0sXG4gICAgICAgICAgICAgICAgICBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dvcmtzIGZvciBpbXBvcnRlZCBSZXN0QXBpJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBhcGlndy5SZXN0QXBpLmZyb21SZXN0QXBpQXR0cmlidXRlcyhzdGFjaywgJ1Jlc3RBcGknLCB7XG4gICAgICAgIHJlc3RBcGlJZDogJ2ltcG9ydGVkLXJlc3QtYXBpLWlkJyxcbiAgICAgICAgcm9vdFJlc291cmNlSWQ6ICdpbXBvcnRlZC1yb290LXJlc291cmNlLWlkJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBwYXNzVGFzayA9IG5ldyBzZm4uUGFzcyhzdGFjaywgJ3Bhc3NUYXNrJywge1xuICAgICAgICBpbnB1dFBhdGg6ICckLnNvbWVrZXknLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YXRlTWFjaGluZTogc2ZuLklTdGF0ZU1hY2hpbmUgPSBuZXcgU3RhdGVNYWNoaW5lKHN0YWNrLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgICBkZWZpbml0aW9uOiBwYXNzVGFzayxcbiAgICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyxcbiAgICAgIH0pO1xuXG4gICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0FOWScsIGFwaWd3LlN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihzdGF0ZU1hY2hpbmUpKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgICBSZXNvdXJjZUlkOiAnaW1wb3J0ZWQtcm9vdC1yZXNvdXJjZS1pZCcsXG4gICAgICAgIFJlc3RBcGlJZDogJ2ltcG9ydGVkLXJlc3QtYXBpLWlkJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmluZ2VycHJpbnQgaXMgbm90IGNvbXB1dGVkIHdoZW4gc3RhdGVNYWNoaW5lTmFtZSBpcyBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVzdGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnUmVzdEFwaScpO1xuICAgICAgY29uc3QgbWV0aG9kID0gcmVzdGFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJyk7XG5cbiAgICAgIGNvbnN0IHBhc3NUYXNrID0gbmV3IHNmbi5QYXNzKHN0YWNrLCAncGFzc1Rhc2snLCB7XG4gICAgICAgIGlucHV0UGF0aDogJyQuc29tZWtleScsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhdGVNYWNoaW5lOiBzZm4uSVN0YXRlTWFjaGluZSA9IG5ldyBTdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICAgIGRlZmluaXRpb246IHBhc3NUYXNrLFxuICAgICAgICBzdGF0ZU1hY2hpbmVUeXBlOiBzZm4uU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGludGVnID0gYXBpZ3cuU3RlcEZ1bmN0aW9uc0ludGVncmF0aW9uLnN0YXJ0RXhlY3V0aW9uKHN0YXRlTWFjaGluZSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGJpbmRSZXN1bHQgPSBpbnRlZy5iaW5kKG1ldGhvZCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChiaW5kUmVzdWx0Py5kZXBsb3ltZW50VG9rZW4pLnRvQmVVbmRlZmluZWQoKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2JpbmQgd29ya3MgZm9yIGludGVncmF0aW9uIHdpdGggaW1wb3J0ZWQgU3RhdGUgTWFjaGluZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlc3RhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ1Jlc3RBcGknKTtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHJlc3RhcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xuICAgICAgY29uc3Qgc3RhdGVNYWNoaW5lOiBzZm4uSVN0YXRlTWFjaGluZSA9IFN0YXRlTWFjaGluZS5mcm9tU3RhdGVNYWNoaW5lQXJuKHN0YWNrLCAnTXlTdGF0ZU1hY2hpbmUnLCAnYXJuOmF3czpzdGF0ZXM6cmVnaW9uOmFjY291bnQ6c3RhdGVNYWNoaW5lOk15U3RhdGVNYWNoaW5lJyk7XG4gICAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IGFwaWd3LlN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihzdGF0ZU1hY2hpbmUsIHt9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgYmluZFJlc3VsdCA9IGludGVncmF0aW9uLmJpbmQobWV0aG9kKTtcblxuICAgICAgLy8gdGhlIGRlcGxveW1lbnQgdG9rZW4gc2hvdWxkIGJlIGRlZmluZWQgc2luY2UgdGhlIGZ1bmN0aW9uIG5hbWVcbiAgICAgIC8vIHNob3VsZCBiZSBhIGxpdGVyYWwgc3RyaW5nLlxuICAgICAgZXhwZWN0KGJpbmRSZXN1bHQ/LmRlcGxveW1lbnRUb2tlbikudG9FcXVhbCgne1wic3RhdGVNYWNoaW5lTmFtZVwiOlwiU3RhdGVNYWNoaW5lLWM4YWRjODNiMTllNzkzNDkxYjFjNmVhMGZkOGI0NmNkOWYzMmU1OTJmY1wifScpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgaW50ZWdyYXRpb24gaWYgU3RhdGUgTWFjaGluZSBpcyBub3Qgb2YgdHlwZSBFWFBSRVNTJywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCByZXN0YXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdSZXN0QXBpJyk7XG4gICAgICBjb25zdCBtZXRob2QgPSByZXN0YXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknKTtcbiAgICAgIGNvbnN0IHN0YXRlTWFjaGluZTogc2ZuLlN0YXRlTWFjaGluZSA9IG5ldyBTdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICAgIGRlZmluaXRpb246IG5ldyBzZm4uUGFzcyhzdGFjaywgJ3Bhc3NUYXNrJyksXG4gICAgICAgIHN0YXRlTWFjaGluZVR5cGU6IFN0YXRlTWFjaGluZVR5cGUuU1RBTkRBUkQsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGludGVncmF0aW9uID0gYXBpZ3cuU3RlcEZ1bmN0aW9uc0ludGVncmF0aW9uLnN0YXJ0RXhlY3V0aW9uKHN0YXRlTWFjaGluZSk7XG5cbiAgICAgIC8vV0hFTiArIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBpbnRlZ3JhdGlvbi5iaW5kKG1ldGhvZCkpXG4gICAgICAgIC50b1Rocm93KC9TdGF0ZSBNYWNoaW5lIG11c3QgYmUgb2YgdHlwZSBcIkVYUFJFU1NcIi4gUGxlYXNlIHVzZSBTdGF0ZU1hY2hpbmVUeXBlLkVYUFJFU1MgYXMgdGhlIHN0YXRlTWFjaGluZVR5cGUvKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gZ2l2ZW5TZXR1cCgpIHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktcmVzdC1hcGknKTtcbiAgY29uc3QgcGFzc1Rhc2sgPSBuZXcgc2ZuLlBhc3Moc3RhY2ssICdwYXNzVGFzaycsIHtcbiAgICBpbnB1dFBhdGg6ICckLnNvbWVrZXknLFxuICB9KTtcblxuICBjb25zdCBzdGF0ZU1hY2hpbmU6IHNmbi5JU3RhdGVNYWNoaW5lID0gbmV3IFN0YXRlTWFjaGluZShzdGFjaywgJ1N0YXRlTWFjaGluZScsIHtcbiAgICBkZWZpbml0aW9uOiBwYXNzVGFzayxcbiAgICBzdGF0ZU1hY2hpbmVUeXBlOiBzZm4uU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTLFxuICB9KTtcblxuICByZXR1cm4geyBzdGFjaywgYXBpLCBzdGF0ZU1hY2hpbmUgfTtcbn1cblxuZnVuY3Rpb24gZ2V0SW50ZWdyYXRpb25SZXNwb25zZSgpIHtcbiAgY29uc3QgZXJyb3JSZXNwb25zZSA9IFtcbiAgICB7XG4gICAgICBTZWxlY3Rpb25QYXR0ZXJuOiAnNFxcXFxkezJ9JyxcbiAgICAgIFN0YXR1c0NvZGU6ICc0MDAnLFxuICAgICAgUmVzcG9uc2VUZW1wbGF0ZXM6IHtcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIkJhZCByZXF1ZXN0IVwiXG4gICAgICAgICAgfWAsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgU2VsZWN0aW9uUGF0dGVybjogJzVcXFxcZHsyfScsXG4gICAgICBTdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgIFJlc3BvbnNlVGVtcGxhdGVzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ1wiZXJyb3JcIjogJGlucHV0LnBhdGgoXFwnJC5lcnJvclxcJyknLFxuICAgICAgfSxcbiAgICB9LFxuICBdO1xuXG4gIGNvbnN0IGludGVnUmVzcG9uc2UgPSBbXG4gICAge1xuICAgICAgU3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICBSZXNwb25zZVRlbXBsYXRlczoge1xuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IFtcbiAgICAgICAgICAnI3NldCgkaW5wdXRSb290ID0gJGlucHV0LnBhdGgoXFwnJFxcJykpJyxcbiAgICAgICAgICAnI2lmKCRpbnB1dC5wYXRoKFxcJyQuc3RhdHVzXFwnKS50b1N0cmluZygpLmVxdWFscyhcIkZBSUxFRFwiKSknLFxuICAgICAgICAgICcjc2V0KCRjb250ZXh0LnJlc3BvbnNlT3ZlcnJpZGUuc3RhdHVzID0gNTAwKScsXG4gICAgICAgICAgJ3snLFxuICAgICAgICAgICdcImVycm9yXCI6IFwiJGlucHV0LnBhdGgoXFwnJC5lcnJvclxcJylcIiwnLFxuICAgICAgICAgICdcImNhdXNlXCI6IFwiJGlucHV0LnBhdGgoXFwnJC5jYXVzZVxcJylcIicsXG4gICAgICAgICAgJ30nLFxuICAgICAgICAgICcjZWxzZScsXG4gICAgICAgICAgJyRpbnB1dC5wYXRoKFxcJyQub3V0cHV0XFwnKScsXG4gICAgICAgICAgJyNlbmQnLFxuICAgICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIC4uLmVycm9yUmVzcG9uc2UsXG4gIF07XG5cbiAgcmV0dXJuIGludGVnUmVzcG9uc2U7XG59XG4iXX0=