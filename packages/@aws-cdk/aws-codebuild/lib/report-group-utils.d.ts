import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
export declare function renderReportGroupArn(scope: Construct, reportGroupName: string): string;
export declare function reportGroupArnComponents(reportGroupName: string): cdk.ArnComponents;
