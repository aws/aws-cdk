import { Construct } from 'constructs';
import { IComputeEnvironment, ComputeEnvironmentBase, ComputeEnvironmentProps } from './compute-environment-base';
/**
 * Represents an UnmanagedComputeEnvironment. Batch will not provision instances on your behalf
 * in this ComputeEvironment.
 */
export interface IUnmanagedComputeEnvironment extends IComputeEnvironment {
    /**
     * The vCPUs this Compute Environment provides. Used only by the
     * scheduler to schedule jobs in `Queue`s that use `FairshareSchedulingPolicy`s.
     *
     * **If this parameter is not provided on a fairshare queue, no capacity is reserved**;
     * that is, the `FairshareSchedulingPolicy` is ignored.
     */
    readonly unmanagedvCPUs?: number;
}
/**
 * Represents an UnmanagedComputeEnvironment. Batch will not provision instances on your behalf
 * in this ComputeEvironment.
 */
export interface UnmanagedComputeEnvironmentProps extends ComputeEnvironmentProps {
    /**
     * The vCPUs this Compute Environment provides. Used only by the
     * scheduler to schedule jobs in `Queue`s that use `FairshareSchedulingPolicy`s.
     *
     * **If this parameter is not provided on a fairshare queue, no capacity is reserved**;
     * that is, the `FairshareSchedulingPolicy` is ignored.
     *
     * @default 0
     */
    readonly unmanagedvCpus?: number;
}
/**
 * Unmanaged ComputeEnvironments do not provision or manage EC2 instances on your behalf.
 *
 * @resource AWS::Batch::ComputeEnvironment
 */
export declare class UnmanagedComputeEnvironment extends ComputeEnvironmentBase implements IUnmanagedComputeEnvironment {
    /**
     * Import an UnmanagedComputeEnvironment by its arn
     */
    static fromUnmanagedComputeEnvironmentArn(scope: Construct, id: string, unmanagedComputeEnvironmentArn: string): IUnmanagedComputeEnvironment;
    readonly unmanagedvCPUs?: number | undefined;
    readonly computeEnvironmentArn: string;
    readonly computeEnvironmentName: string;
    constructor(scope: Construct, id: string, props?: UnmanagedComputeEnvironmentProps);
}
