import { spawnSync } from 'child_process';
import { PackageManager } from './package-manager';
import { getModuleVersion } from './util';

/**
 * An esbuild installation
 */
export abstract class EsbuildInstallation {
  public static detect(packageManager: PackageManager): EsbuildInstallation | undefined {
    try {
      try {
        // Check local version first
        const version = getModuleVersion('esbuild');
        return {
          runner: packageManager.runBinCommand('esbuild'),
          version,
        };
      } catch (err) {
        // Fallback to a global version
        const esbuild = spawnSync('esbuild', ['--version']);
        if (esbuild.status === 0 && !esbuild.error) {
          return {
            runner: 'esbuild', // the bin is globally available
            version: esbuild.stdout.toString().trim(),
          };
        }
        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }

  public abstract readonly runner: string;
  public abstract readonly version: string;
}
