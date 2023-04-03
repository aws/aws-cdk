"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-ecs-integ-multi-nlb-healthchecks');
const vpc = new aws_ec2_1.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
// Two load balancers with two listeners and two target groups.
const networkMultipleTargetGroupsFargateService = new aws_ecs_patterns_1.NetworkMultipleTargetGroupsFargateService(stack, 'myService', {
    cluster,
    memoryLimitMiB: 512,
    taskImageOptions: {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    loadBalancers: [
        {
            name: 'lb1',
            listeners: [
                {
                    name: 'listener1',
                },
            ],
        },
        {
            name: 'lb2',
            listeners: [
                {
                    name: 'listener2',
                },
            ],
        },
    ],
    targetGroups: [
        {
            containerPort: 80,
            listener: 'listener1',
        },
        {
            containerPort: 90,
            listener: 'listener2',
        },
    ],
});
networkMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({});
networkMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({});
new integ_tests_alpha_1.IntegTest(app, 'Integ', { testCases: [stack] });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaGVhbHRoY2hlY2tzLW11bHRpcGxlLW5ldHdvcmstbG9hZC1iYWxhbmNlZC1mYXJnYXRlLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5oZWFsdGhjaGVja3MtbXVsdGlwbGUtbmV0d29yay1sb2FkLWJhbGFuY2VkLWZhcmdhdGUtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUEwQztBQUMxQyxpREFBOEQ7QUFDOUQsNkNBQXlDO0FBQ3pDLGtFQUF1RDtBQUN2RCxtRUFBeUY7QUFFekYsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFFdkQsK0RBQStEO0FBQy9ELE1BQU0seUNBQXlDLEdBQUcsSUFBSSw0REFBeUMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ2xILE9BQU87SUFDUCxjQUFjLEVBQUUsR0FBRztJQUNuQixnQkFBZ0IsRUFBRTtRQUNoQixLQUFLLEVBQUUsd0JBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7S0FDL0Q7SUFDRCxhQUFhLEVBQUU7UUFDYjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0Y7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0Y7S0FDRjtJQUNELFlBQVksRUFBRTtRQUNaO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLFdBQVc7U0FDdEI7UUFDRDtZQUNFLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLFFBQVEsRUFBRSxXQUFXO1NBQ3RCO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCx5Q0FBeUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFbkYseUNBQXlDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBR25GLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRXBELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZwYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQ2x1c3RlciwgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtZWNzLWludGVnLW11bHRpLW5sYi1oZWFsdGhjaGVja3MnKTtcbmNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMiB9KTtcbmNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuLy8gVHdvIGxvYWQgYmFsYW5jZXJzIHdpdGggdHdvIGxpc3RlbmVycyBhbmQgdHdvIHRhcmdldCBncm91cHMuXG5jb25zdCBuZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZSA9IG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZShzdGFjaywgJ215U2VydmljZScsIHtcbiAgY2x1c3RlcixcbiAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICB9LFxuICBsb2FkQmFsYW5jZXJzOiBbXG4gICAge1xuICAgICAgbmFtZTogJ2xiMScsXG4gICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdsYjInLFxuICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgdGFyZ2V0R3JvdXBzOiBbXG4gICAge1xuICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMScsXG4gICAgfSxcbiAgICB7XG4gICAgICBjb250YWluZXJQb3J0OiA5MCxcbiAgICAgIGxpc3RlbmVyOiAnbGlzdGVuZXIyJyxcbiAgICB9LFxuICBdLFxufSk7XG5cbm5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlLnRhcmdldEdyb3Vwc1swXS5jb25maWd1cmVIZWFsdGhDaGVjayh7fSk7XG5cbm5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlLnRhcmdldEdyb3Vwc1sxXS5jb25maWd1cmVIZWFsdGhDaGVjayh7fSk7XG5cblxubmV3IEludGVnVGVzdChhcHAsICdJbnRlZycsIHsgdGVzdENhc2VzOiBbc3RhY2tdIH0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==