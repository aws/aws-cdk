/* eslint-disable no-console */
import * as reflect from 'jsii-reflect';

import { Import, Assumption } from '../lib/declaration';
import { AssemblyFixture, DUMMY_ASSEMBLY_TARGETS } from './testutil';

let assembly1: AssemblyFixture;
let assembly2: AssemblyFixture;
let ts: reflect.TypeSystem;
describe('Declarations', () => {
  beforeAll(async () => {
    // Create an assembly in a temp directory
    assembly1 = await AssemblyFixture.fromSource(
      {
        'index.ts': `
        export class ClassA {
          public someMethod() {
          }
        }
        export class ClassB {
          public argumentMethod(args: BeeArgs) {
            Array.isArray(args);
          }
        }
        export interface BeeArgs { readonly value: string; readonly nested?: NestedType; }
        export interface NestedType { readonly x: number; }
        `,
      },
      {
        name: 'first_assembly',
        jsii: DUMMY_ASSEMBLY_TARGETS,
      },
    );

    // Create a second assembly in a temp directory
    assembly2 = await AssemblyFixture.fromSource(
      {
        'index.ts': `
        export class ClassA {
          public someMethod() {
          }
        }
        export class ClassB {
          public argumentMethod(args: BeeArgs) {
            Array.isArray(args);
          }
        }
        export interface BeeArgs { readonly value: string; readonly nested?: NestedType; }
        export interface NestedType { readonly x: number; }
        `,
      },
      {
        name: 'assembly_two',
        jsii: DUMMY_ASSEMBLY_TARGETS,
      },
    );

    ts = new reflect.TypeSystem();
    await ts.load(assembly1.directory);
    await ts.load(assembly2.directory);
  });

  describe('Import', () => {
    const imports: Import[] = [];
    beforeAll(() => {
      for (const classType of ts.classes) {
        imports.push(new Import(classType));
      }
    });

    test('equals works as expected', () => {
      expect(imports.length).toEqual(4);
      expect(imports[0].equals(imports[1])).toBeTruthy();
      expect(imports[0].equals(imports[2])).toBeFalsy();
    });
  });

  describe('Assumption', () => {
    const assumptions: Assumption[] = [];
    beforeAll(() => {
      for (const classType of ts.classes) {
        assumptions.push(new Assumption(classType, classType.name));
      }
    });

    test('equals works as expected', () => {
      console.log(assumptions);
      expect(assumptions.length).toEqual(0);
    });
  });

  afterAll(async () => assembly1.cleanup());
  afterAll(async () => assembly2.cleanup());
});