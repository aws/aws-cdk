import * as codebuild from '@aws-cdk/aws-codebuild';

export function mergeBuildSpecs(a: codebuild.BuildSpec, b?: codebuild.BuildSpec): codebuild.BuildSpec;
export function mergeBuildSpecs(a: codebuild.BuildSpec | undefined, b: codebuild.BuildSpec): codebuild.BuildSpec;
export function mergeBuildSpecs(a?: codebuild.BuildSpec, b?: codebuild.BuildSpec): codebuild.BuildSpec | undefined;
export function mergeBuildSpecs(a?: codebuild.BuildSpec, b?: codebuild.BuildSpec) {
  if (!a || !b) { return a ?? b; }
  return codebuild.mergeBuildSpecs(a, b);
}

