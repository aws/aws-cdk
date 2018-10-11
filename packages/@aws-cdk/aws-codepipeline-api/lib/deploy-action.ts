import cdk = require('@aws-cdk/cdk');
import { Action, ActionArtifactBounds, ActionCategory, CommonActionConstructProps, CommonActionProps } from "./action";
import { Artifact } from './artifact';

export interface DeployActionProps extends CommonActionProps, CommonActionConstructProps {
  provider: string;

  owner?: string;

  artifactBounds: ActionArtifactBounds;

  inputArtifact?: Artifact;

  configuration?: any;
}

export abstract class DeployAction extends Action {
  constructor(parent: cdk.Construct, name: string, props: DeployActionProps) {
    super(parent, name, {
      category: ActionCategory.Deploy,
      ...props,
    });

    this.addInputArtifact(props.inputArtifact);
  }
}
