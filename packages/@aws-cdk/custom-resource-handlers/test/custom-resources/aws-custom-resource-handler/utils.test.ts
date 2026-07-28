import * as https from 'https';
import type { AwsSdkCall } from '../../../lib/custom-resources/aws-custom-resource-handler/construct-types';
import { external, getCredentials, respond, withRetries } from '../../../lib/custom-resources/aws-custom-resource-handler/utils';

jest.mock('https');

// Mock the @aws-sdk/credential-providers import
const mockFromTemporaryCredentials = jest.fn();
jest.doMock('@aws-sdk/credential-providers', () => ({
  fromTemporaryCredentials: mockFromTemporaryCredentials,
}));

describe('getCredentials with External ID support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('includes ExternalId when provided', async () => {
    // GIVEN
    const call: AwsSdkCall = {
      service: 'STS',
      action: 'GetCallerIdentity',
      assumedRoleArn: 'arn:aws:iam::123456789012:role/TestRole',
      externalId: 'test-external-id-123',
    };

    const physicalResourceId = 'test-resource-id';
    const mockCredentials = { mock: 'credentials' };
    mockFromTemporaryCredentials.mockResolvedValue(mockCredentials);

    // WHEN
    const result = await getCredentials(call, physicalResourceId);

    // THEN
    expect(mockFromTemporaryCredentials).toHaveBeenCalledWith({
      params: {
        RoleArn: 'arn:aws:iam::123456789012:role/TestRole',
        RoleSessionName: expect.stringMatching(/^\d+-test-resource-id$/),
        ExternalId: 'test-external-id-123',
      },
      clientConfig: undefined,
    });
    expect(result).toBe(mockCredentials);
  });

  test('excludes ExternalId when not provided', async () => {
    // GIVEN
    const call: AwsSdkCall = {
      service: 'STS',
      action: 'GetCallerIdentity',
      assumedRoleArn: 'arn:aws:iam::123456789012:role/TestRole',
      // No externalId
    };

    const physicalResourceId = 'test-resource-id';
    const mockCredentials = { mock: 'credentials' };
    mockFromTemporaryCredentials.mockResolvedValue(mockCredentials);

    // WHEN
    const result = await getCredentials(call, physicalResourceId);

    // THEN
    expect(mockFromTemporaryCredentials).toHaveBeenCalledWith({
      params: {
        RoleArn: 'arn:aws:iam::123456789012:role/TestRole',
        RoleSessionName: expect.stringMatching(/^\d+-test-resource-id$/),
        // Should NOT include ExternalId
      },
      clientConfig: undefined,
    });
    expect(result).toBe(mockCredentials);
  });

  test('works with region configuration and external ID', async () => {
    // GIVEN
    const call: AwsSdkCall = {
      service: 'STS',
      action: 'GetCallerIdentity',
      assumedRoleArn: 'arn:aws:iam::123456789012:role/TestRole',
      externalId: 'test-external-id-123',
      region: 'us-west-2',
    };

    const physicalResourceId = 'test-resource-id';
    const mockCredentials = { mock: 'credentials' };
    mockFromTemporaryCredentials.mockResolvedValue(mockCredentials);

    // WHEN
    const result = await getCredentials(call, physicalResourceId);

    // THEN
    expect(mockFromTemporaryCredentials).toHaveBeenCalledWith({
      params: {
        RoleArn: 'arn:aws:iam::123456789012:role/TestRole',
        RoleSessionName: expect.stringMatching(/^\d+-test-resource-id$/),
        ExternalId: 'test-external-id-123',
      },
      clientConfig: { region: 'us-west-2' },
    });
    expect(result).toBe(mockCredentials);
  });

  test('returns undefined when no assumedRoleArn', async () => {
    // GIVEN
    const call: AwsSdkCall = {
      service: 'STS',
      action: 'GetCallerIdentity',
      // No externalId provided when assumedRoleArn is not specified
    };

    const physicalResourceId = 'test-resource-id';

    // WHEN
    const result = await getCredentials(call, physicalResourceId);

    // THEN
    expect(result).toBeUndefined();
  });

  test('throws error when externalId provided without assumedRoleArn', async () => {
    // GIVEN
    const call: AwsSdkCall = {
      service: 'STS',
      action: 'GetCallerIdentity',
      externalId: 'test-external-id-123', // Should cause error
    };

    const physicalResourceId = 'test-resource-id';

    // WHEN & THEN
    await expect(getCredentials(call, physicalResourceId)).rejects.toThrow('ExternalId can only be provided when assumedRoleArn is specified');
  });

  test('sanitizes role session name correctly', async () => {
    // GIVEN
    const call: AwsSdkCall = {
      service: 'STS',
      action: 'GetCallerIdentity',
      assumedRoleArn: 'arn:aws:iam::123456789012:role/TestRole',
      externalId: 'test-external-id-123',
    };

    // Physical resource ID with special characters that should be sanitized
    const physicalResourceId = 'test-resource@#$%^&*()id';
    const mockCredentials = { mock: 'credentials' };
    mockFromTemporaryCredentials.mockResolvedValue(mockCredentials);

    // WHEN
    const result = await getCredentials(call, physicalResourceId);

    // THEN
    expect(mockFromTemporaryCredentials).toHaveBeenCalledWith({
      params: {
        RoleArn: 'arn:aws:iam::123456789012:role/TestRole',
        RoleSessionName: expect.stringMatching(/^\d+-test-resource@id$/),
        ExternalId: 'test-external-id-123',
      },
      clientConfig: undefined,
    });
    expect(result).toBe(mockCredentials);
  });

  test('truncates long role session name to 64 characters', async () => {
    // GIVEN
    const call: AwsSdkCall = {
      service: 'STS',
      action: 'GetCallerIdentity',
      assumedRoleArn: 'arn:aws:iam::123456789012:role/TestRole',
      externalId: 'test-external-id-123',
    };

    // Very long physical resource ID
    const physicalResourceId = 'very-long-resource-id-that-exceeds-the-maximum-length-allowed-for-role-session-names';
    const mockCredentials = { mock: 'credentials' };
    mockFromTemporaryCredentials.mockResolvedValue(mockCredentials);

    // WHEN
    const result = await getCredentials(call, physicalResourceId);

    // THEN
    const callArgs = mockFromTemporaryCredentials.mock.calls[0][0];
    const roleSessionName = callArgs.params.RoleSessionName;

    expect(roleSessionName.length).toBeLessThanOrEqual(64);
    expect(roleSessionName).toMatch(/^\d+-very-long-resource-id-that-exceeds-the-maximum-len$/);
    expect(callArgs.params.ExternalId).toBe('test-external-id-123');
    expect(result).toBe(mockCredentials);
  });
});

