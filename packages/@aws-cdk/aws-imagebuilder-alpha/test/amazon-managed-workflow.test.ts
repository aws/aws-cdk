import * as cdk from 'aws-cdk-lib';
import { AmazonManagedWorkflow, WorkflowType } from '../lib';

describe('Amazon-managed workflow', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('AWS-managed workflow import by attributes', () => {
    const workflow = AmazonManagedWorkflow.fromAmazonManagedWorkflowAttributes(stack, 'Workflow', {
      workflowName: 'build-image',
      workflowType: WorkflowType.BUILD,
    });

    expect(stack.resolve(workflow.workflowArn)).toEqual({
      'Fn::Join': [
        '',
        ['arn:', { Ref: 'AWS::Partition' }, ':imagebuilder:us-east-1:aws:workflow/build/build-image/x.x.x'],
      ],
    });
    expect(workflow.workflowName).toEqual('build-image');
    expect(workflow.workflowType).toEqual('BUILD');
    expect(workflow.workflowVersion).toEqual('x.x.x');
  });

  test('AWS-managed workflow pre-defined method import', () => {
    const buildContainer = AmazonManagedWorkflow.buildContainer(stack, 'BuildContainer-Workflow');
    const buildImage = AmazonManagedWorkflow.buildImage(stack, 'BuildImage-Workflow');
    const distributeContainer = AmazonManagedWorkflow.distributeContainer(stack, 'DistributeContainer-Workflow');
    const distributeImage = AmazonManagedWorkflow.distributeImage(stack, 'DistributeImage-Workflow');
    const testContainer = AmazonManagedWorkflow.testContainer(stack, 'TestContainer-Workflow');
    const testImage = AmazonManagedWorkflow.testImage(stack, 'TestImage-Workflow');

    const expectedWorkflowArn = (workflowType: string, workflowName: string) => ({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          `:imagebuilder:us-east-1:aws:workflow/${workflowType}/${workflowName}/x.x.x`,
        ],
      ],
    });

    expect(stack.resolve(buildContainer.workflowArn)).toEqual(expectedWorkflowArn('build', 'build-container'));
    expect(stack.resolve(buildImage.workflowArn)).toEqual(expectedWorkflowArn('build', 'build-image'));
    expect(stack.resolve(distributeContainer.workflowArn)).toEqual(
      expectedWorkflowArn('distribution', 'distribute-container'),
    );
    expect(stack.resolve(distributeImage.workflowArn)).toEqual(expectedWorkflowArn('distribution', 'distribute-image'));
    expect(stack.resolve(testContainer.workflowArn)).toEqual(expectedWorkflowArn('test', 'test-container'));
    expect(stack.resolve(testImage.workflowArn)).toEqual(expectedWorkflowArn('test', 'test-image'));
  });

  test('throws a validation error when importing AWS-managed workflow with workflow type as an unresolved token', () => {
    expect(() =>
      AmazonManagedWorkflow.fromAmazonManagedWorkflowAttributes(stack, 'BuildImage', {
        workflowName: 'build-image',
        workflowType: cdk.Lazy.string({ produce: () => 'BUILD' }) as WorkflowType,
      }),
    ).toThrow(cdk.ValidationError);
  });
});
