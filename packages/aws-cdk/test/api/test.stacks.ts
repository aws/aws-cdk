import cxapi = require('@aws-cdk/cx-api');
import { Test, testCase } from 'nodeunit';
import { SDK } from '../../lib';
import { AppStacks, DefaultSelection } from '../../lib/api/cxapp/stacks';
import { Configuration } from '../../lib/settings';
import { testAssembly } from '../util';

export = testCase({
  async 'do not throw when selecting stack without errors'(test: Test) {
    // GIVEN
    const stacks = testStacks();

    // WHEN
    const selected = await stacks.selectStacks(['withouterrors'], {
      defaultBehavior: DefaultSelection.AllStacks
    });
    stacks.processMetadata(selected);

    // THEN
    test.equal(selected[0].template.resource, 'noerrorresource');

    test.done();
  },

  async 'do throw when selecting stack with errors'(test: Test) {
    // GIVEN
    const stacks = testStacks();

    // WHEN
    try {
      const selected = await stacks.selectStacks(['witherrors'], {
        defaultBehavior: DefaultSelection.AllStacks
      });
      stacks.processMetadata(selected);

      test.ok(false, 'Did not get exception');
    } catch (e) {
      test.ok(/Found errors/.test(e.toString()), 'Wrong error');
    }

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
  },

  'AWS::CDK::Metadata': {
    async 'is generated for relocatable stacks'(test: Test) {
      const stacks = testStacks({ env: `aws://${cxapi.UNKNOWN_ACCOUNT}/${cxapi.UNKNOWN_REGION}`, versionReporting: true });

      const result = await stacks.synthesizeStack('withouterrors');
      const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
      test.deepEqual(metadata, {
        Type: 'AWS::CDK::Metadata',
        Properties: {
          Modules: `${require('../../package.json').name}=${require('../../package.json').version}`
        }
      });

      test.done();
    },

    async 'is generated for stacks in supported regions'(test: Test) {
      const stacks = testStacks({ env: 'aws://012345678912/us-east-1', versionReporting: true });

      const result = await stacks.synthesizeStack('withouterrors');
      const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
      test.deepEqual(metadata, {
        Type: 'AWS::CDK::Metadata',
        Properties: {
          Modules: `${require('../../package.json').name}=${require('../../package.json').version}`
        }
      });

      test.done();
    },

    async 'is not generated for stacks in unsupported regions'(test: Test) {
      const stacks = testStacks({ env: 'aws://012345678912/bermuda-triangle-1337', versionReporting: true });

      const result = await stacks.synthesizeStack('withouterrors');
      const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
      test.equal(metadata, undefined);

      test.done();
    }
  },
});

function testStacks({ env, versionReporting = true }: { env?: string, versionReporting?: boolean } = {}) {
  const configuration = new Configuration();
  configuration.settings.set(['versionReporting'], versionReporting);

  return new AppStacks({
    configuration,
    aws: new SDK(),
    synthesizer: async () => testAssembly({
      stackName: 'withouterrors',
      env,
      template: { resource: 'noerrorresource' },
    },
    {
      stackName: 'witherrors',
      env,
      template: { resource: 'errorresource' },
      metadata: {
        '/resource': [
          {
            type: cxapi.ERROR_METADATA_KEY,
            data: 'this is an error'
          }
        ]
      },
    }),
  });
}
