/// !cdk-integ cdk-route53-ebs-hostedzoneid-integ
import { App, Stack, Token } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as custom from 'aws-cdk-lib/custom-resources';
import { RegionInfo } from 'aws-cdk-lib/region-info';

const app = new App();
const stack = new Stack(app, 'cdk-route53-ebs-hostedzoneid-integ');

const zone = new route53.PublicHostedZone(stack, 'HostedZone', {
  zoneName: 'test.public',
});

const applicationName = 'MyTestApplication';

const ebsApp = new elasticbeanstalk.CfnApplication(stack, 'Application', {
  applicationName,
});

const instanceRole = new iam.Role(stack, `${applicationName}-aws-elasticbeanstalk-ec2-role`, {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
});

instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));
instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy'));

const instanceProfileName = `${applicationName}-aws-elasticbeanstalk-ec2-instance-profile`;
new iam.CfnInstanceProfile(stack, instanceProfileName, {
  instanceProfileName: instanceProfileName,
  roles: [instanceRole.roleName],
});

const optionSettings: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] = [
  {
    namespace: 'aws:autoscaling:launchconfiguration',
    optionName: 'IamInstanceProfile',
    value: instanceProfileName,
  },
  {
    namespace: 'aws:autoscaling:launchconfiguration',
    optionName: 'RootVolumeType',
    value: 'gp3',
  },
  {
    namespace: 'aws:ec2:instances',
    optionName: 'InstanceTypes',
    value: 't3.micro',
  },
  {
    namespace: 'aws:elasticbeanstalk:environment',
    optionName: 'EnvironmentType',
    value: 'SingleInstance',
  },
];

const ebsEnv = new elasticbeanstalk.CfnEnvironment(stack, 'Environment', {
  applicationName,
  solutionStackName: '64bit Amazon Linux 2023 v6.5.0 running Node.js 22',
  optionSettings,
});
ebsEnv.addDependency(ebsApp);

const getEnvironmentUrl = new custom.AwsCustomResource(stack, 'GetEnvironmentUrl', {
  onCreate: {
    service: 'ElasticBeanstalk',
    action: 'describeEnvironments',
    parameters: {
      EnvironmentNames: [Token.asString(ebsEnv.environmentName)],
    },
    physicalResourceId: custom.PhysicalResourceId.of('EnvironmentUrl'),
    logging: custom.Logging.withDataHidden(),
  },
  policy: custom.AwsCustomResourcePolicy.fromSdkCalls({ resources: custom.AwsCustomResourcePolicy.ANY_RESOURCE }),
});
getEnvironmentUrl.node.addDependency(ebsEnv);

new route53.ARecord(stack, 'AliasRecord', {
  zone,
  recordName: 'test',
  target: route53.RecordTarget.fromAlias(new targets.ElasticBeanstalkEnvironmentEndpointTarget(getEnvironmentUrl.getResponseField('Environments.0.CNAME'), {
    hostedZoneId: RegionInfo.get('us-east-1').ebsEnvEndpointHostedZoneId,
  })),
});

new IntegTest(app, 'cdk-route53-ebs-hostedzoneid-integ-test', {
  testCases: [stack],
});
