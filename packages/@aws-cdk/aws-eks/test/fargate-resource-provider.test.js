"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const consts_1 = require("../lib/cluster-resource-handler/consts");
const fargate_1 = require("../lib/cluster-resource-handler/fargate");
describe('fargate resource provider', () => {
    describe('create', () => {
        test('calls createFargateProfile with a generated name', async () => {
            // GIVEN
            const client = newEksClientMock();
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock());
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
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock({
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
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock());
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
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock());
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
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock());
            let error;
            try {
                await handler.isComplete();
            }
            catch (e) {
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
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock({
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
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock({
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
            resourceNotFoundError.code = 'ResourceNotFoundException';
            client.describeFargateProfile = sinon.fake.throws(resourceNotFoundError);
            // WHEN
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock({
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
            const handler = new fargate_1.FargateProfileResourceHandler(client, newRequestMock());
            let error;
            try {
                await handler.isComplete();
            }
            catch (e) {
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
function newRequestMock(props = {}) {
    return {
        RequestType: 'Create',
        ServiceToken: 'ServiceTokenMock',
        LogicalResourceId: 'LogicalResourceIdMock',
        RequestId: 'RequestIdMock',
        ResourceType: consts_1.FARGATE_PROFILE_RESOURCE_TYPE,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS1yZXNvdXJjZS1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFyZ2F0ZS1yZXNvdXJjZS1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLG1FQUF1RjtBQUN2RixxRUFBd0Y7QUFFeEYsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixJQUFJLENBQUMsa0RBQWtELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEUsUUFBUTtZQUNSLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixFQUFFLENBQUM7WUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSx1Q0FBNkIsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUU1RSxPQUFPO1lBQ1AsTUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFaEQsT0FBTztZQUNQLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFO2dCQUN6RCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsZUFBZSxFQUFFLHdDQUF3QzthQUMxRCxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRTtnQkFDMUQsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsa0JBQWtCLEVBQUUscUNBQXFDO2FBQzFELENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLGtCQUFrQixFQUFFLGlCQUFpQjtnQkFDckMsSUFBSSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUU7YUFDOUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEQsUUFBUTtZQUNSLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixFQUFFLENBQUM7WUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSx1Q0FBNkIsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDO2dCQUN2RSxrQkFBa0IsRUFBRTtvQkFDbEIsYUFBYSxFQUFFLG1CQUFtQjtvQkFDbEMsTUFBTSxFQUFFO3dCQUNOLGtCQUFrQixFQUFFLG1CQUFtQjt3QkFDdkMsV0FBVyxFQUFFLGlCQUFpQjtxQkFDL0I7aUJBQ0Y7YUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLE9BQU87WUFDUCxNQUFNLGVBQWUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVoRCxPQUFPO1lBQ1AsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzFELGtCQUFrQixFQUFFLG1CQUFtQjtnQkFDdkMsV0FBVyxFQUFFLGlCQUFpQjthQUMvQixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5QixrQkFBa0IsRUFBRSxpQkFBaUI7Z0JBQ3JDLElBQUksRUFBRSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFO2FBQzlDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RFLFFBQVE7WUFDUixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDakQsY0FBYyxFQUFFO29CQUNkLE1BQU0sRUFBRSxRQUFRO2lCQUNqQjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLHVDQUE2QixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRXhDLE9BQU87WUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtnQkFDNUQsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsa0JBQWtCLEVBQUUsd0JBQXdCO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlFQUFpRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2pGLFFBQVE7WUFDUixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDakQsY0FBYyxFQUFFO29CQUNkLE1BQU0sRUFBRSxVQUFVO2lCQUNuQjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLHVDQUE2QixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRXhDLE9BQU87WUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtnQkFDNUQsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsa0JBQWtCLEVBQUUsd0JBQXdCO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLCtEQUErRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQy9FLFFBQVE7WUFDUixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDakQsY0FBYyxFQUFFO29CQUNkLE1BQU0sRUFBRSxlQUFlO2lCQUN4QjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLHVDQUE2QixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBRTVFLElBQUksS0FBVSxDQUFDO1lBQ2YsSUFBSTtnQkFDRixNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUM1QjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDWDtZQUVELE9BQU87WUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtnQkFDNUQsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsa0JBQWtCLEVBQUUsd0JBQXdCO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixJQUFJLENBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUQsUUFBUTtZQUNSLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixFQUFFLENBQUM7WUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSx1Q0FBNkIsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDO2dCQUN2RSxXQUFXLEVBQUUsUUFBUTthQUN0QixDQUFDLENBQUMsQ0FBQztZQUVKLE9BQU87WUFDUCxNQUFNLGVBQWUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVoRCxPQUFPO1lBQ1AsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ3pELE9BQU8sRUFBRSxlQUFlO2dCQUN4QixlQUFlLEVBQUUsd0NBQXdDO2FBQzFELENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFO2dCQUMxRCxXQUFXLEVBQUUsaUJBQWlCO2dCQUM5QixrQkFBa0IsRUFBRSxxQ0FBcUM7YUFDMUQsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsa0JBQWtCLEVBQUUsaUJBQWlCO2dCQUNyQyxJQUFJLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRTthQUM5QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFFdEIsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzVDLFFBQVE7WUFDUixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksdUNBQTZCLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQztnQkFDdkUsV0FBVyxFQUFFLFFBQVE7YUFDdEIsQ0FBQyxDQUFDLENBQUM7WUFFSixPQUFPO1lBQ1AsTUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFaEQsT0FBTztZQUNQLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFO2dCQUN6RCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsZUFBZSxFQUFFLHdDQUF3QzthQUMxRCxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRTtnQkFDMUQsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsa0JBQWtCLEVBQUUsd0JBQXdCO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0ZBQXNGLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdEcsUUFBUTtZQUNSLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixFQUFFLENBQUM7WUFFbEMsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3pDLHFCQUE2QixDQUFDLElBQUksR0FBRywyQkFBMkIsQ0FBQztZQUNsRSxNQUFNLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUV6RSxPQUFPO1lBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSx1Q0FBNkIsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDO2dCQUN2RSxXQUFXLEVBQUUsUUFBUTthQUN0QixDQUFDLENBQUMsQ0FBQztZQUNKLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRXhDLE9BQU87WUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtnQkFDNUQsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsa0JBQWtCLEVBQUUsd0JBQXdCO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ25CLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLCtEQUErRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQy9FLFFBQVE7WUFDUixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDakQsY0FBYyxFQUFFO29CQUNkLE1BQU0sRUFBRSxlQUFlO2lCQUN4QjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLHVDQUE2QixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBRTVFLElBQUksS0FBVSxDQUFDO1lBQ2YsSUFBSTtnQkFDRixNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUM1QjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDWDtZQUVELE9BQU87WUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtnQkFDNUQsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsa0JBQWtCLEVBQUUsd0JBQXdCO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsY0FBYyxDQUFDLFFBQWEsRUFBRztJQUN0QyxPQUFPO1FBQ0wsV0FBVyxFQUFFLFFBQVE7UUFDckIsWUFBWSxFQUFFLGtCQUFrQjtRQUNoQyxpQkFBaUIsRUFBRSx1QkFBdUI7UUFDMUMsU0FBUyxFQUFFLGVBQWU7UUFDMUIsWUFBWSxFQUFFLHNDQUE2QjtRQUMzQyxXQUFXLEVBQUUsaUJBQWlCO1FBQzlCLE9BQU8sRUFBRSxhQUFhO1FBQ3RCLGtCQUFrQixFQUFFLHdCQUF3QjtRQUM1QyxrQkFBa0IsRUFBRTtZQUNsQixZQUFZLEVBQUUsa0JBQWtCO1lBQ2hDLGFBQWEsRUFBRSxlQUFlO1lBQzlCLE1BQU0sRUFBRTtnQkFDTixXQUFXLEVBQUUsaUJBQWlCO2FBQy9CO1NBQ0Y7UUFDRCxHQUFHLEtBQUs7S0FDVCxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsZ0JBQWdCO0lBQ3ZCLE9BQU87UUFDTCxhQUFhLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDbkQsYUFBYSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELGVBQWUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUNyRCxjQUFjLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDcEQsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDekQsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDMUQsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNqQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUN2QyxjQUFjLEVBQUU7Z0JBQ2Qsa0JBQWtCLEVBQUUsaUJBQWlCO2dCQUNyQyxpQkFBaUIsRUFBRSxnQkFBZ0I7YUFDcEM7U0FDRixDQUFDO1FBQ0Ysb0JBQW9CLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNsQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztLQUM3RCxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNpbm9uIGZyb20gJ3Npbm9uJztcbmltcG9ydCB7IEZBUkdBVEVfUFJPRklMRV9SRVNPVVJDRV9UWVBFIH0gZnJvbSAnLi4vbGliL2NsdXN0ZXItcmVzb3VyY2UtaGFuZGxlci9jb25zdHMnO1xuaW1wb3J0IHsgRmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuLi9saWIvY2x1c3Rlci1yZXNvdXJjZS1oYW5kbGVyL2ZhcmdhdGUnO1xuXG5kZXNjcmliZSgnZmFyZ2F0ZSByZXNvdXJjZSBwcm92aWRlcicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2NyZWF0ZScsICgpID0+IHtcbiAgICB0ZXN0KCdjYWxscyBjcmVhdGVGYXJnYXRlUHJvZmlsZSB3aXRoIGEgZ2VuZXJhdGVkIG5hbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgY2xpZW50ID0gbmV3RWtzQ2xpZW50TW9jaygpO1xuICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBGYXJnYXRlUHJvZmlsZVJlc291cmNlSGFuZGxlcihjbGllbnQsIG5ld1JlcXVlc3RNb2NrKCkpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBvbkV2ZW50UmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVyLm9uRXZlbnQoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGNsaWVudC5jb25maWd1cmVBc3N1bWVSb2xlLCB7XG4gICAgICAgIFJvbGVBcm46ICdBc3N1bWVSb2xlQXJuJyxcbiAgICAgICAgUm9sZVNlc3Npb25OYW1lOiAnQVdTQ0RLLkVLU0NsdXN0ZXIuQ3JlYXRlLlJlcXVlc3RJZE1vY2snLFxuICAgICAgfSk7XG5cbiAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoRXhhY3RseShjbGllbnQuY3JlYXRlRmFyZ2F0ZVByb2ZpbGUsIHtcbiAgICAgICAgY2x1c3Rlck5hbWU6ICdNb2NrQ2x1c3Rlck5hbWUnLFxuICAgICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6ICdMb2dpY2FsUmVzb3VyY2VJZE1vY2stUmVxdWVzdElkTW9jaycsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KG9uRXZlbnRSZXNwb25zZSkudG9FcXVhbCh7XG4gICAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ01vY2tQcm9maWxlTmFtZScsXG4gICAgICAgIERhdGE6IHsgZmFyZ2F0ZVByb2ZpbGVBcm46ICdNb2NrUHJvZmlsZUFybicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVzcGVjdHMgcGh5c2ljYWwgbmFtZSBpZiBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBjbGllbnQgPSBuZXdFa3NDbGllbnRNb2NrKCk7XG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IEZhcmdhdGVQcm9maWxlUmVzb3VyY2VIYW5kbGVyKGNsaWVudCwgbmV3UmVxdWVzdE1vY2soe1xuICAgICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgICBBc3N1bWVSb2xlQXJuOiAnQXNzdW1lUm9sZUFybk1vY2snLFxuICAgICAgICAgIENvbmZpZzoge1xuICAgICAgICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiAnTXlQcm9maWxlTmFtZUJvb20nLFxuICAgICAgICAgICAgY2x1c3Rlck5hbWU6ICdNb2NrQ2x1c3Rlck5hbWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG9uRXZlbnRSZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY2xpZW50LmNyZWF0ZUZhcmdhdGVQcm9maWxlLCB7XG4gICAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogJ015UHJvZmlsZU5hbWVCb29tJyxcbiAgICAgICAgY2x1c3Rlck5hbWU6ICdNb2NrQ2x1c3Rlck5hbWUnLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChvbkV2ZW50UmVzcG9uc2UpLnRvRXF1YWwoe1xuICAgICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdNb2NrUHJvZmlsZU5hbWUnLFxuICAgICAgICBEYXRhOiB7IGZhcmdhdGVQcm9maWxlQXJuOiAnTW9ja1Byb2ZpbGVBcm4nIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lzQ29tcGxldGUgcmV0dXJucyB0cnVlIGlmIGZhcmdhdGUgcHJvZmlsZSBpcyBBQ1RJVkUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgY2xpZW50ID0gbmV3RWtzQ2xpZW50TW9jaygpO1xuXG4gICAgICBjbGllbnQuZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSA9IHNpbm9uLmZha2UucmV0dXJucyh7XG4gICAgICAgIGZhcmdhdGVQcm9maWxlOiB7XG4gICAgICAgICAgc3RhdHVzOiAnQUNUSVZFJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IEZhcmdhdGVQcm9maWxlUmVzb3VyY2VIYW5kbGVyKGNsaWVudCwgbmV3UmVxdWVzdE1vY2soKSk7XG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgaGFuZGxlci5pc0NvbXBsZXRlKCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoRXhhY3RseShjbGllbnQuZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSwge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ01vY2tDbHVzdGVyTmFtZScsXG4gICAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogJ1BoeXNpY2FsUmVzb3VyY2VJZE1vY2snLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChyZXNwLklzQ29tcGxldGUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpc0NvbXBsZXRlIHJldHVybnMgZmFsc2UgYXMgbG9uZyBhcyBmYXJnYXRlIHByb2ZpbGUgaXMgQ1JFQVRJTkcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgY2xpZW50ID0gbmV3RWtzQ2xpZW50TW9jaygpO1xuXG4gICAgICBjbGllbnQuZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSA9IHNpbm9uLmZha2UucmV0dXJucyh7XG4gICAgICAgIGZhcmdhdGVQcm9maWxlOiB7XG4gICAgICAgICAgc3RhdHVzOiAnQ1JFQVRJTkcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgRmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUhhbmRsZXIoY2xpZW50LCBuZXdSZXF1ZXN0TW9jaygpKTtcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGNsaWVudC5kZXNjcmliZUZhcmdhdGVQcm9maWxlLCB7XG4gICAgICAgIGNsdXN0ZXJOYW1lOiAnTW9ja0NsdXN0ZXJOYW1lJyxcbiAgICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiAnUGh5c2ljYWxSZXNvdXJjZUlkTW9jaycsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHJlc3AuSXNDb21wbGV0ZSkudG9FcXVhbChmYWxzZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpc0NvbXBsZXRlIHRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlIHN0YXR1cyBpcyBDUkVBVEVfRkFJTEVEJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ld0Vrc0NsaWVudE1vY2soKTtcblxuICAgICAgY2xpZW50LmRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUgPSBzaW5vbi5mYWtlLnJldHVybnMoe1xuICAgICAgICBmYXJnYXRlUHJvZmlsZToge1xuICAgICAgICAgIHN0YXR1czogJ0NSRUFURV9GQUlMRUQnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgRmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUhhbmRsZXIoY2xpZW50LCBuZXdSZXF1ZXN0TW9jaygpKTtcblxuICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3IgPSBlO1xuICAgICAgfVxuXG4gICAgICAvLyBUSEVOXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY2xpZW50LmRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUsIHtcbiAgICAgICAgY2x1c3Rlck5hbWU6ICdNb2NrQ2x1c3Rlck5hbWUnLFxuICAgICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6ICdQaHlzaWNhbFJlc291cmNlSWRNb2NrJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9FcXVhbCgnQ1JFQVRFX0ZBSUxFRCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbGxzIGNyZWF0ZUZhcmdhdGVQcm9maWxlIHdpdGggYSBuZXcgbmFtZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBjbGllbnQgPSBuZXdFa3NDbGllbnRNb2NrKCk7XG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IEZhcmdhdGVQcm9maWxlUmVzb3VyY2VIYW5kbGVyKGNsaWVudCwgbmV3UmVxdWVzdE1vY2soe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG9uRXZlbnRSZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY2xpZW50LmNvbmZpZ3VyZUFzc3VtZVJvbGUsIHtcbiAgICAgICAgUm9sZUFybjogJ0Fzc3VtZVJvbGVBcm4nLFxuICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6ICdBV1NDREsuRUtTQ2x1c3Rlci5VcGRhdGUuUmVxdWVzdElkTW9jaycsXG4gICAgICB9KTtcblxuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGNsaWVudC5jcmVhdGVGYXJnYXRlUHJvZmlsZSwge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ01vY2tDbHVzdGVyTmFtZScsXG4gICAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogJ0xvZ2ljYWxSZXNvdXJjZUlkTW9jay1SZXF1ZXN0SWRNb2NrJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3Qob25FdmVudFJlc3BvbnNlKS50b0VxdWFsKHtcbiAgICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAnTW9ja1Byb2ZpbGVOYW1lJyxcbiAgICAgICAgRGF0YTogeyBmYXJnYXRlUHJvZmlsZUFybjogJ01vY2tQcm9maWxlQXJuJyB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZWxldGUnLCAoKSA9PiB7XG5cbiAgICB0ZXN0KCdjYWxscyBkZWxldGVGYXJnYXRlUHJvZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBjbGllbnQgPSBuZXdFa3NDbGllbnRNb2NrKCk7XG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IEZhcmdhdGVQcm9maWxlUmVzb3VyY2VIYW5kbGVyKGNsaWVudCwgbmV3UmVxdWVzdE1vY2soe1xuICAgICAgICBSZXF1ZXN0VHlwZTogJ0RlbGV0ZScsXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG9uRXZlbnRSZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIub25FdmVudCgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY2xpZW50LmNvbmZpZ3VyZUFzc3VtZVJvbGUsIHtcbiAgICAgICAgUm9sZUFybjogJ0Fzc3VtZVJvbGVBcm4nLFxuICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6ICdBV1NDREsuRUtTQ2x1c3Rlci5EZWxldGUuUmVxdWVzdElkTW9jaycsXG4gICAgICB9KTtcblxuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGNsaWVudC5kZWxldGVGYXJnYXRlUHJvZmlsZSwge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ01vY2tDbHVzdGVyTmFtZScsXG4gICAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogJ1BoeXNpY2FsUmVzb3VyY2VJZE1vY2snLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChvbkV2ZW50UmVzcG9uc2UpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lzQ29tcGxldGUgcmV0dXJucyB0cnVlIHdoZW4gZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSB0aHJvd3MgUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBjbGllbnQgPSBuZXdFa3NDbGllbnRNb2NrKCk7XG5cbiAgICAgIGNvbnN0IHJlc291cmNlTm90Rm91bmRFcnJvciA9IG5ldyBFcnJvcigpO1xuICAgICAgKHJlc291cmNlTm90Rm91bmRFcnJvciBhcyBhbnkpLmNvZGUgPSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbic7XG4gICAgICBjbGllbnQuZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSA9IHNpbm9uLmZha2UudGhyb3dzKHJlc291cmNlTm90Rm91bmRFcnJvcik7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgRmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUhhbmRsZXIoY2xpZW50LCBuZXdSZXF1ZXN0TW9jayh7XG4gICAgICAgIFJlcXVlc3RUeXBlOiAnRGVsZXRlJyxcbiAgICAgIH0pKTtcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGNsaWVudC5kZXNjcmliZUZhcmdhdGVQcm9maWxlLCB7XG4gICAgICAgIGNsdXN0ZXJOYW1lOiAnTW9ja0NsdXN0ZXJOYW1lJyxcbiAgICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiAnUGh5c2ljYWxSZXNvdXJjZUlkTW9jaycsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHJlc3ApLnRvRXF1YWwoe1xuICAgICAgICBJc0NvbXBsZXRlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpc0NvbXBsZXRlIHRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlIHN0YXR1cyBpcyBERUxFVEVfRkFJTEVEJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ld0Vrc0NsaWVudE1vY2soKTtcblxuICAgICAgY2xpZW50LmRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUgPSBzaW5vbi5mYWtlLnJldHVybnMoe1xuICAgICAgICBmYXJnYXRlUHJvZmlsZToge1xuICAgICAgICAgIHN0YXR1czogJ0RFTEVURV9GQUlMRUQnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgRmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUhhbmRsZXIoY2xpZW50LCBuZXdSZXF1ZXN0TW9jaygpKTtcblxuICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBoYW5kbGVyLmlzQ29tcGxldGUoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3IgPSBlO1xuICAgICAgfVxuXG4gICAgICAvLyBUSEVOXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY2xpZW50LmRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUsIHtcbiAgICAgICAgY2x1c3Rlck5hbWU6ICdNb2NrQ2x1c3Rlck5hbWUnLFxuICAgICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6ICdQaHlzaWNhbFJlc291cmNlSWRNb2NrJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9FcXVhbCgnREVMRVRFX0ZBSUxFRCcpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBuZXdSZXF1ZXN0TW9jayhwcm9wczogYW55ID0geyB9KTogYW55IHtcbiAgcmV0dXJuIHtcbiAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgU2VydmljZVRva2VuOiAnU2VydmljZVRva2VuTW9jaycsXG4gICAgTG9naWNhbFJlc291cmNlSWQ6ICdMb2dpY2FsUmVzb3VyY2VJZE1vY2snLFxuICAgIFJlcXVlc3RJZDogJ1JlcXVlc3RJZE1vY2snLFxuICAgIFJlc291cmNlVHlwZTogRkFSR0FURV9QUk9GSUxFX1JFU09VUkNFX1RZUEUsXG4gICAgUmVzcG9uc2VVUkw6ICdSZXNwb25zZVVSTE1vY2snLFxuICAgIFN0YWNrSWQ6ICdTdGFja0lkTW9jaycsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAnUGh5c2ljYWxSZXNvdXJjZUlkTW9jaycsXG4gICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICBTZXJ2aWNlVG9rZW46ICdTZXJ2aWNlVG9rZW5Nb2NrJyxcbiAgICAgIEFzc3VtZVJvbGVBcm46ICdBc3N1bWVSb2xlQXJuJyxcbiAgICAgIENvbmZpZzoge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ01vY2tDbHVzdGVyTmFtZScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgLi4ucHJvcHMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIG5ld0Vrc0NsaWVudE1vY2soKSB7XG4gIHJldHVybiB7XG4gICAgY3JlYXRlQ2x1c3Rlcjogc2lub24uZmFrZS50aHJvd3MoJ25vdCBpbXBsZW1lbnRlZCcpLFxuICAgIGRlbGV0ZUNsdXN0ZXI6IHNpbm9uLmZha2UudGhyb3dzKCdub3QgaW1wbGVtZW50ZWQnKSxcbiAgICBkZXNjcmliZUNsdXN0ZXI6IHNpbm9uLmZha2UudGhyb3dzKCdub3QgaW1wbGVtZW50ZWQnKSxcbiAgICBkZXNjcmliZVVwZGF0ZTogc2lub24uZmFrZS50aHJvd3MoJ25vdCBpbXBsZW1lbnRlZCcpLFxuICAgIHVwZGF0ZUNsdXN0ZXJDb25maWc6IHNpbm9uLmZha2UudGhyb3dzKCdub3QgaW1wbGVtZW50ZWQnKSxcbiAgICB1cGRhdGVDbHVzdGVyVmVyc2lvbjogc2lub24uZmFrZS50aHJvd3MoJ25vdCBpbXBsZW1lbnRlZCcpLFxuICAgIGNvbmZpZ3VyZUFzc3VtZVJvbGU6IHNpbm9uLmZha2UoKSxcbiAgICBjcmVhdGVGYXJnYXRlUHJvZmlsZTogc2lub24uZmFrZS5yZXR1cm5zKHtcbiAgICAgIGZhcmdhdGVQcm9maWxlOiB7XG4gICAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogJ01vY2tQcm9maWxlTmFtZScsXG4gICAgICAgIGZhcmdhdGVQcm9maWxlQXJuOiAnTW9ja1Byb2ZpbGVBcm4nLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBkZWxldGVGYXJnYXRlUHJvZmlsZTogc2lub24uZmFrZSgpLFxuICAgIGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGU6IHNpbm9uLmZha2UudGhyb3dzKCdub3QgaW1wbGVtZW50ZWQnKSxcbiAgfTtcbn0iXX0=