import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3files from '../../lib';

/**
 * Produces an access point and exports its ARN.
 */
class AccessPointSourceStack extends core.Stack {
  public readonly accessPoint: s3files.AccessPoint;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
    const bucket = new s3.Bucket(this, 'Bucket', {
      versioned: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const fileSystem = new s3files.FileSystem(this, 'FileSystem', {
      bucket,
      vpcConfiguration: {
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.accessPoint = fileSystem.addAccessPoint('AccessPoint', { path: '/data' });
  }
}

interface AccessPointConsumerStackProps extends core.StackProps {
  readonly accessPointArn: string;
}

/**
 * Imports the access point by its (cross-stack, tokenized) ARN and re-exports
 * the parsed id so the assertion can verify it resolves correctly.
 */
class AccessPointConsumerStack extends core.Stack {
  constructor(scope: Construct, id: string, props: AccessPointConsumerStackProps) {
    super(scope, id, props);

    const imported = s3files.AccessPoint.fromAccessPointAttributes(this, 'Imported', {
      accessPointArn: props.accessPointArn,
    });

    new core.CfnOutput(this, 'ImportedAccessPointId', {
      value: imported.accessPointId,
    });
  }
}

const app = new core.App();

const source = new AccessPointSourceStack(app, 'S3FilesApSourceStack');
const consumer = new AccessPointConsumerStack(app, 'S3FilesApConsumerStack', {
  accessPointArn: source.accessPoint.accessPointArn,
});
consumer.addDependency(source);

new IntegTest(app, 'S3FilesAccessPointImportIntegTest', {
  testCases: [source, consumer],
});

app.synth();
