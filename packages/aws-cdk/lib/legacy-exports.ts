// This is the legacy symbols export file.
// We export a number of known symbols that are imported by users from the `aws-cdk` package.
// Importing these symbols was never officially supported, but here we are.
// See https://github.com/aws/aws-cdk/pull/33021 for more information.
//
// In package.json, section `exports`, we declare all known subpaths as an explicit subpath export resolving to this file.
// This way existing unsanctioned imports don't break immediately.
//
// When attempting to import a subpath other than the explicitly exported ones, the following runtime error will be thrown:
// Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './lib/private/subpath' is not defined by "exports" in aws-cdk/package.json
//
// TypeScript can warn users about the not-exported subpath at compile time. However it requires a reasonably modern tsconfig.json.
// Specifically `moduleResolution` must be set to either "node16" or "nodenext".

// We need to import the legacy exports via index.ts
// This is because we will bundle all code and dependencies into index.js at build time.
// It's the only place where the code exists as a working, self-contained copy.
// While we could have bundled `legacy-exports.ts` separately, it would create an other copy of the pretty much identical bundle
// and add an additional 16mb+ to the published package.
// To avoid this, we deduplicated the bundled code and run everything through index.ts.
import { legacy } from './index';

// We also need to re-export some types
// These don't need to participate in the bundling, so we can just put them here
export type { Obj } from './util';
export type { Account } from './api/aws-auth';
export type { ContextProviderPlugin } from './api/plugin';
export type { BootstrapEnvironmentOptions, BootstrapSource } from './api/bootstrap';
export type { StackSelector } from './api/cxapp/cloud-assembly';
export type { DeployStackResult } from './api/deployments';
export type { Component } from './notices';
export type { LoggerFunction } from './legacy-logging-source';

// Re-export all symbols via index.js
// We do this, because index.js is the the fail that will end up with all dependencies bundled
export const {
  deepClone,
  flatten,
  ifDefined,
  isArray,
  isEmpty,
  numberFromBool,
  partition,
  deployStack,
  cli,
  exec,
  SdkProvider,
  PluginHost,
  contentHash,
  Command,
  Configuration,
  PROJECT_CONTEXT,
  Settings,
  Bootstrapper,
  CloudExecutable,
  execProgram,
  RequireApproval,
  leftPad,
  formatAsBanner,
  enableTracing,
  aliases,
  command,
  describe,
  lowerCaseFirstCharacter,
  deepMerge,
  Deployments,
  rootDir,
  latestVersionIfHigher,
  versionNumber,
  availableInitTemplates,
  cached,
  CfnEvaluationException,
  CredentialPlugins,
  AwsCliCompatible,
  withCorkedLogging,
  LogLevel,
  logLevel,
  CI,
  setLogLevel,
  setCI,
  increaseVerbosity,
  trace,
  debug,
  error,
  warning,
  success,
  highlight,
  print,
  data,
  prefix,
} = legacy;
