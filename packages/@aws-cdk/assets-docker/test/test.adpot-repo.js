"use strict";
const path = require("path");
const proxyquire = require("proxyquire");
let ecrMock;
function ECRWithEmptyPolicy() {
    ecrMock = new ECR({ asdf: 'asdf' });
    return ecrMock;
}
function ECRWithOwningPolicy() {
    return new ECR({
        Statement: [
            {
                Sid: 'StackId',
                Effect: "Deny",
                Action: "OwnedBy:CDKStack",
                Principal: "*"
            }
        ]
    });
}
function ECRWithRepositoryNotFound() {
    const ecr = new ECR({});
    ecr.shouldThrowNotFound = true;
    return ecr;
}
class ECR {
    constructor(policy) {
        this.policy = policy;
        this.shouldThrowNotFound = false;
    }
    getRepositoryPolicy() {
        const self = this;
        return {
            async promise() {
                if (self.shouldThrowNotFound) {
                    return self.throwNotFound();
                }
                return { policyText: JSON.stringify(self.policy) };
            }
        };
    }
    setRepositoryPolicy(req) {
        const self = this;
        this.lastSetRepositoryPolicyRequest = req;
        return {
            async promise() {
                if (self.shouldThrowNotFound) {
                    return self.throwNotFound();
                }
                return;
            }
        };
    }
    listImages() {
        return {
            async promise() {
                return { imageIds: [] };
            }
        };
    }
    batchDeleteImage() {
        const self = this;
        return {
            async promise() {
                if (self.shouldThrowNotFound) {
                    return self.throwNotFound();
                }
                return {};
            }
        };
    }
    deleteRepository() {
        const self = this;
        return {
            async promise() {
                if (self.shouldThrowNotFound) {
                    return self.throwNotFound();
                }
                return {};
            }
        };
    }
    throwNotFound() {
        const err = new Error('Simulated RepositoryPolicyNotFoundException');
        err.code = 'RepositoryPolicyNotFoundException';
        throw err;
    }
}
module.exports = {
    async 'exercise handler create with policy'(test) {
        const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
            'aws-sdk': {
                '@noCallThru': true,
                "ECR": ECRWithEmptyPolicy,
            }
        });
        let output;
        async function response(responseStatus, reason, physId, data) {
            output = { responseStatus, reason, physId, data };
        }
        await handler.handler({
            StackId: 'StackId',
            ResourceProperties: {
                RepositoryName: 'RepositoryName',
                PolicyDocument: {
                    Version: '2008-10-01',
                    My: 'Document'
                }
            },
            RequestType: 'Create',
            ResponseURL: 'https://localhost/test'
        }, {
            logStreamName: 'xyz',
        }, undefined, response);
        test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
            My: "Document",
            Version: '2008-10-01',
            Statement: [
                { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
            ]
        });
        test.deepEqual(output, {
            responseStatus: 'SUCCESS',
            reason: 'OK',
            physId: 'RepositoryName',
            data: {
                RepositoryName: 'RepositoryName'
            }
        });
        test.done();
    },
    async 'exercise handler create with policy with object statement'(test) {
        const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
            'aws-sdk': {
                '@noCallThru': true,
                "ECR": ECRWithEmptyPolicy,
            }
        });
        let output;
        async function response(responseStatus, reason, physId, data) {
            output = { responseStatus, reason, physId, data };
        }
        await handler.handler({
            StackId: 'StackId',
            ResourceProperties: {
                RepositoryName: 'RepositoryName',
                PolicyDocument: {
                    Statement: { Action: 'boom' }
                }
            },
            RequestType: 'Create',
            ResponseURL: 'https://localhost/test'
        }, {
            logStreamName: 'xyz',
        }, undefined, response);
        test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
            Version: '2008-10-17',
            Statement: [
                { Action: 'boom' },
                { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
            ]
        });
        test.deepEqual(output, {
            responseStatus: 'SUCCESS',
            reason: 'OK',
            physId: 'RepositoryName',
            data: {
                RepositoryName: 'RepositoryName'
            }
        });
        test.done();
    },
    async 'exercise handler create with policy with array statement'(test) {
        const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
            'aws-sdk': {
                '@noCallThru': true,
                "ECR": ECRWithEmptyPolicy,
            }
        });
        let output;
        async function response(responseStatus, reason, physId, data) {
            output = { responseStatus, reason, physId, data };
        }
        await handler.handler({
            StackId: 'StackId',
            ResourceProperties: {
                RepositoryName: 'RepositoryName',
                PolicyDocument: {
                    Statement: [{ Action: 'boom' }, { Resource: "foo" }]
                }
            },
            RequestType: 'Create',
            ResponseURL: 'https://localhost/test'
        }, {
            logStreamName: 'xyz',
        }, undefined, response);
        test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
            Version: '2008-10-17',
            Statement: [
                { Action: "boom" },
                { Resource: "foo" },
                { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
            ]
        });
        test.deepEqual(output, {
            responseStatus: 'SUCCESS',
            reason: 'OK',
            physId: 'RepositoryName',
            data: {
                RepositoryName: 'RepositoryName'
            }
        });
        test.done();
    },
    async 'exercise handler create'(test) {
        const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
            'aws-sdk': {
                '@noCallThru': true,
                "ECR": ECRWithEmptyPolicy,
            }
        });
        let output;
        async function response(responseStatus, reason, physId, data) {
            output = { responseStatus, reason, physId, data };
        }
        await handler.handler({
            StackId: 'StackId',
            ResourceProperties: {
                RepositoryName: 'RepositoryName',
            },
            RequestType: 'Create',
            ResponseURL: 'https://localhost/test'
        }, {
            logStreamName: 'xyz',
        }, undefined, response);
        test.deepEqual(output, {
            responseStatus: 'SUCCESS',
            reason: 'OK',
            physId: 'RepositoryName',
            data: {
                RepositoryName: 'RepositoryName'
            }
        });
        test.done();
    },
    async 'exercise handler delete'(test) {
        const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
            'aws-sdk': { '@noCallThru': true, "ECR": ECRWithOwningPolicy }
        });
        let output;
        async function response(responseStatus, reason, physId, data) {
            output = { responseStatus, reason, physId, data };
        }
        await handler.handler({
            StackId: 'StackId',
            ResourceProperties: {
                RepositoryName: 'RepositoryName',
            },
            RequestType: 'Delete',
            ResponseURL: 'https://localhost/test'
        }, {
            logStreamName: 'xyz',
        }, undefined, response);
        test.deepEqual(output, {
            responseStatus: 'SUCCESS',
            reason: 'OK',
            physId: 'RepositoryName',
            data: {
                RepositoryName: 'RepositoryName'
            }
        });
        test.done();
    },
    async 'exercise "delete" handler when repository doesnt exist'(test) {
        const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
            'aws-sdk': { '@noCallThru': true, "ECR": ECRWithRepositoryNotFound }
        });
        let output;
        async function response(responseStatus, reason, physId, data) {
            output = { responseStatus, reason, physId, data };
        }
        await handler.handler({
            StackId: 'StackId',
            ResourceProperties: {
                RepositoryName: 'RepositoryName',
            },
            RequestType: 'Delete',
            ResponseURL: 'https://localhost/test'
        }, {
            logStreamName: 'xyz',
        }, undefined, response);
        test.deepEqual(output, {
            responseStatus: 'SUCCESS',
            reason: 'OK',
            physId: 'RepositoryName',
            data: {
                RepositoryName: 'RepositoryName'
            }
        });
        test.done();
    },
    async 'exercise "create" handler when repository doesnt exist'(test) {
        const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
            'aws-sdk': { '@noCallThru': true, "ECR": ECRWithRepositoryNotFound }
        });
        let output;
        async function response(responseStatus, reason, physId, data) {
            output = { responseStatus, reason, physId, data };
        }
        await handler.handler({
            StackId: 'StackId',
            ResourceProperties: {
                RepositoryName: 'RepositoryName',
            },
            RequestType: 'Create',
            ResponseURL: 'https://localhost/test'
        }, {
            logStreamName: 'xyz',
        }, undefined, response);
        test.deepEqual(output, {
            responseStatus: 'FAILED',
            reason: 'Simulated RepositoryPolicyNotFoundException',
            physId: 'xyz',
            data: {}
        });
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5hZHBvdC1yZXBvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVzdC5hZHBvdC1yZXBvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw2QkFBOEI7QUFDOUIseUNBQTBDO0FBRTFDLElBQUksT0FBWSxDQUFDO0FBd1JqQixTQUFTLGtCQUFrQjtJQUN6QixPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNwQyxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyxtQkFBbUI7SUFDMUIsT0FBTyxJQUFJLEdBQUcsQ0FBQztRQUNiLFNBQVMsRUFBRTtZQUNUO2dCQUNFLEdBQUcsRUFBRSxTQUFTO2dCQUNkLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQzFCLFNBQVMsRUFBRSxHQUFHO2FBQ2Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLHlCQUF5QjtJQUNoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBQy9CLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sR0FBRztJQUlQLFlBQTJCLE1BQVc7UUFBWCxXQUFNLEdBQU4sTUFBTSxDQUFLO1FBRi9CLHdCQUFtQixHQUFHLEtBQUssQ0FBQztJQUduQyxDQUFDO0lBRU0sbUJBQW1CO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixPQUFPO1lBQ0wsS0FBSyxDQUFDLE9BQU87Z0JBQ1gsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7b0JBQUUsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQUU7Z0JBQzlELE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMs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QUNqQztZQUNELFdBQVcsRUFBRSxRQUFRO1lBQ3JCLFdBQVcsRUFBRSx3QkFBd0I7U0FDdEMsRUFBRTtZQUNELGFBQWEsRUFBRSxLQUFLO1NBQ3JCLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQ3JCLGNBQWMsRUFBRSxRQUFRO1lBQ3hCLE1BQU0sRUFBRSw2Q0FBNkM7WUFDckQsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsRUFBRztTQUNWLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVzdCB9IGZyb20gJ25vZGV1bml0JztcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IHByb3h5cXVpcmUgPSByZXF1aXJlKCdwcm94eXF1aXJlJyk7XG5cbmxldCBlY3JNb2NrOiBhbnk7XG5cbmV4cG9ydCA9IHtcbiAgYXN5bmMgJ2V4ZXJjaXNlIGhhbmRsZXIgY3JlYXRlIHdpdGggcG9saWN5Jyh0ZXN0OiBUZXN0KSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHByb3h5cXVpcmUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ2xpYicsICdhZG9wdC1yZXBvc2l0b3J5JywgJ2hhbmRsZXInKSwge1xuICAgICAgJ2F3cy1zZGsnOiB7XG4gICAgICAgICdAbm9DYWxsVGhydSc6IHRydWUsXG4gICAgICAgIFwiRUNSXCI6IEVDUldpdGhFbXB0eVBvbGljeSxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBvdXRwdXQ7XG4gICAgYXN5bmMgZnVuY3Rpb24gcmVzcG9uc2UocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNJZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIG91dHB1dCA9IHsgcmVzcG9uc2VTdGF0dXMsIHJlYXNvbiwgcGh5c0lkLCBkYXRhIH07XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5oYW5kbGVyKHtcbiAgICAgIFN0YWNrSWQ6ICdTdGFja0lkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZXBvc2l0b3J5TmFtZTogJ1JlcG9zaXRvcnlOYW1lJyxcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBWZXJzaW9uOiAnMjAwOC0xMC0wMScsXG4gICAgICAgICAgTXk6ICdEb2N1bWVudCdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc3BvbnNlVVJMOiAnaHR0cHM6Ly9sb2NhbGhvc3QvdGVzdCdcbiAgICB9LCB7XG4gICAgICBsb2dTdHJlYW1OYW1lOiAneHl6JyxcbiAgICB9LCB1bmRlZmluZWQsIHJlc3BvbnNlKTtcblxuICAgIHRlc3QuZGVlcEVxdWFsKEpTT04ucGFyc2UoZWNyTW9jay5sYXN0U2V0UmVwb3NpdG9yeVBvbGljeVJlcXVlc3QucG9saWN5VGV4dCksIHtcbiAgICAgIE15OiBcIkRvY3VtZW50XCIsXG4gICAgICBWZXJzaW9uOiAnMjAwOC0xMC0wMScsXG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgeyBTaWQ6IFwiU3RhY2tJZFwiLCBFZmZlY3Q6IFwiRGVueVwiLCBBY3Rpb246IFwiT3duZWRCeTpDREtTdGFja1wiLCBQcmluY2lwYWw6IFwiKlwiIH1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHRlc3QuZGVlcEVxdWFsKG91dHB1dCwge1xuICAgICAgcmVzcG9uc2VTdGF0dXM6ICdTVUNDRVNTJyxcbiAgICAgIHJlYXNvbjogJ09LJyxcbiAgICAgIHBoeXNJZDogJ1JlcG9zaXRvcnlOYW1lJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6ICdSZXBvc2l0b3J5TmFtZSdcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gIGFzeW5jICdleGVyY2lzZSBoYW5kbGVyIGNyZWF0ZSB3aXRoIHBvbGljeSB3aXRoIG9iamVjdCBzdGF0ZW1lbnQnKHRlc3Q6IFRlc3QpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gcHJveHlxdWlyZShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnbGliJywgJ2Fkb3B0LXJlcG9zaXRvcnknLCAnaGFuZGxlcicpLCB7XG4gICAgICAnYXdzLXNkayc6IHtcbiAgICAgICAgJ0Bub0NhbGxUaHJ1JzogdHJ1ZSxcbiAgICAgICAgXCJFQ1JcIjogRUNSV2l0aEVtcHR5UG9saWN5LFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IG91dHB1dDtcbiAgICBhc3luYyBmdW5jdGlvbiByZXNwb25zZShyZXNwb25zZVN0YXR1czogc3RyaW5nLCByZWFzb246IHN0cmluZywgcGh5c0lkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgICAgb3V0cHV0ID0geyByZXNwb25zZVN0YXR1cywgcmVhc29uLCBwaHlzSWQsIGRhdGEgfTtcbiAgICB9XG5cbiAgICBhd2FpdCBoYW5kbGVyLmhhbmRsZXIoe1xuICAgICAgU3RhY2tJZDogJ1N0YWNrSWQnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlcG9zaXRvcnlOYW1lOiAnUmVwb3NpdG9yeU5hbWUnLFxuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogeyBBY3Rpb246ICdib29tJyB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICBSZXNwb25zZVVSTDogJ2h0dHBzOi8vbG9jYWxob3N0L3Rlc3QnXG4gICAgfSwge1xuICAgICAgbG9nU3RyZWFtTmFtZTogJ3h5eicsXG4gICAgfSwgdW5kZWZpbmVkLCByZXNwb25zZSk7XG5cbiAgICB0ZXN0LmRlZXBFcXVhbChKU09OLnBhcnNlKGVjck1vY2subGFzdFNldFJlcG9zaXRvcnlQb2xpY3lSZXF1ZXN0LnBvbGljeVRleHQpLCB7XG4gICAgICBWZXJzaW9uOiAnMjAwOC0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgeyBBY3Rpb246ICdib29tJyB9LFxuICAgICAgICB7IFNpZDogXCJTdGFja0lkXCIsIEVmZmVjdDogXCJEZW55XCIsIEFjdGlvbjogXCJPd25lZEJ5OkNES1N0YWNrXCIsIFByaW5jaXBhbDogXCIqXCIgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgdGVzdC5kZWVwRXF1YWwob3V0cHV0LCB7XG4gICAgICByZXNwb25zZVN0YXR1czogJ1NVQ0NFU1MnLFxuICAgICAgcmVhc29uOiAnT0snLFxuICAgICAgcGh5c0lkOiAnUmVwb3NpdG9yeU5hbWUnLFxuICAgICAgZGF0YToge1xuICAgICAgICBSZXBvc2l0b3J5TmFtZTogJ1JlcG9zaXRvcnlOYW1lJ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgYXN5bmMgJ2V4ZXJjaXNlIGhhbmRsZXIgY3JlYXRlIHdpdGggcG9saWN5IHdpdGggYXJyYXkgc3RhdGVtZW50Jyh0ZXN0OiBUZXN0KSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHByb3h5cXVpcmUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ2xpYicsICdhZG9wdC1yZXBvc2l0b3J5JywgJ2hhbmRsZXInKSwge1xuICAgICAgJ2F3cy1zZGsnOiB7XG4gICAgICAgICdAbm9DYWxsVGhydSc6IHRydWUsXG4gICAgICAgIFwiRUNSXCI6IEVDUldpdGhFbXB0eVBvbGljeSxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBvdXRwdXQ7XG4gICAgYXN5bmMgZnVuY3Rpb24gcmVzcG9uc2UocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNJZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIG91dHB1dCA9IHsgcmVzcG9uc2VTdGF0dXMsIHJlYXNvbiwgcGh5c0lkLCBkYXRhIH07XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5oYW5kbGVyKHtcbiAgICAgIFN0YWNrSWQ6ICdTdGFja0lkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZXBvc2l0b3J5TmFtZTogJ1JlcG9zaXRvcnlOYW1lJyxcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFsgeyBBY3Rpb246ICdib29tJyB9LCB7IFJlc291cmNlOiBcImZvb1wiIH0gIF1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc3BvbnNlVVJMOiAnaHR0cHM6Ly9sb2NhbGhvc3QvdGVzdCdcbiAgICB9LCB7XG4gICAgICBsb2dTdHJlYW1OYW1lOiAneHl6JyxcbiAgICB9LCB1bmRlZmluZWQsIHJlc3BvbnNlKTtcblxuICAgIHRlc3QuZGVlcEVxdWFsKEpTT04ucGFyc2UoZWNyTW9jay5sYXN0U2V0UmVwb3NpdG9yeVBvbGljeVJlcXVlc3QucG9saWN5VGV4dCksIHtcbiAgICAgIFZlcnNpb246ICcyMDA4LTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7IEFjdGlvbjogXCJib29tXCIgfSxcbiAgICAgICAgeyBSZXNvdXJjZTogXCJmb29cIiB9LFxuICAgICAgICB7IFNpZDogXCJTdGFja0lkXCIsIEVmZmVjdDogXCJEZW55XCIsIEFjdGlvbjogXCJPd25lZEJ5OkNES1N0YWNrXCIsIFByaW5jaXBhbDogXCIqXCIgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgdGVzdC5kZWVwRXF1YWwob3V0cHV0LCB7XG4gICAgICByZXNwb25zZVN0YXR1czogJ1NVQ0NFU1MnLFxuICAgICAgcmVhc29uOiAnT0snLFxuICAgICAgcGh5c0lkOiAnUmVwb3NpdG9yeU5hbWUnLFxuICAgICAgZGF0YToge1xuICAgICAgICBSZXBvc2l0b3J5TmFtZTogJ1JlcG9zaXRvcnlOYW1lJ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgYXN5bmMgJ2V4ZXJjaXNlIGhhbmRsZXIgY3JlYXRlJyh0ZXN0OiBUZXN0KSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHByb3h5cXVpcmUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ2xpYicsICdhZG9wdC1yZXBvc2l0b3J5JywgJ2hhbmRsZXInKSwge1xuICAgICAgJ2F3cy1zZGsnOiB7XG4gICAgICAgICdAbm9DYWxsVGhydSc6IHRydWUsXG4gICAgICAgIFwiRUNSXCI6IEVDUldpdGhFbXB0eVBvbGljeSxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBvdXRwdXQ7XG4gICAgYXN5bmMgZnVuY3Rpb24gcmVzcG9uc2UocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNJZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIG91dHB1dCA9IHsgcmVzcG9uc2VTdGF0dXMsIHJlYXNvbiwgcGh5c0lkLCBkYXRhIH07XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5oYW5kbGVyKHtcbiAgICAgIFN0YWNrSWQ6ICdTdGFja0lkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZXBvc2l0b3J5TmFtZTogJ1JlcG9zaXRvcnlOYW1lJyxcbiAgICAgIH0sXG4gICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICBSZXNwb25zZVVSTDogJ2h0dHBzOi8vbG9jYWxob3N0L3Rlc3QnXG4gICAgfSwge1xuICAgICAgbG9nU3RyZWFtTmFtZTogJ3h5eicsXG4gICAgfSwgdW5kZWZpbmVkLCByZXNwb25zZSk7XG5cbiAgICB0ZXN0LmRlZXBFcXVhbChvdXRwdXQsIHtcbiAgICAgIHJlc3BvbnNlU3RhdHVzOiAnU1VDQ0VTUycsXG4gICAgICByZWFzb246ICdPSycsXG4gICAgICBwaHlzSWQ6ICdSZXBvc2l0b3J5TmFtZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIFJlcG9zaXRvcnlOYW1lOiAnUmVwb3NpdG9yeU5hbWUnXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICBhc3luYyAnZXhlcmNpc2UgaGFuZGxlciBkZWxldGUnKHRlc3Q6IFRlc3QpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gcHJveHlxdWlyZShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnbGliJywgJ2Fkb3B0LXJlcG9zaXRvcnknLCAnaGFuZGxlcicpLCB7XG4gICAgICAnYXdzLXNkayc6IHsgJ0Bub0NhbGxUaHJ1JzogdHJ1ZSwgXCJFQ1JcIjogRUNSV2l0aE93bmluZ1BvbGljeSB9XG4gICAgfSk7XG5cbiAgICBsZXQgb3V0cHV0O1xuICAgIGFzeW5jIGZ1bmN0aW9uIHJlc3BvbnNlKHJlc3BvbnNlU3RhdHVzOiBzdHJpbmcsIHJlYXNvbjogc3RyaW5nLCBwaHlzSWQ6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgICBvdXRwdXQgPSB7IHJlc3BvbnNlU3RhdHVzLCByZWFzb24sIHBoeXNJZCwgZGF0YSB9O1xuICAgIH1cblxuICAgIGF3YWl0IGhhbmRsZXIuaGFuZGxlcih7XG4gICAgICBTdGFja0lkOiAnU3RhY2tJZCcsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6ICdSZXBvc2l0b3J5TmFtZScsXG4gICAgICB9LFxuICAgICAgUmVxdWVzdFR5cGU6ICdEZWxldGUnLFxuICAgICAgUmVzcG9uc2VVUkw6ICdodHRwczovL2xvY2FsaG9zdC90ZXN0J1xuICAgIH0sIHtcbiAgICAgIGxvZ1N0cmVhbU5hbWU6ICd4eXonLFxuICAgIH0sIHVuZGVmaW5lZCwgcmVzcG9uc2UpO1xuXG4gICAgdGVzdC5kZWVwRXF1YWwob3V0cHV0LCB7XG4gICAgICByZXNwb25zZVN0YXR1czogJ1NVQ0NFU1MnLFxuICAgICAgcmVhc29uOiAnT0snLFxuICAgICAgcGh5c0lkOiAnUmVwb3NpdG9yeU5hbWUnLFxuICAgICAgZGF0YToge1xuICAgICAgICBSZXBvc2l0b3J5TmFtZTogJ1JlcG9zaXRvcnlOYW1lJ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgYXN5bmMgJ2V4ZXJjaXNlIFwiZGVsZXRlXCIgaGFuZGxlciB3aGVuIHJlcG9zaXRvcnkgZG9lc250IGV4aXN0Jyh0ZXN0OiBUZXN0KSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHByb3h5cXVpcmUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ2xpYicsICdhZG9wdC1yZXBvc2l0b3J5JywgJ2hhbmRsZXInKSwge1xuICAgICAgJ2F3cy1zZGsnOiB7ICdAbm9DYWxsVGhydSc6IHRydWUsIFwiRUNSXCI6IEVDUldpdGhSZXBvc2l0b3J5Tm90Rm91bmQgfVxuICAgIH0pO1xuXG4gICAgbGV0IG91dHB1dDtcbiAgICBhc3luYyBmdW5jdGlvbiByZXNwb25zZShyZXNwb25zZVN0YXR1czogc3RyaW5nLCByZWFzb246IHN0cmluZywgcGh5c0lkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgICAgb3V0cHV0ID0geyByZXNwb25zZVN0YXR1cywgcmVhc29uLCBwaHlzSWQsIGRhdGEgfTtcbiAgICB9XG5cbiAgICBhd2FpdCBoYW5kbGVyLmhhbmRsZXIoe1xuICAgICAgU3RhY2tJZDogJ1N0YWNrSWQnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlcG9zaXRvcnlOYW1lOiAnUmVwb3NpdG9yeU5hbWUnLFxuICAgICAgfSxcbiAgICAgIFJlcXVlc3RUeXBlOiAnRGVsZXRlJyxcbiAgICAgIFJlc3BvbnNlVVJMOiAnaHR0cHM6Ly9sb2NhbGhvc3QvdGVzdCdcbiAgICB9LCB7XG4gICAgICBsb2dTdHJlYW1OYW1lOiAneHl6JyxcbiAgICB9LCB1bmRlZmluZWQsIHJlc3BvbnNlKTtcblxuICAgIHRlc3QuZGVlcEVxdWFsKG91dHB1dCwge1xuICAgICAgcmVzcG9uc2VTdGF0dXM6ICdTVUNDRVNTJyxcbiAgICAgIHJlYXNvbjogJ09LJyxcbiAgICAgIHBoeXNJZDogJ1JlcG9zaXRvcnlOYW1lJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6ICdSZXBvc2l0b3J5TmFtZSdcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gIGFzeW5jICdleGVyY2lzZSBcImNyZWF0ZVwiIGhhbmRsZXIgd2hlbiByZXBvc2l0b3J5IGRvZXNudCBleGlzdCcodGVzdDogVGVzdCkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSBwcm94eXF1aXJlKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdsaWInLCAnYWRvcHQtcmVwb3NpdG9yeScsICdoYW5kbGVyJyksIHtcbiAgICAgICdhd3Mtc2RrJzogeyAnQG5vQ2FsbFRocnUnOiB0cnVlLCBcIkVDUlwiOiBFQ1JXaXRoUmVwb3NpdG9yeU5vdEZvdW5kIH1cbiAgICB9KTtcblxuICAgIGxldCBvdXRwdXQ7XG4gICAgYXN5bmMgZnVuY3Rpb24gcmVzcG9uc2UocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNJZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIG91dHB1dCA9IHsgcmVzcG9uc2VTdGF0dXMsIHJlYXNvbiwgcGh5c0lkLCBkYXRhIH07XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5oYW5kbGVyKHtcbiAgICAgIFN0YWNrSWQ6ICdTdGFja0lkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBSZXBvc2l0b3J5TmFtZTogJ1JlcG9zaXRvcnlOYW1lJyxcbiAgICAgIH0sXG4gICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICBSZXNwb25zZVVSTDogJ2h0dHBzOi8vbG9jYWxob3N0L3Rlc3QnXG4gICAgfSwge1xuICAgICAgbG9nU3RyZWFtTmFtZTogJ3h5eicsXG4gICAgfSwgdW5kZWZpbmVkLCByZXNwb25zZSk7XG5cbiAgICB0ZXN0LmRlZXBFcXVhbChvdXRwdXQsIHtcbiAgICAgIHJlc3BvbnNlU3RhdHVzOiAnRkFJTEVEJyxcbiAgICAgIHJlYXNvbjogJ1NpbXVsYXRlZCBSZXBvc2l0b3J5UG9saWN5Tm90Rm91bmRFeGNlcHRpb24nLFxuICAgICAgcGh5c0lkOiAneHl6JyxcbiAgICAgIGRhdGE6IHsgfVxuICAgIH0pO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBFQ1JXaXRoRW1wdHlQb2xpY3koKSB7XG4gIGVjck1vY2sgPSBuZXcgRUNSKHsgYXNkZjogJ2FzZGYnIH0pO1xuICByZXR1cm4gZWNyTW9jaztcbn1cblxuZnVuY3Rpb24gRUNSV2l0aE93bmluZ1BvbGljeSgpIHtcbiAgcmV0dXJuIG5ldyBFQ1Ioe1xuICAgIFN0YXRlbWVudDogW1xuICAgICAge1xuICAgICAgICBTaWQ6ICdTdGFja0lkJyxcbiAgICAgICAgRWZmZWN0OiBcIkRlbnlcIixcbiAgICAgICAgQWN0aW9uOiBcIk93bmVkQnk6Q0RLU3RhY2tcIixcbiAgICAgICAgUHJpbmNpcGFsOiBcIipcIlxuICAgICAgfVxuICAgIF1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIEVDUldpdGhSZXBvc2l0b3J5Tm90Rm91bmQoKSB7XG4gIGNvbnN0IGVjciA9IG5ldyBFQ1Ioe30pO1xuICBlY3Iuc2hvdWxkVGhyb3dOb3RGb3VuZCA9IHRydWU7XG4gIHJldHVybiBlY3I7XG59XG5cbmNsYXNzIEVDUiB7XG4gIHB1YmxpYyBsYXN0U2V0UmVwb3NpdG9yeVBvbGljeVJlcXVlc3Q6IGFueTtcbiAgcHVibGljIHNob3VsZFRocm93Tm90Rm91bmQgPSBmYWxzZTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBwb2xpY3k6IGFueSkge1xuICB9XG5cbiAgcHVibGljIGdldFJlcG9zaXRvcnlQb2xpY3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW5jIHByb21pc2UoKSB7XG4gICAgICAgIGlmIChzZWxmLnNob3VsZFRocm93Tm90Rm91bmQpIHsgcmV0dXJuIHNlbGYudGhyb3dOb3RGb3VuZCgpOyB9XG4gICAgICAgIHJldHVybiB7IHBvbGljeVRleHQ6IEpTT04uc3RyaW5naWZ5KHNlbGYucG9saWN5KSB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc2V0UmVwb3NpdG9yeVBvbGljeShyZXE6IGFueSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubGFzdFNldFJlcG9zaXRvcnlQb2xpY3lSZXF1ZXN0ID0gcmVxO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW5jIHByb21pc2UoKSB7XG4gICAgICAgIGlmIChzZWxmLnNob3VsZFRocm93Tm90Rm91bmQpIHsgcmV0dXJuIHNlbGYudGhyb3dOb3RGb3VuZCgpOyB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGxpc3RJbWFnZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW5jIHByb21pc2UoKSB7XG4gICAgICAgIHJldHVybiB7IGltYWdlSWRzOiBbXSB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYmF0Y2hEZWxldGVJbWFnZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4ge1xuICAgICAgYXN5bmMgcHJvbWlzZSgpIHtcbiAgICAgICAgaWYgKHNlbGYuc2hvdWxkVGhyb3dOb3RGb3VuZCkgeyByZXR1cm4gc2VsZi50aHJvd05vdEZvdW5kKCk7IH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZGVsZXRlUmVwb3NpdG9yeSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4ge1xuICAgICAgYXN5bmMgcHJvbWlzZSgpIHtcbiAgICAgICAgaWYgKHNlbGYuc2hvdWxkVGhyb3dOb3RGb3VuZCkgeyByZXR1cm4gc2VsZi50aHJvd05vdEZvdW5kKCk7IH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHRocm93Tm90Rm91bmQoKSB7XG4gICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdTaW11bGF0ZWQgUmVwb3NpdG9yeVBvbGljeU5vdEZvdW5kRXhjZXB0aW9uJyk7XG4gICAgKGVyciBhcyBhbnkpLmNvZGUgPSAnUmVwb3NpdG9yeVBvbGljeU5vdEZvdW5kRXhjZXB0aW9uJztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn1cbiJdfQ==