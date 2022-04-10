import { expect as expectCDK, haveResource, countResources, haveOutput, haveResourceLike } from '@aws-cdk/assert-internal';
import * as identitypool from '@aws-cdk/aws-cognito-identitypool';
import * as iam from '@aws-cdk/aws-iam';
import { CfnOutput, Stack } from '@aws-cdk/core';
import * as rum from '../lib';

describe('App monitor', () => {
  test('Default app monitor', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });

    const inspector = expectCDK(stack);

    inspector.to(haveResource('AWS::RUM::AppMonitor', {
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
    }));

    // The only one identity pool that is automatically generated
    inspector.to(countResources('AWS::Cognito::IdentityPool', 1));
    inspector.to(haveResource('AWS::Cognito::IdentityPool'));
    inspector.to(haveResource('AWS::IAM::ManagedPolicy', {
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
      Description: '',
      Path: '/',
    }));
    // The only two roles that is automatically generated for auth and unauth
    inspector.to(countResources('AWS::IAM::Role', 2));
    // Added the rum:PutRumEvents policy to automatically generated role
    inspector.to(haveResourceLike('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          Ref: 'MyAppMonitorPutRumEvents137F5C81',
        },
      ],
    }));
  });

  test('App monitor with physical name', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      appMonitorName: 'my-app-monitor',
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with persistence will be set CwLogEnabled to true', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      persistence: true,
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with allow cookies', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      allowCookies: true,
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with enable X-Ray', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      enableXRay: true,
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with exclude pages', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      excludedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with include pages', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      includedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with favorite pages', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      favoritePages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with session sample rate', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      sessionSampleRate: 0.1,
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with telemetries', () => {
    const stack = new Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      telemetries: [rum.Telemetry.ERRORS],
    });

    expectCDK(stack).to(haveResource('AWS::RUM::AppMonitor', {
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
    }));
  });

  test('App monitor with identity pool', () => {
    const stack = new Stack();
    const identityPool = new identitypool.IdentityPool(stack, 'ExistIdentityPool');
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      identityPool,
      role: identityPool.unauthenticatedRole,
    });

    const inspector = expectCDK(stack);

    inspector.to(haveResource('AWS::RUM::AppMonitor', {
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
    }));

    // The only one that is manually created
    inspector.to(countResources('AWS::Cognito::IdentityPool', 1));
    inspector.to(haveResource('AWS::Cognito::IdentityPool'));

    // ManagedPolicy generated
    inspector.to(haveResource('AWS::IAM::ManagedPolicy', {
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
      Description: '',
      Path: '/',
    }));
    // The only one role that is manually created
    inspector.to(countResources('AWS::IAM::Role', 2));
    // Added the rum:PutRumEvents policy to automatically generated role
    inspector.to(haveResourceLike('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          Ref: 'MyAppMonitorPutRumEvents137F5C81',
        },
      ],
    }));
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

    const inspector = expectCDK(stack);
    inspector.to(haveResource('AWS::RUM::AppMonitor', {
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
    }));

    // ManagedPolicy generated
    inspector.to(haveResource('AWS::IAM::ManagedPolicy', {
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
      Description: '',
      Path: '/',
    }));
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

    const inspector = expectCDK(stack);

    inspector.to(haveResource('AWS::RUM::AppMonitor', {
      AppMonitorConfiguration: {
        Telemetries: ['errors', 'http', 'performance'],
        SessionSampleRate: 1,
      },
      Name: 'MyAppMonitor',
      Domain: 'my-website.com',
    }));

    // Cognito IdentityPool not created
    inspector.to(countResources('AWS::Cognito::IdentityPool', 0));
    inspector.to(haveResource('AWS::IAM::ManagedPolicy', {
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
      Description: '',
      Path: '/',
    }));
    // The only one that is manually created
    inspector.to(countResources('AWS::IAM::Role', 1));
    // Added the rum:PutRumEvents policy
    inspector.to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: '*' },
            Action: 'sts:AssumeRole',
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          Ref: 'MyAppMonitorPutRumEvents137F5C81',
        },
      ],
    }));
  });

  test('Get app monitor ID', () => {
    const stack = new Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });
    new CfnOutput(stack, 'AppMonitorId', {
      value: appMonitor.appMonitorId,
    });

    const inspector = expectCDK(stack);

    inspector.to(haveResource('Custom::GetAppMonitor'));;
    inspector.to(haveOutput({
      outputName: 'AppMonitorId',
      outputValue: { 'Fn::GetAtt': ['MyAppMonitorCustomGetAppMonitor15BA2BBF', 'AppMonitor.Id'] },
    }));
  });

  test('Get app monitor ARN', () => {
    const stack = new Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });
    new CfnOutput(stack, 'AppMonitorArn', {
      value: appMonitor.appMonitorArn,
    });
    expectCDK(stack).to(haveOutput({
      outputName: 'AppMonitorArn',
      outputValue: {
        'Fn::Join': [
          '',
          [
            'arn:', { Ref: 'AWS::Partition' },
            ':rum:', { Ref: 'AWS::Region' },
            ':', { Ref: 'AWS::AccountId' },
            ':appmonitor/MyAppMonitor',
          ],
        ],
      },
    }));
  });

  test('Get app monitor Name', () => {
    const stack = new Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });
    new CfnOutput(stack, 'AppMonitorName', {
      value: appMonitor.appMonitorName,
    });
    expectCDK(stack).to(haveOutput({
      outputName: 'AppMonitorName',
      outputValue: 'MyAppMonitor',
    }));
  });
});
