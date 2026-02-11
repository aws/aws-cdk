/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * Lambda handler for the IpamPoolCleanup custom resource.
 *
 * This handler is invoked by the CloudFormation Provider framework during
 * stack lifecycle events. It only performs work on DELETE — on CREATE and
 * UPDATE it returns immediately.
 *
 * On DELETE, it performs three phases:
 *
 * Phase 1: Wait for allocations to drain
 *   After CloudFormation deletes the VPC and its CIDR block associations,
 *   the IPAM pool may still report active allocations for a period of time
 *   (the disassociation is asynchronous). This phase polls GetIpamPoolAllocations
 *   every 20 seconds until the pool reports zero allocations.
 *
 * Phase 2: Deprovision CIDRs
 *   Once allocations are drained, any CIDRs still provisioned in the pool
 *   are deprovisioned via DeprovisionIpamPoolCidr. This is necessary because
 *   CloudFormation's own deletion of the AWS::EC2::IPAMPoolCidr resource
 *   would fail if called while allocations were still active.
 *
 * Phase 3: Wait for CIDRs to fully deprovision
 *   CIDR deprovisioning is also asynchronous. This phase polls GetIpamPoolCidrs
 *   until all CIDRs reach the 'deprovisioned' state, ensuring the IPAM pool
 *   itself can be cleanly deleted by CloudFormation afterward.
 */

import { EC2Client, GetIpamPoolAllocationsCommand, GetIpamPoolCidrsCommand, DeprovisionIpamPoolCidrCommand } from '@aws-sdk/client-ec2';

/** Interval between polling attempts (20 seconds) */
const POLL_INTERVAL_MS = 20_000;

/** Maximum number of polling iterations per phase (~13 minutes at 20s intervals) */
const MAX_POLL_ITERATIONS = 40;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function handler(event: any) {
  // No-op on CREATE and UPDATE — cleanup only needed during stack deletion
  if (event.RequestType !== 'Delete') return {};

  const poolId = event.ResourceProperties.PoolId;
  const client = new EC2Client({});

  // Phase 1: Wait for VPC allocations to drain
  for (let i = 0; i < MAX_POLL_ITERATIONS; i++) {
    const { IpamPoolAllocations: allocations } = await client.send(
      new GetIpamPoolAllocationsCommand({ IpamPoolId: poolId }),
    );
    if (!allocations || allocations.length === 0) break;
    console.log(`[Phase 1] Waiting for ${allocations.length} allocation(s) to drain...`);
    await sleep(POLL_INTERVAL_MS);
  }

  // Phase 2: Deprovision all CIDRs
  const { IpamPoolCidrs: cidrs } = await client.send(
    new GetIpamPoolCidrsCommand({ IpamPoolId: poolId }),
  );
  for (const cidr of (cidrs ?? [])) {
    if (cidr.State !== 'deprovisioned') {
      console.log(`[Phase 2] Deprovisioning CIDR ${cidr.Cidr} (current state: ${cidr.State})`);
      await client.send(
        new DeprovisionIpamPoolCidrCommand({ IpamPoolId: poolId, Cidr: cidr.Cidr }),
      ).catch(e => console.log(`[Phase 2] Deprovision error (may be expected): ${e}`));
    }
  }

  // Phase 3: Wait for CIDRs to reach 'deprovisioned' state
  for (let i = 0; i < MAX_POLL_ITERATIONS; i++) {
    const { IpamPoolCidrs: remaining } = await client.send(
      new GetIpamPoolCidrsCommand({ IpamPoolId: poolId }),
    );
    const pending = (remaining ?? []).filter(c => c.State !== 'deprovisioned');
    if (pending.length === 0) break;
    console.log(`[Phase 3] Waiting for ${pending.length} CIDR(s) to deprovision...`);
    await sleep(POLL_INTERVAL_MS);
  }

  return {};
}
