"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
/* eslint-disable quotes */
describe('Test Reports Groups', () => {
    test('get created with type=TEST and exportConfig=NO_EXPORT by default', () => {
        const stack = new cdk.Stack();
        new codebuild.ReportGroup(stack, 'ReportGroup');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
            "Type": "TEST",
            "ExportConfig": {
                "ExportConfigType": "NO_EXPORT",
                "S3Destination": assertions_1.Match.absent(),
            },
        });
    });
    test('can be created with name', () => {
        const stack = new cdk.Stack();
        new codebuild.ReportGroup(stack, 'ReportGroup', {
            reportGroupName: 'my-report-group',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
            "Name": 'my-report-group',
        });
    });
    test('can be imported by name', () => {
        const stack = new cdk.Stack();
        const reportGroup = codebuild.ReportGroup.fromReportGroupName(stack, 'ReportGroup', 'my-report-group');
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
        });
        role.addToPolicy(new iam.PolicyStatement({
            actions: ['codebuild:*'],
            resources: [reportGroup.reportGroupArn],
        }));
        expect(reportGroup.reportGroupName).toEqual('my-report-group');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
            "Type": "TEST",
            "ExportConfig": {
                "ExportConfigType": "S3",
                "S3Destination": {
                    "Bucket": "my-bucket",
                    "EncryptionKey": assertions_1.Match.absent(),
                    "EncryptionDisabled": assertions_1.Match.absent(),
                    "Packaging": assertions_1.Match.absent(),
                },
            },
        });
    });
    test('specify encryptionKey in ExportConfig.S3Destination if exportBucket has a Key', () => {
        const stack = new cdk.Stack();
        new codebuild.ReportGroup(stack, 'ReportGroup', {
            exportBucket: s3.Bucket.fromBucketAttributes(stack, 'Bucket', {
                bucketName: 'my-bucket',
                encryptionKey: kms.Key.fromKeyArn(stack, 'Key', 'arn:aws:kms:us-east-1:123456789012:key/my-key'),
            }),
            zipExport: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
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
        assertions_1.Template.fromStack(stack).hasResource('AWS::CodeBuild::ReportGroup', {
            "DeletionPolicy": "Retain",
            "UpdateReplacePolicy": "Retain",
        });
    });
    test('can be created with RemovalPolicy.DESTROY', () => {
        const stack = new cdk.Stack();
        new codebuild.ReportGroup(stack, 'ReportGroup', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::CodeBuild::ReportGroup', {
            "DeletionPolicy": "Delete",
            "UpdateReplacePolicy": "Delete",
        });
    });
    test('can be created with type=CODE_COVERAGE', () => {
        const stack = new cdk.Stack();
        new codebuild.ReportGroup(stack, 'ReportGroup', {
            type: lib_1.ReportGroupType.CODE_COVERAGE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
            "Type": "CODE_COVERAGE",
        });
    });
    test('defaults to report group type=TEST when not specified explicitly', () => {
        const stack = new cdk.Stack();
        new codebuild.ReportGroup(stack, 'ReportGroup', {});
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::ReportGroup', {
            "Type": "TEST",
        });
    });
    test.each([
        [lib_1.ReportGroupType.CODE_COVERAGE, 'codebuild:BatchPutCodeCoverages'],
        [lib_1.ReportGroupType.TEST, 'codebuild:BatchPutTestCases'],
    ])('has correct policy when type is %s', (type, policyStatement) => {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([
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
    test('has policy for type test when type is not defined', () => {
        const stack = new cdk.Stack();
        const reportGroup = new codebuild.ReportGroup(stack, 'ReportGroup');
        const project = new codebuild.Project(stack, 'TestProject', {
            buildSpec: {
                toBuildSpec: () => '',
                isImmediate: true,
            },
        });
        reportGroup.grantWrite(project);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([
                    {
                        Action: [
                            "codebuild:CreateReport",
                            "codebuild:UpdateReport",
                            "codebuild:BatchPutTestCases",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0LWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXBvcnQtZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsb0NBQW9DO0FBQ3BDLGdDQUF5QztBQUV6QyxnQ0FBZ0M7QUFDaEMsMkJBQTJCO0FBRTNCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsSUFBSSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsRUFBRTtRQUM1RSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRWhELHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDZCQUE2QixFQUFFO1lBQzdFLE1BQU0sRUFBRSxNQUFNO1lBQ2QsY0FBYyxFQUFFO2dCQUNkLGtCQUFrQixFQUFFLFdBQVc7Z0JBQy9CLGVBQWUsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTthQUNoQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUM5QyxlQUFlLEVBQUUsaUJBQWlCO1NBQ25DLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDZCQUE2QixFQUFFO1lBQzdFLE1BQU0sRUFBRSxpQkFBaUI7U0FDMUIsQ0FBQyxD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LElBQUk7YUFDbEI7U0FDRixDQUFDLENBQUM7UUFDSCxXQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUM7b0JBQ3pCO3dCQUNFLE1BQU0sRUFBRTs0QkFDTix3QkFBd0I7NEJBQ3hCLHdCQUF3Qjs0QkFDeEIsNkJBQTZCO3lCQUM5Qjt3QkFDRCxNQUFNLEVBQUUsT0FBTzt3QkFDZixRQUFRLEVBQUU7NEJBQ1IsWUFBWSxFQUFFO2dDQUNaLHFCQUFxQjtnQ0FDckIsS0FBSzs2QkFDTjt5QkFDRjtxQkFDRjtpQkFDRixDQUFDO2dCQUNGLE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgUmVwb3J0R3JvdXBUeXBlIH0gZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlcyAqL1xuXG5kZXNjcmliZSgnVGVzdCBSZXBvcnRzIEdyb3VwcycsICgpID0+IHtcbiAgdGVzdCgnZ2V0IGNyZWF0ZWQgd2l0aCB0eXBlPVRFU1QgYW5kIGV4cG9ydENvbmZpZz1OT19FWFBPUlQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdSZXBvcnRHcm91cCcpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpSZXBvcnRHcm91cCcsIHtcbiAgICAgIFwiVHlwZVwiOiBcIlRFU1RcIixcbiAgICAgIFwiRXhwb3J0Q29uZmlnXCI6IHtcbiAgICAgICAgXCJFeHBvcnRDb25maWdUeXBlXCI6IFwiTk9fRVhQT1JUXCIsXG4gICAgICAgIFwiUzNEZXN0aW5hdGlvblwiOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBjcmVhdGVkIHdpdGggbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdSZXBvcnRHcm91cCcsIHtcbiAgICAgIHJlcG9ydEdyb3VwTmFtZTogJ215LXJlcG9ydC1ncm91cCcsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlJlcG9ydEdyb3VwJywge1xuICAgICAgXCJOYW1lXCI6ICdteS1yZXBvcnQtZ3JvdXAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgaW1wb3J0ZWQgYnkgbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHJlcG9ydEdyb3VwID0gY29kZWJ1aWxkLlJlcG9ydEdyb3VwLmZyb21SZXBvcnRHcm91cE5hbWUoc3RhY2ssXG4gICAgICAnUmVwb3J0R3JvdXAnLCAnbXktcmVwb3J0LWdyb3VwJyk7XG5cbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSxcbiAgICB9KTtcbiAgICByb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnY29kZWJ1aWxkOionXSxcbiAgICAgIHJlc291cmNlczogW3JlcG9ydEdyb3VwLnJlcG9ydEdyb3VwQXJuXSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3QocmVwb3J0R3JvdXAucmVwb3J0R3JvdXBOYW1lKS50b0VxdWFsKCdteS1yZXBvcnQtZ3JvdXAnKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFwiUG9saWN5RG9jdW1lbnRcIjoge1xuICAgICAgICBcIlN0YXRlbWVudFwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJBY3Rpb25cIjogXCJjb2RlYnVpbGQ6KlwiLFxuICAgICAgICAgICAgXCJSZXNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgIFwiRm46OkpvaW5cIjogW1wiXCIsIFtcbiAgICAgICAgICAgICAgICBcImFybjpcIixcbiAgICAgICAgICAgICAgICB7IFwiUmVmXCI6IFwiQVdTOjpQYXJ0aXRpb25cIiB9LFxuICAgICAgICAgICAgICAgIFwiOmNvZGVidWlsZDpcIixcbiAgICAgICAgICAgICAgICB7IFwiUmVmXCI6IFwiQVdTOjpSZWdpb25cIiB9LFxuICAgICAgICAgICAgICAgIFwiOlwiLFxuICAgICAgICAgICAgICAgIHsgXCJSZWZcIjogXCJBV1M6OkFjY291bnRJZFwiIH0sXG4gICAgICAgICAgICAgICAgXCI6cmVwb3J0LWdyb3VwL215LXJlcG9ydC1ncm91cFwiLFxuICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZnkgZXhwb3J0Q29uZmlnPVMzIHdoZW4gcHJvdmlkaW5nIGFuIGV4cG9ydEJ1Y2tldCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdSZXBvcnRHcm91cCcsIHtcbiAgICAgIGV4cG9ydEJ1Y2tldDogczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnQnVja2V0JywgJ215LWJ1Y2tldCcpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpSZXBvcnRHcm91cCcsIHtcbiAgICAgIFwiVHlwZVwiOiBcIlRFU1RcIixcbiAgICAgIFwiRXhwb3J0Q29uZmlnXCI6IHtcbiAgICAgICAgXCJFeHBvcnRDb25maWdUeXBlXCI6IFwiUzNcIixcbiAgICAgICAgXCJTM0Rlc3RpbmF0aW9uXCI6IHtcbiAgICAgICAgICBcIkJ1Y2tldFwiOiBcIm15LWJ1Y2tldFwiLFxuICAgICAgICAgIFwiRW5jcnlwdGlvbktleVwiOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgICBcIkVuY3J5cHRpb25EaXNhYmxlZFwiOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgICBcIlBhY2thZ2luZ1wiOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZnkgZW5jcnlwdGlvbktleSBpbiBFeHBvcnRDb25maWcuUzNEZXN0aW5hdGlvbiBpZiBleHBvcnRCdWNrZXQgaGFzIGEgS2V5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGNvZGVidWlsZC5SZXBvcnRHcm91cChzdGFjaywgJ1JlcG9ydEdyb3VwJywge1xuICAgICAgZXhwb3J0QnVja2V0OiBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6ICdteS1idWNrZXQnLFxuICAgICAgICBlbmNyeXB0aW9uS2V5OiBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2ssICdLZXknLFxuICAgICAgICAgICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleS9teS1rZXknKSxcbiAgICAgIH0pLFxuICAgICAgemlwRXhwb3J0OiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpSZXBvcnRHcm91cCcsIHtcbiAgICAgIFwiVHlwZVwiOiBcIlRFU1RcIixcbiAgICAgIFwiRXhwb3J0Q29uZmlnXCI6IHtcbiAgICAgICAgXCJFeHBvcnRDb25maWdUeXBlXCI6IFwiUzNcIixcbiAgICAgICAgXCJTM0Rlc3RpbmF0aW9uXCI6IHtcbiAgICAgICAgICBcIkJ1Y2tldFwiOiBcIm15LWJ1Y2tldFwiLFxuICAgICAgICAgIFwiRW5jcnlwdGlvbkRpc2FibGVkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiRW5jcnlwdGlvbktleVwiOiBcImFybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5L215LWtleVwiLFxuICAgICAgICAgIFwiUGFja2FnaW5nXCI6IFwiWklQXCIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdnZXQgY3JlYXRlZCB3aXRoIFJlbW92YWxQb2xpY3kuUkVUQUlOIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlJlcG9ydEdyb3VwKHN0YWNrLCAnUmVwb3J0R3JvdXAnKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6Q29kZUJ1aWxkOjpSZXBvcnRHcm91cCcsIHtcbiAgICAgIFwiRGVsZXRpb25Qb2xpY3lcIjogXCJSZXRhaW5cIixcbiAgICAgIFwiVXBkYXRlUmVwbGFjZVBvbGljeVwiOiBcIlJldGFpblwiLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgY3JlYXRlZCB3aXRoIFJlbW92YWxQb2xpY3kuREVTVFJPWScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdSZXBvcnRHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNvZGVCdWlsZDo6UmVwb3J0R3JvdXAnLCB7XG4gICAgICBcIkRlbGV0aW9uUG9saWN5XCI6IFwiRGVsZXRlXCIsXG4gICAgICBcIlVwZGF0ZVJlcGxhY2VQb2xpY3lcIjogXCJEZWxldGVcIixcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgd2l0aCB0eXBlPUNPREVfQ09WRVJBR0UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlJlcG9ydEdyb3VwKHN0YWNrLCAnUmVwb3J0R3JvdXAnLCB7XG4gICAgICB0eXBlOiBSZXBvcnRHcm91cFR5cGUuQ09ERV9DT1ZFUkFHRSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UmVwb3J0R3JvdXAnLCB7XG4gICAgICBcIlR5cGVcIjogXCJDT0RFX0NPVkVSQUdFXCIsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHRzIHRvIHJlcG9ydCBncm91cCB0eXBlPVRFU1Qgd2hlbiBub3Qgc3BlY2lmaWVkIGV4cGxpY2l0bHknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlJlcG9ydEdyb3VwKHN0YWNrLCAnUmVwb3J0R3JvdXAnLCB7fSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlJlcG9ydEdyb3VwJywge1xuICAgICAgXCJUeXBlXCI6IFwiVEVTVFwiLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFtSZXBvcnRHcm91cFR5cGUuQ09ERV9DT1ZFUkFHRSwgJ2NvZGVidWlsZDpCYXRjaFB1dENvZGVDb3ZlcmFnZXMnXSxcbiAgICBbUmVwb3J0R3JvdXBUeXBlLlRFU1QsICdjb2RlYnVpbGQ6QmF0Y2hQdXRUZXN0Q2FzZXMnXSxcbiAgXSkoJ2hhcyBjb3JyZWN0IHBvbGljeSB3aGVuIHR5cGUgaXMgJXMnLCAodHlwZTogUmVwb3J0R3JvdXBUeXBlLCBwb2xpY3lTdGF0ZW1lbnQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgcmVwb3J0R3JvdXAgPSBuZXcgY29kZWJ1aWxkLlJlcG9ydEdyb3VwKHN0YWNrLCAnUmVwb3J0R3JvdXAnLCB7XG4gICAgICB0eXBlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Rlc3RQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiB7XG4gICAgICAgIHRvQnVpbGRTcGVjOiAoKSA9PiAnJyxcbiAgICAgICAgaXNJbW1lZGlhdGU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJlcG9ydEdyb3VwLmdyYW50V3JpdGUocHJvamVjdCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgXCJjb2RlYnVpbGQ6Q3JlYXRlUmVwb3J0XCIsXG4gICAgICAgICAgICAgIFwiY29kZWJ1aWxkOlVwZGF0ZVJlcG9ydFwiLFxuICAgICAgICAgICAgICBwb2xpY3lTdGF0ZW1lbnQsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiBcIkFsbG93XCIsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICAgIFwiUmVwb3J0R3JvdXA4QTg0Qzc2RFwiLFxuICAgICAgICAgICAgICAgIFwiQXJuXCIsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgICBWZXJzaW9uOiBcIjIwMTItMTAtMTdcIixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2hhcyBwb2xpY3kgZm9yIHR5cGUgdGVzdCB3aGVuIHR5cGUgaXMgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCByZXBvcnRHcm91cCA9IG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdSZXBvcnRHcm91cCcpO1xuXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Rlc3RQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiB7XG4gICAgICAgIHRvQnVpbGRTcGVjOiAoKSA9PiAnJyxcbiAgICAgICAgaXNJbW1lZGlhdGU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJlcG9ydEdyb3VwLmdyYW50V3JpdGUocHJvamVjdCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgXCJjb2RlYnVpbGQ6Q3JlYXRlUmVwb3J0XCIsXG4gICAgICAgICAgICAgIFwiY29kZWJ1aWxkOlVwZGF0ZVJlcG9ydFwiLFxuICAgICAgICAgICAgICBcImNvZGVidWlsZDpCYXRjaFB1dFRlc3RDYXNlc1wiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogXCJBbGxvd1wiLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgXCJGbjo6R2V0QXR0XCI6IFtcbiAgICAgICAgICAgICAgICBcIlJlcG9ydEdyb3VwOEE4NEM3NkRcIixcbiAgICAgICAgICAgICAgICBcIkFyblwiLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKSxcbiAgICAgICAgVmVyc2lvbjogXCIyMDEyLTEwLTE3XCIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19