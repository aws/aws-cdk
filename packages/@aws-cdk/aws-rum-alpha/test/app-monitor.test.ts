import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { AppMonitor } from '../lib';

describe('AWS RUM Alpha', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  describe('AppMonitor L2 Construct', () => {
    describe('basic functionality', () => {
      test('creates app monitor with minimal configuration', () => {
        // WHEN
        new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::RUM::AppMonitor', {
          Name: 'test-app',
          Domain: 'example.com',
        });
      });

      test('creates app monitor with CloudWatch logs enabled', () => {
        // WHEN
        new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
          cwLogEnabled: true,
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::RUM::AppMonitor', {
          Name: 'test-app',
          Domain: 'example.com',
          CwLogEnabled: true,
        });
      });

      test('exposes app monitor attributes', () => {
        // WHEN
        const appMonitor = new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
        });

        // THEN
        expect(appMonitor.appMonitorName).toBe('test-app');
        expect(appMonitor.appMonitorId).toBeDefined();
      });

      test('creates app monitor with L2 configuration properties', () => {
        // WHEN
        new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
          appMonitorConfiguration: {
            allowCookies: true,
            enableXRay: true,
            sessionSampleRate: 0.5,
          },
          customEvents: {
            enabled: true,
          },
          deobfuscationConfiguration: {
            javaScriptSourceMaps: {
              enabled: true,
              s3Uri: 's3://my-bucket/source-maps/',
            },
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::RUM::AppMonitor', {
          Name: 'test-app',
          Domain: 'example.com',
          AppMonitorConfiguration: {
            AllowCookies: true,
            EnableXRay: true,
            SessionSampleRate: 0.5,
          },
          CustomEvents: {
            Status: 'ENABLED',
          },
          DeobfuscationConfiguration: {
            JavaScriptSourceMaps: {
              Status: 'ENABLED',
              S3Uri: 's3://my-bucket/source-maps/',
            },
          },
        });
      });

      test('throws error when JavaScript source maps enabled without s3Uri', () => {
        // WHEN/THEN
        expect(() => {
          new AppMonitor(stack, 'TestAppMonitor', {
            appMonitorName: 'test-app',
            domain: 'example.com',
            deobfuscationConfiguration: {
              javaScriptSourceMaps: {
                enabled: true,
                // s3Uri is missing
              },
            },
          });
        }).toThrow('s3Uri is required when JavaScript source maps are enabled');
      });
    });

    describe('logGroup property', () => {
      test('returns log group when cwLogEnabled is true', () => {
        // GIVEN
        const appMonitor = new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
          cwLogEnabled: true,
        });

        // WHEN
        const logGroup = appMonitor.logGroup;

        // THEN
        expect(logGroup).toBeDefined();
        expect(logGroup!.logGroupName).toBeDefined();
      });

      test('returns undefined when cwLogEnabled is false', () => {
        // GIVEN
        const appMonitor = new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
          cwLogEnabled: false,
        });

        // WHEN
        const logGroup = appMonitor.logGroup;

        // THEN
        expect(logGroup).toBeUndefined();
      });

      test('returns undefined when cwLogEnabled is not set (defaults to false)', () => {
        // GIVEN
        const appMonitor = new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
        });

        // WHEN
        const logGroup = appMonitor.logGroup;

        // THEN
        expect(logGroup).toBeUndefined();
      });

      test('caches log group instance (lazy evaluation)', () => {
        // GIVEN
        const appMonitor = new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
          cwLogEnabled: true,
        });

        // WHEN
        const logGroup1 = appMonitor.logGroup;
        const logGroup2 = appMonitor.logGroup;

        // THEN
        expect(logGroup1).toBe(logGroup2); // Same instance
      });

      test('works with Lambda subscription filter', () => {
        // GIVEN
        const appMonitor = new AppMonitor(stack, 'TestAppMonitor', {
          appMonitorName: 'test-app',
          domain: 'example.com',
          cwLogEnabled: true,
        });

        const fn = new lambda.Function(stack, 'TestFunction', {
          runtime: lambda.Runtime.NODEJS_LATEST,
          handler: 'index.handler',
          code: lambda.Code.fromInline('exports.handler = async () => {};'),
        });

        // WHEN
        new logs.SubscriptionFilter(stack, 'TestSubscription', {
          logGroup: appMonitor.logGroup!,
          destination: new LambdaDestination(fn),
          filterPattern: logs.FilterPattern.allEvents(),
        });

        // THEN - Just verify the subscription filter was created with the correct log group pattern
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::Logs::SubscriptionFilter', 1);

        // Verify the log group name follows the expected pattern
        const subscriptionFilters = template.findResources('AWS::Logs::SubscriptionFilter');
        const subscriptionFilter = Object.values(subscriptionFilters)[0];
        expect(subscriptionFilter.Properties.LogGroupName['Fn::Sub'][0]).toBe('RUMService_${Name}${Id}');
        expect(subscriptionFilter.Properties.LogGroupName['Fn::Sub'][1].Name).toBe('test-app');
      });
    });

    describe('fromAppMonitorAttributes', () => {
      test('imports existing app monitor', () => {
        // WHEN
        const imported = AppMonitor.fromAppMonitorAttributes(stack, 'ImportedAppMonitor', {
          appMonitorId: 'existing-id',
          appMonitorName: 'existing-app',
          cwLogEnabled: true,
        });

        // THEN
        expect(imported.appMonitorId).toBe('existing-id');
        expect(imported.appMonitorName).toBe('existing-app');
      });

      test('imported app monitor logGroup works when cwLogEnabled is true', () => {
        // GIVEN
        const imported = AppMonitor.fromAppMonitorAttributes(stack, 'ImportedAppMonitor', {
          appMonitorId: 'existing-id',
          appMonitorName: 'existing-app',
          cwLogEnabled: true,
        });

        // WHEN
        const logGroup = imported.logGroup;

        // THEN
        expect(logGroup).toBeDefined();
        expect(logGroup!.logGroupName).toBeDefined();
      });

      test('imported app monitor returns undefined when cwLogEnabled is false', () => {
        // GIVEN
        const imported = AppMonitor.fromAppMonitorAttributes(stack, 'ImportedAppMonitor', {
          appMonitorId: 'existing-id',
          appMonitorName: 'existing-app',
          cwLogEnabled: false,
        });

        // WHEN
        const logGroup = imported.logGroup;

        // THEN
        expect(logGroup).toBeUndefined();
      });
    });
  });
});
