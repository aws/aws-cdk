import * as ecr from '@aws-cdk/aws-ecr';
import * as assets from "@aws-cdk/aws-ecr-assets";
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Model } from './model';
import { FactName, RegionInfo } from "@aws-cdk/region-info";

const mappingName = "AwsDeepLearningContainersRepositoriesAccounts";

/**
 * The configuration for creating a container image.
 */
export interface ContainerImageConfig {
    /**
     * The image name. Images in Amazon ECR repositories can be specified by either using the full registry/repository:tag or
     * registry/repository@digest.
     *
     * For example, 012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>:latest or
     * 012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>@sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE.
     */
    readonly imageName: string;
}

/**
 * Constructs for types of container images
 */
export abstract class ContainerImage {
    /**
     * Reference an image that's constructed directly from sources on disk
     *
     * @param scope The scope within which to create the image asset
     * @param id The id to assign to the image asset
     * @param props The properties of a Docker image asset
     */
    public static fromAsset(
        scope: cdk.Construct,
        id: string,
        props: assets.DockerImageAssetProps,
    ): ContainerImage {
        return new AssetImage(scope, id, props);
    }

    /**
     * Reference an image in an ECR repository
     */
    public static fromEcrRepository(repository: ecr.IRepository, tag = "latest"): ContainerImage {
        return new EcrImage(repository, tag);
    }

    /**
     * Reference an AWS Deep Learning Container image
     */
    public static fromDlc(repositoryName: string, tag : string): ContainerImage {
        return new DlcEcrImage(repositoryName, tag);
    }

    /**
     * Called when the image is used by a Model
     */
    public abstract bind(scope: cdk.Construct, model: Model): ContainerImageConfig;
}

class AssetImage extends ContainerImage {
    private readonly asset: assets.DockerImageAsset;

    constructor(
        readonly scope: cdk.Construct,
        readonly id: string,
        readonly props: assets.DockerImageAssetProps,
    ) {
        super();
        this.asset = new assets.DockerImageAsset(scope, id, props);
    }

    public bind(_scope: cdk.Construct, model: Model): ContainerImageConfig {
        this.asset.repository.grantPull(model);

        return {
            imageName: this.asset.imageUri,
        };
    }
}

class EcrImage extends ContainerImage {
    constructor(private readonly repository: ecr.IRepository, private readonly tag: string) {
        super();
    }

    public bind(_scope: cdk.Construct, model: Model): ContainerImageConfig {
        this.repository.grantPull(model);

        return {
            imageName: this.repository.repositoryUriForTag(this.tag),
        };
    }
}

export class DlcEcrImage extends ContainerImage {
    public repository: ecr.IRepository;
    public readonly imageId: string;
    private readonly accountExpression: string;

    constructor(
        private readonly repositoryName: string,
        tag: string,
        private readonly account?: string,
    ) {
        super();
        this.accountExpression =
            account ?? cdk.Fn.findInMap(mappingName, cdk.Aws.REGION, "repositoryAccount");
        this.imageId = `${this.accountExpression}.dkr.ecr.${cdk.Aws.REGION}.${cdk.Aws.URL_SUFFIX}/${repositoryName}:${tag}`;
    }

    public bind(scope: cdk.Construct, model: Model): ContainerImageConfig {
        if (!this.account) {
            const scopeStack = cdk.Stack.of(scope);
            // Unfortunately, the account IDs of the DLC repositories are not the same in all regions.
            // For that reason, use a (singleton) Mapping to find the correct account.
            if (!scopeStack.node.tryFindChild(mappingName)) {
                const mapping: { [k1: string]: { [k2: string]: any } } = {};
                // get the accounts from the region-info module
                const region2Accounts = RegionInfo.regionMap(FactName.DLC_REPOSITORY_ACCOUNT);
                for (const [region, account] of Object.entries(region2Accounts)) {
                    mapping[region] = { repositoryAccount: account };
                }
                new cdk.CfnMapping(scopeStack, mappingName, { mapping });
            }
        }

        this.repository = ecr.Repository.fromRepositoryAttributes(scope, "DlcRepository", {
            repositoryName: this.repositoryName,
            repositoryArn: ecr.Repository.arnForLocalRepository(
                this.repositoryName,
                scope,
                this.accountExpression,
            ),
        });

        return { imageName: this.imageId };
    }

    public grantPull(grantable: iam.IGrantable): void {
        this.repository.grantPull(grantable);
    }
}
