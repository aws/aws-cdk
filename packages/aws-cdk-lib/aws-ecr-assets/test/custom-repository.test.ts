import * as path from 'path';
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
    expect(asset.imageUri).toContain('my-custom-repo');
    expect(asset.imageTag).toBe(asset.assetHash);
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
    expect(asset.imageUri).toContain(`my-custom-repo:${customTag}`);
    expect(asset.imageTag).toBe(customTag);
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
    expect(asset.imageUri).toContain(`my-custom-repo:${tagPrefix}${asset.assetHash}`);
    expect(asset.imageTag).toBe(`${tagPrefix}${asset.assetHash}`);
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
    expect(asset.imageUri).toContain(`:${tagPrefix}${asset.assetHash}`);
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
    expect(asset.imageUri).toContain(`:${customTag}`);
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
});
