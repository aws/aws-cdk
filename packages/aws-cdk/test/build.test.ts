import * as cxapi from '@aws-cdk/cx-api';
import { buildAllStackAssets } from '../lib/build';

type Stack = cxapi.CloudFormationStackArtifact;

describe('buildAllStackAssets', () => {
  const A = { id: 'A' };
  const B = { id: 'B' };
  const C = { id: 'C' };
  const concurrency = 3;
  const toPublish = [A, B, C] as unknown as Stack[];

  const sleep = async (duration: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), duration));

  test('build', async () => {
    // GIVEN
    const buildStackAssets = jest.fn(() => sleep(1));

    // WHEN/THEN
    await expect(buildAllStackAssets(toPublish, { concurrency, buildStackAssets }))
      .resolves
      .toBeUndefined();

    expect(buildStackAssets).toBeCalledTimes(3);
    expect(buildStackAssets).toBeCalledWith(A);
    expect(buildStackAssets).toBeCalledWith(B);
    expect(buildStackAssets).toBeCalledWith(C);
  });

  test('errors', async () => {
    // GIVEN
    const buildStackAssets = async () => { throw new Error('Message'); };

    // WHEN/THEN
    await expect(buildAllStackAssets(toPublish, { concurrency, buildStackAssets }))
      .rejects
      .toThrow('Building Assets Failed: Error: Message, Error: Message, Error: Message');
  });
});
