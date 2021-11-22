import * as reflect from 'jsii-reflect';

import { generateAssignmentStatement } from '../lib/generate';
import { AssemblyFixture, DUMMY_ASSEMBLY_TARGETS, MultipleSources } from './testutil';

describe('generateClassAssignment ', () => {
  test('generates example for class with static methods',
    expectedDocTest({
      sources: {
        'index.ts': `
        export class ClassA {
          public static firstMethod() { return new ClassA(); }
          public static secondMethod() { return new ClassA(); }
          public static thirdMethod() { return new ClassA(); }
          private constructor() {}
        }`,
      },
      typeName: 'ClassA',
      expected: [
        'import * as my_assembly from \'my_assembly\';',
        '',
        'const classA = my_assembly.ClassA.firstMethod();',
      ],
    }),
  );

  test('generates example for class with static properties',
    expectedDocTest({
      sources: {
        'index.ts': `
        export class ClassA {
          public static readonly FIRST_PROPERTY = new ClassA();
          public static readonly SECOND_PROPERTY = new ClassA();
          public static readonly THIRD_PROPERTY = new ClassA();
          private constructor() {}
        }`,
      },
      typeName: 'ClassA',
      expected: [
        'import * as my_assembly from \'my_assembly\';',
        '',
        'const classA = my_assembly.ClassA.FIRST_PROPERTY;',
      ],
    }),
  );

  test('generates example for class instantiation',
    expectedDocTest({
      sources: {
        'index.ts': `
        export class ClassA {
          public constructor(public readonly a: string, public readonly b: string) {}
        }`,
      },
      typeName: 'ClassA',
      expected: [
        'import * as my_assembly from \'my_assembly\';',
        '',
        'const classA = new my_assembly.ClassA(\'a\', \'b\');',
      ],
    }),
  );

  test('generates example for more complicated class instantiation',
    expectedDocTest({
      sources: {
        'index.ts': `
        export class ClassA {
          public constructor(public readonly scope: string, public readonly id: string, public readonly props: ClassAProps) {}
        }
        export interface ClassAProps {
          readonly prop1: number,
          readonly prop2: IProperty,
          readonly prop3: string[],
          readonly prop4: number | string,
          readonly prop5?: any,
          readonly prop6?: boolean,
          readonly prop7?: { [key: string]: string },
        }
        export interface IProperty {
          readonly prop: string,
        }
        export class Property implements IProperty {
          readonly prop: string;
          public constructor() { this.prop = 'a'; }
        }
        `,
      },
      typeName: 'ClassA',
      expected: [
        'import * as my_assembly from \'my_assembly\';',
        '',
        'declare const prop5: any;',
        'declare const property: my_assembly.Property;',
        '',
        'const classA = new my_assembly.ClassA(this, \'MyClassA\', {',
        '  prop1: 123,',
        '  prop2: property,',
        '  prop3: [\'prop3\'],',
        '  prop4: \'prop4\',',
        '',
        '  // the properties below are optional',
        '  prop5: prop5,',
        '  prop6: false,',
        '  prop7: {',
        '    prop7Key: \'prop7\',',
        '  },',
        '});',
      ],
    }),
  );

  test('returns undefined if class has no statics and private initializer', async () => {
    const assembly = await AssemblyFixture.fromSource(
      {
        'index.ts': `
        export class ClassA {
          private constructor() {}
        }`,
      },
      {
        name: 'my_assembly',
        jsii: DUMMY_ASSEMBLY_TARGETS,
      },
    );

    const ts = new reflect.TypeSystem();
    await ts.load(assembly.directory);

    const type = ts.findClass('my_assembly.ClassA');
    expect(generateAssignmentStatement(type)).toBeUndefined();

    await assembly.cleanup();
  });

  test('optional properties are added in the correct spot',
    expectedDocTest({
      sources: {
        'index.ts': `
        export class ClassA {
          public constructor(public readonly scope: string, public readonly id: string, public readonly props: ClassAProps) {}
        }
        export interface ClassAProps {
          readonly prop1: number,
          readonly prop2?: number,
        }
        `,
      },
      typeName: 'ClassA',
      expected: [
        'import * as my_assembly from \'my_assembly\';',
        '',
        'const classA = new my_assembly.ClassA(this, \'MyClassA\', {',
        '  prop1: 123,',
        '',
        '  // the properties below are optional',
        '  prop2: 123,',
        '});',
      ],
    }),
  );

  test(
    'comment added when all properties are optional',
    expectedDocTest({
      sources: {
        'index.ts': `
        export class ClassA {
          public constructor(public readonly scope: string, public readonly id: string, public readonly props: ClassAProps = {}) {}
        }
        export interface ClassAProps {
          readonly prop1?: number,
          readonly prop2?: number,
        }
        `,
      },
      typeName: 'ClassA',
      expected: [
        'import * as my_assembly from \'my_assembly\';',
        '',
        'const classA = new my_assembly.ClassA(this, \'MyClassA\', /* all optional props */ {',
        '  prop1: 123,',
        '  prop2: 123,',
        '});',
      ],
    }),
  );
});

