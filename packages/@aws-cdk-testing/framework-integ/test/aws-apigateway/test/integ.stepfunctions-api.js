"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigw = require("aws-cdk-lib/aws-apigateway");
/**
 * Stack verification steps:
 * * `curl -X POST 'https://<api-id>.execute-api.<region>.amazonaws.com/prod' \
 * * -d '{"key":"Hello"}' -H 'Content-Type: application/json'`
 * The above should return a "Hello" response
 */
class StepFunctionsRestApiDeploymentStack extends cdk.Stack {
    constructor(scope) {
        super(scope, 'StepFunctionsRestApiDeploymentStack');
        const passTask = new sfn.Pass(this, 'PassTask', {
            result: { value: 'Hello' },
        });
        const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definition: passTask,
            stateMachineType: sfn.StateMachineType.EXPRESS,
        });
        const api = new apigw.StepFunctionsRestApi(this, 'StepFunctionsRestApi', {
            deploy: false,
            cloudWatchRole: true,
            stateMachine: stateMachine,
            headers: true,
            path: false,
            querystring: false,
            requestContext: {
                accountId: true,
                userArn: true,
            },
        });
        api.deploymentStage = new apigw.Stage(this, 'stage', {
            deployment: new apigw.Deployment(this, 'deployment', {
                api,
            }),
        });
        new cdk.CfnOutput(this, 'ApiEndpoint', {
            value: api.url,
        });
    }
}
const app = new cdk.App();
const testCase = new StepFunctionsRestApiDeploymentStack(app);
new integ_tests_alpha_1.IntegTest(app, 'step-functions-restapi', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RlcGZ1bmN0aW9ucy1hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zdGVwZnVuY3Rpb25zLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFxRDtBQUNyRCxtQ0FBbUM7QUFDbkMsa0VBQXVEO0FBRXZELG9EQUFvRDtBQUVwRDs7Ozs7R0FLRztBQUVILE1BQU0sbUNBQW9DLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDekQsWUFBWSxLQUFnQjtRQUMxQixLQUFLLENBQUMsS0FBSyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7UUFFcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM5RCxVQUFVLEVBQUUsUUFBUTtZQUNwQixnQkFBZ0IsRUFBRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTztTQUMvQyxDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDdkUsTUFBTSxFQUFFLEtBQUs7WUFDYixjQUFjLEVBQUUsSUFBSTtZQUNwQixZQUFZLEVBQUUsWUFBWTtZQUMxQixPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLEtBQUs7WUFDbEIsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxJQUFJO2dCQUNmLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7U0FDRixDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ25ELFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtnQkFDbkQsR0FBRzthQUNKLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFtQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRTlELElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLEVBQUU7SUFDM0MsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbi8qKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBgY3VybCAtWCBQT1NUICdodHRwczovLzxhcGktaWQ+LmV4ZWN1dGUtYXBpLjxyZWdpb24+LmFtYXpvbmF3cy5jb20vcHJvZCcgXFxcbiAqICogLWQgJ3tcImtleVwiOlwiSGVsbG9cIn0nIC1IICdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nYFxuICogVGhlIGFib3ZlIHNob3VsZCByZXR1cm4gYSBcIkhlbGxvXCIgcmVzcG9uc2VcbiAqL1xuXG5jbGFzcyBTdGVwRnVuY3Rpb25zUmVzdEFwaURlcGxveW1lbnRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ1N0ZXBGdW5jdGlvbnNSZXN0QXBpRGVwbG95bWVudFN0YWNrJyk7XG5cbiAgICBjb25zdCBwYXNzVGFzayA9IG5ldyBzZm4uUGFzcyh0aGlzLCAnUGFzc1Rhc2snLCB7XG4gICAgICByZXN1bHQ6IHsgdmFsdWU6ICdIZWxsbycgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YXRlTWFjaGluZSA9IG5ldyBzZm4uU3RhdGVNYWNoaW5lKHRoaXMsICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiBwYXNzVGFzayxcbiAgICAgIHN0YXRlTWFjaGluZVR5cGU6IHNmbi5TdGF0ZU1hY2hpbmVUeXBlLkVYUFJFU1MsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuU3RlcEZ1bmN0aW9uc1Jlc3RBcGkodGhpcywgJ1N0ZXBGdW5jdGlvbnNSZXN0QXBpJywge1xuICAgICAgZGVwbG95OiBmYWxzZSxcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiB0cnVlLFxuICAgICAgc3RhdGVNYWNoaW5lOiBzdGF0ZU1hY2hpbmUsXG4gICAgICBoZWFkZXJzOiB0cnVlLFxuICAgICAgcGF0aDogZmFsc2UsXG4gICAgICBxdWVyeXN0cmluZzogZmFsc2UsXG4gICAgICByZXF1ZXN0Q29udGV4dDoge1xuICAgICAgICBhY2NvdW50SWQ6IHRydWUsXG4gICAgICAgIHVzZXJBcm46IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgYXBpLmRlcGxveW1lbnRTdGFnZSA9IG5ldyBhcGlndy5TdGFnZSh0aGlzLCAnc3RhZ2UnLCB7XG4gICAgICBkZXBsb3ltZW50OiBuZXcgYXBpZ3cuRGVwbG95bWVudCh0aGlzLCAnZGVwbG95bWVudCcsIHtcbiAgICAgICAgYXBpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQXBpRW5kcG9pbnQnLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgU3RlcEZ1bmN0aW9uc1Jlc3RBcGlEZXBsb3ltZW50U3RhY2soYXBwKTtcblxubmV3IEludGVnVGVzdChhcHAsICdzdGVwLWZ1bmN0aW9ucy1yZXN0YXBpJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbmFwcC5zeW50aCgpO1xuIl19