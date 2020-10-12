import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as codepipeline from '../lib';

export interface FakeBuildActionProps extends codepipeline.CommonActionProps {
  input: codepipeline.Artifact;

  output?: codepipeline.Artifact;

  extraInputs?: codepipeline.Artifact[];

  owner?: string;

  role?: iam.IRole;

  account?: string;

  region?: string;

  customConfigKey?: string;

  resource?: IResource;
}

export class FakeBuildAction implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;
  private readonly customConfigKey: string | undefined;

  constructor(props: FakeBuildActionProps) {
    this.actionProperties = {
      ...props,
      category: codepipeline.ActionCategory.BUILD,
      provider: 'Fake',
      artifactBounds: { minInputs: 1, maxInputs: 3, minOutputs: 0, maxOutputs: 1 },
      inputs: [props.input, ...props.extraInputs || []],
      outputs: props.output ? [props.output] : undefined,
    };
    this.customConfigKey = props.customConfigKey;
  }

  public bind(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    return {
      configuration: {
        CustomConfigKey: this.customConfigKey,
      },
    };
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on FakeBuildAction');
  }
}
