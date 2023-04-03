"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const autoscaling = require("../lib");
cdk_build_tools_1.describeDeprecated('scheduled action', () => {
    test('can schedule an action', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = makeAutoScalingGroup(stack);
        // WHEN
        asg.scaleOnSchedule('ScaleOutInTheMorning', {
            schedule: autoscaling.Schedule.cron({ hour: '8', minute: '0' }),
            minCapacity: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::ScheduledAction', {
            Recurrence: '0 8 * * *',
            MinSize: 10,
        });
    });
    test('correctly formats date objects', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = makeAutoScalingGroup(stack);
        // WHEN
        asg.scaleOnSchedule('ScaleOutInTheMorning', {
            schedule: autoscaling.Schedule.cron({ hour: '8' }),
            startTime: new Date(Date.UTC(2033, 8, 10, 12, 0, 0)),
            minCapacity: 11,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::ScheduledAction', {
            StartTime: '2033-09-10T12:00:00Z',
        });
    });
    test('have timezone property', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = makeAutoScalingGroup(stack);
        // WHEN
        asg.scaleOnSchedule('ScaleOutAtMiddaySeoul', {
            schedule: autoscaling.Schedule.cron({ hour: '12', minute: '0' }),
            minCapacity: 12,
            timeZone: 'Asia/Seoul',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::ScheduledAction', {
            MinSize: 12,
            Recurrence: '0 12 * * *',
            TimeZone: 'Asia/Seoul',
        });
    });
    test('autoscaling group has recommended updatepolicy for scheduled actions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = makeAutoScalingGroup(stack);
        // WHEN
        asg.scaleOnSchedule('ScaleOutInTheMorning', {
            schedule: autoscaling.Schedule.cron({ hour: '8' }),
            minCapacity: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                ASG46ED3070: {
                    Type: 'AWS::AutoScaling::AutoScalingGroup',
                    Properties: {
                        MaxSize: '1',
                        MinSize: '1',
                        LaunchConfigurationName: { Ref: 'ASGLaunchConfigC00AF12B' },
                        Tags: [
                            {
                                Key: 'Name',
                                PropagateAtLaunch: true,
                                Value: 'Default/ASG',
                            },
                        ],
                        VPCZoneIdentifier: [
                            { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
                            { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
                        ],
                    },
                    UpdatePolicy: {
                        AutoScalingRollingUpdate: {
                            WaitOnResourceSignals: false,
                            PauseTime: 'PT0S',
                            SuspendProcesses: [
                                'HealthCheck',
                                'ReplaceUnhealthy',
                                'AZRebalance',
                                'AlarmNotification',
                                'ScheduledActions',
                            ],
                        },
                        AutoScalingScheduledAction: {
                            IgnoreUnmodifiedGroupSizeProperties: true,
                        },
                    },
                },
            },
            Parameters: {
                SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter: {
                    Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
                    Default: '/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2',
                },
            },
        });
    });
    test('scheduled scaling shows warning when minute is not defined in cron', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = makeAutoScalingGroup(stack);
        // WHEN
        asg.scaleOnSchedule('ScaleOutInTheMorning', {
            schedule: autoscaling.Schedule.cron({ hour: '8' }),
            minCapacity: 10,
        });
        // THEN
        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/ASG/ScheduledActionScaleOutInTheMorning', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
    });
    test('scheduled scaling shows no warning when minute is * in cron', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = makeAutoScalingGroup(stack);
        // WHEN
        asg.scaleOnSchedule('ScaleOutInTheMorning', {
            schedule: autoscaling.Schedule.cron({
                hour: '8',
                minute: '*',
            }),
            minCapacity: 10,
        });
        // THEN
        const annotations = assertions_1.Annotations.fromStack(stack).findWarning('*', assertions_1.Match.anyValue());
        expect(annotations.length).toBe(0);
    });
    test('ScheduledActions have a name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = makeAutoScalingGroup(stack);
        const action = asg.scaleOnSchedule('ScaleOutAtMiddaySeoul', {
            schedule: autoscaling.Schedule.cron({ hour: '12', minute: '0' }),
            minCapacity: 12,
            timeZone: 'Asia/Seoul',
        });
        expect(action.scheduledActionName).toBeDefined();
    });
});
function makeAutoScalingGroup(scope) {
    const vpc = new ec2.Vpc(scope, 'VPC');
    return new autoscaling.AutoScalingGroup(scope, 'ASG', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: new ec2.AmazonLinuxImage(),
        updateType: autoscaling.UpdateType.ROLLING_UPDATE,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVkLWFjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZWR1bGVkLWFjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQW1FO0FBQ25FLHdDQUF3QztBQUN4Qyw4REFBOEQ7QUFDOUQscUNBQXFDO0FBRXJDLHNDQUFzQztBQUV0QyxvQ0FBa0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDMUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtRQUNsQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEMsT0FBTztRQUNQLEdBQUcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUU7WUFDMUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDL0QsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1DQUFtQyxFQUFFO1lBQ25GLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLE9BQU8sRUFBRSxFQUFFO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1FBQzFDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4QyxPQUFPO1FBQ1AsR0FBRyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0Is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Q0FBQztRQUM5QyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7UUFDeEMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsY0FBYztLQUNsRCxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvbnMsIE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgZGVzY3JpYmVEZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZURlcHJlY2F0ZWQoJ3NjaGVkdWxlZCBhY3Rpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiBzY2hlZHVsZSBhbiBhY3Rpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhc2cgPSBtYWtlQXV0b1NjYWxpbmdHcm91cChzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXNnLnNjYWxlT25TY2hlZHVsZSgnU2NhbGVPdXRJblRoZU1vcm5pbmcnLCB7XG4gICAgICBzY2hlZHVsZTogYXV0b3NjYWxpbmcuU2NoZWR1bGUuY3Jvbih7IGhvdXI6ICc4JywgbWludXRlOiAnMCcgfSksXG4gICAgICBtaW5DYXBhY2l0eTogMTAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OlNjaGVkdWxlZEFjdGlvbicsIHtcbiAgICAgIFJlY3VycmVuY2U6ICcwIDggKiAqIConLFxuICAgICAgTWluU2l6ZTogMTAsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvcnJlY3RseSBmb3JtYXRzIGRhdGUgb2JqZWN0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFzZyA9IG1ha2VBdXRvU2NhbGluZ0dyb3VwKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuc2NhbGVPblNjaGVkdWxlKCdTY2FsZU91dEluVGhlTW9ybmluZycsIHtcbiAgICAgIHNjaGVkdWxlOiBhdXRvc2NhbGluZy5TY2hlZHVsZS5jcm9uKHsgaG91cjogJzgnIH0pLFxuICAgICAgc3RhcnRUaW1lOiBuZXcgRGF0ZShEYXRlLlVUQygyMDMzLCA4LCAxMCwgMTIsIDAsIDApKSwgLy8gSmF2YVNjcmlwdCdzIERhdGUgaXMgYSBsaXR0bGUgc2lsbHkuXG4gICAgICBtaW5DYXBhY2l0eTogMTEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OlNjaGVkdWxlZEFjdGlvbicsIHtcbiAgICAgIFN0YXJ0VGltZTogJzIwMzMtMDktMTBUMTI6MDA6MDBaJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaGF2ZSB0aW1lem9uZSBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFzZyA9IG1ha2VBdXRvU2NhbGluZ0dyb3VwKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuc2NhbGVPblNjaGVkdWxlKCdTY2FsZU91dEF0TWlkZGF5U2VvdWwnLCB7XG4gICAgICBzY2hlZHVsZTogYXV0b3NjYWxpbmcuU2NoZWR1bGUuY3Jvbih7IGhvdXI6ICcxMicsIG1pbnV0ZTogJzAnIH0pLFxuICAgICAgbWluQ2FwYWNpdHk6IDEyLFxuICAgICAgdGltZVpvbmU6ICdBc2lhL1Nlb3VsJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6U2NoZWR1bGVkQWN0aW9uJywge1xuICAgICAgTWluU2l6ZTogMTIsXG4gICAgICBSZWN1cnJlbmNlOiAnMCAxMiAqICogKicsXG4gICAgICBUaW1lWm9uZTogJ0FzaWEvU2VvdWwnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhdXRvc2NhbGluZyBncm91cCBoYXMgcmVjb21tZW5kZWQgdXBkYXRlcG9saWN5IGZvciBzY2hlZHVsZWQgYWN0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFzZyA9IG1ha2VBdXRvU2NhbGluZ0dyb3VwKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuc2NhbGVPblNjaGVkdWxlKCdTY2FsZU91dEluVGhlTW9ybmluZycsIHtcbiAgICAgIHNjaGVkdWxlOiBhdXRvc2NhbGluZy5TY2hlZHVsZS5jcm9uKHsgaG91cjogJzgnIH0pLFxuICAgICAgbWluQ2FwYWNpdHk6IDEwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBBU0c0NkVEMzA3MDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYXhTaXplOiAnMScsXG4gICAgICAgICAgICBNaW5TaXplOiAnMScsXG4gICAgICAgICAgICBMYXVuY2hDb25maWd1cmF0aW9uTmFtZTogeyBSZWY6ICdBU0dMYXVuY2hDb25maWdDMDBBRjEyQicgfSxcbiAgICAgICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICAgIFByb3BhZ2F0ZUF0TGF1bmNoOiB0cnVlLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9BU0cnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFZQQ1pvbmVJZGVudGlmaWVyOiBbXG4gICAgICAgICAgICAgIHsgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcgfSxcbiAgICAgICAgICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MlN1Ym5ldENGQ0RBQTdBJyB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICAgICAgQXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlOiB7XG4gICAgICAgICAgICAgIFdhaXRPblJlc291cmNlU2lnbmFsczogZmFsc2UsXG4gICAgICAgICAgICAgIFBhdXNlVGltZTogJ1BUMFMnLFxuICAgICAgICAgICAgICBTdXNwZW5kUHJvY2Vzc2VzOiBbXG4gICAgICAgICAgICAgICAgJ0hlYWx0aENoZWNrJyxcbiAgICAgICAgICAgICAgICAnUmVwbGFjZVVuaGVhbHRoeScsXG4gICAgICAgICAgICAgICAgJ0FaUmViYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAnQWxhcm1Ob3RpZmljYXRpb24nLFxuICAgICAgICAgICAgICAgICdTY2hlZHVsZWRBY3Rpb25zJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBBdXRvU2NhbGluZ1NjaGVkdWxlZEFjdGlvbjoge1xuICAgICAgICAgICAgICBJZ25vcmVVbm1vZGlmaWVkR3JvdXBTaXplUHJvcGVydGllczogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWFtaWFtYXpvbmxpbnV4bGF0ZXN0YW16bmFtaWh2bXg4NjY0Z3AyQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8QVdTOjpFQzI6OkltYWdlOjpJZD4nLFxuICAgICAgICAgIERlZmF1bHQ6ICcvYXdzL3NlcnZpY2UvYW1pLWFtYXpvbi1saW51eC1sYXRlc3QvYW16bi1hbWktaHZtLXg4Nl82NC1ncDInLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2NoZWR1bGVkIHNjYWxpbmcgc2hvd3Mgd2FybmluZyB3aGVuIG1pbnV0ZSBpcyBub3QgZGVmaW5lZCBpbiBjcm9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXNnID0gbWFrZUF1dG9TY2FsaW5nR3JvdXAoc3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIGFzZy5zY2FsZU9uU2NoZWR1bGUoJ1NjYWxlT3V0SW5UaGVNb3JuaW5nJywge1xuICAgICAgc2NoZWR1bGU6IGF1dG9zY2FsaW5nLlNjaGVkdWxlLmNyb24oeyBob3VyOiAnOCcgfSksXG4gICAgICBtaW5DYXBhY2l0eTogMTAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcvRGVmYXVsdC9BU0cvU2NoZWR1bGVkQWN0aW9uU2NhbGVPdXRJblRoZU1vcm5pbmcnLCBcImNyb246IElmIHlvdSBkb24ndCBwYXNzICdtaW51dGUnLCBieSBkZWZhdWx0IHRoZSBldmVudCBydW5zIGV2ZXJ5IG1pbnV0ZS4gUGFzcyAnbWludXRlOiAnKicnIGlmIHRoYXQncyB3aGF0IHlvdSBpbnRlbmQsIG9yICdtaW51dGU6IDAnIHRvIHJ1biBvbmNlIHBlciBob3VyIGluc3RlYWQuXCIpO1xuICB9KTtcblxuICB0ZXN0KCdzY2hlZHVsZWQgc2NhbGluZyBzaG93cyBubyB3YXJuaW5nIHdoZW4gbWludXRlIGlzICogaW4gY3JvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFzZyA9IG1ha2VBdXRvU2NhbGluZ0dyb3VwKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuc2NhbGVPblNjaGVkdWxlKCdTY2FsZU91dEluVGhlTW9ybmluZycsIHtcbiAgICAgIHNjaGVkdWxlOiBhdXRvc2NhbGluZy5TY2hlZHVsZS5jcm9uKHtcbiAgICAgICAgaG91cjogJzgnLFxuICAgICAgICBtaW51dGU6ICcqJyxcbiAgICAgIH0pLFxuICAgICAgbWluQ2FwYWNpdHk6IDEwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFubm90YXRpb25zID0gQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5maW5kV2FybmluZygnKicsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgIGV4cGVjdChhbm5vdGF0aW9ucy5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1NjaGVkdWxlZEFjdGlvbnMgaGF2ZSBhIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhc2cgPSBtYWtlQXV0b1NjYWxpbmdHcm91cChzdGFjayk7XG5cbiAgICBjb25zdCBhY3Rpb24gPSBhc2cuc2NhbGVPblNjaGVkdWxlKCdTY2FsZU91dEF0TWlkZGF5U2VvdWwnLCB7XG4gICAgICBzY2hlZHVsZTogYXV0b3NjYWxpbmcuU2NoZWR1bGUuY3Jvbih7IGhvdXI6ICcxMicsIG1pbnV0ZTogJzAnIH0pLFxuICAgICAgbWluQ2FwYWNpdHk6IDEyLFxuICAgICAgdGltZVpvbmU6ICdBc2lhL1Nlb3VsJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChhY3Rpb24uc2NoZWR1bGVkQWN0aW9uTmFtZSkudG9CZURlZmluZWQoKTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gbWFrZUF1dG9TY2FsaW5nR3JvdXAoc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0KSB7XG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHNjb3BlLCAnVlBDJyk7XG4gIHJldHVybiBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzY29wZSwgJ0FTRycsIHtcbiAgICB2cGMsXG4gICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgIHVwZGF0ZVR5cGU6IGF1dG9zY2FsaW5nLlVwZGF0ZVR5cGUuUk9MTElOR19VUERBVEUsXG4gIH0pO1xufVxuIl19