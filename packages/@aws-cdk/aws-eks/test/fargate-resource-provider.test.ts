import * as sinon from 'sinon';
import { FARGATE_PROFILE_RESOURCE_TYPE } from '../lib/cluster-resource-handler/consts';
import { FargateProfileResourceHandler } from '../lib/cluster-resource-handler/fargate';

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

      const resourceNotFoundError = new Error();
      (resourceNotFoundError as any).code = 'ResourceNotFoundException';
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
    createFargateProfile: sinon.fake.returns({
      fargateProfile: {
        fargateProfileName: 'MockProfileName',
        fargateProfileArn: 'MockProfileArn',
      },
    }),
    deleteFargateProfile: sinon.fake(),
    describeFargateProfile: sinon.fake.throws('not implemented'),
  };
}