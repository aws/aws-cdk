import { MockSDK } from '@aws-cdk/cdk-common/test/util/mock-sdk';
import { Test } from 'nodeunit';
import { deployStack } from '../../lib/api/deploy-stack';

const FAKE_STACK = {
  name: 'withouterrors',
  template: { resource: 'noerrorresource' },
  environment: { name: 'dev', account: '12345', region: 'here' },
  metadata: {},
};

export = {
  async 'do deploy executable change set with 0 changes'(test: Test) {
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
    test.equals(ret.noOp, false);
    test.equals(executed, true);

    test.done();
  },
};
