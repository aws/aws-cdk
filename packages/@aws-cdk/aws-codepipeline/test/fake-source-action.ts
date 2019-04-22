import codepipeline = require('../lib');

export interface FakeSourceActionProps extends codepipeline.CommonActionProps {
  output: codepipeline.Artifact;

  extraOutputs?: codepipeline.Artifact[];
}

export class FakeSourceAction extends codepipeline.Action {
  constructor(props: FakeSourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.Source,
      provider: 'Fake',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 4 },
      outputs: [props.output, ...props.extraOutputs || []],
    });
  }

  protected bind(_info: codepipeline.ActionBind): void {
    // do nothing
  }
}
