import * as os from 'os';
import * as path from 'path';
import * as esbuild from 'esbuild';
import * as fs from 'fs-extra';
import { Attributions } from './_attributions';
import { shell } from './_shell';
import { Violation, ViolationType, ViolationsReport } from './violation';

const DEFAULT_ALLOWED_LICENSES = [
  'Apache-2.0',
  'MIT',
  'BSD-3-Clause',
  'ISC',
  'BSD-2-Clause',
  '0BSD',
];

/**
 * Bundling properties.
 */
export interface BundleProps {

  /**
   * Directory where the package to bundle is located at.
   */
  readonly packageDir: string;

  /**
   * List of entry-points to bundle.
   *
   * @default - the 'main' file as specified in package.json.
   */
  readonly entryPoints?: string[];

  /**
   * Path to attributions file that will be created / validated.
   * This path is relative to the package directory.
   *
   * @default 'THIRD_PARTY_LICENSES'
   */
  readonly attributionsFile?: string;

  /**
   * External packages that cannot be bundled.
   *
   * @default - no external references.
   */
  readonly externals?: Externals;

  /**
   * External resources that need to be embedded in the bundle.
   *
   * These will be copied over to the appropriate paths before packaging.
   */
  readonly resources?: {[src: string]: string};

  /**
   * A list of licenses that are allowed for bundling.
   * If any dependency contains a license not in this list, bundling will fail.
   *
   * @default - Default list
   */
  readonly allowedLicenses?: string[];

  /**
   * Packages matching this regular expression will be excluded from attribution.
   */
  readonly dontAttribute?: string;

  /**
   * Basic sanity check to run against the created bundle.
   *
   * @default - no check.
   */
  readonly test?: string;

  /**
   * Include a sourcemap in the bundle.
   *
   * @default "inline"
   */
  readonly sourcemap?: 'linked' | 'inline' | 'external' | 'both';

  /**
   * Minifies the bundled code.
   *
   * @default false
   */
  readonly minify?: boolean;

  /**
   * Removes whitespace from the code.
   * This is enabled by default when `minify` is used.
   *
   * @default false
   */
  readonly minifyWhitespace?: boolean;

  /**
   * Renames local variables to be shorter.
   * This is enabled by default when `minify` is used.
   *
   * @default false
   */
  readonly minifyIdentifiers?: boolean;

  /**
   * Rewrites syntax to a more compact format.
   * This is enabled by default when `minify` is used.
   *
   * @default false
   */
  readonly minifySyntax?: boolean;
}

/**
 * Options for `Bundle.pack`.
 */
export interface BundlePackOptions {
  /**
   * The target directory to create the package in.
   *
   * @default - the package directory.
   */
  readonly target?: string;
}

export interface BundleValidateOptions {
  /**
   * Automatically fix any (fixable) violations.
   *
   * @default false
   */
  readonly fix?: boolean;
}

/**
 * Package on the local file system.
 */
export interface Package {
  /**
   * Path of the dependency on the local file system.
   */
  readonly path: string;
  /**
   * Dependency name.
   */
  readonly name: string;
  /**
   * Dependency version.
   */
  readonly version: string;
}

/**
 * External packages that cannot be bundled.
 */
export interface Externals {

  /**
   * External packages that should be listed in the `dependencies` section
   * of the manifest.
   */
  readonly dependencies?: readonly string[];

  /**
   * External packages that should be listed in the `optionalDependencies` section
   * of the manifest.
   */
  readonly optionalDependencies?: readonly string[];

}

/**
 * Bundle class to validate and pack nodejs bundles.
 */
export class Bundle {

  private readonly manifest: any;
  private readonly noticePath: string;

  private readonly packageDir: string;
  private readonly entryPoints: Record<string, string>;
  private readonly externals: Externals;
  private readonly resources: {[src: string]: string};
  private readonly allowedLicenses: string[];
  private readonly dontAttribute?: string;
  private readonly test?: string;
  private readonly sourcemap?: 'linked' | 'inline' | 'external' | 'both';
  private readonly minify?: boolean;
  private readonly minifyWhitespace?: boolean;
  private readonly minifyIdentifiers?: boolean;
  private readonly minifySyntax?: boolean;

