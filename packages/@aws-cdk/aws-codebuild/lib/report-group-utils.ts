import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

// this file contains a bunch of functions shared
// between Project and ResourceGroup,
// which we don't want to make part of the public API of this module

export function renderReportGroupArn(scope: Construct, reportGroupName: string): string {
  return cdk.Stack.of(scope).formatArn(reportGroupArnComponents(reportGroupName));
}

export function reportGroupArnComponents(reportGroupName: string): cdk.ArnComponents {
  return {
    service: 'codebuild',
    resource: 'report-group',
    resourceName: reportGroupName,
  };
}
