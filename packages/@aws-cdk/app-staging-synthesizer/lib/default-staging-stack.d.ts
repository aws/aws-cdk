import { App, DockerImageAssetSource, Duration, FileAssetSource, ISynthesisSession, Stack, StackProps } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BootstrapRole } from './bootstrap-roles';
import { FileStagingLocation, IStagingResources, IStagingResourcesFactory, ImageStagingLocation } from './staging-stack';
/**
 * User configurable options to the DefaultStagingStack.
 */
export interface DefaultStagingStackOptions {
    /**
     * A unique identifier for the application that the staging stack belongs to.
     *
     * This identifier will be used in the name of staging resources
     * created for this application, and should be unique across CDK apps.
     *
     * The identifier should include lowercase characters and dashes ('-') only
     * and have a maximum of 20 characters.
     */
    readonly appId: string;
    /**
     * Explicit name for the staging bucket
     *
     * @default - a well-known name unique to this app/env.
     */
    readonly stagingBucketName?: string;
    /**
     * Pass in an existing role to be used as the file publishing role.
     *
     * @default - a new role will be created
     */
    readonly fileAssetPublishingRole?: BootstrapRole;
    /**
     * Pass in an existing role to be used as the image publishing role.
     *
     * @default - a new role will be created
     */
    readonly imageAssetPublishingRole?: BootstrapRole;
    /**
     * The lifetime for handoff file assets.
     *
     * Assets that are only necessary at deployment time (for instance,
     * CloudFormation templates and Lambda source code bundles) will be
     * automatically deleted after this many days. Assets that may be
     * read from the staging bucket during your application's run time
     * will not be deleted.
     *
     * Set this to the length of time you wish to be able to roll back to
     * previous versions of your application without having to do a new
     * `cdk synth` and re-upload of assets.
     *
     * @default - Duration.days(30)
     */
    readonly handoffFileAssetLifetime?: Duration;
    /**
     * The maximum number of image versions to store in a repository.
     *
     * Previous versions of an image can be stored for rollback purposes.
     * Once a repository has more than 3 image versions stored, the oldest
     * version will be discarded. This allows for sensible garbage collection
     * while maintaining a few previous versions for rollback scenarios.
     *
     * @default - up to 3 versions stored
     */
    readonly imageAssetVersionCount?: number;
}
/**
 * Default Staging Stack Properties
 */
export interface DefaultStagingStackProps extends DefaultStagingStackOptions, StackProps {
    /**
     * The ARN of the deploy action role, if given
     *
     * This role will need permissions to read from to the staging resources.
     *
     * @default - The CLI credentials are assumed, no additional permissions are granted.
     */
    readonly deployRoleArn?: string;
    /**
     * The qualifier used to specialize strings
     *
     * Shouldn't be necessary but who knows what people might do.
     */
    readonly qualifier: string;
}
/**
 * A default Staging Stack that implements IStagingResources.
 */
export declare class DefaultStagingStack extends Stack implements IStagingResources {
    private readonly props;
    /**
     * Return a factory that will create DefaultStagingStacks
     */
    static factory(options: DefaultStagingStackOptions): IStagingResourcesFactory;
    /**
     * Default asset publishing role name for file (S3) assets.
     */
    private get fileRoleName();
    /**
     * Default asset publishing role name for docker (ECR) assets.
     */
    private get imageRoleName();
    /**
     * The app-scoped, evironment-keyed staging bucket.
     */
    readonly stagingBucket?: s3.Bucket;
    /**
     * The app-scoped, environment-keyed ecr repositories associated with this app.
     */
    readonly stagingRepos: Record<string, ecr.Repository>;
    /**
     * The stack to add dependencies to.
     */
    readonly dependencyStack: Stack;
    private readonly appId;
    private readonly stagingBucketName?;
    /**
     * File publish role ARN in asset manifest format
     */
    private readonly providedFileRole?;
    private fileRole?;
    private fileRoleManifestArn?;
    /**
     * Image publishing role ARN in asset manifest format
     */
    private readonly providedImageRole?;
    private imageRole?;
    private didImageRole;
    private imageRoleManifestArn?;
    private readonly deployRoleArn?;
    constructor(scope: App, id: string, props: DefaultStagingStackProps);
    private validateAppId;
    private ensureFileRole;
    private ensureImageRole;
    private createBucketKey;
    private getCreateBucket;
    /**
     * Returns the well-known name of the repo
     */
    private getCreateRepo;
    addFile(asset: FileAssetSource): FileStagingLocation;
    addDockerImage(asset: DockerImageAssetSource): ImageStagingLocation;
    /**
     * Synthesizes the cloudformation template into a cloud assembly.
     * @internal
     */
    _synthesizeTemplate(session: ISynthesisSession, lookupRoleArn?: string | undefined): void;
}
