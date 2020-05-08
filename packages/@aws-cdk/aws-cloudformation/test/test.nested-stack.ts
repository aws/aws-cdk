import { expect, haveResource, matchTemplate, SynthUtils } from '@aws-cdk/assert';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as sns from '@aws-cdk/aws-sns';
import { App, CfnParameter, CfnResource, Construct, ContextProvider, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as path from 'path';
import { NestedStack } from '../lib/nested-stack';

// tslint:disable:max-line-length

export = {
  'fails if defined as a root'(test: Test) {
    // THEN
    test.throws(() => new NestedStack(undefined as any, 'boom'), /Nested stacks cannot be defined as a root construct/);
    test.done();
  },

  'fails if defined without a parent stack'(test: Test) {
    // GIVEN
    const app = new App();
    const group = new Construct(app, 'group');

    // THEN
    test.throws(() => new NestedStack(app, 'boom'), /must be defined within scope of another non-nested stack/);
    test.throws(() => new NestedStack(group, 'bam'), /must be defined within scope of another non-nested stack/);
    test.done();
  },

  'can be defined as a direct child or an indirect child of a Stack'(test: Test) {
    // GIVEN
    const parent = new Stack();

    // THEN
    new NestedStack(parent, 'direct');
    new NestedStack(new Construct(parent, 'group'), 'indirect');
    test.done();
  },

  'nested stack is not synthesized as a stack artifact into the assembly'(test: Test) {
    // GIVEN
    const app = new App();
    const parentStack = new Stack(app, 'parent-stack');
    new NestedStack(parentStack, 'nested-stack');

    // WHEN
    const assembly = app.synth();

    // THEN
    test.deepEqual(assembly.artifacts.length, 2);
    test.done();
  },

  'the template of the nested stack is synthesized into the cloud assembly'(test: Test) {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'parent-stack');
    const nested = new NestedStack(parent, 'nested-stack');
    new CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });

    // WHEN
    const assembly = app.synth();

    // THEN
    const template = JSON.parse(fs.readFileSync(path.join(assembly.directory, `${nested.node.uniqueId}.nested.template.json`), 'utf-8'));
    test.deepEqual(template, {
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested).node.uniqueId,
      },
      Resources: {
        ResourceInNestedStack: {
          Type: 'AWS::Resource::Nested',
        },
      },
    });
    test.done();
  },

  'file asset metadata is associated with the parent stack'(test: Test) {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'parent-stack');
    const nested = new NestedStack(parent, 'nested-stack');
    new CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });

    // WHEN
    const assembly = app.synth();

    // THEN
    test.deepEqual(assembly.getStackByName(parent.stackName).assets, [{
      path: 'parentstacknestedstack844892C0.nested.template.json',
      id: 'caf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96',
      packaging: 'file',
      sourceHash: 'caf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96',
      s3BucketParameter: 'AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96S3Bucket7B8F90A0',
      s3KeyParameter: 'AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96S3VersionKey0BCA3E2A',
      artifactHashParameter: 'AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96ArtifactHash336D7EE7',
    }]);
    test.done();
  },

  'aws::cloudformation::stack is synthesized in the parent scope'(test: Test) {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'parent-stack');

    // WHEN
    const nested = new NestedStack(parent, 'nested-stack');
    new CfnResource(nested, 'ResourceInNestedStack', { type: 'AWS::Resource::Nested' });

    // THEN
    const assembly = app.synth();

    // assembly has one stack (the parent)
    test.deepEqual(assembly.stacks.length, 1);

    // but this stack has an asset that points to the synthesized template
    test.deepEqual(assembly.stacks[0].assets[0].path, 'parentstacknestedstack844892C0.nested.template.json');

    // the template includes our resource
    const filePath = path.join(assembly.directory, assembly.stacks[0].assets[0].path);
    test.deepEqual(JSON.parse(fs.readFileSync(filePath).toString('utf-8')), {
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested).node.uniqueId,
      },
      Resources: { ResourceInNestedStack: { Type: 'AWS::Resource::Nested' } },
    });

    // the parent template includes the parameters and the nested stack resource which points to the s3 url
    expect(parent).toMatch({
      Resources: {
        nestedstackNestedStacknestedstackNestedStackResource71CDD241: {
          Type: 'AWS::CloudFormation::Stack',
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
                    Ref: 'AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96S3Bucket7B8F90A0',
                  },
                  '/',
                  {
                    'Fn::Select': [
                      0,
                      {
                        'Fn::Split': [
                          '||',
                          {
                            Ref: 'AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96S3VersionKey0BCA3E2A',
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
                            Ref: 'AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96S3VersionKey0BCA3E2A',
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
        AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96S3Bucket7B8F90A0: {
          Type: 'String',
          Description: 'S3 bucket for asset "caf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96"',
        },
        AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96S3VersionKey0BCA3E2A: {
          Type: 'String',
          Description: 'S3 key for asset version "caf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96"',
        },
        AssetParameterscaf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96ArtifactHash336D7EE7: {
          Type: 'String',
          Description: 'Artifact hash for asset "caf2b3d74433050e60f33ff0f4d77763f1861fd8ecbe8986e2065daae1998d96"',
        },
      },
    });
    test.done();
  },

  'Stack.of()'(test: Test) {
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

    test.ok(nested.stackOfChild === nested);
    test.ok(Stack.of(nested) === nested);
    test.done();
  },

  'references within the nested stack are not reported as cross stack references'(test: Test) {
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

    const app = new App();
    const parent = new Stack(app, 'parent');

    new MyNestedStack(parent, 'nested');

    // references are added during "prepare"
    const assembly = app.synth();

    test.deepEqual(assembly.stacks.length, 1);
    test.deepEqual(assembly.stacks[0].dependencies, []);
    test.done();
  },

  'references to a resource from the parent stack in a nested stack is translated into a cfn parameter'(test: Test) {
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
    expect(nested).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested).node.uniqueId,
      },
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
    expect(parentStack).to(haveResource('AWS::CloudFormation::Stack', {
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
    }));

    test.done();
  },

  'references to a resource in the nested stack in the parent is translated into a cfn output'(test: Test) {
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
    expect(nested).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested).node.uniqueId,
      },
      Resources: {
        resource: { Type: 'AWS::Child::Resource' },
      },
      Outputs: {
        parentnestedresource4D680677Ref: { Value: { Ref: 'resource' } },
      },
    });

    // parent template should pass in the value through the parameter
    expect(parentStack).to(haveResource('AWS::Parent::Resource', {
      RefToResourceInNestedStack: {
        'Fn::GetAtt': [
          'nestedNestedStacknestedNestedStackResource3DD143BF',
          'Outputs.parentnestedresource4D680677Ref',
        ],
      },
    }));

    test.done();
  },

  'nested stack references a resource from another non-nested stack (not the parent)'(test: Test) {
    // GIVEN
    const app = new App();
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
    expect(stack2).toMatch({
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
    expect(nestedUnderStack1).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nestedUnderStack1).node.uniqueId,
      },
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
    test.deepEqual(stack1Artifact.dependencies.length, 1);
    test.deepEqual(stack2Artifact.dependencies.length, 0);
    test.same(stack1Artifact.dependencies[0], stack2Artifact);
    test.done();
  },

  'nested stack within a nested stack references a resource in a sibling top-level stack'(test: Test) {
    // GIVEN
    const app = new App();
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
    test.deepEqual(consumerDeps, [ 'ProducerTopLevel' ]);
    test.done();
  },

  'another non-nested stack takes a reference on a resource within the nested stack (the parent exports)'(test: Test) {
    // GIVEN
    const app = new App();
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
    expect(nestedUnderStack1).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nestedUnderStack1).node.uniqueId,
      },
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
    test.deepEqual(assembly.getStackByName(stack1.stackName).template.Outputs, {
      ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3: {
        Value: { 'Fn::GetAtt': ['NestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305B', 'Outputs.Stack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute'] },
        Export: { Name: 'Stack1:ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3' },
      },
    });

    // consuming stack should use ImportValue to import the value from the parent stack
    expect(stack2).toMatch({
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

    test.deepEqual(assembly.stacks.length, 2);
    const stack1Artifact = assembly.getStackByName(stack1.stackName);
    const stack2Artifact = assembly.getStackByName(stack2.stackName);
    test.deepEqual(stack1Artifact.dependencies.length, 0);
    test.deepEqual(stack2Artifact.dependencies.length, 1);
    test.same(stack2Artifact.dependencies[0], stack1Artifact);
    test.done();
  },

  'references between sibling nested stacks should output from one and getAtt from the other'(test: Test) {
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
    expect(nested1).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested1).node.uniqueId,
      },
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
    expect(nested2).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested2).node.uniqueId,
      },
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
    expect(parent).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref: {
          'Fn::GetAtt': [
            'Nested1NestedStackNested1NestedStackResourceCD0AD36B',
            'Outputs.ParentNested1Resource15F3F0657Ref',
          ],
        },
      },
    }));

    test.done();
  },

  'stackId returns AWS::StackId when referenced from the context of the nested stack'(test: Test) {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(nested, 'NestedResource', {
      type: 'Nested::Resource',
      properties: { MyStackId: nested.stackId },
    });

    // THEN
    expect(nested).to(haveResource('Nested::Resource', {
      MyStackId: { Ref: 'AWS::StackId' },
    }));

    test.done();
  },

  'stackId returns the REF of the CloudFormation::Stack resource when referenced from the parent stack'(test: Test) {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(parent, 'ParentResource', {
      type: 'Parent::Resource',
      properties: { NestedStackId: nested.stackId },
    });

    // THEN
    expect(parent).to(haveResource('Parent::Resource', {
      NestedStackId: { Ref: 'NestedStackNestedStackNestedStackNestedStackResourceB70834FD' },
    }));

    test.done();
  },

  'stackName returns AWS::StackName when referenced from the context of the nested stack'(test: Test) {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(nested, 'NestedResource', {
      type: 'Nested::Resource',
      properties: { MyStackName: nested.stackName },
    });

    // THEN
    expect(nested).to(haveResource('Nested::Resource', {
      MyStackName: { Ref: 'AWS::StackName' },
    }));

    test.done();
  },

  'stackName returns the REF of the CloudFormation::Stack resource when referenced from the parent stack'(test: Test) {
    // GIVEN
    const parent = new Stack();
    const nested = new NestedStack(parent, 'NestedStack');

    // WHEN
    new CfnResource(parent, 'ParentResource', {
      type: 'Parent::Resource',
      properties: { NestedStackName: nested.stackName },
    });

    // THEN
    expect(parent).to(haveResource('Parent::Resource', {
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
    }));

    test.done();
  },

  '"account", "region" and "environment" are all derived from the parent'(test: Test) {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'ParentStack', { env: { account: '1234account', region: 'us-east-44' } });

    // WHEN
    const nested = new NestedStack(parent, 'NestedStack');

    // THEN
    test.deepEqual(nested.environment, parent.environment);
    test.deepEqual(nested.account, parent.account);
    test.deepEqual(nested.region, parent.region);
    test.done();
  },

  'double-nested stack'(test: Test) {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'stack');

    // WHEN
    const nested1 = new NestedStack(parent, 'Nested1');
    const nested2 = new NestedStack(nested1, 'Nested2');

    new CfnResource(nested1, 'Resource1', { type: 'Resource::1' });
    new CfnResource(nested2, 'Resource2', { type: 'Resource::2' });

    // THEN
    const assembly = app.synth();

    // nested2 is a "leaf", so it's just the resource
    expect(nested2).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested2).node.uniqueId,
      },
      Resources: {
        Resource2: { Type: 'Resource::2' },
      },
    });

    // nested1 wires the nested2 template through parameters, so we expect those
    expect(nested1).to(haveResource('Resource::1'));
    const nested2Template = SynthUtils.toCloudFormation(nested1);
    test.deepEqual(nested2Template.Parameters, {
      referencetostackAssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3Bucket45FFE918Ref: { Type: 'String' },
      referencetostackAssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3VersionKey45F4D5A6Ref: { Type: 'String' },
    });

    // parent stack should have two sets of parameters. one for the first nested stack and the second
    // for the second nested stack, passed in as parameters to the first
    const template = SynthUtils.toCloudFormation(parent);
    test.deepEqual(template.Parameters, {
      AssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3BucketB3391B48: { Type: 'String', Description: 'S3 bucket for asset "40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8"' },
      AssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3VersionKeyC75757DA: { Type: 'String', Description: 'S3 key for asset version "40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8"' },
      AssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8ArtifactHash4A948727: { Type: 'String', Description: 'Artifact hash for asset "40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8"' },
      AssetParameters411b2496ae5b852820129c04db139ffe1ac61d05f856772f20e99a644c2bf298S3Bucket9E20227C: { Type: 'String', Description: 'S3 bucket for asset "411b2496ae5b852820129c04db139ffe1ac61d05f856772f20e99a644c2bf298"' },
      AssetParameters411b2496ae5b852820129c04db139ffe1ac61d05f856772f20e99a644c2bf298S3VersionKey01A28DCE: { Type: 'String', Description: 'S3 key for asset version "411b2496ae5b852820129c04db139ffe1ac61d05f856772f20e99a644c2bf298"' },
      AssetParameters411b2496ae5b852820129c04db139ffe1ac61d05f856772f20e99a644c2bf298ArtifactHash86E03876: { Type: 'String', Description: 'Artifact hash for asset "411b2496ae5b852820129c04db139ffe1ac61d05f856772f20e99a644c2bf298"' },
    });

    // proxy asset params to nested stack
    expect(parent).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetostackAssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3Bucket45FFE918Ref: { Ref: 'AssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3BucketB3391B48' },
        referencetostackAssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3VersionKey45F4D5A6Ref: { Ref: 'AssetParameters40d38153bbbf43fe2dba3e44c195d39791350102f529ce92324b908305d424c8S3VersionKeyC75757DA' },
      },
    }));

    // parent stack should have 2 assets
    test.deepEqual(assembly.getStackByName(parent.stackName).assets.length, 2);
    test.done();
  },

  'assets within nested stacks are proxied from the parent'(test: Test) {
    // GIVEN
    const app = new App();
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
    const template = SynthUtils.toCloudFormation(parent);

    // two sets of asset parameters: one for the nested stack itself and one as a proxy for the asset within the stack
    test.deepEqual(template.Parameters, {
      AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3BucketC188F637: { Type: 'String', Description: 'S3 bucket for asset "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
      AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyC7F4DBF2: { Type: 'String', Description: 'S3 key for asset version "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
      AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281ArtifactHash373B14D2: { Type: 'String', Description: 'Artifact hash for asset "db01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281"' },
      AssetParametersba6df16905a681e6c294000f721e0197956eb2acba38a6aa72fd2ca6e84f9618S3BucketA7C241CD: { Type: 'String', Description: 'S3 bucket for asset "ba6df16905a681e6c294000f721e0197956eb2acba38a6aa72fd2ca6e84f9618"' },
      AssetParametersba6df16905a681e6c294000f721e0197956eb2acba38a6aa72fd2ca6e84f9618S3VersionKey5F63FFDB: { Type: 'String', Description: 'S3 key for asset version "ba6df16905a681e6c294000f721e0197956eb2acba38a6aa72fd2ca6e84f9618"' },
      AssetParametersba6df16905a681e6c294000f721e0197956eb2acba38a6aa72fd2ca6e84f9618ArtifactHash9ADD75F9: { Type: 'String', Description: 'Artifact hash for asset "ba6df16905a681e6c294000f721e0197956eb2acba38a6aa72fd2ca6e84f9618"' },
    });

    // asset proxy parameters are passed to the nested stack
    expect(parent).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetoParentStackAssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3Bucket82C55B96Ref: { Ref: 'AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3BucketC188F637' },
        referencetoParentStackAssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyA43C3CC6Ref: { Ref: 'AssetParametersdb01ee2eb7adc7915e364dc410d861e569543f9be3761d535a68d5c2cc181281S3VersionKeyC7F4DBF2' },
      },
    }));

    // parent stack should have 2 assets
    test.deepEqual(assembly.getStackByName(parent.stackName).assets.length, 2);
    test.done();
  },

  'docker image assets are wired through the top-level stack'(test: Test) {
    // GIVEN
    const app = new App();
    const parent = new Stack(app, 'my-stack');
    const nested = new NestedStack(parent, 'nested-stack');

    // WHEN
    const location = nested.addDockerImageAsset({
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
    test.deepEqual(asm.getStackArtifact(parent.artifactId).assets, [
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
        id: '47d911639b75397d4a9a8da7ce6952a84dcee7e3604f35edeee872ed88fb3f64',
        packaging: 'file',
        sourceHash: '47d911639b75397d4a9a8da7ce6952a84dcee7e3604f35edeee872ed88fb3f64',
        s3BucketParameter: 'AssetParameters47d911639b75397d4a9a8da7ce6952a84dcee7e3604f35edeee872ed88fb3f64S3Bucket36AE251A',
        s3KeyParameter: 'AssetParameters47d911639b75397d4a9a8da7ce6952a84dcee7e3604f35edeee872ed88fb3f64S3VersionKey71358F90',
        artifactHashParameter: 'AssetParameters47d911639b75397d4a9a8da7ce6952a84dcee7e3604f35edeee872ed88fb3f64ArtifactHash083CEC1C',
      },
    ]);

    test.done();
  },

  'metadata defined in nested stacks is reported at the parent stack level in the cloud assembly'(test: Test) {
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
    test.deepEqual(asm.stacks.length, 2); // only one stack is defined as an artifact
    test.deepEqual(asm.getStackByName(parent.stackName).findMetadataByType('foo'), []);
    test.deepEqual(asm.getStackByName(child.stackName).findMetadataByType('foo'), [
      {
        path: '/parent/child/nested/resource',
        type: 'foo',
        data: 'bar',
      },
    ]);
    test.done();
  },

  'referencing attributes with period across stacks'(test: Test) {
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
    expect(nested).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested).node.uniqueId,
      },
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
    expect(parent).to(haveResource('CONSUMER', {
      ConsumedAttribute: {
        'Fn::GetAtt': [
          'nestedNestedStacknestedNestedStackResource3DD143BF',
          'Outputs.nestedresourceinnested59B1F01CConsumedAttribute',
        ],
      },
    }));

    test.done();
  },

  'missing context in nested stack is reported if the context is not available'(test: Test) {
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

    test.ok(missing && missing.find(m => {
      return (m.key === expectedKey);
    }));

    test.done();
  },

  'references to a resource from a deeply nested stack'(test: Test) {
    // GIVEN
    const app = new App();
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
    expect(top).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetostacktoplevelBB16BF13Ref: {
          Ref: 'toplevel',
        },
        referencetostackAssetParameters1485ee10b2d03d7a7662a1c451ef9d8ef9b35e99d1df2edea94e54b9685884daS3BucketA5202889Ref: {
          Ref: 'AssetParameters1485ee10b2d03d7a7662a1c451ef9d8ef9b35e99d1df2edea94e54b9685884daS3BucketDBCC6C03',
        },
        referencetostackAssetParameters1485ee10b2d03d7a7662a1c451ef9d8ef9b35e99d1df2edea94e54b9685884daS3VersionKey89077A1ARef: {
          Ref: 'AssetParameters1485ee10b2d03d7a7662a1c451ef9d8ef9b35e99d1df2edea94e54b9685884daS3VersionKeyAAA23765',
        },
      },
    }));

    expect(nested1).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetostacktoplevelBB16BF13Ref: {
          Ref: 'referencetostacktoplevelBB16BF13Ref',
        },
      },
    }));

    expect(nested2).to(matchTemplate({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(nested2).node.uniqueId,
      },
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
    }));
    test.done();
  },

  'bottom nested stack consumes value from a top-level stack through a parameter in a middle nested stack'(test: Test) {
    // GIVEN
    const app = new App();
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
    expect(bottom).toMatch({
      Metadata: {
        [cxapi.PATH_METADATA_KEY]: Stack.of(bottom).node.uniqueId,
      },
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
    expect(middle).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        [paramName]: { Ref: paramName },
      },
    }));

    // grandparent (top) assigns the actual value to the parameter
    expect(top).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        [paramName]: { Ref: 'ResourceInGrandparent' },

        // these are for the asset of the bottom nested stack
        referencetoGrandparentAssetParameters6cee14623c7de9cb5915d12de18a9f1e90b960e6c900c87b8ed7f8865c0f8419S3Bucket9875B191Ref: {
          Ref: 'AssetParameters6cee14623c7de9cb5915d12de18a9f1e90b960e6c900c87b8ed7f8865c0f8419S3Bucket2814AD13',
        },
        referencetoGrandparentAssetParameters6cee14623c7de9cb5915d12de18a9f1e90b960e6c900c87b8ed7f8865c0f8419S3VersionKey46E5230CRef: {
          Ref: 'AssetParameters6cee14623c7de9cb5915d12de18a9f1e90b960e6c900c87b8ed7f8865c0f8419S3VersionKeyD5EF27ED',
        },
      },
    }));

    test.done();
  },
};
