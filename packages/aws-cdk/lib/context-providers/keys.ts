import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Mode } from '../api/aws-auth/credentials';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug } from '../logging';

export class KeyContextProviderPlugin implements ContextProviderPlugin {

  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.KeyContextQuery) {
    const account: string = args.account!;
    const region: string = args.region!;

    const options = { assumeRoleArn: args.lookupRoleArn };
    const kms = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading, options)).sdk.kms();

    const aliasListEntry = await this.findKey(kms, args);

    return this.readKeyProps(aliasListEntry, args);
  }

  private async findKey(kms: AWS.KMS, args: cxschema.KeyContextQuery): Promise<AWS.KMS.AliasListEntry> {

    debug(`Listing keys in ${args.account}:${args.region}`);

    let response: PromiseResult<AWS.KMS.ListAliasesResponse, AWS.AWSError>;
    let nextMarker: string | undefined;
    do {
      response = await kms.listAliases({
        Marker: nextMarker,
      }).promise();

      const aliases = response.Aliases || [];
      for (const alias of aliases) {
        if (alias.AliasName == args.aliasName) {
          return alias;
        }
      }

      nextMarker = response.NextMarker;
    } while (response.Truncated);

    throw new Error(`Could not find any key with alias named ${args.aliasName}`);
  }

  private async readKeyProps(alias: AWS.KMS.AliasListEntry, args: cxschema.KeyContextQuery): Promise<cxapi.KeyContextResponse> {
    if (!alias.TargetKeyId) {
      throw new Error(`Could not find any key with alias named ${args.aliasName}`);
    }

    debug(`Key found ${alias.TargetKeyId}`);

    return {
      keyId: alias.TargetKeyId,
    };
  }

}
