import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class DataSourceContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightDataSourceContextQuery): Promise<cxapi.DataSourceContextResponse> {

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
      throw new Error(`No DataSource found in account ${args.account} with id ${args.dataSourceId}`);
    }

    return dataSource;
  }
}