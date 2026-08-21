import * as fs from 'fs';
import * as path from 'path';
import type { SourceFile } from 'ts-morph';
import { Project, SyntaxKind } from 'ts-morph';
import type { GraduationContext } from './context';
import type { GraduationReport } from './report';
import { copyFile, exec, log, moduleSpecifier, walk } from './util';

const rel = (ctx: GraduationContext, p: string) => path.relative(ctx.repoRoot, p);

/**
 * Run the repo's own `eslint --fix` on moved files, then re-lint to capture any
 * residual issues the autofixer could not resolve. This is essential because
 * the alpha and aws-cdk-lib use different `import/order` configurations, so even
 * a correct path rewrite leaves imports in an order aws-cdk-lib's lint rejects.
 * `--fix` reconciles the vast majority; the remainder is flagged for review.
 */
export function lintFix(ctx: GraduationContext, files: string[], cwd: string, report: GraduationReport): void {
  const targets = files.filter((f) =>
    fs.existsSync(f) && f.endsWith('.ts') && !f.endsWith('.d.ts') && !f.endsWith('.generated.ts'));
  if (targets.length === 0) {
    return;
  }
  if (!fs.existsSync(ctx.eslintBin)) {
    report.manual('lint', `eslint not found at ${rel(ctx, ctx.eslintBin)} — run \`yarn lint --fix\` manually in ${rel(ctx, cwd)}`);
    return;
  }

  exec(ctx.eslintBin, ['--fix', ...targets], { cwd, allowFailure: true });

  const check = exec(ctx.eslintBin, [...targets], { cwd, allowFailure: true });
  if (check.status === 0) {
    log.step(`eslint --fix clean for ${targets.length} file(s) in ${rel(ctx, cwd)}`);
    report.review('lint', `ran eslint --fix on ${targets.length} moved file(s) in ${rel(ctx, cwd)}`);
  } else {
    const summary = check.stdout.trim().split('\n').filter((l) => /\berror\b|\bwarning\b/.test(l)).slice(0, 20).join('; ');
    log.warn('eslint left residual issues after --fix — see report');
    report.manual('lint', `eslint could not auto-fix everything in ${rel(ctx, cwd)}: ${summary}`);
  }
}

/**
 * Record a review note when a copy is about to overwrite a pre-existing file in
 * the target. Unlike source files (which hard-fail on collision), README /
 * rosetta / grants are intentionally replaced — but a silent clobber of a
 * tracked file should still surface in the review checklist. Call before writing.
 */
function noteOverwrite(ctx: GraduationContext, report: GraduationReport, step: string, dest: string): void {
  if (fs.existsSync(dest)) {
    report.review(step, 'overwrote a pre-existing file — verify the replacement is intended', rel(ctx, dest));
  }
}

/** Replace references to the alpha package (`@aws-cdk/aws-<svc>-alpha`) with the stable subpath. */
function rewriteAlphaPackageRefs(ctx: GraduationContext, text: string): string {
  const escaped = ctx.alphaPackageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'g'), `aws-cdk-lib/${ctx.service}`);
}

/**
 * Copy the alpha's L2 source into the target submodule's `lib/`, preserving the
 * directory structure. Skips generated L1s (which already live in the submodule)
 * and `index.ts` (merged separately). Returns the list of copied files so the
 * import-rewrite pass can operate on exactly the moved sources.
 */
export function copySources(ctx: GraduationContext, report: GraduationReport): string[] {
  const alphaLib = path.join(ctx.alphaDir, 'lib');
  const sources = walk(alphaLib, (f) =>
    f.endsWith('.ts')
    && !f.endsWith('.d.ts')
    && !f.endsWith('.generated.ts')
    && path.basename(f) !== 'index.ts');

  const copied: string[] = [];
  for (const src of sources) {
    const relPath = path.relative(alphaLib, src);
    const dest = path.join(ctx.submoduleLibDir, relPath);
    if (fs.existsSync(dest)) {
      // A same-named file already exists in the stable submodule — never overwrite.
      throw new Error(`collision: ${rel(ctx, dest)} already exists. Resolve manually before graduating.`);
    }
    copyFile(src, dest);
    copied.push(dest);
  }
  log.step(`copied ${copied.length} source file(s) into ${rel(ctx, ctx.submoduleLibDir)}`);
  report.review('sources', `copied ${copied.length} L2 source file(s) from the alpha module`);
  return copied;
}

