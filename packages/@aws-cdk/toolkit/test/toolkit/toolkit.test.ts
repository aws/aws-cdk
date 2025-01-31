/**
 * NOTE: This test suite should only contain tests for creating the Toolkit and its methods.
 *
 *  - Actions: Tests for each action go into the `test/actions` directory
 *  - Source Builders: Tests for the Cloud Assembly Source Builders are in `test/api/cloud-assembly/source-builder.test.ts`
 */

import { Toolkit } from '../../lib';
import { TestIoHost } from '../_helpers';

test('emojis can be stripped from message', async () => {
  const ioHost = new TestIoHost();
  const toolkit = new Toolkit({ ioHost, emojis: false });

  await toolkit.ioHost.notify({
    message: '💯Smile123😀',
    action: 'deploy',
    level: 'info',
    code: 'CDK_TOOLKIT_I0000',
    time: new Date(),
  });

  expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
    action: 'deploy',
    level: 'info',
    code: 'CDK_TOOLKIT_I0000',
    message: 'Smile123',
  }));
});
