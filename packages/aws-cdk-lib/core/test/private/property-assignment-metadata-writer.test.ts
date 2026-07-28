import * as fs from 'node:fs';
import * as path from 'node:path';
import type * as constructs from 'constructs';
import { Construct } from 'constructs';
import { AssertionError } from '../../../assertions/lib/private/error';
import type { IResolvable } from '../../lib';
import {
  App,
  CfnResource,
  Resource,
  Stack,
  Stage,
  StringConcat,
  Token,
  traceProperty,
} from '../../lib';
import type {
  IArrayBox,
  IBox,
} from '../../lib/helpers-internal';
import { Box } from '../../lib/helpers-internal';
import { noBoxStackTraces } from '../../lib/no-box-stack-traces';
import type { IPropertyNameLookupTable } from '../../lib/private/resolve';
import { PropertyAssignmentMetadataWriter, resolve } from '../../lib/private/resolve';

// Boxes only collect stack traces in debug mode
const originalCdkDebug = process.env.CDK_DEBUG;

beforeEach(() => {
  process.env.CDK_DEBUG = '1';
});

afterEach(() => {
  if (originalCdkDebug === undefined) {
    delete process.env.CDK_DEBUG;
  } else {
    process.env.CDK_DEBUG = originalCdkDebug;
  }
});

function makeLookupTable(mapping: Record<string, string>): IPropertyNameLookupTable {
  return {
    cfnPropertyName: (cdkName: string) => mapping[cdkName],
  };
}

