import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IPublicKey } from './public-key';
/**
 * Represents a Key Group
 */
export interface IKeyGroup extends IResource {
    /**
     * The ID of the key group.
     * @attribute
     */
    readonly keyGroupId: string;
}
/**
 * Properties for creating a Public Key
 */
export interface KeyGroupProps {
    /**
     * A name to identify the key group.
     * @default - generated from the `id`
     */
    readonly keyGroupName?: string;
    /**
     * A comment to describe the key group.
     * @default - no comment
     */
    readonly comment?: string;
    /**
     * A list of public keys to add to the key group.
     */
    readonly items: IPublicKey[];
}
/**
 * A Key Group configuration
 *
 * @resource AWS::CloudFront::KeyGroup
 */
export declare class KeyGroup extends Resource implements IKeyGroup {
    /** Imports a Key Group from its id. */
    static fromKeyGroupId(scope: Construct, id: string, keyGroupId: string): IKeyGroup;
    readonly keyGroupId: string;
    constructor(scope: Construct, id: string, props: KeyGroupProps);
    private generateName;
}
