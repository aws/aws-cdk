"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRequest = exports.MOCK_ASSUME_ROLE_ARN = exports.MOCK_PROPS = exports.client = exports.MOCK_UPDATE_STATUS_ID = exports.reset = exports.simulateResponse = exports.actualRequest = void 0;
/**
 * Request objects will be assigned when a request of the relevant type will be
 * made.
 */
exports.actualRequest = {};
/**
 * Responses can be simulated by assigning values here.
 */
exports.simulateResponse = {};
function reset() {
    exports.actualRequest = {};
    exports.simulateResponse = {};
}
exports.reset = reset;
exports.MOCK_UPDATE_STATUS_ID = 'MockEksUpdateStatusId';
exports.client = {
    configureAssumeRole: req => {
        exports.actualRequest.configureAssumeRoleRequest = req;
    },
    createCluster: async (req) => {
        exports.actualRequest.createClusterRequest = req;
        return {
            cluster: {
                name: req.name,
                roleArn: req.roleArn,
                version: '1.0',
                arn: `arn:${req.name}`,
                certificateAuthority: { data: 'certificateAuthority-data' },
                status: 'CREATING',
            },
        };
    },
    deleteCluster: async (req) => {
        exports.actualRequest.deleteClusterRequest = req;
        if (exports.simulateResponse.deleteClusterErrorCode) {
            const e = new Error('mock error');
            e.code = exports.simulateResponse.deleteClusterErrorCode;
            throw e;
        }
        return {
            cluster: {
                name: req.name,
            },
        };
    },
    describeCluster: async (req) => {
        exports.actualRequest.describeClusterRequest = req;
        if (exports.simulateResponse.describeClusterExceptionCode) {
            const e = new Error('mock exception');
            e.code = exports.simulateResponse.describeClusterExceptionCode;
            throw e;
        }
        return {
            cluster: {
                name: req.name,
                version: '1.0',
                roleArn: 'arn:role',
                arn: 'arn:cluster-arn',
                certificateAuthority: { data: 'certificateAuthority-data' },
                endpoint: 'http://endpoint',
                status: exports.simulateResponse.describeClusterResponseMockStatus || 'ACTIVE',
            },
        };
    },
    describeUpdate: async (req) => {
        exports.actualRequest.describeUpdateRequest = req;
        return {
            update: {
                id: req.updateId,
                errors: exports.simulateResponse.describeUpdateResponseMockErrors,
                status: exports.simulateResponse.describeUpdateResponseMockStatus,
            },
        };
    },
    updateClusterConfig: async (req) => {
        exports.actualRequest.updateClusterConfigRequest = req;
        return {
            update: {
                id: exports.MOCK_UPDATE_STATUS_ID,
            },
        };
    },
    updateClusterVersion: async (req) => {
        exports.actualRequest.updateClusterVersionRequest = req;
        return {
            update: {
                id: exports.MOCK_UPDATE_STATUS_ID,
            },
        };
    },
    createFargateProfile: async (req) => {
        exports.actualRequest.createFargateProfile = req;
        return {};
    },
    describeFargateProfile: async (req) => {
        exports.actualRequest.describeFargateProfile = req;
        return {};
    },
    deleteFargateProfile: async (req) => {
        exports.actualRequest.deleteFargateProfile = req;
        return {};
    },
};
exports.MOCK_PROPS = {
    roleArn: 'arn:of:role',
    resourcesVpcConfig: {
        subnetIds: ['subnet1', 'subnet2'],
        securityGroupIds: ['sg1', 'sg2', 'sg3'],
    },
};
exports.MOCK_ASSUME_ROLE_ARN = 'assume:role:arn';
function newRequest(requestType, props, oldProps) {
    return {
        StackId: 'fake-stack-id',
        RequestId: 'fake-request-id',
        ResourceType: 'Custom::EKSCluster',
        ServiceToken: 'boom',
        LogicalResourceId: 'MyResourceId',
        PhysicalResourceId: 'physical-resource-id',
        ResponseURL: 'http://response-url',
        RequestType: requestType,
        OldResourceProperties: {
            Config: oldProps,
            AssumeRoleArn: exports.MOCK_ASSUME_ROLE_ARN,
        },
        ResourceProperties: {
            ServiceToken: 'boom',
            Config: props,
            AssumeRoleArn: exports.MOCK_ASSUME_ROLE_ARN,
        },
    };
}
exports.newRequest = newRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci1yZXNvdXJjZS1oYW5kbGVyLW1vY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2x1c3Rlci1yZXNvdXJjZS1oYW5kbGVyLW1vY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBOzs7R0FHRztBQUNRLFFBQUEsYUFBYSxHQVdwQixFQUFHLENBQUM7QUFFUjs7R0FFRztBQUNRLFFBQUEsZ0JBQWdCLEdBTXZCLEVBQUcsQ0FBQztBQUVSLFNBQWdCLEtBQUs7SUFDbkIscUJBQWEsR0FBRyxFQUFHLENBQUM7SUFDcEIsd0JBQWdCLEdBQUcsRUFBRyxDQUFDO0FBQ3pCLENBQUM7QUFIRCxzQkFHQztBQUVZLFFBQUEscUJBQXFCLEdBQUcsdUJBQXVCLENBQUM7QUFFaEQsUUFBQSxNQUFNLEdBQWM7SUFFL0IsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLEVBQUU7UUFDekIscUJBQWEsQ0FBQywwQkFBMEIsR0FBRyxHQUFHLENBQUM7SUFDakQsQ0FBQztJQUVELGFBQWEsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7UUFDekIscUJBQWEsQ0FBQyxvQkFBb0IsR0FBRyxHQUFHLENBQUM7UUFDekMsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7Z0JBQ2QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2dCQUNwQixPQUFPLEVBQUUsS0FBSztnQkFDZCxHQUFHLEVBQUUsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFO2dCQUN0QixvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRTtnQkFDM0QsTUFBTSxFQUFFLFVBQVU7YUFDbkI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELGFBQWEsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7UUFDekIscUJBQWEsQ0FBQyxvQkFBb0IsR0FBRyxHQUFHLENBQUM7UUFDekMsSUFBSSx3QkFBZ0IsQ0FBQyxzQkFBc0IsRUFB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aUJBQWlCLENBQUM7QUFFdEQsU0FBZ0IsVUFBVSxDQUN4QixXQUFjLEVBQ2QsS0FBNkMsRUFDN0MsUUFBZ0Q7SUFDaEQsT0FBTztRQUNMLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLFNBQVMsRUFBRSxpQkFBaUI7UUFDNUIsWUFBWSxFQUFFLG9CQUFvQjtRQUNsQyxZQUFZLEVBQUUsTUFBTTtRQUNwQixpQkFBaUIsRUFBRSxjQUFjO1FBQ2pDLGtCQUFrQixFQUFFLHNCQUFzQjtRQUMxQyxXQUFXLEVBQUUscUJBQXFCO1FBQ2xDLFdBQVcsRUFBRSxXQUFXO1FBQ3hCLHFCQUFxQixFQUFFO1lBQ3JCLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLGFBQWEsRUFBRSw0QkFBb0I7U0FDcEM7UUFDRCxrQkFBa0IsRUFBRTtZQUNsQixZQUFZLEVBQUUsTUFBTTtZQUNwQixNQUFNLEVBQUUsS0FBSztZQUNiLGFBQWEsRUFBRSw0QkFBb0I7U0FDcEM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQXZCRCxnQ0F1QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZGsgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgeyBFa3NDbGllbnQgfSBmcm9tICcuLi9saWIvY2x1c3Rlci1yZXNvdXJjZS1oYW5kbGVyL2NvbW1vbic7XG5cbi8qKlxuICogUmVxdWVzdCBvYmplY3RzIHdpbGwgYmUgYXNzaWduZWQgd2hlbiBhIHJlcXVlc3Qgb2YgdGhlIHJlbGV2YW50IHR5cGUgd2lsbCBiZVxuICogbWFkZS5cbiAqL1xuZXhwb3J0IGxldCBhY3R1YWxSZXF1ZXN0OiB7XG4gIGNvbmZpZ3VyZUFzc3VtZVJvbGVSZXF1ZXN0Pzogc2RrLlNUUy5Bc3N1bWVSb2xlUmVxdWVzdDtcbiAgY3JlYXRlQ2x1c3RlclJlcXVlc3Q/OiBzZGsuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0O1xuICBkZXNjcmliZUNsdXN0ZXJSZXF1ZXN0Pzogc2RrLkVLUy5EZXNjcmliZUNsdXN0ZXJSZXF1ZXN0O1xuICBkZXNjcmliZVVwZGF0ZVJlcXVlc3Q/OiBzZGsuRUtTLkRlc2NyaWJlVXBkYXRlUmVxdWVzdDtcbiAgZGVsZXRlQ2x1c3RlclJlcXVlc3Q/OiBzZGsuRUtTLkRlbGV0ZUNsdXN0ZXJSZXF1ZXN0O1xuICB1cGRhdGVDbHVzdGVyQ29uZmlnUmVxdWVzdD86IHNkay5FS1MuVXBkYXRlQ2x1c3RlckNvbmZpZ1JlcXVlc3Q7XG4gIHVwZGF0ZUNsdXN0ZXJWZXJzaW9uUmVxdWVzdD86IHNkay5FS1MuVXBkYXRlQ2x1c3RlclZlcnNpb25SZXF1ZXN0O1xuICBjcmVhdGVGYXJnYXRlUHJvZmlsZT86IHNkay5FS1MuQ3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXF1ZXN0O1xuICBkZXNjcmliZUZhcmdhdGVQcm9maWxlPzogc2RrLkVLUy5EZXNjcmliZUZhcmdhdGVQcm9maWxlUmVxdWVzdDtcbiAgZGVsZXRlRmFyZ2F0ZVByb2ZpbGU/OiBzZGsuRUtTLkRlbGV0ZUZhcmdhdGVQcm9maWxlUmVxdWVzdDtcbn0gPSB7IH07XG5cbi8qKlxuICogUmVzcG9uc2VzIGNhbiBiZSBzaW11bGF0ZWQgYnkgYXNzaWduaW5nIHZhbHVlcyBoZXJlLlxuICovXG5leHBvcnQgbGV0IHNpbXVsYXRlUmVzcG9uc2U6IHtcbiAgZGVzY3JpYmVDbHVzdGVyUmVzcG9uc2VNb2NrU3RhdHVzPzogc3RyaW5nO1xuICBkZXNjcmliZVVwZGF0ZVJlc3BvbnNlTW9ja1N0YXR1cz86IHN0cmluZztcbiAgZGVzY3JpYmVVcGRhdGVSZXNwb25zZU1vY2tFcnJvcnM/OiBzZGsuRUtTLkVycm9yRGV0YWlscztcbiAgZGVsZXRlQ2x1c3RlckVycm9yQ29kZT86IHN0cmluZztcbiAgZGVzY3JpYmVDbHVzdGVyRXhjZXB0aW9uQ29kZT86IHN0cmluZztcbn0gPSB7IH07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpIHtcbiAgYWN0dWFsUmVxdWVzdCA9IHsgfTtcbiAgc2ltdWxhdGVSZXNwb25zZSA9IHsgfTtcbn1cblxuZXhwb3J0IGNvbnN0IE1PQ0tfVVBEQVRFX1NUQVRVU19JRCA9ICdNb2NrRWtzVXBkYXRlU3RhdHVzSWQnO1xuXG5leHBvcnQgY29uc3QgY2xpZW50OiBFa3NDbGllbnQgPSB7XG5cbiAgY29uZmlndXJlQXNzdW1lUm9sZTogcmVxID0+IHtcbiAgICBhY3R1YWxSZXF1ZXN0LmNvbmZpZ3VyZUFzc3VtZVJvbGVSZXF1ZXN0ID0gcmVxO1xuICB9LFxuXG4gIGNyZWF0ZUNsdXN0ZXI6IGFzeW5jIHJlcSA9PiB7XG4gICAgYWN0dWFsUmVxdWVzdC5jcmVhdGVDbHVzdGVyUmVxdWVzdCA9IHJlcTtcbiAgICByZXR1cm4ge1xuICAgICAgY2x1c3Rlcjoge1xuICAgICAgICBuYW1lOiByZXEubmFtZSxcbiAgICAgICAgcm9sZUFybjogcmVxLnJvbGVBcm4sXG4gICAgICAgIHZlcnNpb246ICcxLjAnLFxuICAgICAgICBhcm46IGBhcm46JHtyZXEubmFtZX1gLFxuICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eTogeyBkYXRhOiAnY2VydGlmaWNhdGVBdXRob3JpdHktZGF0YScgfSxcbiAgICAgICAgc3RhdHVzOiAnQ1JFQVRJTkcnLFxuICAgICAgfSxcbiAgICB9O1xuICB9LFxuXG4gIGRlbGV0ZUNsdXN0ZXI6IGFzeW5jIHJlcSA9PiB7XG4gICAgYWN0dWFsUmVxdWVzdC5kZWxldGVDbHVzdGVyUmVxdWVzdCA9IHJlcTtcbiAgICBpZiAoc2ltdWxhdGVSZXNwb25zZS5kZWxldGVDbHVzdGVyRXJyb3JDb2RlKSB7XG4gICAgICBjb25zdCBlID0gbmV3IEVycm9yKCdtb2NrIGVycm9yJyk7XG4gICAgICAoZSBhcyBhbnkpLmNvZGUgPSBzaW11bGF0ZVJlc3BvbnNlLmRlbGV0ZUNsdXN0ZXJFcnJvckNvZGU7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY2x1c3Rlcjoge1xuICAgICAgICBuYW1lOiByZXEubmFtZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcblxuICBkZXNjcmliZUNsdXN0ZXI6IGFzeW5jIHJlcSA9PiB7XG4gICAgYWN0dWFsUmVxdWVzdC5kZXNjcmliZUNsdXN0ZXJSZXF1ZXN0ID0gcmVxO1xuXG4gICAgaWYgKHNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyRXhjZXB0aW9uQ29kZSkge1xuICAgICAgY29uc3QgZSA9IG5ldyBFcnJvcignbW9jayBleGNlcHRpb24nKTtcbiAgICAgIChlIGFzIGFueSkuY29kZSA9IHNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyRXhjZXB0aW9uQ29kZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNsdXN0ZXI6IHtcbiAgICAgICAgbmFtZTogcmVxLm5hbWUsXG4gICAgICAgIHZlcnNpb246ICcxLjAnLFxuICAgICAgICByb2xlQXJuOiAnYXJuOnJvbGUnLFxuICAgICAgICBhcm46ICdhcm46Y2x1c3Rlci1hcm4nLFxuICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eTogeyBkYXRhOiAnY2VydGlmaWNhdGVBdXRob3JpdHktZGF0YScgfSxcbiAgICAgICAgZW5kcG9pbnQ6ICdodHRwOi8vZW5kcG9pbnQnLFxuICAgICAgICBzdGF0dXM6IHNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyUmVzcG9uc2VNb2NrU3RhdHVzIHx8ICdBQ1RJVkUnLFxuICAgICAgfSxcbiAgICB9O1xuICB9LFxuXG4gIGRlc2NyaWJlVXBkYXRlOiBhc3luYyByZXEgPT4ge1xuICAgIGFjdHVhbFJlcXVlc3QuZGVzY3JpYmVVcGRhdGVSZXF1ZXN0ID0gcmVxO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICBpZDogcmVxLnVwZGF0ZUlkLFxuICAgICAgICBlcnJvcnM6IHNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVVcGRhdGVSZXNwb25zZU1vY2tFcnJvcnMsXG4gICAgICAgIHN0YXR1czogc2ltdWxhdGVSZXNwb25zZS5kZXNjcmliZVVwZGF0ZVJlc3BvbnNlTW9ja1N0YXR1cyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcblxuICB1cGRhdGVDbHVzdGVyQ29uZmlnOiBhc3luYyByZXEgPT4ge1xuICAgIGFjdHVhbFJlcXVlc3QudXBkYXRlQ2x1c3RlckNvbmZpZ1JlcXVlc3QgPSByZXE7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICBpZDogTU9DS19VUERBVEVfU1RBVFVTX0lELFxuICAgICAgfSxcbiAgICB9O1xuICB9LFxuXG4gIHVwZGF0ZUNsdXN0ZXJWZXJzaW9uOiBhc3luYyByZXEgPT4ge1xuICAgIGFjdHVhbFJlcXVlc3QudXBkYXRlQ2x1c3RlclZlcnNpb25SZXF1ZXN0ID0gcmVxO1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IHtcbiAgICAgICAgaWQ6IE1PQ0tfVVBEQVRFX1NUQVRVU19JRCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcblxuICBjcmVhdGVGYXJnYXRlUHJvZmlsZTogYXN5bmMgcmVxID0+IHtcbiAgICBhY3R1YWxSZXF1ZXN0LmNyZWF0ZUZhcmdhdGVQcm9maWxlID0gcmVxO1xuICAgIHJldHVybiB7IH07XG4gIH0sXG5cbiAgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZTogYXN5bmMgcmVxID0+IHtcbiAgICBhY3R1YWxSZXF1ZXN0LmRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUgPSByZXE7XG4gICAgcmV0dXJuIHsgfTtcbiAgfSxcblxuICBkZWxldGVGYXJnYXRlUHJvZmlsZTogYXN5bmMgcmVxID0+IHtcbiAgICBhY3R1YWxSZXF1ZXN0LmRlbGV0ZUZhcmdhdGVQcm9maWxlID0gcmVxO1xuICAgIHJldHVybiB7IH07XG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgTU9DS19QUk9QUyA9IHtcbiAgcm9sZUFybjogJ2FybjpvZjpyb2xlJyxcbiAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgc3VibmV0SWRzOiBbJ3N1Ym5ldDEnLCAnc3VibmV0MiddLFxuICAgIHNlY3VyaXR5R3JvdXBJZHM6IFsnc2cxJywgJ3NnMicsICdzZzMnXSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBNT0NLX0FTU1VNRV9ST0xFX0FSTiA9ICdhc3N1bWU6cm9sZTphcm4nO1xuXG5leHBvcnQgZnVuY3Rpb24gbmV3UmVxdWVzdDxUIGV4dGVuZHMgJ0NyZWF0ZScgfCAnVXBkYXRlJyB8ICdEZWxldGUnPihcbiAgcmVxdWVzdFR5cGU6IFQsXG4gIHByb3BzPzogUGFydGlhbDxzZGsuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0PixcbiAgb2xkUHJvcHM/OiBQYXJ0aWFsPHNkay5FS1MuQ3JlYXRlQ2x1c3RlclJlcXVlc3Q+KSB7XG4gIHJldHVybiB7XG4gICAgU3RhY2tJZDogJ2Zha2Utc3RhY2staWQnLFxuICAgIFJlcXVlc3RJZDogJ2Zha2UtcmVxdWVzdC1pZCcsXG4gICAgUmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpFS1NDbHVzdGVyJyxcbiAgICBTZXJ2aWNlVG9rZW46ICdib29tJyxcbiAgICBMb2dpY2FsUmVzb3VyY2VJZDogJ015UmVzb3VyY2VJZCcsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnLFxuICAgIFJlc3BvbnNlVVJMOiAnaHR0cDovL3Jlc3BvbnNlLXVybCcsXG4gICAgUmVxdWVzdFR5cGU6IHJlcXVlc3RUeXBlLFxuICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgQ29uZmlnOiBvbGRQcm9wcyxcbiAgICAgIEFzc3VtZVJvbGVBcm46IE1PQ0tfQVNTVU1FX1JPTEVfQVJOLFxuICAgIH0sXG4gICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICBTZXJ2aWNlVG9rZW46ICdib29tJyxcbiAgICAgIENvbmZpZzogcHJvcHMsXG4gICAgICBBc3N1bWVSb2xlQXJuOiBNT0NLX0FTU1VNRV9ST0xFX0FSTixcbiAgICB9LFxuICB9O1xufVxuIl19