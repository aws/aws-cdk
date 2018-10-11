import cdk = require('@aws-cdk/cdk');
import { Action, ActionArtifactBounds, ActionCategory, CommonActionConstructProps, CommonActionProps } from "./action";
import { Artifact } from './artifact';

export interface DeployActionProps extends CommonActionProps, CommonActionConstructProps {
  provider: string;

  artifactBounds: ActionArtifactBounds;

  inputArtifact?: Artifact;

  configuration?: any;
}

export abstract class DeployAction extends Action {
  constructor(parent: cdk.Construct, name: string, props: DeployActionProps) {
    super(parent, name, {
      stage: props.stage,
      runOrder: props.runOrder,
      category: ActionCategory.Deploy,
      provider: props.provider,
      artifactBounds: props.artifactBounds,
      configuration: props.configuration,
    });

    if (props.inputArtifact) {
      this.addInputArtifact(props.inputArtifact);
    }
  }
}
