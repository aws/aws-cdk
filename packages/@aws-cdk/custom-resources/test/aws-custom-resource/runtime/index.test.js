"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const lib_1 = require("../../../lib");
const index_1 = require("../../../lib/aws-custom-resource/runtime/index");
/* eslint-disable no-console */
console.log = jest.fn();
jest.mock('aws-sdk', () => {
    return {
        ...jest.requireActual('aws-sdk'),
        SSM: jest.fn(() => {
            return {
                config: {
                    apiVersion: 'apiVersion',
                    region: 'eu-west-1',
                },
                getParameter: () => {
                    return {
                        promise: async () => { },
                    };
                },
            };
        }),
    };
});
jest.mock('https', () => {
    return {
        request: (_, callback) => {
            return {
                on: () => undefined,
                write: () => true,
                end: callback,
            };
        },
    };
});
afterEach(() => {
    jest.clearAllMocks();
});
test('SDK global credentials are never set', async () => {
    // WHEN
    await index_1.handler({
        LogicalResourceId: 'logicalResourceId',
        RequestId: 'requestId',
        RequestType: 'Create',
        ResponseURL: 'responseUrl',
        ResourceProperties: {
            Create: JSON.stringify({
                action: 'getParameter',
                assumedRoleArn: 'arn:aws:iam::123456789012:role/CoolRole',
                parameters: {
                    Name: 'foo',
                },
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                service: 'SSM',
            }),
            ServiceToken: 'serviceToken',
        },
        ResourceType: 'resourceType',
        ServiceToken: 'serviceToken',
        StackId: 'stackId',
    }, {});
    // THEN
    expect(AWS.config).toBeInstanceOf(AWS.Config);
    expect(AWS.config.credentials).toBeNull();
});
test('SDK credentials are not persisted across subsequent invocations', async () => {
    // GIVEN
    const mockCreds = new AWS.ChainableTemporaryCredentials();
    jest.spyOn(AWS, 'ChainableTemporaryCredentials').mockReturnValue(mockCreds);
    // WHEN
    await index_1.handler({
        LogicalResourceId: 'logicalResourceId',
        RequestId: 'requestId',
        RequestType: 'Create',
        ResponseURL: 'responseUrl',
        ResourceProperties: {
            Create: JSON.stringify({
                action: 'getParameter',
                parameters: {
                    Name: 'foo',
                },
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                service: 'SSM',
            }),
            ServiceToken: 'serviceToken',
        },
        ResourceType: 'resourceType',
        ServiceToken: 'serviceToken',
        StackId: 'stackId',
    }, {});
    await index_1.handler({
        LogicalResourceId: 'logicalResourceId',
        RequestId: 'requestId',
        RequestType: 'Create',
        ResponseURL: 'responseUrl',
        ResourceProperties: {
            Create: JSON.stringify({
                action: 'getParameter',
                assumedRoleArn: 'arn:aws:iam::123456789012:role/CoolRole',
                parameters: {
                    Name: 'foo',
                },
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                service: 'SSM',
            }),
            ServiceToken: 'serviceToken',
        },
        ResourceType: 'resourceType',
        ServiceToken: 'serviceToken',
        StackId: 'stackId',
    }, {});
    await index_1.handler({
        LogicalResourceId: 'logicalResourceId',
        RequestId: 'requestId',
        RequestType: 'Create',
        ResponseURL: 'responseUrl',
        ResourceProperties: {
            Create: JSON.stringify({
                action: 'getParameter',
                parameters: {
                    Name: 'foo',
                },
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                service: 'SSM',
            }),
            ServiceToken: 'serviceToken',
        },
        ResourceType: 'resourceType',
        ServiceToken: 'serviceToken',
        StackId: 'stackId',
    }, {});
    // THEN
    expect(AWS.SSM).toHaveBeenNthCalledWith(1, {
        apiVersion: undefined,
        credentials: undefined,
        region: undefined,
    });
    expect(AWS.SSM).toHaveBeenNthCalledWith(2, {
        apiVersion: undefined,
        credentials: mockCreds,
        region: undefined,
    });
    expect(AWS.SSM).toHaveBeenNthCalledWith(3, {
        apiVersion: undefined,
        credentials: undefined,
        region: undefined,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0Isc0NBQWtEO0FBQ2xELDBFQUF5RTtBQUV6RSwrQkFBK0I7QUFDL0IsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLE9BQU87UUFDTCxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1FBQ2hDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtZQUNoQixPQUFPO2dCQUNMLE1BQU0sRUFBRTtvQkFDTixVQUFVLEVBQUUsWUFBWTtvQkFDeEIsTUFBTSxFQUFFLFdBQVc7aUJBQ3BCO2dCQUNELFlBQVksRUFBRSxHQUFHLEVBQUU7b0JBQ2pCLE9BQU87d0JBQ0wsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUUsQ0FBQztxQkFDeEIsQ0FBQztnQkFDSixDQUFDO2FBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUN0QixPQUFPO1FBQ0wsT0FBTyxFQUFFLENBQUMsQ0FBTSxFQUFFLFFBQW9CLEVBQUUsRUFBRTtZQUN4QyxPQUFPO2dCQUNMLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTO2dCQUNuQixLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTtnQkFDakIsR0FBRyxFQUFFLFFBQVE7YUFDZCxDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFD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UGh5c2ljYWxSZXNvdXJjZUlkIH0gZnJvbSAnLi4vLi4vLi4vbGliJztcbmltcG9ydCB7IGhhbmRsZXIgfSBmcm9tICcuLi8uLi8uLi9saWIvYXdzLWN1c3RvbS1yZXNvdXJjZS9ydW50aW1lL2luZGV4JztcblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuY29uc29sZS5sb2cgPSBqZXN0LmZuKCk7XG5cbmplc3QubW9jaygnYXdzLXNkaycsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5qZXN0LnJlcXVpcmVBY3R1YWwoJ2F3cy1zZGsnKSxcbiAgICBTU006IGplc3QuZm4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgYXBpVmVyc2lvbjogJ2FwaVZlcnNpb24nLFxuICAgICAgICAgIHJlZ2lvbjogJ2V1LXdlc3QtMScsXG4gICAgICAgIH0sXG4gICAgICAgIGdldFBhcmFtZXRlcjogKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9taXNlOiBhc3luYyAoKSA9PiB7fSxcbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9KSxcbiAgfTtcbn0pO1xuXG5qZXN0Lm1vY2soJ2h0dHBzJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlcXVlc3Q6IChfOiBhbnksIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbjogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICB3cml0ZTogKCkgPT4gdHJ1ZSxcbiAgICAgICAgZW5kOiBjYWxsYmFjayxcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn0pO1xuXG5hZnRlckVhY2goKCkgPT4ge1xuICBqZXN0LmNsZWFyQWxsTW9ja3MoKTtcbn0pO1xuXG50ZXN0KCdTREsgZ2xvYmFsIGNyZWRlbnRpYWxzIGFyZSBuZXZlciBzZXQnLCBhc3luYyAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgYXdhaXQgaGFuZGxlcih7XG4gICAgTG9naWNhbFJlc291cmNlSWQ6ICdsb2dpY2FsUmVzb3VyY2VJZCcsXG4gICAgUmVxdWVzdElkOiAncmVxdWVzdElkJyxcbiAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgUmVzcG9uc2VVUkw6ICdyZXNwb25zZVVybCcsXG4gICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICBDcmVhdGU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgYWN0aW9uOiAnZ2V0UGFyYW1ldGVyJyxcbiAgICAgICAgYXNzdW1lZFJvbGVBcm46ICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvQ29vbFJvbGUnLFxuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgTmFtZTogJ2ZvbycsXG4gICAgICAgIH0sXG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgICAgICBzZXJ2aWNlOiAnU1NNJyxcbiAgICAgIH0pLFxuICAgICAgU2VydmljZVRva2VuOiAnc2VydmljZVRva2VuJyxcbiAgICB9LFxuICAgIFJlc291cmNlVHlwZTogJ3Jlc291cmNlVHlwZScsXG4gICAgU2VydmljZVRva2VuOiAnc2VydmljZVRva2VuJyxcbiAgICBTdGFja0lkOiAnc3RhY2tJZCcsXG4gIH0sIHt9IGFzIEFXU0xhbWJkYS5Db250ZXh0KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChBV1MuY29uZmlnKS50b0JlSW5zdGFuY2VPZihBV1MuQ29uZmlnKTtcbiAgZXhwZWN0KEFXUy5jb25maWcuY3JlZGVudGlhbHMpLnRvQmVOdWxsKCk7XG59KTtcblxudGVzdCgnU0RLIGNyZWRlbnRpYWxzIGFyZSBub3QgcGVyc2lzdGVkIGFjcm9zcyBzdWJzZXF1ZW50IGludm9jYXRpb25zJywgYXN5bmMgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBtb2NrQ3JlZHMgPSBuZXcgQVdTLkNoYWluYWJsZVRlbXBvcmFyeUNyZWRlbnRpYWxzKCk7XG4gIGplc3Quc3B5T24oQVdTLCAnQ2hhaW5hYmxlVGVtcG9yYXJ5Q3JlZGVudGlhbHMnKS5tb2NrUmV0dXJuVmFsdWUobW9ja0NyZWRzKTtcblxuICAvLyBXSEVOXG4gIGF3YWl0IGhhbmRsZXIoe1xuICAgIExvZ2ljYWxSZXNvdXJjZUlkOiAnbG9naWNhbFJlc291cmNlSWQnLFxuICAgIFJlcXVlc3RJZDogJ3JlcXVlc3RJZCcsXG4gICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgIFJlc3BvbnNlVVJMOiAncmVzcG9uc2VVcmwnLFxuICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgQ3JlYXRlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGFjdGlvbjogJ2dldFBhcmFtZXRlcicsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBOYW1lOiAnZm9vJyxcbiAgICAgICAgfSxcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgICAgIHNlcnZpY2U6ICdTU00nLFxuICAgICAgfSksXG4gICAgICBTZXJ2aWNlVG9rZW46ICdzZXJ2aWNlVG9rZW4nLFxuICAgIH0sXG4gICAgUmVzb3VyY2VUeXBlOiAncmVzb3VyY2VUeXBlJyxcbiAgICBTZXJ2aWNlVG9rZW46ICdzZXJ2aWNlVG9rZW4nLFxuICAgIFN0YWNrSWQ6ICdzdGFja0lkJyxcbiAgfSwge30gYXMgQVdTTGFtYmRhLkNvbnRleHQpO1xuXG4gIGF3YWl0IGhhbmRsZXIoe1xuICAgIExvZ2ljYWxSZXNvdXJjZUlkOiAnbG9naWNhbFJlc291cmNlSWQnLFxuICAgIFJlcXVlc3RJZDogJ3JlcXVlc3RJZCcsXG4gICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgIFJlc3BvbnNlVVJMOiAncmVzcG9uc2VVcmwnLFxuICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgQ3JlYXRlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGFjdGlvbjogJ2dldFBhcmFtZXRlcicsXG4gICAgICAgIGFzc3VtZWRSb2xlQXJuOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL0Nvb2xSb2xlJyxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIE5hbWU6ICdmb28nLFxuICAgICAgICB9LFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICAgICAgc2VydmljZTogJ1NTTScsXG4gICAgICB9KSxcbiAgICAgIFNlcnZpY2VUb2tlbjogJ3NlcnZpY2VUb2tlbicsXG4gICAgfSxcbiAgICBSZXNvdXJjZVR5cGU6ICdyZXNvdXJjZVR5cGUnLFxuICAgIFNlcnZpY2VUb2tlbjogJ3NlcnZpY2VUb2tlbicsXG4gICAgU3RhY2tJZDogJ3N0YWNrSWQnLFxuICB9LCB7fSBhcyBBV1NMYW1iZGEuQ29udGV4dCk7XG5cbiAgYXdhaXQgaGFuZGxlcih7XG4gICAgTG9naWNhbFJlc291cmNlSWQ6ICdsb2dpY2FsUmVzb3VyY2VJZCcsXG4gICAgUmVxdWVzdElkOiAncmVxdWVzdElkJyxcbiAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgUmVzcG9uc2VVUkw6ICdyZXNwb25zZVVybCcsXG4gICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICBDcmVhdGU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgYWN0aW9uOiAnZ2V0UGFyYW1ldGVyJyxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIE5hbWU6ICdmb28nLFxuICAgICAgICB9LFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICAgICAgc2VydmljZTogJ1NTTScsXG4gICAgICB9KSxcbiAgICAgIFNlcnZpY2VUb2tlbjogJ3NlcnZpY2VUb2tlbicsXG4gICAgfSxcbiAgICBSZXNvdXJjZVR5cGU6ICdyZXNvdXJjZVR5cGUnLFxuICAgIFNlcnZpY2VUb2tlbjogJ3NlcnZpY2VUb2tlbicsXG4gICAgU3RhY2tJZDogJ3N0YWNrSWQnLFxuICB9LCB7fSBhcyBBV1NMYW1iZGEuQ29udGV4dCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoQVdTLlNTTSkudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMSwge1xuICAgIGFwaVZlcnNpb246IHVuZGVmaW5lZCxcbiAgICBjcmVkZW50aWFsczogdW5kZWZpbmVkLFxuICAgIHJlZ2lvbjogdW5kZWZpbmVkLFxuICB9KTtcbiAgZXhwZWN0KEFXUy5TU00pLnRvSGF2ZUJlZW5OdGhDYWxsZWRXaXRoKDIsIHtcbiAgICBhcGlWZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgY3JlZGVudGlhbHM6IG1vY2tDcmVkcyxcbiAgICByZWdpb246IHVuZGVmaW5lZCxcbiAgfSk7XG4gIGV4cGVjdChBV1MuU1NNKS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgzLCB7XG4gICAgYXBpVmVyc2lvbjogdW5kZWZpbmVkLFxuICAgIGNyZWRlbnRpYWxzOiB1bmRlZmluZWQsXG4gICAgcmVnaW9uOiB1bmRlZmluZWQsXG4gIH0pO1xufSk7XG4iXX0=