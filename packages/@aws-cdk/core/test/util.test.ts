import { Construct } from 'constructs';
import { CfnResource, Stack } from '../lib';
import { capitalizePropertyNames, filterUndefined, findLastCommonElement, ignoreEmpty, pathToTopLevelStack } from '../lib/util';

describe('util', () => {
  test('capitalizeResourceProperties capitalizes all keys of an object (recursively) from camelCase to PascalCase', () => {
    const c = new Stack();

    expect(capitalizePropertyNames(c, undefined)).toEqual(undefined);
    expect(capitalizePropertyNames(c, 12)).toEqual(12);
    expect(capitalizePropertyNames(c, 'hello')).toEqual('hello');
    expect(capitalizePropertyNames(c, ['hello', 88])).toEqual(['hello', 88]);
    expect(capitalizePropertyNames(c,
      { Hello: 'world', hey: 'dude' })).toEqual(
      { Hello: 'world', Hey: 'dude' });
    expect(capitalizePropertyNames(c,
      [1, 2, { three: 3 }])).toEqual(
      [1, 2, { Three: 3 }]);
    expect(capitalizePropertyNames(c,
      { Hello: 'world', recursive: { foo: 123, there: { another: ['hello', { world: 123 }] } } })).toEqual(
      { Hello: 'world', Recursive: { Foo: 123, There: { Another: ['hello', { World: 123 }] } } });

    // make sure tokens are resolved and result is also capitalized
    expect(capitalizePropertyNames(c,
      { hello: { resolve: () => ({ foo: 'bar' }) }, world: new SomeToken() })).toEqual(
      { Hello: { Foo: 'bar' }, World: 100 });


  });

  describe('ignoreEmpty', () => {

    test('[]', () => {
      const stack = new Stack();
      expect(stack.resolve(ignoreEmpty([]))).toEqual(undefined);

    });

    test('{}', () => {
      const stack = new Stack();
      expect(stack.resolve(ignoreEmpty({}))).toEqual(undefined);

    });

    test('undefined/null', () => {
      const stack = new Stack();
      expect(stack.resolve(ignoreEmpty(undefined))).toEqual(undefined);
      expect(stack.resolve(ignoreEmpty(null))).toEqual(null);

    });

    test('primitives', () => {
      const stack = new Stack();
      expect(stack.resolve(ignoreEmpty(12))).toEqual(12);
      expect(stack.resolve(ignoreEmpty('12'))).toEqual('12');

    });

    test('non-empty arrays/objects', () => {
      const stack = new Stack();
      expect(stack.resolve(ignoreEmpty([1, 2, 3, undefined]))).toEqual([1, 2, 3]); // undefined array values is cleaned up by "resolve"
      expect(stack.resolve(ignoreEmpty({ o: 1, b: 2, j: 3 }))).toEqual({ o: 1, b: 2, j: 3 });

    });

    test('resolve first', () => {
      const stack = new Stack();
      expect(stack.resolve(ignoreEmpty({ xoo: { resolve: () => 123 } }))).toEqual({ xoo: 123 });
      expect(stack.resolve(ignoreEmpty({ xoo: { resolve: () => undefined } }))).toEqual(undefined);
      expect(stack.resolve(ignoreEmpty({ xoo: { resolve: () => [] } }))).toEqual({ xoo: [] });
      expect(stack.resolve(ignoreEmpty({ xoo: { resolve: () => [undefined, undefined] } }))).toEqual({ xoo: [] });

    });
  });

  describe('filterUnderined', () => {
    test('is null-safe (aka treats null and undefined the same)', () => {
      expect(filterUndefined({ 'a null': null, 'a not null': true })).toEqual({ 'a not null': true });

    });

    test('removes undefined, but leaves the rest', () => {
      expect(filterUndefined({ 'an undefined': undefined, 'yes': true })).toEqual({ yes: true });

    });
  });

  test('pathToTopLevelStack returns the array of stacks that lead to a stack', () => {
    const a = new Stack(undefined, 'a');
    const aa = new Nested(a, 'aa');
    const aaa = new Nested(aa, 'aaa');

    expect(path(aaa)).toEqual(['a', 'aa', 'aaa']);
    expect(path(aa)).toEqual(['a', 'aa']);
    expect(path(a)).toEqual(['a']);


    function path(s: Stack) {
      return pathToTopLevelStack(s).map(x => x.node.id);
    }
  });

  test('findCommonStack returns the lowest common stack between two stacks or undefined', () => {
    const a = new Stack(undefined, 'a');
    const aa = new Nested(a, 'aa');
    const ab = new Nested(a, 'ab');
    const aaa = new Nested(aa, 'aaa');
    const aab = new Nested(aa, 'aab');
    const aba = new Nested(ab, 'aba');

    const b = new Stack(undefined, 'b');
    const ba = new Nested(b, 'ba');
    const baa = new Nested(ba, 'baa');

    expect(lca(a, b)).toEqual(undefined);
    expect(lca(aa, ab)).toEqual('a');
    expect(lca(ab, aa)).toEqual('a');
    expect(lca(aa, aba)).toEqual('a');
    expect(lca(aba, aa)).toEqual('a');
    expect(lca(ab, aba)).toEqual('ab');
    expect(lca(aba, ab)).toEqual('ab');
    expect(lca(aba, aba)).toEqual('aba');
    expect(lca(aa, aa)).toEqual('aa');
    expect(lca(a, aaa)).toEqual('a');
    expect(lca(aaa, aab)).toEqual('aa');
    expect(lca(aaa, b)).toEqual(undefined);
    expect(lca(aaa, ba)).toEqual(undefined);
    expect(lca(baa, ba)).toEqual('ba');


    function lca(s1: Stack, s2: Stack) {
      const res = findLastCommonElement(pathToTopLevelStack(s1), pathToTopLevelStack(s2));
      if (!res) { return undefined; }
      return res.node.id;
    }
  });
});

class SomeToken {
  public foo = 60;
  public goo = 40;
  public resolve() {
    return this.foo + this.goo;
  }
}

class Nested extends Stack {
  public readonly nestedStackResource?: CfnResource;
  constructor(scope: Construct, id: string) {
    const resource = new CfnResource(scope, `${id}+NestedStackResource`, { type: 'AWS::CloudFormation::Stack' });
    super(scope, id);
    this.nestedStackResource = resource;
  }
}
