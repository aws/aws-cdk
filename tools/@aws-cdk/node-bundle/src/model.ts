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

/**
 * Violations pertaining resources that need to be embedded in the bundle.
 */
export interface ResourceViolations {
  /**
   * Resources that were defined in the configuration but could not be located.
   */
  readonly missing?: string[];
  /**
   * Resources that are defined with an absolute path.
   */
  readonly absolute?: string[];
}

/**
 * Violations pertaining the NOTICE file of the package.
 */
export interface NoticeViolations {
  /**
   * Attributions that have multiple licenses.
   */
  readonly multiLicense?: Attribution[];
  /**
   * Attributions that have no license.
   */
  readonly noLicense?: Attribution[];
  /**
   * Attributions that have an invalid license.
   */
  readonly invalidLicense?: Attribution[];
  /**
   * Attributions that are missing.
   */
  readonly missing?: Attribution[];
  /**
   * Attributions that unnecessary.
   */
  readonly unnecessary?: Attribution[];
}

/**
 * Violations pertaining the import statements of a package.
 */
export interface CircularImportsViolations {
  /**
   * Contains an aggregated summary of all circular imports.
   * If no violations are found, this will be undefined.
   */
  readonly summary?: string;
}

/**
 * Violations a bundle exhibits.
 */
export interface BundleViolations {
  /**
   * The NOTICE file violations.
   */
  readonly notice?: NoticeViolations;
  /**
   * The imports violations.
   */
  readonly imports?: CircularImportsViolations;
  /**
   * The resource violations.
   */
  readonly resource?: ResourceViolations;
}