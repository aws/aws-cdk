import { deployStack } from '../../lib';
import { testStack } from '../util';
import { MockSDK } from '../util/mock-sdk';

const FAKE_STACK = testStack({
  stackName: 'withouterrors',
  template: { resource: 'noerrorresource' },
});

test('do deploy executable change set with 0 changes', async () => {
  // GIVEN
  const sdk = new MockSDK();

  let executed = false;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet() {
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      executed = true;
      return {};
    }
  });

  // WHEN
  const ret = await deployStack({
    stack: FAKE_STACK,
    sdk,
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});
