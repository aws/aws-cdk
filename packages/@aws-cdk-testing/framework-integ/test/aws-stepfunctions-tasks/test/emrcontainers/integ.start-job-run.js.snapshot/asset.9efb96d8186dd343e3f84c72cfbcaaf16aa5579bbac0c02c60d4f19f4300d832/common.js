"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceHandler = void 0;
class ResourceHandler {
    constructor(eks, event) {
        this.eks = eks;
        this.requestType = event.RequestType;
        this.requestId = event.RequestId;
        this.logicalResourceId = event.LogicalResourceId;
        this.physicalResourceId = event.PhysicalResourceId;
        this.event = event;
        const roleToAssume = event.ResourceProperties.AssumeRoleArn;
        if (!roleToAssume) {
            throw new Error('AssumeRoleArn must be provided');
        }
        eks.configureAssumeRole({
            RoleArn: roleToAssume,
            RoleSessionName: `AWSCDK.EKSCluster.${this.requestType}.${this.requestId}`,
        });
    }
    onEvent() {
        switch (this.requestType) {
            case 'Create': return this.onCreate();
            case 'Update': return this.onUpdate();
            case 'Delete': return this.onDelete();
        }
        throw new Error(`Invalid request type ${this.requestType}`);
    }
    isComplete() {
        switch (this.requestType) {
            case 'Create': return this.isCreateComplete();
            case 'Update': return this.isUpdateComplete();
            case 'Delete': return this.isDeleteComplete();
        }
        throw new Error(`Invalid request type ${this.requestType}`);
    }
    log(x) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(x, undefined, 2));
    }
}
exports.ResourceHandler = ResourceHandler;
