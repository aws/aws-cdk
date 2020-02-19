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

test('correctly passes CFN parameters, ignoring ones with empty values', async () => {
  // GIVEN
  const sdk = new MockSDK();

  let parameters: any[] | undefined;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet(options) {
      parameters = options.Parameters;
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      return {};
    }
  });

  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    sdk,
    parameters: {
      A: 'A-value',
      B: undefined,
      C: '',
    },
  });

  // THEN
  expect(parameters).toStrictEqual([
    { ParameterKey: 'A', ParameterValue: 'A-value' },
  ]);
});
