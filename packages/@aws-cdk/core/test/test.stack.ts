import { Test } from 'nodeunit';
import { App, CfnCondition, CfnInclude, CfnOutput, CfnParameter, CfnResource, Construct, ConstructNode, Lazy, ScopedAws, Stack } from '../lib';
import { Intrinsic } from '../lib/private/intrinsic';
import { toCloudFormation } from './util';

export = {
  'a stack can be serialized into a CloudFormation template, initially it\'s empty'(test: Test) {
    const stack = new Stack();
    test.deepEqual(toCloudFormation(stack), { });
    test.done();
  },

  'stack objects have some template-level propeties, such as Description, Version, Transform'(test: Test) {
    const stack = new Stack();
    stack.templateOptions.templateFormatVersion = 'MyTemplateVersion';
    stack.templateOptions.description = 'This is my description';
    stack.templateOptions.transform = 'SAMy';
    test.deepEqual(toCloudFormation(stack), {
      Description: 'This is my description',
      AWSTemplateFormatVersion: 'MyTemplateVersion',
      Transform: 'SAMy'
    });
    test.done();
  },

  'Stack.isStack indicates that a construct is a stack'(test: Test) {
    const stack = new Stack();
    const c = new Construct(stack, 'Construct');
    test.ok(Stack.isStack(stack));
    test.ok(!Stack.isStack(c));
    test.done();
  },

  'stack.id is not included in the logical identities of resources within it'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    new CfnResource(stack, 'MyResource', { type: 'MyResourceType' });

    test.deepEqual(toCloudFormation(stack), { Resources: { MyResource: { Type: 'MyResourceType' } } });
    test.done();
  },

  'stack.templateOptions can be used to set template-level options'(test: Test) {
    const stack = new Stack();

    stack.templateOptions.description = 'StackDescription';
    stack.templateOptions.templateFormatVersion = 'TemplateVersion';
    stack.templateOptions.transform = 'DeprecatedField';
    stack.templateOptions.transforms = ['Transform'];
    stack.templateOptions.metadata = {
      MetadataKey: 'MetadataValue'
    };

    test.deepEqual(toCloudFormation(stack), {
      Description: 'StackDescription',
      Transform: ['DeprecatedField', 'Transform'],
      AWSTemplateFormatVersion: 'TemplateVersion',
      Metadata: { MetadataKey: 'MetadataValue' }
    });

    test.done();
  },

  // This approach will only apply to TypeScript code, but at least it's a temporary
  // workaround for people running into issues caused by SDK-3003.
  // We should come up with a proper solution that involved jsii callbacks (when they exist)
  // so this can be implemented by jsii languages as well.
  'Overriding `Stack._toCloudFormation` allows arbitrary post-processing of the generated template during synthesis'(test: Test) {

    const stack = new StackWithPostProcessor();

    new CfnResource(stack, 'myResource', {
      type: 'AWS::MyResource',
      properties: {
        MyProp1: 'hello',
        MyProp2: 'howdy',
        Environment: {
          Key: 'value'
        }
      }
    });

    test.deepEqual(stack._toCloudFormation(), { Resources:
      { myResource:
         { Type: 'AWS::MyResource',
         Properties:
          { MyProp1: 'hello',
          MyProp2: 'howdy',
          Environment: { key: 'value' } } } } });

    test.done();
  },

  'Stack.getByPath can be used to find any CloudFormation element (Parameter, Output, etc)'(test: Test) {

    const stack = new Stack();

    const p = new CfnParameter(stack, 'MyParam', { type: 'String' });
    const o = new CfnOutput(stack, 'MyOutput', { value: 'boom' });
    const c = new CfnCondition(stack, 'MyCondition');

    test.equal(stack.node.findChild(p.node.path), p);
    test.equal(stack.node.findChild(o.node.path), o);
    test.equal(stack.node.findChild(c.node.path), c);

    test.done();
  },

  'Stack names can have hyphens in them'(test: Test) {
    const root = new App();

    new Stack(root, 'Hello-World');
    // Did not throw

    test.done();
  },

  'Include should support non-hash top-level template elements like "Description"'(test: Test) {
    const stack = new Stack();

    const template = {
      Description: 'hello, world'
    };

    new CfnInclude(stack, 'Include', { template });

    const output = toCloudFormation(stack);

    test.equal(typeof output.Description, 'string');
    test.done();
  },

  'Pseudo values attached to one stack can be referenced in another stack'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });

    // THEN
    const assembly = app.synth();
    const template1 = assembly.getStack(stack1.stackName).template;
    const template2 = assembly.getStack(stack2.stackName).template;

    test.deepEqual(template1, {
      Outputs: {
        ExportsOutputRefAWSAccountIdAD568057: {
          Value: { Ref: 'AWS::AccountId' },
          Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
        }
      }
    });

    test.deepEqual(template2, {
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
        }
      }
    });

    test.done();
  },

  'Cross-stack references are detected in resource properties'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const resource1 = new CfnResource(stack1, 'Resource', { type: 'BLA' });
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another resource
    new CfnResource(stack2, 'SomeResource', { type: 'AWS::Some::Resource', properties: {
      someProperty: new Intrinsic(resource1.ref),
    }});

    // THEN
    const assembly = app.synth();
    const template2 = assembly.getStack(stack2.stackName).template;

    test.deepEqual(template2, {
      Resources: {
        SomeResource: {
          Type: 'AWS::Some::Resource',
          Properties: {
            someProperty: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefResource1D5D905A' }
          }
        }
      }
    });
    test.done();
  },

  'cross-stack references in lazy tokens work'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: Lazy.stringValue({ produce: () => account1 }) });

    const assembly = app.synth();
    const template1 = assembly.getStack(stack1.stackName).template;
    const template2 = assembly.getStack(stack2.stackName).template;

    // THEN
    test.deepEqual(template1, {
      Outputs: {
        ExportsOutputRefAWSAccountIdAD568057: {
          Value: { Ref: 'AWS::AccountId' },
          Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
        }
      }
    });

    test.deepEqual(template2, {
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
        }
      }
    });

    test.done();
  },

  'Cross-stack use of Region and account returns nonscoped intrinsic because the two stacks must be in the same region anyway'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnOutput(stack2, 'DemOutput', { value: stack1.region });
    new CfnOutput(stack2, 'DemAccount', { value: stack1.account });

    // THEN
    const assembly = app.synth();
    const template2 = assembly.getStack(stack2.stackName).template;

    test.deepEqual(template2, {
      Outputs: {
        DemOutput: {
          Value: { Ref: 'AWS::Region' },
        },
        DemAccount: {
          Value: { Ref: 'AWS::AccountId' },
        }
      }
    });

    test.done();
  },

  'cross-stack references in strings work'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: `TheAccountIs${account1}` });

    const assembly = app.synth();
    const template2 = assembly.getStack(stack2.stackName).template;

    // THEN
    test.deepEqual(template2, {
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::Join': [ '', [ 'TheAccountIs', { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' } ]] }
        }
      }
    });

    test.done();
  },

  'cannot create cyclic reference between stacks'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');
    const account2 = new ScopedAws(stack2).accountId;

    // WHEN
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });
    new CfnParameter(stack1, 'SomeParameter', { type: 'String', default: account2 });

    test.throws(() => {
      ConstructNode.prepare(app.node);
      // tslint:disable-next-line:max-line-length
    }, "'Stack2' depends on 'Stack1' (Stack2/SomeParameter -> Stack1.AWS::AccountId). Adding this dependency (Stack1/SomeParameter -> Stack2.AWS::AccountId) would create a cyclic reference.");

    test.done();
  },

  'stacks know about their dependencies'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2');

    // WHEN
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });

    ConstructNode.prepare(app.node);

    // THEN
    test.deepEqual(stack2.dependencies.map(s => s.node.id), ['Stack1']);

    test.done();
  },

  'cannot create references to stacks in other regions/accounts'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', { env: { account: '123456789012', region: 'es-norst-1' }});
    const account1 = new ScopedAws(stack1).accountId;
    const stack2 = new Stack(app, 'Stack2', { env: { account: '123456789012', region: 'es-norst-2' }});

    // WHEN
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: account1 });

    test.throws(() => {
      ConstructNode.prepare(app.node);
    }, /Can only reference cross stacks in the same region and account/);

    test.done();
  },

  'stack with region supplied via props returns literal value'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack1', { env: { account: '123456789012', region: 'es-norst-1' }});

    // THEN
    test.equal(stack.resolve(stack.region), 'es-norst-1');

    test.done();
  },

  'overrideLogicalId(id) can be used to override the logical ID of a resource'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const bonjour = new CfnResource(stack, 'BonjourResource', { type: 'Resource::Type' });

    // { Ref } and { GetAtt }
    new CfnResource(stack, 'RefToBonjour', { type: 'Other::Resource', properties: {
      RefToBonjour: bonjour.ref,
      GetAttBonjour: bonjour.getAtt('TheAtt').toString()
    }});

    bonjour.overrideLogicalId('BOOM');

    // THEN
    test.deepEqual(toCloudFormation(stack), { Resources:
      { BOOM: { Type: 'Resource::Type' },
        RefToBonjour:
         { Type: 'Other::Resource',
           Properties:
            { RefToBonjour: { Ref: 'BOOM' },
              GetAttBonjour: { 'Fn::GetAtt': [ 'BOOM', 'TheAtt' ] } } } } });
    test.done();
  },

  'Stack name can be overridden via properties'(test: Test) {
    // WHEN
    const stack = new Stack(undefined, 'Stack', { stackName: 'otherName' });

    // THEN
    test.deepEqual(stack.stackName, 'otherName');

    test.done();
  },

  'Stack name is inherited from App name if available'(test: Test) {
    // WHEN
    const root = new App();
    const app = new Construct(root, 'Prod');
    const stack = new Stack(app, 'Stack');

    // THEN
    test.deepEqual(stack.stackName, 'ProdStackD5279B22');

    test.done();
  },

  'stack construct id does not go through stack name validation if there is an explicit stack name'(test: Test) {
    // GIVEN
    const app = new App();

    // WHEN
    const stack = new Stack(app, 'invalid as : stack name, but thats fine', {
      stackName: 'valid-stack-name'
    });

    // THEN
    const session = app.synth();
    test.deepEqual(stack.stackName, 'valid-stack-name');
    test.ok(session.tryGetArtifact('valid-stack-name'));
    test.done();
  },

  'stack validation is performed on explicit stack name'(test: Test) {
    // GIVEN
    const app = new App();

    // THEN
    test.throws(() => new Stack(app, 'boom', { stackName: 'invalid:stack:name' }),
      /Stack name must match the regular expression/);

    test.done();
  },

  'Stack.of(stack) returns the correct stack'(test: Test) {
    const stack = new Stack();
    test.same(Stack.of(stack), stack);
    const parent = new Construct(stack, 'Parent');
    const construct = new Construct(parent, 'Construct');
    test.same(Stack.of(construct), stack);
    test.done();
  },

  'Stack.of() throws when there is no parent Stack'(test: Test) {
    const root = new Construct(undefined as any, 'Root');
    const construct = new Construct(root, 'Construct');
    test.throws(() => Stack.of(construct), /No stack could be identified for the construct at path/);
    test.done();
  },

  'stack.availabilityZones falls back to Fn::GetAZ[0],[2] if region is not specified'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    const azs = stack.availabilityZones;

    // THEN
    test.deepEqual(stack.resolve(azs), [
      { "Fn::Select": [ 0, { "Fn::GetAZs": "" } ] },
      { "Fn::Select": [ 1, { "Fn::GetAZs": "" } ] }
    ]);
    test.done();
  }
};

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
