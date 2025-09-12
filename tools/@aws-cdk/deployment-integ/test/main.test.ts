import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { main } from '../lib/main';
import { AtmosphereAllocationMock } from './atmosphere-mock';
import { AtmosphereAllocation } from '../lib/atmosphere';
import { gitDiffMock } from './git-mock';
import { gitDiff } from '../lib/git';
import { runInteg } from '../lib/integ-run';
import { expectedChangedSnapshots } from './git-diff-expected-changed-snapshots';

jest.mock('../lib/atmosphere');
jest.mock('../lib/git.ts');
jest.mock('../lib/integ-run');

describe('main', () => {
  let mockAtmosphereAllocation: AtmosphereAllocationMock;

  beforeEach(() => {
    mockAtmosphereAllocation = new AtmosphereAllocationMock('test-endpoint', 'test-pool');
    jest.spyOn(AtmosphereAllocation, 'acquire').mockImplementation(async () => {
      return mockAtmosphereAllocation as any;
    });
    (gitDiff as jest.Mock).mockImplementation(gitDiffMock);
    jest.spyOn(mockAtmosphereAllocation, 'release');
  });

  test('successful integration test', async () => {
    (runInteg as jest.Mock).mockImplementation(async () => {
      return;
    });

    const endpoint = 'https://test-endpoint.com';
    const pool = 'test-pool';

    await main({ endpoint, pool });
    expect(AtmosphereAllocation.acquire).toHaveBeenCalled();
    expect(runInteg).toHaveBeenCalledWith(
      expect.arrayContaining(expectedChangedSnapshots),
      {
        id: `allocation-for-pool-${pool}`,
        environment: {
          account: '123456789',
          region: 'us-east-1',
        },
        credentials: {
          accessKeyId: 'XXXXXXXXXXXXX',
          secretAccessKey: '123456789',
          sessionToken: '123456789',
        },
      },
    );
    expect(mockAtmosphereAllocation.release).toHaveBeenCalled();
  });

  test('failed integration test', async () => {
    (runInteg as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error('Integration tests failed with exit code 1'));
    });

    const endpoint = 'https://test-endpoint.com';
    const pool = 'test-pool';

    await expect(main({ endpoint, pool })).rejects.toThrow(
      'Deployment integration test did not pass',
    );
    expect(AtmosphereAllocation.acquire).toHaveBeenCalled();
    expect(runInteg).toHaveBeenCalledWith(
      expect.arrayContaining(expectedChangedSnapshots),
      {
        id: `allocation-for-pool-${pool}`,
        environment: {
          account: '123456789',
          region: 'us-east-1',
        },
        credentials: {
          accessKeyId: 'XXXXXXXXXXXXX',
          secretAccessKey: '123456789',
          sessionToken: '123456789',
        },
      },
    );
    expect(mockAtmosphereAllocation.release).toHaveBeenCalled();
  });
});
