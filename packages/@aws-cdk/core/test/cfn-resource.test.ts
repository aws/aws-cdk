import { Construct } from 'constructs';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as core from '../lib';

nodeunitShim({
  '._toCloudFormation': {
    'does not call renderProperties with an undefined value'(test: Test) {
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

    'renders "Properties" for a resource that has only properties set to "false"'(test: Test) {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      new core.CfnResource(stack, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {
          FakeProperty: false,
        },
      });

      test.deepEqual(app.synth().getStackByName(stack.stackName).template, {
        Resources: {
          Resource: {
            Type: 'Test::Resource::Fake',
            Properties: {
              FakeProperty: false,
            },
          },
        },
      });

      test.done();
    },
  },

  'applyRemovalPolicy default includes Update policy'(test: Test) {
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

  'can switch off updating Update policy'(test: Test) {
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

  'can add metadata'(test: Test) {
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

  'can read metadata'(test: Test) {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
    resource.addMetadata('Beep', 'Boop');

    // THEN
    expect(resource.getMetadata('Beep')).toEqual('Boop');

    test.done();
  },

  'subclasses can override "shouldSynthesize" to lazy-determine if the resource should be included'(test: Test) {
    // GIVEN
    class HiddenCfnResource extends core.CfnResource {
      protected shouldSynthesize() {
        return false;
      }
    }

    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const subtree = new Construct(stack, 'subtree');

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

  'CfnResource cannot be created outside Stack'(test: Test) {
    const app = new core.App();
    test.throws(() => {
      new core.CfnResource(app, 'Resource', {
        type: 'Some::Resource',
      });
    }, /should be created in the scope of a Stack, but no Stack found/);


    test.done();
  },

  /**
   * Stages start a new scope, which does not count as a Stack anymore
   */
  'CfnResource cannot be in Stage in Stack'(test: Test) {
    const app = new core.App();
    const stack = new core.Stack(app, 'Stack');
    const stage = new core.Stage(stack, 'Stage');
    test.throws(() => {
      new core.CfnResource(stage, 'Resource', {
        type: 'Some::Resource',
      });
    }, /should be created in the scope of a Stack, but no Stack found/);


    test.done();
  },
});
