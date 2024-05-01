const mockRebootCluster = jest.fn();
const mockDescribeClusters = jest.fn();
const mockRedshift = {
  rebootCluster: mockRebootCluster,
  describeClusters: mockDescribeClusters,
};

jest.mock('@aws-sdk/client-redshift', () => {
  return {
    Redshift: jest.fn(() => mockRedshift),
  };
});

jest.setTimeout(35_000);

import { handler } from '../../lib/aws-redshift-alpha/cluster-parameter-change-reboot-handler';

describe('cluster-parameter-change-reboot-handler', () => {

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('reboots cluster with "pending-reboot" status', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{
          ClusterParameterGroups: [{
            ParameterGroupName: 'parameter-group-name',
            ParameterApplyStatus: 'pending-reboot',
          }],
        }],
      };
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(mockRebootCluster).toHaveBeenCalled();
  });

  test('reboots cluster with "apply-deferred" status', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{
          ClusterParameterGroups: [{
            ParameterGroupName: 'parameter-group-name',
            ParameterApplyStatus: 'apply-deferred',
          }],
        }],
      };
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(mockRebootCluster).toHaveBeenCalled();
  });

  test('reboots cluster with "apply-error" status', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{
          ClusterParameterGroups: [{
            ParameterGroupName: 'parameter-group-name',
            ParameterApplyStatus: 'apply-deferred',
          }],
        }],
      };
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(mockRebootCluster).toHaveBeenCalled();
  });

  test('retries cluster with "applying" status', async () => {
    // GIVEN
    mockDescribeClusters
      .mockImplementationOnce(() => {
        return {
          Clusters: [{
            ClusterParameterGroups: [{
              ParameterGroupName: 'parameter-group-name',
              ParameterApplyStatus: 'applying',
            }],
          }],
        };
      }).mockImplementationOnce(() => {
        return {
          Clusters: [{
            ClusterParameterGroups: [{
              ParameterGroupName: 'parameter-group-name',
              ParameterApplyStatus: 'pending-reboot',
            }],
          }],
        };
      });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(setTimeout).toHaveBeenCalled();
    expect(mockDescribeClusters).toHaveBeenCalledTimes(2);
    expect(mockRebootCluster).toHaveBeenCalledTimes(1);
  });

  test('retries cluster with "retry" status', async () => {
    // GIVEN
    mockDescribeClusters
      .mockImplementationOnce(() => {
        return {
          Clusters: [{
            ClusterParameterGroups: [{
              ParameterGroupName: 'parameter-group-name',
              ParameterApplyStatus: 'retry',
            }],
          }],
        };
      }).mockImplementationOnce(() => {
        return {
          Clusters: [{
            ClusterParameterGroups: [{
              ParameterGroupName: 'parameter-group-name',
              ParameterApplyStatus: 'pending-reboot',
            }],
          }],
        };
      });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(setTimeout).toHaveBeenCalled();
    expect(mockDescribeClusters).toHaveBeenCalledTimes(2);
    expect(mockRebootCluster).toHaveBeenCalledTimes(1);
  });

  test('retries if rebootCluster throws InvalidClusterStateFault error', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{
          ClusterParameterGroups: [{
            ParameterGroupName: 'parameter-group-name',
            ParameterApplyStatus: 'pending-reboot',
          }],
        }],
      };
    });
    mockRebootCluster
      .mockImplementationOnce(async () => {
        const { InvalidClusterStateFault } = jest.requireActual('@aws-sdk/client-redshift');
        return Promise.reject(new InvalidClusterStateFault());
      })
      .mockImplementationOnce(jest.fn());

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(setTimeout).toHaveBeenCalled();
    expect(mockDescribeClusters).toHaveBeenCalledTimes(1);
    expect(mockRebootCluster).toHaveBeenCalledTimes(2);
  });

  test('fails if rebootCluster throws generic error', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{
          ClusterParameterGroups: [{
            ParameterGroupName: 'parameter-group-name',
            ParameterApplyStatus: 'pending-reboot',
          }],
        }],
      };
    });
    mockRebootCluster.mockImplementation(async () => {
      return Promise.reject(new Error('error'));
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    // THEN
    await expect(() => invokeHandler(event)).rejects.toThrow('error');
  });

  test('fails if cannot find cluster details', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{}],
      };
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    // THEN
    await expect(() =>invokeHandler(event))
      .rejects.toThrow(/Unable to find any Parameter Groups associated with ClusterId "cluster-id"./);
  });

  test('fails if cannot find cluster parameter group', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{
          ClusterParameterGroups: [{
            ParameterGroupName: 'unknown',
            ParameterApplyStatus: 'pending-reboot',
          }],
        }],
      };
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    // THEN
    await expect(() =>invokeHandler(event))
      .rejects.toThrow(/Unable to find Parameter Group named "parameter-group-name" associated with ClusterId "cluster-id"./);
  });

  test('does not reboot if request type is Delete', async () => {
    // GIVEN
    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(mockRebootCluster).not.toHaveBeenCalled();
  });

  test('does not reboot if apply status is not recognized', async () => {
    // GIVEN
    mockDescribeClusters.mockImplementation(() => {
      return {
        Clusters: [{
          ClusterParameterGroups: [{
            ParameterGroupName: 'parameter-group-name',
            ParameterApplyStatus: 'other-status',
          }],
        }],
      };
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'service-token',
        ClusterId: 'cluster-id',
        ParameterGroupName: 'parameter-group-name',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(mockRebootCluster).not.toHaveBeenCalled();
  });
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
