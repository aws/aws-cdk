"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const apigateway = require("../../lib");
describe('lambda', () => {
    test('minimal setup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'my-api');
        const handler = new lambda.Function(stack, 'Handler', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'boom',
            code: lambda.Code.fromInline('foo'),
        });
        // WHEN
        const integ = new apigateway.LambdaIntegration(handler);
        api.root.addMethod('GET', integ);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                IntegrationHttpMethod: 'POST',
                Type: 'AWS_PROXY',
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
                            ':lambda:path/2015-03-31/functions/',
                            {
                                'Fn::GetAtt': [
                                    'Handler886CB40B',
                                    'Arn',
                                ],
                            },
                            '/invocations',
                        ],
                    ],
                },
            },
        });
    });
    test('"allowTestInvoke" can be used to disallow calling the API from the test UI', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'Handler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
        });
        const api = new apigateway.RestApi(stack, 'api');
        // WHEN
        const integ = new apigateway.LambdaIntegration(fn, { allowTestInvoke: false });
        api.root.addMethod('GET', integ);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            SourceArn: {
                'Fn::Join': [
                    '',
                    [
                        'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':',
                        { Ref: 'apiC8550315' }, '/', { Ref: 'apiDeploymentStageprod896C8101' }, '/GET/',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', assertions_1.Match.not({
            SourceArn: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':execute-api:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':',
                        { Ref: 'apiC8550315' },
                        '/test-invoke-stage/GET/',
                    ],
                ],
            },
        }));
    });
    test('"allowTestInvoke" set to true allows calling the API from the test UI', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'Handler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
        });
        const api = new apigateway.RestApi(stack, 'api');
        // WHEN
        const integ = new apigateway.LambdaIntegration(fn, { allowTestInvoke: true });
        api.root.addMethod('GET', integ);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            SourceArn: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':execute-api:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':',
                        { Ref: 'apiC8550315' },
                        '/test-invoke-stage/GET/',
                    ],
                ],
            },
        });
    });
    test('"proxy" can be used to disable proxy mode', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'Handler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
        });
        const api = new apigateway.RestApi(stack, 'api');
        // WHEN
        const integ = new apigateway.LambdaIntegration(fn, { proxy: false });
        api.root.addMethod('GET', integ);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                Type: 'AWS',
            },
        });
    });
    test('when "ANY" is used, lambda permission will include "*" for method', () => {
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api');
        const handler = new lambda.Function(stack, 'MyFunc', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('loo'),
        });
        const target = new apigateway.LambdaIntegration(handler);
        api.root.addMethod('ANY', target);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            SourceArn: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':execute-api:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':',
                        { Ref: 'testapiD6451F70' },
                        '/test-invoke-stage/*/',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            SourceArn: {
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
                            Ref: 'testapiD6451F70',
                        },
                        '/',
                        { Ref: 'testapiDeploymentStageprod5C9E92A4' },
                        '/*/',
                    ],
                ],
            },
        });
    });
    test('works for imported RestApi', () => {
        const stack = new cdk.Stack();
        const api = apigateway.RestApi.fromRestApiAttributes(stack, 'RestApi', {
            restApiId: 'imported-rest-api-id',
            rootResourceId: 'imported-root-resource-id',
        });
        const handler = new lambda.Function(stack, 'MyFunc', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('loo'),
        });
        api.root.addMethod('ANY', new apigateway.LambdaIntegration(handler));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            RestApiId: 'imported-rest-api-id',
            ResourceId: 'imported-root-resource-id',
            HttpMethod: 'ANY',
        });
    });
    test('fingerprint is computed when functionName is specified', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const restapi = new apigateway.RestApi(stack, 'RestApi');
        const method = restapi.root.addMethod('ANY');
        const handler = new lambda.Function(stack, 'MyFunc', {
            functionName: 'ThisFunction',
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('loo'),
        });
        const integration = new apigateway.LambdaIntegration(handler);
        // WHEN
        const bindResult = integration.bind(method);
        // THEN
        expect(bindResult?.deploymentToken).toBeDefined();
        expect(bindResult.deploymentToken).toEqual('{"functionName":"ThisFunction"}');
    });
    test('fingerprint is not computed when functionName is not specified', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const restapi = new apigateway.RestApi(stack, 'RestApi');
        const method = restapi.root.addMethod('ANY');
        const handler = new lambda.Function(stack, 'MyFunc', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('loo'),
        });
        const integration = new apigateway.LambdaIntegration(handler);
        // WHEN
        const bindResult = integration.bind(method);
        // THEN
        expect(bindResult?.deploymentToken).toBeUndefined();
    });
    test('bind works for integration with imported functions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const restapi = new apigateway.RestApi(stack, 'RestApi');
        const method = restapi.root.addMethod('ANY');
        const handler = lambda.Function.fromFunctionArn(stack, 'MyFunc', 'arn:aws:lambda:region:account:function:myfunc');
        const integration = new apigateway.LambdaIntegration(handler);
        // WHEN
        const bindResult = integration.bind(method);
        // the deployment token should be defined since the function name
        // should be a literal string.
        expect(bindResult?.deploymentToken).toEqual(JSON.stringify({ functionName: 'myfunc' }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBQ3JDLHdDQUF3QztBQUV4QyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNwRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLE9BQU8sRUFBRSxNQUFNO1lBQ2YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUNwQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWpDLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxXQUFXLEVBQUU7Z0JBQ1gscUJBQXFCLEVBQUUsTUFBTTtnQkFDN0IsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEdBQUcsRUFBRTtvQkFDSCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxNQUFNOzRCQUNOO2dD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QUFDO1FBRTVDLE9BQU87UUFDUCxNQUFNLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3RELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUM5RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLCtDQUErQyxDQUFDLENBQUM7UUFDbEgsTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUQsT0FBTztRQUNQLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUMsaUVBQWlFO1FBQ2pFLDhCQUE4QjtRQUM5QixNQUFNLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJy4uLy4uL2xpYic7XG5cbmRlc2NyaWJlKCdsYW1iZGEnLCAoKSA9PiB7XG4gIHRlc3QoJ21pbmltYWwgc2V0dXAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJyk7XG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdIYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdib29tJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGludGVnID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaGFuZGxlcik7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25IdHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIFR5cGU6ICdBV1NfUFJPWFknLFxuICAgICAgICBVcmk6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOmFwaWdhdGV3YXk6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzpsYW1iZGE6cGF0aC8yMDE1LTAzLTMxL2Z1bmN0aW9ucy8nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnSGFuZGxlcjg4NkNCNDBCJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcvaW52b2NhdGlvbnMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJhbGxvd1Rlc3RJbnZva2VcIiBjYW4gYmUgdXNlZCB0byBkaXNhbGxvdyBjYWxsaW5nIHRoZSBBUEkgZnJvbSB0aGUgdGVzdCBVSScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0hhbmRsZXInLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGludGVnID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZm4sIHsgYWxsb3dUZXN0SW52b2tlOiBmYWxzZSB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIGludGVnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpleGVjdXRlLWFwaTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnYXBpQzg1NTAzMTUnIH0sICcvJywgeyBSZWY6ICdhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kODk2QzgxMDEnIH0sICcvR0VULycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCBNYXRjaC5ub3Qoe1xuICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgJzpleGVjdXRlLWFwaTonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOicsXG4gICAgICAgICAgICB7IFJlZjogJ2FwaUM4NTUwMzE1JyB9LFxuICAgICAgICAgICAgJy90ZXN0LWludm9rZS1zdGFnZS9HRVQvJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiYWxsb3dUZXN0SW52b2tlXCIgc2V0IHRvIHRydWUgYWxsb3dzIGNhbGxpbmcgdGhlIEFQSSBmcm9tIHRoZSB0ZXN0IFVJJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW50ZWcgPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihmbiwgeyBhbGxvd1Rlc3RJbnZva2U6IHRydWUgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywge1xuICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgJzpleGVjdXRlLWFwaTonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOicsXG4gICAgICAgICAgICB7IFJlZjogJ2FwaUM4NTUwMzE1JyB9LFxuICAgICAgICAgICAgJy90ZXN0LWludm9rZS1zdGFnZS9HRVQvJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJwcm94eVwiIGNhbiBiZSB1c2VkIHRvIGRpc2FibGUgcHJveHkgbW9kZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0hhbmRsZXInLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGludGVnID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZm4sIHsgcHJveHk6IGZhbHNlIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgaW50ZWcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIFR5cGU6ICdBV1MnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2hlbiBcIkFOWVwiIGlzIHVzZWQsIGxhbWJkYSBwZXJtaXNzaW9uIHdpbGwgaW5jbHVkZSBcIipcIiBmb3IgbWV0aG9kJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmMnLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2xvbycpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaGFuZGxlcik7XG5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0FOWScsIHRhcmdldCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmV4ZWN1dGUtYXBpOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAndGVzdGFwaUQ2NDUxRjcwJyB9LFxuICAgICAgICAgICAgJy90ZXN0LWludm9rZS1zdGFnZS8qLycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6ZXhlY3V0ZS1hcGk6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAndGVzdGFwaUQ2NDUxRjcwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLycsXG4gICAgICAgICAgICB7IFJlZjogJ3Rlc3RhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kNUM5RTkyQTQnIH0sXG4gICAgICAgICAgICAnLyovJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd29ya3MgZm9yIGltcG9ydGVkIFJlc3RBcGknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gYXBpZ2F0ZXdheS5SZXN0QXBpLmZyb21SZXN0QXBpQXR0cmlidXRlcyhzdGFjaywgJ1Jlc3RBcGknLCB7XG4gICAgICByZXN0QXBpSWQ6ICdpbXBvcnRlZC1yZXN0LWFwaS1pZCcsXG4gICAgICByb290UmVzb3VyY2VJZDogJ2ltcG9ydGVkLXJvb3QtcmVzb3VyY2UtaWQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmMnLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2xvbycpLFxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihoYW5kbGVyKSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBSZXN0QXBpSWQ6ICdpbXBvcnRlZC1yZXN0LWFwaS1pZCcsXG4gICAgICBSZXNvdXJjZUlkOiAnaW1wb3J0ZWQtcm9vdC1yZXNvdXJjZS1pZCcsXG4gICAgICBIdHRwTWV0aG9kOiAnQU5ZJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmluZ2VycHJpbnQgaXMgY29tcHV0ZWQgd2hlbiBmdW5jdGlvbk5hbWUgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcmVzdGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICdSZXN0QXBpJyk7XG4gICAgY29uc3QgbWV0aG9kID0gcmVzdGFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJyk7XG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmMnLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6ICdUaGlzRnVuY3Rpb24nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdsb28nKSxcbiAgICB9KTtcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGhhbmRsZXIpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGJpbmRSZXN1bHQgPSBpbnRlZ3JhdGlvbi5iaW5kKG1ldGhvZCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGJpbmRSZXN1bHQ/LmRlcGxveW1lbnRUb2tlbikudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoYmluZFJlc3VsdCEuZGVwbG95bWVudFRva2VuKS50b0VxdWFsKCd7XCJmdW5jdGlvbk5hbWVcIjpcIlRoaXNGdW5jdGlvblwifScpO1xuICB9KTtcblxuICB0ZXN0KCdmaW5nZXJwcmludCBpcyBub3QgY29tcHV0ZWQgd2hlbiBmdW5jdGlvbk5hbWUgaXMgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJlc3RhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAnUmVzdEFwaScpO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlc3RhcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdsb28nKSxcbiAgICB9KTtcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGhhbmRsZXIpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGJpbmRSZXN1bHQgPSBpbnRlZ3JhdGlvbi5iaW5kKG1ldGhvZCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGJpbmRSZXN1bHQ/LmRlcGxveW1lbnRUb2tlbikudG9CZVVuZGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdiaW5kIHdvcmtzIGZvciBpbnRlZ3JhdGlvbiB3aXRoIGltcG9ydGVkIGZ1bmN0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJlc3RhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAnUmVzdEFwaScpO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlc3RhcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xuICAgIGNvbnN0IGhhbmRsZXIgPSBsYW1iZGEuRnVuY3Rpb24uZnJvbUZ1bmN0aW9uQXJuKHN0YWNrLCAnTXlGdW5jJywgJ2Fybjphd3M6bGFtYmRhOnJlZ2lvbjphY2NvdW50OmZ1bmN0aW9uOm15ZnVuYycpO1xuICAgIGNvbnN0IGludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaGFuZGxlcik7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYmluZFJlc3VsdCA9IGludGVncmF0aW9uLmJpbmQobWV0aG9kKTtcblxuICAgIC8vIHRoZSBkZXBsb3ltZW50IHRva2VuIHNob3VsZCBiZSBkZWZpbmVkIHNpbmNlIHRoZSBmdW5jdGlvbiBuYW1lXG4gICAgLy8gc2hvdWxkIGJlIGEgbGl0ZXJhbCBzdHJpbmcuXG4gICAgZXhwZWN0KGJpbmRSZXN1bHQ/LmRlcGxveW1lbnRUb2tlbikudG9FcXVhbChKU09OLnN0cmluZ2lmeSh7IGZ1bmN0aW9uTmFtZTogJ215ZnVuYycgfSkpO1xuICB9KTtcbn0pO1xuIl19