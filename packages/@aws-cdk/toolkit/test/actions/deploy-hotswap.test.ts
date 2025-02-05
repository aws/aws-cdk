import { HotswapMode } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { builderFixture, TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });

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
});

describe('deploy with hotswap', () => {
  test('does print hotswap warnings for FALL_BACK mode', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.deploy(cx, {
      hotswap: HotswapMode.FALL_BACK,
    });

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      level: 'warn',
      message: expect.stringContaining('hotswap'),
    }));
  });

  test('does print hotswap warnings for HOTSWAP_ONLY mode', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.deploy(cx, {
      hotswap: HotswapMode.HOTSWAP_ONLY,
    });

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      level: 'warn',
      message: expect.stringContaining('hotswap'),
    }));
  });
});

describe('deploy without hotswap', () => {
  test('does not print hotswap warnings when mode is undefined', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.deploy(cx, {
      hotswap: undefined,
    });

    // THEN
    expect(ioHost.notifySpy).not.toHaveBeenCalledWith(expect.objectContaining({
      level: 'warn',
      message: expect.stringContaining('hotswap'),
    }));
  });

  test('does not print hotswap warning for FULL_DEPLOYMENT mode', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.deploy(cx, {
      hotswap: HotswapMode.FULL_DEPLOYMENT,
    });

    // THEN
    expect(ioHost.notifySpy).not.toHaveBeenCalledWith(expect.objectContaining({
      level: 'warn',
      message: expect.stringContaining('hotswap'),
    }));
  });
});
