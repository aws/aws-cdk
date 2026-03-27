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
          isLocal: true,
          version,
        };
      }

      // Fallback to a global version
      const proc = spawnSync(module, ['--version']);
      if (proc.status === 0 && !proc.error) {
        return {
          isLocal: false,
          version: proc.stdout.toString().trim(),
        };
      }
      return undefined;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Whether the binary is found in the current project's `package.json`.
   *
   * - If `true`, it is in the current project's `package.json`.
   * - If `false`, it is otherwise found on the $PATH and can be executed directly.
   */
  public abstract readonly isLocal: boolean;
  public abstract readonly version: string;
}
