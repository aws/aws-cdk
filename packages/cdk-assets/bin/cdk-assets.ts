import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as winston from 'winston';
import * as yargs from 'yargs';
import { AssetManifest, AssetPublishing, DestinationPattern, IPublishProgress, IPublishProgressListener } from '../lib';
import { ClientOptions, IAws } from '../lib/aws-operations';

const VERSION = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), { encoding: 'utf-8' })).version;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.cli(),
  transports: [ new winston.transports.Console({ stderrLevels: ['info', 'debug', 'verbose', 'error'] })  ]
});

async function main() {
  const argv = yargs
  .usage('$0 <cmd> [args]')
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    desc: 'Increase logging verbosity',
    count: true,
    default: 0
  })
  .command('ls PATH', 'List assets from the given manifest', command => command
    .positional('PATH', { type: 'string', describe: 'Manifest file or cdk.out directory' })
    .require('PATH')
  , wrapHandler(async args => {
    const manifest = AssetManifest.fromPath(args.PATH);
    // tslint:disable-next-line:no-console
    console.log(manifest.list().join('\n'));
  }))
  .command('publish PATH [ASSET..]', 'Publish assets in the given manifest', command => command
    .option('profile', { type: 'string', describe: 'Profile to use from AWS Credentials file' })
    .positional('PATH', { type: 'string', describe: 'Manifest file or cdk.out directory' })
    .require('PATH')
    .positional('ASSET', { type: 'string', array: true, describe: 'Assets to publish (format: "ASSET[:DEST]"), default all' })
    .array('ASSET')
  , wrapHandler(async args => {
    const manifest = AssetManifest.fromPath(args.PATH);
    const selection = args.ASSET && args.ASSET.length > 0 ? args.ASSET.map(a => DestinationPattern.parse(a)) : undefined;

    const pub = new AssetPublishing({
      manifest: manifest.select(selection),
      aws: new DefaultAwsClient(args.profile),
      progressListener: new ConsoleProgress(),
      throwOnError: false,
    });

    await pub.publish();

    if (pub.hasFailures) {
      process.exit(1);
    }
  }))
  .demandCommand()
  .help()
  .strict()  // Error on wrong command
  .version(VERSION)
  .showHelpOnFail(false)
  .argv;

  // Evaluating .argv triggers the parsing but the command gets implicitly executed,
  // so we don't need the output.
  Array.isArray(argv);
}

/**
 * Wrap a command's handler with standard pre- and post-work
 */
function wrapHandler<A extends { verbose?: number }, R>(handler: (x: A) => Promise<R>) {
  const levels = ['info', 'verbose', 'debug', 'silly'];
  return async (argv: A) => {
    logger.transports.forEach(transport => {
      transport.level = levels[Math.min(argv.verbose ?? 0, levels.length - 1)];
    });
    await handler(argv);
  };
}

class ConsoleProgress implements IPublishProgressListener {
  public onAssetStart(event: IPublishProgress): void {
    logger.info(`[${event.percentComplete}%] ${event.message}`);
  }
  public onAssetEnd(event: IPublishProgress): void {
    logger.info(`[${event.percentComplete}%] ${event.message}`);
  }
  public onEvent(event: IPublishProgress): void {
    logger.verbose(`[${event.percentComplete}%] ${event.message}`);
  }
  public onError(event: IPublishProgress): void {
    logger.error(`${event.message}`);
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

  public async defaultRegion(): Promise<string> {
    return this.AWS.config.region || 'us-east-1';
  }

  public async currentAccount(): Promise<string> {
    const sts = new this.AWS.STS();
    const response = await sts.getCallerIdentity().promise();
    if (!response.Account) {
      logger.error(`Unrecognized reponse from STS: '${JSON.stringify(response)}'`);
    }
    return response.Account || '????????';
  }

  private awsOptions(options: ClientOptions) {
    let credentials;

    if (options.assumeRoleArn) {
      credentials = new this.AWS.TemporaryCredentials({
        RoleArn: options.assumeRoleArn,
        ExternalId: options.assumeRoleExternalId,
        RoleSessionName: `Assets-${os.userInfo().username}`,
      });

      const msg = [`Assume ${options.assumeRoleArn}`];
      if (options.assumeRoleExternalId) {
        msg.push(`(ExternalId ${options.assumeRoleExternalId})`);
      }
      if (logger) { logger.verbose(msg.join(' ')); }
    }

    return {
      region: options.region,
      customUserAgent: `cdk-assets/${VERSION}`,
      credentials,
    };
  }
}

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});