import { determineEcrEndpointType, formatEcrEndpoint, EcrEndpointType } from '../../lib/private/ecr-endpoint-utils';

describe('ECR Endpoint Utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clean environment before each test
    delete process.env.AWS_USE_DUALSTACK_ENDPOINT;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('determineEcrEndpointType', () => {
    test('returns IPV4_ONLY by default when no environment variable is set', () => {
      expect(determineEcrEndpointType()).toBe(EcrEndpointType.IPV4_ONLY);
    });

    test('returns DUAL_STACK when AWS_USE_DUALSTACK_ENDPOINT is "true"', () => {
      process.env.AWS_USE_DUALSTACK_ENDPOINT = 'true';
      expect(determineEcrEndpointType()).toBe(EcrEndpointType.DUAL_STACK);
    });

    test('returns DUAL_STACK when AWS_USE_DUALSTACK_ENDPOINT is "1"', () => {
      process.env.AWS_USE_DUALSTACK_ENDPOINT = '1';
      expect(determineEcrEndpointType()).toBe(EcrEndpointType.DUAL_STACK);
    });

    test('returns IPV4_ONLY when AWS_USE_DUALSTACK_ENDPOINT is "false"', () => {
      process.env.AWS_USE_DUALSTACK_ENDPOINT = 'false';
      expect(determineEcrEndpointType()).toBe(EcrEndpointType.IPV4_ONLY);
    });

    test('returns IPV4_ONLY when AWS_USE_DUALSTACK_ENDPOINT is "0"', () => {
      process.env.AWS_USE_DUALSTACK_ENDPOINT = '0';
      expect(determineEcrEndpointType()).toBe(EcrEndpointType.IPV4_ONLY);
    });

    test('returns IPV4_ONLY when AWS_USE_DUALSTACK_ENDPOINT is invalid value', () => {
      process.env.AWS_USE_DUALSTACK_ENDPOINT = 'invalid';
      expect(determineEcrEndpointType()).toBe(EcrEndpointType.IPV4_ONLY);
    });

    test('returns IPV4_ONLY when AWS_USE_DUALSTACK_ENDPOINT is empty string', () => {
      process.env.AWS_USE_DUALSTACK_ENDPOINT = '';
      expect(determineEcrEndpointType()).toBe(EcrEndpointType.IPV4_ONLY);
    });
  });

  describe('formatEcrEndpoint', () => {
    const account = '123456789012';
    const region = 'us-east-1';
    const urlSuffix = 'amazonaws.com';

    test('formats IPv4-only endpoint correctly', () => {
      const result = formatEcrEndpoint(account, region, urlSuffix, EcrEndpointType.IPV4_ONLY);
      expect(result).toBe('123456789012.dkr.ecr.us-east-1.amazonaws.com');
    });

    test('formats dual-stack endpoint correctly', () => {
      const result = formatEcrEndpoint(account, region, urlSuffix, EcrEndpointType.DUAL_STACK);
      expect(result).toBe('123456789012.dkr-ecr.us-east-1.on.aws');
    });

    test('handles different regions correctly for IPv4', () => {
      const result = formatEcrEndpoint(account, 'eu-west-1', urlSuffix, EcrEndpointType.IPV4_ONLY);
      expect(result).toBe('123456789012.dkr.ecr.eu-west-1.amazonaws.com');
    });

    test('handles different regions correctly for dual-stack', () => {
      const result = formatEcrEndpoint(account, 'eu-west-1', urlSuffix, EcrEndpointType.DUAL_STACK);
      expect(result).toBe('123456789012.dkr-ecr.eu-west-1.on.aws');
    });

    test('handles different URL suffixes for IPv4', () => {
      const result = formatEcrEndpoint(account, region, 'amazonaws.com.cn', EcrEndpointType.IPV4_ONLY);
      expect(result).toBe('123456789012.dkr.ecr.us-east-1.amazonaws.com.cn');
    });

    test('ignores URL suffix for dual-stack endpoints', () => {
      const result = formatEcrEndpoint(account, region, 'amazonaws.com.cn', EcrEndpointType.DUAL_STACK);
      expect(result).toBe('123456789012.dkr-ecr.us-east-1.on.aws');
    });
  });

  describe('integration tests', () => {
    test('determineEcrEndpointType and formatEcrEndpoint work together for default case', () => {
      const endpointType = determineEcrEndpointType();
      const result = formatEcrEndpoint('123456789012', 'us-east-1', 'amazonaws.com', endpointType);
      expect(result).toBe('123456789012.dkr.ecr.us-east-1.amazonaws.com');
    });

    test('determineEcrEndpointType and formatEcrEndpoint work together for dual-stack case', () => {
      process.env.AWS_USE_DUALSTACK_ENDPOINT = 'true';
      const endpointType = determineEcrEndpointType();
      const result = formatEcrEndpoint('123456789012', 'us-east-1', 'amazonaws.com', endpointType);
      expect(result).toBe('123456789012.dkr-ecr.us-east-1.on.aws');
    });
  });
});