import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-secret-json-field');

const secret = new secretsmanager.Secret(stack, 'Secret', {
  generateSecretString: {
    generateStringKey: 'password',
    secretStringTemplate: JSON.stringify({ username: 'user' }),
  },
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
  secrets: {
    PASSWORD: ecs.Secret.fromSecretsManager(secret, 'password'),
  },
});

app.synth();
