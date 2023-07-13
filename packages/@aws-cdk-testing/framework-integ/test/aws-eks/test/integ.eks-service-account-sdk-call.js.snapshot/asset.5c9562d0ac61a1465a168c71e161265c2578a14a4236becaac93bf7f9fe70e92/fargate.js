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
            if (describeFargateProfileError.$metadata.httpStatusCode === 404) {
                this.log('received 404, this means the profile has been deleted (or never existed)');
                return 'NOT_FOUND';
            }
            this.log({ describeFargateProfileError });
            throw describeFargateProfileError;
        }
    }
}
exports.FargateProfileResourceHandler = FargateProfileResourceHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhcmdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUV4QixNQUFhLDZCQUE4QixTQUFRLHdCQUFlO0lBQ3RELEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFakgsTUFBTSxvQkFBb0IsR0FBd0M7WUFDaEUsa0JBQWtCO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNO1NBQ3hDLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sNEJBQTRCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFO1lBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUVELE9BQU87WUFDTCxrQkFBa0IsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsa0JBQWtCO1lBQ2xGLElBQUksRUFBRTtnQkFDSixpQkFBaUIsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsaUJBQWlCO2FBQ2pGO1NBQ0YsQ0FBQztLQUNIO0lBRVMsS0FBSyxDQUFDLFFBQVE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENB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LEVBQUU7Z0JBQ2hFLElBQUksQ0FBQyxHQUFHLENBQUMsMEVBQTBFLENBQUMsQ0FBQztnQkFDckYsT0FBTyxXQUFXLENBQUM7YUFDcEI7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sMkJBQTJCLENBQUM7U0FDbkM7S0FDRjtDQUNGO0FBakhELHNFQWlIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF3cyBmcm9tICdhd3Mtc2RrJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IFJlc291cmNlSGFuZGxlciB9IGZyb20gJy4vY29tbW9uJztcblxuY29uc3QgTUFYX05BTUVfTEVOID0gNjM7XG5cbmV4cG9ydCBjbGFzcyBGYXJnYXRlUHJvZmlsZVJlc291cmNlSGFuZGxlciBleHRlbmRzIFJlc291cmNlSGFuZGxlciB7XG4gIHByb3RlY3RlZCBhc3luYyBvbkNyZWF0ZSgpIHtcbiAgICBjb25zdCBmYXJnYXRlUHJvZmlsZU5hbWUgPSB0aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcuZmFyZ2F0ZVByb2ZpbGVOYW1lID8/IHRoaXMuZ2VuZXJhdGVQcm9maWxlTmFtZSgpO1xuXG4gICAgY29uc3QgY3JlYXRlRmFyZ2F0ZVByb2ZpbGU6IGF3cy5FS1MuQ3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXF1ZXN0ID0ge1xuICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lLFxuICAgICAgLi4udGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLFxuICAgIH07XG5cbiAgICB0aGlzLmxvZyh7IGNyZWF0ZUZhcmdhdGVQcm9maWxlIH0pO1xuICAgIGNvbnN0IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5jcmVhdGVGYXJnYXRlUHJvZmlsZShjcmVhdGVGYXJnYXRlUHJvZmlsZSk7XG4gICAgdGhpcy5sb2coeyBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlIH0pO1xuXG4gICAgaWYgKCFjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgQ3JlYXRlRmFyZ2F0ZVByb2ZpbGUgcmVzcG9uc2UnKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlLmZhcmdhdGVQcm9maWxlTmFtZSxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgZmFyZ2F0ZVByb2ZpbGVBcm46IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGUuZmFyZ2F0ZVByb2ZpbGVBcm4sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25EZWxldGUoKSB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVsZXRlIGEgcHJvZmlsZSB3aXRob3V0IGEgcGh5c2ljYWwgaWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWxldGVGYXJnYXRlUHJvZmlsZTogYXdzLkVLUy5EZWxldGVGYXJnYXRlUHJvZmlsZVJlcXVlc3QgPSB7XG4gICAgICBjbHVzdGVyTmFtZTogdGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLmNsdXN0ZXJOYW1lLFxuICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiB0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICB9O1xuXG4gICAgdGhpcy5sb2coeyBkZWxldGVGYXJnYXRlUHJvZmlsZSB9KTtcbiAgICBjb25zdCBkZWxldGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuZGVsZXRlRmFyZ2F0ZVByb2ZpbGUoZGVsZXRlRmFyZ2F0ZVByb2ZpbGUpO1xuICAgIHRoaXMubG9nKHsgZGVsZXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSB9KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBvblVwZGF0ZSgpIHtcbiAgICAvLyBhbGwgdXBkYXRlcyByZXF1aXJlIGEgcmVwbGFjZW1lbnQuIGFzIGxvbmcgYXMgbmFtZSBpcyBnZW5lcmF0ZWQsIHdlIGFyZVxuICAgIC8vIGdvb2QuIGlmIG5hbWUgaXMgZXhwbGljaXQsIHVwZGF0ZSB3aWxsIGZhaWwsIHdoaWNoIGlzIGNvbW1vbiB3aGVuIHRyeWluZ1xuICAgIC8vIHRvIHJlcGxhY2UgY2ZuIHJlc291cmNlcyB3aXRoIGV4cGxpY2l0IHBoeXNpY2FsIG5hbWVzXG4gICAgcmV0dXJuIHRoaXMub25DcmVhdGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0NyZWF0ZUNvbXBsZXRlKCkge1xuICAgIHJldHVybiB0aGlzLmlzVXBkYXRlQ29tcGxldGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc1VwZGF0ZUNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMucXVlcnlTdGF0dXMoKTtcbiAgICByZXR1cm4ge1xuICAgICAgSXNDb21wbGV0ZTogc3RhdHVzID09PSAnQUNUSVZFJyxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzRGVsZXRlQ29tcGxldGUoKSB7XG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5xdWVyeVN0YXR1cygpO1xuICAgIHJldHVybiB7XG4gICAgICBJc0NvbXBsZXRlOiBzdGF0dXMgPT09ICdOT1RfRk9VTkQnLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgZmFyZ2F0ZSBwcm9maWxlIG5hbWUuXG4gICAqL1xuICBwcml2YXRlIGdlbmVyYXRlUHJvZmlsZU5hbWUoKSB7XG4gICAgY29uc3Qgc3VmZml4ID0gdGhpcy5yZXF1ZXN0SWQucmVwbGFjZSgvLS9nLCAnJyk7IC8vIDMyIGNoYXJzXG4gICAgY29uc3Qgb2Zmc2V0ID0gTUFYX05BTUVfTEVOIC0gc3VmZml4Lmxlbmd0aCAtIDE7XG4gICAgY29uc3QgcHJlZml4ID0gdGhpcy5sb2dpY2FsUmVzb3VyY2VJZC5zbGljZSgwLCBvZmZzZXQgPiAwID8gb2Zmc2V0IDogMCk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtzdWZmaXh9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyaWVzIHRoZSBGYXJnYXRlIHByb2ZpbGUncyBjdXJyZW50IHN0YXR1cyBhbmQgcmV0dXJucyB0aGUgc3RhdHVzIG9yXG4gICAqIE5PVF9GT1VORCBpZiB0aGUgcHJvZmlsZSBkb2Vzbid0IGV4aXN0IChpLmUuIGl0IGhhcyBiZWVuIGRlbGV0ZWQpLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBxdWVyeVN0YXR1cygpOiBQcm9taXNlPGF3cy5FS1MuRmFyZ2F0ZVByb2ZpbGVTdGF0dXMgfCAnTk9UX0ZPVU5EJyB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICghdGhpcy5waHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGRldGVybWluZSBzdGF0dXMgZm9yIGZhcmdhdGUgcHJvZmlsZSB3aXRob3V0IGEgcmVzb3VyY2UgbmFtZScpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGU6IGF3cy5FS1MuRGVzY3JpYmVGYXJnYXRlUHJvZmlsZVJlcXVlc3QgPSB7XG4gICAgICBjbHVzdGVyTmFtZTogdGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLmNsdXN0ZXJOYW1lLFxuICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiB0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICB9O1xuXG4gICAgdHJ5IHtcblxuICAgICAgdGhpcy5sb2coeyBkZXNjcmliZUZhcmdhdGVQcm9maWxlIH0pO1xuICAgICAgY29uc3QgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVGYXJnYXRlUHJvZmlsZShkZXNjcmliZUZhcmdhdGVQcm9maWxlKTtcbiAgICAgIHRoaXMubG9nKHsgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlIH0pO1xuICAgICAgY29uc3Qgc3RhdHVzID0gZGVzY3JpYmVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlPy5zdGF0dXM7XG5cbiAgICAgIGlmIChzdGF0dXMgPT09ICdDUkVBVEVfRkFJTEVEJyB8fCBzdGF0dXMgPT09ICdERUxFVEVfRkFJTEVEJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9IGNhdGNoIChkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3I6IGFueSkge1xuICAgICAgaWYgKGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvci4kbWV0YWRhdGEuaHR0cFN0YXR1c0NvZGUgPT09IDQwNCkge1xuICAgICAgICB0aGlzLmxvZygncmVjZWl2ZWQgNDA0LCB0aGlzIG1lYW5zIHRoZSBwcm9maWxlIGhhcyBiZWVuIGRlbGV0ZWQgKG9yIG5ldmVyIGV4aXN0ZWQpJyk7XG4gICAgICAgIHJldHVybiAnTk9UX0ZPVU5EJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2coeyBkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3IgfSk7XG4gICAgICB0aHJvdyBkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3I7XG4gICAgfVxuICB9XG59XG4iXX0=