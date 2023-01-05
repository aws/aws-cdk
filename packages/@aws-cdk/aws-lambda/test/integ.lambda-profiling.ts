import { ProfilingGroup } from '@aws-cdk/aws-codeguruprofiler';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { StackProps, Stack } from '../../core/lib/stack';
import * as lambda from '../lib';

const app = new cdk.App();

interface StackUnderTestProps extends StackProps {
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);

    new lambda.Function(this, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      profiling: true,
    });

    const importedProfilingGroup = ProfilingGroup.fromProfilingGroupArn(this, 'ImportedProfilingGroup', 'arn:aws:codeguru-profiler:us-east-1:1234567890:profilingGroup/MyAwesomeProfilingGroup');

    new lambda.Function(this, 'MyOtherLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      profiling: true,
      profilingGroup: importedProfilingGroup,
    });
  }
}

new IntegTest(app, 'IntegTest', {
  testCases: [
    new StackUnderTest(app, 'Stack1', {}),
  ],
});
