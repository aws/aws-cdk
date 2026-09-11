/// !cdk-integ *
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import { Node } from 'constructs';
import { S3Assert } from './integration-test-fixtures/s3-assert';
import { S3File } from './integration-test-fixtures/s3-file';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const file2Contents = 'this file has a generated physical id';
    const bucket = new s3.Bucket(this, 'MyBucket');

    const file1 = new S3File(this, 'file1', {
      bucket,
      objectKey: 'second.txt',
      contents: 'Hello, world, 1980!',
    });

    const file2 = new S3File(this, 'file2', {
      bucket,
      contents: file2Contents,
    });

    const file3 = new S3File(this, 'file3Utf8', {
      bucket,
      objectKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
      contents: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
    });

    new S3Assert(this, 'assert-file', {
      bucket,
      objectKey: file2.objectKey,
      expectedContent: file2Contents,
    });

    // delay file2 updates so we can test async assertions
    Node.of(file2).addDependency(file1);

    new CfnOutput(this, 'file1-url', { value: file1.url });
    new CfnOutput(this, 'file2-url', { value: file2.url });
    new CfnOutput(this, 'file3-url', { value: file3.url });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new TestStack(app, 'integ-provider-framework');

const test = new integ.IntegTest(app, 'IntegProviderFrameworkTest', {
  testCases: [stack],
  diffAssets: true,
});

// The async provider behind S3Assert parks the CloudFormation response URL in SSM
// while the waiter runs, and deletes it once the resource settles. By the time the
// stack is deployed, nothing should be left under the framework's prefix.
test.assertions.awsApiCall('SSM', 'describeParameters', {
  ParameterFilters: [{
    Key: 'Name',
    Option: 'BeginsWith',
    Values: ['/cdk/custom-resource-provider/'],
  }],
}).expect(integ.ExpectedResult.objectLike({ Parameters: [] }));

app.synth();
