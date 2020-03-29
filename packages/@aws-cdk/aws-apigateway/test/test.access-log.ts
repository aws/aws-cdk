import {expect, haveResource} from '@aws-cdk/assert';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import {Test} from 'nodeunit';
import * as apigateway from '../lib';

export = {
    'if jsonWithStandardFields method called with no parameter'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', {cloudWatchRole: false, deploy: false});
        const deployment = new apigateway.Deployment(stack, 'my-deployment', {api});
        api.root.addMethod('GET');

        // WHEN
        const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
        const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields();
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
            accessLogFormat: testFormat
        });

        // THEN
        expect(stack).to(haveResource('AWS::ApiGateway::Stage', {
            AccessLogSetting: {
                DestinationArn: {
                    "Fn::GetAtt": [
                        "LogGroupF5B46931",
                        "Arn"
                    ]
                },
                Format: "{\"requestId\":\"$context.requestId\",\"ip\":\"$context.identity.sourceIp\",\"user\":\"$context.identity.user\",\"caller\":\"$context.identity.caller\",\"requestTime\":\"$context.requestTime\",\"httpMethod\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\",\"status\":\"$context.status\",\"protocol\":\"$context.protocol\",\"responseLength\":\"$context.responseLength\"}"
            },
            StageName: "prod"
        }));

        test.done();
    },

    'if jsonWithStandardFields method called with all parameters false'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', {cloudWatchRole: false, deploy: false});
        const deployment = new apigateway.Deployment(stack, 'my-deployment', {api});
        api.root.addMethod('GET');

        // WHEN
        const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
        const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
            caller: false,
            httpMethod: false,
            ip: false,
            protocol: false,
            requestTime: false,
            resourcePath: false,
            responseLength: false,
            status: false,
            user: false
        });
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
            accessLogFormat: testFormat
        });

        // THEN
        expect(stack).to(haveResource('AWS::ApiGateway::Stage', {
            AccessLogSetting: {
                DestinationArn: {
                    "Fn::GetAtt": [
                        "LogGroupF5B46931",
                        "Arn"
                    ]
                },
                Format: "{\"requestId\":\"$context.requestId\"}"
            },
            StageName: "prod"
        }));

        test.done();
    },

};
