"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FargateProfileResourceHandler = void 0;
const common_1 = require("./common");
const MAX_NAME_LEN = 63;
class FargateProfileResourceHandler extends common_1.ResourceHandler {
    async onCreate() {
        const fargateProfileName = this.event.ResourceProperties.Config.fargateProfileName ?? this.generateProfileName();
        const createFargateProfile = {
            fargateProfileName,
            ...this.event.ResourceProperties.Config,
        };
        this.log({ createFargateProfile });
        const createFargateProfileResponse = await this.eks.createFargateProfile(createFargateProfile);
        this.log({ createFargateProfileResponse });
        if (!createFargateProfileResponse.fargateProfile) {
            throw new Error('invalid CreateFargateProfile response');
        }
        return {
            PhysicalResourceId: createFargateProfileResponse.fargateProfile.fargateProfileName,
            Data: {
                fargateProfileArn: createFargateProfileResponse.fargateProfile.fargateProfileArn,
            },
        };
    }
    async onDelete() {
        if (!this.physicalResourceId) {
            throw new Error('Cannot delete a profile without a physical id');
        }
        const deleteFargateProfile = {
            clusterName: this.event.ResourceProperties.Config.clusterName,
            fargateProfileName: this.physicalResourceId,
        };
        this.log({ deleteFargateProfile });
        const deleteFargateProfileResponse = await this.eks.deleteFargateProfile(deleteFargateProfile);
        this.log({ deleteFargateProfileResponse });
        return;
    }
    async onUpdate() {
        // all updates require a replacement. as long as name is generated, we are
        // good. if name is explicit, update will fail, which is common when trying
        // to replace cfn resources with explicit physical names
        return this.onCreate();
    }
    async isCreateComplete() {
        return this.isUpdateComplete();
    }
    async isUpdateComplete() {
        const status = await this.queryStatus();
        return {
            IsComplete: status === 'ACTIVE',
        };
    }
    async isDeleteComplete() {
        const status = await this.queryStatus();
        return {
            IsComplete: status === 'NOT_FOUND',
        };
    }
    /**
     * Generates a fargate profile name.
     */
    generateProfileName() {
        const suffix = this.requestId.replace(/-/g, ''); // 32 chars
        const offset = MAX_NAME_LEN - suffix.length - 1;
        const prefix = this.logicalResourceId.slice(0, offset > 0 ? offset : 0);
        return `${prefix}-${suffix}`;
    }
    /**
     * Queries the Fargate profile's current status and returns the status or
     * NOT_FOUND if the profile doesn't exist (i.e. it has been deleted).
     */
    async queryStatus() {
        if (!this.physicalResourceId) {
            throw new Error('Unable to determine status for fargate profile without a resource name');
        }
        const describeFargateProfile = {
            clusterName: this.event.ResourceProperties.Config.clusterName,
            fargateProfileName: this.physicalResourceId,
        };
        try {
            this.log({ describeFargateProfile });
            const describeFargateProfileResponse = await this.eks.describeFargateProfile(describeFargateProfile);
            this.log({ describeFargateProfileResponse });
            const status = describeFargateProfileResponse.fargateProfile?.status;
            if (status === 'CREATE_FAILED' || status === 'DELETE_FAILED') {
                throw new Error(status);
            }
            return status;
        }
        catch (describeFargateProfileError) {
            if (describeFargateProfileError.name === 'ResourceNotFoundException') {
                this.log('received ResourceNotFoundException, this means the profile has been deleted (or never existed)');
                return 'NOT_FOUND';
            }
            this.log({ describeFargateProfileError });
            throw describeFargateProfileError;
        }
    }
}
exports.FargateProfileResourceHandler = FargateProfileResourceHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhcmdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEscUNBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUV4QixNQUFhLDZCQUE4QixTQUFRLHdCQUFlO0lBQ3RELEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFakgsTUFBTSxvQkFBb0IsR0FBeUM7WUFDakUsa0JBQWtCO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNO1NBQ3hDLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sNEJBQTRCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFO1lBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUVELE9BQU87WUFDTCxrQkFBa0IsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsa0JBQWtCO1lBQ2xGLElBQUksRUFBRTtnQkFDSixpQkFBaUIsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsaUJBQWlCO2FBQ2pGO1NBQ0YsQ0FBQztLQUNIO0lBRVMsS0FBSyxDQUFDLFFBQVE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENB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QUNwRSxJQUFJLENBQUMsR0FBRyxDQUFDLGdHQUFnRyxDQUFDLENBQUM7Z0JBQzNHLE9BQU8sV0FBVyxDQUFDO2FBQ3BCO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDJCQUEyQixFQUFFLENBQUMsQ0FBQztZQUMxQyxNQUFNLDJCQUEyQixDQUFDO1NBQ25DO0tBQ0Y7Q0FDRjtBQWpIRCxzRUFpSEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBFS1MgZnJvbSAnQGF3cy1zZGsvY2xpZW50LWVrcyc7XG5pbXBvcnQgeyBSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbic7XG5cbmNvbnN0IE1BWF9OQU1FX0xFTiA9IDYzO1xuXG5leHBvcnQgY2xhc3MgRmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUhhbmRsZXIgZXh0ZW5kcyBSZXNvdXJjZUhhbmRsZXIge1xuICBwcm90ZWN0ZWQgYXN5bmMgb25DcmVhdGUoKSB7XG4gICAgY29uc3QgZmFyZ2F0ZVByb2ZpbGVOYW1lID0gdGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLmZhcmdhdGVQcm9maWxlTmFtZSA/PyB0aGlzLmdlbmVyYXRlUHJvZmlsZU5hbWUoKTtcblxuICAgIGNvbnN0IGNyZWF0ZUZhcmdhdGVQcm9maWxlOiBFS1MuQ3JlYXRlRmFyZ2F0ZVByb2ZpbGVDb21tYW5kSW5wdXQgPSB7XG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWUsXG4gICAgICAuLi50aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcsXG4gICAgfTtcblxuICAgIHRoaXMubG9nKHsgY3JlYXRlRmFyZ2F0ZVByb2ZpbGUgfSk7XG4gICAgY29uc3QgY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmNyZWF0ZUZhcmdhdGVQcm9maWxlKGNyZWF0ZUZhcmdhdGVQcm9maWxlKTtcbiAgICB0aGlzLmxvZyh7IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgfSk7XG5cbiAgICBpZiAoIWNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBDcmVhdGVGYXJnYXRlUHJvZmlsZSByZXNwb25zZScpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGUuZmFyZ2F0ZVByb2ZpbGVOYW1lLFxuICAgICAgRGF0YToge1xuICAgICAgICBmYXJnYXRlUHJvZmlsZUFybjogY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZS5mYXJnYXRlUHJvZmlsZUFybixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBvbkRlbGV0ZSgpIHtcbiAgICBpZiAoIXRoaXMucGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWxldGUgYSBwcm9maWxlIHdpdGhvdXQgYSBwaHlzaWNhbCBpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbGV0ZUZhcmdhdGVQcm9maWxlOiBFS1MuRGVsZXRlRmFyZ2F0ZVByb2ZpbGVDb21tYW5kSW5wdXQgPSB7XG4gICAgICBjbHVzdGVyTmFtZTogdGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLmNsdXN0ZXJOYW1lLFxuICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiB0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICB9O1xuXG4gICAgdGhpcy5sb2coeyBkZWxldGVGYXJnYXRlUHJvZmlsZSB9KTtcbiAgICBjb25zdCBkZWxldGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuZGVsZXRlRmFyZ2F0ZVByb2ZpbGUoZGVsZXRlRmFyZ2F0ZVByb2ZpbGUpO1xuICAgIHRoaXMubG9nKHsgZGVsZXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSB9KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBvblVwZGF0ZSgpIHtcbiAgICAvLyBhbGwgdXBkYXRlcyByZXF1aXJlIGEgcmVwbGFjZW1lbnQuIGFzIGxvbmcgYXMgbmFtZSBpcyBnZW5lcmF0ZWQsIHdlIGFyZVxuICAgIC8vIGdvb2QuIGlmIG5hbWUgaXMgZXhwbGljaXQsIHVwZGF0ZSB3aWxsIGZhaWwsIHdoaWNoIGlzIGNvbW1vbiB3aGVuIHRyeWluZ1xuICAgIC8vIHRvIHJlcGxhY2UgY2ZuIHJlc291cmNlcyB3aXRoIGV4cGxpY2l0IHBoeXNpY2FsIG5hbWVzXG4gICAgcmV0dXJuIHRoaXMub25DcmVhdGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0NyZWF0ZUNvbXBsZXRlKCkge1xuICAgIHJldHVybiB0aGlzLmlzVXBkYXRlQ29tcGxldGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc1VwZGF0ZUNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMucXVlcnlTdGF0dXMoKTtcbiAgICByZXR1cm4ge1xuICAgICAgSXNDb21wbGV0ZTogc3RhdHVzID09PSAnQUNUSVZFJyxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzRGVsZXRlQ29tcGxldGUoKSB7XG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5xdWVyeVN0YXR1cygpO1xuICAgIHJldHVybiB7XG4gICAgICBJc0NvbXBsZXRlOiBzdGF0dXMgPT09ICdOT1RfRk9VTkQnLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgZmFyZ2F0ZSBwcm9maWxlIG5hbWUuXG4gICAqL1xuICBwcml2YXRlIGdlbmVyYXRlUHJvZmlsZU5hbWUoKSB7XG4gICAgY29uc3Qgc3VmZml4ID0gdGhpcy5yZXF1ZXN0SWQucmVwbGFjZSgvLS9nLCAnJyk7IC8vIDMyIGNoYXJzXG4gICAgY29uc3Qgb2Zmc2V0ID0gTUFYX05BTUVfTEVOIC0gc3VmZml4Lmxlbmd0aCAtIDE7XG4gICAgY29uc3QgcHJlZml4ID0gdGhpcy5sb2dpY2FsUmVzb3VyY2VJZC5zbGljZSgwLCBvZmZzZXQgPiAwID8gb2Zmc2V0IDogMCk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtzdWZmaXh9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyaWVzIHRoZSBGYXJnYXRlIHByb2ZpbGUncyBjdXJyZW50IHN0YXR1cyBhbmQgcmV0dXJucyB0aGUgc3RhdHVzIG9yXG4gICAqIE5PVF9GT1VORCBpZiB0aGUgcHJvZmlsZSBkb2Vzbid0IGV4aXN0IChpLmUuIGl0IGhhcyBiZWVuIGRlbGV0ZWQpLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBxdWVyeVN0YXR1cygpOiBQcm9taXNlPEVLUy5GYXJnYXRlUHJvZmlsZVN0YXR1cyB8ICdOT1RfRk9VTkQnIHwgc3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZGV0ZXJtaW5lIHN0YXR1cyBmb3IgZmFyZ2F0ZSBwcm9maWxlIHdpdGhvdXQgYSByZXNvdXJjZSBuYW1lJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZTogRUtTLkRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVDb21tYW5kSW5wdXQgPSB7XG4gICAgICBjbHVzdGVyTmFtZTogdGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLmNsdXN0ZXJOYW1lLFxuICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiB0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICB9O1xuXG4gICAgdHJ5IHtcblxuICAgICAgdGhpcy5sb2coeyBkZXNjcmliZUZhcmdhdGVQcm9maWxlIH0pO1xuICAgICAgY29uc3QgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVGYXJnYXRlUHJvZmlsZShkZXNjcmliZUZhcmdhdGVQcm9maWxlKTtcbiAgICAgIHRoaXMubG9nKHsgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlIH0pO1xuICAgICAgY29uc3Qgc3RhdHVzID0gZGVzY3JpYmVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlPy5zdGF0dXM7XG5cbiAgICAgIGlmIChzdGF0dXMgPT09ICdDUkVBVEVfRkFJTEVEJyB8fCBzdGF0dXMgPT09ICdERUxFVEVfRkFJTEVEJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9IGNhdGNoIChkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3I6IGFueSkge1xuICAgICAgaWYgKGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvci5uYW1lID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgdGhpcy5sb2coJ3JlY2VpdmVkIFJlc291cmNlTm90Rm91bmRFeGNlcHRpb24sIHRoaXMgbWVhbnMgdGhlIHByb2ZpbGUgaGFzIGJlZW4gZGVsZXRlZCAob3IgbmV2ZXIgZXhpc3RlZCknKTtcbiAgICAgICAgcmV0dXJuICdOT1RfRk9VTkQnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZyh7IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvciB9KTtcbiAgICAgIHRocm93IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvcjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==