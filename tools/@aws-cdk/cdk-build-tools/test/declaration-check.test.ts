import * as ts from 'typescript';
import bockfs from '../lib/bockfs';
import { checkConsumer, checkDeclarations, declarationEntryPoints, formatDiagnostics } from '../lib/declaration-check';

/**
 * Each fixture compiles without `exactOptionalPropertyTypes`, as the CDK source
 * does, and fails only once a strict consumer reads its declarations.
 */
const NARROW_INTERFACE = 'export interface IThing { readonly name?: string; }';
const WIDE_INTERFACE = 'export interface IThing { readonly name?: string | undefined; }';
const THING = `
export class Thing implements IThing {
  public readonly name: string | undefined;
  constructor(name?: string) { this.name = name; }
}`;

describe('checkDeclarations', () => {
  test('reports a class member that is wider than its interface', () => {
    const dir = fixture(NARROW_INTERFACE + THING);
    const diagnostics = checkDeclarations(dir, ['index.d.ts']);

    expect(codes(diagnostics)).toEqual([2420]);
    expect(formatDiagnostics(diagnostics, dir)).toMatch(/^index\.d\.ts\(\d+,\d+\): error TS2420: /);
  });

  test('reports a class member that is wider than its abstract base class', () => {
    const dir = fixture(`
      export abstract class ThingBase { public abstract readonly name?: string; }
      export class Thing extends ThingBase {
        public readonly name: string | undefined;
        constructor(name?: string) { super(); this.name = name; }
      }`);

    expect(codes(checkDeclarations(dir, ['index.d.ts']))).toEqual([2415]);
  });

  test('reports a member whose type is only written in the declarations', () => {
    const dir = fixture(`${NARROW_INTERFACE}
      export function lookup(): string | undefined { return undefined; }
      export class Thing implements IThing { public readonly name = lookup(); }`);

    expect(codes(checkDeclarations(dir, ['index.d.ts']))).toEqual([2420]);
  });

  test('accepts an interface member that allows undefined', () => {
    const dir = fixture(WIDE_INTERFACE + THING);

    expect(checkDeclarations(dir, ['index.d.ts'])).toEqual([]);
  });

  test('ignores implementation code, which consumers do not compile', () => {
    const dir = fixture('export function f(): void { const o: { a?: string } = { a: undefined }; void o; }');

    expect(checkDeclarations(dir, ['index.d.ts'])).toEqual([]);
  });

  test('ignores errors in other packages', () => {
    const broken = NARROW_INTERFACE + 'export declare class Thing implements IThing { readonly name: string | undefined; }';
    const dir = fixture({
      'index.ts': 'export * as dep from \'./node_modules/dep/index.js\';\nexport * as sibling from \'../sibling/index.js\';',
      'node_modules/dep/index.d.ts': broken,
      '../sibling/index.d.ts': broken,
    });

    expect(checkDeclarations(dir, ['index.d.ts'])).toEqual([]);
  });
});

describe('declarationEntryPoints', () => {
  test('maps each JavaScript export to its declarations and skips other files', () => {
    expect(declarationEntryPoints({
      exports: {
        '.': './index.js',
        './aws-s3': './aws-s3/index.js',
        './.jsii': './.jsii',
        './package.json': './package.json',
      },
    })).toEqual(['./index.d.ts', './aws-s3/index.d.ts']);
  });

  test('reads the targets of conditional exports, at any depth', () => {
    expect(declarationEntryPoints({
      exports: {
        '.': { types: './index.d.ts', default: './index.js' },
        './sub': { node: { require: './sub.js' } },
      },
    })).toEqual(['./index.d.ts', './sub.d.ts']);
  });

  test('uses types, then main, when there is no exports map', () => {
    expect(declarationEntryPoints({ types: 'lib/index.d.ts', main: 'lib/other.js' })).toEqual(['lib/index.d.ts']);
    expect(declarationEntryPoints({ main: 'lib/index.js' })).toEqual(['lib/index.d.ts']);
  });

  test('returns nothing when no entry point is JavaScript or declarations', () => {
    expect(declarationEntryPoints({ exports: { './.jsii': './.jsii' } })).toEqual([]);
    expect(declarationEntryPoints({})).toEqual([]);
  });
});

describe('checkConsumer', () => {
  const USE_THING = `
    import { IThing, Thing } from 'fixture';
    function use(_thing: IThing) {}
    use(new Thing());`;

  test('reports passing a class where its interface is expected, even with skipLibCheck', () => {
    const dir = fixture(NARROW_INTERFACE + THING);

    expect(codes(checkConsumer(dir, USE_THING, { skipLibCheck: true }))).toEqual([2379]);
  });

  test('accepts the same call once the interface allows undefined', () => {
    const dir = fixture(WIDE_INTERFACE + THING);

    expect(checkConsumer(dir, USE_THING)).toEqual([]);
  });
});

function codes(diagnostics: readonly ts.Diagnostic[]): number[] {
  return diagnostics.map((d) => d.code);
}

let fixtureCount = 0;

/**
 * A package named `fixture` with `source` as its `index.ts`, or with the given
 * files, and the declarations emitted next to its `.ts` files as jsii does.
 */
function fixture(source: string | Record<string, string>): string {
  const name = `fixture${fixtureCount++}`;
  const files = typeof source === 'string' ? { 'index.ts': source } : source;
  bockfs({
    [`${name}/package.json`]: JSON.stringify({ name: 'fixture', main: 'index.js', exports: { '.': './index.js' } }),
    ...Object.fromEntries(Object.entries(files).map(([file, contents]) => [`${name}/${file}`, contents])),
  });
  const dir = bockfs.path(name);
  const sources = Object.keys(files).filter((f) => !f.endsWith('.d.ts'));

  const program = ts.createProgram(sources.map((f) => bockfs.path(`${name}/${f}`)), {
    strict: true,
    declaration: true,
    emitDeclarationOnly: true,
    lib: ['lib.es2022.d.ts'],
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
  });
  const result = program.emit();
  const errors = [...ts.getPreEmitDiagnostics(program), ...result.diagnostics];
  if (errors.length > 0) {
    throw new Error(`fixture does not compile: ${errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('; ')}`);
  }
  return dir;
}
