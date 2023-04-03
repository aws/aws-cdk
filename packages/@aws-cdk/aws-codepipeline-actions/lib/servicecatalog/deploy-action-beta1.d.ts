import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Construction properties of the `ServiceCatalogDeployActionBeta1 ServiceCatalog deploy CodePipeline Action`.
 */
export interface ServiceCatalogDeployActionBeta1Props extends codepipeline.CommonAwsActionProps {
    /**
     * The path to the cloudformation artifact.
     */
    readonly templatePath: codepipeline.ArtifactPath;
    /**
     * The name of the version of the Service Catalog product to be deployed.
     */
    readonly productVersionName: string;
    /**
     * The optional description of this version of the Service Catalog product.
     * @default ''
     */
    readonly productVersionDescription?: string;
    /**
     * The identifier of the product in the Service Catalog. This product must already exist.
     */
    readonly productId: string;
}
/**
 * CodePipeline action to connect to an existing ServiceCatalog product.
 *
 * **Note**: this class is still experimental, and may have breaking changes in the future!
 */
export declare class ServiceCatalogDeployActionBeta1 extends Action {
    private readonly templatePath;
    private readonly productVersionName;
    private readonly productVersionDescription?;
    private readonly productId;
    private readonly productType;
    constructor(props: ServiceCatalogDeployActionBeta1Props);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
