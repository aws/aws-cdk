"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudwatch = require("aws-cdk-lib/aws-cloudwatch");
const ec2 = require("aws-cdk-lib/aws-ec2");
const targets = require("aws-cdk-lib/aws-events-targets");
const lambda = require("aws-cdk-lib/aws-lambda");
const logs = require("aws-cdk-lib/aws-logs");
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const rds = require("aws-cdk-lib/aws-rds");
const app = new cdk.App();
class DatabaseInstanceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });
        /// !show
        // Set open cursors with parameter group
        const parameterGroup = new rds.ParameterGroup(this, 'ParameterGroup', {
            engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
            parameters: {
                open_cursors: '2500',
            },
        });
        /// Add XMLDB and OEM with option group
        const optionGroup = new rds.OptionGroup(this, 'OptionGroup', {
            engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
            configurations: [
                {
                    name: 'LOCATOR',
                },
                {
                    name: 'OEM',
                    port: 1158,
                    vpc,
                },
            ],
        });
        // Allow connections to OEM
        optionGroup.optionConnections.OEM.connections.allowDefaultPortFromAnyIpv4();
        // Database instance with production values
        const instance = new rds.DatabaseInstance(this, 'Instance', {
            engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
            licenseModel: rds.LicenseModel.BRING_YOUR_OWN_LICENSE,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
            multiAz: true,
            storageType: rds.StorageType.IO1,
            credentials: rds.Credentials.fromUsername('syscdk'),
            vpc,
            databaseName: 'ORCL',
            storageEncrypted: true,
            backupRetention: cdk.Duration.days(7),
            monitoringInterval: cdk.Duration.seconds(60),
            enablePerformanceInsights: true,
            cloudwatchLogsExports: [
                'trace',
                'audit',
                'alert',
                'listener',
            ],
            cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
            autoMinorVersionUpgrade: true,
            optionGroup,
            parameterGroup,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        // Allow connections on default port from any IPV4
        instance.connections.allowDefaultPortFromAnyIpv4();
        // Rotate the master user password every 30 days
        instance.addRotationSingleUser();
        // Add alarm for high CPU
        new cloudwatch.Alarm(this, 'HighCPU', {
            metric: instance.metricCPUUtilization(),
            threshold: 90,
            evaluationPeriods: 1,
        });
        // Trigger Lambda function on instance availability events
        const fn = new lambda.Function(this, 'Function', {
            code: lambda.Code.fromInline('exports.handler = (event) => console.log(event);'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const availabilityRule = instance.onEvent('Availability', { target: new targets.LambdaFunction(fn) });
        availabilityRule.addEventPattern({
            detail: {
                EventCategories: [
                    'availability',
                ],
            },
        });
        /// !hide
    }
}
new DatabaseInstanceStack(app, 'aws-cdk-rds-instance');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaW5zdGFuY2UubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuaW5zdGFuY2UubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseURBQXlEO0FBQ3pELDJDQUEyQztBQUMzQywwREFBMEQ7QUFDMUQsaURBQWlEO0FBQ2pELDZDQUE2QztBQUM3QyxtQ0FBbUM7QUFDbkMsNkNBQTRDO0FBQzVDLDJDQUEyQztBQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzNDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBELFNBQVM7UUFDVCx3Q0FBd0M7UUFDeEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNwRSxNQUFNLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMxRyxVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFLE1BQU07YUFDckI7U0FDRixDQUFDLENBQUM7UUFFSCx1Q0FBdUM7UUFDdkMsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDM0QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxD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O0FBRUQsSUFBSSxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUN2RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWV2ZW50cy10YXJnZXRzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJkcyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIERhdGFiYXNlSW5zdGFuY2VTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVlBDJywgeyBtYXhBenM6IDIgfSk7XG5cbiAgICAvLy8gIXNob3dcbiAgICAvLyBTZXQgb3BlbiBjdXJzb3JzIHdpdGggcGFyYW1ldGVyIGdyb3VwXG4gICAgY29uc3QgcGFyYW1ldGVyR3JvdXAgPSBuZXcgcmRzLlBhcmFtZXRlckdyb3VwKHRoaXMsICdQYXJhbWV0ZXJHcm91cCcsIHtcbiAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlSW5zdGFuY2VFbmdpbmUub3JhY2xlU2UyKHsgdmVyc2lvbjogcmRzLk9yYWNsZUVuZ2luZVZlcnNpb24uVkVSXzE5XzBfMF8wXzIwMjBfMDRfUjEgfSksXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIG9wZW5fY3Vyc29yczogJzI1MDAnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vLyBBZGQgWE1MREIgYW5kIE9FTSB3aXRoIG9wdGlvbiBncm91cFxuICAgIGNvbnN0IG9wdGlvbkdyb3VwID0gbmV3IHJkcy5PcHRpb25Hcm91cCh0aGlzLCAnT3B0aW9uR3JvdXAnLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUluc3RhbmNlRW5naW5lLm9yYWNsZVNlMih7IHZlcnNpb246IHJkcy5PcmFjbGVFbmdpbmVWZXJzaW9uLlZFUl8xOV8wXzBfMF8yMDIwXzA0X1IxIH0pLFxuICAgICAgY29uZmlndXJhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdMT0NBVE9SJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdPRU0nLFxuICAgICAgICAgIHBvcnQ6IDExNTgsXG4gICAgICAgICAgdnBjLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIEFsbG93IGNvbm5lY3Rpb25zIHRvIE9FTVxuICAgIG9wdGlvbkdyb3VwLm9wdGlvbkNvbm5lY3Rpb25zLk9FTS5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbUFueUlwdjQoKTtcblxuICAgIC8vIERhdGFiYXNlIGluc3RhbmNlIHdpdGggcHJvZHVjdGlvbiB2YWx1ZXNcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyByZHMuRGF0YWJhc2VJbnN0YW5jZSh0aGlzLCAnSW5zdGFuY2UnLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUluc3RhbmNlRW5naW5lLm9yYWNsZVNlMih7IHZlcnNpb246IHJkcy5PcmFjbGVFbmdpbmVWZXJzaW9uLlZFUl8xOV8wXzBfMF8yMDIwXzA0X1IxIH0pLFxuICAgICAgbGljZW5zZU1vZGVsOiByZHMuTGljZW5zZU1vZGVsLkJSSU5HX1lPVVJfT1dOX0xJQ0VOU0UsXG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuQlVSU1RBQkxFMywgZWMyLkluc3RhbmNlU2l6ZS5NRURJVU0pLFxuICAgICAgbXVsdGlBejogdHJ1ZSxcbiAgICAgIHN0b3JhZ2VUeXBlOiByZHMuU3RvcmFnZVR5cGUuSU8xLFxuICAgICAgY3JlZGVudGlhbHM6IHJkcy5DcmVkZW50aWFscy5mcm9tVXNlcm5hbWUoJ3N5c2NkaycpLFxuICAgICAgdnBjLFxuICAgICAgZGF0YWJhc2VOYW1lOiAnT1JDTCcsXG4gICAgICBzdG9yYWdlRW5jcnlwdGVkOiB0cnVlLFxuICAgICAgYmFja3VwUmV0ZW50aW9uOiBjZGsuRHVyYXRpb24uZGF5cyg3KSxcbiAgICAgIG1vbml0b3JpbmdJbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgZW5hYmxlUGVyZm9ybWFuY2VJbnNpZ2h0czogdHJ1ZSxcbiAgICAgIGNsb3Vkd2F0Y2hMb2dzRXhwb3J0czogW1xuICAgICAgICAndHJhY2UnLFxuICAgICAgICAnYXVkaXQnLFxuICAgICAgICAnYWxlcnQnLFxuICAgICAgICAnbGlzdGVuZXInLFxuICAgICAgXSxcbiAgICAgIGNsb3Vkd2F0Y2hMb2dzUmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgICAgYXV0b01pbm9yVmVyc2lvblVwZ3JhZGU6IHRydWUsIC8vIHJlcXVpcmVkIHRvIGJlIHRydWUgaWYgTE9DQVRPUiBpcyB1c2VkIGluIHRoZSBvcHRpb24gZ3JvdXBcbiAgICAgIG9wdGlvbkdyb3VwLFxuICAgICAgcGFyYW1ldGVyR3JvdXAsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICAvLyBBbGxvdyBjb25uZWN0aW9ucyBvbiBkZWZhdWx0IHBvcnQgZnJvbSBhbnkgSVBWNFxuICAgIGluc3RhbmNlLmNvbm5lY3Rpb25zLmFsbG93RGVmYXVsdFBvcnRGcm9tQW55SXB2NCgpO1xuXG4gICAgLy8gUm90YXRlIHRoZSBtYXN0ZXIgdXNlciBwYXNzd29yZCBldmVyeSAzMCBkYXlzXG4gICAgaW5zdGFuY2UuYWRkUm90YXRpb25TaW5nbGVVc2VyKCk7XG5cbiAgICAvLyBBZGQgYWxhcm0gZm9yIGhpZ2ggQ1BVXG4gICAgbmV3IGNsb3Vkd2F0Y2guQWxhcm0odGhpcywgJ0hpZ2hDUFUnLCB7XG4gICAgICBtZXRyaWM6IGluc3RhbmNlLm1ldHJpY0NQVVV0aWxpemF0aW9uKCksXG4gICAgICB0aHJlc2hvbGQ6IDkwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgfSk7XG5cbiAgICAvLyBUcmlnZ2VyIExhbWJkYSBmdW5jdGlvbiBvbiBpbnN0YW5jZSBhdmFpbGFiaWxpdHkgZXZlbnRzXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2V4cG9ydHMuaGFuZGxlciA9IChldmVudCkgPT4gY29uc29sZS5sb2coZXZlbnQpOycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhdmFpbGFiaWxpdHlSdWxlID0gaW5zdGFuY2Uub25FdmVudCgnQXZhaWxhYmlsaXR5JywgeyB0YXJnZXQ6IG5ldyB0YXJnZXRzLkxhbWJkYUZ1bmN0aW9uKGZuKSB9KTtcbiAgICBhdmFpbGFiaWxpdHlSdWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgRXZlbnRDYXRlZ29yaWVzOiBbXG4gICAgICAgICAgJ2F2YWlsYWJpbGl0eScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuICB9XG59XG5cbm5ldyBEYXRhYmFzZUluc3RhbmNlU3RhY2soYXBwLCAnYXdzLWNkay1yZHMtaW5zdGFuY2UnKTtcbmFwcC5zeW50aCgpO1xuIl19