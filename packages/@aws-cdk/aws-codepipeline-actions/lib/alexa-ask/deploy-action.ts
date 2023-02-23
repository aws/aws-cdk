import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';

/**
 * Construction properties of the `AlexaSkillDeployAction Alexa deploy Action`.
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
export class AlexaSkillDeployAction extends Action {
  private readonly props: AlexaSkillDeployActionProps;

  constructor(props: AlexaSkillDeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.DEPLOY,
      owner: 'ThirdParty',
      provider: 'AlexaSkillsKit',
      artifactBounds: {
        minInputs: 1,
        maxInputs: 2,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: getInputs(props),
    });

    this.props = props;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    return {
      configuration: {
        ClientId: this.props.clientId,
        ClientSecret: this.props.clientSecret.unsafeUnwrap(), // Safe usage
        RefreshToken: this.props.refreshToken.unsafeUnwrap(), // Safe usage
        SkillId: this.props.skillId,
      },
    };
  }
}

function getInputs(props: AlexaSkillDeployActionProps): codepipeline.Artifact[] {
  const ret = [props.input];
  if (props.parameterOverridesArtifact) {
    ret.push(props.parameterOverridesArtifact);
  }
  return ret;
}
