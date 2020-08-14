import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export function hasDependencies(entry: string): boolean {
  return getDependenciesType(entry) != DependencyType.NONE;
}

export interface InstallDependenciesCommandsOptions {
  entry: string;
  runtime: lambda.Runtime;
  outputPath: string;
}

export function installDependenciesCommands(options: InstallDependenciesCommandsOptions): string[] {
  const entry = options.entry;

  const dependenciesType = getDependenciesType(entry);

  switch (dependenciesType) {
    case DependencyType.REQUIREMENTS:
      return pipInstallCommands(options);
    case DependencyType.PIPENV:
      return pipenvInstallCommands(options);
    case DependencyType.NONE:
      return [];
    default:
      throw new Error('Unsupported dependencies type');
  }
}

export enum DependencyType {
  NONE = 'none',
  REQUIREMENTS = 'requirements',
  PIPENV = 'pipenv',
}

export function getDependenciesType(entry: string): DependencyType {
  if (fs.existsSync(path.join(entry, 'Pipfile'))) {
    return DependencyType.PIPENV;
  }

  if (fs.existsSync(path.join(entry, 'requirements.txt'))) {
    return DependencyType.REQUIREMENTS;
  }

  return DependencyType.NONE;
}

interface PipInstallCommandsOptions extends InstallDependenciesCommandsOptions {
  requirementsTxtPath?: string;
}

export function pipInstallCommands(options: PipInstallCommandsOptions): string[] {
  const runtime = options.runtime;
  const requirementsTxtPath = options.requirementsTxtPath ?? 'requirements.txt';
  const outputPath = options.outputPath ?? cdk.AssetStaging.BUNDLING_OUTPUT_DIR;
  const pipCommand = getPipCommand(runtime);

  return [
    `${pipCommand} install -r ${requirementsTxtPath} -t ${outputPath}`,
  ];
}

export function getPipCommand(runtime: lambda.Runtime): string {
  return runtime === lambda.Runtime.PYTHON_2_7 ? PipCommand.PIP : PipCommand.PIP3;
}

enum PipCommand {
  /**
   * Used by Runtime.PYTHON_2_7
   */
  PIP = 'pip',

  /**
   * Used for Runtimes other than 2.7
   */
  PIP3 = 'pip3',
}

export function pipenvInstallCommands(options: InstallDependenciesCommandsOptions) {
  const pipenvCommand = 'HOME=/tmp/pipenv python -m pipenv';
  const requirementsTxtPath = '/tmp/requirements.txt';

  return [
    `${pipenvCommand} lock -r >${requirementsTxtPath}`,
    ...pipInstallCommands({ ...options, requirementsTxtPath }),
  ];
}
