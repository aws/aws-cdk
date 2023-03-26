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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zdHJ1Y3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUEwRDtBQUMxRCwyREFBMkQ7QUFDM0QsMkNBQW1FO0FBQ25FLGlDQUFrRjtBQUNsRixnQ0FBK0I7QUFDL0Isb0RBQWlEO0FBRWpELHlEQUF5RDtBQUV6RCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixJQUFJLENBQUMsdUZBQXVGLEVBQUUsR0FBRyxFQUFFO1FBQ2pHLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQ2hGLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsTUFBTSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUM7UUFFdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FB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RUQ7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxJQUFnQixFQUFFLEtBQUssR0FBRyxDQUFDO0lBQy9DLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDOUIsR0FBRyxJQUFJLElBQUksQ0FBQztLQUNiO0lBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ2hDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDL0UsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUN0QyxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDdkM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLElBQUssU0FBUSxzQkFBUztJQUMxQjtRQUNFLEtBQUssQ0FBQyxTQUFnQixFQUFFLFNBQWdCLENBQUMsQ0FBQztLQUMzQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IENvbnN0cnVjdCwgQ29uc3RydWN0T3JkZXIsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IHJlRW5hYmxlU3RhY2tUcmFjZUNvbGxlY3Rpb24sIHJlc3RvcmVTdGFja1RyYWNlQ29sZWN0aW9uIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IE5hbWVzIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi4vbGliL2Fubm90YXRpb25zJztcblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uICovXG5cbmRlc2NyaWJlKCdjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gIHRlc3QoJ3RoZSBcIlJvb3RcIiBjb25zdHJ1Y3QgaXMgYSBzcGVjaWFsIGNvbnN0cnVjdCB3aGljaCBjYW4gYmUgdXNlZCBhcyB0aGUgcm9vdCBvZiB0aGUgdHJlZScsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLmlkKS50b0VxdWFsKCcnKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLnNjb3BlKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdHMgY2Fubm90IGJlIGNyZWF0ZWQgd2l0aCBhbiBlbXB0eSBuYW1lIHVubGVzcyB0aGV5IGFyZSByb290JywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgQ29uc3RydWN0KHJvb3QsICcnKSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QubmFtZSByZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgY29uc3QgdCA9IGNyZWF0ZVRyZWUoKTtcblxuICAgIGV4cGVjdCh0LmNoaWxkMS5ub2RlLmlkKS50b0VxdWFsKCdDaGlsZDEnKTtcbiAgICBleHBlY3QodC5jaGlsZDIubm9kZS5pZCkudG9FcXVhbCgnQ2hpbGQyJyk7XG4gICAgZXhwZWN0KHQuY2hpbGQxXzEubm9kZS5pZCkudG9FcXVhbCgnQ2hpbGQxMScpO1xuICAgIGV4cGVjdCh0LmNoaWxkMV8yLm5vZGUuaWQpLnRvRXF1YWwoJ0NoaWxkMTInKTtcbiAgICBleHBlY3QodC5jaGlsZDFfMV8xLm5vZGUuaWQpLnRvRXF1YWwoJ0NoaWxkMTExJyk7XG4gICAgZXhwZWN0KHQuY2hpbGQyXzEubm9kZS5pZCkudG9FcXVhbCgnQ2hpbGQyMScpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QgaWQgY2FuIHVzZSBhbnkgY2hhcmFjdGVyIGV4Y2VwdCB0aGUgcGF0aCBzZXBhcmF0b3InLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAndmFsaWQnKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdWYWxpRCcpO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1ZhMTIzbGlkJyk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAndicpO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJyAgaW52YWxpZCcgKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdpbnZhbGlkICAgJyApO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJzEyM2ludmFsaWQnICk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnaW4gdmFsaWQnICk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnaW5fVmFsaWQnICk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnaW4tVmFsaWQnICk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnaW5cXFxcVmFsaWQnICk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnaW4uVmFsaWQnICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIGNvbnN0cnVjdCBpZCBjb250YWlucyBwYXRoIHNlcGVyYXRvcnMsIHRoZXkgd2lsbCBiZSByZXBsYWNlZCBieSBkb3VibGUtZGFzaCcsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjID0gbmV3IENvbnN0cnVjdChyb290LCAnQm9vbS9Cb29tL0JhbScpO1xuICAgIGV4cGVjdChjLm5vZGUuaWQpLnRvRXF1YWwoJ0Jvb20tLUJvb20tLUJhbScpO1xuICB9KTtcblxuICB0ZXN0KCdpZiBcInVuZGVmaW5lZFwiIGlzIGZvcmNlZnVsbHkgdXNlZCBhcyBhbiBcImlkXCIsIGl0IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiBlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgY29uc3QgYyA9IG5ldyBDb25zdHJ1Y3QodW5kZWZpbmVkIGFzIGFueSwgdW5kZWZpbmVkIGFzIGFueSk7XG4gICAgZXhwZWN0KGMubm9kZS5pZCkudG9FcXVhbCgnJyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdjb25zdHJ1Y3QudW5pcXVlSWQgcmV0dXJucyBhIHRyZWUtdW5pcXVlIGFscGhhbnVtZXJpYyBpZCBvZiB0aGlzIGNvbnN0cnVjdCcsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcblxuICAgIGNvbnN0IGNoaWxkMSA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1RoaXMgaXMgdGhlIGZpcnN0IGNoaWxkJyk7XG4gICAgY29uc3QgY2hpbGQyID0gbmV3IENvbnN0cnVjdChjaGlsZDEsICdTZWNvbmQgbGV2ZWwnKTtcbiAgICBjb25zdCBjMSA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQyLCAnTXkgY29uc3RydWN0Jyk7XG4gICAgY29uc3QgYzIgPSBuZXcgQ29uc3RydWN0KGNoaWxkMSwgJ015IGNvbnN0cnVjdCcpO1xuXG4gICAgZXhwZWN0KGMxLm5vZGUucGF0aCkudG9FcXVhbCgnVGhpcyBpcyB0aGUgZmlyc3QgY2hpbGQvU2Vjb25kIGxldmVsL015IGNvbnN0cnVjdCcpO1xuICAgIGV4cGVjdChjMi5ub2RlLnBhdGgpLnRvRXF1YWwoJ1RoaXMgaXMgdGhlIGZpcnN0IGNoaWxkL015IGNvbnN0cnVjdCcpO1xuICAgIGV4cGVjdChOYW1lcy51bmlxdWVJZChjMSkpLnRvRXF1YWwoJ1RoaXNpc3RoZWZpcnN0Y2hpbGRTZWNvbmRsZXZlbE15Y29uc3RydWN0MjAyMTMxRTAnKTtcbiAgICBleHBlY3QoTmFtZXMudW5pcXVlSWQoYzIpKS50b0VxdWFsKCdUaGlzaXN0aGVmaXJzdGNoaWxkTXljb25zdHJ1Y3Q4QzI4OERGOScpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY2Fubm90IGNhbGN1bGF0ZSB1bmlxdWVJZCBpZiB0aGUgY29uc3RydWN0IHBhdGggaXMgW1wiRGVmYXVsdFwiXScsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjID0gbmV3IENvbnN0cnVjdChyb290LCAnRGVmYXVsdCcpO1xuICAgIGV4cGVjdCgoKSA9PiBOYW1lcy51bmlxdWVJZChjKSkudG9UaHJvdygvVW5hYmxlIHRvIGNhbGN1bGF0ZSBhIHVuaXF1ZSBpZCBmb3IgYW4gZW1wdHkgc2V0IG9mIGNvbXBvbmVudHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LmdldENoaWxkcmVuKCkgcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgY2hpbGRyZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdDaGlsZDEnKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdDaGlsZDInKTtcbiAgICBleHBlY3QoY2hpbGQubm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMik7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5maW5kQ2hpbGQobmFtZSkgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgYSBjaGlsZCBmcm9tIGEgcGFyZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnQ29udHJ1Y3QnKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLnRyeUZpbmRDaGlsZChjaGlsZC5ub2RlLmlkKSkudG9FcXVhbChjaGlsZCk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS50cnlGaW5kQ2hpbGQoJ05vdEZvdW5kJykpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LmdldENoaWxkKG5hbWUpIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIGEgY2hpbGQgZnJvbSBhIHBhcmVudCcsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0NvbnRydWN0Jyk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS5maW5kQ2hpbGQoY2hpbGQubm9kZS5pZCkpLnRvRXF1YWwoY2hpbGQpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICByb290Lm5vZGUuZmluZENoaWxkKCdOb3RGb3VuZCcpO1xuICAgIH0pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHJlbW92ZSBjaGlsZHJlbiBmcm9tIHRoZSB0cmVlIHVzaW5nIHRyeVJlbW92ZUNoaWxkKCknLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY2hpbGRyZW5CZWZvcmVBZGRpbmcgPSByb290Lm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyAvLyBJbnZhcmlhbnQgdG8gYWRkaW5nICdNZXRhZGF0YScgcmVzb3VyY2Ugb3Igbm90XG5cbiAgICAvLyBBZGQgJiByZW1vdmVcbiAgICBjb25zdCBjaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0NvbnN0cnVjdCcpO1xuICAgIGV4cGVjdCh0cnVlKS50b0VxdWFsKHJvb3Qubm9kZS50cnlSZW1vdmVDaGlsZChjaGlsZC5ub2RlLmlkKSk7XG4gICAgZXhwZWN0KGZhbHNlKS50b0VxdWFsKHJvb3Qubm9kZS50cnlSZW1vdmVDaGlsZChjaGlsZC5ub2RlLmlkKSk7IC8vIFNlY29uZCB0aW1lIGRvZXMgbm90aGluZ1xuXG4gICAgZXhwZWN0KHVuZGVmaW5lZCkudG9FcXVhbChyb290Lm5vZGUudHJ5RmluZENoaWxkKGNoaWxkLm5vZGUuaWQpKTtcbiAgICBleHBlY3QoY2hpbGRyZW5CZWZvcmVBZGRpbmcpLnRvRXF1YWwocm9vdC5ub2RlLmNoaWxkcmVuLmxlbmd0aCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC50b1N0cmluZygpIGFuZCBjb25zdHJ1Y3QudG9UcmVlU3RyaW5nKCkgY2FuIGJlIHVzZWQgZm9yIGRpYWdub3N0aWNzJywgKCkgPT4ge1xuICAgIGNvbnN0IHQgPSBjcmVhdGVUcmVlKCk7XG5cbiAgICBleHBlY3QodC5yb290LnRvU3RyaW5nKCkpLnRvRXF1YWwoJzxyb290PicpO1xuICAgIGV4cGVjdCh0LmNoaWxkMV8xXzEudG9TdHJpbmcoKSkudG9FcXVhbCgnSGlnaENoaWxkL0NoaWxkMS9DaGlsZDExL0NoaWxkMTExJyk7XG4gICAgZXhwZWN0KHQuY2hpbGQyLnRvU3RyaW5nKCkpLnRvRXF1YWwoJ0hpZ2hDaGlsZC9DaGlsZDInKTtcbiAgICBleHBlY3QodG9UcmVlU3RyaW5nKHQucm9vdCkpLnRvRXF1YWwoJ1Jvb3RcXG4gIENvbnN0cnVjdCBbSGlnaENoaWxkXVxcbiAgICBDb25zdHJ1Y3QgW0NoaWxkMV1cXG4gICAgICBDb25zdHJ1Y3QgW0NoaWxkMTFdXFxuICAgICAgICBDb25zdHJ1Y3QgW0NoaWxkMTExXVxcbiAgICAgIENvbnN0cnVjdCBbQ2hpbGQxMl1cXG4gICAgQ29uc3RydWN0IFtDaGlsZDJdXFxuICAgICAgQ29uc3RydWN0IFtDaGlsZDIxXVxcbicpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QuZ2V0Q29udGV4dChrZXkpIGNhbiBiZSB1c2VkIHRvIHJlYWQgYSB2YWx1ZSBmcm9tIGNvbnRleHQgZGVmaW5lZCBhdCB0aGUgcm9vdCBsZXZlbCcsICgpID0+IHtcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgY3R4MTogMTIsXG4gICAgICBjdHgyOiAnaGVsbG8nLFxuICAgIH07XG5cbiAgICBjb25zdCB0ID0gY3JlYXRlVHJlZShjb250ZXh0KTtcbiAgICBleHBlY3QodC5jaGlsZDFfMi5ub2RlLnRyeUdldENvbnRleHQoJ2N0eDEnKSkudG9FcXVhbCgxMik7XG4gICAgZXhwZWN0KHQuY2hpbGQxXzFfMS5ub2RlLnRyeUdldENvbnRleHQoJ2N0eDInKSkudG9FcXVhbCgnaGVsbG8nKTtcbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgdGVzdCgnY29uc3RydWN0LnNldENvbnRleHQoayx2KSBzZXRzIGNvbnRleHQgYXQgc29tZSBsZXZlbCBhbmQgY29uc3RydWN0LmdldENvbnRleHQoa2V5KSB3aWxsIHJldHVybiB0aGUgbG93ZXJtb3N0IHZhbHVlIGRlZmluZWQgaW4gdGhlIHN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGhpZ2hDaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2hpZ2hDaGlsZCcpO1xuICAgIGhpZ2hDaGlsZC5ub2RlLnNldENvbnRleHQoJ2MxJywgJ3Jvb3QnKTtcbiAgICBoaWdoQ2hpbGQubm9kZS5zZXRDb250ZXh0KCdjMicsICdyb290Jyk7XG5cbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgQ29uc3RydWN0KGhpZ2hDaGlsZCwgJ2NoaWxkMScpO1xuICAgIGNoaWxkMS5ub2RlLnNldENvbnRleHQoJ2MyJywgJ2NoaWxkMScpO1xuICAgIGNoaWxkMS5ub2RlLnNldENvbnRleHQoJ2MzJywgJ2NoaWxkMScpO1xuXG4gICAgY29uc3QgY2hpbGQyID0gbmV3IENvbnN0cnVjdChoaWdoQ2hpbGQsICdjaGlsZDInKTtcbiAgICBjb25zdCBjaGlsZDMgPSBuZXcgQ29uc3RydWN0KGNoaWxkMSwgJ2NoaWxkMWNoaWxkMScpO1xuICAgIGNoaWxkMy5ub2RlLnNldENvbnRleHQoJ2MxJywgJ2NoaWxkMycpO1xuICAgIGNoaWxkMy5ub2RlLnNldENvbnRleHQoJ2M0JywgJ2NoaWxkMycpO1xuXG4gICAgZXhwZWN0KGhpZ2hDaGlsZC5ub2RlLnRyeUdldENvbnRleHQoJ2MxJykpLnRvRXF1YWwoJ3Jvb3QnKTtcbiAgICBleHBlY3QoaGlnaENoaWxkLm5vZGUudHJ5R2V0Q29udGV4dCgnYzInKSkudG9FcXVhbCgncm9vdCcpO1xuICAgIGV4cGVjdChoaWdoQ2hpbGQubm9kZS50cnlHZXRDb250ZXh0KCdjMycpKS50b0VxdWFsKHVuZGVmaW5lZCk7XG5cbiAgICBleHBlY3QoY2hpbGQxLm5vZGUudHJ5R2V0Q29udGV4dCgnYzEnKSkudG9FcXVhbCgncm9vdCcpO1xuICAgIGV4cGVjdChjaGlsZDEubm9kZS50cnlHZXRDb250ZXh0KCdjMicpKS50b0VxdWFsKCdjaGlsZDEnKTtcbiAgICBleHBlY3QoY2hpbGQxLm5vZGUudHJ5R2V0Q29udGV4dCgnYzMnKSkudG9FcXVhbCgnY2hpbGQxJyk7XG5cbiAgICBleHBlY3QoY2hpbGQyLm5vZGUudHJ5R2V0Q29udGV4dCgnYzEnKSkudG9FcXVhbCgncm9vdCcpO1xuICAgIGV4cGVjdChjaGlsZDIubm9kZS50cnlHZXRDb250ZXh0KCdjMicpKS50b0VxdWFsKCdyb290Jyk7XG4gICAgZXhwZWN0KGNoaWxkMi5ub2RlLnRyeUdldENvbnRleHQoJ2MzJykpLnRvRXF1YWwodW5kZWZpbmVkKTtcblxuICAgIGV4cGVjdChjaGlsZDMubm9kZS50cnlHZXRDb250ZXh0KCdjMScpKS50b0VxdWFsKCdjaGlsZDMnKTtcbiAgICBleHBlY3QoY2hpbGQzLm5vZGUudHJ5R2V0Q29udGV4dCgnYzInKSkudG9FcXVhbCgnY2hpbGQxJyk7XG4gICAgZXhwZWN0KGNoaWxkMy5ub2RlLnRyeUdldENvbnRleHQoJ2MzJykpLnRvRXF1YWwoJ2NoaWxkMScpO1xuICAgIGV4cGVjdChjaGlsZDMubm9kZS50cnlHZXRDb250ZXh0KCdjNCcpKS50b0VxdWFsKCdjaGlsZDMnKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LnNldENvbnRleHQoa2V5LCB2YWx1ZSkgY2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSBhZGRpbmcgYW55IGNoaWxkcmVuJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMScpO1xuICAgIGV4cGVjdCgoKSA9PiByb290Lm5vZGUuc2V0Q29udGV4dCgnaycsICd2JykpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QucGF0aFBhcnRzIHJldHVybnMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBvZiBhbGwgbmFtZXMgZnJvbSByb290IHRvIG5vZGUnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IGNyZWF0ZVRyZWUoKTtcbiAgICBleHBlY3QodHJlZS5yb290Lm5vZGUucGF0aCkudG9FcXVhbCgnJyk7XG4gICAgZXhwZWN0KHRyZWUuY2hpbGQxXzFfMS5ub2RlLnBhdGgpLnRvRXF1YWwoJ0hpZ2hDaGlsZC9DaGlsZDEvQ2hpbGQxMS9DaGlsZDExMScpO1xuICAgIGV4cGVjdCh0cmVlLmNoaWxkMi5ub2RlLnBhdGgpLnRvRXF1YWwoJ0hpZ2hDaGlsZC9DaGlsZDInKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWYgYSByb290IGNvbnN0cnVjdCBoYXMgYSBuYW1lLCBpdCBzaG91bGQgYmUgaW5jbHVkZWQgaW4gdGhlIHBhdGgnLCAoKSA9PiB7XG4gICAgY29uc3QgdHJlZSA9IGNyZWF0ZVRyZWUoe30pO1xuICAgIGV4cGVjdCh0cmVlLnJvb3Qubm9kZS5wYXRoKS50b0VxdWFsKCcnKTtcbiAgICBleHBlY3QodHJlZS5jaGlsZDFfMV8xLm5vZGUucGF0aCkudG9FcXVhbCgnSGlnaENoaWxkL0NoaWxkMS9DaGlsZDExL0NoaWxkMTExJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdCBjYW4gbm90IGJlIGNyZWF0ZWQgd2l0aCB0aGUgbmFtZSBvZiBhIHNpYmxpbmcnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnU2FtZU5hbWUnKTtcblxuICAgIC8vIFRIRU46IFRoZXkgaGF2ZSBkaWZmZXJlbnQgcGF0aHNcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnU2FtZU5hbWUnKTtcbiAgICB9KS50b1Rocm93KC9UaGVyZSBpcyBhbHJlYWR5IGEgQ29uc3RydWN0IHdpdGggbmFtZSAnU2FtZU5hbWUnIGluIFJvb3QvKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjMCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2MwJyk7XG4gICAgbmV3IENvbnN0cnVjdChjMCwgJ1NhbWVOYW1lJyk7XG5cbiAgICAvLyBUSEVOOiBUaGV5IGhhdmUgZGlmZmVyZW50IHBhdGhzXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDb25zdHJ1Y3QoYzAsICdTYW1lTmFtZScpO1xuICAgIH0pLnRvVGhyb3coL1RoZXJlIGlzIGFscmVhZHkgYSBDb25zdHJ1Y3Qgd2l0aCBuYW1lICdTYW1lTmFtZScgaW4gQ29uc3RydWN0IFxcW2MwXFxdLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZE1ldGFkYXRhKHR5cGUsIGRhdGEpIGNhbiBiZSB1c2VkIHRvIGF0dGFjaCBtZXRhZGF0YSB0byBjb25zdHJ1Y3RzIEZJTkRfTUUnLCAoKSA9PiB7XG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHJlRW5hYmxlU3RhY2tUcmFjZUNvbGxlY3Rpb24oKTtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjb24gPSBuZXcgQ29uc3RydWN0KHJvb3QsICdNeUNvbnN0cnVjdCcpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YSkudG9FcXVhbChbXSk7XG5cbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgna2V5JywgJ3ZhbHVlJywgeyBzdGFja1RyYWNlOiB0cnVlIH0pO1xuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdudW1iZXInLCAxMDMpO1xuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdhcnJheScsIFsxMjMsIDQ1Nl0pO1xuICAgIHJlc3RvcmVTdGFja1RyYWNlQ29sZWN0aW9uKHByZXZpb3VzVmFsdWUpO1xuXG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnR5cGUpLnRvRXF1YWwoJ2tleScpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS5kYXRhKS50b0VxdWFsKCd2YWx1ZScpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVsxXS5kYXRhKS50b0VxdWFsKDEwMyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzJdLmRhdGEpLnRvRXF1YWwoWzEyMywgNDU2XSk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlICYmIGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlWzFdLmluZGV4T2YoJ0ZJTkRfTUUnKSkudG9FcXVhbCgtMSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZE1ldGFkYXRhKHR5cGUsIHVuZGVmaW5lZC9udWxsKSBpcyBpZ25vcmVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNvbiA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0ZvbycpO1xuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdOdWxsJywgbnVsbCk7XG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ1VuZGVmaW5lZCcsIHVuZGVmaW5lZCk7XG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ1RydWUnLCB0cnVlKTtcbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgnRmFsc2UnLCBmYWxzZSk7XG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ0VtcHR5JywgJycpO1xuXG4gICAgY29uc3QgZXhpc3RzID0gKGtleTogc3RyaW5nKSA9PiBjb24ubm9kZS5tZXRhZGF0YS5maW5kKHggPT4geC50eXBlID09PSBrZXkpO1xuXG4gICAgZXhwZWN0KGV4aXN0cygnTnVsbCcpKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgZXhwZWN0KGV4aXN0cygnVW5kZWZpbmVkJykpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QoZXhpc3RzKCdUcnVlJykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KGV4aXN0cygnRmFsc2UnKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoZXhpc3RzKCdFbXB0eScpKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdhZGRXYXJuaW5nKG1lc3NhZ2UpIGNhbiBiZSB1c2VkIHRvIGFkZCBhIFwiV0FSTklOR1wiIG1lc3NhZ2UgZW50cnkgdG8gdGhlIGNvbnN0cnVjdCcsICgpID0+IHtcbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNvbiA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ015Q29uc3RydWN0Jyk7XG4gICAgQW5ub3RhdGlvbnMub2YoY29uKS5hZGRXYXJuaW5nKCdUaGlzIGNvbnN0cnVjdCBpcyBkZXByZWNhdGVkLCB1c2UgdGhlIG90aGVyIG9uZSBpbnN0ZWFkJyk7XG4gICAgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24ocHJldmlvdXNWYWx1ZSk7XG5cbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHlwZSkudG9FcXVhbChjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLldBUk4pO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS5kYXRhKS50b0VxdWFsKCdUaGlzIGNvbnN0cnVjdCBpcyBkZXByZWNhdGVkLCB1c2UgdGhlIG90aGVyIG9uZSBpbnN0ZWFkJyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlICYmIGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlLmxlbmd0aCA+IDApLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZEVycm9yKG1lc3NhZ2UpIGNhbiBiZSB1c2VkIHRvIGFkZCBhIFwiRVJST1JcIiBtZXNzYWdlIGVudHJ5IHRvIHRoZSBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHJlRW5hYmxlU3RhY2tUcmFjZUNvbGxlY3Rpb24oKTtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjb24gPSBuZXcgQ29uc3RydWN0KHJvb3QsICdNeUNvbnN0cnVjdCcpO1xuICAgIEFubm90YXRpb25zLm9mKGNvbikuYWRkRXJyb3IoJ1N0b3AhJyk7XG4gICAgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24ocHJldmlvdXNWYWx1ZSk7XG5cbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHlwZSkudG9FcXVhbChjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkVSUk9SKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0uZGF0YSkudG9FcXVhbCgnU3RvcCEnKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2UgJiYgY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2UubGVuZ3RoID4gMCkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkSW5mbyhtZXNzYWdlKSBjYW4gYmUgdXNlZCB0byBhZGQgYW4gXCJJTkZPXCIgbWVzc2FnZSBlbnRyeSB0byB0aGUgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSByZUVuYWJsZVN0YWNrVHJhY2VDb2xsZWN0aW9uKCk7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY29uID0gbmV3IENvbnN0cnVjdChyb290LCAnTXlDb25zdHJ1Y3QnKTtcbiAgICBBbm5vdGF0aW9ucy5vZihjb24pLmFkZEluZm8oJ0hleSB0aGVyZSwgaG93IGRvIHlvdSBkbz8nKTtcbiAgICByZXN0b3JlU3RhY2tUcmFjZUNvbGVjdGlvbihwcmV2aW91c1ZhbHVlKTtcblxuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50eXBlKS50b0VxdWFsKGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuSU5GTyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLmRhdGEpLnRvRXF1YWwoJ0hleSB0aGVyZSwgaG93IGRvIHlvdSBkbz8nKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2UgJiYgY29uLm5vZGUubWV0YWRhdGFbMF0udHJhY2UubGVuZ3RoID4gMCkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnbXVsdGlwbGUgY2hpbGRyZW4gb2YgdGhlIHNhbWUgdHlwZSwgd2l0aCBleHBsaWNpdCBuYW1lcyBhcmUgd2VsY29tZScsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBuZXcgTXlCZWF1dGlmdWxDb25zdHJ1Y3Qocm9vdCwgJ21iYzEnKTtcbiAgICBuZXcgTXlCZWF1dGlmdWxDb25zdHJ1Y3Qocm9vdCwgJ21iYzInKTtcbiAgICBuZXcgTXlCZWF1dGlmdWxDb25zdHJ1Y3Qocm9vdCwgJ21iYzMnKTtcbiAgICBuZXcgTXlCZWF1dGlmdWxDb25zdHJ1Y3Qocm9vdCwgJ21iYzQnKTtcbiAgICBleHBlY3Qocm9vdC5ub2RlLmNoaWxkcmVuLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCg0KTtcbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgdGVzdCgnY29uc3RydWN0LnZhbGlkYXRlKCkgY2FuIGJlIGltcGxlbWVudGVkIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiwgQ29uc3RydWN0Tm9kZS52YWxpZGF0ZShjb25zdHJ1Y3Qubm9kZSkgd2lsbCByZXR1cm4gYWxsIGVycm9ycyBmcm9tIHRoZSBzdWJ0cmVlIChERlMpJywgKCkgPT4ge1xuICAgIGNsYXNzIE15Q29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gWydteS1lcnJvcjEnLCAnbXktZXJyb3IyJ10gfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgWW91ckNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IFsneW91ci1lcnJvcjEnXSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBUaGVpckNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgbmV3IFlvdXJDb25zdHJ1Y3QodGhpcywgJ1lvdXJDb25zdHJ1Y3QnKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gWyd0aGVpci1lcnJvciddIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFJvb3Qge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgbmV3IE15Q29uc3RydWN0KHRoaXMsICdNeUNvbnN0cnVjdCcpO1xuICAgICAgICBuZXcgVGhlaXJDb25zdHJ1Y3QodGhpcywgJ1RoZWlyQ29uc3RydWN0Jyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gWydzdGFjay1lcnJvciddIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFRlc3RTdGFjaygpO1xuXG4gICAgY29uc3QgZXJyb3JzID0gbmV3IEFycmF5PHsgcGF0aDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcgfT4oKTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHN0YWNrLm5vZGUuZmluZEFsbCgpKSB7XG4gICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgY2hpbGQubm9kZS52YWxpZGF0ZSgpKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHtcbiAgICAgICAgICBwYXRoOiBjaGlsZC5ub2RlLnBhdGgsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdmFsaWRhdGUgREZTXG4gICAgZXhwZWN0KGVycm9ycykudG9FcXVhbChbXG4gICAgICB7IHBhdGg6ICcnLCBtZXNzYWdlOiAnc3RhY2stZXJyb3InIH0sXG4gICAgICB7IHBhdGg6ICdNeUNvbnN0cnVjdCcsIG1lc3NhZ2U6ICdteS1lcnJvcjEnIH0sXG4gICAgICB7IHBhdGg6ICdNeUNvbnN0cnVjdCcsIG1lc3NhZ2U6ICdteS1lcnJvcjInIH0sXG4gICAgICB7IHBhdGg6ICdUaGVpckNvbnN0cnVjdCcsIG1lc3NhZ2U6ICd0aGVpci1lcnJvcicgfSxcbiAgICAgIHsgcGF0aDogJ1RoZWlyQ29uc3RydWN0L1lvdXJDb25zdHJ1Y3QnLCBtZXNzYWdlOiAneW91ci1lcnJvcjEnIH0sXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5sb2NrKCkgcHJvdGVjdHMgYWdhaW5zdCBhZGRpbmcgY2hpbGRyZW4gYW55d2hlcmUgdW5kZXIgdGhpcyBjb25zdHJ1Y3QgKGRpcmVjdCBvciBpbmRpcmVjdCknLCAoKSA9PiB7XG4gICAgY2xhc3MgTG9ja2FibGVDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgcHVibGljIGxvY2tNZSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmxvY2soKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBSb290KCk7XG5cbiAgICBjb25zdCBjMGEgPSBuZXcgTG9ja2FibGVDb25zdHJ1Y3Qoc3RhY2ssICdjMGEnKTtcbiAgICBjb25zdCBjMGIgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnYzBiJyk7XG5cbiAgICBjb25zdCBjMWEgPSBuZXcgQ29uc3RydWN0KGMwYSwgJ2MxYScpO1xuICAgIGNvbnN0IGMxYiA9IG5ldyBDb25zdHJ1Y3QoYzBhLCAnYzFiJyk7XG5cbiAgICBjMGEubG9ja01lKCk7XG5cbiAgICAvLyBub3cgd2Ugc2hvdWxkIHN0aWxsIGJlIGFibGUgdG8gYWRkIGNoaWxkcmVuIHRvIGMwYiwgYnV0IG5vdCB0byBjMGEgb3IgYW55IGl0cyBjaGlsZHJlblxuICAgIG5ldyBDb25zdHJ1Y3QoYzBiLCAnYzFhJyk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBDb25zdHJ1Y3QoYzBhLCAnZmFpbDEnKSkudG9UaHJvdygvQ2Fubm90IGFkZCBjaGlsZHJlbiB0byBcImMwYVwiIGR1cmluZyBzeW50aGVzaXMvKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IENvbnN0cnVjdChjMWEsICdmYWlsMicpKS50b1Rocm93KC9DYW5ub3QgYWRkIGNoaWxkcmVuIHRvIFwiYzBhXFwvYzFhXCIgZHVyaW5nIHN5bnRoZXNpcy8pO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgQ29uc3RydWN0KGMxYiwgJ2ZhaWwzJykpLnRvVGhyb3coL0Nhbm5vdCBhZGQgY2hpbGRyZW4gdG8gXCJjMGFcXC9jMWJcIiBkdXJpbmcgc3ludGhlc2lzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZpbmRBbGwgcmV0dXJucyBhIGxpc3Qgb2YgYWxsIGNoaWxkcmVuIGluIGVpdGhlciBERlMgb3IgQkZTJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYzEgPSBuZXcgQ29uc3RydWN0KHVuZGVmaW5lZCBhcyBhbnksICcxJyk7XG4gICAgY29uc3QgYzIgPSBuZXcgQ29uc3RydWN0KGMxLCAnMicpO1xuICAgIG5ldyBDb25zdHJ1Y3QoYzEsICczJyk7XG4gICAgbmV3IENvbnN0cnVjdChjMiwgJzQnKTtcbiAgICBuZXcgQ29uc3RydWN0KGMyLCAnNScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChjMS5ub2RlLmZpbmRBbGwoKS5tYXAoeCA9PiB4Lm5vZGUuaWQpKS50b0VxdWFsKGMxLm5vZGUuZmluZEFsbChDb25zdHJ1Y3RPcmRlci5QUkVPUkRFUikubWFwKHggPT4geC5ub2RlLmlkKSk7IC8vIGRlZmF1bHQgaXMgUHJlT3JkZXJcbiAgICBleHBlY3QoYzEubm9kZS5maW5kQWxsKENvbnN0cnVjdE9yZGVyLlBSRU9SREVSKS5tYXAoeCA9PiB4Lm5vZGUuaWQpKS50b0VxdWFsKFsnMScsICcyJywgJzQnLCAnNScsICczJ10pO1xuICAgIGV4cGVjdChjMS5ub2RlLmZpbmRBbGwoQ29uc3RydWN0T3JkZXIuUE9TVE9SREVSKS5tYXAoeCA9PiB4Lm5vZGUuaWQpKS50b0VxdWFsKFsnNCcsICc1JywgJzInLCAnMycsICcxJ10pO1xuICB9KTtcblxuICB0ZXN0KCdhbmNlc3RvcnMgcmV0dXJucyBhIGxpc3Qgb2YgcGFyZW50cyB1cCB0byByb290JywgKCkgPT4ge1xuICAgIGNvbnN0IHsgY2hpbGQxXzFfMSB9ID0gY3JlYXRlVHJlZSgpO1xuICAgIGV4cGVjdChjaGlsZDFfMV8xLm5vZGUuc2NvcGVzLm1hcCh4ID0+IHgubm9kZS5pZCkpLnRvRXF1YWwoWycnLCAnSGlnaENoaWxkJywgJ0NoaWxkMScsICdDaGlsZDExJywgJ0NoaWxkMTExJ10pO1xuICB9KTtcblxuICB0ZXN0KCdcInJvb3RcIiByZXR1cm5zIHRoZSByb290IGNvbnN0cnVjdCcsICgpID0+IHtcbiAgICBjb25zdCB7IGNoaWxkMSwgY2hpbGQyLCBjaGlsZDFfMV8xLCByb290IH0gPSBjcmVhdGVUcmVlKCk7XG4gICAgZXhwZWN0KGNoaWxkMS5ub2RlLnJvb3QpLnRvRXF1YWwocm9vdCk7XG4gICAgZXhwZWN0KGNoaWxkMi5ub2RlLnJvb3QpLnRvRXF1YWwocm9vdCk7XG4gICAgZXhwZWN0KGNoaWxkMV8xXzEubm9kZS5yb290KS50b0VxdWFsKHJvb3QpO1xuICB9KTtcblxuICBkZXNjcmliZSgnZGVmYXVsdENoaWxkJywgKCkgPT4ge1xuICAgIHRlc3QoJ3JldHVybnMgdGhlIGNoaWxkIHdpdGggaWQgXCJSZXNvdXJjZVwiJywgKCkgPT4ge1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDEnKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRDaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1Jlc291cmNlJyk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDInKTtcblxuICAgICAgZXhwZWN0KHJvb3Qubm9kZS5kZWZhdWx0Q2hpbGQpLnRvRXF1YWwoZGVmYXVsdENoaWxkKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybnMgdGhlIGNoaWxkIHdpdGggaWQgXCJEZWZhdWx0XCInLCAoKSA9PiB7XG4gICAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMScpO1xuICAgICAgY29uc3QgZGVmYXVsdENoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnRGVmYXVsdCcpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQyJyk7XG5cbiAgICAgIGV4cGVjdChyb290Lm5vZGUuZGVmYXVsdENoaWxkKS50b0VxdWFsKGRlZmF1bHRDaGlsZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gb3ZlcnJpZGUgZGVmYXVsdENoaWxkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdSZXNvdXJjZScpO1xuICAgICAgY29uc3QgZGVmYXVsdENoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnT3RoZXJSZXNvdXJjZScpO1xuICAgICAgcm9vdC5ub2RlLmRlZmF1bHRDaGlsZCA9IGRlZmF1bHRDaGlsZDtcblxuICAgICAgZXhwZWN0KHJvb3Qubm9kZS5kZWZhdWx0Q2hpbGQpLnRvRXF1YWwoZGVmYXVsdENoaWxkKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybnMgXCJ1bmRlZmluZWRcIiBpZiB0aGVyZSBpcyBubyBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDEnKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMicpO1xuXG4gICAgICBleHBlY3Qocm9vdC5ub2RlLmRlZmF1bHRDaGlsZCkudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgaWYgdGhlcmUgYXJlIGJvdGggXCJSZXNvdXJjZVwiIGFuZCBcIkRlZmF1bHRcIicsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQxJyk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdEZWZhdWx0Jyk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDInKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1Jlc291cmNlJyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiByb290Lm5vZGUuZGVmYXVsdENoaWxkKS50b1Rocm93KFxuICAgICAgICAvQ2Fubm90IGRldGVybWluZSBkZWZhdWx0IGNoaWxkIGZvciAuIFRoZXJlIGlzIGJvdGggYSBjaGlsZCB3aXRoIGlkIFwiUmVzb3VyY2VcIiBhbmQgaWQgXCJEZWZhdWx0XCIvKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gY3JlYXRlVHJlZShjb250ZXh0PzogYW55KSB7XG4gIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICBjb25zdCBoaWdoQ2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdIaWdoQ2hpbGQnKTtcbiAgaWYgKGNvbnRleHQpIHtcbiAgICBPYmplY3Qua2V5cyhjb250ZXh0KS5mb3JFYWNoKGtleSA9PiBoaWdoQ2hpbGQubm9kZS5zZXRDb250ZXh0KGtleSwgY29udGV4dFtrZXldKSk7XG4gIH1cblxuICBjb25zdCBjaGlsZDEgPSBuZXcgQ29uc3RydWN0KGhpZ2hDaGlsZCwgJ0NoaWxkMScpO1xuICBjb25zdCBjaGlsZDIgPSBuZXcgQ29uc3RydWN0KGhpZ2hDaGlsZCwgJ0NoaWxkMicpO1xuICBjb25zdCBjaGlsZDFfMSA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQxLCAnQ2hpbGQxMScpO1xuICBjb25zdCBjaGlsZDFfMiA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQxLCAnQ2hpbGQxMicpO1xuICBjb25zdCBjaGlsZDFfMV8xID0gbmV3IENvbnN0cnVjdChjaGlsZDFfMSwgJ0NoaWxkMTExJyk7XG4gIGNvbnN0IGNoaWxkMl8xID0gbmV3IENvbnN0cnVjdChjaGlsZDIsICdDaGlsZDIxJyk7XG5cbiAgcmV0dXJuIHtcbiAgICByb290LCBjaGlsZDEsIGNoaWxkMiwgY2hpbGQxXzEsIGNoaWxkMV8yLCBjaGlsZDFfMV8xLCBjaGlsZDJfMSxcbiAgfTtcbn1cblxuY2xhc3MgTXlCZWF1dGlmdWxDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgd2l0aCBhIHRyZWUgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBjb25zdHJ1Y3QgYW5kIGl0J3MgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIHRvVHJlZVN0cmluZyhub2RlOiBJQ29uc3RydWN0LCBkZXB0aCA9IDApIHtcbiAgbGV0IG91dCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHRoOyArK2kpIHtcbiAgICBvdXQgKz0gJyAgJztcbiAgfVxuICBjb25zdCBuYW1lID0gbm9kZS5ub2RlLmlkIHx8ICcnO1xuICBvdXQgKz0gYCR7bm9kZS5jb25zdHJ1Y3Rvci5uYW1lfSR7bmFtZS5sZW5ndGggPiAwID8gJyBbJyArIG5hbWUgKyAnXScgOiAnJ31cXG5gO1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUubm9kZS5jaGlsZHJlbikge1xuICAgIG91dCArPSB0b1RyZWVTdHJpbmcoY2hpbGQsIGRlcHRoICsgMSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuY2xhc3MgUm9vdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHVuZGVmaW5lZCBhcyBhbnksIHVuZGVmaW5lZCBhcyBhbnkpO1xuICB9XG59XG4iXX0=