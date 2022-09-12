import { handler } from '../../lib/custom-resource-provider/get-cfn-exports-handler';

const mockListExports = jest.fn();
jest.mock('aws-sdk', () => {
  return {
    CloudFormation: jest.fn(() => {
      return {
        listExports: jest.fn(() => {
          return {
            promise: () => mockListExports(),
          };
        }),
      };
    }),
  };
});

describe('get-cfn-exports entrypoint', () => {
  beforeEach(() => {
    mockListExports.mockReset();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('Create event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
      },
    });
    mockListExports.mockImplementation(() => {
      return {
        Exports: [{
          Name: 'ExportName',
          Value: 'ExportValue',
        }],
      };
    });

    // WHEN
    const response = await handler(event);

    // THEN
    expect(mockListExports).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      Data: {
        ExportName: 'ExportValue',
      },
    });
  });

  test('Update event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Update',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
      },
    });
    mockListExports.mockImplementation(() => {
      return {
        Exports: [{
          Name: 'ExportName',
          Value: 'ExportValue',
        }],
      };
    });

    // WHEN
    const response = await handler(event);

    // THEN
    expect(mockListExports).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      Data: {
        ExportName: 'ExportValue',
      },
    });
  });

  test('Delete event', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
      },
    });
    mockListExports.mockImplementation(() => {
      return {
        Exports: [{
          Name: 'ExportName',
          Value: 'ExportValue',
        }],
      };
    });

    // WHEN
    const response = await handler(event);

    // THEN
    expect(mockListExports).toHaveBeenCalledTimes(0);
    expect(response).toBeUndefined;
  });

  test('no exports', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: '<ServiceToken>',
        Region: 'us-east-1',
      },
    });
    mockListExports.mockImplementationOnce(() => {
      return {
        Exports: [],
      };
    });

    // WHEN
    const response = await handler(event);

    // THEN
    expect(mockListExports).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      Data: {},
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
