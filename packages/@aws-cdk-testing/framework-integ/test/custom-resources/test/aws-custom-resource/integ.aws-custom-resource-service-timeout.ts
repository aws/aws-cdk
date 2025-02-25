import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { AwsCustomResource, AwsCustomResourcePolicy, Logging, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

/*
 * Stack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that `ServiceTimeout` is set to 60 in the CloudWatch Logs for the Lambda function that creates custom resources.
 */

const app = new App();

class CreateParameterStack extends Stack {
  public readonly parameterName: string;

  public constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const parameter = new StringParameter(this, 'Secret', {
      parameterName: 'Password',
      stringValue: 'ThisIsMyPassword',
    });

    this.parameterName = parameter.parameterName;
  }
}

interface GetParameterStackProps extends StackProps {
  readonly parameterName: string;
}

class GetParameterStack extends Stack {
  public constructor(scope: Construct, id: string, props: GetParameterStackProps) {
    super(scope, id, props);

    const getSecret = new AwsCustomResource(this, 'GetSecret', {
      onUpdate: {
        service: 'SSM',
        action: 'GetParameter',
        parameters: {
          Name: props.parameterName,
          WithDecryption: true,
        },
        physicalResourceId: PhysicalResourceId.of(props.parameterName),
        logging: Logging.withDataHidden(),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      serviceTimeout: Duration.seconds(60),
    });

    const value = getSecret.getResponseField('Parameter.Value');
    new CfnOutput(this, 'RevealSecret', { value });
  }
}

const createParameterStack = new CreateParameterStack(app, 'CreateParameterServiceTimeoutStack');
const getParameterStack = new GetParameterStack(app, 'GetParameterServiceTimeoutStack', {
  parameterName: createParameterStack.parameterName,
});

getParameterStack.addDependency(createParameterStack);

new IntegTest(app, 'aws-cdk-customresources-service-timeout-integ-test', {
  testCases: [createParameterStack, getParameterStack],
  diffAssets: true,
});
