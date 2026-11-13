import { Match, Template } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront';
import { S3MrapOrigin } from '../../aws-cloudfront-origins';
import { CfnParameter, Duration, Stack } from '../../core';

describe('S3MrapOrigin', () => {
  test('uses the MRAP hostname and HTTPS custom origin defaults', () => {
    const stack = new Stack();
    const origin = new S3MrapOrigin('mfzwi23gnjvgw.mrap');

    expect(origin.bind(stack, { originId: 'MrapOrigin' }).originProperty).toEqual({
      id: 'MrapOrigin',
      domainName: 'mfzwi23gnjvgw.mrap.accesspoint.s3-global.amazonaws.com',
      customOriginConfig: {
        originProtocolPolicy: 'https-only',
        originSslProtocols: ['TLSv1.2'],
      },
    });
  });

  test('passes through HTTP and common origin options', () => {
    const stack = new Stack();
    const origin = new S3MrapOrigin('mfzwi23gnjvgw.mrap', {
      originAccessControlId: 'my-oac',
      originPath: '/assets',
      connectionAttempts: 2,
      connectionTimeout: Duration.seconds(5),
      customHeaders: { 'X-Custom-Header': 'value' },
      protocolPolicy: cloudfront.OriginProtocolPolicy.MATCH_VIEWER,
      originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
      httpsPort: 8443,
      readTimeout: Duration.seconds(60),
      keepaliveTimeout: Duration.seconds(30),
    });

    expect(origin.bind(stack, { originId: 'MrapOrigin' }).originProperty).toEqual({
      id: 'MrapOrigin',
      domainName: 'mfzwi23gnjvgw.mrap.accesspoint.s3-global.amazonaws.com',
      originAccessControlId: 'my-oac',
      originPath: '/assets',
      connectionAttempts: 2,
      connectionTimeout: 5,
      originCustomHeaders: [{ headerName: 'X-Custom-Header', headerValue: 'value' }],
      customOriginConfig: {
        originProtocolPolicy: 'match-viewer',
        originSslProtocols: ['TLSv1.2'],
        httpsPort: 8443,
        originReadTimeout: 60,
        originKeepaliveTimeout: 30,
      },
    });
  });

  test('supports a token alias with a SigV4A origin access control', () => {
    const stack = new Stack();
    const alias = new CfnParameter(stack, 'Alias');
    const oac = new cloudfront.S3OriginAccessControl(stack, 'OAC', {
      signing: cloudfront.Signing.SIGV4A_ALWAYS,
    });
    new cloudfront.Distribution(stack, 'Distribution', {
      defaultBehavior: {
        origin: new S3MrapOrigin(alias.valueAsString, {
          originAccessControlId: oac.originAccessControlId,
        }),
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Origins: [Match.objectLike({
          DomainName: { 'Fn::Join': ['', [{ Ref: 'Alias' }, '.accesspoint.s3-global.amazonaws.com']] },
          OriginAccessControlId: stack.resolve(oac.originAccessControlId),
          CustomOriginConfig: { OriginProtocolPolicy: 'https-only', OriginSSLProtocols: ['TLSv1.2'] },
          S3OriginConfig: Match.absent(),
        })],
      },
    });
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        OriginAccessControlOriginType: 's3', SigningBehavior: 'always', SigningProtocol: 'sigv4a',
      },
    });
    template.resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 0);
  });
});
