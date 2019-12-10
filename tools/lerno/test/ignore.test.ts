import path = require('path');
import { nonIgnoredSourceFiles } from "../lib/deps";

test('test git filter', async () => {
  const files = await nonIgnoredSourceFiles(path.resolve(__dirname, '..', '..', '..', 'packages', '@aws-cdk', 'aws-s3'));

  expect(files.some(f => f.endsWith('.js'))).toBeFalsy();
  expect(files.some(f => f.indexOf('/coverage/'))).toBeFalsy();
});