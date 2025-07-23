import { defaultOrigin, defaultOriginGroup, defaultOriginWithOriginAccessControl } from './test-origin';
import { Annotations, Match, Template } from '../../assertions';
import * as acm from '../../aws-certificatemanager';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import { App, Aws, Duration, Stack, Token } from '../../core';
import {
  AllowedMethods,
  CfnDistribution,
  MTDistribution,
  Endpoint,
  Function,
  FunctionCode,
  FunctionEventType,
  GeoRestriction,
  HttpVersion,
  IOrigin,
  LambdaEdgeEventType,
  PriceClass,
  RealtimeLogConfig,
  SecurityPolicyProtocol,
  SSLMethod,
} from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  const origin = defaultOrigin();
  const dist = new MTDistribution(stack, 'MyDist', { defaultBehavior: { origin } });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
        Compress: true,
        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        ViewerProtocolPolicy: 'allow-all',
      },
      Enabled: true,
      HttpVersion: 'http2',
      IPV6Enabled: false,
      Origins: [{
        DomainName: 'www.example.com',
        Id: 'StackMyDistOrigin1D6D5E535',
        CustomOriginConfig: {
          OriginProtocolPolicy: 'https-only',
        },
      }],
    },
  });

  expect(dist.distributionArn).toEqual(`arn:${Aws.PARTITION}:cloudfront::1234:distribution/${dist.distributionId}`);
});

