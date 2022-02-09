import * as fs from 'fs';
import * as path from 'path';
import type { Dependency, Attribution, NoticeViolations } from './model';
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
 * String signifying the attributions segement is to follow.
 */
const ATTRIBUTIONS_START = 'This package includes the following third-party software:';

/**
 * ---------------
 */
const ATTRIBUTIONS_SEPARATOR = `\n${'-'.repeat(15)}\n`;

/**
 * ** fs-extra@3.0.4 - https://www.npmjs.com/package/fs-extra/v/3.0.4 | MIT
 *
 * Copyright (c) 2011-2017 JP Richardson
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 *
 */
const ATTRIBUTION_FORMAT_REGEX = /\*\* (\S*) - (\S*) \| (\S*)([\S\s]*)/;


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

  private readonly expectedAttributions: Map<string, Attribution>;

  constructor(props: NoticeProps) {
    this.packageDir = props.packageDir;
    this.dependencies = props.dependencies.filter(d => !props.exclude || !new RegExp(props.exclude).test(d.name));
    this.validLicenses = (props.validLicenses ?? DEFAULT_VALID_LICENSES).map(l => l.toLowerCase());

    // without the expected attributions, this object is pretty much
    // useless, so lets generate those of the bat.
    this.expectedAttributions = this.generateAttributions();
  }

  /**
   * Validate the current notice file.
   *
   * This method will parse attributions of the current NOTICE file and compare
   * them against the expected attributions based on the provided dependencies.
   *
   * It throws an exception in case the NOTICE file is malformed and cannot be parsed.
   * Otherwise it returns a report of attribution violations. The Caller is responsible
   * for inspecting those violations and act accordingaly.
   *
   * If no violations are found, the return value will be undefined.
   */
  public validate(): NoticeViolations | undefined {

    const currentAttributions = this.parseAttributions();

    const { invalidLicense, noLicense, multiLicense } = this.validateAttributionLicense(currentAttributions);
    const missing = Array.from(this.expectedAttributions.values()).filter(a => !currentAttributions.has(a.package));
    const unnecessary = Array.from(currentAttributions.values()).filter(a => !this.expectedAttributions.has(a.package));

    if (invalidLicense.length === 0 && noLicense.length === 0 && multiLicense.length === 0 && missing.length === 0 && unnecessary.length === 0) {
      return undefined;
    }

    // we convert empty arrays to undefined so its eaiser for callers to check for violations.
    const emptyToUndefined = (arr: Attribution[]) => arr.length > 0 ? arr : undefined;

    return {
      invalidLicense: emptyToUndefined(invalidLicense),
      noLicense: emptyToUndefined(noLicense),
      multiLicense: emptyToUndefined(multiLicense),
      missing: emptyToUndefined(missing),
      unnecessary: emptyToUndefined(unnecessary),
    };
  }

  /**
   * Render the notice file based on the expected attributions
   * and write it to disk. The copyright is placed in the beginning of the file.
   */
  public create(copyright: string) {
    const notice = [copyright, '', '-'.repeat(40), ''];

    if (this.expectedAttributions.size > 0) {
      notice.push(ATTRIBUTIONS_START);
      notice.push('');
    }

    for (const attr of this.expectedAttributions.values()) {
      notice.push(`** ${attr.package} - ${attr.url} | ${attr.license}`);
      notice.push(attr.licenseText ?? '');
      notice.push(ATTRIBUTIONS_SEPARATOR);
    }

    fs.writeFileSync(path.join(this.packageDir, FILE_PATH), notice.join('\n'));
  }

  private parseAttributions(): Map<string, Attribution> {

    const noticePath = path.join(this.packageDir, FILE_PATH);

    if (!fs.existsSync(noticePath)) {
      return new Map();
    }

    const notice = fs.readFileSync(noticePath, { encoding: 'utf-8' }).split('\n');
    const attributionsSegment = notice.slice(notice.indexOf(ATTRIBUTIONS_START) + 1).join('\n').trim();

    const attributions: Map<string, Attribution> = new Map();

    for (const section of attributionsSegment === '' ? [] : attributionsSegment.split(ATTRIBUTIONS_SEPARATOR)) {
      const matched = section.match(ATTRIBUTION_FORMAT_REGEX);
      if (!matched) {
        throw new Error(`Malformed ${FILE_PATH} file (delete it)`);
      }
      const pkg = matched[1];
      attributions.set(pkg, {
        package: pkg,
        url: matched[2],
        license: matched[3],
        licenseText: matched[4],
      });
    }

    return attributions;
  }

  private generateAttributions(): Map<string, Attribution> {

    const attributions: Map<string, Attribution> = new Map();

    const pkg = (d: Dependency) => `${d.name}@${d.version}`;

    const dependenciesRoot = lcp(this.dependencies.map(d => d.path));
    const packages = this.dependencies.map(d => pkg(d)).join(';');
    const output = shell(`${require.resolve('license-checker/bin/license-checker')} --json --packages "${packages}"`, { cwd: dependenciesRoot, quiet: true });
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

    // make sure all attributions have a valid license
    const { invalidLicense, noLicense, multiLicense } = this.validateAttributionLicense(attributions);

    const error = [];

    if (invalidLicense.length > 0) {
      error.push('Following dependencies have invalid licenses: (either remove them or update the valid licenses list)');
      error.push(invalidLicense.map(a => `  - ${a.package}: ${a.license}`));
      error.push('');
    }

    if (noLicense.length > 0) {
      error.push('Following dependencies have no licenses: (remove them)');
      error.push(noLicense.map(a => `  - ${a.package}`));
      error.push('');
    }

    if (multiLicense.length > 0) {
      error.push('Following dependencies have multiple licenses: (remove them)');
      error.push(noLicense.map(a => `  - ${a.package}: ${a.license}`));
      error.push('');
    }

    if (error.length > 0) {
      throw new Error(`Errors while generating attributions:\n\n${error.join('\n')}`);
    }

    return attributions;
  }

  private validateAttributionLicense(attributions: Map<string, Attribution>) {
    const invalidLicense = Array.from(attributions.values()).filter(a => a.license && !this.validLicenses.includes(a.license.toLowerCase()));
    const noLicense = Array.from(attributions.values()).filter(a => !a.license);
    const multiLicense = Array.from(attributions.values()).filter(a => a.license && a.license.split(',').length > 1);
    return { invalidLicense, noLicense, multiLicense };
  }

}

function lcp(strs: string[]) {
  let prefix = '';
  if (strs === null || strs.length === 0) return prefix;
  for (let i=0; i < strs[0].length; i++) {
    const char = strs[0][i]; // loop through all characters of the very first string.

    for (let j = 1; j < strs.length; j++) {
        // loop through all other strings in the array
      if (strs[j][i] !== char) return prefix;
    }
    prefix = prefix + char;
  }
  return prefix;
}