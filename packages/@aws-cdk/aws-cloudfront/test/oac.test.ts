import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { OriginAccessControl, OriginAccessControlOriginType, OriginAccessControlSigningBehavior } from '../lib';

describe('Origin Access Control', () => {
  test('With required origin types', () => {
    const stack = new cdk.Stack();

    new OriginAccessControl(stack, 'OACMediaStore', {
      originType: OriginAccessControlOriginType.MEDIASTORE,
    });

    new OriginAccessControl(stack, 'OACS3', {
      originType: OriginAccessControlOriginType.S3,
    });

    const tmpl = Template.fromStack(stack);
    tmpl.resourceCountIs('AWS::CloudFront::OriginAccessControl', 2);
    tmpl.templateMatches(
      {
        Resources: {
          OACMediaStoreCD88D134: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                OriginAccessControlOriginType: 'mediastore',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4',
              },
            },
          },
          OACS35438DEEA: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4',
              },
            },
          },
        },
      },
    );
  });

  test('With provided OAC name', () => {
    const stack = new cdk.Stack();

    new OriginAccessControl(stack, 'OACS3', {
      originAccessControlName: 'OACPhysicalId',
      originType: OriginAccessControlOriginType.S3,
    });

    const tmpl = Template.fromStack(stack);
    tmpl.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    tmpl.templateMatches(
      {
        Resources: {
          OACS35438DEEA: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'OACPhysicalId',
              },
            },
          },
        },
      },
    );
  });

  test('Default stack singletons', () => {
    const stack = new cdk.Stack();
    const nested = new Construct(stack, 'Construct');

    OriginAccessControl.fromS3Defaults(stack);
    OriginAccessControl.fromS3Defaults(stack);
    OriginAccessControl.fromMediaStoreDefaults(stack);
    OriginAccessControl.fromMediaStoreDefaults(nested);
    OriginAccessControl.fromS3Defaults(nested);
    OriginAccessControl.fromMediaStoreDefaults(nested);

    const tmpl = Template.fromStack(stack);

    tmpl.resourceCountIs('AWS::CloudFront::OriginAccessControl', 2);
    tmpl.templateMatches(
      {
        Resources: {
          OriginAccessControlACB7EFE0CA7DB170D0C7D8E8DC4943CFAFE70B28: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4',
              },
            },
          },
          OriginAccessControl07ED4DB176D4FB972C6FA0038059996CB0D48653: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                OriginAccessControlOriginType: 'mediastore',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4',
              },
            },
          },
        },
      },
    );
  });

  test('Default stack singletons with behavior overrides', () => {
    const stack = new cdk.Stack();

    OriginAccessControl.fromS3Defaults(stack, undefined, undefined);
    OriginAccessControl.fromS3Defaults(stack, undefined, OriginAccessControlSigningBehavior.ALWAYS);
    OriginAccessControl.fromS3Defaults(stack, undefined, OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromS3Defaults(stack, undefined, OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromS3Defaults(stack, undefined, OriginAccessControlSigningBehavior.NO_OVERRIDE);
    OriginAccessControl.fromS3Defaults(stack, undefined, OriginAccessControlSigningBehavior.NO_OVERRIDE);

    OriginAccessControl.fromMediaStoreDefaults(stack, undefined, undefined);
    OriginAccessControl.fromMediaStoreDefaults(stack, undefined, OriginAccessControlSigningBehavior.ALWAYS);
    OriginAccessControl.fromMediaStoreDefaults(stack, undefined, OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromMediaStoreDefaults(stack, undefined, OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromMediaStoreDefaults(stack, undefined, OriginAccessControlSigningBehavior.NO_OVERRIDE);
    OriginAccessControl.fromMediaStoreDefaults(stack, undefined, OriginAccessControlSigningBehavior.NO_OVERRIDE);

    const tmpl = Template.fromStack(stack);
    tmpl.resourceCountIs('AWS::CloudFront::OriginAccessControl', 6);
    for (const val of ['always', 'never', 'no-override']) {
      const props = { OriginAccessControlConfig: { SigningBehavior: val } };
      tmpl.resourcePropertiesCountIs('AWS::CloudFront::OriginAccessControl', props, 2);
    }
  });

  test('Defaults with explicit construct ids', () => {
    const stack = new cdk.Stack();

    OriginAccessControl.fromS3Defaults(stack, 'OACS1', undefined);
    OriginAccessControl.fromS3Defaults(stack, 'OACS2', OriginAccessControlSigningBehavior.ALWAYS);
    OriginAccessControl.fromS3Defaults(stack, 'OACS3', OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromS3Defaults(stack, 'OACS4', OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromS3Defaults(stack, 'OACS5', OriginAccessControlSigningBehavior.NO_OVERRIDE);
    OriginAccessControl.fromS3Defaults(stack, 'OACS6', OriginAccessControlSigningBehavior.NO_OVERRIDE);

    OriginAccessControl.fromMediaStoreDefaults(stack, 'OACM1', undefined);
    OriginAccessControl.fromMediaStoreDefaults(stack, 'OACM2', OriginAccessControlSigningBehavior.ALWAYS);
    OriginAccessControl.fromMediaStoreDefaults(stack, 'OACM3', OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromMediaStoreDefaults(stack, 'OACM4', OriginAccessControlSigningBehavior.NEVER);
    OriginAccessControl.fromMediaStoreDefaults(stack, 'OACM5', OriginAccessControlSigningBehavior.NO_OVERRIDE);
    OriginAccessControl.fromMediaStoreDefaults(stack, 'OACM6', OriginAccessControlSigningBehavior.NO_OVERRIDE);

    const tmpl = Template.fromStack(stack);
    tmpl.resourceCountIs('AWS::CloudFront::OriginAccessControl', 12);
    for (const val of ['always', 'never', 'no-override']) {
      const props = { OriginAccessControlConfig: { SigningBehavior: val } };
      tmpl.resourcePropertiesCountIs('AWS::CloudFront::OriginAccessControl', props, 4);
    }
  });
});

