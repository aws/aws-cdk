"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sfn = require("@aws-cdk/aws-stepfunctions");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apigw = require("../lib");
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
new integ_tests_1.IntegTest(app, 'step-functions-restapi', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RlcGZ1bmN0aW9ucy1hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zdGVwZnVuY3Rpb25zLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUFrRDtBQUNsRCxxQ0FBcUM7QUFDckMsc0RBQWlEO0FBRWpELGdDQUFnQztBQUVoQzs7Ozs7R0FLRztBQUVILE1BQU0sbUNBQW9DLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDekQsWUFBWSxLQUFnQjtRQUMxQixLQUFLLENBQUMsS0FBSyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7UUFFcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM5RCxVQUFVLEVBQUUsUUFBUTtZQUNwQixnQkFBZ0IsRUFBRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTztTQUMvQyxDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDdkUsTUFBTSxFQUFFLEtBQUs7WUFDYixjQUFjLEVBQUUsSUFBSTtZQUNwQixZQUFZLEVBQUUsWUFBWTtZQUMxQixPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLEtBQUs7WUFDbEIsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxJQUFJO2dCQUNmLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7U0FDRixDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ25ELFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtnQkFDbkQsR0FBRzthQUNKLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBbUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUU5RCxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLHdCQUF3QixFQUFFO0lBQzNDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZm4gZnJvbSAnQGF3cy1jZGsvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICcuLi9saWInO1xuXG4vKipcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYGN1cmwgLVggUE9TVCAnaHR0cHM6Ly88YXBpLWlkPi5leGVjdXRlLWFwaS48cmVnaW9uPi5hbWF6b25hd3MuY29tL3Byb2QnIFxcXG4gKiAqIC1kICd7XCJrZXlcIjpcIkhlbGxvXCJ9JyAtSCAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJ2BcbiAqIFRoZSBhYm92ZSBzaG91bGQgcmV0dXJuIGEgXCJIZWxsb1wiIHJlc3BvbnNlXG4gKi9cblxuY2xhc3MgU3RlcEZ1bmN0aW9uc1Jlc3RBcGlEZXBsb3ltZW50U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0KSB7XG4gICAgc3VwZXIoc2NvcGUsICdTdGVwRnVuY3Rpb25zUmVzdEFwaURlcGxveW1lbnRTdGFjaycpO1xuXG4gICAgY29uc3QgcGFzc1Rhc2sgPSBuZXcgc2ZuLlBhc3ModGhpcywgJ1Bhc3NUYXNrJywge1xuICAgICAgcmVzdWx0OiB7IHZhbHVlOiAnSGVsbG8nIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogcGFzc1Rhc2ssXG4gICAgICBzdGF0ZU1hY2hpbmVUeXBlOiBzZm4uU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlN0ZXBGdW5jdGlvbnNSZXN0QXBpKHRoaXMsICdTdGVwRnVuY3Rpb25zUmVzdEFwaScsIHtcbiAgICAgIGRlcGxveTogZmFsc2UsXG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICAgIHN0YXRlTWFjaGluZTogc3RhdGVNYWNoaW5lLFxuICAgICAgaGVhZGVyczogdHJ1ZSxcbiAgICAgIHBhdGg6IGZhbHNlLFxuICAgICAgcXVlcnlzdHJpbmc6IGZhbHNlLFxuICAgICAgcmVxdWVzdENvbnRleHQ6IHtcbiAgICAgICAgYWNjb3VudElkOiB0cnVlLFxuICAgICAgICB1c2VyQXJuOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGFwaS5kZXBsb3ltZW50U3RhZ2UgPSBuZXcgYXBpZ3cuU3RhZ2UodGhpcywgJ3N0YWdlJywge1xuICAgICAgZGVwbG95bWVudDogbmV3IGFwaWd3LkRlcGxveW1lbnQodGhpcywgJ2RlcGxveW1lbnQnLCB7XG4gICAgICAgIGFwaSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0FwaUVuZHBvaW50Jywge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFN0ZXBGdW5jdGlvbnNSZXN0QXBpRGVwbG95bWVudFN0YWNrKGFwcCk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnc3RlcC1mdW5jdGlvbnMtcmVzdGFwaScsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==