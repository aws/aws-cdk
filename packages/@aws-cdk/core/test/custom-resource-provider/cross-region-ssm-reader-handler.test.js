"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cross_region_ssm_reader_handler_1 = require("../../lib/custom-resource-provider/cross-region-export-providers/cross-region-ssm-reader-handler");
const types_1 = require("../../lib/custom-resource-provider/cross-region-export-providers/types");
let mockDeleteParameters;
let mockAddTagsToResource;
let mockGetParametersByPath;
let mockRemoveTagsFromResource;
jest.mock('aws-sdk', () => {
    return {
        SSM: jest.fn(() => {
            return {
                addTagsToResource: jest.fn((params) => {
                    return {
                        promise: () => mockAddTagsToResource(params),
                    };
                }),
                removeTagsFromResource: jest.fn((params) => {
                    return {
                        promise: () => mockRemoveTagsFromResource(params),
                    };
                }),
                getParametersByPath: jest.fn((params) => {
                    return {
                        promise: () => mockGetParametersByPath(params),
                    };
                }),
            };
        }),
    };
});
beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockDeleteParameters = jest.fn();
    mockGetParametersByPath = jest.fn();
    mockRemoveTagsFromResource = jest.fn().mockImplementation(() => { return {}; });
    mockAddTagsToResource = jest.fn().mockImplementation(() => {
        return {};
    });
});
afterEach(() => {
    jest.restoreAllMocks();
});
describe('cross-region-ssm-reader entrypoint', () => {
    test('Create event', async () => {
        // GIVEN
        const event = makeEvent({
            RequestType: 'Create',
            ResourceProperties: {
                ReaderProps: {
                    region: 'us-east-1',
                    prefix: 'MyStack',
                    imports: {
                        '/cdk/exports/MyStack/MyExport': 'abc',
                    },
                },
                ServiceToken: '<ServiceToken>',
            },
        });
        // WHEN
        await (0, cross_region_ssm_reader_handler_1.handler)(event);
        // THEN
        expect(mockAddTagsToResource).toHaveBeenCalledWith({
            ResourceId: `/${types_1.SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
            ResourceType: 'Parameter',
            Tags: [{
                    Key: 'aws-cdk:strong-ref:MyStack',
                    Value: 'true',
                }],
        });
        expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    });
    test('Update event', async () => {
        // GIVEN
        const event = makeEvent({
            RequestType: 'Update',
            OldResourceProperties: {
                ReaderProps: {
                    region: 'us-east-1',
                    prefix: 'MyStack',
                    imports: {
                        '/cdk/exports/MyStack/ExistingExport': 'abc',
                    },
                },
                ServiceToken: '<ServiceToken>',
            },
            ResourceProperties: {
                ReaderProps: {
                    r: 'us-east-1',
                    prefix: 'MyStack',
                    imports: {
                        '/cdk/exports/MyStack/ExistingExport': 'abc',
                        '/cdk/exports/MyStack/MyExport': 'xyz',
                    },
                },
                ServiceToken: '<ServiceToken>',
            },
        });
        // WHEN
        await (0, cross_region_ssm_reader_handler_1.handler)(event);
        // THEN
        expect(mockAddTagsToResource).toHaveBeenCalledWith({
            ResourceId: `/${types_1.SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
            ResourceType: 'Parameter',
            Tags: [{
                    Key: 'aws-cdk:strong-ref:MyStack',
                    Value: 'true',
                }],
        });
        expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
        expect(mockRemoveTagsFromResource).toHaveBeenCalledTimes(0);
        expect(mockGetParametersByPath).toHaveBeenCalledTimes(0);
    });
    test('Update event with export removal', async () => {
        // GIVEN
        const event = makeEvent({
            RequestType: 'Update',
            OldResourceProperties: {
                ReaderProps: {
                    region: 'us-east-1',
                    prefix: 'MyStack',
                    imports: {
                        '/cdk/exports/MyStack/RemovedExport': 'abc',
                    },
                },
                ServiceToken: '<ServiceToken>',
            },
            ResourceProperties: {
                ServiceToken: '<ServiceToken>',
                ReaderProps: {
                    region: 'us-east-1',
                    prefix: 'MyStack',
                    imports: {
                        '/cdk/exports/MyStack/MyExport': 'abc',
                    },
                },
            },
        });
        // WHEN
        await (0, cross_region_ssm_reader_handler_1.handler)(event);
        // THEN
        expect(mockAddTagsToResource).toHaveBeenCalledWith({
            ResourceId: `/${types_1.SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
            ResourceType: 'Parameter',
            Tags: [{
                    Key: 'aws-cdk:strong-ref:MyStack',
                    Value: 'true',
                }],
        });
        expect(mockRemoveTagsFromResource).toHaveBeenCalledWith({
            ResourceId: '/cdk/exports/MyStack/RemovedExport',
            ResourceType: 'Parameter',
            TagKeys: ['aws-cdk:strong-ref:MyStack'],
        });
        expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    });
    test('Delete event', async () => {
        // GIVEN
        const event = makeEvent({
            RequestType: 'Delete',
            ResourceProperties: {
                ServiceToken: '<ServiceToken>',
                ReaderProps: {
                    region: 'us-east-1',
                    prefix: 'MyStack',
                    imports: {
                        '/cdk/exports/MyStack/RemovedExport': 'abc',
                    },
                },
            },
        });
        // WHEN
        mockGetParametersByPath.mockImplementationOnce(() => {
            return Promise.resolve({
                Parameters: [{
                        Name: '/cdk/exports/MyStack/OtherExport',
                    }],
            });
        });
        await (0, cross_region_ssm_reader_handler_1.handler)(event);
        // THEN
        expect(mockRemoveTagsFromResource).toHaveBeenCalledTimes(1);
        expect(mockRemoveTagsFromResource).toHaveBeenCalledWith({
            ResourceType: 'Parameter',
            ResourceId: '/cdk/exports/MyStack/RemovedExport',
            TagKeys: ['aws-cdk:strong-ref:MyStack'],
        });
    });
});
function makeEvent(req) {
    return {
        LogicalResourceId: '<LogicalResourceId>',
        RequestId: '<RequestId>',
        ResourceType: '<ResourceType>',
        ResponseURL: '<ResponseURL>',
        ServiceToken: '<ServiceToken>',
        StackId: '<StackId>',
        ResourceProperties: {
            ServiceToken: '<ServiceToken>',
            ...req.ResourceProperties,
        },
        ...req,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtcmVnaW9uLXNzbS1yZWFkZXItaGFuZGxlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3Jvc3MtcmVnaW9uLXNzbS1yZWFkZXItaGFuZGxlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0pBQTJIO0FBQzNILGtHQUFnSDtBQUVoSCxJQUFJLG9CQUErQixDQUFFO0FBQ3JDLElBQUkscUJBQWdDLENBQUM7QUFDckMsSUFBSSx1QkFBa0MsQ0FBQztBQUN2QyxJQUFJLDBCQUFxQyxDQUFDO0FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN4QixPQUFPO1FBQ0wsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO1lBQ2hCLE9BQU87Z0JBQ0wsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUNwQyxPQUFPO3dCQUNMLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUM7cUJBQzdDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDO2dCQUNGLHNCQUFzQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDekMsT0FBTzt3QkFDTCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDO3FCQUNsRCxDQUFDO2dCQUNKLENBQUMsQ0FBQztnQkFDRixtQkFBbUIsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ3RDLE9BQU87d0JBQ0wsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQztxQkFDL0MsQ0FBQztnQkFDSixDQUFDLENBQUM7YUFDSCxDQUFDO1FBQ0osQ0FBQyxDQUFDO0tBQ0gsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0gs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QyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztZQUN0RCxZQUFZLEVBQUUsV0FBVztZQUN6QixVQUFVLEVBQUUsb0NBQW9DO1lBQ2hELE9BQU8sRUFBRSxDQUFDLDRCQUE0QixDQUFDO1NBQ3hDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLFNBQVMsQ0FBQyxHQUF5RDtJQUMxRSxPQUFPO1FBQ0wsaUJBQWlCLEVBQUUscUJBQXFCO1FBQ3hDLFNBQVMsRUFBRSxhQUFhO1FBQ3hCLFlBQVksRUFBRSxnQkFBZ0I7UUFDOUIsV0FBVyxFQUFFLGVBQWU7UUFDNUIsWUFBWSxFQUFFLGdCQUFnQjtRQUM5QixPQUFPLEVBQUUsV0FBVztRQUNwQixrQkFBa0IsRUFBRTtZQUNsQixZQUFZLEVBQUUsZ0JBQWdCO1lBQzlCLEdBQUcsR0FBRyxDQUFDLGtCQUFrQjtTQUMxQjtRQUNELEdBQUcsR0FBRztLQUNBLENBQUM7QUFDWCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFuZGxlciB9IGZyb20gJy4uLy4uL2xpYi9jdXN0b20tcmVzb3VyY2UtcHJvdmlkZXIvY3Jvc3MtcmVnaW9uLWV4cG9ydC1wcm92aWRlcnMvY3Jvc3MtcmVnaW9uLXNzbS1yZWFkZXItaGFuZGxlcic7XG5pbXBvcnQgeyBTU01fRVhQT1JUX1BBVEhfUFJFRklYIH0gZnJvbSAnLi4vLi4vbGliL2N1c3RvbS1yZXNvdXJjZS1wcm92aWRlci9jcm9zcy1yZWdpb24tZXhwb3J0LXByb3ZpZGVycy90eXBlcyc7XG5cbmxldCBtb2NrRGVsZXRlUGFyYW1ldGVyczogamVzdC5Nb2NrIDtcbmxldCBtb2NrQWRkVGFnc1RvUmVzb3VyY2U6IGplc3QuTW9jaztcbmxldCBtb2NrR2V0UGFyYW1ldGVyc0J5UGF0aDogamVzdC5Nb2NrO1xubGV0IG1vY2tSZW1vdmVUYWdzRnJvbVJlc291cmNlOiBqZXN0Lk1vY2s7XG5qZXN0Lm1vY2soJ2F3cy1zZGsnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgU1NNOiBqZXN0LmZuKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFkZFRhZ3NUb1Jlc291cmNlOiBqZXN0LmZuKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZTogKCkgPT4gbW9ja0FkZFRhZ3NUb1Jlc291cmNlKHBhcmFtcyksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgICAgIHJlbW92ZVRhZ3NGcm9tUmVzb3VyY2U6IGplc3QuZm4oKHBhcmFtcykgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9taXNlOiAoKSA9PiBtb2NrUmVtb3ZlVGFnc0Zyb21SZXNvdXJjZShwYXJhbXMpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgICAgICBnZXRQYXJhbWV0ZXJzQnlQYXRoOiBqZXN0LmZuKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZTogKCkgPT4gbW9ja0dldFBhcmFtZXRlcnNCeVBhdGgocGFyYW1zKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSksXG4gIH07XG59KTtcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBqZXN0LnNweU9uKGNvbnNvbGUsICdpbmZvJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHt9KTtcbiAgamVzdC5zcHlPbihjb25zb2xlLCAnZXJyb3InKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge30pO1xuICBtb2NrRGVsZXRlUGFyYW1ldGVycyA9IGplc3QuZm4oKTtcbiAgbW9ja0dldFBhcmFtZXRlcnNCeVBhdGggPSBqZXN0LmZuKCk7XG4gIG1vY2tSZW1vdmVUYWdzRnJvbVJlc291cmNlID0gamVzdC5mbigpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7IHJldHVybiB7fTsgfSk7XG4gIG1vY2tBZGRUYWdzVG9SZXNvdXJjZSA9IGplc3QuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgIHJldHVybiB7fTtcbiAgfSk7XG59KTtcbmFmdGVyRWFjaCgoKSA9PiB7XG4gIGplc3QucmVzdG9yZUFsbE1vY2tzKCk7XG59KTtcblxuZGVzY3JpYmUoJ2Nyb3NzLXJlZ2lvbi1zc20tcmVhZGVyIGVudHJ5cG9pbnQnLCAoKSA9PiB7XG4gIHRlc3QoJ0NyZWF0ZSBldmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZWFkZXJQcm9wczoge1xuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgcHJlZml4OiAnTXlTdGFjaycsXG4gICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ2FiYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobW9ja0FkZFRhZ3NUb1Jlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICBSZXNvdXJjZUlkOiBgLyR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH1NeVN0YWNrL015RXhwb3J0YCxcbiAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICBUYWdzOiBbe1xuICAgICAgICBLZXk6ICdhd3MtY2RrOnN0cm9uZy1yZWY6TXlTdGFjaycsXG4gICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygwKTtcbiAgfSk7XG5cbiAgdGVzdCgnVXBkYXRlIGV2ZW50JywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgT2xkUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlYWRlclByb3BzOiB7XG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICBwcmVmaXg6ICdNeVN0YWNrJyxcbiAgICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svRXhpc3RpbmdFeHBvcnQnOiAnYWJjJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlYWRlclByb3BzOiB7XG4gICAgICAgICAgcjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgcHJlZml4OiAnTXlTdGFjaycsXG4gICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0V4aXN0aW5nRXhwb3J0JzogJ2FiYycsXG4gICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svTXlFeHBvcnQnOiAneHl6JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChtb2NrQWRkVGFnc1RvUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIFJlc291cmNlSWQ6IGAvJHtTU01fRVhQT1JUX1BBVEhfUFJFRklYfU15U3RhY2svTXlFeHBvcnRgLFxuICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgIFRhZ3M6IFt7XG4gICAgICAgIEtleTogJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJyxcbiAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuICAgIGV4cGVjdChtb2NrRGVsZXRlUGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDApO1xuICAgIGV4cGVjdChtb2NrUmVtb3ZlVGFnc0Zyb21SZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDApO1xuICAgIGV4cGVjdChtb2NrR2V0UGFyYW1ldGVyc0J5UGF0aCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDApO1xuICB9KTtcblxuICB0ZXN0KCdVcGRhdGUgZXZlbnQgd2l0aCBleHBvcnQgcmVtb3ZhbCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZWFkZXJQcm9wczoge1xuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgcHJlZml4OiAnTXlTdGFjaycsXG4gICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL1JlbW92ZWRFeHBvcnQnOiAnYWJjJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgIHByZWZpeDogJ015U3RhY2snLFxuICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdhYmMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChtb2NrQWRkVGFnc1RvUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIFJlc291cmNlSWQ6IGAvJHtTU01fRVhQT1JUX1BBVEhfUFJFRklYfU15U3RhY2svTXlFeHBvcnRgLFxuICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgIFRhZ3M6IFt7XG4gICAgICAgIEtleTogJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJyxcbiAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuICAgIGV4cGVjdChtb2NrUmVtb3ZlVGFnc0Zyb21SZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgUmVzb3VyY2VJZDogJy9jZGsvZXhwb3J0cy9NeVN0YWNrL1JlbW92ZWRFeHBvcnQnLFxuICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgIFRhZ0tleXM6IFsnYXdzLWNkazpzdHJvbmctcmVmOk15U3RhY2snXSxcbiAgICB9KTtcbiAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygwKTtcbiAgfSk7XG5cbiAgdGVzdCgnRGVsZXRlIGV2ZW50JywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgUmVxdWVzdFR5cGU6ICdEZWxldGUnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgIHByZWZpeDogJ015U3RhY2snLFxuICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9SZW1vdmVkRXhwb3J0JzogJ2FiYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbW9ja0dldFBhcmFtZXRlcnNCeVBhdGgubW9ja0ltcGxlbWVudGF0aW9uT25jZSgoKSA9PiB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgUGFyYW1ldGVyczogW3tcbiAgICAgICAgICBOYW1lOiAnL2Nkay9leHBvcnRzL015U3RhY2svT3RoZXJFeHBvcnQnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChtb2NrUmVtb3ZlVGFnc0Zyb21SZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgIGV4cGVjdChtb2NrUmVtb3ZlVGFnc0Zyb21SZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgIFJlc291cmNlSWQ6ICcvY2RrL2V4cG9ydHMvTXlTdGFjay9SZW1vdmVkRXhwb3J0JyxcbiAgICAgIFRhZ0tleXM6IFsnYXdzLWNkazpzdHJvbmctcmVmOk15U3RhY2snXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gbWFrZUV2ZW50KHJlcTogUGFydGlhbDxBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50Pik6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQge1xuICByZXR1cm4ge1xuICAgIExvZ2ljYWxSZXNvdXJjZUlkOiAnPExvZ2ljYWxSZXNvdXJjZUlkPicsXG4gICAgUmVxdWVzdElkOiAnPFJlcXVlc3RJZD4nLFxuICAgIFJlc291cmNlVHlwZTogJzxSZXNvdXJjZVR5cGU+JyxcbiAgICBSZXNwb25zZVVSTDogJzxSZXNwb25zZVVSTD4nLFxuICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICBTdGFja0lkOiAnPFN0YWNrSWQ+JyxcbiAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgIC4uLnJlcS5SZXNvdXJjZVByb3BlcnRpZXMsXG4gICAgfSxcbiAgICAuLi5yZXEsXG4gIH0gYXMgYW55O1xufVxuIl19