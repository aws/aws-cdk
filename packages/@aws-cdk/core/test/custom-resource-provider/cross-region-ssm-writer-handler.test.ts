import { handler } from '../../lib/custom-resource-provider/cross-region-ssm-writer-handler';
import { SSM_EXPORT_PATH } from '../../lib/custom-resource-provider/export-writer-provider';

let mockPutParameter: jest.Mock ;
let mockGetParametersByPath: jest.Mock;
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
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  mockPutParameter = jest.fn();
  mockGetParametersByPath = jest.fn();
  mockDeleteParameters = jest.fn();
  mockPutParameter.mockImplementation(() => {
    return {};
  });
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('cross-region-ssm-writer entrypoint', () => {
  test('Create event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        Exports: {
          MyExport: 'Value',
        },
      },
    });

    // WHEN
    await handler(event);

    // THEN
    expect(mockPutParameter).toHaveBeenCalledWith({
      Name: `/${SSM_EXPORT_PATH}MyExport`,
      Value: 'Value',
    });
    expect(mockPutParameter).toHaveBeenCalledTimes(1);
    expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    expect(mockGetParametersByPath).toHaveBeenCalledTimes(0);
  });

  test('Update event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Update',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        Exports: {
          MyExport: 'Value',
        },
      },
    });

    // WHEN
    mockGetParametersByPath.mockImplementation(() => {
      return {
        Parameters: [{
          Name: 'MyExport',
          Value: 'Value',
        }],
      };
    });
    await handler(event);

    // THEN
    expect(mockPutParameter).toHaveBeenCalledWith({
      Name: `/${SSM_EXPORT_PATH}MyExport`,
      Value: 'Value',
    });
    expect(mockPutParameter).toHaveBeenCalledTimes(1);
    expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    expect(mockGetParametersByPath).toHaveBeenCalledTimes(1);
  });

  test('Update event with nexttoken', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Update',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        Exports: {
          MyExport: 'Value',
          MyOtherExport: 'MyOtherValue',
        },
      },
    });

    // WHEN
    mockGetParametersByPath.mockImplementationOnce(() => {
      return {
        NextToken: 'abc',
        Parameters: [{
          Name: 'MyExport',
          Value: 'Value',
        }],
      };
    }).mockImplementation(() => {
      return {
        Parameters: [{
          Name: 'MyOtherExport',
          Value: 'MyOtherValue',
        }],
      };
    });
    await handler(event);

    // THEN
    expect(mockPutParameter).toHaveBeenCalledWith({
      Name: `/${SSM_EXPORT_PATH}MyExport`,
      Value: 'Value',
    });
    expect(mockPutParameter).toHaveBeenCalledTimes(2);
    expect(mockDeleteParameters).toHaveBeenCalledTimes(0);
    expect(mockGetParametersByPath).toHaveBeenCalledTimes(2);
  });

  test('Update event with delete', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Update',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        Exports: {
          MyExport: 'Value',
          MyOtherExport: 'MyOtherValue',
        },
      },
    });

    // WHEN
    mockGetParametersByPath.mockImplementation(() => {
      return {
        Parameters: [{
          Name: 'RemovedExport',
          Value: 'RemovedValue',
        }],
      };
    });
    await handler(event);

    // THEN
    expect(mockPutParameter).toHaveBeenCalledWith({
      Name: `/${SSM_EXPORT_PATH}MyExport`,
      Value: 'Value',
    });
    expect(mockPutParameter).toHaveBeenCalledWith({
      Name: `/${SSM_EXPORT_PATH}MyOtherExport`,
      Value: 'MyOtherValue',
    });
    expect(mockDeleteParameters).toHaveBeenCalledWith({
      Names: ['RemovedExport'],
    });
    expect(mockPutParameter).toHaveBeenCalledTimes(2);
    expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
    expect(mockGetParametersByPath).toHaveBeenCalledTimes(1);
  });
  test('Delete event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
        Exports: {
          MyExport: 'Value',
          MyOtherExport: 'MyOtherValue',
        },
      },
    });

    // WHEN
    mockGetParametersByPath.mockImplementation(() => {
      return {
        Parameters: [{
          Name: 'RemovedExport',
          Value: 'RemovedValue',
        }],
      };
    });
    await handler(event);

    // THEN
    expect(mockDeleteParameters).toHaveBeenCalledWith({
      Names: ['RemovedExport'],
    });
    expect(mockPutParameter).toHaveBeenCalledTimes(0);
    expect(mockDeleteParameters).toHaveBeenCalledTimes(1);
    expect(mockGetParametersByPath).toHaveBeenCalledTimes(1);
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
