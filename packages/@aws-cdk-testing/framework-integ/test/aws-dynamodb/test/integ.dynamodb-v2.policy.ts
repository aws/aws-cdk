import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // table with resource policy
    new dynamodb.TableV2(this, 'TableTestV2-1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      replicas: [{
        region: 'eu-west-2',
        resourcePolicy: iam.PolicyDocument.fromJson({
          Statement: [
            {
              Action: 'dynamodb:*',
              Effect: 'Allow',
              Principal: {
                AWS: '123456789101',
              },
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        }),
      }],
    });

    // table without resource policy
    // new dynamodb.Table(this, 'TableTest2', {
    //   partitionKey: {
    //     name: 'id',
    //     type: dynamodb.AttributeType.STRING,
    //   },
    //   removalPolicy: RemovalPolicy.DESTROY,
    // });
  }
}

new TestStack(app, 'ResourcePolicyTest', { env: { region: 'eu-west-1' } });

app.synth();