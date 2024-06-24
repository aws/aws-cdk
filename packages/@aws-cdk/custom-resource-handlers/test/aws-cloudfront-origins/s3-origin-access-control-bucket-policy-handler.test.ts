import { S3Client, GetBucketPolicyCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { mockClient  } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
// import { handler } from '../../lib/aws-cloudfront-origins/s3-origin-access-control-key-policy-handler/index';


const s3Mock = mockClient(S3Client);
beforeEach(() => {
  s3Mock.reset();
});

