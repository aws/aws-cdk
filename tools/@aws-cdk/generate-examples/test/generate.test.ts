import * as reflect from 'jsii-reflect';

import { generateClassAssignment } from '../lib/generate';
import { AssemblyFixture, DUMMY_ASSEMBLY_TARGETS } from './testutil';

describe('generateClassAssignment ', () => {
  test('generates example for class with static methods', async () => {
    const assembly = await AssemblyFixture.fromSource(
      {
        'index.ts': `
        export class ClassA {
          public static firstMethod() { return new ClassA(); }
          public static secondMethod() { return new ClassA(); }
          public static thirdMethod() { return new ClassA(); }
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
    expect(generateClassAssignment(type)).toEqual('import * as my_assembly from \'my_assembly\';\n\nconst classA = my_assembly.ClassA.firstMethod();');
  });

  test('generates example for class with static properties', async () => {
    const assembly = await AssemblyFixture.fromSource(
      {
        'index.ts': `
        export class ClassA {
          public static readonly FIRST_PROPERTY = new ClassA();
          public static readonly SECOND_PROPERTY = new ClassA();
          public static readonly THIRD_PROPERTY = new ClassA();
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
    expect(generateClassAssignment(type)).toEqual('import * as my_assembly from \'my_assembly\';\n\nconst classA = my_assembly.ClassA.FIRST_PROPERTY;');
  });

  test('generates example for class instantiation', async () => {
    const assembly = await AssemblyFixture.fromSource(
      {
        'index.ts': `
        export class ClassA {
          public constructor(public readonly a: string, public readonly b: string) {}
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
    expect(generateClassAssignment(type)).toEqual('import * as my_assembly from \'my_assembly\';\n\nconst classA = new my_assembly.ClassA(\'a\', \'b\');');
  });

  test('generates example for more complicated class instantiation', async () => {
    const assembly = await AssemblyFixture.fromSource(
      {
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
      {
        name: 'my_assembly',
        jsii: DUMMY_ASSEMBLY_TARGETS,
      },
    );

    const ts = new reflect.TypeSystem();
    await ts.load(assembly.directory);

    const type = ts.findClass('my_assembly.ClassA');
    expect(generateClassAssignment(type)?.split('\n')).toEqual([
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
      '  prop5: prop5,                         // optional',
      '  prop6: false,                         // optional',
      '  prop7: {                              // optional',
      '    prop7Key: \'prop7\',',
      '  },',
      '});',
    ]);
  });

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
    expect(generateClassAssignment(type)).toBeUndefined();
  });
});

describe('optionals', () => {
  // FIXME: do this when optional implementation set
});