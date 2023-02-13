import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as helperFunctions from './helper-functions';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class DataSourceContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.QuickSightDataSourceContextQuery): Promise<cxapi.QuickSightContextResponse.DataSource> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeDataSource({
      AwsAccountId: args.account,
      DataSourceId: args.dataSourceId,
    }).promise();

    const dataSource = response.DataSource;

    if (!dataSource) {
      throw new Error(`No DataSource found in account ${args.account} and region ${args.region} with id ${args.dataSourceId}`);
    }

    return helperFunctions.mapToCamelCase(dataSource) as cxapi.QuickSightContextResponse.DataSource;
  }
}

export class DataSourcePermissionsContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.QuickSightDataSourceContextQuery): Promise<cxapi.QuickSightContextResponse.ResourcePermissionList> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeDataSourcePermissions({
      AwsAccountId: args.account,
      DataSourceId: args.dataSourceId,
    }).promise();

    const dataSource = response.Permissions;

    if (!dataSource) {
      throw new Error(`No DataSource found in account ${args.account} and region ${args.region} with id ${args.dataSourceId}`);
    }

    return helperFunctions.arrayToCamelCase(dataSource) as cxapi.QuickSightContextResponse.ResourcePermissionList;
  }
}