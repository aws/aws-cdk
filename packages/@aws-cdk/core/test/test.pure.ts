import { Test } from 'nodeunit';
import { App, CfnResource, Construct, Stack } from '../lib';
import { pure } from '../lib/pure';
import { toCloudFormation } from './util';

//
function IaaC(node: Construct): Construct {
  return new CfnResource(node, 'IaaC', { type: 'MyResourceType' });
}

function Nested(node: Construct): Construct {
  const nest = new CfnResource(node, 'Nested', { type: 'MyNestedType' });
  pure.join(nest, IaaC);
  return nest;
}

//
export = {
  'join new IaaC block as a resource to stack'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    pure.join(stack, IaaC);

    test.deepEqual(toCloudFormation(stack),
      {
        Resources: {
          IaaC59A6C06B: { Type: 'MyResourceType' }
        }
      }
    );
    test.done();
  },

  'join new nested IaaC blocks'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    pure.join(stack, Nested);

    test.deepEqual(toCloudFormation(stack),
      {
        Resources: {
          NestedAA7BDD79: { Type: 'MyNestedType' },
          NestedIaaC765AB432: { Type: 'MyResourceType' },
        }
      }
    );
    test.done();
  },

  'join new IaaC block as a resource to app'(test: Test) {
    const app = new App();
    pure.add(app, IaaC);
    const response = app.synth();
    const stack = response.getStack('IaaC');

    test.deepEqual(stack.template,
      {
        Resources: {
          IaaC: { Type: 'MyResourceType' }
        }
      }
    );
    test.done();
  }
};
