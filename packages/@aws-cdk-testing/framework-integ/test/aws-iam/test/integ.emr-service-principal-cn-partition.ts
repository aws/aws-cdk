/**
 * To run this test case, you need to have an account created in CN partition.
 *
 * Get a subnet id from your account and set it in env variable SUBNET_ID.
 * Example:
 * export SUBNET_ID=subnet-xxxxxx
 *
 * Run this test case by running the following command
 * yarn integ test/aws-iam/test/integ.emr-service-principal-cn-partition.js --update-on-failed --parallel-regions cn-north-1
 */
import * as cdk from 'aws-cdk-lib';
import * as emr from 'aws-cdk-lib/aws-emr';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

class EmrServicePrincipalTestStack extends cdk.Stack {
  cluster: emr.CfnCluster;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const subnetId = process.env.SUBNET_ID ?? process.env.CDK_INTEG_SUBNET_ID;
    if (!subnetId) {
      throw new Error('Env vars SUBNET_ID must be set');
    }

    const emrServiceRole = new iam.Role(this, 'EMRServiceRole', {
      assumedBy: iam.ServicePrincipal.fromStaticServicePrincipleName('elasticmapreduce.amazonaws.com.cn'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonElasticMapReduceRole'),
      ],
    });

    const emrJobFlowRole = new iam.Role(this, 'EMRJobFlowRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonElasticMapReduceforEC2Role'),
      ],
    });

    const emrJobFlowProfile = new iam.CfnInstanceProfile(this, 'EMRJobFlowProfile', {
      roles: [emrJobFlowRole.roleName],
      instanceProfileName: 'EMRJobFlowProfile_',
    });

    const sshKey = new ec2.CfnKeyPair(this, 'SSHKey', {
      keyName: 'TestingSSHKey',
    });

    this.cluster = new emr.CfnCluster(this, 'EMRCluster', {
      name: 'My first cluster',
      instances: {
        coreInstanceGroup: {
          instanceCount: 1,
          instanceType: 'm5.xlarge',
        },
        ec2SubnetId: subnetId,
        hadoopVersion: 'Amazon',
        keepJobFlowAliveWhenNoSteps: false,
        ec2KeyName: sshKey.ref,
        terminationProtected: false,
        masterInstanceGroup: {
          instanceCount: 1,
          instanceType: 'm5.xlarge',
        },
      },
      jobFlowRole: emrJobFlowProfile.ref,
      applications: [
        { name: 'Spark' },
      ],
      serviceRole: emrServiceRole.roleName,
      releaseLabel: 'emr-6.4.0',
    });
  }
}

const region = 'cn-north-1';

const app = new cdk.App();
const testingStack = new EmrServicePrincipalTestStack(app, 'EmrServicePrincipalTestingStack', {
  env: {
    region: region,
  },
});

const assertionStack = new cdk.Stack(app, 'EmrServicePrincipalAssertionStack', {
  env: {
    region: region,
  },
});

const test = new IntegTest(app, 'EmrServicePrincipalIntegTesting', {
  testCases: [testingStack],
  regions: [region],
  assertionStack: assertionStack,
});

test.assertions.awsApiCall('Emr', 'ListInstances', {
  ClusterId: testingStack.cluster.ref,
  InstanceGroupTypes: ['MASTER', 'CORE'],
}).assertAtPath(
  'Instances.0.Ec2InstanceId',
  ExpectedResult.stringLikeRegexp('.+'),
);

app.synth();
