import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

// Assume that the CloudWatch Logs resource policy is created by another stack
class LogsResourcePolicy extends Stack {
  public readonly logGroup: logs.LogGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.logGroup = new logs.LogGroup(this, 'AppLogsGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const resourcePolicy = new logs.ResourcePolicy(this, 'ResourcePolicy');
    resourcePolicy.document.addStatements(new iam.PolicyStatement({
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      principals: [new iam.ServicePrincipal('es.amazonaws.com')],
      resources: [this.logGroup.logGroupArn],
    }));
  }
}

interface TestStackProps extends StackProps {
  logGroup: logs.LogGroup;
}

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    const domainProps: opensearch.DomainProps = {
      version: opensearch.EngineVersion.OPENSEARCH_2_13,
      removalPolicy: RemovalPolicy.DESTROY,
      logging: {
        appLogEnabled: true,
        appLogGroup: props.logGroup,
      },
      suppressLogsResourcePolicy: true,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
const logGroupStack = new LogsResourcePolicy(app, 'cdkinteg-logs-resource-policy');
const testStack = new TestStack(app, 'cdkinteg-opensearch-without-logs-resource-policy', {
  logGroup: logGroupStack.logGroup,
});

new IntegTest(app, 'Integ', { testCases: [logGroupStack, testStack] });
