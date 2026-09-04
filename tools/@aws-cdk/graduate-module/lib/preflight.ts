import * as fs from 'fs';
import * as path from 'path';
import type { GraduationContext } from './context';
import type { GraduationReport } from './report';
import { log, walk } from './util';

/**
 * Phase 1 — read-only analysis. Surfaces everything a maintainer needs to know
 * before the move, and hard-aborts on conditions that make graduation unsafe.
 */
export function preflight(ctx: GraduationContext, report: GraduationReport): void {
  log.phase('Phase 1 — Pre-flight checks');

  if (!fs.existsSync(ctx.alphaDir)) {
    throw new Error(`alpha package not found at ${ctx.alphaDir}`);
  }

  detectDeprecatedApis(ctx, report);
  detectUnionTypes(ctx, report);
  probeTargetState(ctx, report);
  detectCustomResources(ctx, report);
}

/** Warn (or, under --strict, block) when `@deprecated` APIs remain — graduation is the moment to shed them. */
function detectDeprecatedApis(ctx: GraduationContext, report: GraduationReport): void {
  const libFiles = walk(path.join(ctx.alphaDir, 'lib'), (f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));
  const hits: string[] = [];
  for (const file of libFiles) {
    const src = fs.readFileSync(file, 'utf-8');
    if (/@deprecated/.test(src)) {
      const count = (src.match(/@deprecated/g) ?? []).length;
      hits.push(`${path.relative(ctx.repoRoot, file)} (${count})`);
    }
  }

  if (hits.length === 0) {
    log.ok('no @deprecated APIs found');
    return;
  }

  const msg = `found @deprecated APIs in ${hits.length} file(s): ${hits.join(', ')}`;
  if (ctx.options.strict) {
    throw new Error(`${msg}. Remove deprecated APIs before graduating, or drop --strict to proceed with a warning.`);
  }
  log.warn(msg);
  report.warn('deprecated', `${msg}. Consider removing these as part of graduation.`);
}

/** jsii forbids TS union types; flag any so the maintainer can refactor to factory methods / separate props. */
function detectUnionTypes(ctx: GraduationContext, report: GraduationReport): void {
  // Heuristic scan; the self-test's jsii compile is the authoritative check.
  const libFiles = walk(path.join(ctx.alphaDir, 'lib'), (f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));
  for (const file of libFiles) {
    const lines = fs.readFileSync(file, 'utf-8').split('\n');
    lines.forEach((line, i) => {
      // Property/param declarations with a bare `A | B` union of named types.
      if (/:\s*[A-Z]\w+\s*\|\s*[A-Z]\w+/.test(line) && !line.includes('//')) {
        report.review('union-types', `possible union type at line ${i + 1}: ${line.trim()}`, path.relative(ctx.repoRoot, file));
      }
    });
  }
}

/** Report whether the target submodule already exists (merge) or must be created. */
function probeTargetState(ctx: GraduationContext, report: GraduationReport): void {
  if (ctx.submoduleExists) {
    log.ok(`target submodule exists at packages/aws-cdk-lib/${ctx.service} — will MERGE L2 sources into it`);
    report.info('target', `submodule packages/aws-cdk-lib/${ctx.service} already exists (L1s present); merging L2 sources in`);
  } else {
    log.warn(`target submodule packages/aws-cdk-lib/${ctx.service} does not exist — will CREATE it (uncommon)`);
    report.review('target', 'submodule did not exist; created from scratch. Verify scope-map.json / L1 generation.');
  }
}

function detectCustomResources(ctx: GraduationContext, report: GraduationReport): void {
  if (ctx.hasCustomResources) {
    log.warn('module ships custom resources — the custom-resource sub-flow will run and needs careful review');
    report.review('custom-resources', 'module has custom resources; handler source + config keys were migrated. Verify import paths and that the alpha airlift script/dev-dep were removed.');
  } else {
    log.ok('no custom resources detected');
  }
}
