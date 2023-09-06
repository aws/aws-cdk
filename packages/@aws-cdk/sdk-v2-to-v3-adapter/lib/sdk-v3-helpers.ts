import { findV3ClientConstructor } from './find-client-constructor';
import { getV3ClientPackageName } from './get-v3-client-package-name';

interface SdkV3Package {
  service: string;
  packageName: string;
  packageVersion: string;
  pkg: object;
}

export function loadV3ClientPackage(service: string): SdkV3Package {
  const packageName = service.startsWith('@aws-sdk/') ? service : getV3ClientPackageName(service);

  try {
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const pkg = require(packageName);
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const { version } = require(packageName + '/package.json');

    return {
      service: packageName.replace('@aws-sdk/client-', ''),
      pkg,
      packageName,
      packageVersion: version,
    };
  } catch (e) {
    throw Error(`Service ${service} client package with name '${packageName}' does not exist.`);
  }
}

export function getV3Client(sdkPkg: SdkV3Package, clientOptions: any = {}): any {
  try {
    const ServiceClient = findV3ClientConstructor(sdkPkg.pkg);
    return new ServiceClient(clientOptions);
  } catch (e) {
    throw Error(`No client constructor found within package: ${sdkPkg.packageName}`);
  }
}

export function getV3Command(sdkPkg: SdkV3Package, action: string): any {
  const commandName = action.endsWith('Command') ? action : `${action}Command`;
  const command = Object.entries(sdkPkg.pkg).find(
    ([name]) => name.toLowerCase() === commandName.toLowerCase(),
  )?.[1] as { new (input: any): any };

  if (!command) {
    throw new Error(`Unable to find command named: ${commandName} for api: ${action} in service package`);
  }
  return command;
}
