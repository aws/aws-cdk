import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as sagemaker from '../lib';

describe('When creating model data from a local asset', () => {
  test('by supplying a directory, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () =>
      sagemaker.ModelData.fromAsset(stack, 'ModelData', path.join(__dirname, 'test-artifacts'));

    // THEN
    expect(when).toThrow(/Asset must be a .tar.gz file/);
  });

  test('by supplying a zip file, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () =>
      sagemaker.ModelData.fromAsset(stack, 'ModelData', path.join(__dirname, 'test-artifacts', 'invalid-artifact.zip'));

    // THEN
    expect(when).toThrow(/Asset must be a .tar.gz file/);
  });

  test('by supplying a file with an unsupported extension, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () =>
      sagemaker.ModelData.fromAsset(stack, 'ModelData', path.join(__dirname, 'test-artifacts', 'invalid-artifact.tar'));

    // THEN
    expect(when).toThrow(/Asset must be a .tar.gz file/);
  });
});
