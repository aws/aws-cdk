"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class Test extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const api = new apigateway.SpecRestApi(this, 'my-api', {
            apiDefinition: apigateway.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml')),
            disableExecuteApiEndpoint: true,
            minCompressionSize: aws_cdk_lib_1.Size.bytes(1024),
            retainDeployments: true,
            cloudWatchRole: true,
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
        const appliances = v1.addResource('appliances');
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
    }
}
const app = new cdk.App();
const testCase = new Test(app, 'test-apigateway-spec-restapi');
new integ_tests_alpha_1.IntegTest(app, 'apigateway-spec-restapi', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3BlYy1yZXN0YXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc3BlYy1yZXN0YXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLGlEQUFpRDtBQUNqRCxtQ0FBbUM7QUFDbkMsNkNBQW1DO0FBQ25DLGtFQUF1RDtBQUN2RCx5REFBeUQ7QUFFekQsTUFBTSxJQUFLLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDMUIsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3JELGFBQWEsRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ2pHLHlCQUF5QixFQUFFLElBQUk7WUFDL0Isa0JBQWtCLEVBQUUsa0JBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3BDLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsY0FBYyxFQUFFLElBQUk7WUFDcEIsYUFBYSxFQUFFO2dCQUNiLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixXQUFXLEVBQUUsWUFBWTtnQkFDekIsWUFBWSxFQUFFLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO2dCQUNoRCxnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixhQUFhLEVBQUU7b0JBQ2IscUJBQXFCLEVBQUU7d0JBQ3JCLGNBQWMsRUFBRSxJQUFJO3FCQUNyQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDckQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLFdBQVcsRUFBRSxDQUFDO1lBQ2hFLE9BQU8sRUFBRSxlQUFlO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRDLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTlELE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsTUFBTSxhQUFhLEdBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3RHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hELFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVyQyxTQUFTLFdBQVcsQ0FBQyxLQUFVLEVBQUUsQ0FBTSxFQUFFLFFBQWE7WUFDcEQsT0FBTyxRQUFRLENBQUMsU0FBUyxFQUFFO2dCQUN6QixlQUFlLEVBQUUsS0FBSztnQkFDdEIsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO2dCQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDekMsSUFBSSxFQUFFLE9BQU87WUFDYixNQUFNLEVBQUUsR0FBRztZQUNYLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtZQUMxQixLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSzthQUNoQztTQUNGLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUM7WUFDZixLQUFLLEVBQUUsR0FBRyxDQUFDLGVBQWU7WUFDMUIsUUFBUSxFQUFFO2dCQUNSO29CQUNFLE1BQU0sRUFBRSxhQUFhO29CQUNyQixRQUFRLEVBQUU7d0JBQ1IsU0FBUyxFQUFFLEVBQUU7d0JBQ2IsVUFBVSxFQUFFLENBQUM7cUJBQ2Q7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQy9ELElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLEVBQUU7SUFDNUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgU2l6ZSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5jbGFzcyBUZXN0IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuU3BlY1Jlc3RBcGkodGhpcywgJ215LWFwaScsIHtcbiAgICAgIGFwaURlZmluaXRpb246IGFwaWdhdGV3YXkuQXBpRGVmaW5pdGlvbi5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ3NhbXBsZS1kZWZpbml0aW9uLnlhbWwnKSksXG4gICAgICBkaXNhYmxlRXhlY3V0ZUFwaUVuZHBvaW50OiB0cnVlLFxuICAgICAgbWluQ29tcHJlc3Npb25TaXplOiBTaXplLmJ5dGVzKDEwMjQpLFxuICAgICAgcmV0YWluRGVwbG95bWVudHM6IHRydWUsXG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgY2FjaGVDbHVzdGVyRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgc3RhZ2VOYW1lOiAnYmV0YScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYmV0YSBzdGFnZScsXG4gICAgICAgIGxvZ2dpbmdMZXZlbDogYXBpZ2F0ZXdheS5NZXRob2RMb2dnaW5nTGV2ZWwuSU5GTyxcbiAgICAgICAgZGF0YVRyYWNlRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgbWV0aG9kT3B0aW9uczoge1xuICAgICAgICAgICcvYXBpL2FwcGxpYW5jZXMvR0VUJzoge1xuICAgICAgICAgICAgY2FjaGluZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnTXlIYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSAke2hhbmRsZXJDb2RlfWApLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdjEgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgndjEnKTtcblxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaGFuZGxlcik7XG5cbiAgICBjb25zdCB0b3lzID0gdjEuYWRkUmVzb3VyY2UoJ3RveXMnKTtcbiAgICBjb25zdCBnZXRUb3lzTWV0aG9kOiBhcGlnYXRld2F5Lk1ldGhvZCA9IHRveXMuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZ3JhdGlvbiwgeyBhcGlLZXlSZXF1aXJlZDogdHJ1ZSB9KTtcbiAgICB0b3lzLmFkZE1ldGhvZCgnUE9TVCcpO1xuICAgIHRveXMuYWRkTWV0aG9kKCdQVVQnKTtcblxuICAgIGNvbnN0IGFwcGxpYW5jZXMgPSB2MS5hZGRSZXNvdXJjZSgnYXBwbGlhbmNlcycpO1xuICAgIGFwcGxpYW5jZXMuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIGNvbnN0IGJvb2tzID0gdjEuYWRkUmVzb3VyY2UoJ2Jvb2tzJyk7XG4gICAgYm9va3MuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZ3JhdGlvbik7XG4gICAgYm9va3MuYWRkTWV0aG9kKCdQT1NUJywgaW50ZWdyYXRpb24pO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlckNvZGUoZXZlbnQ6IGFueSwgXzogYW55LCBjYWxsYmFjazogYW55KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodW5kZWZpbmVkLCB7XG4gICAgICAgIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG4gICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgICAgaGVhZGVyczogeyAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50KSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGtleSA9IGFwaS5hZGRBcGlLZXkoJ0FwaUtleScpO1xuICAgIGNvbnN0IHBsYW4gPSBhcGkuYWRkVXNhZ2VQbGFuKCdVc2FnZVBsYW4nLCB7XG4gICAgICBuYW1lOiAnQmFzaWMnLFxuICAgICAgYXBpS2V5OiBrZXksXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZyZWUgdGllciBtb250aGx5IHVzYWdlIHBsYW4nLFxuICAgICAgdGhyb3R0bGU6IHsgcmF0ZUxpbWl0OiA1IH0sXG4gICAgICBxdW90YToge1xuICAgICAgICBsaW1pdDogMTAwMDAsXG4gICAgICAgIHBlcmlvZDogYXBpZ2F0ZXdheS5QZXJpb2QuTU9OVEgsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHBsYW4uYWRkQXBpU3RhZ2Uoe1xuICAgICAgc3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2UsXG4gICAgICB0aHJvdHRsZTogW1xuICAgICAgICB7XG4gICAgICAgICAgbWV0aG9kOiBnZXRUb3lzTWV0aG9kLFxuICAgICAgICAgIHRocm90dGxlOiB7XG4gICAgICAgICAgICByYXRlTGltaXQ6IDEwLFxuICAgICAgICAgICAgYnVyc3RMaW1pdDogMixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBUZXN0KGFwcCwgJ3Rlc3QtYXBpZ2F0ZXdheS1zcGVjLXJlc3RhcGknKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBpZ2F0ZXdheS1zcGVjLXJlc3RhcGknLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pOyJdfQ==