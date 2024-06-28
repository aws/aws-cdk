/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Fn, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ssm from 'aws-cdk-lib/aws-ssm';

class EksClusterStack extends Stack {

  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1, restrictDefaultSecurityGroup: false });

    const versionConfig = getClusterVersionConfig(this);
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      ...versionConfig,
      defaultCapacity: 0,
    });

    const ssmParameterName = `/aws/service/eks/optimized-ami/${versionConfig.version.version}/amazon-linux-2/recommended/image_id`;
    const ami = ssm.StringParameter.valueForTypedStringParameterV2(this, ssmParameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
    const launchTemplate = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
      launchTemplateData: {
        imageId: ami,
        userData: Fn.base64(`MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"

#!/bin/bash
set -ex
/etc/eks/bootstrap.sh ${cluster.clusterName} \\
  --b64-cluster-ca ${cluster.clusterCertificateAuthorityData} \\
  --apiserver-endpoint ${cluster.clusterEndpoint} \\
  --dns-cluster-ip 172.20.0.10 \\
  --kubelet-extra-args '--max-pods=11' \\
  --use-max-pods false

--==MYBOUNDARY==--
`),
      },
    });

    cluster.addNodegroupCapacity('CustomNodegroup', {
      instanceTypes: [new ec2.InstanceType('t3.small')],
      amiType: eks.NodegroupAmiType.CUSTOM,
      launchTemplateSpec: {
        id: launchTemplate.ref,
        version: launchTemplate.attrLatestVersionNumber,
      },
    });
  }
}

const app = new App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-custom-nodegroup');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-custom-nodegroup-integ', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});
app.synth();
