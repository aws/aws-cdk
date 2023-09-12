import { Construct } from 'constructs';
import { IEcsContainerDefinition } from './ecs-container-definition';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IJobQueue } from './job-queue';
/**
 * A JobDefinition that uses ECS orchestration
 */
interface IEcsJobDefinition extends IJobDefinition {
    /**
     * The container that this job will run
     */
    readonly container: IEcsContainerDefinition;
    /**
     * Whether to propogate tags from the JobDefinition
     * to the ECS task that Batch spawns
     *
     * @default false
     */
    readonly propagateTags?: boolean;
}
/**
 * @internal
 */
export declare enum Compatibility {
    EC2 = "EC2",
    FARGATE = "FARGATE"
}
/**
 * Props for EcsJobDefinition
 */
export interface EcsJobDefinitionProps extends JobDefinitionProps {
    /**
     * The container that this job will run
     */
    readonly container: IEcsContainerDefinition;
    /**
     * Whether to propogate tags from the JobDefinition
     * to the ECS task that Batch spawns
     *
     * @default false
     */
    readonly propagateTags?: boolean;
}
/**
 * A JobDefinition that uses ECS orchestration
 *
 * @resource AWS::Batch::JobDefinition
 */
export declare class EcsJobDefinition extends JobDefinitionBase implements IEcsJobDefinition {
    /**
     * Import a JobDefinition by its arn.
     */
    static fromJobDefinitionArn(scope: Construct, id: string, jobDefinitionArn: string): IJobDefinition;
    private static getJobDefinitionName;
    readonly container: IEcsContainerDefinition;
    readonly propagateTags?: boolean;
    readonly jobDefinitionArn: string;
    readonly jobDefinitionName: string;
    constructor(scope: Construct, id: string, props: EcsJobDefinitionProps);
    /**
     * Grants the `batch:submitJob` permission to the identity on both this job definition and the `queue`
    */
    grantSubmitJob(identity: iam.IGrantable, queue: IJobQueue): void;
    private renderPlatformCapabilities;
}
export {};
