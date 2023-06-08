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
            if (describeFargateProfileError.code === 'ResourceNotFoundException') {
                this.log('received ResourceNotFoundException, this means the profile has been deleted (or never existed)');
                return 'NOT_FOUND';
            }
            this.log({ describeFargateProfileError });
            throw describeFargateProfileError;
        }
    }
}
exports.FargateProfileResourceHandler = FargateProfileResourceHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhcmdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUV4QixNQUFhLDZCQUE4QixTQUFRLHdCQUFlO0lBQ3RELEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFakgsTUFBTSxvQkFBb0IsR0FBd0M7WUFDaEUsa0JBQWtCO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNO1NBQ3hDLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sNEJBQTRCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFO1lBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUVELE9BQU87WUFDTCxrQkFBa0IsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsa0JBQWtCO1lBQ2xGLElBQUksRUFBRTtnQkFDSixpQkFBaUIsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsaUJBQWlCO2FBQ2pGO1NBQ0YsQ0FBQztLQUNIO0lBRVMsS0FBSyxDQUFDLFFBQVE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENB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QUNwRSxJQUFJLENBQUMsR0FBRyxDQUFDLGdHQUFnRyxDQUFDLENBQUM7Z0JBQzNHLE9BQU8sV0FBVyxDQUFDO2FBQ3BCO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDJCQUEyQixFQUFFLENBQUMsQ0FBQztZQUMxQyxNQUFNLDJCQUEyQixDQUFDO1NBQ25DO0tBQ0Y7Q0FDRjtBQWpIRCxzRUFpSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhd3MgZnJvbSAnYXdzLXNkayc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbic7XG5cbmNvbnN0IE1BWF9OQU1FX0xFTiA9IDYzO1xuXG5leHBvcnQgY2xhc3MgRmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUhhbmRsZXIgZXh0ZW5kcyBSZXNvdXJjZUhhbmRsZXIge1xuICBwcm90ZWN0ZWQgYXN5bmMgb25DcmVhdGUoKSB7XG4gICAgY29uc3QgZmFyZ2F0ZVByb2ZpbGVOYW1lID0gdGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ29uZmlnLmZhcmdhdGVQcm9maWxlTmFtZSA/PyB0aGlzLmdlbmVyYXRlUHJvZmlsZU5hbWUoKTtcblxuICAgIGNvbnN0IGNyZWF0ZUZhcmdhdGVQcm9maWxlOiBhd3MuRUtTLkNyZWF0ZUZhcmdhdGVQcm9maWxlUmVxdWVzdCA9IHtcbiAgICAgIGZhcmdhdGVQcm9maWxlTmFtZSxcbiAgICAgIC4uLnRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZyxcbiAgICB9O1xuXG4gICAgdGhpcy5sb2coeyBjcmVhdGVGYXJnYXRlUHJvZmlsZSB9KTtcbiAgICBjb25zdCBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuY3JlYXRlRmFyZ2F0ZVByb2ZpbGUoY3JlYXRlRmFyZ2F0ZVByb2ZpbGUpO1xuICAgIHRoaXMubG9nKHsgY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSB9KTtcblxuICAgIGlmICghY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIENyZWF0ZUZhcmdhdGVQcm9maWxlIHJlc3BvbnNlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZS5mYXJnYXRlUHJvZmlsZU5hbWUsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIGZhcmdhdGVQcm9maWxlQXJuOiBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlLmZhcmdhdGVQcm9maWxlQXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uRGVsZXRlKCkge1xuICAgIGlmICghdGhpcy5waHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGRlbGV0ZSBhIHByb2ZpbGUgd2l0aG91dCBhIHBoeXNpY2FsIGlkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVsZXRlRmFyZ2F0ZVByb2ZpbGU6IGF3cy5FS1MuRGVsZXRlRmFyZ2F0ZVByb2ZpbGVSZXF1ZXN0ID0ge1xuICAgICAgY2x1c3Rlck5hbWU6IHRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZy5jbHVzdGVyTmFtZSxcbiAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogdGhpcy5waHlzaWNhbFJlc291cmNlSWQsXG4gICAgfTtcblxuICAgIHRoaXMubG9nKHsgZGVsZXRlRmFyZ2F0ZVByb2ZpbGUgfSk7XG4gICAgY29uc3QgZGVsZXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmRlbGV0ZUZhcmdhdGVQcm9maWxlKGRlbGV0ZUZhcmdhdGVQcm9maWxlKTtcbiAgICB0aGlzLmxvZyh7IGRlbGV0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25VcGRhdGUoKSB7XG4gICAgLy8gYWxsIHVwZGF0ZXMgcmVxdWlyZSBhIHJlcGxhY2VtZW50LiBhcyBsb25nIGFzIG5hbWUgaXMgZ2VuZXJhdGVkLCB3ZSBhcmVcbiAgICAvLyBnb29kLiBpZiBuYW1lIGlzIGV4cGxpY2l0LCB1cGRhdGUgd2lsbCBmYWlsLCB3aGljaCBpcyBjb21tb24gd2hlbiB0cnlpbmdcbiAgICAvLyB0byByZXBsYWNlIGNmbiByZXNvdXJjZXMgd2l0aCBleHBsaWNpdCBwaHlzaWNhbCBuYW1lc1xuICAgIHJldHVybiB0aGlzLm9uQ3JlYXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNDcmVhdGVDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1VwZGF0ZUNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNVcGRhdGVDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLnF1ZXJ5U3RhdHVzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIElzQ29tcGxldGU6IHN0YXR1cyA9PT0gJ0FDVElWRScsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0RlbGV0ZUNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMucXVlcnlTdGF0dXMoKTtcbiAgICByZXR1cm4ge1xuICAgICAgSXNDb21wbGV0ZTogc3RhdHVzID09PSAnTk9UX0ZPVU5EJyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIGZhcmdhdGUgcHJvZmlsZSBuYW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBnZW5lcmF0ZVByb2ZpbGVOYW1lKCkge1xuICAgIGNvbnN0IHN1ZmZpeCA9IHRoaXMucmVxdWVzdElkLnJlcGxhY2UoLy0vZywgJycpOyAvLyAzMiBjaGFyc1xuICAgIGNvbnN0IG9mZnNldCA9IE1BWF9OQU1FX0xFTiAtIHN1ZmZpeC5sZW5ndGggLSAxO1xuICAgIGNvbnN0IHByZWZpeCA9IHRoaXMubG9naWNhbFJlc291cmNlSWQuc2xpY2UoMCwgb2Zmc2V0ID4gMCA/IG9mZnNldCA6IDApO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7c3VmZml4fWA7XG4gIH1cblxuICAvKipcbiAgICogUXVlcmllcyB0aGUgRmFyZ2F0ZSBwcm9maWxlJ3MgY3VycmVudCBzdGF0dXMgYW5kIHJldHVybnMgdGhlIHN0YXR1cyBvclxuICAgKiBOT1RfRk9VTkQgaWYgdGhlIHByb2ZpbGUgZG9lc24ndCBleGlzdCAoaS5lLiBpdCBoYXMgYmVlbiBkZWxldGVkKS5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgcXVlcnlTdGF0dXMoKTogUHJvbWlzZTxhd3MuRUtTLkZhcmdhdGVQcm9maWxlU3RhdHVzIHwgJ05PVF9GT1VORCcgfCB1bmRlZmluZWQ+IHtcbiAgICBpZiAoIXRoaXMucGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBkZXRlcm1pbmUgc3RhdHVzIGZvciBmYXJnYXRlIHByb2ZpbGUgd2l0aG91dCBhIHJlc291cmNlIG5hbWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZXNjcmliZUZhcmdhdGVQcm9maWxlOiBhd3MuRUtTLkRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXF1ZXN0ID0ge1xuICAgICAgY2x1c3Rlck5hbWU6IHRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZy5jbHVzdGVyTmFtZSxcbiAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogdGhpcy5waHlzaWNhbFJlc291cmNlSWQsXG4gICAgfTtcblxuICAgIHRyeSB7XG5cbiAgICAgIHRoaXMubG9nKHsgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSB9KTtcbiAgICAgIGNvbnN0IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUoZGVzY3JpYmVGYXJnYXRlUHJvZmlsZSk7XG4gICAgICB0aGlzLmxvZyh7IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSB9KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZT8uc3RhdHVzO1xuXG4gICAgICBpZiAoc3RhdHVzID09PSAnQ1JFQVRFX0ZBSUxFRCcgfHwgc3RhdHVzID09PSAnREVMRVRFX0ZBSUxFRCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSBjYXRjaCAoZGVzY3JpYmVGYXJnYXRlUHJvZmlsZUVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3IuY29kZSA9PT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIHRoaXMubG9nKCdyZWNlaXZlZCBSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uLCB0aGlzIG1lYW5zIHRoZSBwcm9maWxlIGhhcyBiZWVuIGRlbGV0ZWQgKG9yIG5ldmVyIGV4aXN0ZWQpJyk7XG4gICAgICAgIHJldHVybiAnTk9UX0ZPVU5EJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2coeyBkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3IgfSk7XG4gICAgICB0aHJvdyBkZXNjcmliZUZhcmdhdGVQcm9maWxlRXJyb3I7XG4gICAgfVxuICB9XG59XG4iXX0=