/**
 * Rewrite `aws-cdk-lib` package imports into the relative imports required
 * inside the monorepo. This is the highest-risk transform, so every rewrite is
 * logged to the report and anything referencing another alpha package is flagged
 * as a manual item rather than guessed at.
 */
export function rewriteImports(ctx: GraduationContext, files: string[], report: GraduationReport): void {
  if (files.length === 0) {
    return;
  }
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const generatedTarget = path.join(ctx.submoduleLibDir, `${ctx.cfnBasename}.generated`);

  // Pass 1 (AST): rewrite import/export module specifiers via ts-morph. Routine
  // rewrites are reported as a single per-file summary so the review section
  // stays readable. Bare `aws-cdk-lib` → core rewrites are a heuristic, so we
  // additionally emit ONE global caveat noting how many files were affected.
  const bareFiles = new Set<string>();
  for (const file of files) {
    const sourceFile = project.addSourceFileAtPath(file);
    let changed = false;
    let routine = 0;

    for (const decl of [...sourceFile.getImportDeclarations(), ...sourceFile.getExportDeclarations()]) {
      const spec = decl.getModuleSpecifierValue();
      if (!spec) {
        continue;
      }

      // A dependency on another alpha module cannot survive in aws-cdk-lib.
      if (/^@aws-cdk\/aws-.*-alpha/.test(spec)) {
        report.manual('imports', `depends on another alpha package '${spec}' — must be resolved before graduation`, rel(ctx, file));
        continue;
      }

      let target: string | undefined;
      if (spec === 'aws-cdk-lib') {
        target = path.join(ctx.libDir, 'core');
        bareFiles.add(rel(ctx, file));
      } else if (spec.startsWith('aws-cdk-lib/')) {
        const sub = spec.slice('aws-cdk-lib/'.length);
        target = sub === ctx.service ? generatedTarget : path.join(ctx.libDir, sub);
      }

      if (target) {
        decl.setModuleSpecifier(moduleSpecifier(file, target));
        changed = true;
        routine++;
      }
    }

    if (routine > 0) {
      report.review('imports', `rewrote ${routine} aws-cdk-lib import(s) to relative form`, rel(ctx, file));
    }
    if (changed) {
      sourceFile.saveSync();
    }
  }

  if (bareFiles.size > 0) {
    report.review('imports', `remapped bare 'aws-cdk-lib' root imports to core in ${bareFiles.size} file(s); spot-check that those symbols actually live in core`);
  }

  // Pass 2 (text): custom-resource handler imports point at the airlifted alpha
  // dist path; retarget them at aws-cdk-lib's airlifted (non-alpha) location.
  // Done as a plain text pass so it composes cleanly with the AST save above.
  const alphaCrPath = `../custom-resource-handlers/dist/${ctx.service}-alpha/`;
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf-8');
    if (!text.includes(alphaCrPath)) {
      continue;
    }
    const libCrDir = path.join(ctx.libDir, 'custom-resource-handlers', 'dist', ctx.service);
    const newPrefix = moduleSpecifier(file, libCrDir) + '/';
    fs.writeFileSync(file, text.split(alphaCrPath).join(newPrefix));
    report.review('imports', `retargeted custom-resource handler import to '${newPrefix}'`, rel(ctx, file));
  }

  log.step('rewrote aws-cdk-lib imports to relative form (see report)');
}

/** Merge the alpha `index.ts` barrel exports into the submodule's existing `lib/index.ts`. */
export function mergeBarrel(ctx: GraduationContext, report: GraduationReport): void {
  const alphaIndex = path.join(ctx.alphaDir, 'lib', 'index.ts');
  const targetIndex = path.join(ctx.submoduleLibDir, 'index.ts');
  if (!fs.existsSync(alphaIndex)) {
    return;
  }
  const existing = fs.existsSync(targetIndex) ? fs.readFileSync(targetIndex, 'utf-8') : '';
  const existingLines = new Set(existing.split('\n').map((l) => l.trim()));

  const toAdd = fs.readFileSync(alphaIndex, 'utf-8')
    .split('\n')
    .filter((l) => /^export\s/.test(l.trim()))
    .filter((l) => !existingLines.has(l.trim()));

  if (toAdd.length === 0) {
    return;
  }
  const merged = `${existing.trimEnd()}\n${toAdd.join('\n')}\n`;
  fs.writeFileSync(targetIndex, merged);
  log.step(`merged ${toAdd.length} export(s) into ${rel(ctx, targetIndex)}`);
  report.review('barrel', `added ${toAdd.length} export line(s) to lib/index.ts`);
}

