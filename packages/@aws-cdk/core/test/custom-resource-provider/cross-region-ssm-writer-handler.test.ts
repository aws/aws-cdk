import { handler } from '../../lib/custom-resource-provider/cross-region-export-providers/cross-region-ssm-writer-handler';
import { SSM_EXPORT_PATH_PREFIX } from '../../lib/custom-resource-provider/cross-region-export-providers/types';

let mockPutParameter: jest.Mock ;
let mocklistTagsForResource: jest.Mock;
let mockDeleteParameters: jest.Mock;
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
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
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
      await handler(event);

      // THEN
      expect(mockPutParameter).toHaveBeenCalledWith({
        Name: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
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
      await expect(handler(event)).rejects.toThrow(/Exports cannot be updated/);
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
      await handler(event);

      // THEN
      expect(mockPutParameter).toHaveBeenCalledWith({
        Name: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
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
      await handler(event);

      // THEN
      expect(mockPutParameter).toHaveBeenCalledWith({
        Name: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
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
      await handler(event);

      // THEN
      expect(mockPutParameter).toHaveBeenCalledWith({
        Name: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
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
      await expect(handler(event)).rejects.toThrow(/Exports cannot be updated/);
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
      await expect(handler(event)).rejects.toThrow(/Some exports have changed/);
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
      await expect(handler(event)).rejects.toThrow(/Exports cannot be updated/);
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
      await handler(event);

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
      await expect(handler(event)).rejects.toThrow(/Exports cannot be updated/);
      expect(mockPutParameter).toHaveBeenCalledTimes(0);
      expect(mocklistTagsForResource).toHaveBeenCalledTimes(1);
      expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    });
  });
});

function makeEvent(req: Partial<AWSLambda.CloudFormationCustomResourceEvent>): AWSLambda.CloudFormationCustomResourceEvent {
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
  } as any;
}
