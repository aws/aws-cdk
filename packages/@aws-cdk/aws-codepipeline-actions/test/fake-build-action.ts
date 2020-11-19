import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import { IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';

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

export class FakeBuildAction extends codepipeline.Action {
  private readonly customConfigKey: string | undefined;

  constructor(props: FakeBuildActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.BUILD,
      provider: 'Fake',
      artifactBounds: { minInputs: 1, maxInputs: 3, minOutputs: 0, maxOutputs: 1 },
      inputs: [props.input, ...props.extraInputs || []],
      outputs: props.output ? [props.output] : undefined,
    });
    this.customConfigKey = props.customConfigKey;
  }

  public testChangeInputs(inputs: codepipeline.Artifact[]) {
    super.changeInputs(inputs);
  }

  public bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    return {
      boundAction: {
        action: this,
        configuration: () => ({
          CustomConfigKey: this.customConfigKey,
        }),
      },
    };
  }
}
