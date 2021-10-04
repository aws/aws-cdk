import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

describe('CodeDeploy ECS DeploymentGroup', () => {
  describe('imported with fromEcsDeploymentGroupAttributes', () => {
    test('defaults the Deployment Config to AllAtOnce', () => {
      const stack = new cdk.Stack();

      const ecsApp = codedeploy.EcsApplication.fromEcsApplicationName(stack, 'EA', 'EcsApplication');
      const importedGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'EDG', {
        application: ecsApp,
        deploymentGroupName: 'EcsDeploymentGroup',
      });

      expect(importedGroup.deploymentConfig).toEqual(codedeploy.EcsDeploymentConfig.ALL_AT_ONCE);
    });
  });
});
