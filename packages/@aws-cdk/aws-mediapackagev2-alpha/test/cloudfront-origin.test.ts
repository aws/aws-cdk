import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as mediapackagev2 from '../lib';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaPackageV2Origin creates distribution with OAC and endpoint policy', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
    channelGroupName: 'test-group',
  });
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
    channelName: 'test-channel',
  });
  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    originEndpointName: 'test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  });

  new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
      origin: new mediapackagev2.MediaPackageV2Origin(endpoint, {
        channelGroup: group,
      }),
    },
  });

  const template = Template.fromStack(stack);

  // OAC is created
  template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
    OriginAccessControlConfig: {
      SigningBehavior: 'always',
      SigningProtocol: 'sigv4',
      OriginAccessControlOriginType: 'mediapackagev2',
    },
  });

  // Endpoint policy is created with CloudFront service principal
  template.hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    Policy: Match.objectLike({
      Statement: Match.arrayWith([
        Match.objectLike({
          Effect: 'Allow',
          Principal: { Service: 'cloudfront.amazonaws.com' },
          Action: ['mediapackagev2:GetObject', 'mediapackagev2:GetHeadObject'],
        }),
      ]),
    }),
  });
});

test('MediaPackageV2Origin uses custom OAC when provided', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
    channelGroupName: 'test-group',
  });
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
    channelName: 'test-channel',
  });
  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    originEndpointName: 'test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  });

  const customOac = new cloudfront.MediaPackageV2OriginAccessControl(stack, 'CustomOAC', {
    originAccessControlName: 'my-custom-oac',
  });

  new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
      origin: new mediapackagev2.MediaPackageV2Origin(endpoint, {
        channelGroup: group,
        originAccessControl: customOac,
      }),
    },
  });

  const template = Template.fromStack(stack);

  // Only one OAC — the custom one
  template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
  template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
    OriginAccessControlConfig: {
      Name: 'my-custom-oac',
    },
  });
});

test('MediaPackageV2Origin throws when channelGroup has no egressDomain', () => {
  const importedGroup = mediapackagev2.ChannelGroup.fromChannelGroupAttributes(stack, 'ImportedGroup', {
    channelGroupName: 'no-egress-group',
  });
  const importedEndpoint = mediapackagev2.OriginEndpoint.fromOriginEndpointAttributes(stack, 'ImportedEndpoint', {
    channelGroupName: 'no-egress-group',
    channelName: 'test-channel',
    originEndpointName: 'test-endpoint',
  });

  expect(() => {
    new mediapackagev2.MediaPackageV2Origin(importedEndpoint, {
      channelGroup: importedGroup,
    });
  }).toThrow(/egressDomain/);
});

test('MediaPackageV2Origin renders HTTPS-only custom origin config', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
    channelGroupName: 'test-group',
  });
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
    channelName: 'test-channel',
  });
  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    originEndpointName: 'test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  });

  new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
      origin: new mediapackagev2.MediaPackageV2Origin(endpoint, {
        channelGroup: group,
      }),
    },
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: Match.arrayWith([
        Match.objectLike({
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
            OriginSSLProtocols: ['TLSv1.2'],
          },
        }),
      ]),
    },
  });
});

test('endpoint policy includes aws:SourceArn condition', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
    channelGroupName: 'test-group',
  });
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
    channelName: 'test-channel',
  });
  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    originEndpointName: 'test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  });

  new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
      origin: new mediapackagev2.MediaPackageV2Origin(endpoint, {
        channelGroup: group,
      }),
    },
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    Policy: Match.objectLike({
      Statement: Match.arrayWith([
        Match.objectLike({
          Condition: {
            StringEquals: {
              'aws:SourceArn': {
                'Fn::Join': Match.anyValue(),
              },
            },
          },
        }),
      ]),
    }),
  });
});

test('distribution origin uses egress domain and OAC ID', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
    channelGroupName: 'test-group',
  });
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
    channelName: 'test-channel',
  });
  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    originEndpointName: 'test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  });

  new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
      origin: new mediapackagev2.MediaPackageV2Origin(endpoint, {
        channelGroup: group,
      }),
    },
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: Match.arrayWith([
        Match.objectLike({
          DomainName: { 'Fn::GetAtt': [Match.stringLikeRegexp('Group'), 'EgressDomain'] },
          OriginAccessControlId: { 'Fn::GetAtt': [Match.stringLikeRegexp('MediaPackageV2OAC'), 'Id'] },
        }),
      ]),
    },
  });
});

test('MediaPackageV2Origin with cdnAuth configures endpoint policy', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group', {
    channelGroupName: 'test-group',
  });
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
    channelName: 'test-channel',
  });
  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    originEndpointName: 'test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  });

  const secret = new Secret(stack, 'CdnSecret');

  new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
      origin: new mediapackagev2.MediaPackageV2Origin(endpoint, {
        channelGroup: group,
        cdnAuth: {
          secrets: [secret],
        },
      }),
    },
  });

  const template = Template.fromStack(stack);

  // CDN auth configuration is present on the endpoint policy
  template.hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    CdnAuthConfiguration: Match.objectLike({
      CdnIdentifierSecretArns: Match.anyValue(),
    }),
  });
});
