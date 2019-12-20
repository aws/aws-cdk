import * as cdk from '@aws-cdk/core';
import { CodePipelineArtifacts } from './codepipeline-artifacts';
import { CodePipelineSource } from './codepipeline-source';
import { CommonProjectProps, Project } from './project';

// tslint:disable-next-line:no-empty-interface
export interface PipelineProjectProps extends CommonProjectProps {
}

/**
 * A convenience class for CodeBuild Projects that are used in CodePipeline.
 */
export class PipelineProject extends Project {
  constructor(scope: cdk.Construct, id: string, props?: PipelineProjectProps) {
    super(scope, id, {
      source: new CodePipelineSource(),
      artifacts: new CodePipelineArtifacts(),
      ...props
    });
  }
}
