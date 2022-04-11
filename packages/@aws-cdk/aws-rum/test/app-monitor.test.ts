import { Template } from '@aws-cdk/assertions';
import * as identitypool from '@aws-cdk/aws-cognito-identitypool';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import * as rum from '../lib';

describe('App monitor', () => {
  test('Default app monitor', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });

    // The only one identity pool that is automatically generated
    template.resourceCountIs('AWS::Cognito::IdentityPool', 1);
    template.hasResource('AWS::IAM::Policy', {
      Properties: {
        PolicyDocument: {
          Statement: [
            {
              Action: 'rum:PutRumEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':rum:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':appmonitor/MyAppMonitor',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        Roles: [
          {
            Ref: 'MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655',
          },
        ],
      },
    });
    // The only two roles that is automatically generated for auth and unauth
    template.resourceCountIs('AWS::IAM::Role', 2);
  });

  test('App monitor with physical name', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      appMonitorName: 'my-app-monitor',
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'my-app-monitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with persistence will be set CwLogEnabled to true', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      persistence: true,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        CwLogEnabled: true,
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with allow cookies', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      allowCookies: true,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          AllowCookies: true,
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with enable X-Ray', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      enableXRay: true,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          EnableXRay: true,
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with exclude pages', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      excludedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          ExcludedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with include pages', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      includedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          IncludedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with favorite pages', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      favoritePages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          FavoritePages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with session sample rate', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      sessionSampleRate: 0.1,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 0.1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with telemetries', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      telemetries: [rum.Telemetry.ERRORS],
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          GuestRoleArn: {
            'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'MyAppMonitorIdentityPoolEF658265',
          },
          Telemetries: ['errors'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });
  });

  test('App monitor with identity pool', () => {
    const stack = new Stack();
    const identityPool = new identitypool.IdentityPool(stack, 'ExistIdentityPool');
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      identityPool,
      role: identityPool.unauthenticatedRole,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          GuestRoleArn: {
            'Fn::GetAtt': ['ExistIdentityPoolUnauthenticatedRoleADC46387', 'Arn'],
          },
          IdentityPoolId: {
            Ref: 'ExistIdentityPool911FDB0C',
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });

    // The only one that is manually created
    template.resourceCountIs('AWS::Cognito::IdentityPool', 1);
    template.hasResource('AWS::Cognito::IdentityPool', {});

    // Policy generated
    template.hasResource('AWS::IAM::Policy', {
      Properties: {
        PolicyDocument: {
          Statement: [
            {
              Action: 'rum:PutRumEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':rum:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':appmonitor/MyAppMonitor',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        Roles: [
          {
            Ref: 'ExistIdentityPoolUnauthenticatedRoleADC46387',
          },
        ],
      },
    });
    template.resourceCountIs('AWS::IAM::Role', 2);
  });

  test('App monitor with imported identity pool', () => {
    const stack = new Stack();
    const identityPool = identitypool.IdentityPool
      .fromIdentityPoolId(stack, 'ImportedIdentityPool', `${stack.region}:ImportedIdentityPoolId`);

    expect(() => new rum.AppMonitor(stack, 'MissingRoleAppMonitor', {
      domain: 'my-website.com',
      identityPool,
    })).toThrowError('if you are passing an imported \'identityPool\', you must also set the \'role\'');

    const role = iam.Role.fromRoleName(stack, 'ImportedRole', 'UnauthenticatedRole');
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      identityPool,
      role,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          GuestRoleArn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::',
                {
                  Ref: 'AWS::AccountId',
                },
                ':role/UnauthenticatedRole',
              ],
            ],
          },
          IdentityPoolId: {
            'Fn::Join': [
              '',
              [
                {
                  Ref: 'AWS::Region',
                },
                ':ImportedIdentityPoolId',
              ],
            ],
          },
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });

    // Policy generated
    template.hasResource('AWS::IAM::Policy', {
      Properties: {
        PolicyDocument: {
          Statement: [
            {
              Action: 'rum:PutRumEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':rum:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':appmonitor/MyAppMonitor',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        Roles: ['UnauthenticatedRole'],
      },
    });
  });

  test('App monitor with third-party provider', () => {
    const stack = new Stack();
    const myRole = new iam.Role(stack, 'MyRole', {
      assumedBy: new iam.AnyPrincipal(),
    });
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      role: myRole,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::RUM::AppMonitor', {
      Properties: {
        AppMonitorConfiguration: {
          Telemetries: ['errors', 'http', 'performance'],
          SessionSampleRate: 1,
        },
        Name: 'MyAppMonitor',
        Domain: 'my-website.com',
      },
    });

    // Cognito IdentityPool not created
    template.resourceCountIs('AWS::Cognito::IdentityPool', 0);
    template.hasResource('AWS::IAM::Policy', {
      Properties: {
        PolicyDocument: {
          Statement: [
            {
              Action: 'rum:PutRumEvents',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':rum:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':appmonitor/MyAppMonitor',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        Roles: [
          {
            Ref: 'MyRoleF48FFE04',
          },
        ],
      },
    });
    // The only one that is manually created
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Get app monitor ID', () => {
    const stack = new Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });

    expect(stack.resolve(appMonitor.appMonitorId)).toEqual({
      'Fn::GetAtt': ['MyAppMonitorCustomGetAppMonitor15BA2BBF', 'AppMonitor.Id'],
    });
  });

  test('Get app monitor ARN', () => {
    const stack = new Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });

    expect(stack.resolve(appMonitor.appMonitorArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:', { Ref: 'AWS::Partition' },
          ':rum:', { Ref: 'AWS::Region' },
          ':', { Ref: 'AWS::AccountId' },
          ':appmonitor/MyAppMonitor',
        ],
      ],
    });
  });

  test('Get app monitor Name', () => {
    const stack = new Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });

    expect(stack.resolve(appMonitor.appMonitorName)).toEqual('MyAppMonitor');
  });
});
