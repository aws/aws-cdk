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
  constructor(scope: cdk.Construct, id: string, props: DeployActionProps) {
    super(scope, id, {
      category: ActionCategory.Deploy,
      ...props,
    });

    this.addInputArtifact(props.inputArtifact);
  }
}
