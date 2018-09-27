import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { Construct, Root } from '../../lib';

// tslint:disable:variable-name
// tslint:disable:max-line-length

export = {
  'the "Root" construct is a special construct which can be used as the root of the tree'(test: Test) {
    const root = new Root();
    test.equal(root.id, '', 'if not specified, name of a root construct is an empty string');
    test.ok(!root.parent, 'no parent');
    test.equal(root.children.length, 0, 'a construct is created without children'); // no children
    test.done();
  },

  'constructs cannot be created with an empty name unless they are root'(test: Test) {
    const root = new Root();
    test.throws(() => new Construct(root, ''));
    test.done();
  },

  'construct.name returns the name of the construct'(test: Test) {
    const t = createTree();

    test.equal(t.child1.id, 'Child1');
    test.equal(t.child2.id, 'Child2');
    test.equal(t.child1_1.id, 'Child11');
    test.equal(t.child1_2.id, 'Child12');
    test.equal(t.child1_1_1.id, 'Child111');
    test.equal(t.child2_1.id, 'Child21');

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

    test.throws(() => new Construct(root, 'in/Valid' ), Error, 'backslashes are not allowed');
    test.done();
  },

  'construct.uniqueId returns a tree-unique alphanumeric id of this construct'(test: Test) {
    const root = new Root();

    const child1 = new Construct(root, 'This is the first child');
    const child2 = new Construct(child1, 'Second level');
    const c1 = new Construct(child2, 'My construct');
    const c2 = new Construct(child1, 'My construct');

    test.deepEqual(c1.path, 'This is the first child/Second level/My construct');
    test.deepEqual(c2.path, 'This is the first child/My construct');
    test.deepEqual(c1.uniqueId, 'ThisisthefirstchildSecondlevelMyconstruct202131E0');
    test.deepEqual(c2.uniqueId, 'ThisisthefirstchildMyconstruct8C288DF9');
    test.done();
  },

  'cannot calculate uniqueId if the construct path is ["Default"]'(test: Test) {
    const root = new Root();
    test.throws(() => new Construct(root, 'Default'), /Unable to calculate a unique id for an empty set of components/);
    test.done();
  },

  'construct.getChildren() returns an array of all children'(test: Test) {
    const root = new Root();
    const child = new Construct(root, 'Child1');
    new Construct(root, 'Child2');
    test.equal(child.children.length, 0, 'no children');
    test.equal(root.children.length, 2, 'two children are expected');
    test.done();
  },

  'construct.findChild(name) can be used to retrieve a child from a parent'(test: Test) {
    const root = new Root();
    const child = new Construct(root, 'Contruct');
    test.strictEqual(root.tryFindChild(child.id), child, 'findChild(name) can be used to retrieve the child from a parent');
    test.ok(!root.tryFindChild('NotFound'), 'findChild(name) returns undefined if the child is not found');
    test.done();
  },

  'construct.getChild(name) can be used to retrieve a child from a parent'(test: Test) {
    const root = new Root();
    const child = new Construct(root, 'Contruct');
    test.strictEqual(root.findChild(child.id), child, 'getChild(name) can be used to retrieve the child from a parent');
    test.throws(() => {
      root.findChild('NotFound');
    }, '', 'getChild(name) returns undefined if the child is not found');
    test.done();
  },

  'construct.toString() and construct.toTreeString() can be used for diagnostics'(test: Test) {
    const t = createTree();

    test.equal(t.root.toString(), 'Root');
    test.equal(t.child1_1_1.toString(), 'Construct [Child1/Child11/Child111]');
    test.equal(t.child2.toString(), 'Construct [Child2]');
    test.equal(t.root.toTreeString(), 'Root\n  Construct [Child1]\n    Construct [Child11]\n      Construct [Child111]\n    Construct [Child12]\n  Construct [Child2]\n    Construct [Child21]\n');
    test.done();
  },

  'construct.getContext(key) can be used to read a value from context defined at the root level'(test: Test) {
    const context = {
      ctx1: 12,
      ctx2: 'hello'
    };

    const t = createTree(context);
    test.equal(t.root.getContext('ctx1'), 12);
    test.equal(t.child1_1_1.getContext('ctx2'), 'hello');
    test.done();
  },

  'construct.setContext(k,v) sets context at some level and construct.getContext(key) will return the lowermost value defined in the stack'(test: Test) {
    const root = new Root();
    root.setContext('c1', 'root');
    root.setContext('c2', 'root');

    const child1 = new Construct(root, 'child1');
    child1.setContext('c2', 'child1');
    child1.setContext('c3', 'child1');

    const child2 = new Construct(root, 'child2');
    const child3 = new Construct(child1, 'child1child1');
    child3.setContext('c1', 'child3');
    child3.setContext('c4', 'child3');

    test.equal(root.getContext('c1'), 'root');
    test.equal(root.getContext('c2'), 'root');
    test.equal(root.getContext('c3'), undefined);

    test.equal(child1.getContext('c1'), 'root');
    test.equal(child1.getContext('c2'), 'child1');
    test.equal(child1.getContext('c3'), 'child1');

    test.equal(child2.getContext('c1'), 'root');
    test.equal(child2.getContext('c2'), 'root');
    test.equal(child2.getContext('c3'), undefined);

    test.equal(child3.getContext('c1'), 'child3');
    test.equal(child3.getContext('c2'), 'child1');
    test.equal(child3.getContext('c3'), 'child1');
    test.equal(child3.getContext('c4'), 'child3');

    test.done();
  },

  'construct.setContext(key, value) can only be called before adding any children'(test: Test) {
    const root = new Root();
    new Construct(root, 'child1');
    test.throws(() => root.setContext('k', 'v'));
    test.done();
  },

  'construct.pathParts returns an array of strings of all names from root to node'(test: Test) {
    const tree = createTree();
    test.deepEqual(tree.root.path, '');
    test.deepEqual(tree.child1_1_1.path, 'Child1/Child11/Child111');
    test.deepEqual(tree.child2.path, 'Child2');
    test.done();
  },

  'if a root construct has a name, it should be included in the path'(test: Test) {
    const tree = createTree({});
    test.deepEqual(tree.root.path, '');
    test.deepEqual(tree.child1_1_1.path, 'Child1/Child11/Child111');
    test.done();
  },

  'construct can not be created with the name of a sibling'(test: Test) {
    const root = new Root();

    // WHEN
    new Construct(root, 'SameName');

    // THEN: They have different paths
    test.throws(() => {
      new Construct(root, 'SameName');
    });

    test.done();
  },

  'addMetadata(type, data) can be used to attach metadata to constructs FIND_ME'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    test.deepEqual(con.metadata, [], 'starts empty');

    con.addMetadata('key', 'value');
    con.addMetadata('number', 103);
    con.addMetadata('array', [ 123, 456 ]);

    test.deepEqual(con.metadata[0].type, 'key');
    test.deepEqual(con.metadata[0].data, 'value');
    test.deepEqual(con.metadata[1].data, 103);
    test.deepEqual(con.metadata[2].data, [ 123, 456 ]);
    test.ok(con.metadata[0].trace[0].indexOf('FIND_ME') !== -1, 'First stack line should include this function\s name');
    test.done();
  },

  'addMetadata(type, undefined/null) is ignored'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'Foo');
    con.addMetadata('Null', null);
    con.addMetadata('Undefined', undefined);
    con.addMetadata('True', true);
    con.addMetadata('False', false);
    con.addMetadata('Empty', '');

    const exists = (key: string) => con.metadata.find(x => x.type === key);

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
    con.addWarning('This construct is deprecated, use the other one instead');
    test.deepEqual(con.metadata[0].type, cxapi.WARNING_METADATA_KEY);
    test.deepEqual(con.metadata[0].data, 'This construct is deprecated, use the other one instead');
    test.ok(con.metadata[0].trace.length > 0);
    test.done();
  },

  'addError(message) can be used to add a "ERROR" message entry to the construct'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    con.addError('Stop!');
    test.deepEqual(con.metadata[0].type, cxapi.ERROR_METADATA_KEY);
    test.deepEqual(con.metadata[0].data, 'Stop!');
    test.ok(con.metadata[0].trace.length > 0);
    test.done();
  },

  'addInfo(message) can be used to add an "INFO" message entry to the construct'(test: Test) {
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    con.addInfo('Hey there, how do you do?');
    test.deepEqual(con.metadata[0].type, cxapi.INFO_METADATA_KEY);
    test.deepEqual(con.metadata[0].data, 'Hey there, how do you do?');
    test.ok(con.metadata[0].trace.length > 0);
    test.done();
  },

  'multiple children of the same type, with explicit names are welcome'(test: Test) {
    const root = new Root();
    new MyBeautifulConstruct(root, 'mbc1');
    new MyBeautifulConstruct(root, 'mbc2');
    new MyBeautifulConstruct(root, 'mbc3');
    new MyBeautifulConstruct(root, 'mbc4');
    test.equal(root.children.length, 4);
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

  'Construct name validation can be overridden'(test: Test) {
    const root = new Root();

    test.throws(() => new IAmSpartacusConstruct(root, "Caesar"));
    new IAmSpartacusConstruct(root, "Spartacus");

    test.done();
  },

  // tslint:disable-next-line:max-line-length
  'construct.validate() can be implemented to perform validation, construct.validateTree() will return all errors from the subtree (DFS)'(test: Test) {

    class MyConstruct extends Construct {
      public validate() {
        return [ 'my-error1', 'my-error2' ];
      }
    }

    class YourConstruct extends Construct {
      public validate() {
        return [ 'your-error1' ];
      }
    }

    class TheirConstruct extends Construct {
      constructor(parent: Construct, name: string) {
        super(parent, name);

        new YourConstruct(this, 'YourConstruct');
      }

      public validate() {
        return [ 'their-error' ];
      }
    }

    class Stack extends Root {
      constructor() {
        super();

        new MyConstruct(this, 'MyConstruct');
        new TheirConstruct(this, 'TheirConstruct');
      }

      public validate() {
        return  [ 'stack-error' ];
      }
    }

    const stack = new Stack();

    const errors = (stack.validateTree()).map(v => ({ path: v.source.path, message: v.message }));

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
        this.lock();
      }

      public unlockMe() {
        this.unlock();
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
  }
};

function createTree(context?: any) {
  const root = new Root();
  if (context) {
    Object.keys(context).forEach(key => root.setContext(key, context[key]));
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
  constructor(parent: Construct, name: string) {
    super(parent, name);
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

  constructor(parent: Construct, name: string, props: ConstructWithRequiredProps) {
    super(parent, name);

    this.requiredProp = this.required(props, 'requiredProp');
    this.anotherRequiredProp = this.required(props, 'anotherRequiredProp');
  }
}

/**
 * Construct that *must* be named "Spartacus"
 */
class IAmSpartacusConstruct extends Construct {
  protected _validateId(name: string) {
    if (name !== "Spartacus") {
      throw new Error("Construct name must be 'Spartacus'");
    }
  }
}
