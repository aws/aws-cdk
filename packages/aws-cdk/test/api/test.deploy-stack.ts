import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { deployStack } from '../../lib';
import { MockSDK } from '../util/mock-sdk';

const FAKE_STACK: cxapi.ICloudFormationStackArtifact = {
  logicalIdToPathMap: {},
  autoDeploy: true,
  depends: [],
  messages: [],
  assets: [],
  missing: { },
  id: 'withouterrors',
  name: 'withouterrors',
  originalName: 'withouterrors',
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
