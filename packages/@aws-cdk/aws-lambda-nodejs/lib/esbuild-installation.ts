import { spawnSync } from 'child_process';
import { tryGetModuleVersion } from './util';

/**
 * An esbuild installation
 */
export abstract class EsbuildInstallation {
  public static detect(): EsbuildInstallation | undefined {
    try {
      // Check local version first
      const version = tryGetModuleVersion('esbuild');
      if (version) {
        return {
          isLocal: true,
          version,
        };
      }

      // Fallback to a global version
      const esbuild = spawnSync('esbuild', ['--version']);
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
