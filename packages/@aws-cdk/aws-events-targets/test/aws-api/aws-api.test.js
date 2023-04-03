"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const targets = require("../../lib");
test('use AwsApi as an event rule target', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(15 minutes)'),
    });
    // WHEN
    rule.addTarget(new targets.AwsApi({
        service: 'ECS',
        action: 'updateService',
        parameters: {
            service: 'cool-service',
            forceNewDeployment: true,
        },
        catchErrorPattern: 'error',
        apiVersion: '2019-01-01',
    }));
    rule.addTarget(new targets.AwsApi({
        service: 'RDS',
        action: 'createDBSnapshot',
        parameters: {
            DBInstanceIdentifier: 'cool-instance',
        },
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620',
                        'Arn',
                    ],
                },
                Id: 'Target0',
                Input: JSON.stringify({
                    service: 'ECS',
                    action: 'updateService',
                    parameters: {
                        service: 'cool-service',
                        forceNewDeployment: true,
                    },
                    catchErrorPattern: 'error',
                    apiVersion: '2019-01-01',
                }),
            },
            {
                Arn: {
                    'Fn::GetAtt': [
                        'AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620',
                        'Arn',
                    ],
                },
                Id: 'Target1',
                Input: JSON.stringify({
                    service: 'RDS',
                    action: 'createDBSnapshot',
                    parameters: {
                        DBInstanceIdentifier: 'cool-instance',
                    },
                }),
            },
        ],
    });
    // Uses a singleton function
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'ecs:UpdateService',
                    Effect: 'Allow',
                    Resource: '*',
                },
                {
                    Action: 'rds:CreateDBSnapshot',
                    Effect: 'Allow',
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('with policy statement', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(15 minutes)'),
    });
    // WHEN
    rule.addTarget(new targets.AwsApi({
        service: 'service',
        action: 'action',
        policyStatement: new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: ['resource'],
        }),
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620',
                        'Arn',
                    ],
                },
                Id: 'Target0',
                Input: JSON.stringify({
                    service: 'service',
                    action: 'action',
                }),
            },
        ],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 's3:GetObject',
                    Effect: 'Allow',
                    Resource: 'resource',
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('with service not in AWS SDK', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(15 minutes)'),
    });
    const awsApi = new targets.AwsApi({
        service: 'no-such-service',
        action: 'no-such-action',
        policyStatement: new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: ['resource'],
        }),
    });
    // WHEN
    rule.addTarget(awsApi);
    // THEN
    assertions_1.Annotations.fromStack(stack).hasWarning('*', 'Service no-such-service does not exist in the AWS SDK. Check the list of available services and actions from https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWFwaS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLWFwaS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQTREO0FBQzVELDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsd0NBQXNDO0FBQ3RDLHFDQUFxQztBQUVyQyxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO0lBQzlDLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQzFDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztLQUN6RCxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDaEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUUsZUFBZTtRQUN2QixVQUFVLEVBQUU7WUFDVixPQUFPLEVBQUUsY0FBYztZQUN2QixrQkFBa0IsRUFBRSxJQUFJO1NBQ087UUFDakMsaUJBQWlCLEVBQUUsT0FBTztRQUMxQixVQUFVLEVBQUUsWUFBWTtLQUN6QixDQUFDLENBQUMsQ0FBQztJQUVKLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFLGtCQUFrQjtRQUMxQixVQUFVLEVBQUU7WUFDVixvQkFBb0IsRUFBRSxlQUFlO1NBQ0g7S0FDckMsQ0FBQyxDQUFDLENBQUM7SUFFSixPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7UUFDbkUsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsR0FBRyxFQUFF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RTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUUsY0FBYztvQkFDdEIsTUFBTSxFQUFFLE9BQU87b0JBQ2YsUUFBUSxFQUFFLFVBQVU7aUJBQ3JCO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsWUFBWTtTQUN0QjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMxQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUM7S0FDekQsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixlQUFlLEVBQUUsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7U0FDeEIsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXZCLE9BQU87SUFDUCx3QkFBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLDZLQUE2SyxDQUFDLENBQUM7QUFDOU4sQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9ucywgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJy4uLy4uL2xpYic7XG5cbnRlc3QoJ3VzZSBBd3NBcGkgYXMgYW4gZXZlbnQgcnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxNSBtaW51dGVzKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkF3c0FwaSh7XG4gICAgc2VydmljZTogJ0VDUycsXG4gICAgYWN0aW9uOiAndXBkYXRlU2VydmljZScsXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgc2VydmljZTogJ2Nvb2wtc2VydmljZScsXG4gICAgICBmb3JjZU5ld0RlcGxveW1lbnQ6IHRydWUsXG4gICAgfSBhcyBBV1MuRUNTLlVwZGF0ZVNlcnZpY2VSZXF1ZXN0LFxuICAgIGNhdGNoRXJyb3JQYXR0ZXJuOiAnZXJyb3InLFxuICAgIGFwaVZlcnNpb246ICcyMDE5LTAxLTAxJyxcbiAgfSkpO1xuXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkF3c0FwaSh7XG4gICAgc2VydmljZTogJ1JEUycsXG4gICAgYWN0aW9uOiAnY3JlYXRlREJTbmFwc2hvdCcsXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgREJJbnN0YW5jZUlkZW50aWZpZXI6ICdjb29sLWluc3RhbmNlJyxcbiAgICB9IGFzIEFXUy5SRFMuQ3JlYXRlREJTbmFwc2hvdE1lc3NhZ2UsXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0FXU2I0Y2YxYWJkNGU0ZjRiYzY5OTQ0MWFmN2NjZDllYzM3MTUxMUU2MjAnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgSW5wdXQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBzZXJ2aWNlOiAnRUNTJyxcbiAgICAgICAgICBhY3Rpb246ICd1cGRhdGVTZXJ2aWNlJyxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBzZXJ2aWNlOiAnY29vbC1zZXJ2aWNlJyxcbiAgICAgICAgICAgIGZvcmNlTmV3RGVwbG95bWVudDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhdGNoRXJyb3JQYXR0ZXJuOiAnZXJyb3InLFxuICAgICAgICAgIGFwaVZlcnNpb246ICcyMDE5LTAxLTAxJyxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdBV1NiNGNmMWFiZDRlNGY0YmM2OTk0NDFhZjdjY2Q5ZWMzNzE1MTFFNjIwJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MScsXG4gICAgICAgIElucHV0OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgc2VydmljZTogJ1JEUycsXG4gICAgICAgICAgYWN0aW9uOiAnY3JlYXRlREJTbmFwc2hvdCcsXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgREJJbnN0YW5jZUlkZW50aWZpZXI6ICdjb29sLWluc3RhbmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgLy8gVXNlcyBhIHNpbmdsZXRvbiBmdW5jdGlvblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywgMSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnZWNzOlVwZGF0ZVNlcnZpY2UnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAncmRzOkNyZWF0ZURCU25hcHNob3QnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCd3aXRoIHBvbGljeSBzdGF0ZW1lbnQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxNSBtaW51dGVzKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkF3c0FwaSh7XG4gICAgc2VydmljZTogJ3NlcnZpY2UnLFxuICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgcG9saWN5U3RhdGVtZW50OiBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxuICAgICAgcmVzb3VyY2VzOiBbJ3Jlc291cmNlJ10sXG4gICAgfSksXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0FXU2I0Y2YxYWJkNGU0ZjRiYzY5OTQ0MWFmN2NjZDllYzM3MTUxMUU2MjAnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgSW5wdXQ6IEpTT04uc3RyaW5naWZ5KHsgLy8gTm8gYHBvbGljeVN0YXRlbWVudGBcbiAgICAgICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICAgICAgYWN0aW9uOiAnYWN0aW9uJyxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3MzOkdldE9iamVjdCcsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAncmVzb3VyY2UnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCd3aXRoIHNlcnZpY2Ugbm90IGluIEFXUyBTREsnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxNSBtaW51dGVzKScpLFxuICB9KTtcbiAgY29uc3QgYXdzQXBpID0gbmV3IHRhcmdldHMuQXdzQXBpKHtcbiAgICBzZXJ2aWNlOiAnbm8tc3VjaC1zZXJ2aWNlJyxcbiAgICBhY3Rpb246ICduby1zdWNoLWFjdGlvbicsXG4gICAgcG9saWN5U3RhdGVtZW50OiBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxuICAgICAgcmVzb3VyY2VzOiBbJ3Jlc291cmNlJ10sXG4gICAgfSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcnVsZS5hZGRUYXJnZXQoYXdzQXBpKTtcblxuICAvLyBUSEVOXG4gIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnKicsICdTZXJ2aWNlIG5vLXN1Y2gtc2VydmljZSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgQVdTIFNESy4gQ2hlY2sgdGhlIGxpc3Qgb2YgYXZhaWxhYmxlIHNlcnZpY2VzIGFuZCBhY3Rpb25zIGZyb20gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L2luZGV4Lmh0bWwnKTtcbn0pO1xuIl19