"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const sfn = require("@aws-cdk/aws-stepfunctions");
const aws_stepfunctions_1 = require("@aws-cdk/aws-stepfunctions");
const cdk = require("@aws-cdk/core");
const apigw = require("../lib");
const lib_1 = require("../lib");
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
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
                                "\",\n\n    #set($inputString = \"$inputString,@@body@@: $input.body\")\n\n    #if ($includeHeaders)\n        #set($inputString = \"$inputString, @@header@@:{\")\n        #foreach($paramName in $allParams.header.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.header.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n        \n    #end\n\n    #if ($includeQueryString)\n        #set($inputString = \"$inputString, @@querystring@@:{\")\n        #foreach($paramName in $allParams.querystring.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.querystring.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #if ($includePath)\n        #set($inputString = \"$inputString, @@path@@:{\")\n        #foreach($paramName in $allParams.path.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.path.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n    \n    #if ($includeAuthorizer)\n        #set($inputString = \"$inputString, @@authorizer@@:{\")\n        #foreach($paramName in $context.authorizer.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($context.authorizer.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #set($requestContext = \"\")\n    ## Check if the request context should be included as part of the execution input\n    #if($requestContext && !$requestContext.empty)\n        #set($inputString = \"$inputString,\")\n        #set($inputString = \"$inputString @@requestContext@@: $requestContext\")\n    #end\n\n    #set($inputString = \"$inputString}\")\n    #set($inputString = $inputString.replaceAll(\"@@\",'\"'))\n    #set($len = $inputString.length() - 1)\n    \"input\": \"{$util.escapeJavaScript($inputString.substring(1,$len)).replaceAll(\"\\\\'\",\"'\")}\"\n}\n",
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
        api.root.addResource('sfn').addMethod('POST', lib_1.StepFunctionsIntegration.startExecution(stateMachine));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
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
                                "\",\n\n    #set($inputString = \"$inputString,@@body@@: $input.body\")\n\n    #if ($includeHeaders)\n        #set($inputString = \"$inputString, @@header@@:{\")\n        #foreach($paramName in $allParams.header.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.header.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n        \n    #end\n\n    #if ($includeQueryString)\n        #set($inputString = \"$inputString, @@querystring@@:{\")\n        #foreach($paramName in $allParams.querystring.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.querystring.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #if ($includePath)\n        #set($inputString = \"$inputString, @@path@@:{\")\n        #foreach($paramName in $allParams.path.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($allParams.path.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n    \n    #if ($includeAuthorizer)\n        #set($inputString = \"$inputString, @@authorizer@@:{\")\n        #foreach($paramName in $context.authorizer.keySet())\n            #set($inputString = \"$inputString @@$paramName@@: @@$util.escapeJavaScript($context.authorizer.get($paramName))@@\")\n            #if($foreach.hasNext)\n                #set($inputString = \"$inputString,\")\n            #end\n        #end\n        #set($inputString = \"$inputString }\")\n    #end\n\n    #set($requestContext = \"\")\n    ## Check if the request context should be included as part of the execution input\n    #if($requestContext && !$requestContext.empty)\n        #set($inputString = \"$inputString,\")\n        #set($inputString = \"$inputString @@requestContext@@: $requestContext\")\n    #end\n\n    #set($inputString = \"$inputString}\")\n    #set($inputString = $inputString.replaceAll(\"@@\",'\"'))\n    #set($len = $inputString.length() - 1)\n    \"input\": \"{$util.escapeJavaScript($inputString.substring(1,$len)).replaceAll(\"\\\\'\",\"'\")}\"\n}\n",
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
        const httpURL = 'https://foo/bar';
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
        const stateMachine = new aws_stepfunctions_1.StateMachine(stack, 'StateMachine', {
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
    const stateMachine = new aws_stepfunctions_1.StateMachine(stack, 'StateMachine', {
        definition: passTask,
        stateMachineType: sfn.StateMachineType.EXPRESS,
    });
    return { stack, stateMachine };
}
function whenCondition(stack, stateMachine) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcGZ1bmN0aW9ucy1hcGkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0ZXBmdW5jdGlvbnMtYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msa0RBQWtEO0FBQ2xELGtFQUEwRDtBQUMxRCxxQ0FBcUM7QUFDckMsZ0NBQWdDO0FBQ2hDLGdDQUFrRDtBQUVsRCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLElBQUksQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsT0FBTztRQUNQLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEdBQUcsVUFBVSxFQUFFLENBQUM7UUFFN0MsTUFBTTtRQUNOLE1BQU0sR0FBRyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFL0MsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWIsTUFBTTtRQUNOLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1lBQ3pFLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLGVBQWUsRUFBRSxpQkFBaUIsRUFBRTtZQUNwQyxpQkFBaUIsRUFBRSxNQUFNO1lBQ3pCLFNBQVMsRUFBRTtnQkFDVCxHQUFHLEVBQUUsOEJBQThCO2FBQ3BDO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRTtvQkFDWiw4QkFBOEI7b0JBQzlCLGdCQUFnQjtpQkFDakI7YUFDRjtZQUNELFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUU7b0JBQ1gsWUFBWSxFQUFFO3dCQUNaLHVEQUF1RDt3QkFDdkQsS0FBSztxQkFDTjtpQkFDRjtnQkFDRCxxQkFBcUIsRUFBRSxNQUFNO2dCQUM3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QjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLHNCQUFzQjtJQUM3QixNQUFNLGFBQWEsR0FBRztRQUNwQjtZQUNFLGdCQUFnQixFQUFFLFNBQVM7WUFDM0IsVUFBVSxFQUFFLEtBQUs7WUFDakIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGtCQUFrQixFQUFFOztZQUVoQjthQUNMO1NBQ0Y7UUFDRDtZQUNFLGdCQUFnQixFQUFFLFNBQVM7WUFDM0IsVUFBVSxFQUFFLEtBQUs7WUFDakIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGtCQUFrQixFQUFFLG1DQUFtQzthQUN4RDtTQUNGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sYUFBYSxHQUFHO1FBQ3BCO1lBQ0UsVUFBVSxFQUFFLEtBQUs7WUFDakIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGtCQUFrQixFQUFFO29CQUNsQix1Q0FBdUM7b0JBQ3ZDLDREQUE0RDtvQkFDNUQsOENBQThDO29CQUM5QyxHQUFHO29CQUNILHNDQUFzQztvQkFDdEMscUNBQXFDO29CQUNyQyxHQUFHO29CQUNILE9BQU87b0JBQ1AsMkJBQTJCO29CQUMzQixNQUFNO2lCQUNQLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxHQUFHLGFBQWE7S0FDakIsQ0FBQztJQUVGLE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ0Bhd3MtY2RrL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCB7IFN0YXRlTWFjaGluZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGFwaWd3IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBTdGVwRnVuY3Rpb25zSW50ZWdyYXRpb24gfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnU3RlcCBGdW5jdGlvbnMgYXBpJywgKCkgPT4ge1xuICB0ZXN0KCdTdGVwRnVuY3Rpb25zUmVzdEFwaSBkZWZpbmVzIGNvcnJlY3QgUkVTVCBBUEkgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIC8vR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCBzdGF0ZU1hY2hpbmUgfSA9IGdpdmVuU2V0dXAoKTtcblxuICAgIC8vV0hFTlxuICAgIGNvbnN0IGFwaSA9IHdoZW5Db25kaXRpb24oc3RhY2ssIHN0YXRlTWFjaGluZSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ25vdCBhbGxvd2VkJyk7XG4gICAgfSkudG9UaHJvdygpO1xuXG4gICAgLy9USEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ0FOWScsXG4gICAgICBNZXRob2RSZXNwb25zZXM6IGdldE1ldGhvZFJlc3BvbnNlKCksXG4gICAgICBBdXRob3JpemF0aW9uVHlwZTogJ05PTkUnLFxuICAgICAgUmVzdEFwaUlkOiB7XG4gICAgICAgIFJlZjogJ1N0ZXBGdW5jdGlvbnNSZXN0QXBpQzZFM0U4ODMnLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ1N0ZXBGdW5jdGlvbnNSZXN0QXBpQzZFM0U4ODMnLFxuICAgICAgICAgICdSb290UmVzb3VyY2VJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgQ3JlZGVudGlhbHM6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdTdGVwRnVuY3Rpb25zUmVzdEFwaUFOWVN0YXJ0U3luY0V4ZWN1dGlvblJvbGU0MjVDMDNCQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBJbnRlZ3JhdGlvbkh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IGdldEludGVncmF0aW9uUmVzcG9uc2UoKSxcbiAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFwiIyMgVmVsb2NpdHkgVGVtcGxhdGUgdXNlZCBmb3IgQVBJIEdhdGV3YXkgcmVxdWVzdCBtYXBwaW5nIHRlbXBsYXRlXFxuIyNcXG4jIyBUaGlzIHRlbXBsYXRlIGZvcndhcmRzIHRoZSByZXF1ZXN0IGJvZHksIGhlYWRlciwgcGF0aCwgYW5kIHF1ZXJ5c3RyaW5nXFxuIyMgdG8gdGhlIGV4ZWN1dGlvbiBpbnB1dCBvZiB0aGUgc3RhdGUgbWFjaGluZS5cXG4jI1xcbiMjIFxcXCJAQFxcXCIgaXMgdXNlZCBoZXJlIGFzIGEgcGxhY2Vob2xkZXIgZm9yICdcXFwiJyB0byBhdm9pZCB1c2luZyBlc2NhcGUgY2hhcmFjdGVycy5cXG5cXG4jc2V0KCRpbnB1dFN0cmluZyA9ICcnKVxcbiNzZXQoJGluY2x1ZGVIZWFkZXJzID0gZmFsc2UpXFxuI3NldCgkaW5jbHVkZVF1ZXJ5U3RyaW5nID0gdHJ1ZSlcXG4jc2V0KCRpbmNsdWRlUGF0aCA9IHRydWUpXFxuI3NldCgkaW5jbHVkZUF1dGhvcml6ZXIgPSBmYWxzZSlcXG4jc2V0KCRhbGxQYXJhbXMgPSAkaW5wdXQucGFyYW1zKCkpXFxue1xcbiAgICBcXFwic3RhdGVNYWNoaW5lQXJuXFxcIjogXFxcIlwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1N0YXRlTWFjaGluZTJFMDFBM0E1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiXFxcIixcXG5cXG4gICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLEBAYm9keUBAOiAkaW5wdXQuYm9keVxcXCIpXFxuXFxuICAgICNpZiAoJGluY2x1ZGVIZWFkZXJzKVxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLCBAQGhlYWRlckBAOntcXFwiKVxcbiAgICAgICAgI2ZvcmVhY2goJHBhcmFtTmFtZSBpbiAkYWxsUGFyYW1zLmhlYWRlci5rZXlTZXQoKSlcXG4gICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgQEAkcGFyYW1OYW1lQEA6IEBAJHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkYWxsUGFyYW1zLmhlYWRlci5nZXQoJHBhcmFtTmFtZSkpQEBcXFwiKVxcbiAgICAgICAgICAgICNpZigkZm9yZWFjaC5oYXNOZXh0KVxcbiAgICAgICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsXFxcIilcXG4gICAgICAgICAgICAjZW5kXFxuICAgICAgICAjZW5kXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgfVxcXCIpXFxuICAgICAgICBcXG4gICAgI2VuZFxcblxcbiAgICAjaWYgKCRpbmNsdWRlUXVlcnlTdHJpbmcpXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsIEBAcXVlcnlzdHJpbmdAQDp7XFxcIilcXG4gICAgICAgICNmb3JlYWNoKCRwYXJhbU5hbWUgaW4gJGFsbFBhcmFtcy5xdWVyeXN0cmluZy5rZXlTZXQoKSlcXG4gICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgQEAkcGFyYW1OYW1lQEA6IEBAJHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkYWxsUGFyYW1zLnF1ZXJ5c3RyaW5nLmdldCgkcGFyYW1OYW1lKSlAQFxcXCIpXFxuICAgICAgICAgICAgI2lmKCRmb3JlYWNoLmhhc05leHQpXFxuICAgICAgICAgICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyxcXFwiKVxcbiAgICAgICAgICAgICNlbmRcXG4gICAgICAgICNlbmRcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyB9XFxcIilcXG4gICAgI2VuZFxcblxcbiAgICAjaWYgKCRpbmNsdWRlUGF0aClcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZywgQEBwYXRoQEA6e1xcXCIpXFxuICAgICAgICAjZm9yZWFjaCgkcGFyYW1OYW1lIGluICRhbGxQYXJhbXMucGF0aC5rZXlTZXQoKSlcXG4gICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgQEAkcGFyYW1OYW1lQEA6IEBAJHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkYWxsUGFyYW1zLnBhdGguZ2V0KCRwYXJhbU5hbWUpKUBAXFxcIilcXG4gICAgICAgICAgICAjaWYoJGZvcmVhY2guaGFzTmV4dClcXG4gICAgICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLFxcXCIpXFxuICAgICAgICAgICAgI2VuZFxcbiAgICAgICAgI2VuZFxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIH1cXFwiKVxcbiAgICAjZW5kXFxuICAgIFxcbiAgICAjaWYgKCRpbmNsdWRlQXV0aG9yaXplcilcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZywgQEBhdXRob3JpemVyQEA6e1xcXCIpXFxuICAgICAgICAjZm9yZWFjaCgkcGFyYW1OYW1lIGluICRjb250ZXh0LmF1dGhvcml6ZXIua2V5U2V0KCkpXFxuICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIEBAJHBhcmFtTmFtZUBAOiBAQCR1dGlsLmVzY2FwZUphdmFTY3JpcHQoJGNvbnRleHQuYXV0aG9yaXplci5nZXQoJHBhcmFtTmFtZSkpQEBcXFwiKVxcbiAgICAgICAgICAgICNpZigkZm9yZWFjaC5oYXNOZXh0KVxcbiAgICAgICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsXFxcIilcXG4gICAgICAgICAgICAjZW5kXFxuICAgICAgICAjZW5kXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgfVxcXCIpXFxuICAgICNlbmRcXG5cXG4gICAgI3NldCgkcmVxdWVzdENvbnRleHQgPSBcXFwiXFxcIilcXG4gICAgIyMgQ2hlY2sgaWYgdGhlIHJlcXVlc3QgY29udGV4dCBzaG91bGQgYmUgaW5jbHVkZWQgYXMgcGFydCBvZiB0aGUgZXhlY3V0aW9uIGlucHV0XFxuICAgICNpZigkcmVxdWVzdENvbnRleHQgJiYgISRyZXF1ZXN0Q29udGV4dC5lbXB0eSlcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyxcXFwiKVxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIEBAcmVxdWVzdENvbnRleHRAQDogJHJlcXVlc3RDb250ZXh0XFxcIilcXG4gICAgI2VuZFxcblxcbiAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmd9XFxcIilcXG4gICAgI3NldCgkaW5wdXRTdHJpbmcgPSAkaW5wdXRTdHJpbmcucmVwbGFjZUFsbChcXFwiQEBcXFwiLCdcXFwiJykpXFxuICAgICNzZXQoJGxlbiA9ICRpbnB1dFN0cmluZy5sZW5ndGgoKSAtIDEpXFxuICAgIFxcXCJpbnB1dFxcXCI6IFxcXCJ7JHV0aWwuZXNjYXBlSmF2YVNjcmlwdCgkaW5wdXRTdHJpbmcuc3Vic3RyaW5nKDEsJGxlbikpLnJlcGxhY2VBbGwoXFxcIlxcXFxcXFxcJ1xcXCIsXFxcIidcXFwiKX1cXFwiXFxufVxcblwiLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnQVdTJyxcbiAgICAgICAgVXJpOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6c3RhdGVzOmFjdGlvbi9TdGFydFN5bmNFeGVjdXRpb24nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBQYXNzdGhyb3VnaEJlaGF2aW9yOiAnTkVWRVInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RlcEZ1bmN0aW9uc0V4ZWN1dGlvbkludGVncmF0aW9uIG9uIGEgbWV0aG9kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdBcGknKTtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ1N0YXRlTWFjaGluZScsIHtcbiAgICAgIHN0YXRlTWFjaGluZVR5cGU6IHNmbi5TdGF0ZU1hY2hpbmVUeXBlLkVYUFJFU1MsXG4gICAgICBkZWZpbml0aW9uOiBuZXcgc2ZuLlBhc3Moc3RhY2ssICdQYXNzJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3NmbicpLmFkZE1ldGhvZCgnUE9TVCcsIFN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihzdGF0ZU1hY2hpbmUpKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICBNZXRob2RSZXNwb25zZXM6IGdldE1ldGhvZFJlc3BvbnNlKCksXG4gICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICBDcmVkZW50aWFsczoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0FwaXNmblBPU1RTdGFydFN5bmNFeGVjdXRpb25Sb2xlOEU4ODc5QjAnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSW50ZWdyYXRpb25IdHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIEludGVncmF0aW9uUmVzcG9uc2VzOiBnZXRJbnRlZ3JhdGlvblJlc3BvbnNlKCksXG4gICAgICAgIFJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcIiMjIFZlbG9jaXR5IFRlbXBsYXRlIHVzZWQgZm9yIEFQSSBHYXRld2F5IHJlcXVlc3QgbWFwcGluZyB0ZW1wbGF0ZVxcbiMjXFxuIyMgVGhpcyB0ZW1wbGF0ZSBmb3J3YXJkcyB0aGUgcmVxdWVzdCBib2R5LCBoZWFkZXIsIHBhdGgsIGFuZCBxdWVyeXN0cmluZ1xcbiMjIHRvIHRoZSBleGVjdXRpb24gaW5wdXQgb2YgdGhlIHN0YXRlIG1hY2hpbmUuXFxuIyNcXG4jIyBcXFwiQEBcXFwiIGlzIHVzZWQgaGVyZSBhcyBhIHBsYWNlaG9sZGVyIGZvciAnXFxcIicgdG8gYXZvaWQgdXNpbmcgZXNjYXBlIGNoYXJhY3RlcnMuXFxuXFxuI3NldCgkaW5wdXRTdHJpbmcgPSAnJylcXG4jc2V0KCRpbmNsdWRlSGVhZGVycyA9IGZhbHNlKVxcbiNzZXQoJGluY2x1ZGVRdWVyeVN0cmluZyA9IHRydWUpXFxuI3NldCgkaW5jbHVkZVBhdGggPSB0cnVlKVxcbiNzZXQoJGluY2x1ZGVBdXRob3JpemVyID0gZmFsc2UpXFxuI3NldCgkYWxsUGFyYW1zID0gJGlucHV0LnBhcmFtcygpKVxcbntcXG4gICAgXFxcInN0YXRlTWFjaGluZUFyblxcXCI6IFxcXCJcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdTdGF0ZU1hY2hpbmUyRTAxQTNBNScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIlxcXCIsXFxuXFxuICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyxAQGJvZHlAQDogJGlucHV0LmJvZHlcXFwiKVxcblxcbiAgICAjaWYgKCRpbmNsdWRlSGVhZGVycylcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZywgQEBoZWFkZXJAQDp7XFxcIilcXG4gICAgICAgICNmb3JlYWNoKCRwYXJhbU5hbWUgaW4gJGFsbFBhcmFtcy5oZWFkZXIua2V5U2V0KCkpXFxuICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIEBAJHBhcmFtTmFtZUBAOiBAQCR1dGlsLmVzY2FwZUphdmFTY3JpcHQoJGFsbFBhcmFtcy5oZWFkZXIuZ2V0KCRwYXJhbU5hbWUpKUBAXFxcIilcXG4gICAgICAgICAgICAjaWYoJGZvcmVhY2guaGFzTmV4dClcXG4gICAgICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLFxcXCIpXFxuICAgICAgICAgICAgI2VuZFxcbiAgICAgICAgI2VuZFxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIH1cXFwiKVxcbiAgICAgICAgXFxuICAgICNlbmRcXG5cXG4gICAgI2lmICgkaW5jbHVkZVF1ZXJ5U3RyaW5nKVxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLCBAQHF1ZXJ5c3RyaW5nQEA6e1xcXCIpXFxuICAgICAgICAjZm9yZWFjaCgkcGFyYW1OYW1lIGluICRhbGxQYXJhbXMucXVlcnlzdHJpbmcua2V5U2V0KCkpXFxuICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIEBAJHBhcmFtTmFtZUBAOiBAQCR1dGlsLmVzY2FwZUphdmFTY3JpcHQoJGFsbFBhcmFtcy5xdWVyeXN0cmluZy5nZXQoJHBhcmFtTmFtZSkpQEBcXFwiKVxcbiAgICAgICAgICAgICNpZigkZm9yZWFjaC5oYXNOZXh0KVxcbiAgICAgICAgICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsXFxcIilcXG4gICAgICAgICAgICAjZW5kXFxuICAgICAgICAjZW5kXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcgfVxcXCIpXFxuICAgICNlbmRcXG5cXG4gICAgI2lmICgkaW5jbHVkZVBhdGgpXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsIEBAcGF0aEBAOntcXFwiKVxcbiAgICAgICAgI2ZvcmVhY2goJHBhcmFtTmFtZSBpbiAkYWxsUGFyYW1zLnBhdGgua2V5U2V0KCkpXFxuICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIEBAJHBhcmFtTmFtZUBAOiBAQCR1dGlsLmVzY2FwZUphdmFTY3JpcHQoJGFsbFBhcmFtcy5wYXRoLmdldCgkcGFyYW1OYW1lKSlAQFxcXCIpXFxuICAgICAgICAgICAgI2lmKCRmb3JlYWNoLmhhc05leHQpXFxuICAgICAgICAgICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyxcXFwiKVxcbiAgICAgICAgICAgICNlbmRcXG4gICAgICAgICNlbmRcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyB9XFxcIilcXG4gICAgI2VuZFxcbiAgICBcXG4gICAgI2lmICgkaW5jbHVkZUF1dGhvcml6ZXIpXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsIEBAYXV0aG9yaXplckBAOntcXFwiKVxcbiAgICAgICAgI2ZvcmVhY2goJHBhcmFtTmFtZSBpbiAkY29udGV4dC5hdXRob3JpemVyLmtleVNldCgpKVxcbiAgICAgICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyBAQCRwYXJhbU5hbWVAQDogQEAkdXRpbC5lc2NhcGVKYXZhU2NyaXB0KCRjb250ZXh0LmF1dGhvcml6ZXIuZ2V0KCRwYXJhbU5hbWUpKUBAXFxcIilcXG4gICAgICAgICAgICAjaWYoJGZvcmVhY2guaGFzTmV4dClcXG4gICAgICAgICAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nLFxcXCIpXFxuICAgICAgICAgICAgI2VuZFxcbiAgICAgICAgI2VuZFxcbiAgICAgICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nIH1cXFwiKVxcbiAgICAjZW5kXFxuXFxuICAgICNzZXQoJHJlcXVlc3RDb250ZXh0ID0gXFxcIlxcXCIpXFxuICAgICMjIENoZWNrIGlmIHRoZSByZXF1ZXN0IGNvbnRleHQgc2hvdWxkIGJlIGluY2x1ZGVkIGFzIHBhcnQgb2YgdGhlIGV4ZWN1dGlvbiBpbnB1dFxcbiAgICAjaWYoJHJlcXVlc3RDb250ZXh0ICYmICEkcmVxdWVzdENvbnRleHQuZW1wdHkpXFxuICAgICAgICAjc2V0KCRpbnB1dFN0cmluZyA9IFxcXCIkaW5wdXRTdHJpbmcsXFxcIilcXG4gICAgICAgICNzZXQoJGlucHV0U3RyaW5nID0gXFxcIiRpbnB1dFN0cmluZyBAQHJlcXVlc3RDb250ZXh0QEA6ICRyZXF1ZXN0Q29udGV4dFxcXCIpXFxuICAgICNlbmRcXG5cXG4gICAgI3NldCgkaW5wdXRTdHJpbmcgPSBcXFwiJGlucHV0U3RyaW5nfVxcXCIpXFxuICAgICNzZXQoJGlucHV0U3RyaW5nID0gJGlucHV0U3RyaW5nLnJlcGxhY2VBbGwoXFxcIkBAXFxcIiwnXFxcIicpKVxcbiAgICAjc2V0KCRsZW4gPSAkaW5wdXRTdHJpbmcubGVuZ3RoKCkgLSAxKVxcbiAgICBcXFwiaW5wdXRcXFwiOiBcXFwieyR1dGlsLmVzY2FwZUphdmFTY3JpcHQoJGlucHV0U3RyaW5nLnN1YnN0cmluZygxLCRsZW4pKS5yZXBsYWNlQWxsKFxcXCJcXFxcXFxcXCdcXFwiLFxcXCInXFxcIil9XFxcIlxcbn1cXG5cIixcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgVHlwZTogJ0FXUycsXG4gICAgICAgIFVyaToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6YXBpZ2F0ZXdheTonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOnN0YXRlczphY3Rpb24vU3RhcnRTeW5jRXhlY3V0aW9uJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUGFzc3Rocm91Z2hCZWhhdmlvcjogJ05FVkVSJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0YXRlczpTdGFydFN5bmNFeGVjdXRpb24nLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ0FwaXNmblBPU1RTdGFydFN5bmNFeGVjdXRpb25Sb2xlOEU4ODc5QjAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgb3B0aW9ucy5kZWZhdWx0SW50ZWdyYXRpb24gaXMgc2V0JywgKCkgPT4ge1xuICAgIC8vR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCBzdGF0ZU1hY2hpbmUgfSA9IGdpdmVuU2V0dXAoKTtcblxuICAgIGNvbnN0IGh0dHBVUkw6IHN0cmluZyA9ICdodHRwczovL2Zvby9iYXInO1xuXG4gICAgLy9XSEVOICYgVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgYXBpZ3cuU3RlcEZ1bmN0aW9uc1Jlc3RBcGkoc3RhY2ssICdTdGVwRnVuY3Rpb25zUmVzdEFwaScsIHtcbiAgICAgIHN0YXRlTWFjaGluZTogc3RhdGVNYWNoaW5lLFxuICAgICAgZGVmYXVsdEludGVncmF0aW9uOiBuZXcgYXBpZ3cuSHR0cEludGVncmF0aW9uKGh0dHBVUkwpLFxuICAgIH0pKS50b1Rocm93KC9DYW5ub3Qgc3BlY2lmeSBcXFwiZGVmYXVsdEludGVncmF0aW9uXFxcIiBzaW5jZSBTdGVwIEZ1bmN0aW9ucyBpbnRlZ3JhdGlvbiBpcyBhdXRvbWF0aWNhbGx5IGRlZmluZWQvKTtcblxuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBTdGF0ZSBNYWNoaW5lIGlzIG5vdCBvZiB0eXBlIEVYUFJFU1MnLCAoKSA9PiB7XG4gICAgLy9HSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgcGFzc1Rhc2sgPSBuZXcgc2ZuLlBhc3Moc3RhY2ssICdwYXNzVGFzaycsIHtcbiAgICAgIGlucHV0UGF0aDogJyQuc29tZWtleScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGF0ZU1hY2hpbmU6IHNmbi5JU3RhdGVNYWNoaW5lID0gbmV3IFN0YXRlTWFjaGluZShzdGFjaywgJ1N0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IHBhc3NUYXNrLFxuICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuU1RBTkRBUkQsXG4gICAgfSk7XG5cbiAgICAvL1dIRU4gJiBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBhcGlndy5TdGVwRnVuY3Rpb25zUmVzdEFwaShzdGFjaywgJ1N0ZXBGdW5jdGlvbnNSZXN0QXBpJywge1xuICAgICAgc3RhdGVNYWNoaW5lOiBzdGF0ZU1hY2hpbmUsXG4gICAgfSkpLnRvVGhyb3coL1N0YXRlIE1hY2hpbmUgbXVzdCBiZSBvZiB0eXBlIFwiRVhQUkVTU1wiLiBQbGVhc2UgdXNlIFN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyBhcyB0aGUgc3RhdGVNYWNoaW5lVHlwZS8pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBnaXZlblNldHVwKCkge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBjb25zdCBwYXNzVGFzayA9IG5ldyBzZm4uUGFzcyhzdGFjaywgJ3Bhc3NUYXNrJywge1xuICAgIGlucHV0UGF0aDogJyQuc29tZWtleScsXG4gIH0pO1xuXG4gIGNvbnN0IHN0YXRlTWFjaGluZTogc2ZuLklTdGF0ZU1hY2hpbmUgPSBuZXcgU3RhdGVNYWNoaW5lKHN0YWNrLCAnU3RhdGVNYWNoaW5lJywge1xuICAgIGRlZmluaXRpb246IHBhc3NUYXNrLFxuICAgIHN0YXRlTWFjaGluZVR5cGU6IHNmbi5TdGF0ZU1hY2hpbmVUeXBlLkVYUFJFU1MsXG4gIH0pO1xuXG4gIHJldHVybiB7IHN0YWNrLCBzdGF0ZU1hY2hpbmUgfTtcbn1cblxuZnVuY3Rpb24gd2hlbkNvbmRpdGlvbihzdGFjazpjZGsuU3RhY2ssIHN0YXRlTWFjaGluZTogc2ZuLklTdGF0ZU1hY2hpbmUpIHtcbiAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlN0ZXBGdW5jdGlvbnNSZXN0QXBpKHN0YWNrLCAnU3RlcEZ1bmN0aW9uc1Jlc3RBcGknLCB7IHN0YXRlTWFjaGluZTogc3RhdGVNYWNoaW5lIH0pO1xuICByZXR1cm4gYXBpO1xufVxuXG5mdW5jdGlvbiBnZXRNZXRob2RSZXNwb25zZSgpIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBTdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgIFJlc3BvbnNlTW9kZWxzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ0VtcHR5JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBTdGF0dXNDb2RlOiAnNDAwJyxcbiAgICAgIFJlc3BvbnNlTW9kZWxzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ0Vycm9yJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBTdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgIFJlc3BvbnNlTW9kZWxzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ0Vycm9yJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgXTtcbn1cblxuZnVuY3Rpb24gZ2V0SW50ZWdyYXRpb25SZXNwb25zZSgpIHtcbiAgY29uc3QgZXJyb3JSZXNwb25zZSA9IFtcbiAgICB7XG4gICAgICBTZWxlY3Rpb25QYXR0ZXJuOiAnNFxcXFxkezJ9JyxcbiAgICAgIFN0YXR1c0NvZGU6ICc0MDAnLFxuICAgICAgUmVzcG9uc2VUZW1wbGF0ZXM6IHtcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIkJhZCByZXF1ZXN0IVwiXG4gICAgICAgICAgfWAsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgU2VsZWN0aW9uUGF0dGVybjogJzVcXFxcZHsyfScsXG4gICAgICBTdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgIFJlc3BvbnNlVGVtcGxhdGVzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ1wiZXJyb3JcIjogJGlucHV0LnBhdGgoXFwnJC5lcnJvclxcJyknLFxuICAgICAgfSxcbiAgICB9LFxuICBdO1xuXG4gIGNvbnN0IGludGVnUmVzcG9uc2UgPSBbXG4gICAge1xuICAgICAgU3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICBSZXNwb25zZVRlbXBsYXRlczoge1xuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IFtcbiAgICAgICAgICAnI3NldCgkaW5wdXRSb290ID0gJGlucHV0LnBhdGgoXFwnJFxcJykpJyxcbiAgICAgICAgICAnI2lmKCRpbnB1dC5wYXRoKFxcJyQuc3RhdHVzXFwnKS50b1N0cmluZygpLmVxdWFscyhcIkZBSUxFRFwiKSknLFxuICAgICAgICAgICcjc2V0KCRjb250ZXh0LnJlc3BvbnNlT3ZlcnJpZGUuc3RhdHVzID0gNTAwKScsXG4gICAgICAgICAgJ3snLFxuICAgICAgICAgICdcImVycm9yXCI6IFwiJGlucHV0LnBhdGgoXFwnJC5lcnJvclxcJylcIiwnLFxuICAgICAgICAgICdcImNhdXNlXCI6IFwiJGlucHV0LnBhdGgoXFwnJC5jYXVzZVxcJylcIicsXG4gICAgICAgICAgJ30nLFxuICAgICAgICAgICcjZWxzZScsXG4gICAgICAgICAgJyRpbnB1dC5wYXRoKFxcJyQub3V0cHV0XFwnKScsXG4gICAgICAgICAgJyNlbmQnLFxuICAgICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIC4uLmVycm9yUmVzcG9uc2UsXG4gIF07XG5cbiAgcmV0dXJuIGludGVnUmVzcG9uc2U7XG59XG4iXX0=