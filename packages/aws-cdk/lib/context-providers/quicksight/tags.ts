import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as helperFunctions from './helper-functions';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class QuickSightTagsContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.QuickSightTagsContextQuery): Promise<cxapi.QuickSightContextResponse.TagList> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.listTagsForResource({
      ResourceArn: args.resourceArn,
    }).promise();

    const tags = response.Tags;

    if (!tags) {
      throw new Error(`No resource found with arn ${args.resourceArn}`);
    }

    return helperFunctions.arrayToCamelCase(tags) as cxapi.QuickSightContextResponse.TagList;
  }
}