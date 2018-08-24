import cdk = require('@aws-cdk/cdk');
import { ClusterName } from './cluster';
import { cloudformation } from './ecs.generated';
import { TaskDefinitionArn } from './task-definition';

export interface ServiceProps {
    cluster: ClusterName;
    taskDefinition: TaskDefinitionArn;
    desiredCount: number;
}

export class Service extends cdk.Construct {
    constructor(parent: cdk.Construct, name: string, props: ServiceProps) {
        super(parent, name);

        new cloudformation.ServiceResource(this, "Service", {
            cluster: props.cluster,
            taskDefinition: props.taskDefinition,
            desiredCount: props.desiredCount,
            deploymentConfiguration: {
                maximumPercent: 200,
                minimumHealthyPercent: 75
            }
        });
    }
}
