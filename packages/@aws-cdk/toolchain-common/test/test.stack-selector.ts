import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { ExtendedStackSelection, StackSelector } from '../lib/stack-selector';

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
  'do not throw when selecting stack without errors'(test: Test) {
    // GIVEN
    const stacks = new StackSelector({
      response: FIXED_RESULT,
    });

    // WHEN
    const selected = stacks.selectStacks(['withouterrors'], ExtendedStackSelection.None);

    // THEN
    test.equal(selected[0].template.resource, 'noerrorresource');

    test.done();
  },

  'do throw when selecting stack with errors'(test: Test) {
    // GIVEN
    const stacks = new StackSelector({
      response: FIXED_RESULT,
    });

    // WHEN
    try {
      stacks.selectStacks(['witherrors'], ExtendedStackSelection.None);
      test.ok(false, 'Did not get exception');
    } catch (e) {
      test.ok(/Found errors/.test(e.toString()), 'Wrong error');
    }

    test.done();
  },

  'does not return non-autoDeployed Stacks when called without any selectors'(test: Test) {
    // GIVEN
    const stacks = StackSelectorWith([
      {
        name: 'NotAutoDeployedStack',
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
        autoDeploy: false,
      },
    ]);

    // WHEN
    const synthed = stacks.selectStacks([], ExtendedStackSelection.None);

    // THEN
    test.equal(synthed.length, 0);

    test.done();
  },

  'does return non-autoDeployed Stacks when called with selectors matching it'(test: Test) {
    // GIVEN
    const stacks = StackSelectorWith([
      {
        name: 'NotAutoDeployedStack',
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
        autoDeploy: false,
      },
    ]);

    // WHEN
    const synthed = stacks.selectStacks(['NotAutoDeployedStack'], ExtendedStackSelection.None);

    // THEN
    test.equal(synthed.length, 1);

    test.done();
  },

  "does return an non-autoDeployed Stack when it's a dependency of a selected Stack"(test: Test) {
    // GIVEN
    const stacks = StackSelectorWith([
      {
        name: 'NotAutoDeployedStack',
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
        autoDeploy: false,
      },
      {
        name: 'AutoDeployedStack',
        template: { resource: 'Resource' },
        environment: { name: 'dev', account: '12345', region: 'here' },
        metadata: {},
        dependsOn: ['NotAutoDeployedStack'],
      },
    ]);

    // WHEN
    const synthed = stacks.selectStacks(['AutoDeployedStack'], ExtendedStackSelection.Upstream);

    // THEN
    test.equal(synthed.length, 2);

    test.done();
  },
};

function StackSelectorWith(stacks: cxapi.SynthesizedStack[]): StackSelector {
  const response: cxapi.SynthesizeResponse = {
    version: '1',
    stacks,
  };
  return new StackSelector({
    response
  });
}
