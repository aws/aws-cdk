import { integTest, withTemporaryDirectory, withPackages } from '../../lib';

integTest(
  'cdk migrate typescript',
  withTemporaryDirectory(
    withPackages(async () => {
      // TODO: Add the test after pipeline expects it
    }),
  ),
);
