/* eslint-disable import/no-extraneous-dependencies */
import * as aws from 'aws-sdk';
import { compareLoggingProps } from '../../lib/aws-eks/cluster-resource-handler/compareLogging';

/**
 * EKS cluster logging types
 */
enum ClusterLoggingTypes {
  /**
   * Logs pertaining to API requests to the cluster.
   */
  API = 'api',
  /**
   * Logs pertaining to cluster access via the Kubernetes API.
   */
  AUDIT = 'audit',
  /**
   * Logs pertaining to authentication requests into the cluster.
   */
  AUTHENTICATOR = 'authenticator',
  /**
   * Logs pertaining to state of cluster controllers.
   */
  CONTROLLER_MANAGER = 'controllerManager',
  /**
   * Logs pertaining to scheduling decisions.
   */
  SCHEDULER = 'scheduler',
}

describe('compareLoggingProps', () => {

  type Props = Partial<aws.EKS.CreateClusterRequest>;
  const oldEnabledTypes: aws.EKS.LogTypes = [ClusterLoggingTypes.API, ClusterLoggingTypes.AUDIT];

  test('when newProps.logging.clusterLogging is undefined, should disable all types with enabled:true in oldProps', () => {
    const oldProps: Props = {
      logging: {
        clusterLogging: [{ types: oldEnabledTypes, enabled: true }],
      },
    };

    const newProps: Props = {
      logging: {},
    };

    const result = compareLoggingProps(oldProps, newProps);

    expect(result.logging?.clusterLogging).toEqual([{ types: oldEnabledTypes, enabled: false }]);
  });

  test('when newProps.logging is undefined, should disable all types with enabled:true in oldProps', () => {
    const oldProps: Props = {
      logging: {
        clusterLogging: [{ types: oldEnabledTypes, enabled: true }],
      },
    };

    const newProps: Props = {};

    const result = compareLoggingProps(oldProps, newProps);

    expect(result.logging?.clusterLogging).toEqual([{ types: oldEnabledTypes, enabled: false }]);
  });

  test('should disable types with enabled:true but not defined as enabled:true in newProps', () => {
    const oldProps: Props = {
      logging: {
        clusterLogging: [{ types: oldEnabledTypes, enabled: true }],
      },
    };

    const newProps: Props = {
      logging: {
        clusterLogging: [{ types: [ClusterLoggingTypes.AUDIT], enabled: true }],
      },
    };

    const result = compareLoggingProps(oldProps, newProps);

    expect(result.logging?.clusterLogging).toEqual([{ types: [ClusterLoggingTypes.AUDIT], enabled: true },
      { types: [ClusterLoggingTypes.API], enabled: false }]);
  });

  test('when oldProps.logging.clusterLogging is undefined and newProps.logging.clusterLogging is undefined, result should be newProps', () => {
    const oldProps: Props = {
      logging: {},
    };

    const newProps: Props = {
      logging: {},
    };

    const result = compareLoggingProps(oldProps, newProps);

    expect(result).toEqual(newProps);
  });

  test('multiple enabled:true types in oldProps with clusterLogging undefined in newProps should all be disabled', () => {
    const oldProps: Props = {
      logging: {
        clusterLogging: [{ types: oldEnabledTypes, enabled: true }],
      },
    };

    const newProps: Props = {
      logging: {},
    };

    const result = compareLoggingProps(oldProps, newProps);

    expect(result.logging?.clusterLogging).toEqual([{ types: oldEnabledTypes, enabled: false }]);
  });

});