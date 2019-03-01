import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { SDK } from '../../lib';
import { AppStacks, ExtendedStackSelection } from '../../lib/api/cxapp/stacks';
import { Renames } from '../../lib/renames';
import { Configuration } from '../../lib/settings';

const FIXED_RESULT: cxapi.SynthesizeResponse = {
  version: '1',
  stacks: [
    {
      name: 'withouterrors',
      template: { resource: 'noerrorresource' },
      environment: { name: 'dev', account: '12345', region: 'here' },
      metadata: {},
    },
    {
      name: 'witherrors',
      template: { resource: 'errorresource' },
      environment: { name: 'dev', account: '12345', region: 'here' },
      metadata: {
        '/resource': [
          {
            type: cxapi.ERROR_METADATA_KEY,
            data: 'this is an error',
            trace: []
          }
        ]
      }
    }
  ]
};

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

  async 'renames get applied when stacks are selected'(test: Test) {
    // GIVEN
    const stacks = new AppStacks({
      configuration: new Configuration(),
      aws: new SDK(),
      synthesizer: async () => FIXED_RESULT,
      renames: new Renames({ withouterrors: 'withoutbananas' }),
    });

    // WHEN
    const synthed = await stacks.selectStacks(['withouterrors'], ExtendedStackSelection.None);

    // THEN
    test.equal(synthed[0].name, 'withoutbananas');
    test.equal(synthed[0].originalName, 'withouterrors');

    test.done();
  },
};