export interface MonoRepo {
  directory: string;
  packages: Record<string, MonoRepoPackage>;
}

export interface MonoRepoPackage {
  name: string;
  directory: string;
}

/**
 * Build inputs of any given package
 */
export interface BuildInputs {
  /**
   * Root directory of this package
   */
  rootDirectory: string;

  /**
   * Source files that go into building this packages
   */
  sourceFiles: string[];

  /**
   * Names and versions of dependencies used by this package
   */
  externalDependencyVersion: Record<string, string>;

  /**
   * Names of packages inside the monorepo used by this package
   */
  internalDependencyNames: string[];
}

export type AllBuildInputs = Record<string, BuildInputs>;