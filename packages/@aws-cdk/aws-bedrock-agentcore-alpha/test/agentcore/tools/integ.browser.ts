/*
 * Integration test for Bedrock Agent Core Browser construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-browser-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-browser-1');

// Create a browser with basic configuration
new agentcore.BrowserCustom(stack, 'Browser', {
  browserCustomName: 'browser',
});

const recordingBucket = new s3.Bucket(stack, 'RecordingBucket', {
  bucketName: 'test-browser-recordings',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Create a browser with recording configuration
new agentcore.BrowserCustom(stack, 'BrowserWithRecording', {
  browserCustomName: 'browser_recording',
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingPublicNetwork(),
  recordingConfig: {
    enabled: true,
    s3Location: {
      bucketName: recordingBucket.bucketName,
      objectKey: 'browser-recordings/',
    },
  },
  tags: {
    Environment: 'Dev',
    Team: 'AI/ML',
    Project: 'AgentCore',
  },
});

new integ.IntegTest(app, 'BedrockAgentCoreBrowser', {
  testCases: [stack],
});

app.synth();
