import { ResourceHandler } from './common';
export declare class FargateProfileResourceHandler extends ResourceHandler {
    protected onCreate(): Promise<{
        PhysicalResourceId: string | undefined;
        Data: {
            fargateProfileArn: string | undefined;
        };
    }>;
    protected onDelete(): Promise<void>;
    protected onUpdate(): Promise<{
        PhysicalResourceId: string | undefined;
        Data: {
            fargateProfileArn: string | undefined;
        };
    }>;
    protected isCreateComplete(): Promise<{
        IsComplete: boolean;
    }>;
    protected isUpdateComplete(): Promise<{
        IsComplete: boolean;
    }>;
    protected isDeleteComplete(): Promise<{
        IsComplete: boolean;
    }>;
    /**
     * Generates a fargate profile name.
     */
    private generateProfileName;
    /**
     * Queries the Fargate profile's current status and returns the status or
     * NOT_FOUND if the profile doesn't exist (i.e. it has been deleted).
     */
    private queryStatus;
}
