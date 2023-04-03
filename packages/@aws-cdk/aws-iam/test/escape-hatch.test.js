"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests for the L1 escape hatches (overrides). those are in the IAM module
// because we want to verify them end-to-end, as a complement to the unit
// tests in the @aws-cdk/core module
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const iam = require("../lib");
/* eslint-disable quote-props */
describe('IAM escape hatches', () => {
    test('addPropertyOverride should allow overriding supported properties', () => {
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'user', {
            userName: 'MyUserName',
        });
        const cfn = user.node.findChild('Resource');
        cfn.addPropertyOverride('UserName', 'OverriddenUserName');
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'user2C2B57AE': {
                    'Type': 'AWS::IAM::User',
                    'Properties': {
                        'UserName': 'OverriddenUserName',
                    },
                },
            },
        });
    });
    test('addPropertyOverrides should allow specifying arbitrary properties', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'user', { userName: 'MyUserName' });
        const cfn = user.node.findChild('Resource');
        // WHEN
        cfn.addPropertyOverride('Hello.World', 'Boom');
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'user2C2B57AE': {
                    'Type': 'AWS::IAM::User',
                    'Properties': {
                        'UserName': 'MyUserName',
                        'Hello': {
                            'World': 'Boom',
                        },
                    },
                },
            },
        });
    });
    test('addOverride should allow overriding properties', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'user', { userName: 'MyUserName' });
        const cfn = user.node.findChild('Resource');
        cfn.cfnOptions.updatePolicy = { useOnlineResharding: true };
        // WHEN
        cfn.addOverride('Properties.Hello.World', 'Bam');
        cfn.addOverride('Properties.UserName', 'HA!');
        cfn.addOverride('Joob.Jab', 'Jib');
        cfn.addOverride('Joob.Jab', 'Jib');
        cfn.addOverride('UpdatePolicy.UseOnlineResharding.Type', 'None');
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'user2C2B57AE': {
                    'Type': 'AWS::IAM::User',
                    'Properties': {
                        'UserName': 'HA!',
                        'Hello': {
                            'World': 'Bam',
                        },
                    },
                    'Joob': {
                        'Jab': 'Jib',
                    },
                    'UpdatePolicy': {
                        'UseOnlineResharding': {
                            'Type': 'None',
                        },
                    },
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNjYXBlLWhhdGNoLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlc2NhcGUtaGF0Y2gudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJFQUEyRTtBQUMzRSx5RUFBeUU7QUFDekUsb0NBQW9DO0FBQ3BDLG9EQUErQztBQUMvQyx3Q0FBc0M7QUFDdEMsOEJBQThCO0FBRTlCLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLElBQUksQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7UUFDNUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUN2QyxRQUFRLEVBQUUsWUFBWTtTQUN2QixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQWdCLENBQUM7UUFDM0QsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBRTFELHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxXQUFXLEVBQUU7Z0JBQ1gsY0FBYyxFQUFFO29CQUNkLE1BQU0sRUFBRSxnQkFBZ0I7b0JBQ3hCLFlBQVksRUFBRTt3QkFDWixVQUFVLEVBQUUsb0JBQW9CO3FCQUNqQztpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFO1FBQzdFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDckUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFnQixDQUFDO1FBRTNELE9BQU87UUFDUCxHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9DLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsV0FBVyxFQUFFO2dCQUNYLGNBQWMsRUFBRTtvQkFDZCxNQUFNLEVBQUUsZ0JBQWdCO29CQUN4QixZQUFZLEVBQUU7d0JBQ1osVUFBVSxFQUFFLFlBQVk7d0JBQ3hCLE9BQU8sRUFBRTs0QkFDUCxPQUFPLEVBQUUsTUFBTTt5QkFDaEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBZ0IsQ0FBQztRQUMzRCxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO1FBRTVELE9BQU87UUFDUCxHQUFHLENBQUMsV0FBVyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxXQUFXLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsR0FBRyxDQUFDLFdBQVcsQ0FBQyx1Q0FBdUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVqRSxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFdBQVcsRUFBRTtnQkFDWCxjQUFjLEVBQUU7b0JBQ2QsTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsWUFBWSxFQUFFO3dCQUNaLFVBQVUsRUFBRSxLQUFLO3dCQUNqQixPQUFPLEVBQUU7NEJBQ1AsT0FBTyxFQUFFLEtBQUs7eUJBQ2Y7cUJBQ0Y7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSxLQUFLO3FCQUNiO29CQUNELGNBQWMsRUFBRTt3QkFDZCxxQkFBcUIsRUFBRTs0QkFDckIsTUFBTSxFQUFFLE1BQU07eUJBQ2Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0ZXN0cyBmb3IgdGhlIEwxIGVzY2FwZSBoYXRjaGVzIChvdmVycmlkZXMpLiB0aG9zZSBhcmUgaW4gdGhlIElBTSBtb2R1bGVcbi8vIGJlY2F1c2Ugd2Ugd2FudCB0byB2ZXJpZnkgdGhlbSBlbmQtdG8tZW5kLCBhcyBhIGNvbXBsZW1lbnQgdG8gdGhlIHVuaXRcbi8vIHRlc3RzIGluIHRoZSBAYXdzLWNkay9jb3JlIG1vZHVsZVxuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ0lBTSBlc2NhcGUgaGF0Y2hlcycsICgpID0+IHtcbiAgdGVzdCgnYWRkUHJvcGVydHlPdmVycmlkZSBzaG91bGQgYWxsb3cgb3ZlcnJpZGluZyBzdXBwb3J0ZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICd1c2VyJywge1xuICAgICAgdXNlck5hbWU6ICdNeVVzZXJOYW1lJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNmbiA9IHVzZXIubm9kZS5maW5kQ2hpbGQoJ1Jlc291cmNlJykgYXMgaWFtLkNmblVzZXI7XG4gICAgY2ZuLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1VzZXJOYW1lJywgJ092ZXJyaWRkZW5Vc2VyTmFtZScpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ3VzZXIyQzJCNTdBRSc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6VXNlcicsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnVXNlck5hbWUnOiAnT3ZlcnJpZGRlblVzZXJOYW1lJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkUHJvcGVydHlPdmVycmlkZXMgc2hvdWxkIGFsbG93IHNwZWNpZnlpbmcgYXJiaXRyYXJ5IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICd1c2VyJywgeyB1c2VyTmFtZTogJ015VXNlck5hbWUnIH0pO1xuICAgIGNvbnN0IGNmbiA9IHVzZXIubm9kZS5maW5kQ2hpbGQoJ1Jlc291cmNlJykgYXMgaWFtLkNmblVzZXI7XG5cbiAgICAvLyBXSEVOXG4gICAgY2ZuLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ0hlbGxvLldvcmxkJywgJ0Jvb20nKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAndXNlcjJDMkI1N0FFJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdVc2VyTmFtZSc6ICdNeVVzZXJOYW1lJyxcbiAgICAgICAgICAgICdIZWxsbyc6IHtcbiAgICAgICAgICAgICAgJ1dvcmxkJzogJ0Jvb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkT3ZlcnJpZGUgc2hvdWxkIGFsbG93IG92ZXJyaWRpbmcgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ3VzZXInLCB7IHVzZXJOYW1lOiAnTXlVc2VyTmFtZScgfSk7XG4gICAgY29uc3QgY2ZuID0gdXNlci5ub2RlLmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBpYW0uQ2ZuVXNlcjtcbiAgICBjZm4uY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kgPSB7IHVzZU9ubGluZVJlc2hhcmRpbmc6IHRydWUgfTtcblxuICAgIC8vIFdIRU5cbiAgICBjZm4uYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuSGVsbG8uV29ybGQnLCAnQmFtJyk7XG4gICAgY2ZuLmFkZE92ZXJyaWRlKCdQcm9wZXJ0aWVzLlVzZXJOYW1lJywgJ0hBIScpO1xuICAgIGNmbi5hZGRPdmVycmlkZSgnSm9vYi5KYWInLCAnSmliJyk7XG4gICAgY2ZuLmFkZE92ZXJyaWRlKCdKb29iLkphYicsICdKaWInKTtcbiAgICBjZm4uYWRkT3ZlcnJpZGUoJ1VwZGF0ZVBvbGljeS5Vc2VPbmxpbmVSZXNoYXJkaW5nLlR5cGUnLCAnTm9uZScpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICd1c2VyMkMyQjU3QUUnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlVzZXInLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1VzZXJOYW1lJzogJ0hBIScsXG4gICAgICAgICAgICAnSGVsbG8nOiB7XG4gICAgICAgICAgICAgICdXb3JsZCc6ICdCYW0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdKb29iJzoge1xuICAgICAgICAgICAgJ0phYic6ICdKaWInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1VwZGF0ZVBvbGljeSc6IHtcbiAgICAgICAgICAgICdVc2VPbmxpbmVSZXNoYXJkaW5nJzoge1xuICAgICAgICAgICAgICAnVHlwZSc6ICdOb25lJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=