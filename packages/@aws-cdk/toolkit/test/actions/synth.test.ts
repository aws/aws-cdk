import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import { Toolkit } from '../../lib/toolkit';
import { fixture, TestIoHost } from '../_helpers';

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

describe('synth', () => {
  test('synth from builder', async () => {
    // WHEN
    const cx = await cxFromBuilder();
    await cdk.synth(cx);

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'info',
      message: expect.stringContaining('Successfully synthesized'),
    }));
  });

  test('synth from app', async () => {
    // WHEN
    await cdk.synth(await cxFromApp('two-empty-stacks'));

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'info',
      message: expect.stringContaining('Successfully synthesized'),
    }));
  });

  test('single stack returns the stack', async () => {
    // WHEN
    const cx = await cdk.fromAssemblyBuilder(async () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'Stack1');
      new s3.Bucket(stack, 'MyBucket');
      return app.synth() as any;
    });

    await cdk.synth(cx);

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
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
    await cdk.synth(await cxFromApp('two-empty-stacks'));

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'synth',
      level: 'info',
      code: 'CDK_TOOLKIT_I0002',
      message: expect.stringContaining('Successfully synthesized'),
      data: expect.objectContaining({
        stacksCount: 2,
        stackIds: ['AppStack1', 'AppStack2'],
      }),
    }));
  });
});
