import * as integ from '@aws-cdk/integ-tests-alpha';
import { Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as constructs from 'constructs';
import * as redshift from '../lib';

/**
 * This test does the following
 *
 * 1. Creates a stack with a Redshift cluster.
 * 2. Creates a second stack with the same name to update the parameter group and cause the custom resource to run.
 *
 * The diff assets flag (used when testing custom resources) has been commented out due to snapshots not properly verifying in CodeBuild.
 */

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
      restrictDefaultSecurityGroup: false,
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
  stackUpdateWorkflow: false,
  diffAssets: false,
});

const describeClusters = test.assertions.awsApiCall('Redshift', 'describeClusters', { ClusterIdentifier: updateStack.cluster.clusterName });
describeClusters.assertAtPath('Clusters.0.ClusterParameterGroups.0.ParameterGroupName', integ.ExpectedResult.stringLikeRegexp(updateStack.parameterGroup.clusterParameterGroupName));
describeClusters.assertAtPath('Clusters.0.ClusterParameterGroups.0.ParameterApplyStatus', integ.ExpectedResult.stringLikeRegexp('in-sync'));

const describeUserParams = test.assertions.awsApiCall('Redshift', 'describeClusterParameters',
  {
    ParameterGroupName: updateStack.parameterGroup.clusterParameterGroupName,
    Source: 'user',
  },
);
describeUserParams.expect(integ.ExpectedResult.objectLike({
  Parameters: Match.arrayWith([
    Match.objectLike({ ParameterName: 'enable_user_activity_logging', ParameterValue: 'false' }),
    Match.objectLike({ ParameterName: 'use_fips_ssl', ParameterValue: 'true' }),
  ]),
}));

const describeEngineDefaultParams = test.assertions.awsApiCall('Redshift', 'describeClusterParameters',
  {
    ParameterGroupName: updateStack.parameterGroup.clusterParameterGroupName,
    Source: 'engine-default',
  },
);
describeEngineDefaultParams.expect(integ.ExpectedResult.objectLike({
  Parameters: Match.arrayWith([
    Match.objectLike({ ParameterName: 'auto_analyze', ParameterValue: 'true' }),
    Match.objectLike({ ParameterName: 'auto_mv', ParameterValue: 'true' }),
    Match.objectLike({ ParameterName: 'datestyle', ParameterValue: 'ISO, MDY' }),
    Match.objectLike({ ParameterName: 'enable_case_sensitive_identifier', ParameterValue: 'false' }),
    Match.objectLike({ ParameterName: 'extra_float_digits', ParameterValue: '0' }),
    Match.objectLike({ ParameterName: 'max_concurrency_scaling_clusters', ParameterValue: '1' }),
    Match.objectLike({ ParameterName: 'max_cursor_result_set_size', ParameterValue: 'default' }),
    Match.objectLike({ ParameterName: 'query_group', ParameterValue: 'default' }),
    Match.objectLike({ ParameterName: 'require_ssl', ParameterValue: 'false' }),
    Match.objectLike({ ParameterName: 'search_path', ParameterValue: '$user, public' }),
    Match.objectLike({ ParameterName: 'statement_timeout', ParameterValue: '0' }),
    Match.objectLike({ ParameterName: 'wlm_json_configuration', ParameterValue: '[{"auto_wlm":true}]' }),
  ]),
}));

app.synth();
