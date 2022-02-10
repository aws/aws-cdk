import * as os from 'os';
import * as path from 'path';
import * as esbuild from 'esbuild';
import * as fs from 'fs-extra';
import { NoticeValidationReport } from '.';
import { Dependency, Notice } from './notice';
import { shell } from './shell';

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
   * Validate the current notice file.
   *
   * This method never throws. The Caller is responsible for inspecting the report returned and act accordinagly.
   */
  public validate(): BundleValidationReport {

    let circularImports: Violation | undefined = undefined;

    console.log('Validating circular imports');
    const packages = [this.packageDir, ...this.dependencies.map(d => d.path)];
    try {
      // we don't use the programatic API since it only offers an async API.
      // prefer to stay sync for now since its easier to integrate with other tooling.
      // will offer an async API further down the road.
      shell(`${require.resolve('madge/bin/cli.js')} --warning --no-color --no-spinner --circular --extensions js ${packages.join(' ')}`, { quiet: true });
    } catch (e: any) {
      circularImports = { message: `Circular imports detected:\n${e.stdout.toString()}` };
    }

    console.log('Validating resources');
    const missingResources: Violation[] = [];
    for (const [src, _] of Object.entries(this.resources)) {
      if (!fs.existsSync(path.join(this.packageDir, src))) {
        missingResources.push({ message: `Unable to find resource (${src}) relative to the package directory` });
      }
    }

    console.log('Validating notice');
    const noticeReport = this.notice.validate();
    return new BundleValidationReport(noticeReport, missingResources, circularImports);
  }

  public pack(options: BundlePackOptions = {}) {

    const target = options.target ?? this.packageDir;

    const report = this.validate();
    if (report.violations.length > 0) {
      throw new Error(`Unable to pack due to validation errors.\n\n${report.violations.map(v => `  - ${v.message}`).join('\n')}`);
    }

    if (!fs.existsSync(target)) {
      console.log(`✖ Target doesnt exist: ${target}`);
      process.exit(1);
    }

    if (!fs.lstatSync(target).isDirectory()) {
      console.log(`✖ Target must be a directory: ${target}`);
      process.exit(1);
    }

    console.log('Creating package');

    const workdir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep));
    try {
      fs.copySync(this.packageDir, workdir, { filter: n => !n.includes('node_modules') && !n.includes('.git') });

      const bundleManifest = { ...this.manifest };

      // move all 'dependencies' to 'devDependencies' so that npm doesn't install anything when consuming
      // external ones should be kept as is.
      for (const [d, v] of Object.entries(this.manifest.dependencies)) {
        bundleManifest.devDependencies[d] = v;
        delete bundleManifest.dependencies[d];
      }

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
            bundleManifest.optionalDependencies = bundleManifest.optionalDependencies ?? {};
            bundleManifest.optionalDependencies[dependency.name] = dependency.version;
            break;
          case 'peer':
            bundleManifest.peerDependencies = bundleManifest.peerDependencies ?? {};
            bundleManifest.peerDependencies[dependency.name] = dependency.version;
            break;
          case '':
            bundleManifest.dependencies = bundleManifest.dependencies ?? {};
            bundleManifest.dependencies[dependency.name] = dependency.version;
            break;
          default:
            throw new Error(`Unsupported dependency type '${type}' for external dependency '${name}'`);
        }
      }

      fs.writeFileSync(path.join(workdir, 'package.json'), JSON.stringify(bundleManifest, null, 2));

      console.log('Writing output files');
      for (const output of this.bundle.outputFiles ?? []) {
        const out = output.path.replace(this.packageDir, workdir);
        console.log(`  - ${out}`);
        fs.writeFileSync(out, output.contents);
      }

      console.log('Copying resources');
      for (const [src, dst] of Object.entries(this.resources)) {
        fs.copySync(path.join(this.packageDir, src), path.join(workdir, dst), { recursive: true });
      }

      if (this.test) {
        shell(`${path.join(workdir, this.test)}`, { cwd: workdir });
      }

      // create the tarball
      const tarball = shell('npm pack', { quiet: true, cwd: workdir }).trim();
      fs.copySync(path.join(workdir, tarball), path.join(target, tarball), { recursive: true });

    } finally {
      // fs.removeSync(workdir);
    }
  }

  public fix() {
    console.log('Generating notice file');
    this.notice.flush();
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
    const packages = new Set(Array.from(inputs).map(i => this.findPackagePath(i)));
    this._dependencies = Array.from(packages).map(p => this.createDependency(p)).filter(d => d.name !== this.manifest.name);
    return this._dependencies;
  }

  private get dependenciesRoot(): string {
    if (this._dependenciesRoot) {
      return this._dependenciesRoot;
    }
    this._dependenciesRoot = lcp(this.dependencies.map(d => d.path));
    return this._dependenciesRoot;
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

  private findPackagePath(inputFile: string): string {

    function findPackagePathUp(dirname: string): string {
      const manifestPath = path.join(dirname, 'package.json');
      if (fs.existsSync(manifestPath)) {
        return dirname;
      }
      if (path.dirname(dirname) === dirname) {
        throw new Error('Unable to find package manifest');
      }
      return findPackagePathUp(path.dirname(dirname));
    }

    return findPackagePathUp(path.resolve(this.packageDir, path.dirname(inputFile)));
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
}

export interface Violation {
  /**
   * The violation message.
   */
  readonly message: string;
  /**
   * A fixer function.
   * If undefined, this violation cannot be fixed automatically.
   */
  readonly fix?: () => void;
}

/**
 * Validation report.
 */
export class BundleValidationReport {

  /**
   * All violations of the report.
   */
  public readonly violations: Violation[];

  constructor(
    /**
     * The NOTICE file validation report.
     */
    public readonly notice: NoticeValidationReport,
    /**
     * Resources that could not be located.
     */
    public readonly missingResources: Violation[],
    /**
     * The circular imports violations.
     */
    public readonly circularImports?: Violation,
  ) {

    const violations: Violation[] = [];

    violations.push(...notice.violations);
    violations.push(...missingResources);

    if (circularImports) {
      violations.push(circularImports);
    }

    this.violations = violations;

  }
}

function lcp(strs: string[]) {
  let prefix = '';
  if (strs === null || strs.length === 0) return prefix;
  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i];
    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] !== char) return prefix;
    }
    prefix = prefix + char;
  }
  return prefix;
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
