import { StackSelectionStrategy } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { builderFixture, TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });

let mockRollbackStack = jest.fn();
jest.mock('../../lib/api/aws-cdk', () => {
  return {
    ...jest.requireActual('../../lib/api/aws-cdk'),
    Deployments: jest.fn().mockImplementation(() => ({
      rollbackStack: mockRollbackStack,
    })),
  };
});

beforeEach(() => {
  ioHost.notifySpy.mockClear();
  ioHost.requestSpy.mockClear();
  jest.clearAllMocks();
  mockRollbackStack.mockResolvedValue({
    notInRollbackableState: false,
    success: true,
  });
});

describe('rollback', () => {
  test('successful rollback', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.rollback(cx, { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });

    // THEN
    successfulRollback();
  });

  test('rollback not in rollbackable state', async () => {
    // GIVEN
    mockRollbackStack.mockImplementation(() => ({
      notInRollbackableState: true,
      success: false,
    }));
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await expect(async () => toolkit.rollback(cx, {
      stacks: { strategy: StackSelectionStrategy.ALL_STACKS },
    })).rejects.toThrow(/No stacks were in a state that could be rolled back/);
  });

  test('rollback not in rollbackable state', async () => {
    // GIVEN
    mockRollbackStack.mockRejectedValue({});

    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await expect(async () => toolkit.rollback(cx, {
      stacks: { strategy: StackSelectionStrategy.ALL_STACKS },
    })).rejects.toThrow(/Rollback failed/);
  });
});

function successfulRollback() {
  expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
    action: 'rollback',
    level: 'info',
    message: expect.stringContaining('Rollback time:'),
  }));
}
