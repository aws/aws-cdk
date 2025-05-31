import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { LOG_API_RESPONSE_DATA_PROPERTY_TRUE_DEFAULT } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';

const app = new App({
  postCliContext: {
    [LOG_API_RESPONSE_DATA_PROPERTY_TRUE_DEFAULT]: true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
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
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    const value = getSecret.getResponseField('Parameter.Value');
    new CfnOutput(this, 'RevealSecret', { value });
  }
}

const createParameterStack = new CreateParameterStack(app, 'CreateParameterStack');
const getParameterStack = new GetParameterStack(app, 'GetParameterStack', {
  parameterName: createParameterStack.parameterName,
});

getParameterStack.addDependency(createParameterStack);

new IntegTest(app, 'AwsCustomResourceSsmInteg', {
  testCases: [createParameterStack, getParameterStack],
});
