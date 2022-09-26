import { handler } from '../../lib/custom-resource-provider/cross-region-ssm-writer-handler';
import { SSM_EXPORT_PATH_PREFIX } from '../../lib/custom-resource-provider/export-writer-provider';

let mockPutParameter: jest.Mock ;
let mockGetParameters: jest.Mock;
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
        deleteParameters: jest.fn((params) => {
          return {
            promise: () => mockDeleteParameters(params),
          };
        }),
        getParameters: jest.fn((params) => {
          return {
            promise: () => mockGetParameters(params),
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
  mockGetParameters = jest.fn();
  mockDeleteParameters = jest.fn();
  mockPutParameter.mockImplementation(() => {
    return {};
  });
  mockGetParameters.mockImplementation(() => {
    return {};
  })
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('cross-region-ssm-writer throws', () => {
  test('create throws if params already exist', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/MyExport': 'Value',
        },
      },
    });

    // WHEN
    mockGetParameters.mockImplementation(() => {
      return {
        Parameters: [{
          Name: '/cdk/exports/MyStack/MyExport',
        }],
      };
    });

    // THEN
    await expect(handler(event)).rejects.toThrow(/Exports already exist/);
  });

  test('update throws if params already exist', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Update',
      OldResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/MyExport': 'Value',
        },
      },
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/MyExport': 'Value',
          '/cdk/exports/MyStack/AlreadyExists': 'Value',
        },
      },
    });

    // WHEN
    mockGetParameters.mockImplementation(() => {
      return {
        Parameters: [{
          Name: '/cdk/exports/MyStack/AlreadyExists',
        }],
      };
    });

    // THEN
    await expect(handler(event)).rejects.toThrow(/Exports already exist/);
  });
})

describe('cross-region-ssm-writer entrypoint', () => {
  test('Create event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/MyExport': 'Value',
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
    expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    expect(mockGetParameters).toHaveBeenCalledTimes(1);
  });

  test('Update event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Update',
      OldResourceProperties: {
        ServiceToken: '<ServiceToken>',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/ExistingExport': 'MyExistingValue',
        },
      },
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/ExistingExport': 'MyExistingValue',
          '/cdk/exports/MyStack/MyExport': 'Value',
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
    expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    expect(mockGetParameters).toHaveBeenCalledTimes(1);
  });

  test('Update event with delete', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Update',
      OldResourceProperties: {
        ServiceToken: '<ServiceToken>',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/RemovedExport': 'MyRemovedValue',
        },
      },
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/MyExport': 'Value',
          '/cdk/exports/MyStack/MyOtherExport': 'MyOtherValue',
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
    expect(mockPutParameter).toHaveBeenCalledWith({
      Name: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyOtherExport`,
      Value: 'MyOtherValue',
      Type: 'String',
    });
    expect(mockDeleteParameters).toHaveBeenCalledWith({
      Names: ['/cdk/exports/MyStack/RemovedExport'],
    });
    expect(mockPutParameter).toHaveBeenCalledTimes(2);
    expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
    expect(mockGetParameters).toHaveBeenCalledTimes(1);
  });
  test('Delete event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        StackName: 'MyStack',
        Exports: {
          '/cdk/exports/MyStack/RemovedExport': 'RemovedValue',
        },
      },
    });

    // WHEN
    await handler(event);

    // THEN
    expect(mockDeleteParameters).toHaveBeenCalledWith({
      Names: ['/cdk/exports/MyStack/RemovedExport'],
    });
    expect(mockPutParameter).toHaveBeenCalledTimes(0);
    expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
    expect(mockGetParameters).toHaveBeenCalledTimes(0);
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