// Captured at load time before any test overrides it.
const defaultSendHttpRequest = external.sendHttpRequest;

function makeEvent(): AWSLambda.CloudFormationCustomResourceEvent {
  return {
    ResponseURL: 'https://cfn.example.com/response?token=abc',
    StackId: '<StackId>',
    RequestId: '<RequestId>',
    LogicalResourceId: '<LogicalResourceId>',
    ResourceType: '<ResourceType>',
    ServiceToken: '<ServiceToken>',
    ResourceProperties: { ServiceToken: '<ServiceToken>' },
    RequestType: 'Create',
  } as any;
}

describe('withRetries', () => {
  beforeEach(() => {
    // make backoff sleeps instantaneous and deterministic
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns the result without retrying when the function succeeds', async () => {
    const fn = jest.fn().mockResolvedValue('ok');

    const result = await withRetries({ attempts: 5, sleep: 1 }, fn)();

    expect(result).toEqual('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('retries and eventually succeeds', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('transient'))
      .mockRejectedValueOnce(new Error('transient'))
      .mockResolvedValue('ok');

    const result = await withRetries({ attempts: 5, sleep: 1 }, fn)();

    expect(result).toEqual('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('throws the last error after exhausting all attempts', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));

    // attempts: 3 => 1 initial call + 3 retries = 4 invocations
    await expect(withRetries({ attempts: 3, sleep: 1 }, fn)()).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(4);
  });
});

describe('respond', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    external.sendHttpRequest = defaultSendHttpRequest;
    jest.restoreAllMocks();
  });

  test('PUTs the response to the CloudFormation response URL exactly once on success', async () => {
    // GIVEN
    const send = jest.fn().mockResolvedValue(undefined);
    external.sendHttpRequest = send;

    // WHEN
    await respond(makeEvent(), 'SUCCESS', 'reason', 'physical-id', { Foo: 'Bar' }, true);

    // THEN
    expect(send).toHaveBeenCalledTimes(1);
    const [options, body] = send.mock.calls[0];
    expect(options.method).toEqual('PUT');
    expect(options.hostname).toEqual('cfn.example.com');
    expect(options.path).toEqual('/response?token=abc');
    const parsedBody = JSON.parse(body);
    expect(parsedBody.Status).toEqual('SUCCESS');
    expect(parsedBody.PhysicalResourceId).toEqual('physical-id');
    expect(parsedBody.Data).toEqual({ Foo: 'Bar' });
  });

  test('retries a transient failure and then succeeds', async () => {
    // GIVEN
    const send = jest.fn()
      .mockRejectedValueOnce(new Error('socket hang up'))
      .mockResolvedValue(undefined);
    external.sendHttpRequest = send;

    // WHEN
    await respond(makeEvent(), 'SUCCESS', 'reason', 'physical-id', {}, false);

    // THEN
    expect(send).toHaveBeenCalledTimes(2);
  });

  test('rejects after exhausting retries', async () => {
    // GIVEN
    const send = jest.fn().mockRejectedValue(new Error('Unsuccessful HTTP response: 500'));
    external.sendHttpRequest = send;

    // WHEN / THEN
    // RESPONSE_RETRY_OPTIONS.attempts is 5 => 1 initial call + 5 retries = 6 invocations
    await expect(respond(makeEvent(), 'SUCCESS', 'reason', 'physical-id', {}, false))
      .rejects.toThrow('Unsuccessful HTTP response: 500');
    expect(send).toHaveBeenCalledTimes(6);
  });

  describe('HTTP status-code handling (default sender)', () => {
    beforeEach(() => {
      external.sendHttpRequest = defaultSendHttpRequest;
      (https.request as jest.Mock).mockReset();
    });

    test('resolves on a 2xx response', async () => {
      // GIVEN
      (https.request as jest.Mock).mockImplementation((_options: any, cb: any) => {
        cb({ statusCode: 200, resume: jest.fn() });
        return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
      });

      // WHEN / THEN
      await expect(respond(makeEvent(), 'SUCCESS', 'reason', 'physical-id', {}, false)).resolves.toBeUndefined();
      expect(https.request).toHaveBeenCalledTimes(1);
    });

    test('treats a >= 400 response as a failure and retries, then throws', async () => {
      // GIVEN
      (https.request as jest.Mock).mockImplementation((_options: any, cb: any) => {
        cb({ statusCode: 500, resume: jest.fn() });
        return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
      });

      // WHEN / THEN
      await expect(respond(makeEvent(), 'SUCCESS', 'reason', 'physical-id', {}, false))
        .rejects.toThrow('Unsuccessful HTTP response: 500');
      expect(https.request).toHaveBeenCalledTimes(6);
    });
  });
});
