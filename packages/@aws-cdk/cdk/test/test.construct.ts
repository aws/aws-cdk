import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { App as Root, ArnComponents, Construct, ConstructOrder, Lazy, Stack } from '../lib';

// tslint:disable:variable-name
// tslint:disable:max-line-length

export = {
  'the "Root" construct is a special construct which can be used as the root of the tree'(test: Test) {
    const root = new Root();
    test.equal(root.node.id, '', 'if not specified, name of a root construct is an empty string');
    test.ok(!root.node.scope, 'no parent');
    test.equal(root.node.children.length, 0, 'a construct is created without children'); // no children
    test.done();
  },

  'constructs cannot be created with an empty name unless they are root'(test: Test) {
    const root = new Root();
    test.throws(() => new Construct(root, ''));
    test.done();
  },

  'construct.name returns the name of the construct'(test: Test) {
    const t = createTree();

    test.equal(t.child1.node.id, 'Child1');
    test.equal(t.child2.node.id, 'Child2');
    test.equal(t.child1_1.node.id, 'Child11');
    test.equal(t.child1_2.node.id, 'Child12');
    test.equal(t.child1_1_1.node.id, 'Child111');
    test.equal(t.child2_1.node.id, 'Child21');

    test.done();
  },

  'construct id can use any character except the path separator'(test: Test) {
    const root = new Root();
    new Construct(root, 'valid');
    new Construct(root, 'ValiD');
    new Construct(root, 'Va123lid');
    new Construct(root, 'v');
    new Construct(root, '  invalid' );
    new Construct(root, 'invalid   ' );
    new Construct(root, '123invalid' );
    new Construct(root, 'in valid' );
    new Construct(root, 'in_Valid' );
    new Construct(root, 'in-Valid' );
    new Construct(root, 'in\\Valid' );
    new Construct(root, 'in.Valid' );
    test.done();
  },

  'if construct id contains path seperators, they will be replaced by double-dash'(test: Test) {
    const root = new Root();
    const c = new Construct(root, 'Boom/Boom/Bam');
    test.deepEqual(c.node.id, 'Boom--Boom--Bam');
    test.done();
  },

  'if "undefined" is forcefully used as an "id", it will be treated as an empty string'(test: Test) {
    const c = new Construct(undefined as any, undefined as any);
    test.deepEqual(c.node.id, '');
    test.done();
  },

  "dont allow unresolved tokens to be used in construct IDs"(test: Test) {
    // GIVEN
    const root = new Root();
    const token = Lazy.stringValue({ produce: () => 'lazy' });

    // WHEN + THEN
    test.throws(() => new Construct(root, `MyID: ${token}`), /Cannot use tokens in construct ID: MyID: \${Token/);
    test.done();
  },

  'construct.uniqueId returns a tree-unique alphanumeric id of this construct'(test: Test) {
    const root = new Root();

    const child1 = new Construct(root, 'This is the first child');
    const child2 = new Construct(child1, 'Second level');
    const c1 = new Construct(child2, 'My construct');
    const c2 = new Construct(child1, 'My construct');

    test.deepEqual(c1.node.path, 'This is the first child/Second level/My construct');
    test.deepEqual(c2.node.path, 'This is the first child/My construct');
    test.deepEqual(c1.node.uniqueId, 'ThisisthefirstchildSecondlevelMyconstruct202131E0');
    test.deepEqual(c2.node.uniqueId, 'ThisisthefirstchildMyconstruct8C288DF9');
    test.done();
  },

  'cannot calculate uniqueId if the construct path is ["Default"]'(test: Test) {
    const root = new Root();
    const c = new Construct(root, 'Default');
    test.throws(() => c.node.uniqueId, /Unable to calculate a unique id for an empty set of components/);
    test.done();
  },

  'construct.node.stack returns the correct stack'(test: Test) {
    const stack = new Stack();
    test.same(stack.node.stack, stack);
    const parent = new Construct(stack, 'Parent');
    const construct = new Construct(parent, 'Construct');
    test.same(construct.node.stack, stack);
    test.done();
  },

  'construct.node.stack throws when there is no parent Stack'(test: Test) {
    const root = new Root();
    const construct = new Construct(root, 'Construct');
    test.throws(() => construct.node.stack, /No stack could be identified for the construct at path/);
    test.done();
  },

  'construct.node.stack.formatArn forwards to the Stack'(test: Test) {
    const stack = new Stack();
    const components: ArnComponents = { service: 'test', resource: 'test' };
    const dummyArn = 'arn:::dummy';
    stack.formatArn = (args) => {
      test.same(args, components);
      return dummyArn;
    };

    const construct = new Construct(stack, 'Construct');
    test.same(construct.node.stack.formatArn(components), dummyArn);
    test.done();
  },

  'construct.node.stack.parseArn forwards to the Stack'(test: Test) {
    const stack = new Stack();
    const components: ArnComponents = { service: 'test', resource: 'test' };
    const dummyArn = 'arn:::dummy';
    stack.parseArn = (arn) => {
      test.same(arn, dummyArn);
      return components;
    };

    const construct = new Construct(stack, 'Construct');
    test.same(construct.node.stack.parseArn(dummyArn), components);
    test.done();
  },

  'construct.getChildren() returns an array of all children'(test: Test) {
    const root = new Root();
    const child = new Construct(root, 'Child1');
    new Construct(root, 'Child2');
    test.equal(child.node.children.length, 0, 'no children');
    test.equal(root.node.children.length, 2, 'two children are expected');
    test.done();
  },

  'construct.findChild(name) can be used to retrieve a child from a parent'(test: Test) {
    const root = new Root();
    const child = new Construct(root, 'Contruct');
    test.strictEqual(root.node.tryFindChild(child.node.id), child, 'findChild(name) can be used to retrieve the child from a parent');
    test.ok(!root.node.tryFindChild('NotFound'), 'findChild(name) returns undefined if the child is not found');
    test.done();
  },

  'construct.getChild(name) can be used to retrieve a child from a parent'(test: Test) {
    const root = new Root();
    const child = new Construct(root, 'Contruct');
    test.strictEqual(root.node.findChild(child.node.id), child, 'getChild(name) can be used to retrieve the child from a parent');
    test.throws(() => {
      root.node.findChild('NotFound');
    }, '', 'getChild(name) returns undefined if the child is not found');
    test.done();
  },

  'construct.toString() and construct.toTreeString() can be used for diagnostics'(test: Test) {
    const t = createTree();

    test.equal(t.root.toString(), 'App');
    test.equal(t.child1_1_1.toString(), 'Construct [Child1/Child11/Child111]');
    test.equal(t.child2.toString(), 'Construct [Child2]');
    test.equal(t.root.node.toTreeString(), 'App\n  Construct [Child1]\n    Construct [Child11]\n      Construct [Child111]\n    Construct [Child12]\n  Construct [Child2]\n    Construct [Child21]\n');
    test.done();
  },

  'construct.getContext(key) can be used to read a value from context defined at the root level'(test: Test) {
    const context = {
      ctx1: 12,
      ctx2: 'hello'
    };

    const t = createTree(context);
    test.equal(t.root.node.getContext('ctx1'), 12);
    test.equal(t.child1_1_1.node.getContext('ctx2'), 'hello');
    test.done();
  },

  'construct.setContext(k,v) sets context at some level and construct.getContext(key) will return the lowermost value defined in the stack'(test: Test) {
    const root = new Root();
    root.node.setContext('c1', 'root');
    root.node.setContext('c2', 'root');

    const child1 = new Construct(root, 'child1');
    child1.node.setContext('c2', 'child1');
    child1.node.setContext('c3', 'child1');

    const child2 = new Construct(root, 'child2');
    const child3 = new Construct(child1, 'child1child1');
    child3.node.setContext('c1', 'child3');
    child3.node.setContext('c4', 'child3');

    test.equal(root.node.getContext('c1'), 'root');
    test.equal(root.node.getContext('c2'), 'root');
    test.equal(root.node.getContext('c3'), undefined);

    test.equal(child1.node.getContext('c1'), 'root');
    test.equal(child1.node.getContext('c2'), 'child1');
    test.equal(child1.node.getContext('c3'), 'child1');

    test.equal(child2.node.getContext('c1'), 'root');
    test.equal(child2.node.getContext('c2'), 'root');
    test.equal(child2.node.getContext('c3'), undefined);

    test.equal(child3.node.getContext('c1'), 'child3');
    test.equal(child3.node.getContext('c2'), 'child1');
    test.equal(child3.node.getContext('c3'), 'child1');
    test.equal(child3.node.getContext('c4'), 'child3');

    test.done();
  },

  'construct.setContext(key, value) can only be called before adding any children'(test: Test) {
    const root = new Root();
    new Construct(root, 'child1');
    test.throws(() => root.node.setContext('k', 'v'));
    test.done();
  },

  'construct.pathParts returns an array of strings of all names from root to node'(test: Test) {
    const tree = createTree();
    test.deepEqual(tree.root.node.path, '');
    test.deepEqual(tree.child1_1_1.node.path, 'Child1/Child11/Child111');
    test.deepEqual(tree.child2.node.path, 'Child2');
    test.done();
  },

  'if a root construct has a name, it should be included in the path'(test: Test) {
    const tree = createTree({});
    test.deepEqual(tree.root.node.path, '');
    test.deepEqual(tree.child1_1_1.node.path, 'Child1/Child11/Child111');
    test.done();
  },

  'construct can not be created with the name of a sibling'(test: Test) {
    const root = new Root();

    // WHEN
    new Construct(root, 'SameName');

    // THEN: They have different paths
    test.throws(() => {
      new Construct(root, 'SameName');
    }, /There is already a Construct with name 'SameName' in App/);

    // WHEN
    const c0 = new Construct(root, 'c0');
    new Construct(c0, 'SameName');

    // THEN: They have different paths
    test.throws(() => {
      new Construct(c0, 'SameName');
    }, /There is already a Construct with name 'SameName' in Construct \[c0\]/);

    test.done();
  },

  'addMetadata(type, data) can be used to attach metadata to constructs FIND_ME'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    test.deepEqual(con.node.metadata, [], 'starts empty');

    con.node.addMetadata('key', 'value');
    con.node.addMetadata('number', 103);
    con.node.addMetadata('array', [ 123, 456 ]);

    test.deepEqual(con.node.metadata[0].type, 'key');
    test.deepEqual(con.node.metadata[0].data, 'value');
    test.deepEqual(con.node.metadata[1].data, 103);
    test.deepEqual(con.node.metadata[2].data, [ 123, 456 ]);
    test.ok(con.node.metadata[0].trace && con.node.metadata[0].trace[0].indexOf('FIND_ME') !== -1, 'First stack line should include this function\s name');
    test.done();
  },

  'addMetadata(type, undefined/null) is ignored'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'Foo');
    con.node.addMetadata('Null', null);
    con.node.addMetadata('Undefined', undefined);
    con.node.addMetadata('True', true);
    con.node.addMetadata('False', false);
    con.node.addMetadata('Empty', '');

    const exists = (key: string) => con.node.metadata.find(x => x.type === key);

    test.ok(!exists('Null'));
    test.ok(!exists('Undefined'));
    test.ok(exists('True'));
    test.ok(exists('False'));
    test.ok(exists('Empty'));
    test.done();
  },

  'addWarning(message) can be used to add a "WARNING" message entry to the construct'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    con.node.addWarning('This construct is deprecated, use the other one instead');
    test.deepEqual(con.node.metadata[0].type, cxapi.WARNING_METADATA_KEY);
    test.deepEqual(con.node.metadata[0].data, 'This construct is deprecated, use the other one instead');
    test.ok(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0);
    test.done();
  },

  'addError(message) can be used to add a "ERROR" message entry to the construct'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    con.node.addError('Stop!');
    test.deepEqual(con.node.metadata[0].type, cxapi.ERROR_METADATA_KEY);
    test.deepEqual(con.node.metadata[0].data, 'Stop!');
    test.ok(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0);
    test.done();
  },

  'addInfo(message) can be used to add an "INFO" message entry to the construct'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    con.node.addInfo('Hey there, how do you do?');
    test.deepEqual(con.node.metadata[0].type, cxapi.INFO_METADATA_KEY);
    test.deepEqual(con.node.metadata[0].data, 'Hey there, how do you do?');
    test.ok(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0);
    test.done();
  },

  'multiple children of the same type, with explicit names are welcome'(test: Test) {
    const root = new Root();
    new MyBeautifulConstruct(root, 'mbc1');
    new MyBeautifulConstruct(root, 'mbc2');
    new MyBeautifulConstruct(root, 'mbc3');
    new MyBeautifulConstruct(root, 'mbc4');
    test.equal(root.node.children.length, 4);
    test.done();
  },

  'construct.required(props, name) can be used to validate that required properties are defined'(test: Test) {
    const root = new Root();

    // should be ok
    const c = new ConstructWithRequired(root, 'Construct', { requiredProp: 123, anotherRequiredProp: true });
    test.equal(c.requiredProp, 123);
    test.equal(c.anotherRequiredProp, true);

    // should throw
    test.throws(() => new ConstructWithRequired(root, 'C', { optionalProp: 'hello' } as any));
    test.done();
  },

  // tslint:disable-next-line:max-line-length
  'construct.validate() can be implemented to perform validation, construct.validateTree() will return all errors from the subtree (DFS)'(test: Test) {

    class MyConstruct extends Construct {
      protected validate() {
        return [ 'my-error1', 'my-error2' ];
      }
    }

    class YourConstruct extends Construct {
      protected validate() {
        return [ 'your-error1' ];
      }
    }

    class TheirConstruct extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new YourConstruct(this, 'YourConstruct');
      }

      protected validate() {
        return [ 'their-error' ];
      }
    }

    class TestStack extends Root {
      constructor() {
        super();

        new MyConstruct(this, 'MyConstruct');
        new TheirConstruct(this, 'TheirConstruct');
      }

      protected validate() {
        return  [ 'stack-error' ];
      }
    }

    const stack = new TestStack();

    const errors = (stack.node.validateTree()).map(v => ({ path: v.source.node.path, message: v.message }));

    // validate DFS
    test.deepEqual(errors, [
      { path: 'MyConstruct', message: 'my-error1' },
      { path: 'MyConstruct', message: 'my-error2' },
      { path: 'TheirConstruct/YourConstruct', message: 'your-error1' },
      { path: 'TheirConstruct', message: 'their-error' },
      { path: '', message: 'stack-error' }
    ]);

    test.done();
  },

  'construct.lock() protects against adding children anywhere under this construct (direct or indirect)'(test: Test) {

    class LockableConstruct extends Construct {
      public lockMe() {
        this.node.lock();
      }

      public unlockMe() {
        this.node.unlock();
      }
    }

    const stack = new Root();

    const c0a = new LockableConstruct(stack, 'c0a');
    const c0b = new Construct(stack, 'c0b');

    const c1a = new Construct(c0a, 'c1a');
    const c1b = new Construct(c0a, 'c1b');

    c0a.lockMe();

    // now we should still be able to add children to c0b, but not to c0a or any its children
    new Construct(c0b, 'c1a');
    test.throws(() => new Construct(c0a, 'fail1'), /Cannot add children to "c0a" during synthesis/);
    test.throws(() => new Construct(c1a, 'fail2'), /Cannot add children to "c0a\/c1a" during synthesis/);
    test.throws(() => new Construct(c1b, 'fail3'), /Cannot add children to "c0a\/c1b" during synthesis/);

    c0a.unlockMe();

    new Construct(c0a, 'c0aZ');
    new Construct(c1a, 'c1aZ');
    new Construct(c1b, 'c1bZ');

    test.done();
  },

  'findAll returns a list of all children in either DFS or BFS'(test: Test) {
    // GIVEN
    const c1 = new Construct(undefined as any, '1');
    const c2 = new Construct(c1, '2');
    new Construct(c1, '3');
    new Construct(c2, '4');
    new Construct(c2, '5');

    // THEN
    test.deepEqual(c1.node.findAll().map(x => x.node.id), c1.node.findAll(ConstructOrder.PreOrder).map(x => x.node.id)); // default is PreOrder
    test.deepEqual(c1.node.findAll(ConstructOrder.PreOrder).map(x => x.node.id), [ '1', '2', '4', '5', '3' ]);
    test.deepEqual(c1.node.findAll(ConstructOrder.PostOrder).map(x => x.node.id), [ '4', '5', '2', '3', '1' ]);
    test.done();
  },

  'ancestors returns a list of parents up to root'(test: Test) {
    const { child1, child1_1_1 } = createTree();

    test.deepEqual(child1_1_1.node.ancestors().map(x => x.node.id), [ '', 'Child1', 'Child11', 'Child111' ]);
    test.deepEqual(child1_1_1.node.ancestors(child1).map(x => x.node.id), [ 'Child11', 'Child111' ]);
    test.deepEqual(child1_1_1.node.ancestors(child1_1_1), [ ]);
    test.done();
  },

  '"root" returns the root construct'(test: Test) {
    const { child1, child2, child1_1_1, root } = createTree();
    test.ok(child1.node.root === root);
    test.ok(child2.node.root === root);
    test.ok(child1_1_1.node.root === root);
    test.done();
  },

  'defaultChild': {
    'returns the child with id "Resource"'(test: Test) {
      const root = new Root();
      new Construct(root, 'child1');
      const defaultChild = new Construct(root, 'Resource');
      new Construct(root, 'child2');

      test.same(root.node.defaultChild, defaultChild);
      test.done();
    },
    'returns the child with id "Default"'(test: Test) {
      const root = new Root();
      new Construct(root, 'child1');
      const defaultChild = new Construct(root, 'Default');
      new Construct(root, 'child2');

      test.same(root.node.defaultChild, defaultChild);
      test.done();
    },
    'returns "undefined" if there is no default'(test: Test) {
      const root = new Root();
      new Construct(root, 'child1');
      new Construct(root, 'child2');

      test.equal(root.node.defaultChild, undefined);
      test.done();
    },
    'fails if there are both "Resource" and "Default"'(test: Test) {
      const root = new Root();
      new Construct(root, 'child1');
      new Construct(root, 'Default');
      new Construct(root, 'child2');
      new Construct(root, 'Resource');

      test.throws(() => root.node.defaultChild,
        /Cannot determine default child for . There is both a child with id "Resource" and id "Default"/);
      test.done();

    }
  }
};

function createTree(context?: any) {
  const root = new Root();
  if (context) {
    Object.keys(context).forEach(key => root.node.setContext(key, context[key]));
  }

  const child1 = new Construct(root, 'Child1');
  const child2 = new Construct(root, 'Child2');
  const child1_1 = new Construct(child1, 'Child11');
  const child1_2 = new Construct(child1, 'Child12');
  const child1_1_1 = new Construct(child1_1, 'Child111');
  const child2_1 = new Construct(child2, 'Child21');

  return {
    root, child1, child2, child1_1, child1_2, child1_1_1, child2_1
  };
}

class MyBeautifulConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

interface ConstructWithRequiredProps {
  optionalProp?: string;
  requiredProp: number;
  anotherRequiredProp: boolean;
}

class ConstructWithRequired extends Construct {
  public readonly requiredProp: string;
  public readonly anotherRequiredProp: boolean;

  constructor(scope: Construct, id: string, props: ConstructWithRequiredProps) {
    super(scope, id);

    this.requiredProp = this.node.required(props, 'requiredProp');
    this.anotherRequiredProp = this.node.required(props, 'anotherRequiredProp');
  }
}
