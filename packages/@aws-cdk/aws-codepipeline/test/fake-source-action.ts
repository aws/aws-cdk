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

export class FakeSourceAction extends codepipeline.Action {
  public readonly inputs?: codepipeline.Artifact[];
  public readonly outputs?: codepipeline.Artifact[];
  public readonly variables: IFakeSourceActionVariables;
  protected readonly providedActionProperties: codepipeline.ActionProperties;

  constructor(props: FakeSourceActionProps) {
    super();
    this.providedActionProperties = {
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

  public bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    return {};
  }
}
