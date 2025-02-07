import type { AmiContextQuery } from '@aws-cdk/cloud-assembly-schema';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug, info } from '../logging';
import { ContextProviderError } from '../toolkit/error';

/**
 * Plugin to search AMIs for the current account
 */
export class AmiContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: AmiContextQuery) {
    const region = args.region;
    const account = args.account;

    // Normally we'd do this only as 'debug', but searching AMIs typically takes dozens
    // of seconds, so be little more verbose about it so users know what is going on.
    info(`Searching for AMI in ${account}:${region}`);
    debug(`AMI search parameters: ${JSON.stringify(args)}`);

    const ec2 = (await initContextProviderSdk(this.aws, args)).ec2();
    const response = await ec2.describeImages({
      Owners: args.owners,
      Filters: Object.entries(args.filters).map(([key, values]) => ({
        Name: key,
        Values: values,
      })),
    });

    const images = [...(response.Images || [])].filter((i) => i.ImageId !== undefined);

    if (images.length === 0) {
      throw new ContextProviderError('No AMI found that matched the search criteria');
    }

    // Return the most recent one
    // Note: Date.parse() is not going to respect the timezone of the string,
    // but since we only care about the relative values that is okay.
    images.sort(descending((i) => Date.parse(i.CreationDate || '1970')));

    debug(`Selected image '${images[0].ImageId}' created at '${images[0].CreationDate}'`);
    return images[0].ImageId!;
  }
}

/**
 * Make a comparator that sorts in descending order given a sort key extractor
 */
function descending<A>(valueOf: (x: A) => number) {
  return (a: A, b: A) => {
    return valueOf(b) - valueOf(a);
  };
}
