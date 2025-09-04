#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';

export class CustomRepositoryTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a custom ECR repository
    const customRepo = new ecr.Repository(this, 'CustomTestRepo', {
      repositoryName: 'cdk-custom-repo-test',
      removalPolicy: RemovalPolicy.DESTROY, // For testing only
    });

    // Test 1: Basic custom repository usage
    const basicCustomAsset = new DockerImageAsset(this, 'BasicCustomAsset', {
      directory: './fixtures/custom-dockerfile',
      ecrRepository: customRepo,
    });

    // Test 2: Custom repository with explicit tag
    const taggedCustomAsset = new DockerImageAsset(this, 'TaggedCustomAsset', {
      directory: './fixtures/custom-dockerfile',
      ecrRepository: customRepo,
      imageTag: 'integration-test-v1',
    });

    // Test 3: Custom repository with tag prefix
    const prefixedCustomAsset = new DockerImageAsset(this, 'PrefixedCustomAsset', {
      directory: './fixtures/custom-dockerfile',
      ecrRepository: customRepo,
      imageTagPrefix: 'branch-main-',
    });

    // Test 4: Default repository with custom tag
    const defaultRepoCustomTag = new DockerImageAsset(this, 'DefaultRepoCustomTag', {
      directory: './fixtures/custom-dockerfile',
      imageTag: 'custom-tag-default-repo',
    });

    // Test 5: Default repository with tag prefix
    const defaultRepoPrefixed = new DockerImageAsset(this, 'DefaultRepoPrefixed', {
      directory: './fixtures/custom-dockerfile',
      imageTagPrefix: 'feature-',
    });

    // Test 6: Verify imageTag takes precedence over imageTagPrefix
    const precedenceTest = new DockerImageAsset(this, 'PrecedenceTest', {
      directory: './fixtures/custom-dockerfile',
      ecrRepository: customRepo,
      imageTag: 'explicit-wins',
      imageTagPrefix: 'ignored-',
    });

    // Output the results for verification
    this.exportValue(basicCustomAsset.imageUri, { name: 'BasicCustomAssetUri' });
    this.exportValue(taggedCustomAsset.imageUri, { name: 'TaggedCustomAssetUri' });
    this.exportValue(prefixedCustomAsset.imageUri, { name: 'PrefixedCustomAssetUri' });
    this.exportValue(defaultRepoCustomTag.imageUri, { name: 'DefaultRepoCustomTagUri' });
    this.exportValue(defaultRepoPrefixed.imageUri, { name: 'DefaultRepoPrefixedUri' });
    this.exportValue(precedenceTest.imageUri, { name: 'PrecedenceTestUri' });

    // Verify tag values
    this.exportValue(basicCustomAsset.imageTag, { name: 'BasicCustomAssetTag' });
    this.exportValue(taggedCustomAsset.imageTag, { name: 'TaggedCustomAssetTag' });
    this.exportValue(prefixedCustomAsset.imageTag, { name: 'PrefixedCustomAssetTag' });
    this.exportValue(defaultRepoCustomTag.imageTag, { name: 'DefaultRepoCustomTagTag' });
    this.exportValue(defaultRepoPrefixed.imageTag, { name: 'DefaultRepoPrefixedTag' });
    this.exportValue(precedenceTest.imageTag, { name: 'PrecedenceTestTag' });

    // Verify repository names
    this.exportValue(basicCustomAsset.repository.repositoryName, { name: 'BasicCustomAssetRepo' });
    this.exportValue(taggedCustomAsset.repository.repositoryName, { name: 'TaggedCustomAssetRepo' });
    this.exportValue(prefixedCustomAsset.repository.repositoryName, { name: 'PrefixedCustomAssetRepo' });
  }
}

const app = new App();
const stack = new CustomRepositoryTestStack(app, 'CustomRepositoryTestStack');

new IntegTest(app, 'CustomRepositoryIntegTest', {
  testCases: [stack],
  diffAssets: true,
  stackUpdateWorkflow: true,
});
