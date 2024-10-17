import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug } from '../logging';

export class KeyContextProviderPlugin implements ContextProviderPlugin {

  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.KeyContextQuery) {
    const kms = (await initContextProviderSdk(this.aws, args)).kms();

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

    const suppressError = 'ignoreErrorOnMissingContext' in args && args.ignoreErrorOnMissingContext as boolean;
    const hasDummyKeyId = 'dummyValue' in args && typeof args.dummyValue === 'object' && args.dummyValue !== null && 'keyId' in args.dummyValue;
    if (suppressError && hasDummyKeyId) {
      const keyId = (args.dummyValue as { keyId: string }).keyId;
      return { TargetKeyId: keyId };
    }
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
