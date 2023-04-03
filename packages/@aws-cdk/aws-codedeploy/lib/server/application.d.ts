import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a reference to a CodeDeploy Application deploying to EC2/on-premise instances.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the `ServerApplication` class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the `#fromServerApplicationName` method.
 */
export interface IServerApplication extends IResource {
    /** @attribute */
    readonly applicationArn: string;
    /** @attribute */
    readonly applicationName: string;
}
/**
 * Construction properties for `ServerApplication`.
 */
export interface ServerApplicationProps {
    /**
     * The physical, human-readable name of the CodeDeploy Application.
     *
     * @default an auto-generated name will be used
     */
    readonly applicationName?: string;
}
/**
 * A CodeDeploy Application that deploys to EC2/on-premise instances.
 *
 * @resource AWS::CodeDeploy::Application
 */
export declare class ServerApplication extends Resource implements IServerApplication {
    /**
     * Import an Application defined either outside the CDK app, or in a different region.
     *
     * The Application's account and region are assumed to be the same as the stack it is being imported
     * into. If not, use `fromServerApplicationArn`.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param serverApplicationName the name of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromServerApplicationName(scope: Construct, id: string, serverApplicationName: string): IServerApplication;
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param serverApplicationArn the ARN of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromServerApplicationArn(scope: Construct, id: string, serverApplicationArn: string): IServerApplication;
    readonly applicationArn: string;
    readonly applicationName: string;
    constructor(scope: Construct, id: string, props?: ServerApplicationProps);
}
