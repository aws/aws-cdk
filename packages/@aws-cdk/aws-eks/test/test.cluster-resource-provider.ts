import { Test } from 'nodeunit';
import { ClusterResourceHandler } from '../lib/cluster-resource-handler/cluster';
import * as mocks from './cluster-resource-handler-mocks';

export = {
  setUp(callback: any) {
    mocks.reset();
    callback();
  },

  create: {
    async 'onCreate: minimal defaults (vpc + role)'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', mocks.MOCK_PROPS));
      await handler.onEvent();

      test.deepEqual(mocks.actualRequest.configureAssumeRoleRequest, {
        RoleArn: mocks.MOCK_ASSUME_ROLE_ARN,
        RoleSessionName: 'AWSCDK.EKSCluster.Create.fake-request-id',
      });

      test.deepEqual(mocks.actualRequest.createClusterRequest, {
        roleArn: 'arn:of:role',
        resourcesVpcConfig: {
          subnetIds: ['subnet1', 'subnet2'],
          securityGroupIds: ['sg1', 'sg2', 'sg3'],
        },
        name: 'MyResourceId-fakerequestid',
      });

      test.done();
    },

    async 'generated cluster name does not exceed 100 characters'(test: Test) {
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
      test.equal(mocks.actualRequest.createClusterRequest?.name.length, 100);
      test.deepEqual(mocks.actualRequest.createClusterRequest?.name, 'hellohellohellohellohellohellohellohellohellohellohellohellohellohe-602c078a6181435296764f00352445aa');
      test.done();
    },

    async 'onCreate: explicit cluster name'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
        ...mocks.MOCK_PROPS,
        name: 'ExplicitCustomName',
      }));
      await handler.onEvent();

      test.deepEqual(mocks.actualRequest.createClusterRequest!.name, 'ExplicitCustomName');
      test.done();
    },

    async 'with no specific version'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
        ...mocks.MOCK_PROPS,
        version: '12.34.56',
      }));
      await handler.onEvent();

      test.deepEqual(mocks.actualRequest.createClusterRequest!.version, '12.34.56');
      test.done();
    },

    async 'isCreateComplete still not complete if cluster is not ACTIVE'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'CREATING';
      const resp = await handler.isComplete();
      test.deepEqual(mocks.actualRequest.describeClusterRequest!.name, 'physical-resource-id');
      test.deepEqual(resp, { IsComplete: false });
      test.done();
    },

    async 'isCreateComplete throws if cluster is FAILED'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'FAILED';
      try {
        await handler.isComplete();
        test.ok(false, 'expected error to be thrown');
      } catch (err) {
        test.equal(err.message, 'Cluster is in a FAILED status');
      }
      test.done();
    },

    async 'isUpdateComplete throws if cluster is FAILED'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'FAILED';
      try {
        await handler.isComplete();
        test.ok(false, 'expected error to be thrown');
      } catch (err) {
        test.equal(err.message, 'Cluster is in a FAILED status');
      }
      test.done();
    },

    async 'isCreateComplete is complete when cluster is ACTIVE'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'ACTIVE';
      const resp = await handler.isComplete();
      test.deepEqual(resp, {
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
      test.done();
    },

    async 'encryption config'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
        ...mocks.MOCK_PROPS,
        encryptionConfig: [{ provider: { keyArn: 'aws:kms:key' }, resources: ['secrets'] }],
      }));

      await handler.onEvent();

      test.deepEqual(mocks.actualRequest.createClusterRequest, {
        roleArn: 'arn:of:role',
        resourcesVpcConfig: {
          subnetIds: ['subnet1', 'subnet2'],
          securityGroupIds: ['sg1', 'sg2', 'sg3'],
        },
        encryptionConfig: [{ provider: { keyArn: 'aws:kms:key' }, resources: ['secrets'] }],
        name: 'MyResourceId-fakerequestid',
      });

      test.done();
    },

  },

  delete: {
    async 'returns correct physical name'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      const resp = await handler.onEvent();
      test.deepEqual(mocks.actualRequest.deleteClusterRequest!.name, 'physical-resource-id');
      test.deepEqual(resp, { PhysicalResourceId: 'physical-resource-id' });
      test.done();
    },

    async 'onDelete ignores ResourceNotFoundException'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      mocks.simulateResponse.deleteClusterErrorCode = 'ResourceNotFoundException';
      await handler.onEvent();
      test.done();
    },

    async 'isDeleteComplete returns false as long as describeCluster succeeds'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      const resp = await handler.isComplete();
      test.deepEqual(mocks.actualRequest.describeClusterRequest!.name, 'physical-resource-id');
      test.ok(!resp.IsComplete);
      test.done();
    },

    async 'isDeleteComplete returns true when describeCluster throws a ResourceNotFound exception'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      mocks.simulateResponse.describeClusterExceptionCode = 'ResourceNotFoundException';
      const resp = await handler.isComplete();
      test.ok(resp.IsComplete);
      test.done();
    },

    async 'isDeleteComplete propagates other errors'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
      mocks.simulateResponse.describeClusterExceptionCode = 'OtherException';
      let error;
      try {
        await handler.isComplete();
      } catch (e) {
        error = e;
      }
      test.equal(error.code, 'OtherException');
      test.done();
    },
  },

  update: {

    async 'no change'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', mocks.MOCK_PROPS, mocks.MOCK_PROPS));
      const resp = await handler.onEvent();
      test.equal(resp, undefined);
      test.equal(mocks.actualRequest.createClusterRequest, undefined);
      test.equal(mocks.actualRequest.updateClusterConfigRequest, undefined);
      test.equal(mocks.actualRequest.updateClusterVersionRequest, undefined);
      test.done();
    },

    async 'isUpdateComplete is not complete when status is not ACTIVE'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'UPDATING';
      const resp = await handler.isComplete();
      test.deepEqual(resp.IsComplete, false);
      test.done();
    },

    async 'isUpdateComplete waits for ACTIVE'(test: Test) {
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
      mocks.simulateResponse.describeClusterResponseMockStatus = 'ACTIVE';
      const resp = await handler.isComplete();
      test.deepEqual(resp.IsComplete, true);
      test.done();
    },

    'requires replacement': {

      'name change': {

        async 'explicit name change'(test: Test) {
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
          test.deepEqual(mocks.actualRequest.createClusterRequest!, {
            name: 'new-cluster-name-1234',
            roleArn: 'arn:of:role',
            resourcesVpcConfig:
            {
              subnetIds: ['subnet1', 'subnet2'],
              securityGroupIds: ['sg1', 'sg2', 'sg3'],
            },
          });
          test.deepEqual(resp, { PhysicalResourceId: 'new-cluster-name-1234' });
          test.done();
        },

        async 'from auto-gen name to explicit name'(test: Test) {
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
          test.deepEqual(mocks.actualRequest.createClusterRequest!, {
            name: 'MyResourceId-fakerequestid',
            roleArn: 'arn:of:role',
            resourcesVpcConfig:
            {
              subnetIds: ['subnet1', 'subnet2'],
              securityGroupIds: ['sg1', 'sg2', 'sg3'],
            },
          });
          test.deepEqual(resp, { PhysicalResourceId: 'MyResourceId-fakerequestid' });
          test.done();
        },

      },

      async 'subnets or security groups requires a replacement'(test: Test) {
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

        test.deepEqual(resp, { PhysicalResourceId: 'MyResourceId-fakerequestid' });
        test.deepEqual(mocks.actualRequest.createClusterRequest, {
          name: 'MyResourceId-fakerequestid',
          roleArn: 'arn:of:role',
          resourcesVpcConfig:
          {
            subnetIds: ['subnet1', 'subnet2'],
            securityGroupIds: ['sg1'],
          },
        });
        test.done();
      },

      async '"roleArn" requires a replacement'(test: Test) {
        const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
          roleArn: 'new-arn',
        }, {
          roleArn: 'old-arn',
        }));
        const resp = await handler.onEvent();

        test.deepEqual(resp, { PhysicalResourceId: 'MyResourceId-fakerequestid' });
        test.deepEqual(mocks.actualRequest.createClusterRequest, {
          name: 'MyResourceId-fakerequestid',
          roleArn: 'new-arn',
        });
        test.done();
      },

      async 'fails if cluster has an explicit "name" that is the same as the old "name"'(test: Test) {
        // GIVEN
        const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
          roleArn: 'new-arn',
          name: 'explicit-cluster-name',
        }, {
          roleArn: 'old-arn',
          name: 'explicit-cluster-name',
        }));

        // THEN
        let err;
        try {
          await handler.onEvent();
        } catch (e) {
          err = e;
        }

        test.equal(err?.message, 'Cannot replace cluster "explicit-cluster-name" since it has an explicit physical name. Either rename the cluster or remove the "name" configuration');
        test.done();
      },

      async 'succeeds if cluster had an explicit "name" and now it does not'(test: Test) {
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
        test.deepEqual(resp, { PhysicalResourceId: 'MyResourceId-fakerequestid' });
        test.deepEqual(mocks.actualRequest.createClusterRequest, {
          name: 'MyResourceId-fakerequestid',
          roleArn: 'new-arn',
        });
        test.done();
      },

      async 'succeeds if cluster had an explicit "name" and now it has a different name'(test: Test) {
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
        test.deepEqual(resp, { PhysicalResourceId: 'new-explicit-cluster-name' });
        test.deepEqual(mocks.actualRequest.createClusterRequest, {
          name: 'new-explicit-cluster-name',
          roleArn: 'new-arn',
        });
        test.done();
      },
    },

    async 'encryption config cannot be updated'(test: Test) {
      // GIVEN
      const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
        encryptionConfig: [{ resources: ['secrets'], provider: { keyArn: 'key:arn:1' } }],
      }, {
        encryptionConfig: [{ resources: ['secrets'], provider: { keyArn: 'key:arn:2' } }],
      }));

      // WHEN
      let error;
      try {
        await handler.onEvent();
      } catch (e) {
        error = e;
      }

      // THEN
      test.ok(error);
      test.equal(error.message, 'Cannot update cluster encryption configuration');
      test.done();
    },

    'isUpdateComplete with EKS update ID': {

      async 'with "Failed" status'(test: Test) {
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

        let error;
        try {
          await isCompleteHandler.isComplete();
        } catch (e) {
          error = e;
        }
        test.ok(error);
        test.deepEqual(mocks.actualRequest.describeUpdateRequest, { name: 'physical-resource-id', updateId: 'foobar' });
        test.equal(error.message, 'cluster update id "foobar" failed with errors: [{"errorMessage":"errorMessageMock","errorCode":"errorCodeMock","resourceIds":["foo","bar"]}]');
        test.done();
      },

      async 'with "InProgress" status, returns IsComplete=false'(test: Test) {
        const event = mocks.newRequest('Update');
        const isCompleteHandler = new ClusterResourceHandler(mocks.client, {
          ...event,
          EksUpdateId: 'foobar',
        });

        mocks.simulateResponse.describeUpdateResponseMockStatus = 'InProgress';

        const response = await isCompleteHandler.isComplete();

        test.deepEqual(mocks.actualRequest.describeUpdateRequest, { name: 'physical-resource-id', updateId: 'foobar' });
        test.equal(response.IsComplete, false);
        test.done();
      },

      async 'with "Successful" status, returns IsComplete=true with "Data"'(test: Test) {
        const event = mocks.newRequest('Update');
        const isCompleteHandler = new ClusterResourceHandler(mocks.client, {
          ...event,
          EksUpdateId: 'foobar',
        });

        mocks.simulateResponse.describeUpdateResponseMockStatus = 'Successful';

        const response = await isCompleteHandler.isComplete();

        test.deepEqual(mocks.actualRequest.describeUpdateRequest, { name: 'physical-resource-id', updateId: 'foobar' });
        test.deepEqual(response, {
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
        test.done();
      },

    },

    'in-place': {

      'version change': {
        async 'from undefined to a specific value'(test: Test) {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: '12.34',
          }, {
            version: undefined,
          }));
          const resp = await handler.onEvent();
          test.deepEqual(resp, { EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          test.deepEqual(mocks.actualRequest.updateClusterVersionRequest!, {
            name: 'physical-resource-id',
            version: '12.34',
          });
          test.equal(mocks.actualRequest.createClusterRequest, undefined);
          test.done();
        },

        async 'from a specific value to another value'(test: Test) {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: '2.0',
          }, {
            version: '1.1',
          }));

          const resp = await handler.onEvent();
          test.deepEqual(resp, { EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          test.deepEqual(mocks.actualRequest.updateClusterVersionRequest!, {
            name: 'physical-resource-id',
            version: '2.0',
          });
          test.equal(mocks.actualRequest.createClusterRequest, undefined);
          test.done();
        },

        async 'to a new value that is already the current version'(test: Test) {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: '1.0',
          }));
          const resp = await handler.onEvent();
          test.equal(resp, undefined);
          test.deepEqual(mocks.actualRequest.describeClusterRequest, { name: 'physical-resource-id' });
          test.equal(mocks.actualRequest.updateClusterVersionRequest, undefined);
          test.equal(mocks.actualRequest.createClusterRequest, undefined);
          test.done();
        },

        async 'fails from specific value to undefined'(test: Test) {
          const handler = new ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
            version: undefined,
          }, {
            version: '1.2',
          }));
          let error;
          try {
            await handler.onEvent();
          } catch (e) {
            error = e;
          }

          test.equal(error.message, 'Cannot remove cluster version configuration. Current version is 1.2');
          test.done();
        },
      },

      'logging or access change': {
        async 'from undefined to partial logging enabled'(test: Test) {
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
          test.deepEqual(resp, { EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          test.deepEqual(mocks.actualRequest.updateClusterConfigRequest!, {
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
          test.equal(mocks.actualRequest.createClusterRequest, undefined);
          test.done();
        },

        async 'from partial vpc configuration to only private access enabled'(test: Test) {
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
          test.deepEqual(resp, { EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          test.deepEqual(mocks.actualRequest.updateClusterConfigRequest!, {
            name: 'physical-resource-id',
            logging: undefined,
            resourcesVpcConfig: {
              endpointPrivateAccess: true,
              endpointPublicAccess: undefined,
              publicAccessCidrs: undefined,
            },
          });
          test.equal(mocks.actualRequest.createClusterRequest, undefined);
          test.done();
        },

        async 'from undefined to both logging and access fully enabled'(test: Test) {
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
          test.deepEqual(resp, { EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
          test.deepEqual(mocks.actualRequest.updateClusterConfigRequest!, {
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
          test.equal(mocks.actualRequest.createClusterRequest, undefined);
          test.done();
        },
      },
    },
  },
};