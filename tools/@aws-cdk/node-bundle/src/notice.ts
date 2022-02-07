import * as fs from 'fs';
import { Dependency } from '.';
import { shell } from './shell';

const FILE_PATH = 'NOTICE';

/**
 * <prefix-goes-here>
 *
 * | attributions.start |
 *
 * <attributions-go-here>
 *
 * | attributions.end |
 */
const NOTICE_FORMAT_REGEX = /([\S\s]*)\| attributions\.start \|([\S\s]*)\| attributions\.end \|/;

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

export interface NoticeGenerateOptions {
  /**
   * Prefix to prepend to the NOTICE file before the attributions segment starts.
   */
  readonly prefix?: string;
}

export class Notice {

  public static parse(): Notice {

    if (!fs.existsSync(FILE_PATH)) {
      return new Notice(new Map());
    }

    const notice = fs.readFileSync(FILE_PATH, { encoding: 'utf-8' }).match(NOTICE_FORMAT_REGEX);
    if (!notice) {
      console.error(`✖ Malformed ${FILE_PATH} file (fix with 'node-bundle fix'):`);
      process.exit(1);
    }

    const attributions: Map<string, Attribution> = new Map();
    const malformed = [];

    for (const section of notice[2].split(ATTRIBUTIONS_SEPARATOR)) {
      const matched = section.match(ATTRIBUTION_FORMAT_REGEX);
      if (!matched) {
        malformed.push(section.trim().split('\n')[0]);
        continue;
      }
      const pkg = matched[1];
      attributions.set(pkg, {
        package: pkg,
        url: matched[2],
        license: matched[3],
        licenseText: matched[4],
      });
    }

    if (malformed.length > 0) {
      console.error(`✖ Found ${malformed.length} malformed attributions (fix with 'node-bundle fix'):`);
      console.error(malformed.map(l => `  - ${l}`));
      process.exit(1);
    }

    return new Notice(attributions, notice[1]);
  }

  public static async generate(dependencies: Dependency[], options: NoticeGenerateOptions = {}): Promise<Notice> {

    const attributions: Map<string, Attribution> = new Map();

    const multiLicense = [];
    const missingLicense = [];

    for (const dep of dependencies) {
      const pkg = `${dep.name}@${dep.version}`;
      const output = await shell(`${require.resolve('license-checker/bin/license-checker')} --json --packages ${pkg}`, { cwd: dep.path, quiet: true });
      const info = JSON.parse(output)[pkg];
      const licenses: string[] = info.licenses ? info.licenses.split(',') : [];

      if (licenses.length > 0) {
        multiLicense.push(`${dep} (${licenses})`);
        continue;
      }

      if (licenses.length === 0) {
        missingLicense.push(dep);
        continue;
      }

      attributions.set(pkg, {
        package: pkg,
        url: `https://www.npmjs.com/package/${dep.name}/v/${dep.version}`,
        license: licenses[0],
        licenseText: (info.licenseFile && fs.existsSync(info.licenseFile)) ? fs.readFileSync(info.licenseFile, { encoding: 'utf-8' }) : undefined,
      });
    }

    if (multiLicense.length > 0) {
      console.error(`✖ Found ${multiLicense.length} dependencies with multiple licenses (these are unsupported for now, please remove their usage):`);
      console.error(multiLicense.map(l => `  - ${l}`).join('\n'));
      process.exit(1);
    }

    if (multiLicense.length > 0) {
      console.error(`✖ Found ${multiLicense.length} dependencies with no license information (these are unsupported for now, please remove their usage):`);
      console.error(multiLicense.map(l => `  - ${l}`).join('\n'));
      process.exit(1);
    }

    return new Notice(attributions, options.prefix);
  }

  private constructor(public readonly attributions: Map<string, Attribution>, public readonly prefix?: string) {

  }

  /**
   * Query whether a specific attribution exists in this notice.
   */
  public includesAttribution(attr: Attribution): boolean {
    const candidate = this.attributions.get(attr.package);

    if (!candidate) {
      return false;
    }
    if (candidate.url !== attr.url) {
      return false;
    }
    if (candidate.license !== attr.license) {
      return false;
    }
    if (candidate.licenseText !== attr.licenseText) {
      return false;
    }
    return true;
  }

  /**
   * Write the NOTICE file to disk.
   */
  public flush() {

  }

  /**
   * Find attributions in the current notice that are missing
   * from the the input ones.
   */
  public findMissing(other: Notice): Attribution[] {
    return Array.from(this.attributions.values()).filter(a => !other.includesAttribution(a));
  }
}

export interface Attribution {
  readonly package: string;
  readonly url: string;
  readonly license: string;
  readonly licenseText?: string;
}
