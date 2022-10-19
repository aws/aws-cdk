import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { shell } from '../src/api/_shell';

/**
 * Package options.
 */
export interface PackageOptions {
  /**
   * Package name.
   */
  readonly name: string;

  /**
   * Include circular imports.
   *
   * @default false
   */
  readonly circular?: boolean;

  /**
   * Package licenses.
   */
  readonly licenses?: string[];

  /**
   * Package notice file.
   */
  readonly notice?: string;
}

/**
 * Generate packages for test scenarios.
 */
export class Package {

  /**
   * Create a package.
   */
  public static create(options: PackageOptions): Package {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep));
    const manifest: any = {
      name: options.name,
      version: '0.0.1',
    };

    if (options.licenses?.length === 1) {
      manifest.license = options.licenses[0];
    };

    if (options.licenses && options.licenses.length > 1) {
      manifest.licenses = options.licenses!.map(l => ({ type: l }));
    }

    const foo = [];
    const bar = [];

    if (options.circular) {
      foo.push('const bar = require("./bar");');
      bar.push('const foo = require("./foo");');
    }

    foo.push('console.log("hello from foo");');
    bar.push('console.log("hello from bar");');

    const index = [
      'require("./foo");',
      'require("./bar");',
    ];

    return new Package(dir, manifest, index, foo, bar, options.notice ?? '');
  }

  private readonly dependencies: Package[] = [];

  constructor(
    public readonly dir: string,
    public readonly manifest: any,
    public readonly index: string[],
    public readonly foo: string[],
    public readonly bar: string[],
    public attributions: string) {
    this.manifest.main = this.entrypoint;
  }

  /**
   * Create an npm tarballs of this package.
   */
  public pack() {
    shell('npm pack', { cwd: this.dir, quiet: true });
  }

  /**
   * Install package dependencies.
   */
  public install() {
    shell('npm install', { cwd: this.dir, quiet: true });
  }

  /**
   * Write the package to disk.
   */
  public write() {
    fs.mkdirSync(path.join(this.dir, 'lib'));
    fs.writeFileSync(path.join(this.dir, 'package.json'), JSON.stringify(this.manifest, null, 2));
    fs.writeFileSync(path.join(this.dir, 'lib', 'foo.js'), this.foo.join('\n'));
    fs.writeFileSync(path.join(this.dir, 'lib', 'bar.js'), this.bar.join('\n'));
    fs.writeFileSync(path.join(this.dir, this.entrypoint), this.index.join('\n'));
    fs.writeFileSync(path.join(this.dir, 'THIRD_PARTY_LICENSES'), this.attributions);
    for (const dep of this.dependencies) {
      dep.write();
      dep.pack();
    }
  }

  /**
   * Add a dependency to the project. This will also modify the source
   * code of the project to use that dependency.
   */
  public addDependency(options: PackageOptions): Package {
    const dependency = Package.create(options);
    this.dependencies.push(dependency);

    this.manifest.dependencies = this.manifest.dependencies ?? {};

    this.index.push(`require("${dependency.name}");`);
    this.manifest.dependencies[dependency.name] = path.join(dependency.dir, `${dependency.name}-${dependency.version}.tgz`);
    return dependency;
  }

  /**
   * Entrypoint.
   */
  public get entrypoint(): string {
    return path.join('lib', 'index.js');
  }

  /**
   * Name.
   */
  public get name(): string {
    return this.manifest.name;
  }

  /**
   * Version.
   */
  public get version(): string {
    return this.manifest.version;
  }

  /**
   * Cleanup the directories.
   */
  public clean() {
    for (const dep of this.dependencies) {
      dep.clean();
    }
    fs.removeSync(this.dir);
  }

}