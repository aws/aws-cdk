import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';

/**
 * Integration test for S3 deployment file integrity preservation.
 *
 * This test verifies the fix for issue #35050 where files without markers
 * were being unnecessarily rewritten, causing MD5 hash mismatches.
 *
 * Test scenario:
 * - JSON files without markers should preserve original MD5 hashes
 */
class FileIntegrityTest extends cdk.Stack {
  public readonly bucketName: string;
  public readonly jsonFileKey: string;
  public readonly originalMd5: string;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // GIVEN: A JSON file without any markers and an S3 bucket for deployment
    const bucket = new Bucket(this, 'TestBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const jsonContent = JSON.stringify({
      name: 'test-config',
      version: '1.0.0',
      settings: {
        debug: false,
        timeout: 30,
      },
    }, null, 2);

    // Calculate original MD5 hash for verification
    this.originalMd5 = md5hash(jsonContent);

    // WHEN: The JSON file is deployed using BucketDeployment without substitutions
    new BucketDeployment(this, 'TestDeployment', {
      sources: [
        Source.data('config.json', jsonContent),
      ],
      destinationBucket: bucket,
    });

    // Store outputs for test assertions
    this.bucketName = bucket.bucketName;
    this.jsonFileKey = 'config.json';

    new cdk.CfnOutput(this, 'OriginalMd5Hash', {
      value: this.originalMd5,
      description: 'Original MD5 hash of JSON file without markers',
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new FileIntegrityTest(app, 'test-s3-deploy-file-integrity');
const integ = new IntegTest(app, 'bucket-deployment-file-integrity-test', {
  testCases: [testCase],
});

// THEN: The deployed JSON file should preserve original MD5 hash
const jsonFileCall = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: testCase.bucketName,
  Key: testCase.jsonFileKey,
});

jsonFileCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});

// THEN: MD5 hash should be preserved (ETag should match original MD5)
// This is the core test for the bug fix - files without markers should not be modified
jsonFileCall.assertAtPath('ETag', ExpectedResult.stringLikeRegexp(
  `"${testCase.originalMd5}"`,
));
