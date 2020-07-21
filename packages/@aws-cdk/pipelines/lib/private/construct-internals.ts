/**
 * Get access to construct internals that we need but got removed from the Stages PR.
 */
import { App, IConstruct, Stage } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as path from 'path';

export function appOf(construct: IConstruct): App {
  const root = construct.node.root;

  if (!App.isApp(root)) {
    throw new Error(`Construct must be created under an App, but is not: ${construct.node.path}`);
  }

  return root;
}

export function assemblyBuilderOf(stage: Stage): cxapi.CloudAssemblyBuilder {
  return (stage as any)._assemblyBuilder;
}

/**
 * Return the relative path from the app assembly to the scope's (nested) assembly
 */
export function embeddedAsmPath(scope: IConstruct) {
  const appAsmRoot = assemblyBuilderOf(appOf(scope)).outdir;
  const stage = Stage.of(scope) ?? appOf(scope);
  const stageAsmRoot = assemblyBuilderOf(stage).outdir;
  return path.relative(appAsmRoot, stageAsmRoot) || '.';
}

/**
 * Determine the directory where the cloud assembly will be written, for use in a BuildSpec
 */
export function cloudAssemblyBuildSpecDir(scope: IConstruct) {
  return assemblyBuilderOf(appOf(scope)).outdir;
}