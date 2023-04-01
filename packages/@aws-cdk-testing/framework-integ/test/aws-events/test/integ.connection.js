"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'IntegConnectionStack');
const connection = new aws_events_1.Connection(stack, 'Connection', {
    authorization: aws_events_1.Authorization.apiKey('keyname', aws_cdk_lib_1.SecretValue.unsafePlainText('keyvalue')),
    headerParameters: {
        'content-type': aws_events_1.HttpParameter.fromString('application/json'),
    },
});
const testCase = new integ_tests_alpha_1.IntegTest(app, 'ConnectionTest', {
    testCases: [stack],
});
const deployedConncention = testCase.assertions.awsApiCall('EventBridge', 'describeConnection', { Name: connection.connectionName });
deployedConncention.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    AuthParameters: {
        ApiKeyAuthParameters: {
            ApiKeyName: 'keyname',
        },
        InvocationHttpParameters: {
            HeaderParameters: [
                {
                    Key: 'content-type',
                    Value: 'application/json',
                    IsValueSecret: false,
                },
            ],
        },
    },
}));
const assertionProvider = deployedConncention.node.tryFindChild('SdkProvider');
assertionProvider.addPolicyStatementFromSdkCall('events', 'DescribeConnection');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBc0Q7QUFDdEQsa0VBQTJGO0FBQzNGLHVEQUFrRjtBQUVsRixNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFFckQsTUFBTSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDckQsYUFBYSxFQUFFLDBCQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSx5QkFBVyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RixnQkFBZ0IsRUFBRTtRQUNoQixjQUFjLEVBQUUsMEJBQWEsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUM7S0FDN0Q7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLFFBQVEsR0FBRyxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFO0lBQ3BELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxNQUFNLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztBQUVySSxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsa0NBQWMsQ0FBQyxVQUFVLENBQUM7SUFDbkQsY0FBYyxFQUFFO1FBQ2Qsb0JBQW9CLEVBQUU7WUFDcEIsVUFBVSxFQUFFLFNBQVM7U0FDdEI7UUFDRCx3QkFBd0IsRUFBRTtZQUN4QixnQkFBZ0IsRUFBRTtnQkFDaEI7b0JBQ0UsR0FBRyxFQUFFLGNBQWM7b0JBQ25CLEtBQUssRUFBRSxrQkFBa0I7b0JBQ3pCLGFBQWEsRUFBRSxLQUFLO2lCQUNyQjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQyxDQUFDO0FBRUosTUFBTSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBdUIsQ0FBQztBQUNyRyxpQkFBaUIsQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU2VjcmV0VmFsdWUsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQXNzZXJ0aW9uc1Byb3ZpZGVyLCBFeHBlY3RlZFJlc3VsdCwgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQXV0aG9yaXphdGlvbiwgQ29ubmVjdGlvbiwgSHR0cFBhcmFtZXRlciB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ0ludGVnQ29ubmVjdGlvblN0YWNrJyk7XG5cbmNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihzdGFjaywgJ0Nvbm5lY3Rpb24nLCB7XG4gIGF1dGhvcml6YXRpb246IEF1dGhvcml6YXRpb24uYXBpS2V5KCdrZXluYW1lJywgU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdrZXl2YWx1ZScpKSxcbiAgaGVhZGVyUGFyYW1ldGVyczoge1xuICAgICdjb250ZW50LXR5cGUnOiBIdHRwUGFyYW1ldGVyLmZyb21TdHJpbmcoJ2FwcGxpY2F0aW9uL2pzb24nKSxcbiAgfSxcbn0pO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgSW50ZWdUZXN0KGFwcCwgJ0Nvbm5lY3Rpb25UZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuY29uc3QgZGVwbG95ZWRDb25uY2VudGlvbiA9IHRlc3RDYXNlLmFzc2VydGlvbnMuYXdzQXBpQ2FsbCgnRXZlbnRCcmlkZ2UnLCAnZGVzY3JpYmVDb25uZWN0aW9uJywgeyBOYW1lOiBjb25uZWN0aW9uLmNvbm5lY3Rpb25OYW1lIH0pO1xuXG5kZXBsb3llZENvbm5jZW50aW9uLmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgQXV0aFBhcmFtZXRlcnM6IHtcbiAgICBBcGlLZXlBdXRoUGFyYW1ldGVyczoge1xuICAgICAgQXBpS2V5TmFtZTogJ2tleW5hbWUnLFxuICAgIH0sXG4gICAgSW52b2NhdGlvbkh0dHBQYXJhbWV0ZXJzOiB7XG4gICAgICBIZWFkZXJQYXJhbWV0ZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdjb250ZW50LXR5cGUnLFxuICAgICAgICAgIFZhbHVlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgSXNWYWx1ZVNlY3JldDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG59KSk7XG5cbmNvbnN0IGFzc2VydGlvblByb3ZpZGVyID0gZGVwbG95ZWRDb25uY2VudGlvbi5ub2RlLnRyeUZpbmRDaGlsZCgnU2RrUHJvdmlkZXInKSBhcyBBc3NlcnRpb25zUHJvdmlkZXI7XG5hc3NlcnRpb25Qcm92aWRlci5hZGRQb2xpY3lTdGF0ZW1lbnRGcm9tU2RrQ2FsbCgnZXZlbnRzJywgJ0Rlc2NyaWJlQ29ubmVjdGlvbicpO1xuIl19