import ec2 = require('@aws-cdk/aws-ec2');
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import ecs = require('../../lib');

class TestStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });

        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc
        });

        cluster.addCapacity('asgSpot', {
            maxCapacity: 2,
            minCapacity: 2,
            desiredCapacity: 2,
            instanceType: new ec2.InstanceType('c5.xlarge'),
            spotPrice: '0.0735',
            spotInstanceDraining: true,
        });

        cluster.addCapacity('asgOd', {
            maxCapacity: 2,
            minCapacity: 1,
            desiredCapacity: 1,
            instanceType: new ec2.InstanceType('t3.large'),
        });

        const taskDefinition = new ecs.TaskDefinition(this, 'Task', {
            compatibility: ecs.Compatibility.EC2
        });

        taskDefinition.addContainer('PHP', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        }).addPortMappings({
            containerPort: 80,
        });

        new ecs.Ec2Service(this, 'Service', {
            cluster,
            taskDefinition
        });
    }

}

const app = new App();
new TestStack(app, 'ecs-spot-test2');
app.synth();
