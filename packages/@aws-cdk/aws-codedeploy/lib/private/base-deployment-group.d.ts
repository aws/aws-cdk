import * as iam from '@aws-cdk/aws-iam';
import { Resource, IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IBaseDeploymentConfig } from '../base-deployment-config';
import { CfnDeploymentGroup } from '../codedeploy.generated';
/**
 * Structural typing, not jsii compatible but doesn't need to be
 */
interface IApplicationLike extends IResource {
    readonly applicationArn: string;
    readonly applicationName: string;
}
/**
 */
export interface ImportedDeploymentGroupBaseProps {
    /**
     * The reference to the CodeDeploy Application that this Deployment Group belongs to.
     */
    readonly application: IApplicationLike;
    /**
     * The physical, human-readable name of the CodeDeploy Deployment Group
     * that we are referencing.
     *
     * @default Either deploymentGroupName or deploymentGroupArn is required
     */
    readonly deploymentGroupName: string;
}
/**
 * @internal
 */
export declare class ImportedDeploymentGroupBase extends Resource {
    readonly deploymentGroupName: string;
    readonly deploymentGroupArn: string;
    constructor(scope: Construct, id: string, props: ImportedDeploymentGroupBaseProps);
    /**
     * Bind DeploymentGroupConfig to the current group, if supported
     *
     * @internal
     */
    protected _bindDeploymentConfig(config: IBaseDeploymentConfig): IBaseDeploymentConfig;
}
export interface DeploymentGroupBaseProps {
    /**
     * The physical, human-readable name of the CodeDeploy Deployment Group.
     *
     * @default An auto-generated name will be used.
     */
    readonly deploymentGroupName?: string;
    /**
     * The service Role of this Deployment Group.
     *
     * @default A new Role will be created.
     */
    readonly role?: iam.IRole;
    /**
     * Id of the role construct, if created by this construct
     *
     * Exists because when we factored this out, there was a difference between the
     * 3 deployment groups.
     */
    readonly roleConstructId: string;
}
/**
 * @internal
 */
export declare class DeploymentGroupBase extends Resource {
    /**
     * The name of the Deployment Group.
     */
    readonly deploymentGroupName: string;
    /**
     * The ARN of the Deployment Group.
     */
    readonly deploymentGroupArn: string;
    /**
     * The service Role of this Deployment Group.
     *
     * (Can't make `role` properly public here, as it's typed as optional in one
     * interface and typing it here as definitely set interferes with that.)
     *
     * @internal
     */
    readonly _role: iam.IRole;
    constructor(scope: Construct, id: string, props: DeploymentGroupBaseProps);
    /**
     * Bind DeploymentGroupConfig to the current group, if supported
     *
     * @internal
     */
    protected _bindDeploymentConfig(config: IBaseDeploymentConfig): IBaseDeploymentConfig;
    /**
     * Set name and ARN properties.
     *
     * Must be called in the child constructor.
     *
     * @internal
     */
    protected _setNameAndArn(resource: CfnDeploymentGroup, application: IApplicationLike): void;
}
export {};
