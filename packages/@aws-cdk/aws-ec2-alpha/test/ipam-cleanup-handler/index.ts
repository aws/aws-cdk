/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { EC2Client, GetIpamPoolAllocationsCommand, GetIpamPoolCidrsCommand, DeprovisionIpamPoolCidrCommand } from '@aws-sdk/client-ec2';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function handler(event: any) {
  if (event.RequestType !== 'Delete') return {};
  const poolId = event.ResourceProperties.PoolId;
  const client = new EC2Client({});

  // Wait for VPC allocations to drain (disassociation is async)
  for (let i = 0; i < 40; i++) {
    const { IpamPoolAllocations: a } = await client.send(new GetIpamPoolAllocationsCommand({ IpamPoolId: poolId }));
    if (!a || a.length === 0) break;
    console.log(`Waiting for ${a.length} allocations to drain...`);
    await sleep(20000);
  }

  // Deprovision all CIDRs
  const { IpamPoolCidrs: cidrs } = await client.send(new GetIpamPoolCidrsCommand({ IpamPoolId: poolId }));
  for (const c of (cidrs ?? [])) {
    if (c.State !== 'deprovisioned') {
      console.log(`Deprovisioning CIDR ${c.Cidr} (state: ${c.State})`);
      await client.send(new DeprovisionIpamPoolCidrCommand({ IpamPoolId: poolId, Cidr: c.Cidr })).catch(e => console.log(e));
    }
  }

  // Wait for CIDRs to fully deprovision so the pool can be deleted
  for (let i = 0; i < 40; i++) {
    const { IpamPoolCidrs: r } = await client.send(new GetIpamPoolCidrsCommand({ IpamPoolId: poolId }));
    if (!(r ?? []).some(c => c.State !== 'deprovisioned')) break;
    console.log('Waiting for CIDRs to deprovision...');
    await sleep(20000);
  }

  return {};
}
