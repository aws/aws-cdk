"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const constructs_1 = require("constructs");
const util_1 = require("./util");
const lib_1 = require("../lib");
const annotations_1 = require("../lib/annotations");
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
        expect(() => new constructs_1.Construct(root, '')).toThrow();
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
        new constructs_1.Construct(root, 'valid');
        new constructs_1.Construct(root, 'ValiD');
        new constructs_1.Construct(root, 'Va123lid');
        new constructs_1.Construct(root, 'v');
        new constructs_1.Construct(root, '  invalid');
        new constructs_1.Construct(root, 'invalid   ');
        new constructs_1.Construct(root, '123invalid');
        new constructs_1.Construct(root, 'in valid');
        new constructs_1.Construct(root, 'in_Valid');
        new constructs_1.Construct(root, 'in-Valid');
        new constructs_1.Construct(root, 'in\\Valid');
        new constructs_1.Construct(root, 'in.Valid');
    });
    test('if construct id contains path seperators, they will be replaced by double-dash', () => {
        const root = new Root();
        const c = new constructs_1.Construct(root, 'Boom/Boom/Bam');
        expect(c.node.id).toEqual('Boom--Boom--Bam');
    });
    test('if "undefined" is forcefully used as an "id", it will be treated as an empty string', () => {
        const c = new constructs_1.Construct(undefined, undefined);
        expect(c.node.id).toEqual('');
    });
    (0, cdk_build_tools_1.testDeprecated)('construct.uniqueId returns a tree-unique alphanumeric id of this construct', () => {
        const root = new Root();
        const child1 = new constructs_1.Construct(root, 'This is the first child');
        const child2 = new constructs_1.Construct(child1, 'Second level');
        const c1 = new constructs_1.Construct(child2, 'My construct');
        const c2 = new constructs_1.Construct(child1, 'My construct');
        expect(c1.node.path).toEqual('This is the first child/Second level/My construct');
        expect(c2.node.path).toEqual('This is the first child/My construct');
        expect(lib_1.Names.uniqueId(c1)).toEqual('ThisisthefirstchildSecondlevelMyconstruct202131E0');
        expect(lib_1.Names.uniqueId(c2)).toEqual('ThisisthefirstchildMyconstruct8C288DF9');
    });
    (0, cdk_build_tools_1.testDeprecated)('cannot calculate uniqueId if the construct path is ["Default"]', () => {
        const root = new Root();
        const c = new constructs_1.Construct(root, 'Default');
        expect(() => lib_1.Names.uniqueId(c)).toThrow(/Unable to calculate a unique id for an empty set of components/);
    });
    test('construct.getChildren() returns an array of all children', () => {
        const root = new Root();
        const child = new constructs_1.Construct(root, 'Child1');
        new constructs_1.Construct(root, 'Child2');
        expect(child.node.children.length).toEqual(0);
        expect(root.node.children.length).toEqual(2);
    });
    test('construct.findChild(name) can be used to retrieve a child from a parent', () => {
        const root = new Root();
        const child = new constructs_1.Construct(root, 'Contruct');
        expect(root.node.tryFindChild(child.node.id)).toEqual(child);
        expect(root.node.tryFindChild('NotFound')).toBeUndefined();
    });
    test('construct.getChild(name) can be used to retrieve a child from a parent', () => {
        const root = new Root();
        const child = new constructs_1.Construct(root, 'Contruct');
        expect(root.node.findChild(child.node.id)).toEqual(child);
        expect(() => {
            root.node.findChild('NotFound');
        }).toThrow();
    });
    test('can remove children from the tree using tryRemoveChild()', () => {
        const root = new Root();
        const childrenBeforeAdding = root.node.children.length; // Invariant to adding 'Metadata' resource or not
        // Add & remove
        const child = new constructs_1.Construct(root, 'Construct');
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
        const highChild = new constructs_1.Construct(root, 'highChild');
        highChild.node.setContext('c1', 'root');
        highChild.node.setContext('c2', 'root');
        const child1 = new constructs_1.Construct(highChild, 'child1');
        child1.node.setContext('c2', 'child1');
        child1.node.setContext('c3', 'child1');
        const child2 = new constructs_1.Construct(highChild, 'child2');
        const child3 = new constructs_1.Construct(child1, 'child1child1');
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
        new constructs_1.Construct(root, 'child1');
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
        new constructs_1.Construct(root, 'SameName');
        // THEN: They have different paths
        expect(() => {
            new constructs_1.Construct(root, 'SameName');
        }).toThrow(/There is already a Construct with name 'SameName' in Root/);
        // WHEN
        const c0 = new constructs_1.Construct(root, 'c0');
        new constructs_1.Construct(c0, 'SameName');
        // THEN: They have different paths
        expect(() => {
            new constructs_1.Construct(c0, 'SameName');
        }).toThrow(/There is already a Construct with name 'SameName' in Construct \[c0\]/);
    });
    test('addMetadata(type, data) can be used to attach metadata to constructs FIND_ME', () => {
        const previousValue = (0, util_1.reEnableStackTraceCollection)();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        expect(con.node.metadata).toEqual([]);
        con.node.addMetadata('key', 'value', { stackTrace: true });
        con.node.addMetadata('number', 103);
        con.node.addMetadata('array', [123, 456]);
        (0, util_1.restoreStackTraceColection)(previousValue);
        expect(con.node.metadata[0].type).toEqual('key');
        expect(con.node.metadata[0].data).toEqual('value');
        expect(con.node.metadata[1].data).toEqual(103);
        expect(con.node.metadata[2].data).toEqual([123, 456]);
        expect(con.node.metadata[0].trace && con.node.metadata[0].trace[1].indexOf('FIND_ME')).toEqual(-1);
    });
    test('addMetadata(type, undefined/null) is ignored', () => {
        const root = new Root();
        const con = new constructs_1.Construct(root, 'Foo');
        con.node.addMetadata('Null', null);
        con.node.addMetadata('Undefined', undefined);
        con.node.addMetadata('True', true);
        con.node.addMetadata('False', false);
        con.node.addMetadata('Empty', '');
        const exists = (key) => con.node.metadata.find(x => x.type === key);
        expect(exists('Null')).toBeUndefined();
        expect(exists('Undefined')).toBeUndefined();
        expect(exists('True')).toBeDefined();
        expect(exists('False')).toBeDefined();
        expect(exists('Empty')).toBeDefined();
    });
    test('addWarning(message) can be used to add a "WARNING" message entry to the construct', () => {
        const previousValue = (0, util_1.reEnableStackTraceCollection)();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        annotations_1.Annotations.of(con).addWarning('This construct is deprecated, use the other one instead');
        (0, util_1.restoreStackTraceColection)(previousValue);
        expect(con.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
        expect(con.node.metadata[0].data).toEqual('This construct is deprecated, use the other one instead');
        expect(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0).toEqual(true);
    });
    test('addError(message) can be used to add a "ERROR" message entry to the construct', () => {
        const previousValue = (0, util_1.reEnableStackTraceCollection)();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        annotations_1.Annotations.of(con).addError('Stop!');
        (0, util_1.restoreStackTraceColection)(previousValue);
        expect(con.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.ERROR);
        expect(con.node.metadata[0].data).toEqual('Stop!');
        expect(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0).toEqual(true);
    });
    test('addInfo(message) can be used to add an "INFO" message entry to the construct', () => {
        const previousValue = (0, util_1.reEnableStackTraceCollection)();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        annotations_1.Annotations.of(con).addInfo('Hey there, how do you do?');
        (0, util_1.restoreStackTraceColection)(previousValue);
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
        class MyConstruct extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                this.node.addValidation({ validate: () => ['my-error1', 'my-error2'] });
            }
        }
        class YourConstruct extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                this.node.addValidation({ validate: () => ['your-error1'] });
            }
        }
        class TheirConstruct extends constructs_1.Construct {
            constructor(scope, id) {
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
        const errors = new Array();
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
        class LockableConstruct extends constructs_1.Construct {
            lockMe() {
                this.node.lock();
            }
        }
        const stack = new Root();
        const c0a = new LockableConstruct(stack, 'c0a');
        const c0b = new constructs_1.Construct(stack, 'c0b');
        const c1a = new constructs_1.Construct(c0a, 'c1a');
        const c1b = new constructs_1.Construct(c0a, 'c1b');
        c0a.lockMe();
        // now we should still be able to add children to c0b, but not to c0a or any its children
        new constructs_1.Construct(c0b, 'c1a');
        expect(() => new constructs_1.Construct(c0a, 'fail1')).toThrow(/Cannot add children to "c0a" during synthesis/);
        expect(() => new constructs_1.Construct(c1a, 'fail2')).toThrow(/Cannot add children to "c0a\/c1a" during synthesis/);
        expect(() => new constructs_1.Construct(c1b, 'fail3')).toThrow(/Cannot add children to "c0a\/c1b" during synthesis/);
    });
    test('findAll returns a list of all children in either DFS or BFS', () => {
        // GIVEN
        const c1 = new constructs_1.Construct(undefined, '1');
        const c2 = new constructs_1.Construct(c1, '2');
        new constructs_1.Construct(c1, '3');
        new constructs_1.Construct(c2, '4');
        new constructs_1.Construct(c2, '5');
        // THEN
        expect(c1.node.findAll().map(x => x.node.id)).toEqual(c1.node.findAll(constructs_1.ConstructOrder.PREORDER).map(x => x.node.id)); // default is PreOrder
        expect(c1.node.findAll(constructs_1.ConstructOrder.PREORDER).map(x => x.node.id)).toEqual(['1', '2', '4', '5', '3']);
        expect(c1.node.findAll(constructs_1.ConstructOrder.POSTORDER).map(x => x.node.id)).toEqual(['4', '5', '2', '3', '1']);
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
            new constructs_1.Construct(root, 'child1');
            const defaultChild = new constructs_1.Construct(root, 'Resource');
            new constructs_1.Construct(root, 'child2');
            expect(root.node.defaultChild).toEqual(defaultChild);
        });
        test('returns the child with id "Default"', () => {
            const root = new Root();
            new constructs_1.Construct(root, 'child1');
            const defaultChild = new constructs_1.Construct(root, 'Default');
            new constructs_1.Construct(root, 'child2');
            expect(root.node.defaultChild).toEqual(defaultChild);
        });
        test('can override defaultChild', () => {
            const root = new Root();
            new constructs_1.Construct(root, 'Resource');
            const defaultChild = new constructs_1.Construct(root, 'OtherResource');
            root.node.defaultChild = defaultChild;
            expect(root.node.defaultChild).toEqual(defaultChild);
        });
        test('returns "undefined" if there is no default', () => {
            const root = new Root();
            new constructs_1.Construct(root, 'child1');
            new constructs_1.Construct(root, 'child2');
            expect(root.node.defaultChild).toEqual(undefined);
        });
        test('fails if there are both "Resource" and "Default"', () => {
            const root = new Root();
            new constructs_1.Construct(root, 'child1');
            new constructs_1.Construct(root, 'Default');
            new constructs_1.Construct(root, 'child2');
            new constructs_1.Construct(root, 'Resource');
            expect(() => root.node.defaultChild).toThrow(/Cannot determine default child for . There is both a child with id "Resource" and id "Default"/);
        });
    });
});
function createTree(context) {
    const root = new Root();
    const highChild = new constructs_1.Construct(root, 'HighChild');
    if (context) {
        Object.keys(context).forEach(key => highChild.node.setContext(key, context[key]));
    }
    const child1 = new constructs_1.Construct(highChild, 'Child1');
    const child2 = new constructs_1.Construct(highChild, 'Child2');
    const child1_1 = new constructs_1.Construct(child1, 'Child11');
    const child1_2 = new constructs_1.Construct(child1, 'Child12');
    const child1_1_1 = new constructs_1.Construct(child1_1, 'Child111');
    const child2_1 = new constructs_1.Construct(child2, 'Child21');
    return {
        root, child1, child2, child1_1, child1_2, child1_1_1, child2_1,
    };
}
class MyBeautifulConstruct extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
    }
}
/**
 * Returns a string with a tree representation of this construct and it's children.
 */
