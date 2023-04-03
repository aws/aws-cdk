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
    cdk_build_tools_1.testDeprecated('construct.uniqueId returns a tree-unique alphanumeric id of this construct', () => {
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
    cdk_build_tools_1.testDeprecated('cannot calculate uniqueId if the construct path is ["Default"]', () => {
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
        const previousValue = util_1.reEnableStackTraceCollection();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        expect(con.node.metadata).toEqual([]);
        con.node.addMetadata('key', 'value', { stackTrace: true });
        con.node.addMetadata('number', 103);
        con.node.addMetadata('array', [123, 456]);
        util_1.restoreStackTraceColection(previousValue);
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
        const previousValue = util_1.reEnableStackTraceCollection();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        annotations_1.Annotations.of(con).addWarning('This construct is deprecated, use the other one instead');
        util_1.restoreStackTraceColection(previousValue);
        expect(con.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
        expect(con.node.metadata[0].data).toEqual('This construct is deprecated, use the other one instead');
        expect(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0).toEqual(true);
    });
    test('addError(message) can be used to add a "ERROR" message entry to the construct', () => {
        const previousValue = util_1.reEnableStackTraceCollection();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        annotations_1.Annotations.of(con).addError('Stop!');
        util_1.restoreStackTraceColection(previousValue);
        expect(con.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.ERROR);
        expect(con.node.metadata[0].data).toEqual('Stop!');
        expect(con.node.metadata[0].trace && con.node.metadata[0].trace.length > 0).toEqual(true);
    });
    test('addInfo(message) can be used to add an "INFO" message entry to the construct', () => {
        const previousValue = util_1.reEnableStackTraceCollection();
        const root = new Root();
        const con = new constructs_1.Construct(root, 'MyConstruct');
        annotations_1.Annotations.of(con).addInfo('Hey there, how do you do?');
        util_1.restoreStackTraceColection(previousValue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zdHJ1Y3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUEwRDtBQUMxRCwyREFBMkQ7QUFDM0QsMkNBQW1FO0FBQ25FLGlDQUFrRjtBQUNsRixnQ0FBK0I7QUFDL0Isb0RBQWlEO0FBRWpELHlEQUF5RDtBQUV6RCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixJQUFJLENBQUMsdUZBQXVGLEVBQUUsR0FBRyxFQUFFO1FBQ2pHLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQ2hGLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksc0JBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsTUFBTSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUM7UUFFdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FB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Q0FBQztJQUMvQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzlCLEdBQUcsSUFBSSxJQUFJLENBQUM7S0FDYjtJQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNoQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQy9FLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDdEMsR0FBRyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxJQUFLLFNBQVEsc0JBQVM7SUFDMUI7UUFDRSxLQUFLLENBQUMsU0FBZ0IsRUFBRSxTQUFnQixDQUFDLENBQUM7S0FDM0M7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIENvbnN0cnVjdE9yZGVyLCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyByZUVuYWJsZVN0YWNrVHJhY2VDb2xsZWN0aW9uLCByZXN0b3JlU3RhY2tUcmFjZUNvbGVjdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBOYW1lcyB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4uL2xpYi9hbm5vdGF0aW9ucyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiAqL1xuXG5kZXNjcmliZSgnY29uc3RydWN0JywgKCkgPT4ge1xuICB0ZXN0KCd0aGUgXCJSb290XCIgY29uc3RydWN0IGlzIGEgc3BlY2lhbCBjb25zdHJ1Y3Qgd2hpY2ggY2FuIGJlIHVzZWQgYXMgdGhlIHJvb3Qgb2YgdGhlIHRyZWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS5pZCkudG9FcXVhbCgnJyk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS5zY29wZSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdChyb290Lm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0VxdWFsKDApO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3RzIGNhbm5vdCBiZSBjcmVhdGVkIHdpdGggYW4gZW1wdHkgbmFtZSB1bmxlc3MgdGhleSBhcmUgcm9vdCcsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IENvbnN0cnVjdChyb290LCAnJykpLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0Lm5hbWUgcmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHQgPSBjcmVhdGVUcmVlKCk7XG5cbiAgICBleHBlY3QodC5jaGlsZDEubm9kZS5pZCkudG9FcXVhbCgnQ2hpbGQxJyk7XG4gICAgZXhwZWN0KHQuY2hpbGQyLm5vZGUuaWQpLnRvRXF1YWwoJ0NoaWxkMicpO1xuICAgIGV4cGVjdCh0LmNoaWxkMV8xLm5vZGUuaWQpLnRvRXF1YWwoJ0NoaWxkMTEnKTtcbiAgICBleHBlY3QodC5jaGlsZDFfMi5ub2RlLmlkKS50b0VxdWFsKCdDaGlsZDEyJyk7XG4gICAgZXhwZWN0KHQuY2hpbGQxXzFfMS5ub2RlLmlkKS50b0VxdWFsKCdDaGlsZDExMScpO1xuICAgIGV4cGVjdCh0LmNoaWxkMl8xLm5vZGUuaWQpLnRvRXF1YWwoJ0NoaWxkMjEnKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0IGlkIGNhbiB1c2UgYW55IGNoYXJhY3RlciBleGNlcHQgdGhlIHBhdGggc2VwYXJhdG9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ3ZhbGlkJyk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnVmFsaUQnKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdWYTEyM2xpZCcpO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ3YnKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICcgIGludmFsaWQnICk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnaW52YWxpZCAgICcgKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICcxMjNpbnZhbGlkJyApO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2luIHZhbGlkJyApO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2luX1ZhbGlkJyApO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2luLVZhbGlkJyApO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2luXFxcXFZhbGlkJyApO1xuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2luLlZhbGlkJyApO1xuICB9KTtcblxuICB0ZXN0KCdpZiBjb25zdHJ1Y3QgaWQgY29udGFpbnMgcGF0aCBzZXBlcmF0b3JzLCB0aGV5IHdpbGwgYmUgcmVwbGFjZWQgYnkgZG91YmxlLWRhc2gnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgYyA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0Jvb20vQm9vbS9CYW0nKTtcbiAgICBleHBlY3QoYy5ub2RlLmlkKS50b0VxdWFsKCdCb29tLS1Cb29tLS1CYW0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWYgXCJ1bmRlZmluZWRcIiBpcyBmb3JjZWZ1bGx5IHVzZWQgYXMgYW4gXCJpZFwiLCBpdCB3aWxsIGJlIHRyZWF0ZWQgYXMgYW4gZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IGMgPSBuZXcgQ29uc3RydWN0KHVuZGVmaW5lZCBhcyBhbnksIHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIGV4cGVjdChjLm5vZGUuaWQpLnRvRXF1YWwoJycpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY29uc3RydWN0LnVuaXF1ZUlkIHJldHVybnMgYSB0cmVlLXVuaXF1ZSBhbHBoYW51bWVyaWMgaWQgb2YgdGhpcyBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG5cbiAgICBjb25zdCBjaGlsZDEgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdUaGlzIGlzIHRoZSBmaXJzdCBjaGlsZCcpO1xuICAgIGNvbnN0IGNoaWxkMiA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQxLCAnU2Vjb25kIGxldmVsJyk7XG4gICAgY29uc3QgYzEgPSBuZXcgQ29uc3RydWN0KGNoaWxkMiwgJ015IGNvbnN0cnVjdCcpO1xuICAgIGNvbnN0IGMyID0gbmV3IENvbnN0cnVjdChjaGlsZDEsICdNeSBjb25zdHJ1Y3QnKTtcblxuICAgIGV4cGVjdChjMS5ub2RlLnBhdGgpLnRvRXF1YWwoJ1RoaXMgaXMgdGhlIGZpcnN0IGNoaWxkL1NlY29uZCBsZXZlbC9NeSBjb25zdHJ1Y3QnKTtcbiAgICBleHBlY3QoYzIubm9kZS5wYXRoKS50b0VxdWFsKCdUaGlzIGlzIHRoZSBmaXJzdCBjaGlsZC9NeSBjb25zdHJ1Y3QnKTtcbiAgICBleHBlY3QoTmFtZXMudW5pcXVlSWQoYzEpKS50b0VxdWFsKCdUaGlzaXN0aGVmaXJzdGNoaWxkU2Vjb25kbGV2ZWxNeWNvbnN0cnVjdDIwMjEzMUUwJyk7XG4gICAgZXhwZWN0KE5hbWVzLnVuaXF1ZUlkKGMyKSkudG9FcXVhbCgnVGhpc2lzdGhlZmlyc3RjaGlsZE15Y29uc3RydWN0OEMyODhERjknKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2Nhbm5vdCBjYWxjdWxhdGUgdW5pcXVlSWQgaWYgdGhlIGNvbnN0cnVjdCBwYXRoIGlzIFtcIkRlZmF1bHRcIl0nLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgYyA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0RlZmF1bHQnKTtcbiAgICBleHBlY3QoKCkgPT4gTmFtZXMudW5pcXVlSWQoYykpLnRvVGhyb3coL1VuYWJsZSB0byBjYWxjdWxhdGUgYSB1bmlxdWUgaWQgZm9yIGFuIGVtcHR5IHNldCBvZiBjb21wb25lbnRzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5nZXRDaGlsZHJlbigpIHJldHVybnMgYW4gYXJyYXkgb2YgYWxsIGNoaWxkcmVuJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnQ2hpbGQxJyk7XG4gICAgbmV3IENvbnN0cnVjdChyb290LCAnQ2hpbGQyJyk7XG4gICAgZXhwZWN0KGNoaWxkLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgIGV4cGVjdChyb290Lm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0VxdWFsKDIpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QuZmluZENoaWxkKG5hbWUpIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIGEgY2hpbGQgZnJvbSBhIHBhcmVudCcsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0NvbnRydWN0Jyk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS50cnlGaW5kQ2hpbGQoY2hpbGQubm9kZS5pZCkpLnRvRXF1YWwoY2hpbGQpO1xuICAgIGV4cGVjdChyb290Lm5vZGUudHJ5RmluZENoaWxkKCdOb3RGb3VuZCcpKS50b0JlVW5kZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5nZXRDaGlsZChuYW1lKSBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSBhIGNoaWxkIGZyb20gYSBwYXJlbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdDb250cnVjdCcpO1xuICAgIGV4cGVjdChyb290Lm5vZGUuZmluZENoaWxkKGNoaWxkLm5vZGUuaWQpKS50b0VxdWFsKGNoaWxkKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgcm9vdC5ub2RlLmZpbmRDaGlsZCgnTm90Rm91bmQnKTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiByZW1vdmUgY2hpbGRyZW4gZnJvbSB0aGUgdHJlZSB1c2luZyB0cnlSZW1vdmVDaGlsZCgpJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNoaWxkcmVuQmVmb3JlQWRkaW5nID0gcm9vdC5ub2RlLmNoaWxkcmVuLmxlbmd0aDsgLy8gSW52YXJpYW50IHRvIGFkZGluZyAnTWV0YWRhdGEnIHJlc291cmNlIG9yIG5vdFxuXG4gICAgLy8gQWRkICYgcmVtb3ZlXG4gICAgY29uc3QgY2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdDb25zdHJ1Y3QnKTtcbiAgICBleHBlY3QodHJ1ZSkudG9FcXVhbChyb290Lm5vZGUudHJ5UmVtb3ZlQ2hpbGQoY2hpbGQubm9kZS5pZCkpO1xuICAgIGV4cGVjdChmYWxzZSkudG9FcXVhbChyb290Lm5vZGUudHJ5UmVtb3ZlQ2hpbGQoY2hpbGQubm9kZS5pZCkpOyAvLyBTZWNvbmQgdGltZSBkb2VzIG5vdGhpbmdcblxuICAgIGV4cGVjdCh1bmRlZmluZWQpLnRvRXF1YWwocm9vdC5ub2RlLnRyeUZpbmRDaGlsZChjaGlsZC5ub2RlLmlkKSk7XG4gICAgZXhwZWN0KGNoaWxkcmVuQmVmb3JlQWRkaW5nKS50b0VxdWFsKHJvb3Qubm9kZS5jaGlsZHJlbi5sZW5ndGgpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QudG9TdHJpbmcoKSBhbmQgY29uc3RydWN0LnRvVHJlZVN0cmluZygpIGNhbiBiZSB1c2VkIGZvciBkaWFnbm9zdGljcycsICgpID0+IHtcbiAgICBjb25zdCB0ID0gY3JlYXRlVHJlZSgpO1xuXG4gICAgZXhwZWN0KHQucm9vdC50b1N0cmluZygpKS50b0VxdWFsKCc8cm9vdD4nKTtcbiAgICBleHBlY3QodC5jaGlsZDFfMV8xLnRvU3RyaW5nKCkpLnRvRXF1YWwoJ0hpZ2hDaGlsZC9DaGlsZDEvQ2hpbGQxMS9DaGlsZDExMScpO1xuICAgIGV4cGVjdCh0LmNoaWxkMi50b1N0cmluZygpKS50b0VxdWFsKCdIaWdoQ2hpbGQvQ2hpbGQyJyk7XG4gICAgZXhwZWN0KHRvVHJlZVN0cmluZyh0LnJvb3QpKS50b0VxdWFsKCdSb290XFxuICBDb25zdHJ1Y3QgW0hpZ2hDaGlsZF1cXG4gICAgQ29uc3RydWN0IFtDaGlsZDFdXFxuICAgICAgQ29uc3RydWN0IFtDaGlsZDExXVxcbiAgICAgICAgQ29uc3RydWN0IFtDaGlsZDExMV1cXG4gICAgICBDb25zdHJ1Y3QgW0NoaWxkMTJdXFxuICAgIENvbnN0cnVjdCBbQ2hpbGQyXVxcbiAgICAgIENvbnN0cnVjdCBbQ2hpbGQyMV1cXG4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LmdldENvbnRleHQoa2V5KSBjYW4gYmUgdXNlZCB0byByZWFkIGEgdmFsdWUgZnJvbSBjb250ZXh0IGRlZmluZWQgYXQgdGhlIHJvb3QgbGV2ZWwnLCAoKSA9PiB7XG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgIGN0eDE6IDEyLFxuICAgICAgY3R4MjogJ2hlbGxvJyxcbiAgICB9O1xuXG4gICAgY29uc3QgdCA9IGNyZWF0ZVRyZWUoY29udGV4dCk7XG4gICAgZXhwZWN0KHQuY2hpbGQxXzIubm9kZS50cnlHZXRDb250ZXh0KCdjdHgxJykpLnRvRXF1YWwoMTIpO1xuICAgIGV4cGVjdCh0LmNoaWxkMV8xXzEubm9kZS50cnlHZXRDb250ZXh0KCdjdHgyJykpLnRvRXF1YWwoJ2hlbGxvJyk7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gIHRlc3QoJ2NvbnN0cnVjdC5zZXRDb250ZXh0KGssdikgc2V0cyBjb250ZXh0IGF0IHNvbWUgbGV2ZWwgYW5kIGNvbnN0cnVjdC5nZXRDb250ZXh0KGtleSkgd2lsbCByZXR1cm4gdGhlIGxvd2VybW9zdCB2YWx1ZSBkZWZpbmVkIGluIHRoZSBzdGFjaycsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBoaWdoQ2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdoaWdoQ2hpbGQnKTtcbiAgICBoaWdoQ2hpbGQubm9kZS5zZXRDb250ZXh0KCdjMScsICdyb290Jyk7XG4gICAgaGlnaENoaWxkLm5vZGUuc2V0Q29udGV4dCgnYzInLCAncm9vdCcpO1xuXG4gICAgY29uc3QgY2hpbGQxID0gbmV3IENvbnN0cnVjdChoaWdoQ2hpbGQsICdjaGlsZDEnKTtcbiAgICBjaGlsZDEubm9kZS5zZXRDb250ZXh0KCdjMicsICdjaGlsZDEnKTtcbiAgICBjaGlsZDEubm9kZS5zZXRDb250ZXh0KCdjMycsICdjaGlsZDEnKTtcblxuICAgIGNvbnN0IGNoaWxkMiA9IG5ldyBDb25zdHJ1Y3QoaGlnaENoaWxkLCAnY2hpbGQyJyk7XG4gICAgY29uc3QgY2hpbGQzID0gbmV3IENvbnN0cnVjdChjaGlsZDEsICdjaGlsZDFjaGlsZDEnKTtcbiAgICBjaGlsZDMubm9kZS5zZXRDb250ZXh0KCdjMScsICdjaGlsZDMnKTtcbiAgICBjaGlsZDMubm9kZS5zZXRDb250ZXh0KCdjNCcsICdjaGlsZDMnKTtcblxuICAgIGV4cGVjdChoaWdoQ2hpbGQubm9kZS50cnlHZXRDb250ZXh0KCdjMScpKS50b0VxdWFsKCdyb290Jyk7XG4gICAgZXhwZWN0KGhpZ2hDaGlsZC5ub2RlLnRyeUdldENvbnRleHQoJ2MyJykpLnRvRXF1YWwoJ3Jvb3QnKTtcbiAgICBleHBlY3QoaGlnaENoaWxkLm5vZGUudHJ5R2V0Q29udGV4dCgnYzMnKSkudG9FcXVhbCh1bmRlZmluZWQpO1xuXG4gICAgZXhwZWN0KGNoaWxkMS5ub2RlLnRyeUdldENvbnRleHQoJ2MxJykpLnRvRXF1YWwoJ3Jvb3QnKTtcbiAgICBleHBlY3QoY2hpbGQxLm5vZGUudHJ5R2V0Q29udGV4dCgnYzInKSkudG9FcXVhbCgnY2hpbGQxJyk7XG4gICAgZXhwZWN0KGNoaWxkMS5ub2RlLnRyeUdldENvbnRleHQoJ2MzJykpLnRvRXF1YWwoJ2NoaWxkMScpO1xuXG4gICAgZXhwZWN0KGNoaWxkMi5ub2RlLnRyeUdldENvbnRleHQoJ2MxJykpLnRvRXF1YWwoJ3Jvb3QnKTtcbiAgICBleHBlY3QoY2hpbGQyLm5vZGUudHJ5R2V0Q29udGV4dCgnYzInKSkudG9FcXVhbCgncm9vdCcpO1xuICAgIGV4cGVjdChjaGlsZDIubm9kZS50cnlHZXRDb250ZXh0KCdjMycpKS50b0VxdWFsKHVuZGVmaW5lZCk7XG5cbiAgICBleHBlY3QoY2hpbGQzLm5vZGUudHJ5R2V0Q29udGV4dCgnYzEnKSkudG9FcXVhbCgnY2hpbGQzJyk7XG4gICAgZXhwZWN0KGNoaWxkMy5ub2RlLnRyeUdldENvbnRleHQoJ2MyJykpLnRvRXF1YWwoJ2NoaWxkMScpO1xuICAgIGV4cGVjdChjaGlsZDMubm9kZS50cnlHZXRDb250ZXh0KCdjMycpKS50b0VxdWFsKCdjaGlsZDEnKTtcbiAgICBleHBlY3QoY2hpbGQzLm5vZGUudHJ5R2V0Q29udGV4dCgnYzQnKSkudG9FcXVhbCgnY2hpbGQzJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdC5zZXRDb250ZXh0KGtleSwgdmFsdWUpIGNhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgYWRkaW5nIGFueSBjaGlsZHJlbicsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDEnKTtcbiAgICBleHBlY3QoKCkgPT4gcm9vdC5ub2RlLnNldENvbnRleHQoJ2snLCAndicpKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0LnBhdGhQYXJ0cyByZXR1cm5zIGFuIGFycmF5IG9mIHN0cmluZ3Mgb2YgYWxsIG5hbWVzIGZyb20gcm9vdCB0byBub2RlJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBjcmVhdGVUcmVlKCk7XG4gICAgZXhwZWN0KHRyZWUucm9vdC5ub2RlLnBhdGgpLnRvRXF1YWwoJycpO1xuICAgIGV4cGVjdCh0cmVlLmNoaWxkMV8xXzEubm9kZS5wYXRoKS50b0VxdWFsKCdIaWdoQ2hpbGQvQ2hpbGQxL0NoaWxkMTEvQ2hpbGQxMTEnKTtcbiAgICBleHBlY3QodHJlZS5jaGlsZDIubm9kZS5wYXRoKS50b0VxdWFsKCdIaWdoQ2hpbGQvQ2hpbGQyJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIGEgcm9vdCBjb25zdHJ1Y3QgaGFzIGEgbmFtZSwgaXQgc2hvdWxkIGJlIGluY2x1ZGVkIGluIHRoZSBwYXRoJywgKCkgPT4ge1xuICAgIGNvbnN0IHRyZWUgPSBjcmVhdGVUcmVlKHt9KTtcbiAgICBleHBlY3QodHJlZS5yb290Lm5vZGUucGF0aCkudG9FcXVhbCgnJyk7XG4gICAgZXhwZWN0KHRyZWUuY2hpbGQxXzFfMS5ub2RlLnBhdGgpLnRvRXF1YWwoJ0hpZ2hDaGlsZC9DaGlsZDEvQ2hpbGQxMS9DaGlsZDExMScpO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QgY2FuIG5vdCBiZSBjcmVhdGVkIHdpdGggdGhlIG5hbWUgb2YgYSBzaWJsaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1NhbWVOYW1lJyk7XG5cbiAgICAvLyBUSEVOOiBUaGV5IGhhdmUgZGlmZmVyZW50IHBhdGhzXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ1NhbWVOYW1lJyk7XG4gICAgfSkudG9UaHJvdygvVGhlcmUgaXMgYWxyZWFkeSBhIENvbnN0cnVjdCB3aXRoIG5hbWUgJ1NhbWVOYW1lJyBpbiBSb290Lyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYzAgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdjMCcpO1xuICAgIG5ldyBDb25zdHJ1Y3QoYzAsICdTYW1lTmFtZScpO1xuXG4gICAgLy8gVEhFTjogVGhleSBoYXZlIGRpZmZlcmVudCBwYXRoc1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ29uc3RydWN0KGMwLCAnU2FtZU5hbWUnKTtcbiAgICB9KS50b1Rocm93KC9UaGVyZSBpcyBhbHJlYWR5IGEgQ29uc3RydWN0IHdpdGggbmFtZSAnU2FtZU5hbWUnIGluIENvbnN0cnVjdCBcXFtjMFxcXS8pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRNZXRhZGF0YSh0eXBlLCBkYXRhKSBjYW4gYmUgdXNlZCB0byBhdHRhY2ggbWV0YWRhdGEgdG8gY29uc3RydWN0cyBGSU5EX01FJywgKCkgPT4ge1xuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSByZUVuYWJsZVN0YWNrVHJhY2VDb2xsZWN0aW9uKCk7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY29uID0gbmV3IENvbnN0cnVjdChyb290LCAnTXlDb25zdHJ1Y3QnKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGEpLnRvRXF1YWwoW10pO1xuXG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ2tleScsICd2YWx1ZScsIHsgc3RhY2tUcmFjZTogdHJ1ZSB9KTtcbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgnbnVtYmVyJywgMTAzKTtcbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgnYXJyYXknLCBbMTIzLCA0NTZdKTtcbiAgICByZXN0b3JlU3RhY2tUcmFjZUNvbGVjdGlvbihwcmV2aW91c1ZhbHVlKTtcblxuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50eXBlKS50b0VxdWFsKCdrZXknKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0uZGF0YSkudG9FcXVhbCgndmFsdWUnKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMV0uZGF0YSkudG9FcXVhbCgxMDMpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVsyXS5kYXRhKS50b0VxdWFsKFsxMjMsIDQ1Nl0pO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZSAmJiBjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZVsxXS5pbmRleE9mKCdGSU5EX01FJykpLnRvRXF1YWwoLTEpO1xuICB9KTtcblxuICB0ZXN0KCdhZGRNZXRhZGF0YSh0eXBlLCB1bmRlZmluZWQvbnVsbCkgaXMgaWdub3JlZCcsICgpID0+IHtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjb24gPSBuZXcgQ29uc3RydWN0KHJvb3QsICdGb28nKTtcbiAgICBjb24ubm9kZS5hZGRNZXRhZGF0YSgnTnVsbCcsIG51bGwpO1xuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdVbmRlZmluZWQnLCB1bmRlZmluZWQpO1xuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdUcnVlJywgdHJ1ZSk7XG4gICAgY29uLm5vZGUuYWRkTWV0YWRhdGEoJ0ZhbHNlJywgZmFsc2UpO1xuICAgIGNvbi5ub2RlLmFkZE1ldGFkYXRhKCdFbXB0eScsICcnKTtcblxuICAgIGNvbnN0IGV4aXN0cyA9IChrZXk6IHN0cmluZykgPT4gY29uLm5vZGUubWV0YWRhdGEuZmluZCh4ID0+IHgudHlwZSA9PT0ga2V5KTtcblxuICAgIGV4cGVjdChleGlzdHMoJ051bGwnKSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdChleGlzdHMoJ1VuZGVmaW5lZCcpKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgZXhwZWN0KGV4aXN0cygnVHJ1ZScpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChleGlzdHMoJ0ZhbHNlJykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KGV4aXN0cygnRW1wdHknKSkudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkV2FybmluZyhtZXNzYWdlKSBjYW4gYmUgdXNlZCB0byBhZGQgYSBcIldBUk5JTkdcIiBtZXNzYWdlIGVudHJ5IHRvIHRoZSBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHJlRW5hYmxlU3RhY2tUcmFjZUNvbGxlY3Rpb24oKTtcbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICBjb25zdCBjb24gPSBuZXcgQ29uc3RydWN0KHJvb3QsICdNeUNvbnN0cnVjdCcpO1xuICAgIEFubm90YXRpb25zLm9mKGNvbikuYWRkV2FybmluZygnVGhpcyBjb25zdHJ1Y3QgaXMgZGVwcmVjYXRlZCwgdXNlIHRoZSBvdGhlciBvbmUgaW5zdGVhZCcpO1xuICAgIHJlc3RvcmVTdGFja1RyYWNlQ29sZWN0aW9uKHByZXZpb3VzVmFsdWUpO1xuXG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnR5cGUpLnRvRXF1YWwoY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5XQVJOKTtcbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0uZGF0YSkudG9FcXVhbCgnVGhpcyBjb25zdHJ1Y3QgaXMgZGVwcmVjYXRlZCwgdXNlIHRoZSBvdGhlciBvbmUgaW5zdGVhZCcpO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZSAmJiBjb24ubm9kZS5tZXRhZGF0YVswXS50cmFjZS5sZW5ndGggPiAwKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdhZGRFcnJvcihtZXNzYWdlKSBjYW4gYmUgdXNlZCB0byBhZGQgYSBcIkVSUk9SXCIgbWVzc2FnZSBlbnRyeSB0byB0aGUgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSByZUVuYWJsZVN0YWNrVHJhY2VDb2xsZWN0aW9uKCk7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgY29uc3QgY29uID0gbmV3IENvbnN0cnVjdChyb290LCAnTXlDb25zdHJ1Y3QnKTtcbiAgICBBbm5vdGF0aW9ucy5vZihjb24pLmFkZEVycm9yKCdTdG9wIScpO1xuICAgIHJlc3RvcmVTdGFja1RyYWNlQ29sZWN0aW9uKHByZXZpb3VzVmFsdWUpO1xuXG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnR5cGUpLnRvRXF1YWwoY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5FUlJPUik7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLmRhdGEpLnRvRXF1YWwoJ1N0b3AhJyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlICYmIGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlLmxlbmd0aCA+IDApLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZEluZm8obWVzc2FnZSkgY2FuIGJlIHVzZWQgdG8gYWRkIGFuIFwiSU5GT1wiIG1lc3NhZ2UgZW50cnkgdG8gdGhlIGNvbnN0cnVjdCcsICgpID0+IHtcbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgIGNvbnN0IGNvbiA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ015Q29uc3RydWN0Jyk7XG4gICAgQW5ub3RhdGlvbnMub2YoY29uKS5hZGRJbmZvKCdIZXkgdGhlcmUsIGhvdyBkbyB5b3UgZG8/Jyk7XG4gICAgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24ocHJldmlvdXNWYWx1ZSk7XG5cbiAgICBleHBlY3QoY29uLm5vZGUubWV0YWRhdGFbMF0udHlwZSkudG9FcXVhbChjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLklORk8pO1xuICAgIGV4cGVjdChjb24ubm9kZS5tZXRhZGF0YVswXS5kYXRhKS50b0VxdWFsKCdIZXkgdGhlcmUsIGhvdyBkbyB5b3UgZG8/Jyk7XG4gICAgZXhwZWN0KGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlICYmIGNvbi5ub2RlLm1ldGFkYXRhWzBdLnRyYWNlLmxlbmd0aCA+IDApLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIGNoaWxkcmVuIG9mIHRoZSBzYW1lIHR5cGUsIHdpdGggZXhwbGljaXQgbmFtZXMgYXJlIHdlbGNvbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgbmV3IE15QmVhdXRpZnVsQ29uc3RydWN0KHJvb3QsICdtYmMxJyk7XG4gICAgbmV3IE15QmVhdXRpZnVsQ29uc3RydWN0KHJvb3QsICdtYmMyJyk7XG4gICAgbmV3IE15QmVhdXRpZnVsQ29uc3RydWN0KHJvb3QsICdtYmMzJyk7XG4gICAgbmV3IE15QmVhdXRpZnVsQ29uc3RydWN0KHJvb3QsICdtYmM0Jyk7XG4gICAgZXhwZWN0KHJvb3Qubm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoNCk7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gIHRlc3QoJ2NvbnN0cnVjdC52YWxpZGF0ZSgpIGNhbiBiZSBpbXBsZW1lbnRlZCB0byBwZXJmb3JtIHZhbGlkYXRpb24sIENvbnN0cnVjdE5vZGUudmFsaWRhdGUoY29uc3RydWN0Lm5vZGUpIHdpbGwgcmV0dXJuIGFsbCBlcnJvcnMgZnJvbSB0aGUgc3VidHJlZSAoREZTKScsICgpID0+IHtcbiAgICBjbGFzcyBNeUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IFsnbXktZXJyb3IxJywgJ215LWVycm9yMiddIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIFlvdXJDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiBbJ3lvdXItZXJyb3IxJ10gfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgVGhlaXJDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIG5ldyBZb3VyQ29uc3RydWN0KHRoaXMsICdZb3VyQ29uc3RydWN0Jyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IFsndGhlaXItZXJyb3InXSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBSb290IHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIG5ldyBNeUNvbnN0cnVjdCh0aGlzLCAnTXlDb25zdHJ1Y3QnKTtcbiAgICAgICAgbmV3IFRoZWlyQ29uc3RydWN0KHRoaXMsICdUaGVpckNvbnN0cnVjdCcpO1xuXG4gICAgICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IFsnc3RhY2stZXJyb3InXSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBUZXN0U3RhY2soKTtcblxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTx7IHBhdGg6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH0+KCk7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBzdGFjay5ub2RlLmZpbmRBbGwoKSkge1xuICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIGNoaWxkLm5vZGUudmFsaWRhdGUoKSkge1xuICAgICAgICBlcnJvcnMucHVzaCh7XG4gICAgICAgICAgcGF0aDogY2hpbGQubm9kZS5wYXRoLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHZhbGlkYXRlIERGU1xuICAgIGV4cGVjdChlcnJvcnMpLnRvRXF1YWwoW1xuICAgICAgeyBwYXRoOiAnJywgbWVzc2FnZTogJ3N0YWNrLWVycm9yJyB9LFxuICAgICAgeyBwYXRoOiAnTXlDb25zdHJ1Y3QnLCBtZXNzYWdlOiAnbXktZXJyb3IxJyB9LFxuICAgICAgeyBwYXRoOiAnTXlDb25zdHJ1Y3QnLCBtZXNzYWdlOiAnbXktZXJyb3IyJyB9LFxuICAgICAgeyBwYXRoOiAnVGhlaXJDb25zdHJ1Y3QnLCBtZXNzYWdlOiAndGhlaXItZXJyb3InIH0sXG4gICAgICB7IHBhdGg6ICdUaGVpckNvbnN0cnVjdC9Zb3VyQ29uc3RydWN0JywgbWVzc2FnZTogJ3lvdXItZXJyb3IxJyB9LFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3QubG9jaygpIHByb3RlY3RzIGFnYWluc3QgYWRkaW5nIGNoaWxkcmVuIGFueXdoZXJlIHVuZGVyIHRoaXMgY29uc3RydWN0IChkaXJlY3Qgb3IgaW5kaXJlY3QpJywgKCkgPT4ge1xuICAgIGNsYXNzIExvY2thYmxlQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIHB1YmxpYyBsb2NrTWUoKSB7XG4gICAgICAgIHRoaXMubm9kZS5sb2NrKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgUm9vdCgpO1xuXG4gICAgY29uc3QgYzBhID0gbmV3IExvY2thYmxlQ29uc3RydWN0KHN0YWNrLCAnYzBhJyk7XG4gICAgY29uc3QgYzBiID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ2MwYicpO1xuXG4gICAgY29uc3QgYzFhID0gbmV3IENvbnN0cnVjdChjMGEsICdjMWEnKTtcbiAgICBjb25zdCBjMWIgPSBuZXcgQ29uc3RydWN0KGMwYSwgJ2MxYicpO1xuXG4gICAgYzBhLmxvY2tNZSgpO1xuXG4gICAgLy8gbm93IHdlIHNob3VsZCBzdGlsbCBiZSBhYmxlIHRvIGFkZCBjaGlsZHJlbiB0byBjMGIsIGJ1dCBub3QgdG8gYzBhIG9yIGFueSBpdHMgY2hpbGRyZW5cbiAgICBuZXcgQ29uc3RydWN0KGMwYiwgJ2MxYScpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgQ29uc3RydWN0KGMwYSwgJ2ZhaWwxJykpLnRvVGhyb3coL0Nhbm5vdCBhZGQgY2hpbGRyZW4gdG8gXCJjMGFcIiBkdXJpbmcgc3ludGhlc2lzLyk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBDb25zdHJ1Y3QoYzFhLCAnZmFpbDInKSkudG9UaHJvdygvQ2Fubm90IGFkZCBjaGlsZHJlbiB0byBcImMwYVxcL2MxYVwiIGR1cmluZyBzeW50aGVzaXMvKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IENvbnN0cnVjdChjMWIsICdmYWlsMycpKS50b1Rocm93KC9DYW5ub3QgYWRkIGNoaWxkcmVuIHRvIFwiYzBhXFwvYzFiXCIgZHVyaW5nIHN5bnRoZXNpcy8pO1xuICB9KTtcblxuICB0ZXN0KCdmaW5kQWxsIHJldHVybnMgYSBsaXN0IG9mIGFsbCBjaGlsZHJlbiBpbiBlaXRoZXIgREZTIG9yIEJGUycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGMxID0gbmV3IENvbnN0cnVjdCh1bmRlZmluZWQgYXMgYW55LCAnMScpO1xuICAgIGNvbnN0IGMyID0gbmV3IENvbnN0cnVjdChjMSwgJzInKTtcbiAgICBuZXcgQ29uc3RydWN0KGMxLCAnMycpO1xuICAgIG5ldyBDb25zdHJ1Y3QoYzIsICc0Jyk7XG4gICAgbmV3IENvbnN0cnVjdChjMiwgJzUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYzEubm9kZS5maW5kQWxsKCkubWFwKHggPT4geC5ub2RlLmlkKSkudG9FcXVhbChjMS5ub2RlLmZpbmRBbGwoQ29uc3RydWN0T3JkZXIuUFJFT1JERVIpLm1hcCh4ID0+IHgubm9kZS5pZCkpOyAvLyBkZWZhdWx0IGlzIFByZU9yZGVyXG4gICAgZXhwZWN0KGMxLm5vZGUuZmluZEFsbChDb25zdHJ1Y3RPcmRlci5QUkVPUkRFUikubWFwKHggPT4geC5ub2RlLmlkKSkudG9FcXVhbChbJzEnLCAnMicsICc0JywgJzUnLCAnMyddKTtcbiAgICBleHBlY3QoYzEubm9kZS5maW5kQWxsKENvbnN0cnVjdE9yZGVyLlBPU1RPUkRFUikubWFwKHggPT4geC5ub2RlLmlkKSkudG9FcXVhbChbJzQnLCAnNScsICcyJywgJzMnLCAnMSddKTtcbiAgfSk7XG5cbiAgdGVzdCgnYW5jZXN0b3JzIHJldHVybnMgYSBsaXN0IG9mIHBhcmVudHMgdXAgdG8gcm9vdCcsICgpID0+IHtcbiAgICBjb25zdCB7IGNoaWxkMV8xXzEgfSA9IGNyZWF0ZVRyZWUoKTtcbiAgICBleHBlY3QoY2hpbGQxXzFfMS5ub2RlLnNjb3Blcy5tYXAoeCA9PiB4Lm5vZGUuaWQpKS50b0VxdWFsKFsnJywgJ0hpZ2hDaGlsZCcsICdDaGlsZDEnLCAnQ2hpbGQxMScsICdDaGlsZDExMSddKTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJyb290XCIgcmV0dXJucyB0aGUgcm9vdCBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBjaGlsZDEsIGNoaWxkMiwgY2hpbGQxXzFfMSwgcm9vdCB9ID0gY3JlYXRlVHJlZSgpO1xuICAgIGV4cGVjdChjaGlsZDEubm9kZS5yb290KS50b0VxdWFsKHJvb3QpO1xuICAgIGV4cGVjdChjaGlsZDIubm9kZS5yb290KS50b0VxdWFsKHJvb3QpO1xuICAgIGV4cGVjdChjaGlsZDFfMV8xLm5vZGUucm9vdCkudG9FcXVhbChyb290KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlZmF1bHRDaGlsZCcsICgpID0+IHtcbiAgICB0ZXN0KCdyZXR1cm5zIHRoZSBjaGlsZCB3aXRoIGlkIFwiUmVzb3VyY2VcIicsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQxJyk7XG4gICAgICBjb25zdCBkZWZhdWx0Q2hpbGQgPSBuZXcgQ29uc3RydWN0KHJvb3QsICdSZXNvdXJjZScpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQyJyk7XG5cbiAgICAgIGV4cGVjdChyb290Lm5vZGUuZGVmYXVsdENoaWxkKS50b0VxdWFsKGRlZmF1bHRDaGlsZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXR1cm5zIHRoZSBjaGlsZCB3aXRoIGlkIFwiRGVmYXVsdFwiJywgKCkgPT4ge1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KCk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDEnKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRDaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ0RlZmF1bHQnKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMicpO1xuXG4gICAgICBleHBlY3Qocm9vdC5ub2RlLmRlZmF1bHRDaGlsZCkudG9FcXVhbChkZWZhdWx0Q2hpbGQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIG92ZXJyaWRlIGRlZmF1bHRDaGlsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnUmVzb3VyY2UnKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRDaGlsZCA9IG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ090aGVyUmVzb3VyY2UnKTtcbiAgICAgIHJvb3Qubm9kZS5kZWZhdWx0Q2hpbGQgPSBkZWZhdWx0Q2hpbGQ7XG5cbiAgICAgIGV4cGVjdChyb290Lm5vZGUuZGVmYXVsdENoaWxkKS50b0VxdWFsKGRlZmF1bHRDaGlsZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXR1cm5zIFwidW5kZWZpbmVkXCIgaWYgdGhlcmUgaXMgbm8gZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdCgpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQxJyk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdjaGlsZDInKTtcblxuICAgICAgZXhwZWN0KHJvb3Qubm9kZS5kZWZhdWx0Q2hpbGQpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIGlmIHRoZXJlIGFyZSBib3RoIFwiUmVzb3VyY2VcIiBhbmQgXCJEZWZhdWx0XCInLCAoKSA9PiB7XG4gICAgICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgICAgIG5ldyBDb25zdHJ1Y3Qocm9vdCwgJ2NoaWxkMScpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnRGVmYXVsdCcpO1xuICAgICAgbmV3IENvbnN0cnVjdChyb290LCAnY2hpbGQyJyk7XG4gICAgICBuZXcgQ29uc3RydWN0KHJvb3QsICdSZXNvdXJjZScpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gcm9vdC5ub2RlLmRlZmF1bHRDaGlsZCkudG9UaHJvdyhcbiAgICAgICAgL0Nhbm5vdCBkZXRlcm1pbmUgZGVmYXVsdCBjaGlsZCBmb3IgLiBUaGVyZSBpcyBib3RoIGEgY2hpbGQgd2l0aCBpZCBcIlJlc291cmNlXCIgYW5kIGlkIFwiRGVmYXVsdFwiLyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRyZWUoY29udGV4dD86IGFueSkge1xuICBjb25zdCByb290ID0gbmV3IFJvb3QoKTtcbiAgY29uc3QgaGlnaENoaWxkID0gbmV3IENvbnN0cnVjdChyb290LCAnSGlnaENoaWxkJyk7XG4gIGlmIChjb250ZXh0KSB7XG4gICAgT2JqZWN0LmtleXMoY29udGV4dCkuZm9yRWFjaChrZXkgPT4gaGlnaENoaWxkLm5vZGUuc2V0Q29udGV4dChrZXksIGNvbnRleHRba2V5XSkpO1xuICB9XG5cbiAgY29uc3QgY2hpbGQxID0gbmV3IENvbnN0cnVjdChoaWdoQ2hpbGQsICdDaGlsZDEnKTtcbiAgY29uc3QgY2hpbGQyID0gbmV3IENvbnN0cnVjdChoaWdoQ2hpbGQsICdDaGlsZDInKTtcbiAgY29uc3QgY2hpbGQxXzEgPSBuZXcgQ29uc3RydWN0KGNoaWxkMSwgJ0NoaWxkMTEnKTtcbiAgY29uc3QgY2hpbGQxXzIgPSBuZXcgQ29uc3RydWN0KGNoaWxkMSwgJ0NoaWxkMTInKTtcbiAgY29uc3QgY2hpbGQxXzFfMSA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQxXzEsICdDaGlsZDExMScpO1xuICBjb25zdCBjaGlsZDJfMSA9IG5ldyBDb25zdHJ1Y3QoY2hpbGQyLCAnQ2hpbGQyMScpO1xuXG4gIHJldHVybiB7XG4gICAgcm9vdCwgY2hpbGQxLCBjaGlsZDIsIGNoaWxkMV8xLCBjaGlsZDFfMiwgY2hpbGQxXzFfMSwgY2hpbGQyXzEsXG4gIH07XG59XG5cbmNsYXNzIE15QmVhdXRpZnVsQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHdpdGggYSB0cmVlIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgY29uc3RydWN0IGFuZCBpdCdzIGNoaWxkcmVuLlxuICovXG5mdW5jdGlvbiB0b1RyZWVTdHJpbmcobm9kZTogSUNvbnN0cnVjdCwgZGVwdGggPSAwKSB7XG4gIGxldCBvdXQgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXB0aDsgKytpKSB7XG4gICAgb3V0ICs9ICcgICc7XG4gIH1cbiAgY29uc3QgbmFtZSA9IG5vZGUubm9kZS5pZCB8fCAnJztcbiAgb3V0ICs9IGAke25vZGUuY29uc3RydWN0b3IubmFtZX0ke25hbWUubGVuZ3RoID4gMCA/ICcgWycgKyBuYW1lICsgJ10nIDogJyd9XFxuYDtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLm5vZGUuY2hpbGRyZW4pIHtcbiAgICBvdXQgKz0gdG9UcmVlU3RyaW5nKGNoaWxkLCBkZXB0aCArIDEpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmNsYXNzIFJvb3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih1bmRlZmluZWQgYXMgYW55LCB1bmRlZmluZWQgYXMgYW55KTtcbiAgfVxufVxuIl19