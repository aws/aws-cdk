/*
 * Integration test for Bedrock Agent Core Browser construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-browser-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-browser-1');

// Create a browser with basic configuration
new agentcore.BrowserCustom(stack, 'Browser', {
  browserCustomName: 'browser',
});

const recordingBucket = new s3.Bucket(stack, 'RecordingBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Create a browser with recording configuration and browser signing
new agentcore.BrowserCustom(stack, 'BrowserWithRecording', {
  browserCustomName: 'browser_recording_integ',
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingPublicNetwork(),
  browserSigning: agentcore.BrowserSigning.ENABLED,
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
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});

app.synth();
