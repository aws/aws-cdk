import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Cross-account secret (simulated)
    const secret = secretsmanager.Secret.fromSecretAttributes(this, 'CrossAccountSecret', {
      secretCompleteArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:cross-account-secret-abcdef',
    });

    // ECS task execution role
    const role = new iam.Role(this, 'EcsTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    // Grant read access - should trigger fallback logic
    secret.grantRead(role);
  }
}

const app = new cdk.App();
new TestStack(app, 'cdk-integ-cross-account-secret-grants');
app.synth();
