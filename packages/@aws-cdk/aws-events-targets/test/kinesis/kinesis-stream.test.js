"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const events = require("@aws-cdk/aws-events");
const kinesis = require("@aws-cdk/aws-kinesis");
const core_1 = require("@aws-cdk/core");
const targets = require("../../lib");
describe('KinesisStream event target', () => {
    let stack;
    let stream;
    let streamArn;
    beforeEach(() => {
        stack = new core_1.Stack();
        stream = new kinesis.Stream(stack, 'MyStream');
        streamArn = { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] };
    });
    describe('when added to an event rule as a target', () => {
        let rule;
        beforeEach(() => {
            rule = new events.Rule(stack, 'rule', {
                schedule: events.Schedule.expression('rate(1 minute)'),
            });
        });
        describe('with default settings', () => {
            beforeEach(() => {
                rule.addTarget(new targets.KinesisStream(stream));
            });
            test("adds the stream's ARN and role to the targets of the rule", () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                    Targets: [
                        {
                            Arn: streamArn,
                            Id: 'Target0',
                            RoleArn: { 'Fn::GetAtt': ['MyStreamEventsRole5B6CC6AF', 'Arn'] },
                        },
                    ],
                });
            });
            test("creates a policy that has PutRecord and PutRecords permissions on the stream's ARN", () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: ['kinesis:PutRecord', 'kinesis:PutRecords'],
                                Effect: 'Allow',
                                Resource: streamArn,
                            },
                        ],
                        Version: '2012-10-17',
                    },
                });
            });
        });
        describe('with an explicit partition key path', () => {
            beforeEach(() => {
                rule.addTarget(new targets.KinesisStream(stream, {
                    partitionKeyPath: events.EventField.eventId,
                }));
            });
            test('sets the partition key path', () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                    Targets: [
                        {
                            Arn: streamArn,
                            Id: 'Target0',
                            RoleArn: { 'Fn::GetAtt': ['MyStreamEventsRole5B6CC6AF', 'Arn'] },
                            KinesisParameters: {
                                PartitionKeyPath: '$.id',
                            },
                        },
                    ],
                });
            });
        });
        describe('with an explicit message', () => {
            beforeEach(() => {
                rule.addTarget(new targets.KinesisStream(stream, {
                    message: events.RuleTargetInput.fromText('fooBar'),
                }));
            });
            test('sets the input', () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                    Targets: [
                        {
                            Arn: streamArn,
                            Id: 'Target0',
                            Input: '"fooBar"',
                        },
                    ],
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1zdHJlYW0udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImtpbmVzaXMtc3RyZWFtLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOENBQThDO0FBQzlDLGdEQUFnRDtBQUNoRCx3Q0FBc0M7QUFDdEMscUNBQXFDO0FBRXJDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7SUFDMUMsSUFBSSxLQUFZLENBQUM7SUFDakIsSUFBSSxNQUFzQixDQUFDO0lBQzNCLElBQUksU0FBYyxDQUFDO0lBRW5CLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUNwQixNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMvQyxTQUFTLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtRQUN2RCxJQUFJLElBQWlCLENBQUM7UUFFdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDcEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO2FBQ3ZELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtZQUNyQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsMkRBQTJELEVBQUUsR0FBRyxFQUFFO2dCQUNyRSxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtvQkFDbkUsT0FBTyxFQUFFO3dCQUNQOzRCQUNFLEdBQUcsRUFBRSxTQUFTOzRCQUNkLEVBQUUsRUFBRSxTQUFTOzRCQUNiLE9BQU8sRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxFQUFFO3lCQUNqRTtxQkFDRjtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxvRkFBb0YsRUFBRSxHQUFHLEVBQUU7Z0JBQzlGLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO29CQUNsRSxjQUFjLEVBQUU7d0JBQ2QsU0FBUyxFQUFFOzRCQUNUO2dDQUNFLE1BQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLG9CQUFvQixDQUFDO2dDQUNuRCxNQUFNLEVBQUUsT0FBTztnQ0FDZixRQUFRLEVBQUUsU0FBUzs2QkFDcEI7eUJBQ0Y7d0JBQ0QsT0FBTyxFQUFFLFlBQVk7cUJBQ3RCO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO29CQUMvQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU87aUJBQzVDLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO2dCQUN2QyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtvQkFDbkUsT0FBTyxFQUFFO3dCQUNQOzRCQUNFLEdBQUcsRUFBRSxTQUFTOzRCQUNkLEVBQUUsRUFBRSxTQUFTOzRCQUNiLE9BQU8sRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxFQUFFOzRCQUNoRSxpQkFBaUIsRUFBRTtnQ0FDakIsZ0JBQWdCLEVBQUUsTUFBTTs2QkFDekI7eUJBQ0Y7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDeEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7b0JBQy9DLE9BQU8sRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7aUJBQ25ELENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO2dCQUMxQixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtvQkFDbkUsT0FBTyxFQUFFO3dCQUNQOzRCQUNFLEdBQUcsRUFBRSxTQUFTOzRCQUNkLEVBQUUsRUFBRSxTQUFTOzRCQUNiLEtBQUssRUFBRSxVQUFVO3lCQUNsQjtxQkFDRjtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBraW5lc2lzIGZyb20gJ0Bhd3MtY2RrL2F3cy1raW5lc2lzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJy4uLy4uL2xpYic7XG5cbmRlc2NyaWJlKCdLaW5lc2lzU3RyZWFtIGV2ZW50IHRhcmdldCcsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBTdGFjaztcbiAgbGV0IHN0cmVhbToga2luZXNpcy5TdHJlYW07XG4gIGxldCBzdHJlYW1Bcm46IGFueTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHN0cmVhbSA9IG5ldyBraW5lc2lzLlN0cmVhbShzdGFjaywgJ015U3RyZWFtJyk7XG4gICAgc3RyZWFtQXJuID0geyAnRm46OkdldEF0dCc6IFsnTXlTdHJlYW01QzA1MEU5MycsICdBcm4nXSB9O1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBhZGRlZCB0byBhbiBldmVudCBydWxlIGFzIGEgdGFyZ2V0JywgKCkgPT4ge1xuICAgIGxldCBydWxlOiBldmVudHMuUnVsZTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ3J1bGUnLCB7XG4gICAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbnV0ZSknKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggZGVmYXVsdCBzZXR0aW5ncycsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5LaW5lc2lzU3RyZWFtKHN0cmVhbSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJhZGRzIHRoZSBzdHJlYW0ncyBBUk4gYW5kIHJvbGUgdG8gdGhlIHRhcmdldHMgb2YgdGhlIHJ1bGVcIiwgKCkgPT4ge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBcm46IHN0cmVhbUFybixcbiAgICAgICAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlTdHJlYW1FdmVudHNSb2xlNUI2Q0M2QUYnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdChcImNyZWF0ZXMgYSBwb2xpY3kgdGhhdCBoYXMgUHV0UmVjb3JkIGFuZCBQdXRSZWNvcmRzIHBlcm1pc3Npb25zIG9uIHRoZSBzdHJlYW0ncyBBUk5cIiwgKCkgPT4ge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3Rpb246IFsna2luZXNpczpQdXRSZWNvcmQnLCAna2luZXNpczpQdXRSZWNvcmRzJ10sXG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiBzdHJlYW1Bcm4sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBhbiBleHBsaWNpdCBwYXJ0aXRpb24ga2V5IHBhdGgnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuS2luZXNpc1N0cmVhbShzdHJlYW0sIHtcbiAgICAgICAgICBwYXJ0aXRpb25LZXlQYXRoOiBldmVudHMuRXZlbnRGaWVsZC5ldmVudElkLFxuICAgICAgICB9KSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnc2V0cyB0aGUgcGFydGl0aW9uIGtleSBwYXRoJywgKCkgPT4ge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBcm46IHN0cmVhbUFybixcbiAgICAgICAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlTdHJlYW1FdmVudHNSb2xlNUI2Q0M2QUYnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgS2luZXNpc1BhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICBQYXJ0aXRpb25LZXlQYXRoOiAnJC5pZCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBhbiBleHBsaWNpdCBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLktpbmVzaXNTdHJlYW0oc3RyZWFtLCB7XG4gICAgICAgICAgbWVzc2FnZTogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dC5mcm9tVGV4dCgnZm9vQmFyJyksXG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdzZXRzIHRoZSBpbnB1dCcsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQXJuOiBzdHJlYW1Bcm4sXG4gICAgICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgICAgIElucHV0OiAnXCJmb29CYXJcIicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=