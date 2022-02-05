/* eslint-disable quote-props */
import { Template } from '@aws-cdk/assertions';
import { Role } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as rum from '../lib';
import { CognitoIdentityPoolAuthorizer, PageIdFormat } from '../lib';

describe('App monitor', () => {
  test('Default app monitor', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
    });
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with persistence will be set CwLogEnabled to true', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      persistence: true,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
            },
            'CwLogEnabled': true,
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with allow cookies', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      appMonitorConfiguration: {
        allowCookies: true,
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'AllowCookies': true,
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with enable X-Ray', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      appMonitorConfiguration: {
        enableXRay: true,
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'EnableXRay': true,
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with exclude pages', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      appMonitorConfiguration: {
        excludedPages: ['https://amazon.com/foo', 'https://amazon.com/bar'],
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'ExcludedPages': ['https://amazon.com/foo', 'https://amazon.com/bar'],
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with include pages', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      appMonitorConfiguration: {
        includedPages: ['https://amazon.com/foo', 'https://amazon.com/bar'],
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'IncludedPages': ['https://amazon.com/foo', 'https://amazon.com/bar'],
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with favorite pages', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      appMonitorConfiguration: {
        favoritePages: ['https://amazon.com/foo', 'https://amazon.com/bar'],
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'FavoritePages': ['https://amazon.com/foo', 'https://amazon.com/bar'],
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with session sample rate', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      appMonitorConfiguration: {
        sessionSampleRate: 1,
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
              'SessionSampleRate': 1,
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with telemetries', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      appMonitorConfiguration: {
        telemetries: [
          rum.Telemetry.ERRORS,
          rum.Telemetry.PERFORMANCE,
          rum.Telemetry.HTTP,
        ],
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': {
                'Fn::GetAtt': ['MyAppMonitorGuestRole572EC659', 'Arn'],
              },
              'IdentityPoolId': {
                'Ref': 'MyAppMonitorIdentityPool3A8D5F1C',
              },
              'Telemetries': ['errors', 'performance', 'http'],
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('App monitor with exist identity pool', () => {
    const stack = new cdk.Stack();

    new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      authorizer: new rum.CognitoIdentityPoolAuthorizer({
        identityPoolId: 'test-user-pool',
        unauthenticatedRole: Role.fromRoleArn(stack, 'GuestRole', 'arn:aws:iam::1111111:role/guest-role'),
      }),
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyAppMonitor37592055': {
          'Type': 'AWS::RUM::AppMonitor',
          'Properties': {
            'AppMonitorConfiguration': {
              'GuestRoleArn': 'arn:aws:iam::1111111:role/guest-role',
              'IdentityPoolId': 'test-user-pool',
            },
            'Name': 'my-app-monitor',
            'Domain': 'amazon.com',
          },
        },
      },
    });
  });

  test('Get app monitor id', () => {
    const stack = new cdk.Stack();

    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
    });
    expect(stack.resolve(appMonitor.appMonitorId)).toEqual({ 'Fn::GetAtt': ['MyAppMonitorCustomGetAppMonitor15BA2BBF', 'AppMonitor.Id'] });
  });

  test('Get app monitor ARN', () => {
    const stack = new cdk.Stack();

    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
    });
    expect(stack.resolve(appMonitor.appMonitorArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:', { 'Ref': 'AWS::Partition' },
          ':rum:', { 'Ref': 'AWS::Region' },
          ':', { 'Ref': 'AWS::AccountId' },
          ':appmonitor/my-app-monitor',
        ],
      ],
    });
  });
});

describe('Generate code snippet', () => {
  test('Common script', () => {
    const stack = new cdk.Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
    });
    const codeSnippet = appMonitor.generateCodeSnippet();
    expect(codeSnippet).toContain(`(function(n,i,v,r,s,c,x,z){x=window.AwsRumClient={q:[],n:n,i:i,v:v,r:r,c:c};window[n]=function(c,p){x.q.push({c:c,p:p});};z=document.createElement(\'script\');z.async=true;z.src=s;document.head.insertBefore(z,document.getElementsByTagName(\'script\')[0]);})(\'cwr\','${appMonitor.appMonitorId}','1.0.0','${stack.region}','https://client.rum.us-east-1.amazonaws.com/1.0.2/cwr.js',{`);
  });

  test('Without option', () => {
    const stack = new cdk.Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      authorizer: new CognitoIdentityPoolAuthorizer({
        identityPoolId: 'my-identity-pool-id',
        unauthenticatedRole: Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/Nexus-Monitor-us-east-1-123456789012_Unauth_5889316876161'),
      }),
    });
    const codeSnippet = appMonitor.generateCodeSnippet();
    expect(codeSnippet).toContain('{' +
      `endpoint:'https://dataplane.rum.${stack.region}.amazonaws.com',` +
      'guestRoleArn:\'arn:aws:iam::123456789012:role/Nexus-Monitor-us-east-1-123456789012_Unauth_5889316876161\',' +
      'identityPoolId:\'my-identity-pool-id\',' +
      'sessionSampleRate:1' +
      '}');
  });

  test('With option', () => {
    const stack = new cdk.Stack();
    const appMonitor = new rum.AppMonitor(stack, 'MyAppMonitor', {
      appMonitorName: 'my-app-monitor',
      domain: 'amazon.com',
      authorizer: new CognitoIdentityPoolAuthorizer({
        identityPoolId: 'my-identity-pool-id',
        unauthenticatedRole: Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/Nexus-Monitor-us-east-1-123456789012_Unauth_5889316876161'),
      }),
    });
    const codeSnippet = appMonitor.generateCodeSnippet({
      allowCookies: true,
      cookieAttibutes: {},
      disableAutoPageView: true,
      enableRumClient: true,
      enableXRay: true,
      endpoint: 'https://dataplane.rum.some-region.amazonaws.com',
      guestRoleArn: 'arn:aws:iam::123456789012:role/my-role',
      identityPoolId: 'some-identity-pool-id',
      pageIdFormat: PageIdFormat.PATH_AND_HASH,
      pagesToInclude: ['/\\/home/'],
      pagesToExclude: ['/\\/home/'],
      recordResourceUrl: true,
      sessionEventLimit: 200,
      sessionSampleRate: 1,
      telemetries: {
        errors: {
          stackTraceLength: 200,
        },
        http: {
          urlsToInclude: ['/\\/home/'],
        },
        performance: {
          eventLimit: 10,
        },
        interaction: {
          events: [
            {
              event: 'click', elementId: 'mybutton',
            },
          ],
        },
      },
    });
    expect(codeSnippet).toContain('{' +
      'allowCookies:true,' +
      'cookieAttibutes:{},' +
      'disableAutoPageView:true,' +
      'enableRumClient:true,' +
      'enableXRay:true,' +
      'endpoint:\'https://dataplane.rum.some-region.amazonaws.com\',' +
      'guestRoleArn:\'arn:aws:iam::123456789012:role/my-role\',' +
      'identityPoolId:\'some-identity-pool-id\',' +
      'pageIdFormat:\'PATH_AND_HASH\',' +
      'pagesToInclude:[/\\/home/],' +
      'pagesToExclude:[/\\/home/],' +
      'recordResourceUrl:true,' +
      'sessionEventLimit:200,' +
      'sessionSampleRate:1,' +
      'telemetries:[' +
      '[\'errors\',{stackTraceLength:200}],'+
      '[\'http\',{urlsToInclude:[/\\/home/]}],'+
      '[\'performance\',{eventLimit:10}],'+
      '[\'interaction\',{events:[{event:\'click\',elementId:\'mybutton\'}]}]'+
      ']' +
      '}');
  });
});