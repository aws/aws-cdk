import * as cb from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { BlueprintQueries } from '../blueprint';
import { ArtifactMap } from './artifact-map';
import { CodeBuildProjectOptions } from './codepipeline-engine';

export interface CodePipelineActionOptions {
  /**
   * Scope in which to create constructs
   */
  readonly scope: Construct;

  /**
   * Name the action should get
   */
  readonly actionName: string;

  /**
   * RunOrder the action should get
   */
  readonly runOrder: number;

  /**
   * Helper object to translate Blueprint FileSets to CodePipeline Artifacts
   */
  readonly artifacts: ArtifactMap;

  /**
   * An input artifact that CodeBuild projects that don't actually need an input artifact can use
   *
   * CodeBuild Projects MUST have an input artifact in order to be added to the Pipeline. If
   * the Project doesn't actually care about its input (it can be anything), it can use the
   * Artifact passed here.
   *
   * @default - A fallback artifact does not exist
   */
  readonly fallbackArtifact?: cp.Artifact;

  /**
   * Queries to perform on the blueprint
   */
  readonly queries: BlueprintQueries;

  /**
   * If this action factory creates a CodeBuild step, default options to inherit
   *
   * @default - No CodeBuild project defaults
   */
  readonly codeBuildDefaults?: CodeBuildProjectOptions;
}

/**
 * Factory for explicit CodePipeline Actions
 *
 * Indirection because some aspects of the Action creation need to be controlled by the workflow engine (name and
 * runOrder). All the rest of the properties are controlled by the factory.
 */
export interface ICodePipelineActionFactory {
  produce(options: CodePipelineActionOptions): CodePipelineActionFactoryResult;
}

export interface CodePipelineActionFactoryResult {
  readonly action: cp.IAction;
  readonly project?: cb.IProject;
}