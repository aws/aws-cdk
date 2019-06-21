import { Test } from 'nodeunit';
import { App, CfnOutput, Construct, PhysicalName, Resource, Stack } from '../lib';
import { toCloudFormation } from './util';

// tslint:disable:object-literal-key-quotes

export = {
  'CrossEnvironmentToken': {
    'can reference an ARN with a fixed physical name directly in a different account'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1', {
        env: {
          account: '123456789012',
        },
      });
      const myResource = new MyResource(stack1, 'MyResource', PhysicalName.of('PhysicalName'));

      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
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
        },
      });
      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
        },
      });

      // WHEN
      const myResource = new MyResource(stack1, 'MyResource', PhysicalName.of('PhysicalName'));
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
        },
      });
      const myResource = new MyResource(stack1, 'MyResource', PhysicalName.auto({ crossEnvironment: true }));

      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
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
                  ':myservice:::my-resource/stack1stack1myresourcec54ced43dab875fcfa49',
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
        },
      });
      const stack2 = new Stack(app, 'Stack2', {
        env: {
          account: '234567890123',
        },
      });

      // WHEN
      const myResource = new MyResource(stack1, 'MyResource', PhysicalName.auto({ crossEnvironment: true }));
      new CfnOutput(stack2, 'Output', {
        value: myResource.name,
      });

      // THEN
      test.deepEqual(toCloudFormation(stack2), {
        Outputs: {
          Output: {
            Value: 'stack1stack1myresourcec54ced43dab875fcfa49',
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
      },
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '234567890123',
      },
    });

    // WHEN
    const myResource = new MyResource(stack1, 'MyResource', PhysicalName.auto());
    new CfnOutput(stack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    test.throws(() => toCloudFormation(stack2),
      /Cannot use resource 'Stack1\/MyResource' in a cross-environment fashion, as it doesn't have a physical name set/);

    test.done();
  },
};

class MyResource extends Resource {
  public readonly arn: string;
  public readonly name: string;

  constructor(scope: Construct, id: string, physicalName: PhysicalName) {
    super(scope, id, {
      physicalName,
    });

    const resourceIdentifiers = this.getCrossEnvironmentAttributes({
      arn: 'simple-arn',
      name: 'simple-name',
      arnComponents: {
        region: '',
        account: '',
        resource:  'my-resource',
        resourceName: this.physicalName,
        service: 'myservice',
      },
    });
    this.arn = resourceIdentifiers.arn;
    this.name = resourceIdentifiers.name;
  }
}
