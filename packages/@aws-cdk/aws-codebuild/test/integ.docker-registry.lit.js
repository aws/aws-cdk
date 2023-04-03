"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
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
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'test-codebuild-docker-asset');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZG9ja2VyLXJlZ2lzdHJ5LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmRvY2tlci1yZWdpc3RyeS5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4REFBOEQ7QUFDOUQscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUMzRSwwQkFBMEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTywyQkFBMkIsQ0FBQyxDQUFDO1FBRXBGLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRTt3QkFDTCxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUM7cUJBQ2pCO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLDJCQUEyQixFQUFFLEtBQUs7WUFDbEMsU0FBUztZQUNULFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsRUFBRTtvQkFDOUUseUJBQXlCLEVBQUUsT0FBTztpQkFDbkMsQ0FBQzthQUNIO1NBRUYsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRWxELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgc2VjcmV0cyA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0Q29tcGxldGVBcm4odGhpcywgJ015U2VjcmV0cycsXG4gICAgICBgYXJuOmF3czpzZWNyZXRzbWFuYWdlcjoke3RoaXMucmVnaW9ufToke3RoaXMuYWNjb3VudH06c2VjcmV0Om15LXNlY3JldHMtMTIzNDU2YCk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgJ015UHJvamVjdCcsIHtcbiAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgIHBoYXNlczoge1xuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBjb21tYW5kczogWydscyddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9uczogZmFsc2UsXG4gICAgICAvLy8gIXNob3dcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuZnJvbURvY2tlclJlZ2lzdHJ5KCdteS1yZWdpc3RyeS9teS1yZXBvJywge1xuICAgICAgICAgIHNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHM6IHNlY3JldHMsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICAgIC8vLyAhaGlkZVxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBUZXN0U3RhY2soYXBwLCAndGVzdC1jb2RlYnVpbGQtZG9ja2VyLWFzc2V0Jyk7XG5cbmFwcC5zeW50aCgpO1xuIl19