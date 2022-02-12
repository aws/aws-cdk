import * as os from 'os';
import * as path from 'path';
import * as esbuild from 'esbuild';
import * as fs from 'fs-extra';
import { Dependency, Notice } from './_notice';
import { shell } from './shell';
import { Violation, ViolationType, ViolationsReport } from './violation';

/**
 * Bundling properties.
 */
export interface BundleProps {

  /**
   * Directory where the package to bundle is located at.
   */
  readonly packageDir: string;

  /**
   * List of entrypoints to bundle.
   */
  readonly entrypoints: string[];

  /**
   * Copyright string used when generating the NOTICE file.
   */
  readonly copyright: string;

  /**
   * External packages that cannot be bundled.
   *
   * These will remain a runtime dependency of the package.
   *
   * @default - no external references.
   */
  readonly externals?: string[];

  /**
   * External resources that need to be embedded in the bundle.
   *
   * These will be copied over to the appropriate paths before packaging.
   */
  readonly resources?: {[src: string]: string};

  /**
   * A list of licenses that are valid for bundling.
   * If any dependency contains a license not in this list, bundling will fail.
   *
   * @default - Default list
   */
  readonly licenses?: string[];

  /**
   * Packages matching this pattern will be excluded from attribution.
   */
  readonly dontAttribute?: string;

  /**
   * Basic sanity check to run against the created bundle.
   *
   * @default - no check.
   */
  readonly test?: string;
}

/**
 * Optiosn for `Bundle.pack`.
 */
export interface BundlePackOptions {
  /**
   * The target directory to create the pacakge in.
   *
   * @default - the package directory.
   */
  readonly target?: string;
}

/**
 * Bundle class to validate and pack nodejs bundles.
 */
export class Bundle {

  private readonly manifest: any;

  private readonly packageDir: string;
  private readonly copyright: string;
  private readonly entrypoints: Record<string, string>;
  private readonly externals: string[];
  private readonly resources: {[src: string]: string};
  private readonly validLicenses?: string[];
  private readonly dontAttribute?: string;
  private readonly test?: string;

  private _bundle?: esbuild.BuildResult;
  private _dependencies?: Dependency[];
  private _dependenciesRoot?: string;

  private _notice?: Notice;

  constructor(props: BundleProps) {
    this.packageDir = props.packageDir;
    this.manifest = fs.readJsonSync(path.join(this.packageDir, 'package.json'));
    this.externals = props.externals ?? [];
    this.resources = props.resources ?? {};
    this.test = props.test;
    this.validLicenses = props.licenses;
    this.copyright = props.copyright;
    this.dontAttribute = props.dontAttribute;
    this.entrypoints = {};

    for (const entrypoint of props.entrypoints) {
      if (!fs.existsSync(path.join(this.packageDir, entrypoint))) {
        throw new Error(`Unable to locate entrypoint: ${entrypoint}`);
      }
      this.entrypoints[entrypoint.replace('.js', '')] = entrypoint;
    }
  }

  /**
   * Validate the bundle for violations.
   *
   * This method never throws. The Caller is responsible for inspecting the
   * returned report and act accordinagly.
   */
  public validate(): ViolationsReport {
    const circularImports = this.validateCircularImports();
    const resources = this.validateResources();
    const notice = this.validateNotice();
    return new ViolationsReport([...circularImports, ...resources, ...notice]);
  }

