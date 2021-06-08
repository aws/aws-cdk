import * as cp from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { ArtifactMap } from './artifact-map';

export interface CodePipelineActionOptions {
  readonly scope: Construct;
  readonly actionName: string;
  readonly runOrder: number;
  readonly artifacts: ArtifactMap;
}

/**
 * Factory for explicit CodePipeline Actions
 *
 * Indirection because some aspects of the Action creation need to be controlled by the workflow engine (name and
 * runOrder). All the rest of the properties are controlled by the factory.
 */
export interface ICodePipelineActionFactory {
  produce(options: CodePipelineActionOptions): cp.IAction;
}