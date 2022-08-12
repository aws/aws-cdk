import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import * as apig from '../lib';

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
      runtime: lambda.Runtime.NODEJS_14_X,
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
