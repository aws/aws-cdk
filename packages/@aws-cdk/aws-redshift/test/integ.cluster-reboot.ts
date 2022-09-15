import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import * as redshift from '../lib';

const app = new cdk.App();


interface RedshiftRebootStackProps extends cdk.StackProps {
  parameterGroupParams: { [name: string]: string },
}

const requiredStackName: Partial<cdk.StackProps> = {
  stackName: 'aws-cdk-redshift-cluster-reboot-integ',
};

class RedshiftRebootStack extends cdk.Stack {

  readonly cluster: redshift.Cluster;
  readonly parameterGroup: redshift.ClusterParameterGroup;

  constructor(scope: constructs.Construct, id: string, props: RedshiftRebootStackProps) {
    props = { ...props, ...requiredStackName };
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'Vpc', {
      subnetConfiguration: [{
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        name: 'foobar',
      }],
    });
    this.parameterGroup = new redshift.ClusterParameterGroup(this, 'ParameterGroup', {
      parameters: props.parameterGroupParams,
    });
    this.cluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      parameterGroup: this.parameterGroup,
      rebootForParameterChanges: true,
    });
  }
}

const createStack = new RedshiftRebootStack(app, 'aws-cdk-redshift-cluster-create', {
  parameterGroupParams: { enable_user_activity_logging: 'true' },
});

const updateStack = new RedshiftRebootStack(app, 'aws-cdk-redshift-cluster-update', {
  parameterGroupParams: { enable_user_activity_logging: 'false', use_fips_ssl: 'true' },
});

updateStack.addDependency(createStack);
const stacks = [createStack, updateStack];
stacks.forEach(s => {
  cdk.Aspects.of(s).add({
    visit(node: constructs.IConstruct) {
      if (cdk.CfnResource.isCfnResource(node)) {
        node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      }
    },
  });
});

const test = new integ.IntegTest(app, 'aws-cdk-redshift-reboot-test', {
  testCases: stacks,
  stackUpdateWorkflow: true,
  diffAssets: true,
});

const describeCluster = test.assertions.awsApiCall('Redshift', 'describeClusters', {
  ClusterIdentifier: updateStack.cluster.clusterName,
});

describeCluster.expect(integ.ExpectedResult.objectLike(
  {
    ParameterGroupName: updateStack.parameterGroup.clusterParameterGroupName,
    ParameterApplyStatus: 'in-sync',
  },
));

const describeParams = test.assertions.awsApiCall('Redshift', 'describeClusterParameters', {
  ParameterGroupName: updateStack.parameterGroup.clusterParameterGroupName,
});

describeParams.expect(integ.ExpectedResult.arrayWith([
  integ.ExpectedResult.objectLike(
    {
      ParameterName: 'enable_user_activity_logging',
      ParameterValue: 'false',
    },
  ),
  integ.ExpectedResult.objectLike(
    {
      ParameterName: 'use_fips_ssl',
      ParameterValue: 'true',
    },
  ),
]));

app.synth();
