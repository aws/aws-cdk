const path = require('path');
const cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const ssm = require('@aws-cdk/aws-ssm');
const iam = require('@aws-cdk/aws-iam');
const sns = require('@aws-cdk/aws-sns');
const lambda = require('@aws-cdk/aws-lambda');
const docker = require('@aws-cdk/aws-ecr-assets');

class MyStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new sns.Topic(this, 'topic');

    if (cdk.AvailabilityZoneProvider) { // <= 0.34.0
      new cdk.AvailabilityZoneProvider(this).availabilityZones;
    } else if (cdk.Context) { // <= 0.35.0
      cdk.Context.getAvailabilityZones(this);
    } else {
      this.availabilityZones;
    }

    const parameterName = '/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2';
    getSsmParameterValue(this, parameterName);
  }
}

function getSsmParameterValue(scope, parameterName) {
  return ssm.StringParameter.valueFromLookup(scope, parameterName);
}

class YourStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new sns.Topic(this, 'topic1');
    new sns.Topic(this, 'topic2');
  }
}

class IamStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new iam.Role(this, 'SomeRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazon.aws.com')
    });
  }
}

class ProvidingStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    this.topic = new sns.Topic(this, 'BogusTopic'); // Some filler
  }
}



class ConsumingStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new sns.Topic(this, 'BogusTopic');  // Some filler
    new cdk.CfnOutput(this, 'IConsumedSomething', { value: props.providingStack.topic.topicArn });
  }
}

class MissingSSMParameterStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const parameterName = this.node.tryGetContext('test:ssm-parameter-name');
    if (parameterName) {
      const param = getSsmParameterValue(this, parameterName);
      new iam.Role(this, 'PhonyRole', { assumedBy: new iam.AccountPrincipal(param) });
    }
  }
}

class LambdaStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const fn = new lambda.Function(this, 'my-function', {
      code: lambda.Code.asset(path.join(__dirname, 'lambda')),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler'
    });

    new cdk.CfnOutput(this, 'FunctionArn', { value: fn.functionArn });
  }
}

class DockerStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new docker.DockerImageAsset(this, 'image', {
      directory: path.join(__dirname, 'docker')
    });
  }
}

const VPC_TAG_NAME = 'custom-tag';
const VPC_TAG_VALUE = 'bazinga!';

class DefineVpcStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new ec2.Vpc(this, 'VPC', {
      maxAzs: 1,
    }).node.applyAspect(new cdk.Tag(VPC_TAG_NAME, VPC_TAG_VALUE));
  }
}

class ImportVpcStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
    ec2.Vpc.fromLookup(this, 'ByTag', { tags: { [VPC_TAG_NAME]: VPC_TAG_VALUE } });
  }
}

class ConditionalResourceStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    if (!process.env.NO_RESOURCE) {
      new iam.User(this, 'User');
    }
  }
}

const stackPrefix = process.env.STACK_NAME_PREFIX || 'cdk-toolkit-integration';

const app = new cdk.App();

const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

// Deploy all does a wildcard ${stackPrefix}-test-*
new MyStack(app, `${stackPrefix}-test-1`, { env: defaultEnv });
new YourStack(app, `${stackPrefix}-test-2`);
// Not included in wildcard
new IamStack(app, `${stackPrefix}-iam-test`);
const providing = new ProvidingStack(app, `${stackPrefix}-order-providing`);
new ConsumingStack(app, `${stackPrefix}-order-consuming`, { providingStack: providing });

new MissingSSMParameterStack(app, `${stackPrefix}-missing-ssm-parameter`, { env: defaultEnv });

new LambdaStack(app, `${stackPrefix}-lambda`);
new DockerStack(app, `${stackPrefix}-docker`);

if (process.env.ENABLE_VPC_TESTING) { // Gating so we don't do context fetching unless that's what we are here for
  const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };
  if (process.env.ENABLE_VPC_TESTING === 'DEFINE')
    new DefineVpcStack(app, `${stackPrefix}-define-vpc`, { env });
  if (process.env.ENABLE_VPC_TESTING === 'IMPORT')
  new ImportVpcStack(app, `${stackPrefix}-import-vpc`, { env });
}

new ConditionalResourceStack(app, `${stackPrefix}-conditional-resource`)

app.synth();
