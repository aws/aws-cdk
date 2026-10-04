import type { AwsSdkCall } from '../../../lib/custom-resources/aws-custom-resource-handler/construct-types';
import { getCredentials } from '../../../lib/custom-resources/aws-custom-resource-handler/utils';

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
