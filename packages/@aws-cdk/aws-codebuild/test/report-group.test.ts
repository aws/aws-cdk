import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';
import { ReportGroupType } from '../lib';

/* eslint-disable quote-props */
/* eslint-disable quotes */

describe('Test Reports Groups', () => {
  test('get created with type=TEST and exportConfig=NO_EXPORT by default', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup');

    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
      "Type": "TEST",
      "ExportConfig": {
        "ExportConfigType": "NO_EXPORT",
        "S3Destination": Match.absent(),
      },
    });
  });

  test('can be created with name', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {
      reportGroupName: 'my-report-group',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
      "Type": "TEST",
      "ExportConfig": {
        "ExportConfigType": "S3",
        "S3Destination": {
          "Bucket": "my-bucket",
          "EncryptionKey": Match.absent(),
          "EncryptionDisabled": Match.absent(),
          "Packaging": Match.absent(),
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
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

    Template.fromStack(stack).hasResource('AWS::CodeBuild::ReportGroup', {
      "DeletionPolicy": "Retain",
      "UpdateReplacePolicy": "Retain",
    });
  });

  test('can be created with RemovalPolicy.DESTROY', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    Template.fromStack(stack).hasResource('AWS::CodeBuild::ReportGroup', {
      "DeletionPolicy": "Delete",
      "UpdateReplacePolicy": "Delete",
    });
  });

  test('can be created with type=CODE_COVERAGE', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {
      type: ReportGroupType.CODE_COVERAGE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
      "Type": "CODE_COVERAGE",
    });
  });

  test('defaults to report group type=TEST when not specified explicitly', () => {
    const stack = new cdk.Stack();

    new codebuild.ReportGroup(stack, 'ReportGroup', {});

    Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
      "Type": "TEST",
    });
  });

  test.each([
    [ReportGroupType.CODE_COVERAGE, 'codebuild:BatchPutCodeCoverages'],
    [ReportGroupType.TEST, 'codebuild:BatchPutTestCases'],
  ])('has correct policy when type is %s', (type: ReportGroupType, policyStatement: string) => {
    const stack = new cdk.Stack();

    const reportGroup = new codebuild.ReportGroup(stack, 'ReportGroup', {
      type,
    });

    const project = new codebuild.Project(stack, 'TestProject', {
      buildSpec: {
        toBuildSpec: () => '',
        isImmediate: true,
      },
    });
    reportGroup.grantWrite(project);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: [
              "codebuild:CreateReport",
              "codebuild:UpdateReport",
              policyStatement,
            ],
            Effect: "Allow",
            Resource: {
              "Fn::GetAtt": [
                "ReportGroup8A84C76D",
                "Arn",
              ],
            },
          },
        ]),
        Version: "2012-10-17",
      },
    });
  });
});
