#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as custom from 'aws-cdk-lib/custom-resources';
import { RegionInfo } from 'aws-cdk-lib/region-info';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const appName = 'MyApplication';

    const s3bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const asset = new s3assets.Asset(this, 'Asset', {
      path: `${__dirname}/integ.elastic-beanstalk-environment-target-assets`,
    });
    asset.node.addDependency(s3bucket);

    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName,
    });

    const appVersion = new elasticbeanstalk.CfnApplicationVersion(this, 'ApplicationVersion', {
      applicationName: appName,
      sourceBundle: {
        s3Bucket: asset.s3BucketName,
        s3Key: asset.s3ObjectKey,
      },
    });
    appVersion.node.addDependency(app);
    appVersion.node.addDependency(asset);

    const instanceRole = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier');
    instanceRole.addManagedPolicy(managedPolicy);

    const instanceProfile = `${appName}-aws-elasticbeanstalk-ec2-instance-profile`;
    new iam.CfnInstanceProfile(this, instanceProfile, {
      instanceProfileName: instanceProfile,
      roles: [instanceRole.roleName],
    });

    const optionSettingProperties: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: instanceProfile,
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MinSize',
        value: '1',
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MaxSize',
        value: '1',
      },
      {
        namespace: 'aws:ec2:instances',
        optionName: 'InstanceTypes',
        value: 't3.micro',
      },
    ];

    const eb = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      applicationName: appName,
      solutionStackName: '64bit Amazon Linux 2023 v6.4.3 running Node.js 20',
      environmentName: 'MyEnvironment',
      optionSettings: optionSettingProperties,
      versionLabel: appVersion.ref,
    });
    eb.node.addDependency(app);

    var getEnvironmentUrl = new custom.AwsCustomResource(this, 'GetEnvironmentUrl', {
      onCreate: {
        service: 'ElasticBeanstalk',
        action: 'describeEnvironments',
        parameters: {
          EnvironmentNames: [cdk.Token.asString(eb.environmentName)],
        },
        physicalResourceId: custom.PhysicalResourceId.of('EnvironmentUrl'),
        logging: custom.Logging.withDataHidden(),
      },
      policy: custom.AwsCustomResourcePolicy.fromSdkCalls({ resources: custom.AwsCustomResourcePolicy.ANY_RESOURCE }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    getEnvironmentUrl.node.addDependency(eb);

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'test.public',
    });

    const aliastWithoutHealthCheck = new route53.ARecord(this, 'Alias', {
      zone,
      recordName: 'without-health-check',
      target: route53.RecordTarget.fromAlias(
        new targets.ElasticBeanstalkEnvironmentEndpointTarget('http://placeholder.placeholder.us-east-1.elasticbeanstalk.com'),
      ),
    });
    aliastWithoutHealthCheck.node.addDependency(getEnvironmentUrl);
    (aliastWithoutHealthCheck.node.defaultChild as route53.CfnRecordSet).aliasTarget = {
      hostedZoneId: RegionInfo.get('us-east-1').ebsEnvEndpointHostedZoneId,
      dnsName: getEnvironmentUrl.getResponseField('Environments.0.CNAME'),
    } as route53.CfnRecordSet.AliasTargetProperty;

    const aliasWithHealthCheck = new route53.ARecord(this, 'AliasWithHealthCheck', {
      zone,
      recordName: 'with-health-check',
      target: route53.RecordTarget.fromAlias(
        new targets.ElasticBeanstalkEnvironmentEndpointTarget('http://placeholder.placeholder.us-east-1.elasticbeanstalk.com', {
          evaluateTargetHealth: true,
        }),
      ),
    });
    aliasWithHealthCheck.node.addDependency(getEnvironmentUrl);
    (aliasWithHealthCheck.node.defaultChild as route53.CfnRecordSet).aliasTarget = {
      hostedZoneId: RegionInfo.get('us-east-1').ebsEnvEndpointHostedZoneId,
      dnsName: getEnvironmentUrl.getResponseField('Environments.0.CNAME'),
      evaluateTargetHealth: true,
    } as route53.CfnRecordSet.AliasTargetProperty;
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'aws-cdk-elasticbeanstalk-integ');

new IntegTest(app, 'aws-cdk-elasticbeanstalk-integ-test', {
  testCases: [testCase],
  regions: ['us-east-1'],
});
