"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
// eslint-disable-next-line import/no-extraneous-dependencies
const integ = require("@aws-cdk/integ-tests-alpha");
const aws_efs_1 = require("aws-cdk-lib/aws-efs");
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
const fileSystem = new aws_efs_1.FileSystem(stack, 'FileSystem', {
    vpc,
    fileSystemPolicy: myFileSystemPolicy,
});
fileSystem.addToResourcePolicy(new aws_iam_1.PolicyStatement({
    actions: [
        'elasticfilesystem:ClientRootAccess',
    ],
    principals: [new aws_iam_1.AccountRootPrincipal()],
    resources: ['*'],
    conditions: {
        Bool: {
            'elasticfilesystem:AccessedViaMountTarget': 'true',
        },
    },
}));
const accessPoint = new aws_efs_1.AccessPoint(stack, 'AccessPoint', {
    fileSystem,
});
cdk.Tags.of(accessPoint).add('Name', 'MyAccessPoint');
new integ.IntegTest(app, 'FileSystemPolicyTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWZzLWZpbGVzeXN0ZW0tcG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWZzLWZpbGVzeXN0ZW0tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLGlEQUE0RjtBQUM1RixtQ0FBbUM7QUFDbkMsNkRBQTZEO0FBQzdELG9EQUFvRDtBQUNwRCxpREFBOEQ7QUFFOUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRW5ELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyRSxNQUFNLGtCQUFrQixHQUFHLElBQUksd0JBQWMsQ0FBQztJQUM1QyxVQUFVLEVBQUUsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDL0IsT0FBTyxFQUFFO2dCQUNQLCtCQUErQjtnQkFDL0IsK0JBQStCO2FBQ2hDO1lBQ0QsVUFBVSxFQUFFLENBQUMsSUFBSSw4QkFBb0IsRUFBRSxDQUFDO1lBQ3hDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNoQixVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFO29CQUNKLDBDQUEwQyxFQUFFLE1BQU07aUJBQ25EO2FBQ0Y7U0FDRixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLG9CQUFVLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNyRCxHQUFHO0lBQ0gsZ0JBQWdCLEVBQUUsa0JBQWtCO0NBQ3JDLENBQUMsQ0FBQztBQUNILFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLHlCQUFlLENBQUM7SUFDakQsT0FBTyxFQUFFO1FBQ1Asb0NBQW9DO0tBQ3JDO0lBQ0QsVUFBVSxFQUFFLENBQUMsSUFBSSw4QkFBb0IsRUFBRSxDQUFDO0lBQ3hDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNoQixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSiwwQ0FBMEMsRUFBRSxNQUFNO1NBQ25EO0tBQ0Y7Q0FDRixDQUFDLENBQUMsQ0FBQztBQUVKLE1BQU0sV0FBVyxHQUFHLElBQUkscUJBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO0lBQ3hELFVBQVU7Q0FDWCxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBRXRELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDL0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IEFjY291bnRSb290UHJpbmNpcGFsLCBQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQWNjZXNzUG9pbnQsIEZpbGVTeXN0ZW0gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWZzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0LWVmcy1pbnRlZycpO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAzLCBuYXRHYXRld2F5czogMSB9KTtcblxuY29uc3QgbXlGaWxlU3lzdGVtUG9saWN5ID0gbmV3IFBvbGljeURvY3VtZW50KHtcbiAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgIGFjdGlvbnM6IFtcbiAgICAgICdlbGFzdGljZmlsZXN5c3RlbTpDbGllbnRXcml0ZScsXG4gICAgICAnZWxhc3RpY2ZpbGVzeXN0ZW06Q2xpZW50TW91bnQnLFxuICAgIF0sXG4gICAgcHJpbmNpcGFsczogW25ldyBBY2NvdW50Um9vdFByaW5jaXBhbCgpXSxcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgIEJvb2w6IHtcbiAgICAgICAgJ2VsYXN0aWNmaWxlc3lzdGVtOkFjY2Vzc2VkVmlhTW91bnRUYXJnZXQnOiAndHJ1ZScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXSxcbn0pO1xuXG5jb25zdCBmaWxlU3lzdGVtID0gbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdGaWxlU3lzdGVtJywge1xuICB2cGMsXG4gIGZpbGVTeXN0ZW1Qb2xpY3k6IG15RmlsZVN5c3RlbVBvbGljeSxcbn0pO1xuZmlsZVN5c3RlbS5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICBhY3Rpb25zOiBbXG4gICAgJ2VsYXN0aWNmaWxlc3lzdGVtOkNsaWVudFJvb3RBY2Nlc3MnLFxuICBdLFxuICBwcmluY2lwYWxzOiBbbmV3IEFjY291bnRSb290UHJpbmNpcGFsKCldLFxuICByZXNvdXJjZXM6IFsnKiddLFxuICBjb25kaXRpb25zOiB7XG4gICAgQm9vbDoge1xuICAgICAgJ2VsYXN0aWNmaWxlc3lzdGVtOkFjY2Vzc2VkVmlhTW91bnRUYXJnZXQnOiAndHJ1ZScsXG4gICAgfSxcbiAgfSxcbn0pKTtcblxuY29uc3QgYWNjZXNzUG9pbnQgPSBuZXcgQWNjZXNzUG9pbnQoc3RhY2ssICdBY2Nlc3NQb2ludCcsIHtcbiAgZmlsZVN5c3RlbSxcbn0pO1xuY2RrLlRhZ3Mub2YoYWNjZXNzUG9pbnQpLmFkZCgnTmFtZScsICdNeUFjY2Vzc1BvaW50Jyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnRmlsZVN5c3RlbVBvbGljeVRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=