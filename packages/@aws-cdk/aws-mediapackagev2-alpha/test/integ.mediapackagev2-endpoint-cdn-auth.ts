/**
 * Integration test: MediaPackage V2 Origin Endpoint with CDN Authorization (auto-created role)
 */
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as mediapackagev2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-endpoint-cdn-auth');

const group = new mediapackagev2.ChannelGroup(stack, 'Group');
const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
});

// CDN auth secret — MediaPackage V2 requires JSON with MediaPackageCDNIdentifier key
const cdnSecret = new Secret(stack, 'CdnSecret', {
  secretName: 'integ-cdn-auth-secret',
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ MediaPackageV2CDNIdentifier: '' }),
    generateStringKey: 'MediaPackageV2CDNIdentifier',
    excludePunctuation: true,
  },
});

// CDN auth with auto-created role — user only provides the secret
const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  cdnAuth: {
    secrets: [cdnSecret],
  },
});

endpoint.addToResourcePolicy(new PolicyStatement({
  sid: 'AllowCloudFront',
  effect: Effect.ALLOW,
  principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
  actions: ['mediapackagev2:GetObject', 'mediapackagev2:GetHeadObject'],
  resources: [endpoint.originEndpointArn],
  conditions: {
    Bool: {
      'mediapackagev2:RequestHasMatchingCdnAuthHeader': true,
    },
  },
}));

new IntegTest(app, 'cdk-integ-mediapackagev2-endpoint-cdn-auth', {
  testCases: [stack],
});

app.synth();
