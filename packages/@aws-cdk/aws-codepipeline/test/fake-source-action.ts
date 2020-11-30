import * as events from '@aws-cdk/aws-events';
import { Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as codepipeline from '../lib';

export interface IFakeSourceActionVariables {
  readonly firstVariable: string;
}

export interface FakeSourceActionProps extends codepipeline.CommonActionProps {
  readonly output: codepipeline.Artifact;

  readonly extraOutputs?: codepipeline.Artifact[];

  readonly region?: string;
}

export class FakeSourceAction implements codepipeline.IAction {
  public readonly inputs?: codepipeline.Artifact[];
  public readonly outputs?: codepipeline.Artifact[];
  public readonly variables: IFakeSourceActionVariables;

  public readonly actionProperties: codepipeline.ActionProperties;

  constructor(props: FakeSourceActionProps) {
    this.actionProperties = {
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'Fake',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 4 },
      outputs: [props.output, ...props.extraOutputs || []],
    };
    this.variables = {
      firstVariable: Lazy.string({ produce: () => `#{${this.actionProperties.variablesNamespace}.FirstVariable}` }),
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
