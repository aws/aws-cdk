/* eslint-disable @typescript-eslint/unbound-method */
import { AtmosphereAllocationMock } from './atmosphere-mock';
import { gitDiffMock } from './git-mock';
import { AtmosphereAllocation } from '../lib/atmosphere';
import * as integRunner from '../lib/integration-test-runner';
import * as utils from '../lib/utils';

jest.mock('../lib/atmosphere');

const env = {
  AWS_ACCESS_KEY_ID: 'XXXXXXXXXXXXX',
  AWS_SECRET_ACCESS_KEY: '123456789',
  AWS_SESSION_TOKEN: '123456789',
  AWS_REGION: 'us-east-1',
  AWS_ACCOUNT_ID: '123456789',
};

const atmosphereRoleArn = 'arn:atmopshere:role:mock';
const endpoint = 'https://test-endpoint.com';
const pool = 'test-pool';

describe('Run Integration Tests with Atmosphere', () => {
  let mockAtmosphereAllocation: AtmosphereAllocationMock;
  let changedSnapshots: Set<string>;

  const validateSnapshotRun = ({ batchSize }: {batchSize: number}) => {
    // Test that git diff has only been called once to get the snapshots
    expect(utils.gitDiff).toHaveBeenCalledTimes(1);

    // Test that the each Atmosphere acquire has been released.
    const numberOfCommands = Math.ceil(changedSnapshots.size/batchSize);
    expect(AtmosphereAllocation.acquire).toHaveBeenCalledTimes(numberOfCommands);
    expect(mockAtmosphereAllocation.release).toHaveBeenCalledTimes(numberOfCommands);

    // Test that the role is assumed for every batch run.
    const assumeAtmosphereRoleCalls = (integRunner.assumeAtmosphereRole as jest.Mock).mock.calls;
    expect(assumeAtmosphereRoleCalls.length).toBe(numberOfCommands);
    for (const assumeAtmosphereRoleCall of assumeAtmosphereRoleCalls) {
      expect(assumeAtmosphereRoleCall[0]).toEqual(atmosphereRoleArn);
    }

    // Test that bootstrap is invoked for every batch run.
    const bootstrapCalls = (integRunner.bootstrap as jest.Mock).mock.calls;
    expect(bootstrapCalls.length).toEqual(numberOfCommands);
    for (const call of bootstrapCalls) {
      expect(call[0]).toEqual(expect.objectContaining(env));
    }

    // Test that all snapshots have run exactly once.
    const deployIntegrationTestCalls = (integRunner.deployIntegrationTest as jest.Mock).mock.calls;
    expect(deployIntegrationTestCalls.length).toEqual(numberOfCommands);
    const snapshotCalls = deployIntegrationTestCalls.map((call) => {
      expect(call[0]).toEqual(expect.objectContaining(env));
      return call[1];
    }).flat() as string[];
    expect(new Set(snapshotCalls).size).toEqual(snapshotCalls.length); // All snapshots are tested only once.
    expect(new Set(snapshotCalls)).toEqual(changedSnapshots); // All snapshots are tested.
  };

  beforeAll(async () => {
    jest.spyOn(utils, 'gitDiff').mockImplementation(gitDiffMock);
    changedSnapshots = new Set(await utils.getChangedSnapshots());
  });

  beforeEach(() => {
    mockAtmosphereAllocation = new AtmosphereAllocationMock('test-endpoint', 'test-pool');
    jest.spyOn(AtmosphereAllocation, 'acquire').mockImplementation(async () => {
      return mockAtmosphereAllocation as any;
    });
    jest.spyOn(mockAtmosphereAllocation, 'release');
    jest.spyOn(integRunner, 'deployIntegrationTest').mockImplementation(async () => {});
    jest.spyOn(integRunner, 'bootstrap').mockImplementation(async () => {});
    jest.spyOn(integRunner, 'assumeAtmosphereRole').mockImplementation(async (_roleArn: string) => ({
      AccessKeyId: env.AWS_ACCESS_KEY_ID,
      SecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      SessionToken: env.AWS_SESSION_TOKEN,
      Expiration: new Date(),
    }));
    jest.clearAllMocks();
  });

  test('successful integration test', async () => {
    await integRunner.deployIntegTests({ atmosphereRoleArn, endpoint, pool });
    validateSnapshotRun({ batchSize: 3 });
  });

  test('successful integration test with a non-default batch size', async () => {
    await integRunner.deployIntegTests({ atmosphereRoleArn, endpoint, pool, batchSize: 1 });
    validateSnapshotRun({ batchSize: 1 });
  });

  test('failed integration test', async () => {
    jest.spyOn(integRunner, 'deployIntegrationTest').mockImplementation(() => {
      return Promise.reject(new Error('Integration tests failed with exit code 1'));
    });

    await expect(integRunner.deployIntegTests({ atmosphereRoleArn, endpoint, pool })).rejects.toThrow(
      'Deployment integration test did not pass',
    );

    validateSnapshotRun({ batchSize: 3 });
  });

  test('failed Atmosphere release requests after timeout creates a warning and proceeds with the next batch', async () => {
    jest.spyOn(integRunner, 'deployIntegrationTest').mockImplementation(() => {
      return Promise.reject(new Error('Integration tests failed with exit code 1'));
    });

    jest.spyOn(mockAtmosphereAllocation, 'release').mockImplementation(() => {
      return Promise.reject(new Error('The security token included in the request is expired'));
    });

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    await expect(integRunner.deployIntegTests({ atmosphereRoleArn, endpoint, pool })).rejects.toThrow(
      'Deployment integration test did not pass',
    );

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('::warning::Atmosphere allocation release failed: Error: The security token included in the request is expired'));

    consoleSpy.mockRestore();

    validateSnapshotRun({ batchSize: 3 });
  });
});
