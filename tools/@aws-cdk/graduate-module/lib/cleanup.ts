import * as fs from 'fs';
import * as path from 'path';
import type { GraduationContext } from './context';
import type { GraduationReport } from './report';
import { log } from './util';

/**
 * `--cleanup` mode — the follow-up that deletes the alpha package after the
 * stable module has shipped. This mirrors the historical precedent
 * (kinesisfirehose/apigatewayv2/synthetics), where alpha deletion is a separate
 * PR from stabilization. Publishing is driven by the `-alpha` name suffix, so
 * removing the directory is sufficient to stop publication.
 */
export function cleanup(ctx: GraduationContext, report: GraduationReport): void {
  log.phase(`Cleanup — remove alpha package ${ctx.alphaPackageName}`);

  if (!ctx.submoduleExists) {
    throw new Error(
      `refusing to delete the alpha package: the stable submodule packages/aws-cdk-lib/${ctx.service} `
      + 'does not exist. Run stabilization first.',
    );
  }
  if (!fs.existsSync(ctx.alphaDir)) {
    log.ok('alpha package already removed — nothing to do');
    return;
  }

  // Also remove the alpha's custom-resource handler source + config entry, if any.
  if (ctx.hasCustomResources) {
    report.manual('cleanup',
      `Remove the '${ctx.service}-alpha' entry from custom-resources-framework/config.ts and delete `
      + `custom-resource-handlers/lib/${ctx.service}-alpha/.`);
  }

  if (ctx.options.dryRun) {
    log.warn(`--dry-run set: would remove ${path.relative(ctx.repoRoot, ctx.alphaDir)}`);
    return;
  }

  fs.rmSync(ctx.alphaDir, { recursive: true, force: true });
  log.ok(`removed ${path.relative(ctx.repoRoot, ctx.alphaDir)}`);
  report.review('cleanup', `deleted the alpha package; verify no remaining references and that npm-deprecation of ${ctx.alphaPackageName} is done out-of-band`);
}
