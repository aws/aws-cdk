import { describeDeprecated } from '@aws-cdk/cdk-build-tools';

interface SkippedSuite {
  modern(reason?: string): void;
}

interface Suite {
  readonly doesNotApply: SkippedSuite;

  modern(fn: () => void): void;

  additional(description: string, fn: () => void): void;
}