"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apigateway = require("../lib");
class Test extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const api = new apigateway.SpecRestApi(this, 'my-api', {
            apiDefinition: apigateway.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml')),
            disableExecuteApiEndpoint: true,
            minCompressionSize: core_1.Size.bytes(1024),
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
new integ_tests_1.IntegTest(app, 'apigateway-spec-restapi', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3BlYy1yZXN0YXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc3BlYy1yZXN0YXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDhDQUE4QztBQUM5QyxxQ0FBcUM7QUFDckMsd0NBQXFDO0FBQ3JDLHNEQUFpRDtBQUNqRCxxQ0FBcUM7QUFFckMsTUFBTSxJQUFLLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDMUIsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3JELGFBQWEsRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ2pHLHlCQUF5QixFQUFFLElBQUk7WUFDL0Isa0JBQWtCLEVBQUUsV0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUU7Z0JBQ2IsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFdBQVcsRUFBRSxZQUFZO2dCQUN6QixZQUFZLEVBQUUsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUk7Z0JBQ2hELGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGFBQWEsRUFBRTtvQkFDYixxQkFBcUIsRUFBRTt3QkFDckIsY0FBYyxFQUFFLElBQUk7cUJBQ3JCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsV0FBVyxFQUFFLENBQUM7WUFDaEUsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxNQUFNLGFBQWEsR0FBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXJDLFNBQVMsV0FBVyxDQUFDLEtBQVUsRUFBRSxDQUFNLEVBQUUsUUFBYTtZQUNwRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3pCLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixVQUFVLEVBQUUsR0FBRztnQkFDZixPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7Z0JBQy9DLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQzthQUM1QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUN6QyxJQUFJLEVBQUUsT0FBTztZQUNiLE1BQU0sRUFBRSxHQUFHO1lBQ1gsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO1lBQzFCLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsS0FBSztnQkFDWixNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNmLEtBQUssRUFBRSxHQUFHLENBQUMsZUFBZTtZQUMxQixRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLFFBQVEsRUFBRTt3QkFDUixTQUFTLEVBQUUsRUFBRTt3QkFDYixVQUFVLEVBQUUsQ0FBQztxQkFDZDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQy9ELElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLEVBQUU7SUFDNUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3QgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5TcGVjUmVzdEFwaSh0aGlzLCAnbXktYXBpJywge1xuICAgICAgYXBpRGVmaW5pdGlvbjogYXBpZ2F0ZXdheS5BcGlEZWZpbml0aW9uLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnc2FtcGxlLWRlZmluaXRpb24ueWFtbCcpKSxcbiAgICAgIGRpc2FibGVFeGVjdXRlQXBpRW5kcG9pbnQ6IHRydWUsXG4gICAgICBtaW5Db21wcmVzc2lvblNpemU6IFNpemUuYnl0ZXMoMTAyNCksXG4gICAgICByZXRhaW5EZXBsb3ltZW50czogdHJ1ZSxcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiB0cnVlLFxuICAgICAgZGVwbG95T3B0aW9uczoge1xuICAgICAgICBjYWNoZUNsdXN0ZXJFbmFibGVkOiB0cnVlLFxuICAgICAgICBzdGFnZU5hbWU6ICdiZXRhJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdiZXRhIHN0YWdlJyxcbiAgICAgICAgbG9nZ2luZ0xldmVsOiBhcGlnYXRld2F5Lk1ldGhvZExvZ2dpbmdMZXZlbC5JTkZPLFxuICAgICAgICBkYXRhVHJhY2VFbmFibGVkOiB0cnVlLFxuICAgICAgICBtZXRob2RPcHRpb25zOiB7XG4gICAgICAgICAgJy9hcGkvYXBwbGlhbmNlcy9HRVQnOiB7XG4gICAgICAgICAgICBjYWNoaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdNeUhhbmRsZXInLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYGV4cG9ydHMuaGFuZGxlciA9ICR7aGFuZGxlckNvZGV9YCksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBjb25zdCB2MSA9IGFwaS5yb290LmFkZFJlc291cmNlKCd2MScpO1xuXG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihoYW5kbGVyKTtcblxuICAgIGNvbnN0IHRveXMgPSB2MS5hZGRSZXNvdXJjZSgndG95cycpO1xuICAgIGNvbnN0IGdldFRveXNNZXRob2Q6IGFwaWdhdGV3YXkuTWV0aG9kID0gdG95cy5hZGRNZXRob2QoJ0dFVCcsIGludGVncmF0aW9uLCB7IGFwaUtleVJlcXVpcmVkOiB0cnVlIH0pO1xuICAgIHRveXMuYWRkTWV0aG9kKCdQT1NUJyk7XG4gICAgdG95cy5hZGRNZXRob2QoJ1BVVCcpO1xuXG4gICAgY29uc3QgYXBwbGlhbmNlcyA9IHYxLmFkZFJlc291cmNlKCdhcHBsaWFuY2VzJyk7XG4gICAgYXBwbGlhbmNlcy5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgY29uc3QgYm9va3MgPSB2MS5hZGRSZXNvdXJjZSgnYm9va3MnKTtcbiAgICBib29rcy5hZGRNZXRob2QoJ0dFVCcsIGludGVncmF0aW9uKTtcbiAgICBib29rcy5hZGRNZXRob2QoJ1BPU1QnLCBpbnRlZ3JhdGlvbik7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVyQ29kZShldmVudDogYW55LCBfOiBhbnksIGNhbGxiYWNrOiBhbnkpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayh1bmRlZmluZWQsIHtcbiAgICAgICAgaXNCYXNlNjRFbmNvZGVkOiBmYWxzZSxcbiAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICBoZWFkZXJzOiB7ICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnQpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5ID0gYXBpLmFkZEFwaUtleSgnQXBpS2V5Jyk7XG4gICAgY29uc3QgcGxhbiA9IGFwaS5hZGRVc2FnZVBsYW4oJ1VzYWdlUGxhbicsIHtcbiAgICAgIG5hbWU6ICdCYXNpYycsXG4gICAgICBhcGlLZXk6IGtleSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRnJlZSB0aWVyIG1vbnRobHkgdXNhZ2UgcGxhbicsXG4gICAgICB0aHJvdHRsZTogeyByYXRlTGltaXQ6IDUgfSxcbiAgICAgIHF1b3RhOiB7XG4gICAgICAgIGxpbWl0OiAxMDAwMCxcbiAgICAgICAgcGVyaW9kOiBhcGlnYXRld2F5LlBlcmlvZC5NT05USCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcGxhbi5hZGRBcGlTdGFnZSh7XG4gICAgICBzdGFnZTogYXBpLmRlcGxveW1lbnRTdGFnZSxcbiAgICAgIHRocm90dGxlOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtZXRob2Q6IGdldFRveXNNZXRob2QsXG4gICAgICAgICAgdGhyb3R0bGU6IHtcbiAgICAgICAgICAgIHJhdGVMaW1pdDogMTAsXG4gICAgICAgICAgICBidXJzdExpbWl0OiAyLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3QoYXBwLCAndGVzdC1hcGlnYXRld2F5LXNwZWMtcmVzdGFwaScpO1xubmV3IEludGVnVGVzdChhcHAsICdhcGlnYXRld2F5LXNwZWMtcmVzdGFwaScsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7Il19