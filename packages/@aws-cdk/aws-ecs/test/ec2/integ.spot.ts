import { App, CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import ec2 = require('../../../aws-ec2');
import ecs = require('../../../aws-ecs');
import ecsPatterns = require('../../../aws-ecs-patterns');

class TestStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
            isDefault: true
        });

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
            minCapacity: 0,
            desiredCapacity: 0,
            instanceType: new ec2.InstanceType('t3.large'),
        });

        const taskDefinition = new ecs.TaskDefinition(this, 'Task', {
            compatibility: ecs.Compatibility.EC2
        });

        taskDefinition.addContainer('Flask', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        }).addPortMappings({
            containerPort: 80,
        });

        const webSvc = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'webSvc', {
            cluster,
            taskDefinition,
            desiredCount: 4
        });

        new CfnOutput(this, 'ALBSvcURL', {
            value: `http://${webSvc.loadBalancer.loadBalancerDnsName}`
        })

    }

}

const app = new App();
const env = {
    region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};
new TestStack(app, 'ecs-spot-test', { env });
app.synth();