  private _bundle?: esbuild.BuildResult;
  private _dependencies?: Package[];
  private _dependenciesRoot?: string;

  private _attributions?: Attributions;

  constructor(props: BundleProps) {
    this.packageDir = props.packageDir;
    this.noticePath = props.attributionsFile ?? 'THIRD_PARTY_LICENSES';
    this.manifest = fs.readJsonSync(path.join(this.packageDir, 'package.json'));
    this.externals = props.externals ?? {};
    this.resources = props.resources ?? {};
    this.test = props.test;
    this.allowedLicenses = props.allowedLicenses ?? DEFAULT_ALLOWED_LICENSES;
    this.dontAttribute = props.dontAttribute;
    this.entryPoints = {};
    this.sourcemap = props.sourcemap;
    this.minify = props.minify;
    this.minifyWhitespace = props.minifyWhitespace;
    this.minifyIdentifiers = props.minifyIdentifiers;
    this.minifySyntax = props.minifySyntax;

    const entryPoints = props.entryPoints ?? (this.manifest.main ? [this.manifest.main] : []);

    if (entryPoints.length === 0) {
      throw new Error('Must configure at least 1 entrypoint');
    }

    for (const entrypoint of entryPoints) {
      if (!fs.existsSync(path.join(this.packageDir, entrypoint))) {
        throw new Error(`Unable to locate entrypoint: ${entrypoint}`);
      }
      this.entryPoints[entrypoint.replace('.js', '')] = entrypoint;
    }
  }

  /**
   * Validate the bundle for violations.
   *
   * If `fix` is set to true, this method will return the remaining
   * violations after the fixes were applied.
   *
   * This method never throws. The Caller is responsible for inspecting the
   * returned report and act accordingly.
   */
  public validate(options: BundleValidateOptions = {}): ViolationsReport {

    const fix = options.fix ?? false;

    // first validate
    const circularImports = this.validateCircularImports();
    const resources = this.validateResources();
    const attributions = this.validateAttributions();

    const report = new ViolationsReport([...circularImports, ...resources, ...attributions]);

    if (!fix) {
      return report;
    }

    for (const violation of report.violations) {
      if (violation.fix) {
        violation.fix();
      }
    }

    // return the un fixable violations
    return new ViolationsReport(report.violations.filter(v => !v.fix));
  }

  /**
   * Write the bundle version of the project to a temp directory.
   * This directory is what the tool will end up packing.
   *
   * Returns the temp directory location.
   */
  public write(): string {

    const target = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-write-'));

    // we definitely don't need these directories in the package
    // so no need to copy them over.
    const ignoreDirectories = ['node_modules', '.git'];

    // copy the entire project since we are retaining the original files.
    fs.copySync(this.packageDir, target, { filter: n => !n.split(path.sep).some((p => ignoreDirectories.includes(p))) });

    // clone the original manifest since we are going to
    // to mutate it.
    const manifest = { ...this.manifest };

    // manifest mutations
    this.removeDependencies(manifest);
    this.addExternals(manifest);

    // write artifacts
    this.writeOutputs(target);
    this.writeResources(target);
    this.writeManifest(target, manifest);

    return target;
  }

  /**
   * Write the bundle and create the tarball.
   *
   * Returns the location of the tarball.
   */
  public pack(options: BundlePackOptions = {}): string {

    const target = options.target ?? this.packageDir;

    const report = this.validate();
    if (!report.success) {
      throw new Error(`Unable to pack due to validation errors.\n\n${report.summary}`);
    }

    if (!fs.existsSync(target)) {
      throw new Error(`Target doesnt exist: ${target}`);
    }

    // resolve symlinks.
    const realTarget = fs.realpathSync(target);

    if (!fs.lstatSync(realTarget).isDirectory()) {
      throw new Error(`Target must be a directory: ${target}`);
    }

    console.log('Writing bundle');
    const bundleDir = this.write();
    try {

      if (this.test) {
        const command = `${path.join(bundleDir, this.test)}`;
        console.log(`Running santiy test: ${command}`);
        shell(command, { cwd: bundleDir });
      }

      // create the tarball
      console.log('Packing');
      const tarball = shell('npm pack', { quiet: true, cwd: bundleDir }).trim();
      const dest = path.join(realTarget, tarball);
      fs.copySync(path.join(bundleDir, tarball), dest, { recursive: true });
      return dest;
    } finally {
      fs.removeSync(bundleDir);
    }
  }

