#!/usr/bin/env node
import * as path from 'path';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-custom-repository');

// Create a custom ECR repository
const customRepo = new ecr.Repository(stack, 'CustomRepo', {
  repositoryName: 'cdk-integ-custom-repo',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Test 1: Basic custom repository usage
const basicCustomAsset = new assets.DockerImageAsset(stack, 'BasicCustomAsset', {
  directory: path.join(__dirname, 'demo-image'),
  ecrRepository: customRepo,
});

// Test 2: Custom repository with explicit tag
const taggedCustomAsset = new assets.DockerImageAsset(stack, 'TaggedCustomAsset', {
  directory: path.join(__dirname, 'demo-image'),
  ecrRepository: customRepo,
  imageTag: 'v1.2.3',
});

// Test 3: Custom repository with tag prefix
const prefixedCustomAsset = new assets.DockerImageAsset(stack, 'PrefixedCustomAsset', {
  directory: path.join(__dirname, 'demo-image'),
  ecrRepository: customRepo,
  imageTagPrefix: 'branch-main-',
});

// Test 4: Default repository with custom tag
const defaultRepoCustomTag = new assets.DockerImageAsset(stack, 'DefaultRepoCustomTag', {
  directory: path.join(__dirname, 'demo-image'),
  imageTag: 'custom-tag-v2',
});

// Test 5: Default repository with tag prefix
const defaultRepoPrefixed = new assets.DockerImageAsset(stack, 'DefaultRepoPrefixed', {
  directory: path.join(__dirname, 'demo-image'),
  imageTagPrefix: 'feature-',
});

// Test 6: Verify imageTag takes precedence over imageTagPrefix
const precedenceTest = new assets.DockerImageAsset(stack, 'PrecedenceTest', {
  directory: path.join(__dirname, 'demo-image'),
  ecrRepository: customRepo,
  imageTag: 'explicit-wins',
  imageTagPrefix: 'ignored-',
});

// Output key values for verification
new cdk.CfnOutput(stack, 'CustomRepoName', {
  value: customRepo.repositoryName,
});

new cdk.CfnOutput(stack, 'BasicCustomAssetUri', {
  value: basicCustomAsset.imageUri,
});

new cdk.CfnOutput(stack, 'TaggedCustomAssetTag', {
  value: taggedCustomAsset.imageTag,
});

new cdk.CfnOutput(stack, 'PrefixedCustomAssetTag', {
  value: prefixedCustomAsset.imageTag,
});

new cdk.CfnOutput(stack, 'DefaultRepoCustomTagTag', {
  value: defaultRepoCustomTag.imageTag,
});

new cdk.CfnOutput(stack, 'DefaultRepoPrefixedTag', {
  value: defaultRepoPrefixed.imageTag,
});

new cdk.CfnOutput(stack, 'PrecedenceTestTag', {
  value: precedenceTest.imageTag,
});

// Register the integration test
new IntegTest(app, 'EcrCustomRepositoryTest', {
  testCases: [stack],
});
