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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhcmdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEscUNBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUV4QixNQUFhLDZCQUE4QixTQUFRLHdCQUFlO0lBQ3RELEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFakgsTUFBTSxvQkFBb0IsR0FBeUM7WUFDakUsa0JBQWtCO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNO1NBQ3hDLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sNEJBQTRCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDakQsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFFRCxPQUFPO1lBQ0wsa0JBQWtCLEVBQUUsNEJBQTRCLENBQUMsY0FBYyxDQUFDLGtCQUFrQjtZQUNsRixJQUFJLEVBQUU7Z0JBQ0osaUJBQWlCLEVBQUUsNEJBQTRCLENBQUMsY0FBYyxDQUFDLGlCQUFpQjthQUNqRjtTQUNGLENBQUM7S0FDSDtJQUVTLEtBQUssQ0FBQyxRQUFRO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFD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QUFFLENBQUM7WUFDMUMsSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUUsQ0FBQztnQkFDckUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnR0FBZ0csQ0FBQyxDQUFDO2dCQUMzRyxPQUFPLFdBQVcsQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDJCQUEyQixFQUFFLENBQUMsQ0FBQztZQUMxQyxNQUFNLDJCQUEyQixDQUFDO1FBQ3BDLENBQUM7S0FDRjtDQUNGO0FBakhELHNFQWlIQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIEVLUyBmcm9tICdAYXdzLXNkay9jbGllbnQtZWtzJztcbmltcG9ydCB7IFJlc291cmNlSGFuZGxlciB9IGZyb20gJy4vY29tbW9uJztcblxuY29uc3QgTUFYX05BTUVfTEVOID0gNjM7XG5cbmV4cG9ydCBjbGFzcyBGYXJnYXRlUHJvZmlsZVJlc291cmNlSGFuZGxlciBleHRlbmRzIFJlc291cmNlSGFuZGxlciB7XG4gIHByb3RlY3RlZCBhc3luYyBvbkNyZWF0ZSgpIHtcbiAgICBjb25zdCBmYXJnYXRlUHJvZmlsZU5hbWUgPSB0aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcuZmFyZ2F0ZVByb2ZpbGVOYW1lID8/IHRoaXMuZ2VuZXJhdGVQcm9maWxlTmFtZSgpO1xuXG4gICAgY29uc3QgY3JlYXRlRmFyZ2F0ZVByb2ZpbGU6IEVLUy5DcmVhdGVGYXJnYXRlUHJvZmlsZUNvbW1hbmRJbnB1dCA9IHtcbiAgICAgIGZhcmdhdGVQcm9maWxlTmFtZSxcbiAgICAgIC4uLnRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNvbmZpZyxcbiAgICB9O1xuXG4gICAgdGhpcy5sb2coeyBjcmVhdGVGYXJnYXRlUHJvZmlsZSB9KTtcbiAgICBjb25zdCBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuY3JlYXRlRmFyZ2F0ZVByb2ZpbGUoY3JlYXRlRmFyZ2F0ZVByb2ZpbGUpO1xuICAgIHRoaXMubG9nKHsgY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZSB9KTtcblxuICAgIGlmICghY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIENyZWF0ZUZhcmdhdGVQcm9maWxlIHJlc3BvbnNlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogY3JlYXRlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZS5mYXJnYXRlUHJvZmlsZS5mYXJnYXRlUHJvZmlsZU5hbWUsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIGZhcmdhdGVQcm9maWxlQXJuOiBjcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlLmZhcmdhdGVQcm9maWxlLmZhcmdhdGVQcm9maWxlQXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uRGVsZXRlKCkge1xuICAgIGlmICghdGhpcy5waHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGRlbGV0ZSBhIHByb2ZpbGUgd2l0aG91dCBhIHBoeXNpY2FsIGlkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVsZXRlRmFyZ2F0ZVByb2ZpbGU6IEVLUy5EZWxldGVGYXJnYXRlUHJvZmlsZUNvbW1hbmRJbnB1dCA9IHtcbiAgICAgIGNsdXN0ZXJOYW1lOiB0aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcuY2x1c3Rlck5hbWUsXG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6IHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgIH07XG5cbiAgICB0aGlzLmxvZyh7IGRlbGV0ZUZhcmdhdGVQcm9maWxlIH0pO1xuICAgIGNvbnN0IGRlbGV0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5kZWxldGVGYXJnYXRlUHJvZmlsZShkZWxldGVGYXJnYXRlUHJvZmlsZSk7XG4gICAgdGhpcy5sb2coeyBkZWxldGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uVXBkYXRlKCkge1xuICAgIC8vIGFsbCB1cGRhdGVzIHJlcXVpcmUgYSByZXBsYWNlbWVudC4gYXMgbG9uZyBhcyBuYW1lIGlzIGdlbmVyYXRlZCwgd2UgYXJlXG4gICAgLy8gZ29vZC4gaWYgbmFtZSBpcyBleHBsaWNpdCwgdXBkYXRlIHdpbGwgZmFpbCwgd2hpY2ggaXMgY29tbW9uIHdoZW4gdHJ5aW5nXG4gICAgLy8gdG8gcmVwbGFjZSBjZm4gcmVzb3VyY2VzIHdpdGggZXhwbGljaXQgcGh5c2ljYWwgbmFtZXNcbiAgICByZXR1cm4gdGhpcy5vbkNyZWF0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzQ3JlYXRlQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNVcGRhdGVDb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzVXBkYXRlQ29tcGxldGUoKSB7XG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5xdWVyeVN0YXR1cygpO1xuICAgIHJldHVybiB7XG4gICAgICBJc0NvbXBsZXRlOiBzdGF0dXMgPT09ICdBQ1RJVkUnLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNEZWxldGVDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLnF1ZXJ5U3RhdHVzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIElzQ29tcGxldGU6IHN0YXR1cyA9PT0gJ05PVF9GT1VORCcsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBmYXJnYXRlIHByb2ZpbGUgbmFtZS5cbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVQcm9maWxlTmFtZSgpIHtcbiAgICBjb25zdCBzdWZmaXggPSB0aGlzLnJlcXVlc3RJZC5yZXBsYWNlKC8tL2csICcnKTsgLy8gMzIgY2hhcnNcbiAgICBjb25zdCBvZmZzZXQgPSBNQVhfTkFNRV9MRU4gLSBzdWZmaXgubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBwcmVmaXggPSB0aGlzLmxvZ2ljYWxSZXNvdXJjZUlkLnNsaWNlKDAsIG9mZnNldCA+IDAgPyBvZmZzZXQgOiAwKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke3N1ZmZpeH1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFF1ZXJpZXMgdGhlIEZhcmdhdGUgcHJvZmlsZSdzIGN1cnJlbnQgc3RhdHVzIGFuZCByZXR1cm5zIHRoZSBzdGF0dXMgb3JcbiAgICogTk9UX0ZPVU5EIGlmIHRoZSBwcm9maWxlIGRvZXNuJ3QgZXhpc3QgKGkuZS4gaXQgaGFzIGJlZW4gZGVsZXRlZCkuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIHF1ZXJ5U3RhdHVzKCk6IFByb21pc2U8RUtTLkZhcmdhdGVQcm9maWxlU3RhdHVzIHwgJ05PVF9GT1VORCcgfCBzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgICBpZiAoIXRoaXMucGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBkZXRlcm1pbmUgc3RhdHVzIGZvciBmYXJnYXRlIHByb2ZpbGUgd2l0aG91dCBhIHJlc291cmNlIG5hbWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZXNjcmliZUZhcmdhdGVQcm9maWxlOiBFS1MuRGVzY3JpYmVGYXJnYXRlUHJvZmlsZUNvbW1hbmRJbnB1dCA9IHtcbiAgICAgIGNsdXN0ZXJOYW1lOiB0aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Db25maWcuY2x1c3Rlck5hbWUsXG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6IHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgIH07XG5cbiAgICB0cnkge1xuXG4gICAgICB0aGlzLmxvZyh7IGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUgfSk7XG4gICAgICBjb25zdCBkZXNjcmliZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUZhcmdhdGVQcm9maWxlKGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGUpO1xuICAgICAgdGhpcy5sb2coeyBkZXNjcmliZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UgfSk7XG4gICAgICBjb25zdCBzdGF0dXMgPSBkZXNjcmliZUZhcmdhdGVQcm9maWxlUmVzcG9uc2UuZmFyZ2F0ZVByb2ZpbGU/LnN0YXR1cztcblxuICAgICAgaWYgKHN0YXR1cyA9PT0gJ0NSRUFURV9GQUlMRUQnIHx8IHN0YXR1cyA9PT0gJ0RFTEVURV9GQUlMRUQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0gY2F0Y2ggKGRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVFcnJvcjogYW55KSB7XG4gICAgICBpZiAoZGVzY3JpYmVGYXJnYXRlUHJvZmlsZUVycm9yLm5hbWUgPT09ICdSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uJykge1xuICAgICAgICB0aGlzLmxvZygncmVjZWl2ZWQgUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbiwgdGhpcyBtZWFucyB0aGUgcHJvZmlsZSBoYXMgYmVlbiBkZWxldGVkIChvciBuZXZlciBleGlzdGVkKScpO1xuICAgICAgICByZXR1cm4gJ05PVF9GT1VORCc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nKHsgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZUVycm9yIH0pO1xuICAgICAgdGhyb3cgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZUVycm9yO1xuICAgIH1cbiAgfVxufVxuIl19