  /**
   * Create the final npm package.
   */
  public pack(options: BundlePackOptions = {}) {

    const target = options.target ?? this.packageDir;

    const report = this.validate();
    if (!report.success) {
      throw new Error(`Unable to pack due to validation errors.\n\n${report.violations.map(v => `  - ${v.type}: ${v.message}`).join('\n')}`);
    }

    if (!fs.existsSync(target)) {
      throw new Error(`Target doesnt exist: ${target}`);
    }

    if (!fs.lstatSync(target).isDirectory()) {
      throw new Error(`Target must be a directory: ${target}`);
    }

    console.log('Creating package');

    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep));
    try {
      fs.copySync(this.packageDir, workDir, { filter: n => !n.includes('node_modules') && !n.includes('.git') });

      // clone the original manifest since we are going to
      // to mutate it.
      const manifest = { ...this.manifest };

      this.removeDependencies(manifest);
      this.addExternals(manifest);
      this.writeOutputs(workDir);
      this.writeResources(workDir);

      fs.writeFileSync(path.join(workDir, 'package.json'), JSON.stringify(manifest, null, 2));

      if (this.test) {
        shell(`${path.join(workDir, this.test)}`, { cwd: workDir });
      }

      // create the tarball
      const tarball = shell('npm pack', { quiet: true, cwd: workDir }).trim();
      fs.copySync(path.join(workDir, tarball), path.join(target, tarball), { recursive: true });

    } finally {
      fs.removeSync(workDir);
    }
  }

  /**
   * Fix any fixable violations.
   */
  public fix() {
    const violations = this.validate();
    for (const violation of violations.violations) {
      if (violation.fix) {
        violation.fix();
      }
    }
  }

  private get bundle(): esbuild.BuildResult {
    if (this._bundle) {
      return this._bundle;
    }
    this._bundle = this.esbuild();
    return this._bundle;
  }

  private get dependencies(): Dependency[] {
    if (this._dependencies) {
      return this._dependencies;
    }
    const inputs = Object.keys(this.bundle.metafile!.inputs);
    const packages = new Set(Array.from(inputs).map(i => this.closestPackage(path.join(this.packageDir, i))));
    this._dependencies = Array.from(packages).map(p => this.createDependency(p)).filter(d => d.name !== this.manifest.name);
    return this._dependencies;
  }

  private get dependenciesRoot(): string {
    if (this._dependenciesRoot) {
      return this._dependenciesRoot;
    }
    const lcp = longestCommonParent(this.dependencies.map(d => d.path));
    this._dependenciesRoot = this.closestPackage(lcp);
    return this._dependenciesRoot;
  }

  private get notice(): Notice {
    if (this._notice) {
      return this._notice;
    }
    this._notice = new Notice({
      packageDir: this.packageDir,
      dependencies: this.dependencies,
      dependenciesRoot: this.dependenciesRoot,
      exclude: this.dontAttribute,
      validLicenses: this.validLicenses,
      copyright: this.copyright,
    });
    return this._notice;
  }

  private findPackages(name: string): string[] {

    const paths: string[] = [];
    walkDir(this.dependenciesRoot, (file: string) => {
      if (file.endsWith(`node_modules/${name}`)) {
        paths.push(file);
      }
    });

    return paths;
  }

  private closestPackage(fdp: string): string {

    if (fs.existsSync(path.join(fdp, 'package.json'))) {
      return fdp;
    }

    if (path.dirname(fdp) === fdp) {
      throw new Error('Unable to find package manifest');
    }

    return this.closestPackage(path.dirname(fdp));
  }

  private createDependency(packageDir: string): Dependency {
    const manifestPath = path.join(packageDir, 'package.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf-8' }));
    return { path: packageDir, name: manifest.name, version: manifest.version };
  }

  private esbuild(): esbuild.BuildResult {

    const bundle = esbuild.buildSync({
      entryPoints: this.entrypoints,
      bundle: true,
      target: 'node12',
      platform: 'node',
      sourcemap: 'inline',
      metafile: true,
      treeShaking: true,
      absWorkingDir: this.packageDir,
      external: this.externals.map(e => e.split(':')[0]),
      write: false,
      outdir: this.packageDir,
      allowOverwrite: true,
    });

    if (bundle.warnings.length) {
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

  private validateNotice(): Violation[] {
    console.log('Validating notice');
    return this.notice.validate().violations;
  }

  private addExternals(manifest: any) {

      // external dependencies should be specified as runtime dependencies
    for (const external of this.externals) {

      const parts = external.split(':');
      const name = parts[0];
      const type = parts[1];
      const paths = this.findPackages(name);
      if (paths.length === 0) {
        throw new Error(`Unable to locate external dependency: ${name}`);
      }
      if (paths.length > 1) {
        throw new Error(`Found multiple paths for external dependency (${name}): ${paths.join(' | ')}`);
      }
      const dependency = this.createDependency(paths[0]);

      switch (type) {
        case 'optional':
          manifest.optionalDependencies = manifest.optionalDependencies ?? {};
          manifest.optionalDependencies[dependency.name] = dependency.version;
          break;
        case 'peer':
          manifest.peerDependencies = manifest.peerDependencies ?? {};
          manifest.peerDependencies[dependency.name] = dependency.version;
          break;
        case '':
          manifest.dependencies = manifest.dependencies ?? {};
          manifest.dependencies[dependency.name] = dependency.version;
          break;
        default:
          throw new Error(`Unsupported dependency type '${type}' for external dependency '${name}'`);
      }
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
    console.log('Writing output files');
    for (const output of this.bundle.outputFiles ?? []) {
      const out = output.path.replace(this.packageDir, workDir);
      console.log(`  - ${out}`);
      fs.writeFileSync(out, output.contents);
    }
  }

  private writeResources(workdir: string) {
    console.log('Copying resources');
    for (const [src, dst] of Object.entries(this.resources)) {
      fs.copySync(path.join(this.packageDir, src), path.join(workdir, dst), { recursive: true });
    }
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

function walkDir(dir: string, handler: (file: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    const isDirectory = fs.statSync(fullPath).isDirectory();
    if (isDirectory) {
      walkDir(fullPath, handler);
    }
    handler(fullPath);
  });
};
