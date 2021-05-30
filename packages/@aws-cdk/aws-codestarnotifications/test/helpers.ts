export class FakeCodeBuild {
  readonly projectArn = 'arn:aws:codebuild::1234567890:project/MyCodebuildProject';
}

export class FakeCodePipeline {
  readonly pipelineArn = 'arn:aws:codepipeline::1234567890:MyCodepipelineProject';
}

export class FakeIncorrectResource {
  readonly incorrectArn = 'arn:aws:incorrect';
}