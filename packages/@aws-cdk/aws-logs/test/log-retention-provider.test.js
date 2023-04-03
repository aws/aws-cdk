"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWSSDK = require("aws-sdk");
const AWS = require("aws-sdk-mock");
const nock = require("nock");
const sinon = require("sinon");
const provider = require("../lib/log-retention-provider");
AWS.setSDK(require.resolve('aws-sdk'));
const eventCommon = {
    ServiceToken: 'token',
    ResponseURL: 'https://localhost',
    StackId: 'stackId',
    RequestId: 'requestId',
    LogicalResourceId: 'logicalResourceId',
    PhysicalResourceId: 'group',
    ResourceType: 'Custom::LogRetention',
};
const context = {
    functionName: 'provider',
};
function createRequest(type) {
    return nock('https://localhost')
        .put('/', (body) => body.Status === type && body.PhysicalResourceId === 'group')
        .reply(200);
}
class MyError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
describe('log retention provider', () => {
    afterEach(() => {
        AWS.restore();
        nock.cleanAll();
    });
    test('create event', async () => {
        const createLogGroupFake = sinon.fake.resolves({});
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        sinon.assert.calledWith(createLogGroupFake, {
            logGroupName: 'group',
        });
        sinon.assert.calledWith(putRetentionPolicyFake, {
            logGroupName: 'group',
            retentionInDays: 30,
        });
        sinon.assert.calledWith(createLogGroupFake, {
            logGroupName: '/aws/lambda/provider',
        });
        sinon.assert.calledWith(putRetentionPolicyFake, {
            logGroupName: '/aws/lambda/provider',
            retentionInDays: 1,
        });
        sinon.assert.notCalled(deleteRetentionPolicyFake);
        expect(request.isDone()).toEqual(true);
    });
    test('update event with new log retention', async () => {
        const error = new Error();
        error.code = 'ResourceAlreadyExistsException';
        const createLogGroupFake = sinon.fake.rejects(error);
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Update',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '365',
                LogGroupName: 'group',
            },
            OldResourceProperties: {
                ServiceToken: 'token',
                LogGroupName: 'group',
                RetentionInDays: '30',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        sinon.assert.calledWith(createLogGroupFake, {
            logGroupName: 'group',
        });
        sinon.assert.calledWith(putRetentionPolicyFake, {
            logGroupName: 'group',
            retentionInDays: 365,
        });
        sinon.assert.notCalled(deleteRetentionPolicyFake);
        expect(request.isDone()).toEqual(true);
    });
    test('update event with log retention undefined', async () => {
        const error = new Error();
        error.code = 'ResourceAlreadyExistsException';
        const createLogGroupFake = sinon.fake.rejects(error);
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Update',
            PhysicalResourceId: 'group',
            ResourceProperties: {
                ServiceToken: 'token',
                LogGroupName: 'group',
            },
            OldResourceProperties: {
                ServiceToken: 'token',
                LogGroupName: 'group',
                RetentionInDays: '365',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        sinon.assert.calledWith(createLogGroupFake, {
            logGroupName: 'group',
        });
        sinon.assert.calledWith(deleteRetentionPolicyFake, {
            logGroupName: 'group',
        });
        expect(request.isDone()).toEqual(true);
    });
    test('delete event', async () => {
        const createLogGroupFake = sinon.fake.resolves({});
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Delete',
            PhysicalResourceId: 'group',
            ResourceProperties: {
                ServiceToken: 'token',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        sinon.assert.notCalled(createLogGroupFake);
        sinon.assert.notCalled(putRetentionPolicyFake);
        sinon.assert.notCalled(deleteRetentionPolicyFake);
        expect(request.isDone()).toEqual(true);
    });
    test('delete event with RemovalPolicy', async () => {
        const createLogGroupFake = sinon.fake.resolves({});
        const deleteLogGroupFake = sinon.fake.resolves({});
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'deleteLogGroup', deleteLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Delete',
            PhysicalResourceId: 'group',
            ResourceProperties: {
                ServiceToken: 'token',
                LogGroupName: 'group',
                RemovalPolicy: 'destroy',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        sinon.assert.notCalled(createLogGroupFake);
        sinon.assert.calledWith(deleteLogGroupFake, {
            logGroupName: 'group',
        });
        sinon.assert.notCalled(putRetentionPolicyFake);
        sinon.assert.notCalled(deleteRetentionPolicyFake);
        expect(request.isDone()).toEqual(true);
    });
    test('responds with FAILED on error', async () => {
        const createLogGroupFake = sinon.fake.rejects(new Error('UnknownError'));
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('FAILED');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('succeeds when createLogGroup for provider log group returns OperationAbortedException twice', async () => {
        let attempt = 2;
        const createLogGroupFake = (params) => {
            if (params.logGroupName === '/aws/lambda/provider') {
                if (attempt > 0) {
                    attempt--;
                    return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
                }
                else {
                    return Promise.resolve({});
                }
            }
            return Promise.resolve({});
        };
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('succeeds when createLogGroup for CDK lambda log group returns OperationAbortedException twice', async () => {
        let attempt = 2;
        const createLogGroupFake = (params) => {
            if (params.logGroupName === 'group') {
                if (attempt > 0) {
                    attempt--;
                    return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
                }
                else {
                    return Promise.resolve({});
                }
            }
            return Promise.resolve({});
        };
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('fails when createLogGroup for CDK lambda log group fails with OperationAbortedException indefinitely', async () => {
        const createLogGroupFake = (params) => {
            if (params.logGroupName === 'group') {
                return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
            }
            return Promise.resolve({});
        };
        const putRetentionPolicyFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('FAILED');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('succeeds when putRetentionPolicy for provider log group returns OperationAbortedException twice', async () => {
        let attempt = 2;
        const putRetentionPolicyFake = (params) => {
            if (params.logGroupName === '/aws/lambda/provider') {
                if (attempt > 0) {
                    attempt--;
                    return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
                }
                else {
                    return Promise.resolve({});
                }
            }
            return Promise.resolve({});
        };
        const createLogGroupFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('succeeds when putRetentionPolicy for CDK lambda log group returns OperationAbortedException twice', async () => {
        let attempt = 2;
        const putRetentionPolicyFake = (params) => {
            if (params.logGroupName === 'group') {
                if (attempt > 0) {
                    attempt--;
                    return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
                }
                else {
                    return Promise.resolve({});
                }
            }
            return Promise.resolve({});
        };
        const createLogGroupFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('fails when putRetentionPolicy for CDK lambda log group fails with OperationAbortedException indefinitely', async () => {
        const putRetentionPolicyFake = (params) => {
            if (params.logGroupName === 'group') {
                return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
            }
            return Promise.resolve({});
        };
        const createLogGroupFake = sinon.fake.resolves({});
        const deleteRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('FAILED');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('succeeds when deleteRetentionPolicy for provider log group returns OperationAbortedException twice', async () => {
        let attempt = 2;
        const deleteRetentionPolicyFake = (params) => {
            if (params.logGroupName === '/aws/lambda/provider') {
                if (attempt > 0) {
                    attempt--;
                    return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
                }
                else {
                    return Promise.resolve({});
                }
            }
            return Promise.resolve({});
        };
        const createLogGroupFake = sinon.fake.resolves({});
        const putRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '0',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('fails when deleteRetentionPolicy for provider log group fails with OperationAbortedException indefinitely', async () => {
        const deleteRetentionPolicyFake = (params) => {
            if (params.logGroupName === 'group') {
                return Promise.reject(new MyError('A conflicting operation is currently in progress against this resource. Please try again.', 'OperationAbortedException'));
            }
            return Promise.resolve({});
        };
        const createLogGroupFake = sinon.fake.resolves({});
        const putRetentionPolicyFake = sinon.fake.resolves({});
        AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '0',
                LogGroupName: 'group',
            },
        };
        const request = createRequest('FAILED');
        await provider.handler(event, context);
        expect(request.isDone()).toEqual(true);
    });
    test('response data contains the log group name', async () => {
        AWS.mock('CloudWatchLogs', 'createLogGroup', sinon.fake.resolves({}));
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', sinon.fake.resolves({}));
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', sinon.fake.resolves({}));
        const event = {
            ...eventCommon,
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
            },
        };
        async function withOperation(operation) {
            const request = nock('https://localhost')
                .put('/', (body) => body.Data?.LogGroupName === 'group')
                .reply(200);
            const opEvent = { ...event, RequestType: operation };
            await provider.handler(opEvent, context);
            expect(request.isDone()).toEqual(true);
        }
        await withOperation('Create');
        await withOperation('Update');
        await withOperation('Delete');
    });
    test('custom log retention retry options', async () => {
        AWS.mock('CloudWatchLogs', 'createLogGroup', sinon.fake.resolves({}));
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', sinon.fake.resolves({}));
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', sinon.fake.resolves({}));
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
                SdkRetry: {
                    maxRetries: '5',
                    base: '300',
                },
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        sinon.assert.calledWith(AWSSDK.CloudWatchLogs, {
            apiVersion: '2014-03-28',
            maxRetries: 5,
            region: undefined,
            retryOptions: {
                base: 300,
            },
        });
        expect(request.isDone()).toEqual(true);
    });
    test('custom log retention region', async () => {
        AWS.mock('CloudWatchLogs', 'createLogGroup', sinon.fake.resolves({}));
        AWS.mock('CloudWatchLogs', 'putRetentionPolicy', sinon.fake.resolves({}));
        AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', sinon.fake.resolves({}));
        const event = {
            ...eventCommon,
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'token',
                RetentionInDays: '30',
                LogGroupName: 'group',
                LogGroupRegion: 'us-east-1',
            },
        };
        const request = createRequest('SUCCESS');
        await provider.handler(event, context);
        sinon.assert.calledWith(AWSSDK.CloudWatchLogs, {
            apiVersion: '2014-03-28',
            region: 'us-east-1',
        });
        expect(request.isDone()).toEqual(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXJldGVudGlvbi1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLXJldGVudGlvbi1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0NBQWtDO0FBQ2xDLG9DQUFvQztBQUNwQyw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLDBEQUEwRDtBQUUxRCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUV2QyxNQUFNLFdBQVcsR0FBRztJQUNsQixZQUFZLEVBQUUsT0FBTztJQUNyQixXQUFXLEVBQUUsbUJBQW1CO0lBQ2hDLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLGlCQUFpQixFQUFFLG1CQUFtQjtJQUN0QyxrQkFBa0IsRUFBRSxPQUFPO0lBQzNCLFlBQVksRUFBRSxzQkFBc0I7Q0FDckMsQ0FBQztBQUVGLE1BQU0sT0FBTyxHQUFHO0lBQ2QsWUFBWSxFQUFFLFVBQVU7Q0FDSixDQUFDO0FBRXZCLFNBQVMsYUFBYSxDQUFDLElBQVk7SUFDakMsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7U0FDN0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQW9ELEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsS0FBSyxPQUFPLENBQUM7U0FDL0gsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLE9BQVEsU0FBUSxLQUFLO0lBRXpCLFlBQVksT0FBZSxFQUFFLElBQVk7UUFDdkMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7Q0FDRjtBQUVELFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsU0FBUyxD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QUU3RSxNQUFNLEtBQUssR0FBRztZQUNaLEdBQUcsV0FBVztZQUNkLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLGtCQUFrQixFQUFFO2dCQUNsQixZQUFZLEVBQUUsT0FBTztnQkFDckIsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLFlBQVksRUFBRSxPQUFPO2dCQUNyQixjQUFjLEVBQUUsV0FBVzthQUM1QjtTQUNGLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFekMsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQTBELEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFNUYsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQXFCLEVBQUU7WUFDcEQsVUFBVSxFQUFFLFlBQVk7WUFDeEIsTUFBTSxFQUFFLFdBQVc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUd6QyxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQVdTU0RLIGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gJ2F3cy1zZGstbW9jayc7XG5pbXBvcnQgKiBhcyBub2NrIGZyb20gJ25vY2snO1xuaW1wb3J0ICogYXMgc2lub24gZnJvbSAnc2lub24nO1xuaW1wb3J0ICogYXMgcHJvdmlkZXIgZnJvbSAnLi4vbGliL2xvZy1yZXRlbnRpb24tcHJvdmlkZXInO1xuXG5BV1Muc2V0U0RLKHJlcXVpcmUucmVzb2x2ZSgnYXdzLXNkaycpKTtcblxuY29uc3QgZXZlbnRDb21tb24gPSB7XG4gIFNlcnZpY2VUb2tlbjogJ3Rva2VuJyxcbiAgUmVzcG9uc2VVUkw6ICdodHRwczovL2xvY2FsaG9zdCcsXG4gIFN0YWNrSWQ6ICdzdGFja0lkJyxcbiAgUmVxdWVzdElkOiAncmVxdWVzdElkJyxcbiAgTG9naWNhbFJlc291cmNlSWQ6ICdsb2dpY2FsUmVzb3VyY2VJZCcsXG4gIFBoeXNpY2FsUmVzb3VyY2VJZDogJ2dyb3VwJyxcbiAgUmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLFxufTtcblxuY29uc3QgY29udGV4dCA9IHtcbiAgZnVuY3Rpb25OYW1lOiAncHJvdmlkZXInLFxufSBhcyBBV1NMYW1iZGEuQ29udGV4dDtcblxuZnVuY3Rpb24gY3JlYXRlUmVxdWVzdCh0eXBlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5vY2soJ2h0dHBzOi8vbG9jYWxob3N0JylcbiAgICAucHV0KCcvJywgKGJvZHk6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlUmVzcG9uc2UpID0+IGJvZHkuU3RhdHVzID09PSB0eXBlICYmIGJvZHkuUGh5c2ljYWxSZXNvdXJjZUlkID09PSAnZ3JvdXAnKVxuICAgIC5yZXBseSgyMDApO1xufVxuXG5jbGFzcyBNeUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb2RlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgY29kZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbiAgfVxufVxuXG5kZXNjcmliZSgnbG9nIHJldGVudGlvbiBwcm92aWRlcicsICgpID0+IHtcbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBBV1MucmVzdG9yZSgpO1xuICAgIG5vY2suY2xlYW5BbGwoKTtcblxuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgZXZlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY3JlYXRlTG9nR3JvdXBGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG4gICAgY29uc3QgcHV0UmV0ZW50aW9uUG9saWN5RmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuICAgIGNvbnN0IGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcblxuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdjcmVhdGVMb2dHcm91cCcsIGNyZWF0ZUxvZ0dyb3VwRmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ3B1dFJldGVudGlvblBvbGljeScsIHB1dFJldGVudGlvblBvbGljeUZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdkZWxldGVSZXRlbnRpb25Qb2xpY3knLCBkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlKTtcblxuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgLi4uZXZlbnRDb21tb24sXG4gICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAndG9rZW4nLFxuICAgICAgICBSZXRlbnRpb25JbkRheXM6ICczMCcsXG4gICAgICAgIExvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBjcmVhdGVSZXF1ZXN0KCdTVUNDRVNTJyk7XG5cbiAgICBhd2FpdCBwcm92aWRlci5oYW5kbGVyKGV2ZW50IGFzIEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlQ3JlYXRlRXZlbnQsIGNvbnRleHQpO1xuXG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoY3JlYXRlTG9nR3JvdXBGYWtlLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgfSk7XG5cbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChwdXRSZXRlbnRpb25Qb2xpY3lGYWtlLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICByZXRlbnRpb25JbkRheXM6IDMwLFxuICAgIH0pO1xuXG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoY3JlYXRlTG9nR3JvdXBGYWtlLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICcvYXdzL2xhbWJkYS9wcm92aWRlcicsXG4gICAgfSk7XG5cbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChwdXRSZXRlbnRpb25Qb2xpY3lGYWtlLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICcvYXdzL2xhbWJkYS9wcm92aWRlcicsXG4gICAgICByZXRlbnRpb25JbkRheXM6IDEsXG4gICAgfSk7XG5cbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgZXhwZWN0KHJlcXVlc3QuaXNEb25lKCkpLnRvRXF1YWwodHJ1ZSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd1cGRhdGUgZXZlbnQgd2l0aCBuZXcgbG9nIHJldGVudGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpIGFzIE5vZGVKUy5FcnJub0V4Y2VwdGlvbjtcbiAgICBlcnJvci5jb2RlID0gJ1Jlc291cmNlQWxyZWFkeUV4aXN0c0V4Y2VwdGlvbic7XG5cbiAgICBjb25zdCBjcmVhdGVMb2dHcm91cEZha2UgPSBzaW5vbi5mYWtlLnJlamVjdHMoZXJyb3IpO1xuICAgIGNvbnN0IHB1dFJldGVudGlvblBvbGljeUZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcbiAgICBjb25zdCBkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBjcmVhdGVMb2dHcm91cEZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdwdXRSZXRlbnRpb25Qb2xpY3knLCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5JywgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSk7XG5cbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIC4uLmV2ZW50Q29tbW9uLFxuICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ3Rva2VuJyxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiAnMzY1JyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgfSxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIExvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiAnMzAnLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IGNyZWF0ZVJlcXVlc3QoJ1NVQ0NFU1MnKTtcblxuICAgIGF3YWl0IHByb3ZpZGVyLmhhbmRsZXIoZXZlbnQgYXMgQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VVcGRhdGVFdmVudCwgY29udGV4dCk7XG5cbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChjcmVhdGVMb2dHcm91cEZha2UsIHtcbiAgICAgIGxvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICB9KTtcblxuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKHB1dFJldGVudGlvblBvbGljeUZha2UsIHtcbiAgICAgIGxvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgIHJldGVudGlvbkluRGF5czogMzY1LFxuICAgIH0pO1xuXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlKTtcblxuICAgIGV4cGVjdChyZXF1ZXN0LmlzRG9uZSgpKS50b0VxdWFsKHRydWUpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgndXBkYXRlIGV2ZW50IHdpdGggbG9nIHJldGVudGlvbiB1bmRlZmluZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoKSBhcyBOb2RlSlMuRXJybm9FeGNlcHRpb247XG4gICAgZXJyb3IuY29kZSA9ICdSZXNvdXJjZUFscmVhZHlFeGlzdHNFeGNlcHRpb24nO1xuXG4gICAgY29uc3QgY3JlYXRlTG9nR3JvdXBGYWtlID0gc2lub24uZmFrZS5yZWplY3RzKGVycm9yKTtcbiAgICBjb25zdCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG4gICAgY29uc3QgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuXG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2NyZWF0ZUxvZ0dyb3VwJywgY3JlYXRlTG9nR3JvdXBGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAncHV0UmV0ZW50aW9uUG9saWN5JywgcHV0UmV0ZW50aW9uUG9saWN5RmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2RlbGV0ZVJldGVudGlvblBvbGljeScsIGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ2dyb3VwJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIExvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgIH0sXG4gICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAndG9rZW4nLFxuICAgICAgICBMb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzM2NScsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gY3JlYXRlUmVxdWVzdCgnU1VDQ0VTUycpO1xuXG4gICAgYXdhaXQgcHJvdmlkZXIuaGFuZGxlcihldmVudCBhcyBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZVVwZGF0ZUV2ZW50LCBjb250ZXh0KTtcblxuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKGNyZWF0ZUxvZ0dyb3VwRmFrZSwge1xuICAgICAgbG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgIH0pO1xuXG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSwge1xuICAgICAgbG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlcXVlc3QuaXNEb25lKCkpLnRvRXF1YWwodHJ1ZSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdkZWxldGUgZXZlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY3JlYXRlTG9nR3JvdXBGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG4gICAgY29uc3QgcHV0UmV0ZW50aW9uUG9saWN5RmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuICAgIGNvbnN0IGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcblxuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdjcmVhdGVMb2dHcm91cCcsIGNyZWF0ZUxvZ0dyb3VwRmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ3B1dFJldGVudGlvblBvbGljeScsIHB1dFJldGVudGlvblBvbGljeUZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdkZWxldGVSZXRlbnRpb25Qb2xpY3knLCBkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlKTtcblxuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgLi4uZXZlbnRDb21tb24sXG4gICAgICBSZXF1ZXN0VHlwZTogJ0RlbGV0ZScsXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdncm91cCcsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAndG9rZW4nLFxuICAgICAgICBMb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gY3JlYXRlUmVxdWVzdCgnU1VDQ0VTUycpO1xuXG4gICAgYXdhaXQgcHJvdmlkZXIuaGFuZGxlcihldmVudCBhcyBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZURlbGV0ZUV2ZW50LCBjb250ZXh0KTtcblxuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoY3JlYXRlTG9nR3JvdXBGYWtlKTtcblxuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQocHV0UmV0ZW50aW9uUG9saWN5RmFrZSk7XG5cbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgZXhwZWN0KHJlcXVlc3QuaXNEb25lKCkpLnRvRXF1YWwodHJ1ZSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdkZWxldGUgZXZlbnQgd2l0aCBSZW1vdmFsUG9saWN5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGNyZWF0ZUxvZ0dyb3VwRmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuICAgIGNvbnN0IGRlbGV0ZUxvZ0dyb3VwRmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuICAgIGNvbnN0IHB1dFJldGVudGlvblBvbGljeUZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcbiAgICBjb25zdCBkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBjcmVhdGVMb2dHcm91cEZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdkZWxldGVMb2dHcm91cCcsIGRlbGV0ZUxvZ0dyb3VwRmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ3B1dFJldGVudGlvblBvbGljeScsIHB1dFJldGVudGlvblBvbGljeUZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdkZWxldGVSZXRlbnRpb25Qb2xpY3knLCBkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlKTtcblxuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgLi4uZXZlbnRDb21tb24sXG4gICAgICBSZXF1ZXN0VHlwZTogJ0RlbGV0ZScsXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdncm91cCcsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAndG9rZW4nLFxuICAgICAgICBMb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICAgIFJlbW92YWxQb2xpY3k6ICdkZXN0cm95JyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBjcmVhdGVSZXF1ZXN0KCdTVUNDRVNTJyk7XG5cbiAgICBhd2FpdCBwcm92aWRlci5oYW5kbGVyKGV2ZW50IGFzIEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRGVsZXRlRXZlbnQsIGNvbnRleHQpO1xuXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChjcmVhdGVMb2dHcm91cEZha2UpO1xuXG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoZGVsZXRlTG9nR3JvdXBGYWtlLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgfSk7XG5cbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKHB1dFJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlKTtcblxuICAgIGV4cGVjdChyZXF1ZXN0LmlzRG9uZSgpKS50b0VxdWFsKHRydWUpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgncmVzcG9uZHMgd2l0aCBGQUlMRUQgb24gZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY3JlYXRlTG9nR3JvdXBGYWtlID0gc2lub24uZmFrZS5yZWplY3RzKG5ldyBFcnJvcignVW5rbm93bkVycm9yJykpO1xuXG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2NyZWF0ZUxvZ0dyb3VwJywgY3JlYXRlTG9nR3JvdXBGYWtlKTtcblxuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgLi4uZXZlbnRDb21tb24sXG4gICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAndG9rZW4nLFxuICAgICAgICBSZXRlbnRpb25JbkRheXM6ICczMCcsXG4gICAgICAgIExvZ0dyb3VwTmFtZTogJ2dyb3VwJyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBjcmVhdGVSZXF1ZXN0KCdGQUlMRUQnKTtcblxuICAgIGF3YWl0IHByb3ZpZGVyLmhhbmRsZXIoZXZlbnQgYXMgQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VDcmVhdGVFdmVudCwgY29udGV4dCk7XG5cbiAgICBleHBlY3QocmVxdWVzdC5pc0RvbmUoKSkudG9FcXVhbCh0cnVlKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3N1Y2NlZWRzIHdoZW4gY3JlYXRlTG9nR3JvdXAgZm9yIHByb3ZpZGVyIGxvZyBncm91cCByZXR1cm5zIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24gdHdpY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGF0dGVtcHQgPSAyO1xuICAgIGNvbnN0IGNyZWF0ZUxvZ0dyb3VwRmFrZSA9IChwYXJhbXM6IEFXU1NESy5DbG91ZFdhdGNoTG9ncy5DcmVhdGVMb2dHcm91cFJlcXVlc3QpID0+IHtcbiAgICAgIGlmIChwYXJhbXMubG9nR3JvdXBOYW1lID09PSAnL2F3cy9sYW1iZGEvcHJvdmlkZXInKSB7XG4gICAgICAgIGlmIChhdHRlbXB0ID4gMCkge1xuICAgICAgICAgIGF0dGVtcHQtLTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IE15RXJyb3IoXG4gICAgICAgICAgICAnQSBjb25mbGljdGluZyBvcGVyYXRpb24gaXMgY3VycmVudGx5IGluIHByb2dyZXNzIGFnYWluc3QgdGhpcyByZXNvdXJjZS4gUGxlYXNlIHRyeSBhZ2Fpbi4nLFxuICAgICAgICAgICAgJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH07XG5cbiAgICBjb25zdCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG4gICAgY29uc3QgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuXG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2NyZWF0ZUxvZ0dyb3VwJywgY3JlYXRlTG9nR3JvdXBGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAncHV0UmV0ZW50aW9uUG9saWN5JywgcHV0UmV0ZW50aW9uUG9saWN5RmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2RlbGV0ZVJldGVudGlvblBvbGljeScsIGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzMwJyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IGNyZWF0ZVJlcXVlc3QoJ1NVQ0NFU1MnKTtcblxuICAgIGF3YWl0IHByb3ZpZGVyLmhhbmRsZXIoZXZlbnQgYXMgQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VDcmVhdGVFdmVudCwgY29udGV4dCk7XG5cbiAgICBleHBlY3QocmVxdWVzdC5pc0RvbmUoKSkudG9FcXVhbCh0cnVlKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3N1Y2NlZWRzIHdoZW4gY3JlYXRlTG9nR3JvdXAgZm9yIENESyBsYW1iZGEgbG9nIGdyb3VwIHJldHVybnMgT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbiB0d2ljZScsIGFzeW5jICgpID0+IHtcbiAgICBsZXQgYXR0ZW1wdCA9IDI7XG4gICAgY29uc3QgY3JlYXRlTG9nR3JvdXBGYWtlID0gKHBhcmFtczogQVdTU0RLLkNsb3VkV2F0Y2hMb2dzLkNyZWF0ZUxvZ0dyb3VwUmVxdWVzdCkgPT4ge1xuICAgICAgaWYgKHBhcmFtcy5sb2dHcm91cE5hbWUgPT09ICdncm91cCcpIHtcbiAgICAgICAgaWYgKGF0dGVtcHQgPiAwKSB7XG4gICAgICAgICAgYXR0ZW1wdC0tO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgTXlFcnJvcihcbiAgICAgICAgICAgICdBIGNvbmZsaWN0aW5nIG9wZXJhdGlvbiBpcyBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MgYWdhaW5zdCB0aGlzIHJlc291cmNlLiBQbGVhc2UgdHJ5IGFnYWluLicsXG4gICAgICAgICAgICAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHB1dFJldGVudGlvblBvbGljeUZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcbiAgICBjb25zdCBkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBjcmVhdGVMb2dHcm91cEZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdwdXRSZXRlbnRpb25Qb2xpY3knLCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5JywgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSk7XG5cbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIC4uLmV2ZW50Q29tbW9uLFxuICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ3Rva2VuJyxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiAnMzAnLFxuICAgICAgICBMb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gY3JlYXRlUmVxdWVzdCgnU1VDQ0VTUycpO1xuXG4gICAgYXdhaXQgcHJvdmlkZXIuaGFuZGxlcihldmVudCBhcyBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUNyZWF0ZUV2ZW50LCBjb250ZXh0KTtcblxuICAgIGV4cGVjdChyZXF1ZXN0LmlzRG9uZSgpKS50b0VxdWFsKHRydWUpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBjcmVhdGVMb2dHcm91cCBmb3IgQ0RLIGxhbWJkYSBsb2cgZ3JvdXAgZmFpbHMgd2l0aCBPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uIGluZGVmaW5pdGVseScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjcmVhdGVMb2dHcm91cEZha2UgPSAocGFyYW1zOiBBV1NTREsuQ2xvdWRXYXRjaExvZ3MuQ3JlYXRlTG9nR3JvdXBSZXF1ZXN0KSA9PiB7XG4gICAgICBpZiAocGFyYW1zLmxvZ0dyb3VwTmFtZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IE15RXJyb3IoXG4gICAgICAgICAgJ0EgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcyBhZ2FpbnN0IHRoaXMgcmVzb3VyY2UuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH07XG5cbiAgICBjb25zdCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG4gICAgY29uc3QgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuXG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2NyZWF0ZUxvZ0dyb3VwJywgY3JlYXRlTG9nR3JvdXBGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAncHV0UmV0ZW50aW9uUG9saWN5JywgcHV0UmV0ZW50aW9uUG9saWN5RmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2RlbGV0ZVJldGVudGlvblBvbGljeScsIGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzMwJyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IGNyZWF0ZVJlcXVlc3QoJ0ZBSUxFRCcpO1xuXG4gICAgYXdhaXQgcHJvdmlkZXIuaGFuZGxlcihldmVudCBhcyBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUNyZWF0ZUV2ZW50LCBjb250ZXh0KTtcblxuICAgIGV4cGVjdChyZXF1ZXN0LmlzRG9uZSgpKS50b0VxdWFsKHRydWUpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnc3VjY2VlZHMgd2hlbiBwdXRSZXRlbnRpb25Qb2xpY3kgZm9yIHByb3ZpZGVyIGxvZyBncm91cCByZXR1cm5zIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24gdHdpY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGF0dGVtcHQgPSAyO1xuICAgIGNvbnN0IHB1dFJldGVudGlvblBvbGljeUZha2UgPSAocGFyYW1zOiBBV1NTREsuQ2xvdWRXYXRjaExvZ3MuQ3JlYXRlTG9nR3JvdXBSZXF1ZXN0KSA9PiB7XG4gICAgICBpZiAocGFyYW1zLmxvZ0dyb3VwTmFtZSA9PT0gJy9hd3MvbGFtYmRhL3Byb3ZpZGVyJykge1xuICAgICAgICBpZiAoYXR0ZW1wdCA+IDApIHtcbiAgICAgICAgICBhdHRlbXB0LS07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBNeUVycm9yKFxuICAgICAgICAgICAgJ0EgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcyBhZ2FpbnN0IHRoaXMgcmVzb3VyY2UuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICAgICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3JlYXRlTG9nR3JvdXBGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG4gICAgY29uc3QgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuXG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2NyZWF0ZUxvZ0dyb3VwJywgY3JlYXRlTG9nR3JvdXBGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAncHV0UmV0ZW50aW9uUG9saWN5JywgcHV0UmV0ZW50aW9uUG9saWN5RmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2RlbGV0ZVJldGVudGlvblBvbGljeScsIGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzMwJyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IGNyZWF0ZVJlcXVlc3QoJ1NVQ0NFU1MnKTtcblxuICAgIGF3YWl0IHByb3ZpZGVyLmhhbmRsZXIoZXZlbnQgYXMgQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VDcmVhdGVFdmVudCwgY29udGV4dCk7XG5cbiAgICBleHBlY3QocmVxdWVzdC5pc0RvbmUoKSkudG9FcXVhbCh0cnVlKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3N1Y2NlZWRzIHdoZW4gcHV0UmV0ZW50aW9uUG9saWN5IGZvciBDREsgbGFtYmRhIGxvZyBncm91cCByZXR1cm5zIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24gdHdpY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGF0dGVtcHQgPSAyO1xuICAgIGNvbnN0IHB1dFJldGVudGlvblBvbGljeUZha2UgPSAocGFyYW1zOiBBV1NTREsuQ2xvdWRXYXRjaExvZ3MuQ3JlYXRlTG9nR3JvdXBSZXF1ZXN0KSA9PiB7XG4gICAgICBpZiAocGFyYW1zLmxvZ0dyb3VwTmFtZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICBpZiAoYXR0ZW1wdCA+IDApIHtcbiAgICAgICAgICBhdHRlbXB0LS07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBNeUVycm9yKFxuICAgICAgICAgICAgJ0EgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcyBhZ2FpbnN0IHRoaXMgcmVzb3VyY2UuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICAgICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3JlYXRlTG9nR3JvdXBGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG4gICAgY29uc3QgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe30pO1xuXG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2NyZWF0ZUxvZ0dyb3VwJywgY3JlYXRlTG9nR3JvdXBGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAncHV0UmV0ZW50aW9uUG9saWN5JywgcHV0UmV0ZW50aW9uUG9saWN5RmFrZSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ2RlbGV0ZVJldGVudGlvblBvbGljeScsIGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzMwJyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IGNyZWF0ZVJlcXVlc3QoJ1NVQ0NFU1MnKTtcblxuICAgIGF3YWl0IHByb3ZpZGVyLmhhbmRsZXIoZXZlbnQgYXMgQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VDcmVhdGVFdmVudCwgY29udGV4dCk7XG5cbiAgICBleHBlY3QocmVxdWVzdC5pc0RvbmUoKSkudG9FcXVhbCh0cnVlKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHdoZW4gcHV0UmV0ZW50aW9uUG9saWN5IGZvciBDREsgbGFtYmRhIGxvZyBncm91cCBmYWlscyB3aXRoIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24gaW5kZWZpbml0ZWx5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHB1dFJldGVudGlvblBvbGljeUZha2UgPSAocGFyYW1zOiBBV1NTREsuQ2xvdWRXYXRjaExvZ3MuQ3JlYXRlTG9nR3JvdXBSZXF1ZXN0KSA9PiB7XG4gICAgICBpZiAocGFyYW1zLmxvZ0dyb3VwTmFtZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IE15RXJyb3IoXG4gICAgICAgICAgJ0EgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcyBhZ2FpbnN0IHRoaXMgcmVzb3VyY2UuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVMb2dHcm91cEZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcbiAgICBjb25zdCBkZWxldGVSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBjcmVhdGVMb2dHcm91cEZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdwdXRSZXRlbnRpb25Qb2xpY3knLCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5JywgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSk7XG5cbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIC4uLmV2ZW50Q29tbW9uLFxuICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ3Rva2VuJyxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiAnMzAnLFxuICAgICAgICBMb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gY3JlYXRlUmVxdWVzdCgnRkFJTEVEJyk7XG5cbiAgICBhd2FpdCBwcm92aWRlci5oYW5kbGVyKGV2ZW50IGFzIEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlQ3JlYXRlRXZlbnQsIGNvbnRleHQpO1xuXG4gICAgZXhwZWN0KHJlcXVlc3QuaXNEb25lKCkpLnRvRXF1YWwodHJ1ZSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdzdWNjZWVkcyB3aGVuIGRlbGV0ZVJldGVudGlvblBvbGljeSBmb3IgcHJvdmlkZXIgbG9nIGdyb3VwIHJldHVybnMgT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbiB0d2ljZScsIGFzeW5jICgpID0+IHtcbiAgICBsZXQgYXR0ZW1wdCA9IDI7XG4gICAgY29uc3QgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSA9IChwYXJhbXM6IEFXU1NESy5DbG91ZFdhdGNoTG9ncy5DcmVhdGVMb2dHcm91cFJlcXVlc3QpID0+IHtcbiAgICAgIGlmIChwYXJhbXMubG9nR3JvdXBOYW1lID09PSAnL2F3cy9sYW1iZGEvcHJvdmlkZXInKSB7XG4gICAgICAgIGlmIChhdHRlbXB0ID4gMCkge1xuICAgICAgICAgIGF0dGVtcHQtLTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IE15RXJyb3IoXG4gICAgICAgICAgICAnQSBjb25mbGljdGluZyBvcGVyYXRpb24gaXMgY3VycmVudGx5IGluIHByb2dyZXNzIGFnYWluc3QgdGhpcyByZXNvdXJjZS4gUGxlYXNlIHRyeSBhZ2Fpbi4nLFxuICAgICAgICAgICAgJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVMb2dHcm91cEZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcbiAgICBjb25zdCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBjcmVhdGVMb2dHcm91cEZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdwdXRSZXRlbnRpb25Qb2xpY3knLCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5JywgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSk7XG5cbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIC4uLmV2ZW50Q29tbW9uLFxuICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ3Rva2VuJyxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiAnMCcsIC8vIFNldHRpbmcgdGhpcyB0byAwIHRyaWdnZXJzIHRoZSBjYWxsIHRvIGRlbGV0ZVJldGVudGlvblBvbGljeVxuICAgICAgICBMb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gY3JlYXRlUmVxdWVzdCgnU1VDQ0VTUycpO1xuXG4gICAgYXdhaXQgcHJvdmlkZXIuaGFuZGxlcihldmVudCBhcyBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUNyZWF0ZUV2ZW50LCBjb250ZXh0KTtcblxuICAgIGV4cGVjdChyZXF1ZXN0LmlzRG9uZSgpKS50b0VxdWFsKHRydWUpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBkZWxldGVSZXRlbnRpb25Qb2xpY3kgZm9yIHByb3ZpZGVyIGxvZyBncm91cCBmYWlscyB3aXRoIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24gaW5kZWZpbml0ZWx5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGRlbGV0ZVJldGVudGlvblBvbGljeUZha2UgPSAocGFyYW1zOiBBV1NTREsuQ2xvdWRXYXRjaExvZ3MuQ3JlYXRlTG9nR3JvdXBSZXF1ZXN0KSA9PiB7XG4gICAgICBpZiAocGFyYW1zLmxvZ0dyb3VwTmFtZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IE15RXJyb3IoXG4gICAgICAgICAgJ0EgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcyBhZ2FpbnN0IHRoaXMgcmVzb3VyY2UuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVMb2dHcm91cEZha2UgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcbiAgICBjb25zdCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBjcmVhdGVMb2dHcm91cEZha2UpO1xuICAgIEFXUy5tb2NrKCdDbG91ZFdhdGNoTG9ncycsICdwdXRSZXRlbnRpb25Qb2xpY3knLCBwdXRSZXRlbnRpb25Qb2xpY3lGYWtlKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5JywgZGVsZXRlUmV0ZW50aW9uUG9saWN5RmFrZSk7XG5cbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIC4uLmV2ZW50Q29tbW9uLFxuICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ3Rva2VuJyxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiAnMCcsIC8vIFNldHRpbmcgdGhpcyB0byAwIHRyaWdnZXJzIHRoZSBjYWxsIHRvIGRlbGV0ZVJldGVudGlvblBvbGljeVxuICAgICAgICBMb2dHcm91cE5hbWU6ICdncm91cCcsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gY3JlYXRlUmVxdWVzdCgnRkFJTEVEJyk7XG5cbiAgICBhd2FpdCBwcm92aWRlci5oYW5kbGVyKGV2ZW50IGFzIEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlQ3JlYXRlRXZlbnQsIGNvbnRleHQpO1xuXG4gICAgZXhwZWN0KHJlcXVlc3QuaXNEb25lKCkpLnRvRXF1YWwodHJ1ZSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdyZXNwb25zZSBkYXRhIGNvbnRhaW5zIHRoZSBsb2cgZ3JvdXAgbmFtZScsIGFzeW5jICgpID0+IHtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ3B1dFJldGVudGlvblBvbGljeScsIHNpbm9uLmZha2UucmVzb2x2ZXMoe30pKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5Jywgc2lub24uZmFrZS5yZXNvbHZlcyh7fSkpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzMwJyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gd2l0aE9wZXJhdGlvbihvcGVyYXRpb246IHN0cmluZykge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IG5vY2soJ2h0dHBzOi8vbG9jYWxob3N0JylcbiAgICAgICAgLnB1dCgnLycsIChib2R5OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZVJlc3BvbnNlKSA9PiBib2R5LkRhdGE/LkxvZ0dyb3VwTmFtZSA9PT0gJ2dyb3VwJylcbiAgICAgICAgLnJlcGx5KDIwMCk7XG5cbiAgICAgIGNvbnN0IG9wRXZlbnQgPSB7IC4uLmV2ZW50LCBSZXF1ZXN0VHlwZTogb3BlcmF0aW9uIH07XG4gICAgICBhd2FpdCBwcm92aWRlci5oYW5kbGVyKG9wRXZlbnQgYXMgQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VDcmVhdGVFdmVudCwgY29udGV4dCk7XG5cbiAgICAgIGV4cGVjdChyZXF1ZXN0LmlzRG9uZSgpKS50b0VxdWFsKHRydWUpO1xuICAgIH1cblxuICAgIGF3YWl0IHdpdGhPcGVyYXRpb24oJ0NyZWF0ZScpO1xuICAgIGF3YWl0IHdpdGhPcGVyYXRpb24oJ1VwZGF0ZScpO1xuICAgIGF3YWl0IHdpdGhPcGVyYXRpb24oJ0RlbGV0ZScpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIGxvZyByZXRlbnRpb24gcmV0cnkgb3B0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ3B1dFJldGVudGlvblBvbGljeScsIHNpbm9uLmZha2UucmVzb2x2ZXMoe30pKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5Jywgc2lub24uZmFrZS5yZXNvbHZlcyh7fSkpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzMwJyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgICBTZGtSZXRyeToge1xuICAgICAgICAgIG1heFJldHJpZXM6ICc1JyxcbiAgICAgICAgICBiYXNlOiAnMzAwJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBjcmVhdGVSZXF1ZXN0KCdTVUNDRVNTJyk7XG5cbiAgICBhd2FpdCBwcm92aWRlci5oYW5kbGVyKGV2ZW50IGFzIEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlQ3JlYXRlRXZlbnQsIGNvbnRleHQpO1xuXG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoQVdTU0RLLkNsb3VkV2F0Y2hMb2dzIGFzIGFueSwge1xuICAgICAgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLFxuICAgICAgbWF4UmV0cmllczogNSxcbiAgICAgIHJlZ2lvbjogdW5kZWZpbmVkLFxuICAgICAgcmV0cnlPcHRpb25zOiB7XG4gICAgICAgIGJhc2U6IDMwMCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVxdWVzdC5pc0RvbmUoKSkudG9FcXVhbCh0cnVlKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbSBsb2cgcmV0ZW50aW9uIHJlZ2lvbicsIGFzeW5jICgpID0+IHtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnY3JlYXRlTG9nR3JvdXAnLCBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KSk7XG4gICAgQVdTLm1vY2soJ0Nsb3VkV2F0Y2hMb2dzJywgJ3B1dFJldGVudGlvblBvbGljeScsIHNpbm9uLmZha2UucmVzb2x2ZXMoe30pKTtcbiAgICBBV1MubW9jaygnQ2xvdWRXYXRjaExvZ3MnLCAnZGVsZXRlUmV0ZW50aW9uUG9saWN5Jywgc2lub24uZmFrZS5yZXNvbHZlcyh7fSkpO1xuXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAuLi5ldmVudENvbW1vbixcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICd0b2tlbicsXG4gICAgICAgIFJldGVudGlvbkluRGF5czogJzMwJyxcbiAgICAgICAgTG9nR3JvdXBOYW1lOiAnZ3JvdXAnLFxuICAgICAgICBMb2dHcm91cFJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gY3JlYXRlUmVxdWVzdCgnU1VDQ0VTUycpO1xuXG4gICAgYXdhaXQgcHJvdmlkZXIuaGFuZGxlcihldmVudCBhcyBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUNyZWF0ZUV2ZW50LCBjb250ZXh0KTtcblxuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKEFXU1NESy5DbG91ZFdhdGNoTG9ncyBhcyBhbnksIHtcbiAgICAgIGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JyxcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVxdWVzdC5pc0RvbmUoKSkudG9FcXVhbCh0cnVlKTtcblxuXG4gIH0pO1xuXG59KTtcbiJdfQ==