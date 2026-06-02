import type { Construct } from 'constructs';
import { CfnComputeEnvironment } from './batch.generated';
import type { IComputeEnvironment, ComputeEnvironmentProps } from './compute-environment-base';
import { ComputeEnvironmentBase } from './compute-environment-base';
import { ComputeEnvironmentType } from './private/compute-environment-type';
import { ManagedPolicy, Role, ServicePrincipal } from '../../aws-iam';
import { ArnFormat, FeatureFlags, Stack } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import * as cxapi from '../../cx-api';

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
@propertyInjectable
export class UnmanagedComputeEnvironment extends ComputeEnvironmentBase implements IUnmanagedComputeEnvironment {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-batch.UnmanagedComputeEnvironment';

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

  private readonly resource: CfnComputeEnvironment;

  @memoizedGetter
  public get computeEnvironmentArn(): string {
    return this.getResourceArnAttribute(this.resource.attrComputeEnvironmentArn, {
      service: 'batch',
      resource: 'compute-environment',
      resourceName: this.physicalName,
    });
  }

  @memoizedGetter
  public get computeEnvironmentName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  constructor(scope: Construct, id: string, props?: UnmanagedComputeEnvironmentProps) {
    super(scope, id, props);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.unmanagedvCPUs = props?.unmanagedvCpus;
    const isUppercase = FeatureFlags.of(this).isEnabled(cxapi.BATCH_COMPUTE_ENVIRONMENT_TYPE_UPPERCASE);
    this.resource = new CfnComputeEnvironment(this, 'Resource', {
      type: isUppercase ? ComputeEnvironmentType.UNMANAGED : 'unmanaged',
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
  }
}
