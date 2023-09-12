"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lib_1 = require("../lib");
test('MultiNodeJobDefinition respects mainNode', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.MultiNodeJobDefinition(stack, 'ECSJobDefn', {
        containers: [{
                container: new lib_1.EcsEc2ContainerDefinition(stack, 'MultinodeContainer', {
                    cpu: 256,
                    memory: aws_cdk_lib_1.Size.mebibytes(2048),
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                }),
                startNode: 0,
                endNode: 9,
            }],
        mainNode: 5,
        instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.R4, aws_ec2_1.InstanceSize.LARGE),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        NodeProperties: {
            MainNode: 5,
            NodeRangeProperties: [{
                    Container: {
                        InstanceType: 'r4.large',
                    },
                    TargetNodes: '0:9',
                }],
            NumNodes: 10,
        },
        PlatformCapabilities: [lib_1.Compatibility.EC2],
    });
});
test('EcsJobDefinition respects propagateTags', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.MultiNodeJobDefinition(stack, 'ECSJobDefn', {
        propagateTags: true,
        containers: [{
                container: new lib_1.EcsEc2ContainerDefinition(stack, 'MultinodeContainer', {
                    cpu: 256,
                    memory: aws_cdk_lib_1.Size.mebibytes(2048),
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                }),
                startNode: 0,
                endNode: 9,
            }],
        mainNode: 0,
        instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.R4, aws_ec2_1.InstanceSize.LARGE),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        PropagateTags: true,
    });
});
test('MultiNodeJobDefinition one container', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.MultiNodeJobDefinition(stack, 'ECSJobDefn', {
        containers: [{
                container: new lib_1.EcsEc2ContainerDefinition(stack, 'MultinodeContainer', {
                    cpu: 256,
                    memory: aws_cdk_lib_1.Size.mebibytes(2048),
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                }),
                startNode: 0,
                endNode: 9,
            }],
        mainNode: 0,
        instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.R4, aws_ec2_1.InstanceSize.LARGE),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        NodeProperties: {
            MainNode: 0,
            NodeRangeProperties: [{
                    Container: {
                        InstanceType: 'r4.large',
                    },
                    TargetNodes: '0:9',
                }],
            NumNodes: 10,
        },
        PlatformCapabilities: [lib_1.Compatibility.EC2],
    });
});
test('MultiNodeJobDefinition two containers', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.MultiNodeJobDefinition(stack, 'ECSJobDefn', {
        containers: [
            {
                container: new lib_1.EcsEc2ContainerDefinition(stack, 'MultinodeContainer1', {
                    cpu: 256,
                    memory: aws_cdk_lib_1.Size.mebibytes(2048),
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                }),
                startNode: 0,
                endNode: 9,
            },
            {
                container: new lib_1.EcsEc2ContainerDefinition(stack, 'MultinodeContainer2', {
                    cpu: 512,
                    memory: aws_cdk_lib_1.Size.mebibytes(4096),
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                }),
                startNode: 10,
                endNode: 14,
            },
        ],
        instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.R4, aws_ec2_1.InstanceSize.LARGE),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        NodeProperties: {
            MainNode: 0,
            NodeRangeProperties: [
                {
                    Container: {
                        InstanceType: 'r4.large',
                    },
                    TargetNodes: '0:9',
                },
                {
                    Container: {
                        InstanceType: 'r4.large',
                    },
                    TargetNodes: '10:14',
                },
            ],
            NumNodes: 15,
        },
        PlatformCapabilities: [lib_1.Compatibility.EC2],
    });
});
test('multinode job requires at least one container', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.MultiNodeJobDefinition(stack, 'ECSJobDefn', {
        instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.C4, aws_ec2_1.InstanceSize.LARGE),
    });
    // THEN
    expect(() => assertions_1.Template.fromStack(stack)).toThrow(/multinode job has no containers!/);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlub2RlLWpvYi1kZWZpbml0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtdWx0aW5vZGUtam9iLWRlZmluaXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCxpREFBZ0Y7QUFDaEYsMkNBQTJDO0FBQzNDLDZDQUEwQztBQUMxQyxnQ0FBMEY7QUFFMUYsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtJQUNwRCxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxFQUFFLENBQUM7SUFFMUIsT0FBTztJQUNQLElBQUksNEJBQXNCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtRQUM5QyxVQUFVLEVBQUUsQ0FBQztnQkFDWCxTQUFTLEVBQUUsSUFBSSwrQkFBeUIsQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLEVBQUU7b0JBQ3BFLEdBQUcsRUFBRSxHQUFHO29CQUNSLE1BQU0sRUFBRSxrQkFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztpQkFDbkUsQ0FBQztnQkFDRixTQUFTLEVBQUUsQ0FBQztnQkFDWixPQUFPLEVBQUUsQ0FBQzthQUNYLENBQUM7UUFDRixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxzQkFBWSxDQUFDLEVBQUUsQ0FBQyx1QkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBWSxDQUFDLEtBQUssQ0FBQztLQUNwRSxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7UUFDM0UsY0FBYyxFQUFFO1lBQ2QsUUFBUSxFQUFFLENBQUM7WUFDWCxtQkFBbUIsRUFBRSxDQUFDO29CQUNwQixTQUFTLEVBQUU7d0JBQ1QsWUFBWSxFQUFFLFVB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QUVGO1lBQ0QsUUFBUSxFQUFFLEVBQUU7U0FDYjtRQUNELG9CQUFvQixFQUFFLENBQUMsbUJBQWEsQ0FBQyxHQUFHLENBQUM7S0FDMUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO0lBQ3pELFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSw0QkFBc0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQzlDLFlBQVksRUFBRSxzQkFBWSxDQUFDLEVBQUUsQ0FBQyx1QkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBWSxDQUFDLEtBQUssQ0FBQztLQUNwRSxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFDdEYsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgSW5zdGFuY2VDbGFzcywgSW5zdGFuY2VTaXplLCBJbnN0YW5jZVR5cGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IFNpemUsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29tcGF0aWJpbGl0eSwgRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbiwgTXVsdGlOb2RlSm9iRGVmaW5pdGlvbiB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ011bHRpTm9kZUpvYkRlZmluaXRpb24gcmVzcGVjdHMgbWFpbk5vZGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgTXVsdGlOb2RlSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgY29udGFpbmVyczogW3tcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdNdWx0aW5vZGVDb250YWluZXInLCB7XG4gICAgICAgIGNwdTogMjU2LFxuICAgICAgICBtZW1vcnk6IFNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9KSxcbiAgICAgIHN0YXJ0Tm9kZTogMCxcbiAgICAgIGVuZE5vZGU6IDksXG4gICAgfV0sXG4gICAgbWFpbk5vZGU6IDUsXG4gICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5SNCwgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICBOb2RlUHJvcGVydGllczoge1xuICAgICAgTWFpbk5vZGU6IDUsXG4gICAgICBOb2RlUmFuZ2VQcm9wZXJ0aWVzOiBbe1xuICAgICAgICBDb250YWluZXI6IHtcbiAgICAgICAgICBJbnN0YW5jZVR5cGU6ICdyNC5sYXJnZScsXG4gICAgICAgIH0sXG4gICAgICAgIFRhcmdldE5vZGVzOiAnMDo5JyxcbiAgICAgIH1dLFxuICAgICAgTnVtTm9kZXM6IDEwLFxuICAgIH0sXG4gICAgUGxhdGZvcm1DYXBhYmlsaXRpZXM6IFtDb21wYXRpYmlsaXR5LkVDMl0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ0Vjc0pvYkRlZmluaXRpb24gcmVzcGVjdHMgcHJvcGFnYXRlVGFncycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBNdWx0aU5vZGVKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICBwcm9wYWdhdGVUYWdzOiB0cnVlLFxuICAgIGNvbnRhaW5lcnM6IFt7XG4gICAgICBjb250YWluZXI6IG5ldyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnTXVsdGlub2RlQ29udGFpbmVyJywge1xuICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgbWVtb3J5OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgfSksXG4gICAgICBzdGFydE5vZGU6IDAsXG4gICAgICBlbmROb2RlOiA5LFxuICAgIH1dLFxuICAgIG1haW5Ob2RlOiAwLFxuICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuUjQsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgUHJvcGFnYXRlVGFnczogdHJ1ZSxcbiAgfSk7XG59KTtcblxudGVzdCgnTXVsdGlOb2RlSm9iRGVmaW5pdGlvbiBvbmUgY29udGFpbmVyJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IE11bHRpTm9kZUpvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgIGNvbnRhaW5lcnM6IFt7XG4gICAgICBjb250YWluZXI6IG5ldyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnTXVsdGlub2RlQ29udGFpbmVyJywge1xuICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgbWVtb3J5OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgfSksXG4gICAgICBzdGFydE5vZGU6IDAsXG4gICAgICBlbmROb2RlOiA5LFxuICAgIH1dLFxuICAgIG1haW5Ob2RlOiAwLFxuICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuUjQsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgTm9kZVByb3BlcnRpZXM6IHtcbiAgICAgIE1haW5Ob2RlOiAwLFxuICAgICAgTm9kZVJhbmdlUHJvcGVydGllczogW3tcbiAgICAgICAgQ29udGFpbmVyOiB7XG4gICAgICAgICAgSW5zdGFuY2VUeXBlOiAncjQubGFyZ2UnLFxuICAgICAgICB9LFxuICAgICAgICBUYXJnZXROb2RlczogJzA6OScsXG4gICAgICB9XSxcbiAgICAgIE51bU5vZGVzOiAxMCxcbiAgICB9LFxuICAgIFBsYXRmb3JtQ2FwYWJpbGl0aWVzOiBbQ29tcGF0aWJpbGl0eS5FQzJdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdNdWx0aU5vZGVKb2JEZWZpbml0aW9uIHR3byBjb250YWluZXJzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IE11bHRpTm9kZUpvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgIGNvbnRhaW5lcnM6IFtcbiAgICAgIHtcbiAgICAgICAgY29udGFpbmVyOiBuZXcgRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ011bHRpbm9kZUNvbnRhaW5lcjEnLCB7XG4gICAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgICAgbWVtb3J5OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIH0pLFxuICAgICAgICBzdGFydE5vZGU6IDAsXG4gICAgICAgIGVuZE5vZGU6IDksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb250YWluZXI6IG5ldyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnTXVsdGlub2RlQ29udGFpbmVyMicsIHtcbiAgICAgICAgICBjcHU6IDUxMixcbiAgICAgICAgICBtZW1vcnk6IFNpemUubWViaWJ5dGVzKDQwOTYpLFxuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0YXJ0Tm9kZTogMTAsXG4gICAgICAgIGVuZE5vZGU6IDE0LFxuICAgICAgfSxcbiAgICBdLFxuICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuUjQsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgTm9kZVByb3BlcnRpZXM6IHtcbiAgICAgIE1haW5Ob2RlOiAwLFxuICAgICAgTm9kZVJhbmdlUHJvcGVydGllczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ29udGFpbmVyOiB7XG4gICAgICAgICAgICBJbnN0YW5jZVR5cGU6ICdyNC5sYXJnZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUYXJnZXROb2RlczogJzA6OScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBDb250YWluZXI6IHtcbiAgICAgICAgICAgIEluc3RhbmNlVHlwZTogJ3I0LmxhcmdlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFRhcmdldE5vZGVzOiAnMTA6MTQnLFxuICAgICAgICB9LFxuXG4gICAgICBdLFxuICAgICAgTnVtTm9kZXM6IDE1LFxuICAgIH0sXG4gICAgUGxhdGZvcm1DYXBhYmlsaXRpZXM6IFtDb21wYXRpYmlsaXR5LkVDMl0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ211bHRpbm9kZSBqb2IgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIGNvbnRhaW5lcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBNdWx0aU5vZGVKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLkM0LCBJbnN0YW5jZVNpemUuTEFSR0UpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spKS50b1Rocm93KC9tdWx0aW5vZGUgam9iIGhhcyBubyBjb250YWluZXJzIS8pO1xufSk7XG4iXX0=