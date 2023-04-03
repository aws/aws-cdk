"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
// eslint-disable-next-line import/no-extraneous-dependencies
const integ = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });
const myFileSystemPolicy = new aws_iam_1.PolicyDocument({
    statements: [new aws_iam_1.PolicyStatement({
            actions: [
                'elasticfilesystem:ClientWrite',
                'elasticfilesystem:ClientMount',
            ],
            principals: [new aws_iam_1.AccountRootPrincipal()],
            resources: ['*'],
            conditions: {
                Bool: {
                    'elasticfilesystem:AccessedViaMountTarget': 'true',
                },
            },
        })],
});
const fileSystem = new lib_1.FileSystem(stack, 'FileSystem', {
    vpc,
    fileSystemPolicy: myFileSystemPolicy,
});
const accessPoint = new lib_1.AccessPoint(stack, 'AccessPoint', {
    fileSystem,
});
cdk.Tags.of(accessPoint).add('Name', 'MyAccessPoint');
new integ.IntegTest(app, 'FileSystemPolicyTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWZzLWZpbGVzeXN0ZW0tcG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWZzLWZpbGVzeXN0ZW0tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDO0FBQ3hDLDhDQUF5RjtBQUN6RixxQ0FBcUM7QUFDckMsNkRBQTZEO0FBQzdELDhDQUE4QztBQUM5QyxnQ0FBaUQ7QUFFakQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRW5ELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyRSxNQUFNLGtCQUFrQixHQUFHLElBQUksd0JBQWMsQ0FBQztJQUM1QyxVQUFVLEVBQUUsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDL0IsT0FBTyxFQUFFO2dCQUNQLCtCQUErQjtnQkFDL0IsK0JBQStCO2FBQ2hDO1lBQ0QsVUFBVSxFQUFFLENBQUMsSUFBSSw4QkFBb0IsRUFBRSxDQUFDO1lBQ3hDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNoQixVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFO29CQUNKLDBDQUEwQyxFQUFFLE1BQU07aUJBQ25EO2FBQ0Y7U0FDRixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNyRCxHQUFHO0lBQ0gsZ0JBQWdCLEVBQUUsa0JBQWtCO0NBQ3JDLENBQUMsQ0FBQztBQUVILE1BQU0sV0FBVyxHQUFHLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO0lBQ3hELFVBQVU7Q0FDWCxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBRXRELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDL0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IEFjY291bnRSb290UHJpbmNpcGFsLCBQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBBY2Nlc3NQb2ludCwgRmlsZVN5c3RlbSB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdC1lZnMtaW50ZWcnKTtcblxuY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMywgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbmNvbnN0IG15RmlsZVN5c3RlbVBvbGljeSA9IG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICBhY3Rpb25zOiBbXG4gICAgICAnZWxhc3RpY2ZpbGVzeXN0ZW06Q2xpZW50V3JpdGUnLFxuICAgICAgJ2VsYXN0aWNmaWxlc3lzdGVtOkNsaWVudE1vdW50JyxcbiAgICBdLFxuICAgIHByaW5jaXBhbHM6IFtuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKV0sXG4gICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICBjb25kaXRpb25zOiB7XG4gICAgICBCb29sOiB7XG4gICAgICAgICdlbGFzdGljZmlsZXN5c3RlbTpBY2Nlc3NlZFZpYU1vdW50VGFyZ2V0JzogJ3RydWUnLFxuICAgICAgfSxcbiAgICB9LFxuICB9KV0sXG59KTtcblxuY29uc3QgZmlsZVN5c3RlbSA9IG5ldyBGaWxlU3lzdGVtKHN0YWNrLCAnRmlsZVN5c3RlbScsIHtcbiAgdnBjLFxuICBmaWxlU3lzdGVtUG9saWN5OiBteUZpbGVTeXN0ZW1Qb2xpY3ksXG59KTtcblxuY29uc3QgYWNjZXNzUG9pbnQgPSBuZXcgQWNjZXNzUG9pbnQoc3RhY2ssICdBY2Nlc3NQb2ludCcsIHtcbiAgZmlsZVN5c3RlbSxcbn0pO1xuY2RrLlRhZ3Mub2YoYWNjZXNzUG9pbnQpLmFkZCgnTmFtZScsICdNeUFjY2Vzc1BvaW50Jyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnRmlsZVN5c3RlbVBvbGljeVRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=