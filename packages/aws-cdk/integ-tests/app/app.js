const cdk = require('@aws-cdk/cdk');
const sns = require('@aws-cdk/aws-sns');

class MyStack extends cdk.Stack {
  constructor(parent, id) {
    super(parent, id);
    new sns.Topic(this, 'topic');

    console.log(new cdk.AvailabilityZoneProvider(this).availabilityZones);
    console.log(new cdk.SSMParameterProvider(this, { parameterName: '/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2' }).parameterValue(''));
  }
}

class YourStack extends cdk.Stack {
  constructor(parent, id) {
    super(parent, id);
    new sns.Topic(this, 'topic1');
    new sns.Topic(this, 'topic2');
  }
}

const app = new cdk.App();

new MyStack(app, 'cdk-toolkit-integration-test-1');
new YourStack(app, 'cdk-toolkit-integration-test-2');

app.run();
