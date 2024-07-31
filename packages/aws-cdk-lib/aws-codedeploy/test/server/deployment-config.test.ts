import { Template } from '../../../assertions';
import * as cdk from '../../../core';
import * as codedeploy from '../../lib';

/* eslint-disable quote-props */

describe('CodeDeploy DeploymentConfig', () => {
  test('can be created by specifying only minHealthyHostCount', () => {
    const stack = new cdk.Stack();

    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'MinimumHealthyHosts': {
        'Type': 'HOST_COUNT',
        'Value': 1,
      },
    });
  });

  test('can be created by specifying only minHealthyHostPercentage', () => {
    const stack = new cdk.Stack();

    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
      'MinimumHealthyHosts': {
        'Type': 'FLEET_PERCENT',
        'Value': 75,
      },
    });
  });

  test('can be imported', () => {
    const stack = new cdk.Stack();

    const deploymentConfig = codedeploy.ServerDeploymentConfig.fromServerDeploymentConfigName(stack, 'MyDC', 'MyDC');

    expect(deploymentConfig).not.toEqual(undefined);
  });

  test('fail with more than 100 characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
      deploymentConfigName: 'a'.repeat(101),
    });

    expect(() => app.synth()).toThrow(`Deployment config name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
  });

  test('fail with unallowed characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
      minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
      deploymentConfigName: 'my name',
    });

    expect(() => app.synth()).toThrow('Deployment config name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
  });

  describe('zonal configuration', () => {
    test('default value', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app);
      new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
        minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
        zonalConfig: {},
      });

      Template.fromStack(stack).hasResourceProperties(
        'AWS::CodeDeploy::DeploymentConfig', {
          'ZonalConfig': {},
        },
      );
    });

    test('configure optional properties', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app);
      new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
        minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
        zonalConfig: {
          monitorDuration: cdk.Duration.minutes(10),
          firstZoneMonitorDuration: cdk.Duration.hours(1),
          minimumHealthyHostsPerZone: codedeploy.MinimumHealthyHostsPerZone.count(2),
        },
      });

      Template.fromStack(stack).hasResourceProperties(
        'AWS::CodeDeploy::DeploymentConfig', {
          'ZonalConfig': {
            MonitorDurationInSeconds: 600,
            FirstZoneMonitorDurationInSeconds: 3600,
            MinimumHealthyHostsPerZone: {
              Type: 'HOST_COUNT',
              Value: 2,
            },
          },
        },
      );
    });

    test('throw error for invalid monitorDuration', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app);
      expect(() => {
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
          minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
          zonalConfig: {
            monitorDuration: cdk.Duration.millis(500),
          },
        });
      }).toThrow('monitorDuration must be greater than or equal to 1 second or be equal to 0, got 500ms');
    });

    test('throw error for invalid firstZoneMonitorDuration', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app);
      expect(() => {
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
          minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
          zonalConfig: {
            firstZoneMonitorDuration: cdk.Duration.millis(500),
          },
        });
      }).toThrow('firstZoneMonitorDuration must be greater than or equal to 1 second or be equal to 0, got 500ms');
    });
  });
});
