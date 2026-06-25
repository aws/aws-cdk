
import { handler } from '../../lib/core/cross-region-ssm-writer-handler/index';
import { SSM_EXPORT_PATH_PREFIX } from '../../lib/core/types';

let mockPutParameter: jest.Mock = jest.fn() ;
let mockDeleteParameters: jest.Mock = jest.fn();
jest.mock('@aws-sdk/client-ssm', () => {
  return {
    SSM: jest.fn(() => {
      return {
        putParameter: mockPutParameter,
        deleteParameters: mockDeleteParameters,
      };
    }),
  };
});
beforeEach(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  mockDeleteParameters.mockImplementation(() => {
    return {};
  });
  mockPutParameter.mockImplementation(() => {
    return {};
  });
});
afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
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
        Overwrite: true,
      });
      expect(mockPutParameter).toHaveBeenCalledTimes(1);
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
        Overwrite: true,
      });
      expect(mockPutParameter).toHaveBeenCalledTimes(1);
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
        Overwrite: true,
      });
      expect(mockPutParameter).toHaveBeenCalledTimes(1);
      expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
      expect(mockDeleteParameters).toHaveBeenCalledWith({
        Names: ['/cdk/exports/MyStack/RemovedExport'],
      });
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
      expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
      expect(mockDeleteParameters).toHaveBeenCalledWith({
        Names: ['/cdk/exports/MyStack/RemovedExport'],
      });
    });

    test('more than 10 parameters are deleted', async () => {
      // GIVEN
      const event = makeEvent({
        RequestType: 'Delete',
        ResourceProperties: {
          ServiceToken: '<ServiceToken>',
          WriterProps: {
            region: 'us-east-1',
            exports: {
              '/cdk/exports/MyStack/RemovedExport01': 'RemovedValue01',
              '/cdk/exports/MyStack/RemovedExport02': 'RemovedValue02',
              '/cdk/exports/MyStack/RemovedExport03': 'RemovedValue03',
              '/cdk/exports/MyStack/RemovedExport04': 'RemovedValue04',
              '/cdk/exports/MyStack/RemovedExport05': 'RemovedValue05',
              '/cdk/exports/MyStack/RemovedExport06': 'RemovedValue06',
              '/cdk/exports/MyStack/RemovedExport07': 'RemovedValue07',
              '/cdk/exports/MyStack/RemovedExport08': 'RemovedValue08',
              '/cdk/exports/MyStack/RemovedExport09': 'RemovedValue09',
              '/cdk/exports/MyStack/RemovedExport10': 'RemovedValue10',
              '/cdk/exports/MyStack/RemovedExport11': 'RemovedValue11',
              '/cdk/exports/MyStack/RemovedExport12': 'RemovedValue12',
            },
          },
        },
      });

      // WHEN
      await handler(event);

      // THEN
      expect(mockPutParameter).toHaveBeenCalledTimes(0);
      expect(mockDeleteParameters).toHaveBeenCalledTimes(2);
      expect(mockDeleteParameters).toHaveBeenCalledWith({
        Names: [
          '/cdk/exports/MyStack/RemovedExport01',
          '/cdk/exports/MyStack/RemovedExport02',
          '/cdk/exports/MyStack/RemovedExport03',
          '/cdk/exports/MyStack/RemovedExport04',
          '/cdk/exports/MyStack/RemovedExport05',
          '/cdk/exports/MyStack/RemovedExport06',
          '/cdk/exports/MyStack/RemovedExport07',
          '/cdk/exports/MyStack/RemovedExport08',
          '/cdk/exports/MyStack/RemovedExport09',
          '/cdk/exports/MyStack/RemovedExport10',
        ],
      });
      expect(mockDeleteParameters).toHaveBeenCalledWith({
        Names: [
          '/cdk/exports/MyStack/RemovedExport11',
          '/cdk/exports/MyStack/RemovedExport12',
        ],
      });
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
