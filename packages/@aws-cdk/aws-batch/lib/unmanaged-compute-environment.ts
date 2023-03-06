import { Construct } from 'constructs';
import { IComputeEnvironment, ComputeEnvironmentBase, ComputeEnvironmentProps } from './compute-environment-base';


export interface IUnmanagedComputeEnvironment extends IComputeEnvironment {
  /**
   * The vCPUs this Compute Environment provides. Used only by the
   * scheduler to schedule jobs in `Queue`s that use `FairshareSchedulingPolicy`s.
   *
   * **If this parameter is not provided on a fairshare queue, no capacity is reserved**;
   * that is, the `FairshareSchedulingPolicy` is ignored.
   */
  unmanagedvCPUs?: number;
}

export interface UnmanagedComputeEnvironmentProps extends ComputeEnvironmentProps {
  /**
   * The vCPUs this Compute Environment provides. Used only by the
   * scheduler to schedule jobs in `Queue`s that use `FairshareSchedulingPolicy`s.
   *
   * **If this parameter is not provided on a fairshare queue, no capacity is reserved**;
   * that is, the `FairshareSchedulingPolicy` is ignored.
   */
  unmanagedvCpus?: number;
}

export class UnmanagedComputeEnvironment extends ComputeEnvironmentBase implements IUnmanagedComputeEnvironment {
  unmanagedvCPUs?: number | undefined;

  constructor(scope: Construct, id: string, props: UnmanagedComputeEnvironmentProps) {
    super(scope, id, props);

    this.unmanagedvCPUs = props.unmanagedvCpus;
  }
}