/**
 * Copy the alpha `test/` tree to its destinations: unit tests + test helpers +
 * asset fixtures (e.g. `job-script/`) into the submodule's `test/`, and
 * integration tests (`integ.*`) into framework-integ. Copy-only: the alpha
 * package must remain intact and buildable until the separate `--cleanup` run
 * deletes it wholesale.
 */
export function copyTests(ctx: GraduationContext, report: GraduationReport): void {
  const alphaTest = path.join(ctx.alphaDir, 'test');
  if (!fs.existsSync(alphaTest)) {
    return;
  }

  const submoduleTestDir = path.join(ctx.submoduleDir, 'test');
  const unitFiles: string[] = []; // .test.ts + helper .ts — import-rewritten and linted
  const integFiles: string[] = [];
  let fixtures = 0; // fixture dirs/files copied verbatim (e.g. job-script/)

  for (const entry of fs.readdirSync(alphaTest, { withFileTypes: true })) {
    const name = entry.name;
    const full = path.join(alphaTest, name);

    if (name.startsWith('integ.')) {
      // Integ source + snapshot dir go to framework-integ; compiled .js/.d.ts are skipped.
      if (entry.isDirectory() && name.endsWith('.js.snapshot')) {
        fs.cpSync(full, path.join(ctx.frameworkIntegTestDir, name), { recursive: true });
      } else if (name.endsWith('.ts') && !name.endsWith('.d.ts')) {
        const dest = path.join(ctx.frameworkIntegTestDir, name);
        copyFile(full, dest);
        rewriteIntegImports(ctx, dest);
        integFiles.push(dest);
      }
      continue;
    }

    // Every non-integ entry lives alongside the unit tests in the submodule.
    const dest = path.join(submoduleTestDir, name);
    if (entry.isDirectory()) {
      // Asset fixture directory (e.g. job-script, module) — copy verbatim.
      fs.cpSync(full, dest, { recursive: true });
      fixtures++;
    } else if (name.endsWith('.d.ts') || name.endsWith('.js')) {
      // Compiled artifact — skip.
      continue;
    } else if (name.endsWith('.ts')) {
      // Unit test or test helper — import-rewritten + linted below.
      if (fs.existsSync(dest)) {
        throw new Error(`collision: test file ${rel(ctx, dest)} already exists.`);
      }
      copyFile(full, dest);
      unitFiles.push(dest);
    } else {
      // Asset fixture file (e.g. .py, .jar, .json) — copy verbatim.
      copyFile(full, dest);
      fixtures++;
    }
  }

  // Unit tests live inside aws-cdk-lib now, so their aws-cdk-lib imports need
  // the same relative rewrite as the sources; `../lib` references remain valid.
  rewriteImports(ctx, unitFiles, report);
  // Fix cwd-relative asset paths that break under aws-cdk-lib's test cwd.
  rewriteTestAssetPaths(ctx, unitFiles, report);

  // Normalize import order to each destination package's lint config.
  lintFix(ctx, unitFiles, ctx.libDir, report);
  lintFix(ctx, integFiles, ctx.frameworkIntegDir, report);

  log.step(`copied ${unitFiles.length} test file(s) + ${fixtures} fixture(s) to submodule/test, ${integFiles.length} integ test(s) to framework-integ`);
  report.review('tests', `copied unit tests + ${fixtures} fixture(s)/helper(s) into packages/aws-cdk-lib/${ctx.service}/test; integ tests into framework-integ`);
}

