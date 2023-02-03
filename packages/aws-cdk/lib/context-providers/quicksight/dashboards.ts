import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class DashboardContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightDashboardContextQuery): Promise<cxapi.QuickSightContextResponse.Dashboard> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeDashboard({
      AwsAccountId: args.account,
      DashboardId: args.dashboardId,
    }).promise();

    const dashboard = response.Dashboard;

    if (!dashboard) {
      throw new Error(`No Dashboard found in account ${args.account} with id ${args.dashboardId}`);
    }

    return dashboard;
  }
}

export class DashboardPermissionsContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightDashboardContextQuery): Promise<cxapi.QuickSightContextResponse.ResourcePermissionList> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeDashboardPermissions({
      AwsAccountId: args.account,
      DashboardId: args.dashboardId,
    }).promise();

    const dashboard = response.Permissions;

    if (!dashboard) {
      throw new Error(`No Dashboard found in account ${args.account} with id ${args.dashboardId}`);
    }

    return dashboard;
  }
}