import nodeunit = require('nodeunit');
import core = require('../lib');

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

      test.deepEqual(app.synth().getStack(stack.stackName).template, {
        Resources: {
          DefaultResource: {
            Type: 'Test::Resource::Fake'
          }
        }
      });
      test.ok(called, `renderProperties must be called called`);

      test.done();
    }
  }
});
