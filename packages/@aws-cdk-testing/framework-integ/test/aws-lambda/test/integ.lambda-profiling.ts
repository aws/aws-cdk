import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { ProfilingGroup } from 'aws-cdk-lib/aws-codeguruprofiler';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime, InlineCode, Function } from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_9,
      profiling: true,
    });

    const importedProfilingGroup = new ProfilingGroup(this, 'MyImportedProfilingGroup');

    new Function(this, 'MyOtherLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_9,
      profiling: true,
      profilingGroup: importedProfilingGroup,
    });
  }
}

new IntegTest(app, 'LambdaTest', {
  testCases: [new StackUnderTest(app, 'Stack1', {})],
});
