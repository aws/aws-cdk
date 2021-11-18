import { ToolkitInfo } from '../../lib/api';
import { errorWithCode, mockBootstrapStack, MockSdk } from '../util/mock-sdk';


let mockSdk: MockSdk;
beforeEach(() => {
  mockSdk = new MockSdk();
});

test('failure to read SSM parameter results in upgrade message for existing bootstrap stack under v5', async () => {
  // GIVEN
  const toolkitInfo = ToolkitInfo.fromStack(mockBootstrapStack(mockSdk, {
    Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '4' }],
  }), mockSdk);

  mockSdk.stubSsm({
    getParameter() {
      throw errorWithCode('AccessDeniedException', 'Computer says no');
    },
  });

  // THEN
  await expect(toolkitInfo.validateVersion(99, '/abc')).rejects.toThrow(/This CDK deployment requires bootstrap stack version/);
});

test('failure to read SSM parameter results in exception passthrough for existing bootstrap stack v5 or higher', async () => {
  // GIVEN
  const toolkitInfo = ToolkitInfo.fromStack(mockBootstrapStack(mockSdk, {
    Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '5' }],
  }), mockSdk);

  mockSdk.stubSsm({
    getParameter() {
      throw errorWithCode('AccessDeniedException', 'Computer says no');
    },
  });

  // THEN
  await expect(toolkitInfo.validateVersion(99, '/abc')).rejects.toThrow(/Computer says no/);
});

describe('validateversion without bootstrap stack', () => {
  let toolkitInfo: ToolkitInfo;
  beforeEach(() => {
    toolkitInfo = ToolkitInfo.bootstrapStackNotFoundInfo(mockSdk);
  });

  test('validating version with explicit SSM parameter succeeds', async () => {
    // GIVEN
    mockSdk.stubSsm({
      getParameter() {
        return { Parameter: { Value: '10' } };
      },
    });

    // THEN
    await expect(toolkitInfo.validateVersion(8, '/abc')).resolves.toBeUndefined();
  });

  test('validating version without explicit SSM parameter fails', async () => {
    // WHEN
    await expect(toolkitInfo.validateVersion(8, undefined)).rejects.toThrow(/This deployment requires a bootstrap stack with a known name/);
  });

  test('validating version with access denied error gives upgrade hint', async () => {
    // GIVEN
    mockSdk.stubSsm({
      getParameter() {
        throw errorWithCode('AccessDeniedException', 'Computer says no');
      },
    });

    // WHEN
    await expect(toolkitInfo.validateVersion(8, '/abc')).rejects.toThrow(/This CDK deployment requires bootstrap stack version/);
  });

  test('validating version with missing parameter gives bootstrap hint', async () => {
    // GIVEN
    mockSdk.stubSsm({
      getParameter() {
        throw errorWithCode('ParameterNotFound', 'Wut?');
      },
    });

    // WHEN
    await expect(toolkitInfo.validateVersion(8, '/abc')).rejects.toThrow(/Has the environment been bootstrapped?/);
  });
});