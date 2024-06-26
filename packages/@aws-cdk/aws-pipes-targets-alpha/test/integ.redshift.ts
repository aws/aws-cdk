import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { Cluster, ClusterType, NodeType } from '@aws-cdk/aws-redshift-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RedshiftTarget } from '../lib/redshift';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-redshift');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: true,
});
// not recommended, only for integration test
sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5439), 'Ingress from Internet');

const targetCluster = new Cluster(stack, 'MyCluster', {
  clusterName: 'my-cluster',
  masterUser: { masterUsername: 'admin' },
  nodeType: NodeType.DC2_LARGE,
  clusterType: ClusterType.SINGLE_NODE,
  publiclyAccessible: true, // not recommended, only for integration test
  vpc,
  securityGroups: [sg],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;

  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }

  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }

  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new RedshiftTarget(targetCluster, {
    database: 'default_db',
    secretManagerArn: targetCluster.secret?.secretArn,
    sqls: ['SHOW SCHEMAS FROM DATABASE default_db;'],
    statementName: 'my_test_query',
  }),
});

const test = new IntegTest(app, 'integtest-pipe-target-redshift', {
  testCases: [stack],
});

test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: 'OmahaNebraska',
});

// It's nontrivial to fetch the query results.
// Manual verification was done to ensure the query ran.

app.synth();
