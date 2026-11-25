import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { GraduationContext } from '../lib/context';
import type { GraduationOptions } from '../lib/context';
import { preflight } from '../lib/preflight';
import { GraduationReport } from '../lib/report';

/** Build a context (and its temp repo) for `aws-foo`, overriding options as needed. */
function makeCtx(options: Partial<GraduationOptions> = {}): { ctx: GraduationContext; report: GraduationReport; repoRoot: string } {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grad-'));
  const ctx = new GraduationContext(
    { service: 'aws-foo', cleanup: false, strict: false, dryRun: false, ...options },
    repoRoot,
  );
  return { ctx, report: new GraduationReport('aws-foo'), repoRoot };
}

function write(file: string, contents: string): string {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
  return file;
}

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

describe('detectUnionTypes (via preflight)', () => {
  test('flags a bare A | B union of named types', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'lib', 'foo.ts'), [
        'export interface FooProps {',
        '  readonly source: TypeA | TypeB;',
        '}',
        '',
      ].join('\n'));

      preflight(ctx, report);

      const out = report.render();
      expect(out).toContain('possible union type');
      expect(out).toContain('source: TypeA | TypeB');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('does not flag commented-out unions or primitive/optional unions', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'lib', 'foo.ts'), [
        'export interface FooProps {',
        '  // readonly legacy: TypeA | TypeB;',
        '  readonly name?: string | undefined;',
        '}',
        '',
      ].join('\n'));

      preflight(ctx, report);

      expect(report.render()).not.toContain('possible union type');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe('detectDeprecatedApis (via preflight)', () => {
  test('warns (does not throw) when @deprecated APIs remain without --strict', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'lib', 'foo.ts'), [
        '/** @deprecated use Bar instead */',
        'export class Foo {}',
        '',
      ].join('\n'));

      expect(() => preflight(ctx, report)).not.toThrow();
      const out = report.render();
      expect(out).toContain('🟡 Warnings');
      expect(out).toContain('found @deprecated APIs');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('throws under --strict when @deprecated APIs remain', () => {
    const { ctx, report, repoRoot } = makeCtx({ strict: true });
    try {
      write(path.join(ctx.alphaDir, 'lib', 'foo.ts'), [
        '/** @deprecated */',
        'export class Foo {}',
        '',
      ].join('\n'));

      expect(() => preflight(ctx, report)).toThrow(/@deprecated/);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
