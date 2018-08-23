import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, ClusterArn} from './ecs.generated';

export interface ClusterProps {
    /**
     * A name for the cluster.
     * @default CloudFormation-generated name
     */
    clusterName?: string;

    vpc: ec2.VpcNetworkRef;

    asg: autoscaling.AutoScalingGroup;
}

export class ClusterName extends cdk.Token {
}

export class Cluster extends cdk.Construct {

    public readonly clusterArn: ClusterArn;

    public readonly clusterName: ClusterName;

    constructor(parent: cdk.Construct, name: string, props: ClusterProps = {}) {
        super(parent, name);

        const cluster = new cloudformation.ClusterResource(this, "Resource", {clusterName: props.clusterName});

        this.clusterArn = cluster.clusterArn;

        this.clusterName = new ClusterName(cluster.ref);

        const taskDef = new cloudformation.TaskDefinitionResource(this, "TaskDef", {
            family: "Service",
            memory: "512",
            cpu: "256",
            containerDefinitions: [{
                name: "web",
                image: "amazon/amazon-ecs-sample",
                cpu: 10,
                memory: 1024,
                essential: true
            }]
        });

        new cloudformation.ServiceResource(this, "Service", {
            cluster: this.clusterName,
            taskDefinition: taskDef.ref,
            desiredCount: 1,
            deploymentConfiguration: {
                maximumPercent: 200,
                minimumHealthyPercent: 75
            }
        });
    }
}
