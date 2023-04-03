"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const api = require("@aws-cdk/aws-apigateway");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const sqs = require("@aws-cdk/aws-sqs");
const cdk = require("@aws-cdk/core");
const targets = require("../../lib");
test('use api gateway rest api as an event rule target', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = newTestRestApi(stack);
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    rule.addTarget(new targets.ApiGateway(restApi));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: {
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
                                Ref: 'MyLambdaRestApiECB8AFAF',
                            },
                            '/',
                            {
                                Ref: 'MyLambdaRestApiDeploymentStageprodA127C527',
                            },
                            '/*/',
                        ],
                    ],
                },
                HttpParameters: {},
                Id: 'Target0',
                RoleArn: {
                    'Fn::GetAtt': [
                        'MyLambdaRestApiEventsRole3C0505CC',
                        'Arn',
                    ],
                },
            },
        ],
    });
});
test('with stage, path, method setting', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = newTestRestApi(stack);
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    const stage = 'test-stage';
    const path = '/test-path';
    const method = 'GET';
    rule.addTarget(new targets.ApiGateway(restApi, {
        stage, path, method,
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: {
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
                                Ref: 'MyLambdaRestApiECB8AFAF',
                            },
                            '/test-stage/GET/test-path',
                        ],
                    ],
                },
                HttpParameters: {},
                Id: 'Target0',
                RoleArn: {
                    'Fn::GetAtt': [
                        'MyLambdaRestApiEventsRole3C0505CC',
                        'Arn',
                    ],
                },
            },
        ],
    });
});
test('with http parameters', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = newTestRestApi(stack);
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    const pathParameterValues = ['path1', 'path2'];
    const headerParameters = {
        TestHeader1: 'test-header-value-1',
        TestHeader2: 'test-header-value-2',
    };
    const queryStringParameters = {
        TestQueryParameter1: 'test-query-parameter-value-1',
        TestQueryParameter2: 'test-query-parameter-value-2',
    };
    rule.addTarget(new targets.ApiGateway(restApi, {
        path: '/*/*',
        pathParameterValues,
        headerParameters,
        queryStringParameters,
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                HttpParameters: {
                    HeaderParameters: headerParameters,
                    QueryStringParameters: queryStringParameters,
                    PathParameterValues: pathParameterValues,
                },
                Id: 'Target0',
            },
        ],
    });
});
test('Throw when the number of wild cards in the path not equal to the number of pathParameterValues', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = newTestRestApi(stack);
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN, THEN
    expect(() => rule.addTarget(new targets.ApiGateway(restApi, {
        pathParameterValues: ['value1'],
    }))).toThrow(/The number of wildcards in the path does not match the number of path pathParameterValues/);
    expect(() => rule.addTarget(new targets.ApiGateway(restApi, {
        path: '/*',
    }))).toThrow(/The number of wildcards in the path does not match the number of path pathParameterValues/);
    expect(() => rule.addTarget(new targets.ApiGateway(restApi, {
        path: '/*/*',
        pathParameterValues: ['value1'],
    }))).toThrow(/The number of wildcards in the path does not match the number of path pathParameterValues/);
    expect(() => rule.addTarget(new targets.ApiGateway(restApi, {
        path: '/*/*',
        pathParameterValues: ['value1', 'value2'],
    }))).not.toThrow();
});
test('with an explicit event role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = newTestRestApi(stack);
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    const eventRole = new iam.Role(stack, 'Trigger-test-role', {
        assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    });
    rule.addTarget(new targets.ApiGateway(restApi, {
        eventRole,
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                RoleArn: {
                    'Fn::GetAtt': [
                        'TriggertestroleBCF8E6AD',
                        'Arn',
                    ],
                },
                Id: 'Target0',
            },
        ],
    });
});
test('use a Dead Letter Queue', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = newTestRestApi(stack);
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    const queue = new sqs.Queue(stack, 'Queue');
    rule.addTarget(new targets.ApiGateway(restApi, {
        deadLetterQueue: queue,
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                DeadLetterConfig: {
                    Arn: {
                        'Fn::GetAtt': [
                            'Queue4A7E3555',
                            'Arn',
                        ],
                    },
                },
                Id: 'Target0',
            },
        ],
    });
});
function newTestRestApi(scope, suffix = '') {
    const lambdaFunctin = new lambda.Function(scope, `MyLambda${suffix}`, {
        code: new lambda.InlineCode('foo'),
        handler: 'bar',
        runtime: lambda.Runtime.NODEJS_14_X,
    });
    return new api.LambdaRestApi(scope, `MyLambdaRestApi${suffix}`, {
        handler: lambdaFunctin,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWdhdGV3YXkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaS1nYXRld2F5LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsK0NBQStDO0FBQy9DLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFFckMscUNBQXFDO0FBRXJDLElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7SUFDNUQsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMxQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEQsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFaEQsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO1FBQ25FLE9BQU8sRUFBRTtZQUNQO2dCQUNFLEdBQUcsRUFBRTtvQkFDSCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxNQUFNOzRCQUNOO2dDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7NkJBQ3RCOzRCQUNELGVBQWU7NEJBQ2Y7Z0NBQ0UsR0FBRyxFQUFFLGFBQWE7NkJBQ25COzRCQUNELEdBQUc7NEJBQ0g7Z0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjs2QkFD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QUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO1FBQzdDLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUosT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO1FBQ25FLE9BQU8sRUFBRTtZQUNQO2dCQUNFLGdCQUFnQixFQUFFO29CQUNoQixHQUFHLEVBQUU7d0JBQ0gsWUFBWSxFQUFFOzRCQUNaLGVBQWU7NEJBQ2YsS0FBSzt5QkFDTjtxQkFDRjtpQkFDRjtnQkFDRCxFQUFFLEVBQUUsU0FBUzthQUNkO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsY0FBYyxDQUFDLEtBQTJCLEVBQUUsTUFBTSxHQUFHLEVBQUU7SUFDOUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxXQUFXLE1BQU0sRUFBRSxFQUFFO1FBQ3BFLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ2xDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztLQUNwQyxDQUFDLENBQUM7SUFDSCxPQUFPLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBRSxLQUFLLEVBQUUsa0JBQWtCLE1BQU0sRUFBRSxFQUFFO1FBQy9ELE9BQU8sRUFBRSxhQUFhO0tBQ3ZCLENBQUUsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgYXBpIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJy4uLy4uL2xpYic7XG5cbnRlc3QoJ3VzZSBhcGkgZ2F0ZXdheSByZXN0IGFwaSBhcyBhbiBldmVudCBydWxlIHRhcmdldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHJlc3RBcGkgPSBuZXdUZXN0UmVzdEFwaShzdGFjayk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuQXBpR2F0ZXdheShyZXN0QXBpKSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOmV4ZWN1dGUtYXBpOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlMYW1iZGFSZXN0QXBpRUNCOEFGQUYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeUxhbWJkYVJlc3RBcGlEZXBsb3ltZW50U3RhZ2Vwcm9kQTEyN0M1MjcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLyovJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSHR0cFBhcmFtZXRlcnM6IHt9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlMYW1iZGFSZXN0QXBpRXZlbnRzUm9sZTNDMDUwNUNDJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3dpdGggc3RhZ2UsIHBhdGgsIG1ldGhvZCBzZXR0aW5nJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgcmVzdEFwaSA9IG5ld1Rlc3RSZXN0QXBpKHN0YWNrKTtcbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBzdGFnZSA9ICd0ZXN0LXN0YWdlJztcbiAgY29uc3QgcGF0aCA9ICcvdGVzdC1wYXRoJztcbiAgY29uc3QgbWV0aG9kID0gJ0dFVCc7XG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkFwaUdhdGV3YXkocmVzdEFwaSwge1xuICAgIHN0YWdlLCBwYXRoLCBtZXRob2QsXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6ZXhlY3V0ZS1hcGk6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeUxhbWJkYVJlc3RBcGlFQ0I4QUZBRicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcvdGVzdC1zdGFnZS9HRVQvdGVzdC1wYXRoJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSHR0cFBhcmFtZXRlcnM6IHt9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlMYW1iZGFSZXN0QXBpRXZlbnRzUm9sZTNDMDUwNUNDJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3dpdGggaHR0cCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgcmVzdEFwaSA9IG5ld1Rlc3RSZXN0QXBpKHN0YWNrKTtcbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXRoUGFyYW1ldGVyVmFsdWVzID0gWydwYXRoMScsICdwYXRoMiddO1xuICBjb25zdCBoZWFkZXJQYXJhbWV0ZXJzID0ge1xuICAgIFRlc3RIZWFkZXIxOiAndGVzdC1oZWFkZXItdmFsdWUtMScsXG4gICAgVGVzdEhlYWRlcjI6ICd0ZXN0LWhlYWRlci12YWx1ZS0yJyxcbiAgfTtcbiAgY29uc3QgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzID0ge1xuICAgIFRlc3RRdWVyeVBhcmFtZXRlcjE6ICd0ZXN0LXF1ZXJ5LXBhcmFtZXRlci12YWx1ZS0xJyxcbiAgICBUZXN0UXVlcnlQYXJhbWV0ZXIyOiAndGVzdC1xdWVyeS1wYXJhbWV0ZXItdmFsdWUtMicsXG4gIH07XG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkFwaUdhdGV3YXkocmVzdEFwaSwge1xuICAgIHBhdGg6ICcvKi8qJyxcbiAgICBwYXRoUGFyYW1ldGVyVmFsdWVzLFxuICAgIGhlYWRlclBhcmFtZXRlcnMsXG4gICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBIdHRwUGFyYW1ldGVyczoge1xuICAgICAgICAgIEhlYWRlclBhcmFtZXRlcnM6IGhlYWRlclBhcmFtZXRlcnMsXG4gICAgICAgICAgUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiBxdWVyeVN0cmluZ1BhcmFtZXRlcnMsXG4gICAgICAgICAgUGF0aFBhcmFtZXRlclZhbHVlczogcGF0aFBhcmFtZXRlclZhbHVlcyxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnVGhyb3cgd2hlbiB0aGUgbnVtYmVyIG9mIHdpbGQgY2FyZHMgaW4gdGhlIHBhdGggbm90IGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgcGF0aFBhcmFtZXRlclZhbHVlcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHJlc3RBcGkgPSBuZXdUZXN0UmVzdEFwaShzdGFjayk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gIH0pO1xuXG4gIC8vIFdIRU4sIFRIRU5cbiAgZXhwZWN0KCgpID0+IHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkFwaUdhdGV3YXkocmVzdEFwaSwge1xuICAgIHBhdGhQYXJhbWV0ZXJWYWx1ZXM6IFsndmFsdWUxJ10sXG4gIH0pKSkudG9UaHJvdygvVGhlIG51bWJlciBvZiB3aWxkY2FyZHMgaW4gdGhlIHBhdGggZG9lcyBub3QgbWF0Y2ggdGhlIG51bWJlciBvZiBwYXRoIHBhdGhQYXJhbWV0ZXJWYWx1ZXMvKTtcbiAgZXhwZWN0KCgpID0+IHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkFwaUdhdGV3YXkocmVzdEFwaSwge1xuICAgIHBhdGg6ICcvKicsXG4gIH0pKSkudG9UaHJvdygvVGhlIG51bWJlciBvZiB3aWxkY2FyZHMgaW4gdGhlIHBhdGggZG9lcyBub3QgbWF0Y2ggdGhlIG51bWJlciBvZiBwYXRoIHBhdGhQYXJhbWV0ZXJWYWx1ZXMvKTtcbiAgZXhwZWN0KCgpID0+IHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkFwaUdhdGV3YXkocmVzdEFwaSwge1xuICAgIHBhdGg6ICcvKi8qJyxcbiAgICBwYXRoUGFyYW1ldGVyVmFsdWVzOiBbJ3ZhbHVlMSddLFxuICB9KSkpLnRvVGhyb3coL1RoZSBudW1iZXIgb2Ygd2lsZGNhcmRzIGluIHRoZSBwYXRoIGRvZXMgbm90IG1hdGNoIHRoZSBudW1iZXIgb2YgcGF0aCBwYXRoUGFyYW1ldGVyVmFsdWVzLyk7XG4gIGV4cGVjdCgoKSA9PiBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5BcGlHYXRld2F5KHJlc3RBcGksIHtcbiAgICBwYXRoOiAnLyovKicsXG4gICAgcGF0aFBhcmFtZXRlclZhbHVlczogWyd2YWx1ZTEnLCAndmFsdWUyJ10sXG4gIH0pKSkubm90LnRvVGhyb3coKTtcblxufSk7XG5cbnRlc3QoJ3dpdGggYW4gZXhwbGljaXQgZXZlbnQgcm9sZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHJlc3RBcGkgPSBuZXdUZXN0UmVzdEFwaShzdGFjayk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgZXZlbnRSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnVHJpZ2dlci10ZXN0LXJvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2V2ZW50cy5hbWF6b25hd3MuY29tJyksXG4gIH0pO1xuICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5BcGlHYXRld2F5KHJlc3RBcGksIHtcbiAgICBldmVudFJvbGUsXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdUcmlnZ2VydGVzdHJvbGVCQ0Y4RTZBRCcsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd1c2UgYSBEZWFkIExldHRlciBRdWV1ZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHJlc3RBcGkgPSBuZXdUZXN0UmVzdEFwaShzdGFjayk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuQXBpR2F0ZXdheShyZXN0QXBpLCB7XG4gICAgZGVhZExldHRlclF1ZXVlOiBxdWV1ZSxcbiAgfSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgIFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICAgIEFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG5ld1Rlc3RSZXN0QXBpKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgc3VmZml4ID0gJycpIHtcbiAgY29uc3QgbGFtYmRhRnVuY3RpbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc2NvcGUsIGBNeUxhbWJkYSR7c3VmZml4fWAsIHtcbiAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgIGhhbmRsZXI6ICdiYXInLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICB9KTtcbiAgcmV0dXJuIG5ldyBhcGkuTGFtYmRhUmVzdEFwaSggc2NvcGUsIGBNeUxhbWJkYVJlc3RBcGkke3N1ZmZpeH1gLCB7XG4gICAgaGFuZGxlcjogbGFtYmRhRnVuY3RpbixcbiAgfSApO1xufVxuIl19