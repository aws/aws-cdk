import type { AwsSdkCall } from '../../../lib/custom-resources/aws-custom-resource-handler/construct-types';
import {
  getCredentials,
  isRetryableError,
  calculateDelay,
  makeWithRetry,
  disableSleepForTesting,
} from '../../../lib/custom-resources/aws-custom-resource-handler/utils';

// Disable sleep for all tests to speed them up
disableSleepForTesting();

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

describe('isRetryableError', () => {
  test('returns true for ResourceNotReadyException error name', () => {
    // GIVEN
    const error = { name: 'ResourceNotReadyException', message: 'Some error' };

    // WHEN
    const result = isRetryableError(error);

    // THEN
    expect(result).toBe(true);
  });

  test('returns true for "Lambda is initializing" message (case-insensitive)', () => {
    // GIVEN
    const error1 = { name: 'ServiceException', message: 'Lambda is initializing your function. It will be ready to invoke shortly.' };
    const error2 = { name: 'ServiceException', message: 'LAMBDA IS INITIALIZING your function' };
    const error3 = { name: 'ServiceException', message: 'lambda is initializing' };

    // WHEN & THEN
    expect(isRetryableError(error1)).toBe(true);
    expect(isRetryableError(error2)).toBe(true);
    expect(isRetryableError(error3)).toBe(true);
  });

  test('returns false for non-retryable errors', () => {
    // GIVEN
    const accessDenied = { name: 'AccessDeniedException', message: 'Access denied' };
    const notFound = { name: 'ResourceNotFoundException', message: 'Resource not found' };
    const invalidParam = { name: 'InvalidParameterException', message: 'Invalid parameter' };
    const genericError = { name: 'Error', message: 'Something went wrong' };

    // WHEN & THEN
    expect(isRetryableError(accessDenied)).toBe(false);
    expect(isRetryableError(notFound)).toBe(false);
    expect(isRetryableError(invalidParam)).toBe(false);
    expect(isRetryableError(genericError)).toBe(false);
  });

  test('returns false for null or undefined errors', () => {
    // WHEN & THEN
    expect(isRetryableError(null)).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });

  test('returns false for errors without message', () => {
    // GIVEN
    const error = { name: 'SomeError' };

    // WHEN
    const result = isRetryableError(error);

    // THEN
    expect(result).toBe(false);
  });
});

describe('calculateDelay', () => {
  test('returns delay within expected range for first attempt', () => {
    // GIVEN
    const attempt = 1;
    const base = 1000;
    const cap = 30000;

    // WHEN - run multiple times to account for randomness
    const delays = Array.from({ length: 100 }, () => calculateDelay(attempt, base, cap));

    // THEN - delay should be between 0 and base * 2^1 = 2000
    delays.forEach(delay => {
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThanOrEqual(2000);
    });
  });

  test('returns delay within expected range for later attempts', () => {
    // GIVEN
    const attempt = 3;
    const base = 1000;
    const cap = 30000;

    // WHEN - run multiple times to account for randomness
    const delays = Array.from({ length: 100 }, () => calculateDelay(attempt, base, cap));

    // THEN - delay should be between 0 and base * 2^3 = 8000
    delays.forEach(delay => {
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThanOrEqual(8000);
    });
  });

  test('respects the cap for high attempt numbers', () => {
    // GIVEN
    const attempt = 10; // 2^10 * 1000 = 1,024,000 which exceeds cap
    const base = 1000;
    const cap = 30000;

    // WHEN - run multiple times to account for randomness
    const delays = Array.from({ length: 100 }, () => calculateDelay(attempt, base, cap));

    // THEN - delay should never exceed cap
    delays.forEach(delay => {
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThanOrEqual(cap);
    });
  });
});

