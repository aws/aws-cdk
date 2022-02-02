import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { Mode, SdkProvider } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

export class ECRContextProviderPlugin implements ContextProviderPlugin {

  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.ECRContextQuery): Promise<cxapi.ECRContextResponse> {
    const account: string = args.account!;
    const region: string = args.region!;

    const options = { assumeRoleArn: args.lookupRoleArn };
    const ecr = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading, options)).sdk.ecr();

    const repositoryName = args.repositoryName;
    debug(`Describing repository ${args.account}:${args.region}:${repositoryName}`);

    const response = await this.describeRepository(ecr, repositoryName);
    if (response.repositories === undefined || response.repositories.length === 0) {
      throw new Error(`Could not find any Repository matching ${repositoryName}`);
    }
    const repository = response.repositories[0];
    const imageScanningConfiguration = { scanOnPush: false };
    if (repository.imageScanningConfiguration && repository.imageScanningConfiguration.scanOnPush) {
      imageScanningConfiguration.scanOnPush = true;
    }
    const tagMutability = repository.imageTagMutability === 'IMMUTABLE'
      ? cxapi.ImageTagMutability.IMMUTABLE
      : cxapi.ImageTagMutability.MUTABLE;

    return {
      repositoryArn: repository.repositoryArn!,
      registryId: repository.registryId!,
      repositoryName: repository.repositoryName!,
      repositoryUri: repository.repositoryUri!,
      createdAt: repository.createdAt!,
      imageScanningConfiguration: imageScanningConfiguration,
      imageTagMutability: tagMutability,
    };
  }

  private async describeRepository(ecr: AWS.ECR, repositoryName: string): Promise<AWS.ECR.DescribeRepositoriesResponse> {
    try {
      return await ecr.describeRepositories({ repositoryNames: [repositoryName] }).promise();
    } catch (e) {
      if (e.code === 'RepositoryNotFoundException') {
        return {};
      }
      throw e;
    }
  }
}
