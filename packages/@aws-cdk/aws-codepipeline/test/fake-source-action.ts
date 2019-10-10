import events = require('@aws-cdk/aws-events');
import { Construct } from '@aws-cdk/core';
import codepipeline = require('../lib');

export interface FakeSourceActionProps extends codepipeline.CommonActionProps {
  output: codepipeline.Artifact;

  extraOutputs?: codepipeline.Artifact[];

  region?: string;
}

export class FakeSourceAction implements codepipeline.IAction {
  public readonly inputs?: codepipeline.Artifact[];
  public readonly outputs?: codepipeline.Artifact[];

  public readonly actionProperties: codepipeline.ActionProperties;

  constructor(props: FakeSourceActionProps) {
    this.actionProperties = {
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'Fake',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 4 },
      outputs: [props.output, ...props.extraOutputs || []],
    };
  }

  public bind(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    return {};
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on FakeSourceAction');
  }
}
