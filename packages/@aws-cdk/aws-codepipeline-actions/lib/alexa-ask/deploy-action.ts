import codepipeline = require('@aws-cdk/aws-codepipeline');
import { SecretValue } from '@aws-cdk/cdk';

/**
 * Construction properties of the {@link AlexaSkillDeployAction Alexa deploy Action}.
 */
export interface AlexaSkillDeployActionProps extends codepipeline.CommonActionProps {
  /**
   * The client id of the developer console token
   */
  readonly clientId: string;

  /**
   * The client secret of the developer console token
   */
  readonly clientSecret: SecretValue;

  /**
   * The refresh token of the developer console token
   */
  readonly refreshToken: SecretValue;

  /**
   * The Alexa skill id
   */
  readonly skillId: string;

  /**
   * The source artifact containing the voice model and skill manifest
   */
  readonly input: codepipeline.Artifact;

  /**
   * An optional artifact containing overrides for the skill manifest
   */
  readonly parameterOverridesArtifact?: codepipeline.Artifact;
}

/**
 * Deploys the skill to Alexa
 */
export class AlexaSkillDeployAction extends codepipeline.Action {
  constructor(props: AlexaSkillDeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.Deploy,
      owner: 'ThirdParty',
      provider: 'AlexaSkillsKit',
      artifactBounds: {
        minInputs: 1,
        maxInputs: 2,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: getInputs(props),
      configuration: {
        ClientId: props.clientId,
        ClientSecret: props.clientSecret,
        RefreshToken: props.refreshToken,
        SkillId: props.skillId,
      },
    });
  }

  protected bind(_info: codepipeline.ActionBind): void {
    // nothing to do
  }
}

function getInputs(props: AlexaSkillDeployActionProps): codepipeline.Artifact[] {
  const ret = [props.input];
  if (props.parameterOverridesArtifact) {
    ret.push(props.parameterOverridesArtifact);
  }
  return ret;
}
