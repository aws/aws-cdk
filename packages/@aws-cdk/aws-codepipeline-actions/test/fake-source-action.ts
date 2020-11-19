import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';

export interface IFakeSourceActionVariables {
  readonly firstVariable: string;
}

export interface FakeSourceActionProps extends codepipeline.CommonActionProps {
  readonly output: codepipeline.Artifact;

  readonly extraOutputs?: codepipeline.Artifact[];

  readonly region?: string;
}

export class FakeSourceAction extends codepipeline.Action {
  public readonly variables: IFakeSourceActionVariables;

  constructor(props: FakeSourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'Fake',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 4 },
      outputs: [props.output, ...props.extraOutputs || []],
    });
    this.variables = {
      firstVariable: Lazy.stringValue({ produce: () => `#{${this.actionProperties.variablesNamespace}.FirstVariable}` }),
    };
  }

  public testChangeOutputs(outputs: codepipeline.Artifact[]) {
    super.changeOutputs(outputs);
  }

  public bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    return {
      boundAction: {
        action: this,
        configuration: () => undefined,
      },
    };
  }
}
