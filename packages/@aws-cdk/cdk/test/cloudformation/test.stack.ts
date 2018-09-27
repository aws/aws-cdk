import { Test } from 'nodeunit';
import { App, Condition, Construct, Include, Output, Parameter, Resource, Root, Stack, Token } from '../../lib';

export = {
  'a stack can be serialized into a CloudFormation template, initially it\'s empty'(test: Test) {
    const stack = new Stack();
    test.deepEqual(stack.toCloudFormation(), { });
    test.done();
  },

  'stack objects have some template-level propeties, such as Description, Version, Transform'(test: Test) {
    const stack = new Stack();
    stack.templateOptions.templateFormatVersion = 'MyTemplateVersion';
    stack.templateOptions.description = 'This is my description';
    stack.templateOptions.transform = 'SAMy';
    test.deepEqual(stack.toCloudFormation(), {
      Description: 'This is my description',
      AWSTemplateFormatVersion: 'MyTemplateVersion',
      Transform: 'SAMy'
    });
    test.done();
  },

  'Stack.find(c) can be used to find the stack from any point in the tree'(test: Test) {
    const stack = new Stack();
    const level1 = new Construct(stack, 'level1');
    const level2 = new Construct(level1, 'level2');
    const level3 = new Construct(level2, 'level3');
    const res1 = new Resource(level1, 'childoflevel1', { type: 'MyResourceType1' });
    const res2 = new Resource(level3, 'childoflevel3', { type: 'MyResourceType2' });

    test.equal(Stack.find(res1), stack);
    test.equal(Stack.find(res2), stack);
    test.equal(Stack.find(level2), stack);

    const root = new Root();
    const child = new Construct(root, 'child');

    test.throws(() => Stack.find(child));
    test.throws(() => Stack.find(root));

    test.done();
  },

  'Stack.isStack indicates that a construct is a stack'(test: Test) {
    const stack = new Stack();
    const c = new Construct(stack, 'Construct');
    test.ok(stack.isStack);
    test.ok(!(c as any).isStack);
    test.done();
  },

  'stack.id is not included in the logical identities of resources within it'(test: Test) {
    const stack = new Stack(undefined, 'MyStack');
    new Resource(stack, 'MyResource', { type: 'MyResourceType' });

    test.deepEqual(stack.toCloudFormation(), { Resources: { MyResource: { Type: 'MyResourceType' } } });
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

    test.deepEqual(stack.toCloudFormation(), {
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
  'Overriding `Stack.toCloudFormation` allows arbitrary post-processing of the generated template during synthesis'(test: Test) {

    const stack = new StackWithPostProcessor();

    new Resource(stack, 'myResource', {
      type: 'AWS::MyResource',
      properties: {
        MyProp1: 'hello',
        MyProp2: 'howdy',
        Environment: {
          Key: 'value'
        }
      }
    });

    test.deepEqual(stack.toCloudFormation(), { Resources:
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

    test.ok(!stack.tryFindChild('foo'), 'empty stack');

    const r1 = new Resource(stack, 'Hello', { type: 'MyResource' });
    test.equal(stack.findResource(r1.stackPath), r1, 'look up top-level');

    const child = new Construct(stack, 'Child');
    const r2 = new Resource(child, 'Hello', { type: 'MyResource' });

    test.equal(stack.findResource(r2.stackPath), r2, 'look up child');

    test.done();
  },

  'Stack.findResource will fail if the element is not a resource'(test: Test) {
    const stack = new Stack();

    const p = new Parameter(stack, 'MyParam', { type: 'String' });

    test.throws(() => stack.findResource(p.path));
    test.done();
  },

  'Stack.getByPath can be used to find any CloudFormation element (Parameter, Output, etc)'(test: Test) {

    const stack = new Stack();

    const p = new Parameter(stack, 'MyParam', { type: 'String' });
    const o = new Output(stack, 'MyOutput');
    const c = new Condition(stack, 'MyCondition');

    test.equal(stack.findChild(p.path), p);
    test.equal(stack.findChild(o.path), o);
    test.equal(stack.findChild(c.path), c);

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

    const output = stack.toCloudFormation();

    test.equal(typeof output.Description, 'string');
    test.done();
  },

  'Can\'t add children during synthesis'(test: Test) {
    const stack = new Stack();

    // add a construct with a token that when resolved adds a child. this
    // means that this child is going to be added during synthesis and this
    // is a no-no.
    new Resource(stack, 'Resource', { type: 'T', properties: {
      foo: new Token(() => new Construct(stack, 'Foo'))
    }});

    test.throws(() => stack.toCloudFormation(), /Cannot add children during synthesis/);

    // okay to add after synthesis
    new Construct(stack, 'C1');

    test.done();
  },
};

class StackWithPostProcessor extends Stack {

  // ...

  public toCloudFormation() {
    const template = super.toCloudFormation();

    // manipulate template (e.g. rename "Key" to "key")
    template.Resources.myResource.Properties.Environment.key =
      template.Resources.myResource.Properties.Environment.Key;
    delete template.Resources.myResource.Properties.Environment.Key;

    return template;
  }
}
