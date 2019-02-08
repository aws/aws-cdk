import { Action, ActionArtifactBounds, ActionCategory, CommonActionProps } from "./action";
import { Artifact } from './artifact';

export interface DeployActionProps extends CommonActionProps {
  provider: string;

  owner?: string;

  artifactBounds: ActionArtifactBounds;

  inputArtifact: Artifact;

  configuration?: any;
}

export abstract class DeployAction extends Action {
  constructor(props: DeployActionProps) {
    super({
      ...props,
      category: ActionCategory.Deploy,
    });

    this.addInputArtifact(props.inputArtifact);
  }
}
