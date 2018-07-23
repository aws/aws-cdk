import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import { RepositoryRef } from './repository';

/**
 * Construction properties of the {@link PipelineSource CodeCommit source CodePipeline Action}.
 */
export interface PipelineSourceProps {
    /**
     * The name of the source's output artifact. Output artifacts are used by CodePipeline as
     * inputs into other actions.
     */
    artifactName: string;

    /**
     * The CodeCommit repository.
     */
    repository: RepositoryRef;

    /**
     * @default 'master'
     */
    branch?: string;
    // TODO: use CloudWatch events instead
    /**
     * Whether or not AWS CodePipeline should poll for source changes
     *
     * @default true
     */
    pollForSourceChanges?: boolean;
}

/**
 * CodePipeline Source that is provided by an AWS CodeCommit repository.
 */
export class PipelineSource extends codepipeline.Source {
    constructor(parent: codepipeline.Stage, name: string, props: PipelineSourceProps) {
        super(parent, name, {
            provider: 'CodeCommit',
            configuration: {
                RepositoryName: props.repository.repositoryName,
                BranchName: props.branch || 'master',
                PollForSourceChanges: props.pollForSourceChanges || true
            },
            artifactName: props.artifactName
        });

        // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
        const actions = [
            'codecommit:GetBranch',
            'codecommit:GetCommit',
            'codecommit:UploadArchive',
            'codecommit:GetUploadArchiveStatus',
            'codecommit:CancelUploadArchive',
        ];

        parent.pipeline.addToRolePolicy(new cdk.PolicyStatement()
            .addResource(props.repository.repositoryArn)
            .addActions(...actions));
    }
}
