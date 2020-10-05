import { nodeunitShim, Test } from 'nodeunit-shim';
import { CfnElement, CfnResource, Construct, Stack } from '../lib';
import { toCloudFormation } from './util';

/**
 * These tests are executed once (for specific ID schemes)
 */
nodeunitShim({
  'if the naming scheme uniquifies with a hash we can have the same concatenated identifier'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack');

    const A = new Construct(stack, 'A');
    new CfnResource(A, 'BC', { type: 'Resource' });

    // WHEN
    const AB = new Construct(stack, 'AB');
    new CfnResource(AB, 'C', { type: 'Resource' });

    // THEN: no exception

    test.done();
  },

  'special case: if the resource is top-level, a hash is not added'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack');

    // WHEN
    const r = new CfnResource(stack, 'MyAwesomeness', { type: 'Resource' });
    const r2 = new CfnResource(stack, 'x'.repeat(255), { type: 'Resource' }); // max length
    const r3 = new CfnResource(stack, '*y-'.repeat(255), { type: 'Resource' }); // non-alpha are filtered out (yes, I know it might conflict)

    // THEN
    test.equal(stack.resolve(r.logicalId), 'MyAwesomeness');
    test.equal(stack.resolve(r2.logicalId), 'x'.repeat(255));
    test.equal(stack.resolve(r3.logicalId), 'y'.repeat(255));

    test.done();
  },

  'if resource is top-level and logical id is longer than allowed, it is trimmed with a hash'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack');

    // WHEN
    const r = new CfnResource(stack, 'x'.repeat(256), { type: 'Resource' });

    // THEN
    test.equals(stack.resolve(r.logicalId), 'x'.repeat(240) + 'C7A139A2');
    test.done();
  },

  'Logical IDs can be renamed at the stack level'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const parent = new Construct(stack, 'Parent');
    new CfnResource(parent, 'ThingResource', { type: 'AWS::TAAS::Thing' });
    stack.renameLogicalId('ParentThingResource75D1D9CB', 'Renamed');

    // THEN
    const template = toCloudFormation(stack);
    test.ok('Renamed' in template.Resources);

    test.done();
  },

  'Renames for objects that don\'t exist fail'(test: Test) {
    // GIVEN
    const stack = new Stack();
    new Construct(stack, 'Parent');

    // WHEN
    stack.renameLogicalId('DOESNOTEXIST', 'Renamed');

    // THEN
    test.throws(() => toCloudFormation(stack));

    test.done();
  },

  'ID Renames that collide with existing IDs should fail'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.renameLogicalId('ParentThingResource1916E7808', 'ParentThingResource2F19948CB');

    // WHEN
    const parent = new Construct(stack, 'Parent');
    new CfnResource(parent, 'ThingResource1', { type: 'AWS::TAAS::Thing' });
    new CfnResource(parent, 'ThingResource2', { type: 'AWS::TAAS::Thing' });

    // THEN
    test.throws(() => toCloudFormation(stack), /Two objects have been assigned the same Logical ID/);
    test.done();
  },

  'hashed naming scheme filters constructs named "Resource" from the human portion'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const parent = new Construct(stack, 'Parent');
    const child1 = new Construct(parent, 'Child');
    const child2 = new Construct(child1, 'Resource');

    new CfnResource(child2, 'HeyThere', { type: 'AWS::TAAS::Thing' });

    // THEN
    const template = toCloudFormation(stack);
    test.deepEqual(template, {
      Resources: {
        ParentChildHeyThere35220347: {
          Type: 'AWS::TAAS::Thing',
        },
      },
    });

    test.done();
  },

  'can transparently wrap constructs using "Default" id'(test: Test) {
    // GIVEN
    const stack1 = new Stack();
    const parent1 = new Construct(stack1, 'Parent');
    new CfnResource(parent1, 'HeyThere', { type: 'AWS::TAAS::Thing' });
    const template1 = toCloudFormation(stack1);

    // AND
    const theId1 = Object.keys(template1.Resources)[0];
    test.equal('AWS::TAAS::Thing', template1.Resources[theId1].Type);

    // WHEN
    const stack2 = new Stack();
    const parent2 = new Construct(stack2, 'Parent');
    const invisibleWrapper = new Construct(parent2, 'Default');
    new CfnResource(invisibleWrapper, 'HeyThere', { type: 'AWS::TAAS::Thing' });
    const template2 = toCloudFormation(stack1);

    const theId2 = Object.keys(template2.Resources)[0];
    test.equal('AWS::TAAS::Thing', template2.Resources[theId2].Type);

    // THEN: same ID, same object
    test.equal(theId1, theId2);

    test.done();
  },

  'non-alphanumeric characters are removed from the human part of the logical ID'(test: Test) {
    const val1 = logicalForElementInPath(['Foo-bar', 'B00m', 'Hello_World', '&&Horray Horray.']);
    const val2 = logicalForElementInPath(['Foobar', 'B00m', 'HelloWorld', 'HorrayHorray']);

    // same human part, different hash
    test.deepEqual(val1, 'FoobarB00mHelloWorldHorrayHorray640E99FB');
    test.deepEqual(val2, 'FoobarB00mHelloWorldHorrayHorray744334FD');
    test.done();
  },

  'non-alphanumeric characters are removed even if the ID has only one component'(test: Test) {
    const val1 = logicalForElementInPath(['Foo-bar']);

    // same human part, different hash
    test.deepEqual(val1, 'Foobar');
    test.done();
  },

  'empty identifiers are not allowed'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CfnResource(stack, '.', { type: 'R' });

    // THEN
    test.throws(() => toCloudFormation(stack), /Logical ID must adhere to the regular expression/);
    test.done();
  },

  'too large identifiers are truncated yet still remain unique'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const A = new Construct(stack, generateString(100));
    const B = new Construct(A, generateString(100));

    // WHEN
    const firstPart = generateString(60);
    // The shared part has now exceeded the maximum length of CloudFormation identifiers
    // so the identity generator will have to something smart

    const C1 = new CfnResource(B, firstPart + generateString(40), { type: 'Resource' });
    const C2 = new CfnResource(B, firstPart + generateString(40), { type: 'Resource' });

    // THEN
    test.ok(C1.logicalId.length <= 255);
    test.ok(C2.logicalId.length <= 255);
    test.notEqual(C1, C2);

    test.done();
  },

  'Refs and dependencies will correctly reflect renames done at the stack level'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.renameLogicalId('OriginalName', 'NewName');

    // WHEN
    const c1 = new CfnResource(stack, 'OriginalName', { type: 'R1' });
    const ref = c1.ref;

    const c2 = new CfnResource(stack, 'Construct2', { type: 'R2', properties: { ReferenceToR1: ref } });
    c2.node.addDependency(c1);

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        NewName: { Type: 'R1' },
        Construct2: {
          Type: 'R2',
          Properties: { ReferenceToR1: { Ref: 'NewName' } },
          DependsOn: ['NewName'],
        },
      },
    });

    test.done();
  },

  'customize logical id allocation behavior by overriding `Stack.allocateLogicalId`'(test: Test) {
    class MyStack extends Stack {
      protected allocateLogicalId(element: CfnElement): string {
        if (element.node.id === 'A') { return 'LogicalIdOfA'; }
        if (element.node.id === 'B') { return 'LogicalIdOfB'; }
        throw new Error('Invalid element ID');
      }
    }

    const stack = new MyStack();
    new CfnResource(stack, 'A', { type: 'Type::Of::A' });
    const group = new Construct(stack, 'Group');
    new CfnResource(group, 'B', { type: 'Type::Of::B' });

    // renames can also be applied on custom logical IDs.
    stack.renameLogicalId('LogicalIdOfB', 'BoomBoomB');

    const c = new CfnResource(stack, 'B', { type: 'Type::Of::C' });
    c.overrideLogicalId('TheC');

    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        LogicalIdOfA: { Type: 'Type::Of::A' },
        BoomBoomB: { Type: 'Type::Of::B' },
        TheC: { Type: 'Type::Of::C' },
      },
    });
    test.done();
  },

  'detects duplicate logical IDs in the same Stack caused by overrideLogicalId'(test: Test) {
    const stack = new Stack();
    const resource1 = new CfnResource(stack, 'A', { type: 'Type::Of::A' });
    const resource2 = new CfnResource(stack, 'B', { type: 'Type::Of::B' });

    resource1.overrideLogicalId('C');
    resource2.overrideLogicalId('C');

    test.throws(() => {
      toCloudFormation(stack);
    }, /section 'Resources' already contains 'C'/);

    test.done();
  },
});

function generateString(chars: number) {
  let s = '';
  for (let i = 0; i < chars; ++i) {
    s += randomAlpha();
  }
  return s;

  function randomAlpha() {
    return String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * 26));
  }
}

function logicalForElementInPath(constructPath: string[]): string {
  const stack = new Stack();
  let scope: Construct = stack;
  for (const component of constructPath) {
    scope = new CfnResource(scope, component, { type: 'Foo' });
  }

  return stack.resolve((scope as CfnResource).logicalId);
}
