import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as ecr from '../lib';

/**
 * Stack verification steps:
 * 1. CREDENTIALS=`aws sts assume-role --role-arn <role-arn> --role-session-name aws-ecr-public-repo-integ`
 * 2. export AWS_ACCESS_KEY_ID=`echo ${CREDENTIALS} | jq -r '.Credentials.AccessKeyId'`
 * 3. export AWS_SECRET_ACCESS_KEY=`echo ${CREDENTIALS} | jq -r '.Credentials.SecretAccessKey'`
 * 4. export AWS_SESSION_TOKEN=`echo ${CREDENTIALS} | jq -r '.Credentials.SessionToken'`
 * 5. echo 'FROM alpine\nCMD ["echo", "Hello World!"]' > Dockerfile
 * 6. docker build -t hello:latest .
 * 7. aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
 * 8. docker tag hello:latest public.ecr.aws/<registry-alias>/<repo-name>
 * 9. docker push public.ecr.aws/<registry-alias>/<repo-name>
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-public-repo-integ-stack', { env: { region: 'us-east-1' } });

const repo = new ecr.PublicRepository(stack, 'PublicRepo', {
  description: 'Some description',
  about: 'Some about',
  usage: 'Some usage',
  operatingSystems: [ecr.OperatingSystem.LINUX],
  architectures: [ecr.Architecture.ARM_64, new ecr.Architecture('x8086')],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const role = new iam.Role(stack, 'TestPushRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});

repo.grantPush(role);

app.synth();
