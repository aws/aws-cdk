/* eslint-disable import/order */
import * as cxapi from '@aws-cdk/cx-api';
import { buildAllStackAssets } from '../lib/build';

type Stack = cxapi.CloudFormationStackArtifact;

describe('buildAllStackAssets', () => {
  const A = { id: 'A' };
  const B = { id: 'B' };
  const C = { id: 'C' };
  const toPublish = [A, B, C] as unknown as Stack[];

  const sleep = async (duration: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), duration));

  test('build', async () => {
    // GIVEN
    const buildStackAssets = jest.fn(() => sleep(1));

    // WHEN/THEN
    await expect(buildAllStackAssets(toPublish, { buildStackAssets }))
      .resolves
      .toBeUndefined();

    expect(buildStackAssets).toHaveBeenCalledTimes(3);
    expect(buildStackAssets).toHaveBeenCalledWith(A);
    expect(buildStackAssets).toHaveBeenCalledWith(B);
    expect(buildStackAssets).toHaveBeenCalledWith(C);
  });

  test('errors', async () => {
    // GIVEN
    const buildStackAssets = async () => { throw new Error('Message'); };

    // WHEN/THEN
    await expect(buildAllStackAssets(toPublish, { buildStackAssets }))
      .rejects
      .toThrow('Building Assets Failed: Error: Message, Error: Message, Error: Message');
  });
});
