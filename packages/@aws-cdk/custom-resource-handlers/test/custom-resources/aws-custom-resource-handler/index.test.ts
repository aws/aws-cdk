import * as nock from 'nock';

// Mock the ApiCall class from the SDK adapter
const mockInvoke = jest.fn();
jest.mock('@aws-cdk/aws-custom-resource-sdk-adapter', () => ({
  ApiCall: jest.fn().mockImplementation(() => ({
    v3PackageName: '@aws-sdk/client-lambda',
    invoke: mockInvoke,
    client: {
      config: {
        apiVersion: '2015-03-31',
        region: jest.fn().mockResolvedValue('us-east-1'),
      },
    },
  })),
}));

// Mock the load-sdk module
jest.mock('../../../lib/custom-resources/aws-custom-resource-handler/load-sdk', () => ({
  loadAwsSdk: jest.fn().mockResolvedValue({}),
}));

// Import handler and utils after mocks are set up
import { handler } from '../../../lib/custom-resources/aws-custom-resource-handler/index';
import { disableSleepForTesting } from '../../../lib/custom-resources/aws-custom-resource-handler/utils';

// Disable sleep for all tests to speed them up
disableSleepForTesting();

const eventCommon = {
  ServiceToken: 'token',
  ResponseURL: 'https://localhost',
  StackId: 'stackId',
  RequestId: 'requestId',
  LogicalResourceId: 'logicalResourceId',
  PhysicalResourceId: 'physicalResourceId',
  ResourceType: 'Custom::AWS',
} as const;

const context = {
  functionName: 'aws-custom-resource-handler',
  logStreamName: 'test-log-stream',
} as AWSLambda.Context;

function createRequest(type: string) {
  return nock('https://localhost')
    .put('/', (body: AWSLambda.CloudFormationCustomResourceResponse) => (
      body.Status === type
    ))
    .reply(200);
}

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('aws-custom-resource-handler retry behavior', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    nock.cleanAll();
  });

  test('succeeds on first attempt without retry', async () => {
    // GIVEN
    mockInvoke.mockResolvedValue({ result: 'success' });

    const event = {
      ...eventCommon,
      RequestType: 'Create' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Create: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
    };

    const request = createRequest('SUCCESS');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(request.isDone()).toBe(true);
  });

  test('retries on Lambda initialization error and succeeds', async () => {
    // GIVEN
    const lambdaInitError = {
      name: 'ServiceException',
      message: 'Lambda is initializing your function. It will be ready to invoke shortly.',
    };
    mockInvoke
      .mockRejectedValueOnce(lambdaInitError)
      .mockRejectedValueOnce(lambdaInitError)
      .mockResolvedValue({ result: 'success' });

    const event = {
      ...eventCommon,
      RequestType: 'Create' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Create: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
    };

    const request = createRequest('SUCCESS');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(3);
    expect(request.isDone()).toBe(true);
  });

  test('retries on ResourceNotReadyException and succeeds', async () => {
    // GIVEN
    const resourceNotReadyError = {
      name: 'ResourceNotReadyException',
      message: 'Resource not ready',
    };
    mockInvoke
      .mockRejectedValueOnce(resourceNotReadyError)
      .mockResolvedValue({ result: 'success' });

    const event = {
      ...eventCommon,
      RequestType: 'Create' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Create: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
    };

    const request = createRequest('SUCCESS');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(2);
    expect(request.isDone()).toBe(true);
  });

  test('fails after max retries exceeded', async () => {
    // GIVEN
    const lambdaInitError = {
      name: 'ServiceException',
      message: 'Lambda is initializing your function',
    };
    mockInvoke.mockRejectedValue(lambdaInitError);

    const event = {
      ...eventCommon,
      RequestType: 'Create' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Create: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
    };

    const request = createRequest('FAILED');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(6); // 1 initial + 5 retries
    expect(request.isDone()).toBe(true);
  });

  test('does not retry on non-retryable errors', async () => {
    // GIVEN
    const accessDeniedError = {
      name: 'AccessDeniedException',
      message: 'Access denied',
    };
    mockInvoke.mockRejectedValue(accessDeniedError);

    const event = {
      ...eventCommon,
      RequestType: 'Create' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Create: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
    };

    const request = createRequest('FAILED');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(1); // No retries
    expect(request.isDone()).toBe(true);
  });

  test('ignoreErrorCodesMatching still works correctly', async () => {
    // GIVEN
    const resourceNotFoundError = {
      name: 'ResourceNotFoundException',
      message: 'Resource not found',
    };
    mockInvoke.mockRejectedValue(resourceNotFoundError);

    const event = {
      ...eventCommon,
      RequestType: 'Create' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Create: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
          ignoreErrorCodesMatching: 'ResourceNotFoundException',
        }),
      },
    };

    const request = createRequest('SUCCESS');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(request.isDone()).toBe(true);
  });

  test('Update request type works with retry', async () => {
    // GIVEN
    const lambdaInitError = {
      name: 'ServiceException',
      message: 'Lambda is initializing your function',
    };
    mockInvoke
      .mockRejectedValueOnce(lambdaInitError)
      .mockResolvedValue({ result: 'success' });

    const event = {
      ...eventCommon,
      RequestType: 'Update' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Update: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
      OldResourceProperties: {
        ServiceToken: 'token',
      },
    };

    const request = createRequest('SUCCESS');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(2);
    expect(request.isDone()).toBe(true);
  });

  test('Delete request type works with retry', async () => {
    // GIVEN
    const lambdaInitError = {
      name: 'ServiceException',
      message: 'Lambda is initializing your function',
    };
    mockInvoke
      .mockRejectedValueOnce(lambdaInitError)
      .mockResolvedValue({ result: 'success' });

    const event = {
      ...eventCommon,
      RequestType: 'Delete' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Delete: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
    };

    const request = createRequest('SUCCESS');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(2);
    expect(request.isDone()).toBe(true);
  });

  test('handles case-insensitive Lambda initialization message', async () => {
    // GIVEN
    const lambdaInitError = {
      name: 'ServiceException',
      message: 'LAMBDA IS INITIALIZING your function',
    };
    mockInvoke
      .mockRejectedValueOnce(lambdaInitError)
      .mockResolvedValue({ result: 'success' });

    const event = {
      ...eventCommon,
      RequestType: 'Create' as const,
      ResourceProperties: {
        ServiceToken: 'token',
        Create: JSON.stringify({
          service: 'Lambda',
          action: 'invoke',
          parameters: { FunctionName: 'test-function' },
          physicalResourceId: { id: 'test-resource' },
        }),
      },
    };

    const request = createRequest('SUCCESS');

    // WHEN
    await handler(event, context);

    // THEN
    expect(mockInvoke).toHaveBeenCalledTimes(2);
    expect(request.isDone()).toBe(true);
  });
});
