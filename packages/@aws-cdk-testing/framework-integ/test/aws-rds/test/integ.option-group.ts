import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import {
  DatabaseInstanceEngine,
  OptionGroup,
  OracleEngineVersion,
} from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class OptionGroupTestStack extends IntegTestBaseStack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const optionGroup = new OptionGroup(this, 'OptionGroup', {
      engine: DatabaseInstanceEngine.oracleSe2({
        version: OracleEngineVersion.VER_19,
      }),
      description: 'Custom Option Grouptest',
      optionGroupName: 'custom-og-name',
      configurations: [
        {
          name: 'OEM',
          port: 1158,
          vpc,
        },
      ],
    });
    optionGroup.optionConnections.OEM.connections.allowDefaultPortFrom(
      ec2.Peer.ipv4('10.0.0.0/16'),
    );
  }
}

const app = new cdk.App();
const stack = new OptionGroupTestStack(app, 'aws-rds-option-group');
new IntegTest(app, 'OptionGroupTest', {
  testCases: [stack],
});
