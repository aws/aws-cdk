## AWS CodePipline Actions for AWS CloudFormation

This module contains an Action that allows you to use CloudFormation actions from CodePipeline.

Example usage:

```ts
import { Repository } from '@aws-cdk/aws-codecommit';
import { PipelineSource } from '@aws-cdk/aws-codecommit-codepipeline';
import { ArtifactPath, Pipeline, Stage } from '@aws-cdk/aws-codepipeline';
import { Role } from '@aws-cdk/aws-iam';
import { PolicyStatement, ServicePrincipal } from '@aws-cdk/cdk';
import { CreateReplaceChangeSet, ExecuteChangeSet } from '../lib/pipeline-action';

const pipeline = new Pipeline(stack, 'DeploymentPipeline');

const changeSetExecRole = new Role(stack, 'ChangeSetRole', {
    assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
});

/** Source! */
const repo = new Repository(stack, 'MyVeryImportantRepo', { repositoryName: 'my-very-important-repo' });

const sourceStage = new Stage(pipeline, 'source');

const source = new PipelineSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

/** Deploy! */
const prodStage = new Stage(pipeline, 'prod');
const stackName = 'AStack';
const changeSetName = 'AChangeSet';

new CreateReplaceChangeSet(prodStage, 'MakeChangeSetProd', {
    stackName,
    changeSetName,
    roleArn: changeSetExecRole.roleArn,
    templatePath: new ArtifactPath(source.artifact, 'some_template.yaml'),
});

new ExecuteChangeSet(prodStage, 'ExecuteChangeSetProd', {
    stackName,
    changeSetName,
});
```

See [the AWS documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline.html)
for more details about using CloudFormation in CodePipeline.
