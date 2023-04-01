"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const appsync = require("aws-cdk-lib/aws-appsync");
class GraphQLApiLambdaAuthStack extends cdk.Stack {
    constructor(scope) {
        super(scope, 'appsync-lambda-auth');
        const func = new lambda.Function(this, 'func', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'verify/lambda-tutorial')),
            handler: 'lambda-tutorial.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        new appsync.GraphqlApi(this, 'api1', {
            name: 'api1',
            schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.LAMBDA,
                    lambdaAuthorizerConfig: {
                        handler: func,
                    },
                },
            },
        });
        new appsync.GraphqlApi(this, 'api2', {
            name: 'api2',
            schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.LAMBDA,
                    lambdaAuthorizerConfig: {
                        handler: func,
                    },
                },
            },
        });
    }
}
const app = new cdk.App();
const testCase = new GraphQLApiLambdaAuthStack(app);
new integ_tests_alpha_1.IntegTest(app, 'GraphQlApiLambdaAuth', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWF1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5sYW1iZGEtYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QixpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUV2RCxtREFBbUQ7QUFFbkQsTUFBTSx5QkFBMEIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUVwQyxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUM3QyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHdCQUF3QixDQUFDLENBQy9DO1lBQ0QsT0FBTyxFQUFFLHlCQUF5QjtZQUNsQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ25DLElBQUksRUFBRSxNQUFNO1lBQ1osTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUM3QztZQUNELG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU07b0JBQ25ELHNCQUFzQixFQUFFO3dCQUN0QixPQUFPLEVBQUUsSUFBSTtxQkFDZDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDbkMsSUFBSSxFQUFFLE1BQU07WUFDWixNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQzdDO1lBQ0QsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsTUFBTTtvQkFDbkQsc0JBQXNCLEVBQUU7d0JBQ3RCLE9BQU8sRUFBRSxJQUFJO3FCQUNkO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BELElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDekMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcHBzeW5jJztcblxuY2xhc3MgR3JhcGhRTEFwaUxhbWJkYUF1dGhTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ2FwcHN5bmMtbGFtYmRhLWF1dGgnKTtcblxuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdmdW5jJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAndmVyaWZ5L2xhbWJkYS10dXRvcmlhbCcpLFxuICAgICAgKSxcbiAgICAgIGhhbmRsZXI6ICdsYW1iZGEtdHV0b3JpYWwuaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ2FwaTEnLCB7XG4gICAgICBuYW1lOiAnYXBpMScsXG4gICAgICBzY2hlbWE6IGFwcHN5bmMuU2NoZW1hRmlsZS5mcm9tQXNzZXQoXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICdhcHBzeW5jLnRlc3QuZ3JhcGhxbCcpLFxuICAgICAgKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5MQU1CREEsXG4gICAgICAgICAgbGFtYmRhQXV0aG9yaXplckNvbmZpZzoge1xuICAgICAgICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ2FwaTInLCB7XG4gICAgICBuYW1lOiAnYXBpMicsXG4gICAgICBzY2hlbWE6IGFwcHN5bmMuU2NoZW1hRmlsZS5mcm9tQXNzZXQoXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICdhcHBzeW5jLnRlc3QuZ3JhcGhxbCcpLFxuICAgICAgKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5MQU1CREEsXG4gICAgICAgICAgbGFtYmRhQXV0aG9yaXplckNvbmZpZzoge1xuICAgICAgICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgR3JhcGhRTEFwaUxhbWJkYUF1dGhTdGFjayhhcHApO1xubmV3IEludGVnVGVzdChhcHAsICdHcmFwaFFsQXBpTGFtYmRhQXV0aCcsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19