test(
  'generate example for struct',
  expectedDocTest({
    sources: {
      'index.ts': `
      export interface SomeStruct {
        readonly required: string;
        readonly optional?: number;
      }
      `,
    },
    typeName: 'SomeStruct',
    expected: [
      'import * as my_assembly from \'my_assembly\';',
      '',
      'const someStruct: my_assembly.SomeStruct = {',
      '  required: \'required\',',
      '',
      '  // the properties below are optional',
      '  optional: 123,',
      '};',
    ],
  }),
);

test(
  'rendering an enum value',
  expectedDocTest({
    sources: {
      'index.ts': `
        export interface SomeStruct {
          readonly someEnum: MyEnum;
        }
        export enum MyEnum {
          VALUE1 = 1,
          VALUE2 = 2,
        }
      `,
    },
    typeName: 'SomeStruct',
    expected: [
      'import * as my_assembly from \'my_assembly\';',
      '',
      'const someStruct: my_assembly.SomeStruct = {',
      '  someEnum: my_assembly.MyEnum.VALUE1,',
      '};',
    ],
  }),
);

test('rendering types in namespaces', expectedDocTest({
  sources: {
    // This merges a class and a namespace (making the struct appear
    // namespaced inside the class -- we do this for L1 structs)
    'index.ts': `
      export class SomeClass {
        constructor(props: SomeClass.SomeStruct) {
          Array.isArray(props);
        }
      }

      export namespace SomeClass {
        export interface SomeStruct {
          readonly someEnum: MyEnum;
        }
        export enum MyEnum {
          VALUE1 = 1,
          VALUE2 = 2,
        }
      }
    `,
  },
  typeName: 'SomeClass.SomeStruct',
  expected: [
    'import * as my_assembly from \'my_assembly\';',
    '',
    'const someStruct: my_assembly.SomeClass.SomeStruct = {',
    '  someEnum: my_assembly.SomeClass.MyEnum.VALUE1,',
    '};',
  ],
}));

test('rendering types in submodules', expectedDocTest({
  sources: {
    'index.ts': 'export * as sub from \'./other\';',
    'other.ts': `
      export interface SomeStruct {
        readonly someEnum: MyEnum;
      }
      export enum MyEnum {
        VALUE1 = 1,
        VALUE2 = 2,
      }
    `,
  },
  typeName: 'sub.SomeStruct',
  expected: [
    'import { sub } from \'my_assembly\';',
    '',
    'const someStruct: sub.SomeStruct = {',
    '  someEnum: sub.MyEnum.VALUE1,',
    '};',
  ],
}));

interface DocTest {
  readonly sources: MultipleSources;
  readonly typeName: string;
  readonly expected: string[];
}

function expectedDocTest(testParams: DocTest) {
  return async () => {
    const assembly = await AssemblyFixture.fromSource(
      testParams.sources,
      {
        name: 'my_assembly',
        jsii: DUMMY_ASSEMBLY_TARGETS,
      },
    );
    try {
      const ts = new reflect.TypeSystem();
      await ts.load(assembly.directory);

      const type = ts.findFqn(`my_assembly.${testParams.typeName}`);
      if (!type.isClassType() && !type.isInterfaceType()) {
        throw new Error('Expecting class or interface');
      }
      expect(generateAssignmentStatement(type)?.toString()?.split('\n')).toEqual(testParams.expected);
    } finally {
      await assembly.cleanup();
    }
  };
}