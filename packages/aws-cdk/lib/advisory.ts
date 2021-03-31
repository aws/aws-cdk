import * as path from 'path';
import * as fs from 'fs-extra';
import { warning } from './logging';

export function printAdvisories() {
  const advisories: Advisory[] = [
    new NetmaskAdvisory(),
  ];

  const messages = advisories.map(a => a.message()).filter(m => m) as string[];
  if (messages.length > 0) {
    warning('We have identified the following advisories that may be applicable to your CDK project.');
    messages.forEach(m => warning(`• ${m}`));
  }
}

export interface Advisory {
  message(): string | undefined;
}

export class NetmaskAdvisory implements Advisory {
  constructor(private readonly cwd = process.cwd()) {}

  public message(): string | undefined {
    const yarnLockPath = path.join(this.cwd, 'yarn.lock');
    const pkgJsonPath = path.join(this.cwd, 'package.json');

    if (!fs.existsSync(pkgJsonPath)) {
      // we're not in an node package, or at the package root
      return;
    }
    if (!fs.existsSync(yarnLockPath)) {
      // this is not a yarn package
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const json = require(pkgJsonPath);
    if (
      !('aws-cdk' in (json.dependencies ?? {})) &&
      !('aws-cdk' in (json.devDependencies ?? {}))
    ) {
      return;
    }
    const netmaskVer = json?.resolutions?.netmask;
    if (typeof(netmaskVer) === 'string' && netmaskVer.match(/^[~^]?2/)) {
      return;
    }
    return '<message goes here TODO>';
  }
}