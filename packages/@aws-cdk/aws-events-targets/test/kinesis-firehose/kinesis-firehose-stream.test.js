"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const events = require("@aws-cdk/aws-events");
const firehose = require("@aws-cdk/aws-kinesisfirehose");
const core_1 = require("@aws-cdk/core");
const targets = require("../../lib");
describe('KinesisFirehoseStream event target', () => {
    let stack;
    let stream;
    let streamArn;
    beforeEach(() => {
        stack = new core_1.Stack();
        stream = new firehose.CfnDeliveryStream(stack, 'MyStream');
        streamArn = { 'Fn::GetAtt': ['MyStream', 'Arn'] };
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
                rule.addTarget(new targets.KinesisFirehoseStream(stream));
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
                                Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
                                Effect: 'Allow',
                                Resource: streamArn,
                            },
                        ],
                        Version: '2012-10-17',
                    },
                });
            });
        });
        describe('with an explicit message', () => {
            beforeEach(() => {
                rule.addTarget(new targets.KinesisFirehoseStream(stream, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1maXJlaG9zZS1zdHJlYW0udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImtpbmVzaXMtZmlyZWhvc2Utc3RyZWFtLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOENBQThDO0FBQzlDLHlEQUF5RDtBQUN6RCx3Q0FBc0M7QUFDdEMscUNBQXFDO0FBRXJDLFFBQVEsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7SUFDbEQsSUFBSSxLQUFZLENBQUM7SUFDakIsSUFBSSxNQUFrQyxDQUFDO0lBQ3ZDLElBQUksU0FBYyxDQUFDO0lBRW5CLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUNwQixNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNELFNBQVMsR0FBRyxFQUFFLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtRQUN2RCxJQUFJLElBQWlCLENBQUM7UUFFdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDcEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO2FBQ3ZELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtZQUNyQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO29CQUNuRSxPQUFPLEVBQUU7d0JBQ1A7NEJBQ0UsR0FBRyxFQUFFLFNBQVM7NEJBQ2QsRUFBRSxFQUFFLFNBQVM7NEJBQ2IsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLEVBQUU7eUJBQ2pFO3FCQUNGO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLG9GQUFvRixFQUFFLEdBQUcsRUFBRTtnQkFDOUYscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUU7b0JBQ2xFLGNBQWMsRUFBRTt3QkFDZCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLENBQUMsb0JBQW9CLEVBQUUseUJBQXlCLENBQUM7Z0NBQ3pELE1BQU0sRUFBRSxPQUFPO2dDQUNmLFFBQVEsRUFBRSxTQUFTOzZCQUNwQjt5QkFDRjt3QkFDRCxPQUFPLEVBQUUsWUFBWTtxQkFDdEI7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDeEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRTtvQkFDdkQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDbkQsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7Z0JBQzFCLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO29CQUNuRSxPQUFPLEVBQUU7d0JBQ1A7NEJBQ0UsR0FBRyxFQUFFLFNBQVM7NEJBQ2QsRUFBRSxFQUFFLFNBQVM7NEJBQ2IsS0FBSyxFQUFFLFVBQVU7eUJBQ2xCO3FCQUNGO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGZpcmVob3NlIGZyb20gJ0Bhd3MtY2RrL2F3cy1raW5lc2lzZmlyZWhvc2UnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ0tpbmVzaXNGaXJlaG9zZVN0cmVhbSBldmVudCB0YXJnZXQnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogU3RhY2s7XG4gIGxldCBzdHJlYW06IGZpcmVob3NlLkNmbkRlbGl2ZXJ5U3RyZWFtO1xuICBsZXQgc3RyZWFtQXJuOiBhbnk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBzdHJlYW0gPSBuZXcgZmlyZWhvc2UuQ2ZuRGVsaXZlcnlTdHJlYW0oc3RhY2ssICdNeVN0cmVhbScpO1xuICAgIHN0cmVhbUFybiA9IHsgJ0ZuOjpHZXRBdHQnOiBbJ015U3RyZWFtJywgJ0FybiddIH07XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGFkZGVkIHRvIGFuIGV2ZW50IHJ1bGUgYXMgYSB0YXJnZXQnLCAoKSA9PiB7XG4gICAgbGV0IHJ1bGU6IGV2ZW50cy5SdWxlO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAncnVsZScsIHtcbiAgICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWludXRlKScpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBkZWZhdWx0IHNldHRpbmdzJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLktpbmVzaXNGaXJlaG9zZVN0cmVhbShzdHJlYW0pKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KFwiYWRkcyB0aGUgc3RyZWFtJ3MgQVJOIGFuZCByb2xlIHRvIHRoZSB0YXJnZXRzIG9mIHRoZSBydWxlXCIsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQXJuOiBzdHJlYW1Bcm4sXG4gICAgICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015U3RyZWFtRXZlbnRzUm9sZTVCNkNDNkFGJywgJ0FybiddIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJjcmVhdGVzIGEgcG9saWN5IHRoYXQgaGFzIFB1dFJlY29yZCBhbmQgUHV0UmVjb3JkcyBwZXJtaXNzaW9ucyBvbiB0aGUgc3RyZWFtJ3MgQVJOXCIsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiBbJ2ZpcmVob3NlOlB1dFJlY29yZCcsICdmaXJlaG9zZTpQdXRSZWNvcmRCYXRjaCddLFxuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogc3RyZWFtQXJuLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYW4gZXhwbGljaXQgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5LaW5lc2lzRmlyZWhvc2VTdHJlYW0oc3RyZWFtLCB7XG4gICAgICAgICAgbWVzc2FnZTogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dC5mcm9tVGV4dCgnZm9vQmFyJyksXG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdzZXRzIHRoZSBpbnB1dCcsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQXJuOiBzdHJlYW1Bcm4sXG4gICAgICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgICAgIElucHV0OiAnXCJmb29CYXJcIicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=