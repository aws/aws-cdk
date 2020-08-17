import * as nodeunit from 'nodeunit';
import * as core from '../lib';

export = nodeunit.testCase({
  '._toCloudFormation': {
    'does not call renderProperties with an undefined value'(test: nodeunit.Test) {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

      let called = false;
      (resource as any).renderProperties = (val: any) => {
        called = true;
        test.notEqual(val, null);
      };

      test.deepEqual(app.synth().getStackByName(stack.stackName).template, {
        Resources: {
          DefaultResource: {
            Type: 'Test::Resource::Fake',
          },
        },
      });
      test.ok(called, 'renderProperties must be called called');

      test.done();
    },
  },

  'applyRemovalPolicy default includes Update policy'(test: nodeunit.Test) {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN);

    // THEN
    test.deepEqual(app.synth().getStackByName(stack.stackName).template, {
      Resources: {
        DefaultResource: {
          Type: 'Test::Resource::Fake',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });

    test.done();
  },

  'can switch off updating Update policy'(test: nodeunit.Test) {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN, {
      applyToUpdateReplacePolicy: false,
    });

    // THEN
    test.deepEqual(app.synth().getStackByName(stack.stackName).template, {
      Resources: {
        DefaultResource: {
          Type: 'Test::Resource::Fake',
          DeletionPolicy: 'Retain',
        },
      },
    });

    test.done();
  },

  'can add metadata'(test: nodeunit.Test) {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.addMetadata('Beep', 'Boop');

    // THEN
    test.deepEqual(app.synth().getStackByName(stack.stackName).template, {
      Resources: {
        DefaultResource: {
          Type: 'Test::Resource::Fake',
          Metadata: {
            Beep: 'Boop',
          },
        },
      },
    });

    test.done();
  },

  'subclasses can override "shouldSynthesize" to lazy-determine if the resource should be included'(test: nodeunit.Test) {
    // GIVEN
    class HiddenCfnResource extends core.CfnResource {
      protected shouldSynthesize() {
        return false;
      }
    }

    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const subtree = new core.Construct(stack, 'subtree');

    // WHEN
    new HiddenCfnResource(subtree, 'R1', { type: 'Foo::R1' });
    const r2 = new core.CfnResource(stack, 'R2', { type: 'Foo::R2' });

    // also try to take a dependency on the parent of `r1` and expect the dependency not to materialize
    r2.node.addDependency(subtree);

    // THEN - only R2 is synthesized
    test.deepEqual(app.synth().getStackByName(stack.stackName).template, {
      Resources: { R2: { Type: 'Foo::R2' } },

      // No DependsOn!
    });

    test.done();
  },
});
