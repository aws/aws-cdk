import { IsCompleteResponse, OnEventResponse } from '../../../custom-resources/lib/provider-framework/types';
import { EksClient, ResourceEvent, ResourceHandler } from './common';
export declare class ClusterResourceHandler extends ResourceHandler {
    get clusterName(): string;
    private readonly newProps;
    private readonly oldProps;
    constructor(eks: EksClient, event: ResourceEvent);
    protected onCreate(): Promise<OnEventResponse>;
    protected isCreateComplete(): Promise<IsCompleteResponse>;
    protected onDelete(): Promise<OnEventResponse>;
    protected isDeleteComplete(): Promise<IsCompleteResponse>;
    protected onUpdate(): Promise<OnEventResponse | {
        EksUpdateId: string | undefined;
    } | undefined>;
    protected isUpdateComplete(): Promise<IsCompleteResponse>;
    private updateClusterVersion;
    private isActive;
    private isEksUpdateComplete;
    private generateClusterName;
}
