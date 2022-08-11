import * as cxapi from '@aws-cdk/cx-api';
import { publishAllStackAssets } from '../lib/publish';

type Stack = cxapi.CloudFormationStackArtifact;

describe('publishAllStackAssets', () => {
  const A = { id: 'A' };
  const B = { id: 'B' };
  const C = { id: 'C' };
  const concurrency = 3;
  const toPublish = [A, B, C] as unknown as Stack[];

  const sleep = async (duration: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), duration));

  test('publish', async () => {
    // GIVEN
    const publishStackAssets = jest.fn(() => sleep(1));

    // WHEN/THEN
    await expect(publishAllStackAssets(toPublish, { concurrency, publishStackAssets })).resolves.toBeUndefined();
    expect(publishStackAssets).toBeCalledTimes(3);
    expect(publishStackAssets).toBeCalledWith(A);
    expect(publishStackAssets).toBeCalledWith(B);
    expect(publishStackAssets).toBeCalledWith(C);
  });

  test('errors', async () => {
    // GIVEN
    const publishStackAssets = () => { throw new Error('Error'); };

    // WHEN/THEN
    await expect(publishAllStackAssets(toPublish, { concurrency, publishStackAssets })).rejects.toThrow('Publishing Assets Failed: Error');
  });
});
