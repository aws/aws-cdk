import * as cdk from '@aws-cdk/core';
import { Workspace } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-workspace');

const workspace = new Workspace(stack, 'demo-workspace', {
  alias: 'demo-workspace',
});
new cdk.CfnOutput(stack, 'prometheusUrl', { value: workspace.prometheusEndpoint });

new cdk.CfnOutput(stack, 'arn', { value: workspace.workspaceArn });

new cdk.CfnOutput(stack, 'workspaceId', { value: workspace.workspaceId });