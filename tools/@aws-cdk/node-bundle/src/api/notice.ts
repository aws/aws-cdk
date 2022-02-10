import * as fs from 'fs';
import * as path from 'path';
import type { Violation } from './bundle';
import { shell } from './shell';

/**
 * Valid licenses that are ok to redistribute.
 */
const DEFAULT_VALID_LICENSES = [
  'Apache-2.0',
  'MIT',
  'BSD-3-Clause',
  'ISC',
  'BSD-2-Clause',
  '0BSD',
];

/**
 * NOTICE file path.
 */
const FILE_PATH = 'NOTICE';

/**
 * Dependency of a specific package on the local file system.
 */
export interface Dependency {
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
 * Properties for `Notice`.
 */
export interface NoticeProps {
  /**
   * The package root directory.
   */
  readonly packageDir: string;
  /**
   * Package dependencies.
   */
  readonly dependencies: Dependency[];
  /**
   * The parent directory underwhich all dependencies live.
   */
  readonly dependenciesRoot: string;
  /**
   * The copyright to prepend to the file.
   */
  readonly copyright: string;
  /**
   * List of valid licenses.
   *
   * @default - predefined list.
   */
  readonly validLicenses?: string[];
   /**
   * Dependencies matching this pattern will be excluded from attribution.
   *
   * @default - no exclusions.
   */
  readonly exclude?: string;
}

/**
 * `Notice` represents a NOTICE file containing various attributions.
 */
export class Notice {

  private readonly packageDir: string;
  private readonly dependencies: Dependency[];
  private readonly validLicenses: string[];
  private readonly copyright: string;
  private readonly dependenciesRoot: string;

  private readonly attributions: Map<string, Attribution>;
  private readonly content: string;

  constructor(props: NoticeProps) {
    this.packageDir = props.packageDir;
    this.dependencies = props.dependencies.filter(d => !props.exclude || !new RegExp(props.exclude).test(d.name));
    this.validLicenses = (props.validLicenses ?? DEFAULT_VALID_LICENSES).map(l => l.toLowerCase());
    this.copyright = props.copyright;
    this.dependenciesRoot = props.dependenciesRoot;

    // without the generated notice content, this object is pretty much
    // useless, so lets generate those of the bat.
    this.attributions = this.generateAttributions();
    this.content = this.render(this.attributions);
  }

  /**
   * Validate the current notice file.
   *
   * This method never throws. The Caller is responsible for inspecting the report returned and act accordinagly.
   */
  public validate(): NoticeValidationReport {

    const noticePath = path.join(this.packageDir, FILE_PATH);

    const fix = () => this.flush();

    const missing = !fs.existsSync(noticePath) ? { message: `${noticePath} is missing`, fix } : undefined;
    const notice = missing ? undefined : fs.readFileSync(noticePath, { encoding: 'utf-8' });
    const outdated = notice && notice !== this.content ? { message: `${noticePath} is outdated`, fix } : undefined;

    const invalidLicense = Array.from(this.attributions.values())
      .filter(a => a.license && !this.validLicenses.includes(a.license.toLowerCase()))
      .map(a => ({ message: `Dependency ${a.package} has an invalid license: ${a.license}` }));

    const noLicense = Array.from(this.attributions.values())
      .filter(a => !a.license)
      .map(a => ({ message: `Dependency ${a.package} has no license` }));

    const multiLicense = Array.from(this.attributions.values())
      .filter(a => a.license && a.license.split(',').length > 1)
      .map(a => ({ message: `Dependency ${a.package} has multiple licenses: ${a.license}` }));

    return new NoticeValidationReport(multiLicense, noLicense, invalidLicense, missing, outdated);
  }

  /**
   * Flush the generated notice file to disk.
   */
  public flush() {
    fs.writeFileSync(path.join(this.packageDir, FILE_PATH), this.content);
  }

  private render(attributions: Map<string, Attribution>): string {

    const notice = [this.copyright, '', '-'.repeat(40), ''];

    if (attributions.size > 0) {
      notice.push('This package includes the following third-party software:');
      notice.push('');
    }

    const separator = `\n${'-'.repeat(15)}\n`;

    for (const attr of attributions.values()) {
      notice.push(`** ${attr.package} - ${attr.url} | ${attr.license}`);
      notice.push(attr.licenseText ?? '');
      notice.push(separator);
    }

    return notice.join('\n');

  }

  private generateAttributions(): Map<string, Attribution> {

    const attributions: Map<string, Attribution> = new Map();

    const pkg = (d: Dependency) => `${d.name}@${d.version}`;

    const packages = this.dependencies.map(d => pkg(d)).join(';');
    const output = shell(`${require.resolve('license-checker/bin/license-checker')} --json --packages "${packages}"`, {
      cwd: this.dependenciesRoot,
      quiet: true,
    });
    const infos = JSON.parse(output);

    for (const dep of this.dependencies) {

      const key = pkg(dep);
      const info = infos[key];

      if (!info) {
        // make sure all dependencies are accounted for.
        throw new Error(`Unable to locate license information for ${key}`);
      }

      // for some reason, the license-checker package falls back to the README.md file of the package for license
      // text. this seems strange, disabling that for now.
      // see https://github.com/davglass/license-checker/blob/master/lib/license-files.js#L9
      // note that a non existing license file is ok as long as the license type could be extracted.
      const licenseFile = info.licenseFile?.toLowerCase().endsWith('.md') ? undefined : info.licenseFile;

      attributions.set(key, {
        package: key,
        url: `https://www.npmjs.com/package/${dep.name}/v/${dep.version}`,
        license: info.licenses,
        licenseText: (licenseFile && fs.existsSync(licenseFile)) ? fs.readFileSync(licenseFile, { encoding: 'utf-8' }) : undefined,
      });
    }

    return attributions;
  }

}

/**
 * Attribution of a specific dependency.
 */
interface Attribution {
  /**
   * Attributed package (name + version)
   */
  readonly package: string;
  /**
   * URL to the package.
   */
  readonly url: string;
  /**
   * Package license.
   */
  readonly license?: string;
  /**
   * Package license content.
   */
  readonly licenseText?: string;
}


/**
 * Validation report.
 */
export class NoticeValidationReport {

  /**
   * All violations of the report.
   */
  public readonly violations: Violation[];

  constructor(
    /**
     * Attributions that have multiple licenses.
     */
    public readonly multiLicense: Violation[],
    /**
     * Attributions that have no license.
     */
    public readonly noLicense: Violation[],
    /**
     * Attributions that have an invalid license.
     */
    public readonly invalidLicense: Violation[],
    /**
     * Notice file is missing.
     */
    public readonly missing?: Violation,
    /**
     * Notice file is outdated.
     */
    public readonly outdated?: Violation,
  ) {

    const violations: Violation[] = [];

    violations.push(...invalidLicense);
    violations.push(...noLicense);
    violations.push(...invalidLicense);

    if (missing) {
      violations.push(missing);
    }
    if (outdated) {
      violations.push(outdated);
    }

    this.violations = violations;

  }

}
