
import * as eks from '@aws-sdk/client-eks';
import * as sinon from 'sinon';
import { FARGATE_PROFILE_RESOURCE_TYPE } from '../../lib/aws-eks/cluster-resource-handler/consts';
import { FargateProfileResourceHandler } from '../../lib/aws-eks/cluster-resource-handler/fargate';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('fargate resource provider', () => {
  describe('create', () => {
    test('calls createFargateProfile with a generated name', async () => {
      // GIVEN
      const client = newEksClientMock();
      const handler = new FargateProfileResourceHandler(client, newRequestMock());

      // WHEN
      const onEventResponse = await handler.onEvent();

      // THEN
      sinon.assert.calledWithExactly(client.configureAssumeRole, {
        RoleArn: 'AssumeRoleArn',
        RoleSessionName: 'AWSCDK.EKSCluster.Create.RequestIdMock',
      });

      sinon.assert.calledWithExactly(client.createFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'LogicalResourceIdMock-RequestIdMock',
      });

      expect(onEventResponse).toEqual({
        PhysicalResourceId: 'MockProfileName',
        Data: { fargateProfileArn: 'MockProfileArn' },
      });
    });

    test('respects physical name if provided', async () => {
      // GIVEN
      const client = newEksClientMock();
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        ResourceProperties: {
          AssumeRoleArn: 'AssumeRoleArnMock',
          Config: {
            fargateProfileName: 'MyProfileNameBoom',
            clusterName: 'MockClusterName',
          },
        },
      }));

      // WHEN
      const onEventResponse = await handler.onEvent();

      // THEN
      sinon.assert.calledWithExactly(client.createFargateProfile, {
        fargateProfileName: 'MyProfileNameBoom',
        clusterName: 'MockClusterName',
      });

      expect(onEventResponse).toEqual({
        PhysicalResourceId: 'MockProfileName',
        Data: { fargateProfileArn: 'MockProfileArn' },
      });
    });

    test('isComplete returns true if fargate profile is ACTIVE', async () => {
      // GIVEN
      const client = newEksClientMock();

      client.describeFargateProfile = sinon.fake.returns({
        fargateProfile: {
          status: 'ACTIVE',
        },
      });

      // WHEN
      const handler = new FargateProfileResourceHandler(client, newRequestMock());
      const resp = await handler.isComplete();

      // THEN
      sinon.assert.calledWithExactly(client.describeFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'PhysicalResourceIdMock',
      });

      expect(resp.IsComplete).toEqual(true);
    });

    test('isComplete returns false as long as fargate profile is CREATING', async () => {
      // GIVEN
      const client = newEksClientMock();

      client.describeFargateProfile = sinon.fake.returns({
        fargateProfile: {
          status: 'CREATING',
        },
      });

      // WHEN
      const handler = new FargateProfileResourceHandler(client, newRequestMock());
      const resp = await handler.isComplete();

      // THEN
      sinon.assert.calledWithExactly(client.describeFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'PhysicalResourceIdMock',
      });

      expect(resp.IsComplete).toEqual(false);
    });

    test('isComplete throws an exception if the status is CREATE_FAILED', async () => {
      // GIVEN
      const client = newEksClientMock();

      client.describeFargateProfile = sinon.fake.returns({
        fargateProfile: {
          status: 'CREATE_FAILED',
        },
      });

      // WHEN
      const handler = new FargateProfileResourceHandler(client, newRequestMock());

      let error: any;
      try {
        await handler.isComplete();
      } catch (e) {
        error = e;
      }

      // THEN
      sinon.assert.calledWithExactly(client.describeFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'PhysicalResourceIdMock',
      });

      expect(error.message).toEqual('CREATE_FAILED');
    });
  });

  describe('update', () => {
    test('calls createFargateProfile with a new name', async () => {
      // GIVEN
      const client = newEksClientMock();
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Update',
      }));

      // WHEN
      const onEventResponse = await handler.onEvent();

      // THEN
      sinon.assert.calledWithExactly(client.configureAssumeRole, {
        RoleArn: 'AssumeRoleArn',
        RoleSessionName: 'AWSCDK.EKSCluster.Update.RequestIdMock',
      });

      sinon.assert.calledWithExactly(client.createFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'LogicalResourceIdMock-RequestIdMock',
      });

      expect(onEventResponse).toEqual({
        PhysicalResourceId: 'MockProfileName',
        Data: { fargateProfileArn: 'MockProfileArn' },
      });
    });
  });

  describe('delete', () => {
    test('calls deleteFargateProfile', async () => {
      // GIVEN
      const client = newEksClientMock();
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
      }));

      // WHEN
      const onEventResponse = await handler.onEvent();

      // THEN
      sinon.assert.calledWithExactly(client.configureAssumeRole, {
        RoleArn: 'AssumeRoleArn',
        RoleSessionName: 'AWSCDK.EKSCluster.Delete.RequestIdMock',
      });

      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'PhysicalResourceIdMock',
      });

      expect(onEventResponse).toEqual(undefined);
    });

    test('isComplete returns true when describeFargateProfile throws ResourceNotFoundException', async () => {
      // GIVEN
      const client = newEksClientMock();

      const resourceNotFoundError = new eks.ResourceNotFoundException({
        message: 'Cluster not found',
        $metadata: {
          httpStatusCode: 404,
        },
      });
      client.describeFargateProfile = sinon.fake.throws(resourceNotFoundError);

      // WHEN
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
      }));
      const resp = await handler.isComplete();

      // THEN
      sinon.assert.calledWithExactly(client.describeFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'PhysicalResourceIdMock',
      });

      expect(resp).toEqual({
        IsComplete: true,
      });
    });

    test('isComplete throws an exception if the status is DELETE_FAILED', async () => {
      // GIVEN
      const client = newEksClientMock();

      client.describeFargateProfile = sinon.fake.returns({
        fargateProfile: {
          status: 'DELETE_FAILED',
        },
      });

      // WHEN
      const handler = new FargateProfileResourceHandler(client, newRequestMock());

      let error: any;
      try {
        await handler.isComplete();
      } catch (e) {
        error = e;
      }

      // THEN
      sinon.assert.calledWithExactly(client.describeFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'PhysicalResourceIdMock',
      });

      expect(error.message).toEqual('DELETE_FAILED');
    });

    test('uses physicalResourceId when it is valid length (<= 100 chars)', async () => {
      // GIVEN
      const client = newEksClientMock();
      const validPhysicalResourceId = 'ValidProfileName123'; // 20 chars, well under 100
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
        PhysicalResourceId: validPhysicalResourceId,
      }));

      // WHEN
      await handler.onEvent();

      // THEN - Should use physicalResourceId directly
      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: validPhysicalResourceId,
      });
    });

    test('uses explicit fargateProfileName from config when provided', async () => {
      // GIVEN
      const client = newEksClientMock();
      const explicitName = 'ExplicitProfileName';
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
        PhysicalResourceId: 'PhysicalResourceIdMock',
        ResourceProperties: {
          AssumeRoleArn: 'AssumeRoleArn',
          Config: {
            clusterName: 'MockClusterName',
            fargateProfileName: explicitName,
          },
        },
      }));

      // WHEN
      await handler.onEvent();

      // THEN - Should use explicit name from config, not physicalResourceId
      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: explicitName,
      });
    });

    test('uses generateProfileName when physicalResourceId exceeds 100 characters', async () => {
      // GIVEN
      const client = newEksClientMock();
      // Create a physicalResourceId that's > 100 characters
      const longPhysicalResourceId = 'a'.repeat(101); // 101 chars
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
        PhysicalResourceId: longPhysicalResourceId,
        ResourceProperties: {
          AssumeRoleArn: 'AssumeRoleArn',
          Config: {
            clusterName: 'MockClusterName',
            // No explicit fargateProfileName provided
          },
        },
      }));

      // WHEN
      await handler.onEvent();

      // THEN - Should use generated name (LogicalResourceIdMock-RequestIdMock)
      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'LogicalResourceIdMock-RequestIdMock', // Generated name
      });
    });

    test('uses explicit fargateProfileName even when physicalResourceId exceeds 100 characters', async () => {
      // GIVEN
      const client = newEksClientMock();
      const explicitName = 'ExplicitProfileName';
      const longPhysicalResourceId = 'a'.repeat(101); // 101 chars
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
        PhysicalResourceId: longPhysicalResourceId,
        ResourceProperties: {
          AssumeRoleArn: 'AssumeRoleArn',
          Config: {
            clusterName: 'MockClusterName',
            fargateProfileName: explicitName,
          },
        },
      }));

      // WHEN
      await handler.onEvent();

      // THEN - Should use explicit name, not generated name
      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: explicitName,
      });
    });

    test('uses physicalResourceId when it is exactly 100 characters', async () => {
      // GIVEN
      const client = newEksClientMock();
      const exactly100Chars = 'a'.repeat(100); // Exactly 100 chars
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
        PhysicalResourceId: exactly100Chars,
        ResourceProperties: {
          AssumeRoleArn: 'AssumeRoleArn',
          Config: {
            clusterName: 'MockClusterName',
          },
        },
      }));

      // WHEN
      await handler.onEvent();

      // THEN - Should use physicalResourceId (100 chars is valid)
      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: exactly100Chars,
      });
    });
  });
});

