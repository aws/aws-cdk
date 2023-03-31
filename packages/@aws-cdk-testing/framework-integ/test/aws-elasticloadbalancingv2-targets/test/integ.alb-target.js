"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const patterns = require("aws-cdk-lib/aws-ecs-patterns");
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const targets = require("aws-cdk-lib/aws-elasticloadbalancingv2-targets");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });
        const task = new ecs.FargateTaskDefinition(this, 'Task', { cpu: 256, memoryLimitMiB: 512 });
        task.addContainer('nginx', {
            image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest'),
            portMappings: [{ containerPort: 80 }],
        });
        const svc = new patterns.ApplicationLoadBalancedFargateService(this, 'Service', {
            vpc,
            taskDefinition: task,
            publicLoadBalancer: false,
        });
        const nlb = new elbv2.NetworkLoadBalancer(this, 'Nlb', {
            vpc,
            crossZoneEnabled: true,
            internetFacing: true,
        });
        const listener = nlb.addListener('listener', {
            port: 80,
        });
        const target = listener.addTargets('Targets', {
            targets: [new targets.AlbTarget(svc.loadBalancer, 80)],
            port: 80,
            healthCheck: {
                protocol: elbv2.Protocol.HTTP,
            },
        });
        target.node.addDependency(svc.listener);
        new aws_cdk_lib_1.CfnOutput(this, 'NlbEndpoint', { value: `http://${nlb.loadBalancerDnsName}` });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'TestStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYWxiLXRhcmdldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFsYi10YXJnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLHlEQUF5RDtBQUN6RCxnRUFBZ0U7QUFDaEUsNkNBQWdFO0FBRWhFLDBFQUEwRTtBQUUxRSxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVwRSxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUN6QixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsbUNBQW1DLENBQUM7WUFDM0UsWUFBWSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDdEMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMscUNBQXFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUM5RSxHQUFHO1lBQ0gsY0FBYyxFQUFFLElBQUk7WUFDcEIsa0JBQWtCLEVBQUUsS0FBSztTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3JELEdBQUc7WUFDSCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO1lBQzNDLElBQUksRUFBRSxFQUFFO1NBQ1QsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDNUMsT0FBTyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEQsSUFBSSxFQUFFLEVBQUU7WUFDUixXQUFXLEVBQUU7Z0JBQ1gsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSTthQUM5QjtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4QyxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNyRixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDaEMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgcGF0dGVybnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcy1wYXR0ZXJucyc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjItdGFyZ2V0cyc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywgeyBtYXhBenM6IDIsIG5hdEdhdGV3YXlzOiAxIH0pO1xuXG4gICAgY29uc3QgdGFzayA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHRoaXMsICdUYXNrJywgeyBjcHU6IDI1NiwgbWVtb3J5TGltaXRNaUI6IDUxMiB9KTtcbiAgICB0YXNrLmFkZENvbnRhaW5lcignbmdpbngnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgncHVibGljLmVjci5hd3Mvbmdpbngvbmdpbng6bGF0ZXN0JyksXG4gICAgICBwb3J0TWFwcGluZ3M6IFt7IGNvbnRhaW5lclBvcnQ6IDgwIH1dLFxuICAgIH0pO1xuICAgIGNvbnN0IHN2YyA9IG5ldyBwYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHRoaXMsICdTZXJ2aWNlJywge1xuICAgICAgdnBjLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2ssXG4gICAgICBwdWJsaWNMb2FkQmFsYW5jZXI6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbmxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIodGhpcywgJ05sYicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGNyb3NzWm9uZUVuYWJsZWQ6IHRydWUsXG4gICAgICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgICB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IG5sYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRhcmdldCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ1RhcmdldHMnLCB7XG4gICAgICB0YXJnZXRzOiBbbmV3IHRhcmdldHMuQWxiVGFyZ2V0KHN2Yy5sb2FkQmFsYW5jZXIsIDgwKV0sXG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICAgIHByb3RvY29sOiBlbGJ2Mi5Qcm90b2NvbC5IVFRQLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICB0YXJnZXQubm9kZS5hZGREZXBlbmRlbmN5KHN2Yy5saXN0ZW5lcik7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdObGJFbmRwb2ludCcsIHsgdmFsdWU6IGBodHRwOi8vJHtubGIubG9hZEJhbGFuY2VyRG5zTmFtZX1gIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBUZXN0U3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==