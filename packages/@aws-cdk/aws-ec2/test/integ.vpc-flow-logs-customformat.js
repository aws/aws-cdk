"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_s3_1 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new core_1.App();
class TestStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new lib_1.Vpc(this, 'VPC');
        new lib_1.FlowLog(this, 'FlowLogsCW', {
            resourceType: lib_1.FlowLogResourceType.fromVpc(vpc),
            logFormat: [
                lib_1.LogFormat.SRC_PORT,
            ],
        });
        const bucket = new aws_s3_1.Bucket(this, 'Bucket', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        vpc.addFlowLog('FlowLogsS3', {
            destination: lib_1.FlowLogDestination.toS3(bucket, 'prefix/'),
            logFormat: [
                lib_1.LogFormat.DST_PORT,
                lib_1.LogFormat.SRC_PORT,
            ],
        });
    }
}
new integ_tests_1.IntegTest(app, 'FlowLogs', {
    testCases: [
        new TestStack(app, 'FlowLogsTestStack'),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWZsb3ctbG9ncy1jdXN0b21mb3JtYXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy52cGMtZmxvdy1sb2dzLWN1c3RvbWZvcm1hdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUF5QztBQUN6Qyx3Q0FBc0U7QUFDdEUsc0RBQWlEO0FBQ2pELGdDQUEwRjtBQUUxRixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBR3RCLE1BQU0sU0FBVSxTQUFRLFlBQUs7SUFDM0IsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVqQyxJQUFJLGFBQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzlCLFlBQVksRUFBRSx5QkFBbUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQzlDLFNBQVMsRUFBRTtnQkFDVCxlQUFTLENBQUMsUUFBUTthQUNuQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDeEMsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFO1lBQzNCLFdBQVcsRUFBRSx3QkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztZQUN2RCxTQUFTLEVBQUU7Z0JBQ1QsZUFBUyxDQUFDLFFBQVE7Z0JBQ2xCLGVBQVMsQ0FBQyxRQUFRO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO0tBRUo7Q0FDRjtBQUdELElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFO0lBQzdCLFNBQVMsRUFBRTtRQUNULElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQztLQUN4QztDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBGbG93TG9nLCBGbG93TG9nRGVzdGluYXRpb24sIEZsb3dMb2dSZXNvdXJjZVR5cGUsIFZwYywgTG9nRm9ybWF0IH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsICdWUEMnKTtcblxuICAgIG5ldyBGbG93TG9nKHRoaXMsICdGbG93TG9nc0NXJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21WcGModnBjKSxcbiAgICAgIGxvZ0Zvcm1hdDogW1xuICAgICAgICBMb2dGb3JtYXQuU1JDX1BPUlQsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldCh0aGlzLCAnQnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG4gICAgdnBjLmFkZEZsb3dMb2coJ0Zsb3dMb2dzUzMnLCB7XG4gICAgICBkZXN0aW5hdGlvbjogRmxvd0xvZ0Rlc3RpbmF0aW9uLnRvUzMoYnVja2V0LCAncHJlZml4LycpLFxuICAgICAgbG9nRm9ybWF0OiBbXG4gICAgICAgIExvZ0Zvcm1hdC5EU1RfUE9SVCxcbiAgICAgICAgTG9nRm9ybWF0LlNSQ19QT1JULFxuICAgICAgXSxcbiAgICB9KTtcblxuICB9XG59XG5cblxubmV3IEludGVnVGVzdChhcHAsICdGbG93TG9ncycsIHtcbiAgdGVzdENhc2VzOiBbXG4gICAgbmV3IFRlc3RTdGFjayhhcHAsICdGbG93TG9nc1Rlc3RTdGFjaycpLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19