describe('PropertyAssignmentMetadataWriter', () => {
  test('adds metadata for a Box token at a valid property path', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box = Box.fromValue('hello');
    const lookupTable = makeLookupTable({ myProp: 'MyProp' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    resolve(
      { Resources: { LogicalId: { Properties: { myProp: box } } } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    expect(metadata.length).toBe(1);
    expect(metadata[0].data.propertyName).toBe('MyProp');
    expect(metadata[0].data.stackTrace).toBeDefined();
  });

  test('does not add metadata for non-Box tokens', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    // A plain IResolvable that is NOT a Box
    const token = {
      creationStack: [],
      resolve: () => 'resolved',
    };

    const lookupTable = makeLookupTable({ myProp: 'MyProp' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    resolve(
      { Resources: { LogicalId: { Properties: { myProp: token } } } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    expect(metadata.length).toBe(0);
  });

  test('does not add metadata when document path does not match expected pattern', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box = Box.fromValue('hello');
    const lookupTable = makeLookupTable({ myProp: 'MyProp' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    // Path doesn't start with Resources/*/Properties
    resolve(
      { Other: { LogicalId: { myProp: box } } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    expect(metadata.length).toBe(0);
  });

  test('does not add metadata when lookup table returns undefined', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box = Box.fromValue('hello');
    const lookupTable = makeLookupTable({}); // no mapping
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    resolve(
      { Resources: { LogicalId: { Properties: { unknownProp: box } } } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    expect(metadata.length).toBe(0);
  });

  test('resolving the same object twice is idempotent', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box = Box.fromValue('hello');
    const lookupTable = makeLookupTable({ myProp: 'MyProp' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);
    const obj = { Resources: { LogicalId: { Properties: { myProp: box } } } };
    const opts = { scope: construct, prefix: [] as string[], resolver, preparing: true };

    // Resolve the same object twice with the same resolver
    resolve(obj, opts);
    resolve(obj, opts);

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    // Second call should not add duplicate metadata
    expect(metadata.length).toBe(1);
    expect(metadata[0].data.propertyName).toBe('MyProp');
  });

  test('adds metadata for multiple distinct properties', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box1 = Box.fromValue('val1');
    const box2 = Box.fromValue('val2');
    const lookupTable = makeLookupTable({ propA: 'PropA', propB: 'PropB' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    resolve(
      { Resources: { LogicalId: { Properties: { propA: box1, propB: box2 } } } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    expect(metadata.length).toBe(2);
    expect(metadata.map(m => m.data.propertyName).sort()).toEqual(['PropA', 'PropB']);
  });

  test('does not add metadata when path is too short', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box = Box.fromValue('hello');
    const lookupTable = makeLookupTable({ myProp: 'MyProp' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    // Only 2 levels deep - not enough for Resources/*/Properties/*
    resolve(
      { Resources: { myProp: box } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    expect(metadata.length).toBe(0);
  });

  test('adds metadata entries for each stack trace from a Box', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box = Box.fromArray([1]);
    box.push(2); // ArrayBox.push adds another stack trace

    const lookupTable = makeLookupTable({ myProp: 'MyProp' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    resolve(
      { Resources: { LogicalId: { Properties: { myProp: box } } } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    const metadata = construct.node.metadata.filter(m => m.type === 'aws:cdk:propertyAssignment');
    // ArrayBox with push collects 2 stack traces (constructor + push)
    expect(metadata.length).toBe(2);
    metadata.forEach(m => {
      expect(m.data.propertyName).toBe('MyProp');
      expect(m.data.stackTrace).toBeDefined();
    });
  });

  test('still resolves the token value correctly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const construct = new Construct(stack, 'MyConstruct');

    const box = Box.fromValue('resolved-value');
    const lookupTable = makeLookupTable({ myProp: 'MyProp' });
    const resolver = new PropertyAssignmentMetadataWriter(new StringConcat(), lookupTable);

    const result = resolve(
      { Resources: { LogicalId: { Properties: { myProp: box } } } },
      { scope: construct, prefix: [], resolver, preparing: true },
    );

    expect(result.Resources.LogicalId.Properties.myProp).toBe('resolved-value');
  });
});

describe('Entire synthesis workflow', () => {
  interface CfnFooProps {
    scalar: string | IResolvable;
    anotherScalar: string | IResolvable;
    derivedScalar: number | IResolvable;
    array: string[] | IResolvable;
    nested: {
      scalar: string | IResolvable;
      array: string[] | IResolvable;
    };
  }

  class CfnFoo extends CfnResource {
    private readonly _scalar: string | IResolvable;
    private _anotherScalar: string | IResolvable;
    private readonly _derivedScalar: number | IResolvable;
    private readonly _array: string[] | IResolvable;
    private readonly _nested: {
      scalar: string | IResolvable;
      array: string[] | IResolvable;
    };

    protected readonly cfnPropertyNames: Record<string, string> = {
      scalar: 'Scalar',
      anotherScalar: 'AnotherScalar',
      derivedScalar: 'DerivedScalar',
      array: 'Array',
      nested: 'Nested',
    };

    public constructor(scope: constructs.Construct, id: string, props: CfnFooProps) {
      super(scope, id, {
        type: 'AWS::FooService::Foo',
        properties: props,
      });
      this._array = props.array;
      this._scalar = props.scalar;
      this._anotherScalar = props.anotherScalar;
      this._derivedScalar = props.derivedScalar;
      this._nested = props.nested;
    }

    protected get cfnProperties(): Record<string, any> {
      return {
        scalar: this._scalar,
        anotherScalar: this._anotherScalar,
        derivedScalar: this._derivedScalar,
        array: this._array,
        nested: this._nested,
      };
    }

    public set anotherScalar(value: string | IResolvable) {
      traceProperty(this.node, 'AnotherScalar');
      this._anotherScalar = value;
    }
  }

  @noBoxStackTraces
  class Foo extends Resource {
    private readonly scalar: IBox<string>;
    private readonly anotherScalar: IBox<string>;
    private readonly array: IArrayBox<string>;
    private resource: CfnFoo;

    constructor(scope: Construct, id: string) {
      super(scope, id);
      /*
       Outline of the boxes and constructs used in this test:

        Foo (L2)                                    CfnFoo (L1)
       ┌──────────────────────┐                    ┌──────────────────────────┐
       │                      │                    │                          │
       │  scalar ─────────────┼───────────────────►│ Scalar                   │
       │  (Box<string>)       │          │         │                          │
       │                      │          │  derive │                          │
       │                      │          └────────►│ DerivedScalar            │
       │                      │          │         │                          │
       │                      │          └────────►│ Nested.Scalar            │
       │                      │                    │                          │
       │                      │                    │                          │
       │  array ──────────────┼───────────────────►│ Array                    │
       │  (ArrayBox<string>)  │          │         │                          │
       │                      │          └────────►│ Nested.Array             │
       │                      │                    │                          │
       │                      │                    │                          │
       │  anotherScalar       │   (not wired until │ AnotherScalar = 'not a   │
       │  (Box<string>)  ─ ─ ─┼ ─  method call) ─ ►│  box' (literal at init)  │
       │                      │                    │                          │
       └──────────────────────┘                    └──────────────────────────┘

       Legend:
        ────►  Wired at construction time (via Token.asString / Token.asList)
        ─ ─ ►  Only wired if assignBoxToAnotherScalar() is called
       */

      this.scalar = Box.fromValue('...');
      this.anotherScalar = Box.fromValue('...');
      this.array = Box.fromArray(['a']);

      this.scalar.set('Ignore this stack trace');
      this.array.set(['Also ignore this stack trace']);
      this.array.push('Ignore again');

      this.resource = new CfnFoo(this, 'xyz', {
        array: Token.asList(this.array),
        scalar: Token.asString(this.scalar),
        anotherScalar: 'not a box',
        derivedScalar: Token.asNumber(this.scalar.derive(s => s.length)),
        nested: {
          scalar: Token.asString(this.scalar),
          array: Token.asList(this.array),
        },
      });
    }

    assignNonBoxToAnotherScalar() {
      this.resource.anotherScalar = 'foobar';
    }

    replaceScalar() {
      this.scalar.set('record this scalar set');
    }

    pushToArray() {
      this.array.push('record this push');
    }

    assignBoxToAnotherScalar() {
      this.resource.anotherScalar = this.anotherScalar;
    }

    replaceAnotherScalar() {
      this.anotherScalar.set('record another scalar set');
    }

    replaceArray() {
      this.array.set(['record this array set']);
    }
  }

  let app: App;
  let stack: Stack;
  let construct: Foo;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app);
    construct = new Foo(stack, 'Foo');
  });

  test('no methods called produces no assignments', () => {
    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual([]);
  });

  test('non-box assignment is captured', () => {
    construct.assignNonBoxToAnotherScalar();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['AnotherScalar']);
  });

  test('replacing a scalar box captures all properties it feeds into', () => {
    construct.replaceScalar();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['DerivedScalar', 'Nested', 'Scalar']);
  });

  test('pushing to an array box captures all properties it feeds into', () => {
    construct.pushToArray();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['Array', 'Nested']);
  });

  test('assigning a box to a CfnResource property is captured', () => {
    construct.assignBoxToAnotherScalar();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['AnotherScalar']);
  });

  test('replacing a box that is not wired to a CfnResource produces no assignments', () => {
    construct.replaceAnotherScalar();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual([]);
  });

  test('replacing an array box captures all properties it feeds into', () => {
    construct.replaceArray();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['Array', 'Nested']);
  });

  test('assigning a box then replacing it captures both', () => {
    construct.assignBoxToAnotherScalar();
    construct.replaceAnotherScalar();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['AnotherScalar', 'AnotherScalar']);
  });

  test('replacing scalar and pushing to array captures all affected properties', () => {
    construct.replaceScalar();
    construct.pushToArray();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['Array', 'DerivedScalar', 'Nested', 'Nested', 'Scalar']);
  });

  test('replacing scalar and replacing array captures all affected properties', () => {
    construct.replaceScalar();
    construct.replaceArray();

    const assignments = propertyAssignments(stack);
    expect(assignedProperties(assignments)).toEqual(['Array', 'DerivedScalar', 'Nested', 'Nested', 'Scalar']);
  });
});

type PropertyAssignment = {
  data: {
    propertyName: string;
    stackTrace: Array<string>;
  };
};

function assignedProperties(assignments: Array<PropertyAssignment>): string[] {
  return assignments.map(a => a.data.propertyName).sort();
}

function propertyAssignments(stack: Stack): Array<PropertyAssignment> {
  const md = meta(stack);
  return md['/Default/Foo/xyz'].filter((e: any) => e.type === 'aws:cdk:propertyAssignment');
}

function meta(stack: Stack): any {
  const stage = Stage.of(stack);
  if (!Stage.isStage(stage)) {
    throw new AssertionError('unexpected: all stacks must be part of a Stage or an App');
  }

  const asm = stage.synth();
  return JSON.parse(fs.readFileSync(path.join(asm.directory, 'Default.metadata.json'), 'utf-8'));
}
