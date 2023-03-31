"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class Test extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const api = new apigateway.RestApi(this, 'my-api', {
            retainDeployments: true,
            cloudWatchRole: true,
            minCompressionSize: aws_cdk_lib_1.Size.bytes(1024),
            deployOptions: {
                cacheClusterEnabled: true,
                stageName: 'beta',
                description: 'beta stage',
                loggingLevel: apigateway.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
                methodOptions: {
                    '/api/appliances/GET': {
                        cachingEnabled: true,
                    },
                },
            },
        });
        const handler = new lambda.Function(this, 'MyHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline(`exports.handler = ${handlerCode}`),
            handler: 'index.handler',
        });
        const v1 = api.root.addResource('v1');
        const integration = new apigateway.LambdaIntegration(handler);
        const toys = v1.addResource('toys');
        const getToysMethod = toys.addMethod('GET', integration, { apiKeyRequired: true });
        toys.addMethod('POST');
        toys.addMethod('PUT');
        const appliances = v1.addResource('appliances:all');
        appliances.addMethod('GET');
        const books = v1.addResource('books');
        books.addMethod('GET', integration);
        books.addMethod('POST', integration);
        function handlerCode(event, _, callback) {
            return callback(undefined, {
                isBase64Encoded: false,
                statusCode: 200,
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(event),
            });
        }
        const key = api.addApiKey('ApiKey');
        const plan = api.addUsagePlan('UsagePlan', {
            name: 'Basic',
            apiKey: key,
            description: 'Free tier monthly usage plan',
            throttle: { rateLimit: 5 },
            quota: {
                limit: 10000,
                period: apigateway.Period.MONTH,
            },
        });
        plan.addApiStage({
            stage: api.deploymentStage,
            throttle: [
                {
                    method: getToysMethod,
                    throttle: {
                        rateLimit: 10,
                        burstLimit: 2,
                    },
                },
            ],
        });
        const testDeploy = new apigateway.Deployment(this, 'TestDeployment', {
            api,
            retainDeployments: false,
        });
        const testStage = new apigateway.Stage(this, 'TestStage', {
            deployment: testDeploy,
        });
        testStage.addApiKey('MyTestApiKey');
    }
}
const app = new cdk.App();
const testCase = new Test(app, 'test-apigateway-restapi');
new integ_tests_alpha_1.IntegTest(app, 'apigateway-restapi', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJlc3RhcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLDZDQUFtQztBQUNuQyxrRUFBdUQ7QUFDdkQseURBQXlEO0FBRXpELE1BQU0sSUFBSyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFCLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNqRCxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGtCQUFrQixFQUFFLGtCQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNwQyxhQUFhLEVBQUU7Z0JBQ2IsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFdBQVcsRUFBRSxZQUFZO2dCQUN6QixZQUFZLEVBQUUsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUk7Z0JBQ2hELGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGFBQWEsRUFBRTtvQkFDYixxQkFBcUIsRUFBRTt3QkFDckIsY0FBYyxFQUFFLElBQUk7cUJBQ3JCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsV0FBVyxFQUFFLENBQUM7WUFDaEUsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxF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LENBQUM7Q0FDdEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFNpemUgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcblxuY2xhc3MgVGVzdCBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ215LWFwaScsIHtcbiAgICAgIHJldGFpbkRlcGxveW1lbnRzOiB0cnVlLFxuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICBtaW5Db21wcmVzc2lvblNpemU6IFNpemUuYnl0ZXMoMTAyNCksXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIGNhY2hlQ2x1c3RlckVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHN0YWdlTmFtZTogJ2JldGEnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2JldGEgc3RhZ2UnLFxuICAgICAgICBsb2dnaW5nTGV2ZWw6IGFwaWdhdGV3YXkuTWV0aG9kTG9nZ2luZ0xldmVsLklORk8sXG4gICAgICAgIGRhdGFUcmFjZUVuYWJsZWQ6IHRydWUsXG4gICAgICAgIG1ldGhvZE9wdGlvbnM6IHtcbiAgICAgICAgICAnL2FwaS9hcHBsaWFuY2VzL0dFVCc6IHtcbiAgICAgICAgICAgIGNhY2hpbmdFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ015SGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZShgZXhwb3J0cy5oYW5kbGVyID0gJHtoYW5kbGVyQ29kZX1gKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHYxID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3YxJyk7XG5cbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGhhbmRsZXIpO1xuXG4gICAgY29uc3QgdG95cyA9IHYxLmFkZFJlc291cmNlKCd0b3lzJyk7XG4gICAgY29uc3QgZ2V0VG95c01ldGhvZDogYXBpZ2F0ZXdheS5NZXRob2QgPSB0b3lzLmFkZE1ldGhvZCgnR0VUJywgaW50ZWdyYXRpb24sIHsgYXBpS2V5UmVxdWlyZWQ6IHRydWUgfSk7XG4gICAgdG95cy5hZGRNZXRob2QoJ1BPU1QnKTtcbiAgICB0b3lzLmFkZE1ldGhvZCgnUFVUJyk7XG5cbiAgICBjb25zdCBhcHBsaWFuY2VzID0gdjEuYWRkUmVzb3VyY2UoJ2FwcGxpYW5jZXM6YWxsJyk7XG4gICAgYXBwbGlhbmNlcy5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgY29uc3QgYm9va3MgPSB2MS5hZGRSZXNvdXJjZSgnYm9va3MnKTtcbiAgICBib29rcy5hZGRNZXRob2QoJ0dFVCcsIGludGVncmF0aW9uKTtcbiAgICBib29rcy5hZGRNZXRob2QoJ1BPU1QnLCBpbnRlZ3JhdGlvbik7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVyQ29kZShldmVudDogYW55LCBfOiBhbnksIGNhbGxiYWNrOiBhbnkpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayh1bmRlZmluZWQsIHtcbiAgICAgICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICBoZWFkZXJzOiB7ICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnQpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5ID0gYXBpLmFkZEFwaUtleSgnQXBpS2V5Jyk7XG4gICAgY29uc3QgcGxhbiA9IGFwaS5hZGRVc2FnZVBsYW4oJ1VzYWdlUGxhbicsIHtcbiAgICAgIG5hbWU6ICdCYXNpYycsXG4gICAgICBhcGlLZXk6IGtleSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRnJlZSB0aWVyIG1vbnRobHkgdXNhZ2UgcGxhbicsXG4gICAgICB0aHJvdHRsZTogeyByYXRlTGltaXQ6IDUgfSxcbiAgICAgIHF1b3RhOiB7XG4gICAgICAgIGxpbWl0OiAxMDAwMCxcbiAgICAgICAgcGVyaW9kOiBhcGlnYXRld2F5LlBlcmlvZC5NT05USCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcGxhbi5hZGRBcGlTdGFnZSh7XG4gICAgICBzdGFnZTogYXBpLmRlcGxveW1lbnRTdGFnZSxcbiAgICAgIHRocm90dGxlOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtZXRob2Q6IGdldFRveXNNZXRob2QsXG4gICAgICAgICAgdGhyb3R0bGU6IHtcbiAgICAgICAgICAgIHJhdGVMaW1pdDogMTAsXG4gICAgICAgICAgICBidXJzdExpbWl0OiAyLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGVzdERlcGxveSA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQodGhpcywgJ1Rlc3REZXBsb3ltZW50Jywge1xuICAgICAgYXBpLFxuICAgICAgcmV0YWluRGVwbG95bWVudHM6IGZhbHNlLFxuICAgIH0pO1xuICAgIGNvbnN0IHRlc3RTdGFnZSA9IG5ldyBhcGlnYXRld2F5LlN0YWdlKHRoaXMsICdUZXN0U3RhZ2UnLCB7XG4gICAgICBkZXBsb3ltZW50OiB0ZXN0RGVwbG95LFxuICAgIH0pO1xuICAgIHRlc3RTdGFnZS5hZGRBcGlLZXkoJ015VGVzdEFwaUtleScpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3QoYXBwLCAndGVzdC1hcGlnYXRld2F5LXJlc3RhcGknKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBpZ2F0ZXdheS1yZXN0YXBpJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcblxuIl19