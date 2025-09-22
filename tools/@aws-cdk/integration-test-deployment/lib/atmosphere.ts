import { Allocation, AtmosphereClient } from '@cdklabs/cdk-atmosphere-client';

export class AtmosphereAllocation {
  static async acquire({ endpoint, pool }: {endpoint: string; pool: string}): Promise<AtmosphereAllocation> {
    const client = new AtmosphereClient(endpoint);
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
