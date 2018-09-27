import { expect, haveResource } from '@aws-cdk/assert';
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codedeploy = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'CodeDeploy Deployment Group': {
    "can be created by explicitly passing an Application"(test: Test) {
      const stack = new cdk.Stack();

      const application = new codedeploy.ServerApplication(stack, 'MyApp');
      new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
        application,
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "ApplicationName": {
          "Ref": "MyApp3CE31C26"
        },
      }));

      test.done();
    },

    'can be imported'(test: Test) {
      const stack = new cdk.Stack();

      const application = codedeploy.ServerApplicationRef.import(stack, 'MyApp', {
        applicationName: 'MyApp',
      });
      const deploymentGroup = codedeploy.ServerDeploymentGroupRef.import(stack, 'MyDG', {
        application,
        deploymentGroupName: 'MyDG',
      });

      test.notEqual(deploymentGroup, undefined);

      test.done();
    },

    "created with ASGs contains the ASG names"(test: Test) {
      const stack = new cdk.Stack();

      const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Standard3, ec2.InstanceSize.Small),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc: new ec2.VpcNetwork(stack, 'VPC'),
      });

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        autoScalingGroups: [asg],
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "AutoScalingGroups": [
          {
          "Ref": "ASG46ED3070",
          },
        ]
      }));

      test.done();
    },

    "created without ASGs but adding them later contains the ASG names"(test: Test) {
      const stack = new cdk.Stack();

      const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Standard3, ec2.InstanceSize.Small),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc: new ec2.VpcNetwork(stack, 'VPC'),
      });

      const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup');
      deploymentGroup.addAutoScalingGroup(asg);

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "AutoScalingGroups": [
          {
          "Ref": "ASG46ED3070",
          },
        ]
      }));

      test.done();
    },
  },
};
