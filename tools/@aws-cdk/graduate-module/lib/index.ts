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
 */
export function run(options: GraduationOptions): number {
  const ctx = new GraduationContext(options);
  const report = new GraduationReport(ctx.service);

  log.phase(`Graduating ${ctx.alphaPackageName} → aws-cdk-lib/${ctx.service}`);
  if (options.dryRun) {
    log.warn('DRY RUN — no files will be modified');
  }
  log.info('This tool does not touch git — create a branch and review the diff yourself before committing.');

  let ok = true;
  if (options.cleanup) {
    cleanup(ctx, report);
  } else {
    preflight(ctx, report);
    move(ctx, report);
    ok = selfTest(ctx, report);
  }

  const reportPath = report.writeTo(ctx.repoRoot);
  log.phase('Done');
  log.info(`Review checklist written to ${reportPath}`);

  if (report.hasManualItems) {
    log.warn('There are MANUAL follow-up items in the report — the graduation is not complete until they are resolved.');
    return 2;
  }
  if (!ok) {
    log.error('Self-test reported failures — see the report.');
    return 1;
  }
  log.ok('Graduation completed. Review the diff and the report before opening the PR.');
  return 0;
}
