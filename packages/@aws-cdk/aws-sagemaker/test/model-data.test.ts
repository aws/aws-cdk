import * as path from 'path';
import * as sagemaker from '../lib';

describe('When creating model data from a local asset', () => {
  test('by supplying a directory, an exception is thrown', () => {
    // WHEN
    const when = () => sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts'));

    // THEN
    expect(when).toThrow(/Asset must be a gzipped tar file with extension .tar.gz/);
  });

  test('by supplying a zip file, an exception is thrown', () => {
    // WHEN
    const when = () => sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'invalid-artifact.zip'));

    // THEN
    expect(when).toThrow(/Asset must be a gzipped tar file with extension .tar.gz/);
  });

  test('by supplying a file with an unsupported extension, an exception is thrown', () => {
    // WHEN
    const when = () => sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'invalid-artifact.tar'));

    // THEN
    expect(when).toThrow(/Asset must be a gzipped tar file with extension .tar.gz/);
  });
});
