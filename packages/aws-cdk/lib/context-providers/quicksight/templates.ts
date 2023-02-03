import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class TemplateContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightTemplateContextQuery): Promise<cxapi.QuickSightContextResponse.Template> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeTemplate({
      AwsAccountId: args.account,
      TemplateId: args.templateId,
    }).promise();

    const template = response.Template;

    if (!template) {
      throw new Error(`No Template found in account ${args.account} with id ${args.templateId}`);
    }

    return template;
  }
}

export class TemplatePermissionsContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightTemplateContextQuery): Promise<cxapi.QuickSightContextResponse.ResourcePermissionList> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeTemplatePermissions({
      AwsAccountId: args.account,
      TemplateId: args.templateId,
    }).promise();

    const template = response.Permissions;

    if (!template) {
      throw new Error(`No Template found in account ${args.account} with id ${args.templateId}`);
    }

    return template;
  }
}