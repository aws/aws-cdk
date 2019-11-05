import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codedeploy = require('../../lib');
import { EcsDeploymentConfig } from '../../lib';

export = {
  "CodeDeploy ECS DeploymentGroup": {
    'imported with fromEcsDeploymentGroupAttributes': {
      'defaults the Deployment Config to AllAtOnce'(test: Test) {
        const stack = new cdk.Stack();

        const ecsApp = codedeploy.EcsApplication.fromEcsApplicationName(stack, 'EA', 'EcsApplication');
        const importedGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'EDG', {
          application: ecsApp,
          deploymentGroupName: 'EcsDeploymentGroup',
        });

        test.equal(importedGroup.deploymentConfig, EcsDeploymentConfig.ALL_AT_ONCE);

        test.done();
      },
    },
  },
};
