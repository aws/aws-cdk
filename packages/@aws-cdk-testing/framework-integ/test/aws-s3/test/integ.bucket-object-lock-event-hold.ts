#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'S3ObjectLockEventHold');

const combined = new s3.Bucket(stack, 'Combined', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(2), {
    defaultEventHold: cdk.Duration.days(1),
  }),
});
const eventHoldOnly = new s3.Bucket(stack, 'EventHoldOnly', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  objectLockDefaultRetention: s3.ObjectLockRetention.eventHold(s3.ObjectLockMode.COMPLIANCE, cdk.Duration.days(1)),
});

const expectedOutputs: Array<{ OutputKey: string; OutputValue: string }> = [];
for (const [bucket, mode, fixedDays] of [
  [combined, 'GOVERNANCE', 2],
  [eventHoldOnly, 'COMPLIANCE', undefined],
] as const) {
  // The Lambda runtime SDK can predate DefaultEventHold response support.
  const configuration = new cr.AwsCustomResource(stack, `${bucket.node.id}Configuration`, {
    installLatestAwsSdk: true,
    onUpdate: {
      service: 'S3',
      action: 'getObjectLockConfiguration',
      parameters: { Bucket: bucket.bucketName },
      physicalResourceId: cr.PhysicalResourceId.of(bucket.bucketName),
    },
    policy: cr.AwsCustomResourcePolicy.fromStatements([
      new iam.PolicyStatement({
        actions: ['s3:GetBucketObjectLockConfiguration'],
        resources: [bucket.bucketArn],
      }),
    ]),
  });
  const checks: Array<[string, string | number]> = [
    ['ObjectLockEnabled', 'Enabled'],
    ['Rule.DefaultRetention.Mode', mode],
    ['Rule.DefaultRetention.DefaultEventHold.Days', 1],
  ];
  if (fixedDays !== undefined) {
    checks.push(['Rule.DefaultRetention.Days', fixedDays]);
  }
  for (const [field, expected] of checks) {
    const id = `${bucket.node.id}${field.replace(/\./g, '')}`;
    new cdk.CfnOutput(stack, id, {
      value: configuration.getResponseField(`ObjectLockConfiguration.${field}`),
    });
    expectedOutputs.push({ OutputKey: id, OutputValue: String(expected) });
  }
}

const test = new integ.IntegTest(app, 'ObjectLockEventHoldTest', { testCases: [stack] });
for (const output of expectedOutputs) {
  test.assertions.awsApiCall('CloudFormation', 'describeStacks', { StackName: stack.stackName })
    .expect(integ.ExpectedResult.objectLike({
      Stacks: [
        {
          Outputs: integ.Match.arrayWith([integ.Match.objectLike(output)]),
        },
      ],
    }));
}
