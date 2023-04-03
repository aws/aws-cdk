"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class LambdaApiIntegrationOptionsStack extends core_1.Stack {
    constructor(scope) {
        super(scope, 'LambdaApiIntegrationOptionsStack');
        const fn = new aws_lambda_1.Function(this, 'myfn', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        new lib_1.LambdaRestApi(this, 'lambdarestapi', {
            handler: fn,
            cloudWatchRole: true,
            integrationOptions: {
                timeout: core_1.Duration.seconds(1),
            },
        });
    }
}
const app = new core_1.App();
const testCase = new LambdaApiIntegrationOptionsStack(app);
new integ_tests_1.IntegTest(app, 'lambda-integration', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBOEQ7QUFDOUQsd0NBQXFEO0FBQ3JELHNEQUFpRDtBQUVqRCxnQ0FBdUM7QUFFdkMsTUFBTSxnQ0FBaUMsU0FBUSxZQUFLO0lBQ2xELFlBQVksS0FBZ0I7UUFDMUIsS0FBSyxDQUFDLEtBQUssRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDO1FBRWpELE1BQU0sRUFBRSxHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ3BDLElBQUksRUFBRSxpQkFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDNUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztZQUM1QixPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFFSCxJQUFJLG1CQUFhLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN2QyxPQUFPLEVBQUUsRUFBRTtZQUNYLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGtCQUFrQixFQUFFO2dCQUNsQixPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0I7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLGdDQUFnQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNELElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUU7SUFDdkMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvZGUsIEZ1bmN0aW9uLCBSdW50aW1lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcHAsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBMYW1iZGFSZXN0QXBpIH0gZnJvbSAnLi4vbGliJztcblxuY2xhc3MgTGFtYmRhQXBpSW50ZWdyYXRpb25PcHRpb25zU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ0xhbWJkYUFwaUludGVncmF0aW9uT3B0aW9uc1N0YWNrJyk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbih0aGlzLCAnbXlmbicsIHtcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgbmV3IExhbWJkYVJlc3RBcGkodGhpcywgJ2xhbWJkYXJlc3RhcGknLCB7XG4gICAgICBoYW5kbGVyOiBmbixcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiB0cnVlLFxuICAgICAgaW50ZWdyYXRpb25PcHRpb25zOiB7XG4gICAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMSksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IExhbWJkYUFwaUludGVncmF0aW9uT3B0aW9uc1N0YWNrKGFwcCk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2xhbWJkYS1pbnRlZ3JhdGlvbicsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG4iXX0=