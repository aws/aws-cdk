import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import { DatabaseCluster, DatabaseClusterEngine } from '../lib';
import { ClusterParameterGroup } from '../lib/cluster-parameter-group';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC', { maxAZs: 2 });

const params = new ClusterParameterGroup(stack, 'Params', {
  family: 'aurora5.6',
  description: 'A nice parameter group',
});
params.setParameter('character_set_database', 'utf8mb4');

const kmsKey = new kms.EncryptionKey(stack, 'DbSecurity');
const cluster = new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.Aurora,
  masterUser: {
    username: 'admin',
    password: '7959866cacc02c2d243ecfe177464fe6',
  },
  instanceProps: {
    instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
    vpcSubnets: { subnetTypes: [ec2.SubnetType.Public] },
    vpc
  },
  parameterGroup: params,
  kmsKey,
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.run();
