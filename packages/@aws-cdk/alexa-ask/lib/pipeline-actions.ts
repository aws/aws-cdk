import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');

/**
 * Construction properties of the {@link AlexaSkillDeployAction Alexa deploy Action}.
 */
export interface AlexaSkillDeployActionProps extends codepipeline.CommonActionProps {
  /**
   * The client id of the developer console token
   */
  clientId: string;

  /**
   * The client secret of the developer console token
   */
  clientSecret: string;

  /**
   * The refresh token of the developer console token
   */
  refreshToken: string;

  /**
   * The Alexa skill id
   */
  skillId: string;

  /**
   * The source artifact containing the voice model and skill manifest
   */
  inputArtifact: codepipeline.Artifact;

  /**
   * An optional artifact containing overrides for the skill manifest
   */
  parameterOverridesArtifact?: codepipeline.Artifact;
}

/**
 * Deploys the skill to Alexa
 */
export class AlexaSkillDeployAction extends codepipeline.DeployAction {
  constructor(props: AlexaSkillDeployActionProps) {
    super({
      ...props,
      artifactBounds: {
        minInputs: 1,
        maxInputs: 2,
        minOutputs: 0,
        maxOutputs: 0,
      },
      owner: 'ThirdParty',
      provider: 'AlexaSkillsKit',
      configuration: {
        ClientId: props.clientId,
        ClientSecret: props.clientSecret,
        RefreshToken: props.refreshToken,
        SkillId: props.skillId,
      },
    });

    if (props.parameterOverridesArtifact) {
      this.addInputArtifact(props.parameterOverridesArtifact);
    }
  }

  protected bind(_stage: codepipeline.IStage, _scope: cdk.Construct): void {
    // nothing to do
  }
}
