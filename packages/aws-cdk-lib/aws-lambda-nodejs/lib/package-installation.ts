import { spawnSync } from 'child_process';
import * as path from 'path';
import { tryGetModuleVersionFromRequire } from './util';

/**
 * Package installation
 */
export abstract class PackageInstallation {
  /**
   * Detects an installation of a module
   *
   * When the module cannot be required from the location of `aws-cdk-lib` but
   * is installed for `projectDir`, the module's command must run from
   * `projectDir`, which is returned as `cwd`.
   */
  public static detect(module: string, projectDir?: string): PackageInstallation | undefined {
    try {
      // Check local version first
      const version = tryGetModuleVersionFromRequire(module);
      if (version) {
        return {
          isWorkspacePackage: true,
          version,
        };
      }

      // Then a version installed for the project, for example in an npm
      // workspace that does not hoist the module next to aws-cdk-lib
      if (projectDir) {
        const projectVersion = tryGetModuleVersionFromRequire(module, path.join(projectDir, 'package.json'));
        if (projectVersion) {
          return {
            isWorkspacePackage: true,
            version: projectVersion,
            cwd: projectDir,
          };
        }
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

  /**
   * The directory to run the module's command from
   *
   * @default - the project root
   */
  public abstract readonly cwd?: string;
}
