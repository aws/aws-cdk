import { Test } from 'nodeunit';
import { Construct, HashedAddressingScheme, IAddressingScheme, Ref, Resource, Stack } from '../../lib';

/**
 * These tests are executed once (for specific ID schemes)
 */
const uniqueTests = {
  'if the naming scheme uniquifies with a hash we can have the same concatenated identifier'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { namingScheme: new HashedAddressingScheme() });

    const A = new Construct(stack, 'A');
    new Resource(A, 'BC', { type: 'Resource' });

    // WHEN
    const AB = new Construct(stack, 'AB');
    new Resource(AB, 'C', { type: 'Resource' });

    // THEN: no exception

    test.done();
  },

  'special case: if the resource is top-level, a hash is not added'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { namingScheme: new HashedAddressingScheme() });

    // WHEN
    const r = new Resource(stack, 'MyAwesomeness', { type: 'Resource' });

    // THEN
    test.equal(r.logicalId, 'MyAwesomeness');

    test.done();
  },

  'Logical IDs can be renamed at the stack level'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.renameLogical('ParentThingResource75D1D9CB', 'Renamed');

    // WHEN
    const parent = new Construct(stack, 'Parent');
    new Resource(parent, 'ThingResource', { type: 'AWS::TAAS::Thing' });

    // THEN
    const template = stack.toCloudFormation();
    test.ok('Renamed' in template.Resources);

    test.done();
  },

  'Renames for objects that don\'t exist fail'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.renameLogical('DOESNOTEXIST', 'Renamed');

    // WHEN
    new Construct(stack, 'Parent');

    // THEN
    test.throws(() => {
      stack.toCloudFormation();
    });

    test.done();
  },

  'ID Renames that collide with existing IDs should fail'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.renameLogical('ParentThingResource1916E7808', 'ParentThingResource2F19948CB');

    // WHEN
    const parent = new Construct(stack, 'Parent');
    new Resource(parent, 'ThingResource1', { type: 'AWS::TAAS::Thing' });

    // THEN
    test.throws(() => {
      new Resource(parent, 'ThingResource2', { type: 'AWS::TAAS::Thing' });
    });

    test.done();
  },

  'hashed naming scheme filters constructs named "Resource" from the human portion'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const parent = new Construct(stack, 'Parent');
    const child1 = new Construct(parent, 'Child');
    const child2 = new Construct(child1, 'Resource');

    new Resource(child2, 'HeyThere', { type: 'AWS::TAAS::Thing' });

    // THEN
    const template = stack.toCloudFormation();
    test.deepEqual(template, {
      Resources: {
        ParentChildHeyThere35220347: {
          Type: 'AWS::TAAS::Thing'
        }
      }
    });

    test.done();
  },

  'can transparently wrap constructs using "Default" id'(test: Test) {
    // GIVEN
    const stack1 = new Stack();
    const parent1 = new Construct(stack1, 'Parent');
    new Resource(parent1, 'HeyThere', { type: 'AWS::TAAS::Thing' });
    const template1 = stack1.toCloudFormation();

    // AND
    const theId1 = Object.keys(template1.Resources)[0];
    test.equal('AWS::TAAS::Thing', template1.Resources[theId1].Type);

    // WHEN
    const stack2 = new Stack();
    const parent2 = new Construct(stack2, 'Parent');
    const invisibleWrapper = new Construct(parent2, 'Default');
    new Resource(invisibleWrapper, 'HeyThere', { type: 'AWS::TAAS::Thing' });
    const template2 = stack1.toCloudFormation();

    const theId2 = Object.keys(template2.Resources)[0];
    test.equal('AWS::TAAS::Thing', template2.Resources[theId2].Type);

    // THEN: same ID, same object
    test.equal(theId1, theId2);

    test.done();
  },

  'non-alphanumeric characters are removed from the human part of the logical ID'(test: Test) {
    const scheme = new HashedAddressingScheme();
    const val1 = scheme.allocateAddress([ 'Foo-bar', 'B00m', 'Hello_World', '&&Horray Horray.' ]);
    const val2 = scheme.allocateAddress([ 'Foobar', 'B00m', 'HelloWorld', 'HorrayHorray' ]);

    // same human part, different hash
    test.deepEqual(val1, 'FoobarB00mHelloWorldHorrayHorray640E99FB');
    test.deepEqual(val2, 'FoobarB00mHelloWorldHorrayHorray744334FD');
    test.done();
  }
};

const schemes: {[name: string]: IAddressingScheme} = {
  "hashing scheme": new HashedAddressingScheme(),
};

/**
 * These tests are executed for all generators
 */
const allSchemesTests: {[name: string]: (scheme: IAddressingScheme, test: Test) => void } = {
  'empty identifiers are not allowed'(scheme: IAddressingScheme, test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { namingScheme: scheme });

    // WHEN
    test.throws(() => {
       new Resource(stack, '.', { type: 'R' });
    });
    test.done();
  },

  'too large identifiers are truncated yet still remain unique'(scheme: IAddressingScheme, test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { namingScheme: scheme });

    const A = new Construct(stack, generateString(100));
    const B = new Construct(A, generateString(100));

    // WHEN
    const firstPart = generateString(60);
    // The shared part has now exceeded the maximum length of CloudFormation identifiers
    // so the identity generator will have to something smart

    const C1 = new Resource(B, firstPart + generateString(40), { type: 'Resource' });
    const C2 = new Resource(B, firstPart + generateString(40), { type: 'Resource' });

    // THEN
    test.ok(C1.logicalId.length <= 255);
    test.ok(C2.logicalId.length <= 255);
    test.notEqual(C1, C2);

    test.done();
  },

  'Refs and dependencies will correctly reflect renames done at the stack level'(scheme: IAddressingScheme, test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { namingScheme: scheme });
    stack.renameLogical('OriginalName', 'NewName');

    // WHEN
    const c1 = new Resource(stack, 'OriginalName', { type: 'R1' });
    const ref = new Ref(c1);

    const c2 = new Resource(stack, 'Construct2', { type: 'R2', properties: { ReferenceToR1: ref } });
    c2.addDependency(c1);

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        [c1.logicalId]: {
          Type: 'R1' },
        [c2.logicalId]: {
          Type: 'R2',
          Properties: {
            ReferenceToR1: { Ref: c1.logicalId } },
          DependsOn: [ c1.logicalId ] } } });

    test.done();
  },
};

// Combine the one-off tests and generate tests for each scheme
const exp: any = uniqueTests;
Object.keys(schemes).forEach(schemeName => {
  const scheme = schemes[schemeName];
  Object.keys(allSchemesTests).forEach(testName => {
    const testFunction = allSchemesTests[testName];
    exp[`${schemeName}: ${testName}`] = (test: Test) => {
      testFunction(scheme, test);
    };
  });
});

export = exp;

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
