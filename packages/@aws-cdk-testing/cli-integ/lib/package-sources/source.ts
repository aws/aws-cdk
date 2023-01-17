export interface IPackageSourceSetup {
  readonly name: string;
  readonly description: string;

  prepare(): Promise<void>;
  cleanup(): Promise<void>;
}

export interface IPackageSource {
  makeCliAvailable(): Promise<void>;

  assertJsiiPackagesAvailable(): void;
  majorVersion(): string;

  initializeDotnetPackages(targetDir: string): Promise<void>;

  /**
   * Framework version if it's different than the CLI version
   *
   * Not all tests will respect this.
   */
  requestedFrameworkVersion(): string;

  /**
   * Versions of alpha packages if different than the CLI version
   *
   * Not all tests will respect this.
   */
  requestedAlphaVersion(): string;
}