  private get bundle(): esbuild.BuildResult {
    if (this._bundle) {
      return this._bundle;
    }
    this._bundle = this.esbuild();
    return this._bundle;
  }

  private get dependencies(): Package[] {
    if (this._dependencies) {
      return this._dependencies;
    }
    const inputs = Object.keys(this.bundle.metafile!.inputs);
    const packages = new Set(Array.from(inputs).map(i => this.closestPackagePath(path.join(this.packageDir, i))));
    this._dependencies = Array.from(packages).map(p => this.createPackage(p)).filter(d => d.name !== undefined && d.name !== this.manifest.name);
    return this._dependencies;
  }

  private get dependenciesRoot(): string {
    if (this._dependenciesRoot) {
      return this._dependenciesRoot;
    }
    const lcp = longestCommonParent(this.dependencies.map(d => d.path));
    this._dependenciesRoot = this.closestPackagePath(lcp);
    return this._dependenciesRoot;
  }

  private get attributions(): Attributions {
    if (this._attributions == null) {
      this._attributions = new Attributions({
        packageDir: this.packageDir,
        packageName: this.manifest.name,
        filePath: this.noticePath,
        dependencies: this.dependencies,
        dependenciesRoot: this.dependenciesRoot,
        exclude: this.dontAttribute,
        allowedLicenses: this.allowedLicenses,
      });
    }
    return this._attributions;
  }

  private findExternalDependencyVersion(name: string): string {

    const versions = new Set<string>();

    // external dependencies will not exist in the dependencies list
    // since esbuild skips over them. but they will exist as a dependency of
    // one of them (or of us)
    for (const pkg of [...this.dependencies, this.createPackage(this.packageDir)]) {
      const manifest = fs.readJSONSync(path.join(pkg.path, 'package.json'));
      const runtime = (manifest.dependencies ?? {})[name];
      const optional = (manifest.optionalDependencies ?? {})[name];

      const pin = (version: string) => (version.startsWith('^') || version.startsWith('~')) ? version.substring(1) : version;

      if (runtime) {
        versions.add(pin(runtime));
      }
      if (optional) {
        versions.add(pin(optional));
      }
    }

    if (versions.size === 0) {
      throw new Error(`Unable to detect version for external dependency: ${name}`);
    }

    if (versions.size > 1) {
      throw new Error(`Multiple versions detected for external dependency: ${name} (${Array.from(versions).join(',')})`);
    }

    return versions.values().next().value;
  }

  private closestPackagePath(fdp: string): string {

    if (fs.existsSync(path.join(fdp, 'package.json'))) {
      return fdp;
    }

    if (path.dirname(fdp) === fdp) {
      throw new Error('Unable to find package manifest');
    }

    return this.closestPackagePath(path.dirname(fdp));
  }

  private createPackage(packageDir: string): Package {
    const manifestPath = path.join(packageDir, 'package.json');
    const manifest = fs.readJSONSync(manifestPath);
    return { path: packageDir, name: manifest.name, version: manifest.version };
  }

