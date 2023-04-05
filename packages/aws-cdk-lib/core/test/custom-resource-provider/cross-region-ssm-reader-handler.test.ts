import { handler } from '../../lib/custom-resource-provider/cross-region-export-providers/cross-region-ssm-reader-handler';
import { SSM_EXPORT_PATH_PREFIX } from '../../lib/custom-resource-provider/cross-region-export-providers/types';

let mockDeleteParameters: jest.Mock ;
let mockAddTagsToResource: jest.Mock;
let mockGetParametersByPath: jest.Mock;
let mockRemoveTagsFromResource: jest.Mock;
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
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
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
    await handler(event);

    // THEN
    expect(mockAddTagsToResource).toHaveBeenCalledWith({
      ResourceId: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
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
    await handler(event);

    // THEN
    expect(mockAddTagsToResource).toHaveBeenCalledWith({
      ResourceId: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
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
    await handler(event);

    // THEN
    expect(mockAddTagsToResource).toHaveBeenCalledWith({
      ResourceId: `/${SSM_EXPORT_PATH_PREFIX}MyStack/MyExport`,
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
    await handler(event);

    // THEN
    expect(mockRemoveTagsFromResource).toHaveBeenCalledTimes(1);
    expect(mockRemoveTagsFromResource).toHaveBeenCalledWith({
      ResourceType: 'Parameter',
      ResourceId: '/cdk/exports/MyStack/RemovedExport',
      TagKeys: ['aws-cdk:strong-ref:MyStack'],
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
