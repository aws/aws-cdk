"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const targets = require("../../lib");
test('Use EventBus as an event rule target', () => {
    const stack = new core_1.Stack();
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(1 min)'),
    });
    rule.addTarget(new targets.EventBus(events.EventBus.fromEventBusArn(stack, 'External', 'arn:aws:events:us-east-1:111111111111:default')));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: 'arn:aws:events:us-east-1:111111111111:default',
                Id: 'Target0',
                RoleArn: {
                    'Fn::GetAtt': [
                        'RuleEventsRoleC51A4248',
                        'Arn',
                    ],
                },
            },
        ],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [{
                    Effect: 'Allow',
                    Action: 'events:PutEvents',
                    Resource: 'arn:aws:events:us-east-1:111111111111:default',
                }],
            Version: '2012-10-17',
        },
        Roles: [{
                Ref: 'RuleEventsRoleC51A4248',
            }],
    });
});
test('with supplied role', () => {
    const stack = new core_1.Stack();
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(1 min)'),
    });
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
        roleName: 'GivenRole',
    });
    rule.addTarget(new targets.EventBus(events.EventBus.fromEventBusArn(stack, 'External', 'arn:aws:events:us-east-1:123456789012:default'), { role }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [{
                Arn: 'arn:aws:events:us-east-1:123456789012:default',
                Id: 'Target0',
                RoleArn: {
                    'Fn::GetAtt': [
                        'Role1ABCC5F0',
                        'Arn',
                    ],
                },
            }],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [{
                    Effect: 'Allow',
                    Action: 'events:PutEvents',
                    Resource: 'arn:aws:events:us-east-1:123456789012:default',
                }],
            Version: '2012-10-17',
        },
        Roles: [{
                Ref: 'Role1ABCC5F0',
            }],
    });
});
test('with a Dead Letter Queue specified', () => {
    const stack = new core_1.Stack();
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(1 min)'),
    });
    const queue = new sqs.Queue(stack, 'Queue');
    rule.addTarget(new targets.EventBus(events.EventBus.fromEventBusArn(stack, 'External', 'arn:aws:events:us-east-1:123456789012:default'), { deadLetterQueue: queue }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [{
                Arn: 'arn:aws:events:us-east-1:123456789012:default',
                Id: 'Target0',
                RoleArn: {
                    'Fn::GetAtt': [
                        'RuleEventsRoleC51A4248',
                        'Arn',
                    ],
                },
                DeadLetterConfig: {
                    Arn: {
                        'Fn::GetAtt': [
                            'Queue4A7E3555',
                            'Arn',
                        ],
                    },
                },
            }],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'sqs:SendMessage',
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': {
                                'Fn::GetAtt': [
                                    'Rule4C995B7F',
                                    'Arn',
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        Service: 'events.amazonaws.com',
                    },
                    Resource: {
                        'Fn::GetAtt': [
                            'Queue4A7E3555',
                            'Arn',
                        ],
                    },
                    Sid: 'AllowEventRuleRule',
                },
            ],
            Version: '2012-10-17',
        },
        Queues: [
            {
                Ref: 'Queue4A7E3555',
            },
        ],
    });
});
test('event buses are correctly added to the rule\'s principal policy', () => {
    const stack = new core_1.Stack();
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(1 min)'),
    });
    const bus1 = new events.EventBus(stack, 'bus' + 1);
    const bus2 = new events.EventBus(stack, 'bus' + 2);
    rule.addTarget(new targets.EventBus(bus1));
    rule.addTarget(new targets.EventBus(bus2));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'bus110C385DC',
                        'Arn',
                    ],
                },
                Id: 'Target0',
                RoleArn: {
                    'Fn::GetAtt': [
                        'RuleEventsRoleC51A4248',
                        'Arn',
                    ],
                },
            },
            {
                Arn: {
                    'Fn::GetAtt': [
                        'bus22D01F126',
                        'Arn',
                    ],
                },
                Id: 'Target1',
                RoleArn: {
                    'Fn::GetAtt': [
                        'RuleEventsRoleC51A4248',
                        'Arn',
                    ],
                },
            },
        ],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Action: 'events:PutEvents',
                    Resource: {
                        'Fn::GetAtt': [
                            'bus110C385DC',
                            'Arn',
                        ],
                    },
                },
                {
                    Effect: 'Allow',
                    Action: 'events:PutEvents',
                    Resource: {
                        'Fn::GetAtt': [
                            'bus22D01F126',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
        Roles: [{
                Ref: 'RuleEventsRoleC51A4248',
            }],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtcnVsZS10YXJnZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LXJ1bGUtdGFyZ2V0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQXNDO0FBQ3RDLHFDQUFxQztBQUVyQyxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO0lBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDMUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztLQUNwRCxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FDakUsS0FBSyxFQUNMLFVBQVUsRUFDViwrQ0FBK0MsQ0FDaEQsQ0FDQSxDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtRQUNuRSxPQUFPLEVBQUU7WUFDUDtnQkFDRSxHQUFHLEVBQUUsK0NBQStDO2dCQUNwRCxFQUFFLEVBQUUsU0FBUztnQkFDYixPQUFPLEVBQUU7b0JBQ1AsWUFBWSxFQUFFO3dCQUNaLHdCQUF3Qjt3QkFDeEIsS0FBSztxQkFDTjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtRQUNsRSxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUUsQ0FBQztvQkFDVixNQUFNLEVBQUUsT0FBTztv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QUFRLEVBQUU7d0JBQ1IsWUFBWSxFQUFFOzRCQUNaLGNBQWM7NEJBQ2QsS0FBSzt5QkFDTjtxQkFDRjtpQkFDRjtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsT0FBTztvQkFDZixNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixRQUFRLEVBQUU7d0JBQ1IsWUFBWSxFQUFFOzRCQUNaLGNBQWM7NEJBQ2QsS0FBSzt5QkFDTjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsT0FBTyxFQUFFLFlBQVk7U0FDdEI7UUFDRCxLQUFLLEVBQUUsQ0FBQztnQkFDTixHQUFHLEVBQUUsd0JBQXdCO2FBQzlCLENBQUM7S0FDSCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnQGF3cy1jZGsvYXdzLXNxcyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICcuLi8uLi9saWInO1xuXG50ZXN0KCdVc2UgRXZlbnRCdXMgYXMgYW4gZXZlbnQgcnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRXZlbnRCdXMoZXZlbnRzLkV2ZW50QnVzLmZyb21FdmVudEJ1c0FybihcbiAgICBzdGFjayxcbiAgICAnRXh0ZXJuYWwnLFxuICAgICdhcm46YXdzOmV2ZW50czp1cy1lYXN0LTE6MTExMTExMTExMTExOmRlZmF1bHQnLFxuICApLFxuICApKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46ICdhcm46YXdzOmV2ZW50czp1cy1lYXN0LTE6MTExMTExMTExMTExOmRlZmF1bHQnLFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnUnVsZUV2ZW50c1JvbGVDNTFBNDI0OCcsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBBY3Rpb246ICdldmVudHM6UHV0RXZlbnRzJyxcbiAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOmV2ZW50czp1cy1lYXN0LTE6MTExMTExMTExMTExOmRlZmF1bHQnLFxuICAgICAgfV0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgICBSb2xlczogW3tcbiAgICAgIFJlZjogJ1J1bGVFdmVudHNSb2xlQzUxQTQyNDgnLFxuICAgIH1dLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd3aXRoIHN1cHBsaWVkIHJvbGUnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdldmVudHMuYW1hem9uYXdzLmNvbScpLFxuICAgIHJvbGVOYW1lOiAnR2l2ZW5Sb2xlJyxcbiAgfSk7XG5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRXZlbnRCdXMoXG4gICAgZXZlbnRzLkV2ZW50QnVzLmZyb21FdmVudEJ1c0FybihcbiAgICAgIHN0YWNrLFxuICAgICAgJ0V4dGVybmFsJyxcbiAgICAgICdhcm46YXdzOmV2ZW50czp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmRlZmF1bHQnLFxuICAgICksXG4gICAgeyByb2xlIH0sXG4gICkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbe1xuICAgICAgQXJuOiAnYXJuOmF3czpldmVudHM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpkZWZhdWx0JyxcbiAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICBSb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdSb2xlMUFCQ0M1RjAnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9XSxcbiAgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgQWN0aW9uOiAnZXZlbnRzOlB1dEV2ZW50cycsXG4gICAgICAgIFJlc291cmNlOiAnYXJuOmF3czpldmVudHM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpkZWZhdWx0JyxcbiAgICAgIH1dLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gICAgUm9sZXM6IFt7XG4gICAgICBSZWY6ICdSb2xlMUFCQ0M1RjAnLFxuICAgIH1dLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd3aXRoIGEgRGVhZCBMZXR0ZXIgUXVldWUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW4pJyksXG4gIH0pO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScpO1xuXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkV2ZW50QnVzKFxuICAgIGV2ZW50cy5FdmVudEJ1cy5mcm9tRXZlbnRCdXNBcm4oXG4gICAgICBzdGFjayxcbiAgICAgICdFeHRlcm5hbCcsXG4gICAgICAnYXJuOmF3czpldmVudHM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpkZWZhdWx0JyxcbiAgICApLFxuICAgIHsgZGVhZExldHRlclF1ZXVlOiBxdWV1ZSB9LFxuICApKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW3tcbiAgICAgIEFybjogJ2Fybjphd3M6ZXZlbnRzOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZGVmYXVsdCcsXG4gICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgUm9sZUFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnUnVsZUV2ZW50c1JvbGVDNTFBNDI0OCcsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlUG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICBBcm5FcXVhbHM6IHtcbiAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnUnVsZTRDOTk1QjdGJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgU2VydmljZTogJ2V2ZW50cy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1F1ZXVlNEE3RTM1NTUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTaWQ6ICdBbGxvd0V2ZW50UnVsZVJ1bGUnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICAgIFF1ZXVlczogW1xuICAgICAge1xuICAgICAgICBSZWY6ICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnZXZlbnQgYnVzZXMgYXJlIGNvcnJlY3RseSBhZGRlZCB0byB0aGUgcnVsZVxcJ3MgcHJpbmNpcGFsIHBvbGljeScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICBjb25zdCBidXMxID0gbmV3IGV2ZW50cy5FdmVudEJ1cyhzdGFjaywgJ2J1cycgKyAxKTtcbiAgY29uc3QgYnVzMiA9IG5ldyBldmVudHMuRXZlbnRCdXMoc3RhY2ssICdidXMnICsgMik7XG5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRXZlbnRCdXMoYnVzMSkpO1xuICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5FdmVudEJ1cyhidXMyKSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgIFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnYnVzMTEwQzM4NURDJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdSdWxlRXZlbnRzUm9sZUM1MUE0MjQ4JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdidXMyMkQwMUYxMjYnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQxJyxcbiAgICAgICAgUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1J1bGVFdmVudHNSb2xlQzUxQTQyNDgnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBBY3Rpb246ICdldmVudHM6UHV0RXZlbnRzJyxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdidXMxMTBDMzg1REMnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBBY3Rpb246ICdldmVudHM6UHV0RXZlbnRzJyxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdidXMyMkQwMUYxMjYnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgICBSb2xlczogW3tcbiAgICAgIFJlZjogJ1J1bGVFdmVudHNSb2xlQzUxQTQyNDgnLFxuICAgIH1dLFxuICB9KTtcbn0pO1xuIl19