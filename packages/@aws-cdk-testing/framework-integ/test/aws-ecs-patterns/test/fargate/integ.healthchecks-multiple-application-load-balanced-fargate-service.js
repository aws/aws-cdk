"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-ecs-integ-fargate-multi-alb-health');
const vpc = new aws_ec2_1.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
// Two load balancers with two listeners and two target groups.
const applicationMultipleTargetGroupsFargateService = new aws_ecs_patterns_1.ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
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
applicationMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({
    protocol: aws_elasticloadbalancingv2_1.Protocol.HTTP,
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 2,
    timeout: aws_cdk_lib_1.Duration.seconds(10),
    interval: aws_cdk_lib_1.Duration.seconds(30),
    healthyHttpCodes: '200',
});
applicationMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({
    protocol: aws_elasticloadbalancingv2_1.Protocol.HTTP,
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 2,
    timeout: aws_cdk_lib_1.Duration.seconds(10),
    interval: aws_cdk_lib_1.Duration.seconds(30),
    healthyHttpCodes: '200',
});
new integ_tests_alpha_1.IntegTest(app, 'Integ', { testCases: [stack] });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaGVhbHRoY2hlY2tzLW11bHRpcGxlLWFwcGxpY2F0aW9uLWxvYWQtYmFsYW5jZWQtZmFyZ2F0ZS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuaGVhbHRoY2hlY2tzLW11bHRpcGxlLWFwcGxpY2F0aW9uLWxvYWQtYmFsYW5jZWQtZmFyZ2F0ZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQTBDO0FBQzFDLGlEQUE4RDtBQUM5RCx1RkFBa0U7QUFDbEUsNkNBQW1EO0FBQ25ELGtFQUF1RDtBQUV2RCxtRUFBNkY7QUFFN0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO0FBQ3ZFLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFFdkQsK0RBQStEO0FBQy9ELE1BQU0sNkNBQTZDLEdBQUcsSUFBSSxnRUFBNkMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQzFILE9BQU87SUFDUCxjQUFjLEVBQUUsR0FBRztJQUNuQixnQkFBZ0IsRUFBRTtRQUNoQixLQUFLLEVBQUUsd0JBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7S0FDL0Q7SUFDRCxhQUFhLEVBQUU7UUFDYjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0Y7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0Y7S0FDRjtJQUNELFlBQVksRUFBRTtRQUNaO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLFdBQVc7U0FDdEI7UUFDRDtZQUNFLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLFFBQVEsRUFBRSxXQUFXO1NBQ3RCO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCw2Q0FBNkMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUM7SUFDakYsUUFBUSxFQUFFLHFDQUFRLENBQUMsSUFBSTtJQUN2QixxQkFBcUIsRUFBRSxDQUFDO0lBQ3hCLHVCQUF1QixFQUFFLENBQUM7SUFDMUIsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM3QixRQUFRLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzlCLGdCQUFnQixFQUFFLEtBQUs7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsNkNBQTZDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO0lBQ2pGLFFBQVEsRUFBRSxxQ0FBUSxDQUFDLElBQUk7SUFDdkIscUJBQXFCLEVBQUUsQ0FBQztJQUN4Qix1QkFBdUIsRUFBRSxDQUFDO0lBQzFCLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDN0IsUUFBUSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM5QixnQkFBZ0IsRUFBRSxLQUFLO0NBQ3hCLENBQUMsQ0FBQztBQUVILElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRXBELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZwYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQ2x1c3RlciwgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IFByb3RvY29sIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0IHsgQXBwLCBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5cbmltcG9ydCB7IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtZWNzLWludGVnLWZhcmdhdGUtbXVsdGktYWxiLWhlYWx0aCcpO1xuY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4vLyBUd28gbG9hZCBiYWxhbmNlcnMgd2l0aCB0d28gbGlzdGVuZXJzIGFuZCB0d28gdGFyZ2V0IGdyb3Vwcy5cbmNvbnN0IGFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZSA9IG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdteVNlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgfSxcbiAgbG9hZEJhbGFuY2VyczogW1xuICAgIHtcbiAgICAgIG5hbWU6ICdsYjEnLFxuICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIxJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbGIyJyxcbiAgICAgIGxpc3RlbmVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2xpc3RlbmVyMicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIHRhcmdldEdyb3VwczogW1xuICAgIHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgbGlzdGVuZXI6ICdsaXN0ZW5lcjEnLFxuICAgIH0sXG4gICAge1xuICAgICAgY29udGFpbmVyUG9ydDogOTAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMicsXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5hcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2UudGFyZ2V0R3JvdXBzWzBdLmNvbmZpZ3VyZUhlYWx0aENoZWNrKHtcbiAgcHJvdG9jb2w6IFByb3RvY29sLkhUVFAsXG4gIGhlYWx0aHlUaHJlc2hvbGRDb3VudDogMixcbiAgdW5oZWFsdGh5VGhyZXNob2xkQ291bnQ6IDIsXG4gIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICBpbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gIGhlYWx0aHlIdHRwQ29kZXM6ICcyMDAnLFxufSk7XG5cbmFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZS50YXJnZXRHcm91cHNbMV0uY29uZmlndXJlSGVhbHRoQ2hlY2soe1xuICBwcm90b2NvbDogUHJvdG9jb2wuSFRUUCxcbiAgaGVhbHRoeVRocmVzaG9sZENvdW50OiAyLFxuICB1bmhlYWx0aHlUaHJlc2hvbGRDb3VudDogMixcbiAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygxMCksXG4gIGludGVydmFsOiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgaGVhbHRoeUh0dHBDb2RlczogJzIwMCcsXG59KTtcblxubmV3IEludGVnVGVzdChhcHAsICdJbnRlZycsIHsgdGVzdENhc2VzOiBbc3RhY2tdIH0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==