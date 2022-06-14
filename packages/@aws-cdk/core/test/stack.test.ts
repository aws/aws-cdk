import { testDeprecated, testFutureBehavior, testLegacyBehavior } from '@aws-cdk/cdk-build-tools';
import * as cxapi from '@aws-cdk/cx-api';
import { Fact } from '@aws-cdk/region-info';
import { Construct, Node } from 'constructs';
import {
  App, CfnCondition, CfnInclude, CfnOutput, CfnParameter,
  CfnResource, Lazy, ScopedAws, Stack, validateString,
  Tags, LegacyStackSynthesizer, DefaultStackSynthesizer,
  NestedStack,
  Aws,
} from '../lib';
import { Intrinsic } from '../lib/private/intrinsic';
import { resolveReferences } from '../lib/private/refs';
import { PostResolveToken } from '../lib/util';
import { toCloudFormation } from './util';

describe('stack', () => {
  test('a stack can be serialized into a CloudFormation template, initially it\'s empty', () => {
    const stack = new Stack();
    expect(toCloudFormation(stack)).toEqual({ });
  });

  test('stack name cannot exceed 128 characters', () => {
    // GIVEN
    const app = new App({});
    const reallyLongStackName = 'LookAtMyReallyLongStackNameThisStackNameIsLongerThan128CharactersThatIsNutsIDontThinkThereIsEnoughAWSAvailableToLetEveryoneHaveStackNamesThisLong';

    // THEN
    expect(() => {
      new Stack(app, 'MyStack', {
        stackName: reallyLongStackName,
      });
    }).toThrow(`Stack name must be <= 128 characters. Stack name: '${reallyLongStackName}'`);
  });

  test('stack objects have some template-level propeties, such as Description, Version, Transform', () => {
    const stack = new Stack();
    stack.templateOptions.templateFormatVersion = 'MyTemplateVersion';
    stack.templateOptions.description = 'This is my description';
    stack.templateOptions.transforms = ['SAMy'];
    expect(toCloudFormation(stack)).toEqual({
      Description: 'This is my description',
      AWSTemplateFormatVersion: 'MyTemplateVersion',
      Transform: 'SAMy',
    });
  });

  test('Stack.isStack indicates that a construct is a stack', () => {
    const stack = new Stack();
    const c = new Construct(stack, 'Construct');
    expect(Stack.isStack(stack)).toBeDefined();
    expect(!Stack.isStack(c)).toBeDefined();
  });

  test('stack.id is not included in the logical identities of resources within it', () => {
    const stack = new Stack(undefined, 'MyStack');
    new CfnResource(stack, 'MyResource', { type: 'MyResourceType' });

    expect(toCloudFormation(stack)).toEqual({ Resources: { MyResource: { Type: 'MyResourceType' } } });
  });

  test('when stackResourceLimit is default, should give error', () => {
    // GIVEN
    const app = new App({});

    const stack = new Stack(app, 'MyStack');

    // WHEN
    for (let index = 0; index < 1000; index++) {
      new CfnResource(stack, `MyResource-${index}`, { type: 'MyResourceType' });
    }

    expect(() => {
      app.synth();
    }).toThrow('Number of resources in stack \'MyStack\': 1000 is greater than allowed maximum of 500');
  });

  test('when stackResourceLimit is defined, should give the proper error', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:stackResourceLimit': 100,
      },
    });

    const stack = new Stack(app, 'MyStack');

    // WHEN
    for (let index = 0; index < 200; index++) {
      new CfnResource(stack, `MyResource-${index}`, { type: 'MyResourceType' });
    }

    expect(() => {
      app.synth();
    }).toThrow('Number of resources in stack \'MyStack\': 200 is greater than allowed maximum of 100');
  });

  test('when stackResourceLimit is 0, should not give error', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:stackResourceLimit': 0,
      },
    });

    const stack = new Stack(app, 'MyStack');

    // WHEN
    for (let index = 0; index < 1000; index++) {
      new CfnResource(stack, `MyResource-${index}`, { type: 'MyResourceType' });
    }

    expect(() => {
      app.synth();
    }).not.toThrow();
  });

  test('stack.templateOptions can be used to set template-level options', () => {
    const stack = new Stack();

    stack.templateOptions.description = 'StackDescription';
    stack.templateOptions.templateFormatVersion = 'TemplateVersion';
    stack.templateOptions.transform = 'DeprecatedField';
    stack.templateOptions.transforms = ['Transform'];
    stack.templateOptions.metadata = {
      MetadataKey: 'MetadataValue',
    };

    expect(toCloudFormation(stack)).toEqual({
      Description: 'StackDescription',
      Transform: ['Transform', 'DeprecatedField'],
      AWSTemplateFormatVersion: 'TemplateVersion',
      Metadata: { MetadataKey: 'MetadataValue' },
    });
  });

  test('stack.templateOptions.transforms removes duplicate values', () => {
    const stack = new Stack();

    stack.templateOptions.transforms = ['A', 'B', 'C', 'A'];

    expect(toCloudFormation(stack)).toEqual({
      Transform: ['A', 'B', 'C'],
    });
  });

  test('stack.addTransform() adds a transform', () => {
    const stack = new Stack();

    stack.addTransform('A');
    stack.addTransform('B');
    stack.addTransform('C');

    expect(toCloudFormation(stack)).toEqual({
      Transform: ['A', 'B', 'C'],
    });
  });

  // This approach will only apply to TypeScript code, but at least it's a temporary
  // workaround for people running into issues caused by SDK-3003.
  // We should come up with a proper solution that involved jsii callbacks (when they exist)
  // so this can be implemented by jsii languages as well.
  test('Overriding `Stack._toCloudFormation` allows arbitrary post-processing of the generated template during synthesis', () => {

    const stack = new StackWithPostProcessor();

    new CfnResource(stack, 'myResource', {
      type: 'AWS::MyResource',
      properties: {
        MyProp1: 'hello',
        MyProp2: 'howdy',
        Environment: {
          Key: 'value',
        },
      },
    });

    expect(stack._toCloudFormation()).toEqual({
      Resources:
      {
        myResource:
         {
           Type: 'AWS::MyResource',
           Properties:
          {
            MyProp1: 'hello',
            MyProp2: 'howdy',
            Environment: { key: 'value' },
          },
         },
      },
    });
  });

  test('Stack.getByPath can be used to find any CloudFormation element (Parameter, Output, etc)', () => {

    const stack = new Stack();

    const p = new CfnParameter(stack, 'MyParam', { type: 'String' });
    const o = new CfnOutput(stack, 'MyOutput', { value: 'boom' });
    const c = new CfnCondition(stack, 'MyCondition');

    expect(stack.node.findChild(p.node.id)).toEqual(p);
    expect(stack.node.findChild(o.node.id)).toEqual(o);
    expect(stack.node.findChild(c.node.id)).toEqual(c);
  });

  test('Stack names can have hyphens in them', () => {
    const root = new App();

    new Stack(root, 'Hello-World');
    // Did not throw
  });

  test('Stacks can have a description given to them', () => {
    const stack = new Stack(new App(), 'MyStack', { description: 'My stack, hands off!' });
    const output = toCloudFormation(stack);
    expect(output.Description).toEqual('My stack, hands off!');

  });

  test('Stack descriptions have a limited length', () => {
    const desc = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua. Consequat interdum varius sit amet mattis vulputate
     enim nulla aliquet. At imperdiet dui accumsan sit amet nulla facilisi morbi. Eget lorem dolor sed
     viverra ipsum. Diam volutpat commodo sed egestas egestas. Sit amet porttitor eget dolor morbi non.
     Lorem dolor sed viverra ipsum. Id porta nibh venenatis cras sed felis. Augue interdum velit euismod
     in pellentesque. Suscipit adipiscing bibendum est ultricies integer quis. Condimentum id venenatis a
     condimentum vitae sapien pellentesque habitant morbi. Congue mauris rhoncus aenean vel elit scelerisque
     mauris pellentesque pulvinar.
     Faucibus purus in massa tempor nec. Risus viverra adipiscing at in. Integer feugiat scelerisque varius
     morbi. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Vulputate sapien nec sagittis
     aliquam malesuada bibendum arcu vitae. Augue neque gravida in fermentum et sollicitudin ac orci phasellus.
     Ultrices tincidunt arcu non sodales neque sodales.`;
    expect(() => new Stack(new App(), 'MyStack', { description: desc }));

  });

  testDeprecated('Include should support non-hash top-level template elements like "Description"', () => {
    const stack = new Stack();

    const template = {
      Description: 'hello, world',
    };

    new CfnInclude(stack, 'Include', { template });

    const output = toCloudFormation(stack);

    expect(typeof output.Description).toEqual('string');
  });

  test('Pseudo values attached to one stack can be referenced in another stack', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });

    // THEN
    const assembly = app.synth();
    const template1 = assembly.getStackByName(stack1.stackName).template;
    const template2 = assembly.getStackByName(stack2.stackName).template;

    expect(template1).toEqual({
      Outputs: {
        ExportsOutputRefAWSAccountIdAD568057: {
          Value: { Ref: 'AWS::AccountId' },
          Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
        },
      },
    });

    expect(template2).toEqual({
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
        },
      },
    });
  });

  test('Cross-stack references are detected in resource properties', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const resource1 = new CfnResource(stack1, 'Resource', { type: 'BLA' });
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another resource
    new CfnResource(stack2, 'SomeResource', {
      type: 'AWS::Some::Resource',
      properties: {
        someProperty: new Intrinsic(resource1.ref),
      },
    });

    // THEN
    const assembly = app.synth();
    const template2 = assembly.getStackByName(stack2.stackName).template;

    expect(template2?.Resources).toEqual({
      SomeResource: {
        Type: 'AWS::Some::Resource',
        Properties: {
          someProperty: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefResource1D5D905A' },
        },
      },
    });
  });

  test('Cross-stack export names account for stack name lengths', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', {
      stackName: 'SoThisCouldPotentiallyBeAVeryLongStackName',
    });
    let scope: Construct = stack1;

    // WHEN - deeply nested
    for (let i = 0; i < 50; i++) {
      scope = new Construct(scope, `ChildConstruct${i}`);
    }

    const resource1 = new CfnResource(scope, 'Resource', { type: 'BLA' });
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another resource
    new CfnResource(stack2, 'SomeResource', {
      type: 'AWS::Some::Resource',
      properties: {
        someProperty: new Intrinsic(resource1.ref),
      },
    });

    // THEN
    const assembly = app.synth();
    const template1 = assembly.getStackByName(stack1.stackName).template;

    const theOutput = template1.Outputs[Object.keys(template1.Outputs)[0]];
    expect(theOutput.Export.Name.length).toEqual(255);
  });

  test('Cross-stack reference export names are relative to the stack (when the flag is set)', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:stackRelativeExports': 'true',
      },
    });
    const indifferentScope = new Construct(app, 'ExtraScope');

    const stack1 = new Stack(indifferentScope, 'Stack1', {
      stackName: 'Stack1',
    });
    const resource1 = new CfnResource(stack1, 'Resource', { type: 'BLA' });
    const stack2 = new Stack(indifferentScope, 'Stack2');

    // WHEN - used in another resource
    new CfnResource(stack2, 'SomeResource', {
      type: 'AWS::Some::Resource',
      properties: {
        someProperty: new Intrinsic(resource1.ref),
      },
    });

    // THEN
    const assembly = app.synth();
    const template2 = assembly.getStackByName(stack2.stackName).template;

    expect(template2?.Resources).toEqual({
      SomeResource: {
        Type: 'AWS::Some::Resource',
        Properties: {
          someProperty: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefResource1D5D905A' },
        },
      },
    });
  });

  test('cross-stack references in lazy tokens work', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: Lazy.string({ produce: () => account1 }) });

    const assembly = app.synth();
    const template1 = assembly.getStackByName(stack1.stackName).template;
    const template2 = assembly.getStackByName(stack2.stackName).template;

    // THEN
    expect(template1).toEqual({
      Outputs: {
        ExportsOutputRefAWSAccountIdAD568057: {
          Value: { Ref: 'AWS::AccountId' },
          Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
        },
      },
    });

    expect(template2).toEqual({
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' },
        },
      },
    });
  });

  test('Cross-stack use of Region and account returns nonscoped intrinsic because the two stacks must be in the same region anyway', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnOutput(stack2, 'DemOutput', { value: stack1.region });
    new CfnOutput(stack2, 'DemAccount', { value: stack1.account });

    // THEN
    const assembly = app.synth();
    const template2 = assembly.getStackByName(stack2.stackName).template;

    expect(template2?.Outputs).toEqual({
      DemOutput: {
        Value: { Ref: 'AWS::Region' },
      },
      DemAccount: {
        Value: { Ref: 'AWS::AccountId' },
      },
    });
  });

  test('cross-stack references in strings work', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: `TheAccountIs${account1}` });

    const assembly = app.synth();
    const template2 = assembly.getStackByName(stack2.stackName).template;

    // THEN
    expect(template2).toEqual({
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::Join': ['', ['TheAccountIs', { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }]] },
        },
      },
    });
  });

  test('cross stack references and dependencies work within child stacks (non-nested)', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:stackRelativeExports': true,
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const parent = new Stack(app, 'Parent');
    const child1 = new Stack(parent, 'Child1');
    const child2 = new Stack(parent, 'Child2');
    const resourceA = new CfnResource(child1, 'ResourceA', { type: 'RA' });
    const resourceB = new CfnResource(child1, 'ResourceB', { type: 'RB' });

    // WHEN
    const resource2 = new CfnResource(child2, 'Resource1', {
      type: 'R2',
      properties: {
        RefToResource1: resourceA.ref,
      },
    });
    resource2.addDependsOn(resourceB);

    // THEN
    const assembly = app.synth();
    const parentTemplate = assembly.getStackArtifact(parent.artifactId).template;
    const child1Template = assembly.getStackArtifact(child1.artifactId).template;
    const child2Template = assembly.getStackArtifact(child2.artifactId).template;

    expect(parentTemplate).toEqual({});
    expect(child1Template).toEqual({
      Resources: {
        ResourceA: { Type: 'RA' },
        ResourceB: { Type: 'RB' },
      },
      Outputs: {
        ExportsOutputRefResourceA461B4EF9: {
          Value: { Ref: 'ResourceA' },
          Export: { Name: 'ParentChild18FAEF419:ExportsOutputRefResourceA461B4EF9' },
        },
      },
    });
    expect(child2Template).toEqual({
      Resources: {
        Resource1: {
          Type: 'R2',
          Properties: {
            RefToResource1: { 'Fn::ImportValue': 'ParentChild18FAEF419:ExportsOutputRefResourceA461B4EF9' },
          },
        },
      },
    });

    expect(assembly.getStackArtifact(child1.artifactId).dependencies.map((x: { id: any; }) => x.id)).toEqual([]);
    expect(assembly.getStackArtifact(child2.artifactId).dependencies.map((x: { id: any; }) => x.id)).toEqual(['ParentChild18FAEF419']);
  });

  test('automatic cross-stack references and manual exports look the same', () => {
    // GIVEN: automatic
    const appA = new App({ context: { '@aws-cdk/core:stackRelativeExports': true } });
    const producerA = new Stack(appA, 'Producer');
    const consumerA = new Stack(appA, 'Consumer');
    const resourceA = new CfnResource(producerA, 'Resource', { type: 'AWS::Resource' });
    new CfnOutput(consumerA, 'SomeOutput', { value: `${resourceA.getAtt('Att')}` });

    // GIVEN: manual
    const appM = new App();
    const producerM = new Stack(appM, 'Producer');
    const resourceM = new CfnResource(producerM, 'Resource', { type: 'AWS::Resource' });
    producerM.exportValue(resourceM.getAtt('Att'));

    // THEN - producers are the same
    const templateA = appA.synth().getStackByName(producerA.stackName).template;
    const templateM = appM.synth().getStackByName(producerM.stackName).template;

    expect(templateA).toEqual(templateM);
  });

  test('throw error if overrideLogicalId is used and logicalId is locked', () => {
    // GIVEN: manual
    const appM = new App();
    const producerM = new Stack(appM, 'Producer');
    const resourceM = new CfnResource(producerM, 'ResourceXXX', { type: 'AWS::Resource' });
    producerM.exportValue(resourceM.getAtt('Att'));

    // THEN - producers are the same
    expect(() => {
      resourceM.overrideLogicalId('OVERRIDE_LOGICAL_ID');
    }).toThrow(/The logicalId for resource at path Producer\/ResourceXXX has been locked and cannot be overridden/);
  });

  test('do not throw error if overrideLogicalId is used and logicalId is not locked', () => {
    // GIVEN: manual
    const appM = new App();
    const producerM = new Stack(appM, 'Producer');
    const resourceM = new CfnResource(producerM, 'ResourceXXX', { type: 'AWS::Resource' });

    // THEN - producers are the same
    resourceM.overrideLogicalId('OVERRIDE_LOGICAL_ID');
    producerM.exportValue(resourceM.getAtt('Att'));

    const template = appM.synth().getStackByName(producerM.stackName).template;
    expect(template).toMatchObject({
      Outputs: {
        ExportsOutputFnGetAttOVERRIDELOGICALIDAtt2DD28019: {
          Export: {
            Name: 'Producer:ExportsOutputFnGetAttOVERRIDELOGICALIDAtt2DD28019',
          },
          Value: {
            'Fn::GetAtt': [
              'OVERRIDE_LOGICAL_ID',
              'Att',
            ],
          },
        },
      },
      Resources: {
        OVERRIDE_LOGICAL_ID: {
          Type: 'AWS::Resource',
        },
      },
    });
  });

  test('automatic cross-stack references and manual exports look the same: nested stack edition', () => {
    // GIVEN: automatic
    const appA = new App();
    const producerA = new Stack(appA, 'Producer');
    const nestedA = new NestedStack(producerA, 'Nestor');
    const resourceA = new CfnResource(nestedA, 'Resource', { type: 'AWS::Resource' });

    const consumerA = new Stack(appA, 'Consumer');
    new CfnOutput(consumerA, 'SomeOutput', { value: `${resourceA.getAtt('Att')}` });

    // GIVEN: manual
    const appM = new App();
    const producerM = new Stack(appM, 'Producer');
    const nestedM = new NestedStack(producerM, 'Nestor');
    const resourceM = new CfnResource(nestedM, 'Resource', { type: 'AWS::Resource' });
    producerM.exportValue(resourceM.getAtt('Att'));

    // THEN - producers are the same
    const templateA = appA.synth().getStackByName(producerA.stackName).template;
    const templateM = appM.synth().getStackByName(producerM.stackName).template;

    expect(templateA).toEqual(templateM);
  });

  test('manual exports require a name if not supplying a resource attribute', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');

    expect(() => {
      stack.exportValue('someValue');
    }).toThrow(/or make sure to export a resource attribute/);
  });

  test('manual exports can also just be used to create an export of anything', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');

    const importV = stack.exportValue('someValue', { name: 'MyExport' });

    expect(stack.resolve(importV)).toEqual({ 'Fn::ImportValue': 'MyExport' });
  });

  test('CfnSynthesisError is ignored when preparing cross references', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'my-stack');

    // WHEN
    class CfnTest extends CfnResource {
      public _toCloudFormation() {
        return new PostResolveToken({
          xoo: 1234,
        }, props => {
          validateString(props).assertSuccess();
        });
      }
    }

    new CfnTest(stack, 'MyThing', { type: 'AWS::Type' });

    // THEN
    resolveReferences(app);
  });

  test('Stacks can be children of other stacks (substack) and they will be synthesized separately', () => {
    // GIVEN
    const app = new App();

    // WHEN
    const parentStack = new Stack(app, 'parent');
    const childStack = new Stack(parentStack, 'child');
    new CfnResource(parentStack, 'MyParentResource', { type: 'Resource::Parent' });
    new CfnResource(childStack, 'MyChildResource', { type: 'Resource::Child' });

    // THEN
    const assembly = app.synth();
    expect(assembly.getStackByName(parentStack.stackName).template?.Resources).toEqual({ MyParentResource: { Type: 'Resource::Parent' } });
    expect(assembly.getStackByName(childStack.stackName).template?.Resources).toEqual({ MyChildResource: { Type: 'Resource::Child' } });
  });

  test('Nested Stacks are synthesized with DESTROY policy', () => {
    const app = new App();

    // WHEN
    const parentStack = new Stack(app, 'parent');
    const childStack = new NestedStack(parentStack, 'child');
    new CfnResource(childStack, 'ChildResource', { type: 'Resource::Child' });

    const assembly = app.synth();
    expect(assembly.getStackByName(parentStack.stackName).template).toEqual(expect.objectContaining({
      Resources: {
        childNestedStackchildNestedStackResource7408D03F: expect.objectContaining({
          Type: 'AWS::CloudFormation::Stack',
          DeletionPolicy: 'Delete',
        }),
      },
    }));
  });

  test('asset metadata added to NestedStack resource that contains asset path and property', () => {
    const app = new App();

    // WHEN
    const parentStack = new Stack(app, 'parent');
    parentStack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);
    const childStack = new NestedStack(parentStack, 'child');
    new CfnResource(childStack, 'ChildResource', { type: 'Resource::Child' });

    const assembly = app.synth();
    expect(assembly.getStackByName(parentStack.stackName).template).toEqual(expect.objectContaining({
      Resources: {
        childNestedStackchildNestedStackResource7408D03F: expect.objectContaining({
          Metadata: {
            'aws:asset:path': 'parentchild13F9359B.nested.template.json',
            'aws:asset:property': 'TemplateURL',
          },
        }),
      },
    }));
  });

  test('cross-stack reference (substack references parent stack)', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const parentStack = new Stack(app, 'parent');
    const childStack = new Stack(parentStack, 'child');

    // WHEN (a resource from the child stack references a resource from the parent stack)
    const parentResource = new CfnResource(parentStack, 'MyParentResource', { type: 'Resource::Parent' });
    new CfnResource(childStack, 'MyChildResource', {
      type: 'Resource::Child',
      properties: {
        ChildProp: parentResource.getAtt('AttOfParentResource'),
      },
    });

    // THEN
    const assembly = app.synth();
    expect(assembly.getStackByName(parentStack.stackName).template).toEqual({
      Resources: { MyParentResource: { Type: 'Resource::Parent' } },
      Outputs: {
        ExportsOutputFnGetAttMyParentResourceAttOfParentResourceC2D0BB9E: {
          Value: { 'Fn::GetAtt': ['MyParentResource', 'AttOfParentResource'] },
          Export: { Name: 'parent:ExportsOutputFnGetAttMyParentResourceAttOfParentResourceC2D0BB9E' },
        },
      },
    });
    expect(assembly.getStackByName(childStack.stackName).template).toEqual({
      Resources: {
        MyChildResource: {
          Type: 'Resource::Child',
          Properties: {
            ChildProp: {
              'Fn::ImportValue': 'parent:ExportsOutputFnGetAttMyParentResourceAttOfParentResourceC2D0BB9E',
            },
          },
        },
      },
    });
  });

  test('cross-stack reference (parent stack references substack)', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:stackRelativeExports': true,
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });

    const parentStack = new Stack(app, 'parent');
    const childStack = new Stack(parentStack, 'child');

    // WHEN (a resource from the child stack references a resource from the parent stack)
    const childResource = new CfnResource(childStack, 'MyChildResource', { type: 'Resource::Child' });
    new CfnResource(parentStack, 'MyParentResource', {
      type: 'Resource::Parent',
      properties: {
        ParentProp: childResource.getAtt('AttributeOfChildResource'),
      },
    });

    // THEN
    const assembly = app.synth();
    expect(assembly.getStackByName(parentStack.stackName).template).toEqual({
      Resources: {
        MyParentResource: {
          Type: 'Resource::Parent',
          Properties: {
            ParentProp: { 'Fn::ImportValue': 'parentchild13F9359B:ExportsOutputFnGetAttMyChildResourceAttributeOfChildResource52813264' },
          },
        },
      },
    });

    expect(assembly.getStackByName(childStack.stackName).template).toEqual({
      Resources: { MyChildResource: { Type: 'Resource::Child' } },
      Outputs: {
        ExportsOutputFnGetAttMyChildResourceAttributeOfChildResource52813264: {
          Value: { 'Fn::GetAtt': ['MyChildResource', 'AttributeOfChildResource'] },
          Export: { Name: 'parentchild13F9359B:ExportsOutputFnGetAttMyChildResourceAttributeOfChildResource52813264' },
        },
      },
    });
  });

  test('cannot create cyclic reference between stacks', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');
    const account2 = new ScopedAws(stack2).accountId;

    // WHEN
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });
    new CfnParameter(stack1, 'SomeParameter', { type: 'String', default: account2 });

    expect(() => {
      app.synth();
      // eslint-disable-next-line max-len
    }).toThrow("'Stack1' depends on 'Stack2' (Stack1 -> Stack2.AWS::AccountId). Adding this dependency (Stack2 -> Stack1.AWS::AccountId) would create a cyclic reference.");
  });

  test('stacks know about their dependencies', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });

    app.synth();

    // THEN
    expect(stack2.dependencies.map(s => s.node.id)).toEqual(['Stack1']);
  });

  test('cannot create references to stacks in other regions/accounts', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', { env: { account: '123456789012', region: 'es-norst-1' } });
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2', { env: { account: '123456789012', region: 'es-norst-2' } });

    // WHEN
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });

    expect(() => {
      app.synth();
    }).toThrow(/Stack "Stack2" cannot consume a cross reference from stack "Stack1"/);
  });

  test('urlSuffix does not imply a stack dependency', () => {
    // GIVEN
    const app = new App();
    const first = new Stack(app, 'First');
    const second = new Stack(app, 'Second');

    // WHEN
    new CfnOutput(second, 'Output', {
      value: first.urlSuffix,
    });

    // THEN
    app.synth();

    expect(second.dependencies.length).toEqual(0);
  });

  test('stack with region supplied via props returns literal value', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack1', { env: { account: '123456789012', region: 'es-norst-1' } });

    // THEN
    expect(stack.resolve(stack.region)).toEqual('es-norst-1');
  });

  test('overrideLogicalId(id) can be used to override the logical ID of a resource', () => {
    // GIVEN
    const stack = new Stack();
    const bonjour = new CfnResource(stack, 'BonjourResource', { type: 'Resource::Type' });

    // { Ref } and { GetAtt }
    new CfnResource(stack, 'RefToBonjour', {
      type: 'Other::Resource',
      properties: {
        RefToBonjour: bonjour.ref,
        GetAttBonjour: bonjour.getAtt('TheAtt').toString(),
      },
    });

    bonjour.overrideLogicalId('BOOM');

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Resources:
      {
        BOOM: { Type: 'Resource::Type' },
        RefToBonjour:
         {
           Type: 'Other::Resource',
           Properties:
            {
              RefToBonjour: { Ref: 'BOOM' },
              GetAttBonjour: { 'Fn::GetAtt': ['BOOM', 'TheAtt'] },
            },
         },
      },
    });
  });

  test('Stack name can be overridden via properties', () => {
    // WHEN
    const stack = new Stack(undefined, 'Stack', { stackName: 'otherName' });

    // THEN
    expect(stack.stackName).toEqual('otherName');
  });

  test('Stack name is inherited from App name if available', () => {
    // WHEN
    const root = new App();
    const app = new Construct(root, 'Prod');
    const stack = new Stack(app, 'Stack');

    // THEN
    expect(stack.stackName).toEqual('ProdStackD5279B22');
  });

  test('generated stack names exceeding 128 characters will have the longest duplicated substring removed', () => {
    // WHEN
    const root = new App();
    const app = new Construct(root, 'ProdAppThisNameButItWillOnlyBeTooLongWhenCombinedWithTheStackName');
    const stack = new Stack(app, 'ThisNameIsVeryLongButItWillOnlyBeTooLongWhenCombinedWithTheAppNameStack');

    // THEN
    expect(stack.stackName.length).toEqual(103);
    expect(stack.stackName).toEqual('ProdAppThisNameStackNameThisNameIsVeryLongButItWillOnlyBeTooLongWhenCombinedWithTheAppNameStack845473AA');
  });

  test('generated stack names will not exceed 128 characters, even after the longest duplicated substring has been removed', () => {
    // WHEN
    const root = new App();
    const app = new Construct(root, 'ProdAppThisNameButItWillOnlyBeTooLongWhenCombinedWithTheStackNamezzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
    const stack = new Stack(app, 'ThisNameIsVeryLongButItWillOnlyBeTooLongWhenCombinedWithTheAppNameStackzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');

    // THEN
    expect(stack.stackName.length).toEqual(128);
    expect(stack.stackName).toEqual('ProdAppThisNameButItWillOnlyBeTooLongWhenCombinedWithTheStackNamezThisNameIsVeryLongButItWillOnlyBeTooLongWhenCombinedWiC2172B29');
  });

  test('stack construct id does not go through stack name validation if there is an explicit stack name', () => {
    // GIVEN
    const app = new App();

    // WHEN
    const stack = new Stack(app, 'invalid as : stack name, but thats fine', {
      stackName: 'valid-stack-name',
    });

    // THEN
    const session = app.synth();
    expect(stack.stackName).toEqual('valid-stack-name');
    expect(session.tryGetArtifact(stack.artifactId)).toBeDefined();
  });

  test('stack validation is performed on explicit stack name', () => {
    // GIVEN
    const app = new App();

    // THEN
    expect(() => new Stack(app, 'boom', { stackName: 'invalid:stack:name' }))
      .toThrow(/Stack name must match the regular expression/);
  });

  test('Stack.of(stack) returns the correct stack', () => {
    const stack = new Stack();
    expect(Stack.of(stack)).toBe(stack);
    const parent = new Construct(stack, 'Parent');
    const construct = new Construct(parent, 'Construct');
    expect(Stack.of(construct)).toBe(stack);
  });

  test('Stack.of() throws when there is no parent Stack', () => {
    const root = new Construct(undefined as any, 'Root');
    const construct = new Construct(root, 'Construct');
    expect(() => Stack.of(construct)).toThrow(/should be created in the scope of a Stack, but no Stack found/);
  });

  test('Stack.of() works for substacks', () => {
    // GIVEN
    const app = new App();

    // WHEN
    const parentStack = new Stack(app, 'ParentStack');
    const parentResource = new CfnResource(parentStack, 'ParentResource', { type: 'parent::resource' });

    // we will define a substack under the /resource/... just for giggles.
    const childStack = new Stack(parentResource, 'ChildStack');
    const childResource = new CfnResource(childStack, 'ChildResource', { type: 'child::resource' });

    // THEN
    expect(Stack.of(parentStack)).toBe(parentStack);
    expect(Stack.of(parentResource)).toBe(parentStack);
    expect(Stack.of(childStack)).toBe(childStack);
    expect(Stack.of(childResource)).toBe(childStack);
  });

  test('stack.availabilityZones falls back to Fn::GetAZ[0],[2] if region is not specified', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    const azs = stack.availabilityZones;

    // THEN
    expect(stack.resolve(azs)).toEqual([
      { 'Fn::Select': [0, { 'Fn::GetAZs': '' }] },
      { 'Fn::Select': [1, { 'Fn::GetAZs': '' }] },
    ]);
  });

  describe('@aws-cdk/core:enableStackNameDuplicates', () => {

    describe('disabled (default)', () => {

      testLegacyBehavior('stack.templateFile is the name of the template file emitted to the cloud assembly (default is to use the stack name)', App, (app) => {
        // WHEN
        const stack1 = new Stack(app, 'MyStack1');
        const stack2 = new Stack(app, 'MyStack2', { stackName: 'MyRealStack2' });

        // THEN
        expect(stack1.templateFile).toEqual('MyStack1.template.json');
        expect(stack2.templateFile).toEqual('MyRealStack2.template.json');

      });

      testLegacyBehavior('artifactId and templateFile use the stack name', App, (app) => {
        // WHEN
        const stack1 = new Stack(app, 'MyStack1', { stackName: 'thestack' });
        const assembly = app.synth();

        // THEN
        expect(stack1.artifactId).toEqual('thestack');
        expect(stack1.templateFile).toEqual('thestack.template.json');
        expect(assembly.getStackArtifact(stack1.artifactId).templateFile).toEqual('thestack.template.json');
      });
    });

    describe('enabled', () => {
      const flags = { [cxapi.ENABLE_STACK_NAME_DUPLICATES_CONTEXT]: 'true' };
      testFutureBehavior('allows using the same stack name for two stacks (i.e. in different regions)', flags, App, (app) => {
        // WHEN
        const stack1 = new Stack(app, 'MyStack1', { stackName: 'thestack' });
        const stack2 = new Stack(app, 'MyStack2', { stackName: 'thestack' });
        const assembly = app.synth();

        // THEN
        expect(assembly.getStackArtifact(stack1.artifactId).templateFile).toEqual('MyStack1.template.json');
        expect(assembly.getStackArtifact(stack2.artifactId).templateFile).toEqual('MyStack2.template.json');
        expect(stack1.templateFile).toEqual('MyStack1.template.json');
        expect(stack2.templateFile).toEqual('MyStack2.template.json');
      });

      testFutureBehavior('artifactId and templateFile use the unique id and not the stack name', flags, App, (app) => {
        // WHEN
        const stack1 = new Stack(app, 'MyStack1', { stackName: 'thestack' });
        const assembly = app.synth();

        // THEN
        expect(stack1.artifactId).toEqual('MyStack1');
        expect(stack1.templateFile).toEqual('MyStack1.template.json');
        expect(assembly.getStackArtifact(stack1.artifactId).templateFile).toEqual('MyStack1.template.json');
      });

      testFutureBehavior('when feature flag is enabled we will use the artifact id as the template name', flags, App, (app) => {
        // WHEN
        const stack1 = new Stack(app, 'MyStack1');
        const stack2 = new Stack(app, 'MyStack2', { stackName: 'MyRealStack2' });

        // THEN
        expect(stack1.templateFile).toEqual('MyStack1.template.json');
        expect(stack2.templateFile).toEqual('MyStack2.template.json');
      });
    });
  });

  test('metadata is collected at the stack boundary', () => {
    // GIVEN
    const app = new App({
      context: {
        [cxapi.DISABLE_METADATA_STACK_TRACE]: 'true',
      },
    });
    const parent = new Stack(app, 'parent');
    const child = new Stack(parent, 'child');

    // WHEN
    child.node.addMetadata('foo', 'bar');

    // THEN
    const asm = app.synth();
    expect(asm.getStackByName(parent.stackName).findMetadataByType('foo')).toEqual([]);
    expect(asm.getStackByName(child.stackName).findMetadataByType('foo')).toEqual([
      { path: '/parent/child', type: 'foo', data: 'bar' },
    ]);
  });

  test('stack tags are reflected in the stack cloud assembly artifact metadata', () => {
    // GIVEN
    const app = new App({ stackTraces: false, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });

    const stack1 = new Stack(app, 'stack1');
    const stack2 = new Stack(stack1, 'stack2');

    // WHEN
    Tags.of(app).add('foo', 'bar');

    // THEN
    const asm = app.synth();
    const expected = [
      {
        type: 'aws:cdk:stack-tags',
        data: [{ key: 'foo', value: 'bar' }],
      },
    ];

    expect(asm.getStackArtifact(stack1.artifactId).manifest.metadata).toEqual({ '/stack1': expected });
    expect(asm.getStackArtifact(stack2.artifactId).manifest.metadata).toEqual({ '/stack1/stack2': expected });
  });

  test('stack tags are reflected in the stack artifact properties', () => {
    // GIVEN
    const app = new App({ stackTraces: false });
    const stack1 = new Stack(app, 'stack1');
    const stack2 = new Stack(stack1, 'stack2');

    // WHEN
    Tags.of(app).add('foo', 'bar');

    // THEN
    const asm = app.synth();
    const expected = { foo: 'bar' };

    expect(asm.getStackArtifact(stack1.artifactId).tags).toEqual(expected);
    expect(asm.getStackArtifact(stack2.artifactId).tags).toEqual(expected);
  });

  test('Termination Protection is reflected in Cloud Assembly artifact', () => {
    // if the root is an app, invoke "synth" to avoid double synthesis
    const app = new App();
    const stack = new Stack(app, 'Stack', { terminationProtection: true });

    const assembly = app.synth();
    const artifact = assembly.getStackArtifact(stack.artifactId);

    expect(artifact.terminationProtection).toEqual(true);
  });

  test('context can be set on a stack using a LegacySynthesizer', () => {
    // WHEN
    const stack = new Stack(undefined, undefined, {
      synthesizer: new LegacyStackSynthesizer(),
    });
    stack.node.setContext('something', 'value');

    // THEN: no exception
  });

  test('context can be set on a stack using a DefaultSynthesizer', () => {
    // WHEN
    const stack = new Stack(undefined, undefined, {
      synthesizer: new DefaultStackSynthesizer(),
    });
    stack.node.setContext('something', 'value');

    // THEN: no exception
  });

  test('version reporting can be configured on the app', () => {
    const app = new App({ analyticsReporting: true });
    expect(new Stack(app, 'Stack')._versionReportingEnabled).toBeDefined();
  });

  test('version reporting can be configured with context', () => {
    const app = new App({ context: { 'aws:cdk:version-reporting': true } });
    expect(new Stack(app, 'Stack')._versionReportingEnabled).toBeDefined();
  });

  test('version reporting can be configured on the stack', () => {
    const app = new App();
    expect(new Stack(app, 'Stack', { analyticsReporting: true })._versionReportingEnabled).toBeDefined();
  });

  test('requires bundling when wildcard is specified in BUNDLING_STACKS', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['*']);
    expect(stack.bundlingRequired).toBe(true);
  });

  test('requires bundling when stackName has an exact match in BUNDLING_STACKS', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['Stack']);
    expect(stack.bundlingRequired).toBe(true);
  });

  test('does not require bundling when no item from BUILDING_STACKS matches stackName', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['Stac']);
    expect(stack.bundlingRequired).toBe(false);

  });

  test('does not require bundling when BUNDLING_STACKS is empty', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, []);
    expect(stack.bundlingRequired).toBe(false);

  });
});

describe('regionalFact', () => {
  Fact.register({ name: 'MyFact', region: 'us-east-1', value: 'x.amazonaws.com' });
  Fact.register({ name: 'MyFact', region: 'eu-west-1', value: 'x.amazonaws.com' });
  Fact.register({ name: 'MyFact', region: 'cn-north-1', value: 'x.amazonaws.com.cn' });

  Fact.register({ name: 'WeirdFact', region: 'us-east-1', value: 'oneformat' });
  Fact.register({ name: 'WeirdFact', region: 'eu-west-1', value: 'otherformat' });

  test('regional facts return a literal value if possible', () => {
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });
    expect(stack.regionalFact('MyFact')).toEqual('x.amazonaws.com');
  });

  test('regional facts are simplified to use URL_SUFFIX token if possible', () => {
    const stack = new Stack();
    expect(stack.regionalFact('MyFact')).toEqual(`x.${Aws.URL_SUFFIX}`);
  });

  test('regional facts are simplified to use concrete values if URL_SUFFIX token is not necessary', () => {
    const stack = new Stack();
    Node.of(stack).setContext(cxapi.TARGET_PARTITIONS, ['aws']);
    expect(stack.regionalFact('MyFact')).toEqual('x.amazonaws.com');
  });

  test('regional facts generate a mapping if necessary', () => {
    const stack = new Stack();
    new CfnOutput(stack, 'TheFact', {
      value: stack.regionalFact('WeirdFact'),
    });

    expect(toCloudFormation(stack)).toEqual({
      Mappings: {
        WeirdFactMap: {
          'eu-west-1': { value: 'otherformat' },
          'us-east-1': { value: 'oneformat' },
        },
      },
      Outputs: {
        TheFact: {
          Value: {
            'Fn::FindInMap': [
              'WeirdFactMap',
              { Ref: 'AWS::Region' },
              'value',
            ],
          },
        },
      },
    });
  });
});

class StackWithPostProcessor extends Stack {

  // ...

  public _toCloudFormation() {
    const template = super._toCloudFormation();

    // manipulate template (e.g. rename "Key" to "key")
    template.Resources.myResource.Properties.Environment.key =
      template.Resources.myResource.Properties.Environment.Key;
    delete template.Resources.myResource.Properties.Environment.Key;

    return template;
  }
}
