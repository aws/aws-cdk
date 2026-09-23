import * as child_process from 'child_process';
import { REGIONS, bootstrap, deployIntegrationTest } from '../lib/integration-test-runner';

jest.mock('child_process');

const mockSpawn = child_process.spawn as jest.MockedFunction<typeof child_process.spawn>;

beforeEach(() => {
  jest.clearAllMocks();
  mockSpawn.mockReturnValue({
    on: jest.fn((event, cb) => { if (event === 'close') cb(0); }),
  } as any);
});

describe('REGIONS', () => {
  test('includes expected regions', () => {
    expect(REGIONS).toContain('us-east-1');
    expect(REGIONS).toContain('us-west-2');
    expect(REGIONS).toContain('eu-west-1');
    expect(REGIONS).toContain('ap-southeast-1');
    expect(REGIONS).toContain('sa-east-1');
  });
});

describe('bootstrap', () => {
  test('bootstraps only the provided regions', async () => {
    const env = { AWS_ACCOUNT_ID: '123456789' } as NodeJS.ProcessEnv;
    const regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
    await bootstrap(env, regions);

    expect(mockSpawn.mock.calls[0][1]).toEqual([
      'cdk', 'bootstrap',
      'aws://123456789/us-east-1',
      'aws://123456789/us-west-2',
      'aws://123456789/eu-west-1',
    ]);
  });
});

describe('deployIntegrationTest', () => {
  test('uses npx with -- separator and parallel-regions', async () => {
    const env = {} as NodeJS.ProcessEnv;
    const regions = ['us-east-1', 'us-west-2'];
    await deployIntegrationTest(env, ['test/snapshot1'], regions);

    expect(mockSpawn.mock.calls[0][0]).toBe('npx');
    expect(mockSpawn.mock.calls[0][1]).toEqual([
      'integ-runner',
      '--disable-update-workflow',
      '--strict',
      '--directory', 'packages',
      '--force',
      '--parallel-regions', 'us-east-1,us-west-2',
      '--', 'test/snapshot1',
    ]);
  });
});
