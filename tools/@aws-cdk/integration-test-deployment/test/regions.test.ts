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
  test('bootstraps only the provided regions', async () => {
    const env = { AWS_ACCOUNT_ID: '123456789' } as NodeJS.ProcessEnv;
    const regions = REGIONS.slice(0, 3);
    await bootstrap(env, regions);

    const args = mockSpawn.mock.calls[0][1]!;
    for (const region of regions) {
      expect(args).toContain(`aws://123456789/${region}`);
    }
    // Should NOT contain regions beyond the slice
    expect(args).not.toContain(`aws://123456789/${REGIONS[3]}`);
  });
});

describe('deployIntegrationTest', () => {
  test('uses npx with -- separator to avoid yargs consuming snapshot paths as regions', async () => {
    const env = {} as NodeJS.ProcessEnv;
    const regions = REGIONS.slice(0, 2);
    await deployIntegrationTest(env, ['test/snapshot1'], regions);

    expect(mockSpawn.mock.calls[0][0]).toBe('npx');
    const args = mockSpawn.mock.calls[0][1]!;
    const dashDashIndex = args.indexOf('--');
    const regionsIndex = args.indexOf('--parallel-regions');
    expect(regionsIndex).toBeGreaterThan(-1);
    expect(args[regionsIndex + 1]).toBe(regions.join(','));
    expect(dashDashIndex).toBeGreaterThan(regionsIndex);
    expect(args[dashDashIndex + 1]).toBe('test/snapshot1');
  });
});
