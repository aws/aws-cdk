// eslint-disable-next-line import/no-extraneous-dependencies
import { S3 } from 'aws-sdk';

const s3 = new S3();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<void> {
  switch (event.RequestType) {
    case 'Create':
      if (event.ResourceProperties.Fail) {
        throw new Error('Failing on request!');
      }
      const bucketName = event.ResourceProperties.BucketName;
      if (!bucketName) {
        throw new Error('Missing BucketName');
      }
      return putObjects(bucketName);
    case 'Update':
    case 'Delete':
      return;
  }
}

async function putObjects(bucketName: string, n = 5) {
  // Put n objects in parallel
  await Promise.all([...Array(n).keys()]
    .map(key => s3.putObject({
      Bucket: bucketName,
      Key: `Key${key}`,
      Body: `Body${key}`,
    }).promise()));
}
