import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { cleanup } from '../lib/cleanup';
import type { GraduationOptions } from '../lib/context';
import { GraduationContext } from '../lib/context';
import { GraduationReport } from '../lib/report';

/** Build a GraduationContext rooted at a throwaway temp dir for the `aws-foo` service. */
function makeCtx(overrides: Partial<GraduationOptions> = {}): { ctx: GraduationContext; report: GraduationReport; repoRoot: string } {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grad-'));
  const ctx = new GraduationContext(
    { service: 'aws-foo', cleanup: true, strict: false, dryRun: false, ...overrides },
    repoRoot,
  );
  return { ctx, report: new GraduationReport('aws-foo'), repoRoot };
}

function write(file: string, contents: string): string {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
  return file;
}

// The transforms emit progress via console; keep test output clean.
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

describe('cleanup', () => {
  test('refuses to delete the alpha package when the stable submodule is absent', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      // Alpha exists but the stable submodule was never created — deletion is unsafe.
      write(path.join(ctx.alphaDir, 'package.json'), '{}\n');

      expect(() => cleanup(ctx, report)).toThrow(/refusing to delete/);
      // The guard must leave the alpha package intact.
      expect(fs.existsSync(ctx.alphaDir)).toBe(true);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('--dry-run previews the deletion without removing the alpha package', () => {
    const { ctx, report, repoRoot } = makeCtx({ dryRun: true });
    try {
      write(path.join(ctx.alphaDir, 'package.json'), '{}\n');
      fs.mkdirSync(ctx.submoduleDir, { recursive: true });

      cleanup(ctx, report);

      // Dry-run must short-circuit before the rmSync.
      expect(fs.existsSync(ctx.alphaDir)).toBe(true);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('is a no-op when the alpha package was already removed', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      // Submodule exists (passes the guard) but the alpha dir is already gone.
      fs.mkdirSync(ctx.submoduleDir, { recursive: true });

      expect(() => cleanup(ctx, report)).not.toThrow();
      expect(report.hasManualItems).toBe(false);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('deletes the alpha package and records a review note when the submodule exists', () => {
    const { ctx, report, repoRoot } = makeCtx();
    try {
      write(path.join(ctx.alphaDir, 'package.json'), '{}\n');
      fs.mkdirSync(ctx.submoduleDir, { recursive: true });

      cleanup(ctx, report);

      expect(fs.existsSync(ctx.alphaDir)).toBe(false);
      expect(report.render()).toMatch(/deleted the alpha package/);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('records a manual follow-up for the custom-resource config/handler removal', () => {
    const { ctx, report, repoRoot } = makeCtx({ dryRun: true });
    try {
      write(path.join(ctx.alphaDir, 'package.json'), '{}\n');
      fs.mkdirSync(ctx.submoduleDir, { recursive: true });
      // Seed the CR config so `ctx.hasCustomResources` is true.
      write(
        path.join(ctx.crHandlersDir, 'lib', 'custom-resources-framework', 'config.ts'),
        "export const config = { 'aws-foo-alpha': {} };\n",
      );

      cleanup(ctx, report);

      expect(report.hasManualItems).toBe(true);
      expect(report.render()).toContain('config.ts');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
