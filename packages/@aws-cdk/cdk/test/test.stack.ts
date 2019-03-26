import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { App, CfnCondition, CfnOutput, CfnParameter, CfnResource, Construct, Include, ScopedAws, Stack, Token } from '../lib';

export = {
  'a stack can be serialized into a CloudFormation template, initially it\'s empty'(test: Test) {
    const stack = new Stack();
    test.deepEqual(stack._toCloudFormation(), { });
    test.done();
  },

  'stack objects have some template-level propeties, such as Description, Version, Transform'(test: Test) {
    const stack = new Stack();
    stack.templateOptions.templateFormatVersion = 'MyTemplateVersion';
    stack.templateOptions.description = 'This is my description';
    stack.templateOptions.transform = 'SAMy';
    test.deepEqual(stack._toCloudFormation(), {
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

    test.deepEqual(stack._toCloudFormation(), { Resources: { MyResource: { Type: 'MyResourceType' } } });
    test.done();
  },

  'stack.templateOptions can be used to set template-level options'(test: Test) {
    const stack = new Stack();

    stack.templateOptions.description = 'StackDescription';
    stack.templateOptions.templateFormatVersion = 'TemplateVersion';
    stack.templateOptions.transform = 'Transform';
    stack.templateOptions.metadata = {
      MetadataKey: 'MetadataValue'
    };

    test.deepEqual(stack._toCloudFormation(), {
      Description: 'StackDescription',
      Transform: 'Transform',
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

  'Construct.findResource(logicalId) can be used to retrieve a resource by its path'(test: Test) {
    const stack = new Stack();

    test.ok(!stack.node.tryFindChild('foo'), 'empty stack');

    const r1 = new CfnResource(stack, 'Hello', { type: 'MyResource' });
    test.equal(stack.findResource(r1.stackPath), r1, 'look up top-level');

    const child = new Construct(stack, 'Child');
    const r2 = new CfnResource(child, 'Hello', { type: 'MyResource' });

    test.equal(stack.findResource(r2.stackPath), r2, 'look up child');

    test.done();
  },

  'Stack.findResource will fail if the element is not a resource'(test: Test) {
    const stack = new Stack();

    const p = new CfnParameter(stack, 'MyParam', { type: 'String' });

    test.throws(() => stack.findResource(p.node.path));
    test.done();
  },

  'Stack.getByPath can be used to find any CloudFormation element (Parameter, Output, etc)'(test: Test) {

    const stack = new Stack();

    const p = new CfnParameter(stack, 'MyParam', { type: 'String' });
    const o = new CfnOutput(stack, 'MyOutput');
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

    new Include(stack, 'Include', { template });

    const output = stack._toCloudFormation();

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
    // Need to do this manually now, since we're in testing mode. In a normal CDK app,
    // this happens as part of app.run().
    app.node.prepareTree();

    test.deepEqual(stack1._toCloudFormation(), {
      Outputs: {
        ExportsOutputRefAWSAccountIdAD568057: {
          Value: { Ref: 'AWS::AccountId' },
          Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
        }
      }
    });

    test.deepEqual(stack2._toCloudFormation(), {
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
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
    new CfnParameter(stack2, 'SomeParameter', { type: 'String', default: new Token(() => account1) });

    app.node.prepareTree();

    // THEN
    test.deepEqual(stack1._toCloudFormation(), {
      Outputs: {
        ExportsOutputRefAWSAccountIdAD568057: {
          Value: { Ref: 'AWS::AccountId' },
          Export: { Name: 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
        }
      }
    });

    test.deepEqual(stack2._toCloudFormation(), {
      Parameters: {
        SomeParameter: {
          Type: 'String',
          Default: { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSAccountIdAD568057' }
        }
      }
    });

    test.done();
  },

  'Cross-stack use of Region returns nonscoped intrinsic'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');

    // WHEN - used in another stack
    new CfnOutput(stack2, 'DemOutput', { value: stack1.region });

    // THEN
    // Need to do this manually now, since we're in testing mode. In a normal CDK app,
    // this happens as part of app.run().
    app.node.prepareTree();

    test.deepEqual(stack2._toCloudFormation(), {
      Outputs: {
        DemOutput: {
          Value: { Ref: 'AWS::Region' },
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

    app.node.prepareTree();

    // THEN
    test.deepEqual(stack2._toCloudFormation(), {
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
      app.node.prepareTree();
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

    app.node.prepareTree();

    // THEN
    test.deepEqual(stack2.dependencies().map(s => s.node.id), ['Stack1']);

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
      app.node.prepareTree();
    }, /Can only reference cross stacks in the same region and account/);

    test.done();
  },

  'stack with region supplied via props returns literal value'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack1', { env: { account: '123456789012', region: 'es-norst-1' }});

    // THEN
    test.equal(stack.node.resolve(stack.region), 'es-norst-1');

    test.done();
  },

  'stack with region supplied via context returns symbolic value'(test: Test) {
    // GIVEN
    const app = new App();

    app.node.setContext(cxapi.DEFAULT_REGION_CONTEXT_KEY, 'es-norst-1');
    const stack = new Stack(app, 'Stack1');

    // THEN
    test.deepEqual(stack.node.resolve(stack.region), { Ref: 'AWS::Region' });

    test.done();
  },

  'overrideLogicalId(id) can be used to override the logical ID of a resource'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const bonjour = new CfnResource(stack, 'BonjourResource', { type: 'Resource::Type' });

    // { Ref } and { GetAtt }
    new CfnResource(stack, 'RefToBonjour', { type: 'Other::Resource', properties: {
      RefToBonjour: bonjour.ref.toString(),
      GetAttBonjour: bonjour.getAtt('TheAtt').toString()
    }});

    bonjour.overrideLogicalId('BOOM');

    // THEN
    test.deepEqual(stack._toCloudFormation(), { Resources:
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
    test.deepEqual(stack.name, 'otherName');

    test.done();
  },

  'Stack name is inherited from App name if available'(test: Test) {
    // WHEN
    const root = new App();
    const app = new Construct(root, 'Prod');
    const stack = new Stack(app, 'Stack');

    // THEN
    test.deepEqual(stack.name, 'ProdStackD5279B22');

    test.done();
  },
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
