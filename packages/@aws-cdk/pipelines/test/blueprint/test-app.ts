/* eslint-disable import/no-extraneous-dependencies */
import '@aws-cdk/assert-internal/jest';
import { CfnOutput, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BucketStack } from './testutil';

export class OneStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new BucketStack(this, 'Stack');
  }
}

export class AppWithOutput extends Stage {
  public readonly theOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new BucketStack(this, 'Stack');
    this.theOutput = new CfnOutput(stack, 'MyOutput', { value: stack.bucket.bucketName });
  }
}

export class TwoStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack2 = new BucketStack(this, 'Stack2');
    const stack1 = new BucketStack(this, 'Stack1');

    stack2.addDependency(stack1);
  }
}

/**
 * Three stacks where the last one depends on the earlier 2
 */
export class ThreeStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new BucketStack(this, 'Stack1');
    const stack2 = new BucketStack(this, 'Stack2');
    const stack3 = new BucketStack(this, 'Stack3');

    stack3.addDependency(stack1);
    stack3.addDependency(stack2);
  }
}