describe('makeWithRetry', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns result on first successful attempt', async () => {
    // GIVEN
    const mockFn = jest.fn().mockResolvedValue('success');
    const withRetry = makeWithRetry();

    // WHEN
    const result = await withRetry(mockFn);

    // THEN
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('retries on Lambda initialization error and succeeds', async () => {
    // GIVEN
    const lambdaInitError = { name: 'ServiceException', message: 'Lambda is initializing your function. It will be ready to invoke shortly.' };
    const mockFn = jest.fn()
      .mockRejectedValueOnce(lambdaInitError)
      .mockRejectedValueOnce(lambdaInitError)
      .mockResolvedValue('success');
    const withRetry = makeWithRetry();

    // WHEN
    const result = await withRetry(mockFn);

    // THEN
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('retries on ResourceNotReadyException and succeeds', async () => {
    // GIVEN
    const resourceNotReadyError = { name: 'ResourceNotReadyException', message: 'Resource not ready' };
    const mockFn = jest.fn()
      .mockRejectedValueOnce(resourceNotReadyError)
      .mockResolvedValue('success');
    const withRetry = makeWithRetry();

    // WHEN
    const result = await withRetry(mockFn);

    // THEN
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('throws after max retries exceeded', async () => {
    // GIVEN
    const lambdaInitError = { name: 'ServiceException', message: 'Lambda is initializing your function' };
    const mockFn = jest.fn().mockRejectedValue(lambdaInitError);
    const withRetry = makeWithRetry(3); // Only 3 retries

    // WHEN & THEN
    await expect(withRetry(mockFn)).rejects.toThrow('Lambda initialization failed after 3 retries');
    expect(mockFn).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });

  test('does not retry on non-retryable errors', async () => {
    // GIVEN
    const accessDeniedError = { name: 'AccessDeniedException', message: 'Access denied' };
    const mockFn = jest.fn().mockRejectedValue(accessDeniedError);
    const withRetry = makeWithRetry();

    // WHEN & THEN
    await expect(withRetry(mockFn)).rejects.toEqual(accessDeniedError);
    expect(mockFn).toHaveBeenCalledTimes(1); // No retries
  });

  test('does not retry on generic errors', async () => {
    // GIVEN
    const genericError = new Error('Something went wrong');
    const mockFn = jest.fn().mockRejectedValue(genericError);
    const withRetry = makeWithRetry();

    // WHEN & THEN
    await expect(withRetry(mockFn)).rejects.toThrow('Something went wrong');
    expect(mockFn).toHaveBeenCalledTimes(1); // No retries
  });

  test('respects custom maxRetries parameter', async () => {
    // GIVEN
    const lambdaInitError = { name: 'ServiceException', message: 'Lambda is initializing' };
    const mockFn = jest.fn().mockRejectedValue(lambdaInitError);
    const withRetry = makeWithRetry(2); // Only 2 retries

    // WHEN & THEN
    await expect(withRetry(mockFn)).rejects.toThrow('Lambda initialization failed after 2 retries');
    expect(mockFn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  test('logs retry attempts', async () => {
    // GIVEN
    const consoleSpy = jest.spyOn(console, 'log');
    const lambdaInitError = { name: 'ServiceException', message: 'Lambda is initializing' };
    const mockFn = jest.fn()
      .mockRejectedValueOnce(lambdaInitError)
      .mockResolvedValue('success');
    const withRetry = makeWithRetry();

    // WHEN
    await withRetry(mockFn);

    // THEN
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Lambda initialization error detected, retrying'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('attempt 1/5'));
  });

  test('handles mixed error types - retries only retryable ones', async () => {
    // GIVEN
    const lambdaInitError = { name: 'ServiceException', message: 'Lambda is initializing' };
    const accessDeniedError = { name: 'AccessDeniedException', message: 'Access denied' };
    const mockFn = jest.fn()
      .mockRejectedValueOnce(lambdaInitError) // Should retry
      .mockRejectedValueOnce(accessDeniedError); // Should NOT retry
    const withRetry = makeWithRetry();

    // WHEN & THEN
    await expect(withRetry(mockFn)).rejects.toEqual(accessDeniedError);
    expect(mockFn).toHaveBeenCalledTimes(2); // 1 initial + 1 retry, then fail on non-retryable
  });
});
