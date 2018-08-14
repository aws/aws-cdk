import cdk = require('@aws-cdk/cdk');
import { Action, ActionArtifactBounds, ActionCategory, CommonActionProps } from "./action";

export interface DeployActionProps extends CommonActionProps {
    provider: string;

    artifactBounds: ActionArtifactBounds;

    configuration?: any;
}

export abstract class DeployAction extends Action {
    constructor(parent: cdk.Construct, name: string, props: DeployActionProps) {
        super(parent, name, {
            stage: props.stage,
            category: ActionCategory.Deploy,
            provider: props.provider,
            artifactBounds: props.artifactBounds,
            configuration: props.configuration,
        });
    }
}
