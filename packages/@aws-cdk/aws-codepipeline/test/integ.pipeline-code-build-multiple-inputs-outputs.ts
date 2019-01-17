import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codebuild-multiple-inputs-outputs');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'MyIntegTestTempRepo',
});
const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactsStore: new codepipeline.ArtifactsStore(stack, 'ArtifactsStore', { bucket } )
});

const sourceStage = pipeline.addStage('Source');
const sourceAction1 = repository.addToPipeline(sourceStage, 'Source1');
const sourceAction2 = bucket.addToPipeline(sourceStage, 'Source2', {
  bucketKey: 'some/path',
});

const project = new codebuild.PipelineProject(stack, 'MyBuildProject');
const buildStage = pipeline.addStage('Build');
const buildAction = project.addToPipeline(buildStage, 'Build1', {
  inputArtifact: sourceAction1.outputArtifact,
  additionalInputArtifacts: [
    sourceAction2.outputArtifact,
  ],
  additionalOutputArtifactNames: [
    'CustomOutput1',
  ],
});
const testAction = project.addToPipelineAsTest(buildStage, 'Build2', {
  inputArtifact: sourceAction2.outputArtifact,
  additionalInputArtifacts: [
    sourceAction1.outputArtifact,
  ],
  additionalOutputArtifactNames: [
    'CustomOutput2',
  ],
});

// some assertions on the Action helper methods
if (buildAction.additionalOutputArtifacts().length !== 1) {
  throw new Error(`Expected build Action to have 1 additional output artifact, but was: ${buildAction.additionalOutputArtifacts()}`);
}
buildAction.additionalOutputArtifact('CustomOutput1'); // that it doesn't throw

if (testAction.outputArtifact) {
  throw new Error(`Expected test Action output Artifact to be undefined, was: ${testAction.outputArtifact}`);
}
if (testAction.additionalOutputArtifacts().length !== 1) {
  throw new Error(`Expected test Action to have 1 additional output artifact, but was: ${testAction.additionalOutputArtifacts()}`);
}
testAction.additionalOutputArtifact('CustomOutput2'); // that it doesn't throw

app.run();
