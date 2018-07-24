import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import { BuildProjectRef } from './project';

/**
 * Construction properties of the {@link PipelineBuildAction CodeBuild build CodePipeline Action}.
 */
export interface PipelineBuildActionProps {
    /**
     * The source to use as input for this build
     */
    inputArtifact: codepipeline.Artifact;

    /**
     * The name of the build's output artifact
     */
    artifactName?: string;

    /**
     * The build project
     */
    project: BuildProjectRef;
}

/**
 * CodePipeline build Action that uses AWS CodeBuild.
 */
export class PipelineBuildAction extends codepipeline.BuildAction {
    constructor(parent: codepipeline.Stage, name: string, props: PipelineBuildActionProps) {
        // This happened when ProjectName was accidentally set to the project's ARN:
        // https://qiita.com/ikeisuke/items/2fbc0b80b9bbd981b41f

        super(parent, name, {
            provider: 'CodeBuild',
            inputArtifact: props.inputArtifact,
            artifactName: props.artifactName,
            configuration: {
                ProjectName: props.project.projectName
            }
        });

        const actions = [
            'codebuild:BatchGetBuilds',
            'codebuild:StartBuild',
            'codebuild:StopBuild',
        ];

        parent.pipeline.addToRolePolicy(new cdk.PolicyStatement()
            .addResource(props.project.projectArn)
            .addActions(...actions));

        // allow codebuild to read and write artifacts to the pipline's artifact bucket.
        parent.pipeline.artifactBucket.grantReadWrite(props.project.role);

        // policy must be added as a dependency to the pipeline!!
        // TODO: grants - build.addResourcePermission() and also make sure permission
        // includes the pipeline role AWS principal.
    }
}
