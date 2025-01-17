import { Toolkit } from '../../lib/toolkit';
import { appFixture, builderFixture, TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });

beforeEach(() => {
  ioHost.spy.mockClear();
});

describe('synth', () => {
  test('synth from builder', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.synth(cx);

    // THEN
    expect(ioHost.spy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'info',
      message: expect.stringContaining('Successfully synthesized'),
    }));
  });

  test('synth from app', async () => {
    // WHEN
    const cx = await appFixture(toolkit, 'two-empty-stacks');
    await toolkit.synth(cx);

    // THEN
    expect(ioHost.spy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'info',
      message: expect.stringContaining('Successfully synthesized'),
    }));
  });

  test('single stack returns the stack', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-bucket');
    await toolkit.synth(cx);

    // THEN
    expect(ioHost.spy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'info',
      code: 'CDK_TOOLKIT_I0001',
      message: expect.stringContaining('Successfully synthesized'),
      data: expect.objectContaining({
        stacksCount: 1,
        stack: expect.objectContaining({
          hierarchicalId: 'Stack1',
          stackName: 'Stack1',
          stringifiedJson: expect.not.stringContaining('CheckBootstrapVersion'),
        }),
      }),
    }));
  });

  test('multiple stacks returns the ids', async () => {
    // WHEN
    await toolkit.synth(await appFixture(toolkit, 'two-empty-stacks'));

    // THEN
    expect(ioHost.spy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'info',
      code: 'CDK_TOOLKIT_I0002',
      message: expect.stringContaining('Successfully synthesized'),
      data: expect.objectContaining({
        stacksCount: 2,
        stackIds: ['Stack1', 'Stack2'],
      }),
    }));
  });
});
