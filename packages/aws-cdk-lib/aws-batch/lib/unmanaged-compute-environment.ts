import { Construct } from 'constructs';
import { CfnComputeEnvironment } from './batch.generated';
import { IComputeEnvironment, ComputeEnvironmentBase, ComputeEnvironmentProps } from './compute-environment-base';
import { ManagedPolicy, Role, ServicePrincipal } from '../../aws-iam';
import { ArnFormat, Stack } from '../../core';

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
export class UnmanagedComputeEnvironment extends ComputeEnvironmentBase implements IUnmanagedComputeEnvironment {
  /**
   * Import an UnmanagedComputeEnvironment by its arn
   */
  public static fromUnmanagedComputeEnvironmentArn(
    scope: Construct, id: string, unmanagedComputeEnvironmentArn: string,
  ): IUnmanagedComputeEnvironment {
    const stack = Stack.of(scope);
    const computeEnvironmentName = stack.splitArn(unmanagedComputeEnvironmentArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends ComputeEnvironmentBase implements IUnmanagedComputeEnvironment {
      public readonly computeEnvironmentArn = unmanagedComputeEnvironmentArn;
      public readonly computeEnvironmentName = computeEnvironmentName;
      public readonly enabled = true;
      public readonly containerDefinition = {} as any;
    }

    return new Import(scope, id);
  }

  public readonly unmanagedvCPUs?: number | undefined;
  public readonly computeEnvironmentArn: string;
  public readonly computeEnvironmentName: string;

  constructor(scope: Construct, id: string, props?: UnmanagedComputeEnvironmentProps) {
    super(scope, id, props);

    this.unmanagedvCPUs = props?.unmanagedvCpus;
    const resource = new CfnComputeEnvironment(this, 'Resource', {
      type: 'unmanaged',
      state: this.enabled ? 'ENABLED' : 'DISABLED',
      computeEnvironmentName: props?.computeEnvironmentName,
      unmanagedvCpus: this.unmanagedvCPUs,
      serviceRole: props?.serviceRole?.roleArn
      ?? new Role(this, 'BatchServiceRole', {
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBatchServiceRole'),
        ],
        assumedBy: new ServicePrincipal('batch.amazonaws.com'),
      }).roleArn,
    });
    this.computeEnvironmentName = this.getResourceNameAttribute(resource.ref);
    this.computeEnvironmentArn = this.getResourceArnAttribute(resource.attrComputeEnvironmentArn, {
      service: 'batch',
      resource: 'compute-environment',
      resourceName: this.physicalName,
    });
  }
}
