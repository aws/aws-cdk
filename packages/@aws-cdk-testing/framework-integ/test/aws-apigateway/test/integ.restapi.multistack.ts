import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as apig from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class FirstStack extends cdk.Stack {
  public readonly firstLambda: lambda.Function;

  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.firstLambda = new lambda.Function(this, 'firstLambda', {
      functionName: 'FirstLambda',
      code: lambda.Code.fromInline(`exports.handler = async function(event) {
          return  {
            'headers': { 'Content-Type': 'text/plain' },
            'statusCode': 200
          }
        }`),
      handler: 'index.handler',
      runtime: STANDARD_NODEJS_RUNTIME,
    });
  }
}

interface SecondStackProps extends cdk.StackProps {
  readonly lambda: lambda.Function;
}

class SecondStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props: SecondStackProps) {
    super(scope, id, props);

    const api = new apig.RestApi(this, 'BooksApi', {
      cloudWatchRole: true,
      restApiName: 'SecondRestAPI',
    });
    api.root.addMethod('ANY');
    const booksApi = api.root.addResource('books');
    const lambdaIntegration = new apig.LambdaIntegration(props.lambda);
    booksApi.addMethod('GET', lambdaIntegration);
  }
}

const app = new cdk.App();
const first = new FirstStack(app, 'FirstStack');
const testCase = new SecondStack(app, 'SecondStack', { lambda: first.firstLambda });

// will deploy dependent stacks, i.e. first
new IntegTest(app, 'restapi-multistack', {
  testCases: [testCase],
});
