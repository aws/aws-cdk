import { expect, haveResource } from '@aws-cdk/assert';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as stepfunctions from '../lib';

export = {
    'Instantiate Default State Machine'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.StateMachine(stack, 'MyStateMachine', {
            stateMachineName: "MyStateMachine",
            definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass'))
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            StateMachineName: "MyStateMachine",
            DefinitionString: "{\"StartAt\":\"Pass\",\"States\":{\"Pass\":{\"Type\":\"Pass\",\"End\":true}}}"
        }));

        test.done();
    },

    'Instantiate Standard State Machine'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.StateMachine(stack, 'MyStateMachine', {
            stateMachineName: "MyStateMachine",
            definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass')),
            stateMachineType: stepfunctions.StateMachineType.STANDARD
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            StateMachineName: "MyStateMachine",
            StateMachineType: "STANDARD",
            DefinitionString: "{\"StartAt\":\"Pass\",\"States\":{\"Pass\":{\"Type\":\"Pass\",\"End\":true}}}"
        }));

        test.done();
    },

    'Instantiate Express State Machine'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.StateMachine(stack, 'MyStateMachine', {
            stateMachineName: "MyStateMachine",
            definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass')),
            stateMachineType: stepfunctions.StateMachineType.EXPRESS
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            StateMachineName: "MyStateMachine",
            StateMachineType: "EXPRESS",
            DefinitionString: "{\"StartAt\":\"Pass\",\"States\":{\"Pass\":{\"Type\":\"Pass\",\"End\":true}}}"
        }));

        test.done();
    },

    'log configuration'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const logGroup = new logs.LogGroup(stack, 'MyLogGroup');

        new stepfunctions.StateMachine(stack, 'MyStateMachine', {
            definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass')),
            logs: {
              destination: logGroup,
              level: stepfunctions.LogLevel.FATAL,
              includeExecutionData: false
            }
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
            LoggingConfiguration: {
                Destinations: [{
                    CloudWatchLogsLogGroup: {
                        LogGroupArn: {
                            'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn']
                        }
                    }
                }],
                IncludeExecutionData: false,
                Level: 'FATAL'
            }
        }));

        expect(stack).to(haveResource('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [{
                    Action: [
                        'logs:CreateLogDelivery',
                        'logs:GetLogDelivery',
                        'logs:UpdateLogDelivery',
                        'logs:DeleteLogDelivery',
                        'logs:ListLogDeliveries',
                        'logs:PutResourcePolicy',
                        'logs:DescribeResourcePolicies',
                        'logs:DescribeLogGroups'
                    ],
                    Effect: 'Allow',
                    Resource: '*'
                }],
                Version: '2012-10-17'
            },
            PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
            Roles: [
                {
                    Ref: 'MyStateMachineRoleD59FFEBC'
                }
            ]
        }));

        test.done();
    },
};
