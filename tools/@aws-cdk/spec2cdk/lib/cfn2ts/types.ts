/* eslint-disable import/no-extraneous-dependencies */
import * as pkglint from '@aws-cdk/pkglint';

export interface CodeGeneratorOptions {
  /**
   * Automatically generate service suffixes
   *
   * @default false
   */
  readonly autoGenerateSuffixes?: boolean;
}

/**
 * Configuration options for the generateAll function
 */
export interface GenerateAllOptions extends CodeGeneratorOptions {
  /**
   * Path of the file containing the map of module names to their CFN Scopes
   */
  scopeMapPath: string;

  /**
   * List of service names to be skipped it will be in format AWS::Service like AWS::S3
   */
  skippedServices?: string[];
}

/**
 * A data structure holding information about a single scope in a generated module.
 */
export interface ModuleMapScope {
  readonly namespace: string;
  readonly suffix?: string;
  readonly deprecated?: string;
}

/**
 * A data structure holding information about a generated module.
 */
export interface ModuleMapEntry {
  name: string;
  definition?: pkglint.ModuleDefinition;
  scopes: ModuleMapScope[];
  resources: Record<string, string>;
  files: string[];
}

/**
 * A data structure holding information about generated modules.
 *
 * It maps module names to their full module definition, CFN scopes, resources and generated files.
 */
export interface ModuleMap {
  [moduleName: string]: ModuleMapEntry;
}
