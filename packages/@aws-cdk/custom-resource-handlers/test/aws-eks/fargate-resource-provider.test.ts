
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

    // CloudFormation assigns "<stack name>-<logical id>-<suffix>" when it cancels a create before
    // the provider reports a physical id, and sends it with the rollback delete
    test.each([
      ['longer than 100 characters', `${'MyApplicationStack-Production'.repeat(3)}-ClusterfargateprofileMyProfile1A2B3C4D-1WI69JK2O6SPV`],
      ['starting with the reserved eks- prefix', 'eks-cluster-stack-ClusterfargateprofileMyProfile1A2B3C4D-1WI69JK2O6SPV'],
      ['starting with the reserved prefix in upper case', 'EKS-Cluster-Stack-ClusterfargateprofileMyProfile1A2B3C4D-1WI69JK2O6SPV'],
    ])('does not call deleteFargateProfile for a physical id %s', async (_, physicalResourceId) => {
      // GIVEN
      const client = newEksClientMock();
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
        PhysicalResourceId: physicalResourceId,
      }));

      // WHEN
      const onEventResponse = await handler.onEvent();
      const isCompleteResponse = await handler.isComplete();

      // THEN
      sinon.assert.notCalled(client.deleteFargateProfile);
      sinon.assert.notCalled(client.describeFargateProfile);
      expect(onEventResponse).toEqual(undefined);
      expect(isCompleteResponse).toEqual({ IsComplete: true });
    });

    test('calls deleteFargateProfile for a physical id of exactly 100 characters', async () => {
      // GIVEN
      const client = newEksClientMock();
      const physicalResourceId = 'a'.repeat(100);
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
        PhysicalResourceId: physicalResourceId,
      }));

      // WHEN
      await handler.onEvent();

      // THEN
      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: physicalResourceId,
      });
    });

    test('succeeds when deleteFargateProfile throws ResourceNotFoundException', async () => {
      // GIVEN
      const client = newEksClientMock();
      client.deleteFargateProfile = sinon.fake.throws(new eks.ResourceNotFoundException({
        message: 'The requested resource does not exist.',
        $metadata: {
          httpStatusCode: 404,
        },
      }));
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
      }));

      // WHEN
      const onEventResponse = await handler.onEvent();

      // THEN
      sinon.assert.calledWithExactly(client.deleteFargateProfile, {
        clusterName: 'MockClusterName',
        fargateProfileName: 'PhysicalResourceIdMock',
      });
      expect(onEventResponse).toEqual(undefined);
    });

    test('rethrows other deleteFargateProfile errors', async () => {
      // GIVEN
      const client = newEksClientMock();
      client.deleteFargateProfile = sinon.fake.throws(new eks.ResourceInUseException({
        message: 'Resource in use',
        $metadata: {
          httpStatusCode: 409,
        },
      }));
      const handler = new FargateProfileResourceHandler(client, newRequestMock({
        RequestType: 'Delete',
      }));

      // WHEN / THEN
      await expect(handler.onEvent()).rejects.toThrow('Resource in use');
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
