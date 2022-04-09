/* eslint-disable quote-props */
import { Template } from '@aws-cdk/assertions';
import * as identitypool from '@aws-cdk/aws-cognito-identitypool';
import * as cdk from '@aws-cdk/core';
import * as rum from '../lib';

describe('App monitor', () => {
  test('Default app monitor', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with persistence will be set CwLogEnabled to true', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      persistence: true,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
            },
            'CwLogEnabled': true,
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with allow cookies', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      allowCookies: true,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'AllowCookies': true,
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with enable X-Ray', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      enableXRay: true,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'EnableXRay': true,
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with exclude pages', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      excludedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'ExcludedPages': ['https://my-website.com/foo', 'https://my-website.com/bar'],
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with include pages', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      includedPages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'IncludedPages': ['https://my-website.com/foo', 'https://my-website.com/bar'],
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with favorite pages', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      favoritePages: ['https://my-website.com/foo', 'https://my-website.com/bar'],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'FavoritePages': ['https://my-website.com/foo', 'https://my-website.com/bar'],
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with session sample rate', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      sessionSampleRate: 1,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
              'SessionSampleRate': 1,
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with telemetries', () => {
    const stack = new cdk.Stack();
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      telemetries: [
        rum.Telemetry.ERRORS,
        rum.Telemetry.PERFORMANCE,
        rum.Telemetry.HTTP,
      ],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorIdentityPoolUnauthenticatedRole1FA96655', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPoolEF658265',
              },
              'Telemetries': ['errors', 'performance', 'http'],
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('App monitor with exist identity pool', () => {
    const stack = new cdk.Stack();
    const identityPool = new identitypool.IdentityPool(stack, 'IdentityPool');
    new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
      identityPool,
      role: identityPool.unauthenticatedRole,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['IdentityPoolUnauthenticatedRole68AEFF8B', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'IdentityPoolEC8A1A0D',
              },
            },
            'Name': 'MyAppMonitor',
            'Domain': 'my-website.com',
          },
        },
      },
    });
  });

  test('Get app monitor id', () => {
    const stack = new cdk.Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });
    expect(stack.resolve(appMonitor.appMonitorId)).toEqual({ 'Fn::GetAtt': ['MyAppMonitorCustomGetAppMonitor15BA2BBF', 'AppMonitor.Id'] });
  });

  test('Get app monitor ARN', () => {
    const stack = new cdk.Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      domain: 'my-website.com',
    });
    expect(stack.resolve(appMonitor.appMonitorArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:', { 'Ref': 'AWS::Partition' },
          ':rum:', { 'Ref': 'AWS::Region' },
          ':', { 'Ref': 'AWS::AccountId' },
          ':appmonitor/MyAppMonitor',
        ],
      ],
    });
  });
});
