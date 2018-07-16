import { Source, Stage } from '@aws-cdk/codepipeline';
import { PolicyStatement } from '@aws-cdk/core';
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
export class PipelineSource extends Source {
    constructor(parent: Stage, name: string, props: PipelineSourceProps) {
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

        parent.pipeline.addToRolePolicy(new PolicyStatement()
            .addResource(props.repository.repositoryArn)
            .addActions(...actions));
    }
}
