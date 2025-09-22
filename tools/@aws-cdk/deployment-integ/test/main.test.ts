import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { AtmosphereAllocationMock } from './atmosphere-mock';
import { AtmosphereAllocation } from '../lib/atmosphere';
import { gitDiffMock } from './git-mock';
import * as utils from '../lib/utils';
import * as integRun from '../lib/integ-run';

jest.mock('../lib/atmosphere');

describe('Run Inegration Tests with Atmosphere', () => {
  let mockAtmosphereAllocation: AtmosphereAllocationMock;

  beforeEach(() => {
    mockAtmosphereAllocation = new AtmosphereAllocationMock('test-endpoint', 'test-pool');
    jest.spyOn(AtmosphereAllocation, 'acquire').mockImplementation(async () => {
      return mockAtmosphereAllocation as any;
    });
    jest.spyOn(utils, 'gitDiff').mockImplementation(gitDiffMock);
    jest.spyOn(mockAtmosphereAllocation, 'release');
    jest.spyOn(integRun, 'runInteg').mockImplementation(async () => {});
  });

  test('successful integration test', async () => {
    const endpoint = 'https://test-endpoint.com';
    const pool = 'test-pool';

    await integRun.deployInegTestsWithAtmosphere({ endpoint, pool });
    expect(AtmosphereAllocation.acquire).toHaveBeenCalled();
    expect(integRun.runInteg).toHaveBeenCalledWith(expect.objectContaining({
      AWS_ACCESS_KEY_ID: 'XXXXXXXXXXXXX',
      AWS_SECRET_ACCESS_KEY: '123456789',
      AWS_SESSION_TOKEN: '123456789',
      AWS_REGION: 'us-east-1',
      AWS_ACCOUNT_ID: '123456789',
    }));
    expect(mockAtmosphereAllocation.release).toHaveBeenCalled();
  });

  test('failed integration test', async () => {
    jest.spyOn(integRun, 'runInteg').mockImplementation(() => {
      return Promise.reject(new Error('Integration tests failed with exit code 1'));
    });

    const endpoint = 'https://test-endpoint.com';
    const pool = 'test-pool';

    await expect(integRun.deployInegTestsWithAtmosphere({ endpoint, pool })).rejects.toThrow(
      'Deployment integration test did not pass',
    );

    expect(AtmosphereAllocation.acquire).toHaveBeenCalled();
    expect(integRun.runInteg).toHaveBeenCalledWith(expect.objectContaining({
      AWS_ACCESS_KEY_ID: 'XXXXXXXXXXXXX',
      AWS_SECRET_ACCESS_KEY: '123456789',
      AWS_SESSION_TOKEN: '123456789',
      AWS_REGION: 'us-east-1',
      AWS_ACCOUNT_ID: '123456789',
    }));
    expect(mockAtmosphereAllocation.release).toHaveBeenCalled();
  });
});
