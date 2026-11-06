import { spawnSync } from 'child_process';
import { tryGetModuleDetailsFromRequire } from './util';

/**
 * Package installation
 */
export abstract class PackageInstallation {
  public static detect(module: string): PackageInstallation | undefined {
    try {
      // Check local version first
      const details = tryGetModuleDetailsFromRequire(module);
      if (details) {
        return {
          isWorkspacePackage: true,
          version: details.version,
          binPath: details.binPath,
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
  public abstract readonly binPath?: string;
}
