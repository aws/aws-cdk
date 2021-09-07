import * as core from '../lib';

describe('cfn resource', () => {
  describe('._toCloudFormation', () => {
    test('does not call renderProperties with an undefined value', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

      let called = false;
      (resource as any).renderProperties = (val: any) => {
        called = true;
        expect(val).not.toBeNull();
      };

      expect(app.synth().getStackByName(stack.stackName).template).toEqual({
        Resources: {
          DefaultResource: {
            Type: 'Test::Resource::Fake',
          },
        },
      });
      expect(called).toEqual(true);


    });

    test('renders "Properties" for a resource that has only properties set to "false"', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      new core.CfnResource(stack, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {
          FakeProperty: false,
        },
      });

      expect(app.synth().getStackByName(stack.stackName).template).toEqual({
        Resources: {
          Resource: {
            Type: 'Test::Resource::Fake',
            Properties: {
              FakeProperty: false,
            },
          },
        },
      });


    });
  });

  test('applyRemovalPolicy default includes Update policy', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN);

    // THEN
    expect(app.synth().getStackByName(stack.stackName).template).toEqual({
      Resources: {
        DefaultResource: {
          Type: 'Test::Resource::Fake',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });


  });

  test('can switch off updating Update policy', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN, {
      applyToUpdateReplacePolicy: false,
    });

    // THEN
    expect(app.synth().getStackByName(stack.stackName).template).toEqual({
      Resources: {
        DefaultResource: {
          Type: 'Test::Resource::Fake',
          DeletionPolicy: 'Retain',
        },
      },
    });


  });

  test('can add metadata', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.addMetadata('Beep', 'Boop');

    // THEN
    expect(app.synth().getStackByName(stack.stackName).template).toEqual({
      Resources: {
        DefaultResource: {
          Type: 'Test::Resource::Fake',
          Metadata: {
            Beep: 'Boop',
          },
        },
      },
    });


  });

  test('can read metadata', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
    resource.addMetadata('Beep', 'Boop');

    // THEN
    expect(resource.getMetadata('Beep')).toEqual('Boop');


  });

  test('subclasses can override "shouldSynthesize" to lazy-determine if the resource should be included', () => {
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
    expect(app.synth().getStackByName(stack.stackName).template).toEqual({
      Resources: { R2: { Type: 'Foo::R2' } },

      // No DependsOn!
    });


  });

  test('CfnResource cannot be created outside Stack', () => {
    const app = new core.App();
    expect(() => {
      new core.CfnResource(app, 'Resource', {
        type: 'Some::Resource',
      });
    }).toThrow(/should be created in the scope of a Stack, but no Stack found/);


  });

  /**
   * Stages start a new scope, which does not count as a Stack anymore
   */
  test('CfnResource cannot be in Stage in Stack', () => {
    const app = new core.App();
    const stack = new core.Stack(app, 'Stack');
    const stage = new core.Stage(stack, 'Stage');
    expect(() => {
      new core.CfnResource(stage, 'Resource', {
        type: 'Some::Resource',
      });
    }).toThrow(/should be created in the scope of a Stack, but no Stack found/);


  });
});
