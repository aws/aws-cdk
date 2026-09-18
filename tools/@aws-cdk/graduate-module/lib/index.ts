import { cleanup } from './cleanup';
import type { GraduationOptions } from './context';
import { GraduationContext } from './context';
import { move } from './move';
import { preflight } from './preflight';
import { GraduationReport } from './report';
import { selfTest } from './selftest';
import { log } from './util';

export { GraduationContext } from './context';
export type { GraduationOptions } from './context';
export { GraduationReport } from './report';

/**
 * Run graduation end-to-end. In stabilization mode this is
 * pre-flight → move → self-test; in `--cleanup` mode it deletes the alpha
 * package. A `graduation-report.md` is always written for human review.
 *
 * Returns an exit code: `2` when the report has unresolved manual follow-up
 * items (including any self-test failure, each of which is recorded as a manual
 * item), `0` when the graduation completed clean. A thrown, unrecoverable error
 * is surfaced as exit `1` by the CLI wrapper, not here.
 */
export function run(options: GraduationOptions, repoRoot?: string): number {
  const ctx = new GraduationContext(options, repoRoot);
  const report = new GraduationReport(ctx.service);

  log.phase(`Graduating ${ctx.alphaPackageName} → aws-cdk-lib/${ctx.service}`);
  if (options.dryRun) {
    log.warn('DRY RUN — no files will be modified');
  }
  log.info('This tool does not touch git — create a branch and review the diff yourself before committing.');

  if (options.cleanup) {
    cleanup(ctx, report);
  } else {
    preflight(ctx, report);
    move(ctx, report);
    selfTest(ctx, report);
  }

  const reportPath = report.writeTo(ctx.repoRoot);
  log.phase('Done');
  log.info(`Review checklist written to ${reportPath}`);

  if (report.hasManualItems) {
    log.warn('There are MANUAL follow-up items in the report — the graduation is not complete until they are resolved.');
    return 2;
  }
  log.ok('Graduation completed. Review the diff and the report before opening the PR.');
  return 0;
}
