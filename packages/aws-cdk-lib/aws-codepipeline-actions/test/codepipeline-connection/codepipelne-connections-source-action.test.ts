import { Stack } from 'aws-cdk-lib';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CodeConnectionsSourceAction, CodeConnectionsSourceActionProps } from '../../lib';

describe('CodeConnectionsSourceAction', () => {

  test('requires connectionArn', () => {
    const stack = new Stack();

    expect(() => {
      new CodeConnectionsSourceAction({
        actionName: 'GitHub_Source',
        owner: 'aws',
        repo: 'aws-cdk',
        output: new Artifact(),
      } as CodeConnectionsSourceActionProps);
    }).toThrow(/connectionArn is required/);
  });

  test('creates correct configuration', () => {
    const stack = new Stack();
    const action = new CodeConnectionsSourceAction({
      actionName: 'GitHub_Source',
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
      owner: 'aws',
      repo: 'aws-cdk',
      output: new Artifact(),
    });

    expect(action).toBeDefined();
    const config = action.bind(stack, {
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      }),
      bucket: new s3.Bucket(stack, 'PipelineBucket'),
    });

    expect(config.configuration.ConnectionArn).toEqual('arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh');
    expect(config.configuration.FullRepositoryId).toEqual('aws/aws-cdk');
    expect(config.configuration.BranchName).toEqual('master');
  });

  test('creates correct configuration with custom branch', () => {
    const stack = new Stack();
    const action = new CodeConnectionsSourceAction({
      actionName: 'GitHub_Source',
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
      owner: 'aws',
      repo: 'aws-cdk',
      output: new Artifact(),
      branch: 'develop',
    });

    expect(action).toBeDefined();
    const config = action.bind(stack, {
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      }),
      bucket: new s3.Bucket(stack, 'PipelineBucket'),
    });

    expect(config.configuration.BranchName).toEqual('develop');
  });

  test('handles codeBuildCloneOutput option', () => {
    const stack = new Stack();
    const outputArtifact = new Artifact();
    const action = new CodeConnectionsSourceAction({
      actionName: 'GitHub_Source',
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
      owner: 'aws',
      repo: 'aws-cdk',
      output: outputArtifact,
      codeBuildCloneOutput: true,
    });

    expect(action).toBeDefined();
    const config = action.bind(stack, {
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      }),
      bucket: new s3.Bucket(stack, 'PipelineBucket'),
    });

    expect(config.configuration.OutputArtifactFormat).toEqual('CODEBUILD_CLONE_REF');

    const outputArtifactMetadata = (outputArtifact as any)._metadata; 
    expect(outputArtifactMetadata[CodeConnectionsSourceAction._CONNECTION_ARN_PROPERTY]).toEqual('arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh');
  });

  test('default triggerOnPush is true', () => {
    const stack = new Stack();
    const action = new CodeConnectionsSourceAction({
      actionName: 'GitHub_Source',
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
      owner: 'aws',
      repo: 'aws-cdk',
      output: new Artifact(),
    });

    expect(action).toBeDefined();
    const config = action.bind(stack, {
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      }),
      bucket: new s3.Bucket(stack, 'PipelineBucket'),
    });

    expect(config.configuration.DetectChanges).toEqual(true);
  });

});
