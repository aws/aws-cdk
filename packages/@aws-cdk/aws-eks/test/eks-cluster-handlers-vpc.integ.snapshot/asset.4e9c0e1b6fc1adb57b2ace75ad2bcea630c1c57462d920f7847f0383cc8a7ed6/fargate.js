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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhcmdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUV4QixNQUFhLDZCQUE4QixTQUFRLHdCQUFlO0lBQ3RELEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFakgsTUFBTSxvQkFBb0IsR0FBd0M7WUFDaEUsa0JBQWtCO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNO1NBQ3hDLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sNEJBQTRCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFO1lBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUVELE9BQU87WUFDTCxrQkFBa0IsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsa0JBQWtCO1lBQ2xGLElBQUksRUFBRTtnQkFDSixpQkFBaUIsRUFBRSw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsaUJBQWlCO2FBQ2pGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFUyxLQUFLLENBQUMsUUFBUTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENB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QkFBMkIsQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7Z0JBQ3BFLElBQUksQ0FBQyxHQUFHLENBQUMsZ0dBQWdHLENBQUMsQ0FBQztnQkFDM0csT0FBTyxXQUFXLENBQUM7YUFDcEI7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sMkJBQTJCLENBQUM7U0FDbkM7SUFDSCxDQUFDO0NBQ0Y7QUFqSEQsc0VBaUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXdzIGZyb20gJ2F3cy1zZGsnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgUmVzb3VyY2VIYW5kbGVyIH0gZnJvbSAnLi9jb21tb24nO1xuXG5jb25zdCBNQVhfTkFNRV9MRU4gPSA2MztcblxuZXhwb3J0IGNsYXNzIEZhcmdhdGVQcm9maWxlUmVzb3VyY2VIYW5kbGVyIGV4dGVuZHMgUmVzb3VyY2VIYW5kbGVyIHtcbiAgcHJvdGVjdGVkIGFzeW5jIG9uQ3JlYXRlKCkge1xuICAgIGNvbnN0IGZhcmdhdGVQcm9maWxlTmFtZSA9IHRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZy5mYXJnYXRlUHJvZmlsZU5hbWUgPz8gdGhpcy5nZW5lcmF0ZVByb2ZpbGVOYW1lKCk7XG5cbiAgICBjb25zdCBjcmVhdGVGYXJnYXRlUHJvZmlsZTogYXdzLkVLUy5DcmVhdGVGYXJnYXRlUHJvZmlsZVJlcXVlc3QgPSB7XG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWUsXG4gICAgICAuLi50aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcsXG4gICAgfTtcblxuICAgIHRoaXMubG9nKHsgY3JlYXRlRmFyZ2F0ZVByb2ZpbGUgfSk7XG4gICAgY29uc3QgY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmNyZWF0ZUZhcmdhdGVQcm9maWxlKGNyZWF0ZUZhcmdhdGVQcm9maWxlKTtcbiAgICB0aGlzLmxvZyh7IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgfSk7XG5cbiAgICBpZiAoIWNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBDcmVhdGVGYXJnYXRlUHJvZmlsZSByZXNwb25zZScpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGNyZWF0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGUuZmFyZ2F0ZVByb2ZpbGVOYW1lLFxuICAgICAgRGF0YToge1xuICAgICAgICBmYXJnYXRlUHJvZmlsZUFybjogY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZS5mYXJnYXRlUHJvZmlsZUFybixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBvbkRlbGV0ZSgpIHtcbiAgICBpZiAoIXRoaXMucGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWxldGUgYSBwcm9maWxlIHdpdGhvdXQgYSBwaHlzaWNhbCBpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbGV0ZUZhcmdhdGVQcm9maWxlOiBhd3MuRUtTLkRlbGV0ZUZhcmdhdGVQcm9maWxlUmVxdWVzdCA9IHtcbiAgICAgIGNsdXN0ZXJOYW1lOiB0aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcuY2x1c3Rlck5hbWUsXG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6IHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgIH07XG5cbiAgICB0aGlzLmxvZyh7IGRlbGV0ZUZhcmdhdGVQcm9maWxlIH0pO1xuICAgIGNvbnN0IGRlbGV0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5kZWxldGVGYXJnYXRlUHJvZmlsZShkZWxldGVGYXJnYXRlUHJvZmlsZSk7XG4gICAgdGhpcy5sb2coeyBkZWxldGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uVXBkYXRlKCkge1xuICAgIC8vIGFsbCB1cGRhdGVzIHJlcXVpcmUgYSByZXBsYWNlbWVudC4gYXMgbG9uZyBhcyBuYW1lIGlzIGdlbmVyYXRlZCwgd2UgYXJlXG4gICAgLy8gZ29vZC4gaWYgbmFtZSBpcyBleHBsaWNpdCwgdXBkYXRlIHdpbGwgZmFpbCwgd2hpY2ggaXMgY29tbW9uIHdoZW4gdHJ5aW5nXG4gICAgLy8gdG8gcmVwbGFjZSBjZm4gcmVzb3VyY2VzIHdpdGggZXhwbGljaXQgcGh5c2ljYWwgbmFtZXNcbiAgICByZXR1cm4gdGhpcy5vbkNyZWF0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzQ3JlYXRlQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNVcGRhdGVDb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzVXBkYXRlQ29tcGxldGUoKSB7XG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5xdWVyeVN0YXR1cygpO1xuICAgIHJldHVybiB7XG4gICAgICBJc0NvbXBsZXRlOiBzdGF0dXMgPT09ICdBQ1RJVkUnLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNEZWxldGVDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLnF1ZXJ5U3RhdHVzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIElzQ29tcGxldGU6IHN0YXR1cyA9PT0gJ05PVF9GT1VORCcsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBmYXJnYXRlIHByb2ZpbGUgbmFtZS5cbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVQcm9maWxlTmFtZSgpIHtcbiAgICBjb25zdCBzdWZmaXggPSB0aGlzLnJlcXVlc3RJZC5yZXBsYWNlKC8tL2csICcnKTsgLy8gMzIgY2hhcnNcbiAgICBjb25zdCBvZmZzZXQgPSBNQVhfTkFNRV9MRU4gLSBzdWZmaXgubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBwcmVmaXggPSB0aGlzLmxvZ2ljYWxSZXNvdXJjZUlkLnNsaWNlKDAsIG9mZnNldCA+IDAgPyBvZmZzZXQgOiAwKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke3N1ZmZpeH1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFF1ZXJpZXMgdGhlIEZhcmdhdGUgcHJvZmlsZSdzIGN1cnJlbnQgc3RhdHVzIGFuZCByZXR1cm5zIHRoZSBzdGF0dXMgb3JcbiAgICogTk9UX0ZPVU5EIGlmIHRoZSBwcm9maWxlIGRvZXNuJ3QgZXhpc3QgKGkuZS4gaXQgaGFzIGJlZW4gZGVsZXRlZCkuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIHF1ZXJ5U3RhdHVzKCk6IFByb21pc2U8YXdzLkVLUy5GYXJnYXRlUHJvZmlsZVN0YXR1cyB8ICdOT1RfRk9VTkQnIHwgdW5kZWZpbmVkPiB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZGV0ZXJtaW5lIHN0YXR1cyBmb3IgZmFyZ2F0ZSBwcm9maWxlIHdpdGhvdXQgYSByZXNvdXJjZSBuYW1lJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZTogYXdzLkVLUy5EZXNjcmliZUZhcmdhdGVQcm9maWxlUmVxdWVzdCA9IHtcbiAgICAgIGNsdXN0ZXJOYW1lOiB0aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcuY2x1c3Rlck5hbWUsXG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6IHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgIH07XG5cbiAgICB0cnkge1xuXG4gICAgICB0aGlzLmxvZyh7IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUgfSk7XG4gICAgICBjb25zdCBkZXNjcmliZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUZhcmdhdGVQcm9maWxlKGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUpO1xuICAgICAgdGhpcy5sb2coeyBkZXNjcmliZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgfSk7XG4gICAgICBjb25zdCBzdGF0dXMgPSBkZXNjcmliZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGU/LnN0YXR1cztcblxuICAgICAgaWYgKHN0YXR1cyA9PT0gJ0NSRUFURV9GQUlMRUQnIHx8IHN0YXR1cyA9PT0gJ0RFTEVURV9GQUlMRUQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0gY2F0Y2ggKGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvcikge1xuICAgICAgaWYgKGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvci5jb2RlID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgdGhpcy5sb2coJ3JlY2VpdmVkIFJlc291cmNlTm90Rm91bmRFeGNlcHRpb24sIHRoaXMgbWVhbnMgdGhlIHByb2ZpbGUgaGFzIGJlZW4gZGVsZXRlZCAob3IgbmV2ZXIgZXhpc3RlZCknKTtcbiAgICAgICAgcmV0dXJuICdOT1RfRk9VTkQnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZyh7IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvciB9KTtcbiAgICAgIHRocm93IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvcjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==