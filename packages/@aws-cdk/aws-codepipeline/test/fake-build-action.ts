import events = require('@aws-cdk/aws-events');
import { Construct } from '@aws-cdk/core';
import codepipeline = require('../lib');

export interface FakeBuildActionProps extends codepipeline.CommonActionProps {
  input: codepipeline.Artifact;

  output?: codepipeline.Artifact;

  extraInputs?: codepipeline.Artifact[];
}

export class FakeBuildAction implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;

  constructor(props: FakeBuildActionProps) {
    this.actionProperties = {
      ...props,
      category: codepipeline.ActionCategory.BUILD,
      provider: 'Fake',
      artifactBounds: { minInputs: 1, maxInputs: 3, minOutputs: 0, maxOutputs: 1 },
      inputs: [props.input, ...props.extraInputs || []],
      outputs: props.output ? [props.output] : undefined,
    };
  }

  public bind(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    return {};
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on FakeBuildAction');
  }
}
