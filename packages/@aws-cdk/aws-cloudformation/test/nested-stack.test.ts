import * as fs from 'fs';
import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as sns from '@aws-cdk/aws-sns';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, CfnParameter, CfnResource, ContextProvider, LegacyStackSynthesizer, Names, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { NestedStack } from '../lib/nested-stack';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/* eslint-disable @aws-cdk/no-core-construct */
/* eslint-disable max-len */

describeDeprecated('NestedStack', () => {
  test('fails if defined as a root', () => {
    // THEN
    expect(() => new NestedStack(undefined as any, 'boom')).toThrow(/Nested stacks cannot be defined as a root construct/);
  });

  test('fails if defined without a parent stack', () => {
    // GIVEN
    const app = new App();
    const group = new Construct(app, 'group');

    // THEN
    expect(() => new NestedStack(app, 'boom')).toThrow(/must be defined within scope of another non-nested stack/);
    expect(() => new NestedStack(group, 'bam')).toThrow(/must be defined within scope of another non-nested stack/);
  });

  test('can be defined as a direct child or an indirect child of a Stack', () => {
    // GIVEN
    const parent = new Stack();

    // THEN
    expect(() => new NestedStack(parent, 'direct')).not.toThrow();
    expect(() => new NestedStack(new Construct(parent, 'group'), 'indirect')).not.toThrow();
  });

  test('nested stack is not synthesized as a stack artifact into the assembly', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parentStack = new Stack(app, 'parent-stack');
    new NestedStack(parentStack, 'nested-stack');

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(assembly.artifacts.length).toEqual(2);
  });

  test('the template of the nested stack is synthesized into the cloud assembly', () => {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'parent-stack');
    const nested = new NestedStack(parent, 'nested-stack');
    new CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });

    // WHEN
    const assembly = app.synth();

    // THEN
    const template = JSON.parse(fs.readFileSync(path.join(assembly.directory, `${Names.uniqueId(nested)}.nested.template.json`), 'utf-8'));
    expect(template).toEqual({
      Resources: {
        ResourceInNestedStack: {
          Type: 'AWS::Resource::Nested',
        },
      },
    });
  });

  test('file asset metadata is associated with the parent stack', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parent = new Stack(app, 'parent-stack');
    const nested = new NestedStack(parent, 'nested-stack');
    new CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(assembly.getStackByName(parent.stackName).assets).toEqual([{
      path: 'parentstacknestedstack844892C0.nested.template.json',
      id: 'c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096',
      packaging: 'file',
      sourceHash: 'c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096',
      s3BucketParameter: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3BucketDA8C3345',
      s3KeyParameter: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6',
      artifactHashParameter: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096ArtifactHash8DE450C7',
    }]);
  });

  test('aws::cloudformation::stack is synthesized in the parent scope', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parent = new Stack(app, 'parent-stack');

    // WHEN
    const nested = new NestedStack(parent, 'nested-stack');
    new CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });

    // THEN
    const assembly = app.synth();

    // assembly has one stack (the parent)
    expect(assembly.stacks.length).toEqual(1);

    // but this stack has an asset that points to the synthesized template
    expect(assembly.stacks[0].assets[0].path).toEqual('parentstacknestedstack844892C0.nested.template.json');

    // the template includes our resource
    const filePath = path.join(assembly.directory, assembly.stacks[0].assets[0].path);
    expect(JSON.parse(fs.readFileSync(filePath).toString('utf-8'))).toEqual({
      Resources: { ResourceInNestedStack: { Type: 'AWS::Resource::Nested' } },
    });

    // the parent template includes the parameters and the nested stack resource which points to the s3 url
    Template.fromStack(parent).templateMatches({
      Resources: {
        nestedstackNestedStacknestedstackNestedStackResource71CDD241: {
          Type: 'AWS::CloudFormation::Stack',
          DeletionPolicy: 'Delete',
          UpdateReplacePolicy: 'Delete',
          Properties: {
            TemplateURL: {
              'Fn::Join': [
                '',
                [
                  'https://s3.',
                  {
                    Ref: 'AWS::Region',
                  },
                  '.',
                  {
                    Ref: 'AWS::URLSuffix',
                  },
                  '/',
                  {
                    Ref: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3BucketDA8C3345',
                  },
                  '/',
                  {
                    'Fn::Select': [
                      0,
                      {
                        'Fn::Split': [
                          '||',
                          {
                            Ref: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    'Fn::Select': [
                      1,
                      {
                        'Fn::Split': [
                          '||',
                          {
                            Ref: 'AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6',
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          },
        },
      },
      Parameters: {
        AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3BucketDA8C3345: {
          Type: 'String',
          Description: 'S3 bucket for asset "c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096"',
        },
        AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096S3VersionKey09D03EE6: {
          Type: 'String',
          Description: 'S3 key for asset version "c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096"',
        },
        AssetParametersc639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096ArtifactHash8DE450C7: {
          Type: 'String',
          Description: 'Artifact hash for asset "c639c0a5e7320758aa22589669ecebc98f185b711300b074f53998c8f9a45096"',
        },
      },
    });
  });

  test('Stack.of()', () => {
    class MyNestedStack extends NestedStack {
      public readonly stackOfChild: Stack;

      constructor(scope: Construct, id: string) {
        super(scope, id);

        const param = new CfnParameter(this, 'param', { type: 'String' });
        this.stackOfChild = Stack.of(param);
      }
    }

    const parent = new Stack();
    const nested = new MyNestedStack(parent, 'nested');

    expect(nested.stackOfChild).toEqual(nested);
    expect(Stack.of(nested)).toEqual(nested);
  });

  test('references within the nested stack are not reported as cross stack references', () => {
    class MyNestedStack extends NestedStack {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        const param = new CfnParameter(this, 'param', { type: 'String' });
        new CfnResource(this, 'resource', {
          type: 'My::Resource',
          properties: {
            SomeProp: param.valueAsString,
          },
        });
      }
    }

    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parent = new Stack(app, 'parent');

    new MyNestedStack(parent, 'nested');

    // references are added during "prepare"
    const assembly = app.synth();

    expect(assembly.stacks.length).toEqual(1);
    expect(assembly.stacks[0].dependencies).toEqual([]);
  });

  test('references to a resource from the parent stack in a nested stack is translated into a cfn parameter', () => {
    // WHEN
    class MyNestedStack extends NestedStack {

      constructor(scope: Construct, id: string, resourceFromParent: CfnResource) {
        super(scope, id);

        new CfnResource(this, 'resource', {
          type: 'AWS::Child::Resource',
          properties: {
            ReferenceToResourceInParentStack: resourceFromParent.ref,
          },
        });

        new CfnResource(this, 'resource2', {
          type: 'My::Resource::2',
          properties: {
            Prop1: resourceFromParent.getAtt('Attr'),
            Prop2: resourceFromParent.ref,
          },
        });
      }
    }

    const app = new App();
    const parentStack = new Stack(app, 'parent');

    const resource = new CfnResource(parentStack, 'parent-resource', { type: 'AWS::Parent::Resource' });

    const nested = new MyNestedStack(parentStack, 'nested', resource);

    // THEN
    app.synth();

    // nested template should use a parameter to reference the resource from the parent stack
    Template.fromStack(nested).templateMatches({
      Resources:
      {
        resource:
        {
          Type: 'AWS::Child::Resource',
          Properties:
            { ReferenceToResourceInParentStack: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' } },
        },
        resource2:
        {
          Type: 'My::Resource::2',
          Properties:
          {
            Prop1: { Ref: 'referencetoparentparentresourceD56EA8F7Attr' },
            Prop2: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' },
          },
        },
      },
      Parameters:
      {
        referencetoparentparentresourceD56EA8F7Ref: { Type: 'String' },
        referencetoparentparentresourceD56EA8F7Attr: { Type: 'String' },
      },
    });

    // parent template should pass in the value through the parameter
    Template.fromStack(parentStack).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetoparentparentresourceD56EA8F7Ref: {
          Ref: 'parentresource',
        },
        referencetoparentparentresourceD56EA8F7Attr: {
          'Fn::GetAtt': [
            'parentresource',
            'Attr',
          ],
        },
      },
    });
  });

  test('references to a resource in the nested stack in the parent is translated into a cfn output', () => {
    class MyNestedStack extends NestedStack {
      public readonly resourceFromChild: CfnResource;

      constructor(scope: Construct, id: string) {
        super(scope, id);

        this.resourceFromChild = new CfnResource(this, 'resource', {
          type: 'AWS::Child::Resource',
        });
      }
    }

    const app = new App();
    const parentStack = new Stack(app, 'parent');

    const nested = new MyNestedStack(parentStack, 'nested');

    new CfnResource(parentStack, 'another-parent-resource', {
      type: 'AWS::Parent::Resource',
      properties: {
        RefToResourceInNestedStack: nested.resourceFromChild.ref,
      },
    });

    // references are added during "prepare"
    app.synth();

    // nested template should use a parameter to reference the resource from the parent stack
    Template.fromStack(nested).templateMatches({
      Resources: {
        resource: { Type: 'AWS::Child::Resource' },
      },
      Outputs: {
        parentnestedresource4D680677Ref: { Value: { Ref: 'resource' } },
      },
    });

    // parent template should pass in the value through the parameter
    Template.fromStack(parentStack).hasResourceProperties('AWS::Parent::Resource', {
      RefToResourceInNestedStack: {
        'Fn::GetAtt': [
          'nestedNestedStacknestedNestedStackResource3DD143BF',
          'Outputs.parentnestedresource4D680677Ref',
        ],
      },
    });
  });

  test('nested stack references a resource from another non-nested stack (not the parent)', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');
    const nestedUnderStack1 = new NestedStack(stack1, 'NestedUnderStack1');
    const resourceInStack2 = new CfnResource(stack2, 'ResourceInStack2', { type: 'MyResource' });

    // WHEN
    new CfnResource(nestedUnderStack1, 'ResourceInNestedStack1', {
      type: 'Nested::Resource',
      properties: {
        RefToSibling: resourceInStack2.getAtt('MyAttribute'),
      },
    });

    // THEN
    const assembly = app.synth();

    // producing stack should have an export
    Template.fromStack(stack2).templateMatches({
      Resources: {
        ResourceInStack2: { Type: 'MyResource' },
      },
      Outputs: {
        ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009: {
          Value: { 'Fn::GetAtt': ['ResourceInStack2', 'MyAttribute'] },
          Export: { Name: 'Stack2:ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009' },
        },
      },
    });

    // nested stack uses Fn::ImportValue like normal
    Template.fromStack(nestedUnderStack1).templateMatches({
      Resources: {
        ResourceInNestedStack1: {
          Type: 'Nested::Resource',
          Properties: {
            RefToSibling: {
              'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009',
            },
          },
        },
      },
    });

    // verify a depedency was established between the parents
    const stack1Artifact = assembly.getStackByName(stack1.stackName);
    const stack2Artifact = assembly.getStackByName(stack2.stackName);
    expect(stack1Artifact.dependencies.length).toEqual(1);
    expect(stack2Artifact.dependencies.length).toEqual(0);
    expect(stack1Artifact.dependencies[0]).toEqual(stack2Artifact);
  });

  test('nested stack within a nested stack references a resource in a sibling top-level stack', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const consumerTopLevel = new Stack(app, 'ConsumerTopLevel');
    const consumerNested1 = new NestedStack(consumerTopLevel, 'ConsumerNested1');
    const consumerNested2 = new NestedStack(consumerNested1, 'ConsumerNested2');
    const producerTopLevel = new Stack(app, 'ProducerTopLevel');
    const producer = new CfnResource(producerTopLevel, 'Producer', { type: 'Producer' });

    // WHEN
    new CfnResource(consumerNested2, 'Consumer', {
      type: 'Consumer',
      properties: {
        Ref: producer.ref,
      },
    });

    // THEN
    const manifest = app.synth();
    const consumerDeps = manifest.getStackArtifact(consumerTopLevel.artifactId).dependencies.map(d => d.id);
    expect(consumerDeps).toEqual(['ProducerTopLevel']);
  });

  test('another non-nested stack takes a reference on a resource within the nested stack (the parent exports)', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');
    const nestedUnderStack1 = new NestedStack(stack1, 'NestedUnderStack1');
    const resourceInNestedStack = new CfnResource(nestedUnderStack1, 'ResourceInNestedStack', { type: 'MyResource' });

    // WHEN
    new CfnResource(stack2, 'ResourceInStack2', {
      type: 'JustResource',
      properties: {
        RefToSibling: resourceInNestedStack.getAtt('MyAttribute'),
      },
    });

    // THEN
    const assembly = app.synth();

    // nested stack should output this value as if it was referenced by the parent (without the export)
    Template.fromStack(nestedUnderStack1).templateMatches({
      Resources: {
        ResourceInNestedStack: {
          Type: 'MyResource',
        },
      },
      Outputs: {
        Stack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute: {
          Value: {
            'Fn::GetAtt': [
              'ResourceInNestedStack',
              'MyAttribute',
            ],
          },
        },
      },
    });

    // parent stack (stack1) should export this value
    expect(assembly.getStackByName(stack1.stackName).template.Outputs).toEqual({
      ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3: {
        Value: { 'Fn::GetAtt': ['NestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305B', 'Outputs.Stack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute'] },
        Export: { Name: 'Stack1:ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3' },
      },
    });

    // consuming stack should use ImportValue to import the value from the parent stack
    Template.fromStack(stack2).templateMatches({
      Resources: {
        ResourceInStack2: {
          Type: 'JustResource',
          Properties: {
            RefToSibling: {
              'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3',
            },
          },
        },
      },
    });

    expect(assembly.stacks.length).toEqual(2);
    const stack1Artifact = assembly.getStackByName(stack1.stackName);
    const stack2Artifact = assembly.getStackByName(stack2.stackName);
    expect(stack1Artifact.dependencies.length).toEqual(0);
    expect(stack2Artifact.dependencies.length).toEqual(1);
    expect(stack2Artifact.dependencies[0]).toEqual(stack1Artifact);
  });

  test('references between sibling nested stacks should output from one and getAtt from the other', () => {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'Parent');
    const nested1 = new NestedStack(parent, 'Nested1');
    const nested2 = new NestedStack(parent, 'Nested2');
    const resource1 = new CfnResource(nested1, 'Resource1', { type: 'Resource1' });

    // WHEN
    new CfnResource(nested2, 'Resource2', {
      type: 'Resource2',
      properties: {
        RefToResource1: resource1.ref,
      },
    });

    // THEN
    app.synth();

    // producing nested stack
    Template.fromStack(nested1).templateMatches({
      Resources: {
        Resource1: {
          Type: 'Resource1',
        },
      },
      Outputs: {
        ParentNested1Resource15F3F0657Ref: {
          Value: {
            Ref: 'Resource1',
          },
        },
      },
    });

    // consuming nested stack
    Template.fromStack(nested2).templateMatches({
      Resources: {
        Resource2: {
          Type: 'Resource2',
          Properties: {
            RefToResource1: {
              Ref: 'referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref',
            },
          },
        },
      },
      Parameters: {
        referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref: {
          Type: 'String',
        },
      },
    });

    // parent
    Template.fromStack(parent).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref: {
          'Fn::GetAtt': [
            'Nested1NestedStackNested1NestedStackResourceCD0AD36B',
            'Outputs.ParentNested1Resource15F3F0657Ref',
          ],
        },
      },
    });
  });

  test('stackId returns AWS::StackId when referenced from the context of the nested stack', () => {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(nested, 'NestedResource', {
      type: 'Nested::Resource',
      properties: { MyStackId: nested.stackId },
    });

    // THEN
    Template.fromStack(nested).hasResourceProperties('Nested::Resource', {
      MyStackId: { Ref: 'AWS::StackId' },
    });
  });

  test('stackId returns the REF of the CloudFormation::Stack resource when referenced from the parent stack', () => {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(parent, 'ParentResource', {
      type: 'Parent::Resource',
      properties: { NestedStackId: nested.stackId },
    });

    // THEN
    Template.fromStack(parent).hasResourceProperties('Parent::Resource', {
      NestedStackId: { Ref: 'NestedStackNestedStackNestedStackNestedStackResourceB70834FD' },
    });
  });

  test('stackName returns AWS::StackName when referenced from the context of the nested stack', () => {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(nested, 'NestedResource', {
      type: 'Nested::Resource',
      properties: { MyStackName: nested.stackName },
    });

    // THEN
    Template.fromStack(nested).hasResourceProperties('Nested::Resource', {
      MyStackName: { Ref: 'AWS::StackName' },
    });
  });

  test('stackName returns the REF of the CloudFormation::Stack resource when referenced from the parent stack', () => {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(parent, 'ParentResource', {
      type: 'Parent::Resource',
      properties: { NestedStackName: nested.stackName },
    });

    // THEN
    Template.fromStack(parent).hasResourceProperties('Parent::Resource', {
      NestedStackName: {
        'Fn::Select': [
          1,
          {
            'Fn::Split': [
              '/',
              {
                Ref: 'NestedStackNestedStackNestedStackNestedStackResourceB70834FD',
              },
            ],
          },
        ],
      },
    });
  });

  test('"account", "region" and "environment" are all derived from the parent', () => {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'ParentStack', { env: { account: '1234account', region: 'us-east-44' } });

    // WHEN
    const nested = new NestedStack(parent, 'NestedStack');

    // THEN
    expect(nested.environment).toEqual(parent.environment);
    expect(nested.account).toEqual(parent.account);
    expect(nested.region).toEqual(parent.region);
  });

  test('double-nested stack', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parent = new Stack(app, 'stack');

    // WHEN
    const nested1 = new NestedStack(parent, 'Nested1');
    const nested2 = new NestedStack(nested1, 'Nested2');

    new CfnResource(nested1, 'Resource1', { type: 'Resource::1' });
    new CfnResource(nested2, 'Resource2', { type: 'Resource::2' });

    // THEN
    const assembly = app.synth();

    // nested2 is a "leaf", so it's just the resource
    Template.fromStack(nested2).templateMatches({
      Resources: {
        Resource2: { Type: 'Resource::2' },
      },
    });

    const middleStackHash = '7c426f7299a739900279ac1ece040397c1913cdf786f5228677b289f4d5e4c48';
    const bucketSuffix = 'C706B101';
    const versionSuffix = '4B193AA5';
    const hashSuffix = 'E28F0693';

    // nested1 wires the nested2 template through parameters, so we expect those
    const nested1Template = Template.fromStack(nested1);
    nested1Template.resourceCountIs('Resource::1', 1);
    const nested2Template = nested1Template.toJSON();
    expect(nested2Template.Parameters).toEqual({
      referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketE8768F5CRef: { Type: 'String' },
      referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey49DD83A2Ref: { Type: 'String' },
    });

    // parent stack should have two sets of parameters. one for the first nested stack and the second
    // for the second nested stack, passed in as parameters to the first
    const template = Template.fromStack(parent).toJSON();
    expect(template.Parameters).toEqual({
      AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketDE3B88D6: { Type: 'String', Description: 'S3 bucket for asset "8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235c"' },
      AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey3A62EFEA: { Type: 'String', Description: 'S3 key for asset version "8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235c"' },
      AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cArtifactHash7DC546E0: { Type: 'String', Description: 'Artifact hash for asset "8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235c"' },
      [`AssetParameters${middleStackHash}S3Bucket${bucketSuffix}`]: { Type: 'String', Description: `S3 bucket for asset "${middleStackHash}"` },
      [`AssetParameters${middleStackHash}S3VersionKey${versionSuffix}`]: { Type: 'String', Description: `S3 key for asset version "${middleStackHash}"` },
      [`AssetParameters${middleStackHash}ArtifactHash${hashSuffix}`]: { Type: 'String', Description: `Artifact hash for asset "${middleStackHash}"` },
    });

    // proxy asset params to nested stack
    Template.fromStack(parent).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketE8768F5CRef: { Ref: 'AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3BucketDE3B88D6' },
        referencetostackAssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey49DD83A2Ref: { Ref: 'AssetParameters8169c6f8aaeaf5e2e8620f5f895ffe2099202ccb4b6889df48fe0967a894235cS3VersionKey3A62EFEA' },
      },
    });

    // parent stack should have 2 assets
    expect(assembly.getStackByName(parent.stackName).assets.length).toEqual(2);
  });

  test('reference resource in a double nested stack (#15155)', () => {
    // GIVEN
    const app = new App();
    const producerStack = new Stack(app, 'Producer');
    const nested2 = new NestedStack(new NestedStack(producerStack, 'Nested1'), 'Nested2');
    const producerResource = new CfnResource(nested2, 'Resource', { type: 'MyResource' });
    const consumerStack = new Stack(app, 'Consumer');

    // WHEN
    new CfnResource(consumerStack, 'ConsumingResource', {
      type: 'YourResource',
      properties: { RefToResource: producerResource.ref },
    });

    // THEN
    const casm = app.synth(); // before #15155 was fixed this threw an error

    const producerTemplate = casm.getStackArtifact(producerStack.artifactId).template;
    const consumerTemplate = casm.getStackArtifact(consumerStack.artifactId).template;

    // check that the consuming resource references the expected export name
    const outputName = 'ExportsOutputFnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsProducerNested1Nested2NestedStackNested2NestedStackResource1E6FA3C3OutputsProducerNested1Nested238A89CC5Ref2E9E52EA';
    const exportName = producerTemplate.Outputs[outputName].Export.Name;
    const importName = consumerTemplate.Resources.ConsumingResource.Properties.RefToResource['Fn::ImportValue'];
    expect(exportName).toEqual(importName);
  });

  test('assets within nested stacks are proxied from the parent', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parent = new Stack(app, 'ParentStack');
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    const asset = new s3_assets.Asset(nested, 'asset', {
      path: path.join(__dirname, 'asset-fixture.txt'),
    });

    new CfnResource(nested, 'NestedResource', {
      type: 'Nested::Resource',
      properties: {
        AssetBucket: asset.s3BucketName,
        AssetKey: asset.s3ObjectKey,
      },
    });

    // THEN
    const assembly = app.synth();
    const template = Template.fromStack(parent).toJSON();

    // two sets of asset parameters: one for the nested stack itself and one as a proxy for the asset within the stack
    expect(template.Parameters).toEqual({
      AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3BucketC188F637: { Type: 'String', Description: 'S3 bucket for asset "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
      AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyC7F4DBF2: { Type: 'String', Description: 'S3 key for asset version "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
      AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281ArtifactHash373B14D2: { Type: 'String', Description: 'Artifact hash for asset "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
      AssetParameters46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71S3Bucket3C4265E9: { Type: 'String', Description: 'S3 bucket for asset "46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71"' },
      AssetParameters46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71S3VersionKey8E981535: { Type: 'String', Description: 'S3 key for asset version "46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71"' },
      AssetParameters46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71ArtifactHash45A28583: { Type: 'String', Description: 'Artifact hash for asset "46b107d6db798ca46046b8669d057a4debcbdbaaddb6170400748c2f9e4f9d71"' },
    });

    // asset proxy parameters are passed to the nested stack
    Template.fromStack(parent).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetoParentStackAssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3Bucket82C55B96Ref: { Ref: 'AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3BucketC188F637' },
        referencetoParentStackAssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyA43C3CC6Ref: { Ref: 'AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyC7F4DBF2' },
      },
    });

    // parent stack should have 2 assets
    expect(assembly.getStackByName(parent.stackName).assets.length).toEqual(2);
  });

  test('docker image assets are wired through the top-level stack', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parent = new Stack(app, 'my-stack');
    const nested = new NestedStack(parent, 'nested-stack');

    // WHEN
    const location = nested.synthesizer.addDockerImageAsset({
      directoryName: 'my-image',
      dockerBuildArgs: { key: 'value', boom: 'bam' },
      dockerBuildTarget: 'buildTarget',
      sourceHash: 'hash-of-source',
    });

    // use the asset, so the parameters will be wired.
    new sns.Topic(nested, 'MyTopic', {
      displayName: `image location is ${location.imageUri}`,
    });

    // THEN
    const asm = app.synth();
    expect(asm.getStackArtifact(parent.artifactId).assets).toEqual([
      {
        repositoryName: 'aws-cdk/assets',
        imageTag: 'hash-of-source',
        id: 'hash-of-source',
        packaging: 'container-image',
        path: 'my-image',
        sourceHash: 'hash-of-source',
        buildArgs: { key: 'value', boom: 'bam' },
        target: 'buildTarget',
      },
      {
        path: 'mystacknestedstackFAE12FB5.nested.template.json',
        id: 'fcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5',
        packaging: 'file',
        sourceHash: 'fcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5',
        s3BucketParameter: 'AssetParametersfcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5S3Bucket67A749F8',
        s3KeyParameter: 'AssetParametersfcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5S3VersionKeyE1E6A8D4',
        artifactHashParameter: 'AssetParametersfcdaee79eb79f37eca3a9b1cc0cc9ba150e4eea8c5d6d0c343cb6cd9dc68e2e5ArtifactHash0AEDBE8A',
      },
    ]);
  });

  test('metadata defined in nested stacks is reported at the parent stack level in the cloud assembly', () => {
    // GIVEN
    const app = new App({ stackTraces: false });
    const parent = new Stack(app, 'parent');
    const child = new Stack(parent, 'child');
    const nested = new NestedStack(child, 'nested');
    const resource = new CfnResource(nested, 'resource', { type: 'foo' });

    // WHEN
    resource.node.addMetadata('foo', 'bar');

    // THEN: the first non-nested stack records the assembly metadata
    const asm = app.synth();
    expect(asm.stacks.length).toEqual(2); // only one stack is defined as an artifact
    expect(asm.getStackByName(parent.stackName).findMetadataByType('foo')).toEqual([]);
    expect(asm.getStackByName(child.stackName).findMetadataByType('foo')).toEqual([
      {
        path: '/parent/child/nested/resource',
        type: 'foo',
        data: 'bar',
      },
    ]);
  });

  test('referencing attributes with period across stacks', () => {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'nested');
    const consumed = new CfnResource(nested, 'resource-in-nested', { type: 'CONSUMED' });

    // WHEN
    new CfnResource(parent, 'resource-in-parent', {
      type: 'CONSUMER',
      properties: {
        ConsumedAttribute: consumed.getAtt('Consumed.Attribute'),
      },
    });

    // THEN
    Template.fromStack(nested).templateMatches({
      Resources: {
        resourceinnested: {
          Type: 'CONSUMED',
        },
      },
      Outputs: {
        nestedresourceinnested59B1F01CConsumedAttribute: {
          Value: {
            'Fn::GetAtt': [
              'resourceinnested',
              'Consumed.Attribute',
            ],
          },
        },
      },
    });

    Template.fromStack(parent).hasResourceProperties('CONSUMER', {
      ConsumedAttribute: {
        'Fn::GetAtt': [
          'nestedNestedStacknestedNestedStackResource3DD143BF',
          'Outputs.nestedresourceinnested59B1F01CConsumedAttribute',
        ],
      },
    });
  });

  test('missing context in nested stack is reported if the context is not available', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'ParentStack', { env: { account: '1234account', region: 'us-east-44' } });
    const nestedStack = new NestedStack(stack, 'nested');
    const provider = 'availability-zones';
    const expectedKey = ContextProvider.getKey(nestedStack, {
      provider,
    }).key;

    // WHEN
    ContextProvider.getValue(nestedStack, {
      provider,
      dummyValue: ['dummy1a', 'dummy1b', 'dummy1c'],
    });

    // THEN: missing context is reported in the cloud assembly
    const asm = app.synth();
    const missing = asm.manifest.missing;

    expect(missing && missing.find(m => {
      return (m.key === expectedKey);
    })).toBeTruthy();
  });

  test('3-level stacks: legacy synthesizer parameters are added to the middle-level stack', () => {
    // GIVEN
    const app = new App();
    const top = new Stack(app, 'stack', {
      synthesizer: new LegacyStackSynthesizer(),
    });
    const middle = new NestedStack(top, 'nested1');
    const bottom = new NestedStack(middle, 'nested2');

    // WHEN
    new CfnResource(bottom, 'Something', {
      type: 'BottomLevel',
    });

    // THEN
    const asm = app.synth();
    const middleTemplate = JSON.parse(fs.readFileSync(path.join(asm.directory, middle.templateFile), { encoding: 'utf-8' }));

    const hash = 'bc3c51e4d3545ee0a0069401e5a32c37b66d044b983f12de416ba1576ecaf0a4';
    expect(middleTemplate.Parameters ?? {}).toEqual({
      [`referencetostackAssetParameters${hash}S3BucketD7C30435Ref`]: {
        Type: 'String',
      },
      [`referencetostackAssetParameters${hash}S3VersionKeyB667DBE1Ref`]: {
        Type: 'String',
      },
    });
  });

  test('references to a resource from a deeply nested stack', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const top = new Stack(app, 'stack');
    const topLevel = new CfnResource(top, 'toplevel', { type: 'TopLevel' });
    const nested1 = new NestedStack(top, 'nested1');
    const nested2 = new NestedStack(nested1, 'nested2');

    // WHEN
    new CfnResource(nested2, 'refToTopLevel', {
      type: 'BottomLevel',
      properties: { RefToTopLevel: topLevel.ref },
    });

    // THEN
    Template.fromStack(top).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetostackAssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3Bucket5DA5D2E7Ref: {
          Ref: 'AssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3BucketDD4D96B5',
        },
        referencetostackAssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3VersionKey8FBE5C12Ref: {
          Ref: 'AssetParameters842982bd421cce9742ba27151ef12ed699d44d22801f41e8029f63f2358a3f2fS3VersionKey83E381F3',
        },
        referencetostacktoplevelBB16BF13Ref: {
          Ref: 'toplevel',
        },
      },
    });

    Template.fromStack(nested1).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetostacktoplevelBB16BF13Ref: {
          Ref: 'referencetostacktoplevelBB16BF13Ref',
        },
      },
    });

    Template.fromStack(nested2).templateMatches({
      Resources: {
        refToTopLevel: {
          Type: 'BottomLevel',
          Properties: {
            RefToTopLevel: {
              Ref: 'referencetostacktoplevelBB16BF13Ref',
            },
          },
        },
      },
      Parameters: {
        referencetostacktoplevelBB16BF13Ref: {
          Type: 'String',
        },
      },
    });
  });

  test('bottom nested stack consumes value from a top-level stack through a parameter in a middle nested stack', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const top = new Stack(app, 'Grandparent');
    const middle = new NestedStack(top, 'Parent');
    const bottom = new NestedStack(middle, 'Child');
    const resourceInGrandparent = new CfnResource(top, 'ResourceInGrandparent', { type: 'ResourceInGrandparent' });

    // WHEN
    new CfnResource(bottom, 'ResourceInChild', {
      type: 'ResourceInChild',
      properties: {
        RefToGrandparent: resourceInGrandparent.ref,
      },
    });

    // THEN

    // this is the name allocated for the parameter that's propagated through
    // the hierarchy.
    const paramName = 'referencetoGrandparentResourceInGrandparent010E997ARef';

    // child (bottom) references through a parameter.
    Template.fromStack(bottom).templateMatches({
      Resources: {
        ResourceInChild: {
          Type: 'ResourceInChild',
          Properties: {
            RefToGrandparent: { Ref: paramName },
          },
        },
      },
      Parameters: {
        [paramName]: { Type: 'String' },
      },
    });

    // the parent (middle) sets the value of this parameter to be a reference to another parameter
    Template.fromStack(middle).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        [paramName]: { Ref: paramName },
      },
    });

    // grandparent (top) assigns the actual value to the parameter
    Template.fromStack(top).hasResourceProperties('AWS::CloudFormation::Stack', {
      Parameters: {
        [paramName]: { Ref: 'ResourceInGrandparent' },

        // these are for the asset of the bottom nested stack
        referencetoGrandparentAssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3Bucket06EEE58DRef: {
          Ref: 'AssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3Bucket01877C2E',
        },
        referencetoGrandparentAssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3VersionKeyD3B04909Ref: {
          Ref: 'AssetParameters3208f43b793a1dbe28ca02cf31fb975489071beb42c492b22dc3d32decc3b4b7S3VersionKey5765F084',
        },
      },
    });
  });
});
