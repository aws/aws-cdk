import { ABSENT, expect, haveResourceLike, ResourcePart } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codebuild from '../lib';

/* eslint-disable quote-props */
/* eslint-disable quotes */

export = {
  'Test Reports Groups': {
    'get created with type=TEST and exportConfig=NO_EXPORT by default'(test: Test) {
      const stack = new cdk.Stack();

      new codebuild.ReportGroup(stack, 'ReportGroup');

      expect(stack).to(haveResourceLike('AWS::CodeBuild::ReportGroup', {
        "Type": "TEST",
        "ExportConfig": {
          "ExportConfigType": "NO_EXPORT",
          "S3Destination": ABSENT,
        },
      }));

      test.done();
    },

    'can be created with name'  (test: Test) {
      const stack = new cdk.Stack();

      new codebuild.ReportGroup(stack, 'ReportGroup', {
        reportGroupName: 'my-report-group',
      });

      expect(stack).to(haveResourceLike('AWS::CodeBuild::ReportGroup', {
        "Name": 'my-report-group',
      }));

      test.done();
    },

    'can be imported by name'(test: Test) {
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

      test.equal(reportGroup.reportGroupName, 'my-report-group');
      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
      }));

      test.done();
    },

    'specify exportConfig=S3 when providing an exportBucket'(test: Test) {
      const stack = new cdk.Stack();

      new codebuild.ReportGroup(stack, 'ReportGroup', {
        exportBucket: s3.Bucket.fromBucketName(stack, 'Bucket', 'my-bucket'),
      });

      expect(stack).to(haveResourceLike('AWS::CodeBuild::ReportGroup', {
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
      }));

      test.done();
    },

    'specify encryptionKey in ExportConfig.S3Destination if exportBucket has a Key'(test: Test) {
      const stack = new cdk.Stack();

      new codebuild.ReportGroup(stack, 'ReportGroup', {
        exportBucket: s3.Bucket.fromBucketAttributes(stack, 'Bucket', {
          bucketName: 'my-bucket',
          encryptionKey: kms.Key.fromKeyArn(stack, 'Key',
            'arn:aws:kms:us-east-1:123456789012:key/my-key'),
        }),
        zipExport: true,
      });

      expect(stack).to(haveResourceLike('AWS::CodeBuild::ReportGroup', {
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
      }));

      test.done();
    },

    'get created with RemovalPolicy.RETAIN by default'(test: Test) {
      const stack = new cdk.Stack();

      new codebuild.ReportGroup(stack, 'ReportGroup');

      expect(stack).to(haveResourceLike('AWS::CodeBuild::ReportGroup', {
        "DeletionPolicy": "Retain",
        "UpdateReplacePolicy": "Retain",
      }, ResourcePart.CompleteDefinition));

      test.done();
    },

    'can be created with RemovalPolicy.DESTROY'(test: Test) {
      const stack = new cdk.Stack();

      new codebuild.ReportGroup(stack, 'ReportGroup', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      expect(stack).to(haveResourceLike('AWS::CodeBuild::ReportGroup', {
        "DeletionPolicy": "Delete",
        "UpdateReplacePolicy": "Delete",
      }, ResourcePart.CompleteDefinition));

      test.done();
    },
  },
};
