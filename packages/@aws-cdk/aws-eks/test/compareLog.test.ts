import * as aws from 'aws-sdk';
import * as eks from '../lib';
import { compareLoggingProps } from '../lib/cluster-resource-handler/compareLogging';

describe('compareLoggingProps', () => {

  type Props = Partial<aws.EKS.CreateClusterRequest>;
  const oldEnabledTypes: aws.EKS.LogTypes = [eks.ClusterLoggingTypes.API, eks.ClusterLoggingTypes.AUDIT];

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
        clusterLogging: [{ types: [eks.ClusterLoggingTypes.AUDIT], enabled: true }],
      },
    };

    const result = compareLoggingProps(oldProps, newProps);

    expect(result.logging?.clusterLogging).toEqual([{ types: [eks.ClusterLoggingTypes.AUDIT], enabled: true },
      { types: [eks.ClusterLoggingTypes.API], enabled: false }]);
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