import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as helperFunctions from './helper-functions';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class ThemeContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.QuickSightThemeContextQuery): Promise<cxapi.QuickSightContextResponse.Theme> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeTheme({
      AwsAccountId: args.account,
      ThemeId: args.themeId,
    }).promise();

    const theme = response.Theme;

    if (!theme) {
      throw new Error(`No Theme found in account ${args.account} and region ${args.region} with id ${args.themeId}`);
    }

    return helperFunctions.mapToCamelCase(theme) as cxapi.QuickSightContextResponse.Analysis;
  }
}

export class ThemePermissionsContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.QuickSightThemeContextQuery): Promise<cxapi.QuickSightContextResponse.ResourcePermissionList> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeThemePermissions({
      AwsAccountId: args.account,
      ThemeId: args.themeId,
    }).promise();

    const theme = response.Permissions;

    if (!theme) {
      throw new Error(`No Theme found in account ${args.account} and region ${args.region} with id ${args.themeId}`);
    }

    return helperFunctions.arrayToCamelCase(theme) as cxapi.QuickSightContextResponse.ResourcePermissionList;
  }
}