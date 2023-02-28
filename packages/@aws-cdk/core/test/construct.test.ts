import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Construct, ConstructOrder, IConstruct } from 'constructs';
import { reEnableStackTraceCollection, restoreStackTraceColection } from './util';
import { Names } from '../lib';
import { Annotations } from '../lib/annotations';

/* eslint-disable @typescript-eslint/naming-convention */

describe('construct', () => {
  test('the "Root" construct is a special construct which can be used as the root of the tree', () => {
    const root = new Root();
    expect(root.node.id).toEqual('');
    expect(root.node.scope).toBeUndefined();
    expect(root.node.children.length).toEqual(0);
  });

  test('constructs cannot be created with an empty name unless they are root', () => {
    const root = new Root();
    expect(() => new Construct(root, '')).toThrow();
  });

  test('construct.name returns the name of the construct', () => {
    const t = createTree();

    expect(t.child1.node.id).toEqual('Child1');
    expect(t.child2.node.id).toEqual('Child2');
    expect(t.child1_1.node.id).toEqual('Child11');
    expect(t.child1_2.node.id).toEqual('Child12');
    expect(t.child1_1_1.node.id).toEqual('Child111');
    expect(t.child2_1.node.id).toEqual('Child21');
  });

  test('construct id can use any character except the path separator', () => {
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
  });

  test('if construct id contains path seperators, they will be replaced by double-dash', () => {
    const root = new Root();
    const c = new Construct(root, 'Boom/Boom/Bam');
    expect(c.node.id).toEqual('Boom--Boom--Bam');
  });

  test('if "undefined" is forcefully used as an "id", it will be treated as an empty string', () => {
    const c = new Construct(undefined as any, undefined as any);
    expect(c.node.id).toEqual('');
  });

  testDeprecated('construct.uniqueId returns a tree-unique alphanumeric id of this construct', () => {
    const root = new Root();

    const child1 = new Construct(root, 'This is the first child');
    const child2 = new Construct(child1, 'Second level');
    const c1 = new Construct(child2, 'My construct');
    const c2 = new Construct(child1, 'My construct');

    expect(c1.node.path).toEqual('This is the first child/Second level/My construct');
    expect(c2.node.path).toEqual('This is the first child/My construct');
    expect(Names.uniqueId(c1)).toEqual('ThisisthefirstchildSecondlevelMyconstruct202131E0');
    expect(Names.uniqueId(c2)).toEqual('ThisisthefirstchildMyconstruct8C288DF9');
  });

  testDeprecated('cannot calculate uniqueId if the construct path is ["Default"]', () => {
    const root = new Root();
    const c = new Construct(root, 'Default');
    expect(() => Names.uniqueId(c)).toThrow(/Unable to calculate a unique id for an empty set of components/);
  });

  test('construct.getChildren() returns an array of all children', () => {
    const root = new Root();
    const child = new Construct(root, 'Child1');
    new Construct(root, 'Child2');
    expect(child.node.children.length).toEqual(0);
    expect(root.node.children.length).toEqual(2);
  });

  test('construct.findChild(name) can be used to retrieve a child from a parent', () => {
    const root = new Root();
    const child = new Construct(root, 'Contruct');
    expect(root.node.tryFindChild(child.node.id)).toEqual(child);
    expect(root.node.tryFindChild('NotFound')).toBeUndefined();
  });

  test('construct.getChild(name) can be used to retrieve a child from a parent', () => {
    const root = new Root();
    const child = new Construct(root, 'Contruct');
    expect(root.node.findChild(child.node.id)).toEqual(child);
    expect(() => {
      root.node.findChild('NotFound');
    }).toThrow();
  });

  test('can remove children from the tree using tryRemoveChild()', () => {
    const root = new Root();
    const childrenBeforeAdding = root.node.children.length; // Invariant to adding 'Metadata' resource or not

    // Add & remove
    const child = new Construct(root, 'Construct');
    expect(true).toEqual(root.node.tryRemoveChild(child.node.id));
    expect(false).toEqual(root.node.tryRemoveChild(child.node.id)); // Second time does nothing

    expect(undefined).toEqual(root.node.tryFindChild(child.node.id));
    expect(childrenBeforeAdding).toEqual(root.node.children.length);
  });

  test('construct.toString() and construct.toTreeString() can be used for diagnostics', () => {
    const t = createTree();

    expect(t.root.toString()).toEqual('<root>');
    expect(t.child1_1_1.toString()).toEqual('HighChild/Child1/Child11/Child111');
    expect(t.child2.toString()).toEqual('HighChild/Child2');
    expect(toTreeString(t.root)).toEqual('Root\n  Construct [HighChild]\n    Construct [Child1]\n      Construct [Child11]\n        Construct [Child111]\n      Construct [Child12]\n    Construct [Child2]\n      Construct [Child21]\n');
  });

  test('construct.getContext(key) can be used to read a value from context defined at the root level', () => {
    const context = {
      ctx1: 12,
      ctx2: 'hello',
    };

    const t = createTree(context);
    expect(t.child1_2.node.tryGetContext('ctx1')).toEqual(12);
    expect(t.child1_1_1.node.tryGetContext('ctx2')).toEqual('hello');
  });

  // eslint-disable-next-line max-len
  test('construct.setContext(k,v) sets context at some level and construct.getContext(key) will return the lowermost value defined in the stack', () => {
    const root = new Root();
    const highChild = new Construct(root, 'highChild');
    highChild.node.setContext('c1', 'root');
    highChild.node.setContext('c2', 'root');

    const child1 = new Construct(highChild, 'child1');
    child1.node.setContext('c2', 'child1');
    child1.node.setContext('c3', 'child1');

    const child2 = new Construct(highChild, 'child2');
    const child3 = new Construct(child1, 'child1child1');
    child3.node.setContext('c1', 'child3');
    child3.node.setContext('c4', 'child3');

    expect(highChild.node.tryGetContext('c1')).toEqual('root');
    expect(highChild.node.tryGetContext('c2')).toEqual('root');
    expect(highChild.node.tryGetContext('c3')).toEqual(undefined);

    expect(child1.node.tryGetContext('c1')).toEqual('root');
    expect(child1.node.tryGetContext('c2')).toEqual('child1');
    expect(child1.node.tryGetContext('c3')).toEqual('child1');

    expect(child2.node.tryGetContext('c1')).toEqual('root');
    expect(child2.node.tryGetContext('c2')).toEqual('root');
    expect(child2.node.tryGetContext('c3')).toEqual(undefined);

    expect(child3.node.tryGetContext('c1')).toEqual('child3');
    expect(child3.node.tryGetContext('c2')).toEqual('child1');
    expect(child3.node.tryGetContext('c3')).toEqual('child1');
    expect(child3.node.tryGetContext('c4')).toEqual('child3');
  });

  test('construct.setContext(key, value) can only be called before adding any children', () => {
    const root = new Root();
    new Construct(root, 'child1');
    expect(() => root.node.setContext('k', 'v'));
  });

  test('construct.pathParts returns an array of strings of all names from root to node', () => {
    const tree = createTree();
    expect(tree.root.node.path).toEqual('');
    expect(tree.child1_1_1.node.path).toEqual('HighChild/Child1/Child11/Child111');
    expect(tree.child2.node.path).toEqual('HighChild/Child2');
  });

  test('if a root construct has a name, it should be included in the path', () => {
    const tree = createTree({});
    expect(tree.root.node.path).toEqual('');
    expect(tree.child1_1_1.node.path).toEqual('HighChild/Child1/Child11/Child111');
  });

  test('construct can not be created with the name of a sibling', () => {
    const root = new Root();

    // WHEN
    new Construct(root, 'SameName');

    // THEN: They have different paths
    expect(() => {
      new Construct(root, 'SameName');
    }).toThrow(/There is already a Construct with name 'SameName' in Root/);

    // WHEN
    const c0 = new Construct(root, 'c0');
    new Construct(c0, 'SameName');

    // THEN: They have different paths
    expect(() => {
      new Construct(c0, 'SameName');
    }).toThrow(/There is already a Construct with name 'SameName' in Construct \[c0\]/);
  });

  test('addMetadata(type, data) can be used to attach metadata to constructs FIND_ME', () => {
    const previousValue = reEnableStackTraceCollection();
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    expect(con.node.metadata).toEqual([]);

    con.node.addMetadata('key', 'value', { stackTrace: true });
    con.node.addMetadata('number', 103);
    con.node.addMetadata('array', [123, 456]);
    restoreStackTraceColection(previousValue);

    expect(con.node.metadata[0].type).toEqual('key');
    expect(con.node.metadata[0].data).toEqual('value');
    expect(con.node.metadata[1].data).toEqual(103);
    expect(con.node.metadata[2].data).toEqual([123, 456]);
    expect(con.node.metadata[0].trace && con.node.metadata[0].trace[1].indexOf('FIND_ME')).toEqual(-1);
  });

  test('addMetadata(type, undefined/null) is ignored', () => {
    const root = new Root();
    const con = new Construct(root, 'Foo');
    con.node.addMetadata('Null', null);
    con.node.addMetadata('Undefined', undefined);
    con.node.addMetadata('True', true);
    con.node.addMetadata('False', false);
    con.node.addMetadata('Empty', '');

    const exists = (key: string) => con.node.metadata.find(x => x.type === key);

    expect(exists('Null')).toBeUndefined();
    expect(exists('Undefined')).toBeUndefined();
    expect(exists('True')).toBeDefined();
    expect(exists('False')).toBeDefined();
    expect(exists('Empty')).toBeDefined();
  });

  test('addWarning(message) can be used to add a "WARNING" message entry to the construct', () => {
    const previousValue = reEnableStackTraceCollection();
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    Annotations.of(con).addWarning('This construct is deprecated, use the other one instead');
    restoreStackTraceColection(previousValue);

    expect(con.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
    expect(con.node.metadata[0].data).toEqual('This construct is deprecated, use the other one instead');
    expect(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0).toEqual(true);
  });

  test('addError(message) can be used to add a "ERROR" message entry to the construct', () => {
    const previousValue = reEnableStackTraceCollection();
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    Annotations.of(con).addError('Stop!');
    restoreStackTraceColection(previousValue);

    expect(con.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.ERROR);
    expect(con.node.metadata[0].data).toEqual('Stop!');
    expect(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0).toEqual(true);
  });

  test('addInfo(message) can be used to add an "INFO" message entry to the construct', () => {
    const previousValue = reEnableStackTraceCollection();
    const root = new Root();
    const con = new Construct(root, 'MyConstruct');
    Annotations.of(con).addInfo('Hey there, how do you do?');
    restoreStackTraceColection(previousValue);

    expect(con.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.INFO);
    expect(con.node.metadata[0].data).toEqual('Hey there, how do you do?');
    expect(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0).toEqual(true);
  });

  test('multiple children of the same type, with explicit names are welcome', () => {
    const root = new Root();
    new MyBeautifulConstruct(root, 'mbc1');
    new MyBeautifulConstruct(root, 'mbc2');
    new MyBeautifulConstruct(root, 'mbc3');
    new MyBeautifulConstruct(root, 'mbc4');
    expect(root.node.children.length).toBeGreaterThanOrEqual(4);
  });

  // eslint-disable-next-line max-len
  test('construct.validate() can be implemented to perform validation, ConstructNode.validate(construct.node) will return all errors from the subtree (DFS)', () => {
    class MyConstruct extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);
        this.node.addValidation({ validate: () => ['my-error1', 'my-error2'] });
      }
    }

    class YourConstruct extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);
        this.node.addValidation({ validate: () => ['your-error1'] });
      }
    }

    class TheirConstruct extends Construct {
      constructor(scope: Construct, id: string) {
        super(scope, id);

        new YourConstruct(this, 'YourConstruct');
        this.node.addValidation({ validate: () => ['their-error'] });
      }
    }

    class TestStack extends Root {
      constructor() {
        super();

        new MyConstruct(this, 'MyConstruct');
        new TheirConstruct(this, 'TheirConstruct');

        this.node.addValidation({ validate: () => ['stack-error'] });
      }
    }

    const stack = new TestStack();

    const errors = new Array<{ path: string, message: string }>();
    for (const child of stack.node.findAll()) {
      for (const message of child.node.validate()) {
        errors.push({
          path: child.node.path,
          message,
        });
      }
    }

    // validate DFS
    expect(errors).toEqual([
      { path: '', message: 'stack-error' },
      { path: 'MyConstruct', message: 'my-error1' },
      { path: 'MyConstruct', message: 'my-error2' },
      { path: 'TheirConstruct', message: 'their-error' },
      { path: 'TheirConstruct/YourConstruct', message: 'your-error1' },
    ]);
  });

  test('construct.lock() protects against adding children anywhere under this construct (direct or indirect)', () => {
    class LockableConstruct extends Construct {
      public lockMe() {
        this.node.lock();
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
    expect(() => new Construct(c0a, 'fail1')).toThrow(/Cannot add children to "c0a" during synthesis/);
    expect(() => new Construct(c1a, 'fail2')).toThrow(/Cannot add children to "c0a\/c1a" during synthesis/);
    expect(() => new Construct(c1b, 'fail3')).toThrow(/Cannot add children to "c0a\/c1b" during synthesis/);
  });

  test('findAll returns a list of all children in either DFS or BFS', () => {
    // GIVEN
    const c1 = new Construct(undefined as any, '1');
    const c2 = new Construct(c1, '2');
    new Construct(c1, '3');
    new Construct(c2, '4');
    new Construct(c2, '5');

    // THEN
    expect(c1.node.findAll().map(x => x.node.id)).toEqual(c1.node.findAll(ConstructOrder.PREORDER).map(x => x.node.id)); // default is PreOrder
    expect(c1.node.findAll(ConstructOrder.PREORDER).map(x => x.node.id)).toEqual(['1', '2', '4', '5', '3']);
    expect(c1.node.findAll(ConstructOrder.POSTORDER).map(x => x.node.id)).toEqual(['4', '5', '2', '3', '1']);
  });

  test('ancestors returns a list of parents up to root', () => {
    const { child1_1_1 } = createTree();
    expect(child1_1_1.node.scopes.map(x => x.node.id)).toEqual(['', 'HighChild', 'Child1', 'Child11', 'Child111']);
  });

  test('"root" returns the root construct', () => {
    const { child1, child2, child1_1_1, root } = createTree();
    expect(child1.node.root).toEqual(root);
    expect(child2.node.root).toEqual(root);
    expect(child1_1_1.node.root).toEqual(root);
  });

  describe('defaultChild', () => {
    test('returns the child with id "Resource"', () => {
      const root = new Root();
      new Construct(root, 'child1');
      const defaultChild = new Construct(root, 'Resource');
      new Construct(root, 'child2');

      expect(root.node.defaultChild).toEqual(defaultChild);
    });

    test('returns the child with id "Default"', () => {
      const root = new Root();
      new Construct(root, 'child1');
      const defaultChild = new Construct(root, 'Default');
      new Construct(root, 'child2');

      expect(root.node.defaultChild).toEqual(defaultChild);
    });

    test('can override defaultChild', () => {
      const root = new Root();
      new Construct(root, 'Resource');
      const defaultChild = new Construct(root, 'OtherResource');
      root.node.defaultChild = defaultChild;

      expect(root.node.defaultChild).toEqual(defaultChild);
    });

    test('returns "undefined" if there is no default', () => {
      const root = new Root();
      new Construct(root, 'child1');
      new Construct(root, 'child2');

      expect(root.node.defaultChild).toEqual(undefined);
    });

    test('fails if there are both "Resource" and "Default"', () => {
      const root = new Root();
      new Construct(root, 'child1');
      new Construct(root, 'Default');
      new Construct(root, 'child2');
      new Construct(root, 'Resource');

      expect(() => root.node.defaultChild).toThrow(
        /Cannot determine default child for . There is both a child with id "Resource" and id "Default"/);
    });
  });
});

function createTree(context?: any) {
  const root = new Root();
  const highChild = new Construct(root, 'HighChild');
  if (context) {
    Object.keys(context).forEach(key => highChild.node.setContext(key, context[key]));
  }

  const child1 = new Construct(highChild, 'Child1');
  const child2 = new Construct(highChild, 'Child2');
  const child1_1 = new Construct(child1, 'Child11');
  const child1_2 = new Construct(child1, 'Child12');
  const child1_1_1 = new Construct(child1_1, 'Child111');
  const child2_1 = new Construct(child2, 'Child21');

  return {
    root, child1, child2, child1_1, child1_2, child1_1_1, child2_1,
  };
}

class MyBeautifulConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

/**
 * Returns a string with a tree representation of this construct and it's children.
 */
function toTreeString(node: IConstruct, depth = 0) {
  let out = '';
  for (let i = 0; i < depth; ++i) {
    out += '  ';
  }
  const name = node.node.id || '';
  out += `${node.constructor.name}${name.length > 0 ? ' [' + name + ']' : ''}\n`;
  for (const child of node.node.children) {
    out += toTreeString(child, depth + 1);
  }
  return out;
}

class Root extends Construct {
  constructor() {
    super(undefined as any, undefined as any);
  }
}
