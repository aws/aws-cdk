import * as cdk from 'aws-cdk-lib';
import * as %name.PascalCased% from '../lib/index';

test('Empty Stack', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new %name.PascalCased%.%name.PascalCased%(stack, 'MyTestConstruct');
  // THEN
  const actual = app.synth().getStackArtifact(stack.artifactId).template;
  expect(actual.Resources ?? {}).toEqual({});
});
