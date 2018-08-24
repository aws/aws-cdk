import cdk = require('@aws-cdk/cdk');
import { ClusterName } from './cluster';
import { cloudformation } from './ecs.generated';
import { TaskDefinitionArn } from './task-definition';

export interface ServiceProps {
    /**
     * Cluster where service will be deployed
     */
    cluster: ClusterName; // should be required? do we assume 'default' exists?

    /**
     * Task Definition used for running tasks in the service
     */
    taskDefinition: TaskDefinitionArn;

    /**
     * Number of desired copies of running tasks
     *
     * @default 1
     */
    desiredCount?: number;

    /**
     * A name for the service.
     *
     * @default CloudFormation-generated name
     */
    serviceName?: string;

    /**
     * Whether the service is hosted in EC2 or Fargate
     *
     * @default EC2
     */
    launchType?: string; // maybe unnecessary if we have different ECS vs FG service

    /**
     * The maximum number of tasks, specified as a percentage of the Amazon ECS service's DesiredCount value, that can run in a service during a deployment.
     *
     * @default 200
     */
    maximumPercent?: number;

    /**
     * The minimum number of tasks, specified as a percentage of
     * the Amazon ECS service's DesiredCount value, that must
     * continue to run and remain healthy during a deployment.
     *
     * @default 50
     */
    minimumHealthyPercent?: number;

    /**
     * The name or ARN of an AWS Identity and Access Management (IAM) role that allows your Amazon ECS container agent to make calls to your load balancer.
     */
    role?: string;

    ///////// TBD ///////////////////////////////
    // healthCheckGracePeriodSeconds?: number; // only needed with load balancers
    // loadBalancers?: LoadBalancer[];
    // placementConstraints?: PlacementConstraint[];
    // placementStrategies?: PlacementStrategy[];
    // networkConfiguration?: NetworkConfiguration;
    // serviceRegistries?: ServiceRegistry[];
    //
    // platformVersion?: string; // FARGATE ONLY. default is LATEST. Other options:  1.2.0, 1.1.0, 1.0.0
    ////////////////////////////////////////////
}

export class Service extends cdk.Construct {
    constructor(parent: cdk.Construct, name: string, props: ServiceProps) {
        super(parent, name);

        new cloudformation.ServiceResource(this, "Service", {
            cluster: props.cluster,
            taskDefinition: props.taskDefinition,
            desiredCount: props.desiredCount,
            serviceName: props.serviceName,
            launchType: props.launchType,
            deploymentConfiguration: {
                maximumPercent: props.maximumPercent,
                minimumHealthyPercent: props.minimumHealthyPercent
            },
            role: props.role,
        });
    }
}
