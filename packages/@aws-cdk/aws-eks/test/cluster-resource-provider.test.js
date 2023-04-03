"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocks = require("./cluster-resource-handler-mocks");
const cluster_1 = require("../lib/cluster-resource-handler/cluster");
describe('cluster resource provider', () => {
    beforeEach(() => {
        mocks.reset();
    });
    describe('create', () => {
        test('onCreate: minimal defaults (vpc + role)', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Create', mocks.MOCK_PROPS));
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
            const req = {
                StackId: 'fake-stack-id',
                RequestId: '602c078a-6181-4352-9676-4f00352445aa',
                ResourceType: 'Custom::EKSCluster',
                ServiceToken: 'boom',
                LogicalResourceId: 'hello'.repeat(30),
                ResponseURL: 'http://response-url',
                RequestType: 'Create',
                ResourceProperties: {
                    ServiceToken: 'boom',
                    Config: mocks.MOCK_PROPS,
                    AssumeRoleArn: mocks.MOCK_ASSUME_ROLE_ARN,
                },
            };
            // WHEN
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, req);
            await handler.onEvent();
            // THEN
            expect(mocks.actualRequest.createClusterRequest?.name.length).toEqual(100);
            expect(mocks.actualRequest.createClusterRequest?.name).toEqual('hellohellohellohellohellohellohellohellohellohellohellohellohellohe-602c078a6181435296764f00352445aa');
        });
        test('onCreate: explicit cluster name', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
                ...mocks.MOCK_PROPS,
                name: 'ExplicitCustomName',
            }));
            await handler.onEvent();
            expect(mocks.actualRequest.createClusterRequest.name).toEqual('ExplicitCustomName');
        });
        test('with no specific version', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
                ...mocks.MOCK_PROPS,
                version: '12.34.56',
            }));
            await handler.onEvent();
            expect(mocks.actualRequest.createClusterRequest.version).toEqual('12.34.56');
        });
        test('isCreateComplete still not complete if cluster is not ACTIVE', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
            mocks.simulateResponse.describeClusterResponseMockStatus = 'CREATING';
            const resp = await handler.isComplete();
            expect(mocks.actualRequest.describeClusterRequest.name).toEqual('physical-resource-id');
            expect(resp).toEqual({ IsComplete: false });
        });
        test('isCreateComplete throws if cluster is FAILED', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
            mocks.simulateResponse.describeClusterResponseMockStatus = 'FAILED';
            await expect(handler.isComplete()).rejects.toThrow('Cluster is in a FAILED status');
        });
        test('isUpdateComplete throws if cluster is FAILED', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
            mocks.simulateResponse.describeClusterResponseMockStatus = 'FAILED';
            await expect(handler.isComplete()).rejects.toThrow('Cluster is in a FAILED status');
        });
        test('isCreateComplete is complete when cluster is ACTIVE', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Create'));
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
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Create', {
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
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
            const resp = await handler.onEvent();
            expect(mocks.actualRequest.deleteClusterRequest.name).toEqual('physical-resource-id');
            expect(resp).toEqual({ PhysicalResourceId: 'physical-resource-id' });
        });
        test('onDelete ignores ResourceNotFoundException', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
            mocks.simulateResponse.deleteClusterErrorCode = 'ResourceNotFoundException';
            await handler.onEvent();
        });
        test('isDeleteComplete returns false as long as describeCluster succeeds', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
            const resp = await handler.isComplete();
            expect(mocks.actualRequest.describeClusterRequest.name).toEqual('physical-resource-id');
            expect(resp.IsComplete).toEqual(false);
        });
        test('isDeleteComplete returns true when describeCluster throws a ResourceNotFound exception', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
            mocks.simulateResponse.describeClusterExceptionCode = 'ResourceNotFoundException';
            const resp = await handler.isComplete();
            expect(resp.IsComplete).toEqual(true);
        });
        test('isDeleteComplete propagates other errors', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Delete'));
            mocks.simulateResponse.describeClusterExceptionCode = 'OtherException';
            let error;
            try {
                await handler.isComplete();
            }
            catch (e) {
                error = e;
            }
            expect(error.code).toEqual('OtherException');
        });
    });
    describe('update', () => {
        test('no change', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', mocks.MOCK_PROPS, mocks.MOCK_PROPS));
            const resp = await handler.onEvent();
            expect(resp).toEqual(undefined);
            expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
            expect(mocks.actualRequest.updateClusterConfigRequest).toEqual(undefined);
            expect(mocks.actualRequest.updateClusterVersionRequest).toEqual(undefined);
        });
        test('isUpdateComplete is not complete when status is not ACTIVE', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
            mocks.simulateResponse.describeClusterResponseMockStatus = 'UPDATING';
            const resp = await handler.isComplete();
            expect(resp.IsComplete).toEqual(false);
        });
        test('isUpdateComplete waits for ACTIVE', async () => {
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update'));
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
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, req);
                    // WHEN
                    const resp = await handler.onEvent();
                    // THEN
                    expect(mocks.actualRequest.createClusterRequest).toEqual({
                        name: 'new-cluster-name-1234',
                        roleArn: 'arn:of:role',
                        resourcesVpcConfig: {
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
                        name: undefined,
                    }, {
                        name: 'explicit',
                    });
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, req);
                    // WHEN
                    const resp = await handler.onEvent();
                    // THEN
                    expect(mocks.actualRequest.createClusterRequest).toEqual({
                        name: 'MyResourceId-fakerequestid',
                        roleArn: 'arn:of:role',
                        resourcesVpcConfig: {
                            subnetIds: ['subnet1', 'subnet2'],
                            securityGroupIds: ['sg1', 'sg2', 'sg3'],
                        },
                    });
                    expect(resp).toEqual({ PhysicalResourceId: 'MyResourceId-fakerequestid' });
                });
            });
            test('subnets or security groups requires a replacement', async () => {
                const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                    resourcesVpcConfig: {
                        subnetIds: ['subnet1', 'subnet2'],
                        securityGroupIds: ['sg1'],
                    },
                });
            });
            test('change subnets or security groups order should not trigger an update', async () => {
                const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
                    ...mocks.MOCK_PROPS,
                    resourcesVpcConfig: {
                        subnetIds: ['subnet1', 'subnet2'],
                        securityGroupIds: ['sg1', 'sg2'],
                    },
                }, {
                    ...mocks.MOCK_PROPS,
                    resourcesVpcConfig: {
                        subnetIds: ['subnet2', 'subnet1'],
                        securityGroupIds: ['sg2', 'sg1'],
                    },
                }));
                const resp = await handler.onEvent();
                expect(resp).toEqual(undefined);
            });
            test('"roleArn" requires a replacement', async () => {
                const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                }
                catch (e) {
                    err = e;
                }
                expect(err?.message).toEqual('Cannot replace cluster "explicit-cluster-name" since it has an explicit physical name. Either rename the cluster or remove the "name" configuration');
            });
            test('succeeds if cluster had an explicit "name" and now it does not', async () => {
                // GIVEN
                const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
                    roleArn: 'new-arn',
                    name: undefined,
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
                const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
            const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
                encryptionConfig: [{ resources: ['secrets'], provider: { keyArn: 'key:arn:1' } }],
            }, {
                encryptionConfig: [{ resources: ['secrets'], provider: { keyArn: 'key:arn:2' } }],
            }));
            // WHEN
            let error;
            try {
                await handler.onEvent();
            }
            catch (e) {
                error = e;
            }
            // THEN
            expect(error).toBeDefined();
            expect(error.message).toEqual('Cannot update cluster encryption configuration');
        });
        describe('isUpdateComplete with EKS update ID', () => {
            test('with "Failed" status', async () => {
                const event = mocks.newRequest('Update');
                const isCompleteHandler = new cluster_1.ClusterResourceHandler(mocks.client, {
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
                }
                catch (e) {
                    error = e;
                }
                expect(error).toBeDefined();
                expect(mocks.actualRequest.describeUpdateRequest).toEqual({ name: 'physical-resource-id', updateId: 'foobar' });
                expect(error.message).toEqual('cluster update id "foobar" failed with errors: [{"errorMessage":"errorMessageMock","errorCode":"errorCodeMock","resourceIds":["foo","bar"]}]');
            });
            test('with "InProgress" status, returns IsComplete=false', async () => {
                const event = mocks.newRequest('Update');
                const isCompleteHandler = new cluster_1.ClusterResourceHandler(mocks.client, {
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
                const isCompleteHandler = new cluster_1.ClusterResourceHandler(mocks.client, {
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
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
                        version: '12.34',
                    }, {
                        version: undefined,
                    }));
                    const resp = await handler.onEvent();
                    expect(resp).toEqual({ EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
                    expect(mocks.actualRequest.updateClusterVersionRequest).toEqual({
                        name: 'physical-resource-id',
                        version: '12.34',
                    });
                    expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
                });
                test('from a specific value to another value', async () => {
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
                        version: '2.0',
                    }, {
                        version: '1.1',
                    }));
                    const resp = await handler.onEvent();
                    expect(resp).toEqual({ EksUpdateId: mocks.MOCK_UPDATE_STATUS_ID });
                    expect(mocks.actualRequest.updateClusterVersionRequest).toEqual({
                        name: 'physical-resource-id',
                        version: '2.0',
                    });
                    expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
                });
                test('to a new value that is already the current version', async () => {
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
                        version: '1.0',
                    }));
                    const resp = await handler.onEvent();
                    expect(resp).toEqual(undefined);
                    expect(mocks.actualRequest.describeClusterRequest).toEqual({ name: 'physical-resource-id' });
                    expect(mocks.actualRequest.updateClusterVersionRequest).toEqual(undefined);
                    expect(mocks.actualRequest.createClusterRequest).toEqual(undefined);
                });
                test('fails from specific value to undefined', async () => {
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
                        version: undefined,
                    }, {
                        version: '1.2',
                    }));
                    let error;
                    try {
                        await handler.onEvent();
                    }
                    catch (e) {
                        error = e;
                    }
                    expect(error.message).toEqual('Cannot remove cluster version configuration. Current version is 1.2');
                });
            });
            describe('logging or access change', () => {
                test('from undefined to partial logging enabled', async () => {
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                    expect(mocks.actualRequest.updateClusterConfigRequest).toEqual({
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
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                    expect(mocks.actualRequest.updateClusterConfigRequest).toEqual({
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
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                    let error;
                    try {
                        await handler.onEvent();
                    }
                    catch (e) {
                        error = e;
                    }
                    expect(error.message).toEqual('Cannot update logging and access at the same time');
                });
                test('both logging and access defined and modify both of them', async () => {
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                            endpointPublicAccess: false,
                            publicAccessCidrs: ['0.0.0.0/0'],
                        },
                    }, {
                        logging: {
                            clusterLogging: [
                                {
                                    types: ['api', 'audit', 'authenticator', 'controllerManager'],
                                    enabled: true,
                                },
                            ],
                        },
                        resourcesVpcConfig: {
                            endpointPrivateAccess: true,
                            endpointPublicAccess: true,
                            publicAccessCidrs: ['0.0.0.0/0'],
                        },
                    }));
                    let error;
                    try {
                        await handler.onEvent();
                    }
                    catch (e) {
                        error = e;
                    }
                    expect(error.message).toEqual('Cannot update logging and access at the same time');
                });
                test('Given logging enabled and unchanged, updating the only publicAccessCidrs is allowed ', async () => {
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                            publicAccessCidrs: ['1.2.3.4/32'],
                        },
                    }, {
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
                    }));
                    const resp = await handler.onEvent();
                    expect(resp).toEqual({ EksUpdateId: 'MockEksUpdateStatusId' });
                });
                test('Given logging enabled and unchanged, updating publicAccessCidrs from one to multiple entries is allowed ', async () => {
                    const handler = new cluster_1.ClusterResourceHandler(mocks.client, mocks.newRequest('Update', {
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
                            publicAccessCidrs: ['2.4.6.0/24', '1.2.3.4/32', '3.3.3.3/32'],
                        },
                    }, {
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
                            publicAccessCidrs: ['2.4.6.0/24'],
                        },
                    }));
                    const resp = await handler.onEvent();
                    expect(resp).toEqual({ EksUpdateId: 'MockEksUpdateStatusId' });
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci1yZXNvdXJjZS1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2x1c3Rlci1yZXNvdXJjZS1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQTBEO0FBQzFELHFFQUFpRjtBQUVqRixRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixJQUFJLENBQUMseUNBQXlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDekQsTUFBTSxPQUFPLEdBQUcsSUFBSSxnQ0FBc0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3ZHLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM3RCxPQUFPLEVBQUUsS0FBSyxDQUFDLG9CQUFvQjtnQkFDbkMsZUFBZSxFQUFFLDBDQUEwQzthQUM1RCxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDdkQsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLGtCQUFrQixFQUFFO29CQUNsQixTQUFTLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO29CQUNqQyxnQkFBZ0IsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO2lCQUN4QztnQkFDRCxJQUFJLEVBQUUsNEJBQTRCO2FBQ25DLENBQUMsQ0FBQztR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RUFBRSxDQUFDLENBQUM7Z0JBQ2pFLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBtb2NrcyBmcm9tICcuL2NsdXN0ZXItcmVzb3VyY2UtaGFuZGxlci1tb2Nrcyc7XG5pbXBvcnQgeyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyIH0gZnJvbSAnLi4vbGliL2NsdXN0ZXItcmVzb3VyY2UtaGFuZGxlci9jbHVzdGVyJztcblxuZGVzY3JpYmUoJ2NsdXN0ZXIgcmVzb3VyY2UgcHJvdmlkZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIG1vY2tzLnJlc2V0KCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjcmVhdGUnLCAoKSA9PiB7XG4gICAgdGVzdCgnb25DcmVhdGU6IG1pbmltYWwgZGVmYXVsdHMgKHZwYyArIHJvbGUpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnQ3JlYXRlJywgbW9ja3MuTU9DS19QUk9QUykpO1xuICAgICAgYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG5cbiAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNvbmZpZ3VyZUFzc3VtZVJvbGVSZXF1ZXN0KS50b0VxdWFsKHtcbiAgICAgICAgUm9sZUFybjogbW9ja3MuTU9DS19BU1NVTUVfUk9MRV9BUk4sXG4gICAgICAgIFJvbGVTZXNzaW9uTmFtZTogJ0FXU0NESy5FS1NDbHVzdGVyLkNyZWF0ZS5mYWtlLXJlcXVlc3QtaWQnLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0KS50b0VxdWFsKHtcbiAgICAgICAgcm9sZUFybjogJ2FybjpvZjpyb2xlJyxcbiAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgc3VibmV0SWRzOiBbJ3N1Ym5ldDEnLCAnc3VibmV0MiddLFxuICAgICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IFsnc2cxJywgJ3NnMicsICdzZzMnXSxcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogJ015UmVzb3VyY2VJZC1mYWtlcmVxdWVzdGlkJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZ2VuZXJhdGVkIGNsdXN0ZXIgbmFtZSBkb2VzIG5vdCBleGNlZWQgMTAwIGNoYXJhY3RlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgcmVxOiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUNyZWF0ZUV2ZW50ID0ge1xuICAgICAgICBTdGFja0lkOiAnZmFrZS1zdGFjay1pZCcsXG4gICAgICAgIFJlcXVlc3RJZDogJzYwMmMwNzhhLTYxODEtNDM1Mi05Njc2LTRmMDAzNTI0NDVhYScsXG4gICAgICAgIFJlc291cmNlVHlwZTogJ0N1c3RvbTo6RUtTQ2x1c3RlcicsXG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ2Jvb20nLFxuICAgICAgICBMb2dpY2FsUmVzb3VyY2VJZDogJ2hlbGxvJy5yZXBlYXQoMzApLCAvLyAxNTAgY2hhcnMgKGxpbWl0IGlzIDEwMClcbiAgICAgICAgUmVzcG9uc2VVUkw6ICdodHRwOi8vcmVzcG9uc2UtdXJsJyxcbiAgICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46ICdib29tJyxcbiAgICAgICAgICBDb25maWc6IG1vY2tzLk1PQ0tfUFJPUFMsXG4gICAgICAgICAgQXNzdW1lUm9sZUFybjogbW9ja3MuTU9DS19BU1NVTUVfUk9MRV9BUk4sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCByZXEpO1xuICAgICAgYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0Py5uYW1lLmxlbmd0aCkudG9FcXVhbCgxMDApO1xuICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QuY3JlYXRlQ2x1c3RlclJlcXVlc3Q/Lm5hbWUpLnRvRXF1YWwoJ2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGUtNjAyYzA3OGE2MTgxNDM1Mjk2NzY0ZjAwMzUyNDQ1YWEnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29uQ3JlYXRlOiBleHBsaWNpdCBjbHVzdGVyIG5hbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdDcmVhdGUnLCB7XG4gICAgICAgIC4uLm1vY2tzLk1PQ0tfUFJPUFMsXG4gICAgICAgIG5hbWU6ICdFeHBsaWNpdEN1c3RvbU5hbWUnLFxuICAgICAgfSkpO1xuICAgICAgYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG5cbiAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0IS5uYW1lKS50b0VxdWFsKCdFeHBsaWNpdEN1c3RvbU5hbWUnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggbm8gc3BlY2lmaWMgdmVyc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ0NyZWF0ZScsIHtcbiAgICAgICAgLi4ubW9ja3MuTU9DS19QUk9QUyxcbiAgICAgICAgdmVyc2lvbjogJzEyLjM0LjU2JyxcbiAgICAgIH0pKTtcbiAgICAgIGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuXG4gICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC5jcmVhdGVDbHVzdGVyUmVxdWVzdCEudmVyc2lvbikudG9FcXVhbCgnMTIuMzQuNTYnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lzQ3JlYXRlQ29tcGxldGUgc3RpbGwgbm90IGNvbXBsZXRlIGlmIGNsdXN0ZXIgaXMgbm90IEFDVElWRScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ0NyZWF0ZScpKTtcbiAgICAgIG1vY2tzLnNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyUmVzcG9uc2VNb2NrU3RhdHVzID0gJ0NSRUFUSU5HJztcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcbiAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmRlc2NyaWJlQ2x1c3RlclJlcXVlc3QhLm5hbWUpLnRvRXF1YWwoJ3BoeXNpY2FsLXJlc291cmNlLWlkJyk7XG4gICAgICBleHBlY3QocmVzcCkudG9FcXVhbCh7IElzQ29tcGxldGU6IGZhbHNlIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaXNDcmVhdGVDb21wbGV0ZSB0aHJvd3MgaWYgY2x1c3RlciBpcyBGQUlMRUQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdDcmVhdGUnKSk7XG4gICAgICBtb2Nrcy5zaW11bGF0ZVJlc3BvbnNlLmRlc2NyaWJlQ2x1c3RlclJlc3BvbnNlTW9ja1N0YXR1cyA9ICdGQUlMRUQnO1xuICAgICAgYXdhaXQgZXhwZWN0KGhhbmRsZXIuaXNDb21wbGV0ZSgpKS5yZWplY3RzLnRvVGhyb3coJ0NsdXN0ZXIgaXMgaW4gYSBGQUlMRUQgc3RhdHVzJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpc1VwZGF0ZUNvbXBsZXRlIHRocm93cyBpZiBjbHVzdGVyIGlzIEZBSUxFRCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScpKTtcbiAgICAgIG1vY2tzLnNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyUmVzcG9uc2VNb2NrU3RhdHVzID0gJ0ZBSUxFRCc7XG4gICAgICBhd2FpdCBleHBlY3QoaGFuZGxlci5pc0NvbXBsZXRlKCkpLnJlamVjdHMudG9UaHJvdygnQ2x1c3RlciBpcyBpbiBhIEZBSUxFRCBzdGF0dXMnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lzQ3JlYXRlQ29tcGxldGUgaXMgY29tcGxldGUgd2hlbiBjbHVzdGVyIGlzIEFDVElWRScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ0NyZWF0ZScpKTtcbiAgICAgIG1vY2tzLnNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyUmVzcG9uc2VNb2NrU3RhdHVzID0gJ0FDVElWRSc7XG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5pc0NvbXBsZXRlKCk7XG4gICAgICBleHBlY3QocmVzcCkudG9FcXVhbCh7XG4gICAgICAgIElzQ29tcGxldGU6IHRydWUsXG4gICAgICAgIERhdGE6IHtcbiAgICAgICAgICBOYW1lOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnLFxuICAgICAgICAgIEVuZHBvaW50OiAnaHR0cDovL2VuZHBvaW50JyxcbiAgICAgICAgICBBcm46ICdhcm46Y2x1c3Rlci1hcm4nLFxuICAgICAgICAgIENlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogJ2NlcnRpZmljYXRlQXV0aG9yaXR5LWRhdGEnLFxuICAgICAgICAgIENsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6ICcnLFxuICAgICAgICAgIEVuY3J5cHRpb25Db25maWdLZXlBcm46ICcnLFxuICAgICAgICAgIE9wZW5JZENvbm5lY3RJc3N1ZXJVcmw6ICcnLFxuICAgICAgICAgIE9wZW5JZENvbm5lY3RJc3N1ZXI6ICcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlbmNyeXB0aW9uIGNvbmZpZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ0NyZWF0ZScsIHtcbiAgICAgICAgLi4ubW9ja3MuTU9DS19QUk9QUyxcbiAgICAgICAgZW5jcnlwdGlvbkNvbmZpZzogW3sgcHJvdmlkZXI6IHsga2V5QXJuOiAnYXdzOmttczprZXknIH0sIHJlc291cmNlczogWydzZWNyZXRzJ10gfV0sXG4gICAgICB9KSk7XG5cbiAgICAgIGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuXG4gICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC5jcmVhdGVDbHVzdGVyUmVxdWVzdCkudG9FcXVhbCh7XG4gICAgICAgIHJvbGVBcm46ICdhcm46b2Y6cm9sZScsXG4gICAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzoge1xuICAgICAgICAgIHN1Ym5ldElkczogWydzdWJuZXQxJywgJ3N1Ym5ldDInXSxcbiAgICAgICAgICBzZWN1cml0eUdyb3VwSWRzOiBbJ3NnMScsICdzZzInLCAnc2czJ10sXG4gICAgICAgIH0sXG4gICAgICAgIGVuY3J5cHRpb25Db25maWc6IFt7IHByb3ZpZGVyOiB7IGtleUFybjogJ2F3czprbXM6a2V5JyB9LCByZXNvdXJjZXM6IFsnc2VjcmV0cyddIH1dLFxuICAgICAgICBuYW1lOiAnTXlSZXNvdXJjZUlkLWZha2VyZXF1ZXN0aWQnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZWxldGUnLCAoKSA9PiB7XG4gICAgdGVzdCgncmV0dXJucyBjb3JyZWN0IHBoeXNpY2FsIG5hbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdEZWxldGUnKSk7XG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG4gICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC5kZWxldGVDbHVzdGVyUmVxdWVzdCEubmFtZSkudG9FcXVhbCgncGh5c2ljYWwtcmVzb3VyY2UtaWQnKTtcbiAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHsgUGh5c2ljYWxSZXNvdXJjZUlkOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb25EZWxldGUgaWdub3JlcyBSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnRGVsZXRlJykpO1xuICAgICAgbW9ja3Muc2ltdWxhdGVSZXNwb25zZS5kZWxldGVDbHVzdGVyRXJyb3JDb2RlID0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nO1xuICAgICAgYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpc0RlbGV0ZUNvbXBsZXRlIHJldHVybnMgZmFsc2UgYXMgbG9uZyBhcyBkZXNjcmliZUNsdXN0ZXIgc3VjY2VlZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdEZWxldGUnKSk7XG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5pc0NvbXBsZXRlKCk7XG4gICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC5kZXNjcmliZUNsdXN0ZXJSZXF1ZXN0IS5uYW1lKS50b0VxdWFsKCdwaHlzaWNhbC1yZXNvdXJjZS1pZCcpO1xuICAgICAgZXhwZWN0KHJlc3AuSXNDb21wbGV0ZSkudG9FcXVhbChmYWxzZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpc0RlbGV0ZUNvbXBsZXRlIHJldHVybnMgdHJ1ZSB3aGVuIGRlc2NyaWJlQ2x1c3RlciB0aHJvd3MgYSBSZXNvdXJjZU5vdEZvdW5kIGV4Y2VwdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ0RlbGV0ZScpKTtcbiAgICAgIG1vY2tzLnNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyRXhjZXB0aW9uQ29kZSA9ICdSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uJztcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcbiAgICAgIGV4cGVjdChyZXNwLklzQ29tcGxldGUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpc0RlbGV0ZUNvbXBsZXRlIHByb3BhZ2F0ZXMgb3RoZXIgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnRGVsZXRlJykpO1xuICAgICAgbW9ja3Muc2ltdWxhdGVSZXNwb25zZS5kZXNjcmliZUNsdXN0ZXJFeGNlcHRpb25Db2RlID0gJ090aGVyRXhjZXB0aW9uJztcbiAgICAgIGxldCBlcnJvcjogYW55O1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgaGFuZGxlci5pc0NvbXBsZXRlKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9yID0gZTtcbiAgICAgIH1cbiAgICAgIGV4cGVjdChlcnJvci5jb2RlKS50b0VxdWFsKCdPdGhlckV4Y2VwdGlvbicpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlJywgKCkgPT4ge1xuICAgIHRlc3QoJ25vIGNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScsIG1vY2tzLk1PQ0tfUFJPUFMsIG1vY2tzLk1PQ0tfUFJPUFMpKTtcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcbiAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC5jcmVhdGVDbHVzdGVyUmVxdWVzdCkudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QudXBkYXRlQ2x1c3RlckNvbmZpZ1JlcXVlc3QpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LnVwZGF0ZUNsdXN0ZXJWZXJzaW9uUmVxdWVzdCkudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaXNVcGRhdGVDb21wbGV0ZSBpcyBub3QgY29tcGxldGUgd2hlbiBzdGF0dXMgaXMgbm90IEFDVElWRScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScpKTtcbiAgICAgIG1vY2tzLnNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVDbHVzdGVyUmVzcG9uc2VNb2NrU3RhdHVzID0gJ1VQREFUSU5HJztcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcbiAgICAgIGV4cGVjdChyZXNwLklzQ29tcGxldGUpLnRvRXF1YWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaXNVcGRhdGVDb21wbGV0ZSB3YWl0cyBmb3IgQUNUSVZFJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJykpO1xuICAgICAgbW9ja3Muc2ltdWxhdGVSZXNwb25zZS5kZXNjcmliZUNsdXN0ZXJSZXNwb25zZU1vY2tTdGF0dXMgPSAnQUNUSVZFJztcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcbiAgICAgIGV4cGVjdChyZXNwLklzQ29tcGxldGUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncmVxdWlyZXMgcmVwbGFjZW1lbnQnLCAoKSA9PiB7XG4gICAgICBkZXNjcmliZSgnbmFtZSBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIHRlc3QoJ2V4cGxpY2l0IG5hbWUgY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgcmVxID0gbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJywge1xuICAgICAgICAgICAgLi4ubW9ja3MuTU9DS19QUk9QUyxcbiAgICAgICAgICAgIG5hbWU6ICduZXctY2x1c3Rlci1uYW1lLTEyMzQnLFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6ICdvbGQtY2x1c3Rlci1uYW1lJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCByZXEpO1xuXG4gICAgICAgICAgLy8gV0hFTlxuICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcblxuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC5jcmVhdGVDbHVzdGVyUmVxdWVzdCEpLnRvRXF1YWwoe1xuICAgICAgICAgICAgbmFtZTogJ25ldy1jbHVzdGVyLW5hbWUtMTIzNCcsXG4gICAgICAgICAgICByb2xlQXJuOiAnYXJuOm9mOnJvbGUnLFxuICAgICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdWJuZXRJZHM6IFsnc3VibmV0MScsICdzdWJuZXQyJ10sXG4gICAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IFsnc2cxJywgJ3NnMicsICdzZzMnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZXhwZWN0KHJlc3ApLnRvRXF1YWwoeyBQaHlzaWNhbFJlc291cmNlSWQ6ICduZXctY2x1c3Rlci1uYW1lLTEyMzQnIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0KCdmcm9tIGF1dG8tZ2VuIG5hbWUgdG8gZXhwbGljaXQgbmFtZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHJlcSA9IG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScsIHtcbiAgICAgICAgICAgIC4uLm1vY2tzLk1PQ0tfUFJPUFMsXG4gICAgICAgICAgICBuYW1lOiB1bmRlZmluZWQsIC8vIGF1dG8tZ2VuXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogJ2V4cGxpY2l0JywgLy8gYXV0by1nZW5cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIHJlcSk7XG5cbiAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuXG4gICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0ISkudG9FcXVhbCh7XG4gICAgICAgICAgICBuYW1lOiAnTXlSZXNvdXJjZUlkLWZha2VyZXF1ZXN0aWQnLFxuICAgICAgICAgICAgcm9sZUFybjogJ2FybjpvZjpyb2xlJyxcbiAgICAgICAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3VibmV0SWRzOiBbJ3N1Ym5ldDEnLCAnc3VibmV0MiddLFxuICAgICAgICAgICAgICBzZWN1cml0eUdyb3VwSWRzOiBbJ3NnMScsICdzZzInLCAnc2czJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHsgUGh5c2ljYWxSZXNvdXJjZUlkOiAnTXlSZXNvdXJjZUlkLWZha2VyZXF1ZXN0aWQnIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdzdWJuZXRzIG9yIHNlY3VyaXR5IGdyb3VwcyByZXF1aXJlcyBhIHJlcGxhY2VtZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgLi4ubW9ja3MuTU9DS19QUk9QUyxcbiAgICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgICAgIHN1Ym5ldElkczogWydzdWJuZXQxJywgJ3N1Ym5ldDInXSxcbiAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IFsnc2cxJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSwge1xuICAgICAgICAgIC4uLm1vY2tzLk1PQ0tfUFJPUFMsXG4gICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgICBzdWJuZXRJZHM6IFsnc3VibmV0MSddLFxuICAgICAgICAgICAgc2VjdXJpdHlHcm91cElkczogWydzZzInXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSk7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcblxuICAgICAgICBleHBlY3QocmVzcCkudG9FcXVhbCh7IFBoeXNpY2FsUmVzb3VyY2VJZDogJ015UmVzb3VyY2VJZC1mYWtlcmVxdWVzdGlkJyB9KTtcbiAgICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QuY3JlYXRlQ2x1c3RlclJlcXVlc3QpLnRvRXF1YWwoe1xuICAgICAgICAgIG5hbWU6ICdNeVJlc291cmNlSWQtZmFrZXJlcXVlc3RpZCcsXG4gICAgICAgICAgcm9sZUFybjogJ2FybjpvZjpyb2xlJyxcbiAgICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6XG4gICAgICAgICAge1xuICAgICAgICAgICAgc3VibmV0SWRzOiBbJ3N1Ym5ldDEnLCAnc3VibmV0MiddLFxuICAgICAgICAgICAgc2VjdXJpdHlHcm91cElkczogWydzZzEnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdjaGFuZ2Ugc3VibmV0cyBvciBzZWN1cml0eSBncm91cHMgb3JkZXIgc2hvdWxkIG5vdCB0cmlnZ2VyIGFuIHVwZGF0ZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJywge1xuICAgICAgICAgIC4uLm1vY2tzLk1PQ0tfUFJPUFMsXG4gICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgICBzdWJuZXRJZHM6IFsnc3VibmV0MScsICdzdWJuZXQyJ10sXG4gICAgICAgICAgICBzZWN1cml0eUdyb3VwSWRzOiBbJ3NnMScsICdzZzInXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LCB7XG4gICAgICAgICAgLi4ubW9ja3MuTU9DS19QUk9QUyxcbiAgICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgICAgIHN1Ym5ldElkczogWydzdWJuZXQyJywgJ3N1Ym5ldDEnXSxcbiAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IFsnc2cyJywgJ3NnMSddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pKTtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuXG4gICAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnXCJyb2xlQXJuXCIgcmVxdWlyZXMgYSByZXBsYWNlbWVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJywge1xuICAgICAgICAgIHJvbGVBcm46ICduZXctYXJuJyxcbiAgICAgICAgfSwge1xuICAgICAgICAgIHJvbGVBcm46ICdvbGQtYXJuJyxcbiAgICAgICAgfSkpO1xuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG5cbiAgICAgICAgZXhwZWN0KHJlc3ApLnRvRXF1YWwoeyBQaHlzaWNhbFJlc291cmNlSWQ6ICdNeVJlc291cmNlSWQtZmFrZXJlcXVlc3RpZCcgfSk7XG4gICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0KS50b0VxdWFsKHtcbiAgICAgICAgICBuYW1lOiAnTXlSZXNvdXJjZUlkLWZha2VyZXF1ZXN0aWQnLFxuICAgICAgICAgIHJvbGVBcm46ICduZXctYXJuJyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZmFpbHMgaWYgY2x1c3RlciBoYXMgYW4gZXhwbGljaXQgXCJuYW1lXCIgdGhhdCBpcyB0aGUgc2FtZSBhcyB0aGUgb2xkIFwibmFtZVwiJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgcm9sZUFybjogJ25ldy1hcm4nLFxuICAgICAgICAgIG5hbWU6ICdleHBsaWNpdC1jbHVzdGVyLW5hbWUnLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgcm9sZUFybjogJ29sZC1hcm4nLFxuICAgICAgICAgIG5hbWU6ICdleHBsaWNpdC1jbHVzdGVyLW5hbWUnLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBsZXQgZXJyOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0KGVycj8ubWVzc2FnZSkudG9FcXVhbCgnQ2Fubm90IHJlcGxhY2UgY2x1c3RlciBcImV4cGxpY2l0LWNsdXN0ZXItbmFtZVwiIHNpbmNlIGl0IGhhcyBhbiBleHBsaWNpdCBwaHlzaWNhbCBuYW1lLiBFaXRoZXIgcmVuYW1lIHRoZSBjbHVzdGVyIG9yIHJlbW92ZSB0aGUgXCJuYW1lXCIgY29uZmlndXJhdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3N1Y2NlZWRzIGlmIGNsdXN0ZXIgaGFkIGFuIGV4cGxpY2l0IFwibmFtZVwiIGFuZCBub3cgaXQgZG9lcyBub3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScsIHtcbiAgICAgICAgICByb2xlQXJuOiAnbmV3LWFybicsXG4gICAgICAgICAgbmFtZTogdW5kZWZpbmVkLCAvLyBhdXRvLWdlblxuICAgICAgICB9LCB7XG4gICAgICAgICAgcm9sZUFybjogJ29sZC1hcm4nLFxuICAgICAgICAgIG5hbWU6ICdleHBsaWNpdC1jbHVzdGVyLW5hbWUnLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QocmVzcCkudG9FcXVhbCh7IFBoeXNpY2FsUmVzb3VyY2VJZDogJ015UmVzb3VyY2VJZC1mYWtlcmVxdWVzdGlkJyB9KTtcbiAgICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QuY3JlYXRlQ2x1c3RlclJlcXVlc3QpLnRvRXF1YWwoe1xuICAgICAgICAgIG5hbWU6ICdNeVJlc291cmNlSWQtZmFrZXJlcXVlc3RpZCcsXG4gICAgICAgICAgcm9sZUFybjogJ25ldy1hcm4nLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdzdWNjZWVkcyBpZiBjbHVzdGVyIGhhZCBhbiBleHBsaWNpdCBcIm5hbWVcIiBhbmQgbm93IGl0IGhhcyBhIGRpZmZlcmVudCBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgcm9sZUFybjogJ25ldy1hcm4nLFxuICAgICAgICAgIG5hbWU6ICduZXctZXhwbGljaXQtY2x1c3Rlci1uYW1lJyxcbiAgICAgICAgfSwge1xuICAgICAgICAgIHJvbGVBcm46ICdvbGQtYXJuJyxcbiAgICAgICAgICBuYW1lOiAnb2xkLWV4cGxpY2l0LWNsdXN0ZXItbmFtZScsXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHsgUGh5c2ljYWxSZXNvdXJjZUlkOiAnbmV3LWV4cGxpY2l0LWNsdXN0ZXItbmFtZScgfSk7XG4gICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0KS50b0VxdWFsKHtcbiAgICAgICAgICBuYW1lOiAnbmV3LWV4cGxpY2l0LWNsdXN0ZXItbmFtZScsXG4gICAgICAgICAgcm9sZUFybjogJ25ldy1hcm4nLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZW5jcnlwdGlvbiBjb25maWcgY2Fubm90IGJlIHVwZGF0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJywge1xuICAgICAgICBlbmNyeXB0aW9uQ29uZmlnOiBbeyByZXNvdXJjZXM6IFsnc2VjcmV0cyddLCBwcm92aWRlcjogeyBrZXlBcm46ICdrZXk6YXJuOjEnIH0gfV0sXG4gICAgICB9LCB7XG4gICAgICAgIGVuY3J5cHRpb25Db25maWc6IFt7IHJlc291cmNlczogWydzZWNyZXRzJ10sIHByb3ZpZGVyOiB7IGtleUFybjogJ2tleTphcm46MicgfSB9XSxcbiAgICAgIH0pKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3IgPSBlO1xuICAgICAgfVxuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZXJyb3IpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9FcXVhbCgnQ2Fubm90IHVwZGF0ZSBjbHVzdGVyIGVuY3J5cHRpb24gY29uZmlndXJhdGlvbicpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzVXBkYXRlQ29tcGxldGUgd2l0aCBFS1MgdXBkYXRlIElEJywgKCkgPT4ge1xuICAgICAgdGVzdCgnd2l0aCBcIkZhaWxlZFwiIHN0YXR1cycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnKTtcbiAgICAgICAgY29uc3QgaXNDb21wbGV0ZUhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIHtcbiAgICAgICAgICAuLi5ldmVudCxcbiAgICAgICAgICBFa3NVcGRhdGVJZDogJ2Zvb2JhcicsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vY2tzLnNpbXVsYXRlUmVzcG9uc2UuZGVzY3JpYmVVcGRhdGVSZXNwb25zZU1vY2tTdGF0dXMgPSAnRmFpbGVkJztcbiAgICAgICAgbW9ja3Muc2ltdWxhdGVSZXNwb25zZS5kZXNjcmliZVVwZGF0ZVJlc3BvbnNlTW9ja0Vycm9ycyA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICdlcnJvck1lc3NhZ2VNb2NrJyxcbiAgICAgICAgICAgIGVycm9yQ29kZTogJ2Vycm9yQ29kZU1vY2snLFxuICAgICAgICAgICAgcmVzb3VyY2VJZHM6IFtcbiAgICAgICAgICAgICAgJ2ZvbycsICdiYXInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGxldCBlcnJvcjogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGlzQ29tcGxldGVIYW5kbGVyLmlzQ29tcGxldGUoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGVycm9yID0gZTtcbiAgICAgICAgfVxuICAgICAgICBleHBlY3QoZXJyb3IpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmRlc2NyaWJlVXBkYXRlUmVxdWVzdCkudG9FcXVhbCh7IG5hbWU6ICdwaHlzaWNhbC1yZXNvdXJjZS1pZCcsIHVwZGF0ZUlkOiAnZm9vYmFyJyB9KTtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvRXF1YWwoJ2NsdXN0ZXIgdXBkYXRlIGlkIFwiZm9vYmFyXCIgZmFpbGVkIHdpdGggZXJyb3JzOiBbe1wiZXJyb3JNZXNzYWdlXCI6XCJlcnJvck1lc3NhZ2VNb2NrXCIsXCJlcnJvckNvZGVcIjpcImVycm9yQ29kZU1vY2tcIixcInJlc291cmNlSWRzXCI6W1wiZm9vXCIsXCJiYXJcIl19XScpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggXCJJblByb2dyZXNzXCIgc3RhdHVzLCByZXR1cm5zIElzQ29tcGxldGU9ZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJyk7XG4gICAgICAgIGNvbnN0IGlzQ29tcGxldGVIYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCB7XG4gICAgICAgICAgLi4uZXZlbnQsXG4gICAgICAgICAgRWtzVXBkYXRlSWQ6ICdmb29iYXInLFxuICAgICAgICB9KTtcblxuICAgICAgICBtb2Nrcy5zaW11bGF0ZVJlc3BvbnNlLmRlc2NyaWJlVXBkYXRlUmVzcG9uc2VNb2NrU3RhdHVzID0gJ0luUHJvZ3Jlc3MnO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaXNDb21wbGV0ZUhhbmRsZXIuaXNDb21wbGV0ZSgpO1xuXG4gICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmRlc2NyaWJlVXBkYXRlUmVxdWVzdCkudG9FcXVhbCh7IG5hbWU6ICdwaHlzaWNhbC1yZXNvdXJjZS1pZCcsIHVwZGF0ZUlkOiAnZm9vYmFyJyB9KTtcbiAgICAgICAgZXhwZWN0KHJlc3BvbnNlLklzQ29tcGxldGUpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggXCJTdWNjZXNzZnVsXCIgc3RhdHVzLCByZXR1cm5zIElzQ29tcGxldGU9dHJ1ZSB3aXRoIFwiRGF0YVwiJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBldmVudCA9IG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScpO1xuICAgICAgICBjb25zdCBpc0NvbXBsZXRlSGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwge1xuICAgICAgICAgIC4uLmV2ZW50LFxuICAgICAgICAgIEVrc1VwZGF0ZUlkOiAnZm9vYmFyJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9ja3Muc2ltdWxhdGVSZXNwb25zZS5kZXNjcmliZVVwZGF0ZVJlc3BvbnNlTW9ja1N0YXR1cyA9ICdTdWNjZXNzZnVsJztcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGlzQ29tcGxldGVIYW5kbGVyLmlzQ29tcGxldGUoKTtcblxuICAgICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC5kZXNjcmliZVVwZGF0ZVJlcXVlc3QpLnRvRXF1YWwoeyBuYW1lOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnLCB1cGRhdGVJZDogJ2Zvb2JhcicgfSk7XG4gICAgICAgIGV4cGVjdChyZXNwb25zZSkudG9FcXVhbCh7XG4gICAgICAgICAgSXNDb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgICBEYXRhOiB7XG4gICAgICAgICAgICBOYW1lOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnLFxuICAgICAgICAgICAgRW5kcG9pbnQ6ICdodHRwOi8vZW5kcG9pbnQnLFxuICAgICAgICAgICAgQXJuOiAnYXJuOmNsdXN0ZXItYXJuJyxcbiAgICAgICAgICAgIENlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogJ2NlcnRpZmljYXRlQXV0aG9yaXR5LWRhdGEnLFxuICAgICAgICAgICAgQ2x1c3RlclNlY3VyaXR5R3JvdXBJZDogJycsXG4gICAgICAgICAgICBFbmNyeXB0aW9uQ29uZmlnS2V5QXJuOiAnJyxcbiAgICAgICAgICAgIE9wZW5JZENvbm5lY3RJc3N1ZXJVcmw6ICcnLFxuICAgICAgICAgICAgT3BlbklkQ29ubmVjdElzc3VlcjogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpbi1wbGFjZScsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCd2ZXJzaW9uIGNoYW5nZScsICgpID0+IHtcbiAgICAgICAgdGVzdCgnZnJvbSB1bmRlZmluZWQgdG8gYSBzcGVjaWZpYyB2YWx1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgICB2ZXJzaW9uOiAnMTIuMzQnLFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuICAgICAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHsgRWtzVXBkYXRlSWQ6IG1vY2tzLk1PQ0tfVVBEQVRFX1NUQVRVU19JRCB9KTtcbiAgICAgICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC51cGRhdGVDbHVzdGVyVmVyc2lvblJlcXVlc3QhKS50b0VxdWFsKHtcbiAgICAgICAgICAgIG5hbWU6ICdwaHlzaWNhbC1yZXNvdXJjZS1pZCcsXG4gICAgICAgICAgICB2ZXJzaW9uOiAnMTIuMzQnLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0KS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ2Zyb20gYSBzcGVjaWZpYyB2YWx1ZSB0byBhbm90aGVyIHZhbHVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScsIHtcbiAgICAgICAgICAgIHZlcnNpb246ICcyLjAnLFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZlcnNpb246ICcxLjEnLFxuICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG9FcXVhbCh7IEVrc1VwZGF0ZUlkOiBtb2Nrcy5NT0NLX1VQREFURV9TVEFUVVNfSUQgfSk7XG4gICAgICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QudXBkYXRlQ2x1c3RlclZlcnNpb25SZXF1ZXN0ISkudG9FcXVhbCh7XG4gICAgICAgICAgICBuYW1lOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnLFxuICAgICAgICAgICAgdmVyc2lvbjogJzIuMCcsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QuY3JlYXRlQ2x1c3RlclJlcXVlc3QpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdCgndG8gYSBuZXcgdmFsdWUgdGhhdCBpcyBhbHJlYWR5IHRoZSBjdXJyZW50IHZlcnNpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJywge1xuICAgICAgICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcbiAgICAgICAgICBleHBlY3QocmVzcCkudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmRlc2NyaWJlQ2x1c3RlclJlcXVlc3QpLnRvRXF1YWwoeyBuYW1lOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnIH0pO1xuICAgICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LnVwZGF0ZUNsdXN0ZXJWZXJzaW9uUmVxdWVzdCkudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LmNyZWF0ZUNsdXN0ZXJSZXF1ZXN0KS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ2ZhaWxzIGZyb20gc3BlY2lmaWMgdmFsdWUgdG8gdW5kZWZpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2x1c3RlclJlc291cmNlSGFuZGxlcihtb2Nrcy5jbGllbnQsIG1vY2tzLm5ld1JlcXVlc3QoJ1VwZGF0ZScsIHtcbiAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICB2ZXJzaW9uOiAnMS4yJyxcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGVycm9yID0gZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9FcXVhbCgnQ2Fubm90IHJlbW92ZSBjbHVzdGVyIHZlcnNpb24gY29uZmlndXJhdGlvbi4gQ3VycmVudCB2ZXJzaW9uIGlzIDEuMicpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgnbG9nZ2luZyBvciBhY2Nlc3MgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICB0ZXN0KCdmcm9tIHVuZGVmaW5lZCB0byBwYXJ0aWFsIGxvZ2dpbmcgZW5hYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgICBsb2dnaW5nOiB7XG4gICAgICAgICAgICAgIGNsdXN0ZXJMb2dnaW5nOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZXM6IFsnYXBpJ10sXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxvZ2dpbmc6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuICAgICAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHsgRWtzVXBkYXRlSWQ6IG1vY2tzLk1PQ0tfVVBEQVRFX1NUQVRVU19JRCB9KTtcbiAgICAgICAgICBleHBlY3QobW9ja3MuYWN0dWFsUmVxdWVzdC51cGRhdGVDbHVzdGVyQ29uZmlnUmVxdWVzdCEpLnRvRXF1YWwoe1xuICAgICAgICAgICAgbmFtZTogJ3BoeXNpY2FsLXJlc291cmNlLWlkJyxcbiAgICAgICAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlczogWydhcGknXSxcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QuY3JlYXRlQ2x1c3RlclJlcXVlc3QpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdCgnZnJvbSBwYXJ0aWFsIHZwYyBjb25maWd1cmF0aW9uIHRvIG9ubHkgcHJpdmF0ZSBhY2Nlc3MgZW5hYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgICAgICAgc2VjdXJpdHlHcm91cElkczogWydzZzEnLCAnc2cyJywgJ3NnMyddLFxuICAgICAgICAgICAgICBlbmRwb2ludFByaXZhdGVBY2Nlc3M6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzoge1xuICAgICAgICAgICAgICBzZWN1cml0eUdyb3VwSWRzOiBbJ3NnMScsICdzZzInLCAnc2czJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG4gICAgICAgICAgZXhwZWN0KHJlc3ApLnRvRXF1YWwoeyBFa3NVcGRhdGVJZDogbW9ja3MuTU9DS19VUERBVEVfU1RBVFVTX0lEIH0pO1xuICAgICAgICAgIGV4cGVjdChtb2Nrcy5hY3R1YWxSZXF1ZXN0LnVwZGF0ZUNsdXN0ZXJDb25maWdSZXF1ZXN0ISkudG9FcXVhbCh7XG4gICAgICAgICAgICBuYW1lOiAncGh5c2ljYWwtcmVzb3VyY2UtaWQnLFxuICAgICAgICAgICAgbG9nZ2luZzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgZW5kcG9pbnRQdWJsaWNBY2Nlc3M6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgcHVibGljQWNjZXNzQ2lkcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZXhwZWN0KG1vY2tzLmFjdHVhbFJlcXVlc3QuY3JlYXRlQ2x1c3RlclJlcXVlc3QpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdCgnZnJvbSB1bmRlZmluZWQgdG8gYm90aCBsb2dnaW5nIGFuZCBhY2Nlc3MgZnVsbHkgZW5hYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgICBsb2dnaW5nOiB7XG4gICAgICAgICAgICAgIGNsdXN0ZXJMb2dnaW5nOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZXM6IFsnYXBpJywgJ2F1ZGl0JywgJ2F1dGhlbnRpY2F0b3InLCAnY29udHJvbGxlck1hbmFnZXInLCAnc2NoZWR1bGVyJ10sXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgZW5kcG9pbnRQdWJsaWNBY2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgIHB1YmxpY0FjY2Vzc0NpZHJzOiBbJzAuMC4wLjAvMCddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsb2dnaW5nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGVycm9yID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvRXF1YWwoJ0Nhbm5vdCB1cGRhdGUgbG9nZ2luZyBhbmQgYWNjZXNzIGF0IHRoZSBzYW1lIHRpbWUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRlc3QoJ2JvdGggbG9nZ2luZyBhbmQgYWNjZXNzIGRlZmluZWQgYW5kIG1vZGlmeSBib3RoIG9mIHRoZW0nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJywge1xuICAgICAgICAgICAgbG9nZ2luZzoge1xuICAgICAgICAgICAgICBjbHVzdGVyTG9nZ2luZzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGVzOiBbJ2FwaScsICdhdWRpdCcsICdhdXRoZW50aWNhdG9yJywgJ2NvbnRyb2xsZXJNYW5hZ2VyJywgJ3NjaGVkdWxlciddLFxuICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzoge1xuICAgICAgICAgICAgICBlbmRwb2ludFByaXZhdGVBY2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgcHVibGljQWNjZXNzQ2lkcnM6IFsnMC4wLjAuMC8wJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlczogWydhcGknLCAnYXVkaXQnLCAnYXV0aGVudGljYXRvcicsICdjb250cm9sbGVyTWFuYWdlciddLFxuICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzoge1xuICAgICAgICAgICAgICBlbmRwb2ludFByaXZhdGVBY2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICBwdWJsaWNBY2Nlc3NDaWRyczogWycwLjAuMC4wLzAnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIGxldCBlcnJvcjogYW55O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBlcnJvciA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0VxdWFsKCdDYW5ub3QgdXBkYXRlIGxvZ2dpbmcgYW5kIGFjY2VzcyBhdCB0aGUgc2FtZSB0aW1lJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0ZXN0KCdHaXZlbiBsb2dnaW5nIGVuYWJsZWQgYW5kIHVuY2hhbmdlZCwgdXBkYXRpbmcgdGhlIG9ubHkgcHVibGljQWNjZXNzQ2lkcnMgaXMgYWxsb3dlZCAnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyKG1vY2tzLmNsaWVudCwgbW9ja3MubmV3UmVxdWVzdCgnVXBkYXRlJywge1xuICAgICAgICAgICAgbG9nZ2luZzoge1xuICAgICAgICAgICAgICBjbHVzdGVyTG9nZ2luZzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGVzOiBbJ2FwaScsICdhdWRpdCcsICdhdXRoZW50aWNhdG9yJywgJ2NvbnRyb2xsZXJNYW5hZ2VyJywgJ3NjaGVkdWxlciddLFxuICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzoge1xuICAgICAgICAgICAgICBlbmRwb2ludFByaXZhdGVBY2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICBwdWJsaWNBY2Nlc3NDaWRyczogWycxLjIuMy40LzMyJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlczogWydhcGknLCAnYXVkaXQnLCAnYXV0aGVudGljYXRvcicsICdjb250cm9sbGVyTWFuYWdlcicsICdzY2hlZHVsZXInXSxcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgICAgICAgZW5kcG9pbnRQcml2YXRlQWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICBlbmRwb2ludFB1YmxpY0FjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgcHVibGljQWNjZXNzQ2lkcnM6IFsnMC4wLjAuMC8wJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5vbkV2ZW50KCk7XG4gICAgICAgICAgZXhwZWN0KHJlc3ApLnRvRXF1YWwoeyBFa3NVcGRhdGVJZDogJ01vY2tFa3NVcGRhdGVTdGF0dXNJZCcgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0ZXN0KCdHaXZlbiBsb2dnaW5nIGVuYWJsZWQgYW5kIHVuY2hhbmdlZCwgdXBkYXRpbmcgcHVibGljQWNjZXNzQ2lkcnMgZnJvbSBvbmUgdG8gbXVsdGlwbGUgZW50cmllcyBpcyBhbGxvd2VkICcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIobW9ja3MuY2xpZW50LCBtb2Nrcy5uZXdSZXF1ZXN0KCdVcGRhdGUnLCB7XG4gICAgICAgICAgICBsb2dnaW5nOiB7XG4gICAgICAgICAgICAgIGNsdXN0ZXJMb2dnaW5nOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZXM6IFsnYXBpJywgJ2F1ZGl0JywgJ2F1dGhlbnRpY2F0b3InLCAnY29udHJvbGxlck1hbmFnZXInLCAnc2NoZWR1bGVyJ10sXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgZW5kcG9pbnRQdWJsaWNBY2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgIHB1YmxpY0FjY2Vzc0NpZHJzOiBbJzIuNC42LjAvMjQnLCAnMS4yLjMuNC8zMicsICczLjMuMy4zLzMyJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlczogWydhcGknLCAnYXVkaXQnLCAnYXV0aGVudGljYXRvcicsICdjb250cm9sbGVyTWFuYWdlcicsICdzY2hlZHVsZXInXSxcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgICAgICAgZW5kcG9pbnRQcml2YXRlQWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICBlbmRwb2ludFB1YmxpY0FjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgcHVibGljQWNjZXNzQ2lkcnM6IFsnMi40LjYuMC8yNCddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuICAgICAgICAgIGV4cGVjdChyZXNwKS50b0VxdWFsKHsgRWtzVXBkYXRlSWQ6ICdNb2NrRWtzVXBkYXRlU3RhdHVzSWQnIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19