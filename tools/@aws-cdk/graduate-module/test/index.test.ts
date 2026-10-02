import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { GraduationOptions } from '../lib/context';
import { run } from '../lib/index';

/**
 * Exit-code contract of `run()`: `2` when manual follow-up items remain, `1` on
 * self-test failure, `0` clean. `cli.ts` forwards this to `process.exit`, so a
 * caller/CI relies on it to tell a complete graduation from an incomplete one.
 *
 * Exercised in `--cleanup --dry-run` mode: cleanup is the one path that does no
 * file mutation under dry-run and reaches the exit-code mapping without needing
 * a full alpha module to move.
 */
function makeRepo(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'grad-'));
}

function write(file: string, contents: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

const OPTIONS: GraduationOptions = { service: 'aws-foo', cleanup: true, strict: false, dryRun: true };

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

describe('run exit codes', () => {
  test('returns 0 for a clean graduation with no manual items', () => {
    const repoRoot = makeRepo();
    try {
      write(path.join(repoRoot, 'packages', '@aws-cdk', 'aws-foo-alpha', 'package.json'), '{}\n');
      // Stable submodule exists → cleanup guard passes; no custom resources → no manual item.
      fs.mkdirSync(path.join(repoRoot, 'packages', 'aws-cdk-lib', 'aws-foo'), { recursive: true });

      expect(run(OPTIONS, repoRoot)).toBe(0);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test('returns 2 when the report has manual follow-up items', () => {
    const repoRoot = makeRepo();
    try {
      write(path.join(repoRoot, 'packages', '@aws-cdk', 'aws-foo-alpha', 'package.json'), '{}\n');
      fs.mkdirSync(path.join(repoRoot, 'packages', 'aws-cdk-lib', 'aws-foo'), { recursive: true });
      // Custom resources → cleanup records a manual follow-up for the config/handler removal.
      write(
        path.join(repoRoot, 'packages', '@aws-cdk', 'custom-resource-handlers', 'lib', 'custom-resources-framework', 'config.ts'),
        "export const config = { 'aws-foo-alpha': {} };\n",
      );

      expect(run(OPTIONS, repoRoot)).toBe(2);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
