import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, CfnOutput, CfnResource, Construct, PhysicalName, Resource, Stack } from '../lib';
import { toCloudFormation } from './util';

/* eslint-disable quote-props */

nodeunitShim({
  'CrossEnvironmentToken': {
    'can reference an ARN with a fixed physical name directly in a different account'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1', {
        env: {
          account: '123456789012',
          region: 'bermuda-triangle-1337',
        },
      });
      const myResource = new MyResource(stack1, 'MyResource', 'PhysicalName');

      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
          region: 'bermuda-triangle-42',
        },
      });

      // WHEN
      new CfnOutput(stack2, 'Output', {
        value: myResource.arn,
      });

      // THEN
      test.deepEqual(toCloudFormation(stack2), {
        Outputs: {
          Output: {
            Value: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':myservice:::my-resource/PhysicalName',
                ],
              ],
            },
          },
        },
      });

      test.done();
    },

    'can reference a fixed physical name directly in a different account'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1', {
        env: {
          account: '123456789012',
          region: 'bermuda-triangle-1337',
        },
      });
      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
          region: 'bermuda-triangle-42',
        },
      });

      // WHEN
      const myResource = new MyResource(stack1, 'MyResource', 'PhysicalName');
      new CfnOutput(stack2, 'Output', {
        value: myResource.name,
      });

      // THEN
      test.deepEqual(toCloudFormation(stack2), {
        Outputs: {
          Output: {
            Value: 'PhysicalName',
          },
        },
      });

      test.done();
    },

    'can reference an ARN with an assigned physical name directly in a different account'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1', {
        env: {
          account: '123456789012',
          region: 'bermuda-triangle-1337',
        },
      });
      const myResource = new MyResource(stack1, 'MyResource', PhysicalName.GENERATE_IF_NEEDED);

      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
          region: 'bermuda-triangle-42',
        },
      });

      // WHEN
      new CfnOutput(stack2, 'Output', {
        value: myResource.arn,
      });

      // THEN
      test.deepEqual(toCloudFormation(stack2), {
        Outputs: {
          Output: {
            Value: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':myservice:::my-resource/stack1stack1myresourcec54ced43683ebf9a3c4c',
                ],
              ],
            },
          },
        },
      });

      test.done();
    },

    'can reference an assigned physical name directly in a different account'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1', {
        env: {
          account: '123456789012',
          region: 'bermuda-triangle-1337',
        },
      });
      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
          region: 'bermuda-triangle-42',
        },
      });

      // WHEN
      const myResource = new MyResource(stack1, 'MyResource', PhysicalName.GENERATE_IF_NEEDED);
      new CfnOutput(stack2, 'Output', {
        value: myResource.name,
      });

      // THEN
      test.deepEqual(toCloudFormation(stack2), {
        Outputs: {
          Output: {
            Value: 'stack1stack1myresourcec54ced43683ebf9a3c4c',
          },
        },
      });

      test.done();
    },
  },

  'cannot reference a deploy-time physical name across environments'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-1337',
      },
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '234567890123',
        region: 'bermuda-triangle-42',
      },
    });

    // WHEN
    const myResource = new MyResource(stack1, 'MyResource');
    new CfnOutput(stack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    test.throws(() => toCloudFormation(stack2),
      /Cannot use resource 'Stack1\/MyResource' in a cross-environment fashion/);

    test.done();
  },

  'cross environment when stack is a substack'(test: Test) {
    const app = new App();

    const parentStack = new Stack(app, 'ParentStack', {
      env: { account: '112233', region: 'us-east-1' },
    });

    const childStack = new Stack(parentStack, 'ChildStack', {
      env: { account: '998877', region: 'eu-west-2' },
    });

    const childResource = new MyResource(childStack, 'ChildResource', PhysicalName.GENERATE_IF_NEEDED);

    new CfnResource(parentStack, 'ParentResource', {
      type: 'Parent::Resource',
      properties: {
        RefToChildResource: childResource.name,
      },
    });

    const assembly = app.synth();

    test.deepEqual(assembly.getStackByName(parentStack.stackName).template, {
      Resources: {
        ParentResource: {
          Type: 'Parent::Resource',
          Properties: {
            RefToChildResource: 'parentstackchildstack83c5ackchildresource852877eeb919bda2008e',
          },
        },
      },
    });

    test.deepEqual(assembly.getStackByName(childStack.stackName).template, {
      Resources: {
        ChildResource8C37244D: {
          Type: 'My::Resource',
          Properties: {
            resourceName: 'parentstackchildstack83c5ackchildresource852877eeb919bda2008e',
          },
        },
      },
    });

    test.done();
  },
});

test.each([undefined, 'SomeName'])('stack.exportValue() on name attributes with PhysicalName=%s', physicalName => {
  // Check that automatic exports and manual exports look the same
  // GIVEN - auto
  const appA = new App();
  const producerA = new Stack(appA, 'Producer');
  const resourceA = new MyResource(producerA, 'Resource', physicalName);

  const consumerA = new Stack(appA, 'Consumer');
  new CfnOutput(consumerA, 'ConsumeName', { value: resourceA.name });
  new CfnOutput(consumerA, 'ConsumeArn', { value: resourceA.arn });

  // WHEN - manual
  const appM = new App();
  const producerM = new Stack(appM, 'Producer');
  const resourceM = new MyResource(producerM, 'Resource', physicalName);
  producerM.exportValue(resourceM.name);
  producerM.exportValue(resourceM.arn);

  // THEN - producers are the same
  const templateA = appA.synth().getStackByName(producerA.stackName).template;
  const templateM = appM.synth().getStackByName(producerM.stackName).template;

  expect(templateA).toEqual(templateM);
});

test('can instantiate resource with constructed physicalname ARN', () => {
  const stack = new Stack();
  new MyResourceWithConstructedArnAttribute(stack, 'Resource');
});

class MyResource extends Resource {
  public readonly arn: string;
  public readonly name: string;

  constructor(scope: Construct, id: string, physicalName?: string) {
    super(scope, id, { physicalName });

    const res = new CfnResource(this, 'Resource', {
      type: 'My::Resource',
      properties: {
        resourceName: this.physicalName,
      },
    });

    this.name = this.getResourceNameAttribute(res.ref.toString());
    this.arn = this.getResourceArnAttribute(res.getAtt('Arn').toString(), {
      region: '',
      account: '',
      resource: 'my-resource',
      resourceName: this.physicalName,
      service: 'myservice',
    });
  }
}

/**
 * Some resources build their own Arn attribute by constructing strings
 *
 * This will be because the L1 doesn't expose a `{ Fn::GetAtt: ['Arn'] }`.
 *
 * They won't be able to `exportValue()` it, but it shouldn't crash.
 */
class MyResourceWithConstructedArnAttribute extends Resource {
  public readonly arn: string;
  public readonly name: string;

  constructor(scope: Construct, id: string, physicalName?: string) {
    super(scope, id, { physicalName });

    const res = new CfnResource(this, 'Resource', {
      type: 'My::Resource',
      properties: {
        resourceName: this.physicalName,
      },
    });

    this.name = this.getResourceNameAttribute(res.ref.toString());
    this.arn = this.getResourceArnAttribute(Stack.of(this).formatArn({
      resource: 'my-resource',
      resourceName: res.ref.toString(),
      service: 'myservice',
    }), {
      resource: 'my-resource',
      resourceName: this.physicalName,
      service: 'myservice',
    });
  }
}
