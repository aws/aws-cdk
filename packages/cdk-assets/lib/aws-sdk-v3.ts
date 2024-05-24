import * as os from 'os';

import { ECR as ecr } from '@aws-sdk/client-ecr';
import { ListMultipartUploadsCommandOutput, PutObjectCommandInput, S3 as s3, S3Client } from '@aws-sdk/client-s3';
import { SecretsManager as SM } from '@aws-sdk/client-secrets-manager';
import { GetCallerIdentityCommand, STSClient, STSClientConfig } from '@aws-sdk/client-sts';
import { fromNodeProviderChain, fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { Upload } from '@aws-sdk/lib-storage';
import { NODE_REGION_CONFIG_FILE_OPTIONS, NODE_REGION_CONFIG_OPTIONS } from '@smithy/config-resolver';
import { loadConfig } from '@smithy/node-config-provider';
import { AwsCredentialIdentityProvider } from '@smithy/types';
import { Account, ClientOptions, ECR, IAws, S3, SecretsManager } from './aws';

const USER_AGENT = 'cdk-assets';

interface Configuration {
  clientConfig: STSClientConfig;
  region?: string;
  credentials: AwsCredentialIdentityProvider;
}

export class DefaultAwsClient implements IAws {
  private account?: Account;
  private config: Configuration;

  constructor(private readonly profile?: string) {
    // In v3, if `profile` is not set, this value defaults to process.env.AWS_PROFILE
    // retaining the same precedence as the original provider
    this.config = {
      clientConfig: {
        customUserAgent: USER_AGENT,
      },
      credentials: fromNodeProviderChain({
        profile: this.profile,
        clientConfig: {
          customUserAgent: USER_AGENT,
        },
      }),
    };
  }

  public async s3Client(options: ClientOptions): Promise<S3> {
    const s3Options = await this.awsOptions(options);
    return new class extends s3 {
      public async upload(input: PutObjectCommandInput): Promise<ListMultipartUploadsCommandOutput> {
        const newUpload = new Upload({
          client: new S3Client(s3Options),
          params: input,
        });

        return newUpload.done();
      }
    }(s3Options);
  }

  public async ecrClient(options: ClientOptions): Promise<ECR> {
    return new ecr(await this.awsOptions(options));
  }

  public async secretsManagerClient(options: ClientOptions): Promise<SecretsManager> {
    return new SM(await this.awsOptions(options));
  }

  public async discoverPartition(): Promise<string> {
    return (await this.discoverCurrentAccount()).partition;
  }

  public async discoverDefaultRegion(): Promise<string> {
    return loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS)();
  }

  public async discoverCurrentAccount(): Promise<Account> {
    if (this.account === undefined) {
      this.account = await this.getAccount();
    }
    return this.account;
  }

  public async discoverTargetAccount(options: ClientOptions): Promise<Account> {
    return this.getAccount(await this.awsOptions(options));
  }

  private async getAccount(options?: ClientOptions): Promise<Account> {
    this.config.clientConfig = options ?? this.config.clientConfig;
    const stsClient = new STSClient(await this.awsOptions(options));

    const command = new GetCallerIdentityCommand();
    const response = await stsClient.send(command);
    if (!response.Account || !response.Arn) {
      throw new Error(`Unrecognized response from STS: '${JSON.stringify(response)}'`);
    }
    return {
      accountId: response.Account!,
      partition: response.Arn!.split(':')[1],
    };
  }

  private async awsOptions(options?: ClientOptions) {
    const config = this.config;
    config.region = options?.region;
    if (options) {
      config.region = options.region;
      if (options.assumeRoleArn) {
        config.credentials = fromTemporaryCredentials({
          params: {
            RoleArn: options.assumeRoleArn,
            ExternalId: options.assumeRoleExternalId,
            RoleSessionName: `${USER_AGENT}-${safeUsername()}`,
          },
          clientConfig: this.config.clientConfig,
        });
      }
      return config;
    }
    return this.config;
  }
}

/**
 * Return the username with characters invalid for a RoleSessionName removed
 *
 * @see https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html#API_AssumeRole_RequestParameters
 */
function safeUsername() {
  try {
    return os.userInfo().username.replace(/[^\w+=,.@-]/g, '@');
  } catch {
    return 'noname';
  }
}