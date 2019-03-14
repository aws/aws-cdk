import cdk = require('@aws-cdk/cdk');
import ssm = require('../lib');

class CreatingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new ssm.StringParameter(this, 'String', {
      name: '/My/Public/Parameter',
      stringValue: 'abcdef'
    });
  }
}

class UsingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    // Retrieve the latest value of the non-secret parameter
    // with name "/My/String/Parameter".
    const stringValue = new ssm.ParameterStoreString(this, 'MyValue', {
      parameterName: '/My/Public/Parameter',
      // 'version' can be specified but is optional.
    }).stringValue;

    // Retrieve a specific version of the secret (SecureString) parameter.
    // 'version' is always required.
    const secretValue = new ssm.ParameterStoreSecureString(this, 'SecretValue', {
      parameterName: '/My/Secret/Parameter',
      version: 5
    }).stringValue;
    /// !hide

    new cdk.CfnOutput(this, 'TheValue', { value: stringValue });

    // Cannot be provisioned so cannot be actually used
    Array.isArray(secretValue);
  }
}

const app = new cdk.App();

const creating = new CreatingStack(app, 'sspms-creating');
const using = new UsingStack(app, 'sspms-using');
using.addDependency(creating);

app.run();
