import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');

class BonjourECS extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // For better iteration speed, it might make sense to put this VPC into
        // a separate stack and import it here. We then have two stacks to
        // deploy, but VPC creation is slow so we'll only have to do that once
        // and can iterate quickly on consuming stacks. Not doing that for now.
        const vpc = new ec2.VpcNetwork(this, 'MyVpc', {
            maxAZs: 2
        });

        const cluster = new ecs.Cluster(this, 'DemoCluster', {
            vpc
        });

        // name, image, cpu, memory, port (with default)
        //
        // Include in constructs:
        //   - networking - include SD, ALB
        //   - logging - cloudwatch logs integration? talk to nathan about 3rd
        //     party integrations - aggregated logging across the service
        //     (instead of per task). Probably prometheus or elk?
        //   - tracing aws-xray-fargate - CNCF opentracing standard - jaeger,
        //     zipkin.
        //   - so x-ray is a container that is hooked up to sidecars that come
        //     with the application container itself
        //   - autoscaling - application autoscaling (Fargate focused?)

        const taskDefinition = new ecs.TaskDefinition(this, "MyTD", {
            family: "ecs-task-definition",
            placementConstraints: [{
                type: "distinctInstance"
            }],
        });

        taskDefinition.addContainer(new ecs.ContainerDefinition(this, 'Def', {
            name: "web",
            image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
            cpu: 1024,
            memoryMiB: 512,
            essential: true
        }));

        cluster.runService(taskDefinition);
    }
}

const app = new cdk.App(process.argv);

new BonjourECS(app, 'GoedeMorgen');

process.stdout.write(app.run());
