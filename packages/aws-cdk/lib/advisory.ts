import * as path from 'path';
import * as fs from 'fs-extra';
import { warning } from './logging';
import { toYAML } from './serialize';

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

interface Advisory {
  message(): string | void;
}

class NetmaskAdvisory implements Advisory {
  public message(): string | void {
    const pkgLockJsonPath = path.join(process.cwd(), 'package-lock.json');
    const pkgJsonPath = path.join(process.cwd(), 'package.json');

    if (!fs.existsSync(pkgJsonPath) || fs.existsSync(pkgLockJsonPath)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const json = require(pkgJsonPath);
    const netmaskVer = json?.resolutions?.netmask;
    if (typeof(netmaskVer) === 'string' && netmaskVer.startsWith('2')) {
      return;
    }
    return '<message goes here TODO>';
  }
}