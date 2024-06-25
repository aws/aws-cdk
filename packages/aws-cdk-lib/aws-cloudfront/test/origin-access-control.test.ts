import { Template } from '../../assertions';
import { Stack } from '../../core';
import { OriginAccessControl, SigningBehavior, SigningProtocol, OriginAccessControlOriginType } from '../lib';

describe('OriginAccessControl', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates an OriginAccessControl with default properties', () => {
    new OriginAccessControl(stack, 'TestOriginAccessControl');

    Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
  });

  test('creates an OriginAccessControl with custom properties', () => {
    const description = 'Test description';
    const originAccessControlName = 'TestOriginAccessControl';
    const signingBehavior = SigningBehavior.NEVER;
    const signingProtocol = SigningProtocol.SIGV4;
    const originAccessControlOriginType = OriginAccessControlOriginType.S3;

    new OriginAccessControl(stack, 'TestOriginAccessControl', {
      description,
      originAccessControlName,
      signingBehavior,
      signingProtocol,
      originAccessControlOriginType,
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

  test('imports an OriginAccessControl from attributes', () => {
    const originAccessControlId = 'ABC123ABC123AB';
    const originAccessControlOriginType = OriginAccessControlOriginType.S3;

    const imported = OriginAccessControl.fromOriginAccessControlAttributes(stack, 'ImportedOriginAccessControl', {
      originAccessControlId,
      originAccessControlOriginType,
    });

    expect(imported.originAccessControlId).toEqual(originAccessControlId);
    expect(imported.originAccessControlOriginType).toEqual(originAccessControlOriginType);
  });

  test('throws an error when originAccessControlName is too long', () => {
    const longName = 'a'.repeat(65);
    expect(() => {
      new OriginAccessControl(stack, 'TestOriginAccessControl', {
        originAccessControlName: longName,
      });
    }).toThrow(`Origin access control name must be 64 characters or less, '${longName}' has length 65`);
  });
});