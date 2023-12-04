import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
// import { LogAnomalyDetector, LogGroup, EvaluationFrequency } from 'aws-cdk-lib/aws-logs';
import { LogGroup, EvaluationFrequency } from 'aws-cdk-lib/aws-logs';

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // const logGroup = new LogGroup(this, 'LogGroup', {
    //   removalPolicy: RemovalPolicy.DESTROY,
    // });

    // new LogAnomalyDetector(this, 'MyAnomalyDetector', {
    //   logGroup,
    //   detectorName: 'MyDetector',
    //   evaluationFrequency: EvaluationFrequency.FIVE_MIN,
    //   filterPattern: 'ERROR',
    // });

    const logGroup2 = new LogGroup(this, 'LogGroup2', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    logGroup2.addAnomalyDetector('MyAnomalyDetector2', {
      detectorName: 'MyDetector',
      evaluationFrequency: EvaluationFrequency.TEN_MIN,
      filterPattern: 'WARN',
    });

  }
}

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-metricfilter-dimensions-integ');

new IntegTest(app, 'metricfilter-dimensions', {
  testCases: [testCase],
});
app.synth();