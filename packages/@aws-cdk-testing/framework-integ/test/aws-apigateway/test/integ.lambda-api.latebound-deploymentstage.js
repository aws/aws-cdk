"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
class LateBoundDeploymentStageStack extends aws_cdk_lib_1.Stack {
    constructor(scope) {
        super(scope, 'LateBoundDeploymentStageStack');
        const fn = new aws_lambda_1.Function(this, 'myfn', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        const api = new aws_apigateway_1.LambdaRestApi(this, 'lambdarestapi', {
            cloudWatchRole: true,
            deploy: false,
            handler: fn,
        });
        api.deploymentStage = new aws_apigateway_1.Stage(this, 'stage', {
            deployment: new aws_apigateway_1.Deployment(this, 'deployment', {
                api,
            }),
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new LateBoundDeploymentStageStack(app);
new integ_tests_alpha_1.IntegTest(app, 'lambda-api-latebound-deploymentstage', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFwaS5sYXRlYm91bmQtZGVwbG95bWVudHN0YWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGFtYmRhLWFwaS5sYXRlYm91bmQtZGVwbG95bWVudHN0YWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQWlFO0FBQ2pFLDZDQUF5QztBQUN6QyxrRUFBdUQ7QUFFdkQsK0RBQThFO0FBRTlFLE1BQU0sNkJBQThCLFNBQVEsbUJBQUs7SUFDL0MsWUFBWSxLQUFnQjtRQUMxQixLQUFLLENBQUMsS0FBSyxFQUFFLCtCQUErQixDQUFDLENBQUM7UUFFOUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDcEMsSUFBSSxFQUFFLGlCQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUM1QixPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLE9BQU8sRUFBRSxlQUFlO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sR0FBRyxHQUFHLElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ25ELGNBQWMsRUFBRSxJQUFJO1lBQ3BCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLEVBQUU7U0FDWixDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksc0JBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQzdDLFVBQVUsRUFBRSxJQUFJLDJCQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtnQkFDN0MsR0FBRzthQUNKLENBQUM7U0FDSCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hELElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLEVBQUU7SUFDekQsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvZGUsIEZ1bmN0aW9uLCBSdW50aW1lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBEZXBsb3ltZW50LCBMYW1iZGFSZXN0QXBpLCBTdGFnZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcblxuY2xhc3MgTGF0ZUJvdW5kRGVwbG95bWVudFN0YWdlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ0xhdGVCb3VuZERlcGxveW1lbnRTdGFnZVN0YWNrJyk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbih0aGlzLCAnbXlmbicsIHtcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IExhbWJkYVJlc3RBcGkodGhpcywgJ2xhbWJkYXJlc3RhcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICAgIGRlcGxveTogZmFsc2UsXG4gICAgICBoYW5kbGVyOiBmbixcbiAgICB9KTtcblxuICAgIGFwaS5kZXBsb3ltZW50U3RhZ2UgPSBuZXcgU3RhZ2UodGhpcywgJ3N0YWdlJywge1xuICAgICAgZGVwbG95bWVudDogbmV3IERlcGxveW1lbnQodGhpcywgJ2RlcGxveW1lbnQnLCB7XG4gICAgICAgIGFwaSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IExhdGVCb3VuZERlcGxveW1lbnRTdGFnZVN0YWNrKGFwcCk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2xhbWJkYS1hcGktbGF0ZWJvdW5kLWRlcGxveW1lbnRzdGFnZScsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG4iXX0=