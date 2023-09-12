"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const batch = require("../lib");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'stack');
new batch.MultiNodeJobDefinition(stack, 'SingleContainerMultiNodeJob', {
    instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.R4, aws_ec2_1.InstanceSize.LARGE),
    containers: [{
            startNode: 0,
            endNode: 10,
            container: new batch.EcsEc2ContainerDefinition(stack, 'myContainer', {
                image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                cpu: 256,
                memory: aws_cdk_lib_1.Size.mebibytes(2048),
            }),
        }],
    propagateTags: true,
});
const multinodeJob = new batch.MultiNodeJobDefinition(stack, 'MultiContainerMultiNodeJob', {
    instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.R4, aws_ec2_1.InstanceSize.LARGE),
    containers: [{
            startNode: 0,
            endNode: 10,
            container: new batch.EcsEc2ContainerDefinition(stack, 'multinodecontainer', {
                image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                cpu: 256,
                memory: aws_cdk_lib_1.Size.mebibytes(2048),
            }),
        }],
});
multinodeJob.addContainer({
    startNode: 11,
    endNode: 20,
    container: new batch.EcsEc2ContainerDefinition(stack, 'multiContainer', {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        cpu: 256,
        memory: aws_cdk_lib_1.Size.mebibytes(2048),
    }),
});
new integ.IntegTest(app, 'BatchMultiNodeJobDefinitionTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubXVsdGlub2RlLWpvYi1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubXVsdGlub2RlLWpvYi1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWdGO0FBQ2hGLGlEQUFxRDtBQUNyRCw2Q0FBK0M7QUFDL0Msb0RBQW9EO0FBQ3BELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRXRDLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSw2QkFBNkIsRUFBRTtJQUNyRSxZQUFZLEVBQUUsc0JBQVksQ0FBQyxFQUFFLENBQUMsdUJBQWEsQ0FBQyxFQUFFLEVBQUUsc0JBQVksQ0FBQyxLQUFLLENBQUM7SUFDbkUsVUFBVSxFQUFFLENBQUM7WUFDWCxTQUFTLEVBQUUsQ0FBQztZQUNaLE9BQU8sRUFBRSxFQUFFO1lBQ1gsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ25FLEtBQUssRUFBRSx3QkFBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztnQkFDOUQsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUM3QixDQUFDO1NBQ0gsQ0FBQztJQUNGLGFBQWEsRUFBRSxJQUFJO0NBQ3BCLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSw0QkFBNEIsRUFBRTtJQUN6RixZQUFZLEVBQUUsc0JBQVksQ0FBQyxFQUFFLENBQUMsdUJBQWEsQ0FBQyxFQUFFLEVBQUUsc0JBQVksQ0FBQyxLQUFLLENBQUM7SUFDbkUsVUFBVSxFQUFFLENBQUM7WUFDWCxTQUFTLEVBQUUsQ0FBQztZQUNaLE9BQU8sRUFBRSxFQUFFO1lBQ1gsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtnQkFDMUUsS0FBSyxFQUFFLHdCQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO2dCQUM5RCxHQUFHLEVBQUUsR0FBRztnQkFDUixNQUFNLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2FBQzdCLENBQUM7U0FDSCxDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBRUgsWUFBWSxDQUFDLFlBQVksQ0FBQztJQUN4QixTQUFTLEVBQUUsRUFBRTtJQUNiLE9BQU8sRUFBRSxFQUFFO0lBQ1gsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtRQUN0RSxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7UUFDOUQsR0FBRyxFQUFFLEdBQUc7UUFDUixNQUFNLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0tBQzdCLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxFQUFFO0lBQzFELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnN0YW5jZUNsYXNzLCBJbnN0YW5jZVNpemUsIEluc3RhbmNlVHlwZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IEFwcCwgU2l6ZSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBiYXRjaCBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuXG5uZXcgYmF0Y2guTXVsdGlOb2RlSm9iRGVmaW5pdGlvbihzdGFjaywgJ1NpbmdsZUNvbnRhaW5lck11bHRpTm9kZUpvYicsIHtcbiAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5SNCwgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgY29udGFpbmVyczogW3tcbiAgICBzdGFydE5vZGU6IDAsXG4gICAgZW5kTm9kZTogMTAsXG4gICAgY29udGFpbmVyOiBuZXcgYmF0Y2guRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ215Q29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICBjcHU6IDI1NixcbiAgICAgIG1lbW9yeTogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgfSksXG4gIH1dLFxuICBwcm9wYWdhdGVUYWdzOiB0cnVlLFxufSk7XG5cbmNvbnN0IG11bHRpbm9kZUpvYiA9IG5ldyBiYXRjaC5NdWx0aU5vZGVKb2JEZWZpbml0aW9uKHN0YWNrLCAnTXVsdGlDb250YWluZXJNdWx0aU5vZGVKb2InLCB7XG4gIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuUjQsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gIGNvbnRhaW5lcnM6IFt7XG4gICAgc3RhcnROb2RlOiAwLFxuICAgIGVuZE5vZGU6IDEwLFxuICAgIGNvbnRhaW5lcjogbmV3IGJhdGNoLkVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdtdWx0aW5vZGVjb250YWluZXInLCB7XG4gICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIGNwdTogMjU2LFxuICAgICAgbWVtb3J5OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICB9KSxcbiAgfV0sXG59KTtcblxubXVsdGlub2RlSm9iLmFkZENvbnRhaW5lcih7XG4gIHN0YXJ0Tm9kZTogMTEsXG4gIGVuZE5vZGU6IDIwLFxuICBjb250YWluZXI6IG5ldyBiYXRjaC5FY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnbXVsdGlDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgY3B1OiAyNTYsXG4gICAgbWVtb3J5OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgfSksXG59KTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdCYXRjaE11bHRpTm9kZUpvYkRlZmluaXRpb25UZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=