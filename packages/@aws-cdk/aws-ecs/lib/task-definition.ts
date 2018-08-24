import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './ecs.generated';

export interface TaskDefinitionProps {
    cpu?: string;
    memory?: string;
    // specify cpu, memory, image url for containers
}

export class TaskDefinitionArn extends cdk.Token {
}

export class TaskDefinition extends cdk.Construct {
    public readonly taskDefinitionArn: TaskDefinitionArn;

    constructor(parent: cdk.Construct, name: string, _props: TaskDefinitionProps = {}) {
        super(parent, name);

        const taskDef = new cloudformation.TaskDefinitionResource(this, "TaskDef", {
            family: "ecs-demo",
            memory: "512",
            cpu: "256",
            containerDefinitions: [{
                name: "web",
                image: "amazon/amazon-ecs-sample",
                cpu: 10,
                memory: 128,
                essential: true
            }]
        });

        this.taskDefinitionArn = taskDef.ref;
    }
}
