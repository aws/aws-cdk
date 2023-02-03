import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class DataSetContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightDataSetContextQuery): Promise<cxapi.QuickSightContextResponse.DataSet> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeDataSet({
      AwsAccountId: args.account,
      DataSetId: args.dataSetId,
    }).promise();

    const dataSet = response.DataSet;

    if (!dataSet) {
      throw new Error(`No DataSet found in account ${args.account} with id ${args.dataSetId}`);
    }

    return dataSet;
  }
}

export class DataSetPermissionsContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightDataSetContextQuery): Promise<cxapi.QuickSightContextResponse.ResourcePermissionList> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeDataSetPermissions({
      AwsAccountId: args.account,
      DataSetId: args.dataSetId,
    }).promise();

    const dataSet = response.Permissions;

    if (!dataSet) {
      throw new Error(`No DataSet found in account ${args.account} with id ${args.dataSetId}`);
    }

    return dataSet;
  }
}