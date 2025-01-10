import { Construct } from 'constructs';
import { CodePipelineArtifacts } from './codepipeline-artifacts';
import { CodePipelineSource } from './codepipeline-source';
import { CommonProjectProps, Project } from './project';
import { MetadataType } from '../../core/lib/metadata-resource';

export interface PipelineProjectProps extends CommonProjectProps {
}

/**
 * A convenience class for CodeBuild Projects that are used in CodePipeline.
 */
export class PipelineProject extends Project {
  constructor(scope: Construct, id: string, props?: PipelineProjectProps) {
    super(scope, id, {
      source: new CodePipelineSource(),
      artifacts: new CodePipelineArtifacts(),
      ...props,
    });
    this.node.addMetadata(MetadataType.CONSTRUCT, props);
  }
}
