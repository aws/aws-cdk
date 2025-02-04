import { Toolkit } from '../../lib/toolkit';
import { appFixture, builderFixture, TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });

beforeEach(() => {
  ioHost.notifySpy.mockClear();
  ioHost.requestSpy.mockClear();
});

describe('synth', () => {
  test('synth from builder', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.synth(cx);

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'result',
      message: expect.stringContaining('Successfully synthesized'),
    }));
  });

  test('synth from app', async () => {
    // WHEN
    const cx = await appFixture(toolkit, 'two-empty-stacks');
    await toolkit.synth(cx);

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'result',
      message: expect.stringContaining('Successfully synthesized'),
    }));
  });

  test('single stack returns the stack', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-bucket');
    await toolkit.synth(cx);

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'result',
      code: 'CDK_TOOLKIT_I1901',
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
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'result',
      code: 'CDK_TOOLKIT_I1902',
      message: expect.stringContaining('Successfully synthesized'),
      data: expect.objectContaining({
        stacksCount: 2,
        stackIds: ['Stack1', 'Stack2'],
      }),
    }));
  });
});
