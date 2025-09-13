import * as path from 'path';
import { Template, Match } from '../../assertions';
import * as ecr from '../../aws-ecr';
import { App, Stack } from '../../core';
import { DockerImageAsset } from '../lib';

describe('DockerImageAsset Custom Repository Support', () => {
  let app: App;
  let stack: Stack;
  let repository: ecr.Repository;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
    repository = new ecr.Repository(stack, 'CustomRepo', {
      repositoryName: 'my-custom-repo',
    });
  });

  test('should support custom ECR repository', () => {
    // GIVEN
    const asset = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: repository,
    });

    // THEN
    expect(asset.repository).toBe(repository);
    expect(asset.imageTag).toBe(asset.assetHash);

    // Check CloudFormation template structure
    const template = Template.fromStack(stack);

    // Should reference the custom repository in the template
    template.hasResourceProperties('AWS::ECR::Repository', {
      RepositoryName: 'my-custom-repo',
    });

    // Asset should be properly configured
    expect(asset.imageUri).toBeDefined();
    expect(typeof asset.imageUri).toBe('string');
  });

  test('should support custom image tag with custom repository', () => {
    // GIVEN
    const customTag = 'v1.2.3';
    const asset = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: repository,
      imageTag: customTag,
    });

    // THEN
    expect(asset.repository).toBe(repository);
    expect(asset.imageTag).toBe(customTag);

    // Check CloudFormation template structure
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ECR::Repository', {
      RepositoryName: 'my-custom-repo',
    });

    // Asset should use the custom tag
    expect(asset.imageUri).toBeDefined();
    expect(asset.imageTag).toBe('v1.2.3');
  });

  test('should support custom image tag prefix with custom repository', () => {
    // GIVEN
    const tagPrefix = 'feature-';
    const asset = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: repository,
      imageTagPrefix: tagPrefix,
    });

    // THEN
    expect(asset.repository).toBe(repository);
    expect(asset.imageTag).toBe(`${tagPrefix}${asset.assetHash}`);

    // Check CloudFormation template structure
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ECR::Repository', {
      RepositoryName: 'my-custom-repo',
    });

    // Asset should use the prefixed tag
    expect(asset.imageUri).toBeDefined();
    expect(asset.imageTag.startsWith(tagPrefix)).toBe(true);
  });

  test('should support custom tag prefix with default repository', () => {
    // GIVEN
    const tagPrefix = 'branch-main-';
    const asset = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      imageTagPrefix: tagPrefix,
    });

    // THEN
    expect(asset.imageTag).toBe(`${tagPrefix}${asset.assetHash}`);
    expect(asset.imageTag.startsWith(tagPrefix)).toBe(true);

    // Asset should use the prefixed tag
    expect(asset.imageUri).toBeDefined();
    expect(typeof asset.imageUri).toBe('string');
  });

  test('should support custom tag with default repository', () => {
    // GIVEN
    const customTag = 'release-candidate';
    const asset = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      imageTag: customTag,
    });

    // THEN
    expect(asset.imageTag).toBe(customTag);

    // Asset should use the custom tag
    expect(asset.imageUri).toBeDefined();
    expect(typeof asset.imageUri).toBe('string');
  });

  test('should include custom repository in asset hash', () => {
    // GIVEN
    const asset1 = new DockerImageAsset(stack, 'Asset1', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
    });

    const asset2 = new DockerImageAsset(stack, 'Asset2', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: repository,
    });

    // THEN - assets should have different hashes due to different repositories
    expect(asset1.assetHash).not.toBe(asset2.assetHash);
  });

  test('should include custom tag in asset hash', () => {
    // GIVEN
    const asset1 = new DockerImageAsset(stack, 'Asset1', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      imageTag: 'tag1',
    });

    const asset2 = new DockerImageAsset(stack, 'Asset2', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      imageTag: 'tag2',
    });

    // THEN - assets should have different hashes due to different tags
    expect(asset1.assetHash).not.toBe(asset2.assetHash);
  });

  test('should include custom tag prefix in asset hash', () => {
    // GIVEN
    const asset1 = new DockerImageAsset(stack, 'Asset1', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      imageTagPrefix: 'prefix1-',
    });

    const asset2 = new DockerImageAsset(stack, 'Asset2', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      imageTagPrefix: 'prefix2-',
    });

    // THEN - assets should have different hashes due to different tag prefixes
    expect(asset1.assetHash).not.toBe(asset2.assetHash);
  });

  test('imageTag takes precedence over imageTagPrefix', () => {
    // GIVEN
    const customTag = 'explicit-tag';
    const asset = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: repository,
      imageTag: customTag,
      imageTagPrefix: 'should-be-ignored-',
    });

    // THEN
    expect(asset.imageTag).toBe(customTag);
    expect(asset.imageUri).toContain(`:${customTag}`);
  });

  test('should maintain backward compatibility', () => {
    // GIVEN
    const asset = new DockerImageAsset(stack, 'MyAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
    });

    // THEN - should work exactly like before
    expect(asset.repository).toBeDefined();
    expect(asset.imageUri).toBeDefined();
    expect(asset.imageTag).toBe(asset.assetHash);
  });

  test('should handle complex repository names and tags', () => {
    // GIVEN
    const complexStack = new Stack(new App(), 'ComplexStack');
    const complexRepo = new ecr.Repository(complexStack, 'ComplexRepo', {
      repositoryName: 'my-org/my-project/backend-api',
    });

    const complexTag = 'v2.1.0-beta.1+build.123';
    const asset = new DockerImageAsset(complexStack, 'ComplexAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: complexRepo,
      imageTag: complexTag,
    });

    // THEN
    expect(asset.repository).toBe(complexRepo);
    expect(asset.imageTag).toBe(complexTag);

    // Check CloudFormation template structure
    const template = Template.fromStack(complexStack);
    template.hasResourceProperties('AWS::ECR::Repository', {
      RepositoryName: 'my-org/my-project/backend-api',
    });
  });

  test('should handle edge case: empty tag prefix', () => {
    // GIVEN
    const asset = new DockerImageAsset(stack, 'EmptyPrefixAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      imageTagPrefix: '',
    });

    // THEN - empty prefix should behave like no prefix
    expect(asset.imageTag).toBe(asset.assetHash);
    expect(asset.imageUri).toBeDefined();
  });

  test('should handle cross-stack repository references', () => {
    // GIVEN
    const repoStack = new Stack(app, 'RepoStack');
    const assetStack = new Stack(app, 'AssetStack');

    const crossStackRepo = new ecr.Repository(repoStack, 'CrossStackRepo', {
      repositoryName: 'cross-stack-repo',
    });

    const asset = new DockerImageAsset(assetStack, 'CrossStackAsset', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: crossStackRepo,
      imageTag: 'cross-stack-tag',
    });

    // THEN
    expect(asset.repository).toBe(crossStackRepo);
    expect(asset.imageTag).toBe('cross-stack-tag');

    // Both stacks should be valid
    const repoTemplate = Template.fromStack(repoStack);
    const assetTemplate = Template.fromStack(assetStack);

    repoTemplate.hasResourceProperties('AWS::ECR::Repository', {
      RepositoryName: 'cross-stack-repo',
    });

    // Asset stack should reference the repository from the other stack
    expect(asset.imageUri).toBeDefined();
  });

  test('should properly isolate different assets with same repository', () => {
    // GIVEN
    const sharedRepo = new ecr.Repository(stack, 'SharedRepo', {
      repositoryName: 'shared-repo',
    });

    const asset1 = new DockerImageAsset(stack, 'Asset1', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: sharedRepo,
      imageTag: 'version-1',
    });

    const asset2 = new DockerImageAsset(stack, 'Asset2', {
      directory: path.join(__dirname, 'fixtures/custom-dockerfile'),
      ecrRepository: sharedRepo,
      imageTag: 'version-2',
    });

    // THEN - should be different assets with different tags but same repo
    expect(asset1.repository).toBe(sharedRepo);
    expect(asset2.repository).toBe(sharedRepo);
    expect(asset1.imageTag).toBe('version-1');
    expect(asset2.imageTag).toBe('version-2');
    expect(asset1.imageUri).not.toBe(asset2.imageUri);

    // Template should have one repository but references to both assets
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ECR::Repository', {
      RepositoryName: 'shared-repo',
    });
  });
});
