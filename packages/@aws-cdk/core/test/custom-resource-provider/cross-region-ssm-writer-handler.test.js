"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cross_region_ssm_writer_handler_1 = require("../../lib/custom-resource-provider/cross-region-export-providers/cross-region-ssm-writer-handler");
const types_1 = require("../../lib/custom-resource-provider/cross-region-export-providers/types");
let mockPutParameter;
let mocklistTagsForResource;
let mockDeleteParameters;
jest.mock('aws-sdk', () => {
    return {
        SSM: jest.fn(() => {
            return {
                putParameter: jest.fn((params) => {
                    return {
                        promise: () => mockPutParameter(params),
                    };
                }),
                listTagsForResource: jest.fn((params) => {
                    return {
                        promise: () => mocklistTagsForResource(params),
                    };
                }),
                deleteParameters: jest.fn((params) => {
                    return {
                        promise: () => mockDeleteParameters(params),
                    };
                }),
            };
        }),
    };
});
beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockPutParameter = jest.fn();
    mockDeleteParameters = jest.fn().mockImplementation(() => {
        return {};
    });
    mocklistTagsForResource = jest.fn().mockImplementation(() => {
        return {};
    });
    mockPutParameter.mockImplementation(() => {
        return {};
    });
});
afterEach(() => {
    jest.restoreAllMocks();
});
describe('cross-region-ssm-writer throws', () => {
});
describe('cross-region-ssm-writer entrypoint', () => {
    describe('create events', () => {
        test('Create event', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Create',
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                        },
                    },
                },
            });
            // WHEN
            await (0, cross_region_ssm_writer_handler_1.handler)(event);
            // THEN
            expect(mockPutParameter).toHaveBeenCalledWith({
                Name: `/${types_1.SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
                Value: 'Value',
                Type: 'String',
            });
            expect(mockPutParameter).toHaveBeenCalledTimes(1);
            expect(mocklistTagsForResource).toHaveBeenCalledTimes(1);
        });
        test('create throws if params already exist', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Create',
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                        },
                    },
                },
            });
            // WHEN
            mocklistTagsForResource.mockImplementation(() => {
                return {
                    TagList: [{
                            Key: 'aws-cdk:strong-ref:MyStack',
                            Value: 'true',
                        }],
                };
            });
            // THEN
            await expect((0, cross_region_ssm_writer_handler_1.handler)(event)).rejects.toThrow(/Exports cannot be updated/);
        });
        test('Create event does not throw for new parameters', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Create',
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                        },
                    },
                },
            });
            // WHEN
            mocklistTagsForResource.mockRejectedValue({
                code: 'InvalidResourceId',
            });
            await (0, cross_region_ssm_writer_handler_1.handler)(event);
            // THEN
            expect(mockPutParameter).toHaveBeenCalledWith({
                Name: `/${types_1.SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
                Value: 'Value',
                Type: 'String',
            });
            expect(mockPutParameter).toHaveBeenCalledTimes(1);
            expect(mocklistTagsForResource).toHaveBeenCalledTimes(1);
        });
    });
    describe('Update events', () => {
        test('new export added', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Update',
                OldResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/ExistingExport': 'MyExistingValue',
                        },
                    },
                },
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/ExistingExport': 'MyExistingValue',
                            '/cdk/exports/MyStack/MyExport': 'Value',
                        },
                    },
                },
            });
            // WHEN
            await (0, cross_region_ssm_writer_handler_1.handler)(event);
            // THEN
            expect(mockPutParameter).toHaveBeenCalledWith({
                Name: `/${types_1.SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
                Value: 'Value',
                Type: 'String',
            });
            expect(mockPutParameter).toHaveBeenCalledTimes(1);
            expect(mocklistTagsForResource).toHaveBeenCalledTimes(1);
            expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
        });
        test('removed exports are deleted', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Update',
                OldResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/ExistingExport': 'MyExistingValue',
                            '/cdk/exports/MyStack/RemovedExport': 'MyExistingValue',
                        },
                    },
                },
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/ExistingExport': 'MyExistingValue',
                            '/cdk/exports/MyStack/MyExport': 'Value',
                        },
                    },
                },
            });
            // WHEN
            await (0, cross_region_ssm_writer_handler_1.handler)(event);
            // THEN
            expect(mockPutParameter).toHaveBeenCalledWith({
                Name: `/${types_1.SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
                Value: 'Value',
                Type: 'String',
            });
            expect(mockPutParameter).toHaveBeenCalledTimes(1);
            expect(mocklistTagsForResource).toHaveBeenCalledTimes(2);
            expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
            expect(mockDeleteParameters).toHaveBeenCalledWith({
                Names: ['/cdk/exports/MyStack/RemovedExport'],
            });
        });
        test('update throws if params already exist', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Update',
                OldResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                        },
                    },
                },
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                            '/cdk/exports/MyStack/AlreadyExists': 'Value',
                        },
                    },
                },
            });
            // WHEN
            mocklistTagsForResource.mockImplementation(() => {
                return {
                    TagList: [{
                            Key: 'aws-cdk:strong-ref:MyStack',
                            Value: 'true',
                        }],
                };
            });
            // THEN
            await expect((0, cross_region_ssm_writer_handler_1.handler)(event)).rejects.toThrow(/Exports cannot be updated/);
        });
        test('update throws if value changes for existing parameter', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Update',
                OldResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                            '/cdk/exports/MyStack/AlreadyExists': 'Original',
                        },
                    },
                },
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                            '/cdk/exports/MyStack/AlreadyExists': 'NewValue',
                        },
                    },
                },
            });
            // WHEN
            mocklistTagsForResource.mockImplementation((params) => {
                expect(params).toEqual({
                    ResourceId: '/cdk/exports/MyStack/AlreadyExists',
                    ResourceType: 'Parameter',
                });
                return {
                    TagList: [{
                            Key: 'aws-cdk:strong-ref:MyStack',
                            Value: 'true',
                        }],
                };
            });
            // THEN
            await expect((0, cross_region_ssm_writer_handler_1.handler)(event)).rejects.toThrow(/Some exports have changed/);
        });
        test('update throws if in use param is deleted', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Update',
                OldResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/MyExport': 'Value',
                        },
                    },
                },
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/AlreadyExists': 'Value',
                        },
                    },
                },
            });
            // WHEN
            mocklistTagsForResource.mockImplementation(() => {
                return {
                    TagList: [{
                            Key: 'aws-cdk:strong-ref:MyStack',
                            Value: 'true',
                        }],
                };
            });
            // THEN
            await expect((0, cross_region_ssm_writer_handler_1.handler)(event)).rejects.toThrow(/Exports cannot be updated/);
        });
    });
    describe('delete events', () => {
        test('parameters are deleted', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Delete',
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/RemovedExport': 'RemovedValue',
                        },
                    },
                },
            });
            // WHEN
            await (0, cross_region_ssm_writer_handler_1.handler)(event);
            // THEN
            expect(mockPutParameter).toHaveBeenCalledTimes(0);
            expect(mocklistTagsForResource).toHaveBeenCalledTimes(1);
            expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
            expect(mockDeleteParameters).toHaveBeenCalledWith({
                Names: ['/cdk/exports/MyStack/RemovedExport'],
            });
        });
        test('thorws if parameters are in use', async () => {
            // GIVEN
            const event = makeEvent({
                RequestType: 'Delete',
                ResourceProperties: {
                    ServiceToken: '<ServiceToken>',
                    WriterProps: {
                        region: 'us-east-1',
                        exports: {
                            '/cdk/exports/MyStack/RemovedExport': 'RemovedValue',
                        },
                    },
                },
            });
            // WHEN
            mocklistTagsForResource.mockImplementation(() => {
                return {
                    TagList: [{
                            Key: 'aws-cdk:strong-ref:MyStack',
                            Value: 'true',
                        }],
                };
            });
            // THEN
            await expect((0, cross_region_ssm_writer_handler_1.handler)(event)).rejects.toThrow(/Exports cannot be updated/);
            expect(mockPutParameter).toHaveBeenCalledTimes(0);
            expect(mocklistTagsForResource).toHaveBeenCalledTimes(1);
            expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtcmVnaW9uLXNzbS13cml0ZXItaGFuZGxlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3Jvc3MtcmVnaW9uLXNzbS13cml0ZXItaGFuZGxlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0pBQTJIO0FBQzNILGtHQUFnSDtBQUVoSCxJQUFJLGdCQUEyQixDQUFFO0FBQ2pDLElBQUksdUJBQWtDLENBQUM7QUFDdkMsSUFBSSxvQkFBK0IsQ0FBQztBQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDeEIsT0FBTztRQUNMLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtZQUNoQixPQUFPO2dCQUNMLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQy9CLE9BQU87d0JBQ0wsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztxQkFDeEMsQ0FBQztnQkFDSixDQUFDLENBQUM7Z0JBQ0YsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUN0QyxPQUFPO3dCQUNMLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUM7cUJBQy9DLENBQUM7Z0JBQ0osQ0FBQyxDQUFDO2dCQUNGLGdCQUFnQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDbkMsT0FBTzt3QkFDTCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDO3FCQUM1QyxDQUFDO2dCQUNKLENBQUMsQ0FBQzthQUNILENBQUM7UUFDSixDQUFDLENBQUM7S0FDSCxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSCxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2Qs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QUVILFNBQVMsU0FBUyxDQUFDLEdBQXlEO0lBQzFFLE9BQU87UUFDTCxpQkFBaUIsRUFBRSxxQkFBcUI7UUFDeEMsU0FBUyxFQUFFLGFBQWE7UUFDeEIsWUFBWSxFQUFFLGdCQUFnQjtRQUM5QixXQUFXLEVBQUUsZUFBZTtRQUM1QixZQUFZLEVBQUUsZ0JBQWdCO1FBQzlCLE9BQU8sRUFBRSxXQUFXO1FBQ3BCLGtCQUFrQixFQUFFO1lBQ2xCLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsR0FBRyxHQUFHLENBQUMsa0JBQWtCO1NBQzFCO1FBQ0QsR0FBRyxHQUFHO0tBQ0EsQ0FBQztBQUNYLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoYW5kbGVyIH0gZnJvbSAnLi4vLi4vbGliL2N1c3RvbS1yZXNvdXJjZS1wcm92aWRlci9jcm9zcy1yZWdpb24tZXhwb3J0LXByb3ZpZGVycy9jcm9zcy1yZWdpb24tc3NtLXdyaXRlci1oYW5kbGVyJztcbmltcG9ydCB7IFNTTV9FWFBPUlRfUEFUSF9QUkVGSVggfSBmcm9tICcuLi8uLi9saWIvY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyL2Nyb3NzLXJlZ2lvbi1leHBvcnQtcHJvdmlkZXJzL3R5cGVzJztcblxubGV0IG1vY2tQdXRQYXJhbWV0ZXI6IGplc3QuTW9jayA7XG5sZXQgbW9ja2xpc3RUYWdzRm9yUmVzb3VyY2U6IGplc3QuTW9jaztcbmxldCBtb2NrRGVsZXRlUGFyYW1ldGVyczogamVzdC5Nb2NrO1xuamVzdC5tb2NrKCdhd3Mtc2RrJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIFNTTTogamVzdC5mbigoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXRQYXJhbWV0ZXI6IGplc3QuZm4oKHBhcmFtcykgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9taXNlOiAoKSA9PiBtb2NrUHV0UGFyYW1ldGVyKHBhcmFtcyksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgICAgIGxpc3RUYWdzRm9yUmVzb3VyY2U6IGplc3QuZm4oKHBhcmFtcykgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9taXNlOiAoKSA9PiBtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZShwYXJhbXMpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgICAgICBkZWxldGVQYXJhbWV0ZXJzOiBqZXN0LmZuKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZTogKCkgPT4gbW9ja0RlbGV0ZVBhcmFtZXRlcnMocGFyYW1zKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSksXG4gIH07XG59KTtcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBqZXN0LnNweU9uKGNvbnNvbGUsICdpbmZvJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHt9KTtcbiAgamVzdC5zcHlPbihjb25zb2xlLCAnZXJyb3InKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge30pO1xuICBtb2NrUHV0UGFyYW1ldGVyID0gamVzdC5mbigpO1xuICBtb2NrRGVsZXRlUGFyYW1ldGVycyA9IGplc3QuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgIHJldHVybiB7fTtcbiAgfSk7XG4gIG1vY2tsaXN0VGFnc0ZvclJlc291cmNlID0gamVzdC5mbigpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgcmV0dXJuIHt9O1xuICB9KTtcbiAgbW9ja1B1dFBhcmFtZXRlci5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgIHJldHVybiB7fTtcbiAgfSk7XG59KTtcbmFmdGVyRWFjaCgoKSA9PiB7XG4gIGplc3QucmVzdG9yZUFsbE1vY2tzKCk7XG59KTtcblxuZGVzY3JpYmUoJ2Nyb3NzLXJlZ2lvbi1zc20td3JpdGVyIHRocm93cycsICgpID0+IHtcblxufSk7XG5cbmRlc2NyaWJlKCdjcm9zcy1yZWdpb24tc3NtLXdyaXRlciBlbnRyeXBvaW50JywgKCkgPT4ge1xuICBkZXNjcmliZSgnY3JlYXRlIGV2ZW50cycsICgpID0+IHtcbiAgICB0ZXN0KCdDcmVhdGUgZXZlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KG1vY2tQdXRQYXJhbWV0ZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgTmFtZTogYC8ke1NTTV9FWFBPUlRfUEFUSF9QUkVGSVh9TXlTdGFjay9NeUV4cG9ydGAsXG4gICAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KG1vY2tQdXRQYXJhbWV0ZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlIHRocm93cyBpZiBwYXJhbXMgYWxyZWFkeSBleGlzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBldmVudCA9IG1ha2VFdmVudCh7XG4gICAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svTXlFeHBvcnQnOiAnVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG1vY2tsaXN0VGFnc0ZvclJlc291cmNlLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgVGFnTGlzdDogW3tcbiAgICAgICAgICAgIEtleTogJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJyxcbiAgICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgYXdhaXQgZXhwZWN0KGhhbmRsZXIoZXZlbnQpKS5yZWplY3RzLnRvVGhyb3coL0V4cG9ydHMgY2Fubm90IGJlIHVwZGF0ZWQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0NyZWF0ZSBldmVudCBkb2VzIG5vdCB0aHJvdyBmb3IgbmV3IHBhcmFtZXRlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZS5tb2NrUmVqZWN0ZWRWYWx1ZSh7XG4gICAgICAgIGNvZGU6ICdJbnZhbGlkUmVzb3VyY2VJZCcsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBOYW1lOiBgLyR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH1NeVN0YWNrL015RXhwb3J0YCxcbiAgICAgICAgVmFsdWU6ICdWYWx1ZScsXG4gICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgICAgZXhwZWN0KG1vY2tsaXN0VGFnc0ZvclJlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdVcGRhdGUgZXZlbnRzJywgKCkgPT4ge1xuICAgIHRlc3QoJ25ldyBleHBvcnQgYWRkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0V4aXN0aW5nRXhwb3J0JzogJ015RXhpc3RpbmdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0V4aXN0aW5nRXhwb3J0JzogJ015RXhpc3RpbmdWYWx1ZScsXG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgYXdhaXQgaGFuZGxlcihldmVudCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtb2NrUHV0UGFyYW1ldGVyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIE5hbWU6IGAvJHtTU01fRVhQT1JUX1BBVEhfUFJFRklYfU15U3RhY2svTXlFeHBvcnRgLFxuICAgICAgICBWYWx1ZTogJ1ZhbHVlJyxcbiAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChtb2NrUHV0UGFyYW1ldGVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICBleHBlY3QobW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrRGVsZXRlUGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVtb3ZlZCBleHBvcnRzIGFyZSBkZWxldGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9FeGlzdGluZ0V4cG9ydCc6ICdNeUV4aXN0aW5nVmFsdWUnLFxuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svUmVtb3ZlZEV4cG9ydCc6ICdNeUV4aXN0aW5nVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9FeGlzdGluZ0V4cG9ydCc6ICdNeUV4aXN0aW5nVmFsdWUnLFxuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svTXlFeHBvcnQnOiAnVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBOYW1lOiBgLyR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH1NeVN0YWNrL015RXhwb3J0YCxcbiAgICAgICAgVmFsdWU6ICdWYWx1ZScsXG4gICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgICAgZXhwZWN0KG1vY2tsaXN0VGFnc0ZvclJlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMik7XG4gICAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrRGVsZXRlUGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBOYW1lczogWycvY2RrL2V4cG9ydHMvTXlTdGFjay9SZW1vdmVkRXhwb3J0J10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3VwZGF0ZSB0aHJvd3MgaWYgcGFyYW1zIGFscmVhZHkgZXhpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svTXlFeHBvcnQnOiAnVmFsdWUnLFxuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svQWxyZWFkeUV4aXN0cyc6ICdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBUYWdMaXN0OiBbe1xuICAgICAgICAgICAgS2V5OiAnYXdzLWNkazpzdHJvbmctcmVmOk15U3RhY2snLFxuICAgICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBhd2FpdCBleHBlY3QoaGFuZGxlcihldmVudCkpLnJlamVjdHMudG9UaHJvdygvRXhwb3J0cyBjYW5ub3QgYmUgdXBkYXRlZC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndXBkYXRlIHRocm93cyBpZiB2YWx1ZSBjaGFuZ2VzIGZvciBleGlzdGluZyBwYXJhbWV0ZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0FscmVhZHlFeGlzdHMnOiAnT3JpZ2luYWwnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdWYWx1ZScsXG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9BbHJlYWR5RXhpc3RzJzogJ05ld1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZS5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcykgPT4ge1xuICAgICAgICBleHBlY3QocGFyYW1zKS50b0VxdWFsKHtcbiAgICAgICAgICBSZXNvdXJjZUlkOiAnL2Nkay9leHBvcnRzL015U3RhY2svQWxyZWFkeUV4aXN0cycsXG4gICAgICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgVGFnTGlzdDogW3tcbiAgICAgICAgICAgIEtleTogJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJyxcbiAgICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgYXdhaXQgZXhwZWN0KGhhbmRsZXIoZXZlbnQpKS5yZWplY3RzLnRvVGhyb3coL1NvbWUgZXhwb3J0cyBoYXZlIGNoYW5nZWQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3VwZGF0ZSB0aHJvd3MgaWYgaW4gdXNlIHBhcmFtIGlzIGRlbGV0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svQWxyZWFkeUV4aXN0cyc6ICdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBUYWdMaXN0OiBbe1xuICAgICAgICAgICAgS2V5OiAnYXdzLWNkazpzdHJvbmctcmVmOk15U3RhY2snLFxuICAgICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBhd2FpdCBleHBlY3QoaGFuZGxlcihldmVudCkpLnJlamVjdHMudG9UaHJvdygvRXhwb3J0cyBjYW5ub3QgYmUgdXBkYXRlZC8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZGVsZXRlIGV2ZW50cycsICgpID0+IHtcbiAgICB0ZXN0KCdwYXJhbWV0ZXJzIGFyZSBkZWxldGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdEZWxldGUnLFxuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9SZW1vdmVkRXhwb3J0JzogJ1JlbW92ZWRWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgYXdhaXQgaGFuZGxlcihldmVudCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtb2NrUHV0UGFyYW1ldGVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMCk7XG4gICAgICBleHBlY3QobW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrRGVsZXRlUGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgICAgZXhwZWN0KG1vY2tEZWxldGVQYXJhbWV0ZXJzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIE5hbWVzOiBbJy9jZGsvZXhwb3J0cy9NeVN0YWNrL1JlbW92ZWRFeHBvcnQnXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhvcndzIGlmIHBhcmFtZXRlcnMgYXJlIGluIHVzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBldmVudCA9IG1ha2VFdmVudCh7XG4gICAgICAgIFJlcXVlc3RUeXBlOiAnRGVsZXRlJyxcbiAgICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svUmVtb3ZlZEV4cG9ydCc6ICdSZW1vdmVkVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG1vY2tsaXN0VGFnc0ZvclJlc291cmNlLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgVGFnTGlzdDogW3tcbiAgICAgICAgICAgIEtleTogJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJyxcbiAgICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgYXdhaXQgZXhwZWN0KGhhbmRsZXIoZXZlbnQpKS5yZWplY3RzLnRvVGhyb3coL0V4cG9ydHMgY2Fubm90IGJlIHVwZGF0ZWQvKTtcbiAgICAgIGV4cGVjdChtb2NrUHV0UGFyYW1ldGVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMCk7XG4gICAgICBleHBlY3QobW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrRGVsZXRlUGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBtYWtlRXZlbnQocmVxOiBQYXJ0aWFsPEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQ+KTogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCB7XG4gIHJldHVybiB7XG4gICAgTG9naWNhbFJlc291cmNlSWQ6ICc8TG9naWNhbFJlc291cmNlSWQ+JyxcbiAgICBSZXF1ZXN0SWQ6ICc8UmVxdWVzdElkPicsXG4gICAgUmVzb3VyY2VUeXBlOiAnPFJlc291cmNlVHlwZT4nLFxuICAgIFJlc3BvbnNlVVJMOiAnPFJlc3BvbnNlVVJMPicsXG4gICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgIFN0YWNrSWQ6ICc8U3RhY2tJZD4nLFxuICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgLi4ucmVxLlJlc291cmNlUHJvcGVydGllcyxcbiAgICB9LFxuICAgIC4uLnJlcSxcbiAgfSBhcyBhbnk7XG59XG4iXX0=