import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-secret-json-field');

const secret = new secretsmanager.Secret(stack, 'Secret', {
  generateSecretString: {
    generateStringKey: 'password',
    secretStringTemplate: JSON.stringify({ username: 'user' }),
  },
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
  secrets: {
    PASSWORD: ecs.Secret.fromSecretsManager(secret, 'password'),
  },
});

container.addSecret('APIKEY', ecs.Secret.fromSecretsManager(secret, 'apikey'));

new integ.IntegTest(app, 'aws-ecs-ec2-integ-secret-json-field', {
  testCases: [stack],
});

app.synth();
