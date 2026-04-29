import type { Allocation, Credentials } from '@cdklabs/cdk-atmosphere-client';
import { AtmosphereClient } from '@cdklabs/cdk-atmosphere-client';

export class AtmosphereAllocation {
  static async acquire({ endpoint, pool, creds }: {endpoint: string; pool: string; creds: Credentials}): Promise<AtmosphereAllocation> {
    const client = new AtmosphereClient(endpoint, { credentials: creds });
    const allocation = await client.acquire({ pool, requester: 'deployment-integ' });
    return new AtmosphereAllocation(client, allocation);
  }

  private client: AtmosphereClient;
  public allocation: Allocation;

  constructor(client: AtmosphereClient, allocation: Allocation) {
    this.client = client;
    this.allocation = allocation;
  }

  async release(outcome: string): Promise<any> {
    return this.client.release(this.allocation.id, outcome);
  }
}
