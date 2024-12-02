import type { DatabaseInstanceContextQuery } from '@aws-cdk/cloud-assembly-schema';
import type { DBInstance } from '@aws-sdk/client-rds';
import type { IRdsClient } from '../api';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug } from '../logging';

export class DatabaseInstanceContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: DatabaseInstanceContextQuery) {
    const rds = (await initContextProviderSdk(this.aws, args)).rds();

    const dbInstance = await this.findDatabaseInstance(rds, args);

    const dbSecurityGroupIds: string[] = [];
    for (const groupMembership of dbInstance.DBSecurityGroups || []) {
      if (groupMembership.DBSecurityGroupName) {
        dbSecurityGroupIds.push(groupMembership.DBSecurityGroupName);
      }
    }

    return {
      instanceIdentifier: dbInstance.DBInstanceIdentifier,
      instanceArn: dbInstance.DBInstanceArn,
      dbInstanceEndpointAddress: dbInstance.Endpoint?.Address,
      dbInstanceEndpointPort: dbInstance.Endpoint?.Port,
      instanceResourceId: dbInstance.DbiResourceId,
      dbSecurityGroupIds: dbSecurityGroupIds,
    };
  }

  private async findDatabaseInstance(rds: IRdsClient, args: DatabaseInstanceContextQuery): Promise<DBInstance> {
    debug(`Finding DatabaseInstance in ${args.account}:${args.region}`);

    const response = await rds.describeDbInstances({
      DBInstanceIdentifier: args.instanceIdentifier,
    });
    const instances = response.DBInstances || [];

    // Sanity checks.  We should get one instance.
    if (instances.length === 0) {
      throw new Error(`No DatabaseInstance found matching ${args.instanceIdentifier}`);
    }
    if (instances.length > 1) {
      throw new Error(`More than one DatabaseInstance found matching ${args.instanceIdentifier}`);
    }

    return instances[0];
  }
}
