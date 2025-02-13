import * as chalk from 'chalk';
import { StackSelectionStrategy } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { builderFixture, TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });
jest.spyOn(toolkit, 'rollback').mockResolvedValue();

let mockDestroyStack = jest.fn();

jest.mock('../../lib/api/aws-cdk', () => {
  return {
    ...jest.requireActual('../../lib/api/aws-cdk'),
    Deployments: jest.fn().mockImplementation(() => ({
      destroyStack: mockDestroyStack,
    })),
  };
});

beforeEach(() => {
  ioHost.notifySpy.mockClear();
  ioHost.requestSpy.mockClear();
  jest.clearAllMocks();
  mockDestroyStack.mockResolvedValue({});
});

describe('destroy', () => {
  test('destroy from builder', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-bucket');
    await toolkit.destroy(cx, { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });

    // THEN
    successfulDestroy();
  });

  test('request response before destroying', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    await toolkit.destroy(cx, { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });

    // THEN
    expect(ioHost.requestSpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'destroy',
      level: 'info',
      code: 'CDK_TOOLKIT_I7010',
      message: expect.stringContaining('Are you sure you want to delete'),
    }));
  });

  test('multiple stacks', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.destroy(cx, { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'destroy',
      level: 'info',
      message: expect.stringContaining(`${chalk.blue('Stack2')}${chalk.green(': destroyed')}`),
    }));
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'destroy',
      level: 'info',
      message: expect.stringContaining(`${chalk.blue('Stack1')}${chalk.green(': destroyed')}`),
    }));
  });

  test('destroy deployment fails', async () => {
    // GIVEN
    mockDestroyStack.mockRejectedValue({});

    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    try {
      await toolkit.destroy(cx, { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });
    } catch (e) {
      // We know this will error, ignore it
    }

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'destroy',
      level: 'error',
      message: expect.stringContaining('destroy failed'),
    }));
  });
});

function successfulDestroy() {
  expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
    action: 'destroy',
    level: 'info',
    message: expect.stringContaining('destroyed'),
  }));
}
