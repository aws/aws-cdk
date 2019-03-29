import { Action, ActionArtifactBounds, ActionCategory, CommonActionProps } from "./action";
import { Artifact } from './artifact';

export interface DeployActionProps extends CommonActionProps {
  readonly provider: string;

  readonly owner?: string;

  readonly artifactBounds: ActionArtifactBounds;

  readonly inputArtifact: Artifact;

  readonly configuration?: any;
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
