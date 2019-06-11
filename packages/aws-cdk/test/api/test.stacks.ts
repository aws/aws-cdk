import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { SDK } from '../../lib';
import { AppStacks, ExtendedStackSelection } from '../../lib/api/cxapp/stacks';
import { Configuration } from '../../lib/settings';
import { testAssembly } from '../util';

const FIXED_RESULT = testAssembly({
  stackName: 'withouterrors',
  template: { resource: 'noerrorresource' },
},
{
  stackName: 'witherrors',
  template: { resource: 'errorresource' },
  metadata: {
    '/resource': [
      {
        type: cxapi.ERROR_METADATA_KEY,
        data: 'this is an error'
      }
    ]
  },
});

export = {
  async 'do not throw when selecting stack without errors'(test: Test) {
    // GIVEN
    const stacks = new AppStacks({
      configuration: new Configuration(),
      aws: new SDK(),
      synthesizer: async () => FIXED_RESULT,
    });

    // WHEN
    const selected = await stacks.selectStacks(['withouterrors'], ExtendedStackSelection.None);

    // THEN
    test.equal(selected[0].template.resource, 'noerrorresource');

    test.done();
  },

  async 'do throw when selecting stack with errors'(test: Test) {
    // GIVEN
    const stacks = new AppStacks({
      configuration: new Configuration(),
      aws: new SDK(),
      synthesizer: async () => FIXED_RESULT,
    });

    // WHEN
    try {
      await stacks.selectStacks(['witherrors'], ExtendedStackSelection.None);
      test.ok(false, 'Did not get exception');
    } catch (e) {
      test.ok(/Found errors/.test(e.toString()), 'Wrong error');
    }

    test.done();
  },
};
