#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as custom from 'aws-cdk-lib/custom-resources';
import { RegionInfo } from 'aws-cdk-lib/region-info';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import { SOLUTION_STACK_NAME } from '../../utils/aws-elasticbeanstalk';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // RegionInfo.get() requires a concrete region string at synth time, but stack.region
    // is a Token (AWS::Region) when no explicit env is set. A CfnMapping lets us resolve
    // the EB hosted zone ID at deploy time using Fn::FindInMap with AWS::Region.
    const ebsHostedZoneMapping = new cdk.CfnMapping(this, 'EbsHostedZoneMapping');
    for (const region of RegionInfo.regions) {
      if (region.ebsEnvEndpointHostedZoneId) {
        ebsHostedZoneMapping.setValue(region.name, 'hostedZoneId', region.ebsEnvEndpointHostedZoneId);
      }
    }

    const s3bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const asset = new s3assets.Asset(this, 'Asset', {
      path: `${__dirname}/integ.elastic-beanstalk-environment-target-assets`,
    });
    asset.node.addDependency(s3bucket);

    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {});

    const appVersion = new elasticbeanstalk.CfnApplicationVersion(this, 'ApplicationVersion', {
      applicationName: app.ref,
      sourceBundle: {
        s3Bucket: asset.s3BucketName,
        s3Key: asset.s3ObjectKey,
      },
    });
    appVersion.node.addDependency(app);
    appVersion.node.addDependency(asset);

    const instanceRole = new iam.Role(this, 'EbsEc2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));

    const instanceProfile = new iam.CfnInstanceProfile(this, 'EbsInstanceProfile', {
      roles: [instanceRole.roleName],
    });

    const eb = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      applicationName: app.ref,
      solutionStackName: SOLUTION_STACK_NAME.NODEJS_20,
      optionSettings: [
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: instanceProfile.ref,
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
      ],
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

    const hostedZoneId = ebsHostedZoneMapping.findInMap(cdk.Aws.REGION, 'hostedZoneId');

    const aliastWithoutHealthCheck = new route53.ARecord(this, 'Alias', {
      zone,
      recordName: 'without-health-check',
      target: route53.RecordTarget.fromAlias(
        new targets.ElasticBeanstalkEnvironmentEndpointTarget('http://placeholder.placeholder.us-east-1.elasticbeanstalk.com'),
      ),
    });
    aliastWithoutHealthCheck.node.addDependency(getEnvironmentUrl);
    (aliastWithoutHealthCheck.node.defaultChild as route53.CfnRecordSet).aliasTarget = {
      hostedZoneId,
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
      hostedZoneId,
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
});
