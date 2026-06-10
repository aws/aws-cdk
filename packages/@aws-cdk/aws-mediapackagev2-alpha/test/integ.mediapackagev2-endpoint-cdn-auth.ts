import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as mediapackagev2 from '../lib';

/*
 * Integration test for CDN authorization on a MediaPackage v2 OriginEndpoint.
 *
 * Asserts that setting `cdnAuth` on `OriginEndpointProps` produces an endpoint
 * policy that:
 *   - has the AWS-recommended gating PolicyStatement requiring the matching
 *     `mediapackagev2:RequestHasMatchingCdnAuthHeader` condition, AND
 *   - has the CdnAuthConfiguration block wiring the supplied secret + a
 *     service-trust role (auto-created when one isn't passed).
 *
 * Without the statement, the CdnAuthConfiguration is non-functional —
 * see https://docs.aws.amazon.com/mediapackage/latest/userguide/cdn-auth-setup.html
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediapackagev2-endpoint-cdn-auth');

const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
  channelGroupName: 'integ-cdn-auth-group',
});

const channel = new mediapackagev2.Channel(stack, 'Channel', {
  channelGroup: group,
  input: mediapackagev2.InputConfiguration.cmaf(),
});

// MediaPackage requires CDN auth secrets to be JSON-formatted with a
// `MediaPackageV2CDNIdentifier` key holding the CDN-Identifier header value.
// See https://docs.aws.amazon.com/mediapackage/latest/userguide/cdn-auth-setup.html
const secret1 = new Secret(stack, 'secret1', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ MediaPackageV2CDNIdentifier: '' }),
    generateStringKey: 'MediaPackageV2CDNIdentifier',
    excludePunctuation: true,
  },
});
const secret2 = new Secret(stack, 'secret2', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ MediaPackageV2CDNIdentifier: '' }),
    generateStringKey: 'MediaPackageV2CDNIdentifier',
    excludePunctuation: true,
  },
});

const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
  channel,
  segment: mediapackagev2.Segment.cmaf(),
  manifests: [
    mediapackagev2.Manifest.hls({ manifestName: 'index' }),
  ],
  cdnAuth: {
    secrets: [secret1, secret2],
  },
});

new cdk.CfnOutput(stack, 'EndpointArn', { value: endpoint.originEndpointArn });

new IntegTest(app, 'cdk-integ-mediapackagev2-endpoint-cdn-auth', {
  testCases: [stack],
});

app.synth();
