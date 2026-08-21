import * as path from 'path';
import type { GraduationContext } from './context';
import type { GraduationReport } from './report';
import * as t from './transforms';
import { log } from './util';

/**
 * Phase 2 — the move. Ordering matters: sources are copied first so the import
 * rewrite operates on them, then tests, then the standalone config merges.
 */
export function move(ctx: GraduationContext, report: GraduationReport): void {
  log.phase('Phase 2 — Move into aws-cdk-lib');

  if (ctx.options.dryRun) {
    log.warn('--dry-run set: analysis only, no files will be moved');
    // Pre-flight already populated the report with everything a maintainer needs
    // to preview; the mutating steps below are skipped.
    return;
  }

  const copied = t.copySources(ctx, report);
  t.rewriteImports(ctx, copied, report);
  t.mergeBarrel(ctx, report);
  // Reconcile import order (and other autofixables) with aws-cdk-lib's lint
  // config; the barrel index is included since its exports may need reordering.
  t.lintFix(ctx, [...copied, path.join(ctx.submoduleLibDir, 'index.ts')], ctx.libDir, report);
  t.copyTests(ctx, report);

  t.mergeAwslint(ctx, report);
  t.copyGrants(ctx, report);
  t.copyRosetta(ctx, report);
  t.graduateReadme(ctx, report);
  t.removeExampleDependency(ctx, report);

  t.migrateCustomResources(ctx, report);
  t.ensureRegistration(ctx, report);
  t.sweepReferences(ctx, report);
}