function toTreeString(node, depth = 0) {
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
class Root extends constructs_1.Construct {
    constructor() {
        super(undefined, undefined);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zdHJ1Y3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUEwRDtBQUMxRCwyREFBMkQ7QUFDM0QsMkNBQW1FO0FBQ25FLGlDQUFrRjtBQUNsRixnQ0FBK0I7QUFDL0Isb0RBQWlEO0FBRWpELHlEQUF5RDtBQUV6RCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixJQUFJLENBQUMsdUZBQXVGLEVBQUUsR0FBRyxFQUFFO1FBQ2pHLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQ2hGLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsTUFBTSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUM7UUFFdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QixJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEMsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBRSxDQUFDO1FBQ2xDLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFFLENBQUM7UUFDbkMsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUUsQ0FBQztRQUNuQyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBRSxDQUFDO1FBQ2pDLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFFLENBQUM7UUFDakMsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUUsQ0FBQztRQUNqQyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBRSxDQUFDO1FBQ2xDLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFFLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0ZBQWdGLEVBQUUsR0FBRyxFQUFFO1FBQzFGLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxRkFBcUYsRUFBRSxHQUFHLEVBQUU7UUFDL0YsTUFBTSxDQUFDLEdBQUcsSUFBSSxzQkFBUyxDQUFDLFNBQWdCLEVBQUUsU0FBZ0IsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUEsZ0NBQWMsRUFBQyw0RUFBNEUsRUFBRSxHQUFHLEVBQUU7UUFDaEcsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUV4QixNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBUyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRCxNQUFNLEVBQUUsR0FBRyxJQUFJLHNCQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sRUFBRSxHQUFHLElBQUksc0JBQVMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFakQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7UUFDbEYsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLFdBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbURBQW1ELENBQUMsQ0FBQztRQUN4RixNQUFNLENBQUMsV0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBQSxnQ0FBYyxFQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtRQUNwRixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztJQUM1RyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHlFQUF5RSxFQUFFLEdBQUcsRUFBRTtRQUNuRixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0VBQXdFLEVBQUUsR0FBRyxFQUFFO1FBQ2xGLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN4QixNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGlEQUFpRDtRQUV6RyxlQUFlO1FBQ2YsTUFBTSxLQUFLLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLDJCQUEyQjtRQUUzRixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0VBQStFLEVBQUUsR0FBRyxFQUFFO1FBQ3pGLE1BQU0sQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBRXZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDN0UsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnTUFBZ00sQ0FBQyxDQUFDO0lBQ3pPLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhGQUE4RixFQUFFLEdBQUcsRUFBRTtRQUN4RyxNQUFNLE9BQU8sR0FBRztZQUNkLElBQUksRUFBRSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFDO1FBRUYsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztJQUVILG1DQUFtQztJQUNuQyxJQUFJLENBQUMseUlBQXlJLEVBQUUsR0FBRyxFQUFFO1FBQ25KLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNuRCxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXhDLE1BQU0sTUFBTSxHQUFHLElBQUksc0JBQVMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFTLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUksc0JBQVMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV2QyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU5RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUxRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUzRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0ZBQWdGLEVBQUUsR0FBRyxFQUFFO1FBQzFGLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0ZBQWdGLEVBQUUsR0FBRyxFQUFFO1FBQzFGLE1BQU0sSUFBSSxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7UUFDN0UsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtRQUNuRSxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRXhCLE9BQU87UUFDUCxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWhDLGtDQUFrQztRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkRBQTJELENBQUMsQ0FBQztRQUV4RSxPQUFPO1FBQ1AsTUFBTSxFQUFFLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLHNCQUFTLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTlCLGtDQUFrQztRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxzQkFBUyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUVBQXVFLENBQUMsQ0FBQztJQUN0RixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4RUFBOEUsRUFBRSxHQUFHLEVBQUU7UUFDeEYsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQ0FBNEIsR0FBRSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNELEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFBLGlDQUEwQixFQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDeEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0MsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFNUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtRkFBbUYsRUFBRSxHQUFHLEVBQUU7UUFDN0YsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQ0FBNEIsR0FBRSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvQyx5QkFBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMseURBQXlELENBQUMsQ0FBQztRQUMxRixJQUFBLGlDQUEwQixFQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMseURBQXlELENBQUMsQ0FBQztRQUNyRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtFQUErRSxFQUFFLEdBQUcsRUFBRTtRQUN6RixNQUFNLGFBQWEsR0FBRyxJQUFBLG1DQUE0QixHQUFFLENBQUM7UUFDckQsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9DLHlCQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxJQUFBLGlDQUEwQixFQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4RUFBOEUsRUFBRSxHQUFHLEVBQUU7UUFDeEYsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQ0FBNEIsR0FBRSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvQyx5QkFBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN6RCxJQUFBLGlDQUEwQixFQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN2RSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtRQUMvRSxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUVILG1DQUFtQztJQUNuQyxJQUFJLENBQUMscUpBQXFKLEVBQUUsR0FBRyxFQUFFO1FBQy9KLE1BQU0sV0FBWSxTQUFRLHNCQUFTO1lBQ2pDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO2dCQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUUsQ0FBQztTQUNGO1FBRUQsTUFBTSxhQUFjLFNBQVEsc0JBQVM7WUFDbkMsWUFBWSxLQUFnQixFQUFFLEVBQVU7Z0JBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELENBQUM7U0FDRjtRQUVELE1BQU0sY0FBZSxTQUFRLHNCQUFTO1lBQ3BDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO2dCQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVqQixJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELENBQUM7U0FDRjtRQUVELE1BQU0sU0FBVSxTQUFRLElBQUk7WUFDMUI7Z0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBRVIsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztnQkFFM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0QsQ0FBQztTQUNGO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUU5QixNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBcUMsQ0FBQztRQUM5RCxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDeEMsS0FBSyxNQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNWLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7b0JBQ3JCLE9BQU87aUJBQ1IsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtRQUVELGVBQWU7UUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3JCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFO1lBQ3BDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO1lBQzdDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO1lBQzdDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7WUFDbEQsRUFBRSxJQUFJLEVBQUUsOEJBQThCLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTtTQUNqRSxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzR0FBc0csRUFBRSxHQUFHLEVBQUU7UUFDaEgsTUFBTSxpQkFBa0IsU0FBUSxzQkFBUztZQUNoQyxNQUFNO2dCQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsQ0FBQztTQUNGO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUV6QixNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRCxNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhDLE1BQU0sR0FBRyxHQUFHLElBQUksc0JBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFYix5RkFBeUY7UUFDekYsSUFBSSxzQkFBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxzQkFBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQ25HLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLHNCQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7UUFDeEcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksc0JBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0RBQW9ELENBQUMsQ0FBQztJQUMxRyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7UUFDdkUsUUFBUTtRQUNSLE1BQU0sRUFBRSxHQUFHLElBQUksc0JBQVMsQ0FBQyxTQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sRUFBRSxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxzQkFBUyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLHNCQUFTLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksc0JBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFdkIsT0FBTztRQUNQLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsMkJBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7UUFDM0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLDJCQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQywyQkFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzRyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7UUFDMUQsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDakgsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxVQUFVLEVBQUUsQ0FBQztRQUMxRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQzVCLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN4QixJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckQsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU5QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDeEIsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM5QixNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3hCLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDaEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7WUFFdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3hCLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUIsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU5QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1lBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDeEIsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM5QixJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9CLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUIsSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUVoQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQzFDLGdHQUFnRyxDQUFDLENBQUM7UUFDdEcsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxVQUFVLENBQUMsT0FBYTtJQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3hCLE1BQU0sU0FBUyxHQUFHLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbkQsSUFBSSxPQUFPLEVBQUU7UUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25GO0lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFTLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsRCxNQUFNLFVBQVUsR0FBRyxJQUFJLHNCQUFTLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFbEQsT0FBTztRQUNMLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVE7S0FDL0QsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLG9CQUFxQixTQUFRLHNCQUFTO0lBQzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkIsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxJQUFnQixFQUFFLEtBQUssR0FBRyxDQUFDO0lBQy9DLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDOUIsR0FBRyxJQUFJLElBQUksQ0FBQztLQUNiO0lBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ2hDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDL0UsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUN0QyxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDdkM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLElBQUssU0FBUSxzQkFBUztJQUMxQjtRQUNFLEtBQUssQ0FBQyxTQUFnQixFQUFFLFNBQWdCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBDb25zdHJ1Y3RPcmRlciwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbiwgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgTmFtZXMgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuLi9saWIvYW5ub3RhdGlvbnMnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb24gKi9cblxuZGVzY3JpYmUoJ2NvbnN0cnVjdCcsICgpID0+IHtcbiAgdGVzdCgndGhlIFwiUm9vdFwiIGNvbnN0cnVjdCBpcyBhIHNwZWNpYWwgY29uc3RydWN0IHdoaWNoIGNhbiBiZSB1c2VkIGFzIHRoZSByb290IG9mIHRoZSB0cmVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGV4cGVjdChyb290Lm5vZGUuaWQpLnRvRXF1YWwoJycpO1xuICAgIGV4cGVjdChyb290Lm5vZGUuc2NvcGUpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLmNoaWxkcmVuLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0cyBjYW5ub3QgYmUgY3JlYXRlZCB3aXRoIGFuIGVtcHR5IG5hbWUgdW5sZXNzIHRoZXkgYXJlIHJvb3QnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJycpKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5uYW1lIHJldHVybnMgdGhlIG5hbWUgb2YgdGhlIGNvbnN0cnVjdCcsICgpID0+IHtcbiAgICBjb25zdCB0ID0gY3JlYXRlVHJlZSgpO1xuXG4gICAgZXhwZWN0KHQuY2hpbGQxLm5vZGUuaWQpLnRvRXF1YWwoJ0NoaWxkMScpO1xuICAgIGV4cGVjdCh0LmNoaWxkMi5ub2RlLmlkKS50b0VxdWFsKCdDaGlsZDInKTtcbiAgICBleHBlY3QodC5jaGlsZDFfMS5ub2RlLmlkKS50b0VxdWFsKCdDaGlsZDExJyk7XG4gICAgZXhwZWN0KHQuY2hpbGQxXzIubm9kZS5pZCkudG9FcXVhbCgnQ2hpbGQxMicpO1xuICAgIGV4cGVjdCh0LmNoaWxkMV8xXzEubm9kZS5pZCkudG9FcXVhbCgnQ2hpbGQxMTEnKTtcbiAgICBleHBlY3QodC5jaGlsZDJfMS5ub2RlLmlkKS50b0VxdWFsKCdDaGlsZDIxJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdCBpZCBjYW4gdXNlIGFueSBjaGFyYWN0ZXIgZXhjZXB0IHRoZSBwYXRoIHNlcGFyYXRvcicsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICd2YWxpZCcpO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1ZhbGlEJyk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnVmExMjNsaWQnKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICd2Jyk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnICBpbnZhbGlkJyApO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2ludmFsaWQgICAnICk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnMTIzaW52YWxpZCcgKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdpbiB2YWxpZCcgKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdpbl9WYWxpZCcgKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdpbi1WYWxpZCcgKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdpblxcXFxWYWxpZCcgKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdpbi5WYWxpZCcgKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWYgY29uc3RydWN0IGlkIGNvbnRhaW5zIHBhdGggc2VwZXJhdG9ycywgdGhleSB3aWxsIGJlIHJlcGxhY2VkIGJ5IGRvdWJsZS1kYXNoJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGMgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdCb29tL0Jvb20vQmFtJyk7XG4gICAgZXhwZWN0KGMubm9kZS5pZCkudG9FcXVhbCgnQm9vbS0tQm9vbS0tQmFtJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIFwidW5kZWZpbmVkXCIgaXMgZm9yY2VmdWxseSB1c2VkIGFzIGFuIFwiaWRcIiwgaXQgd2lsbCBiZSB0cmVhdGVkIGFzIGFuIGVtcHR5IHN0cmluZycsICgpID0+IHtcbiAgICBjb25zdCBjID0gbmV3IENvbnN0cnVjdCh1bmRlZmluZWQgYXMgYW55LCB1bmRlZmluZWQgYXMgYW55KTtcbiAgICBleHBlY3QoYy5ub2RlLmlkKS50b0VxdWFsKCcnKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NvbnN0cnVjdC51bmlxdWVJZCByZXR1cm5zIGEgdHJlZS11bmlxdWUgYWxwaGFudW1lcmljIGlkIG9mIHRoaXMgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuXG4gICAgY29uc3QgY2hpbGQxID0gbmV3IENvbnN0cnVjdChyb290LCAnVGhpcyBpcyB0aGUgZmlyc3QgY2hpbGQnKTtcbiAgICBjb25zdCBjaGlsZDIgPSBuZXcgQ29uc3RydWN0KGNoaWxkMSwgJ1NlY29uZCBsZXZlbCcpO1xuICAgIGNvbnN0IGMxID0gbmV3IENvbnN0cnVjdChjaGlsZDIsICdNeSBjb25zdHJ1Y3QnKTtcbiAgICBjb25zdCBjMiA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQxLCAnTXkgY29uc3RydWN0Jyk7XG5cbiAgICBleHBlY3QoYzEubm9kZS5wYXRoKS50b0VxdWFsKCdUaGlzIGlzIHRoZSBmaXJzdCBjaGlsZC9TZWNvbmQgbGV2ZWwvTXkgY29uc3RydWN0Jyk7XG4gICAgZXhwZWN0KGMyLm5vZGUucGF0aCkudG9FcXVhbCgnVGhpcyBpcyB0aGUgZmlyc3QgY2hpbGQvTXkgY29uc3RydWN0Jyk7XG4gICAgZXhwZWN0KE5hbWVzLnVuaXF1ZUlkKGMxKSkudG9FcXVhbCgnVGhpc2lzdGhlZmlyc3RjaGlsZFNlY29uZGxldmVsTXljb25zdHJ1Y3QyMDIxMzFFMCcpO1xuICAgIGV4cGVjdChOYW1lcy51bmlxdWVJZChjMikpLnRvRXF1YWwoJ1RoaXNpc3RoZWZpcnN0Y2hpbGRNeWNvbnN0cnVjdDhDMjg4REY5Jyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdjYW5ub3QgY2FsY3VsYXRlIHVuaXF1ZUlkIGlmIHRoZSBjb25zdHJ1Y3QgcGF0aCBpcyBbXCJEZWZhdWx0XCJdJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGMgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdEZWZhdWx0Jyk7XG4gICAgZXhwZWN0KCgpID0+IE5hbWVzLnVuaXF1ZUlkKGMpKS50b1Rocm93KC9VbmFibGUgdG8gY2FsY3VsYXRlIGEgdW5pcXVlIGlkIGZvciBhbiBlbXB0eSBzZXQgb2YgY29tcG9uZW50cy8pO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QuZ2V0Q2hpbGRyZW4oKSByZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBjaGlsZHJlbicsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0NoaWxkMScpO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0NoaWxkMicpO1xuICAgIGV4cGVjdChjaGlsZC5ub2RlLmNoaWxkcmVuLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLmNoaWxkcmVuLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LmZpbmRDaGlsZChuYW1lKSBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSBhIGNoaWxkIGZyb20gYSBwYXJlbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdDb250cnVjdCcpO1xuICAgIGV4cGVjdChyb290Lm5vZGUudHJ5RmluZENoaWxkKGNoaWxkLm5vZGUuaWQpKS50b0VxdWFsKGNoaWxkKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLnRyeUZpbmRDaGlsZCgnTm90Rm91bmQnKSkudG9CZVVuZGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QuZ2V0Q2hpbGQobmFtZSkgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgYSBjaGlsZCBmcm9tIGEgcGFyZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnQ29udHJ1Y3QnKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLmZpbmRDaGlsZChjaGlsZC5ub2RlLmlkKSkudG9FcXVhbChjaGlsZCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHJvb3Qubm9kZS5maW5kQ2hpbGQoJ05vdEZvdW5kJyk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcmVtb3ZlIGNoaWxkcmVuIGZyb20gdGhlIHRyZWUgdXNpbmcgdHJ5UmVtb3ZlQ2hpbGQoKScsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjaGlsZHJlbkJlZm9yZUFkZGluZyA9IHJvb3Qubm9kZS5jaGlsZHJlbi5sZW5ndGg7IC8vIEludmFyaWFudCB0byBhZGRpbmcgJ01ldGFkYXRhJyByZXNvdXJjZSBvciBub3RcblxuICAgIC8vIEFkZCAmIHJlbW92ZVxuICAgIGNvbnN0IGNoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnQ29uc3RydWN0Jyk7XG4gICAgZXhwZWN0KHRydWUpLnRvRXF1YWwocm9vdC5ub2RlLnRyeVJlbW92ZUNoaWxkKGNoaWxkLm5vZGUuaWQpKTtcbiAgICBleHBlY3QoZmFsc2UpLnRvRXF1YWwocm9vdC5ub2RlLnRyeVJlbW92ZUNoaWxkKGNoaWxkLm5vZGUuaWQpKTsgLy8gU2Vjb25kIHRpbWUgZG9lcyBub3RoaW5nXG5cbiAgICBleHBlY3QodW5kZWZpbmVkKS50b0VxdWFsKHJvb3Qubm9kZS50cnlGaW5kQ2hpbGQoY2hpbGQubm9kZS5pZCkpO1xuICAgIGV4cGVjdChjaGlsZHJlbkJlZm9yZUFkZGluZykudG9FcXVhbChyb290Lm5vZGUuY2hpbGRyZW4ubGVuZ3RoKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LnRvU3RyaW5nKCkgYW5kIGNvbnN0cnVjdC50b1RyZWVTdHJpbmcoKSBjYW4gYmUgdXNlZCBmb3IgZGlhZ25vc3RpY3MnLCAoKSA9PiB7XG4gICAgY29uc3QgdCA9IGNyZWF0ZVRyZWUoKTtcblxuICAgIGV4cGVjdCh0LnJvb3QudG9TdHJpbmcoKSkudG9FcXVhbCgnPHJvb3Q+Jyk7XG4gICAgZXhwZWN0KHQuY2hpbGQxXzFfMS50b1N0cmluZygpKS50b0VxdWFsKCdIaWdoQ2hpbGQvQ2hpbGQxL0NoaWxkMTEvQ2hpbGQxMTEnKTtcbiAgICBleHBlY3QodC5jaGlsZDIudG9TdHJpbmcoKSkudG9FcXVhbCgnSGlnaENoaWxkL0NoaWxkMicpO1xuICAgIGV4cGVjdCh0b1RyZWVTdHJpbmcodC5yb290KSkudG9FcXVhbCgnUm9vdFxcbiAgQ29uc3RydWN0IFtIaWdoQ2hpbGRdXFxuICAgIENvbnN0cnVjdCBbQ2hpbGQxXVxcbiAgICAgIENvbnN0cnVjdCBbQ2hpbGQxMV1cXG4gICAgICAgIENvbnN0cnVjdCBbQ2hpbGQxMTFdXFxuICAgICAgQ29uc3RydWN0IFtDaGlsZDEyXVxcbiAgICBDb25zdHJ1Y3QgW0NoaWxkMl1cXG4gICAgICBDb25zdHJ1Y3QgW0NoaWxkMjFdXFxuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5nZXRDb250ZXh0KGtleSkgY2FuIGJlIHVzZWQgdG8gcmVhZCBhIHZhbHVlIGZyb20gY29udGV4dCBkZWZpbmVkIGF0IHRoZSByb290IGxldmVsJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICBjdHgxOiAxMixcbiAgICAgIGN0eDI6ICdoZWxsbycsXG4gICAgfTtcblxuICAgIGNvbnN0IHQgPSBjcmVhdGVUcmVlKGNvbnRleHQpO1xuICAgIGV4cGVjdCh0LmNoaWxkMV8yLm5vZGUudHJ5R2V0Q29udGV4dCgnY3R4MScpKS50b0VxdWFsKDEyKTtcbiAgICBleHBlY3QodC5jaGlsZDFfMV8xLm5vZGUudHJ5R2V0Q29udGV4dCgnY3R4MicpKS50b0VxdWFsKCdoZWxsbycpO1xuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICB0ZXN0KCdjb25zdHJ1Y3Quc2V0Q29udGV4dChrLHYpIHNldHMgY29udGV4dCBhdCBzb21lIGxldmVsIGFuZCBjb25zdHJ1Y3QuZ2V0Q29udGV4dChrZXkpIHdpbGwgcmV0dXJuIHRoZSBsb3dlcm1vc3QgdmFsdWUgZGVmaW5lZCBpbiB0aGUgc3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgaGlnaENoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnaGlnaENoaWxkJyk7XG4gICAgaGlnaENoaWxkLm5vZGUuc2V0Q29udGV4dCgnYzEnLCAncm9vdCcpO1xuICAgIGhpZ2hDaGlsZC5ub2RlLnNldENvbnRleHQoJ2MyJywgJ3Jvb3QnKTtcblxuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBDb25zdHJ1Y3QoaGlnaENoaWxkLCAnY2hpbGQxJyk7XG4gICAgY2hpbGQxLm5vZGUuc2V0Q29udGV4dCgnYzInLCAnY2hpbGQxJyk7XG4gICAgY2hpbGQxLm5vZGUuc2V0Q29udGV4dCgnYzMnLCAnY2hpbGQxJyk7XG5cbiAgICBjb25zdCBjaGlsZDIgPSBuZXcgQ29uc3RydWN0KGhpZ2hDaGlsZCwgJ2NoaWxkMicpO1xuICAgIGNvbnN0IGNoaWxkMyA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQxLCAnY2hpbGQxY2hpbGQxJyk7XG4gICAgY2hpbGQzLm5vZGUuc2V0Q29udGV4dCgnYzEnLCAnY2hpbGQzJyk7XG4gICAgY2hpbGQzLm5vZGUuc2V0Q29udGV4dCgnYzQnLCAnY2hpbGQzJyk7XG5cbiAgICBleHBlY3QoaGlnaENoaWxkLm5vZGUudHJ5R2V0Q29udGV4dCgnYzEnKSkudG9FcXVhbCgncm9vdCcpO1xuICAgIGV4cGVjdChoaWdoQ2hpbGQubm9kZS50cnlHZXRDb250ZXh0KCdjMicpKS50b0VxdWFsKCdyb290Jyk7XG4gICAgZXhwZWN0KGhpZ2hDaGlsZC5ub2RlLnRyeUdldENvbnRleHQoJ2MzJykpLnRvRXF1YWwodW5kZWZpbmVkKTtcblxuICAgIGV4cGVjdChjaGlsZDEubm9kZS50cnlHZXRDb250ZXh0KCdjMScpKS50b0VxdWFsKCdyb290Jyk7XG4gICAgZXhwZWN0KGNoaWxkMS5ub2RlLnRyeUdldENvbnRleHQoJ2MyJykpLnRvRXF1YWwoJ2NoaWxkMScpO1xuICAgIGV4cGVjdChjaGlsZDEubm9kZS50cnlHZXRDb250ZXh0KCdjMycpKS50b0VxdWFsKCdjaGlsZDEnKTtcblxuICAgIGV4cGVjdChjaGlsZDIubm9kZS50cnlHZXRDb250ZXh0KCdjMScpKS50b0VxdWFsKCdyb290Jyk7XG4gICAgZXhwZWN0KGNoaWxkMi5ub2RlLnRyeUdldENvbnRleHQoJ2MyJykpLnRvRXF1YWwoJ3Jvb3QnKTtcbiAgICBleHBlY3QoY2hpbGQyLm5vZGUudHJ5R2V0Q29udGV4dCgnYzMnKSkudG9FcXVhbCh1bmRlZmluZWQpO1xuXG4gICAgZXhwZWN0KGNoaWxkMy5ub2RlLnRyeUdldENvbnRleHQoJ2MxJykpLnRvRXF1YWwoJ2NoaWxkMycpO1xuICAgIGV4cGVjdChjaGlsZDMubm9kZS50cnlHZXRDb250ZXh0KCdjMicpKS50b0VxdWFsKCdjaGlsZDEnKTtcbiAgICBleHBlY3QoY2hpbGQzLm5vZGUudHJ5R2V0Q29udGV4dCgnYzMnKSkudG9FcXVhbCgnY2hpbGQxJyk7XG4gICAgZXhwZWN0KGNoaWxkMy5ub2RlLnRyeUdldENvbnRleHQoJ2M0JykpLnRvRXF1YWwoJ2NoaWxkMycpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3Quc2V0Q29udGV4dChrZXksIHZhbHVlKSBjYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlIGFkZGluZyBhbnkgY2hpbGRyZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQxJyk7XG4gICAgZXhwZWN0KCgpID0+IHJvb3Qubm9kZS5zZXRDb250ZXh0KCdrJywgJ3YnKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5wYXRoUGFydHMgcmV0dXJucyBhbiBhcnJheSBvZiBzdHJpbmdzIG9mIGFsbCBuYW1lcyBmcm9tIHJvb3QgdG8gbm9kZScsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gY3JlYXRlVHJlZSgpO1xuICAgIGV4cGVjdCh0cmVlLnJvb3Qubm9kZS5wYXRoKS50b0VxdWFsKCcnKTtcbiAgICBleHBlY3QodHJlZS5jaGlsZDFfMV8xLm5vZGUucGF0aCkudG9FcXVhbCgnSGlnaENoaWxkL0NoaWxkMS9DaGlsZDExL0NoaWxkMTExJyk7XG4gICAgZXhwZWN0KHRyZWUuY2hpbGQyLm5vZGUucGF0aCkudG9FcXVhbCgnSGlnaENoaWxkL0NoaWxkMicpO1xuICB9KTtcblxuICB0ZXN0KCdpZiBhIHJvb3QgY29uc3RydWN0IGhhcyBhIG5hbWUsIGl0IHNob3VsZCBiZSBpbmNsdWRlZCBpbiB0aGUgcGF0aCcsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gY3JlYXRlVHJlZSh7fSk7XG4gICAgZXhwZWN0KHRyZWUucm9vdC5ub2RlLnBhdGgpLnRvRXF1YWwoJycpO1xuICAgIGV4cGVjdCh0cmVlLmNoaWxkMV8xXzEubm9kZS5wYXRoKS50b0VxdWFsKCdIaWdoQ2hpbGQvQ2hpbGQxL0NoaWxkMTEvQ2hpbGQxMTEnKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0IGNhbiBub3QgYmUgY3JlYXRlZCB3aXRoIHRoZSBuYW1lIG9mIGEgc2libGluZycsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdTYW1lTmFtZScpO1xuXG4gICAgLy8gVEhFTjogVGhleSBoYXZlIGRpZmZlcmVudCBwYXRoc1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdTYW1lTmFtZScpO1xuICAgIH0pLnRvVGhyb3coL1RoZXJlIGlzIGFscmVhZHkgYSBDb25zdHJ1Y3Qgd2l0aCBuYW1lICdTYW1lTmFtZScgaW4gUm9vdC8pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGMwID0gbmV3IENvbnN0cnVjdChyb290LCAnYzAnKTtcbiAgICBuZXcgQ29uc3RydWN0KGMwLCAnU2FtZU5hbWUnKTtcblxuICAgIC8vIFRIRU46IFRoZXkgaGF2ZSBkaWZmZXJlbnQgcGF0aHNcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IENvbnN0cnVjdChjMCwgJ1NhbWVOYW1lJyk7XG4gICAgfSkudG9UaHJvdygvVGhlcmUgaXMgYWxyZWFkeSBhIENvbnN0cnVjdCB3aXRoIG5hbWUgJ1NhbWVOYW1lJyBpbiBDb25zdHJ1Y3QgXFxbYzBcXF0vKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTWV0YWRhdGEodHlwZSwgZGF0YSkgY2FuIGJlIHVzZWQgdG8gYXR0YWNoIG1ldGFkYXRhIHRvIGNvbnN0cnVjdHMgRklORF9NRScsICgpID0+IHtcbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNvbiA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ015Q29uc3RydWN0Jyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhKS50b0VxdWFsKFtdKTtcblxuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdrZXknLCAndmFsdWUnLCB7IHN0YWNrVHJhY2U6IHRydWUgfSk7XG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ251bWJlcicsIDEwMyk7XG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ2FycmF5JywgWzEyMywgNDU2XSk7XG4gICAgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24ocHJldmlvdXNWYWx1ZSk7XG5cbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHlwZSkudG9FcXVhbCgna2V5Jyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLmRhdGEpLnRvRXF1YWwoJ3ZhbHVlJyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzFdLmRhdGEpLnRvRXF1YWwoMTAzKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMl0uZGF0YSkudG9FcXVhbChbMTIzLCA0NTZdKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2UgJiYgY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2VbMV0uaW5kZXhPZignRklORF9NRScpKS50b0VxdWFsKC0xKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTWV0YWRhdGEodHlwZSwgdW5kZWZpbmVkL251bGwpIGlzIGlnbm9yZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY29uID0gbmV3IENvbnN0cnVjdChyb290LCAnRm9vJyk7XG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ051bGwnLCBudWxsKTtcbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgnVW5kZWZpbmVkJywgdW5kZWZpbmVkKTtcbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgnVHJ1ZScsIHRydWUpO1xuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdGYWxzZScsIGZhbHNlKTtcbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgnRW1wdHknLCAnJyk7XG5cbiAgICBjb25zdCBleGlzdHMgPSAoa2V5OiBzdHJpbmcpID0+IGNvbi5ub2RlLm1ldGFkYXRhLmZpbmQoeCA9PiB4LnR5cGUgPT09IGtleSk7XG5cbiAgICBleHBlY3QoZXhpc3RzKCdOdWxsJykpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QoZXhpc3RzKCdVbmRlZmluZWQnKSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdChleGlzdHMoJ1RydWUnKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoZXhpc3RzKCdGYWxzZScpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChleGlzdHMoJ0VtcHR5JykpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZFdhcm5pbmcobWVzc2FnZSkgY2FuIGJlIHVzZWQgdG8gYWRkIGEgXCJXQVJOSU5HXCIgbWVzc2FnZSBlbnRyeSB0byB0aGUgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSByZUVuYWJsZVN0YWNrVHJhY2VDb2xsZWN0aW9uKCk7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY29uID0gbmV3IENvbnN0cnVjdChyb290LCAnTXlDb25zdHJ1Y3QnKTtcbiAgICBBbm5vdGF0aW9ucy5vZihjb24pLmFkZFdhcm5pbmcoJ1RoaXMgY29uc3RydWN0IGlzIGRlcHJlY2F0ZWQsIHVzZSB0aGUgb3RoZXIgb25lIGluc3RlYWQnKTtcbiAgICByZXN0b3JlU3RhY2tUcmFjZUNvbGVjdGlvbihwcmV2aW91c1ZhbHVlKTtcblxuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50eXBlKS50b0VxdWFsKGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuV0FSTik7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLmRhdGEpLnRvRXF1YWwoJ1RoaXMgY29uc3RydWN0IGlzIGRlcHJlY2F0ZWQsIHVzZSB0aGUgb3RoZXIgb25lIGluc3RlYWQnKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2UgJiYgY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2UubGVuZ3RoID4gMCkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkRXJyb3IobWVzc2FnZSkgY2FuIGJlIHVzZWQgdG8gYWRkIGEgXCJFUlJPUlwiIG1lc3NhZ2UgZW50cnkgdG8gdGhlIGNvbnN0cnVjdCcsICgpID0+IHtcbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNvbiA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ015Q29uc3RydWN0Jyk7XG4gICAgQW5ub3RhdGlvbnMub2YoY29uKS5hZGRFcnJvcignU3RvcCEnKTtcbiAgICByZXN0b3JlU3RhY2tUcmFjZUNvbGVjdGlvbihwcmV2aW91c1ZhbHVlKTtcblxuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50eXBlKS50b0VxdWFsKGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuRVJST1IpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS5kYXRhKS50b0VxdWFsKCdTdG9wIScpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZSAmJiBjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZS5sZW5ndGggPiAwKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdhZGRJbmZvKG1lc3NhZ2UpIGNhbiBiZSB1c2VkIHRvIGFkZCBhbiBcIklORk9cIiBtZXNzYWdlIGVudHJ5IHRvIHRoZSBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHJlRW5hYmxlU3RhY2tUcmFjZUNvbGxlY3Rpb24oKTtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjb24gPSBuZXcgQ29uc3RydWN0KHJvb3QsICdNeUNvbnN0cnVjdCcpO1xuICAgIEFubm90YXRpb25zLm9mKGNvbikuYWRkSW5mbygnSGV5IHRoZXJlLCBob3cgZG8geW91IGRvPycpO1xuICAgIHJlc3RvcmVTdGFja1RyYWNlQ29sZWN0aW9uKHByZXZpb3VzVmFsdWUpO1xuXG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnR5cGUpLnRvRXF1YWwoY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5JTkZPKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0uZGF0YSkudG9FcXVhbCgnSGV5IHRoZXJlLCBob3cgZG8geW91IGRvPycpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZSAmJiBjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZS5sZW5ndGggPiAwKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSBjaGlsZHJlbiBvZiB0aGUgc2FtZSB0eXBlLCB3aXRoIGV4cGxpY2l0IG5hbWVzIGFyZSB3ZWxjb21lJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIG5ldyBNeUJlYXV0aWZ1bENvbnN0cnVjdChyb290LCAnbWJjMScpO1xuICAgIG5ldyBNeUJlYXV0aWZ1bENvbnN0cnVjdChyb290LCAnbWJjMicpO1xuICAgIG5ldyBNeUJlYXV0aWZ1bENvbnN0cnVjdChyb290LCAnbWJjMycpO1xuICAgIG5ldyBNeUJlYXV0aWZ1bENvbnN0cnVjdChyb290LCAnbWJjNCcpO1xuICAgIGV4cGVjdChyb290Lm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDQpO1xuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICB0ZXN0KCdjb25zdHJ1Y3QudmFsaWRhdGUoKSBjYW4gYmUgaW1wbGVtZW50ZWQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uLCBDb25zdHJ1Y3ROb2RlLnZhbGlkYXRlKGNvbnN0cnVjdC5ub2RlKSB3aWxsIHJldHVybiBhbGwgZXJyb3JzIGZyb20gdGhlIHN1YnRyZWUgKERGUyknLCAoKSA9PiB7XG4gICAgY2xhc3MgTXlDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiBbJ215LWVycm9yMScsICdteS1lcnJvcjInXSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBZb3VyQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gWyd5b3VyLWVycm9yMSddIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIFRoZWlyQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBuZXcgWW91ckNvbnN0cnVjdCh0aGlzLCAnWW91ckNvbnN0cnVjdCcpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiBbJ3RoZWlyLWVycm9yJ10gfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgUm9vdCB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBuZXcgTXlDb25zdHJ1Y3QodGhpcywgJ015Q29uc3RydWN0Jyk7XG4gICAgICAgIG5ldyBUaGVpckNvbnN0cnVjdCh0aGlzLCAnVGhlaXJDb25zdHJ1Y3QnKTtcblxuICAgICAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiBbJ3N0YWNrLWVycm9yJ10gfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgVGVzdFN0YWNrKCk7XG5cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgQXJyYXk8eyBwYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyB9PigpO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygc3RhY2subm9kZS5maW5kQWxsKCkpIHtcbiAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBjaGlsZC5ub2RlLnZhbGlkYXRlKCkpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goe1xuICAgICAgICAgIHBhdGg6IGNoaWxkLm5vZGUucGF0aCxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB2YWxpZGF0ZSBERlNcbiAgICBleHBlY3QoZXJyb3JzKS50b0VxdWFsKFtcbiAgICAgIHsgcGF0aDogJycsIG1lc3NhZ2U6ICdzdGFjay1lcnJvcicgfSxcbiAgICAgIHsgcGF0aDogJ015Q29uc3RydWN0JywgbWVzc2FnZTogJ215LWVycm9yMScgfSxcbiAgICAgIHsgcGF0aDogJ015Q29uc3RydWN0JywgbWVzc2FnZTogJ215LWVycm9yMicgfSxcbiAgICAgIHsgcGF0aDogJ1RoZWlyQ29uc3RydWN0JywgbWVzc2FnZTogJ3RoZWlyLWVycm9yJyB9LFxuICAgICAgeyBwYXRoOiAnVGhlaXJDb25zdHJ1Y3QvWW91ckNvbnN0cnVjdCcsIG1lc3NhZ2U6ICd5b3VyLWVycm9yMScgfSxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LmxvY2soKSBwcm90ZWN0cyBhZ2FpbnN0IGFkZGluZyBjaGlsZHJlbiBhbnl3aGVyZSB1bmRlciB0aGlzIGNvbnN0cnVjdCAoZGlyZWN0IG9yIGluZGlyZWN0KScsICgpID0+IHtcbiAgICBjbGFzcyBMb2NrYWJsZUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBwdWJsaWMgbG9ja01lKCkge1xuICAgICAgICB0aGlzLm5vZGUubG9jaygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFJvb3QoKTtcblxuICAgIGNvbnN0IGMwYSA9IG5ldyBMb2NrYWJsZUNvbnN0cnVjdChzdGFjaywgJ2MwYScpO1xuICAgIGNvbnN0IGMwYiA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdjMGInKTtcblxuICAgIGNvbnN0IGMxYSA9IG5ldyBDb25zdHJ1Y3QoYzBhLCAnYzFhJyk7XG4gICAgY29uc3QgYzFiID0gbmV3IENvbnN0cnVjdChjMGEsICdjMWInKTtcblxuICAgIGMwYS5sb2NrTWUoKTtcblxuICAgIC8vIG5vdyB3ZSBzaG91bGQgc3RpbGwgYmUgYWJsZSB0byBhZGQgY2hpbGRyZW4gdG8gYzBiLCBidXQgbm90IHRvIGMwYSBvciBhbnkgaXRzIGNoaWxkcmVuXG4gICAgbmV3IENvbnN0cnVjdChjMGIsICdjMWEnKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IENvbnN0cnVjdChjMGEsICdmYWlsMScpKS50b1Rocm93KC9DYW5ub3QgYWRkIGNoaWxkcmVuIHRvIFwiYzBhXCIgZHVyaW5nIHN5bnRoZXNpcy8pO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgQ29uc3RydWN0KGMxYSwgJ2ZhaWwyJykpLnRvVGhyb3coL0Nhbm5vdCBhZGQgY2hpbGRyZW4gdG8gXCJjMGFcXC9jMWFcIiBkdXJpbmcgc3ludGhlc2lzLyk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBDb25zdHJ1Y3QoYzFiLCAnZmFpbDMnKSkudG9UaHJvdygvQ2Fubm90IGFkZCBjaGlsZHJlbiB0byBcImMwYVxcL2MxYlwiIGR1cmluZyBzeW50aGVzaXMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmluZEFsbCByZXR1cm5zIGEgbGlzdCBvZiBhbGwgY2hpbGRyZW4gaW4gZWl0aGVyIERGUyBvciBCRlMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBjMSA9IG5ldyBDb25zdHJ1Y3QodW5kZWZpbmVkIGFzIGFueSwgJzEnKTtcbiAgICBjb25zdCBjMiA9IG5ldyBDb25zdHJ1Y3QoYzEsICcyJyk7XG4gICAgbmV3IENvbnN0cnVjdChjMSwgJzMnKTtcbiAgICBuZXcgQ29uc3RydWN0KGMyLCAnNCcpO1xuICAgIG5ldyBDb25zdHJ1Y3QoYzIsICc1Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGMxLm5vZGUuZmluZEFsbCgpLm1hcCh4ID0+IHgubm9kZS5pZCkpLnRvRXF1YWwoYzEubm9kZS5maW5kQWxsKENvbnN0cnVjdE9yZGVyLlBSRU9SREVSKS5tYXAoeCA9PiB4Lm5vZGUuaWQpKTsgLy8gZGVmYXVsdCBpcyBQcmVPcmRlclxuICAgIGV4cGVjdChjMS5ub2RlLmZpbmRBbGwoQ29uc3RydWN0T3JkZXIuUFJFT1JERVIpLm1hcCh4ID0+IHgubm9kZS5pZCkpLnRvRXF1YWwoWycxJywgJzInLCAnNCcsICc1JywgJzMnXSk7XG4gICAgZXhwZWN0KGMxLm5vZGUuZmluZEFsbChDb25zdHJ1Y3RPcmRlci5QT1NUT1JERVIpLm1hcCh4ID0+IHgubm9kZS5pZCkpLnRvRXF1YWwoWyc0JywgJzUnLCAnMicsICczJywgJzEnXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FuY2VzdG9ycyByZXR1cm5zIGEgbGlzdCBvZiBwYXJlbnRzIHVwIHRvIHJvb3QnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBjaGlsZDFfMV8xIH0gPSBjcmVhdGVUcmVlKCk7XG4gICAgZXhwZWN0KGNoaWxkMV8xXzEubm9kZS5zY29wZXMubWFwKHggPT4geC5ub2RlLmlkKSkudG9FcXVhbChbJycsICdIaWdoQ2hpbGQnLCAnQ2hpbGQxJywgJ0NoaWxkMTEnLCAnQ2hpbGQxMTEnXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wicm9vdFwiIHJldHVybnMgdGhlIHJvb3QgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHsgY2hpbGQxLCBjaGlsZDIsIGNoaWxkMV8xXzEsIHJvb3QgfSA9IGNyZWF0ZVRyZWUoKTtcbiAgICBleHBlY3QoY2hpbGQxLm5vZGUucm9vdCkudG9FcXVhbChyb290KTtcbiAgICBleHBlY3QoY2hpbGQyLm5vZGUucm9vdCkudG9FcXVhbChyb290KTtcbiAgICBleHBlY3QoY2hpbGQxXzFfMS5ub2RlLnJvb3QpLnRvRXF1YWwocm9vdCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZWZhdWx0Q2hpbGQnLCAoKSA9PiB7XG4gICAgdGVzdCgncmV0dXJucyB0aGUgY2hpbGQgd2l0aCBpZCBcIlJlc291cmNlXCInLCAoKSA9PiB7XG4gICAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMScpO1xuICAgICAgY29uc3QgZGVmYXVsdENoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnUmVzb3VyY2UnKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMicpO1xuXG4gICAgICBleHBlY3Qocm9vdC5ub2RlLmRlZmF1bHRDaGlsZCkudG9FcXVhbChkZWZhdWx0Q2hpbGQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyB0aGUgY2hpbGQgd2l0aCBpZCBcIkRlZmF1bHRcIicsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQxJyk7XG4gICAgICBjb25zdCBkZWZhdWx0Q2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdEZWZhdWx0Jyk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDInKTtcblxuICAgICAgZXhwZWN0KHJvb3Qubm9kZS5kZWZhdWx0Q2hpbGQpLnRvRXF1YWwoZGVmYXVsdENoaWxkKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBvdmVycmlkZSBkZWZhdWx0Q2hpbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1Jlc291cmNlJyk7XG4gICAgICBjb25zdCBkZWZhdWx0Q2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdPdGhlclJlc291cmNlJyk7XG4gICAgICByb290Lm5vZGUuZGVmYXVsdENoaWxkID0gZGVmYXVsdENoaWxkO1xuXG4gICAgICBleHBlY3Qocm9vdC5ub2RlLmRlZmF1bHRDaGlsZCkudG9FcXVhbChkZWZhdWx0Q2hpbGQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyBcInVuZGVmaW5lZFwiIGlmIHRoZXJlIGlzIG5vIGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMScpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQyJyk7XG5cbiAgICAgIGV4cGVjdChyb290Lm5vZGUuZGVmYXVsdENoaWxkKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBpZiB0aGVyZSBhcmUgYm90aCBcIlJlc291cmNlXCIgYW5kIFwiRGVmYXVsdFwiJywgKCkgPT4ge1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDEnKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0RlZmF1bHQnKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMicpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnUmVzb3VyY2UnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHJvb3Qubm9kZS5kZWZhdWx0Q2hpbGQpLnRvVGhyb3coXG4gICAgICAgIC9DYW5ub3QgZGV0ZXJtaW5lIGRlZmF1bHQgY2hpbGQgZm9yIC4gVGhlcmUgaXMgYm90aCBhIGNoaWxkIHdpdGggaWQgXCJSZXNvdXJjZVwiIGFuZCBpZCBcIkRlZmF1bHRcIi8pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBjcmVhdGVUcmVlKGNvbnRleHQ/OiBhbnkpIHtcbiAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gIGNvbnN0IGhpZ2hDaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0hpZ2hDaGlsZCcpO1xuICBpZiAoY29udGV4dCkge1xuICAgIE9iamVjdC5rZXlzKGNvbnRleHQpLmZvckVhY2goa2V5ID0+IGhpZ2hDaGlsZC5ub2RlLnNldENvbnRleHQoa2V5LCBjb250ZXh0W2tleV0pKTtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkMSA9IG5ldyBDb25zdHJ1Y3QoaGlnaENoaWxkLCAnQ2hpbGQxJyk7XG4gIGNvbnN0IGNoaWxkMiA9IG5ldyBDb25zdHJ1Y3QoaGlnaENoaWxkLCAnQ2hpbGQyJyk7XG4gIGNvbnN0IGNoaWxkMV8xID0gbmV3IENvbnN0cnVjdChjaGlsZDEsICdDaGlsZDExJyk7XG4gIGNvbnN0IGNoaWxkMV8yID0gbmV3IENvbnN0cnVjdChjaGlsZDEsICdDaGlsZDEyJyk7XG4gIGNvbnN0IGNoaWxkMV8xXzEgPSBuZXcgQ29uc3RydWN0KGNoaWxkMV8xLCAnQ2hpbGQxMTEnKTtcbiAgY29uc3QgY2hpbGQyXzEgPSBuZXcgQ29uc3RydWN0KGNoaWxkMiwgJ0NoaWxkMjEnKTtcblxuICByZXR1cm4ge1xuICAgIHJvb3QsIGNoaWxkMSwgY2hpbGQyLCBjaGlsZDFfMSwgY2hpbGQxXzIsIGNoaWxkMV8xXzEsIGNoaWxkMl8xLFxuICB9O1xufVxuXG5jbGFzcyBNeUJlYXV0aWZ1bENvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyB3aXRoIGEgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGNvbnN0cnVjdCBhbmQgaXQncyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gdG9UcmVlU3RyaW5nKG5vZGU6IElDb25zdHJ1Y3QsIGRlcHRoID0gMCkge1xuICBsZXQgb3V0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGVwdGg7ICsraSkge1xuICAgIG91dCArPSAnICAnO1xuICB9XG4gIGNvbnN0IG5hbWUgPSBub2RlLm5vZGUuaWQgfHwgJyc7XG4gIG91dCArPSBgJHtub2RlLmNvbnN0cnVjdG9yLm5hbWV9JHtuYW1lLmxlbmd0aCA+IDAgPyAnIFsnICsgbmFtZSArICddJyA6ICcnfVxcbmA7XG4gIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5ub2RlLmNoaWxkcmVuKSB7XG4gICAgb3V0ICs9IHRvVHJlZVN0cmluZyhjaGlsZCwgZGVwdGggKyAxKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5jbGFzcyBSb290IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIodW5kZWZpbmVkIGFzIGFueSwgdW5kZWZpbmVkIGFzIGFueSk7XG4gIH1cbn1cbiJdfQ==