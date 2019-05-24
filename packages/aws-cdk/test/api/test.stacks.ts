import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { SDK } from '../../lib';
import { AppStacks, ExtendedStackSelection } from '../../lib/api/cxapp/stacks';
import { Renames } from '../../lib/renames';
import { Configuration } from '../../lib/settings';

const FIXED_RESULT: cxapi.ICloudAssembly = {
  directory: 'cdk.out',
  version: '1',
  runtime: { libraries: { } },
  artifacts: [],
  stacks: [
    {
      id: 'withouterrors',
      name: 'withouterrors',
      originalName: 'withouterrors',
      depends: [],
      messages: [],
      logicalIdToPathMap: {},
      autoDeploy: true,
      missing: { },
      assets: [],
      template: { resource: 'noerrorresource' },
      environment: { name: 'dev', account: '12345', region: 'here' },
      metadata: {},
    },
    {
      id: 'witherrors',
      name: 'witherrors',
      originalName: 'witherrors',
      depends: [],
      messages: [
        { level: cxapi.SynthesisMessageLevel.ERROR, id: '/resource', entry: { data: 'this is an error', trace: [], type: cxapi.ERROR_METADATA_KEY } }
      ],
      logicalIdToPathMap: {},
      autoDeploy: true,
      missing: { },
      assets: [],
      template: { resource: 'errorresource' },
      environment: { name: 'dev', account: '12345', region: 'here' },
      metadata: { },
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

  async 'does not return non-autoDeployed Stacks when called without any selectors'(test: Test) {
    // GIVEN
    const stacks = appStacksWith([
      {
        id: 'NotAutoDeployedStack',
        name: 'NotAutoDeployedStack',
        originalName: 'NotAutoDeployedStack',
        assets: [],
        logicalIdToPathMap: {},
        missing: {},
        depends: [],
        messages: [],
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
        autoDeploy: false,
      },
    ]);

    // WHEN
    const synthed = await stacks.selectStacks([], ExtendedStackSelection.None);

    // THEN
    test.equal(synthed.length, 0);

    test.done();
  },

  async 'does return non-autoDeployed Stacks when called with selectors matching it'(test: Test) {
    // GIVEN
    const stacks = appStacksWith([
      {
        id: 'NotAutoDeployedStack',
        name: 'NotAutoDeployedStack',
        originalName: 'NotAutoDeployedStack',
        assets: [],
        logicalIdToPathMap: {},
        missing: {},
        depends: [],
        messages: [],
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
        autoDeploy: false,
      },
    ]);

    // WHEN
    const synthed = await stacks.selectStacks(['NotAutoDeployedStack'], ExtendedStackSelection.None);

    // THEN
    test.equal(synthed.length, 1);

    test.done();
  },

  async "does return an non-autoDeployed Stack when it's a dependency of a selected Stack"(test: Test) {
    // GIVEN
    const stacks = appStacksWith([
      {
        id: 'NotAutoDeployedStack',
        name: 'NotAutoDeployedStack',
        originalName: 'NotAutoDeployedStack',
        assets: [],
        logicalIdToPathMap: {},
        missing: {},
        depends: [],
        messages: [],
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
        autoDeploy: false,
      },
      {
        id: 'AutoDeployedStack',
        name: 'AutoDeployedStack',
        originalName: 'AutoDeployedStack',
        autoDeploy: true,
        assets: [],
        logicalIdToPathMap: {},
        missing: {},
        depends: [
          {
            id: 'NotAutoDeployedStack',
            environment: { region: 'r', account: '1', name: 'x' },
            metadata: {},
            missing: {},
            autoDeploy: true,
            depends: [],
            messages: [],
          }
        ],
        messages: [],
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
      },
    ]);

    // WHEN
    const synthed = await stacks.selectStacks(['AutoDeployedStack'], ExtendedStackSelection.Upstream);

    // THEN
    test.equal(synthed.length, 2);

    test.done();
  },
};

function appStacksWith(stacks: cxapi.ICloudFormationStackArtifact[]): AppStacks {
  const response: cxapi.ICloudAssembly = {
    directory: 'cdk.out',
    version: '1',
    artifacts: [],
    runtime: { libraries: { } },
    stacks,
  };
  return new AppStacks({
    configuration: new Configuration(),
    aws: new SDK(),
    synthesizer: async () => response,
  });
}
