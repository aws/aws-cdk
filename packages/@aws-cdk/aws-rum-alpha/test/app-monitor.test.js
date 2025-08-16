"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const lambda = require("aws-cdk-lib/aws-lambda");
const logs = require("aws-cdk-lib/aws-logs");
const aws_logs_destinations_1 = require("aws-cdk-lib/aws-logs-destinations");
const lib_1 = require("../lib");
describe('AWS RUM Alpha', () => {
    let stack;
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
    });
    describe('AppMonitor L2 Construct', () => {
        describe('basic functionality', () => {
            test('creates app monitor with minimal configuration', () => {
                // WHEN
                new lib_1.AppMonitor(stack, 'TestAppMonitor', {
                    appMonitorName: 'test-app',
                    domain: 'example.com',
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::RUM::AppMonitor', {
                    Name: 'test-app',
                    Domain: 'example.com',
                });
            });
            test('creates app monitor with CloudWatch logs enabled', () => {
                // WHEN
                new lib_1.AppMonitor(stack, 'TestAppMonitor', {
                    appMonitorName: 'test-app',
                    domain: 'example.com',
                    cwLogEnabled: true,
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::RUM::AppMonitor', {
                    Name: 'test-app',
                    Domain: 'example.com',
                    CwLogEnabled: true,
                });
            });
            test('exposes app monitor attributes', () => {
                // WHEN
                const appMonitor = new lib_1.AppMonitor(stack, 'TestAppMonitor', {
                    appMonitorName: 'test-app',
                    domain: 'example.com',
                });
                // THEN
                expect(appMonitor.appMonitorName).toBe('test-app');
                expect(appMonitor.appMonitorId).toBeDefined();
            });
            test('creates app monitor with L2 configuration properties', () => {
                // WHEN
                new lib_1.AppMonitor(stack, 'TestAppMonitor', {
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
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::RUM::AppMonitor', {
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
                    new lib_1.AppMonitor(stack, 'TestAppMonitor', {
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
                const appMonitor = new lib_1.AppMonitor(stack, 'TestAppMonitor', {
                    appMonitorName: 'test-app',
                    domain: 'example.com',
                    cwLogEnabled: true,
                });
                // WHEN
                const logGroup = appMonitor.logGroup;
                // THEN
                expect(logGroup).toBeDefined();
                expect(logGroup.logGroupName).toBeDefined();
            });
            test('returns undefined when cwLogEnabled is false', () => {
                // GIVEN
                const appMonitor = new lib_1.AppMonitor(stack, 'TestAppMonitor', {
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
                const appMonitor = new lib_1.AppMonitor(stack, 'TestAppMonitor', {
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
                const appMonitor = new lib_1.AppMonitor(stack, 'TestAppMonitor', {
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
                const appMonitor = new lib_1.AppMonitor(stack, 'TestAppMonitor', {
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
                    logGroup: appMonitor.logGroup,
                    destination: new aws_logs_destinations_1.LambdaDestination(fn),
                    filterPattern: logs.FilterPattern.allEvents(),
                });
                // THEN - Just verify the subscription filter was created with the correct log group pattern
                const template = assertions_1.Template.fromStack(stack);
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
                const imported = lib_1.AppMonitor.fromAppMonitorAttributes(stack, 'ImportedAppMonitor', {
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
                const imported = lib_1.AppMonitor.fromAppMonitorAttributes(stack, 'ImportedAppMonitor', {
                    appMonitorId: 'existing-id',
                    appMonitorName: 'existing-app',
                    cwLogEnabled: true,
                });
                // WHEN
                const logGroup = imported.logGroup;
                // THEN
                expect(logGroup).toBeDefined();
                expect(logGroup.logGroupName).toBeDefined();
            });
            test('imported app monitor returns undefined when cwLogEnabled is false', () => {
                // GIVEN
                const imported = lib_1.AppMonitor.fromAppMonitorAttributes(stack, 'ImportedAppMonitor', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLW1vbml0b3IudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1tb25pdG9yLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0M7QUFDcEMsdURBQWtEO0FBQ2xELGlEQUFpRDtBQUNqRCw2Q0FBNkM7QUFDN0MsNkVBQXNFO0FBQ3RFLGdDQUFvQztBQUVwQyxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixJQUFJLEtBQVksQ0FBQztJQUVqQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsS0FBSyxHQUFHLElBQUksbUJBQUssRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtRQUN2QyxRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1lBQ25DLElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7Z0JBQzFELE9BQU87Z0JBQ1AsSUFBSSxnQkFBVSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtvQkFDdEMsY0FBYyxFQUFFLFVBQVU7b0JBQzFCLE1BQU0sRUFBRSxhQUFhO2lCQUN0QixDQUFDLENBQUM7Z0JBRUgsT0FBTztnQkFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRTtvQkFDdEUsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLE1BQU0sRUFBRSxhQUFhO2lCQUN0QixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7Z0JBQzVELE9BQU87Z0JBQ1AsSUFBSSxnQkFBVSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtvQkFDdEMsY0FBYyxFQUFFLFVBQVU7b0JBQzFCLE1BQU0sRUFBRSxhQUFhO29CQUNyQixZQUFZLEVBQUUsSUFBSTtpQkFDbkIsQ0FBQyxDQUFDO2dC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OlsiaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncyc7XG5pbXBvcnQgeyBMYW1iZGFEZXN0aW5hdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sb2dzLWRlc3RpbmF0aW9ucyc7XG5pbXBvcnQgeyBBcHBNb25pdG9yIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ0FXUyBSVU0gQWxwaGEnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FwcE1vbml0b3IgTDIgQ29uc3RydWN0JywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdiYXNpYyBmdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgICAgdGVzdCgnY3JlYXRlcyBhcHAgbW9uaXRvciB3aXRoIG1pbmltYWwgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBuZXcgQXBwTW9uaXRvcihzdGFjaywgJ1Rlc3RBcHBNb25pdG9yJywge1xuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAndGVzdC1hcHAnLFxuICAgICAgICAgIGRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSVU06OkFwcE1vbml0b3InLCB7XG4gICAgICAgICAgTmFtZTogJ3Rlc3QtYXBwJyxcbiAgICAgICAgICBEb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2NyZWF0ZXMgYXBwIG1vbml0b3Igd2l0aCBDbG91ZFdhdGNoIGxvZ3MgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBuZXcgQXBwTW9uaXRvcihzdGFjaywgJ1Rlc3RBcHBNb25pdG9yJywge1xuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAndGVzdC1hcHAnLFxuICAgICAgICAgIGRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgICBjd0xvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UlVNOjpBcHBNb25pdG9yJywge1xuICAgICAgICAgIE5hbWU6ICd0ZXN0LWFwcCcsXG4gICAgICAgICAgRG9tYWluOiAnZXhhbXBsZS5jb20nLFxuICAgICAgICAgIEN3TG9nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZXhwb3NlcyBhcHAgbW9uaXRvciBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IGFwcE1vbml0b3IgPSBuZXcgQXBwTW9uaXRvcihzdGFjaywgJ1Rlc3RBcHBNb25pdG9yJywge1xuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAndGVzdC1hcHAnLFxuICAgICAgICAgIGRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoYXBwTW9uaXRvci5hcHBNb25pdG9yTmFtZSkudG9CZSgndGVzdC1hcHAnKTtcbiAgICAgICAgZXhwZWN0KGFwcE1vbml0b3IuYXBwTW9uaXRvcklkKS50b0JlRGVmaW5lZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2NyZWF0ZXMgYXBwIG1vbml0b3Igd2l0aCBMMiBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgbmV3IEFwcE1vbml0b3Ioc3RhY2ssICdUZXN0QXBwTW9uaXRvcicsIHtcbiAgICAgICAgICBhcHBNb25pdG9yTmFtZTogJ3Rlc3QtYXBwJyxcbiAgICAgICAgICBkb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgICAgICAgYXBwTW9uaXRvckNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIGFsbG93Q29va2llczogdHJ1ZSxcbiAgICAgICAgICAgIGVuYWJsZVhSYXk6IHRydWUsXG4gICAgICAgICAgICBzZXNzaW9uU2FtcGxlUmF0ZTogMC41LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY3VzdG9tRXZlbnRzOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVvYmZ1c2NhdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIGphdmFTY3JpcHRTb3VyY2VNYXBzOiB7XG4gICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgIHMzVXJpOiAnczM6Ly9teS1idWNrZXQvc291cmNlLW1hcHMvJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSVU06OkFwcE1vbml0b3InLCB7XG4gICAgICAgICAgTmFtZTogJ3Rlc3QtYXBwJyxcbiAgICAgICAgICBEb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgICAgICAgQXBwTW9uaXRvckNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEFsbG93Q29va2llczogdHJ1ZSxcbiAgICAgICAgICAgIEVuYWJsZVhSYXk6IHRydWUsXG4gICAgICAgICAgICBTZXNzaW9uU2FtcGxlUmF0ZTogMC41LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQ3VzdG9tRXZlbnRzOiB7XG4gICAgICAgICAgICBTdGF0dXM6ICdFTkFCTEVEJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIERlb2JmdXNjYXRpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBKYXZhU2NyaXB0U291cmNlTWFwczoge1xuICAgICAgICAgICAgICBTdGF0dXM6ICdFTkFCTEVEJyxcbiAgICAgICAgICAgICAgUzNVcmk6ICdzMzovL215LWJ1Y2tldC9zb3VyY2UtbWFwcy8nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd0aHJvd3MgZXJyb3Igd2hlbiBKYXZhU2NyaXB0IHNvdXJjZSBtYXBzIGVuYWJsZWQgd2l0aG91dCBzM1VyaScsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTi9USEVOXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IEFwcE1vbml0b3Ioc3RhY2ssICdUZXN0QXBwTW9uaXRvcicsIHtcbiAgICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAndGVzdC1hcHAnLFxuICAgICAgICAgICAgZG9tYWluOiAnZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgZGVvYmZ1c2NhdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgamF2YVNjcmlwdFNvdXJjZU1hcHM6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIC8vIHMzVXJpIGlzIG1pc3NpbmdcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRvVGhyb3coJ3MzVXJpIGlzIHJlcXVpcmVkIHdoZW4gSmF2YVNjcmlwdCBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbG9nR3JvdXAgcHJvcGVydHknLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdyZXR1cm5zIGxvZyBncm91cCB3aGVuIGN3TG9nRW5hYmxlZCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHBNb25pdG9yID0gbmV3IEFwcE1vbml0b3Ioc3RhY2ssICdUZXN0QXBwTW9uaXRvcicsIHtcbiAgICAgICAgICBhcHBNb25pdG9yTmFtZTogJ3Rlc3QtYXBwJyxcbiAgICAgICAgICBkb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgICAgICAgY3dMb2dFbmFibGVkOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IGxvZ0dyb3VwID0gYXBwTW9uaXRvci5sb2dHcm91cDtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChsb2dHcm91cCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KGxvZ0dyb3VwIS5sb2dHcm91cE5hbWUpLnRvQmVEZWZpbmVkKCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgncmV0dXJucyB1bmRlZmluZWQgd2hlbiBjd0xvZ0VuYWJsZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGFwcE1vbml0b3IgPSBuZXcgQXBwTW9uaXRvcihzdGFjaywgJ1Rlc3RBcHBNb25pdG9yJywge1xuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAndGVzdC1hcHAnLFxuICAgICAgICAgIGRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgICBjd0xvZ0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IGxvZ0dyb3VwID0gYXBwTW9uaXRvci5sb2dHcm91cDtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChsb2dHcm91cCkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3JldHVybnMgdW5kZWZpbmVkIHdoZW4gY3dMb2dFbmFibGVkIGlzIG5vdCBzZXQgKGRlZmF1bHRzIHRvIGZhbHNlKScsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3QgYXBwTW9uaXRvciA9IG5ldyBBcHBNb25pdG9yKHN0YWNrLCAnVGVzdEFwcE1vbml0b3InLCB7XG4gICAgICAgICAgYXBwTW9uaXRvck5hbWU6ICd0ZXN0LWFwcCcsXG4gICAgICAgICAgZG9tYWluOiAnZXhhbXBsZS5jb20nLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IGxvZ0dyb3VwID0gYXBwTW9uaXRvci5sb2dHcm91cDtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChsb2dHcm91cCkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2NhY2hlcyBsb2cgZ3JvdXAgaW5zdGFuY2UgKGxhenkgZXZhbHVhdGlvbiknLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGFwcE1vbml0b3IgPSBuZXcgQXBwTW9uaXRvcihzdGFjaywgJ1Rlc3RBcHBNb25pdG9yJywge1xuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAndGVzdC1hcHAnLFxuICAgICAgICAgIGRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgICBjd0xvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgbG9nR3JvdXAxID0gYXBwTW9uaXRvci5sb2dHcm91cDtcbiAgICAgICAgY29uc3QgbG9nR3JvdXAyID0gYXBwTW9uaXRvci5sb2dHcm91cDtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChsb2dHcm91cDEpLnRvQmUobG9nR3JvdXAyKTsgLy8gU2FtZSBpbnN0YW5jZVxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dvcmtzIHdpdGggTGFtYmRhIHN1YnNjcmlwdGlvbiBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGFwcE1vbml0b3IgPSBuZXcgQXBwTW9uaXRvcihzdGFjaywgJ1Rlc3RBcHBNb25pdG9yJywge1xuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAndGVzdC1hcHAnLFxuICAgICAgICAgIGRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgICBjd0xvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ1Rlc3RGdW5jdGlvbicsIHtcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfTEFURVNULFxuICAgICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7fTsnKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBuZXcgbG9ncy5TdWJzY3JpcHRpb25GaWx0ZXIoc3RhY2ssICdUZXN0U3Vic2NyaXB0aW9uJywge1xuICAgICAgICAgIGxvZ0dyb3VwOiBhcHBNb25pdG9yLmxvZ0dyb3VwISxcbiAgICAgICAgICBkZXN0aW5hdGlvbjogbmV3IExhbWJkYURlc3RpbmF0aW9uKGZuKSxcbiAgICAgICAgICBmaWx0ZXJQYXR0ZXJuOiBsb2dzLkZpbHRlclBhdHRlcm4uYWxsRXZlbnRzKCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU4gLSBKdXN0IHZlcmlmeSB0aGUgc3Vic2NyaXB0aW9uIGZpbHRlciB3YXMgY3JlYXRlZCB3aXRoIHRoZSBjb3JyZWN0IGxvZyBncm91cCBwYXR0ZXJuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkxvZ3M6OlN1YnNjcmlwdGlvbkZpbHRlcicsIDEpO1xuXG4gICAgICAgIC8vIFZlcmlmeSB0aGUgbG9nIGdyb3VwIG5hbWUgZm9sbG93cyB0aGUgZXhwZWN0ZWQgcGF0dGVyblxuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25GaWx0ZXJzID0gdGVtcGxhdGUuZmluZFJlc291cmNlcygnQVdTOjpMb2dzOjpTdWJzY3JpcHRpb25GaWx0ZXInKTtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uRmlsdGVyID0gT2JqZWN0LnZhbHVlcyhzdWJzY3JpcHRpb25GaWx0ZXJzKVswXTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmlwdGlvbkZpbHRlci5Qcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZVsnRm46OlN1YiddWzBdKS50b0JlKCdSVU1TZXJ2aWNlXyR7TmFtZX0ke0lkfScpO1xuICAgICAgICBleHBlY3Qoc3Vic2NyaXB0aW9uRmlsdGVyLlByb3BlcnRpZXMuTG9nR3JvdXBOYW1lWydGbjo6U3ViJ11bMV0uTmFtZSkudG9CZSgndGVzdC1hcHAnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2Zyb21BcHBNb25pdG9yQXR0cmlidXRlcycsICgpID0+IHtcbiAgICAgIHRlc3QoJ2ltcG9ydHMgZXhpc3RpbmcgYXBwIG1vbml0b3InLCAoKSA9PiB7XG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgaW1wb3J0ZWQgPSBBcHBNb25pdG9yLmZyb21BcHBNb25pdG9yQXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQXBwTW9uaXRvcicsIHtcbiAgICAgICAgICBhcHBNb25pdG9ySWQ6ICdleGlzdGluZy1pZCcsXG4gICAgICAgICAgYXBwTW9uaXRvck5hbWU6ICdleGlzdGluZy1hcHAnLFxuICAgICAgICAgIGN3TG9nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoaW1wb3J0ZWQuYXBwTW9uaXRvcklkKS50b0JlKCdleGlzdGluZy1pZCcpO1xuICAgICAgICBleHBlY3QoaW1wb3J0ZWQuYXBwTW9uaXRvck5hbWUpLnRvQmUoJ2V4aXN0aW5nLWFwcCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2ltcG9ydGVkIGFwcCBtb25pdG9yIGxvZ0dyb3VwIHdvcmtzIHdoZW4gY3dMb2dFbmFibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGltcG9ydGVkID0gQXBwTW9uaXRvci5mcm9tQXBwTW9uaXRvckF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEFwcE1vbml0b3InLCB7XG4gICAgICAgICAgYXBwTW9uaXRvcklkOiAnZXhpc3RpbmctaWQnLFxuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAnZXhpc3RpbmctYXBwJyxcbiAgICAgICAgICBjd0xvZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgbG9nR3JvdXAgPSBpbXBvcnRlZC5sb2dHcm91cDtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChsb2dHcm91cCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KGxvZ0dyb3VwIS5sb2dHcm91cE5hbWUpLnRvQmVEZWZpbmVkKCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnaW1wb3J0ZWQgYXBwIG1vbml0b3IgcmV0dXJucyB1bmRlZmluZWQgd2hlbiBjd0xvZ0VuYWJsZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGltcG9ydGVkID0gQXBwTW9uaXRvci5mcm9tQXBwTW9uaXRvckF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEFwcE1vbml0b3InLCB7XG4gICAgICAgICAgYXBwTW9uaXRvcklkOiAnZXhpc3RpbmctaWQnLFxuICAgICAgICAgIGFwcE1vbml0b3JOYW1lOiAnZXhpc3RpbmctYXBwJyxcbiAgICAgICAgICBjd0xvZ0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IGxvZ0dyb3VwID0gaW1wb3J0ZWQubG9nR3JvdXA7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QobG9nR3JvdXApLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19