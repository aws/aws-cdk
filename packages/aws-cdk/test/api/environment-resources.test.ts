import { GetParameterCommand } from '@aws-sdk/client-ssm';
import { ToolkitInfo } from '../../lib/api';
import { EnvironmentResourcesRegistry } from '../../lib/api/environment-resources';
import { CachedDataSource, Notices, NoticesFilter } from '../../lib/notices';
import { Context } from '../../lib/settings';
import * as version from '../../lib/version';
import { MockSdk, mockBootstrapStack, mockSSMClient } from '../util/mock-sdk';
import { MockToolkitInfo } from '../util/mock-toolkitinfo';

let mockSdk: MockSdk;
let envRegistry: EnvironmentResourcesRegistry;
let toolkitMock: ReturnType<typeof MockToolkitInfo.setup>;
beforeEach(() => {
  mockSdk = new MockSdk();
  envRegistry = new EnvironmentResourcesRegistry();
  toolkitMock = MockToolkitInfo.setup();
});

afterEach(() => {
  toolkitMock.dispose();
});

function mockToolkitInfo(ti: ToolkitInfo) {
  ToolkitInfo.lookup = jest.fn().mockResolvedValue(ti);
}

function envResources() {
  return envRegistry.for(
    {
      account: '11111111',
      region: 'us-nowhere',
      name: 'aws://11111111/us-nowhere',
    },
    mockSdk,
  );
}

test('failure to read SSM parameter results in upgrade message for existing bootstrap stack under v5', async () => {
  // GIVEN
  mockToolkitInfo(
    ToolkitInfo.fromStack(
      mockBootstrapStack({
        Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '4' }],
      }),
    ),
  );

  const error = new Error('Computer says no');
  error.name = 'AccessDeniedException';
  mockSSMClient.on(GetParameterCommand).rejects(error);

  // THEN
  await expect(envResources().validateVersion(99, '/abc')).rejects.toThrow(
    /This CDK deployment requires bootstrap stack version/,
  );
});

test('failure to read SSM parameter results in exception passthrough for existing bootstrap stack v5 or higher', async () => {
  // GIVEN
  mockToolkitInfo(
    ToolkitInfo.fromStack(
      mockBootstrapStack({
        Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '5' }],
      }),
    ),
  );

  const error = new Error('Computer says no');
  error.name = 'AccessDeniedException';
  mockSSMClient.on(GetParameterCommand).rejects(error);

  // THEN
  await expect(envResources().validateVersion(99, '/abc')).rejects.toThrow(/Computer says no/);
});

describe('validateversion without bootstrap stack', () => {
  beforeEach(() => {
    mockToolkitInfo(ToolkitInfo.bootstrapStackNotFoundInfo('TestBootstrapStack'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('validating version with explicit SSM parameter succeeds', async () => {
    // GIVEN
    mockSSMClient.on(GetParameterCommand).resolves({
      Parameter: { Value: '10' },
    });

    // disable notices caching
    jest.spyOn(CachedDataSource.prototype as any, 'save').mockImplementation((_: any) => Promise.resolve());
    jest
      .spyOn(CachedDataSource.prototype as any, 'load')
      .mockImplementation(() => Promise.resolve({ expiration: 0, notices: [] }));

    // mock cli version number
    jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

    // THEN
    const notices = Notices.create({ context: new Context() });
    await notices.refresh({ dataSource: { fetch: async () => [] } });
    await expect(envResources().validateVersion(8, '/abc')).resolves.toBeUndefined();

    const filter = jest.spyOn(NoticesFilter, 'filter');
    notices.display();

    expect(filter).toHaveBeenCalledTimes(1);
    expect(filter).toHaveBeenCalledWith({
      bootstrappedEnvironments: [
        {
          bootstrapStackVersion: 10,
          environment: {
            account: '11111111',
            region: 'us-nowhere',
            name: 'aws://11111111/us-nowhere',
          },
        },
      ],
      cliVersion: '1.0.0',
      data: [],
      outDir: 'cdk.out',
    });
  });

  test('validating version without explicit SSM parameter fails', async () => {
    // WHEN
    await expect(envResources().validateVersion(8, undefined)).rejects.toThrow(
      /This deployment requires a bootstrap stack with a known name/,
    );
  });

  test('validating version with access denied error gives upgrade hint', async () => {
    // GIVEN
    const error = new Error('Computer says no');
    error.name = 'AccessDeniedException';
    mockSSMClient.on(GetParameterCommand).rejects(error);

    // WHEN
    await expect(envResources().validateVersion(8, '/abc')).rejects.toThrow(
      /This CDK deployment requires bootstrap stack version/,
    );
  });

  test('validating version with missing parameter gives bootstrap hint', async () => {
    // GIVEN
    const error = new Error('Wut?');
    error.name = 'ParameterNotFound';
    mockSSMClient.on(GetParameterCommand).rejects(error);

    // WHEN
    await expect(envResources().validateVersion(8, '/abc')).rejects.toThrow(/Has the environment been bootstrapped?/);
  });
});
