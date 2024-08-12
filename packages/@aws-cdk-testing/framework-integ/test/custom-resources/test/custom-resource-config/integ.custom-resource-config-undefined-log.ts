import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { CustomResourceConfig } from 'aws-cdk-lib/custom-resources';

class TestCustomResourceConfig extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {});

    new s3deploy.BucketDeployment(this, 's3deployNone', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
    });
  }
}

const app = new cdk.App();
const logRetentionDays = logs.RetentionDays.TEN_YEARS;
CustomResourceConfig.of(app).addLogRetentionLifetime(logRetentionDays);
const testCase = new TestCustomResourceConfig(app, 'test-custom-resource-config-undefined-log');

new integ.IntegTest(app, 'integ-test-custom-resource-config-undefined-log', {
  testCases: [testCase],
  diffAssets: false,
});

