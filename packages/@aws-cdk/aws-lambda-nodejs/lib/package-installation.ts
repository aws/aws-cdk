import { spawnSync } from 'child_process';
import { tryGetModuleVersion } from './util';

/**
 * Package installation
 */
export abstract class PackageInstallation {
  public static detect(module: string): PackageInstallation | undefined {
    try {
      // Check local version first
      const version = tryGetModuleVersion(module);
      if (version) {
        return {
          isLocal: true,
          version,
        };
      }

      // Fallback to a global version
      const esbuild = spawnSync(module, ['--version']);
      if (esbuild.status === 0 && !esbuild.error) {
        return {
          isLocal: false,
          version: esbuild.stdout.toString().trim(),
        };
      }
      return undefined;
    } catch (err) {
      return undefined;
    }
  }

  public abstract readonly isLocal: boolean;
  public abstract readonly version: string;
}
