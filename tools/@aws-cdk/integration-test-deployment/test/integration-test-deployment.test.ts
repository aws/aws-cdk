import { describe, expect, jest, test, beforeEach, beforeAll } from '@jest/globals';
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

describe('Run Inegration Tests with Atmosphere', () => {
  let mockAtmosphereAllocation: AtmosphereAllocationMock;
  let changedSnapshots: Set<string>;

  const validateSnapshotRun = () => {
    expect(utils.gitDiff).toHaveBeenCalledTimes(1);

    const numberOfCommands = Math.ceil(changedSnapshots.size/3);
    expect(AtmosphereAllocation.acquire).toHaveBeenCalledTimes(numberOfCommands);
    expect(mockAtmosphereAllocation.release).toHaveBeenCalledTimes(numberOfCommands);
    const assumeAtmosphereRoleCalls = (integRunner.assumeAtmosphereRole as jest.Mock).mock.calls;
    expect(assumeAtmosphereRoleCalls.length).toBe(numberOfCommands);
    for(const assumeAtmosphereRoleCall of assumeAtmosphereRoleCalls) {
      expect(assumeAtmosphereRoleCall[0]).toEqual(atmosphereRoleArn);
    }

    const bootstrapCalls = (integRunner.bootstrap as jest.Mock).mock.calls;
    expect(bootstrapCalls.length).toEqual(numberOfCommands);
    for (const call of bootstrapCalls) {
      expect(call[0]).toEqual(expect.objectContaining(env));
    }

    const deployIntegrationTestCalls = (integRunner.deployIntegrationTest as jest.Mock).mock.calls;
    expect(deployIntegrationTestCalls.length).toEqual(numberOfCommands);
    const snapshotCalls = deployIntegrationTestCalls.map((call) => {
      expect(call[0]).toEqual(expect.objectContaining(env));
      return call[1];
    }).flat() as string[];
    expect(new Set(snapshotCalls).size).toEqual(snapshotCalls.length); // All snapshots are tested only once.
    expect(new Set(snapshotCalls).size).toEqual(changedSnapshots.size); // All snapshots are tested.
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
    await integRunner.deployInegTestsWithAtmosphere({ atmosphereRoleArn, endpoint, pool });
    validateSnapshotRun();
  });

  test('failed integration test', async () => {
    jest.spyOn(integRunner, 'deployIntegrationTest').mockImplementation(() => {
      return Promise.reject(new Error('Integration tests failed with exit code 1'));
    });

    await expect(integRunner.deployInegTestsWithAtmosphere({ atmosphereRoleArn, endpoint, pool })).rejects.toThrow(
      'Deployment integration test did not pass',
    );

    validateSnapshotRun();
  });
});
