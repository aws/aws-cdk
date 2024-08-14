import { Template } from '../../assertions';
import { Stack } from '../../core';
import { S3OriginAccessControl, SigningBehavior, SigningProtocol, OriginAccessControlOriginType, Signing } from '../lib';

describe('S3OriginAccessControl', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates an S3OriginAccessControl with default properties', () => {
    new S3OriginAccessControl(stack, 'DefaultS3OriginAccessControl');

    Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
  });

  test('creates an OriginAccessControl with custom properties', () => {
    const description = 'Test description';
    const originAccessControlName = 'TestS3OriginAccessControl';
    const signingBehavior = SigningBehavior.NEVER;
    const signingProtocol = SigningProtocol.SIGV4;
    const originAccessControlOriginType = OriginAccessControlOriginType.S3;

    new S3OriginAccessControl(stack, 'MyS3OriginAccessControl', {
      description,
      originAccessControlName,
      signing: Signing.SIGV4_NO_OVERRIDE
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Description: description,
        Name: originAccessControlName,
        SigningBehavior: signingBehavior,
        SigningProtocol: signingProtocol,
        OriginAccessControlOriginType: originAccessControlOriginType,
      },
    });
  });

  test('imports an S3OriginAccessControl from ID', () => {
    const originAccessControlId = 'ABC123ABC123AB';

    const imported = S3OriginAccessControl.fromOriginAccessControlId(stack, 'ImportedS3OriginAccessControl', originAccessControlId);

    expect(imported.originAccessControlId).toEqual(originAccessControlId);
  });
});