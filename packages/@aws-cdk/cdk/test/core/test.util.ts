import { Test } from 'nodeunit';
import { Root } from '../../lib';
import { capitalizePropertyNames, ignoreEmpty } from '../../lib/core/util';

export = {
  'capitalizeResourceProperties capitalizes all keys of an object (recursively) from camelCase to PascalCase'(test: Test) {
    const c = new Root();

    test.equal(capitalizePropertyNames(c, undefined), undefined);
    test.equal(capitalizePropertyNames(c, 12), 12);
    test.equal(capitalizePropertyNames(c, 'hello'), 'hello');
    test.deepEqual(capitalizePropertyNames(c, [ 'hello', 88 ]), [ 'hello', 88 ]);
    test.deepEqual(capitalizePropertyNames(c,
      { Hello: 'world', hey: 'dude' }),
      { Hello: 'world', Hey: 'dude' });
    test.deepEqual(capitalizePropertyNames(c,
      [ 1, 2, { three: 3 }]),
      [ 1, 2, { Three: 3 }]);
    test.deepEqual(capitalizePropertyNames(c,
      { Hello: 'world', recursive: { foo: 123, there: { another: [ 'hello', { world: 123 } ]} } }),
      { Hello: 'world', Recursive: { Foo: 123, There: { Another: [ 'hello', { World: 123 } ]} } });

    // make sure tokens are resolved and result is also capitalized
    test.deepEqual(capitalizePropertyNames(c,
      { hello: { resolve: () => ({ foo: 'bar' }) }, world: new SomeToken() }),
      { Hello: { Foo: 'bar' }, World: 100 });

    test.done();
  },

  'ignoreEmpty': {

    '[]'(test: Test) {
      const c = new Root();
      test.strictEqual(c.node.resolve(ignoreEmpty([])), undefined);
      test.done();
    },

    '{}'(test: Test) {
      const c = new Root();
      test.strictEqual(c.node.resolve(ignoreEmpty({})), undefined);
      test.done();
    },

    'undefined/null'(test: Test) {
      const c = new Root();
      test.strictEqual(c.node.resolve(ignoreEmpty(undefined)), undefined);
      test.strictEqual(c.node.resolve(ignoreEmpty(null)), null);
      test.done();
    },

    'primitives'(test: Test) {
      const c = new Root();
      test.strictEqual(c.node.resolve(ignoreEmpty(12)), 12);
      test.strictEqual(c.node.resolve(ignoreEmpty("12")), "12");
      test.done();
    },

    'non-empty arrays/objects'(test: Test) {
      const c = new Root();
      test.deepEqual(c.node.resolve(ignoreEmpty([ 1, 2, 3, undefined ])), [ 1, 2, 3 ]); // undefined array values is cleaned up by "resolve"
      test.deepEqual(c.node.resolve(ignoreEmpty({ o: 1, b: 2, j: 3 })), { o: 1, b: 2, j: 3 });
      test.done();
    },

    'resolve first'(test: Test) {
      const c = new Root();
      test.deepEqual(c.node.resolve(ignoreEmpty({ xoo: { resolve: () => 123 }})), { xoo: 123 });
      test.strictEqual(c.node.resolve(ignoreEmpty({ xoo: { resolve: () => undefined }})), undefined);
      test.deepEqual(c.node.resolve(ignoreEmpty({ xoo: { resolve: () => [ ] }})), { xoo: [] });
      test.deepEqual(c.node.resolve(ignoreEmpty({ xoo: { resolve: () => [ undefined, undefined ] }})), { xoo: [] });
      test.done();
    }
  }
};

class SomeToken {
  public foo = 60;
  public goo = 40;
  public resolve() {
    return this.foo + this.goo;
  }
}
