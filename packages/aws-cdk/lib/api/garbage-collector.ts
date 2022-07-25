/* eslint-disable no-console */
import * as cxapi from '@aws-cdk/cx-api';
import { ISDK, SdkProvider } from './aws-auth';
import { Mode } from './aws-auth/credentials';
import { ToolkitInfo } from './toolkit-info';

interface GarbageCollectorProps {
  dryRun: boolean;

  /**
   * The environment to deploy this stack in
   *
   * The environment on the stack artifact may be unresolved, this one
   * must be resolved.
   */
  resolvedEnvironment: cxapi.Environment;

  /**
    * SDK provider (seeded with default credentials)
    *
    * Will exclusively be used to assume publishing credentials (which must
    * start out from current credentials regardless of whether we've assumed an
    * action role to touch the stack or not).
    *
    * Used for the following purposes:
    *
    * - Publish legacy assets.
    * - Upload large CloudFormation templates to the staging bucket.
    */
  sdkProvider: SdkProvider;
}

export class GarbageCollector {
  private hashes: Set<string> = new Set();
  public constructor(private readonly props: GarbageCollectorProps) {
  }

  public async collect() {
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;

    const cfn = sdk.cloudFormation();
    let nextToken: string | undefined;
    let finished = false;
    const stackNames: string[] = [];
    while (!finished) {
      const response = await cfn.listStacks({ NextToken: nextToken }).promise();
      stackNames.push(...(response.StackSummaries ?? []).map(s => s.StackId ?? s.StackName));
      nextToken = response.NextToken;
      if (nextToken === undefined) {
        finished = true;
      }
    }

    console.log(stackNames.length);

    // TODO: gracefully fail this
    for (const stack of stackNames) {
      const template = await cfn.getTemplate({
        StackName: stack,
      }).promise();

      const templateHashes = template.TemplateBody?.match(/[a-f0-9]{64}/g);
      templateHashes?.forEach(this.hashes.add, this.hashes);
    }

    console.log(this.hashes);

    const bucket = await this.getBootstrapBucket(sdk);
    const ecrs = await this.getBootstrapRepositories(sdk);
    console.log(bucket);
    console.log(ecrs);
  }

  private async getBootstrapBucket(sdk: ISDK) {
    // maybe use tags like for ecr
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, undefined);
    return info.bucketName;
  }

  private async getBootstrapRepositories(sdk: ISDK) {
    const ecr = sdk.ecr();
    const repos = (await ecr.describeRepositories().promise()).repositories;
    const bootstrappedRepos: string[] = [];
    for (const repo of repos ?? []) {
      if (!repo.repositoryArn || !repo.repositoryName) { continue; }
      const tags = await ecr.listTagsForResource({
        resourceArn: repo.repositoryArn,
      }).promise();
      for (const tag of tags.tags ?? []) {
        if (tag.Key === 'awscdk:asset' && tag.Value === 'true') {
          bootstrappedRepos.push(repo.repositoryName);
        }
      }
    }
    return bootstrappedRepos;
  }
}