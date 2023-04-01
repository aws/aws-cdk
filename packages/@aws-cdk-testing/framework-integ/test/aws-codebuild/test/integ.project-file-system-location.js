"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-file-system-locations');
const vpc = new ec2.Vpc(stack, 'MyVPC', {
    maxAzs: 1,
    natGateways: 1,
});
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
    allowAllOutbound: true,
    description: 'Example',
    securityGroupName: 'Jane',
    vpc,
});
new codebuild.Project(stack, 'MyProject', {
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
    }),
    environment: {
        privileged: true,
    },
    vpc,
    securityGroups: [securityGroup],
    fileSystemLocations: [codebuild.FileSystemLocation.efs({
            identifier: 'myidentifier',
            location: `fs-c8d04839.efs.${cdk.Aws.REGION}.amazonaws.com:/mnt`,
            mountOptions: 'nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2',
            mountPoint: '/media',
        })],
    grantReportGroupPermissions: false,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1maWxlLXN5c3RlbS1sb2NhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnByb2plY3QtZmlsZS1zeXN0ZW0tbG9jYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLHVEQUF1RDtBQUV2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7QUFDNUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDdEMsTUFBTSxFQUFFLENBQUM7SUFDVCxXQUFXLEVBQUUsQ0FBQztDQUNmLENBQUMsQ0FBQztBQUNILE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDbkUsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixXQUFXLEVBQUUsU0FBUztJQUN0QixpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLEdBQUc7Q0FDSixDQUFDLENBQUM7QUFFSCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUN4QyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7S0FDZixDQUFDO0lBQ0YsV0FBVyxFQUFFO1FBQ1gsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFDRCxHQUFHO0lBQ0gsY0FBYyxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQy9CLG1CQUFtQixFQUFFLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQztZQUNyRCxVQUFVLEVBQUUsY0FBYztZQUMxQixRQUFRLEVBQUUsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxxQkFBcUI7WUFDaEUsWUFBWSxFQUFFLGtFQUFrRTtZQUNoRixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7SUFDSCwyQkFBMkIsRUFBRSxLQUFLO0NBQ25DLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVidWlsZC1maWxlLXN5c3RlbS1sb2NhdGlvbnMnKTtcbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWUEMnLCB7XG4gIG1heEF6czogMSxcbiAgbmF0R2F0ZXdheXM6IDEsXG59KTtcbmNvbnN0IHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMScsIHtcbiAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgc2VjdXJpdHlHcm91cE5hbWU6ICdKYW5lJyxcbiAgdnBjLFxufSk7XG5cbm5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgIHZlcnNpb246ICcwLjInLFxuICB9KSxcbiAgZW52aXJvbm1lbnQ6IHtcbiAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICB9LFxuICB2cGMsXG4gIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gIGZpbGVTeXN0ZW1Mb2NhdGlvbnM6IFtjb2RlYnVpbGQuRmlsZVN5c3RlbUxvY2F0aW9uLmVmcyh7XG4gICAgaWRlbnRpZmllcjogJ215aWRlbnRpZmllcicsXG4gICAgbG9jYXRpb246IGBmcy1jOGQwNDgzOS5lZnMuJHtjZGsuQXdzLlJFR0lPTn0uYW1hem9uYXdzLmNvbTovbW50YCxcbiAgICBtb3VudE9wdGlvbnM6ICduZnN2ZXJzPTQuMSxyc2l6ZT0xMDQ4NTc2LHdzaXplPTEwNDg1NzYsaGFyZCx0aW1lbz02MDAscmV0cmFucz0yJyxcbiAgICBtb3VudFBvaW50OiAnL21lZGlhJyxcbiAgfSldLFxuICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19