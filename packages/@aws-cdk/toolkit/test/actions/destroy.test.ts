import * as core from 'aws-cdk-lib/core';
import { Toolkit } from '../../lib/toolkit';
import { fixture, TestIoHost } from '../_helpers';
import { StackSelectionStrategy } from '../../lib';

const ioHost = new TestIoHost();
const notifySpy = jest.spyOn(ioHost, 'notify');
const requestResponseSpy = jest.spyOn(ioHost, 'requestResponse');
const cdk = new Toolkit({ ioHost });

const cxFromBuilder = async () => {
  return cdk.fromAssemblyBuilder(async () => {
    const app = new core.App();
    new core.Stack(app, 'Stack1');
    new core.Stack(app, 'Stack2');

    // @todo fix api
    return app.synth() as any;
  });
};

const cxFromApp = async (name: string) => {
  return cdk.fromCdkApp(`node ${fixture(name)}`);
};

beforeEach(() => {
  requestResponseSpy.mockClear();
  notifySpy.mockClear();
});

describe('destroy', () => {
  test('destroy from builder', async () => {
    // WHEN
    const cx = await cxFromBuilder();
    await cdk.destroy(cx, { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'destroy',
      level: 'info',
      message: expect.stringContaining('destroyed'),
    }));
  });

  test('destroy from app', async () => {
    // WHEN
    await cdk.destroy(await cxFromApp('two-empty-stacks'), { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'destroy',
      level: 'info',
      message: expect.stringContaining('destroyed'),
    }));
  });

  test('requests response before destroying', async () => {
    // WHEN
    const cx = await cxFromBuilder();
    await cdk.destroy(cx, { stacks: { strategy: StackSelectionStrategy.ALL_STACKS } });

    // THEN
    expect(requestResponseSpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'destroy',
      level: 'info',
      code: 'CDK_TOOLKIT_I7010',
      message: expect.stringContaining('Are you sure you want to delete:'),
    }));
  });
});
