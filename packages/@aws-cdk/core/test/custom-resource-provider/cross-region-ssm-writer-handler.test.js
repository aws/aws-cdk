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
            await cross_region_ssm_writer_handler_1.handler(event);
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
            await expect(cross_region_ssm_writer_handler_1.handler(event)).rejects.toThrow(/Exports cannot be updated/);
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
            await cross_region_ssm_writer_handler_1.handler(event);
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
            await cross_region_ssm_writer_handler_1.handler(event);
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
            await cross_region_ssm_writer_handler_1.handler(event);
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
            await expect(cross_region_ssm_writer_handler_1.handler(event)).rejects.toThrow(/Exports cannot be updated/);
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
            await expect(cross_region_ssm_writer_handler_1.handler(event)).rejects.toThrow(/Some exports have changed/);
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
            await expect(cross_region_ssm_writer_handler_1.handler(event)).rejects.toThrow(/Exports cannot be updated/);
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
            await cross_region_ssm_writer_handler_1.handler(event);
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
            await expect(cross_region_ssm_writer_handler_1.handler(event)).rejects.toThrow(/Exports cannot be updated/);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtcmVnaW9uLXNzbS13cml0ZXItaGFuZGxlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3Jvc3MtcmVnaW9uLXNzbS13cml0ZXItaGFuZGxlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0pBQTJIO0FBQzNILGtHQUFnSDtBQUVoSCxJQUFJLGdCQUEyQixDQUFFO0FBQ2pDLElBQUksdUJBQWtDLENBQUM7QUFDdkMsSUFBSSxvQkFBK0IsQ0FBQztBQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDeEIsT0FBTztRQUNMLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtZQUNoQixPQUFPO2dCQUNMLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQy9CLE9BQU87d0JBQ0wsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztxQkFDeEMsQ0FBQztnQkFDSixDQUFDLENBQUM7Z0JBQ0YsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUN0QyxPQUFPO3dCQUNMLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUM7cUJBQy9DLENBQUM7Z0JBQ0osQ0FBQyxDQUFDO2dCQUNGLGdCQUFnQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDbkMsT0FBTzt3QkFDTCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDO3FCQUM1QyxDQUFDO2dCQUNKLENBQUMsQ0FBQzthQUNILENBQUM7UUFDSixDQUFDLENBQUM7S0FDSCxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSCxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2Qs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QUUscUJBQXFCO1FBQ3hDLFNBQVMsRUFBRSxhQUFhO1FBQ3hCLFlBQVksRUFBRSxnQkFBZ0I7UUFDOUIsV0FBVyxFQUFFLGVBQWU7UUFDNUIsWUFBWSxFQUFFLGdCQUFnQjtRQUM5QixPQUFPLEVBQUUsV0FBVztRQUNwQixrQkFBa0IsRUFBRTtZQUNsQixZQUFZLEVBQUUsZ0JBQWdCO1lBQzlCLEdBQUcsR0FBRyxDQUFDLGtCQUFrQjtTQUMxQjtRQUNELEdBQUcsR0FBRztLQUNBLENBQUM7QUFDWCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFuZGxlciB9IGZyb20gJy4uLy4uL2xpYi9jdXN0b20tcmVzb3VyY2UtcHJvdmlkZXIvY3Jvc3MtcmVnaW9uLWV4cG9ydC1wcm92aWRlcnMvY3Jvc3MtcmVnaW9uLXNzbS13cml0ZXItaGFuZGxlcic7XG5pbXBvcnQgeyBTU01fRVhQT1JUX1BBVEhfUFJFRklYIH0gZnJvbSAnLi4vLi4vbGliL2N1c3RvbS1yZXNvdXJjZS1wcm92aWRlci9jcm9zcy1yZWdpb24tZXhwb3J0LXByb3ZpZGVycy90eXBlcyc7XG5cbmxldCBtb2NrUHV0UGFyYW1ldGVyOiBqZXN0Lk1vY2sgO1xubGV0IG1vY2tsaXN0VGFnc0ZvclJlc291cmNlOiBqZXN0Lk1vY2s7XG5sZXQgbW9ja0RlbGV0ZVBhcmFtZXRlcnM6IGplc3QuTW9jaztcbmplc3QubW9jaygnYXdzLXNkaycsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBTU006IGplc3QuZm4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0UGFyYW1ldGVyOiBqZXN0LmZuKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZTogKCkgPT4gbW9ja1B1dFBhcmFtZXRlcihwYXJhbXMpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgICAgICBsaXN0VGFnc0ZvclJlc291cmNlOiBqZXN0LmZuKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZTogKCkgPT4gbW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UocGFyYW1zKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICAgICAgZGVsZXRlUGFyYW1ldGVyczogamVzdC5mbigocGFyYW1zKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByb21pc2U6ICgpID0+IG1vY2tEZWxldGVQYXJhbWV0ZXJzKHBhcmFtcyksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIH0pLFxuICB9O1xufSk7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgamVzdC5zcHlPbihjb25zb2xlLCAnaW5mbycpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7fSk7XG4gIGplc3Quc3B5T24oY29uc29sZSwgJ2Vycm9yJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHt9KTtcbiAgbW9ja1B1dFBhcmFtZXRlciA9IGplc3QuZm4oKTtcbiAgbW9ja0RlbGV0ZVBhcmFtZXRlcnMgPSBqZXN0LmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICByZXR1cm4ge307XG4gIH0pO1xuICBtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZSA9IGplc3QuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgIHJldHVybiB7fTtcbiAgfSk7XG4gIG1vY2tQdXRQYXJhbWV0ZXIubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICByZXR1cm4ge307XG4gIH0pO1xufSk7XG5hZnRlckVhY2goKCkgPT4ge1xuICBqZXN0LnJlc3RvcmVBbGxNb2NrcygpO1xufSk7XG5cbmRlc2NyaWJlKCdjcm9zcy1yZWdpb24tc3NtLXdyaXRlciB0aHJvd3MnLCAoKSA9PiB7XG5cbn0pO1xuXG5kZXNjcmliZSgnY3Jvc3MtcmVnaW9uLXNzbS13cml0ZXIgZW50cnlwb2ludCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2NyZWF0ZSBldmVudHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnQ3JlYXRlIGV2ZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgYXdhaXQgaGFuZGxlcihldmVudCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtb2NrUHV0UGFyYW1ldGVyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIE5hbWU6IGAvJHtTU01fRVhQT1JUX1BBVEhfUFJFRklYfU15U3RhY2svTXlFeHBvcnRgLFxuICAgICAgICBWYWx1ZTogJ1ZhbHVlJyxcbiAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChtb2NrUHV0UGFyYW1ldGVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICBleHBlY3QobW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NyZWF0ZSB0aHJvd3MgaWYgcGFyYW1zIGFscmVhZHkgZXhpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFRhZ0xpc3Q6IFt7XG4gICAgICAgICAgICBLZXk6ICdhd3MtY2RrOnN0cm9uZy1yZWY6TXlTdGFjaycsXG4gICAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGF3YWl0IGV4cGVjdChoYW5kbGVyKGV2ZW50KSkucmVqZWN0cy50b1Rocm93KC9FeHBvcnRzIGNhbm5vdCBiZSB1cGRhdGVkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdDcmVhdGUgZXZlbnQgZG9lcyBub3QgdGhyb3cgZm9yIG5ldyBwYXJhbWV0ZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UubW9ja1JlamVjdGVkVmFsdWUoe1xuICAgICAgICBjb2RlOiAnSW52YWxpZFJlc291cmNlSWQnLFxuICAgICAgfSk7XG4gICAgICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KG1vY2tQdXRQYXJhbWV0ZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgTmFtZTogYC8ke1NTTV9FWFBPUlRfUEFUSF9QUkVGSVh9TXlTdGFjay9NeUV4cG9ydGAsXG4gICAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KG1vY2tQdXRQYXJhbWV0ZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnVXBkYXRlIGV2ZW50cycsICgpID0+IHtcbiAgICB0ZXN0KCduZXcgZXhwb3J0IGFkZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9FeGlzdGluZ0V4cG9ydCc6ICdNeUV4aXN0aW5nVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9FeGlzdGluZ0V4cG9ydCc6ICdNeUV4aXN0aW5nVmFsdWUnLFxuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svTXlFeHBvcnQnOiAnVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBOYW1lOiBgLyR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH1NeVN0YWNrL015RXhwb3J0YCxcbiAgICAgICAgVmFsdWU6ICdWYWx1ZScsXG4gICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgICAgZXhwZWN0KG1vY2tsaXN0VGFnc0ZvclJlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlbW92ZWQgZXhwb3J0cyBhcmUgZGVsZXRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBldmVudCA9IG1ha2VFdmVudCh7XG4gICAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgICAgT2xkUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svRXhpc3RpbmdFeHBvcnQnOiAnTXlFeGlzdGluZ1ZhbHVlJyxcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL1JlbW92ZWRFeHBvcnQnOiAnTXlFeGlzdGluZ1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svRXhpc3RpbmdFeHBvcnQnOiAnTXlFeGlzdGluZ1ZhbHVlJyxcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KG1vY2tQdXRQYXJhbWV0ZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgTmFtZTogYC8ke1NTTV9FWFBPUlRfUEFUSF9QUkVGSVh9TXlTdGFjay9NeUV4cG9ydGAsXG4gICAgICAgIFZhbHVlOiAnVmFsdWUnLFxuICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KG1vY2tQdXRQYXJhbWV0ZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpO1xuICAgICAgZXhwZWN0KG1vY2tEZWxldGVQYXJhbWV0ZXJzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgTmFtZXM6IFsnL2Nkay9leHBvcnRzL015U3RhY2svUmVtb3ZlZEV4cG9ydCddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd1cGRhdGUgdGhyb3dzIGlmIHBhcmFtcyBhbHJlYWR5IGV4aXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL015RXhwb3J0JzogJ1ZhbHVlJyxcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0FscmVhZHlFeGlzdHMnOiAnVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG1vY2tsaXN0VGFnc0ZvclJlc291cmNlLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgVGFnTGlzdDogW3tcbiAgICAgICAgICAgIEtleTogJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJyxcbiAgICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgYXdhaXQgZXhwZWN0KGhhbmRsZXIoZXZlbnQpKS5yZWplY3RzLnRvVGhyb3coL0V4cG9ydHMgY2Fubm90IGJlIHVwZGF0ZWQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3VwZGF0ZSB0aHJvd3MgaWYgdmFsdWUgY2hhbmdlcyBmb3IgZXhpc3RpbmcgcGFyYW1ldGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdWYWx1ZScsXG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9BbHJlYWR5RXhpc3RzJzogJ09yaWdpbmFsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svTXlFeHBvcnQnOiAnVmFsdWUnLFxuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svQWxyZWFkeUV4aXN0cyc6ICdOZXdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbW9ja2xpc3RUYWdzRm9yUmVzb3VyY2UubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMpID0+IHtcbiAgICAgICAgZXhwZWN0KHBhcmFtcykudG9FcXVhbCh7XG4gICAgICAgICAgUmVzb3VyY2VJZDogJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0FscmVhZHlFeGlzdHMnLFxuICAgICAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFRhZ0xpc3Q6IFt7XG4gICAgICAgICAgICBLZXk6ICdhd3MtY2RrOnN0cm9uZy1yZWY6TXlTdGFjaycsXG4gICAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGF3YWl0IGV4cGVjdChoYW5kbGVyKGV2ZW50KSkucmVqZWN0cy50b1Rocm93KC9Tb21lIGV4cG9ydHMgaGF2ZSBjaGFuZ2VkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd1cGRhdGUgdGhyb3dzIGlmIGluIHVzZSBwYXJhbSBpcyBkZWxldGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KHtcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICc8U2VydmljZVRva2VuPicsXG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlTdGFjay9NeUV4cG9ydCc6ICdWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL0FscmVhZHlFeGlzdHMnOiAnVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG1vY2tsaXN0VGFnc0ZvclJlc291cmNlLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgVGFnTGlzdDogW3tcbiAgICAgICAgICAgIEtleTogJ2F3cy1jZGs6c3Ryb25nLXJlZjpNeVN0YWNrJyxcbiAgICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgYXdhaXQgZXhwZWN0KGhhbmRsZXIoZXZlbnQpKS5yZWplY3RzLnRvVGhyb3coL0V4cG9ydHMgY2Fubm90IGJlIHVwZGF0ZWQvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlbGV0ZSBldmVudHMnLCAoKSA9PiB7XG4gICAgdGVzdCgncGFyYW1ldGVycyBhcmUgZGVsZXRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBldmVudCA9IG1ha2VFdmVudCh7XG4gICAgICAgIFJlcXVlc3RUeXBlOiAnRGVsZXRlJyxcbiAgICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiAnPFNlcnZpY2VUb2tlbj4nLFxuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015U3RhY2svUmVtb3ZlZEV4cG9ydCc6ICdSZW1vdmVkVmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDApO1xuICAgICAgZXhwZWN0KG1vY2tsaXN0VGFnc0ZvclJlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgIGV4cGVjdChtb2NrRGVsZXRlUGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBOYW1lczogWycvY2RrL2V4cG9ydHMvTXlTdGFjay9SZW1vdmVkRXhwb3J0J10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rob3J3cyBpZiBwYXJhbWV0ZXJzIGFyZSBpbiB1c2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXZlbnQgPSBtYWtlRXZlbnQoe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ0RlbGV0ZScsXG4gICAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVN0YWNrL1JlbW92ZWRFeHBvcnQnOiAnUmVtb3ZlZFZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBtb2NrbGlzdFRhZ3NGb3JSZXNvdXJjZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFRhZ0xpc3Q6IFt7XG4gICAgICAgICAgICBLZXk6ICdhd3MtY2RrOnN0cm9uZy1yZWY6TXlTdGFjaycsXG4gICAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGF3YWl0IGV4cGVjdChoYW5kbGVyKGV2ZW50KSkucmVqZWN0cy50b1Rocm93KC9FeHBvcnRzIGNhbm5vdCBiZSB1cGRhdGVkLyk7XG4gICAgICBleHBlY3QobW9ja1B1dFBhcmFtZXRlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDApO1xuICAgICAgZXhwZWN0KG1vY2tsaXN0VGFnc0ZvclJlc291cmNlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICBleHBlY3QobW9ja0RlbGV0ZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygwKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gbWFrZUV2ZW50KHJlcTogUGFydGlhbDxBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50Pik6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQge1xuICByZXR1cm4ge1xuICAgIExvZ2ljYWxSZXNvdXJjZUlkOiAnPExvZ2ljYWxSZXNvdXJjZUlkPicsXG4gICAgUmVxdWVzdElkOiAnPFJlcXVlc3RJZD4nLFxuICAgIFJlc291cmNlVHlwZTogJzxSZXNvdXJjZVR5cGU+JyxcbiAgICBSZXNwb25zZVVSTDogJzxSZXNwb25zZVVSTD4nLFxuICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICBTdGFja0lkOiAnPFN0YWNrSWQ+JyxcbiAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgIFNlcnZpY2VUb2tlbjogJzxTZXJ2aWNlVG9rZW4+JyxcbiAgICAgIC4uLnJlcS5SZXNvdXJjZVByb3BlcnRpZXMsXG4gICAgfSxcbiAgICAuLi5yZXEsXG4gIH0gYXMgYW55O1xufVxuIl19