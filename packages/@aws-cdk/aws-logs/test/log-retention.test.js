"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
describe('log retention', () => {
    test('log retention construct', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_MONTH,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'logs:PutRetentionPolicy',
                            'logs:DeleteRetentionPolicy',
                        ],
                        'Effect': 'Allow',
                        'Resource': '*',
                    },
                ],
                'Version': '2012-10-17',
            },
            'PolicyName': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
            'Roles': [
                {
                    'Ref': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.handler',
            Runtime: 'nodejs14.x',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            'ServiceToken': {
                'Fn::GetAtt': [
                    'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                    'Arn',
                ],
            },
            'LogGroupName': 'group',
            'RetentionInDays': 30,
        });
    });
    test('set the removalPolicy to DESTROY', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_DAY,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'logs:PutRetentionPolicy',
                            'logs:DeleteRetentionPolicy',
                        ],
                        'Effect': 'Allow',
                        'Resource': '*',
                    },
                    {
                        'Action': 'logs:DeleteLogGroup',
                        'Effect': 'Allow',
                        'Resource': {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        'Ref': 'AWS::Partition',
                                    },
                                    ':logs:',
                                    {
                                        'Ref': 'AWS::Region',
                                    },
                                    ':',
                                    {
                                        'Ref': 'AWS::AccountId',
                                    },
                                    ':log-group:group:*',
                                ],
                            ],
                        },
                    },
                ],
                'Version': '2012-10-17',
            },
            'PolicyName': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
            'Roles': [
                {
                    'Ref': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            'ServiceToken': {
                'Fn::GetAtt': [
                    'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                    'Arn',
                ],
            },
            'LogGroupName': 'group',
            'RetentionInDays': 1,
            'RemovalPolicy': 'destroy',
        });
    });
    test('set the removalPolicy to RETAIN', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_DAY,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'logs:PutRetentionPolicy',
                            'logs:DeleteRetentionPolicy',
                        ],
                        'Effect': 'Allow',
                        'Resource': '*',
                    },
                ],
                'Version': '2012-10-17',
            },
            'PolicyName': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
            'Roles': [
                {
                    'Ref': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            'ServiceToken': {
                'Fn::GetAtt': [
                    'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                    'Arn',
                ],
            },
            'LogGroupName': 'group',
            'RetentionInDays': 1,
            'RemovalPolicy': 'retain',
        });
    });
    describe('multiple log retention resources', () => {
        test('both removalPolicy DESTROY', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new lib_1.LogRetention(stack, 'MyLambda1', {
                logGroupName: 'group1',
                retention: lib_1.RetentionDays.ONE_DAY,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
            new lib_1.LogRetention(stack, 'MyLambda2', {
                logGroupName: 'group2',
                retention: lib_1.RetentionDays.ONE_DAY,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': [
                        {
                            'Action': [
                                'logs:PutRetentionPolicy',
                                'logs:DeleteRetentionPolicy',
                            ],
                            'Effect': 'Allow',
                            'Resource': '*',
                        },
                        {
                            'Action': 'logs:DeleteLogGroup',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            'Ref': 'AWS::Partition',
                                        },
                                        ':logs:',
                                        {
                                            'Ref': 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            'Ref': 'AWS::AccountId',
                                        },
                                        ':log-group:group1:*',
                                    ],
                                ],
                            },
                        },
                        {
                            'Action': 'logs:DeleteLogGroup',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            'Ref': 'AWS::Partition',
                                        },
                                        ':logs:',
                                        {
                                            'Ref': 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            'Ref': 'AWS::AccountId',
                                        },
                                        ':log-group:group2:*',
                                    ],
                                ],
                            },
                        },
                    ],
                    'Version': '2012-10-17',
                },
                'PolicyName': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'Roles': [
                    {
                        'Ref': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
                'ServiceToken': {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                        'Arn',
                    ],
                },
                'LogGroupName': 'group1',
                'RetentionInDays': 1,
                'RemovalPolicy': 'destroy',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
                'ServiceToken': {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                        'Arn',
                    ],
                },
                'LogGroupName': 'group2',
                'RetentionInDays': 1,
                'RemovalPolicy': 'destroy',
            });
        });
        test('with removalPolicy DESTROY and removalPolicy RETAIN', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new lib_1.LogRetention(stack, 'MyLambda1', {
                logGroupName: 'group1',
                retention: lib_1.RetentionDays.ONE_DAY,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
            new lib_1.LogRetention(stack, 'MyLambda2', {
                logGroupName: 'group2',
                retention: lib_1.RetentionDays.ONE_DAY,
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': [
                        {
                            'Action': [
                                'logs:PutRetentionPolicy',
                                'logs:DeleteRetentionPolicy',
                            ],
                            'Effect': 'Allow',
                            'Resource': '*',
                        },
                        {
                            'Action': 'logs:DeleteLogGroup',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            'Ref': 'AWS::Partition',
                                        },
                                        ':logs:',
                                        {
                                            'Ref': 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            'Ref': 'AWS::AccountId',
                                        },
                                        ':log-group:group1:*',
                                    ],
                                ],
                            },
                        },
                    ],
                    'Version': '2012-10-17',
                },
                'PolicyName': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'Roles': [
                    {
                        'Ref': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
                'ServiceToken': {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                        'Arn',
                    ],
                },
                'LogGroupName': 'group1',
                'RetentionInDays': 1,
                'RemovalPolicy': 'destroy',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
                'ServiceToken': {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                        'Arn',
                    ],
                },
                'LogGroupName': 'group2',
                'RetentionInDays': 1,
                'RemovalPolicy': 'retain',
            });
        });
    });
    test('the removalPolicy is not set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_DAY,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            'ServiceToken': {
                'Fn::GetAtt': [
                    'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                    'Arn',
                ],
            },
            'LogGroupName': 'group',
            'RetentionInDays': 1,
        });
    });
    test('with imported role', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/CoolRole');
        // WHEN
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_MONTH,
            role,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'logs:PutRetentionPolicy',
                            'logs:DeleteRetentionPolicy',
                        ],
                        'Effect': 'Allow',
                        'Resource': '*',
                    },
                ],
                'Version': '2012-10-17',
            },
            'PolicyName': 'RolePolicy72E7D967',
            'Roles': [
                'CoolRole',
            ],
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    });
    test('with RetentionPeriod set to Infinity', () => {
        const stack = new cdk.Stack();
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.INFINITE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            RetentionInDays: assertions_1.Match.absent(),
        });
    });
    test('with LogGroupRegion specified', () => {
        const stack = new cdk.Stack();
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            logGroupRegion: 'us-east-1',
            retention: lib_1.RetentionDays.INFINITE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            LogGroupRegion: 'us-east-1',
        });
    });
    test('log group ARN is well formed and conforms', () => {
        const stack = new cdk.Stack();
        const group = new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_MONTH,
        });
        const logGroupArn = group.logGroupArn;
        expect(logGroupArn.indexOf('logs')).toBeGreaterThan(-1);
        expect(logGroupArn.indexOf('log-group')).toBeGreaterThan(-1);
        expect(logGroupArn.endsWith(':*')).toEqual(true);
    });
    test('log group ARN is well formed and conforms when region is specified', () => {
        const stack = new cdk.Stack();
        const group = new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            logGroupRegion: 'us-west-2',
            retention: lib_1.RetentionDays.ONE_MONTH,
        });
        const logGroupArn = group.logGroupArn;
        expect(logGroupArn.indexOf('us-west-2')).toBeGreaterThan(-1);
        expect(logGroupArn.indexOf('logs')).toBeGreaterThan(-1);
        expect(logGroupArn.indexOf('log-group')).toBeGreaterThan(-1);
        expect(logGroupArn.endsWith(':*')).toEqual(true);
    });
    test('retention Lambda CfnResource receives propagated tags', () => {
        const stack = new cdk.Stack();
        cdk.Tags.of(stack).add('test-key', 'test-value');
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_MONTH,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Tags: [
                {
                    Key: 'test-key',
                    Value: 'test-value',
                },
            ],
        });
    });
    test('asset metadata added to log retention construct lambda function', () => {
        // GIVEN
        const stack = new cdk.Stack();
        stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);
        stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
        const assetLocation = path.join(__dirname, '../', '/lib', '/log-retention-provider');
        // WHEN
        new lib_1.LogRetention(stack, 'MyLambda', {
            logGroupName: 'group',
            retention: lib_1.RetentionDays.ONE_MONTH,
        });
        // Then
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Metadata: {
                'aws:asset:path': assetLocation,
                'aws:asset:is-bundled': false,
                'aws:asset:property': 'Code',
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXJldGVudGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLXJldGVudGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6QyxnQ0FBcUQ7QUFFckQsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxJQUFJLGtCQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUNsQyxZQUFZLEVBQUUsT0FBTztZQUNyQixTQUFTLEVBQUUsbUJBQWEsQ0FBQyxTQUFTO1NBQ25DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxnQkFBZ0IsRUFBRTtnQkFDaEIsV0FBVyxFQUFFO29CQUNYO3dCQUNFLFFBQVEsRUFBRTs0QkFDUix5QkFBeUI7NEJBQ3pCLDRCQUE0Qjt5QkFDN0I7d0JBQ0QsUUFBUSxFQUFFLE9BQU87d0JBQ2pCLFVBQVUsRUFBRSxHQUFHO3FCQUNoQjtpQkFDRjtnQkFDRCxTQUFTLEVBQUUsWUFBWTthQUN4QjtZQUNELFlBQVksRUFBRSw4RUFBOEU7WUFDNUYsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxpRUFBaUU7aUJBQ3pFO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtZQUN2RSxPQUFPLEVBQUUsZUFBZTtZQUN4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QyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlFQUFpRSxFQUFFLEdBQUcsRUFBRTtRQUMzRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNFLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqRSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFFckYsT0FBTztRQUNQLElBQUksa0JBQVksQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ2xDLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFNBQVMsRUFBRSxtQkFBYSxDQUFDLFNBQVM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsRUFBRTtZQUM3RCxRQUFRLEVBQUU7Z0JBQ1IsZ0JBQWdCLEVBQUUsYUFBYTtnQkFDL0Isc0JBQXNCLEVBQUUsS0FBSztnQkFDN0Isb0JBQW9CLEVBQUUsTUFBTTthQUM3QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgTG9nUmV0ZW50aW9uLCBSZXRlbnRpb25EYXlzIH0gZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ2xvZyByZXRlbnRpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ2xvZyByZXRlbnRpb24gY29uc3RydWN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IExvZ1JldGVudGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgbG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgcmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9NT05USCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnbG9nczpQdXRSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgICAnbG9nczpEZWxldGVSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgICdQb2xpY3lOYW1lJzogJ0xvZ1JldGVudGlvbmFhZTBhYTNjNWI0ZDRmODdiMDJkODViMjAxZWZkZDhhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5QUREQTdERUInLFxuICAgICAgJ1JvbGVzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1JlZic6ICdMb2dSZXRlbnRpb25hYWUwYWEzYzViNGQ0Zjg3YjAyZDg1YjIwMWVmZGQ4YVNlcnZpY2VSb2xlOTc0MUVDRkInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBIYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBSdW50aW1lOiAnbm9kZWpzMTQueCcsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLCB7XG4gICAgICAnU2VydmljZVRva2VuJzoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFGRDRCRkM4QScsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ0xvZ0dyb3VwTmFtZSc6ICdncm91cCcsXG4gICAgICAnUmV0ZW50aW9uSW5EYXlzJzogMzAsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NldCB0aGUgcmVtb3ZhbFBvbGljeSB0byBERVNUUk9ZJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IExvZ1JldGVudGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgbG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgcmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9EQVksXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICdsb2dzOlB1dFJldGVudGlvblBvbGljeScsXG4gICAgICAgICAgICAgICdsb2dzOkRlbGV0ZVJldGVudGlvblBvbGljeScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ2xvZ3M6RGVsZXRlTG9nR3JvdXAnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6bG9nLWdyb3VwOmdyb3VwOionLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgICdQb2xpY3lOYW1lJzogJ0xvZ1JldGVudGlvbmFhZTBhYTNjNWI0ZDRmODdiMDJkODViMjAxZWZkZDhhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5QUREQTdERUInLFxuICAgICAgJ1JvbGVzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1JlZic6ICdMb2dSZXRlbnRpb25hYWUwYWEzYzViNGQ0Zjg3YjAyZDg1YjIwMWVmZGQ4YVNlcnZpY2VSb2xlOTc0MUVDRkInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIHtcbiAgICAgICdTZXJ2aWNlVG9rZW4nOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdMb2dSZXRlbnRpb25hYWUwYWEzYzViNGQ0Zjg3YjAyZDg1YjIwMWVmZGQ4YUZENEJGQzhBJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnTG9nR3JvdXBOYW1lJzogJ2dyb3VwJyxcbiAgICAgICdSZXRlbnRpb25JbkRheXMnOiAxLFxuICAgICAgJ1JlbW92YWxQb2xpY3knOiAnZGVzdHJveScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NldCB0aGUgcmVtb3ZhbFBvbGljeSB0byBSRVRBSU4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX0RBWSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnbG9nczpQdXRSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgICAnbG9nczpEZWxldGVSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgICdQb2xpY3lOYW1lJzogJ0xvZ1JldGVudGlvbmFhZTBhYTNjNWI0ZDRmODdiMDJkODViMjAxZWZkZDhhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5QUREQTdERUInLFxuICAgICAgJ1JvbGVzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1JlZic6ICdMb2dSZXRlbnRpb25hYWUwYWEzYzViNGQ0Zjg3YjAyZDg1YjIwMWVmZGQ4YVNlcnZpY2VSb2xlOTc0MUVDRkInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIHtcbiAgICAgICdTZXJ2aWNlVG9rZW4nOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdMb2dSZXRlbnRpb25hYWUwYWEzYzViNGQ0Zjg3YjAyZDg1YjIwMWVmZGQ4YUZENEJGQzhBJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnTG9nR3JvdXBOYW1lJzogJ2dyb3VwJyxcbiAgICAgICdSZXRlbnRpb25JbkRheXMnOiAxLFxuICAgICAgJ1JlbW92YWxQb2xpY3knOiAncmV0YWluJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ211bHRpcGxlIGxvZyByZXRlbnRpb24gcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2JvdGggcmVtb3ZhbFBvbGljeSBERVNUUk9ZJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGExJywge1xuICAgICAgICBsb2dHcm91cE5hbWU6ICdncm91cDEnLFxuICAgICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX0RBWSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEyJywge1xuICAgICAgICBsb2dHcm91cE5hbWU6ICdncm91cDInLFxuICAgICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX0RBWSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2xvZ3M6UHV0UmV0ZW50aW9uUG9saWN5JyxcbiAgICAgICAgICAgICAgICAnbG9nczpEZWxldGVSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdsb2dzOkRlbGV0ZUxvZ0dyb3VwJyxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDpncm91cDE6KicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ2xvZ3M6RGVsZXRlTG9nR3JvdXAnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6bG9nLWdyb3VwOmdyb3VwMjoqJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1BvbGljeU5hbWUnOiAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFTZXJ2aWNlUm9sZURlZmF1bHRQb2xpY3lBRERBN0RFQicsXG4gICAgICAgICdSb2xlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnUmVmJzogJ0xvZ1JldGVudGlvbmFhZTBhYTNjNWI0ZDRmODdiMDJkODViMjAxZWZkZDhhU2VydmljZVJvbGU5NzQxRUNGQicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLCB7XG4gICAgICAgICdTZXJ2aWNlVG9rZW4nOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFGRDRCRkM4QScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAnTG9nR3JvdXBOYW1lJzogJ2dyb3VwMScsXG4gICAgICAgICdSZXRlbnRpb25JbkRheXMnOiAxLFxuICAgICAgICAnUmVtb3ZhbFBvbGljeSc6ICdkZXN0cm95JyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLCB7XG4gICAgICAgICdTZXJ2aWNlVG9rZW4nOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFGRDRCRkM4QScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAnTG9nR3JvdXBOYW1lJzogJ2dyb3VwMicsXG4gICAgICAgICdSZXRlbnRpb25JbkRheXMnOiAxLFxuICAgICAgICAnUmVtb3ZhbFBvbGljeSc6ICdkZXN0cm95JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCByZW1vdmFsUG9saWN5IERFU1RST1kgYW5kIHJlbW92YWxQb2xpY3kgUkVUQUlOJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGExJywge1xuICAgICAgICBsb2dHcm91cE5hbWU6ICdncm91cDEnLFxuICAgICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX0RBWSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEyJywge1xuICAgICAgICBsb2dHcm91cE5hbWU6ICdncm91cDInLFxuICAgICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX0RBWSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuUkVUQUlOLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgICAgICdsb2dzOkRlbGV0ZVJldGVudGlvblBvbGljeScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ2xvZ3M6RGVsZXRlTG9nR3JvdXAnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6bG9nLWdyb3VwOmdyb3VwMToqJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1BvbGljeU5hbWUnOiAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFTZXJ2aWNlUm9sZURlZmF1bHRQb2xpY3lBRERBN0RFQicsXG4gICAgICAgICdSb2xlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnUmVmJzogJ0xvZ1JldGVudGlvbmFhZTBhYTNjNWI0ZDRmODdiMDJkODViMjAxZWZkZDhhU2VydmljZVJvbGU5NzQxRUNGQicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLCB7XG4gICAgICAgICdTZXJ2aWNlVG9rZW4nOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFGRDRCRkM4QScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAnTG9nR3JvdXBOYW1lJzogJ2dyb3VwMScsXG4gICAgICAgICdSZXRlbnRpb25JbkRheXMnOiAxLFxuICAgICAgICAnUmVtb3ZhbFBvbGljeSc6ICdkZXN0cm95JyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLCB7XG4gICAgICAgICdTZXJ2aWNlVG9rZW4nOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFGRDRCRkM4QScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAnTG9nR3JvdXBOYW1lJzogJ2dyb3VwMicsXG4gICAgICAgICdSZXRlbnRpb25JbkRheXMnOiAxLFxuICAgICAgICAnUmVtb3ZhbFBvbGljeSc6ICdyZXRhaW4nLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RoZSByZW1vdmFsUG9saWN5IGlzIG5vdCBzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX0RBWSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLCB7XG4gICAgICAnU2VydmljZVRva2VuJzoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGFGRDRCRkM4QScsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ0xvZ0dyb3VwTmFtZSc6ICdncm91cCcsXG4gICAgICAnUmV0ZW50aW9uSW5EYXlzJzogMSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvQ29vbFJvbGUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgICAgcm9sZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnbG9nczpQdXRSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgICAnbG9nczpEZWxldGVSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgICdQb2xpY3lOYW1lJzogJ1JvbGVQb2xpY3k3MkU3RDk2NycsXG4gICAgICAnUm9sZXMnOiBbXG4gICAgICAgICdDb29sUm9sZScsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggUmV0ZW50aW9uUGVyaW9kIHNldCB0byBJbmZpbml0eScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBMb2dSZXRlbnRpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGxvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgIHJldGVudGlvbjogUmV0ZW50aW9uRGF5cy5JTkZJTklURSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIHtcbiAgICAgIFJldGVudGlvbkluRGF5czogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggTG9nR3JvdXBSZWdpb24gc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBMb2dSZXRlbnRpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGxvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgIGxvZ0dyb3VwUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgIHJldGVudGlvbjogUmV0ZW50aW9uRGF5cy5JTkZJTklURSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIHtcbiAgICAgIExvZ0dyb3VwUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9nIGdyb3VwIEFSTiBpcyB3ZWxsIGZvcm1lZCBhbmQgY29uZm9ybXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgIH0pO1xuXG4gICAgY29uc3QgbG9nR3JvdXBBcm4gPSBncm91cC5sb2dHcm91cEFybjtcbiAgICBleHBlY3QobG9nR3JvdXBBcm4uaW5kZXhPZignbG9ncycpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgIGV4cGVjdChsb2dHcm91cEFybi5pbmRleE9mKCdsb2ctZ3JvdXAnKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICBleHBlY3QobG9nR3JvdXBBcm4uZW5kc1dpdGgoJzoqJykpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZyBncm91cCBBUk4gaXMgd2VsbCBmb3JtZWQgYW5kIGNvbmZvcm1zIHdoZW4gcmVnaW9uIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBncm91cCA9IG5ldyBMb2dSZXRlbnRpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGxvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgIGxvZ0dyb3VwUmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgIHJldGVudGlvbjogUmV0ZW50aW9uRGF5cy5PTkVfTU9OVEgsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsb2dHcm91cEFybiA9IGdyb3VwLmxvZ0dyb3VwQXJuO1xuICAgIGV4cGVjdChsb2dHcm91cEFybi5pbmRleE9mKCd1cy13ZXN0LTInKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICBleHBlY3QobG9nR3JvdXBBcm4uaW5kZXhPZignbG9ncycpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgIGV4cGVjdChsb2dHcm91cEFybi5pbmRleE9mKCdsb2ctZ3JvdXAnKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICBleHBlY3QobG9nR3JvdXBBcm4uZW5kc1dpdGgoJzoqJykpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JldGVudGlvbiBMYW1iZGEgQ2ZuUmVzb3VyY2UgcmVjZWl2ZXMgcHJvcGFnYXRlZCB0YWdzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNkay5UYWdzLm9mKHN0YWNrKS5hZGQoJ3Rlc3Qta2V5JywgJ3Rlc3QtdmFsdWUnKTtcbiAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ3Rlc3Qta2V5JyxcbiAgICAgICAgICBWYWx1ZTogJ3Rlc3QtdmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXNzZXQgbWV0YWRhdGEgYWRkZWQgdG8gbG9nIHJldGVudGlvbiBjb25zdHJ1Y3QgbGFtYmRhIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0VOQUJMRURfQ09OVEVYVCwgdHJ1ZSk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkRJU0FCTEVfQVNTRVRfU1RBR0lOR19DT05URVhULCB0cnVlKTtcblxuICAgIGNvbnN0IGFzc2V0TG9jYXRpb24gPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vJywgJy9saWInLCAnL2xvZy1yZXRlbnRpb24tcHJvdmlkZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTG9nUmV0ZW50aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgIH0pO1xuXG4gICAgLy8gVGhlblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICdhd3M6YXNzZXQ6cGF0aCc6IGFzc2V0TG9jYXRpb24sXG4gICAgICAgICdhd3M6YXNzZXQ6aXMtYnVuZGxlZCc6IGZhbHNlLFxuICAgICAgICAnYXdzOmFzc2V0OnByb3BlcnR5JzogJ0NvZGUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==