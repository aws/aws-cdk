import * as os from 'os';
import { AssetManifest, AssetPublishing, ClientOptions, DestinationPattern, EventType, IAws, IPublishProgress, IPublishProgressListener } from "../lib";
import { log, VERSION } from "./logging";

export async function publish(args: {
  path: string;
  assets?: string[];
  profile?: string;
  }) {
  const manifest = AssetManifest.fromPath(args.path);
  const selection = args.assets && args.assets.length > 0 ? args.assets.map(a => DestinationPattern.parse(a)) : undefined;

  const pub = new AssetPublishing(manifest.select(selection), {
    aws: new DefaultAwsClient(args.profile),
    progressListener: new ConsoleProgress(),
    throwOnError: false,
  });

  await pub.publish();

  if (pub.hasFailures) {
    process.exitCode = 1;
  }
}

class ConsoleProgress implements IPublishProgressListener {
  public onAssetStart(event: IPublishProgress): void {
    log('info', `[${event.percentComplete}%] ${event.message}`);
  }
  public onAssetEnd(event: IPublishProgress): void {
    log('info', `[${event.percentComplete}%] ${event.message}`);
  }
  public onPublishEvent(type: EventType, event: IPublishProgress): void {
    log('verbose', `[${event.percentComplete}%] ${type}: ${event.message}`);
  }
  public onError(event: IPublishProgress): void {
    log('error', `${event.message}`);
  }
}

/**
 * AWS client using the AWS SDK for JS with no special configuration
 */
class DefaultAwsClient implements IAws {
  private readonly AWS: typeof import('aws-sdk');

  constructor(profile?: string) {
    // Force AWS SDK to look in ~/.aws/credentials and potentially use the configured profile.
    process.env.AWS_SDK_LOAD_CONFIG = "1";
    if (profile) {
      process.env.AWS_PROFILE = profile;
    }

    // We need to set the environment before we load this library for the first time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    this.AWS = require('aws-sdk');
  }

  public s3Client(options: ClientOptions) {
    return new this.AWS.S3(this.awsOptions(options));
  }

  public ecrClient(options: ClientOptions) {
    return new this.AWS.ECR(this.awsOptions(options));
  }

  public async discoverDefaultRegion(): Promise<string> {
    return this.AWS.config.region || 'us-east-1';
  }

  public async discoverCurrentAccount(): Promise<string> {
    const sts = new this.AWS.STS();
    const response = await sts.getCallerIdentity().promise();
    if (!response.Account) {
      log('error', `Unrecognized reponse from STS: '${JSON.stringify(response)}'`);
      throw new Error('Unrecognized reponse from STS');
    }
    return response.Account || '????????';
  }

  private awsOptions(options: ClientOptions) {
    let credentials;

    if (options.assumeRoleArn) {
      credentials = new this.AWS.TemporaryCredentials({
        RoleArn: options.assumeRoleArn,
        ExternalId: options.assumeRoleExternalId,
        RoleSessionName: `cdk-assets-${os.userInfo().username}`,
      });

      const msg = [`Assume ${options.assumeRoleArn}`];
      if (options.assumeRoleExternalId) {
        msg.push(`(ExternalId ${options.assumeRoleExternalId})`);
      }
      log('verbose', msg.join(' '));
    }

    return {
      region: options.region,
      customUserAgent: `cdk-assets/${VERSION}`,
      credentials,
    };
  }
}
