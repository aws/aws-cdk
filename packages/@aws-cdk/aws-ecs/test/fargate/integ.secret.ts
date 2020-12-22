import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-secret');

const secret = new secretsmanager.Secret(stack, 'Secret', {
  generateSecretString: {
    generateStringKey: 'password',
    secretStringTemplate: JSON.stringify({ username: 'user' }),
  },
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  secrets: {
    SECRET: ecs.Secret.fromSecretsManager(secret),
    PASSWORD: ecs.Secret.fromSecretsManager(secret, 'password'),
  },
});

app.synth();
