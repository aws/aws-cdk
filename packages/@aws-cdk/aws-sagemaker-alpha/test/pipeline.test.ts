import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Schedule, ScheduleExpression } from 'aws-cdk-lib/aws-scheduler';
import { SageMakerStartPipelineExecution } from 'aws-cdk-lib/aws-scheduler-targets';
import * as sagemaker from '../lib';

describe('Pipeline', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  describe('fromPipelineArn', () => {
    test('imports pipeline from ARN', () => {
      const pipelineArn = 'arn:aws:sagemaker:us-east-1:123456789012:pipeline/my-pipeline';

      const pipeline = sagemaker.Pipeline.fromPipelineArn(stack, 'ImportedPipeline', pipelineArn);

      expect(pipeline.pipelineArn).toBe(pipelineArn);
      expect(pipeline.pipelineName).toBe('my-pipeline');
    });

    test('extracts pipeline name from ARN correctly', () => {
      const pipelineArn = 'arn:aws:sagemaker:us-west-2:987654321098:pipeline/test-pipeline-123';

      const pipeline = sagemaker.Pipeline.fromPipelineArn(stack, 'ImportedPipeline', pipelineArn);

      expect(pipeline.pipelineName).toBe('test-pipeline-123');
    });

    test('handles cross-account ARNs', () => {
      const pipelineArn = 'arn:aws:sagemaker:us-east-1:987654321098:pipeline/cross-account-pipeline';

      const pipeline = sagemaker.Pipeline.fromPipelineArn(stack, 'ImportedPipeline', pipelineArn);

      expect(pipeline.pipelineArn).toBe(pipelineArn);
      expect(pipeline.pipelineName).toBe('cross-account-pipeline');
    });

    test('handles cross-region ARNs', () => {
      const pipelineArn = 'arn:aws:sagemaker:eu-west-1:123456789012:pipeline/eu-pipeline';

      const pipeline = sagemaker.Pipeline.fromPipelineArn(stack, 'ImportedPipeline', pipelineArn);

      expect(pipeline.pipelineArn).toBe(pipelineArn);
      expect(pipeline.pipelineName).toBe('eu-pipeline');
    });
  });

  describe('fromPipelineName', () => {
    test('imports pipeline from name', () => {
      const pipelineName = 'my-test-pipeline';

      const pipeline = sagemaker.Pipeline.fromPipelineName(stack, 'ImportedPipeline', pipelineName);

      expect(pipeline.pipelineName).toBe(pipelineName);
      // ARN should contain the pipeline name and use CDK tokens for partition
      expect(pipeline.pipelineArn).toContain('sagemaker:us-east-1:123456789012:pipeline/my-test-pipeline');
    });

    test('constructs ARN correctly', () => {
      const pipelineName = 'another-pipeline';

      const pipeline = sagemaker.Pipeline.fromPipelineName(stack, 'ImportedPipeline', pipelineName);

      // ARN should contain the pipeline name and use CDK tokens for partition
      expect(pipeline.pipelineArn).toContain('sagemaker:us-east-1:123456789012:pipeline/another-pipeline');
    });

    test('uses stack account and region by default', () => {
      const customStack = new cdk.Stack(app, 'CustomStack', {
        env: { account: '234567890123', region: 'ap-southeast-1' },
      });

      const pipeline = sagemaker.Pipeline.fromPipelineName(customStack, 'ImportedPipeline', 'custom-pipeline');

      // ARN should contain the custom account/region and pipeline name
      expect(pipeline.pipelineArn).toContain('sagemaker:ap-southeast-1:234567890123:pipeline/custom-pipeline');
    });
  });

  describe('fromPipelineAttributes', () => {
    test('works with pipelineArn attribute', () => {
      const pipelineArn = 'arn:aws:sagemaker:us-east-1:123456789012:pipeline/attr-pipeline';

      const pipeline = sagemaker.Pipeline.fromPipelineAttributes(stack, 'ImportedPipeline', {
        pipelineArn,
      });

      expect(pipeline.pipelineArn).toBe(pipelineArn);
      expect(pipeline.pipelineName).toBe('attr-pipeline');
    });

    test('works with pipelineName attribute', () => {
      const pipelineName = 'attr-name-pipeline';

      const pipeline = sagemaker.Pipeline.fromPipelineAttributes(stack, 'ImportedPipeline', {
        pipelineName,
      });

      expect(pipeline.pipelineName).toBe(pipelineName);
      // ARN should contain the pipeline name and use CDK tokens for partition
      expect(pipeline.pipelineArn).toContain('sagemaker:us-east-1:123456789012:pipeline/attr-name-pipeline');
    });

    test('works with custom account and region', () => {
      const pipeline = sagemaker.Pipeline.fromPipelineAttributes(stack, 'ImportedPipeline', {
        pipelineName: 'custom-env-pipeline',
        account: '234567890123',
        region: 'eu-central-1',
      });

      // ARN should contain the custom account/region and pipeline name
      expect(pipeline.pipelineArn).toContain('sagemaker:eu-central-1:234567890123:pipeline/custom-env-pipeline');
    });

    test('throws when neither ARN nor name provided', () => {
      expect(() => {
        sagemaker.Pipeline.fromPipelineAttributes(stack, 'ImportedPipeline', {});
      }).toThrow('Either pipelineArn or pipelineName must be provided');
    });

    test('validates pipeline name format - valid names', () => {
      const validNames = [
        'valid-pipeline',
        'ValidPipeline123',
        'a',
        'pipeline-with-123-numbers',
        'PipelineWithMixedCase',
      ];

      validNames.forEach(name => {
        expect(() => {
          sagemaker.Pipeline.fromPipelineAttributes(stack, `Pipeline-${name}`, {
            pipelineName: name,
          });
        }).not.toThrow();
      });
    });

    test('validates pipeline name format - invalid names', () => {
      // Invalid names per AWS pattern: ^[a-zA-Z0-9](-*[a-zA-Z0-9])*$
      // Note: consecutive hyphens ARE allowed by AWS
      const invalidNames = [
        '-invalid-start', // cannot start with hyphen
        'invalid-end-', // cannot end with hyphen
        'invalid_underscore', // underscores not allowed
        'invalid.dot', // dots not allowed
        'invalid space', // spaces not allowed
        '', // empty string not allowed
      ];

      invalidNames.forEach((name, index) => {
        expect(() => {
          sagemaker.Pipeline.fromPipelineAttributes(stack, `Pipeline-${index}`, {
            pipelineName: name,
          });
        }).toThrow(/Invalid pipeline name/);
      });
    });

    test('validates pipeline name format - consecutive hyphens are allowed', () => {
      // AWS pattern ^[a-zA-Z0-9](-*[a-zA-Z0-9])*$ allows consecutive hyphens
      expect(() => {
        sagemaker.Pipeline.fromPipelineAttributes(stack, 'Pipeline-double-dash', {
          pipelineName: 'valid--double-dash',
        });
      }).not.toThrow();
    });
  });

  describe('grantStartPipelineExecution', () => {
    test('grants correct permissions to role', () => {
      const pipeline = sagemaker.Pipeline.fromPipelineName(stack, 'TestPipeline', 'test-pipeline');
      const role = new Role(stack, 'TestRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });

      pipeline.grantStartPipelineExecution(role);

      // Check that IAM policy is created with correct action
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Action: 'sagemaker:StartPipelineExecution',
            // Resource will be a CDK token, so we check the structure exists
          }],
        },
      });
    });

    test('works with imported pipeline from ARN', () => {
      const pipelineArn = 'arn:aws:sagemaker:us-west-2:987654321098:pipeline/imported-pipeline';
      const pipeline = sagemaker.Pipeline.fromPipelineArn(stack, 'ImportedPipeline', pipelineArn);
      const role = new Role(stack, 'TestRole', {
        assumedBy: new ServicePrincipal('events.amazonaws.com'),
      });

      pipeline.grantStartPipelineExecution(role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Action: 'sagemaker:StartPipelineExecution',
            Resource: pipelineArn,
          }],
        },
      });
    });
  });

  describe('integration with scheduler targets', () => {
    test('works with SageMakerStartPipelineExecution', () => {
      const pipeline = sagemaker.Pipeline.fromPipelineName(stack, 'TestPipeline', 'scheduler-test-pipeline');

      const target = new SageMakerStartPipelineExecution(pipeline, {
        pipelineParameterList: [{
          name: 'TestParam',
          value: 'TestValue',
        }],
      });

      new Schedule(stack, 'TestSchedule', {
        schedule: ScheduleExpression.rate(cdk.Duration.hours(1)),
        target,
      });

      // Verify the schedule is created with correct structure
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Scheduler::Schedule', {
        Target: {
          // Arn will be a CDK token, so we check the structure exists
          SageMakerPipelineParameters: {
            PipelineParameterList: [{
              Name: 'TestParam',
              Value: 'TestValue',
            }],
          },
        },
      });
    });

    test('scheduler target gets correct IAM permissions', () => {
      const pipeline = sagemaker.Pipeline.fromPipelineArn(
        stack,
        'ImportedPipeline',
        'arn:aws:sagemaker:eu-west-1:123456789012:pipeline/imported-scheduler-pipeline',
      );

      const target = new SageMakerStartPipelineExecution(pipeline);

      new Schedule(stack, 'TestSchedule', {
        schedule: ScheduleExpression.rate(cdk.Duration.minutes(30)),
        target,
      });

      // Verify IAM role has correct permissions
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Action: 'sagemaker:StartPipelineExecution',
            Resource: 'arn:aws:sagemaker:eu-west-1:123456789012:pipeline/imported-scheduler-pipeline',
          }],
        },
      });
    });
  });
});
