import * as path from 'path';
import { App, DockerImage, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.GoFunction(this, 'go-handler-docker', {
      entry: path.join(__dirname, 'lambda-handler-vendor/cmd/api'),
      bundling: {
        dockerImage: DockerImage.fromBuild(path.join(__dirname, '../lib'), {
          buildArgs: {
            IMAGE: 'public.ecr.aws/bitnami/golang:1.16.3-debian-10-r16',
          },
        }),
        forcedDockerBundling: true,
        goBuildFlags: ['-mod=readonly', '-ldflags "-s -w"'],
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-golang');
app.synth();
