import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { toCloudFormation } from './util';
import { App, CfnElement, CfnResource, Stack } from '../lib';

/**
 * These tests are executed once (for specific ID schemes)
 */
describe('logical id', () => {
  test('if the naming scheme uniquifies with a hash we can have the same concatenated identifier', () => {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack');

    const A = new Construct(stack, 'A');
    new CfnResource(A, 'BC', { type: 'Resource' });

    // WHEN
    const AB = new Construct(stack, 'AB');
    new CfnResource(AB, 'C', { type: 'Resource' });

    // THEN: no exception
  });

  test('special case: if the resource is top-level, a hash is not added', () => {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack');

    // WHEN
    const r = new CfnResource(stack, 'MyAwesomeness', { type: 'Resource' });
    const r2 = new CfnResource(stack, 'x'.repeat(255), { type: 'Resource' }); // max length
    const r3 = new CfnResource(stack, '*y-'.repeat(255), { type: 'Resource' }); // non-alpha are filtered out (yes, I know it might conflict)

    // THEN
    expect(stack.resolve(r.logicalId)).toEqual('MyAwesomeness');
    expect(stack.resolve(r2.logicalId)).toEqual('x'.repeat(255));
    expect(stack.resolve(r3.logicalId)).toEqual('y'.repeat(255));
  });

  test('if resource is top-level and logical id is longer than allowed, it is trimmed with a hash', () => {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack');

    // WHEN
    const r = new CfnResource(stack, 'x'.repeat(256), { type: 'Resource' });

    // THEN
    expect(stack.resolve(r.logicalId)).toEqual('x'.repeat(240) + 'C7A139A2');
  });

  test('Logical IDs can be renamed at the stack level', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const parent = new Construct(stack, 'Parent');
    new CfnResource(parent, 'ThingResource', { type: 'AWS::TAAS::Thing' });
    stack.renameLogicalId('ParentThingResource75D1D9CB', 'Renamed');

    // THEN
    const template = toCloudFormation(stack);
    expect('Renamed' in template.Resources).toEqual(true);
  });

  test('Renames for objects that don\'t exist fail', () => {
    // GIVEN
    const stack = new Stack();
    new Construct(stack, 'Parent');

    // WHEN
    stack.renameLogicalId('DOESNOTEXIST', 'Renamed');

    // THEN
    expect(() => toCloudFormation(stack)).toThrow();
  });

  test('ID Renames that collide with existing IDs should fail', () => {
    // GIVEN
    const stack = new Stack();
    stack.renameLogicalId('ParentThingResource1916E7808', 'ParentThingResource2F19948CB');

    // WHEN
    const parent = new Construct(stack, 'Parent');
    new CfnResource(parent, 'ThingResource1', { type: 'AWS::TAAS::Thing' });
    new CfnResource(parent, 'ThingResource2', { type: 'AWS::TAAS::Thing' });

    // THEN
    expect(() => toCloudFormation(stack)).toThrow(/Two objects have been assigned the same Logical ID/);
  });

  test('hashed naming scheme filters constructs named "Resource" from the human portion', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const parent = new Construct(stack, 'Parent');
    const child1 = new Construct(parent, 'Child');
    const child2 = new Construct(child1, 'Resource');

    new CfnResource(child2, 'HeyThere', { type: 'AWS::TAAS::Thing' });

    // THEN
    const template = toCloudFormation(stack);
    expect(template).toEqual({
      Resources: {
        ParentChildHeyThere35220347: {
          Type: 'AWS::TAAS::Thing',
        },
      },
    });
  });

  test('can transparently wrap constructs using "Default" id', () => {
    // GIVEN
    const stack1 = new Stack();
    const parent1 = new Construct(stack1, 'Parent');
    new CfnResource(parent1, 'HeyThere', { type: 'AWS::TAAS::Thing' });
    const template1 = toCloudFormation(stack1);

    // AND
    const theId1 = Object.keys(template1.Resources)[0];
    expect('AWS::TAAS::Thing').toEqual(template1.Resources[theId1].Type);

    // WHEN
    const stack2 = new Stack();
    const parent2 = new Construct(stack2, 'Parent');
    const invisibleWrapper = new Construct(parent2, 'Default');
    new CfnResource(invisibleWrapper, 'HeyThere', { type: 'AWS::TAAS::Thing' });
    const template2 = toCloudFormation(stack1);

    const theId2 = Object.keys(template2.Resources)[0];
    expect('AWS::TAAS::Thing').toEqual(template2.Resources[theId2].Type);

    // THEN: same ID, same object
    expect(theId1).toEqual(theId2);
  });

  test('non-alphanumeric characters are removed from the human part of the logical ID', () => {
    const val1 = logicalForElementInPath(['Foo-bar', 'B00m', 'Hello_World', '&&Horray Horray.']);
    const val2 = logicalForElementInPath(['Foobar', 'B00m', 'HelloWorld', 'HorrayHorray']);

    // same human part, different hash
    expect(val1).toEqual('FoobarB00mHelloWorldHorrayHorray640E99FB');
    expect(val2).toEqual('FoobarB00mHelloWorldHorrayHorray744334FD');
  });

  test('non-alphanumeric characters are removed even if the ID has only one component', () => {
    const val1 = logicalForElementInPath(['Foo-bar']);

    // same human part, different hash
    expect(val1).toEqual('Foobar');
  });

  test('empty identifiers are not allowed', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CfnResource(stack, '.', { type: 'R' });

    // THEN
    expect(() => toCloudFormation(stack)).toThrow(/Logical ID must adhere to the regular expression/);
  });

  test('too large identifiers are truncated yet still remain unique', () => {
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
    expect(C1.logicalId.length).toBeLessThanOrEqual(255);
    expect(C2.logicalId.length).toBeLessThanOrEqual(255);
    expect(C1).not.toEqual(C2);
  });

  test('Refs and dependencies will correctly reflect renames done at the stack level', () => {
    // GIVEN
    const stack = new Stack();
    stack.renameLogicalId('OriginalName', 'NewName');

    // WHEN
    const c1 = new CfnResource(stack, 'OriginalName', { type: 'R1' });
    const ref = c1.ref;

    const c2 = new CfnResource(stack, 'Construct2', { type: 'R2', properties: { ReferenceToR1: ref } });
    c2.node.addDependency(c1);

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        NewName: { Type: 'R1' },
        Construct2: {
          Type: 'R2',
          Properties: { ReferenceToR1: { Ref: 'NewName' } },
          DependsOn: ['NewName'],
        },
      },
    });
  });

  test('customize logical id allocation behavior by overriding `Stack.allocateLogicalId`', () => {
    class MyStack extends Stack {
      protected allocateLogicalId(element: CfnElement): string {
        if (element.node.id === 'A') { return 'LogicalIdOfA'; }
        if (element.node.id === 'B') { return 'LogicalIdOfB'; }
        throw new Error('Invalid element ID');
      }
    }

    const app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    const stack = new MyStack(app);
    new CfnResource(stack, 'A', { type: 'Type::Of::A' });
    const group = new Construct(stack, 'Group');
    new CfnResource(group, 'B', { type: 'Type::Of::B' });

    // renames can also be applied on custom logical IDs.
    stack.renameLogicalId('LogicalIdOfB', 'BoomBoomB');

    const c = new CfnResource(stack, 'B', { type: 'Type::Of::C' });
    c.overrideLogicalId('TheC');

    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        LogicalIdOfA: { Type: 'Type::Of::A' },
        BoomBoomB: { Type: 'Type::Of::B' },
        TheC: { Type: 'Type::Of::C' },
      },
    });
  });

  test('detects duplicate logical IDs in the same Stack caused by overrideLogicalId', () => {
    const stack = new Stack();
    const resource1 = new CfnResource(stack, 'A', { type: 'Type::Of::A' });
    const resource2 = new CfnResource(stack, 'B', { type: 'Type::Of::B' });

    resource1.overrideLogicalId('C');
    resource2.overrideLogicalId('C');

    expect(() => {
      toCloudFormation(stack);
    }).toThrow(/section 'Resources' already contains 'C'/);
  });
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
