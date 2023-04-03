"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'IntegConnectionStack');
const connection = new lib_1.Connection(stack, 'Connection', {
    authorization: lib_1.Authorization.apiKey('keyname', core_1.SecretValue.unsafePlainText('keyvalue')),
    headerParameters: {
        'content-type': lib_1.HttpParameter.fromString('application/json'),
    },
});
const testCase = new integ_tests_1.IntegTest(app, 'ConnectionTest', {
    testCases: [stack],
});
const deployedConncention = testCase.assertions.awsApiCall('EventBridge', 'describeConnection', { Name: connection.connectionName });
deployedConncention.expect(integ_tests_1.ExpectedResult.objectLike({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0Q7QUFDeEQsc0RBQXFGO0FBQ3JGLGdDQUFrRTtBQUVsRSxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBRXJELE1BQU0sVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ3JELGFBQWEsRUFBRSxtQkFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsa0JBQVcsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkYsZ0JBQWdCLEVBQUU7UUFDaEIsY0FBYyxFQUFFLG1CQUFhLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0tBQzdEO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxRQUFRLEdBQUcsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRTtJQUNwRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFFckksbUJBQW1CLENBQUMsTUFBTSxDQUFDLDRCQUFjLENBQUMsVUFBVSxDQUFDO0lBQ25ELGNBQWMsRUFBRTtRQUNkLG9CQUFvQixFQUFFO1lBQ3BCLFVBQVUsRUFBRSxTQUFTO1NBQ3RCO1FBQ0Qsd0JBQXdCLEVBQUU7WUFDeEIsZ0JBQWdCLEVBQUU7Z0JBQ2hCO29CQUNFLEdBQUcsRUFBRSxjQUFjO29CQUNuQixLQUFLLEVBQUUsa0JBQWtCO29CQUN6QixhQUFhLEVBQUUsS0FBSztpQkFDckI7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMsQ0FBQztBQUVKLE1BQU0saUJBQWlCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQXVCLENBQUM7QUFDckcsaUJBQWlCLENBQUMsNkJBQTZCLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFNlY3JldFZhbHVlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXNzZXJ0aW9uc1Byb3ZpZGVyLCBFeHBlY3RlZFJlc3VsdCwgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQXV0aG9yaXphdGlvbiwgQ29ubmVjdGlvbiwgSHR0cFBhcmFtZXRlciB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnSW50ZWdDb25uZWN0aW9uU3RhY2snKTtcblxuY29uc3QgY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKHN0YWNrLCAnQ29ubmVjdGlvbicsIHtcbiAgYXV0aG9yaXphdGlvbjogQXV0aG9yaXphdGlvbi5hcGlLZXkoJ2tleW5hbWUnLCBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ2tleXZhbHVlJykpLFxuICBoZWFkZXJQYXJhbWV0ZXJzOiB7XG4gICAgJ2NvbnRlbnQtdHlwZSc6IEh0dHBQYXJhbWV0ZXIuZnJvbVN0cmluZygnYXBwbGljYXRpb24vanNvbicpLFxuICB9LFxufSk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnQ29ubmVjdGlvblRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5jb25zdCBkZXBsb3llZENvbm5jZW50aW9uID0gdGVzdENhc2UuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdFdmVudEJyaWRnZScsICdkZXNjcmliZUNvbm5lY3Rpb24nLCB7IE5hbWU6IGNvbm5lY3Rpb24uY29ubmVjdGlvbk5hbWUgfSk7XG5cbmRlcGxveWVkQ29ubmNlbnRpb24uZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBBdXRoUGFyYW1ldGVyczoge1xuICAgIEFwaUtleUF1dGhQYXJhbWV0ZXJzOiB7XG4gICAgICBBcGlLZXlOYW1lOiAna2V5bmFtZScsXG4gICAgfSxcbiAgICBJbnZvY2F0aW9uSHR0cFBhcmFtZXRlcnM6IHtcbiAgICAgIEhlYWRlclBhcmFtZXRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2NvbnRlbnQtdHlwZScsXG4gICAgICAgICAgVmFsdWU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICBJc1ZhbHVlU2VjcmV0OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbn0pKTtcblxuY29uc3QgYXNzZXJ0aW9uUHJvdmlkZXIgPSBkZXBsb3llZENvbm5jZW50aW9uLm5vZGUudHJ5RmluZENoaWxkKCdTZGtQcm92aWRlcicpIGFzIEFzc2VydGlvbnNQcm92aWRlcjtcbmFzc2VydGlvblByb3ZpZGVyLmFkZFBvbGljeVN0YXRlbWVudEZyb21TZGtDYWxsKCdldmVudHMnLCAnRGVzY3JpYmVDb25uZWN0aW9uJyk7XG4iXX0=