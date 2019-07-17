import { expect, haveResource } from '@aws-cdk/assert';
import { App, CfnParameter, CfnResource, Construct, Stack } from '@aws-cdk/core';
import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { NestedStack } from '../lib/nested-stack';

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

  'fails if defined as a child of another nested stack'(test: Test) {
    // GIVEN
    const parent = new Stack();

    // WHEN
    const nested = new NestedStack(parent, 'nested');

    // THEN
    test.throws(() => new NestedStack(nested, 'child-of-nested'), /must be defined within scope of another non-nested stack/);
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
    test.deepEqual(assembly.artifacts.length, 1);
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
      Resources: {
        ResourceInNestedStack: {
          Type: 'AWS::Resource::Nested'
        }
      }
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
    test.deepEqual(assembly.getStack(parent.stackName).assets, [{
      path: 'parentstacknestedstack844892C0.nested.template.json',
      id: 'parentstacknestedstackNestedStackAsset10DB6EC4',
      packaging: 'file',
      sourceHash: 'parentstacknestedstack844892C0',
      s3BucketParameter: 'nestedstackNestedStackAssetS3Bucket350B4266',
      s3KeyParameter: 'nestedstackNestedStackAssetS3VersionKeyBF292B3B',
      artifactHashParameter: 'nestedstackNestedStackAssetArtifactHash8E66D593'
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
      Resources: { ResourceInNestedStack: { Type: 'AWS::Resource::Nested' } }
    });

    // the parent template includes the parameters and the nested stack resource which points to the s3 url
    expect(parent).toMatch({
      Parameters: {
        nestedstackNestedStackAssetS3Bucket350B4266: {
          Type: "String",
          Description: "S3 bucket for asset \"parent-stack/nested-stack.NestedStack/Asset\""
        },
        nestedstackNestedStackAssetS3VersionKeyBF292B3B: {
          Type: "String",
          Description: "S3 key for asset version \"parent-stack/nested-stack.NestedStack/Asset\""
        },
        nestedstackNestedStackAssetArtifactHash8E66D593: {
          Type: "String",
          Description: "Artifact hash for asset \"parent-stack/nested-stack.NestedStack/Asset\""
        }
      },
      Resources: {
        nestedstackNestedStacknestedstackNestedStackResource71CDD241: {
          Type: "AWS::CloudFormation::Stack",
          Properties: {
            TemplateURL: {
              "Fn::Join": [
                "",
                [
                  "https://s3.",
                  { Ref: "AWS::Region" },
                  ".",
                  { Ref: "AWS::URLSuffix" },
                  "/",
                  { Ref: "nestedstackNestedStackAssetS3Bucket350B4266" },
                  "/",
                  { "Fn::Select": [0, { "Fn::Split": ["||", { Ref: "nestedstackNestedStackAssetS3VersionKeyBF292B3B" }] }] },
                  { "Fn::Select": [1, { "Fn::Split": ["||", { Ref: "nestedstackNestedStackAssetS3VersionKeyBF292B3B" }] }] }
                ]
              ]
            }
          }
        }
      }
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
            SomeProp: param.valueAsString
          }
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
            ReferenceToResourceInParentStack: resourceFromParent.ref
          }
        });

        new CfnResource(this, 'resource2', {
          type: 'My::Resource::2',
          properties: {
            Prop1: resourceFromParent.getAtt('Attr'),
            Prop2: resourceFromParent.ref,
          }
        });
      }
    }

    const app = new App();
    const parentStack = new Stack(app, 'parent');

    const resource = new CfnResource(parentStack, 'parent-resource', { type: 'AWS::Parent::Resource' });

    const nested = new MyNestedStack(parentStack, 'nested', resource);

    // THEN
    const assembly = app.synth();
    const nestedTemplate = JSON.parse(fs.readFileSync(path.join(assembly.directory, nested.templateFile)).toString('utf-8'));

    // nested template should use a parameter to reference the resource from the parent stack
    test.deepEqual(nestedTemplate, { Resources:
      { resource:
         { Type: 'AWS::Child::Resource',
           Properties:
            { ReferenceToResourceInParentStack: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' } } },
        resource2:
         { Type: 'My::Resource::2',
           Properties:
            { Prop1: { Ref: 'referencetoparentparentresourceD56EA8F7Attr' },
              Prop2: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' } } } },
     Parameters:
      { referencetoparentparentresourceD56EA8F7Ref: { Type: 'String' },
        referencetoparentparentresourceD56EA8F7Attr: { Type: 'String' } } });

    // parent template should pass in the value through the parameter
    expect(parentStack).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetoparentparentresourceD56EA8F7Ref: {
          Ref: "parentresource"
        },
        referencetoparentparentresourceD56EA8F7Attr: {
          "Fn::GetAtt": [
            "parentresource",
            "Attr"
          ]
        }
      },
    }));

    test.done();
  },

  // 'references to a resource in the nested stack in the parent is translated into a cfn output'(test: Test) {
  //   class MyNestedStack extends NestedStack {
  //     public readonly resourceFromChild: CfnResource;

  //     constructor(scope: Construct, id: string) {
  //       super(scope, id);

  //       this.resourceFromChild = new CfnResource(this, 'resource', {
  //         type: 'AWS::Child::Resource',
  //       });
  //     }
  //   }

  //   const app = new App();
  //   const parent = new Stack(app, 'parent');

  //   const nested = new MyNestedStack(parent, 'nested');

  //   new CfnResource(parent, 'another-parent-resource', {
  //     type: 'AWS::Parent::Resource',
  //     properties: {
  //       RefToResourceInNestedStack: nested.resourceFromChild.ref
  //     }
  //   });

  //   // references are added during "prepare"
  //   const assembly = app.synth();

  //   test.done();
  // }

};