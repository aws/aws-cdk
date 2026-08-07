import { Template, Match } from 'aws-cdk-lib/assertions';
import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { App, Stack } from 'aws-cdk-lib/core';
import * as mediapackagev2 from '../lib';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaPackagev2 Channel Group Configuration', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'myChannel', {
    channelGroup: group,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });
  const origin = new mediapackagev2.OriginEndpoint(stack, 'myEndpoint', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
  });
  origin.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowRequestsFromCloudFront',
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    effect: Effect.ALLOW,
    actions: ['mediapackagev2:GetHeadObject', 'mediapackagev2:GetObject'],
    resources: [origin.originEndpointArn],
    conditions: {
      StringEquals: {
        'aws:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/AAAAAAAAA',
      },
    },
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    ChannelGroupName: 'MyChannelGroup',
    ChannelName: 'myChannel',
    OriginEndpointName: 'myEndpoint',
    Policy: {
      Version: '2012-10-17',
      Statement: [{
        Action: ['mediapackagev2:GetHeadObject', 'mediapackagev2:GetObject'],
        Condition: {
          StringEquals: {
            'aws:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/AAAAAAAAA',
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'cloudfront.amazonaws.com',
        },
        Resource: {
          'Fn::GetAtt': ['myEndpoint864D0BBD', 'Arn'],
        },
        Sid: 'AllowRequestsFromCloudFront',
      }],
    },
  });
});

test('MediaPackageV2 Origin Endpoint Policy Configuration - creation with construct', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'myChannel', {
    channelGroup: group,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  const origin = new mediapackagev2.OriginEndpoint(stack, 'myEndpoint', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
  });

  const policy = new mediapackagev2.OriginEndpointPolicy(stack, 'OriginPolicy', {
    originEndpoint: origin,
  });

  policy.document.addStatements(new PolicyStatement({
    sid: 'AllowRequestsFromCloudFront',
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    effect: Effect.ALLOW,
    actions: ['mediapackagev2:GetHeadObject', 'mediapackagev2:GetObject'],
    resources: [origin.originEndpointArn],
    conditions: {
      StringEquals: {
        'aws:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/AAAAAAAAA',
      },
    },
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    ChannelGroupName: 'MyChannelGroup',
    ChannelName: 'myChannel',
    OriginEndpointName: 'myEndpoint',
    Policy: {
      Version: '2012-10-17',
      Statement: [{
        Action: ['mediapackagev2:GetHeadObject', 'mediapackagev2:GetObject'],
        Condition: {
          StringEquals: {
            'aws:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/AAAAAAAAA',
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'cloudfront.amazonaws.com',
        },
        Resource: {
          'Fn::GetAtt': ['myEndpoint864D0BBD', 'Arn'],
        },
        Sid: 'AllowRequestsFromCloudFront',
      }],
    },
  });
});

test('OriginEndpointPolicy accepts initial policyDocument', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group');
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
  });
  const origin = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
  });

  new mediapackagev2.OriginEndpointPolicy(stack, 'Policy', {
    originEndpoint: origin,
    policyDocument: new PolicyDocument({
      statements: [
        new PolicyStatement({
          sid: 'TestStatement',
          effect: Effect.ALLOW,
          principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
          actions: ['mediapackagev2:GetObject'],
          resources: [origin.originEndpointArn],
        }),
      ],
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    Policy: {
      Statement: [{
        Sid: 'TestStatement',
        Effect: 'Allow',
        Action: 'mediapackagev2:GetObject',
        Principal: { Service: 'cloudfront.amazonaws.com' },
      }],
    },
  });
});

test('OriginEndpoint cdnAuth from constructor props is applied to policy', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group');
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
  });

  const cdnSecret = new Secret(stack, 'CdnSecret', {
    secretName: 'cdn-auth-secret',
  });
  const cdnRole = new Role(stack, 'CdnRole', {
    assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
  });

  const origin = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
    cdnAuth: {
      secrets: [cdnSecret],
      role: cdnRole,
    },
  });

  origin.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowCloudFront',
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    actions: ['mediapackagev2:GetObject'],
    resources: [origin.originEndpointArn],
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    CdnAuthConfiguration: {
      CdnIdentifierSecretArns: [Match.anyValue()],
      SecretsRoleArn: Match.anyValue(),
    },
  });
});

test('cdnAuth auto-creates role when not provided', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group');
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
  });

  const cdnSecret = new Secret(stack, 'CdnSecret', {
    secretName: 'cdn-auth-secret',
  });

  const origin = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
    cdnAuth: {
      secrets: [cdnSecret],
    },
  });

  origin.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowCloudFront',
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    actions: ['mediapackagev2:GetObject'],
    resources: [origin.originEndpointArn],
  }));

  const template = Template.fromStack(stack);

  // Policy has CDN auth with an auto-created role
  template.hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    CdnAuthConfiguration: {
      CdnIdentifierSecretArns: [Match.anyValue()],
      SecretsRoleArn: Match.anyValue(),
    },
  });

  // Auto-created role has the right trust policy
  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: Match.objectLike({
      Statement: Match.arrayWith([
        Match.objectLike({
          Principal: { Service: 'mediapackagev2.amazonaws.com' },
        }),
      ]),
    }),
  });
});

test('cdnAuth auto-grants secret read access to role', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group');
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
  });

  const cdnSecret = new Secret(stack, 'CdnSecret', {
    secretName: 'cdn-auth-secret',
  });
  const cdnRole = new Role(stack, 'CdnRole', {
    assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
  });

  const origin = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
    cdnAuth: {
      secrets: [cdnSecret],
      role: cdnRole,
    },
  });

  origin.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowCloudFront',
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    actions: ['mediapackagev2:GetObject'],
    resources: [origin.originEndpointArn],
  }));

  // The role should have policies granting secret read + batch access
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: Match.objectLike({
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: Match.arrayWith([
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
          ]),
          Effect: 'Allow',
        }),
        Match.objectLike({
          Action: 'secretsmanager:BatchGetSecretValue',
          Effect: 'Allow',
        }),
      ]),
    }),
  });
});

test('cdnAuth auto-grants KMS decrypt when secret uses customer-managed key', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group');
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
  });

  const kmsKey = new Key(stack, 'KmsKey');
  const cdnSecret = new Secret(stack, 'CdnSecret', {
    secretName: 'cdn-auth-secret-kms',
    encryptionKey: kmsKey,
  });

  const origin = new mediapackagev2.OriginEndpoint(stack, 'Endpoint', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [mediapackagev2.Manifest.hls({ manifestName: 'index' })],
    cdnAuth: {
      secrets: [cdnSecret],
    },
  });

  origin.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowCloudFront',
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    actions: ['mediapackagev2:GetObject'],
    resources: [origin.originEndpointArn],
  }));

  // KMS key policy should grant decrypt to the auto-created role via secretsmanager service
  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
    KeyPolicy: Match.objectLike({
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: 'kms:Decrypt',
          Effect: 'Allow',
          Condition: Match.objectLike({
            StringEquals: Match.objectLike({
              'kms:ViaService': Match.anyValue(),
            }),
          }),
        }),
      ]),
    }),
  });
});
