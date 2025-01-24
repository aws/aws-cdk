// We need to mock the chokidar library, used by 'cdk watch'
// This needs to happen ABOVE the import statements due to quirks with how jest works
// Apparently, they hoist jest.mock commands just below the import statements so we
// need to make sure that the constants they access are initialized before the imports.
const mockChokidarWatcherOn = jest.fn();
const fakeChokidarWatcher = {
  on: mockChokidarWatcherOn,
};
const fakeChokidarWatcherOn = {
  get readyCallback(): () => Promise<void> {
    expect(mockChokidarWatcherOn.mock.calls.length).toBeGreaterThanOrEqual(1);
    // The call to the first 'watcher.on()' in the production code is the one we actually want here.
    // This is a pretty fragile, but at least with this helper class,
    // we would have to change it only in one place if it ever breaks
    const firstCall = mockChokidarWatcherOn.mock.calls[0];
    // let's make sure the first argument is the 'ready' event,
    // just to be double safe
    expect(firstCall[0]).toBe('ready');
    // the second argument is the callback
    return firstCall[1];
  },

  get fileEventCallback(): (
  event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
  path: string,
  ) => Promise<void> {
    expect(mockChokidarWatcherOn.mock.calls.length).toBeGreaterThanOrEqual(2);
    const secondCall = mockChokidarWatcherOn.mock.calls[1];
    // let's make sure the first argument is not the 'ready' event,
    // just to be double safe
    expect(secondCall[0]).not.toBe('ready');
    // the second argument is the callback
    return secondCall[1];
  },
};

const mockChokidarWatch = jest.fn();
jest.mock('chokidar', () => ({
  watch: mockChokidarWatch,
}));

import { HotswapMode } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { builderFixture, TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });
jest.spyOn(toolkit, 'rollback').mockResolvedValue();

let mockDeployStack = jest.fn().mockResolvedValue({
  type: 'did-deploy-stack',
  stackArn: 'arn:aws:cloudformation:region:account:stack/test-stack',
  outputs: {},
  noOp: false,
});

jest.mock('../../lib/api/aws-cdk', () => {
  return {
    ...jest.requireActual('../../lib/api/aws-cdk'),
    Deployments: jest.fn().mockImplementation(() => ({
      deployStack: mockDeployStack,
      resolveEnvironment: jest.fn().mockResolvedValue({}),
      isSingleAssetPublished: jest.fn().mockResolvedValue(true),
      readCurrentTemplate: jest.fn().mockResolvedValue({ Resources: {} }),
    })),
  };
});

beforeEach(() => {
  ioHost.notifySpy.mockClear();
  ioHost.requestSpy.mockClear();
  jest.clearAllMocks();

  mockChokidarWatch.mockReturnValue(fakeChokidarWatcher);
  // on() in chokidar's Watcher returns 'this'
  mockChokidarWatcherOn.mockReturnValue(fakeChokidarWatcher);
});

describe('watch', () => {
  test('no include & no exclude results in error', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    await expect(async () => toolkit.watch(cx, {})).rejects.toThrow(/Cannot use the 'watch' command without specifying at least one directory to monitor. Make sure to add a \"watch\" key to your cdk.json/);
  });

  test('observes cwd as default rootdir', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    ioHost.level = 'debug';
    await toolkit.watch(cx, {
      include: [],
    });

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'watch',
      level: 'debug',
      message: expect.stringContaining(`root directory used for 'watch' is: ${process.cwd()}`),
    }));
  });

  test('ignores output dir, dot files, dot directories, node_modules by default', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    ioHost.level = 'debug';
    await toolkit.watch(cx, {
      exclude: [],
    });

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'watch',
      level: 'debug',
      message: expect.stringContaining('\'exclude\' patterns for \'watch\': ["cdk.out/**","**/.*","**/.*/**","**/node_modules/**"]'),
    }));
  });

  test('can include specific files', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    ioHost.level = 'debug';
    await toolkit.watch(cx, {
      include: ['index.ts'],
    });

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'watch',
      level: 'debug',
      message: expect.stringContaining('\'include\' patterns for \'watch\': ["index.ts"]'),
    }));
  });

  test('can exclude specific files', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    ioHost.level = 'debug';
    await toolkit.watch(cx, {
      exclude: ['index.ts'],
    });

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'watch',
      level: 'debug',
      message: expect.stringContaining('\'exclude\' patterns for \'watch\': ["index.ts"'),
    }));
  });

  describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
    test('passes through the correct hotswap mode to deployStack()', async () => {
      // WHEN
      const cx = await builderFixture(toolkit, 'stack-with-role');
      ioHost.level = 'warn';
      await toolkit.watch(cx, {
        include: [],
        hotswap: hotswapMode,
      });

      await fakeChokidarWatcherOn.readyCallback();

      // THEN
      expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
        action: 'deploy',
        level: 'warn',
        message: expect.stringContaining('The --hotswap and --hotswap-fallback flags deliberately'),
      }));
    });
  });
});

// @todo unit test watch with file events
