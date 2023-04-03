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
        await cross_region_ssm_reader_handler_1.handler(event);
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
        await cross_region_ssm_reader_handler_1.handler(event);
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
        await cross_region_ssm_reader_handler_1.handler(event);
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
        await cross_region_ssm_reader_handler_1.handler(event);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtcmVnaW9uLXNzbS1yZWFkZXItaGFuZGxlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3Jvc3MtcmVnaW9uLXNzbS1yZWFkZXItaGFuZGxlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0pBQTJIO0FBQzNILGtHQUFnSDtBQUVoSCxJQUFJLG9CQUErQixDQUFFO0FBQ3JDLElBQUkscUJBQWdDLENBQUM7QUFDckMsSUFBSSx1QkFBa0MsQ0FBQztBQUN2QyxJQUFJLDBCQUFxQyxDQUFDO0FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN4QixPQUFPO1FBQ0wsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO1lBQ2hCLE9BQU87Z0JBQ0wsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUNwQyxPQUFPO3dCQUNMLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUM7cUJBQzdDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDO2dCQUNGLHNCQUFzQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDekMsT0FBTzt3QkFDTCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDO3FCQUNsRCxDQUFDO2dCQUNKLENBQUMsQ0FBQztnQkFDRixtQkFBbUIsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ3RDLE9BQU87d0JBQ0wsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQztxQkFDL0MsQ0FBQztnQkFDSixDQUFDLENBQUM7YUFDSCxDQUFDO1FBQ0osQ0FBQyxDQUFDO0tBQ0gsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0gs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QUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUMsb0JBQW9CLENBQUM7WUFDdEQsWUFBWSxFQUFFLFdBQVc7WUFDekIsVUFBVSxFQUFFLG9DQUFvQztZQUNoRCxPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUN4QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxTQUFTLENBQUMsR0FBeUQ7SUFDMUUsT0FBTztRQUNMLGlCQUFpQixFQUFFLHFCQUFxQjtRQUN4QyxTQUFTLEVBQUUsYUFBYTtRQUN4QixZQUFZLEVBQUUsZ0JBQWdCO1FBQzlCLFdBQVcsRUFBRSxlQUFlO1FBQzVCLFlBQVksRUFBRSxnQkFBZ0I7UUFDOUIsT0FBTyxFQUFFLFdBQVc7UUFDcEIsa0JBQWtCLEVBQUU7WUFDbEIsWUFBWSxFQUFFLGdCQUFnQjtZQUM5QixHQUFHLEdBQUcsQ0FBQyxrQkFBa0I7U0FDMUI7UUFDRCxHQUFHLEdBQUc7S0FDQSxDQUFDO0FBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhbmRsZXIgfSBmcm9tICcuLi8uLi9saWIvY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyL2Nyb3NzLXJlZ2lvbi1leHBvcnQtcHJvdmlkZXJzL2Nyb3NzLXJlZ2lvbi1zc20tcmVhZGVyLWhhbmRsZXInO1xuaW1wb3J0IHsgU1NNX0VYUE9SVF9QQVRIX1BSRUZJWCB9IGZyb20gJy4uLy4uL2xpYi9jdXN0b20tcmVzb3VyY2UtcHJvdmlkZXIvY3Jvc3MtcmVnaW9uLWV4cG9ydC1wcm92aWRlcnMvdHlwZXMnO1xuXG5sZXQgbW9ja0RlbGV0ZVBhcmFtZXRlcnM6IGplc3QuTW9jayA7XG5sZXQgbW9ja0FkZFRhZ3NUb1Jlc291cmNlOiBqZXN0Lk1vY2s7XG5sZXQgbW9ja0dldFBhcmFtZXRlcnNCeVBhdGg6IGplc3QuTW9jaztcbmxldCBtb2NrUmVtb3ZlVGFnc0Zyb21SZXNvdXJjZTogamVzdC5Nb2NrO1xuamVzdC5tb2NrKCdhd3Mtc2RrJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIFNTTTogamVzdC5mbigoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhZGRUYWdzVG9SZXNvdXJjZTogamVzdC5mbigocGFyYW1zKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByb21pc2U6ICgpID0+IG1vY2tBZGRUYWdzVG9SZXNvdXJjZShwYXJhbXMpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgICAgICByZW1vdmVUYWdzRnJvbVJlc291cmNlOiBqZXN0LmZuKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZTogKCkgPT4gbW9ja1JlbW92ZVRhZ3NGcm9tUmVzb3VyY2UocGFyYW1zKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICAgICAgZ2V0UGFyYW1ldGVyc0J5UGF0aDogamVzdC5mbigocGFyYW1zKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByb21pc2U6ICgpID0+IG1vY2tHZXRQYXJhbWV0ZXJzQnlQYXRoKHBhcmFtcyksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIH0pLFxuICB9O1xufSk7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgamVzdC5zcHlPbihjb25zb2xlLCAnaW5mbycpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7fSk7XG4gIGplc3Quc3B5T24oY29uc29sZSwgJ2Vycm9yJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHt9KTtcbiAgbW9ja0RlbGV0ZVBhcmFtZXRlcnMgPSBqZXN0LmZuKCk7XG4gIG1vY2tHZXRQYXJhbWV0ZXJzQnlQYXRoID0gamVzdC5mbigpO1xuICBtb2NrUmVtb3ZlVGFnc0Zyb21SZXNvdXJjZSA9IGplc3QuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4geyByZXR1cm4ge307IH0pO1xuICBtb2NrQWRkVGFnc1RvUmVzb3VyY2UgPSBqZXN0LmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICByZXR1cm4ge307XG4gIH0pO1xufSk7XG5hZnRlckVhY2goKCkgPT4ge1xuICBqZXN0LnJlc3RvcmVBbGxNb2NrcygpO1xufSk7XG5cbmRlc2NyaWJlKCdjcm9zcy1yZWdpb24tc3NtLXJlYWRlciBlbnRyeXBvaW50JywgKCkgPT4ge1xuICB0ZXN0KCdDcmVhdGUgZXZlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBldmVudCA9IG1ha2VFdmVudCh7XG4gICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgIHByZWZpeDogJ015U3RhY2snLFxuICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdhYmMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXdhaXQgaGFuZGxlcihldmVudCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KG1vY2tBZGRUYWdzVG9SZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgUmVzb3VyY2VJZDogYC8ke1NTTV9FWFBPUlRfUEFUSF9QUkVGSVh9TXlTdGFjay9NeUV4cG9ydGAsXG4gICAgICBSZXNvdXJjZVR5cGU6ICdQYXJhbWV0ZXInLFxuICAgICAgVGFnczogW3tcbiAgICAgICAgS2V5OiAnYXdzLWNkazpzdHJvbmctcmVmOk15U3RhY2snLFxuICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgfV0sXG4gICAgfSk7XG4gICAgZXhwZWN0KG1vY2tEZWxldGVQYXJhbWV0ZXJzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1VwZGF0ZSBldmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZWFkZXJQcm9wczoge1xuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgcHJlZml4OiAnTXlTdGFjaycsXG4gICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0V4aXN0aW5nRXhwb3J0JzogJ2FiYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZWFkZXJQcm9wczoge1xuICAgICAgICAgIHI6ICd1cy1lYXN0LTEnLFxuICAgICAgICAgIHByZWZpeDogJ015U3RhY2snLFxuICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9FeGlzdGluZ0V4cG9ydCc6ICdhYmMnLFxuICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ3h5eicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobW9ja0FkZFRhZ3NUb1Jlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICBSZXNvdXJjZUlkOiBgLyR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH1NeVN0YWNrL015RXhwb3J0YCxcbiAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICBUYWdzOiBbe1xuICAgICAgICBLZXk6ICdhd3MtY2RrOnN0cm9uZy1yZWY6TXlTdGFjaycsXG4gICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygwKTtcbiAgICBleHBlY3QobW9ja1JlbW92ZVRhZ3NGcm9tUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygwKTtcbiAgICBleHBlY3QobW9ja0dldFBhcmFtZXRlcnNCeVBhdGgpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygwKTtcbiAgfSk7XG5cbiAgdGVzdCgnVXBkYXRlIGV2ZW50IHdpdGggZXhwb3J0IHJlbW92YWwnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBldmVudCA9IG1ha2VFdmVudCh7XG4gICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgIHByZWZpeDogJ015U3RhY2snLFxuICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9SZW1vdmVkRXhwb3J0JzogJ2FiYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgIFJlYWRlclByb3BzOiB7XG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICBwcmVmaXg6ICdNeVN0YWNrJyxcbiAgICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svTXlFeHBvcnQnOiAnYWJjJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobW9ja0FkZFRhZ3NUb1Jlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICBSZXNvdXJjZUlkOiBgLyR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH1NeVN0YWNrL015RXhwb3J0YCxcbiAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICBUYWdzOiBbe1xuICAgICAgICBLZXk6ICdhd3MtY2RrOnN0cm9uZy1yZWY6TXlTdGFjaycsXG4gICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgICBleHBlY3QobW9ja1JlbW92ZVRhZ3NGcm9tUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIFJlc291cmNlSWQ6ICcvY2RrL2V4cG9ydHMvTXlTdGFjay9SZW1vdmVkRXhwb3J0JyxcbiAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICBUYWdLZXlzOiBbJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJ10sXG4gICAgfSk7XG4gICAgZXhwZWN0KG1vY2tEZWxldGVQYXJhbWV0ZXJzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0RlbGV0ZSBldmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnRGVsZXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgIFJlYWRlclByb3BzOiB7XG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICBwcmVmaXg6ICdNeVN0YWNrJyxcbiAgICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svUmVtb3ZlZEV4cG9ydCc6ICdhYmMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG1vY2tHZXRQYXJhbWV0ZXJzQnlQYXRoLm1vY2tJbXBsZW1lbnRhdGlvbk9uY2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIFBhcmFtZXRlcnM6IFt7XG4gICAgICAgICAgTmFtZTogJy9jZGsvZXhwb3J0cy9NeVN0YWNrL090aGVyRXhwb3J0JyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobW9ja1JlbW92ZVRhZ3NGcm9tUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICBleHBlY3QobW9ja1JlbW92ZVRhZ3NGcm9tUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICBSZXNvdXJjZUlkOiAnL2Nkay9leHBvcnRzL015U3RhY2svUmVtb3ZlZEV4cG9ydCcsXG4gICAgICBUYWdLZXlzOiBbJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJ10sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG1ha2VFdmVudChyZXE6IFBhcnRpYWw8QVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudD4pOiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50IHtcbiAgcmV0dXJuIHtcbiAgICBMb2dpY2FsUmVzb3VyY2VJZDogJzxMb2dpY2FsUmVzb3VyY2VJZD4nLFxuICAgIFJlcXVlc3RJZDogJzxSZXF1ZXN0SWQ+JyxcbiAgICBSZXNvdXJjZVR5cGU6ICc8UmVzb3VyY2VUeXBlPicsXG4gICAgUmVzcG9uc2VVUkw6ICc8UmVzcG9uc2VVUkw+JyxcbiAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgU3RhY2tJZDogJzxTdGFja0lkPicsXG4gICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAuLi5yZXEuUmVzb3VyY2VQcm9wZXJ0aWVzLFxuICAgIH0sXG4gICAgLi4ucmVxLFxuICB9IGFzIGFueTtcbn1cbiJdfQ==