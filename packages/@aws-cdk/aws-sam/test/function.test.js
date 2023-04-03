"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const sam = require("../lib");
test("correctly chooses a string array from the type unions of the 'policies' property", () => {
    const stack = new cdk.Stack();
    new sam.CfnFunction(stack, 'MyFunction', {
        codeUri: {
            bucket: 'my-bucket',
            key: 'my-key',
        },
        runtime: 'nodejs-12.x',
        handler: 'index.handler',
        policies: ['AWSLambdaExecute'],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Function', {
        CodeUri: {
            Bucket: 'my-bucket',
            Key: 'my-key',
        },
        Handler: 'index.handler',
        Runtime: 'nodejs-12.x',
        Policies: ['AWSLambdaExecute'],
    });
});
test('has the correct deployment preference hooks structure', () => {
    const stack = new cdk.Stack();
    new sam.CfnFunction(stack, 'MyFunction', {
        deploymentPreference: {
            enabled: true,
            type: 'AllAtOnce',
            hooks: {
                preTraffic: 'pre-traffic-hook-arn',
                postTraffic: 'post-traffic-hook-arn',
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Function', {
        DeploymentPreference: {
            Enabled: true,
            Type: 'AllAtOnce',
            Hooks: {
                PreTraffic: 'pre-traffic-hook-arn',
                PostTraffic: 'post-traffic-hook-arn',
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZ1bmN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUU5QixJQUFJLENBQUMsa0ZBQWtGLEVBQUUsR0FBRyxFQUFFO0lBQzVGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTlCLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3ZDLE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSxXQUFXO1lBQ25CLEdBQUcsRUFBRSxRQUFRO1NBQ2Q7UUFDRCxPQUFPLEVBQUUsYUFBYTtRQUN0QixPQUFPLEVBQUUsZUFBZTtRQUN4QixRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztLQUMvQixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtRQUMzRSxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUUsV0FBVztZQUNuQixHQUFHLEVBQUUsUUFBUTtTQUNkO1FBQ0QsT0FBTyxFQUFFLGVBQWU7UUFDeEIsT0FBTyxFQUFFLGFBQWE7UUFDdEIsUUFBUSxFQUFFLENBQUMsa0JBQWtCLENBQUM7S0FDL0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO0lBQ2pFLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTlCLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3ZDLG9CQUFvQixFQUFFO1lBQ3BCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxFQUFFLFdBQVc7WUFDakIsS0FBSyxFQUFFO2dCQUNMLFVBQVUsRUFBRSxzQkFBc0I7Z0JBQ2xDLFdBQVcsRUFBRSx1QkFBdUI7YUFDckM7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1FBQzNFLG9CQUFvQixFQUFFO1lBQ3BCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxFQUFFLFdBQVc7WUFDakIsS0FBSyxFQUFFO2dCQUNMLFVBQVUsRUFBRSxzQkFBc0I7Z0JBQ2xDLFdBQVcsRUFBRSx1QkFBdUI7YUFDckM7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNhbSBmcm9tICcuLi9saWInO1xuXG50ZXN0KFwiY29ycmVjdGx5IGNob29zZXMgYSBzdHJpbmcgYXJyYXkgZnJvbSB0aGUgdHlwZSB1bmlvbnMgb2YgdGhlICdwb2xpY2llcycgcHJvcGVydHlcIiwgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBuZXcgc2FtLkNmbkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbicsIHtcbiAgICBjb2RlVXJpOiB7XG4gICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAga2V5OiAnbXkta2V5JyxcbiAgICB9LFxuICAgIHJ1bnRpbWU6ICdub2RlanMtMTIueCcsXG4gICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIHBvbGljaWVzOiBbJ0FXU0xhbWJkYUV4ZWN1dGUnXSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmVybGVzczo6RnVuY3Rpb24nLCB7XG4gICAgQ29kZVVyaToge1xuICAgICAgQnVja2V0OiAnbXktYnVja2V0JyxcbiAgICAgIEtleTogJ215LWtleScsXG4gICAgfSxcbiAgICBIYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgUnVudGltZTogJ25vZGVqcy0xMi54JyxcbiAgICBQb2xpY2llczogWydBV1NMYW1iZGFFeGVjdXRlJ10sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2hhcyB0aGUgY29ycmVjdCBkZXBsb3ltZW50IHByZWZlcmVuY2UgaG9va3Mgc3RydWN0dXJlJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBuZXcgc2FtLkNmbkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbicsIHtcbiAgICBkZXBsb3ltZW50UHJlZmVyZW5jZToge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIHR5cGU6ICdBbGxBdE9uY2UnLFxuICAgICAgaG9va3M6IHtcbiAgICAgICAgcHJlVHJhZmZpYzogJ3ByZS10cmFmZmljLWhvb2stYXJuJyxcbiAgICAgICAgcG9zdFRyYWZmaWM6ICdwb3N0LXRyYWZmaWMtaG9vay1hcm4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbicsIHtcbiAgICBEZXBsb3ltZW50UHJlZmVyZW5jZToge1xuICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgIFR5cGU6ICdBbGxBdE9uY2UnLFxuICAgICAgSG9va3M6IHtcbiAgICAgICAgUHJlVHJhZmZpYzogJ3ByZS10cmFmZmljLWhvb2stYXJuJyxcbiAgICAgICAgUG9zdFRyYWZmaWM6ICdwb3N0LXRyYWZmaWMtaG9vay1hcm4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19