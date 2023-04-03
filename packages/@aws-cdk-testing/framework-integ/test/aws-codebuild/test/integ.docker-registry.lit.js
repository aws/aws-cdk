"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const secrets = secretsmanager.Secret.fromSecretCompleteArn(this, 'MySecrets', `arn:aws:secretsmanager:${this.region}:${this.account}:secret:my-secrets-123456`);
        new codebuild.Project(this, 'MyProject', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: ['ls'],
                    },
                },
            }),
            grantReportGroupPermissions: false,
            /// !show
            environment: {
                buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('my-registry/my-repo', {
                    secretsManagerCredentials: secrets,
                }),
            },
            /// !hide
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'test-codebuild-docker-asset');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZG9ja2VyLXJlZ2lzdHJ5LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmRvY2tlci1yZWdpc3RyeS5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpRUFBaUU7QUFDakUsbUNBQW1DO0FBQ25DLHVEQUF1RDtBQUV2RCxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUMzRSwwQkFBMEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTywyQkFBMkIsQ0FBQyxDQUFDO1FBRXBGLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRTt3QkFDTCxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUM7cUJBQ2pCO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLDJCQUEyQixFQUFFLEtBQUs7WUFDbEMsU0FBUztZQUNULFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsRUFBRTtvQkFDOUUseUJBQXlCLEVBQUUsT0FBTztpQkFDbkMsQ0FBQzthQUNIO1lBQ0QsU0FBUztTQUNWLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRWxELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzZWNyZXRzID0gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRDb21wbGV0ZUFybih0aGlzLCAnTXlTZWNyZXRzJyxcbiAgICAgIGBhcm46YXdzOnNlY3JldHNtYW5hZ2VyOiR7dGhpcy5yZWdpb259OiR7dGhpcy5hY2NvdW50fTpzZWNyZXQ6bXktc2VjcmV0cy0xMjM0NTZgKTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCAnTXlQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbJ2xzJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgZ3JhbnRSZXBvcnRHcm91cFBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIC8vLyAhc2hvd1xuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5mcm9tRG9ja2VyUmVnaXN0cnkoJ215LXJlZ2lzdHJ5L215LXJlcG8nLCB7XG4gICAgICAgICAgc2VjcmV0c01hbmFnZXJDcmVkZW50aWFsczogc2VjcmV0cyxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAgLy8vICFoaWRlXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFRlc3RTdGFjayhhcHAsICd0ZXN0LWNvZGVidWlsZC1kb2NrZXItYXNzZXQnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=