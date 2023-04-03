import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * The compute platform of the profiling group.
 */
export declare enum ComputePlatform {
    /**
     * Use AWS_LAMBDA if your application runs on AWS Lambda.
     */
    AWS_LAMBDA = "AWSLambda",
    /**
     * Use Default if your application runs on a compute platform that is not AWS Lambda,
     * such an Amazon EC2 instance, an on-premises server, or a different platform.
     */
    DEFAULT = "Default"
}
/**
 * IResource represents a Profiling Group.
 */
export interface IProfilingGroup extends IResource {
    /**
     * The name of the profiling group.
     *
     * @attribute
     */
    readonly profilingGroupName: string;
    /**
     * The ARN of the profiling group.
     *
     * @attribute
     */
    readonly profilingGroupArn: string;
    /**
     * Grant access to publish profiling information to the Profiling Group to the given identity.
     *
     * This will grant the following permissions:
     *
     *  - codeguru-profiler:ConfigureAgent
     *  - codeguru-profiler:PostAgentProfile
     *
     * @param grantee Principal to grant publish rights to
     */
    grantPublish(grantee: IGrantable): Grant;
    /**
     * Grant access to read profiling information from the Profiling Group to the given identity.
     *
     * This will grant the following permissions:
     *
     *  - codeguru-profiler:GetProfile
     *  - codeguru-profiler:DescribeProfilingGroup
     *
     * @param grantee Principal to grant read rights to
     */
    grantRead(grantee: IGrantable): Grant;
}
declare abstract class ProfilingGroupBase extends Resource implements IProfilingGroup {
    abstract readonly profilingGroupName: string;
    abstract readonly profilingGroupArn: string;
    /**
     * Grant access to publish profiling information to the Profiling Group to the given identity.
     *
     * This will grant the following permissions:
     *
     *  - codeguru-profiler:ConfigureAgent
     *  - codeguru-profiler:PostAgentProfile
     *
     * @param grantee Principal to grant publish rights to
     */
    grantPublish(grantee: IGrantable): Grant;
    /**
     * Grant access to read profiling information from the Profiling Group to the given identity.
     *
     * This will grant the following permissions:
     *
     *  - codeguru-profiler:GetProfile
     *  - codeguru-profiler:DescribeProfilingGroup
     *
     * @param grantee Principal to grant read rights to
     */
    grantRead(grantee: IGrantable): Grant;
}
/**
 * Properties for creating a new Profiling Group.
 */
export interface ProfilingGroupProps {
    /**
     * A name for the profiling group.
     * @default - automatically generated name.
     */
    readonly profilingGroupName?: string;
    /**
     * The compute platform of the profiling group.
     *
     * @default ComputePlatform.DEFAULT
     */
    readonly computePlatform?: ComputePlatform;
}
/**
 * A new Profiling Group.
 */
export declare class ProfilingGroup extends ProfilingGroupBase {
    /**
     * Import an existing Profiling Group provided a Profiling Group Name.
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param profilingGroupName Profiling Group Name
     */
    static fromProfilingGroupName(scope: Construct, id: string, profilingGroupName: string): IProfilingGroup;
    /**
     * Import an existing Profiling Group provided an ARN.
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param profilingGroupArn Profiling Group ARN
     */
    static fromProfilingGroupArn(scope: Construct, id: string, profilingGroupArn: string): IProfilingGroup;
    /**
     * The name of the Profiling Group.
     *
     * @attribute
     */
    readonly profilingGroupName: string;
    /**
     * The ARN of the Profiling Group.
     *
     * @attribute
     */
    readonly profilingGroupArn: string;
    constructor(scope: Construct, id: string, props?: ProfilingGroupProps);
    private generateUniqueId;
}
export {};
