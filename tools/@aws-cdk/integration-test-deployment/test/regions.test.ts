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
  test('contains all 17 default regions', () => {
    expect(REGIONS).toHaveLength(17);
  });

  test('includes expected regions', () => {
    expect(REGIONS).toContain('us-east-1');
    expect(REGIONS).toContain('us-west-2');
    expect(REGIONS).toContain('eu-west-1');
    expect(REGIONS).toContain('ap-southeast-1');
    expect(REGIONS).toContain('sa-east-1');
  });
});

describe('bootstrap', () => {
  test('bootstraps all REGIONS', async () => {
    const env = { AWS_ACCOUNT_ID: '123456789' } as NodeJS.ProcessEnv;
    await bootstrap(env);

    const args = mockSpawn.mock.calls[0][1]!;
    for (const region of REGIONS) {
      expect(args).toContain(`aws://123456789/${region}`);
    }
  });
});

describe('deployIntegrationTest', () => {
  test('passes --parallel-regions for all REGIONS', async () => {
    const env = {} as NodeJS.ProcessEnv;
    await deployIntegrationTest(env, ['test/snapshot1']);

    const args = mockSpawn.mock.calls[0][1]!;
    for (const region of REGIONS) {
      expect(args).toContain(region);
    }
    expect(args).toContain('--parallel-regions');
  });
});