function newRequestMock(props: any = { }): any {
  return {
    RequestType: 'Create',
    ServiceToken: 'ServiceTokenMock',
    LogicalResourceId: 'LogicalResourceIdMock',
    RequestId: 'RequestIdMock',
    ResourceType: FARGATE_PROFILE_RESOURCE_TYPE,
    ResponseURL: 'ResponseURLMock',
    StackId: 'StackIdMock',
    PhysicalResourceId: 'PhysicalResourceIdMock',
    ResourceProperties: {
      ServiceToken: 'ServiceTokenMock',
      AssumeRoleArn: 'AssumeRoleArn',
      Config: {
        clusterName: 'MockClusterName',
      },
    },
    ...props,
  };
}

function newEksClientMock() {
  return {
    createCluster: sinon.fake.throws('not implemented'),
    deleteCluster: sinon.fake.throws('not implemented'),
    describeCluster: sinon.fake.throws('not implemented'),
    describeUpdate: sinon.fake.throws('not implemented'),
    updateClusterConfig: sinon.fake.throws('not implemented'),
    updateClusterVersion: sinon.fake.throws('not implemented'),
    configureAssumeRole: sinon.fake(),
    createFargateProfile: sinon.fake.resolves({
      fargateProfile: {
        fargateProfileName: 'MockProfileName',
        fargateProfileArn: 'MockProfileArn',
      },
    }),
    deleteFargateProfile: sinon.fake(),
    describeFargateProfile: sinon.fake.throws('not implemented'),
    tagResource: sinon.fake.throws('not implemented'),
    untagResource: sinon.fake.throws('not implemented'),
  };
}
