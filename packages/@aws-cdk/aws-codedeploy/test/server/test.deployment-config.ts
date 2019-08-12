import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codedeploy = require('../../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'CodeDeploy DeploymentConfig': {
    "can be created by specifying only minHealthyHostCount"(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
        minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentConfig', {
        "MinimumHealthyHosts": {
          "Type": "HOST_COUNT",
          "Value": 1,
        },
      }));

      test.done();
    },

    "can be created by specifying only minHealthyHostPercentage"(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
        minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentConfig', {
        "MinimumHealthyHosts": {
          "Type": "FLEET_PERCENT",
          "Value": 75,
        },
      }));

      test.done();
    },

    'can be imported'(test: Test) {
      const stack = new cdk.Stack();

      const deploymentConfig = codedeploy.ServerDeploymentConfig.fromServerDeploymentConfigName(stack, 'MyDC', 'MyDC');

      test.notEqual(deploymentConfig, undefined);

      test.done();
    },
  },
};
