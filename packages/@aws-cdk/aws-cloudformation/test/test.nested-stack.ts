import { expect, haveResource } from '@aws-cdk/assert';
import { App, CfnParameter, CfnResource, Construct, Stack } from '@aws-cdk/core';
import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
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
    app.synth();

    // nested template should use a parameter to reference the resource from the parent stack
    expect(nested).toMatch({
      Resources:
      {
        resource:
        {
          Type: 'AWS::Child::Resource',
          Properties:
            { ReferenceToResourceInParentStack: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' } }
        },
        resource2:
        {
          Type: 'My::Resource::2',
          Properties:
          {
            Prop1: { Ref: 'referencetoparentparentresourceD56EA8F7Attr' },
            Prop2: { Ref: 'referencetoparentparentresourceD56EA8F7Ref' }
          }
        }
      },
      Parameters:
      {
        referencetoparentparentresourceD56EA8F7Ref: { Type: 'String' },
        referencetoparentparentresourceD56EA8F7Attr: { Type: 'String' }
      }
    });

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
        RefToResourceInNestedStack: nested.resourceFromChild.ref
      }
    });

    // references are added during "prepare"
    app.synth();

    // nested template should use a parameter to reference the resource from the parent stack
    expect(nested).toMatch({
      Resources: {
        resource: { Type: 'AWS::Child::Resource' }
      },
      Outputs: {
        parentnestedresource4D680677Ref: { Value: { Ref: 'resource' } }
      }
    });

    // parent template should pass in the value through the parameter
    expect(parentStack).to(haveResource('AWS::Parent::Resource', {
      RefToResourceInNestedStack: {
        "Fn::GetAtt": [
          "nestedNestedStacknestedNestedStackResource3DD143BF",
          "Outputs.parentnestedresource4D680677Ref"
        ]
      }
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
        RefToSibling: resourceInStack2.getAtt('MyAttribute')
      }
    });

    // THEN
    const assembly = app.synth();

    // producing stack should have an export
    expect(stack2).toMatch({
      Resources: {
        ResourceInStack2: { Type: "MyResource" }
      },
      Outputs: {
        ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009: {
          Value: { "Fn::GetAtt": [ "ResourceInStack2", "MyAttribute" ] },
          Export: { Name: "Stack2:ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009" }
        }
      }
    });

    // nested stack uses Fn::ImportValue like normal
    expect(nestedUnderStack1).toMatch({
      Resources: {
        ResourceInNestedStack1: {
          Type: "Nested::Resource",
          Properties: {
            RefToSibling: {
              "Fn::ImportValue": "Stack2:ExportsOutputFnGetAttResourceInStack2MyAttributeC15F1009"
            }
          }
        }
      }
    });

    // verify a depedency was established between the parents
    const stack1Artifact = assembly.getStack(stack1.stackName);
    const stack2Artifact = assembly.getStack(stack2.stackName);
    test.deepEqual(stack1Artifact.dependencies.length, 1);
    test.deepEqual(stack2Artifact.dependencies.length, 0);
    test.same(stack1Artifact.dependencies[0], stack2Artifact);
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
        RefToSibling: resourceInNestedStack.getAtt('MyAttribute')
      }
    });

    // THEN
    const assembly = app.synth();

    // nested stack should output this value as if it was referenced by the parent (without the export)
    expect(nestedUnderStack1).toMatch({
      Resources: {
        ResourceInNestedStack: {
          Type: "MyResource"
        }
      },
      Outputs: {
        Stack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute: {
          Value: {
            "Fn::GetAtt": [
              "ResourceInNestedStack",
              "MyAttribute"
            ]
          }
        }
      }
    });

    // parent stack (stack1) should export this value
    test.deepEqual(assembly.getStack(stack1.stackName).template.Outputs, {
      ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3: {
        Value: { 'Fn::GetAtt': [ 'NestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305B', 'Outputs.Stack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute' ] },
        Export: { Name: 'Stack1:ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3' }
      }
    });

    // consuming stack should use ImportValue to import the value from the parent stack
    expect(stack2).toMatch({
      Resources: {
        ResourceInStack2: {
          Type: "JustResource",
          Properties: {
            RefToSibling: {
              "Fn::ImportValue": "Stack1:ExportsOutputFnGetAttNestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305BOutputsStack1NestedUnderStack1ResourceInNestedStack6EE9DCD2MyAttribute564EECF3"
            }
          }
        }
      }
    });

    test.deepEqual(assembly.stacks.length, 2);
    const stack1Artifact = assembly.getStack(stack1.stackName);
    const stack2Artifact = assembly.getStack(stack2.stackName);
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
        RefToResource1: resource1.ref
      }
    });

    // THEN
    app.synth();

    // producing nested stack
    expect(nested1).toMatch({
      Resources: {
        Resource1: {
          Type: "Resource1"
        }
      },
      Outputs: {
        ParentNested1Resource15F3F0657Ref: {
          Value: {
            Ref: "Resource1"
          }
        }
      }
    });

    // consuming nested stack
    expect(nested2).toMatch({
      Resources: {
        Resource2: {
          Type: "Resource2",
          Properties: {
            RefToResource1: {
              Ref: "referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref"
            }
          }
        }
      },
      Parameters: {
        referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref: {
          Type: "String"
        }
      }
    });

    // parent
    expect(parent).to(haveResource('AWS::CloudFormation::Stack', {
      Parameters: {
        referencetoParentNested1NestedStackNested1NestedStackResource9C05342COutputsParentNested1Resource15F3F0657Ref: {
          "Fn::GetAtt": [
            "Nested1NestedStackNested1NestedStackResourceCD0AD36B",
            "Outputs.ParentNested1Resource15F3F0657Ref"
          ]
        }
      }
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
      properties: { MyStackId: nested.stackId }
    });

    // THEN
    expect(nested).to(haveResource('Nested::Resource', {
      MyStackId: { Ref: "AWS::StackId" }
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
      properties: { NestedStackId: nested.stackId }
    });

    // THEN
    expect(parent).to(haveResource('Parent::Resource', {
      NestedStackId: { Ref: "NestedStackNestedStackNestedStackNestedStackResourceB70834FD" }
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
      properties: { MyStackName: nested.stackName }
    });

    // THEN
    expect(nested).to(haveResource('Nested::Resource', {
      MyStackName: { Ref: "AWS::StackName" }
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
      properties: { NestedStackName: nested.stackName }
    });

    // THEN
    expect(parent).to(haveResource('Parent::Resource', {
      NestedStackName: {
        "Fn::Select": [
          1,
          {
            "Fn::Split": [
              "/",
              {
                Ref: "NestedStackNestedStackNestedStackNestedStackResourceB70834FD"
              }
            ]
          }
        ]
      }
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

  // 'assets within nested stacks'(test: Test) {
  //   // GIVEN
  //   const app = new App();
  //   const parent = new Stack(app, 'ParentStack');
  //   const nested = new NestedStack(parent, 'NestedStack');

  //   // WHEN
  //   const asset = new s3_assets.Asset(nested, 'asset', {
  //     path: __filename
  //   });

  //   new CfnResource(nested, 'NestedResource', {
  //     type: 'Nested::Resource',
  //     properties: {
  //       AssetBucket: asset.s3BucketName,
  //       AssetKey: asset.s3ObjectKey
  //     }
  //   });

  //   // THEN
  //   expect(parent).toMatch({});
  //   test.done();
  // }
};
