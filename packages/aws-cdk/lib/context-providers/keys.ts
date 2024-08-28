import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { AliasListEntry, KMSClient, ListAliasesCommand } from '@aws-sdk/client-kms';
import { ListAliasesCommandOutput } from '@aws-sdk/client-lambda';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin, Mode } from '../api/plugin';
import { debug } from '../logging';

export class KeyContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: cxschema.KeyContextQuery) {
    const account: string = args.account!;
    const region: string = args.region!;

    const options = { assumeRoleArn: args.lookupRoleArn };
    const kms = (
      await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading, options)
    ).kms();

    const aliasListEntry = await this.findKey(kms, args);

    return this.readKeyProps(aliasListEntry, args);
  }

  private async findKey(kms: KMSClient, args: cxschema.KeyContextQuery): Promise<AliasListEntry> {
    debug(`Listing keys in ${args.account}:${args.region}`);

    let response: ListAliasesCommandOutput;
    let nextMarker: string | undefined;
    do {
      const command = new ListAliasesCommand({ Marker: nextMarker });
      response = await kms.send(command);

      const aliases = response.Aliases || [];
      for (const alias of aliases) {
        if (alias.Name == args.aliasName) {
          return alias;
        }
      }

      nextMarker = response.NextMarker;
    } while (nextMarker);

    throw new Error(`Could not find any key with alias named ${args.aliasName}`);
  }

  private async readKeyProps(alias: AliasListEntry, args: cxschema.KeyContextQuery): Promise<cxapi.KeyContextResponse> {
    if (!alias.TargetKeyId) {
      throw new Error(`Could not find any key with alias named ${args.aliasName}`);
    }

    debug(`Key found ${alias.TargetKeyId}`);

    return {
      keyId: alias.TargetKeyId,
    };
  }
}
