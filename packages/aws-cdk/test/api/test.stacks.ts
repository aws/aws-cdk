import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { SDK } from '../../lib';
import { AppStacks, DefaultSelection, AppStacksProps } from '../../lib/api/cxapp/stacks';
import { Renames } from '../../lib/renames';
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
    const stacks = testStacks();

    // WHEN
    const selected = await stacks.selectStacks(['withouterrors'], {
      defaultBehavior: DefaultSelection.AllStacks
    });

    // THEN
    test.equal(selected[0].template.resource, 'noerrorresource');

    test.done();
  },

  async 'do throw when selecting stack with errors'(test: Test) {
    // GIVEN
    const stacks = testStacks();

    // WHEN
    try {
      await stacks.selectStacks(['witherrors'], {
        defaultBehavior: DefaultSelection.AllStacks
      });

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
    const synthed = await stacks.selectStacks(['withouterrors'], {
      defaultBehavior: DefaultSelection.AllStacks
    });

    // THEN
    test.equal(synthed[0].name, 'withoutbananas');
    test.equal(synthed[0].originalName, 'withouterrors');

    test.done();
  },

  async 'select behavior: all'(test: Test) {
    // GIVEN
    const stacks = testStacks();

    // WHEN
    const x = await stacks.selectStacks([], { defaultBehavior: DefaultSelection.AllStacks });

    // THEN
    test.deepEqual(x.length, 2);
    test.done();
  },

  async 'select behavior: none'(test: Test) {
    // GIVEN
    const stacks = testStacks();

    // WHEN
    const x = await stacks.selectStacks([], { defaultBehavior: DefaultSelection.None });

    // THEN
    test.deepEqual(x.length, 0);
    test.done();
  },

  async 'select behavior: single'(test: Test) {
    // GIVEN
    const stacks = testStacks();

    // WHEN
    let thrown: string | undefined;
    try {
      await stacks.selectStacks([], { defaultBehavior: DefaultSelection.OnlySingle });
    } catch (e) {
      thrown = e.message;
    }

    // THEN
    test.ok(thrown && thrown.includes('Since this app includes more than a single stack, specify which stacks to use (wildcards are supported)'));
    test.done();
  }

};

function testStacks() {
  return new AppStacks({
    configuration: new Configuration(),
    aws: new SDK(),
    synthesizer: async () => FIXED_RESULT,
  });
}