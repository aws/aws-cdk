import { ClusterResourceHandler } from '../lib/cluster-resource-handler/cluster';
import * as mocks from './cluster-resource-handler-mocks';

describe('cluster resource provider', () => {
  beforeEach(() => {
    mocks.reset();
  });

  describe('create', () => {
    test('onCreate: minimal defaults (vpc + role)', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', mocks.MOCK_PROPS));
      await handler.onEvent();

      expect(mocks.actualRequest.configureAssumeRoleRequest).toEqual({
        RoleArn: mocks.MOCK_ASSUME_ROLE_ARN,
        RoleSessionName: 'AWSCDK.EKSCluster.Create.fake-request-id',
      });

      expect(mocks.actualRequest.createClusterRequest).toEqual({
        roleArn: 'arn:of:role',
        resourcesVpcConfig: {
          subnetIds: ['subnet1', 'subnet2'],
          securityGroupIds: ['sg1', 'sg2', 'sg3'],
        },
        name: 'MyResourceId-fakerequestid',
      });
    });

    test('generated cluster name does not exceed 100 characters', async () => {
      // GIVEN
      const req: AWSLambda.CloudFormationCustomResourceCreateEvent = {
        StackId: 'fake-stack-id',
        RequestId: '602c078a-6181-4352-9676-4f00352445aa',
        ResourceType: 'Custom::EKSCluster',
        ServiceToken: 'boom',
        LogicalResourceId: 'hello'.repeat(30), // 150 chars (limit is 100)
        ResponseURL: 'http://response-url',
        RequestType: 'Create',
        ResourceProperties: {
          ServiceToken: 'boom',
          Config: mocks.MOCK_PROPS,
          AssumeRoleArn: mocks.MOCK_ASSUME_ROLE_ARN,
        },
      };

      // WHEN
      const handler = new ClusterResourceHandler(mocks.client, req);
      await handler.onEvent();

      // THEN
      expect(mocks.actualRequest.createClusterRequest?.name.length).toEqual(100);
      expect(mocks.actualRequest.createClusterRequest?.name).toEqual('hellohellohellohellohellohellohellohellohellohellohellohellohellohe-602c078a6181435296764f00352445aa');
    });

    test('onCreate: explicit cluster name', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
        ...mocks.MOCK_PROPS,
        name: 'ExplicitCustomName',
      }));
      await handler.onEvent();

      expect(mocks.actualRequest.createClusterRequest!.name).toEqual('ExplicitCustomName');
    });

    test('with no specific version', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
        ...mocks.MOCK_PROPS,
        version: '12.34.56',
      }));
      await handler.onEvent();

      expect(mocks.actualRequest.createClusterRequest!.version).toEqual('12.34.56');
    });

    test('isCreateComplete still not complete if cluster is not ACTIVE', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'CREATING';
      const resp = await handler.isComplete();
      expect(mocks.actualRequest.describeClusterRequest!.name).toEqual('physical-resource-id');
      expect(resp).toEqual({ IsComplete: false });
    });

    test('isCreateComplete throws if cluster is FAILED', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'FAILED';
      await expect(handler.isComplete()).rejects.toThrow('Cluster is in a FAILED status');
    });

    test('isUpdateComplete throws if cluster is FAILED', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'FAILED';
      await expect(handler.isComplete()).rejects.toThrow('Cluster is in a FAILED status');
    });

    test('isCreateComplete is complete when cluster is ACTIVE', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'ACTIVE';
      const resp = await handler.isComplete();
      expect(resp).toEqual({
        IsComplete: true,
        Data: {
          Name: 'physical-resource-id',
          Endpoint: 'http://endpoint',
          Arn: 'arn:cluster-arn',
          CertificateAuthorityData: 'certificateAuthority-data',
          ClusterSecurityGroupId: '',
          EncryptionConfigKeyArn: '',
          OpenIdConnectIssuerUrl: '',
          OpenIdConnectIssuer: '',
        },
      });
    });

    test('encryption config', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
        ...mocks.MOCK_PROPS,
        encryptionConfig: [{ provider: { keyArn: 'aws:kms:key' }, resources: ['secrets'] }],
      }));

      await handler.onEvent();

      expect(mocks.actualRequest.createClusterRequest).toEqual({
        roleArn: 'arn:of:role',
        resourcesVpcConfig: {
          subnetIds: ['subnet1', 'subnet2'],
          securityGroupIds: ['sg1', 'sg2', 'sg3'],
        },
        encryptionConfig: [{ provider: { keyArn: 'aws:kms:key' }, resources: ['secrets'] }],
        name: 'MyResourceId-fakerequestid',
      });
    });
  });

  describe('delete', () => {
    test('returns correct physical name', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      const resp = await handler.onEvent();
      expect(mocks.actualRequest.deleteClusterRequest!.name).toEqual('physical-resource-id');
      expect(resp).toEqual({ PhysicalResourceId: 'physical-resource-id' });
    });

    test('onDelete ignores ResourceNotFoundException', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      mocks.simulateResponse.deleteClusterErrorCode = 'ResourceNotFoundException';
      await handler.onEvent();
    });

    test('isDeleteComplete returns false as long as describeCluster succeeds', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      const resp = await handler.isComplete();
      expect(mocks.actualRequest.describeClusterRequest!.name).toEqual('physical-resource-id');
      expect(resp.IsComplete).toEqual(false);
    });

    test('isDeleteComplete returns true when describeCluster throws a ResourceNotFound exception', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      mocks.simulateResponse.describeClusterExceptionCode = 'ResourceNotFoundException';
      const resp = await handler.isComplete();
      expect(resp.IsComplete).toEqual(true);
    });

    test('isDeleteComplete propagates other errors', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      mocks.simulateResponse.describeClusterExceptionCode = 'OtherException';
      let error: any;
      try {
        await handler.isComplete();
      } catch (e) {
        error = e;
      }
      expect(error.code).toEqual('OtherException');
    });
  });

  describe('update', () => {
    test('no change', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', mocks.MOCK_PROPS, mocks.MOCK_PROPS));
      const resp = await handler.onEvent();
      expect(resp).toEqual(undefined);
      expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
      expect(mocks.actualRequest.updateClusterConfigRequest).toEqual(undefined);
      expect(mocks.actualRequest.updateClusterVersionRequest).toEqual(undefined);
    });

    test('isUpdateComplete is not complete when status is not ACTIVE', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'UPDATING';
      const resp = await handler.isComplete();
      expect(resp.IsComplete).toEqual(false);
    });

    test('isUpdateComplete waits for ACTIVE', async () => {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'ACTIVE';
      const resp = await handler.isComplete();
      expect(resp.IsComplete).toEqual(true);
    });

    describe('requires replacement', () => {
      describe('name change', () => {
        test('explicit name change', async () => {
          // GIVEN
          const req = mocks.newRequest('Update', {
            ...mocks.MOCK_PROPS,
            name: 'new-cluster-name-1234',
          }, {
            name: 'old-cluster-name',
          });
          const handler = new ClusterResourceHandler(mocks.client, req);

          // WHEN
          const resp = await handler.onEvent();

          // THEN
          expect(mocks.actualRequest.createClusterRequest!).toEqual({
            name: 'new-cluster-name-1234',
            roleArn: 'arn:of:role',
            resourcesVpcConfig:
            {
              subnetIds: ['subnet1', 'subnet2'],
              securityGroupIds: ['sg1', 'sg2', 'sg3'],
            },
          });
          expect(resp).toEqual({ PhysicalResourceId: 'new-cluster-name-1234' });
        });

        test('from auto-gen name to explicit name', async () => {
          // GIVEN
          const req = mocks.newRequest('Update', {
            ...mocks.MOCK_PROPS,
            name: undefined, // auto-gen
          }, {
            name: 'explicit', // auto-gen
          });

          const handler = new ClusterResourceHandler(mocks.client, req);

          // WHEN
          const resp = await handler.onEvent();

          // THEN
          expect(mocks.actualRequest.createClusterRequest!).toEqual({
            name: 'MyResourceId-fakerequestid',
            roleArn: 'arn:of:role',
            resourcesVpcConfig:
            {
              subnetIds: ['subnet1', 'subnet2'],
              securityGroupIds: ['sg1', 'sg2', 'sg3'],
            },
          });
          expect(resp).toEqual({ PhysicalResourceId: 'MyResourceId-fakerequestid' });
        });
      });

      test('subnets or security groups requires a replacement', async () => {
        const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
          ...mocks.MOCK_PROPS,
          resourcesVpcConfig: {
            subnetIds: ['subnet1', 'subnet2'],
            securityGroupIds: ['sg1'],
          },
        }, {
          ...mocks.MOCK_PROPS,
          resourcesVpcConfig: {
            subnetIds: ['subnet1'],
            securityGroupIds: ['sg2'],
          },
        }));
        const resp = await handler.onEvent();

        expect(resp).toEqual({ PhysicalResourceId: 'MyResourceId-fakerequestid' });
        expect(mocks.actualRequest.createClusterRequest).toEqual({
          name: 'MyResourceId-fakerequestid',
          roleArn: 'arn:of:role',
          resourcesVpcConfig:
          {
            subnetIds: ['subnet1', 'subnet2'],
            securityGroupIds: ['sg1'],
          },
        });
      });

      test('"roleArn" requires a replacement', async () => {
        const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
          roleArn: 'new-arn',
        }, {
          roleArn: 'old-arn',
        }));
        const resp = await handler.onEvent();

        expect(resp).toEqual({ PhysicalResourceId: 'MyResourceId-fakerequestid' });
        expect(mocks.actualRequest.createClusterRequest).toEqual({
          name: 'MyResourceId-fakerequestid',
          roleArn: 'new-arn',
        });
      });

      test('fails if cluster has an explicit "name" that is the same as the old "name"', async () => {
        // GIVEN
        const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
          roleArn: 'new-arn',
          name: 'explicit-cluster-name',
        }, {
          roleArn: 'old-arn',
          name: 'explicit-cluster-name',
        }));

        // THEN
        let err: any;
        try {
          await handler.onEvent();
        } catch (e) {
          err = e;
        }

        expect(err?.message).toEqual('Cannot replace cluster "explicit-cluster-name" since it has an explicit physical name. Either rename the cluster or remove the "name" configuration');
      });

      test('succeeds if cluster had an explicit "name" and now it does not', async () => {
        // GIVEN
        const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
          roleArn: 'new-arn',
          name: undefined, // auto-gen
        }, {
          roleArn: 'old-arn',
          name: 'explicit-cluster-name',
        }));

        // WHEN
        const resp = await handler.onEvent();

        // THEN
        expect(resp).toEqual({ PhysicalResourceId: 'MyResourceId-fakerequestid' });
        expect(mocks.actualRequest.createClusterRequest).toEqual({
          name: 'MyResourceId-fakerequestid',
          roleArn: 'new-arn',
        });
      });

      test('succeeds if cluster had an explicit "name" and now it has a different name', async () => {
        // GIVEN
        const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
          roleArn: 'new-arn',
          name: 'new-explicit-cluster-name',
        }, {
          roleArn: 'old-arn',
          name: 'old-explicit-cluster-name',
        }));

        // WHEN
        const resp = await handler.onEvent();

        // THEN
        expect(resp).toEqual({ PhysicalResourceId: 'new-explicit-cluster-name' });
        expect(mocks.actualRequest.createClusterRequest).toEqual({
          name: 'new-explicit-cluster-name',
          roleArn: 'new-arn',
        });
      });
    });

    test('encryption config cannot be updated', async () => {
      // GIVEN
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
        encryptionConfig: [{ resources: ['secrets'], provider: { keyArn: 'key:arn:1' } }],
      }, {
        encryptionConfig: [{ resources: ['secrets'], provider: { keyArn: 'key:arn:2' } }],
      }));

      // WHEN
      let error: any;
      try {
        await handler.onEvent();
      } catch (e) {
        error = e;
      }

      // THEN
      expect(error).toBeDefined();
      expect(error.message).toEqual('Cannot update cluster encryption configuration');
    });

    describe('isUpdateComplete with EKS update ID', () => {
      test('with "Failed" status', async () => {
        const event = mocks.newRequest('Update');
        const isCompleteHandler = new ClusterResourceHandler(mocks.client, {
          ...event,
          EksUpdateId: 'foobar',
        });

        mocks.simulateResponse.describeUpdateResponseMockStatus = 'Failed';
        mocks.simulateResponse.describeUpdateResponseMockErrors = [
          {
            errorMessage: 'errorMessageMock',
            errorCode: 'errorCodeMock',
            resourceIds: [
              'foo', 'bar',
            ],
          },
        ];

        let error: any;
        try {
          await isCompleteHandler.isComplete();
        } catch (e) {
          error = e;
        }
        expect(error).toBeDefined();
        expect(mocks.actualRequest.describeUpdateRequest).toEqual({ name: 'physical-resource-id', updateId: 'foobar' });
        expect(error.message).toEqual('cluster update id "foobar" failed with errors: [{"errorMessage":"errorMessageMock","errorCode":"errorCodeMock","resourceIds":["foo","bar"]}]');
      });

      test('with "InProgress" status, returns IsComplete=false', async () => {
        const event = mocks.newRequest('Update');
        const isCompleteHandler = new ClusterResourceHandler(mocks.client, {
          ...event,
          EksUpdateId: 'foobar',
        });

        mocks.simulateResponse.describeUpdateResponseMockStatus = 'InProgress';

        const response = await isCompleteHandler.isComplete();

        expect(mocks.actualRequest.describeUpdateRequest).toEqual({ name: 'physical-resource-id', updateId: 'foobar' });
        expect(response.IsComplete).toEqual(false);
      });

      test('with "Successful" status, returns IsComplete=true with "Data"', async () => {
        const event = mocks.newRequest('Update');
        const isCompleteHandler = new ClusterResourceHandler(mocks.client, {
          ...event,
          EksUpdateId: 'foobar',
        });

        mocks.simulateResponse.describeUpdateResponseMockStatus = 'Successful';

        const response = await isCompleteHandler.isComplete();

        expect(mocks.actualRequest.describeUpdateRequest).toEqual({ name: 'physical-resource-id', updateId: 'foobar' });
        expect(response).toEqual({
          IsComplete: true,
          Data: {
            Name: 'physical-resource-id',
            Endpoint: 'http://endpoint',
            Arn: 'arn:cluster-arn',
            CertificateAuthorityData: 'certificateAuthority-data',
            ClusterSecurityGroupId: '',
            EncryptionConfigKeyArn: '',
            OpenIdConnectIssuerUrl: '',
            OpenIdConnectIssuer: '',
          },
        });
      });
    });

    describe('in-place', () => {
      describe('version change', () => {
        test('from undefined to a specific value', async () => {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: '12.34',
          }, {
            version: undefined,
          }));
          const resp = await handler.onEvent();
          expect(resp).toEqual({ EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          expect(mocks.actualRequest.updateClusterVersionRequest!).toEqual({
            name: 'physical-resource-id',
            version: '12.34',
          });
          expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
        });

        test('from a specific value to another value', async () => {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: '2.0',
          }, {
            version: '1.1',
          }));

          const resp = await handler.onEvent();
          expect(resp).toEqual({ EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          expect(mocks.actualRequest.updateClusterVersionRequest!).toEqual({
            name: 'physical-resource-id',
            version: '2.0',
          });
          expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
        });

        test('to a new value that is already the current version', async () => {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: '1.0',
          }));
          const resp = await handler.onEvent();
          expect(resp).toEqual(undefined);
          expect(mocks.actualRequest.describeClusterRequest).toEqual({ name: 'physical-resource-id' });
          expect(mocks.actualRequest.updateClusterVersionRequest).toEqual(undefined);
          expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
        });

        test('fails from specific value to undefined', async () => {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: undefined,
          }, {
            version: '1.2',
          }));
          let error: any;
          try {
            await handler.onEvent();
          } catch (e) {
            error = e;
          }

          expect(error.message).toEqual('Cannot remove cluster version configuration. Current version is 1.2');
        });
      });

      describe('logging or access change', () => {
        test('from undefined to partial logging enabled', async () => {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            logging: {
              clusterLogging: [
                {
                  types: ['api'],
                  enabled: true,
                },
              ],
            },
          }, {
            logging: undefined,
          }));
          const resp = await handler.onEvent();
          expect(resp).toEqual({ EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          expect(mocks.actualRequest.updateClusterConfigRequest!).toEqual({
            name: 'physical-resource-id',
            logging: {
              clusterLogging: [
                {
                  types: ['api'],
                  enabled: true,
                },
              ],
            },
          });
          expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
        });

        test('from partial vpc configuration to only private access enabled', async () => {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            resourcesVpcConfig: {
              securityGroupIds: ['sg1', 'sg2', 'sg3'],
              endpointPrivateAccess: true,
            },
          }, {
            resourcesVpcConfig: {
              securityGroupIds: ['sg1', 'sg2', 'sg3'],
            },
          }));
          const resp = await handler.onEvent();
          expect(resp).toEqual({ EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          expect(mocks.actualRequest.updateClusterConfigRequest!).toEqual({
            name: 'physical-resource-id',
            logging: undefined,
            resourcesVpcConfig: {
              endpointPrivateAccess: true,
              endpointPublicAccess: undefined,
              publicAccessCidrs: undefined,
            },
          });
          expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
        });

        test('from undefined to both logging and access fully enabled', async () => {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            logging: {
              clusterLogging: [
                {
                  types: ['api', 'audit', 'authenticator', 'controllerManager', 'scheduler'],
                  enabled: true,
                },
              ],
            },
            resourcesVpcConfig: {
              endpointPrivateAccess: true,
              endpointPublicAccess: true,
              publicAccessCidrs: ['0.0.0.0/0'],
            },
          }, {
            logging: undefined,
            resourcesVpcConfig: undefined,
          }));

          const resp = await handler.onEvent();
          expect(resp).toEqual({ EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          expect(mocks.actualRequest.updateClusterConfigRequest!).toEqual({
            name: 'physical-resource-id',
            logging: {
              clusterLogging: [
                {
                  types: ['api', 'audit', 'authenticator', 'controllerManager', 'scheduler'],
                  enabled: true,
                },
              ],
            },
            resourcesVpcConfig: {
              endpointPrivateAccess: true,
              endpointPublicAccess: true,
              publicAccessCidrs: ['0.0.0.0/0'],
            },
          });
          expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
        });
      });
    });
  });
});
