import type { Construct } from 'constructs';
import { renderReportGroupArn } from './report-group-utils';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';

export function createLoggingPolicyStatement(scope: Construct, projectName: string): iam.PolicyStatement {
  const logGroupArn = cdk.Stack.of(scope).formatArn({
    service: 'logs',
    resource: 'log-group',
    arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    resourceName: `/aws/codebuild/${projectName}`,
  });
  return new iam.PolicyStatement({
    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
    resources: [logGroupArn, `${logGroupArn}:*`],
  });
}

export function createReportGroupPolicyStatement(scope: Construct, projectName: string): iam.PolicyStatement {
  return new iam.PolicyStatement({
    actions: [
      'codebuild:CreateReportGroup',
      'codebuild:CreateReport',
      'codebuild:UpdateReport',
      'codebuild:BatchPutTestCases',
      'codebuild:BatchPutCodeCoverages',
    ],
    resources: [renderReportGroupArn(scope, `${projectName}-*`)],
  });
}
