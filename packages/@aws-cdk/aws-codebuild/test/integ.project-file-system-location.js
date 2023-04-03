"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1maWxlLXN5c3RlbS1sb2NhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnByb2plY3QtZmlsZS1zeXN0ZW0tbG9jYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7QUFDNUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDdEMsTUFBTSxFQUFFLENBQUM7SUFDVCxXQUFXLEVBQUUsQ0FBQztDQUNmLENBQUMsQ0FBQztBQUNILE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDbkUsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixXQUFXLEVBQUUsU0FBUztJQUN0QixpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLEdBQUc7Q0FDSixDQUFDLENBQUM7QUFFSCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUN4QyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7S0FDZixDQUFDO0lBQ0YsV0FBVyxFQUFFO1FBQ1gsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFDRCxHQUFHO0lBQ0gsY0FBYyxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQy9CLG1CQUFtQixFQUFFLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQztZQUNyRCxVQUFVLEVBQUUsY0FBYztZQUMxQixRQUFRLEVBQUUsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxxQkFBcUI7WUFDaEUsWUFBWSxFQUFFLGtFQUFrRTtZQUNoRixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7SUFDSCwyQkFBMkIsRUFBRSxLQUFLO0NBQ25DLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlYnVpbGQtZmlsZS1zeXN0ZW0tbG9jYXRpb25zJyk7XG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VlBDJywge1xuICBtYXhBenM6IDEsXG4gIG5hdEdhdGV3YXlzOiAxLFxufSk7XG5jb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU2VjdXJpdHlHcm91cDEnLCB7XG4gIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gIGRlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gIHNlY3VyaXR5R3JvdXBOYW1lOiAnSmFuZScsXG4gIHZwYyxcbn0pO1xuXG5uZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgfSksXG4gIGVudmlyb25tZW50OiB7XG4gICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgfSxcbiAgdnBjLFxuICBzZWN1cml0eUdyb3VwczogW3NlY3VyaXR5R3JvdXBdLFxuICBmaWxlU3lzdGVtTG9jYXRpb25zOiBbY29kZWJ1aWxkLkZpbGVTeXN0ZW1Mb2NhdGlvbi5lZnMoe1xuICAgIGlkZW50aWZpZXI6ICdteWlkZW50aWZpZXInLFxuICAgIGxvY2F0aW9uOiBgZnMtYzhkMDQ4MzkuZWZzLiR7Y2RrLkF3cy5SRUdJT059LmFtYXpvbmF3cy5jb206L21udGAsXG4gICAgbW91bnRPcHRpb25zOiAnbmZzdmVycz00LjEscnNpemU9MTA0ODU3Nix3c2l6ZT0xMDQ4NTc2LGhhcmQsdGltZW89NjAwLHJldHJhbnM9MicsXG4gICAgbW91bnRQb2ludDogJy9tZWRpYScsXG4gIH0pXSxcbiAgZ3JhbnRSZXBvcnRHcm91cFBlcm1pc3Npb25zOiBmYWxzZSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==