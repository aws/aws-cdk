import { spawnSync } from 'child_process';
import { getModuleVersion } from './util';

/**
 * An esbuild installation
 */
export abstract class EsbuildInstallation {
  public static detect(): EsbuildInstallation | undefined {
    try {
      try {
        // Check local version first
        const version = getModuleVersion('esbuild');
        return {
          isLocal: true,
          version,
        };
      } catch (err) {
        // Fallback to a global version
        const esbuild = spawnSync('esbuild', ['--version']);
        if (esbuild.status === 0 && !esbuild.error) {
          return {
            isLocal: false,
            version: esbuild.stdout.toString().trim(),
          };
        }
        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }

  public abstract readonly isLocal: boolean;
  public abstract readonly version: string;
}
