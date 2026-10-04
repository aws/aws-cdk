import { spawnSync } from 'child_process';
import { tryGetModuleVersionFromRequire } from './util';

/**
 * Package installation
 */
export abstract class PackageInstallation {
  public static detect(module: string): PackageInstallation | undefined {
    try {
      // Check local version first
      const version = tryGetModuleVersionFromRequire(module);
      if (version) {
        return {
          isWorkspacePackage: true,
          version,
        };
      }

      // Fallback to a global version
      const proc = spawnSync(module, ['--version']);
      if (proc.status === 0 && !proc.error) {
        return {
          isWorkspacePackage: false,
          version: proc.stdout.toString().trim(),
        };
      }
      return undefined;
    } catch (err) {
      return undefined;
    }
  }

  public abstract readonly isWorkspacePackage: boolean;
  public abstract readonly version: string;
}
