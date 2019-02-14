import cdk = require('@aws-cdk/cdk');
import ssm = require('../lib');

class CreatingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new ssm.StringParameter(this, 'String', {
      name: '/My/String/Parameter',
      stringValue: 'abcdef'
    });
  }
}

class UsingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    // Retrieve the value with name "/My/String/Parameter"
    const stringValue = new ssm.ParameterStoreString(this, 'MyValue', {
      parameterName: '/My/String/Parameter'
    }).stringValue;
    /// !hide

    new cdk.Output(this, 'TheValue', { value: stringValue });
  }
}

const app = new cdk.App();

const creating = new CreatingStack(app, 'sspms-creating');
const using = new UsingStack(app, 'sspms-using');
using.addDependency(creating);

app.run();