  private esbuild(): esbuild.BuildResult {

    const bundle = esbuild.buildSync({
      entryPoints: this.entryPoints,
      bundle: true,
      target: 'node14',
      platform: 'node',
      sourcemap: this.sourcemap ?? 'inline',
      metafile: true,
      minify: this.minify,
      minifyWhitespace: this.minifyWhitespace,
      minifyIdentifiers: this.minifyIdentifiers,
      minifySyntax: this.minifySyntax,
      treeShaking: true,
      absWorkingDir: this.packageDir,
      external: [...(this.externals.dependencies ?? []), ...(this.externals.optionalDependencies ?? [])],
      write: false,
      outdir: this.packageDir,
      allowOverwrite: true,
    });

    if (bundle.warnings.length > 0) {
      // esbuild warnings are usually important, lets try to be strict here.
      // the warnings themselves are printed on screen.
      throw new Error(`Found ${bundle.warnings.length} bundling warnings (See above)`);
    }

    return bundle;
  }

  private validateCircularImports(): Violation[] {
    console.log('Validating circular imports');
    const violations: Violation[] = [];
    const packages = [this.packageDir, ...this.dependencies.map(d => d.path)];
    try {
      // we don't use the programmatic API since it only offers an async API.
      // prefer to stay sync for now since its easier to integrate with other tooling.
      // will offer an async API further down the road.
      const command = `${require.resolve('madge/bin/cli.js')} --json --warning --no-color --no-spinner --circular --extensions js ${packages.join(' ')}`;
      shell(command, { quiet: true });
    } catch (e: any) {
      const imports: string[][] = JSON.parse(e.stdout.toString().trim());
      for (const imp of imports) {
        violations.push({ type: ViolationType.CIRCULAR_IMPORT, message: `${imp.join(' -> ')}` });
      }
    }

    return violations;
  }

  private validateResources(): Violation[] {
    console.log('Validating resources');
    const violations = [];
    for (const [src, _] of Object.entries(this.resources)) {
      if (!fs.existsSync(path.join(this.packageDir, src))) {
        violations.push({
          type: ViolationType.MISSING_RESOURCE,
          message: `Unable to find resource (${src}) relative to the package directory`,
        });
      }
    }
    return violations;
  }

  private validateAttributions(): readonly Violation[] {
    console.log('Validating attributions');
    return this.attributions.validate().violations;
  }

  private addExternals(manifest: any) {

    // external dependencies should be specified as runtime dependencies
    for (const external of this.externals.dependencies ?? []) {
      const version = this.findExternalDependencyVersion(external);
      manifest.dependencies = manifest.dependencies ?? {};
      manifest.dependencies[external] = version;
    }

    // external dependencies should be specified as optional dependencies
    for (const external of this.externals.optionalDependencies ?? []) {
      const version = this.findExternalDependencyVersion(external);
      manifest.optionalDependencies = manifest.optionalDependencies ?? {};
      manifest.optionalDependencies[external] = version;
    }

  }

  private removeDependencies(manifest: any) {
    for (const [d, v] of Object.entries(this.manifest.dependencies)) {
      manifest.devDependencies = manifest.devDependencies ?? {};
      manifest.devDependencies[d] = v;
      delete manifest.dependencies[d];
    }
  }

  private writeOutputs(workDir: string) {
    for (const output of this.bundle.outputFiles ?? []) {
      const out = output.path.replace(this.packageDir, workDir);
      fs.writeFileSync(out, output.contents);
    }
  }

  private writeResources(workdir: string) {
    for (const [src, dst] of Object.entries(this.resources)) {
      const to = path.join(workdir, dst);
      fs.copySync(path.join(this.packageDir, src), to, { recursive: true });
    }
  }

  private writeManifest(workDir: string, manifest: any) {
    fs.writeFileSync(path.join(workDir, 'package.json'), JSON.stringify(manifest, null, 2));
  }
}

function longestCommonParent(paths: string[]) {

  function _longestCommonParent(p1: string, p2: string): string {
    const dirs1 = p1.split(path.sep);
    const dirs2 = p2.split(path.sep);
    const parent = [];
    for (let i = 0; i < Math.min(dirs1.length, dirs2.length); i++) {
      if (dirs1[i] !== dirs2[i]) break;
      parent.push(dirs1[i]);
    }
    return parent.join(path.sep);
  }

  return paths.reduce(_longestCommonParent);
}
