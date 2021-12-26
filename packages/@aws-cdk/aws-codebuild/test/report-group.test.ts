import { ABSENT, ResourcePart } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

/* eslint-disable quote-props */
/* eslint-disable quotes */

describe('Test Reports Groups', () => {
  test('get created with type=TEST and exportConfig=NO_EXPORT by default', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup');

    expect(stack).toHaveResourceLike('AWS::CodeBuild::ReportGroup', {
      "Type": "TEST",
      "ExportConfig": {
        "ExportConfigType": "NO_EXPORT",
        "S3Destination": ABSENT,
      },
    });
  });

  test('can be created with name', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {
      reportGroupName: 'my-report-group',
    });

    expect(stack).toHaveResourceLike('AWS::CodeBuild::ReportGroup', {
      "Name": 'my-report-group',
    });
  });

  test('can be imported by name', () => {
    const stack = new cdk.Stack();

    const reportGroup = codebuild.ReportGroup.fromReportGroupName(stack,
      'ReportGroup', 'my-report-group');

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
    });
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['codebuild:*'],
      resources: [reportGroup.reportGroupArn],
    }));

    expect(reportGroup.reportGroupName).toEqual('my-report-group');
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "codebuild:*",
            "Resource": {
              "Fn::Join": ["", [
                "arn:",
                { "Ref": "AWS::Partition" },
                ":codebuild:",
                { "Ref": "AWS::Region" },
                ":",
                { "Ref": "AWS::AccountId" },
                ":report-group/my-report-group",
              ]],
            },
          },
        ],
      },
    });
  });

  test('specify exportConfig=S3 when providing an exportBucket', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {
      exportBucket: s3.Bucket.fromBucketName(stack, 'Bucket', 'my-bucket'),
    });

    expect(stack).toHaveResourceLike('AWS::CodeBuild::ReportGroup', {
      "Type": "TEST",
      "ExportConfig": {
        "ExportConfigType": "S3",
        "S3Destination": {
          "Bucket": "my-bucket",
          "EncryptionKey": ABSENT,
          "EncryptionDisabled": ABSENT,
          "Packaging": ABSENT,
        },
      },
    });
  });

  test('specify encryptionKey in ExportConfig.S3Destination if exportBucket has a Key', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {
      exportBucket: s3.Bucket.fromBucketAttributes(stack, 'Bucket', {
        bucketName: 'my-bucket',
        encryptionKey: kms.Key.fromKeyArn(stack, 'Key',
          'arn:aws:kms:us-east-1:123456789012:key/my-key'),
      }),
      zipExport: true,
    });

    expect(stack).toHaveResourceLike('AWS::CodeBuild::ReportGroup', {
      "Type": "TEST",
      "ExportConfig": {
        "ExportConfigType": "S3",
        "S3Destination": {
          "Bucket": "my-bucket",
          "EncryptionDisabled": false,
          "EncryptionKey": "arn:aws:kms:us-east-1:123456789012:key/my-key",
          "Packaging": "ZIP",
        },
      },
    });
  });

  test('get created with RemovalPolicy.RETAIN by default', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup');

    expect(stack).toHaveResourceLike('AWS::CodeBuild::ReportGroup', {
      "DeletionPolicy": "Retain",
      "UpdateReplacePolicy": "Retain",
    }, ResourcePart.CompleteDefinition);
  });

  test('can be created with RemovalPolicy.DESTROY', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    expect(stack).toHaveResourceLike('AWS::CodeBuild::ReportGroup', {
      "DeletionPolicy": "Delete",
      "UpdateReplacePolicy": "Delete",
    }, ResourcePart.CompleteDefinition);
  });
});
