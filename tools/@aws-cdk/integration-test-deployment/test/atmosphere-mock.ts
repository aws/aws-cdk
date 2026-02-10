import type { Allocation } from '@cdklabs/cdk-atmosphere-client';

export class AtmosphereAllocationMock {
  static async acquire({ endpoint, pool }: {endpoint: string; pool: string}): Promise<AtmosphereAllocationMock> {
    return new AtmosphereAllocationMock(endpoint, pool);
  }

  public allocation: Allocation;
  public releaseCalled = false;

  constructor(_endpoint: string, pool: string) {
    this.allocation = {
      id: `allocation-for-pool-${pool}`,
      environment: {
        account: '123456789',
        region: 'us-east-1',
      },
      credentials: {
        accessKeyId: 'XXXXXXXXXXXXX',
        secretAccessKey: '123456789',
        sessionToken: '123456789',
      },
    };
  }

  async release(outcome: string): Promise<any> {
    this.releaseCalled = true;
    return { success: true, outcome };
  }
}
