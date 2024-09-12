import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { CredentialsOptions, ISDK, Mode, SdkProvider } from '../aws-auth';

export interface ContextProviderPlugin {
  getValue(args: {[key: string]: any}): Promise<any>;
}

export function isContextProviderPlugin(x: unknown): x is ContextProviderPlugin {
  return typeof x === 'object' && !!x && !!(x as any).getValue;
}

export async function initPluginSdk(aws: SdkProvider, options: cxschema.ContextLookupRoleOptions): Promise<ISDK> {

  const account = options.account;
  const region = options.region;

  const creds: CredentialsOptions = {
    assumeRoleArn: options.lookupRoleArn,
    assumeRoleAdditionalOptions: options.lookupRoleAdditionalOptions,
    assumeRoleExternalId: options.lookupRoleExternalId,
  };

  return (await aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading, creds)).sdk;
}