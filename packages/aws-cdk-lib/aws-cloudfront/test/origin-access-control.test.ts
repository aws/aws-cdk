import { Template } from '../../assertions';
import { Names, Stack } from '../../core';
import { FunctionUrlOriginAccessControl, MediaPackageV2OriginAccessControl, S3OriginAccessControl, SigningBehavior, SigningProtocol, OriginAccessControlOriginType, Signing } from '../lib';

describe('S3OriginAccessControl', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates an S3OriginAccessControl with default properties', () => {
    const oac = new S3OriginAccessControl(stack, 'DefaultS3OriginAccessControl');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Name: Names.uniqueResourceName(oac, {
          maxLength: 64,
        }),
        SigningBehavior: SigningBehavior.ALWAYS,
        SigningProtocol: SigningProtocol.SIGV4,
        OriginAccessControlOriginType: OriginAccessControlOriginType.S3,
      },
    });
  });

  test('creates an OriginAccessControl with custom properties', () => {
    const description = 'Test description';
    const originAccessControlName = 'TestS3OriginAccessControl';
    const signingBehavior = SigningBehavior.NO_OVERRIDE;
    const signingProtocol = SigningProtocol.SIGV4;
    const originAccessControlOriginType = OriginAccessControlOriginType.S3;

    new S3OriginAccessControl(stack, 'MyS3OriginAccessControl', {
      description,
      originAccessControlName,
      signing: Signing.SIGV4_NO_OVERRIDE,
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

  test('creates a FunctionUrlOriginAccessControl with default properties', () => {
    const oac = new FunctionUrlOriginAccessControl(stack, 'DefaultFunctionUrlOriginAccessControl');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Name: Names.uniqueResourceName(oac, {
          maxLength: 64,
        }),
        SigningBehavior: SigningBehavior.ALWAYS,
        SigningProtocol: SigningProtocol.SIGV4,
        OriginAccessControlOriginType: OriginAccessControlOriginType.LAMBDA,
      },
    });
  });

  test('creates a FunctionUrlOriginAccessControl with custom properties', () => {
    const description = 'Test description for Function URL OAC';
    const originAccessControlName = 'TestFunctionUrlOriginAccessControl';
    const signingBehavior = SigningBehavior.NO_OVERRIDE;
    const signingProtocol = SigningProtocol.SIGV4;
    const originAccessControlOriginType = OriginAccessControlOriginType.LAMBDA;

    new FunctionUrlOriginAccessControl(stack, 'MyFunctionUrlOriginAccessControl', {
      description,
      originAccessControlName,
      signing: Signing.SIGV4_NO_OVERRIDE,
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

  test('imports a FunctionUrlOriginAccessControl from ID', () => {
    const originAccessControlId = 'XYZ789XYZ789XY';

    const imported = FunctionUrlOriginAccessControl.fromOriginAccessControlId(stack, 'ImportedFunctionUrlOriginAccessControl', originAccessControlId);

    expect(imported.originAccessControlId).toEqual(originAccessControlId);
  });
});

describe('MediaPackageV2OriginAccessControl', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates with default properties', () => {
    new MediaPackageV2OriginAccessControl(stack, 'OAC');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Name: Names.uniqueResourceName(new MediaPackageV2OriginAccessControl(new Stack(), 'OAC'), { maxLength: 64 }),
        SigningBehavior: 'always',
        SigningProtocol: 'sigv4',
        OriginAccessControlOriginType: 'mediapackagev2',
      },
    });
  });

  test('creates with custom description and name', () => {
    new MediaPackageV2OriginAccessControl(stack, 'OAC', {
      description: 'My MediaPackage OAC',
      originAccessControlName: 'custom-mp-oac',
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Name: 'custom-mp-oac',
        Description: 'My MediaPackage OAC',
        SigningBehavior: 'always',
        SigningProtocol: 'sigv4',
        OriginAccessControlOriginType: 'mediapackagev2',
      },
    });
  });

  test('always uses sigv4 always signing', () => {
    new MediaPackageV2OriginAccessControl(stack, 'OAC');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        SigningBehavior: 'always',
        SigningProtocol: 'sigv4',
      },
    });
  });

  test('imports from ID', () => {
    const imported = MediaPackageV2OriginAccessControl.fromOriginAccessControlId(stack, 'Imported', 'EABC123');
    expect(imported.originAccessControlId).toEqual('EABC123');
  });
});
