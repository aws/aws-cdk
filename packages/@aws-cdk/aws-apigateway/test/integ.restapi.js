"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apigateway = require("../lib");
class Test extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const api = new apigateway.RestApi(this, 'my-api', {
            retainDeployments: true,
            cloudWatchRole: true,
            minCompressionSize: core_1.Size.bytes(1024),
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
new integ_tests_1.IntegTest(app, 'apigateway-restapi', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJlc3RhcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBQ3JDLHdDQUFxQztBQUNyQyxzREFBaUQ7QUFDakQscUNBQXFDO0FBRXJDLE1BQU0sSUFBSyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFCLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNqRCxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGtCQUFrQixFQUFFLFdBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3BDLGFBQWEsRUFBRTtnQkFDYixtQkFBbUIsRUFBRSxJQUFJO2dCQUN6QixTQUFTLEVBQUUsTUFBTTtnQkFDakIsV0FBVyxFQUFFLFlBQVk7Z0JBQ3pCLFlBQVksRUFBRSxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSTtnQkFDaEQsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsYUFBYSxFQUFFO29CQUNiLHFCQUFxQixFQUFFO3dCQUNyQixjQUFjLEVBQUUsSUFBSTtxQkFDckI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3JELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixXQUFXLEVBQUUsQ0FBQztZQUNoRSxPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU5RCxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sYUFBYSxHQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN0RyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BELFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVyQyxTQUFTLFdBQVcsQ0FBQyxLQUFVLEVBQUUsQ0FBTSxFQUFFLFFBQWE7WUFDcEQsT0FBTyxRQUFRLENBQUMsU0FBUyxFQUFFO2dCQUN6QixlQUFlLEVBQUUsS0FBSztnQkFDdEIsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO2dCQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDekMsSUFBSSxFQUFFLE9BQU87WUFDYixNQUFNLEVBQUUsR0FBRztZQUNYLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtZQUMxQixLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSzthQUNoQztTQUNGLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUM7WUFDZixLQUFLLEVBQUUsR0FBRyxDQUFDLGVBQWU7WUFDMUIsUUFBUSxFQUFFO2dCQUNSO29CQUNFLE1BQU0sRUFBRSxhQUFhO29CQUNyQixRQUFRLEVBQUU7d0JBQ1IsU0FBUyxFQUFFLEVBQUU7d0JBQ2IsVUFBVSxFQUFFLENBQUM7cUJBQ2Q7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDbkUsR0FBRztZQUNILGlCQUFpQixFQUFFLEtBQUs7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDeEQsVUFBVSxFQUFFLFVBQVU7U0FDdkIsQ0FBQyxDQUFDO1FBQ0gsU0FBUyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUNyQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFDMUQsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtJQUN2QyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Q0FDdEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgU2l6ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnbXktYXBpJywge1xuICAgICAgcmV0YWluRGVwbG95bWVudHM6IHRydWUsXG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICAgIG1pbkNvbXByZXNzaW9uU2l6ZTogU2l6ZS5ieXRlcygxMDI0KSxcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgY2FjaGVDbHVzdGVyRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgc3RhZ2VOYW1lOiAnYmV0YScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYmV0YSBzdGFnZScsXG4gICAgICAgIGxvZ2dpbmdMZXZlbDogYXBpZ2F0ZXdheS5NZXRob2RMb2dnaW5nTGV2ZWwuSU5GTyxcbiAgICAgICAgZGF0YVRyYWNlRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgbWV0aG9kT3B0aW9uczoge1xuICAgICAgICAgICcvYXBpL2FwcGxpYW5jZXMvR0VUJzoge1xuICAgICAgICAgICAgY2FjaGluZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnTXlIYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSAke2hhbmRsZXJDb2RlfWApLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdjEgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgndjEnKTtcblxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaGFuZGxlcik7XG5cbiAgICBjb25zdCB0b3lzID0gdjEuYWRkUmVzb3VyY2UoJ3RveXMnKTtcbiAgICBjb25zdCBnZXRUb3lzTWV0aG9kOiBhcGlnYXRld2F5Lk1ldGhvZCA9IHRveXMuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZ3JhdGlvbiwgeyBhcGlLZXlSZXF1aXJlZDogdHJ1ZSB9KTtcbiAgICB0b3lzLmFkZE1ldGhvZCgnUE9TVCcpO1xuICAgIHRveXMuYWRkTWV0aG9kKCdQVVQnKTtcblxuICAgIGNvbnN0IGFwcGxpYW5jZXMgPSB2MS5hZGRSZXNvdXJjZSgnYXBwbGlhbmNlczphbGwnKTtcbiAgICBhcHBsaWFuY2VzLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICBjb25zdCBib29rcyA9IHYxLmFkZFJlc291cmNlKCdib29rcycpO1xuICAgIGJvb2tzLmFkZE1ldGhvZCgnR0VUJywgaW50ZWdyYXRpb24pO1xuICAgIGJvb2tzLmFkZE1ldGhvZCgnUE9TVCcsIGludGVncmF0aW9uKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZXJDb2RlKGV2ZW50OiBhbnksIF86IGFueSwgY2FsbGJhY2s6IGFueSkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHVuZGVmaW5lZCwge1xuICAgICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgIGhlYWRlcnM6IHsgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShldmVudCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBhcGkuYWRkQXBpS2V5KCdBcGlLZXknKTtcbiAgICBjb25zdCBwbGFuID0gYXBpLmFkZFVzYWdlUGxhbignVXNhZ2VQbGFuJywge1xuICAgICAgbmFtZTogJ0Jhc2ljJyxcbiAgICAgIGFwaUtleToga2V5LFxuICAgICAgZGVzY3JpcHRpb246ICdGcmVlIHRpZXIgbW9udGhseSB1c2FnZSBwbGFuJyxcbiAgICAgIHRocm90dGxlOiB7IHJhdGVMaW1pdDogNSB9LFxuICAgICAgcXVvdGE6IHtcbiAgICAgICAgbGltaXQ6IDEwMDAwLFxuICAgICAgICBwZXJpb2Q6IGFwaWdhdGV3YXkuUGVyaW9kLk1PTlRILFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBwbGFuLmFkZEFwaVN0YWdlKHtcbiAgICAgIHN0YWdlOiBhcGkuZGVwbG95bWVudFN0YWdlLFxuICAgICAgdGhyb3R0bGU6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1ldGhvZDogZ2V0VG95c01ldGhvZCxcbiAgICAgICAgICB0aHJvdHRsZToge1xuICAgICAgICAgICAgcmF0ZUxpbWl0OiAxMCxcbiAgICAgICAgICAgIGJ1cnN0TGltaXQ6IDIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB0ZXN0RGVwbG95ID0gbmV3IGFwaWdhdGV3YXkuRGVwbG95bWVudCh0aGlzLCAnVGVzdERlcGxveW1lbnQnLCB7XG4gICAgICBhcGksXG4gICAgICByZXRhaW5EZXBsb3ltZW50czogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3QgdGVzdFN0YWdlID0gbmV3IGFwaWdhdGV3YXkuU3RhZ2UodGhpcywgJ1Rlc3RTdGFnZScsIHtcbiAgICAgIGRlcGxveW1lbnQ6IHRlc3REZXBsb3ksXG4gICAgfSk7XG4gICAgdGVzdFN0YWdlLmFkZEFwaUtleSgnTXlUZXN0QXBpS2V5Jyk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdChhcHAsICd0ZXN0LWFwaWdhdGV3YXktcmVzdGFwaScpO1xubmV3IEludGVnVGVzdChhcHAsICdhcGlnYXRld2F5LXJlc3RhcGknLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuXG4iXX0=