import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as destinations from 'aws-cdk-lib/aws-lambda-destinations';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

// !!!! WARNING !!!!
// Running this integration requires enabling the opt-in Africa (Cape Town) af-south-1 region
// Using the CLI: aws account enable-region --region-name af-south-1
// As always, you will also need to cdk bootstrap the region once it's enabled
// !!!! WARNING !!!!

/**
 * As far as I can tell, it's not possible to run integrations assertions across multiple regions.
 * Manual integration verification it is:
 *
 * # Deploy this integration with the --no-clean flag
 * $ export CDK_INTEG_ACCOUNT=<account>
 *
 * # Opt-in region topic, opt-in region lambda
 * $ AWS_REGION=af-south-1 aws sns publish --topic-arn "arn:aws:sns:af-south-1:$CDK_INTEG_ACCOUNT:TestCaseOptInRegionFunctionOptInRegionTopicTopicStackAA4DDF48-TopicBFC7AF6E-Aetio07F39Zp" --message "opt-in region, but not cross region"
 * $ AWS_REGION=af-south-1 aws sqs receive-message --queue-url "https://sqs.af-south-1.amazonaws.com/$CDK_INTEG_ACCOUNT/TestCaseOptInRegionFunctionOptInReg-SuccessDestinationQueue84EFF5D1-HRVdRMl1jW6X" | jq -r '.Messages[] | .Body | fromjson | .responsePayload'
 * # Should output "opt-in region, but not cross region"
 *
 * # Opt-in region topic, default region lambda
 * $ AWS_REGION=af-south-1 aws sns publish --topic-arn "arn:aws:sns:af-south-1:$CDK_INTEG_ACCOUNT:TestCaseDefaultRegionFunctionOptInRegionTopicTopicStackBBE3508D-TopicBFC7AF6E-n2jI4aOzMuKf" --message "opt-in region topic, default region lambda"
 * $ AWS_REGION=us-east-1 aws sqs receive-message --queue-url "https://sqs.us-east-1.amazonaws.com/$CDK_INTEG_ACCOUNT/TestCaseDefaultRegionFunctionOptInR-SuccessDestinationQueue84EFF5D1-CqICAAoyiJQn" | jq -r '.Messages[] | .Body | fromjson | .responsePayload'
 * # Should output "opt-in region topic, default region lambda"
 *
 * # Remember to clean up the resources after running the above tests
 */

const defaultRegion = 'us-east-1';
const optInRegion = 'af-south-1';
const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;

// GIVEN
const app = new cdk.App();

interface FunctionStackProps extends cdk.StackProps {
  readonly region: string;
}
class FunctionStack extends cdk.Stack {
  public readonly fn: lambda.Function;

  constructor(scope: Construct, id: string, props: FunctionStackProps) {
    super(scope, id, {
      ...props,
      env: { account, region: props.region },
      crossRegionReferences: true,
    });

    this.fn = new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => event.Records[0].Sns.Message;`),
      // Using a queue as an easy way to verify the message, we're still only testing sns-subscriptions.LambdaSubscription for this integ
      onSuccess: new destinations.SqsDestination(new sqs.Queue(this, 'SuccessDestinationQueue')),
    });
  }
}

interface TopicStackProps extends cdk.StackProps {
  readonly fn: lambda.IFunction;
  readonly region: string;
}
class TopicStack extends cdk.Stack {
  public readonly topic: sns.ITopic;
  constructor(scope: Construct, id: string, props: TopicStackProps) {
    super(scope, id, {
      ...props,
      env: { account, region: props.region },
      crossRegionReferences: true,
    });

    this.topic = new sns.Topic(this, 'Topic', {
      topicName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
    this.topic.addSubscription(new subs.LambdaSubscription(props.fn));
  }
}

interface TestCaseStackProps extends cdk.StackProps {
  readonly regions: { fn: string; topic: string };
}
class TestCaseStack extends Construct {
  public readonly testCases: cdk.Stack[] = [];

  constructor(scope: Construct, id: string, props: TestCaseStackProps) {
    super(scope, id);

    const functionStack = new FunctionStack(this, 'FunctionStack', {
      region: props.regions.fn,
    });
    this.testCases.push(functionStack);

    this.testCases.push(new TopicStack(this, 'TopicStack', {
      fn: functionStack.fn,
      region: props.regions.topic,
    }));
  }
}
// Not a cross-region test case, just running this as a sanity check
const testCaseOptInRegionFunctionOptInRegionTopic = new TestCaseStack(app, 'TestCaseOptInRegionFunctionOptInRegionTopic', {
  regions: { fn: optInRegion, topic: optInRegion },
});
const testCaseDefaultRegionFunctionOptInRegionTopic = new TestCaseStack(app, 'TestCaseDefaultRegionFunctionOptInRegionTopic', {
  regions: { fn: defaultRegion, topic: optInRegion },
});
// Default region topic to opt-in region cross region delivery is not supported for Lambda
// Opt-in to opt-in cross region delivery is not supported for Lambda
// See https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html

// THEN
new IntegTest(app, 'CrossOptInRegionsLambdaSubscriptionTest', {
  testCases: [
    testCaseOptInRegionFunctionOptInRegionTopic,
    testCaseDefaultRegionFunctionOptInRegionTopic,
  ].map(({ testCases }) => testCases).flat(),
});

app.synth();
