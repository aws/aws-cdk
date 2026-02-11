import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import type { IIpamPool } from '../lib';

/**
 * Properties for IpamPoolCleanup.
 */
export interface IpamPoolCleanupProps {
  /**
   * The IPAM pool whose allocations and CIDRs should be cleaned up on stack deletion.
   */
  readonly ipamPool: IIpamPool;

  /**
   * The VPC (or any construct) that consumes allocations from this pool.
   *
   * The cleanup resource will only run after this construct is deleted,
   * ensuring allocations have a chance to drain before deprovisioning.
   */
  readonly vpc: Construct;

  /**
   * The CfnIPAMPoolCidr resource that should be deleted after cleanup completes.
   *
   * The cleanup resource is inserted between the VPC and this CIDR in the
   * deletion dependency chain.
   */
  readonly poolCidr: cdk.CfnResource;
}

/**
 * A reusable construct that ensures clean teardown of IPAM pool resources.
 *
 * ## Problem
 *
 * When a VPC uses an IPAM pool for IPv6 addressing, CloudFormation cannot
 * cleanly delete the stack because:
 *
 * 1. The VPC CIDR block disassociation is asynchronous — CloudFormation marks
 *    the `AWS::EC2::VPCCidrBlock` as deleted, but the IPAM pool still sees
 *    the allocation for a period of time.
 * 2. CloudFormation then tries to deprovision the `AWS::EC2::IPAMPoolCidr`,
 *    which fails because the pool still has active allocations.
 * 3. The stack enters `DELETE_FAILED` state.
 *
 * ## Solution
 *
 * This construct creates a custom resource Lambda that is inserted into the
 * CloudFormation deletion dependency chain:
 *
 * ```
 * VPC deleted → IpamPoolCleanup (polls until allocations drain, deprovisions CIDRs) → PoolCidr deleted
 * ```
 *
 * On CREATE/UPDATE the Lambda is a no-op. On DELETE it:
 * 1. Polls `GetIpamPoolAllocations` until all allocations are released
 * 2. Calls `DeprovisionIpamPoolCidr` for any remaining CIDRs
 * 3. Polls `GetIpamPoolCidrs` until all CIDRs reach `deprovisioned` state
 *
 * ## Usage
 *
 * ```ts
 * const poolCidr = pool.provisionCidr('MyCidr', { netmaskLength: 52 });
 * const vpc = new VpcV2(this, 'Vpc', { ... });
 *
 * new IpamPoolCleanup(this, 'Cleanup', {
 *   ipamPool: pool,
 *   vpc: vpc,
 *   poolCidr: poolCidr,
 * });
 * ```
 */
export class IpamPoolCleanup extends Construct {
  constructor(scope: Construct, id: string, props: IpamPoolCleanupProps) {
    super(scope, id);

    // Lambda that handles IPAM pool cleanup on DELETE
    const cleanupFn = new NodejsFunction(this, 'Function', {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, 'ipam-cleanup-handler', 'index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.minutes(15),
      initialPolicy: [new iam.PolicyStatement({
        actions: [
          'ec2:GetIpamPoolAllocations',
          'ec2:GetIpamPoolCidrs',
          'ec2:DeprovisionIpamPoolCidr',
        ],
        resources: ['*'],
      })],
    });

    // Provider framework handles CloudFormation custom resource callbacks
    const provider = new Provider(this, 'Provider', {
      onEventHandler: cleanupFn,
    });

    const cleanup = new cdk.CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      properties: { PoolId: props.ipamPool.ipamPoolId },
    });

    // Establish deletion ordering:
    //   VPC deleted first → cleanup runs (drains allocations) → pool CIDR deleted last
    props.vpc.node.addDependency(cleanup);
    cleanup.node.addDependency(props.poolCidr);
  }
}
