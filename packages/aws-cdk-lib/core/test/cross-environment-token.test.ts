import { Construct } from 'constructs';
import { toCloudFormation } from './util';
import { App, CfnOutput, CfnResource, PhysicalName, Resource, Stack } from '../lib';

/* eslint-disable quote-props */

describe('cross environment', () => {
  describe('CrossEnvironmentToken', () => {
    test('can reference an ARN with a fixed physical name directly in a different account', () => {
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
      expect(toCloudFormation(stack2)).toEqual({
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
    });

    test('can reference a fixed physical name directly in a different account', () => {
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
      expect(toCloudFormation(stack2)).toEqual({
        Outputs: {
          Output: {
            Value: 'PhysicalName',
          },
        },
      });
    });

    test('can reference an ARN with an assigned physical name directly in a different account', () => {
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
      expect(toCloudFormation(stack2)).toEqual({
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
    });

    test('can reference an assigned physical name directly in a different account', () => {
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
      expect(toCloudFormation(stack2)).toEqual({
        Outputs: {
          Output: {
            Value: 'stack1stack1myresourcec54ced43683ebf9a3c4c',
          },
        },
      });
    });
  });

  test('cannot reference a deploy-time physical name across environments', () => {
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
    expect(() => toCloudFormation(stack2)).toThrow(
      /Cannot use resource 'Stack1\/MyResource' in a cross-environment fashion/);
  });

  test('can reference a deploy-time physical name across regions, when crossRegionReferences=true', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-1337',
      },
      crossRegionReferences: true,
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-42',
      },
      crossRegionReferences: true,
    });

    // WHEN
    const myResource = new MyResource(stack1, 'MyResource');
    new CfnOutput(stack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    const assembly = app.synth();
    const template1 = assembly.getStackByName(stack1.stackName).template;
    const template2 = assembly.getStackByName(stack2.stackName).template;

    expect(template1?.Resources).toMatchObject({
      'ExportsWriterbermudatriangle42E59594276156AC73': {
        'DeletionPolicy': 'Delete',
        'Properties': {
          'WriterProps': {
            'exports': {
              '/cdk/exports/Stack2/Stack1bermudatriangle1337RefMyResource6073B41F66B72887': {
                'Ref': 'MyResource6073B41F',
              },
            },
            'region': 'bermuda-triangle-42',
          },
          'ServiceToken': {
            'Fn::GetAtt': [
              'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
              'Arn',
            ],
          },
        },
        'Type': 'Custom::CrossRegionExportWriter',
        'UpdateReplacePolicy': 'Delete',
      },
    });
    expect(template2?.Outputs).toEqual({
      'Output': {
        'Value': {
          'Fn::GetAtt': [
            'ExportsReader8B249524',
            '/cdk/exports/Stack2/Stack1bermudatriangle1337RefMyResource6073B41F66B72887',
          ],
        },
      },
    });
  });

  test('cannot reference a deploy-time physical name across regions, when crossRegionReferences=false', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-1337',
      },
      crossRegionReferences: true,
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-42',
      },
      crossRegionReferences: false,
    });

    // WHEN
    const myResource = new MyResource(stack1, 'MyResource');
    new CfnOutput(stack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    expect(() => toCloudFormation(stack2)).toThrow(
      /Cannot use resource 'Stack1\/MyResource' in a cross-environment fashion/);
  });

  test('cross environment when stack is a substack', () => {
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

    expect(assembly.getStackByName(parentStack.stackName).template?.Resources).toEqual({
      ParentResource: {
        Type: 'Parent::Resource',
        Properties: {
          RefToChildResource: 'parentstackchildstack83c5ackchildresource852877eeb919bda2008e',
        },
      },
    });

    expect(assembly.getStackByName(childStack.stackName).template?.Resources).toEqual({
      ChildResource8C37244D: {
        Type: 'My::Resource',
        Properties: {
          resourceName: 'parentstackchildstack83c5ackchildresource852877eeb919bda2008e',
        },
      },
    });
  });
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
