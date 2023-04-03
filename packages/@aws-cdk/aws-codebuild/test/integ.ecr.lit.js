"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ecr = require("@aws-cdk/aws-ecr");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const ecrRepository = new ecr.Repository(this, 'MyRepo');
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
                buildImage: codebuild.LinuxBuildImage.fromEcrRepository(ecrRepository, 'v1.0'),
            },
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'test-codebuild-docker-asset');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWNyLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVjci5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV6RCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN2QyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUU7d0JBQ0wsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDO3FCQUNqQjtpQkFDRjthQUNGLENBQUM7WUFDRiwyQkFBMkIsRUFBRSxLQUFLO1lBQ2xDLFNBQVM7WUFDVCxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQzthQUMvRTtTQUVGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUVsRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZWNyUmVwb3NpdG9yeSA9IG5ldyBlY3IuUmVwb3NpdG9yeSh0aGlzLCAnTXlSZXBvJyk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgJ015UHJvamVjdCcsIHtcbiAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgIHBoYXNlczoge1xuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBjb21tYW5kczogWydscyddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9uczogZmFsc2UsXG4gICAgICAvLy8gIXNob3dcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkoZWNyUmVwb3NpdG9yeSwgJ3YxLjAnKSxcbiAgICAgIH0sXG4gICAgICAvLy8gIWhpZGVcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ3Rlc3QtY29kZWJ1aWxkLWRvY2tlci1hc3NldCcpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==