import * as cxapi from '@aws-cdk/cx-api';
import { buildAllStackAssets } from '../lib/build';

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
    await expect(buildAllStackAssets(toPublish, { concurrency, buildStackAssets: publishStackAssets }))
      .resolves
      .toBeUndefined();

    expect(publishStackAssets).toBeCalledTimes(3);
    expect(publishStackAssets).toBeCalledWith(A);
    expect(publishStackAssets).toBeCalledWith(B);
    expect(publishStackAssets).toBeCalledWith(C);
  });

  test('errors', async () => {
    // GIVEN
    const buildStackAssets = async () => { throw new Error('Message'); };

    // WHEN/THEN
    await expect(buildAllStackAssets(toPublish, { concurrency, buildStackAssets }))
      .rejects
      .toThrow('Publishing Assets Failed: Error: Message, Error: Message, Error: Message');
  });
});
