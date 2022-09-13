import * as path from 'path';
import * as asset from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as sagemaker from '../lib';

describe('When creating model data from a local asset', () => {
  test('by supplying a directory, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const modelDataAsset = new asset.Asset(stack, 'ModelData', {
      path: path.join(__dirname, 'test-artifacts'),
    });

    // WHEN
    const when = () => sagemaker.ModelData.fromAsset(modelDataAsset);

    // THEN
    expect(when).toThrow(/Asset must be a gzipped tar file with extension .gz/);
  });

  test('by supplying a zip file, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const modelDataAsset = new asset.Asset(stack, 'ModelData', {
      path: path.join(__dirname, 'test-artifacts', 'invalid-artifact.zip'),
    });

    // WHEN
    const when = () => sagemaker.ModelData.fromAsset(modelDataAsset);

    // THEN
    expect(when).toThrow(/Asset must be a gzipped tar file with extension .gz/);
  });

  test('by supplying a file with an unsupported extension, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const modelDataAsset = new asset.Asset(stack, 'ModelData', {
      path: path.join(__dirname, 'test-artifacts', 'invalid-artifact.tar'),
    });

    // WHEN
    const when = () => sagemaker.ModelData.fromAsset(modelDataAsset);

    // THEN
    expect(when).toThrow(/Asset must be a gzipped tar file with extension .gz/);
  });
});
