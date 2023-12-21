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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhcmdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEscUNBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUV4QixNQUFhLDZCQUE4QixTQUFRLHdCQUFlO0lBQ3RELEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFakgsTUFBTSxvQkFBb0IsR0FBeUM7WUFDakUsa0JBQWtCO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNO1NBQ3hDLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sNEJBQTRCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFO1lBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUVELE9BQU87WUFDTCxrQkFBa0IsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsa0JBQWtCO1lBQ2xGLElBQUksRUFBRTtnQkFDSixpQkFBaUIsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsaUJBQWlCO2FBQ2pGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFUyxLQUFLLENBQUMsUUFBUTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENB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QkFBMkIsQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7Z0JBQ3BFLElBQUksQ0FBQyxHQUFHLENBQUMsZ0dBQWdHLENBQUMsQ0FBQztnQkFDM0csT0FBTyxXQUFXLENBQUM7YUFDcEI7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sMkJBQTJCLENBQUM7U0FDbkM7SUFDSCxDQUFDO0NBQ0Y7QUFqSEQsc0VBaUhDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgRUtTIGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1la3MnO1xuaW1wb3J0IHsgUmVzb3VyY2VIYW5kbGVyIH0gZnJvbSAnLi9jb21tb24nO1xuXG5jb25zdCBNQVhfTkFNRV9MRU4gPSA2MztcblxuZXhwb3J0IGNsYXNzIEZhcmdhdGVQcm9maWxlUmVzb3VyY2VIYW5kbGVyIGV4dGVuZHMgUmVzb3VyY2VIYW5kbGVyIHtcbiAgcHJvdGVjdGVkIGFzeW5jIG9uQ3JlYXRlKCkge1xuICAgIGNvbnN0IGZhcmdhdGVQcm9maWxlTmFtZSA9IHRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZy5mYXJnYXRlUHJvZmlsZU5hbWUgPz8gdGhpcy5nZW5lcmF0ZVByb2ZpbGVOYW1lKCk7XG5cbiAgICBjb25zdCBjcmVhdGVGYXJnYXRlUHJvZmlsZTogRUtTLkNyZWF0ZUZhcmdhdGVQcm9maWxlQ29tbWFuZElucHV0ID0ge1xuICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lLFxuICAgICAgLi4udGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLFxuICAgIH07XG5cbiAgICB0aGlzLmxvZyh7IGNyZWF0ZUZhcmdhdGVQcm9maWxlIH0pO1xuICAgIGNvbnN0IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5jcmVhdGVGYXJnYXRlUHJvZmlsZShjcmVhdGVGYXJnYXRlUHJvZmlsZSk7XG4gICAgdGhpcy5sb2coeyBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlIH0pO1xuXG4gICAgaWYgKCFjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgQ3JlYXRlRmFyZ2F0ZVByb2ZpbGUgcmVzcG9uc2UnKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlLmZhcmdhdGVQcm9maWxlTmFtZSxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgZmFyZ2F0ZVByb2ZpbGVBcm46IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGUuZmFyZ2F0ZVByb2ZpbGVBcm4sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25EZWxldGUoKSB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVsZXRlIGEgcHJvZmlsZSB3aXRob3V0IGEgcGh5c2ljYWwgaWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWxldGVGYXJnYXRlUHJvZmlsZTogRUtTLkRlbGV0ZUZhcmdhdGVQcm9maWxlQ29tbWFuZElucHV0ID0ge1xuICAgICAgY2x1c3Rlck5hbWU6IHRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZy5jbHVzdGVyTmFtZSxcbiAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogdGhpcy5waHlzaWNhbFJlc291cmNlSWQsXG4gICAgfTtcblxuICAgIHRoaXMubG9nKHsgZGVsZXRlRmFyZ2F0ZVByb2ZpbGUgfSk7XG4gICAgY29uc3QgZGVsZXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmRlbGV0ZUZhcmdhdGVQcm9maWxlKGRlbGV0ZUZhcmdhdGVQcm9maWxlKTtcbiAgICB0aGlzLmxvZyh7IGRlbGV0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25VcGRhdGUoKSB7XG4gICAgLy8gYWxsIHVwZGF0ZXMgcmVxdWlyZSBhIHJlcGxhY2VtZW50LiBhcyBsb25nIGFzIG5hbWUgaXMgZ2VuZXJhdGVkLCB3ZSBhcmVcbiAgICAvLyBnb29kLiBpZiBuYW1lIGlzIGV4cGxpY2l0LCB1cGRhdGUgd2lsbCBmYWlsLCB3aGljaCBpcyBjb21tb24gd2hlbiB0cnlpbmdcbiAgICAvLyB0byByZXBsYWNlIGNmbiByZXNvdXJjZXMgd2l0aCBleHBsaWNpdCBwaHlzaWNhbCBuYW1lc1xuICAgIHJldHVybiB0aGlzLm9uQ3JlYXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNDcmVhdGVDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1VwZGF0ZUNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNVcGRhdGVDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLnF1ZXJ5U3RhdHVzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIElzQ29tcGxldGU6IHN0YXR1cyA9PT0gJ0FDVElWRScsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0RlbGV0ZUNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMucXVlcnlTdGF0dXMoKTtcbiAgICByZXR1cm4ge1xuICAgICAgSXNDb21wbGV0ZTogc3RhdHVzID09PSAnTk9UX0ZPVU5EJyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIGZhcmdhdGUgcHJvZmlsZSBuYW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBnZW5lcmF0ZVByb2ZpbGVOYW1lKCkge1xuICAgIGNvbnN0IHN1ZmZpeCA9IHRoaXMucmVxdWVzdElkLnJlcGxhY2UoLy0vZywgJycpOyAvLyAzMiBjaGFyc1xuICAgIGNvbnN0IG9mZnNldCA9IE1BWF9OQU1FX0xFTiAtIHN1ZmZpeC5sZW5ndGggLSAxO1xuICAgIGNvbnN0IHByZWZpeCA9IHRoaXMubG9naWNhbFJlc291cmNlSWQuc2xpY2UoMCwgb2Zmc2V0ID4gMCA/IG9mZnNldCA6IDApO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7c3VmZml4fWA7XG4gIH1cblxuICAvKipcbiAgICogUXVlcmllcyB0aGUgRmFyZ2F0ZSBwcm9maWxlJ3MgY3VycmVudCBzdGF0dXMgYW5kIHJldHVybnMgdGhlIHN0YXR1cyBvclxuICAgKiBOT1RfRk9VTkQgaWYgdGhlIHByb2ZpbGUgZG9lc24ndCBleGlzdCAoaS5lLiBpdCBoYXMgYmVlbiBkZWxldGVkKS5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgcXVlcnlTdGF0dXMoKTogUHJvbWlzZTxFS1MuRmFyZ2F0ZVByb2ZpbGVTdGF0dXMgfCAnTk9UX0ZPVU5EJyB8IHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICghdGhpcy5waHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGRldGVybWluZSBzdGF0dXMgZm9yIGZhcmdhdGUgcHJvZmlsZSB3aXRob3V0IGEgcmVzb3VyY2UgbmFtZScpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGU6IEVLUy5EZXNjcmliZUZhcmdhdGVQcm9maWxlQ29tbWFuZElucHV0ID0ge1xuICAgICAgY2x1c3Rlck5hbWU6IHRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZy5jbHVzdGVyTmFtZSxcbiAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogdGhpcy5waHlzaWNhbFJlc291cmNlSWQsXG4gICAgfTtcblxuICAgIHRyeSB7XG5cbiAgICAgIHRoaXMubG9nKHsgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSB9KTtcbiAgICAgIGNvbnN0IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUoZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSk7XG4gICAgICB0aGlzLmxvZyh7IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSB9KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZT8uc3RhdHVzO1xuXG4gICAgICBpZiAoc3RhdHVzID09PSAnQ1JFQVRFX0ZBSUxFRCcgfHwgc3RhdHVzID09PSAnREVMRVRFX0ZBSUxFRCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSBjYXRjaCAoZGVzY3JpYmVGYXJnYXRlUHJvZmlsZUVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3IubmFtZSA9PT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIHRoaXMubG9nKCdyZWNlaXZlZCBSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uLCB0aGlzIG1lYW5zIHRoZSBwcm9maWxlIGhhcyBiZWVuIGRlbGV0ZWQgKG9yIG5ldmVyIGV4aXN0ZWQpJyk7XG4gICAgICAgIHJldHVybiAnTk9UX0ZPVU5EJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2coeyBkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3IgfSk7XG4gICAgICB0aHJvdyBkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3I7XG4gICAgfVxuICB9XG59XG4iXX0=