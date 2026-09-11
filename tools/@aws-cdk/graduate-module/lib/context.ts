import * as fs from 'fs';
import * as path from 'path';

export interface GraduationOptions {
  /**
   * The service module, in any accepted form: `glue`, `aws-glue`,
   * `aws-glue-alpha`, or `@aws-cdk/aws-glue-alpha`. Normalized to `aws-glue`.
   */
  readonly service: string;
  /** `--cleanup`: run the alpha-deletion follow-up instead of the stabilization move. */
  readonly cleanup: boolean;
  /** `--strict`: fail (rather than warn) when deprecated APIs remain. */
  readonly strict: boolean;
  /** `--dry-run`: perform read-only analysis and produce the report without mutating files. */
  readonly dryRun: boolean;
}

/**
 * Resolves every path the graduation touches and normalizes the service name.
 * All transforms take a `GraduationContext` so path logic lives in exactly one
 * place.
 */
export class GraduationContext {
  /** Repo root, e.g. `/path/to/aws-cdk`. */
  readonly repoRoot: string;
  /** Normalized hyphenated service, e.g. `aws-glue`. */
  readonly service: string;
  /** Underscored service used by jsii/rosetta, e.g. `aws_glue`. */
  readonly serviceUnderscore: string;
  /** Basename of the generated L1 file, e.g. `glue` (for `glue.generated.ts`). */
  readonly cfnBasename: string;
  /** Full alpha package name, e.g. `@aws-cdk/aws-glue-alpha`. */
  readonly alphaPackageName: string;

  /** `packages/@aws-cdk/aws-glue-alpha`. */
  readonly alphaDir: string;
  /** `packages/aws-cdk-lib`. */
  readonly libDir: string;
  /** `packages/aws-cdk-lib/aws-glue` — the target submodule (usually pre-exists with L1s). */
  readonly submoduleDir: string;
  /** `packages/aws-cdk-lib/aws-glue/lib`. */
  readonly submoduleLibDir: string;
  /** `packages/@aws-cdk-testing/framework-integ` — the integ package root (for scoping eslint). */
  readonly frameworkIntegDir: string;
  /** `packages/@aws-cdk-testing/framework-integ/test/aws-glue/test`. */
  readonly frameworkIntegTestDir: string;
  /** Absolute path to the repo's eslint binary. */
  readonly eslintBin: string;
  /** `packages/aws-cdk-lib/rosetta/aws_glue`. */
  readonly rosettaDir: string;
  /** `packages/@aws-cdk/custom-resource-handlers`. */
  readonly crHandlersDir: string;

  readonly options: GraduationOptions;

  constructor(options: GraduationOptions, repoRoot?: string) {
    this.options = options;
    this.repoRoot = repoRoot ?? findRepoRoot();

    this.service = normalizeService(options.service);
    this.serviceUnderscore = this.service.replace(/-/g, '_');
    this.cfnBasename = this.service.replace(/^aws-/, '');
    this.alphaPackageName = `@aws-cdk/${this.service}-alpha`;

    this.alphaDir = path.join(this.repoRoot, 'packages', '@aws-cdk', `${this.service}-alpha`);
    this.libDir = path.join(this.repoRoot, 'packages', 'aws-cdk-lib');
    this.submoduleDir = path.join(this.libDir, this.service);
    this.submoduleLibDir = path.join(this.submoduleDir, 'lib');
    this.frameworkIntegDir = path.join(this.repoRoot, 'packages', '@aws-cdk-testing', 'framework-integ');
    this.frameworkIntegTestDir = path.join(this.frameworkIntegDir, 'test', this.service, 'test');
    this.eslintBin = path.join(this.repoRoot, 'node_modules', '.bin', 'eslint');
    this.rosettaDir = path.join(this.libDir, 'rosetta', this.serviceUnderscore);
    this.crHandlersDir = path.join(this.repoRoot, 'packages', '@aws-cdk', 'custom-resource-handlers');
  }

  /** True if the target submodule already exists in aws-cdk-lib (the common case — L1s live there). */
  get submoduleExists(): boolean {
    return fs.existsSync(this.submoduleDir);
  }

  /** True if the alpha ships custom resources (registered under an `<service>-alpha` key). */
  get hasCustomResources(): boolean {
    const config = path.join(this.crHandlersDir, 'lib', 'custom-resources-framework', 'config.ts');
    if (!fs.existsSync(config)) {
      return false;
    }
    return fs.readFileSync(config, 'utf-8').includes(`'${this.service}-alpha'`);
  }
}

/** Accept `glue`, `aws-glue`, `aws-glue-alpha`, or `@aws-cdk/aws-glue-alpha`; return `aws-glue`. */
export function normalizeService(input: string): string {
  let s = input.trim();
  s = s.replace(/^@aws-cdk\//, '');
  s = s.replace(/-alpha$/, '');
  if (!s.startsWith('aws-')) {
    s = `aws-${s}`;
  }
  return s;
}

/** Walk up from this file until we find `packages/aws-cdk-lib`, identifying the monorepo root. */
export function findRepoRoot(start: string = __dirname): string {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'packages', 'aws-cdk-lib', 'package.json'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error('could not locate the aws-cdk repo root (no packages/aws-cdk-lib found above this tool)');
}
