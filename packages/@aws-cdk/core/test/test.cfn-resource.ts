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
            Type: 'Test::Resource::Fake'
          }
        }
      });
      test.ok(called, `renderProperties must be called called`);

      test.done();
    }
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
        }
      }
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
      applyToUpdateReplacePolicy: false
    });

    // THEN
    test.deepEqual(app.synth().getStackByName(stack.stackName).template, {
      Resources: {
        DefaultResource: {
          Type: 'Test::Resource::Fake',
          DeletionPolicy: 'Retain',
        }
      }
    });

    test.done();
  },
});
