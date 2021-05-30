export class FakeCodeBuild {
  readonly projectArn = 'arn:aws:codebuild::1234567890:project/MyCodebuildProject';
  readonly projectName = 'test-project';
}

export class FakeCodePipeline {
  readonly pipelineArn = 'arn:aws:codepipeline::1234567890:MyCodepipelineProject';
  readonly pipelineName = 'test-pipeline';
}

export class FakeIncorrectResource {
  readonly incorrectArn = 'arn:aws:incorrect';
  readonly a = 'a';
  readonly b = 'b';
  readonly o = {};
}