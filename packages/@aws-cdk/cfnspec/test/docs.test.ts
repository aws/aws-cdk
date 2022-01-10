import * as cfnspec from '../lib';

test('spot-check resource docs', () => {
  const bucketDocs = cfnspec.typeDocs('AWS::S3::Bucket');

  expect(bucketDocs.description).toBeTruthy();
  expect(bucketDocs.properties.BucketName).toBeTruthy();
});

test('spot-check property type docs', () => {
  const destDocs = cfnspec.typeDocs('AWS::S3::Bucket.Destination');

  expect(destDocs.description).toBeTruthy();
  expect(destDocs.properties.Format).toBeTruthy();
});
