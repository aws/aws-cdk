import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a reference to a CodeDeploy Application deploying to Amazon ECS.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the `EcsApplication` class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the `EcsApplication#fromEcsApplicationName` method.
 */
export interface IEcsApplication extends IResource {
    /** @attribute */
    readonly applicationArn: string;
    /** @attribute */
    readonly applicationName: string;
}
/**
 * Construction properties for `EcsApplication`.
 */
export interface EcsApplicationProps {
    /**
     * The physical, human-readable name of the CodeDeploy Application.
     *
     * @default an auto-generated name will be used
     */
    readonly applicationName?: string;
}
/**
 * A CodeDeploy Application that deploys to an Amazon ECS service.
 *
 * @resource AWS::CodeDeploy::Application
 */
export declare class EcsApplication extends Resource implements IEcsApplication {
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack.
     *
     * The Application's account and region are assumed to be the same as the stack it is being imported
     * into. If not, use `fromEcsApplicationArn`.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param ecsApplicationName the name of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromEcsApplicationName(scope: Construct, id: string, ecsApplicationName: string): IEcsApplication;
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param ecsApplicationArn the ARN of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromEcsApplicationArn(scope: Construct, id: string, ecsApplicationArn: string): IEcsApplication;
    readonly applicationArn: string;
    readonly applicationName: string;
    constructor(scope: Construct, id: string, props?: EcsApplicationProps);
}
