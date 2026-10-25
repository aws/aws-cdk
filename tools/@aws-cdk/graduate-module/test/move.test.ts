import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { GraduationContext } from '../lib/context';
import { move } from '../lib/move';
import { GraduationReport } from '../lib/report';

function makeCtx(dryRun: boolean): { ctx: GraduationContext; report: GraduationReport; repoRoot: string } {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grad-'));
  const ctx = new GraduationContext(
    { service: 'aws-foo', cleanup: false, strict: false, dryRun },
    repoRoot,
  );
  return { ctx, report: new GraduationReport('aws-foo'), repoRoot };
}

function write(file: string, contents: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

describe('move', () => {
  test('--dry-run writes nothing under the target submodule', () => {
    const { ctx, report, repoRoot } = makeCtx(true);
    try {
      // A source that a real move would copy into the submodule lib.
      write(path.join(ctx.alphaDir, 'lib', 'foo.ts'), 'export class Foo {}\n');

      move(ctx, report);

      // The dry-run guard must short-circuit before any mutating transform runs.
      expect(fs.existsSync(ctx.submoduleDir)).toBe(false);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
