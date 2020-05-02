import * as os from 'os';
import * as path from 'path';

export function cdkHomeDir() {
  return process.env.CDK_HOME
    ? path.resolve(process.env.CDK_HOME)
    : path.join((os.userInfo().homedir ?? os.homedir()).trim() || '/', '.cdk');
}

export function cdkCacheDir() {
  return path.join(cdkHomeDir(), 'cache');
}