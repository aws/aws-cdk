import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * The CodePipeline variables emitted by the ECR source Action.
 */
export interface EcrSourceVariables {
    /** The identifier of the registry. In ECR, this is usually the ID of the AWS account owning it. */
    readonly registryId: string;
    /** The physical name of the repository that this action tracks. */
    readonly repositoryName: string;
    /** The digest of the current image, in the form '<digest type>:<digest value>'. */
    readonly imageDigest: string;
    /** The Docker tag of the current image. */
    readonly imageTag: string;
    /** The full ECR Docker URI of the current image. */
    readonly imageUri: string;
}
/**
 * Construction properties of `EcrSourceAction`.
 */
export interface EcrSourceActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * The image tag that will be checked for changes.
     *
     * It is not possible to trigger on changes to more than one tag.
     *
     * @default 'latest'
     */
    readonly imageTag?: string;
    /**
     *
     */
    readonly output: codepipeline.Artifact;
    /**
     * The repository that will be watched for changes.
     */
    readonly repository: ecr.IRepository;
}
/**
 * The ECR Repository source CodePipeline Action.
 *
 * Will trigger the pipeline as soon as the target tag in the repository
 * changes, but only if there is a CloudTrail Trail in the account that
 * captures the ECR event.
 */
export declare class EcrSourceAction extends Action {
    private readonly props;
    constructor(props: EcrSourceActionProps);
    /** The variables emitted by this action. */
    get variables(): EcrSourceVariables;
    protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
