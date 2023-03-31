import * as fs from 'fs';
import * as path from 'path';

/**
 * Return the preferred CLI version for the current CDK Library version
 *
 * This is necessary to prevent cxapi version incompatibility between the two
 * CDK major versions. Since changes currently go into v1 before they go into
 * v2, a cxapi change can be released in v1 while the v2 CLI doesn't support it
 * yet.
 *
 * In those cases, simply installing the "latest" CLI (2) is not good enough
 * because it won't be able to read the Cloud Assembly of the v1 app.
 *
 * Find this version by finding the containing `package.json` and reading
 * `preferredCdkCliVersion` from it.
 */
export function preferredCliVersion(): string | undefined {
  const pjLocation = findUp('package.json', __dirname);
  if (!pjLocation) {
    return undefined;
  }
  const pj = JSON.parse(fs.readFileSync(pjLocation, { encoding: 'utf-8' }));
  return pj.preferredCdkCliVersion ? `${pj.preferredCdkCliVersion}` : undefined;
}

export function findUp(name: string, directory: string): string | undefined {
  const absoluteDirectory = path.resolve(directory);

  const file = path.join(directory, name);
  if (fs.existsSync(file)) {
    return file;
  }

  const { root } = path.parse(absoluteDirectory);
  if (absoluteDirectory == root) {
    return undefined;
  }

  return findUp(name, path.dirname(absoluteDirectory));
}