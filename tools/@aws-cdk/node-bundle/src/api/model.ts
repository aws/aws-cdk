/**
 * Dependency of a specific package on the local file system.
 */
export interface Dependency {
  /**
   * Path of the dependency on the local file system.
   */
  readonly path: string;
  /**
   * Dependency name.
   */
  readonly name: string;
  /**
   * Dependency version.
   */
  readonly version: string;
}

/**
 * Attribution of a specific dependency.
 */
export interface Attribution {
  /**
   * Attributed package (name + version)
   */
  readonly package: string;
  /**
   * URL to the package.
   */
  readonly url: string;
  /**
   * Package license.
   */
  readonly license?: string;
  /**
   * Package license content.
   */
  readonly licenseText?: string;
}