/**
 * Rewrite cwd-relative asset paths in copied test files to be __dirname-relative.
 * In the alpha package, tests run with cwd = the alpha package root, so
 * `Code.fromAsset('test/x')` resolves to `<pkg>/test/x`. In aws-cdk-lib, tests
 * run with cwd = the aws-cdk-lib package root (not the submodule), so a bare
 * `test/...` path no longer resolves. `path.join(__dirname, 'x')` is
 * cwd-independent and matches the aws-cdk-lib convention; fixtures are copied
 * alongside the tests, so `__dirname` points at the right place.
 */
export function rewriteTestAssetPaths(ctx: GraduationContext, files: string[], report: GraduationReport): void {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  for (const file of files) {
    if (!fs.existsSync(file)) {
      continue;
    }
    const sourceFile = project.addSourceFileAtPath(file);
    let changed = false;

    for (const literal of sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral)) {
      const value = literal.getLiteralValue();
      // Only obvious cwd-relative fixture paths under the package `test/` dir.
      if (!value.startsWith('test/')) {
        continue;
      }
      const rest = value.slice('test/'.length);
      // aws-cdk-lib's @cdklabs/no-invalid-path lint rule requires each path
      // segment to be a separate argument, so split on '/'.
      const segments = rest.split('/').map((s) => JSON.stringify(s)).join(', ');
      literal.replaceWithText(`path.join(__dirname, ${segments})`);
      changed = true;
      report.review('tests', `rewrote cwd-relative asset path '${value}' → path.join(__dirname, ${segments})`, rel(ctx, file));
    }

    if (changed) {
      ensurePathImport(sourceFile);
      sourceFile.saveSync();
    }
  }
}

/** Ensure `import * as path from 'path'` is present (added by the asset-path rewrite). */
function ensurePathImport(sourceFile: SourceFile): void {
  const hasPath = sourceFile.getImportDeclarations().some((d) => {
    const spec = d.getModuleSpecifierValue();
    return (spec === 'path' || spec === 'node:path') && d.getNamespaceImport()?.getText() === 'path';
  });
  if (!hasPath) {
    sourceFile.insertImportDeclaration(0, { namespaceImport: 'path', moduleSpecifier: 'path' });
  }
}

