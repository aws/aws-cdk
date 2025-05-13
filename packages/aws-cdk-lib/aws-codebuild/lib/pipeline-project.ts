import { Construct } from 'constructs';
import { CodePipelineArtifacts } from './codepipeline-artifacts';
import { CodePipelineSource } from './codepipeline-source';
import { CommonProjectProps, Project } from './project';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

export interface PipelineProjectProps extends CommonProjectProps {
}

/**
 * A convenience class for CodeBuild Projects that are used in CodePipeline.
 */
@propertyInjectable
export class PipelineProject extends Project {
  constructor(scope: Construct, id: string, props?: PipelineProjectProps) {
    super(scope, id, {
      source: new CodePipelineSource(),
      artifacts: new CodePipelineArtifacts(),
      ...props,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }

  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codebuild.PipelineProject';
}
