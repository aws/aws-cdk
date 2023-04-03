"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('destination', () => {
    test('simple destination', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('logs.us-east-2.amazonaws.com'),
        });
        // WHEN
        new lib_1.CrossAccountDestination(stack, 'Dest', {
            destinationName: 'MyDestination',
            role,
            targetArn: 'arn:bogus',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::Destination', {
            DestinationName: 'MyDestination',
            RoleArn: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
            TargetArn: 'arn:bogus',
        });
    });
    test('add policy to destination', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('logs.us-east-2.amazonaws.com'),
        });
        const dest = new lib_1.CrossAccountDestination(stack, 'Dest', {
            destinationName: 'MyDestination',
            role,
            targetArn: 'arn:bogus',
        });
        // WHEN
        dest.addToPolicy(new iam.PolicyStatement({
            actions: ['logs:TalkToMe'],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::Destination', {
            DestinationName: 'MyDestination',
            DestinationPolicy: assertions_1.Match.serializedJson({
                Statement: [
                    {
                        Action: 'logs:TalkToMe',
                        Effect: 'Allow',
                    },
                ],
                Version: '2012-10-17',
            }),
            RoleArn: {
                'Fn::GetAtt': [
                    'Role1ABCC5F0',
                    'Arn',
                ],
            },
            TargetArn: 'arn:bogus',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzdGluYXRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlc3RpbmF0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxnQ0FBaUQ7QUFFakQsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUM5QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDdkMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDhCQUE4QixDQUFDO1NBQ3BFLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxJQUFJLDZCQUF1QixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDekMsZUFBZSxFQUFFLGVBQWU7WUFDaEMsSUFBSTtZQUNKLFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxlQUFlLEVBQUUsZUFBZTtZQUNoQyxPQUFPLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDbEQsU0FBUyxFQUFFLFdBQVc7U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUN2QyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsOEJBQThCLENBQUM7U0FDcEUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLEdBQUcsSUFBSSw2QkFBdUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3RELGVBQWUsRUFBRSxlQUFlO1lBQ2hDLElBQUk7WUFDSixTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdkMsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO1NBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGVBQWUsRUFBRSxlQUFlO1lBQ2hDLGlCQUFpQixFQUFFLGtCQUFLLENBQUMsY0FBYyxDQUFDO2dCQUN0QyxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLGVBQWU7d0JBQ3ZCLE1BQU0sRUFBRSxPQUFPO3FCQUNoQjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsWUFBWTthQUN0QixDQUFDO1lBQ0YsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRTtvQkFDWixjQUFjO29CQUNkLEtBQUs7aUJBQ047YUFDRjtZQUNELFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENyb3NzQWNjb3VudERlc3RpbmF0aW9uIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2Rlc3RpbmF0aW9uJywgKCkgPT4ge1xuICB0ZXN0KCdzaW1wbGUgZGVzdGluYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsb2dzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENyb3NzQWNjb3VudERlc3RpbmF0aW9uKHN0YWNrLCAnRGVzdCcsIHtcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogJ015RGVzdGluYXRpb24nLFxuICAgICAgcm9sZSxcbiAgICAgIHRhcmdldEFybjogJ2Fybjpib2d1cycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6RGVzdGluYXRpb24nLCB7XG4gICAgICBEZXN0aW5hdGlvbk5hbWU6ICdNeURlc3RpbmF0aW9uJyxcbiAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ1JvbGUxQUJDQzVGMCcsICdBcm4nXSB9LFxuICAgICAgVGFyZ2V0QXJuOiAnYXJuOmJvZ3VzJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIHBvbGljeSB0byBkZXN0aW5hdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xvZ3MudXMtZWFzdC0yLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlc3QgPSBuZXcgQ3Jvc3NBY2NvdW50RGVzdGluYXRpb24oc3RhY2ssICdEZXN0Jywge1xuICAgICAgZGVzdGluYXRpb25OYW1lOiAnTXlEZXN0aW5hdGlvbicsXG4gICAgICByb2xlLFxuICAgICAgdGFyZ2V0QXJuOiAnYXJuOmJvZ3VzJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBkZXN0LmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnbG9nczpUYWxrVG9NZSddLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpEZXN0aW5hdGlvbicsIHtcbiAgICAgIERlc3RpbmF0aW9uTmFtZTogJ015RGVzdGluYXRpb24nLFxuICAgICAgRGVzdGluYXRpb25Qb2xpY3k6IE1hdGNoLnNlcmlhbGl6ZWRKc29uKHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnbG9nczpUYWxrVG9NZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSksXG4gICAgICBSb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdSb2xlMUFCQ0M1RjAnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFRhcmdldEFybjogJ2Fybjpib2d1cycsXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=