import * as fs from 'fs';
import * as path from 'path';
import { shell } from './shell';
import { Violation, ViolationType, ViolationsReport } from './violation';

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
  public validate(): ViolationsReport {

    const violations = [];
    const noticePath = path.join(this.packageDir, FILE_PATH);

    const fix = () => this.flush();

    const missing: Violation | undefined = !fs.existsSync(noticePath) ? { type: ViolationType.MISSING_NOTICE, message: `${FILE_PATH} is missing`, fix } : undefined;
    const notice = missing ? undefined : fs.readFileSync(noticePath, { encoding: 'utf-8' });
    const outdated: Violation | undefined = notice !== undefined && notice !== this.content ? { type: ViolationType.OUTDATED_NOTICE, message: `${FILE_PATH} is outdated`, fix } : undefined;

    const invalidLicense: Violation[] = Array.from(this.attributions.values())
      .filter(a => a.licenses.length === 1 && !this.validLicenses.includes(a.licenses[0].toLowerCase()))
      .map(a => ({ type: ViolationType.INVALID_LICENSE, message: `Dependency ${a.package} has an invalid license: ${a.licenses[0]}` }));

    const noLicense: Violation[] = Array.from(this.attributions.values())
      .filter(a => a.licenses.length === 0)
      .map(a => ({ type: ViolationType.NO_LICENSE, message: `Dependency ${a.package} has no license` }));

    const multiLicense: Violation[] = Array.from(this.attributions.values())
      .filter(a => a.licenses.length > 1)
      .map(a => ({ type: ViolationType.MULTIPLE_LICENSE, message: `Dependency ${a.package} has multiple licenses: ${a.licenses}` }));

    if (missing) {
      violations.push(missing);
    }

    if (outdated) {
      violations.push(outdated);
    }

    violations.push(...invalidLicense);
    violations.push(...noLicense);
    violations.push(...multiLicense);

    return new ViolationsReport(violations);
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
      notice.push(`** ${attr.package} - ${attr.url} | ${attr.licenses[0]}`);
      notice.push(attr.licenseText ?? '');
      notice.push(separator);
    }

    return notice
      // since we are embedding external files, those can different line
      // endings, so we standardize to LF.
      .map(l => l.replace(/\r\n/g, '\n'))
      .join('\n');

  }

  private generateAttributions(): Map<string, Attribution> {

    if (this.dependencies.length === 0) {
      return new Map();
    }

    const attributions: Map<string, Attribution> = new Map();

    const pkg = (d: Dependency) => `${d.name}@${d.version}`;

    const packages = this.dependencies.map(d => pkg(d)).join(';');

    // we don't use the programmatic API since it only offers an async API.
    // prefer to stay sync for now since its easier to integrate with other tooling.
    // will offer an async API further down the road.
    const command = `${require.resolve('license-checker/bin/license-checker')} --json --packages "${packages}"`;
    const output = shell(command, { cwd: this.dependenciesRoot, quiet: true });
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

      // the licenses key comes in different types but we convert it here
      // to always be an array.
      const licenses = !info.licenses ? undefined : (Array.isArray(info.licenses) ? info.licenses : [info.licenses]);

      attributions.set(key, {
        package: key,
        url: `https://www.npmjs.com/package/${dep.name}/v/${dep.version}`,
        licenses,
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
  readonly licenses: string[];
  /**
   * Package license content.
   */
  readonly licenseText?: string;
}
