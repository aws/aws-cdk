import * as iam from '@aws-cdk/aws-iam';
import { ActionArtifactBounds, ActionCategory, ActionConfig, IAction } from '../action';
import { Artifact } from '../artifact';
export interface FullActionDescriptorProps {
    readonly action: IAction;
    readonly actionConfig: ActionConfig;
    readonly actionRole: iam.IRole | undefined;
    readonly actionRegion: string | undefined;
}
/**
 * This class is private to the aws-codepipeline package.
 */
export declare class FullActionDescriptor {
    readonly action: IAction;
    readonly actionName: string;
    readonly category: ActionCategory;
    readonly owner: string;
    readonly provider: string;
    readonly version: string;
    readonly runOrder: number;
    readonly artifactBounds: ActionArtifactBounds;
    readonly namespace?: string;
    readonly inputs: Artifact[];
    readonly outputs: Artifact[];
    readonly region?: string;
    readonly role?: iam.IRole;
    readonly configuration: any;
    constructor(props: FullActionDescriptorProps);
}