/** Integ tests import from the published subpath, not relative paths. */
export function rewriteIntegImports(ctx: GraduationContext, file: string): void {
  let text = fs.readFileSync(file, 'utf-8');
  const target = `aws-cdk-lib/${ctx.service}`;
  // Escape every regex metacharacter (including backslash) so the service name,
  // which originates from a command-line argument, cannot alter the pattern.
  const escapedAlpha = ctx.alphaPackageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  text = text.replace(/from ['"]\.\.\/lib['"]/g, `from '${target}'`);
  text = text.replace(new RegExp(`from ['"]${escapedAlpha}['"]`, 'g'), `from '${target}'`);
  fs.writeFileSync(file, text);
}

/** Merge the alpha's awslint exclusions into aws-cdk-lib's, rewriting the namespace prefix. */
export function mergeAwslint(ctx: GraduationContext, report: GraduationReport): void {
  const alphaFile = path.join(ctx.alphaDir, 'awslint.json');
  const libFile = path.join(ctx.libDir, 'awslint.json');
  if (!fs.existsSync(alphaFile)) {
    return;
  }

  const alpha = JSON.parse(fs.readFileSync(alphaFile, 'utf-8')) as { exclude?: string[] };
  const lib = JSON.parse(fs.readFileSync(libFile, 'utf-8')) as { exclude?: string[] };
  const libExclude = lib.exclude ?? [];
  const existing = new Set(libExclude);

  const alphaPrefix = `${ctx.alphaPackageName}.`;
  const libPrefix = `aws-cdk-lib.${ctx.serviceUnderscore}.`;
  let added = 0;

  for (const entry of alpha.exclude ?? []) {
    const colon = entry.indexOf(':');
    if (colon < 0) {
      continue;
    }
    const rule = entry.slice(0, colon);
    let apiPath = entry.slice(colon + 1);
    // Entries referencing the alpha package are remapped; cross-module
    // `aws-cdk-lib.aws_*` references are carried over unchanged.
    if (apiPath.startsWith(alphaPrefix)) {
      apiPath = libPrefix + apiPath.slice(alphaPrefix.length);
    }
    const rewritten = `${rule}:${apiPath}`;
    if (!existing.has(rewritten)) {
      libExclude.push(rewritten);
      existing.add(rewritten);
      added++;
    }
  }

  lib.exclude = libExclude;
  fs.writeFileSync(libFile, JSON.stringify(lib, null, 2) + '\n');
  log.step(`merged ${added} awslint exclusion(s) into ${rel(ctx, libFile)}`);
  report.review('awslint', `merged ${added} exclusion(s); prefix '${alphaPrefix}' → '${libPrefix}'`);
}

/** Copy grants.json unchanged; spec2cdk consumes it via its `isStable` branch. */
export function copyGrants(ctx: GraduationContext, report: GraduationReport): void {
  const src = path.join(ctx.alphaDir, 'grants.json');
  if (!fs.existsSync(src)) {
    return;
  }
  const dest = path.join(ctx.submoduleDir, 'grants.json');
  noteOverwrite(ctx, report, 'grants', dest);
  copyFile(src, dest);
  log.step(`copied grants.json to ${rel(ctx, dest)}`);
  report.review('grants', 'copied grants.json into the submodule; re-run codegen to regenerate the *Grants classes');
}

/** Copy rosetta fixtures into aws-cdk-lib/rosetta/<aws_service>/. */
export function copyRosetta(ctx: GraduationContext, report: GraduationReport): void {
  const src = path.join(ctx.alphaDir, 'rosetta');
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(ctx.rosettaDir, { recursive: true });
  let rewrote = 0;
  for (const entry of fs.readdirSync(src)) {
    const dest = path.join(ctx.rosettaDir, entry);
    noteOverwrite(ctx, report, 'rosetta', dest);
    copyFile(path.join(src, entry), dest);
    // Fixtures import the module under test; the alpha import must become the
    // stable subpath or rosetta cannot resolve it (the alpha dep is also being
    // removed from exampleDependencies).
    const text = fs.readFileSync(dest, 'utf-8');
    const rewritten = rewriteAlphaPackageRefs(ctx, text);
    if (rewritten !== text) {
      fs.writeFileSync(dest, rewritten);
      rewrote++;
    }
  }
  log.step(`copied rosetta fixtures to ${rel(ctx, ctx.rosettaDir)} (${rewrote} rewritten)`);
  report.review('rosetta', `copied rosetta fixtures; rewrote alpha imports in ${rewrote} fixture(s) to aws-cdk-lib/${ctx.service}`);
}

/** Copy the README, stripping the experimental/developer-preview stability banner. */
export function graduateReadme(ctx: GraduationContext, report: GraduationReport): void {
  const src = path.join(ctx.alphaDir, 'README.md');
  if (!fs.existsSync(src)) {
    return;
  }
  let text = fs.readFileSync(src, 'utf-8');
  // Match on the comment markers, since the badge/body differs across variants.
  const banner = /<!--BEGIN STABILITY BANNER-->[\s\S]*?<!--END STABILITY BANNER-->\n?/;
  if (banner.test(text)) {
    text = text.replace(banner, '');
    report.review('readme', 'removed the stability banner block');
  } else {
    report.warn('readme', 'no stability banner found — verify the README is already stable-ready');
  }
  // README code examples that import the alpha package directly must be
  // retargeted at the stable subpath so rosetta can compile them.
  const retargeted = rewriteAlphaPackageRefs(ctx, text);
  if (retargeted !== text) {
    text = retargeted;
    report.review('readme', `rewrote alpha package imports in README to aws-cdk-lib/${ctx.service}`);
  }
  const readmeDest = path.join(ctx.submoduleDir, 'README.md');
  noteOverwrite(ctx, report, 'readme', readmeDest);
  fs.writeFileSync(readmeDest, text);
  log.step(`copied README (banner stripped) to ${rel(ctx, ctx.submoduleDir)}/README.md`);
}

/** Drop the alpha module from aws-cdk-lib's rosetta exampleDependencies, if present. */
export function removeExampleDependency(ctx: GraduationContext, report: GraduationReport): void {
  const pkgFile = path.join(ctx.libDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
  const deps = pkg?.jsiiRosetta?.exampleDependencies;
  if (deps && deps[ctx.alphaPackageName] !== undefined) {
    delete deps[ctx.alphaPackageName];
    fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
    log.step(`removed ${ctx.alphaPackageName} from jsiiRosetta.exampleDependencies`);
    report.review('rosetta', `removed '${ctx.alphaPackageName}' from exampleDependencies`);
  }
}

/**
 * Custom-resource migration. Copies the handler source into aws-cdk-lib's
 * central location under a non-alpha key so cdk-lib's global airlift picks it
 * up, while leaving the alpha entry intact (so the alpha still builds until the
 * cleanup PR). The `config.ts` registry edit is recorded as a manual step —
 * it's a TS object literal edit that must not be guessed at.
 */
export function migrateCustomResources(ctx: GraduationContext, report: GraduationReport): void {
  if (!ctx.hasCustomResources) {
    return;
  }
  const alphaHandlerDir = path.join(ctx.crHandlersDir, 'lib', `${ctx.service}-alpha`);
  const libHandlerDir = path.join(ctx.crHandlersDir, 'lib', ctx.service);

  if (fs.existsSync(alphaHandlerDir) && !fs.existsSync(libHandlerDir)) {
    fs.cpSync(alphaHandlerDir, libHandlerDir, { recursive: true });
    log.step(`copied CR handler source to ${rel(ctx, libHandlerDir)}`);
    report.review('custom-resources', `copied handler source to lib/${ctx.service} (alpha copy left in place until cleanup)`);
  }

  report.manual('custom-resources',
    `Add a '${ctx.service}' entry to custom-resources-framework/config.ts mirroring the `
    + `'${ctx.service}-alpha' entry, with sourceCode paths pointing at lib/${ctx.service}/. `
    + 'Then run the custom-resource-handlers build and verify aws-cdk-lib\'s airlift produces '
    + `custom-resource-handlers/dist/${ctx.service}/.`);
}

/**
 * Ensure the submodule is registered in aws-cdk-lib's `exports` map and top-level
 * `index.ts`. When the submodule pre-existed (the common case) these are already
 * present. When missing, we record running `yarn gen` as a manual step rather
 * than auto-running the full-repo L1 regenerator here.
 */
export function ensureRegistration(ctx: GraduationContext, report: GraduationReport): void {
  const pkg = JSON.parse(fs.readFileSync(path.join(ctx.libDir, 'package.json'), 'utf-8'));
  const hasExport = pkg?.exports?.[`./${ctx.service}`] !== undefined;
  const indexText = fs.readFileSync(path.join(ctx.libDir, 'index.ts'), 'utf-8');
  const hasIndex = indexText.includes(`export * as ${ctx.serviceUnderscore} from './${ctx.service}'`);

  if (hasExport && hasIndex) {
    log.ok('submodule already registered in exports + index.ts');
    return;
  }
  report.manual('registration',
    `Submodule not fully registered (exports: ${hasExport}, index.ts: ${hasIndex}). `
    + 'Run `yarn gen` in packages/aws-cdk-lib to add the exports entry and top-level index.ts line.');
}

/** Scan the repo for stray references to the alpha package (docs, etc.). */
export function sweepReferences(ctx: GraduationContext, report: GraduationReport): void {
  const skip = new Set(['node_modules', '.git', 'dist', 'coverage']);
  const hits: string[] = [];
  const scan = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) {
        continue;
      }
      const full = path.join(dir, entry.name);
      if (full.startsWith(ctx.alphaDir)) {
        continue; // The alpha package itself is expected to reference itself.
      }
      if (entry.isDirectory()) {
        scan(full);
      } else if (/\.(md|ts)$/.test(entry.name)) {
        try {
          if (fs.readFileSync(full, 'utf-8').includes(ctx.alphaPackageName)) {
            hits.push(rel(ctx, full));
          }
        } catch { /* unreadable file — ignore */ }
      }
    }
  };
  // Scope the sweep to docs + package sources to keep it fast.
  for (const root of ['docs', 'README.md']) {
    const p = path.join(ctx.repoRoot, root);
    if (!fs.existsSync(p)) {
      continue;
    }
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (fs.readFileSync(p, 'utf-8').includes(ctx.alphaPackageName)) {
      hits.push(rel(ctx, p));
    }
  }
  if (hits.length > 0) {
    report.review('references', `found ${hits.length} doc reference(s) to ${ctx.alphaPackageName}: ${hits.join(', ')}`);
  }
}
