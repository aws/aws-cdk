import cdk = require('@aws-cdk/cdk');
import { CodePipelineBuildArtifacts } from './artifacts';
import { CommonProjectProps, Project } from './project';
import { CodePipelineSource } from './source';

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
      artifacts: new CodePipelineBuildArtifacts(),
      ...props
    });
  }
}
