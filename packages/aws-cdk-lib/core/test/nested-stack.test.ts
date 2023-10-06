import * as path from 'path';
import { Construct } from 'constructs';
import { readFileSync } from 'fs-extra';
import { toCloudFormation } from './util';
import {
  Stack, NestedStack, CfnStack, Resource, CfnResource, App, CfnOutput,
} from '../lib';

describe('nested-stack', () => {
  test('a nested-stack has a defaultChild', () => {
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack');
    var cfn_nestedStack = (nestedStack.node.defaultChild) as CfnStack;
    cfn_nestedStack.addPropertyOverride('TemplateURL', 'http://my-url.com');
    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        MyNestedStackNestedStackMyNestedStackNestedStackResource9C617903: {
          DeletionPolicy: 'Delete',
          Properties: {
            TemplateURL: 'http://my-url.com',
          },
          Type: 'AWS::CloudFormation::Stack',
          UpdateReplacePolicy: 'Delete',
        },
      },
    });
  });
  test('a nested-stack has a description in templateOptions.', () => {
    const description = 'This is a description.';
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack', {
      description,
    });

    expect(nestedStack.templateOptions.description).toEqual(description);
  });

  test('can create cross region references when crossRegionReferences=true', () => {
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
    const nestedStack = new NestedStack(stack1, 'Nested1');
    const nestedStack2 = new NestedStack(stack2, 'Nested2');

    // WHEN
    const myResource = new MyResource(nestedStack, 'Resource1');

    new CfnResource(nestedStack2, 'Resource2', {
      type: 'My::Resource',
      properties: {
        Prop1: myResource.name,
      },
    });

    // THEN
    const assembly = app.synth();
    const nestedTemplate2 = JSON.parse(readFileSync(path.join(assembly.directory, `${nestedStack2.artifactId}.nested.template.json`), 'utf8'));
    expect(nestedTemplate2).toMatchObject({
      Resources: {
        Resource2: {
          Properties: {
            Prop1: {
              Ref: 'referencetoStack2ExportsReader861D07DCcdkexportsStack2Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E',
            },
          },
          Type: 'My::Resource',
        },
      },
    });
    const template2 = assembly.getStackByName(stack2.stackName).template;
    expect(template2?.Resources).toMatchObject({
      ExportsReader8B249524: {
        DeletionPolicy: 'Delete',
        Properties: {
          ReaderProps: {
            imports: {
              '/cdk/exports/Stack2/Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E': '{{resolve:ssm:/cdk/exports/Stack2/Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E}}',
            },
            region: 'bermuda-triangle-42',
            prefix: 'Stack2',
          },
          ServiceToken: {
            'Fn::GetAtt': [
              'CustomCrossRegionExportReaderCustomResourceProviderHandler46647B68',
              'Arn',
            ],
          },
        },
        Type: 'Custom::CrossRegionExportReader',
        UpdateReplacePolicy: 'Delete',
      },
    });
    const template1 = assembly.getStackByName(stack1.stackName).template;
    const nestedTemplate1 = JSON.parse(readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8'));
    expect(nestedTemplate1?.Outputs).toEqual({
      Stack1Nested1Resource178AEB067Ref: {
        Value: {
          Ref: 'Resource1CCD41AB7',
        },
      },
    });

    expect(template1?.Resources).toMatchObject({
      ExportsWriterbermudatriangle42E59594276156AC73: {
        DeletionPolicy: 'Delete',
        Properties: {
          WriterProps: {
            exports: {
              '/cdk/exports/Stack2/Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E': {
                'Fn::GetAtt': [
                  'Nested1NestedStackNested1NestedStackResourceCD0AD36B',
                  'Outputs.Stack1Nested1Resource178AEB067Ref',
                ],
              },
            },
            region: 'bermuda-triangle-42',
          },
          ServiceToken: {
            'Fn::GetAtt': [
              'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
              'Arn',
            ],
          },
        },
        Type: 'Custom::CrossRegionExportWriter',
        UpdateReplacePolicy: 'Delete',
      },
    });
  });

  test('cannot create cross region references when crossRegionReferences=false', () => {
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
        account: '123456789012',
        region: 'bermuda-triangle-42',
      },
    });
    const nestedStack = new NestedStack(stack1, 'MyNestedStack');

    // WHEN
    const myResource = new MyResource(nestedStack, 'MyResource');
    new CfnOutput(stack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    expect(() => toCloudFormation(stack2)).toThrow(
      /Cannot use resource 'Stack1\/MyNestedStack\/MyResource' in a cross-environment fashion/);
  });
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
