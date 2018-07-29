import codebuild = require('@aws-cdk/aws-codebuild');
import cdk = require('@aws-cdk/cdk');

// tslint:disable-next-line:no-empty-interface
export interface PipelineProjectProps extends codebuild.CommonProjectProps {
}

/**
 * A convenience class for CodeBuild Projects that are used in CodePipeline.
 */
export class PipelineProject extends codebuild.Project {
    constructor(parent: cdk.Construct, id: string, props?: PipelineProjectProps) {
        super(parent, id, {
            source: new codebuild.CodePipelineSource(),
            artifacts: new codebuild.CodePipelineBuildArtifacts(),
            ...props
        });
    }
}
