import codepipeline = require('../lib');

export interface FakeBuildActionProps extends codepipeline.CommonActionProps {
  input: codepipeline.Artifact;

  output?: codepipeline.Artifact;

  extraInputs?: codepipeline.Artifact[];
}

export class FakeBuildAction extends codepipeline.Action {
  constructor(props: FakeBuildActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.BUILD,
      provider: 'Fake',
      artifactBounds: { minInputs: 1, maxInputs: 3, minOutputs: 0, maxOutputs: 1 },
      inputs: [props.input, ...props.extraInputs || []],
      outputs: props.output ? [props.output] : undefined,
    });
  }

  protected bind(_info: codepipeline.ActionBind): void {
    // do nothing
  }
}
